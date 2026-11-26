# 🔨 配置文件 API

> 这里为你提供了处理 **大量数据** 时的多种可选方案

插件在运行过程中，常需处理配置项和大量游戏相关数据。  
为此，脚本引擎提供了配置文件、数据库、经济系统等丰富的**基础设施**，让开发者能够专注于业务逻辑，无需纠结底层技术细节。  

## 🔨 配置文件 API

配置文件通常用于将插件中可供用户修改的设置项独立保存，方便用户调整。  
因此，配置文件的内容和格式一般需要具备良好的可读性。  
脚本引擎提供了 ConfigFile 配置文件接口来完成这一任务。  
当然，你也可以直接手动读写文件来管理配置。  



### 说明：配置文件类型的选择

配置文件的格式决定了可存储的数据类型：  

- `JSON`（**JS** **O**bject **N**otation）格式可以存储**大多数**类型的数据（包括数组、对象等），能表达更丰富的逻辑结构。  
- `Ini`（**Ini**tialization File）格式相对**简单直观**，便于用户手动修改，但支持的数据类型有限。

请根据实际需求选择。



### 📰 JSON 格式配置文件

#### 创建 / 打开一个 JSON 配置文件

[JavaScript] `new JsonConfigFile(path[,default])`  
[Lua] `JsonConfigFile(path[,default])`

- 参数：
  - path : `String`  
    配置文件所在路径，以 BDS 根目录为基准。  
    如果路径中的目录尚不存在，脚本引擎会自动创建。
  - default : `String`  
    （可选参数）配置文件的默认内容。  
    如果初始化时目标文件**不存在**，引擎会新建该文件并写入此默认内容。  
    若不传入此参数，新建的配置文件将为空。
- 返回值：打开或创建的配置文件对象。
- 返回值类型：`JsonConfigFile`
  - 如果创建或打开失败，将抛出异常。

建议在 `BDS根目录/plugins/插件名字/` 目录下创建名为 `config.json` 的配置文件，以保持各插件配置路径的统一。



对于 JSON 配置文件对象 `conf`，可使用以下读写接口：

#### 初始化配置项（方便函数）

`conf.init(name,default)`

- 参数：
  - name : `String`  
    配置项名称。
  - default : `任意类型`  
    配置项初始化时写入的默认值。
- 返回值：指定配置项的数据。
- 返回值类型：`任意类型`，以实际存储的数据类型为准。

此方法可简便地初始化配置文件，免去手写默认配置内容的麻烦。  

如果 `init` 访问的配置项不存在，引擎会在配置文件中自动创建该项并写入默认值；  
如果 `init` 访问的配置项已存在，引擎则直接读取并返回文件中的现有值。



#### 写入配置项

`conf.set(name,data)`

- 参数：
  - name : `String`  
    配置项名称。
  - data : `任意类型`  
    要写入的配置数据。允许的数据类型包括：  
    `Integer` `Float` `String` `Boolean` `Array` `Object`  
    其中，`Array` 和 `Object` 内部仅能嵌套上述类型。

- 返回值：是否写入成功。

- 返回值类型：`Boolean`



#### 读取配置项

`conf.get(name[,default])`

- 参数：
  - name : `String`  
    配置项名称。
  - default : `任意类型`  
    （可选参数）读取失败时返回的默认值，默认为 `Null`。
- 返回值：指定配置项的数据。
- 返回值类型：`任意类型`，以实际存储的数据类型为准。



#### 删除配置项

`conf.delete(name)`

- 参数：
  - name : `String`  
    配置项名称。
- 返回值：是否删除成功。
- 返回值类型：`Boolean`

如果某个配置项不再使用，建议将其删除，以免他人在修改配置文件时产生困惑。



### 📄 Ini 格式配置文件

#### 创建 / 打开一个 Ini 配置文件

[JavaScript] `new IniConfigFile(path[,default])`  
[Lua] `IniConfigFile(path[,default])`

