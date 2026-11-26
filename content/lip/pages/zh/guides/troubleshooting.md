# 故障排查

读完本页，你就能看懂命令失败时 lip 给出的提示，找到失败报告，并解决最常见的几类问题。

## 读懂失败信息

命令失败时，lip 会在终端输出三项内容：

```text
error: There is no server to run: 'D:\servers\survival\bedrock_server_mod.exe' is not a file, though the workspace has the game bds 1.26.60 with a loader. It may have been deleted or moved by hand. lip does not install a package again that is installed in the same version, so setting up the same versions here does not bring the file back. Restore it from a backup, or run 'lip setup --game 1.26.60 --loader levilamina@26.60.3' in an empty folder and copy the file from there.

Full report: .lip\logs\20261114T201502Z-4120.log
```

1. **`error:`** 出了什么问题。如果一个问题是由另一个问题引起的，每个原因各占一行，以 `caused by:` 开头。
2. **`hint:`** 你可以怎么做。提示可能有好几条，也可能没有。
3. **`Full report:`** 一个文件，记录了 lip 对这次失败所了解的全部信息。

先看错误和提示，大多数时候这就够了。

界面会在对话框里显示同样的内容：

![服务器页面上有一个标题为“启动服务器 · 失败”的对话框。对话框显示错误：没有可运行的服务器，因为 bedrock_server_mod.exe 不存在；下面是 .lip\logs 中完整报告的路径。标注 1 指向错误，标注 2 指向报告。](/screenshots/zh-Hans/dialog-01-failure.svg)

### 失败报告

- **位置：** 运行命令时所在文件夹下的 `.lip/logs/`。在界面中，则位于当前工作区下。
- **名字：** 失败时间（UTC）加上 lip 进程编号，例如 `20261114T201502Z-4120.log`。
- **数量：** lip 保留最新的 20 份，更早的会自动删除。
- **格式：** 纯文本，用任何编辑器都能打开。

一份报告包含五个部分：

| 部分 | 内容 |
| --- | --- |
| `Environment` | 时间、lip 版本、命令、文件夹、系统信息、配置目录和缓存目录、命令是否由守护进程执行，以及已设置的代理变量。 |
| `Error` | 错误和提示，与终端里显示的一致。 |
| `Exception` | 错误的完整技术细节。 |
| `Workspace (.lip)` | `.lip` 里的内容；如果有中断的操作，还会包含其日志。 |
| `Trace` | lip 一步步执行的操作：网络请求、考虑过的版本、改动的文件，以及包内程序的输出。 |

URL 中的密码和令牌（例如代理凭据）会替换为 `***`。即便如此，分享前还是请先检查一遍，因为报告里包含你的文件夹名和包名。

有些失败不会生成报告：

- **命令行写错了**，例如用了不存在的选项。lip 会说明问题，并提示 `Run lip --help to see how to use lip.`
- **你取消了命令。** lip 会输出 `Cancelled. Any changes to the workspace were undone.`
- **服务器运行了一阵后失败。** `lip run` 只会原样返回服务器的退出码，不会输出额外信息。请直接查看服务器自身的输出。

如果报告无法写入（例如磁盘只读），lip 会改为在终端直接输出报告中最重要的部分。

### 寻求帮助

如果错误和提示没能解决问题，请前往 <https://github.com/LiteLDev/lip/issues> 提交 issue，并附上报告。如果某条提示说 `This looks like a bug in lip`，请务必提交：那是我们的问题，不是你的。

## 另一个 lip 正在更改工作区

```text
error: lip cannot take the workspace lock 'D:\servers\survival\.lip\lock': most likely another lip command is changing the workspace 'D:\servers\survival'. Wait for the other lip command to finish, then try again. If no other lip command is running, a program may be holding the lock file open: close it, then try again.
```

同一时间只能有一条命令更改同一个服务器文件夹。如果 `lip setup`、`lip install`、`lip update` 或 `lip uninstall` 正在处理该文件夹，或者界面正在往那里应用更改，第二条命令不会等待，而是直接失败，什么都不改。

`lip run` 也可能因此失败。在启动服务器前，以及每次自动重启前，它都要检查文件夹里有没有中断的更改，那一刻也需要获取同一把锁。

解决办法：

1. **等**另一条命令结束，再运行你的命令。检查一下其他终端；如果开着界面，也去看一眼。
2. **如果没有 lip 在工作**，那就是其他程序占用了 `.lip/lock` 文件。备份工具、同步工具和编辑器都可能这样做。关掉对应程序再试。

你永远不需要删除 `.lip/lock`。锁不是这个文件本身，而是系统对它的占用状态；持有锁的 lip 进程一结束，占用就会自动解除，就算崩溃退出也一样。

