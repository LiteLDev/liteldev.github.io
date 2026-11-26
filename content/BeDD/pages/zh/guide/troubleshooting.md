# 故障排查

| 现象 | 原因 → 解决 |
|---|---|
| HTTP 401 | 令牌错误或过期（每次启动都会换新）→ 从 `ps --json` 同时获取 `url` 和 `token` |
| HTTP 403 | 带有 `Origin` 请求头 → 去掉该请求头，或将其列入 `allowOrigins` |
| 连接被拒绝 | 尚未启动完成或已退出 → 不带 `--detach` 运行 `launch` |
| 连接过多 | 超过 `wsMaxClients`（8）→ 关闭部分连接 |
| 游戏约 30 秒后关闭 | 没有管理窗口（见 `latest.log`）→ 查看 `manager status`、`logs\manager.log`，去掉 `--no-manager`；CI：配置 `manager=false` |
| 克隆耗时数分钟、占用数 GB | 跨卷复制 → 将 `BEDD_INSTANCES_DIR` 设到基础实例所在盘，重新克隆（[克隆](/zh/guide/installs#克隆)） |
| 找不到 LeviLauncher | 未安装或版本低于 1.1 → 更新，或设置 `BEDD_LEVILAUNCHER` |
| 找不到实例 | → `LeviLauncher.exe install 1.26.60 --loader`；有多个实例：设置 `BEDD_INSTANCE`；见 `instance list --bases --all` |
| 没有 WebSocket，模组未加载 | 版本不是 1.26.60 + LeviLamina 26.60.x（见 `latest.log`）→ `LeviLauncher.exe loader install`、`instance refresh` |
| 克隆中的 BeDD 模组过旧或版本不对 | 使用了 `--keep-mod`、游戏正在运行或 `--from` 固定了来源 → `mod install <instance>`（[升级](/zh/guide/installs#升级)） |
| "发生错误"（"Blaze"） | 共用登录 → `world singleplayer`；在线：`--exclusive-signaling` |
| 游戏使用了平时的存档和设置 | 不是用 `launch` 启动的，或基础实例不是用 LeviLauncher 1.1+ 安装的 |
| 每个克隆都弹出防火墙提示 | `loopbackOnly` 已关闭 → 将其打开；未装 BeDD 的服务端会询问一次（点取消） |
| 启动时闪现控制台窗口 | `CrashLogger.exe` → `launch` 会自动修复（[配置](/zh/guide/configuration)） |
| 关掉了其他人的游戏 | 按进程名查找所致 → 改为按实例查找；每次运行使用一个槽位 |
| 断开后 `button` 未生效 | 无终点的 `down` 被自动松开 → 改用 `click`/`holdTicks`/`releaseOn`（[多条连接](/zh/guide/usage#多条连接)） |
| `look` 超时，游戏操作无反应 | 世界已暂停（不走刻）→ `key ESC` |
| `ui` `stale_ref` / `occluded` / `not_ready` / `unsupported` | → 重新读取 `ui` / `force:true` / 重试 / [模拟输入](/zh/guide/operation-modes#模拟输入)（[UI 树](/zh/reference/ui)） |
| `code:"disabled"` | [功能开关](/zh/guide/configuration#功能开关)为 `false`；`unknown op`：当前版本没有该操作 |

## 报告 bug

请[提 issue](https://github.com/LiteLDev/BeDD/issues/new/choose)，并附上 `BeDD.exe version`、请求和结果、`mod config <instance>`，以及开启 `trace=true` 时的 `logs\latest.log`（会显示输入以及输入是模拟的还是真实的）。
