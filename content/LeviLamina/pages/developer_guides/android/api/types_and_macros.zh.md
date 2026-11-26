# SDK 头文件与宏

## 公开头文件

SDK 仅安装以下头文件：

```cpp
#include <pl/Config.hpp>
#include <pl/Export.hpp>
#include <pl/Input.hpp>
#include <pl/Logger.hpp>
#include <pl/Mod.hpp>
#include <pl/ModMenu.hpp>
#include <pl/ModMenuConfig.hpp>
#include <pl/Platform.hpp>
#include <pl/memory/Hook.hpp>
```

`<pl/Platform.hpp>` 在 `pl::platform` 中提供了少量 Android 辅助函数：`setClipboardText(text)` 用于设置剪贴板文本；`httpGet(url, timeoutMs = 5000)` 用于发起 HTTP GET 请求并返回 `HttpResponse`（包含 `status`、`body`、`retryAfter` 和 `ok()`）。

## PL_EXPORT

在受支持的编译器上，`PL_EXPORT` 会为符号设置默认可见性。大多数模组无需直接使用该宏，仅在需要向其他 native library 暴露符号时才需要使用。

```cpp
#include <pl/Export.hpp>

PL_EXPORT void customVisibleFunction();
```

## PL_REGISTER_MOD

`PL_REGISTER_MOD(Type, instanceExpr)` 用于注册生命周期对象。

```cpp
#include <pl/Mod.hpp>

class MyMod {
public:
  static MyMod &instance();

  bool load();
};

PL_REGISTER_MOD(MyMod, MyMod::instance())
```

请在单个源文件中使用一次该宏。`instanceExpr` 创建或返回的对象必须在整个进程生命周期内保持有效。

注册的类型必须实现 `bool load()`；`bool enable()`、`bool disable()` 和 `bool unload()` 为可选实现。

## 命名

公开 SDK 遵循 Lamina C++ 命名风格：

| 项目 | 风格 |
| --- | --- |
| 文件和类型 | `UpperCamelCase` |
| 函数和变量 | `lowerCamelCase` |
| 私有成员 | `mUpperCamelCase` |
| 常量 | `UpperCamelCase` |
| 宏 | `UPPER_SNAKE_CASE` |
