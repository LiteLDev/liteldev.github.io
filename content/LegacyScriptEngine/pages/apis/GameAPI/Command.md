# 🎯 Command Related API

The following APIs provide interfaces for registering and listening for custom commands in the game:

### Execute a Background Command

`mc.runcmd(cmd)`

- Parameters:
    - cmd : `String`  
      The command to execute.
- Return value: Whether the execution succeeded.
- Return value type:  `Boolean`

[JavaScript]

```js
mc.runcmd("say Hello!");
```

[Lua]

```lua
mc.runcmd("say Hello!")
```

### Execute a Background Command (Enhanced Version)

`mc.runcmdEx(cmd)`

- Parameters:

    - cmd : `String`  
      The command to execute.
- Return value: Command execution result `Object`
- Return value type:  `Object<Boolean,String>`

    - The returned execution result object res has the following members:

  | Members     | Meaning                                           | Data Type |
  | ----------- | ------------------------------------------------- | --------- |
  | res.success | Whether the execution succeeded.                  | `Boolean` |
  | res.output  | The output from BDS after executing the command.  | `String`  |

!!! note
    runcmdEx is implemented very differently from runcmd. The enhanced version uses a **hidden execution**
    mechanism, so the execution result is not printed to the console. If you need the result in the console, pass it to
    the log function manually.

[JavaScript]

```js
var result = mc.runcmdEx("say Hello!");
log(result.output);
```

## Command Registration API

This API provides an interface for registering custom commands. Because it hooks into the built-in BDS command system,
any command you register can be run by players, the console, command blocks, NPCs, and any other in-game entity that can execute commands.
You can also use these commands in add-ons.
!!! warning
    Except for variable parameters (String, RawText, Message, etc.), commands must consist only of lowercase English
    letters!

### Register a Top-Level Command

`mc.newCommand(cmd,description[,permission,flag,alias])`

- Parameters:

    - cmd : `String`  
      The command to register.
    - description : `String`  
      The description text for the command.
    - permission : `PermType`  
      (Optional parameter)
    - flag : `Integer`  
      (Optional parameter) Defaults to `0x80`.  
      For now, pass the default value directly; this parameter will be updated in the future.
    - alias : `String`  
      (Optional parameter) An alias for the command.
      You can set multiple aliases for a command, and executing any of them triggers the same command.

| Execution Permission   | Meaning                                             |
|------------------------|-----------------------------------------------------|
| `PermType.Any`         | Anyone can execute the command.                     |
| `PermType.GameMasters` | Only OPs can execute the command.                   |
| `PermType.Admin`       | Admin permission level (default).                   |
| `PermType.Console`     | Only the console can execute the command.           |

- Return value: Command object.
- Return value type: `Command`

!!! tip
    A top-level command is the first word after `/`, such as `list` `gamerule`.  
    After registering the top-level command, this function returns a command object, which you use to further configure the command.

### Command Object - Function

Through the command object, you can register various forms and functions for the command. Given a `Command` object, you can call the following member functions:

#### Set Command Alias

`Command.setAlias(alias)`

- Parameters:
    - alias : `String`  
      Command alias.
- Return value: Whether the alias was set successfully.
- Return value type: `Boolean`

#### Add Command Enumerations

`Command.setEnum(name,values)`

- Parameters:
    - name : `String`  
      Enumeration name, used to identify the enumeration when setting parameters.
    - values : `Array<String>`  
      Valid values for the enumeration.
- Return value: Identifier of the new enumeration option.
- Return value type: `String`

#### Set a Soft Enumeration

`Command.setSoftEnum(name,values)`

- Parameters:
    - name : `String`  
      Soft enumeration name, used with `ParamType.SoftEnum` parameters.
    - values : `Array<String>`  
      Initial values of the soft enumeration.
- Return value: Whether the soft enumeration was set successfully.
- Return value type: `Boolean`

Unlike ordinary enumerations, the values of a soft enumeration can still be modified after the command is registered.

#### Add Values to a Soft Enumeration

`Command.addSoftEnumValues(name,values)`

- Parameters:
    - name : `String`  
      Soft enumeration name.
    - values : `Array<String>`  
      Values to add.
- Return value: Whether the values were added successfully.
- Return value type: `Boolean`

#### Remove Values From a Soft Enumeration

`Command.removeSoftEnumValues(name,values)`

- Parameters:
    - name : `String`  
      Soft enumeration name.
    - values : `Array<String>`  
      Values to remove.
