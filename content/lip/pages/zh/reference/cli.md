# 命令行

本页说明如何调用 `lip`：有哪些命令、参数如何解析、输出写到哪里、退出状态代表什么，以及试运行和 Ctrl+C 的行为。每个命令都有单独的页面，这里介绍它们共有的规则。

## 概要

```
lip
lip (-h | --help)
lip (-v | --version)
lip --uri <link>
lip (cache | config | daemon | pkg) (-h | --help)
lip <command> [<argument>...]
```

在概要中，`word` 原样输入，`<name>` 替换为具体的值，`[x]` 可以省略，`x | y` 表示二选一，`(x | y)` 将备选项括为一组，`x...` 表示 `x` 出现一次或多次。

| 调用方式 | lip 的行为 |
| --- | --- |
| `lip` | 标准输入和标准输出都是终端时，运行[界面](interface.md)；否则将 `lip` 的帮助写到标准输出。 |
| `lip -h`、`lip --help` | 将 `lip` 的帮助写到标准输出，无论后面跟什么参数。 |
| `lip -v`、`lip --version` | 将自身的版本号（[SemVer](https://semver.org/spec/v2.0.0.html) 格式）加一个换行写到标准输出，无论后面跟什么参数。 |
| `lip --uri <link>` | 打开一个 `lip://` [安装链接](links.md)，在界面中询问是否安装其中的包。仅当总共恰好有两个参数且它位于第一位时，才视为选项。 |
| `lip cache -h`、`lip config -h`、`lip daemon -h`、`lip pkg -h` | 将该命令组的帮助写到标准输出。`--help` 相同。 |
| `lip --daemon` | 作为[守护进程](commands/daemon.md)运行直至退出，不输出任何内容。此命令由 lip 自行启动，无需手动运行。 |
| `lip <command> ...` | 执行该命令。 |

输出帮助或版本时，退出码为 0。`lip --uri` 的退出方式与[界面](interface.md#退出状态)相同；若链接无效或没有终端，则以非零退出码退出。如果第一个参数以 `-` 开头但不属于上述情况，则为[用法错误](#用法错误)。

## 命令

用于运行服务器的命令：

| 命令 | 作用 |
| --- | --- |
| [`lip setup`](commands/setup.md) | 选择工作区的游戏和加载器。 |
| [`lip install`](commands/install.md) | 向工作区安装包。 |
| [`lip uninstall`](commands/uninstall.md) | 从工作区卸载包。 |
| [`lip update`](commands/update.md) | 更新已安装的包。 |
| [`lip list`](commands/list.md) | 列出已安装的包。 |
| [`lip run`](commands/run.md) | 运行工作区的服务器。 |
| [`lip cache clean`](commands/cache_clean.md) | 删除缓存。 |
| [`lip config get`、`set`、`list`、`delete`](commands/config.md) | 读写配置。 |

用于守护进程的命令：

| 命令 | 作用 |
| --- | --- |
| [`lip daemon status`](commands/daemon.md) | 显示守护进程是否在运行。 |
| [`lip daemon stop`](commands/daemon.md) | 停止守护进程。 |

用于开发包的命令：

| 命令 | 作用 |
| --- | --- |
| [`lip pkg init`](commands/pkg_init.md) | 为新包创建 `lip.toml`。 |
| [`lip pkg migrate`](commands/pkg_migrate.md) | 将当前目录中的 `tooth.json` 迁移为 `lip.toml`。 |

用于 lip 自身的命令：

| 命令 | 作用 |
| --- | --- |
| [`lip self-update`](commands/self_update.md) | 将 lip 更新到最新发布的版本。 |

`cache`、`config`、`daemon` 和 `pkg` 是**命令组**，即双词命令名的第一个词。

## 参数

命令名、命令组名和选项名均区分大小写。

- 第一个参数是单词命令名或命令组。命令组后面必须紧跟 `-h`、`--help` 或组内某个命令的第二个词；不跟任何内容或跟其他内容均为用法错误。
- `--` 在 lip 中不是分隔符；任何参数为 `--` 均属用法错误。
- 在命令名之后，选项和操作数可以按任意顺序排列。操作数按给出的顺序赋值。

在命令的参数中，以 `-` 开头的都是选项：

| 形式 | 含义 |
| --- | --- |
| `--<name>` | 长选项 `<name>`。 |
| `-<c>` | 短选项 `<c>`，单个字符。 |
| `--<name>=<value>` | 长选项 `<name>`，值为 `<value>`。 |
| `-<c>=<value>` | 短选项 `<c>`，值为 `<value>`。 |

- 需要值的选项如果不用 `=` 指定，则将下一个参数作为其值。该参数不能以 `-` 开头。
- 选项的值不能为空。
- **开关**是不带值的选项。同一个开关重复多次，效果与写一次相同。
- 需要值的选项重复多次时，以最后一次的值为准。
- 短选项不能合并（`-nh` 的行为未定义），也不能给开关赋值（如 `--json=true` 的行为未定义）。请勿使用这些写法。

其余参数均为**操作数**。

## 用法错误

命令的参数出现以下情况时属于用法错误：

1. 使用了不属于该命令的选项；
2. 需要值的选项未提供值；
3. 缺少概要中要求的操作数或选项；或者
4. 操作数多于命令接受的数量。

遇到用法错误时，lip 会向标准错误输出一条消息，并以非零退出码退出，不执行任何其他操作，也不生成[失败报告](files.md#失败报告)。

## 所有命令共有的选项

| 选项 | 说明 |
| --- | --- |
| `-h`、`--help` | 将该命令的帮助写到标准输出，并以退出码 0 退出，不执行任何其他操作。 |

`-h` 优先于缺失的操作数和未知的选项：`lip install -h` 和 `lip install -h --bogus` 都会输出帮助。但它不优先于缺失的选项值和多余的操作数，这两种情况仍为用法错误。

## 工作目录

每个命令的**工作区**即当前工作目录，参数中的相对路径均相对于该目录解析。没有用于指定其他工作区的选项，如需操作其他目录，请先切换目录。

## 输出

- **结果**是命令按要求返回的数据，写到标准输出。只有 `list`、`config get`、`config list`、`daemon status` 和 `self-update --check` 会产生结果。
- **消息**是除此之外的所有输出，包括进度、信息、警告、错误和最终的成功提示。消息写到标准错误，其措辞可能随版本变化，请勿解析。
- 帮助信息写到标准输出。

因此，`lip list > packages.txt` 只会保存包列表，而 `2> /dev/null` 只会隐藏消息。消息始终为英文。

### JSON

下列命令接受 `--json` 选项。启用后，标准输出仅包含 JSON 格式的结果，末尾带一个换行：

| 命令 | JSON 结果 |
| --- | --- |
| [`lip list --json`](commands/list.md#输出) | `{ "ExplicitInstalled": [...], "ImplicitInstalled": [...] }` |
| [`lip config get <KEY> --json`](commands/config.md#输出) | 作为 JSON 字符串的配置值，或 `null`。 |
| [`lip config list --json`](commands/config.md#输出) | 将每个键映射到其值或 `null` 的对象。 |
| [`lip daemon status --json`](commands/daemon.md#输出) | `{ "running": false }`，或 `{ "running": true, "version": "...", "pid": ... }`。 |

不带 `--json` 时，结果的排版供人工阅读，格式可能会变动。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 命令成功。 |
| 非 `0` | 命令失败（包括用法错误）。标准错误上的消息会说明原因。 |

[`lip run`](commands/run.md#退出状态) 是例外：一旦启动了服务器，它就会以服务器的退出码退出。

若命令因用法错误以外的原因失败，可能会在工作区的 `.lip/logs/` 下生成一份**失败报告**文件，并在消息中给出其路径。详见[失败报告](files.md#失败报告)。

## 包参数

`install` 和 `update` 接受**包参数**。lip 对每个包参数按以下规则依序匹配，以第一条适用的规则为准：

1. **URL。** 以 `https://` 开头的参数视为 ZIP 归档的 URL。其他带 `://` 的协议（如 `http://`、`file://`）均无效。
2. **本地路径。** 取参数中最后一个 `#` 之前的部分；若整个参数本身就是一个存在的文件或目录，则取整个参数。满足以下任一条件时，视为本地路径：
   - 该部分以 `./`、`../`、`.\` 或 `..\` 开头；
   - 该部分是 `.` 或 `..`；
   - 该部分是绝对路径；或者
   - 该部分以 `.zip` 结尾（不区分大小写）或是一个存在的文件或目录，且整个参数不含 `@`。

   不存在的本地路径无效。
3. **远程仓库。** 其余参数均按 `<repo>[#<variant>][@<ref>]` 解析。不含 `/` 的 `<repo>` 指代 LiteLDev 的仓库，例如 `LeviLamina@1.9.7` 即 `github.com/LiteLDev/LeviLamina@1.9.7`。

URL 和本地路径末尾可附加 `#<variant>`。远程仓库的引用形式如下：

| 引用 | 选中 |
| --- | --- |
| 无 | 仓库的版本标签（`v<version>`），按版本号从高到低匹配。 |
| `@<version>` | 标签 `v<version>` 指向的提交。 |
| `@branch:<name>` | 该分支指向的提交。 |
| `@tag:<name>` | 该标签指向的提交。 |
| `@rev:<commit>` | 该 ID 对应的提交（完整的 40 位十六进制数）。 |

若包参数无效，命令会在做出任何更改前直接失败。每种形式的示例见 [`lip install`](commands/install.md)。

## 环境

无论运行在什么系统上，lip 只针对一种**环境**安装包：运行端为 `server`、平台为 `win-x64`。如果工作区的[状态文件](../concepts/state_file.md)记录了其他运行端，或记录了 `win-x64` 与 `linux-x64` 以外的平台，`setup`、`install`、`uninstall`、`update` 和 `run` 都会失败。记录为 `linux-x64` 的状态文件会[按 `win-x64` 读取](../concepts/state_file.md#linux-x64-的工作区)。

## 工作区操作

不带 `--dry-run` 的 `setup`、`install`、`uninstall` 和 `update` 各执行一次**工作区操作**：对工作区的更改要么全部完成，要么完全不做。

- 操作会获取工作区锁 `.lip/lock`。如果该锁已被其他进程持有，命令会立即失败，不做任何更改。
- 如果先前的操作中途被打断，下一次操作会先将其完成或回滚。
- 如果在开始修改工作区之前失败，不会留下任何更改；在开始修改之后失败，已做的更改会被撤销，但已经运行过的钩子命令不会撤回。

完整说明见 [lip 的工作方式](../concepts/how_lip_works.md)。

## 试运行

`setup`、`install`、`uninstall` 和 `update` 接受 `-n` 或 `--dry-run`。试运行会执行所有不产生实际改动的步骤，并通过消息说明该操作会对哪些包做什么。试运行：

- 不获取工作区锁，因此即使另一个命令正在修改工作区也能运行；
- 不恢复被中断的操作：如果存在 `.lip/journal`，它会提示这一点，并按工作区当前的状态进行规划；
- 不运行任何钩子命令；
- 不提问；
- 不创建、替换或删除任何文件和目录，唯一的例外是失败时可能会写入一份失败报告。

试运行仍会通过网络解析包，但不会向缓存写入任何内容。

## Ctrl+C

Ctrl+C 的作用取决于 lip 正在做什么：

| lip 正在 | 第一次 Ctrl+C | 第二次 Ctrl+C |
| --- | --- | --- |
| 规划操作，工作区尚未更改 | 立即结束 lip，不做任何更改。 | |
| 更改工作区 | 取消操作并撤销已做的更改。 | 立即结束 lip。下次操作该工作区时会进行恢复。 |
| 用 `lip run` 运行服务器 | 向服务器发送 `stop`，待服务器退出后 lip 才退出。 | 无额外作用：lip 不会先于服务器退出。 |
| 连接着托管服务器（`lip run --managed`） | 向服务器发送 `stop`，并保持连接直到服务器退出。 | 相同。 |

其他信号参见 [`lip run`](commands/run.md#停止)。

## 守护进程

除 `daemon` 组的命令外，所有命令和界面都由**守护进程**执行。守护进程是属于当前用户的后台 `lip` 进程，由你运行的第一条命令启动。使用上没有任何区别：命令依然使用你的工作目录、环境变量、终端和 Ctrl+C，`lip` 也会以该命令的退出码退出。

如果 lip 无法启动或连接守护进程，它会输出一条消息，然后直接自行执行命令。只有 `lip run --managed` 必须依赖守护进程。参见 [`lip daemon`](commands/daemon.md)。

## 另请参阅

- [界面参考](interface.md)：界面各页面所对应的命令。
- [配置](configuration.md)和[文件](files.md)。
- [用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)和[管理包](../guides/managing_packages.md)。
