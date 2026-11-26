# 移动与物理

本页说明 Java 版与 Bedrock 版在玩家移动、服务器校正、视角、疾跑、飞行、鞘翅滑翔和载具控制上的差异，以及 bedboo 的物理
引擎如何复现 Bedrock 的规则。测量环境为 BDS 1.26.51.1（protocol 2193，bedrock-protocol 3.60.1）：机器人记录发送的
每个 `player_auth_input` 和收到的每个 `correct_player_move_prediction`；服务器以 `player-position-acceptance-threshold=0.001`
启动，且发送的每个位置都偏移 +5 格，因此服务器从不采纳客户端位置，每次校正（约每 6 tick 一次）都带有服务器
自身的模拟状态。我们反复拟合引擎，直到它能离线复现这些状态。

## 移动引擎  {#engine}

- **影响：** `bot.physics`（及下列所有字段）、`bot.physics.simulatePlayer`、`bot.entity.velocity`、
  mineflayer-pathfinder 的模拟、`bot.physics.stepHeight`、`negligeableVelocity`、`soulsandSpeed`、`honeyblockSpeed`、
  `honeyblockJumpSpeed`、`ladderMaxSpeed`、`playerHeight`（潜行）、`slowFalling`、`sprintingUUID`。
- **Java：** prismarine-physics（Java 1.8–1.21 规则），位置由客户端数据包决定。
- **Bedrock：** 移动由服务器决定并支持回溯：客户端每 tick 发送一个 `player_auth_input`（眼睛高度的位置、移动向量、偏航、
  输入标志、`delta`），BDS 模拟同样的输入，当位置超出其模拟结果（或偏差超过接受阈值）时予以校正。实测得出的与 Java 不同的
  规则：
  - 位置/速度为 float32；服务器直接取协议中的 float32 偏航角，并使用精确的正弦/余弦（无 65536 项查找表）：斜向行走
    必须用精确三角函数才能对上；
  - 移动向量会先归一化（斜向为 (0.7071, 0.7071)），潜行时 × 0.3，再 × 0.98；
  - 单 tick 执行顺序：根据上一 tick 的着地状态计算速度 + 摩擦 → 移动向量 → 跳跃 → 攀爬 → 卡住类方块 → 潜行边缘保护 →
    碰撞（Y、X、Z）及自动上台阶 → 踩踏减速 / 弹跳 → 重力 + 阻力 → 摩擦；上报的 `delta` 为 tick 结束时的速度（静止：
    (0, −0.0784, 0)）；
  - 摩擦优先取自 floor(pos − 0.5) 处的方块，其次取支撑碰撞箱的方块，否则为 0.6——站在边缘或走出悬崖时从不使用空气的 0.9；
  - 自动上台阶为 0.5625（Java 为 0.6）；`negligeableVelocity` 为 1e-6（仅当 |v|² \< 1e-12 时速度才清零）；
  - 跳跃：vy = max(vy, 0.42 + 0.1 × 跳跃提升)，疾跑跳 +0.2，按住时有 10 tick 延迟；蜂蜜块上跳跃 × 0.6（Java 为 0.5）；
  - 潜行边缘保护将碰撞箱缩小 0.025，向下探测 1.01 × 台阶高度，并自行裁剪速度；潜行碰撞箱高 1.49（实测值；
    即 `lib/bedrock/constants.js` 中的 `SNEAK_HEIGHT`，也用作潜行玩家的 `height`）；
  - 攀爬：下落速度上限为 0.2/tick（Java 为 0.15）；按住跳跃以 0.2/tick 攀升（随后受重力影响：delta 0.1176）；朝可攀爬方块推进时保持
    0.2 作为 tick 结束速度（delta 0.2）；无水平限制；潜行时停在原处；
  - 碰撞将小于 1e-4 的穿透视为接触（float32 位置最终会略微嵌入所贴靠的表面）；
  - 水中重力为 0.005（重力 / 16），岩浆为 0.02；气泡柱逐格生效，数值与 Java 相同；
  - 灵魂沙：地面速度 × 0.544（Java：速度 × 0.4）；蜂蜜块和黏液块：踩踏时 × (0.4 + 0.2 × |vy|)（Java 蜂蜜块：速度 ×
    0.4）；黏液块仅在从空中落下时弹跳；
  - 缓降仅在已处于下落状态（vy \< 0）时生效——从静止开始的第一 tick 仍使用 0.08；
  - 使用物品：限制冲量并停止疾跑；举盾等同于普通潜行（见[物品使用减速](#item-use-slowdown)）；
  - 传送后，BDS 不模拟它处理的第一个输入（见[校正](#corrections)）；
  - 创造模式飞行：见[创造模式飞行](#flight)。
- **bedboo：** `lib/physics/engine.js`（分支自 prismarine-physics 1.11.1）沿用上游的模块结构实现了这些规则：
  - `bot.physics` 保留上游的 31 个字段名，取 Bedrock 数值：`stepHeight` 0.5625、`negligeableVelocity` 1e-6、
    `soulsandSpeed` 0.544、`honeyblockSpeed` 0.4（踩踏减速基数）、`honeyblockJumpSpeed` 0.6、`ladderMaxSpeed` 0.2、
    `waterGravity` 0.005、`sprintingUUID` = Bedrock 的 "Sprinting speed boost" 修饰符；
  - `simulatePlayer(state, world)` 同时接受 prismarine-physics 的 `PlayerState`（供 pathfinder 使用）以及 bedboo 自己的实现
    （`require('bedboo/lib/physics').PlayerState`）；
  - `require('minecraft-data')(bot.version)` 解析为 Bedrock 数据（遵循上游 API 约定），因此 prismarine-physics 的
    `PlayerState` 可正常工作；
  - 60 s 绕圈行走实测：默认接受阈值下 0 次校正，阈值为 0.1 时每 100 tick 最多 1 次。

## 服务器校正、传送、击退、效果  {#corrections}

- **影响：** `forcedMove`、`move`、`bot.entity.position` / `velocity`。
- **Java：** 服务器发送绝对/相对的 `position` 数据包；客户端确认传送。
- **Bedrock：** 传送使用 `move_player`（teleport/reset），预测错误使用 `correct_player_move_prediction`（眼睛高度的位置、
  `delta` = tick 结束时的速度、`on_ground`、被校正输入的 `tick`），击退使用 `set_entity_motion`。没有相对传送。实测表明：
  `move_player.tick`、`set_entity_motion.tick`、`mob_effect.tick` 和 `update_attributes.tick` 均指服务器已处理的最后一个
  输入；服务器从下一个输入起应用变更，且不模拟传送后收到的第一个输入。
- **bedboo：**
  - 保存最近 `rewind_history_size`（+20）个输入的历史记录；收到校正时回溯到对应 tick，采纳服务器状态并重放此后的输入（触发
    `forcedMove`）；
  - 传送：将位置设为目标点，速度设为 0，并在下一个输入中附上 `handled_teleport`；已在途的输入从目标位置重新模拟，否则下一个输入
    不做模拟；
  - 带 `tick` 的击退 / 效果 / 移动速度变更会改写自该 tick 起已发送的输入并重新模拟（服务器仍会对在途输入发送一次校正，但其
    状态与 bedboo 一致）；
  - 没有速度"相对"传送；`set_entity_motion` 直接设置速度。

## 输入流与暂停  {#input}

- **影响：** `physicsTick`，以及区块未加载或处于加载界面期间的移动数据包。
- **Java：** 仅在位置变化时（或每秒一次）发送位置数据包；配置阶段不发送数据包；无区块时不运行物理模拟。
- **Bedrock：** 始终在每个服务器 tick 发送一个 `player_auth_input`（服务器靠它驱动玩家）；没有配置阶段——加载界面、维度
  切换和死亡会暂停该输入流（`bot._bedrock.input.suspend`）。
- **bedboo：** 没有已加载的区块列时，机器人既不模拟也不触发 `physicsTick`，但仍继续发送不变的位置；输入队列暂停期间
  不发送任何数据。

## 视角  {#look}

- **影响：** `bot.look`、`bot.lookAt`、`bot.physics.yawSpeed`、`bot.physics.pitchSpeed`。
- **Java：** 发送给服务器的偏航每 tick 最多转动 `yawSpeed`；待服务器收到最终朝向后 `look` 才会 resolve。
- **Bedrock：** 朝向包含在每个 `player_auth_input` 中（偏航、俯仰、头部偏航、交互朝向和相机方向）；服务器按该偏航移动
  玩家。
- **bedboo：** 灵敏度取整和 `force` 语义与上游相同；新的偏航/俯仰在下一个输入中完整发出（无逐步转动——当 tick 的移动
  即使用新朝向，与服务器完全一致）；该输入发出后 `look` 即 resolve（≤ 1 tick），指定 `force` 时立即 resolve。`yawSpeed` /
  `pitchSpeed` 保留上游的值，但不再使用。

## 点击前的潜行 / 疾跑  {#controls-before-clicks}

- **影响：** 调用 `bot.setControlState('sneak' | 'sprint')` 后立即进行的点击（对可交互方块的 `placeBlock` /
  `activateBlock`、带疾跑击退的 `attack`、`useOn`）；`bot._bedrock.physics.controlsSent()`。
- **Java：** mineflayer 会在 `setControlState` 中写出 `entity_action` / `player_input`，因此下一次点击会按新状态处理。
- **Bedrock：** 潜行和疾跑仅作为 `player_auth_input` 的标志（`start_sneaking`、`sneaking` 等）存在，每 tick 发送一次；
  在该输入之前排队的交易会被 BDS 按旧状态处理（已在 BDS 1.26.51.1 上验证：潜行点击箱子会打开箱子，而不是放置手持方块）。
- **bedboo：** 依赖该状态的点击会等待携带该状态的输入发送完毕：当有待发送的潜行 / 疾跑变化时，`useItemOn` / `useOnEntity`
  （`lib/bedrock/transactions.js`）会 await `bot._bedrock.physics.controlsSent()`；同步的 `bot.attack` / `useOn` /
  `mount`（`lib/plugins/entities.js`）则通过 `afterControlsSent(fn)` 发送（见[攻击与使用实体](entities.md#interact)）。
  点击最多比上游晚一个 tick（50 ms）；没有待发送的变化时则同步排队。如果输入先被暂停（加载界面、维度切换），点击会立即发出；
  `end` 之后的点击会被丢弃（`controlsSent()` reject）。因此，潜行后立即对箱子调用 `useItemOn` 会放置方块，而不是打开箱子。

## 双击前进会疾跑  {#double-tap-sprint}

- **影响：** 快速切换的 `bot.setControlState('forward', …)`（mineflayer-pathfinder 的短距离移动、先点按再按住）、
  行走时的 `bot.entity.position` / 校正。
- **Java：** 双击疾跑是客户端功能；除非设置了 `sprint` 控制，否则 mineflayer 从不疾跑。
- **Bedrock：** BDS 会根据输入的 `up` 按键标志自行判定双击：在上一次按下后 6 tick 内再次按下前进，玩家就会开始疾跑（不需要
  疾跑标志），直到松开前进为止（在 1.26.51.1 上实测：两次按下间隔 6 tick 会疾跑，7 tick 则不会；若不做预测，点按 3 tick →
  松开 1 tick → 按住，3 s 内会产生 3 次校正）。`up` 标志同时驱动移动，因此不能压住不发。
- **bedboo：** 物理插件会像原版客户端一样预测该行为（原版客户端在双击时自己就会疾跑）：满足条件的第二次按下会触发疾跑（输入中带
  `sprinting` / `start_sprinting`，不需要疾跑键），条件是持续按住前进且可以疾跑（未处于飞行或骑乘状态，未在潜行或后退，未在
  使用物品，饱食度高于 6，且未被墙挡住；传送或死亡会结束疾跑）。与所有 Bedrock 疾跑一样，它是[粘滞的](#sticky-sprint)：
  持续按住前进时，`setControlState('sprint', false)` **不会**结束疾跑——BDS 会保持疾跑速度（若此时预测为行走，大约每 27 tick
  会产生一次校正；例如 mineflayer-pathfinder 在行走时每 tick 都会松开疾跑控制）。测试过的所有切换模式均无
  校正，服务器的位置与机器人一致。`getControlState('sprint')` 保持为 false。创造模式的 `flyTo` 则会避免触发双击
  （[创造模式飞行](#flight)）。

## 疾跑持续到松开前进为止  {#sticky-sprint}

- **影响：** 按住 `forward` 时调用 `bot.setControlState('sprint', false)`（mineflayer-pathfinder 的行走分支、疾跑一段
  时间的用户代码）、机器人的速度。
- **Java：** 松开疾跑控制会发送 `stop_sprinting`；玩家从下一个 tick 起恢复行走。
- **Bedrock：** 疾跑是粘滞的（在 1.26.51.1 上实测）：一旦玩家通过疾跑标志或双击开始疾跑，只要持续按住前进，BDS 就会保持
  疾跑速度，即使收到 `stop_sprinting` 也是如此（它会清除 `sprinting` actor 标志，但会重新发送带 "Sprinting speed boost"
  的移动属性，直到松开前进）。原版客户端的行为相同（松开疾跑键不会停止疾跑）。若此时按 0.1 的速度行走，大约每 27 tick
  会产生一次校正。
- **bedboo：** 松开疾跑控制后，物理插件会继续保持疾跑（并上报 `sprinting`，不发 `stop_sprinting`），直到松开前进或满足其他
  结束条件：潜行、后退、撞墙、生存模式下饱食度 ≤ 6、使用物品、飞行、骑乘、传送或死亡。`getControlState('sprint')` 会报告
  控制状态（false）。若要以行走速度继续前进，请先松开 `forward`（如果距离上一次按下在 6 tick 之内，则至少松开 7 tick，否则再次
  按下会触发[双击](#double-tap-sprint)）。

## 物品使用减速与举盾  {#item-use-slowdown}

- **影响：** `bot.usingHeldItem` 期间的移动（进食、拉弓、举盾）。
- **Java：** mineflayer 的物理引擎完全不会因为使用物品而减速。
- **Bedrock：** 玩家使用物品时，BDS 会将移动冲量限制在 ±0.1225 并移除疾跑修饰符——但它只在收到 `click_air` 交易时才进入
  物品使用状态；使用结束后，若仍按住疾跑键则会再次疾跑。盾牌通过潜行举起（不属于物品使用），因此 BDS 将其按普通潜行模拟（实测：两者都是
  每 60 tick 3.81 格）。
- **bedboo：** 仅当设置了 `bot.usingHeldItem` 且已为该次使用发送过 `click_air` 时（从发出的交易中观察；`item_release` /
  `completed_using_item` 会结束该状态），引擎才应用物品使用限制。举起盾牌（`activateItem(true)`）时的移动与潜行完全相同，不会产生
  校正。另见[物品使用](inventory.md#item-use)。

## 创造模式飞行与 flyTo  {#flight}

- **影响：** `bot.creative.flyTo` / `startFlying` / `stopFlying`、`bot.physics.gravity`、
  `bot._bedrock.physics.setFlying`。
- **Java：** 客户端自行切换 `abilities.flying`；`startFlying` 会设置 `bot.physics.gravity = 0`，`stopFlying` 则恢复原值；
  上游的 `flyTo` 通过直接设置 `bot.entity.position`，每 tick 以 0.5 格的步长移动（不经过物理引擎）。
- **Bedrock：** 飞行是服务器端的移动状态。BDS 在收到 `request_ability flying` 时开始或停止飞行（仅发送 auth-input 的
  `start_flying` 标志会被忽略），并通过 `update_abilities` 报告；飞行在服务器端模拟：
  - 按住跳跃 / 潜行时每 tick 垂直速度变化 +0.15 / −0.22，垂直阻力 0.6，水平阻力 0.91，无疾跑加成，无输入时还会额外乘以 × 0.375 的阻尼
    （飞行会在几个 tick 内停下）；
  - 双击跳跃（两次按下相隔几个 tick）同样会在服务器上切换飞行状态；
  - 双击前进会使 BDS 进入疾跑飞行（约两倍速度），且玩家触地时 BDS 会停止飞行。
- **bedboo：**
  - `bot.creative.startFlying` / `stopFlying` 会调用 `bot._bedrock.physics.setFlying(on)`，在下一个输入之前发送
    `request_ability`（+ `start_flying` / `stop_flying`），且不改动 `bot.physics.gravity`（若将重力设为 0，在服务器拒绝或因
    游戏模式变化、死亡而结束飞行后该值仍会残留，从而破坏后续所有移动以及 pathfinder 的模拟）。没有物理插件的飞行钩子时，
    则沿用上游的重力处理方式；
  - 引擎会跟随 `bot.abilities`（从 `update_abilities` 解析，同时推导出游戏模式变化）；服务器端发起的变化不会回发请求（见
    [能力](survival.md#abilities)）；
  - `bot.creative.flyTo(destination)` 会委托给 `bot._bedrock.physics.flyTo`（没有该钩子时使用上游的步进循环），通过真实输入飞行：
    每 tick 从"朝目标前进 × 跳跃 / 潜行 / 不操作"中挑选，用引擎模拟每种选择（假设该 tick 后空闲直到停下）；12 tick 内从不重复按下
    跳跃（该保护在连续的 `flyTo` 调用之间保持），松开前进后 10 tick 内从不再次按下前进（避免触发双击疾跑飞行），且目的地高于
    着陆点时从不提前降落；在距离目标 0.15 格以内停下后 resolve（上游：精确到达目的地），飞行停止、传送或受阻达 60 tick 时 reject；
  - 实测：15 s 悬停和多次 `flyTo` 飞行均无校正。真实飞行比上游的传送式步进慢：mineflayer 蜜蜂示例的 11 段短航程约需
    15.5 s（Java：约 3 s）。

## 鞘翅  {#elytra}

- **影响：** `bot.elytraFly`、`bot.entity.elytraFlying`、滑翔时的烟花助推。
- **Java：** `entity_action start_elytra_flying`。
- **Bedrock：** `player_auth_input` 中的 `start_gliding`；BDS 只在同时按下跳跃时接受它（`jump_pressed_raw`、`jumping`、`start_jumping` 等），并以 `gliding` actor 标志确认；它可以结束滑翔（清除标志）。滑翔本身遵循 Java 的公式。持续使用火箭时，BDS 大约每 2 tick 发射一枚（20 次使用 → 约 10 枚火箭），并大约每 6 tick 校正一次助推滑翔。
- **bedboo：** 检查和错误与上游相同（胸甲槽从 `bot.inventory` 读取，没有物品栏插件时从原始盔甲窗口读取）；从下一个输入起预测滑翔，当服务器清除标志（从该 tick 回溯）或 20 tick 后仍未确认时放弃。助推的开始会记录在该 tick 的输入中并重放，因此不会被校正抹掉。火箭检测（`usedFirework`、`bot.fireworkRocketDuration`）见[烟花助推](entities.md#fireworks)；来自创造模式物品栏的普通 `firework_rocket` 会获得默认的 `Fireworks {Flight: 1}` 变种（[创造模式默认值](inventory.md#creative-defaults)）。

## 载具  {#vehicles}

- **影响：** `bot.moveVehicle`。
- **Java：** `steer_vehicle` / `player_input`。
- **Bedrock：** 骑乘者的 `player_auth_input` 携带移动向量、带载具 unique id 和朝向的 `client_predicted_vehicle`，以及船的划桨标志。
- **bedboo：** `moveVehicle(left, forward)` 保持输入直到改变（上游语义），并在 `bot.vehicle` 已设置时由输入提供者每 tick 发送；骑乘时不运行玩家物理。上坐骑与链接见[载具](entities.md#vehicle-entities)。

## 骑乘控制  {#riding-control}

- **影响：** 与 `bot.mount` / `bot.dismount` 配合使用的 `bot.moveVehicle`。
- **Java：** 客户端模拟所骑载具，并发送 `vehicle_move` / `steer_vehicle`。
- **Bedrock：** 骑乘者的 `player_auth_input` 携带移动向量（船还带划桨标志）以及预测的载具 id / 朝向；BDS 据此模拟船 / 马（水上的船约 7 格/s，单桨划动时转向；马跟随骑乘者的偏航）。客户端不预测载具物理，BDS 每 6 tick 用一次 `correct_player_move_prediction { prediction_type: 'vehicle' }` 校准载具；骑乘者不会收到玩家校正。下马时骑乘者会被传送到马旁边；下船时 BDS 可能保留骑乘者上报的位置。实测：船 3 s 内 20.8 格，马 3 s 内 25–29 格，0 次玩家校正，载具校正间隔恰好 6 tick。
- **bedboo：** 与上游一样，骑乘时不触发 `physicsTick`。物理插件在每个 `player_auth_input` 中将骑乘者上报在载具座位上，并使 `bot.entity.position` 随之移动，因此船上的骑乘者会在船旁边下船：见[骑乘者的位置](entities.md#rider-position)、[骑乘者的座位](entities.md#rider-seat)和[下坐骑](entities.md#dismount)。

## 已知的残余误差  {#residuals}

- 近似处理（可能出现校正；此时采用服务器状态并重放）：跳跃时落在蜂蜜块上、黏液块弹跳高度（误差 0.01 格以内）、气泡柱表面、细雪（每 6 tick \< 2 mm）、创造模式下从地面起飞（默认阈值下有一次 3 cm 的校正；严格探测结果一致）。
- 未建模：游泳（在水中疾跑不会开始游泳）、爬行 / 滑翔姿态（碰撞箱高度）、被推出方块（BDS 每 tick 推 0.1）、脚手架、实体碰撞（船、潜影贝）、创造模式下双击跳跃切换飞行（跟随服务器的 `update_abilities`）、远离原点时的 float32 精度。
- 气泡柱：在已有的水下放置灵魂沙 / 岩浆块时，BDS 会形成气泡柱；之后再替换底部方块不会使其转换。
- `bot._bedrock.input`（`input_queue.js`）：时钟不会因校正而重新对齐——tick 编号只用于标识输入以供服务器回溯，且每个发送的 tick 只运行一步引擎，因此被跳过的（追赶用的）tick 在两端都会跳过。
