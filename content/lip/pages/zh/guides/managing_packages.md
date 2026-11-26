# 管理包

读完本页，你就能用 `lip` 命令安装、列出、更新和卸载包，掌握指定包的各种写法，并在命令实际执行前预览它会做什么。在界面里，同样的操作在[模组](../interface/mods.md)和[市场](../interface/get_mods.md)页面完成。

## 什么是包

**包**是 lip 安装到工作区里的任何内容：模组、加载器、游戏，或是其他包所需的一组文件。本页的所有命令都要在服务器文件夹（即工作区）里运行。

lip 将已安装的包分为两类：

- **由你安装的包。** 你在 `lip setup` 或 `lip install` 中点名安装的包。在你卸载之前，lip 会一直保留它们。
- **依赖。** 因为其他包需要而由 lip 自动装上的包。当不再有包需要它们时，lip 会自动将其移除。

模组需要服务器才能运行。请先安装服务器：见[用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)。

## 指定一个包

包通过它的出处——即**来源**——来指定。来源有四种：

| 来源 | 例子 |
| --- | --- |
| git 仓库 | `github.com/LiteLDev/LegacyScriptEngine` |
| 网上的 ZIP 文件 | `https://example.com/downloads/my-mod.zip` |
| 磁盘上的 ZIP 文件 | `./my-mod.zip` |
| 磁盘上的文件夹 | `../MyMod` |

### git 仓库

大多数包都托管在 git 仓库中，且多在 GitHub 上。去掉仓库地址开头的 `https://` 即可指定：

```sh
lip install github.com/LiteLDev/LegacyScriptEngine#lua
```

地址还可以有以下三种用法：

- **简称。** 不含 `/` 的名字代表 `github.com/LiteLDev/` 下的仓库。例如 `LeviLamina` 就是 `github.com/LiteLDev/LeviLamina`。
- **变体**，写在 `#` 后面。有些包提供几种不同的版本形式，并为每种形式起了名字。例如 `LegacyScriptEngine#lua` 是 LegacyScriptEngine 的 Lua 变体。包的页面会说明它有哪些变体。
- **引用**，写在 `@` 后面，用来指定安装仓库的哪个状态：

| 引用 | 安装的是 | 例子 |
| --- | --- | --- |
| 不写 | 能在你的工作区里使用的最新正式版本 | `lip install LegacyScriptEngine#lua` |
| `@<version>` | 恰好那个版本 | `lip install LegacyScriptEngine#lua@0.13.1` |
| `@branch:<name>` | 某个分支的最新提交 | `lip install github.com/user/repo@branch:main` |
| `@tag:<name>` | 任意标签所指的提交 | `lip install github.com/user/repo@tag:nightly` |
| `@rev:<commit>` | 某一个提交，用完整的 40 位 ID 指定 | `lip install github.com/user/repo@rev:0123456789abcdef0123456789abcdef01234567` |

仓库的正式版本对应名为 `v` 加版本号的标签，例如 `v1.2.3`。指定版本时不要带 `v`。

只支持公开仓库。lip 不需要系统安装 `git`。

### 网上的 ZIP 文件

给出以 `https://` 开头的完整地址。文件必须是根目录带有 `lip.toml` 的 ZIP 压缩包：

```sh
lip install https://example.com/downloads/my-mod.zip
```

以 `http://` 或其他协议开头的地址会被拒绝。

### 磁盘上的 ZIP 文件或文件夹

给出 ZIP 文件或文件夹的路径，其根目录下必须有 `lip.toml`：

::: code-group

```powershell [Windows]
lip install .\my-mod.zip
lip install D:\downloads\my-mod.zip
lip install ..\MyMod
```

```sh [Linux / macOS]
lip install ./my-mod.zip
lip install ~/downloads/my-mod.zip
lip install ../MyMod
```

:::

