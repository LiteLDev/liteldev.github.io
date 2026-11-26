# Tap protocol

Read-only stream of the client's game packets for [bedboo](https://github.com/LiteLDev/bedboo) (transport `bedd`). Configured via `tap` ([Configuration](/guide/configuration#feature-keys)); status reported via the [`tap` op](/reference/websocket#bedboo-ops).

## Subscribing and frames

`{"op":"tap","action":"subscribe"}` → `{"ok":true}`, followed by one binary message per frame. Send nothing else on that connection. A second subscriber receives `busy`; if the feature is off, it receives `disabled`.

| Bytes (LE) | Field |
|---|---|
| u32 | `len`: bytes after this field, ≤ 16 MiB + 20 |
| u8 | `kind` |
| u8 | `flags`: 1 replay, 2 reserialized, 4 local link, 8 suppressed (reserved) |
| u16 | 0 |
| u64 | `seq` (process-wide; preserved across replay) |
| u64 | `tUs` (steady clock µs) |
| … | payload |

| kind | | payload |
|---|---|---|
| 1 | CLIENTBOUND | varint header (`id \| senderSub<<10 \| targetSub<<12`) + body (bedrock-protocol `parsePacketBuffer`) |
| 2 | SERVERBOUND_ECHO | same; never ids 1, 3, 4, 193 (login, handshakes, request_network_settings) |
| 4 | MARKER | UTF-8 JSON (ignore other kinds) |

| marker | fields |
|---|---|
| `HELLO` (first) | `tap:1`, `mod`, `game:"1.26.60.05"`, `protocol` (2225), `pid`, `link{state, type, address}`, `journal{frames, bytes, complete}` |
| `LINK_UP` | `type` remote\|local, `address` |
| `LINK_DOWN` | `reason` |
| `REPLAY_BEGIN` | `frames` |
| `REPLAY_END` | `complete` (false past `tapJournalMiB`; if there is no journal, emits an empty pair with false) |
| `DROPPED` | `count`; sent when the subscriber falls > 32 MiB behind, followed by disconnect (resubscribing triggers a full replay) |

Live frames wait for REPLAY_END; duplicates are skipped by seq.

Publishers share `src/TapSink.h` ([code rules](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#code-rules)); hooks only copy, and the subscriber thread drains.

## Remote servers (`NetTap.cpp`)

| | |
|---|---|
| Link up | detected when the client opens a connection |
| Link down | the connection closes |
| In | received packets, decrypted and decompressed; flags 0 |
| Out | sent packets; flags 0 |
| `trace` | first 50 packets per link: `tap trace #n in\|out id len` |
| Blob cache | `client_cache_status.enabled` cleared before sending so servers send full sub-chunks (echo shows `false`) |

## Singleplayer and LAN-host worlds (`TapLoopback.cpp`, config `tapLoopback`)

Defaults to `true` and requires `tap`. Packets are reserialized (header as above) with flags 2 + 4.

| | |
|---|---|
| CLIENTBOUND | packets the local server sends; `Local` connections only. LAN guests are counted as `guest`. Broadcasts are captured after the local player's `start_game` |
| SERVERBOUND_ECHO | packets the client sends to the local server; never ids 1, 3, 4, 193 |
| Chunks | every `subchunk_request`/`subchunk` (one origin, up to `highest_subchunk_count`; `client_cache_status.enabled:false`) |
| Link | active only while `tap::gLinkType` is local, set by the client's first packet and cleared when the connection closes. Before a link is known, a `Local` client connection is accepted (without writing `gLinkType`). Remote capture publishes only on `Remote`, preventing duplicates |
| No sink | when `tap::gEmit` is null, packets are only counted. `state.stats.tapLoopback{enabled, hooks, link, clientbound, echo, bytes, unpublished, guest}` |
| `trace` | first 50 frames logged (`trace tap loopback: in\|out id= len=`); first 4000 written to `mods\BeDD\data\tap-loopback.bin` (seq, tUs 0) |

## Join journal (`TapJournal.cpp`)

Chains on `bedd::tap::gEmit` and sets `bedd::tap::gReplay` (called per subscriber between the REPLAY markers).

| | |
|---|---|
| Kept | CLIENTBOUND only. Reset on a new link and on `start_game` (11, first frame) |
| Last per key | `level_chunk` (x, z, dim), `update_block` (pos, layer), `set_time`, `set_health`, `network_chunk_publisher_update`, `current_structure_feature`, `inventory_content` (window), `inventory_slot` (window, slot), `level_event` (event id), `update_abilities` (unique id), `add_*` (unique id; `add_player` runtime id); per runtime id: `set_entity_motion`, `move_entity`, `move_player`, `mob_armor_equipment` |
| Per entity + fields | `set_entity_data` (keys), `update_attributes` (names), `move_entity_delta` (fields), `mob_effect` (effect) |
| `subchunk` | dropped once newer frames cover all of its sub-chunks; kept if unparseable |
| `remove_entity` (14) | deletes the corresponding add frame (`add_player` matched by unique id bytes) and runtime-id keys |
| Not kept | `text`, `animate`, `network_stack_latency`, `play_sound`, `stop_sound`, `level_sound_event` (v1, v2), `spawn_particle_effect`, `level_event_generic` |
| Cap | `tapJournalMiB` (128): once exceeded, `complete:false` until reset (late subscribers will miss chunks) |
| Stats | `state.stats.journal`: `enabled, frames, bytes, complete, seen, compacted, pruned, transient, overCap, resets, replays` |
