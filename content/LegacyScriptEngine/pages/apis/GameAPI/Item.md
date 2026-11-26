# 🧰 Item Object API

In LSE, use "item objects" to get information about and manipulate items in an inventory.

### Get an Item Object

#### Get From Event or API

Get an item object from BDS by registering an **event listener** function or calling a **returning item object** function. For details, see [Event listener documentation - EventAPI](../EventAPI/Listen.md).

#### Generate New Item Object

This function generates a new item object from the given information.

`mc.newItem(name,count)`  

- Parameters: 
  - name : `String`  
    The standard type name of the item, such as `minecraft:bread`.
  - count : `Integer`  
    The number of items to create. The maximum value is `64` due to `unsigned __int8`.
- Return value: The generated item object.
- Return value type: `Item`
  - If the return value is `Null`, item generation failed.
  - If no item with this type name exists, an exception is thrown.

#### Clone From an Existing Item Object


This function clones a new item object from an existing one. The new item object is independent of the old object. For an existing item object item, use the following function:

`item.clone()`  

- Return value: The cloned item object.
- Return value type: `Item`
  - If the return value is `Null`, item generation failed.

#### Generate Item Objects via **NBT**

This function generates a new item object from NBT.

`mc.newItem(nbt)`  

- Parameters: 
  - nbt : `NbtCompound`  
    The item NBT used to generate the item object.
- Return value: The generated item object.
- Return value type: `Item`
  - If the return value is `Null`, item generation failed.

> Note: Do not store an item object long-term.
> When the underlying item is destroyed, the corresponding item object becomes invalid. If you need to work with an item over a long period, retrieve a fresh item object in real time using the methods above.



### Item Object - Properties

Every item object has a fixed set of properties. An item object `it` has the following attributes:

| Attributes          | Meaning                                                  | Data Type                  |
|---------------------|----------------------------------------------------------|----------------------------|
| it.name             | Item's in-game name                                      | `String`                   |
| it.type             | Item standard type name                                  | `String`                   |
| it.id               | Item's in-game ID                                        | `Integer`                  |
| it.count            | Item's count                                             | `Integer`                  |
| it.maxCount         | Item's max count (Added in 0.16.1)                       | `Integer`                  |
| it.aux              | Item's data value (for example, wool color or wood type) | `Integer`                  |
| it.lore             | Item lore                                                | `Array<String, String...>` |
| it.damage           | Item consumed damage                                     | `Integer`                  |
| it.attackDamage     | Item attack damage                                       | `Integer`                  |
| it.maxDamage        | Item max damage                                          | `Integer`                  |
| it.maxStackSize     | Item's max stack size                                    | `Integer`                  |
| it.isArmorItem      | Whether the item is an armor item                        | `Boolean`                  |
| it.isBlock          | Whether the item is a block                              | `Boolean`                  |
| it.isDamageableItem | Whether the item is damageable                           | `Boolean`                  |
| it.isDamaged        | Whether the item is damaged                              | `Boolean`                  |
| it.isEnchanted      | Whether the item is enchanted                            | `Boolean`                  |
| it.isEnchantingBook | Whether the item is an enchanting book                   | `Boolean`                  |
| it.isFireResistant  | Whether the item is fire-resistant                       | `Boolean`                  |
| it.isFullStack      | Whether the item is a full stack                         | `Boolean`                  |
| it.isGlint          | Whether the item has a glint                             | `Boolean`                  |
| it.isHorseArmorItem | Whether the item is horse armor                          | `Boolean`                  |
| it.isLiquidClipItem | Whether the item is a liquid clip                        | `Boolean`                  |
| it.isMusicDiscItem  | Whether the item is a music disc                         | `Boolean`                  |
| it.isOffhandItem    | Whether the item can be held in the second hand          | `Boolean`                  |
| it.isPotionItem     | Whether the item is a potion                             | `Boolean`                  |
| it.isStackable      | Whether the item is stackable                            | `Boolean`                  |
| it.isWearableItem   | Whether the item is wearable                             | `Boolean`                  |

