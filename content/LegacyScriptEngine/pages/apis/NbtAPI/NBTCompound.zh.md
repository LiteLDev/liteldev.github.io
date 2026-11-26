# 📒 NbtCompound - 标签类型

`NbtCompound` 代表一个完整的标签，内部储存了一系列键值对，结构类似于对象或表。  
NBT 标签独有的操作必须通过 `NbtCompound` 对象的接口来进行。

### 获取一个 NBT 标签对象

#### 从现有的 NBT 对象中解析获取

详见 [NbtList - 列表类型](./NBTList.zh.md) 和 [NbtCompound - 标签类型](./NBTCompound.zh.md) 文档。



#### 创建新的 NBT 标签对象

[JavaScript]  `new NbtCompound([data])`  
[Lua] `NbtCompound([data])`

- 参数：
  - data：Object<string, NBT Object>（可选参数）  
    传入一个由 NBT 对象构成的对象。对象中允许包含其他数组或对象结构，但内部元素必须全为 NBT 对象。`Null` 会被视为 `NBT.End`。
- 返回值：生成的 NBT 对象
- 返回值类型：`NbtCompound`
  - 如果创建失败，将抛出异常

[JavaScript]
```js
var nbt = new NbtCompound({
        "name1": new NbtInt(3),
        "name2": new NbtString("test"),
        "name3": new NbtList([
            new NbtFloat(4.0),
            new NbtFloat(6.0)
        ]),
        "name4": new NbtLong(66666)
    });
```
[Lua]
```lua
local nbt = NbtCompound({
        "name1" = NbtInt(3),
        "name2" = NbtString("test"),
        "name3" = NbtList({
            NbtFloat(4.0),
            NbtFloat(6.0)
        }),
        "name4" = NbtLong(66666)
    });
```



#### 从 SNBT 字符串生成 NBT 标签对象

`NBT.parseSNBT(snbt)`  

- 参数：
  - snbt：`String`  
    要解析的 SNBT 字符串
- 返回值：生成的 NBT 对象
- 返回值类型：`NBT Object`
  - 如返回值为 `Null` 则表示解析失败

> 支持脚本层已暴露的 SNBT 值类型，包括普通值、`List` 和 `Compound`。



#### 从二进制 NBT 数据生成 NBT 标签对象

`NBT.parseBinaryNBT(nbt)`  

- 参数：
  - nbt：`ByteBuffer`  
    要解析的二进制 NBT 数据
- 返回值：生成的 NBT 对象
- 返回值类型：`NbtCompound`
  - 如返回值为 `Null` 则表示解析失败

> 二进制 NBT 数据中必须包含一个完整的 Compound。

`NbtCompound` 类型的对象 `comp` 提供以下接口：

#### 获取所有的键

`comp.getKeys()`

- 返回值：Compound 中所有的键
- 返回值类型：`Array<String,String,...>`



#### 获取键对应的值的数据类型

`comp.getTypeOf(key)`

- 参数：
  - key：`String`  
    要查询的键名
- 返回值：对应的值的数据类型
- 返回值类型：`Enum`
  - 如果要读取的 NBT 不存在，将返回 `Null`

可能的返回值有：`NBT.End` `NBT.Byte` `NBT.Short` `NBT.Int` `NBT.Long`   
`NBT.Float` `NBT.Double` `NBT.ByteArray` `NBT.String`  
`NBT.List` `NBT.Compound`



#### 设置键对应的 NBT 对象

`comp.setTag(key,tag)`

- 参数：
  - key：`String`   
    要操作的键名
  - tag： `NBT Object`  
    要写入的 NBT 对象（承载具体的 NBT 数据）。  
    如果键已存在，将直接替换原有标签；如果键不存在，则新建该键值对。
    传入 `Null` 时会写入 `NBT.End`。
- 返回值：CompoundTag 自身
- 返回值类型：`NbtCompound`



#### 读取键对应的 NBT 对象

`comp.getTag(key)`

- 参数：
  - key：`String`   
    要操作的键名
- 返回值：键对应的 NBT 对象
- 返回值类型： `NBT Object`
  - 如果要读取的 NBT 不存在，将返回 `Null`



#### 判断键是否存在

`comp.hasTag(key)`

