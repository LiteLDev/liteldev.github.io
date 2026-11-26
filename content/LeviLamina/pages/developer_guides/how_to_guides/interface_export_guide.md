# Interface Export Guide

To export functions or methods from a mod, you can use a macro similar to LeviLamina's `LLAPI`. Add the following code to your header file:

```cpp
#ifdef MOD_EXPORT
#define MODAPI __declspec(dllexport)
#else
#define MODAPI __declspec(dllimport)
#endif
```

In your mod's `xmake.lua`, add `add_defines("MOD_EXPORT")`, and then prepend `MODAPI` to the functions or methods you want to export. In practice, rename `MOD_EXPORT` and `MODAPI` to avoid conflicts with macros from other mods.