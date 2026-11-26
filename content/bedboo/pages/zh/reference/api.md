# API

**bedboo 的 API 就是 mineflayer 的 API。** mineflayer 4.39.0 [API 参考](https://github.com/PrismarineJS/mineflayer/blob/4.39.0/docs/api.md)中记录的所有类、属性、方法和事件均一应俱全，其名称、参数、返回值、错误消息和事件顺序完全一致。bedboo 的 TypeScript 类型定义（`index.d.ts`）也直接沿用了 mineflayer 的定义，仅替换了底层的协议客户端。完整 API 请查阅上游文档，本页仅列出有差异或新增的内容。由基岩版自身特性引起的行为差异，请参阅[基岩版差异](differences/index.md)。

## 模块导出 {#module-exports}

`require('bedboo')` 与 `require('mineflayer')` 的导出内容相同：

| 导出 | 值 |
|---|---|
| `createBot(options)` | 见[下文](#createbot-options) |
| `Location`、`Painting`、`ScoreBoard`、`BossBar` | mineflayer 原生类，未作修改 |
| `Particle` | 针对基岩版粒子数据包做了扩展的 mineflayer 类（[粒子](differences/chat.md#particles)） |
| `latestSupportedVersion`、`oldestSupportedVersion` | `'1.26.60'`、`'1.26.40'` |
| `testedVersions` | `['1.26.40', '1.26.45', '1.26.51', '1.26.60']`，已测试的协议族，按从旧到新排列（[支持的版本](versions/index.md)） |
| `supportFeature(feature, version)` | 根据基岩版特性表返回结果（[特性表](differences/data.md#feature-table)） |

## createBot 选项 {#createbot-options}

`createBot(options)` 同时支持 mineflayer 的选项与 bedrock-protocol 的 [`ClientOptions`](https://github.com/PrismarineJS/bedrock-protocol/blob/master/docs/API.md)（`index.d.ts` 中的 `BotOptions` 继承了这两者）。为适配基岩版，部分选项的默认值有所调整：

| 选项 | 默认值 | |
|---|---|---|
| `host` | `'127.0.0.1'` | BDS 地址 |
| `port` | `19132` | BDS 的 `server-port`（RakNet 使用 UDP，NetherNet 使用 TCP + UDP） |
| `username` | `'Player'` | 离线模式下为玩家名；microsoft 模式下为令牌缓存的键（游戏内名称为玩家代号 gamertag） |
| `auth` | `'offline'` | `'offline'`（不使用 Xbox Live，服务器需设置 `online-mode=false`）或 `'microsoft'`（通过 prismarine-auth 登录 Xbox Live：`profilesFolder`、`onMsaCode`、`authTitle`、`flow`、`deviceType` 均与 mineflayer 相同）。传入 `'mojang'` 会抛出错误。 |
| `version` | `'1.26.51'`（`transport: 'bedd'` 时为 `'1.26.60'`） | 已测试的协议族（如 `'1.26.60'`）或其包含的任意 BDS 版本（如 `'1.26.62.1'`）；设为 `false`（自动）时固定使用 1.26.51（不检测服务器版本）；传入其他任何值都会抛出 `ERR_BEDBOO_VERSION`（[支持的版本](versions/index.md#choosing)） |
| `transport` | `'raknet'` | `'nethernet'` 表示使用 NetherNet（[传输层](differences/connection.md#transport)）；`'bedd'` 表示驱动真实客户端（[BeDD](../guide/bedd.md#options)） |
| `nethernet` | `{ signalling: 'http' }` | 仅限 NetherNet：`signalling`（`'http'` = 服务器端口上的 HTTP，`'lan'` = UDP 7551 发现，`'services'` = Xbox）、`url`（信令源，默认 `http://host:port`）、`serverKey`（服务器身份密钥的 `'sha256:<hex>'` 固定值）、`onServerKey(fingerprint, url) → boolean`（用于批准未固定的密钥，默认接受任意密钥）、`networkId`、`webrtcBackend`、`signallingConnectTimeout` |
| `bedd` | | 仅限 `transport: 'bedd'`：`url` + `token`、`pid` 或 `instance`（指定 BeDD 游戏，`{}` 表示唯一正在运行的游戏）、`home`、`timeoutMs`、`joinTimeoutMs`、`modules`（[BeDD 选项](../guide/bedd.md#options)）；设置 `host` / `port` 会让真实客户端先加入对应服务器 |
| `raknetBackend` | `'raknet-native'` | BDS 会拒绝 `'jsp-raknet'`（RakNet 协议 10 与 11 不兼容） |
| `skipPing` | `true` | 关闭局域网可见性的 BDS 不会响应 ping |
| `conLog` | `null` | bedrock-protocol 的控制台日志函数（设为 `console.log` 可输出连接消息） |
| `viewDistance` | `'far'` | mineflayer 的视距名称或区块数；通过 `request_chunk_radius` 发送 |
| `maxCatchupTicks` | `4` | *新增：* 发生卡顿后，机器人单次最多补发的 `player_auth_input` tick 数量 |
| `respawn`、`physicsEnabled`、`plugins`、`loadInternalPlugins`、`chat`、`colorsEnabled`、`hideErrors`、`logErrors`、`defaultChatPatterns`、`chatLengthLimit`、`mainHand`、`client`、`brand` | 与 mineflayer 相同 | `client`：任意 bedrock-protocol `Client` 实例（`createClient` 的返回值）；`brand` 会被忽略（基岩版没有 brand 通道） |

## 基岩版扩展：`bot.bedrock` {#bedrock-extras}

基岩版独有的扩展功能全部集中在 `bot.bedrock` 命名空间下，不会直接在 `bot` 顶层添加新成员。其类型定义位于 `types/bedrock.d.ts`（`BedrockExtras`）：

| 成员 | 类型 | |
|---|---|---|
| `bot.bedrock.gameRules` | `{ [name: string]: boolean \| number }` | 服务器游戏规则，以基岩版规则名称为键（如 `doDayLightCycle`、`keepInventory`、`randomTickSpeed` 等），数据来自 `start_game` 和 `game_rules_changed` 数据包（[游戏规则](differences/world.md#game-rules)） |
| `bot.bedrock.blockVariants(block)` | `(block: string \| number) => number[]` | 返回同属一种方块的所有基岩版方块变体 ID（Java 版将这些变体建模为“单一方块 + 不同状态”）。例如燃烧中的熔炉在基岩版中是独立的 `lit_furnace`，使用 `bot.findBlock({ matching: bot.bedrock.blockVariants('furnace') })` 可同时匹配这两种状态的熔炉（[方块变体](differences/world.md#block-variants)） |
| `bot.bedrock.resyncInventory()` | `() => Promise<boolean>` | 向服务器请求玩家物品栏（包括背包、盔甲栏、光标和副手）的最新数据；同步完成后解析为 `true`，若 2 秒内无响应则解析为 `false`。当机器人检测到槽位数据过期时，会自动触发此操作（[物品栏重新同步](differences/inventory.md#inventory-resync)） |
| `bot.bedrock.bedd` | `{ caps, supports(name), sendAllow, screens, observed } \| undefined` | 仅在 `transport: 'bedd'`（通过 Be.D.D. 托管真实客户端）时存在：`caps` 将各项 BeDD 操作映射为 `'present'`、`'disabled'` 或 `'absent'`；`supports(name)` 判断指定的机器人 API（如 `'dig'`、`'craft'` 等）在当前可用操作下是否受支持。若调用物品堆叠或界面相关的 API（如 `clickWindow`、`craft`、从快捷栏以外的槽位 `equip`、`creative`、`writeBook`、`updateSign` 等）时缺少底层所需的 BeDD 操作，则会抛出或拒绝并返回 `BeddUnsupportedError`（包含 `code: 'ERR_BEDD_UNSUPPORTED'`、`feature`、`missing`）。`sendAllow`：BeDD 的 `send` 操作所允许的数据包 ID 列表；`screens`：通过 BeDD 的 `ui` 操作点击客户端界面或输入文本（[BeDD](../guide/bedd.md#screens)） |
| `bot.bedrock.bedd.observed` | `{ yaw: number, pitch: number, tick: number \| null } \| null` | 仅限 transport `'bedd'`：真实客户端最近一次发送的 `player_auth_input` 中的朝向（基岩版角度）和 tick，在首次发送前为 `null`。`bot.entity` 也同步跟随该回显数据（[自身状态](differences/bedd.md#self-state-from-echo)） |

## 内部实现 {#internals}

以下属性不属于公开 API（随时可能变动），但可用于调试：

- `bot._client`：bedrock-protocol 的 `Client` 实例（提供 `on(packetName, …)`、`queue`、`write` 等接口；数据包名称和字段均采用基岩版格式，详见[协议文档](https://prismarinejs.github.io/minecraft-data/?v=bedrock_1.26.51&d=protocol)）。
- `bot._bedrock`：供内部各插件共享的基岩版状态（如输入队列、生命周期、物品堆叠请求、窗口状态等）。
