# LegacyScriptEngine API：事件

## LSE 能注销（取消监听）通过 `mc.listen` 注册的事件监听器吗？怎么实现取消监听？

LSE 的脚本 API 没有提供注销监听的接口：`mc.listen(event, callback)` 只返回一个表示是否注册成功的 Boolean，不返回可用于移除监听器的句柄。不过，卸载或重载插件时，LSE 会自动清除该插件注册的全部事件监听器。

如果需要在运行时取消监听，可以在脚本中自行封装一层：对每个事件只调用一次 `mc.listen`，在回调中将事件分发给自己维护的处理函数列表；需要取消监听时，从列表中移除对应的处理函数即可。

（LeviLamina 的 C++ EventBus 提供了 `removeListener`，因此 C++ mod 可以直接移除监听器。）

*适用版本：当前所有 LSE 版本*

## LSE 中 `onAttackEntity` 事件的回调还提供 `damage`（伤害值）参数吗？

不提供。LSE 中 `onAttackEntity` 的回调原型为 `function(player, entity)`，LL2 时代的 `damage` 参数已移除，请以 LSE 文档为准。回调返回 `false` 可拦截攻击。

*适用版本：LSE 所有版本（LeviLamina 时代）*

## LSE 中如何禁止活塞推动指定方块（如箱子、漏斗），防止领地外活塞把方块推进/推出领地？

监听 `onPistonTryPush` 事件，并在回调 `function(pistonPos, block)` 中返回 `false` 即可拦截。例如：

```js
mc.listen('onPistonTryPush', (pistonPos, block) =>
  ["minecraft:chest", "minecraft:hopper"].includes(block.type) ? false : true);
```

领地插件可以通过 `block.pos` 判断被推方块是否在领地内。早期 LSE 曾存在该事件回调中方块坐标错误（始终为活塞自身坐标）的 bug（issue #137），导致领地插件失效，该问题已在 LSE 0.7.12 中修复。注意：当活塞受阻无法推动时，该事件会循环触发。

*适用版本：LSE 0.7.12 及以上*

## LSE 中 `mc.listen` 的回调参数是按名字还是按顺序传入的？例如 `mc.listen("onCmdBlockExecute",(pos,cmd)=>{log(cmd)})` 输出的却是指令而不是坐标。

按顺序传入。监听事件相当于让 LSE 调用插件中的函数，LSE 只会按照文档中事件监听函数原型的固定参数顺序传参，与自定义的参数名无关。`onCmdBlockExecute` 的原型是 `function(cmd, pos, isMinecart)`，因此第一个参数是指令字符串，第二个是坐标（FloatPos），第三个表示是否为命令方块矿车。参数名可以自行指定，但建议与文档原型保持一致：

```js
mc.listen("onCmdBlockExecute", (cmd, pos, isMinecart) => { log(cmd, pos); })
```

## LSE 中 `onPlayerDie` 事件如何判断伤害来源是否为玩家，并给击杀者在计分板上加分？

`onPlayerDie` 的原型是 `function(player, source)`，其中 `source` 是伤害来源实体（Entity，可能为 `null`）。由于 Entity 对象没有 `addScore` 等计分板方法，需要先判断 `source` 存在且为玩家，再调用 `toPlayer()` 将其转换为 Player 对象来操作计分板。示例：

```js
mc.listen("onPlayerDie", (pl, src) => { if (src && src.isPlayer()) { src.toPlayer().addScore("kills", 1); } });
```

注意：对应的计分项必须事先存在。

## LSE 中如何拦截事件？为什么用 `mc.listen("onPlayerPullFishingHook", (player,entity,item) => { fishingHookEvent(player,entity,item) })` 并在 `fishingHookEvent` 里 `return false` 拦截不生效？

在 LSE 中，事件回调返回 `false` 即可拦截事件（并非所有事件都支持拦截，请以文档中标注的“拦截事件：函数返回false”为准；`onPlayerPullFishingHook` 支持拦截）。上述写法中，外层箭头函数使用了花括号却没有 `return`，导致内层函数的返回值没有向外传递。应改为：

```js
mc.listen("onPlayerPullFishingHook", (player,entity,item) => { return fishingHookEvent(player,entity,item); });
```

或者直接传入函数：

```js
mc.listen("onPlayerPullFishingHook", (player,entity,item) => false);
```

## LSE 插件中如何实现玩家对黑曜石使用物品（如桶）时把黑曜石变成岩浆？

监听 `onUseItemOn` 事件（回调原型为 `function(player, item, block, side, pos)`），判断方块类型后调用 `mc.setBlock` 替换方块：

```js
mc.listen('onUseItemOn', (player, item, block) => {
  if (block.type === 'minecraft:obsidian' && item.type === 'minecraft:bucket') {
    mc.setBlock(block.pos, 'minecraft:lava', 0);
  }
});
```

你可以根据需要去掉对手持物品（桶）的判断。注意：Win10 客户端点击右键时，可能会在服务端连续触发多次该事件。

*适用版本：LSE 当前所有版本（含 v0.23.1）*

## LSE 插件中如何拦截玩家使用烟花等物品对方块使用的行为？

