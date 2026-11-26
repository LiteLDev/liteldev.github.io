# 🏃‍♂️ Player Object API

In LSE, you use "player objects" to get information about a player and manipulate them.

### Get a Player Object

#### Get From Event or API

Register an **event listener** function to get the player object associated with a BDS event.
For details, see [Event listener documentation - EventAPI](../EventAPI/Listen.md).

#### Acquired From Existing Players

Use this function to manually generate a player object from **player information**. The target player must be online, or the call will fail.

`mc.getPlayer(info)`

!!! warning 
    Versions before 0.8.13 cannot get a player by UUID.  
    Versions before 0.9.5 cannot get a player by RuntimeId.

- Parameters:
    - info : `String`  
      The player's name, XUID, UniqueId, RuntimeId, or UUID.
- Return value: The generated player object.
- Return value type: `Player`
    - A return value of `Null` means that getting the player failed.

#### Get All Online Players

This function returns an array of player objects, one for each player currently on the server.

`mc.getOnlinePlayers()`

- Return value: A list of online `Player` objects.
- Return value type: `Array<Player,Player,...>`

> Note: Do not store a `Player` object **long-term**.
> When a player leaves the server, their player object becomes invalid. If you need to work with a player over time, fetch a fresh player object using the methods above.

### Player Object - Properties

Every player object has a fixed set of properties. A player object `pl` has the following properties:

| Attributes               | Meaning                                                      | Data Type        |
|--------------------------|--------------------------------------------------------------|------------------|
| pl.name                  | Player's name                                                | `String`         |
| pl.pos                   | Player's coordinates                                         | `FloatPos`       |
| pl.feetPos               | Coordinates of the player's feet                             | `FloatPos`       |
| pl.blockPos              | Coordinates of the block that the player is standing on      | `IntPos`         |
| pl.lastDeathPos          | Coordinates of the block where the player last died          | `IntPos`         |
| pl.realName              | Player's real name                                           | `String`         |
| pl.xuid                  | Player's XUID string                                         | `String`         |
| pl.uuid                  | Player's UUID string                                         | `String`         |
| pl.permLevel             | Player's permission level (0 - 4)                            | `Integer`        |
| pl.gameMode              | Player's game mode (0 - 2, 6)                                | `Integer`        |
| pl.canSleep              | Whether the player can sleep                                 | `Boolean`        |
| pl.canFly                | Whether the player can fly                                   | `Boolean`        |
| pl.canBeSeenOnMap        | Whether the player can be seen on a map                      | `Boolean`        |
| pl.canFreeze             | Whether the player can freeze                                | `Boolean`        |
| pl.canSeeDaylight        | Whether the player can see daylight                          | `Boolean`        |
| pl.canShowNameTag        | Whether the player can show a name tag                       | `Boolean`        |
| pl.canStartSleepInBed    | Whether the player can start sleeping in a bed               | `Boolean`        |
| pl.canPickupItems        | Whether the player can pick up items                         | `Boolean`        |
| pl.maxHealth             | Player's maximum health                                      | `Integer`        |
| pl.health                | Player's current health                                      | `Integer`        |
| pl.inAir                 | Whether the player is in the air                             | `Boolean`        |
| pl.inWater               | Whether the player is in water                               | `Boolean`        |
| pl.inLava                | Whether the player is in lava                                | `Boolean`        |
| pl.inRain                | Whether the player is in rain                                | `Boolean`        |
| pl.inSnow                | Whether the player is in snow                                | `Boolean`        |
| pl.inWall                | Whether the player is in a wall                              | `Boolean`        |
| pl.inWaterOrRain         | Whether the player is in water or rain                       | `Boolean`        |
| pl.inWorld               | Whether the player is in the world                           | `Boolean`        |
| pl.inClouds              | Whether the player is in the clouds                          | `Boolean`        |
| pl.speed                 | Player's current speed                                       | `Float`          |
| pl.direction             | Player's current orientation                                 | `DirectionAngle` |
| pl.uniqueId              | Player's (entity's) unique identifier                        | `String`         |
| pl.runtimeId             | Player's (entity's) runtime identifier (Added in 0.9.5)      | `String`         |
| pl.langCode              | Identifier of the language set by the player (e.g. zh_CN)    | `String`         |
| pl.isLoading             | Whether the player is loading                                | `Boolean`        |
| pl.isInvisible           | Whether the player is invisible                              | `Boolean`        |
| pl.isInsidePortal        | Whether the player is inside a portal                        | `Boolean`        |
| pl.isHurt                | Whether the player is hurt                                   | `Boolean`        |
| pl.isTrusting            | Whether the player is trusting                               | `Boolean`        |
| pl.isTouchingDamageBlock | Whether the player is touching a damage block                | `Boolean`        |
| pl.isHungry              | Whether the player is hungry                                 | `Boolean`        |
| pl.isOnFire              | Whether the player is on fire                                | `Boolean`        |
| pl.isOnGround            | Whether the player is on the ground                          | `Boolean`        |
| pl.isOnHotBlock          | Whether the player is on a hot block (magma, etc.)           | `Boolean`        |
| pl.isTrading             | Whether the player is trading                                | `Boolean`        |
| pl.isAdventure           | Whether the player is in Adventure Mode                      | `Boolean`        |
| pl.isGliding             | Whether the player is gliding                                | `Boolean`        |
| pl.isSurvival            | Whether the player is in Survival Mode                       | `Boolean`        |
| pl.isSpectator           | Whether the player is in Spectator Mode                      | `Boolean`        |
| pl.isRiding              | Whether the player is riding                                 | `Boolean`        |
| pl.isDancing             | Whether the player is dancing                                | `Boolean`        |
| pl.isCreative            | Whether the player is in Creative Mode                       | `Boolean`        |
| pl.isFlying              | Whether the player is flying                                 | `Boolean`        |
| pl.isSleeping            | Whether the player is sleeping                               | `Boolean`        |
| pl.isMoving              | Whether the player is moving                                 | `Boolean`        |
| pl.isSneaking            | Whether the player is sneaking                               | `Boolean`        |
| pl.isSwimming            | Whether the player is swimming (Added in 0.19.1)             | `Boolean`        |
| pl.isCrawling            | Whether the player is crawling (Added in 0.19.1)             | `Boolean`        |

