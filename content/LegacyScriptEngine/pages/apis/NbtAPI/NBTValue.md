# 📋 NBT - Normal Data Type

All NBT objects other than `NbtList` and `NbtCompound` are collectively called **normal data** types. These objects store only simple data and contain no complex internal structures.

### Get an NBT Normal Data Object

#### Parse From an Existing NBT Object

See the [NbtList - List Type](./NBTList.md) and [NbtCompound - Tag Type](./NBTCompound.md) documentation.



#### Create a New NBT Data Object

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

- Parameters: 
  - data: `Number` / `Float` / `Double` / `ByteBuffer` / `String` (Optional)  
    The initial data, matching the type of object you want to create. The passed value must be able to initialize that type.  
- Return value: The created NBT object.
- Return value type: `NbtByte` / `NbtShort` / `NbtInt` / `NbtLong` / `NbtFloat` / `NbtDouble` / `NbtByteArray` / `NbtString`, depending on the data type.
  - Throws an exception if creation fails.



An NBT object `value` that stores a normal data type provides the following member functions.

#### Set Object Data

`value.set(data)`

- Parameter: 
  - data: `Number` / `Float` / `Double` / `ByteBuffer` / `String`  
    Data of the type that matches this NBT object.  
    For example, pass a `Float` value to an `NbtFloat` object.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`



#### Read Object Data.

`value.get()`

- Return value: The data stored in the object.
- Return value type: ``Number` / `Float` / `Double` / `ByteBuffer` / `String`, depending on the type of data stored.


