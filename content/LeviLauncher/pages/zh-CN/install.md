# 安装 LeviLauncher

LeviLauncher 提供 Windows 版和 Android 版，另有一个处于测试阶段的 macOS 版。下方已自动为你选中了当前设备对应的标签页。

## 需要什么

=== "Windows"

    - Windows 10 或 11。
    - 从 Microsoft Store 获取的正版 Minecraft 基岩版（GDK / UWP）。

=== "Android"

    - ARM64 设备，运行 Android 9.0 或更高版本。
    - 在该设备上从 Google Play 购买并安装的 Minecraft 基岩版 1.21.80 或更高版本。

=== "macOS"

    - 搭载 Apple 芯片的 Mac，运行 macOS 14.6 或更高版本。
    - 正版 Minecraft 基岩版。LeviLauncher 通过 Wine 运行 Windows（GDK）版游戏。

::: info iOS
LeviLauncher 没有 iOS 版，我们也没有开发 iOS 版的计划。
:::

## 安装

=== "Windows"

    1. 打开 [LeviLauncher 的最新发行版](https://github.com/LiteLDev/LeviLauncher/releases/latest)页面，下载 `LeviLauncher-amd64-installer.exe`。
    2. 运行安装程序并按向导完成安装。由于默认安装到 `Program Files`，安装程序会请求管理员权限。如果提示安装 WebView2 或其他组件，请允许其继续。

    发行版中还有另外两个文件，通常用不到：

    | 文件 | 用途 |
    | --- | --- |
    | `LeviLauncher.exe` | 便携版：新建一个路径仅含英文字母的空文件夹，将该文件单独放入其中，直接运行即可。 |
    | `LeviLauncher.zip` | 启动器自动更新时下载的更新包。 |

=== "Android"

    1. 在设备上打开 [LeviLauncher Android 版的最新发行版](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest)页面，下载文件名以 `-release.apk` 结尾的安装包。
    2. 打开下载好的文件。如果 Android 提示浏览器无权安装应用，请点击**设置**，开启**允许来自此来源的应用**，然后返回并点击**安装**。

=== "macOS"

    macOS 版尚处于测试阶段，仅在标有 **Pre-release** 的预发布版中提供，未包含在最新稳定版中。

    1. 打开 [LeviLauncher 的发行版列表](https://github.com/LiteLDev/LeviLauncher/releases)，找到包含 `LeviLauncher-macos-arm64-installer.dmg` 的最新发行版。
    2. 下载并打开该文件，将 **LeviLauncher** 拖入**应用程序**文件夹。

    UWP 实例仅支持 Windows。

## 确认装好了

启动 LeviLauncher，主窗口随即打开；首次启动时会显示初始设置（Windows、macOS）或许可协议（Android）。

## 更新

=== "Windows"

    LeviLauncher 启动时会自动检查新版本并提示就地更新。如需手动检查，可在**设置**中点击**检查更新**，或运行 `LeviLauncher.exe self-update`。

=== "Android"

    LeviLauncher 检测到新版本时会发出提示，下载新版 APK 并调用 Android 系统进行安装。如果当前网络无法访问 GitHub，可从发行版列表手动下载新版 APK 并覆盖安装。

=== "macOS"

    LeviLauncher 启动时会自动检查新版本并提示安装。

## 测试版与历史版本

所有版本的文件与更新日志均可在发行版列表中找到：

- Windows 与 macOS：[LiteLDev/LeviLauncher Releases](https://github.com/LiteLDev/LeviLauncher/releases)
- Android：[LiteLDev/LeviLauncher-Android Releases](https://github.com/LiteLDev/LeviLauncher-Android/releases)

发行版列表中标有 **Pre-release** 的版本即为**测试版**（beta），例如 `v1.2.0-beta.1`。测试版包含下个版本尚未定型的新功能，可能不够稳定。如需试用，可按前文的安装步骤从对应的发行版页面下载。在 Windows 上，已安装的 LeviLauncher 也可直接跟随测试版更新：在**设置**中开启**接收测试版更新**，此后每有新的测试版发布都会收到更新提示；关闭该选项则只接收稳定版更新。

## 下一步

=== "Windows"

    - [在 Windows 上玩模组](https://levimc.org/zh-Hans/tutorials/play/play-with-mods/)：从刚装好的 LeviLauncher 开始，带你第一次加载模组进入游戏。
    - [版本管理](/zh-Hans/guide/version-management?platform=windows)

=== "Android"

    - [在 Android 上玩模组](https://levimc.org/zh-Hans/tutorials/play/play-with-mods-android/)：从刚装好的 LeviLauncher 开始，带你第一次加载模组进入游戏。
    - [版本管理](/zh-Hans/guide/version-management?platform=android)

=== "macOS"

    - [版本管理](/zh-Hans/guide/version-management)
    - [更新与故障排查](/zh-Hans/guide/update-troubleshooting)
