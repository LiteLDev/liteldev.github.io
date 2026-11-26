# LeviOptimize

## LeviOptimize（0.17.1 起移植了 Endstone 的优化）能优化客户端渲染卡顿吗？

不能。LeviOptimize 仅优化服务端逻辑（如区块发布、实体广播、红石、随机刻等），不涉及客户端渲染。目前所有优化功能在源码中均标记为服务端功能（`FeatureSide::server`）；客户端的 `/clilo` 命令只能管理客户端侧功能，对这些服务端优化项会提示 `not available on this side`。

*适用版本：LeviOptimize 0.17.1 及以上*

## LeviLamina 服务器人多卡顿，如何安装和配置优化插件 LeviOptimize？

可通过 lip 安装：`lip install github.com/LiteLDev/LeviOptimize`（当前版本为 0.18.0，需搭配 LeviLamina 26.60.x）。首次启动后会生成配置文件 `mods/LeviOptimize/config/config.json`，各项优化默认均已开启。你可以在 `features` 中按需关闭或调整（如 `push_entity_opt` 的子选项），修改后执行 `/lo reload` 即可免重启生效；也可以直接用 `/lo enable <feature>` 或 `/lo disable <feature>` 开关功能并保存配置。

*适用版本：LeviOptimize 0.17.1 及以上*

## 有没有能提高 LeviLamina 服务器 TPS 的插件？LeviOptimize 和 levilamina-loc 有什么区别？

可以使用 LeviOptimize（简称 LO，<https://github.com/LiteLDev/LeviOptimize>）。它是基于 LeviLamina 的性能模组，专门针对拉低 TPS 的原版性能热点进行优化，安装命令为：`lip install github.com/LiteLDev/LeviOptimize`。而 levilamina-loc（<https://github.com/LiteLDev/levilamina-loc>）是 LeviLamina 的本地化语言包，通过 lip 安装 LeviLamina 时会作为依赖自动安装，与性能优化无关，切勿混淆。

## LeviLamina 服务器（LSE 没有 TPS API）怎么查看服务器 TPS？

安装 LeviOptimize（`lip install github.com/LiteLDev/LeviOptimize`）后，执行 `/lo profile`，即可输出由 `full_frame_timing` 统计的最近 20 个采样的当前与平均整帧 MSPT 及对应 TPS。该命令需要 GameDirectors（OP）权限，也可在服务端控制台直接执行。使用前请确保 `config.json` 中的 `diagnostics.full_frame_timing` 与 `commands.server_feature_manage_command` 均设为 `true`（默认开启）。

*适用版本：LeviOptimize 0.17.1 及以上；LeviLamina 26.60.x*
