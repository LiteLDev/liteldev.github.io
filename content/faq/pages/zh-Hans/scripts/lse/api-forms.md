# LegacyScriptEngine API：表单与界面显示

## LSE 中玩家关闭表单（按 Esc/返回）时回调收到什么？文档写的是 Null，但 JS 里 `data === null` 判断失效，怎么办？

玩家取消表单时，回调中的结果（SimpleForm 的 `id`、CustomForm 的 `data`、ModalForm 的 `result`）为空值。由于 ScriptX 在 C++ 层不区分 null 和 undefined，LSE 返回的空 `Local<Value>` 在 JS 中实际是 `undefined`，导致 `data === null` 失效。请改用 `data == null` 或 `!data` 判断玩家是否关闭了表单（注意 `id` 为 0 时 `!id` 也为真，因此 SimpleForm 建议用 `id == null`）。回调的第三个参数 `reason` 表示取消原因（0 = UserClosed，1 = UserBusy），也可能为空。

*适用版本：当前所有 LSE 版本*

## LSE/LLSE 脚本插件中，玩家点击表单后如何让玩家返回上一个表单？如何判断玩家关闭了表单？

再次调用 `pl.sendForm(form, callback)` 将上一个表单发给玩家即可。常见写法有：

1. 将表单的构建与发送封装为具名函数（回调也定义为具名函数），需要返回时在回调里再次调用该函数；
2. 缓存上一个表单实例，返回时调用 `player.sendForm` 并传入缓存的实例和回调；
3. 用一个类维护“当前表单/上一个表单”的会话栈，以实现多级返回。

玩家直接关闭表单时，回调的结果参数为空（JS 中为 `undefined`），用 `data == null` 判断即可。

*适用版本：当前所有 LSE 版本（LLSE 时期写法同样适用）*

## LSE 自定义表单 `fm.addDropdown` 传入在线玩家列表时报错 `"can't cast value as string"`，如何在下拉菜单中列出所有在线玩家名字？

`mc.getOnlinePlayers()` 返回的是 `Array<Player>`，而 `fm.addDropdown(title, items[, default, tooltip])` 的 `items` 参数要求 `Array<String>`。直接传入 Player 对象会在转换为字符串时报错 `can't cast value as string`。请先将其转换为名字数组再传入：

```js
let names = mc.getOnlinePlayers().map(player => player.name);
fm.addDropdown("选择玩家", names);
```

玩家名可通过 Player 的 `name`（或 `realName`）属性获取。

*适用版本：LegacyScriptEngine 当前版本*

## 在 LSE 中用 CustomForm（`mc.newCustomForm`）做自定义表单时，怎样取输入框的值？怎样区分玩家点了提交还是关掉了表单？

CustomForm 自带提交按钮，无需手动添加。`pl.sendForm(fm, callback)` 的回调原型为 `function(player, data, reason)`：

- `data` 是按控件添加顺序排列的数组，用对应下标即可获取输入框的值，例如第 3 个控件对应 `data[2]`。
- `data` 为 `null` 表示玩家取消或关闭了表单，不为 `null` 才是提交。
- `reason` 是取消原因（`0` = UserClosed，`1` = UserBusy），可能为 `null`。

不确定时，可以将回调参数全部 `log` 出来查看。

*适用版本：LSE 0.23.x*

## LSE 的 `player.sendForm` 等表单回调现在能拿到玩家取消表单的原因吗？

可以。自 LSE 0.9.0 起，表单回调新增了取消原因参数 `reason`（Integer，对应 LeviLamina 的 `FormCancelReason`）。例如 `SimpleForm` 的回调为 `function(player, id, reason)`，`CustomForm` 的回调为 `function(player, data, reason)`；正常提交时 `reason` 可能为 `null`。

*适用版本：LSE 0.9.0 及以上*

## LSE（JS）中用 `pl.sendModalForm` 发送模式表单（确认/取消两个按钮）后，回调的 `result` 有哪些取值？需要额外判断 `null` 吗？

回调原型为 `function(player, result, reason)`。`result` 为 `true` 表示点击了确认（上方/按钮1），为 `false` 表示点击了取消（下方/按钮2）；玩家直接点 X 关闭表单时 `result` 没有值（文档记作 Null，JS 中实际收到的是 `undefined`）。一般将关闭与取消归为同一分支处理即可，例如直接写 `if (result) {...} else {...}`，无需再单独用 `else if` 判断 `null`。如需区分关闭原因，可查看第三个参数 `reason`（表单取消原因，仅在取消时有值）。

*适用版本：LSE 0.9 及以上；当前 0.23.x*
