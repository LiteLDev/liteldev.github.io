# 界面

本页是 lip 交互界面的简明参考，涵盖按键、各个页面及其对应的命令，以及所有页面通用的规则。如需循序渐进地了解界面，请从[界面导览](../interface/tour.md)开始。

规范性定义见协议的 [lip-tui(1)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-tui.md) 页。

## 启动

```shell
lip
```

标准输入和标准输出都是终端时，不带参数的 `lip` 会打开界面；否则输出帮助（见[命令行](cli.md)）。

- 界面同一时间只操作一个工作区，即**当前工作区**，初始为启动 `lip` 时所在的文件夹。从[安装链接](links.md)打开时（`lip --uri`），它不会添加文件夹，而是选中列表中的最后一个工作区，然后询问是否安装链接中的包。顶部一行显示当前工作区；选中后按 `Enter` 会打开[工作区选择器](../interface/workspaces.md)，用于切换、添加或移除工作区。
- 界面由 lip 的[守护进程](../concepts/how_lip_works.md)运行，支持同时打开多个界面。
- 终端至少要有 60 列、16 行。如果终端太小，lip 会提示你放大终端；此时唯一可用的按键是 `Ctrl+C`，按后会直接退出，不作询问。
- 终端不足 80 列且焦点在页面上时，侧边栏中的每个页面只显示为一个符号。

## 按键

同一按键在各个页面上的作用相同。屏幕最底部一行会列出当前焦点位置可用的按键。

| 按键 | 作用 |
| --- | --- |
| `↑` `↓` | 在列表或菜单中移动。在侧边栏中切换到上一个或下一个页面；在第一个页面上按 `↑` 或在最后一个页面上按 `↓`，焦点会移到顶部一行的工作区。 |
| `←` `→` | 在侧边栏与页面之间、并排的窗格或按钮之间移动；更改有多个取值的选项。 |
| `Enter` | 打开或执行选中的内容。在列表某一行上时，打开该行的操作。 |
| `Space` | 在支持多选的地方勾选一行；开启或关闭某个选项。 |
| `Tab`、`Shift+Tab` | 切换到下一个或上一个区域，在侧边栏和页面的各个区域之间循环。 |
| `Esc` | 返回上一层：从对话框回到页面，从页面的内层区域回到前一个区域，从页面回到侧边栏。在侧边栏中按此键会询问是否退出。 |
| `PgUp` `PgDn` `Home` `End` | 在列表或文本中翻页。在侧边栏中，`Home` 和 `End` 分别跳到第一个和最后一个页面。 |
| `Ctrl+C` | 在“服务器”页且服务器正在运行时，停止服务器；正在执行更改时，取消更改；其他情况下询问是否退出。 |
| 字母和数字 | 焦点在输入框中时用于输入。在其他地方不起作用（界面没有字母快捷键）。 |

## 页面

