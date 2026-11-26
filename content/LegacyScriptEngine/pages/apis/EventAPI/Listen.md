# 🔔 Event Listening API

> The event system lets plugins **respond** to certain game events and run code when they occur.

The following APIs let you listen for **game events** and respond to them.

## 🔔 Monitor API

Registers a listener function.  
When a certain event in the game occurs, the engine calls the corresponding listener function you set, allowing you to handle the event.  

### Add a Listener  

`mc.listen(event,callback)`

- Parameters: 
  - event : `String`  
    The name of the event to listen for (see the event list below).
  - callback : `Function`  
    The listener function to register (see below for its parameters).  
    When the specified event occurs, BDS calls this function and passes in the corresponding parameters.
- Return value: Whether the event was successfully monitored.
- Return value type: `Boolean` 



### Intercept Event

In LSE's event monitoring system, you can generally use `return false` to intercept an interceptable event. When a script intercepts an event, BDS stops handling it as if it never happened.
For example, intercepting a chat event prevents everyone from seeing the chat message.  

However, intercepting events only applies to BDS.  
Other LSE scripts with listeners for this event will still process it, even though BDS no longer receives it.



### Avoid Mistakes

Sometimes, calling a specific API inside some event listeners will cause an infinite loop and a crash. Avoid these situations.  
Example: If you call `mc.runcmd(Ex)` inside an `onConsoleCmd` event listener, it will trigger another `onConsoleCmd` event, leading to an infinite loop.

## 📜 Listen Event List

The sidebar lists the various events that LSE supports listening for.

Tip: You can get information from the game objects passed to a listener, such as a block's coordinates, an entity's name, and so on.  
You can also call the member functions of these objects.

> Notice! Some of the callback parameters passed in may sometimes be Null, so be sure to check for Null in your code.
