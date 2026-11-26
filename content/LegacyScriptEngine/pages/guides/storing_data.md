# Storing data

A plugin keeps two kinds of data: settings that the server owner edits, and data that the plugin itself writes, such as players' homes or points. This guide stores settings in a configuration file and plugin data in a key-value database, then shows where to go for SQL.

The examples are in JavaScript, though the API is the same in every language (in Lua, call the classes without `new`). Paths are relative to the server folder. Keep your plugin's files in its own folder, `plugins/<plugin name>/`, which is the plugin's folder in `mods/` (see [Plugins and engines](../concepts/plugins.md)).

## Settings in a configuration file

### 1. Open the file with defaults

`new JsonConfigFile(path, default)` opens a JSON file, creating it with the default content if it does not exist:

```js
const conf = new JsonConfigFile("plugins/MyPlugin/config.json", JSON.stringify({
    welcome: "Welcome to the server!",
    reward: 1,
}));
```

Any missing folders in the path are created automatically. If the file cannot be opened, the constructor throws an error.

### 2. Read the settings

`conf.get(name, default)` returns the value of a setting, or the default if the setting is missing:

```js
const welcome = conf.get("welcome", "Welcome!");
const reward = conf.get("reward", 1);

mc.listen("onJoin", (player) => {
    player.tell(welcome);
});
```

`conf.init(name, default)` does both at once: it returns the setting's value, and writes the default to the file if the setting is missing. This is a good way to add a new setting to an existing file:

```js
const maxHomes = conf.init("maxHomes", 3);
```

### 3. Write and reload

`conf.set(name, value)` updates a setting and immediately writes the file; `conf.delete(name)` removes a setting. Values can be numbers, strings, booleans, arrays, or objects.

The configuration object reads from memory. If the server owner edits the file while the server is running, call `conf.reload()` to re-read it—for example, from a console command:

```js
mc.regConsoleCmd("reloadconf", "Reloads the configuration of MyPlugin", (args) => {
    conf.reload();
    log("Configuration reloaded.");
});
```

`new IniConfigFile(path, default)` works the same way for INI files, using sections: `conf.init(section, name, default)`, `conf.getStr`, `conf.getInt`, `conf.getFloat`, and `conf.getBool`. See the [Configuration file API](../apis/DataAPI/ConfigFile.md).

## Data in a key-value database

For data that the plugin writes, use a key-value database. It stores values by name in a folder, rather than in a file meant for people to edit.

### 1. Open the database

```js
const db = new KVDatabase("plugins/MyPlugin/data");
```

The path points to a folder, which is created if needed. If a database already exists there, it is opened. If the database cannot be opened, the constructor returns `Null`.

### 2. Write and read values

`db.set(name, value)` stores a value, `db.get(name)` returns it (or `Null` if it does not exist), `db.delete(name)` removes it, and `db.listKey()` returns all keys. Values can be numbers, strings, booleans, arrays, or objects. This plugin counts each player's visits by their XUID:

```js
mc.listen("onJoin", (player) => {
    const key = `visits.${player.xuid}`;
    const visits = (db.get(key) ?? 0) + 1;
    db.set(key, visits);
    player.tell(`This is your visit number ${visits}.`);
});
```

Key player data by XUID (`player.xuid`) rather than by name.

### 3. Close it when the plugin unloads

```js
ll.onUnload(() => {
    db.close();
});
```

Do not use the database after calling `close`. See the [Database API](../apis/DataAPI/DataBase.md).

## SQL databases

For tabular data, open a SQL session with `new DBSession(type, params)`: use `"sqlite3"` for a database file, or `"mysql"` for a MySQL server. Use prepared statements for values that come from players:

```js
const session = new DBSession("sqlite3", { path: "plugins/MyPlugin/data.db" });
session.exec("CREATE TABLE IF NOT EXISTS visits (xuid TEXT, time TEXT)");

mc.listen("onJoin", (player) => {
    const stmt = session.prepare("INSERT INTO visits VALUES (?, ?)");
    stmt.bind([player.xuid, system.getTimeStr()]);
    stmt.execute();
});
```

SQL API functions throw an error when they fail; handle them with `try … catch` in JavaScript and `pcall` in Lua. The [Database API](../apis/DataAPI/DataBase.md) describes the connection parameters, `session.query`, and prepared statements.

## Other places for data

- [Player data](../apis/DataAPI/PlayerData.md): look up offline players by name or XUID.
- [Economy](../apis/DataAPI/Economy.md): manage player money.
- [File API](../apis/SystemAPI/File.md): read and write arbitrary files directly.
