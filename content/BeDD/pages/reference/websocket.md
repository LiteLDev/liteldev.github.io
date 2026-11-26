# WebSocket API

Contract: [bedd.asyncapi.yaml](https://levimc.org/BeDD/bedd.asyncapi.yaml) (`spec/`, AsyncAPI 3.0; [Studio](https://studio.asyncapi.com/?url=https://levimc.org/BeDD/bedd.asyncapi.yaml)).

## Connecting

The discovery file `%LOCALAPPDATA%\BeDD\run\<pid>.json` (root `BEDD_HOME`) is present while the server is listening; skip dead PIDs. `BeDD.exe ps --json` lists the same information.

```json
{"protocol": 2, "kind": "client", "pid": 23116, "url": "ws://127.0.0.1:53021/v1", "token": "9c1f…(64 hex)",
 "instance": "1.26.60.05-2", "instanceDir": "…\\instances\\1.26.60.05-2", "label": "smoke test", "modVersion": "0.4.0", "startedAt": "2026-11-13T09:41:07Z"}
```

| Item | |
|---|---|
| `kind` | `client` (game) or `server` ([server build](#server-target)) |
| Port | config `wsPort` (default 0: picks a free port on each start); read it from the file |
| Token | 32 random bytes, generated on each start. Pass `Authorization: Bearer <token>` or `?token=<token>`; if wrong or missing, returns HTTP 401 |
| Origin | a handshake with an `Origin` header returns HTTP 403 unless the origin is in config `allowOrigins` (empty by default, so browsers cannot connect) |
| Limits | `127.0.0.1` only; `wsMaxClients` connections (8); UTF-8 JSON text messages ≤ 16 MiB; no compression |

Node.js 24 (its built-in `WebSocket` does not support custom headers):

```js
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = join(process.env.BEDD_HOME ?? join(process.env.LOCALAPPDATA, 'BeDD'), 'run');
const game = readdirSync(dir).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
  .find((e) => e.kind === 'client'); // and its pid alive
const ws = new WebSocket(`${game.url}?token=${game.token}`);
ws.onopen = () => ws.send(JSON.stringify({ id: 1, op: 'world' }));
ws.onmessage = (e) => { console.log(JSON.parse(e.data)); ws.close(); };
```

## Requests and replies

```json
{"id": 7, "op": "look", "yaw": 90, "pitch": 0}
{"id": 7, "ok": true, "yaw": 90, "pitch": 0, "tick": 5182, "turns": 1}
```

- `id`: any JSON value, echoed in the reply. Failure: `{id, ok:false, error, code?, key?}`; match on `code` ([Errors](#errors)).
- Requests on a single connection are served in order; open multiple connections for parallel requests.
- Probe: calling an op without arguments (read-only for bedboo ops) returns `unknown op` if absent, `disabled` if off, or `ok` if present.

## Choosing a mode

Prefer bedboo ops first, then `ui`, then input ops ([why](/guide/operation-modes)). `ping` lists what is available:

```json
{"ok": true, "protocol": 2, "pid": 23116, "kind": "client", "defaultMode": "bedboo",
 "modes": {"bedboo": ["world","look","input","slot","action","button","settings","send","stack","timescale","join","tap"],
           "ui": ["ui","oreui"], "input": ["key","text","mouse","raw","release","flush","focus","window","screenshot"]},
 "hwnd": 4589122, "managed": true, "client": {"w": 1280, "h": 720}, "cursor": {"x": 640, "y": 360}, "realForeground": false}
```

## bedboo ops

Setting the config key to `false` returns `disabled`.

| op | key | probe reply | action fields (default) |
|---|---|---|---|
| `world` | `gameHooks` | `inLevel`, `levelEpoch` (+1 per world), `topScreen`, `mouseGrabbed`, `showingMenu`, `inputMode` mouse\|touch\|gamepad\|undefined, `player{runtimeId, eye{x,y,z}, rot{yaw,pitch}, slot}` (null: no world), `tick` | none |
| `look` | `gameHooks` | `inLevel, yaw, pitch, tick` | `yaw`, `pitch`, `timeoutMs` (1000\*, ≤60000) |
| `input` | `gameHooks` | `active`, `via` hooks\|keys, `hooks{raw,state}`, `tick`, `applied`, `ticksLeft` | `move{x,z}`, `jump`, `sneak`, `sprint`, `ttlMs` (300) or `ttlTicks` |
| `slot` | `gameHooks` | `slot` (null: no world) | `slot` 0..8, `timeoutMs` (1000\*) |
| `action` | `gameHooks` | `names` | `name` drop\|dropAll\|inventory\|perspective\|pause\|swing; `hand` main\|off (swing); `timeoutMs` (1000\*) |
| `button` | `gameHooks` | `held` | `button` attack\|use\|pick; `action` down\|up\|click (click); `holdTicks` (click: 2); `releaseOn` blockChange; `timeoutMs` (1000\*) |
| `settings` | `gameHooks` | `renderDistance` (chunks; null before the first world), `inLevel` | `renderDistance` (chunks, 1..255) |
| `send` | `allowSend` | `allow` (`sendAllow` ids; `"*"` spelled out), `allowAll` | `buf`, `timeoutMs` (2000\*, ≤10000) |
| `stack` | `allowStack` | `enabled, via:"raw", stats{sent, answered, rejected, failed, resyncs}` | `buf`, `timeoutMs` (2000\*); or `view:true` |
| `tap` | `tap` | `enabled`, `attached`, `link{state up\|down, type remote\|local, address}`, `journal{frames, bytes, complete}`, `lastReplay`, `replay`, `counters{in, out, dropped, sent, readers}`, `hooks` | `action:"subscribe"` → [tap stream](/reference/tap) |
| `timescale` | none | [below](#timescale-game-speed) | `scale`, `paused`, `timeoutMs` (2000) |
| `join` | none | `mode`, `connection` none\|local\|remote, `host`, `port`, `inLevel`, `joining`, `last`, `allowHosts` (reachable off the PC; `"*"` without `loopbackOnly`), `anyHost` | `host` (null: leave the world), `port` (19132), `wait`, `timeoutMs` (60000) |

\* At ≥20 ticks/s; when running slower, defaults scale by tick interval / 50 ms (up to the maximum). `not_in_level`: no client tick within 20 tick intervals (≥1 s).

| op | Behaviour | Errors |
|---|---|---|
| `look` | absolute; replies `yaw, pitch, tick, turns` once both are within 0.5°. Yaw 0 = +Z, 90 = -X; pitch -90 = up, clamped to ±89.9 | `not_in_level`, `timeout` (with current yaw/pitch), `busy` (newer `look`), `bad_args` |
| `input` | `move`: `x` = left-right, `z` = forward-back, clamped to [-1,1], diagonal normalized. Ends `ttlMs` (≤60000, longer values capped) after the request (refresh to keep moving), or on `ttlMs:0` or `release`. `ttlTicks` (≤1200) counts client ticks and also ends after 5 s without ticks. Outlives its connection. `via:"hooks"`: applies only when the mouse is grabbed and no screen is open; `applied` = ticks written. `via:"keys"` (when hook is missing): W/A/S/D, SPACE, LSHIFT, LCTRL held like `key` (reaches screens, breaks if rebound) | `bad_args` (`ttlTicks` with `ttlMs`), `not_in_level` (`ttlTicks`, not ticking) |
| `slot`, `action`, `button` | answered after the next client tick applies them (`tick`). A paused singleplayer world does not tick: resume with `key` ESC | `not_in_level`, `busy` (screen open; `button up` still works), `timeout`, `bad_args`, `refused` |
| `slot` | hotbar key 1..9; replies once held (`slot`, `via` keys\|none) | |
| `action` | key released on the next tick: drop Q, dropAll Ctrl+Q, inventory E, pause Escape (default keymap); perspective: game call. `swing`: arm swing with no attack, the client sends animate; works with a screen open; `hand:"off"` shows on this client only. Replies `name`, `hand` | |
| `button` | virtual GameInput left/right/middle; released after `holdTicks`, or (`releaseOn:"blockChange"`) when the block targeted on `down` changes, turns to air, or is no longer targeted. `up` releases at once. Never blocks. Replies `held`, `block{x,y,z}`. On disconnect, only an endless `down` is released; others finish, and `releaseOn` runs for at most 1200 more ticks | `refused`: no block targeted |
| `settings` | `renderDistance` sets the Render Distance of every renderer (normal, Vibrant Visuals, ray tracing; not saved to options.txt) on the next client tick, then the client sends request_chunk_radius, and the server's grant arrives as chunk_radius_update (tap). Replies `renderDistance` (rendered now), `requested`, `tick` | `not_in_level`, `timeout`, `bad_args`, `unavailable` |
| `send` | `buf`: base64 serverbound packet (varint header + body, bedrock-protocol), sent by the local player; replies `packetId, name`. Stats: `state.stats.send{sent, refused, failed, lastError}` | `bad_args` (unreadable, not sent), `refused` (not in `sendAllow`) |
| `join` | from the title screen or a world (leaves first: `left`); answers "Online play is not rated" (Proceed) and "Trust this server?" (Trust and Join). `started:true` once connecting; `wait:true` → `joined:true`. Off-PC hosts require `allowHosts` (Remote mode); with `allowHosts` `"*"`, the host is resolved and added (`not_allowed` if it does not resolve). `host: null` leaves the world (Save & Quit / Disconnect): `left:true` (`wait`: once saved and back in the menus; otherwise `started:true`), or `left:false` if not in a world | `join_failed`, `timeout` (`screen`), `busy`, `not_allowed`, `stopped`, `no_client`, `unavailable`, `bad_args` |

### `stack`: item stack requests through the client

| Form | Reply |
|---|---|
| `{op:"stack", buf}` | `{via:"raw", requestIds, map:{"<caller id>": client id}}` once sent |
| `{op:"stack", view:true}` | `{inventory, ui, open?:{containerId, type, items}}`, entries `{slot, item, count, stackId}` |

- `buf`: one item_stack_request packet (id 147); other ids or unreadable bytes return `bad_args`.
- Each request gets a client id: odd, negative, counting down from `-0x40000001`. Stack ids that reference caller ids are renamed (both in this request and across the last 256 earlier requests). `map` keys are caller ids as strings.
- The item_stack_response (tap) may arrive before the reply: buffer it.
- No client prediction. If the request is accepted, the client sends `inventory_transaction {type: inventory_mismatch}` and the server resends the inventory. If rejected, nothing changes.
- The required screen (inventory, chest) must be open: use `action inventory`, `key E`, or interact with the block.

### `timescale`: game speed

Controls the speed of a world hosted by this game (singleplayer or LAN host), adjusting the client and local server together. A request (`scale`, `paused`) replies with the probe once both sides run at the target speed; the probe also includes `local` and `inLevel`.

| Field | |
|---|---|
| `scale` | 0.05..20, clamped (1 = 20 ticks/s) |
| `paused` | stops/resumes both sides, like the pause menu |
| `source` | `default`, `config` (`timeScale`, on entering a world), `local` (this API), `server` (a BeDD server) |
| `tps{client, server}` | ticks/s over the last 2 s; 0 when paused; `server` is null on a remote server. Measured locally: 0.05→1, 0.5→10, 2→40, 3→60, 5→100, 10→200, 20→400 |
| `ticksPerSecond` | client timer base rate (20) |
| `effective{client, server}` | `{scale, paused, ticksPerSecond}` last applied per side (null before) |

Leaving a world resets the scale to 1; entering a world applies `timeScale` (1). Errors: `not_in_level`, `remote` (not hosted here), `server_led` (set by a BeDD server; change it there), `timeout` (still applies later), `refused`, `bad_args`. A BeDD server sends level_event 3007 (SimTimeScale, pos 0,0,0, `data` = float bits as int32, 0 = paused) on change and on join; the client follows (0 pauses while keeping the scale).

### Who sends what (bedboo transport `bedd`)

The client sends every serverbound packet. bedboo's `lib/bedd/authority.js` drops client-owned packets, maps others to ops (`input`, `look`, `slot`, `button`, `action`, `settings`, `stack`, `join`, key ESC), sends text and command_request with `send` (fallback T/SLASH, `text`, ENTER), handles Leave Bed and the sign editor through `ui`, sends other `sendAllow` IDs as-is with `send`, and throws ERR_BEDD_UNSUPPORTED (BeddUnsupportedError) for the rest.

## ui ops

`ui` reads the screens as text with refs and acts on a ref; `oreui` returns the raw Ore UI DOM; `mouse` takes a `ref`. The config key `ui` covers all three. For fields, replies, and errors, see [UI tree](/reference/ui).

## input ops

No config key. Replies after the game thread dispatches the input (`timeoutMs` 5000).

| op | fields (default) | |
|---|---|---|
| `key` | `key` or `vk` (1..254); `action` press\|down\|up (press); `holdMs` (60) | letters, digits, ESC, ENTER, BACK, TAB, SPACE, SHIFT, CTRL, ALT, LEFT/UP/RIGHT/DOWN, HOME, END, PGUP, PGDN, INSERT, DELETE, F1..F24, SLASH, GRAVE, MINUS, EQUALS |
| `text` | `text`, `delayMs` (0) | one `WM_CHAR` per UTF-16 unit |
| `mouse` | `action` move\|down\|up\|click\|wheel (move); `x`,`y` (client px) or `rx`,`ry` (fractions) or [`ref`](/reference/ui#mouse-on-a-ref); `button` left\|right\|middle (left); `notches` (1); `holdMs` (80, ≥50); `settleMs` (50, hover first); `afterMs` (50) | moves the virtual cursor, then sends GameInput buttons/wheel |
| `raw` | as `mouse`, with `dx`,`dy` (counts), `steps` (1, spread over frames) | moves the camera while the mouse is grabbed |
| `release` | | releases all held keys/buttons (from any source) and the `input` override |
| `focus` | | re-sends "focus gained" |
| `window` | `clientWidth`, `clientHeight` | resizes; replies with `result` + window fields; never activates |
| `flush` | | waits until all posted input is dispatched |
| `screenshot` | `format` png\|jpeg, `quality`, `maxWidth` (960), `region{x,y,w,h}` | `{width, height, format, data}` (base64) |

## System ops

| op | reply |
|---|---|
| `ping` | [example](#choosing-a-mode); `hwnd` is 0 before the window exists, `managed` = manager attached, `audio` = sound on, `grabbed` = the game holds the mouse |
| `state` | window fields, `stats{synthetic, swallowedInput, swallowedFocus, passed, realForegroundSeen, api, gameInput, loopbackRebinds, serverQueriesRefused, audio, tapLoopback, send, journal, sendsRefused}`, `clients`, `held[{vk, client}]`, `hooks{name: installed}`, `mode` ClientOnly\|ClientServer\|Remote, `connection{connection none\|local\|remote, inLevel, host, port}` |
| `manager` | `action:"attach"`: makes this connection the manager; keeps the window off-screen and out of the taskbar and Alt+Tab. Config `manager` (true): the game closes if no manager attaches within 30 s of window creation or if the attached manager drops; `false`: hidden, never self-closes. Label: env `BEDD_LABEL`. Reply includes `audio`. Attached manager only: `action:"audio"`, `on` true\|false (toggles the game's sound on this PC; turns off again when the manager drops); `action:"input"`, `events[]` of `{t:"key", vk, down}`, `{t:"char", c}`, `{t:"move", x, y}`, `{t:"raw", dx, dy}`, `{t:"button", button, down}` (left\|right\|middle\|x1\|x2), `{t:"wheel", notches}`, `{t:"release"}`: forwards user input while controlling the game in the manager window without waiting; replies `{grabbed, audio}` |
| `close` | `{ok}`, then the game closes |

## Errors

| code | meaning |
|---|---|
| `disabled` | config key `false` (`key`), or unloading |
| `not_in_level` | not in a world (server: not started) |
| `refused` | the game refused (id not in `sendAllow`, no block for `releaseOn`) |
| `timeout` | not completed within `timeoutMs` (may still finish) |
| `bad_args` | invalid field values or unreadable bytes |
| `bad_request` | the op cannot act on the request: binary message; unknown `tap`/`manager` action or no connection; `ui` action without `ref`, unknown `action`, or `setText` without `text` |
| `internal` | the reply from a `ui` action's sub-op was unreadable (a bug) |
| `busy` | screen open, newer `look`, join in progress, or tap taken |
| `stopped` | unloading |
| `join_failed` | join gave up (the client shows why) |
| `not_allowed` | off-PC host, `loopbackOnly`, not in `allowHosts` (or, with `"*"`, does not resolve) |
| `unavailable` | a required hook failed to install (see game log) |
| `no_client` | no client instance yet |
| `remote` | world is on a server not hosted here |
| `server_led` | a BeDD server controls the speed |
| `stale_ref`, `occluded`, `not_ready`, `unsupported` | [UI tree errors](/reference/ui#errors) |

No `code`: unknown op, not a JSON object, input not dispatched in time, or invalid names (key, button).

## Several clients

Window-input ops are serialized across connections; `ping`, `state`, `manager`, `close`, `tap`, `world`, `look`, `input`, `settings`, `send`, `stack`, `timescale`, `join`, `screenshot`, `oreui`, and `ui` reads are not. On disconnect:

| Held | |
|---|---|
| `key`/`mouse` `down` | released (unless re-pressed by another connection) |
| `button` | see above |
| `input` override | runs until its deadline |
| manager | game closes |

Per-connection state in the mod: [code rules](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#code-rules).

## Security

Anyone who can read the discovery file (the user's processes) can control the game. The token is compared in constant time.

- `send`: sends packets as the signed-in player, limited to `sendAllow` (defaults: 9 text, 77 command_request, 78 command_block_update, 97 book_edit). IDs 1, 30, 144, and 147 are always refused. Widen this list only for your own server.
- <a id="send-allow-all"></a>`sendAllow: "*"`: allows every ID except those the client sends itself: 1 login, 4 handshake, 8 resource pack response, 23 tick_sync, 30, 44 animate, 45 respawn, 75 show_credits, 93 player_skin, 94 subclient_login, 113 set_local_player_as_initialized, 115 network_stack_latency, 129/135 client cache, 144, 147, 152 emote_list, 175 subchunk_request, 193 request_network_settings, 312 serverbound_loading_screen. Other packets may desync the client from the server because the client did not generate them.
- `stack`: moves, crafts, drops, and destroys the player's items on any server.
- tap: exposes the entire session.

Disable `allowSend`, `allowStack`, and `tap` when not needed; never share a token.

## Server target

`--target_type=server` ([Building](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#building)) runs in BDS with LeviLamina: it uses the same WebSocket with `kind:"server"`, and rejects other ops with `unknown op`.

| op | fields (default) | reply |
|---|---|---|
| `ping` | | `protocol`, `pid`, `kind`, `target:"server"` |
| `state` | | `target`, `clients`, `loopbackOnly`, `stats{loopbackRebinds, serverQueriesRefused}` |
| `server` | | `tick`, `tps` (2 s), `paused`, `port` (`server-port`), `players[{name, xuid}]` |
| `timescale` | `scale` 0.05..20, `paused`, `timeoutMs` (5000); none = probe | `scale`, `paused`, `source` default\|config\|local, `tps{client:null, server}`, `ticksPerSecond` (20 × scale, 0 paused) |
| `command` | `command` (`/` optional), `timeoutMs` (10000) | `success`, `successCount`, `output[]`, as the console |

It broadcasts level_event 3007 (above) on change and to each spawned player. `tps.server` may lag behind `ticksPerSecond`. Errors: `not_in_level`, `bad_args`, `timeout`.
