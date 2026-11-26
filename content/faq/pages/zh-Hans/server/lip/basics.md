# lip 基础

这里整理了新用户最常问的问题，每个问题都附有简短解答和详细说明页面的链接。

## 关于 lip

### lip 是做什么的？

lip 用于在一个文件夹中安装和运行 Minecraft 基岩版服务器，以及安装、更新服务器模组。你既可以使用它的终端界面，也可以使用命令行。见[首页](https://levimc.org/zh-Hans/lip/)。

### 它只能用于 LeviLamina 吗？

不是，不过它确实是专为 LeviLamina 设计的。lip 安装的模组都是 LeviLamina 模组，LeviLamina 也是 lip 唯一会安装的加载器。你也可以运行不带加载器的原版服务器：Windows 版用 `lip setup --game <version> --no-loader`，Linux 版加上 `--build linux`。见[游戏版本与构建](https://levimc.org/zh-Hans/lip/reference/commands/setup.html#游戏版本与构建)。

### lip 能安装客户端模组吗？

不能。lip 只管理服务器。游戏客户端的模组由 LeviLauncher 这类启动器管理，不过它们读取的是同一种包。

### 它能在哪些系统上运行？

Windows、x64 的 Linux 以及 macOS。在 Linux 和 macOS 上，lip 会自行下载 Wine 来运行 Windows 服务器。lip 没有 arm64 Linux 版。见 [Linux 与 macOS](https://levimc.org/zh-Hans/lip/guides/linux_macos.html#什么系统能运行什么)。

### 需要 git、Wine 或别的东西吗？

不需要。lip 会自行与 git 仓库通信，并在需要时自动下载游戏、加载器、Wine 和 Microsoft Visual C++ Redistributable。见[内部机制](https://levimc.org/zh-Hans/lip/concepts/internals.html#git-客户端)。

### 有繁体中文吗？

有。界面提供英语、简体中文和繁体中文，默认跟随系统语言。如需手动切换，可以在设置页面修改，或运行 `lip config set language zh-Hant`。本文档同样提供这三种语言。不过，命令在终端中输出的内容始终是英语。见 [language](https://levimc.org/zh-Hans/lip/guides/configuration.html#language)。

## 使用 lip

### 可以不用界面吗？

可以。界面里的每项操作都有对应的命令：`lip setup`、`lip install`、`lip update`、`lip uninstall`、`lip run`、`lip config`。你可以从[用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)开始上手。这些命令也能用于无人值守的脚本：见 [`lip setup`](https://levimc.org/zh-Hans/lip/reference/commands/setup.html#选项) 的 `--accept-eula`。

### 反过来呢：一定要学命令吗？

不用。直接输入不带任何参数的 `lip`，即可进入界面操作。见[开你的第一个服务器](https://levimc.org/zh-Hans/tutorials/server/first-server/)。

### 关掉终端后服务器会停止吗？

这取决于服务器的启动方式。

- **在界面里启动的：** 不会。退出界面或关掉终端后，服务器会继续运行。
- **用 `lip run --managed` 启动的：** 不会。关掉终端只是断开与服务器的连接。
- **用普通的 `lip run` 启动的：** 会。lip 会请求服务器停止，并等待它退出。

在前两种情况下，服务器运行在 lip 的后台进程中。通过界面或运行 `lip run --managed` 就能重新接管它。见[托管服务器](https://levimc.org/zh-Hans/lip/reference/commands/run.html#托管服务器)。

### 怎么停止在后台运行的服务器？

打开界面，在服务器页面选择“停止”；或者在服务器文件夹中运行 `lip run --managed` 接入服务器，再按 Ctrl+C。

### lip 能重启崩溃的服务器吗？

能。在服务器页面打开“自动重启”，或者运行 `lip config set restart on-failure --workspace`。见[重启](https://levimc.org/zh-Hans/lip/reference/commands/run.html#重启)。

### 服务器运行时能安装或更新模组吗？

在界面里不能，界面会要求你先停止服务器。但用命令可以，所做的更改会在服务器下次启动时生效。在 Windows 上，如果运行中的服务器正好占用了某个文件，这类命令可能会失败；此时 lip 会回滚已做的更改。见[界面与命令](https://levimc.org/zh-Hans/lip/concepts/how_lip_works.html#界面与命令)。

### 能运行多个服务器吗？

能。只需将每个服务器放在单独的文件夹中，并在各自的 `server.properties` 里设置不同的端口。一个文件夹同一时间只能运行一个服务器。界面中的[工作区选择器](https://levimc.org/zh-Hans/lip/interface/workspaces.html)保存着你的服务器文件夹列表，点击屏幕顶部的工作区即可打开。

### 怎么更新 lip？

运行 `lip self-update`，或者点击设置页面中的“检查更新”。运行 `lip self-update --check` 则只会检查是否有新版本。见 [`lip self-update`](https://levimc.org/zh-Hans/lip/reference/commands/self_update.html)。

### 怎么更改服务器的 Minecraft 版本？

在服务器文件夹中重新运行一次 `lip setup --game <version>`，或者点击界面服务器页面上的**更改版本…**。已安装的模组也会一并切换为兼容新游戏版本的版本。见 [`lip setup`](https://levimc.org/zh-Hans/lip/reference/commands/setup.html)。

## 文件

### 我的世界和设置在哪里？

就在服务器文件夹里，保存在游戏默认的路径下。lip 不会移动它们。

| 内容 | 在服务器文件夹里的位置 |
| --- | --- |
| 世界 | `worlds/` |
| 游戏的设置 | `server.properties`、`allowlist.json`、`permissions.json` |
| 模组，通常还有它的设置 | `mods/<名字>/` |

你可以在界面的[游戏配置](https://levimc.org/zh-Hans/lip/interface/game_config.html)和[模组配置](https://levimc.org/zh-Hans/lip/interface/mod_config.html)页面编辑这些设置。

### `.lip` 文件夹是什么？

它用来保存 lip 对该服务器文件夹的记录，包括已安装的包、工作区设置、失败报告，以及 Linux 和 macOS 上的 Wine 前缀。在 Windows 上它是隐藏文件夹。请勿改动它；迁移服务器时，请让它随服务器文件夹一起移动。见[文件和目录](https://levimc.org/zh-Hans/lip/reference/files.html)。

### lip 在服务器文件夹之外还存了什么？

在每个用户的目录下还有四个目录，分别存放你的设置、下载缓存、lip 的 Wine，以及界面的工作区列表。

| 内容 | Windows | Linux 和 macOS |
| --- | --- | --- |
| 设置 | `%APPDATA%\lip` | `~/.config/lip` |
| 缓存 | `%LOCALAPPDATA%\lip\Cache` | `~/.cache/lip` |
| 数据：lip 为运行服务器而安装的东西，例如它的 Wine | `%LOCALAPPDATA%\lip\Data` | `~/.local/share/lip` |
| 状态：工作区列表 | `%LOCALAPPDATA%\lip\State` | `~/.local/state/lip` |

你可以随时运行 `lip cache clean` 清理缓存。lip 不会向系统的临时目录写入任何内容。见[用户目录](https://levimc.org/zh-Hans/lip/concepts/how_lip_works.html#用户目录)。

### 更改游戏版本会删掉我的世界吗？

不会。`worlds/`、`server.properties`、`allowlist.json` 和 `permissions.json` 都会保留。不过，游戏自带的一些文件夹（例如根目录下的 `resource_packs/` 和 `behavior_packs/`）会被删除并重新写入。见[更换游戏后保留什么](https://levimc.org/zh-Hans/lip/reference/files.html#更换游戏后保留什么)。

### 怎么把服务器搬到另一个文件夹或另一台机器？

先停止服务器，把整个文件夹（包括 `.lip`）移动或复制过去，然后在新位置运行 lip 即可。如果搬到了新机器上，第一次启动时 lip 会重新安装服务器所需的系统组件。

## 包

### 包从哪里来？

来自公开的 git 仓库，大多托管在 GitHub 上。lip 没有中央仓库，而是通过仓库地址来指定包，例如 `github.com/LiteLDev/LegacyScriptEngine`。界面的**市场**页面列出的是收录在 [levimc.org](https://levimc.org) 上的模组。见[指定一个包](https://levimc.org/zh-Hans/lip/guides/managing_packages.html#指定一个包)。

### 怎么安装磁盘上的包？

只要 ZIP 文件或文件夹的根目录下有 `lip.toml`，把它的路径传给 `lip install` 即可，例如 `lip install ./my-mod.zip`。见[磁盘上的 ZIP 文件或文件夹](https://levimc.org/zh-Hans/lip/guides/managing_packages.html#磁盘上的-zip-文件或文件夹)。

### lip 支持私有仓库吗？

不支持。lip 下载时不会进行登录认证，因此只能使用公开仓库。

### 为什么我仓库里的某个标签不算版本？

只有名为 `v` 加完整版本号的标签（例如 `v1.2.3`）才算版本，`v1.2` 或 `1.2.3` 这样的标签不算。不过，任何标签、分支或提交都可以安装：`lip install github.com/user/repo@tag:1.2.3`。见 [git 仓库](https://levimc.org/zh-Hans/lip/guides/managing_packages.html#git-仓库)。

### 还能安装为 lip v0.x 制作的、带 `tooth.json` 的包吗？

能。lip 可以读取它们，并像其他包一样安装。lip v0.x 的服务器文件夹和配置，会在 lip 首次处理时自动转换。包作者可以用 `lip pkg migrate` 转换自己的包；见[迁移包](https://levimc.org/zh-Hans/lip/authors/migrating_packages.html)。

### `lip.toml` 是什么？

描述包的文件，包含包名、版本、依赖项以及要安装的文件。只有制作包时才需要它。见 [lip.toml](https://levimc.org/zh-Hans/lip/concepts/lip_toml.html)。

### `lip install` 会修改我的 `lip.toml` 吗？

不会。`lip install` 会把包安装到服务器文件夹里，并记录在 `.lip` 中，从不修改 `lip.toml`。

## 出问题的时候

### 命令失败了，去哪里找原因？

先看 lip 输出的 `error:` 和 `hint:` 两行。更多细节见服务器文件夹下 `.lip/logs/` 中的失败报告，lip 会输出报告的路径。见[读懂失败信息](https://levimc.org/zh-Hans/lip/guides/troubleshooting.html#读懂失败信息)。

### 安装到一半失败了会怎样？

不会留下半成品。凡是会更改服务器文件夹的命令，要么全部完成，要么什么都不做：一旦失败或按下 Ctrl+C，lip 就会撤销已做的更改。即使 lip 进程被强行终止，下次在该文件夹里运行命令时，lip 也会先把状态恢复正常。见[操作](https://levimc.org/zh-Hans/lip/concepts/how_lip_works.html#操作)。

### 这里 GitHub 很慢或被屏蔽，怎么办？

设置 GitHub 代理，或使用网络代理。见 [GitHub 很慢或被屏蔽时](https://levimc.org/zh-Hans/lip/guides/configuration.html#github-很慢或被屏蔽时)。

### 能同时运行两条 lip 命令吗？

在不同的服务器文件夹里可以。同一个文件夹同一时间只能由一条命令更改：第二条命令会立即失败，需等第一条结束后再运行。只读命令（例如 `lip list`）随时可用。见[另一个 lip 正在更改工作区](https://levimc.org/zh-Hans/lip/guides/troubleshooting.html#另一个-lip-正在更改工作区)。

### 后台一直在运行的那个 lip 进程是什么？

守护进程。它负责执行命令，并让托管服务器持续运行。除非正在运行服务器，否则闲置 10 分钟后它会自动退出。可用 `lip daemon status` 查看其状态，或在它空闲时用 `lip daemon stop` 将其关闭。见[守护进程和客户端](https://levimc.org/zh-Hans/lip/concepts/how_lip_works.html#守护进程和客户端)。
