# LegacyScriptEngine API：世界与方块

## LSE 插件在全局作用域获取/创建计分板对象（如 `mc.getScoreObjective`、`mc.newScoreObjective`），`ll reload` 后正常，但服务器重启后报错或得到 null，为什么？

插件加载时服务器（世界）尚未启动完成，此时还无法操作计分板等原版内容，因此获取到的对象为 null。建议在全局作用域用 `let` 声明变量，在 `mc.listen("onServerStarted", () => { /* 在这里获取/创建计分板 */ })` 回调中再为其赋值，并在使用前做非空判断。执行热重载（`ll reload`）时服务器早已启动，所以能直接拿到对象；此外，对于在服务器启动后才加载的插件，LSE 也会补发 `onServerStarted` 事件，因此将逻辑统一写在该事件回调中对两种情况都适用。

*适用版本：当前所有 LSE 版本*

## LSE 中 `mob.pos` 打印出来是“主世界(x,x,x)”这样的字符串，对它用 `replace` 报 `cannot read ... from 'undefined'`，如何获取坐标数值来生成粒子？

`pos` 不是字符串，而是 `FloatPos` 或 `IntPos` 对象，打印出的易读格式只是调用其 `toString` 方法的结果。不要对其做字符串处理，直接读取 `pos.x`、`pos.y`、`pos.z` 和 `pos.dimid` 属性即可；也可以直接把 `pos` 对象传给相关 API（例如 `ps.spawnParticle(pos, name)`）。建议先阅读文档中的基础类型说明，并配合使用 TypeScript 类型声明，即可避免此类错误。

*适用版本：LegacyScriptEngine 当前所有版本（原为 LLSE）*

## LSE 中 `mc.setBlock` 的 block 参数传入 NBT 对象时提示参数错误，怎么回事？

传入 NbtCompound（或 Block 对象）时不要再传 `tileData` 参数，这两者属于不同的函数重载：

- `mc.setBlock(pos, blockObject)` / `mc.setBlock(x, y, z, dimId, blockObject)`：接受 Block 或 NbtCompound 对象；
- `mc.setBlock(pos, blockString, tileData)` / `mc.setBlock(x, y, z, dimId, blockString, tileData)`：仅当 block 参数为方块类型名字符串时，才可传入 `tileData`。

一旦传入了 `tileData`，LSE 就会要求 block 参数必须是字符串，否则会报参数类型错误。TypeScript 声明库 legacy-script-engine-api 已在 JavaScript@v2.17.0（2025-06-20）中修正了对应的重载声明。

*适用版本：当前版本；声明库 legacy-script-engine-api JavaScript@v2.17.0 及以上*

## LSE 能否通过方块状态（block states）而不是 `tileData` 来设置方块？还是只能用 `setblock` 命令？

可以通过 NBT 来设置方块。方块 NBT 包含 `name` 和 `states` 字段（SNBT 格式形如 `{"name":"minecraft:xxx","states":{...}}`）。可以先对任意方块调用 `block.getNbt().toSNBT()` 查看其结构，再构造对应的 `NbtCompound`（例如通过 `NBT.parseSNBT(...)`），最后传给 `mc.setBlock(pos, nbt)` 完成设置。

## LSE 脚本中 `mc.getBlock(pos).isAir` 经常报错（例如玩家传送/进服时），怎么修？

当维度不存在、高度越界或区块未加载时，`mc.getBlock` 会返回 `null`。因此在访问属性前需要先判空，例如：

```js
let block = mc.getBlock(packetPos.add(0, 1, 0));
if (block && block.isAir) break;
```

或者直接使用可选链：`mc.getBlock(...)?.isAir`。

## 在 LSE JS 插件中构造坐标时，和 C++ 的 `Vec3` 写法一样只传 x,y,z 就行吗？为什么设置方块没有效果？

不行。C++ 的 `Vec3` 不包含维度信息，但 LSE 的 `IntPos` 和 `FloatPos` 必须指定维度 ID，需写成 `new IntPos(x, y, z, dimid)`（0 为主世界、1 为下界、2 为末地）。如果不传维度 ID，构造出的坐标就不完整，将其传给 `mc.setBlock` 等接口就会失效。

## 在 LSE JS 插件里，如何让指定方块被破坏时不产生掉落物？

可以拦截方块破坏事件，然后调用方块对象的 `destroy` 方法手动破坏方块，并传入 `false` 表示不生成掉落物：`bl.destroy(false)`。该方法接收布尔参数 `drop`（是否生成掉落物），并返回方块是否被成功破坏。
