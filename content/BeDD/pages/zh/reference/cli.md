# 命令行

直接双击（不带参数）运行 `BeDD.exe` 会打开[管理窗口](/zh/guide/several-games#管理窗口)；带参数运行则是本页介绍的命令行：`BeDD.exe <名词> <动词> [参数] [选项]`。运行 `BeDD.exe help`、`help <名词>` 或 `<命令> --help` 可离线查看同样的帮助内容。

## 约定

| | |
|---|---|
| 选项 | 写在命令词之后的任意位置：`--name value`、`--name=value`、`-n value`；布尔开关用 `--name` / `--no-name`；`--` 之后的参数不再作为选项解析 |
| 名字 | 精确匹配，不区分大小写，绝不按前缀匹配 |
| 时长 | 用于 `launch` 的 `--timeout` 和 `--lock-timeout`：数字后接 `ms`、`s`（默认）、`m`/`min` 或 `h`（如 `90s`、`3m`、`2h`），最长 30 天 |
| stdout | 仅输出结果 |
| stderr | 输出进度（指定 `-q` 或 `--json` 时不输出）、警告，以及 `-v` 的详细日志 |
| 出错 | 输出 `error: <信息>` 及 `hint: <命令>`；指定 `--json` 时，stdout 还会输出 `{"error":{code,message,exit,hint}}`（`code` 形如 `ERR_USAGE`） |

所有命令通用的全局选项：

| 选项 | |
|---|---|
| `--json` | 将结果输出为单个 JSON 文档：列表输出为数组，其余输出为对象；键名采用 camelCase，时间采用 RFC 3339 格式，大小以字节计 |
| `-q`、`--quiet` | 仅输出标识符（每行一个），不输出进度 |
| `-v`、`--verbose` | 在 stderr 输出执行细节 |
| `-h`、`--help` | 显示该命令的帮助 |

退出码：`0` 成功，`1` 失败，`2` 用法错误，`4` 未找到，`5` 冲突（如槽位已被占用），`10` 被拒绝。

## 游戏

### launch

`BeDD.exe launch [<instance>]`（别名 `play`）：在后台启动指定实例的游戏并输出其端点。如有需要，会先克隆实例、安装或更新模组（见[升级](/zh/guide/installs#升级)）、打开管理窗口，并在游戏整个运行期间持有信令锁（见[规矩](/zh/guide/several-games#并行测试的规矩)）。具体用法见[启动游戏](/zh/guide/usage#启动游戏)。

| 选项 | 默认 | |
|---|---|---|
| `--slot <n>` | `1` | 未指定实例时，使用该槽位的克隆（即基础实例的克隆） |
| `--dir <folder>` | | 改为启动该目录下的实例（任意包含 `Minecraft.Windows.exe` 的目录） |
| `--label <text>` | `BEDD_LABEL`，未设置则为调用方仓库名 | 游戏在管理窗口中显示的名称 |
| `--exclusive-signaling` | | 独占整台电脑：等待其他游戏全部退出，并阻塞后续启动的游戏 |
| `--no-manager` | | 不启动管理窗口 |
| `--keep-mod` | | 保留克隆中现有的 BeDD 模组，即使与当前 `BeDD.exe` 自带的版本不同 |
| `--detach` | | 进程创建后立即返回；此时 `url` 和 `token` 为 `null` |
| `--timeout <时长>` | `3m` | 等待端点就绪的超时时间 |
| `--lock-timeout <时长>` | `2h` | 等待信令锁的超时时间 |

```powershell
BeDD.exe launch --slot 3 --json
BeDD.exe launch --dir D:\games\mc-test --label smoke --detach -q
```

### process list

`BeDD.exe process list`（别名 `ps`、`process ls`）：列出正在运行且模组已公布 WebSocket 端点（`run\<pid>.json`）的游戏和服务器。加上 `--json` 会一并输出每个端点及其令牌——测试正是通过它来查找连接地址的（见[选哪个游戏](/zh/guide/usage#选哪个游戏)）。

| 选项 | |
|---|---|
| `--all` | 同时列出实例目录下尚未公布端点的游戏（仍在加载，或所装模组较旧） |

### process stop

`BeDD.exe process stop [<instance>]`（别名 `stop`）：强制结束指定实例的游戏（可传入实例目录下的文件夹名或路径）。绝不会触碰实例目录之外的 Minecraft 进程，除非通过 `--pid` 指定的进程公布过 BeDD 端点。

| 选项 | |
|---|---|
| `--pid <pid>` | 结束指定 PID 的游戏 |
| `--all` | 结束所有 BeDD 实例的游戏 |
| `-y`、`--yes` | 结束全部游戏前不请求确认 |

```powershell
BeDD.exe stop --pid 12345
BeDD.exe stop --all --yes
```

## 实例

关于克隆和目录结构，请参见[安装与克隆](/zh/guide/installs#克隆)。所有接受 `[<name>]` 的命令均可改用 `--slot <n>` 来指定对应槽位的克隆。

| 命令 | |
|---|---|
| `instance list`（`ls`） | 列出 BeDD 的游戏实例（`%LOCALAPPDATA%\BeDD\instances` 下的克隆）及其缺失项。`--bases`：列出可用于克隆的 LeviLauncher 实例；`--bases --all`：同时列出不可克隆的实例及原因 |
| `instance show [<name>]` | 显示单个实例的详情及其缺失项 |
| `instance clone` | 从 LeviLauncher 实例克隆出 `<gameVersion>-<slot>`（游戏文件使用硬链接，资源通过目录联接，游戏数据和 LeviLamina 直接复制；原 LeviLauncher 实例保持只读）；若克隆已存在则予以刷新。`--slot <n>`（默认 `1`）；`--base <name>`（未指定时依次回退：`BEDD_INSTANCE`、LeviLauncher 默认实例、第一个可用实例）；`-f`、`--force`：删除现有克隆并彻底重建（包括游戏数据） |
| `instance refresh [<name>]` | 使克隆与源 LeviLauncher 实例保持同步。`--all`：刷新所有实例（跳过正在运行游戏的实例） |
| `instance remove [<name>]`（`rm`） | 删除指定实例（原 LeviLauncher 实例不受影响）。`-y`、`--yes`：不请求确认 |
| `instance path <name> [dir\|mods\|logs\|data\|worlds]` | 输出实例的指定目录路径：`dir`（实例根目录）、`mods`、`logs`、`data`（游戏数据目录 `Minecraft Bedrock`）或 `worlds`（第一个玩家的 `minecraftWorlds`） |

## 模组

配置项及可选值见[配置](/zh/guide/configuration#配置项)。

| 命令 | |
|---|---|
| `mod install <instance>` | 将 `BeDD.dll` 和 `manifest.json` 复制到 `<instance>\mods\BeDD`，在 `config\config.json` 中仅写入本次指定的设置，并将 LeviLamina 切换为内置崩溃记录器。此操作会连同配置文件一起覆盖先前的安装。`--from <dir>`：指定要安装的构建目录，后续 `launch` 均以该构建为准，直至下次不带 `--from` 重新安装（未指定时依次回退：`BEDD_MOD_DIR`、`BeDD.exe` 同级的 `mod\BeDD`、当前工作目录所属代码检出中的 `bin\BeDD`） |
| `mod uninstall <instance>` | 从实例中移除模组 |
| `mod config <instance>` | 应用 `--set`、`--unset` 和 `--world-mode` 选项，并输出最终的 `mods\BeDD\config\config.json`（游戏启动时读取该文件）。`--unset <key>`（可重复）：将该配置项恢复为模组默认值 |

`mod install` 和 `mod config` 均支持以下选项：

| 选项 | |
|---|---|
| `--set <key=value>` | 设置一项配置（可重复）；若值可解析为 JSON 则按 JSON 写入，否则按字符串写入 |
| `--world-mode <mode>` | 设为 `ClientOnly`、`ClientServer` 或 `Remote`（即配置项 `mode`；见[世界在哪里运行](/zh/guide/modes)） |
| `--server-host <host>` | 配合 `--world-mode Remote` 使用，指定游戏要加入的服务器；设为 `*` 则允许通过 `join` 加入任意服务器 |

## 世界

`BeDD.exe world singleplayer <instance> [<world folder>]`：清除世界 `level.dat`（及 `level.dat_old`）中的多人游戏与广播设置，防止共用同一账号登录的游戏互相顶号（"Blaze"）。若不指定世界目录，则处理该实例下的所有世界。请在世界未打开时运行此命令。

| 选项 | 默认 | |
|---|---|---|
| `--recent` | | 仅处理近期写入过 `level.dat` 的世界（如刚恢复的测试世界） |
| `--minutes <n>` | `15` | 界定 `--recent` 的分钟数 |

## 服务器

用于[客户端 + 服务端模式](/zh/guide/modes#客户端-服务端)的专用服务器，存放在 servers 目录下。

| 命令 | |
|---|---|
| `server init <name>` | 准备服务器：通过 lip 安装 BDS 与 LeviLamina、安装 BeDD 服务端模组，并生成 `server.properties`。若文件齐全则耗时极短；重复运行可更新模组或修改设置。`--port <N>`：指定 IPv4 端口，IPv6 端口则为 N+1（默认保留服务器现有端口，新服务器则取 19140 起的第一对空闲端口）；`--from <dir>`：指定服务端模组目录（未指定时依次回退：`BEDD_SERVER_MOD_DIR`、`BeDD.exe` 同级的 `mod\BeDD-server`、最近的 `bin\BeDD-server`）；`--set <key=value>`：设置 `server.properties` 中的配置项，可重复（见[准备服务器](/zh/guide/modes#准备服务器)） |
| `server start <name>` | 无窗口启动服务器（控制台输出写入 `logs\console.log`），等待服务器就绪且 BeDD 公布端点后，输出 `name`、`pid`、`port`、`portV6`、`url` 和 `token`。若服务器已在运行，则直接输出当前信息。`--detach`：不等待端点就绪（`url` 和 `token` 可能为 `null`）；`--timeout <秒>`（默认 `180`）；`--allow-firewall-prompt`：允许启动未启用 BeDD 回环绑定的服务器 |
| `server stop <name>` | 停止服务器（服务器会正常保存世界）。`--all`：停止所有服务器；`--timeout <秒>`（默认 `30`）：超时后强制结束进程 |
| `server list`（`ls`） | 列出所有服务器、端口及运行状态 |
| `server remove <name>`（`rm`） | 删除已停止服务器的目录（包括其中的世界）。`-y`、`--yes`：不请求确认（无控制台环境下必须加上此选项） |
| `server path <name>` | 输出指定服务器的目录路径 |

## 管理窗口

| 命令 | |
|---|---|
| `manager status` | 查看管理窗口是否在运行及其进程 ID；无论是否在运行，退出码均为 `0` |
| `manager stop` | 关闭管理窗口及其中的所有游戏（每个游戏都会收到 `{op:"close"}`，并在 10 秒后强制结束），然后等待管理窗口退出。`-y`、`--yes`：不询问；`--timeout <秒>`（`60`） |

## 其他命令

| 命令 | |
|---|---|
| `version` | 版本信息 |
| `dev` | 模组开发循环：为 `--slot`（`9`）克隆基础实例，安装构建到 `--from` 的模组（默认为检出目录中的 `bin\BeDD`），启动游戏（`--label`，默认 `dev`）并保持运行，同时将前台窗口和光标限制区域的每次变化记录到 `--watch-log`（默认为检出目录中的 `tools\out\desktop-watch.log`；以 `MINECRAFT HAS THE FOREGROUND` 结尾的行表示有游戏抢占了焦点）。按 Ctrl+C 或创建 `<日志目录>\dev.stop`：关闭游戏（除非指定 `--keep`）并退出；创建 `<日志目录>\dev.restart`：关闭游戏、重装模组并重新启动。`--watch-only`：仅监视桌面 |
