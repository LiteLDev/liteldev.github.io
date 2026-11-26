# 命令指南

LeviLamina 提供了编译期和运行时两套易用的命令注册系统，本指南仅介绍编译期命令注册系统。如需实现自己的脚本引擎，可能会用到运行时命令注册。在本指南补充相关内容之前，你可以参考 [LegacyScriptEngine 的实现](https://github.com/LiteLDev/LegacyScriptEngine/blob/e14c9aa33b87e90c7aa1bbf2ab1ec2cc0bbedda3/src/legacy/api/CommandAPI.cpp#L231)或 LeviLamina 中的 [CommandTest](https://github.com/LiteLDev/LeviLamina/blob/0e47aab32d734245c5ac42dd71b08b3eb77884f6/src-test/server/testCommand.cpp#L134)。注意，LegacyScriptEngine 源自 LiteLoaderBDS v1，其中的许多做法已经过时。

## 使用方法

1. 引入必要的头文件：
    ```cpp
    #include "ll/api/command/CommandHandle.h"
    #include "ll/api/command/CommandRegistrar.h"
    ```
2. 调用`CommandRegistrar::getInstance(false).getOrCreateCommand`获取或创建命令，并将其赋值给`auto& command`。`getInstance`的参数表示是否为客户端命令（传入`false`即注册服务端命令），也可以使用简写形式`getServerInstance()`和`getClientInstance()`。
3. 调用`command.overload`重载命令。如果命令不需要接收参数，可以省略模板参数，例如`command.overload()`。
4. 调用`required`添加必填参数（该方法与`optional`方法均需传入对应结构体中的成员变量名）；调用`optional`添加可选参数，但需注意判断用户是否传入了该参数；调用`text`添加子命令。其他方法可参考`ll/api/command/Overload.h`和 Intellisense 提示。
5. 调用`execute`传入命令的回调函数，回调函数的参数写法可参考下方示例。

## 示例

```cpp
#include "ll/api/command/CommandHandle.h"
#include "ll/api/command/CommandRegistrar.h"

struct NewCommand {
    enum class NewEnum { a = 0, b = 1, c = 2 } enum1;
    std::string str;
    int         number = 1;
};

void registerCommand() {
    using namespace ll::command;
    auto& command = CommandRegistrar::getInstance(false).getOrCreateCommand("new", "A example command");
    command.overload<NewCommand>().text("test").required("enum1").required("str").optional("number").execute(
        [](CommandOrigin const& origin, CommandOutput& output, NewCommand const& param) {
            output.success("test! {} {} {}", param.enum1, param.str, param.number);
        }
    );
}
```

此示例首先定义了`NewCommand`结构体来存储命令的各项参数，接着调用`getOrCreateCommand`创建了名为**new**的命令，并通过`overload`重载了名为**test**的子命令（由`text("test")`添加）以及枚举、字符串和整数参数。在游戏中的效果如下：

```
/new test <enum1> <str> [number]
```