# 设置

读完本页，你就能更改界面语言、设置 lip 连接 GitHub 的方式、让服务器在崩溃后自动重启、释放磁盘空间，以及更新 lip。

## 页面

在侧边栏移到**设置**，按 `Enter` 打开页面。

![“设置”页：从“语言”到“关于”共七行，每行都有自己的值。列表下面的一行写着“界面使用的语言。”](/screenshots/zh-Hans/settings-01-list.svg)

1. 一行设置及其当前值。用 `↑` `↓` 移动，按 `Enter` 修改或执行所选行。
2. 所选行的说明。如果值太长、一行放不下，也会在这里完整显示。

| 行 | 作用 | 归属 |
| --- | --- | --- |
| [语言](#语言) | 选择界面语言。 | 这台电脑上的当前用户。 |
| [GitHub 代理](#github-代理) | 设置 lip 连接 GitHub 的方式。 | 这台电脑上的当前用户。 |
| [自动重启](#自动重启) | 服务器崩溃时自动重启。 | 当前工作区。 |
| [清理缓存](#清理缓存) | 删除已下载的文件。 | 这台电脑上的当前用户。 |
| [检查更新](#更新) | 检查并安装新版 lip。 | lip 本身。 |
| [守护进程](#守护进程) | 查看 lip 的后台进程。 | 这台电脑上的当前用户。 |
| [关于](#关于) | 查看 lip 的版本。 | lip 本身。 |

此页面没有“保存”按钮，每项更改都会立即生效。

## 语言

界面支持英文、简体中文和繁体中文。

1. 移到**语言**，按 `Enter`。

   ![“语言”对话框列出“跟随系统”、English、简体中文和繁體中文。](/screenshots/zh-Hans/settings-02-language.svg)

2. 用 `↑` `↓` 选择语言，按 `Enter`。整个界面会立刻切换为所选语言，无需重启。

   ![刚选完语言之后的英文“设置”页。语言这一行显示 English。](/screenshots/zh-Hans/settings-23-language-changed.svg)

   1. 所选语言。
   2. 界面上的所有文字（包括侧边栏和最下面一行）都会切换为该语言。

**跟随系统**使用系统语言：

- 在 Windows 上，使用当前用户的显示语言。
- 在其他系统上，依次检查环境变量 `LC_ALL`、`LC_MESSAGES`、`LANG`，采用第一个指明了语言的值。
- 台湾、香港、澳门的中文区域设置，或带有 `Hant` 标记的区域设置使用繁体中文；其他中文区域设置使用简体中文；其余一律使用英文。

只有界面本身有翻译。无论选择哪种语言，命令输出的内容（计划中的各行、安装过程消息以及错误信息）都是英文。

::: details 用命令做同样的事
这项设置对应配置中的 `language` 键，详见[配置](../reference/configuration.md)。

```shell
lip config set language zh-Hans
lip config delete language
```

可选值为 `en`、`zh-Hans` 和 `zh-Hant`。删除该键即恢复为**跟随系统**。
:::

## GitHub 代理

lip 从 GitHub 下载 LeviLamina 和大多数模组。如果 GitHub 访问缓慢或无法连接，可以使用 **GitHub 代理**：lip 会在代理网址末尾加上 `/`，再拼接到每个 GitHub 下载地址前面。

这一行有三种值：

| 值 | 含义 |
| --- | --- |
| **未设置** | lip 直接连接 GitHub。每次启动界面时，lip 都会在后台检查 GitHub 是否有响应；若无响应则询问如何处理，详见[连不上 GitHub 时](home.md#连不上-github-时)。 |
| **直连** | lip 直接连接 GitHub，不检查也不询问。 |
| 一个网址 | lip 通过该代理请求 GitHub。若经由代理的请求失败，则改为直接请求 GitHub。 |

lip 和本文档都不会推荐任何代理。lip 从 GitHub 下载的所有内容都会经过代理，请只使用你信任的代理。

在这一行按 `Enter` 打开操作菜单：

![“GitHub 代理”菜单有三行：“设置代理…”“直接连接”和“重置”。“重置”是灰色的。](/screenshots/zh-Hans/settings-06-proxy-menu.svg)

1. **设置代理…**：输入代理网址并测试。
2. **直接连接**：将值设为**直连**。当前已是直连时，此项呈灰色。
3. **重置**：清除此项设置，恢复为**未设置**。原本就未设置时，此项呈灰色。

### 设置代理

1. 在**设置代理…**上按 `Enter`，输入或粘贴以 `https://` 开头的代理网址。只填代理服务本身的地址即可，lip 会自动在后面拼接完整的 GitHub 地址。

   ![“GitHub 代理”对话框，“代理网址”输入框里是一个以 https 开头的示例网址。](/screenshots/zh-Hans/settings-07-proxy-url.svg)

2. 按 `Enter`。lip 会通过该代理向 GitHub 请求 lip 的版本列表来测试连接，最多等待 10 秒。按 `Esc` 可中止测试并返回网址输入框。

   ![“测试代理”对话框显示“处理中…”。](/screenshots/zh-Hans/settings-08-testing.svg)

3. 若 GitHub 通过代理正常响应，lip 会保存设置并显示**已保存。**，该行随即显示所填网址。

   ![“GitHub 代理”一行现在显示刚才输入的网址，最下面一行的末尾是“已保存。”](/screenshots/zh-Hans/settings-09-proxy-saved.svg)

输入内容必须是完整的网址，缺少 `https://` 前缀会被视为无效：

![输入框里是 old-proxy.example.com，下面显示“不是网址”。](/screenshots/zh-Hans/settings-10-not-a-url.svg)

### 测试失败时

如果未能通过代理收到 GitHub 的响应，lip 会说明原因，且暂不保存。

![“代理不可用”对话框写着“GitHub answered with the HTTP status 502.”，有“重新输入”“仍然保存”“取消”三个按钮。](/screenshots/zh-Hans/settings-11-proxy-failed.svg)

1. **重新输入**：返回网址输入框，方才输入的网址会保留，便于修改。
2. **仍然保存**：忽略测试失败，直接保存该代理。适用于你确信代理可用、只是未能通过测试的情况。
3. **取消**或 `Esc`：放弃更改，保持原来的值。

失败原因以英文显示。502、404 等状态码表示代理有响应，但返回的不是预期的 GitHub 内容；超时则表示 10 秒内没有任何响应。详见[故障排除](../guides/troubleshooting.md)。

### 直接连接，或重置

如果网络可以顺畅访问 GitHub，可选择**直接连接**：此后 lip 不再检查，也不再询问。

![“GitHub 代理”一行显示“直连”，最下面一行的末尾是“已保存。”](/screenshots/zh-Hans/settings-12-direct.svg)

**重置**会将设置恢复为**未设置**：lip 直接连接 GitHub，并在下次启动界面时重新检查。

::: details 用命令做同样的事
这项设置对应配置中的 `github_proxy` 键，详见[配置](../reference/configuration.md)。

```shell
lip config set github_proxy https://proxy.example.com/
lip config set github_proxy ""
lip config delete github_proxy
```

第二行对应**直接连接**，第三行对应**重置**。用命令设置时不会测试代理。
:::

## 自动重启

开启**自动重启**后，当当前工作区的服务器崩溃（即因出错退出，而非正常停止）时，lip 会自动重启它。

移到**自动重启**，按 `Space` 或 `Enter` 切换：`[x]` 为**开**，`[ ]` 为**关**。

![“自动重启”一行显示打勾的方框和“开”。下面一行写着“此工作区的服务器崩溃时自动重启。”](/screenshots/zh-Hans/settings-13-auto-restart.svg)

1. 这项设置仅对当前工作区生效。各个工作区的设置彼此独立，切换工作区即可查看对应工作区的设置。

- 服务器崩溃后，lip 会等待 5 秒再重启。
- 手动停止的服务器不会触发自动重启。
- 若服务器持续崩溃，10 分钟内最多重启 5 次。
- 是否重启以服务器退出那一刻的设置为准，因此在服务器运行期间也可以随时切换。

[服务器](server.md)页上也有同一个开关。

::: details 用命令做同样的事
```shell
lip config set restart on-failure --workspace
lip config set restart never --workspace
```
:::

## 清理缓存

lip 会将下载的文件存入缓存，避免重复下载。这一行显示缓存文件夹的路径。清理缓存可释放磁盘空间；之后若再用到这些文件，lip 会重新下载。

1. 移到**清理缓存**，按 `Enter`，lip 会弹出确认提示。

   ![“清理缓存”对话框询问“要删除所有已下载的文件吗？”，有“清理”和“取消”两个按钮。](/screenshots/zh-Hans/settings-14-clear-cache.svg)

2. 选择**清理**并按 `Enter`。

   ![“清理缓存”对话框写着“缓存已清理。”，有“确定”按钮。](/screenshots/zh-Hans/settings-15-cache-cleared.svg)

此操作会删除整个缓存文件夹及其中的所有内容，即 lip 下载过的一切文件：游戏、LeviLamina、模组文件以及已下载的 lip 更新。工作区、工作区中的服务器与模组，以及各项设置都不会受到影响。

对应的命令是 [`lip cache clean`](../reference/commands/cache_clean.md)。

## 更新

lip 支持自我更新。

### 检查更新

移到**检查更新**，按 `Enter`。lip 会向 GitHub 查询自己的最新发行版。

如果没有新版本，这一行会提示已是最新：

![“检查更新”一行在版本 0.41.0 后面显示“已是最新”，最下面一行的末尾也是“已是最新”。](/screenshots/zh-Hans/settings-16-up-to-date.svg)

如果有新版本，lip 会询问是否安装：

![“安装更新”对话框写着“有新版本 lip 0.42.0。”，有“安装”和“以后再说”两个按钮。](/screenshots/zh-Hans/settings-04-update-available.svg)

选择**安装**会立即开始安装。选择**以后再说**会关闭对话框，但在页面上保留新版本信息，并在**检查更新**下方新增一行**安装更新**：

![“检查更新”一行显示“0.41.0 → 0.42.0”，下面新出现的“安装更新”一行显示 0.42.0。](/screenshots/zh-Hans/settings-05-update-row.svg)

### 安装更新

1. 在**安装更新**上按 `Enter`，再在**安装**上按 `Enter`。

   ![“安装更新”对话框询问“要安装 lip 0.42.0 吗？”，有“安装”和“取消”两个按钮。](/screenshots/zh-Hans/settings-19-install-question.svg)

2. lip 会下载、校验并安装发行版。后续步骤取决于 lip 当初的安装方式。

   如果 lip 是用便携版压缩包安装的，它的文件会被立即替换：

   ![“安装更新”对话框写着“lip 0.42.0 已安装。请退出 lip，然后再次运行 lip 以使用新版本。”，有“退出 lip”和“以后再说”两个按钮。](/screenshots/zh-Hans/settings-20-installed.svg)

   如果 lip 是用 Windows 安装程序安装的，lip 会启动新版本的安装程序。由于安装程序需要修改程序文件，Windows 会请求你的许可：

   ![“安装更新”对话框写着“lip 0.42.0 的安装程序正在运行。请退出 lip 以完成安装，然后再次运行 lip 以使用新版本。”，有“退出 lip”和“以后再说”两个按钮。](/screenshots/zh-Hans/settings-22-installer.svg)

3. 选择**退出 lip** 会立即退出；仅当有服务器正在运行时，lip 才会先向你确认。选择**以后再说**会关闭对话框，lip 继续运行。

### 安装之后

在重新运行之前，当前打开的 lip 仍是旧版本。这一行会提醒你：

![“检查更新”一行显示“0.42.0 · 请重启 lip”。“安装更新”一行已经消失。](/screenshots/zh-Hans/settings-21-restart-lip.svg)

- **请重启 lip**：退出并重新运行 lip，此时启动的就是新版本。
- **安装程序运行中**：退出 lip，让安装程序完成替换，然后再重新运行 lip。

在此之前，在**检查更新**上按 `Enter` 只会再次显示同一条消息，而不会重新检查。

界面退出时，lip 还会在终端里提示接下来的操作，例如“lip 已更新到 0.42.0。请再次运行 lip 以启动新版本。”无论界面如何结束都会输出这条提示——无论是你主动退出，还是 Windows 安装程序为了替换文件而关闭了 lip。

对应的命令是 `lip self-update --check` 和 `lip self-update`。更新的完整说明见 [`lip self-update`](../reference/commands/self_update.md)。

## 守护进程

**守护进程**是 lip 的后台进程，负责执行命令、运行界面，以及托管你启动的服务器，因此关闭终端后服务器仍会继续运行。详见 [lip 的工作方式](../concepts/how_lip_works.md)。

这一行显示守护进程是否在运行。选中这一行时，列表下方会显示更多信息：

![“守护进程”一行显示“运行中 · 0.41.0 · PID 4120”，列表下面的内容以“进行中的命令：1 · 运行中的服务器：0”结尾。](/screenshots/zh-Hans/settings-17-daemon.svg)

1. **运行中**，以及守护进程的 lip 版本。
2. **PID**：守护进程的进程 ID，系统的任务管理器用它来标识进程。
3. **进行中的命令**：守护进程当前正在执行的命令数量。每个打开的界面也算作一条命令，因此这里至少是 1。
4. **运行中的服务器**：守护进程当前在所有工作区中运行的服务器总数。仅当当前界面由该守护进程执行时才会显示此项。

按 `Enter` 可重新查询守护进程并刷新数值。

**未运行**表示没有守护进程响应。此时界面由 lip 自行执行，你在其中启动的服务器会在退出 lip 时停止。

无法在界面中停止守护进程，因为界面本身就是由守护进程执行的。如需停止，请退出 lip，然后运行 [`lip daemon stop`](../reference/commands/daemon.md)。

## 关于

最后一行显示当前运行的 lip 版本。在此处按 `Enter` 没有反应。

![选中了“关于”一行，显示“lip 0.41.0”。下面一行写着“当前运行的 lip 版本。”](/screenshots/zh-Hans/settings-18-about.svg)

报告问题时请提供此版本号。对应的命令是 `lip --version`。
