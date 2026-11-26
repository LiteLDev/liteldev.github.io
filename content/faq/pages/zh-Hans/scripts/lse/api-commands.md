# LegacyScriptEngine API：命令

## LSE 中用 `mc.newCommand` 注册命令后，在 `setCallback` 回调里如何拿到执行命令的玩家对象？直接用 `player.name` 会报错。

命令回调的签名是 `(cmd, origin, output, results)`，参数里没有直接提供 Player，执行者信息存放在 `origin`（CommandOrigin）中。可通过 `origin.player` 获取执行命令的玩家对象，例如 `origin.player.name`。注意 `origin.player` 可能为空（例如由控制台或命令方块执行时），使用前应先判空。

*适用版本：LegacyScriptEngine 当前所有版本*

## LSE 中 `mc.runcmd` 会每个 tick 自动执行一次吗？想每 tick 执行命令该怎么写？

不会，`mc.runcmd` 调用时只会立即执行一次。若要每 tick 执行，可监听 `onTick` 事件：`mc.listen("onTick", () => { mc.runcmd("...") })`；若需要按固定时间间隔执行，可使用 `setInterval(fn, 毫秒)`。

*适用版本：LegacyScriptEngine 当前所有版本（原为 LLSE）*

## LSE 插件中 `mc.runcmdEx` 执行的命令如果语法错误，会影响插件运行吗？

不会导致插件出错或崩溃。命令编译失败时，`runcmdEx` 仍会正常返回结果对象，其中 `success` 为 `false`，`output` 为错误信息，可据此判断：

```js
const res = mc.runcmdEx(cmd);
if (!res.success) logger.warn(res.output);
```

*适用版本：LegacyScriptEngine 当前版本*

## LSE 脚本插件里执行命令时，如何隐藏控制台输出的命令执行反馈？

使用 `mc.runcmdEx` 代替 `mc.runcmd`。`runcmdEx` 带有隐藏输出机制，执行结果不会打印到控制台，而是作为返回值 `{success, output}` 返回；如有需要，可自行使用 `log` 或 `logger` 输出 `res.output`。

*适用版本：LegacyScriptEngine 当前版本*

## LSE 插件执行命令时，怎么用 OP/控制台权限执行？怎么拿到命令输出？

`mc.runcmd(cmd)` 以服务器控制台身份（ServerCommandOrigin，权限等级为 Owner，高于 OP）执行命令，不受玩家权限限制，仅返回是否执行成功（Boolean）。`mc.runcmdEx(cmd)` 同样以控制台身份执行，但会返回 `{success, output}` 对象，既不会把输出打印到控制台，又方便把 `output` 存入变量进行分析。

## LSE 中 `mc.runcmd` 和 `mc.runcmdEx` 有什么区别？

`mc.runcmd(cmd)` 执行一条后台命令，仅返回是否成功（Boolean），命令输出会正常打印到控制台；`mc.runcmdEx(cmd)` 执行命令并返回结果对象 `{ success: Boolean, output: String }`，同时隐藏输出，不显示在控制台上，需要时可自行调用 `log(result.output)`。

注意：不要在 `onConsoleCmd` 监听器中调用 `runcmd` 或 `runcmdEx`，否则可能导致死循环。

## LSE 中 `mc.runcmdEx` 执行命令的权限等级是多少？

与控制台相同。`mc.runcmd` 和 `mc.runcmdEx` 都以名为 `"Server"` 的 ServerCommandOrigin 身份执行，权限等级为 `CommandPermissionLevel::Owner`（最高级），因此可以执行控制台能执行的所有命令。

## LSE 中写跨服传送，用 `mc.listen("onPlayerCmd")` 监听玩家输入（假命令）好，还是注册真命令？怎么注册？

建议注册真命令，这样客户端会有命令提示，在命令方块等处也能使用。示例：

```js
mc.listen('onServerStarted', () => {
  const cmd = mc.newCommand('trans', '跨服命令', PermType.Any);
  cmd.mandatory('ip', ParamType.String);
  cmd.optional('port', ParamType.Int);
  cmd.optional('player', ParamType.Player);
  cmd.overload(['ip', 'port', 'player']);
  cmd.setCallback((_, origin, output, result) => {
    const players = result.player ?? (origin.player ? [origin.player] : []);
    players.forEach(p => p.transServer(result.ip, result.port ?? 19132));
  });
  if (!cmd.setup()) logger.error('命令安装失败！');
});
```

注意：`setup()` 成功时返回 `true`，判断失败需要取反；从控制台执行且未指定 `player` 时，`origin.player` 为空。

## LSE 注册命令时使用玩家选择器参数，回调里直接取 `res.pl.name` 得到 `undefined`，为什么？

