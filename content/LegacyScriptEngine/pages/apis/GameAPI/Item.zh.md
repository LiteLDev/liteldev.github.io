# 🧰 物品对象 API

脚本引擎使用「物品对象」来操作某一个物品栏物品并获取其信息。

### 获取一个物品对象

#### 从事件或API获取

注册**事件监听**函数，或调用某些**返回物品对象**的函数，即可获取 BDS 提供的物品对象。  
详见 [事件监听文档 - EventAPI ](../EventAPI/Listen.zh.md)。   

#### 生成新的物品对象

根据指定信息生成一个新的物品对象。

`mc.newItem(name,count)`  

- 参数：
  - name : `String`  
    物品的标准类型名，如`minecraft:bread`
  - count : `Integer`  
    物品堆叠数量，由于类型为 `unsigned __int8`，最大值为 `64`
- 返回值：生成的物品对象
- 返回值类型：`Item`
  - 若返回值为 `Null`，则表示生成失败
  - 若不存在该类型名的物品，则抛出异常

#### 从现有的物品对象克隆


根据某个现有的物品对象克隆一个新的物品对象。  
新的物品对象与原对象互不关联。  
对于现有的物品对象 item，可调用以下函数：

`item.clone()`  

- 返回值：生成的新物品对象
- 返回值类型：`Item`
  - 若返回值为 `Null`，则表示生成失败

#### 通过 **NBT** 生成物品对象

根据指定的 NBT 生成一个新的物品对象。

`mc.newItem(nbt)`  

- 参数：
  - nbt : `NbtCompound`  
    用于生成物品对象的物品 NBT
- 返回值：生成的物品对象
- 返回值类型：`Item`
  - 若返回值为 `Null`，则表示生成失败

> 注意：不要**长期保存**物品对象。  
> 当物品被销毁时，对应的物品对象也会随之释放。因此，如需长期操作某个物品，请通过上述途径实时获取物品对象。




### 物品对象 - 属性

每个物品对象都包含一些固定的对象属性。特定物品对象`it`具有以下属性：

| 属性                | 含义                                           | 类型                       |
| ------------------- | ---------------------------------------------- | -------------------------- |
| it.name             | 游戏内显示的物品名称                           | `String`                   |
| it.type             | 物品标准类型名                                 | `String`                   |
| it.id               | 物品的游戏内 id                                | `Integer`                  |
| it.count            | 这个物品对象堆叠的个数                         | `Integer`                  |
| it.maxCount         | 这个物品对象堆叠的最大个数(在 0.16.1 时被加入) | `Integer`                  |
| it.aux              | 物品附加值（如羊毛颜色）                       | `Integer`                  |
| it.damage           | 物品已消耗耐久                                 | `Integer`                  |
| it.attackDamage     | 物品攻击伤害                                   | `Integer`                  |
| it.maxDamage        | 物品最大耐久                                   | `Integer`                  |
| it.maxStackSize     | 物品最大堆叠数量                               | `Integer`                  |
| it.lore             | 物品 Lore                                      | `Array<String, String...>` |
| it.isArmorItem      | 物品是否为盔甲                                 | `Boolean`                  |
| it.isBlock          | 物品是否为方块                                 | `Boolean`                  |
| it.isDamageableItem | 物品是否可被破坏                               | `Boolean`                  |
| it.isDamaged        | 物品耐久是否被消耗                             | `Boolean`                  |
| it.isEnchanted      | 物品是否已被附魔                               | `Boolean`                  |
| it.isEnchantingBook | 物品是否为附魔书                               | `Boolean`                  |
| it.isFireResistant  | 物品是否防火                                   | `Boolean`                  |
| it.isFullStack      | 物品是否已堆叠到最大堆叠数                     | `Boolean`                  |
| it.isGlint          | 物品是否闪烁                                   | `Boolean`                  |
| it.isHorseArmorItem | 物品是否为马铠                                 | `Boolean`                  |
| it.isLiquidClipItem | 物品是否可以选中液体                           | `Boolean`                  |
| it.isMusicDiscItem  | 物品是否为唱片                                 | `Boolean`                  |
| it.isOffhandItem    | 物品是否可设置到副手                           | `Boolean`                  |
| it.isPotionItem     | 物品是否为药水                                 | `Boolean`                  |
| it.isStackable      | 物品是否可堆叠                                 | `Boolean`                  |
| it.isWearableItem   | 物品是否可穿戴                                 | `Boolean`                  |

