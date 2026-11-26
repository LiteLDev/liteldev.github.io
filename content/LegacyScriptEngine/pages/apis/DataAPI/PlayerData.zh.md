# 🏃‍♂️ 玩家绑定数据

在实际开发中，经常需要将某些数据与服务器中的某个玩家相关联，并在插件的工作周期中持续维护这些数据。

为此，脚本引擎提供了玩家绑定数据接口，以键值对的形式储存数据。
将数据绑定到某个玩家后，即使该玩家对象因超出作用域而被销毁，甚至该玩家退出游戏，绑定数据依然会保留。当你再次获取该玩家的玩家对象时，仍能读取到之前储存的绑定数据。
所有数据仅在服务端关闭时才会被统一销毁。

借此，开发者可以在插件的整个生命周期中跟踪特定玩家的相关数据。

特定玩家对象 `pl` 提供以下接口：

#### 储存玩家绑定数据

`pl.setExtraData(name,data)`

- 参数：
  - name : `String`  
    要储存的绑定数据名称
  - data : `任意类型`  
    要储存的绑定数据，可以为 `Null`

- 返回值：是否储存成功
- 返回值类型：`Boolean` 

#### 获取玩家绑定数据

`pl.getExtraData(name)`

- 参数：
  - name : `String`  
    要读取的绑定数据名称
- 返回值：储存的绑定数据
- 返回值类型：`任意类型`，取决于储存的数据类型
  - 若返回值为 `Null`，则表示未获取到指定的绑定数据，或数据为空

#### 删除玩家绑定数据

`pl.delExtraData(name)`

- 参数：
  - name : `String`  
    要删除的绑定数据名称
- 返回值：是否删除成功
- 返回值类型：`Boolean`

## 👨‍💻 XUID 数据库

借助 XUID 数据库，即使玩家处于离线状态，也能查询玩家名与 XUID 的对应关系。
玩家首次进服时，其名字和 XUID 会自动记录到内置的 XUID 数据库中。可使用以下函数进行相关查询：

#### 根据玩家名查询XUID

`data.name2xuid(name)`

- 参数：
  - name : `String`  
    要查询的玩家名
- 返回值：玩家的 XUID
- 返回值类型：`String`
  - 若返回值为 `Null`，则代表查询失败

#### 根据XUID查询玩家名

`data.xuid2name(xuid)`

- 参数：
  - xuid: `String`  
    要查询的玩家 XUID
- 返回值：玩家名
- 返回值类型：`String`
  - 若返回值为 `Null`，则代表查询失败

#### 根据玩家名查询UUID

`data.name2uuid(name)`

- 参数：
  - name : `String`  
    要查询的玩家名
- 返回值：玩家的 UUID
- 返回值类型：`String`
  - 若返回值为 `Null`，则代表查询失败

#### 根据XUID查询玩家UUID

`data.xuid2uuid(xuid)`

- 参数：
  - xuid: `String`  
    要查询的玩家 XUID
- 返回值：玩家的 UUID
- 返回值类型：`String`
  - 若返回值为 `Null`，则代表查询失败

#### 获取所有的玩家信息

`data.getAllPlayerInfo()`

- 返回值: 所有玩家的信息
- 返回值类型: `Array<Object>`
  - 每个对象均包含以下属性:
    - `name`: 玩家名
    - `xuid`: 玩家 XUID
    - `uuid`: 玩家 UUID

提示：XUID 数据库中储存的玩家名对应玩家对象的 `realName` 字段。

!!! warning
    以下 API 均为 0.8.13 新增 API，使用这些 API 将导致插件无法兼容旧版本。
#### 根据XUID查询玩家信息

`data.fromXuid(xuid)`

- 参数:
  - xuid: `String`
    要查询的玩家 XUID
- 返回值：玩家信息条目，例如 `{xuid:1145141919810,name:yjsp,uuid:2a30fa4a-3a63-3370-88a8-144a941101e2}`
- 返回值类型：`Object`
  - 若返回值为 `Null`，则代表查询失败

#### 根据UUID查询玩家信息

`data.fromUuid(uuid)`

- 参数:
  - uuid: `String`
    要查询的玩家 UUID
- 返回值：玩家信息条目，例如 `{xuid:1145141919810,name:yjsp,uuid:2a30fa4a-3a63-3370-88a8-144a941101e2}`
- 返回值类型：`Object`
  - 若返回值为 `Null`，则代表查询失败

#### 根据名字查询玩家信息

`data.fromName(name)`

- 参数:
  - name: `String`
    要查询的玩家名字
- 返回值：玩家信息条目，例如 `{xuid:1145141919810,name:yjsp,uuid:2a30fa4a-3a63-3370-88a8-144a941101e2}`
- 返回值类型：`Object`
  - 若返回值为 `Null`，则代表查询失败
