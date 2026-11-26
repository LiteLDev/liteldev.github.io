# 世界与方块

本文说明 bedboo 如何让世界模型（`bot.blockAt`、`blockUpdate`）与 Bedrock 的方块层及方块更新保持同步，以及世界状态（时间、天气、游戏规则）、告示牌、命令方块、方块动作和传送门的差异。观察环境为 BDS 1.26.51.1（protocol 2193）。

## 含水方块（方块层 1）  {#waterlogging}

- **影响：** `bot.blockAt`、`blockUpdate`、`bot.world`。
- **Java：** `waterlogged=true` 方块状态。
- **Bedrock：** 使用第二个方块存储层：层 0 为方块，层 1 为液体（`update_block.layer`、`update_subchunk_blocks.extra`、双层子区块）。
- **bedboo：** `blockAt()` 返回层 0 的方块；若层 1 有水，该方块会附带 `block.superimposed`（层 1 的 Block）、`block.computedStates.waterlogged = true` 和 `block.isWaterlogged = true`（prismarine-chunk 的 Bedrock 表示方式；bedboo 的补丁只叠加非空气的层 1 条目）。层 1 的更新与层 0 一样触发 `blockUpdate`。当方块替换水或含水方块时，BDS 只发送层 0，此时液体层遵循 Bedrock 的规则（见[液体层](#liquid-layer)）。

## 被替换方块的液体层  {#liquid-layer}

- **影响：** `bot.blockAt(…).isWaterlogged` / `.superimposed` / `.computedStates.waterlogged`、`blockUpdate`、物理引擎中的水（会读取 `isWaterlogged`）。
- **Java：** `waterlogged` 是方块状态，每次方块更新都会携带。
- **Bedrock：** 含水状态位于方块层 1。当方块替换水源或含水方块时，BDS 只发送层 0 的变化（层 0 的 `update_block`，或 `extra` 为空的 `update_subchunk_blocks`），液体层规则由客户端自行应用。实测观察（以重新加入后的结果为准）：放入水源中的栅栏、梯子、台阶、地毯或墙会含水；含水栅栏被台阶 / 地毯 / 墙替换后依然含水，被石头 / 玻璃替换后变干，被空气或水替换后则变为普通的水；流动的水（非水源）和岩浆永远不会进入层 1。Bedrock 的"可容纳液体"方块集合与 Java 的 `waterlogged` 方块不同（例如地毯可以含水），且客户端数据中没有列出这一集合。
- **bedboo：** 层 0 更新后的新方块若为空气或液体，则清除层 1；同一方块变为另一状态（如活板门开关、海带生长）则保留原有的液体层；这两种情况是确定的。对于其他任何替换水源或含水方块的情况，会先做预测（完整方块为干，其他方块保留 / 吸收水；单次 `blockUpdate` 同时包含两层），再向服务器确认：机器人重新请求该子区块（每个子区块同一时间最多只有一个 `subchunk_request`，5 s 无响应则重发，最多 3 次），并对这些方块应用服务器的层 1 数据（预测错误的位置会再触发一次 `blockUpdate`；在此期间层 0 再次变化的方块交由其自身的更新处理，而在请求发出期间发生变化的方块则会重新请求）。

## 下落的方块（`update_block_synced`）  {#falling-blocks}

- **影响：** `bot.blockAt`、`blockUpdate` / `blockUpdate:(x, y, z)`、`bot.world`，以及所有读取它们的代码（物理、挖掘、mineflayer-pathfinder）。
- **Java：** 方块开始下落时，`block_update` 将其变为空气（下落中的方块作为实体存在），落地时再设置到落点位置。
- **Bedrock：** 沙砾、沙子、混凝土粉末、铁砧等方块的起落都只通过 `update_block_synced` 发送，从不使用 `update_block`：起始位置以 `transition_type: 'create'` 变为空气（随后发送 `add_entity minecraft:falling_block`），落点以 `'destroy'` 变为该方块（约 150 ms 后发送下落方块的 `remove_entity`）。悬空放置的方块（通过 `/setblock` 或放置操作）先以 `update_block` 到达，约 100 ms 后开始下落。`entity_unique_id` 是下落方块的 unique id，按无符号 varint64 写入（bedrock-protocol 按 zigzag64 读取，因此 -4294967288 会读成 9223372034707292164）。如果客户端忽略这些数据包，已下落的方块会留在空中，落地的方块也无法显示，最终导致机器人在客户端显示为空气的方块里被服务器判定为窒息。
- **bedboo：** 按 `update_block` 的方式同样处理 `update_block_synced`（层、runtime id → state id、[液体层规则](#liquid-layer)、方块实体），并触发 `blockUpdate` 事件：pathfinder 会重新规划路径，针对已下落方块的挖掘也会正常结束（与 Java 版中方块变为空气时的行为一致）。

## 燃烧中的熔炉等"点亮"方块是独立的方块  {#block-variants}

- **影响：** 对熔炉、高炉、烟熏炉、红石矿石、红石灯、红石火把、中继器、比较器、阳光探测器使用 `bot.findBlock` / `bot.findBlocks` / `bot.blockAt`；`bot.openFurnace`。
- **Java：** 同一个方块，附带 `lit` / `powered` / `inverted` 状态（如 `furnace[lit=true]`）；按方块 id 匹配即可找到所有状态。
- **Bedrock：** 拆分为两个各自拥有独立 id 的方块：`furnace` / `lit_furnace`、`blast_furnace` / `lit_blast_furnace`、`smoker` / `lit_smoker`、`redstone_ore` / `lit_redstone_ore`、`deepslate_redstone_ore` / `lit_deepslate_redstone_ore`、`redstone_lamp` / `lit_redstone_lamp`、`redstone_torch` / `unlit_redstone_torch`、`unpowered_repeater` / `powered_repeater`、`unpowered_comparator` / `powered_comparator`、`daylight_detector` / `daylight_detector_inverted`。正在燃烧的熔炉在熄灭前一直是 `lit_furnace`。
- **bedboo：** registry 保留 Bedrock 的原始方块定义（因此 `bot.findBlock({ matching: furnace.id })` 找不到燃烧中的熔炉）。`bot.bedrock.blockVariants(nameOrId)` 会返回同组的所有 id（例如 `blockVariants('furnace')` → `[furnace, lit_furnace]`；其他方块 → `[id]`），可直接传入 `matching`（见 [Bedrock 扩展](../api.md#bedrock-extras)）。`openFurnace` 接受点亮状态的方块（窗口类型和总烧炼时间取自未点亮方块）；方块点亮或熄灭时，熔炉窗口保持打开。

## 门的上半部分取下半部分的形状  {#door-halves}

- **影响：** `bot.blockAt(<门的上半部分>).shapes`、门口处的物理碰撞、mineflayer-pathfinder 穿门寻路。
- **Java：** 上下两半都带有 `open`、`facing` 和 `hinge` 状态。
- **Bedrock：** 开关状态和朝向存在下半部分，铰链位置存在上半部分；BDS 从不设置上半部分的 `open_bit`（在 1.26.51.1 上实测，并用 `testforblock` 核对过），原版客户端会结合上下两部分的数据来渲染整扇门。因此，直接按自身状态获取形状会导致已打开的门上半部分依然是关闭的门板：机器人在过门时会撞头（被服务器拉回修正），mineflayer-pathfinder 也无法找到穿过自己刚打开的门的回头路（报 NoPath，或在开启 `canDig` 时直接把门挖掉）。
- **bedboo：** `bot.blockAt()`（`lib/plugins/blocks.js`）让门的上下两半都使用组合后的状态来计算形状（取下半部分的开关状态和朝向，加上半部分的铰链）；`stateId` 和 `getProperties()` 则保留服务器的原始值（上半部分的 `open_bit` 仍为 0，请从下半部分读取）。

## 世界时间  {#world-time}

- **影响：** `bot.time.*`、`time` 事件。
- **Java：** 每 20 tick 发送一次 `update_time`（包含世界年龄 + 一天中的时间；26.1 起改为按维度的时钟）。
- **Bedrock：** 完全没有 set_time 数据包，而是使用 `sync_world_clocks` 中的 `minecraft:overworld` 世界时钟（`initialize_registry` 带有时间标记，执行 `/time set|add` 时以及日常偶尔会发送 `sync_state`）；昼夜循环由 `doDayLightCycle` 游戏规则控制；没有世界年龄。
- **bedboo：** `bot.time.time` 设为世界时钟（一天中的绝对时间，所有维度通用），派生字段与上游一致；`doDaylightCycle` 取自游戏规则（变化时触发 `time`）；`bigAge` / `age` 为服务器 tick（`start_game.current_tick` + 已流逝的 tick）。在两次同步之间，只要昼夜循环开启且时钟未暂停，时钟就会在本地推进，并像 Java 版的广播那样每 20 个物理 tick 触发一次 `time` 事件。`bot.time.clocks` 以名称为键保存 Bedrock 时钟（如 `overworld`），包含上游的 `{ id, totalTicks, partialTick, rate }` 以及 `name`、`paused`、`timeMarkers`。

## 天气等级  {#weather}

- **影响：** `bot.rainState`、`bot.thunderState`、`weatherUpdate`。
- **Java：** 通过 `game_state_change` 通知开始 / 停止下雨，以及服务器渐变期间的雨 / 雷暴等级变化。
- **Bedrock：** 通过 `level_event` 的 start_rain / stop_rain / start_thunder / stop_thunder 通知，携带*目标*等级 × 65535，由客户端在本地渐变。
  加入时，`start_game.rain_level` / `lightning_level` 携带当前（渐变中的）等级，之后不再发送 level_event。
- **bedboo：** `isRaining` / `rain` 与上游完全一致（过零判断，每次变化触发一个事件）；`rainState` / `thunderState` 为 level event 的
  目标等级（BDS 上为 0 或 1），加入时取 start_game 的等级；每个 level event 触发一次 `weatherUpdate`。

## 游戏规则  {#game-rules}

- **影响：** `bot.bedrock.gameRules`（[Bedrock 扩展](../api.md#bedrock-extras)）、`bot.game.enableRespawnScreen`。
- **Java：** 客户端不维护游戏规则状态（仅通过 game event 传递 reducedDebugInfo / 立即重生）。
- **Bedrock：** 所有游戏规则都通过 `start_game.gamerules` 和 `game_rules_changed` 发送。
- **bedboo：** `bot.bedrock.gameRules`（格式为 `{ [Bedrock name]: boolean | number }`，例如 `doDayLightCycle`、`keepInventory`）；
  `bot.game.enableRespawnScreen` 在加入时取自 `doImmediateRespawn`，与上游的 login 字段一致。

## 告示牌  {#signs}

- **影响：** `bot.updateSign`、`signOpen`、`block.signText`。
- **Java：** 发送 `open_sign_entity`；通过 `update_sign` 提交四行文本；服务器回显 `tile_entity_data`。
- **Bedrock：** 玩家放置告示牌或与未涂蜡的告示牌交互时发送 `open_sign { position, is_front }`；每次打开只能编辑一次。编辑操作会发送
  携带完整告示牌复合标签的 `block_entity_data`，其中的 `FrontText` / `BackText` 复合标签各含一个 `Text` 字符串（各行以 `\n` 连接）
  和样式字段。
- **bedboo：** `updateSign(block, text, back)` 保留上游的校验（4 行，45 个字符），发送该方块当前的告示牌复合标签并替换对应面的
  `Text`。已为 prismarine-block 的 Bedrock 告示牌辅助函数打补丁，改为读写 FrontText / BackText（`getSignText()` → `[front, back]`，
  与 Java 的双面告示牌一致；上游会读取顶层 `Text` 并抛出异常）。

## 命令方块  {#command-block}

- **影响：** `bot.setCommandBlock`。
- **Java：** 发送 `update_command_block`（模式、标志）；服务器回应 `advMode.setCommand.success`。
- **Bedrock：** 发送 `command_block_update`，使用模式名（`impulse` / `repeat` / `chain`；模式即方块本身：
  `repeating_command_block`、`chain_command_block`）、`needs_redstone`、`conditional`、`should_track_output`。BDS 不发送消息，
  而是返回更新后的方块实体（`Command`、`auto`、`conditionalMode`、`TrackOutput`），并会忽略超出玩家触及范围的命令方块更新。
- **bedboo：** 签名、选项和检查均相同（通过 `bot.game.gameMode` 检查创造模式）；模式 0 / 1 / 2 对应 chain / repeat / impulse，
  `alwaysActive` 对应 `!needs_redstone`。与上游一样接受非对象的 `options`（例如 `false`）。使用时应等待方块实体更新而非聊天消息，
  并将命令方块放在触及范围内。

## 爆炸伤害  {#explosion}

- **影响：** `bot.getExplosionDamages`。
- **Java：** 实体带有 `generic.armor` 属性；缺少该属性时上游返回 `null`（而非 rawDamages）。
- **Bedrock：** 网络协议中没有护甲属性。
- **bedboo：** 内置的上游插件同时接受 Java 资源名（`minecraft:armor` 等）以及 bedboo 为实体合成的护甲属性
  （[装备](entities.md#equipment)）；没有任何护甲属性的生物实体（玩家 / 怪物）按无护甲计算，而非返回 `null`。其余公式相同
  （Bedrock 的爆炸伤害遵循同一公式）。

## 方块动作  {#block-actions}

- **影响：** `noteHeard`、`pistonMove`、`chestLidMove`、`blockBreakProgressObserved`、`blockBreakProgressEnd`。
- **Java：** 发送 `block_action`（音符盒、活塞、带玩家数量的箱子）和 `block_break_animation`（阶段 0–9，带破坏者的实体 id）。
- **Bedrock：**
  - 音符盒：`block_event { type: instrument, data: pitch }`（使用 Bedrock 乐器 id，例如 6 代表 bell）；
  - 箱子：`block_event { type: change_state, data: open count }`，大箱子通过方块实体配对（`pairx` / `pairz`）；
  - 活塞不发送事件，其 `PistonArm` 方块实体的 NewState 依次为 0 → 1 → 2 → 3 → 0；活塞的 `facing_direction` 为 0 下、1 上、
    2 南、3 北、4 东、5 西；
  - 破坏：`level_event` 的 block_start_break / block_break_speed（每 tick 进度 × 65535）/ block_stop_break，不带破坏者和阶段，
    且同样会发给正在破坏的玩家本人。
- **bedboo：** `noteHeard(block, registry.instruments[type], pitch)`；`chestLidMove(block, count, block2)` 每次变化触发一次，
  block2 为配对的另一半；`pistonMove(block, 0 | 1, Java face index)` 在推 / 拉开始时触发；破坏进度在开始时为阶段 0，之后每当根据速度
  算出新阶段时触发一次 `blockBreakProgressObserved`，停止或方块变化时触发 `blockBreakProgressEnd`；实体取 8 格内最近的其他
  玩家（没有时为 undefined）；机器人自己正在挖掘的位置（`bot.targetDigBlock`）会被跳过。

## pitch / yaw 为 0 时的射线检测（修复上游 bug）  {#ray-trace}

- **影响：** `bot.blockAtEntityCursor`、`bot.blockAtCursor`、`bot.blockInSight`、`bot.entityAtCursor`。
- **Java：** 当实体的 pitch 或 yaw 恰好为 0 时，mineflayer 4.39.0 会返回 `null`（判断条件为 `!entity.pitch || !entity.yaw`），导致视线水平或
  朝北（默认朝向）时永远无法命中方块。
- **Bedrock：** 并非协议差异。
- **bedboo：** 内置插件仅在缺少 pitch / yaw 时返回 `null`，其余行为不变。

## 在玩家体内设置的末地传送门可能把玩家推出去  {#end-portal-push}

- **影响：** 在机器人位置执行 `/setblock … end_portal` 以将其送入末地。
- **Java：** 末地传送门方块没有碰撞箱，位于其中的实体会被传送。
- **Bedrock：** `end_portal` 有一个 0.25 高的碰撞箱。在玩家体内设置方块（`/setblock`）会让 BDS 将玩家推出该方块；如果这次推动
  在同一批 tick 中先于传送门检测生效，玩家就会被推到传送门旁边，导致传送无法触发（高负载下的网络抓包显示：`command_output` 成功后，随后
  `correct_player_move_prediction` 将玩家移开 0.8 格，30 s 内未收到 `change_dimension`）。
- **bedboo：** 库中无需修改。要可靠地进入末地，请将机器人脚下的方块替换为传送门，然后让机器人（停止创造飞行后）落到上面，就像
  玩家走进传送门一样。

## 末地传送门方块的碰撞  {#end-portal-shape}

- **影响：** 走进末地传送门。
- **Java：** 末地传送门方块没有碰撞箱，碰到即传送。
- **Bedrock：** 数据为 `end_portal` 定义了一个 0.25 高的碰撞箱（[会被推出](#end-portal-push)）；玩家一碰到该方块，BDS 就会传送玩家。
- **bedboo：** 库中无需处理。要进入要塞中的传送门，请从楼梯走上框架环，再朝环的中心走，直到维度切换。

## 长距离传送后的区块  {#chunk-after-teleport}

- **影响：** 传送后立即在机器人位置执行的命令（例如 `/setblock`）和方块变更。
- **Bedrock：** 传送到 16–128 格之外后，目标区块在服务器上可能尚未加载，此时在目标位置执行 `/setblock ~ ~ ~ portal` 会以
  `commands.setblock.outOfWorld` 失败，不会生成传送门。
- **bedboo：** 库中无需处理。操作目标区块前，请先等待 `bot.waitForChunksToLoad()`（服务器仅在加载区块后才会发送该数据）。

## 用命令放置的箱子  {#chest-pairing}

- **影响：** 用 `/setblock` 组成的大箱子、用 `/replaceitem` 填充容器。
- **Bedrock：** 若两个箱子朝向相同，且沿垂直于朝向的轴相邻，`/setblock` 会将它们合并成大箱子（默认朝北时沿 x
  轴合并）。容器槽位通过 `/replaceitem block <x y z> slot.container <n> <item> <count>` 填充。
- **bedboo：** 库中无需处理；通过这种方式放置的箱子，其窗口行为与手动放置的箱子相同。
