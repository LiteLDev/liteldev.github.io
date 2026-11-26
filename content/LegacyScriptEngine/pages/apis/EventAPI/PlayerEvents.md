# 🏃‍♂️ Player Related Events

#### `"onPreJoin"` - Player Connection Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player connecting to the server.
- Intercept events: function returns `false`

Note: Because the player has not fully entered the server at this point, only basic player information is available in this listener function, such as name, IP, and XUID.



#### `"onJoin"` - Player Join Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player entering the game.
- Intercept events: function returns `false`



#### `"onLeft"` - Player Leave Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player who left the game.

- Intercept event: cannot be intercepted.



#### `"onRespawn"` - Player Respawn Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player being respawned.
- Intercept event: cannot be intercepted.



#### `"onPlayerDie"` - Player Death Event

- Listener function prototype 
  `function(player,source)`
- Parameters: 
  - player : `Player`  
    The player who died.
  - source : `Entity`  
    The entity that dealt the fatal damage to the player (may be `Null`).
  
- Intercept event: cannot be intercepted.



#### `"onPlayerCmd"` - Player Command Execution Event

- Listener function prototype 
  `function(player,cmd)`
- Parameters: 
  - player : `Player`  
    The player who executed the command.
  - cmd : `String`  
    The command being executed.

- Intercept events: function returns `false`



#### `"onChat"` - Player Chat Event

- Listener function prototype 
  `function(player,msg)`
- Parameters: 
  - player : `Player`  
    The player who sent the message.
  - msg : `String`  
    The message that was sent.

- Intercept events: function returns `false`



#### `"onChangeDim"` - Player Dimension Switch Event

- Listener function prototype 
  `function(player,dimid)`
- Parameters: 
  - player : `Player`  
    The player who switched dimensions.
  - dimid : `Integer`  
    The ID of the target dimension: 0 is the Overworld, 1 is the Nether, and 2 is the End.
- Intercept event: cannot be intercepted.

Reminder: This event does not fire when the player returns to the Overworld from the End via a return portal.



#### `"onJump"` - Player Jump Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player who jumped.

- Intercept event: cannot be intercepted.



#### `"onSneak"` - Player Sneak Event

- Listener function prototype 
  `function(player,isSneaking)`
- Parameters: 
  - player : `Player`  
    The player who toggled their sneak state.
  - isSneaking : `Boolean`  
    `True` indicates that the player is sneaking; `False` indicates that the player is no longer sneaking.

- Intercept events: function returns `false`



#### `"onPlayerSwing"` - Player Swing Arm Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player who swung their arm.

- Intercept event: cannot be intercepted.



#### `"onAttackEntity"` - Player Attack Other Event

- Listener function prototype 
  `function(player,entity)`
- Parameters: 
  - player : `Player` 
    The player who attacked an entity.
  - entity : `Entity` 
    The entity being attacked.

- Intercept events: function returns `false`



#### `"onAttackBlock"` - Player Attack Block Event

- Listener function prototype 
  `function(player,block,item)`

- Parameters: 

  - player : `Player` 
    The player who attacked the block.
  - block : `Block` 
    The attacked block.
  - item: `Item`
    The item used to attack the block.

- Intercept events: function returns `false`



#### `"onUseItem"` - Player Item Use Event 

- Listener function prototype 
  `function(player,item)`
- Parameters: 
  - player : `Player`  
    The player who used the item.
  - item : `Item`  
    The item that was used.
- Intercept events: function returns `false`



#### `"onUseItemOn"` - Player Use Item on Block Event (Right-Click)

- Listener function prototype 
  `function(player,item,block,side,pos)`
- Parameters: 
  - player : `Player`  
    The player who used the item.
  - item : `Item`  
    The item being used.
  - block : `Block`  
    The block that was right-clicked.
  - side : `Number`  
    The face of the block that was clicked.  
    The faces: `0`-Down `1`-Up `2`-North `3`-South `4`-West `5`-East
  - pos : `FloatPos`
    The position that was right-clicked.

- Intercept events: function returns `false`

Note: Right-clicking on the Win10 client triggers this event on the server multiple times in a row.



#### `"onUseBucketPlace"` - Players use bucket to pour things out on Block Event

- Listener function prototype 
  `function(player,item,block,side,pos)`
- Parameters:
  - player : `Player`  
    The player who used the item.
  - item : `Item`  
    The item being used.
  - block : `Block`  
    The block poured from the bucket (such as water or lava), at the position where it is placed.
  - side : `Number`  
    The face of the clicked object.   
    The faces: `0`-Down `1`-Up `2`-North `3`-South `4`-West `5`-East
  - pos : `FloatPos`  
    The position where the contents are poured out.

