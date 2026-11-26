# 名称、id 与数据

本页介绍 Bedrock 版 `bot.registry` 包含的内容：方块、物品和实体的名称与 id、方块状态 id、数据集、特性表，以及 Bedrock 数据中缺失的内容。核对依据为 BDS 1.26.51.1（protocol 2193）、CloudburstMC/Data 的 `659ce1e2eee3a67045693f4fd5515c6ccf571953`（BDS 导出）以及一台在线服务器；数据的构建方式见 `packages/bedrock-data/NOTICE.md`。

## `bot.registry` 中的 Bedrock 方块、物品名称与 id  {#registry}

- **影响：** `bot.registry` / `require('minecraft-data')('bedrock_1.26.51')`，以及所有接受方块或物品名称 / id 的 API（`bot.blockAt().name`、`bot.findBlocks({ matching })`、`bot.inventory.items()[i].name`、配方等）。
- **Java：** Java 的名称和 id（`grass_block`、`oak_door`、`zombified_piglin` 等）。
- **Bedrock：** Bedrock 标识符：共 1,477 个方块、22,091 个方块状态、2,076 个物品（采用 minecraft-data PR #1335 的 1.26.51 数据，每个状态都对应 BDS 的 runtime id，每个物品的名称和 id 都对应 BDS 的 `item_registry`）。许多名称与 Java 相同，但也有差异（例如 Java 的 `oak_door` 在 Bedrock 中方块和物品都叫 `wooden_door`，此外还有 `noteblock`、`unpowered_repeater`，以及实体 `zombie_pigman`、`fishing_hook`、`fireworks_rocket` 等）。物品 id 即服务器的网络 id（方块物品的 id 可以为负数）。此外还有 Bedrock 独有的物品和方块（例如 `element_*`、`hard_*_stained_glass`、`unknown`）。
- **bedboo：** `bot.registry` 使用 Bedrock 的名称和 id；物品按服务器的 `item_registry` 重新建立索引（在原版 BDS 下保持不变）。硬编码了 Java 名称的代码需要改用 Bedrock 名称。部分在 Java 中带 `lit` / `powered` 状态的方块，在 Bedrock 中拆分为两个独立方块：见[方块变体](world.md#block-variants)。

## 方块状态 id 与网络 runtime id  {#state-ids}

- **影响：** `Block.stateId`、`registry.blocksByStateId`、`bot.world.setBlockStateId`，以及所有解码 `update_block` / 子区块或发送 `block_runtime_id` 的代码。
- **Java：** 网络上传输全局调色板 id，与 `block.stateId` 是同一组数字。
- **Bedrock：** 开启 `block_network_ids_are_hashes` 时（BDS 1.26.51 默认始终开启），网络上传输的是方块状态 NBT 的 32 位 FNV-1a 哈希（传输格式为有符号 int32，例如 stone = -2144268767）。
- **bedboo：** `block.stateId` 仍是 **`registry.blockStates` 中的顺序下标**，因此每个方块的状态与 Java 完全一样，都是连续的 `minStateId..maxStateId` 区间（mineflayer 的 `bed.js`、prismarine-block 的 metadata / shapes 以及 mineflayer-pathfinder 的 `Block.fromStateId(x.minStateId)` 均无需修改即可工作）。网络 runtime id 会通过 `registry.blocksByRuntimeId[runtimeId] → { stateId, ...block }` 和 `registry.runtimeIdByStateId[stateId]` 进行转换（两者均由 `registry.handleStartGame(start_game)` 构建），而 Block 的 `block.hash` 就是它的 runtime id。prismarine-chunk 在解码和编码子区块时会自行完成转换。这一设计有意区别于 prismarine-registry PR #57（该 PR 直接将 `stateId` 设为哈希值，且未定义 `minStateId`，会导致 pathfinder 失效）。`minecraft:unknown` 是唯一一个 runtime id 不等于其哈希的状态：BDS 为它保留了 `0xFFFFFFFE`（-2）。每个 `blockStates[i]` 的 `hash` 字段都直接携带自身的 runtime id（由生成器预先计算并校验），因此 `handleStartGame` 无需现场计算 22k 个状态的哈希。

## 未知的方块 runtime id 解码为 `minecraft:unknown`  {#unknown-runtime-ids}

- **影响：** 服务器发送数据集中不存在的方块状态时的区块解码（`bot.blockAt`、`bot.world`），例如来自 `start_game.block_properties` 的自定义或附加包方块。
- **Java：** 不适用（registry codec 由服务器发送）。
- **Bedrock：** 自定义方块与原版方块采用相同的哈希方式，但它们的状态不在 1.26.51 数据集中。
- **bedboo：** 子区块解码器从不抛出异常：未知的 runtime id 会映射为 `minecraft:unknown` 调色板条目（BDS 自身的占位方块，属于硬度为 0 的实心完整方块，因此物理引擎将其视为实心，寻路算法将其视为可挖掘），同时保留 `entry.runtimeId`，以便在重新编码时写回原 id。在线测试表明，原版 BDS（默认主世界、下界、末地）从未出现过未知状态。自定义方块暂未加入 registry。如果在调用 `registry.handleStartGame(start_game)` 之前解码网络区块，由于尚无 runtime id 映射，程序会直接抛出异常，而不是静默生成占位方块。

## 来自 BDS 的碰撞箱与摩擦系数  {#collision}

- **影响：** `block.shapes`（物理、寻路、`bot.canSeeBlock`）、`registry.blocksByName[x].friction`。
- **Java：** 使用 Java 的碰撞箱；滑度硬编码在 prismarine-physics 中。
- **Bedrock：** BDS 导出数据与 minecraft-data PR #1335 有 708 个状态存在差异：门的厚度为 0.1875（3/16，而 PR 中为 0.1825），嵌有末影之眼的 `end_portal_frame` 多出一个末影之眼的碰撞箱。各方块的摩擦系数为：冰 / 浮冰 / 霜冰 0.98，blue_ice 0.989，slime 0.8，**honey_block 0.8**，其余均为 0.6（air 和 `unknown` 为 0.899999）。
- **bedboo：** 碰撞箱数据取自 PR #1335，仅针对明确的白名单（`/_door$/`、`end_portal_frame`）采用 Cloudburst 的 `collisionShape`；若出现其他任何不一致，生成器都会报错退出。每个方块都包含 Bedrock 的 `friction` 字段（在 schema 中新增，供[物理引擎](movement.md#engine)读取）。门上下两半的形状见[门的上下半](world.md#door-halves)。

## 数据集  {#datasets}

- **影响：** `bot.registry.effects*`、`foods*`、`attributes*`、`enchantments*`、`entities*`、`biomes*`、`particles*`、
  `sounds*`，以及所有使用它们的地方（`bot.entity.effects`、auto-eat、prismarine-physics 的 `PlayerState`、`digTime`、
  `item.enchants`、`bot.entities[x].name`、粒子 / 声音事件）。
- **Java / Bedrock / bedboo：**
  - **effects：** 使用 Bedrock id（`mob_effect.effect_id`：Speed 1 … SlowFalling 27、BadOmen 28、HeroOfTheVillage 29
    （`village_hero`）、Darkness 30、TrialOmen 31、WindCharged 32、Weaving 33、Oozing 34、Infested 35、RaidOmen 36、
    BreathOfTheNautilus 37），并带有 minecraft-data 的 Java 风格 `name` / `displayName` / `type`，因此
    `effectsByName.JumpBoost` 等可以正常使用；`bedrockName` 是命令中的名字。Bedrock 独有：FatalPoison（25）。Java 独有
    （缺失）：Glowing、Luck、BadLuck、DolphinsGrace。id 已在 BDS 上用 `/effect` 验证。
  - **enchantments：** 使用 Bedrock id（minecraft-data bedrock 0..37 + wind_burst 38、density 39、breach 40、lunge 41，
    已用 `/enchant` 验证）；名称是 Java 的（`efficiency`、`binding_curse` 等）。Java 的 `sweeping_edge` 在 Bedrock 上不存在。
  - **attributes：** `resource` 是 Java 键（`bot.entity.attributes` 以它为键，prismarine-physics 读取
    `attributesByName.movementSpeed.resource`），`bedrockName` 是 `update_attributes` 中的名字：maxHealth ←
    `minecraft:health`（其 `max` 为最大生命值，`current` 为当前生命值），movementSpeed ← `minecraft:movement`（玩家默认 0.1），
    followRange、knockbackResistance、attackDamage、maxAbsorption ← `minecraft:absorption`、luck、jumpStrength ←
    `minecraft:horse.jump_strength`、spawnReinforcements ← `minecraft:zombie.spawn_reinforcements`。Bedrock 独有的条目
    （`resource` = Bedrock 名称）：underwaterMovement、lavaMovement、frictionModifier、bounciness、airDragModifier、
    playerHunger、playerSaturation、playerExhaustion、playerLevel、playerExperience。Java 独有的属性（armor、stepHeight、
    gravity 等）保留但没有 `bedrockName`；BDS 从不发送它们。本地玩家属性的上报方式见[自身元数据](entities.md#self-metadata)。
  - **foods：** 采用 minecraft-data 的 `foods` schema（Java 字段名），数据来自 BDS 物品组件 `minecraft:food`：
    `foodPoints` = nutrition，`saturation` = nutrition × modifier × 2，`saturationRatio` = modifier × 2，
    `effectiveQuality` = foodPoints + saturation；共 40 种食物，使用 Bedrock 物品 id。
  - **entities：** 137 个 BDS 标识符（Cloudburst `entity_identifiers.dat`）；`id` = `internalId` = Bedrock 的数字实体类型
    （player 257）。尺寸是 BDS 为召唤出的实体报告的包围盒（有几个与 Java 不同：zombie / skeleton 0.6×1.9、chicken 0.6×0.8
    等）；slime / magma cube 按尺寸 1 给出，shulker 为 1×1（BDS 对它报告的是默认 actor 包围盒）；教育版实体（agent、balloon、
    ice_bomb、tripod_camera）没有尺寸（0×0）。minecraft-data 中 Bedrock 独有的 `moving_block`、`item_frame`、
    `glow_item_frame`、`chalkboard` 已移除（它们在 BDS 上是方块 / 方块实体，不是实体标识符）。minecraft-data bedrock 1.21.80
    把 Java 独有的变体归到它们映射的标识符下（zombie：Zombie + Giant，llama：Llama + Trader Llama，arrow：Arrow +
    Spectral Arrow，evocation_illager：Evoker + Illusioner，另有 armor_stand 和 minecart 的占位行）；生成器取 Bedrock
    实体自己的那一行（`tables.ENTITY_DUPLICATES`；未列出的重复项会让生成失败），因此 `entitiesByName.zombie` 是 Zombie
    而不是 Giant。部分标识符沿用 minecraft-data 的占位显示名（即标识符本身：`npc`、`tnt`、`boat`、`egg`、`*_minecart` 等）。
  - **biomes：** 以区块生物群系调色板中携带的原版数字 id 为键（ocean 0、plains 1、river 7、hell 8、the_end 9、…
    soulsand_valley 178 … mangrove_swamp 191、cherry_grove 192、pale_garden 193、sulfur_caves 194、dappled_forest 195）：
    共 89 个生物群系，即 BDS 1.26.51 在 `biome_definition_list` 中发送的列表。minecraft-data 的 bedrock 1.21.60 列表
    （`bedrock_1.26.51` 原本继承的）按字母顺序编号（0 bamboo_jungle、1 bamboo_jungle_hills、plains 64），导致每个生物群系
    都解析错误（超平坦世界的 plains 变成了 bamboo_jungle_hills）。BDS 对所有原版生物群系发送 `biome_id` 65535（"vanilla
    id"），并按 id 顺序列出，因此客户端必须知道编号：id 取自 pmmp/BedrockData 的 `biome_id_map.json`（CC0），外加
    dappled_forest 195（1.26.50 新增），并对照 minecraft-data bedrock 1.20.0、BDS `biome_definition_list` 的顺序以及在线
    核对（每个用 `/locate biome` 找到的生物群系在区块中都是这个 id）。schema 与 minecraft-data 相同（`id`、`name`、
    `category`、`temperature`、`has_precipitation`、`dimension` overworld / nether / the_end、`displayName`、`color` =
    BDS 地图水体颜色，与 minecraft-data bedrock 1.21.60 一致，另加 `rainfall` 和 `depth`）；气候数值取自 BDS
    （CloudburstMC `stripped_biome_definitions.json`，与数据包一致）；category 和显示名取自 minecraft-data bedrock 1.20.0
    （Java 风格的分类），较新的生物群系来自一张表。自定义（数据驱动）生物群系不在 registry 中。`bot.blockAt(p).biome` 由
    prismarine-block 1.23.0 通过 `prismarine-biome(registry.version)` 构建，只填充 `id`（其 `name` 为 `''`，Java 上也一样）；
    `bot.registry.biomes[block.biome.id]` 才是完整的生物群系。
  - **particles：** Bedrock 粒子类型（`level_event` `0x4000 | id`，例如 bubble 1、heart 19）。
  - **sounds：** 与 `level_sound_event.sound_id` 中发送的一致的关卡声音事件标识符（1.26.40 起为字符串，例如
    `armor.equip_iron`）；`id` 是旧的数字 LevelSoundEvent id（13 个较新的事件分配了 ≥ 615 的 id）。
  - **沿用 minecraft-data：** language（1.21.70）、recipes（1.19.10，已被 `crafting_data` 取代：见[配方](crafting.md#recipes)）、
    windows、instruments、blocksB2J / J2B、protocol。

## 线上的物品（ItemV4）  {#items}

- **影响：** `Item.fromNotch` / `Item.toNotch`（prismarine-item），用于物品栏、创造模式和事务。
- **Java：** `{ itemCount, itemId, components }`；空槽位为 `present: false` / count 0。
- **Bedrock：** ItemV4 `{ network_id, count, metadata, has_stack_id, stack_id, block_runtime_id, extra }`；从 1.26.40 起，空槽位同样包含所有字段；方块物品携带其放置的方块状态的 runtime id（BDS 会精确比对手持物品）。
- **bedboo：** `Item.toNotch(null)` 即 BDS 的空物品；物品会保留服务器的 `stack_id`、`blockRuntimeId` 以及 `can_place_on` / `can_destroy` 列表（`item.canPlaceOn` / `item.canDestroy`），因此 `toNotch(fromNotch(x))` 逐字节相同；新建的方块物品通过 `registry.items[id].blockStateId`（取自 BDS 创造模式数据的新增字段）映射为 runtime id。在调用 `registry.handleStartGame` 之前，新建方块物品的该值为 0。

## 物品标签不在线上传输  {#item-tags}

- **影响：** 以标签作为原料的配方（木板、原木、木台阶、石质材料、煤炭、蛋、羊毛、粒等）。
- **Java：** minecraft-data 中的配方已展开，数据中包含标签。
- **Bedrock：** `crafting_data` 中记录的是标签名（如 `minecraft:planks`），但 BDS 从不发送标签成员（`item_registry` 仅列出数据驱动物品的标签，不包含上述原版标签）。1.26.51 的合成配方共涉及 11 个标签。
- **bedboo：** `lib/bedrock/item_tags.js` 为这 11 个标签收录了 pmmp/BedrockData 的 `item_tags.json`（BDS 1.26.30，CC0），并在 BDS 1.26.51.1 上逐一验证了成员：将每个候选物品放入使用该标签的配方中尝试合成（被接受即为成员，返回状态 35 则不是）。1.26.51 新增了 poplar 木材系列（木板、原木、木台阶）以及 `minecraft:mushrooms_for_stew`（棕色、红色和 shelf 蘑菇）。包含未知标签或物品的配方会被跳过（记录在 `bot._bedrock.recipes.skipped` 中，在 1.26.51 上为空）。详见[配方](crafting.md#recipes)。

## Bedrock 数据中没有战利品表  {#loot}

- **影响：** `registry.blockLoot`、`registry.entityLoot`（在 `bedrock_1.26.51` 下为空）。
- **Java：** minecraft-data 包含方块和实体的战利品表（含掉落概率和数量）。
- **Bedrock：** 仅有 `blocks[].drops`（只有物品 id 列表，不含数量和概率）。
- **bedboo：** 两张表均为空，需要掉落产量数据的代码必须自行提供。bedboo agent（`packages/agent/src/data/index.js`）内置了所需的数据：红石矿石 ×4.5、青金石 ×6.5、铜 ×3.5、沙砾 → 燧石 10 %、树叶 → 树苗 / 木棍 / 苹果，以及所猎杀被动生物的掉落物。

## 特性表（`bot.supportFeature`）  {#feature-table}

- **影响：** `bot.supportFeature(name)`、`supportFeature` 导出项，以及所有根据 Java 特性名进行分支判断的复用插件。
- **Java：** 取自 minecraft-data 中对应机器人版本的 Java 特性列表。
- **Bedrock：** minecraft-data 的 Bedrock 列表无法识别任何 Java 特性名。
- **bedboo：** 为以下来源用到的每个 Java 特性名明确指定了值：mineflayer 4.39.0 的 `lib/`、`examples/` 及其测试套件，pathfinder / pvp / collectblock / tool / armor-manager / auto-eat，以及 prismarine-* 模块；同时还包含 minecraft-data 的全部 17 个 Bedrock 特性，并采用 minecraft-data 自身的 1.26.51 值（`packages/bedrock-data/features.js`）。遇到未知名称时返回 `false`，并在进程内发出一次警告（`BEDBOO_UNKNOWN_FEATURE`）；若设置 `BEDBOO_STRICT_FEATURES=1` 则抛出异常。具体规则如下：
  1. **游戏 / 数据事实 → 取 Bedrock 的实际情况：** `tallWorld`、`itemsAreNotBlocks`（而非 `itemsAreAlsoBlocks`）、
     `blockSchemeIsFlat`、`blockStateId`、`doesntHaveChestType`（Bedrock 的箱子没有 `type` 状态）、
     `doesntHaveOffHandSlot: false`、`shieldSlot`（46 槽的玩家窗口）、`hasElytraFlying`、`mobSpawner`（方块名为
     `mob_spawner`；mineflayer 的示例会查询它）、`village&pillageInventoryWindows: false`（见下文）、
     `noteBlockNameIsNoteBlock: false`（`noteblock`）、`multiSidedSigns`、`furnaceNbtUsesSnakeCase: false`、
     `creativeSleepNearMobs`、实体名称（`enderCrystalNameEndsInErNoCaps`、`fireworkNamePlural`、
     `fishingBobberCorrectlyNamed: false`）、prismarine-item 用到的物品 NBT 事实（`itemsWithComponents: false`、
     `booksUseStoredEnchantments: false`、`itemLoreIsAString: false` 等）。
  2. **命令（已在 BDS 1.26.51.1 上核对）：** `hasExecuteCommand`（`execute in overworld run teleport …` 可用）、
     `hasItemCommand: false`（没有 `/item`）、`replaceItemSlotIsPrefixed`（`/replaceitem … slot.container <n>`；槽位下标是独立参数，因此使用 `slot.container.<n>` 的代码需要调整）、`hasDataCommand: false`、
     `gameRuleUsesResourceLocation: false`、`effectAreNotPrefixed`（Bedrock 格式为 `/effect <target> hunger 1 255`，既不接受 `effect give`，也不接受 `minecraft:` 前缀）、`playsoundUsesResourceLocation: false`、`setBlockUsesMetadataNumber: false`。
  3. **Java 数据包布局 → false**（`stateIdUsed`、`blockPlaceHas*`、`dimensionIsA*`、`dimensionDataInCodec`、`titleUses*`、
     `updatedParticlesPacket`、`useItemWith*`、`teleportUsesOwnPacket`、`hasEditBookPacket` 等）：相关插件已基于 Bedrock 数据包重新实现，设为 `false` 可避免进入内置的 Java 分支。例外：`positionUpdateSentEveryTick: true`（每 tick 发送 `player_auth_input`）。
  4. **API 形态：** `tabCompleteHasAToolTip: true`（mineflayer ≥ 1.13 的 `[{ match, tooltip }]`）、`lessCharsInChat: false`
     （按 256 字符分段）、`selectingTradeMovesItems: false`（Bedrock 没有 `select_trade`）、`fishingBiteDelayMaxTicks: 600`
     （Java 的时间窗口；实测在 BDS 上同样适用，见[钓鱼](survival.md#fishing)）。
  5. **prismarine-windows：** `village&pillageInventoryWindows: false` 会选用旧版窗口表（通过 `shieldSlot` 得到 46 槽的玩家物品栏）。若设为 `true` 则会进入 1.14+ 分支，其中的 `registry.version['>=']('1.20.3')` 对 Bedrock 版本会抛出 RangeError。Bedrock 容器并非 Java 协议窗口：bedboo 注册了所有 Bedrock 容器类型（`bot._bedrock.windows`），并自行构建了 46 槽、Java 布局的玩家物品栏（见[窗口类型](inventory.md#window-types)）。`netherUpdateInventoryWindows` 仅在该 1.14+ 分支中读取，对 Bedrock 无影响。

## 在 Bedrock registry 上比较 Java 版本  {#version-comparisons}

- **影响：** 传入 Java 版本号调用 `bot.registry.isNewerOrEqualTo`、`isOlderThan`、`version['>=']` 等方法（例如 mineflayer 的 `examples/inventory.js` 和 @nxg-org/mineflayer-util-plugin）。
- **Java：** 在 Java 版本之间直接比较。
- **Bedrock：** 对于 Bedrock 版本对象，minecraft-data 只识别 Bedrock 版本号。传入 `'1.9'` 或 `'1.16'` 会抛出 RangeError，导致 util 插件（以及依赖它的 mineflayer-auto-eat）连加载都无法完成。
- **bedboo：** `@bedboo/bedrock-data` 的 `install()` 放宽了已缓存的 `bedrock_1.26.51` 版本对象的比较函数：遇到 minecraft-data 不识别的版本时，会按数字（major.minor.patch）与 1.26.51 比较，因此判定结果比所有 Java 1.x 版本新、比 Java 26.x 版本旧；Bedrock 版本之间的比较逻辑完全不变；非数字的未知版本仍会抛出异常。依赖该异常的代码（prismarine-windows 的 1.14+ 分支）不受影响，因为前置的[特性](#feature-table)检查仍为 false。
