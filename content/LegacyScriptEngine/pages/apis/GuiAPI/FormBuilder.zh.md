# 📃 普通表单构建器 API

> 这些 API 可以协助开发者方便地构造一个普通表单。

脚本引擎提供了**普通表单对象**，方便开发者创建自定义表单并发送给指定玩家。

### 创建表单对象

在使用这些 API 之前，需要先调用以下函数创建一个空白的普通表单对象：

`mc.newSimpleForm()`

- 返回值：新创建的空白表单对象
- 返回值类型：`SimpleForm`

### 添加表单元素

创建完成后，可以调用以下成员函数（成员方法）向对象中添加新的表单元素。  
特定表单对象 `fm` 可使用以下函数：

#### 设置表单的标题

`fm.setTitle(title)`

- 参数：
    - title : `String`  
      表单的标题
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`SimpleForm`

#### 设置表单的内容

`fm.setContent(content)`

- 参数：
    - content: `String`  
      表单的文本内容
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`SimpleForm`

#### 向表单内增加一行按钮

`fm.addButton(text[,image])`

- 参数：
    - text : `String`  
      按钮文本的字符串
    - image: `String`  
      （可选参数）按钮图片所在路径
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`SimpleForm`

图片路径参数 `image` 使用材质包路径或 URL 来指定按钮对应的图标。  
可按以下方式为表单上的每个按钮设置图标：

1. 如果使用材质包路径，图片路径应形如 `textures/items/apple`
2. 如果使用 URL 路径，填入完整的 URL 即可，形如 `https://www.baidu.com/img/flexible/logo/pc/result.png`
3. 如果按钮不需要显示图片，不传入此参数即可


#### 向表单内增加标头

`fm.addHeader(text)`

- 参数：
    - text : `String`  
      标头内容
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`SimpleForm`

#### 向表单内增加一行文本

`fm.addLabel(text)`

- 参数：
    - text : `String`  
      一行文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`SimpleForm`

#### 向表单内增加分隔线

`fm.addDivider()`

- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`SimpleForm`


### 发送表单

配置完成后，即可将表单对象发送给玩家，并监听玩家的交互消息。  
同一个表单对象可以重复发送。每次发送都会返回不同的表单 ID，并在玩家交互时调用各自设置的回调函数，互不冲突。

对于特定玩家对象 `pl`，调用以下函数：

`pl.sendForm(fm,callback[,forUpdating])`

- 参数：
    - fm : `SimpleForm`  
      配置好的表单对象
    - callback : `Function`  
      玩家与表单元素交互后调用的回调函数。
    - forUpdating : `Boolean`
      （可选参数，在 0.11.0 中加入）是否为表单更新，默认值为 false，即非表单更新
- 返回值：发送的表单 ID
- 返回值类型：`Integer`
    - 如果返回值为 `Null`，则代表发送失败

参数 `callback` 的回调函数原型：`function(player,id,reason)`
- player : `Player`  
与表单交互的玩家对象
- id : `Integer`    
玩家点击的表单按钮序号，从 0 开始编号  
如果 id 为 `Null`，则代表玩家取消了表单
- reason : `Integer`
表单被取消的原因
0 = UserClosed, 1 = UserBusy
reason 可能会是 `null`。

## 📰 自定义表单构建器 API

> 这些 API 可以协助开发者方便地构造一个自定义表单，省去编写 JSON 的繁琐。

脚本引擎提供了**自定义表单对象**，方便开发者创建自定义表单并发送给指定玩家。

### 创建表单对象

在使用这些 API 之前，需要先调用以下函数创建一个空白的自定义表单对象：

`mc.newCustomForm()`

- 返回值：新创建的空白表单对象
- 返回值类型：`CustomForm`

### 添加表单元素

创建完成后，可以调用以下成员函数（成员方法）向对象中添加新的表单元素。  
特定表单对象 `fm` 可使用以下函数：

#### 设置表单的标题

`fm.setTitle(title)`

- 参数：
    - title : `String`  
      表单的标题
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加标头

`fm.addHeader(text)`

