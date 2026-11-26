# 文件

本页列出 lip 读写的全部文件和目录，说明哪些可以删除、备份或编辑，以及这样做会丢失什么。

lip 只向三个地方写入：它操作的工作区、它的用户级目录，以及更新自身时的安装目录。它从不向系统临时目录写入。它启动的程序（服务器、钩子命令、安装程序和 Wine）写到哪里则不受此限。

## 工作区

**工作区**是服务器所在的目录，也就是命令行的当前目录，或界面中选定的当前工作区。

| 路径 | 是什么 | 由谁写入 |
| --- | --- | --- |
| `.lip/` | lip 为该工作区保存的记录。参见 [.lip 目录](#lip-目录)。 | lip |
| `mods/` | LeviLamina 加载模组的目录。每个模组位于 `mods/<模组名>/`。 | lip 和模组自身 |
| `bedrock_server_mod.exe`、`bedrock_server.exe`、`bedrock_server` | [`lip run`](commands/run.md) 启动的服务器程序。参见[服务器文件](#服务器文件)。 | lip |
| 其余所有文件 | 游戏和文件包的文件，以及服务器运行时生成的内容（例如 `worlds/`）。 | lip 和服务器 |
| `lip.toml`、`tooth.json` | 在你开发的包目录中：包的[包文件](../concepts/lip_toml.md)，以及 lip v0.x 的包文件。 | [`lip pkg init`](commands/pkg_init.md)、[`lip pkg migrate`](commands/pkg_migrate.md)（会删除 `tooth.json`），以及[开发工具](../interface/tools.md)页 |
| `tooth_lock.json` | lip v0.x 工作区的状态。参见[状态文件](../concepts/state_file.md#lip-v0-x-的工作区)。 | lip v0.x |

在修改工作区之前，lip 会先创建 `mods/`。`mods` 必须是真正的目录；如果它是链接，操作会失败。

工作区不依赖外部的任何内容。只要没有 lip 命令或服务器正在使用它，你就可以随意移动、重命名或复制该目录，已安装的包都会完好保留。

### .lip 目录

在 Windows 上，`.lip` 带有隐藏属性。

| 条目 | 是什么 | 删除的后果 |
| --- | --- | --- |
| `state.json` | [状态文件](../concepts/state_file.md)：记录已安装的包，以及每个包拥有的文件。 | lip 不再知道安装了什么。文件仍在，但 lip 无法卸载或更新它们。请勿删除。 |
| `state.json.tmp` | 正在写入的状态文件。 | 命令运行期间请勿触碰。 |
| `journal` | 进行中的操作记录，lip 靠它完成或回滚中断的操作。仅在操作进行期间或中断后存在。 | lip 无法再回滚中断的操作。请勿删除；运行 `install`、`uninstall`、`update`、`setup` 或 `run` 即可恢复。 |
| `lock` | **工作区锁**文件。进程在执行操作期间持有该锁，防止两个操作同时修改工作区。文件内容没有意义。 | 没有命令运行时删除无妨。有命令运行时，切勿删除、重命名或替换它。 |
| `server.lock` | **服务器锁**文件。运行服务器的进程持有该锁，确保同一工作区最多只有一个服务器在运行。 | 没有服务器运行时删除无妨。有服务器运行时，切勿删除、重命名或替换它。 |
| `config.toml` | [工作区配置](configuration.md#工作区配置)。 | `restart` 恢复为 `never`。 |
| `logs/` | [失败报告](#失败报告)。 | 丢失这些报告。随时可以删除。 |
| `wine/` | 在 Linux 和 macOS 上：运行 Windows 版服务器和钩子命令所用的 Wine 前缀。 | Wine 会重新创建它。删除前请先停止服务器。 |

lip 可能在 `.lip` 中保存其他条目，请勿依赖它们。

`.lip` 是保留目录：包不能向其中安装文件，`purge` 的 glob 也永远不会匹配它。

两把锁互相独立。操作不会获取服务器锁，服务器运行期间也不会持有工作区锁，因此 `lip run` 运行时仍可执行 `lip install`。界面的限制更严格，会要求你先停止服务器。

### 服务器文件

游戏本身就是 `github.com/LiteLDev/bds` 包。安装该包时，lip 会将从 `www.minecraft.net` 下载的 Bedrock Dedicated Server 归档原样解压到工作区根目录。

| 工作区状态 | 服务器文件 |
| --- | --- |
| 装有加载器（LeviLamina） | `bedrock_server_mod.exe` |
| 无加载器，构建为 `windows` | `bedrock_server.exe` |
| 无加载器，构建为 `linux` | `bedrock_server` |

在 Linux 和 macOS 上，lip 写入 `bedrock_server` 时会将其权限设为 `0755`。

安装、替换或卸载游戏时，以下两个列表决定了游戏文件的处理方式：

| 列表 | 路径 | 作用 |
| --- | --- | --- |
| 保留 | `server.properties`、`allowlist.json`、`permissions.json` | 安装游戏时保留已有的文件，卸载游戏时也不删除。 |
| 清除 | `bedrock_server.exe.bak`（仅限 `windows` 构建）、`packet-statistics.txt`、`valid_known_packs.json`、`behavior_packs/`、`config/`、`definitions/`、`development_behavior_packs/`、`development_resource_packs/`、`development_skin_packs/`、`resource_packs/`、`world_templates/` | 卸载游戏时连同目录内的全部内容一并删除，即使其中有并非由游戏安装的文件。其他已安装包所拥有的路径则会保留。 |

### 更换游戏后保留什么

用 [`lip setup`](commands/setup.md) 更换游戏版本时，lip 会先卸载旧版本再安装新版本：

| 保留 | 被替换或删除 |
| --- | --- |
| `server.properties`、`allowlist.json`、`permissions.json` | 旧游戏安装的其他所有文件 |
| `worlds/`，以及服务器或你在清除路径之外创建的其他文件 | 上表所列的清除路径，连同你放入其中的内容 |
| `mods/`，以及仍处于安装状态的包文件 | 本次设置所卸载的包文件 |
| `.lip/` | |

::: warning
你手动复制到 `behavior_packs/`、`resource_packs/` 或任一 `development_*` 目录中的包，都会随这些目录一起被删除。更换游戏前，请在工作区之外备份这些文件。
:::

### 文件名

如果路径中某一段包含 `:`，或者以 `.` 或空格结尾，lip 会拒绝将该文件写入工作区，因为 Windows 无法保存这类文件名。此时操作会失败。

在 Linux 和 macOS 上，lip 和 Wine 一样，将工作区中的路径视为不区分大小写：`Mods/a.dll` 和 `mods/A.DLL` 指向同一个文件。如果已存在仅大小写不同的同名文件，新文件会直接覆盖到原位置；如果一个路径按不区分大小写匹配到了多个已有文件，操作会失败。

## 用户级目录

| 目录 | Windows | Linux 和 macOS | Linux 和 macOS 上的默认值 |
| --- | --- | --- | --- |
| 配置 | `%APPDATA%\lip` | `$XDG_CONFIG_HOME/lip` | `~/.config/lip` |
| 缓存 | `%LOCALAPPDATA%\lip\Cache` | `$XDG_CACHE_HOME/lip` | `~/.cache/lip` |
| 数据 | `%LOCALAPPDATA%\lip\Data` | `$XDG_DATA_HOME/lip` | `~/.local/share/lip` |
| 状态 | `%LOCALAPPDATA%\lip\State` | `$XDG_STATE_HOME/lip` | `~/.local/state/lip` |

如果 `XDG_*` 变量未设置、为空或不是绝对路径，则采用默认值。

### 配置目录

| 条目 | 是什么 |
| --- | --- |
| `config.toml` | [用户配置](configuration.md#用户配置)。 |
| `liprc.json` | lip v0.x 的配置文件。lip 会将其[转换](configuration.md#liprc-json)为 `config.toml` 后删除。 |

删除配置目录会重置 `github_proxy` 和 `language`。

### 缓存目录

缓存目录存放 lip 下载过且可重新下载的内容。运行 [`lip cache clean`](commands/cache_clean.md) 会删除整个目录。

| 条目 | 是什么 |
| --- | --- |
| `http-<H>` | 单个文件，保存对某个 URL 成功执行 HTTPS GET 后的响应体。`<H>` 是该 URL 的小写十六进制 SHA-256 值；URL 直接取自包中的原始定义（去掉片段部分），与是否使用代理无关。 |
| `<name>.tmp` | 正在写入的文件。 |
| `self-update/` | [`lip self-update`](commands/self_update.md) 下载并解压的内容，仅在该命令运行期间存在。 |

lip 可能在此保存其他条目，请勿依赖它们。

只要遵守相同的规则，其他程序也可以读写缓存：

- **写入。** 先将内容写入其他进程不会使用的 `.tmp` 文件，写完后再重命名。切勿原地修改已有条目。
- **读取。** 只要条目存在，内容就是完整的。如果读取方知道某个 `http-<H>` 条目应有的内容，应当加以校验，发现不一致时可直接删除。
- **删除。** `http-<H>` 条目随时可以删除；`.tmp` 文件在没有进程写入时可以删除；`self-update` 在 `lip self-update` 未运行时可以删除。

当 lip 需要 ZIP 归档，但对应 URL 的缓存条目却不是有效的 ZIP 归档时，lip 会删除该条目并重新下载一次。

删除缓存不会造成任何损失，lip 会在需要时重新下载。不过，如果你在删除缓存时恰好有 lip 命令正在写入缓存，该命令可能会失败。

### 数据目录

数据目录存放所有工作区共用的运行环境，包括 lip 在 Linux 和 macOS 上安装的 Wine、在 Windows 上安装的 Visual C++ 运行库（位于 `vc-runtime\` 下），以及为安装[系统依赖](../concepts/internals.md#系统依赖)而下载的文件。

在没有 lip 进程运行时删除该目录不会造成任何损失，lip 会在需要时重新安装系统依赖。在 Linux 和 macOS 上，这意味着重新下载 Wine；在 Windows 上，除非系统已经安装了 Visual C++ 运行库，否则也会重新下载它。

### 状态目录

| 条目 | 说明 |
| --- | --- |
| `workspaces.json` | 界面的[工作区列表](#workspaces-json)。 |
| `daemon.sock` 和守护进程的其他文件 | 仅限 Linux 和 macOS，且仅当 `XDG_RUNTIME_DIR` 未设为绝对路径时存在。参见[守护进程端点](#守护进程端点)。 |

没有 lip 进程运行时删除该目录，只会丢失工作区列表。工作区本身不受影响，在界面中重新添加即可。

### workspaces.json

界面的[工作区选择器](../interface/workspaces.md)（从顶栏打开）所显示的工作区列表，是一个按添加顺序排列的绝对路径 JSON 数组。

```json
["D:\\servers\\survival", "D:\\servers\\creative"]
```

- 文件不存在或内容不是 JSON 数组时，视为空列表。
- 非绝对路径的元素，以及与列表中已有元素指向同一目录的元素，都会被忽略。
- lip 以规范形式写入路径：解析 `.` 和 `..`，在 Windows 上使用 `\` 作为分隔符，并去掉末尾的分隔符（根目录除外）。规范形式相同的两个路径指向同一目录（Windows 上不区分大小写）。

界面启动时会将自身的工作目录加入列表。从列表中移除工作区不会改动其中的任何文件。命令不使用此列表。

## 守护进程端点

[守护进程](commands/daemon.md)在仅限当前用户访问的位置监听：

| 系统 | 端点 |
| --- | --- |
| Windows | 命名管道 `\\.\pipe\lip-<SID>`，其中 `<SID>` 是当前用户的安全标识符。 |
| Linux 和 macOS | **守护进程目录**中的 Unix 套接字 `daemon.sock`。若 `XDG_RUNTIME_DIR` 为绝对路径，则该目录为 `$XDG_RUNTIME_DIR/lip`，否则为状态目录。 |

守护进程目录的权限为 `0700`，套接字的权限为 `0600`。守护进程退出时会删除 `daemon.sock`。该目录中还有守护进程的其他文件，请勿依赖它们。

## 安装目录

安装目录是 `lip` 可执行文件所在的目录。

| 条目 | 说明 |
| --- | --- |
| `install.json` | 由 Windows 安装程序写入，告知 [`lip self-update`](commands/self_update.md) 使用安装程序进行更新。仅为当前用户安装时内容为 `{"kind": "msi", "scope": "user"}`，为所有用户安装时为 `{"kind": "msi", "scope": "machine"}`；旧版安装程序写入的 `{"kind": "msi"}` 视为 `machine`。若无此文件，lip 则视为便携版。lip 自身从不写入此文件。 |
| `<file>.old` | 便携版更新时被替换但暂时无法删除的文件。lip 会在下次启动时删除 `<executable>.old`。 |

## 失败报告

命令如果因用法错误以外的原因失败，可能会在工作区的 `.lip/logs/` 下生成一份**失败报告**，并在错误消息中给出文件名：

```
Full report: .lip\logs\20260115T093012Z-4812.log
```

文件名由 UTC 时间和进程 ID 组成。在当前版本中，报告是一个文本文件，包含命令行、lip 和系统的版本、lip 使用的目录、错误及其提示和原因、`.lip` 中的条目，以及 lip 执行过程的跟踪记录。URL 中的用户名、密码和查询参数值会替换为 `***`。lip 会保留最新的 20 份报告，并删除更早的报告。

求助时请附上这份报告。报告格式并不固定，今后可能会变。

失败的[试运行](cli.md#试运行)也可能生成报告；这是试运行唯一会写入的文件。

## 另请参阅

- [lip 的工作方式](../concepts/how_lip_works.md)：介绍操作、日志和锁。
- [状态文件](../concepts/state_file.md)
- [故障排除](../guides/troubleshooting.md)
- [工作区](../interface/workspaces.md)：界面中的工作区选择器。
