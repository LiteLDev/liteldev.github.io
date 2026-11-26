# Driving the game

Each game serves a WebSocket on `127.0.0.1`: each message sends one JSON request, and the game replies once it has handled it.
Prefer driving the game with bedboo first, then `ui`, and finally simulated input ([why](/guide/operation-modes#which-one-to-use)).
If you have not installed it yet, the tutorial [Drive the game client with Be.D.D.](https://levimc.org/tutorials/automate/bedd/)
shows how to set up a PC and run your first script.

## Starting a game

```powershell
BeDD.exe launch --slot 1 --json
# {"pid":12345,"instance":"1.26.60.05-1","instanceDir":"…","url":"ws://127.0.0.1:53021/v1","token":"9f3c…","label":"…"}
```

`launch` clones the game, installs or updates the mod ([which build](/guide/installs#upgrading)), starts the game in the
background, opens the [manager window](/guide/several-games#the-manager-window), waits for the WebSocket, prints the result, and
exits while the game keeps running. If the instance is already running, it exits with code 5.

| Flag | |
|---|---|
| `--slot N` / `<instance>` / `--dir <folder>` | clone `<gameVersion>-<N>` (default 1), a named instance, or any folder with `Minecraft.Windows.exe` |
| `--label <text>` | name in the manager window (default `BEDD_LABEL`, else the calling project) |
| `--exclusive-signaling` | wait for other games to close; keep the PC to itself ([rules](/guide/several-games#rules-for-parallel-runs)) |
| `--keep-mod` | keep the clone's mod |
| `--no-manager` | do not start the manager window |
| `--timeout` / `--lock-timeout` | wait for the WebSocket (`3m`) / signaling lock (`2h`) |
| `--detach` | return when the process starts; `url`/`token` are `null` |

`BeDD.exe ps` lists running games; `BeDD.exe stop --pid <pid>` (or `stop <instance>`) stops one.

## Which game

`BeDD.exe ps --json` (or `%LOCALAPPDATA%\BeDD\run\<pid>.json`, which exists while the WebSocket is listening) gives each game's
`url`, `token`, and `instance`. Always identify your game by `instance`, never by process name. Connect with `?token=<token>` or
`Authorization: Bearer <token>`; a new token is generated on each start. For details, see [Connecting](/reference/websocket#connecting).

## With bedboo

```js
import bedboo from 'bedboo';
const bot = bedboo.createBot({ transport: 'bedd', bedd: { url: game.url, token: game.token } });
bot.once('spawn', () => bot.chat('/summon cow'));
```

## A small client

Without bedboo, you can use any WebSocket client: send `{id, op, ...}`, match the reply by `id`, and ignore binary (tap) frames. For the
Node 24 `call(op, args)` helper used in these guides, see [Connecting](/reference/websocket#connecting). For operations by
mode, see [Operation modes](/guide/operation-modes); for all fields, see [WebSocket protocol](/reference/websocket).

## Key names

`key` accepts key names (`ESC`, `ENTER`, `F1`..`F24`, …: see [input ops](/reference/websocket#input-ops)) or any `vk`. To send chat,
use bedboo `bot.chat('/summon cow')`; otherwise, send `key T`, `text`, and `key ENTER`.

## Positions

`mouse` accepts `x`,`y` pixels, `rx`,`ry` fractions, or a size-independent `ui` `ref`. When using coordinates, fix the
window size (via config `clientWidth`/`clientHeight` or `window`). `raw` rotates the camera while the mouse is grabbed.

## Servers

```js
await call('join', { host: '127.0.0.1', port: 19140, wait: true });   // join, wait until in the world
(await call('join')).connection;                                      // none | local | remote
```

This works from the title screen or from inside a world (which it leaves first), and fails on a join error or after `timeoutMs` (60000). Servers outside the
PC require [Remote world mode](/guide/modes).

## Several connections

Each game accepts up to `wsMaxClients` (8) connections and serves them in order. When a connection closes, its `key`/`mouse` holds and
endless `button` holds are released; `button` `click`/`holdTicks`/`releaseOn` and `input` (until `ttlMs`/`ttlTicks`)
continue, so a one-shot caller can disconnect immediately. For details, see [Several clients](/reference/websocket#several-clients).
