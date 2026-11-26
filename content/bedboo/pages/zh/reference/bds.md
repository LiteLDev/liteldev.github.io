# BDS 笔记

以下是在基岩版专用服务器 1.26.51.1 上运行机器人时需要了解的服务器行为：打印什么、发送什么，以及何时发送。bedboo 已经处理了所有这些情况；阅读数据包日志或编写服务器控制台脚本时，这些笔记可作为参考。

## 启动与端口 {#startup}

- **就绪行：** `[… INFO] Server started.`；当 `transport=raknet` 时，其后紧跟一个多行的 `TRANSPORT TYPE ERROR` 信息块（"Your current connection type is not set to NetherNet … Players will not be able to connect"）。该错误无害，RakNet 客户端仍可正常连接。BDS 还会输出 `Signed in to signaling service successfully`。全新的超平坦世界大约在进程启动 1 秒后就绪。
- **端口被占用**时会打印 `ERROR] Port [<port>] may be in use by another process. Free up port and re-run program …`，随后输出 `Exiting program` 和一份崩溃转储，并在一秒内退出。
- **NetherNet：** BDS 在 **TCP** `server-port` 上打开信令监听，并输出 `Accepting clients on [::]:<port>`。如果该 TCP 端口仍被占用（例如上一个服务器遗留的 `TIME_WAIT` 连接，约持续一分钟），服务器会在未监听的状态下静默运行，客户端随后会收到 `ECONNREFUSED`。
- **Ping：** 在 `enable-lan-visibility=false` 时，BDS 不响应未连接 ping，因此 bedboo 默认设置 `skipPing: true`。

## 传输层与后端 {#transports}

- 基于 raknet-native 的 RakNet 可以正常工作（加入 ≈0.3 秒，`start_game` ≈0.5 秒，`spawn` ≈1.0 秒）。raknet-native 1.2.3 仅捆绑了 x64 预编译包（`linux-5-x64`、`darwin-21-x64`、`win32-10-x64`），且禁用了源码构建，因此 arm64 主机（Apple Silicon、linux-arm64）没有可用的 RakNet 后端。工作区补丁让绑定能在较新的内核（`linux-6`）上找到捆绑的预编译包；该预编译包要求 glibc ≥ 2.34。
- `raknetBackend: 'jsp-raknet'` 会失败：BDS 对 open-connection 请求的响应是 `ID_INCOMPATIBLE_PROTOCOL_VERSION`（服务器的 RakNet 协议版本为 11，而 jsp-raknet 使用 10）。
- 在服务器端口上使用 HTTP 信令的 NetherNet 可以正常工作（加入 ≈1.7 秒，spawn ≈2.6 秒）。bedrock-protocol 和 node-nethernet 的 HTTP 信令支持已通过工作区补丁回移。

## 加入流程 {#join}

- `start_game.player_position` 为 `(0.5, 32769.62, 0.5)`（出生点搜索高度），随后是三个 `respawn` 数据包：位于 32769.62 的 state 0、位于 32768 的 state 0，以及位于真实眼睛高度出生点的 state 1（超平坦世界中为 `(0.5, -58.38, 0.5)`，脚部 y = -60）。客户端以 `respawn { state: 2, runtime_entity_id }` 响应 state 1，随后收到区块和 `play_status player_spawn`。
- **加载界面闸门：** 玩家生成后，在客户端发送 `serverbound_loading_screen { type: 1 }` 和 `{ type: 2 }` 之前，BDS **不会模拟玩家**（既忽略 `player_auth_input` 中的位置和移动向量，也不发送 `correct_player_move_prediction`）。发送之后，行走输入才会驱动玩家移动，不合理的移动也会被纠正。
- `start_game`：`rewind_history_size = 40`、`server_authoritative_block_breaking = true`、`server_authoritative_inventory = true`、`block_network_ids_are_hashes = true`；`player_gamemode` 为 `fallback`，因此实际游戏模式保存在 `world_gamemode` 中。默认 `server.properties` 为：`server-authoritative-movement-strict=false`、`player-position-acceptance-threshold=0.5`。
- `player_list` 以 `records: [{ type: 'add', username, … }]` 的形式到达，此时玩家尚未生成，也无法被选择器选中。

## 区块与保存 {#chunks}

