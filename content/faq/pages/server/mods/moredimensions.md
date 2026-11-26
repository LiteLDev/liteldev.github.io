# MoreDimensions

## Can MoreDimensions (multi-dimension) create a flat dimension?

Yes. A flat dimension is the easiest type to implement:

```cpp
CustomDimensionManager::getInstance().addSimpleDimension("myns:flat", 345, GeneratorType::Flat);
```

In the test build, `custom_dim:new_flat_type` is a flat dimension. Keep in mind that adding more dimensions increases the load on the server.

*Applies to: MoreDimensions v0.14.0 and later*

## I followed the SimpleExample tutorial in the MoreDimensions wiki to write a custom dimension mod, and the xmake build fails. What should I do?

The SimpleExample code in the wiki uses `EventBus` without including its header, so add `#include "ll/api/event/EventBus.h"`. Also, `SimpleCustomDimension` is no longer exported as of MoreDimensions 0.14.0, so replace `addDimension<more_dimensions::SimpleCustomDimension>("name", 345, GeneratorType::Flat)` from the wiki with `more_dimensions::CustomDimensionManager::getInstance().addSimpleDimension("name", 345, GeneratorType::Flat);` (see `src/test/TestCustomDimension.cpp` in the repository). Documentation: <https://github.com/LiteLDev/MoreDimensions/wiki>

*Applies to: MoreDimensions current version (0.16.0) and the current state of the wiki SimpleExample*
