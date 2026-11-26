# 安装 lip 与部署服务器

## 用 lip 安装的插件/模组怎么卸载？直接删掉插件文件夹为什么不行？

在服务器目录执行 `lip uninstall <包>`。其中的包可以填写 `lip list` 显示的包标识（如 `lip uninstall github.com/LiteLDev/LegacyScriptEngine#lua`），也可以填写安装时的来源（如 `./package.zip`）；执行前可加上 `--dry-run` 预览将删除的内容。lip 会运行卸载钩子、删除该包所属的文件，并自动卸载不再需要的依赖。切勿直接手动删除文件夹：lip 在 `.lip/state.json` 中记录已安装的包，手动删除后 lip 仍认为该包已安装，此时再执行 `lip install` 安装同一版本也不会重装。如果已经手动删除，请先执行 `lip uninstall` 再执行 `lip install`。若重装后依然异常，可在新建的空目录中用 lip 纯净安装 LeviLamina 服务器，以此排查是服务端还是插件的问题。更多子命令可通过 `lip --help` 查看，或直接运行 `lip` 打开界面。

*适用版本：当前所有 lip 版本（状态文件路径为 lip v0.40+ 的 `.lip/state.json`）*

## lip 的 msi 安装包和直接下载 lip 可执行文件（zip）有什么区别？安装后怎么用？

两者功能没有区别。msi 是标准安装包，会自动将 lip 加入 PATH 环境变量，装好后可直接在命令行运行 `lip`，也能在“程序和功能”中卸载，适合不熟悉环境变量配置的用户；zip 是便携版，需要手动解压并放到 PATH 中的目录。两者都支持通过 `lip self-update` 更新（msi 安装的会通过 msiexec 静默更新）。安装后，在服务器文件夹中运行 `lip` 即可打开界面。

*适用版本：lip 0.41.x（Windows）*

## GitHub 访问不了，如何下载安装 lip？

lip 的安装包发布在 GitHub Releases：<https://github.com/LiteLDev/lip/releases/latest>（旧地址 `futrime/lip` 会自动跳转）。Windows 用户可下载 `lip-<版本>-win-x64.msi`（或 `-win-arm64.msi`，也提供 `.zip` 便携版），例如 <https://github.com/LiteLDev/lip/releases/download/v0.41.1/lip-0.41.1-win-x64.msi>。Linux 和 macOS 的安装脚本同样从 GitHub 下载，可通过 `LIP_GITHUB_PROXY` 环境变量传入 GitHub 代理（用法与 lip 的 `github_proxy` 配置相同）：`curl -fsSL https://levimc.org/lip/install.sh | LIP_GITHUB_PROXY=<代理URI> sh`，也可以手动下载对应的 `.tar.xz` 或 `.zip` 压缩包。

如果无法直接访问 GitHub，可以借助第三方 GitHub 加速镜像下载（在链接前加上镜像前缀，或将 `github.com` 替换为镜像域名）。安装完成后，可执行 `lip config set github_proxy <代理URI>`，让 lip 后续从 GitHub 下载时都走代理。

## LeviLamina 更新支持新版游戏后，用 lip 安装 LL 本体和 BDS 正常，但安装 LegacyScriptEngine 的 quickjs/nodejs/lua 等版本一再失败，怎么办？

先执行 `lip cache clean` 清理缓存，再重新安装，例如 `lip install LegacyScriptEngine#lua`。清理缓存不会丢失已安装的内容，lip 会重新下载所需文件；清理时请勿同时运行其他 lip 命令。如果仍然失败，请查看 `.lip/logs/` 下的失败报告；若提示游戏或加载器版本不兼容，说明该版本的 LSE 尚未适配当前的 LeviLamina，需等待 LSE 更新，或用 `lip setup` 切换到其支持的版本。

*适用版本：lip 0.41.x*

## 不小心在 plugins（或 mods）目录里执行了 lip 安装，结果下载了一大堆东西（甚至又下了一个服务端），该怎么办？

lip 会将当前工作目录视为工作区（即服务器文件夹），因此所有 lip 命令都应在服务器根目录下执行，不要在 mods、plugins 等子目录中运行。在子目录中执行 `lip install LeviLamina` 等命令，会在该子目录下再建一个服务端。处理方法：删掉子目录中误装的文件（包括其中的 `.lip` 文件夹），或在该子目录中运行 `lip uninstall` 卸载，然后回到服务器根目录重新执行安装命令。

## 如何用 lip 安装 LSE 的 Lua / QuickJS 等引擎？执行安装报错怎么办？

各语言引擎现在作为 LegacyScriptEngine 包的变体（variant）提供，安装时用 `#` 指定：

```shell
lip install LegacyScriptEngine#lua
lip install LegacyScriptEngine#quickjs
# 另有 #nodejs、#python
```

