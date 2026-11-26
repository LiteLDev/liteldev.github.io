# Let friends join your server

By the end of this tutorial, a friend will be able to join your server—first from another device on your home network, and then over the internet, whether your router has a public IP address, your provider restricts you to certain ports, or you have no public IP at all and use a tunnel such as frp.

## What you need

- A working LeviLamina server: see [Your first server](first-server.md).
- A second device running the same version of Minecraft Bedrock Edition as the server, for testing.
- For play over the internet: access to your router's settings, or to the control panel of your host or tunnel provider.

## How the server listens

Two settings in `server.properties`, in the server folder, control which ports to open:

| Setting | Default | Protocol | Used for |
| --- | --- | --- | --- |
| `server-port` | `19132` | TCP and UDP | Joining the server |
| `server-udp-ports` | `19132` | UDP | Game traffic for NetherNet, Bedrock's newer network transport |

With the defaults, the rule is simple: **open port 19132, for both TCP and UDP.** The `transport` setting controls which transport the server uses. `server-udp-ports` and LeviLamina's NetherNet patch in steps 5 and 6 apply only when it is set to `nethernet`; with RakNet, the server uses `server-port` alone.

To change `server.properties`, stop the server first, then edit the file in a text editor or on the **Game Config** page in `lip`.

## 1. Find the address of the server

On the PC running the server, open a terminal:

::: code-group

```powershell [Windows]
ipconfig
```

```shell [Linux]
hostname -I
```

```shell [macOS]
ipconfig getifaddr en0
```

:::

Note the IPv4 address of your network adapter, such as `192.168.1.20`. This is the server's address on your home network.

## 2. Open the firewall

The first time the server starts on Windows, Windows Defender Firewall may ask for permission. Allow it on **private networks**.

If you missed the prompt, or if another firewall is blocking the port, open it manually. In PowerShell (run as administrator):

```powershell
New-NetFirewallRule -DisplayName "Minecraft server (UDP)" -Direction Inbound -Protocol UDP -LocalPort 19132 -Action Allow
New-NetFirewallRule -DisplayName "Minecraft server (TCP)" -Direction Inbound -Protocol TCP -LocalPort 19132 -Action Allow
```

On Linux with ufw: `sudo ufw allow 19132`.

## 3. Join from your home network

1. Start the server and wait for `Server started.`
2. On the second device, open Minecraft and go to **Play**, then **Servers**, then **Add Server**. Enter any name, the address from step 1 (`192.168.1.20`), and port `19132`, then save.
3. Join the server. You should spawn in the world, and running `list` in the server console should show your name.

On the same network, the server may also appear under **Friends** as a LAN game.

::: tip The allowlist
If `allow-list` is set to `true` in `server.properties`, only players on the allowlist can join. Add your friends with the server command `allowlist add <gamertag>`, or on the **Allowlist** tab of the **Game Config** page in `lip`.
:::

## 4. Join over the internet: a router with a public IP

This is the usual setup at home.

1. Give the server PC a fixed address on your network so the port forwarding rule below continues to point to it. Most routers call this a DHCP reservation.
2. In your router's settings, add a **port forwarding** rule: forward external port `19132` to `192.168.1.20`, port `19132`, for **TCP and UDP**.
3. Find your public IP address on your router's status page.
4. Test from outside your network—for example, from a phone on mobile data—by adding a server with your public IP and port `19132`. Many routers cannot reach their own public address from inside the network, so testing from home may fail even when everything is working.
5. Share the public IP and port with your friends.

If the public IP on your router's status page differs from what websites report, or starts with `100.64` through `100.127`, you do not have your own public IP: skip to step 6.

## 5. When the provider decides the ports

On a rented machine or a host behind NAT, the provider usually maps an external port of its choice to your machine. Suppose it assigns you port `11451`.

1. Stop the server. In `server.properties`, set both ports to the assigned port:

   ```properties
   server-port=11451
   server-udp-ports=11451
   ```

2. In the provider's control panel, map external port `11451` to port `11451` on your machine for **TCP and UDP**, and open the port in your firewall as in step 2.
3. Start the server and connect using the provider's public IP and port `11451`.

::: warning The client fails with the error code "Door"
LeviLamina discovers the server's public IP through STUN servers. If that fails, clients cannot connect and show the error code `Door`. In that case, specify the server's public address manually in the form `<public IP>:<external port>:<local port>`:

```properties
server-udp-ports=203.0.113.4:11451:11451
```

Then disable LeviLamina's NetherNet patch in `mods/LeviLamina/config/Config.json`, under `targeted`:

```json
"netherNetPatch": {
    "enable": false,
    "stunServers": ["stun:stun.l.google.com:19302", "stun:stun.miwifi.com:3478"]
}
```
:::

## 6. Without a public IP: a tunnel

When your connection has no public IP, a tunnel such as frp forwards a port from a machine that has one—the **exit node**—to your server. Say the tunnel gives you port `11451` on the exit node `203.0.113.4`.

1. Stop the server. In `server.properties`, set:

   ```properties
   server-port=11451
   server-udp-ports=203.0.113.4:11451:11451
   ```

2. In the tunnel software, forward port `11451` on the exit node to port `11451` on your machine for **TCP and UDP**.
3. Turn off the NetherNet patch in `mods/LeviLamina/config/Config.json` as shown in the warning in step 5.
4. Start the server, then connect using `203.0.113.4` and port `11451`.

## What you have now

- A server that players on your network can join using its local address, and players on the internet can join using your public or tunnel address.
- The settings that control this: `server-port` and `server-udp-ports`, plus LeviLamina's NetherNet patch for servers behind NAT.

## Next steps

- Give your players something to do: [Install mods on your server](install-mods.md).
- Change the server name, game mode, allowlist, and permissions: [Game Config](https://levimc.org/lip/interface/game_config.html).
- Keep the server running without a terminal: [A server from the command line](command-line.md#_4-keep-it-running-without-a-terminal).
- Look up LeviLamina error codes: [Troubleshooting](https://levimc.org/faq/server/levilamina/errors/).
