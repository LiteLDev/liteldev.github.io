---
platforms: [windows]
---
# Alle Einstellungen

Hier findest du jede Einstellung auf der Seite **Einstellungen** der Windows-Version (Stand LeviLauncher 1.1.0), Tab für Tab, samt zugehörigem `config`-Schlüssel für die [Befehlszeile](./command-line), sofern vorhanden. Über das Suchfeld oben auf der Seite lässt sich jede Einstellung direkt über ihren Namen finden. Tipps dazu, was du anpassen solltest, gibt es unter [Einstellungen & Personalisierung](../guide/settings-personalization).

## Allgemeine Einstellungen

| Einstellung | Funktion | Schlüssel |
| --- | --- | --- |
| **Inhaltspfade → Basis-Stammverzeichnis** | Das Datenstammverzeichnis, also der Ordner für Instanzen, Downloads und Backups (siehe [Ordner & Dateien](./files)). **Anwenden** speichert einen neuen Ordner, **Zurücksetzen** stellt den Standard wieder her. Darunter werden die Ordner **Installers** und **Versionen** angezeigt. Vorhandene Daten werden nicht verschoben. | `data-root` |
| **Sprache** | Die Sprache des Launchers. | — |
| **Discord Rich Presence** | Zeigt deinen Spielstatus auf Discord an. Standardmäßig aktiviert. | `discord` |
| **Beim Start von Minecraft** | Legt fest, wie sich der Launcher beim Start von Minecraft verhält: **Launcher minimieren** (Standard), **Launcher ausblenden**, **Launcher schließen** oder **Launcher geöffnet lassen**. | `on-game-launch` |
| **Beim Beenden von Minecraft** | Legt fest, wie sich der Launcher beim Beenden von Minecraft verhält: **Launcher wieder öffnen** (Standard), **Nichts tun** oder **Launcher schließen**. | `on-game-exit` |
| **Beim Schließen ins Tray ausblenden** | Die Schließen-Schaltfläche blendet den Launcher in den Infobereich aus, statt ihn zu beenden; die Minimieren-Schaltfläche minimiert ihn weiterhin in die Taskleiste. Standardmäßig deaktiviert. | `close-to-tray` |

## Personalisierung

Dieser Tab ist in vier Bereiche unterteilt. Die Personalisierungseinstellungen (Farben, Deckkraft usw.) werden für das helle und das dunkle Design getrennt gespeichert (**Einstellungen je Modus**): Wähle **Hellmodus** oder **Dunkelmodus**, um das jeweilige Design zu bearbeiten.

### Design und Farben

| Einstellung | Funktion |
| --- | --- |
| **Design-Modus** | **Hellmodus**, **Dunkelmodus**, **Manueller Zeitplan** (dunkel zwischen **Startzeit Dunkelmodus** und **Endzeit Dunkelmodus**), **Sonnenaufgang/Sonnenuntergang** (richtet sich nach den lokal auf dem Gerät berechneten Zeiten für Sonnenauf- und -untergang) oder **System folgen** (übernimmt die Windows-Einstellung). |
| **Designfarbe** | Die Akzentfarbe: eine der **Voreingestellten Farben**, eine der **Weiteren Farben** oder eine **Benutzerdefinierte Farbe**. |
| **Basismodus** | Legt für mehr Kontrast eine Volltonfarbe unter das Hintergrundbild: **Keine**, **Designfarbe folgen** oder **Benutzerdefinierte Farbe**, jeweils mit einstellbarer **Basisdeckkraft**. |

### Layout und Animationen

| Einstellung | Funktion |
| --- | --- |
| **Obere Navigationsleiste verwenden** | Nutzt eine Navigationsleiste am oberen Rand statt der vertikalen Seitenleiste. |
| **Animationen deaktivieren** | Schaltet die Übergangsanimationen der Oberfläche aus. |

### Hintergrundbild

| Einstellung | Funktion |
| --- | --- |
| **Hintergrundbild** | Verwendet einen Bilderordner als Hintergrund: **Ordner auswählen**, **Ordner öffnen**, **Ordner entfernen** sowie **Nächstes Bild** (sofern der Ordner mehrere Bilder enthält). |
| **Anpassungsmodus** | **Intelligent**, **Zentriert**, **Anpassen**, **Strecken**, **Kacheln**, **Oben links** oder **Oben rechts**. |
| **Wiedergabereihenfolge** | **Zufällig** oder **Sequentiell** (natürliche Reihenfolge der Dateinamen). |
| **Hintergrundunschärfe**, **Hintergrundhelligkeit**, **Hintergrunddeckkraft** | Steuert die Darstellung des Hintergrundbilds. |

### Material und Lesbarkeit

| Einstellung | Funktion |
| --- | --- |
| **Oberflächenmaterial** | Bestimmt das Aussehen von Navigation, Karten, Tabs, Steuerelementen und Pop-ups über dem Hintergrundbild. **Material-Voreinstellungen**: **Ausgewogen** (Standard), **Klar** oder **Deckend**. |
| **Deckkraft der Oberfläche**, **Unschärfe der Oberfläche**, **Hintergrundbild-Overlay** | Feinabstimmung des Materials. |
| **Lesbarkeitsschutz** | Sichert die Lesbarkeit von Text durch eine Mindesttönung der Flächen – abhängig von Design, Bildhelligkeit und Unschärfe. |
| **Dieses Design zurücksetzen** | Setzt die Materialeinstellungen des aktuell bearbeiteten Designs zurück. |

