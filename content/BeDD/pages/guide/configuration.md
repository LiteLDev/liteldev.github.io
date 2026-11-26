# Configuration

The mod reads `mods\BeDD\config\config.json`, using default values if the file is missing. Because the files are hardlinked, edit the configuration only via `BeDD.exe`:

```powershell
BeDD.exe mod config 1.26.60.05-2                                        # print
BeDD.exe mod config 1.26.60.05-2 --set clientWidth=1600 --unset timeScale # --unset: back to default
```

`--set` (also available on `mod install`) parses the value as JSON if valid, or treats it as a string otherwise. `--world-mode` sets `mode` and `allowHosts` ([Where the world runs](/guide/modes)). `mod install` and `launch` also set `modules.crashLogger.builtin` in `mods\LeviLamina\config\Config.json` so `CrashLogger.exe` does not flash a console.

## Keys

| Key | Default | |
|---|---|---|
| `clientWidth`, `clientHeight` | `0` (leave) | window size, for stable click positions |
| `wsPort` | `0` (free port) | WebSocket port on `127.0.0.1` (see `run\<pid>.json`); use a fixed port only for one game at a time |
| `wsMaxClients` | `8` | maximum concurrent connections |
| `allowOrigins` | `[]` | web origins allowed to connect; other `Origin` headers receive 403 |
| `manager` | `true` | show in the [manager window](/guide/several-games#the-manager-window) and close if without one for 30 s; `false`: hidden, never self-closes (headless CI) |
| `loopbackOnly` | `true` | keep every socket on loopback: no firewall prompt, no "LAN worlds" from other hosts. Server mod: applies the same to its IPv4/IPv6 ports, LAN discovery, and NetherNet; reported by `state` |
| `mode` | `ClientOnly` | `ClientOnly`, `ClientServer`, or `Remote` ([world modes](/guide/modes)); reported by `state` and `join` |
| `allowHosts` | `[]` | off-PC hosts that remain reachable (the Remote server); while it names one, datagrams to other off-PC hosts are refused (`state` `stats.sendsRefused`). `"*"`: `join` adds its host when it joins, so any server works without a restart (other hosts are still refused) |
| `mute` | ignored | silent unless sound is turned on in the manager window; `false` only logs a warning |
| `trace` | `false` | log every input to `logs\latest.log` |
| `timeScale` | `1` | game speed 0.05..20 for hosted worlds (the `timescale` op changes it). Behind a BeDD server, the server leads; without BeDD, this has no effect. Server mod: applied at start and sent to players |
| `gameHooks` | `true` | bedboo ops `world`, `look`, `input`, `slot`, `action`, `button` |
| `tap` | `true` | `tap` op ([Tap protocol](/reference/tap)): the player's whole session; disables the blob cache |
| `tapLoopback` | `true` | with `tap`: also taps singleplayer and hosted LAN worlds |
| `tapJournalMiB` | `128` | join journal cap; past this limit, late attaches receive `complete:false` |
| `allowSend` | `true` | `send` op (chat, commands) |
| `sendAllow` | `[9, 77, 78, 97]` | packet IDs `send` may send (text, command_request, command_block_update, book_edit); login, inventory_transaction, player_auth_input, and item_stack_request are always refused. `"*"`: every ID except the packets the client sends itself ([list](/reference/websocket#send-allow-all)) |
| `allowStack` | `true` | `stack` op (item stack requests) |
| `ui` | `true` | `ui` op ([UI tree](/reference/ui)) |
| `uiMaxNodes` | `1000` | default node cap for a `format:"json"` `ui` reply (a request's `maxNodes` replaces it) |

## Feature keys

The feature keys (`gameHooks`, `tap`, `allowSend`, `allowStack`, and `ui`) are all on by default because only your user reads the token. When off, their ops answer `code:"disabled"`; for example, `allowSend=false` forces chat through the chat screen. For risks, see [Security](/reference/websocket#security).

## No firewall prompts

Windows shows a firewall prompt once per exe path (per clone) on a non-loopback bind. `loopbackOnly` redirects wildcard binds to loopback; with `allowHosts`, the outgoing UDP socket connects directly to the host instead, avoiding a prompt. Never turn `loopbackOnly` off for a remote server.

## Environment variables

| Variable | Read by | |
|---|---|---|
| `BEDD_HOME`, `BEDD_INSTANCES_DIR`, `BEDD_SERVERS_DIR` | `BeDD.exe` (+ mod: `BEDD_HOME`) | [Folders](/guide/installs#folders) |
| `BEDD_LEVILAUNCHER`, `BEDD_INSTANCE` | `BeDD.exe` | [Which instance](/guide/installs#which-instance) |
| `BEDD_MOD_DIR`, `BEDD_SERVER_MOD_DIR` | `BeDD.exe` | the client mod build (before `mod\BeDD`, [Upgrading](/guide/installs#upgrading)) / the server mod build for `server init` |
| `BEDD_LIP` | `BeDD.exe` | the `lip.exe` that `server init` runs (default: on `PATH`, else in `tools`, else downloaded) |
| `BEDD_LABEL` | `BeDD.exe`, mod | manager window name (`launch --label`) |
| `BEDD_RETURN_FOCUS` | mod | restores the foreground if the game takes it at start (set by `launch`) |
| `BEDD_DIR` | your harness | an unpacked Be.D.D. ([Installation](/guide/installs#let-the-harness-fetch-it)) |
