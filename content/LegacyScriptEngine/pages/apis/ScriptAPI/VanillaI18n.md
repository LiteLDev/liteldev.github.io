# VanillaI18n API

This API modifies Minecraft's vanilla language data.

!!! warning
    This API is only available in 0.19.1 and later.

The class name registered in the script engine is `VaillanI18n`.

## Get current language

`VaillanI18n.getCurrentLanguage()`

- Return value: Current language code.
- Return value type: `String`

## Set current language

`VaillanI18n.setCurrentLanguage(language)`

- Parameters:
  - language: `String`
    Language code, such as `en_US` or `zh_CN`.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

## Get supported languages

`VaillanI18n.getSupportedLanguages()`

- Return value: List of supported language codes.
- Return value type: `Array<String>`

## Translate vanilla text

`VaillanI18n.translate(key[, params][, language])`

- Parameters:
  - key: `String`
    Translation key.
  - params: `Array<String>` (Optional)
    Translation parameters.
  - language: `String` (Optional)
    Target language. Defaults to the current language if omitted.
- Return value: Translated text.
- Return value type: `String`

## Load language data from object

`VaillanI18n.loadLanguage(language, data)`

- Parameters:
  - language: `String`
    Language code.
  - data: `Object`
    Translation data. Every key and value must be a `String`.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

## Load language data from file

`VaillanI18n.loadLanguageFromFile(language, path)`

- Parameters:
  - language: `String`
    Language code.
  - path: `String`
    Path to the language file.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

## Load language data from directory

`VaillanI18n.loadLanguagesFromDirectory(path)`

- Parameters:
  - path: `String`
    Directory path.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

This function loads all `.lang` files in the directory.  
Each file name (without the `.lang` extension) is used as the language code.
