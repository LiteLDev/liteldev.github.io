# Your first bedboo bot

By the end of this tutorial, you will have a JavaScript bot that joins your Bedrock server, says hello in chat, replies to players, and walks to you when you type `come`. It is built with bedboo, a Bedrock bot library that uses the [mineflayer](https://github.com/PrismarineJS/mineflayer) API: if you have written a mineflayer bot before, the bot code is the same.

It takes about half an hour.

## What you need

- A Bedrock Dedicated Server (BDS) between **1.26.42.1** and **1.26.63.1**, on your PC or local network. A server from [Your first server](../server/first-server.md) works; this tutorial uses `D:\servers\survival`.
- [Node.js](https://nodejs.org/) **24** or newer and [Git](https://git-scm.com), running on Windows, Linux, or macOS on an **x64** processor (the RakNet connection used here has no ARM builds).
- Minecraft Bedrock, to talk to the bot in the game. Without it, you can still complete steps 1 to 5.

Check your Node.js version in a terminal:

```shell
node -v
```

You should see `v24` or higher.

## 1. Get bedboo

bedboo is not published to npm yet. It patches several of its dependencies using pnpm patches that apply only inside its own workspace, so you must run it from its repository:

```shell
git clone https://github.com/LiteLDev/bedboo
cd bedboo
corepack enable
pnpm install
```

`corepack enable` provides the exact version of pnpm that the repository requires. pnpm should finish with a list of installed packages and no errors.

If `corepack` is not found or not allowed, see [Install bedboo](https://levimc.org/bedboo/install).

## 2. Make a package for your bot

Create a workspace package for your bot so that it can manage its own dependencies.

1. Create the folder `packages/my-bot` in the repository.
2. Inside it, create `package.json`:

   ```json
   {
     "name": "my-bot",
     "private": true,
     "dependencies": {
       "bedboo": "workspace:*",
       "mineflayer-pathfinder": "2.4.5"
     }
   }
   ```

   `bedboo` comes from the workspace. `mineflayer-pathfinder` is the standard mineflayer plugin for navigation; a patch in the bedboo workspace makes it work on Bedrock, so you can use it just as you would on Java Edition.

3. In the root of the repository, run `pnpm install` again. You should see it add `mineflayer-pathfinder`.

## 3. Prepare the server

The bot in this tutorial has no Xbox Live account and connects over RakNet. Configure the server to allow this:

1. Stop the server.
2. Open `server.properties` in the server folder and set:

   ```properties
   transport=raknet
   online-mode=false
   allow-list=false
   server-port=19132
   ```

   | Setting | Why |
   | --- | --- |
   | `transport=raknet` | BDS 1.26.51 and newer use NetherNet by default; bedboo connects over RakNet unless told otherwise. |
   | `online-mode=false` | A bot with `auth: 'offline'` has no Xbox Live identity. |
   | `allow-list=false` | Otherwise, add the bot's name to `allowlist.json`. |

3. Start the server and wait for `Server started.` Note the game version printed at startup, such as `1.26.60`: the bot needs it.

::: warning Keep an offline server private
With `online-mode=false`, anybody can join under any name. Keep such a server on your own network, or keep `online-mode=true` and give the bot a Microsoft account (`auth: 'microsoft'`, see the [API](https://levimc.org/bedboo/reference/api.html)).
:::

A `TRANSPORT TYPE ERROR … not set to NetherNet` line right after `Server started.` is harmless: BDS is warning that vanilla clients may soon require NetherNet. RakNet clients still connect fine.

## 4. Write the bot

Create `packages/my-bot/index.js`:

```js
const bedboo = require('bedboo') // instead of require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

const bot = bedboo.createBot({
  host: process.argv[2] ?? '127.0.0.1',
  port: parseInt(process.argv[3] ?? '19132'),
  version: process.argv[4], // the server's game version, such as '1.26.60'
  username: 'Bot',
  auth: 'offline'
})
bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  console.log(`spawned at ${bot.entity.position} in ${bot.game.dimension} (${bot.game.gameMode})`)
  bot.chat('hello!')
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  if (message === 'come') {
    const target = bot.players[username]?.entity
    if (!target) return bot.chat("I can't see you")
    bot.pathfinder.setMovements(new Movements(bot))
    try {
      await bot.pathfinder.goto(new goals.GoalNear(target.position.x, target.position.y, target.position.z, 1))
      bot.chat('here!')
    } catch (err) {
      bot.chat(`I can't get there: ${err.message}`)
    }
  } else {
    bot.chat(message) // repeat everything else
  }
})

bot.on('kicked', (reason) => console.log('kicked:', reason))
bot.on('error', (err) => console.log('error:', err))
bot.on('end', (reason) => console.log('disconnected:', reason))
```

How it works:

- `createBot` connects to the server. `version` is the server's game version; bedboo accepts either the exact BDS build (`1.26.62.1`) or its version family (`1.26.60`). If omitted, the bot defaults to 1.26.51.
- `spawn` fires once the bot joins the world; `chat` fires on every chat message, passing the sender's name.
- `bot.pathfinder.goto` walks to a goal—in this case, within one block of the player.

Blocks and items use their Bedrock names (`grass_block`, `oak_log`, …); everything else uses mineflayer's API.

## 5. Run it

In the root of the repository, run the bot with your server's version:

```shell
node packages/my-bot/index.js 127.0.0.1 19132 1.26.60
```

You should see `spawned at (…) in overworld (survival)` in your terminal within a few seconds. In the server console, type `list`: you should see `There are 1/10 players online:` and `Bot`.

Press `Ctrl+C` to disconnect the bot.

## 6. Talk to it

1. Start the bot again, and join the server from Minecraft (on the same PC, use address `127.0.0.1` and port `19132`).
2. Type anything in chat: the bot repeats it.
3. Type `come`: the bot walks to you and says `here!`.

To let the bot run commands such as `bot.chat('/time set day')`, set `allow-cheats=true` in `server.properties` and make the bot an operator from the server console: `op Bot`.

::: details The bot does not join
| Symptom | Cause |
| --- | --- |
| `Connect timed out` | Wrong host or port, the server's `transport` is not `raknet`, or a firewall drops UDP. |
| `kicked` right after joining | `allow-list=true` without the bot in `allowlist.json`, or `online-mode=true`. The kick message tells you which. |
| Kicked as an outdated client or server | The `version` you passed does not match the server's. |
| The RakNet backend fails to load | Not running on x64, or dependencies were installed outside the bedboo workspace. |
:::

## What you have now

- bedboo in a local workspace, with your bot set up as a workspace package.
- A server that bots can join, and a bot that chats and walks using the pathfinder plugin.

## Next steps

- Other mineflayer plugins on Bedrock (PvP, collecting blocks, and more): [Ecosystem plugins](https://levimc.org/bedboo/guide/plugins.html).
- Every `createBot` option and the Bedrock extras, including NetherNet and Microsoft accounts: [API](https://levimc.org/bedboo/reference/api.html).
- What differs from Java Edition bots: [Bedrock differences](https://levimc.org/bedboo/reference/differences/).
- Supported server versions: [Supported versions](https://levimc.org/bedboo/reference/versions/).
- A ready-made bot that plays survival: [Survival agent](https://levimc.org/bedboo/guide/agent.html).
- How BDS behaves toward bots: [BDS notes](https://levimc.org/bedboo/reference/bds.html).
- Drive a real game client instead of a protocol bot: [Drive the game client with Be.D.D.](bedd.md).
- What bedboo is and how it is built: [bedboo](https://levimc.org/bedboo/).
