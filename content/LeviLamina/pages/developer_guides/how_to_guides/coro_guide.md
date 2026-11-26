# Coroutine Guide

As of LeviLamina 1.0.0, coroutines replace the Scheduler.

## Usage

1. Include the header files:
   ```cpp
   #include "ll/api/chrono/GameChrono.h"
   #include "ll/api/coro/CoroTask.h"
   ```
2. Call `ll::coro::keepThis` in a function and pass it a lambda that returns `ll::coro::CoroTask`.
3. Call `launch` or `syncLaunch` (which blocks the server thread) on the result of `keepThis`, passing an `Executor` class such as `ll::thread::ServerThreadExecutor`.

!!! tip "Available Executors"
    `ll::thread::ServerThreadExecutor` (ll/api/thread/ServerThreadExecutor.h): Server thread
    `ll::thread::ThreadPoolExecutor` (ll/api/thread/ThreadPoolExecutor.h): Thread pool  
    See `ll/api/thread/` for more Executors.

## Examples

### ServerThreadExecutor

This function uses a coroutine on the server thread to print a string to the console every 20 ticks, 20 times in total.

```cpp
#include "ll/api/chrono/GameChrono.h"
#include "ll/api/coro/CoroTask.h"
#include "ll/api/thread/ServerThreadExecutor.h"

void createServerThreadCoro() {
    using namespace ll::chrono_literals;
    ll::coro::keepThis([]() -> ll::coro::CoroTask<> {
        for (int i = 0; i < 20; ++i) {
            co_await 20_tick;
            std::cout << "This is coro in server thread\n";
        }
        co_return;
    }).launch(ll::thread::ServerThreadExecutor::getDefault());
}
```

### ThreadPoolExecutor

This function uses a coroutine in the thread pool to print a string to the console every second, 20 times in total.

```cpp
#include "ll/api/chrono/GameChrono.h"
#include "ll/api/coro/CoroTask.h"
#include "ll/api/thread/ThreadPoolExecutor.h"

void createThreadPoolCoro() {
    using namespace ll::chrono_literals;
    ll::coro::keepThis([]() -> ll::coro::CoroTask<> {
        for (int i = 0; i < 20; ++i) {
            co_await 1s;
            std::cout << "This is coro in thread pool\n";
        }
        co_return;
    }).launch(ll::thread::ThreadPoolExecutor::getDefault());
}
```

