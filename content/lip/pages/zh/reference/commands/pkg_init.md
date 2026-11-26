# lip pkg init

在当前目录中为新包创建 `lip.toml`。

## 概要

```
lip pkg init [-h | --help]
```

## 说明

`lip pkg init` 会询问包 ID，然后在当前工作目录中生成 `lip.toml`。

1. 如果当前目录中已有 `lip.toml`，命令将失败，不写入任何内容。
2. lip 会在终端中提示输入包 ID（即 [Go 模块路径](https://pkg.go.dev/golang.org/x/mod/module#CheckPath)，例如 `github.com/user/repo`）；若输入无效，会持续重新提示。对于位于 git 仓库中的包，包 ID 就是仓库路径。
3. 随后写入[包文件](../../concepts/lip_toml.md)，其内容仅包含以下字段（其中 `<id>` 为你输入的包 ID）：

   ```toml
   format = 4
   id = "<id>"
   version = "0.1.0"

   [[variants.""]]
   side = "server"
   platform = "win-x64"
   ```

当标准输入或标准错误不是终端时，lip 无法进行交互提问，命令会失败。该命令不提供用于指定包 ID 的选项；在脚本中请直接自行编写 `lip.toml`。

此时生成的包还不会安装任何内容。关于还需添加哪些配置，请参见[用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)。

`lip pkg init` 不属于工作区操作：它无需服务器，不获取任何锁，除 `lip.toml` 外不会修改任何其他内容。

## 选项

| 选项 | 说明 |
| --- | --- |
| `-h`、`--help` | 输出帮助并退出。 |

## 输出

`lip pkg init` 没有输出结果，不会向标准输出写入任何内容。交互提示和末尾的完成提示均作为消息输出到标准错误：

```
Enter the package id of the package (a Go module path, e.g. github.com/owner/repo):
```

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | `lip.toml` 已写入。 |
| 非 `0` | 用法错误、`lip.toml` 已存在、lip 无法交互提问或文件无法写入。 |

## 示例

```shell
cd MyMod
lip pkg init
```

## 另请参阅

- [用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)
- [lip.toml](../../concepts/lip_toml.md)
- [开发工具](../../interface/tools.md)：图形界面中的**创建 lip.toml**表单，可生成完整的 `lip.toml`，支持边输入边校验，后续也可用于编辑该文件。
