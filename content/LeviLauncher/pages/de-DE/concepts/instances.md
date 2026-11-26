# Instanzen & Spielversionen

LeviLauncher installiert jede Kopie von Minecraft als **Instanz**: eine Spielversion mit eigenem Namen, eigenen Einstellungen und auf Wunsch auch eigenen Spieldaten. Du kannst mehrere Instanzen nebeneinander behalten – mit derselben Spielversion oder mit verschiedenen – und genau die starten, die du gerade brauchst. Die App führt sie auf der Seite **Instanzen** auf.

## Was eine Instanz ist

=== "Windows"

    Eine Instanz ist ein Unterordner im Ordner `Instances` des Launchers (siehe [Ordner & Dateien](../reference/files)). Ihr Name entspricht dem Namen dieses Ordners. Der Ordner enthält:

    - die Spieldateien eines Minecraft-Builds, entpackt aus dem Installationspaket;
    - `.levilauncher\instance.json` mit den Metadaten der Instanz: Spielversion, Kanal, ob sie eigene Spieldaten verwendet, sowie die Startoptionen (Konsole, Editor-Modus, Startargumente, Umgebungsvariablen);
    - `mods\` mit den Mods der Instanz und `.lip\` mit dem Status der Pakete, die über den integrierten Paketmanager installiert wurden (siehe [Wie Mods geladen werden](./mod-loading));
    - die eigenen Spieldaten der Instanz (Welten, Pakete, Einstellungen), sofern die [Isolierung](./isolation) eingeschaltet ist.

    Mods gehören immer zu einer bestimmten Instanz. Spieldaten gehören nur dann zur Instanz, wenn die Isolierung eingeschaltet ist; andernfalls greift die Instanz auf die Spieldaten zu, die Minecraft auf diesem PC standardmäßig verwendet.

=== "Android"

    Eine Instanz ist eine offizielle Minecraft-APK, die du in LeviLauncher importierst. Sie läuft direkt im Launcher, ohne im System installiert zu werden. Die Minecraft-App aus Google Play (1.21.80 oder neuer) muss trotzdem auf dem Gerät installiert sein; LeviLauncher führt sie neben den importierten Versionen auf.

    Die Versionsisolierung trennt Welten, Pakete und Einstellungen einer importierten Version von der installierten Google-Play-Version. Importierte Versionen setzen die Isolierung oft voraus, um zu starten.

## Release und Preview

Jeder Minecraft-Build gehört zu einem **Kanal**:

| Kanal | Beschreibung |
| --- | --- |
| Release | Die stabile Version, die die meisten Spieler verwenden. |
| Preview | Vorschau-Builds kommender Versionen zum Testen. Sie beschädigen Welten, Pakete oder Mods häufiger. |
| Beta | Test-Builds, die nur für UWP veröffentlicht wurden. <Badge platform="windows" /> |

Unter Windows nutzen Release und Preview getrennte Spieldatenordner (`Minecraft Bedrock` und `Minecraft Bedrock Preview`). Daher teilt eine Preview-Instanz auch ohne Isolierung keine Welten mit einer Release-Instanz.

## GDK- und UWP-Builds <Badge platform="windows" />

Minecraft für Windows wurde in zwei Paketformaten veröffentlicht; LeviLauncher kann beide installieren. Ist eine Version in beiden Formaten verfügbar, wird GDK gewählt.

| | GDK | UWP |
| --- | --- | --- |
| Installationspaket | `.msixvc`, heruntergeladen von einem Spiegelserver, den LeviLauncher auf Geschwindigkeit prüft und auswählt | `.appx` / `.msix` (oder ein Bundle), heruntergeladen über Windows Update |
| Voraussetzung zum Installieren | Ein angemeldetes Microsoft-Konto, das Minecraft besitzt | — |
| Voraussetzung zum Ausführen | Microsoft Gaming Services und Microsoft GameInput | Der Windows-Entwicklermodus, um das Paket bei Windows zu registrieren |
| Gemeinsame Spieldaten | `%APPDATA%\Minecraft Bedrock` (Preview: `Minecraft Bedrock Preview`), ein Ordner pro Spielerprofil unter `Users\` | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` (Preview: `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`) |
| Isolierung | Alle Versionen | x64-Versionen ab 1.19.70.2 |
| LeviLamina | Wird von LeviLauncher auf unterstützten Versionen installiert | Wird von LeviLauncher nicht installiert |
| Startargumente und Umgebungsvariablen | Ja | Nein |

Importierst du ein lokales Installationspaket (`.msixvc`, `.appx`, `.msix`, `.appxbundle` oder `.msixbundle`), installiert LeviLauncher es anhand der Dateiendung als GDK- oder UWP-Build.

### Spielerprofile {#player-profiles}

Eine GDK-Instanz speichert Welten, Screenshots und die Serverliste getrennt nach **Spielerprofil**: Dafür wird unter `Users\` ein Ordner mit der ID des Spielers angelegt und – sofern dem Launcher bekannt – mit dessen Gamertag angezeigt. Ressourcen- und Verhaltenspakete teilen sich alle Profile (`Users\Shared\`); Skin-Pakete werden ab Spielversion 1.26 geteilt und in älteren Versionen pro Profil gespeichert. UWP-Instanzen haben keine Profile.

## Registrierung bei Windows <Badge platform="windows" /> {#registration-with-windows}

Windows verwaltet pro Kanal nur eine einzige Minecraft-Installation. Wenn du eine Instanz **registrieren** lässt, behandelt Windows sie als genau diese Installation: Das Startmenü, `minecraft://`-Links und die Xbox-Funktionen verweisen dann auf diese Instanz. Die Registrierung löst den bisherigen Inhaber des Release- oder Preview-Platzes ab (also die Version aus dem Microsoft Store oder eine andere Instanz), dessen Daten dabei erhalten bleiben. Das Registrieren und Abmelden verändert niemals die Spieldaten.

UWP-Instanzen werden beim Starten automatisch registriert. Eine registrierte Instanz muss erst abgemeldet werden, bevor du sie umbenennen oder entfernen kannst.

## Verwandte Seiten

- [Versionsverwaltung](../guide/version-management)
- [Instanz-Isolierung](./isolation)
- [Ordner & Dateien](../reference/files)
