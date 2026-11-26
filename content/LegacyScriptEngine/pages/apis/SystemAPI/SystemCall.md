# 📡 System Call API 

The following APIs provide interfaces for making system calls:

### Invoke the Shell to Execute the Specified System Command

`system.cmd(cmd,callback[,timeLimit])`

- Parameters:
  - cmd : `String`  
    The system command to execute.
  - callback : `Function`  
    The callback function invoked with the result after the system process ends.
  - timeLimit : `Integer`  
    (Optional) The maximum execution time for the command, in milliseconds.
    Defaults to `-1` (unlimited runtime).
- Return value: Whether the command started successfully.
- Return value type: `Boolean`

Note: The prototype for the callback function is `function(exitcode,output)`:

- exitcode : `Integer`    
  The process exit code.
- output : `String`  
  The combined contents of standard output and standard error.

Notice! This function executes a system command, not an MC command.
It runs asynchronously and returns immediately without waiting for the command to finish. Once the command completes, the engine automatically invokes the provided callback function with the result.



### Run the Specified Location Program

`system.newProcess(process,callback[,timeLimit])`

- Parameters:
  - process : `String`  
    The path to the program to run (including any command-line arguments).
  - callback : `Function`  
    The callback function invoked with the result after the program process ends.
  - timeLimit : `Integer`  
    (Optional) The maximum execution time for the program process, in milliseconds.  
    Defaults to `-1` (unlimited runtime).
- Return value: Whether the process started successfully.
- Return value type: `Boolean`

Note: The prototype for the callback function is `function(exitcode,output)`:

- exitcode : `Integer`    
  The process exit code.
- output : `String`  
  The combined contents of the program's standard output and standard error.

This function runs asynchronously and returns immediately without waiting for the command to finish. Once execution completes, the engine automatically invokes the provided callback function with the result.


