# 📝 文件 API

> 本节提供对接 **底层系统功能** 的接口，包括操作文件系统、访问网络等。

打通与系统底层接口的交互是插件开发的重要扩展，能够大幅提升开发的灵活性。

## 📝 简单文件读写 API

以下 API 提供了简单的文件读写接口，适合偶尔读写文件的场景。  
脚本引擎使用文件类 **File** 封装文件相关操作。  
如需频繁操作文件，请使用下方的文件对象 API 以提高性能。

> 注：所有文本操作均使用 UTF-8 编码。

### 读入文件的所有内容

!!! warning
    此函数的可选参数和 `ByteBuffer` 返回值仅在 0.19.1 及更高版本中可用。

`File.readFrom(path[,isBinary])`

- 参数：
  - path : `String`  
    目标文件路径，相对路径以 BDS 根目录为基准。
  - isBinary : `Boolean`  
    是否按二进制方式读取，默认为 `false`。
- 返回值：文件的所有数据。
- 返回值类型：`String` / `ByteBuffer`
  - 若返回 `Null`，则表示读取失败。

如果 `isBinary` 为 `true`，则返回 `ByteBuffer`；否则返回 `String`。

在 0.19.1 版本之前，此函数只能以 `File.readFrom(path)` 形式调用，返回值类型固定为 `String`。



### 向指定文件写入内容

`File.writeTo(path,text)`

- 参数：
  - path : `String`  
    目标文件路径，相对路径以 BDS 根目录为基准。

  - text : `String` / `ByteBuffer`  
    要写入的内容。

- 返回值：是否写入成功。

- 返回值类型：`Boolean`

> 注：若文件不存在则会自动创建；若文件已存在，则会先将其**清空**再写入。

!!! warning
    传入 `ByteBuffer` 仅在 0.19.1 及更高版本中可用。



### 向指定文件追加一行

`File.writeLine(path,text)`

- 参数：
  - path : `String`  
    目标文件路径，相对路径以 BDS 根目录为基准。

  - text : `String`  
    要写入的内容。
- 返回值：是否写入成功。
- 返回值类型：`Boolean`



## 📋 文件对象 API

脚本引擎使用「文件对象」来操作和读写特定文件。

### 创建一个新的文件对象

[JavaScript] `new File(path,mode[,isBinary])`  
[Lua] `File(path,mode[,isBinary])`

- 参数：
  - path : `String`  
    要打开的文件路径。
  - mode : `Enum`  
    文件的打开模式。
  - isBinary : `Boolean`  
    （可选参数）是否以二进制模式打开文件，默认为 `false`。  
    在普通模式下读写文件时，换行符会按本地格式自动转换。以二进制模式打开文件则表明该文件并非普通文本格式，不会进行此类自动转换。
- 返回值：打开的文件对象。
- 返回值类型：`File`
  - 若打开失败，将抛出异常。

文件的打开模式有以下可选项：

| 打开模式          | 表示的含义                                             |
| ----------------- | ------------------------------------------------------ |
| `file.ReadMode`   | 准备读取文件内容                                       |
| `file.WriteMode`  | 准备写入文件。如果文件已存在，会被清空                 |
| `file.AppendMode` | 准备写入文件。之后写入的任何内容都将会被追加到文件最后 |

使用 `ReadMode` 和 `WriteMode` 时，可以通过 `seekTo` 手动移动文件指针的位置。

> 如果指定路径的文件已存在，将直接打开该文件；如果不存在，则会自动创建新文件。如果路径中包含不存在的目录，接口也会自动创建这些目录。

打开文件后，即可使用以下文件对象接口来读写文件。




### 文件对象 - 属性

每个文件对象都包含一些固定的属性。对于特定文件对象 `fi`，包含以下属性：

| 属性            | 含义               | 类型      |
| --------------- | ------------------ | --------- |
| fi.path         | 当前文件路径       | `String`  |
| fi.absolutePath | 当前文件的绝对路径 | `String`  |
| fi.size         | 当前文件大小       | `Integer` |

这些对象属性均为只读，无法修改。



### 文件对象 - 函数

每个文件对象都包含一些可调用的成员函数（成员方法）。对于特定文件对象 `fi`，可以通过以下函数对其进行操作。

#### 同步读写

使用同步读写接口时请注意：如果文件过大或读写内容过多，耗时过长，可能会导致游戏卡顿。  
如果读写数据量不大，同步接口能提供更好的开发体验。  
如果数据量较大，建议使用下方的异步读写接口。

##### 从文件读取文本 / 二进制数据

`fi.readSync(cnt)`

- 参数：
  - cnt : `Number`  
    要读取的字符数 / 字节数。
- 返回值：读取的字符串内容 / 二进制数据。
- 返回值类型：`String` / `ByteBuffer`
  - 若返回 `Null`，则表示读取失败。

从当前文件指针处开始读取。如果文件以二进制模式打开，则返回 `ByteBuffer`；否则返回 `String`。



##### 从文件读取一行文本

`fi.readLineSync()`

- 返回值：读取的字符串内容。
- 返回值类型：`String`
  - 若返回 `Null`，则表示读取失败。

> 注意：字符串末尾的换行符需自行处理。



##### 从文件读取所有内容

`fi.readAllSync()`

