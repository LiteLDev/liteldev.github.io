# 连接与版本

本文介绍 bedboo 如何连接 Bedrock 服务器、支持哪些版本，以及加入、出生和维度切换如何对应到 mineflayer 的事件。观察环境为
BDS 1.26.51.1（protocol 2193）与 bedrock-protocol 3.60.1。

## 版本  {#versions}

- **影响：** `bot.version`、`bot.majorVersion`、`bot.protocolVersion`，导出项 `testedVersions`、
  `latestSupportedVersion`、`oldestSupportedVersion`、`supportFeature(feature, version)`。
- **Java：** Java 版本号（'1.21.4'，protocol 769），同时支持多个版本。
- **Bedrock：** Bedrock 协议族（minecraft-data 版本键，如 '1.26.51'，对应一个协议号和多个 BDS 版本）；bedboo 支持近期的稳定版本。
- **bedboo：** `bot.version` 为协议族（`'1.26.51'`），`majorVersion = '1.26'`，`protocolVersion` 为对应的协议号（2193）；
  `testedVersions` 列出 `@bedboo/bedrock-data` 提供数据的所有协议族（`'1.26.40'`、`'1.26.45'`、`'1.26.51'`、`'1.26.60'`；各协议族对应的 BDS 版本见[支持的版本](../versions/index.md)，
  1.26.40、1.26.45 与 1.26.60 的差异见 [Bedrock 1.26.40](../versions/1.26.40.md)、[Bedrock 1.26.45](../versions/1.26.45.md) 与
  [Bedrock 1.26.60](../versions/1.26.60.md)）。`createBot({ version })` 接受已测试的协议族、其中任一 BDS 版本（`'1.26.44.3'`）
  或 `false`（自动 = 1.26.51），传入其他值会像 mineflayer 一样抛出异常。模块级的 `supportFeature(feature, version)` 对已测试的
  协议族 / BDS 版本 / 'bedrock_' 键 / 未指定版本（1.26.51）直接查询 Bedrock [特性表](data.md#feature-table)，无需构建
  registry；其他版本则与上游一样查询 minecraft-data。

## 协议客户端与 `connect`  {#client}

- **影响：** `bot._client`、`connect` 事件，`createBot` 选项 `auth`、`host`、`port`、`profilesFolder`、`onMsaCode`。
- **Java：** minecraft-protocol 客户端；TCP socket 连上时触发 `connect`。
- **Bedrock：** bedrock-protocol 的 `Client`（RakNet）。没有 `connect` 事件：在 RakNet 连接和 network settings 完成、
  发送 login 包时触发 `loggingIn`。
- **bedboo：** `bot._client` 即 bedrock-protocol 客户端（`on`、`queue`、`write`）；`connect` 在 `loggingIn` 时触发一次。
  默认值：host 127.0.0.1、port 19132、RakNet（raknet-native）、`skipPing`、`conLog: null`。默认 `auth: 'offline'`；
  `auth: 'microsoft'` 通过 prismarine-auth 登录 Xbox Live（透传 `profilesFolder`、`onMsaCode`、`authTitle`、`flow`）；
  `auth: 'mojang'` 会抛出异常（Bedrock 没有 Mojang 账号）。显式传入的 bedrock-protocol `offline` 选项优先。参见
  [createBot 选项](../api.md#createbot-options)。

## 传输层：默认 RakNet，可选 NetherNet  {#transport}

- **影响：** `createBot` 选项 `transport`、`nethernet`；`bot._client.connection`。
- **Java：** 只有一种传输层（TCP，minecraft-protocol）。
- **Bedrock：** BDS 1.26.51 提供两种：
  - **NetherNet**（BDS 默认）：WebRTC data channel，信令可走 `server-port` TCP 上的 HTTP
    （`POST /v1/join/<network id>` 携带 SDP offer，返回签名的 SDP answer）、UDP 7551 上的局域网发现，或 Xbox 服务。
  - **RakNet**（`transport=raknet`）：迄今所有 Bedrock 版本使用的传输层。选用该传输层时 BDS 会打印
    `TRANSPORT TYPE ERROR` 横幅；Mojang 已宣布将其移除（BDS 1.26.60 至 1.26.63.1 仍提供）。

  NetherNet 服务器不会打开 RakNet 端口，反之亦然。
- **bedboo：** 默认 `transport: 'raknet'`（raknet-native）。除非 `nethernet.signalling` 指定为 `'lan'` / `'services'`，否则 `transport: 'nethernet'` 会通过 `host:port` 上的 HTTP 信令加入。
  尚未发布的 bedrock-protocol#831 和 node-nethernet#32 已通过
  `patches/bedrock-protocol@3.61.0.patch` 与 `patches/nethernet@1.1.2.patch` 移植回来（另加一条
  `packageExtensions`，用于补齐 nethernet 新增的 jsonwebtoken 依赖）。服务器用身份密钥对 answer 签名；由于纯 HTTP 无法验证该密钥的真实性，
  客户端默认直接接受，除非用 `nethernet.serverKey` 固定密钥（`'sha256:<hex of the DER SPKI>'`，不匹配时以
  `Untrusted Nethernet server key …` 拒绝），或交由 `nethernet.onServerKey(fingerprint, url)` 决定。这与 RakNet 的信任级别
  相同，因为 RakNet 的握手密钥同样没有固定。传输层之上的所有行为（数据包、插件、事件）完全一致。

## NetherNet：服务器端口的 TCP 也必须空闲  {#nethernet-port}

- **影响：** 以 `transport=nethernet` 运行的服务器。
- **Java：** 不适用。
- **Bedrock：** 使用 `transport=nethernet` 时，BDS 会在 TCP `server-port` 上开启 HTTP 信令监听，并输出
  `Accepting clients on [::]:<port>`。如果该 TCP 端口仍被占用（例如同一端口上由前一个服务器遗留的 `TIME_WAIT` 连接，
  约持续一分钟），BDS 启动时便**没有**监听该端口，且不报任何错误；此后所有客户端都会收到 `ECONNREFUSED`。
- **bedboo：** 库中无需处理。若通过 NetherNet 加入时因 `ECONNREFUSED` 失败，请检查服务器日志中是否有 `Accepting clients`
  这一行，并确认 BDS 启动时该 TCP 端口是否空闲。

## 踢出原因  {#kick-reason}

- **影响：** `kicked` 事件。
- **Java：** `reason` 是 JSON 聊天组件（字符串，1.20.3 起也可以是对象）；`loggedIn` 用于区分游戏状态与登录状态。
- **Bedrock：** `disconnect { reason: <code>, hide_disconnect_reason, message }`；message 是自由文本或翻译键
  （`disconnectionScreen.serverFull`），经常为空（此时只有 code 说明原因，例如 `server_id_conflict`、`missing_client`）。
- **bedboo：** `reason` = message；当 message 为空或被隐藏时取 reason code 的名称；`loggedIn` = 已收到 start_game。
  被踢出后，bedrock-protocol 会关闭连接，随后触发 `end`。

## 心跳  {#keep-alive}

- **影响：** 连接心跳（无 API）。
- **Java：** `ping` → `pong`，keep-alive 包。
- **Bedrock：** `network_stack_latency { timestamp, needs_response }`。
- **bedboo：** bedrock-protocol 会用相同的 timestamp 回应 `network_stack_latency`；game 插件无需处理。

## 资源包  {#resource-packs}

- **影响：** `resourcePack` 事件、`bot.acceptResourcePack()`、`bot.denyResourcePack()`。
- **Java：** 每个 `resource_pack_send` / `add_resource_pack` 对应一个包（含 url + hash 或 uuid）；客户端回应
  ACCEPTED + SUCCESSFULLY_LOADED 或 DECLINED；拒绝的后果由服务器决定。
- **Bedrock：** 登录期间（start_game 之前）通过 `resource_packs_info` 一次性发来所有资源包，带 uuid、版本和可选的 CDN url，
  没有 hash。客户端以 `resource_pack_client_response` 回应，BDS 会检查其中的状态名：
  - 'completed'：加入；
  - 'have_all_packs'：不下载直接加入（BDS 发送 `resource_pack_stack`，客户端再回应 'completed'）；
  - 'refused' / 'cancel'：BDS 断开连接（`missing_client`），可选包也是如此。
- **bedboo：** 每个包触发一次 `resourcePack(url, hash, uuid)`，其中 url = CDN url 或 ''，hash = Bedrock 包 id
  `<uuid>_<version>`。没有监听器时立即接受所有包；有监听器时等待 `acceptResourcePack()`（'completed'）或
  `denyResourcePack()`（可选包回 'have_all_packs' = 不带这些包加入；必需包回 'refused' = 被 BDS 踢出，
  `kicked('missing_client', false)`）。资源包从不下载。此功能依赖 bedrock-protocol 补丁
  （`client.holdResourcePacks` / `client.respondToResourcePacks`）。

## 客户端设置  {#settings}

- **影响：** `bot.settings.*`、`bot.setSettings()`、`bot.game.serverViewDistance`。
- **Java：** 单个 `settings` 包（语言、视距、聊天模式、颜色、皮肤部件、主手、过滤、服务器列表、粒子）。
- **Bedrock：** 只协商区块半径（`request_chunk_radius` → `chunk_radius_update`）；皮肤部件、主手等要么属于登录时的皮肤数据，
  要么不可配置。
- **bedboo：** `bot.settings` 对象、默认值和校验错误均与上游相同。只有 `viewDistance`（'far' 12、'normal' 10、'short' 8、
  'tiny' 6 个区块，或一个数字）会被发送：加入时的请求由 bedrock-protocol 发出（它会读取保持同步的 `client.viewDistance`），
  之后的 `setSettings` 调用则发送 `request_chunk_radius { chunk_radius, max_radius }`。`bot.game.serverViewDistance` 是
  服务器批准的半径（`chunk_radius_update`）。其他设置只保存在本地。

## 服务器品牌  {#server-brand}

- **影响：** `bot.game.serverBrand`。
- **Java：** `minecraft:brand` 插件频道（'vanilla'、'Paper' 等）。
- **Bedrock：** 没有品牌频道；start_game 有一个可选的 `server_identifier`（BDS 上为空）。
- **bedboo：** 有 `server_identifier` 时取其值，否则为 `'vanilla'`（BDS 即原版 Bedrock 服务器）。

## 客户端拿不到玩家上限  {#max-players}

- **影响：** `bot.game.maxPlayers`。
- **Java：** login 包携带服务器的最大玩家数。
- **Bedrock：** start_game 不含玩家上限；该值只在 unconnected pong 中，而 BDS 在 `enable-lan-visibility=false` 时不发送 pong
  （且机器人连接时不发 ping）。
- **bedboo：** `bot.game.maxPlayers` 保持为 `undefined`。

## 世界类型  {#level-type}

- **影响：** `bot.game.levelType`。
- **Java：** `'default'`、`'flat'`、`'largeBiomes'`、`'amplified'` 等。
- **Bedrock：** `start_game.generator`：0 legacy、1 infinite、2 flat、3 nether、4 the end、5 void。
- **bedboo：** 1 → `'default'`、2 → `'flat'`、0 → `'legacy'`、5 → `'void'`、3 / 4 → `'nether'` / `'the_end'`。

## 登录时的实体 id  {#entity-id-login}

- **影响：** `bot.entity.id`、`bot.entity.uniqueId`。
- **Java：** 代理可能发送带有新实体 id 的第二个 login 包。
- **Bedrock：** 每个连接只发送一次 start_game；跨服转移是一个新连接。
- **bedboo：** `bot.entity.id = Number(start_game.runtime_entity_id)`，`bot.entity.uniqueId =
  start_game.entity_id`；不会在同一连接上以新实体 id 重新登录。

## 离线玩家保留存档数据  {#offline-player-data}

- **影响：** `createBot({ auth: 'offline' })`：重连和服务器重启后，玩家的物品栏、位置、出生点等是否保留。
- **Java：** 离线模式玩家的 UUID 为 `nameUUIDFromBytes("OfflinePlayer:" + name)`：重新加入时仍视为同一玩家，服务器会恢复其存档数据。
- **Bedrock：** BDS 以登录数据中的 `SelfSignedId` 作为离线（xuid 0）玩家存档数据的键，而 bedrock-protocol 每次连接都会随机生成该值。
  在 BDS 1.26.51.1 上实测：给予物品、退出再重新加入（无论是同一服务器，还是从世界快照启动的服务器）→ 物品栏为空，位置回到世界出生点。
  使用固定的 `SelfSignedId` 重新加入则能找回物品栏和位置。
- **bedboo：** 离线认证时，`SelfSignedId` 默认取用户名对应的 Java 离线模式 UUID（`offlineSelfSignedId`，`lib/client.js`）；
  可用 `skinData.SelfSignedId` 覆盖；Xbox Live 登录不受影响。

## 出生  {#spawn}

- **影响：** `spawn` 事件。
- **Java：** 在登录或重生后的第一次生命值更新时触发。
- **Bedrock：** 加入流程为 start_game（出生搜索高度，y 32769.62）→ `respawn` state 0 ×2 → `respawn` state 1（真实位置）→
  客户端 `respawn` state 2 → `play_status player_spawn` → 客户端 `serverbound_loading_screen` 1 和 2（缺少它们，BDS 就不会模拟该玩家）。
- **bedboo：** `spawn` 由生命周期模块（`lib/bedrock/lifecycle.js`，唯一的触发者）在获知真实位置且确认加载界面后触发，
  顺序在 `login` 和 `game` 之后，与 mineflayer 一致。[维度切换](#dimensions)和[重生](survival.md#respawn)之后会再次触发。

## `spawn` 与出生搜索高度  {#spawn-search-height}

- **影响：** 经末地出口传送门返回后、以及重生到另一维度后的 `spawn`；默认（非超平坦）世界中的 `bot.spawnPoint`。
- **Java：** 服务器先发送位置，再发送触发 mineflayer `spawn` 的生命值更新；出生点数据包携带真实的出生方块。
- **Bedrock：** 服务器尚未找到真实高度时，会使用一个占位高度（出生搜索高度）：
  - 末地出口的 `change_dimension` 携带 y 32767；BDS 立即回应维度确认，约 50 ms 后才在 `respawn` state 1 中发送真实位置。
  - 重生到另一维度时，BDS 经常将正在重生的玩家修正到搜索高度（`correct_player_move_prediction` y 32768.62，出现在真实的
    `respawn` state 1 之前或之后；在下界 6 次死亡中出现了 4 次），约 300 ms 后才修正到真实位置。
  - 在服务器确定高度之前，`start_game.spawn_position` 的 y = 32767（有玩家在那里出生时，BDS 才会搜索最高的安全方块）。
    以该 y 为目标寻路会让机器人一直向上搭柱子。
- **bedboo：**
  - 忽略 `change_dimension` / `respawn` 中的搜索高度（此处不触发 `move` / `forcedMove`）。当机器人最后的服务器位置处于
    搜索高度时，`spawn` 会等待真实位置（下一个低于该高度的 `forcedMove`，先于 `spawn` 触发），最多等待 2 s；在此期间，输入时钟保持
    暂停（末地出口），或机器人保持在重生中状态。
  - `bot.spawnPoint`（`lib/plugins/spawn_point.js`）：一旦出生点所在的主世界区块列加载完成（`chunkColumnLoad` / `spawn`），
    高度 32767 就会替换为该列最高实心方块 + 1；x 和 z 保持不变，真实高度（`/setworldspawn`）不会改动，机器人在其他维度时
    不做解析。加入期间的解析（出生点区块列在 `spawn` 之前加载）不会单独触发 `game`：它属于 start_game 的出生点位置，已由登录时的
    `game` 涵盖（mineflayer 的顺序为 connect → login → game → spawn）。之后的解析则会像上游出生点变化时一样触发 `game`。
    另见[出生点](survival.md#spawn-point)。

## 维度  {#dimensions}

- **影响：** `bot.game.dimension`、`bot.game.minY`、`bot.game.height`、`bot._getDimensionName()`。
- **Java：** 维度类型与高度取自 registry codec；世界名为 `minecraft:overworld`、`minecraft:the_nether`、`minecraft:the_end`；通过 `respawn` 包切换维度。
- **Bedrock：** 无 codec：维度 id 为 0 / 1 / 2（start_game 将其映射为 'overworld' / 'nether' / 'end'），高度固定（主世界 -64..319、下界 0..127、末地 0..255）。切换维度使用 `change_dimension
  { dimension, position (FEET level), loading_screen_id }`；客户端以 `player_action dimension_change_ack` 确认；新维度
  就绪后，BDS 会发回自身的 `dimension_change_ack`（无 play_status），随后客户端发送 `serverbound_loading_screen` 1 和 2。
- **bedboo：** `bot.game.dimension` 沿用 mineflayer 的命名（'overworld'、'the_nether'、'the_end'），minY / height 查固定表得出，`_getDimensionName()` 返回 `minecraft:<dimension>`。收到 `change_dimension` 时会重置世界（卸载所有区块列 → `chunkColumnUnload`，按位置注册的 `blockUpdate:` 监听器以 `null, null` 调用后移除，与上游的 switchWorld 一致），触发 `game`，并在服务器确认后由生命周期再次触发 `spawn`（mineflayer 在切换维度后也会通过 health 触发 `spawn`）。维度切换的其余流程（`respawn` 事件、末地制作人员名单、传送门）见[维度切换](survival.md#dimension-change)。
