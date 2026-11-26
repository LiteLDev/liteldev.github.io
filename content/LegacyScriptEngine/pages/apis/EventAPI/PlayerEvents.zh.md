# 🏃‍♂️ 玩家相关事件

#### `"onPreJoin"` - 玩家开始连接服务器

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    正在连接服务器的玩家对象
- 拦截事件：函数返回`false`

注：此时玩家尚未完全进入服务器，因此在该监听函数中只能获取名字、IP、XUID等基础信息。



#### `"onJoin"` - 玩家进入游戏（加载世界完成）

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    进入游戏的玩家对象
- 拦截事件：函数返回`false`



#### `"onLeft"` - 玩家离开游戏

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    离开游戏的玩家对象

- 拦截事件：不可以拦截



#### `"onRespawn"` - 玩家重生

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    重生的玩家对象
- 拦截事件：不可以拦截



#### `"onPlayerDie"` - 玩家死亡

- 监听函数原型
  `function(player,source)`
- 参数：
  - player : `Player`  
    死亡的玩家对象
  - source : `Entity`  
    伤害来源的实体对象（可能为`Null`）
  
- 拦截事件：不可以拦截



#### `"onPlayerCmd"` - 玩家执行命令

- 监听函数原型
  `function(player,cmd)`
- 参数：
  - player : `Player`  
    执行命令的玩家对象

  - cmd : `String`  
    执行的命令

- 拦截事件：函数返回`false`



#### `"onChat"` - 玩家发送聊天信息

- 监听函数原型
  `function(player,msg)`
- 参数：
  - player : `Player`  
    发送聊天信息的玩家对象

  - msg : `String`  
    发送的聊天消息

- 拦截事件：函数返回`false`



#### `"onChangeDim"` - 玩家切换维度

- 监听函数原型
  `function(player,dimid)`
- 参数：
  - player : `Player`  
    切换维度的玩家对象
  - dimid : `Integer`  
    目标维度的ID，0为主世界，1为下界，2为末地
- 拦截事件：不可以拦截

提醒：玩家通过返回传送门从末地返回主世界时，不会触发此事件。



#### `"onJump"` - 玩家跳跃

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    跳跃的玩家对象

- 拦截事件：不可以拦截



#### `"onSneak"` - 玩家切换潜行状态

- 监听函数原型
  `function(player,isSneaking)`
- 参数：
  - player : `Player`  
    切换潜行状态的玩家对象
  - isSneaking : `Boolean`  
    `True`表示进入潜行状态，`False`表示退出潜行状态

- 拦截事件：函数返回`false`



#### `"onPlayerSwing"` - 玩家挥手

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    挥手的玩家对象

- 拦截事件：不可以拦截



#### `"onAttackEntity"` - 玩家攻击实体

- 监听函数原型
  `function(player,entity)`
- 参数：
  - player : `Player` 
    攻击实体的玩家对象

  - entity : `Entity` 
    被攻击的实体对象

- 拦截事件：函数返回`false`



#### `"onAttackBlock"` - 玩家攻击方块

- 监听函数原型
  `function(player,block,item)`

- 参数：

  - player : `Player` 
    攻击方块的玩家对象

  - block : `Block` 
    被攻击的方块对象

  - item：`Item`

    手持的物品对象

- 拦截事件：函数返回`false`



#### `"onUseItem"` - 玩家使用物品 

- 监听函数原型
  `function(player,item)`
- 参数：
  - player : `Player`  
    使用物品的玩家对象
  - item : `Item`  
    被使用的物品对象
- 拦截事件：函数返回`false`



#### `"onUseItemOn"` - 玩家对方块使用物品（点击右键）

- 监听函数原型
  `function(player,item,block,side,pos)`
- 参数：
  - player : `Player`  
    使用物品的玩家对象
  - item : `Item`  
    被使用的物品对象
  - block : `Block`  
    被点击的方块对象
  - side : `Number`  
    方块被点击的面  
    依次为：`0`-下 `1`-上 `2`-北 `3`-南 `4`-西 `5`-东
  - pos : `FloatPos`  
    被点击的浮点坐标

- 拦截事件：函数返回`false`

注：Win10客户端玩家点击右键时，会在服务端连续多次触发此事件。



#### `"onUseBucketPlace"` - 玩家使用桶倒出东西

- 监听函数原型
  `function(player,item,block,side,pos)`
- 参数：
  - player : `Player`  
    使用物品的玩家对象
  - item : `Item`  
    被使用的物品对象
  - block : `Block`  
    从桶中倒出的方块对象（如水、熔岩），位于放置位置
  - side : `Number`  
    方块被点击的面  
    依次为：`0`-下 `1`-上 `2`-北 `3`-南 `4`-西 `5`-东
  - pos : `FloatPos`  
    倒出内容的位置

