# 注册命令

插件可以向游戏添加命令。玩家在 `/` 后输入命令时会有正常的补全和提示；控制台、命令方块和 NPC 也可以执行这些命令。
本指南将先注册一个带参数、权限和回调的命令，再介绍 LLSE 的简单命令。

示例使用 JavaScript，但各语言的 API 相同。文中用到的函数均可查阅[命令相关 API](../apis/GameAPI/Command.md)。

## 1. 创建命令

可以在入口脚本顶层创建命令，也可以像参考文档那样放在 `onServerStarted` 监听器中：服务器启动期间，LSE 会将命令推迟到可以注册时再执行，因此两种写法皆可。本指南使用监听器：

```js
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand("hello", "Says hello to players", PermType.Any);
    // 参数、重载和回调：第 2 到 4 步
    cmd.setup();
});
```

`mc.newCommand(name, description, permission)` 会创建命令并返回一个命令对象，供后续配置。命令名只能使用英文小写字母。权限决定了谁可以执行该命令：

| 权限 | 谁可以执行命令 |
|---|---|
| `PermType.Any` | 任何人。 |
| `PermType.GameMasters` | OP。 |
| `PermType.Admin` | 管理员权限等级（默认值）。 |
| `PermType.Console` | 仅控制台。 |

`cmd.setAlias("hi")` 会为同一个命令添加一个别名。

## 2. 添加参数

每个参数都有名称和类型。`mandatory` 用于添加必填参数，`optional` 用于添加可选参数：

```js
cmd.mandatory("target", ParamType.Player);
cmd.optional("message", ParamType.RawText);
```

`ParamType.Player` 接受玩家名或目标选择器（如 `@a`）。`ParamType.RawText` 接受该行剩余的全部内容（包括空格），且只能作为最后一个参数。各参数类型及其传给回调的值详见[参数类型列表](../apis/GameAPI/Command.md)。

## 3. 声明命令的形式

重载用于定义命令的一种形式，即按顺序排列的参数列表：

```js
cmd.overload(["target", "message"]);
```

设置该重载后，`/hello Steve`、`/hello Steve Nice to see you!` 和 `/hello @a Welcome!` 均为有效命令。如果命令有多种形式（例如 `/hello <target> [message]` 和 `/hello all`），请为每种形式声明一个重载。

## 4. 处理命令

每次执行命令时都会触发回调。回调会接收命令本身、来源（执行者）、输出（结果写入处）以及按名称索引的参数值：

```js
cmd.setCallback((_cmd, origin, output, results) => {
    const from = origin.player ? origin.player.name : "The server";
    for (const player of results.target) {
        player.tell(`${from} says: ${results.message ?? "Hello!"}`);
    }
    output.success(`Said hello to ${results.target.length} player(s).`);
});
```

- `origin.player` 是执行命令的玩家；由控制台或命令方块执行时为 `Null`。
- `results.target` 是玩家数组，因为一个选择器可能匹配多个玩家。
- 省略可选参数时，`results.message` 没有值。
- `output.success(msg)` 向命令执行者显示成功消息，`output.error(msg)` 则显示错误消息。

最后调用 `cmd.setup()` 将命令注册到游戏中。完整插件代码如下：

```js
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand("hello", "Says hello to players", PermType.Any);
    cmd.mandatory("target", ParamType.Player);
    cmd.optional("message", ParamType.RawText);
    cmd.overload(["target", "message"]);
    cmd.setCallback((_cmd, origin, output, results) => {
        const from = origin.player ? origin.player.name : "The server";
        for (const player of results.target) {
            player.tell(`${from} says: ${results.message ?? "Hello!"}`);
        }
        output.success(`Said hello to ${results.target.length} player(s).`);
    });
    cmd.setup();
});
```

重启服务器后，即可在游戏中输入 `/hello @a`，或在控制台中输入 `hello @a`。

## 用枚举实现子命令

要实现 `/manager add <name>` 和 `/manager list` 这类带子命令的命令，可以使用枚举（即一组固定的词）。先用 `setEnum` 为每组词命名，再为其添加 `ParamType.Enum` 类型的参数，最后在重载中填入枚举名。参考文档中的示例如下：

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

两个枚举参数都叫 `action`，因此回调会从 `res.action` 读取所选的词；而重载中填入的是枚举名，以此区分两者。如果这组词在服务器运行期间会发生变化（如玩家名、家园名称），请使用软枚举：`setSoftEnum`、`addSoftEnumValues` 和 `ParamType.SoftEnum`。

## LLSE 的简单命令

`mc.regPlayerCmd` 和 `mc.regConsoleCmd` 只需一次调用即可注册命令及其处理函数，并将命令后的内容按词拆分为字符串数组传入：

```js
mc.regPlayerCmd("ping", "Answers with pong", (player, args) => {
    player.tell("Pong!");
});

mc.regConsoleCmd("backup", "Starts a backup", (args) => {
    log(`Starting backup ${args[0] ?? "default"}.`);
});
```

保留这两个函数是为了兼容为 LLSE 编写的插件。它们只能由玩家（`regPlayerCmd`）或控制台（`regConsoleCmd`）执行，不支持命令方块和 NPC，且需要自行解析参数。编写新插件请使用 `mc.newCommand`。

## 在插件中运行命令

`mc.runcmd("say Hello!")` 会在后台执行命令，并返回是否成功。`mc.runcmdEx` 还会返回命令的输出内容，且不会将其打印到控制台：

```js
const result = mc.runcmdEx("list");
log(result.output);
```