Unter [Einstellungen & Personalisierung](../guide/settings-personalization#hintergrundbild-und-oberflachenmaterial) werden diese Optionen im Detail erklärt.

## Paketverwaltung

| Einstellung | Funktion | Schlüssel |
| --- | --- | --- |
| **Cache leeren** | Löscht die vom Paketmanager heruntergeladenen Paketdateien. Nützlich, wenn Paket-Downloads fehlschlagen. | `cache clean packages` |
| **Mirror-Quellen verwenden** | Lädt Launcher-Updates, Pakete und Versionslisten über Spiegelserver in Festlandchina herunter. Für Nutzer in Festlandchina standardmäßig aktiviert. | `mirror` |
| **GitHub-Proxy** | Der GitHub-Proxy für Paket-Downloads (nur sichtbar, solange **Mirror-Quellen verwenden** aktiviert ist): Wähle eine Voreinstellung oder **Benutzerdefiniert**, um eine eigene URL einzugeben. Ein leeres Feld stellt den Standard wieder her (`https://gh-proxy.org/https://github.com`). | `github-proxy` |

## Sonstiges

| Einstellung | Funktion |
| --- | --- |
| **Prozess-Manager → Prozesse scannen** | Listet die laufenden Minecraft-Prozesse auf; **Task beenden** beendet einen einzelnen Prozess, **Alle Prozesse beenden** alle. Nicht gespeicherter Spielfortschritt kann dabei verloren gehen. |
| **Experimentelle Funktionen → Instanz-Backup (Experimentell)** | Fügt den **Instanz-Einstellungen** Aktionen zum Sichern und Wiederherstellen hinzu. Beim Einschalten wird zuerst eine Warnung angezeigt. |

## Datenschutz

| Einstellung | Funktion |
| --- | --- |
| **Nutzungsanalyse (Google Analytics)** | Sendet Nutzungsdaten, die helfen, den Launcher zu verbessern. Du kannst sie jederzeit ausschalten. Enthält Links zu den **Google Analytics-Nutzungsbedingungen** und der **Google-Datenschutzerklärung**. |

## Updates

| Einstellung | Funktion | Schlüssel |
| --- | --- | --- |
| **Beta-Updates erhalten** | Bietet auch Vorabversionen des Launchers an. Standardmäßig aus. | `beta-updates` |
| **Aktuelle Version → Auf Update prüfen** | Zeigt die aktuelle Version des Launchers an und sucht nach einer neueren. | `self-update --check` |

## Über

Die Credits des Launchers sowie Links zu LiteLDev auf GitHub und zur Discord-Community.

## Schlüssel der Befehlszeile {#command-line-keys}

`LeviLauncher.exe config list` zeigt jeden Schlüssel samt Wert und dessen Herkunft an: `set` (gespeichert), `default` (Standard), `auto` (erkannt) oder `lip` (aus der eigenen `config.toml` von lip). `config set <key> <value>` ändert einen Schlüssel, `config unset <key>` setzt ihn auf den Standard zurück.

| Schlüssel | Werte | Bedeutung |
| --- | --- | --- |
| `data-root` | ein Ordner | Speicherort für Instanzen, Downloads und Backups (vorhandene Daten werden nicht verschoben) |
| `default-instance` | eine Instanz | Die Instanz, die Befehle verwenden, wenn keine angegeben ist (wie `use`) |
| `mirror` | `on`, `off` | Von Spiegeln in Festlandchina herunterladen (nicht gesetzt: wird nach Region erkannt) |
| `github-proxy` | eine http(s)-URL | GitHub-Proxy für Mod-Downloads (verwendet, solange Spiegel an sind, sofern nicht gesetzt) |
| `beta-updates` | `on`, `off` | Vorabversionen des Launchers anbieten (Standard: `off`) |
| `discord` | `on`, `off` | Discord Rich Presence beim Spielen anzeigen, nur aus dem Launcher-Fenster (Standard: `on`) |
| `on-game-launch` | `minimize`, `hide`, `close`, `keep` | Verhalten des Launcher-Fensters beim Spielstart (Standard: `minimize`) |
| `on-game-exit` | `reopen`, `keep`, `close` | Verhalten des Launcher-Fensters beim Beenden des Spiels (Standard: `reopen`) |
| `close-to-tray` | `on`, `off` | Beim Schließen des Launcher-Fensters bleibt er im Infobereich (Standard: `off`) |

Schreibgeschützte Schlüssel, die `config list` und `config get` ausgeben: `instances-dir`, `installers-dir`, `backups-dir`, `cache-dir`, `logs-dir` (die Ordner aus [Ordner & Dateien](./files)) sowie `config-file` (die Einstellungsdatei `%APPDATA%\LeviLauncher\config.json`).
