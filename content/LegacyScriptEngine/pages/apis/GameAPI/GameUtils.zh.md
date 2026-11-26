# 🎮 游戏实用工具 API

以下 API 提供了辅助游戏内容开发的实用工具接口，可提高开发效率。

### 格式化代码实用工具

MC 通过 **格式化代码** 符号在游戏内控制文字颜色和样式。格式化代码分为颜色代码与格式代码两种，分别用于控制颜色和样式。

此处的接口旨在帮助开发者快速上手 MC 格式化代码，无需频繁查表。  
注意：此处的接口仅在传递到 BDS 中并显示时才会生效。

#### 颜色代码表

| 颜色代码符号           | 表示的颜色意义          | 游戏内对应的字符串 |
| ---------------------- | ----------------------- | ------------------ |
| `Format.Black`         | 接下来的文字为 黑色     | §0                 |
| `Format.DarkBlue`      | 接下来的文字为 深蓝色   | §1                 |
| `Format.DarkGreen`     | 接下来的文字为 深绿色   | §2                 |
| `Format.DarkAqua	`     | 接下来的文字为 湖蓝色   | §3                 |
| `Format.DarkRed`       | 接下来的文字为 深红色   | §4                 |
| `Format.DarkPurple`    | 接下来的文字为 紫色     | §5                 |
| `Format.Gold`          | 接下来的文字为 金色     | §6                 |
| `Format.Gray`          | 接下来的文字为 灰色     | §7                 |
| `Format.DarkGray`      | 接下来的文字为 深灰色   | §8                 |
| `Format.Blue`          | 接下来的文字为 蓝色     | §9                 |
| `Format.Green`         | 接下来的文字为 浅绿色   | §a                 |
| `Format.Aqua`          | 接下来的文字为 天蓝色   | §b                 |
| `Format.Red`           | 接下来的文字为 浅红色   | §c                 |
| `Format.LightPurple`   | 接下来的文字为 浅紫色   | §d                 |
| `Format.Yellow`        | 接下来的文字为 浅黄色   | §e                 |
| `Format.White`         | 接下来的文字为 白色     | §f                 |
| `Format.MinecoinGold	` | 接下来的文字为 硬币金色 | §g                 |



#### 格式代码表

| 格式代码符号           | 表示的格式意义                  | 游戏内对应的字符串 |
| ---------------------- | ------------------------------- | ------------------ |
| `Format.Bold`          | 接下来的文字 **加粗**           | §l                 |
| `Format.Italics`       | 接下来的文字 *斜体*             | §o                 |
| `Format.Underline`     | 接下来的文字 <u>下划线</u>      | §n                 |
| `Format.StrikeThrough` | 接下来的文字 ~~删除线~~         | §m                 |
| `Format.Random`        | 接下来的文字 随机闪烁的乱码字符 | §k                 |
| `Format.Clear`         | 接下来的文字 清除所有格式       | §r                 |



上述代码可通过拼接字符串的方式使用，例如：

[JavaScript]
```js
mc.broadcast(Format.Red + Format.Bold + "Red & Bold " + Format.DarkGreen + Format.Underline + "DarkGreen & Underline" + Format.Clear + "Clear");
```
[Lua]
```lua
mc.broadcast(Format.Red .. Format.Bold .. "Red & Bold " .. Format.DarkGreen .. Format.Underline .. "DarkGreen & Underline" .. Format.Clear .. "Clear")
```
