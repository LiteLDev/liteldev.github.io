# Inventory and windows

How bedboo supports mineflayer's Java-layout inventory API (`bot.inventory`, `bot.currentWindow`, slot numbers, `clickWindow`, `transfer`, `deposit` / `withdraw`, events) on top of Bedrock's server-authoritative inventory, and the few visible differences. Observed on BDS 1.26.51.1 (protocol 2193).

## clickWindow is emulated with item stack requests  {#click-window}

- **Affects:** `bot.clickWindow`, and everything built on it (`transfer`, `putAway`, `moveSlotItem`,
  `putSelectedItemRange`, `toss`, `tossStack`, `equip`, `unequip`, `simpleClick`, window `deposit` / `withdraw`)
- **Java:** the client sends `window_click` (slot, button, mode); the server runs the click and syncs the window.
- **Bedrock:** there is no click packet. The client sends `item_stack_request` actions (`take`, `place`, `swap`,
  `drop`, `destroy`, `craft_creative`, …) between explicit container slots (`hotbar`, `inventory`, `armor`, `offhand`,
  `cursor`, `container`, `barrel`, `shulker`, furnace / brewing / station UI slots), and the server answers with an
  `item_stack_response` (ok + resulting counts / stack IDs, or an error code). The server does not resend the inventory after
  a request. Cursor moves, cross-container moves, and `craft_creative` are accepted only while a screen is open
  (status 7 / 50 otherwise).
