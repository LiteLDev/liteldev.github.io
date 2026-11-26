# 基岩版差异

bedboo 的行为与 mineflayer 一致，唯一的区别源于 Java 版与基岩版的固有差异——受基岩版协议、数据或游戏规则所限而无法实现，或表现不同的地方。本节各主题页逐条记录了这些差异（mineflayer 在 Java 版上的做法、基岩版的做法，以及 bedboo 的处理方式）。所有结论均基于 BDS 1.26.51.1（protocol 2193，默认版本）实测得出；其他受支持版本的差异详见各[版本页面](../versions/index.md)。

| 页面 | 涵盖内容 |
|---|---|
| [连接与版本](connection.md) | 版本、传输层、登录、生成、踢出、设置、维度 |
| [名称、id 与数据](data.md) | 基岩版注册表、方块状态、线上传输的物品、数据来源 |
| [世界与方块](world.md) | 含水、方块变体、时间、天气、游戏规则、告示牌、爆炸 |
| [玩家状态与生存](survival.md) | 重生、维度切换、经验、能力、床、钓鱼、书 |
| [聊天、命令与 HUD](chat.md) | 聊天、命令、标题、Boss 栏、计分板、声音、粒子、队伍 |
| [实体与玩家](entities.md) | 实体 ID、元数据、玩家列表、受伤与死亡、战斗、载具 |
| [移动与物理](movement.md) | 移动引擎、服务端纠正、视角、疾跑、飞行、鞘翅 |
| [物品栏与窗口](inventory.md) | 物品堆叠请求、窗口、重新同步、副手、创造模式物品栏 |
| [合成与工作站](crafting.md) | 配方、合成、熔炉、附魔、铁砧、交易 |
| [挖掘与放置](digging.md) | 服务端权威的方块破坏、挖掘速度、放置 |
| [生态插件补丁](plugins.md) | 每个插件补丁改了什么、为什么改 |
| [BeDD 模式](bedd.md) | `transport: 'bedd'`，由 Be.D.D. 托管的真实客户端 |

## 概要 {#in-short}

以下是机器人开发者可能会注意到的差异。未列出的行为均与 Java 版上的 mineflayer 一致。

