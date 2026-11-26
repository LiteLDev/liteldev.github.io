# 📝 File API

> This API provides access to **underlying system functions**, such as working with the file system and accessing the network.

Interoperating with the underlying system interface is an important extension that makes plugin development much more flexible.

## 📝 Simple File Read and Write API

The following APIs provide a simple interface for occasional file reading and writing. 
LSE encapsulates file operations in the `File` class.
If you need to work with files frequently, use the file object API below for better performance.

> Note: All text operations use UTF-8 encoding.  

### Read in All the Contents of the File

!!! warning
    The optional parameter and `ByteBuffer` return value of this function are available only in 0.19.1 and later.

`File.readFrom(path[,isBinary])`

- Parameters: 
  - path : `String`  
    The path to the target file. Relative paths are resolved from the BDS root directory.
  - isBinary : `Boolean`  
    Whether to read in binary mode. Defaults to `false`.
- Return value: All data in the file.
- Return value type: `String` / `ByteBuffer`
  - Returns `Null` if the read fails.

If `isBinary` is `true`, this function returns a `ByteBuffer`; otherwise, it returns a `String`.

Before 0.19.1, this function could only be called as `File.readFrom(path)` and always returned a `String`.



### Write Content to the Specified File

`File.writeTo(path,text)`

- Parameters: 
  - path : `String`  
    The path to the target file. Relative paths are resolved from the BDS root directory.

  - text : `String` / `ByteBuffer`  
    The content to write to the file.

- Return value: Whether the write succeeded.

- Return value type: `Boolean`

> Note: If the file does not exist, it is created automatically. If it exists, it is **emptied** before writing.

!!! warning
    Passing a `ByteBuffer` is available only in 0.19.1 and later.



### Append a Line to the Specified File

`File.writeLine(path,text)`