- Intercept events: function returns `false`

Note: A player may trigger this event on the server multiple times in a row.



#### `"onUseBucketTake"` - Players use bucket to pack in things Event

- Listener function prototype 
  `function(player,item,target,side,pos)`
- Parameters:
  - player : `Player`  
    The player who used the item.
  - item : `Item`  
    The item being used.
  - target : `Block`  
    The block being scooped into the bucket (water, lava, or powder snow).
  - side : `Number`  
    Always `-1`.
  - pos : `FloatPos`  
    The position of the block being scooped up.

- Intercept events: function returns `false`

Note: A player may trigger this event on the server multiple times in a row.



#### `"onTakeItem"` - Player Pickup Item Event

- Listener function prototype 
  `function(player,entity,item)`
- Parameters: 

  - player : `Player`  
    The player who picked up the item.
  - entity: `Entity`  
    The dropped item entity about to be picked up.
  - item : `Item`  
    The item about to be picked up.

- Intercept events: function returns `false`



#### `"onDropItem"` - Player Drop Item Event

- Listener function prototype 
  `function(player,item)`
- Parameters: 
  - player : `Player`  
    The player who dropped the item.
  - item : `Item`  
    The item being dropped.

- Intercept events: function returns `false`



#### `"onEat"` - Player Eating Event

- Listener function prototype 
  `function(player,item)`
- Parameters: 
  - player : `Player`  
    The player who is eating.
  - item : `Item`  
    The item being eaten.
  
- Intercept events: function returns `false`

Here, **Food** is a broad term that covers conventional food, potions, milk, medicines, and any other consumable items.



#### `"onAte"` - Player Ate Event

- Listener function prototype 
  `function(player,item)`
- Parameters: 
  - player : `Player`  
    The player who ate the item.
  - item : `Item`  
    The item that was eaten.
  
- Intercept events: function returns `false`

#### `"onConsumeTotem"` - Player Consume Totem Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player who consumes the totem.
- Intercept events: function returns `false`
  - If you intercept this event, the totem's resurrection effect still triggers, but the totem is not consumed.



#### `"onEffectAdded"` - Player Effect Added Event

- Listener function prototype 
  `function(player,effectName,amplifier,duration)`
- Parameters: 
  - player : `Player`  
    The player who receives the effect.
  - effectName : `String`  
    The name of the added effect: **minecraft:effect.EffectName**
  - amplifier : `Number` 
    The effect's amplifier (effect level -1).
  - duration : `Number` 
    The effect's duration (in ticks).
  
- Intercept events: function returns `false`



#### `"onEffectRemoved"` - Player Effect Removed Event

- Listener function prototype 
  `function(player,effectName)`
- Parameters: 
  - player : `Player`  
    The player who lost the effect.
  - effectName : `String`   
    The name of the removed effect: **minecraft:effect.EffectName**
  
- Intercept events: function returns `false`



#### `"onEffectUpdated"` - Player Effect Updated Event

- Listener function prototype 
  `function(player,effectName,amplifier,duration)`
- Parameters: 
  - player : `Player`  
    The player whose effect was updated.
  - effectName : `String`   
    The name of the refreshed effect: **minecraft:effect.EffectName**
  - amplifier : `Number` 
    The effect's amplifier (effect level -1).
  - duration : `Number` 
    The effect's duration (in ticks).
  
- Intercept events: function returns `false`



#### `"onStartDestroyBlock"` - Player Start Breaking Block Event

- Listener function prototype 
  `function(player,block)`
- Parameters: 
  - player : `Player`  
    The player who is breaking the block.
  - block : `Block`  
    The block being broken.

- Intercept events: function returns `false`



#### `"onDestroyBlock"` - Player Destroyed Block Event

- Listener function prototype 
  `function(player,block)`
- Parameters: 
  - player : `Player`  
    The player who broke the block.
  - block : `Block`  
    The broken block.

- Intercept events: function returns `false`



#### `"onPlaceBlock"` - Player Try Places Block Event

- Listener function prototype 
  `function(player,block,face)`
- Parameters: 
  - player : `Player`  
    The player who placed the block.
  - block : `Block`  
    The block about to be placed.
  - face : `Integer`  
    The face that was placed on.

- Intercept events: function returns `false`

> **ATTENTION** This event always fires when the player tries to place a block.



#### `"afterPlaceBlock"` - Player Placed Block Event

- Listener function prototype 
  `function(player,block)`
- Parameters: 
  - player : `Player`  
    The player who placed the block.
  - block : `Block`  
    The block that was placed.