These object properties are read-only and cannot be modified. Specifically:

- **coordinates** and **leg coordinates**: A player is two blocks high. `pos` holds the coordinates at the player's eye level, while `feetPos` holds the block coordinates displayed in the game.
- **Player Game Mode**: `0` for survival mode, `1` for creative mode, `2` for adventure mode, and `6` for spectator mode.
- **Player's real name**: Stores a reliable string that does not change when the player changes their display name.
- **Player device IP address**: Stores the player's device IP address and port number in a format like `12.34.567.89:1111`.
- For details on the **player's current orientation** attribute, see [Basic Game Interface Documentation](./Basic.md).
- The **operation authority level** values are as follows:

| Permission Level | Corresponding Authority  |
|------------------|--------------------------|
| 0                | Ordinary Member          |
| 1                | OP permissions           |
| 4                | OP + Console permissions |

### Player Object - Function

Each player object has member functions (methods) that you can call. For a given player object `pl`, you can perform actions on that player using the following functions.

#### Determine if the Player Is OP

`pl.isOP()`

- Return value: Whether the player is an OP.
- Return value type: `Boolean`

[JavaScript]

```js
// For a `Player` object pl
var open = pl.isOP();
```

#### Disconnect Player

`pl.kick([msg])`  
`pl.disconnect([msg])`

- Parameters:
    - msg : `String`  
      (Optional) The disconnection reason shown to the kicked player.
      Defaults to "disconnecting from server".
- Return value: Whether the player was successfully disconnected.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.kick();
```

[Lua]

```lua
pl:kick()
```

#### Send a Text Message to the Player

`pl.tell(msg[,type])`  
`pl.sendText(msg[,type])`

- Parameters:

    - msg : `String`  
      The message to send.

    - type : `Integer`  
      (Optional) The type of text message to send. Defaults to `0`.

| Type Parameter | Message Type                      |
|----------------|-----------------------------------|
| 0              | Normal Message (Raw)              |
| 1              | Chat Message (Chat)               |
| 4              | Music Box Message (Popup)         |
| 5              | Message Above the Inventory (Tip) |
| 9              | JSON format message (JSON)        |

- Return value: Whether the message was sent successfully.

- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.tell("Welcome back ~ ", 5);
```

#### Set Title Message to the Player

`pl.setTitle(content[,type[,fadeInTime,stayTime,fadeOutTime]])`

- Parameters:

    - content : `String`  
      The title content.

    - type : `Integer`  
      (Optional) The title type. Defaults to 2.

    | Types | Description         |
    |-------|---------------------|
    | 0     | Clear               |
    | 1     | Reset               |
    | 2     | SetTitle            |
    | 3     | SetSubTitle         |
    | 4     | SetActionBar        |
    | 5     | SetDurations        |
    | 6     | TitleTextObject     |
    | 7     | SubtitleTextObject  |
    | 8     | ActionbarTextObject |

    - fadeInTime : `Integer`  
      (Optional) Fade-in time, in `Tick`. Defaults to 10.

    - stayTime: `Integer`

      (Optional) Stay time, in `Tick`. Defaults to 70.

    - fadeOutTime:`Integer`

      (Optional) Fade-out time, in `Tick`. Defaults to 20.

- Return value: Whether the title was sent successfully.

- Return value type: `Boolean`

#### Broadcast a Text Message to All Players

`mc.broadcast(msg[,type])`

- Parameters:

    - msg : `String`  
      The message to send.

    - type : `Integer`  
      (Optional) The type of text message to send. Defaults to `0`.

| Type Parameter | Message Type                      |
|----------------|-----------------------------------|
| 0              | Normal Message (Raw)              |
| 1              | Chat Message (Chat)               |
| 4              | Music Box Message (Popup)         |
| 5              | Message Above the Inventory (Tip) |
| 9              | JSON format message (JSON)        |

- Return value: Whether the message was sent successfully.

- Return value type: `Boolean`

[JavaScript]

```js
mc.broadcast("Hello everyone ~ ");
```

#### Display a toast to the top of the screen

`pl.sendToast(title,message)`

- Parameters:

    - title : `String`  
      The title of the toast.

    - message : `String`  
      The message displayed alongside the title.

