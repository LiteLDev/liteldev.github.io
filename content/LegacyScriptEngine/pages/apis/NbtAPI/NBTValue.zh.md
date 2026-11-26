# 📋 NBT - 普通数据类型

除 `NbtList` 和 `NbtCompound` 以外的 NBT 对象统称为 **普通数据** 类型。这类对象仅储存简单数据，不含其他复杂结构。

### 获取一个 NBT 普通数据对象

#### 从现有的NBT对象中解析获取

详见 [NbtList - 列表类型](./NBTList.zh.md) 和 [NbtCompound - 标签类型](./NBTCompound.zh.md) 文档。



#### 创建新的NBT数据对象

[JavaScript]  
`new NbtByte([data])`  
`new NbtShort([data])`  
`new NbtInt([data])`  
`new NbtLong([data])`  
`new NbtFloat([data])`  
`new NbtDouble([data])`   
`new NbtByteArray([data])`  
`new NbtString([data])`  
[Lua]  
`NbtByte([data])`  
`NbtShort([data])`  
`NbtInt([data])`  
`NbtLong([data])`  
`NbtFloat([data])`  
`NbtDouble([data])`   
`NbtByteArray([data])`  
`NbtString([data])`  

- 参数：
  - data: `Number` / `Float` / `Double` / `ByteBuffer` / `String`（可选参数）  
    所创建对象的初始数据，传入值的类型必须与目标对象类型匹配。  
    此参数可省略。
- 返回值：生成的 NBT 对象。
- 返回值类型：`NbtByte` / `NbtShort` / `NbtInt` / `NbtLong` / `NbtFloat` / `NbtDouble` / `NbtByteArray` / `NbtString`，取决于所选的数据类型。
  - 如果创建失败，将抛出异常。



储存普通数据类型的 NBT 对象 `value` 具有以下成员函数：

#### 设置对象的数据

`value.set(data)`

- 参数：
  - data : `Number` / `Float` / `Double` / `ByteBuffer` / `String`  
    要写入的数据，类型需与该 NBT 对象的数据类型一致。  
    例如，对于 `Float` 类型的 NBT 对象，需传入 `Float` 类型的值。
- 返回值：是否写入成功。
- 返回值类型：`Boolean`



#### 读取对象的数据

`value.get()`

- 返回值：对象中储存的数据。
- 返回值类型：``Number` / `Float` / `Double` / `ByteBuffer` / `String`，以实际储存的数据类型为准。


