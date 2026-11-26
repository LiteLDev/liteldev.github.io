# LegacyScriptEngine API：玩家

## LSE 中玩家下线后，之前保存的 Player 对象还能调用吗？插件抛出的异常会让服务器退出吗？

不能继续使用旧对象。LSE 的 Player 对象内部只持有玩家实体的弱引用，玩家下线后实体即被销毁，此时访问旧对象的属性或方法会因找不到玩家而返回 null/undefined（玩家重新进服后会生成新实体，旧对象也不会恢复）。正确做法是保存玩家的 uuid 或 xuid，需要时再用 `mc.getPlayer(...)` 重新获取，并在定时任务等场景中先判空再操作。另外，插件回调中未捕获的异常会被 LSE 捕获并打印错误日志，不会导致服务器退出。

*适用版本：当前 LSE 版本*

## LSE 中传送/构造坐标时的维度参数填什么？文档写的 `[dimid]` 是要传数组吗？

文档中的方括号表示可选参数，而非数组。维度 ID 直接填数字即可：0 = 主世界，1 = 下界，2 = 末地。`IntPos`/`FloatPos` 由 x、y、z、`dimid` 组成，如 `new IntPos(0, 64, 0, 0)` / `new FloatPos(0.5, 64, 0.5, 0)`，构造后即可调用 `pl.teleport(pos)` 或 `pl.teleport(x, y, z, dimid)` 传送。

*适用版本：当前所有 LSE 版本*

## LSE JS 插件里调用 `player.sendToast` 报参数错误或没效果，且字符串里的 `${变量}` 没有被替换，怎么写？

