# 钩子指南

## 介绍

Hook 是一种在运行时修改函数行为的技术，通常用于在不改动源代码的情况下改变函数的行为。

关于 Hook 的更多解释，请参阅 Wikipedia 上的 [Hooking](https://en.wikipedia.org/wiki/Hooking) 词条。

LeviLamina 提供了封装好的 Hook API，方便你快速修改 Minecraft 基岩版中游戏函数的行为。

## Hook的类型

在 [`ll/api/memory/Hook.h`](https://github.com/LiteLDev/LeviLamina/blob/a4e181914f7a4cc3a6a574fe9d4e9976a25a684a/src/ll/api/memory/Hook.h#L261) 中，我们定义了以下几种 Hook 宏：

```cpp
#define LL_TYPE_STATIC_HOOK(DEF_TYPE, PRIORITY, TYPE, IDENTIFIER, RET_TYPE, ...)

#define LL_STATIC_HOOK(DEF_TYPE, PRIORITY, IDENTIFIER, RET_TYPE, ...)

#define LL_TYPE_INSTANCE_HOOK(DEF_TYPE, PRIORITY, TYPE, IDENTIFIER, RET_TYPE, ...)

#define LL_INSTANCE_HOOK(DEF_TYPE, PRIORITY, IDENTIFIER, RET_TYPE, ...)

#define LL_AUTO_TYPE_STATIC_HOOK(DEF_TYPE, PRIORITY, TYPE, IDENTIFIER, RET_TYPE, ...)

#define LL_AUTO_STATIC_HOOK(DEF_TYPE, PRIORITY, IDENTIFIER, RET_TYPE, ...)

#define LL_AUTO_TYPE_INSTANCE_HOOK(DEF_TYPE, PRIORITY, TYPE, IDENTIFIER, RET_TYPE, ...)

#define LL_AUTO_INSTANCE_HOOK(DEF_TYPE, PRIORITY, IDENTIFIER, RET_TYPE, ...)
```

其中，带有 AUTO 的 Hook 会在运行时自动调用 hook() 函数完成注册；带有 TYPE 的 Hook 会使 DEF_TYPE 继承自你指定的类型。

### STATIC_HOOK

用于静态函数的 Hook。

### INSTANCE_HOOK

用于成员函数的 Hook。

## Hook的参数解释

`DEF_TYPE`：你为这个 Hook 定义的类型名。

`PRIORITY`：[Hook 的优先级](https://github.com/LiteLDev/LeviLamina/blob/a4e181914f7a4cc3a6a574fe9d4e9976a25a684a/src/ll/api/memory/Hook.h#L45)，例如 `ll::memory::HookPriority::Normal`。

!!! note
    除非有特殊需求，否则不推荐使用过高的优先级，使用 Normal 即可。

`TYPE`：你定义的 `DEF_TYPE` 所继承的类型。

`IDENTIFIER`：要 Hook 的目标函数，通常是成员函数指针，例如 `&TargetType::targetFunction`。

`RET_TYPE`：目标函数的返回值类型。

`...`：目标函数的参数列表。

## Hook的使用

### 简单的Hook示例

```cpp
#include "ll/api/memory/Hook.h"

LL_AUTO_TYPE_INSTANCE_HOOK(
    MyHook,
    ll::memory::HookPriority::Normal,
    TargetType,
    &TargetType::targetFunction,
    void
) {
    // 在原函数之前执行的代码
    origin();
    // 在原函数之后执行的代码
}
```

其中 `TargetType` 和 `targetFunction` 是占位符，分别代表你要 Hook 的类和成员函数。

目标是类的成员函数，因此这里选用 `INSTANCE_HOOK`，无需手动填写编译器生成的第一个 [`this指针`](https://zh.cppreference.com/w/cpp/language/this) 参数。

为了在加载模组时自动注册该 Hook，这里选用了带有 `AUTO` 的宏。

最后，为了方便起见，这里还选用了带有 `TYPE` 的宏，以便直接在函数体内调用 `TargetType` 的成员函数。

### Hook的注册和卸载

#### 注册

对于非自动注册的 Hook，你需要在模组中合适的时机手动调用 `hook()` 函数完成注册。

#### 卸载

所有 Hook 都会在 Minecraft 卸载时自动卸载。你也可以在模组需要卸载 Hook 时手动调用 `unhook()` 函数。

## 写在最后

Hook 是一项非常强大的技术，但也是一把双刃剑。使用不当可能会导致模组或 Minecraft 本体崩溃，严重时甚至会损坏存档。

因此，使用 Hook 时请务必谨慎，仔细检查代码，避免出现不必要的错误。
