# 📊 表单 API

> 这些 API 用于在游戏中创建、修改或控制 **GUI界面**。

清晰直观的 UI 界面有助于玩家快速上手插件，并提供良好的用户体验。

## 📊 表单相关 API

对于特定的玩家对象 `pl`，可以使用以下表单接口：

### 向玩家发送模式表单

模式表单包含一个标题、一个文本显示框以及两个按钮。

`pl.sendModalForm(title,content,confirmButton,cancelButton,callback[,forUpdating])`

- 参数：
    - title : `String`  
      表单标题
    - content : `String`  
      表单内容
    - confirmButton : `String`  
      按钮 1 的文本字符串
    - cancelButton : `String`  
      按钮 2 的文本字符串
    - callback : `Function`  
      玩家点击按钮后调用的回调函数
    - forUpdating : `Boolean`
      （可选参数，在 0.11.0 中加入）是否为表单更新，默认值为 false（即非表单更新）
- 返回值：发送的表单 ID
- 返回值类型：`Integer`
    - 如返回值为 `Null`，则表示发送失败

参数 `callback` 的回调函数原型：`function(player,result,reason)`

- player : `Player`  
  与表单交互的玩家对象
- result : `Boolean`    
  玩家点击**确定**按钮时为 `true`，点击**取消**按钮时为 `false`。  
  如果 id 为 `Null`，则表示玩家取消了表单
- reason : `Integer`（在 0.9.0 中加入）
  表单被取消的原因：
  0 = UserClosed, 1 = UserBusy
  reason 可能会是 `null`。

### 向玩家发送普通表单

普通表单包含一个标题、一个文本显示框以及若干按钮，并可设置按钮上显示的图标。  
由于按钮内容的设置相对复杂，建议使用下一节的表单构建器 API。

`pl.sendSimpleForm(title,content,buttons,images,callback[,forUpdating])`

- 参数：
    - title : `String`  
      表单标题
    - content : `String`  
      表单内容
    - buttons : `Array<String,String,...>`  
      各个按钮文本的字符串数组
    - images : `Array<String,String,...>`  
      各个按钮对应的图片路径
    - callback : `Function`  
      玩家点击按钮后调用的回调函数
    - forUpdating : `Boolean`
      （可选参数，在 0.11.0 中加入）是否为表单更新，默认值为 false（即非表单更新）
- 返回值：发送的表单 ID
- 返回值类型：`Integer`
    - 如返回值为 `Null`，则表示发送失败

参数 `callback` 的回调函数原型：`function(player,id,reason)`

- player : `Player`  
  与表单交互的玩家对象
- id : `Integer`    
  玩家点击的表单按钮序号，从 0 开始编号。  
  如果 id 为 `Null`，则表示玩家取消了表单
- reason : `Integer`（在 0.9.0 中加入）
  表单被取消的原因：
  0 = UserClosed, 1 = UserBusy
  reason 可能会是 `null`。

图片路径参数 `images` 使用材质包路径或 URL 来指定按钮对应的图标。  
表单上每个按钮的图标设置方式如下：

1. 使用材质包路径时，图片路径格式应如 `textures/items/apple`
2. 使用 URL 路径时，填入完整的 URL 即可，格式如 `https://www.baidu.com/img/flexible/logo/pc/result.png`
3. 如果按钮不需要显示图片，将对应的图片路径设为空字符串即可

### 向玩家发送自定义表单（JSON格式）

自定义表单可以包含丰富的自定义控件。  
由于相关 JSON 定义格式相对复杂，建议使用下一节的表单构建器 API。

`pl.sendCustomForm(json,callback[,forUpdating])`

- 参数：
    - json : `String`  
      自定义表单的 json 字符串
    - callback : `Function`  
      玩家提交表单后调用的回调函数
    - forUpdating : `Boolean`
      （可选参数，在 0.11.0 中加入）是否为表单更新，默认值为 false（即非表单更新）
- 返回值：发送的表单 ID
- 返回值类型：`Integer`
    - 如返回值为 `Null`，则表示发送失败

参数 `callback` 的回调函数原型：`function(player,data,reason)`

- player : `Player`  
  与表单交互的玩家对象
- data : `Array<...>`    
  返回的表单内容数组。  
  数组的第一项固定为 `Null`，从第二项开始，按表单上的控件顺序依次存储各个控件的内容。  
  如果 data 仅为 `Null`，则表示玩家取消了表单
- reason : `Integer`（在 0.9.0 中加入）
  表单被取消的原因：
  0 = UserClosed, 1 = UserBusy
  reason 可能会是 `null`。

### 关闭玩家正在打开的表单

`pl.closeForm()`

- 返回值：请求是否成功
- 返回值类型：`Boolean`
