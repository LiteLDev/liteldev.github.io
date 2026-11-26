# lip.toml

本页说明 `lip.toml` 的每一个字段。读完后，你将能够看懂任何包的包文件，并编写自己的包文件。分步讲解参见[用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)。

lip 包是根目录带有**包文件** `lip.toml` 的归档。`lip.toml` 给出包的名称和版本，并按变体、运行端和平台描述 lip 要安装的内容：依赖、要放置的文件、要安装的模组以及要运行的命令。规范性定义见协议的 [lip.toml(5)](https://github.com/LiteLDev/lip/blob/main/protocol/lip.toml.md) 页。

`lip.toml` 是格式 4 的 [TOML 1.0](https://toml.io/cn/v1.0.0) 文件，由以 TOML 编写的 JSON Schema [`lip.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/lip.schema.toml) 描述。lip 也可读取 lip v0.x 包的 `tooth.json`（格式 1 到 3），参见[早期格式](#早期格式)。

## 归档

包位于一个**归档**中。归档是一棵根目录带有 `lip.toml` 的文件和目录树：

- **git 归档**：git 仓库的一个提交，通常是某个版本标签所指的提交。只有其中的普通文件和目录属于该归档（不含符号链接和子模块）；
- **ZIP 归档**：一个 ZIP 文件，可通过 HTTPS 下载，也可位于本地磁盘上。一个文件是否为 ZIP 归档只看内容，与文件名无关。其条目必须是普通文件或目录，路径以 `/` 分隔，不得以 `/` 开头，也不得包含 `..` 段或 `\`；
- **目录归档**：本地磁盘上的一个目录，以其内容作为归档。其中文件和目录的名字不得包含 `\`。

有一个包既没有归档也没有 `lip.toml`：游戏 `github.com/LiteLDev/bds`。lip 会根据服务器构建列表自行生成它的包文件；参见 [`lip setup`](../reference/commands/setup.md#游戏版本与构建)和[服务器文件](../reference/files.md#服务器文件)。

## 示例

一个模组，以附加到每个 GitHub Release 的 ZIP 文件发布，支持 Windows x64 上的服务端和客户端：

```toml
format = 4
id = "github.com/example/MyMod"
version = "1.0.0"

[info]
name = "My Mod"
description = "A short description"
tags = ["utility"]

[[variants.""]]
side = "server"
platform = "win-x64"
preserve = ["mods/MyMod/config/"]

[variants."".deps]
"github.com/LiteLDev/LeviLamina" = ">=1.0.0 <2.0.0"
"github.com/example/MyLib" = "^0.3.0"

[[variants."".assets]]
type = "mcmod"
urls = ["https://github.com/example/MyMod/releases/download/v{{version}}/MyMod-server-win-x64.zip"]

[[variants.""]]
side = "client"
platform = "win-x64"
preserve = ["mods/MyMod/config/"]

[variants."".deps]
"github.com/LiteLDev/LeviLamina" = ">=1.0.0 <2.0.0"
"github.com/example/MyLib" = "^0.3.0"

[[variants."".assets]]
type = "mcmod"
urls = ["https://github.com/example/MyMod/releases/download/v{{version}}/MyMod-client-win-x64.zip"]
```

版本和版本范围都是字符串，因此总要加引号。含有 ASCII 字母、数字、`_` 和 `-` 以外字符的键也要加引号，例如 `deps` 中的包 id 或默认变体 `""`：`[[variants.""]]` 为默认变体添加一个条目。

## 字段

`lip.toml` 不得包含日期时间、日期、时间，或浮点数 `inf`、`nan`。此处未描述的键会被忽略。

### 顶层

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `format` | `int` | 是 | 必须为 `4`。 |
| `id` | `string` | 是 | **包 ID**，必须是合法的 [Go 模块路径](https://go.dev/ref/mod#module-path)，例如 `github.com/user/repo`。比较时不区分 ASCII 大小写。 |
| `version` | `string` | 是 | 包的版本，不带前导 `v` 的 [SemVer 2.0.0](https://semver.org/) 版本。 |
| `info` | `object` | 否 | 供人阅读的信息。参见 [Info](#info)。 |
| `variants` | `object` | 是 | 把每个变体名映射到其条目。参见[变体](#变体)。 |

对于 git 仓库中的包，`id` 必须是该仓库的路径：`https://github.com/user/repo.git` 中的 `lip.toml` 必须写 `id = "github.com/user/repo"`。在版本标签 `v<version>` 处，`version` 必须等于标签版本。否则该提交不是包，lip 不会安装它。

### Info

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 显示名称。 |
| `description` | `string` | 简短描述。 |
| `tags` | `string[]` | 标签。参见[推荐标签](#推荐标签)。 |
| `logo` | `string` | 徽标图片的 URL，必须以 `https://` 开头；其响应（直接或经重定向后）即为该图片。 |

lip 不使用 `info`。

#### 推荐标签

`info.tags` 帮助用户在模组列表（例如界面的「市场」页面和 [LeviMC 模组](https://levimc.org/zh-Hans/mods/)）中找到你的包；lip 自身会忽略这些标签。模组列表会优先显示下表中的标签（显示为翻译后的名称），并支持按这些标签筛选。请严格按照下表填写小写的标签 ID；此外，你也可以添加自定义标签：

```toml
[info]
tags = ["management", "economy"]
```

| 标签 | 名称 | 适用于 |
| --- | --- | --- |
| `library` | 前置库 / API | 其他模组依赖的库或 API，例如事件、表单或导出函数。 |
| `utility` | 实用工具 | 玩家日常使用的工具，例如背包辅助、信息显示、物品提示和配方查看。 |
| `management` | 服务器管理 | 运营服务器，例如备份、封禁、白名单、登录、命令和领地。 |
| `game-mechanics` | 游戏机制 | 改变游戏玩法，例如原版增强功能和成就。 |
| `adventure` | 内容与冒险 | 可供探索的新内容，例如世界生成、地形和生物群系。 |
| `visual` | 视觉与界面 | 玩家看到的内容，例如 HUD、侧边栏、光影、回放和录制。 |
| `economy` | 经济 | 货币、商店和交易。 |
| `teleport` | 传送 | 传送命令、家园、传送点和传送石碑。 |
| `anticheat` | 反作弊 | 检测和阻止作弊，例如反矿透。 |
| `optimization` | 性能优化 | 提升性能，例如实体和掉落物清理。 |
| `bugfix` | 错误修复 | 修复游戏的错误。 |
| `technology` | 技术与红石 | 红石、活塞和自动化。 |
| `protocol` | 协议与多版本 | 网络协议，例如让多个游戏版本的客户端加入。 |

无需用标签标明运行端、平台，或标明该包是 LeviLamina 模组，因为条目和 `deps` 已经包含了这些信息。

### 变体

`variants` 将每个**变体**名映射到一个非空的**条目**数组。变体 `""` 是默认变体；其他名称须匹配 `^[a-z0-9_]+(/[a-z0-9_]+)?$`，例如 `lua` 或 `quickjs`。用户在来源后加上 `#<variant>` 即可选择变体，例如 `lip install github.com/LiteLDev/LegacyScriptEngine#lua`；不带 `#` 的来源则选择默认变体 `""`。

每个条目仅适用于一个**运行端**和一个**平台**。lip 解析包时，会在所选变体中查找 `side` 和 `platform` 与工作区[环境](#环境)完全匹配的条目。此处不支持通配符：支持多个平台的包必须为每个平台分别编写条目。若所选变体中没有匹配的条目，该包就不会成为当前环境下的候选包。同一变体中不得存在两个 `side` 和 `platform` 完全相同的条目。

### 条目

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `side` | `string` | 是 | `"server"` 或 `"client"`。 |
| `platform` | `string` | 是 | [.NET RID](https://learn.microsoft.com/dotnet/core/rid-catalog)，例如 `win-x64`。 |
| `deps` | `object` | 否 | 参见[依赖](#依赖)。 |
| `assets` | `array` | 否 | 参见[资源](#资源)。 |
| `preserve` | `string[]` | 否 | 需保留文件的 [glob](#glob)：安装时不覆盖已存在的文件，卸载时也不删除它。 |
| `purge` | `string[]` | 否 | 卸载时额外删除的路径的 [glob](#glob)。匹配到的目录会连同其下所有内容一起删除。 |
| `hooks` | `object` | 否 | 参见[钩子](#钩子)。 |

### 依赖

`deps` 把 `<包 ID>` 或 `<包 ID>#<variant>` 映射到版本范围：

```toml
[variants."".deps]
"github.com/LiteLDev/LeviLamina" = ">=1.0.0 <2.0.0"
"github.com/LiteLDev/LegacyScriptEngine#lua" = "^0.9.0"
```

对于每个依赖，lip 会从对应仓库的版本标签中，选择一个版本在指定范围内且包含当前环境条目的版本（及变体）进行安装。对于从 git 引用（例如 `@branch:main`）安装的包，只要其版本在指定范围内，且该仓库有可供 lip 为该依赖安装的版本，它也能满足对同一包 ID 和变体的依赖。

版本范围采用 [Semver for .NET 3.0.0](https://github.com/WalkerCodeRanger/semver/tree/v3.0.0) 中 `SemVersionRange.Parse` 在默认选项下的语法和语义，例如 `^1.2.0`、`~1.2.0`、`>=1.0.0 <2.0.0`、`1.2.*` 或 `>=1.0.0 || 0.9.0`。不带运算符的完整版本（如 `1.2.3`）只匹配该版本。

### 资源

`assets` 指定包文件的来源。每个资源都有一个 `type`：

| 类型 | 字段 | 说明 |
| --- | --- | --- |
| `self` | `place`（可选） | `lip.toml` 自身所在的归档，例如标签处的仓库。写了 `urls` 也会被忽略。 |
| `zip` | `urls`、`place`（可选） | 通过 HTTPS 下载的 ZIP 归档。 |
| `mcmod` | `urls` | 通过 HTTPS 下载、包含一个 LeviLamina 模组的 ZIP 归档；它没有 `place`。参见 [模组](#模组)。 |

`urls` 是由指向同一文件的 HTTPS URL 组成的非空数组，lip 会按顺序尝试下载。一个条目最多只能包含一个 `mcmod` 资源。资源按顺序写入；当两个资源或放置规则写入同一路径时，以后者为准。

### 放置规则

`place` 的每个成员都是一条包含 `src` 和 `dest` 的放置规则，用于将资源归档中的文件写入工作区。`src` 是归档中的路径，`dest` 是相对于工作区的路径。两者都以 `/` 分隔，不得以 `/` 或盘符开头，也不得包含 `//`、`..` 段或 `\`。放置规则的形式取决于 `src`：

- **glob 形式**：`src` 含有 `*`、`?` 或 `[`。所有与 glob 匹配的文件都会写入 `dest`（`""` 或以 `/` 结尾）下，并保留其相对于 `src` 开头无通配符路径段的路径。若 glob 不匹配任何文件，则不写入任何内容。
- **目录形式**：`src` 为 `""` 或以 `/` 结尾。`src` 下的所有文件都会写入 `dest`（`""` 或以 `/` 结尾）下，并保留其相对于 `src` 的路径。`src` 下必须至少有一个文件。
- **文件形式**：其他情况。文件 `src` 写入 `dest`，`dest` 不得以 `/` 结尾。该文件必须存在。

```toml
[[variants."".assets]]
type = "zip"
urls = ["https://example.com/tool-1.0.0-win-x64.zip"]
place = [
  { src = "bin/", dest = "tools/" },
  { src = "README.md", dest = "tools/README.md" },
  { src = "plugins/*.dll", dest = "tools/plugins/" },
]
```

包根部的 `lip.toml` 永远不会被写入。

lip 拒绝写入以下路径：`.lip` 及其下的一切、其他已安装包拥有的文件，以及任一路段含有 `:` 或以 `.` 或空格结尾的路径（参见[文件名](../reference/files.md#文件名)）。遇到这些路径时，安装会失败。

### glob

`preserve`、`purge` 以及 glob 形式的放置规则使用 POSIX `fnmatch` 模式，按路径段逐段匹配：`*` 匹配除 `/` 以外的任意字符（包括开头的 `.`），`?` 匹配除 `/` 以外的单个字符，`[...]` 匹配集合中的单个字符。`**` 段匹配零个或多个段；以 `/` 结尾的模式匹配一个目录及其下的所有内容。不支持转义字符。glob 不得为空，不得以 `/` 开头，也不得包含 `//` 或 `\`。

`preserve` 和 `purge` 匹配相对于工作区的路径，对模组也是如此：应写 `mods/MyMod/config/`，而不是 `config/`。`purge` 永远不会匹配工作区根目录下的 `mods` 或 `.lip`，也不会匹配 `.lip` 下的任何内容；`mods` 下的路径不会仅因为 `mods` 本身匹配而被匹配，因此 `mods/` 和 `*/` 不会删除 `mods` 下的任何内容。

### 钩子

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `pre_install` | `string[]` | 写入文件之前运行的命令。 |
| `post_install` | `string[]` | 写入文件之后运行的命令。 |
| `pre_uninstall` | `string[]` | 删除文件之前运行的命令。 |
| `post_uninstall` | `string[]` | 删除文件之后运行的命令。 |

命令在工作区根目录中以 lip 的环境变量运行：若工作区[环境](#环境)的平台为 Windows 平台，则以 `cmd /s /c "<命令>"` 运行，让 `cmd` 按原样执行该命令；否则以 `sh -c <命令>` 运行，`sh` 通过 `PATH` 查找。在非 Windows 系统上，Windows 平台的命令通过 Wine 运行（参见[Linux 和 macOS](../guides/linux_macos.md)），此时含有 `"` 的命令无法按原样传给 `cmd`。在 Windows 上，若 Visual C++ 运行库仅为当前用户安装，lip 会将其目录置于命令 `PATH` 的最前面（参见[系统依赖](internals.md#系统依赖)）。若命令以非零退出码退出，操作即告失败。操作失败时，lip 会回滚文件改动，但不会撤销钩子命令已执行的操作，因此钩子命令应当可以安全地重复运行。

## 模板

与 lip v0.37.0 的 `tooth.json` 一样，`lip.toml` 中除键以外的每个字符串都是 [Scriban 语言](https://github.com/scriban/scriban/blob/7.5.0/site/docs/language.md)模板。lip 在读取文件前会先渲染所有模板，因此上文所述的版本检查、URL 和 glob 校验等规则都作用于渲染后的值。模板变量即按字面书写的顶层字段：`{{version}}`、`{{id}}`、`{{format}}`、`{{info.name}}`、`{{variants}}`，以及你添加的任何其他顶层键。变量保存的是字段的原始内容，其中包含的模板不会预先渲染。

```toml
version = "1.2.3"

[[variants."".assets]]
type = "mcmod"
urls = ["https://github.com/example/MyMod/releases/download/v{{version}}/MyMod-{{version}}.zip"]
```

模板中可以使用任意 Scriban 表达式，例如 `{{version | string.replace "." "_"}}`。未定义的变量渲染为空字符串。若模板无法解析或渲染失败（例如 `{{ if }}`），该归档将不再视为包。如需原样输出 `{{`，请写成 `{{ "{{" }}`。[状态文件](state_file.md)中记录的是渲染后的包文件。

## 模组

带有 `mcmod` 资源的条目是**模组**；否则该包是仅放置文件的**文件包**。

`mcmod` 资源的归档根部必须包含该模组的 LeviLamina `manifest.json`。该文件是一个 JSON 对象，其 `name` 必须匹配 `^[A-Za-z0-9][A-Za-z0-9._-]*$`。这个 `name` 就是**模组名称**。lip 会将整个归档按原有路径写入 `mods/<模组名称>/`。

lip 只读取 `manifest.json` 的 `name` 来命名模组目录，不会检查或修改其中的任何其他内容：`manifest.json` 与其他文件一样，按归档中的原样写入模组目录。你需要自行确保其中的 `dependencies` 与条目的 `deps` 一致。若缺少 `manifest.json` 或其中没有有效的 `name`，安装会在做任何修改前失败。

两个模组名称相同（不区分 ASCII 大小写）的模组不能安装在同一个工作区中。

除 `mcmod` 资源外，条目还可以包含其他资源，例如将文件放到 `mods/` 之外的 `zip` 资源。

## 身份

已安装包的**身份**由其包 ID 构成，当变体不为 `""` 时还会附上 `#<variant>`，例如 `github.com/LiteLDev/LegacyScriptEngine#lua`。同一个工作区中，每个身份最多只能安装一个包；[`lip list`](../reference/commands/list.md) 会显示身份，[`lip uninstall`](../reference/commands/uninstall.md) 也接受身份作为参数。

身份取决于包的 `id`，而非安装来源：若一个 ZIP 文件的 `lip.toml` 中写有 `id = "github.com/user/repo"`，它的身份就与来自该仓库的包相同，因此两者不能同时安装。

## 环境

工作区的环境是一个二元组 `(side, platform)`：

- **运行端**（side）：`server` 或 `client`，表示工作区属于游戏的哪一端。lip 只管理服务端工作区，因此始终使用 `server`。客户端工作区由 LeviLauncher 等启动器管理；若工作区的[状态文件](state_file.md)记录为 `client`，lip 会拒绝处理。
- **平台**（platform）：一个 [.NET RID](https://learn.microsoft.com/dotnet/core/rid-catalog)，无论 lip 运行在什么系统上都固定为 `win-x64`。在非 Windows 系统上，lip 通过 Wine 运行工作区中的程序（参见[Linux 和 macOS](../guides/linux_macos.md)）。Linux 版服务器并不是另一个平台，而是 `github.com/LiteLDev/bds` 的 `linux` 变体，其条目的平台同样是 `win-x64`。早期版本 lip 写入的 `linux-x64` 状态文件会按 `win-x64` 读取（参见[状态文件](state_file.md#linux-x64-的工作区)）。以 `win` 开头的平台称为 **Windows 平台**。

## 早期格式

lip v0.39 的 `lip.toml` 同样是格式 4，但把运行端写作 `platform`、把平台写作 `runtime`（例如 `platform = "server"` 和 `runtime = "win-x64"`）。lip 不读取这类条目：如果条目含有 `runtime`，或者 `platform` 为 `"server"` 或 `"client"`，该归档将不被视为包，同时 lip 会给出消息，提示将 `platform` 改名为 `side`、将 `runtime` 改名为 `platform`。只需重命名每个条目中的这两个键即可，其余内容保持不变。

lip v0.37.0 及更早版本的包没有 `lip.toml`，而是包含格式版本为 1、2 或 3 的 `tooth.json`。lip 仍会安装这些包，但从不写入它们；请使用 [`lip pkg migrate`](../reference/commands/pkg_migrate.md) 将包转换为 `lip.toml`。包含 `lip.toml` 的归档一律从 `lip.toml` 读取，无论是否同时含有 `tooth.json`；其他格式的 `tooth.json` 则不会被读取。

格式 1 和 2 会先按 lip v0.37.0 的方式读取为格式 3。随后，格式 3 的 `tooth.json` 会针对工作区环境完整转换为一个包文件。lip 仅使用转换后的结果：解析、安装以及记录到[状态文件](state_file.md)中的都是这一结果，安装时不再保留任何格式 3 的语义。

- `tooth` 变为 `id`。`version` 为包的版本：在版本标签处取标签版本（无论 `tooth.json` 中的 `version` 写的是什么），否则取该 `version`。
- 保留 `info`，其中的 `avatar_url` 若以 `https://` 开头则变为 `logo`，否则直接丢弃。
- 对每个标签，筛选出其下 `platform` 为空或与环境平台匹配（`tooth.json` 的 `platform` 是 RID 模式，例如 `win-*`）的变体，按 lip v0.37.0 的方式合并为一个对应当前环境运行端和平台的条目。没有这类变体的标签不构成变体。
- `dependencies` 原样变为 `deps`。
- 每个资源保留其 `type` 和 `urls`，其 `placements` 变为 `place`（见下文）。`lip.toml` 中不存在类型为 `tar`、`tgz` 或 `uncompressed` 的资源，这类资源会使该标签在当前环境下没有变体。
- `preserve_files` 变为 `preserve`：`\` 替换为 `/`，不含 `/` 的模式加上前缀 `**/`，因此 `config.json`
  变为 `**/config.json`。
- `remove_files` 变为 `purge`：`\` 替换为 `/`，不以 `/` 结尾的模式还会额外追加一个以 `/` 结尾的形式，因此 `logs` 变为 `logs` 和 `logs/`。
- scripts 变为 `hooks`：`pre_install` 仍为 `pre_install`；`install` 和随后的 `post_install` 变为 `post_install`；`pre_uninstall` 和随后的 `uninstall` 变为 `pre_uninstall`；`post_uninstall` 仍为 `post_uninstall`。

对于放置规则 `{ "type": ..., "src": ..., "dest": ... }`，将 `src` 和 `dest` 中的 `\` 替换为 `/` 并移除空段和 `.` 段后，即变为 `place` 的一个成员：

| 放置规则 | `place` 成员 |
| --- | --- |
| `type` 为 `dir` | `src` 和 `dest` 各自加上 `/`（为空时除外）：目录形式。 |
| `type` 为 `file`，`src` 含 `*`、`?` 或 `[` | `src`，以及加上 `/` 的 `dest`（为空时除外）：glob 形式。 |
| `type` 为 `file`，其他 `src` | `src` 和 `dest`：文件形式。 |

转换后，在包文件中无效的 glob 或放置规则会被略去。随后，放置规则按 `lip.toml` 的方式执行：例如，文件缺失现在会导致安装失败，且包的 `tooth.json` 永远不会被写入。

早期格式的包始终是文件包。其身份遵循相同的规则，例如 `github.com/LiteLDev/LegacyScriptEngine#lua`。

格式 3 的 schema 为 lip v0.37.0 的 [`manifest.schema.json`](https://github.com/LiteLDev/lip/blob/v0.37.0/schemas/manifest.schema.json)，其格式说明见 lip v0.37.0 的[包清单](https://github.com/LiteLDev/lip/blob/v0.37.0/docs/concepts/package_manifest.md)页面：

```json
{
  "format_version": 3,
  "format_uuid": "289f771f-2c9a-4d73-9f3f-8492495a924d",
  "tooth": "github.com/user/repo",
  "version": "1.0.0",
  "info": { "name": "My Package", "description": "A short description" },
  "variants": [
    {
      "label": "",
      "platform": "win-x64",
      "dependencies": { "github.com/other/package": ">=1.0.0" },
      "assets": [
        {
          "type": "self",
          "placements": [{ "type": "dir", "src": "bin/", "dest": "bin/" }]
        }
      ],
      "preserve_files": ["config/*.json"],
      "remove_files": ["temp/"],
      "scripts": { "post_install": ["echo installed"] }
    }
  ]
}
```

## 另请参阅

- [用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)和[迁移包](../authors/migrating_packages.md)
- [`lip pkg init`](../reference/commands/pkg_init.md) 与[开发工具](../interface/tools.md)：界面中的一个表单，用于生成 `lip.toml`，并在输入时检查每一个值。
- [状态文件](state_file.md)：记录每个已安装包的包文件的位置。
- [内部机制](internals.md)：lip 如何解析来源和版本。
