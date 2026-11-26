# 世界在哪里运行

用于配置 `mode`（注意不要与[操作模式](/zh/guide/operation-modes)混淆）。

| 世界模式 | 运行什么 | 用途 |
|---|---|---|
| `ClientOnly`（默认） | 装有 BeDD 的游戏，单人或局域网世界；仅使用回环地址 | 大多数客户端模组测试 |
| `ClientServer` | 游戏 + 在 `127.0.0.1` 上装有 BeDD 服务端模组的基岩版专用服务器（BDS） | 客户端与服务端均由脚本控制；以服务器的速度为准 |
| `Remote` | 游戏加入未装 BeDD 的服务器，经 `allowHosts` 可达；不可设置速度 | 不归你管理的服务器 |

在 `launch` 前按克隆单独设置：`BeDD.exe mod config <instance> --world-mode <mode>`（`mod install` 也支持此参数）。`Remote` 模式需要指定 `--server-host <host>`，若目标主机不在本机则会加入 `allowHosts`；指定 `--server-host '*'` 则允许 `join` 连接任意服务器。

## 客户端 + 服务端

```powershell
BeDD.exe server init s1                     # %LOCALAPPDATA%\BeDD\servers\s1
BeDD.exe server start s1 --json             # name, pid, port, portV6, url, token, dir, logPath
BeDD.exe mod config 1.26.60.05-1 --world-mode ClientServer
BeDD.exe launch --slot 1 --json             # then: join 127.0.0.1:<port>
BeDD.exe server stop s1                     # sends stop (saves); kills after 30 s
```

服务器的 WebSocket（在 `ps --json` 中显示为 `kind: "server"`）接受 `ping`、`state`、`server`、`timescale` 和 `command`（详见[服务端目标](/zh/reference/websocket#服务端目标)），例如 `{op:"command", command:"time set day"}`。

### 准备服务器

`server init` 使用 lip（下载至 `tools`）安装 LeviLamina 服务端包（含 BDS 1.26.60，约 100 MB）及 BeDD 服务端模组（位于 `mods\BeDD-server`）。该命令具有幂等性，每台电脑同一时间仅执行一个初始化任务，且全程无需交互。

| 参数 | 默认 / 含义 |
|---|---|
| `<name>` | 必填；`servers`（`BEDD_SERVERS_DIR`）下的目录名，仅限字母、数字、`.`、`_`、`-` |
| `--port N` | IPv4 端口，IPv6 端口为 N+1；默认为服务器现有端口，若无则取自 19140/19141 起的第一对空闲端口（从不使用 19132） |
| `--from <dir>` | 服务端模组路径；默认依次查找 `BEDD_SERVER_MOD_DIR`、`BeDD.exe` 同级的 `mod\BeDD-server`、最近的 `bin\BeDD-server` |
| `--set key=value` | 设置任意 `server.properties` 键值，可重复指定 |

新服务器的默认配置如下：`transport=nethernet`（设为 `raknet` 会报错："Terracotta"），使用 TCP `server-port` 进行信令传输，UDP 为 `127.0.0.1:<port>`（`server-udp-ports`），首次加入时会询问"信任此服务器吗？"；`server-ip=127.0.0.1`（仅限本机加入；若需监听所有网卡，请传入 `--set server-ip=`）；`online-mode=false`（设为 `true` 则需要 Xbox 登录）；`gamemode=creative`、`difficulty=peaceful`、`allow-cheats=true`。服务端模组自身的配置项（如 `timeScale`、`trace` 等）位于 `mods\BeDD-server\config\config.json`。

`server list` 显示目录、端口和状态；`server path <name>` 输出服务器目录路径；`server remove <name> --yes` 删除指定服务器；`server stop --all` 停止所有服务器。并行运行时，请为每台服务器指定各自的名称（例如对应游戏的槽位名），且不要指定 `--port`。

### 启动

`server start <name>` 以无窗口方式运行 `bedrock_server_mod.exe`（日志输出至 `logs\console.log`），并等待 WebSocket 就绪（`--timeout` 默认为 180 秒）。为避免触发防火墙提示，出现以下任一情况时将拒绝启动：`mods\BeDD-server` 中没有 BeDD 模组、包含其他模组，或设置了 `"loopbackOnly": false`；若模组加载失败，则会停止服务器。`server init` 会设置 `server-ip=127.0.0.1` 并关闭局域网可见。传入 `--allow-firewall-prompt` 可跳过上述检查（如需允许其他电脑加入，请使用 `server init --set server-ip=`）。

## 远程

```powershell
BeDD.exe mod config 1.26.60.05-1 --world-mode Remote --server-host play.example.net
BeDD.exe launch --slot 1 --exclusive-signaling --json
```

除回环地址外，仅允许访问 `allowHosts` 中的主机（详见[不弹防火墙提示](/zh/guide/configuration#不弹防火墙提示)）。使用 `--server-host '*'` 时，每次执行 `join` 都会将目标主机加入白名单（`join` 探测字段：`allowHosts`、`anyHost`），其余主机依然保持阻断。连接需要联机登录的服务器时，必须加上 `--exclusive-signaling`（详见[规矩](/zh/guide/several-games#并行测试的规矩)）。