只读命令（例如 `lip list`）和所有试运行都不加锁，绝不会因此失败。

## 文件被占用

```text
hint: A file is in use by another program. Stop the server and other programs that use the workspace, then try again.
```

这发生在 Windows 上：运行中的程序会锁定自己打开的文件，导致无法替换或删除。最常见的原因是服务器本身还在运行：你在服务器运行时更改了包，而 lip 需要替换的文件正被运行中的游戏或已加载的模组占用。

此时 lip 已经撤销了更改，工作区保持原样。

解决办法：

1. **停止服务器。** 在服务器终端按 Ctrl+C，或者在界面的服务器页面选择“停止”。
2. **关闭其他**打开了该文件夹内文件的**程序**，例如正在编辑配置文件的编辑器。
3. **重新运行命令。**

如果 lip 还提示了 `Some changes could not be undone`，说明某个文件被占用得太彻底，lip 连恢复原状都做不到。同样按上述三步处理。之后在该文件夹下首次运行 `lip install`、`lip update`、`lip uninstall` 或 `lip setup` 时，lip 会先完成清理，再执行正式操作。参见[崩溃或断电之后](#崩溃或断电之后)。

界面不会遇到这种情况：只要工作区的服务器还在运行，界面就不会更改那里的包。

## 连不上 GitHub

lip 的大多数包都从 GitHub 下载。提示会指明你遇到的是哪类问题：

| 提示的开头 | 含义 | 解决办法 |
| --- | --- | --- |
| `lip could not reach the server.` | 完全没有响应：断网了，或者 GitHub 被屏蔽、访问极慢。 | 检查网络连接，然后参见[GitHub 很慢或被屏蔽时](configuration.md#github-很慢或被屏蔽时)。 |
| `The server refused the request, possibly because too many requests were sent.` | GitHub 或你的代理限制了请求频率。 | 等几分钟再试。 |
| `The repository or file does not exist, or is private.` | 名字写错了，或者仓库不是公开的。 | 检查包名和版本号是否拼错。lip 只能从公开仓库安装。 |
| `The server had a problem.` | GitHub 或目标网站出了故障。 | 稍后再试。 |
| `A file that <package> <version> publishes is missing from where its package file says it is` | 包里填写的下载地址已经失效。 | 用 `<package>@<version>` 安装其他版本，并告知包作者。 |

如果你设置了 GitHub 代理，而错误信息提示代理不支持 git 仓库，说明这个代理无法满足 lip 的要求。请运行 `lip config delete github_proxy` 将其移除，或者换一个代理。

界面启动时会检查能否连接 GitHub。如果连不上，且你之前还没做过选择，它会询问你是设置代理、直接连接，还是以后再说。

## 服务器无法启动

`lip run` 或界面里的“启动”在服务器运行起来之前就失败了。请在下方对照你看到的提示。

**`There is no server to run: this workspace has no game.`**

当前文件夹还没有安装服务器，或者你进错了文件夹。请切换到服务器文件夹，或者安装一个服务器：`lip setup --game <version>`。见 [`lip setup`](../reference/commands/setup.md)。

**`A server of the workspace '…' is already running`**

这个文件夹里已经有服务器在运行，而一个文件夹同时只能运行一个服务器。找到正在运行的服务器，在启动它的地方停止它：

- 它可能由 `lip run` 启动，正在**另一个终端**里运行。到那个终端按 Ctrl+C。
- 它可能是由界面或 `lip run --managed` 启动的**托管服务器**。运行 `lip run --managed` 接入它，再按 Ctrl+C；或者在界面的服务器页面选择“停止”。

如果服务器不是由当前界面启动、也不受它控制（比如由普通的 `lip run` 启动，或由这台机器上的其他用户运行），界面的服务器页面会显示**在此界面之外运行**。界面无法停止它，也无法显示它的输出，请在启动它的地方将它停止。

**`There is no server to run: '…' is not a file`**

文件夹里已经安装过服务器，但服务器程序不见了——可能被手动删除、移走，或者被安全软件清除。在原文件夹里重装同一版本找不回这个文件，因为已经安装的包，lip 不会把同一个版本再装一遍。请从备份中恢复该文件。如果没有备份，可以在一个空文件夹里运行错误信息给出的 `lip setup` 命令，再把缺少的文件复制过来。你也可以直接改用那个新文件夹：在里面安装模组，再把旧文件夹里的 `worlds/`、`server.properties`、`allowlist.json`、`permissions.json` 和模组配置复制过去。

**`The game of this workspace is the Linux server … which lip runs only on Linux on x64.`**

请到 x64 的 Linux 上运行它，或者改用 Windows 服务器：`lip setup --game <version> --build windows`。见 [Linux 与 macOS](linux_macos.md)。

**`lip could not install the Microsoft Visual C++ runtime into …`**

Windows 服务器需要这个运行库。lip 会免管理员权限为你安装它，做法是把文件解压到[数据目录](../reference/files.md#数据目录)下的一个文件夹，但这一步失败了。消息的后半部分说明了原因，例如磁盘已满，或者安全软件阻止 lip 写入。未完整解压的文件，lip 绝不使用。请排除原因后重新运行命令；或者自行从 <https://aka.ms/vc14/vc_redist.x64.exe> 为所有用户安装运行库（需要管理员权限）。

**`Rosetta 2 is not installed`**

Apple 芯片的 Mac 需要 Rosetta 2 才能运行 lip 的 Wine，而 lip 没有安装它：可能是你回答了“否”，可能是终端前没人导致 lip 无法询问，也可能是安装失败了。请在终端里重新运行命令并回答“是”，或者给命令加上 `--accept-rosetta-license`，或者自行运行 `softwareupdate --install-rosetta --agree-to-license` 安装 Rosetta 2。见 [Apple 芯片的 macOS](linux_macos.md#apple-芯片的-macos)。

**`lip run --managed needs the daemon of lip`**

见 [lip 自己执行了命令](#lip-自己执行了命令)。

**服务器启动后又退出了。**

这是服务器自身出错，不是 lip 的问题。`lip run` 会以服务器的退出码退出，不会生成报告。请查看服务器最后输出的几行。常见原因包括：端口被其他程序占用、世界损坏、某个模组加载失败。要排查是不是模组的问题，可以卸载最近安装的模组试试。

如果 `restart` 设为 `on-failure` 而服务器反复失败，lip 在 10 分钟内重启 5 次后将不再尝试：

```text
⚠ The server exited with code 1. lip restarted it 5 times within 10 minutes, so it does not restart it again. Look at what the server wrote above for why it fails.
```

## 守护进程是另一个版本

lip 的工作在后台进程（守护进程）中完成，运行第一条命令时就会启动它。更新 lip 后，旧版本的守护进程可能还在运行。

大多数时候你不会察觉：新版 lip 会请旧守护进程退出；旧守护进程一旦空闲就会退出，随后启动新守护进程。

如果旧守护进程正忙——正在执行命令，或者正在运行托管服务器——它就会继续保留。这时新版 lip 会提示：

```text
lip could not have its daemon carry out the command (the daemon of lip 0.41.0 that runs carries out a command or runs a managed server); it carries it out itself.
```

你的命令依然能正常完成。如果想切换到新守护进程：

1. 查看正在运行的内容：`lip daemon status`。

   ```text
   The daemon of lip 0.41.0 runs as process 4120, carrying out 0 commands.
   ```

2. 停止所有托管服务器。逐一进入服务器文件夹，运行 `lip run --managed` 并按 Ctrl+C，或者直接在界面里停止。为了接入这些服务器，`lip run --managed` 此时仍会使用旧守护进程。
3. 运行 `lip daemon stop`。下一条命令就会启动新的守护进程。

守护进程忙碌时，`lip daemon stop` 会拒绝执行并说明原因。它绝不会替你停止服务器。

## lip 自己执行了命令

```text
lip could not have its daemon carry out the command (<reason>); it carries it out itself.
```

lip 未能启动或连上守护进程，因此改由你启动的当前进程直接完成工作。这只是回退，并非失败，命令完成的工作完全一样。

不使用守护进程时，有两点不同：

- **`lip run --managed` 会失败。** 托管服务器运行在守护进程里。请改用普通的 `lip run` 运行服务器，或者先解决守护进程的问题。
- **界面不能让服务器持续运行。** 在界面里启动的服务器，会在你退出界面时停止。退出时界面会提示你。

括号里的原因指出了问题所在：

| 原因 | 怎么办 |
| --- | --- |
| `the daemon of lip <version> that runs carries out a command or runs a managed server` | 见[守护进程是另一个版本](#守护进程是另一个版本)。 |
| `the daemon that lip started did not listen within 10 seconds`、`the daemon that lip started does not listen` | 守护进程未能启动。请重新运行命令。如果问题持续，请附上 `lip daemon status` 的输出一并反馈。 |
| `the daemon keeps exiting`、`the daemon keeps being replaced` | lip 尝试连接时，守护进程连续多次退出或被替换。同时使用两个版本的 lip 时会出现这种情况。请只使用一个版本，再重新运行命令。 |
| 系统报错，例如拒绝访问 | 在 Linux 和 macOS 上，检查当前用户能否写入套接字所在目录：`$XDG_RUNTIME_DIR/lip`（该变量未设置时为 `~/.local/state/lip`）。 |

另一条提示 `lip: the daemon ended before the command did.` 表示守护进程在执行任务时被终止了。请重新运行命令。如果当时它正在修改工作区，在该工作区运行的下一条命令会先做清理。

## 崩溃或断电之后

如果命令修改服务器文件夹到一半时 lip 被终止或机器断电，改动就会停在半途。lip 对此有所防备：修改文件前，它会先把操作记录到 `.lip/journal`，并把每个文件的旧版本保留在旁边，直到整条命令执行完毕。

你无需手动处理。下次在该文件夹运行 `lip setup`、`lip install`、`lip update`、`lip uninstall` 或 `lip run` 时，lip 会先把残留状态处理干净，并告知处理结果：

```text
⚠ A lip operation on this workspace was interrupted (it started at <time>); undid its <n> changes. The workspace and its state file are as they were before it.
```

上次中断的命令还没做完，lip 已将其回滚。请重新运行那条命令。

```text
Finished an interrupted lip operation that had completed (it started at <time>): deleted the backups it left.
```

上次中断的命令只差收尾清理，lip 已代为完成。无需重新运行。

如果某个文件无法恢复（例如正被服务器占用），lip 会报错退出，列出相关文件并保留日志。请先停止服务器及占用该文件夹的程序，再运行上述任意一条命令，lip 会从中断处继续。

::: danger
不要删除 `.lip/journal`；只要该日志还在，也不要删除服务器文件夹下名为 `.<名字>.bak` 的文件。lip 需要靠它们来恢复。
:::

试运行，以及界面在应用更改前展示的计划，都只会提示有操作未完成，不会实际执行修复。

## 清理缓存

lip 会将下载的文件存入缓存，避免重复下载。缓存纯粹是为了节省时间，删掉不会丢失任何数据。

```sh
lip cache clean
```

```text
✓ Cache cleaned successfully.
```

以下情况可以清理缓存：

- **需要磁盘空间。** 游戏的下载文件很大。
- **某个下载似乎坏了**，导致同一安装反复失败。不过，缓存中不是有效 ZIP 压缩包的文件 lip 本就会自动替换，因此很少需要为此手动清理。

其他 lip 命令正在下载时请勿清理缓存，否则那条命令可能会失败（失败后重新运行即可）。

你的服务器、配置以及 lip 的 Wine 都不在缓存中，不受影响。在界面里，对应的功能是设置页面的“清理缓存”。

## 其他信息

| 提示 | 怎么办 |
| --- | --- |
| `lip is not allowed to access a file.` | 检查文件是否为只读，以及当前用户是否有服务器文件夹的写入权限。 |
| `The disk is full.` | 腾出磁盘空间（例如运行 `lip cache clean`），然后再试。 |
| `A hook command of a package failed.` | 某个包在安装或卸载时运行的程序失败了。程序输出位于错误信息上方，也记录在报告的 `Trace` 部分。这是包本身的问题，请向包的作者反馈。 |
| `Run lip in an interactive terminal.` | lip 需要向你提问，但当前的输入或输出不是交互式终端，无法询问。如果是确认 Minecraft EULA，请加上 `--accept-eula`。 |
| `The game of this workspace is <version>, with LeviLamina <version>; lip install does not change them.` | 要安装的包与当前游戏或加载器版本不兼容，错误信息会列出具体的包。请改装这些包的其他版本，或更换游戏版本：见 [`lip setup`](../reference/commands/setup.md)。 |
| `Request other versions of the packages named above, or install fewer of them together.` | 要安装的包之间互不兼容，错误信息会列出具体的包。请改装其他版本，或减少同时安装的包。 |

## 文件都在哪里

了解 lip 的文件存放位置，有助于排查问题。

| 内容 | 位置 |
| --- | --- |
| 你的服务器：游戏、世界、`server.properties`、模组 | 服务器文件夹本身 |
| lip 记录的当前文件夹信息：已安装的包、锁、日志、失败报告、Wine 前缀、工作区设置 | 服务器文件夹里的 `.lip/`（在 Windows 上为隐藏目录） |
| 你的设置 | Windows 上为 `%APPDATA%\lip`，其他系统上为 `~/.config/lip` |
| 缓存 | Windows 上为 `%LOCALAPPDATA%\lip\Cache`，其他系统上为 `~/.cache/lip` |
| lip 的 Wine | Linux 和 macOS 上为 `~/.local/share/lip` |
| 界面的工作区列表 | Windows 上为 `%LOCALAPPDATA%\lip\State`，其他系统上为 `~/.local/state/lip` |

各文件和目录的详细说明见[文件和目录](../reference/files.md)。
