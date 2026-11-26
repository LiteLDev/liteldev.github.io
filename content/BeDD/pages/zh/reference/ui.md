# UI 树

`ui` 把 JSON UI 和 Ore UI 界面读成文本（每个控件一行），并用 input 操作的虚拟鼠标、按键和文字对 ref 执行动作。请在 bedboo 操作之后使用（见[顺序](/zh/guide/operation-modes)）。配置 `ui`（默认 `true`）同时控制 `oreui` 和带 `ref` 的 `mouse`。设计详见 [#21](https://github.com/LiteLDev/BeDD/issues/21)。

1600x900 下的字符数：标题界面 519（旧 JSON 20,569），世界列表 ~860（原始 DOM ~48,000），暂停 ~600，背包 ~950。

## 视图

```
screen start_screen
- button "Play" [e1]
- button "Settings" [e2]
- text "v26.60/LeviLamina-26.60.5"
under: toast_screen, debug_screen, cubemap_background_screen
```

| 行 | |
|---|---|
| `screen <name>` | 每个读取的界面占一行；Ore UI 为 `screen <route> (Ore UI)`，如 `screen /play/all (Ore UI)`。后缀可能为 ` (not ready: read again)` 或 ` (page not read: <why>)` |
| `- <role> "<text>"` / `- <role> <name>` | 后接 ` = <value>` 或 ` checked`/` unchecked`、` disabled`、` focused`、` selected`，可执行动作时再加 ` [<ref>]`。缩进代表嵌套 |
| `- button hotbar_slot_button x9 [in e29]` | 连续 6 行以上相似的行会折叠；用 `{op:"ui", ref:"e29"}` 展开列出 |
| `... <n> lines cut: ...` | 超过 `maxNodes`；保留前 3/4 和后 1/4 |
| `under: a, b` | 最前面界面之下的界面（仅 `scope:"active"`） |
| `(nothing read on this page)` / `(no match)` | Ore UI 页面为空 / `find` 无命中 |

角色：`button`、`toggle`、`text_input`、`slider`、`scroll`、`text`、`item`（集合格子，如背包格）、`group`。

输出内容（`compact`）：仅输出可见、可读或可操作的控件。按钮取其第一个可见标签；与所属控件重复的文字会被丢弃；分组仅在可点击且不含其他行时输出；名为 `button`、`default`、`panel`、`image`、`label`、`content`、`control` 或自身角色名的 JSON UI 控件，会显示所在分组的名字。

Ref（`e1`、...）：每个控件（场景 + 路径）分配一个，只要所在界面仍在栈上，就由所有读取和连接共用，从不重新分配。忽略 `snapshot` 字段。

## 读取

| 请求 | 回复 |
|---|---|
| `{op:"ui"}` | `{view, screen（最前面）, truncated}` |
| `{op:"ui", find:"quit"}` | 文字、名字或值包含该子串（不区分大小写）的行，平铺输出 |
| `{op:"ui", ref}` | `{view, truncated}`：该控件（带 ref）及其下全部内容，不折叠 |
| `{op:"ui", ref, detail:true}` | `{node}`：全部节点字段 + `ref`、`ancestors`（文字或名字，由近及远） |
| `{op:"ui", format:"json"}` | `snapshot`（仅供参考）、`tick`、`screens`、`active`、`roots`、按 ref 索引的 `nodes`（+`parent`、`children`）、`truncated`、`client{w,h}` |

| 字段 | 默认 | |
|---|---|---|
| `scope` | `active` | `active`、`all`、界面名或 `scene-…` id |
| `maxNodes` | 80 行；json：`uiMaxNodes`（1000） | 1..100000 |
| `depth` | 全部 | 每个界面根以下的层数 |
| `includeInvisible` | `false` | 包含隐藏控件 |
| `compact` | `true` | `false`：输出全部控件 |
| `timeoutMs` | 3000 | 100..30000，超时返回 `not_ready` |
| `debug` | `false` | json/detail：附带组件、可见性位 |

| 节点字段 | |
|---|---|
| `role`、`name`、`text` | `name`：JSON UI 控件名；Ore UI 的 `aria-label`/`title`/`alt`/`placeholder`/`name`/`data-testid` |
| `value` | 文本框文字、滑块 0..1、开关状态 |
| `state` | `visible, enabled, hovered, focused, selected, pressed, editable, scrollable, checked`（非开关为 null） |
| `bounds`、`boundsNorm` | 客户区像素（`x`/`y`）；比例（`rx`/`ry`） |
| `actions` | `click`、`setText`、`scroll` |
| `surface` | 界面 id |
| `source` | `kind`（jsonui\|oreui（整个页面）\|dom）、`path`（同名兄弟记作 `name[k]`）、`type`（JSON UI 类型或标签）、`collectionName`/`collectionIndex`（如 `inventory_items`/9）、`url`、`route` |
| `hash` | 由 role、name、text、path、type、kind、url、route 计算 |

`screens[]`：`{id, kind jsonui|oreui|unknown, screen, interactive, modal}`，有值时另含 `rawScreen`、`route`、`ready:false`、`pageError`、`debug`。不读取 `unknown` 场景（如 `in_game_play_screen`）。

## 操作

```json
{"op": "ui", "action": "click", "ref": "e1"}
{"ok": true, "action": "click", "ref": "e1", "point": {"x": 800, "y": 428}, "changed": true,
 "target": "- button \"Play\" [e1]", "screen": "/play/all", "view": "screen /play/all (Ore UI)\n- button ..."}
```

| `action` | 字段（默认） | 输入 |
|---|---|---|
| `click` | `button`（left）、`holdMs`、`settleMs`、`afterMs` | `mouse click` |
| `setText` | `text`、`clear`（true）、`submit`（false）、`delayMs` | 点击；CTRL+A、BACK；`text`；ENTER |
| `scroll` | `notches`（1，正数 = 向下） | `mouse wheel` |

全部动作共用字段：`anchor`（center、top_left、top、top_right、left、right、bottom_left、bottom、bottom_right）、`offsetX`/`offsetY`、`force`、`timeoutMs`、`observeMs`（默认 150，≤5000：读取结果前的等待时间）。

回复：`point`；`changed`（任何文字、状态、值、位置或最前面界面发生变化）；`target`（控件当前行，消失则为 null）；`screen`（最前面界面）；`view`（仅当另一个界面或 Ore UI 路由来到最前面时返回）。

### 引用上的 mouse

`{"op":"mouse", "action":"move", "ref":"e68"}`：让 `mouse` 瞄准指定 ref（支持 `anchor`、`offsetX`/`offsetY`、`force`；`action` 默认 `move`），回复中会附加动作回复的字段。仅 `click`/`down` 会检查遮挡控件。

### 错误

目标控件必须保持原有的角色和名字（JSON UI）或文字（Ore UI）。

| `code` | |
|---|---|
| `stale_ref` | 未知 ref、界面已关闭、控件消失或已改变。`candidates`：≤5 行角色和名字/文字相同的候选控件（若原界面已关闭，则取自最前面界面） |
| `occluded` | 控件隐藏、在窗口外（`point`），或在该点被遮挡（`occludedBy`、`point`）。遮挡者为同一界面上更晚的输入控件（JSON UI）或上方接收输入的界面。忽略面积 ≥ 半个窗口的控件。可用 `force:true` 强制执行 |
| `not_ready` | `timeoutMs` 内无应答、无场景，或 Ore UI 页面无响应 |
| `unsupported` | ref 指向整个 Ore UI 页面，或无法读取 UI |
| `bad_args` | `maxNodes`/`depth`/`timeoutMs` 不是整数、`format` 不是 text/json、`find`/`ref` 不是字符串 |
| `bad_request` | 动作缺少 `ref`、未知 `action`、`setText` 缺少 `text` |

## 1.26.60

JSON UI：标题（`start_screen`）、HUD（`hud_screen`）、聊天、暂停、背包、退出对话框；未见滑块或开关。Ore UI：世界列表（`/play/all`）、设置（`/oreui-settings/...`）。悬停会命中最内层控件（背包：`grid_item_for_inventory` 中的 `item_button_ref`）。请等入场动画结束后再读取。

## 实现

| 部分 | |
|---|---|
| JSON UI | 在客户端线程读取已打开界面的控件树。无法读取的布局返回 `unsupported` |
| Ore UI | 经 `oreui` 脚本读取最上层 Ore UI 页面的 DOM（≤4000 节点，120 字符），角色按标签、input `type` 和 ARIA role 判断（`domRole`，`src/UiView.cpp`）。无文字的控件取其内部文字；与有文字控件相邻的无文字 `act` 2 元素视为其一层 |

## Ore UI 界面：`oreui`

原始 Ore UI DOM，无 ref（调试用）。

| 字段 | 默认 | |
|---|---|---|
| `url` | 任意 | 等待 `location.href`（如 `ui://./hbui/index.html`）包含该字符串的视图（并非路由） |
| `maxNodes` | 2000 | 1..50000 |
| `maxText` | 200 | 8..4096 |
| `timeoutMs` | 3000 | 100..30000，超时后返回 `not_ready` |
| `force` | `false` | 允许 9 以外的 V8 主版本 |

返回字段：`url`、`title`、`width`、`height`、`nodes`（按文档顺序）、`truncated`、`findings`（`method`、`gameface`、`v8`、`jsCalls`、`contextsSeen`、`missingExports`）。节点字段：`tag`、`id`、`class`、`testId`、`role`、`type`、`act`、`name`、`text`（自身文本）、`value`、`state`（`disabled, checked, selected, expanded, hidden, focused, invisible`）、`bounds`（客户区像素）、`children`（子节点的索引）。`act` 取值：1 = 根据标签、ARIA role、tabindex、test id 或 React/Preact 处理函数判定为可点击；2 = 仅具有 `-interactive` 悬停样式（且不位于具有 `act` 的祖先节点内）。

首次使用后，会在页面下一次发起调用时（~300/s）于页面中运行只读脚本（V8 9.4）；同一时间仅处理一个请求。以下情况会返回 `unsupported`（附带 `findings`）：其他 V8 主版本、导出缺失、脚本错误或 DOM > 15 MiB。若发生 V8 崩溃（SEH）或脚本未结束，将禁用 `oreui` 以及 `ui` 中的 Ore UI，直至重启。
