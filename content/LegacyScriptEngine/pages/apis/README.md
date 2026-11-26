# Overview of LSE Plugin Development

## ⛳ Start

`LegacyScriptEngine`, hereinafter referred to as **LSE**, is a plugin framework for `Bedrock Dedicated Server` (hereinafter referred to as **BDS**), the official server for Minecraft Bedrock Edition, and for the Minecraft client on Windows. It provides powerful cross-language script plugin support and a stable development API.

> Welcome to LSE plugin development!

Here, you will learn the basic elements and workflow of LSE plugin development.

Before you begin developing, you need a systematic understanding of LSE. This documentation will first help you build a general knowledge framework. Be sure to familiarize yourself with these concepts first, as they are an essential part of learning the development process.



## 💊 Data Types

A type system is usually a critical part of a design framework. First, you should get familiar with several data types that you will use frequently when working with the API documentation. The names of these data types appear often in the development documentation, so be sure to learn them first.

### Generic Data Type Conventions

Although scripting languages are usually weakly typed and do not require attention to specific data types, LSE supports a variety of scripting languages. To make working with the API easier, the table below defines general data types and how they map to the corresponding types in each scripting language.

| Engine Data Type | JS Data Type       | Lua Data Type | Data Type Description                  |
| ---------------- | ------------------ | ------------- | -------------------------------------- |
| `Null`           | `null` `undefined` | `nil`         | Empty, undefined, does not exist, etc. |
| `Integer`        | `Number`           | `number`      | Integer                                |
| `Float`          | `Number`           | `number`      | Float (Decimal, Real)                  |
| `String`         | `String`           | `string`      | String                                 |
| `Boolean`        | `Boolean`          | `boolean`     | Boolean                                |
| `Function`       | `Function`         | `function`    | Function (Method)                      |
| `Array`          | `Array`            | `table`       | Array (List)                           |
| `Object`         | `Object`           | `table`       | Objects (Maps, Dictionaries, Tables)   |
| `ByteBuffer`     | `ArrayBuffer`      | `table`       | Byte Array                             |

In the documentation, `Any type` means that a value of any of the types above can be used.

In addition to the standard types above, the engine defines several object types:

- `IntPos` - Integer coordinate object (see the base game interface for details)
- `FloatPos` - Floating-point coordinate object (see the base game interface for details)
- `Player` - Player object (see Player for details) - class name actually registered in the engine: `LLSE_Player`
- `Entity` - Entity object (see Entity for details) - class name actually registered in the engine: `LLSE_Entity`
- `Block` - Block object (see Blocks for details) - class name actually registered in the engine: `LLSE_Block`
- `BlockEntity` - Block entity object (see Block entity for details) - class name actually registered in the engine: `LLSE_BlockEntity`
- `Item` - Inventory item object (see Items for details) - class name actually registered in the engine: `LLSE_Item`
- `Device` - Player equipment information object (see player for details) - class name actually registered in the engine: `LLSE_Device`
- `Container` - Container object (see container for details) - class name actually registered in the engine: `LLSE_Container`
- `Objective` - Scored item object (see Scoreboard for details) - class name actually registered in the engine: `LLSE_Objective`
- `Packet` - Packet object (see Packet for details) - class name actually registered in the engine: `LLSE_Packet`
- `NBT` - NBT Tag object (see NBT for details)
- `SimpleForm` - Normal form object (see Form Builder for details) - class name actually registered in the engine: `LLSE_SimpleForm`
- `CustomForm` - Custom form object (see Form Builder for details) - class name actually registered in the engine: `LLSE_CustomForm`
- `Conf` - Configuration file object (see configuration file for details)
- `DB` - Database object (see Database for details)
- `File` - File object (see file reading and writing for details)
- `WSClient` - WebSocket client object (see Network for details)
- `Enum` - Enumeration type, usually stored in some type, providing a limited range of options.



## 📌 API Documentation Description Conventions

Good documentation requires a consistent, concise format and a clear layout. To standardize the LSE help documentation, we use the following conventions.

> The API documentation that follows uses these conventions:

1. **function parameter types**:
   Function parameters are written as **Parameter Name : Parameter Type**.  
   For example, cmd : `String` indicates a variable **cmd** of type **String**.  
   The parameter type `Array<...>` represents an array or list of the variables inside <>.
   
2. **optional parameters**:  
   If a parameter description includes `optional parameters`, you can omit that parameter.
   When you omit it, the engine uses the default value specified in the description.
   In API signatures, optional parameters are enclosed in [ ].
   For example, in `pl.tell(msg[,type])`, `type` is an optional parameter.



Once you are familiar with these conventions, you can work through the specific documentation step by step and refer back here whenever needed.



## 📜 Plugin Development Tips

Here are a few suggestions to help you when developing plugins:

- **Don't reinvent** the wheel
  Whenever possible, use existing libraries for specific tasks rather than writing every function yourself. This helps the ecosystem grow and stay integrated.
- Think about the **user**
  Keep the user experience in mind when designing interfaces and configurations. User-facing elements such as UIs and commands should be clear and follow familiar conventions.
- From multiple perspectives, **innovation** occurs  
  We encourage you to learn from the excellent plugins already available in JE and to create your own innovations.

## 📡 Debug Plugins

Enter these commands in the server console to start the corresponding debug mode (the Node.js engine does not have one):

* `jsdebug`: JavaScript debug mode
* `luadebug`: Lua debug mode
* `pydebug`: Python debug mode

In debug mode, everything you type is parsed as a script and executed in real time, just like in a browser's developer tools console. If an error occurs, an error report is displayed.

Enter the same command (`jsdebug` / `luadebug` / `pydebug`) and press Enter to exit debug mode.
