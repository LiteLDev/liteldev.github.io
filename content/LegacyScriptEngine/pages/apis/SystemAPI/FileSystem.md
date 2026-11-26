# 📂 Directory and File API 

These APIs let you manipulate files and directories on the file system.

> Note: All relative paths passed to these functions are resolved from the BDS root directory.

### Create Folder   

`File.createDir(dir)`  
`File.mkdir(dir)`

- Parameter: 
  - dir : `String`  
    Path to the destination folder.  
    Can create nested folders in a single call, without creating them one level at a time.
- Return value: Whether the folder or folders were created successfully.
- Return value type: `Boolean`



### Delete File/Folder  

`File.delete(path)`

- Parameter: 
  - path : `String`  
    Path to the target file or folder.
- Return value: Whether the deletion succeeded.
- Return value type: `Boolean`



### Check if a File/Folder Exists

`File.exists(path)`

- Parameter: 
  - path : `String`  
    Path to the target file or folder.
- Return value: Whether the target exists.
- Return value type: `Boolean`



### Copy Files/Folders to Specified Location 

`File.copy(from,to)`

- Parameters: 
  - from : `String`  
    Path to the source file or folder.

  - to : `String`  
    Destination path for the file or folder.
- Return value: Whether the copy succeeded.
- Return value type: `Boolean`



### Move File/Folder to Specified Location  

`File.move(from,to)`

- Parameters: 
  - from : `String`  
    Path to the source file or folder.

  - to : `String`  
    Destination path for the file or folder.
- Return value: Whether the copy succeeded.
- Return value type: `Boolean`



### Rename specified file/folder  

`File.rename(from,to)`

- Parameters: 
  - from : `String`  
    Current name of the file or folder.

  - to : `String`  
    New name of the file or folder.
- Return value: Whether the rename succeeded.
- Return value type: `Boolean`



### Get the Size of the Specified File

`File.getFileSize(path)`

- Parameter: 
  - path : `String`  
    Path to the target file.

- Return value: File size in bytes.
- Return value type: `Integer`

Returns `-1` if the specified path is a folder.



### Determine if the Specified Path Is a Folder

`File.checkIsDir(path)`

- Parameter: 
  - path : `String`  
    Path to check.
- Return value: Whether the target path is a folder.
- Return value type: `Boolean`

Also returns `false` if the target path does not exist.



### List All Files/Folders Under the Specified Folder

`File.getFilesList(dir)`

- Parameter: 
  - dir: `String`  
    Folder path.

- Return value: Array of file and folder names.
- Return value type: `Array<String,String,...>`


