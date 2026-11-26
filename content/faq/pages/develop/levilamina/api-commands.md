# LeviLamina mod API: commands

## When developing a LeviLamina client mod, registering commands in `onEnable` as the documentation shows does not work. How do I register client and server commands?

Commands are either client commands or server commands. Register server commands through `ll::command::CommandRegistrar::getInstance(false)` (or `getServerInstance()`), and client commands through `getInstance(true)` (or `getClientInstance()`, which exists only in client builds).

The client enables all mods as soon as the game finishes starting (when the main menu appears). Because no command registry exists yet at that point, registering any command in `enable()` fails. Instead:

1. Listen for `ll::event::ServerCommandRegisterEvent` and register server commands in the callback.
2. Listen for `ll::event::ClientCommandRegisterEvent` and register client commands in the callback.

On a dedicated server (BDS), mods are enabled after the world loads, so you can register commands directly in `enable()`. Only server commands can be registered on BDS. In a local world, you can register both kinds; in multiplayer, you can register only client commands.

*Applies to: LeviLamina client edition 26.60.x*

## In `command.overload().execute([](CommandOrigin const& origin, CommandOutput& output){...})` when registering a LeviLamina command, what are `origin` and `output`? Must the logger come from the entry class?

`origin` (`CommandOrigin`) is the source of the command execution; you can check who ran the command using methods such as `getEntity()`, `getName()`, and `getOriginType()`. `output` (`CommandOutput`) returns the command result—for example, `output.success("...")` or `output.error("...")` (fmt formatting is supported).

The logger does not have to come from the entry mod. Although `ll::io::Logger` cannot be constructed directly, you can call `ll::io::LoggerRegistry::getInstance().getOrCreate("name")` to get a `std::shared_ptr<Logger>` for global use. For logs needed only during development, use the `debug` level.

*Applies to: LeviLamina 1.x and later*

## Which types should I use for item, block, effect and similar parameters (the old LLSE `ParamType.Item/Block/Effect`) when registering a command in a native LeviLamina mod?

Don't follow the LL2 implementation. Check the LeviLamina source file `src/ll/api/command/runtime/ParamKind.h`. The `ParamKind::Kind` enum lists every parameter type that runtime commands support, including `Item`, `BlockName`, `BlockState`, `Effect`, `ActorType`, `Actor`, `Player`, `BlockPos`, `Vec3`, `JsonValue`, and `FilePath`. `ParamKindList` gives the matching C++ types (for example, `Effect` maps to `MobEffect const*`).

*Applies to: LeviLamina 0.11 and later*

## Using the mod's logger inside a LeviLamina command callback lambda fails to compile (`this` not captured / no matching overloaded function). How do I output messages from a command callback?

In a command callback, write to the command's executor through the `CommandOutput` parameter (`output.success(...)` / `output.error(...)`, which support fmt formatting) instead of using the logger. If you do need the logger, don't capture `this`; retrieve it inside the lambda through the mod singleton, for example `my_mod::MyMod::getInstance().getSelf().getLogger().info(...)`.

*Applies to: LeviLamina 0.11 and later*

## How do I set the execute callback of a LeviLamina command overload? Does the `execute<fn>()` form still work?

No. Starting in 0.12, `execute<fn>()` (passing the callback as a template argument) was replaced with `execute(fn)` (passing the callback as a regular argument). Everything else remains the same. For example:

```cpp
cmd.overload<Params>().required("name").execute([](CommandOrigin const& origin, CommandOutput& output, Params const& params) { ... });
```

*Applies to: LeviLamina 0.12 and later*
