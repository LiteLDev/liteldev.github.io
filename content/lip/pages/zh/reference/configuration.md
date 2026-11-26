# 配置

本页列出 lip 的全部设置：两个配置文件及其格式、各键的取值、默认值与作用，以及修改方法。

## 两个文件

| 作用域 | 文件 | 适用于 | 修改方式 |
| --- | --- | --- | --- |
| 用户 | [配置目录](files.md#配置目录)中的 `config.toml` | lip 执行的所有操作。 | `lip config ...` |
| 工作区 | 工作区中的 `.lip/config.toml` | 该工作区。 | 在工作区中运行 `lip config ... --workspace` |

配置目录在 Windows 上是 `%APPDATA%\lip`，在其他系统上是 `$XDG_CONFIG_HOME/lip`（默认为 `~/.config/lip`）。

每个作用域都有各自的键，互不通用：运行不带 `--workspace` 的 `lip config get restart` 会失败。

## 格式

两个配置文件均为 [TOML 1.0](https://toml.io/en/v1.0.0) 格式，包含 `format = 4` 和各自作用域的键：

::: code-group

```toml [config.toml]
format = 4
github_proxy = "https://proxy.example.com/"
language = "zh-Hans"
```

```toml [.lip/config.toml]
format = 4
restart = "on-failure"
```

:::

- 文件中未出现的键取默认值；若该键没有默认值，则此时**没有值**。
- 不属于该作用域的键会被忽略。
- 文件不存在、无法读取或内容无效时，均视为空文件，即该作用域的所有键都不存在。只要有一个键的值不被接受，整个文件即视为无效。
- 只有当你修改某个值时，lip 才会写入文件。写入时仅包含 `format` 和你设置过的键，省略处于默认值的键和没有值的键。
- 写入 `.lip/config.toml` 时，若 `.lip` 目录不存在则会自动创建。此操作无需加锁，因此在服务器运行时也可修改配置。

这两个文件的结构由 TOML 编写的 JSON Schema 描述：[`config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/config.schema.toml) 和 [`workspace-config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/workspace-config.schema.toml)。

## 用户配置

| 键 | 取值 | 默认值 |
| --- | --- | --- |
| `github_proxy` | 一个 URI，或空字符串。 | 无 |
| `language` | `en`、`zh-Hans` 或 `zh-Hant`。 | 无 |

### github_proxy

控制 lip 如何发送 **GitHub 请求**。这类请求是指发往 `github.com`，或发往以 `.github.com`、`.githubusercontent.com` 结尾的地址的 HTTPS 请求，涵盖 git 仓库操作、文件下载以及 lip 自身的发布和更新。

| 值 | 作用 |
| --- | --- |
| 一个 URI，例如 `https://proxy.example.com` | 对地址 U 的请求会发往该 URI 拼接 `/`（若 URI 已以 `/` 结尾则不加）和 U 后的地址，即 `https://proxy.example.com/https://github.com/…`。若经由代理请求失败，则会直接发往 U。若 URI 以 `/github.com` 或 `/https://github.com` 结尾（其后可带一个 `/`），读取时会去掉该后缀。 |
| 空字符串（`lip config set github_proxy ""`） | lip 直接向 GitHub 发送请求。 |
| 没有值（`lip config delete github_proxy`） | lip 直接向 GitHub 发送请求，且 `github_proxy` 处于**未配置**状态。 |

后两种情况仅在界面中有区别：当 `github_proxy` 未配置时，界面会在启动时检查能否连上 GitHub，连不上便会询问连接方式；只要该键有值（包括空字符串），界面就不再询问。

[`lip self-update`](commands/self_update.md) 获取发布列表和下载更新时也会使用此设置。

### language

[界面](interface.md)语言：`en` 为英文，`zh-Hans` 为简体中文，`zh-Hant` 为繁体中文。

没有值时，界面语言跟随系统：在 Windows 上取系统显示语言；在其他系统上，依次取 `LC_ALL`、`LC_MESSAGES` 和 `LANG` 中第一个指明了语言的变量。若系统语言既不是英文也不是中文，则界面使用英文。

`language` 仅影响界面，命令输出的消息和结果始终为英文。

## 工作区配置

| 键 | 取值 | 默认值 |
| --- | --- | --- |
| `restart` | `never` 或 `on-failure`。 | `never` |

### restart

控制工作区的服务器以非 0 退出码退出时是否重启。

| 值 | 作用 |
| --- | --- |
| `never` | 不重启服务器。 |
| `on-failure` | lip 输出一条消息，等待 5 秒后重新启动服务器；10 分钟内最多重启 5 次。由你主动停止的服务器不会重启。 |

服务器每次退出时 lip 都会重新读取 `restart`，因此可以在服务器运行期间修改该值。详见 [`lip run`](commands/run.md#重启)。

## 修改配置

可通过命令修改配置，详见 [`lip config`](commands/config.md)：

```shell
lip config list
lip config set github_proxy https://proxy.example.com/
lip config delete github_proxy
lip config set restart on-failure --workspace
```

若所设的值不被该键接受，`lip config set` 会执行失败，且不做任何更改。

在界面中，[设置](../interface/settings.md)页修改的也是这两个文件：

| 设置页中的项 | 键 | 等同于 |
| --- | --- | --- |
| 语言 | `language` | `lip config set language <value>`；**跟随系统**即 `lip config delete language`。 |
| GitHub 代理 | `github_proxy` | `lip config set github_proxy <URI>`；**直连**即设为空字符串；**重置**即 `lip config delete github_proxy`。 |
| 自动重启 | 当前工作区的 `restart` | 打开时为 `lip config set restart on-failure --workspace`，关闭时为 `never`。 |

当界面询问如何连接 GitHub 时，你的选择也会写入 `github_proxy`：填写代理会将其设为所填的 URI，选择**直接连接**会设为空字符串，选择**以后再说**则不做任何更改。

你也可以手动编辑这些配置文件，lip 会在命令需要时读取它们。

## liprc.json

lip v0.x 将配置保存在配置目录的 `liprc.json` 中。如果配置目录中没有 `config.toml` 但有 `liprc.json`，lip 会从中读取 `github_proxy` 并写入 `config.toml`，然后删除 `liprc.json`。该迁移仅在第一条命令读取配置前执行一次。

[试运行](cli.md#试运行)同样会读取 `liprc.json`，但不会写入 `config.toml`，也会保留 `liprc.json`。

## 另请参阅

- [`lip config`](commands/config.md)
- [配置 lip](../guides/configuration.md)：以指南形式呈现的相同内容。
- 界面中的[设置](../interface/settings.md)页。
- [文件](files.md)：这些文件在各系统上的位置。
