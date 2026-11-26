# 连接服务器

本文介绍机器人加入基岩版专用服务器（BDS）所需的服务器设置、版本、账号和传输层。如需从零开始编写第一个机器人（获取代码、编写、运行），请参见教程[你的第一个 bedboo 机器人](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)。

## 服务器设置 {#prepare-the-server}

从 [minecraft.net](https://www.minecraft.net/download/server/bedrock) 下载受支持的 BDS（默认版本为 1.26.51.1）后，需要在 `server.properties` 中配置以下选项：

```properties
# 机器人默认通过 RakNet 加入（BDS 1.26.51 及更新版本默认使用 nethernet；见下文“传输层”）
transport=raknet
# 离线机器人（auth: 'offline'）没有 Xbox Live 身份
online-mode=false
# 或者保持为 true，并把机器人的名字加入 allowlist.json
allow-list=false
server-port=19132
# 可选：允许机器人执行命令（bot.chat('/time set day')）
allow-cheats=true
```

| 属性 | 值 | 原因 |
|---|---|---|
| `transport` | `raknet`，或在 `createBot` 中使用 `transport: 'nethernet'` 时设为 `nethernet` | RakNet 是客户端的默认传输层 |
| `online-mode` | `auth: 'offline'` 时为 `false`；设为 `true` 时需要 `auth: 'microsoft'` | 离线机器人没有 Xbox Live 身份 |
| `allow-list` | `false`，或将机器人的名字加入 `allowlist.json` | 否则机器人会被踢出 |
| `server-port` | 传给 `createBot` 的 `port` | |

`online-mode=false` 允许任何人以任意名字加入，因此请将此类服务器部署在私有网络中，或者改用 `online-mode=true` 并配合 [Microsoft 账号](#microsoft-accounts)。当 `transport=raknet` 且 `enable-lan-visibility=true` 时，BDS 还会额外绑定 19132/19133 端口；如果在同一台主机上运行多个服务器，请关闭该选项。

启动服务器，等待日志输出 `Server started.`。紧随其后的 `TRANSPORT TYPE ERROR … not set to NetherNet` 信息块只是 BDS 在提示原版客户端可能很快需要 NetherNet，RakNet 客户端仍可正常连接。

## 其他版本 {#versions}

如果服务器版本不是 1.26.51，请将其 BDS 版本或协议族传给 `createBot`：

```js
const bot = bedboo.createBot({ host: '127.0.0.1', port: 19132, username: 'Bot', version: '1.26.62.1' })
// bot.version === '1.26.60'，bot.protocolVersion === 2225
```

各协议族、对应的 BDS 版本及各版本的默认传输层详见[支持的版本](../reference/versions/index.md#matrix)。遇到无法识别的版本时，bedboo 会抛出 `ERR_BEDBOO_VERSION` 并列出支持的版本。机器人代码在所有版本中均通用。

## 权限、作弊与命令 {#commands}

- `bot.chat('/…')` 会发送命令请求（基岩版不支持通过普通聊天消息执行命令）。执行命令需要开启 `allow-cheats=true` 并具备管理员权限：BDS 上的玩家无法自行获取 op，因此请在服务器控制台中赋予机器人 op 权限（`op Bot`），或设置 `default-player-permission-level=operator`。
- 命令执行结果会通过 `message` 事件返回（对应基岩版的 `command_output`，每行触发一次）。
- `/give`、`/replaceitem`、`/tp` 等命令的效果对机器人可见，触发的事件与 Java 版一致（如 `playerCollect`、`forcedMove` 等）。

## Microsoft（Xbox Live）账号 {#microsoft-accounts}

连接开启了 `online-mode=true` 的服务器时，请使用拥有 Minecraft 的 Microsoft 账号：

```js
const bot = bedboo.createBot({
  host: 'my.server.example',
  port: 19132,
  username: 'me@example.com', // 令牌缓存使用的名字
  auth: 'microsoft',
  profilesFolder: './.auth-cache' // 可选；选项与 mineflayer 相同（prismarine-auth）
})
```

首次运行会打印设备码链接（也可通过 `onMsaCode` 自行处理），后续运行则会直接读取缓存的令牌。机器人在游戏内的名称即为该账号的玩家代号（gamertag）。基岩版不存在 `auth: 'mojang'`，传入该值会抛出错误。

## 传输层：RakNet 或 NetherNet {#transports}

BDS 1.26.51 及更高版本默认使用 **NetherNet**（WebRTC 数据通道），需配置 `transport=raknet` 才能启用 RakNet；1.26.40 和 1.26.45 则仍默认使用 RakNet。Mojang 已表示将移除 RakNet，但 BDS 1.26.60 至 1.26.63.1 仍予以保留。由于 bedrock-protocol 对 RakNet 的支持已相当成熟，除非另行指定，bedboo 默认通过 RakNet 连接。若要使用 NetherNet，请以 `transport=nethernet` 启动 BDS，并在 `createBot` 中指定传输层：

```js
const bot = bedboo.createBot({ host: '127.0.0.1', port: 19132, username: 'Bot', transport: 'nethernet' })
```

- 信令通过**服务器端口上的 HTTP**（`POST http://<host>:<port>/v1/join/<id>`）传输，因此即使设置 `enable-lan-visibility=false` 也能正常工作，也可通过转发 `server-port`（TCP）端口来使用；建连后的媒体流则走 UDP（对应 BDS 的 `server-udp-ports`）。bedrock-protocol 的其他信令模式也会原样透传，但经过的测试较少：局域网发现（占用 UDP 7551，需开启 `enable-lan-visibility=true`）可通过 `nethernet: { signalling: 'lan' }` 启用；Xbox 信令则需配置 `nethernet: { signalling: 'services', networkId }` 并配合 `auth: 'microsoft'`。
- **服务器密钥。** BDS 会使用身份密钥对响应进行签名。由于明文 HTTP 无法验证该密钥的真实性，客户端默认接受任意密钥，信任级别与 RakNet 相同。你可以固定密钥以防范中间人冒充：`nethernet: { serverKey: 'sha256:<hex>' }`；也可以使用 `nethernet: { onServerKey: (fingerprint, url) => true | false }` 自行校验（回调参数会提供可用于固定的指纹）。若使用 HTTPS 信令 URL（`nethernet: { url: 'https://…' }`），则直接由 TLS 提供信任保障。
- 机器人的 API 在两种传输层下完全一致。详情请参见[连接与版本](../reference/differences/connection.md#transport)。

## 故障排查 {#troubleshooting}

| 现象 | 原因 |
|---|---|
| `Connect timed out` | 主机或端口错误、服务器的 `transport` 与机器人不一致，或防火墙拦截了 UDP（RakNet）/ TCP（NetherNet 信令） |
| 登录后立即被 `kicked` | 开启了 `allow-list=true` 但机器人不在 `allowlist.json` 中，或开启了 `online-mode=true` 却使用 `auth: 'offline'`（具体原因见 `reason`） |
| 因客户端 / 服务器版本过旧被踢出 | 服务器的协议族与机器人的 `version` 不匹配（参见[其他版本](#versions)） |
| RakNet 后端加载失败 | 系统不是 x64 架构，或在工作区之外安装了依赖（缺少 raknet-native 补丁） |
| 命令被拒绝 | 需在控制台赋予机器人 op 权限，并开启作弊（`allow-cheats=true`） |
| NetherNet：`Untrusted Nethernet server key` | 固定的 `serverKey` 与服务器密钥不匹配（或 `onServerKey` 返回了 false） |
| NetherNet：`fetch failed`（`ECONNREFUSED`） | 服务器运行的是 RakNet，或 BDS 未能启动 TCP 信令监听（此时日志中没有 `Accepting clients on …`，说明端口被其他进程占用） |

更多值得注意的 BDS 行为（如加入流程、区块加载、控制台输出）均汇总在 [BDS 笔记](../reference/bds.md)中。
