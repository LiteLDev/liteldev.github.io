# Config API

## 作用

Config API 为原生模组提供类型化 JSON 配置。它可以创建默认配置、将现有用户值合并到默认结构中、规范化 JSON，并生成供启动器配置编辑器使用的 `config.schema.json`。

## 头文件

```cpp
#include <pl/Config.hpp>
```

配置类型应为简单的 aggregate struct：字段公开、带有默认成员初始化，并包含一个整数类型的 `version` 字段。

## 定义配置

```cpp
#include <pl/Config.hpp>

#include <string>
#include <vector>

enum class Profile {
  Quiet,
  Balanced,
  Verbose,
};

struct HudConfig {
  bool showMessage = true;
  std::string message = "Hello from config";
  double scale = 1.25;
};

struct ModConfig {
  int version = 1;
  bool enabled = true;
  Profile profile = Profile::Balanced;
  HudConfig hud;
  std::vector<std::string> tags = {"overlay", "example"};
};
```

生成的 JSON 字段顺序与 aggregate 字段顺序一致。反射会忽略名称以 `$` 开头的字段。

## 加载与保存

在原生模组生命周期调用期间，`ConfigFile` 默认使用当前模组的 `config/config.json` 和 `config/config.schema.json` 路径。如需使用非默认位置，也可显式传入路径。

```cpp
class MyMod {
public:
  bool load() {
    mConfig.emplace();
    if (!mConfig->load()) {
      getSelf().getLogger().warn("Failed to load config");
      return false;
    }
    return true;
  }

  bool enable() {
    return mConfig && mConfig->value().enabled;
  }

  [[nodiscard]] ll::mod::NativeMod &getSelf() const;

private:
  std::optional<pl::config::ConfigFile<ModConfig>> mConfig;
};
```

运行期修改可通过同一个 `ConfigFile` 保存：

```cpp
mConfig->value().enabled = false;
mConfig->save();
```

## 更新行为

`ConfigFile<T>::load()` 会以 C++ 默认值为基础，再合并现有的 JSON 数据。

- 缺失文件会自动创建。
- 新增字段会使用 C++ 默认值补齐。
- 只要类型可反序列化，就会保留现有用户值。
- `version` 会强制重置为 C++ 默认的 `version`。
- 文件缺失、损坏或不完整时，会自动规范化并写回。
- 规范化后不保留未知 key。

## Schema 元数据

schema 生成器可自动推断 `type`、`default`、嵌套 `properties`、数组 `items` 和枚举选项。如需添加 UI 元数据，请使用 `pl::config::Schema<T>`。

```cpp
template <> struct pl::config::Schema<ModConfig> {
  static constexpr std::string_view title = "Example Config";
  static constexpr std::string_view description =
      "Settings for the example native mod.";

  static constexpr FieldSchema field(std::string_view name) {
    if (name == "version") {
      return {.title = "Version", .readOnly = true};
    }
    if (name == "enabled") {
      return {.title = "Enabled",
              .description = "Turns the mod behavior on or off."};
    }
    if (name == "profile") {
      return {.title = "Profile",
              .description = "Selects the runtime behavior preset."};
    }
    return {};
  }
};
```

支持的元数据：

| 字段 | Schema 输出 | 用途 |
| --- | --- | --- |
| `title` | `title` | 面向用户的可读字段名。 |
| `description` | `description` | 编辑器帮助文本。 |
| `minimum` | `minimum` | 数值下限。 |
| `maximum` | `maximum` | 数值上限。 |
| `readOnly` | `readOnly` | 自动生成或仅用于展示的字段。 |

## 支持类型

| C++ 类型 | JSON 表示 |
| --- | --- |
| aggregate struct | object |
| `std::string` | string |
| `bool` | boolean |
| integral types | integer |
| floating point types | number |
| enum | `magic_enum` 可获取名称时为 string enum |
| `std::vector<T>` | array |
| `std::optional<T>` | value 或 `null` |

请保持配置对象简单，避免使用自定义构造函数、私有字段或包含复杂逻辑的配置类型。
