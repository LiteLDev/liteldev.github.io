# LegacyScriptEngine API: events

## Can LSE unregister (stop listening to) an event listener registered with `mc.listen`? How do I cancel a listener?

LSE's script API has no interface for unregistering a listener: `mc.listen(event, callback)` returns only a Boolean indicating whether registration succeeded, not a handle you can use to remove it. When a plugin is unloaded or reloaded, LSE automatically removes all event listeners that plugin registered.

To cancel a listener at runtime, wrap it yourself in your script: call `mc.listen` only once per event, have the callback dispatch the event to a list of handler functions that you maintain, and remove a handler from the list when you want to cancel it.

(LeviLamina's C++ EventBus provides `removeListener`, so C++ mods can remove a listener directly.)

*Applies to: all current LSE versions*

## Does the `onAttackEntity` event callback in LSE still provide a `damage` parameter?

No. The prototype of the LSE `onAttackEntity` callback is `function(player, entity)`. The `damage` parameter from the LL2 era has been removed, so follow the LSE docs. Returning `false` from the callback cancels the attack.

*Applies to: all LSE versions (LeviLamina era)*

## How do I stop pistons from pushing specific blocks (such as chests and hoppers) in LSE, so that pistons outside a claim cannot push blocks into or out of it?

Listen to the `onPistonTryPush` event and return `false` from the `function(pistonPos, block)` callback to cancel the push. For example:

```js
mc.listen('onPistonTryPush', (pistonPos, block) =>
  ["minecraft:chest", "minecraft:hopper"].includes(block.type) ? false : true);
```

A claim plugin can use `block.pos` to check whether the pushed block is inside a claim. Early LSE versions had a bug where the block coordinates passed to this callback were wrong (always the piston's own coordinates), which broke claim plugins (issue #137); this was fixed in LSE 0.7.12. Note that the event fires repeatedly when a piston is blocked and cannot move.

*Applies to: LSE 0.7.12 and later*

## In LSE, are the callback parameters of `mc.listen` passed by name or by position? For example, `mc.listen("onCmdBlockExecute",(pos,cmd)=>{log(cmd)})` prints the command instead of the coordinates.

They are passed by position. When an event fires, LSE calls your callback and passes arguments in the fixed order defined by the listener prototype in the docs, regardless of what you name the parameters. The prototype of `onCmdBlockExecute` is `function(cmd, pos, isMinecart)`, so the first parameter is the command string, the second is the position (FloatPos), and the third indicates whether it is a command block minecart. You can name the variables anything you like, but it is best to follow the prototype in the docs:

```js
mc.listen("onCmdBlockExecute", (cmd, pos, isMinecart) => { log(cmd, pos); })
```

## In LSE, how do I check in the `onPlayerDie` event whether the damage source is a player, and add score on the scoreboard for the killer?

The prototype of `onPlayerDie` is `function(player, source)`, where `source` is the damage source entity (Entity, possibly `null`). First check that `source` exists and is a player, then convert it to a Player object with `toPlayer()` before modifying the scoreboard. Entity objects do not have scoreboard methods such as `addScore`. Example:

```js
mc.listen("onPlayerDie", (pl, src) => { if (src && src.isPlayer()) { src.toPlayer().addScore("kills", 1); } });
```

The objective must already exist.

## In LSE, how do I intercept an event? Why does `mc.listen("onPlayerPullFishingHook", (player,entity,item) => { fishingHookEvent(player,entity,item) })` with `return false` inside `fishingHookEvent` not intercept?

Returning `false` from an LSE event callback intercepts the event (not all events support interception; check the docs, which mark interceptable events with "Intercept event: function returns false". `onPlayerPullFishingHook` supports interception). In the code above, the outer arrow function uses braces without a `return` statement, so the inner function's return value is discarded. Write it as:

```js
mc.listen("onPlayerPullFishingHook", (player,entity,item) => { return fishingHookEvent(player,entity,item); });
```

or simply:

```js
mc.listen("onPlayerPullFishingHook", (player,entity,item) => false);
```

## How do I turn obsidian into lava when a player uses an item (such as a bucket) on it, from an LSE plugin?

Listen to the `onUseItemOn` event (callback `function(player, item, block, side, pos)`), check the block type, and replace the block with `mc.setBlock`:

```js
mc.listen('onUseItemOn', (player, item, block) => {
  if (block.type === 'minecraft:obsidian' && item.type === 'minecraft:bucket') {
    mc.setBlock(block.pos, 'minecraft:lava', 0);
  }
});
```

You can remove the check for the held item (the bucket) if you do not need it. Note: a right-click on the Win10 client may trigger this event several times in a row on the server.

*Applies to: all current LSE versions (including v0.23.1)*

## How do I block a player from using an item such as fireworks on a block, from an LSE plugin?

Listen to the `onUseItemOn` event (`mc.listen("onUseItemOn", (player, item, block, side, pos) => {...})`), check `item.type` in the callback (for example, `"minecraft:firework_rocket"`), and return `false` to block it.

*Applies to: all current LSE versions (including v0.23.1)*

## Can LSE's `onBlockChanged` (block changed) event be intercepted with `return false`? What about LeviLamina in C++?

No. LSE's `onBlockChanged` fires after the block has already changed and cannot be intercepted (the documentation states "Intercept event: cannot be intercepted"). LeviLamina's `ll::event::BlockChangedEvent` is likewise not cancellable, and C++ provides no direct way to intercept it either. You can only revert the block to its previous state after the change, or hook the specific action that caused the change (for example, to intercept a player placing or breaking a block, use `onPlaceBlock` and `onDestroyBlock`).

*Applies to: current version (LSE / LeviLamina)*

## When an LSE script plugin is unloaded, the callback registered on the C++ side through `executeOnModUnload` is not triggered. Do LSE plugins have an `onUnload` callback?

Previously, LSE destroyed the engine directly when unloading a script plugin without calling `onUnload` on `ll::mod::Mod`, so `executeOnModUnload` listeners were never notified. This was fixed in LSE PR #256 (`fix: fix plugin executeOnModUnload`, merged on 2025-03-17). On the script side, you can register a cleanup function to run on plugin unload with `ll.onUnload(func)`.

*Applies to: LSE versions containing PR #256 (released after 2025-03) and the current latest version*

## Is there an event listener for server shutdown in LSE JS plugins?

Not in the `mc.listen` event list, but in the "loading-related API" (the `ll` object): register a plugin unload callback with `ll.onUnload(func)`, which runs when the server shuts down and unloads the plugin. This function requires LSE 0.9.6 or later.

*Applies to: LSE 0.9.6 and later*

## How do I prevent players from using a certain item with LSE?

Listen to the `onUseItem` event (callback parameters `player, item`), check whether `item.type` matches the target item, and `return false` in the callback to intercept it:

```js
mc.listen('onUseItem', (player, item) => { if (item.type === 'minecraft:xxx') return false; });
```

If the item is used on a block (by right-clicking a block), you also need to intercept `onUseItemOn`.

## How do I stop players from interacting with certain blocks with an LSE script plugin (for example, forbidding opening jukeboxes and shulker boxes inside a claim)? Why does the notification message spam the chat?

Listen to the `onUseItemOn` event (callback parameters `player, item, block, side, pos`) and `return false` to intercept the interaction when `block.type` is the target block. As noted in the documentation, a single right-click from a Win10/PC client fires this event several times in a row on the server, so calling `player.tell` every time spams the chat. You can either debounce the message (ideally with a generic debounce function decoupled from the player) or show the notice above the hotbar (actionbar) instead.

## How do I make an LSE script plugin run some commands automatically after the server has finished starting?

Listen to the `onServerStarted` event and call `mc.runcmd` in the callback: `mc.listen("onServerStarted", () => { mc.runcmd("your command"); });`. To run several commands, make multiple `mc.runcmd()` calls. If you need the command output, use `mc.runcmdEx`.

## How do I stop liquids from flowing on the server with a plugin?

Listen to LSE's `onLiquidFlow` event (callback parameters `from: Block, to: IntPos`) and return `false` to intercept it:

```js
mc.listen('onLiquidFlow', (from, to) => false);
```

Alternatively, you can write a native mod that removes liquid ticks.

*Applies to: current version (the event depends on iListenAttentively, which is installed together with LSE)*

## I want to build a sign-locked chest feature. Which actions should I intercept with LSE?

Listen to the container-open event `mc.listen("onOpenContainer", (player, block) => ...)` (or the block interaction event `onUseItemOn`) and `return false` to intercept it when the player is not the owner. You must also prevent hoppers and hopper minecarts from pulling items out of the chest by listening to `onHopperSearchItem` (callback parameters `pos, isMinecart, item`; `return false` prevents the pickup). Otherwise, players can bypass the lock with a hopper.

*Applies to: LegacyScriptEngine 0.23.x*

## An LSE JS plugin calls `mc.explode` inside an `onBlockExplode` listener (or adds experience inside the experience-gain event) and the server crashes or freezes. Why?

The plugin is causing an infinite loop: calling an API inside the event callback fires the same event again (`mc.explode` fires `onBlockExplode`, and adding experience through the API fires the player experience-gain event), which leads to unbounded recursion. As the documentation warns, LSE does not distinguish events triggered by the plugin itself. To avoid this, set a boolean flag in your plugin to skip the handler while you are triggering the explosion or adding experience yourself, or use an approach that does not retrigger the event.

*Applies to: LSE all current versions*
