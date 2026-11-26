# 💰 Economic System Events

These are the balance-change events in the LegacyMoney economic system (see [Economic System API](../DataAPI/Economy.md)):

#### `"beforeMoneyAdd"` - Pre-Money Adding Event

- Listener function prototype 
  `function(xuid,money)`
- Parameters: 
  - xuid : `String`  
    The XUID of the player whose balance changed.
  - money : `Integer`  
    The amount of money being added.
- Intercept event: Return `false`



#### `"onMoneyAdd"` - Money Adding Event

- Listener function prototype 
  `function(xuid,money)`
- Parameters: 
  - xuid : `String`  
    The XUID of the player whose balance changed.
  - money : `Integer`  
    The amount of money being added.



#### `"beforeMoneyReduce"` - Pre-Money Reduction Event

- Listener function prototype 
  `function(xuid,money)`
- Parameters: 
  - xuid : `String`  
    The XUID of the player whose balance changed.
  - money : `Integer`  
    The amount of money being deducted.
- Intercept event: Return `false`



#### `"onMoneyReduce"` - Money Reduction Event

- Listener function prototype 
  `function(xuid,money)`
- Parameters: 
  - xuid : `String`  
    The XUID of the player whose balance changed.
  - money : `Integer`  
    The amount of money being deducted.



#### `"beforeMoneyTrans"` - Pre-Player Money Transfer Event

- Listener function prototype 
  `function(from,to,money)`
- Parameters: 
  - from : `String`  
    The XUID of the player initiating the transfer.
  - to : `String`  
    The XUID of the player receiving the transfer.
  - money : `Integer`  
    The amount of money being transferred.
- Intercept event: Return `false`



#### `"onMoneyTrans"` - Player Money Transfer Event

- Listener function prototype 
  `function(from,to,money)`
- Parameters: 
  - from : `String`  
    The XUID of the player initiating the transfer.
  - to : `String`  
    The XUID of the player receiving the transfer.
  - money : `Integer`  
    The amount of money being transferred.

**Notice: When `onMoneyReduce` or `onMoneyAdd` was triggered, this event will be also triggered**


#### `"beforeMoneySet"` - Pre-Player Money Setting Event

- Listener function prototype 
  `function(xuid,money)`
- Parameters: 
  - xuid : `String`  
    The XUID of the player whose balance changed.
  - money : `Integer`  
    The amount of money being set.
- Intercept event: Return `false`



#### `"onMoneySet"` - Player Money Setting Event

- Listener function prototype 
  `function(xuid,money)`
- Parameters: 
  - xuid : `String`  
    The XUID of the player whose balance changed.
  - money : `Integer`  
    The amount of money being set.


