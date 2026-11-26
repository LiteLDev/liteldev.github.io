# 安装链接

本页介绍 `lip://` 链接：链接的构成、打开链接时 `lip` 的行为，以及 Windows 如何关联并由 `lip` 打开这类链接。读完后，你可以使用 [LeviMC 模组](https://levimc.org/zh-Hans/mods/)页面上的**用 lip 安装**按钮，也可以在自己的页面上放置这类链接。

规范性定义见协议的 [lip-uri(7)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-uri.md) 页面。

## 链接

```
lip://install/<module path>[?version=<version>][&variant=<variant>]
lip --uri <link>
```

例如，以下链接会安装 PLand 的 `headless` 变体的 0.26.1 版本：

```
lip://install/github.com/IceBlcokMC/PLand?version=0.26.1&variant=headless
```

| 部分 | 含义 |
| --- | --- |
| `install` | 唯一的操作，不区分大小写。 |
| `<module path>` | 包的仓库，保留大小写，例如 `github.com/LiteLDev/LegacyMoney`。不能是 URL、本地路径或简称：`lip://install/LeviLamina` 不是有效的链接。主机 `github.com` 为小写。 |
| `version` | 版本，不带前导 `v` 的 SemVer 版本，例如 `0.26.1`。省略时为最新版本。不允许指定分支、标签或提交。 |
| `variant` | 变体。省略时为默认变体。 |

百分号编码的字符（`%2F`）会被解码；`+` 仍保留为 `+`。片段（`#…`）和其他参数会被忽略。如果链接超过 2048 个字符、含有 URI 不允许的字符、使用其他操作、`version` 或 `variant` 出现两次，或者其中的模块路径、版本或变体不受 `lip install` 接受，该链接即视为无效。

链接对应 [`lip install`](commands/install.md) 的包参数 `<module path>[#<variant>][@<version>]`：上面的链接就相当于 `lip install github.com/IceBlcokMC/PLand#headless@0.26.1`。

LeviLauncher 读取格式相同的 `levilauncher://` 链接；对于在客户端运行的模组，LeviMC 模组页面会显示**用 LeviLauncher 安装**按钮。

## 打开链接

链接只会打开界面。在你确认之前，它不会安装任何内容，也不会替你决定安装位置——一切由你决定。

`lip --uri <link>` 会打开[界面](interface.md)，但与直接运行 `lip` 有以下不同：

1. 如果链接无效，或者标准输入或标准输出不是终端，`lip` 会将错误信息写入标准错误并以非零代码退出。在 Windows 上，如果控制台仅由它独占，它会先等待你按任意键，以便你看清消息。
2. 启动 `lip` 时所在的文件夹不会加入工作区列表。默认选中列表中的最后一个工作区；若列表为空，则不选中任何工作区。
3. 在进行任何其他操作之前，会先弹出**从链接安装**对话框询问是否安装该包。对话框会显示包、[LeviMC 模组目录](../interface/get_mods.md)中关于它的信息（**名称**、**作者**、**版本**、**变体**、**依赖**），以及将要**安装到**的工作区（可在该处切换工作区）。
4. 如果模组目录未收录该模组或无法读取，对话框会发出警告，并默认高亮“什么都不安装”的选项。如果目录中没有链接指定的版本，同样会发出警告。不过你依然可以像使用 `lip install` 一样继续安装该包。
5. **安装…**会在当前工作区对该包执行 `lip install`：与界面中的其他操作一样，你可以先查看计划，再选择**应用**或**取消**（见[先预览再应用](../interface/tour.md#先预览再应用)）。如果工作区还没有游戏，界面会改为提议为其配置服务器。如果未选中工作区，可通过**选择文件夹…**选择一个。
6. 如果你拒绝，则不会安装任何内容，界面继续运行。

`--uri` 只有在命令行恰好有两个参数且自身作为第一个参数时，才会视为选项。`lip --uri` 的退出方式与界面相同；若触发第 1 步的情况，则以非零代码退出。

## 在 Windows 上注册

`lip` 的 Windows Installer 安装包（`.msi`，见[安装 lip](../install.md)）在安装 `lip` 时会一并注册 `lip` 协议。根据安装 `lip` 时所选的范围（仅当前用户或所有用户），它会在 `HKEY_CURRENT_USER` 或 `HKEY_LOCAL_MACHINE` 的 `Software\Classes\lip` 下写入以下注册表项：

| 键 | 值 | 数据 |
| --- | --- | --- |
| `Software\Classes\lip` | （默认） | `URL:lip` |
| `Software\Classes\lip` | `URL Protocol` | 空字符串 |
| `Software\Classes\lip\DefaultIcon` | （默认） | `"<directory>lip.exe",0` |
| `Software\Classes\lip\shell\open\command` | （默认） | `"<directory>lip.exe" --uri "%1"` |

`<directory>` 是末尾带路径分隔符的安装目录。当你打开链接时，Windows 会在独立的控制台中启动 `lip`。卸载 `lip` 时会删除这些注册表项。

用于在 Linux 和 macOS 上安装 `lip` 的 `install.sh` 不会注册任何协议：在这些系统上，请在终端中运行 `lip --uri '<link>'`，或直接带包参数运行 `lip install`。

## 什么都没有发生时

如果点击**用 lip 安装**按钮后浏览器毫无反应，说明尚未安装 `lip`、不是通过 `.msi` 安装的，或者安装的旧版本不支持链接。请使用 `.msi` [安装 lip](../install.md)，或复制模组页面上显示的 `lip install` 命令，在服务器文件夹中运行。

## 另请参阅

- [界面](interface.md)
- [命令行](cli.md)
- [lip install](commands/install.md)
- [市场](../interface/get_mods.md)