如果不指定变体（直接运行 `lip install LegacyScriptEngine`），则会同时安装 QuickJS 和 Lua 引擎。`LegacyScriptEngine` 是 `github.com/LiteLDev/LegacyScriptEngine` 的简写。安装前，工作区中需已装好服务端和 LeviLamina（可通过 `lip install LeviLamina` 或 `lip setup --game <版本>` 安装）。若遇到报错，请先运行 `lip self-update` 更新到最新版 lip，再执行 `lip cache clean` 清理缓存后重试，并查看 lip 输出的 error/hint 信息以及 `.lip/logs/` 下的失败报告。

*适用版本：lip 0.41.x；LegacyScriptEngine 0.23.x*

## 手动下载的 LeviLamina mod 启动时报缺少依赖/加载失败，以及在 BDS 1.21.70 等旧版本上如何安装对应版本的 mod？

手动下载的文件可能不完整或缺少依赖，建议改用 lip 安装，由其自动处理依赖。如需使用旧版 BDS，请先在服务器文件夹中运行 `lip setup --game 1.21.70` 搭好游戏和加载器（会自动安装适配该版本的最新 LeviLamina），再运行 `lip install <包>`，lip 会自动选择兼容当前工作区的最新版本。也可以去该 mod 的 GitHub Releases 页面查找适配目标 BDS 的版本号，用 `lip install <包地址>@<版本号>` 指定版本安装（例如 `lip install github.com/user/repo@1.2.0`）；执行前可加上 `--dry-run` 预览将要安装的内容。注意，前提是该 mod 发布过适配目标 BDS 的版本。

*适用版本：lip 0.41.x*

## 按 LeviLamina/LSE 安装文档执行 lip install 命令时，带 `@version` 的命令报错，该怎么写？

文档里 `<repo>@<version>` 中的 version 只是占位符，不能照抄。要安装最新版，直接把 `@version` 整个去掉，例如 `lip install github.com/LiteLDev/LegacyScriptEngine`（LiteLDev 的仓库也可简写为 `lip install LegacyScriptEngine`）。要安装指定版本，填写具体版本号，例如 `lip install github.com/LiteLDev/LegacyScriptEngine@0.23.1`（对应仓库的 `v0.23.1` 标签）。如需指定变体，把 `#变体` 写在 `@` 之前，如 `LegacyScriptEngine#lua@0.23.1`。

注意：在当前版本的 lip 中，`lip install LeviLamina` 或 `lip install LeviLamina@<版本>` 会按 `lip setup` 的方式一并装好匹配的 BDS（需同意 EULA）。如果已安装 LeviLamina 并想更换版本，请改用 `lip setup`。

## 用 `lip install github.com/LiteLDev/LegacyScriptEngine@版本号` 安装时，会不会把 LSE 的四个语言引擎都装上？版本号后需要带 `#` 吗？

版本号后不需要带 `#`。直接执行 `lip install github.com/LiteLDev/LegacyScriptEngine@版本号`（不指定变体）只会安装 QuickJS 和 Lua 两个引擎。Node.js 和 Python 引擎需单独指定变体安装，变体写在 `@` 之前：`lip install github.com/LiteLDev/LegacyScriptEngine#nodejs@版本号`、`lip install github.com/LiteLDev/LegacyScriptEngine#python@版本号`（不写 `@版本号` 则安装最新版）。

*适用版本：LegacyScriptEngine 0.17.x 及以后*

## 用 lip 下载/安装 LSE 的 NodeJS 引擎失败怎么办？

1. 将 lip 更新到最新版本：`lip self-update`。
2. 清理缓存后重试：`lip cache clean`。
3. 若 GitHub 访问慢或受阻，设置 GitHub 代理：`lip config set github_proxy <代理地址>`；或在终端设置系统 HTTP 代理环境变量（如在 PowerShell 中执行 `$env:HTTPS_PROXY = "http://127.0.0.1:端口"`），lip 会自动使用该代理。
4. 用当前包名重新安装：`lip install github.com/LiteLDev/LegacyScriptEngine#nodejs`（可简写为 `lip install LegacyScriptEngine#nodejs`）。注意，安装前需先用 `lip setup --game <版本>` 装好游戏与 LeviLamina；若该包此前已被显式安装，`lip install` 会拒绝执行，此时应改用 `lip update`，或先执行 `lip uninstall` 再重新安装。

若仍然失败，可查看终端里的 hint 以及 `.lip/logs/` 下的失败报告来定位原因。

*适用版本：lip 0.41.x 及以上*

## 用 lip 安装 BDS/LeviLamina 时会卡在需要同意 Minecraft 用户协议（EULA）的步骤吗？写一键安装脚本时有没有跳过同意的参数？

会询问。当前 lip 在安装游戏（BDS）时，会列出 Minecraft EULA 和 Microsoft 隐私政策链接，并要求输入 `yes` 才继续；在脚本等非交互终端中，不加参数会直接失败。编写脚本时加上 `--accept-eula` 即可跳过询问，例如：