- Return value: Whether the values were removed successfully.
- Return value type: `Boolean`

#### Get the Values of a Soft Enumeration

`Command.getSoftEnumValues(name)`

- Parameters:
    - name : `String`  
      Soft enumeration name.
- Return value: Values of the soft enumeration, or `Null` if it does not exist.
- Return value type: `Array<String>`

#### Get the Names of All Soft Enumerations

`Command.getSoftEnumNames()`

- Return value: Names of all registered soft enumerations.
- Return value type: `Array<String>`

#### Add a Required Parameter

`Command.mandatory(name,type[,enumName,identifier,enumOptions])`

- Parameters:
    - name : `String`  
      Parameter name, used to identify the parameter when executing the command.
    - type : `ParamType`  
      Command parameter type.
    - enumName : `String`  
      Enumeration name (valid only when `ParamType` is `Enum`; used to distinguish enumeration options).
    - identifier : `String`  
      Parameter identifier, used to uniquely identify the parameter in special cases. Can generally be replaced by `enumName` or `name`.
    - enumOptions : `Integer`  
      Parameter options. Set to `1` to expand enumeration options in the command prompt.  
      For example, `<action : TagChangeAction>` becomes `<add|remove>`.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

#### Add an Optional Parameter

`Command.optional(name,type[,enumName,identifier,enumOptions])`

- Parameters:
    - name : `String`  
      Parameter name, used to identify the parameter when executing the command.
    - type : `ParamType`  
      Command parameter type.
    - enumName : `String`  
      Enumeration name (valid only when `ParamType` is `Enum`; used to distinguish enumeration options).
    - identifier : `String`  
      Parameter identifier, used to uniquely identify the parameter in special cases. Can generally be replaced by `enumName` or `name`.
    - enumOptions : `Integer`  
      Parameter options. Set to `1` to expand enumeration options in the command prompt.  
      For example, `<action : TagChangeAction>` becomes `<add|remove>`.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

#### Valid Command Parameter Types and Explanations

| Command Parameter Type | Meaning                                                                                                         |
|------------------------|-----------------------------------------------------------------------------------------------------------------|
| `ParamType.Bool`       | Boolean parameter                                                                                               |
| `ParamType.Int`        | Integer parameter                                                                                               |
| `ParamType.Float`      | Floating-point parameter                                                                                        |
| `ParamType.Dimension`  | Dimension parameter                                                                                             |
| `ParamType.String`     | String parameter                                                                                                |
| `ParamType.Actor`      | Entity target selector parameter                                                                                |
| `ParamType.Player`     | Player target selector parameter                                                                                |
| `ParamType.BlockPos`   | Integer coordinate parameter                                                                                    |
| `ParamType.Vec3`       | Floating-point coordinate parameter                                                                             |
| `ParamType.RawText`    | Raw string parameter (may contain special characters such as commas and spaces; can be used only as the last parameter) |
| `ParamType.Message`    | Message parameter (same as the `/Say` command parameter; automatically expands target selectors, etc.)          |
| `ParamType.JsonValue`  | `JSON` string parameter                                                                                         |
| `ParamType.Item`       | Item type parameter                                                                                             |
| `ParamType.Block`      | Block type parameter                                                                                            |
| `ParamType.Effect`     | Effect type parameter                                                                                           |
| `ParamType.Enum`       | Enum parameter                                                                                                  |
| `ParamType.SoftEnum`   | Variable enum parameter                                                                                         |
| `ParamType.ActorType`  | Entity type parameter                                                                                           |
| `ParamType.Command`    | Command name parameter (for testing only)                                                                       |

#### Add a New Command Overload

`Command.overload(params)`

