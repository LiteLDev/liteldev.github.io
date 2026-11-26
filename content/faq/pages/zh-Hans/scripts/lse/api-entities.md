# LegacyScriptEngine API：实体

## LSE 中 `entity.hurt()` 需要传整数伤害类型，如何得到枚举值？`onMobHurt` 事件的 `cause` 能直接传给 `hurt()` 吗？

LSE 注册了全局伤害原因枚举对象 `DamageCause`（为兼容同时保留了内容相同的 `ActorDamageCause`），键为枚举名、值为 int，可直接使用，例如 `pl.hurt(1.0, ActorDamageCause.Fire)` 或 `pl.hurt(1.0, DamageCause.Fire)`；`hurt` 的签名为 `hurt(damage, type?, source?)`。`onMobHurt` 回调的 `cause` 参数就是该枚举的整数值，可直接传给 `hurt()`。枚举定义以 LeviLamina 源码 `src/mc/deps/shared_types/legacy/actor/ActorDamageCause.h` 为准（文档中的枚举表可能不完整）。

*适用版本：当前 LSE 版本*

## LSE JS 插件中把实体对象作为 Map 键或用 `==` 比较两个实体对象，找不到/不相等怎么办？

LSE 每次返回的实体/玩家对象都是新创建的 JS 包装对象，没有自定义相等比较逻辑，因此直接用 `==`/`===` 比较或作为 Map 键时不会相等。应改用实体的 `uniqueId` 作为键或比较依据，例如 `Boss.find(entity => entity.uniqueId == mob.uniqueId)`。

## LSE 中 `entity.distanceTo()` 接受哪些参数？传入 `pos.x`/`pos.y`/`pos.z` 报参数类型错误/`too few arguments` 怎么办？

`distanceTo` 传 1 个参数时接受 IntPos、FloatPos、Player 或 Entity（直接传 `player.pos` 这类坐标对象即可，不需要拆成 `.x`、`.y`、`.z`）；否则必须传 4 个数字参数：`x, y, z, dimid`（只传 3 个会报参数数量错误）。例如：

```js
const pos = player.pos;
if (entity.distanceTo(pos) > R) { /* ... */ }
```

若目标与实体不在同一维度，返回值为一个极大数（`INT_MAX`）。Player 也有同名的 `distanceTo`，另有别名 `distanceToPos`。

## LSE 中判断实体是否玩家，写 `entity.isPlayer` 不加括号为什么总是成立？

`isPlayer` 是函数，必须加括号写 `entity.isPlayer()`（与 `pl.isOP()` 相同）。不加括号时判断的是函数对象本身，只要函数存在就恒为真。

## LSE 中如何把实体对象（Entity）转换为玩家对象（Player）？

使用 `en.toPlayer()`；若该实体不是玩家或转换失败则返回 `null`，可先用 `en.isPlayer()` 判断。该 API 位于文档“实体对象（Entity）”页面，也可在 legacy-script-engine-api 仓库的 d.ts 类型定义（`GameAPI/Entity/Entity.d.ts`）中查到。反向转换可用 `pl.toEntity()`。

## LSE 里如何给玩家施加一个冲量/速度（类似 ScriptAPI 的 `applyImpulse`）？

使用 `Entity` 的 `setPosDelta`：`player.toEntity().setPosDelta(x, y, z)`，也可传入 `FloatPos`，即 `en.setPosDelta(delta)`。该方法用于设置实体每刻的坐标变化量（运动量），对玩家同样有效，并返回是否设置成功。

## 想给实体绑定自定义数据（像物品那样存自定义 NBT），以及在 LSE 中根据 `uniqueId` 获取单个实体，怎么做？

可以获取实体的 `uniqueId`，将数据存到插件自己的数据文件中；也可以用 `en.addTag(tag)` 给实体添加标签（C++ 中对应 `Actor::addTag`）。要按 `uniqueId` 获取单个实体，LSE 自 0.9.5 起提供了 `mc.getEntity(id)`，参数为实体的 `UniqueId` 或 `RuntimeId`，获取失败返回 `null`；也可以用 `mc.getAllEntities()` / `mc.getEntities(...)` 遍历查找。

*适用版本：LegacyScriptEngine 0.9.5 及以上*
