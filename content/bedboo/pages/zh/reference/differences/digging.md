# 挖掘与放置

本页说明 `bot.dig`、`bot.placeBlock`、`bot.placeEntity` 以及对方块使用物品在 Bedrock 上的工作方式——在 Bedrock 中，
方块的破坏和放置都由服务器自行完成。观测环境为 BDS 1.26.51.1（协议 2193，bedrock-protocol 3.60.1）。

## 服务器权威的方块破坏  {#protocol}

- **影响：** `bot.dig`、`bot.stopDigging`、`diggingCompleted`、`diggingAborted`、`bot.targetDigBlock`
- **Java：** 客户端发送 `block_dig` 开始（status 0），自行等待 `digTime` 毫秒，再发送完成（status 2）并在本地将方块设为空气；
  取消则为 status 1。
- **Bedrock：** BDS 上 `start_game.server_authoritative_block_breaking` 为 true。方块操作随
  `player_auth_input.block_action` 发送（每 tick 一个输入）。实测行为如下：
  - `start_break` = 在方块上按下鼠标。从这个输入开始，BDS 每 tick 自行累加破坏进度——**开始的那个 tick 也算**——依据的是
    它自己记录的手持物品、状态效果、是否着地以及眼睛是否在水中的状态；只要**保持破坏状态**，它就会在进度达到 1 的那个输入中
    破坏方块（即含开始输入在内的第 `ceil(1/speed)` 个输入），无需任何其他操作。它会向所有观察者报告速度（先发
    `level_event block_start_break`，随后每 tick 发一个 `block_break_speed`，data = 每 tick 进度 × 65535，向下取整），
    以 `update_block`（空气）+ `particle_destroy` 报告破坏完成，接着生成掉落物（`add_item_entity`）。
  - `predict_break`（客户端的“已经破坏”）从同一个输入起才会被接受；若早一个输入发送，BDS 会回发一个恢复该方块的
    `update_block`（若仍保持破坏状态，则会在下一 tick 破坏方块）。
  - `continue_break` 会让 BDS 重新开始破坏：每发送一次，它都会向所有观察者发送 `block_stop_break` + `block_start_break`
    （其他玩家看到的裂纹动画和 mineflayer 的 `blockBreakProgressObserved` 每 tick 都会重置）。`crack_break`
    会被接受，但不起任何作用。
  - `abort_break` 结束破坏，而 `stop_break` **不会**：一次破坏完成后，BDS 会继续“按住”该位置，并自动破坏随后放到那里的下一个
    方块（即使用 `/setblock` 放置也不例外）。
  - 面和视线方向都不做校验（无论点击哪个面、看向何处，只要距离在约 7 格以内都能破坏）。
  - 创造模式：仅发送 `start_break` 即可瞬间破坏（无掉落物）；仅发送 `player_action creative_player_destroy_block` 没有任何
    效果。
- **bedboo：** 在转向后的输入中发送 `start_break`，保持破坏期间不发送任何内容；当 BDS 自身的每 tick 进度报告
  （`block_break_speed`）显示还差一个 tick 完成时，再发送 `predict_break`——也就是说，当客户端与服务器同步运行时，恰好在 BDS
  完成破坏的那个输入中发送（实测为 BDS 接受的最早输入）；若服务器落后则会更晚，但绝不提前。仅靠客户端计数是不够的：在负载较高
  的主机上，BDS 会落后于客户端的输入计数并恢复方块。当 BDS 不发送进度报告时，bedboo 会使用自己的计数并预留一个 tick 的余量。
  - 以服务器的 `update_block`（空气；含水方块 / 冰则为液体）作为完成标志，随后发送 `abort_break` 释放破坏状态；携带该操作的输入
    发出后（≤ 1 tick），`dig` 才会结束，因此调用方接下来的任何操作——在该位置放置方块、继续挖掘——都会在释放状态之后才到达 BDS
    （实测：否则在收到更新后立即执行的 `/setblock` 会再次被 BDS 破坏）。
  - 创造模式和瞬间破坏（第一个 tick 进度 ≥ 1）：在同一个输入中一并发送 `start_break` + `predict_break`。
  - `stopDigging` / 新的挖掘 / 死亡 / 切换维度：发送 `abort_break`。
  - 当 BDS 报告的方块挖掘速度与本地估算不一致时，以前者替换后者，确保速度偏差绝不会导致客户端提前预测。
  - 保留上游每 350 ms 挥一次手（`animate`）的行为。
  - 旧式（非服务器权威）服务器：发送 `start_break`，每 tick 发送 `crack_break`，在 `digTime` 之后发送 `stop_break` + 一个
    `inventory_transaction` `break_block`，并像上游一样在本地预测方块被破坏。由于 BDS 始终采用服务器权威模式，无法用它测试这条路径。

