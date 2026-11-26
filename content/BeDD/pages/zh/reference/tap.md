# Tap 协议

为 [bedboo](https://github.com/LiteLDev/bedboo)（传输层 `bedd`）提供的客户端游戏数据包只读流。配置项为 `tap`（见[配置](/zh/guide/configuration#功能开关)），状态查询见 [`tap` 操作](/zh/reference/websocket#bedboo-操作)。

## 订阅与帧

发送 `{"op":"tap","action":"subscribe"}` 会收到 `{"ok":true}`，此后每帧对应一条二进制消息。请勿在该连接上发送其他内容。已有订阅者时返回 `busy`；功能关闭时返回 `disabled`。

| 字节（LE） | 字段 |
|---|---|
| u32 | `len`：其后的字节数，≤ 16 MiB + 20 |
| u8 | `kind` |
| u8 | `flags`：1 重放，2 重新序列化，4 本地链路，8 已抑制（保留） |
| u16 | 0 |
| u64 | `seq`（进程级；重放时保持不变） |
| u64 | `tUs`（单调时钟 µs） |
| … | 负载 |

| kind | | 负载 |
|---|---|---|
| 1 | CLIENTBOUND | varint 头（`id \| senderSub<<10 \| targetSub<<12`）+ 包体（bedrock-protocol `parsePacketBuffer`） |
| 2 | SERVERBOUND_ECHO | 同上；从不含 id 1、3、4、193（login、握手、request_network_settings） |
| 4 | MARKER | UTF-8 JSON（忽略其他 kind） |

| 标记 | 字段 |
|---|---|
| `HELLO`（首个） | `tap:1`、`mod`、`game:"1.26.60.05"`、`protocol`（2225）、`pid`、`link{state, type, address}`、`journal{frames, bytes, complete}` |
| `LINK_UP` | `type` remote\|local、`address` |
| `LINK_DOWN` | `reason` |
| `REPLAY_BEGIN` | `frames` |
| `REPLAY_END` | `complete`（超过 `tapJournalMiB` 时为 false；无日志时发送空的一对，为 false） |
| `DROPPED` | `count`；订阅者落后 > 32 MiB，随后断开连接（重新订阅会触发完整重放） |

实时帧在 REPLAY_END 之后才发送；请按 seq 跳过重复帧。

各发布者共用 `src/TapSink.h`（见[代码规范](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#code-rules)）；钩子只负责复制数据，由订阅者线程取走。

## 远程服务器（`NetTap.cpp`）

| | |
|---|---|
| 链路建立 | 客户端打开连接时检测到 |
| 链路断开 | 连接关闭 |
| 入 | 收到的数据包，已解密、已解压；flags 0 |
| 出 | 发出的数据包；flags 0 |
| `trace` | 每条链路前 50 个数据包：`tap trace #n in\|out id len` |
| Blob 缓存 | 发送前清除 `client_cache_status.enabled`，使服务器发送完整子区块（回显显示 `false`） |

## 单人世界和局域网主机世界（`TapLoopback.cpp`，配置 `tapLoopback`）

默认为 `true`，依赖 `tap`。数据包会重新序列化（头格式同上）；flags 为 2 + 4。

| | |
|---|---|
| CLIENTBOUND | 本地服务端发出的数据包；仅限 `Local` 连接。局域网访客计入 `guest`。广播在本地玩家的 `start_game` 之后开始 |
| SERVERBOUND_ECHO | 客户端发往本地服务端的数据包；从不含 id 1、3、4、193 |
| 区块 | 每个 `subchunk_request`/`subchunk`（一个原点，最多 `highest_subchunk_count`；`client_cache_status.enabled:false`） |
| 链路 | 仅在 `tap::gLinkType` 为 local 时生效，由客户端的首个数据包设置，连接关闭时清除。链路未知前，`Local` 客户端连接也会计入（但从不写入 `gLinkType`）。远程捕获只在 `Remote` 时发布，因此不会重复 |
| 无接收端 | `tap::gEmit` 为 null 时只计数。`state.stats.tapLoopback{enabled, hooks, link, clientbound, echo, bytes, unpublished, guest}` |
| `trace` | 记录前 50 帧（`trace tap loopback: in\|out id= len=`）；前 4000 帧写入 `mods\BeDD\data\tap-loopback.bin`（seq、tUs 为 0） |

## 加入日志（`TapJournal.cpp`）

挂在 `bedd::tap::gEmit` 链上，并设置 `bedd::tap::gReplay`（在两个 REPLAY 标记之间对每个订阅者调用）。

| | |
|---|---|
| 保留 | 仅 CLIENTBOUND。新链路建立和收到 `start_game`（11，作为首帧）时重置 |
| 每键保留最新 | `level_chunk`（x、z、dim）、`update_block`（pos、layer）、`set_time`、`set_health`、`network_chunk_publisher_update`、`current_structure_feature`、`inventory_content`（window）、`inventory_slot`（window、slot）、`level_event`（事件 id）、`update_abilities`（unique id）、`add_*`（unique id；`add_player` 用 runtime id）；按 runtime id：`set_entity_motion`、`move_entity`、`move_player`、`mob_armor_equipment` |
| 按实体 + 字段 | `set_entity_data`（键）、`update_attributes`（名字）、`move_entity_delta`（字段）、`mob_effect`（效果） |
| `subchunk` | 被后续帧覆盖全部子区块后丢弃；无法遍历的则保留 |
| `remove_entity`（14） | 删除对应的 add 帧（`add_player` 按 unique id 字节匹配）和 runtime id 键 |
| 不保留 | `text`、`animate`、`network_stack_latency`、`play_sound`、`stop_sound`、`level_sound_event`（v1、v2）、`spawn_particle_effect`、`level_event_generic` |
| 上限 | `tapJournalMiB`（128）：超出后 `complete:false` 直至重置（晚到的订阅者会缺失区块） |
| 统计 | `state.stats.journal`：`enabled, frames, bytes, complete, seen, compacted, pruned, transient, overCap, resets, replays` |