- `level_chunk` 始终以子区块请求模式到达（`sub_chunk_count: 0` 且带有 `highest_subchunk_count`），从不内联子区块。发送 `subchunk_request { dimension, origin, requests: [{ x: 0, y: -4..19, z: 0 }] }` 会返回一个 `subchunk`，其中每个请求对应一个条目（带负载的 `success`，或 `success_all_air`）。发送 `request_chunk_radius 10` 后，`network_chunk_publisher_update` 的半径会从 64 格变为 160 格。
- 附近没有玩家时，区块不会加载：`setblock` / `testforblock` 会返回 `Cannot place block outside of the world`。
- 修改过的区块每 5–10 秒才写入一次 LevelDB，且 `save hold` **不会**将其刷入磁盘，因此在线备份可能会遗漏最近的改动。正常停止服务器则会保存所有内容。

## 控制台命令 {#console}

- `say` / `tellraw` 不会在控制台打印任何内容；命令错误会输出为 `ERROR` 行（`Unknown command: <cmd>. Please
  check that the command exists …`、`No targets matched selector`、`Syntax error: …`）。
- `list` 打印 `There are n/max players online:` 及一行玩家名；`querytarget` 打印一个 JSON 块（`y` 为眼睛高度）；不带参数的 `gamerule` 会在一行内打印所有规则；`testforblock` 打印 `Successfully found the block at x,y,z.` 或 `The block at x,y,z is Air (expected: …)`。
- `gamemode <m> <player>` 发送 `update_player_game_type { gamemode, player_unique_id }`（而非 `set_player_game_type`）；若玩家已处于该模式，则不发送任何内容。游戏模式命令对已死亡的玩家无效（返回 `No targets matched selector`）。
- `tp <p> 10 -60 10` 会将整数 x/z 坐标居中（`Teleported p to 10.50, -60.00, 10.50`），并以眼睛高度发送 `move_player { mode: 'teleport', teleport: { cause: 'command' } }`。
- `setblock` 打印 `Block placed` 并发送 `update_block`；重复放置相同方块会打印 `The block couldn't be placed`，且不发送任何数据包。
- `summon` 打印 `Object successfully summoned` 并发送 `add_entity`（脚部位置，已居中）；`kill @e[type=pig]` 打印 `Killed Pig`，并依次发送 `entity_event death_animation`、掉落物（`add_item_entity`）和 `remove_entity`。
- 创造模式下的玩家无法被杀死（`Players cannot be killed while they are in Creative mode.`），即使使用 `/damage … void` 或掉入虚空也是如此。

## 值得了解的数据包 {#packets}

- **客户端发出的命令：** `command_request { command, origin: { type: 'player', uuid, request_id: '' }, … }` 由 `command_output` 应答，其 origin 回显的是 **uuid**（而非 `request_id`），同时还会附带一个 `event { event_type: 'command_executed' }`。
- **聊天：** 客户端的 `text` 聊天（`type: 'chat'`、`category: 'authored'`）会以 `source_name: '<name>§r'` 回显给所有人。
- **物品栏：** `/give`、`/replaceitem`（快捷栏 / 物品栏）和 `/clear`（即使未清除任何物品）都会发送所有窗口的 `inventory_content`（物品栏 36、盔甲 5、ui 54、副手 1）；针对盔甲的 `replaceitem` 会发送 `inventory_slot`；`/give` 还会发送一个 `inventory_transaction`。玩家的物品带有 `stack_id`。
- **物品栏重发：** `inventory_transaction { transaction_type: 'inventory_mismatch' }` 会让 BDS 重新发送玩家的物品栏（`inventory_content` × 4 + `player_hotbar`）；被拒绝的物品堆叠请求或重新打开物品栏界面都不会触发重发。
- **死亡：** 自身的 `entity_event death_animation`、`death_info`、`text`（`death.attack.generic`）以及死亡位置处的 `respawn` state 0。重生：客户端 `respawn` state 2 → 服务端 `respawn` state 0（`y 32767`）+ state 1（位于眼睛高度的出生点）→ 客户端 `player_action respawn` → `entity_event respawn` + `set_health 20`。
- **时间：** 不存在 `set_time` 数据包，执行 `/time set` 时同样如此；时间通过 `sync_world_clocks` 传递。
- **下落方块：** 方块开始下落与下落方块落地都只以 `update_block_synced` 到达，从不以 `update_block` 到达（[下落方块](differences/world.md#falling-blocks)）。
- **生物：** 超平坦世界会持续生成被动生物：每分钟数百个 `move_entity_delta`。
