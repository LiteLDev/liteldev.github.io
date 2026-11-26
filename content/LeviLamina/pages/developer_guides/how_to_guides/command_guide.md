# Command Guide

LeviLamina provides an easy-to-use command registration system that supports both compile-time and runtime registration. This guide covers compile-time command registration only. If you are building your own scripting engine, runtime command registration might be useful. Until this guide covers runtime command registration, you can refer to the implementation in [LegacyScriptEngine](https://github.com/LiteLDev/LegacyScriptEngine/blob/e14c9aa33b87e90c7aa1bbf2ab1ec2cc0bbedda3/src/legacy/api/CommandAPI.cpp#L231) or to [CommandTest](https://github.com/LiteLDev/LeviLamina/blob/0e47aab32d734245c5ac42dd71b08b3eb77884f6/src-test/server/testCommand.cpp#L134) in LeviLamina. Note that LegacyScriptEngine has existed since LiteLoaderBDS v1, so many of its approaches are now outdated.

## Usage

1. Include the necessary header files:
    ```cpp
    #include "ll/api/command/CommandHandle.h"
    #include "ll/api/command/CommandRegistrar.h"
    ```
2. Call `CommandRegistrar::getInstance(false).getOrCreateCommand` to obtain or create a command and assign it to `auto& command`. The argument to `getInstance` specifies whether the command is client-side (`false` registers a server-side command); `getServerInstance()` and `getClientInstance()` are shorthands.
3. Call `command.overload` to overload the command. If the command does not take parameters, you can omit the template arguments, for example: `command.overload()`.
4. Call `required` to add a mandatory parameter. Both this method and `optional` take the field names from the corresponding struct. Call `optional` to add an optional parameter, and make sure to check whether the user provided it. Call `text` to add a subcommand. For other methods, see `ll/api/command/Overload.h` or use Intellisense.
5. Call `execute` to pass in the command's callback function. See the example below for the callback function's parameters.

## Example

```cpp
#include "ll/api/command/CommandHandle.h"
#include "ll/api/command/CommandRegistrar.h"

struct NewCommand {
    enum class NewEnum { a = 0, b = 1, c = 2 } enum1;
    std::string str;
    int         number = 1;
};

void registerCommand() {
    using namespace ll::command;
    auto& command = CommandRegistrar::getInstance(false).getOrCreateCommand("new", "A example command");
    command.overload<NewCommand>().text("test").required("enum1").required("str").optional("number").execute(
        [](CommandOrigin const& origin, CommandOutput& output, NewCommand const& param) {
            output.success("test! {} {} {}", param.enum1, param.str, param.number);
        }
    );
}
```

This example defines a `NewCommand` struct to hold the command parameters. It calls `getOrCreateCommand` to create a command named **new**, then uses `overload` to add a **test** subcommand (via `text("test")`) along with an enumeration, a string, and an integer parameter. In-game usage looks like this:

```
/new test <enum1> <str> [number]
```

