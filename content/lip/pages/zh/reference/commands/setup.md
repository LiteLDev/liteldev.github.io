# lip setup

选择工作区的游戏和加载器。

## 概要

```
lip setup --game <VERSION> [--build <BUILD>] [--loader <LOADER> | --no-loader] [--accept-eula] [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## 说明

`lip setup` 把工作区的服务器设为版本 `<VERSION>`、构建 `<BUILD>` 的游戏，带加载器 `<LOADER>` 或不带加载器，同时保留工作区中能与之配合的其他包。在空目录中运行它可以新建服务器；以后要更换游戏版本或加载器，再运行一次即可。

### 术语

- **游戏**是已安装的 `github.com/LiteLDev/bds` 包，即 Minecraft Bedrock Dedicated Server。一个工作区最多有一个。未安装此包的工作区**没有游戏**。
- 游戏的**构建**是 `windows` 或 `linux`，分别代表 Windows 版服务器和 Linux 版服务器。
- **加载器**是已安装的 `github.com/LiteLDev/LeviLamina` 包。未安装此包的工作区**没有加载器**。
- 如果某个 LeviLamina 版本对 `github.com/LiteLDev/bds` 的依赖接受某个游戏版本，就说它**适配**这个游戏版本。

### 执行过程

按顺序执行以下步骤：

1. 根据选项确定游戏、构建和加载器。参见[加载器](#加载器)。
2. 遇到下列任一情况时，命令不做任何更改，直接失败：
   - 构建为 `linux` 却要求加载器：LeviLamina 只能加载到 Windows 版服务器中；
   - 该游戏版本没有这种构建（参见[游戏版本与构建](#游戏版本与构建)）；
   - 加载器版本不存在，或者不适配该游戏版本。
3. 规划要安装的包。游戏从 `github.com/LiteLDev/bds@<VERSION>` 请求，构建为 `linux` 时从 `github.com/LiteLDev/bds#linux@<VERSION>` 请求；加载器从 `github.com/LiteLDev/LeviLamina@<version>` 请求。其他显式安装的包按各自安装时的来源重新请求。
   - 包的当前版本仍然可用时保持不变；否则可能换成其他版本。
   - 工作区原有的游戏和加载器若与所要求的不符，会被卸载。
   - 不再被任何显式安装的包依赖的包会被卸载。
