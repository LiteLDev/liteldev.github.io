# bedboo 的工作方式

bedboo 就是去掉了 Java 版部分、换上基岩版部分的 mineflayer。机器人看到的仍是 mineflayer 的 API；而在其底层，连接、游戏数据、实现 `bot.*` 的插件和物理引擎全部换成了基岩版。本页介绍这些层次，以及机器人的一次调用如何逐层穿过它们。每一层与 Java 版的具体差异详见[基岩版差异](../reference/differences/index.md)。

## 层次 {#layers}

```text
你的脚本、生态插件（pathfinder、pvp……）
        │  mineflayer API：createBot()、bot.*、事件
        ▼
bedboo 的插件（每个 mineflayer 插件一个文件）  ── bot.registry（minecraft-data + @bedboo/bedrock-data）
        │  基岩版数据包                          ── bot._bedrock（输入队列、生命周期、item stack request……）
        ▼
bot._client
        ├── 基于 RakNet 的 bedrock-protocol（raknet-native）     transport: 'raknet'，默认 ──┐
        ├── 基于 NetherNet 的 bedrock-protocol（node-nethernet） transport: 'nethernet' ─────┤
        └── 由 Be.D.D. 托管的真实客户端                          transport: 'bedd' ──────────┤
                                                                                             ▼
                                                                                  基岩版专用服务器（BDS）
```

## createBot 与插件 {#plugins}

`createBot()` 是改编自 mineflayer 的加载器（`lib/loader.js`）：选项、插件选择方式和事件顺序均保持一致，只是将 minecraft-protocol 替换成了 bedrock-protocol 客户端。`bot.loadPlugin()` 则沿用 mineflayer 自身的插件加载器，因此生态插件无需修改即可加载。

内部插件构成了 `bot.*`。mineflayer 4.39.0 的全部 41 个插件名（`blocks`、`chat`、`digging`、`entities`、`inventory`、`physics`……）在 bedboo 中都有对应文件，此外还增加了 `abilities`（来自 mineflayer 的 master 分支）和 `sign`（编辑告示牌，从 `blocks` 中拆出）。每个文件都改编自 mineflayer 的同名文件并保留了署名头：参数检查、返回值、错误消息和事件仍与 mineflayer 一致，只是把 Java 版数据包换成了基岩版数据包。因此，`options.plugins` 和 `loadInternalPlugins` 仍按与 mineflayer 相同的名字选择插件。

## 连接 {#connection}

bedboo 通过 [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol) 建立连接，由它处理登录、加密和各版本的数据包格式。`transport` 选项决定由什么来承载数据包：

- **RakNet**（`'raknet'`，默认），基于 raknet-native。BDS 需要以 `transport=raknet` 运行。
- **NetherNet**（`'nethernet'`），基于 [node-nethernet](https://github.com/PrismarineJS/node-nethernet)：使用 WebRTC 数据通道，从 1.26.51 起成为 BDS 的默认传输层。信令默认通过服务器端口上的 HTTP 进行。
- **真实客户端**（`'bedd'`）：bedboo 自身不连接服务器。由 [Be.D.D.](https://levimc.org/zh-Hans/BeDD/) 托管的 Minecraft 客户端已经进入世界，bedboo 读取该客户端收发的每个数据包，并将自己原本要发送的内容转换为对该客户端的控制请求（详见[工作方式](../guide/bedd.md#how-it-works)）。

三种方式下机器人的 API 完全相同。选择和配置方式见[连接服务器](../guide/connecting.md#transports)。

## 版本与游戏数据 {#data}

基岩版的版本按**协议族**分组：同一协议族下的所有 BDS 版本使用相同的网络协议，共享同一套游戏数据。bedboo 支持 4 个协议族：`1.26.40`、`1.26.45`、`1.26.51`（默认）和 `1.26.60`；`bot.version` 的值即为协议族（详见[支持的版本](../reference/versions/index.md)）。bedboo 不会探测服务器版本，面向其他协议族的机器人需要在 `createBot({ version })` 中显式指明。

游戏数据（方块、方块状态、物品、实体、效果、生物群系、碰撞箱、食物……）来自 [minecraft-data](https://github.com/PrismarineJS/minecraft-data)，并由 `@bedboo/bedrock-data` 补充：每个协议族对应一个 `data/<协议族>/` 目录，其中的数据集会替换 minecraft-data 中 `bedrock_<协议族>` 的对应数据集。加载这一补充层是 `require('bedboo')` 执行的第一步，早于 bedrock-protocol 或任何 prismarine 库读取基岩版数据。bedboo 还遵循 mineflayer 文档的约定，让 `require('minecraft-data')(bot.version)` 返回基岩版数据，从而保证 prismarine-physics 的 `PlayerState` 等代码能够正常工作。

`bot.registry` 在收到第一个数据包前就由这些数据构建完成，随后再由服务器补全：`start_game` 提供方块的运行时 ID（在 BDS 上是方块状态的哈希），`item_registry` 提供物品的网络 ID。因此，名称和 ID 均为基岩版格式（如 `wooden_door`、`lit_furnace`……），详见[名称、ID 与数据](../reference/differences/data.md)。

## 基岩版状态 {#bedrock-state}

基岩版需要维护一些 Java 版没有、且由多个插件共享的状态。这些状态存放在 `bot._bedrock` 中（仅供内部使用，可能变动）：

- `input`：tick 时钟与 `player_auth_input` 队列，机器人会在每个 tick 发送该数据包（详见[服务端权威](server-authority.md#input)）；
- `lifecycle`：处理加入、重生和维度切换，是唯一发出 `spawn` 事件的地方；
- `stackRequests` 和 `windows`：item stack request，以及映射到 Java 版窗口类型的基岩版容器；
- `ids`：实体的运行时 ID 与唯一 ID、物品的网络 ID。

机器人在基岩版上可能用到、而在 mineflayer 中没有对应项的功能（游戏规则、方块变体、物品栏重新同步、BeDD 的能力），统一公开在 `bot.bedrock` 下，绝不会作为新的顶层 `bot` 成员出现。详见 [API](../reference/api.md#bedrock-extras)。

## 移动 {#movement}

physics 插件运行一个从 prismarine-physics 分叉出来的移动引擎（`lib/physics/`）。它保留了原有的模块结构和 `bot.physics` 字段名，以便 mineflayer-pathfinder 用它模拟移动；但内部实现的是基岩版的移动规则（台阶高度、摩擦、跳跃、攀爬、液体……），并经过反复拟合，直至能复现服务器自身的模拟结果（详见[移动与物理](../reference/differences/movement.md#engine)）。在基岩版中，服务器会校验每一次移动，详见[服务端权威](server-authority.md#movement)。

## 依赖与补丁 {#patches}

针对依赖项（bedrock-protocol、node-nethernet、raknet-native、prismarine 系列库）的少量修复，以及对生态插件中 Java 版假设的改动，都以 `pnpm patch` 的形式存放在仓库的 `patches/` 目录中。`pnpm-workspace.yaml` 中的 `overrides` 确保所有包都加载同一份打过补丁的副本。这就是目前需要在 bedboo 的 monorepo 内使用它的原因（具体做法见[教程](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)），也是在 monorepo 之外使用生态插件时同样需要这些补丁的原因（详见[生态插件](../guide/plugins.md)和[生态插件补丁](../reference/differences/plugins.md)）。

仓库包含三个包：`bedboo`（库本体）、`@bedboo/bedrock-data`（数据补充层）和 `@bedboo/agent`（基于 bedboo 的[生存智能体](../guide/agent.md)）。
