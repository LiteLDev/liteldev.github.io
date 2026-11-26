# Ecosystem plugin patches

The mineflayer ecosystem plugins run on bedboo without changes, except for a few small `pnpm patch`es in `patches/` (`patches/mineflayer-*.patch`). This page explains what each patch changes and why. It also notes where the plugins behave differently on Bedrock than on Java, along with helpful workarounds. For recommended usage, see [Plugins](../../guide/plugins.md). Observed on BDS 1.26.51.1 (protocol 2193).

## mineflayer-pathfinder 2.4.5 patch  {#pathfinder}

- **Affects:** `Movements`, `bot.pathfinder.bestHarvestTool`, `goto`, `stop`, the path executor (`monitorMovement`, `fullStop`, `postProcessPath`), and everything built on it (mineflayer-collectblock, mineflayer-pvp, mineflayer-tool's chest retrieval)
- **Java:** Block-name sets use Java names; doors are dug through (only fence gates can be opened, and `canOpenDoors` was left off upstream); `fullStop()` recentres the bot by moving `bot.entity.position` ("the server will not tell the difference"); dig costs come from prismarine-block `block.digTime` with the tool's simplified NBT.
- **Bedrock:** Block names differ (`flowing_water` / `flowing_lava` are separate blocks, along with `web`, `wooden_door`, `fence_gate`, `standing_sign`, `lit_furnace`, … — `lib/interactable.json` only knew Java names); server-authoritative movement corrects any client-side position change (recentring cost 3–4 corrections of 0.16–0.64 block per bridge; see [scaffolding](digging.md#scaffolding)); Bedrock items store enchantments in `ench` (numeric IDs), and BDS applies Bedrock's Haste / Mining Fatigue factors ([dig speed](digging.md#dig-speed)).
- **bedboo (patch, new file `lib/bedrock.js` + edits):**
  - names: `flowing_water` / `flowing_lava` are added to `liquids` and `replaceables`, and `flowing_lava` is added to `blocksToAvoid`; water-filled blocks (`seagrass`, `kelp`, `bubble_column`, …) and waterlogged blocks count as liquid, and the post-processed path centres in them (backport of upstream master #384); `interactable.json` gets the 156 Bedrock interactive block names (the same set as `lib/bedrock/placement.js`), so the pathfinder also sneaks before placing against them ([sneak-placing](digging.md#sneak-placing));
  - doors and gates: `openable` holds the hand-openable doors (`wooden_door`, `spruce_door`, …, copper doors; never iron) alongside fence gates; with `canOpenDoors`, a closed door or gate becomes a `useOne` click (the door's upper half is not dug), while an open door or gate (`open_bit`, Java `open`) is passable and never clicked again; the doorway node is the floor centre, and a `useOne` node no longer stops path post-processing (backport of master #372); after the click, the executor keeps walking (upstream left `placing` set and then either read `placingBlock.y` of undefined or reset the path for lack of scaffolding blocks). Because BDS opens only a door's lower half (the upper half keeps `open_bit` 0), the upper half gets the open leaf's shape from bedboo's `blockAt()` ([door halves](world.md#door-halves)), allowing the bot to walk back through a door it opened instead of finding no path or digging it;
  - `fullStop()` keeps upstream's zeroed horizontal velocity but skips the recentring teleport when the bot has `bot._bedrock.physics` (server-authoritative movement). Measured: 0 corrections on a pathfinder bridge (down from 3–4), and at most one occasional ~0.24-block correction when BDS rejects the zeroed velocity (merely releasing the keys let the bot drift out of the goal block);
  - dig costs (`bestHarvestTool`, `safeOrBreak`): uses `item.enchants` (supporting both Java `Enchantments` and Bedrock `ench`; the simplified NBT used `id`, which prismarine-block never matched) and `bot._bedrock.digging.blockDigTime` when present (for Bedrock effect factors, falling back to prismarine-block's `digTime` otherwise);
  - backports of master #375: calling `stop()` while idle no longer latches (which previously stopped the next goal), and `goto` rejects with `NoPath` instead of resolving on an empty failed search. Because mineflayer-collectblock's `cancelTask()` relied on that latch (calling `stop()` while the pathfinder is idle during a dig), its patch now cancels the task directly ([mineflayer-collectblock](#collectblock));
  - `lib/passableEntities.json` now includes the Bedrock names of passable entities (`xp_orb`, `xp_bottle`, `splash_potion`, `lingering_potion`, `fireworks_rocket`, `thrown_trident`, `fishing_hook`, `evocation_fang`, `wind_charge_projectile`, `breeze_wind_charge_projectile`, `ender_crystal`, `eye_of_ender_signal`, `ominous_item_spawner`, `wither_skull_dangerous`): with only the Java names, XP orbs and projectiles counted as obstacles (incurring entity cost and preventing pillaring or scaffolding where an orb was);
  - `detectDiggingStopped` removes only its own listeners (`removeAllListeners(event, fn)` ignores `fn` and previously dropped every other `diggingCompleted` / `diggingAborted` listener on the bot);
  - a dynamic goal (`GoalFollow`) replans when the bot is pushed more than a block away from where its finished path was computed (previously, a skeleton's arrows could push a mineflayer-pvp bot permanently out of range because the target itself had not moved far enough to trigger `hasChanged()`);
  - failed placements never hang the path (upstream 2.4.5 and master d773d15 both hang — master's open PR #365 only moves the futility check; affects any server, including Java):
    - upstream: a rejected `bot.equip` for the scaffolding block never released `lockEquipItem`, causing the executor to return early on every tick before its futility check forever; a refused placement reset the path into the same placement indefinitely; `stop()` waited for a node or a reset that never came;
    - now, the equip lock is held from equip until the placement settles, and is released on every outcome;
    - a failed equip, placement, or door click (`equip_error`, `place_error`, `use_error`), or one that exceeds `placeTimeout` (10 s, `place_timeout`), is counted at its cell: a cell that fails more than `maxPlaceRetries` (1) times is added to `bot.pathfinder.refusedPlacements`, causing `Movements#getNeighbors` to skip planning placements there for the current goal (re-setting the same goal object—such as a caller's retry—retains them, while setting a different goal or calling `stop()` clears them);
    - `maxPlaceFailures` (6) consecutive failures abandon the goal (`path_update` 'noPath', `goto` rejects with `NoPath` "… placements failed in a row"; the goal is dropped unless dynamic, so no later reset revives it);
    - calling `stop()` during a placement settles on the next tick; a placement abandoned by a stop, reset, or new goal changes nothing when it settles late (and never releases a newer placement's lock); the walk back to `returnPos` after a placement is bounded just like a walk to a node;
    - after a failure, the bot steps back onto the block it leaned out from, and when its floored position is over a gap, path searches begin from the block the bot is actually standing on (upstream started from the cell over the gap and planned a placement against the air beneath it — after stopping at a bridge edge, the next `goto` wasted 2 × 10 s on it).

## Long searches and partial paths  {#pathfinder-long}

- **Affects:** mineflayer-pathfinder `goto()` to goals 100+ blocks away over hills (same on Java)
- **Java / Bedrock:** identical upstream behaviour: `goto(GoalLookAtBlock(<ore 90 blocks away>))` rejects with "Took to long to decide path to goal!" — `goto` rejects on the search's `timeout` status instead of following the best partial path, even though the pathfinder still walks that partial path and nothing re-plans when it ends.
- **bedboo:** nothing in the library or the patch. Workarounds (used by the bundled agent, `packages/agent`): walk to distant goals in 32-block legs (`GoalNearXZ` waypoints, shifting 16 blocks to the side when a leg fails) with `thinkTimeout` set to 10 s; after a timeout, wait for the partial walk to finish and search again from there; give up if the bot has not moved for 30 s. A 1×1 pillar requires the bot to be centred in its column (a hitbox overlapping a neighbouring column hits that column's ceiling when jumping), so centre the bot before each jump.

## No path out through a door the bot just placed  {#own-door}

- **Affects:** mineflayer-pathfinder (patched, `canOpenDoors`) right after the bot places a wooden door and stays connected
- **Java:** not observed.
- **Bedrock (observed, not explained):** a bot that placed a house door from the inside got `NoPath` for every goal outside; after rejoining, the pathfinder opened the same door and walked out. The door's block states as seen by the bot are correct (`open_bit` on the lower half, `upper_block_bit` on the upper half, unchanged after rejoining), so the world model is not the cause; not investigated further.
- **bedboo:** no fix. Workaround: place doors from outside the footprint, and leave a finished structure through its door explicitly (`activateBlock` + walk); when stuck, open an adjacent closed door and step through.

## mineflayer-pathfinder drops into lava  {#pathfinder-lava-drop}

- **Affects:** anyone using mineflayer-pathfinder's defaults in the Nether
- **Java / Bedrock:** identical upstream behaviour: `Movements.infiniteLiquidDropdownDistance` (default true) lets a path drop from any height into a "liquid", and the pathfinder's liquids include lava — a Nether path dropped the bot into the lava ocean (measured: "\<bot> tried to swim in lava" while exploring at y 26).
- **bedboo:** nothing in the library or the patch. Workaround: set `infiniteLiquidDropdownDistance = false` (limiting drops to `maxDropDown` 3) and add portals, fire, magma, berry bushes, … to `blocksToAvoid`.

## Pillaring (1×1 towers) under a ceiling  {#towers}

- **Affects:** mineflayer-pathfinder's `allow1by1towers`
- **Java:** the pathfinder jumps and places a block under its feet, clearing only the block two above its feet. Java's server accepts the placement as soon as the client reports that it rose, and the client re-centres itself on the pillar.
- **Bedrock:** BDS refuses any block that overlaps the player's server-side hitbox ([scaffolding](digging.md#scaffolding)), and the patched pathfinder no longer re-centres the bot (which caused corrections). An off-centre hitbox spans the neighbouring columns; a block two or three above the feet in one of those columns (e.g. the underside of the End island above the arrival platform) cuts the jump short, so every placement is refused (measured: 204 `place_error` path resets in a row, leaving the bot stuck on a 3-block pillar).
- **bedboo:** nothing in the library. Workaround: near a ceiling, drop tower steps when any of the nine columns has a block 2–3 above the feet, forcing the pathfinder to dig a staircase instead (End platform → island top in ≈ 25 s). Elsewhere, towers work (a bot that dug itself into a 1×1 shaft is already centred and towers out fine).

## Bridging over the Nether's lava ocean  {#nether-bridges}

- **Affects:** mineflayer-pathfinder scaffolding in the Nether
- **Java / Bedrock:** identical: a bridge over the lava ocean leaves the bot exposed (a hoglin's toss or a crossbow bolt knocks it into the lava).
- **bedboo:** nothing in the library. Workaround: in the Nether, do not place scaffolding blocks over drops deeper than 4 blocks; the pathfinder will dig through rock instead.

## mineflayer-tool 1.2.0 patch  {#tool}

- **Affects:** `bot.tool.getDigTime`, `equipForBlock`, `retrieveTools`' cost order
- **Java:** `block.digTime(type, …, nbt.simplify(item.nbt).Enchantments, effects)`.
- **Bedrock:** enchantments are `ench` NBT with numeric ids; Bedrock effect factors ([dig speed](digging.md#dig-speed)).
- **bedboo (patch):** `item.enchants` + `bot._bedrock.digging.blockDigTime` (else prismarine-block) — the estimate
  matches `bot.digTime` with that tool in hand, so Efficiency picks the enchanted tool.
  - Upstream bug fixed (not Bedrock-specific): calling `equipForBlock(block, { requireHarvest, getFromChest })` with no
    harvesting tool in the inventory called `retrieveTools()`, which returns without an error when there is no chest
    (or no chest has a tool), and then called itself again forever. Without chests, this created an endless chain of
    microtasks that froze the event loop and crashed the process out of memory within ~25 s (e.g. mineflayer-collectblock's
    `collect()` on coal ores without a pickaxe; its options are `{ requireHarvest: true, getFromChest: true,
    maxTools: 2 }`). The patch searches chests only when some are present, and only for one round; otherwise (or
    if still without a tool) the call rejects with `NoItem`, just as it does without `getFromChest`.

## mineflayer-collectblock 1.6.0 patch  {#collectblock}

- **Affects:** `bot.collectBlock.collect(target, [options], cb)` (callback form), the drops it picks up,
  `cancelTask()`
- **Java / Bedrock:** the same upstream bugs on both:
  - `callbackify(this.collect)` lost `this`, so the callback form (mineflayer's `examples/collectblock.js`) always
    failed with "Cannot read properties of undefined (reading 'bot')";
  - a mined block's drops spawn at a random point 0.25–0.75 into the block on each axis (minus half the item height),
    up to ~0.52 of a block from its centre (measured on BDS: 0.17–0.52). collectblock only targets drops within 0.5 of the
    centre, so every so often a drop was left behind (Java has the same spread);
  - if a target block was already gone when its turn came (mineflayer-pathfinder digs whatever is in its way, e.g. the
    log above a dug one while following that log's drop), it got a `GoalLookAtBlock` on air, which never ends: the search
    hit its 5 s timeout and `collect()` rejected (measured: 2 of 4 runs collecting 5 logs);
  - `cancelTask()` calls `bot.pathfinder.stop()` and waits for the job to end. With pathfinder 2.4.5, the stop latched
    while the pathfinder was idle (during a dig or while waiting for a pickup), so the job's next `goto` rejected with
    `PathStopped`, which `collect()` swallows. Because the patched pathfinder no longer latches
    ([mineflayer-pathfinder](#pathfinder)), the cancel was lost and `cancelTask()` waited for the whole job (measured:
    17 s for 4 logs).
- **bedboo (patch):** `callbackify(this.collect).call(this, …)`; drops within 0.75 of the mined block's centre are
  collected; a block target that has changed is dropped before pathing to it; `cancelTask()` also flags the running job,
  which checks the flag after each step (`goto`, the dig, the pickup wait, emptying the inventory) and ends with
  `PathStopped` as before — after the step in progress, as with pathfinder 2.4.5 — while a pickup wait ends immediately.
  Nothing else is patched: digging waits for the server ([completion](digging.md#completion)), drops use
  `itemDrop` → `GoalFollow` → `playerCollect` / `entityGone`, and the chest flow uses `openChest` / `deposit` unchanged.

## Ore search uses the chunk data  {#ore-search}

- **Affects:** `bot.findBlocks` for ores (mineflayer-collectblock's examples do the same)
- **Java / Bedrock:** identical — the server sends whole chunks, and bots locate blocks with `bot.findBlocks`.
- **bedboo:** nothing to change. Nether facts worth knowing when mining there:
  - the ancient debris band at y 8–22 (the big veins, around y 15) mostly lies under the lava ocean (y ≤ 31): targets
    there often sit under an open cavern, so mineflayer-pathfinder bridges and pillars through the void towards them
    or the bot falls into the lava. It works better to search above the lava ocean first (y ≥ 32, where the small veins are), require
    the debris to be buried in rock up to the bot's level (no open cavern or lava above it), and fall back to the
    8–22 band or a straight branch-mining tunnel;
  - when pathing to ores, never break a block next to a liquid;
  - mining nether gold angers any piglins that see it, whether the bot wears gold armour or not (crossbow piglins then shoot the bot): mine
    it last and never within 20 blocks of a piglin.

## mineflayer-armor-manager 2.0.1 patch  {#armor-manager}

- **Affects:** auto-equip on `playerCollect`
- **Java:** each picked-up piece starts `equipItem` 100 ms later; with Java's instant window clicks, the equips rarely
  overlap.
- **Bedrock:** every click waits for the server's item stack response, so pieces picked up together equip at the same
  time; their clicks interleave through the shared cursor and swap the pieces around (measured: 1 of 5 pieces ended up
  equipped).
- **bedboo (patch):** the equips run one after another (via a promise queue). `getDroppedItem()` and the Java armor slots
  5–8 / off-hand 45 work as is; `supportFeature('doesntHaveOffHandSlot')` is false.

## mineflayer-auto-eat 5.0.3 patch  {#auto-eat}

- **Affects:** `bot.autoEat.eat()`, `enableAuto()`
- **Java:** a meal ends with `entity_status` 9 on `bot._client`.
- **Bedrock:** no `entity_status` packet; BDS sends `completed_using_item` to the eater (which `bot.consume` waits for).
- **bedboo (patch):** the eating listener also completes on `completed_using_item`. The plugin is ESM-only (load it
  with `await import('mineflayer-auto-eat')`); `registry.foods` / `foodsByName` come from bedrock-data; its GPL-3.0
  dependency `@nxg-org/mineflayer-util-plugin` is used unmodified (it requires Java version comparisons
  ([version comparisons](data.md#version-comparisons)), `bot.version.split('.')`, `clickWindow`,
  `inventory.selectedItem`, and `firstEmptyInventorySlot`). Hunger only drops on difficulty easy or harder (on peaceful,
  Bedrock never lets the food level drop).
  - Upstream bugs fixed (not Bedrock-specific):
    1. `eat()` sets its eating flag before equipping the food and only cleared it on the paths after the meal started:
       a failed equip (`customEquip` → false, e.g. from an open window or a simultaneous hand swap) left
       `isEating` true permanently — every subsequent `eat()` threw `Already eating!` and automatic mode never ate again
       ([details](#auto-eat-stuck)). Now any failure before the meal starts (no food, equipping, or activating the item)
       clears the flag; as upstream, such a failure still emits nothing because no meal started.
    2. With `strictErrors` (the default), a failed meal (timeout, switching the item away, `cancelEat()`) threw before
       emitting `eatFail`, so the default options never emitted a failure event; now `eatFail` fires first
       (followed by `eatFinish`, then the rejection), matching `strictErrors: false`. `eatFail` is emitted once per failure:
       code that manually emitted it with the error thrown by `eat()` (as a workaround for the missing event) will not report a
       failure twice.
  - Automatic mode waits 2 s before retrying a meal that could not start (otherwise a failing equip would repeat
    on every tick), and retries immediately after a meal that failed, as upstream; calling `eat()` directly is never delayed. A
    throwing `eatStart` listener no longer leaves the flag set either, as the event is emitted inside the meal's `try` block.

## mineflayer-auto-eat eats whenever health \< 14  {#auto-eat-health}

- **Affects:** mineflayer-auto-eat 5.0.3 `minHealth` (default 14), on both Java and Bedrock
- **Java:** the same option; eating ordinary food at low health with a full food bar causes the same futile loop.
- **Bedrock:** a player with a full food bar cannot eat (BDS refuses the meal), so an auto-eat triggered by low health
  alone starts a meal on every tick that never completes (timing out after 3 s each).
- **bedboo:** nothing patched. Recommended options: `minHealth: 0`, `minHunger: 16` (eat based on hunger only).

## mineflayer-auto-eat stops eating after a refused equip  {#auto-eat-stuck}

- **Affects:** mineflayer-auto-eat 5.0.3 `eat()` / its automatic mode (same code on Java)
- **Java / Bedrock:** identical upstream bug: `eat()` sets its "eating" flag before equipping the food and clears it
  only on paths after the meal starts; an equip that throws (e.g. from other code or a fight swapping the hand at the same
  moment, or an open window) leaves the flag set, and automatic mode (`physicsTick` → `if (!_eating) eat()`) never
  tries again (observed: a bot remained at food level 5 with 5 cooked meals in its inventory for minutes).
- **bedboo:** fixed in the [mineflayer-auto-eat patch](#auto-eat): the flag is cleared after any failure before the
  meal starts. As a last resort, resetting a meal that has been "in progress" for 15 s remains a sensible safety net.

## mineflayer-auto-eat against the pathfinder's held item  {#auto-eat-livelock}

- **Affects:** bots that dig or place while hungry with mineflayer-auto-eat enabled
- **Java / Bedrock:** identical upstream behaviour. auto-eat starts a meal on any physics tick where the food level is
  below `minHunger` and the bot is carrying something edible (it equips the food and holds "use"); as soon as the held item changes, it aborts the meal with
  "Item switched early". mineflayer-pathfinder equips a tool to dig and a block to
  place — on the next tick, auto-eat equips the food again. A hungry bot whose path requires digging or placing a block does
  neither (measured: a bot stood for 12 min next to a lava pool at food level 4 while carrying nine rotten flesh, with every walk timing out).
- **bedboo:** nothing patched. Workaround: eat first while standing still (call auto-eat's own `eat()` with the pathfinder
  stopped) before starting a task that digs or places; do not treat an ongoing meal as an interruption to retry indefinitely;
  bound retries and searches by time.

## mineflayer-pvp 1.3.2 patch, shield and timing  {#pvp}

- **Affects:** `bot.pvp` (creeper shield block, shield use, attack timing, `followRange`)
- **Java:** a fusing creeper has metadata index 16 = 1; the shield is raised with `activateItem(true)`; the attack rate
  follows Java's weapon cooldowns.
- **Bedrock:** a fusing creeper has the `ignited` entity flag; a shield is raised by sneaking (no use action; see
  [Item use, eating and the shield](inventory.md#item-use)); there is no attack cooldown.
- **bedboo (patch):** `checkExplosion` also reads `metadata.flags.ignited` (measured live: the flag is set, and pvp raises
  the shield). Unpatched:
  - `activateItem(true)` and `deactivateItem()` hold and release sneak, so the bot moves at sneaking speed between attacks
    while holding a shield; because that sneak state belongs to the shield, pathfinder's `clearControlStates()` (called when a chase
    ends, before a dig or placement, and on `stop()`) does not release it;
  - the Java cooldown timing simply attacks slightly slower than Bedrock allows;
  - with the default `followRange` of 2, a skeleton that backs away while shooting stays 4 blocks away (`GoalFollow`
    re-plans only when the target has moved further than the range, just as on Java): use `bot.pvp.followRange = 1` against
    ranged mobs;
  - pvp listens to `physicTick` (mineflayer prints its deprecation warning, as on Java).

## Core fixes found by running the plugins  {#core-fixes}

- **Affects:** `bot.stopDigging`, `bot.creative.flyTo`, `bot.waitForChunksToLoad`
- **Java:** n/a (library behaviour that the plugins rely on).
- **Bedrock:** the plugins exercise timing that basic API calls do not.
- **bedboo:**
  - `lib/plugins/digging.js`: `blockUpdate` listeners run before the dig's per-position listener; mineflayer-pathfinder
    stops digging on any change near its path, so every pathfinder dig ended with `diggingAborted` ("Digging aborted")
    even though the block broke. Calling `stopDigging` when the block is already broken now completes the dig like upstream
    (where `finishDigging` clears `targetDigBlock` before the local update).
    `bot._bedrock.digging.blockDigTime(block, type, creative, inWater, notOnGround, enchantments, effects)`
    (using prismarine-block's signature with Bedrock factors) is provided for the plugins' cost estimates.
  - `lib/plugins/physics.js`: the creative `flyTo` planner never presses forward again within 10 ticks of releasing it
    (BDS sprint-flies after a double-tapped forward), preserves its jump guard across consecutive `flyTo` calls, and never
    lands short of a destination above the landing spot (BDS stops flying when the player touches the ground); see
    [flight](movement.md#flight).
  - `waitForChunksToLoad`: when called on "loaded" right after a teleport, it timed out because columns that BDS sent during
    join (beyond its advertised publisher radius) were unloaded and never resent; `lib/plugins/blocks.js` now retains
    them.

## Ported mineflayer examples  {#examples}

- **Affects:** the library's `examples/`
- **Java:** mineflayer 4.39.0 `examples/` (`require('mineflayer')`).
- **bedboo:** 51 example files are ported using `require('bedboo')` and are otherwise identical. Hard-coded Java item and
  block names are kept as-is (for example, `fish` in fisherman and `sign` in graffiti are neither Bedrock names nor modern
  Java ones). `auto-eat.js` is updated for the pinned mineflayer-auto-eat 5 API (ESM `import()`, `setOpts`, `enableAuto` /
  `disableAuto`, `eatStart` / `eatFinish`), which the upstream example predates. Not ported: `session.js` (Java
  launcher-profile authentication), `discord.js` / `telegram.js` (third-party bots with nothing Bedrock-specific),
  `perfectShotBow.js` (minecrafthawkeye, Java), `viewer/`, `screenshot-with-node-canvas-webgl/` (prismarine-viewer:
  Java chunks), `anvil_saver/` (Java Anvil world files), and `python/`. Where an example depends on Bedrock behavior:
  - BDS refuses `/op` from a player; grant op from the server console instead ([op command](chat.md#op-command));
  - `bee.js` (creative `flyTo`) actually flies on Bedrock, so its 11 short legs take ≈ 15.5 s instead of ≈ 3 s
    ([flight](movement.md#flight));
  - `inventory.js`: `equip off-hand` accepts only off-hand items such as arrows, not dirt ([off-hand](inventory.md#offhand)).
