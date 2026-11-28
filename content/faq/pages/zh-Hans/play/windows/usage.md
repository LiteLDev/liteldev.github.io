# Windows 版 LeviLauncher 的功能与设置

## 为什么我无法登录/切换账号？

请不要以管理员启动启动器。  
启动器默认调用系统账号选择器登录，此时管理员权限将被系统拒绝；若以管理员身份启动，则将自动改用 Xbox 账号管理进行登录。

## GitHub 上已经发布了 LeviLauncher 新版本，为什么启动器内“检查更新”检测不到？

GitHub 上标记为 Pre-release（测试版）的版本（如 `1.1.0-beta.x`），需要在启动器“设置 → 软件更新”中开启“接收测试版更新”后才会推送。正式版（当前最新为 v1.1.0）则会直接推送。你也可以前往 <https://github.com/LiteLDev/LeviLauncher/releases> 手动下载。

*适用版本：LeviLauncher 1.x（Windows 版）*

## LeviLauncher 下载游戏版本时看不到进度、长时间没反应，是卡死了吗？

点击“下载”页面右上角的云形下载图标即可打开“下载管理”页，查看和管理当前的下载任务。下载进行时，该图标会高亮并带有红点。只要没有报错，一般说明仍在下载，只是速度较慢。如果下载过慢或反复失败，可以在下载时测速并切换镜像源，或在设置中开启“使用镜像源”；也可以稍后重试，或改用本地安装包导入。

*适用版本：LeviLauncher 1.x（Windows 版）*

## LeviLauncher 中对未开启版本隔离的版本点“删除实例/删除版本”，会不会把存档等游戏数据全部删掉？

不会。删除实例只会删除启动器实例目录中该实例的文件夹（1.1.0 默认路径为 `%LOCALAPPDATA%\LeviLauncher\Instances\<实例名>`，若设置了自定义数据目录则位于该目录下，旧版为 `versions` 目录；UWP 实例还会先注销包；游戏运行时会拒绝删除），不会删除未隔离版本共享的默认游戏数据（存档、资源包等）。注意：开启了版本隔离的实例会将数据保存在自己的工作区中，删除实例会将其一并删除，请提前备份重要世界。

*适用版本：当前所有版本（LeviLauncher 1.1.0 起实例目录位于 `%LOCALAPPDATA%\LeviLauncher\Instances`）*

## LeviLauncher 中已下载的版本安装包如何删除？找不到删除按钮。

在“下载”页面中，已下载版本的右侧会显示“安装”按钮组。点击旁边的下拉箭头，选择“删除安装包”并确认即可，无需手动打开目录删除。

*适用版本：当前所有版本（LeviLauncher 1.1.0 已验证）*

## 使用 LeviLauncher 必须拥有正版 Minecraft 基岩版吗？能否离线/不买正版使用？

必须拥有正版。LeviLauncher 仅支持正版 Minecraft 基岩版，无法绕过正版验证，也不提供类似 Java 版的“离线模式”。

- Windows 版：下载和安装游戏时，启动器需要通过微软账号向微软获取游戏许可证。请在启动器中登录已购买游戏的账户（点击头像或运行 `LeviLauncher.exe account login`）。若该账户未购买游戏，会报错 `ERR_LICENSE_NOT_ENTITLED`；若只有试用许可证，则会报错 `ERR_LICENSE_FULL_REQUIRED`（无法安装正式版）；未取得正版授权时，游戏将以试玩模式运行。游戏内的 Xbox 登录仍在游戏内进行。
- Android 版：需要从 Google Play 购买并安装正版基岩版。

项目坚持正版验证。非官方渠道的启动器或来路不明的安装包不受支持，官方社区也不受理盗版问题。官方下载渠道：<https://github.com/LiteLDev/LeviLauncher/releases> 或文档站 <https://levimc.org/zh-Hans/LeviLauncher/>。

*适用版本：当前所有版本（Windows v1.1.0、Android v1.7.1）*

## LeviLauncher 可以启动 BDS（基岩版专用服务器）吗？

