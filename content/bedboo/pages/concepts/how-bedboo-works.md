# How bedboo works

bedboo is mineflayer with the Java parts replaced by Bedrock parts. A bot sees the mineflayer API, while the underlying connection, game data, physics engine, and plugins that implement `bot.*` are built for Bedrock. This page shows those layers and how a bot's call travels through them. For an entry-by-entry list of what each layer does differently from Java, see [Bedrock differences](../reference/differences/index.md).

## The layers {#layers}

```text
your script, ecosystem plugins (pathfinder, pvp, …)
        │  the mineflayer API: createBot(), bot.*, events
        ▼
bedboo's plugins (one file per mineflayer plugin)  ── bot.registry (minecraft-data + @bedboo/bedrock-data)
        │  Bedrock packets                         ── bot._bedrock (input queue, lifecycle, item stack requests, …)
        ▼
bot._client
        ├── bedrock-protocol over RakNet (raknet-native)     transport: 'raknet', the default ──┐
        ├── bedrock-protocol over NetherNet (node-nethernet) transport: 'nethernet' ────────────┤
        └── a real client hosted by Be.D.D.                  transport: 'bedd' ─────────────────┤
                                                                                                ▼
                                                                                    Bedrock Dedicated Server
```

## createBot and the plugins {#plugins}

`createBot()` is an adapted version of mineflayer's loader (`lib/loader.js`): it uses the same options, plugin selection, and event order, but substitutes a bedrock-protocol client for minecraft-protocol. `bot.loadPlugin()` is mineflayer's own plugin loader, so ecosystem plugins load unchanged.

The internal plugins implement `bot.*`. bedboo has one file for each of mineflayer 4.39.0's 41 plugin names (`blocks`, `chat`, `digging`, `entities`, `inventory`, `physics`, …), plus `abilities` (from mineflayer's master branch) and `sign` (sign editing, split out of `blocks`). Each file is adapted from its mineflayer counterpart and keeps its attribution header: it preserves mineflayer's argument checks, return values, error messages, and events, while replacing the Java packets with Bedrock ones. Consequently, `options.plugins` and `loadInternalPlugins` select plugins by the same names as in mineflayer.

## The connection {#connection}

bedboo connects through [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol), which handles login, encryption, and the packet format of each version. The `transport` option selects what carries the packets:

- **RakNet** (`'raknet'`, the default) through raknet-native. BDS must run with `transport=raknet`.
- **NetherNet** (`'nethernet'`) through [node-nethernet](https://github.com/PrismarineJS/node-nethernet): WebRTC data channels, which is BDS's default transport starting from 1.26.51. By default, signalling goes over HTTP on the server port.
- **A real client** (`'bedd'`): bedboo does not open its own connection to the server. Instead, a Minecraft client hosted by [Be.D.D.](https://levimc.org/BeDD/) is in the world; bedboo reads every packet that client receives and sends, and turns what it would have sent into control requests for the client ([how it works](../guide/bedd.md#how-it-works)).

The bot's API is identical across all three. To choose and set them up, see [Connecting to a server](../guide/connecting.md#transports).

## Versions and game data {#data}

Bedrock versions are grouped into **protocol families**: all BDS builds in a family speak the same network protocol and share one set of game data. bedboo supports four families: `1.26.40`, `1.26.45`, `1.26.51` (the default), and `1.26.60`, and sets `bot.version` to the family ([Supported versions](../reference/versions/index.md)). bedboo does not detect the server's version; to target another family, specify it in `createBot({ version })`.

The game data (blocks, block states, items, entities, effects, biomes, collision shapes, foods, …) comes from [minecraft-data](https://github.com/PrismarineJS/minecraft-data), overlaid by `@bedboo/bedrock-data`, which provides one `data/<family>/` folder per family to replace minecraft-data's `bedrock_<family>` datasets. `require('bedboo')` installs this overlay immediately, before bedrock-protocol or any prismarine library reads Bedrock data. bedboo also makes `require('minecraft-data')(bot.version)` return the Bedrock data, as mineflayer's documentation promises, so code such as prismarine-physics' `PlayerState` works.

`bot.registry` is built from that data before the first packet arrives, and then completed by the server: `start_game` provides the block runtime ids (hashes of the block states on BDS) and `item_registry` provides the item network ids. Names and ids therefore follow Bedrock (`wooden_door`, `lit_furnace`, …); see [Names, ids and data](../reference/differences/data.md).

## Bedrock state {#bedrock-state}

Bedrock requires state that Java does not, which is shared across several plugins. This state lives in `bot._bedrock` (internal, and subject to change):

- `input`: the tick clock and the queue for `player_auth_input`, the packet the bot sends every tick ([Server authority](server-authority.md#input));
- `lifecycle`: join, respawn, and dimension changes; this is the only place that emits `spawn`;
- `stackRequests` and `windows`: item stack requests and the Bedrock containers mapped to Java window types;
- `ids`: runtime and unique entity ids, and item network ids.

Bedrock-specific features that have no equivalent in mineflayer (game rules, block variants, inventory resync, and the BeDD capabilities) are exposed publicly under `bot.bedrock`, never as new top-level `bot` members; see the [API](../reference/api.md#bedrock-extras).

## Movement {#movement}

The physics plugin runs a movement engine forked from prismarine-physics (`lib/physics/`). It preserves the module shape and the `bot.physics` field names so mineflayer-pathfinder can simulate moves with it, while implementing Bedrock's movement rules (step height, friction, jumping, climbing, liquids, …), tuned to reproduce the server's own simulation ([Movement and physics](../reference/differences/movement.md#engine)). On Bedrock, the server checks every move; see [Server authority](server-authority.md#movement).

## Dependencies and patches {#patches}

The repository's `patches/` folder holds `pnpm patch` files that fix issues in dependencies (bedrock-protocol, node-nethernet, raknet-native, prismarine libraries) and Java-specific assumptions in the ecosystem plugins. The `overrides` in `pnpm-workspace.yaml` ensure every package loads the same patched copy. Because of this, bedboo is currently used from its monorepo (the [tutorial](https://levimc.org/tutorials/automate/first-bedboo-bot/) shows how), and the ecosystem plugins require the same patches when used outside it ([Ecosystem plugins](../guide/plugins.md), [Ecosystem plugin patches](../reference/differences/plugins.md)).

The repository contains three packages: `bedboo` (the library), `@bedboo/bedrock-data` (the data overlays), and `@bedboo/agent` (a [survival agent](../guide/agent.md) built on bedboo).