These properties are read-only and cannot be modified.



### Item Object - Properties

Each item object provides member functions (member methods) that you can call. For an item object `it`, you can use the following functions to operate on the item:

> Note: After modifying items in a player's inventory, remember to call the player object's `pl.refreshItems()` member function to refresh the inventory displayed on the client.

#### Check if the Item Object Is Empty

`it.isNull()`

For example, when a grid contains no item, the item object you get is empty.

- Return value: Whether this item object is empty.
- Return value type:  `Boolean`



#### Make This Item Object Empty (Delete Item)

`it.setNull()`

- Return value: Whether the deletion succeeded.
- Return value type:  `Boolean`



#### Set This Item Object to Another Item 

`it.set(item)`

- Parameters: 
  - item : `Item`  
    The item object to assign.
- Return value: Whether the assignment succeeded.
- Return value type:  `Boolean`



#### Damage Item

`it.setDamage(damage)`

- Parameters: 
  - damage : `Integer`  
    Damage to highlight.
- Return value: Whether the assignment succeeded.
- Return value type:  `Boolean`



#### Set the Data Value of an Item 

`it.setAux(aux)`

- Parameters: 
  - aux : `Integer`  
    Item's auxiliary/data value (for example, wool color or wood plank type).
- Return value: Whether the data value was successfully set.
- Return value type:  `Boolean`



#### Generate Drop Entities From Item Objects

Spawns a drop entity with the same content as the given item object at the specified location.

`mc.spawnItem(item,pos)`    
`mc.spawnItem(item,x,y,z,dimid)`  

- Parameters: 
  - item : `Item`  
    The item object used to spawn the drop entity.
  - pos : `IntPos `/ `FloatPos`  
    The coordinates where the drop entity spawns (or use x, y, z, and dimid to specify the spawn position).
- Return value: The spawned drop entity object.
- Return value type: `Entity`
  - Returns `Null` if spawning the item fails.



#### Get the Item's NBT Object

`it.getNbt()`

- Return value: The item's NBT object.
- Return value type: `NbtCompound`



#### Write to the Item's NBT Object 

`it.setNbt(nbt)`

- Parameters: 
  - nbt : `NbtCompound`  
    The NBT object.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

For more information on using NBT objects, see [NBT Interface Documentation](../NbtAPI//NBT.md).



#### Set Custom Item Lore

`it.setLore(names)`

- Parameters: 
  - names : `Array<String,String,...>`  
    An array of lore strings to set.
- Return value: Whether setting the lore succeeded.
- Return value type:  `Boolean`

!!! warning
    In 0.19.1 and later, passing an empty array clears the item's lore.



#### Set Custom Item Name

`it.setDisplayName(name)`

- Parameters: 
  - name : `String`  
    The new item name.
- Return value: Whether setting the name succeeded.
- Return value type:  `Boolean`

#### Get Custom Item Name

!!! warning
    This function is only available in 0.19.1 and later.

`it.getDisplayName()`

- Return value: The custom item name.
- Return value type: `String`



#### Determine if it is the same kind of item

`it.match(item)`

- Parameters: 
  - item : `Item`  
    The item to compare against.
- Return value: Whether the items are of the same kind.
- Return value type:  `Boolean`

#### Increase Item Count

!!! warning
    This function is only available in 0.19.1 and later.

`it.addCount(count)`

- Parameters:
  - count : `Integer`
    The amount to add.
- Return value: Whether the change succeeded.
- Return value type:  `Boolean`

#### Decrease Item Count

!!! warning
    This function is only available in 0.19.1 and later.

`it.removeCount(count)`

- Parameters:
  - count : `Integer`
    The amount to remove.
- Return value: Whether the change succeeded.
- Return value type:  `Boolean`

#### Set Item Count

!!! warning
    This function is only available in 0.19.1 and later.

`it.setCount(count)`

- Parameters:
  - count : `Integer`
    The amount to set.
- Return value: Whether setting the count succeeded.
- Return value type:  `Boolean`


