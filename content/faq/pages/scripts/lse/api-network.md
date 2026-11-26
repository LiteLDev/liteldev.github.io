# LegacyScriptEngine API: network and system

## How can an LSE plugin update itself automatically?

Check for updates periodically (for example by requesting version information with `network.httpGet`). When a new version is found, download it, overwrite the plugin's own file, and reload the plugin by running LeviLamina's reload command (such as `ll reload <plugin name>`) with `mc.runcmdEx`. Fetching code from the network on every load and running it with `eval` is not recommended.

*Applies to: LeviLamina + LSE current version*

## What should I pass to `writeVec3` in LSE's `BinaryStream`? Is it different from calling `writeFloat` three times?

`writeVec3` takes a `FloatPos`. It writes x, y, and z with `writeFloat` in turn, so it is equivalent to calling `writeFloat` three times.

## In an LSE JS script plugin, can I keep a joining player on the "Loading resources" screen with almost no packets sent, and decide whether to let them in only after a `Promise` resolves?

Script plugins cannot suspend a player's connection during login or resource loading, nor control which packets are sent. Event callbacks such as `onPreJoin` are synchronous: they must decide immediately whether to intercept the connection and cannot wait for a `Promise`. You need a C++ mod that hooks the network and login flow directly.

## How do I transfer a player between two Bedrock servers? Can data be shared between them?

The transfer itself is simple: in LSE, call `pl.transServer(ip, port)`; in a C++ mod, construct a `TransferPacket` from `<mc/network/packet/TransferPacket.h>` with the target IP and port, then send it with `player.sendNetworkPacket`. However, server data (including each plugin's data) is not shared automatically. You must synchronize it yourself using shared storage such as MySQL, files, or a WebSocket relay.

*Applies to: LSE / LeviLamina current version*
