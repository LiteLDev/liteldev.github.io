# IO & Logger

`ll/api/io/` · **Common**

## Overview

The IO module provides a thread-safe, formatted logging system with multiple sinks, log levels, and customizable formatters. It also includes file I/O utilities and stream redirection.

## Headers

| Header | Description |
|--------|-------------|
| `ll/api/io/Logger.h` | Main logger class with fmt formatting |
| `ll/api/io/LogLevel.h` | Log severity levels |
| `ll/api/io/LoggerRegistry.h` | Logger instance management |
| `ll/api/io/Sink.h` | Log output sink interface |
| `ll/api/io/FileSink.h` | File-based log sink, with optional rotation |
| `ll/api/io/ConsoleSink.h` | Console log sink |
| `ll/api/io/RotatePolicy.h` | When a log file rotates and how long archives are kept |
| `ll/api/io/FileUtils.h` | File I/O utilities |
| `ll/api/io/StdoutRedirector.h` | Redirect stdout to logger |

## Key Classes

### Logger

Thread-safe logger with fmt-style formatting.

```cpp
namespace ll::io {
class Logger {
public:
    template <typename... Args>
    void log(LogLevel level, fmt::format_string<Args...> fmt, Args&&... args) const;

    template <typename... Args>
    void fatal(fmt::format_string<Args...> fmt, Args&&... args) const;
    template <typename... Args>
    void error(fmt::format_string<Args...> fmt, Args&&... args) const;
    template <typename... Args>
    void warn(fmt::format_string<Args...> fmt, Args&&... args) const;
    template <typename... Args>
    void info(fmt::format_string<Args...> fmt, Args&&... args) const;
    template <typename... Args>
    void debug(fmt::format_string<Args...> fmt, Args&&... args) const;
    template <typename... Args>
    void trace(fmt::format_string<Args...> fmt, Args&&... args) const;

    std::string const& getTitle() const noexcept;
    LogLevel getLevel() const noexcept;
    bool shouldLog(LogLevel level) const noexcept;

    void setLevel(LogLevel level);
    void setFlushLevel(LogLevel level);
    void setFormatter(Polymorphic<Formatter> formatter);
    void flush() const;

    std::shared_ptr<SinkBase> setSink(std::string_view name, std::shared_ptr<SinkBase> sink) const;
    std::shared_ptr<SinkBase> removeSink(std::string_view name) const;
    std::shared_ptr<SinkBase> getSink(std::string_view name) const;
    void clearSinks() const;
    coro::Generator<std::pair<std::string_view, SinkBase&>> sinks() const;
};
}
```

A logger stores its sinks by name. Every logger starts with a console sink named `"ll_default_console"` and a `logs/latest.log` sink named `"ll_default_file"`.

### LogLevel

```cpp
enum class LogLevel : int {
    Off = -1,
    Fatal,
    Error,
    Warn,
    Info,
    Debug,
    Trace,
};
```

### LoggerRegistry

```cpp
namespace ll::io {
class LoggerRegistry {
public:
    static LoggerRegistry& getInstance();
    std::shared_ptr<Logger> getOrCreate(std::string_view title);
    std::shared_ptr<Logger> tryGet(std::string_view title);
    bool erase(std::string_view title);
    coro::Generator<Logger&> loggers();
};
}
```

## Usage

### Basic Logging

```cpp
#include "ll/api/io/Logger.h"
#include "ll/api/mod/Mod.h"

void example(ll::mod::Mod& mod) {
    auto& logger = mod.getLogger();

    logger.info("Server started");
    logger.warn("Low memory: {} MB", 128);
    logger.error("Failed to load config");
    logger.debug("Player count: {}", 5);
}
```

### Setting Log Level

```cpp
#include "ll/api/io/Logger.h"

void configureLogger(ll::io::Logger& logger) {
    // Only log warnings and above
    logger.setLevel(ll::io::LogLevel::Warn);

    // Auto-flush on errors
    logger.setFlushLevel(ll::io::LogLevel::Error);
}
```

### Adding Custom Sinks

```cpp
#include "ll/api/io/Logger.h"
#include "ll/api/io/FileSink.h"
#include "ll/api/io/PatternFormatter.h"

void addFileSink(ll::io::Logger& logger) {
    auto fileSink = std::make_shared<ll::io::FileSink>(
        "logs/mymod.log",
        makePolymorphic<ll::io::PatternFormatter>("[{3:.3%F %T.} {2}][{1}] {0}", false)
    );
    logger.setSink("mymod", fileSink);
}
```

`setSink` replaces an existing sink with the same name and returns it; `removeSink` removes a sink and returns it.

```cpp
#include "ll/api/io/ConsoleSink.h"
#include "ll/api/io/FileSink.h"
#include "ll/api/io/Logger.h"
#include "ll/api/io/PatternFormatter.h"

void customizeSinks(ll::io::Logger& logger) {
    // Restyle the console output only
    logger.setSink(
        "ll_default_console",
        std::make_shared<ll::io::ConsoleSink>(makePolymorphic<ll::io::PatternFormatter>("[{2}] {0}"))
    );

    // Write to a file of the mod's own instead of logs/latest.log
    logger.setSink(
        "ll_default_file",
        std::make_shared<ll::io::FileSink>(
            "logs/mymod.log",
            makePolymorphic<ll::io::PatternFormatter>("[{3:.3%F %T.} {2}][{1}] {0}", false)
        )
    );
}
```

