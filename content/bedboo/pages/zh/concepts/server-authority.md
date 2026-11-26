# 服务端权威

在 Java 版中，玩家的许多状态由客户端自行决定，例如当前位置、点击对物品栏的影响，以及方块何时被破坏。而在基岩版专用服务器上，这三件事均由**服务器**决定。移动始终由服务端做主，物品栏和方块破坏的服务端权威则由 BDS 在 `start_game` 中声明（`server_authoritative_inventory`、`server_authoritative_block_breaking`）。客户端只负责发送玩家的操作，由服务器模拟并返回结果。

mineflayer 的 API 是按 Java 版的模型设计的：客户端先执行动作，再通知服务器。bedboo 在基岩版模型之上保留了这套 API：先预测服务器的行为，按基岩版要求的格式发送玩家动作，最后以服务器的回复为准。本页介绍这一模型的工作原理，具体规则详见[基岩版差异](../reference/differences/index.md)。

## 每个 tick 一个输入 {#input}

基岩版客户端从玩家出生起，每个服务器 tick（每 50 ms）都会发送一个 `player_auth_input` 数据包，其中包含位置（视线高度）、移动按键、朝向、潜行和疾跑等状态标志，以及挖掘等方块操作。

这个数据流由 bedboo 的输入队列（`bot._bedrock.input`）维持。它的时钟以 `start_game` 中的服务器 tick 为基准：每个 tick，物理引擎都会推进玩家移动一步，队列则将移动结果连同插件在该 tick 排入的内容一并发送。如果计时器延迟，队列会补发错过的 tick，单次最多补发 `maxCatchupTicks`（4）个。在加载画面、死亡和维度切换期间，该数据流会暂停（[输入流](../reference/differences/movement.md#input)）。

对机器人代码来说，这意味着通过数据流发送的变更不会立即生效，而是要等到下一个输入发出。例如，`look()` 要在带有新朝向的输入发出后才会 resolve（[视角](../reference/differences/movement.md#look)）；紧跟在 `setControlState('sneak')` 之后的点击，也会等到潜行状态发出后才执行（[点击前的潜行 / 疾跑](../reference/differences/movement.md#controls-before-clicks)）。

## 移动：先预测，再校正 {#movement}

BDS 会对收到的每个输入运行与客户端相同的移动模拟。如果客户端上报的位置比服务器算出的位置移动得更远，服务器就会发送 `correct_player_move_prediction`，其中包含服务器测算的状态以及被校正输入对应的 tick。

bedboo 每个 tick 都会用内置的基岩版移动引擎进行预测，因此计算结果通常与服务器一致，服务器也不会下发校正。同时，bedboo 会保存已发送的输入；一旦收到校正，它就会回退到被校正的 tick，采用服务器的状态，重放该 tick 之后发送的所有输入，并触发 `forcedMove`。带有 tick 标记的传送、击退和状态效果也会以同样的方式，从对应的 tick 开始应用（[校正](../reference/differences/movement.md#corrections)）。

## 物品栏：item stack request {#inventory}

基岩版没有窗口点击数据包。客户端通过 `item_stack_request`（take、place、swap、drop、craft 等）请求服务器在指定的容器槽位之间移动物品，服务器则通过 `item_stack_response` 回复：要么接受请求（并附带结果数量），要么返回错误码拒绝。

bedboo 保留了 mineflayer 的 Java 版物品栏布局和 `clickWindow` 接口。每次点击时，它会先算出该点击在 Java 版中的结果，将其作为预测先行应用，然后再发送对应的 item stack request 并等待回复。请求被接受后，物品数量和 stack id 随之确定；若被拒绝，预测结果会回滚，并由 `clickWindow` 抛出 mineflayer 的标准错误。所有基于点击的操作（`equip`、`transfer`、`deposit`、`craft` 等）都按这一机制运行（[clickWindow](../reference/differences/inventory.md#click-window)）。服务器下发物品栏副本的数据包始终具有最高优先级；当 bedboo 发现某个槽位状态过期时，也会主动向服务器请求最新副本（[物品栏重新同步](../reference/differences/inventory.md#inventory-resync)，`bot.bedrock.resyncInventory()`）。

## 挖掘与放置：以服务器的回复为准 {#digging}

在 BDS 上，方块由服务器负责破坏。客户端只需通知服务器鼠标何时按在了方块上（`start_break`）；此后，BDS 每个 tick 都会根据自己记录的手持物品和玩家状态累加破坏进度，并在进度蓄满时破坏方块。

因此，`bot.dig()` 不会像在 Java 版中那样由客户端计时器直接结束。bedboo 会先发送开始挖掘动作，接着跟踪服务器上报的进度，直到收到服务器的 `update_block` 确认方块已消失时才 resolve；如果服务器完全没有表现出破坏该方块的迹象，挖掘就会中止（[方块破坏](../reference/differences/digging.md#protocol)、[完成](../reference/differences/digging.md#completion)）。方块放置同样取决于服务器回复：由于每次点击都会附带服务器记录的手持物品副本，bedboo 必须等上一次放置收到回复（或满 500 ms）后，才会发送下一次放置（[放置](../reference/differences/digging.md#placement-serialization)）。

## 对机器人意味着什么 {#for-bots}

- 等待 promise 完成。`dig`、`placeBlock`、`clickWindow`、`equip` 等操作都会在服务器回复后 settle，返回的结果和抛出的错误与 Java 版一致。
- 服务器拥有最终决定权。任何被服务器拒绝的移动、点击或挖掘，都会按服务器的状态撤销。
- 时序跟随服务器的 tick：动作会在下一个输入中生效，挖掘耗时也严格等于服务器破坏该方块所需的时间。

当使用 `transport: 'bedd'` 时，真实客户端会自行发送输入、请求和方块动作，此时 bedboo 不再做预测，而是直接跟随客户端的行为（[BeDD 模式](../reference/differences/bedd.md)）。