- 返回值：读取的字符串内容 / 二进制数据。
- 返回值类型：`String` / `ByteBuffer`
  - 若返回 `Null`，则表示读取失败。

从当前文件指针处开始，一直读取到文件末尾。  
如果文件以二进制模式打开，则返回 `ByteBuffer`；否则返回 `String`。



##### 写入文本 / 二进制数据到文件

`fi.writeSync(str)`

- 参数：
  - str : `String` / `ByteBuffer`  
    要写入的内容。
- 返回值：是否写入成功。
- 返回值类型：`Boolean`

如果文件以二进制模式打开，传入的参数将按二进制字节写入；否则按普通文本写入。



##### 写入一行文本到文件

`fi.writeLineSync(str)`

- 参数：
  - str : `String`  
    要写入的内容。
- 返回值：是否写入成功。
- 返回值类型：`Boolean`

此函数执行时，会自动在字符串末尾添加换行符。



#### 异步读写

当数据量较大、读写耗时较长时，建议使用异步读写接口，以减小对服务器的影响。

##### 从文件读取文本 / 二进制数据（异步）

`fi.read(cnt,callback)`

- 参数：
  - cnt : `Number`  
    要读取的字符数 / 字节数。
  - callback : `Function`  
    接收结果的回调函数。
- 返回值：是否成功发送请求。
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(result)`  

- result : `String` / `ByteBuffer`  
  读取到的文本 / 二进制数据。  
  若 result 为 `Null`，则表示读取失败。

从当前文件指针处开始读取。如果文件以二进制模式打开，则返回 `ByteBuffer`；否则返回 `String`。



##### 从文件读取一行文本（异步）

`fi.readLine(callback)`

- 参数：
  - callback : `Function`  
    接收结果的回调函数。
- 返回值：是否成功发送请求。
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(result)`  

- result : `String`  
  读取到的文本。

> 注意：字符串末尾的换行符需自行处理。



##### 从文件读取所有内容（异步）

`fi.readAll(callback)`

- 参数：
  - callback : `Function`  
    接收结果的回调函数。
- 返回值：是否成功发送请求。
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(result)`  

- result : `String` / `ByteBuffer`  
  读取到的文本 / 二进制数据。  
  若 result 为 `Null`，则表示读取失败。

从当前文件指针处开始，一直读取到文件末尾。  
如果文件以二进制模式打开，则返回 `ByteBuffer`；否则返回 `String`。



##### 写入文本 / 二进制数据到文件（异步）

`fi.write(str[,callback])`

- 参数：
  - str : `String` / `ByteBuffer`  
    要写入的内容。
  - callback : `Function`  
    （可选参数）接收结果的回调函数。
- 返回值：是否成功发送请求。
- 返回值类型：`Boolean`

如果文件以二进制模式打开，请传入 `ByteBuffer`；否则请传入 `String`。

注：参数 callback 的回调函数原型为 `function(result)`  

- result : `Boolean`  
  是否写入成功。



##### 写入一行文本到文件（异步）

`fi.writeLine(str[,callback])`

- 参数：
  - str : `String`  
    要写入的内容。
  - callback : `Function`  
    （可选参数）接收结果的回调函数。
- 返回值：是否成功发送请求。
- 返回值类型：`Boolean`

注：参数 callback 的回调函数原型为 `function(result)`  

- result : `Boolean`  
  是否写入成功。

> 此函数执行时，会自动在字符串末尾添加换行符。



#### 其他通用接口

除上述读写接口外，系统还提供了其他用于操作文件对象的通用接口。

##### 移动文件指针

`fi.seekTo(pos,isRelative)`

- 参数：
  - pos : `Number`  
    文件指针的目标位置。
  - isRelative : `Boolean`  
    是否相对于当前文件指针位置进行移动。
- 返回值：是否移动成功。
- 返回值类型：`Boolean`

如果 isRelative 为 `true`，pos 表示相对于当前位置移动：正数表示向后移动，负数表示向前移动。  
如果 isRelative 为 `false`，pos 表示相对于文件开头移动，取值为 `0` 或正数；如果为 `-1`，则表示移动到文件末尾。



##### 设定文件大小

`fi.setSize(size)`

- 参数：
  - size : `Number`  
    目标文件大小。
- 返回值：是否设定成功。
- 返回值类型：`Boolean`

设定的新大小可以大于文件的当前大小。  
如果设定的新大小小于文件的当前大小，原文件将被截断。



##### 关闭文件

`fi.close()`

- 返回值：是否成功关闭。
- 返回值类型：`Boolean`

文件关闭后，严禁再次使用。



##### 文件指针是否位于文件尾

`fi.isEOF()`

- 返回值：文件指针是否处于文件尾。
- 返回值类型：`Boolean`



##### 刷新文件缓冲区

`fi.flush()`

- 返回值：是否成功刷新。
- 返回值类型：`Boolean`



##### 获取错误码

`fi.errorCode()`

- 返回值：上一次 IO 操作产生的错误码。
- 返回值类型：`Integer`

如果调用上述接口失败，可通过此函数获取上一个错误码。



##### 清除错误状态

`fi.clear()`

- 返回值：是否成功清除。
- 返回值类型：`Boolean`

如果调用上述接口失败，请在获取错误码后调用此函数清除错误状态，以便继续正常使用文件对象。

