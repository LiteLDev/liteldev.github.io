# lip cache clean

删除缓存。

## 概要

```
lip cache clean [-h | --help]
```

## 说明

`lip cache clean` 会删除[缓存目录](../files.md#缓存目录)：在 Windows 上为 `%LOCALAPPDATA%\lip\Cache`，在其他系统上为 `$XDG_CACHE_HOME/lip`（默认为 `~/.cache/lip`）。

缓存只存放 lip 下载过且可重新下载的内容。工作区、已安装的包和配置都不受影响。lip 安装的 Wine 位于数据目录而非缓存中，因此也会保留。

如果此时有其他 lip 命令正在写入缓存，这些命令可能会失败。请在没有其他 lip 命令运行时执行 `lip cache clean`。

## 选项

| 选项 | 说明 |
| --- | --- |
| `-h`、`--help` | 输出帮助并退出。 |

## 输出

`lip cache clean` 没有输出结果，不会向标准输出写入任何内容。最后一行是输出到标准错误的消息。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | 缓存已删除。 |
| 非 `0` | 用法错误，或无法删除该目录。 |

## 示例

```shell
lip cache clean
```

## 另请参阅

- [文件](../files.md#缓存目录)：缓存的内容。
- [设置](../../interface/settings.md)：界面中的**清理缓存**。
- [故障排除](../../guides/troubleshooting.md)
