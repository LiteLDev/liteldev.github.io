# LeviLamina 模组 API：其他 API

## C++ mod 中如何自己构造一个 `ActorUniqueID`？

`ActorUniqueID` 是仅含一个 `int64 rawID` 成员的聚合结构体，直接聚合初始化即可：`auto id = ActorUniqueID{123};`。`ActorUniqueID{}` 会将 `rawID` 置为 0；注意 `ActorUniqueID id;` 不会初始化 `rawID`。若需要无效 ID，可使用 `ActorUniqueID::INVALID_ID()`。

## C++ 的 `switch` 不能直接对 `std::string` 做分支，开发 LeviLamina mod 时怎样避免写一堆 `if-else`？

可先将字符串哈希为整数，再使用 `switch`。LeviLamina 提供了 `#include "ll/api/utils/HashUtils.h"`，其中的 `ll::hash_utils::doHash(std::string_view)` 为 `constexpr` 函数，字面量运算符 `"xxx"_h` 为 `consteval` 函数（位于命名空间 `ll::literals::hash_literals`），可直接用于 `case` 标签：

```cpp
using namespace ll::literals;
switch (ll::hash_utils::doHash(str)) {
case "foo"_h: ...; break;
case "bar"_h: ...; break;
}
```

标准库的 `std::hash<std::string>{}(str)` 不是 `constexpr`，不能用于 `case` 标签。

*适用版本：LeviLamina 0.8 及以上*

## LL2（LiteLoaderBDS）中的 LLAPI（如 `Block` 相关接口、各类事件、NBT）在 LeviLamina 中还有吗？怎么找对应接口？

LeviLamina 并未一一保留 LL2 的 API，而是进行了重写或直接使用 BDS 原生类（LSE 正是基于 LeviLamina 移植而来）。其命名方式与 LL2 不同，可查阅 API 文档 <https://levimc.org/LeviLamina/api/>（例如 `Block` 类）；方块可通过 BDS 自身的方块注册表获取。LeviLamina 仅提供基础事件（见 `src/ll/api/event`），若需要 LL2 中的完整事件，可参考 LegacyScriptEngine 中整理好的 Hook 实现（`src/lse/events/*Hooks.cpp`）。不建议直接照搬 LL2 代码，参考 LSE 的实现更佳。

## LeviLamina 有没有封装好的获取系统时间的函数？

有。头文件 `ll/api/utils/SystemUtils.h` 中的 `ll::sys_utils::getLocalTime()`（位于命名空间 `ll::inline utils::sys_utils`，可直接写作 `ll::sys_utils::`）返回 `ll::data::TmWithMs`（即 `std::tm` 加毫秒），无需自行封装。当前版本仍保留了该函数。

*适用版本：LeviLamina 0.13 及以上*

## LeviLamina 的 i18n 翻译字符串格式化语法是什么？

采用 `fmt::format` 语法（支持 `{}` 占位符、`{0}` 位置参数、具名参数、格式说明符等）。例如调用 `"key"_tr(arg1, arg2)` 时，可在翻译文本中用 `{}` 或 `{0}` 引用参数。

*适用版本：所有版本*

## 在 LeviLamina 头文件中，斧头物品对应的类是哪个？

斧头对应的类是 `HatchetItem`（位于 `mc/world/item/HatchetItem.h`）。该类继承自 `DiggerItem`，搜索 `DiggerItem` 即可找到所有挖掘工具类物品。

*适用版本：LeviLamina 当前版本*

## LeviLamina 新版头文件中 `mc/deps/json/JsonHelpers.h` 找不到了，`JsonHelpers` 现在应该 include 哪个路径？

请改为 `#include "mc/util/JsonHelpers.h"`。头文件位置发生变动时，可直接在 LeviLamina 头文件中搜索对应类名。

*适用版本：LeviLamina 1.0.0 及以上*
