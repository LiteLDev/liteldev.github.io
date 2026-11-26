# Memory & Hook

`ll/api/memory/` · **Common**

## Overview

The Memory module provides function hooking with priority control. It lets mods intercept and modify game behavior.

## Headers

| Header | Description |
|--------|-------------|
| `ll/api/memory/Hook.h` | Function hooking macros and registration |

## Key Functions

### Hook Registration

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

### Hook Macros

```cpp
// Static function hook (registered manually with HookName::hook() / HookName::unhook())
LL_STATIC_HOOK(HookName, HookPriority::Normal, Identifier, ReturnType, Params...) {
    // Hook implementation
    // Call original: origin(args...)
}

// Static function hook; the hook struct derives from ClassName
LL_TYPE_STATIC_HOOK(HookName, HookPriority::Normal, ClassName, &ClassName::staticFunction, ReturnType, Params...) {
    // ...
}

// Instance method hook; `this` is the ClassName instance
LL_TYPE_INSTANCE_HOOK(HookName, HookPriority::Normal, ClassName, &ClassName::method, ReturnType, Params...) {
    // Hook implementation
    // Call original: origin(args...)
}

// Auto-hooks (registered and unregistered automatically)
LL_AUTO_STATIC_HOOK(HookName, HookPriority::Normal, Identifier, ReturnType, Params...) {
    // ...
}

LL_AUTO_TYPE_INSTANCE_HOOK(HookName, HookPriority::Normal, ClassName, &ClassName::method, ReturnType, Params...) {
    // ...
}
```

`Identifier` is the function to hook, usually a function pointer. `LL_INSTANCE_HOOK` / `LL_AUTO_INSTANCE_HOOK` and `LL_AUTO_TYPE_STATIC_HOOK` follow the same patterns, and every macro has an `_EX` variant (for example, `LL_TYPE_INSTANCE_HOOK_EX`) that takes a `RegisterSaveOptions` argument after the priority.

## Usage

### Basic Hook

```cpp
#include "ll/api/memory/Hook.h"

LL_AUTO_TYPE_INSTANCE_HOOK(
    MyHook,
    ll::memory::HookPriority::Normal,
    SomeClass,
    &SomeClass::someMethod,  // Method pointer (placeholder)
    bool,
    int arg
) {
    // 'this' is the SomeClass instance
    // Code before original
    auto result = origin(arg);  // Call original function
    // Code after original
    return result;
}
```

### Hook with Priority

```cpp
LL_STATIC_HOOK(
    HighPriorityHook,
    ll::memory::HookPriority::High,
    &SomeClass::someFunction,  // Function pointer
    bool
) {
    // This runs before Normal priority hooks
    return origin();
}

// LL_STATIC_HOOK is not registered automatically
void enable() { HighPriorityHook::hook(); }
```

## Platform Notes

- Prefer function pointers (`&ClassName::method`) as hook targets
- Hook priority determines execution order (lower number = earlier)

## Related

- [How-to Guide: Hooks](../developer_guides/how_to_guides/hook_guide.md) — Step-by-step tutorial
