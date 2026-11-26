# 内部机制

读完本页，你就知道 lip 如何查找包的版本、如何不借助 `git` 与 git 仓库通信、缓存了什么、如何在版本之间做选择，以及如何为服务器准备系统。本页写给好奇的人和包的作者。[lip 的工作原理](how_lip_works.md)给出了总览，确切的定义则在 [lip 协议](https://github.com/LiteLDev/lip/blob/main/protocol/README.md)里。

## 一次操作的步骤

`lip setup`、`lip install`、`lip uninstall` 和 `lip update` 执行的是同样的步骤：

1. **加锁并恢复。** 占用工作区锁 `.lip/lock`，把上次被中断的操作做完或撤销。
2. **状态文件。** 从 `.lip/state.json` 读取已安装的包。没有这个文件的工作区视为没有安装包，但如果存在 lip v0.x 的 `tooth_lock.json`，则改为读取后者。
3. **环境。** 无论在什么系统上，包都按运行端 `server` 和平台 `win-x64` 来选择。
4. **解析。** 把每个来源变成一串候选：它指向的各个版本，最新的在前，每个版本带上所请求变体在该环境下的条目。
5. **求解。** 为每个请求和每个依赖选定一个候选，使每个包只出现一次，并且没有两个模组同名。
6. **计划。** 先计划卸载离开集合的包（按安装顺序的逆序），再安装进入集合的包（依赖在前）。做计划时会下载所有将要写入的归档和资源，并检查一切可能失败的地方：每个文件归谁所有、`preserve`、路径、每条放置规则的 `src`、每个模组在其 `manifest.json` 里的名字，以及 `mods` 是不是链接。
7. **准备系统**，如果要运行 Windows 程序。见[系统依赖](#系统依赖)。
8. **应用。** 如果 `mods` 不存在就创建它，然后执行计划好的钩子命令和文件更改，每一项操作前都先记入日志。
9. **状态文件。** 所有步骤都成功后，保存一次状态文件。

第 8 步之前的失败不会动工作区。第 8 步当中的失败，或者按下 Ctrl+C，会让 lip 撤销这次操作的每一处更改。钩子命令做过的事不会被撤销。

试运行会在第 6 步之后停下，且在第 1 步里不加锁，也不做任何修复。

### 同一时间只有一次操作

一次操作会独占地打开 `.lip/lock`：在 Windows 上是不共享地打开，在 Linux 和 macOS 上是独占的 `flock`。这个文件会一直保留，从不删除。对同一工作区的第二次操作不会等待，而是立刻失败，并报错：

```text
lip cannot take the workspace lock '<workspace>/.lip/lock': most likely another lip command is changing the workspace '<workspace>'. Wait for the other lip command to finish, then try again. If no other lip command is running, a program may be holding the lock file open: close it, then try again.
```

`lip run` 只在启动服务器之前、恢复被中断操作的那一刻占用这把锁。服务器运行期间，它以同样的方式占用服务器锁 `.lip/server.lock`。在同一工作区启动第二个服务器会失败，并报错：

```text
A server of the workspace '<workspace>' is already running: another lip run, the interface of lip or the daemon of lip runs it, and holds the server lock '<workspace>/.lip/server.lock'. Stop that server first, or attach to it with 'lip run --managed' when it is a managed server.
```

这两把锁互不相干。进程被杀掉时，锁会随文件句柄一起释放，所以绝不会有锁遗留下来。

## 包的解析

lip 没有中央仓库，也没有模块代理。像 `github.com/user/repo` 这样的包 ID，对应的就是 git 仓库 `https://github.com/user/repo.git`。

- **版本。** 仓库的版本来自名字恰好为 `v` 加 [SemVer 2.0.0](https://semver.org/) 版本号的标签，例如 `v1.2.3`。其他标签会被忽略，包括 `v1.2` 或 `v01.2.3` 这样不严格的写法。附注标签按它所指的提交计算。
- **引用。** 带引用的来源只有一个候选。`@branch:<name>` 和 `@tag:<name>` 在每条命令中查询一次。`@rev:<commit>` 不需要查询，直接按提交 ID 获取。缩写的提交 ID 会被拒绝，因为解析它需要完整的历史，而 lip 从不下载完整历史。
- **惰性候选。** 仓库的候选按从新到旧的顺序、只在需要时才产生。lip 只会打开求解过程真正用到的版本。
- **怎样才算候选。** 一个版本要成为候选，它的 `lip.toml` 必须有效，其中的 `id` 必须是仓库的路径，`version` 必须等于标签的版本，并且所请求的变体在该环境下有条目。否则 lip 会继续看下一个版本，并记下原因，以便在没有任何版本合适时告知你。
- **没有标签版本时。** 在分支、提交，或者不是版本号的标签上，包的版本取自其 `lip.toml` 里的 `version`。
- **游戏**是例外。`github.com/LiteLDev/bds` 不是仓库。lip 根据 `https://levimc.org/api/v4/mc/versions/` 上的服务器构建列表自己生成它的包，并从 minecraft.net 下载服务器。
- **其他来源。** URL 指向通过 HTTPS 下载的 ZIP 压缩包，本地路径指向 ZIP 文件或文件夹。它们各有一个候选。

一个版本只有在它的标签仍存在于仓库里时才能安装。只支持能通过 HTTPS 访问的公开仓库。比较包 ID 时不区分 ASCII 字母的大小写。

## git 客户端

lip 用内置的客户端与 git 仓库通信，使用的是 git 智能 HTTP 协议第 2 版。**不需要 `git` 程序，lip 也从不运行它。**

- **列出标签。** lip 用 `ls-refs` 向服务器查询引用，范围限定在 `refs/tags/v`。对于分支或标签引用，它只查询 `refs/heads/<name>` 或 `refs/tags/<name>` 本身。
- **读取 `lip.toml`。** lip 只获取那一个提交的树：做一次浅的、部分的获取（`deepen 1`、`filter blob:none`），不传输任何文件内容。然后只获取那一个文件；没有 `lip.toml` 时则获取 `tooth.json`。因此，无论仓库多大，查看一个版本只需要几千字节。
- **安装。** 文件内容只在安装包时才获取，而且只获取这个包要从归档里放置的那些文件。
- **完整性。** 每个 git 对象都会对照它的对象 ID 进行校验。
- **代理。** `github_proxy` 设为 URL 后，对 `github.com` 仓库的请求会先走代理（发往这个 URL 加上 `/` 和请求的完整地址），失败后再直接发往 `github.com`。从 GitHub 地址（`github.com`、`*.github.com`、`*.githubusercontent.com`）下载的文件遵循同样的规则。见 [GitHub 很慢或被屏蔽时](../guides/configuration.md#github-很慢或被屏蔽时)。

服务器必须像 GitHub 那样支持这些特性。只转发文件下载的代理无法提供仓库访问。

## 缓存

缓存目录存放 lip 通过 HTTPS 下载的文件：URL 来源指向的 ZIP 压缩包、包的资源，以及游戏。

- **条目。** 每个下载保存为 `http-<hash>`，其中的哈希是其 URL 的 SHA-256。这个 URL 是包里写的原始地址，与使用了什么代理无关。
- **写入。** 下载先写到缓存目录里的 `.tmp` 文件，完成后再重命名到位。因此，只要条目存在就一定是完整的，多个 lip 进程可以共用缓存。
- **修复。** 当 lip 需要一个 ZIP 压缩包，而缓存里的文件不是有效的 ZIP 时，它会删除这个条目并重新下载，且只重试一次。
- **不缓存的东西。** git 仓库的任何内容都不缓存到磁盘。标签列表和树在单条命令执行期间保存在内存里，下一条命令会重新查询，所以被移动的标签会立刻生效。
- **不校验内容。** 对 ZIP 压缩包和资源只检查是否为有效的 ZIP 压缩包，不记录也不比较其内容的校验和。

`lip cache clean` 会删除整个缓存目录。试运行会下载它需要检查的内容，但不往缓存里写任何东西。lip 从不写入系统的临时目录。

## 求解

求解就是为每个请求和每个依赖选定要安装的候选。

- **固定。** 已安装的包按原样参与求解，不联网，直接从状态文件重建。如果这样无法满足请求，lip 会重新求解：这次只固定由你显式安装的包，依赖的版本则可以变动。依赖已安装的版本会被优先尝试，所以只有必须变动的才会变动。
- **更新。** `lip update` 从一开始就按第二种方式求解，这样已安装的依赖绝不会拖住你要更新的包，阻碍它升级到最新版本。
- **偏好。** 靠前的候选优先，也就是优先选择仓库的最新版本。
- **游戏和加载器不动。** `lip install` 和 `lip update` 会围绕现有的游戏和加载器求解。找不到合适的组合时，错误信息会给出它们的版本，并提示运行 `lip setup`。安装服务器时则按新的游戏和加载器求解，只有当某个模组没有任何版本与之相配时，才把它排除在外。
- **顺序。** 包按依赖在前的顺序安装。循环依赖里的包按标识排序。
- **清理。** 不再被任何由你安装的包所需要的依赖会被卸载。
- **同一个包。** 只有当 lip 解析出的包在标识、版本或提交上与已安装的不同时，才会替换它。来自 URL 或本地路径的包没有提交。
- **根据状态文件重新安装。** 当 lip 再次需要某个已安装包的文件时，会使用状态文件里记录的包文件来安装，而不是重新解析：对仓库来说，从记录的提交安装；对其他来源，则从其当前指向的归档安装。

## 包文件的校验

`lip.toml` 由 [`lip.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/lip.schema.toml) 描述，用户设置由 [`config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/config.schema.toml) 描述，工作区设置由 [`workspace-config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/workspace-config.schema.toml) 描述，状态文件由 [`state.schema.json`](https://github.com/LiteLDev/lip/blob/main/protocol/state.schema.json) 描述。

- **在 schema 之外**，lip 还会检查 [lip.toml(5)](https://github.com/LiteLDev/lip/blob/main/protocol/lip.toml.md) 的要求：有效的包 ID 和版本、有效的依赖键和范围、运行端和平台、同一变体里没有两个条目针对相同的运行端和平台、每个条目最多一个 `mcmod` 资源，以及有效的 glob。`lip.toml` 无效的归档不视为包，不会产生候选，lip 也会报告原因。
- **lip v0.x 的文件。** 没有 `lip.toml` 的归档会读取其格式 1、2 或 3 的 `tooth.json`，并在解析时直接完整转换成包文件。因此所有包都由同一个安装器处理。位于版本标签上的 `tooth.json` 按标签的版本安装，无论它自己的 `version` 写的是什么。`tooth_lock.json` 会变成 `.lip/state.json`，`liprc.json` 会变成 `config.toml`，都在 lip 第一次处理它们时自动完成。见 [lip-compatibility(7)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-compatibility.md)。

包的作者可以在 [lip.toml](lip_toml.md) 一页找到格式说明。

## 工作区状态和日志

[状态文件](state_file.md) `.lip/state.json` 为每个已安装的包记录：是否由你主动安装、安装时使用的包文件、来源、来自仓库时的提交，以及它拥有的文件。

操作之所以能做到“全有或全无”，靠的是三类文件：

- **日志** `.lip/journal`。每次更改在执行前都先记在这里，并刷写到磁盘。其中的路径相对于工作区，因此移动或复制工作区时，中断的操作也会一并带走。
- **备份。** 操作要替换或删除的文件，会先在同一目录里重命名为 `.<名字>.bak`；若该名称已被占用，则依次使用 `.<名字>.bak1`、`.<名字>.bak2`，以此类推。在 Windows 上它还会带上隐藏属性。
- **暂存的状态文件。** 新的状态先写入 `.lip/state.json.tmp`，再重命名覆盖 `.lip/state.json`。

操作成功时，lip 将日志标记为已提交，将状态文件重命名到位，删除备份和因操作而清空的目录，最后删除日志。因被其他程序打开而无法删除的备份会保留下来，并在警告中指出。

操作失败或取消时，lip 会倒序回放日志：删除它创建的内容，并将每个备份重命名回原处。

若 lip 被强行终止，日志会保留下来。下一次操作或下一次 `lip run` 会在获取工作区锁之后读取日志：带提交标记的日志会继续完成，不带的则会撤销。如果部分内容暂时无法撤销，日志会改写为仅保留剩余部分，且后续命令会一直失败，直到撤销完成为止。

这些格式已在 [journal(5)](https://github.com/LiteLDev/lip/blob/main/protocol/journal.md) 和 [lip-workspace(7)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-workspace.md) 中固定下来，以便其他程序也能协同工作。

## 系统依赖

工作区里的程序（即包的钩子命令和 Windows 服务器）需要两项系统依赖，均由 lip 自动安装：

- **Wine**（Linux 和 macOS）。每个版本的 lip 都指定了一个 x64 Linux 版的 Wine 构建（来自 [Kron4ek/Wine-Builds](https://github.com/Kron4ek/Wine-Builds)）和一个 macOS 版的构建（来自 [Gcenx/macOS_Wine_builds](https://github.com/Gcenx/macOS_Wine_builds)，在 arm64 上通过 Rosetta 2 运行）。lip 只下载一次，解压到数据目录的 `wine/` 下供所有工作区共用，且从不运行其他 `wine`。
- **Microsoft Visual C++ 运行库**（x64，即 Visual C++ Redistributable，Windows）。注册表项 `HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64` 下的 `Installed` 值为 1 时，视为已为系统安装。若其文件——即 Microsoft 允许应用程序随附分发的运行库 DLL（`msvcp140*.dll`、`vcruntime140*.dll`、`concrt140.dll` 和 `vccorlib140.dll`）——已完整解压到数据目录的 `vc-runtime\14.44.35211` 下，则视为已为用户安装。若两种方式均未安装，Windows 上的 lip 会从 Microsoft 下载 `Microsoft.VC.14.44.17.14.CRT.Redist.X64.base.vsix`，并以当前运行 lip 的用户身份将这些 DLL 解压到该目录，无需管理员权限，也不会弹出用户帐户控制提示。运行库仅为当前用户安装而未为系统安装时，lip 会将该目录置于服务器和钩子命令 `PATH` 的最前面。在 Linux 和 macOS 上，lip 不安装此项：Wine 自带的 Visual C++ 运行库已足以运行服务器。

lip 通过以下机制保证安全：

- **固定的下载。** 每个文件的 URL 和 SHA-256 均内置于 lip 中。SHA-256 不匹配的下载文件会被直接删除，既不解压也不运行。
- **绝不半途而废。** Wine 以及 Windows 上的 Visual C++ 运行库会先解压到 `.tmp` 目录，再重命名到位。中途打断的构建绝不会运行，中途打断的运行库文件也绝不会使用。
- **一次一个。** 同时执行安装的多个 lip 进程会通过数据目录里的 `lock` 文件互相等待。
- **在更改工作区之前。** 在需要运行钩子命令的操作开始更改工作区之前、`lip setup` 安装 Windows 构建期间，以及 `lip run` 启动 Windows 服务器之前，lip 会先准备好系统环境。若在此步骤失败，工作区将保持原样。

Linux 服务器不需要这两项依赖。当所有依赖均已就绪时，准备系统环境只需检查一下 Wine 目录；在 Windows 上则只需查询一次注册表，再检查一下运行库目录。

通过 Wine 运行时，lip 使用 `wine cmd /s /c <command>` 运行钩子命令，使用 `wine` 加服务器文件的绝对路径运行服务器；除非你自行设置，否则会将 `WINEPREFIX` 设为工作区下的 `.lip/wine`，将 `WINEDEBUG` 设为 `-all`，并将 `WINEDLLOVERRIDES` 设为 `mscoree,mshtml=;winemac.drv,winex11.drv=d`。详见 [Linux 与 macOS](../guides/linux_macos.md)。

## 守护进程

除 `lip daemon` 命令外，所有命令及界面均由用户的守护进程执行——这是一个仅带 `--daemon` 参数启动的 `lip` 进程。你启动的 `lip` 则是它的客户端。

1. **连接。** 在 Windows 上通过命名管道 `\\.\pipe\lip-<SID>` 连接，仅当前用户可打开。在 Linux 和 macOS 上通过套接字 `$XDG_RUNTIME_DIR/lip/daemon.sock` 连接；未设置 `XDG_RUNTIME_DIR` 时，使用状态目录下的 `daemon.sock`。套接字权限为 `0600`，所在目录权限为 `0700`。
2. **启动。** 若无进程监听，客户端会用自身的可执行文件启动守护进程（脱离终端），等待它开始监听后再连接。即使两个客户端同时启动，最终也只会留下一个守护进程：第二个因无法创建端点而自行退出。
3. **替换。** 当守护进程属于不同版本或来自不同可执行文件时（例如执行 `lip self-update` 之后），客户端会请求它退出并启动新进程。若旧守护进程正在执行命令或运行托管服务器，则会继续保留。此时客户端会自行执行命令；唯一的例外是 `lip run --managed`，它仍交由旧守护进程执行。
4. **发送。** 客户端发送命令，并附带所在文件夹、环境变量、标准流是否为终端，以及终端的大小和颜色。守护进程据此执行命令。来自不同客户端的命令并行执行，各自拥有独立的文件夹、环境、代理和失败报告。
5. **转发。** 守护进程仅在命令需要时读取客户端输入，并将命令及其子程序的输出发回客户端。客户端收到的信号也会一并转发。最后，客户端以命令的退出码退出。

界面也以同样的方式运行：守护进程负责绘制，客户端将绘制内容输出到终端，并将按键操作和终端大小传回守护进程。

守护进程运行的程序（包括服务器）均不在你的终端会话中，它们的输出通过管道而非终端传给 lip。

当持续 10 分钟既无连接也无托管服务器时，`lip self-update` 替换了 lip 后，或执行 `lip daemon stop` 时，守护进程便会退出。具体规则见 [lip-daemon(1)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-daemon.md)。

## 关于规范的说明

lip 仅管理服务器工作区：运行端始终为 `server`。客户端工作区则交由实现了同一协议的启动器（如 LeviLauncher）管理。

lip 实现了 [lip 协议](https://github.com/LiteLDev/lip/blob/main/protocol/README.md)。若本页内容与协议不一致，以协议为准。
