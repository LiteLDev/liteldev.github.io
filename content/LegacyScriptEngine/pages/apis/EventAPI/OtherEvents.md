# 🔊 Other Events 

#### `"onScoreChanged"` - Player Scoreboard Change Event

- Listener function prototype
  `function(player,num,name,disName)`
- Parameters: 
  - player : `Player`  
    The player whose scoreboard value changed.
  - num : `Integer`  
    The new scoreboard value.
  - name : `String`  
    The name of the scoreboard objective.
  - disName : `String`  
    The display name of the scoreboard objective.
- Intercept event: Cannot be intercepted.



#### `"onTick"` - Tick Event

- Listener function prototype
  `function()`
- Parameters: 
  - None
- Intercept event: Cannot be intercepted.



#### `"onServerStarted"` - Server Start Event

- Listener function prototype
  `function()`
- Parameters: 
  - None
- Intercept event: Cannot be intercepted.



#### `"onConsoleCmd"` - Server Command Event

- Listener function prototype
  `function(cmd)`
- Parameters: 
  - cmd : `String`  
    The console command being executed.

- Intercept event: Return `false` from the listener function.
