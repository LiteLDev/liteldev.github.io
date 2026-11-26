# Linux 与 macOS

读完本页，你将了解 lip 在当前系统上能运行哪些服务器、如何安装 lip、为运行服务器会下载什么并放在哪里，以及有哪些限制。各系统上的命令完全相同，详见[用命令行开服](https://levimc.org/zh-Hans/tutorials/server/command-line/)。

## 什么系统能运行什么

Minecraft 发布了 Windows 和 Linux 两种版本的服务器。模组所需的加载器 LeviLamina 只能加载到 Windows 服务器中，因此带模组的服务器一定是 Windows 服务器；在非 Windows 系统上，lip 通过 [Wine](https://www.winehq.org/) 运行它。

| 系统 | Windows 服务器，带或不带 LeviLamina | Linux 服务器，不带加载器 |
| --- | --- | --- |
| x64 的 Windows | 可以 | 不可以 |
| arm64 的 Windows | 可以。由 Windows 模拟 x64。 | 不可以 |
| x64 的 Linux | 可以，通过 lip 的 Wine | 可以 |
| x64 的 macOS | 可以，通过 lip 的 Wine | 不可以 |
| arm64 的 macOS（Apple 芯片） | 可以，通过 lip 的 Wine 和 Rosetta 2 | 不可以 |
| arm64 的 Linux，以及其他任何系统 | 不可以 | 不可以 |

lip 仅提供前五种系统的版本，没有 arm64 Linux 版：见[限制和已知问题](#限制和已知问题)。

无论运行在什么系统上，lip 安装的都是同一批为 x64 Windows 制作的包。在一种系统上安装好的服务器文件夹，可以直接搬到另一种系统上。

## 安装 lip

在 macOS 和 x64 的 Linux 上，使用安装脚本安装 lip：`curl -fsSL https://levimc.org/lip/install.sh | sh`。[安装](../install.md)页介绍了该脚本的操作、用于调整其行为的变量，以及如何用压缩包手动安装。

## 通过 Wine 运行 Windows 服务器

安装和运行服务器的方法与 Windows 上完全相同：

```sh
mkdir -p ~/servers/survival
cd ~/servers/survival
lip setup --game 1.26.50
lip run
```

无需自行安装 Wine。lip 自带一份 Wine，且绝不会调用其他的 Wine（如 `PATH` 里的 `wine`）。

### lip 下载什么放在哪里

lip 首次需要运行 Windows 程序时，会先准备好系统环境。这发生在 `lip setup` 安装 Windows 服务器时、某个包在安装过程中要运行自己的程序时，以及 `lip run` 启动 Windows 服务器之前。

| 内容 | 放在哪里 | 是否共用 |
| --- | --- | --- |
| **Wine**：适合你系统的一个构建，Linux 上来自 [Kron4ek/Wine-Builds](https://github.com/Kron4ek/Wine-Builds)，macOS 上来自 [Gcenx/macOS_Wine_builds](https://github.com/Gcenx/macOS_Wine_builds) | lip 数据目录下的 `wine/`：Linux 和 macOS 上都是 `$XDG_DATA_HOME/lip`，默认 `~/.local/share/lip` | 所有工作区共用。只下载一次。 |

服务器还需要 Microsoft Visual C++ 运行库。Wine 已自带一份，因此 lip 不会额外安装。

安装 Wine 时，lip 会提示：

```text
lip runs the server with Wine <version>, which it installs once for every workspace, into <directory>.
```

下载的文件会经过校验。每个版本的 lip 都通过 SHA-256 明确知道所需的文件。若校验不一致，下载的文件会被删除且不会被使用，命令也会在更改工作区之前失败。下载的压缩包在解压后即被删除。

这一步不需要 root 权限。

若想腾出空间，可以在 lip 未运行时删除数据目录。这不会丢失任何内容：lip 下次需要时会重新安装 Wine。

### Wine 前缀

Wine 将其“Windows”环境（注册表和 `C:` 盘）放在一个称为“前缀”的文件夹里。lip 为每个工作区分配独立的前缀，位于服务器文件夹下的 `.lip/wine`。Wine 首次在该工作区运行时会创建它，因此首次运行会稍慢一些。

前缀会随服务器文件夹一起移动。在服务器停止时，可以安全地删除 `.lip/wine`，Wine 之后会重新创建它。

若想使用其他前缀，请自行设置 `WINEPREFIX`，并对该工作区执行的每条 lip 命令都保持该设置：

```sh
export WINEPREFIX="$HOME/.wine-bedrock"
lip setup --game 1.26.50
lip run
```

### Apple 芯片的 macOS

lip 的 Wine 是 x64 程序，Apple 芯片的 Mac 通过 Rosetta 2 运行它。若缺少 Rosetta 2，lip 会在准备系统时、Wine 首次运行前安装它。安装 Rosetta 2 即表示接受 Apple 为其制定的软件许可协议，因此 lip 会先询问：

- 在终端里，lip 会说明即将安装 Rosetta 2、安装即代表接受该许可协议，并询问是否继续。界面则会在对话框里询问同样的问题。
- 加上 `--accept-rosetta-license` 时，lip 不会询问：传入该选项即表示你接受许可协议。`lip setup`、`lip install`、`lip update`、`lip uninstall` 和 `lip run` 均支持该选项，适用于脚本和无人值守的终端：

  ```sh
  lip setup --game 1.26.50 --accept-eula --accept-rosetta-license
  ```

- 如果 lip 无法询问（其输入或错误输出不是终端），且未传入该选项，命令就会失败。由 `lip run --managed` 启动且未带该选项的[托管服务器](../reference/commands/run.md#托管服务器)也是如此，因为它不会提问；而在界面中启动的服务器则由界面询问。

lip 会以运行它的用户身份执行 `softwareupdate --install-rosetta --agree-to-license` 来安装 Rosetta 2。若安装失败或你回答“否”，命令会失败并输出上述命令，方便你自行运行。较新的 macOS 安装 Rosetta 2 不需要管理员权限，但某些版本需要。安装完成后，重新运行 lip 命令即可。

## Linux 服务器

在 x64 的 Linux 上，lip 还能运行 Minecraft 的 Linux 服务器。它既不需要 Wine，也不依赖系统里的其他组件。由于没有加载器，它无法安装依赖 LeviLamina 的模组。

```sh
lip setup --game 1.26.50 --build linux
lip run
```

- `lip setup` 放置服务器文件，并将 `bedrock_server` 设为可执行。
- `lip run` 在工作区中启动 `bedrock_server`。若 `LD_LIBRARY_PATH` 未设置或为空，lip 会将其设为 `.`，以便服务器找到同目录下的库文件。
- 在 x64 Linux 以外的系统上，对以此方式安装的工作区运行 `lip run` 会失败，并提示你换到那种系统上运行，或改装为 Windows 服务器。

一个工作区只能安装一个游戏版本。在已装有 Windows 服务器的文件夹里安装 Linux 服务器会将其替换，反之亦然。见 [`lip setup`](../reference/commands/setup.md)。

## 环境变量

lip 从运行它的终端读取以下变量。

| 变量 | lip 怎么用它 |
| --- | --- |
| `WINEPREFIX` | Wine 前缀。未设置或为空时，lip 使用工作区里的 `.lip/wine`。 |
| `WINEDEBUG` | 传给 Wine。未设置时，lip 将其设为 `-all`，以隐藏 Wine 的调试信息。若想查看这些信息，可将其设为 `err+all` 等值。 |
| `WINEDLLOVERRIDES` | 传给 Wine。未设置时，lip 将其设为 `mscoree,mshtml=;winemac.drv,winex11.drv=d`，以禁用 Wine Mono、Wine Gecko 和 Wine 的图形驱动，使服务器无需桌面环境即可运行（例如通过 SSH）。 |
| `LD_LIBRARY_PATH` | 用于 Linux 服务器。未设置或为空时，lip 将其设为 `.`。 |
| `XDG_CONFIG_HOME` | 用户设置所在位置：`$XDG_CONFIG_HOME/lip`。默认 `~/.config`。 |
| `XDG_CACHE_HOME` | 下载缓存所在位置：`$XDG_CACHE_HOME/lip`。默认 `~/.cache`。 |
| `XDG_DATA_HOME` | Wine 的安装位置：`$XDG_DATA_HOME/lip`。默认 `~/.local/share`。 |
| `XDG_STATE_HOME` | 界面的工作区列表所在位置：`$XDG_STATE_HOME/lip`。默认 `~/.local/state`。 |
| `XDG_RUNTIME_DIR` | 守护进程的套接字所在位置：`$XDG_RUNTIME_DIR/lip/daemon.sock`。未设置时，套接字位于状态目录中。 |
| `HTTPS_PROXY`、`HTTP_PROXY`、`ALL_PROXY`、`NO_PROXY` | 网络代理。见[系统代理](configuration.md#系统代理)。 |
| `LC_ALL`、`LC_MESSAGES`、`LANG` | 界面的语言，除非 `language` 设置已指定语言。 |

未设置、为空或不是绝对路径的 `XDG_` 变量将采用默认值。macOS 使用与 Linux 相同的目录。

其他变量均会原样传给服务器和包的程序。

::: info
lip 的实际工作在后台进程（守护进程）中完成。但这并不影响哪些变量生效：每条命令使用的都是输入该命令的终端里的变量。[托管服务器](../reference/commands/run.md#托管服务器)则保留启动它的那个终端里的变量。
:::

## 限制和已知问题

- **不支持 arm64 的 Linux。** 已尝试的方案都无法在该平台上可靠地运行 LeviLamina 服务器：[Hangover](https://github.com/AndreRH/hangover) 能运行原版服务器，但无法运行经 LeviLamina 修改的服务器；[box64](https://github.com/ptitSeb/box64) 下的 x64 Wine 会丢失 Windows 程序的退出码；[FEX](https://fex-emu.com/) 下的 x64 Wine 在多次尝试中仅成功启动过部分次数的 LeviLamina 服务器。
- **其他系统没有 Wine。** 若所在系统没有 lip 提供的 Wine，所有需要运行 Windows 程序的操作都会失败，并提示 `lip runs the server with Wine on systems other than Windows, but has no Wine for <system>. Run the server on Windows, on Linux on x64 or on macOS.`
- **第一次启动很慢。** 首次启动需要下载并解压 Wine，还会创建前缀；后续启动会跳过这两步。
- **文件名不区分大小写。** 在 Windows 服务器的工作区中，lip 与 Wine 下的程序一样，会将 `Plugins/a.dll` 和 `plugins/a.dll` 视为同一个文件。如果文件夹中有两个仅大小写不同的名称，而 lip 需要唯一定位其中一个，命令就会失败。此时请将其中一个改名。
- **包命令里的引号。** Wine 会将 `"` 转义为 `\"` 传给 Windows 命令行，因此安装命令中含有 `"` 的包通过 Wine 运行时可能无法正常工作。请向包的作者反馈。
- **退出码是 Wine 的。** `lip run` 退出时会返回 `wine` 的退出码；若被信号终止，则返回 128 加上该信号的编号。
- **会改动下载内容的代理会让校验失败。** 如果下载的 Wine 文件 SHA-256 与预期不符，lip 会拒绝使用该文件。请稍后再试，或更换网络。
- **损坏的 Wine。** 如果连 `wine` 本身都无法运行，请删除数据目录中的 `wine/`，让 lip 重新安装。
- **旧版 lip 的文件夹。** 由早期版本 lip 为 `linux-x64` 平台创建的工作区，如果只安装了服务器，仍可继续使用，lip 会将其识别为 Linux 服务器；如果还安装了其他包，lip 会中止操作并说明它仅为 `win-x64` 安装包。此时请新建一个文件夹重新安装。

这些限制背后的原因见[内部机制](../concepts/internals.md#系统依赖)。
