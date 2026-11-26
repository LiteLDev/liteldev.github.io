# 💰 Economic System API

An economy system is a critical part of many servers.  
To solve the problems of traditional scoreboard-based economy systems, LegacyScriptEngine provides an interface to the LegacyMoney economy system, which shares its data with other mods and plugins.

Beyond the features of a traditional economy system, LegacyMoney can also query balance-change history and manage the balances of offline players.  
LegacyMoney is a dependency of LegacyScriptEngine (it is not bundled with LeviLamina) and is installed along with it, so you can use this interface directly without installing anything else.

### Set the Player’s Deposit Amount

`Player.setMoney(value)`

`money.set(xuid,value)`

- Parameters: 
  - xuid : `String`  
    The player's XUID identifier.
  - value : `Integer`  
    The amount of money to set.  
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`



### Get the Player’s Deposit Amount

`Player.getMoney()`

`money.get(xuid)`

- Parameter: 
  - xuid : `String`  
    The XUID identifier of the player to query.
- Return value: The player's balance.
- Return value type: `Integer`



### Increase Player’s Deposit

`Player.addMoney(value)`

`money.add(xuid,value)`

- Parameters: 
  - xuid : `String`  
    The player's XUID identifier.
  - value : `Integer`  
    The amount of money to add to the player's balance.  
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`



### Decrease the Player’s Deposit

`Player.reduceMoney(value)`

`money.reduce(xuid,value)`

- Parameters: 
  - xuid : `String`  
    The player's XUID identifier.
  - value : `Integer`  
    The amount of money to deduct from the player.  
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`



### Make a Transfer

`Player.transMoney(target,money[,note])`

`money.trans(xuid1,xuid2,money[,note])`

- Parameters: 
  - xuid1 : `String`  
    The XUID identifier of the paying player.
    
  - xuid2 : `String`  
    The XUID identifier of the receiving player.
    
    If you use `Player.transMoney`, target can be a `Player` object.
    
  - money : `Integer`  
    The amount of money to transfer.  
  
  - note : `String`  
    (Optional) A note to attach to the transfer.
  
- Return value: Whether the transfer succeeded.

- Return value type: `Boolean`



### Query Historical Payments

`Player.getMoneyHistory(time)`

`money.getHistory(xuid,time)`

- Parameters: 
  - xuid : `String`  
    The player's XUID identifier.
  - time : `Integer`  
    Queries all records from the last `time` seconds.
- Return value: An array of query result objects.
- Return value type: `Array<Object>`

The result is an array of `record` objects, each with the following keys and values:

| Key            | Meaning of Value                       | Data Type |
| -------------- | -------------------------------------- | --------- |
| `record.from`  | Name of the sender                     | `String`  |
| `record.to`    | Name of the receiver                   | `String`  |
| `record.money` | Amount of money                        | `Integer` |
| `record.time`  | Time when the transaction occurred     | `String`  |
| `record.note`  | Additional notes for the transaction   | `String`  |

The time string uses the format YYYY-mm-dd hh:mm:ss.



### Delete Billing History

`money.clearHistory(time)`

- Parameter: 
  - time : `Integer`  
    Deletes all records older than `time` seconds.
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`


