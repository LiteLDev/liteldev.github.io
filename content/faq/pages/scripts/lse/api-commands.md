# LegacyScriptEngine API: commands

## After registering a command with `mc.newCommand` in LSE, how do I get the player who ran the command inside the `setCallback` callback? Using `player.name` directly throws an error.

The signature of the command callback is `(cmd, origin, output, results)`. There is no Player among the parameters; the executor's information is in `origin` (CommandOrigin). Use `origin.player` to get the player object that ran the command, for example `origin.player.name`. Note that `origin.player` can be empty (for example when the command is run from the console or a command block), so check for that before using it.

*Applies to: all current versions of LegacyScriptEngine*

## Does `mc.runcmd` in LSE run automatically every tick? How do I run a command every tick?

No. `mc.runcmd` runs the command once, immediately, when it is called. To run it every tick, listen to the `onTick` event: `mc.listen("onTick", () => { mc.runcmd("...") })`. For a fixed time interval, use `setInterval(fn, milliseconds)`.

*Applies to: all current versions of LegacyScriptEngine (formerly LLSE)*

## If a command run with `mc.runcmdEx` in an LSE plugin has a syntax error, does it affect the plugin?

It does not make the plugin fail or crash. When the command fails to compile, `runcmdEx` still returns a result object normally, with `success` set to `false` and the error message in `output`, so you can check it like this:

```js
const res = mc.runcmdEx(cmd);
if (!res.success) logger.warn(res.output);
```

*Applies to: current version of LegacyScriptEngine*

## How do I hide the command feedback printed to the console when running commands in an LSE script plugin?

Use `mc.runcmdEx` instead of `mc.runcmd`. `runcmdEx` has an output-hiding mechanism: the result is not printed to the console but returned as the value `{success, output}`. If needed, print `res.output` yourself with `log`/`logger`.

*Applies to: current version of LegacyScriptEngine*

## How do I run a command with OP/console permission in an LSE plugin? How do I get the command output?

`mc.runcmd(cmd)` runs a command as the server console (ServerCommandOrigin, permission level Owner, which is higher than OP). It is not limited by player permissions and returns only a Boolean indicating whether the command succeeded. `mc.runcmdEx(cmd)` also runs as the console, suppresses the console output, and returns a `{success, output}` object so you can store `output` in a variable and inspect it.

## What is the difference between `mc.runcmd` and `mc.runcmdEx` in LSE?

`mc.runcmd(cmd)` runs a command in the background, prints its output to the console as usual, and returns only whether it succeeded (Boolean). `mc.runcmdEx(cmd)` runs the command, suppresses its console output, and returns a result object `{ success: Boolean, output: String }`. Call `log(result.output)` yourself if you still want the output printed.

Do not call `runcmd` or `runcmdEx` inside an `onConsoleCmd` listener, or it may cause an infinite loop.

## What permission level does `mc.runcmdEx` use to run commands in LSE?

The same as the console: both `mc.runcmd` and `mc.runcmdEx` run as a ServerCommandOrigin named `"Server"` with permission level `CommandPermissionLevel::Owner` (the highest), so they can run any command the console can run.

## For cross-server transfer in LSE, is it better to listen for player input (a fake command) with `mc.listen("onPlayerCmd")`, or to register a real command? How do I register one?

Register a real command. The client shows command hints for it, and it also works from command blocks and other sources. Example:

```js
mc.listen('onServerStarted', () => {
  const cmd = mc.newCommand('trans', '跨服命令', PermType.Any);
  cmd.mandatory('ip', ParamType.String);
  cmd.optional('port', ParamType.Int);
  cmd.optional('player', ParamType.Player);
  cmd.overload(['ip', 'port', 'player']);
  cmd.setCallback((_, origin, output, result) => {
    const players = result.player ?? (origin.player ? [origin.player] : []);
    players.forEach(p => p.transServer(result.ip, result.port ?? 19132));
  });
  if (!cmd.setup()) logger.error('命令安装失败！');
});
```

Note that `setup()` returns `true` on success, so negate it to check for failure. When the command is run from the console without specifying `player`, `origin.player` is empty.

## When registering an LSE command with a player selector parameter, reading `res.pl.name` in the callback gives `undefined`. Why?

