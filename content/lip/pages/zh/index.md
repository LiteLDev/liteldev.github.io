# lip

在终端的一个界面里，搭建 Minecraft 基岩版服务器、安装模组并把它运行起来。

## lip 是什么

`lip` 用于运行 [LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) 服务器并管理其包。LeviLamina 是 LeviMC 为 Minecraft 基岩版专用服务器（Bedrock Dedicated Server）开发的模组加载器，而基岩版专用服务器则是 Mojang 为 Minecraft 基岩版发布的服务器程序。

用 `lip` 可以：

- **搭建服务器。** `lip` 会下载彼此匹配的游戏版本和 LeviLamina 版本，并放入同一个文件夹。
- **安装和移除模组。** `lip` 安装模组时会一并装好其依赖项，也支持更新和移除。[LeviMC 模组](https://levimc.org/zh-Hans/mods/)收录的模组都会显示在「市场」页面上，网站上每个模组的详情页也提供了对应的 `lip install` 安装命令。不在列表中的模组同样可以安装，支持从 Git 仓库、网址或本地文件安装。
- **运行服务器。** `lip` 负责启动服务器、显示输出、转发你输入的命令，并能在服务器崩溃后自动重启。
- **修改配置。** `lip` 可以显示并修改 `server.properties`、白名单、权限，以及各个模组的配置文件。

`lip` 只管理服务器。游戏客户端的模组由 [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/) 等启动器管理。

## 界面和命令

两种用法功能相同，哪种顺手就用哪种。

| | 界面 | 命令 |
| --- | --- | --- |
| 怎么启动 | 输入 `lip`，按 `Enter`。 | 输入 `lip` 加一条命令，例如 `lip install`。 |
| 它是什么 | 终端里的全屏程序，左侧边栏有八个页面，用方向键和 `Enter` 操作。 | 一行命令执行一项操作，`lip` 执行完即返回。 |
| 适合 | 入门、浏览模组、监控服务器、修改配置。 | 脚本、自动化、通过 SSH 连接的服务器。 |
| 接着读 | [界面导览](interface/tour.md) | [命令行参考](reference/cli.md) |

下图是服务器运行时界面的「服务器」页面：上方显示服务器输出，下方是命令输入行。

![服务器运行时 lip 的「服务器」页面：服务器的输出里有“Server started.”，下方的输入行等待输入命令。](/screenshots/zh-Hans/first-server-21-running.svg)

## 从这里开始

LeviMC 的教程一步一步带你从零开始完成各项任务：

- [开你的第一个服务器](https://levimc.org/zh-Hans/tutorials/server/first-server/)：安装 `lip`，在界面里从空文件夹开始，一步步搭建出装有模组并正常运行的服务器。
- [用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)：用 `lip setup`、`lip install` 和 `lip run` 完成同样的操作。
- [用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)：将模组打包发布，并收录到 LeviMC 模组列表。

## 要认识的五个词

- **工作区**是存放单个服务器的文件夹。`lip` 每次只在一个工作区中操作，即启动它时所在的文件夹，或在界面中选定的文件夹。`lip` 为工作区记录的数据都保存在其中的 `.lip` 文件夹内。
- **游戏**是特定版本（例如 1.26.60）的 Minecraft 基岩版专用服务器。一个工作区只能有一个游戏。
- **加载器**即 LeviLamina，服务器必须通过它才能运行模组。不带加载器的服务器就是纯净的 Minecraft 服务器。
- **模组**用于扩展服务器功能。在 `lip` 中，模组是一种**包**：有版本号，也有所依赖的其他包，可从 Git 仓库、网址或磁盘文件安装。游戏和加载器本身也是包。
- **守护进程**是在后台执行任务的 `lip` 进程。你在界面和命令中下达的指令都由它执行；关闭界面后，也是它在后台保持服务器继续运行。需要时 `lip` 会自动启动它，闲置时它会自动退出。

[lip 的工作方式](concepts/how_lip_works.md)对这些概念做了逐一深入说明。

## lip 能在哪里运行

`lip` 为下列系统提供发行版。带 LeviLamina 的服务器是 Windows 程序；在 Linux 和 macOS 上，`lip` 通过 [Wine](https://www.winehq.org/) 运行它，而 Wine 会由 `lip` 自动下载并配置好。

| 系统 | 带 LeviLamina 和模组的服务器 | 不带加载器的服务器 |
| --- | --- | --- |
| x64 或 ARM64 的 Windows | 可以 | 可以 |
| x64 的 Linux | 可以，通过 Wine | 可以：通过 Wine 运行 Windows 版服务器，或直接运行 Linux 版服务器 |
| Intel 或 Apple 芯片的 macOS | 可以，通过 Wine | 可以，通过 Wine 运行 Windows 版服务器 |

由于 LeviLamina 服务器无法在 ARM64 架构的 Linux 上运行，因此不提供该平台的发行版。关于 `lip` 在这些系统上安装的内容及具体限制，请参阅 [Linux 与 macOS](guides/linux_macos.md)。

## 安装 lip

[安装](install.md)页面提供了 Windows 安装程序、macOS 和 Linux 安装脚本，以及更新 `lip` 的方法。

## 本站的其他内容

- **指南**：逐页说明[界面的用法](interface/tour.md)；用命令[管理包](guides/managing_packages.md)、[配置](guides/configuration.md)，以及 [Linux 与 macOS](guides/linux_macos.md)；[迁移](authors/migrating_packages.md) lip v0.x 的包；[故障排查](guides/troubleshooting.md)。常见问题的简短解答见 [LeviMC 问答](https://levimc.org/zh-Hans/faq/server/lip/basics/)。
- **概念**：[lip 的工作方式](concepts/how_lip_works.md)、[lip.toml](concepts/lip_toml.md)、[状态文件](concepts/state_file.md)和[内部机制](concepts/internals.md)。
- **参考**：[命令行](reference/cli.md)、每一条[命令](reference/commands/setup.md)、[界面](reference/interface.md)、[配置](reference/configuration.md)和[文件](reference/files.md)。
