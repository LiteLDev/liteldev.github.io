# lip update

更新已安装的包。

## 概要

```
lip update [<PACKAGES>...] [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## 说明

`lip update` 作为一次[工作区操作](../cli.md#工作区操作)，会重新请求已安装的包，并替换其中发生变化的部分。

**不带操作数时**，会根据[状态文件](../../concepts/state_file.md)中记录的安装来源，重新请求每个显式安装的包：

| 安装时的来源 | `lip update` 安装的内容 |
| --- | --- |
| `<repo>` | 最高的版本标签。 |
| `<repo>@<version>` | 同一个版本：没有变化。 |
| `<repo>@branch:<name>` | 该分支当前指向的提交。 |
| `<repo>@tag:<name>` | 该标签当前指向的提交。 |
| `<repo>@rev:<commit>` | 同一个提交：没有变化。 |
| `https://` URL | 重新下载的 ZIP 归档。 |
| 本地 ZIP 文件或目录 | 重新读取同一路径。若路径已不存在，则保持原样。 |

**带操作数时**，`<PACKAGES>` 中的每一项都是[包参数](../cli.md#包参数)，格式与 [`lip install`](install.md) 接受的相同；此时只会按指定的来源重新请求这些包。可以通过这种方式更换包的来源：

- `lip update github.com/user/repo@2.0.0` 会将包切换到 2.0.0 版本（升级或降级均可）。
- `lip update github.com/user/repo` 会将原先指定了版本或引用的包切换回最高的版本标签。

被请求的包会被标记为显式安装。

无论哪种情况，都遵循以下规则：

- 只有当获取到的包与已安装的包在身份、版本或提交上不同时，才会进行替换。来自 URL 或本地路径的包没有提交信息，因此仅在版本变化时才会被替换。
- 替换包的过程是先卸载旧包，再安装新包。
- 仅当新包需要时，才会更新依赖包。

遇到以下情况时，命令会在做出任何更改前拒绝执行：

- 操作数指定的包尚未安装。此时请改用 [`lip install`](install.md)。
- 操作数指定了 `github.com/LiteLDev/bds` 或 `github.com/LiteLDev/LeviLamina`。提示消息会引导你使用 `lip setup`。
- 在保持游戏和加载器不变的前提下，无法完成此次更新。

`lip update` 会保持游戏和加载器不变，不带操作数时也不会重新请求它们。如需更换游戏或 LeviLamina 的版本，请运行 [`lip setup`](setup.md)。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--accept-rosetta-license` | 接受 Rosetta 2 许可协议：当搭载 Apple 芯片的 Mac 缺少 Rosetta 2 时，lip 会直接安装而不再询问。详见 [Apple 芯片的 macOS](../../guides/linux_macos.md#apple-芯片的-macos)。 |
| `-n`、`--dry-run` | [试运行](../cli.md#试运行)。在消息中列出将要安装、卸载或标记为显式安装的包，但不做任何实际更改。 |
| `-h`、`--help` | 输出帮助信息并退出。 |

## 输出

`lip update` 没有输出结果，不会向标准输出写入任何内容。进度信息和最后一行消息都会写入标准错误。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 更新已完成（包括无需任何更改的情况），或试运行已结束。 |
| 非 `0` | 用法错误或更新失败。失败的更新会被回滚。 |

## 示例

先预览更新所有包的操作，再实际执行：

```shell
lip update --dry-run
lip update
```

将一个包更新到最新版本：

```shell
lip update github.com/user/repo
```

将一个包切换到指定版本：

```shell
lip update github.com/user/repo@1.2.0
```

## 另请参阅

- [管理包](../../guides/managing_packages.md)
- [模组](../../interface/mods.md)：在界面中更新模组。
- [`lip install`](install.md)、[`lip setup`](setup.md)、[`lip list`](list.md)
