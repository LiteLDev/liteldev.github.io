# 🎯 命令相关 API

以下 API 提供了在游戏中注册和监听自定义命令的接口。

### 执行一条后台命令

`mc.runcmd(cmd)`

- 参数：
    - cmd : `String`  
      待执行的命令
- 返回值：是否执行成功
- 返回值类型： `Boolean`

[JavaScript]

```js
mc.runcmd("say Hello!");
```

[Lua]

```lua
mc.runcmd("say Hello!")
```

### 执行一条后台命令（强化版）

`mc.runcmdEx(cmd)`

- 参数：

    - cmd : `String`  
      待执行的命令

- 返回值：命令执行结果`Object`

- 返回值类型： `Object<Boolean,String>`

    - 返回的执行结果对象 res 包含以下成员：

| 成员          | 含义            | 类型        |
|-------------|---------------|-----------|
| res.success | 是否执行成功        | `Boolean` |
| res.output  | BDS执行命令后的输出结果 | `String`  |

!!! note
    runcmdEx 与普通 runcmd 的实现有很大区别：Ex 版本具有**隐藏输出**机制，不会将执行结果输出到控制台。因此如有需要，请使用 log 函数手动输出结果。

[JavaScript]

```js
var result = mc.runcmdEx("say Hello!");
log(result.output);
```

## 命令注册 API

本节介绍注册自定义命令的接口。该接口对接了 BDS 内置的命令系统，因此注册的命令可供玩家、控制台、命令方块、NPC 等游戏内所有可执行命令的对象调用，也可在 addon 中使用。
!!! warning
    除可变参数（String、RawText、Message 等）外，命令中仅限使用英文小写字母！

### 注册一条顶层命令

`mc.newCommand(cmd,description[,permission,flag,alias])`

- 参数：
    - cmd : `String`  
      待注册的命令
    - description : `String`  
      命令描述文本
    - permission : `PermType`
      （可选参数）执行指令所需的权限
    - flag : `Integer`  
      （可选参数）默认值为 `0x80`   
      目前保持默认值即可，后续会作相关调整
    - alias : `String`  
      （可选参数）命令的别名  
      可为命令设置多个别名，执行别名等同于触发原命令

| 执行权限                   | 含义                |
|------------------------|-------------------|
| `PermType.Any`         | 任何人都可以执行这条指令      |
| `PermType.GameMasters` | 只有OP可以执行这条指令      |
| `PermType.Admin`       | 管理员权限等级（默认值）     |
| `PermType.Console`     | 只有控制台可以执行这条指令     |

- 返回值：指令对象
- 返回值类型：`Command`

!!! tip
    顶层命令即紧跟在 / 后输入的第一部分，例如 `list`、`gamerule`。

    注册顶层命令后，该函数会返回一个指令对象。后续对该命令的功能扩展均需在该指令对象上进行。

### 指令对象 - 函数

通过指令对象，你可以为命令配置各种形式与功能。假设有一个名为 `Command` 的指令对象，它包含以下成员函数：

#### 设置指令别名

`Command.setAlias(alias)`

- 参数：
    - alias : `String`  
      指令别名
- 返回值：是否设置成功
- 返回值类型：`Boolean`

#### 新增一个指令枚举选项

`Command.setEnum(name,values)`

- 参数：
    - name : `String`  
      枚举名，用于在设置参数时区分不同枚举
    - values : `Array<String>`  
      枚举的有效值
- 返回值：新增枚举选项的标识名称
- 返回值类型：`String`

#### 设置一个可变枚举

`Command.setSoftEnum(name,values)`

- 参数：
    - name : `String`  
      可变枚举名，配合 `ParamType.SoftEnum` 参数使用
    - values : `Array<String>`  
      可变枚举的初始值
- 返回值：是否设置成功
- 返回值类型：`Boolean`

与普通枚举不同，可变枚举的值在命令注册后仍可修改。

#### 为可变枚举添加值

`Command.addSoftEnumValues(name,values)`

- 参数：
    - name : `String`  
      可变枚举名
    - values : `Array<String>`  
      要添加的值
- 返回值：是否添加成功
- 返回值类型：`Boolean`

#### 从可变枚举中移除值

`Command.removeSoftEnumValues(name,values)`

