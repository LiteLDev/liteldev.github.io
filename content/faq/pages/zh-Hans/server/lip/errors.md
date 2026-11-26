# lip 的报错

## lip 安装包时反复失败（下载中断、缓存损坏等），如何清理 lip 缓存？缓存在哪里？

执行 `lip cache clean` 删除 lip 缓存后再重新安装（旧命令 `lip cache purge` 已移除），也可在 lip 自带界面的设置页点击 "Clear cache"。缓存位置与服务端或 lip 安装在哪个盘无关：Windows 上为 `%LOCALAPPDATA%\lip\Cache`，其他系统为 `$XDG_CACHE_HOME/lip`（默认 `~/.cache/lip`）。缓存只保存可重新下载的内容，清理不会影响服务端、已安装的包和配置；注意不要在其他 lip 命令正在下载时清理。新版 lip 会自动替换非有效 ZIP 的缓存文件，通常很少需要手动清理。

排查失败原因时，请查看命令输出的 error/hint 以及服务端目录 `.lip/logs/` 下的完整报告。配置项可用 `lip config set <键> <值>` 设置、`lip config list` 查看（如 GitHub 代理 `github_proxy`）。

*适用版本：lip 0.41.x*

## `lip install` 时包名带 `https://` 前缀（如 `https://github.com/...`）安装失败，怎么办？

Git 仓库形式的包标识不要带协议前缀。请去掉 `https://`，并检查路径大小写和拼写，例如 `lip install github.com/LiteLDev/LegacyScriptEngine`。lip 会把以 `https://` 开头的参数当作“ZIP 压缩包的下载地址”，而仓库网页地址不是 ZIP，因此会失败。

## 在 LeviLauncher 中右键更新已安装的 mod（显示有新版本）时报 `ERR_NO_UPDATE_SOURCE`（没有可用的更新源），怎么办？

`ERR_NO_UPDATE_SOURCE` 是 LeviLauncher 自身报出的错误：启动器无法将该已安装的 mod 唯一对应到模组目录中的某个 lip 包（未匹配到，或按名称匹配到了多个包），或者没有可用的目标版本，因此不知道从哪里更新。可先将 LeviLauncher 更新到最新版本；临时办法是在启动器的 LeviMC 模组（模组目录）页面中找到该 mod，直接重新安装新版本。

*适用版本：LeviLauncher（含 1.1.0 内置 lip 兼容包管理器）*

## 用 lip 安装 LeviLamina 时报错无法获取依赖（如获取不到 PreLoader 等依赖包）怎么办？

多半是访问 GitHub 失败。请先查看 lip 输出的 `error:`/`hint:` 行和 `.lip/logs/` 下的失败报告以判断原因。若访问 GitHub 较慢或被墙，可设置 GitHub 代理 `lip config set github_proxy <代理地址>`（该代理必须支持 git 仓库），或使用网络代理——lip 会优先读取终端的 `HTTPS_PROXY`/`HTTP_PROXY`/`ALL_PROXY` 环境变量，未设置时则使用系统代理（例如在 PowerShell 中执行 `$env:HTTPS_PROXY = "http://127.0.0.1:7890"` 后再运行 `lip install`）。若怀疑下载缓存损坏，可执行 `lip cache clean` 清理缓存后重试（注意不要在其他 lip 命令正在下载时清理）。

*适用版本：lip 0.40 及以上（新版 C# lip）*
