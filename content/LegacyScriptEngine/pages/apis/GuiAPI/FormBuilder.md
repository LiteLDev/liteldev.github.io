# 📃 Normal Form Builder API

> These APIs help developers easily build common forms.

LSE provides a **normal form object** to easily create a custom form and send it to a specific player.

### Create Form Object

Before using these APIs, call this function to create a blank normal form object:

`mc.newSimpleForm()`

- Return value: The newly created blank form object.
- Return value type: `SimpleForm`

### Add Form Elements

Once created, you can use the following member functions (methods) to add form elements to the object.  
For a given form object `fm`, the following functions are available:

#### Set the Title of the Form

`fm.setTitle(title)`

- Parameter:
    - title : `String`  
      Title of the form.
- Return value: The updated form object (for method chaining).
- Return value type: `SimpleForm`

#### Set the Content of the Form

`fm.setContent(content)`

- Parameter:
    - content: `String`  
      Text content of the form.
- Return value: The updated form object (for method chaining).
- Return value type: `SimpleForm`

#### Add a Row of Buttons to the Form

`fm.addButton(text[,image])`

- Parameters:
    - text : `String`  
      The button text.
    - image: `String`  
      (Optional) The path to the button image.
- Return value: The updated form object (for method chaining).
- Return value type: `SimpleForm`

Use a texture pack path or URL in `image` to specify the button's icon.  
For each button on the form, set its icon as follows:

1. For a texture pack path, use a path like `textures/items/apple`.
2. For a URL, provide the full URL, such as `https://www.baidu.com/img/flexible/logo/pc/result.png`.
3. If the button does not need an image, omit this parameter.

#### Add a Header to the Form

`fm.addHeader(text)`

- Parameters:
    - text : `String`  
      Header.
- Return value: The updated form object (for method chaining).
- Return value type: `SimpleForm`

#### Add a Line of Text to the Form

`fm.addLabel(text)`

- Parameters:
    - text : `String`  
      Line of text.
- Return value: The updated form object (for method chaining).
- Return value type: `SimpleForm`

#### Add a Divider to the Form

`fm.addDivider()`

- Return value: The updated form object (for method chaining).
- Return value type: `SimpleForm`

### Send Form

Once the form object is configured, you can send it to a player and listen for their interaction.  
You can send the same form object repeatedly. Each call returns a different form ID and invokes its own callback function upon player interaction without conflict.

For a player object `pl`, use the following function:

`pl.sendForm(fm,callback[,forUpdating])`

- Parameters:
    - fm : `SimpleForm`  
      The configured form object.
    - callback : `Function`  
      The callback function called after the player interacts with the form.
    - forUpdating : `Boolean`
      (Optional, added in 0.11.0) Whether the form is sent to update an existing form. Defaults to false.
- Return value: The ID of the sent form.
- Return value type: `Integer`
    - A return value of `Null` indicates that sending failed.

Prototype of the `callback` function: `function(player,id,reason)`
- player : `Player`  
The player who interacted with the form.
- id : `Integer`    
The 0-based index of the form button the player clicked.  
If id is `Null`, the player canceled the form.
- reason : `Integer`
The reason the form was closed:
0 = UserClosed, 1 = UserBusy
The reason may be `null`.

## 📰 Custom Form Builder API

> These APIs help developers easily build custom forms without having to write JSON manually.

LSE provides a **Custom Form Object** to easily create a custom form and send it to a specific player.

### Create Form Object

Before using these APIs, call this function to create a blank custom form object.

`mc.newCustomForm()`

- Return value: The newly created blank form object.
- Return value type: `CustomForm`

### Add Form Elements

Once created, you can use the following member functions (methods) to add form elements to the object.  
For a given form object `fm`, the following functions are available:

#### Set the Title of the Form

`fm.setTitle(title)`

- Parameters:
    - title : `String`  
      Title of the form.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Header to the Form

