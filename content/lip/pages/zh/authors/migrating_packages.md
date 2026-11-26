# 迁移包

本指南介绍如何将使用 `tooth.json` 的 lip v0.x 包迁移为使用 `lip.toml` 的包，以及发布前需要检查的事项。

面向 lip v0.37.0 及更早版本的包使用格式版本为 1、2 或 3 的 `tooth.json`。现在的包改用 `lip.toml`（参见 [lip.toml](../concepts/lip_toml.md)）。虽然 lip 仍能安装使用这类 `tooth.json` 的包，但发布新版本时应改用 `lip.toml`。你可以使用 `lip pkg migrate` 命令完成转换。

## 使用 `lip pkg migrate`

在包仓库的根目录（即包含 `tooth.json` 的目录）下，不带参数运行 `lip pkg migrate`：

```sh
cd MyTool
lip pkg migrate
git add lip.toml tooth.json
git commit -m "Migrate tooth.json to lip.toml"
```

该命令会将 `tooth.json` 转换为 `lip.toml` 并写入磁盘，随后删除 `tooth.json`。在界面中，[开发工具](../interface/tools.md)页的**迁移 tooth.json** 会对当前工作区执行同样的操作，并在界面中提问。如果 `lip.toml` 已存在，或者 `tooth.json` 不存在、不是 lip 可读取的格式 1、2 或 3 的 `tooth.json`，命令就会失败，且不做任何修改。

### 询问

`lip.toml` 没有 RID 模式：每个条目只指定一个平台，即一个 RID。如果转换结果需要旧文件中未提供的值，lip 会在终端上向你提问，直到输入有效回答为止：

- `tooth.json` 中如 `win-*` 这样的 `platform` 模式所代表的平台（RID），以逗号分隔（每个值都必须匹配该模式）；
- `tooth.json` 中如 `windows/amd64` 这样不是 RID 的 `platform` 所代表的平台（RID），以逗号分隔；
- 未指定 `platform` 的变体所适用的平台（RID）（存在这类变体时）。

如果标准输入或标准错误不是终端（例如在 CI 中），`lip pkg migrate` 会直接失败，指明原本需要询问的值，且不做任何修改。

### 警告

所有被丢弃或以不同含义转换的内容都会以警告形式输出，并指明其来源字段，例如 `variants (label '', win-x64).assets[1]`。格式 1 和 2 的 `tooth.json` 文件会先转换为格式 3，因此字段名按格式 3 给出。警告不会导致命令失败；请检查这些警告，按需修改 `lip.toml`，然后提交。

## 变化内容

`format` 设为 `4`，`tooth` 变为 `id`，`version` 和 `info` 原样复制，但 `info.avatar_url` 仅在以 `https://` 开头时变为 `info.logo`，否则会被丢弃并给出警告。变体按以下方式改写：

