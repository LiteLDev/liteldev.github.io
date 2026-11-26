# 存储数据

插件需要保存两类数据：由服主编辑的设置，以及插件自己写入的数据（例如玩家的家或积分）。本指南将设置存入配置文件，将数据保存在键值数据库中，并在最后指明从何处查阅 SQL 的用法。

示例使用 JavaScript；API 在各语言中完全相同（在 Lua 中直接调用类，不写 `new`）。路径相对于服务器文件夹。请把插件文件放在其专属文件夹 `plugins/<插件名>/` 中，即该插件在 `mods/` 中的文件夹（见[插件与引擎](../concepts/plugins.md)）。

## 配置文件中的设置

### 1. 带默认内容打开文件

`new JsonConfigFile(path, default)` 用于打开 JSON 文件；若文件不存在，则用默认内容创建它：

```js
const conf = new JsonConfigFile("plugins/MyPlugin/config.json", JSON.stringify({
    welcome: "Welcome to the server!",
    reward: 1,
}));
```

路径中的文件夹会在需要时自动创建。如果文件无法打开，构造函数会抛出错误。

### 2. 读取设置

`conf.get(name, default)` 返回指定设置的值，缺少该项时返回默认值：

```js
const welcome = conf.get("welcome", "Welcome!");
const reward = conf.get("reward", 1);

mc.listen("onJoin", (player) => {
    player.tell(welcome);
});
```

`conf.init(name, default)` 一次完成两件事：返回设置的值，并在缺少该项时把默认值写入文件。向现有文件新增设置项时，用它非常方便：

```js
const maxHomes = conf.init("maxHomes", 3);
```

### 3. 写入与重新加载

`conf.set(name, value)` 修改一项设置并立即写入文件；`conf.delete(name)` 删除一项设置。值可以是数字、字符串、布尔值、数组和对象。

配置对象直接从内存中读取数据。如果服主在服务器运行时编辑了文件，可调用 `conf.reload()` 重新读取（例如通过控制台命令触发）：

```js
mc.regConsoleCmd("reloadconf", "Reloads the configuration of MyPlugin", (args) => {
    conf.reload();
    log("Configuration reloaded.");
});
```

`new IniConfigFile(path, default)` 以同样的方式处理分节的 INI 文件：`conf.init(section, name, default)`、`conf.getStr`、`conf.getInt`、`conf.getFloat`、`conf.getBool`。见[配置文件 API](../apis/DataAPI/ConfigFile.md)。

## 键值数据库中的数据

插件自行写入的数据应使用键值数据库存储：它按名称保存值，将数据存放在文件夹中，无需维护供人编辑的文件。

### 1. 打开数据库

```js
const db = new KVDatabase("plugins/MyPlugin/data");
```

路径指向一个文件夹，需要时会自动创建。如果该处已有数据库，则直接打开。如果数据库无法打开，构造函数返回 `Null`。

### 2. 写入和读取值

`db.set(name, value)` 保存一个值，`db.get(name)` 返回该值（不存在时返回 `Null`），`db.delete(name)` 删除该值，`db.listKey()` 返回所有名称。值可以是数字、字符串、布尔值、数组和对象。以下插件以 XUID 为键，统计每位玩家的来访次数：

```js
mc.listen("onJoin", (player) => {
    const key = `visits.${player.xuid}`;
    const visits = (db.get(key) ?? 0) + 1;
    db.set(key, visits);
    player.tell(`This is your visit number ${visits}.`);
});
```

保存玩家数据时，请以玩家的 XUID（`player.xuid`）而非名字作为键。

### 3. 插件卸载时关闭它

```js
ll.onUnload(() => {
    db.close();
});
```

调用 `close` 后，请勿再使用该数据库。见[数据库 API](../apis/DataAPI/DataBase.md)。

## SQL 数据库

对于表格形式的数据，可用 `new DBSession(type, params)` 打开一个 SQL 会话：`"sqlite3"` 用于数据库文件，`"mysql"` 用于 MySQL 服务器。处理来自玩家的值时，请使用预处理语句：

```js
const session = new DBSession("sqlite3", { path: "plugins/MyPlugin/data.db" });
session.exec("CREATE TABLE IF NOT EXISTS visits (xuid TEXT, time TEXT)");

mc.listen("onJoin", (player) => {
    const stmt = session.prepare("INSERT INTO visits VALUES (?, ?)");
    stmt.bind([player.xuid, system.getTimeStr()]);
    stmt.execute();
});
```

SQL API 的函数在执行失败时会抛出错误：在 JavaScript 中用 `try … catch` 捕获，在 Lua 中用 `pcall`。[数据库 API](../apis/DataAPI/DataBase.md) 介绍了连接参数、`session.query` 和预处理语句。

## 存放数据的其他地方

- [玩家绑定数据](../apis/DataAPI/PlayerData.md)：按名字或 XUID 查找不在线的玩家。
- [经济系统](../apis/DataAPI/Economy.md)：玩家的金钱。
- [文件 API](../apis/SystemAPI/File.md)：自行读写任意文件。
