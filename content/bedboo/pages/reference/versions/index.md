# Supported versions

bedboo supports every stable Bedrock Dedicated Server (BDS) from 1.26.42.1 (August 7, 2026) to 1.26.63.1
(November 6, 2026): eleven builds across four protocol families. A **family** is a minecraft-data / bedrock-protocol
Bedrock version key such as `'1.26.51'`. All builds in a family speak the same network protocol and share one set of
game data (`@bedboo/bedrock-data` `data/<family>/`). `bot.version` is the family. The version table lives in
`packages/bedboo/lib/bedrock/versions.js` (`FAMILIES`). A family counts as tested—meaning it appears in `testedVersions`
and `createBot` accepts it—when it has a `FAMILIES` entry and `@bedboo/bedrock-data` ships data for it.

## Version matrix {#matrix}

| family (`bot.version`) | protocol | BDS builds (release date) | BDS default `transport` | notes |
|---|---|---|---|---|
| `'1.26.40'` | 2168 | 1.26.42.1 (Aug 7, 2026), 1.26.43.1 (Aug 7, 2026), 1.26.44.3 (Aug 14, 2026) | `raknet` | [Bedrock 1.26.40](1.26.40.md) |
| `'1.26.45'` | 2169 | 1.26.45.1 (Aug 28, 2026) | `raknet` | [Bedrock 1.26.45](1.26.45.md) |
| `'1.26.51'` (default) | 2193 | 1.26.50.5 (Sep 15, 2026), 1.26.51.1 (Sep 15, 2026), 1.26.52.3 (Sep 25, 2026) | `nethernet` | [Bedrock 1.26.51](1.26.51.md) |
| `'1.26.60'` | 2225 | 1.26.60.6 (Oct 27, 2026), 1.26.61.1 (Oct 29, 2026), 1.26.62.1 (Nov 4, 2026), 1.26.63.1 (Nov 6, 2026) | `nethernet` | [Bedrock 1.26.60](1.26.60.md) |

Before marking a family as tested, we started each of its builds natively and connected a bot to check
spawn, blocks and items, inventory, chat, walking, digging and placing, entities, and the command tree. CI runs the unit
tests once per family. The rest of this reference (the [Bedrock differences](../differences/index.md) and the
[BDS notes](../bds.md)) was observed on the default build, BDS 1.26.51.1. Each family's page lists what differs for that family.

Previews, betas, and builds older than 1.26.42.1 are not supported. A server running a build not in the table may still
speak one of these protocols, but bedboo has not been tested against it.

## Choosing a version {#choosing}

Pass the server's version to `createBot`. It accepts either the family or the exact BDS build, and both produce the same
bot:

```js
const bot = bedboo.createBot({
  host: '127.0.0.1',
  port: 19132,
  username: 'Bot',
  version: '1.26.62.1', // or '1.26.60'
  transport: 'nethernet' // BDS 1.26.51 and newer default to transport=nethernet
})
bot.once('spawn', () => console.log(bot.version, bot.protocolVersion)) // 1.26.60 2225
```

- **Default:** without `version`, or with `version: false`, the bot uses **1.26.51**. bedboo does not auto-detect the
  server's version (by default it joins without a ping, because BDS does not answer pings when LAN visibility is off).
  To connect to another family, you must specify the version.
- **Accepted values:** a family in `testedVersions`, one of its BDS builds, or either form with a `bedrock_` prefix.
  Anything else throws an `Error` with `code: 'ERR_BEDBOO_VERSION'` listing the supported families and builds,
  just as mineflayer does for an unsupported version.
- **Wrong family:** BDS refuses logins using a different protocol, and the bot is `kicked` as an outdated client or
  outdated server.
- **What follows the version:** `bot.version` (the family), `bot.protocolVersion`, `bot.majorVersion` (`'1.26'`),
  `bot.registry` (minecraft-data `bedrock_<family>` with that family's `@bedboo/bedrock-data` overlay), and
  `bot.supportFeature(...)`. The feature table has per-family values, such as `actionPacketsHaveHand` on 1.26.60
  and `defaultTransportIsNethernet`.
- **Module exports:** `testedVersions` lists the tested families, oldest first (`['1.26.40', '1.26.45', '1.26.51',
  '1.26.60']`). `oldestSupportedVersion` is `'1.26.40'` and `latestSupportedVersion` is `'1.26.60'`.
  `supportFeature(feature, version)` takes a family, a build, or nothing (defaulting to 1.26.51).

The families differ in a few added blocks, items, and entities, some packet fields, command
parameter type numbering, and the default transport. bedboo handles these differences per family, so your bot code does not need to change. See the
family pages for the specific differences.

## Testing against a version {#testing}

The unit tests run against 1.26.51 by default. Set `BEDBOO_VERSION` to test against another family or build:

```sh
pnpm test                              # 1.26.51
BEDBOO_VERSION=1.26.60 pnpm test       # a family
BEDBOO_VERSION=1.26.44.3 pnpm test     # a BDS build, mapped to its family (1.26.40)
```

Fakes, serializers, registries, and packet captures (`packages/bedboo/test/fixtures/<family>/`) follow the selected
version. If a test requires a capture that the family does not have, the test is skipped and prints the reason. Only 1.26.51 has a
join capture so far, so the join-replay tests are skipped on other families. Instead, live bot connections to every build covered
those cases. CI (`.github/workflows/ci.yml`) runs linting, unit tests, and typechecking once per family in
its `bedrock` matrix. When triggered manually, the workflow accepts a `version` input.

## Adding a version {#adding}

Adding a build or protocol family is maintainer work. The steps (bedrock-data pins, probing and data generation, the
`FAMILIES` entry, the CI matrix, and these pages) are documented in
[CONTRIBUTING.md](https://github.com/LiteLDev/bedboo/blob/main/CONTRIBUTING.md#adding-a-version).