不能。LeviLauncher 是客户端启动器，仅用于安装、管理和启动 Minecraft 基岩版客户端（Windows 平台的 GDK / UWP 版及 Android 版）并加载客户端模组，与开服无关。搭建 BDS 服务器请使用 LeviLamina 服务端方案（例如用 lip 安装 LeviLamina，或使用 docker-levilamina-server 镜像）。

## Windows 版 LeviLauncher 怎么导入 `.mcpack` / `.mcaddon` / `.mcworld` 资源包、材质包、皮肤包或地图？

- 方法一：在“启动”页进入“内容管理”（或对应的资源包/行为包/皮肤包/世界页面），将 `.mcpack` / `.mcaddon` / `.mcworld` 文件直接拖入窗口（界面提示“拖入 .mcworld/.mcpack/.mcaddon 以导入”），然后按提示选择目标实例；若导入的是世界或按玩家存储的皮肤包，还需选择玩家。
- 方法二：在内容页面点击右上角的“导入”按钮选择文件。
- 方法三：使用命令行 `LeviLauncher.exe pack import "D:\Downloads\xxx.mcpack"`（导入世界用 `world import`），可加 `-i <实例>` 指定实例。

包的类型（资源/行为/皮肤）由其 `manifest.json` 决定；手机上的 `.mcpack` 等通用格式同样可用，但需与游戏版本兼容。你也可以在内容页面点击“打开目录”，将文件手动放入对应文件夹。注意：模组（`.mcmod` / `.dll`）需在实例的“管理模组”中导入，不能直接拖入资源区。

*适用版本：LeviLauncher（Windows）当前版本*

## LeviLauncher 安装的 Minecraft 实例能否注册到系统、出现在开始菜单里直接启动，或者创建快捷方式？

可以。

1. 注册到系统：在启动页点击“注册到系统”（命令行 `LeviLauncher.exe instance register <实例>`），Windows 就会将该实例视为对应渠道（正式版/预览版）已安装的 Minecraft，开始菜单、`minecraft://` 链接和 Xbox 功能都会调用它。该操作需确认后执行，会替换当前占用该渠道的商店版或其他实例（数据会保留）。注册 GDK 或 UWP 实例均需开启 Windows 开发者模式；UWP 实例在启动时会自动注册。如需解除注册，请运行 `instance unregister`。
2. 桌面快捷方式：在“启动”按钮旁的菜单中选择“创建桌面快捷方式”（或运行 `instance shortcut <实例>`），即可生成 `Minecraft - <实例名>.lnk`，双击即可通过启动器启动对应实例。

*适用版本：LeviLauncher（Windows）当前版本（v1.x）*

## 在 LeviLauncher 导入地图时让选择玩家，列表里显示的是旧名字，这些玩家是从哪来的？

这里列出的是该实例（GDK 版）在当前设备上登录过的玩家档案（即实例 `Users` 文件夹下的各个玩家目录），并非存档中联机过的玩家。显示的名字是启动器缓存的 Gamertag，因此可能是旧名字。世界会导入到所选玩家的档案下。

*适用版本：LeviLauncher（Windows）GDK 实例；UWP 实例没有玩家档案*

## 新版 LeviLauncher（v1，桌面端）如何更新到测试版/自动更新？

在启动器设置中开启“接收测试版更新”。此后启动器在启动时会自动检查更新，发现新的测试版时将弹窗提示，确认后即可原地更新，无需卸载旧版本。

*适用版本：LeviLauncher（Windows）v1.0.x 及以上*

## 往 LeviLauncher 导入某些 `.mcpack` / `.mcaddon` 资源包、行为包失败（其他包可以），是什么原因？

1. 后缀名错误：单个资源包、行为包或皮肤包应使用 `.mcpack` 后缀；`.mcaddon` 是将多个包打包在一起的格式，启动器导入 `.mcaddon` 时只识别其中的 `.mcpack` 或子文件夹内的 `manifest.json`。如果文件只包含单个包且 `manifest.json` 位于压缩包根目录，却使用了 `.mcaddon` 后缀，就会导入失败，将后缀改为 `.mcpack` 即可。
2. `manifest.json` 存在语法错误，不是合法的 JSON，导致启动器无法解析。对于 MC 允许的 JSON 注释，启动器现已支持；导入 `.mcaddon` 时忽略纯 Script API 行为包的问题也已修复（script 模块会导入到行为包目录）。
3. 遇到 UUID 重复的包时需选择覆盖；导入皮肤包前需先选择玩家。