**连接与版本**
- 基岩版版本按协议族划分：`bot.version` 为 `'1.26.40'`、`'1.26.45'`、`'1.26.51'`（默认）或 `'1.26.60'`，对应 BDS 1.26.42.1 至 1.26.63.1（[支持的版本](../versions/index.md)、[版本](connection.md#versions)）。默认使用 RakNet，也可按需使用 NetherNet（[传输层](connection.md#transport)）。
- 登录前不会触发 `connect`，该事件在发送登录数据包时才触发（[客户端](connection.md#client)）；`kicked` 的原因是基岩版的断开消息或原因代码（[踢出原因](connection.md#kick-reason)）。
- `bot.game.serverBrand` 固定为 `'vanilla'`（[服务器品牌](connection.md#server-brand)）；`bot.game.maxPlayers` 为 undefined（[最大玩家数](connection.md#max-players)）；`bot.settings` 中只有视距会发往服务器（[设置](connection.md#settings)）。

**名称、ID 与数据**
- `bot.registry` 是机器人对应版本的基岩版注册表，包含基岩版的方块、物品、实体、状态效果、生物群系和附魔的名称与 ID（如 `grass_block`、`oak_log`、`villager_v2` 等）（[注册表](data.md#registry)）。配方由服务器下发（[配方](crafting.md#recipes)），物品标签则来自 pmmp/BedrockData（[物品标签](data.md#item-tags)）。
- `block.stateId` 是 `registry.blockStates` 中的索引，而非网络运行时 ID（后者在基岩版中是一个哈希值）（[状态 ID](data.md#state-ids)）。
- 实体：`entity.id` 是数值型的运行时 ID，`entity.uniqueId` 和 `entity.runtimeId` 则是 BigInt（[实体 ID](entities.md#entity-ids)）；`entity.metadata` 以基岩版元数据名称为键（如 `flags`、`variant`、`boundingbox_width` 等）（[元数据](entities.md#metadata)）；玩家没有 `skinData`（[皮肤](entities.md#skin-data)）。

**世界**
- 含水方块：`blockAt()` 返回方块本身，水层信息保存在 `block.superimposed` 和 `block.isWaterlogged` 中（[含水](world.md#waterlogging)）。
- 燃烧中的熔炉是独立的方块（`lit_furnace`）；`bot.bedrock.blockVariants()` 可以同时匹配这两种状态（[方块变体](world.md#block-variants)）。
- `bot.time` 源自基岩版的世界时钟（[世界时间](world.md#world-time)）；游戏规则保存在 `bot.bedrock.gameRules` 中（[游戏规则](world.md#game-rules)）。

**聊天、命令、HUD**
- `bot.chat('/…')` 发送命令请求，命令输出通过 `message` 事件按行返回（[命令](chat.md#commands)）。在 BDS 上，玩家无法给自己 `/op`（[op](chat.md#op-command)）。
- `bot.tabComplete` 根据服务器下发的命令列表在客户端完成补全（[Tab 补全](chat.md#tab-complete)）。
- 没有队伍系统（`bot.teams` 始终为 `{}`），也没有 Tab 列表的页眉和页脚（[没有队伍](chat.md#no-teams)、[没有页眉](chat.md#no-tablist-header)）；Boss 栏仅针对实际的 Boss 实体存在（[Boss 栏](chat.md#boss-bars)）。

**移动**
- 移动由服务端权威控制：机器人每 tick 发送一次 `player_auth_input`，由服务器负责纠正；一旦发生纠正，客户端会回退状态并重放此后的输入（[纠正](movement.md#corrections)）。`look()` 会在下一次输入时直接生效，不会平滑转动视角（[视角](movement.md#look)）。
- 潜行和疾跑状态的变化会在下一 tick 发送，因此紧跟在 `setControlState('sneak')` 之后的点击操作会等待该状态生效（[点击前的控制状态](movement.md#controls-before-clicks)）。只要按住 `forward`，疾跑就会一直保持（[粘滞疾跑](movement.md#sticky-sprint)）。

**实体与战斗**
- `entityHurt(entity)` 不包含伤害来源实体（[受伤与死亡](entities.md#hurt-death)、[伤害来源](entities.md#hurt-source)）；`entityHandSwap` 永远不会触发（[交换手中物品](entities.md#hand-swap)）。
- `bot.attack()` 不会改变机器人的朝向（与上游一致）；基岩版没有攻击冷却，受击生物有 10 tick 的无敌时间（[战斗](entities.md#combat)）。

**物品栏与窗口**
- 物品栏由服务端权威控制：`clickWindow` 及基于它的所有操作（`equip`、`transfer`、`craft` 等）都会转换为物品堆叠请求，其结果与报错行为均与 Java 版一致（[点击窗口](inventory.md#click-window)）。
- `bot.creative.setInventorySlot` 只能创建服务器创造模式物品目录中已有的物品，不支持任意自定义 NBT（[创造模式](inventory.md#creative)）。副手槽位只能放入允许副手装备的物品（[副手](inventory.md#offhand)）。
- 潜行即举盾（调用 `activateItem` 也会举起盾牌）（[物品使用](inventory.md#item-use)）；窗口统一映射为 Java 版的窗口类型（[窗口类型](inventory.md#window-types)）。

**挖掘与放置**
- 方块破坏由服务端权威控制：`dig()` 会在收到服务器确认后完成，挖掘耗时按基岩版的状态效果系数计算（[协议](digging.md#protocol)、[挖掘速度](digging.md#dig-speed)）。创造模式下，持剑、三叉戟和重锤无法破坏方块（[创造模式武器](digging.md#creative-weapons)）。
- 不支持用副手放置方块（[副手放置](digging.md#offhand-placing)）；对着可交互方块放置方块时会自动潜行（[潜行放置](digging.md#sneak-placing)）。

**工作站与生存**
- 熔炉、附魔台、铁砧和村民交易在底层通过基岩版请求实现，对外仍沿用 mineflayer 的窗口 API（[熔炉](crafting.md#furnace)、[附魔](crafting.md#enchanting)、[铁砧](crafting.md#anvil)、[交易](crafting.md#trading)）；钓鱼、书、床和骑乘的用法与上游一致，底层则改用基岩版数据包（[钓鱼](survival.md#fishing)、[书](survival.md#books)、[床](survival.md#beds)、[骑乘](movement.md#riding-control)）。
- 重生、维度切换和末地制作人员名单遵循基岩版的握手流程，并正常触发 mineflayer 的对应事件（[重生](survival.md#respawn)、[维度切换](survival.md#dimension-change)）；创造模式下的玩家不会死亡（[创造模式死亡](survival.md#creative-death)）。
