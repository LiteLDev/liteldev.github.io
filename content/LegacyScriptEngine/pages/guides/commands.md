# Registering commands

A plugin can add commands to the game. Players type them after `/` with the usual completion and hints; the console,
command blocks, and NPCs can run them too. This guide registers a command with parameters, a permission, and a callback,
then shows the simpler LLSE commands.

The examples are in JavaScript, though the API is the same in every language. See [Command API](../apis/GameAPI/Command.md) for a complete reference of the functions used here.

## 1. Create the command

Create the command at the top level of your entry script, or in an `onServerStarted` listener as the reference
does. Both work because while the server is still starting, LSE postpones registration until commands can be registered. This guide uses the listener:

```js
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand("hello", "Says hello to players", PermType.Any);
    // parameters, overloads and the callback: steps 2 to 4
    cmd.setup();
});
```

`mc.newCommand(name, description, permission)` creates the command and returns a command object for you to
configure. Its name must be in lowercase English letters. The permission sets who may run it:

| Permission | Who may run the command |
|---|---|
| `PermType.Any` | Anyone. |
| `PermType.GameMasters` | Operators. |
| `PermType.Admin` | The admin permission level (the default). |
| `PermType.Console` | The console only. |

`cmd.setAlias("hi")` adds another name for the same command.

## 2. Add parameters

Each parameter has a name and a type. `mandatory` adds a required parameter, and `optional` adds one that may be
omitted:

```js
cmd.mandatory("target", ParamType.Player);
cmd.optional("message", ParamType.RawText);
```

`ParamType.Player` takes a player name or a target selector such as `@a`. `ParamType.RawText` takes the rest of the
line, spaces included, and can only be the last parameter. The [list of parameter types](../apis/GameAPI/Command.md)
lists every type and the value it passes to your callback.

## 3. Declare the forms of the command

An overload is one form of the command, defined as an ordered list of its parameters:

```js
cmd.overload(["target", "message"]);
```

With this overload, `/hello Steve`, `/hello Steve Nice to see you!`, and `/hello @a Welcome!` are valid. When a command has multiple forms—such as `/hello <target> [message]` and `/hello all`—declare one overload per form.

## 4. Handle the command

The callback runs each time the command is executed. It receives the command, the origin (who or what ran it), the output
(where to write the result), and the parameter values by name:

```js
cmd.setCallback((_cmd, origin, output, results) => {
    const from = origin.player ? origin.player.name : "The server";
    for (const player of results.target) {
        player.tell(`${from} says: ${results.message ?? "Hello!"}`);
    }
    output.success(`Said hello to ${results.target.length} player(s).`);
});
```

- `origin.player` is the player who ran the command, or `Null` if the console or a command block ran it.
- `results.target` is an array of players, since a selector can match several.
- `results.message` is undefined when the optional parameter is omitted.
- `output.success(msg)` shows the result to whoever ran the command; `output.error(msg)` shows an error.

Finally, `cmd.setup()` registers the command with the game. Here is the complete plugin:

```js
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand("hello", "Says hello to players", PermType.Any);
    cmd.mandatory("target", ParamType.Player);
    cmd.optional("message", ParamType.RawText);
    cmd.overload(["target", "message"]);
    cmd.setCallback((_cmd, origin, output, results) => {
        const from = origin.player ? origin.player.name : "The server";
        for (const player of results.target) {
            player.tell(`${from} says: ${results.message ?? "Hello!"}`);
        }
        output.success(`Said hello to ${results.target.length} player(s).`);
    });
    cmd.setup();
});
```

Restart the server and type `/hello @a` in the game, or `hello @a` in the console.

## Sub-commands with enumerations

For commands with sub-commands like `/manager add <name>` and `/manager list`, use an enumeration (a fixed set of words). Name each
set of words with `setEnum`, add a corresponding `ParamType.Enum` parameter, and pass the enumeration's name to the
overload. Here is the example from the reference:

```js
mc.listen("onServerStarted", () => {
    let cmd = mc.newCommand("manager", "Command Description", PermType.GameMasters);
    cmd.setAlias("mgr");
    cmd.setEnum("ChangeAction", ["add", "remove"]);
    cmd.setEnum("ListAction", ["list"]);
    cmd.mandatory("action", ParamType.Enum, "ChangeAction", 1);
    cmd.mandatory("action", ParamType.Enum, "ListAction", 1);
    cmd.mandatory("name", ParamType.RawText);
    cmd.overload(["ChangeAction", "name"]);
    cmd.overload(["ListAction"]);
    cmd.setCallback((_cmd, _ori, out, res) => {
        switch (res.action) {
            case "add":
                return out.success(`add "${res.name}"`);
            case "remove":
                return out.success(`remove "${res.name}"`);
            case "list":
                return out.success(`Name List:`);
        }
    });
    cmd.setup();
});
```

Both enumeration parameters are named `action`, so the callback reads the matched word from `res.action`, while the overloads reference the enumeration names to tell them apart. For a set of words that changes while the server runs (such as player names or home
names), use a soft enumeration: `setSoftEnum`, `addSoftEnumValues`, and `ParamType.SoftEnum`.

## The simple commands of LLSE

`mc.regPlayerCmd` and `mc.regConsoleCmd` register a command and its callback in a single call, passing the words after the command
as an array of strings:

```js
mc.regPlayerCmd("ping", "Answers with pong", (player, args) => {
    player.tell("Pong!");
});

mc.regConsoleCmd("backup", "Starts a backup", (args) => {
    log(`Starting backup ${args[0] ?? "default"}.`);
});
```

These functions are kept for plugins written for LLSE. Only players (`regPlayerCmd`) or the console (`regConsoleCmd`) can run
them—not command blocks or NPCs—and you must parse the arguments yourself. Use `mc.newCommand` for new plugins.

## Run a command from a plugin

`mc.runcmd("say Hello!")` runs a command in the background and returns a boolean indicating whether it succeeded. `mc.runcmdEx` also returns
the command's output without writing it to the console:

```js
const result = mc.runcmdEx("list");
log(result.output);
```
