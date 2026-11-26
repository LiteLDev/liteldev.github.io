# LegacyScriptEngine API: players

## In LSE, can a Player object saved earlier still be used after the player goes offline? Does an exception thrown by a plugin make the server exit?

Do not rely on the old object. An LSE Player object internally holds only a weak reference to the player entity. Once the player goes offline, the entity is destroyed, and the old object's properties and methods can no longer find the player and return null or undefined (rejoining creates a new entity, so the old object does not recover). Instead, save the uuid or xuid, fetch the player again with `mc.getPlayer(...)` when needed (such as in a timer), and check for null before acting. LSE catches any uncaught exception in a plugin callback and logs it as an error; it does not make the server exit.

*Applies to: current LSE version*

## What do I pass as the dimension parameter when teleporting or constructing coordinates in LSE? The docs write `[dimid]`; do I pass an array?

The square brackets in the docs indicate an optional parameter, not an array. Pass the dimension ID as a plain number: 0 = Overworld, 1 = Nether, 2 = End. `IntPos` and `FloatPos` take x, y, z, and `dimid`, such as `new IntPos(0, 64, 0, 0)` or `new FloatPos(0.5, 64, 0.5, 0)`. Then teleport the player with `pl.teleport(pos)` or `pl.teleport(x, y, z, dimid)`.

*Applies to: all current LSE versions*

## Calling `player.sendToast` in an LSE JS plugin gives a parameter error or has no effect, and `${variable}` in the string is not replaced. How should I write it?

