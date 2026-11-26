# 💻 Server Settings API

The following APIs customize server settings:

### Get the Version Number of the BDS Server

`mc.getBDSVersion()`

- Return value: The server version string, formatted as `v1.17.10`
- Return value type: `String`



### Get BDS Server Protocol Version 

`mc.getServerProtocolVersion()`

- Return value: Server protocol version
- Return value type: `Number`



### Get Server Motd String

!!! warning
    This function is only available in 0.19.1 and later.

`mc.getMotd()`

- Return value: Current server Motd string
- Return value type: `String`



### Set Server Motd String  

`mc.setMotd(motd)`

- Parameters:
  - motd : `String`  
    The Motd string to set.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`



### Set the Maximum Number of Players on the Server  

`mc.setMaxPlayers(num)`

- Parameters:
  - num : `Number`  
    The maximum number of players.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`



### Get Online Player Count

!!! warning
    This function is only available in 0.19.1 and later.

`mc.getOnlinePlayerNum([ignoreSimulatedPlayer])`

- Parameters:
  - ignoreSimulatedPlayer : `Boolean` = `false`  
    Whether to ignore simulated players
- Return value: Current number of online players
- Return value type: `Number`



### Get Server Maximum Player Count

!!! warning
    This function is only available in 0.19.1 and later.

`mc.getMaxNumPlayers()`

- Return value: Current maximum number of players on the server
- Return value type: `Number`



### Get Sever time  

`mc.getTime(TimeID)`

- Parameters:
  - TimeID : `Integer`  
    The time value to retrieve. Must be 0, 1, or 2 (0: daytime, 1: gametime, 2: day)
- Return value: Current time
- Return value type: `Integer`

Here, daytime is the number of game ticks since dawn, gametime is the age of the world in game ticks, and day is the number of elapsed in-game days.



### Set Sever time   

`mc.setTime(tick)`

- Parameters:
  - tick : `Integer`  
    The time to set
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`



### Get Sever Weather  

`mc.getWeather()`

- Return value: Current weather (0: Clear, 1: Rain, 2: Thunder)
- Return value type: `Integer`



### Set Sever Weather  

`mc.setWeather(WeatherID[, duration])`

- Parameters:
  - WeatherID : `Integer`  
    The weather to set (0: Clear, 1: Rain, 2: Thunder)
  - duration : `Integer`  
    (Optional) How long the weather lasts, in game ticks. Defaults to a random duration of 300 to 900 seconds
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`



### Get Dimension ID

!!! warning
    This function is only available in 0.19.1 and later.

`mc.getDimensionId(name)`

- Parameters:
  - name : `String`  
    Dimension name
- Return value: The dimension ID for the given name, or `null` if the name is invalid
- Return value type: `Number`



### Get Dimension Name

!!! warning
    This function is only available in 0.19.1 and later.

`mc.getDimensionName(dimid)`

- Parameters:
  - dimid : `Integer`  
    Dimension ID
- Return value: The dimension name for the given ID, or `null` if the ID is invalid
- Return value type: `String`


