# lip pkg migrate

将当前目录中 lip v0.x 的 `tooth.json` 迁移为 `lip.toml`。

## 概要

```
lip pkg migrate [-h | --help]
```

## 说明

`lip pkg migrate` 会把当前工作目录中的 `tooth.json` 转换为[包文件](../../concepts/lip_toml.md)，写入该目录的 `lip.toml`，然后删除 `tooth.json`。请在包仓库的根目录中运行此命令。

在下列情况下，命令会失败且不做任何更改：

- `lip.toml` 已存在；
- `tooth.json` 不存在；或
- `tooth.json` 不是 lip 能读取的格式版本 1、2 或 3。

转换规则如下：

- `tooth` 变为 `id`。`version` 和 `info` 原样保留；`info.avatar_url` 以 `https://` 开头时变为 `info.logo`，否则丢弃。
- 每个标签变为一个变体。对于适用该标签的每个平台（RID），该标签下的变体按 lip v0.37.0 的方式合并：若合并后依赖 `github.com/LiteLDev/LeviLamina#client`，则生成一个客户端条目；若依赖 `github.com/LiteLDev/LeviLamina` 的其他变体，则生成一个服务端条目；若不依赖 LeviLamina，则为每个运行端各生成一个条目。
- LeviLamina 从 26.60.8（首个带 `lip.toml` 的版本）起不再有 `client` 变体，其 `""` 变体在每个运行端下各有一个条目。因此，对于 `github.com/LiteLDev/LeviLamina#client`（或 `#client_<y>`）依赖，只要版本范围包含 26.60.8 或更高版本，并且该条目尚未依赖 `github.com/LiteLDev/LeviLamina`（或 `#<y>`），就会改为依赖后者，同时版本范围收窄到不低于 26.60.8 的部分；不包含此类版本的范围保持不变。随后，标签 `client`（或 `client_<y>`）中现已依赖 LeviLamina 的客户端条目会移入 `""`（或 `<y>`）变体，除非目标变体中已有同平台的客户端条目。每处此类改动都会输出一条警告。
- 每个条目的转换方式与 lip 读取[早期格式](../../concepts/lip_toml.md#早期格式) `tooth.json` 时相同：`dependencies` 变为 `deps`；资源保留 `type` 和 `urls`，其 `placements` 变为 `place`；`preserve_files` 变为 `preserve`；`remove_files` 变为 `purge`；脚本变为 `hooks`。在 `lip.toml` 中无效的放置规则和模式会被略去。
- 如果某平台合并后的变体含有 `tar`、`tgz` 或 `uncompressed` 类型的资源，则不会为该平台生成条目，因为 `lip.toml` 不支持这些资源类型。
- [模板](../../concepts/lip_toml.md#模板)会保留。像 `https://example.com/v{{version}}/tool.zip` 这样的值（在格式 1 和 2 中为 `$(version)`）仍写为相同模板，其中 `{{tooth}}`（在格式 1 和 2 中为 `$(path)`）会改名为 `{{id}}`。在 `lip.toml` 中会渲染为不同值的模板，则直接写入渲染后的值。

### 询问

`lip.toml` 不支持平台模式，每个条目只指定一个平台。当结果所需的某个值缺失或无效时，lip 会在终端上反复询问，直到输入有效为止。它会询问：

- `win-*` 这类模式所代表的平台（RID）；
- 非 RID 的 `platform`（如 `windows/amd64`）所代表的平台；
- 未指定 `platform` 的变体适用于哪些平台；以及
- 无效的依赖版本范围。

如果标准输入或标准错误不是终端，命令会失败，指出本需询问的值，且不做任何更改。

### 警告

所有被丢弃的内容，以及转换后含义有变的内容，都会以警告形式输出，并指明来源字段（按格式 3 的写法）。警告不会导致命令失败。

转换结果只是一个起点。发布前请先检查；[迁移包](../../authors/migrating_packages.md)列出了需要检查的地方。

`lip pkg migrate` 不是工作区操作。

## 选项

| 选项 | 说明 |
| --- | --- |
| `-h`、`--help` | 输出帮助并退出。 |

## 输出

`lip pkg migrate` 没有输出结果，不会向标准输出写入任何内容。提问、警告和最后一行提示均写到标准错误。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 已写入 `lip.toml` 并删除 `tooth.json`（无论是否有警告）。 |
| 非 `0` | 用法错误；`lip.toml` 已存在；`tooth.json` 不存在或无法读取；或 lip 无法询问所需的值。未做任何更改。 |

## 示例

```shell
cd MyTool
lip pkg migrate
```

## 另请参阅

- [迁移包](../../authors/migrating_packages.md)
- [开发工具](../../interface/tools.md)：界面中的**迁移 tooth.json**。
- [lip.toml](../../concepts/lip_toml.md#早期格式)