`sendToast` 必须同时传入标题和内容两个字符串参数，即 `player.sendToast(title, message)`，少传会报参数错误。另外 JS 中只有反引号 `` ` `` 包起来的模板字符串才会解析 `${}`，用单/双引号时 `${}` 会被当作普通文本，应写成例如 ``player.sendToast("提示", `欢迎 ${player.realName}`)``。

*适用版本：LegacyScriptEngine 当前所有版本*

## LSE JS 插件中如何给所有在线玩家定时刷新侧边栏？

侧边栏是 Player 对象的方法（`player.setSidebar`），而非全局方法，要为所有玩家设置就必须遍历在线玩家。定时刷新内容不必放在 `onTick` 中，使用 `setInterval` 即可，例如：

```js
setInterval(() => {
  for (const player of mc.getOnlinePlayers()) {
    player.setSidebar(title, data);
  }
}, 毫秒);
```

也可以使用 `mc.getOnlinePlayers().forEach(...)`。另外，建议在玩家进服时先初始化一次侧边栏。

*适用版本：LegacyScriptEngine 当前所有版本（原为 LLSE）*

## LSE 插件中如何获取某玩家周围一定半径内的玩家？用 `execute` 命令 + 正则解析输出的方式经常报错。

尽量不要用命令实现，直接遍历在线玩家并按距离过滤即可：

```js
let plnames = mc.getOnlinePlayers().filter(player => player.distanceTo(pl) < R).map(player => player.realName);
```

其中 `pl` 为中心玩家，`R` 为半径（方块）。`distanceTo` 可接受 Entity/Player/IntPos/FloatPos；若目标不在同一维度，该方法会返回整数最大值，从而将其自然过滤掉。如果不想包含中心玩家本人，可再加 `player.xuid !== pl.xuid` 之类的判断条件。

## LSE JS 插件中如何获取当前所有在线玩家的名字列表（例如存进 json）？

调用 `mc.getOnlinePlayers().map(player => player.realName)` 即可得到在线玩家的真实名字数组，随后可将其写入 json（例如使用 JsonConfigFile 的 `set` 方法）。若需向数组添加元素，请使用 `push`。

*适用版本：当前版本（JS 引擎）*

## LSE JS 插件里想把玩家坐标用 `pl.tell` 发给玩家，直接传 `pl.pos` 报错/获取不到坐标，该怎么写？

`pl.pos` 返回的是坐标对象（FloatPos），而 `pl.tell` 的第一个参数要求为字符串，直接传入对象会因参数类型检查失败而报错。发送前用 `pl.pos.toString()` 转成字符串（或用模板字符串 `` `${pl.pos}` ``），也可以自己拼接 `pl.pos.x` / `pl.pos.y` / `pl.pos.z` / `pl.pos.dimid`。

## LSE 中 `pl.isOp()` 报错不存在，判断玩家是否为 OP 的 API 是什么？

LSE 中的 API 名称为 `pl.isOP()`（OP 全大写）。JS 区分大小写，写成 `isOp` 会报错。

## LSE 中 `setBossBar` 的颜色参数有哪些取值？

`pl.setBossBar(uid, title, percent, colour)` 中的 `colour` 为整数，会直接转换为 BDS 的 BossBarColor 枚举：0 粉色（Pink）、1 蓝色（Blue）、2 红色（Red）、3 绿色（Green）、4 黄色（Yellow）、5 紫色（Purple）、6 深紫色（RebeccaPurple）、7 白色（White）。例如，`pl.setBossBar(1145141919, "Hello", 80, 2)` 会显示红色血条。

## LSE 中如何可靠地获取玩家召唤的假人或指定名字的玩家？`mc.getPlayer(name)` 有什么坑？

`mc.getPlayer(name)` 按名字查找时采用不区分大小写的前缀匹配：优先返回名字完全相等的玩家，若无完全匹配，则返回名字以该字符串开头且最短的玩家，因此可能误拿到其他玩家。获取后应检查返回对象的 `name` 是否与目标名字完全一致。更可靠的做法是保存并使用 UUID 或 XUID 查找（`mc.getPlayer` 同样接受 UUID/XUID/UniqueId/RuntimeId）。此外，给假人名称加上普通玩家无法使用的前缀或标记，也能有效防止冲突。

## LSE 中想让 Boss 血条（bossbar）持续刷新，写成 `setInterval(player.setBossBar(...), 500)` 却只执行一次或提示 player 未定义，正确写法是什么？

`setInterval` 的第一个参数必须是函数。如果写成 `setInterval(player.setBossBar(...))`，JS 只会立即执行一次 `setBossBar` 并把它的返回值当作参数传入。正确做法是传入匿名函数，同时保存 `setInterval` 返回的定时器 id，以便在 Boss 死亡时调用 `clearInterval` 停止刷新。

另外，切勿长期持有 player、entity 等 mc 对象，而应保存 xuid，在定时器回调中通过 `mc.getPlayer(xuid)` 重新获取并判空。示例：

```js
let players = [];
mc.listen("onAttackEntity", (pl, en) => {
  if (!en.hasTag("boss")) return;
  if (!players.includes(pl.xuid)) players.push(pl.xuid);
});
const timer = setInterval(() => {
  for (const xuid of players) {
    const p = mc.getPlayer(xuid);
    if (!p) continue;
    p.setBossBar(bossId, "名称", Math.floor(boss.health / boss.maxHealth * 100), 2);
  }
}, 500);
```

Boss 死亡后，调用 `clearInterval(timer)` 并对玩家调用 `removeBossBar(bossId)`。`setBossBar` 的参数依次为 `(uid, title, percent 0~100, colour)`。若要向附近所有玩家显示血条，可遍历 `mc.getOnlinePlayers()` 并按距离筛选。

*适用版本：LSE 当前所有版本*

## 在 LSE 中用 `pl.rename(newName)` 改了玩家头顶名字后，`pl.name` 拿到的仍然是真名。有没有办法获取玩家头顶显示的名字（nametag）？

`pl.rename` 实际修改的是玩家的 NameTag，而 `pl.name` / `pl.realName` 返回的是玩家原名，不会改变。LSE 0.19.1 起新增了 `en.getCustomName()`，用于返回实体的 NameTag，因此可以用 `pl.toEntity().getCustomName()` 获取头顶显示的名字。

如果还需要维护“真名到假名”的映射或检查重名，仍建议在调用 `rename` 时将 uid、真名和假名的对应关系自行记录到文件或数据库中，需要时再用 `data.getAllPlayerInfo()` 获取所有玩家信息进行比对。

0.19.1 之前的版本只能自行记录。

*适用版本：LSE 0.19.1 及以上*

## LSE 插件中给玩家显示标题、向全服广播消息时，用执行 `title` / `say` 命令的方式合适吗？

不建议用 `mc.runcmd` 执行 `title` / `say` 命令。LSE 提供了现成接口：给玩家显示标题用 `pl.setTitle(content[, type[, fadeInTime, stayTime, fadeOutTime]])`，发送全服消息用 `mc.broadcast(msg[, type])`。有原生接口时应优先使用接口。

*适用版本：LSE 当前所有版本（含 v0.23.1）*

## LSE 有没有判断玩家是否处于爬行 / 游泳状态的 API？

有。LSE 自 0.19.1 起提供了 `player.isSwimming` 和 `player.isCrawling` 属性。

*适用版本：LSE 0.19.1 及以上*

## LSE 的 TypeScript 类型定义里，`mc.getPlayer` 拿到的玩家对象没有模拟玩家（`SimulatedPlayer`）的方法，怎么调用模拟玩家 API？

在类型定义中，`mc.getPlayer` 返回 `Player`，而 `SimulatedPlayer` 继承自 `Player`（`declare class SimulatedPlayer extends Player`）。运行时，模拟玩家的 `simulateXxx` 方法本就挂载在玩家对象上，只是类型不匹配。可以先用 `player.isSimulatedPlayer()` 判断，确认后手动断言为 `(player as SimulatedPlayer)` 再调用；也可以用 `// @ts-ignore` 绕过类型检查。通过 `mc.spawnSimulatedPlayer` 创建时，直接返回的就是 `SimulatedPlayer` 类型。

