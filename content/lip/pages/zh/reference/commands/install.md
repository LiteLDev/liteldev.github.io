# lip install

向工作区安装包。

## 概要

```
lip install <PACKAGES>... [--accept-eula] [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## 说明

`lip install` 执行一次[工作区操作](../cli.md#工作区操作)，将 `<PACKAGES>` 中的每个包及其依赖一并安装到工作区。`<PACKAGES>` 中的每一项都是[包参数](../cli.md#包参数)：

| 形式 | 示例 | 安装的内容 |
| --- | --- | --- |
| `<repo>` | `github.com/user/repo` | git 仓库 `https://<repo>.git` 中版本最高的标签。 |
| `<repo>#<variant>` | `github.com/LiteLDev/LegacyScriptEngine#lua` | 该包的指定变体。以下各形式也可带 `#<variant>`，写在 `@` 之前。 |
| `<repo>@<version>` | `github.com/user/repo@1.0.0` | 标签 `v<version>` 对应的提交。 |
| `<repo>@branch:<name>` | `github.com/user/repo@branch:main` | 该分支当前指向的提交。 |
| `<repo>@tag:<name>` | `github.com/user/repo@tag:nightly` | 该标签当前指向的提交，标签名不限。 |
| `<repo>@rev:<commit>` | `github.com/user/repo@rev:0123456789abcdef0123456789abcdef01234567` | 该提交，必须写全 40 位十六进制数字。 |
| `https://` URL | `https://example.com/package.zip` | 该 URL 指向的 ZIP 归档，后面可带 `#<variant>`。 |
| 本地路径 | `./package.zip`、`../MyTool`、`C:\Downloads\package.zip` | 磁盘上的 ZIP 文件或目录，后面可带 `#<variant>`。 |

不含 `/` 的 `<repo>` 指 LiteLDev 的仓库，例如 `LeviLamina` 即 `github.com/LiteLDev/LeviLamina`。

具体行为：

- 你指定的包成为**显式安装**的包；原先作为依赖安装的包也会转为显式安装。
- 这些包的依赖作为**依赖包**安装。
- 已安装的包若当前版本仍然适用，则保持不变；否则，依赖包可能会更换版本。
- 不再被任何显式安装的包依赖的包会被卸载。

遇到以下情况时，命令会在做任何更改前直接报错退出：

- 包参数无效，或者该包不支持运行端 `server` 和平台 `win-x64`。
- 包已经是显式安装的。如需更换版本，请用 [`lip update`](update.md)。
- 两个参数指定了同一个包。
- 这些包无法同时安装，例如两个模组同名，或某个依赖找不到任何满足条件的版本。
- 操作会改变游戏或加载器（见下文）。

通过 `@branch:`、`@tag:` 或 `@rev:` 安装的包，其版本取自该提交中 `lip.toml` 的 `version` 字段。只要该版本符合要求，这类包同样能满足对同一仓库和变体的依赖。

### 游戏与加载器