- **bedboo:** `lib/bedrock/click.js` plans the Java (vanilla 1.21 `doClick` / `quickMoveStack`) result of each click
  mode as stack request steps:
  - Mode 0 (left / right, outside = drop), mode 1 (shift, with Java's per-menu rules including armor → armor slot;
    the station rules — furnace fuel vs. ingredient, brewing bottles / ingredient / fuel, enchanting lapis, loom,
    cartography, smithing, beacon — come from the window specs and use item-name lists, as there is no smelting or
    brewing recipe data), mode 2 (number keys, 40 = off-hand), mode 3 (creative clone), and mode 4 (drop key).
  - The model predicts the result (one `updateSlot` per changed slot, like Java 1.17+), sends one request per click, and
    waits for the response, which updates counts and stack IDs (an answer that arrives after the 5 s timeout is still
    applied). Clicks may overlap: see [overlapping requests](#overlapping-requests).
  - A rejected request is rolled back, and `clickWindow` throws mineflayer's own message:
    `Server rejected transaction for clicking on slot <s>, on window with id <id>.` (if there is no response:
    `Server didn't respond to transaction …`).
  - Clicks on `bot.inventory` open the player's own inventory screen (`interact open_inventory`) and close it 100 ms
    after the last click when the cursor is empty.
  - Modes 5 (drag) and 6 (double-click) throw "not implemented", just as prismarine-windows does. Clicking a crafting or
    trade result slot requires the craft request of `bot.craft` ([crafting](crafting.md#craft-request)) and throws.
  - A Java server silently ignores an invalid placement (e.g., dirt into an armor slot); the planner applies Java's
    `Slot.mayPlace` for armor slots and result slots, and anything else BDS refuses surfaces as a rejection error.

## Overlapping item stack requests  {#overlapping-requests}

- **Affects:** `bot.clickWindow` and everything built on it when calls overlap (clicks not awaited, armor-manager /
  tool / auto-eat equips racing user code, `transfer` while tossing), window `deposit` / `withdraw`
- **Java:** the client applies each click to its window immediately (1.17+ prediction), and the server resyncs any wrong
  slot with `set_slot` / `window_items`, so overlapping clicks self-heal.
- **Bedrock:** each click is an `item_stack_request`. A request planned on an earlier request's prediction uses the
  pending request ID as the slot's stack ID, and BDS answers in send order. A rejected request (e.g., status 55 for putting dirt into
  the off-hand, then 49 for the request that referenced it) receives only the error response — nothing is resent.
- **bedboo:** for each slot, the inventory model tracks the in-flight requests that changed it.
  - Rather than overwriting the next request's prediction, a settled request passes its result for the slot to the next request on that slot (the server's count and stack
    ID, or its own starting state if rejected); only the last
    request on a slot writes to the slot.
  - Chained rejections therefore revert to the state before the first request — or to what the server last sent for the
    slot while the requests were in flight (a pickup, `/give`). A request planned on such a server update keeps that update as its
    base, and a resend of the exact state the requests were planned on leaves their predictions intact
    ([inventory resync](#inventory-resync)).
  - Late (timed-out) answers are applied in order. Answers for a container window that has since closed no longer
    affect the next window.
  - A click's prediction is committed synchronously when the inventory screen is open (and re-planned after waiting
    for the screen otherwise), so clicks issued without awaiting the previous one build on it, just like Java's client-side
    click.

## A click raced by a server-side change of its slots is planned again  {#raced-requests}

- **Affects:** `bot.clickWindow` and everything built on it (`transfer`, `deposit` / `withdraw`, `moveSlotItem`, `equip`, `toss` / `tossStack`, `putAway`, crafting) while drops are picked up, `/give` runs, or a hopper or another player changes a slot the request touches
- **Java:** The server applies `window_click` to its own current state (and resyncs); it never fails.
- **Bedrock:** An item stack request names each slot's stack id as the client knows it. If the server changes the slot in the meantime (such as on a pickup: a normal `inventory_transaction` with a new stack id), BDS rejects the whole request (status 49 stack id mismatch / 50). Measured: a chest deposit / withdraw loop with a console `/give` every 400 ms produced 6 rejections in 88 operations ("Server rejected transaction for clicking on slot 27 …").
- **bedboo:** When a server packet sets a slot touched by an in-flight request to a different stack than the one the request was planned on, the request is marked as raced (`lib/bedrock/inventory_model.js`). If BDS rejects a raced request, it is replanned once on the server's state and sent again (item stack requests are atomic, so the rejected one changed nothing). Requests chained to it (planned on its prediction) are retried the same way. A rejection without such a change still throws mineflayer's message.

## Closing a window puts the carried item and station inputs back  {#close-window}

- **Affects:** `bot.closeWindow`, window `close()`
- **Java:** On close, the server returns the carried item (and crafting grid / anvil / enchanting inputs) to the player inventory (`placeItemBackInInventory`).
- **Bedrock:** BDS keeps them: the carried item stays in the `cursor` (ui slot 0), and station inputs stay in their ui slots (observed after `container_close`). Java \< 1.17 follows `close_window` with a no-op click; Bedrock has neither.
- **bedboo:** Like upstream, `closeWindow` clears `bot.currentWindow` and emits `windowClose` immediately. It then moves those items in a single stack request following Java's rule (selected hotbar slot, off-hand, and stacks with room first, then the first empty slot, with the rest dropped) and sends `container_close { window_id, window_type, server: false }` (or only `container_close` if there is nothing to put back). The returned promise resolves on the server's echo, and openers wait for that echo plus 100 ms (2 ticks) before activating the next container: BDS silently drops a container activation that arrives in the same tick its previous container closed (no `container_open`, no resync). Block entities (chests, furnaces, brewing stands, …) keep their contents as on Java. `bot.closeWindow(bot.inventory)` closes the inventory screen if the bot opened it.

## Opening a window while another one is open  {#window-switch}

- **Affects:** `bot.openBlock`, `bot.openEntity`, `bot.openContainer` / `openChest` / `openDispenser`, the station openers (`openFurnace`, `openAnvil`, `openEnchantmentTable`, `openVillager`, `craft` with a table), `bot.activateBlock` / `bot.activateEntity` / `bot.activateEntityAt`, `windowClose`
- **Java:** `ServerPlayer.openMenu` closes the current menu first (`close_window` → mineflayer emits `windowClose`) and then opens the new one, so code that never closes a chest (such as mineflayer-collectblock's `emptyInventory`) works.
- **Bedrock:** BDS ignores an activation that would open a container while the player already has one open — sending neither `container_open` nor `container_close` — so `openBlock` would wait for `once()`'s 20 s timeout and throw (verified live: opening a chest then a barrel, and opening the same chest twice). Other activations (such as a lever) are processed while a container is open and leave the container open, like Java.
- **bedboo:** `openBlock` / `openEntity`, the station openers, and `activateBlock` / `activateEntity(At)` on a container or station block (chests, barrels, shulker boxes, furnaces, crafting / enchanting / smithing tables, anvils, hoppers, dispensers, droppers, brewing stands, beacons, grindstones, stonecutters, looms, cartography tables, crafters, lecterns) or on a trading / storage entity (villagers, wandering traders, chest / hopper minecarts, chest boats) first close the open container window with `bot.closeWindow` (`windowClose` immediately, carried and station items put back, `container_close`, and the server's echo), then wait for BDS's 100 ms reopen delay before activating. Other activations leave the window open.

## A container whose entity or block is gone  {#container-gone}

- **Affects:** `windowClose`, `bot.currentWindow`, trading (`bot.openVillager`, `bot.trade`), and station windows
  (anvil, enchanting table, furnace, …) when the trader dies or despawns or the block is broken
- **Java:** the server closes the menu (`stillValid` fails) and returns the items in the input slots.
- **Bedrock:** BDS sends only `remove_entity` (or the block update): no `container_close` is sent and nothing is returned. Items in
  the trade or station input slots live in the player's `ui` container; BDS refuses to move them out of that dead screen
  (status 49, invalid source slot) and keeps them there, so the next window that uses those slots shows them.
- **bedboo:** when a container's entity disappears (`entityGone` on the window's entity) or
  its block turns into a different block (a lit furnace is still a furnace; a chipped anvil is still an anvil), the inventory plugin treats it like a server
  close: it emits `windowClose`, sets `currentWindow` to null, and sends `container_close` (skipping a doomed return request; the next opener waits
  for its echo). Moving out of range does not close a window (BDS sends nothing, and this is not handled). `openVillager` immediately returns
  any items it finds in the trade input slots (since a fresh Java trade window is empty), so a dead trader's payment
  is recovered when the next trade window opens. `update_trade.villager_unique_id` is a zigzag varint that bedrock-protocol
  3.60.1 reads as unsigned; `inventory.js` decodes it.

## Window types: Java types for Bedrock containers  {#window-types}

- **Affects:** `windowOpen`, `bot.currentWindow`, `bot.openBlock`, `bot.openEntity`, `bot.openContainer`
  (`openChest`, `openDispenser`), and the station openers
- **Java:** `open_window` carries the Java window type; `window_items` carries the slots.
- **Bedrock:** sends `container_open { window_id, window_type, coordinates, runtime_entity_id }` followed by `inventory_content` for
  that window ID. Every chest-like block (chest, trapped / ender / copper chest, barrel, shulker box) has
  `window_type: 'container'` and is distinguished by the block at `coordinates`. Station inputs (crafting grid, anvil,
  enchanting, grindstone, stonecutter, loom, cartography, smithing, beacon, trading) live in the `ui` container.
  Bedrock sends a window's contents under its own window ID right after `container_open`, and syncs the player
  inventory as a separate container (`inventory`).
- **bedboo:** the `bot._bedrock.windows` registry maps every container type to the Java 1.21 window type and slot layout
  (`minecraft:generic_9x3` / `9x6` / `3x3`, `hopper`, `shulker_box`, `crafting`, `furnace`,
  `blast_furnace`, `smoker`, `brewing_stand`, `enchantment`, `anvil`, `merchant`, `beacon`, `grindstone`,
  `stonecutter`, `loom`, `cartography`, `smithing` (1.20+ template / base / addition / result), `crafter_3x3`,
  `lectern`, `HorseWindow`), so the type checks in `openContainer` and the station openers pass unchanged. The player section
  of a window mirrors `bot.inventory`. Early content for a reused window ID is buffered and applied, and a trailing
  update after a close always reaches `bot.inventory`. `openContainer` also accepts the Bedrock block names
  `undyed_shulker_box` and the copper chests. The horse and lectern windows have not been verified on BDS yet. Opening a
  window while a container window is already open closes the first one, matching the Java server
  ([window switching](#window-switch)).

## updateSlot fires on changes only  {#update-slot}

- **Affects:** window `updateSlot` / `updateSlot:<n>` events, `heldItemChanged`
- **Java:** every `set_slot` and `window_items` packet calls `updateSlot` (even for unchanged slots).
- **Bedrock:** there is no `set_slot`. BDS resends every inventory window (`inventory_content` × 4) after each command,
  gamemode change, and rejected transaction.
- **bedboo:** a resend that changes only stack IDs replaces the Item silently; `updateSlot` (and therefore
  `heldItemChanged`) fires only when the type, count, metadata, or NBT changes. `inventory_slot` and `inventory_content` updates for the
  held slot emit `heldItemChanged`.

## No window resync request like Java's  {#resync}

- **Affects:** `bot._syncWindow` (internal)
- **Java (1.17.1+):** an impossible click forces the server to resend the window.
- **Bedrock:** BDS does not resend anything after a rejected item stack request (verified live: only the error
  response arrives), and it answers every request.
- **bedboo:** `_syncWindow` resolves immediately, and the model rolls back the rejected prediction itself (see
  [overlapping requests](#overlapping-requests)). An out-of-date slot is healed by an
  [inventory resync](#inventory-resync).

## Inventory resync (inventory_mismatch)  {#inventory-resync}

- **Affects:** `bot.inventory` after a desync, `clickWindow` (and everything built on it), and the Bedrock extra `bot.bedrock.resyncInventory()` ([`bot.bedrock`](../api.md#bedrock-extras))
- **Java:** the server resends a window whenever the client's view is stale (using state IDs).
- **Bedrock (measured on BDS 1.26.51.1):** a client `inventory_transaction { transaction_type: 'inventory_mismatch' }` makes BDS resend the player's entire inventory—`inventory_content` for the inventory, armor, UI (cursor), and off-hand windows, followed by `player_hotbar`—within a tick, with no other effect. Nothing else triggers a resend: not (re)opening the inventory screen, not a rejected request (status 49 for a slot whose stack ID the server does not have, leaving the slot rejected for every later request), and not `/clear <player> <item> -1 0`.
- **bedboo:** server packets always win (`inventory_content`, `inventory_slot`, and server transactions are applied as they arrive).
  - When the model detects that a player slot is out of date, it requests the server's copy. Automatic resyncs run at most once per second; a request made sooner is sent once the second elapses. Triggers:
    - a request rejected with status 49 that no server packet explains (neither raced nor planned on another rejected request). If the resent copy differs from the state the request was planned on, a plannable request (`clickWindow`, `returnItems`, craft) is replanned once on the new state; otherwise, the rejection stands. A request that cannot be replanned rejects immediately while the resync runs in the background;
    - a server `inventory_transaction` (pickup, `/give`) whose `old_item` matches neither the local item nor the new one, for a slot that no in-flight request is changing;
    - a response that reports items in a slot that the model considers empty.
  - A resync completes on the response's `player_hotbar { select_slot: true }` (whereas a command-triggered resend ends with `select_slot: false`). `bot.bedrock.resyncInventory()` → `Promise<boolean>` requests a resync explicitly, resolving to true once applied or false if no answer arrives within 2 s; diagnostics are available in `bot._bedrock.inventoryModel.resyncs`.
  - If a resend arrives while requests are in flight and merely repeats the server's known state for a slot (stack ID, type, count, metadata, NBT), it does not overwrite those requests' predictions. Because the server applies the in-flight requests to that same state, any click planned in the meantime builds on the prediction, and the responses finalize the predicted items (otherwise, a swap answered after such a resend would show the old item with the new count).
- **Pickups:** pickups arrive as `take_item_entity` plus a server `inventory_transaction` (type normal: the container slot's old and new items, followed by a `world_interaction` action), never as `inventory_slot`. Item counts remain accurate during normal digging and pickups (including merging into hotbar and main-inventory stacks, a full inventory, an open chest, and mineflayer-collectblock). A desync (roughly 1 round in 40) occurred when overlapping `moveSlotItem` calls moved a coal stack back and forth while pickups merged into it: a pickup landed on the stack while both a take from it and a click planned on that take were in flight. BDS rejected both requests (status 49: the stack changed, and the request the second click depended on was rejected), and the rollbacks restored the pre-pickup stack—leaving `bot.inventory` with 28 coal (stack 236) while the server had 29 (stack 237), so every subsequent click on that stack was rejected. Per-slot chains ([overlapping requests](#overlapping-requests)) fix this: a rejected request rolls back to what the server last sent for the slot, and a request planned on a server update keeps that update as its base. The resync mechanism above heals any remaining desync.

## The inventory screen after a nether portal trip  {#inventory-screen-after-portal}

- **Affects:** `bot.equip` (armor, off-hand), `bot.toss`, crafting from the inventory grid, and `bot.moveSlotItem`—every request that requires the player's inventory screen (`lib/bedrock/inventory_model.js` `screen.open()`)
- **Java:** inventory clicks do not require an open screen.
- **Bedrock:** item stack requests on the player's inventory require the inventory screen to be open (`interact open_inventory` → `container_open window_type inventory`). Measured on BDS 1.26.51.1: while the player stands in a nether portal, and for about 1–2 s after stepping out of the arrival portal, BDS silently drops `open_inventory` (sending no `container_open` or anything else). Teleporting via a command (`/execute in nether run tp`) does not cause this.
- **bedboo:** `screen.open()` retries the `open_inventory` request every 1.5 s until the screen opens (with an 8 s timeout). Without this retry, the first equip after a portal trip failed with "the server did not open the inventory screen". Opening the inventory while standing inside a portal still fails (matching vanilla behavior); step out of the arrival portal first.

## Held item selection  {#held-item}

- **Affects:** `bot.quickBarSlot`, `bot.setQuickBarSlot`, `heldItemChanged`
- **Java:** `held_item_slot` both ways.
- **Bedrock:** the server selects a slot with `player_hotbar { selected_slot, select_slot }` (`select_slot: false` is purely informative), and the client announces its selection with `mob_equipment` carrying the exact held item.
- **bedboo:** as described; `bot._bedrock.heldNetworkItem()` returns the exact wire item of the held slot from the inventory model (used by every `inventory_transaction`).

## A server hotbar select can be older than the bot's own selection  {#hotbar-select}

- **Affects:** `bot.quickBarSlot`, `bot.heldItem`, `heldItemChanged` right after `setQuickBarSlot`
- **Java:** `held_item_slot` from the server and the client's `held_item_change` do not cross in practice.
- **Bedrock:** BDS answers console commands (`/clear`, `/replaceitem`, `/give`) with `player_hotbar { select_slot: true }` carrying its selected slot. If such a command runs before BDS reads the bot's latest `mob_equipment` selection, the server's selection is stale: obeying it switches the bot back to the previous slot while BDS applies the bot's new selection, leaving client and server out of sync.
- **bedboo:** if a server selection (`player_hotbar` or the bot's own `mob_equipment`) contradicts a selection the bot sent less than 1 s ago, bedboo ignores it and resends the bot's selection (the resend does not extend the window).

## Off-hand: only off-hand items  {#offhand}

- **Affects:** `bot.equip(item, 'off-hand')`, `bot.clickWindow` on slot 45, the `inventory` example
- **Java:** any item can go into the off-hand slot.
- **Bedrock:** the off-hand accepts only items with the off-hand component (shield, totem, arrows, firework rockets, maps, nautilus shell, …); BDS rejects anything else (status 50). On the wire, the off-hand slot is `offhand` slot **1** for stack requests (slot 0 is rejected), whereas `inventory_content` / `inventory_slot` use index 0.
- **bedboo:** slot 45 maps to `offhand` 1, and equipping a non-off-hand item rejects with the click error. In `examples/inventory.js`, `equip off-hand dirt` is therefore refused, whereas `equip off-hand arrow` works (the item lists then end with `arrow x 16`, since slot 45 is listed last).

## Creative inventory: craft_creative instead of set_creative_slot  {#creative}

- **Affects:** `bot.creative.setInventorySlot`, `bot.creative.clearSlot`, `bot.creative.clearInventory`
- **Java:** `set_creative_slot` writes any item (with any NBT) into a player slot.
- **Bedrock:** a creative player creates items using an item stack request in the inventory screen: `craft_creative { item_id: <creative_content entry id> }` (plus `place` from `creative_output` slot 50 with the request id as the stack id); `destroy` deletes items. Only items in the server's creative inventory (`creative_content`: every base item plus the listed NBT variants, such as enchanted books) can be created — arbitrary NBT (custom names, other enchantments, damage) cannot. BDS rejects a legacy creative `inventory_transaction` and resends the inventory. `craft_creative` is also refused while a container is open (status 7).
- **bedboo:** keeps the upstream signature and guards (same item → no-op; a second concurrent call on the slot → `Setting slot <n> cancelled …`). Replacing an occupied slot sends `destroy` + `craft_creative` + `place` in one request. Slot 45 (off-hand) is also accepted. An item not in the creative inventory, slot 0 (crafting result), or an open window rejects with an explanatory error. `waitTimeout` is unused because the server always answers. The creative index is `bot._bedrock.creativeItems`. For plain items whose creative entries all carry NBT, see [creative defaults](#creative-defaults).

## Plain items from the creative inventory  {#creative-defaults}

- **Affects:** `bot.creative.setInventorySlot` with a plain `firework_rocket`, `firework_star` or `banner`
- **Java:** any item, any NBT.
- **Bedrock:** the creative inventory lists these items only with NBT (rockets with `Fireworks {Flight: 1, Explosions: []}`, banners with `Type: 0`, stars per colour).
- **bedboo:** if an item without NBT has no exact entry, it resolves to the entry with the fewest NBT tags when exactly one has the fewest (the default variant), and the slot then holds that NBT. Enchanted books (where all variants have the same number of tags) remain refused.

## Item use, eating and the shield  {#item-use}

- **Affects:** `bot.activateItem`, `bot.deactivateItem`, `bot.consume`, `bot.usingHeldItem`
- **Java:** `use_item` (hand, sequence, rotation) / `block_dig` status 5; eating ends with `entity_status` 9.
- **Bedrock:** `inventory_transaction item_use click_air` (held item = the server's exact copy; no rotation field — the direction is the yaw and pitch from the same tick's `player_auth_input`) and `item_release release`. A single click_air eats: after 32 ticks, the server sends `completed_using_item { use_method: 'eat' }` along with the shrunk stack. Shields have no use action; a Bedrock player blocks by sneaking with a shield in either hand. On Peaceful, the food level never drops (a hunger effect only empties saturation).
- **bedboo:** `activateItem(offHand)` sends click_air (`hand: off_hand` plus the off-hand item when `offHand` is set); with a shield, it holds sneak instead, and `deactivateItem` releases it. This sneak state belongs to the shield: `clearControlStates()` or releasing the sneak control (mineflayer-pathfinder does both under mineflayer-pvp) leaves it active, just as they leave a raised shield on Java, and `getControlState('sneak')` reports it. `completed_using_item` (or a held-stack change, as in upstream) finishes `consume()` and clears `usingHeldItem`. Java's `set_cooldown` handling has no counterpart because Bedrock item cooldowns are client-side (there is no server packet in protocol 2193).

## Buckets stack  {#stacked-buckets}

- **Affects:** bucket handling (picking up lava or water), `bot.heldItem` after calling `bot.activateBlock` with a bucket
- **Java:** buckets stack to 1; using an empty bucket on a source replaces the held item with the filled bucket.
- **Bedrock:** empty buckets stack to 16. Calling `bot.activateBlock(<lava source>)` while holding a stack of 3 buckets leaves 2 empty buckets in the hand and places the `lava_bucket` into another slot.
- **bedboo:** the library makes no changes and simply mirrors the server's inventory update; count `lava_bucket` or `water_bucket` items instead of checking the held item.
