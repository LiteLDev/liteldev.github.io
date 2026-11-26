# Reflection（反射）

`ll/api/reflection/` · **通用**

## 概述

Reflection 模块负责在 C++ 结构体与 JSON / NBT 之间双向映射，免去为每个类型手写读写代码的麻烦。常见用途包括：

- 模组配置（[Config](config.zh.md) 即基于此模块构建）
- 模组清单 `manifest.json`
- 存档、玩家数据等持久化内容
- 自定义 NBT 数据（`CompoundTagVariant`）
- 网络包或其他 JSON-like / NBT-like 结构

该模块不仅支持 JSON，`nlohmann::json` 只是最常见的目标类型之一。任何提供 `is_object`、`is_array`、`is_string` 等查询接口以及 `object()`、`array()` 工厂方法的类型，都能用同一套代码处理。

**这一页怎么读：**

1. 想把普通结构体存成 JSON —— 看「快速上手」；
2. 想让某个类型以字符串形式出现（比如版本号、UUID）—— 看「给一个类型写最简单的特化」；
3. 需要控制必选规则、编写复杂特化，或者遇到"特化明明写了却没生效"的问题 —— 看[Reflection（反射 · 进阶）](reflection_advanced.zh.md)。

## 头文件

| 头文件 | 说明 |
|--------|------|
| `ll/api/reflection/Reflection.h` | 核心反射工具、成员遍历、字符串转换 |
| `ll/api/reflection/Serialization.h` | 通用序列化 |
| `ll/api/reflection/Deserialization.h` | 通用反序列化 |
| `ll/api/reflection/Serializer.h` | 自定义扩展点 |
| `ll/api/reflection/Dispatcher.h` | Dispatcher 支持 |
| `ll/api/reflection/ReflectionError.h` | 常见反射错误 |
| `ll/api/reflection/TypeName.h` | 编译期类型名与类型名裁剪工具 |

## 什么类型可以直接反射

**聚合体**类型无需编写任何特化即可直接序列化。聚合体要求没有用户声明的构造函数、没有私有或受保护的非静态数据成员，且没有私有或受保护的基类。典型例子包括：

- 仅含公开数据成员的普通结构体
- 嵌套聚合结构体
- 成员包含容器、`std::optional` 或 `std::variant` 的结构体

默认映射规则为「成员名 → 字段名」，并逐个成员递归处理。各类型的映射关系如下：

| C++ 类型 | 输出 | 备注 |
| --- | --- | --- |
| 算术类型 `int` / `float` / `double` … | 数字 | `bool` 输出布尔值；数值转换采用严格模式，见下文 |
| `std::string` 等字符串类型 | 字符串 | |
| `std::string_view` | 字符串 | 只能从可安全借用的左值源反序列化，见进阶篇 |
| 枚举 | 字符串（枚举名） | 无法获取名称时退回底层整数 |
| `std::optional<T>` | `T` 的表示 | 作为对象成员且为空值时**整个键被省略**，而非输出 `null` |
| `std::variant<...>` | 当前分支的表示 | |
| `std::pair` / `std::tuple` / `std::array` | 数组 | 反序列化时元素个数必须一致 |
| `std::vector` / `std::list` / `std::set` … | 数组 | |
| `std::map` / `std::unordered_map` … | 对象 | 键类型必须能转换为字符串 |
| 嵌套聚合体 | 对象 | 递归应用同一套规则 |

有两个容易踩坑的细节：

- **默认反序列化要求所有非 optional 成员都出现在输入里**。成员的默认初始化值（`int level = 0;`）不会用于补齐缺失字段，缺字段会直接报缺失字段错误；输入中多余的键则会被忽略。
- **数值转换是严格的**：数值越界（例如将 `300` 写入 `int8`）、向整数类型写入小数、向无符号类型写入负数都会报错，而不会静默截断或回绕；布尔值写入算术类型则会变成 0 / 1。

不满足上述条件的类型（有私有成员、自定义构造函数、需要专门的构造逻辑，或需序列化为字符串、带判别字段的对象等），需要编写 `Serializer<T>` 特化，具体做法见下文。

## 快速上手：基础聚合类型

初次使用只需三步。

### 1. 定义结构体

将字段定义为公开的普通数据成员即可：

```cpp
#include "ll/api/reflection/Deserialization.h"
#include "ll/api/reflection/Serialization.h"

#include "nlohmann/json.hpp"

struct PlayerData {
    std::string name{};
    int         level{};
    double      health{};
};
```

### 2. 序列化

```cpp
ll::Expected<nlohmann::json> toJson() {
    PlayerData const player{
        .name   = "Steve",
        .level  = 10,
        .health = 20.0,
    };
    return ll::reflection::serialize<nlohmann::json>(player);
}
```

输出结果是按成员名展开的对象：

```json
{
    "health": 20.0,
    "level": 10,
    "name": "Steve"
}
```