```shell
lip setup --game 1.21.0 --loader levilamina@1.0.0 --accept-eula
```

或执行 `lip install LeviLamina github.com/user/repo --accept-eula`（当 install 以 setup 方式执行时生效）。每次安装游戏都会重新询问，同意结果不会被记录。

*适用版本：lip 0.41.x 及以上*

## 用 lip 安装 LeviLamina 或插件失败，lip 应该在哪个目录运行？安装 LSE 需要逐个装依赖吗？

lip 以当前工作目录作为工作区，必须在服务端根目录（即 `bedrock_server.exe` 所在目录）下运行，且没有指定其他目录的选项；lip 程序本身可以放进 PATH。新建服务端时，请在空文件夹中执行 `lip setup --game <版本>`（或 `lip install LeviLamina`）。

安装 LegacyScriptEngine 只需安装本体（如 `lip install LegacyScriptEngine#lua`），LegacyRemoteCall 等其他依赖会自动解析并安装。但 `lip install` 不会安装或更换游戏与 LeviLamina，因此必须先用 `lip setup` 装好符合 LSE 版本约束的 LeviLamina，否则命令会失败并提示运行 `lip setup`。安装 LeviLamina 时会自动运行 PeEditor 生成 `bedrock_server_mod.exe`。在脚本中需要免交互执行时，请使用 `--accept-eula`（新版 lip 已移除 `-y` 参数）。

*适用版本：lip 0.41.x 及以上*

## 用 lip 安装/升级 LeviLamina 时中途中断（目录里残留 `bdsdown.exe` 等），或在已有旧服务端文件的目录安装后无法开服，应该怎么正确安装和升级？

新建服务端：在空文件夹中执行 `lip setup --game <版本>`（或 `lip install LeviLamina`），再用 `lip install` 安装所需的 mod，然后将旧服的 `worlds/`、`server.properties`、`allowlist.json`、`permissions.json` 以及各 mod 的配置文件复制过来。无需保留旧的 `bedrock_server_mod.exe`，安装 LeviLamina 时会重新生成。

升级：对于已由 lip 管理的服务端，直接在该目录下执行 `lip setup --game <新版本>`，世界存档与上述配置文件都会保留；与新版本不兼容的 mod 会被列为 left-out，并询问是否卸载。

中断恢复：当前 lip 的安装是原子操作，中途中断后，下一次执行 `lip setup/install/update/uninstall/run` 时会自动撤销或完成上次操作，无需手动删除残留文件（切勿删除 `.lip/journal` 和 `.*.bak`）。

若无法开服，请先查看服务端输出和 `logs\latest.log`（常见原因如端口被占用、mod 加载失败）。

*适用版本：lip 0.41.x；LeviLamina 26.x*

## 用 lip 安装完 LeviLamina 后，用哪个文件启动服务器？

安装了 LeviLamina 的服务器需要运行 `bedrock_server_mod.exe`（安装时由 PeEditor 从 `bedrock_server.exe` 生成），不要运行原版 `bedrock_server.exe`。使用新版 lip 时，也可以直接在服务器目录下执行 `lip run`（或在 lip 界面的服务器页面点击启动），安装了加载器时它会自动运行 `bedrock_server_mod.exe`。

## 能否用 lip 单独更新 BDS 本体？

可以。BDS 在 lip 中对应包 `github.com/LiteLDev/bds`（即工作区的“游戏”）。在服务器目录执行 `lip setup --game <版本>`（如 `lip setup --game 1.26.60`）即可切换到指定的 BDS 版本。lip 会同时选用适配该版本的最新 LeviLamina（也可加 `--loader levilamina@<版本>` 指定版本，或加 `--no-loader` 只装原版），并将其他模组一并切换到兼容版本；世界、`server.properties`、`allowlist.json` 和 `permissions.json` 均会保留。可加 `-n`（`--dry-run`）先预览将要发生的变更。注意，`lip install` 和 `lip update` 不能直接更新 BDS，执行后会提示改用 `lip setup`。

*适用版本：lip 0.41.x*

## 能用 lip 把 LeviLamina 更新到开发分支的最新 commit 吗？

不能以此获取未发布的开发构建。lip 通过 `lip setup --loader levilamina@<已发布版本>` 安装或切换 LeviLamina（加载器），或在 `lip install` 不带 ref 或带版本号时将其作为加载器安装。虽然 `lip install` 支持 `@branch:<名>` 和 `@rev:<commit>` 引用，但 LeviLamina 的 `lip.toml` 资源地址指向 GitHub Release 的发布包，从分支拉取到的仍是已发布版本的构建。若要使用最新提交的构建，只能从 LeviLamina 仓库的 GitHub Actions（build 工作流）下载产物并手动替换。注意，LeviLamina 的默认分支现为 `main`（已无 `develop` 分支）。

*适用版本：LeviLamina 26.x；lip 0.41.x*