`ParamType.Player`（以及 `ParamType.Actor`）参数返回的是对象数组（`Array<Player>` / `Array<Actor>`），而非单个对象。需要按下标取值（如 `res.pl[0].name`）或遍历数组处理（注意先判断数组长度，因为选择器可能未选中任何玩家）。

*适用版本：LSE 当前所有版本*

## LSE 的命令来源类型 `OriginType` 中为什么没有 `Server`，只有 `DedicatedServer` 等？

LSE 运行时的 `OriginType` 枚举直接由 BDS 原版的 `CommandOriginType` 生成，成员名与原版一致：`Player`、`CommandBlock`、`MinecartCommandBlock`、`DevConsole`、`Test`、`AutomationPlayer`、`ClientAutomation`、`DedicatedServer`(7)、`Entity`、`Virtual`、`GameArgument`、`EntityServer`、`Precompiled`、`GameDirectorEntityServer`、`Scripting`、`ExecuteContext`。控制台/服务端来源应使用 `OriginType.DedicatedServer`。`legacy-script-engine-api` 的 TS 声明沿用了 LL2 时代的命名（`Server`、`Block`、`Actor` 等，并将 `DedicatedServer` 作为 `Server` 的别名），因此编辑器补全会出现 `Server`，但运行时并不存在该成员。此外，也可以用 `ori.typeName` 获取类型名字符串。

## LSE 的命令注册 API 里有方块状态（block states）类型的命令参数吗？能取到值吗？

`ParamType` 枚举里保留了 `BlockState`（数值为 16），可用于 `mandatory` / `optional` 注册参数。但 LSE 在将命令解析结果转换成脚本值时未处理该类型，回调中拿到的参数值为空（`undefined`），因此实际上无法使用。需要方块状态时，可改用字符串或 JSON 等参数自行解析。

*适用版本：LSE v0.23.1*

## LSE/LLSE 中 `Command` 对象的 `setSoftEnum()` 和 `setEnum()` 有什么区别？

`setSoftEnum(name, values)` 注册的是可变枚举（soft enum），配合 `ParamType.SoftEnum` 参数使用，命令注册后仍可用 `addSoftEnumValues` / `removeSoftEnumValues` 等方法动态修改候选值。`setEnum(name, values)` 注册的是普通枚举，注册后无法修改。需要在运行时变动候选项（如玩家名、动态列表）时应使用软枚举。

## 修改了 LSE 插件中命令的权限等级后重载插件仍不生效，为什么？

LSE 的命令在首次调用 `mc.newCommand` 注册时就确定了名称、描述、权限等信息。重载插件时命令已存在，LSE 会输出警告 `Runtime command xxx already exists, changes will not beapplied except for setOverload!`（源码原文如此），此时只有重载和回调会更新，权限等改动需要重启服务器才能生效。另外注意权限枚举的大小关系：`PermType.Any`(0) \< `PermType.GameMasters`(1，OP) \< `PermType.Admin`(2，`mc.newCommand` 默认值) \< `PermType.HostPlayer`(3) \< `PermType.Console`(4)，其中 `Admin` 比 `GameMasters` 高一级。如果不想限制权限，可使用 `PermType.Any` 并在回调中自行判断（如 `origin.player?.isOP()`）。LSE 本身未提供注册后修改命令权限的接口。

*适用版本：LSE 0.9 及以上；当前 0.23.x*

## 在 LSE 脚本插件中用 `mc.runcmdEx("list")` 获取在线玩家列表时，返回结果里带有 `§` 颜色代码，导致解析/显示异常，怎么处理？

`mc.runcmdEx` 返回 `{success, output}` 对象，命令输出位于 `.output` 字段中，需要自行去除颜色代码，例如：

```js
mc.runcmdEx("list").output.replace(/§./g, "")
```

如果只是想获取在线玩家，更推荐直接用 `mc.getOnlinePlayers()` 获取玩家对象数组再自行统计，以免解析本地化的命令输出文本。

## 用 LSE 注册自定义命令（`mc.newCommand`）需要注意什么？

1. 命令名（以及除 `String`/`RawText`/`Message` 等可变参数外的内容）只能使用英文小写字母。
2. `RawText` 类型的参数只能放在最后一个参数位置。
3. 推荐在 `onServerStarted` 事件中注册命令（官方示例即如此）。
4. `overload` 的参数是数组，无参数时写 `cmd.overload([])`；最后必须调用 `cmd.setup()`。

示例（Python）：

```python
cmd = mc.newCommand(name, description, permission)
cmd.overload([])
def callback(cmd_, origin_, output_, results_): pass
cmd.setCallback(callback)
cmd.setup()
```

详见 LSE 文档 `GameAPI/Command`。

*适用版本：LSE 当前所有版本*