`nlohmann::json` 默认按键名排序，因此输出顺序与成员声明顺序不同；若要保持声明顺序，可改用 `nlohmann::ordered_json`（配置系统正是这样做的）。

### 3. 反序列化

```cpp
ll::Expected<PlayerData> fromJson(nlohmann::json const& json) {
    return ll::reflection::deserialize_to<PlayerData>(json);
}
```

`deserialize_to<T>` 会读取并返回一个新的 `T`；如果要写入已有对象（例如调用方持有的配置对象），请改用 `deserialize(out, json)`。

默认规则是「成员名 → 字段名」，逐成员递归处理；各类型的具体映射方式见上一节的对照表。注意该过程是**严格**的：输入中只要缺少一个非 optional 成员就会报缺失字段错误，多余的键则会被静默忽略。

## 核心 API

### 序列化

```cpp
template <typename J, typename T, IsKeyFormatter F>
Expected<J> serialize(T&& value, F const& keyFormatter) noexcept;

template <typename J, typename T>
Expected<J> serialize(T&& value) noexcept;

template <class J, class T, IsKeyFormatter F>
Expected<> serialize_to(J& out, T&& value, F const& keyFormatter) noexcept;
```

其中 `J` 是目标类型，例如 `nlohmann::json`、`CompoundTagVariant`，或通过 `Serializer<T>` 自定义支持的类型。

### 反序列化

```cpp
template <class T, class J, IsKeyFormatter F>
Expected<> deserialize(T& out, J&& input, F const& keyFormatter) noexcept;

template <class T, class J>
Expected<> deserialize(T& out, J&& input) noexcept;

template <class T, class J, IsKeyFormatter F>
Expected<T> deserialize_to(J&& input, F const& keyFormatter) noexcept;
```

所有公开入口均返回 `ll::Expected`，用法与 LeviLamina 的其他 API 一致：

```cpp
auto json = ll::reflection::serialize<nlohmann::json>(value);
if (!json) {
    return ll::forwardError(json.error());   // 错误信息自带字段路径，见「错误模型」
}
use(*json);                                  // 成功时解引用取值
```

同一操作通常提供两个入口，可根据"手上有没有现成的目标对象"来选择：

| 你想做的事 | 用哪个入口 |
| --- | --- |
| 把值转成目标类型，拿到一个新对象 | `serialize<J>(value)` / `deserialize_to<T>(input)` |
| 写进一个已经存在的目标对象 | `serialize_to<J>(out, value)` / `deserialize(out, input)` |

每个入口都提供带 key formatter 和不带 formatter 两个版本；不带 formatter 时使用默认 formatter（保留键名原样）。

## 给一个类型写最简单的特化

像 UUID、版本号、资源 ID 这类类型，天生不适合"按成员展开"，直接表示为字符串才最自然。此时可以为 `Serializer<T>` 编写特化，共分两层——**第一层让它在当键时能转成字符串，第二层让它在对象里也输出成字符串**。

以强类型 ID 为例：

```cpp
struct PlayerId {
    uint64 value{};

    std::string                   toString() const;                     // 例如 "0000-0000-0001"
    static ll::Expected<PlayerId> tryParse(std::string_view text);       // 解析失败时返回错误
};

template <>
struct ll::reflection::Serializer<PlayerId> {
    // 第一层：字符串形式，关联容器键与 type_to_string / string_to_type 会用
    static std::string            to_string(PlayerId const& value) { return value.toString(); }
    static ll::Expected<PlayerId> from_string(std::string_view text) { return PlayerId::tryParse(text); }

    // 第二层：让它在对象里也输出成字符串
    template <typename J, typename F>
    static ll::Expected<J> serialize(PlayerId const& value, F const&) {
        return J{value.toString()};
    }

    template <typename J, typename F>
    static ll::Expected<PlayerId> deserialize(J const& j, F const&) {
        if (!j.is_string()) return ll::reflection::makeDeserStringTypeError();
        // 拿到 string_t const&，再自己构造成需要的类型
        auto const& text = j.template get_ref<typename std::remove_cvref_t<J>::string_t const&>();
        return from_string(std::string_view{text});
    }
};
```

特化前后的对比：

```cpp
struct PlayerProfile {
    PlayerId    id{};
    std::string name{};
};

// serialize<nlohmann::json>(profile) 得到：
// {"id":"0000-0000-0001","name":"Steve"}
//
// std::map<PlayerId, int> 的键同样是 "0000-0000-0001"
// deserialize_to<PlayerId>(json) 从字符串解析回对象
```

注意事项：

- **两层要一起写**：如果只写 `to_string` / `from_string`，该类型作为键时没有问题，但作为普通成员时仍会按成员展开（聚合体）或直接报错（非聚合体）。
- **签名要对齐、返回值不要写 `void`**，否则特化会被静默忽略——完整清单见[进阶篇](reflection_advanced.zh.md)。
- LeviLamina 内部对 `mce::UUID` 和 `ll::data::Version` 就采用了这种做法；它们使用的是「原地式序列化 + 值式反序列化」组合（通过 `serialize(t, j)` 将字符串写入目标），框架对两种写法均支持。
- 如果只想改变"键的写法"（例如将 UUID 键转为全大写），而不希望类型本身变成字符串，请使用下一节介绍的 key formatter。

