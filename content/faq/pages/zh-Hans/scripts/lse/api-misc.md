# LegacyScriptEngine API：其他 API

## LSE JS 插件中打印查询结果输出 `[object Object]`，用 `String()` 也一样，怎么打印出对象内容？

查询结果是普通对象，调用 `String()` 或 `toString()` 只会返回 `[object Object]`。请先用 `JSON.stringify(results)` 将其转为 JSON 字符串再打印，例如 `logger.info(JSON.stringify(results))`。

*适用版本：当前版本（JS 引擎）*
