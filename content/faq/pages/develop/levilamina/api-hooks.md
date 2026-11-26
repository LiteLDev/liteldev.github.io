# LeviLamina mod API: hooks and memory

## Do I need to unhook manually in a LeviLamina mod's disable/unload? Are hooks registered with the `AUTO` macros unloaded automatically?

The `AUTO` macros (`LL_AUTO_TYPE_INSTANCE_HOOK` and so on) generate a global `HookRegistrar` object that hooks on construction and unhooks on destruction. When the mod is unloaded (the DLL is released and static objects are destroyed), these hooks are removed automatically, so you do not need to unhook in unload. Merely disabling the mod does not release the DLL, so the hooks stay active. If you want hooks to stop working after disable (to support hot reload or disabling and re-enabling at runtime), call `DEF_TYPE::unhook()` in disable and `DEF_TYPE::hook()` in enable (or use non-`AUTO` hooks and manage them manually). If you do not plan to support hot reload, you can omit this code. All hooks are also removed automatically when the game exits.

*Applies to: LeviLamina 0.13 and later*

## I hooked a member function with `STATIC_HOOK` and got an error or crash in the log or at the call site. Which hook macro should I use?

Because a member function has a `this` pointer, use the `INSTANCE_HOOK` family (such as `LL_TYPE_INSTANCE_HOOK` / `LL_AUTO_TYPE_INSTANCE_HOOK`) instead of `STATIC_HOOK`. The `STATIC_HOOK` family is only for static or free functions. See the hook guide on the official LeviLamina documentation site (developer guide `how_to_guides/hook_guide`).

*Applies to: all versions*

## LeviLamina hooks have priorities. If a high-priority hook returns directly without calling `origin`, are lower-priority hooks still triggered?

No. Multiple hooks on the same function form a call chain ordered by `HookPriority`. Higher-priority hooks run first (`Highest`=0 ... `Lowest`=400), and each hook advances to the next (lower-priority) hook only by calling `origin(...)`, until the original function is reached. If a high-priority hook returns without calling `origin`, the chain stops there, and neither the lower-priority hooks nor the original function run.

*Applies to: all versions*

## Why does a LeviLamina hook macro (such as `LL_AUTO_TYPE_INSTANCE_HOOK`) written inside a function produce an error (a red squiggle after the parenthesis)?

A hook macro expands to a struct (type) definition with `inline static` members, template specializations, and similar constructs, so it must be placed at namespace or global scope, not inside a function body. Define the macro outside the function. If you need manual registration, use the non-AUTO version (`LL_TYPE_INSTANCE_HOOK`) with `Hook::hook()` / `unhook()` or `ll::memory::HookRegistrar`.

*Applies to: all versions*
