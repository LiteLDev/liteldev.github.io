# MoreDimensions

## MoreDimensions（多维度）能创建超平坦维度吗？

可以，超平坦是最容易实现的维度类型：

```cpp
CustomDimensionManager::getInstance().addSimpleDimension("myns:flat", 345, GeneratorType::Flat);
```

测试构建中的 `custom_dim:new_flat_type` 就是超平坦维度。注意，维度越多，服务器负担越大。

*适用版本：MoreDimensions v0.14.0 及以上*

## 按照 MoreDimensions wiki 的 SimpleExample 教程编写自定义维度 mod，xmake 构建失败，怎么办？

wiki 中的 SimpleExample 示例代码使用了 `EventBus`，却未包含对应的头文件，需补充 `#include "ll/api/event/EventBus.h"`。此外，MoreDimensions 从 0.14.0 版本起不再导出 `SimpleCustomDimension`，需要将 wiki 中的 `addDimension<more_dimensions::SimpleCustomDimension>("name", 345, GeneratorType::Flat)` 改为 `more_dimensions::CustomDimensionManager::getInstance().addSimpleDimension("name", 345, GeneratorType::Flat);`（可参考仓库中的 `src/test/TestCustomDimension.cpp`）。文档见 <https://github.com/LiteLDev/MoreDimensions/wiki>。

*适用版本：MoreDimensions 当前版本（0.16.0）及 wiki SimpleExample 现状*
