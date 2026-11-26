# 开你的第一个服务器

学完这篇教程，你的电脑上会有一个装好 LeviLamina（运行模组所需的加载器）的 Minecraft 基岩版专用服务器（BDS），放在自己单独的文件夹里。安装、启动、发命令、停止，都在 LeviMC 的包管理器 `lip` 的界面里完成，除了启动 `lip` 本身，不需要输入任何其他命令。

整个过程大约十分钟，大部分时间在等下载。

## 你需要准备

- 一台装有以下系统之一的电脑：
  - Windows 10、Windows 11 或 Windows Server 2019 及更高版本（x64 或 arm64）。
  - macOS（Apple 芯片或 Intel）。
  - x64 的 Linux。

  在 macOS 和 Linux 上，`lip` 会自己安装 Wine，并通过它运行 Windows 服务器。
- 一个终端：Windows 用 Windows 终端或 PowerShell，macOS 用“终端”，Linux 用桌面自带的终端。窗口宽度最好不少于 80 个字符。
- 网络连接。`lip` 会从 minecraft.net 下载游戏，从 GitHub 下载 LeviLamina。

不需要事先安装别的东西：不用装 .NET、Git、Visual C++ 运行库，也不用装 Wine。服务器所需的组件都由 `lip` 安装。

## 1. 安装 lip

选择你的系统。页面已经默认选好了你正在用的系统。

::: tabs

== Windows

