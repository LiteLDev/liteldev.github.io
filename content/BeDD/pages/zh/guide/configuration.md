# 配置

模组读取 `mods\BeDD\config\config.json`（文件不存在时使用默认值）。请只通过 `BeDD.exe` 修改该配置（文件为硬链接）：

```powershell
BeDD.exe mod config 1.26.60.05-2                                        # print
BeDD.exe mod config 1.26.60.05-2 --set clientWidth=1600 --unset timeScale # --unset: back to default
```

`--set`（`mod install` 也支持）：值能按 JSON 解析则作为 JSON，否则作为字符串。`--world-mode` 用于设置 `mode` 和 `allowHosts`（见[世界在哪里运行](/zh/guide/modes)）。`mod install` 和 `launch` 还会设置 `mods\LeviLamina\config\Config.json` 中的 `modules.crashLogger.builtin`（否则 `CrashLogger.exe` 会闪出控制台窗口）。

## 配置项

| 配置项 | 默认 | |
|---|---|---|
| `clientWidth`、`clientHeight` | `0`（不改） | 窗口大小，用于保持点击位置稳定 |
| `wsPort` | `0`（空闲端口） | `127.0.0.1` 上的 WebSocket 端口，见 `run\<pid>.json`；仅在同时只运行一个游戏时才适合固定端口 |
| `wsMaxClients` | `8` | 最大并发连接数 |
| `allowOrigins` | `[]` | 允许连接的网页来源；带有其他 `Origin` 请求头的连接会收到 403 |
| `manager` | `true` | 显示在[管理窗口](/zh/guide/several-games#管理窗口)中，找不到管理窗口达 30 秒则自动关闭；`false`：隐藏，且永不自行关闭（适用于无头 CI） |
| `loopbackOnly` | `true` | 所有套接字仅绑定回环地址：不弹防火墙提示，也不显示来自其他主机的"局域网世界"。服务端模组：其 IPv4/IPv6 端口、局域网发现和 NetherNet 同样受此限制；由 `state` 报告该状态 |
| `mode` | `ClientOnly` | 可选 `ClientOnly`、`ClientServer`、`Remote`（见[世界模式](/zh/guide/modes)）；由 `state` 和 `join` 报告 |
| `allowHosts` | `[]` | 允许访问的非本机主机（Remote 服务器）；一旦列出主机，发往其他非本机主机的数据报一律拒绝（计入 `state` 的 `stats.sendsRefused`）。`"*"`：执行 `join` 时将目标主机加入白名单，无需重启即可连接任意服务器（其他主机照样拒绝） |
| `mute` | 忽略 | 保持静音，除非在管理窗口中打开声音；设为 `false` 只会记录一条警告 |
| `trace` | `false` | 将每次输入记录到 `logs\latest.log` |
| `timeScale` | `1` | 本游戏所主持世界的游戏速度，范围 0.05..20（可通过 `timescale` 操作修改）。连接 BeDD 服务器时以服务器为准；连接非 BeDD 服务器时无效。服务端模组：启动时生效，并同步给玩家 |
| `gameHooks` | `true` | 启用 bedboo 操作：`world`、`look`、`input`、`slot`、`action`、`button` |
| `tap` | `true` | 启用 `tap` 操作（见[Tap 协议](/zh/reference/tap)）：截取玩家的整个会话，并关闭 blob 缓存 |
| `tapLoopback` | `true` | 配合 `tap` 使用：同时截取单人世界和本机主持的局域网世界 |
| `tapJournalMiB` | `128` | 加入日志的大小上限；超出后，晚接入的读取方会收到 `complete:false` |
| `allowSend` | `true` | 启用 `send` 操作（聊天、命令） |
| `sendAllow` | `[9, 77, 78, 97]` | 允许 `send` 发送的数据包 id（text、command_request、command_block_update、book_edit）；login、inventory_transaction、player_auth_input、item_stack_request 始终拒绝。`"*"`：除客户端自身发送的数据包外全部允许（见[列表](/zh/reference/websocket#send-allow-all)） |
| `allowStack` | `true` | 启用 `stack` 操作（物品堆请求） |
| `ui` | `true` | 启用 `ui` 操作（见[UI 树](/zh/reference/ui)） |
| `uiMaxNodes` | `1000` | `format:"json"` 下 `ui` 回复的默认节点数上限（可由请求中的 `maxNodes` 覆盖） |

## 功能开关

功能开关 `gameHooks`、`tap`、`allowSend`、`allowStack`、`ui` 默认全部开启（令牌仅当前用户可读）。关闭后，对应操作会回复 `code:"disabled"`；例如设置 `allowSend=false` 会迫使聊天走游戏内的聊天界面。相关风险见[安全](/zh/reference/websocket#安全)。

## 不弹防火墙提示

当套接字绑定到非回环地址时，Windows 会按 exe 路径（即每个克隆）弹出一次防火墙提示。`loopbackOnly` 会将通配绑定改为回环地址；配合 `allowHosts` 使用时，出站 UDP 套接字会直接 connect 到目标主机，从而避免触发弹窗。即使连接远程服务器，也不要关闭 `loopbackOnly`。

## 环境变量

| 变量 | 读取方 | |
|---|---|---|
| `BEDD_HOME`、`BEDD_INSTANCES_DIR`、`BEDD_SERVERS_DIR` | `BeDD.exe`（模组读取 `BEDD_HOME`） | [目录](/zh/guide/installs#目录) |
| `BEDD_LEVILAUNCHER`、`BEDD_INSTANCE` | `BeDD.exe` | [用哪个实例](/zh/guide/installs#用哪个实例) |
| `BEDD_MOD_DIR`、`BEDD_SERVER_MOD_DIR` | `BeDD.exe` | 客户端模组构建目录（优先于 `mod\BeDD`，见[升级](/zh/guide/installs#升级)）/ `server init` 使用的服务端模组构建目录 |
| `BEDD_LIP` | `BeDD.exe` | `server init` 运行的 `lip.exe`（默认依次使用 `PATH` 中的、`tools` 目录下的，都没有则自动下载） |
| `BEDD_LABEL` | `BeDD.exe`、模组 | 管理窗口中显示的名称（同 `launch --label`） |
| `BEDD_RETURN_FOCUS` | 模组 | 若游戏启动时抢占了前台焦点，则将焦点归还（由 `launch` 设置） |
| `BEDD_DIR` | 你的测试框架 | 已解压的 Be.D.D. 目录（见[安装](/zh/guide/installs#让测试框架自己下载)） |