要让 lip 把名字当作路径而非仓库，请以 `./` 或 `../`（Windows 上是 `.\` 或 `..\`）开头，或者使用绝对路径。URL 和路径后面同样可以跟变体，例如 `./my-mod.zip#lua`。

详细规则见[命令行](../reference/cli.md)。

## 安装

[`lip install`](../reference/commands/install.md) 接受一个或多个包：

```sh
lip install LegacyScriptEngine#lua LegacyMoney
```

lip 会找出一组彼此兼容、且与你的游戏和加载器兼容的版本，下载并连同依赖一起安装，最后输出：

```text
✓ Packages installed successfully.
```

需要注意以下几点：

- **模组需要游戏。** 在没有游戏的工作区里安装模组会失败，并提示运行 `lip setup`。
- **重复安装已由你安装的包会失败。** lip 会提示改用 `lip update`，更换版本应使用该命令。
- **依赖可以变成由你安装的包。** 直接点名安装即可。lip 会记下这是你要安装的包，即使之后没有其他包需要它，也会将它保留下来。
- **游戏和加载器保持不变。** 如果某个包所需的游戏或加载器与工作区现有的不一致，命令会失败，并提示运行 `lip setup`。例外情况：执行 `lip install LeviLamina`，或在安装时点名游戏 `github.com/LiteLDev/bds`，本身就相当于一次服务器安装。见 [`lip setup`](../reference/commands/setup.md)。

## 列出

[`lip list`](../reference/commands/list.md) 按上述两类显示已安装的包：

```sh
lip list
```

```text
User-Requested
├── github.com/LiteLDev/bds@<version>
├── github.com/LiteLDev/LeviLamina@<version>
└── github.com/LiteLDev/LegacyScriptEngine#lua@<version>
Dependencies
├── github.com/LiteLDev/LegacyRemoteCall@<version>
└── …
```

每行显示一个包名，`#` 后面是变体，`@` 后面是版本。游戏显示为 `github.com/LiteLDev/bds`。

如果供脚本调用，可以让它输出 JSON：

```sh
lip list --json
```

`lip list` 只读不写，即使其他命令正在修改工作区，或者服务器正在运行，也都能正常使用。

## 更新

不带包名的 [`lip update`](../reference/commands/update.md) 会更新所有由你安装的包：

```sh
lip update
```

如果指定包名，则只更新指定的包：

```sh
lip update LegacyScriptEngine#lua
```

“更新”的具体行为取决于包当初的安装方式：

| 安装自 | 更新后得到 |
| --- | --- |
| 仓库，没有引用 | 能在你的工作区里使用的最新正式版本 |
| 仓库 `@<version>` | 同一个版本。这个包被固定了。 |
| 仓库 `@rev:<commit>` | 同一个提交。这个包被固定了。 |
| 仓库 `@branch:<name>` | 分支现在所指的提交 |
| 仓库 `@tag:<name>` | 标签现在所指的提交 |
| URL | 重新下载的文件 |
| 磁盘上的路径 | 重新读取的文件或文件夹 |

只有当找到的内容与已安装的不一致时，lip 才会替换该包，否则保持原样。

还需注意：

- **更换或固定版本**：直接指定版本即可，例如 `lip update LegacyScriptEngine#lua@0.13.1`。这也能用来退回旧版本，之后该包就会固定在这个版本上。
- **取消固定**：指定包名但不带引用，例如 `lip update LegacyScriptEngine#lua`。包会重新跟随正式版本更新。
- **依赖只做必要的变动。** 除非由你安装的某个包有要求，否则 lip 不会主动将依赖升级到更新的版本。
- **`lip update` 从不更新游戏和加载器。** 点名更新它们会失败。请改用 [`lip setup`](../reference/commands/setup.md)。
- **来自某个路径、而该路径已不存在的包会被保留。** 运行不带包名的 `lip update` 时会给出警告，并让该包保持原样。
- **点名的包必须已经安装。** 更新后，它们会变为由你安装的包。

## 卸载

