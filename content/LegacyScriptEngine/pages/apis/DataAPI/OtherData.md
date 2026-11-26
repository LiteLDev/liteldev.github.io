# 🧰 Other Data Processing APIs

Provides common data processing interfaces that you can use and extend on your own.

Note that data is an empty class, and all its functions are static.

### Convert Variable to JSON String

`data.toJson(var[,space])`

- Parameters: 
  - var : `Any type`  
    Variable to convert to a JSON string. The allowed data types are:   
    `Integer` `Float` `String` `Boolean` `Array` `Object `  
    These elements can only be nested inside an `Array` or `Object`.
  - space : `Integer`  
    (Optional) Pass this parameter to format the output string.  
    Specifies the number of spaces per indentation level to make the output JSON string more readable.  
    Defaults to 0, meaning the output string is not formatted.
- Return value: The converted JSON string.
- Return value type: `String`
  - A return value of `Null` indicates that the conversion failed.



### JSON String Parsed as Variable

`data.parseJson(json)`

- Parameters: 
  - json : `String`  
    The JSON string to convert to a variable.
- Return value: The converted variable.
- Return value type: `Any type`, depending on the data type in the JSON.
  - A return value of `Null` indicates that the conversion failed.



### MD5 Calculation

`data.toMD5(str)`

- Parameters: 
  - str : `String` / `ByteBuffer`  
    The string or byte array from which to calculate the MD5 hash.
- Return value: The MD5 digest string of the original data.
- Return value type: `String`



### SHA1 Calculation

`data.toSHA1(str)`

- Parameters: 
  - str : `String` / `ByteBuffer`  
    The string or byte array from which to calculate the SHA1 hash.
- Return value: The SHA1 digest string of the original data.
- Return value type: `String`



### Data to Base64

`data.toBase64(str)`

- Parameter: 
  - str : `String` / `ByteBuffer`  
    The string or byte array to convert to Base64.
- Return value: The Base64 result.
- Return value type: `String`



### Base64 decode to data

`data.fromBase64(base64, isBinary)`

- Parameters: 
  - base64 : `String`  
    The Base64 string to decode.
  - isBinary : `Boolean`  
    Whether to return the decoded data as binary data. Defaults to false.
- Return value: The decoded data.
- Return value type: `String` or `ByteBuffer`


