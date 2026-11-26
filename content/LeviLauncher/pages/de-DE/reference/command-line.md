---
platforms: [windows]
---
# Befehlszeile

Ohne Argumente öffnet `LeviLauncher.exe` das Launcher-Fenster. Mit einem Befehl läuft das Programm im Terminal und beendet sich danach; die Befehle folgen dem Schema `<Nomen> <Verb>`:

```text
LeviLauncher.exe <command> [arguments] [flags]
```

Diese Seite führt alle Befehle von LeviLauncher 1.1.0 auf. `LeviLauncher.exe help <command>` zeigt die Optionen und Beispiele für einen Befehl an, `LeviLauncher.exe help` die Gesamtübersicht. Die Ausgabe der Befehlszeile ist auf Englisch.

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe play
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe world export "My World" -o D:\Backups
LeviLauncher.exe instance list --json
```

## Aus einer Shell ausführen

Da `LeviLauncher.exe` eine Fensteranwendung ist, warten Shells standardmäßig nicht auf das Programmende. Wenn die Eingabeaufforderung erst nach der Ausgabe zurückkehren soll oder du den Exit-Code brauchst:

- Verwende in cmd `start /wait LeviLauncher.exe ...` und lies danach `%ERRORLEVEL%` aus.
- Leite in PowerShell die Ausgabe weiter (`LeviLauncher.exe instance list | Out-String`) oder verwende `Start-Process -Wait -NoNewWindow`.

Ein Befehlszeilenaufruf öffnet kein Fenster und funktioniert auch, während das Launcher-Fenster geöffnet ist.

## Befehle

### Alltag

| Befehl | Beschreibung |
| --- | --- |
| `play [<instance>]` | Startet das Spiel und wartet, bis das Spielfenster erscheint (Alias für `launch`) |
| `install <version\|file>` | Lädt Minecraft herunter und installiert es als neue Instanz (= `instance create`) |
| `use [<instance>]` | Legt die Standardinstanz fest oder zeigt sie an |
| `stop [<instance>\|<pid>...]` | Beendet ein laufendes Minecraft (= `process stop`) |

### Eine Instanz verwalten

| Befehl | Was er tut |
| --- | --- |
| `instance list [<filter>]` | Listet die installierten Instanzen auf |
| `instance show [<instance>]` | Zeigt Einstellungen, Registrierung, Loader, Spieler und Inhaltszahlen einer Instanz (auch `instance <instance>`) |
| `instance create <version\|file>` | Lädt Minecraft herunter und installiert es als neue Instanz |
| `instance copy-data [<instance>] --from system\|<instance>` | Kopiert Spieldaten (Welten, Einstellungen) in eine Instanz mit eigenen Daten |
| `instance rename <instance> <new-name>` | Benennt eine Instanz um |
| `instance set [<instance>]` | Ändert Instanzeinstellungen (Konsole, Editor-Modus, eigene Daten, Argumente, Umgebung, Logo) |
| `instance remove <instance>...` | Löscht Instanzen samt Inhalt ihrer Ordner endgültig |
| `instance register [<instance>]` | Registriert diese Instanz unter Windows als das installierte Minecraft ihres Kanals |
| `instance unregister [<instance>]` | Hebt die Windows-Registrierung der Instanz auf (Spieldaten bleiben erhalten) |
| `instance shortcut [<instance>]` | Erstellt oder entfernt eine Desktop-Verknüpfung zum Starten der Instanz |
| `instance path [<instance>] [<kind>]` | Gibt einen Ordner einer Instanz aus (und öffnet ihn auf Wunsch) |
| `mod list [<filter>]` | Listet die Mods einer Instanz auf |
| `mod show <package>` | Zeigt einen Mod aus dem Katalog |
| `mod search [<words>]` | Durchsucht den LeviLamina-Mod-Katalog |
| `mod install <package[@version]>...` | Installiert, aktualisiert oder downgradet Mods aus dem Katalog |
| `mod update [<mod>...]` | Aktualisiert Katalog-Mods auf die neueste Version |
| `mod import <file>...` | Fügt Mods aus `.mcmod`-, `.zip`- oder `.dll`-Dateien hinzu |
| `mod set <mod>` | Ändert das Manifest eines Mods |
| `mod remove <mod>...` | Entfernt Mods aus einer Instanz |
| `mod enable <mod>... \| --all` | Aktiviert Mods |
| `mod disable <mod>... \| --all` | Deaktiviert Mods, ohne sie zu entfernen |
| `mod path [<mod>]` | Gibt den Ordner eines Mods oder das Mod-Verzeichnis der Instanz aus |
| `loader versions` | Listet die für eine Spielversion verfügbaren LeviLamina-Versionen auf |
| `loader install [<version>]` | Installiert LeviLamina in einer Instanz oder wechselt die Version |
| `loader remove` | Entfernt LeviLamina aus einer Instanz |
| `world list [<filter>]` | Listet die Welten einer Instanz und eines Spielers auf |
| `world import <file.mcworld>...` | Importiert Welten aus `.mcworld`-Dateien |
| `world export <world>...` | Exportiert (sichert) Welten als `.mcworld`-Dateien |
| `world copy <world>...` | Kopiert Welten in eine andere Instanz |
| `world rename <world> <new-name>` | Ändert den Anzeigenamen einer Welt |
| `world get <world> [<key>[/<sub>...]]` | Liest Welteinstellungen aus `level.dat` |
| `world set <world> <key>[/<sub>...]=<value>...` | Ändert Welteinstellungen in `level.dat` |
| `world remove <world>...` | Löscht Welten endgültig |
| `pack list [<filter>]` | Listet Ressourcen-, Verhaltens- und Skin-Pakete auf |
| `pack import <file.mcpack\|file.mcaddon>...` | Installiert Pakete und Add-ons aus `.mcpack`- und `.mcaddon`-Dateien |
| `pack copy <pack>... \| --all` | Kopiert Pakete in eine andere Instanz |
| `pack remove <pack>...` | Löscht installierte Pakete |
| `screenshot list` | Listet die Screenshots einer Instanz und eines Spielers auf (neueste zuerst) |
| `screenshot remove <name\|path>... \| --all` | Löscht Screenshots |
| `server list [<filter>]` | Listet die gespeicherten Server auf und prüft, ob sie online sind |
| `player list` | Listet die Spielerprofile einer GDK-Instanz auf |
| `backup list [<instance>]` | Listet Instanz- und Welt-Backups auf (Vorschau) |
| `backup create [<instance>]` | Sichert die Spieldaten und Mods einer Instanz (Vorschau) |
| `backup restore [<instance>] <archive.zip>` | Stellt ein Instanz-Backup wieder her (Vorschau) |

### Etwas zum Installieren finden

| Befehl | Was er tut |
| --- | --- |
| `installer search [<version>]` | Listet die installierbaren Minecraft-Builds auf |
| `installer download <version>` | Lädt das Installationspaket eines Builds herunter, ohne es zu installieren |
| `installer list` | Listet heruntergeladene Installationspakete auf, einschließlich unvollständiger Downloads |
| `installer remove <version\|file>...` | Löscht heruntergeladene Installationspakete, um Speicherplatz freizugeben |
| `installer mirrors <version>` | Misst die Download-Spiegel eines GDK-Builds |
| `curseforge search [<words>]` | Durchsucht CurseForge nach Welten, Add-ons, Paketen und Skins (Alias für das Nomen: `cf`) |
| `curseforge show <id>` | Zeigt ein CurseForge-Projekt |
| `curseforge categories` | Listet die CurseForge-Klassen und -Kategorien zum Filtern auf |
| `curseforge install <id>` | Lädt eine CurseForge-Datei herunter und importiert sie in eine Instanz |

### Dieser PC und der Launcher

| Befehl | Was er tut |
| --- | --- |
| `process list` | Listet laufende Minecraft-Prozesse auf, auch solche, die nicht vom Launcher gestartet wurden (Alias: `ps`) |
| `process stop [<instance>\|<pid>...]` | Beendet laufende Minecraft-Prozesse zwangsweise (der Fortschritt seit der letzten automatischen Speicherung geht verloren) |
| `account status` | Zeigt das angemeldete Microsoft-Konto und seine Editionen an |
| `account login` | Meldet ein Microsoft-Konto an oder wechselt das Konto |
| `account logout` | Entfernt das Microsoft-Konto aus dem Launcher |
| `config list` | Listet Launcher-Einstellungen und Ordner auf |
| `config get <key>` | Gibt den Wert einer Einstellung aus |
| `config set <key> <value>` | Ändert eine Einstellung |
| `config unset <key>` | Setzt eine Einstellung auf ihren Standardwert zurück |
| `cache clean [packages\|downloads\|partial]...` | Gibt durch Caches belegten Speicherplatz frei |
| `doctor [--fix [<fix>...]]` | Prüft die Voraussetzungen für Minecraft und Mods auf diesem PC; `--fix` behebt Probleme (`vcruntime`, `gameinput`, `loader-migration`, `developer-mode`) |
| `self-update` | Aktualisiert LeviLauncher selbst auf das neueste Release |
| `version` | Gibt Versionsinformationen aus |
| `help [<command>...]` | Zeigt die Hilfe zu jedem Befehl mit Beispielen an |

Für jedes `list`-Verb lässt sich auch `ls` verwenden, für jedes `remove`-Verb auch `rm`. Welche Einstellungen `config` liest und ändert, steht unter [Alle Einstellungen](./settings#command-line-keys).

### Versionen und Pakete

- `<version>` bei `install` und `installer` ist ein Build aus `installer search`: entweder exakt (`1.21.50.07`), als Präfix mit Punkten (`1.21.50` steht für das neueste `1.21.50.x`; `1.21.5` trifft darauf nicht zu) oder `latest`. `<file>` ist eine lokale Datei mit der Endung `.msixvc`, `.appx`, `.msix`, `.appxbundle` oder `.msixbundle`.
- `<package>` bei `mod install` ist `owner/repo`, `github.com/owner/repo` oder eine URL, optional ergänzt um `#variant` und `@version`.