- 拦截事件：函数返回`false`

注：无论是手机端还是Win10端玩家，都可能连续多次触发此事件。



#### `"onUseBucketTake"` - 玩家使用桶装进东西

- 监听函数原型
  `function(player,item,target,side,pos)`
- 参数：
  - player : `Player`  
    使用物品的玩家对象
  - item : `Item`  
    被使用的物品对象
  - target : `Block`  
    被装进桶的方块对象（水、熔岩或细雪）
  - side : `Number`  
    固定为`-1`
  - pos : `FloatPos`  
    被装进桶的方块位置

- 拦截事件：函数返回`false`

注：无论是手机端还是Win10端玩家，都可能连续多次触发此事件。



#### `"onTakeItem"` - 玩家捡起物品

- 监听函数原型
  `function(player,entity,item)`
- 参数：

  - player : `Player`  
    捡起物品的玩家对象
  - entity: `Entity`  
    即将被捡起的掉落物实体
  - item : `Item`  
    即将被捡起的物品对象

- 拦截事件：函数返回`false`



#### `"onDropItem"` - 玩家丢出物品

- 监听函数原型
  `function(player,item)`
- 参数：
  - player : `Player`  
    丢出物品的玩家对象

  - item : `Item`  
    被丢出的物品对象

- 拦截事件：函数返回`false`



#### `"onEat"` - 玩家正在吃食物

- 监听函数原型
  `function(player,item)`
- 参数：
  - player : `Player`  
    正在进食的玩家对象
  - item : `Item`  
    被食用的物品对象
  
- 拦截事件：函数返回`false`

此处的 **食物** 为广义概念，包括常规食物、药水、牛奶、药品等多种可摄入的物品。



#### `"onAte"` - 玩家吃下食物

- 监听函数原型
  `function(player,item)`
- 参数：
  - player : `Player`  
    吃下食物的玩家对象
  - item : `Item`  
    被吃下的物品对象
  
- 拦截事件：函数返回`false`



#### `"onConsumeTotem"` - 玩家消耗图腾

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    消耗图腾的玩家对象
- 拦截事件：函数返回`false`
  - 拦截此事件后，图腾的复活效果仍会触发，但图腾不会被消耗。



#### `"onEffectAdded"` - 玩家获得效果

- 监听函数原型
  `function(player,effectName,amplifier,duration)`
- 参数：
  - player : `Player`  
    获得效果的玩家对象
  - effectName : `String`  
    获得的效果名称 **minecraft:effect.效果**
  - amplifier : `Number`  
    获得的效果倍率（效果等级 -1）
  - duration : `Number`  
    获得的效果时长（单位：tick）
  
- 拦截事件：函数返回`false`



#### `"onEffectRemoved"` - 玩家移除效果

- 监听函数原型
  `function(player,effectName)`
- 参数：
  - player : `Player`  
    被移除效果的玩家对象
  - effectName : `String`   
    被移除的效果名称 **minecraft:effect.效果**
  
- 拦截事件：函数返回`false`



#### `"onEffectUpdated"` - 玩家刷新效果

- 监听函数原型
  `function(player,effectName,amplifier,duration)`
- 参数：
  - player : `Player`  
    刷新效果的玩家对象
  - effectName : `String`  
    获得的效果名称 **minecraft:effect.效果**
  - amplifier : `Number`  
    获得的效果倍率（效果等级 -1）
  - duration : `Number`  
    获得的效果时长（单位：tick）
  
- 拦截事件：函数返回`false`



#### `"onStartDestroyBlock"` - 玩家开始破坏方块  / 点击左键

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    正在破坏方块的玩家对象

  - block : `Block`  
    正在被破坏的方块对象

- 拦截事件：函数返回`false`



#### `"onDestroyBlock"` - 玩家破坏方块完成

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    破坏方块的玩家对象

  - block : `Block`  
    被破坏的方块对象

- 拦截事件：函数返回`false`



#### `"onPlaceBlock"` - 玩家尝试放置方块

- 监听函数原型
  `function(player,block,face)`
- 参数：
  - player : `Player`  
    放置方块的玩家对象

  - block : `Block`  
    将要放置的方块对象

  - face : `Integer`  
    所放置方块的朝向

- 拦截事件：函数返回`false`

> **存在问题** 当玩家尝试放置方块时，该事件会持续触发。



#### `"afterPlaceBlock"` - 玩家放置方块

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    放置方块的玩家对象

  - block : `Block`  
    被放置的方块对象

- 拦截事件：不可拦截



