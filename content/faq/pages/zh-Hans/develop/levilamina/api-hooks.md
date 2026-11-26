# LeviLamina 模组 API：Hook 与内存

## LeviLamina mod 的 disable/unload 里需要手动 unhook 吗？用 `AUTO` 宏注册的 hook 会自动卸载吗？

`AUTO` 系列宏（如 `LL_AUTO_TYPE_INSTANCE_HOOK`）会生成一个全局 `HookRegistrar` 对象，在构造时挂钩（hook）、析构时卸载（unhook）。当 mod 卸载（unload）时，DLL 被释放，静态对象随之析构，这些 hook 会自动卸载，因此无需在 unload 中手动编写 unhook 代码。

但禁用（disable）mod 并不会释放 DLL，hook 依然生效。如果需要支持热重载或运行时禁用再启用（即 disable 后让 hook 失效），必须在 disable 中调用 `DEF_TYPE::unhook()`，并在 enable 中调用 `DEF_TYPE::hook()`，或者改用非 `AUTO` 宏手动管理。若无需支持热重载，则可以省去这些代码。此外，所有 hook 都会在游戏退出时自动卸载。

*适用版本：LeviLamina 0.13 及以上*

## LeviLamina 中 hook 一个成员函数用了 `STATIC_HOOK`，结果在日志/调用处报错崩溃，应该用哪种 hook 宏？

成员函数包含隐式的 `this` 指针，必须使用 `INSTANCE_HOOK` 系列宏（如 `LL_TYPE_INSTANCE_HOOK` / `LL_AUTO_TYPE_INSTANCE_HOOK`），而不能用 `STATIC_HOOK`。`STATIC_HOOK` 系列仅适用于静态函数或自由函数。详见 LeviLamina 官方文档站的 hook 指南（开发者指南 `how_to_guides/hook_guide`）。

*适用版本：所有版本*

## LeviLamina 的 Hook 有优先级，如果高优先级的 Hook 直接 return 而不调用 `origin`，低优先级的 Hook 还会被触发吗？

不会。同一函数上的多个 Hook 按 `HookPriority` 组成调用链，优先级高的先执行（`Highest`=0 … `Lowest`=400）。每个 Hook 必须调用 `origin(...)`，才会进入下一个（优先级更低的）Hook，并最终到达原函数。如果高优先级 Hook 不调用 `origin` 就直接返回，调用链就会中断，低优先级 Hook 和原函数都不会执行。

*适用版本：所有版本*

## LeviLamina 的 hook 宏（如 `LL_AUTO_TYPE_INSTANCE_HOOK`）写在函数里报错（括号后红色波浪线），为什么？

hook 宏本质上会展开为一个结构体（类型）定义（包含 `inline static` 成员、模板特化等），只能写在命名空间或全局作用域中，不能放在函数体内。请将宏移到函数外定义；如果使用非 AUTO 版本（`LL_TYPE_INSTANCE_HOOK`），可以在需要时通过 `Hook::hook()` / `unhook()` 或 `ll::memory::HookRegistrar` 手动注册。

*适用版本：所有版本*
