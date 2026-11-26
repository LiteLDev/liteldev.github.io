# BeDD 模式（transport: 'bedd'）

本页说明当 bedboo 不再自己处理协议，而是驱动由 Be.D.D. 托管的真实 Bedrock 客户端（`transport: 'bedd'`）时有哪些变化。这些变化仅适用于 `bedd` 传输，在使用 `raknet` / `nethernet` 时均不适用。配置方法、权限归属表和覆盖矩阵见 [BeDD 指南](../../guide/bedd.md)。

## 真实客户端负责自己的上行数据包  {#client-owned-packets}

- **影响：** 所有会发送数据包的 API；`bot._client.queue` / `write`
- **Java：** mineflayer 本身就是客户端，所有数据包都由它自己写出。
- **Bedrock：** 由 BeDD 托管的客户端自行登录、应答加载界面、请求区块，并在每个 tick 发送 `player_auth_input`、方块操作、物品栏事务（inventory transaction）和物品堆叠请求（item stack request）。
- **bedboo：** 从不伪造这些数据包。路由器会把 bedboo 原本要发送的内容转换为 BeDD 控制操作（`input`、`look`、`slot`、`button`、`action`、`send`、`stack`），而归客户端所有的数据包会被直接丢弃（见[权限归属表](../../guide/bedd.md#authority-table)）。

## `bot.entity` 跟随客户端，滞后 1-2 tick  {#self-state-from-echo}

- **影响：** `bot.entity.position` / `velocity` / `yaw` / `pitch` / `onGround`、`physicsTick`、`move`、`bot.physicsEnabled`、mineflayer-pathfinder
- **Java：** mineflayer 的物理引擎在每个 tick 预测玩家状态。
- **Bedrock（bedd）：** 玩家由客户端自己的物理引擎移动；tap 会回显客户端发出的每个 `player_auth_input`。
- **bedboo：** 物理提供者不自行步进，而是直接复制回显状态（眼睛高度 − 1.62），并在每个客户端 tick 触发一次 `physicsTick` 和 `move`；当回显与目标的偏差在 0.5° 以内时，`look` / `lookAt` 才会 resolve。行走、pathfinder 目标和 `lookAt` 均可用，但 pathfinder 运行时会有 1-2 tick 的延迟。

## 点击落在客户端准星所指之处  {#client-raycast}

- **影响：** `dig`、`placeBlock`、`activateBlock`、`activateEntity`、`attack`
- **Java：** mineflayer 在数据包中直接指定方块 / 面 / 实体。
- **Bedrock（bedd）：** 客户端转向目标并点击，实际命中什么由客户端自己的射线检测决定。
- **bedboo：** 先转向，等待视角收敛后再发送 `button`；结果从 `update_block` 和实体事件中读取，因此即使点击落到相邻方块上，也能如实反映出来。

## 界面级操作通过客户端的界面完成  {#screen-actions}

- **影响：** `bot.respawn`（以及 `respawn` 选项）、`bot.wake`、`bot.updateSign`、`bot.writeBook`、`bot.signBook`
- **Java：** bedboo 可以直接发送对应的数据包。
- **Bedrock（bedd）：** 这些操作在真实客户端中都对应具体的界面：死亡界面、床界面、告示牌编辑器和书本界面。
- **bedboo：** 通过 BeDD 的 `ui` 操作点击“重生”和“离开床”；在告示牌编辑器中输入文字（必要时先点击使用键打开界面；编辑的是客户端正对的那一面），然后点击“完成”。书页内容通过 book_edit（97，包含在 BeDD 默认的 `sendAllow` 中）发送，随后按 ESC 关闭书本界面；`setCommandBlock` 则发送 command_block_update（78，同样默认允许）。离开末地后的制作人员名单会按 ESC 跳过，行为与无头 bedboo 立即应答 show_credits 一致。当对应的数据包 ID（56 block_entity_data、36 player_action）在 `sendAllow` 中时，`updateSign` / `wake` 会改为直接发送数据包。两者都不可用时，调用会抛出或 reject `BeddUnsupportedError`（`code: 'ERR_BEDD_UNSUPPORTED'`，`missing` 例如 `['send:56', 'ui']`）；若没有 `ui`，`bot.respawn()` 仅给出警告（交由用户手动点击重生）。见[界面](../../guide/bedd.md#screens)和 [sendAllow](../../guide/bedd.md#send-allow)。

## 没有翻译的数据包需要 `sendAllow`  {#send-allow}

- **影响：** 对 bedboo 未作翻译的数据包调用 `bot._client.write` / `queue`（插件自定义的数据包、set_default_game_type、crafting_event……）
- **Java：** mineflayer 可以写出任意数据包。
- **Bedrock（bedd）：** 真实客户端负责发送自己的数据包；对于其他数据包，BeDD 的 `send` 仅发送 ID 在 `sendAllow` 中的数据包。
- **bedboo：** 若这类数据包的 ID 在允许列表中（`bot.bedrock.bedd.sendAllow`），则通过 `send` 发出；否则抛出 `BeddUnsupportedError`，并指明需要加入哪个 ID。当 BeDD 的 `sendAllow` 设为 `"*"` 时，所有不由客户端自己发送的数据包 ID 都在列表中，这类数据包均可正常发出，行为与无头 bedboo 一致。block_pick_request 会被翻译为客户端操作（先转向，再按选取键）。无论列表如何配置，归客户端所有的数据包都会被丢弃。

## 物品栏操作需要 `stack` 操作  {#inventory-stack}

- **影响：** `clickWindow`、`moveSlotItem`、`transfer`、`deposit`、`withdraw`、`putAway`、`craft`、从主物品栏 / 盔甲 / 副手执行的 `equip`、`unequip`、`tossStack`、`creative.setInventorySlot`、铁砧 / 附魔台 / 村民交易 / 锻造台
- **Java：** 窗口点击。
- **Bedrock（bedd）：** 物品堆叠请求必须经过客户端的 ItemStackNetManager，否则客户端的请求 id 和预测的物品栏会失去同步。
- **bedboo：** 启用 BeDD 的 `stack` 操作（`allowStack: true`）后，这些调用即可正常使用，bedboo 的请求 id 会映射到客户端的请求 id；未启用时，调用会以 `ERR_BEDD_UNSUPPORTED` reject。

## 连接选项归客户端所有  {#ignored-options}

- **影响：** `createBot` 选项 `auth`、`username`、`host`、`port`、`viewDistance`、`skipPing`；`holdResourcePacks`；`bot.end`、`bot.quit`
- **Java：** 由 mineflayer 负责连接、认证和断开。
- **Bedrock（bedd）：** 客户端已经使用自己的账号登录，并处于某个世界中。
- **bedboo：** `host` / `port` 会让客户端先加入指定服务器（通过 BeDD 的 `join` 操作；无法加入时返回 `ERR_BEDD_JOIN`；本机以外的主机须列在 BeDD 的 `allowHosts` 中，或将 `allowHosts` 设为 `["*"]` 以允许任意主机）；`viewDistance`（以及 `setSettings`）用于设置客户端的渲染距离（`settings`）；`bot.quit` 会让客户端离开当前世界（`join host:null`）再断开附加，而 `bot.end` 仅断开附加（客户端仍留在当前世界中）；`auth` 和 `username` 会被忽略，并各自输出一次警告（客户端使用自己的账号登录）；`holdResourcePacks` 不起作用。客户端切换世界（`LINK_DOWN`）会结束 bot。bot 改为直接连接游戏实例：可通过 `bedd: { url, token }`、`{ pid }`、`{ instance }` 或 `{}`（当只有一个正在运行的游戏时）指定一个 BeDD 游戏（0.4.0 或更高版本），其 WebSocket 端点公布在 BeDD 的 run 文件中（`%LOCALAPPDATA%\BeDD\run\<pid>.json`）；见[选项](../../guide/bedd.md#options)。
