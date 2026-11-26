# Player state and survival

Death and respawn, dimension changes, experience, abilities, the spawn point, and the survival interactions (beds, fishing, and books). Observed on BDS 1.26.51.1 (protocol 2193) with bedrock-protocol 3.60.1.

## Respawn handshake  {#respawn}

- **Affects:** `bot.respawn()`, the `respawn` option, `isAlive`, `death` / `respawn` / `spawn` events.
- **Java:** death = `update_health` ≤ 0; `client_command` (perform respawn) → server `respawn` packet → `update_health` → `spawn`.
- **Bedrock:** death = the player's own `entity_event death_animation` + `minecraft:health` attribute 0 (no `set_health` 0), then `respawn` state 0 (searching) at the death position. Respawning is a 3-step handshake: client `respawn` state 2 (client_ready; ignored by BDS if sent before the server's state 0) → server `respawn` state 0 + state 1 (ready, eye-level spawn position) → client `player_action respawn` → server `entity_event respawn` + `set_health 20`. Respawning into another dimension (for example, dying in the nether and spawning in the overworld) inserts a `change_dimension` **without loading_screen_id** between the client state 2 and the server state 1; replying to it with `serverbound_loading_screen` disconnects the client (`unexpected_packet`).
- **bedboo:** same API and event order as upstream (`health` → `death`; `respawn` at the server's state 1, the analog of Java's respawn packet; `spawn` from the lifecycle once the server's health update reports the player is alive). `bot.respawn()` sends state 2 once per death (waiting for the server's state 0 if needed); the `respawn: false` option keeps the bot on the death screen. The lifecycle sends no loading screen ack for a `change_dimension` without loading_screen_id and completes a dimension change during a respawn without emitting an extra `spawn`: one `respawn` and one `spawn` per death, even across dimensions. The respawn packets on join and End exit do not count as deaths. For the position at `spawn` after respawning into another dimension, see [spawn search height](connection.md#spawn-search-height).

## Creative players cannot die  {#creative-death}

- **Affects:** `/kill` (or any damage) on a bot in creative mode; setting the game mode of a dead bot.
- **Java:** `/kill` kills a creative player.
- **Bedrock:** "Players cannot be killed while they are in Creative mode" (not even by `/damage` or the void), and you cannot set the game mode of a dead player ("No targets matched selector").
- **bedboo:** nothing to change in the library. Switch the bot to survival or adventure before killing it; a non-default game mode (e.g. adventure) survives the respawn.

## Dimension change, End credits  {#dimension-change}

- **Affects:** `bot.game.dimension`, `respawn` / `game` / `spawn` events on a dimension change, the End exit portal.
- **Java:** a `respawn` packet with another dimension (+ `game_state_change win_game` for the credits, skipped with `client_command`).
- **Bedrock:** `change_dimension` (the feet position for `/execute in … tp`; a junk position followed by a `move_player` reset for portals) → client `player_action dimension_change_ack` → server `dimension_change_ack` → client `serverbound_loading_screen` 1 / 2 with the loading_screen_id. When leaving the End through the exit portal, BDS first sends `show_credits {status: 0}` (only the first time a player leaves the End) and waits indefinitely for the client's `show_credits {status: 1}` before sending the `change_dimension` (`respawn: true`) to the overworld.
- **bedboo:** matches upstream: emits `game` then `respawn` (isAlive false) at the change, and `spawn` (isAlive true) when the new dimension loads; skips the credits immediately (`show_credits` status 1), like upstream's `client_command`. Portal travel works by standing in `portal` (Bedrock's name for a nether portal; a survival player needs ~4 s, a creative one ~1.5 s) and `end_portal` blocks. For details on how the world resets and which heights apply, see [dimensions](connection.md#dimensions).

## Waiting for a tick across a dimension change  {#dimension-change-ticks}

- **Affects:** code that walks into a portal with `await bot.waitForTicks(1)` in its loop.
- **Java:** physics ticks continue through a respawn into another dimension.
- **Bedrock:** bedboo pauses physics while the player changes dimensions (`change_dimension` → dimension change ack → `player_spawn`; the End exit also shows the credits).
- **bedboo:** `bot.waitForTicks(1)` waits through the change and rejects after 5 s ("Timeout waiting for 1 ticks"), even though the bot arrived. Code that walks into a portal should wait for the next tick or for the `game` (dimension switched), `spawn`, `respawn`, or `death` event—whichever comes first—and then await arrival on `spawn` in the new dimension (the bedboo agent's `util.tick(bot)` does this and never rejects).

## Experience points  {#experience-points}

- **Affects:** `bot.experience.points`.
- **Java:** the server sends the total experience.
- **Bedrock:** `update_attributes` `minecraft:player.level` and `minecraft:player.experience` (bar progress) only.
- **bedboo:** points = the XP needed for the level + progress × the XP for the next level (using the curve Bedrock shares
  with Java; `/xp 10` → level 1 + 3/9 → 10 points). Points spent on enchanting cannot be distinguished.

## Abilities  {#abilities}

- **Affects:** `bot.abilities`, `abilities` event.
- **Java:** an `abilities` packet with flag bits on join and on every game mode change.
- **Bedrock:** `update_abilities` with ability layers (base, spectator, commands, editor, loading screen: allowed /
  enabled sets, fly / walk speeds) on join and on permission changes. On `/gamemode`, the client derives the game
  mode's abilities itself; BDS sends `update_abilities` only when flight changes. BDS sends it twice in response to
  `request_ability` and after a game mode change that affects flight (flying → survival, or into / out of
  spectator), repeating values the bot already has (measured on BDS 1.26.51.1). In spectator mode, BDS's layers clear
  `mayFly` while `flying` stays on.
- **bedboo:** merges the layers (each layer sets the flags it allows, and later layers override earlier ones). On a game mode
  change, abilities follow the Java server's `GameType.updatePlayerAbilities` (creative: mayFly, instantBuild,
  invulnerable; spectator: + flying, no instantBuild; survival / adventure: none) and `abilities` is emitted once, as in
  Java. An `update_abilities` packet that changes nothing emits no `abilities` and keeps the existing `bot.abilities` object (the
  first one on join is always reported). `bot.abilities` is the single source of truth for flight state: the physics engine follows
  it without sending `request_ability` back ([flight](movement.md#flight)).

## Spawn point  {#spawn-point}

- **Affects:** `bot.spawnPoint`.
- **Java:** `spawn_position` = the world spawn (compass target), including its actual height.
- **Bedrock:** `start_game.spawn_position` (the world spawn; y = 32767 while the height is unfixed, as the server
  searches for the highest safe block when someone spawns there) and `set_spawn_position` with `spawn_type` set to `world`
  (`/setworldspawn`) or `player` (bed, respawn anchor, `/spawnpoint`; never sent by Java).
- **bedboo:** `bot.spawnPoint` = the world spawn (from start_game, then `world` updates + `game`); the player's personal respawn
  point does not change it. A height of 32767 is resolved once the spawn column loads:
  [spawn search height](connection.md#spawn-search-height).

## Beds, sleeping and spawnReset  {#beds}

- **Affects:** `bot.sleep`, `bot.wake`, `sleep` / `wake` events, `bot.isABed`, `bot.parseBedMetadata`, `spawnReset`.
- **Java:** 16 coloured bed blocks with facing / part / occupied states; sleep = use the bed; `entity_action
  leave_bed` wakes the player; the sleeping state is stored in the player's pose metadata;
  `game_state_change no_respawn_block_available`.
- **Bedrock:**
  - One `bed` block (the colour is in the block entity; plus `straw_bed`) with `direction` (0 south, 1 west, 2 north,
    3 east), `head_piece_bit`, and `occupied_bit`. The first item whose name ends in "bed" is `straw_bed`, not the bed.
  - Sleep = item use `click_block` on the bed. The server responds with `set_entity_data` (`player_flags` bit 1 +
    `player_bed_position` set to the head), moves the player into the bed with a `correct_player_move_prediction` (feet
    ~0.7 below the top of the bed, centred on the head block), and sets `occupied_bit` on the head; creative players can sleep
    too. `player_action stop_sleeping` wakes the player (`animate wake_up` + `player_flags` 0, with a position correction next to the
    bed). If nobody wakes the player, BDS ends the sleep itself after 100 ticks (when
    `doDaylightCycle` is on, the night is skipped and the clock jumps to morning).
  - Using `/setblock` to place a bed always places the whole bed: the given position becomes the head and the foot goes behind it
    (`head_piece_bit` is ignored; e.g. `/setblock <head> bed ["direction"=0]`); removing one half breaks the other.
  - Respawning when the bed or anchor is gone triggers the `tile.bed.notValid` or `tile.respawn_anchor.notValid`
    message, or no message at all if the fallback is the bed spawn's own position.
- **bedboo:** `isABed` matches `bed` and `*_bed`; `parseBedMetadata` returns upstream's shape from the Bedrock states;
  `spawnReset` is emitted on those messages. `sleep()` runs upstream's checks in the same order and with the same messages
  (time / thunderstorm, already sleeping, not a bed, occupied, half a bed, `canDigBlock` reach, click range, hostile
  mobs); `activateBlock` is awaited (since Bedrock's is asynchronous); throws 'bot is not sleeping' after 3 s. `wake()` sends
  `player_action stop_sleeping` and resolves immediately, matching upstream.

## A bed placed a moment ago is "half a bed"  {#bed-halves}

- **Affects:** `bot.sleep(bed)` right after `bot.placeBlock` placed the bed.
- **Java:** the server places both halves with one block change each; a client sees both before it can click.
- **Bedrock:** the foot and the head arrive as two separate `update_block`s (observed on BDS 1.26.51.1).
- **bedboo:** calling `bot.sleep()` as soon as the clicked cell holds a bed is refused with upstream's "there's only
  half bed" error (`bot.isABed` for the other half is still false), and works a tick later. Wait (≤ 20 ticks) until both
  cells are beds, and retry `sleep` after such a refusal. Sleeping then behaves as described in [beds](#beds).

## Fishing  {#fishing}

- **Affects:** `bot.fish()`.
- **Java:** cast / reel in with use_item; the bobber is a `fishing_bobber` spawn_entity; a bite shows as 6 `fishing` /
  `bubble` particles next to the bobber (world_particles), which upstream detects.
- **Bedrock:** cast / reel in is an item use (`click_air`) with the rod. The bobber is `add_entity minecraft:fishing_hook`,
  whose `owner_eid` metadata is the caster's unique ID. While waiting, the hook sends `entity_event fish_hook_tease`
  (fish nearby) and then `fish_hook_position` with `fish_x` / `fish_z` metadata (a fish swimming in, ~1–3 s); the bite
  is `entity_event fish_hook_hook` on the hook. Reeling in then drops the catch as an `add_item_entity` flying to the
  player (collected with `take_item_entity`) plus XP orbs, and removes the hook (`remove_entity`).
  - Measured waits (cast → `fish_hook_hook`, open water, `/enchant` levels): Lure 0 clear 6.3–32.3 s (mean 20.7,
    n=10); Lure 0 rain 6.0–20.9 s (12.1, n=8); Lure III clear 2.5–12.7 s (5.9, n=8); Lure III rain 1.9–12.2 s (5.7,
    n=14). The base window matches Java's 100–600 ticks (plus the fish swimming in), so `fishingBiteDelayMaxTicks: 600`
    ([feature table](data.md#feature-table)) holds; Lure lowers it by ~5 s per level, as in Java.
  - Bedrock's `/give` cannot carry enchantments, and `/enchant` caps Lure at III (`/give @s fishing_rod` +
    `/enchant @s lure 3`); BDS sends no confirmation of `/enchant` to a creative player.
- **bedboo:** upstream's task logic and messages are unchanged. The bobber is the first `fishing_hook` the bot owns
  after `fish()` (another player's bobber is ignored, whereas upstream takes any bobber), and the bite is `fish_hook_hook` on
  it. Like upstream, `fish()` has no time limit of its own.

## Books  {#books}

- **Affects:** `bot.writeBook`, `bot.signBook`.
- **Java:** `edit_book { slot, pages[], title? }` with the whole book, up to 100 pages; pages are NBT strings
  (`nbt.value.pages.value.value` = the page texts); the server echoes the edited slot.
- **Bedrock:**
  - The book must be *opened* first via an item use (`click_air`) of the held `writable_book` (a new book then comes back
    with an empty `pages` list); edits that reach the server in the same tick as the use are dropped.
  - Edits go page by page: `book_edit { inventory_slot: hotbar slot, type: replace_page | add_page | delete_page |
    swap_pages, page_number, text, photo_name }`; signing is `book_edit { type: sign, title, author, xuid }`. BDS
    sends nothing back for an edit; closing the book (`item_release`) makes it resend the book with a new stack ID.
  - Item NBT: `pages: [{ text, photoname }]` (read the texts as `pages.value.value.map(p => p.text.value)`, not as a
    list of strings); a written book adds `author`, `title`, `xuid` ('' offline), and `generation` 0. An 18-character
    title is accepted.
  - BDS keeps at most 50 pages and drops the rest.
- **bedboo:** keeps upstream's checks, messages, and slot handling (the book is moved to hotbar slot 0 and held, then the
  held slot and book slot are restored). The edit is a single session: open → `book_edit`s (only the pages that change, with extra
  pages deleted from the end) → (`sign`) → release, acknowledged when the resent book holds the requested pages (or is
  the written book). An unacknowledged session is retried once with a longer open delay (20 s in total, matching
  upstream's acknowledgement timeout). Calling `writeBook` with the book's existing pages sends nothing. More than 50 pages are
  refused immediately (`too many pages: a Bedrock book holds at most 50 pages`) before anything is moved; a failed edit
  still restores the held slot and puts the book back.
