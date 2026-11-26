# LeviLamina mod API: other apis

## How do I construct an `ActorUniqueID` myself in a C++ mod?

`ActorUniqueID` is an aggregate struct with a single `int64 rawID` member, so you can use aggregate initialization: `auto id = ActorUniqueID{123};`. `ActorUniqueID{}` initializes `rawID` to 0, whereas `ActorUniqueID id;` leaves `rawID` uninitialized. When you need an invalid ID, use `ActorUniqueID::INVALID_ID()`.

## C++ `switch` cannot branch directly on `std::string`. How do I avoid a pile of `if-else` when developing a LeviLamina mod?

Hash the string into an integer first, then `switch` on the hash. LeviLamina provides `#include "ll/api/utils/HashUtils.h"`, where `ll::hash_utils::doHash(std::string_view)` is `constexpr`, and the `"xxx"_h` literal operator (in the `ll::literals::hash_literals` namespace) is `consteval` so you can use it directly in `case` labels:

```cpp
using namespace ll::literals;
switch (ll::hash_utils::doHash(str)) {
case "foo"_h: ...; break;
case "bar"_h: ...; break;
}
```

The standard library's `std::hash<std::string>{}(str)` is not `constexpr` and cannot be used in `case` labels.

*Applies to: LeviLamina 0.8 and later*

## Does LL2 (LiteLoaderBDS)'s LLAPI (such as the `Block` interfaces, the various events, NBT) still exist in LeviLamina? How do I find the corresponding interfaces?

LeviLamina does not keep LL2's API one-to-one; it rewrote it or replaced it with direct use of BDS native classes (LSE was ported on top of LeviLamina), and the naming differs from LL2. See the API documentation at <https://levimc.org/LeviLamina/api/> (for example, the `Block` class); you can obtain blocks from BDS's own block registry. LeviLamina provides only basic events (see `src/ll/api/event`); if you need all the events LL2 had, refer to the hook implementations collected in LegacyScriptEngine (`src/lse/events/*Hooks.cpp`). Avoid copying LL2 code; follow the LSE implementation instead.

## Does LeviLamina have a ready-made function for getting the system time?

Yes. `ll::sys_utils::getLocalTime()` in the header `ll/api/utils/SystemUtils.h` (namespace `ll::inline utils::sys_utils`, so you can write `ll::sys_utils::` directly) returns `ll::data::TmWithMs` (`std::tm` plus milliseconds); you do not need to write your own wrapper. This function still exists in the current version.

*Applies to: LeviLamina 0.13 and later*

## What is the format syntax of LeviLamina's i18n translation strings?

It uses `fmt::format` syntax (`{}` placeholders, `{0}` positional arguments, named arguments, format specifiers, and so on)—for example, `"key"_tr(arg1, arg2)`. In the translation text, refer to arguments with `{}` / `{0}`.

*Applies to: all versions*

## Which class represents the axe item in the LeviLamina headers?

The axe is `HatchetItem` (`mc/world/item/HatchetItem.h`). It inherits from `DiggerItem`; search for `DiggerItem` to find all digging-tool items.

*Applies to: LeviLamina current version*

## In newer LeviLamina headers `mc/deps/json/JsonHelpers.h` is gone. Which path should I include for `JsonHelpers` now?

Use `#include "mc/util/JsonHelpers.h"`. When a header moves, search the LeviLamina headers for the class name.

*Applies to: LeviLamina 1.0.0 and later*
