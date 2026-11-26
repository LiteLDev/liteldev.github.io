# 配置 LeviLamina

## LeviLamina 下如何让某个 mod 开服时不加载但不删除它的文件？（例如某个 mod 与当前版本不匹配导致每次启动都崩溃）

在该 mod 目录（`mods/<模组名>/`）的 `manifest.json` 中添加 `"passive": true`，它就不会主动加载，仅在被其他 mod 依赖时才加载。也可以重命名该 mod 的 `manifest.json` 或整个 mod 文件夹，使 LeviLamina 无法识别它（启动时可能会有提示）。如果崩溃是由某个 mod（如 trace 日志中出现的某个 dll）与当前 LeviLamina 版本不匹配引起的，直接删除或替换为匹配版本即可。

## LeviLamina 在不支持颜色输出的控制台环境下会输出乱码颜色符号吗？

不会。LL 的日志格式化器会根据彩色日志开关（`ColorLog`，由 PreLoader 提供）决定输出方式：关闭彩色日志后，LL 会在输出前自动剥离消息和标题中的所有颜色及转义符号。

## LeviLamina 的控制台日志时间戳精确到毫秒，能否通过配置改成只显示到秒？

没有现成的配置项。LeviLamina 将控制台时间格式硬编码为 `"{3:.3%T.} {2} {1} {0}"`（保留 3 位毫秒）。只能自行编写 mod，调用日志 API（`Logger`/`Sink` 的 `setFormatter` 配合 `PatternFormatter`）替换格式，或者修改 LeviLamina 源码重新编译。

## `ll show` 展示的插件信息（作者、版本）在哪里设置？在 manifest json 里写 `Author` 和 `Version` 没生效。

在 mod 的 `manifest.json` 中设置。键名必须全部小写，例如 `"author"`、`"version"`（以及 `"description"` 等），首字母大写无法识别。设置后执行 `ll show <mod名>` 即可查看。

*适用版本：LeviLamina 0.9 至 26.60.x*

## 非 LeviLamina 插件（例如要在 PreLoader 阶段加载的 DLL）应该怎么写 manifest？可以直接用 LL 插件的 manifest 吗？

不能直接使用。不要将类型设为 `"type": "native"`，因为那代表由 LeviLamina 原生模组管理器加载的普通 C++ 模组。对于需要由 PreLoader 在游戏启动前加载的 DLL，应在 manifest 中填写 `"type": "preload-native"`。这类 DLL 会在游戏启动前、加载 LeviLamina 模组之前由 PreLoader 加载（LeviLamina 本身也属于这种类型）。它们不属于 LeviLamina 模组，LeviLamina 的模组注册表会跳过这类清单。

*适用版本：LeviLamina 1.x 及以上（当前 26.60.x）*
