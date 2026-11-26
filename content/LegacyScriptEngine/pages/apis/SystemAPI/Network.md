# 🌏 Web Interface API

The following APIs provide a basic network interface for scripts.
For more complex needs, use the network library of the respective language platform.

## Contents
- 🔌 [WebSocket Client Object API](#-websocket-client-object-api)
- 📡 [Http Server Object API](#-http-server-object-api)
  - [Http Request Object API](#http-request-object-api)
  - [Http Response Object API](#http-response-object-api)

### Send an Asynchronous HTTP(s) Get Request  

`network.httpGet(url[,header],callback)`

- Parameters:
  - url : `String`  
    The target address of the request (including any parameters attached to the GET request).
  - header : `Object`  
    (Optional) Request headers.
  - callback : `Function`  
    The callback function executed when the request returns, receiving the HTTP(s) response result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Note: The prototype of the callback parameter is `function(status,result)`  

- status : `Integer`    
  The returned HTTP(s) response code (for example, 200 means the request succeeded).
- result : `String`  
  The returned data.

If the request fails, the status value is `-1`. 



### Send an Asynchronous HTTP(s) Post Request  

`network.httpPost(url[,header],data,type,callback)`

- Parameters:
  - url : `String`  
    The destination address of the request.
  - header : `Object`  
    (Optional) Request headers.
  - data : `String`  
    The data to send.
  - type : `String`  
    The MIME type of the POST data, such as `text/plain` or `application/x-www-form-urlencoded`.
  - callback : `Function`  
    The callback function executed when the request returns, receiving the HTTP(s) response result.
- Return value: Whether the request was sent successfully.
- Return value type: `Boolean`

Note: The prototype of the callback parameter is `function(status,result)`  

- status : `Integer`    
  The returned HTTP(s) response code (for example, 200 means the request succeeded).
- result : `String`  
  The returned data.

If the request fails, the status value is `-1`.



### Send a Synchronous HTTP(s) Get Request

`network.httpGetSync(url)`

- Parameters:
  - url : `String`  
    The target address of the request (including any parameters attached to the GET request).
- Return value: The response, an object with the following members:
  - status : `Integer`  
    The returned HTTP(s) response code.
  - data : `String`  
    The returned data.
- Return value type: `Object`

This function blocks until the request returns, so prefer `network.httpGet` where you can.



## 🔌 WebSocket Client Object API

In LSE, use "WebSocket objects" to manage the connection and operations of a WebSocket client.

### Create a New WebSocket Client Object 

[JavaScript] `new WSClient()`  
[Lua] `WSClient()`

- Return value: A new WebSocket client object.
- Return value type: `WSClient`



### WebSocket Client Object - Properties

Every WS client object has a fixed set of properties. A client object `wsc` has the following properties:

| Attributes | Meaning                   | Data Type |
| ---------- | ------------------------- | --------- |
| wsc.status | Current Connection Status | `Enum`    |

These properties are read-only and cannot be modified.

The wsc.status enumeration has the following values:

`WSClient.Open` - Connected normally.  
`WSClient.Closing` - Disconnecting.  
`WSClient.Closed` - Not connected.



### WebSocket Client Object - Function

Every WS client object has member functions (methods) that you can call. For a client object `wsc`, you can perform operations on the client through the following functions.

#### Create a Connection

`wsc.connect(target)`

- Parameter: 
  - target : `String`  
    The destination address to connect to, in the form `ws://hostname[:port][/path/path][?query=value]`.
- Return value: Whether the connection succeeded.
- Return value type: `Boolean` 



#### Create a Connection Asynchronously

`wsc.connectAsync(target,callback)`

- Parameters: 
  - target : `String`  
    The destination address to connect to, in the form `ws://hostname[:port][/path/path][?query=value]`.
  - callback : `Function`
    The callback function executed when the connection succeeds or fails.
- Return value: Whether the connection attempt was started successfully.
- Return value type: `Boolean` 

Note: The prototype of the callback parameter is `function(success)`  

- success : `Boolean`    
  Whether the WebSocket connection succeeded.



#### Send Text/Binary Messages

`wsc.send(msg)`

- Parameter: 
  - msg : `String` / `ByteBuffer`  
    The text or binary data to send.
- Return value: Whether the message was sent successfully.
- Return value type: `Boolean` 

If the parameter type is `String`, the message is sent as text; if it is `ByteBuffer`, it is sent as binary data.



#### Listen for WebSocket Events 

While a WebSocket connection is active, incoming messages and errors need to be handled. Use the following interface to listen for events.

`wsc.listen(event,callback)`

- Parameters: 

  - event : `String`  
    The name of the event to listen for (see the list of events below).

  - callback : `Function`  
    The listener function to register (see below for its parameters).
    When the specified event occurs, LSE calls this function and passes the corresponding parameters.
- Return value: Whether the event listener was successfully registered.
- Return value type: `Boolean` 



#### List of Listening Events

**`"onTextReceived"` - Listen for string messages.**

- Listener function prototype
  `function(msg)`
- Parameter: 
  - msg : `String`  
    The received string message.

**`"onBinaryReceived"` - Listen for binary messages.**

- Listener function prototype 
  `function(data)`
- Parameter: 
  - data : `ByteBuffer`  
    The received binary message.

**`"onError"` - Listen for errors.**

- Listener function prototype 
  `function(msg)`
- Parameter: 
  - msg : `String`  
    The error message.

**`"onLostConnection"` - Listen for lost connections.**

- Listener function prototype 
  `function(code)`
- Parameter: 
  - code : `Integer`  
    The error code.



#### Close the Connection

`wsc.close()`

- Return value: Whether the connection was successfully closed.
- Return value type: `Boolean` 

Do not use this client object while the connection is closed!



#### Force Disconnect

`wsc.shutdown()`

- Return value: Whether the connection was successfully disconnected.
- Return value type: `Boolean` 

Do not use this client object while it is disconnected!



#### Get Error Code

`wsc.errorCode()`

- Return value: The error code from the last error.
- Return value type: `Integer`

If any of the interfaces above fail, call this method to get the last error code.

## 📡 Http Server Object API

LSE provides a simple HTTP server suitable for web services with **a small amount of data transfer**, such as webhooks.  
To build a full website, use established web server software such as Apache or Nginx instead.

### Create a New Server Object

[JavaScript]  `new HttpServer()`  
[Lua] `HttpServer()`

- Return value: A new server object.
- Return value type: `HttpServer`



### Listen for Get Requests

`svr.onGet(path, callback)`

- Parameters:
  - path : `String`  
    The request path. Starts with `/` and can include regular expressions, such as `/test/(.+)`.
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    The callback function invoked when a GET request matching the path is received.
- Return value: The server object (for method chaining).
- Return value type: `HttpServer`



### Listen for Put Requests

`svr.onPut(path, callback)`

- Parameters:
  - path : `String`  
    The request path. Starts with `/` and can include regular expressions, such as `/test/(.+)`.
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    The callback function invoked when a PUT request matching the path is received.
- Return value: The server object (for method chaining).
- Return value type: `HttpServer`



### Listen for Post Requests

`svr.onPost(path, callback)`

- Parameters:
  - path : `String`  
    The request path. Starts with `/` and can include regular expressions, such as `/test/(.+)`.
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    The callback function invoked when a POST request matching the path is received.
- Return value: The server object (for method chaining).
- Return value type: `HttpServer`



### Listen for Patch Requests

`svr.onPatch(path, callback)`

- Parameters:
  - path : `String`  
    The request path. Starts with `/` and can include regular expressions, such as `/test/(.+)`.
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    The callback function invoked when a PATCH request matching the path is received.
- Return value: The server object (for method chaining).
- Return value type: `HttpServer`



### Listen for Delete Requests

`svr.onDelete(path, callback)`

- Parameters:
  - path : `String`  
    The request path. Starts with `/` and can include regular expressions, such as `/test/(.+)`.
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    The callback function invoked when a DELETE request matching the path is received.
- Return value: The server object (for method chaining).
- Return value type: `HttpServer`



### Listen for Options Requests

`svr.onOptions(path, callback)`

- Parameters:
  - path : `String`  
    The request path. Starts with `/` and can include regular expressions, such as `/test/(.+)`.
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    The callback function invoked when an OPTIONS request matching the path is received.
- Return value: The server object (for method chaining).
- Return value type: `HttpServer`



### Listening for Requests - Notes

Note that request listeners have priorities.  
If multiple paths match the regular expression at the same time, the one defined first is chosen.  
For example:  
```js
svr.onGet('/test/123', (req, res) => {
  res.write('test');
}).onGet('/test/(.+)', (req, res) => {
  res.write('get /test/');
}).onGet('/test/foo', (req, res) => {
  res.write("bar");
});
// A request to /test/123 calls the first callback; a request to /test/foo calls the second callback (even though the path of the third callback is a closer match)
```

### Listen for the PreRouting Event

`svr.onPreRouting(callback)`

- Parameters:
  - callback : `Function<bool(HttpRequest, HttpResponse)>`  
    Callback function called when a request is received. You can modify the response inside the callback. If it returns `false`, the request will not be routed to the callback for the corresponding path (though the PostRouting event is still triggered).
- Return value: The server object (for chaining other operations).
- Return value type: `HttpServer`



### Listen for the PostRouting Event

`svr.onPostRouting(callback)`

- Parameters:
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    Callback function called after the callback for the corresponding path (or the PreRouting event) finishes. You can modify the response inside the callback.
- Return value: The server object (for chaining other operations).
- Return value type: `HttpServer`



### Listen for the Error Event

`svr.onError(callback)`

- Parameters:
  - callback : `Function<(HttpRequest, HttpResponse)>`  
    Callback function called on errors (status code >= 400).
- Return value: The server object (for chaining other operations).
- Return value type: `HttpServer`



### Listen for the Exception Event

`svr.onException(callback)`

- Parameters:
  - callback : `Function<(HttpRequest, HttpResponse, String)>`  
    Callback function called when an exception is thrown in a handler. The third parameter is the exception message.
- Return value: The server object (for chaining other operations).
- Return value type: `HttpServer`



### Listen on a Port and Start the Server

`svr.listen([addr,] port)`
`svr.startAt([addr,] port)`

- Parameters:
  - addr : `String`  
    (Optional) The address to listen on. Can be an IP address or a domain name. Defaults to `127.0.0.1`.
  - port : `Integer`  
    The port to listen on.
- Return value: The server object (for chaining other operations).
- Return value type: `HttpServer`



### Stop the Server

`svr.stop()`
`svr.close()`

- Return value: None



### Get Whether the Server Is Running

`svr.isRunning()`

- Return value: Whether the server is running.
- Return value type: `Boolean`



## Http Request Object API

### Http Request Object - Properties
| Attribute        | Meaning                                  | Data Type | Example                     |
| ---------------- | ---------------------------------------- | --------- | --------------------------- |
| `req.method`     | Request method                           | `String`  | `'GET'`                     |
| `req.path`       | Request path                             | `String`  | `'/233'`                    |
| `req.query`      | Request query parameters                 | `Object`  | `{a: 'b', c: ['d', 'e']}`   |
| `req.params`     | Request query parameters (same as above) | `Object`  | `{a: 'b', c: ['d', 'e']}`   |
| `req.headers`    | Request headers                          | `Object`  | `{a: ['b'], c: ['d', 'e']}` |
| `req.body`       | Request body                             | `String`  | `'awa'`                     |
| `req.remoteAddr` | Source address of the request            | `String`  | `'114.51.41.91'`            |
| `req.remotePort` | Source port of the request               | `Integer` | `11451`                     |
| `req.version`    | Request version                          | `String`  | `'HTTP/1.1'`                |
| `req.matches`    | Regex match results of the request path  | `Array`   | `['/test11', '11']`         |

These object properties are read-only and cannot be modified. They can only be used inside the request callback (copying them outside works in theory, but is not recommended).  

***Note:***
1. **`req.matches[0]` is the original text; the elements after it are the match results**
2. **`req.headers["Name"]` is an array, not a string**

***More examples:***
1. `?k=v1&k=v2&k1=v1` => `{k: ['v1', 'v2'], k1: 'v1'}`
2. `/test/(.+)/(.+)` => `/test/ll/233` => `['/test/ll/233', 'll', '233']`



### Get the Value of a Request Header

`req.getHeader(name)`

- Parameters:
  - name : `String`  
    The name of the request header.
- Return value: An array of values for the request header (or an empty array `[]` if the request does not have this header).
- Return value type: `Array<String>`



## Http Response Object API

### Http Response Object - Properties
| Attribute     | Meaning              | Data Type | Example                     |
| ------------- | -------------------- | --------- | --------------------------- |
| `res.status`  | Response status code | `Integer` | `200`                       |
| `res.headers` | Response headers     | `Object`  | `{a: ['b'], c: ['d', 'e']}` |
| `res.body`    | Response body        | `String`  | `'awa'`                     |
| `res.version` | Response version     | `String`  | `'HTTP/1.1'`                |
| `res.reason`  | Reason phrase        | `String`  | `'OK'`                      |

These properties can and should be modified, but changes take effect only inside the callback.



### Get the Value of a Response Header

`res.getHeader(name)`

- Parameters:
  - name : `String`  
    The name of the response header.
- Return value: An array of values for the response header (or an empty array `[]` if the header does not exist).
- Return value type: `Array<String>`



### Set the Value of a Response Header

`res.setHeader(name, value)`

- Parameters:
  - name : `String`  
    The name of the response header.
  - value : `Any type`  
    The value of the response header.
- Return value: The modified response object.
- Return value type: `HttpResponse`



### Write the Response Body

`res.write(content1, content2, ...)`

- Parameters:
  - content : `Any type`  
    Response content.
- Return value: The modified response object.
- Return value type: `HttpResponse`
- Note: This function is currently equivalent to `res.body += content1 + content2 + ...`.



## Http API Example

```js
let server = new HttpServer();
server.onGet("/hello(.+)", (req, resp) => {
	logger.info("http_server_test: run: onGet: Received a request from ", req.remoteAddr, 
				':', req.remotePort, " for ", req.path);
	resp.write("<html><body>")
		.write("<h1>It works!</h1>")
		.write("<br/>")
		.write("<p>Request Headers: ", JSON.stringify(req.headers, null, 4), "</p>")
		.write("<p>Request Body: ", req.body, "</p>")
		.write("<p>Your Address: ", req.remoteAddr, ':', req.remotePort, "</p>")
		.write("<p>HTTP Version: ", req.version, "</p>")
		.write("<p>Method: ", req.method, "</p>")
		.write("<p>Path: ", req.path, "</p>")
		.write("<p>Parsed Query: ", JSON.stringify(req.query, null, 4), "</p>")
		.write("<p>Path Regex Matches: ", JSON.stringify(req.matches), "</p>")
		.write("</body></html>")
	resp.status = 200;
	resp.reason = "OK";
	resp.setHeader("Content-Type", "text/html");
}).onGet("/404", (req, resp) => {
	resp.status = 404;
	resp.reason = "Not Found";
	resp.write("Not Found");
}).onGet("/test-redirect", (req, resp) => {
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
	resp.status = 301;
	resp.reason = "Moved Permanently";
	resp.setHeader("Location", "https://github.com");
}).onGet("/(.+)", (req, resp) => {
	resp.write("Hello World! ", req.matches);
}).onPreRouting((req, resp) => {
	logger.info("http_server_test: run: onPreRouting: resp.body.length: ", resp.body.length);
	if (req.path == "/test-prerouting") {
		resp.body = "Hello World!";
		resp.status = 200;
		resp.reason = "OK";
		return false;
	}
}).onPostRouting((req, resp) => {
	logger.info("http_server_test: run: onPostRouting: resp.body.length: ", resp.body.length);
}).onError((req, resp) => {
	resp.write("\nonError called");
}).listen(this.listen_address, this.listen_port);
logger.info("http_server_test: run: Server listening on " + this.listen_address + ":" + this.listen_port);
```
