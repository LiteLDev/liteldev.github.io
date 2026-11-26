# 你的第一个 bedboo 机器人

完成本教程后，你将用 JavaScript 编写一个机器人：它会加入你的基岩版服务器，在聊天栏打招呼，回应玩家发言，并在你输入 `come` 时走到你身边。该机器人基于 bedboo 构建——这是一个兼容 [mineflayer](https://github.com/PrismarineJS/mineflayer) API 的基岩版机器人库。如果你写过 mineflayer 机器人，两者的代码完全相同。

全程大约需要半小时。

## 你需要准备

- 一个运行在电脑或局域网上的基岩版专用服务器（BDS），版本在 **1.26.42.1** 到 **1.26.63.1** 之间。直接使用[开你的第一个服务器](../server/first-server.md)中的服务器即可；本教程使用 `D:\servers\survival`。
- [Node.js](https://nodejs.org/zh-cn) **24** 或更高版本，以及 [Git](https://git-scm.com)。操作系统不限（Windows、Linux 或 macOS 均可），但需要 **x64** 处理器（此处使用的 RakNet 连接没有 ARM 构建）。
- Minecraft 基岩版，用于在游戏内与机器人对话。没有它也可以完成第 1 到 5 步。

在终端中检查 Node.js 版本：

```shell
node -v
```

输出应为 `v24` 或更高版本。

## 1. 获取 bedboo

bedboo 尚未发布到 npm。它通过 pnpm 补丁修复了几个依赖，而这些补丁仅在自身的工作区内生效，因此请在它的仓库中使用：

```shell
git clone https://github.com/LiteLDev/bedboo
cd bedboo
corepack enable
pnpm install
```

`corepack enable` 会启用仓库所需的 pnpm 版本。执行后，pnpm 会列出已安装的包并顺利结束，不会报错。

如果提示找不到 `corepack` 或权限不足，请参阅[安装 bedboo](https://levimc.org/zh-Hans/bedboo/install)。

## 2. 为机器人建一个包

把机器人作为工作区中的一个独立包存放，以便管理它自己的依赖。

1. 在仓库中创建 `packages/my-bot` 文件夹。
2. 在其中创建 `package.json`：

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

   `bedboo` 直接取自工作区。`mineflayer-pathfinder` 是 mineflayer 常用的寻路插件，bedboo 工作区会为它打上补丁以适配基岩版，代码写法则与 Java 版完全相同。

3. 回到仓库根目录，再次运行 `pnpm install`。你会看到 `mineflayer-pathfinder` 已被添加。

## 3. 准备服务器

本教程中的机器人没有 Xbox Live 账号，且通过 RakNet 连接，因此需要相应调整服务器配置：

1. 停止服务器。
2. 打开服务器文件夹中的 `server.properties`，修改以下设置：

   ```properties
   transport=raknet
   online-mode=false
   allow-list=false
   server-port=19132
   ```

   | 设置 | 原因 |
   | --- | --- |
   | `transport=raknet` | BDS 1.26.51 及更高版本默认使用 NetherNet；bedboo 若未另行指定，则通过 RakNet 连接。 |
   | `online-mode=false` | 使用 `auth: 'offline'` 的机器人没有 Xbox Live 身份。 |
   | `allow-list=false` | 关闭白名单，否则需要把机器人的名字加入 `allowlist.json`。 |

3. 启动服务器，等待出现 `Server started.`。记下启动时输出的游戏版本（例如 `1.26.60`），后续运行机器人时会用到。

::: warning 离线服务器请保持私有
设为 `online-mode=false` 后，任何人都能以任意名字加入服务器。请仅在私有网络中运行此类服务器；或者保持 `online-mode=true`，并为机器人配置一个 Microsoft 账号（`auth: 'microsoft'`，详见 [API](https://levimc.org/zh-Hans/bedboo/reference/api.html)）。
:::

`Server started.` 之后紧接着输出的 `TRANSPORT TYPE ERROR … not set to NetherNet` 无须担心：这只是 BDS 提醒原版客户端将来可能需要 NetherNet，RakNet 客户端仍可正常连接。

## 4. 编写机器人

创建 `packages/my-bot/index.js`：

```js
const bedboo = require('bedboo') // 代替 require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

const bot = bedboo.createBot({
  host: process.argv[2] ?? '127.0.0.1',
  port: parseInt(process.argv[3] ?? '19132'),
  version: process.argv[4], // 服务器的游戏版本，例如 '1.26.60'
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
    bot.chat(message) // 其他内容原样复述
  }
})

bot.on('kicked', (reason) => console.log('kicked:', reason))
bot.on('error', (err) => console.log('error:', err))
bot.on('end', (reason) => console.log('disconnected:', reason))
```

代码说明：

- `createBot` 用于连接服务器。`version` 是服务器的游戏版本，bedboo 既接受精确的 BDS 构建号（`1.26.62.1`），也接受其协议族版本（`1.26.60`）。若不传该参数，默认使用 1.26.51。
- 机器人进入世界后触发 `spawn` 事件；每收到一条聊天消息都会触发 `chat` 事件，并传入发送者的名字。
- `bot.pathfinder.goto` 让机器人走向目标位置，这里是玩家周围一格范围内。

方块和物品名称使用基岩版 ID（如 `grass_block`、`oak_log` 等），其余均与 mineflayer API 一致。

## 5. 运行

在仓库根目录下，传入你的服务器版本并运行：

```shell
node packages/my-bot/index.js 127.0.0.1 19132 1.26.60
```

几秒钟内，终端会输出 `spawned at (…) in overworld (survival)`。在服务器控制台输入 `list`，可以看到 `There are 1/10 players online:` 以及在线的 `Bot`。

按 `Ctrl+C` 即可断开机器人连接。

## 6. 和它对话

1. 重新启动机器人，并从 Minecraft 加入服务器（若在同一台电脑上，地址填 `127.0.0.1`，端口填 `19132`）。
2. 在聊天栏随便发一句话，机器人会原样复述。
3. 输入 `come`，机器人就会走到你身边并说 `here!`。

如果想让机器人通过 `bot.chat('/time set day')` 执行命令，请在 `server.properties` 中设置 `allow-cheats=true`，并在服务器控制台输入 `op Bot` 将其设为管理员。

::: details 机器人进不来
| 现象 | 原因 |
| --- | --- |
| `Connect timed out` | 主机或端口有误、服务器的 `transport` 未设为 `raknet`，或防火墙拦截了 UDP 流量。 |
| 加入后立即被 `kicked` | 开启了 `allow-list=true` 但未将机器人加入 `allowlist.json`，或者开启了 `online-mode=true`。踢出提示会说明具体原因。 |
| 提示客户端或服务器版本过旧而被踢出 | 传入的 `version` 与服务器版本不一致。 |
| RakNet 后端加载失败 | 处理器不是 x64 架构，或者在 bedboo 工作区之外安装了依赖。 |
:::

## 你现在有了什么

- 本地工作区中的 bedboo，以及作为独立包存放在其中的机器人。
- 一个允许机器人加入的服务器，以及一个会聊天、会用寻路插件移动的机器人。

## 下一步

- 在基岩版上使用其他 mineflayer 插件（如 pvp、采集方块等）：[生态插件](https://levimc.org/zh-Hans/bedboo/guide/plugins.html)。
- `createBot` 的全部选项及基岩版扩展（包括 NetherNet 和 Microsoft 账号）：[API](https://levimc.org/zh-Hans/bedboo/reference/api.html)。
- 与 Java 版机器人的不同之处：[Bedrock 差异](https://levimc.org/zh-Hans/bedboo/reference/differences/)。
- 支持的服务器版本：[支持的版本](https://levimc.org/zh-Hans/bedboo/reference/versions/)。
- 现成的生存模式机器人：[生存智能体](https://levimc.org/zh-Hans/bedboo/guide/agent.html)。
- BDS 对机器人的特殊处理机制：[BDS 备忘](https://levimc.org/zh-Hans/bedboo/reference/bds.html)。
- 直接操控真实游戏客户端，而非使用协议机器人：[用 Be.D.D. 驱动游戏客户端](bedd.md)。
- 了解 bedboo 的原理与架构：[bedboo](https://levimc.org/zh-Hans/bedboo/)。
