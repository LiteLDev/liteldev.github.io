# 物品栏与窗口

本页说明 bedboo 如何在 Bedrock 服务端权威的物品栏之上保留 mineflayer 的 Java 布局物品栏 API（`bot.inventory`、
`bot.currentWindow`、槽位编号、`clickWindow`、`transfer`、`deposit` / `withdraw`、事件），以及由此带来的少数可见差异。
观测环境为 BDS 1.26.51.1（协议 2193）。

## clickWindow 由 item stack request 模拟  {#click-window}

- **影响：** `bot.clickWindow`，以及所有基于它的操作（`transfer`、`putAway`、`moveSlotItem`、
  `putSelectedItemRange`、`toss`、`tossStack`、`equip`、`unequip`、`simpleClick`、窗口的 `deposit` / `withdraw`）
- **Java：** 客户端发送 `window_click`（slot、button、mode）；服务端执行点击并同步窗口。
- **Bedrock：** 没有点击数据包。客户端在明确的容器槽位（`hotbar`、`inventory`、`armor`、`offhand`、`cursor`、
  `container`、`barrel`、`shulker`、熔炉 / 酿造台 / 工作站的 ui 槽位）之间发送 `item_stack_request` 动作（`take`、
  `place`、`swap`、`drop`、`destroy`、`craft_creative`、…），服务端以 `item_stack_response` 应答（ok + 结果数量 /
  stack id，或错误码）。请求之后服务端不会重发物品栏。光标移动、跨容器移动以及 `craft_creative` 只在打开某个界面时才被接受
  （否则返回状态 7 / 50）。
