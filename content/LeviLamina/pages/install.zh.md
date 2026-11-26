# 安装 LeviLamina

LeviLamina 从不单独安装，而是由所在环境的工具连同对应的游戏版本一并装好：服务器上是 [lip](https://levimc.org/zh-Hans/lip/)，Windows 游戏里是 [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/)，模组工程里是 xmake。

## 需要什么

- **服务器：** [lip](https://levimc.org/zh-Hans/lip/install.html)，运行在 Windows、x64 的 Linux 或 macOS 上。在 Linux 和 macOS 上，lip 会自行安装 Wine，并通过它运行 Windows 服务器。
- **游戏：** Windows 10 或 11 上的 [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/install)，以及正版 Minecraft 基岩版。LeviLamina 不能在 Android 上运行。
- **写模组：** [你的第一个 LeviLamina 模组](https://levimc.org/zh-Hans/tutorials/develop/first-levilamina-mod/)中列出的工具：Windows、带 C++ 工具的 Visual Studio 和 xmake。

每个 LeviLamina 版本对应一个游戏版本：见[支持的版本](versions.md)。

## 安装

### 在服务器上

在一个空文件夹里运行 `lip`，在它的**服务器**页面安装服务器（它会询问游戏版本和加载器），或者运行命令：

```shell
lip setup --game 1.26.60
```

lip 会安装该版本的 Bedrock Dedicated Server、支持该版本的最新 LeviLamina 及其所需组件。`lip install LeviLamina` 的作用相同，游戏版本会取 LeviLamina 支持的最新版。

受支持的安装方式是使用 lip，而不是把发行版压缩包手动解压进服务器：lip 还会安装 LeviLamina 依赖的包，并准备好服务器的可执行文件。

### 在 Windows 的游戏里

在 LeviLauncher 里打开**下载**，选择一个**加载器**一栏显示 LeviLamina 的游戏版本，安装时保持**安装 LeviLamina** 开启。也可以用命令行：

```shell
LeviLauncher.exe install latest --loader
```

### 在模组工程里

模组在 `xmake.lua` 里声明所依赖的 LeviLamina 版本，构建时由 xmake 下载。[模组模板](https://github.com/LiteLDev/levilamina-mod-template)里已包含这一行：

```lua
add_requires("levilamina 26.60.*", {configs = {target_type = get_config("target_type")}})
```

## 确认装好了

- **服务器：** `lip list` 会列出 `github.com/LiteLDev/LeviLamina` 及其版本，`lip run` 启动服务器。
- **游戏：** 在 LeviLauncher 里，实例的**实例设置**中的**加载器**标签页会显示当前安装的 LeviLamina 版本。

## 更新

- **服务器：** 先停止服务器，然后在 lip 的服务器页面选择**更改版本…**，或者指定想要的游戏版本再运行一次 `lip setup`（[更换游戏或加载器版本](https://levimc.org/zh-Hans/lip/interface/server.html)）。
- **游戏：** 实例的**实例设置**中的**加载器**标签页可以安装、更新和移除 LeviLamina。对应的命令行是 `LeviLauncher.exe loader install`，`LeviLauncher.exe loader versions` 则用于列出可用的版本。
- **模组工程：** 修改 `add_requires` 中的版本号，然后重新构建。

## 其他版本

所有发行版均位于[发行版列表](https://github.com/LiteLDev/LeviLamina/releases)中，[支持的版本](versions.md)说明了各版本对应的游戏版本。要在服务器上安装指定版本，请在命令中写明：`lip setup --game 1.26.60 --loader levilamina@26.60.3`。

## 下一步

- [开你的第一个服务器](https://levimc.org/zh-Hans/tutorials/server/first-server/)：一步步装好带 LeviLamina 的服务器。
- [在 Windows 上玩模组](https://levimc.org/zh-Hans/tutorials/play/play-with-mods/)：用 LeviLauncher 安装 LeviLamina 和客户端模组。
- [你的第一个 LeviLamina 模组](https://levimc.org/zh-Hans/tutorials/develop/first-levilamina-mod/)：从模板创建模组，然后构建并加载它。