- 参数：
    - text : `String`  
      标头内容
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加一行文本

`fm.addLabel(text)`

- 参数：
    - text : `String`  
      一行文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加分隔线

`fm.addDivider()`

- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加一行输入框

`fm.addInput(title[,placeholder,default,tooltip])`

- 参数：

    - title : `String`  
      输入框描述文本
    - placeholder : `String`  
      （可选参数）输入框内的提示字符
    - default : `String`  
      （可选参数）输入框中的默认内容
    - tooltip : `String`
      （可选参数，在 0.12.0 中加入）提示文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加一行开关选项

`fm.addSwitch(title[,default,tooltip])`

- 参数：
    - title : `String`  
      开关选项描述文本
    - default : `Boolean`  
      （可选参数）开关的默认状态（开 / 关）
    - tooltip : `String`
      （可选参数，在 0.12.0 中加入）提示文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加一行下拉菜单

`fm.addDropdown(title,items[,default,tooltip])`

- 参数：

    - title : `String`  
      下拉菜单描述文本

    - items : `Array<String,String,...>`  
      下拉菜单中的选项文本列表

    - default : `Integer`  
      （可选参数）下拉菜单默认选中的列表项序号。  
      序号从 0 开始编号。默认为 0，即默认选中列表的第一项

    - tooltip : `String`
      （可选参数，在 0.12.0 中加入）提示文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加一行游标滑块

`fm.addSlider(title,min,max[,step,default,tooltip])`

- 参数：
    - title : `String`  
      游标滑块描述文本
    - min : `Integer`  
      游标滑块最小值
    - max : `Integer`  
      游标滑块最大值
    - step : `Integer`  
      （可选参数）游标滑块调整的最小分度值，默认为 1
    - default : `Integer`  
      （可选参数）游标滑块默认初始格数，数值必须在最小和最大格数之间。  
      默认为 0，即滑块位于滑块行的开头
    - tooltip : `String`
      （可选参数，在 0.12.0 中加入）提示文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 向表单内增加一行步进滑块

`fm.addStepSlider(title,items[,default,tooltip])`

- 参数：
    - title : `String`  
      步进滑块描述文本

    - items : `Array<String,String,...>`  
      步进滑块的选项文本列表

    - default : `Integer`  
      （可选参数）步进滑块默认初始选项。序号从 0 开始编号  
      默认为 0，即滑块位于滑块行的开头

    - tooltip : `String`
      （可选参数，在 0.12.0 中加入）提示文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

#### 设置提交按钮的文本

!!! warning
    此 API 仅在 0.11.0 及更高版本中可用。

`fm.setSubmitButton(text)`

- 参数：
    - text : `String`  
      提交按钮的文本
- 返回值：处理完毕的表单对象（便于链式调用其他操作）
- 返回值类型：`CustomForm`

### 发送表单

准备就绪后，你可以将配置好的表单对象发送给玩家，并监听玩家的互动消息。  
同一个表单对象可以重复发送。每次发送都会返回不同的表单ID，玩家互动时也会触发各自对应的回调函数，互不冲突。

对于玩家对象`pl`，使用以下函数：

`pl.sendForm(fm,callback[,forUpdating])`

- 参数：
    - fm : `CustomForm`  
      配置好的自定义表单对象。
    - callback : `Function`  
      玩家提交表单后调用的回调函数。
    - forUpdating : `Boolean`
      （可选参数，在0.11.0中加入）是否为表单更新，默认值为false，即非表单更新。
- 返回值：发送的表单ID。
- 返回值类型：`Integer`
    - 如果返回值为`Null`，则表示发送失败。

参数`callback`的回调函数原型：`function(player,data,reason)`

- player : `Player`  
  与表单互动的玩家对象。
- data : `Array<...>`    
  返回的表单内容数组。  
  数组按表单上的控件顺序依次存储每个控件的内容。  
  如果data为`Null`，则表示玩家取消了表单。
- reason : `Integer`
  表单被取消的原因。
  0 = UserClosed，1 = UserBusy。
  reason可能为`null`。
