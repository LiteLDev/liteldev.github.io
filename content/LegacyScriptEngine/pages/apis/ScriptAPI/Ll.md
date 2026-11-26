# 💡 Plugin loading related API

This section describes the interfaces for loader operations.

### Properties

| Property                 | Type      | Description                                                |
|--------------------------|-----------|------------------------------------------------------------|
| `ll.language`            | `String`  | The language LeviLamina uses (such as `zh`, `en`, `ru_RU`) |
| `ll.major`               | `Integer` | Major version number (e.g., the **2** in **2**.7.1)        |
| `ll.minor`               | `Integer` | Minor version number (e.g., the **7** in 2.**7**.1)        |
| `ll.revision`            | `Integer` | Revision number (e.g., the **1** in 2.7.**1**)             |
| `ll.status`              | `Integer` | Status (`0` is Dev, `1` is Beta, `2` is Release)           |
| `ll.scriptEngineVersion` | `String`  | Script engine version                                      |
| `ll.isWine`              | `Boolean` | Whether LeviLamina was started under Wine                  |
| `ll.isDebugMode`         | `Boolean` | Whether LegacyScriptEngine is in debug mode                |
| `ll.isBeta`              | `Boolean` | Whether the current version is a beta version              |
| `ll.isDev`               | `Boolean` | Whether the current version is a dev version               |
| `ll.isRelease`           | `Boolean` | Whether the current version is a release version           |
| `ll.pluginsRoot`         | `String`  | Root directory of LeviLamina mods                          |

### Get LegacyScriptEngine loader version string

!!! warning
    Before 0.9.6, this function returns the version of LeviLamina.

`ll.versionString()`

- Return value: Loader version
- Return value type: `String`

### Get information about Plugin

`ll.getPluginInfo(name)`

- Parameter:
    - name: `String`
      Plugin name
- Return value: Plugin object
- Return value type: `Plugin`
    - A returned plugin object has the following members:

| Property          | Description             | Type                             |
|-------------------|-------------------------|----------------------------------|
| plugin.name       | Plugin name             | `String`                         |
| plugin.desc       | Plugin description      | `String`                         |
| plugin.type       | Plugin type (only set by `ll.getAllPluginInfo()`) | `String`               |
| plugin.version    | Plugin version (array)  | `Array<Integer,Integer,Integer>` |
| plugin.versionStr | Plugin version (string) | `String`                         |
| plugin.filePath   | Entry file of the plugin (`entry` in its manifest.json) | `String`         |
| plugin.others     | Other information       | `Object`                         |

### Get information about current Plugin

`ll.getCurrentPluginInfo()`

- Return value: Plugin object
- Return value type: `Plugin`

### List all loaded plugins

`ll.listPlugins()`

- Return value: A list of the names of all loaded plugins
- Return value type: `Array<String,String,...>`

### List all loaded plugins with information

`ll.getAllPluginInfo()`

- Return value: A list of the plugin objects of all loaded plugins
- Return value type: `Array<Plugin,Plugin,...>`

### Set the function called while the plugin is unloading

!!! warning
    This function is only available in 0.9.6 and later.

`ll.onUnload(func)`

- Parameter:
    - func : `Function`  
      Function to call when the plugin unloads

### Remote Function Call

#### Export Function

Remote function calls let prerequisite plugins expose interfaces and services to other plugins, allowing a native mod or script plugin to call functions in another plugin.

`ll.exports(func,namespace,name)`

- Parameter:
    - func : `Function`  
      Function to export
    - namespace : `String`  
      Namespace of the function, used to distinguish APIs exported by different plugins.
    - name : `String`  
      Exported name of the function. Other plugins call the function by this name.
- Return value: Whether the export succeeded.
- Return value type: `Boolean`

Note: If another exported function already uses the same namespace and name, the export will fail. Choose the namespace and export name carefully.

#### Import Function

To use a function exported by another plugin, you first need to import it into your own scripting system. LSE provides the import interface to import functions exported by other plugins.

`ll.imports(namespace,name)`

- Parameter:
    - namespace : `String`  
      The namespace name of the function being imported.
    - name : `String`  
      The name of the function being imported.
- Return value: The imported function
- Return value type: `Function`

`ll.imports` returns a function. Calling this function automatically triggers a cross-plugin call in the background. The arguments you pass are wrapped and sent to the remote function, and its return value is returned once execution finishes.

#### Remote Call Parameter Type Mapping (Type can be any other supported type)

| C++ Type                                      | Script Engine Type  | Internal Type (Note)                   |
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

#### Example of Remote Calling Function

For example, suppose a plugin exports a function named Welcome under the namespace AAA.  
Run `welcome = ll.imports("AAA", "Welcome"); ` to import this function. Once imported, you can call it directly as shown below:

`welcome("hello",2,true);`

The arguments are automatically forwarded to the target function, and its return value is returned once execution finishes. The entire process happens automatically.

Note: When calling the function, make sure the number and types of arguments you pass match the parameters accepted by the target function one-to-one. Otherwise, an error will occur.

### Determine if a remote function has been exported

`ll.hasExported(namespace,name)`

- Parameter:
    - namespace : `String`  
      The namespace name used by the function
    - name : `String`  
      The export name used by the function
- Return value: Whether the function has been exported
- Return value type: `Boolean`

### Execute a String as a Script

`ll.eval(str)`

- Parameter:
    - str : `String`  
      The string to execute as a script
- Return value: The execution result
- Return value type: `Any type`
