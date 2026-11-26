# Reflection

`ll/api/reflection/` · **Common**

## Overview

The reflection module maps C++ structs to and from JSON or NBT without hand-writing a reader and writer for every type. Typical uses:

- mod configuration files ([Config](config.md) is built on top of it)
- the mod manifest, `manifest.json`
- persistence such as world or player data
- custom NBT data (`CompoundTagVariant`)
- network packets and other JSON-like or NBT-like structures

It is not specific to JSON: `nlohmann::json` is just the most common target. The same code handles any type that exposes queries such as `is_object`, `is_array`, and `is_string` along with the `object()` and `array()` factories.

**How to read this page:**

1. Store a plain struct as JSON — read the Quick Start.
2. Give a type a string form (a version number, an ID, a UUID) — read Specializing a Simple Type.
3. Control required fields, write advanced specializations, or debug a specialization that appears to do nothing — read [Reflection (Advanced)](reflection_advanced.md).

## Headers

| Header | Description |
|--------|-------------|
| `ll/api/reflection/Reflection.h` | Core reflection utilities, member iteration, string conversion |
| `ll/api/reflection/Serialization.h` | Generic serialization |
| `ll/api/reflection/Deserialization.h` | Generic deserialization |
| `ll/api/reflection/Serializer.h` | Extension point for custom serializers |
| `ll/api/reflection/Dispatcher.h` | Dispatcher support |
| `ll/api/reflection/ReflectionError.h` | Common reflection errors |
| `ll/api/reflection/TypeName.h` | Compile-time type names and name trimming |

## Reflectable Types

An **aggregate** needs no specialization at all. This means no user-declared constructors, no private or protected non-static data members, and no private or protected bases. Typical examples:

- Plain structs with public data members
- Nested aggregate structs
- Containers and optionals inside aggregates

By default, member names map to field names recursively. Here is how each kind of type maps:

| C++ type | Output | Notes |
| --- | --- | --- |
| arithmetic `int` / `float` / `double` … | number | `bool` becomes a boolean; numeric conversion is strict (see below) |
| `std::string` and other string types | string | |
| `std::string_view` | string | deserializes only from a safely borrowable lvalue source (see the advanced page) |
| enums | string (the enum name) | falls back to the underlying integer when no name is available |
| `std::optional<T>` | whatever `T` maps to | an empty optional as an object member **omits the whole key** instead of writing `null` |
| `std::variant<...>` | whatever the current alternative maps to | |
| `std::pair` / `std::tuple` / `std::array` | array | the element count must match exactly on deserialization |
| `std::vector` / `std::list` / `std::set` … | array | |
| `std::map` / `std::unordered_map` … | object | the key type must be convertible to a string |
| nested aggregates | object | the same rules apply recursively |

Two behaviors regularly surprise people:

- **Default deserialization requires every non-optional member to be present.** Default member initializers (`int level = 0;`) are not used as a fallback: a missing field reports a missing-field error, while extra keys in the input are ignored.
- **Numeric conversion is strict**: out-of-range values (`300` into an `int8`), fractional values written into an integer type, and negative values written into an unsigned type all report an error instead of truncating or wrapping. Booleans written into an arithmetic type become 0 or 1.

Types that do not fit these rules (private members, user-declared constructors, custom construction logic, or a required string or discriminated representation) need a `Serializer<T>` specialization, described below.

## Quick Start: Basic Aggregate Types

Three steps.

### 1. Define the struct

Public data members are all you need:

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

### 2. Serialize

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

The result is an object keyed by member name:

```json
{
    "health": 20.0,
    "level": 10,
    "name": "Steve"
}
```

Because `nlohmann::json` sorts keys, this order differs from the declaration order. Switch to `nlohmann::ordered_json` to keep the declaration order (the config system does this).

### 3. Deserialize

```cpp
ll::Expected<PlayerData> fromJson(nlohmann::json const& json) {
    return ll::reflection::deserialize_to<PlayerData>(json);
}
```

`deserialize_to<T>` reads a fresh `T`. To populate an existing object (such as a config object owned by the caller), call `deserialize(out, json)` instead.