- 参数：
    - name : `String`  
      可变枚举名
    - values : `Array<String>`  
      要移除的值
- 返回值：是否移除成功
- 返回值类型：`Boolean`

#### 获取可变枚举的值

`Command.getSoftEnumValues(name)`

- 参数：
    - name : `String`  
      可变枚举名
- 返回值：可变枚举的值，不存在则返回 `Null`
- 返回值类型：`Array<String>`

#### 获取所有可变枚举的名称

`Command.getSoftEnumNames()`

- 返回值：所有已注册的可变枚举名称
- 返回值类型：`Array<String>`

#### 新增一个必选参数

`Command.mandatory(name,type[,enumName,identifier,enumOptions])`

- 参数：
    - name : `String`  
      参数名，用于在执行指令时识别参数
    - type : `ParamType`  
      命令参数类型
    - enumName : `String`  
      枚举名（仅当 `ParamType` 为 `Enum` 时有效，用于区分枚举选项）
    - identifier : `String`  
      参数标识，特殊情况下用于唯一标识参数，一般可直接填入 `enumName` 或 `name`
    - enumOptions : `Integer`  
      参数选项，设为 `1` 可在指令提示中展开枚举选项，  
      例如将 `<action : TagChangeAction>` 展开为 `<add|remove>`
- 返回值：是否设置成功
- 返回值类型：`Boolean`

#### 新增一个可选参数

`Command.optional(name,type[,enumName,identifier,enumOptions])`

- 参数：
    - name : `String`  
      参数名，用于在执行指令时识别参数
    - type : `ParamType`  
      命令参数类型
    - enumName : `String`  
      枚举名（仅当 `ParamType` 为 `Enum` 时有效，用于区分枚举选项）
    - identifier : `String`  
      参数标识，特殊情况下用于唯一标识参数，一般可直接填入 `enumName` 或 `name`
    - enumOptions : `Integer`  
      参数选项，设为 `1` 可在指令提示中展开枚举选项，  
      例如将 `<action : TagChangeAction>` 展开为 `<add|remove>`
- 返回值：是否设置成功
- 返回值类型：`Boolean`

#### 有效的命令参数类型及解释

| 命令参数类型                | 含义                                  |
|-----------------------|-------------------------------------|
| `ParamType.Bool`      | 布尔值参数                               |
| `ParamType.Int`       | 整数参数                                |
| `ParamType.Float`     | 浮点数参数                               |
| `ParamType.Dimension` | 维度参数                                |
| `ParamType.String`    | 字符串参数                               |
| `ParamType.Actor`     | 实体目标选择器参数                           |
| `ParamType.Player`    | 玩家目标选择器参数                           |
| `ParamType.BlockPos`  | 整数坐标参数                              |
| `ParamType.Vec3`      | 浮点数坐标参数                             |
| `ParamType.RawText`   | 原始字符串参数（可包含逗号、空格等特殊字符，只能作为最后一个参数使用） |
| `ParamType.Message`   | 消息类型参数（同 `/say` 指令参数，会自动展开目标选择器等）   |
| `ParamType.JsonValue` | JSON字符串参数                           |
| `ParamType.Item`      | 物品类型参数                              |
| `ParamType.Block`     | 方块类型参数                              |
| `ParamType.Effect`    | 效果类型参数                              |
| `ParamType.Enum`      | 枚举参数                                |
| `ParamType.SoftEnum`  | 可变枚举参数                              |
| `ParamType.ActorType` | 实体类型参数                              |
| `ParamType.Command`   | 指令名称参数（仅供测试）                        |

#### 新增一条指令重载

要让命令正常运行，至少需要添加一条重载。重载本质上是参数的组合：例如，重载 `['a', 'b', 'c']` 表示命令可以按 `/cmd <a> <b> <c>` 的形式执行，而重载 `[]` 表示可以按 `/cmd` 的形式执行。重载中的参数标识符可以是参数名、枚举名或参数标识符，但不能使用无法唯一标识参数的名称。例如，如果两个参数都叫 `action` 但枚举选项不同，就应当使用枚举名而非参数名。

`Command.overload(params)`

- 参数：
    - params : `Array<String>`  
      重载所用到的参数列表，可传入参数标识符、枚举名或参数名。  
      注意：不能使用无法唯一标识参数的名称。例如，两个参数都叫 `action` 但枚举选项不同时，应当使用枚举名而非参数名。
