# LeviLamina 模组 API：线程、调度与生命周期

## LeviLamina mod 中不用 `getSelf().getLogger()` 的话，怎么创建一个 logger？

当前版本中，`ll::io::Logger` 的构造函数是私有的（`PrivateTag`），不能再直接通过 `ll::Logger logger("MyMod");` 构造，而应通过日志注册表获取或创建：

```cpp
auto logger = ll::io::LoggerRegistry::getInstance().getOrCreate("MyMod");
```

该函数返回 `std::shared_ptr<ll::io::Logger>`，之后即可调用 `logger->info("...")` 输出日志。当然，也可以继续使用 `getSelf().getLogger()`（返回 `ll::io::Logger&`）。

*适用版本：LeviLamina 1.x 及以上*

## LeviLamina mod 中有一个涉及文件操作、不希望被拷贝的全局对象，把它传给 `cmd.overload().execute(lambda)` 和 `eventBus.emplaceListener<Event>(lambda)` 的 lambda 使用时，需要用 `std::ref` 吗？

不需要。全局（静态存储期）对象可在 lambda 中直接使用，无需捕获；局部对象则可使用引用捕获 `[&obj]`，两者都不会产生拷贝。`std::ref` 并非用于 lambda 捕获的工具。只需保证对象的生命周期长于回调（即命令或监听器存在期间）即可。可以将拷贝构造函数设为 `delete` 或 `private`，以验证确实没有发生拷贝。这是 C++ 语言规则，与 LeviLamina 版本无关。

*适用版本：所有版本*

## LeviLamina 模组中用 logger 输出时如何拼接参数？

LeviLamina 的 logger（`ll::io::Logger`）中的 `info`/`warn`/`error`/`debug` 等方法均支持 fmt 风格格式化，可直接写作 `getSelf().getLogger().info("检查到玩家 {} 加入服务器!", ev.self().getRealName());`，无需手动拼接字符串。变量类型可以用 `auto` 推导，例如 `auto& player = ev.self();`。

*适用版本：LeviLamina 1.x 及以上*

## LeviLamina 的 `logger.info` 输出包含换行符的多行文本时，后续行没有时间前缀，该怎么处理？

`Logger` 每次调用只格式化一条消息，并按格式在整条消息前添加一次时间、级别和标题前缀，不会在字符串内部的换行处补加前缀。如果需要每行都带前缀，请先按行拆分字符串（例如使用 `std::istringstream` + `std::getline`，或 `ll::string_utils::splitByPattern`），再逐行调用 `logger.info`。此方法适用于 `ll::io::Logger`。

*适用版本：所有版本*

## LeviLamina 的协程能利用多核 CPU 吗？

可以。协程本身不决定在哪个线程上执行，而是由启动或恢复它的 Executor 决定。LeviLamina 提供了 `ll::thread::ThreadPoolExecutor`（继承自 `ll::coro::Executor`，可指定线程数，也可直接使用 `ThreadPoolExecutor::getDefault()`），通过 `task.launch(executor)` 将 `ll::coro::CoroTask` 提交到线程池执行，即可利用多核 CPU。需要回到主线程操作游戏对象时，请使用 `ll::thread::ServerThreadExecutor`。注意，BDS 的游戏 API 大多不是线程安全的。

*适用版本：LeviLamina 1.x 及以上*

## 一个 mod DLL 同时用于客户端和服务端时，如何判断当前是在客户端还是服务端加载？

使用 `ll/api/Versions.h` 中的 `ll::isClient()`，即可判断 mod 当前是由客户端还是服务端加载。

如果在客户端中还需要区分是本地世界（作为房主，内置服务端正在运行）还是作为普通玩家连接远程服务器：由于 `Level::isClientSide` 不可靠，可以使用 `ll::service::getMinecraft()`（默认获取服务端实例，`isClientSide=false`）或 `ll::service::getServerInstance()`。能获取到实例，说明存在本地服务端逻辑；获取不到，则说明只是客户端在连接远程服务器。

*适用版本：LeviLamina 1.9 及以上（含客户端支持的版本）*

## 使用 LeviLamina 的协程（`ll::coro`）时，`co_await 1s` 竟然让主线程阻塞了一秒，是怎么回事？应该如何正确启动协程？

这是因为照抄测试代码，误用了 `syncLaunch`。`syncLaunch` 会在当前线程上阻塞等待协程执行完毕并返回结果。

正常启动协程使用 `CoroTask::launch(executor)` 即可，它是异步的；`launch` 还提供了带回调的重载 `launch(executor, callback)` 用于获取返回值（无回调版本默认传入 `[](auto&&){}`）。只有确实需要同步等待结果时才应使用 `syncLaunch`。

*适用版本：LeviLamina 1.0 及以上*

## 在 C++ mod 中使用延迟任务（定时/延迟执行）时，回调 lambda 不执行或行为异常，可能是什么原因？

请检查 lambda 的捕获方式：延迟任务会在稍后执行，如果使用引用捕获 `[&]` 捕获了局部变量，实际执行时这些变量早已销毁，从而产生悬垂引用，导致行为异常。将其改为值捕获（`[=]` 或显式按值捕获，必要时使用 `shared_ptr` / `weak_ptr` 延长生命周期或判断对象是否仍然存在）即可解决。

当前版本的 LeviLamina 推荐使用协程实现延迟任务，例如：

```cpp
ll::coro::keepThis([player = ...]() -> ll::coro::CoroTask<> {
    co_await 20_tick; // 或 co_await 1s;
    // ...
}).launch(ll::thread::ServerThreadExecutor::getDefault());
```

同样需要注意，lambda 捕获的对象在 `co_await` 之后是否仍然有效（例如玩家可能已经下线）。

*适用版本：当前所有 LeviLamina 版本（旧的 schedule/DelayTask API 已被 `ll::coro` 取代）*

## 照着 LeviLamina 官网指南复制示例代码写 mod，用 `self` 时编译报错，怎么改？

旧版指南中的 `self` 写法已经过时。请改用当前模板的写法：在构造 `MyMod` 类时，将 `ll::mod::NativeMod::current()` 返回的实例保存到成员变量 `mSelf`，再通过 `getSelf()` 获取，例如 `MyMod::getInstance().getSelf().getLogger().info("...")`。最省事的做法是直接使用 `levilamina-mod-template` 新建项目。

*适用版本：LeviLamina 1.x 及以上*

## 自己写的第三方 mod 加载器（如 .NET loader）注册的 mod，用 LeviLamina 的查询 API 获取不到，怎么办？

只要按标准方式注册就都能获取到。实现一个继承自 `ll::mod::ModManager` 的管理器，并通过 `ModManagerRegistry::addManager` 注册；加载时调用 `addMod(name, mod)` 将 Mod 对象加入管理器，卸载时调用 `eraseMod(name)`。Mod 对象归 `ModManager` 所有，LeviLamina 不会自动代管。具体实现可参照 LeviLamina 自带的 `NativeModManager`。注册完成后，即可通过 `ModManagerRegistry::getManagerForMod`、`ModManager::getMod` 等接口查询。

*适用版本：LeviLamina 1.x 及以上（Plugin 已更名为 Mod）*