- 每个标签变为同名变体；空标签变为变体 `""`。
- 对于某个标签适用的每个平台（将其各变体的 `platform` 中的模式和非 RID 值展开为你给出的 RID），该标签下适用于该平台的变体会按 lip v0.37.0 的方式合并，结果变为该 `platform` 的一个条目。合并后的变体依赖 `github.com/LiteLDev/LeviLamina#client` 时，其 `side` 为 `client`；依赖 `github.com/LiteLDev/LeviLamina` 的其他变体时，为 `server`；不依赖 LeviLamina 时，结果会变为两个条目，每个运行端各一个。
- LeviLamina 从 26.60.8（首个带 `lip.toml` 的版本）起不再有 `client` 变体，客户端构建也包含在 `""` 变体中。对于 `github.com/LiteLDev/LeviLamina#client`（或 `#client_<y>`）的依赖，如果版本范围允许至少 26.60.8 的版本，就会变为对 `github.com/LiteLDev/LeviLamina`（或 `#<y>`）的依赖，并将范围收窄为其中至少 26.60.8 的版本；如果不允许任何这类版本，或者条目同时还依赖 `github.com/LiteLDev/LeviLamina`（或 `#<y>`），则该依赖保持原样。随后，在标签 `client`（或 `client_<y>`）中，因此改变了依赖的客户端条目会移到 `""`（或 `<y>`）变体中，除非目标变体已有相同平台的客户端条目。每一处改动都会给出警告。
- `dependencies` 连同其范围变为 `deps`。对于现在无效的范围，命令会在终端上询问，直到输入有效范围为止；没有终端时，命令会失败且不做任何更改。
- 每个资源保留其 `type` 和 `urls`，`placements` 则变为 `place`。转换方式与 lip 读取[早期格式](../concepts/lip_toml.md#早期格式) `tooth.json` 时完全相同：先将 `\` 替换为 `/`，并移除空段和 `.` 段；随后，`dir` 放置规则采用目录形式（`src` 和 `dest` 以 `/` 结尾，或为 `""`），`src` 含 `*`、`?` 或 `[` 的 `file` 放置规则采用 glob 形式（`dest` 以 `/` 结尾，或为 `""`），其余 `file` 放置规则采用文件形式。在 `lip.toml` 中无效的放置规则会被省略，并给出警告。
- `lip.toml` 没有 `tar`、`tgz` 和 `uncompressed` 资源类型。如果某个平台合并后的变体含有这类资源，则不会生成该平台的条目，并会给出警告；这与 lip 在该平台下不安装其任何条目的行为一致。
- `preserve_files` 变为 `preserve`，`remove_files` 变为 `purge`，并将其中的 `\` 替换为 `/`；不含 `/` 的 `preserve_files` 模式会加上前缀 `**/`，不以 `/` 结尾的 `remove_files` 模式还会以带结尾 `/` 的形式再写一遍（参见[局限](#局限)）。
- scripts 变为 `hooks`：`pre_install`、`post_install`（先 `install`，再 `post_install`）、`pre_uninstall`（先 `pre_uninstall`，再 `uninstall`）和 `post_uninstall`。
- 除 `info` 外，其他空值均会被省略。

## 局限

`lip pkg migrate` 只是辅助工具，不保证结果正确。请始终检查其输出。

- `lip.toml` 要求标签处的 `version` 等于标签版本，且仓库的 `id` 等于其路径。lip v0.37.0 会安装违反这些规则的 `tooth.json`；发布前请检查你的文件。
- 放置规则仅按上述规则转换，不会查看实际放置的文件，随后按 `lip.toml` 的方式执行：`src` 为模式的 `file` 放置规则会保留匹配文件的子目录，而过去的 `tooth.json` 只会按文件名放置它们；放置缺失文件的放置规则会使安装失败，而过去的 `tooth.json` 会直接跳过。请检查这类放置规则。
- 不含 `/` 的 `preserve_files` 模式过去会匹配任意目录中的文件名，转换后会变为 `**/<pattern>`。`remove_files` 模式过去也会删除匹配的目录，因此还会以带结尾 `/` 的形式再写一遍。不是有效 glob 的模式（例如以 `/` 开头的模式）会被丢弃。
- 格式 1 和 2 中，版本范围无法在格式 3 中读取的依赖（例如 `2.16.x`）在安装 `tooth.json` 时本就会被忽略；lip 会报告这些依赖，以便你手动添加。
- 安装与卸载钩子以外的脚本（例如 `pre_pack` 或自定义脚本）以及格式 2 的 `prerequisites` 没有对应项，会被丢弃。
- 迁移得到的包是一个文件包，会将文件放到与旧 `tooth.json` 相同的位置。如果你的包是 LeviLamina 模组，可以考虑改为以 `mcmod` 资源发布（参见[lip.toml：模组](../concepts/lip_toml.md#模组)），这样它会被安装到 `mods/<name>/`。
- 对其他仍带有 `tooth.json` 的包的依赖依然有效，因为 lip 仍可安装它们。

只有名称恰为 `v<SemVer>` 的标签（例如 `v1.2.3`）才是版本。像 `v1.2` 这样的标签不是版本。

## 迁移之后

1. 阅读警告，并在需要的地方修改 `lip.toml`。
2. 检查转换结果：在这个文件夹里运行 `lip`，在[开发工具](../interface/tools.md)页选择**编辑 lip.toml**。表单会标出每个不合法的值；保存之前，还会显示将这个包安装到服务器上时会安装哪些内容。

3. 按[用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)所述，将它安装到测试用的服务器中。
4. 提交更改，并按[用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)所述用标签发布新版本。

你以前发布的版本仍然保留各自的 `tooth.json`，lip 会继续安装它们。

## 另请参阅

- [`lip pkg migrate`](../reference/commands/pkg_migrate.md)
- [lip.toml](../concepts/lip_toml.md#早期格式)：lip 如何读取 `tooth.json`。
- [用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)
- [开发工具](../interface/tools.md)：界面中同样的操作，以及用于检查 `lip.toml` 的表单。