By default, member names map to field names recursively, as shown in the table above. Deserialization is **strict**: a missing non-optional member reports a missing-field error, while extra keys in the input are ignored.

## Core API

### Serialization

```cpp
template <typename J, typename T, IsKeyFormatter F>
Expected<J> serialize(T&& value, F const& keyFormatter) noexcept;

template <typename J, typename T>
Expected<J> serialize(T&& value) noexcept;

template <class J, class T, IsKeyFormatter F>
Expected<> serialize_to(J& out, T&& value, F const& keyFormatter) noexcept;
```

`J` is the target type: `nlohmann::json`, `CompoundTagVariant`, or a type you support yourself through `Serializer<T>`.

### Deserialization

```cpp
template <class T, class J, IsKeyFormatter F>
Expected<> deserialize(T& out, J&& input, F const& keyFormatter) noexcept;

template <class T, class J>
Expected<> deserialize(T& out, J&& input) noexcept;

template <class T, class J, IsKeyFormatter F>
Expected<T> deserialize_to(J&& input, F const& keyFormatter) noexcept;
```

All public entry points return `ll::Expected`, used just like the rest of the API:

```cpp
auto json = ll::reflection::serialize<nlohmann::json>(value);
if (!json) {
    return ll::forwardError(json.error());   // failures carry the field path, see Error Model
}
use(*json);                                  // dereference on success
```

Most operations come in two forms, depending on whether you already have a target object:

| What you want | Entry point |
| --- | --- |
| Convert a value into a fresh target object | `serialize<J>(value)` / `deserialize_to<T>(input)` |
| Write into an existing object | `serialize_to<J>(out, value)` / `deserialize(out, input)` |

Every entry point also has an overload without a key formatter, which uses the default formatter (passing keys through unchanged).

## Specializing a Simple Type

Some types—such as UUIDs, version numbers, and resource IDs—are not naturally "a set of members". Their natural representation is a string. To serialize them as strings, provide a `Serializer<T>` specialization with two layers: **the first makes the type usable as a key, the second makes it render as a string inside objects**.

Consider a strongly typed ID:

```cpp
struct PlayerId {
    uint64 value{};

    std::string                   toString() const;                  // e.g. "0000-0000-0001"
    static ll::Expected<PlayerId> tryParse(std::string_view text);    // returns an error on bad input
};

template <>
struct ll::reflection::Serializer<PlayerId> {
    // Layer 1: the string form, used by associative keys and type_to_string / string_to_type
    static std::string            to_string(PlayerId const& value) { return value.toString(); }
    static ll::Expected<PlayerId> from_string(std::string_view text) { return PlayerId::tryParse(text); }

    // Layer 2: render as a string inside objects as well
    template <typename J, typename F>
    static ll::Expected<J> serialize(PlayerId const& value, F const&) {
        return J{value.toString()};
    }

    template <typename J, typename F>
    static ll::Expected<PlayerId> deserialize(J const& j, F const&) {
        if (!j.is_string()) return ll::reflection::makeDeserStringTypeError();
        // Take string_t const&, then build the type you need from it.
        auto const& text = j.template get_ref<typename std::remove_cvref_t<J>::string_t const&>();
        return from_string(std::string_view{text});
    }
};
```

What changes:

```cpp
struct PlayerProfile {
    PlayerId    id{};
    std::string name{};
};

// serialize<nlohmann::json>(profile) now gives:
// {"id":"0000-0000-0001","name":"Steve"}
//
// a std::map<PlayerId, int> key becomes "0000-0000-0001" as well,
// and deserialize_to<PlayerId>(json) parses the string back
```

Notes:

- **Write both layers.** If you implement only `to_string` and `from_string`, the type works as a key, but as an ordinary member it is still expanded member by member (for an aggregate) or rejected as unsupported (for a non-aggregate).
- **Match the signatures exactly and never return `void`**, or the specialization will be silently ignored. See the full checklist on the [advanced page](reflection_advanced.md).
- LeviLamina uses this exact pattern for `mce::UUID` and `ll::data::Version`. Those specializations pair an in-place `serialize(t, j)` (which writes the string into the target) with a value-returning `deserialize`; the framework accepts both forms.
- To change only *how a key is formatted* (for example, uppercase UUID keys) without turning the type itself into a string, use a key formatter, described below.

