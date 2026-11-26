# 多开

每个游戏都有独立的克隆（约 90 MB，耗时数秒）和 WebSocket；需要[服务器](/zh/guide/modes)的运行则会各自启动一个服务器。

<video controls muted playsinline preload="none" poster="/BeDD/showcase/desktop-poster.webp" src="/BeDD/showcase/desktop.mp4" width="1280" height="720" style="width:100%;height:auto"></video>

```powershell
BeDD.exe launch --slot 2 --json
BeDD.exe launch --slot 3 --json
BeDD.exe ps
```

## 槽位和克隆

N 号槽位对应克隆 `<gameVersion>-<N>`（见[克隆](/zh/guide/installs#克隆)）；1 号槽位也是如此，基础实例从不直接运行。槽位数量没有上限。每次并行运行（如 worktree、CI 任务）都应使用各自的槽位，因为使用同一槽位会共用同一个克隆及其存档。

## 并行测试的规矩

- 按**实例**查找对应的游戏（通过 `ps --json` 或 `run\<pid>.json`），切勿按进程名 `Minecraft.Windows` 查找；关闭游戏请使用 `BeDD.exe stop --pid <pid>`。
- 始终通过 `BeDD.exe launch` 启动游戏（否则会读取日常使用的配置文件数据）。
- 恢复测试存档后，运行 `BeDD.exe world singleplayer <instance> [<world folder>]`：由于所有游戏共用同一个联机登录，同时打开多个多人存档会触发 "Blaze" 报错。
- 需要在线加入服务器时，使用 `launch --exclusive-signaling`：每个游戏在运行期间都会以共享模式持有信令锁（`locks`），而带此参数的游戏会等待其他游戏全部关闭后再独占该锁。由于锁由游戏进程直接持有，即使脚本崩溃也不会造成锁泄漏。

## 管理窗口

游戏仅在管理窗口内显示：窗口本身位于屏幕外，没有任务栏图标，也不会出现在 Alt+Tab 列表中；管理窗口从不抢占焦点。可双击 `BeDD.exe` 打开，或由 `launch` 自动拉起；后续运行会自动复用该窗口。

![看标题栏：只有终端是激活的](/showcase/desktop-poster.webp)

- 每个游戏都会显示实时画面、`--label`、实例、pid 和输入状态。双击标题栏可单独查看该游戏；右键可进行控制、播放声音、关闭游戏、打开 `latest.log` 或实例目录，以及复制 WebSocket URL。
- 单击游戏画面即可像操作虚拟机一样**控制它**：键盘、鼠标、滚轮和视角都会交给该游戏，鼠标指针也会限制在画面内，连 Windows 键和 Alt+Tab 也会一并传入游戏。按 **Ctrl+左 Alt**（AltGr 仍可照常输入）或切换到其他窗口即可释放控制。控制期间 Alt+F4 无效。
- **在本机播放它的声音**（右键菜单）：勾选后，该游戏的声音会通过扬声器播放，直到取消勾选或关闭窗口为止。其余时间所有游戏均保持静音。
- 关闭管理窗口（需先确认）或将其强制结束，会一并关闭所有游戏。
- 命令行操作：`BeDD.exe ps`、`stop --pid <pid>`、`manager status`、`manager stop --yes`（跳过确认，直接全部关闭）。

如果游戏在 30 秒内未被管理窗口接管，或中途失去管理窗口，就会自动关闭（原因会记录在 `latest.log` 中）。在无头 CI 环境中，可配置 `manager=false`（见[配置](/zh/guide/configuration#配置项)）；此时游戏会保持隐藏且从不自行关闭，需使用 `BeDD.exe stop` 手动停止。
