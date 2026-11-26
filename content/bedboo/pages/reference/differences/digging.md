# Digging and placing

How `bot.dig`, `bot.placeBlock`, `bot.placeEntity`, and item use on blocks work on Bedrock, where the server breaks and
places blocks itself. Observed on BDS 1.26.51.1 (protocol 2193, bedrock-protocol 3.60.1).

## Server-authoritative block breaking  {#protocol}

- **Affects:** `bot.dig`, `bot.stopDigging`, `diggingCompleted`, `diggingAborted`, `bot.targetDigBlock`
- **Java:** the client sends `block_dig` start (status 0), waits `digTime` ms itself, sends finish (status 2), and sets
  the block to air locally; cancel = status 1.
- **Bedrock:** `start_game.server_authoritative_block_breaking` is true on BDS. Block actions ride on
  `player_auth_input.block_action` (one input per tick). Measured behavior:
  - `start_break` = the mouse goes down on the block. From that input on, BDS adds the break progress itself every
    tick — **the start tick counts** — using its own copy of the held item, effects, on-ground, and eyes-in-water
    state. It destroys the block in the input where the progress reaches 1 (`ceil(1/speed)` inputs after and
    including the start input) **as long as the break is held**; no other action is needed. It reports the speed to
    every viewer (`level_event block_start_break` followed by `block_break_speed` every tick, with data = progress per tick ×
    65535, floored), then the destruction with `update_block` (air) + `particle_destroy`, and finally the drops
    (`add_item_entity`).
  - `predict_break` (the client's "it broke") is accepted from that same input on. One input earlier, BDS answers
    with an `update_block` restoring the block (and, while the break is held, still destroys it a tick later).
  - `continue_break` restarts the break on BDS: each one causes it to send `block_stop_break` + `block_start_break`
    to all viewers, restarting other players' crack animations and mineflayer's `blockBreakProgressObserved` every
    tick. `crack_break` is accepted and changes nothing.
  - `abort_break` ends the break. `stop_break` does **not**: after a completed break, BDS keeps "holding" the
    position and destroys the next block placed there (even via `/setblock`) on its own.
  - The face and look direction are not validated (blocks break on any face, while looking away, and at reaches of up to ~7 blocks).
  - Creative: `start_break` alone breaks the block instantly (with no drops); `player_action creative_player_destroy_block` alone
    does nothing.
- **bedboo:** sends `start_break` (in the input after the look), sends nothing while the break is held, and then sends `predict_break` once
  BDS's own per-tick progress reports (`block_break_speed`) show the break is one tick from completion — i.e., in the exact input
  BDS completes it when client and server run in step (the earliest input BDS accepts, as measured), later when the
  server runs behind, and never early. A purely client-side tick count is not enough: on a loaded host, BDS lags behind the
  client's input count and restores the block. When BDS sends no reports, bedboo uses its own count with one tick of
  margin.
  - Completion is triggered by the server's `update_block` (air, or a liquid for waterlogged blocks / ice), followed by
    `abort_break` to release the break state. `dig` settles once the input carrying it goes out (≤ 1 tick later), so
    whatever the caller does next — placing a block at that spot or continuing to dig — reaches BDS after the release
    (measured: without this, a `/setblock` right after the update was broken again by BDS).
  - Creative and instant breaks (progress ≥ 1 in the first tick): `start_break` + `predict_break` in one input.
  - `stopDigging` / a new dig / death / a dimension change: `abort_break`.
  - The speed BDS reports for the dug block replaces the local estimate when they differ, so a mismatch never causes
    the client to predict early.
  - Upstream's arm swing every 350 ms is kept (`animate`).
  - Legacy (non-server-authoritative) servers get `start_break`, `crack_break` every tick, and then `stop_break` + an
    `inventory_transaction` `break_block` after `digTime`, with the block predicted locally as in upstream. BDS is
    always server-authoritative, so this path cannot be tested against it.

## dig() completes on the server's confirmation  {#completion}

- **Affects:** `bot.dig` (when the promise settles), `diggingCompleted`, `bot.lastDigTime`
- **Java:** the promise resolves when the client's own `digTime` timer fires and sets the block to air locally.
- **Bedrock:** the server destroys the block; setting it to air on the client would be a guess that the server may contradict.
- **bedboo:** `dig` resolves (and `diggingCompleted` fires with the air block) after the server's `update_block`: it
  arrives `digTime` − 1 tick + the round trip after the start input (measured over 848 timed digs on a local BDS:
  median −21 ms, −75…+44 ms vs `digTime`), and the dig settles with the release input up to one tick later (see
  [Server-authoritative block breaking](#protocol)).
  - BDS sends `update_block` for the destroyed block more than once within about a tick (for the destruction itself and in response
    to `predict_break` / `abort_break`). Code that waits for "the next update" at that position should let these packets pass
    first.
  - "Broken" means the block becomes air, a liquid (waterlogged blocks, kelp, coral fans, and ice leave water; a bubble column forms over soul
    sand or magma), or a turtle egg with one fewer egg.
  - If the server shows no sign of breaking the block for 40 ticks after `predict_break` (no update and no speed report —
    BDS reports the speed every tick while still breaking; e.g., in adventure mode, or for protected or education-edition
    blocks), the dig aborts like `stopDigging` (`diggingAborted`, rejection `Digging aborted: the server did not
    break <name> at <pos>`); upstream would resolve regardless.
  - A disconnect also rejects a pending dig (`Digging aborted: the connection ended`; upstream's timer would resolve
    it).
  - `bot._bedrock.digging` (internal) keeps diagnostics for recent digs (start and end time, ticks, the speed BDS
    reported, and restores).

## Dig speed: Bedrock status-effect factors  {#dig-speed}

- **Affects:** `bot.digTime`, and `block.digTime(...)` (prismarine-block) when called directly by
  mineflayer-pathfinder or mineflayer-tool
- **Java:** Haste and Conduit Power multiply speed by `1 + 0.2 × level`; Mining Fatigue multiplies it by 0.3 / 0.09 / 0.0027 /
  0.00081 (levels 1–4+).
- **Bedrock (measured, `level_event` data):** Haste and Conduit Power (using the higher level) multiply speed by
  `(1 + 0.2 × level) × 1.2^level` (I 1.44, II 2.016, III 2.7648, V 4.9766); Mining Fatigue multiplies it by `0.21^level`
  (= 0.3^level × 0.7^level: I 0.21, II 0.0441, III 0.0093, IV 0.0019, V 0.0004). Everything else matches Java's formula,
  verified on BDS: tool multipliers per material (from the Bedrock data, including golden 12 and copper 5), the tool tier
  still speeds up a non-harvesting tool (such as a wooden pickaxe on iron ore), Efficiency adds `level² + 1` only when the tool
  multiplier is above 1, Aqua Affinity on the helmet, eyes in water ÷5, not on ground ÷5 (both: ÷25),
  `canHarvest ? 30 : 100`, hardness 0 = instant (BDS reports 65535 = 1.0), and `ceil(1/speed)` ticks.
- **bedboo:** `bot.digTime` uses `lib/bedrock/dig_speed.js` (which shares the structure of prismarine-block's `digTime` with
  the Bedrock effect factors; without those effects, it matches prismarine-block for every block × tool × water / air /
  enchantment). prismarine-block's own `block.digTime` keeps Java's effect factors (unpatched), so plugin cost estimates
  that call it under Haste or Mining Fatigue are off by those factors (the dig itself is still accurate because it waits for the
  server). The patched mineflayer-pathfinder and mineflayer-tool use
  `bot._bedrock.digging.blockDigTime` instead (see [mineflayer-pathfinder](plugins.md#pathfinder) and
  [mineflayer-tool](plugins.md#tool)). For every diggable block, the speed BDS reports equals `bot.digTime`.

## Creative: no breaking with swords, the trident or the mace  {#creative-weapons}

- **Affects:** `bot.digTime`, `bot.dig` in creative mode
- **Java:** `digTime` is 0 for everything in creative (Java creative players cannot break blocks with a sword either,
  but upstream ignores this and the server restores the block).
- **Bedrock (measured):** BDS restores the block when a creative player breaks it while holding any sword, the trident, or
  the mace; spears, tools, other items, and the bare hand break blocks instantly.
- **bedboo:** `digTime` is `Infinity` in creative when holding those items, so `dig` rejects immediately with upstream's
  `dig time for <name> is Infinity` instead of waiting for the server.

## Eye-level water includes waterlogged blocks  {#eye-water}

- **Affects:** `bot.digTime`, `bot._getBlockAtEyeLevel` (unchanged)
- **Java:** upstream counts the eyes as underwater when the eye-level block is `water` / `flowing_water`.
- **Bedrock:** water can also occupy the block's second layer (waterlogged blocks, kelp, seagrass).
- **bedboo:** the eyes are considered underwater in `water`, `flowing_water`, or a block whose layer 1 is water
  (`block.isWaterlogged`). `bot.entity.isInWater` is not used (same as upstream). Digging with the eyes underwater
  takes 5× longer, matching BDS.

## 'auto' dig face  {#dig-face}

- **Affects:** `bot.targetDigFace`, the face of the block actions
- **Java:** `dig(block)` with `digFace` 'auto' looks at the block center and sends face 1 (top).
- **Bedrock:** BDS does not validate the face, but the vanilla client sends the face under its crosshair, and that face
  drives the punch particles other players see.
- **bedboo:** 'auto' (with a look) uses the face where the line of sight from the eyes to the block center
  enters the block (e.g. 4 = west when the bot is west of and level with the block). Face vectors, 'raycast', and
  `forceLook: 'ignore'` (face 1) match upstream.

## Tool durability  {#durability}

- **Affects:** `bot.heldItem` durability after a dig, `heldItemChanged`
- **Java:** the server damages the tool and sends `set_slot`.
- **Bedrock:** the vanilla client attaches an `item_stack_request` `mine_block` { hotbar slot, predicted durability,
  stack id } to its `predict_break`. BDS accepts this only in the exact input where the break completes (one input later, it
  answers `status: error`) and reports the durability in the response's `durability_correction` instead of
  sending the slot. Without the request, BDS damages the tool itself and sends `inventory_slot` with the new `Damage`.
- **bedboo:** sends no `mine_block` request (the prediction lands in the completing input only while the server runs in
  step; see [Server-authoritative block breaking](#protocol)). Instead, the inventory model applies the server's
  `inventory_slot` (Damage +1 per block, the tool disappears when used up, and `heldItemChanged` fires like Java's `set_slot`).

## Digging air  {#dig-air}

- **Affects:** `bot.dig(air)`, `bot.digTime(air)`, `registry.blocksByName.air.hardness`
- **Java:** air has hardness 0: `digTime` is 0 and `dig` resolves immediately with `diggingCompleted`.
- **Bedrock:** minecraft-data PR #1335 and BDS's own block dump give air a hardness of -1 (unbreakable).
- **bedboo:** the data overlay sets air's hardness to 0 (`packages/bedrock-data/scripts/tables.js` `BLOCK_FIXES`), so
  `digTime(air)` is 0 like upstream. Calling `bot.dig` on a block that is air in the world (including a stale Block for a block that
  is already gone, such as the other half of a door) completes immediately with `diggingCompleted(air)` and sends nothing, as BDS never
  reports breaking air. A stale air Block whose position now holds a block is dug normally.

## Blocks that cannot be staged or dug  {#dig-everything}

- **Affects:** `bot.dig`, `bot.digTime` across the whole block registry
- **Java:** every diggable Java block can be placed and dug (with a few exceptions).
- **Bedrock:** the registry has 1,442 diggable blocks. On BDS 1.26.51.1, about 230 of them cannot be placed in a
  survival test world or never break:
  - IDs that `/setblock` refuses: Education Edition `element_*`, compounds, and hardened glass; internal IDs such as
    `unknown`, `info_update`, and `reserved6`; and the `*_concrete_double_slab` and `*_wool_double_slab` states that BDS
    1.26.51.1 does not recognize;
  - blocks that do not stay where they are placed (coral wall fans, tripwire hooks, soul fire, bubble columns, …);
  - `frosted_ice` (melts during the dig);
  - Education Edition `allow`, `deny`, and `border_block` (BDS never breaks them in survival).

  Attachments that face down by default (buttons, item frames, banners, levers) stay only when placed on the floor
  (`facing_direction` 1) or on a wall. "Gone" after a dig means replaced by air or a liquid (ice, kelp, seagrass, coral fans, and sea
  pickles leave water).
- **bedboo:** every other block was dug in survival with the fastest of a netherite pickaxe, axe, shovel, hoe, or
  shears (Efficiency V), a netherite sword, and a bare hand: BDS's reported speed matched `bot.digTime`, and BDS
  never restored a dug block.

## Progress reports after an instant break  {#instant-break-report}

- **Affects:** `bot._bedrock.digging.last.serverSpeedData` (diagnostics)
- **Java:** no equivalent (the client times the dig itself).
- **Bedrock:** after an instant break, BDS may report the block-break progress of whatever replaced the block (such as the water left behind by a
  plant in a water source, e.g. `short_dry_grass`) — sometimes in the batch before the break's `update_block`.
- **bedboo:** an instant break (start and predict in one input) records only an instant report (≥ 1 per tick: the dug
  block's own) as the server's speed; a slower report counts only as server activity.

## Placement protocol: click_block wrapped in start/stop_item_use_on  {#placement-protocol}

- **Affects:** `bot._genericPlace`, `bot.placeBlock`, `bot._placeBlockWithOptions`, `bot.placeEntity`, `blockPlaced`
- **Java:** `block_place` (location, direction, hand, cursor); the server responds with `block_change` for the clicked
  block and then for the block across the face, whether or not it placed anything.
- **Bedrock:** like the vanilla client, clicking a block face sends `player_action start_item_use_on` (clicked block,
  clicked block + face, face) → `inventory_transaction item_use click_block` (the exact server copy of the held item
  including its stack id, the clicked block's runtime id, the click point on the face, the face, the hotbar slot, the hand,
  the player position at EYE level, and prediction `success`) → `player_action stop_item_use_on` (clicked block + face)
  150 ms later. Measured responses (≈ 80–120 ms locally): first the inventory (`inventory_content` of every window: the
  count, durability, or new stack id after a use), then a burst of `update_block` packets — the clicked block, the block across
  the face, the clicked block's lower neighbour, the block across the face again, its upper neighbour, and the clicked
  block again — and ~20 ms later the destination once more with the `place` sound. A refusal (an entity in the way,
  the player's own hitbox, an item that is not a block, or out of the world) receives the same burst with the destination
  unchanged (plus a `set_entity_data` resync) and no inventory change.
- **bedboo:** `bot.placeBlock` and `bot._placeBlockWithOptions` are upstream's code (vendored verbatim);
  `bot._genericPlace` and `bot.placeEntity` keep upstream's checks, options, look, and events. The response matches Java's
  shape (reference block first, then the destination), so upstream's `place_block.js` runs unchanged with its error
  messages (`Server refused to place <item> at <pos>: the block is still <name>`, `Server did not answer the placement
  at …`, `must be holding an item to place`). `_genericPlace` resolves as soon as the click is queued (upstream: right
  after `block_place`); the stop of a click is sent before the start of the next one (pairs never interleave).
  Placement is not predicted client-side (like upstream): the block appears with the server's update.

## Sneak-placing against interactive blocks  {#sneak-placing}

- **Affects:** `bot._genericPlace` and everything built on it (`placeBlock`, `placeEntity`; mineflayer-pathfinder)
- **Java:** mineflayer does not tell the server it is sneaking ("TODO" in `generic_place.js`); mineflayer-pathfinder
  presses sneak itself for its `interactable.json` (Java names).
- **Bedrock:** BDS runs the clicked block's use action (open the chest, crafting table, or furnace, toggle a door, open
  a sign's editor, …) instead of placing unless the player is sneaking. The sneak keys travel in `player_auth_input`, which
  the server must process before the click (one input of ordering is enough; `set_entity_data` `sneaking` is
  the acknowledgement). A flying player never enters the `sneaking` state, but the raw sneak keys in the input still count.
- **bedboo:** when the reference block is interactive (`lib/bedrock/placement.js` `isInteractive`, Bedrock names:
  containers, stations, doors / trapdoors / gates except iron, buttons, levers, repeaters, comparators, signs, beds,
  cakes, item frames, …), `_genericPlace` holds the sneak control, waits until it has been sent with an input
  (`bot._bedrock.physics.controlsSent()` when present, otherwise the next sent input) and acknowledged by the server (except
  while flying), clicks, and then releases the sneak it pressed (any sneak held by the caller, such as mineflayer-pathfinder's, is
  kept). Nothing is pressed while riding, because sneaking dismounts on Bedrock. While flying, the bot may descend slightly
  during that tick (sneak = descend). This allows placing on top of a chest, crafting table, furnace, wooden door, standing
  sign, or barrel in survival, and against a chest in creative flight.

## Placements wait for the server's answer to the previous click  {#placement-serialization}

- **Affects:** `bot.placeBlock`, `bot._placeBlockWithOptions`, `bot.placeEntity`, `bot.activateItem` with buckets and
  boats — when several run at once or back to back
- **Java:** `block_place` carries no item, so placements in flight never invalidate each other.
- **Bedrock:** every click carries the exact server copy of the held item. BDS assigns the stack a new stack id after
  each use (`inventory_content`, right before its `update_block` answer) and refuses a click that carries the old id (live:
  when two placements occur 0–30 ms apart, the second is refused).
- **bedboo:** the placer (`lib/bedrock/placement.js`) serializes clicks: the next click is sent once the held
  item updates, the clicked block receives an answer, or 500 ms elapse. Sequential awaited placements (e.g.
  mineflayer-pathfinder) never wait, and `Promise.all` of placements places all of them. A bucket or boat use
  (`activateItem` → the looked-at block) issued while a placement is still unanswered keeps its target and hotbar slot and
  runs afterward. Other item uses (`activateBlock`, the `click_air` of `activateItem`) are not serialized: if fired
  right after a placement without awaiting, they can still carry the old stack id.

## A click with a stale block state is retried  {#stale-click}

- **Affects:** `bot.placeBlock` / `_placeBlockWithOptions` against a block that the server changed right before
- **Java:** `block_place` carries no block state.
- **Bedrock:** the click carries the clicked block's runtime id, and BDS refuses any click whose id does not match its own state
  for that block. Because BDS updates some blocks a tick after a neighbour update (farmland and grass paths turn into dirt under
  a placed block, 50–90 ms after the placement's answer), the next click against them was refused.
- **bedboo:** the answer to a click reveals the server's state for the clicked block. If a refused click carried
  a different state, it is retried once with the block's current state (via a wrapper around the vendored `place_block.js` in
  `generic_place.js`). Any other refusal rejects as in upstream. A click that changed the clicked block itself is never
  treated as stale: against a replaceable block (`snow_layer`, `short_grass`, `fern`, `vine`, `seagrass`, …) or a
  block the held item merges into (the same half slab → double slab, one more candle / sea pickle / snow layer /
  petal, a candle onto a cake), BDS places the block into the clicked position and leaves the block across the face unchanged —
  matching Java, so the call rejects with upstream's `Server refused` after one click (instead of clicking
  again and placing a second block above it). A click that used up an item is not treated as stale either.

## A click whose held stack changed on the server is retried  {#stale-held}

- **Affects:** `bot.placeBlock` / `_placeBlockWithOptions` while items are picked up, given (`/give`), or otherwise
  added to the held stack (dig-then-place loops, mineflayer-pathfinder's scaffolding)
- **Java:** `block_place` carries no item.
- **Bedrock:** the click carries the exact server copy of the held item (its stack id). If a pickup merges into the
  held stack between the click and its processing, the server assigns the stack a new stack id first (`inventory_transaction`
  normal, then `inventory_content`), and BDS refuses the click (measured: 4 of 180 placements in a dig-then-place
  loop; a `/give` right before the click: every time).
- **bedboo:** the placer tracks server-side changes to the held slot between a click and its answer (an
  `inventory_transaction` on that slot, or stack growth). A refusal under those conditions is retried once with the server's copy (which the
  client has by then). Any other refusal rejects as in upstream.

## Pillaring and bridging (mineflayer-pathfinder scaffolding)  {#scaffolding}

- **Affects:** `bot._genericPlace` (jump-placing), mineflayer-pathfinder `allow1by1towers` and bridging
- **Java:** pathfinder jumps and calls `placeBlock` under its feet as soon as they leave the ground; a refused click
  resets the path (`place_error`), and it tries again.
- **Bedrock:** BDS refuses any block that intersects the player's server-side hitbox (measured: an overlap of 0.01
  block is refused; nothing is ever placed into the player, so there is no push-out). Because BDS processes a click
  after the player inputs sent before it, the click must follow an input where the hitbox is clear of the destination.
- **bedboo:** while the bot rises out of the destination block or keeps jumping (with the jump control held), the click
  waits (≤ 20 inputs) for the first input where the hitbox clears the block, and then follows it; a bot that will not
  clear the block clicks at once and gets the server's refusal, just like upstream. Measured (survival, gravity, local
  BDS):
  - manual pillar ×4 (place as soon as the feet leave the ground): 0 refusals, 0 corrections;
  - pathfinder pillar ×5: 0 `place_error`, 0 corrections (≈ 0.45 s per block; the click goes out 2 ticks after the
    feet leave the ground);
  - manual bridge ×4 (sneak backwards to the edge, place against the side of the block below): 0 corrections;
  - pathfinder bridge ×5–6: unpatched, 3–4 corrections of 0.16–0.64 block, all from pathfinder's own `fullStop()`,
    which moves `bot.entity.position` to the block centre client-side ("the server will not tell the difference" on
    Java; a server-authoritative BDS does: it corrects the bot back, and then the bot walks on). The patched pathfinder
    skips that recentring: 0 corrections (see [mineflayer-pathfinder](plugins.md#pathfinder)).

  Pillaring under a ceiling has its own limit: see [1×1 towers](plugins.md#towers).

## No placement from the off-hand  {#offhand-placing}

- **Affects:** option `offhand` of `bot._genericPlace` / `bot._placeBlockWithOptions` / `bot._placeEntityWithOptions`
- **Java:** `hand: 1` places the off-hand item.
- **Bedrock:** the off-hand only holds a few items (shield, totem, arrows, rockets, maps, …; see
  [Off-hand](inventory.md#offhand)), and the player never uses it on a block. A click with `hand: off_hand` and the
  off-hand item (or the main-hand item) places nothing (measured with a block forced into the off-hand by
  `/replaceitem`).
- **bedboo:** the click is sent just as the vanilla client would send it (hand `off_hand`, the off-hand's wire item),
  the server refuses, and `placeBlock` rejects with upstream's refusal message; upstream's check for an empty off-hand
  is kept.

## placeEntity  {#place-entity}

- **Affects:** `bot.placeEntity`, `bot._placeEntityWithOptions`, `entityPlaced`
- **Java:** sends a click on the block (`block_place`), and boats additionally send `use_item` (a server raycast along
  the look vector). The entity is matched by name (`EnderCrystal` / `end_crystal`, `boat`, `armor_stand`, or the spawn
  egg's mob) within 2 blocks (3 for boats) of the destination. Minecarts are not supported (assertion 'Unimplemented').
- **Bedrock:** everything is a click on a block: armor stands, end crystals (obsidian / bedrock), spawn eggs, minecarts
  (on a rail), and boats (BDS ignores a boat's `click_air`; the vanilla client clicks the water it aims at, and boats
  can also be placed on land). Entity names: `ender_crystal`, `boat` / `chest_boat` (chest boats, rafts), `armor_stand`,
  `minecart` / `chest_minecart` / …, and spawn eggs `villager` → `villager_v2`, `zombie_villager` → `zombie_villager_v2`,
  `evoker` → `evocation_illager`, `tropical_fish` → `tropicalfish`. A hostile mob's spawn egg spawns nothing in
  peaceful (though the egg is consumed).
- **bedboo:** upstream's code with the following changes:
  - a boat whose reference block is a liquid clicks the liquid's top face (it spawns centred on the liquid regardless
    of which face was given; the look vector does not matter, so the boat never lands on the bot);
  - minecarts are accepted (on a rail), and chest boats are also accepted on land;
  - uses the Bedrock names listed above;
  - whereas upstream stops listening after the first `entitySpawn` even if it is another entity (and then always times
    out after 5 s), here the listener stays active until the placed entity spawns or the timeout expires
    ('Failed to place entity', unchanged).

## Item use on blocks: buckets, flint and steel, bone meal, fireworks  {#item-use-on-blocks}

- **Affects:** `bot.placeBlock` / `bot.activateBlock` / `bot.activateItem` with these items
- **Java:** `activateItem` (`use_item`) uses a bucket or a boat on the block the player is looking at (via a server raycast); `placeBlock` / `activateBlock` with a bucket, flint and steel, or bone meal acts on the clicked block.
- **Bedrock:** BDS ignores `click_air` for buckets and boats (measured: nothing happens). Instead, the vanilla client clicks the looked-at block (`click_block`: an empty bucket clicks the liquid source itself, while a filled bucket clicks the solid block behind the liquid, placing the liquid against the clicked face). `click_block` with flint and steel lights a fire (turning an obsidian frame into `portal` blocks), bone meal grows the clicked plant, and a firework rocket used on a block launches it. As in Java, using a rocket in the air without gliding does nothing.
- **bedboo:** `placeBlock` resolves with `blockPlaced(air, water|lava)` for a water or lava bucket, and with `blockPlaced(air, fire|portal)` for flint and steel; `activateBlock(<liquid source>)` with an empty bucket fills the bucket. `bot.activateItem` with a bucket or a boat calls `bot._bedrock.placement.useOnLookedAtBlock(item, offHand)`, which is the Bedrock equivalent of that action: it raycasts along the look vector (hitting liquids if the item acts on them) and then clicks the hit block. For other item uses, see [Item use, eating and the shield](inventory.md#item-use).