- Return value: Whether the message was sent successfully.
- Return value type: `Boolean`

[JavaScript]

```js
pl.sendToast("Hello", "everyone ~");
```

#### Execute a Command as a Player

`pl.runcmd(cmd)`

- Parameters:
    - cmd : `String`  
      The command to execute.
- Return value: Whether the command executed successfully.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
var open = pl.runcmd("tp ~ ~+50 ~");
```

#### Speak as a Player

`pl.talkAs(text)`

- Parameters:
    - text : `String`  
      The text the player will say.
- Return value: Whether the action succeeded.
- Return value type: `Boolean`

#### Get Player Distance To Pos

`pl.distanceTo(pos)`
`pl.distanceToSqr(pos)`

- Parameters:
    - pos : `Entity` / `Player` / `IntPos` / `FloatPos`
      The target position.
- Return value: Distance to the coordinates (in blocks).
- Return value type:  `Number`

#### Speak to a Player as a Player

`pl.talkTo(text,target)`

- Parameters:
    - text : `String`  
      The text the player will be made to say.
    - target : `Player`  
      The player who will be spoken to.
- Return value: Whether the execution succeeded.
- Return value type:  `Boolean`

#### Teleport the Player to the Specified Location

`pl.teleport(pos[,rot])`  
`pl.teleport(x,y,z,dimid[,rot])`

- Parameters:
    - pos: `IntPos `/ `FloatPos`  
      Target position coordinates (or use x, y, z, and dimid to specify the player's position).

    - rot: `DirectionAngle`

      (Optional) The player's orientation after teleporting. Defaults to the orientation before teleporting.

- Return value: Whether the teleport succeeded.

- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl, a coordinate object pos
pl.teleport(pos);
```

#### Kill the Player

`pl.kill()`

- Return value: Whether the execution succeeded.
- Return value type: `Boolean`

[JavaScript]

```js
[JavaScript]
//For a `Player` object pl
pl.kill();
[Lua]

```

#### Damage the Player

`pl.hurt(damage[,type[,source]])`

- Parameters:
    - damage : `Float`  
      The amount of damage to deal to the player.
    - type : `Integer`  
      (Optional) Actor Damage Cause. Defaults to `0` (`ActorDamageCause.Override`).
    - source: `Entity`  
      (Optional) The source of the damage.
- Return value: Whether the damage was dealt.
- Return value type:  `Boolean`

Note that this deals true damage, which cannot be reduced by protective equipment such as armor.

| `ActorDamageCause` ENUM            | Value |
| ---------------------------------- | --- |
| `ActorDamageCause.None`            | -1 |
| `ActorDamageCause.Override`        | 0 |
| `ActorDamageCause.Contact`         | 1 |
| `ActorDamageCause.EntityAttack`    | 2 |
| `ActorDamageCause.Projectile`      | 3 |
| `ActorDamageCause.Suffocation`     | 4 |
| `ActorDamageCause.Fall`            | 5 |
| `ActorDamageCause.Fire`            | 6 |
| `ActorDamageCause.FireTick`        | 7 |
| `ActorDamageCause.Lava`            | 8 |
| `ActorDamageCause.Drowning`        | 9 |
| `ActorDamageCause.BlockExplosion`  | 10 |
| `ActorDamageCause.EntityExplosion` | 11 |
| `ActorDamageCause.Void`            | 12 |
| `ActorDamageCause.SelfDestruct`    | 13 |
| `ActorDamageCause.Magic`           | 14 |
| `ActorDamageCause.Wither`          | 15 |
| `ActorDamageCause.Starve`          | 16 |
| `ActorDamageCause.Anvil`           | 17 |
| `ActorDamageCause.Thorns`          | 18 |
| `ActorDamageCause.FallingBlock`    | 19 |
| `ActorDamageCause.Piston`          | 20 |
| `ActorDamageCause.FlyIntoWall`     | 21 |
| `ActorDamageCause.Magma`           | 22 |
| `ActorDamageCause.Fireworks`       | 23 |
| `ActorDamageCause.Lightning`       | 24 |
| `ActorDamageCause.Charging`        | 25 |
| `ActorDamageCause.Temperature`     | 26 |
| `ActorDamageCause.Freezing`        | 27 |
| `ActorDamageCause.Stalactite`      | 28 |
| `ActorDamageCause.Stalagmite`      | 29 |
| `ActorDamageCause.RamAttack`       | 30 |
| `ActorDamageCause.SonicBoom`       | 31 |
| `ActorDamageCause.Campfire`        | 32 |
| `ActorDamageCause.SoulCampfire`    | 33 |
| `ActorDamageCause.MaceSmash`       | 34 |
| `ActorDamageCause.All`             | 35 |

#### Heal the Player

`pl.heal(health)`

- Parameters:
    - health : `Integer`  
      Number of hearts to heal.
- Return value: Whether the player was healed.
- Return value type: `Boolean`

#### Set Health for Player

`pl.setHealth(health)`

- Parameters:
    - health : `Integer`  
      Number of hearts.
- Return value: Whether the player's health was set.
- Return value type: `Boolean`

#### Set Absorption Attribute for Player

