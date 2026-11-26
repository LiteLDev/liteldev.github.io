# lip uninstall

从工作区卸载包。

## 概要

```
lip uninstall <PACKAGES>... [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## 说明

`lip uninstall` 卸载 `<PACKAGES>` 指定的已安装包，这是一次[工作区操作](../cli.md#工作区操作)。

`<PACKAGES>` 中的每一项按以下规则匹配已安装的包，采用第一条匹配成功的规则：

1. **按身份。** 操作数与 [`lip list`](list.md) 显示的身份（不含版本）相同，例如 `github.com/LiteLDev/LegacyScriptEngine#lua`。
2. **按来源。** 将操作数作为[包参数](../cli.md#包参数)解析后，与该包安装时的来源相同，例如 `github.com/user/repo@branch:main` 或 `./package.zip`。仓库名不区分大小写。不带变体的操作数匹配所有变体，不带引用的操作数匹配所有引用。

和 `lip install` 一样，不含 `/` 的名称（如 `LeviLamina`）表示 LiteLDev 的仓库。

执行过程如下：

- 指定的包不再标记为显式安装。
- 其余显式安装的包不再需要的包都会被卸载：运行其 `pre_uninstall` 钩子，删除其拥有的文件（`preserve` 保留的除外），删除 `purge` 指定的路径，再运行其 `post_uninstall` 钩子。
- 如果指定的包仍被其他显式安装的包需要，则会作为依赖包保留下来。

遇到以下情况时，命令会在做任何更改前直接拒绝执行：

- 操作数未匹配到任何已安装的包。
- 指定的包不是显式安装的。此时请改为卸载依赖它的那个包。

游戏和加载器的卸载方式与其他包相同。卸载游戏后，工作区中将不再有游戏：在安装模组或运行服务器前，请用 [`lip setup`](setup.md) 重新设置。卸载游戏会保留 `server.properties`、`allowlist.json` 和 `permissions.json`；详见[服务器文件](../files.md#服务器文件)。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--accept-rosetta-license` | 接受 Rosetta 2 许可协议：搭载 Apple 芯片的 Mac 缺少 Rosetta 2 时，lip 会直接安装而不再询问。详见 [Apple 芯片的 macOS](../../guides/linux_macos.md#apple-芯片的-macos)。 |
| `-n`、`--dry-run` | [试运行](../cli.md#试运行)。消息会列出将要卸载或取消显式安装标记的包，但不做任何更改。 |
| `-h`、`--help` | 输出帮助信息并退出。 |

## 输出

`lip uninstall` 没有输出结果，不会向标准输出写入任何内容。进度信息和最后一行提示均作为消息写入标准错误。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 包已卸载，或试运行已完成。 |
| 非 `0` | 用法错误，或命令执行失败。失败的操作会回滚。 |

## 示例

按身份卸载一个包：

```shell
lip uninstall github.com/LiteLDev/LegacyScriptEngine#lua
```

查看卸载两个包会移除哪些内容：

```shell
lip uninstall github.com/user/repo github.com/user/other --dry-run
```

卸载从本地 ZIP 文件安装的包：

```shell
lip uninstall ./package.zip
```

## 另请参阅

- [管理包](../../guides/managing_packages.md)
- [模组](../../interface/mods.md)：在界面中卸载模组。
- [`lip list`](list.md)、[`lip install`](install.md)、[`lip setup`](setup.md)
