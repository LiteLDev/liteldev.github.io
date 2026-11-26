# LeviLamina 的报错与崩溃

## 服务器报错

### LeviLamina 启动时报错，原因是 `bedrock-runtime-data` 版本太老，怎么修复？是否需要升级 BDS？

这是因为服务器根目录下的 `bedrock_runtime_data` 数据与当前 LeviLamina 不匹配，并非 BDS 本身的问题（BDS 版本只需符合 LeviLamina 的要求即可）。`bedrock-runtime-data` 是 LeviLamina 的 lip 依赖（版本已精确固定）。你可以用 lip 重新设置游戏与加载器，从而自动安装匹配版本，例如运行 `lip setup --game 1.26.60 --loader levilamina@26.60.8`（注意：当前 lip 的 `lip update` 会拒绝对 LeviLamina/bds 执行操作，并提示改用 `lip setup`）；也可以从 <https://github.com/LiteLDev/bedrock-runtime-data> 的 release 下载 LeviLamina 的 `lip.toml` 所要求的版本，替换根目录下的 `bedrock_runtime_data` 文件夹。

*适用版本：当前所有版本（LeviLamina 26.60.8 依赖 bedrock-runtime-data 26.60.6-server.16）*

### LeviLamina 启动时模组无法加载，报依赖缺失（`... is missing` / `missing module`），是什么意思？

如字面意思所示：该模组声明的依赖模组未安装（`xxx will not be loaded because dependency yyy is missing`），或其 dll 依赖的某个 DLL/符号不存在（`missing module` / `missing content`）。请使用 lip 安装模组以自动补齐依赖（`lip install <包>`），或手动安装缺失的依赖模组/运行库。如果报的是 missing content（缺符号），通常是因为模组与当前 LeviLamina/BDS 版本不匹配。

### LeviLamina 日志报 `LOG FILE SINK: failed to archive ./logs/latest.log as ./logs\2026-10-28.log: The process cannot access the file because it is being used by another process., continuing in the new file` 是什么意思？

这表示按日期归档日志（将 `latest.log` 重命名为日期文件）时，另一个进程正在占用该文件，导致重命名失败。此时 LeviLamina 会继续写入新的日志文件，不影响服务器正常运行。请检查是否有其他程序（如日志查看器、面板或另一个服务端实例）打开了 `logs/latest.log`。

*适用版本：LeviLamina 26.x 当前版本*

### 启动 LeviLamina 服务器时控制台提示检测到另一个同路径的 BDS 进程（显示 PID），询问是否结束，这是什么意思，该怎么选？

这表示 LeviLamina 检测到同一路径下的 BDS（`bedrock_server.exe` / `bedrock_server_mod.exe`）已有进程在运行，继续启动会导致端口和存档被占用。控制台会提示 `Do you want to terminate the process with PID xxx? (y=Yes, n=No, e=Exit)`：输入 `y` 会结束旧进程并继续启动；输入 `n` 不处理旧进程并继续启动；输入 `e` 则退出当前启动。通常应选择 `y`，或先手动关闭另一个 BDS 窗口。这项检测默认开启，可在 LeviLamina 配置中通过 `checkRunningBDS` 关闭；在无控制台输入的环境（如作为服务运行）下会自动跳过。

*适用版本：LeviLamina 服务端当前版本*
