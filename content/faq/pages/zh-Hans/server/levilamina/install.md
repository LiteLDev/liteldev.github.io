# 在服务器上安装 LeviLamina

## LeviLamina

### 已经在运行的原版 BDS 服务器能否直接加装 LeviLamina？需要重装吗？

可以加装，存档无需重做，但 LeviLamina 与 BDS 版本严格绑定：每个 LeviLamina 版本只适配特定的 BDS 版本（例如 LeviLamina 26.60.8 依赖 BDS 1.26.60）。如果原版 BDS 版本不匹配，必须先换成 LeviLamina 支持的版本。

推荐做法：新建一个空文件夹，安装 lip 后在其中执行 `lip install LeviLamina`（会自动下载适配的 BDS、LeviLamina 以及 PreLoader、PeEditor、bedrock-runtime-data 等依赖，并由 PeEditor 生成 `bedrock_server_mod.exe`），或执行 `lip setup --game <BDS版本>` 指定游戏版本（会自动选择适配该版本的最新 LeviLamina）。接着将旧服务器的 `worlds/`、`server.properties`、`allowlist.json`、`permissions.json` 等文件复制过去，最后用 `lip run` 或双击 `bedrock_server_mod.exe` 启动。

不建议手动拼装（即手动放入 `bedrock_runtime_data`、PeEditor、LeviLamina 本体后再运行 PeEditor），这样容易遗漏依赖。

*适用版本：当前所有 LeviLamina 版本（lip 0.41.x 的 install/setup 语义）*

### 装好 lip 后，如何从零安装 LeviLamina 服务端（以及 LegacyScriptEngine）？

1. 安装 lip，新建一个空文件夹作为服务器目录，并在该目录下打开终端（cmd 或 PowerShell）。
2. 执行 `lip install LeviLamina`（等同于 `lip install github.com/LiteLDev/LeviLamina`）。lip 会自动下载 LeviLamina 支持的最新 BDS 并完成配置，期间需输入 yes 同意 Minecraft EULA（在脚本中可加上 `--accept-eula`）。也可以使用 `lip setup --game <版本>` 指定游戏版本。
3. 如需运行脚本插件，再安装 LSE：执行 `lip install github.com/LiteLDev/LegacyScriptEngine`（默认变体包含 QuickJS 和 Lua 引擎），或按需安装单个引擎，例如 `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` / `#python`。
4. 执行 `lip run` 或双击 `bedrock_server_mod.exe` 启动服务端。

网络较慢时，可执行 `lip config set github_proxy <URL>` 设置 GitHub 代理。不建议手动拼装服务端，以免遗漏语言包、CrashLogger 等依赖；重装时建议直接使用新的空文件夹。官方教程：<https://levimc.org/zh-Hans/tutorials/server/first-server/>。

*适用版本：LeviLamina 26.60.x；lip 0.41.x*

### 手动把多个插件/模组压缩包解压到服务器目录时，`README.md`、`CHANGELOG.md`、`LICENSE` 文件重名冲突，怎么处理？

`README.md`（说明）、`CHANGELOG.md`（更新日志）和 `LICENSE`（开源协议）都不是运行所需的文件，解压时可以忽略或直接删除，只保留插件本体文件即可。各个 LeviLamina 模组应分别放在独立的 `mods/<模组名>/` 子目录下（内含 `manifest.json`），这样一般不会发生冲突；LLSE 脚本插件则可放入 `plugins/` 目录（自 LSE 0.23.0 起该目录是指向 `mods/` 的链接，启动后会自动迁移插件并生成清单）。更推荐直接用 lip 安装，省去手动解压的麻烦。

*适用版本：当前所有版本（手动安装场景）*

### 运行 `bdsdown.exe` 时停在 Minecraft EULA / 隐私政策同意提示，输入 y 无效，并且 LeviLamina 提示与 BDS 协议版本不匹配，如何下载指定版本的 BDS？

可以通过命令行参数直接同意协议并指定下载版本：`bdsdown.exe -y --source version://windows/x.x.x.x`。将命令中的 `x.x.x.x` 替换为当前 LeviLamina 所适配的 BDS 完整版本号（即四段式完整构建号，可在 <https://levimc.org/LeviLamina/versions/> 查询，例如 LeviLamina 26.60.x 对应 1.26.60.6；注意 LeviLamina 的 `lip.toml` 中 `github.com/LiteLDev/bds` 依赖只写到了 1.26.60 三段）。

不过目前更推荐直接使用 lip：运行 `lip setup --game <游戏版本>`（在脚本中使用时可加上 `--accept-eula`），即可自动下载相互匹配的 BDS 和 LeviLamina。

*适用版本：bdsdown v1.x（当前 v1.2.1）*

## PreLoader 与 PeEditor

### LeviLamina 文件都放好了，但启动 BDS 时没有加载 LL（或启动就闪退），怎么回事？

手动安装时，需要在 BDS 目录下用命令行运行一次 `PeEditor.exe -m`（lip 安装时执行的是 `PeEditor.exe -mb`，会额外把原文件改名为 `bedrock_server.exe.bak`），从 `bedrock_server.exe` 生成 `bedrock_server_mod.exe`。之后必须启动 `bedrock_server_mod.exe` 而非原来的 `bedrock_server.exe`，才能经由 PreLoader 加载 LeviLamina。

更推荐直接用 lip 安装 LeviLamina（`lip setup` / `lip install LeviLamina`），它会自动安装 PreLoader、PeEditor 等依赖并完成修补，之后用 `lip run` 启动服务器即可。

*适用版本：LeviLamina 服务端当前所有版本*

### 手动安装 LeviLamina 时安装没完成（或 lip 安装失败后改手动），接下来该怎么做？启动后又提示缺少 `CrashLogger.exe` 怎么办？

手动安装时，需要在 BDS 目录运行一次修补程序 `PeEditor.exe`（`PeEditor.exe -m`），生成 `bedrock_server_mod.exe` 并用它启动，LL 才算装好。

启动后若提示找不到 `CrashLogger.exe`，需将 `CrashLogger.exe` 放到 LeviLamina 模组目录下（默认为 `mods/LeviLamina/CrashLogger.exe`）。该路径由 `mods/LeviLamina/config/Config.json` 中的 `modules.crashLogger.externalpath` 指定（相对于 LeviLamina 模组目录，默认值为 `CrashLogger.exe`）。若不需要外部崩溃日志，也可将 `crashLogger.enabled` 设为 `false`。

建议尽量用 lip 安装，它会自动装好 CrashLogger 等依赖；否则像 LSE NodeJS 这类依赖也得手动寻找。

*适用版本：LeviLamina 服务端当前版本（CrashLogger 1.4.x）*

### 用 lip 单独安装了 PeEditor，却没有 PreLoader，PeEditor 和 PreLoader 不是在一起的吗？

PeEditor 不等于 PreLoader：PeEditor 是把 PreLoader 注入游戏可执行文件的修补工具（用于生成 `bedrock_server_mod.exe` 或原地修补 `Minecraft.Windows.exe`），而 PreLoader 是运行时加载 LeviLamina 的库（`PreLoader.dll`）。二者是各自独立的 lip 包（`github.com/LiteLDev/PeEditor` 与 `github.com/LiteLDev/PreLoader`）。

请勿单独安装这些依赖，直接用 lip 安装 LeviLamina 本体即可，它会自动拉取 PreLoader、PeEditor、CrashLogger 等全部依赖并完成修补。

*适用版本：LeviLamina 当前所有版本*
