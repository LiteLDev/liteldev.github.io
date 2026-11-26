# BeDD mode (transport: 'bedd')

What changes when bedboo drives a real Bedrock client hosted by Be.D.D. (`transport: 'bedd'`) instead of speaking the protocol itself. This applies only to the `bedd` transport; nothing here applies to `raknet` or `nethernet`. For setup, the authority table, and the coverage matrix, see the [BeDD guide](../../guide/bedd.md).

## The real client owns its serverbound packets  {#client-owned-packets}

- **Affects:** every API that sends a packet; `bot._client.queue` / `write`
- **Java:** mineflayer is the client and writes every packet itself.
- **Bedrock:** the BeDD-hosted client logs in, answers the loading screen, requests chunks, and sends `player_auth_input`, block actions, inventory transactions, and item stack requests itself every tick.
- **bedboo:** never forges those packets. A router translates what bedboo would have sent into BeDD control ops (`input`, `look`, `slot`, `button`, `action`, `send`, `stack`), and drops client-owned packets (see the [authority table](../../guide/bedd.md#authority-table)).

## `bot.entity` follows the client, 1-2 ticks behind  {#self-state-from-echo}

- **Affects:** `bot.entity.position` / `velocity` / `yaw` / `pitch` / `onGround`, `physicsTick`, `move`, `bot.physicsEnabled`, mineflayer-pathfinder
- **Java:** mineflayer's physics engine predicts the player every tick.
- **Bedrock (bedd):** the client's own physics moves the player, and the tap echoes each `player_auth_input` it sends.
- **bedboo:** the physics provider does not step; instead, it copies the echo (eye − 1.62) and emits `physicsTick` and `move` once per client tick. `look` and `lookAt` resolve when the echo is within 0.5° of the target. Walking, pathfinder goals, and `lookAt` all work, though pathfinder runs with 1-2 ticks of lag.

## Clicks go where the client's crosshair is  {#client-raycast}

- **Affects:** `dig`, `placeBlock`, `activateBlock`, `activateEntity`, `attack`
- **Java:** mineflayer specifies the target block, face, or entity in the packet.
- **Bedrock (bedd):** the client turns to the target and clicks, using its own raycast to determine what is hit.
- **bedboo:** looks at the target, waits for convergence, and sends `button`. It reads the result from `update_block` and entity events, so if a click lands on a neighboring block, bedboo sees what actually happened.

## Screen-level actions go through the client's screens  {#screen-actions}

- **Affects:** `bot.respawn` (and the `respawn` option), `bot.wake`, `bot.updateSign`, `bot.writeBook`, `bot.signBook`
- **Java:** packets that bedboo can send directly.
- **Bedrock (bedd):** screens in the real client: the death screen, bed screen, sign editor, and book screen.
- **bedboo:** uses BeDD's `ui` op to click Respawn and Leave Bed, and to type into the sign editor (opening it with a use click to edit whichever side the client faces) and press Done. Book pages are sent as book_edit (97, included in BeDD's default `sendAllow`) and the book screen is closed with ESC; `setCommandBlock` sends command_block_update (78, also allowed by default). After exiting the End, bedboo skips the credits screen with ESC, just as headless bedboo immediately answers show_credits. If the packet's ID is in `sendAllow` (56 for block_entity_data, 36 for player_action), `updateSign` and `wake` send the packet directly instead. Without either, they throw or reject with `BeddUnsupportedError` (`code: 'ERR_BEDD_UNSUPPORTED'`, `missing` e.g. `['send:56', 'ui']`); without `ui`, `bot.respawn()` only logs a warning and leaves the user to click Respawn. See [Screens](../../guide/bedd.md#screens) and [sendAllow](../../guide/bedd.md#send-allow).

## Packets nothing translates need `sendAllow`  {#send-allow}

- **Affects:** `bot._client.write` / `queue` for packets that bedboo does not translate (custom plugin packets, set_default_game_type, crafting_event, …)
- **Java:** mineflayer can write any packet.
- **Bedrock (bedd):** the real client sends its own packets, and BeDD's `send` forwards other packets only if their ID is in `sendAllow`.
- **bedboo:** sends the packet through `send` if its ID is listed in `bot.bedrock.bedd.sendAllow`; otherwise, it throws a `BeddUnsupportedError` naming the ID to add. Setting BeDD's `sendAllow: "*"` lists every ID that the client does not send itself, allowing all such packets through just like headless bedboo. block_pick_request is translated (look, then press the pick button). Client-owned packets are always dropped, regardless of the list.

## Inventory needs the `stack` op  {#inventory-stack}

- **Affects:** `clickWindow`, `moveSlotItem`, `transfer`, `deposit`, `withdraw`, `putAway`, `craft`, `equip` from the main inventory / armor / off-hand, `unequip`, `tossStack`, `creative.setInventorySlot`, anvil / enchanting / villager / smithing
- **Java:** window clicks.
- **Bedrock (bedd):** item stack requests must go through the client's ItemStackNetManager; otherwise, the client's request IDs and predicted inventory fall out of sync.
- **bedboo:** works when BeDD's `stack` op is enabled (`allowStack: true`), mapping bedboo's request IDs to the client's; without it, these methods reject with `ERR_BEDD_UNSUPPORTED`.

## Connection options belong to the client  {#ignored-options}

- **Affects:** `createBot` options `auth`, `username`, `host`, `port`, `viewDistance`, `skipPing`;
  `holdResourcePacks`; `bot.end`, `bot.quit`
- **Java:** mineflayer connects, authenticates, and disconnects.
- **Bedrock (bedd):** the client is already logged in with its own account and in a world.
- **bedboo:** `host` / `port` make the client join that server first (BeDD's `join` op; `ERR_BEDD_JOIN` when it cannot; a host off the PC must be in BeDD's `allowHosts`, or `allowHosts` must be `["*"]` for any host). `viewDistance` (and `setSettings`) sets the client's render distance (`settings`). `bot.quit` makes the client leave its world (`join host:null`) and detaches, whereas `bot.end` only detaches and leaves the client in its world. `auth` and `username` are ignored with one warning each because the client is signed in with its own account, and `holdResourcePacks` is a no-op. A world change on the client (`LINK_DOWN`) ends the bot. The bot connects to the game instead: `bedd: { url, token }`, `{ pid }`, `{ instance }`, or `{}` (the only running game) names a BeDD game (0.4.0 or newer) by its WebSocket endpoint, which is announced in BeDD's run files (`%LOCALAPPDATA%\BeDD\run\<pid>.json`); see [options](../../guide/bedd.md#options).
