# Wie Mods geladen werden

Minecraft Bedrock unterstützt von sich aus keine Mods: Ein Mod ist nativer Code, den ein Loader beim Spielstart in den Spielprozess lädt. Diese Seite erklärt, welche Loader LeviLauncher verwendet, wo Mods liegen und wie die verschiedenen Wege zum Hinzufügen eines Mods ineinandergreifen.

## Wo Mods liegen <Badge platform="windows" />

Jede Instanz hat einen Ordner `mods\` (siehe [Ordner & Dateien](../reference/files)). Darin liegt jeder Mod in einem eigenen Ordner mit einer `manifest.json`, die ihn beschreibt:

| Feld | Bedeutung |
| --- | --- |
| `name` | Der Name des Mods. |
| `entry` | Die Datei, die der Loader lädt, relativ zum Ordner des Mods (eine `.dll`). |
| `version` | Die Version des Mods. |
| `type` | Welcher Loader ihn lädt: `preload-native` für den nativen Loader von LeviLauncher; Mods für LeviLamina haben eigene Typen. |
| `author` | Autor des Mods (optional). |

Mods gehören fest zu einer Instanz. Die [Isolierung](./isolation) betrifft sie nicht, sondern gilt nur für Spieldaten.

**Einen Mod ausschalten** (unter **Mods verwalten** oder mit `LeviLauncher.exe mod disable`) benennt seine `manifest.json` in `manifest.json.close` um; beim Einschalten erhält sie ihren ursprünglichen Namen zurück. Die Dateien des Mods bleiben an ihrem Platz, doch ein Loader, der nach einer `manifest.json` sucht, überspringt den Mod.

## Die zwei Loader <Badge platform="windows" />

### Der native Loader von LeviLauncher

Wenn LeviLauncher eine Instanz installiert oder vorbereitet, legt es seinen Loader `LeviLauncher.dll` neben die ausführbare Datei des Spiels und trägt ihn in deren Importtabelle ein, damit Windows ihn zusammen mit dem Spiel lädt. Das funktioniert für x64-Builds (sowohl GDK als auch UWP); darauf beruht auch die [Isolierung](./isolation).

Beim Spielstart geht der native Loader die Ordner in `mods\` alphabetisch durch und lädt den `entry` jedes Mods vom `type` `preload-native`. Ordner ohne `manifest.json` und Mods anderer Typen überspringt er. Hat die Instanz einen anderen Preloader (eine `preloader.dll` neben dem Spiel), überlässt ihm der native Loader das gesamte Laden der Mods. Der native Loader benötigt die Visual C++-Laufzeitumgebung (x64); LeviLauncher prüft, ob sie vorhanden ist, und bietet bei Bedarf die Installation an.

### LeviLamina

[LeviLamina](https://levimc.org/LeviLamina/) ist der Mod-Loader von LeviMC. Die meisten Mods auf [LeviMC Mods](https://levimc.org/mods/) sind LeviLamina-Mods: Sie setzen LeviLamina in einer Version voraus, die zur Spielversion der Instanz passt. Auf GDK-Instanzen unterstützter Versionen installiert LeviLauncher LeviLamina über den integrierten Paketmanager (über den Schalter **LeviLamina installieren** beim Installieren einer Version oder im Tab **Loader** der **Instanz-Einstellungen**).

## Drei Wege, einen Mod hinzuzufügen <Badge platform="windows" />

| Du fügst hinzu | Was LeviLauncher tut |
| --- | --- |
| Einen Mod aus **LeviMC Mods** (oder `mod install owner/repo`) | Installiert ihn über den integrierten, [lip](https://github.com/LiteLDev/lip)-kompatiblen Paketmanager: LeviLauncher lädt das Release für diese Plattform herunter, installiert alle benötigten Abhängigkeiten und trägt das Paket in die `.lip\state.json` der Instanz ein. Benötigt der Mod LeviLamina und ist noch keine oder keine passende Version installiert, wird zuerst eine kompatible LeviLamina-Version eingerichtet. Solche Mods lassen sich als Pakete aktualisieren und entfernen. |
| Ein `.mcmod`-Paket (oder eine `.zip`) | Entpackt das Archiv in einen neuen Ordner unter `mods\`. Es muss eine `manifest.json` enthalten. |
| Eine einzelne `.dll` | Legt sie in einen neuen Ordner unter `mods\` und erzeugt eine passende `manifest.json` (standardmäßig mit dem Dateinamen als Name, `preload-native` als Typ und `0.0.0` als Version). |

Ein Paket gibt in seiner `lip.toml` sowie in `.lip\state.json` mit `side` (`client` oder `server`) und `platform` (etwa `win-x64`) an, wo es läuft. Für den Client installiert LeviLauncher die `client`-Variante eines Mods, sofern vorhanden, andernfalls die Standardvariante. Einzelheiten, auch zur Migration älterer Pakete, findest du unter [Mods & Integrationen](../guide/mods-integrations).

## Android <Badge platform="android" />

Die Android-Version lädt native Mods – `.so`-Bibliotheken, die direkt im Spielprozess laufen. Nutze für gemoddete Umgebungen isolierte Versionen und installiere Mods nur aus vertrauenswürdigen Quellen. Wenn du selbst einen Mod entwickeln möchtest, folge der Anleitung [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) in der LeviLamina-Dokumentation.

## Verwandte Seiten

- [Mods & Integrationen](../guide/mods-integrations)
- [Instanzen & Spielversionen](./instances)
- [Befehlszeile](../reference/command-line)
