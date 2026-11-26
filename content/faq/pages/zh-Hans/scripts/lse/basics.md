# LegacyScriptEngine：综合问题

## 这个项目的目的是什么？

该项目旨在让 LLSE 插件在 LeviLamina 上运行。

## LSE 中多个插件监听同一个事件（如 `onChat`、`onLeft`），其中一个插件 `return false` 拦截后，其他插件还能收到事件吗？执行顺序是怎样的？LSE 有事件优先级吗？

能收到。当前版本的 LSE 会按注册顺序（通常即插件加载顺序）依次调用该事件的所有监听器。某个监听器返回 `false` 只是将该事件标记为已拦截，使 BDS（LeviLamina 事件）不再处理它（例如被拦截的聊天消息对所有人不可见），但不会阻止其他 LSE 插件的监听器继续接收该事件。

LSE 的 `mc.listen` 没有优先级参数。如需控制执行先后，可在插件的 `manifest.json` 中通过 `dependencies` 声明依赖：被依赖的插件会先加载，其监听器也会先注册、先执行。如果需要真正的事件优先级（例如编写禁言插件，需在其他插件之前拦截 `TextPacket` 或聊天事件），请改用 C++ 编写原生 mod，在 LeviLamina 的 EventBus 上以更高的 `EventPriority` 注册监听。上述事件分发行为自 0.4.12 版本起生效。

*适用版本：LSE 当前版本*

## LSE 的 `setTimeout` / `setInterval` 计时是否受服务器 TPS / tick 速率影响？如何让定时任务不受影响？

会受影响。LSE 的 `setTimeout` 和 `setInterval` 在服务器主线程上执行，延时会被换算为游戏 tick 数进行调度，因此修改 tick 速率或 TPS 下降时，实际触发时间也会随之变化。在 `onTick` 中每 tick 进行检测（如自制 cron）会占用主线程并拖慢 TPS；更好的做法是先计算出距离下次触发的时间，再用 `setTimeout` 调度，并将耗时操作（如存档压缩）放到其他线程或外部进程中执行。

在原生 C++ mod 中，若定时任务无需与 tick 同步，可使用 `ll::coro` 协程配合 `ll::thread::ThreadPoolExecutor` 等非 tick 执行器按系统时间等待，待需要操作游戏对象时再切回 `ll::thread::ServerThreadExecutor`。

*适用版本：LegacyScriptEngine 当前所有版本；LeviLamina 当前版本（C++ 部分）*

## LeviLamina 服务器能运行 / 编写 Python（以及 Node.js）插件吗？原来 LLSE 的 Python 插件能用吗？

可以。LegacyScriptEngine 现已提供 Python 和 Node.js 引擎（早期 LSE 一度不支持，现已解决），用 lip 安装对应变体即可：`lip install LegacyScriptEngine#python`（或 `#nodejs`、`#lua`、`#quickjs`；不指定变体时默认安装 QuickJS 和 Lua 引擎）。将 LLSE 时期的 Python 插件直接放入 `plugins/`（自 0.23.0 起，该目录是启动时创建的指向 `mods/` 的链接）后，启动服务器会自动迁移（生成 `manifest.json`），再重启服务器即可加载，不过 Python 插件生态较少。

另一种可选方案是编写 Endstone 的 Python 插件：通过 LeviStone（EndstoneRuntime）即可在 LeviLamina 上运行 Endstone 插件。

*适用版本：LegacyScriptEngine 0.23.x*

## 怎样把服务器数据（比如排行榜）实时显示到网页上？

用插件读取数据，再通过网络接口提供给网页。

- 可以用 LSE 自带的 HttpServer（QuickJS/Lua 同样可用）或 Node.js 引擎的 `http` 模块启动 HTTP 服务器，由网页端通过 JS 轮询获取数据。
- 或者使用 WebSocket 推送实现实时刷新。
- C++ mod 也可以接入 HTTP 库来实现。

*适用版本：LSE 当前版本*

## LL3（LeviLamina + LSE）脚本插件有内置数据库吗？需要自己再部署 MongoDB 之类吗？

有。LegacyScriptEngine 提供了两类数据库 API：基于 LevelDB 的键值数据库（`new KVDatabase(dir)`），以及 SQL 数据库会话 `new DBSession(type, params)`（其中 `type` 支持 `"sqlite3"` 和 `"mysql"`）。一般无需额外部署 MongoDB，按需选择即可（使用 MySQL 需自备 MySQL 服务）。

