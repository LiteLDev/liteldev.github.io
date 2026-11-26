# 📦 Database API

Plugins generally use databases to persistently store the data they generate and process.  
Unlike configuration files, databases generally do not need to be human-readable, but they require strong performance and stability.  
LSE provides a unified database interface for this purpose.  
Specifically, the engine supports two database formats: a key-value NoSQL database and a tabular SQL database. You can use either as needed.



### 🔑 Key-Value NoSQL Database 

Key-value databases are suitable for storing data as key-value pairs, such as `name:apple`, `value:5`, and more. 
This is implemented with [`LevelDB`](https://github.com/google/leveldb).

#### Create/Open a Key-Value Database

To use a database, pass in a database path; the interface will open or create the specified database and return a database object.  
Because a LevelDB database consists of multiple files, you must pass the path to a folder where the database files will be stored.  
If this directory already contains a database, it will be opened; otherwise, a new one will be created.

[JavaScript] `new KVDatabase(dir)`  
[Lua] `KVDatabase(dir)`

- Parameters: 
  - dir : `String`  
    The storage directory path of the database, relative to the BDS root directory.
- Return value: The opened or created database object.
- Return value type: `KVDatabase`
  - If the return value is `Null`, creating or opening the database failed.

If the specified directory does not exist, the interface will automatically try to create the directory path layer by layer.

After opening the database, you can use the following interfaces to work with it.  
A database object `db` provides the following functions:



#### Write Data Item

`db.set(name,data)`

- Parameters: 
  - name : `String`  
    Data item name.
  - data : `Any type`  
    Data to write. The allowed data types are:    
    `Integer` `Float` `String` `Boolean` `Array` `Object `  
    Only these types can be nested inside an `Array` or an `Object`.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`



#### Read Data Item

`db.get(name)`

- Parameters: 
  - name : `String`  
    Data item name.
- Return value: The data stored in the database for this item.
- Return value type: `Any type`, depending on the specific type of data stored.
  - If the return value is `Null`, the data does not exist.



#### Delete Data Item

`db.delete(name)`

- Parameters: 
  - name : `String`  
    Data item name.
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`



#### Get All Data Item Names 

`db.listKey()`

- Return value: An array of all data item names.
- Return value type: `Array`



#### Close the Database

`db.close()`

- Return value: Whether the database was closed successfully.
- Return value type: `Boolean`

Do not continue to use the database after closing it!

------

## 📋 SQL Database

SQL databases are suitable for handling large amounts of relational data using SQL statements. The underlying interface is built on a cross-database framework and supports most common SQL databases.

**Note:** Unless otherwise specified, the following APIs may throw exceptions. We recommend using exception handling blocks: `try ... catch` blocks in **JavaScript** and `pcall` in **Lua**. Generally, if no error is thrown, the call succeeded.

> If you are a JavaScript plugin developer, you can also try the [Yoyo](https://gitee.com/Y_oyo) LLDB Chained Operation Library (designed primarily for beginners unfamiliar with SQL syntax). For details, [click here](https://gitee.com/Y_oyo/yoyo-mcbe-lite-xloader-item/blob/master/sql/yoyoSqlite.js%202.0.0.md).

### Open a SQL Database Session

For cross-database compatibility, connecting to a database requires passing either an object containing connection parameters or a connection string.

**[JavaScript]** `new DBSession(type, params)`

**[Lua]** `DBSession(type, params)`

* **Parameters:**
* `type`: `String`
  The database type. Supports `"sqlite3"` and `"mysql"`.
* `params`: `Object`
  [Connection Parameters](#connection-parameters)


* **Returns:** The opened database session object.
* **Return Type:** `DBSession`
* Returns `Null` if the connection fails.



**[JavaScript]** `new DBSession(str)`

**[Lua]** `DBSession(str)`

* **Parameters:**
* `str`: `String`
  A connection string, such as `file:///mydb.db?k=v` or `mysql://root:password@localhost:3306/db`.


* **Returns:** The opened database session object.
* **Return Type:** `DBSession`
* Returns `Null` if the connection fails.



#### Connection Parameters

| Key | Purpose | Supported DB | Example | Default |
| --- | --- | --- | --- | --- |
| `path` | Path to the database file | `SQLite` | `plugins/test.db` | - |
| `create` | Create the file automatically if it does not exist | `SQLite` | `true`/`false` | `true` |
| `readonly` | Open in read-only mode | `SQLite` | `true`/`false` | `false` |
| `readwrite` | Open in read-write mode | `SQLite` | `true`/`false` | `true` |
| `host` | Database server address | `MySQL` | `localhost` | - |
| `port` | Database server port | `MySQL` | `3306` | `3306` |
| `user` | Username | `MySQL` | `root` | - |
| `password` | Password | `MySQL` | `password` | - |
| `database` | Database to use | `MySQL` | `db` | - |

---

### Execute SQL and Get Result Set

`session.query(sql)`

* **Parameters:**
* `sql`: `String`
  The SQL statement to execute.


* **Returns:** The query result set.
* **Return Type:** `Array<Array>`
  The first row (`result[0]`) contains the column names (headers); subsequent rows contain the data.

**Example Result:**
If the query returns:
| a | b |
| :--- | :--- |
| ll | 233 |
| h | 114 |

The `query` method returns:

```json
[
  ["a",  "b"],
  ["ll", 233],
  ["h",  114]
]

```

---

### Execute SQL Without Returning Results

`session.exec(sql)`

`session.execute(sql)`

* **Parameters:**
* `sql`: `String`
  The SQL statement to execute.


* **Returns:** The session object (for chaining).
* **Return Type:** `DBSession`

---

### Check Session Status

`session.isOpen()`

* **Returns:** Whether the session is currently open.
* **Return Type:** `Boolean`

---

### Backup Database

`session.backup(path)`

* **Parameters:**
* `path`: `String`
  Destination path for the backup database file.


* **Returns:** Whether the backup succeeded.
* **Return Type:** `Boolean`

> Currently implemented for SQLite sessions.

---

### Close Database Session

`session.close()`

* **Returns:** Whether the session closed successfully.
* **Return Type:** `Boolean`

---

### SQL Prepared Statements

> **Prepared Statements** are a crucial part of SQL. They send a SQL statement with placeholders to the server to be compiled first, then bind parameters to it before execution. Placeholder syntax varies across SQL engines; see the official documentation for your database.
> Prepared statements primarily prevent **SQL Injection**, a common and dangerous attack. Using unvalidated user input directly (like BDS does xD) can allow attackers to bypass passwords or destroy data (for example, by executing `DROP TABLE`). Using prepared statements for user input is strongly recommended. They also improve performance by compiling a statement once and executing it multiple times with different values.

#### Prepare a Statement

`session.prepare(sql)`

* **Parameters:**
* `sql`: `String`
  The SQL statement to prepare.


* **Returns:** A prepared statement object; throws an error on failure.
* **Return Type:** `DBStmt`

##### Placeholder Syntax Examples

**SQLite:**

```sql
-- Single '?' for positional parameters
SELECT * FROM table WHERE id = ?;
-- '?X' and '?Y' (where X/Y are names) for named binding
INSERT INTO table VALUES (?X, ?Y);
-- '$X', ':Z', and '@V' are also supported named parameters
INSERT INTO table VALUES ($X, ?Y, :Z, @V);

```

**MySQL:**

```sql
-- Single '?' for positional parameters
SELECT * FROM table WHERE id = ?;
-- Native MySQL does not support named parameters; LLDB implements simple parsing for compatibility, but use with caution.
INSERT INTO table VALUES (?X, ?Y);
INSERT INTO table VALUES ($X, ?Y, :Z);

```

#### Prepared Statement - Properties

| Property | Description | Type | See Also |
| --- | --- | --- | --- |
| `stmt.affectedRows` | Number of rows affected by the last execution (INSERT, UPDATE, DELETE, etc.) | `Integer` | [SQLite](https://www.sqlite.org/c3ref/changes.html) / [MySQL](https://dev.mysql.com/doc/c-api/8.0/en/mysql-affected-rows.html) |
| `stmt.insertId` | ID of the last inserted row (see the official documentation for row ID behavior) | `Integer` | [SQLite](https://www.sqlite.org/c3ref/last_insert_rowid.html) / [MySQL](https://dev.mysql.com/doc/c-api/8.0/en/mysql-stmt-insert-id.html) |

*These properties are read-only and are available only after the statement executes.*

---

#### Bind Parameters to a Statement

`stmt.bind(val)`

Binds a value to the first unbound parameter.

`stmt.bind(obj)`

Binds an object; equivalent to iterating over the object and calling `bind(val, key)`.

`stmt.bind(arr)`

Binds an array; equivalent to iterating over the array and calling `bind(val)`.

`stmt.bind(val, index)`

Binds a value to a specific index (starting from `0`).

`stmt.bind(val, name)`

Binds a value to a named parameter.

* **Returns:** The statement object (for chaining).
* **Return Type:** `DBStmt`

*After binding parameters, you must call `stmt.execute()` to run the query.*

##### Binding Example:

```js
let stmt = session.prepare("INSERT INTO table VALUES ($a, $b, $c, $d, $e, $f, $g, $h)");
let values = {
  c: "have you",
  d: "finished",
  e: "your",
  f: "homework?"
};
stmt.bind(values); // Binds c, d, e, f
stmt.bind("LLSE"); // Binds to a
stmt.bind(["****", "mojang"]); // Binds to b and g
stmt.bind(114514, 7);  // Binds to h (index 7)

```

---

#### Execute the Current Statement

`stmt.execute()`

* **Returns:** The statement object (for chaining).
* **Return Type:** `DBStmt`

#### Step to Next Result Row

`stmt.step()`

* **Returns:** Whether stepping succeeded (true if a row exists).
* **Return Type:** `Boolean`
* **Note:** Immediately after execution, the cursor points to the **first row**. Iterate with a `do...while` loop so you do not skip the first row.

#### Fetch Current Row

`stmt.fetch()`

* **Returns:** The current result row as an object, such as `{col1: "value", col2: 2333}`.
* **Return Type:** `Object`

#### Fetch All Result Rows

`stmt.fetchAll()`

* **Returns:** The full result set. (See [Execute SQL and Get Result Set](#execute-sql-and-get-result-set).)
* **Return Type:** `Array<Array>`

`stmt.fetchAll(callback)`

* **Parameters:**
* `callback`: `Function<bool(Object)>`
  A function to iterate through the rows. Returning `false` from the callback stops the iteration.


* **Returns:** The statement object.
* **Return Type:** `DBStmt`

---

#### Reset Statement State

`stmt.reset()`

* **Returns:** The statement object.
* **Note:** Resets the statement to a "pending" state, but **does not** clear bound parameters.

#### Re-execute Statement

`stmt.reexec()`

* **Note:** A convenience function equivalent to calling `stmt.reset()` followed by `stmt.execute()`.

#### Clear Bound Parameters

`stmt.clear()`

* **Returns:** The statement object.

---

### Code Example

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
    );`); 
    // SQLite automatically adds a hidden ROWID column. 
    // insertId refers to this ROWID value.
}

// Using do...while loop
function loadData() {
  let stmt = session.prepare("SELECT * FROM test");
  // After prepare/execute, the cursor is already on the first row
  do { 
    let row = stmt.fetch();
    dat[row.player] = row.coins;
  } while (stmt.step()); 
}

// Using callback function
function loadData2() {
  session.prepare("SELECT * FROM test")
    .execute()
    .fetchAll((row) => {
      dat[row.player] = row.coins;
    });
}

function writeData() {
  let keys = Object.keys(modified);
  let stmt = session.prepare("UPDATE test SET coins = ? WHERE player = ?");
  for (let i = 0; i < keys.length; i++) {
    let v = modified[keys[i]];
    // Automatically executes after binding if logic requires
    stmt.bind([v, keys[i]]).execute(); 
    stmt.clear(); // Clear values for next iteration
  }
}

mc.regPlayerCmd("getcoin", "Get a coin!", (pl, args)=>{
  dat[pl.realName]++;
  modified[pl.realName]++;
});
```
