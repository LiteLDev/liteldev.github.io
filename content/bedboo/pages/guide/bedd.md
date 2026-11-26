# Driving a real client (BeDD)

bedboo normally *is* the client: it logs in to Bedrock Dedicated Server over RakNet or NetherNet and sends every packet itself. With `transport: 'bedd'`, it instead drives a **real Minecraft Bedrock client** hosted by [Be.D.D.](https://levimc.org/BeDD/) (Bedrock Deep Dive, a testing toolkit for LeviLamina client mods). Your script runs against a real game, and you watch the local player walk, look, dig, place, and chat as instructed.

```js
const bedboo = require('bedboo')
const bot = bedboo.createBot({ transport: 'bedd', version: '1.26.60', bedd: {} }) // the only running BeDD game
bot.once('spawn', () => bot.chat('hello from bedboo'))
```

Switching modes only requires changing `transport`; direct BDS mode (`raknet`, `nethernet`) is unchanged. For an entry-by-entry comparison of the differences, see [BeDD mode](../reference/differences/bedd.md).

## Setup {#setup}

Requires Windows (BeDD runs the Windows client of Minecraft) and Node 24 or later. bedboo requires **BeDD 0.4.0 or newer**, which serves every game over a local WebSocket; BeDD 0.3 and older (using named pipes at `\\.\pipe\BeDD`) are no longer supported.

1. Install BeDD 0.4.0 or newer (see the [BeDD docs](https://levimc.org/BeDD/)) and start a game with it:

   ```sh
   BeDD.exe launch --slot 2
   ```

   BeDD runs each game in its own copy of your LeviLauncher instance (`%LOCALAPPDATA%\BeDD\instances\<base>-<slot>`) and announces it in `%LOCALAPPDATA%\BeDD\run\<pid>.json` (`$BEDD_HOME` moves that folder) while it listens:
   `{ "protocol": 2, "kind": "client", "pid", "url": "ws://127.0.0.1:<port>/v1", "token", "instance", "label", … }`.
   bedboo reads this file to connect; the token is the only credential.
2. Everything bedboo uses is **on by default** since BeDD 0.4.0 (the token is the security boundary). The relevant keys in the game's `mods\BeDD\config\config.json` are:

   | key | default | what it does | bedboo needs it for |
   |---|---|---|---|
   | `tap` | `true` | the tap: every clientbound packet, an echo of every serverbound packet, markers, a join journal | everything (without it bedboo cannot attach) |
   | `tapLoopback` | `true` | tapping singleplayer / LAN-host worlds (loopback link, re-serialized packets) | [singleplayer](#singleplayer) |
   | `tapJournalMiB` | `128` | size cap of the join journal replayed to a late attach | attaching mid-session (`complete:false` past the cap) |
   | `gameHooks` | `true` | the `world`, `look` and `input` ops (hooks in the game's own input pipeline) | precise movement and looking (without it: virtual keys and mouse) |
   | `allowSend` | `true` | the `send` op for the allowlisted packet ids (`sendAllow`, default `[9, 77, 78, 97]` = text, command_request, command_block_update, book_edit) | `bot.chat`, whispers, commands; any other packet whose id you add (see [sendAllow](#send-allow)) |
   | `allowStack` | `true` | the `stack` op: item_stack_request submitted through the client's own ItemStackNetManager | inventory: clickWindow, transfer, craft, deposit/withdraw, equip from the main inventory, creative |
   | `ui` | `true` | the `ui` op: the game's screens as a tree of nodes, clicked and typed into by ref | `respawn`, `wake`, `updateSign`, closing the book screen ([screens](#screens)) |
   | `wsPort` | `0` | the WebSocket port (0: any free port, read it from the run file) | `bedd.url` |
   | `wsMaxClients` | `8` | how many WebSocket connections may be open at once (bedboo uses two) | bedboo next to the BeDD manager and other harnesses |

   Setting a key to `false` turns that op off; bedboo then sees it as `disabled` and falls back (see the [coverage table](#coverage)). `pipeName` and `pipeInstances` were removed along with named pipes.

   `loopbackOnly` (BeDD's own key) restricts the client to servers on the same PC (127.0.0.1). Connecting to a remote server requires BeDD's Remote mode: `BeDD.exe mod config <instance> --world-mode Remote --server-host <host>` lets the client reach that specific host, while `--server-host '*'` (config `"allowHosts": ["*"]`) allows any host passed to `join` (`host` below) without a restart; any other remote hosts remain unreachable. The client joins BDS over NetherNet, so start the server with `transport=nethernet`. Because NetherNet joins go through Minecraft's online signalling service, no other Minecraft game on the PC may start while the client joins and plays (a later sign-in knocks the session out with "Multiplayer Connection Failed … NetherNet").
3. Put the player into a world (a server, a LAN world, or singleplayer), because bedboo attaches to an already-playing client rather than logging in itself. Alternatively, pass `host` (and `port`) to `createBot`: bedboo will then use BeDD's `join` op to make the client join that server first (leaving its current world and answering "Trust this server?") and attach once it is in the level.
4. Call `createBot({ transport: 'bedd', version: '1.26.60', bedd: {} })`, setting `version` to the game's protocol family (otherwise the tap's HELLO is refused; in this mode it defaults to `1.26.60`, the game version BeDD 0.4.0 runs). `bedd: {}` automatically selects the running BeDD game if there is only one; if several are running, specify which one to use (see [options](#options)). `spawn` fires once the join journal has been replayed, and from then on `bot.*` reflects the client's state.

The `bedd_follow.js` example makes the client follow the nearest other player:

```sh
node examples/bedd_follow.js                       # the only running BeDD game
node examples/bedd_follow.js --instance <instance>  # or --pid <pid>
```

## How it works {#how-it-works}

The real client stays authoritative for everything it sends: login, resource packs, the loading screen, chunk requests, `player_auth_input` every tick (physics included), block actions, inventory transactions, and item stack requests. bedboo never forges those packets. Its whole stack still runs, and what it *would* have sent becomes an **intent** for the client. Both directions go over the game's BeDD WebSocket (`ws://127.0.0.1:<port>/v1?token=…`) on two connections:

```text
script → mineflayer API → plugins → _client.queue → router ──(JSON text frames)───→ WebSocket 1 (control) → the game's input pipeline
bot.* state ← plugins ← decoder ← tap reader ←──(binary frames)──────── WebSocket 2 (tap subscribe) ← every packet the client gets / sends
```

- **State in:** the second connection sends `{ op: 'tap', action: 'subscribe' }` and then receives one binary message per tap frame: every clientbound packet the client receives, an echo of every serverbound packet it sends, and JSON markers (`HELLO`, `LINK_UP`/`LINK_DOWN`, `REPLAY_BEGIN`/`REPLAY_END`, `DROPPED`). bedboo decodes them with bedrock-protocol exactly as in direct mode, so `bot.entities`, the world, inventory, chat, and every event come from the real session. A **join journal** (since `start_game`, compacted to keep the latest chunk per position and the latest attributes per entity, with removed entities pruned) is replayed to every new subscriber, so bedboo can attach mid-session. The tap accepts one subscriber at a time (a second one gets `code: 'busy'`). If bedboo falls more than 32 MiB behind, BeDD sends `DROPPED` and closes the connection; the bot ends with `bedd_dropped`, and a new bot gets a full replay.
- **Self state:** `bot.entity` position, velocity, yaw, pitch, and onGround follow the echoed `player_auth_input` (eye − 1.62). `physicsTick` and `move` fire once per client tick; bedboo's own physics engine does not step.
- **Intents out:** a router diffs what bedboo would have sent and calls BeDD's control ops: `input` (move vector, jump, sneak, sprint, with a dead-man TTL), `look` (absolute yaw/pitch), `slot`, `button` (attack/use/pick, released on block change for digging), `action` (drop, inventory, …), `send` (allowlisted packet bytes: text/command_request, and any id you add to `sendAllow`), `stack` (item_stack_request through the client's ItemStackNetManager), `ui` (the client's screens: Respawn, Leave Bed, the sign editor), and `join` (createBot's `host`). Input is applied only while the game has the mouse and shows no menu. Requests are `{ id, op, … }` text frames, answered in order, one in flight.
- **Negotiation:** on attach, bedboo pings the control connection (BeDD 0.4.0 and newer answer `protocol: 2`, `defaultMode:
  'bedboo'` and `modes`, the ops of each operation mode) and probes each op with no arguments: `unknown op` (or not
  listed in `modes`) → absent, `code:'disabled'` → present but turned off in config.json, `ok` → present.
  `bot.bedrock.bedd.caps` holds the result, and `bot.bedrock.bedd.supports(name)` answers per mineflayer API.

## Authority table {#authority-table}

| class | packets | handling |
|---|---|---|
| clientOwned | login, client_to_server_handshake, request_network_settings, resource_pack_client_response, client_cache_status, client_cache_blob_status, subchunk_request, serverbound_loading_screen, set_local_player_as_initialized, network_stack_latency, tick_sync, player_skin, emote_list, respawn, player_action (dimension_change_ack / start_item_use_on / stop_item_use_on / respawn), animate, show_credits, interact mouse_over_entity | dropped by the router (the client sends its own); counted. The APIs behind them: `bot.swingArm` → `action swing`, `bot.respawn` → `ui` (Respawn), the credits → ESC on `credits_screen`, `bot.quit` → `join host:null` |
| translated | player_auth_input (move_vector and flags → `input`; yaw/pitch → `look`; block_actions start_break / abort_break / stop_break → `button attack`), mob_equipment (→ `slot`), inventory_transaction (item_use click_block / click_air, item_release, item_use_on_entity → `look` + `button`), interact open_inventory (→ `action inventory`), container_close (→ ESC), item_stack_request (→ `stack`), block_pick_request (→ `look` + `button pick`), interact leave_vehicle (→ a sneak tap), request_chunk_radius (→ `settings renderDistance`) | translated into control ops |
| screens | player_action stop_sleeping, block_entity_data (a sign) | `ui` (Leave Bed, the sign editor), or `send` as is when the id is in `sendAllow` |
| shared | text, command_request | sent as bytes through `send` (the command uuid is kept, so `command_output` correlates); fallback: T / SLASH key, `text`, ENTER |
| allowlisted | book_edit, command_block_update | sent as bytes through `send` (in BeDD's default `sendAllow`) |
| unsupported | crafting_event, set_default_game_type, everything else | sent as bytes through `send` when its id is in BeDD's `sendAllow` ([below](#send-allow)); otherwise `BeddUnsupportedError` (`code: 'ERR_BEDD_UNSUPPORTED'`), whose message names the id to add |

The bot's own `respawn` / `player_action respawn` packets stay client-owned: `bot.respawn()` clicks the death screen's Respawn button instead, and the client sends them itself.

## Coverage {#coverage}

"Caps" lists the BeDD ops the API needs. Without them, `bot.bedrock.bedd.supports(name)` is false and the call throws or rejects with `ERR_BEDD_UNSUPPORTED` (or uses the stated fallback).

| API | works | caps (fallback) |
|---|---|---|
| spawn, login, game events, `bot.game`, time, weather, health, food, experience | yes, from the tap | `tap` |
| `bot.entities`, `bot.players`, blocks and world (`blockAt`, `findBlocks`, raytrace, `waitForChunksToLoad`) | yes, from the tap | `tap` |
| chat / message / messagestr events, title, bossbar, scoreboard, tablist, sound, particle, explosion | yes, from the tap | `tap` |
| `bot.inventory`, `heldItem` (reads) | yes | `tap` |
| `bot.entity` position / velocity / yaw / pitch / onGround | yes, from the echoed player_auth_input (1-2 ticks behind) | `tap` |
| `setControlState`, `getControlState`, `clearControlStates` | yes | `input` (virtual W/A/S/D/SPACE/SHIFT/CTRL keys) |
| mineflayer-pathfinder, collectblock, pvp | yes, through controls, look and attack | `input`, `look` |
| `look`, `lookAt` | yes; resolves when the echo converges (< 0.5°) | `look` (closed-loop `raw` mouse) |
| `setQuickBarSlot`, `equip` of a hotbar item | yes | `slot` (keys 1-9) |
| `chat`, `whisper`, commands | yes, uuid preserved | `send` (T/SLASH + `text` + ENTER, uuid lost) |
| `dig`, `stopDigging` | yes; crack animation on the client, completes on update_block → air | `look`, `button` (`mouse`) |
| `placeBlock`, `activateBlock`, `activateItem`, `deactivateItem`, `consume`, bows | yes (look, then use) | `look`, `button` |
| `attack`, `activateEntity`, `mount`, `dismount` | yes | `look`, `button`, `input` |
| `toss` of the held item | yes | `action` (drop / dropAll) |
| `openContainer`, `openChest`, `openFurnace`, `closeWindow` | yes (close = ESC) | `look`, `button` |
| `clickWindow`, `moveSlotItem`, `transfer`, `deposit`, `withdraw`, `putAway`, `craft`, `equip` from the main inventory / armor / off-hand, `unequip`, `tossStack`, `creative.setInventorySlot`, anvil / enchanting / villager / smithing | yes, through the client's ItemStackNetManager | `stack` (none: `ERR_BEDD_UNSUPPORTED`) |
| `respawn` (and the `respawn` option) | yes: clicks the death screen's Respawn button | `ui` (none: a no-op with a warning) |
| `sleep`, `wake` | yes: sleep is a use click on the bed, wake clicks the bed screen's Leave Bed | `look`, `button`; wake: `ui` or `send` with 36 in `sendAllow` |
| `updateSign` | yes: types into the client's sign editor (opened with a use click if not already showing) and presses Done | `ui` or `send` with 56 in `sendAllow` |
| `writeBook`, `signBook` | yes: opens the book with a use click, sends its pages as book_edit, and closes the book screen with ESC | `button`, and `send` with 97 in `sendAllow` (BeDD's default) |
| `setCommandBlock` | yes, as command_block_update | `send` with 78 in `sendAllow` (BeDD's default) |
| `swingArm` | yes (`'left'` swings the off hand on this client; animate carries no hand on the wire) | `action` with `swing` (none: a no-op with a warning) |
| `setSettings({ viewDistance })`, the `viewDistance` option | yes: the client's render distance (the server may grant more) | `settings` (none: ignored with a warning) |
| credits after the End exit | skipped, as headless bedboo does: ESC while `credits_screen` shows | `world`, `key` |
| inventory resync (`inventory_mismatch`) | a no-op: the client owns its inventory | — |
| `block_pick_request` (a plugin's own `_client.write`) | yes: looks at the block and presses pick | `look`, `button` |
| any other `_client.write` / `queue` from a plugin | yes, when its packet id is in `sendAllow`, or any non-client-owned id with `sendAllow: "*"` | `send` |
| `host`, `port` options | the client joins that server first (off the PC: BeDD's `allowHosts` names it, or `"*"`) | `join` |
| `bot.quit` | the client leaves its world (to the title screen), then the bot detaches | `join` (none: detach only, with a warning) |
| `bot.end` | detach only; the client stays in its world | — |
| `auth`, `username` options | ignored with a warning (the client is signed in with its own account) | — |

Notes: `activateItem(true)` (off-hand) uses the main hand because Bedrock has no use input for the off hand (it acts only passively: a shield raises while sneaking, totems, maps); `activateItem` for an item that is not used by holding (throwables, a fishing rod) is a single click; without `ui`, `bot.respawn()` is a no-op with a warning (so `respawn: true` never throws from the health listener); the sign editor edits whichever side the client faces, so `updateSign(block, text, true)` (the back) warns when the editor shows the front; `bot.craft` keeps upstream's `new Error(err)` wrapping, so check `err.message` there when the surface did not refuse it first.

Degraded: pathfinder sees 1-2 ticks of lag (prediction is overwritten by the echo); the client's own raycast decides what a click hits, so an action can land on an adjacent block or entity (bedboo sees it on `update_block` / entity events); flight via a double-tap jump; input pauses while a screen is open; a late attach depends on the journal (`complete:false` → chunks missing until re-entered); a world change on the client ends the bot (`LINK_DOWN`).

## Screens {#screens}

BeDD's `ui` op reads the game's JSON UI screens as a tree of nodes (`role`, `name`, `text`, `state`) with refs, and clicks or types into a node by its ref. `lib/bedd/screens.js` uses it for actions the client only performs when the user interacts with a screen:

| API | node |
|---|---|
| `bot.respawn()` (the `respawn` option calls it on death) | a button whose name or text says "respawn" (`respawn_button` on the death screen) |
| `bot.wake()` | a button saying "wake", "leave bed", or "stop sleeping" (`wake_up_button` "Leave Bed" on the bed screen) |
| `bot.updateSign(block, text)` | the text box on the sign screen, then its Done button (or ESC otherwise) |
| `bot.writeBook` / `signBook` | ESC on the book screen when bedboo releases the book |

Each action re-reads the tree until the node appears (up to 10 s), and again after `stale_snapshot`, `stale_ref`, or `occluded`. The same helpers can drive any other screen: `bot.bedrock.bedd.screens.click(node => node.role === 'button' &&
/play/i.test(node.text ?? ''))`, `screens.setText(matcher, text)`, `screens.read()` for the raw snapshot.

## sendAllow {#send-allow}

`send` only sends the packet IDs listed in the game's `sendAllow` (config.json; default `[9, 77, 78, 97]` since BeDD's parity ops, `[9, 77]` before). IDs 1, 30, 144, and 147 (login, inventory_transaction, player_auth_input, item_stack_request) are always refused. bedboo reads the list from the `send` probe (`bot.bedrock.bedd.sendAllow`), and any outbound packet that no op translates is sent as-is if its ID is listed. The relevant IDs are (add the others for a server you control):

| id | packet | what then works |
|---|---|---|
| 97 | book_edit | `bot.writeBook`, `bot.signBook` (default) |
| 78 | command_block_update | `bot.setCommandBlock` (default) |
| 56 | block_entity_data | `bot.updateSign` via the packet (any side, no editor) instead of through the sign editor |
| 36 | player_action | `bot.wake` via the packet instead of the Leave Bed button (plus any player_action a plugin sends) |
| 105 | set_default_game_type | a plugin's own `_client.write('set_default_game_type', …)` |

Client-owned packets (the authority table) are still dropped regardless of `sendAllow`.

Setting `"sendAllow": "*"` (`BeDD.exe mod config <instance> --set sendAllow=*`) lets `send` accept every ID except packets the client sends itself (login, handshakes, player_auth_input, inventory_transaction, item_stack_request, chunk and cache requests, loading screens, respawn, animate, …), since headless bedboo can write any packet. The probe then lists every allowed ID in `allow` (making `bot.bedrock.bedd.sendAllow` the full list) and sets `allowAll: true`. Packets the client did not generate itself can leave it out of sync with the server; use this only on servers you control.

## Singleplayer and LAN worlds {#singleplayer}

With `tapLoopback` (enabled by default when `tap` is), BeDD also taps worlds the client hosts itself: singleplayer or LAN worlds. Because those packets never hit the network, BeDD re-serializes them (frame flag `reserialized`) and filters them to the local player so LAN guests' traffic is not mixed in. Everything in the [coverage table](#coverage) works the same, and the HELLO marker reports `link.type: 'local'`.

## Security {#security}

- **The token is the boundary.** BeDD listens on 127.0.0.1 only and refuses connections without the game's token
  (HTTP 401) or with an `Origin` header (403, preventing web pages from reaching it). The token is stored in the run file under
  `%LOCALAPPDATA%`, so anything running as your Windows user can read it and drive the game. bedboo passes it as
  `?token=` and never sends `Origin`.
- **The tap exposes the session.** A subscriber can read everything the logged-in player sees and does: chat, positions,
  inventory, and the world.
- **`send`, `stack` and `ui` act as the account.** `send` posts chat and commands as the logged-in player (along with any
  packet added to `sendAllow`), `stack` moves their items, and `ui` clicks their screens. `send` is restricted to the
  `sendAllow` IDs (default `[9, 77, 78, 97]`; `"*"` allows every ID the client does not send itself), while login,
  `player_auth_input`, item stack, and similar IDs (1, 30, 144, 147) are always refused. Set `allowSend` / `allowStack` / `ui` to `false` in instances where they should be disabled.
- Run BeDD games for automation in their own instances (as `BeDD.exe launch --slot <n>` does), not in your main
  account's world.

## Options and `bot.bedrock.bedd` {#options}

`createBot({ transport: 'bedd', version, bedd })`, where `bedd` is one of:

| `bedd` | connects to |
|---|---|
| `{}` | the only running BeDD game client (if several are running, an error lists them) |
| `{ pid }` | the BeDD game with that process ID |
| `{ instance }` | the BeDD game from that instance folder (for example, `'1.26.60.05-2'`, the run file's `instance`) |
| `{ url, token }` | that exact endpoint (for example, read from a run file yourself) |

Plus, in any form:

| option | |
|---|---|
| `bedd.home` | BeDD's home folder for the lookup (defaults to `$BEDD_HOME`, or `%LOCALAPPDATA%\BeDD`) |
| `bedd.timeoutMs` | control request and connection timeout (default 5000 ms; an op's own `timeoutMs` gets 2 s more) |
| `bedd.modules` | the `lib/bedd` modules to attach (default, in this order: `authority`, `router`, `router_actions`, `follower`, `surface`, `inventory`, `screens`) |
| `bedd.joinTimeoutMs` | how long `host` may take to join (default 60000 ms) |
| `bedd.WebSocket` | the WebSocket class (defaults to Node's global `WebSocket`) |

The createBot options `host` / `port` (`port` defaults to 19132) make the client join that server before bedboo attaches (using BeDD's `join` op with `wait`). A client already playing on that server is left alone. Without the `join` op, or if the client gives up (`join_failed`, or `not_allowed` for a remote host blocked by `loopbackOnly` because it is not in BeDD's `allowHosts`, or because it fails to resolve when `allowHosts: ["*"]`), the bot emits `'error'` with `code: 'ERR_BEDD_JOIN'` (`reason`: BeDD's code) and ends. `bot._client.bedd.joined` holds the reply.

Run files from exited processes (such as a crashed game) are skipped. If no game matches, the bot emits `'error'` (`code: 'ERR_BEDD_DISCOVERY'`) and ends. Passing `bedd.pipe`, `bedd.tapPipe`, or `bedd.connect` (from BeDD 0.3 and older) throws an error naming these options; if a BeDD 0.3 or older instance answers anyway, it is rejected with `ERR_BEDD_PROTOCOL` ("BeDD v1 uses named pipes; upgrade BeDD").

- `bot._bedrock.mode === 'bedd'`.
- `bot.bedrock.bedd.url` / `endpoint`: the active WebSocket URL (without its token), plus the game's `pid`, `instance`, and `label` when loaded from a run file.
- `bot.bedrock.bedd.control`: `ping`'s `protocol` (2), `pid`, `defaultMode`, and `modes` (`{ bedboo: [...], input: [...], ui: [...] }`).
- `bot.bedrock.bedd.caps`: `{ [op]: 'present' | 'disabled' | 'absent' }` for `tap`, `world`, `look`, `input`, `slot`, `button`, `action`, `send`, `stack`, `join`, `ui`, and `settings` (probed; `ui` uses a one-node read), along with the other ops listed in `ping.modes` (`key`, `text`, `mouse`, `raw`, `screenshot`, …). Without a control connection, every op is `absent` and the bot only observes.
- `bot.bedrock.bedd.sendAllow`: the packet IDs that `send` accepts (the probe's `allow`), or `null` without `send`.
- `bot.bedrock.bedd.screens`: the [screen helpers](#screens) (`read`, `find`, `click`, `setText`, `respawn`, `wake`, `editSign`, `idle`).
- `bot.bedrock.bedd.supports(name)`: whether a mineflayer API (`'dig'`, `'craft'`, `'creative.setInventorySlot'`) or a BeDD op works with the current capabilities.
- `bot.bedrock.bedd.observed`: `{ yaw, pitch, tick }` from the last echoed `player_auth_input`, or `null` before the first one.
- Errors: `BeddUnsupportedError` (`code: 'ERR_BEDD_UNSUPPORTED'`, `bedd: true`, `feature`, `missing`; `'send:97'` in `missing` means `send` with packet ID 97 in `sendAllow`). An unsupported packet also makes `bot` emit `'bedd_unsupported_packet'` with `{ name, feature }` once per packet name. Connection errors emitted on the bot's `'error'` event: `ERR_BEDD_DISCOVERY`, `ERR_BEDD_CONNECT` (refused, wrong token, or process gone), `busy` (another client holds the tap), `disabled` (`tap: false`), `ERR_BEDD_PROTOCOL` / `ERR_BEDD_HELLO` (mismatched BeDD or game version), and `ERR_BEDD_JOIN` (could not join `host`).
- Client events besides the standard ones: `'serverbound'` with `{ name, params, reserialized }` (packets sent by the client), `'bedd_marker'` (tap markers), and `'warning'` (a packet failed to decode; the stream continues).

## Roadmap {#roadmap}

- A drive / puppet mode (to suppress, inject, and pin the pose), once pose pinning is proven to survive client reconciliation.
- Following the client across world changes (`LINK_DOWN` → `LINK_UP`) instead of ending the bot.
- A second split-screen subclient.
