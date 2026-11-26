# lip list

列出已安装的包。

## 概要

```
lip list [--json] [-h | --help]
```

## 说明

`lip list` 读取工作区的[状态文件](../../concepts/state_file.md)，将已安装的包按 `<identity>@<version>` 格式分为两组输出：

1. **显式安装**的包：由你指定安装的包，包括游戏和加载器；
2. **依赖包**：为满足其他包的需求而安装的包。

显式安装的包排在前面。每组内部按安装顺序排列，每个包都排在它所依赖的包之后。

包的**身份**即其包 ID；如果安装的不是默认变体，末尾还会附上 `#<variant>`，例如 `github.com/LiteLDev/LegacyScriptEngine#lua`。[`lip uninstall`](uninstall.md) 接受的参数正是这个身份。

`lip list` 不会修改任何内容，也不会获取任何锁，因此在其他命令或服务器运行时也可正常使用。如果工作区没有状态文件，两组都会为空。lip v0.x 的工作区没有状态文件，但有 `tooth_lock.json`，此时会直接读取该文件列出包，且不会修改它。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--json` | 以 JSON 格式输出结果。 |
| `-h`、`--help` | 输出帮助信息并退出。 |

## 输出

结果会写入标准输出。不带 `--json` 时，输出两棵供人阅读的树：

```
User-Requested
├── github.com/LiteLDev/bds@1.21.0
├── github.com/LiteLDev/LeviLamina@1.0.0
└── github.com/LiteLDev/LegacyScriptEngine#lua@0.9.0
Dependencies
└── github.com/LiteLDev/LegacyRemoteCall@0.9.0
```

空的组会显示为 `None`。这种排版今后可能会变动；在脚本中请使用 `--json`。

带上 `--json` 时，输出一个仅包含以下字段的 JSON 对象：

```json
{
  "ExplicitInstalled": [
    "github.com/LiteLDev/bds@1.21.0",
    "github.com/LiteLDev/LeviLamina@1.0.0",
    "github.com/LiteLDev/LegacyScriptEngine#lua@0.9.0"
  ],
  "ImplicitInstalled": [
    "github.com/LiteLDev/LegacyRemoteCall@0.9.0"
  ]
}
```

| 成员 | 值 |
| --- | --- |
| `ExplicitInstalled` | 由 `<identity>@<version>` 字符串组成的数组，表示显式安装的包。 |
| `ImplicitInstalled` | 由 `<identity>@<version>` 字符串组成的数组，表示依赖包。 |

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 列表已输出。 |
| 非 `0` | 用法错误，或无法读取状态文件。 |

## 示例

列出包：

```shell
lip list
```

在脚本中用 [jq](https://jqlang.org/) 获取显式安装的包：

```shell
lip list --json | jq -r '.ExplicitInstalled[]'
```

## 另请参阅

- [管理包](../../guides/managing_packages.md)
- [模组](../../interface/mods.md)：界面中的已安装模组。
- [状态文件](../../concepts/state_file.md)
