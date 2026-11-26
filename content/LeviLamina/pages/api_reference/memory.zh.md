# Memory & Hook（内存与钩子）

`ll/api/memory/` · **通用**

## 概述

Memory 模块提供带优先级的函数钩子，让模组能够拦截并修改游戏行为。

## 头文件

| 头文件 | 说明 |
|--------|------|
| `ll/api/memory/Hook.h` | 函数钩子宏与注册 |

## 核心函数

### 钩子注册

```cpp
namespace ll::memory {
enum class HookPriority {
    Highest = 0,
    High    = 100,
    Normal  = 200,
    Low     = 300,
    Lowest  = 400,
};

using FuncPtr = void*;

int hook(
    FuncPtr      target,
    FuncPtr      detour,
    FuncPtr*     originalFunc,
    HookPriority priority,
    bool         suspendThreads = true
);

bool unhook(FuncPtr target, FuncPtr detour, bool suspendThreads = true);
}
```

### 钩子宏

```cpp
// 静态函数钩子（通过 HookName::hook() / HookName::unhook() 手动注册）
LL_STATIC_HOOK(HookName, HookPriority::Normal, Identifier, ReturnType, Params...) {
    // 钩子实现
    // 调用原函数: origin(args...)
}

// 静态函数钩子；钩子结构体继承自 ClassName
LL_TYPE_STATIC_HOOK(HookName, HookPriority::Normal, ClassName, &ClassName::staticFunction, ReturnType, Params...) {
    // ...
}

// 实例方法钩子；`this` 是 ClassName 实例
LL_TYPE_INSTANCE_HOOK(HookName, HookPriority::Normal, ClassName, &ClassName::method, ReturnType, Params...) {
    // 钩子实现
    // 调用原函数: origin(args...)
}

// 自动钩子（自动注册和注销）
LL_AUTO_STATIC_HOOK(HookName, HookPriority::Normal, Identifier, ReturnType, Params...) {
    // ...
}

LL_AUTO_TYPE_INSTANCE_HOOK(HookName, HookPriority::Normal, ClassName, &ClassName::method, ReturnType, Params...) {
    // ...
}
```

`Identifier` 是要 Hook 的目标函数，通常是函数指针。`LL_INSTANCE_HOOK`、`LL_AUTO_INSTANCE_HOOK` 和 `LL_AUTO_TYPE_STATIC_HOOK` 的用法相同。此外，每个宏都提供对应的 `_EX` 变体（如 `LL_TYPE_INSTANCE_HOOK_EX`），在优先级参数之后额外接受一个 `RegisterSaveOptions` 参数。

## 使用方法

### 基本钩子

```cpp
#include "ll/api/memory/Hook.h"

LL_AUTO_TYPE_INSTANCE_HOOK(
    MyHook,
    ll::memory::HookPriority::Normal,
    SomeClass,
    &SomeClass::someMethod,  // 方法指针（占位符）
    bool,
    int arg
) {
    // 'this' 是 SomeClass 实例
    // 原函数执行前的代码
    auto result = origin(arg);  // 调用原函数
    // 原函数执行后的代码
    return result;
}
```

### 带优先级的钩子

```cpp
LL_STATIC_HOOK(
    HighPriorityHook,
    ll::memory::HookPriority::High,
    &SomeClass::someFunction,  // 函数指针
    bool
) {
    // 在 Normal 优先级钩子之前运行
    return origin();
}

// LL_STATIC_HOOK 不会自动注册
void enable() { HighPriorityHook::hook(); }
```

## 平台说明

- 优先使用函数指针（`&ClassName::method`）作为钩子目标
- 钩子优先级决定执行顺序（数值越小，执行越早）

## 相关模块

- [操作指南：钩子](../developer_guides/how_to_guides/hook_guide.zh.md) — 分步教程