- **bedboo：** `lib/bedrock/click.js` 按 Java（原版 1.21 `doClick` / `quickMoveStack`）的结果把每种点击模式规划为
  stack request 步骤：
  - 模式 0（左键 / 右键，窗口外 = 丢弃）、模式 1（Shift，含 Java 按菜单区分的规则，包括盔甲 → 盔甲槽；工作站规则——熔炉的燃料与原料、
    酿造台的药瓶 / 原料 / 燃料、附魔台的青金石、织布机、制图台、锻造台、信标——来自窗口定义并使用物品名列表，因为这里没有熔炼 /
    酿造配方数据）、模式 2（数字键，40 = 副手）、模式 3（创造模式复制）和模式 4（丢弃键）。
  - 模型预测结果（每个变化的槽位触发一次 `updateSlot`，与 Java 1.17+ 相同），每次点击发送一个请求并等待应答，应答会更新数量和
    stack id（5 s 超时之后才到达的应答仍会被应用）。点击可以重叠：参见[重叠的请求](#overlapping-requests)。
  - 被拒绝的请求会回滚，`clickWindow` 抛出 mineflayer 自己的消息
    `Server rejected transaction for clicking on slot <s>, on window with id <id>.`（无应答时：
    `Server didn't respond to transaction …`）。
  - 对 `bot.inventory` 的点击会打开玩家自己的物品栏界面（`interact open_inventory`），并在最后一次点击后 100 ms、光标为空时关闭它。
  - 模式 5（拖拽）和 6（双击）抛出 "not implemented"，与 prismarine-windows 一致。点击合成 / 交易的结果槽需要 `bot.craft`
    的合成请求（[合成](crafting.md#craft-request)），因此会抛出错误。
  - Java 服务端会静默忽略无效的放置（例如把泥土放进盔甲槽）；规划器对盔甲槽和结果槽应用 Java 的 `Slot.mayPlace`，其余被 BDS
    拒绝的情况以拒绝错误的形式抛出。

## 重叠的 item stack request  {#overlapping-requests}

- **影响：** 调用重叠时的 `bot.clickWindow` 及所有基于它的操作（未 await 的点击、armor-manager / tool / auto-eat
  的装备操作与用户代码竞争、丢弃物品时的 `transfer`），窗口的 `deposit` / `withdraw`
- **Java：** 客户端立即把每次点击应用到窗口（1.17+ 预测），服务端用 `set_slot` / `window_items` 纠正错误的槽位，因此重叠的点击会自愈。
- **Bedrock：** 每次点击都是一个 `item_stack_request`；基于先前请求预测结果规划的请求，会把尚未应答的请求 id 作为该槽位的
  stack id；BDS 按发送顺序应答；被拒绝的请求（例如状态 55：把泥土放进副手，随后引用它的请求得到 49）只收到错误应答——不会重发任何内容。
- **bedboo：** 物品栏模型按槽位记录修改了该槽位、仍在进行中的请求。
  - 一个请求结束后，会把该槽位的结果（服务端的数量和 stack id，若被拒绝则为自身的起始状态）交给该槽位上的下一个请求，
    而不是覆盖下一个请求的预测；只有槽位上的最后一个请求才写入槽位。
  - 因此连锁拒绝最终会回到第一个请求之前的状态——或者回到这些请求进行期间服务端最后为该槽位发送的内容（拾取、`/give`）。
    基于这种服务端更新规划的请求会把它作为基准；若服务端重发的恰好是这些请求规划时所基于的状态，界面仍显示它们的预测
    （[物品栏重新同步](#inventory-resync)）。
  - 迟到（超时）的应答按顺序应用。期间已关闭的容器窗口的应答不再影响下一个窗口。
  - 物品栏界面已打开时，点击的预测会同步提交（否则在等待界面打开后重新规划），因此不等待上一次点击就发出的点击会基于上一次点击进行，
    与 Java 客户端侧点击一致。

## 被服务端修改槽位抢先的点击会重新规划  {#raced-requests}

- **影响：** 在拾取掉落物、执行 `/give`、漏斗或其他玩家修改请求涉及的槽位时，`bot.clickWindow` 及所有基于它的操作
  （`transfer`、`deposit` / `withdraw`、`moveSlotItem`、`equip`、`toss` / `tossStack`、`putAway`、合成）
- **Java：** 服务端把 `window_click` 应用到自己当前的状态（并重新同步）；它永远不会失败。
- **Bedrock：** item stack request 以客户端所知的 stack id 指明每个槽位；若服务端在此期间修改了该槽位（拾取：带有新 stack id
  的 normal 类型 `inventory_transaction`），BDS 会拒绝整个请求（状态 49 stack id 不匹配 / 50）。实测：一个箱子
  存入 / 取出循环，每 400 ms 执行一次控制台 `/give`，88 次操作中有 6 次被拒绝（"Server rejected transaction for clicking
  on slot 27 …"）。
- **bedboo：** 若某个服务端数据包把进行中请求的某个槽位设为与该请求规划时不同的物品堆，该请求会被标记为 raced
  （`lib/bedrock/inventory_model.js`）；被 BDS 拒绝的 raced 请求会基于服务端状态重新规划一次并再次发送（item stack request
  是原子的：被拒绝的请求没有改变任何东西）。链接在它之上（基于它的预测规划）的请求也以同样方式重试。没有此类变化的拒绝仍会抛出
  mineflayer 的消息。

## 关闭窗口时放回光标上的物品和工作站输入  {#close-window}

- **影响：** `bot.closeWindow`、窗口的 `close()`
- **Java：** 关闭时服务端把光标上的物品（以及合成网格 / 铁砧 / 附魔台的输入）放回玩家物品栏（`placeItemBackInInventory`）。
- **Bedrock：** BDS 保留它们：光标物品留在 `cursor`（ui 槽位 0），工作站输入留在各自的 ui 槽位（在 `container_close`
  之后观测到）。Java \< 1.17 在 `close_window` 之后会发送一次空操作点击；Bedrock 两者都没有。
- **bedboo：** 与上游一样，`closeWindow` 立即清空 `bot.currentWindow` 并触发 `windowClose`。随后按 Java 的规则用一个
  stack request 移动这些物品（先放到选中的快捷栏槽位、副手和有空间的物品堆，再放到第一个空槽位，剩余的丢出），并发送
  `container_close { window_id, window_type, server: false }`（没有需要放回的物品时只发送 `container_close`）。返回的 promise
  在服务端回显时 resolve，打开器会等待它再加 100 ms（2 tick）后才激活下一个容器：BDS 会静默丢弃在上一个容器关闭的同一 tick
  内到达的容器激活（没有 `container_open`，也没有重新同步）。方块实体（箱子、熔炉、酿造台、…）像 Java 一样保留其内容。
  `bot.closeWindow(bot.inventory)` 会关闭由 bot 打开的物品栏界面。

## 在另一个窗口打开时打开窗口  {#window-switch}

- **影响：** `bot.openBlock`、`bot.openEntity`、`bot.openContainer` / `openChest` / `openDispenser`、工作站打开器（`openFurnace`、`openAnvil`、`openEnchantmentTable`、`openVillager`、使用工作台的 `craft`）、`bot.activateBlock` / `bot.activateEntity` / `bot.activateEntityAt`、`windowClose`
- **Java：** `ServerPlayer.openMenu` 先关闭当前菜单（`close_window` → mineflayer 触发 `windowClose`），再打开新菜单；即使代码从不关闭箱子（如 mineflayer-collectblock 的 `emptyInventory`）也能正常工作。
- **Bedrock：** 玩家已打开容器时，BDS 会忽略打开另一个容器的激活操作——既不发送 `container_open` 也不发送 `container_close`——导致 `openBlock` 等满 `once()` 的 20 s 超时后抛出错误（已实测验证：先开箱子再开木桶，以及同一个箱子打开两次）。其他激活操作（如拉杆）在容器打开时照常处理，容器保持打开——与 Java 一致。
- **bedboo：** 调用 `openBlock` / `openEntity`、工作站打开器，或对容器 / 工作站方块（箱子、木桶、潜影盒、熔炉、工作台 / 附魔台 / 锻造台、铁砧、漏斗、发射器、投掷器、酿造台、信标、砂轮、切石机、织布机、制图台、合成器、讲台）及交易 / 存储实体（村民、流浪商人、运输矿车 / 漏斗矿车、运输船）调用 `activateBlock` / `activateEntity(At)` 时，都会先用 `bot.closeWindow` 关闭已打开的容器窗口（立即触发 `windowClose`，放回光标和工作站物品，发送 `container_close` 并等待服务端回显），然后等待 BDS 的 100 ms 重新打开延迟后再执行激活。其他激活操作不会关闭窗口。

## 容器的实体或方块已不存在  {#container-gone}

- **影响：** `windowClose`、`bot.currentWindow`，以及交易者死亡或消失、方块被破坏时的交易窗口（`bot.openVillager`、`bot.trade`）和工作站窗口（铁砧、附魔台、熔炉、…）
- **Java：** 服务端关闭菜单（`stillValid` 失败）并归还输入槽中的物品。
- **Bedrock：** BDS 只发送 `remove_entity`（或方块更新），既不发送 `container_close`，也不归还任何物品。交易或工作站输入槽中的物品位于玩家的 `ui` 容器中；BDS 拒绝将它们从已失效的界面中移出（状态 49，无效的源槽位），而是直接留在原处——下一个使用这些槽位的窗口会直接显示它们。
- **bedboo：** 当容器实体消失（窗口实体的 `entityGone`）或方块变为其他方块（燃烧的熔炉仍算熔炉，开裂的铁砧仍算铁砧）时，物品栏插件会将其视为服务端关闭：触发 `windowClose`，将 `currentWindow` 置为 null，然后发送 `container_close`（不发送注定失败的归还请求；下一个打开器会等待该关闭回显）。离开交互范围不会关闭窗口（BDS 不发送任何包，未处理）。`openVillager` 会立即归还交易输入槽中残留的物品（Java 中新打开的交易窗口是空的），因此死亡交易者收下的付款会在下次打开交易窗口时退还。此外，`update_trade.villager_unique_id` 是 zigzag varint，但 bedrock-protocol 3.60.1 按无符号整数读取，已在 `inventory.js` 中解码。

## 窗口类型：为 Bedrock 容器使用 Java 类型  {#window-types}

- **影响：** `windowOpen`、`bot.currentWindow`、`bot.openBlock`、`bot.openEntity`、`bot.openContainer`（`openChest`、`openDispenser`）、工作站打开器
- **Java：** `open_window` 携带 Java 窗口类型；`window_items` 携带槽位。
- **Bedrock：** 发送 `container_open { window_id, window_type, coordinates, runtime_entity_id }` 以及对应 window id 的 `inventory_content`；所有类箱子方块（箱子、陷阱箱 / 末影箱 / 铜箱子、木桶、潜影盒）均为 `window_type: 'container'`，需通过 `coordinates` 处的方块来区分；工作站输入槽（合成网格、铁砧、附魔台、砂轮、切石机、织布机、制图台、锻造台、信标、交易）则位于 `ui` 容器中。Bedrock 会在 `container_open` 之后立即用窗口自身的 window id 发送容器内容，并将玩家物品栏作为独立容器（`inventory`）同步。
- **bedboo：** 注册表 `bot._bedrock.windows` 将每种容器类型映射到 Java 1.21 的窗口类型和槽位布局（`minecraft:generic_9x3` / `9x6` / `3x3`、`hopper`、`shulker_box`、`crafting`、`furnace`、`blast_furnace`、`smoker`、`brewing_stand`、`enchantment`、`anvil`、`merchant`、`beacon`、`grindstone`、`stonecutter`、`loom`、`cartography`、`smithing`（1.20+ 模板 / 基础 / 附加 / 结果）、`crafter_3x3`、`lectern`、`HorseWindow`），因此 `openContainer` 和工作站打开器的类型检查无需修改即可通过。窗口中的玩家部分镜像自 `bot.inventory`。复用 window id 时提前到达的内容会被缓存并使用，窗口关闭后到达的更新则总会写入 `bot.inventory`。`openContainer` 也接受 Bedrock 方块名 `undyed_shulker_box` 和各种铜箱子。马和讲台窗口尚未在 BDS 上验证。在容器窗口打开时打开另一个窗口会先关闭前者，与 Java 服务端一致（[切换窗口](#window-switch)）。

## updateSlot 仅在变化时触发  {#update-slot}

- **影响：** 窗口的 `updateSlot` / `updateSlot:<n>` 事件、`heldItemChanged`
- **Java：** 每个 `set_slot` / `window_items` 都会调用 `updateSlot`（即使槽位没有变化）。
- **Bedrock：** 没有 `set_slot`。每条命令、游戏模式变更和被拒绝的事务之后，BDS 都会重发所有物品栏窗口（`inventory_content` × 4）。
- **bedboo：** 仅改变 stack id 的重发会静默替换 Item；只有类型、数量、metadata 或 NBT 发生变化时才触发 `updateSlot`（进而触发 `heldItemChanged`）。手持槽位的 `inventory_slot` / `inventory_content` 会触发 `heldItemChanged`。

## 没有 Java 那样的窗口重新同步请求  {#resync}

- **影响：** `bot._syncWindow`（内部）
- **Java（1.17.1+）：** 不可能的点击会让服务端重发窗口。
- **Bedrock：** item stack request 被拒绝后，BDS 不会重发任何内容（已实测验证：仅返回错误应答），但每个请求都会收到应答。
- **bedboo：** `_syncWindow` 会立即 resolve；模型会自行回滚被拒绝的预测（参见[重叠的请求](#overlapping-requests)）。发现过期的槽位则通过[物品栏重新同步](#inventory-resync)修复。

## 物品栏重新同步（inventory_mismatch）  {#inventory-resync}

- **影响：** 失步后的 `bot.inventory`、`clickWindow`（及所有基于它的操作）、Bedrock 扩展 `bot.bedrock.resyncInventory()`（[`bot.bedrock`](../api.md#bedrock-extras)）
- **Java：** 只要客户端视图过期（state id），服务端就会重发窗口。
- **Bedrock（在 BDS 1.26.51.1 上实测）：** 客户端发送 `inventory_transaction { transaction_type: 'inventory_mismatch' }` 会让 BDS 在一个 tick 内重发玩家的整个物品栏——依次是物品栏、盔甲、ui（光标）和副手窗口的 `inventory_content`，最后是 `player_hotbar`——且没有其他副作用。其他方式都无效：打开或重开物品栏界面无效，被拒绝的请求无效（对服务端不存在对应 stack id 的槽位会返回状态 49，且该槽位在后续所有请求中都会被拒绝），`/clear <player> <item> -1 0` 也无效。
- **bedboo：** 服务端数据包始终优先（`inventory_content`、`inventory_slot` 和服务端事务按到达顺序应用）。
  - 模型一旦发现某个玩家槽位过期，就会请求服务端的副本（自动重新同步每秒最多一次——提前发起的请求会在当前这一秒结束时发出）。触发条件包括：
    - 请求以状态 49 被拒绝，且没有服务端数据包能解释原因（既没有发生竞争（raced），也不是基于另一个被拒绝的请求规划的）。如果重发的副本与规划请求时所基于的状态不同，支持重规划的请求（`clickWindow`、`returnItems`、合成）会基于新副本重新规划一次，否则拒绝生效（不支持重规划的请求会立即 reject，同时后台进行重新同步）；
    - 收到服务端的 `inventory_transaction`（如拾取、`/give`），其 `old_item` 既不是本地物品也不是新物品，且当前没有请求正在修改该槽位；
    - 应答在模型认为为空的槽位中清点出了物品。
  - 重新同步以应答中的 `player_hotbar { select_slot: true }` 结束（由命令触发的重发则以 `select_slot: false` 结束）。调用 `bot.bedrock.resyncInventory()` → `Promise<boolean>` 可显式请求重新同步（应用成功后返回 true，2 s 内无应答则返回 false）；诊断信息保存在 `bot._bedrock.inventoryModel.resyncs` 中。
  - 如果重发在请求进行期间到达，且内容只是重复服务端已知的槽位副本（stack id、类型、数量、metadata、NBT），则不会覆盖这些请求的预测结果：服务端会将这些请求应用到该状态上，因此期间规划的点击仍基于预测结果进行，后续应答会补全预测的物品（否则，在这类重发之后才收到应答的 swap 操作就会显示旧物品加新数量）。
- **拾取：** 拾取操作始终通过 `take_item_entity` + 服务端 `inventory_transaction`（normal：包含容器槽位的旧物品和新物品，随后是一个 `world_interaction` 动作）下发，从不通过 `inventory_slot` 下发。常规挖掘和拾取（合并到快捷栏与主物品栏的物品堆、物品栏已满、箱子处于打开状态、使用 mineflayer-collectblock）时的物品数量均能保持准确。此前偶发的失步（约 40 轮中出现 1 次）是这样发生的：重叠的 `moveSlotItem` 正在来回移动一堆煤，与此同时拾取的物品正好合并进来；当拾取落在这堆煤上时，一个从该物品堆取出的请求以及基于该取出操作规划的点击正在进行中；BDS 将这两个请求双双拒绝（49：物品堆已变化 / 所引用的请求被拒绝），而回滚逻辑把拾取前的物品堆状态写了回去——导致 `bot.inventory` 显示 28 个煤（stack 236），而服务端实际有 29 个（stack 237），此后针对该物品堆的每次点击都会被拒绝。按槽位划分的请求链（参见[重叠的请求](#overlapping-requests)）修复了此问题：被拒绝的请求会回退到服务端最后一次为该槽位发送的内容，而基于服务端更新所规划的请求则以此作为基准。上述重新同步机制也会兜底修复任何残留的失步。

## 下界传送门旅行后的物品栏界面  {#inventory-screen-after-portal}

- **影响：** `bot.equip`（盔甲、副手）、`bot.toss`、使用物品栏网格合成、`bot.moveSlotItem`——所有需要打开玩家物品栏界面的请求（即 `lib/bedrock/inventory_model.js` 中的 `screen.open()`）
- **Java：** 物品栏点击不需要打开界面。
- **Bedrock：** 针对玩家物品栏的 item stack request 要求物品栏界面处于打开状态（`interact open_inventory` → `container_open window_type inventory`）。在 BDS 1.26.51.1 上实测：当玩家站在下界传送门中，以及走出目标传送门后的约 1–2 s 内，BDS 会静默丢弃 `open_inventory`（既不返回 `container_open`，也没有任何其他响应）。通过命令传送（`/execute in nether run tp`）则不会触发此问题。
- **bedboo：** `screen.open()` 会每 1.5 s 重发一次 `open_inventory` 请求，直到界面打开（超时时间为 8 s）。如果没有这一机制，传送门旅行后的第一次装备操作就会因 "the server did not open the inventory screen" 而失败。不过一直站在传送门内依然会失败（符合原版行为）：请先走出目标传送门。

## 手持物品选择  {#held-item}

- **影响：** `bot.quickBarSlot`、`bot.setQuickBarSlot`、`heldItemChanged`
- **Java：** 客户端与服务端双向均使用 `held_item_slot`。
- **Bedrock：** 服务端使用 `player_hotbar { selected_slot, select_slot }` 来切换槽位（`select_slot: false` 仅作通知）；客户端则通过发送携带精确手持物品信息的 `mob_equipment` 来告知自己的选择。
- **bedboo：** 行为如上所述；`bot._bedrock.heldNetworkItem()` 会从物品栏模型中返回手持槽位对应的精确网络层物品数据（每个 `inventory_transaction` 都会用到）。

## 服务端的快捷栏选择可能比 bot 自己的选择更旧  {#hotbar-select}

- **影响：** 刚调用 `setQuickBarSlot` 之后的 `bot.quickBarSlot`、`bot.heldItem`、`heldItemChanged`
- **Java：** 服务端的 `held_item_slot` 和客户端的 `held_item_change` 在实际运行中不会交错。
- **Bedrock：** BDS 在响应控制台命令（如 `/clear`、`/replaceitem`、`/give`）时，会下发携带其当前所选槽位的 `player_hotbar { select_slot: true }`。如果这类命令在 BDS 读取到 bot 最新发送的 `mob_equipment` 之前执行，那么服务端发来的槽位选择就是过期的：一旦采纳该选择，bot 就会切回之前的槽位，而 BDS 随后又会应用 bot 发出的选择——导致客户端与服务端陷入不同步。
- **bedboo：** 如果服务端发来的选择（无论是 `player_hotbar` 还是针对 bot 自身下发的 `mob_equipment`）与 bot 在不到 1 s 前刚刚发送的选择相矛盾，客户端就会忽略该消息，并重新发送 bot 的选择（重发不会延长这个时间窗口）。

## 副手：只能放副手物品  {#offhand}

- **影响：** `bot.equip(item, 'off-hand')`、针对槽位 45 的 `bot.clickWindow`、`inventory` 示例
- **Java：** 任何物品都可以放入副手槽。
- **Bedrock：** 副手只接受带有副手组件的物品（盾牌、不死图腾、箭、烟花火箭、地图、鹦鹉螺壳、…）；BDS 会拒绝其他所有物品（返回状态 50）。在网络协议层，stack request 中的副手槽对应 `offhand` 槽位 **1**（使用槽位 0 会被拒绝），而 `inventory_content` / `inventory_slot` 则使用索引 0。
- **bedboo：** 槽位 45 会映射到 `offhand` 1；尝试装备非副手物品会以点击错误 reject。因此在 `examples/inventory.js` 中，执行 `equip off-hand dirt` 会被拒绝，而 `equip off-hand arrow` 则能正常工作（由于槽位 45 排在最后列出，物品列表随后会以 `arrow x 16` 结尾）。

## 创造模式物品栏：用 craft_creative 代替 set_creative_slot  {#creative}

- **影响：** `bot.creative.setInventorySlot`、`bot.creative.clearSlot`、`bot.creative.clearInventory`
- **Java：** `set_creative_slot` 可以将任意物品（附带任意 NBT）直接写入玩家槽位。
- **Bedrock：** 创造模式玩家需要在物品栏界面中通过 item stack request 来生成物品：发送 `craft_creative { item_id: <creative_content entry id> }`（再配合从 `creative_output` 槽位 50 执行 `place`，并以请求 id 作为 stack id）；使用 `destroy` 删除物品。此方式只能生成服务端创造模式物品栏（即 `creative_content`：包含所有基础物品以及明确列出的 NBT 变体，如附魔书）中存在的物品——不支持自定义任意 NBT（如自定义名称、其他附魔、损耗值）；旧式的创造模式 `inventory_transaction` 会被 BDS 拒绝（并触发服务端重发物品栏）。当有容器处于打开状态时，`craft_creative` 也会被拒绝（状态 7）。
- **bedboo：** 方法签名和前置检查与上游保持一致（写入相同物品 → 无操作；对同一槽位发起第二个并发调用 → 报错 `Setting slot <n> cancelled …`）。替换已有物品的槽位时，会在单个请求中依次执行 `destroy` + `craft_creative` + `place`；同样支持槽位 45（副手）；如果目标物品不在创造模式物品栏中、目标是槽位 0（合成结果）或当前有打开的窗口，则会以明确的错误说明 reject。`waitTimeout` 参数未被使用（因为服务端总会返回应答）。创造模式物品索引保存在 `bot._bedrock.creativeItems` 中。关于在创造模式条目中全部带有 NBT 的普通物品，请参见[创造模式默认变体](#creative-defaults)。

## 从创造模式物品栏获取普通物品  {#creative-defaults}

- **影响：** 对不带 NBT 的 `firework_rocket`、`firework_star` 或 `banner` 调用 `bot.creative.setInventorySlot`
- **Java：** 支持任意物品和任意 NBT。
- **Bedrock：** 创造模式物品栏中这些物品只有带 NBT 的版本（烟花火箭为 `Fireworks {Flight: 1, Explosions: []}`，旗帜为 `Type: 0`，烟火之星则按颜色区分）。
- **bedboo：** 对于没有精确匹配条目的无 NBT 物品，若 NBT 标签最少的条目恰好只有一个（即默认变体），则选用该条目，槽位随后也会带有该 NBT。附魔书（所有变体的标签数相同）仍会被拒绝。

## 使用物品、进食和盾牌  {#item-use}

- **影响：** `bot.activateItem`、`bot.deactivateItem`、`bot.consume`、`bot.usingHeldItem`
- **Java：** 发送 `use_item`（hand、sequence、rotation）/ `block_dig` status 5；进食以 `entity_status` 9 结束。
- **Bedrock：** 发送 `inventory_transaction item_use click_air`（手持物品必须与服务端完全一致；没有 rotation 字段，朝向取自同一 tick 内 `player_auth_input` 的 yaw / pitch）和 `item_release release`。进食只需一次 click_air，32 tick 后服务端会发回 `completed_using_item { use_method: 'eat' }` 以及数量减少后的物品堆。盾牌没有使用动作：Bedrock 玩家只要任一只手持盾并潜行即可格挡。和平难度下饥饿值不会下降（饥饿效果只会清空饱和度）。
- **bedboo：** `activateItem(offHand)` 会发送 click_air（若指定 `offHand`，则为 `hand: off_hand` 加副手物品）；持盾时则改为保持潜行，调用 `deactivateItem` 时再松开。该潜行状态归盾牌独立管理：调用 `clearControlStates()` 或松开潜行控制（mineflayer-pathfinder 在配合 mineflayer-pvp 使用时这两种操作都会执行）不会解除该状态，就像在 Java 版中这些操作不会放下举起的盾牌一样；`getControlState('sneak')` 会照常报告该状态。收到 `completed_using_item`（或与上游一样检测到手持物品堆变化）时会结束 `consume()` 并清除 `usingHeldItem`。Java 的 `set_cooldown` 处理在此没有对应实现：Bedrock 的物品冷却由客户端处理（协议 2193 中没有对应的服务端数据包）。

## 桶可以堆叠  {#stacked-buckets}

- **影响：** 桶的处理（装岩浆 / 水），以及持桶调用 `bot.activateBlock` 后的 `bot.heldItem`
- **Java：** 桶的堆叠上限为 1；对液体源使用空桶会直接将手持物品变成装满的桶。
- **Bedrock：** 空桶可堆叠（上限 16）。手持 3 个空桶调用 `bot.activateBlock(<lava source>)` 后，手中会剩下 2 个空桶，而生成的 `lava_bucket` 会放入其他槽位。
- **bedboo：** 库本身无需改动（直接同步服务端的物品栏更新）；请通过统计物品栏中的 `lava_bucket` / `water_bucket` 数量来判断结果，而不要检查手持物品。
