# 安装与更新 Windows 版 LeviLauncher

## 在 PC 版 LeviLauncher 里下载 Minecraft 版本很慢，必须挂代理吗？

不需要。下载时可以选择国内的 xboxlive.cn 下载源（启动器会把 xboxlive.cn 镜像排在前面，也可以让启动器自动测速选源）；如果还是慢，换一个下载源即可。中国大陆用户默认开启“使用镜像源”，启动器更新、软件包和版本列表也会自动走国内镜像或 GitHub 代理。

*适用版本：LeviLauncher (Windows) 1.0.x 及以上*

## LeviLauncher（Windows）下载/安装游戏版本时提示“当前账户没有此版本的授权”（`ERR_LICENSE_NOT_ENTITLED`），怎么办？

LeviLauncher 需要正版 Minecraft 基岩版授权。在启动器中登录的微软账号必须拥有 PC 基岩版（如未购买，可前往 <https://www.xbox.com/en-US/games/store/minecraft/9nblggh537bl> 购买），仅在游戏里登录过 Xbox 但未购买 PC 基岩版是无法通过验证的。如果已购买但仍报错，可能是因为设备数量超限：一个微软账户最多只能在 10 台设备上登录微软商店，而启动器会被算作一台单独的设备。请前往 <https://account.microsoft.com/devices/content> 移除不需要的设备，并确认游戏购买在当前登录的账号下，然后重试。其他安装或启动问题请参考官方故障排查文档：<https://levimc.org/zh-Hans/LeviLauncher/guide/update-troubleshooting>。

*适用版本：LeviLauncher（Windows）1.0.0 及以上（启动器内微软账号登录）*

## 之前用微软官方启动器或商店装好的基岩版，能直接用 LeviLauncher 启动吗？

不建议直接接管。LeviLauncher 管理的是它自己安装的“实例”，推荐在 LeviLauncher 的“下载”页面重新安装一个相同版本（也可使用命令行 `LeviLauncher.exe install <版本或本地安装包文件>`）。

要保留存档和设置，可以在安装时选择复制现有游戏数据，或在安装后运行 `LeviLauncher.exe instance copy-data <实例> --from system`，将系统中同一通道（正式版/预览版）的原版游戏数据合并到该实例中（同名文件会被覆盖，但不会删除已有文件）。该方法适用于启用了独立数据（版本隔离）的 GDK 版实例。操作前仍建议先备份全部存档。

*适用版本：LeviLauncher（Windows）1.1.0*

## 安装 LeviLauncher 时弹出 Windows 管理员权限（UAC）提示，要允许吗？

要允许。LeviLauncher 安装程序默认安装到 `Program Files` 目录，需要管理员权限，拒绝授权将无法完成安装。请确保安装包来自官方渠道（GitHub Releases）。

此外，启动器在自更新（当安装目录不可写时）或通过 `doctor --fix` 安装 VC 运行库、GameInput 等组件时，也可能会请求管理员权限，确认来源可信后允许即可。

*适用版本：LeviLauncher（Windows）1.x*
