# 📚 NbtList - 列表类型

`NbtList` 表示一个储存了一组 NBT 对象的列表，结构类似于列表或数组。  
你可以通过 `NbtList` 对象提供的接口执行 NBT 列表特有的操作。  

### 获取一个 NBT 列表对象

#### 从现有的NBT对象中解析获取

详见 [NbtList - 列表类型](./NBTList.zh.md) 和 [NbtCompound - 标签类型](./NBTCompound.zh.md) 文档。



#### 创建新的NBT列表对象

[JavaScript]  `new NbtList([data])`  
[Lua] `NbtList([data])`

- 参数：
  - data : `Array<NBT对象>`（可选参数）  
    由 NBT 对象组成的数组。数组中可以嵌套其他数组或对象结构，但所有元素都必须是 NBT 对象。`Null` 会被视为 `NBT.End`。
- 返回值：生成的 NBT 对象
- 返回值类型：`NbtList`
  - 如果创建失败，将抛出异常。



`NbtList` 类型的对象 `list` 提供以下接口：

#### 获取列表长度

`list.getSize()`

- 返回值：此列表的长度
- 返回值类型：`Integer`



#### 获取某个下标位置储存的数据类型

`list.getTypeOf(index)`

- 参数：
  - index : `Integer`  
    要查询的目标下标
- 返回值：此下标处储存的 NBT 的数据类型
- 返回值类型：`Enum`
  - 如果要读取的 NBT 不存在，则返回 `Null`。

可能的返回值包括：`NBT.End` `NBT.Byte` `NBT.Short` `NBT.Int` `NBT.Long`   
`NBT.Float` `NBT.Double` `NBT.ByteArray` `NBT.String`  
`NBT.List` `NBT.Compound`



#### 设置某个下标位置的NBT对象

`list.setTag(index,tag)`

- 参数：
  - index : `Integer`  
    要操作的目标下标
  - tag: `NBT对象`   
    要写入的 NBT 对象。传入 `Null` 时会写入 `NBT.End`。目标下标必须已存在，原有元素会被直接替换。
- 返回值：写入完毕的 NBT 列表（便于进行链式调用）
- 返回值类型：`NbtList`



#### 读取某个下标位置的NBT对象

`list.getTag(index)`

- 参数：
  - index : `Integer`  
    要操作的目标下标
- 返回值：下标位置的 NBT 对象
- 返回值类型：`NBT对象`
  - 如果要读取的 NBT 不存在，则返回 `Null`。



#### 往列表末尾追加一个NBT对象

`list.addTag(tag)`

- 参数：
  - tag: `NBT对象`  
    要追加的 NBT 对象。传入 `Null` 时会追加 `NBT.End`。
- 返回值：追加完毕的 NBT 列表（便于进行链式调用）
- 返回值类型：`NbtList`



#### 删除某个下标位置的NBT对象

`list.removeTag(index)`

- 参数：
  - index : `Integer`  
    要删除的目标下标。  
    下标不能超出最大有效下标。
- 返回值：处理完毕的 NBT 列表（便于进行链式调用）
- 返回值类型：`NbtList`



## 一些协助 NBT 对象操作的方便函数

修改 NBT 的值时，如果完全通过 NBT 对象来操作，语法往往较为繁琐。  
为此，我们还提供了一些简化对象操作的辅助函数。它们可以直接读写指定位置的数据，省去通过 NBT 对象中转的步骤，从而减少代码量。

#### 设置某个下标位置的具体数据

`list.setEnd(index)`  
`list.setByte(index,data)`  
`list.setShort(index,data)`  
`list.setInt(index,data)`  
`list.setLong(index,data)`  
`list.setFloat(index,data)`  
`list.setDouble(index,data)`  
`list.setByteArray(index,data)`      
`list.setString(index,data)`    

- 参数：
  - index : `Integer`  
    要操作的目标下标
  - data: `Number` / `Float` / `Double` / `ByteBuffer` / `String`  
    要写入的具体数据。  
    目标下标必须已存在，原有元素会被替换为对应的 NBT 类型。
- 返回值：写入完毕的 NBT 列表（便于进行链式调用）
- 返回值类型：`NbtList`



#### 读取某个下标位置的具体数据

`list.getData(index)`  

- 参数：
  - index : `Integer`  
    要操作的目标下标
- 返回值：指定位置储存的具体数据
- 返回值类型：`Number` / `Float` / `Double` / `ByteBuffer` / `String`（以对象实际储存的数据类型为准）
  - 如果目标位置储存的是 `List` 类型的 NBT，则返回 `NbtList` 对象；如果储存的是 `Compound` 类型的 NBT，则返回 `NbtCompound` 对象。
  - 如果要读取的 NBT 不存在，则返回 `Null`。



#### 将List类型转换为Array

`list.toArray()`

- 返回值：对应的数组 / 列表
- 返回值类型：`Array`

将 List 的内容转换为脚本引擎的数组 / 列表，并把各个数据项转换为脚本引擎对应的数据类型后存入相应下标，以便读取和处理。  
如果 List 的某一项是 `List` 或 `Compound` 类型的 NBT，则会在对应位置递归展开为 `Array` 或 `Object`。