打开 [lip 的最新发行版](https://github.com/LiteLDev/lip/releases/latest)，下载 `lip-<version>-win-x64.msi`（ARM 处理器的电脑下载 `lip-<version>-win-arm64.msi`）并运行。安装程序会装好 `lip` 并把它加入 `PATH`。

== macOS / Linux

打开终端（Mac 上是“应用程序” › “实用工具”里的“终端”），运行：

```shell
curl -fsSL https://levimc.org/lip/install.sh | sh
```

这个脚本会把 `lip` 放进 `~/.local/bin`，不需要管理员密码，也不需要 root 权限。如果这个文件夹还不在 `PATH` 里，脚本会询问是否添加，回答是即可。

在 Apple 芯片的 Mac 上，`lip` 第一次安装或启动服务器时会询问是否安装 Rosetta 2。安装即表示接受 Apple 的 Rosetta 2 许可协议。

:::

接着打开一个**新的**终端窗口（安装前就开着的终端还读取不到新的 `PATH`），查看 `lip` 的版本：

```shell
lip -v
```

你应该能看到一个版本号，例如 `0.44.0`。如果终端提示找不到 `lip`，关掉它重新打开一个。

如果想用压缩包手动安装、安装其他版本，或者遇到了安装失败，请参见[安装 lip](https://levimc.org/zh-Hans/lip/install.html)。

## 2. 启动 lip

1. 建一个文件夹用来存放服务器，进入该文件夹，然后启动 `lip`。本教程以 `D:\servers` 为例：

   ::: code-group

   ```powershell [Windows]
   mkdir D:\servers
   cd D:\servers
   lip
   ```

   ```shell [Linux 和 macOS]
   mkdir -p ~/servers
   cd ~/servers
   lip
   ```

   :::

2. 这时你会看到 `lip` 的「主页」。顶栏显示 `lip` 所在的文件夹 `D:\servers`。左侧边栏列出了 `lip` 的各个页面；右侧是概览，显示这个文件夹里还没有游戏，下方列出了四个**下一步**。第 1 步**选择工作区**已经打勾，表示 `lip` 正在你启动它的文件夹里工作。

   ![lip 在空文件夹 D:\servers 里的主页。侧边栏列出八个页面，概览显示尚未安装游戏，第 1 步“选择工作区”已打勾。](https://levimc.org/lip/screenshots/zh-Hans/first-server-01-home.svg)

   操作只需要几个按键：`↑` 和 `↓` 移动光标，`Enter` 打开或确认，`Esc` 返回。界面最下方一行始终会列出当前可用的按键。

::: details lip 提示“无法连接 GitHub”
LeviLamina 需要从 GitHub 下载。如果 `lip` 连不上 GitHub，会询问你如何处理：有 GitHub 代理地址就选**使用代理**；确定网络能连上 GitHub 就选**直接连接**；选**以后再说**则会在下次启动时再次询问。连不上 GitHub，`lip` 就无法下载 LeviLamina。这项设置随时可以在「设置」页面修改。
:::

## 3. 创建服务器

1. 每个服务器都应该有自己独立的文件夹，我们先建一个。按 `↑` 选中**选择工作区**，按 `Enter`。打开的「工作区」列表里会有 `D:\servers`，前面的 **●** 表示它是 `lip` 当前所在的文件夹。
2. 按 `Tab` 移到**添加文件夹…**，按 `Enter`。

   ![主页上方的“工作区”列表：“添加文件夹…”一行，下面是带圆点的 D:\servers。](https://levimc.org/lip/screenshots/zh-Hans/first-server-02-where.svg)

3. 此时会打开文件夹浏览器，位置在 `D:\servers`。按 `Tab` 移到下方按钮栏，按 `→` 移到**新建文件夹…**，按 `Enter`。输入 `survival`，按 `Enter`。`lip` 会创建 `D:\servers\survival` 并进入该文件夹。

   ![“添加文件夹”浏览器停在 D:\servers，里面只有“..”。下面是“选择此文件夹”“新建文件夹…”和“取消”三个按钮。](https://levimc.org/lip/screenshots/zh-Hans/first-server-03-folder.svg)

4. 按 `←` 移到**选择此文件夹**，按 `Enter`。`lip` 会把这个文件夹加入列表，并切换到里面工作：此时回到「主页」，顶栏变为 `D:\servers\survival`，光标已自动选中**安装服务器**。

   ![D:\servers\survival 里的主页：顶栏显示这个文件夹，概览显示尚未安装游戏，第 2 步“安装服务器”已被选中。](https://levimc.org/lip/screenshots/zh-Hans/first-server-04-home-folder.svg)

5. 按 `Enter` 打开「服务器」页面，此时会弹出**游戏版本**列表，最新版本排在最上面。选中标有 **LeviLamina ✓** 的最新版本（标有**无 LeviLamina** 的版本无法运行模组），按 `Enter`。

   ![服务器页面上的“游戏版本”对话框列出八个版本，大多数标有“LeviLamina ✓”。第一个 1.26.60 已被选中。](https://levimc.org/lip/screenshots/zh-Hans/first-server-05-game-version.svg)

   在 Linux 上，如果所选版本同时提供 Linux 服务端，`lip` 接下来会询问**构建**：请选择 **windows**，只有它能运行 LeviLamina。

6. 选择**加载器**：保持选中最新版本的 LeviLamina，按 `Enter`。
7. 正式安装前，`lip` 会先列出执行计划：几行 `Dry run:` 开头的文字说明它即将安装游戏（`bds`）和 LeviLamina。在**应用**上按 `Enter`。

   ![“安装服务器”对话框，有三行以“Dry run:”开头的文字，以及“应用”和“取消”两个按钮。](https://levimc.org/lip/screenshots/zh-Hans/first-server-07-plan.svg)

8. 打开图中所示的网址，阅读《Minecraft 最终用户许可协议》和《Microsoft 隐私政策》。在**接受**上按 `Enter` 即表示同意；如果拒绝，则不会安装任何内容。
9. 等待 `lip` 完成下载和安装。首次使用时，Windows 上可能还会安装 Microsoft Visual C++ 可再发行程序包（系统会弹窗请求权限），Linux 和 macOS 上则会安装 Wine。
10. 看到 **✓ 完成。** 后，在**确定**上按 `Enter`。「服务器」页面现在显示 **○ 未运行**，说明服务器已经装好，点按**启动**按钮即可运行。

    ![安装之后的服务器页面：“○ 未运行”，“启动”按钮、“自动重启”复选框、“更改版本…”按钮，还没有输出。顶栏显示 D:\servers\survival。](https://levimc.org/lip/screenshots/zh-Hans/first-server-11-workspace.svg)

## 4. 启动服务器

1. 回到「主页」：按 `Esc` 移到侧边栏，按 `↑` 选中**主页**，再按 `Enter`。此时概览里已经显示出游戏和 LeviLamina，**安装服务器**也已打勾。

   ![D:\servers\survival 里的主页：已安装游戏 1.26.60 和 LeviLamina 26.60.3；第 1、2 步已打勾，第 3 步“安装模组”已被选中。](https://levimc.org/lip/screenshots/zh-Hans/first-server-12-home-server.svg)

2. 光标现在默认停在**安装模组**上。我们先跳过这一步：按 `↓` 选中**启动服务器**，按 `Enter`。
3. `lip` 会启动服务器并跳转到「服务器」页面。等待输出中出现 `Server started.` 这一行。其中带有 `[LeviLamina]` 的几行日志说明加载器已经在工作了。

   ![服务器运行时的服务器页面。输出显示 LeviLamina 正在加载、端口 19132 和 19133，以及“Server started.”，下面是输入行。](https://levimc.org/lip/screenshots/zh-Hans/first-server-21-running.svg)

   在 Windows 上，防火墙可能会弹窗询问是否允许服务器访问网络。如果想让其他设备连进来，请允许它访问专用网络，详见[让朋友连上你的服务器](let-friends-join.md)。

4. 试着给服务器发一条命令：在最下方的输入框里输入 `list`，按 `Enter`。你应该会看到返回结果 `There are 0/10 players online:`。在这里输入服务器命令不需要加开头的 `/` 号。

如果想在同一台电脑上打开 Minecraft 进服游玩，只需在游戏里添加服务器，地址填 `127.0.0.1`，端口填 `19132`。

## 5. 停止服务器

1. 在「服务器」页面按 `Ctrl+C`。`lip` 会向服务器发送 `stop` 命令，并等待它保存好世界。
2. 状态行会变为**已退出，退出码 0**，表示服务器已正常关闭。通过**启动**按钮可以随时再次启动它。
3. 要退出 `lip`，请按 `Esc` 回到侧边栏，再按一次 `Esc`，然后选择**退出**。

下次只需在 `D:\servers\survival` 文件夹里直接启动 `lip`。就算在别的文件夹里启动，`lip` 也记着你的服务器：在「主页」的**选择工作区**上按 `Enter`，在列表里找到 `D:\servers\survival` 按 `Enter`，然后选择**切换**即可。

## 你现在有了什么

- 一个装有游戏和 LeviLamina 的 `D:\servers\survival` 文件夹。它只是一个普通文件夹，随时可以备份或移动到别处。
- 一个可以在 `lip` 的「服务器」页面随时启动和停止的服务器。

::: warning 改动之前先停止服务器
服务器运行期间，`lip` 不会在服务器文件夹里安装、更新或移除任何内容，也不会保存对 `server.properties`、白名单和权限的修改。
:::

## 下一步

- 为服务器安装模组：[给服务器安装模组](install-mods.md)。
- 让其他玩家加入服务器：[让朋友连上你的服务器](let-friends-join.md)。
- 用命令完成同样的操作（适合脚本和远程机器）：[用命令行开服](command-line.md)。
- 修改服务器名称、游戏模式或玩家人数：[游戏配置](https://levimc.org/zh-Hans/lip/interface/game_config.html)。
- 设置服务器崩溃后自动重启：[服务器](https://levimc.org/zh-Hans/lip/interface/server.html)。
- 再开一个服务器：[工作区](https://levimc.org/zh-Hans/lip/interface/workspaces.html)。更换游戏或 LeviLamina 版本：[服务器](https://levimc.org/zh-Hans/lip/interface/server.html)页面上的**更改版本…**。
- 全面了解界面的各个页面：[界面导览](https://levimc.org/zh-Hans/lip/interface/tour.html)。
- 了解 `lip` 如何在 Linux 和 macOS 上运行 Windows 服务器：[Linux 与 macOS](https://levimc.org/zh-Hans/lip/guides/linux_macos.html)。
- 遇到问题：[lip 故障排查](https://levimc.org/zh-Hans/lip/guides/troubleshooting.html)和 [LeviLamina 问题排除](https://levimc.org/zh-Hans/faq/server/levilamina/errors/)。
