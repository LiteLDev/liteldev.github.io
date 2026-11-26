# 💰 经济系统 API

在很多服务器中，经济系统都是关键的一环。  
为了解决传统计分板经济系统的种种问题，LegacyScriptEngine 提供了对接 LegacyMoney 经济系统的接口，可与其他模组和插件互通数据。 

LegacyMoney 除具备传统经济系统的功能外，还支持查询金额变动历史、操作离线玩家资金等。  
LegacyMoney 是 LegacyScriptEngine 的依赖（并非随 LeviLamina 附带），会随 LegacyScriptEngine 一同安装，无需另行安装即可直接使用此接口。 

### 设置玩家的存款金额

`Player.setMoney(value)`

`money.set(xuid,value)`

- 参数：
  - xuid : `String`  
    目标玩家的 XUID 标识符
  - value : `Integer`  
    要设置的金额  
- 返回值：是否设置成功
- 返回值类型：`Boolean`



### 获取玩家的存款金额

`Player.getMoney()`

`money.get(xuid)`

- 参数：
  - xuid : `String`  
    目标玩家的 XUID 标识符
- 返回值：玩家的资金数额
- 返回值类型：`Integer`



### 增加玩家的存款

`Player.addMoney(value)`

`money.add(xuid,value)`

- 参数：
  - xuid : `String`  
    目标玩家的 XUID 标识符
  - value : `Integer`  
    要增加的金额  
- 返回值：是否设置成功
- 返回值类型：`Boolean`



### 减少玩家的存款

`Player.reduceMoney(value)`

`money.reduce(xuid,value)`

- 参数：
  - xuid : `String`  
    目标玩家的 XUID 标识符
  - value : `Integer`  
    要减少的金额  
- 返回值：是否设置成功
- 返回值类型：`Boolean`



### 进行一笔转账

`Player.transMoney(target,money[,note])`

`money.trans(xuid1,xuid2,money[,note])`

- 参数：
  - xuid1 : `String`  
    付款玩家的 XUID 标识符
    
  - xuid2 : `String`  
    收款玩家的 XUID 标识符
  
    如果使用 `Player.transMoney`，target 可以是玩家对象
  
  - money : `Integer`  
    要支付的金额  
  
  - note : `String`  
    （可选参数）为这笔转账附加的文字说明
  
- 返回值：是否转账成功

- 返回值类型：`Boolean`



### 查询历史账单

`Player.getMoneyHistory(time)`

`money.getHistory(xuid,time)`

- 参数：
  - xuid : `String`  
    目标玩家的 XUID 标识符
  - time : `Integer`  
    查询最近 time 秒内的记录
- 返回值：查询结果对象的数组
- 返回值类型：`Array<Object>`

返回结果是由记录对象组成的数组。每个记录对象 `record` 包含以下键值对：

| 键             | 值的意义                   | 数据类型  |
| -------------- | -------------------------- | --------- |
| `record.from`  | 此笔交易的发起方玩家名     | `String`  |
| `record.to`    | 此笔交易的接收方玩家名     | `String`  |
| `record.money` | 此笔交易的金额             | `Integer` |
| `record.time`  | 此笔交易发生时的时间字符串 | `String`  |
| `record.note`  | 此笔交易的附加说明信息     | `String`  |

时间字符串的格式为：YYYY-mm-dd hh:mm:ss



### 删除账单历史记录

`money.clearHistory(time)`

- 参数：
  - time : `Integer`  
    删除 time 秒之前的记录
- 返回值：是否删除成功
- 返回值类型：`Boolean`


