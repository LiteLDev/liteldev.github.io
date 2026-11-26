# LeviLamina mod API: threads, scheduling and lifecycle

## How do I create a logger in a LeviLamina mod without using `getSelf().getLogger()`?

In the current version, the constructor of `ll::io::Logger` is private (`PrivateTag`), so you can no longer construct one directly with `ll::Logger logger("MyMod");`. Instead, get or create one through the logger registry:

```cpp
auto logger = ll::io::LoggerRegistry::getInstance().getOrCreate("MyMod");
```

This returns a `std::shared_ptr<ll::io::Logger>`, which you can use to log with `logger->info("...")`. You can also continue to use `getSelf().getLogger()`, which returns `ll::io::Logger&`.

*Applies to: LeviLamina 1.x and later*

## In a LeviLamina mod, I have a global object that does file operations and must not be copied. Do I need `std::ref` when using it in the lambdas passed to `cmd.overload().execute(lambda)` and `eventBus.emplaceListener<Event>(lambda)`?

No. A global object (with static storage duration) can be used directly inside a lambda without being captured, and a local object can be captured by reference with `[&obj]`. Neither copies the object, and `std::ref` is not meant for lambda captures. You only need to ensure that the object outlives the callback (that is, for as long as the command or listener exists). You can verify that no copy occurs by marking the copy constructor `delete` or `private`. This is a standard C++ rule and does not depend on the LeviLamina version.

*Applies to: all versions*

## How do I include arguments when logging with a logger in a LeviLamina mod?

The LeviLamina logger (`ll::io::Logger`) supports fmt-style formatting in methods such as `info`, `warn`, `error`, and `debug`. You can write `getSelf().getLogger().info("检查到玩家 {} 加入服务器!", ev.self().getRealName());` (meaning "Detected player {} joining the server!") without concatenating strings manually. You can also let `auto` deduce variable types, for example `auto& player = ev.self();`.

*Applies to: LeviLamina 1.x and later*

## When `logger.info` in LeviLamina prints multi-line text containing newlines, the following lines have no time prefix. How do I handle this?

Each `Logger` call formats a single message and prepends the time, level, and title prefix once to the entire message according to the pattern; newlines inside the string do not receive a prefix. If every line needs a prefix, split the text into lines first (for example, using `std::istringstream` with `std::getline`, or `ll::string_utils::splitByPattern`) and call `logger.info` for each line. This applies to `ll::io::Logger`.

*Applies to: all versions*

## Can LeviLamina coroutines use multiple CPU cores?

Yes. A coroutine does not decide which thread it runs on; the Executor that launches or resumes it does. LeviLamina provides `ll::thread::ThreadPoolExecutor`, which extends `ll::coro::Executor`, lets you set the thread count, and offers `ThreadPoolExecutor::getDefault()`. To use multiple cores, run an `ll::coro::CoroTask` on the thread pool with `task.launch(executor)`. When you need to return to the main thread to access game objects, use `ll::thread::ServerThreadExecutor`. Note that most BDS game APIs are not thread-safe.

*Applies to: LeviLamina 1.x and later*

## When one mod DLL is used on both the client and the server, how do I tell whether it is loaded on the client or the server?

Use `ll::isClient()` from `ll/api/Versions.h` to determine whether the mod is loaded on a client or a server.

On the client, if you also need to distinguish a local world (where you are the host and the built-in server is running) from a normal player joining a remote server, do not rely on `Level::isClientSide`. Instead, call `ll::service::getMinecraft()` (which returns the server instance by default, with `isClientSide=false`) or `ll::service::getServerInstance()`. If it returns an instance, a local server is running; otherwise, the client is connected to a remote server.

*Applies to: LeviLamina 1.9 and later (including versions with client support)*

## When using LeviLamina coroutines (`ll::coro`), `co_await 1s` blocks the main thread for a second. What is going on, and how do I start a coroutine correctly?

This happens when you use `syncLaunch` (often copied from test code). `syncLaunch` blocks the current thread until the coroutine finishes and returns its result.

To start a coroutine asynchronously, use `CoroTask::launch(executor)`. `launch` also has an overload that takes a callback, `launch(executor, callback)`, to receive the return value (the overload without a callback defaults to `[](auto&&){}`). Use `syncLaunch` only when you truly need to wait for the result synchronously.

*Applies to: LeviLamina 1.0 and later*

## When using delayed tasks (timed/delayed execution) in a C++ mod, the callback lambda does not run or behaves strangely. What could be the cause?

Check the lambda's capture list. Because a delayed task runs later, local variables captured by reference with `[&]` are already destroyed by the time the task runs, leaving dangling references and causing undefined behavior. Capture by value instead (`[=]` or explicit by-value captures), and use `shared_ptr` or `weak_ptr` where needed to keep objects alive or check whether they still exist.

Current versions of LeviLamina recommend implementing delayed tasks with coroutines, for example:

```cpp
ll::coro::keepThis([player = ...]() -> ll::coro::CoroTask<> {
    co_await 20_tick; // or co_await 1s;
    // ...
}).launch(ll::thread::ServerThreadExecutor::getDefault());
```

Also verify that any objects captured by the lambda are still valid after `co_await` (for example, a player may have gone offline).

*Applies to: all current LeviLamina versions (the old schedule/DelayTask API has been replaced by `ll::coro`)*

## I copied the example code from the LeviLamina website guide to write a mod, and using `self` gives a compile error. How do I fix it?

The `self` usage in the old guide is outdated. In the current template, the `MyMod` class stores the instance returned by `ll::mod::NativeMod::current()` in its `mSelf` member on construction and exposes it via `getSelf()`—for example, `MyMod::getInstance().getSelf().getLogger().info("...")`. The easiest approach is to create a new project directly from `levilamina-mod-template`.

*Applies to: LeviLamina 1.x and later*

## Mods registered by a third-party mod loader I wrote (such as a .NET loader) cannot be found with LeviLamina's query API. What should I do?

They can be found as long as you register them the standard way. Implement a manager that inherits from `ll::mod::ModManager` and register it with `ModManagerRegistry::addManager`. Call `addMod(name, mod)` on load to add the Mod object to the manager, and call `eraseMod(name)` on unload. The `ModManager` owns the Mod objects; LeviLamina does not manage them for you. You can use LeviLamina's own `NativeModManager` as a reference. Once registered, the mods can be found with `ModManagerRegistry::getManagerForMod`, `ModManager::getMod`, and similar methods.

*Applies to: LeviLamina 1.x and later (Plugin was renamed to Mod)*
