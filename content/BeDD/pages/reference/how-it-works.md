# How it works

| Part | Mechanism |
|---|---|
| Transport | RFC 6455 on Winsock, SHA-1 from CNG; text = JSON, binary = [tap](/reference/tap); thread per connection ([protocol](/reference/websocket)) |
| Keys, text, pointer | Queued + `PostMessage(hwnd, WM_LHI)`; subclassed WndProc (game thread) sets the virtual state and calls the game's WndProc with `WM_KEYDOWN`/`WM_KEYUP`, `WM_CHAR`, and `WM_MOUSEMOVE` + virtual cursor (hooked `GetCursorPos`), which is handled as real input. Replies after dispatch |
| Buttons, wheel, camera | GameInput v2 (`GameInputRedist.dll`) ignores window messages: hooked `IGameInputReading::GetMouseState`, `GetKeyCount`, `GetKeyState`; `GetCurrentReading` gets a virtual reading before the device reports |
| No foreground | `launch`: `CreateProcessW` + `SW_SHOWNOACTIVATE`; hooked `ShowWindow`, `SetWindowPos`, `SetActiveWindow`, `BringWindowToTop`, `SetForegroundWindow`; bottom of Z-order; `WM_ACTIVATEAPP(0)`/`WM_KILLFOCUS`/`WM_ACTIVATE(inactive)` swallowed (no pause). Installed in `load()` (window exists before `enable()`). Fake "focus gained" skips default `WM_ACTIVATE` (hooked `DefWindowProcW`). `BEDD_RETURN_FOCUS`: window to refocus if the game activates while starting |
| Real input blocked | `WM_KEY*`/`WM_MOUSE*`/`WM_INPUT`/`WM_POINTER*` swallowed; virtual `ClipCursor` (no-op), `SetCursorPos`, `GetCursorPos`, `GetPhysicalCursorPos`, `GetAsyncKeyState`, `GetKeyState`, `GetKeyboardState`, `GetForegroundWindow`/`GetActiveWindow`/`GetFocus` (game window), `GetRawInputData`/`GetRawInputBuffer` (dropped) |
| Screenshot | `PrintWindow(PW_RENDERFULLCONTENT)` (covered or off-screen OK), WIC |
| Clones | The LeviLauncher instance (found with `LeviLauncher.exe instance list --json`) is never written to. `%LOCALAPPDATA%\BeDD\instances\<gameVersion>-<slot>`: hardlinks (copies across volumes) with its own `mods\`, worlds, and options; changed files are replaced, not edited. The loader resolves from the executable folder (keep the executable name), with data in its `Minecraft Bedrock` folder |
| Manager | `BeDD.exe`, one per logon session: DWM thumbnails; `launch` starts it outside the caller's process tree; attaches via discovery files ([`manager`](/reference/websocket#system-ops)); closing it sends `close`. Game window: off-screen tool window from creation (hooked `CreateWindowExW`: no message pump before `enable()`); `SetWindowPos` moves are dropped, and a watcher restores the position |

