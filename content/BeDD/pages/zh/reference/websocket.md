# WebSocket 接口

契约：[bedd.asyncapi.yaml](https://levimc.org/BeDD/bedd.asyncapi.yaml)（`spec/`，AsyncAPI 3.0；[Studio](https://studio.asyncapi.com/?url=https://levimc.org/BeDD/bedd.asyncapi.yaml)）。

## 连接

服务监听期间会生成发现文件 `%LOCALAPPDATA%\BeDD\run\<pid>.json`（根目录为 `BEDD_HOME`）；跳过已退出的 pid。`BeDD.exe ps --json` 会列出相同内容。

```json
{"protocol": 2, "kind": "client", "pid": 23116, "url": "ws://127.0.0.1:53021/v1", "token": "9c1f…(64 hex)",
 "instance": "1.26.60.05-2", "instanceDir": "…\\instances\\1.26.60.05-2", "label": "smoke test", "modVersion": "0.4.0", "startedAt": "2026-11-13T09:41:07Z"}
```

| 项 | |
|---|---|
| `kind` | `client`（游戏）或 `server`（[服务端构建](#服务端目标)） |
| 端口 | 配置项 `wsPort`（默认为 0，每次启动自动分配空闲端口）；从发现文件读取 |
| 令牌 | 32 个随机字节，每次启动重新生成。通过 `Authorization: Bearer <token>` 或 `?token=<token>` 传递；错误或缺失返回 HTTP 401 |
| Origin | 握手带 `Origin` 头时返回 HTTP 403，除非已在配置项 `allowOrigins` 中放行（默认为空），因此浏览器无法连接 |
| 限制 | 仅限 `127.0.0.1`；最多 `wsMaxClients` 条连接（8）；UTF-8 JSON 文本消息 ≤ 16 MiB；不压缩 |

Node.js 24（其内置 `WebSocket` 不支持设置请求头）：

```js
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = join(process.env.BEDD_HOME ?? join(process.env.LOCALAPPDATA, 'BeDD'), 'run');
const game = readdirSync(dir).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
  .find((e) => e.kind === 'client'); // and its pid alive
const ws = new WebSocket(`${game.url}?token=${game.token}`);
ws.onopen = () => ws.send(JSON.stringify({ id: 1, op: 'world' }));
ws.onmessage = (e) => { console.log(JSON.parse(e.data)); ws.close(); };
```

## 请求与回复

```json
{"id": 7, "op": "look", "yaw": 90, "pitch": 0}
{"id": 7, "ok": true, "yaw": 90, "pitch": 0, "tick": 5182, "turns": 1}
```

- `id`：任意 JSON 值，原样返回。失败时返回 `{id, ok:false, error, code?, key?}`；请按 `code` 判断错误类型（见[错误](#错误)）。
- 单条连接内按顺序处理请求；如需并行请求，请建立多条连接。
- 探测：不带参数发送操作（此时 bedboo 操作为只读）：返回 `unknown op` 表示不存在，`disabled` 表示已关闭，`ok` 表示可用。

## 选择模式

优先使用 bedboo 操作，其次是 `ui`，最后是 input 操作（见[原因](/zh/guide/operation-modes)）。`ping` 会列出这些操作：

```json
{"ok": true, "protocol": 2, "pid": 23116, "kind": "client", "defaultMode": "bedboo",
 "modes": {"bedboo": ["world","look","input","slot","action","button","settings","send","stack","timescale","join","tap"],
           "ui": ["ui","oreui"], "input": ["key","text","mouse","raw","release","flush","focus","window","screenshot"]},
 "hwnd": 4589122, "managed": true, "client": {"w": 1280, "h": 720}, "cursor": {"x": 640, "y": 360}, "realForeground": false}
```

## bedboo 操作

对应配置键为 `false` 时返回 `disabled`。

| 操作 | 配置键 | 探测回复 | 动作字段（默认值） |
|---|---|---|---|
| `world` | `gameHooks` | `inLevel`、`levelEpoch`（每进一个世界 +1）、`topScreen`、`mouseGrabbed`、`showingMenu`、`inputMode` mouse\|touch\|gamepad\|undefined、`player{runtimeId, eye{x,y,z}, rot{yaw,pitch}, slot}`（null：无世界）、`tick` | 无 |
| `look` | `gameHooks` | `inLevel, yaw, pitch, tick` | `yaw`、`pitch`、`timeoutMs`（1000\*，≤60000） |
| `input` | `gameHooks` | `active`、`via` hooks\|keys、`hooks{raw,state}`、`tick`、`applied`、`ticksLeft` | `move{x,z}`、`jump`、`sneak`、`sprint`、`ttlMs`（300）或 `ttlTicks` |
| `slot` | `gameHooks` | `slot`（null：无世界） | `slot` 0..8、`timeoutMs`（1000\*） |
| `action` | `gameHooks` | `names` | `name` drop\|dropAll\|inventory\|perspective\|pause\|swing；`hand` main\|off（swing）；`timeoutMs`（1000\*） |
| `button` | `gameHooks` | `held` | `button` attack\|use\|pick；`action` down\|up\|click（click）；`holdTicks`（click：2）；`releaseOn` blockChange；`timeoutMs`（1000\*） |
| `settings` | `gameHooks` | `renderDistance`（区块；首次进入世界前为 null）、`inLevel` | `renderDistance`（区块，1..255） |
| `send` | `allowSend` | `allow`（`sendAllow` 中的 id；配置为 `"*"` 时逐个列出）、`allowAll` | `buf`、`timeoutMs`（2000\*，≤10000） |
| `stack` | `allowStack` | `enabled, via:"raw", stats{sent, answered, rejected, failed, resyncs}` | `buf`、`timeoutMs`（2000\*）；或 `view:true` |
| `tap` | `tap` | `enabled`、`attached`、`link{state up\|down, type remote\|local, address}`、`journal{frames, bytes, complete}`、`lastReplay`、`replay`、`counters{in, out, dropped, sent, readers}`、`hooks` | `action:"subscribe"` → [tap 流](/zh/reference/tap) |
| `timescale` | 无 | [见下](#timescale-游戏速度) | `scale`、`paused`、`timeoutMs`（2000） |
| `join` | 无 | `mode`、`connection` none\|local\|remote、`host`、`port`、`inLevel`、`joining`、`last` | `host`（null：离开世界）、`port`（19132）、`wait`、`timeoutMs`（60000） |

\* 指 ≥20 tick/s 时的数值；更慢时，默认值按“tick 间隔 / 50 ms”比例放大（不超过上限）。`not_in_level`：20 个 tick 间隔（≥1 s）内没有客户端 tick。

| 操作 | 行为 | 错误 |
|---|---|---|
| `look` | 绝对角度；当两个角度误差均在 0.5° 以内时，回复 `yaw, pitch, tick, turns`。Yaw 0 = +Z，90 = -X；pitch -90 = 朝上，限制在 ±89.9 | `not_in_level`、`timeout`（带当前 yaw/pitch）、`busy`（有更新的 `look` 请求）、`bad_args` |
| `input` | `move`：`x` = 左右，`z` = 前后，限制在 [-1,1]，斜向会自动归一化。在请求发出 `ttlMs`（≤60000，超出则截断）后结束（如需持续移动请不断刷新），或遇到 `ttlMs:0`、`release` 时结束。`ttlTicks`（≤1200）按客户端 tick 计数，若 5 s 无 tick 也会结束。状态在连接断开后仍会保持。`via:"hooks"`：仅在捕获鼠标且无界面时生效；`applied` = 已写入的 tick 数。`via:"keys"`（钩子缺失）：像 `key` 一样按住 W/A/S/D、SPACE、LSHIFT、LCTRL（会作用于界面，且修改键位后失效） | `bad_args`（同时给出了 `ttlTicks` 与 `ttlMs`）、`not_in_level`（指定 `ttlTicks` 但无 tick） |
| `slot`、`action`、`button` | 在下一个客户端 tick 生效后回复（带 `tick`）。暂停的单人世界不会推进 tick，需先用 `key` 发送 ESC 恢复游戏 | `not_in_level`、`busy`（界面已打开；此时 `button up` 仍可用）、`timeout`、`bad_args`、`refused` |
| `slot` | 模拟快捷栏按键 1..9；选中后回复（`slot`、`via` keys\|none） | |
| `action` | 按键在下一 tick 松开：drop 对应 Q、dropAll 对应 Ctrl+Q、inventory 对应 E、pause 对应 Escape（均按默认键位）；perspective 直接调用游戏函数。`swing`：仅挥手不攻击，由客户端自行发送 animate 包；打开界面时也可使用；`hand:"off"` 仅在本客户端可见。回复 `name`、`hand` | |
| `button` | 虚拟 GameInput 左/右/中键；经过 `holdTicks` 后松开，或当设为 `releaseOn:"blockChange"` 时，在 `down` 瞬间瞄准的方块改变、变成空气或不再被瞄准时松开。`up` 会立即松开。操作从不阻塞。回复 `held`、`block{x,y,z}`。连接断开时仅松开未设终点的 `down`；其余按原计划执行，其中 `releaseOn` 最多再持续 1200 tick | `refused`：未瞄准方块 |
| `settings` | `renderDistance` 在下一客户端 tick 设置所有渲染器（普通、Vibrant Visuals、光线追踪）的渲染距离（不写入 options.txt），随后客户端发出 request_chunk_radius，服务端批准的半径将通过 chunk_radius_update 到达（tap）。回复 `renderDistance`（当前渲染值）、`requested`、`tick` | `not_in_level`、`timeout`、`bad_args`、`unavailable` |
| `send` | `buf`：base64 编码的发往服务端数据包（varint 头 + 包体，bedrock-protocol），由本地玩家发送；回复 `packetId, name`。统计：`state.stats.send{sent, refused, failed, lastError}` | `bad_args`（无法解析，未发送）、`refused`（不在 `sendAllow` 中） |
| `join` | 可从标题界面或世界中发起（若在世界中会先离开：`left`）；自动应答 "Online play is not rated"（Proceed）和 "Trust this server?"（Trust and Join）。开始连接后返回 `started:true`；若设 `wait:true` 则返回 `joined:true`。连接非本机主机需配置 `allowHosts`（Remote 模式）；`allowHosts` 含 `"*"` 时会解析该主机并加入（解析失败返回 `not_allowed`）。`host: null` 会离开世界（保存并退出 / 断开连接）：返回 `left:true`（设 `wait` 时在保存并回到菜单后返回；否则返回 `started:true`），不在世界中时返回 `left:false` | `join_failed`、`timeout`（`screen`）、`busy`、`not_allowed`、`stopped`、`no_client`、`unavailable`、`bad_args` |

### `stack`：通过客户端发送物品堆请求

| 形式 | 回复 |
|---|---|
| `{op:"stack", buf}` | 发送后返回 `{via:"raw", requestIds, map:{"<caller id>": client id}}` |
| `{op:"stack", view:true}` | `{inventory, ui, open?:{containerId, type, items}}`，条目格式为 `{slot, item, count, stackId}` |

- `buf`：一个 item_stack_request 数据包（id 147）；其他 id 或无法解析的字节返回 `bad_args`。
- 每个请求分配一个客户端 id：负奇数，从 `-0x40000001` 递减。本请求及此前最近 256 个请求中，引用了调用方 id 的 stack id 会被改写。`map` 的键为字符串形式的调用方 id。
- item_stack_response（tap）可能早于回复到达，需先暂存。
- 无客户端预测。请求被接受时，客户端发送 `inventory_transaction {type: inventory_mismatch}`，服务器重发背包；被拒绝时无变化。
- 必须先打开所需界面（如背包、箱子）：可通过 `action inventory`、`key E` 或使用方块打开。

### `timescale`：游戏速度

调整本游戏托管的世界（单人、局域网主机）的速度时，客户端与本地服务端会同步调整。请求（`scale`、`paused`）在两侧都按新速度运行后返回探测内容；探测结果还包含 `local` 和 `inLevel`。

| 字段 | |
|---|---|
| `scale` | 0.05..20，超出范围则截断（1 = 20 tick/s） |
| `paused` | 两侧同步停止/恢复，效果同暂停菜单 |
| `source` | `default`、`config`（进入世界时应用的 `timeScale`）、`local`（本接口）、`server`（BeDD 服务端） |
| `tps{client, server}` | 最近 2 s 的 tick/s；暂停时为 0；远程服务器上 `server` 为 null。本地实测：0.05→1、0.5→10、2→40、3→60、5→100、10→200、20→400 |
| `ticksPerSecond` | 客户端计时器基准速率（20） |
| `effective{client, server}` | 两侧最近一次应用的 `{scale, paused, ticksPerSecond}`（应用前为 null） |

离开世界时重置为 1；进入世界时应用 `timeScale`（默认为 1）。错误：`not_in_level`、`remote`（世界不在本机托管）、`server_led`（由 BeDD 服务端设置，需在服务端修改）、`timeout`（之后仍会生效）、`refused`、`bad_args`。BeDD 服务端在速度变更或玩家加入时发送 level_event 3007（SimTimeScale，pos 0,0,0，`data` 为按 int32 编码的 float 位模式，0 表示暂停）；客户端随之调整（收到 0 则暂停，同时保留原 scale）。

### 谁发什么（bedboo 传输 `bedd`）

发往服务端的数据包全部由客户端发出。bedboo 的 `lib/bedd/authority.js` 会丢弃客户端自行生成的数据包，将其余数据包映射为对应操作（`input`、`look`、`slot`、`button`、`action`、`settings`、`stack`、`join`、key ESC）：用 `send` 发送 text 和 command_request（后备方案：T/SLASH、`text`、ENTER），通过 `ui` 操作离开床和告示牌编辑界面，对 `sendAllow` 中的其他 id 用 `send` 原样发送，其余情况抛出 ERR_BEDD_UNSUPPORTED（BeddUnsupportedError）。

## ui 操作

`ui` 将界面读取为带 ref 的文本并对 ref 执行动作；`oreui` 返回原始 Ore UI DOM；`mouse` 可传入 `ref`。配置键 `ui` 同时控制这三项。字段、回复和错误详见 [UI 树](/zh/reference/ui)。

## input 操作

无配置键。游戏线程派发输入后返回回复（`timeoutMs` 5000）。

| 操作 | 字段（默认） | |
|---|---|---|
| `key` | `key` 或 `vk`（1..254）；`action` press\|down\|up（press）；`holdMs`（60） | 字母、数字、ESC、ENTER、BACK、TAB、SPACE、SHIFT、CTRL、ALT、LEFT/UP/RIGHT/DOWN、HOME、END、PGUP、PGDN、INSERT、DELETE、F1..F24、SLASH、GRAVE、MINUS、EQUALS |
| `text` | `text`、`delayMs`（0） | 每个 UTF-16 单元发送一条 `WM_CHAR` |
| `mouse` | `action` move\|down\|up\|click\|wheel（move）；`x`、`y`（客户区像素）或 `rx`、`ry`（比例）或 [`ref`](/zh/reference/ui#引用上的-mouse)；`button` left\|right\|middle（left）；`notches`（1）；`holdMs`（80，≥50）；`settleMs`（50，先悬停）；`afterMs`（50） | 先移动虚拟光标，再发送 GameInput 按键/滚轮事件 |
| `raw` | 同 `mouse`，另支持 `dx`、`dy`（计数）、`steps`（1，分摊到多帧） | 鼠标被捕获时转动视角 |
| `release` | | 松开所有按住的键/按钮（跨所有连接）并清除 `input` 覆盖 |
| `focus` | | 重发“获得焦点”事件 |
| `window` | `clientWidth`、`clientHeight` | 调整窗口大小；回复 `result` + 窗口字段；从不激活窗口 |
| `flush` | | 等待所有已投递的输入派发完成 |
| `screenshot` | `format` png\|jpeg、`quality`、`maxWidth`（960）、`region{x,y,w,h}` | `{width, height, format, data}`（base64） |

## 系统操作

| 操作 | 回复 |
|---|---|
| `ping` | 见[示例](#选择模式)；窗口出现前 `hwnd` 为 0，`managed` 表示已有管理器附加，`audio` 表示声音已开启，`grabbed` 表示游戏已捕获鼠标 |
| `state` | 窗口字段、`stats{synthetic, swallowedInput, swallowedFocus, passed, realForegroundSeen, api, gameInput, loopbackRebinds, serverQueriesRefused, audio, tapLoopback, send, journal, sendsRefused}`、`clients`、`held[{vk, client}]`、`hooks{name: installed}`、`mode` ClientOnly\|ClientServer\|Remote、`connection{connection none\|local\|remote, inLevel, host, port}` |
| `manager` | `action:"attach"`：将当前连接设为管理器；窗口保持在屏幕外，不显示在任务栏和 Alt+Tab 中。配置 `manager` 为 true（默认）时，若窗口出现后 30 s 内无管理器附加，或已附加的管理器断开，游戏即关闭；设为 `false` 时，仅隐藏窗口，从不自动关闭。标签取自环境变量 `BEDD_LABEL`。回复包含 `audio`。以下操作仅限已附加的管理器调用：`action:"audio"`，`on` true\|false（在本机播放游戏声音，管理器断开即关闭）；`action:"input"`，`events[]` 为 `{t:"key", vk, down}`、`{t:"char", c}`、`{t:"move", x, y}`、`{t:"raw", dx, dy}`、`{t:"button", button, down}`（left\|right\|middle\|x1\|x2）、`{t:"wheel", notches}`、`{t:"release"}`（用于转发用户在管理窗口中控制游戏时的输入，不等待派发，直接回复 `{grabbed, audio}`） |
| `close` | 回复 `{ok}`，随后关闭游戏 |

## 错误

| code | 含义 |
|---|---|
| `disabled` | 对应配置键为 `false`（详见 `key` 字段），或正在卸载 |
| `not_in_level` | 不在世界中（服务端表示尚未启动） |
| `refused` | 游戏拒绝执行（id 不在 `sendAllow` 中，或 `releaseOn` 目标位置无方块） |
| `timeout` | 未在 `timeoutMs` 内完成（之后仍可能完成） |
| `bad_args` | 字段值无效或字节无法解析 |
| `bad_request` | 请求无法处理：发送了二进制消息；`tap`/`manager` 的 action 未知或无连接；`ui` 动作缺少 `ref`、`action` 未知，或 `setText` 缺少 `text` |
| `internal` | `ui` 动作的子操作回复无法解析（属于 bug） |
| `busy` | 界面已打开、有更新的 `look` 请求、join 正在进行中，或 tap 已被占用 |
| `stopped` | 正在卸载 |
| `join_failed` | 放弃 join（客户端会显示具体原因） |
| `not_allowed` | 非本机主机、受限于 `loopbackOnly`、不在 `allowHosts` 中（或配置含 `"*"` 时域名无法解析） |
| `unavailable` | 所需钩子未安装（详见游戏日志） |
| `no_client` | 尚无客户端实例 |
| `remote` | 世界运行在非本机托管的服务器上 |
| `server_led` | 游戏速度由 BeDD 服务端主导 |
| `stale_ref`、`occluded`、`not_ready`、`unsupported` | 见 [UI 树错误](/zh/reference/ui#错误) |

无 `code` 的情况：未知操作、消息不是 JSON 对象、输入未能及时派发、名称无效（key、button）。

## 多个客户端

窗口输入类操作在各连接间串行执行；`ping`、`state`、`manager`、`close`、`tap`、`world`、`look`、`input`、`settings`、`send`、`stack`、`timescale`、`join`、`screenshot`、`oreui` 以及 `ui` 读取操作则不串行。连接断开时的处理如下：

| 按住的 | |
|---|---|
| `key`/`mouse` `down` | 自动松开（除非被另一条连接重新按下） |
| `button` | 见上文 |
| `input` 覆盖 | 继续运行至截止时间 |
| 管理器 | 关闭游戏 |

模组中的每连接状态详见[代码规范](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#code-rules)。

## 安全

任何能读取发现文件的进程（即该用户的进程）都能控制游戏。令牌采用常数时间比较。

- `send`：以已登录玩家的身份发包，仅限 `sendAllow` 中的数据包（默认为 9 text、77 command_request、78 command_block_update、97 book_edit）。id 为 1、30、144、147 的数据包始终拒绝。请仅对自己的服务器放宽此限制。
- <a id="send-allow-all"></a>`sendAllow: "*"`：允许除以下客户端自身发送的数据包外的所有数据包，排除项包括：1 login、4 握手、8 资源包应答、23 tick_sync、30、44 animate、45 respawn、75 show_credits、93 player_skin、94 subclient_login、113 set_local_player_as_initialized、115 network_stack_latency、129/135 客户端缓存、144、147、152 emote_list、175 subchunk_request、193 request_network_settings、312 serverbound_loading_screen。由于其他数据包并非由客户端自身发出，发送后可能导致客户端与服务器状态不一致。
- `stack`：在任意服务器上移动、合成、丢弃和销毁玩家的物品。
- tap：作用于整个会话。

请关闭不需要的 `allowSend`、`allowStack` 和 `tap`；切勿分享令牌。

## 服务端目标

`--target_type=server`（[构建](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#building)）在装有 LeviLamina 的 BDS 中运行：使用相同的 WebSocket，`kind:"server"`，对其他操作均回复 `unknown op`。

| 操作 | 字段（默认） | 回复 |
|---|---|---|
| `ping` | | `protocol`、`pid`、`kind`、`target:"server"` |
| `state` | | `target`、`clients`、`loopbackOnly`、`stats{loopbackRebinds, serverQueriesRefused}` |
| `server` | | `tick`、`tps`（2 s）、`paused`、`port`（`server-port`）、`players[{name, xuid}]` |
| `timescale` | `scale` 0.05..20、`paused`、`timeoutMs`（5000）；都不提供 = 探测 | `scale`、`paused`、`source` default\|config\|local、`tps{client:null, server}`、`ticksPerSecond`（20 × scale，暂停时为 0） |
| `command` | `command`（可省略 `/`）、`timeoutMs`（10000） | `success`、`successCount`、`output[]`，同控制台 |

变更时及每个玩家生成时均会广播 level_event 3007（见上文）。`tps.server` 可能滞后于 `ticksPerSecond`。错误：`not_in_level`、`bad_args`、`timeout`。