## Globale Optionen

Diese Optionen funktionieren mit jedem Befehl:

| Option | Bedeutung |
| --- | --- |
| `-i`, `--instance <name>` | Die Instanz, auf die sich der Befehl bezieht |
| `-p`, `--player <id\|gamertag>` | Das Spielerprofil (bei GDK-Instanzen) |
| `--json` | Maschinenlesbare Ausgabe auf stdout |
| `-q`, `--quiet` | Nur Bezeichner ausgeben; kein Fortschritt und keine Hinweise |
| `-v`, `--verbose` | Mehr Details und das Launcher-Protokoll auf stderr ausgeben |
| `-y`, `--yes` | Rückfragen automatisch mit Ja beantworten |
| `--no-input` | Nie nachfragen |
| `-h`, `--help` | Hilfe zu einem Befehl anzeigen |
| `--version` | Die Version ausgeben |

**Welche Instanz:** `-i`, sonst die Umgebungsvariable `LEVILAUNCHER_INSTANCE`, sonst die Standardinstanz (`use`), sonst die einzige vorhandene Instanz. **Welcher Spieler:** `-p`, sonst `LEVILAUNCHER_PLAYER`, sonst das einzige vorhandene Profil, sonst das Profil des angemeldeten Kontos.

## Ausgabe

