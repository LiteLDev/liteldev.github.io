# 👜 Container Object API

In LSE, "container objects" are used to manipulate containers that have slots for storing and placing items.
Here, **container** is a broad concept. Beyond traditional containers like chests and barrels, player inventories, chests carried by llamas, and similar storage can also be obtained and manipulated as "containers" using the corresponding container APIs.

### Get a Container Object

#### Get From Event or API

You can obtain a container object provided by BDS by registering an **event listener** function or calling a **returning container object** function.
For details, see [Event listener documentation - EventAPI](../EventAPI/Listen.md).

#### Get By Entity 

You can obtain a **container object** for a player's inventory, armor slots, or ender chest through the member functions of the player object.
See [Player Object API](./Player.md).

#### Obtained From Blocks

For a block that can hold items, you can obtain its **container object** through the member function of the block object.
See [Block Object API](./Block.md).

> Note: Do not store a container object long-term.
> When the entity or block corresponding to a container object is destroyed, the container object becomes invalid. If you need to operate on a container over a long period, obtain a fresh container object in real time using the methods above.



### Container Info Object - Properties

Every container object has a fixed set of properties. A specific container object `ct` has the following properties:

| Attributes | Meaning                                      | Data Types |
| ---------- | -------------------------------------------- | ---------- |
| ct.size    | The total number of slots in the container   | `Integer`  |
| ct.type    | The type of container                        | `String`   |



### Container Object - Function

Every container object has member functions (methods) that you can call. For a specific container object `ct`, you can perform operations on the container using the following functions:

> Attention! After modifying items in a player's inventory, remember to call the player object's `pl.refreshItems` member function to refresh the inventory displayed on the client.

#### Put the Item Object Into the Container  

`ct.addItem(item[, amount])`  

- Parameters: 
  - item : `Item`  
    The item to add to the container.
    
  - amount : `Integer`
  
    (Optional) If provided, the item's original count property is ignored.
- Return type: Whether the item was added successfully.
- Return value type: `Boolean`



#### Put the Item Object Into the First Empty Space of the Container

`ct.addItemToFirstEmptySlot(item)`  

- Parameters: 
  - item : `Item`  
    The item to add to the container.
- Return type: Whether the item was added successfully.
- Return value type: `Boolean`

Unlike the function above, this function does not merge the item into existing item stacks in the container.



#### Check to See if (There Is Room) In the Container for This Item 

`ct.hasRoomFor(item)`  

- Parameters: 
  - item : `Item`  
    The item to place in the container.
- Return type: Whether the item can be placed in the container.
- Return value type: `Boolean`



#### Reduce an Item Object in a Container

`ct.removeItem(index,count)`  

- Parameters: 
  - index : `Integer`  
    The slot index in the container where the item is located.
  - count : `Integer`  
    The number of items to remove from the container. If this is greater than or equal to the number of items in the slot, the item stack is cleared.
- Return type: Whether the item was removed successfully.
- Return value type: `Boolean`



#### Get the Item Object of a Grid in the Container

`ct.getItem(index)`  

- Parameters: 
  - index : `Integer`  
    The container slot index where the item is located.
- Return type: The item object at the slot index.
- Return value type: `Item`

The returned item object is a reference. Modifying it or calling its API directly modifies the corresponding item in the container.



#### Set the Item Object of a Grid in the Container

`ct.setItem(index,item)`  

- Parameters: 
  - index : `Integer`  
    The container slot index where the item will be placed.
  - item : `Item`  
    The item to place in the container.
- Return type: Whether the item was placed in the container successfully.
- Return value type: `Boolean`



#### Get the List of Item Objects in All Grids of the Container

`ct.getAllItems()`  

- Return type: All item objects in the container.
- Return value type: `Array<Item,Item,...>`

All returned item objects are references. Modifying any of them or calling their APIs directly modifies the corresponding item in the container.



#### Empty The Container

`ct.removeAllItems()`  

- Returns: Whether the container was cleared.
- Return type: `Boolean`



#### Check if the Container Is Empty

`ct.isEmpty()`  

- Returns: Whether the container is empty.
- Return type: `Boolean`