**游戏**和**加载器**分别指已安装的 `github.com/LiteLDev/bds` 包和 `github.com/LiteLDev/LeviLamina` 包；详见 [`lip setup`](setup.md#术语)。

除[用 install 进行设置](#用-install-进行设置)所述情况外，`lip install` 从不安装、卸载或替换游戏和加载器。如果保持现有的游戏和加载器不变就无法完成安装（例如某个模组要求更新版本的 LeviLamina），命令会失败，并提示当前的游戏版本、加载器版本以及 `lip setup`。此时请先用 [`lip setup`](setup.md) 配置该模组支持的游戏和加载器，再安装模组。

在未安装游戏的工作区中，如果你指定的包或即将安装的依赖包是模组、服务器或 LeviLamina，`lip install` 会失败并提示使用 `lip setup`。不依赖它们的文件包则可以在没有游戏的情况下安装。

### 用 install 进行设置

参数为 `github.com/LiteLDev/bds`（无论是否带有变体或引用）时，即**指名了服务器**。参数为不带变体的 `github.com/LiteLDev/LeviLamina`，且不带引用或引用为 `@<version>` 时，即**指名了加载器**。两者均不区分大小写。

只要有参数指名了服务器或加载器，`lip install` 就会作为 [`lip setup`](setup.md) 执行，并在同一次操作中处理其余参数：

| 设置项 | 取值 |
| --- | --- |
| 构建 | 服务器写为 `github.com/LiteLDev/bds#linux` 时为 `linux`，否则为 `windows`。 |
| 加载器 | 没有参数指名 LeviLamina 时，不安装加载器。否则安装 LeviLamina：带有 `@<version>` 时取该版本；未指定版本但服务器参数给出了游戏版本时，取适配该游戏版本的最新版；未给出游戏版本时，取最新版 LeviLamina。 |
| 游戏版本 | 取服务器参数的 `@<version>`。未指定时：若有参数指名 LeviLamina，取上述 LeviLamina 支持的最新游戏版本；否则取最新游戏版本。 |

| 命令 | 设置的内容 |
| --- | --- |
| `lip install LeviLamina` | 最新版 LeviLamina，以及它支持的最新游戏。 |
| `lip install LeviLamina@1.0.0` | LeviLamina 1.0.0，以及它支持的最新游戏。 |
| `lip install github.com/LiteLDev/bds@1.21.0 LeviLamina` | 游戏 1.21.0，以及适配它的最新版 LeviLamina。 |
| `lip install github.com/LiteLDev/bds@1.21.0` | Windows 版服务器 1.21.0，不带加载器。 |
| `lip install github.com/LiteLDev/bds#linux` | 最新版 Linux 服务器，不带加载器。 |

如果有两个参数同时指名服务器，或同时指名加载器，命令会失败。[`lip setup`](setup.md) 的所有规则在此同样适用，包括许可协议询问、`--accept-eula`、被排除的包以及系统依赖。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--accept-eula` | `lip install` 作为设置执行时，直接接受[游戏的许可协议](setup.md#许可协议)，不再询问。其他情况下无效。 |
| `--accept-rosetta-license` | 接受 Rosetta 2 许可协议：搭载 Apple 芯片的 Mac 缺少 Rosetta 2 时，lip 会直接安装而不再询问。参见 [Apple 芯片的 macOS](../../guides/linux_macos.md#apple-芯片的-macos)。 |
| `-n`、`--dry-run` | [试运行](../cli.md#试运行)。在消息中列出将要安装、卸载或标记为显式安装的包，但不做任何实际更改。 |
| `-h`、`--help` | 输出帮助信息并退出。 |

## 输出

`lip install` 不产生结果数据，因此不会向标准输出写入任何内容。进度信息和最后一行提示均作为消息写入标准错误。包的钩子命令则会自行向标准输出和标准错误写入内容。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 包已安装，或试运行已完成。 |
| 非 `0` | 用法错误，或安装失败。失败的安装会自动回滚。 |

## 示例

从仓库安装模组的最新版本：

```shell
lip install github.com/LiteLDev/LegacyScriptEngine#lua
```

安装指定版本，并先预览将执行的操作：

```shell
lip install github.com/user/repo@1.0.0 --dry-run
lip install github.com/user/repo@1.0.0
```

在一次操作中安装多个包：

```shell
lip install github.com/user/repo github.com/user/other@2.1.0
```

从分支、URL、ZIP 文件和目录安装：

```shell
lip install github.com/user/repo@branch:main
lip install https://example.com/package.zip
lip install ./package.zip
lip install ../MyTool
```

在脚本中一步完成服务器设置和模组安装：

```shell
lip install LeviLamina github.com/user/repo --accept-eula
```

## 另请参阅

- [管理包](../../guides/managing_packages.md)
- [市场](../../interface/get_mods.md)：在界面中查找和安装模组。
- [`lip setup`](setup.md)、[`lip update`](update.md)、[`lip uninstall`](uninstall.md)、[`lip list`](list.md)
- [lip.toml](../../concepts/lip_toml.md)：什么是包。
