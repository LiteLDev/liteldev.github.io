# Listening to events

A plugin reacts to the game through events: a player joins, sends a chat message, or breaks a block. This guide shows how to listen to an event, how to stop the game from processing it, and how to find the event you need.

You need a plugin that loads: see [Your first script plugin](https://levimc.org/tutorials/develop/first-script-plugin/). The examples are in JavaScript; the API is the same in every language.

## 1. Listen to an event

Call `mc.listen` with the event name and the function to call each time it happens. Do this at the top level of your entry script so the listener is registered when the plugin loads:

```js
mc.listen("onJoin", (player) => {
    player.tell(`Welcome, ${player.name}!`);
    log(`${player.name} has joined the server.`);
});
```

The function receives the event's parameters: `onJoin` passes the player who entered the game. Each event's page lists its parameters, such as [Player events](../apis/EventAPI/PlayerEvents.md) for `onJoin`.

The same in Lua:

```lua
mc.listen("onJoin", function(player)
    mc.broadcast(player.name .. " has joined the server.")
end)
```

`mc.listen` returns `false` if it could not register the listener, for example if the event name does not exist.

## 2. Intercept an event

Many events can be intercepted: their documentation says "Intercept events: function returns `false`". If you return `false` from the listener, the game does not process the event, as if it had never happened. This listener drops chat messages that contain a specific word:

```js
mc.listen("onChat", (player, msg) => {
    if (msg.includes("badword")) {
        player.tell("Please keep the chat friendly.");
        return false;
    }
});
```

The message is not shown to anyone. Return nothing (or anything other than `false`) to let the event through.

Intercepting an event only stops the game from processing it. Other plugins' listeners for the same event are still called: LSE calls every listener for an event in the order they were registered, which is generally the order the plugins were loaded. To make your listener run before another plugin's, have that plugin depend on yours in its `manifest.json` (see [Plugins and engines](../concepts/plugins.md)).

## 3. Check what you get

Some parameters can be `Null`: the [Player death event](../apis/EventAPI/PlayerEvents.md) passes the entity that killed the player, which is `Null` if no entity did. Check such values before using them:

```js
mc.listen("onPlayerDie", (player, source) => {
    if (source) {
        log(`${player.name} was killed by ${source.name}.`);
    } else {
        log(`${player.name} died.`);
    }
});
```

Keep listeners short. Because they run on the server thread, a slow listener holds up the server—especially for frequent events like `onTick`.

## 4. Avoid loops

A listener that triggers its own event again creates an infinite loop. For example, an `onConsoleCmd` listener that calls `mc.runcmd` triggers `onConsoleCmd` again. Check the input before acting, or use a different event.

## Find the event you need

Events are listed by subject:

- [Player events](../apis/EventAPI/PlayerEvents.md): joining, leaving, chat, commands, dying, using items, etc.
- [Entity events](../apis/EventAPI/EntityEvents.md) and [Block events](../apis/EventAPI/BlockEvents.md).
- [Economic events](../apis/EventAPI/EconomicEvents.md): money changes.
- [Other events](../apis/EventAPI/OtherEvents.md): server start (`onServerStarted`), every tick (`onTick`), console commands, scores.

[Event listening](../apis/EventAPI/Listen.md) describes `mc.listen` itself.