- 返回值：是否成功设置
- 返回值类型：`Boolean`

!!! tip
    BDS 通过指令重载来区分不同的指令形式，每一种指令形式对应一条指令重载。  
    指令重载中列出的各项参数名共同构成了一种新的指令形式。

#### 设置指令回调

`Command.setCallback(callback)`

- 参数：
    - callback : `Function(cmd,origin,output,results)`  
      执行该已注册命令时由接口自动调用的回调函数。
- 返回值：是否成功设置
- 返回值类型：`Boolean`

!!! tip
    指令回调函数的参数较为复杂，下文将详细说明。

#### 安装指令

完成命令的所有配置后，调用此函数将命令注册到 BDS 的命令系统中。

`Command.setup()`

- 返回值：是否成功安装
- 返回值类型：`Boolean`

## 指令回调函数

上文提到的 **指令回调函数** 参数较为复杂，下面逐一说明。  
指令回调函数原型：`Function(cmd,origin,output,results)`

#### 参数 `cmd` ： 自身的指令对象

注册该命令时所使用的指令对象。

#### 参数 `origin` ：命令的执行者

参数 `origin` 是 `CommandOrigin` 对象，代表本次命令的执行者，可通过它对执行者进行操作。  
`CommandOrigin` 对象 `ori` 具有以下属性：

| 属性           | 含义          | 类型           |
|--------------|-------------|--------------|
| ori.type     | 指令执行主体类型    | `OriginType` |
| ori.typeName | 指令执行主体类型名称  | `String`     |
| ori.name     | 指令执行主体的名称   | `String`     |
| ori.pos      | 指令执行主体的坐标   | `FloatPos`   |
| ori.blockPos | 指令执行主体的方块坐标 | `IntPos`     |
| ori.entity   | 执行指令的实体（可空） | `Entity`     |
| ori.player   | 执行指令的玩家（可空） | `Player`     |

`ori.getNbt()` 以 `NbtCompound` 形式返回指令执行主体的序列化数据。

#### 参数 `output` ：向命令执行者输出命令的执行结果

参数 `output` 是 `CommandOutput` 对象，用于向命令执行者输出执行结果。  
`CommandOutput` 对象 `outp` 具有以下属性：

| 属性                | 含义               | 类型        |
|-------------------|------------------|-----------|
| outp.empty        | 是否尚未输出任何消息       | `Boolean` |
| outp.successCount | 输出中记录的成功次数       | `Integer` |

以及以下成员方法：

##### 输出一条成功信息

`outp.success([msg][, parm])`

- 参数：
    - msg : `String`  
      要输出的信息
    - parm : `Array`
      要替换的参数
- 返回值：是否成功输出
- 返回值类型：`Boolean`

##### 输出一条错误信息

`outp.error(msg[, parm])`

- 参数：
    - msg : `String`  
      要输出的信息
    - parm : `Array`
      要替换的参数
- 返回值：是否成功输出
- 返回值类型：`Boolean`

##### 输出一条普通信息

`outp.addMessage(msg[, parm])`

- 参数：
    - msg : `String`  
      要输出的信息
    - parm : `Array`
      要替换的参数
- 返回值：是否成功输出
- 返回值类型：`Boolean`

#### 参数 `result` ：命令各项参数获取的结果

`results` 是一个由 `object<命令参数名-数据值>` 键值对组成的对象。其中，`命令参数名` 是注册命令时为参数设置的 `name` 值，`数据值` 是执行者在该参数位置填入的内容。

命令参数类型与数据值类型的对应关系如下：

