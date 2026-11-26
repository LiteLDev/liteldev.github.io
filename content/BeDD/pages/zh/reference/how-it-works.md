# 工作原理

| 部分 | 机制 |
|---|---|
| 传输 | 基于 Winsock 的 RFC 6455，SHA-1 来自 CNG；文本 = JSON，二进制 = [tap](/zh/reference/tap)；每条连接一个线程（[协议](/zh/reference/websocket)） |
| 按键、文字、指针 | 入队 + `PostMessage(hwnd, WM_LHI)`；子类化的 WndProc（游戏线程）设置虚拟状态，以 `WM_KEYDOWN`/`WM_KEYUP`、`WM_CHAR`、`WM_MOUSEMOVE` + 虚拟光标（钩住的 `GetCursorPos`）调用游戏的 WndProc，按真实输入处理。派发后回复 |
| 按钮、滚轮、视角 | GameInput v2（`GameInputRedist.dll`）忽略窗口消息：钩住 `IGameInputReading::GetMouseState`、`GetKeyCount`、`GetKeyState`；`GetCurrentReading` 在设备上报前获取虚拟读数 |
| 不抢前台 | `launch`：`CreateProcessW` + `SW_SHOWNOACTIVATE`；钩住 `ShowWindow`、`SetWindowPos`、`SetActiveWindow`、`BringWindowToTop`、`SetForegroundWindow`；置于 Z 序最底；吞掉 `WM_ACTIVATEAPP(0)`/`WM_KILLFOCUS`/`WM_ACTIVATE(inactive)`（不暂停）。钩子在 `load()` 中安装（窗口在 `enable()` 之前已存在）。伪造的“获得焦点”会跳过默认的 `WM_ACTIVATE`（钩住的 `DefWindowProcW`）。`BEDD_RETURN_FOCUS`：游戏启动时若被激活，需重新聚焦的窗口 |
| 屏蔽真实输入 | 吞掉 `WM_KEY*`/`WM_MOUSE*`/`WM_INPUT`/`WM_POINTER*`；虚拟化 `ClipCursor`（空操作）、`SetCursorPos`、`GetCursorPos`、`GetPhysicalCursorPos`、`GetAsyncKeyState`、`GetKeyState`、`GetKeyboardState`、`GetForegroundWindow`/`GetActiveWindow`/`GetFocus`（游戏窗口）、`GetRawInputData`/`GetRawInputBuffer`（丢弃） |
| 截图 | `PrintWindow(PW_RENDERFULLCONTENT)`（被遮挡或在屏幕外均可），WIC |
| 克隆 | 从不写入原实例（`LeviLauncher.exe instance list --json`）。`%LOCALAPPDATA%\BeDD\instances\<gameVersion>-<slot>`：硬链接（跨卷时复制），拥有独立的 `mods\`、世界与选项；改动的文件整体替换，不原地编辑。加载器从 exe 所在文件夹解析（保持 exe 名）：数据位于其 `Minecraft Bedrock` 中 |
| 管理器 | `BeDD.exe`，每个登录会话一个：DWM 缩略图；`launch` 在调用方进程树之外启动它；通过发现文件附加（[`manager`](/zh/reference/websocket#系统操作)）；关闭它会发送 `close`。游戏窗口：从创建起即为屏幕外的工具窗口（钩住 `CreateWindowExW`：`enable()` 前无消息泵），丢弃 `SetWindowPos` 移动操作，并由监视器复位 |

