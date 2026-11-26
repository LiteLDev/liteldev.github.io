# lip config

读写配置。

## 概要

```
lip config get <KEY> [--workspace] [--json] [-h | --help]
lip config set <KEY> <VALUE> [--workspace] [-h | --help]
lip config list [--workspace] [--json] [-h | --help]
lip config delete <KEY> [--workspace] [-h | --help]
```

## 说明

`config` 组命令用于读写特定作用域的配置：

| 作用域 | 文件 | 键 |
| --- | --- | --- |
| 用户（默认） | 配置目录中的 `config.toml` | `github_proxy`、`language` |
| 工作区（带 `--workspace`） | 当前目录中的 `.lip/config.toml` | `restart` |

各键的说明与可选值见[配置](../configuration.md)。

`<KEY>` 必须属于所选作用域，否则命令失败。

| 命令 | 作用 |
| --- | --- |
| `lip config get <KEY>` | 输出 `<KEY>` 的值，或说明它没有值。不做任何更改。 |
| `lip config set <KEY> <VALUE>` | 把 `<KEY>` 设为 `<VALUE>`。如果 `<VALUE>` 不是该键接受的值，命令失败，且不做任何更改。 |
| `lip config list` | 输出该作用域的所有键及其值。不做任何更改。 |
| `lip config delete <KEY>` | 从文件中移除 `<KEY>`，使其恢复默认值；如果没有默认值，该键就不再有值。 |

`<VALUE>` 可以为空，在 shell 中写作 `""`，例如 `lip config set github_proxy ""`。这里的空值作为操作数传入；选项的值则永远不能为空。

`set` 和 `delete` 会重写该作用域的整个文件，只保留 `format = 4` 以及值不同于默认值的键。带 `--workspace` 时，如果 `.lip` 不存在，则会自动创建。这两个命令不获取工作区锁，因此在服务器运行时也可以使用。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--workspace` | 使用工作区配置（当前目录中的 `.lip/config.toml`），而非用户配置。 |
| `--json` | 用于 `get` 和 `list`：以 JSON 格式输出结果。 |
| `-h`、`--help` | 输出帮助信息并退出。 |

## 输出

`get` 和 `list` 将结果写入标准输出。`set` 和 `delete` 没有结果，它们的最后一行是写入标准错误的消息。

不带 `--json` 时，结果是一张便于阅读的表格。没有值的键显示为 `(not set)`，空值显示为 `(empty)`：

```
┌──────────────┬───────────┐
│ Key          │ Value     │
├──────────────┼───────────┤
│ github_proxy │ (not set) │
│ language     │ zh-Hans   │
└──────────────┴───────────┘
```

带 `--json` 时：

| 命令 | 结果 |
| --- | --- |
| `lip config get <KEY> --json` | 作为 JSON 字符串的值；键没有值时为 `null`。 |
| `lip config list --json` | 一个 JSON 对象，按上述格式将该作用域的每个键映射到对应的值。 |

```shell
lip config get restart --workspace --json
```

```json
"never"
```

```shell
lip config list --json
```

```json
{
  "github_proxy": null,
  "language": "zh-Hans"
}
```

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 命令成功。对没有值的键执行 `get` 也视为成功。 |
| 非 `0` | 用法错误、键不属于该作用域、值不被该键接受，或文件无法写入。 |

## 示例

通过代理发送 GitHub 请求，之后再恢复为每次询问：

```shell
lip config set github_proxy https://proxy.example.com/
lip config delete github_proxy
```

直接连接 GitHub，且不再通过界面询问：

```shell
lip config set github_proxy ""
```

设置界面语言：

```shell
lip config set language zh-Hans
```

让当前工作区的服务器在崩溃时自动重启：

```shell
lip config set restart on-failure --workspace
```

## 另请参阅

- [配置](../configuration.md)：所有配置键的说明。
- [配置 lip](../../guides/configuration.md)
- [设置](../../interface/settings.md)：界面中的对应设置。
