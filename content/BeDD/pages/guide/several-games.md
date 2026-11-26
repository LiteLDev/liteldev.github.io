# Several games at once

Each game gets its own clone (~90 MB, created in seconds) and WebSocket; a run that needs a [server](/guide/modes) starts its own.

<video controls muted playsinline preload="none" poster="/BeDD/showcase/desktop-poster.webp" src="/BeDD/showcase/desktop.mp4" width="1280" height="720" style="width:100%;height:auto"></video>

```powershell
BeDD.exe launch --slot 2 --json
BeDD.exe launch --slot 3 --json
BeDD.exe ps
```

## Slots and clones

Slot N maps to the clone `<gameVersion>-<N>` ([Clones](/guide/installs#clones)). Even slot 1 uses a clone; the base never runs. There is no upper limit. Give each parallel run (such as a worktree or CI job) its own slot, because one slot means one shared clone and its worlds.

## Rules for parallel runs

- Find your game by its **instance** (`ps --json`, `run\<pid>.json`), never by the process name `Minecraft.Windows`, and close it with `BeDD.exe stop --pid <pid>`.
- Start games only with `BeDD.exe launch` (otherwise your normal profile's data is used).
- After restoring a test world, run `BeDD.exe world singleplayer <instance> [<world folder>]`: all games share one online sign-in, so running multiplayer worlds at the same time fails with "Blaze".
- For runs that join a server online, use `launch --exclusive-signaling`. Normally, every game holds a shared signaling lock (`locks`) for its lifetime; with this flag, the game waits for all other games to close and holds the lock alone. Because the game process itself holds the lock, a crashed script does not leak it.

## The manager window

Games appear only inside the manager window—they run off-screen, have no taskbar button, and do not show up in Alt+Tab—and the manager window itself never takes focus. Double-click `BeDD.exe` to open it, or let `launch` open it automatically; later runs reuse the same window.

![Look at the title bars: only the terminal is active](/showcase/desktop-poster.webp)

- Each game pane shows a live picture, `--label`, the instance, the pid, and input activity. Double-click a game's title to show only that game. Right-click to control it, play its sound, close it, open `latest.log` or the instance folder, or copy the WebSocket URL.
- Click a game's picture to **control it**, just as in a virtual machine: keyboard, mouse, scroll wheel, and camera input all go to that game, the pointer stays inside the picture, and the Windows key and Alt+Tab are sent to the game as well. Press **Ctrl+Left Alt** (AltGr still types) or switch to another window to release them. Meanwhile, Alt+F4 does nothing.
- **Play its sound on this PC** (in the right-click menu) routes that game's sound to the speakers until you uncheck the option or close the window. Otherwise, games are silent.
- Closing the manager window (which asks first) or killing it closes every game.
- CLI: `BeDD.exe ps`, `stop --pid <pid>`, `manager status`, and `manager stop --yes` (closes all games without asking).

A game that has no manager attached within 30 s, or that loses its manager, closes automatically (logging the reason in `latest.log`). For headless CI, set `manager=false` in the config ([Configuration](/guide/configuration#keys)); the game stays hidden and never closes itself, so stop it with `BeDD.exe stop`.
