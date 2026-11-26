# 📝 Scoreboard API

LSE uses a "score object" to get and manipulate a specific scoring variable, and provides many other common interfaces for manipulating the scoreboard.

MC builds its scoreboard system around **score items**. Each score item has a name, tracks specific players, entities, or even string targets, and records the corresponding score for each tracked target.

### Get a Scoring Item Object

Use the following interfaces to get a scoring item object and perform related operations:

#### Create a New Scoring Item

`mc.newScoreObjective(name[,displayName])`

- Parameters: 
  -  name : `String`  
     Scoring item name.  
  -  displayName : `String`  
     (Optional) Scoring item display name. Defaults to `name`.  
- Return value: The newly created scoring item object.
- Return value type: `Objective`
  - Returns `Null` if creation fails.

This interface works like the command `/scoreboard objectives add <name> <displayName> dummy`.



#### Get an Existing Scoring Item

`mc.getScoreObjective(name)`

- Parameters: 
  - name : `String`  
    The name of the scoring item to get.
- Return value: The corresponding scoring item object.
- Return value type: `Objective`
  - Returns `Null` if the scoring item does not exist.



#### Get All Scoring Items

`mc.getAllScoreObjectives()`

- Return value: All scoring item objects recorded by the scoreboard system.
- Return value type: `Array<Objective,Objective,...>`

This interface works like the command `/scoreboard objectives list`.



#### Get a Scoring Item That Is Displayed

`mc.getDisplayObjective(slot)`

- Parameters: 
  - slot : `String`   
    The display slot name to query: `"sidebar"` / `"belowname"` / `"list"`.
- Return value: The scoring item currently displayed in `slot`.
- Return value type: `Objective`
  - Returns `Null` if no scoring item is displayed in the slot.




### Scoring Object - Properties

Every scoring item object has the following fixed properties. A scoring item object `ob` has these properties:

| Attributes     | Meaning                          | Data Type |
| -------------- | -------------------------------- | --------- |
| ob.name        | Scoring item name                | `String`  |
| ob.displayName | Display name of the scoring item | `String`  |

These object properties are read-only and cannot be modified.



### Scoring Item Object - Function

Every scoring item object provides member functions (methods) that you can call. For a scoring item object `ob`, you can perform the following operations:

#### Get the Score for a Tracked Goal

`ob.getScore(target)`

- Parameters: 
  - target : `Player` / `String`  
    The tracked target to query (a player object or any string).
- Return value: The target's or player's score for this scoring item.
- Return value type: `Integer`

**Make sure the score is existing before using this API**


#### Modify the Score of a Goal

Set score: `ob.setScore(target,score)`  
Increase score: `ob.addScore(target,score)`  
Reduce score: `ob.reduceScore(target,score)`

- Parameters: 
  - target : `Player` / `String`  
    The target tracked by the scoring item (a player object or an arbitrary string).
  - score : `Integer`  
    Score to set, increase, or decrease.
- Return value: The target's score after the operation.
- Return value type: `Integer`
  - Returns `Null` if the operation fails.

!!! warning
    If the score does not exist, this API tries to create it, and then returns `0` (if *target* is a `String`) or `null` (if *target* is a `Player`).  
    Reason: [#971](https://github.com/LiteLDev/LeviLamina/issues/971#issuecomment-1385047649)


#### Stop Tracking a Target 

`ob.deleteScore(target)`

- Parameters: 
  - target : `Player` / `String`  
    The target tracked by the scoring item (a player object or an arbitrary string).
- Return value: Whether the target was deleted successfully.
- Return value type: `Boolean`

Stopping tracking deletes the target's score from this scoring item. To access it again, you must recreate it.



#### Set the Display State of the Scoring Item

`ob.setDisplay(slot[,sortOrder=0])`

- Parameters: 
  - slot : `String`   
    The display slot name: `"sidebar"` / `"belowname"` / `"list"`.
  - sortOrder : `Integer`  
    (Optional) The sort order: `0` (ascending) or `1` (descending). Defaults to `0`.
- Return value: Whether the display state was set successfully.
- Return value type: `Boolean`



### Other Scoreboard APIs

The following APIs provide additional operations for the scoreboard system:

#### Get the Score of a online Player’s Scoring Item (Convenience Function)

`pl.getScore(name)`

- Parameters: 
  - name : `String`  
    Scoring item name.  
- Return value: The numerical value on the scoreboard.
- Return value type: `Integer`

Make sure the corresponding scoring item already exists before using this function.

```js
//For a player object pl: 
log("You have money:",pl.getScore("money"));
```

#### Get the Score of a Player’s Scoring Item (Include the Offline Players)

`mc.getPlayerScore(uuid, name)`

- Parameters: 
  - uuid : `String`  
    Player's UUID.
  - name : `String`  
    Scoring item name.  
- Return value: The numerical value on the scoreboard.
- Return value type: `Integer`

#### Modify the Score of a Online Player’s Scoring Item (Convenience Function)

Set score: `pl.setScore(name,value)`  
Increase score:  `pl.addScore(name,value)`  
Reduce score: `pl.reduceScore(name,value)`

- Parameters: 
  - name : `String`  
    Scoring item name.  
  - value : `Integer`  
    The value to set, increase, or decrease.  
- Return value: Whether the modification succeeded.
- Return value type: `Boolean`

If the score does not exist, this function creates it and returns `false`.

```js
//For a player object pl: 
pl.setScore("money",10000);
pl.addScore("money",100);
pl.reduceScore("money",50);
```

#### Modify the Score of a Player’s Scoring Item (Include the Offline Players)

Set score: `mc.setPlayerScore(uuid, name, value)`  
Increase score:  `mc.addPlayerScore(uuid, name, value)`  
Reduce score: `mc.reducePlayerScore(uuid, name, value)`  
Delete score: `mc.deletePlayerScore(uuid, name)`

- Parameters: 
  - uuid : `String`  
    Player's UUID.
  - name : `String`  
    Scoring item name.  
  - value : `Integer`  
    The value to set, increase, or decrease.  
- Return value: Whether the modification succeeded.
- Return value type: `Boolean

#### Player Stops Tracking Scoring Items (Convenience Function) 

`pl.deleteScore(name)`

- Parameters: 
  - name : `String`  
    Scoring item name.   
- Return value: Whether the removal succeeded.
- Return value type: `Boolean`

Make sure the corresponding scoring item already exists before using this function.

```js
//For a player object pl: 
pl.deleteScore("what");
```

#### Remove an Existing Scoring Item

`mc.removeScoreObjective(name)`

- Parameters: 
  -  name : `String`  
     Scoring item name.   
- Return value: Whether the removal succeeded.
- Return value type: `Boolean`

This function works like the `/scoreboard objectives remove <name>` command.



#### Stop Scoring Items From Showing

`mc.clearDisplayObjective(slot)`

- Parameters: 
  - slot : `String`   
    The display slot name, which can be `"sidebar"`/`"belowname"`/`"list"`.
- Return value: Whether the display objective was cleared successfully.
- Return value type: `Boolean`


