# Instanz-Isolierung

Minecraft speichert Welten, Pakete und Einstellungen in einem gemeinsamen Spieldatenordner pro Gerät. Mit der **Instanz-Isolierung** (in der App: **Isolierung aktivieren** in den **Instanz-Einstellungen** sowie **Instanz-Isolierung** beim Installieren einer Version) erhält eine Instanz stattdessen ihren eigenen Spieldatenordner direkt im Instanzverzeichnis. Auf der Befehlszeile heißen diese beiden Modi *own data* (eigene Daten) und *shared data* (gemeinsame Daten).

## Gemeinsame und eigene Daten

=== "Windows"

    Eine Instanz **ohne Isolierung** nutzt die regulären Spieldaten von Minecraft auf diesem PC: Sie teilt sich Welten, Pakete und Einstellungen mit der Version aus dem Microsoft Store und mit allen anderen nicht isolierten Instanzen derselben Art.

    Eine Instanz **mit Isolierung** speichert ihre Spieldaten im eigenen Ordner. Welten, Ressourcenpakete, Verhaltenspakete, Skin-Pakete, Screenshots, Serverliste und Spieleinstellungen sind damit vollständig von anderen Instanzen und vom Spiel aus dem Microsoft Store getrennt.

    | Instanz | Gemeinsame Daten (Isolierung aus) | Eigene Daten (Isolierung an) |
    | --- | --- | --- |
    | GDK, Release | `%APPDATA%\Minecraft Bedrock` | `<Instanz>\Minecraft Bedrock` |
    | GDK, Preview | `%APPDATA%\Minecraft Bedrock Preview` | `<Instanz>\Minecraft Bedrock Preview` |
    | UWP, Release | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<Instanz>\Minecraft Bedrock` |
    | UWP, Preview | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe\LocalState` | `<Instanz>\Minecraft Bedrock Preview` |
    | UWP, Beta | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<Instanz>\Minecraft Bedrock Beta` |

    `<Instanz>` steht für den Ordner der Instanz im Verzeichnis `Instances` (siehe [Ordner & Dateien](../reference/files)). Innerhalb eines GDK-Datenordners legt das Spiel die Daten jedes Spielers unter `Users\` ab (siehe [Spielerprofile](./instances#player-profiles)), in einem UWP-Datenordner unter `games\com.mojang\`.

=== "Android"

    Die Versionsisolierung trennt die Spieldaten einer Version (Welten, Pakete und Einstellungen) von anderen Versionen sowie vom aus Google Play installierten Minecraft. Änderungen an einer Instanz wirken sich nicht auf andere Instanzen aus. Importierte Versionen benötigen oft die Isolierung, um starten zu können.

## Wie es funktioniert <Badge platform="windows" />

Das Spiel selbst kennt keine Instanzen. Beim Installieren einer Instanz legt LeviLauncher seinen Loader `LeviLauncher.dll` neben der ausführbaren Datei des Spiels ab (siehe [Wie Mods geladen werden](./mod-loading)). Startet das Spiel mit aktiver Isolierung, leitet der Loader die Verzeichnisse, in denen das Spiel seine Daten sucht (die Anwendungsdatenordner und den temporären Ordner), auf den Datenordner der Instanz um. Es wird nichts kopiert oder verknüpft: Das Spiel liest und schreibt direkt dort.

Was die Isolierung nicht beeinflusst:

- **Mods** gehören immer zu einer bestimmten Instanz und liegen unabhängig von der Isolierung in deren Ordner `mods\`.
- **Das Microsoft-Konto** und die Einstellungen des Launchers selbst gelten übergreifend für alle Instanzen.
- Die **Registrierung** bei Windows (siehe [Instanzen & Spielversionen](./instances#registration-with-windows)) ist unabhängig von der Isolierung.

## Grenzen <Badge platform="windows" />

- GDK-Instanzen unterstützen die Isolierung in allen Versionen, UWP-Instanzen erst ab Version 1.19.70.2 und nur unter x64.
- Beim Einschalten der Isolierung werden keine Daten kopiert – die Instanz startet mit leeren Spieldaten. Möchtest du vorhandene Daten übernehmen, kannst du sie bereits beim Installieren der Version kopieren lassen (entweder vom auf dem PC installierten Spiel oder von einer anderen isolierten Instanz desselben Typs) oder dies später mit `LeviLauncher.exe instance copy-data` (GDK) nachholen.
- Schaltest du die Isolierung aus, greift die Instanz wieder auf die gemeinsamen Daten zu; ihr eigener Datenordner bleibt im Instanzverzeichnis erhalten.
- Beim Entfernen einer Instanz wird ihr gesamter Ordner gelöscht, **einschließlich der Welten ihrer eigenen Daten**. Sichere wichtige Welten daher vorher (siehe [Welt-Tools](../guide/world-tools)).
- Inhalte lassen sich nur dann von einer Instanz in eine andere kopieren, wenn die Zielinstanz eigene Daten nutzt oder eine UWP-Instanz mit einem abweichenden Datenordner ist.

## Wann du sie verwenden solltest

Die Isolierung bietet sich an, wenn du Folgendes möchtest:

- unterschiedliche Inhalte für verschiedene Versionen nutzen
- Mods oder Minecraft-Preview-Builds gefahrlos testen
- verhindern, dass sich verschiedene Umgebungen gegenseitig beeinflussen

Eine bewährte Aufteilung: eine isolierte Release-Instanz für das normale Spielen, eine isolierte Preview-Instanz bei Bedarf und eine temporäre Testinstanz für Mods oder zur Fehlersuche.

## Verwandte Seiten

- [Versionsverwaltung](../guide/version-management)
- [Inhaltsverwaltung](../guide/content-management)
- [Instanzen & Spielversionen](./instances)