`fm.addHeader(text)`

- Parameters:
    - text : `String`  
      Header.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Line of Text to the Form

`fm.addLabel(text)`

- Parameters:
    - text : `String`  
      The line of text.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Divider to the Form

`fm.addDivider()`

- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Row of Input Boxes to the Form

`fm.addInput(title[,placeholder,default,tooltip])`

- Parameters:

    - title : `String`  
      Description text for the input box.
    - placeholder : `String`  
      (Optional) Placeholder text shown in the input box.
    - default : `String`  
      (Optional) Default text in the input box.
    - tooltip : `String`
      (Optional, added in 0.12.0) Tooltip text.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Row of Switch Options to the Form

`fm.addSwitch(title[,default,tooltip])`

- Parameters:
    - title : `String`  
      Description text for the switch.
    - default : `Boolean`  
      (Optional) Default on/off state of the switch.
    - tooltip : `String`
      (Optional, added in 0.12.0) Tooltip text.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Drop-Down Menu to the Form

`fm.addDropdown(title,items[,default,tooltip])`

- Parameters:

    - title : `String`  
      Description text for the drop-down menu.

    - items : `Array<String,String,...>`  
      List of option labels in the drop-down menu.

    - default : `Integer`  
      (Optional) The 0-based index of the item selected by default in the drop-down menu.  
      Defaults to 0 (the first item in the list).

    - tooltip : `String`
      (Optional, added in 0.12.0) Tooltip text.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Row of Cursor Sliders to the Form

`fm.addSlider(title,min,max[,step,default,tooltip])`

- Parameters:
    - title : `String`  
      Description text for the slider.
    - min : `Integer`  
      Minimum slider value.
    - max : `Integer`  
      Maximum slider value.
    - step : `Integer`  
      (Optional) Step size for each slider increment. Defaults to 1.
    - default : `Integer`  
      (Optional) Initial value of the slider. Must be between the minimum and maximum values.  
      Defaults to 0 (the start of the slider).
    - tooltip : `String`
      (Optional, added in 0.12.0) Tooltip text.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Add a Row of Step Sliders to the Form

`fm.addStepSlider(title,items[,default,tooltip])`

- Parameters:
    - title : `String`  
      Description text for the step slider.

    - items : `Array<String,String,...>`  
      List of option labels for the step slider.

    - default : `Integer`  
      (Optional) The 0-based index of the option selected by default.  
      Defaults to 0 (the start of the slider).

    - tooltip : `String`
      (Optional, added in 0.12.0) Tooltip text.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

#### Set the Text of the Submit Button

!!! warning
    This API is only available in 0.11.0 and later.

`fm.setSubmitButton(text)`

- Parameters:
    - text : `String`  
      Text of the submit button.
- Return value: The updated form object (for method chaining).
- Return value type: `CustomForm`

### Send Form

Once the form is configured, you can send it to the player and listen for their interaction. You can send the same form object repeatedly: each call returns a different form ID, and each interaction triggers its own callback without conflict.

For a player object `pl`, call:

`pl.sendForm(fm,callback[,forUpdating])`

- Parameters:
    - fm : `CustomForm`  
      The configured custom form object.
    - callback : `Function`  
      The callback function invoked after the player submits the form.
    - forUpdating : `Boolean`
      (Optional, added in 0.11.0) Whether the form is sent as an update. Defaults to false (not an update).
- Return value: The ID of the sent form.
- Return value type: `Integer`
    - A return value of `Null` indicates that sending failed.

The `callback` parameter has the prototype `function(player,data,reason)`:

- player : `Player`  
  The player who interacted with the form.
- data : `Array<...>`    
  An array of the returned form values.  
  The value of each control is stored in the array in the order the controls appear on the form.  
  If data is `Null`, the player canceled the form.
- reason : `Integer`
  The reason the form was closed.
  0 = UserClosed, 1 = UserBusy
  This value may be `null`.


