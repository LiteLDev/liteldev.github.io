# 🎓 Packet API

The following objects and APIs provide a basic BDS packet interface for scripts.

Using these APIs requires knowledge of the Bedrock network protocol. If the client crashes, it is caused by a malformed packet structure, not a bug.

This documentation does not list packet IDs or structures; please look them up yourself.

## 目录

- 🔉 [Packet Object API](#-packet-object-api)
- 🔌 [Binary stream object API](#-binary-stream-object-api)

## 🔉 Packet Object API

In LSE, the 「Packet Object」 is used to get information about packets.

### Get a packet object

#### Get from API

Call a function that states **return packet object** to get a packet object provided by BDS.  
See [Binary Stream Objects](#-binary-stream-object-api) for details.

#### Create from packet ID

!!! warning
    The global aliases for this class are only available in 0.19.1 and later.

`Packet.createPacket(pktid[,raw])`  

- Parameters:
  - pktid : `Integer`
    Packet ID
  - raw : `Boolean` (Optional parameter)
    Whether to create a raw network packet. Defaults to `false`.
- Return value: Packet object
- Return value type: `Packet`

### Packet Objects - Functions

Every packet object provides member functions (methods) that operate on the packet. Given a packet object `pkt`, you can call the following functions on it:

#### Get packet name

`pkt.getName()`

- Return value: Packet name
- Return value type: `String`

#### Get packet ID

`pkt.getId()`

- Return value: Packet ID
- Return value type: `Integer`

#### Read binary stream data into packet

`pkt.read(bs)`

- Parameters:
  - bs : `BinaryStream`
    Source binary stream
- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Write packet data into binary stream

`pkt.write(bs)`

- Parameters:
  - bs : `BinaryStream`
    Target binary stream
- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Send packet to specified target

!!! warning
    This function is only available in 0.19.1 and later.

`pkt.sendTo(pos)`  
`pkt.sendTo(x,y,z,dimid)`  
`pkt.sendTo(target)`

- Parameters:

  - pos : `IntPos` / `FloatPos`  
    Target coordinates for sending the packet (or specify x, y, z, and dimid to set the target position)
  - target : `Player` / `Entity`  
    Target to send the packet to

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

If `target` is a `Player`, the packet is sent to that player.  
If `target` is an `Entity`, the packet is sent to players near that entity.

#### Send packet to all clients

!!! warning
    This function is only available in 0.19.1 and later.

`pkt.sendToClients()`

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Send packet to server

!!! warning
    This function is only available in 0.19.1 and later.

`pkt.sendToServer()`

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

## 🔌 Binary Stream Object API

### Create a binary stream object

[JavaScript] `new BinaryStream()`

[Lua] `BinaryStream()`

- Return value: Binary stream object
- Return value type: `BinaryStream`

### Binary Stream Object - Functions

Every binary stream object provides member functions (methods) that operate on the stream. Given a binary stream object `bs`, you can call the following functions on it:

#### Resetting binary streams

`bs.reset()`

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Reserve binary stream capacity

`bs.reserve(size)`

- Parameters:

  - size : `Integer`  
    Number of bytes to reserve

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Get binary stream read pointer

!!! warning
    This function is only available in 0.19.1 and later.

`bs.getReadPointer()`

- Return value: Current read pointer
- Return value type: `Integer`

#### Set binary stream read pointer

!!! warning
    This function is only available in 0.19.1 and later.

`bs.setReadPointer(pos)`

- Parameters:

  - pos : `Integer`  
    New read pointer

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Get binary stream data

!!! warning
    The optional parameter and `ByteBuffer` return value of this function are only available in 0.19.1 and later.

`bs.getData([release])`

- Parameters:

  - release : `Boolean` (Optional parameter)  
    Whether to clear the stream data after reading. Defaults to `false`.

- Return value: Binary stream data
- Return value type: `ByteBuffer`

Before 0.19.1, this function could only be called as `bs.getData()`.  
In those versions, it always cleared the stream data after reading and returned a `String`.

Because the old return value was a `String`, JavaScript may force UTF-8 encoding on it, corrupting the binary data.

#### Set binary stream data

!!! warning
    This function is only available in 0.19.1 and later.

`bs.setData(data)`

- Parameters:

  - data : `ByteBuffer`  
    Binary stream data

- Return value: Whether the operation succeeded
- Return value type: `Boolean`

#### Write to binary stream

`bs.writexxxx(value)`

- Parameters:

  - value : `Null`  
    See the table below. Some numeric write functions also accept a `String`.

- Return value: Whether the write succeeded.
- Return value type: `Boolean`

| Available functions            | Parameter Type       |
| ------------------------------ | -------------------- |
| writeBool                      | `Boolean` / `String` |
| writeByte                      | `Integer` / `String` |
| writeBytes (Added in 0.19.1)   | `ByteBuffer`         |
| writeDouble                    | `Number` / `String`  |
| writeFloat                     | `Float` / `String`   |
| writeSignedBigEndianInt        | `Number` / `String`  |
| writeSignedInt                 | `Number` / `String`  |
| writeSignedInt64               | `Number` / `String`  |
| writeSignedShort               | `Integer` / `String` |
| writeString                    | `String`             |
| writeUnsignedChar              | `Integer` / `String` |
| writeUnsignedInt               | `Number` / `String`  |
| writeUnsignedInt64             | `Number` / `String`  |
| writeUnsignedShort             | `Integer` / `String` |
| writeUnsignedVarInt            | `Number` / `String`  |
| writeUnsignedVarInt64          | `Number` / `String`  |
| writeVarInt                    | `Number` / `String`  |
| writeVarInt64                  | `Number` / `String`  |
| writeVec3                      | `FloatPos`           |
| writeBlockPos (Added in 0.9.5) | `IntPos`             |
| writeCompoundTag               | `NbtCompound`        |
| writeItem (Added in 0.9.5)     | `Item`               |
| writeUuid (Added in 0.19.1)    | `String`             |

#### Read from binary stream

!!! warning
    This function group is only available in 0.19.1 and later.

`bs.readxxxx([asString])`  
`bs.readBytes(length)`

- Parameters:

  - asString : `Boolean` (Optional parameter)
    Available only for numeric read functions. When set to `true`, the return value is converted to `String`.
  - length : `Integer`
    Available only for `readBytes`. The number of bytes to read. Must be greater than `0`.

- Return value:
  - Read result

| Available functions    | Parameter Type | Return Type         |
| ---------------------- | -------------- | ------------------- |
| readBool               | `Boolean`      | `Boolean` / `String` |
| readByte               | `Boolean`      | `Number` / `String` |
| readBytes              | `Integer`      | `ByteBuffer`        |
| readUnsignedChar       | `Boolean`      | `Number` / `String` |
| readDouble             | `Boolean`      | `Number` / `String` |
| readFloat              | `Boolean`      | `Number` / `String` |
| readSignedBigEndianInt | `Boolean`      | `Number` / `String` |
| readSignedInt          | `Boolean`      | `Number` / `String` |
| readSignedInt64        | `Boolean`      | `Number` / `String` |
| readSignedShort        | `Boolean`      | `Number` / `String` |
| readString             | None           | `String`            |
| readUnsignedInt        | `Boolean`      | `Number` / `String` |
| readUnsignedInt64      | `Boolean`      | `Number` / `String` |
| readUnsignedShort      | `Boolean`      | `Number` / `String` |
| readUnsignedVarInt     | `Boolean`      | `Number` / `String` |
| readUnsignedVarInt64   | `Boolean`      | `Number` / `String` |
| readVarInt             | `Boolean`      | `Number` / `String` |
| readVarInt64           | `Boolean`      | `Number` / `String` |

When `asString` is `true`, scalar `read*` functions return `String`.

#### Building packet from binary stream

!!! warning
    The optional parameter of this function is only available in 0.19.1 and later.

`bs.createPacket(pktid[,raw])`

- Parameters:

  - pktid : `Integer`  
    Packet ID.
  - raw : `Boolean` (Optional parameter)  
    Creates a raw network packet from the current binary stream data. Defaults to `false`.

- Return value: Packet object
- Return value type: `Packet`

Before 0.19.1, this function can only be called as `bs.createPacket(pktid)`.

### Dome Code

Send TextPacket packets to a player:

```js
mc.listen("onChat", (player, message) => {
  const text = "LLSE Packet Test";
  const bs = new BinaryStream();
  bs.reserve(text.length + 8);
  bs.writeBool(false);
  bs.writeByte(/* TextPacketPayload::mBody::MessageOnly (Variant Index) */0);
  bs.writeByte(/* TextPacketType::Raw (Enum) */0);
  bs.writeString(text);
  bs.writeString(""); // xuid
  bs.writeString(""); // platformId
  bs.writeString(""); // filtered message
  bs.createPacket(9).sendTo(player);
});
```