- Ergebnisse werden auf stdout ausgegeben, Fortschritt, Hinweise und Fehler auf stderr. Fehler erscheinen als `error:` zusammen mit einem `hint:` und einem Fehlercode wie `[ERR_GAME_RUNNING]`.
- `--json` gibt ein einzelnes JSON-Dokument aus: ein Array bei Listen, sonst ein Objekt – mit Schlüsseln in camelCase, Zeitangaben nach RFC 3339 und Größen in Bytes.
- `-q` gibt nur Bezeichner aus, einen pro Zeile.

## Exit-Codes

| Code | Bedeutung |
| --- | --- |
| 0 | OK |
| 1 | Fehlgeschlagen |
| 2 | Falsche Verwendung |
| 3 | Nicht gefunden |
| 4 | Konflikt (zum Beispiel weil das Spiel läuft) |
| 5 | Anmeldung oder Lizenz |
| 6 | Netzwerk |
| 7 | Teilweise abgeschlossen |
| 8 | Erfordert eine Systemänderung oder Administratorrechte |
| 9 | Zeitüberschreitung |
| 10 | Abgebrochen |
| 130 | Unterbrochen (Strg+C) |

`launch --wait-exit` gibt stattdessen den Exit-Code des Spiels selbst zurück.

## Fenster-Argumente

Diese Argumente öffnen das Programmfenster, statt einen Befehl auszuführen:

| Argument | Wirkung |
| --- | --- |
| `--launch=<instance>` | Öffnet den Launcher und startet die Instanz (wird von Desktop-Verknüpfungen verwendet). Läuft der Launcher bereits, wird die Instanz dort gestartet. |
| `--debug` | Zeigt das Launcher-Protokoll zusätzlich in einem Konsolenfenster an (`debug`, `-debug` und `/debug` funktionieren ebenfalls). |
