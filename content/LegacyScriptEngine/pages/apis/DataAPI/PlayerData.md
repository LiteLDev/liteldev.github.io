# 🏃‍♂️ Player Binding Data

In practice, plugins often need to associate data with a player on the server and maintain that data throughout the plugin's lifecycle.

To support this, LSE provides a player bound data interface that stores data as key-value pairs. 
Once bound to a player, this data persists even if the player object goes out of scope and is destroyed, or if the player leaves the game. When you retrieve the player object again, you can still read the previously stored bound data.  
All bound data is cleared only when the server shuts down.

This allows developers to track player-specific data throughout the plugin's lifecycle.  

A player object `pl` provides the following methods:

#### Store Player Binding Data 

`pl.setExtraData(name,data)`

- Parameters: 
  - name : `String`  
    The key under which to store the bound data.
  - data : `Any type`  
    The bound data to store. Can be `Null`.

- Return value: Whether the data was saved successfully.
- Return value type: `Boolean` 

#### Get Player Binding Data

`pl.getExtraData(name)`

- Parameters: 
  - name : `String`  
    The key of the bound data to read.
- Return value: The stored bound data.
- Return value type: `Any type`, depending on the type of data stored.
  -  Returns `Null` if the specified bound data is not found or is empty.

#### Delete Player Binding Data

`pl.delExtraData(name)`

- Parameters: 
  - name : `String`  
    The key of the bound data to delete.
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`

## 👨‍💻 XUID Database

The XUID database lets you look up player names and XUIDs even when players are offline.
When a player joins the server for the first time, their name and XUID are automatically recorded in the built-in XUID database. Use the following functions to query this database.

#### Query XUID by Player Name

`data.name2xuid(name)`

- Parameters: 
  - name : `String`  
    The name of the player to query.
- Return value: The player's XUID.
- Return value type: `String`
  - Returns `Null` if the query fails.

#### Query Player Name Based on XUID

`data.xuid2name(xuid)`

- Parameters: 
  - xuid: `String`  
    The XUID of the player to query.
- Return value: The player's name.
- Return value type: `String`
  - Returns `Null` if the query fails.

#### Query UUID by Player Name

`data.name2uuid(name)`

- Parameters: 
  - name : `String`  
    The name of the player to query.
- Return value: The player's UUID.
- Return value type: `String`
  - Returns `Null` if the query fails.

#### Query UUID Based on XUID

`data.xuid2uuid(xuid)`

- Parameters: 
  - xuid : `String`  
    The XUID of the player to query.
- Return value: The player's UUID.
- Return value type: `String`
  - Returns `Null` if the query fails.

#### Get all player information

`data.getAllPlayerInfo()`

- Return value: Information for all players.
- Return value type: `Array<Object>`
  - Each object contains the following properties:
    - `name`: The player's name.
    - `xuid`: The player's XUID.
    - `uuid`: The player's UUID.

Tip: The player name stored in the XUID database corresponds to the player object's `realName` field.

!!! warning
    The APIs below were added in 0.8.13. Using them makes your plugin incompatible with older versions.
#### Query player information by XUID

`data.fromXuid(xuid)`

- Parameters:
  - xuid: `String`
    The XUID of the player to query.
- Return value: A player information entry, for example: `{xuid:1145141919810,name:yjsp,uuid:2a30fa4a-3a63-3370-88a8-144a941101e2}`
- Return value type: `Object`
  - Returns `Null` if the query fails.

#### Query player information by UUID

`data.fromUuid(uuid)`

- Parameters:
  - uuid: `String`
    The UUID of the player to query.
- Return value: A player information entry, for example: `{xuid:1145141919810,name:yjsp,uuid:2a30fa4a-3a63-3370-88a8-144a941101e2}`
- Return value type: `Object`
  - Returns `Null` if the query fails.

#### Query player information by name

`data.fromName(name)`

- Parameters:
  - name: `String`
    The name of the player to query.
- Return value: A player information entry, for example: `{xuid:1145141919810,name:yjsp,uuid:2a30fa4a-3a63-3370-88a8-144a941101e2}`
- Return value type: `Object`
  - Returns `Null` if the query fails.
