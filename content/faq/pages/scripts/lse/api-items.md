# LegacyScriptEngine API: items and containers

## In LSE, creating an addon custom item with `mc.newItem()` fails (the parameters are correct). What is the cause?

When the plugin loads, the server has not finished starting, so the world and the item registry (including addon custom items) are not ready yet. Put the item-creation code inside an `mc.listen("onServerStarted", () => { ... })` callback.

In this situation, recent LSE versions throw an exception directly (such as `ll::service::getLevel() returns nullptr` or `Item not found`), which makes the issue easier to identify.

*Applies to: LSE 0.23.x*

## How do I spawn a dropped item at the position where a player died, from an LSE plugin?

Listen to the player death event `onPlayerDie` (callback prototype: `function(player, source)`). You can still read `player.pos` inside this callback. Create the item with `mc.newItem("minecraft:xxx", count)`, then spawn the dropped item at that position with `mc.spawnItem(item, pos)`. For example:

```js
mc.listen("onPlayerDie", (pl, src) => {
  const it = mc.newItem("minecraft:diamond", 1);
  mc.spawnItem(it, pl.pos);
});
```

*Applies to: all current LSE versions (including v0.23.1)*

## After modifying a player's items with the newly added LSE APIs, do I need to refresh the player's inventory manually?

Yes. After modifying items, call `player.refreshItems()` to update the player's inventory and armor slots; otherwise, the client will not show the changes.

## Does LSE have container (Container) APIs? Where is the documentation?

Yes. See the documentation at <https://levimc.org/LegacyScriptEngine/apis/GameAPI/Container/>. Note that this API can only operate on existing containers (such as block containers and the player inventory); it cannot open a container UI for a player. To open a container UI proactively, use a native C++ mod or a third-party dependency.

## How do I check in an LSE script whether a player's inventory is full (or has room for a given item)?

Use `player.getInventory().hasRoomFor(item)` to check whether the container can hold the item. You can also iterate through the slots:

```js
const hasEmpty = (pl) => pl.getInventory().getAllItems().some(it => it.isNull());
```

If you find an empty slot, the inventory is not full. The container also provides `addItemToFirstEmptySlot` and `addItem` to insert an item directly.

## When I modify an item's NBT in LSE by setting a whole new tag, the item loses its enchantments (or even crashes the server). How do I keep the enchantments?

Do not create a new tag that overwrites the existing NBT. Instead, get the original NBT with `item.getNbt()`, modify the fields you need, and then call `item.setNbt(nbt)`. Because no function builds NBT directly from a plain JS Object, and assembling it manually with constructors is error-prone, it is easier to convert the NBT to text with `nbt.toSNBT()`, modify it, parse it back with `NBT.parseSNBT(snbt)`, and write it back.

## In an LSE (LLSE JS) plugin, how do I get an item's NBT string, and how do I convert SNBT back to NBT to create an item?

Get the SNBT string with `itemObject.getNbt().toSNBT()`. Convert SNBT to an `NbtCompound` object with `NBT.parseSNBT(snbt)`, then create the item with `mc.newItem(nbt)`.