## Optionals and Required Fields

Default deserialization is strict and follows two rules:

| Member declaration | When the key is missing from the input |
| --- | --- |
| `std::optional<T> m{};` | Succeeds; `m` is set to `std::nullopt` |
| Plain member `T m{};` | Reports `missing required field "m" when deserializing` |

Serialization mirrors this behavior: an empty `std::optional<T>` member **omits the whole key** rather than writing `null`. Because an absent key and `null` are indistinguishable in the output, consumers must treat the field as optional.

If you want to keep the current value or use a fallback when a field is absent, use `default_member` or `default_field` (see the member helpers section on the advanced page), or simply declare the member as `std::optional<T>`.

## Key Formatters

A key formatter controls how member names, enum names, and keys are converted during serialization and deserialization—for instance, converting everything to uppercase:

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

// Usage:
auto json = ll::reflection::serialize<nlohmann::json>(value, uppercaseAsciiKey);
auto obj  = ll::reflection::deserialize_to<MyType>(json, uppercaseAsciiKey);
```

A formatter can also customize a single key type (for example, uppercasing UUID keys while leaving parsing unchanged); see the [advanced page](reflection_advanced.md) for details.

## Error Model

Every public entry point returns `ll::Expected`, and errors include a readable path:

```text
Reflection error in field 'values[0].number':
field must be a number or boolean
```

Common failures:

| Message fragment | Meaning |
| --- | --- |
| `field must be a string` / `field must be an object` / `field must be an array` | Type mismatch |
| `missing required field "x" when deserializing` | A required field is absent |
| `field must be a number or boolean` | A number or boolean was expected |
| `number 300 is out of range for signed char` | The number does not fit the target type |
| `number 1.5 is not an integer` | A fractional value was given for an integer type |
| `invalid enum value: x` | The enum value is unknown |
| `invalid key: x` | An associative key could not be parsed |
| `could not cast target object (...) to any type in the variant` | No alternative in the variant matched |

At compile time, there are two main diagnostics, both naming the offending type:

- `cannot serialize this type: ...` / `cannot deserialize this type: ...` — the type has no valid serialization path and needs a `Serializer<T>` specialization. See the [advanced page](reflection_advanced.md) for the full list of compile-time errors and how to diagnose them.

Numeric conversion is strict across both the JSON and NBT backends: out-of-range values, fractional values, and negative values assigned to unsigned types are reported as errors rather than truncated or wrapped. Booleans written into an arithmetic type become 0 or 1.

## Common Mistakes

- Implementing only `to_string` and `from_string` while expecting the type to serialize as a string inside objects—you must implement the second layer too.
- Using a specialization signature that differs from the documented one (such as an extra `const` or a missing `typename F`). The specialization is silently ignored, and aggregate types will not even produce a diagnostic.
- Returning `void` from a specialization, which is unsupported.
- Assuming default member initializers fill in missing fields. They do not; a missing non-optional member always reports an error.
- Assuming an empty `std::optional` serializes as `null`. When it is an object member, the entire key is omitted.
- Relying on silent numeric conversions. Reading `1.5` into an `int`, `300` into an `int8`, or `-1` into an unsigned type will all fail with an error.

## Next Steps

The [advanced page](reflection_advanced.md) covers:

- the full signature table, return-type rules, and the "specialization not being used" checklist;
- member helpers (`member` / `field` / `required_field` / `default_field` for conditional requirements and fallback values);
- complex examples from the test suite: a discriminator that determines required fields, flattened output, non-default-constructible types, discriminated variants, ABI wrappers, and a single type that renders differently for JSON and NBT;
- custom target types for plugging another data structure (such as a script engine object, `Json::Value`, or your own `Value` type) into the framework;
- dispatch priorities, `std::variant` matching, `Dispatcher`, `std::string_view` lifetimes, and the compile-time error table.

## Related

- [Reflection (Advanced)](reflection_advanced.md)
- [Config](config.md): the config system, the main consumer of reflection
- [Base](base.md): the base utilities that reflection builds on (concepts, containers, `Expected`)
