# Mods & Integrationen

LeviLauncher unterstützt Mod-Arbeitsabläufe, die über einen „Basis-Launcher“ hinausgehen.

## Derzeit verfügbare Funktionen

=== "Windows"

    - Mod-Pakete (`.mcmod`) importieren
    - `.zip`-Pakete und einzelne `.dll`-Mods werden weiterhin akzeptiert: Wähle im Dateidialog **Alle Dateien (\*.\*)**
    - Installierte Mods aktivieren oder deaktivieren
    - Nicht mehr benötigte Mods löschen
    - Auf CurseForge suchen und Pakete beziehen
    - LIP-Pakete mit dem integrierten, [lip](https://github.com/LiteLDev/lip)-kompatiblen Paketmanager installieren
    - Loader-Workflows wie LeviLamina einbinden

    ::: warning Dies ist ein fortgeschrittener Bereich
    Die Kompatibilität von Mods, Loadern und Paket-Integrationen ändert sich oft schneller, insbesondere bei Minecraft Preview. Betrachte dies als fortgeschrittene Funktion und teste schrittweise.
    :::

=== "Android"

    - Native Mods (`.so`-Bibliotheken) ins Spiel laden
    - Gemoddete Setups in isolierten Versionen halten

    Du entwickelst native Mods? Siehe [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) in der LeviLamina-Dokumentation (auf Englisch).

## Empfohlener Mod-Arbeitsablauf

1. Beginne mit einer sauberen, isolierten Version.
2. Stelle zunächst sicher, dass die Version ohne Mods normal startet.
3. Füge jeweils nur einen Mod oder eine kleine Gruppe von Änderungen hinzu.
4. Teste den Start nach jeder Änderung erneut.
5. Halte für wichtige Welten immer ein Backup bereit.

## CurseForge <Badge platform="windows" />

Über die CurseForge-Integration kannst du passende Ressourcen und Pakete direkt im Launcher suchen und beziehen.

Das bietet sich an, wenn du:

- eine geführtere Suche bevorzugst
- kompatible Dateien für ein bestimmtes Projekt schneller finden möchtest
- nicht für jede Suche den Launcher verlassen möchtest

## lip und LeviLamina <Badge platform="windows" />

LeviLauncher enthält einen integrierten Paketmanager, der mit [lip](https://github.com/LiteLDev/lip) kompatibel ist. Du musst also weder lip noch die .NET-Runtime separat installieren. Er arbeitet wie lip: Jede Version speichert ihre Pakete in `.lip/state.json`, und Pakete werden über ihre `lip.toml` eingelesen (ältere Pakete, die nur eine `tooth.json` enthalten, funktionieren weiterhin). Versionen, in denen LeviLamina oder LIP-Pakete mit einem älteren Launcher installiert wurden (`tooth_lock.json`), werden beim ersten Paketvorgang automatisch migriert. Ist **Mirror-Quellen verwenden** aktiviert, laufen Paket-Downloads von GitHub über den **GitHub-Proxy** aus den [Einstellungen](./settings-personalization); andernfalls greift der Launcher direkt auf GitHub zu (über den Systemproxy, falls einer eingerichtet ist). Ein zuvor gespeicherter GitHub-Proxy oder ein in lips `config.toml` (unter `%APPDATA%\lip`, z. B. mit `lip config set github_proxy <URL>`) gesetzter `github_proxy` greift in beiden Fällen. **Cache leeren** entfernt heruntergeladene Paketdateien.

Seit lip v0.40 gibt jeder Eintrag in `lip.toml` und `.lip/state.json` mit `side` (`server` oder `client`) und `platform` (eine .NET-Runtime-ID wie `win-x64`) an, wo er ausgeführt wird; in lip v0.39 und älter hießen diese Schlüssel noch `platform` und `runtime`. Eine `.lip/state.json` mit den alten Schlüsseln – erstellt von lip v0.39 oder älter bzw. von einem älteren Launcher – wird vor dem nächsten Paketvorgang automatisch umgewandelt: `platform` wird in `side` und `runtime` in `platform` umbenannt. Lässt sich eine Datei dennoch nicht von lip lesen, wird sie mit einem Hinweis auf die Änderung abgelehnt: Entweder `platform` in `side` und `runtime` in `platform` umbenennen oder die Pakete dieser Version neu installieren.

Diese Integrationen richten sich vor allem an fortgeschrittene Nutzer, die mit Paketmanagern oder Loadern arbeiten möchten.

Empfehlungen:

- Beginne mit einer stabilen Release-Version
- Ändere nicht mehrere fehleranfällige Faktoren gleichzeitig
- Notiere dir die „zuletzt funktionierende“ Versionskombination

Wie du LeviLamina zu einer Client-Version hinzufügst, erfährst du unter [Install client on Windows](https://levimc.org/LeviLamina/user_guides/install_on_client/) in der LeviLamina-Dokumentation (auf Englisch).

### Seite „LeviMC Mods“

Die Seite **LeviMC Mods** listet die Mods von [levimc.org/mods](https://levimc.org/mods/), die einen Client-Build für Windows x64 haben (einen Eintrag mit `side = "client"` und `platform = "win-x64"`). Du kannst die Liste nach Name, ID, Autor, Tag oder Beschreibung durchsuchen und nach Relevanz, Sternen, letzter Aktualisierung oder Neuheit sortieren. Außerdem lässt sie sich nach Spielversion, LeviLamina-Version, Tags (empfohlene Tags wie Bibliothek / API oder Wirtschaft stehen vorne; ein Tag lässt sich auch ausschließen), Lizenz (eine Familie wie Freizügig oder eine SPDX-ID), Abhängigkeiten und Autor (**Mehr von …** auf der Seite einer Mod) filtern. Beim Installieren wird die Variante `client` gewählt, andernfalls die Standardvariante und sonst die erste andere Variante mit einem Client-Build; auf der Seite einer Mod kannst du eine andere dieser Varianten auswählen. Die Schaltfläche **Install with LeviLauncher** auf der Seite einer Mod auf levimc.org ist ein `levilauncher://install/<mod id>?version=<version>`-Link, der LeviLauncher auffordert, diese Version der Mod zu installieren.

## Native Mods <Badge platform="android" />

Native Mods führen nativen Code im Spielprozess aus. Installiere nur Mods aus vertrauenswürdigen Quellen und teste sie zuerst in einer isolierten Version.

Wie du eigene erstellst, erfährst du unter [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) in der englischsprachigen LeviLamina-Dokumentation.

## Wenn nach dem Hinzufügen von Mods Fehler auftreten

- Deaktiviere zuerst die zuletzt hinzugefügte Mod
- Vergleiche mit dem letzten funktionierenden Zustand
- Sichere oder verschiebe wichtige Welten vor weiteren Tests
- Lies dann weiter unter [Updates und Fehlerbehebung](./update-troubleshooting)