`pl.setAbsorption(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the player's attribute value was set.
- Return value type: `Boolean`

#### Set Attack Damage Attribute for Player

`pl.setAttackDamage(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the player's attribute value was set.
- Return value type: `Boolean`

#### Set Maximal Attack Damage Attribute for Player

`pl.setMaxAttackDamage(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the player's attribute value was set.
- Return value type: `Boolean`

#### Set Follow Range Attribute for Player

`pl.setFollowRange(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the player's attribute value was set.
- Return value type: `Boolean`

#### Set Knockback Resistance Attribute for Player

`pl.setKnockbackResistance(value)`

- Parameters:
    - value : `Integer`  
      New value (0 or 1).
- Return value: Whether the player's attribute value was set.
- Return value type: `Boolean`

#### Set Luck Attribute for Player

`pl.setLuck(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set successfully.
- Return value type: `Boolean`

#### Set Movement Speed for Player

`pl.setMovementSpeed(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set successfully.
- Return value type: `Boolean`

#### Set Underwater Movement Speed for Player

`pl.setUnderwaterMovementSpeed(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set successfully.
- Return value type: `Boolean`

#### Set Lava Movement Speed for Player

`pl.setLavaMovementSpeed(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set successfully.
- Return value type: `Boolean`

#### Set Max Health for Player

`pl.setMaxHealth(health)`

- Parameters:
    - health : `Integer`  
      Number of hearts.
- Return value: Whether the player's max health was set successfully.
- Return value type: `Boolean`

#### Set Hunger for Player

`pl.setHungry(hunger)`

- Parameters:
    - hunger : `Integer`  
      Hunger value.
- Return value: Whether the player's hunger was set successfully.
- Return value type: `Boolean`

#### Set the Specified Player on Fire

`pl.setFire(time,isEffect)`

- Parameters:
    - time : `Integer`  
      Duration of the fire, in seconds.
    - isEffect : `Boolean`
      Whether to display the fire effect.
- Return value: Whether the player was set on fire.
- Return value type: `Boolean`

#### Put Out The Player

`pl.stopFire()`

- Return value: Whether the fire was extinguished.
- Return value type: `Boolean`

#### Scale Player

`pl.setScale(scale)`

- Parameters:
    - scale : `Float`  
      New player size.
- Return value: Whether the player was scaled.
- Return value type: `Boolean`

#### Rename Player

`pl.rename(newname)`

- Parameters:
    - newname : `String`  
      The player's new name.
- Return value: Whether the rename was successful.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.rename("newname");
```

#### Get the Block the Player Is Currently Standing On

`pl.getBlockStandingOn()`

- Return value: The `Block` object the player is currently standing on.
- Return value type: `Block`

#### Get the Player's Device Information Object

`pl.getDevice()`

- Return value: The device information object for the player.
- Return value type: `Device`

The device information object stores details about the player's device, such as its IP address, device type, and network latency.  
For more information, see the [Device Information Objects API](./Device.md).

#### Get the Item Object in the Player’s Main Hand

`pl.getHand()`

- Return value: The item object in the player's main hand.
- Return value type: `Item`

This method returns a reference to the item object. Modifying the returned object or calling its API methods directly modifies the item in the player's main hand.

#### Get the Item Object of the Player’s Off-Hand

`pl.getOffHand()`

- Return value: The item object in the player's off-hand.
- Return value type: `Item`

This method returns a reference to the item object. Modifying the returned object or calling its API methods directly modifies the item in the player's off-hand.

#### Get the Container Object of the Player’s Inventory

`pl.getInventory()`

- Return value: The container object for the player's inventory.
- Return value type: `Container`

For more information on using container objects, see the [Container Object API Documentation](./Container.md).

#### Gets the Container Object for the Player’s Armor Bar

`pl.getArmor()`

- Return value: The container object for the player's armor bar.
- Return value type: `Container`

For more information on using container objects, see the [Container Object API Documentation](./Container.md).

#### Get the Container Object of the Player’s Ender Chest

`pl.getEnderChest()`

- Return value: The container object for the player's ender chest.
- Return value type: `Container`

For more information on using container objects, see the [Container Object API Documentation](./Container.md).

#### Get the Player’s Respawn Coordinates

`pl.getRespawnPosition()`

- Return value: The respawn point coordinates.
- Return value type: `IntPos`

#### Modify the Player’s Respawn Coordinates

`pl.setRespawnPosition(pos)`  
`pl.setRespawnPosition(x,y,z,dimid)`

- Parameters:
    - pos : `IntPos` or `FloatPos`  
      Respawn coordinates (or pass x, y, z, and dimid to specify the respawn position).
- Return value: Whether the modification was successful.
- Return value type: `Boolean`

#### Give the Player an Item

`pl.giveItem(item[, amount])`

- Parameters:
    - item : `Item`  
      The item to give.

    - amount: `Integer`

      (Optional) The number of items to give. If provided, the item object's Count property is ignored.
- Return value: Whether the item was given.
- Return value type: `Boolean`

If the player's inventory is full, excess items are dropped.

#### Clears All Items of the Specified Type From the Player’s Backpack

`pl.clearItem(type[, count])`

- Parameters:
    - type : `String`  
      The type name of the item object to clear.
    - count : `Integer`  
      (Optional) The number of items to clear. Defaults to 1.
- Return value: The number of items cleared.
- Return value type: `Integer`

Compares the type attribute of all items in the player's inventory, main hand, off-hand, and armor against this string, and clears matching items.

#### Refresh Player Inventory, Armor Bar

`pl.refreshItems()`

- Return value: Whether the refresh was successful.
- Return value type: `Boolean`

After modifying the player's items, refresh all of them for the changes to take effect on the client.

#### Refresh All Chunks Loaded by the Player

`pl.refreshChunks()`

- Return value: Whether the refresh was successful.
- Return value type: `Boolean`

#### Modify Player Operation Permissions

`pl.setPermLevel(level)`

- Parameters:

    - level : `Integer`  
      The target operation permission level.

| Player Permission Level | Corresponding Permission Authority |
|-------------------------|------------------------------------|
| 0                       | Ordinary Member Permissions        |
| 1                       | OP Permissions                     |
| 4                       | OP + Console Permissions           |

- Return value: Whether the modification was successful.

- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.setPermLevel(1);
```

#### Modify Player Game Mode

`pl.setGameMode(mode)`

- Parameters:

    - mode : `Integer`  
      The target game mode: `0` for survival mode, `1` for creative mode, `2` for adventure mode, and `6` for spectator mode.
- Return value: Whether the modification was successful.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.setGameMode(1);
```

#### Increase Player Experience Level

`pl.addLevel(count)`

- Parameters:
    - count : `Integer`  
      The number of experience levels to add.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.addLevel(6);
```

#### Decreases Player Experience Level

`pl.reduceLevel(count)`

- Parameters:
    - count : `Integer`  
      The number of experience levels to reduce.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

#### Get Player Experience Level

`pl.getLevel()`

- Return value: The player's experience level.
- Return value type: `Integer`

[JavaScript]

```js
//For a `Player` object pl
pl.getLevel();
```

[Lua]

```lua
--For a `Player` object pl
pl.getLevel()
```

#### Set Player Experience Level

`pl.setLevel(count)`

- Parameters:
    - count : `Integer`  
      The number of experience levels to set.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

#### Reset Player Experience

`pl.resetLevel()`

- Return value: Whether the setting was successful.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.resetLevel();
```

[Lua]

```lua
--For a `Player` object pl
pl:resetLevel()
```

#### Get Player Current Experience Points

`pl.getCurrentExperience()`

- Return value: The player's current experience points.
- Return value type: `Integer`

#### Set Player Current Experience Points

`pl.setCurrentExperience(count)`

- Parameters:
    - count : `Integer`  
      The number of experience points to set.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

#### Get Player Total Experience Points

`pl.getTotalExperience()`

- Return value: The player's total experience points.
- Return value type: `Integer`

#### Set Player Total Experience Points

`pl.setTotalExperience(count)`

- Parameters:
    - count : `Integer`  
      The number of experience points to set.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

#### Increase Player Experience Points

`pl.addExperience(count)`

- Parameters:
    - count : `Integer`
      The number of experience points to give to the player.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.addExperience(6);
```

[Lua]

```lua
--For a `Player` object pl
pl:addExperience(6)
```

#### Decreases Player Experience Points

`pl.reduceExperience(count)`

- Parameters:
    - count : `Integer`  
      The number of experience points to reduce.
- Return value: Whether the setting was successful.
- Return value type: `Boolean`

#### Get the Experience Points Needed for Players to Level Up

`pl.getXpNeededForNextLevel()`

- Return value: The number of experience points required for the player to level up.
- Return value type: `Integer`

Note that this calculation ignores any experience points already gained toward the next level.

[JavaScript]

```js
//For a `Player` object pl
pl.getXpNeededForNextLevel();
```

[Lua]

```lua
--For a `Player` object pl
pl.getXpNeededForNextLevel()
```

#### Send the Player to the Specified Server

`pl.transServer(server,port)`

- Parameters:
    - server : `String`  
      Target server IP or domain name

    - port : `Integer`  
      Target server port
- Return value: Whether the transfer succeeded.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.transServer("123.45.67.89", 23333);
```

#### Crash the Player Client

`pl.crash()`

- Return value: Whether the execution succeeded.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.crash();
```

[Lua]

```lua
--For a `Player` object pl
pl:crash()

```

#### Set Player Custom Sidebar

`pl.setSidebar(title,data[,sortOrder])`

- Parameters:

    - title : `String`  
      Sidebar title
    - data : `Object<String-Integer>`  
      Sidebar content object.  
      Each key-value pair in the object becomes a row in the sidebar.
    - sortOrder : `Number`  
      (Optional) Sort order for sidebar content. `0` sorts by score in ascending order; `1` sorts by score in descending order.
      Defaults to `1`.

- Return value: Whether the setting succeeded.

- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.setSidebar("title", {"aaaa": 3, "bbb": 12, "cc": 7});
```

#### Remove Player Customization Sidebar

`pl.removeSidebar()`

- Return value: Whether the removal succeeded.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.removeSidebar();
```

#### Sets the Custom Boss Health Bar That the Player Sees

`pl.setBossBar(uid,title,percent,colour)`

- Parameters:
    - uid : `Number`   
      Unique identifier; must not conflict with existing ones! Each uid corresponds to one boss bar line.
    - title : `String`  
      Custom health bar title
    - percent : `Integer`  
      The health percentage in the boss bar. Valid range: 0~100 (`0` is empty, `100` is full).
    - colour : `Integer`
      Health bar color (for example, `2` is RED)
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.setBossBar(1145141919, "Hello ~ ", 80, 0);
```

#### Remove the Player’s Custom Boss Health Bar

`pl.removeBossBar(uid)`

- Parameters:
    - uid : `Number`  
      Identifier corresponding to setBossBar!
- Return value: Whether the removal succeeded.
- Return value type: `Boolean`

[JavaScript]

```js
//For a `Player` object pl
pl.removeBossBar(1145141919);
```

#### Get an Online Player's NBT Object

`pl.getNbt()`

- Return value: The player's NBT object.
- Return value type: `NbtCompound`

#### Write to an Online Player's NBT Object

`pl.setNbt(nbt)`

- Parameters:
    - nbt : `NbtCompound`  
      NBT object
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

For more information on using NBT objects, see [NBT Interface Documentation](../NbtAPI/NBT.md).

#### Get an Player's NBT Object

`mc.getPlayerNbt(uuid)`

- Parameters:
    - uuid : `String`  
      Player's UUID
- Return value: The player's NBT object.
- Return value type: `NbtCompound`
    - Returns `Null` if the player does not exist or no saved data is found.

#### Write to an Player's NBT Object

`mc.setPlayerNbt(uuid,nbt[,forceCreate,isOnlineMode])`

- Parameters:
    - uuid : `String`  
      Player's UUID
    - nbt : `NbtCompound`  
      NBT object
    - forceCreate : `Boolean` (Optional)  
      Whether to create offline player data if no saved record exists for the UUID. Defaults to `false`.
    - isOnlineMode : `Boolean` (Optional)  
      Used only when `forceCreate` is `true`. Specifies whether the created player data uses online mode. Defaults to `true`.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

#### Write Data to Some Special Tags of an Player's NBT Object

`mc.setPlayerNbtTags(uuid,nbt,tags)`

- Parameters:
    - uuid : `String`  
      Player's UUID
    - nbt : `NbtCompound`  
      NBT object
    - tags : `Array<String>`  
      Tags to write
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

#### Delete an Player's NBT Object

`mc.deletePlayerNbt(uuid)`

- Parameters:
    - uuid : `String`  
      Player's UUID
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`

Use this API to delete saved offline player NBT data by UUID.

#### Get All Saved Player UUIDs

`mc.getAllPlayerUuids([isOnlineMode])`

- Parameters:
    - isOnlineMode : `Boolean` (Optional)  
      `true` returns the UUIDs of players who logged in with a Microsoft account; `false` returns the UUIDs of offline-mode players. Defaults to `true`.
- Return value: List of saved player UUID strings.
- Return value type: `Array<String,String,...>`

#### Add a Tag for the Player

`pl.addTag(tag)`

- Parameters:
    - tag: `String`  
      The tag string to add.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`

#### Remove a Tag for a player

`pl.removeTag(tag)`

- Parameters:
    - tag: `String`  
      The tag string to remove.
- Return value: Whether the removal succeeded.
- Return value type: `Boolean`

#### Check if the Player Has a Tag

`pl.hasTag(tag)`

- Parameters:
    - tag: `String`  
      The tag string to check.
- Return value: Whether the player has the tag.
- Return value type: `Boolean`

#### Get a List of All Tags Player the Player Has

`pl.getAllTags()`

- Return value: A list of all the player's tag strings.
- Return value type: `Array<String,String,...>`

#### Get a List of the Player’s Abilities (From the Player’s NBT)

`pl.getAbilities()`

- Return value: An object containing key-value pairs of all player ability information.
- Return value type: `Object<String-Any type>`

Each key-value pair looks like `"mayfly": 1`, etc.

#### Get a list of the player's Attributes (from the player's NBT)

`pl.getAttributes()`

- Return value: An array of all the player's attribute objects.
- Return value type: `Array<Object,Object,...>`

Each item in the array is a key-value `Object`. By default, an Attributes object contains keys such as `Base`, `Current`, `DefaultMax`, `DefaultMin`, `Max`, `Min`, and `Name`. Its content looks like this:

```json
{
  "Base": 0,
  "Current": 0,
  "DefaultMax": 1024,
  "DefaultMin": -1024,
  "Max": 1024,
  "Min": -1024,
  "Name": "minecraft:luck"
}
```

(Shown here in JSON format for readability.)

#### Get Player Sprint Status

`pl.isSprinting()`

- Return value: The player's sprinting state.
- Return value type: `Boolean`

#### Set Player Sprint State

`pl.setSprinting(sprinting)`

- Parameters:
    - sprinting : `Boolean`  
      Sprinting state.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`

#### Get the Entity in the Player's Line of Sight

`pl.getEntityFromViewVector([maxDistance])`

- Parameters:
    - maxDistance : `Float`  
      Maximum search distance.
- Return value: The entity in the player's line of sight, or `Null` if none can be obtained.
- Return value type: `Entity`

#### Get the Block in the Player's Line of Sight

`pl.getBlockFromViewVector([includeLiquid,solidOnly,maxDistance,fullOnly])`

- Parameters:
    - includeLiquid : `Boolean`  
      Whether to include liquid blocks.
    - solidOnly : `Boolean`  
      Whether to allow only blocks of type `Solid`.
    - maxDistance : `Float`  
      Maximum search distance.
    - fullOnly : `Boolean`  
      Whether to allow only full blocks.
- Return value: The block in the player's line of sight, or `Null` if none can be obtained.
- Return value type: `Block`

#### Sending packets to the player

`pl.sendPacket(packet)`

- Parameters:
    - packet : `Packet`  
      Packet.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`

#### Get the player's Biome ID

`pl.getBiomeId()`

- Return value: Biome ID.
- Return value type: `Integer`

#### Get the player's Biome Name

`pl.getBiomeName()`

- Return value: Biome name.
- Return value type: `String`

#### Set Player Ability

`pl.setAbility(AbilityID,Value)`

- Parameters:
    - AbilityID : `Integer`  
      Ability ID.
    - Value : `Boolean`  
      Whether to enable the ability.
- Return value: None.
- Return value type: `Boolean`

#### Get player's effects

`pl.getAllEffects()`

- Return value: The effect IDs the player currently has.
- Return value type: `Array<Integer,Integer,...>`

#### Add an effect for player

`pl.addEffect(id, tick, level, showParticles)`

- Parameters:
    - id : `Number`
      Effect ID.
    - tick : `Number`
      Duration.
    - level : `Number`
      Effect level.
    - showParticles : `Boolean`
      Whether to show particles.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

#### Remove an effect for player

`pl.removeEffect(id)`

- Parameters:
    - id : `Number`
      Effect ID.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

| Name            | ID |
|-----------------|----|
| speed           | 1  |
| slowness        | 2  |
| haste           | 3  |
| mining_fatigue  | 4  |
| strength        | 5  |
| instant_health  | 6  |
| instant_damage  | 7  |
| jump_boost      | 8  |
| nausea          | 9  |
| regeneration    | 10 |
| resistance      | 11 |
| fire_resistance | 12 |
| water_breathing | 13 |
| invisibility    | 14 |
| blindness       | 15 |
| night_vision    | 16 |
| hunger          | 17 |
| weakness        | 18 |
| poison          | 19 |
| wither          | 20 |
| health_boost    | 21 |
| absorption      | 22 |
| saturation      | 23 |
| levitation      | 24 |
| fatal_poison    | 25 |
| conduit_power   | 26 |
| slow_falling    | 27 |
| bad_omen        | 28 |
| village_hero    | 29 |
| darkness        | 30 |
| trial_omen      | 31 |
| wind_charged    | 32 |
| weaving         | 33 |
| oozing          | 34 |
| infested        | 35 |
| raid_omen       | 36 |
| breath_of_the_nautilus | 37 |

#### Quick execute Molang expression

`pl.quickEvalMolangScript(str)`

- Parameters:
    - str : `String`  
      Molang expression string.
- Return value: The result of the Molang expression.
- Return value type: `Float`

For detailed usage of Molang, see [MOLANG Doc bedrock.dev](https://bedrock.dev/docs/stable/Molang).

#### Convert Player Object to Entity Object

`pl.toEntity()`

- Return value: The converted `Entity` object.
- Return value type: `Entity`
    - Returns `Null` if the conversion fails.

Use this function to convert a player object to an entity object so you can call entity-related APIs on it.

### Determine whether it is a simulated player

`pl.isSimulatedPlayer()`

- Return value: Whether the player is a simulated player.
- Return value type: `Boolean`

## Simulated player (due to too much overlap with the player API, no new simulated player class was generated)

### Create a simulated player

`mc.spawnSimulatedPlayer(name[,pos])`  
`mc.spawnSimulatedPlayer(name,x,y,z,dimid)`

- Parameters:
    - name : `String`  
      Name of the simulated player.
    - pos : `IntPos `/ `FloatPos`  
      (Optional) Coordinate object for the spawn position (or use x, y, z, and dimid to specify the spawn position). Defaults to the world spawn point.
- Return value: The spawned (simulated) player object.
- Return type: `Player`
    - Returns `Null` if spawning fails.

### Simulated Player - Functions

Each simulated player object provides member functions (methods) that you can call. For a given simulated player object `sp`, use the following functions to perform operations on it.

#### Simulate Respawn

`sp.simulateRespawn()`

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#respawn)

#### Simulate Attack

`sp.simulateAttack([target])`

- Parameters:

    - target : `Entity`  
      (Optional) The target to attack. Defaults to the entity in the line of sight.

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#attack)

#### Simulate Destroy

`sp.simulateDestroy([pos,face])`
`sp.simulateDestroy([block,face])`

- Parameters:

    - pos :`IntPos`  
      (Optional) Coordinates of the block to destroy. Defaults to the block in the line of sight.
    - block :`Block`  
      (Optional) The block to destroy. Defaults to the block in the line of sight.
    - face :`Integer`  
      (Optional) The block face to destroy from.

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#breakblock)

#### Simulate Disconnect

`sp.simulateDisconnect()`

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

#### Simulate Interact

`sp.simulateInteract([target])`
`sp.simulateInteract([pos,face])`
`sp.simulateInteract([block,face])`

- Parameters:

    - target : `Entity`  
      (Optional) Target of the simulated interaction. Defaults to the block or entity in the line of sight.
    - pos :`IntPos`  
      (Optional) Target of the simulated interaction. Defaults to the block or entity in the line of sight.
    - block :`Block`  
      (Optional) Target of the simulated interaction. Defaults to the block or entity in the line of sight.
    - face :`Number`  
      (Optional) Face of the target block to interact with.

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#interact)

#### Simulate Jump

`sp.simulateJump()`

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#jump)

#### Simulate Sneak

`sp.simulateSneak()`

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

#### Simulate Look At a Block or Entity

`sp.simulateLookAt(pos, [lookDuration])`
`sp.simulateLookAt(entity, [lookDuration])`
`sp.simulateLookAt(block, [lookDuration])`

!!! warning
    The `lookDuration` parameter is available only in 0.8.13 and later.

- Parameters:

    - target : `Entity`  
      The entity to look at.
    - pos :`IntPos` / `FloatPos`  
      The coordinates to look at.
    - block :`Block`  
      The block to look at.
    - lookDuration: `Integer`  
      How long the SimulatedPlayer looks at the target.  
      0 = Instant, 1 = Continuous, 2 = UntilMove

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#lookatblock)

#### Simulate Set Body Rotation

`sp.simulateSetBodyRotation(rot)`

- Parameters:

    - rot : `Number`  
      The angle to set.

- Return value: Whether the simulated action succeeded.
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#rotatebody)

#### Move Relative to Player Coordinate System

`sp.simulateLocalMove(pos[,speed])`

- Parameters:
    - pos : `IntPos` / `FloatPos`  
      Movement direction
    - speed : `Number`  
      (Optional) Movement speed. Defaults to 1.

- Return value: Whether the move request succeeded
- Return type: `Boolean`

#### Move Relative to World Coordinate System

`sp.simulateWorldMove(pos[,speed])`

- Parameters:
    - pos : `IntPos` / `FloatPos`  
      Movement direction
    - speed : `Number`  
      (Optional) Movement speed. Defaults to 1.

- Return value: Whether the move request succeeded
- Return type: `Boolean`

#### Move Straight to Coordinate

`sp.simulateMoveTo(pos[,speed])`

- Parameters:
    - pos : `IntPos` / `FloatPos`  
      Target position
    - speed : `Number`  
      (Optional) Movement speed. Defaults to 1.

- Return value: Whether the move request succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#movetolocation)  
Note: For automatic pathfinding, use `Simulate Navigate Move` instead.

#### Simulate Navigate Move

`sp.simulateNavigateTo(entity[,speed])`
`sp.simulateNavigateTo(pos[,speed])`

- Parameters:

    - entity : `Entity`  
      Navigation target
    - pos : `IntPos` / `FloatPos`  
      Navigation target
    - speed : `Number`  
      (Optional) Movement speed. Defaults to 1.

- Return value: Whether the specified location can be reached and the navigation path, with the structure {isFullPath:`Boolean`,path:`Number[3][]`}
- Return type: `Object`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#navigatetoblock)  
Return value example:

```json
{
  isFullPath: false,
  path: [
    [
      -8,
      0,
      -3
    ],
    [
      -7,
      0,
      -2
    ],
    [
      -6,
      0,
      -2
    ],
    [
      -5,
      0,
      -2
    ],
    [
      -4,
      0,
      -1
    ],
    [
      -3,
      0,
      -1
    ],
    [
      -2,
      0,
      -1
    ],
    [
      -1,
      0,
      0
    ]
  ]
}
```

Here, the target coordinate is (0,2,0), and the path ends at (-1,0,0), so isFullPath is false. Because the path is not empty, the simulated player still moves to (-1,0,0).

#### Simulate Navigate Move (Multiple Targets)

`sp.simulateNavigateTo(posArray[,speed])`

- Parameters:

    - posArray : `IntPos[]` / `FloatPos[]`  
      Navigation targets
    - speed : `Number`  
      (Optional) Movement speed. Defaults to 1.

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#navigatetolocations)

#### Simulate Use Item

`sp.simulateUseItem([slot,pos,face,relative])`
`sp.simulateUseItem([item,pos,face,relative])`

- Parameters:

    - item : `Item`  
      (Optional) The item to use. Defaults to the selected item.
    - slot : `Number`  
      (Optional) The slot containing the item. Defaults to the selected item.
    - pos : `IntPos`  
      (Optional) Target coordinate. Defaults to the coordinate of the block being faced.
    - face : `Number`  
      (Optional) Target block face. Defaults to 0.
    - relative : `FloatPos`  
      (Optional) Offset coordinate relative to the block. Defaults to {0.5,0.5,0.5}.

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#useitem)

#### Simulate Stop Destroying Block

`sp.simulateStopDestroyingBlock()`

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#stopbreakingblock)

#### Simulate Stop Interacting

`sp.simulateStopInteracting()`

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#stopinteracting)

#### Simulate Stop Moving

`sp.simulateStopMoving()`

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#stopmoving)

#### Simulate Stop Using Item

`sp.simulateStopUsingItem()`

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`

Reference: [mojang-gametest docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/simulatedplayer?view=minecraft-bedrock-experimental#stopusingitem)

#### Simulate Stop Sneaking

`sp.simulateStopSneaking()`

- Return value: Whether the simulated action succeeded
- Return type: `Boolean`