| 命令参数类型                | 数据值类型           | 含义                                 |
|-----------------------|-----------------|------------------------------------|
| `ParamType.Bool`      | `Boolean`       | 布尔值                                |
| `ParamType.Int`       | `Integer`       | 整数                                 |
| `ParamType.Float`     | `Float`         | 浮点数                                |
| `ParamType.Dimension` | `Integer`       | 维度 ID                              |
| `ParamType.String`    | `String`        | 字符串                                |
| `ParamType.Actor`     | `Array<Actor>`  | 实体目标选择器选中的实体                       |
| `ParamType.Player`    | `Array<Player>` | 玩家目标选择器选中的实体                       |
| `ParamType.BlockPos`  | `IntPos`        | 整数坐标对象                             |
| `ParamType.Vec3`      | `FloatPos`      | 浮点数坐标对象                            |
| `ParamType.RawText`   | `String`        | 原始字符串（可包含逗号、空格等特殊字符，只能作为最后一个参数使用）  |
| `ParamType.Message`   | `String`        | 消息类型字符串（同 `/say` 指令参数，会自动展开目标选择器等） |
| `ParamType.JsonValue` | `String`        | JSON 字符串                           |
| `ParamType.Item`      | `Item`          | 物品类型                               |
| `ParamType.Block`     | `Block`         | 方块类型                               |
| `ParamType.Effect`    | `String`        | 效果类型字符串                            |
| `ParamType.Enum`      | `String`        | 枚举字符串                              |
| `ParamType.SoftEnum`  | `String`        | 可变枚举字符串                            |
| `ParamType.ActorType` | `String`        | 实体类型字符串                            |
| `ParamType.Command`   | `String`        | 指令名称（仅供测试）                         |

### 命令注册样例

[JavaScript]

```js
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand("manager", "Command Description", PermType.GameMasters);
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

## 假命令 API

此处的假命令 API 仅用于 **向下兼容**，推荐使用上文介绍的 **真命令** API。

!!! warning
    假命令虽然看似简单，但存在明显缺陷：只能由玩家或控制台执行，命令方块、NPC 等其他对象无法执行；所有参数数据都需要自行解析等。

    请尽量使用真命令 API。

### 注册一个新的玩家命令（假命令）

`mc.regPlayerCmd(cmd,description,callback[,level])`

- 参数：
    - cmd : `String`  
      待注册的命令
    - description : `String`  
      命令描述文本
    - callback : `Function(player,args)`  
      执行该已注册命令时由接口自动调用的回调函数。
    - level : `Integer`  
      （可选参数）命令的注册等级，默认为 0，即所有人均可执行。  
      如果设为 1，则只有 OP 可以执行此命令。
- 返回值：是否成功注册
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(player,args)`。

- player : `Player`  
  执行命令的玩家对象
- args : `Array<String,String...>`    
  目标命令后的参数，按空格分割为字符串数组。  
  例如，若注册了自定义命令 `land set`，执行 `/land set abc 2333` 时，args 的值为 `[ "abc","2333" ]`。

[JavaScript]

```js
mc.regPlayerCmd("fly on", "Turn on the fly mode", function (pl, args) {
    pl.tell("Flying enabled.");
    //......
});
```

### 注册一个新的控制台命令（假命令）

`mc.regConsoleCmd(cmd,description,callback)`

- 参数：
    - cmd : `String`  
      待注册的命令

    - description : `String`  
      命令描述文本

    - callback : `Function`  
      执行所注册的命令时，接口自动调用的回调函数。
- 返回值：是否成功注册
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(args)`

- args : `Array<String,String...>`      
  目标命令后面的参数，按空格分割成字符串数组。  
  例如注册了自定义命令 `land set`，执行 `/land set abc 2333` 时，args 的值为 `['abc','2333']`

[JavaScript]

```js
mc.regConsoleCmd("backup", "Start the backup", function (args) {
    log("ID of this backup is:", args[0]);
    //......
});
```

!!! tip "假命令注册相关说明"
    设置回调函数后，执行所注册的假命令时便会调用该函数。  
    调用前，脚本引擎会自动将命令参数分割成数组。  
    以 JavaScript 语言为例：
    执行  
    `mc.regPlayerCmd("land buy", "购买领地", function(pl,args){ .... }, 0 );`   
    之后，  
    当使用命令 `/land buy abcde 12345` 时，就会调用该回调函数。  
    回调函数的参数 args 会收到一个数组：[ "abcde" , "12345" ]  
    可见，`args` 中包含的是 **按顺序分割好的** 命令参数。  
    如果命令中带有引号（例如为了处理包含空格的玩家名），脚本引擎在分割时也会妥善处理。

## 其他与命令系统有关的 API

### 模拟产生一个控制台命令输出

`mc.sendCmdOutput(output)`

- 参数：
    - output : `String`  
      模拟产生的命令输出

- 返回值：是否成功执行
- 返回值类型：`Boolean`