A `ParamType.Player` (or `ParamType.Actor`) parameter returns an array of objects (`Array<Player>` / `Array<Actor>`), not a single object. Access it by index—for example, `res.pl[0].name`—or iterate over the array (check the array length first, because the selector may match no player).

*Applies to: all current LSE versions*

## Why does LSE's command origin type `OriginType` have no `Server`, only `DedicatedServer` and others?

LSE's runtime `OriginType` enum is generated directly from BDS's vanilla `CommandOriginType`, and its member names match the vanilla ones: `Player`, `CommandBlock`, `MinecartCommandBlock`, `DevConsole`, `Test`, `AutomationPlayer`, `ClientAutomation`, `DedicatedServer`(7), `Entity`, `Virtual`, `GameArgument`, `EntityServer`, `Precompiled`, `GameDirectorEntityServer`, `Scripting`, `ExecuteContext`. Use `OriginType.DedicatedServer` for console/server origins. The TS declarations in `legacy-script-engine-api` retain the names from the LL2 era (`Server`, `Block`, `Actor`, and so on, with `DedicatedServer` as an alias for `Server`), so editor completion suggests `Server`, even though that member does not exist at runtime. You can also get the type name as a string with `ori.typeName`.

## Does LSE's command registration API have a block states command parameter? Can I get its value?

The `ParamType` enum includes `BlockState` (value 16), and you can use it to register parameters with `mandatory` / `optional`. However, LSE does not handle this type when converting parsed command results into script values, so the parameter value in the callback is empty (`undefined`), making the type unusable in practice. If you need block states, use a string or JSON parameter and parse it yourself.

*Applies to: LSE v0.23.1*

## What is the difference between `setSoftEnum()` and `setEnum()` on the `Command` object in LSE/LLSE?

`setSoftEnum(name, values)` registers a soft enum for use with a `ParamType.SoftEnum` parameter. After the command is registered, you can still change its candidate values dynamically with methods such as `addSoftEnumValues` and `removeSoftEnumValues`. `setEnum(name, values)` registers a regular enum, which cannot be changed after registration. Use a soft enum when the candidates need to change at runtime (such as player names or a dynamic list).

## I changed the permission level of a command in an LSE plugin, but it has no effect after reloading the plugin. Why?

When `mc.newCommand` first registers an LSE command, it fixes the command's name, description, permission level, and other properties. When the plugin reloads, the command already exists, and LSE logs the warning `Runtime command xxx already exists, changes will not beapplied except for setOverload!` (exact text from the source). Only overloads and callbacks are updated; changes to permissions and other properties take effect only after a server restart. Also note the order of the permission enum: `PermType.Any`(0) \< `PermType.GameMasters`(1, OP) \< `PermType.Admin`(2, the default for `mc.newCommand`) \< `PermType.HostPlayer`(3) \< `PermType.Console`(4); `Admin` is one level above `GameMasters`. If you do not want to restrict permissions at the command level, use `PermType.Any` and check permissions in the callback yourself (for example, with `origin.player?.isOP()`). LSE provides no API to change a command's permission level after registration.

*Applies to: LSE 0.9 and later; still applies to current 0.23.x*

## In an LSE script plugin, `mc.runcmdEx("list")` returns text containing `§` color codes, which breaks parsing or display. How do I handle it?

`mc.runcmdEx` returns an object `{success, output}`, with the command output in the `.output` field. You need to strip the color codes yourself, for example:

```js
mc.runcmdEx("list").output.replace(/§./g, "")
```

If you only need the online players, use `mc.getOnlinePlayers()` instead to get an array of player objects and count them yourself. This avoids parsing localized command output.

## What should I watch out for when registering a custom command with LSE (`mc.newCommand`)?

1. The command name (and everything except variable parameters such as `String`/`RawText`/`Message`) may only use lowercase English letters.
2. A `RawText` parameter can only be the last parameter.
3. Register commands in the `onServerStarted` event, as shown in the official examples.
4. `overload` takes an array as its argument; if the command has no parameters, pass `cmd.overload([])`. You must call `cmd.setup()` at the end.

Example (Python):

```python
cmd = mc.newCommand(name, description, permission)
cmd.overload([])
def callback(cmd_, origin_, output_, results_): pass
cmd.setCallback(callback)
cmd.setup()
```

See `GameAPI/Command` in the LSE documentation for details.

*Applies to: all current versions of LSE*
