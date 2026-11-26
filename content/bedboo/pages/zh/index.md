# bedboo

用 mineflayer API 编写基岩版机器人：你的 mineflayer 机器人及插件无需修改即可加入基岩版专用服务器（BDS）。

bedboo 是一个兼容 mineflayer API 的 Minecraft 基岩版机器人库。它提供与 [mineflayer](https://github.com/PrismarineJS/mineflayer) 4.39.0 一致的 `createBot()`、`bot.*` 属性、方法和事件、TypeScript 类型以及插件系统，底层则通过 [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol) 与**基岩版专用服务器**（BDS）通信。为 mineflayer 编写的机器人代码（包括 mineflayer-pathfinder 等生态插件）都可以直接在 BDS 上运行。

```js
const bedboo = require('bedboo') // 替代 require('mineflayer')

const bot = bedboo.createBot({ host: '127.0.0.1', port: 19132, username: 'Bot', auth: 'offline' })
bot.on('chat', (username, message) => {
  if (username !== bot.username) bot.chat(message)
})
```

::: tip 从这里开始
第一次用 bedboo？教程[你的第一个 bedboo 机器人](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)会带你获取代码、准备服务器，并连接一个能走到你身边的机器人。
:::

## 功能 {#features}

- **mineflayer API。** 提供与 mineflayer 4.39.0 完全一致的 `createBot()`、所有 `bot.*` 属性、方法、事件以及 TypeScript 类型，参数、错误和事件顺序也完全相同（[API](reference/api.md)）。
- **插件无需修改。** mineflayer-pathfinder、-pvp、-collectblock、-tool、-armor-manager 和 -auto-eat 可通过 `bot.loadPlugin()` 加载，在基岩版上照常工作（[生态插件](guide/plugins.md)）。
- **RakNet 与 NetherNet。** 支持通过 RakNet 或 NetherNet，使用离线模式或 Microsoft 账号加入 1.26.42.1 至 1.26.63.1 的所有稳定版 BDS（共 4 个协议族）（[连接服务器](guide/connecting.md)）。
- **差异逐条记录。** 基岩版方块名称、服务端权威的物品栏、挖掘与移动——Java 版与基岩版之间的每一处固有差异都有文档说明（[基岩版差异](reference/differences/index.md)）。
- **驱动真实客户端。** 指定 `transport: 'bedd'` 时，同一份脚本即可驱动由 Be.D.D. 托管的真实 Minecraft 基岩版客户端（[驱动真实客户端](guide/bedd.md)）。
- **内置生存智能体。** `@bedboo/agent` 能玩生存模式：从砍树一路发展到挖钻石，还会建造和战斗，全程仅调用公开 API（[生存智能体](guide/agent.md)）。

## 给谁用

- **mineflayer 用户**：想让现有机器人和插件进入基岩版服务器；mineflayer 的文档、示例和插件都可以原样沿用。
- **服务器和模组作者**：用脚本化的玩家测试 BDS（或 [LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) 服务器）。
- **客户端模组作者**：通过 [Be.D.D.](guide/bedd.md) 用同一套机器人代码驱动真实的 Minecraft 客户端。

## 为什么

mineflayer 是用 JavaScript 编写 Minecraft 机器人的常用工具，拥有庞大的插件生态，但它面向的是 Java 版。基岩版使用不同的协议、不同的方块和物品 ID、服务端权威的物品栏与方块破坏，以及独立的移动物理机制，导致 Java 版机器人及插件无法加入基岩版服务器。bedboo 在不引入新 API 的前提下填补了这一空白。

唯一的区别在于 Java 版与基岩版之间的固有差异：基岩版的方块和物品名称、无队伍系统、服务端权威的物品栏和方块破坏等。这些差异均列在[基岩版差异](reference/differences/index.md)中。

## 支持范围

- **服务器：** 1.26.42.1（2026 年 8 月 7 日）至 1.26.63.1（2026 年 11 月 6 日）的所有稳定版 BDS，涵盖 4 个协议族：1.26.40（protocol 2168）、1.26.45（2169）、1.26.51（2193，默认）和 1.26.60（2225）。`createBot({ version })` 接受协议族或 BDS 版本；`bot.version` 为协议族。详见[支持的版本](reference/versions/index.md)。
- **传输层：** 默认使用 RakNet；传入 `transport: 'nethernet'` 时使用 NetherNet（BDS 的默认传输层）（[连接服务器](guide/connecting.md#transports)）。
- **认证：** `auth: 'offline'`（默认）用于 `online-mode=false` 的服务器，`auth: 'microsoft'` 用于 Xbox Live。
- **真实客户端：** 传入 `transport: 'bedd'` 可改为驱动由 [Be.D.D.](guide/bedd.md) 托管的真实基岩版客户端。
- **运行时：** Node.js 24 或更高版本。RakNet 需要 x64 架构（raknet-native 仅提供 x64 预编译包）；NetherNet 为纯 JavaScript 实现。

## 在生态里的位置

| 项目 | 作用 |
|---|---|
| [mineflayer](https://github.com/PrismarineJS/mineflayer) | bedboo 实现的 API，也是其插件的来源 |
| [Be.D.D.](https://levimc.org/zh-Hans/BeDD/) | 托管真实的 Minecraft 基岩版客户端，bedboo 用 `transport: 'bedd'` 驱动它（[指南](guide/bedd.md)） |
| [LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) | BDS 和客户端的模组加载器：LeviLamina 服务器本质上就是 BDS，bedboo 可照常加入 |

## 构建方式

- 使用 [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol) 建立连接（RakNet 基于 raknet-native，NetherNet 基于 [node-nethernet](https://github.com/PrismarineJS/node-nethernet)），并使用 prismarine-auth 登录 Xbox Live；
- 复用 prismarine-* 系列库（block、chat、chunk、entity、item、nbt、recipe、registry、windows、world）和 [minecraft-data](https://github.com/PrismarineJS/minecraft-data)，并以 `@bedboo/bedrock-data` 作为基岩版数据补充层（每个协议族一份）；
- 采用从 prismarine-physics 分叉而来的基岩版移动引擎；
- 移植 mineflayer 的内置插件，每个插件对应一个改编文件，并各自保留原有的署名头。

针对这些依赖的小修补以 pnpm 补丁形式存放在仓库的 `patches/` 目录中，因此目前需要在 bedboo 的 monorepo 内使用它（具体做法见[教程](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)）。[bedboo 的工作方式](concepts/how-bedboo-works.md)解释了这些部分是如何协同工作的。

## 包

bedboo 需要从其仓库检出后使用，详见[安装](install.md)。

| 包 | |
|---|---|
| `bedboo` | 库本体 |
| `@bedboo/bedrock-data` | minecraft-data 的基岩版数据补充层，每个支持的协议族一份 |
| `@bedboo/agent` | 基于 bedboo 的脚本化生存智能体（[生存智能体](guide/agent.md)） |

## 名字

bedboo（Bedrock + Bangboo）得名自《绝区零》中的邦布：邦布替绳匠深入空洞，你的机器人替你进入基岩版服务器。

## 本站内容 {#on-this-site}

- **指南**：[连接服务器](guide/connecting.md)（服务器设置、版本、账号、传输层）、[生态插件](guide/plugins.md)、用 Be.D.D. [驱动真实客户端](guide/bedd.md)和[生存智能体](guide/agent.md)。要从零开始编写第一个机器人，请看教程[你的第一个 bedboo 机器人](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)。
- **概念**：[bedboo 的工作方式](concepts/how-bedboo-works.md)（mineflayer API 之下的各个层次）和[服务端权威](concepts/server-authority.md)（bedboo 如何在基岩版服务端权威的移动、物品栏和挖掘机制之上保留这套 API）。
- **参考**：[API](reference/api.md)、按主题划分的[基岩版差异](reference/differences/index.md)、[BDS 备忘](reference/bds.md)和[支持的版本](reference/versions/index.md)。