*适用版本：LegacyScriptEngine 当前版本*

## LSE 脚本插件能否在事件监听里修改事件数据，比如把玩家攻击造成的 5 点伤害改成 10 点？

不能直接修改。LSE 的 `mc.listen` 事件回调只能读取参数，或对可拦截事件返回 `false` 来取消事件，不能改写事件中的数据（例如 `onMobHurt` 的 `damage`）。如果确实需要修改事件数据，请用 C++ 编写 LeviLamina mod。

在脚本中的变通办法是：先拦截原事件，再调用相应 API 重新施加效果（例如取消原伤害后对实体调用 `hurt` 造成新伤害），但这并不等同于真正修改事件。

*适用版本：LegacyScriptEngine 当前所有版本（至 v0.23.1）*

## LegacyScriptEngine 里有 `nodejsdebug` 命令吗？

没有可用的 `nodejsdebug`。源码中虽然为 Node.js 后端定义了 `nodejsdebug` 这一名称，但 Node.js 引擎不支持调试引擎，不会注册该命令。可用的调试命令包括 QuickJS 的 `jsdebug`、Lua 的 `luadebug`，以及 Python 的 `pydebug`（仅限控制台）。

*适用版本：LSE 当前版本（v0.23.1）*

## 为什么 LSE 提供的一些事件在 LeviLamina C++ 中找不到对应的事件，C++ 插件要怎么实现同样的监听？

LeviLamina 只保留了少量核心事件，LL2 时代的大量事件并未迁入 LeviLamina。为保持对 LLSE 插件的兼容，LSE 自行补齐了这些事件：一部分基于事件库 iListenAttentively（LSE 的依赖），另一部分在 LSE 内部自己 hook 实现。因此，LSE 事件与 LeviLamina 事件并非一一对应。

C++ mod 若想实现同样的监听，可以依赖 iListenAttentively（`lip install github.com/LiteLDev/iListenAttentively`）并使用其事件，或者自己写 hook。

*适用版本：LeviLamina 1.x 及以上 / 当前 LSE*

## 在 LegacyScriptEngine 中，一个 JS 插件里定义的全局变量/Map 等数据会不会干扰服务器上其他脚本插件？

不会。LSE 会为每个脚本插件创建独立的脚本引擎实例，各插件拥有独立的全局作用域，彼此的变量互不干扰。插件间如需共享数据或调用函数，可使用远程调用 `ll.exports` / `ll.imports`（由 LegacyRemoteCall 提供）等机制。

## 如何给 LSE 添加新的脚本语言支持（例如 PHP）？

LSE 的脚本语言支持由底层的 ScriptX 提供。新增语言需要 ScriptX 先有该语言的后端，再在 LSE 中增加对应的引擎变体，不能直接在 LSE 里简单添加。目前 LSE 提供 `lua`、`quickjs`、`nodejs`、`python` 四种引擎。

## 新手想写一个由 LeviLamina 加载的插件，应该从哪里开始？需要下载 LeviLamina 源码吗？

不需要修改 LeviLamina 源码。建议新手先写 LegacyScriptEngine（LSE）脚本插件：

- 项目：<https://github.com/LiteLDev/LegacyScriptEngine>
- 文档：<https://levimc.org/LegacyScriptEngine/>
- 入门教程「写你的第一个脚本插件」：<https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/>

写代码前先引入 API 类型提示：在项目中执行 `npm install -D @levimc-lse/types`，并在 `tsconfig.json` 的 `compilerOptions.types` 中加入 `"@levimc-lse/types"`（或在入口文件中写 `/// <reference types="@levimc-lse/types" />`），这样多人协作时也不会出现绝对路径冲突。

如果想写原生 mod，则需学习 C++ 并配置 VS/xmake 环境（参考 LeviLamina 文档和 levilamina-mod-template）。

## 新版 LSE 每次开服都会自动生成一个 `plugins` 快捷方式（目录链接），删掉还会再生成，这是什么？复制到另一台机器后变成了普通文件夹/链接失效怎么办？

这是预期行为：大部分 LSE 插件硬编码了 `plugins` 路径，因此 LSE 从 0.23.0 起会在开服时创建指向 `mods/` 的目录链接（Windows 上为 junction）来保证兼容。

由于目录链接使用绝对路径，将整个服务端文件夹复制到其他机器会导致链接损坏，直接删掉它让 LSE 重新自动生成即可。注意：如果 `plugins` 位置已存在同名普通文件或文件夹且不指向 `mods`，LSE 会报错而不会将其覆盖。

