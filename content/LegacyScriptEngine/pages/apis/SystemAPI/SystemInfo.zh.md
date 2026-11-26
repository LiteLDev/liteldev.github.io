# 📜 获取系统信息 API

以下 API 用于获取必要的系统信息。

### 获取当前时间字符串  

`system.getTimeStr()`

- 返回值：当前时间字符串，采用当地时区与 24 小时制。  
  形如 `2021-04-03 19:15:01`
- 返回值类型：`String`



### 获取当前的时间对象

`system.getTimeObj()`

- 返回值：当前时间对象（`Object`）

- 返回值类型：`Object<Integer,Integer,Integer,Integer,Integer,Integer,Integer>`

  - 返回的时间对象 tm 包含以下成员：

  | 成员  | 含义                 | 类型      |
  | ----- | -------------------- | --------- |
  | tm.Y  | 年份数值（4位）      | `Integer` |
  | tm.M  | 月份数值             | `Integer` |
  | tm.D  | 天数数值             | `Integer` |
  | tm.h  | 小时数值（24小时制） | `Integer` |
  | tm.m  | 分钟数值             | `Integer` |
  | tm.s  | 秒数值               | `Integer` |
  | tm.ms | 毫秒数值             | `Integer` |



### 随机生成一个 GUID  字符串

`system.randomGuid()` 

- 返回值：随机生成的唯一标识符 GUID
- 返回值类型：`String`



### 随机生成一个 UUID 字符串

!!! warning
    此函数仅在 0.19.1 及更高版本中可用。

`system.randomUuid()`

- 返回值：随机生成的唯一标识符 UUID
- 返回值类型：`String`


