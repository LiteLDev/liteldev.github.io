# 📦 方块相关事件

#### `"onBlockInteracted"` - 方块接受玩家互动

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    与方块互动的玩家对象

  - block : `Block`  
    被互动的方块对象

- 拦截事件：函数返回`false`

只有可互动的方块才会触发此事件，例如木桶、信标、制图台、砂轮等。  
对箱子、潜影盒和工作台拦截此事件无效。



#### `"onBlockChanged"` - 方块改变

- 监听函数原型
  `function(beforeBlock,afterBlock)`
- 参数：
  - beforeBlock : `Block`  
    改变前的方块对象

  - afterBlock : `Block`  
    改变后的方块对象

- 拦截事件：不可以拦截



#### `"onBlockExplode"` - 发生由方块引起的爆炸

- 监听函数原型
  `function(source,pos,radius,maxResistance,isDestroy,isFire)`
- 参数：
  - source : `Block`  
    爆炸源方块对象
  - pos : `FloatPos`  
    爆炸发生的坐标
  - radius : `Float`    
    爆炸波及的半径
  - maxResistance : `Float`  
    爆炸可破坏的方块爆炸抗性上限
  - isDestroy : `Boolean`  
    爆炸是否破坏方块
  - isFire : `Boolean`  
    爆炸是否产生火焰

- 拦截事件：函数返回`false`



#### `"onRespawnAnchorExplode"` - 发生由重生锚引起的爆炸

- 监听函数原型
  `function(pos,player)`
- 参数：
  - pos : `IntPos`  
    发生爆炸的重生锚坐标
  - player : `Player`  
    试图使用重生锚的玩家
- 拦截事件：函数返回`false`



#### `"onPortalTrySpawn"` - 下界传送门尝试生成

- 监听函数原型
  `function(pos)`
- 参数：
  - pos : `IntPos`  
    尝试生成传送门的坐标
- 拦截事件：函数返回`false`


#### `"onBlockExploded"` - 方块被爆炸破坏

- 监听函数原型
  `function(block,source)`
- 参数：
  - block : `Block`  
    被爆炸破坏的方块对象
  - source : `Entity`  
    爆炸源实体对象
- 拦截事件：不可以拦截



#### `"onFireSpread"` - 火焰蔓延

- 监听函数原型
  `function(pos)`
- 参数：
  - pos : `IntPos`  
    火焰蔓延到的方块坐标
- 拦截事件：函数返回`false`



#### `"onCmdBlockExecute"` - 命令方块执行命令

- 监听函数原型
  `function(cmd,pos,isMinecart)`
- 参数：
  - cmd : `String`  
    执行的命令
  - pos : `FloatPos`  
    执行命令的命令方块（或命令方块矿车）坐标
  - isMinecart : `Boolean`  
    命令是否由命令方块矿车执行
  
- 拦截事件：函数返回`false`



#### `"onContainerChange"` - 容器内容改变

- 监听函数原型
  `function(player,container,slotNum,oldItem,newItem)`
- 参数：
  - player : `Player`  
    操作容器的玩家对象
  - container : `Block`  
    被操作的容器方块对象
  - slotNum : `Integer`  
    被操作的容器槽位序号（第 slotNum 个格子）
  - oldItem : `Item`  
    槽位中原有的旧物品对象
  - newItem : `Item`  
    槽位中的新物品对象
- 拦截事件：不可以拦截

此处的 **容器** 是广义上的概念，箱子、木桶等各类可储存物品的容器均可触发此事件。

回调参数说明：  
旧物品对象与新物品对象的不同组合对应槽位内不同的变化情况：

- 放入物品：旧物品对象为空，新物品对象不为空
- 取出物品：旧物品对象不为空，新物品对象不为空
- 物品增加堆叠：旧物品对象的`type` == 新物品对象的`type`，且旧物品对象的`count` < 新物品对象的`count`
- 物品减少堆叠：旧物品对象的`type` == 新物品对象的`type`，且旧物品对象的`count` > 新物品对象的`count`
- 替换物品：旧物品对象的`type`不等于新物品对象的`type`，且两个物品对象均不为空


