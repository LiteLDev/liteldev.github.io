# LegacyMoney

## LegacyMoney 的 `/money add` 只能指定玩家名，能不能用目标选择器（如 `@s`、`@a`）给玩家加钱？有没有 LL2 LLMoney 那样的 `money_s`？

可以。LegacyMoney 重写了命令，将旧版 LLMoney 的 `money_s` 改为在子命令后加 `s` 的形式来支持目标选择器：`/money adds <选择器> <数量>`、`/money reduces <选择器> <数量>`、`/money sets <选择器> <数量>`、`/money querys <选择器>`，例如 `/money adds @s 10`。不带 `s` 的 `/money add`/`reduce`/`set`/`query` 则接受玩家名，可对离线玩家操作。这些操作需要 OP（GameDirectors 及以上）权限。具体用法见仓库 README。

*适用版本：LegacyMoney 0.x 至当前（v0.23.0）*

## LeviLamina 还像 LiteLoaderBDS 那样内置经济系统吗？LeviLamina 下用什么经济插件，怎么安装和使用？

LeviLamina 不再内置经济系统。原 LiteLoaderBDS 的 LLMoney 已移植为独立模组 LegacyMoney（<https://github.com/LiteLDev/LegacyMoney>），大部分 LSE 脚本插件的经济功能（`money` API）都调用它。

用 lip 安装 LegacyScriptEngine（如 `lip install github.com/LiteLDev/LegacyScriptEngine`）时，LegacyMoney 会作为依赖自动安装；也可单独安装：`lip install github.com/LiteLDev/LegacyMoney`。

游戏内通过 `/money` 命令使用（`query`/`pay`/`add`/`reduce`/`set`/`hist`/`top` 等），配置文件为模组目录下的 `money.json`（包含 `currency_symbol`、`def_money`、`enable_commands`、`pay_tax`）。

*适用版本：LeviLamina 全部版本（当前 LegacyMoney v0.23.0 / LSE v0.23.1）*

## LegacyMoney 的 `/money` 命令“没法用”：对玩家操作提示找不到玩家/没反应，或提示没有权限，怎么解决？

通常有以下两类原因：

1. 提示 `Player not found` 或对玩家操作无效：`/money add/set/reduce/query/hist <玩家名>` 通过 LeviLamina 的 PlayerInfo 服务（记录 uuid、xuid、name 的玩家数据库）按名字查找玩家。该服务默认懒加载，只有在首次被调用后才开始记录进服玩家，此前进服但未被记录的玩家就会找不到。解决方法是在 LeviLamina 配置文件 `Config.json` 中将 `playerInfo` 的 `alwaysLaunch` 设为 `true`，让服务器启动时即启用玩家信息记录（占用资源极小），之后玩家重新进服一次即可被记录。
2. 提示 `You don't have permission to do this`：`/money` 命令本身对所有人可见（注册权限为 Any），但 add/reduce/set、查询他人余额、`hist <玩家名>` 和 purge 在执行时要求 OP（GameDirectors）及以上权限，普通玩家执行会被拒绝。控制台拥有最高权限，不会因权限不足被拒；但 pay 和不带玩家名的 hist 只能由玩家执行，在控制台执行会提示 `Console is not allowed to use this command`。

*适用版本：LeviLamina 当前版本；LegacyMoney 0.23.0*

## 如何在玩家离线时修改其 LegacyMoney 余额？为什么有的离线玩家能改成功、有的会失败？

使用不带 `s` 的命令按玩家名操作即可对离线玩家生效，例如 `/money add <玩家名> <数量>`、`/money set <玩家名> <数量>`（带 `s` 的选择器版本只能选中在线玩家）。

按名字操作依赖 LeviLamina 的 PlayerInfo 记录将名字解析为 xuid：

- 如果该玩家从未被 PlayerInfo 记录（例如 PlayerInfo 服务未在启动时开启，且玩家之后未再进过服），会提示 `Player not found`。
- 如果玩家 xuid 为空（如离线模式或未登录 Xbox 的玩家），LegacyMoney 会直接返回失败（`Failed to add money`）。

可在 LeviLamina 的 `Config.json` 中将 `playerInfo.alwaysLaunch` 设为 `true`，并让玩家重新进服一次以写入记录。在脚本插件中，也可直接调用 `money.add(xuid, value)` 等接口按 xuid 操作离线玩家。

*适用版本：LegacyMoney v0.23.0；LeviLamina 当前版本*

## LSE 领地等插件配置里要求花费“货币/硬币”，这个货币从哪来？LLMoney 是什么，需要单独装吗？

这类 LSE 插件通常对接 LLMoney 经济系统，在 LeviLamina 上即 LegacyMoney（LLMoney 的移植版），插件中所说的“货币/硬币”就是 LegacyMoney 的余额。安装 LegacyScriptEngine（运行 JS/Lua 等脚本插件的引擎）时，LegacyMoney 会作为依赖自动安装，无需另行安装。之后还需要通过其他插件或命令为玩家提供获取货币的途径，例如管理员执行 `/money add <玩家> <数量>`，或在 `money.json` 中设置 `def_money` 作为新玩家的初始金额。

*适用版本：当前 LSE / LegacyMoney 所有版本*