- 参数：
  - key：`String`
    要查询的键名
- 返回值：该键是否存在于当前 Compound 中
- 返回值类型：`Boolean`



#### 删除键对应的 NBT 对象

`comp.removeTag(key)`

- 参数：
  - key：`String`  
    要操作的键名。该键名必须已存在
- 返回值：处理完毕的 NBT 对象（便于连锁进行其他操作）
- 返回值类型：`NbtCompound`



## 一些协助 NBT 对象操作的方便函数

修改 NBT 的值时，如果只使用 NBT 对象，语法会显得繁琐复杂。  
为此，这里提供了一些简化对象操作的辅助函数，无需通过 NBT 对象中转即可直接操作指定位置的数据，从而减少代码量。

#### 设置键对应的值的具体数据

`comp.setEnd(key)`  
`comp.setByte(key,data)`  
`comp.setShort(key,data)`  
`comp.setInt(key,data)`  
`comp.setLong(key,data)`  
`comp.setFloat(key,data)`  
`comp.setDouble(key,data)`  
`comp.setByteArray(key,data)`  
`comp.setString(key,data)`    

- 参数：
  - key：`String`   
    要操作的键名
  - data：`上述类型`  
    要写入的具体数据。  
    如果键不存在，会自动创建对应的键值
- 返回值：写入完毕的 NBT 对象（便于连锁进行其他操作）
- 返回值类型：`NbtCompound`



#### 读取键对应的值的具体数据

`comp.getData(key)`  

- 参数：
  - key：`String`   
    要操作的键名
- 返回值：键对应的值的具体数据
- 返回值类型：`任意类型`，以储存的数据类型为准
  - 如果目标位置储存的是 `List` 类型的 NBT，将返回 `NbtList` 对象；如果储存的是 `Compound` 类型的 NBT，将返回 `NbtCompound` 对象
  - 如果要读取的 NBT 不存在，将返回 `Null`



#### 将 NBT 标签对象转换为 Object

`comp.toObject()`

- 返回值：对应的对象 / 表
- 返回值类型：`Object`

将 Compound 的内容转换为脚本引擎对象，把各个数据项转换为脚本引擎的数据类型并储存在对应的键名下，以便读取和处理。  
如果 Compound 的某一项储存的是 `List` 或 `Compound` 类型的 NBT，则会在对应位置递归展开为 `Array` 或 `Object`。



#### 将 NBT 标签对象序列化为 SNBT
`comp.toSNBT([space[,format]])`

- 参数
  - space : `Integer`  
    （可选参数）如需格式化输出的字符串，可传入此参数。  
    代表每个缩进的空格数量，使生成的字符串更易于阅读。  
    此参数默认为 -1，即不对输出字符串进行格式化。
  - format : `Enum`
    （可选参数）SNBT 输出格式，使用 `SnbtFormat` 枚举中的值
- 返回值：对应的 SNBT 字符串
- 返回值类型：`String`

调用 `comp.toSNBT()` 时，默认使用 `SnbtFormat.ForceQuote`。  
调用 `comp.toSNBT(space)` 且 `space >= 0` 时，默认使用 `SnbtFormat.PartialLineFeed`。  
如需显式指定其他 SNBT 格式，请使用 `comp.toSNBT(space, format)`。

> 除了普通的二进制 NBT 之外，另一种玩家更熟悉的 NBT 是纯文本形式的，通常在[命令](https://zh.minecraft.wiki/w/命令)里使用。这种格式常被称为**SNBT**（**字符串化的二进制命名标签**，**S**tringified **NBT**）
>
> --- Minecraft Wiki



#### 将 NBT 标签对象 序列化为二进制 NBT

`comp.toBinaryNBT()`

- 返回值：对应的二进制 NBT 数据
- 返回值类型：`ByteBuffer`
> 只有完整的顶层 Compound 标签才能转换为二进制 NBT。



#### 销毁此 NBT 标签对象
`comp.destroy()`

- 返回值：是否成功清理
- 返回值类型：`Boolean`

注意，只有根 Compound 标签可以被销毁。请谨慎使用此函数，使用不当会导致服务器崩溃。  
适时销毁对象有助于减少内存占用。销毁后，请勿再使用此 NBT 对象及其任何子对象。