#### `"onDispenseItem"` - 发射器/投掷器发射普通物品

- 监听函数原型
  `function(pos,item,slot,face,container)`
- 参数：
  - pos : `FloatPos`
    发射出的物品出现的位置
  - item : `Item`
    被发射的物品对象
  - slot : `Integer`
    取出物品的容器槽位索引
  - face : `Integer`
    发射时的方块朝向值
  - container : `Container`
    发射器/投掷器的容器对象
- 拦截事件：函数返回`false`

仅在发射器/投掷器发射普通物品（非弹射物）时触发。



#### `"onProjectileHitBlock"` - 方块被弹射物击中

- 监听函数原型
  `function(block,source)`
- 参数：
  - block : `Block`  
    被击中的方块对象
  - source : `Entity`  
    发射出的弹射物实体（如箭）
- 拦截事件：函数返回`false`



#### `"onRedStoneUpdate"` - 发生红石更新

- 监听函数原型
  `function(block,level,isActive)`
- 参数：
  - block : `Block`  
    发生红石更新的方块对象
  - level : `Integer`  
    更新后的红石信号强度（0-15）
  - isActive : `Boolean`  
    表示红石是激活还是熄灭  
    - 为`true`表示红石变为激活状态
    - 为`false`表示红石变为熄灭状态
- 拦截事件：函数返回`false`

目前支持监测红石更新的方块包括：红石线、红石火把、红石中继器、红石比较器。



#### `"onHopperSearchItem"` - 漏斗（漏斗矿车）检测可否吸取物品

- 监听函数原型
  `function(pos,isMinecart,item)`
- 参数：
  - pos : `FloatPos`  
    漏斗（或漏斗矿车）的位置
  - isMinecart : `Boolean`  
    是否为漏斗矿车
  - item : `Item`  
    检测到的物品对象
- 拦截事件：函数返回`false`

注：放置漏斗后，服务端会持续重复触发此事件。  
拦截此事件后，漏斗将无法吸取该物品。



#### `"onHopperPushOut"` - 漏斗输出物品

- 监听函数原型
  `function(pos,isMinecart,item)`
- 参数：
  - pos : `FloatPos`  
    漏斗（或漏斗矿车）的位置
  - isMinecart : `Boolean`  
    是否为漏斗矿车
  - item : `Item`  
    准备输出的物品对象
- 拦截事件：函数返回`false`



#### `"onPistonTryPush"` - 活塞尝试推动

- 监听函数原型
  `function(pistonPos,block)`
- 参数：
  - pistonPos : `IntPos`  
    正在工作的活塞坐标
  - block : `Block`  
    尝试推动的方块对象
- 拦截事件：函数返回`false`

若活塞被方块阻挡而无法推动，此事件将持续循环触发。



#### `"onPistonPush"` - 活塞推动

- 监听函数原型
  `function(pistonPos,block)`
- 参数：
  - pistonPos : `IntPos`  
    正在工作的活塞坐标
  - block : `Block`  
    被推动的方块对象
- 拦截事件：不可以拦截

注：此事件与上一个 Try 事件同时（在推动前）触发，但无法拦截，且推动位置为空气时也会触发。



#### `"onFarmLandDecay"` - 耕地退化

- 监听函数原型
  `function(pos,entity)`
- 参数：
  - pos : `IntPos`  
    退化的耕地坐标
  - entity : `Entity`  
    造成耕地退化的实体
- 拦截事件：函数返回`false`



#### `"onUseFrameBlock"` - 操作物品展示框

- 监听函数原型
  `function(player,block)`
- 参数：
  - player : `Player`  
    操作物品展示框的玩家对象
  - block : `Block`  
    被操作的物品展示框方块对象
- 拦截事件：函数返回`false`

注：操作包括放入物品、取下物品和旋转物品。



#### `"onLiquidFlow"` - 液体方块流动

- 监听函数原型
  `function(from,to)`
- 参数：
  - from : `Block`  
    水源方块对象
  - to : `IntPos`  
    即将流向的方块坐标
- 拦截事件：函数返回`false`

