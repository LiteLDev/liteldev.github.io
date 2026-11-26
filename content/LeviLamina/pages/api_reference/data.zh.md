# Data（数据结构）

`ll/api/data/` · **通用**

## 概述

Data 模块提供通用数据结构，包括可观察值、基于 LevelDB 的键值存储、依赖图、语义版本类型、类型擦除函数容器、可取消回调和线程安全容器。

## 头文件

| 头文件 | 说明 |
|--------|------|
| `ll/api/data/Observable.h` | 共享状态、显式取消订阅的可观察值 |
| `ll/api/data/KeyValueDB.h` | LevelDB 键值数据库 |
| `ll/api/data/DependencyGraph.h` | 依赖解析图 |
| `ll/api/data/Version.h` | 语义版本类型 |
| `ll/api/data/VersionRequirement.h` | 语义版本范围 |
| `ll/api/data/AnyFunction.h` | 类型擦除函数容器 |
| `ll/api/data/CancellableCallback.h` | 可取消异步回调 |
| `ll/api/data/ConcurrentPriorityQueue.h` | 线程安全优先队列 |
| `ll/api/data/TightPair.h` | 空间优化的 pair |
| `ll/api/data/IndirectValue.h` | 具有值语义的指针包装器 |

## 核心类

### Observable\<T\>

`Observable<T>` 保存一个值，并在值变化时同步通知订阅者。它是通用的 Data API，不依赖 UI；数据驱动 UI 中的类型化 Observable 均继承自该模板。

```cpp
#include "ll/api/data/Observable.h"

namespace ll::data {
template <class T>
class Observable {
public:
    using Callback       = brstd::move_only_function<void(T const&)>;
    using SubscriptionId = std::uint32_t;

    explicit Observable(T initial);

    T getData() const;
    void setData(T value);

    SubscriptionId subscribe(Callback callback);
    bool unsubscribe(SubscriptionId id);
};
}
```

复制 Observable 会共享同一份数据、订阅列表和订阅 ID 序列；只有重新构造 Observable 才会创建独立的状态。

`setData()` 会比较新值与当前值。若两者相同则直接返回；若不同，则先替换数据，再同步执行回调，待所有回调执行完毕后 `setData()` 才返回。回调抛出的异常不会被吞掉，而是继续向上抛给调用方，并终止本轮尚未执行的通知。

`subscribe()` 支持仅可移动的回调，并返回订阅 ID。该 ID 不是 RAII 句柄，丢弃返回值并不会取消订阅。订阅会一直保持有效，直到成功调用 `unsubscribe(id)`，或共享的 Observable 状态被销毁。传入空回调会返回 ID `0`，而调用 `unsubscribe(0)` 会返回 `false`。

```cpp
ll::data::Observable<int> count{0};
auto copy = count; // 与 count 共享状态。

auto const subscription = count.subscribe([](int const& value) {
    // 值变化时同步执行。
});

copy.setData(1); // count.getData() 现在也是 1，回调执行一次。
copy.setData(1); // 值相同，不执行回调。

bool removed = count.unsubscribe(subscription); // true
```

!!! warning "注意"

    `Observable<T>` 内部不加锁，并发访问需由调用方自行同步。通知过程会直接遍历订阅容器，因此请勿在该 Observable 自身的回调中增删订阅。在回调中递归调用 `setData()` 会立即触发下一轮通知；除非确有需要且能妥善控制，否则应避免这种做法。