4. 如果有[被排除的包](#被排除的包)，询问如何处理。
5. 如果要安装游戏，提示你接受[许可协议](#许可协议)。
6. 构建为 `windows` 时，安装 Windows 版服务器所需但系统缺少的组件：Linux 和 macOS 上的 Wine，以及 Microsoft Visual C++ 运行库（Windows 上由 lip 安装，无需管理员权限）。参见[系统依赖](../../concepts/internals.md#系统依赖)和 [Linux 和 macOS](../../guides/linux_macos.md)。
7. 作为一次[工作区操作](../cli.md#工作区操作)安装这些包。

如果工作区已有要求的游戏和加载器，且构建与版本完全相同，`lip setup` 不会对它们进行任何安装或卸载。

游戏和加载器均为显式安装，并固定在各自的版本上。此后 [`lip install`](install.md) 和 [`lip update`](update.md) 都不会改变它们；如需更换，请再次运行 `lip setup`。[`lip uninstall`](uninstall.md) 可以像卸载其他包一样卸载它们。

### 加载器

| 选项 | 加载器 |
| --- | --- |
| 既未指定 `--loader` 也未指定 `--no-loader`，且构建为 `windows` | 等同于 `--loader levilamina`。 |
| 既未指定 `--loader` 也未指定 `--no-loader`，且构建为 `linux` | 不带加载器。 |
| `--loader levilamina` | 适配该游戏版本的最新 LeviLamina。若无适配版本，命令不做任何更改，直接失败。 |
| `--loader levilamina@<version>` | 指定的 LeviLamina 版本。该版本必须适配该游戏版本。 |
| `--no-loader` | 不带加载器。 |

`levilamina` 不区分大小写。

### 游戏版本与构建

lip 从 `https://levimc.org/api/v4/mc/versions/` 获取服务器构建列表。构建号由四段数字组成，例如 `1.21.80.03`，对应两个游戏版本：

| 构建 | 游戏版本 | 含义 |
| --- | --- | --- |
| `1.21.80.03` | `1.21.80` | 该系统列表中第一个 `1.21.80.*` 构建。 |
| `1.21.80.03` | `1.21.80-patch.3` | 特指构建 `1.21.80.03`。 |

因此通常只需写 `--game 1.21.80`；需要特定构建时再写 `--game 1.21.80-patch.3`。Windows 构建和 Linux 构建是两个独立的列表，某个版本可能只存在于其中一个列表中。

服务器本体从 `www.minecraft.net` 下载。

| 构建 | 运行环境 |
| --- | --- |
| `windows` | 在 Windows 上直接运行；在 Linux 和 macOS 上通过 lip 安装的 Wine 运行。 |
| `linux` | 只能在 x64 的 Linux 上运行。`lip setup --build linux` 在任何系统上都能执行，但在其他系统上 [`lip run`](run.md) 会拒绝启动服务器。 |

::: info
界面只在 lip 运行于 x64 的 Linux 时才提供构建 `linux`。命令行没有这个限制。
:::

### 许可协议

游戏受 [Minecraft 最终用户许可协议](https://www.minecraft.net/eula)和 [Microsoft 隐私政策](https://go.microsoft.com/fwlink/?LinkId=521839)约束。

`lip setup` 需要安装游戏时，会输出这两个链接并询问你是否接受。输入 `yes` 继续；输入其他任何内容都会使命令不做任何更改，直接失败。

- 指定 `--accept-eula` 时，lip 不再询问。
- 未指定该选项，且标准输入或标准错误不是终端（例如在脚本中运行）时，命令不做任何更改，直接失败。
- 回答不会被记录。每次设置只要需要安装游戏就会重新询问；游戏保持不变则不会询问。

### 被排除的包

除游戏和加载器外，某个显式安装的包如果没有任何版本能与新的游戏和加载器配合，就会**被排除**。这类包可以是模组，也可以是其他任何包。

lip 会列出被排除的包，并询问是否将其卸载。若未回答 `yes`，命令不做任何更改，直接失败。如果标准输入或标准错误不是终端，lip 无法询问，命令会列出这些包并直接失败；此时请先用 [`lip uninstall`](uninstall.md) 卸载它们，再运行 `lip setup`。

如果剩余的包之间存在冲突、无法同时安装，命令也会失败。

lip 先询问如何处理被排除的包，再询问是否接受许可协议。这两个问题都在 lip 制定好操作计划之后、开始下载游戏之前提出。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--game <VERSION>` | 游戏版本，例如 `1.21.0`，为不带前导 `v` 的 SemVer 版本。必选。其他值均视为用法错误。 |
| `--build <BUILD>` | `windows` 或 `linux`。省略时默认为 `windows`。其他值均视为用法错误。 |
| `--loader <LOADER>` | `levilamina` 或 `levilamina@<version>`。其他值均视为用法错误。 |
| `--no-loader` | 设置不带加载器的游戏。同时指定 `--loader` 和 `--no-loader` 属于用法错误。 |
| `--accept-eula` | 接受许可协议，不再询问。 |
| `--accept-rosetta-license` | 接受 Rosetta 2 的许可协议：在 Apple 芯片的 Mac 上若缺少 Rosetta 2，lip 会直接安装而不再询问。参见 [Apple 芯片的 macOS](../../guides/linux_macos.md#apple-芯片的-macos)。 |
| `-n`、`--dry-run` | [试运行](../cli.md#试运行)。不进行提问。输出的消息会列出将要安装、卸载或标记为显式安装的包、被排除的包，以及是否需要你接受许可协议。 |
| `-h`、`--help` | 输出帮助信息并退出。 |

## 输出

`lip setup` 不产生结果数据，不会向标准输出写入任何内容。进度、提问以及最后一行总结消息均写入标准错误。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 设置已完成，或试运行已结束。 |
| 非 `0` | 用法错误，或设置失败。失败的设置会自动撤销。 |

## 示例

创建游戏版本为 1.21.0 的服务器，并安装适配该版本的最新 LeviLamina：

```shell
lip setup --game 1.21.0
```

设置指定版本的 LeviLamina，并在脚本中自动接受许可协议：

```shell
lip setup --game 1.21.0 --loader levilamina@1.0.0 --accept-eula
```

设置不带加载器的 Windows 版服务器：

```shell
lip setup --game 1.21.0 --no-loader
```

设置 Linux 版服务器（无加载器）：

```shell
lip setup --game 1.21.0 --build linux
```

预览切换到另一个游戏版本会对已安装的包产生什么影响：

```shell
lip setup --game 1.21.50 --dry-run
```

## 另请参阅

- [用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)
- [服务器](../../interface/server.md)：在界面中[安装服务器](../../interface/server.md#安装服务器)和[更改游戏或加载器的版本](../../interface/server.md#更改游戏或加载器的版本)。
- [更换游戏后保留什么](../files.md#更换游戏后保留什么)
- [`lip install`](install.md#用-install-进行设置)：安装 LeviLamina 或服务器本身时，该命令会完成服务器设置。
- [`lip run`](run.md)
