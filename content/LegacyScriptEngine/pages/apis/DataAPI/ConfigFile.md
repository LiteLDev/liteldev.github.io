# 🔨 Configuration File API

> Here are a variety of options for working with **large amounts of data**

When developing plugins, you will inevitably need to handle configuration and large amounts of game-related data.
LSE provides extensive `infrastructure`, including configuration files, databases, economic systems, and more.
This lets developers focus on implementing business logic rather than getting bogged down in technical details.

## 🔨 Profile API

Configuration files are generally used to store user-modifiable plugin settings in a separate file, making them easy to adjust.
Therefore, a configuration file's content and format should generally be human-readable.
LSE provides the ConfigFile interface for this purpose.
Of course, you can also read and write files manually to help manage your configuration files.



### Description: Selection of Configuration File Type

Your choice of configuration file format determines the types of data you can store.

- The `JSON` format can store **most** data types, including arrays and objects, and offers rich data representation.
- The `ini` format is relatively `simple and intuitive` and very easy for others to edit, but it restricts the types of data you can store.

Choose the format that best fits your needs.



### 📰 JSON Format Configuration File

#### Create/Open a JSON Configuration File

[JavaScript] `new JsonConfigFile(path[,default])`  
[Lua] `JsonConfigFile(path[,default])`

- Parameters: 
  - path : `String`  
    The path to the configuration file, relative to the BDS root directory.  
    LSE automatically creates any missing directories in the path.
  - default : `String`  
    (Optional) The default content of the configuration file.  
    If the file **does not exist** during initialization, the engine creates a new configuration file and writes this default content to it.  
    If you omit this parameter, the new configuration file will be empty.
- Return value: The opened or newly created configuration file object.
- Return value type: `JsonConfigFile`
  - Throws an exception if creating or opening the file fails.

To keep plugin configurations consistent, we recommend creating a `BDS_Root_Directory/plugins/plugin_name/` directory and naming the configuration file `config.json`.



A JSON configuration file object `conf` provides the following read and write interfaces.

#### Initialize Configuration Items (Convenience Function

`conf.init(name,default)`

- Parameters: 
  - name : `String`  
    The name of the configuration item.
  - default : `Any type`  
    The initial value written to the configuration item.
- Return value: The value of the specified configuration item.
- Return value type: `Any type`, depending on the specific type of data stored.

This method provides an easy way to initialize a configuration file without having to write the default content by hand:

If the specified configuration item does not exist, the engine automatically creates it via `init` in the configuration file and writes the given default value.
If the configuration item accessed by `init` already exists, the engine reads and returns its existing value from the configuration file.


#### Write Configuration Item

`conf.set(name,data)`

- Parameters: 
  - name : `String`  
    The name of the configuration item.
  - data : `Any type`  
    The configuration data to write. Allowed data types are:    
    `Integer` `Float` `String` `Boolean` `Array` `Object`  
    Only these types may be nested inside an `Array` or `Object`.

- Return value: Whether the write succeeded.

- Return value type: `Boolean`



#### Read Configuration Items

`conf.get(name[,default])`

- Parameters: 
  - name : `String`  
    The name of the configuration item.
  - default : `Any type`  
    (Optional) The default value to return if the read fails.  
    Defaults to `Null`.
- Return value: The value of the specified configuration item.
- Return value type: `Any type`, depending on the specific type of data stored.



#### Delete Configuration Item

`conf.delete(name)`

- Parameter:
  - name : `String`  
    The name of the configuration item.
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`

If you no longer need a configuration item, you can delete it to avoid confusing users who edit the configuration file.



### 📄 Ini Format Configuration File

#### Create/Open an Ini Profile 

[JavaScript] `new IniConfigFile(path[,default])`  
[Lua] `IniConfigFile(path[,default])`

- Parameters: 
  - path : `String`  
    The path to the configuration file, relative to the BDS root directory.  
    LSE automatically creates any missing directories in the path.
  - default : `String`  
    (Optional) Default content of the configuration file.  
    If the file **does not exist** during initialization, the engine creates it and writes this default content to it.  
    If this parameter is omitted, the new configuration file is empty.
- Return value: The opened or created profile object.
- Return value type: `IniConfigFile`
  - Throws an exception if creating or opening the file fails.

To keep plugin configurations consistent, we recommend placing a `config.ini` file in `BDS_Root_Directory/plugins/plugin_name/`.



An ini profile object `conf` provides the following read and write interfaces:

#### Initialize Configuration Items (Convenience Function)

`conf.init(section,name,default)`

- Parameters: 
  - section : `String`  
    Configuration item key name
  - name : `String`  
    Configuration item name
  - default : `Any type`  
    The value written when the configuration item is initialized. Allowed data types:
    `Integer` `Float` `String` `Boolean`
- Return value: The data of the specified configuration item.
- Return value type: `Any type`, depending on the stored data type.

This method provides a convenient way to initialize the configuration file without writing the default contents by hand.

If the configuration item accessed by `init` does not exist, the engine creates it in the configuration file and writes the given default value.
If the configuration item accessed by `init` already exists, the engine reads and returns its existing value from the configuration file.



#### Write Configuration Item

`conf.set(section,name,data)`

- Parameters: 
  - section : `String`  
    Configuration item key name
  - name : `String`  
    Configuration item name
  - data : `Any type`  
    Configuration data to write. Allowed data types:    
    `Integer` `Float` `String` `Boolean`

- Return value: Whether the write succeeded.

- Return value type: `Boolean`

If the configuration item does not exist, this interface creates it automatically.



#### Read Configuration Items

Read string `conf.getStr(section,name[,default])`  
Read integer `conf.getInt(section,name[,default])`  
Read float `conf.getFloat(section,name[,default])`  
Read boolean `conf.getBool(section,name[,default])`  

- Parameters: 
  - section : `String`  
    Configuration item key name
  - name : `String`  
    Configuration item name
  - default :  `String`/ `Integer`/ `Float`/ `Boolean`  
    (Optional) The default value returned if the read fails.  
    Defaults to `0`.
- Return value: The data of the specified configuration item.
- Return value type: `String`/ `Integer`/ `Float`/ `Boolean`



#### Delete Configuration Item

`conf.delete(section,name)`

- Parameters: 
  - section : `String`  
    Configuration item key name
  - name : `String`  
    Configuration item name
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`

If a configuration item is no longer needed, you can delete it to avoid confusing users who edit the configuration file.



### 💼 Other Common Interface Functions

A profile object `conf` also provides these utility interfaces:

#### Reload the Configuration Items in the File

`conf.reload()`

- Return value: Whether the reload succeeded.

For performance reasons, the configuration file interface caches reads in memory while writing changes directly to disk. If a user modifies the configuration file on disk, call this function to refresh the in-memory cache.



#### Close Config File

`conf.close()`

- Return value: Whether closing the file succeeded.

Do not continue to use the profile after closing it!



#### Get Configuration File Path

`conf.getPath()`

- Return value: The file path of the current configuration file.
- Return value type: `String`



#### Read the Content of the Entire Configuration File

`conf.read()`

- Return value: The entire contents of the current configuration file.
- Return value type: `String`



#### Write the Contents of the Entire Configuration File

`conf.write(content)`

- Parameter: 
  - content : `String`  
    The string to write to the configuration file.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