监听 `onUseItemOn` 事件（`mc.listen("onUseItemOn", (player, item, block, side, pos) => {...})`），在回调中判断 `item.type`（如 `"minecraft:firework_rocket"`）并返回 `false` 即可拦截。

*适用版本：LSE 当前所有版本（含 v0.23.1）*

## LSE 的 `onBlockChanged`（方块变化）事件能否通过 `return false` 拦截？LeviLamina C++ 中呢？

不能。LSE 的 `onBlockChanged` 在方块改变之后才会触发，因此不可拦截（文档中也标注了“拦截事件：不可以拦截”）。LeviLamina 的 `ll::event::BlockChangedEvent` 同样不是可取消事件，C++ 中也没有直接的拦截方式。你只能在方块变化后将其还原，或者自行 hook 具体的方块修改来源（例如玩家放置或破坏方块时，改用对应的可拦截事件 `onPlaceBlock`、`onDestroyBlock`）。

*适用版本：当前版本（LSE / LeviLamina）*

## LSE 脚本插件卸载时，C++ 侧通过 `executeOnModUnload` 注册的回调不触发，LSE 插件有 `onUnload` 回调吗？

旧版 LSE 在卸载脚本插件时会直接销毁引擎，不会调用 `ll::mod::Mod` 的 `onUnload`，导致 `executeOnModUnload` 无法监听。该问题已在 LSE PR #256（`fix: fix plugin executeOnModUnload`，2025-03-17 合并）中修复。在脚本侧，可以使用 `ll.onUnload(func)` 注册插件卸载时执行的清理函数。

*适用版本：包含 PR #256 的 LSE 版本（2025-03 之后发布的版本）及当前最新版*

## LSE JS 插件中有没有服务器关闭时的事件监听？

该功能不在 `mc.listen` 的事件列表中，而是在“加载相关 API”（`ll` 对象）下：调用 `ll.onUnload(func)` 注册插件卸载回调，服务器关闭（即插件卸载）时便会触发。该函数要求 LSE 0.9.6 及以上版本。

*适用版本：LSE 0.9.6 及以上*

## 如何用 LSE 禁止玩家使用某个物品？

监听 `onUseItem` 事件（回调参数为 `player, item`），判断 `item.type` 为目标物品后，在回调中 `return false` 即可拦截：

```js
mc.listen('onUseItem', (player, item) => { if (item.type === 'minecraft:xxx') return false; });
```

如果是对方块使用物品（右键方块），还需要同时拦截 `onUseItemOn`。

## 如何用 LSE 脚本插件禁止玩家与某些方块交互（例如领地内禁止打开唱片机、潜影盒）？为什么提示消息会刷屏？

监听 `onUseItemOn` 事件（回调参数为 `player, item, block, side, pos`），当 `block.type` 为目标方块时 `return false` 即可拦截交互。需要注意，Win10/PC 客户端玩家右键一次，在服务端会连续多次触发该事件（文档中有说明）。如果每次触发都调用 `player.tell`，就会导致聊天栏刷屏。解决方法是给发送消息加上防抖（debounce，建议实现为与 player 解耦的通用防抖函数），或者改在物品栏上方（actionbar）显示提示。

## 如何让 LSE 脚本插件在服务器启动完成后自动执行一些命令？

监听 `onServerStarted` 事件，并在回调中调用 `mc.runcmd`：`mc.listen("onServerStarted", () => { mc.runcmd("你的命令"); });`。如需执行多条命令，多次调用 `mc.runcmd()` 即可。如果需要获取命令输出，可以使用 `mc.runcmdEx`。

## 怎么用插件阻止服务器里的液体流动？

监听 LSE 的 `onLiquidFlow` 事件（回调参数为 `from: Block, to: IntPos`），并返回 `false` 进行拦截：

```js
mc.listen('onLiquidFlow', (from, to) => false);
```

此外，也可以编写 native mod 去掉液体 tick。

*适用版本：当前版本（该事件依赖 iListenAttentively，随 LSE 一起安装）*

## 想做告示牌锁箱子功能，用 LSE 应该拦截哪些行为？

首先，监听玩家打开容器事件 `mc.listen("onOpenContainer", (player, block) => ...)`（或方块交互事件 `onUseItemOn`），当玩家不是箱子主人时 `return false` 拦截。同时，还必须监听 `onHopperSearchItem`（回调参数为 `pos, isMinecart, item`，`return false` 即可阻止吸取），以拦截漏斗和漏斗矿车从箱子中抽取物品，否则玩家可以利用漏斗绕过箱子锁。

*适用版本：LegacyScriptEngine 0.23.x*

## LSE JS 插件在 `onBlockExplode` 监听器里调用 `mc.explode`（或在获取经验事件里再加经验）导致服务器崩溃/卡死，原因是什么？

这是插件代码触发了死循环：在事件回调中调用对应的 API 会再次触发同一事件（调用 `mc.explode` 会再次触发 `onBlockExplode`，通过 API 增加经验也会再次触发玩家获取经验事件），从而陷入无限递归。LSE 不会区分事件是否由插件自身触发，文档中对此也有提示。要解决此问题，可以在插件中设置一个布尔标志，在插件主动发起爆炸或增加经验期间跳过回调处理，或者改用不会重复触发事件的实现方式。

*适用版本：LSE 当前所有版本*
