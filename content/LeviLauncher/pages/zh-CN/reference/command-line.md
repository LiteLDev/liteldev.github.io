---
platforms: [windows]
---
# 命令行

不带参数运行 `LeviLauncher.exe` 会打开启动器窗口。带上命令时，它会在终端中运行并在完成后退出，命令采用 `<名词> <动词>` 的格式：

```text
LeviLauncher.exe <command> [arguments] [flags]
```

本页列出 LeviLauncher 1.1.0 的全部命令。`LeviLauncher.exe help <command>` 会打印指定命令的参数和示例，`LeviLauncher.exe help` 打印总览。命令行的输出为英文。

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe play
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe world export "My World" -o D:\Backups
LeviLauncher.exe instance list --json
```

## 在 shell 中运行

`LeviLauncher.exe` 是窗口程序，因此 shell 默认不会等待它结束。如需在提示符返回前看到输出或获取退出码：

- 在 cmd 中使用 `start /wait LeviLauncher.exe ...`，然后读取 `%ERRORLEVEL%`；
- 在 PowerShell 中将输出通过管道传递（`LeviLauncher.exe instance list | Out-String`），或使用 `Start-Process -Wait -NoNewWindow`。

命令行不会打开窗口，且在窗口打开时也可运行。

## 命令

### 日常

| 命令 | 作用 |
| --- | --- |
| `play [<instance>]` | 启动游戏并等待游戏窗口出现（`launch` 的别名） |
| `install <version\|file>` | 下载 Minecraft 并安装为新实例（= `instance create`） |
| `use [<instance>]` | 设置或显示默认实例 |
| `stop [<instance>\|<pid>...]` | 关闭正在运行的 Minecraft（= `process stop`） |

### 管理实例

| 命令 | 作用 |
| --- | --- |
| `instance list [<filter>]` | 列出已安装的实例 |
| `instance show [<instance>]` | 显示实例的设置、注册状态、加载器、玩家和内容数量（也可写作 `instance <instance>`） |
| `instance create <version\|file>` | 下载 Minecraft 并安装为新实例 |
| `instance copy-data [<instance>] --from system\|<instance>` | 将游戏数据（世界、设置）复制到使用自有数据的实例 |
| `instance rename <instance> <new-name>` | 重命名实例 |
| `instance set [<instance>]` | 更改实例设置（控制台、编辑器模式、自有数据、启动参数、环境变量、图标） |
| `instance remove <instance>...` | 永久删除实例及其文件夹中的所有内容 |
| `instance register [<instance>]` | 让 Windows 将该实例视为对应通道已安装的 Minecraft |
| `instance unregister [<instance>]` | 解除实例在 Windows 中的注册（保留游戏数据） |
| `instance shortcut [<instance>]` | 创建或删除用于启动该实例的桌面快捷方式 |
| `instance path [<instance>] [<kind>]` | 打印实例的某个文件夹路径（并可将其打开） |
| `mod list [<filter>]` | 列出实例的模组 |
| `mod show <package>` | 显示模组目录中的某个模组 |
| `mod search [<words>]` | 搜索 LeviLamina 模组目录 |
| `mod install <package[@version]>...` | 从模组目录安装、升级或降级模组 |
| `mod update [<mod>...]` | 将目录中的模组更新到最新版本 |
| `mod import <file>...` | 从 `.mcmod`、`.zip` 或 `.dll` 文件添加模组 |
| `mod set <mod>` | 修改模组的清单（manifest） |
| `mod remove <mod>...` | 从实例中删除模组 |
| `mod enable <mod>... \| --all` | 开启模组 |
| `mod disable <mod>... \| --all` | 关闭模组但不删除 |
| `mod path [<mod>]` | 打印某个模组或实例模组文件夹的路径 |
| `loader versions` | 列出某个游戏版本可用的 LeviLamina 版本 |
| `loader install [<version>]` | 在实例上安装 LeviLamina，或更换其版本 |
| `loader remove` | 从实例中删除 LeviLamina |
| `world list [<filter>]` | 列出实例和玩家的世界 |
| `world import <file.mcworld>...` | 从 `.mcworld` 文件导入世界 |
| `world export <world>...` | 将世界导出（备份）为 `.mcworld` 文件 |
| `world copy <world>...` | 将世界复制到另一个实例 |
| `world rename <world> <new-name>` | 更改世界的显示名称 |
| `world get <world> [<key>[/<sub>...]]` | 读取 `level.dat` 中的世界设置 |
| `world set <world> <key>[/<sub>...]=<value>...` | 修改 `level.dat` 中的世界设置 |
| `world remove <world>...` | 永久删除世界 |
| `pack list [<filter>]` | 列出资源包、行为包和皮肤包 |
| `pack import <file.mcpack\|file.mcaddon>...` | 从 `.mcpack` 和 `.mcaddon` 文件安装包和附加包 |
| `pack copy <pack>... \| --all` | 将包复制到另一个实例 |
| `pack remove <pack>...` | 删除已安装的包 |
| `screenshot list` | 列出实例和玩家的截图，最新的在前 |
| `screenshot remove <name\|path>... \| --all` | 删除截图 |
| `server list [<filter>]` | 列出已保存的服务器并检查是否在线 |
| `player list` | 列出 GDK 实例的玩家档案 |
| `backup list [<instance>]` | 列出实例备份和世界备份（预览功能） |
| `backup create [<instance>]` | 备份实例的游戏数据和模组（预览功能） |
| `backup restore [<instance>] <archive.zip>` | 恢复实例备份（预览功能） |

### 查找可安装的内容

| 命令 | 作用 |
| --- | --- |
| `installer search [<version>]` | 列出可安装的 Minecraft 构建 |
| `installer download <version>` | 仅下载某个构建的安装包，不安装 |
| `installer list` | 列出已下载的安装包，包括未完成的下载 |
| `installer remove <version\|file>...` | 删除已下载的安装包以释放磁盘空间 |
| `installer mirrors <version>` | 测试某个 GDK 构建的下载镜像速度 |
| `curseforge search [<words>]` | 在 CurseForge 上搜索世界、附加包、资源包和皮肤（名词别名：`cf`） |
| `curseforge show <id>` | 显示某个 CurseForge 项目 |
| `curseforge categories` | 列出可用于筛选的 CurseForge 类别和分类 |
| `curseforge install <id>` | 下载某个 CurseForge 文件并导入到实例 |

### 这台电脑与启动器

| 命令 | 作用 |
| --- | --- |
| `process list` | 列出正在运行的 Minecraft 进程，包括非启动器启动的进程（别名：`ps`） |
| `process stop [<instance>\|<pid>...]` | 强制关闭正在运行的 Minecraft（上次自动保存后的进度会丢失） |
| `account status` | 显示已登录的微软账号及其拥有的版本 |
| `account login` | 登录或切换微软账号 |
| `account logout` | 让启动器忘记已登录的微软账号 |
| `config list` | 列出启动器设置和文件夹 |
| `config get <key>` | 打印某个设置的值 |
| `config set <key> <value>` | 修改某个设置 |
| `config unset <key>` | 将某个设置恢复为默认值 |
| `cache clean [packages\|downloads\|partial]...` | 释放缓存占用的磁盘空间 |
| `doctor [--fix [<fix>...]]` | 检查当前电脑上运行 Minecraft 和模组所需的环境；`--fix` 用于修复（`vcruntime`、`gameinput`、`loader-migration`、`developer-mode`） |
| `self-update` | 将 LeviLauncher 自身更新到最新版本 |
| `version` | 打印版本信息 |
| `help [<command>...]` | 显示任意命令的帮助和示例 |

所有 `list` 动词均可简写为 `ls`，所有 `remove` 动词均可简写为 `rm`。`config` 可读取和修改的设置列于[全部设置](./settings#command-line-keys)。

### 版本与软件包

- `install` 和 `installer` 的 `<version>` 是 `installer search` 列出的构建：可以是完整版本号（`1.21.50.07`）、以点分隔的前缀（`1.21.50` 表示最新的 `1.21.50.x`，`1.21.5` 则不会匹配它）或 `latest`。`<file>` 是本地的 `.msixvc`、`.appx`、`.msix`、`.appxbundle` 或 `.msixbundle` 文件。
- `mod install` 的 `<package>` 是 `owner/repo`、`github.com/owner/repo` 或 URL，后面可附加 `#variant` 和 `@version`。

