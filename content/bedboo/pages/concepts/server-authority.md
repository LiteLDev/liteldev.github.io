# Server authority

On Java Edition, the client decides much of what happens to its player: where the player is, what a click does to the inventory, and when a block breaks. On Bedrock Dedicated Server, the **server** decides all three. BDS announces this in `start_game` (`server_authoritative_inventory`, `server_authoritative_block_breaking`), and movement is always server-authoritative. The client sends the player's inputs; the server simulates them and responds with the result.

mineflayer's API is built for the Java model, where the client acts first and then informs the server. bedboo preserves that API on the Bedrock model by predicting what the server will do, sending the player's actions in the format Bedrock expects, and treating the server's response as the source of truth. This page explains that model; see [Bedrock differences](../reference/differences/index.md) for the exact rules.

## One input per tick {#input}

From spawn onward, a Bedrock client sends one `player_auth_input` packet per server tick (every 50 ms). It carries the eye-level position, movement keys, rotation, flags such as sneaking and sprinting, and digging block actions.

bedboo's input queue (`bot._bedrock.input`) maintains that stream. Its clock is anchored to the server's tick from `start_game`. Each tick, the physics engine steps the player forward once and the queue sends the result, along with anything plugins queued for that tick. If the timer runs late, it sends the missed ticks, up to `maxCatchupTicks` (4) at once. Loading screens, death, and dimension changes suspend the stream ([input stream](../reference/differences/movement.md#input)).

For bot code, this means a change sent in the stream takes effect on the next input, not immediately. `look()` resolves once the input with the new rotation has been sent ([looking](../reference/differences/movement.md#look)), and a click right after `setControlState('sneak')` waits until the sneak input has been sent ([controls before clicks](../reference/differences/movement.md#controls-before-clicks)).

## Movement: predicted, then corrected {#movement}

BDS runs the same movement simulation as the client on every input it receives. If the client's reported position diverges too far from the server's result, BDS sends `correct_player_move_prediction` with its own state and the tick of the corrected input.

bedboo predicts every tick with its Bedrock movement engine, so in the normal case the server agrees and sends nothing. bedboo records the inputs it sends; on a correction, it rewinds to the corrected tick, adopts the server's state, replays the inputs sent since then, and emits `forcedMove`. Teleports, knockback, and effects that reference a tick are applied from that tick in the same way ([corrections](../reference/differences/movement.md#corrections)).

## Inventory: item stack requests {#inventory}

Bedrock has no click packet. Instead, the client asks the server to move items between named container slots with an `item_stack_request` (take, place, swap, drop, craft, …), and the server responds with an `item_stack_response`: either accepted, with the resulting counts, or rejected with an error code.

bedboo preserves mineflayer's Java-layout inventory and `clickWindow`. For each click, it calculates the result a Java click would produce, applies that result as a prediction, sends it as an item stack request, and waits for the response. An accepted request updates the counts and stack IDs; a rejected one is rolled back, and `clickWindow` throws mineflayer's standard error. Everything built on clicks (`equip`, `transfer`, `deposit`, `craft`, …) works the same way ([click window](../reference/differences/inventory.md#click-window)). Packets in which the server sends its own copy of the inventory always take precedence, and when bedboo detects an out-of-date slot, it requests the server's copy ([inventory resync](../reference/differences/inventory.md#inventory-resync), `bot.bedrock.resyncInventory()`).

## Digging and placing: the server's answer {#digging}

On BDS, the server breaks blocks itself. The client reports when the player starts breaking a block (`start_break`); from then on, BDS advances the break progress each tick using its own copy of the held item and the player's state, and destroys the block when the progress completes.

As a result, `bot.dig()` does not finish on a client-side timer as it does on Java. bedboo sends the start action, tracks the progress reported by the server, and resolves when the server's `update_block` confirms the block is gone. If the server shows no sign of breaking the block, the dig is aborted ([block breaking](../reference/differences/digging.md#protocol), [completion](../reference/differences/digging.md#completion)). Placements wait for a server response as well: each click carries the server's copy of the held item, so bedboo sends the next placement only after the previous one has been answered (or after 500 ms) ([placements](../reference/differences/digging.md#placement-serialization)).

## What it means for a bot {#for-bots}

- Wait for the promises. `dig`, `placeBlock`, `clickWindow`, `equip`, and the rest settle on the server's response, with the same results and errors as on Java.
- Expect the server to have the final say. If the server refuses a move, click, or dig, that action is undone to match the server's state.
- Timings follow the server's ticks: an action takes effect in the next input, and a dig takes as long as the server takes to break the block.

With `transport: 'bedd'`, the real client sends the inputs, requests, and block actions itself, and bedboo follows what it does instead of predicting it ([BeDD mode](../reference/differences/bedd.md)).
