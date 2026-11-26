# Connecting to a server

This page covers the server settings, versions, accounts, and transports needed to connect a bot to a Bedrock Dedicated Server (BDS). To build your first bot from scratch (get the code, write it, and run it), see the tutorial [Your first bedboo bot](https://levimc.org/tutorials/automate/first-bedboo-bot/).

## Server settings {#prepare-the-server}

A supported BDS from [minecraft.net](https://www.minecraft.net/download/server/bedrock) (1.26.51.1 is the default version) needs these settings in `server.properties`:

```properties
# the bot joins over RakNet by default (BDS 1.26.51 and newer default to nethernet; see "Transports" below)
transport=raknet
# offline bots (auth: 'offline') have no Xbox Live identity
online-mode=false
# or keep it true and add the bot's name to allowlist.json
allow-list=false
server-port=19132
# optional: lets the bot run commands (bot.chat('/time set day'))
allow-cheats=true
```

| property | value | why |
|---|---|---|
| `transport` | `raknet`, or `nethernet` with `transport: 'nethernet'` in `createBot` | RakNet is the default client transport |
| `online-mode` | `false` for `auth: 'offline'`; `true` needs `auth: 'microsoft'` | offline bots have no Xbox Live identity |
| `allow-list` | `false`, or add the bot's name to `allowlist.json` | otherwise the bot is kicked |
| `server-port` | the `port` you pass to `createBot` | |

`online-mode=false` lets anyone join under any name, so keep the server on a private network, or use `online-mode=true` with a [Microsoft account](#microsoft-accounts). When `transport=raknet` and `enable-lan-visibility=true` are set, BDS also binds ports 19132/19133; disable LAN visibility if you run several servers on one host.

Start the server and wait for `Server started.` in the log. A `TRANSPORT TYPE ERROR … not set to NetherNet` block right after it is a BDS warning that vanilla clients may soon require NetherNet; RakNet clients still connect fine.

## Other versions {#versions}

For a server version other than 1.26.51, pass its BDS build or protocol family to `createBot`:

```js
const bot = bedboo.createBot({ host: '127.0.0.1', port: 19132, username: 'Bot', version: '1.26.62.1' })
// bot.version === '1.26.60', bot.protocolVersion === 2225
```

[Supported versions](../reference/versions/index.md#matrix) lists the protocol families, their BDS builds, and the default transport for each BDS. Passing an unrecognized version to bedboo throws `ERR_BEDBOO_VERSION`, which lists the supported versions. Your bot's code stays the same across all versions.

## Permissions, cheats and commands {#commands}

- `bot.chat('/…')` sends a command request (Bedrock has no chat-typed commands). Commands require `allow-cheats=true`
  and operator permissions. On BDS, a player cannot op itself, so op the bot from the server console (`op Bot`) or set
  `default-player-permission-level=operator`.
- Command results arrive as `message` events (Bedrock's `command_output`, one per line).
- Commands like `/give`, `/replaceitem`, and `/tp` are visible to the bot just as on Java (`playerCollect`, `forcedMove`, …).

## Microsoft (Xbox Live) accounts {#microsoft-accounts}

For `online-mode=true` servers, use a Microsoft account that owns Minecraft:

```js
const bot = bedboo.createBot({
  host: 'my.server.example',
  port: 19132,
  username: 'me@example.com', // a name for the token cache
  auth: 'microsoft',
  profilesFolder: './.auth-cache' // optional; same options as mineflayer (prismarine-auth)
})
```

The first run prints a device-code link (use `onMsaCode` to handle it yourself), and caches the tokens for future runs. The bot's in-game name is the account's gamertag. `auth: 'mojang'` does not exist on Bedrock and throws an error.

## Transports: RakNet or NetherNet {#transports}

BDS 1.26.51 and newer use **NetherNet** (WebRTC data channels) by default and keep RakNet behind `transport=raknet`; 1.26.40 and 1.26.45 still default to RakNet. Mojang has stated that RakNet will be removed, though BDS 1.26.60 to 1.26.63.1 still offer it. Because bedrock-protocol has supported RakNet for years, bedboo connects over RakNet unless told otherwise. To use NetherNet, start BDS with `transport=nethernet` and pass the transport to `createBot`:

```js
const bot = bedboo.createBot({ host: '127.0.0.1', port: 19132, username: 'Bot', transport: 'nethernet' })
```

- Signalling uses **HTTP on the server port** (`POST http://<host>:<port>/v1/join/<id>`), so it works with
  `enable-lan-visibility=false` and through TCP port forwarding of `server-port`; media then flows over UDP
  (BDS's `server-udp-ports`). bedrock-protocol's other signalling modes are passed through but are less tested: LAN
  discovery (UDP 7551, requires `enable-lan-visibility=true`) with `nethernet: { signalling: 'lan' }`, and Xbox
  signalling with `nethernet: { signalling: 'services', networkId }` + `auth: 'microsoft'`.
- **Server key.** BDS signs its answer with an identity key. Because nothing vouches for that key over plain HTTP,
  any key is accepted by default—the same trust model as RakNet. Pin the key to reject impostors:
  `nethernet: { serverKey: 'sha256:<hex>' }`. Alternatively, `nethernet: { onServerKey: (fingerprint, url) => true | false }` lets
  you decide dynamically (and reveals the fingerprint to pin). HTTPS signalling URLs (`nethernet: { url: 'https://…' }`) are
  trusted through TLS.
- The bot's API is identical on both transports. For details, see [Connection and versions](../reference/differences/connection.md#transport).

## Troubleshooting {#troubleshooting}

| Symptom | Cause |
|---|---|
| `Connect timed out` | Wrong host or port, the server's `transport` differs from the bot's, or a firewall drops UDP (RakNet) or TCP (NetherNet signalling) |
| `kicked` right after login | `allow-list=true` without the bot in `allowlist.json`, or `online-mode=true` with `auth: 'offline'` (the `reason` says which) |
| Kicked as outdated client / server | The server's family differs from the bot's `version` ([other versions](#versions)) |
| The RakNet backend fails to load | Not on x64, or dependencies were installed outside the workspace (the raknet-native patch is missing) |
| Commands are refused | Op the bot from the console and enable cheats (`allow-cheats=true`) |
| NetherNet: `Untrusted Nethernet server key` | A `serverKey` pin does not match the server's key (or `onServerKey` returned false) |
| NetherNet: `fetch failed` (`ECONNREFUSED`) | The server runs RakNet, or BDS could not open its TCP signalling listener (another process held the port, so BDS logs no `Accepting clients on …` line) |

For more on BDS behavior (join sequence, chunk loading, console output), see [BDS notes](../reference/bds.md).
