# LegacyScriptEngine 的报错与崩溃

## LL1 时代的老 JS 插件（如在线时长统计 `/onlinetime rank`）在 LSE 上运行时报错 `i is not defined`，排行榜打不开，怎么修？

新版脚本引擎以 ES Module 方式加载 JS（强制严格模式），变量未声明就使用会直接报错。请根据报错行号打开插件文件，将 `for (i = 0; ...)` 改为 `for (let i = 0; ...)`，并检查整个文件中的其他循环变量及普通变量是否都已使用 `let`/`const`/`var` 声明。

*适用版本：LegacyScriptEngine（QuickJS 后端）当前版本*

## LSE 启动时报错 `ERROR [legacy-script-engine-quickjs] failed to load: Failed to migrate legacy plugin at plugins/XXX.js: plugins/XXX already exists` 怎么解决？

LSE 启动时会把 `plugins/`（0.23.0 起为指向 `mods/` 的链接）根目录下的单文件旧插件（如 `XXX.js`）迁移到 `mods/XXX/XXX.js`，并生成 `manifest.json`。如果目标位置 `mods/XXX/XXX.js` 已经存在（例如插件之前已迁移过，之后又在根目录放了一份同名文件），迁移时就会报此错误。处理方法：直接删除根目录下重复的 `XXX.js`；如果要用新文件替换旧插件，请先删掉或清空旧的 `mods/XXX` 目录，再重启服务器。迁移完成后需再重启一次，插件才会加载。

*适用版本：LSE 0.x 至当前（0.23.x）；0.23.0 起 `plugins/` 是指向 `mods/` 的链接*

## 开服时 LSE 报错 `Fail to import! Function [LLSEGlobal::LoginAPI] has not been exported!`，这是什么原因？

某个脚本插件通过远程调用 `ll.imports("LLSEGlobal", "LoginAPI")` 导入其他插件导出的函数，但负责导出该函数的前置插件（此处为登录类插件）未安装或未成功加载，也可能是因加载顺序问题导致导入时该函数尚未导出。

在 `plugins` 目录中全局搜索字符串 `LoginAPI`，找出导入或导出该函数的插件，然后安装或修复其依赖的前置插件即可。

## 开服时出现与 `config.reload()` 相关的 JSON 解析报错，但没指出是哪个 LSE 插件，如何排查？

这通常是因为某个插件的 json 配置文件为空或已损坏，导致 `JsonConfigFile` 调用 `reload()`（内部使用 JSON 解析器读取文件）时解析失败并抛出异常。

可以编写脚本扫描 `plugins` 目录下的所有 `.json` 文件，找出解析失败的文件（重点留意大小为 0 的空文件），修复或删除对应的配置文件（若是数据文件请先备份）后再重启服务器。

## 服务器安装了 LSE Python 引擎后，部分玩家客户端进服就提示“破损的数据包”（`server sent broken packet`）/崩溃，原因是什么？

这是已知问题（LegacyScriptEngine issue #103，截至目前仍未关闭）：服务器启用“客户端区块生成”（BDS `server.properties` 中的 `client-side-chunk-generation-enabled`）时，会与 LSE Python 引擎（`legacy-script-engine-python`）冲突，导致玩家进服时提示 `server sent broken packet`（破损的数据包）；关闭该选项或不安装 Python 引擎即可正常进服。

规避方法：在 `server.properties` 中设置 `client-side-chunk-generation-enabled=false`，或暂时不使用 Python 引擎。

*适用版本：使用 LSE Python 引擎的服务器（issue 最初报告于 LSE 0.6.2 / BDS 1.20.72，最新版本未见修复记录）*