[`lip uninstall`](../reference/commands/uninstall.md) 接受已安装包的名称：

```sh
lip uninstall LegacyMoney
```

你可以按 `lip list` 显示的名称（去掉版本号）来指定包，也可以使用安装时的来源。如果不带变体，则会匹配该包所有已安装的变体。

lip 会删除该包安装的文件，并清理所有不再需要的依赖。

需要注意以下几点：

- **只能卸载由你安装的包。** 当需要某个依赖的所有包都被卸载后，该依赖会自动移除。
- **仍被别的包需要的包会留下**，并转为依赖。lip 会提示：`<name> is still required by other packages; keeping it as a dependency.`
- **你可能改过的文件会被保留**（前提是包对此作了声明）。例如，卸载游戏会保留 `server.properties`。见[更换游戏后保留什么](../reference/files.md#更换游戏后保留什么)。
- **游戏和加载器可以像其他包一样卸载。** 不过，没有游戏的工作区就无法运行服务器了。

## 试运行

所有会修改工作区的命令都支持 `--dry-run`（简写为 `-n`）：包括 `lip setup`、`lip install`、`lip update` 和 `lip uninstall`。

```sh
lip update --dry-run
```

试运行会执行正式命令在“开始改动”之前的所有步骤：读取工作区、联网查询版本、选定要安装的包，并检查文件能否正常放置。随后它会输出执行计划并直接退出：

```text
Dry run: would uninstall LegacyMoney 0.16.1 (1 file)
Dry run: would uninstall LegacyRemoteCall 0.13.0 (1 file)
Dry run: nothing was changed.
```

试运行保证：

- **什么都不改。** 不会创建、修改或删除工作区、缓存及配置中的任何文件。唯一的例外是试运行自身失败时生成的失败报告。
- **什么都不运行。** 不会运行包里的任何程序，也不会往系统里安装任何内容。
- **什么都不问。** 正式命令需要你确认的地方（例如同意 Minecraft EULA，或安装服务器前需卸载模组），试运行只会提示届时会向你询问。
- **不等待其他命令。** 试运行不会加锁，因此即使其他 lip 命令正在修改工作区，它也能同时运行。
- **仍然需要网络**，耗时可能与正式命令执行到这一步的时间相当。

试运行成功并不保证正式命令也一定成功，因为这期间网络、磁盘或工作区状态都可能发生变化；但试运行如果失败，就能说明正式命令为什么会失败。

如果此前的命令曾被中断，试运行会发出提示，并基于工作区当前的状态制定计划。见[崩溃或断电之后](troubleshooting.md#崩溃或断电之后)。

图形界面在每次执行更改前都会先做一次试运行：你在选择“应用”前看到的计划，就是试运行生成的结果。

## 命令失败或被取消时

凡是会修改工作区的命令，要么全部执行成功，要么完全不留痕迹。

- **在改动之前就失败**：能提前发现的问题都属于此类，例如包不存在、版本互不兼容、下载失败，或某个文件已被其他包占用。此时工作区原封不动。
- **中途失败**：例如某个文件无法写入。lip 会撤销已做的每一处更改，使工作区恢复到命令执行前的状态。
- **你按了 Ctrl+C。** 如果 lip 还在准备阶段，会立即退出；如果正在修改工作区，则会取消操作、撤销更改，并输出 `Cancelled. Any changes to the workspace were undone.`。再次按下 Ctrl+C 会立即强制结束 lip，未完成的清理将留给下一条命令处理。

只有一件事无法撤销：包在安装过程中运行的外部程序已经做出的更改。

命令失败后，lip 会说明原因和解决办法，并保存一份失败报告。见[故障排查](troubleshooting.md)。

## 接下来

- [lip 的工作原理](../concepts/how_lip_works.md)：一次操作在内部是如何执行的。
- [内部机制](../concepts/internals.md)：lip 如何查找并选择版本。
- [用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)：制作你自己的包。