## dig() 在服务器确认后完成  {#completion}

- **影响：** `bot.dig`（promise 何时结束）、`diggingCompleted`、`bot.lastDigTime`
- **Java：** 客户端自身的 `digTime` 计时器触发时，promise 即 resolve（本地将方块设为空气）。
- **Bedrock：** 方块由服务器破坏；客户端自行设为空气只是一种猜测，随时可能被服务器推翻。
- **bedboo：** `dig` 在收到服务器的 `update_block` 后才会 resolve（并以空气方块触发 `diggingCompleted`）：该更新在开始输入后的
  `digTime` − 1 tick + 往返延迟时到达（在本地 BDS 上对 848 次计时挖掘的实测结果：相对 `digTime` 中位数为 −21 ms，范围
  −75…+44 ms），而挖掘最多再晚一个 tick 随释放输入结束（见 [服务器权威的方块破坏](#protocol)）。
  - BDS 会在大约一个 tick 内多次发送被破坏方块的 `update_block`（包括破坏本身，以及对 `predict_break` / `abort_break` 的应答）：
    等待该位置“下一次更新”的代码应先放过这些更新。
  - “已破坏” = 空气、液体（含水方块、海带、珊瑚扇和冰会留下水；灵魂沙 / 岩浆块上方的气泡柱），或少了一个蛋的海龟蛋。
  - 如果在 `predict_break` 之后 40 tick 内服务器没有任何破坏该方块的迹象（既无更新也无速度报告——仍在破坏时 BDS 每
    tick 都会报告速度；例如冒险模式、受保护的方块或教育版方块），则像 `stopDigging` 一样中止挖掘（触发 `diggingAborted`，
    reject 信息为 `Digging aborted: the server did not break <name> at <pos>`）；而上游在这种情况下仍会 resolve。
  - 断开连接也会使正在进行的挖掘 reject（`Digging aborted: the connection ended`；上游的计时器则会让它 resolve）。
  - `bot._bedrock.digging`（内部）保存最近几次挖掘的诊断信息（开始 / 结束时间、tick 数、BDS 报告的速度、恢复次数）。

## 挖掘速度：Bedrock 的状态效果系数  {#dig-speed}

- **影响：** `bot.digTime`，以及被 mineflayer-pathfinder / mineflayer-tool 直接调用的 `block.digTime(...)`
  （prismarine-block）
- **Java：** 急迫和潮涌能量将速度乘以 `1 + 0.2 × level`；挖掘疲劳乘以 0.3 / 0.09 / 0.0027 / 0.00081（等级 1–4+）。
- **Bedrock（实测，`level_event` 数据）：** 急迫 / 潮涌能量（取较高等级）乘以 `(1 + 0.2 × level) × 1.2^level`
  （I 1.44、II 2.016、III 2.7648、V 4.9766）；挖掘疲劳乘以 `0.21^level`（= 0.3^level × 0.7^level：I 0.21、
  II 0.0441、III 0.0093、IV 0.0019、V 0.0004）。其余部分与 Java 公式完全一致，并已在 BDS 上验证：各材质的工具倍率（来自
  Bedrock 数据，包括金 12 和铜 5）、无法采集的工具其等级仍能提速（如木镐挖铁矿石）、效率 `level² + 1` 仅在工具倍率大于 1 时
  生效、头盔上的水下速掘、眼睛在水中 ÷5、不在地面 ÷5（两者同时：÷25）、`canHarvest ? 30 : 100`、硬度 0 = 瞬间破坏
  （BDS 报告 65535 = 1.0）、`ceil(1/speed)` 个 tick。
- **bedboo：** `bot.digTime` 使用 `lib/bedrock/dig_speed.js`（结构与 prismarine-block 的 `digTime` 相同，但采用 Bedrock
  的效果系数；没有这些效果时，所有方块 × 工具 × 水中 / 空中 / 附魔组合的计算结果均与 prismarine-block 一致）。
  prismarine-block 自身的 `block.digTime` 保留了 Java 的效果系数（未打补丁）：在急迫或挖掘疲劳状态下直接调用它的插件，其成本估算会相差
  这些系数（但挖掘本身是准确的，因为它会等待服务器确认）。打过补丁的 mineflayer-pathfinder 和 mineflayer-tool 已改用
  `bot._bedrock.digging.blockDigTime`（见 [mineflayer-pathfinder](plugins.md#pathfinder)、
  [mineflayer-tool](plugins.md#tool)）。对于所有可挖掘方块，BDS 报告的速度均等于 `bot.digTime`。

## 创造模式：剑、三叉戟和重锤不能破坏方块  {#creative-weapons}

- **影响：** 创造模式下的 `bot.digTime`、`bot.dig`
- **Java：** 创造模式下所有方块的 `digTime` 均为 0（Java 创造模式玩家同样不能用剑破坏方块；上游忽略了这一点，服务器会恢复
  方块）。
- **Bedrock（实测）：** 创造模式玩家手持任意剑、三叉戟或重锤破坏方块时，BDS 会恢复方块；手持长矛、工具、其他物品或空手则都能
  瞬间破坏。
- **bedboo：** 在创造模式下手持这些物品时，`digTime` 为 `Infinity`，因此 `dig` 会立即以上游的
  `dig time for <name> is Infinity` reject，而不会等待服务器。

## 眼部水体包括含水方块  {#eye-water}

- **影响：** `bot.digTime`、`bot._getBlockAtEyeLevel`（未改动）
- **Java：** 当眼部方块是 `water` / `flowing_water` 时，上游判定眼睛在水下。
- **Bedrock：** 水也可能位于方块的第二层（含水方块、海带、海草）。
- **bedboo：** 眼部方块为 `water`、`flowing_water` 或第 1 层为水的方块（`block.isWaterlogged`）时，判定眼睛在水下。不使用
  `bot.entity.isInWater`（与上游相同）。眼睛在水下时挖掘耗时为 5 倍，与 BDS 的计算结果一致。

## 'auto' 挖掘面  {#dig-face}

- **影响：** `bot.targetDigFace`、方块操作附带的面
- **Java：** `digFace` 为 'auto' 时，`dig(block)` 会看向方块中心并发送面 1（顶面）。
- **Bedrock：** BDS 不校验面，但原版客户端发送的是准星指向的面，这个面决定了其他玩家看到的敲击粒子。
- **bedboo：** 'auto'（带转向）使用从眼睛到方块中心的视线穿入方块时的那个面（例如 bot 与方块同高且位于其西侧时为
  4 = 西）。面向量、'raycast' 和 `forceLook: 'ignore'`（面 1）沿用上游逻辑。

## 工具耐久  {#durability}

- **影响：** 挖掘后 `bot.heldItem` 的耐久、`heldItemChanged`
- **Java：** 服务器扣减工具耐久并发送 `set_slot`。
- **Bedrock：** 原版客户端会在 `predict_break` 中附带一个 `item_stack_request` `mine_block` { 快捷栏槽位、预测耐久、
  stack id }；BDS 只在破坏完成的那个输入中接受该请求（晚一个输入就会回复 `status: error`），随后在响应的
  `durability_correction` 中报告耐久，而不发送槽位。若没有这个请求，BDS 会自行扣减工具耐久，并发送带有新 `Damage` 的
  `inventory_slot`。
- **bedboo：** 不发送 `mine_block` 请求（只有在与服务器同步运行时，预测才会落在破坏完成的那个输入中，见
  [服务器权威的方块破坏](#protocol)）；物品栏模型直接应用服务器发来的 `inventory_slot`（每个方块 Damage +1，耐久耗尽时工具消失，
  `heldItemChanged` 与 Java 的 `set_slot` 一致）。

## 挖掘空气  {#dig-air}

- **影响：** `bot.dig(air)`、`bot.digTime(air)`、`registry.blocksByName.air.hardness`
- **Java：** 空气硬度为 0：`digTime` 为 0，`dig` 立即 resolve 并触发 `diggingCompleted`。
- **Bedrock：** minecraft-data PR #1335 和 BDS 自行导出的方块数据都将空气硬度设为 -1（不可破坏）。
- **bedboo：** 数据覆盖层将空气硬度设为 0（`packages/bedrock-data/scripts/tables.js` `BLOCK_FIXES`），因此
  `digTime(air)` 与上游一样为 0。对世界中为空气的方块执行 `bot.dig`（包括已消失方块的过期 Block 对象——例如门的
  另一半）会立即以 `diggingCompleted(air)` 完成，不发送任何数据（BDS 从不报告破坏空气）。若过期的空气 Block 所在位置现在
  已有方块，则正常挖掘。

## 无法布置或挖掘的方块  {#dig-everything}

- **影响：** 整个方块注册表范围内的 `bot.dig`、`bot.digTime`
- **Java：** 每种可挖掘的 Java 方块都可以放置并挖掘（少数除外）。
- **Bedrock：** 注册表中有 1,442 种可挖掘方块。在 BDS 1.26.51.1 上，其中约 230 种无法放入生存模式的测试世界，或永远无法被
  破坏：
  - `/setblock` 拒绝的 id：教育版的 `element_*`、化合物和硬化玻璃，`unknown` / `info_update` / `reserved6` 等内部 id，
    以及 BDS 1.26.51.1 不识别的 `*_concrete_double_slab` / `*_wool_double_slab` 状态；
  - 设置后无法留在原处的方块（珊瑚壁扇、绊线钩、灵魂火、气泡柱……）；
  - `frosted_ice`（挖掘过程中会融化）；
  - 教育版的 `allow` / `deny` / `border_block`（BDS 在生存模式下从不破坏它们）。

  默认朝下的附着类方块（按钮、物品展示框、旗帜、拉杆）只有设置在地面上（`facing_direction` 1）或墙上时才能留存。挖掘后
  “消失” = 空气或液体（冰、海带、海草、珊瑚扇和海泡菜会留下水）。
- **bedboo：** 其余每种方块均已在生存模式下，用下列最快工具完成挖掘测试：下界合金镐 / 斧 / 锹 / 锄和剪刀（效率 V）、下界合金剑
  以及空手。BDS 报告的速度均等于 `bot.digTime`，且 BDS 从未恢复过被挖掘的方块。

## 瞬间破坏之后的进度报告  {#instant-break-report}

- **影响：** `bot._bedrock.digging.last.serverSpeedData`（诊断信息）
- **Java：** 无对应情况（客户端自行计算挖掘时间）。
- **Bedrock：** 瞬间破坏之后，BDS 可能会报告替代该方块之物的破坏进度（水源中的植物被破坏后留下的水，例如
  `short_dry_grass`）——有时会出现在破坏本身的 `update_block` 之前的那批数据包中。
- **bedboo：** 瞬间破坏（开始和预测在同一个输入中）只将瞬间级别的报告（每 tick ≥ 1：被挖方块自身的报告）作为服务器速度；
  更慢的报告只算作服务器活动。

## 放置协议：用 start/stop_item_use_on 包裹的 click_block  {#placement-protocol}

- **影响：** `bot._genericPlace`、`bot.placeBlock`、`bot._placeBlockWithOptions`、`bot.placeEntity`、`blockPlaced`
- **Java：** 发送 `block_place`（位置、方向、手、光标位置）；无论是否成功放置，服务器都会先针对被点击的方块、再针对目标位置的方块
  回复 `block_change`。
- **Bedrock：** 与原版客户端一样，点击方块的一个面依次发送：`player_action start_item_use_on`（被点击方块、被点击方块 + 面、
  面）→ `inventory_transaction item_use click_block`（手持物品在服务器上的精确副本，包括其 stack id、被点击方块的
  runtime id、面上的点击点、面、快捷栏槽位、手、位于眼睛高度的玩家位置、预测 `success`）→ 150 ms 后的
  `player_action stop_item_use_on`（被点击方块 + 面）。实测应答（本地约 80–120 ms）：先更新物品栏（所有窗口的
  `inventory_content`：使用后的数量、耐久或新的 stack id），随后是一连串 `update_block`——依次为被点击方块、目标位置的方块、被点击方块
  的下方相邻方块、再次是目标位置的方块、它的上方相邻方块、再次是被点击方块——约 20 ms 后目标位置再更新一次，并带有 `place` 音效。
  放置被拒绝时（有实体阻挡、玩家自身的碰撞箱、物品不是方块、超出世界范围），会收到同样顺序的更新，但目标位置保持不变（外加一个
  `set_entity_data` 重同步），物品栏也不变。
- **bedboo：** `bot.placeBlock` / `bot._placeBlockWithOptions` 直接采用上游代码（原样内置）；`bot._genericPlace` /
  `bot.placeEntity` 保留上游的检查、选项、转向和事件。由于应答的形式与 Java 相同（先更新参考方块，再更新目标位置），上游的
  `place_block.js` 及其错误信息均无需修改（`Server refused to place <item> at <pos>: the block is still <name>`、
  `Server did not answer the placement at …`、`must be holding an item to place`）。点击操作一加入队列，`_genericPlace` 就立即
  resolve（上游：紧接在 `block_place` 之后）；前一次点击的 stop 保证在下一次点击的 start 之前发送（成对的操作不会交错）。
  与上游一样，客户端不预测放置结果：方块随服务器的更新包出现。

## 对可交互方块潜行放置  {#sneak-placing}

- **影响：** `bot._genericPlace` 以及基于它的一切（`placeBlock`、`placeEntity`；mineflayer-pathfinder）
- **Java：** mineflayer 不会向服务器发送潜行状态（见 `generic_place.js` 中的 “TODO”）；mineflayer-pathfinder 会根据自带的
  `interactable.json`（Java 名称）自行按下潜行。
- **Bedrock：** 除非玩家处于潜行状态，否则 BDS 会执行被点击方块的使用动作（打开箱子 / 工作台 / 熔炉、开关门、打开告示牌编辑器……）
  而不是放置方块；潜行按键随 `player_auth_input` 发送，服务器必须在处理点击之前先处理该输入（提前一个输入即可；收到
  `set_entity_data` 的 `sneaking` 即为确认）。飞行中的玩家永远不会进入 `sneaking` 状态，但输入中的原始潜行按键依然生效。
- **bedboo：** 当参考方块可交互时（由 `lib/bedrock/placement.js` 的 `isInteractive` 判定，采用 Bedrock 名称：容器、工作站、除铁质外的
  门 / 活板门 / 栅栏门、按钮、拉杆、中继器、比较器、告示牌、床、蛋糕、物品展示框……），`_genericPlace` 会按住潜行控制，
  等待它随一个输入发出（有 `bot._bedrock.physics.controlsSent()` 时使用它，否则等待下一个发出的输入）并得到服务器确认（飞行时
  不等待确认），随后执行点击，最后松开它自己按下的潜行（调用方原本按住的潜行会保留，例如 mineflayer-pathfinder 的）。骑乘时不按任何键
  （在 Bedrock 上潜行会下坐骑）。飞行时 bot 可能在那个 tick 内略微下降（潜行 = 下降）。这样在生存模式下可以将方块放置到箱子、
  工作台、熔炉、木门、站立告示牌或木桶的上面，在创造模式飞行中也可以对着箱子放置。

## 放置会等待服务器对上一次点击的应答  {#placement-serialization}

- **影响：** 同时或紧挨着调用多个 `bot.placeBlock`、`bot._placeBlockWithOptions`、`bot.placeEntity`，以及使用桶和船的
  `bot.activateItem`
- **Java：** `block_place` 不携带物品信息，进行中的放置不会相互失效。
- **Bedrock：** 每次点击都携带手持物品在服务器上的精确副本；每次使用后 BDS 都会给该堆叠分配新的 stack id（在
  `update_block` 应答之前的 `inventory_content` 中下发），并拒绝携带旧 id 的点击（实测：两次放置间隔 0–30 ms → 第二次被拒绝）。
- **bedboo：** 放置器（`lib/bedrock/placement.js`）会将点击串行化：下一次点击必须等待手持物品更新、被点击方块收到应答，或经过
  500 ms 后才发出。依次 await 的放置（例如 mineflayer-pathfinder）无需额外等待；对多个放置使用 `Promise.all` 会将它们
  全部放下。若在某次放置尚未收到应答时使用桶 / 船（`activateItem` → 所看向的方块），会保留其目标和快捷栏槽位，并在该次放置后
  发出。其他物品使用（`activateBlock`、`activateItem` 的 `click_air`）不串行化：若在放置后不 await 就立即发起，它们仍可能
  携带旧的 stack id。

## 带有过期方块状态的点击会重试  {#stale-click}

- **影响：** 对服务器刚刚改变过的方块执行 `bot.placeBlock` / `_placeBlockWithOptions`
- **Java：** `block_place` 不携带方块状态。
- **Bedrock：** 点击携带被点击方块的 runtime id，BDS 会拒绝状态 id 与服务器端不一致的点击。某些方块在相邻方块
  更新后要过一个 tick 才会被 BDS 改变（例如在耕地和土径上放置方块后，它们会在放置应答后的 50–90 ms 变成泥土），因此紧接着对它们的
  下一次点击会被拒绝。
- **bedboo：** 点击的应答会透露服务器上被点击方块的状态；若被拒绝的点击携带的是其他状态，就会用方块当前的状态重试一次
  （通过 `generic_place.js` 包装内置的 `place_block.js`）。其他拒绝与上游一样直接 reject。改变了被点击方块本身的点击绝不会被
  当作过期点击：对着可替换方块（`snow_layer`、`short_grass`、`fern`、`vine`、`seagrass`……）或可与手持物品合并的方块
  （同种半砖 → 双层半砖，再加一根蜡烛 / 一个海泡菜 / 一层雪 / 一片花瓣，或把蜡烛插到蛋糕上）点击时，BDS 会把方块放到被点击的
  位置，相邻的目标面方块保持不变——这与 Java 完全相同，因此调用会在一次点击后直接以上游的 `Server refused` reject（而不是再点一次，
  在其上方放下第二个方块）；消耗了物品的点击同样不会被当作过期点击。

## 手持堆叠在服务器上已变化的点击会重试  {#stale-held}

- **影响：** 在拾取物品、被给予物品（`/give`）或手持堆叠数量因其他原因增加期间执行的 `bot.placeBlock` /
  `_placeBlockWithOptions`（先挖后放的循环、mineflayer-pathfinder 的搭路）
- **Java：** `block_place` 不携带物品信息。
- **Bedrock：** 点击携带手持物品在服务器上的精确副本（即其 stack id）。若在点击发出到被处理之间，有拾取的物品合并进手持堆叠，该堆叠会
  先获得新的 stack id（先收到 `inventory_transaction` normal，再收到 `inventory_content`），导致 BDS 拒绝这次点击（实测：先挖后放的
  循环中 180 次放置会发生 4 次；在点击前刚执行 `/give` 则每次都会发生）。
- **bedboo：** 放置器会记录点击发出到收到应答之间，手持槽位在服务器端的变化（该槽位的 `inventory_transaction`，或堆叠数量增加）；
  由此导致的拒绝会用服务器的副本重试一次（此时客户端已拿到该副本）。其他拒绝与上游一样直接 reject。

## 垫高与搭桥（mineflayer-pathfinder 搭路）  {#scaffolding}

- **影响：** `bot._genericPlace`（跳跃放置）、mineflayer-pathfinder 的 `allow1by1towers` 和搭桥
- **Java：** pathfinder 跳起，脚一离地就在脚下调用 `placeBlock`；若点击被拒绝则重置路径（`place_error`）并重试。
- **Bedrock：** BDS 会拒绝与玩家服务器端碰撞箱相交的任何方块（实测：哪怕重叠 0.01 格也会被拒绝；方块绝不会被放进玩家体内，
  因此也不会把玩家挤出）。BDS 在处理点击前会先处理此前发出的玩家输入，所以点击必须跟在碰撞箱已离开目标位置的输入之后发出。
- **bedboo：** 当 bot 正从目标方块中升起，或持续跳跃（按住跳跃控制）时，点击会等待（≤ 20 个输入）碰撞箱离开该方块
  的第一个输入，并紧随其后发出；不会离开目标方块的 bot 则会立即点击，并像上游一样收到服务器的拒绝。实测结果（生存模式、有重力、本地 BDS）：
  - 手动垫高 ×4（脚一离地就放置）：0 次拒绝，0 次纠正；
  - pathfinder 垫高 ×5：0 次 `place_error`，0 次纠正（每格约 0.45 s，点击在脚离地后 2 tick 发出）；
  - 手动搭桥 ×4（潜行后退到边缘，对着下方方块的侧面放置）：0 次纠正；
  - pathfinder 搭桥 ×5–6：未打补丁时有 3–4 次 0.16–0.64 格的纠正，全部源于 pathfinder 自身的 `fullStop()`——它在客户端将
    `bot.entity.position` 移到了方块中心（在 Java 上“服务器察觉不到差别”；但服务器权威的 BDS 会察觉：它会把 bot 纠正回去，然后
    bot 继续走）。打过补丁的 pathfinder 会跳过这次居中：0 次纠正（见 [mineflayer-pathfinder](plugins.md#pathfinder)）。

  在天花板下垫高另有限制：见 [1×1 塔](plugins.md#towers)。

## 不能从副手放置  {#offhand-placing}

- **影响：** `bot._genericPlace` / `bot._placeBlockWithOptions` / `bot._placeEntityWithOptions` 的 `offhand` 选项
- **Java：** `hand: 1` 会放置副手物品。
- **Bedrock：** 副手只能放少数物品（盾牌、图腾、箭、烟花火箭、地图……，见 [副手](inventory.md#offhand)），玩家也从不用副手与方块
  交互；携带 `hand: off_hand` 和副手物品（或主手物品）点击不会放置任何东西（实测：用 `/replaceitem` 强行把方块放进副手后依然如此）。
- **bedboo：** 按原版客户端的方式发送点击（手设为 `off_hand`，携带副手的线上物品），服务器拒绝后，`placeBlock` 会以上游的拒绝信息
  reject；同时保留上游对空副手的检查。

## placeEntity  {#place-entity}

- **影响：** `bot.placeEntity`、`bot._placeEntityWithOptions`、`entityPlaced`
- **Java：** 点击方块（`block_place`）；放置船时还会额外发送 `use_item`（由服务器沿视线做射线检测）；在目标位置 2 格（船为 3 格）内按
  名称查找实体（`EnderCrystal` / `end_crystal`、`boat`、`armor_stand`、刷怪蛋对应的生物）；不支持矿车（断言
  'Unimplemented'）。
- **Bedrock：** 所有实体均通过点击方块放置：盔甲架、末影水晶（黑曜石 / 基岩）、刷怪蛋、矿车（放在铁轨上）和船（BDS 忽略船的
  `click_air`；原版客户端会点击所瞄准的水面，船也可以放在陆地上）。实体名称：`ender_crystal`、`boat` / `chest_boat`
  （运输船、竹筏）、`armor_stand`、`minecart` / `chest_minecart` / ……，刷怪蛋映射为 `villager` → `villager_v2`、
  `zombie_villager` → `zombie_villager_v2`、`evoker` → `evocation_illager`、`tropical_fish` → `tropicalfish`。和平模式下，
  敌对生物的刷怪蛋不会生成任何实体（但蛋仍会被消耗）。
- **bedboo：** 沿用上游代码，但有以下改动：
  - 参考方块为液体时，放置船会点击液体的顶面（无论传入哪个面，船都会在其上方居中生成；视线方向无关紧要，所以船永远不会落在
    bot 身上）；
  - 接受矿车（放在铁轨上），运输船也可以放在陆地上；
  - 使用上述 Bedrock 名称；
  - 上游在收到第一个 `entitySpawn` 后就会停止监听，哪怕生成的是其他实体（随后总是在 5 s 后超时）；这里会持续监听，直到所
    放置的实体生成或超时（'Failed to place entity'，未改动）。

## 对方块使用物品：桶、打火石、骨粉、烟花  {#item-use-on-blocks}

- **影响：** 使用这些物品时的 `bot.placeBlock` / `bot.activateBlock` / `bot.activateItem`
- **Java：** `activateItem`（`use_item`）对玩家看向的方块使用桶或船（由服务器做射线检测）；手持桶、打火石或骨粉调用
  `placeBlock` / `activateBlock` 会作用于被点击的方块。
- **Bedrock：** BDS 会忽略桶和船的 `click_air`（实测：什么也不发生）；原版客户端会点击所看向的方块（`click_block`：空桶点击
  液体源本身，装满的桶点击液体后面的实心方块，液体会出现在点击面的另一侧）。用打火石发送 `click_block` 会点火（黑曜石框架变成
  `portal` 方块），用骨粉会催熟被点击的植物，对方块使用烟花火箭会将其发射；与 Java 一样，未滑翔时在空中使用火箭没有效果。
- **bedboo：** 手持水桶 / 岩浆桶调用 `placeBlock` 会以 `blockPlaced(air, water|lava)` resolve，手持打火石时会以
  `blockPlaced(air, fire|portal)` resolve；手持空桶执行 `activateBlock(<液体源>)` 会装满桶。手持桶或船调用 `bot.activateItem`
  会调用 `bot._bedrock.placement.useOnLookedAtBlock(item, offHand)`，这正是此类操作在 Bedrock 上的实现方式：沿视线做射线检测
  （在物品可作用的地方包括液体），然后点击。其他物品使用见 [物品使用、进食与盾牌](inventory.md#item-use)。