## 可选与必选字段

默认的反序列化规则非常严格，只有两条：

| 成员声明 | 输入里缺这个键时 |
| --- | --- |
| `std::optional<T> m{};` | 成功，`m` 变成 `std::nullopt` |
| 普通成员 `T m{};` | 报 `missing required field "m" when deserializing` |

序列化时的行为也与之对应：当成员为空的 `std::optional<T>` 时，**整个键会被省略**，而不是写成 `null`。这意味着在输出结果中无法区分"缺键"和 `null`，读取方需将其作为可选字段处理。

如果需要"缺字段时保留旧值"或"缺字段时用默认值"这类语义，请使用 `default_member` / `default_field`（见进阶篇的成员辅助函数一节），或者直接将成员改为 `std::optional<T>`。

## Key Formatter

Key formatter 用于控制成员名、枚举名和键名在序列化与反序列化时的转换方式，例如统一转为大写：

```cpp
#include <algorithm>
#include <cctype>

std::string uppercaseAsciiKey(std::string_view key) {
    std::string result{key};
    std::ranges::transform(result, result.begin(), [](unsigned char ch) {
        return static_cast<char>(std::toupper(ch));
    });
    return result;
}

// 使用：
auto json = ll::reflection::serialize<nlohmann::json>(value, uppercaseAsciiKey);
auto obj  = ll::reflection::deserialize_to<MyType>(json, uppercaseAsciiKey);
```

formatter 还可以仅针对特定键类型进行定制（例如将 UUID 键转为大写，但保持解析规则不变），具体用法见[进阶篇](reflection_advanced.zh.md)。

## 错误模型

所有公开接口均返回 `ll::Expected`，失败时会附带包含路径的可读错误信息，例如：

```text
Reflection error in field 'values[0].number':
field must be a number or boolean
```

常见错误如下：

| 错误信息（片段） | 含义 |
| --- | --- |
| `field must be a string` / `field must be an object` / `field must be an array` | 类型不匹配 |
| `missing required field "x" when deserializing` | 缺少必选字段 |
| `field must be a number or boolean` | 期望数字或布尔值 |
| `number 300 is out of range for signed char` | 数值越界 |
| `number 1.5 is not an integer` | 向整数类型写入了小数 |
| `invalid enum value: x` | 枚举值非法 |
| `invalid key: x` | 关联容器的键非法 |
| `could not cast target object (...) to any type in the variant` | variant 中没有任何分支能够匹配 |

编译期报错主要有以下两条，均会附带具体的类型名称：

- `cannot serialize this type: ...` / `cannot deserialize this type: ...`：该类型没有可用的反射路径，需要编写 `Serializer<T>` 特化。完整的编译期报错对照表与排查方法见[进阶篇](reflection_advanced.zh.md)。

数值转换采用严格模式：越界、带小数、向无符号类型写入负数均会报错，而不会静默截断或回绕，JSON 与 NBT 两个后端的行为完全一致；布尔值写入算术类型则会变成 0 / 1。

## 常见误区

- 只写了 `to_string` / `from_string`，就期望在对象中输出为字符串——必须同时编写第二层特化。
- 特化签名与文档不一致（多一个 `const`、少一个 `typename F`）——特化会被静默忽略，若类型为聚合体甚至不会报错。
- 返回值写成了 `void`——不支持这种写法。
- 误以为成员的默认初始化值会自动补齐缺失字段——并不会，缺少非 optional 成员会直接报错。
- 误以为空的 `std::optional` 会输出为 `null`——作为对象成员时，整个键都会被省略。
- 依赖静默的数值转换——将 `1.5` 写入 `int`、`300` 写入 `int8`、`-1` 写入无符号类型均会报错。

## 下一步

如需了解以下内容，请参见[Reflection（反射 · 进阶）](reflection_advanced.zh.md)：

- 完整签名表、返回值约束，以及“特化没生效”的自查清单；
- 成员辅助函数（`member` / `field` / `required_field` / `default_field`：条件必选、默认值）；
- 摘自测试的复杂示例：判别字段结构、扁平化输出、不可默认构造的类型、判别式变体、ABI 包装、JSON 与 NBT 双形态；
- 自定义目标类型：将其他数据结构（脚本引擎对象、`Json::Value`、自定义的 `Value` 类型）接入反射；
- 调度优先级、`std::variant` 匹配规则、`Dispatcher`、`std::string_view` 生命周期、编译期报错对照表。

## 相关文档

- [Reflection（反射 · 进阶）](reflection_advanced.zh.md)
- [Config](config.zh.md)：配置系统，反射最主要的使用方
- [Base](base.zh.md)：反射依赖的基础类型工具（概念、容器、`Expected`）
