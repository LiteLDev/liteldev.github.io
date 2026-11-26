# 🧰 其他数据处理 API

提供其他常用的数据处理接口，支持自行调用与拓展。

注意：data 是一个空类，其下所有函数均为静态函数。

### 变量转换为JSON字符串

`data.toJson(var[,space])`

- 参数：
  - var : `任意类型`  
    要转换为 JSON 字符串的变量。支持转换的数据类型包括：  
    `Integer` `Float` `String` `Boolean` `Array` `Object `  
    其中，`Array` 和 `Object` 内部仅支持嵌套上述类型的元素。
  - space : `Integer`  
    （可选参数）用于格式化输出字符串。  
    指定每个缩进的空格数量，使输出的 JSON 字符串更易于阅读。  
    默认为 0，即不格式化输出字符串。
- 返回值：转换后的 JSON 字符串
- 返回值类型：`String`
  - 如果返回值为 `Null`，则表示转换失败。



### JSON字符串解析为变量

`data.parseJson(json)`

- 参数：
  - json : `String`  
    要解析为变量的 JSON 字符串
- 返回值：解析后的变量
- 返回值类型：`任意类型`，取决于 JSON 实际包含的数据类型
  - 如果返回值为 `Null`，则表示转换失败。



### MD5计算

`data.toMD5(str)`

- 参数：
  - str : `String` / `ByteBuffer`  
    要计算 MD5 的字符串或字节数组
- 返回值：原数据的 MD5 摘要字符串
- 返回值类型：`String`



### SHA1计算

`data.toSHA1(str)`

- 参数：
  - str : `String` / `ByteBuffer`  
    要计算 SHA1 的字符串或字节数组
- 返回值：原数据的 SHA1 摘要字符串
- 返回值类型：`String`



### 数据转Base64

`data.toBase64(str)`

- 参数：
  - str : `String` / `ByteBuffer`  
    要转换为 Base64 的字符串或字节数组
- 返回值：Base64 编码结果
- 返回值类型：`String`



### Base64解码为数据

`data.fromBase64(base64, isBinary)`

- 参数：
  - base64 : `String`  
    要解码的 Base64 字符串
  - isBinary : `Boolean`  
    是否返回二进制数据，默认为 false
- 返回值：解码后的数据
- 返回值类型：`String` 或 `ByteBuffer`


