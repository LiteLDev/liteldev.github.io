# A server in Docker

By the end of this tutorial, you will have a Bedrock Dedicated Server with LeviLamina running in a Docker container, with its world stored in a Docker volume, and you will know how to reach its console, add mods, and stop it cleanly. The container installs everything itself on its first start: you need neither `lip` nor Wine on the host.

There are two images, both from [LiteLDev/docker-levilamina-server](https://github.com/LiteLDev/docker-levilamina-server):

| Image | Runs on | How |
| --- | --- | --- |
| `ghcr.io/liteldev/levilamina-server:latest-wine` | Linux containers: a Linux x64 host, or Docker Desktop | `lip` runs natively and runs the Windows server under a Wine installation it sets up itself |
| `ghcr.io/liteldev/levilamina-server:latest-windows` | Windows containers: Windows Server, or Docker Desktop switched to Windows containers | Runs the Windows server directly |

This tutorial uses the Wine image. For the Windows image, see the tip at the end of step 2.

## What you need

- Docker: Docker Engine on Linux, or Docker Desktop on Windows and macOS. `docker version` must return both a client and a server version.
- A host with an x64 processor.
- An internet connection. The container downloads the game from minecraft.net and LeviLamina from GitHub.

## 1. Start the container

1. Run:

   ```shell
   docker run -d -it --name levilamina -e EULA=TRUE -p 19132:19132/udp -p 19132:19132/tcp -v levilamina-server-data:/data ghcr.io/liteldev/levilamina-server:latest-wine
   ```

   What the options do:

   - `-d -it`: run in the background, with an interactive console you can attach to later.
   - `--name levilamina`: the container name used by the following commands.
   - `-e EULA=TRUE`: accept the [Minecraft End User License Agreement](https://www.minecraft.net/eula). Without this, the container stops immediately.
   - `-p 19132:19132/udp -p 19132:19132/tcp`: publish the server port on both protocols.
   - `-v levilamina-server-data:/data`: store the server, its world, and its settings in the `levilamina-server-data` volume so they survive if the container is removed.

2. Follow the container logs:

   ```shell
   docker logs -f levilamina
   ```

   On the first start, `lip` installs everything into the volume: Wine and the Visual C++ runtime, then the game, LeviLamina, and any mods listed in `PACKAGES`. It then starts the server. This takes several minutes; subsequent starts take seconds. You should eventually see `Server started.` Press `Ctrl+C` to stop following the log; the server keeps running.

::: tip Slow downloads from GitHub
Add `-e GITHUB_MIRROR_URL=<address of a GitHub mirror>` to the `docker run` command, for example `-e GITHUB_MIRROR_URL=https://v4.gh-proxy.org/https://github.com/`.
:::

## 2. Use the console

1. Attach to the server:

   ```shell
   docker attach levilamina
   ```

2. Type a server command without a leading `/` and press `Enter`:

   ```text
   list
   ```

   You should see `There are 0/10 players online:`.

3. Detach without stopping the server: press `Ctrl+P`, then `Ctrl+Q`.

::: tip The Windows image
On a Windows container host, use `ghcr.io/liteldev/levilamina-server:latest-windows` and mount the volume at `C:\data`: `-v levilamina-server-data:C:\data`. Everything else in this tutorial is the same.
:::

## 3. Add mods

When setting up the server on its first start, the container installs the space-separated packages listed in the `PACKAGES` variable. Any mod in the [LeviMC Mods](https://levimc.org/mods/) catalog works; use the package name shown after `lip install` on the mod's page.

To start a new server with mods, add the variable to the `docker run` command from step 1:

```shell
-e PACKAGES="github.com/LiteLDev/LeviOptimize github.com/LiteLDev/LegacyScriptEngine#lua"
```

::: details Add a mod to a server that is already set up
`PACKAGES` is read only on the first start. To add a mod later, run `lip` inside the running container:

```shell
docker exec -it levilamina lip install github.com/LiteLDev/LeviOptimize
```

The server loads the mod the next time it starts: stop and restart the container as shown in step 4. `docker logs levilamina` should then show `[LeviLamina]` loading the mod.
:::

## 4. Stop and start the server

1. Stop the container:

   ```shell
   docker stop -t 60 levilamina
   ```

   `lip` sends `stop` to the server, which saves the world and exits; the container then stops with it. `docker logs levilamina` should end with `Quit correctly`. Typing `stop` in the console (`docker attach levilamina`) does the same.
2. Start it again later:

   ```shell
   docker start levilamina
   ```

   Subsequent starts are quick because the server is already set up in the volume.

`-t 60` gives the server up to a minute to save a large world before Docker kills it; without this option, Docker waits only 10 seconds. The Compose files set the same one-minute timeout (`stop_grace_period`).

## With Docker Compose

Instead of using `docker run`, download [wine/compose.yaml](https://github.com/LiteLDev/docker-levilamina-server/blob/main/wine/compose.yaml) (or [windows/compose.yaml](https://github.com/LiteLDev/docker-levilamina-server/blob/main/windows/compose.yaml)) into an empty folder and run `docker compose up -d` there. It configures the same EULA, ports, and volume. Add variables such as `PACKAGES` under `environment:`. Use `docker compose logs -f` to follow the log, and `docker compose attach levilamina-server` to open the console.

## Settings of the container

| Variable | Default | Meaning |
| --- | --- | --- |
| `EULA` | | Must be `TRUE`. |
| `VERSION` | `LATEST` | The LeviLamina version to install, such as `26.60.7`. This also determines the game version. |
| `PACKAGES` | | Space-separated list of packages to install on first start. |
| `GITHUB_MIRROR_URL` | | A GitHub mirror for downloads. |
| `TZ` | `UTC` | The time zone used for log timestamps. |
| `LANG`, `LC_ALL` | | The locale in the container, such as `en_US.UTF-8` (the Wine image includes every locale). |
| `WINEDEBUG` | `-all` | Wine debug output (Wine image only). |

## What you have now

- A `levilamina` container running a LeviLamina server on port 19132.
- A `levilamina-server-data` volume that stores the server, its world, and its settings, and persists even if the container is removed.

## Next steps

- Choose mods: [Install mods on your server](install-mods.md) explains package names and variants.
- Let other players connect from outside your network: [Let friends join your server](let-friends-join.md).
- Run a server without Docker: [Your first server](first-server.md) or [A server from the command line](command-line.md).
- Package names, versions, and refs accepted by `PACKAGES`: [Managing packages](https://levimc.org/lip/guides/managing_packages.html).
- Images, Dockerfiles, and changelog: [LiteLDev/docker-levilamina-server](https://github.com/LiteLDev/docker-levilamina-server).
- If something goes wrong: [LeviLamina troubleshooting](https://levimc.org/faq/server/levilamina/errors/).