`getData()` 要求 `T` 可复制，而 `setData()` 的同值抑制要求 `T` 可比较相等。有关 UI 派生类型 `ObservableBoolean`、`ObservableNumber`、`ObservableString` 和 `ObservableUIRawMessage`，请参阅[数据驱动 UI](data_driven_ui.zh.md#ui-observable)。

### KeyValueDB

基于 LevelDB 的持久化键值存储。

```cpp
namespace ll::data {
class KeyValueDB {
public:
    class WriteBatch {
    public:
        WriteBatch& set(std::string_view key, std::string_view val);
        WriteBatch& del(std::string_view key);
    };

    explicit KeyValueDB(std::filesystem::path const& path);
    KeyValueDB(std::filesystem::path const& path, bool createIfMiss, bool fixIfError, int bloomFilterBit);

    std::optional<std::string> get(std::string_view key) const;
    bool has(std::string_view key) const;
    bool empty() const;
    bool set(std::string_view key, std::string_view val);
    bool del(std::string_view key);
    bool write(WriteBatch const& batch);

    coro::Generator<std::pair<std::string_view, std::string_view>> iter() const;
};
}
```

### 使用方法

```cpp
#include "ll/api/data/KeyValueDB.h"
#include "ll/api/mod/Mod.h"

void useDatabase(ll::mod::Mod& mod) {
    ll::data::KeyValueDB db(mod.getDataDir() / "mydata");

    db.set("player_score", "100");

    auto score = db.get("player_score");
    if (score) {
        // *score == "100"
    }

    if (db.has("player_score")) {
        db.del("player_score");
    }

    // 原子提交多个修改
    ll::data::KeyValueDB::WriteBatch batch;
    batch.set("player_score", "125").set("last_reward", "daily").del("pending_reward");
    db.write(batch);

    // 迭代所有条目
    for (auto [key, value] : db.iter()) {
        // 处理每个键值对
    }
}
```

### Version

`Version` 严格按 `major.minor.patch` 格式解析语义版本。前置版本标识符参与优先级比较，而构建元数据不参与。若比较时需要将构建元数据也视为版本身份的一部分，请使用 `isIdenticalTo()`。

```cpp
#include "ll/api/data/Version.h"

ll::data::Version current{"1.3.0-beta.1+windows.5"};
ll::data::Version release{"1.3.0"};

bool newer = release > current; // true
bool samePrecedence = ll::data::Version{"1.3.0+first"} == ll::data::Version{"1.3.0+second"}; // true
bool sameIdentity = ll::data::Version{"1.3.0+first"}.isIdenticalTo(ll::data::Version{"1.3.0+second"}); // false
```

### VersionRequirement

`VersionRequirement` 表示规范化后的语义版本范围。以空白分隔的比较条件属于同一个 AND 组，`||` 则用于分隔 OR 组。支持的比较运算符包括 `=`、`>`、`>=`、`<` 和 `<=`。

| 语法 | 含义 |
|------|------|
| `=1.2.3` | 精确匹配 `1.2.3` |
| `>=1.2.0 <2.0.0` | 不低于 `1.2.0` 且低于 `2.0.0` |
| `^1.2.3` | 低于 `2.0.0` 的兼容更新 |
| `~1.2.3` | 低于 `1.3.0` 的补丁更新 |
| `1`、`1.2`、`1.2.x` | 部分版本或通配符范围 |
| `*`、`x`、`X` | 任意非前置版本 |
| `1.2.3 - 2.0.0` | 两端均包含的连字符区间 |
| `^1.2.3 || =2.0.0` | 匹配任一范围 |

```cpp
#include "ll/api/data/VersionRequirement.h"

ll::data::VersionRequirement supported{"^1.2.3 || =2.0.0"};
bool matches = supported.matches(ll::data::Version{"1.8.0"}); // true
```

普通范围不会意外匹配前置版本。如需匹配前置版本，同一个 AND 组中必须有比较条件显式带有前置版本号，且其 `major.minor.patch` 核心版本与候选版本相同。

为保持兼容，不带比较符的完整版本 `1.2.3` 当前仍表示 `>=1.2.3 <2.0.0`。从模组清单读取这种写法时会输出迁移警告。如需精确匹配，请写为 `=1.2.3`；其他情况应显式写出目标范围。

## 相关模块

- [Config（配置系统）](config.zh.md) — 使用反射进行序列化，可存储配置数据
- [Mod（模组系统）](mod.zh.md) — `Mod::getDataDir()` 用于数据库存储位置
