# 安装 Be.D.D.

Be.D.D. 由 Windows 程序 `BeDD.exe` 及其注入各游戏副本的模组组成。只需在运行测试的电脑上安装即可。它不是 lip 包，也未上架 LeviMC Mods。

## 需要什么

- Windows 10 或 11，x64。
- [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/install) **1.1+**，其中装有含 LeviLamina **26.60.x** 的 Minecraft 基岩版 **1.26.60**（GDK 正式版）实例（见[用哪个实例](/zh/guide/installs#用哪个实例)）。Be.D.D. 只会复制该实例，从不修改或直接启动它。

无需安装 PowerShell、lip 或 .NET 运行时。

## 安装

从[最新发行版](https://github.com/LiteLDev/BeDD/releases/latest)下载并运行 `bedd-windows-x64-setup.exe`。安装无需管理员权限：程序会为当前用户安装到 `%LOCALAPPDATA%\Programs\BeDD`，在开始菜单中添加 **BeDD** 快捷方式，并将该目录加入 `PATH`。

发行版还提供另外两个文件：

| 文件 | 适用场景 |
|---|---|
| `bedd-windows-x64.zip` | 解压到任意位置即可使用，直接在解压目录中运行 `BeDD.exe`。适合由测试框架自动下载 Be.D.D.（见[让测试框架自己下载](/zh/guide/installs#让测试框架自己下载)）。 |
| `bedd-windows-x64.msi` | 执行 `msiexec /i bedd-windows-x64.msi /qn` 即可静默安装，适合受控电脑和 CI 环境。 |

## 确认装好了

打开一个**新的**终端，运行：

```powershell
BeDD.exe version
```

终端应输出 `Be.D.D. 0.4.0`（或更高版本），以及对应的游戏版本和 LeviLamina 版本。

## 更新

直接运行新版安装程序即可；安装程序会关闭已打开的管理窗口及其运行中的游戏。下次执行 `launch` 时会自动替换各克隆实例中的模组，详见[升级](/zh/guide/installs#升级)。

## 其他版本

所有历史版本均可在[发行版列表](https://github.com/LiteLDev/BeDD/releases)中找到。每个版本仅支持一个特定的游戏版本，详见各自的发布说明。在 CI 环境中，请在下载链接中固定版本号，例如：`https://github.com/LiteLDev/BeDD/releases/download/v0.4.0/bedd-windows-x64.zip`。

## 卸载

前往“设置 > 应用 > 已安装的应用 > **BeDD**”即可卸载。如需一并删除克隆实例、存档和日志，请参见[卸载](/zh/guide/installs#卸载)。

## 下一步

- [用 Be.D.D. 驱动游戏客户端](https://levimc.org/zh-Hans/tutorials/automate/bedd/)：准备基础游戏环境，在后台启动游戏并运行第一个脚本。
- [驱动游戏](/zh/guide/usage)和[多开](/zh/guide/several-games)。