*适用版本：当前版本（使用 `legacy-script-engine-api` 类型定义的 LSE TS 插件）*

## 卸载了修改最大血量的模组/插件后，玩家最大血量仍不是默认值，怎么在服务器后台直接把某玩家最大血量改回 20？

在服务端控制台用 LSE 的脚本调试命令执行：

```shell
jsdebug mc.getPlayer('玩家名').setMaxHealth(20)
```

即可将该玩家的最大血量恢复为 20。注意，不同后端的调试命令有所不同：QuickJS 后端为 `jsdebug`，Lua 为 `luadebug`，Python 为 `pydebug`；Node.js 后端没有调试命令。

*适用版本：LeviLamina + LSE（对应脚本后端已安装）*

## 如何在服务器控制台快速查看某个在线玩家的 UUID（用于查找该玩家的数据文件）？

在控制台执行 LSE 的调试命令（QuickJS 引擎）：`jsdebug mc.getPlayer('玩家名字').uuid`。注意，玩家必须在线才能通过 `mc.getPlayer` 获取。

*适用版本：当前版本（需 QuickJS 引擎）*

## 能否在 LSE 中给玩家改名（不通过 Xbox 付费改名）？

可以。调用玩家对象的 `rename` 方法即可：JS 中为 `pl.rename("Steve")`，Lua 中为 `pl:rename("Steve")`，返回表示是否成功的 `Boolean` 值。若需临时改名，可在控制台用 QuickJS 引擎的调试命令 `/jsdebug` 执行 `mc.getPlayer("玩家原名").rename("新名字")`（Node.js 引擎没有调试命令）。这仅修改服务器内的显示名，不会修改玩家的 Xbox 账号名。

*适用版本：LSE 当前所有版本*