- Parameters:
    - params : `Array<String>`  
      The list of parameter identifiers for the overload. Each identifier can be either an enumeration name or a parameter name.
      Note that you cannot use an identifier that fails to distinguish specific parameters. For example, if two parameters are both named `action` but have different enumeration options, you should use the enumeration name instead of the parameter name.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`

!!! tip
    BDS uses command overloading to distinguish different command forms, with each form corresponding to a separate overload.  
    The parameter names provided in the command overload define a new command form.

#### Set Command Callback

`Command.setCallback(callback)`

- Parameters:
    - callback : `Function(cmd,origin,output,results)`  
      The callback function, called automatically when the registered command is executed.
- Return value: Whether the setting succeeded.
- Return value type: `Boolean`

!!! tip
    The parameters of the command callback function are relatively complex and are explained in detail below.

#### Installation Instructions

After completing all command configuration, use this function to register the command with the BDS command system.

`Command.setup()`

- Return value: Whether the installation succeeded.
- Return value type: `Boolean`

## Command Callback Function

The **command callback function** mentioned above is relatively complex. Its parameters are explained below.
Command callback function prototype: `Function(cmd,origin,output,results)`

#### Parameters `cmd` : Own Command Object

This parameter provides the command object used to register this command.

#### Parameters `origin` : The Executor of the Command

The `origin` parameter is a `CommandOrigin` object representing the executor of the command. You can use this object to perform operations on the executor.
A `CommandOrigin` object `ori` has the following properties:

| Members      | Meaning                                              | Data Types   |
|--------------|------------------------------------------------------|--------------|
| ori.type     | Type of the command executor                         | `OriginType` |
| ori.typeName | Name of the command executor type                    | `String`     |
| ori.name     | Name of the command executor                         | `String`     |
| ori.pos      | Coordinates of the command executor                  | `FloatPos`   |
| ori.blockPos | Block coordinates of the command executor            | `IntPos`     |
| ori.entity   | The entity that executed the command (may be `Null`) | `Entity`     |
| ori.player   | The player who executed the command (may be `Null`)  | `Player`     |

`ori.getNbt()` returns the serialized data of the command origin as an `NbtCompound`.

#### Parameter `output` : Output the Execution Result of the Command to the Command Executor

The `output` parameter is a `CommandOutput` object used to send the execution result of the command to the executor.
A `CommandOutput` object `outp` has the following properties:

| Members           | Meaning                                    | Data Types |
|-------------------|--------------------------------------------|------------|
| outp.empty        | Whether no message has been output yet     | `Boolean`  |
| outp.successCount | Number of successes recorded by the output | `Integer`  |

The following member methods are also available:

##### Output a Success Message

`outp.success([msg][, parm])`

- Parameters:
    - msg : `String`  
      The message to output.
    - parm : `Array`
      Parameters for substitution.
- Return value: Whether the output succeeded.
- Return value type: `Boolean`

##### Output an Error Message

`outp.error(msg[, parm])`

- Parameters:
    - msg : `String`  
      The message to output.
    - parm : `Array`
      Parameters for substitution.
- Return value: Whether the output succeeded.
- Return value type: `Boolean`

##### Output a General Message

`outp.addMessage(msg[, parm])`

- Parameters:
    - msg : `String`  
      The message to output.
    - parm : `Array`
      Parameters for substitution.
- Return value: Whether the output succeeded.
- Return value type: `Boolean`

#### Parameter `result` : The Result Obtained by Each Parameter of the Command

`results` is an `object<command parameter name-data value>` of key-value pairs. The `command parameter name` is the parameter's `name` value set when registering the command, and the `data value` is the argument that the executor entered for that parameter.

The mapping between command parameter types and data value types is as follows:

| Command Parameter Type | Data Value Type | Meaning                                                                                                         |
|------------------------|-----------------|-----------------------------------------------------------------------------------------------------------------|
| `ParamType.Bool`       | `Boolean`       | Boolean value                                                                                                   |
| `ParamType.Int`        | `Integer`       | Integer value                                                                                                   |
| `ParamType.Float`      | `Float`         | Floating-point value                                                                                            |
| `ParamType.Dimension`  | `Integer`       | Dimension ID                                                                                                    |
| `ParamType.String`     | `String`        | String                                                                                                          |
| `ParamType.Actor`      | `Array<Actor>`  | Entities selected by the entity target selector                                                                 |
| `ParamType.Player`     | `Array<Player>` | Entities selected by the player target selector                                                                 |
| `ParamType.BlockPos`   | `IntPos`        | Integer coordinate object                                                                                       |
| `ParamType.Vec3`       | `FloatPos`      | Floating-point coordinate object                                                                                |
| `ParamType.RawText`    | `String`        | Raw string arguments (may contain special characters such as commas and spaces; can only be used as the last parameter) |
| `ParamType.Message`    | `String`        | Message type string (same as `/say` command parameters; automatically expands target selectors, etc.)           |
| `ParamType.JsonValue`  | `String`        | `JSON` string                                                                                                   |
| `ParamType.Item`       | `Item`          | Item type                                                                                                       |
| `ParamType.Block`      | `Block`         | Block type                                                                                                      |
| `ParamType.Effect`     | `String`        | Effect type string                                                                                              |
| `ParamType.Enum`       | `String`        | Enumerated string                                                                                               |
| `ParamType.SoftEnum`   | `String`        | Mutable enumerated string                                                                                       |
| `ParamType.ActorType`  | `String`        | Entity type string                                                                                              |
| `ParamType.Command`    | `String`        | Command name (for testing only)                                                                                 |

### Command Registration Example

[JavaScript]

```js
mc.listen("onServerStarted", () => {
    let cmd = mc.newCommand("manager", "Command Description", PermType.GameMasters);
    cmd.setAlias("mgr");
    cmd.setEnum("ChangeAction", ["add", "remove"]);
    cmd.setEnum("ListAction", ["list"]);
    cmd.mandatory("action", ParamType.Enum, "ChangeAction", 1);
    cmd.mandatory("action", ParamType.Enum, "ListAction", 1);
    cmd.mandatory("name", ParamType.RawText);
    cmd.overload(["ChangeAction", "name"]);
    cmd.overload(["ListAction"]);
    cmd.setCallback((_cmd, _ori, out, res) => {
        switch (res.action) {
            case "add":
                return out.success(`add "${res.name}"`);
            case "remove":
                return out.success(`remove "${res.name}"`);
            case "list":
                return out.success(`Name List:`);
        }
    });
    cmd.setup();
});
```

## Fake Command API

The fake command API is retained for **downward compatibility**. We recommend using the **true command** API described above instead.

!!! warning
    Although fake commands look relatively simple, they have significant drawbacks: only players or the console can execute them (other objects, such as command blocks and NPCs, cannot), you must parse all parameter data yourself, and so on.  
    Please try to use the real command API.

### Register a New Player Command (Fake Command)

`mc.regPlayerCmd(cmd,description,callback[,level])`

- Parameters:
    - cmd : `String`  
      The command to register.
    - description : `String`  
      The command description text.
    - callback : `Function(player,args)`  
      The callback function called automatically when the registered command is executed.
    - level : `Integer`  
      (Optional) The registration level of the command. Defaults to 0, which allows everyone to execute it.
      If the registration level is set to 1, only OPs can execute the command.
- Return value: Whether the registration succeeded.
- Return value type: `Boolean`

Note: The callback function prototype of the callback parameter is `function(player, args)`

- player : `Player`  
  The player executing the command.
- args : `Array<String,String...>`    
  The arguments following the target command, split by spaces into a string array.  
  For example, if you register the custom command `land set`, running `/land set abc 2333` sets args to
  `[ "abc","2333" ]`

[JavaScript]

```js
mc.regPlayerCmd("fly on", "Turn on the fly mode", function (pl, args) {
    pl.tell("Flying enabled.");
    //......
});
```

### Register a New Background Console Command (Fake Command)

`mc.regConsoleCmd(cmd,description,callback)`

- Parameters:
    - cmd : `String`  
      The command to register.

    - description : `String`  
      The command description text.

    - callback : `Function`  
      The callback function called automatically when the registered command is executed.
- Return value: Whether the registration succeeded.
- Return value type: `Boolean`

Note: The callback function prototype of the callback parameter is `function(args)`

- args : `Array<String,String...>`      
  The arguments following the target command, split by spaces into a string array.
  For example, if you register the custom command `land set`, running `/land set abc 2333` sets args to
  `['abc','2333']`

[JavaScript]

```js
mc.regConsoleCmd("backup", "Start the backup", function (args) {
    log("ID of this backup is:", args[0]);
    //......
});
```

!!! tip "Instructions on Fake Order Registration"
    Once you set a callback function, LSE calls it whenever the registered fake command is
    executed.  
    Before calling the callback, LSE automatically splits the command arguments into an array.  
    Take JavaScript as an example:  
    Run  
    `mc.regPlayerCmd("land buy", "land buy", function(pl,args){ .... }, 0 );`  
    After that,  
    running the command `/land buy abcde 12345` calls this callback function.  
    The args parameter of the callback function receives the array: [ "abcde" , "12345" ]  
    As you can see, `args` contains the **sequentially split** command arguments.  
    If the command includes quotes (for example, to handle player names with spaces), LSE accounts for them when splitting the arguments.

## Other APIs Related to the Command System

### The Simulation Produces a Console Command Output

`mc.sendCmdOutput(output)`

- Parameters:
    - output : `String`  
      The simulated command output.

- Return value: Whether the execution succeeded.
- Return value type: `Boolean`
