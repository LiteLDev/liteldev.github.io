# 📚 NbtList - List type

An `NbtList` stores a sequence of NBT objects, much like a list or array, and provides methods specific to NBT lists.

### Get an NBT List Object

#### Parse From an Existing NBT Object

See the [NbtList - List Type](./NBTList.md) and [NbtCompound - Tag Type](./NBTCompound.md) documentation.



#### Create a New NBT List Object

[JavaScript]  `new NbtList([data])`  
[Lua] `NbtList([data])`

- Parameter: 
  - data : `Array<NBT object>` (optional parameter)   
    An array of NBT objects. The array may contain nested array or object structures, as long as all elements are NBT objects. `Null` values are treated as `NBT.End`.
- Return value: The created NBT object.
- Return value type: `NbtList`
  - Throws an exception if creation fails.



An `NbtList` object `list` provides the following methods.

#### Get List Length

`list.getSize()`

- Return value: The length of the list.
- Return value type: `Integer`



#### Get the Data Type of an Element Stored in a List at the Index Position Given

`list.getTypeOf(index)`

- Parameter: 
  - index : `Integer`  
    The index of the element to query.
- Return value: The data type of the NBT stored at this index.
- Return value type: `Enum`
  - Returns `Null` if the NBT at that index does not exist.

Possible return values: `NBT.End` `NBT.Byte` `NBT.Short` `NBT.Int` `NBT.Long`   
`NBT.Float` `NBT.Double` `NBT.ByteArray` `NBT.String`  
`NBT.List` `NBT.Compound`



#### Set a NBT Object in a List at the Index Position Given

`list.setTag(index,tag)`

- Parameters: 
  - index : `Integer`  
    The target index.
  - tag: `NBT object`   
    The NBT object to write. Passing `Null` writes `NBT.End`. The index must already exist; the existing element at that position is replaced.
- Return value: The modified NBT list (for method chaining).
- Return value type: `NbtList`



#### Read NBT Object in a List at the Index Position Given

`list.getTag(index)`

- Parameter: 
  - index : `Integer`  
    The target index.
- Return value: The NBT object at the given index.
- Return value type: `NBT object`
  - Returns `Null` if the NBT at that index does not exist.



#### Append an NBT Object to the End of the List

`list.addTag(tag)`

- Parameter: 
  - tag: `NBT object`  
    The NBT object to append to the list. Passing `Null` appends `NBT.End`.
- Return value: The modified NBT list (for method chaining).
- Return value type: `NbtList`



#### Delete an NBT Object at the Given Index Position

`list.removeTag(index)`

- Parameter: 
  - index : `Integer`  
    The index of the NBT object to delete.  
    The index cannot exceed the number of NBT objects in the list.
- Return value: The modified NBT list (for method chaining).
- Return value type: `NbtList`



## Some Convenience Functions to Assist in the Manipulation of NBT Objects

Working strictly with NBT objects can make modifying values verbose and cumbersome. The following helper methods let you read and write data at a given index directly, without wrapping or unwrapping NBT objects, which keeps your code shorter.

#### Set Data at a Specific Position

`list.setEnd(index)`  
`list.setByte(index,data)`  
`list.setShort(index,data)`  
`list.setInt(index,data)`  
`list.setLong(index,data)`  
`list.setFloat(index,data)`  
`list.setDouble(index,data)`  
`list.setByteArray(index,data)`      
`list.setString(index,data)`    

- Parameter: 
  - index : `Integer`  
    The target index.
  - data: `Number` / `Float` / `Double` / `ByteBuffer` / `String`  
    The data to write.  
    The index must already exist. The existing element at that position is replaced with an NBT of the corresponding type.
- Return value: The modified NBT list (for method chaining).
- Return value type: `NbtList`



#### Read the Specific Data of a Subscript Position 

`list.getData(index)`  

- Parameter: 
  - index : `Integer`  
    The target index.
- Return value: The data stored at the specified index in the list.
- Return value type: `Number` / `Float` / `Double` / `ByteBuffer` / `String`, matching the data type stored by the object.
  - If the target index holds a `List` NBT, this returns an `NbtList` object; if it holds a `Compound` NBT, this returns an `NbtCompound` object.
  - Returns `Null` if the NBT at that index does not exist.



#### Convert List Type to Array

`list.toArray()`

- Return value: The array form of the list.
- Return value type: `Array`

Converts the contents of a List into an LSE array/list for easy reading and processing. Each data item is converted to its corresponding LSE data type and stored at the matching index in the array/list.
If an item in the List is of type `List` or `Compound`, it is recursively expanded at the corresponding position into an `Array` or `Object`.