| 页面 | 作用 | 命令 |
| --- | --- | --- |
| [主页](../interface/home.md) | 显示当前工作区的状态和下一步建议的操作。 | |
| [服务器](../interface/server.md) | [安装服务器](../interface/server.md#安装服务器)，[更改游戏或加载器的版本](../interface/server.md#更改游戏或加载器的版本)；启动和停止服务器，显示服务器输出，并向其发送你输入的内容。 | [`lip setup`](commands/setup.md)、[`lip run --managed --detach`](commands/run.md)、[`lip config set restart … --workspace`](commands/config.md) |
| [模组](../interface/mods.md) | 列出已安装的模组及其依赖包（不含游戏和加载器）；安装、更新和卸载它们。 | [`lip list`](commands/list.md)、[`lip install`](commands/install.md)、[`lip update`](commands/update.md)、[`lip uninstall`](commands/uninstall.md) |
| [市场](../interface/get_mods.md) | 搜索 levimc.org 上的模组，并安装指定版本。 | [`lip install`](commands/install.md) |
| [游戏配置](../interface/game_config.md) | 编辑 `server.properties`、`allowlist.json` 和 `permissions.json`。 | 无 |
| [模组配置](../interface/mod_config.md) | 编辑已安装模组的配置文件。 | 无 |
| [开发工具](../interface/tools.md) | 在带内容校验的表单中创建和编辑 `lip.toml`；迁移 `tooth.json`。 | [`lip pkg migrate`](commands/pkg_migrate.md)；表单除涵盖 [`lip pkg init`](commands/pkg_init.md) 的功能外，还支持更多操作 |
| [设置](../interface/settings.md) | 语言、GitHub 代理、自动重启、缓存、lip 更新、守护进程、版本。 | [`lip config`](commands/config.md)、[`lip cache clean`](commands/cache_clean.md)、[`lip self-update`](commands/self_update.md)、[`lip daemon status`](commands/daemon.md)、`lip --version` |

界面执行的命令以当前工作区为工作目录，其行为遵循对应命令文档的定义，但有以下不同：

- 命令的输出显示在界面中，且为英文。
- 命令需要确认的内容通过对话框询问。
- 命令失败时，界面会显示原因，随后继续运行。

## 预览与应用

对工作区中的包所做的每项更改（安装、更新、卸载，以及安装游戏或加载器）都遵循同一流程：

| 步骤 | 发生什么 |
| --- | --- |
| 1. 预览 | lip 以[试运行](cli.md)方式执行命令，显示即将执行的操作。此时尚未作任何更改。 |
| 2. **应用**或**取消** | 选择**应用**继续；选择**取消**则不作任何更改。如果预览发现没有可更改的内容，则只显示**关闭**按钮。 |
| 3. 许可协议 | 仅当本次更改需要安装游戏时出现：lip 显示《Minecraft 最终用户许可协议》和《Microsoft 隐私政策》。选择**接受**继续；选择**拒绝**则不作任何更改。 |
| 4. 进度 | 按 `Esc` 或 `Ctrl+C` 可取消操作；已完成的部分会被撤销，并弹出标题为**已取消**的对话框加以说明。这不算作失败。 |
| 5. 结果 | 显示命令的输出，以及 **✓ 完成。** |

- 应用时不会从头再来，而是直接使用预览阶段已读取和下载的内容。
- 如果安装服务器的预览指出某些已安装的模组没有适配新游戏或新加载器的版本，选择**应用**就会卸载这些模组。
- 失败时会显示原因、lip 给出的提示（如有），以及失败报告的路径（位于工作区的 `.lip/logs` 下）。

## 服务器运行期间

只要 lip 正在运行某个工作区的服务器——无论是由界面、`lip run --managed`，还是终端里普通的 `lip run` 启动——该服务器就处于运行状态。在此期间，界面对该工作区的行为如下：

| 内容 | 服务器运行期间 |
| --- | --- |
| 安装、更新和卸载包（[模组](../interface/mods.md)、[市场](../interface/get_mods.md)） | 不可用。 |
| 安装服务器（[服务器](../interface/server.md#安装服务器)）、更改其游戏或加载器（[服务器](../interface/server.md#更改游戏或加载器的版本)） | 不可用。 |
| `server.properties`、`allowlist.json`、`permissions.json`（[游戏配置](../interface/game_config.md)） | 仅可查看，不能修改或保存。未保存的更改会保留到服务器停止。 |
| 模组的配置文件（[模组配置](../interface/mod_config.md)） | 照常修改和保存。页面会提示更改可能需要重启才能生效。 |
| 其他所有功能：浏览模组、切换工作区、[开发工具](../interface/tools.md)、[设置](../interface/settings.md) | 照常。 |

不可用的项目仍会显示在屏幕上，但呈灰色，并注明原因：**请先停止服务器。**

以上限制仅针对界面。在服务器运行期间，命令 `lip install`、`lip update`、`lip uninstall` 和 `lip setup` 不会被拒绝，详见[界面与命令](../concepts/how_lip_works.md#界面与命令)。

退出界面不会停止由守护进程运行的服务器。但如果 lip 因无法使用守护进程而自行运行界面，退出时则会停止由该界面启动的服务器。

## 配置文件

| 文件 | 读取 | 写入 |
| --- | --- | --- |
| `server.properties` | 显示“游戏配置”页时。 | **保存**时：只写入修改过的属性值，不改动其他任何字符。文件不存在时不会创建。 |
| `allowlist.json`、`permissions.json` | 同上。不存在的文件视为空列表。 | **保存**时：写入整个文件，不含注释。文件不存在时会创建。 |
| 模组的 `.json` 文件 | 在“模组配置”页选中该文件时。 | **保存**时：写入整个文件，不含注释，各个键名保持原位。文件已不存在时不会创建。 |
| 模组的其他文件 | 同上。 | 从不写入。 |

- lip 无法解析的文件仅作显示，从不写入。
- 如果文件在 lip 读取后又在磁盘上被改动过，则只有经你确认后才会覆盖。
- 带着未保存的更改离开页面时，会询问是否保存。
- 保存的更改在服务器下次启动时生效。

模组的文件是指 `mods/<mod>/config/` 中的文件；如果该目录下没有任何文件，则指直接放在 `mods/<mod>/` 下的 `.json`、`.ini`、`.toml`、`.yml`、`.yaml` 文件（`manifest.json` 除外），以及 `mods/<mod>/data/config.json`。

## 语言

| `language` 的值 | 界面 |
| --- | --- |
| `en` | 英文 |
| `zh-Hans` | 简体中文 |
| `zh-Hant` | 繁体中文 |
| 未设置 | 系统语言：英文，或由区域设置决定的中文。 |

语言可在[设置](../interface/settings.md#语言)页选择，或通过 [`lip config`](commands/config.md) 设置（见[配置](configuration.md)）。更改立即生效。无论使用何种语言，命令输出的内容均为英文。

## GitHub 检查

界面启动时，如果未设置 `github_proxy`，lip 会在后台检查一次能否连上 GitHub，最多等待 10 秒。连不上时，界面会询问连接方式：

| 回答 | 作用 |
| --- | --- |
| 使用代理 | 询问代理网址并进行测试，随后将 `github_proxy` 设为该网址。 |
| 直接连接 | 将 `github_proxy` 设为空值：lip 不再检查，也不再询问。 |
| 以后再说 | 不作任何更改；下次界面启动时 lip 会再次检查。 |

见[设置](../interface/settings.md#github-代理)。

## 退出状态

无论在界面中执行的命令结果如何，也无论服务器以什么代码退出，退出界面时 `lip` 都以代码 0 退出。

## 文件

| 文件 | 界面 |
| --- | --- |
| 状态目录里的 `workspaces.json` | 读写工作区列表。 |
| 配置目录里的 `config.toml` | 读取 `language` 和 `github_proxy`；在“设置”页和 GitHub 检查时写入。 |
| 工作区里的 `.lip/config.toml` | 读写 `restart`（自动重启）。 |
| 工作区里的 `server.properties`、`allowlist.json`、`permissions.json` | 读取；**保存**时写入。 |
| `mods/` 下模组的配置文件 | 读取；**保存**时写入其中的 `.json` 文件。 |
| 工作区里的 `lip.toml` | 在“开发工具”页读取；保存表单并确认后写入。 |
| 工作区里的 `.lip/logs/` | 命令失败时写入失败报告。 |
| `https://levimc.org/api/v4/mods/` | 读取模组目录，供“市场”页和 `lip.toml` 表单中的依赖项使用。内容不写入磁盘，也不经过 `github_proxy`。 |

界面执行的命令会读写各自页面所说明的文件。lip 的所有文件和目录见[文件](files.md)。

## 另请参阅

- [界面导览](../interface/tour.md)
- [开你的第一个服务器](https://levimc.org/zh-Hans/tutorials/server/first-server/)
- [命令行](cli.md)
- [安装链接](links.md)
- [配置](configuration.md)
