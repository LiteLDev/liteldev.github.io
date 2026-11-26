# 状态文件

本页介绍 `.lip/state.json`。读完后，你将了解 lip 为工作区记录了哪些内容，以及各个字段的用途。

`lip` 在工作区的**状态文件**中记录工作区状态：安装了哪些包、它们的确切版本、来源，以及它们写入磁盘的文件。

## 位置

状态文件是工作区根目录下的 `.lip/state.json`。在 Windows 上，lip 创建 `.lip` 目录时会为其设置隐藏属性；在其他平台上，以点号开头的名称本身就使其隐藏。

状态文件位于工作区目录内，不与路径绑定，因此移动、重命名或复制工作区后，状态文件和已安装的包都会随之保留。

`.lip` 为 lip 保留：如果安装的包要把文件写入工作区根目录下的 `.lip` 或其下的任何位置，安装就会失败；`purge` 模式也永远不会匹配 `.lip` 及其下的任何内容。

## 作用

状态文件有以下几个用途：

1.  **状态追踪**：作为工作区安装状态的唯一真实来源。
2.  **可复现性**：记录每个已安装包安装时所用的包文件；对于来自 git 仓库的包，还记录其所在的提交。当 lip 再次需要某个包时，会用该包文件直接安装，而不是重新解析。
3.  **卸载**：`lip` 追踪包写入磁盘的每个文件，使 `lip uninstall` 能干净地删除与包相关的所有文件，避免工作区中残留"腐烂文件"。
4.  **依赖图**：区分用户显式安装的包和作为依赖安装的包。这样，`lip uninstall` 可以一并移除不再被任何显式安装的包需要的依赖，`lip list` 也可以把这两组包分开显示。
5.  **环境**：一旦确定工作区的运行端和平台，就将其记录下来，使后续命令使用同一[环境](lip_toml.md#环境)。

状态文件仅在一次操作的所有包都安装或卸载完成后才替换一次。如果操作失败，lip 会撤销对工作区的修改，状态文件保持原样，从而保证两者始终一致（参见 [lip 的工作方式](how_lip_works.md)）。

lip 总是整体替换状态文件：先写入 `.lip/state.json.tmp`，再将其重命名为 `.lip/state.json`。因此，在 lip 运行期间读取状态文件的程序，看到的要么是操作前的文件，要么是操作后的文件，绝不会是写了一半的文件。[`lip list`](../reference/commands/list.md) 就是这样读取的，无需获取工作区锁。

## 结构

状态文件是一个 JSON 文件，由 JSON Schema [`state.schema.json`](https://github.com/LiteLDev/lip/blob/main/protocol/state.schema.json) 描述：

```json
{
  "format": 4,
  "side": "server",
  "platform": "win-x64",
  "packages": [...]
}
```

### 字段

*   **`format`**：状态文件的格式，`4`。
*   **`side`**：工作区的运行端，`"server"` 或 `"client"`。lip 写入 `"server"`。
*   **`platform`**：工作区的平台，一个 [.NET RID](https://learn.microsoft.com/dotnet/core/rid-catalog)。
*   **`packages`**：已安装的包，按安装顺序排列：每个包都排在满足其依赖的包之后。

`side` 和 `platform` 始终存在且永不为 `null`；缺少这两个字段的状态文件无效。没有状态文件的工作区会在第一次执行 `setup`、`install`、`uninstall` 或 `update` 时获得环境（参见 [`lip install`](../reference/commands/install.md)）。

### 包条目

每个包恰好包含以下字段：

*   **`manifest`**：安装该包时所用的完整包文件。对于[早期格式](lip_toml.md#早期格式)的 `tooth.json`，它是 lip 针对工作区环境从中派生的包文件。其 `id` 是包 ID，`version` 是已安装的版本。
*   **`variant`**：安装来源的变体，默认变体为 `""`。它与 `manifest` 的 `id` 一起构成包的[身份](lip_toml.md#身份)。
*   **`explicit`**：
    *   `true`：该包由用户显式安装（例如 `lip install <package>`）。
    *   `false`：该包作为另一个包的依赖安装。
*   **`ref`**：包的安装来源：传给 `lip install` 或 `lip update` 的参数（例如 `github.com/user/repo`、`github.com/user/repo#lua@branch:main` 或 `https://` URL；本地路径记录为其绝对路径的 `file:` URI），[`lip setup`](../reference/commands/setup.md) 安装游戏或加载器所用的来源（例如 `github.com/LiteLDev/bds@1.21.0`），对于依赖则是该依赖的键。[`lip update`](../reference/commands/update.md) 会再次请求该来源。
*   **`commit`**：仅用于来自 git 仓库的包：其归档所在的提交，以小写十六进制表示。来自 URL 或本地路径的包没有 `commit`；游戏 `github.com/LiteLDev/bds` 不来自任何仓库，也没有该字段。
*   **`files`**：包拥有的文件，相对于工作区根目录，以 `/` 分隔。

已安装的条目是 `manifest.variants[variant]` 中 `side` 和 `platform` 与工作区一致的那个条目。

lip 仅按身份、版本和提交比较已安装的包与解析出的包：如果两个包的身份和版本相同，并且都不来自 git 仓库（或来自同一提交），就视为同一个包，即使 URL 或本地路径指向的文件此后已发生变化。lip 既不记录也不检查下载的 ZIP 归档或资源的校验和。

当 lip 再次需要某个已安装包的文件时，会用所记录的 `manifest` 安装该包：对于来自 git 仓库的包，从记录的提交安装（即使该包来自某个此后已向前推进的分支）；否则从其 `ref` 当前指向的归档安装。卸载则既不需要提交也不需要归档。

## 示例

```json
{
  "format": 4,
  "side": "server",
  "platform": "win-x64",
  "packages": [
    {
      "manifest": {
        "format": 4,
        "id": "github.com/example/MyMod",
        "version": "1.0.0",
        "variants": {
          "": [
            {
              "side": "server",
              "platform": "win-x64",
              "deps": { "github.com/LiteLDev/LeviLamina": ">=1.0.0 <2.0.0" },
              "assets": [
                {
                  "type": "mcmod",
                  "urls": ["https://github.com/example/MyMod/releases/download/v1.0.0/MyMod-server-win-x64.zip"]
                }
              ]
            }
          ]
        }
      },
      "variant": "",
      "explicit": true,
      "ref": "github.com/example/MyMod",
      "commit": "0123456789abcdef0123456789abcdef01234567",
      "files": ["mods/MyMod/MyMod.dll", "mods/MyMod/manifest.json"]
    }
  ]
}
```

## lip v0.39.x 的工作区

lip v0.39.x 的状态文件同样是格式 4，但在根对象以及所记录的每个 `manifest` 条目中，将运行端记作 `platform`、将平台记作 `runtime`。lip 不读取这类状态文件：如果根对象或条目含有 `runtime`，或者 `platform` 的值为 `"server"` 或 `"client"`，命令就会失败并提示将 `platform` 改名为 `side`、将 `runtime` 改名为 `platform`。lip 不会自动迁移；请手动在根对象及每个 `manifest` 的各个条目中重命名这两个键。关于 lip v0.37.0 及更早版本的工作区，请参见 [lip v0.x 的工作区](#lip-v0-x-的工作区)。

## linux-x64 的工作区

早期版本的 lip 曾通过 `--platform` 为 `win-x64` 以外的平台安装包。lip 会把平台记录为 `linux-x64` 的状态文件当作 `win-x64` 的状态文件来读取，将其中的 `github.com/LiteLDev/bds` 视为变体 `github.com/LiteLDev/bds#linux`（即 Linux 版服务器），并在下一次执行 `setup`、`install`、`uninstall` 或 `update` 时按此写入状态文件。如果 `linux-x64` 状态文件中还记录了其他任何包，所有读取该文件的命令都会失败，并在报错消息中指明该包；请在新工作区中重新安装这些包。如果状态文件记录的是其他平台，则会使 `setup`、`install`、`uninstall`、`update` 和 `run` 失败。

## lip v0.x 的工作区

lip v0.37.0 及更早版本的工作区没有状态文件，而是在根目录下有一个格式版本为 3 的 `tooth_lock.json`。lip 会自动迁移该文件：

*   `lip list` 将其当作对应的状态文件读取，不做修改。
*   下一次执行 `lip setup`、`lip install`、`lip uninstall` 或 `lip update` 时，会将该状态文件写入 `.lip/state.json`，并删除 `tooth_lock.json`。

迁移时，每个包都会保留其变体、是否显式安装，以及其拥有的工作区内的文件；`ref` 设为其包 ID（加上 `#<variant>`），`commit` 则从其仓库的版本标签 `v<version>` 查得。如果无法查得该提交，命令就会失败。如果某个包的 `tooth.json` 无法针对工作区环境读取，该包会被丢弃。

## 另请参阅

- [文件](../reference/files.md#lip-目录)：`.lip` 中的其他条目。
- [`lip list`](../reference/commands/list.md)
- [lip.toml](lip_toml.md)：`manifest` 中保存的包文件。
- [lip 的工作方式](how_lip_works.md)：操作和日志。
