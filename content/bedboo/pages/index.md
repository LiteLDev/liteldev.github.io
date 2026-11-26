# bedboo

Bedrock bots with the mineflayer API: your mineflayer bot and its plugins join a Bedrock Dedicated Server unchanged.

bedboo is a Minecraft Bedrock Edition bot library with a mineflayer-compatible API. It provides the same `createBot()`, `bot.*` properties, methods, and events, TypeScript types, and plugin system as [mineflayer](https://github.com/PrismarineJS/mineflayer) 4.39.0, while communicating with a **Bedrock Dedicated Server** (BDS) through [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol). Bot code written for mineflayer—including ecosystem plugins like mineflayer-pathfinder—runs directly against BDS.

```js
const bedboo = require('bedboo') // instead of require('mineflayer')

const bot = bedboo.createBot({ host: '127.0.0.1', port: 19132, username: 'Bot', auth: 'offline' })
bot.on('chat', (username, message) => {
  if (username !== bot.username) bot.chat(message)
})
```

::: tip Start here
New to bedboo? The [Your first bedboo bot](https://levimc.org/tutorials/automate/first-bedboo-bot/) tutorial helps you get the code, prepare a server, and connect a bot that walks to you.
:::

## What it offers {#features}

- **The mineflayer API.** `createBot()`, every `bot.*` property, method, and event, and the TypeScript types of mineflayer 4.39.0, with the same arguments, errors, and event order ([API](reference/api.md)).
- **Plugins run unchanged.** mineflayer-pathfinder, -pvp, -collectblock, -tool, -armor-manager, and -auto-eat load with `bot.loadPlugin()` and work on Bedrock ([Ecosystem plugins](guide/plugins.md)).
- **RakNet and NetherNet.** Connects to every stable BDS from 1.26.42.1 to 1.26.63.1 (four protocol families) over RakNet or NetherNet, either offline or with a Microsoft account ([Connecting to a server](guide/connecting.md)).
- **Every difference documented.** Every inherent difference between Java and Bedrock—such as Bedrock block names and server-authoritative inventory, digging, and movement—is documented ([Bedrock differences](reference/differences/index.md)).
- **Drive a real client.** With `transport: 'bedd'`, the same script drives a real Minecraft Bedrock client hosted by Be.D.D. ([Driving a real client](guide/bedd.md)).
- **A survival agent included.** `@bedboo/agent` plays survival from wood to diamonds, builds, and fights, all through the public API ([Survival agent](guide/agent.md)).

## Who it is for

- **mineflayer users** who want to run their bots and plugins on a Bedrock server: mineflayer's documentation, examples, and plugins apply unchanged.
- **Server and mod authors** who test a BDS (or a [LeviLamina](https://levimc.org/LeviLamina/) server) with scripted players.
- **Client mod authors** who drive a real Minecraft client through [Be.D.D.](guide/bedd.md) with the same bot code.

## Why

mineflayer is the standard way to write Minecraft bots in JavaScript and has a large plugin ecosystem, but it targets Java Edition. Bedrock Edition uses a different protocol, different block and item IDs, server-authoritative inventory and block breaking, and its own movement physics, so Java bots and their plugins cannot join a Bedrock server. bedboo bridges this gap without inventing a new API.

The only differences are those inherent to Java and Bedrock: Bedrock block and item names, the lack of teams, server-authoritative inventory and block breaking, and so on. Each difference is covered in [Bedrock differences](reference/differences/index.md).

## What is supported

- **Servers:** every stable BDS from 1.26.42.1 (August 7, 2026) to 1.26.63.1 (November 6, 2026), across four protocol families: 1.26.40 (protocol 2168), 1.26.45 (2169), 1.26.51 (2193, the default), and 1.26.60 (2225). `createBot({ version })` accepts the family or the BDS build; `bot.version` holds the family. See [Supported versions](reference/versions/index.md).
- **Transports:** RakNet by default; NetherNet (the default BDS transport) with `transport: 'nethernet'` ([Connecting to a server](guide/connecting.md#transports)).
- **Auth:** `auth: 'offline'` (default) for `online-mode=false` servers, or `auth: 'microsoft'` for Xbox Live.
- **Real client:** `transport: 'bedd'` drives a real Bedrock client hosted by [Be.D.D.](guide/bedd.md) instead.
- **Runtime:** Node.js 24 or newer. RakNet requires x64 (raknet-native ships x64 prebuilds only); NetherNet is pure JavaScript.

## Where it fits

| Project | Role |
|---|---|
| [mineflayer](https://github.com/PrismarineJS/mineflayer) | The API bedboo implements, and the source of its plugins |
| [Be.D.D.](https://levimc.org/BeDD/) | Hosts a real Minecraft Bedrock client that bedboo drives with `transport: 'bedd'` ([guide](guide/bedd.md)) |
| [LeviLamina](https://levimc.org/LeviLamina/) | The mod loader for BDS and the client; a LeviLamina server is a BDS that bedboo joins like any other |

## How it is built

- [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol) for the connection (RakNet through
  raknet-native, NetherNet through [node-nethernet](https://github.com/PrismarineJS/node-nethernet)) and
  prismarine-auth for Xbox Live sign-in;
- the prismarine-* libraries (block, chat, chunk, entity, item, nbt, recipe, registry, windows, world) and
  [minecraft-data](https://github.com/PrismarineJS/minecraft-data), with `@bedboo/bedrock-data` as the Bedrock data
  overlay (one per protocol family);
- a Bedrock movement engine forked from prismarine-physics;
- mineflayer's own plugins, adapted one file per plugin, each keeping its attribution header.

Small fixes to these dependencies live as pnpm patches in the repository's `patches/` folder, which is why bedboo is used
from its monorepo for now (the [tutorial](https://levimc.org/tutorials/automate/first-bedboo-bot/) shows how).
[How bedboo works](concepts/how-bedboo-works.md) explains how these parts fit together.

## Packages

bedboo is used from a checkout of its repository; see [Install](install.md).

| package | |
|---|---|
| `bedboo` | the library |
| `@bedboo/bedrock-data` | the Bedrock data overlays for minecraft-data, one per supported family |
| `@bedboo/agent` | a scripted survival agent built on bedboo ([Survival agent](guide/agent.md)) |

## The name

bedboo (Bedrock + Bangboo) is named after the Bangboo from Zenless Zone Zero: a Bangboo goes into the Hollows on a
Proxy's behalf, and your bot goes into a Bedrock server on yours.

## On this site {#on-this-site}

- **Guides**: [connecting to a server](guide/connecting.md) (server settings, versions, accounts, transports),
  [ecosystem plugins](guide/plugins.md), [driving a real client](guide/bedd.md) with Be.D.D., and the
  [survival agent](guide/agent.md). To build your first bot from scratch, follow the tutorial
  [Your first bedboo bot](https://levimc.org/tutorials/automate/first-bedboo-bot/).
- **Concepts**: [how bedboo works](concepts/how-bedboo-works.md) (the layers beneath the mineflayer API) and
  [server authority](concepts/server-authority.md) (how bedboo adapts the API to Bedrock's server-authoritative
  movement, inventory, and digging).
- **Reference**: the [API](reference/api.md), the [Bedrock differences](reference/differences/index.md) topic by
  topic, the [BDS notes](reference/bds.md), and the [supported versions](reference/versions/index.md).
