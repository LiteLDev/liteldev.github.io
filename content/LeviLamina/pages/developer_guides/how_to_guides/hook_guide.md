# Hook Guide

## Introduction

Hooking is a technique for modifying the behavior of functions at runtime without changing the original source code.

See Wikipedia's article on hooking: [Hooking](https://en.wikipedia.org/wiki/Hooking)

LeviLamina provides well-packaged Hook APIs that let you quickly and conveniently modify the behavior of game functions in Minecraft Bedrock Edition.

## Defines of Hooks

[`ll/api/memory/Hook.h`](https://github.com/LiteLDev/LeviLamina/blob/a4e181914f7a4cc3a6a574fe9d4e9976a25a684a/src/ll/api/memory/Hook.h#L261) defines the following Hook macros:

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

Hooks marked with `AUTO` register automatically by calling the `hook()` function at runtime.  
Hooks marked with `TYPE` make your `DEF_TYPE` inherit from the specified type.

### STATIC_HOOK

For hooking static functions.

### INSTANCE_HOOK

For hooking member functions.

## Explanation of Hook Parameters

`DEF_TYPE`: The type name you give to your Hook.

`PRIORITY`: [Hook priority](https://github.com/LiteLDev/LeviLamina/blob/a4e181914f7a4cc3a6a574fe9d4e9976a25a684a/src/ll/api/memory/Hook.h#L45), e.g., `ll::memory::HookPriority::Normal`

!!! note
    Unless you have a special need, we do not recommend using a very high priority; Normal is generally sufficient.

`TYPE`: The type from which `DEF_TYPE` inherits.

`IDENTIFIER`: The function to hook, usually a member function pointer such as `&TargetType::targetFunction`.

`RET_TYPE`: The return type of the Hook function.

`...`: The parameter list of the Hook function.

## Using Hooks

### A Simple Hook Example

```cpp
#include "ll/api/memory/Hook.h"

LL_AUTO_TYPE_INSTANCE_HOOK(
    MyHook,
    ll::memory::HookPriority::Normal,
    TargetType,
    &TargetType::targetFunction,
    void
) {
    // your code before the original function
    origin();
    // your code after the original function
}
```

`TargetType` and `targetFunction` are placeholders for the class and member function you want to hook.

Because the target is a member function, we use an `INSTANCE_HOOK`, so we do not need to write the compiler-generated [`this pointer`](https://en.cppreference.com/w/cpp/language/this) as the first parameter.

We use an `AUTO` Hook so that it registers automatically when the mod loads.

Finally, for convenience, we use a `TYPE` Hook so that we can call member functions of `TargetType` directly in the function body.

### Registering and Unloading Hooks

#### Registration

For Hooks that do not register automatically, call the `hook()` function when your mod needs to register the Hook.

#### Unloading

All Hooks unload automatically when Minecraft unloads. You can also call the `unhook()` function when your mod needs to unload the Hook.

## In Conclusion

Hooking is a powerful technique, but also a double-edged sword. Used improperly, it can crash the Minecraft core or mods, and in severe cases damage game saves.

Use Hooks with caution, and check your code carefully to avoid unnecessary errors.
