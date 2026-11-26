#  📱 Device Information Object API

In LSE, the "device information object" is used to access and manipulate information about a player's game device.

### Get a Device Info Object

#### Acquired by the Player

Use the player object's `.getDevice` member function to get the **device information object** for that player.
See [Player Object API](Player.md).

> Note: Do not store a device information object **long-term.**
> When the player leaves the game, the corresponding object becomes invalid. If you need to work with an object over a long period, retrieve the current device information object using the method above.




### Device Information Object - Properties

Every device information object has a fixed set of properties. A specific entity object `dv` has the following properties:

| Property          | Description                                   | Data Type  |
| ----------------- | --------------------------------------------- | ---------- |
| dv.ip             | IP address of the player's device             | `String`   |
| dv.avgPing        | Player's average network latency (ms)         | `Integer`  |
| dv.avgPacketLoss  | Player's average network packet loss rate (%) | `Float`    |
| dv.lastPing       | Player's network latency (ms)                 | `Integer`  |
| dv.lastPacketLoss | Player's network packet loss rate (%)         | `Float`    |
| dv.os             | OS type of the player's device                | `String`   |
| dv.inputMode      | Player's input mode                           | `Integer`  |
| dv.serverAddress  | Player's connection address                   | `String`   |
| dv.clientId       | ID of the player client                       | `String`   |

These object properties are read-only and cannot be modified.

The operating system type property returns a string identifying the operating system of the player's device. The possible return values are:

| dv.os                    | Device Operating System                       |
| ------------------------ | --------------------------------------------- |
| `Google`                 | Google Android (Mobile phone)                 |
| `IOS`                    | Apple iOS (Mobile phone) or iPadOS            |
| `Osx`                    | Apple macOS (Computer)                        |
| `Amazon`                 | Amazon FireOS                                 |
| `GearVRDeprecated`       | Samsung GearVR (deprecated)                   |
| `UwpDeprecated`          | Microsoft Windows, UWP (Computer, deprecated) |
| `Win32`                  | Microsoft Windows (Computer)                  |
| `Dedicated`              | Dedicated server                              |
| `TvOSDeprecated`         | Apple tvOS (deprecated)                       |
| `Sony`                   | Sony PlayStation Host                         |
| `Nintendo`               | Nintendo Switch Host                          |
| `Xbox`                   | Microsoft Xbox Host                           |
| `WindowsPhoneDeprecated` | Windows Mobile (deprecated)                   |
| `Linux`                  | Linux                                         |
| `Unknown`                | Unknown System                                |

| Input mode ENUM                        |
| -------------------------------------- |
| `InputMode.Undefined`                  |
| `InputMode.Mouse`                      |
| `InputMode.Touch`                      |
| `InputMode.GamePad`                    |
| `InputMode.MotionControllerDeprecated` |