## LegacyMoney（LLMoney）支持多货币或小数金额吗？

不支持。LegacyMoney 是单一货币系统，每个玩家（xuid）只有一个余额，且金额为整数（内部类型为 `long long`，LSE API 参数类型为 Integer）。如需多货币，可改用计分板等方案实现；如需支持小数（如两位小数），建议以最小单位（如“分”）按整数存储，显示时再进行换算。

*适用版本：LegacyMoney 当前所有版本*

## LegacyMoney（LLMoney）支持用 UUID 作为玩家标识吗？

不支持。LegacyMoney 以 xuid 作为玩家标识，所有接口（`LLMoney_*` 及 LSE 的 `money.*` API）均传入 xuid。没有 xuid 的玩家（如离线模式未登录 Xbox）无法使用，相关操作会直接返回失败。若只有 UUID，可先通过 LeviLamina 的 PlayerInfo（`ll::service::PlayerInfo::fromUuid`）或 LSE 的数据接口换算出 xuid。

*适用版本：LegacyMoney 当前所有版本*

## 使用 LegacyMoney 时，如何查看经济（金钱）流水/来源记录？

玩家可执行 `/money hist` 查看自己的流水（仅玩家可用，可选参数 `time` 为秒数，默认查询最近 24 小时）；OP 可使用 `/money hist <玩家名> [time]` 查看他人流水（控制台查询必须指定玩家名）。清除流水使用 `/money purge`，随后需输入 `/money purge confirm [time]` 确认。在脚本中可调用 LSE 的 `money.getHistory(xuid, time)`。

*适用版本：LegacyMoney 当前所有版本*

## 重构后的 LegacyMoney 有哪些功能？能否提供备份记分板数据的功能？

LegacyMoney 支持查询排行榜（`/money top [number]`，默认显示前 10 名）、通过配置项 `currency_symbol` 自定义货币符号，并内置了中文本地化（`lang/zh_CN.json`）。它不提供备份记分板数据的功能，其经济数据本身存储在 `mods/LegacyMoney/economy.db`（SQLite）中；如需备份记分板，请自行寻找第三方工具或插件。

*适用版本：LegacyMoney 0.2 及以上*

## 经济插件（LegacyMoney）里玩家余额变成 -1，用命令设置成任何值都无效，是什么原因？

通常是因为在 `server.properties` 中关闭了 `online-mode`。关闭在线模式后，玩家无法获取 xuid，而 LegacyMoney 以 xuid 作为主键：当 xuid 为空时，查询余额会直接返回 -1，set/add/reduce 操作也会直接失败。请保持 `online-mode=true`；关闭期间产生的数据可能会因为 xuid 缺失或错乱而无法对应。此外，数据库读写出错时也会返回 -1，可检查控制台是否有 `Database error` 日志。

*适用版本：LegacyMoney 0.8.4 及以上*

## C++ 插件中要调用 LegacyMoney（LLMoney）的 API，直接 include `LLMoney.h` 就行吗？

不行。需要先在 `xmake.lua` 中引入 levimc-repo 里的 `legacymoney` 包（例如 `add_requires("legacymoney 0.23.*")`），并在 target 中添加 `add_packages("legacymoney")` 以链接其导入库，之后才能 `#include "LLMoney.h"` 并调用 `LLMoney_Get`、`LLMoney_Add` 等函数。运行时服务器上也必须安装 LegacyMoney，建议在 mod 的依赖中声明它。

*适用版本：LegacyMoney 当前所有版本*

## 从 <https://github.com/LiteLDev/LLMoney/releases> 手动下载的 LLMoney 在 LeviLamina 下出问题（经济数据被清零、db/配置文件消失），LLMoney 不支持 LeviLamina 吗？

LLMoney 是 LiteLoaderBDS 时代的插件，仓库已归档，不支持 LeviLamina。在 LeviLamina 下应使用其继任者 LegacyMoney（<https://github.com/LiteLDev/LegacyMoney>），并通过 `lip install github.com/LiteLDev/LegacyMoney` 安装，不要像 LL2 时代那样手动下载并放置文件。LegacyMoney 的数据保存在 `mods/LegacyMoney/economy.db`，配置文件为 `mods/LegacyMoney/money.json`。如需迁移旧数据，可将原有的 `economy.db` 直接复制到该目录继续使用；若是 LL2 旧格式的 `money.db`，则放到 `mods/LegacyMoney/LLMoney/money.db`，启动时会自动转换。

*适用版本：LeviLamina 全部版本*

## LegacyMoney（llmoney）的数据库文件为什么越来越大？如何清理？

数据库 `mods/LegacyMoney/economy.db` 除了余额表 `money` 外，还包含流水表 `mtrans`。玩家转账和加减余额都会写入流水，日积月累导致文件变大。清理流水需由 OP（GameDirectors 及以上权限）执行 `/money purge confirm [time]`（直接输入 `/money purge` 只会提示这是危险操作并要求加上 `confirm`；`time` 为秒数，表示只删除早于该时间的流水，默认为 0，即全部清空）。也可以在停服后使用 SQLite 工具手动删除无用数据（如余额为 0 的记录）。

*适用版本：LegacyMoney 0.7 及以上*