*适用版本：LeviLauncher（Windows）当前版本*

## LeviLauncher 启动失败，`startup.log` 或调试输出显示 `config.Load failed: ERR_CONFIG_CORRUPTED: invalid character ... looking for beginning of value`（配置文件损坏）怎么办？

启动器的设置文件 `config.json` 已损坏（不是合法的 JSON）。请关闭启动器，删除 `%APPDATA%\LeviLauncher\config.json`（v1.1.0 之前的旧版路径为 `%APPDATA%\levilauncher.exe\config.json`），重新打开启动器后会自动生成默认配置。如需查看调试输出，可在快捷方式的“目标”末尾加上 ` /debug`（或在命令行运行 `LeviLauncher.exe --debug`）；启动日志位于 `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`。注意：删除该文件后，启动器设置会恢复默认；如果之前修改过数据目录（`base_root`），需要在设置中重新指定，否则该目录下的实例不会显示。

*适用版本：LeviLauncher 当前版本（Windows）；路径为 v1.1.0 起的新布局*

## Windows GDK 版基岩版的游戏数据（`com.mojang`，存档/资源等）在哪个路径？

未开启实例隔离时，GDK 版的数据根目录是 `%APPDATA%\Minecraft Bedrock`（预览版为 `%APPDATA%\Minecraft Bedrock Preview`）。其中，`Users\Shared\games\com.mojang` 存放共享内容（如资源包等），各账号的存档位于 `Users\<账号ID>\games\com.mojang\minecraftWorlds`。如果在 LeviLauncher 中开启了“实例隔离”，数据则会保存在该实例目录下的 `Minecraft Bedrock` 文件夹中（`<实例目录>\Minecraft Bedrock\Users\...`）。

*适用版本：Windows GDK 版基岩版；LeviLauncher v1.1.0*

## 新版 LeviLauncher 的设置里找不到教程视频中的 “Microsoft GDK” 选项，是不是缺了什么？

不缺。该选项在旧版本中用于注册游戏，新版本已不再需要，能正常启动游戏即可。在当前版本中，如需让实例显示在系统应用列表中，可在启动页启动按钮旁的菜单中选择“注册到系统”（可选）。

*适用版本：LeviLauncher 0.3.11 及以上*

## 用 LeviLauncher 安装游戏版本会不会覆盖/影响原来的存档？

不会覆盖。安装实例时若不勾选“实例隔离”，该实例会与系统中原有的 Minecraft 共用游戏数据（存档、设置等）；若勾选，数据会单独保存在实例目录中（可选择从共用数据继承一份）。启动器本身不会改动存档。如果要卸载原来的游戏，请先备份 `%APPDATA%\Minecraft Bedrock\Users` 下的存档，再进行删除。

*适用版本：LeviLauncher v1.1.0（GDK 版游戏）*

## 用 LeviLauncher（PC）每次启动游戏都会弹出一个控制台窗口，能去掉吗？

可以。打开对应实例的“实例设置”，在启动选项中关闭“启用控制台”，之后启动该实例时便不再弹出控制台窗口。该选项按实例保存，每个实例需单独设置。

*适用版本：LeviLauncher v1.1.0*

## LeviLauncher 文档网站打不开了，新地址是什么？

各项目文档已统一迁移至 levimc.org，语言代码位于路径最前面。LeviLauncher 简体中文文档地址为 <https://levimc.org/zh-Hans/LeviLauncher/>，繁体中文为 <https://levimc.org/zh-Hant/LeviLauncher/>，英文为 <https://levimc.org/LeviLauncher/>；LeviLamina 文档地址为 <https://levimc.org/zh-Hans/LeviLamina/>。旧的 docs.levimc.org 地址（如 `/LeviLauncher/zh-HK/`、`/LeviLauncher/zh-CN/`）会自动跳转到新地址。

*适用版本：当前版本（2026-11 起）*
