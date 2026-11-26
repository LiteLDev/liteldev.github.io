#  📱 设备信息对象 API

在脚本引擎中，你可以使用「设备信息对象」获取并操作玩家游戏设备的相关信息。

### 获取一个设备信息对象

#### 通过玩家获取

调用玩家对象的`.getDevice`成员函数，可获取该玩家对应的**设备信息对象**。    
详见 [玩家对象 API](./Player.zh.md)。      

>  注意：切勿**长期保存**设备信息对象。  
> 玩家退出游戏时，其对应的设备信息对象会随之释放。如需长期操作某个对象，请通过上述方法实时获取。




### 设备信息对象 - 属性

每个设备信息对象都包含以下固定属性。假设设备信息对象为`dv`，其属性如下：

| 属性              | 含义                         | 类型      |
| ----------------- | ---------------------------- | --------- |
| dv.ip             | 玩家设备的IP地址             | `String`  |
| dv.avgPing        | 玩家的平均网络延迟时间（ms） | `Integer` |
| dv.avgPacketLoss  | 玩家的平均网络丢包率（%）    | `Float`   |
| dv.lastPing       | 玩家的网络延迟时间（ms）     | `Integer` |
| dv.lastPacketLoss | 玩家的网络丢包率（%）        | `Float`   |
| dv.os             | 玩家设备的操作系统类型       | `String`  |
| dv.inputMode      | 玩家的操作模式               | `Integer` |
| dv.serverAddress  | 玩家连接的地址               | `String`  |
| dv.clientId       | 玩家客户端的识别码ID         | `String`  |

以上属性均为只读，不可修改。 

其中，操作系统类型属性返回表示玩家设备操作系统的字符串，可能的返回值如下：

| dv.os返回字符串              | 玩家设备的操作系统 |
| ------------------------ | ---------------- |
| `Google`                 | 手机谷歌Android |
| `IOS`                    | 手机苹果iOS/平板iPadOS |
| `Osx`                    | 电脑苹果macOS |
| `Amazon`                 | 平板/电视亚马逊FireOS |
| `GearVRDeprecated`       | 头显三星GearVR（已弃用） |
| `UwpDeprecated`          | 电脑微软Windows UWP（已弃用） |
| `Win32`                  | 电脑微软Windows |
| `Dedicated`              | 专用服务器 |
| `TvOSDeprecated`         | 机顶盒苹果tvOS（已弃用） |
| `Sony`                   | 主机索尼PlayStation |
| `Nintendo`               | 掌机任天堂Switch |
| `Xbox`                   | 主机微软Xbox |
| `WindowsPhoneDeprecated` | 手机微软Windows Mobile（已弃用） |
| `Linux`                  | Linux |
| `Unknown`                | 未知系统 |

| Input mode ENUM                        | 备注                 |
| -------------------------------------- | -------------------- |
| `InputMode.Undefined`                  | 未定义               |
| `InputMode.Mouse`                      | 鼠标                 |
| `InputMode.Touch`                      | 触屏                 |
| `InputMode.GamePad`                    | 手柄                 |
| `InputMode.MotionControllerDeprecated` | 运动控制器（已弃用） |