*适用版本：LSE 0.23.0 及以上（LeviLamina 26.60）*

## 用 LSE 写 JS 插件是否必须安装 Node.js / `nodejs` 引擎？

不需要。普通 JS 插件由 QuickJS 引擎运行（可通过 `lip install github.com/LiteLDev/LegacyScriptEngine#quickjs` 安装；不指定变体时，默认同时安装 QuickJS 和 Lua 引擎）。直接放入的单个 `.js` 文件会被识别为 quickjs 插件，迁移后 `manifest.json` 中的 `type` 为 `lse-quickjs`。

只有需要 Node.js API 或 npm 包时，才需要安装 `#nodejs` 引擎，此时 manifest 的 `type` 为 `lse-nodejs`。

*适用版本：LSE 当前版本（0.23.x）*

## 编写 LSE（LLSE）JS 插件时，文件开头那行引用类型定义的注释（`/// <reference ...>`）在编辑器里报红线，需要修复吗？会影响插件运行吗？

不影响运行。这行三斜线注释只用于向编辑器提供类型信息和代码补全，报红只是因为找不到对应的类型定义。

如果需要代码补全，可按 legacy-script-engine-api 的说明安装 `@levimc-lse/types`，然后在入口文件写入 `/// <reference types="@levimc-lse/types" />`，或在 `tsconfig.json` 的 `compilerOptions.types` 中添加它；如果不需要，直接忽略即可。

若插件运行时后台反复报错，则与这行注释无关，应排查其他原因（如 JSON 配置文件格式错误、前置插件缺失或损坏，可尝试重装前置）。

## 能用 LSE（如 NativeCall/NativeAPI）在脚本插件里 hook 游戏函数吗？

不能，也不建议。LSE 的 NativeAPI 已在 0.8.19 完全移除，脚本插件无法 hook 游戏函数。如需 hook，请直接用 C++ 编写 LeviLamina 模组（可基于 levilamina-mod-template）。

*适用版本：LSE 0.8.19 及以上（当前 0.23.x）*

## 觉得用 C++ 开发 LeviLamina 原生 mod 门槛太高，有没有更简单的开发方式？

可以使用 LegacyScriptEngine（LSE），用 JavaScript（QuickJS/Node.js）、Lua 或 Python 开发插件。这种方式相对简单，服务端和 Windows 客户端均可运行。

- 文档：<https://levimc.org/zh-Hans/LegacyScriptEngine/>
- 入门教程：<https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/>
- 类型提示与脚手架：<https://github.com/LiteLDev/legacy-script-engine-api>

## LSE 插件 `ll reload` 后命令失效或反复报错（如命令注册失败），该怎么办？

用假命令（`mc.regPlayerCmd` / `mc.regConsoleCmd` 等旧接口）注册的命令只会在服务器启动完成（`onServerStarted`）时统一注册一次，插件 reload 后再次调用这些接口也不会重新注册，命令因此失效。文档已不推荐使用假命令，应改用真命令 `mc.newCommand`：reload 时若命令已存在，只会提示 `Runtime command ... already exists`，并重新应用 `setOverload` / `setCallback`，命令可继续正常使用。此外，热加载/卸载本为调试设计，存在风险和性能问题，生产环境遇到问题时直接重启服务器更可靠。

*适用版本：LeviLamina 当前版本；LegacyScriptEngine 当前版本*

## LSE 有 Markdown 格式的文档吗（比如想喂给 AI）？

有。LSE 文档站由 Markdown 源码生成，源码位于 GitHub 仓库 LiteLDev/liteldev.github.io 的 `content/LegacyScriptEngine/pages` 目录下（中文为 `*.zh.md`，英文为 `*.md`，API 文档在 `apis/` 子目录）。此外，LiteLDev/legacy-script-engine-api 仓库提供了插件开发的 API 类型提示，也可作为参考。

## 在 LSE JS 插件里把 `setTimeout`/`setInterval` 的定时时间等数值设成 `99999999999` 这样很大的数，会不会出问题？

会。LSE 读取定时器时间时会按 32 位有符号整数转换（`toInt32`），超过 `2147483647` 就会溢出为其他值；若溢出后变为 ≤0，还会被当作 1 毫秒立即执行。除非清楚具体后果，否则传给 LSE API 的整数参数都应小于 `2147483648`（2^31）。

*适用版本：LegacyScriptEngine 当前版本*
