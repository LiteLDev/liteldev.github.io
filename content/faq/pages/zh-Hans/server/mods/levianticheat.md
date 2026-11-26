# LeviAntiCheat

## BDS 设置 online-mode=false（关闭正版验证）后玩家数据/背包一直丢失，进服像新玩家一样，怎么解决？

关闭正版验证后，服务端可能无法按原方式读取玩家数据，从而导致“丢档”。LeviAntiCheat（LAC）自带离线模式背包保护功能（修复离线模式玩家背包丢失问题）：在 `mods/LeviAntiCheat/config/config.json` 中将 `worldSafety.offlineInventoryProtection` 设为 `true`（默认为 `false`），然后重启服务器或执行 `/lac reload` 即可。此外，你也可以自行编写插件来保存玩家数据。

*适用版本：当前 LeviAntiCheat（v0.18.0）*

## LeviAntiCheat（LAC）提示检测到使用 NoPacket 是什么意思？

这表示停止发包检测发现该玩家超过一定时间没有发送数据包。判定阈值由 `config.json` 中的 `movement.noPacketCheck.maxNoPacketTime` 控制（默认 12 秒）。如果出现误报，可以调大该值，或将 `movement.noPacketCheck.enable` 设为 `false` 关闭检测。在开发调试期间，你也可以关闭该检测，或订阅 `PlayerCheatEvent` 自行处理（详见 LeviPenalizeCheat）。

*适用版本：当前 LeviAntiCheat（v0.18.0）*

## LeviAntiCheat 的禁言命令怎么用？直接输入 mute 无法运行。

禁言功能没有独立的 `mute` 命令，而是作为 LAC 主命令 `lac` 的子命令运行：使用 `/lac mute <玩家> [时长(分钟)]` 禁言，`/lac unmute <玩家>` 解除禁言，`/lac query <玩家>` 查询玩家的封禁/禁言状态。

*适用版本：LeviAntiCheat 0.4.4 及以上*

## LeviAntiCheat 的 GitHub 地址是什么？LLAC 和 LAC 有什么区别？

GitHub 地址为 <https://github.com/LiteLDev/LeviAntiCheat>，可通过 `lip install github.com/LiteLDev/LeviAntiCheat` 安装。LLAC（LLAntiCheat）是 LiteLoaderBDS（LL2）时代的旧版反作弊，仓库现已归档；LAC（LeviAntiCheat）则是面向 LeviLamina 的反作弊，目前仍在维护。

## 想用 LeviAntiCheat 修复利用工作台/UI 槽位无限复制物品的 bug，但不想开启 LAC 的全部功能，怎么办？

LAC 自带 UI 槽位刷物修复，对应配置项为 `bugFixes.uiItemDuplicateFix`（默认 `true`）。LAC 的各项功能均可在 `mods/LeviAntiCheat/config/config.json` 中单独关闭：保留 `bugFixes.uiItemDuplicateFix` 为 `true`，将不需要的检测项的 `enable` 或布尔值改为 `false` 即可（例如 `cheatPrevention.antiXray.enable`、`movement.timerCheck.enable`、`combat.autoClickCheck.enable` 等；如不想让玩家被踢出，也可将 `punish.enable` 设为 `false`）。建议直接修改值，不要删除配置项。修改后执行 `/lac reload` 或重启服务器生效。安装命令：`lip install github.com/LiteLDev/LeviAntiCheat`

*适用版本：LeviAntiCheat 当前版本（0.18.0，LeviLamina 26.60.\*）*

## LeviLamina 服务器有什么反作弊插件可用？旧的 LLAC 有 LeviLamina 版本吗？

有，即 LiteLDev 官方推出的 LeviAntiCheat（LAC），仓库地址为 <https://github.com/LiteLDev/LeviAntiCheat>。可通过 lip 安装：`lip install github.com/LiteLDev/LeviAntiCheat`，也可直接从 GitHub Releases 下载。请注意选择与当前 LeviLamina 版本匹配的 LAC 版本（例如 LAC 0.18.0 依赖 LeviLamina 26.60.*）。

