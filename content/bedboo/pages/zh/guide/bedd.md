# 驱动真实客户端（BeDD）

通常，bedboo 本身*就是*客户端：它通过 RakNet 或 NetherNet 登录基岩版专用服务器（BDS），并自行发送每一个数据包。启用 `transport: 'bedd'` 后，它会转而驱动一个由 [Be.D.D.](https://levimc.org/zh-Hans/BeDD/)（Bedrock Deep Dive，LeviLamina 客户端模组的测试工具包）托管的**真实的 Minecraft 基岩版客户端**。同一份脚本会直接作用于真实的游戏窗口：你能看到本地玩家按脚本指示行走、转头、挖掘、放置方块和聊天。

```js
const bedboo = require('bedboo')
const bot = bedboo.createBot({ transport: 'bedd', version: '1.26.60', bedd: {} }) // 唯一一个正在运行的 BeDD 游戏
bot.once('spawn', () => bot.chat('hello from bedboo'))
```

两种模式仅靠 `transport` 切换，直连 BDS 的模式（`raknet`、`nethernet`）保持不变。该模式的具体差异详见 [BeDD 模式](../reference/differences/bedd.md)。

## 安装配置 {#setup}

仅支持 Windows（BeDD 运行的是 Minecraft Windows 客户端），且需要 Node 24 或更高版本。bedboo 需要 **BeDD 0.4.0 或更高版本**，该版本通过本机 WebSocket 暴露每个游戏实例；不再支持 BeDD 0.3 及更早版本（命名管道 `\\.\pipe\BeDD`）。

1. 安装 BeDD 0.4.0 或更高版本（参见 [BeDD 文档](https://levimc.org/zh-Hans/BeDD/)），并用它启动游戏：

   ```sh
   BeDD.exe launch --slot 2
   ```

   BeDD 会将每个游戏运行在 LeviLauncher 实例的独立副本中（`%LOCALAPPDATA%\BeDD\instances\<base>-<slot>`），并在监听期间将其信息写入 `%LOCALAPPDATA%\BeDD\run\<pid>.json`（可通过 `$BEDD_HOME` 更改目录）：
   `{ "protocol": 2, "kind": "client", "pid", "url": "ws://127.0.0.1:<port>/v1", "token", "instance", "label", … }`。
   bedboo 读取此文件进行连接，其中 token 是唯一的凭据。
2. 自 BeDD 0.4.0 起，bedboo 所需的功能均**默认开启**（受 token 保护）。游戏的 `mods\BeDD\config\config.json` 中与 bedboo 相关的配置项如下：

   | 键 | 默认值 | 作用 | bedboo 用途 |
   |---|---|---|---|
   | `tap` | `true` | tap：所有客户端方向（clientbound）数据包、所有服务端方向（serverbound）数据包的回显、标记，以及加入日志 | 所有功能（关闭后 bedboo 无法附加） |
   | `tapLoopback` | `true` | 监听单人或局域网主机世界（回环链路，数据包经重新序列化） | [单人游戏](#singleplayer) |
   | `tapJournalMiB` | `128` | 回放给后附加客户端的加入日志大小上限 | 在会话中途附加（超出上限时 `complete:false`） |
   | `gameHooks` | `true` | `world`、`look` 和 `input` 操作（挂钩到游戏自身的输入管线） | 精确控制移动和视角（关闭时改用虚拟按键和鼠标） |
   | `allowSend` | `true` | 针对白名单数据包 ID 的 `send` 操作（`sendAllow`，默认 `[9, 77, 78, 97]`，即 text、command_request、command_block_update、book_edit） | `bot.chat`、私聊、命令，以及加入白名单的其他数据包（参见 [sendAllow](#send-allow)） |
   | `allowStack` | `true` | `stack` 操作：通过客户端自身的 ItemStackNetManager 提交 item_stack_request | 物品栏：clickWindow、transfer、craft、deposit/withdraw、从主物品栏装备、创造模式 |
   | `ui` | `true` | `ui` 操作：将游戏界面读取为节点树，按 ref 点击和输入文字 | `respawn`、`wake`、`updateSign`、关闭书本界面（[界面](#screens)） |
   | `wsPort` | `0` | WebSocket 端口（0 表示任意空闲端口，从 run 文件读取） | `bedd.url` |
   | `wsMaxClients` | `8` | 允许同时打开的 WebSocket 连接数（bedboo 占用两个） | 让 bedboo 与 BeDD 管理器及其他测试工具并存 |

   将键设为 `false` 会关闭对应操作，bedboo 会将其视为 `disabled` 并改用兜底方案（参见[支持范围表](#coverage)）。`pipeName` 和 `pipeInstances` 已随命名管道一并移除。

   `loopbackOnly`（BeDD 自身的配置项）限制客户端仅连接本机（127.0.0.1）上的服务器。连接非本机服务器需要启用 BeDD 的 Remote 模式：运行 `BeDD.exe mod config <instance> --world-mode Remote --server-host <host>` 允许客户端访问指定主机；使用 `--server-host '*'`（即配置 `"allowHosts": ["*"]`）则允许连接由 `join`（见下文 `host`）指定的任意主机，无需重启，未指定的主机仍不可达。客户端通过 NetherNet 加入 BDS，因此请使用 `transport=nethernet` 启动服务器。由于 NetherNet 加入需要经过 Minecraft 的在线信令服务，在客户端加入和游玩期间，同一台电脑上不能再启动其他 Minecraft 游戏，否则后续登录会挤掉当前会话（报错 "Multiplayer Connection Failed … NetherNet"）。
3. 让玩家进入世界（服务器、局域网世界或单人游戏）：bedboo 只能附加到已进入游戏的客户端，本身不负责登录。你也可以向 `createBot` 传入 `host`（及 `port`）：bedboo 会先调用 BeDD 的 `join` 操作让客户端加入该服务器（离开当前世界并自动确认 “Trust this server?”），待客户端进入存档后再附加。
4. 调用 `createBot({ transport: 'bedd', version: '1.26.60', bedd: {} })`。其中 `version` 为游戏的协议族（不匹配会导致 tap 的 HELLO 被拒绝；该模式下默认为 BeDD 0.4.0 运行的游戏版本 `1.26.60`）。`bedd: {}` 会自动选择当前唯一运行的 BeDD 游戏；若同时运行多个，请明确指定目标实例（参见[选项](#options)）。加入日志回放完成后会触发 `spawn`，此后 `bot.*` 即反映客户端的实时状态。

以下 `bedd_follow.js` 示例让客户端跟随距离最近的其他玩家：

```sh
node examples/bedd_follow.js                       # 唯一一个正在运行的 BeDD 游戏
node examples/bedd_follow.js --instance <instance>  # 或 --pid <pid>
```

## 工作原理 {#how-it-works}

真实客户端对自身发出的所有数据保持绝对权威：登录、资源包、加载界面、区块请求、每 tick 的 `player_auth_input`（含物理模拟）、方块操作、物品栏事务和物品堆叠请求。bedboo 从不伪造这些数据包。它的完整内部栈照常运行，但*原本*要发出的数据包会转化为发给客户端的**意图**。收发双向均通过游戏的 BeDD WebSocket（`ws://127.0.0.1:<port>/v1?token=…`）传输，共使用两个连接：

```text
script → mineflayer API → plugins → _client.queue → router ──(JSON text frames)───→ WebSocket 1 (control) → the game's input pipeline
bot.* state ← plugins ← decoder ← tap reader ←──(binary frames)──────── WebSocket 2 (tap subscribe) ← every packet the client gets / sends
```

- **状态输入：** 第二个连接发送 `{ op: 'tap', action: 'subscribe' }` 后，每个 tap 帧会作为二进制消息到达，包含客户端收到的每一个客户端方向数据包、客户端发出的每一个服务端方向数据包的回显，以及 JSON 标记（`HELLO`、`LINK_UP`/`LINK_DOWN`、`REPLAY_BEGIN`/`REPLAY_END`、`DROPPED`）。bedboo 使用与直连模式完全相同的方式，通过 bedrock-protocol 解码这些数据，因此 `bot.entities`、世界、物品栏、聊天及所有事件均源自真实会话。每个新订阅者都会收到一份压缩过的**加入日志**回放（从 `start_game` 开始，每个位置仅保留最新区块，每个实体仅保留最新属性，已移除的实体会被剔除），使 bedboo 能够在会话中途附加。tap 同一时间仅允许一个订阅者（第二个连接会收到 `code: 'busy'`）。如果 bedboo 接收滞后超过 32 MiB，BeDD 会发送 `DROPPED` 并断开连接；此时机器人以 `bedd_dropped` 结束，重新创建机器人即可获取完整回放。
- **自身状态：** `bot.entity` 的位置、速度、偏航角、俯仰角和 onGround 状态直接取自回显的 `player_auth_input`（眼睛高度 − 1.62）。`physicsTick` 和 `move` 在每个客户端 tick 触发一次，bedboo 自身的物理引擎不执行步进。
- **意图输出：** 路由器对比 bedboo 原本要发送的内容，转而调用 BeDD 的控制操作：`input`（移动向量、跳跃、潜行、疾跑，带失效保护 TTL）、`look`（绝对偏航角/俯仰角）、`slot`、`button`（攻击/使用/选取，挖掘时方块一变化即释放）、`action`（丢弃、物品栏等）、`send`（白名单内的数据包字节：text/command_request，以及加入 `sendAllow` 的任意 ID）、`stack`（通过客户端的 ItemStackNetManager 发送 item_stack_request）、`ui`（操作客户端界面：重生、离开床、告示牌编辑器）以及 `join`（createBot 的 `host`）。仅当游戏窗口捕获鼠标且未打开菜单时，输入才会生效。控制请求为 `{ id, op, … }` 文本帧，按顺序应答，同一时间仅保持一个在途请求。
- **协商：** 附加时，bedboo 会 ping 控制连接（BeDD 0.4.0 及更高版本会返回 `protocol: 2`、`defaultMode: 'bedboo'` 和 `modes`，即各操作模式下的操作列表），并不带参数逐一探测每个操作：`unknown op`（或不在 `modes` 中）表示不存在（absent），`code:'disabled'` 表示存在但在 config.json 中被禁用，`ok` 表示可用（present）。探测结果保存在 `bot.bedrock.bedd.caps` 中，`bot.bedrock.bedd.supports(name)` 则按 mineflayer API 逐项返回支持情况。

## 权威归属表 {#authority-table}

| 类别 | 数据包 | 处理方式 |
|---|---|---|
| clientOwned | login, client_to_server_handshake, request_network_settings, resource_pack_client_response, client_cache_status, client_cache_blob_status, subchunk_request, serverbound_loading_screen, set_local_player_as_initialized, network_stack_latency, tick_sync, player_skin, emote_list, respawn, player_action (dimension_change_ack / start_item_use_on / stop_item_use_on / respawn), animate, show_credits, interact mouse_over_entity | 由路由器丢弃（客户端会自行发送）并计入统计。对应的 API：`bot.swingArm` → `action swing`，`bot.respawn` → `ui`（重生），制作人员名单 → 在 `credits_screen` 上按 ESC，`bot.quit` → `join host:null` |
| translated | player_auth_input（move_vector 和标志 → `input`；yaw/pitch → `look`；block_actions start_break / abort_break / stop_break → `button attack`）、mob_equipment（→ `slot`）、inventory_transaction（item_use click_block / click_air、item_release、item_use_on_entity → `look` + `button`）、interact open_inventory（→ `action inventory`）、container_close（→ ESC）、item_stack_request（→ `stack`） | 转换为控制操作 |
| shared | text, command_request | 以字节形式通过 `send` 发送（保留命令 uuid，以便与 `command_output` 对应）；兜底方案：T / SLASH 键、`text`、ENTER |
| allowlisted | book_edit, command_block_update | 通过 `send` 原样发送（已包含在 BeDD 默认的 `sendAllow` 中） |
| unsupported | crafting_event, set_default_game_type，以及其他所有数据包 | 若其 ID 在 BeDD 的 `sendAllow` 中，则通过 `send` 原样发送（[见下文](#send-allow)）；否则抛出 `BeddUnsupportedError`（`code: 'ERR_BEDD_UNSUPPORTED'`），错误信息会指出需要添加的 ID |

此外，block_pick_request 会转换为 `look` + `button pick`，interact leave_vehicle 转换为一次潜行，request_chunk_radius 转换为 `settings renderDistance`；player_action stop_sleeping 和告示牌的 block_entity_data 属于 screens 类，会通过 `ui` 点击“离开床”或操作告示牌编辑器（若 ID 在 `sendAllow` 中，也可通过 `send` 原样发送）。机器人自身的 `respawn` / `player_action respawn` 仍归客户端所有：`bot.respawn()` 会改为点击死亡界面的“重生”按钮，由客户端自行发送这些数据包。

## 支持范围 {#coverage}

“Caps”列出了各 API 所需的 BeDD 操作。若缺少相应操作，`bot.bedrock.bedd.supports(name)` 会返回 false，调用将抛出异常或以 `ERR_BEDD_UNSUPPORTED` 拒绝（除非使用了表中所列的兜底方案）。

| API | 是否可用 | caps（兜底方案） |
|---|---|---|
| spawn、login、游戏事件、`bot.game`、时间、天气、生命值、饥饿值、经验 | 可用，来自 tap | `tap` |
| `bot.entities`、`bot.players`、方块与世界（`blockAt`、`findBlocks`、射线检测、`waitForChunksToLoad`） | 可用，来自 tap | `tap` |
| chat / message / messagestr 事件、标题、Boss 栏、计分板、Tab 列表、声音、粒子、爆炸 | 可用，来自 tap | `tap` |
| `bot.inventory`、`heldItem`（读取） | 可用 | `tap` |
| `bot.entity` 的位置 / 速度 / 偏航角 / 俯仰角 / onGround | 可用，来自回显的 player_auth_input（落后 1-2 tick） | `tap` |
| `setControlState`、`getControlState`、`clearControlStates` | 可用 | `input`（虚拟 W/A/S/D/SPACE/SHIFT/CTRL 键） |
| mineflayer-pathfinder、collectblock、pvp | 可用，通过控制状态、视角和攻击实现 | `input`、`look` |
| `look`、`lookAt` | 可用；回显收敛（< 0.5°）时完成 | `look`（闭环 `raw` 鼠标） |
| `setQuickBarSlot`、装备（`equip`）快捷栏中的物品 | 可用 | `slot`（按键 1-9） |
| `chat`、`whisper`、命令 | 可用，保留 uuid | `send`（T/SLASH + `text` + ENTER，丢失 uuid） |
| `dig`、`stopDigging` | 可用；客户端上显示裂纹动画，在 update_block → air 时完成 | `look`、`button`（`mouse`） |
| `placeBlock`、`activateBlock`、`activateItem`、`deactivateItem`、`consume`、弓 | 可用（先转向，再使用） | `look`、`button` |
| `attack`、`activateEntity`、`mount`、`dismount` | 可用 | `look`、`button`、`input` |
| 用 `toss` 丢出手持物品 | 可用 | `action`（drop / dropAll） |
| `openContainer`、`openChest`、`openFurnace`、`closeWindow` | 可用（关闭 = ESC） | `look`、`button` |
| `clickWindow`、`moveSlotItem`、`transfer`、`deposit`、`withdraw`、`putAway`、`craft`、从主物品栏 / 盔甲栏 / 副手 `equip`、`unequip`、`tossStack`、`creative.setInventorySlot`、铁砧 / 附魔台 / 村民 / 锻造台 | 可用，通过客户端的 ItemStackNetManager | `stack`（无兜底：`ERR_BEDD_UNSUPPORTED`） |
| `respawn`（以及 `respawn` 选项） | 可用：点击死亡界面的“重生”按钮 | `ui`（无：不做任何事并给出警告） |
| `sleep`、`wake` | 可用：睡觉是对床的一次使用点击，起床点击床界面的“离开床” | `look`、`button`；wake：`ui`，或 `sendAllow` 含 36 的 `send` |
| `updateSign` | 可用：在客户端的告示牌编辑器中输入（未打开时先用一次使用点击打开），再点“完成” | `ui`，或 `sendAllow` 含 56 的 `send` |
| `writeBook`、`signBook` | 可用：用一次使用点击打开书，页面以 book_edit 发送，再用 ESC 关闭书本界面 | `button`，以及 `sendAllow` 含 97 的 `send`（BeDD 默认） |
| `setCommandBlock` | 可用，以 command_block_update 发送 | `sendAllow` 含 78 的 `send`（BeDD 默认） |
| `swingArm` | 可用（`'left'` 在本客户端上挥副手；animate 在网络上不带手） | 带 `swing` 的 `action`（无：不做任何事并给出警告） |
| `setSettings({ viewDistance })`、`viewDistance` 选项 | 可用：客户端的渲染距离（服务器可能给得更多） | `settings`（无：忽略并给出警告） |
| 离开末地后的制作人员名单 | 与无头 bedboo 一样跳过：`credits_screen` 显示时按 ESC | `world`、`key` |
| 物品栏重新同步（`inventory_mismatch`） | 不做任何事：物品栏由客户端负责 | — |
| `block_pick_request`（插件自己的 `_client.write`） | 可用：转向方块并按下选取键 | `look`、`button` |
| 插件的其他 `_client.write` / `queue` | 其数据包 ID 在 `sendAllow` 中时可用；`sendAllow: "*"` 时任何不归客户端所有的 ID 都可用 | `send` |
| `host`、`port` 选项 | 客户端先加入该服务器（本机以外：BeDD 的 `allowHosts` 列出该主机，或为 `"*"`） | `join` |
| `bot.quit` | 客户端离开当前世界（回到标题界面），然后机器人断开附加 | `join`（无：只断开附加并给出警告） |
| `bot.end` | 仅断开附加；客户端留在原世界 | — |
| `auth`、`username` 选项 | 忽略并给出警告（客户端用它自己的账号登录） | — |

说明：`activateItem(true)`（副手）仍会使用主手，因为基岩版没有副手使用输入（副手仅被动生效，如潜行举盾、图腾、地图）；对无需按住使用的物品（投掷物、钓鱼竿）调用 `activateItem` 相当于单击一次；缺少 `ui` 时，`bot.respawn()` 不做任何事并给出警告（因此 `respawn: true` 绝不会从生命值监听器中抛出异常）；告示牌编辑器只能编辑客户端正对的那一面，若编辑器显示的是正面，调用 `updateSign(block, text, true)`（背面）会给出警告；`bot.craft` 保留了上游的 `new Error(err)` 包装，若未在界面层提前拒绝，请检查其中的 `err.message`。

降级之处：pathfinder 会有 1-2 tick 的延迟（预测位置会被回显覆盖）；点击命中目标由客户端自身的射线检测决定，因此操作可能落在相邻方块或实体上（bedboo 会通过 `update_block` 或实体事件感知）；飞行通过双击跳跃实现；打开界面时输入会暂停；后附加依赖加入日志（`complete:false` 意味着缺失的区块需重新进入才会加载）；客户端切换世界会终止机器人（`LINK_DOWN`）。

## 界面 {#screens}

BeDD 的 `ui` 操作会将游戏的 JSON UI 界面解析为带 ref 的节点树（包含 `role`、`name`、`text`、`state`），并按 ref 点击节点或输入文字。对于客户端要求必须通过界面交互才能完成的操作，`lib/bedd/screens.js` 会利用该机制代为执行：

| API | 节点 |
|---|---|
| `bot.respawn()`（`respawn` 选项在死亡时调用它） | 名称或文字含 “respawn” 的按钮（死亡界面的 `respawn_button`） |
| `bot.wake()` | 含 “wake”、“leave bed” 或 “stop sleeping” 的按钮（床界面的 `wake_up_button` “Leave Bed”） |
| `bot.updateSign(block, text)` | 告示牌界面的文本框，然后是它的“完成”按钮（没有则按 ESC） |
| `bot.writeBook` / `signBook` | bedboo 松开书时，在书本界面上按 ESC |

每项操作都会反复读取节点树，直至目标节点出现（超时为 10 秒）；若遇到 `stale_snapshot`、`stale_ref` 或 `occluded`，也会重新读取。同样的辅助函数也可用于驱动其他任意界面：`bot.bedrock.bedd.screens.click(node => node.role === 'button' && /play/i.test(node.text ?? ''))`、`screens.setText(matcher, text)`，以及用于读取原始快照的 `screens.read()`。

## sendAllow {#send-allow}

`send` 只会发送游戏的 `sendAllow`（位于 config.json，自 BeDD 对齐操作起默认为 `[9, 77, 78, 97]`，此前为 `[9, 77]`）所列的数据包 ID；1、30、144 和 147（login、inventory_transaction、player_auth_input、item_stack_request）始终被拒绝。bedboo 会从 `send` 的探测结果中读取该列表（`bot.bedrock.bedd.sendAllow`）；任何无法翻译为操作、但 ID 在列表中的数据包都会原样发出。常用 ID 如下（在你自己掌控的服务器上，可按需加入其他 ID）：

| ID | 数据包 | 随之可用的功能 |
|---|---|---|
| 97 | book_edit | `bot.writeBook`、`bot.signBook`（默认） |
| 78 | command_block_update | `bot.setCommandBlock`（默认） |
| 56 | block_entity_data | `bot.updateSign` 直接发送数据包（任意一面，不经编辑器），而非通过告示牌编辑器 |
| 36 | player_action | `bot.wake` 直接发送数据包，而非点击“离开床”（以及插件发送的任何 player_action） |
| 105 | set_default_game_type | 插件自己的 `_client.write('set_default_game_type', …)` |

无论 `sendAllow` 如何设置，归客户端所有的数据包（见权限表）仍会被丢弃。

设置 `"sendAllow": "*"`（`BeDD.exe mod config <instance> --set sendAllow=*`）会让 `send` 接受除客户端自行发送的数据包（login、握手、player_auth_input、inventory_transaction、item_stack_request、区块与缓存请求、加载界面、respawn、animate……）之外的所有 ID，与无头 bedboo 可写入任意数据包的行为一致。此时，探测结果的 `allow` 会逐一列出所有允许的 ID（因此 `bot.bedrock.bedd.sendAllow` 即为完整列表），并带有 `allowAll: true`。非客户端自行发出的数据包可能导致客户端与服务器状态不一致，请仅在你自己掌控的服务器上使用。

## 单人游戏与局域网世界 {#singleplayer}

开启 `tapLoopback`（开启 `tap` 后默认随之开启）时，BeDD 还会监听客户端自行托管的世界（单人游戏或局域网世界）。这些数据包从不经过网络，因此 BeDD 会将其重新序列化（帧标志为 `reserialized`），并过滤出仅与本地玩家相关的内容，避免混入局域网访客的流量。[支持范围表](#coverage)中的所有功能均照常工作；HELLO 标记中会显示 `link.type: 'local'`。

## 安全性 {#security}

- **token 是边界。** BeDD 仅监听 127.0.0.1，拒绝未携带游戏 token 的连接（HTTP 401）或带有 `Origin` 头的连接（403，从而阻止网页访问）。token 保存在 `%LOCALAPPDATA%` 下的 run 文件中：任何以当前 Windows 用户身份运行的程序都能读取它并驱动游戏。bedboo 通过 `?token=` 发送该 token，且从不发送 `Origin`。
- **tap 会暴露整个会话。** 订阅者可以读取已登录玩家看到和执行的一切：聊天、位置、物品栏和世界数据。
- **`send`、`stack` 和 `ui` 以该账号的身份行事。** `send` 以已登录玩家的身份发送聊天和命令（以及加入 `sendAllow` 的任何数据包），`stack` 移动其物品，`ui` 点击其界面。`send` 仅限发送 `sendAllow` 中的 ID（默认为 `[9, 77, 78, 97]`；设为 `"*"` 时包含客户端不自行发送的所有 ID），而 login、`player_auth_input`、物品堆叠等 ID（1、30、144、147）始终被拒绝。在不应允许这些操作的实例中，请将 `allowSend`、`allowStack` 和 `ui` 设为 `false`。
- 请将用于自动化的 BeDD 游戏运行在独立实例中（可通过 `BeDD.exe launch --slot <n>` 实现），不要使用主账号的世界。

## 选项与 `bot.bedrock.bedd` {#options}

调用 `createBot({ transport: 'bedd', version, bedd })` 时，`bedd` 可取以下形式之一：

| `bedd` | 连接到 |
|---|---|
| `{}` | 唯一正在运行的 BeDD 游戏客户端（若有多个则报错并列出） |
| `{ pid }` | 指定进程 ID 的 BeDD 游戏 |
| `{ instance }` | 指定实例目录的 BeDD 游戏（例如 `'1.26.60.05-2'`，即 run 文件中的 `instance`） |
| `{ url, token }` | 原样使用该端点（例如自行从 run 文件中读取） |

以上任意形式均可附加以下选项：

| 选项 | |
|---|---|
| `bedd.home` | 查找时使用的 BeDD 主目录（默认为 `$BEDD_HOME`，未设置则为 `%LOCALAPPDATA%\BeDD`） |
| `bedd.timeoutMs` | 控制请求超时兼连接超时（默认 5000 ms；操作自带的 `timeoutMs` 会在此基础上再加 2 秒） |
| `bedd.modules` | 要附加的 `lib/bedd` 模块（默认按此顺序：`authority`、`router`、`router_actions`、`follower`、`surface`、`inventory`、`screens`） |
| `bedd.joinTimeoutMs` | `host` 加入服务器的最长等待时间（默认 60000 ms） |
| `bedd.WebSocket` | WebSocket 类（默认为 Node 的全局 `WebSocket`） |

指定 `host` / `port`（createBot 选项，`port` 默认为 19132）会让客户端在 bedboo 附加前先加入该服务器（执行带 `wait` 的 BeDD `join` 操作）；已在该服务器上游玩的客户端则保持不动。若没有 `join` 操作，或客户端放弃加入（`join_failed`；或 `not_allowed`：目标主机不在本机且被 `loopbackOnly` 阻止，即不在 BeDD 的 `allowHosts` 中，或 `allowHosts: ["*"]` 时主机无法解析），机器人会发出 `'error'`（`code: 'ERR_BEDD_JOIN'`，`reason` 为 BeDD 错误码）并结束。`bot._client.bedd.joined` 保存 `join` 的应答。

若 run 文件对应的进程已不存在（如游戏崩溃），则会跳过该文件。若没有匹配的游戏，机器人会发出 `'error'`（`code: 'ERR_BEDD_DISCOVERY'`）并结束。传入 `bedd.pipe`、`bedd.tapPipe` 和 `bedd.connect`（BeDD 0.3 及更早版本）会抛出错误并提示改用上述选项；仍在响应的 BeDD 0.3 或更早版本会以 `ERR_BEDD_PROTOCOL` 被拒绝（"BeDD v1 uses named pipes; upgrade BeDD"）。

- `bot._bedrock.mode === 'bedd'`。
- `bot.bedrock.bedd.url` / `endpoint`：当前使用的 WebSocket（不含 token），以及来自 run 文件时游戏的 `pid`、`instance` 和 `label`。
- `bot.bedrock.bedd.control`：`ping` 返回的 `protocol`（2）、`pid`、`defaultMode` 和 `modes`（`{ bedboo: [...], input: [...], ui: [...] }`）。
- `bot.bedrock.bedd.caps`：`{ [op]: 'present' | 'disabled' | 'absent' }`，涵盖 `tap`、`world`、`look`、`input`、`slot`、`button`、`action`、`send`、`stack`、`join`、`ui`、`settings`（经探测得出；`ui` 仅读取一个节点），以及 `ping.modes` 列出的其他操作（`key`、`text`、`mouse`、`raw`、`screenshot`……）。没有控制连接时，所有操作均为 `absent`，机器人只能观察。
- `bot.bedrock.bedd.sendAllow`：`send` 接受的数据包 ID（探测结果中的 `allow`）；没有 `send` 时为 `null`。
- `bot.bedrock.bedd.screens`：[界面辅助函数](#screens)（`read`、`find`、`click`、`setText`、`respawn`、`wake`、`editSign`、`idle`）。
- `bot.bedrock.bedd.supports(name)`：在当前 caps 下，指定的 mineflayer API（`'dig'`、`'craft'`、`'creative.setInventorySlot'`）或 BeDD 操作是否可用。
- `bot.bedrock.bedd.observed`：最近一次回显的 `player_auth_input` 的 `{ yaw, pitch, tick }`；首次回显前为 `null`。
- 错误：`BeddUnsupportedError`（包含 `code: 'ERR_BEDD_UNSUPPORTED'`、`bedd: true`、`feature`、`missing`；`missing` 中的 `'send:97'` 表示需要 `sendAllow` 含 97 的 `send`）；遇到不支持的数据包时还会在 `bot` 上发出 `'bedd_unsupported_packet'` `{ name, feature }`，每个名称仅触发一次。机器人 `'error'` 事件上的连接错误包括：`ERR_BEDD_DISCOVERY`、`ERR_BEDD_CONNECT`（连接被拒、token 错误、已离开）、`busy`（另一个客户端正占用 tap）、`disabled`（`tap: false`）、`ERR_BEDD_PROTOCOL` / `ERR_BEDD_HELLO`（BeDD 或游戏版本不匹配）、`ERR_BEDD_JOIN`（无法加入 `host`）。
- 除常规事件外的客户端事件：`'serverbound'` `{ name, params, reserialized }`（客户端发送的内容）、`'bedd_marker'`（tap 标记）和 `'warning'`（某个数据包解码失败，但数据流继续）。

## 路线图 {#roadmap}

- 驾驶 / 傀儡模式（抑制、注入并锁定姿态），前提是证实该锁定在客户端状态校正下仍能维持。
- 客户端切换世界（`LINK_DOWN` → `LINK_UP`）时直接跟随，而非结束机器人。
- 第二个分屏子客户端。
