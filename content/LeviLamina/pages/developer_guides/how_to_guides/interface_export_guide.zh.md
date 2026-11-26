# 接口导出指南

导出模组的函数或方法时，可参考 LeviLamina 的 `LLAPI` 宏，在头文件中添加以下代码：

```cpp
#ifdef MOD_EXPORT
#define MODAPI __declspec(dllexport)
#else
#define MODAPI __declspec(dllimport)
#endif
```

在模组的 `xmake.lua` 中添加 `add_defines("MOD_EXPORT")`，然后在需要导出的函数或方法前加上 `MODAPI` 即可。实际使用时，需将 `MOD_EXPORT` 和 `MODAPI` 改名，以免与其他模组的宏冲突。