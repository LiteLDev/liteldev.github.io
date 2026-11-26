# LegacyScriptEngine API: forms and on-screen text

## What does the callback receive in LSE when a player closes a form (Esc/back)? The docs say Null, but the `data === null` check in JS does not work. What should I do?

When a player cancels a form, the callback result (`id` for a SimpleForm, `data` for a CustomForm, or `result` for a ModalForm) is empty. Because ScriptX does not distinguish between null and undefined at the C++ level, the empty `Local<Value>` returned by LSE becomes `undefined` in JS, causing `data === null` to fail. To check whether the player closed the form, use `data == null` or `!data` (for a SimpleForm, use `id == null` because `!id` is also true when `id` is 0). The third callback parameter, `reason`, gives the cancellation reason (0 = UserClosed, 1 = UserBusy) and may also be empty.

*Applies to: all current LSE versions*

## In an LSE/LLSE script plugin, how do I send the player back to the previous form after they click a form, and how do I detect that the player closed the form?

Call `pl.sendForm(form, callback)` again with the previous form. Common approaches include:

1. Wrap building and sending the form in a named function (and define the callback as a named function too); to go back, call that function again from the callback.
2. Cache the previous form instance and pass it along with the callback to `player.sendForm` when going back.
3. Use a class that maintains a session stack of the "current form / previous form" to support multi-level back navigation.

If the player closes the form directly, the callback's result argument is empty (`undefined` in JS). Check for this with `data == null`.

*Applies to: all current LSE versions (the LLSE-era approach works too)*

## Passing the online player list to the `fm.addDropdown` of an LSE custom form throws `"can't cast value as string"`. How do I list all online player names in the dropdown?

`mc.getOnlinePlayers()` returns `Array<Player>`, whereas the `items` parameter of `fm.addDropdown(title, items[, default, tooltip])` expects `Array<String>`. Passing Player objects directly throws `can't cast value as string` during string conversion. Convert the list to an array of player names first:

```js
let names = mc.getOnlinePlayers().map(player => player.name);
fm.addDropdown("选择玩家", names);
```

Read each player's name from the Player object's `name` (or `realName`) property.

*Applies to: current version of LegacyScriptEngine*

## When building a form with CustomForm (`mc.newCustomForm`) in LSE, how do I get the value of an input box? How do I tell whether the player submitted the form or closed it?

CustomForm includes a built-in submit button, so you do not need to add one. The callback signature for `pl.sendForm(fm, callback)` is `function(player, data, reason)`:

- `data` is an array of values in the order the controls were added. Use the matching index to get an input box's value; for example, the 3rd control is `data[2]`.
- If `data` is `null`, the player cancelled or closed the form; if it is not `null`, the form was submitted.
- `reason` is the cancellation reason (`0` = UserClosed, `1` = UserBusy) and may be `null`.

If you are unsure, `log` all the callback parameters to inspect them.

*Applies to: LSE 0.23.x*

## Can LSE form callbacks such as `player.sendForm` now tell why the player cancelled the form?

Yes. Starting in LSE 0.9.0, form callbacks pass an extra `reason` parameter (an Integer corresponding to LeviLamina's `FormCancelReason`) for the cancellation reason. For example, a `SimpleForm` callback is `function(player, id, reason)`, and a `CustomForm` callback is `function(player, data, reason)`. On a normal submission, `reason` may be `null`.

*Applies to: LSE 0.9.0 and later*

## In LSE (JS), after sending a modal form (two buttons, confirm and cancel) with `pl.sendModalForm`, what values can the callback's `result` take? Do I need an extra `null` check?

The callback signature is `function(player, result, reason)`. `result` is `true` if the player clicks confirm (the upper button, button 1) and `false` if they click cancel (the lower button, button 2). If the player closes the form with X, `result` has no value (the documentation says Null, but JS actually receives `undefined`). You can usually handle this the same way as cancel—for example, with `if (result) {...} else {...}`—without a separate `else if` check for `null`. To tell why the form was closed, check the third parameter, `reason`, which gives the cancellation reason and is set only on cancellation.

*Applies to: LSE 0.9 and later; still applies to current 0.23.x*
