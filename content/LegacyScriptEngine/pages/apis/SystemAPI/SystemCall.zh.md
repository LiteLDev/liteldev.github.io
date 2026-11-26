# 📡 系统调用 API

以下 API 提供了执行系统调用的接口。

### 调用shell执行指定系统命令

`system.cmd(cmd,callback[,timeLimit])`

- 参数：
  - cmd : `String`  
    要执行的系统命令。
  - callback : `Function`  
    shell 进程结束后用于返回数据的回调函数。
  - timeLimit : `Integer`  
    （可选参数）命令运行的最长时限，单位为毫秒。  
    默认为 `-1`，即不限制运行时间。
- 返回值：命令是否成功启动。
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(exitcode,output)`  

- exitcode : `Integer`    
  shell 退出码。
- output : `String`  
  标准输出和标准错误输出的内容。

注意！这里执行的不是 MC 命令系统的命令。  
此函数以异步方式工作，不会等待系统命令执行完毕后再返回，而是由引擎自动调用指定的回调函数来返回结果。



### 运行指定位置程序

`system.newProcess(process,callback[,timeLimit])`

- 参数：
  - process : `String`  
    要运行的程序路径（与命令行参数）。
  - callback : `Function`  
    程序进程结束后用于返回数据的回调函数。
  - timeLimit : `Integer`  
    （可选参数）程序进程运行的最长时限，单位为毫秒。  
    默认为 `-1`，即不限制运行时间。
- 返回值：进程是否成功启动。
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(exitcode,output)`  

- exitcode : `Integer`    
  程序进程退出码。
- output : `String`  
  程序标准输出和标准错误输出的内容。

此函数以异步方式工作，不会等待系统命令执行完毕后再返回，而是由引擎自动调用指定的回调函数来返回结果。


