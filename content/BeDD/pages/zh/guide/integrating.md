# 接入你的测试

无需客户端库：运行 `BeDD.exe`，再通过 [WebSocket](/zh/guide/usage) 驱动，优先用 bedboo（[选用顺序](/zh/guide/operation-modes#用哪一种)）。

```powershell
BeDD.exe instance clone --slot 2                   # then copy your mod into (BeDD.exe instance path 1.26.60.05-2)\mods
BeDD.exe world singleplayer 1.26.60.05-2 <world>   # after restoring your test world
BeDD.exe launch --slot 2 --label my-mod --json     # pid, url, token
BeDD.exe stop --pid <pid>
```

```js
const bot = bedboo.createBot({ transport: 'bedd', bedd: { url: game.url, token: game.token } });
```

- stdout 只输出结果：`--json` 输出单个文档，`-q` 输出标识符，`-v` 在 stderr 输出细节。出错时输出 `error: …` 和 `hint:`（`{"error":{code,message,exit,hint}}`）。
- 退出码：`0` 成功，`1` 失败，`2` 用法错误，`4` 未找到，`5` 冲突（如槽位占用），`10` 被拒绝。
- 每次并行运行占用一个槽位，无需清理。
- 自编译的 BeDD：`mod install <instance> --from <dir>`（[固定来源](/zh/guide/installs#升级)）。
- `BeDD.exe dev`：开发模组的常用操作（见 `--help`）。

PowerShell：用 `[System.Net.WebSockets.ClientWebSocket]`，每次操作发送一条 UTF-8 文本消息，读取至 `EndOfMessage` 为止。`Focus-Game` 和 `Assert-GameForeground` 为空操作。

## 从 PowerShell 客户端迁移

模块、垫片和命名管道均已移除，操作保持不变。克隆目录已从 LeviLauncher 的 `versions\<base>-hi<slot>` 迁至 `instances\<gameVersion>-<slot>`。

| Be.D.D. 1 | Be.D.D. 2 |
|---|---|
| `Connect-BeDD [-PipeName p]` | `BeDD.exe ps --json` 或 `run\<pid>.json`；连接 `url?token=…` |
| `Invoke-BeDD @{ op = … }` | 通过 WebSocket 发送相同的 JSON |
| `Get-BeDDState`、`Get-BeDDWorld`、`Set-BeDDLook`、`Set-BeDDInput`、`Set-BeDDSlot`、`Invoke-BeDDAction`、`Set-BeDDButton`、`Send-BeDDPacket`、`Send-BeDDStack`、`Get-`/`Set-BeDDTimeScale`、`Join-BeDDServer`、`Send-BeDDKey`、`Clear-BeDDInput`、`Set-BeDDWindow` | 操作 `state`、`world`、`look`、`input`、`slot`、`action`、`button`、`send`、`stack`、`timescale`、`join`、`key`、`release`、`window` |
| `Send-BeDDText`、`Send-BeDDMouse`、`Send-BeDDRaw` | 优先用 `bot.chat`、针对 `ref` 的 `ui` click、`look`；其余情况用操作 `text`、`mouse`、`raw` |
| `Save-BeDDScreenshot`、`Get-BeDDBitmap` | 操作 `screenshot` |
| tap 管道 `<pipeName>-tap` | 操作 `tap` `action:'subscribe'`（二进制消息） |
| `harness-shim.ps1`（`Click`、`Press-Key`、`Type-Text`、`Move-Mouse`、`Scroll`、`Get-ClientBitmap` 等） | 自行封装的 WebSocket 函数；优先用 bedboo 和 `ui` |
| `Register-BeDDNative` | 将输入类改为走 WebSocket，而非 `SendInput` |
| `Install-BeDDMod`、`Uninstall-BeDDMod` | `BeDD.exe mod install`、`mod uninstall <instance>` |
| `Set-BeDDMode`、`-Mode` | `BeDD.exe mod config <instance> --world-mode <mode>` |
| `Set-WorldSinglePlayer` | `BeDD.exe world singleplayer <instance> [<world folder>]` |
| `Start-BeDDGame.ps1`、`Start-Game`；`Stop-Game` | `BeDD.exe launch [--slot N] [--label …] --json`；`stop --pid <pid>` |
| `$script:ExclusiveSignaling = $true` | `launch --exclusive-signaling` |
| `clone-instance.ps1`、`New-BeDDClone`、`Initialize-BeDD.ps1`、`Initialize-BeDDInstance` | `BeDD.exe instance clone --slot N`（[克隆](/zh/guide/installs#克隆)） |
| `Get-BeDDInstance`、`Initialize-BeDDServer`、`Get-BeDDServer` | `BeDD.exe instance show`、`server init`、`server list` |
| `Start-BeDDServer.ps1`（`-Stop`、`-Command`） | `server start` / `server stop`；服务器上的 `command` 操作 |
| `BeDDManager.ps1`（`-List`、`-Game <pid> -Action close`、`-Shutdown`） | `BeDD.exe`（窗口）、`ps`、`stop --pid <pid>`、`manager stop --yes` |
| 配置项 `pipeName`、`pipeInstances`、`managerScript` | `wsPort`、`wsMaxClients`、`manager` |
| `BEDD_PIPE`、`BEDD_MANAGER_PIPE`；`BEDD_VERSIONS_DIR`、`BEDD_LAUNCHER_DATA` | `run\<pid>.json`；`BEDD_LEVILAUNCHER`、`BEDD_INSTANCE`（保留 `BEDD_LIP`） |

Be.D.D. 1 测试框架参考：[BeetrootSkin](https://github.com/MiracleForest/BeetrootSkin/tree/main/tools/e2e)、[AlleviatedBackpacks](https://github.com/MiracleForest/AlleviatedBackpacks/tree/main/tools/e2e)。
