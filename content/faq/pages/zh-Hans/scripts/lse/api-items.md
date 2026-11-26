# LegacyScriptEngine API：物品与容器

## 在 LSE 中用 `mc.newItem()` 创建 addon 自定义物品失败（参数确认无误），是什么原因？

插件加载时服务器尚未启动完毕，世界和物品注册表（包括 addon 自定义物品）还没准备好。把创建物品的代码放进 `mc.listen("onServerStarted", () => { ... })` 回调中执行即可。

新版 LSE 在这种情况下会直接抛出异常（如 `ll::service::getLevel() returns nullptr` 或 `Item not found`），可据此排查。

*适用版本：LSE 0.23.x*

## LSE 插件中如何在玩家死亡的位置生成一个掉落物？

监听玩家死亡事件 `onPlayerDie`（回调原型为 `function(player, source)`），在回调中仍可读取 `player.pos`。先用 `mc.newItem("minecraft:xxx", 数量)` 创建物品，再用 `mc.spawnItem(item, pos)` 在该位置生成掉落物。例如：

```js
mc.listen("onPlayerDie", (pl, src) => {
  const it = mc.newItem("minecraft:diamond", 1);
  mc.spawnItem(it, pl.pos);
});
```

*适用版本：LSE 当前所有版本（含 v0.23.1）*

## LSE 新增的修改玩家物品的 API，修改完之后需要手动刷新玩家背包吗？

需要。修改物品后必须调用 `player.refreshItems()` 刷新玩家物品栏和盔甲栏，客户端才会显示更改。

## LSE 有没有容器（Container）相关的 API？文档在哪？

有，文档见 <https://levimc.org/zh-Hans/LegacyScriptEngine/apis/GameAPI/Container/>。但该 API 只能操作已有容器（如方块容器、玩家物品栏），不支持主动为玩家打开容器界面；若需主动打开容器 UI，建议通过原生 C++ mod 或第三方前置实现。

## LSE 脚本中如何判断玩家背包是否已满（或是否还有空位放入某物品）？

推荐用 `player.getInventory().hasRoomFor(item)` 判断容器能否放下该物品。也可以遍历物品栏：

```js
const hasEmpty = (pl) => pl.getInventory().getAllItems().some(it => it.isNull());
```

只要找到空的物品槽位，就说明背包未满。此外，容器还提供了 `addItemToFirstEmptySlot` 和 `addItem` 方法，可直接放入物品。

## 在 LSE 中修改物品 NBT 时把整个 tag 重新设置，导致物品原有附魔丢失（甚至崩服），如何在修改时保留附魔？

不要新建整个 tag 去覆盖原有 NBT。应先用 `item.getNbt()` 取出原 NBT，在其基础上修改所需字段，再调用 `item.setNbt(nbt)` 写回。LSE 没有从普通 JS Object 直接生成 NBT 的函数，手动用构造函数拼接容易出错；更稳妥的做法是用 `nbt.toSNBT()` 转为文本，修改后再用 `NBT.parseSNBT(snbt)` 解析回 NBT 并写回。

## 在 LSE（LLSE JS）插件中如何获取物品的 NBT 字符串，以及如何把 SNBT 转回 NBT 来生成物品？

使用 `物品对象.getNbt().toSNBT()` 获取 SNBT 字符串。生成物品时，先用 `NBT.parseSNBT(snbt)` 将 SNBT 转为 `NbtCompound` 对象，再调用 `mc.newItem(nbt)` 创建物品。
