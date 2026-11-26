---
platforms: [windows]
---
# Ordner & Dateien

Alle Dateien und Ordner, die die Windows-Version von LeviLauncher liest und schreibt (Stand: LeviLauncher 1.1.0). In den temporären Ordner des Systems (`%TEMP%`) schreibt der Launcher nichts.

## Überblick

| Ordner | Ort | Inhalt |
| --- | --- | --- |
| Einstellungsordner | `%APPDATA%\LeviLauncher\` | Nur `config.json`: klein und wandert mit deinem Windows-Profil |
| Lokaler Ordner | `%LOCALAPPDATA%\LeviLauncher\` | Protokolle, das Microsoft-Konto, die WebView2-Daten des Fensters; zugleich das Standard-Datenstammverzeichnis |
| Datenstammverzeichnis | Der lokale Ordner, sofern du keinen anderen wählst (**Basis-Stammverzeichnis** unter **Einstellungen → Allgemeine Einstellungen** oder `config set data-root`) | `Instances\`, `Backups\`, `Cache\` |

```text
%APPDATA%\LeviLauncher\
  config.json                      die Einstellungen des Launchers
%LOCALAPPDATA%\LeviLauncher\        das Standard-Datenstammverzeichnis
  Logs\startup.log                 das Launcher-Protokoll, davor startup.1.log … startup.4.log
  Accounts\                        das Microsoft-Konto und die Geräteeinträge, für deinen Windows-Benutzer verschlüsselt
  WebView2\                        die Daten des Launcher-Fensters
  storage-migration.json           der Eintrag über den Umzug aus dem alten Layout (siehe unten)
<Datenstammverzeichnis>\
  Instances\<Instanz>\             eine Instanz (siehe unten)
  Backups\
    Worlds\<Instanz>\<Ordner>_<Welt>\<Welt>_<yyyyMMdd-HHmmss>.mcworld
    Instances\<Instanz>\<Instanz>_<yyyyMMdd-HHmmss>.zip
  Cache\
    Installers\                    Spiel-Installationspakete sowie die Visual C++- und WebView2-Installer
    Updates\                       Launcher-Updates; nach der Installation gelöscht
    Downloads\                     für einen Import heruntergeladene Dateien; beim Start nach 1 Tag bereinigt
    Imports\                       an einen Import übergebene Dateien; beim Start nach 1 Tag bereinigt
    gdk-pending-versions.json
    gamertags.json                 die Gamertags der Spielerprofile, die der Launcher gesehen hat
```

Alles in `Cache\` lässt sich ohne Datenverlust löschen. `LeviLauncher.exe cache clean` entfernt den Paket-Cache, für Importe heruntergeladene Dateien und unfertige Downloads; `LeviLauncher.exe installer remove` löscht heruntergeladene Spiel-Installationspakete. Wenn du das Datenstammverzeichnis änderst, verweist der Launcher lediglich auf den neuen Ordner – vorhandene Instanzen, Downloads und Backups werden nicht verschoben.

## Der Ordner einer Instanz

```text
Instances\<Instanz>\
  Minecraft.Windows.exe …          die Spieldateien des Builds
  LeviLauncher.dll                 der native Loader von LeviLauncher (x64-Builds)
  .levilauncher\                   der Zustand des Launchers in der Instanz (versteckt)
    instance.json                  Name, Spielversion, Kanal, Isolierung und Startoptionen
    icon.ico                       das Symbol der Instanz, aus der LargeLogo.png des Spiels erzeugt
    xbox-auth-key-v1               eine Markierung von UWP-Instanzen für die Xbox-Anmeldung
  .lip\                            der Zustand der in der Instanz installierten Pakete (Format von lip)
  mods\                            die Mods (siehe „Wie Mods geladen werden“)
  Minecraft Bedrock\               die Spieldaten bei eingeschalteter Isolierung (Preview: Minecraft Bedrock Preview)
```

Die Spieldatenordner von Instanzen mit und ohne Isolierung sind unter [Instanz-Isolierung](../concepts/isolation) beschrieben, der Ordner `mods\` unter [Wie Mods geladen werden](../concepts/mod-loading).

## Außerhalb der Ordner von LeviLauncher

| Pfad | Inhalt |
| --- | --- |
| `Minecraft - <Instanz>.lnk` auf deinem Desktop | Die Desktop-Verknüpfung einer Instanz (**Desktop-Verknüpfung erstellen** oder `instance shortcut`). Sie startet den Launcher mit `--launch=<Instanz>` und wird nur auf deinem eigenen Desktop angelegt, nicht auf dem öffentlichen. |
| `%APPDATA%\lip\` | Die Einstellungen von lip (`config.toml`), etwa die Option `github_proxy`, die auch der integrierte Paketmanager ausliest. |
| `%LOCALAPPDATA%\lip\Cache\` | Der Paket-Cache des integrierten Paketmanagers – derselbe, den auch lip nutzt. **Cache leeren** unter **Einstellungen → Paketverwaltung** leert ihn. |
| `%APPDATA%\Minecraft Bedrock\`, `%APPDATA%\Minecraft Bedrock Preview\` | Die gemeinsamen Spieldaten von GDK-Instanzen ohne Isolierung. |
| `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\` (Preview: `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`) | Die gemeinsamen Spieldaten von UWP-Instanzen ohne Isolierung. |

## Wie Dateien geschrieben werden

- Dateien werden zunächst im Zielordner unter `<Name>.<Zufall>.tmp` angelegt und erst nach dem Schreiben in ihren endgültigen Namen umbenannt, sodass nie halb geschriebene Dateien sichtbar sind. Ein unfertiger Download, der sich fortsetzen lässt, bleibt als `<Name>.partial.tmp` erhalten.
- Selbst gewählte Namen (etwa für Instanzen oder Welten) werden nach den Windows-Regeln bereinigt: Die Zeichen `<>:"/\|?*` sowie Punkte und Leerzeichen am Ende werden entfernt und reservierte Namen wie `CON` oder `NUL` vermieden.
- Vom Launcher erzeugte Dateien folgen dem Schema `<Name>_<yyyyMMdd-HHmmss>.<Endung>`, zum Beispiel `MyWorld_20261107-142301.mcworld`.

## Das alte Layout

Vor Version 1.1.0 legte LeviLauncher alles unter `%APPDATA%\<Programmname>\` ab (zum Beispiel `%APPDATA%\levilauncher.exe\`) – darunter die Ordner `versions\`, `backups\`, `installers\`, `updates\` und `logs\` sowie die Dateien `config.json`, `user_gamertag_map.json` und `gdk_pending_versions.json`. Instanzordner enthielten `version.json` und `LargeLogo.ico`.

Beim ersten Start überführt LeviLauncher 1.1.0 oder neuer diese Daten einmalig in das oben beschriebene Layout, ohne etwas zu löschen: Daten auf demselben Laufwerk werden direkt an ihren neuen Platz verschoben (umbenannt), Daten auf einem anderen Laufwerk werden kopiert, wobei das Original erhalten bleibt, und die alte `config.json` wird in `config.migrated.json` umbenannt. Ein zuvor selbst gewähltes Datenstammverzeichnis bleibt an seinem Ort. Schlägt der Umzug fehl (etwa weil gerade das Spiel aus einer Instanz läuft), macht der Launcher alle Schritte rückgängig und nutzt bis zum nächsten Start weiter das alte Layout. Die Datei `storage-migration.json` protokolliert, was wohin verschoben wurde; anschließend werden vorhandene Desktop-Verknüpfungen auf die neuen Pfade angepasst.