这些对象属性均为只读，无法修改。



### 物品对象 - 函数

每个物品对象都包含一些可调用的成员函数（成员方法）。对于特定物品对象`it`，可以通过以下函数操作该物品：

> 注意：修改完玩家物品栏中的物品后，别忘了调用玩家对象的成员函数`pl.refreshItems`刷新客户端显示的玩家物品栏。

#### 判断物品对象是否为空

`it.isNull()`

例如，当某个格子没有任何物品时，获取到的物品对象即为空。

- 返回值：该物品对象是否为空
- 返回值类型： `Boolean`



#### 将此物品对象置为空（删除物品）

`it.setNull()`

- 返回值：是否删除成功
- 返回值类型： `Boolean`



#### 将此物品对象设置为另一个物品

`it.set(item)`

- 参数：
  - item : `Item`  
    要赋值的物品对象
- 返回值：是否赋值成功
- 返回值类型： `Boolean`



#### 设置物品耐久度

`it.setDamage(damage)`

- 参数: 
  - damage : `Integer`  
    耐久度
- 返回值: 是否设置成功
- 返回值类型:  `Boolean`



#### 设置物品的附加值

`it.setAux(aux)`

- 参数：
  - aux : `Integer`  
    物品附加值
- 返回值：是否设置成功
- 返回值类型： `Boolean`



#### 根据物品对象生成掉落物实体

根据物品对象，在指定位置生成一个内容相同的掉落物实体。

`mc.spawnItem(item,pos)`    
`mc.spawnItem(item,x,y,z,dimid)`  

- 参数：
  - item : `Item`  
    用于生成掉落物实体的物品对象
  - pos : `IntPos `/ `FloatPos`  
    生成掉落物实体的坐标对象（或使用 x, y, z, dimid 指定生成位置）
- 返回值：生成的掉落物实体对象
- 返回值类型：`Entity`
  - 若返回值为 `Null`，则表示生成失败



#### 获取物品对应的NBT对象

`it.getNbt()`

- 返回值：物品的 NBT 对象
- 返回值类型：`NbtCompound`



#### 写入物品对应的NBT对象

`it.setNbt(nbt)`

- 参数：
  - nbt : `NbtCompound`  
    NBT 对象
- 返回值：是否成功写入
- 返回值类型：`Boolean`

关于 NBT 对象的更多用法，请参考 [NBT接口文档](../NbtAPI/NBT.zh.md)。



#### 设置自定义Lore

`it.setLore(names)`

- 参数：
  - names : `Array<String,String,...>`  
    要设置的 Lore 字符串数组
- 返回值：是否设置成功
- 返回值类型： `Boolean`

!!! warning
    在 0.19.1 及更高版本中，传入空数组会清空物品 Lore。



#### 设置自定义物品名称

`it.setDisplayName(name)`

- 参数: 
  - name : `String`  
    新的物品名称
- 返回值: 是否设置成功
- 返回值类型: `Boolean`

#### 获取自定义物品名称

!!! warning
    此函数仅适用于 0.19.1 及以上版本

`it.getDisplayName()`

- 返回值: 自定义物品名称
- 返回值类型: `String`



#### 判断是否为同类物品

`it.match(item)`

- 参数: 
  - item : `Item`  
    待比较的物品
- 返回值: 是否为同类物品
- 返回值类型: `Boolean`

#### 增加物品数量

!!! warning
    此函数仅适用于 0.19.1 及以上版本

`it.addCount(count)`

- 参数:
  - count : `Integer`
    要增加的数量
- 返回值: 是否设置成功
- 返回值类型: `Boolean`

#### 减少物品数量

!!! warning
    此函数仅适用于 0.19.1 及以上版本

`it.removeCount(count)`

- 参数:
  - count : `Integer`
    要减少的数量
- 返回值: 是否设置成功
- 返回值类型: `Boolean`

#### 设置物品数量

!!! warning
    此函数仅适用于 0.19.1 及以上版本

`it.setCount(count)`

- 参数:
  - count : `Integer`
    要设置的数量
- 返回值: 是否设置成功
- 返回值类型: `Boolean`