## 全局参数

以下参数适用于所有命令：

| 参数 | 含义 |
| --- | --- |
| `-i`、`--instance <name>` | 要操作的实例 |
| `-p`、`--player <id\|gamertag>` | 玩家档案（GDK 实例） |
| `--json` | 向 stdout 输出机器可读的结果 |
| `-q`、`--quiet` | 只打印标识符；不显示进度和提示 |
| `-v`、`--verbose` | 显示更多细节，并将启动器日志输出到 stderr |
| `-y`、`--yes` | 对所有确认回答“是” |
| `--no-input` | 从不提示输入 |
| `-h`、`--help` | 显示命令帮助 |
| `--version` | 打印版本 |

**使用哪个实例：**优先使用 `-i`，其次依次为环境变量 `LEVILAUNCHER_INSTANCE`、默认实例（`use`）和唯一的实例。**使用哪个玩家：**优先使用 `-p`，其次依次为 `LEVILAUNCHER_PLAYER`、唯一的档案和已登录账号的档案。

## 输出

- 结果输出到 stdout，进度、提示和错误输出到 stderr。错误以 `error:` 开头，并附带 `hint:` 和错误码（例如 `[ERR_GAME_RUNNING]`）。
- `--json` 打印一个 JSON 文档：列表为数组，其余为对象；键名为 camelCase，时间为 RFC 3339 格式，大小以字节为单位。
- `-q` 只打印标识符，每行一个。

## 退出码

| 退出码 | 含义 |
| --- | --- |
| 0 | 成功 |
| 1 | 失败 |
| 2 | 用法错误 |
| 3 | 未找到 |
| 4 | 冲突（例如游戏正在运行） |
| 5 | 登录或授权 |
| 6 | 网络 |
| 7 | 部分完成 |
| 8 | 需要更改系统或管理员权限 |
| 9 | 超时 |
| 10 | 已取消 |
| 130 | 被中断（Ctrl-C） |

`launch --wait-exit` 会改为返回游戏自身的退出码。

## 窗口参数

以下参数会打开窗口，而不运行命令：

| 参数 | 作用 |
| --- | --- |
| `--launch=<instance>` | 打开启动器并启动该实例（桌面快捷方式即使用此参数）。如果启动器已在运行，则在现有启动器中启动该实例。 |
| `--debug` | 同时在控制台窗口中显示启动器日志（也可写作 `debug`、`-debug` 和 `/debug`）。 |