*适用版本：LeviLamina 当前版本*

## 开启 LeviAntiCheat 反矿透后，玩家反馈挖到的钻石等矿石变成了石头，这是 bug 吗？

不是 bug。在 `engineMode: 1` / `2`（默认为 1）下，反矿透会把被实心方块完全包围的实心方块替换成 `obfuscateBlocks` 中的假矿发送给客户端，以此迷惑矿透玩家；当方块发生变化（如开始挖掘、爆炸等）时，服务端会重新发送周围的真实方块数据，假矿便会恢复显示为原本的石头。

如果玩家贴近时就能看到矿石变化，可以调大对应维度的 `cheatPrevention.antiXray.dimensions.<维度>.updateRadius`（默认为 2），但该值越大，客户端能透视的范围也越大。

*适用版本：LeviAntiCheat 当前版本（v0.17.2 重写反矿透后的配置结构）*

## LeviAntiCheat 的反矿透（anti x-ray）开了感觉没效果，或者导致回弹，参数怎么调？

请参考官方文档调整参数：<https://github.com/LiteLDev/LeviAntiCheat/blob/release/anti_x_ray.zh.md>。该文档详细说明了 `cheatPrevention.antiXray` 下各项配置（`enable`、`maxThreads`、`autoSolidCheck`、`dimensions.<维度>.engineMode`/`maxHeight`/`updateRadius`/`obfuscateBlocks`/`mainBlock` 等）的含义，提供了 `engineMode` 0/1/2 在主世界与下界的推荐配置，并附有“仍能看到矿物”“y=0 以下不起作用”等常见问题的排查方法。

*适用版本：LeviAntiCheat 当前版本*

## 有没有能检测 32k 等违禁物品（非法附魔、基岩、传送门方块、刷怪笼、刷怪蛋、特殊值方块等）的插件？

可以使用 LiteLDev 官方反作弊插件 LeviAntiCheat（LAC）。在 `mods/LeviAntiCheat/config/config.json` 的 `inventoryManagement.banItem.blacklist` 中填入要禁用的物品命名空间 ID（如 `"minecraft:bedrock"`）即可。针对超等级附魔，可开启 `inventoryManagement.enchantCheck`（默认关闭）并在 `maxEnchantLevel` 中设置各项附魔的最大等级；此外还提供 `anvilEnchantLimits`（铁砧附魔检查）、`invalidItemDetection`、`invalidStackDetection`、`antiInvalidNbtItem` 等检测功能。

*适用版本：LeviAntiCheat 当前版本（配置 version 21）*

## 安装了 LeviAntiCheat 后找不到它的配置文件在哪？

配置文件要在开服一次且插件成功加载后才会自动生成，路径为 `mods/LeviAntiCheat/config/config.json`。修改后，重启服务器或执行 `/lac reload` 即可重载配置。

*适用版本：LeviAntiCheat 当前版本（0.18.0）*

## 服务器安装 LeviAntiCheat（LAC）后主世界出现方块显示异常，如何解决？

这通常是 LAC 的反矿透（anti-xray）功能导致的。该功能会混淆被实心方块完全包围的方块；默认 `engineMode` 为 1，会将这些隐藏的实心方块随机替换为 `obfuscateBlocks` 中的矿物后再发往客户端。在 `mods/LeviAntiCheat/config/config.json` 中，将 `cheatPrevention.antiXray.dimensions.overworld.enable` 设为 `false` 即可关闭主世界的反矿透（或将 `cheatPrevention.antiXray.enable` 设为 `false` 彻底关闭），随后执行 `/lac reload` 或重启服务器。如果是附加包方块显示异常，也可以检查 `treatAddonBlocksAsNonSolid`、`nonSolidBlocks` 等配置项。

