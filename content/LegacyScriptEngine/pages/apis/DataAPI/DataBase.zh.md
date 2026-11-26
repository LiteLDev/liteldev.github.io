# 📦 数据库 API

数据库通常用于持久化储存插件生成和处理的数据。  
不同于配置文件，数据库一般不要求可读性，但对性能和稳定性有较高要求。  
脚本引擎为此提供了统一的数据库接口。    
具体实现上，引擎提供两种数据库格式：键值对格式的 NoSQL 数据库和表格形式的 SQL 数据库，你可以按需选用。

### 📄 目录

🔑 [KVDB 键值对数据库](#-键---值对-nosql数据库)  
📋 [SQL数据库](#-sql数据库)
- 🔍 [预准备语句](#sql预准备语句)

附： 各 SQL 的官方文档  
[SQLite](https://www.sqlite.org/docs.html) [MySQL](https://dev.mysql.com/doc/)



## 🔑 键 - 值对 NoSQL数据库

键值对数据库适用于储存键值对形式的数据，如 `name:apple`、`value:5` 等。  
底层基于 [`LevelDB`](https://github.com/google/leveldb) 实现。

### 创建 / 打开一个键值对数据库

使用数据库前，你需要指定数据库路径，接口将打开或创建该数据库并返回数据库对象。  
由于 LevelDB 数据库由多个文件组成，你需要传入文件夹路径，数据库文件将储存在该文件夹中。  
如果该目录中已有数据库，则直接打开；否则会新建一个。

[JavaScript] `new KVDatabase(dir)`  
[Lua] `KVDatabase(dir)`

- 参数：
  - dir : `String`  
    数据库的储存目录路径，以 BDS 根目录为基准
- 返回值：打开 / 创建的数据库对象
- 返回值类型：`KVDatabase`
  - 如果返回值为 `Null`，则代表创建 / 打开失败

如果指定的目录不存在，系统会尝试自动逐层创建该目录路径。

成功打开数据库后，你可以使用以下接口进行操作。  
数据库对象 `db` 提供以下函数：



### 写入数据项

`db.set(name,data)`

- 参数：
  - name : `String`  
    数据项名字
  - data : `任意类型`  
    要写入的数据。允许使用的数据类型有：   
    `Integer` `Float` `String` `Boolean` `Array` `Object `  
    其中，`Array` 和 `Object` 内部仅能嵌套上述类型的元素
- 返回值：是否写入成功
- 返回值类型：`Boolean`



### 读取数据项

`db.get(name)`

- 参数：
  - name : `String`  
    数据项名字
- 返回值：数据库中储存的该数据项的值
- 返回值类型：`任意类型`，以具体储存的数据类型为准
  - 如返回值为 `Null`，则表示数据不存在



### 删除数据项

`db.delete(name)`

- 参数：
  - name : `String`  
    数据项名字
- 返回值：是否成功删除
- 返回值类型：`Boolean`



### 获取所有数据项名字

`db.listKey()`

- 返回值：所有数据项名字组成的数组
- 返回值类型：`Array`



### 关闭数据库

`db.close()`

- 返回值：是否成功关闭

数据库关闭后，请勿继续使用！

------

## 📋 SQL数据库

SQL 数据库适用于使用 SQL 语句处理大量关系型数据。接口底层采用跨数据库操作框架实现，可对接市面上的绝大多数常用 SQL 数据库。

注：除非另有说明，以下 API 均可能抛出异常，建议配合各语言的异常处理语句使用。JavaScript 可使用 `try ... catch` 语句，Lua 可使用 `pcall`。一般情况下，未抛出错误即代表调用成功。

> 如果你是 JavaScript 插件开发者，还可以尝试使用 [Yoyo](https://gitee.com/Y_oyo) 封装的 LLDB 链式操作库（主要面向不了解 SQL 语法的新手开发者）。详情请[点击这里](https://gitee.com/Y_oyo/yoyo-mcbe-lite-xloader-item/blob/master/sql/yoyoSqlite.js%202.0.0.md)。

### 打开一个SQL数据库会话

为兼容多种数据库，连接数据库时需要传入包含连接参数的对象或字符串。

[JavaScript] `new DBSession(type, params)`  
[Lua] `DBSession(type, params)`

- 参数：
  - type : `String`  
    数据库类型，支持 `"sqlite3"` 和 `"mysql"`
  - params: `Object`  
    [连接参数](#连接参数)
- 返回值：打开的数据库会话对象
- 返回值类型：`DBSession`
  - 如果返回值为 `Null`，则代表打开失败

[JavaScript] `new DBSession(str)`  
[Lua] `DBSession(str)`

- 参数：
  - str : `String`  
    形如 `file:///mydb.db?k=v`、`mysql://root:password@localhost:3306/db` 的连接字符串
- 返回值：打开的数据库会话对象
- 返回值类型：`DBSession`
  - 如果返回值为 `Null`，则代表打开失败



#### 连接参数

| 键         | 用途           | 可用数据库    | 示例                | 默认值     |
|-----------|--------------|----------|-------------------|---------|
| path      | 指定数据库所在路径    | `SQLite` | `plugins/test.db` | -       |
| create    | 数据库不存在是否自动创建 | `SQLite` | `true`/`false`    | `true`  |
| readonly  | 以只读模式打开      | `SQLite` | `true`/`false`    | `false` |
| readwrite | 以读写模式打开      | `SQLite` | `true`/`false`    | `true`  |
| host      | 数据库服务器地址     | `MySQL`  | `localhost`       | -       |
| port      | 数据库服务器端口     | `MySQL`  | `3306`            | `3306`  |
| user      | 用户名          | `MySQL`  | `root`            | -       |
| password  | 密码           | `MySQL`  | `password`        | -       |
| database  | 要使用的数据库      | `MySQL`  | `db`              | -       |



### 执行SQL并获取结果集

`session.query(sql)`  

- 参数：
  - sql : `String`  
    要查询的 SQL 语句
- 返回值：查询结果（结果集）
- 返回值类型：`Array<Array>`  
  返回数组的第 1 行（`result[0]`）为结果集的表头（列名），其余行为结果数据


若查询结果为：
| a   | b   |
| --- | --- |
| ll  | 233 |
| h   | 114 |

则 query 方法的返回值为：
```json
[
  ["a",  "b"],
  ["ll", 233],
  ["h",  114]
]
```




### 执行SQL但不获取结果

`session.exec(sql)`  
`session.execute(sql)`

- 参数：
  - sql : `String`  
    要执行的 SQL 语句
- 返回值：处理完毕的会话对象（便于链式进行其他操作）
- 返回值类型：`DBSession`



### 获取当前会话是否为打开状态

`session.isOpen()`

- 返回值：是否为打开状态
- 返回值类型：`Boolean`



### 备份数据库

`session.backup(path)`

- 参数：
  - path : `String`
    备份数据库文件的目标路径
- 返回值：备份操作是否成功
- 返回值类型：`Boolean`

> 目前该接口仅针对 SQLite 会话实现。



### 关闭数据库会话

`session.close()`

- 返回值：是否成功关闭
- 返回值类型：`Boolean`



### SQL预准备语句



> 预准备语句（Prepared Statement）是 SQL 的重要组成部分。其原理是：先将含有未知参数的 SQL 语句（发往服务端）进行处理和编译，随后绑定参数，最后执行并返回结果。不同 SQL 数据库的预准备语句实现及表示方法可能存在差异，请务必仔细阅读文档（更建议直接查阅对应 SQL 数据库的官方文档）。  
> 预准备语句的主要作用是防止 SQL 注入攻击——一种常见且危险的攻击。如果未经检验便直接使用用户输入的数据（就像 BDS 一样 xD），可能会导致免密码登录，甚至数据丢失（注入执行 `DROP TABLE` 或 `DROP DATABASE`）等严重后果。因此，处理用户输入的数据时，更推荐使用预准备语句。此外，它还能让服务器只需编译一次语句，即可支持多次输入。



#### 准备一个预准备语句

`session.prepare(sql)`  

- 参数：
  - sql : `String`  
    要准备的 SQL 语句
- 返回值：预准备语句，失败时抛出错误
- 返回值类型：`DBStmt`

##### 各个SQL的预准备语句

SQLite:
```sql
-- 单个?表示参数
SELECT * FROM table WHERE id = ?;
-- ?X和?Y，其中X、Y均为参数名，后面可以更方便地绑定
INSERT INTO table VALUES (?X, ?Y);
-- $X、?Y、:Z、@V都是带参数名的参数，您也可以使用$/:/@ + name的形式定义参数
-- @符号在其他SQL中可能存在特殊含义，建议避免使用@开头
INSERT INTO table VALUES ($X, ?Y, :Z, @V);
/* 注: https://www.sqlite.org/c3ref/bind_blob.html */
```

MySQL:
```sql
-- 单个?表示参数
SELECT * FROM table WHERE id = ?;
-- 原生MySQL并不支持含参数名的参数，LLDB为了兼容其他SQL简单实现了参数名解析，建议避免使用
-- ?X和?Y，其中X、Y均为参数名，后面可以更方便地绑定
INSERT INTO table VALUES (?X, ?Y);
-- $X、?Y、:Z都是带参数名的参数，您也可以使用$/:/ + name的形式定义参数
INSERT INTO table VALUES ($X, ?Y, :Z);
```



#### 预准备语句对象 - 属性

| 属性                  | 含义                                                             | 类型        | 另见                                                                                                                                      |
|---------------------|----------------------------------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `stmt.affectedRows` | 获取预准备语句执行后影响的行数（仅对 `INSERT`、`UPDATE`、`DELETE`、`REPLACE` 等语句生效） | `Integer` | [SQLite](https://www.sqlite.org/c3ref/changes.html) [MySQL](https://dev.mysql.com/doc/c-api/8.0/en/mysql-affected-rows.html)            |
| `stmt.insertId`     | 获取 `INSERT`/`UPDATE`/`REPLACE` 语句执行后最后更改行的行号（关于行号的解释详见官方文档）   | `Integer` | [SQLite](https://www.sqlite.org/c3ref/last_insert_rowid.html) [MySQL](https://dev.mysql.com/doc/c-api/8.0/en/mysql-stmt-insert-id.html) |

以上属性均为只读，无法修改，且只能在语句执行后获取。

#### 绑定参数到一个SQL语句

`stmt.bind(val)`

- 参数：
  - val : `任意类型`  
    要绑定的值  
- 注：该重载会将值绑定到第一个未绑定的参数上。

`stmt.bind(obj)`

- 参数：
  - val : `Object`  
    要绑定的对象，等同于遍历该对象并依次执行 `bind(val, key)`

`stmt.bind(arr)`

- 参数：
  - arr : `Array`  
    要绑定的数组，等同于遍历该数组并依次执行 `bind(val)`

`stmt.bind(val, index)`

- 参数：
  - val : `任意类型`  
    要绑定的值
  - index : `Integer`  
    要绑定到的参数索引（从 `0` 开始）

`stmt.bind(val, name)`

- 参数：
  - val : `任意类型`  
    要绑定的值
  - *name : `String`  
    要绑定到的参数名


  
- 返回值：处理完毕的语句对象（便于链式调用其他操作）
- 返回值类型：`DBStmt`

参数绑定完成后，需调用 `stmt.execute()` 执行语句，否则语句不会执行。



##### 一个样例搞懂几个重载函数

```js
let stmt = session.prepare("INSERT INTO table VALUSE ($a, $b, $c, $d, $e, $f, $g, $h)");
let values = {
  c: "have you",
  d: "finished",
  e: "your",
  f: "homework?"
};
stmt.bind(values); // c,d,e,f将会被绑定
stmt.bind("LLSE"); // 将会绑定到a
stmt.bind(["****", "mojang"]); // 将会绑定到b和g
stmt.bind(114514, 7);  // 将会绑定到h
```



#### 执行当前语句

`stmt.execute()`

- 返回值：处理完毕的语句对象（便于链式调用其他操作）
- 返回值类型：`DBStmt`



#### 步进到下一行结果

`stmt.step()`

- 返回值：是否执行成功
- 返回值类型：`Boolean`
- **注意：所有参数绑定完成后会自动执行语句，执行完后此时的step就在第一行上，所以应使用do...while语句遍历，而不是while语句，否则将导致第一行被跳过**



#### 获取当前结果行

`stmt.fetch()`

- 返回值：当前结果行，格式如 `{col1: "value", col2: 2333}`
- 返回值类型：`Object`



#### 获取所有结果行

`stmt.fetchAll()`

- 返回值：查询结果（结果集），详见[执行SQL并获取结果集](#执行sql并获取结果集)
- 返回值类型：`Array<Array>`



`stmt.fetchAll(callback)`

- 参数：
  - callback : `Function<bool(Object)>`  
    用于遍历结果行的回调函数；在回调中返回 `false` 可终止遍历
- 返回值：处理完毕的语句对象（便于链式调用其他操作）
- 返回值类型：`DBStmt`



#### 重置当前语句状态至“待执行”

`stmt.reset()`

- 返回值：处理完毕的语句对象（便于链式调用其他操作）
- 返回值类型：`DBStmt`
- **注意：本函数不会清除已绑定的参数**



#### 重新执行预准备语句

`stmt.reexec()`

- 返回值：处理完毕的语句对象（便于链式调用其他操作）
- 返回值类型：`DBStmt`
- **注意：本函数是一个便捷函数，等同于执行`stmt.reset()`和`stmt.execute()`**



#### 清除所有已绑定的参数

`stmt.clear()`

- 返回值：处理完毕的语句对象（便于链式调用其他操作）
- 返回值类型：`DBStmt`



### 样例

```js
let dat = {};
let modified = {};
let session = null;
function initdb() {
  if (!file.exists("plugins/MyPlugin")) file.mkdir("plugins/MyPlugin");
  session = new DBSession("sqlite", {path: "./plugins/MyPlugin/dat.db"});
  session.exec(`
    CREATE TABLE IF NOT EXISTS "test" (
      player  CHAR(100) NOT NULL,
      coins   INTEGER   NOT NULL
    );`); // 这里创建数据表后SQLite会自动添加一个隐藏的ROWID行，insertId就是这个隐藏的ROWID行的值
    // 另：如果数据库自带INTEGER类型主键，则ROWID即为该主键
}
// 使用do...while语句
function loadData() {
  let stmt = session.prepare("SELECT * FROM test");
  do { // 准备并执行后，默认在第一行
    let row = stmt.fetch();
    dat[row.player] = row.coins;
  } while (stmt.step()); // 第一次执行时步进到第二行，并成功获取到结果，返回true；最后一行时再步进则返回false
}
// 使用回调函数
function loadData2() {
  session.prepare("SELECT * FROM test")
    .execute()
    .fetchAll((player, coins) => {
      dat[player] = coins;
    });
}
function writeData() {
  let keys = Object.keys(modified);
  let stmt = session.prepare("UPDATE FROM test WHERE player = ? SET coins = ?").execute();
  for (let i = 0; i < keys.length; i++) {
    let v = modified[keys[i]];
    stmt.bind([keys[i], v]); // 绑定数组参数
    // 绑定完成后自动执行语句
    stmt.clear(); // 清除已经绑定的值
  }
}
mc.regPlayerCmd("getcoin", "Get a coin!", (pl, args)=>{
  dat[pl.realName]++;
  modified[pl.realName]++;
});
```