- Parameters: 
  - path : `String`  
    The path to the target file. Relative paths are resolved from the BDS root directory.

  - text : `String`  
    The content to write to the file.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`



## 📋 File Object API

In LSE, "file objects" are used to read, write, and manipulate a specific file.

### Create a New File Object

[JavaScript] `new File(path,mode[,isBinary])`  
[Lua] `File(path,mode[,isBinary])`

- Parameters: 
  - path : `String`  
    The path to the file to open. 
  - mode : `Enum`  
    The file open mode.
  - isBinary : `Boolean`  
    (Optional) Whether to open the file in binary mode. Defaults to `false`.  
    In normal mode, newlines are converted to the local format during reading and writing. Opening the file in binary mode indicates that the file is not plain text and disables these automatic conversions.
- Return value: The opened file object.
- Return value type: `File`
  - Throws an exception if opening the file fails.

The following open modes are available:

| Open Mode         | Meaning                                                 |
| ----------------- | ------------------------------------------------------- |
| `file.ReadMode`   | Open file for reading                                   |
| `file.WriteMode`  | Open and overwrite file, or create new file for writing |
| `file.AppendMode` | Open and write at the end of the file                   |

When using `ReadMode` or `WriteMode`, you can use `seekTo` to move the file pointer manually.

> If the file at the given path already exists, it is opened directly; otherwise, a new file is created automatically. Any missing directories in the path are also created automatically.

After opening the file, you can read and write it using the file object interface described below. 




### File Object - Properties

Every file object has a fixed set of properties. A file object `fi` has the following properties:

| Attributes      | Meaning                    | Data Types |
| --------------- | -------------------------- | ---------- |
| fi.path         | Current File Path          | `String`   |
| fi.absolutePath | Absolute current file path | `String`   |
| fi.size         | Current file size          | `Integer`  |

These properties are read-only and cannot be modified.



### File Object - Function

Every file object provides member functions (methods) that you can call. For a file object `fi`, you can perform operations on the file using the following functions:

#### Synchronous Read and Write 

Be careful when using the synchronous read/write interface. If the file or the content being read or written is too large, the operation will take too long and may freeze the game.
For small amounts of content, use the synchronous interface for a simpler development experience.
For large amounts of content, use the asynchronous read/write interface described below.

##### Read Text/Binary Data From File

`fi.readSync(cnt)`

- Parameter: 
  - cnt : `Number`  
    Number of characters or bytes to read.
- Return value: The string content or binary data read from the file.
- Return value type: `String` / `ByteBuffer`
  - If the return value is `Null`, the read failed.

Starts reading from the current file pointer. Returns a `ByteBuffer` if the file was opened in binary mode; otherwise, returns a `String`.



##### Read a Line of Text From a File

`fi.readLineSync()`

- Return value: The string content read from the file.
- Return value type: `String`
  - If the return value is `Null`, the read failed.

> Note: You must handle the trailing newline character in the returned string yourself.



##### Read Everything From File

`fi.readAllSync()`

- Return value: The string content or binary data read from the file.
- Return value type: `String` / `ByteBuffer`
  - If the return value is `Null`, the read failed.

Reads from the current file pointer to the end of the file. 
Returns a `ByteBuffer` if the file was opened in binary mode; otherwise, returns a `String`.



##### Write Text/Binary Data to File 

`fi.writeSync(str)`

- Parameter: 
  - str : `String` / `ByteBuffer`  
    The data to write.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

If the file was opened in binary mode, the passed argument is written as binary bytes; otherwise, it is written as plain text.



##### Write a Line of Text to a File

`fi.writeLineSync(str)`

- Parameter: 
  - str : `String`  
    The `String` to write.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

This function automatically appends a newline character to the end of the string.



#### Asynchronous Read and Write

When reading or writing a large amount of data that takes a long time, use the asynchronous read/write interface to reduce the impact on the server.

##### Read Text/Binary Data From File (Async)

`fi.read(cnt,callback)`

- Parameters: 
  - cnt : `Number`  
    Number of characters or bytes to read.
  - callback : `Function`  
    Callback function that receives the result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Note: The prototype of the callback function is `function(result)`:

- result : `String` / `ByteBuffer`  
  The text or binary data read from the file.  
  If result is `Null`, the read failed.

Starts reading from the current file pointer. Returns a `ByteBuffer` if the file was opened in binary mode; otherwise, returns a `String`.



##### Read a Line of Text From a File (Async)

`fi.readLine(callback)`

- Parameter: 
  - callback : `Function`  
    Callback function that receives the result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Note: The prototype of the callback function is `function(result)`:

- result : `String`  
  The text read from the file.

> Note: You must handle the trailing newline character in the returned string yourself.



##### Read Everything From File (Async)

`fi.readAll(callback)`

- Parameter: 
  - callback : `Function`  
    Callback function that receives the result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Note: The prototype of the callback function is `function(result)`:

- result : `String` / `ByteBuffer`  
  The text or binary data read from the file.  
  If result is `Null`, the read failed.

Reads from the current file pointer to the end of the file. 
Returns a `ByteBuffer` if the file was opened in binary mode; otherwise, returns a `String`.



##### Write Text/Binary Data to File (Async)

`fi.write(str[,callback])`

- Parameters: 
  - str : `String` / `ByteBuffer`  
    The data to write.
  - callback : `Function`  
    (Optional) Callback function that receives the result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Pass a `ByteBuffer` if the file was opened in binary mode; otherwise, pass a `String`.

Note: The prototype of the callback function is `function(result)`:

- result : `Boolean`  
  Whether the write succeeded.



##### Write a Line of Text to a File (Async)

`fi.writeLine(str[,callback])`

- Parameters: 
  - str : `String`  
    The data to write.
  - callback : `Function`  
    (Optional) Callback function to receive the result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Note: The prototype of the callback function is `function(result)`:  

- result : `Boolean`  
  Whether the write succeeded.

> This function automatically appends a newline to the end of the string.



#### Other Common Interfaces  

In addition to the read and write interfaces above, several general interfaces are provided for manipulating file objects.

##### Move the File Pointer 

`fi.seekTo(pos,isRelative)`

- Parameters: 
  - pos : `Number`  
    The position to move the file pointer to.
  - isRelative : `Boolean`  
    Whether to move relative to the current file pointer position.
- Return value: Whether the move succeeded.
- Return value type: `Boolean`

If isRelative is `true`, pos is relative to the current position: a positive number moves backward, and a negative number moves forward.  
If isRelative is `false`, pos is relative to the beginning of the file (`0` or a positive number), or `-1` to move to the end of the file.



##### Set File Size

`fi.setSize(size)`

- Parameters: 
  - size : `Number`  
    The new file size.
- Return value: Whether the size was set successfully.
- Return value type: `Boolean`

The new size can be larger than the current file size.
If the new size is smaller than the current file size, the file is truncated.



##### Close File

`fi.close()`

- Return value: Whether the file was closed successfully.
- Return value type: `Boolean`

Once closed, the file cannot be used until it is opened again.



##### Whether the File Pointer Is at the End of the File 

`fi.isEOF()`

- Return value: Whether the file pointer is at the end of the file.
- Return value type: `Boolean`



##### Flush File Buffer 

`fi.flush()`

- Return value: Whether the flush succeeded.
- Return value type: `Boolean`



##### Get Error Code 

`fi.errorCode()`

- Return value: The error code generated by the last IO operation.
- Return value type: `Integer`

If any of the interfaces above fails, you can call this function to get the last error code.



##### Clear Error Status

`fi.clear()`

- Return value: Whether the error status was cleared successfully.
- Return value type: `Boolean`

If any of the interfaces above fails, call this function after getting the error code to clear the error status so that you can continue using the file object normally.

