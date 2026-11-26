# LegacyScriptEngine API: other apis

## In an LSE JS plugin, printing a query result outputs `[object Object]`, and `String()` gives the same. How do I print the contents of the object?

The result is a plain object, so `String()` and `toString()` only return `[object Object]`. Convert it to a JSON string with `JSON.stringify(results)` before printing—for example, `logger.info(JSON.stringify(results))`.

*Applies to: current version (JS engine)*