- Intercept event: cannot be intercepted.



#### `"onOpenContainer"` - Player Opens Container Event

- Listener function prototype 
  `function(player,block)`
- Parameters: 
  - player : `Player`  
    The player who opened the container.
  - block : `Block`  
    The opened container block.
- Intercept events: function returns `false`

Here, **container** is a broad term: boxes, buckets, and other containers that can store items can trigger this event.



#### `"onCloseContainer"` - Player Closes Container Event

- Listener function prototype 
  `function(player,block)`
- Parameters: 
  - player : `Player`  
    The player who closed the container.
  - block : `Block`  
    The container that was closed.
- Intercept event: cannot be intercepted.



#### `"onInventoryChange"` - Player Inventory Change Event

- Listener function prototype 
  `function(player,slotNum,oldItem,newItem)`
- Parameters: 
  - player : `Player`  
    The player whose inventory changed.
  - slotNum : `Integer`  
    The slot position of the inventory operation.
  - oldItem : `Item`  
    The original item in the slot.
  - newItem : `Item`  
    The new item in the slot.
- Intercept events: function returns `false`

Explanation of callback parameters:  
Different combinations of the old and new item objects indicate different changes in the slot.

- Put item: the old item object is empty, and the new item object is not empty.
- Take out item: the old item object is not empty, and the new item object is empty.
- Increase stack: the old item object's `type` == the new item object's `type`, and the old item's `count` < the new item's `count`.
- Reduce stack: the old item object's `type` == the new item object's `type`, and the old item's `count` > the new item's `count`.
Replace item: the old item object's `type` does not equal the new item's `type`, and neither item stack is empty.



#### `"onChangeSprinting"` - Player Sprint State Change Event

- Listener function prototype 
  `function(player,sprinting)`
- Parameters: 
  - player : `Player`  
    The player who started or stopped sprinting.
  - sprinting : `Boolean`  
    Whether the player is now sprinting.
- Intercept event: cannot be intercepted.

Note: You can execute Player.setSprinting (false) in the next game tick to achieve the interception effect.



#### `"onSetArmor"` - Player Armor Change Event

- Listener function prototype 
  `function(player,slotNum,item)`
- Parameters: 
  - player : `Player`  
    The player object changing armor.
  - slotNum : `Integer`  
    The armor slot number, ranging from 0 to 3.
  - item : `Item`  
    The item in the armor slot.
- Intercept event: function returns `false`
- Warning: If intercepted, your original equipment will be taken off when you enter the game.



#### `"onUseRespawnAnchor"` - Player Respawn Anchor Use Event

- Listener function prototype 
  `function(player,pos)`
- Parameters: 
  - player : `Player`  
    The player using the respawn anchor.
  - pos : `IntPos`  
    The position of the respawn anchor that was used.
- Intercept events: function returns `false`



#### `"onOpenContainerScreen"` - Player Opens Container GUI Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player who opened the GUI.
- Intercept events: function returns `false`

Note: This event is broad enough that it can even intercept opening backpacks.



#### `"onOpenInventory"` - Player Opens Inventory Event

- Listener function prototype 
  `function(player)`
- Parameters: 
  - player : `Player`  
    The player who opens their inventory.
- Intercept events: function returns `false`



#### `"onExperienceAdd"` - Player Get Experience

- Listener function prototype 
  `function(player,exp)`
- Parameters:
  - player : `Player`  
    The player gaining experience.
  - exp : `Integer`
    The amount of experience gained by the player.
- Intercept events: function returns `false`



#### `"onPlayerPullFishingHook"` - Player Pull Closer Entity Using Fishing Hook 

- Listener function prototype
  `function(player,entity,item)`
- Parameters:
  - player : `Player`  
    The player using the fishing hook.
  - entity : `Entity`  
    The entity that the player pulls closer.
  - item : `Item`  
    The item that the player pulls closer (if this entity is not an item entity, this parameter is null).
- Intercept events: function returns `false`



#### `"onBedEnter"` - Player Enters Bed

- Listener function prototype 
  `function(player,pos)`
- Parameters:
  - player : `Player`  
    The player using the bed.
  - pos : `IntPos`  
    The position of the bed.
- Intercept event: return `false` from the function.



#### `"onPlayerInteractEntity"` - Player Interact with Entity

!!! warning
    This event is only available in 0.9.5 and later.

- Listener function prototype 
  `function(player, entity, pos)`
- Parameters:
  - player : `Player`  
    The player interacting with the entity.
  - entity : `Entity`
    The entity the player interacts with.
  - pos : `FloatPos`  
    The position of the interaction.
- Intercept event: return `false` from the function.
