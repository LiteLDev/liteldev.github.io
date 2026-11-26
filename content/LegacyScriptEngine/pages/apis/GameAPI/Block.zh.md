# 📦 方块对象 API

脚本引擎使用「方块对象」来操作方块并获取相关方块信息。

### 获取一个方块对象

#### 从事件或API获取

注册**事件监听**函数，或调用某些**返回方块对象**的函数，即可获取 BDS 提供的事件相关方块对象。  
详见 [事件监听文档 - EventAPI](../EventAPI/Listen.zh.md)。  

#### 通过方块坐标获取

调用此函数可以手动生成方块对象。注意，目标方块必须位于已加载范围内，否则会出现问题。

`mc.getBlock(pos)`  
`mc.getBlock(x,y,z,dimid)`

- 参数：
  - pos : `IntPos` / `FloatPos`  
    方块所在坐标（或者使用 x、y、z、dimid 确定方块位置）
- 返回值：生成的方块对象 
- 返回值类型：`Block`
  - 返回 `Null` 表示获取方块失败

> 注意：不要**长期保存**方块对象。  
> 方块被销毁时，对应的方块对象也会随之释放。如果需要长期操作某个方块，请通过上述途径实时获取方块对象。




### 方块对象 - 属性

每个方块对象都包含一些固定的对象属性。对于某个特定的方块对象`bl`，包含以下属性：

| 属性                    | 含义                 | 类型      |
| ----------------------- | -------------------- | --------- |
| bl.name                 | 游戏内显示的方块名称 | `String`  |
| bl.type                 | 方块标准类型名       | `String`  |
| bl.id                   | 方块的游戏内id       | `Integer` |
| bl.pos                  | 方块所在坐标         | `IntPos`  |
| bl.tileData             | 方块数据值           | `Integer` |
| bl.variant              | The block variant    | `Integer` |
| bl.translucency         | 方块透明度           | `Integer` |
| bl.thickness            | 方块厚度             | `Integer` |
| bl.isAir                | 方块是否为空气       | `Boolean` |
| bl.isBounceBlock        | 是否为可弹跳方块     | `Boolean` |
| bl.isButtonBlock        | 是否为按钮方块       | `Boolean` |
| bl.isCropBlock          | 是否为农作物方块     | `Boolean` |
| bl.isDoorBlock          | 是否为门方块         | `Boolean` |
| bl.isFenceBlock         | 是否为栅栏方块       | `Boolean` |
| bl.isFenceGateBlock     | 是否为栅栏门方块     | `Boolean` |
| bl.isThinFenceBlock     | 是否为细栅栏方块     | `Boolean` |
| bl.isHeavyBlock         | 是否为重的方块       | `Boolean` |
| bl.isStemBlock          | 是否为干方块         | `Boolean` |
| bl.isSlabBlock          | 是否为半转方块       | `Boolean` |
| bl.isUnbreakable        | 方块是否为不可破坏   | `Boolean` |
| bl.isWaterBlockingBlock | 方块是否可阻挡水     | `Boolean` |

这些对象属性均为只读，无法修改。



### 方块对象 - 函数

每个方块对象都包含一些可调用的成员函数（成员方法）。对于某个特定的方块对象`bl`，可以通过以下函数操作该方块：

#### 破坏方块

`bl.destroy(drop)`

- 参数：
  - drop : `Boolean`  
    是否生成掉落物
- 返回值：是否成功破坏
- 返回值类型：`Boolean`



#### 获取方块对应的NBT对象

`bl.getNbt()`

- 返回值：方块的 NBT 对象
- 返回值类型：`NbtCompound`



#### 写入方块对应的NBT对象

`bl.setNbt(nbt)`

- 参数：
  - nbt : `NbtCompound`  
    NBT 对象
- 返回值：是否成功写入
- 返回值类型：`Boolean`

关于 NBT 对象的更多用法，请参考 [NBT接口文档](../NbtAPI/NBT.zh.md)。
注意：请谨慎使用此 API，建议改用 `mc.setBlock()`。



#### 获取方块的BlockState

`bl.getBlockState()`

- 返回值：方块的`BlockState`
- 返回值类型：`Object`

此便捷函数可将方块的`BlockState`解析并转换为`Object`，便于读取和解析。  
等价于在脚本中执行`block.getNbt().getTag("states").toObject()`。



#### 判断方块是否拥有容器

`bl.hasContainer()`

- 返回值：该方块是否拥有容器
- 返回值类型：`Boolean`

箱子、桶等容器方块各自拥有一个专属的容器对象。



#### 获取方块所拥有的容器对象

`bl.getContainer()`

- 返回值：该方块拥有的容器对象
- 返回值类型：`Container`

关于容器对象的更多用法，请参考 [容器对象 API文档](./Container.zh.md)。



#### 判断方块是否拥有方块实体

`bl.hasBlockEntity()`

- 返回值：该方块是否拥有方块实体
- 返回值类型：`Boolean`



#### 获取方块所拥有的方块实体

`bl.getBlockEntity()`

- 返回值：该方块拥有的方块实体
- 返回值类型：`BlockEntity`



#### 删除方块所拥有的方块实体

`bl.removeBlockEntity()`

- 返回值：是否成功删除
- 返回值类型：`Boolean`

关于方块实体对象的更多用法，请参考 [方块实体对象 API文档](../GameAPI/BlockEntity.zh.md)。



### 其他方块函数 API

以下 API 用于与游戏中指定位置的方块交互。

#### 设置指定位置的方块

`mc.setBlock(pos, blockObject)`  
`mc.setBlock(pos, blockString, tileData)`  
`mc.setBlock(x, y, z, dimId, blockObject)`  
`mc.setBlock(x, y, z, dimId, blockString, tileData)`

- 参数：
  - pos： `IntPos` 或 `FloatPos`  
    目标方块位置（或者使用 x、y、z、dimId 确定方块位置）

  - blockObject： `Block` 或 `NbtCompound`  
    目标方块对象或方块 NBT 数据

  - blockString：`String`  
    方块标准类型名（如`minecraft:stone`）

  - tileData：`Integer`  
    方块状态值，与原版 /setBlock 指令的 tileData 相同，默认为 0，仅在通过方块类型名放置方块时有效

- 返回值：是否成功设置

- 返回值类型：`Boolean`

此函数可将指定坐标的方块替换为另一个方块，效果类似于 `/setblock` 命令。



#### 在指定位置生成粒子效果

`mc.spawnParticle(pos,type)`  
`mc.spawnParticle(x,y,z,dimid,type)`

- 参数：
  - pos : `IntPos` / `FloatPos`  
    目标生成位置（或者使用 x、y、z、dimid 确定方块位置）
  - type : `String`  
    要生成的粒子效果名称（可查阅 wiki 获取）
- 返回值：是否成功生成
- 返回值类型：`Boolean`

粒子效果名称可查阅 [Minecraft Wiki](https://zh.minecraft.wiki/w/基岩版粒子#类型)。传参时请带上命名空间前缀，例如 `minecraft:heart_particle`。
