# LegacyScriptEngine API: world and blocks

## An LSE plugin gets/creates a scoreboard objective in the global scope (such as `mc.getScoreObjective`, `mc.newScoreObjective`). It works after `ll reload`, but after a server restart it errors or returns null. Why?

When the plugin loads, the server (world) has not finished starting, so you cannot interact with vanilla content such as scoreboards, and the returned object is null. Declare the variable globally with `let`, assign it inside the `mc.listen("onServerStarted", () => { /* get/create the scoreboard here */ })` callback, and check for null before using it. During a hot reload (`ll reload`), the server is already running, so you get the object immediately. Because LSE also fires `onServerStarted` for plugins loaded after the server has started, placing the code in that event works in both cases.

*Applies to: all current LSE versions*

## In LSE, `mob.pos` prints as a string like "主世界(x,x,x)" (Overworld), and calling `replace` on it throws `cannot read ... from 'undefined'`. How do I get the coordinate values to spawn particles?

`pos` is not a string, but a `FloatPos` or `IntPos` object; the readable format printed to the console is the output of its `toString` method. Do not use string manipulation. Instead, read the `pos.x`, `pos.y`, `pos.z`, and `pos.dimid` properties directly. You can also pass `pos` straight to APIs (for example, `ps.spawnParticle(pos, name)`). Read the basic types section of the documentation first; using TypeScript type declarations also helps prevent this kind of error.

*Applies to: all current versions of LegacyScriptEngine (formerly LLSE)*

## In LSE, passing an NBT object as the block parameter of `mc.setBlock` gives a parameter error. What is wrong?

When passing an NbtCompound (or a Block object), do not pass the `tileData` parameter. These use different overloads:

- `mc.setBlock(pos, blockObject)` / `mc.setBlock(x, y, z, dimId, blockObject)` accept a Block or NbtCompound.
- `mc.setBlock(pos, blockString, tileData)` / `mc.setBlock(x, y, z, dimId, blockString, tileData)` accept `tileData` only when the block parameter is a block type name string.

When `tileData` is provided, LSE requires the block parameter to be a string; otherwise, it reports a parameter type error. The TypeScript declaration library legacy-script-engine-api fixed the corresponding overload declarations in JavaScript@v2.17.0 (2025-06-20).

*Applies to: current version; declaration library legacy-script-engine-api JavaScript@v2.17.0 and later*

## Can LSE set a block through block states instead of `tileData`, or only with the `setblock` command?

You can set a block using NBT. Block NBT contains the `name` and `states` fields (in SNBT, `{"name":"minecraft:xxx","states":{...}}`). Call `block.getNbt().toSNBT()` on any block to inspect its structure, then build a matching `NbtCompound` (for example, with `NBT.parseSNBT(...)`) and pass it to `mc.setBlock(pos, nbt)`.

## In LSE scripts, `mc.getBlock(pos).isAir` often throws an error (for example when a player teleports or joins). How do I fix it?

`mc.getBlock` returns `null` if the dimension does not exist, the height is out of range, or the chunk is unloaded. Check for `null` before accessing properties:

```js
let block = mc.getBlock(packetPos.add(0, 1, 0));
if (block && block.isAir) break;
```

Or use optional chaining: `mc.getBlock(...)?.isAir`.

## When building a position in an LSE JS plugin, is passing only x, y, z enough, as with C++ `Vec3`? Why does setting a block have no effect?

No. Unlike C++ `Vec3`, which has no dimension, LSE's `IntPos` and `FloatPos` require a dimension ID: `new IntPos(x, y, z, dimid)` (0 for Overworld, 1 for Nether, 2 for End). Without it, the position is incomplete, and operations like `mc.setBlock` that use it will fail.

## In an LSE JS plugin, how do I make a specific block drop no items when it is broken?

Intercept the break event, then break the block manually with the block object's `destroy` method, passing `false` so no drops are generated: `bl.destroy(false)`. The `drop` parameter controls whether drops are generated, and the method returns whether the block was broken successfully.