#### `"onOpenContainer"` - 玩家打开容器方块

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    打开容器方块的玩家对象

  - block : `Block`  
    被打开的容器方块对象
- 拦截事件：函数返回`false`

此处的 **容器** 是广义的容器，箱子、木桶等各类可存储物品的容器均可触发此事件。



#### `"onCloseContainer"` - 玩家关闭容器方块

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    关闭容器方块的玩家对象

  - block : `Block`  
    被关闭的容器方块对象
- 拦截事件：不可拦截



#### `"onInventoryChange"` - 玩家物品栏变化

- 监听函数原型
  `function(player,slotNum,oldItem,newItem)`
- 参数：
  - player : `Player`  
    操作物品栏的玩家对象
  - slotNum : `Integer`  
    被操作的物品栏槽位（第 slotNum 个格子）
  - oldItem : `Item`  
    槽位中原有的旧物品对象
  - newItem : `Item`  
    槽位中的新物品对象
- 拦截事件：函数返回`false`

回调参数说明：  
旧物品对象与新物品对象的不同组合代表槽位内的不同变化情况：

- 放入物品：旧物品对象为空，新物品对象不为空
- 取出物品：旧物品对象不为空，新物品对象为空
- 物品增加堆叠：旧物品对象的`type` == 新物品对象的`type`，且旧物品对象的`count` < 新物品对象的`count`
- 物品减少堆叠：旧物品对象的`type` == 新物品对象的`type`，且旧物品对象的`count` > 新物品对象的`count`
- 替换物品：旧物品对象的`type`不等于新物品对象的`type`，且两个物品对象均不为空



#### `"onChangeSprinting"` - 玩家改变疾跑状态

- 监听函数原型
  `function(player,sprinting)`
- 参数：
  - player : `Player`  
    即将改变疾跑状态的玩家对象
  - sprinting : `Boolean`  
    即将切换到的疾跑状态
- 拦截事件：不可拦截

注：可在下一游戏刻执行 player.setSprinting(false) 来达到拦截效果。



#### `"onSetArmor"` - 玩家改变盔甲栏

- 监听函数原型
  `function(player,slotNum,item)`
- 参数：
  - player : `Player`  
    改变盔甲栏的玩家对象
  - slotNum : `Integer`  
    盔甲栏序号，范围为 0-3
  - item : `Item`  
    盔甲栏中的物品对象
- 拦截事件：函数返回`false`
- 注：拦截后，玩家在进入游戏时会脱下原有装备。



#### `"onUseRespawnAnchor"` - 玩家使用重生锚

- 监听函数原型
  `function(player,pos)`
- 参数：
  - player : `Player`  
    使用重生锚的玩家对象
  - pos : `IntPos`  
    所使用的重生锚的位置
- 拦截事件：函数返回`false`



#### `"onOpenContainerScreen"` - 玩家打开容器类GUI

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    尝试打开 GUI 的玩家对象
- 拦截事件：函数返回`false`

注：此事件作用范围广，甚至可以拦截打开背包的操作。



#### `"onOpenInventory"` - 玩家打开物品栏

- 监听函数原型
  `function(player)`
- 参数：
  - player : `Player`  
    打开物品栏的玩家对象
- 拦截事件：函数返回`false`



#### `"onExperienceAdd"` - 玩家获得经验

- 监听函数原型
  `function(player,exp)`
- 参数：
  - player : `Player`  
    获得经验的玩家对象
  - exp : `Integer`
    获得的经验值
- 拦截事件：函数返回`false`



#### `"onPlayerPullFishingHook"` - 玩家使用钓鱼竿钓起实体

- 监听函数原型
  `function(player,entity,item)`
- 参数：
  - player : `Player`  
    使用钓鱼竿的玩家对象
  - entity : `Entity`  
    钓起的实体（鱼钩拉起任意实体均会触发此事件，不限于物品实体）
  - item : `Item`  
    钓起的物品对象（若钓起的不是物品，则返回 null）
- 拦截事件：函数返回`false`



#### `"onBedEnter"` - 玩家上床

- 监听函数原型
  `function(player,pos)`
- 参数：
  - player : `Player`  
    上床的玩家对象
  - pos : `IntPos`  
    床的位置
- 拦截事件：函数返回`false`



#### `"onPlayerInteractEntity"` - 玩家交互实体

!!! warning
    此事件仅在 0.9.5 及更高版本中可用。

- 监听函数原型
  `function(player, entity, pos)`
- 参数：
  - player : `Player`  
    与实体交互的玩家对象
  - entity : `Entity`  
    被交互的实体对象
  - pos : `FloatPos`  
    交互坐标
- 拦截事件：函数返回`false`
