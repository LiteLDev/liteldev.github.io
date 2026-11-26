# 安装与克隆

要安装 Be.D.D.，请参见[安装](/zh/install)页。要在电脑上准备好第一个游戏，请参见教程[用 Be.D.D. 驱动游戏客户端](https://levimc.org/zh-Hans/tutorials/automate/bedd/)。本页介绍后续步骤：升级、CI、实例、克隆和目录。

## 升级

运行新版安装程序，它会自动关闭已打开的管理窗口及其游戏。此后每次执行 `launch`，若克隆中缺少模组则会自动安装，若模组与来源不一致则会将其替换（保留 `config.json`）：

- 默认来源：优先使用 `BEDD_MOD_DIR`，其次是 `BeDD.exe` 旁边的 `mod\BeDD`，最后是当前目录所在检出中的 `bin\BeDD`；
- 执行 `mod install <instance> --from <dir>` 之后：来源固定为该目录（记录在 `mods\BeDD\source.pin` 中）；若该目录中不再包含构建产物，`launch` 会发出警告并保持现有模组不变。执行不带 `--from` 的 `mod install` 可取消固定。

以下情况不会替换模组：使用了 `launch --keep-mod`，或该克隆有游戏正在运行。

## 卸载

前往“设置 > 应用 > 已安装的应用 > **BeDD**”，即可删除程序、开始菜单项和 `PATH` 项。如果要连同 `%LOCALAPPDATA%\BeDD`（包含克隆、存档、日志）一并删除，请先对每个克隆运行 `BeDD.exe instance remove --slot N --yes`，然后再删除该目录。

## 让测试框架自己下载

将 `BEDD_DIR` 指向解压好的目录。在 CI 中请固定版本号（如 `releases/download/v0.4.0/...`）。

```powershell
curl.exe -L -o "$env:TEMP\bedd.zip" https://github.com/LiteLDev/BeDD/releases/latest/download/bedd-windows-x64.zip
mkdir "$env:LOCALAPPDATA\BeDD\app" -Force; tar.exe -xf "$env:TEMP\bedd.zip" -C "$env:LOCALAPPDATA\BeDD\app"
```

## 用哪个实例

`BeDD.exe` 会从 `LeviLauncher.exe instance list --json` 中选取 1.26.60 版本的 LeviLamina 实例作为**基础实例**。它从不向该实例写入数据，也从不直接启动它。

| 覆盖 | |
|---|---|
| `BEDD_LEVILAUNCHER` | 要查询的 `LeviLauncher.exe`（默认：优先使用 `PATH` 中的，其次是已安装的，最后使用 `tools` 目录中的） |
| `BEDD_INSTANCE` / `instance clone --base <name>` | 存在多个 1.26.60 实例时指定基础实例（默认：优先使用 LeviLauncher 的默认实例，否则使用第一个符合条件的实例） |

## 克隆

每个游戏都在各自的克隆 `<gameVersion>-<slot>` 中运行（例如 `1.26.60.05-2`，1 号槽位也不例外），拥有独立的 `mods\`、日志、存档和设置，而游戏文件则硬链接到基础实例。

```powershell
BeDD.exe instance list                      # clones and their LeviLauncher bases
BeDD.exe instance list --bases --all        # the LeviLauncher instances, and why one cannot be cloned
BeDD.exe instance show 1.26.60.05-2         # folder, base, game/loader version, mod, running games, status
BeDD.exe instance clone --slot 2            # make or update
BeDD.exe instance refresh 1.26.60.05-2      # re-link after the base changed
BeDD.exe instance path 1.26.60.05-2         # its folder
BeDD.exe instance remove 1.26.60.05-2       # delete (never the base)
```

执行 `launch --slot N` 时，若克隆不存在会自动创建，若基础实例发生变更则会自动刷新。硬链接要求位于同一个卷：如果 `%LOCALAPPDATA%\LeviLauncher\Instances` 和 `instances` 不在同一个盘，每个克隆都会变成完整复制（GB 级别，耗时数分钟）；此时可将 `BEDD_INSTANCES_DIR` 设到基础实例所在的卷上。

## 目录

`%LOCALAPPDATA%\BeDD`（可通过 `BEDD_HOME` 更改位置）：

| | |
|---|---|
| `instances` | 克隆（`BEDD_INSTANCES_DIR`） |
| `run` | 每个运行中的游戏或服务器对应一个 `<pid>.json`，内含 URL 和令牌（参见[选哪个游戏](/zh/guide/usage#选哪个游戏)） |
| `locks` | 槽位锁和信令锁 |
| `servers` | 专用服务器（参见[客户端 + 服务端](/zh/guide/modes)；`BEDD_SERVERS_DIR`） |
| `tools` | 下载的 LeviLauncher、lip |
| `logs` | 程序日志（`manager.log` 等） |