`sendToast` requires two string parameters—a title and a message (`player.sendToast(title, message)`)—and passing fewer causes a parameter error. Also, in JS only template strings wrapped in backticks `` ` `` interpolate `${}`; with single or double quotes, `${}` is treated as plain text. Write it like ``player.sendToast("提示", `欢迎 ${player.realName}`)``.

*Applies to: all current versions of LegacyScriptEngine*

## How do I refresh the sidebar for all online players on a timer in an LSE JS plugin?

Setting the sidebar is a method on the Player object (`player.setSidebar`), not a global method, so to update it for everyone you need to iterate over the online players and refresh the content periodically. You do not need `onTick` for this; `setInterval` is enough:

```js
setInterval(() => {
  for (const player of mc.getOnlinePlayers()) {
    player.setSidebar(title, data);
  }
}, milliseconds);
```

You can also use `mc.getOnlinePlayers().forEach(...)`. It is also recommended to initialize the sidebar once when a player joins the server.

*Applies to: all current versions of LegacyScriptEngine (formerly LLSE)*

## How do I get the players within a given radius of a player in an LSE plugin? Using the `execute` command and parsing the output with a regex often fails.

Avoid using commands for this. Instead, iterate over the online players and filter by distance:

```js
let plnames = mc.getOnlinePlayers().filter(player => player.distanceTo(pl) < R).map(player => player.realName);
```

Here `pl` is the center player and `R` is the radius in blocks. `distanceTo` accepts an Entity, Player, IntPos, or FloatPos. For a player in a different dimension, it returns the maximum integer value, which automatically filters that player out. To exclude the center player as well, add a check such as `player.xuid !== pl.xuid`.

## How do I get the list of names of all online players in an LSE JS plugin (for example, to save it to JSON)?

Use `mc.getOnlinePlayers().map(player => player.realName)` to get an array of the online players' real names, then write it to JSON (for example, with the `set` method of JsonConfigFile). To add an element to an array, use `push`.

*Applies to: current version (JS engine)*

## In an LSE JS plugin, I want to send a player's coordinates with `pl.tell`, but passing `pl.pos` directly throws an error or the coordinates don't show. How should I write it?

`pl.pos` returns a position object (FloatPos), while the first parameter of `pl.tell` must be a string. Passing the object directly fails the parameter type check and throws an error. Convert it to a string with `pl.pos.toString()` before sending (or use the template string `` `${pl.pos}` ``). You can also build the string yourself from `pl.pos.x` / `pl.pos.y` / `pl.pos.z` / `pl.pos.dimid`.

## In LSE, `pl.isOp()` fails because it does not exist. What is the API to check whether a player is an OP?

The LSE API is named `pl.isOP()` (OP in all capitals). `isOp` does not work because JS is case-sensitive.

## In LSE, what values does the color parameter of `setBossBar` accept?

The `colour` parameter of `pl.setBossBar(uid, title, percent, colour)` is an integer that maps directly to the BDS BossBarColor enum: 0 Pink, 1 Blue, 2 Red, 3 Green, 4 Yellow, 5 Purple, 6 RebeccaPurple, 7 White. For example, `pl.setBossBar(1145141919, "Hello", 80, 2)` shows a red boss bar.

## In LSE, how do I reliably get a simulated player summoned by a player, or a player with a given name? What are the pitfalls of `mc.getPlayer(name)`?

`mc.getPlayer(name)` performs a case-insensitive prefix match on the name. An exact match takes priority; otherwise, it returns the player with the shortest name that starts with the given string, so you may get a different player. After getting the result, verify that the returned object's `name` exactly matches the target name. A more reliable approach is to save and look up players by UUID or XUID (`mc.getPlayer` also accepts UUID/XUID/UniqueId/RuntimeId). Giving simulated players a name prefix or marker that real players cannot use also prevents conflicts.

## In LSE, I want a boss bar (bossbar) to refresh continuously, but `setInterval(player.setBossBar(...), 500)` runs only once or reports that player is undefined. What is the correct way to write it?

The first argument to `setInterval` must be a function. Writing `setInterval(player.setBossBar(...))` runs `setBossBar` once immediately and passes its return value as the argument. Pass an anonymous function instead, save the id returned by `setInterval`, and call `clearInterval` when the boss dies.

Do not hold on to mc objects such as player or entity for long periods. Store the xuid instead, and inside the timer look up the player again with `mc.getPlayer(xuid)` and check for null. Example:

```js
let players = [];
mc.listen("onAttackEntity", (pl, en) => {
  if (!en.hasTag("boss")) return;
  if (!players.includes(pl.xuid)) players.push(pl.xuid);
});
const timer = setInterval(() => {
  for (const xuid of players) {
    const p = mc.getPlayer(xuid);
    if (!p) continue;
    p.setBossBar(bossId, "Name", Math.floor(boss.health / boss.maxHealth * 100), 2);
  }
}, 500);
```

When the boss dies, call `clearInterval(timer)` and call `removeBossBar(bossId)` on each player. `setBossBar` takes `(uid, title, percent 0~100, colour)`. To show the bar to all nearby players, iterate over `mc.getOnlinePlayers()` and filter by distance.

*Applies to: all current LSE versions*

## In LSE, after changing a player's overhead name with `pl.rename(newName)`, `pl.name` still returns the real name. Is there a way to get the name displayed above the player's head (the nametag)?

`pl.rename` changes the player's NameTag, whereas `pl.name` and `pl.realName` always return the player's original name. LSE 0.19.1 added `en.getCustomName()`, which returns the entity's NameTag, so you can get the displayed overhead name with `pl.toEntity().getCustomName()`.

If you also need to maintain a "real name to fake name" mapping or check for duplicate names, you should still record the uid, real name, and fake name yourself (in a file or database) when calling `rename`, and compare against `data.getAllPlayerInfo()` when needed.

In versions earlier than 0.19.1, keeping your own records is the only option.

*Applies to: LSE 0.19.1 and later*

## Is running the `title` / `say` commands a suitable way to show a title to a player or broadcast a message to the whole server from an LSE plugin?

Running `title` or `say` via `mc.runcmd` is not recommended because LSE provides built-in APIs for both. Use `pl.setTitle(content[, type[, fadeInTime, stayTime, fadeOutTime]])` to show a title to a player, and `mc.broadcast(msg[, type])` to send a server-wide message. Prefer dedicated APIs whenever they exist.

*Applies to: all current LSE versions (including v0.23.1)*

## Does LSE have an API to check whether a player is crawling / swimming?

Yes: the `player.isSwimming` and `player.isCrawling` properties, available since LSE 0.19.1.

*Applies to: LSE 0.19.1 and later*

## In LSE's TypeScript type definitions, the player object returned by `mc.getPlayer` has no simulated player (`SimulatedPlayer`) methods. How do I call the simulated player API?

In the type definitions, `mc.getPlayer` returns `Player`, and `SimulatedPlayer` extends `Player` (`declare class SimulatedPlayer extends Player`). At runtime, a simulated player's `simulateXxx` methods are already on the player object; only the types do not match. First check with `player.isSimulatedPlayer()`, then cast the type manually with `(player as SimulatedPlayer)` and call the method. You can also bypass type checking with `// @ts-ignore`. A player created with `mc.spawnSimulatedPlayer` is returned directly as type `SimulatedPlayer`.

*Applies to: current version (LSE TS plugins using the `legacy-script-engine-api` type definitions)*

## After uninstalling a mod/plugin that changed max health, a player's max health is still not the default. How do I set a player's max health back to 20 directly from the server console?

In the server console, run LSE's script debug command:

```shell
jsdebug mc.getPlayer('player name').setMaxHealth(20)
```

This restores the player's max health to 20. Note that the debug command depends on the backend: `jsdebug` for the QuickJS backend, `luadebug` for Lua, and `pydebug` for Python; the Node.js backend has none.

*Applies to: LeviLamina + LSE (with the matching script backend installed)*

## How do I quickly check an online player's UUID in the server console (to find that player's data file)?

Run LSE's debug command in the console (QuickJS engine): `jsdebug mc.getPlayer('player name').uuid`. Note that the player must be online for `mc.getPlayer` to find them.

*Applies to: current version (requires the QuickJS engine)*

## Can I rename a player in LSE (without paying for an Xbox name change)?

Yes. Use the `rename` method on the player object: `pl.rename("Steve")` in JS or `pl:rename("Steve")` in Lua. It returns a `Boolean` indicating whether it succeeded. For a temporary rename, run `mc.getPlayer("original name").rename("new name")` in the console using the QuickJS engine's debug command `/jsdebug` (the Node.js engine has no debug command). This only changes the name displayed on the server, not the player's Xbox account name.

*Applies to: LSE all current versions*