- 参数：
  - path : `String`  
    配置文件所在路径，以 BDS 根目录为基准。  
    如果路径中的目录尚不存在，脚本引擎会自动创建。
  - default : `String`  
    （可选参数）配置文件的默认内容。  
    如果初始化时目标文件**不存在**，引擎会新建该文件并写入此默认内容。  
    若不传入此参数，新建的配置文件将为空。
- 返回值：打开或创建的配置文件对象。
- 返回值类型：`IniConfigFile`
  - 如果创建或打开失败，将抛出异常。

建议在 `BDS根目录/plugins/插件名字/` 目录下创建名为 `config.ini` 的配置文件，以保持各插件配置路径的统一。



对于 Ini 配置文件对象 `conf`，可使用以下读写接口：

#### 初始化配置项（方便函数）

`conf.init(section,name,default)`

- 参数：
  - section : `String`  
    配置项键名。
  - name : `String`  
    配置项名称。
  - default : `任意类型`  
    配置项初始化时写入的默认值。允许的数据类型包括：  
    `Integer` `Float` `String` `Boolean`
- 返回值：指定配置项的数据。
- 返回值类型：`任意类型`，以实际存储的数据类型为准。

此方法可简便地初始化配置文件，免去手写默认配置内容的麻烦。  

如果 `init` 访问的配置项不存在，引擎会在配置文件中自动创建该项并写入默认值；  
如果 `init` 访问的配置项已存在，引擎则直接读取并返回文件中的现有值。



#### 写入配置项

`conf.set(section,name,data)`

- 参数：
  - section : `String`  
    配置项键名。
  - name : `String`  
    配置项名称。
  - data : `任意类型`  
    要写入的配置数据。允许的数据类型包括：  
    `Integer` `Float` `String` `Boolean`

- 返回值：是否写入成功。

- 返回值类型：`Boolean`

如果配置项不存在，接口会自动创建。



#### 读取配置项

读取字符串 `conf.getStr(section,name[,default])`  
读取整数项 `conf.getInt(section,name[,default])`  
读取浮点数 `conf.getFloat(section,name[,default])`  
读取布尔值 `conf.getBool(section,name[,default])`  

- 参数：
  - section : `String`  
    配置项键名。
  - name : `String`  
    配置项名称。
  - default :  `String`/ `Integer`/ `Float`/ `Boolean`  
    （可选参数）读取失败时返回的默认值，默认为 `0`。
- 返回值：指定配置项的数据。
- 返回值类型：`String`/ `Integer`/ `Float`/ `Boolean`



#### 删除配置项

`conf.delete(section,name)`

- 参数：
  - section : `String`  
    配置项键名。
  - name : `String`  
    配置项名称。
- 返回值：是否删除成功。
- 返回值类型：`Boolean`

如果某个配置项不再使用，建议将其删除，以免他人在修改配置文件时产生困惑。



### 💼 其他的通用接口函数

对于配置文件对象 `conf`，还可以使用以下通用辅助接口：

#### 重新加载文件中的配置项

`conf.reload()`

- 返回值：是否成功加载。

出于性能考虑，配置文件接口对读操作做了缓存处理：每次读取都直接从内存中获取，只有写入时才会直接写入磁盘文件。因此，当确认用户手动修改了配置文件后，需调用此函数刷新内存中的缓存数据。



#### 关闭配置文件

`conf.close()`

- 返回值：是否成功关闭。

配置文件关闭后，请勿继续使用！



#### 获取配置文件路径

`conf.getPath()`

- 返回值：当前配置文件的文件路径。
- 返回值类型：`String`



#### 读取整个配置文件的内容

`conf.read()`

- 返回值：当前配置文件的全部内容。
- 返回值类型：`String`



#### 写入整个配置文件的内容

`conf.write(content)`

- 参数：
  - content : `String`  
    写入的内容。
- 返回值：是否写入成功。
- 返回值类型：`Boolean`