Messages are written on a background thread. Because `Logger::setFormatter` and `Logger::setFlushLevel` wait for that thread, prefer calling them—or replacing the sink with `setSink`—rather than modifying a sink returned by `getSink` while the logger is in use.

`FileSink` instances share file state by normalized path. Sinks pointing to the same file share its handle, rotation state, and policy, while each sink keeps its own formatter and flush level. Different loggers can therefore write to the same file with different formatting without overwriting each other's formatters.

### Rotating a Log File

Unless given a `RotatePolicy`, a `FileSink` uses `RotatePolicy::disabled()`, which disables rotation and only appends. The defaults on `RotatePolicy{}` work out of the box, so passing a default-constructed policy is usually enough. Its fields are read at three points: `rotateOnOpen` once when the file opens, `maxFileSize` and `interval` before each message, and the compression and retention settings asynchronously after an archive is created.

| Field | Default | Meaning |
|-------|---------|---------|
| `rotateOnOpen` | `true` | Archive a file that already has content when the sink opens it, so each run starts with its own file |
| `maxFileSize` | 32 MiB | Rotate before a message would push the file past this many bytes. A message is never split, so one larger than the limit ends up in a file of its own. `0` disables |
| `interval` | `Daily` | Rotate when a message's timestamp enters a new hour (`Hourly`) or day (`Daily`); `None` disables. The timestamp is when the message was logged, not when it reached the file |
| `compress` | `true` | Gzip archives on a background thread. The active file is never compressed |
| `keepUncompressed` | `7` | How many of the newest archives stay plain, so recent output remains greppable |
| `cleanup` | `true` | Whether archives are deleted at all. `false` keeps everything regardless of the limits below |
| `maxFiles` | `1024` | Keep at most this many archives, compressed and plain counted together. `0` disables |
| `maxAgeDays` | `120` | Delete archives last modified more than this many days ago. `0` disables |
| `totalSizeCap` | 512 MiB | Delete the oldest archives until their total size on disk fits. `0` disables |

```cpp
#include "ll/api/io/FileSink.h"
#include "ll/api/io/PatternFormatter.h"
#include "ll/api/io/RotatePolicy.h"

void addRotatingFileSink(ll::io::Logger& logger) {
    ll::io::RotatePolicy policy{};
    policy.maxFileSize = 8ull * 1024 * 1024;        // rotate past 8 MiB
    policy.interval    = ll::io::RotateInterval::Daily;  // and when the date changes
    policy.maxFiles    = 64;                        // keep at most 64 archives

    logger.setSink(
        "mymod",
        std::make_shared<ll::io::FileSink>(
            "logs/mymod.log",
            makePolymorphic<ll::io::PatternFormatter>("[{3:.3%F %T.} {2}][{1}] {0}", false),
            policy
        )
    );
}
```

The size and time triggers are independent; whichever triggers first rotates the file. `setPolicy` replaces the policy of an existing sink, and `rotate` rotates immediately unless the file is empty.

`maxFiles`, `maxAgeDays`, and `totalSizeCap` are evaluated independently and their results are combined, so relaxing one never disables another. Retention only considers files that match the archive naming scheme, leaving unrelated files in the same directory untouched. Because `totalSizeCap` measures on-disk size (including compression), disabling `compress` reduces how much history fits within the cap.

Archives are named by `namer`, with the active file's extension appended to the returned string. The default, `RotatePolicy::defaultNamer`, produces `2026-09-19.log` (or `2026-09-19_14.log` for hourly rotation), appending `.1`, `.2`, and so on for subsequent rotations within the same interval. A custom namer receives an `ArchiveNameInfo` containing the `time` the rotation was triggered, the `index` of this rotation within the current interval (starting at 0), and the policy's `interval`. The returned name must start with a four-digit year followed by `-`; otherwise, compression and retention will not recognize the archives.

`RotatePolicy` extends `RotateConfig`, which contains every field except `namer` and can be reflected directly into a config file. LeviLamina's own `logs/latest.log` reads its policy from the `logRotate` entry in its configuration.

### Conditional Logging

```cpp
#include "ll/api/io/Logger.h"

void expensiveLogging(ll::io::Logger& logger) {
    if (logger.shouldLog(ll::io::LogLevel::Debug)) {
        // Only compute this if debug logging is enabled
        auto debugInfo = computeExpensiveDebugInfo();
        logger.debug("Debug info: {}", debugInfo);
    }
}
```

### Format String Safety

The logger uses fmt format strings with compile-time checking:

```cpp
logger.info("Player {} joined", playerName);           // OK
logger.info("Position: ({}, {}, {})", x, y, z);        // OK
// logger.info("Value: {}", x, y);                     // Compile error: too many args
```

## Related

- [Expected](expected.md) — `Error::log()` outputs to a Logger
- [Mod](mod.md) — `Mod::getLogger()` returns the mod's logger
