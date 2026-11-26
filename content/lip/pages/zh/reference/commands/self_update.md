# lip self-update

把 lip 自身更新到最新发布的版本。

## 概要

```
lip self-update [--check] [-h | --help]
```

## 说明

`lip self-update` 会查找 lip 的最新发布；如果比正在运行的 lip 新，就按 lip 当初的安装方式安装它。

### 检查

lip 从仓库 `https://github.com/LiteLDev/lip.git` 的标签读取 [lip 的发布](https://github.com/LiteLDev/lip/releases)，方式与读取其他包的版本相同：每个 `v` 加 SemVer 版本的标签代表一个发布，其他标签会被忽略。

**最新发布**即版本最高的发布。像 `1.1.0-beta.1` 这样的预发布版本，只有在正在运行的 lip 本身也是预发布版本时才会纳入比较。

如果没有任何发布，或者最新发布不比正在运行的 lip 新，lip 会输出它已是最新，不做任何更改。若指定了 `--check`，无论哪种情况，lip 都到此为止。

### 安装类型

| 类型 | 含义 | lip 如何得知 |
| --- | --- | --- |
| `msi` | lip 是由 Windows 安装程序 `lip-<version>-<platform>.msi` 安装的。 | `lip` 可执行文件旁边的 `install.json` 文件由安装程序写入，内容为 `kind` 是 `"msi"` 的 JSON 对象。 |
| `portable` | lip 是从归档中解压出来的，或以其他任何方式安装的。 | 没有 `install.json`。 |

对于 `msi` 类型，**安装范围**表示安装程序是为谁安装的 lip：`user` 为运行安装程序的用户，`machine` 为所有用户。它由 `install.json` 的 `scope` 成员指定：`{"kind": "msi", "scope": "user"}` 或 `{"kind": "msi", "scope": "machine"}`。若没有该成员（早期安装程序写入的是 `{"kind": "msi"}`），安装范围为 `machine`。

如果 `install.json` 存在，但内容不是 JSON 对象，或者不满足 `kind` 为 `"msi"` 且无 `scope`（或 `scope` 为 `"user"` 或 `"machine"`），`lip self-update` 就会失败。

`<platform>` 是 lip 运行所在的系统：`win-`、`linux-` 或 `osx-`，后接 `x64` 或 `arm64`。在其他系统上，`lip self-update` 会在做出任何更改前失败。

### 更新

未指定 `--check` 且存在更新的发布 `V` 时，lip 依次执行以下步骤：

1. 读取安装类型和安装范围。
2. 选定发布中要安装的文件。在 Windows 以外的系统上，类型 `msi` 会失败。

   | 类型 | 文件 |
   | --- | --- |
   | `msi` | `lip-V-<platform>.msi` |
   | Linux 上的 `portable` | `lip-V-<platform>.tar.xz` |
   | Windows 和 macOS 上的 `portable` | `lip-V-<platform>.zip` |

3. 清空并创建[缓存目录](../files.md#缓存目录)中的 `self-update` 目录。
4. 从 `https://github.com/LiteLDev/lip/releases/download/vV/<文件>` 将文件下载到 `self-update` 中。若下载失败（例如发布中还没有这个文件），命令失败。
5. 按安装类型安装该文件，详见下文。

第 1 到 4 步若失败，不会更改安装目录中的任何文件。

**`msi`。** lip 启动 `msiexec /i <file> /qn /norestart`。安装范围为 `machine` 时，lip 以管理员身份启动它，Windows 会请求你允许；安装范围为 `user` 时，lip 以当前用户身份启动它，Windows 不会询问。如果你拒绝，或者 `msiexec` 未能启动，命令失败。否则，lip 会输出安装程序正在运行，并立即以退出码 0 退出，不等待其结束。安装程序会在后台静默替换 lip，不会重启 Windows。请关闭其他正在运行的 `lip` 进程，以便安装完成。

**`portable`。** lip 将归档解压到 `self-update` 中，然后逐个替换 lip 所在目录中的文件：先把每个已有文件改名为 `<file>.old`，再在原位置写入新文件。若任一步骤失败，lip 会把所有改过名的文件恢复原样，然后报错退出。所有文件写入完毕后，lip 会删除可删除的 `.old` 文件和 `self-update` 目录。

- 目录中不在归档内的文件会保留。
- 在 Windows 上，正在运行的 `lip.exe` 无法删除，因此会留下 `lip.exe.old`，由下次启动的 `lip` 删除。
- 在 Linux 上，解压 `.tar.xz` 归档需要系统装有 `tar` 和 `xz`。

### 更新之后

如果这次更新替换了 lip 或启动了安装程序，执行更新的[守护进程](daemon.md)会在空闲后退出，以便下一条命令启动新版本。如果守护进程仍在运行托管服务器，则会继续运行；参见[更新之后](daemon.md#更新之后)。

正在运行的界面仍是旧版本。在界面的[设置](../../interface/settings.md)页通过**安装更新**完成更新后，界面会提示你退出 lip 并重新运行（若启动的是安装程序，则提示退出 lip 以完成安装），并提供**退出 lip**和**以后再说**两个按钮。界面关闭后，lip 会在标准错误输出一行提示，例如 `lip 已更新到 1.1.0。请再次运行 lip 以启动新版本。`

### 网络

配置了 [`github_proxy`](../configuration.md#github-proxy) 时，标签和更新文件都会通过该代理获取，代理失败时再直接连接 GitHub。lip 不读取 `SHA256SUMS`，也不访问 GitHub API。代理可能会篡改 lip 安装的内容，请仅使用你信任的代理。

## 选项

| 选项 | 说明 |
| --- | --- |
| `--check` | 只查找最新发布。不安装任何内容，也不做任何更改。 |
| `-h`、`--help` | 输出帮助并退出。 |

## 输出

只有 `lip self-update --check` 会产生标准输出。存在更新的发布时，标准输出会收到该版本号和一个换行：

```
1.1.0
```

lip 已是最新时，标准输出为空。其余消息均写入标准错误。

因此，脚本应根据标准输出是否为空来区分这两种情况，而不是根据退出码。

## 退出状态

| 退出码 | 含义 |
| --- | --- |
| `0` | lip 已是最新；或 `--check` 已完成（无论是否存在更新的发布）；或更新已安装；或安装程序已启动。 |
| 非 `0` | 用法错误，或检查、更新失败。 |

## 示例

检查是否有新版本：

```shell
lip self-update --check
```

更新 lip：

```shell
lip self-update
```

在 POSIX shell 脚本中，仅当有新版本时才更新：

```shell
if [ -n "$(lip self-update --check 2> /dev/null)" ]; then
  lip self-update
fi
```

## 另请参阅

- [开你的第一个服务器](https://levimc.org/zh-Hans/tutorials/server/first-server/)：安装 lip。
- [设置](../../interface/settings.md)：界面中的**检查更新**。
- [文件](../files.md#安装目录)：`install.json` 和 `.old` 文件。
