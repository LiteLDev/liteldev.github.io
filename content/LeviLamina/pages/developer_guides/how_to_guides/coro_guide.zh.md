# 协程指南

从 LeviLamina 1.0.0 开始，协程已取代 Scheduler。

## 用法

1. 引入头文件
   ```cpp
   #include "ll/api/chrono/GameChrono.h"
   #include "ll/api/coro/CoroTask.h"
   ```
2. 在函数中调用`ll::coro::keepThis`，并传入一个返回类型为`ll::coro::CoroTask`的 lambda 函数
3. 在`keepThis`的返回值上调用`launch`或`syncLaunch`方法（后者会阻塞服务器线程），并传入一个`Executor`类，例如`ll::thread::ServerThreadExecutor`

!!! tip "可用的Executor"
    `ll::thread::ServerThreadExecutor`(ll/api/thread/ServerThreadExecutor.h): 服务器线程
    `ll::thread::ThreadPoolExecutor`(ll/api/thread/ThreadPoolExecutor.h): 线程池  
    更多Executor请参见`ll/api/thread/`

## 示例

### ServerThreadExecutor

以下函数使用协程在服务器线程上每 20 tick 向控制台输出 1 次字符串，共输出 20 次。

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

以下函数使用协程在线程池中每秒向控制台输出 1 次字符串，共输出 20 次。

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