*适用版本：当前所有版本（配置键以 LAC 0.17.x/0.18.0 为准）*

## 安装 LeviAntiCheat（LAC）后启动报版本相关错误、无法加载，怎么办？

LAC 是针对特定 LeviLamina 版本编译的，二者版本必须严格匹配。请安装与当前 LeviLamina 版本对应的 LAC，或将两者一同升级到对应版本。推荐使用 lip 安装，以便自动解析依赖：`lip install github.com/LiteLDev/LeviAntiCheat`。例如，当前最新的 LAC 0.18.0 要求 LeviLamina 26.60.*；各 LAC 版本对应的 LL 版本可查阅 CHANGELOG。

*适用版本：当前所有版本（LAC 0.18.0 对应 LeviLamina 26.60.\*）*

## LeviAntiCheat（LAC）惩罚配置中的封禁时长（`duration`）字段是什么意思？

该字段表示惩罚（封禁）的持续时间，而非作弊次数。在当前配置中对应 `punish.banDuration`，单位为秒，`0` 表示永久封禁；是否触发封禁由 `punish.banVL` 决定（`-1` 表示不封禁），`kickVL` 则为踢出玩家的违规值。此外，手动命令 `/lac ban <玩家> [原因] [时长(分钟)]` 中的时长单位为分钟。

*适用版本：当前版本（LeviAntiCheat 0.18.0，配置版本 21）*

## LeviAntiCheat 的配置文件有中文说明/教程吗？

有。仓库的中文 README（<https://github.com/LiteLDev/LeviAntiCheat/blob/release/README.zh.md>）提供了带中文注释的完整默认配置（配置文件位于 `mods/LeviAntiCheat/config/config.json`）；反矿透子模块另有说明文档 `anti_x_ray.zh.md`。注意：配置文件中的 `"version"` 字段是配置版本号（当前为 21），请勿手动修改。

*适用版本：LeviAntiCheat 当前版本（0.18.0）*

## 装了 LeviAntiCheat（LAC）后，服务器后台一直踢人，甚至所有玩家都被踢、进不去服务器，怎么解决？

这通常是 LAC 的“停止发包检测”（NoPacket）误判所致。该检测用于检查玩家是否长时间停止向服务器发包，关闭它并不会让作弊者“无敌”。可在 `mods/LeviAntiCheat/config/config.json` 中将 `movement.noPacketCheck.enable` 设为 `false`，或调大 `movement.noPacketCheck.maxNoPacketTime`（默认 12 秒）。此外，0.4.5 已修复服务器主线程卡顿引发的 NoPacket 误判问题，请先确认已升级到最新版 LAC。

*适用版本：LeviAntiCheat 当前版本（0.18.0）*

## 某些通过发包修改玩家名字显示的插件和 LeviAntiCheat 的假名检测冲突，怎么处理？

在 `mods/LeviAntiCheat/config/config.json` 中将 `cheatPrevention.antiFakeName` 设为 `false` 即可（当前版本默认即为 `false`）。

*适用版本：LeviAntiCheat 当前版本（0.18.0）*

## 装了 LeviAntiCheat（LAC）后仍有人刷屏拦不住怎么办？

调整 `mods/LeviAntiCheat/config/config.json` 中 `playerInteractions.antiSpam` 的设置：确认 `enable` 为 `true`，调小 `maxChatRate`（`chatRateDuration` 秒内允许的最大聊天条数，默认为 10 秒 5 条）、`maxCmdRate`（每秒最大命令数）和 `maxChatLength`（最大聊天长度），并可开启 `disableSelector` 以禁止在命令中使用目标选择器；同时可调高 `punish.checkTypeViolationMap` 中 `Spam`、`CommandSpam` 和 `MessageTooLong` 的违规值，让刷屏者更快被踢出。

*适用版本：LeviAntiCheat 当前版本（0.18.0）*
