# Update & Fehlerbehebung

Wenn die Installation, das Update oder der Start von LeviLauncher nicht wie erwartet funktioniert, schau bitte zuerst auf dieser Seite nach.

## Häufige Probleme <Badge platform="windows" />

### Der Launcher meldet, dass die Release-Version nicht autorisiert ist

Ein Microsoft-Konto kann höchstens auf 10 Geräten beim Microsoft Store angemeldet sein, wobei der Launcher als eigenes Gerät zählt.  
Entferne nicht benötigte Geräte in der [Geräteverwaltung des Microsoft Store](https://account.microsoft.com/devices/content).

### Gaming Services fehlt oder ist beschädigt

- Folge der Anleitung im Launcher, um Gaming Services zu installieren oder zu reparieren.
- Prüfe bei Bedarf im Microsoft Store den Installationsstatus von Minecraft Bedrock.

### GameInput fehlt

- Installiere das erforderliche Redistributable, auf das LeviLauncher hinweist.
- Starte den Launcher nach der Installation gegebenenfalls neu.

### Installationspfad ist nicht beschreibbar

- Lege unter **Einstellungen → Allgemeine Einstellungen** für verwaltete Inhalte einen beschreibbaren Pfad fest.
- Wenn der Launcher bei der Installation oder beim Selbst-Update erhöhte Rechte anfordert, bestätige dies nur, wenn du der Quelle vertraust.

### LeviLauncher schließt sich sofort oder zeigt kein Fenster an

- Stürzt der Launcher weiter ab, bevor die Oberfläche erscheint, prüfe `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`.
- Versuche den Start nach einem Fehler noch einmal. Besteht das Problem weiterhin, hänge `startup.log` an dein GitHub-Issue an.

### Eine Version startet nicht

- Prüfe zuerst, ob die Version ohne Mods startet.
- Prüfe, ob die erforderlichen Windows-Komponenten noch vorhanden sind.
- Stelle sicher, dass die Version vollständig installiert ist.
- Versuche, das Problem in einer sauberen, isolierten Testumgebung zu reproduzieren.

### Download ist langsam oder bricht ständig ab

- Wechsle den Mirror (Spiegelserver).
- Versuche es später erneut.
- Nutze nach Möglichkeit eine lokale Paketquelle.

## Häufige Probleme unter Android <Badge platform="android" />

### Minecraft fehlt oder wird nicht unterstützt

Installiere oder aktualisiere die offizielle Minecraft-App über Google Play (Version 1.21.80 oder neuer) und öffne LeviLauncher erneut.

### Eine importierte Version startet nicht

Importierte Versionen erfordern oft die Versionsisolierung. Aktiviere sie in den Instanzeinstellungen und versuche es erneut.

### Ein Start schlägt fehl

Öffne das Startprotokoll in der Fehleransicht und prüfe die Ursache, bevor du Einstellungen änderst.

### Datenmigration

Der Launcher migriert unter Umständen alte Datenverzeichnisse, bevor er fortfährt. Lösche das alte Verzeichnis erst, wenn die Migration abgeschlossen ist und deine Welten, Pakete und Einstellungen wieder verfügbar sind.

## Sicherere Wiederherstellungsschritte

1. Sichere zuerst wichtige Welten.
2. Entferne zuletzt hinzugefügte Mods oder Ressourcenpakete.
3. Teste zum Vergleich eine saubere, isolierte Version.
4. Installiere die betroffene Version bei Bedarf neu.

## Über das Selbst-Update <Badge platform="windows" />

LeviLauncher kann nach Updates suchen, sie herunterladen und installieren. Ist das Installationsverzeichnis nicht beschreibbar, sind dafür unter Umständen Administratorrechte erforderlich.

## Wann man ein Issue erstellen sollte

Melde ein Problem auf GitHub, wenn folgende Bedingungen zutreffen:

- Das Problem lässt sich zuverlässig reproduzieren.
- Es besteht auch nach den grundlegenden Wiederherstellungsschritten weiter.
- Die Ursache liegt vermutlich bei LeviLauncher selbst und nicht an der allgemeinen Windows-Umgebung.

Bitte gib bei der Meldung folgende Informationen an:

- Windows-Version
- LeviLauncher-Version
- Genaue Schritte zur Reproduktion
- Screenshots oder Logs (falls vorhanden)

Feedback-Kanal: [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

Gib bei der Android-Version die Android-Version, das Gerätemodell und das Startprotokoll an und erstelle das Issue unter [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues).
