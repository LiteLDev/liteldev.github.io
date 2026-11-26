# LeviLamina 模组 API：命令

## 开发 LeviLamina 客户端 mod 时，按文档写法在 `onEnable` 中注册命令不生效，客户端/服务端命令该怎么注册？

命令分为客户端命令和服务端命令：服务端命令通过 `ll::command::CommandRegistrar::getInstance(false)`（或 `getServerInstance()`）注册，客户端命令通过 `getInstance(true)`（或仅存在于客户端构建中的 `getClientInstance()`）注册。

客户端在游戏启动完成（出现主界面）时就会启用所有 mod，此时命令注册表尚未创建，因此在 `enable()` 中注册任何命令都会失败。正确做法是：

1. 监听 `ll::event::ServerCommandRegisterEvent`，在回调中注册服务端命令。
2. 监听 `ll::event::ClientCommandRegisterEvent`，在回调中注册客户端命令。

服务端（BDS）在世界加载完成后才启用 mod，因此可以直接在 `enable()` 中注册命令。此外，BDS 上只能注册服务端命令；本地世界中两类命令均可注册；多人游戏中只能注册客户端命令。

*适用版本：LeviLamina 客户端版 26.60.x*

## LeviLamina 注册命令时 `command.overload().execute([](CommandOrigin const& origin, CommandOutput& output){...})` 中的 `origin` 和 `output` 分别是什么？logger 必须从入口类获取吗？

`origin`（`CommandOrigin`）代表命令的执行来源，可通过 `getEntity()`、`getName()`、`getOriginType()` 等方法得知是谁执行的命令；`output`（`CommandOutput`）用于返回命令执行结果，如 `output.success("...")` / `output.error("...")`（支持 fmt 格式化）。

logger 不必从入口 mod 获取：`ll::io::Logger` 不能直接构造，但可以通过 `ll::io::LoggerRegistry::getInstance().getOrCreate("名字")` 获取一个 `std::shared_ptr<Logger>` 供全局使用；仅在开发阶段需要的日志可使用 `debug` 级别。

*适用版本：LeviLamina 1.x 及以上*

## 在 LeviLamina 原生 mod 中注册命令时，物品、方块、效果等类型的参数（对应旧 LLSE 的 `ParamType.Item/Block/Effect`）该用什么类型？

不要参考 LL2 的实现，请查阅 LeviLamina 源码 `src/ll/api/command/runtime/ParamKind.h`。其中 `ParamKind::Kind` 枚举列出了运行时命令支持的所有参数类型，包括 `Item`、`BlockName`、`BlockState`、`Effect`、`ActorType`、`Actor`、`Player`、`BlockPos`、`Vec3`、`JsonValue`、`FilePath` 等，`ParamKindList` 则给出了对应的 C++ 类型（例如 `Effect` 对应 `MobEffect const*`）。

*适用版本：LeviLamina 0.11 及以上*

## 在 LeviLamina 命令回调 lambda 里使用 mod 的 logger 报错（`this` 未捕获 / 未找到匹配的重载函数），应该怎么在命令回调中输出信息？

命令回调中应使用回调参数的 `CommandOutput`（`output.success(...)` / `output.error(...)`，支持 fmt 格式化）向执行者输出信息，而不是用 logger。如果确实需要使用 logger，不要捕获 `this`，直接在 lambda 内通过 mod 单例获取，例如 `my_mod::MyMod::getInstance().getSelf().getLogger().info(...)`。

*适用版本：LeviLamina 0.11 及以上*

## LeviLamina 命令重载如何设置执行回调？`execute<fn>()` 写法还能用吗？

不能。自 0.12 起，以模板参数传入回调的 `execute<fn>()` 已改为以普通参数传入回调的 `execute(fn)`，其余用法不变。例如：

```cpp
cmd.overload<Params>().required("name").execute([](CommandOrigin const& origin, CommandOutput& output, Params const& params) { ... });
```

*适用版本：LeviLamina 0.12 及以上*
