# 🎮 Game Utilities API

The following APIs provide utility interfaces that simplify game content development and improve efficiency.

### Format Code Utility

MC uses **formatting code** symbols to control in-game text formatting, such as color and style. Formatting codes fall into two categories: color codes, which control text color, and format codes, which control text style.

This interface helps developers use MC formatting codes quickly without having to look them up in a table.
Note: This interface only takes effect when the text is passed to BDS and displayed in-game.

#### Color Code Table

| Color Code Symbols    | Color Meaning                      | In-Game String Equivalent |
| --------------------- | ---------------------------------- | ------------------------- |
| `Format.Black`        | The following text is black        | §0                        |
| `Format.DarkBlue`     | The following text is dark blue    | §1                        |
| `Format.DarkGreen`    | The following text is dark green   | §2                        |
| `Format.DarkAqua`     | The following text is lake blue    | §3                        |
| `Format.DarkRed`      | The following text is dark red     | §4                        |
| `Format.DarkPurple`   | The following text is purple       | §5                        |
| `Format.Gold`         | The following text is gold         | §6                        |
| `Format.Gray`         | The following text is gray         | §7                        |
| `Format.DarkGray`     | The following text is dark grey    | §8                        |
| `Format.Blue`         | The following text is blue         | §9                        |
| `Format.Green`        | The following text is light green  | §a                        |
| `Format.Aqua`         | The following text is sky blue     | §b                        |
| `Format.Red`          | The following text is red          | §c                        |
| `Format.LightPurple`  | The following text is light purple | §d                        |
| `Format.Yellow`       | The following text is light yellow | §e                        |
| `Format.White`        | The following text is white        | §f                        |
| `Format.MinecoinGold` | The following text is coin gold    | §g                        |



#### Format Code Table

| Format Code Symbol     | Format Meaning                                            | In-Game String Equivalent |
| ---------------------- | --------------------------------------------------------- | ------------------------- |
| `Format.Bold`          | The following text is **Bold**                            | §l                        |
| `Format.Italics`       | The following text is *Italic*                            | §o                        |
| `Format.Underline`     | The following text is <u>Underline</u>                    | §n                        |
| `Format.StrikeThrough` | The following text is ~~Strikethrough~~                   | §m                        |
| `Format.Random`        | The following text is randomly flashed garbled characters | §k                        |
| `Format.Clear`         | The following text clears all formatting                  | §r                        |



Use these codes by concatenating them into a string, as shown below:

[JavaScript]
```js
mc.broadcast(Format.Red + Format.Bold + "Red & Bold " + Format.DarkGreen + Format.Underline + "DarkGreen & Underline" + Format.Clear + "Clear");
```
[Lua]
```lua
mc.broadcast(Format.Red .. Format.Bold .. "Red & Bold " .. Format.DarkGreen .. Format.Underline .. "DarkGreen & Underline" .. Format.Clear .. "Clear")
```
