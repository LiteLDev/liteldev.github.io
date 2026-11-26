# 安装 lip

`lip` 是一个独立程序，不需要预先安装其他软件：不用 .NET、Git，也不用 Wine。在下方选择你的操作系统完成安装，然后验证它能否正常运行。

## 需要什么

- x64 或 ARM64 架构的 Windows 10、Windows 11 或 Windows Server 2019 及以上版本；搭载 Apple 芯片或 Intel 处理器的 macOS；或 x64 架构的 Linux。`lip` 没有 ARM64 Linux 版本。关于服务器在各系统上支持的功能，请参阅 [lip 能在哪里运行](index.md#lip-能在哪里运行)。
- 终端：Windows 上的 Windows 终端或 PowerShell，macOS 上的“终端”，或 Linux 桌面环境自带的终端。
- 网络连接。

## 安装

选择你的操作系统（页面已根据你当前的系统自动选好）。

:::: tabs

== Windows

1. 打开 [lip 的最新发行版](https://github.com/LiteLDev/lip/releases/latest)，下载 `lip-<version>-win-x64.msi`；使用 ARM 处理器的电脑请下载 `lip-<version>-win-arm64.msi`。
2. 运行该安装文件。无需管理员权限，它就会将 `lip` 安装到 `%LOCALAPPDATA%\Programs\lip`，并将该文件夹添加到你的 `PATH` 中。如果此前已为所有用户安装过 `lip`（早期版本会安装在 `C:\Program Files\lip`），安装程序会更新该版本，此时需要管理员权限。

::: details 不用安装程序：压缩包
从同一发行版页面下载 `lip-<version>-win-x64.zip`（或 `win-arm64`），将 `lip.exe` 解压到指定文件夹，再将该文件夹添加到 `PATH`。当安装程序无法使用或安装失败时，可以使用这种方式。
:::

== macOS / Linux

在终端中运行：

```shell
curl -fsSL https://levimc.org/lip/install.sh | sh
```

该脚本会执行以下操作：

1. 选择适合你系统的 `lip` 版本：Apple 芯片的 Mac 使用 `osx-arm64`，Intel 的 Mac 使用 `osx-x64`，x64 的 Linux 使用 `linux-x64`。在其他系统上脚本会停止运行；
2. 从 GitHub 下载最新发行版中对应的文件，并使用该发行版的 `SHA256SUMS` 进行校验。校验不一致的文件不会被安装；
3. 将 `lip` 放入 `~/.local/bin`，替换其中已有的 `lip`；
4. 如果该文件夹不在 `PATH` 中，询问是否将其添加到你的 shell 配置文件中。

整个过程不需要 root 权限或管理员密码，除了上述文件夹和配置文件外，不会改动任何其他内容。

以下环境变量可以调整脚本的行为。将它们传给 `|` 后面的 `sh` 即可：

```shell
curl -fsSL https://levimc.org/lip/install.sh | LIP_VERSION=0.42.0 sh
```

| 变量 | 脚本怎样使用它 |
| --- | --- |
| `LIP_VERSION` | 安装指定版本（例如 `0.42.0`），而非最新版。 |
| `LIP_INSTALL_DIR` | 将 `lip` 安装到指定文件夹（绝对路径），而非 `~/.local/bin`。 |
| `LIP_GITHUB_PROXY` | 通过指定的 GitHub 代理从 GitHub 下载，格式与 `lip` 的 [`github_proxy`](guides/configuration.md#github-proxy) 设置相同：代理地址后跟 `/`，再跟 GitHub 地址。 |
| `LIP_NO_MODIFY_PATH` | 设为 `1` 时，不修改 shell 配置文件，而是直接输出需要添加的那行配置。 |

Apple 芯片的 Mac 通过 Rosetta 2 运行 `lip` 的 Wine。`lip` 在首次部署或启动服务器时会询问是否安装它，详见 [Linux 与 macOS](guides/linux_macos.md#apple-芯片的-macos)。

::: details 不用脚本：压缩包
从[最新发行版](https://github.com/LiteLDev/lip/releases/latest)下载对应系统的压缩包：`lip-<version>-osx-arm64.zip`（Apple 芯片的 Mac）、`lip-<version>-osx-x64.zip`（Intel 的 Mac）或 `lip-<version>-linux-x64.tar.xz`（Linux）。将其解压到 `PATH` 中的某个文件夹：

```shell
mkdir -p ~/.local/bin
unzip lip-<version>-osx-arm64.zip -d ~/.local/bin        # macOS（或 osx-x64）
xattr -d com.apple.quarantine ~/.local/bin/lip           # macOS
tar -xJf lip-<version>-linux-x64.tar.xz -C ~/.local/bin  # Linux
```

在 macOS 上，`xattr` 那行命令用于移除 macOS 为浏览器下载的文件添加的隔离标记；如果不移除，macOS 会拒绝运行 `lip`。如果 `~/.local/bin` 不在 `PATH` 中，请将 `export PATH="$HOME/.local/bin:$PATH"` 添加到 `~/.zshrc`（macOS）或 `~/.profile`（Linux）。
:::

::::

## 确认装好了

打开一个**新的**终端窗口（此前已打开的终端还无法读取更新后的 `PATH`），然后查看 `lip` 的版本：

```shell
lip -v
```

终端应当输出一个版本号，例如 `0.44.0`。如果终端提示找不到 `lip`，请关闭终端并重新打开一个新的窗口。

## 更新

```shell
lip self-update
```

`lip` 会按照最初的安装方式安装最新发行版：在 Windows 上使用安装程序，其他情况下直接原地替换。`lip self-update --check` 则仅检查是否有新版本。详见 [`lip self-update`](reference/commands/self_update.md)。

## 其他版本

所有发行版及各系统对应的文件均可在[发行版列表](https://github.com/LiteLDev/lip/releases)中找到。如需安装特定版本，可在该页面下载对应文件，或向安装脚本传入 `LIP_VERSION`。`lip` 目前没有 beta 通道；如果列表中有标记为“Pre-release”的版本，`lip self-update` 只会将其推送给当前同样是预发布版的 `lip`。

## 下一步

- [开你的第一个服务器](https://levimc.org/zh-Hans/tutorials/server/first-server/)：在 `lip` 界面中，从零开始在一个空文件夹里搭建并运行带有 LeviLamina 的服务器。
- [用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)：使用 `lip setup`、`lip install` 和 `lip run` 完成同样的操作。
- [界面导览](interface/tour.md)和[管理包](guides/managing_packages.md)。
