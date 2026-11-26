# 💡 插件加载相关 API

本节介绍与加载器操作相关的接口。

### Properties

| 属性                       | 类型        | 描述                                              |
|--------------------------|-----------|-------------------------------------------------|
| `ll.language`            | `String`  | LeviLamina 使用的语言（如 `zh_Hans`、`en` 和 `ru_RU`） |
| `ll.major`               | `Integer` | 主版本号（如 **2**.1.0 中的 **2**）                      |
| `ll.minor`               | `Integer` | 次版本号（如 2.**1**.0 中的 **1**）                      |
| `ll.revision`            | `Integer` | 修订版本号（如 2.1.**0** 中的 **0**）                     |
| `ll.status`              | `Integer` | 版本状态（`0` 为 Dev，`1` 为 Beta，`2` 为 Release）        |
| `ll.scriptEngineVersion` | `String`  | 脚本引擎版本                                          |
| `ll.isWine`              | `Boolean` | 是否处于 Wine 环境下                                   |
| `ll.isDebugMode`         | `Boolean` | 是否处于 debug 模式                                   |
| `ll.isBeta`              | `Boolean` | 当前版本是否为测试版                                      |
| `ll.isDev`               | `Boolean` | 当前版本是否为开发版                                      |
| `ll.isRelease`           | `Boolean` | 当前版本是否为发布版                                      |
| `ll.pluginsRoot`         | `String`  | LeviLamina 模组的根目录                               |

### 获取 LegacyScriptEngine 版本字符串

!!! warning
    在 0.9.6 之前的版本中，该函数返回 LeviLamina 的版本。

`ll.versionString()`

- 返回值：加载器版本
- 返回值类型：`String`

### 获取有关插件的信息

`ll.getPluginInfo(name)`

- 参数：
    - name：`String`
      插件名称
- 返回值：插件对象
- 返回值类型：`Plugin`
    - 返回的插件对象 plugin 包含以下属性：

| 属性                | 描述                                 | 类型                               |
|-------------------|------------------------------------|----------------------------------|
| plugin.name       | 插件名称                               | `String`                         |
| plugin.desc       | 插件描述                               | `String`                         |
| plugin.type       | 插件类型（仅 `ll.getAllPluginInfo()` 提供） | `String`                         |
| plugin.version    | 插件版本（数组形式）                         | `Array<Integer,Integer,Integer>` |
| plugin.versionStr | 插件版本                               | `String`                         |
| plugin.filePath   | 插件入口文件（manifest.json 中的 `entry`）   | `String`                         |
| plugin.others     | 其他信息                               | `Object`                         |

### 获取当前插件的信息

`ll.getCurrentPluginInfo()`

- 返回值：插件对象
- 返回值类型：`Plugin`

### 列出所有已加载的插件

`ll.listPlugins()`

- 返回值：所有已加载插件的名称列表
- 返回值类型：`Array<String,String,...>`

### 列出所有加载的插件信息

`ll.getAllPluginInfo()`

- 返回值：所有已加载插件的对象列表
- 返回值类型：`Array<Plugin,Plugin,...>`

### 设置插件卸载时调用的函数

!!! warning
    该函数仅在 0.9.6 及更高版本中可用。

`ll.onUnload(func)`

- 参数：
    - func：`Function`
      插件卸载时调用的函数

### 远程函数调用

#### 导出函数

借助远程函数调用功能，前置插件可以为其他插件提供接口与服务，使原生模组或脚本插件能够直接调用另一个插件中的函数。

`ll.exports(func,namespace,name)`

- 参数：
    - func：`Function`  
      要导出的函数
    - namespace：`String`  
      函数的命名空间名称，用于区分不同插件导出的 API
    - name：`String`  
      函数的导出名称，其他插件通过该名称调用此函数
- 返回值：是否成功导出
- 返回值类型：`Boolean`

注意：如果导出的函数与另一个已导出函数的命名空间和名称完全相同，导出将会失败。请谨慎选择命名空间和导出名称。

#### 导入函数

要使用其他插件导出的函数，首先需要使用脚本引擎提供的 import 接口将其导入到当前脚本系统中。

`ll.imports(namespace,name)`

- 参数：
    - namespace：`String`  
      要导入函数的命名空间名称
    - name：`String`  
      要导入函数的导出名称
- 返回值：导入的函数
- 返回值类型：`Function`

`ll.imports` 返回一个函数。调用该函数时，跨插件调用流程会在后台自动完成：传入的参数会被打包并传递给远程函数，而函数的返回值即远程函数执行完毕后的返回值。

#### 远程调用参数类型对照，其中Type可以为其他受支持的类型

| C++层类型                                     | 脚本引擎类型        | 内部类型（备注）                       |
|-----------------------------------------------|---------------------|----------------------------------------|
| `std::nullptr_t`                              | `Null`              | `std::nullptr_t`                       |
| `bool`                                        | `Boolean`           | `bool`                                 |
| `__int64`, `double`...                        | `Integer` / `Float` | `RemoteCall::NumberType`               |
| `std::string`                                 | `String`            | `std::string`                          |
| `std::vector<Type>`                           | `Array`             | `std::vector<Type>`                    |
| `std::unordered_map<std::string,Type>`        | `Object`            | `std::unordered_map<std::string,Type>` |
| `Actor*`                                      | `Entity`            | `Actor*`                               |
| `Player*`                                     | `Player`            | `Player*`                              |
| `ItemStack*`, `std::unique_ptr<ItemStack>`    | `Item`              | `RemoteCall::ItemType`                 |
| `Block*`, `BlockInstance`                     | `Block`             | `RemoteCall::BlockType`                |
| `BlockActor*`                                 | `BlockEntity`       | `BlockActor*`                          |
| `Container*`                                  | `Container`         | `Container*`                           |
| `Vec3`,`std::pair<Vec3,int>`                  | `FloatPos`          | `RemoteCall::WorldPosType`             |
| `BlockPos`,`std::pair<BlockPos, int>`         | `IntPos`            | `RemoteCall::BlockPosType`             |
| `CompoundTag*`,`std::unique_ptr<CompoundTag>` | `NbtCompound`       | `RemoteCall::NbtType`                  |

#### 远程调用函数举例说明

例如，某插件在命名空间 AAA 下导出了名为 Welcome 的函数。  
通过 `welcome = ll.imports("AAA","Welcome"); ` 导入该函数后，即可直接调用：

`welcome("hello",2,true);`

参数会自动转发给目标函数执行，执行完毕后返回目标函数的返回值，整个过程均自动完成。

注意！调用函数时，传入参数的数量和类型必须与目标函数接收的参数一一对应，否则会报错。

### 判断远程函数是否已导出

`ll.hasExported(namespace,name)`

- 参数：
    - namespace : `String`  
      函数使用的命名空间名称
    - name : `String`  
      函数使用的导出名称
- 返回值：函数是否已导出
- 返回值类型： `Boolean`

### 将字符串作为脚本代码执行

`ll.eval(str)`

- 参数：
    - str : `String`  
      要作为脚本代码执行的字符串
- 返回值：执行结果
- 返回值类型： `任意类型`

