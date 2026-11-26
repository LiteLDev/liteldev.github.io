# Versionsverwaltung

LeviLauncher verwaltet jede installierte Umgebung als eigenständige Version. In der App heißen installierte Versionen Instanzen und sind auf der Seite **Instanzen** aufgelistet.

## Was du tun kannst

=== "Windows"

    - Release- oder Preview-Versionen installieren
    - Einen leicht erkennbaren Namen für die Version festlegen
    - Eine bestimmte Version schnell starten
    - Nicht mehr benötigte Versionen löschen
    - Versionsspezifische Einstellungen öffnen
    - Eine Desktop-Verknüpfung für die Version erstellen

=== "Android"

    - Offizielle Minecraft-APKs importieren und im Launcher starten, ohne jede Version im System zu installieren
    - Mehrere Versionen und ihre Daten getrennt halten
    - Auswählen, welche Version über die Startansicht gestartet wird

## Der Unterschied zwischen Release und Preview <Badge platform="windows" />

| Typ | Geeignet für | Beschreibung |
| --- | --- | --- |
| Release | Stabiles, tägliches Spielen | Geeignet für die meisten Spieler |
| Preview | Vorab-Testen neuer Inhalte | Anfälliger für Änderungen bei der Welt-, Paket- oder Mod-Kompatibilität |

## Was ist Isolierung?

=== "Windows"

    Isolierung ist für GDK-Versionen sowie für UWP-x64-Versionen ab 1.19.70.2 verfügbar. Ist sie aktiviert, speichert LeviLauncher die Spieldaten dieser Version in einem eigenen Arbeitsbereich, statt sie mit dem Standardspeicherort zu teilen.

    Isolierung eignet sich für folgende Anforderungen:

    - Unterschiedliche Inhaltskombinationen für verschiedene Versionen
    - Sichereres Testen von Mods oder Minecraft Preview
    - Geringeres Risiko, dass eine Umgebung eine andere beeinträchtigt

=== "Android"

    Aktiviere die Isolierung für eine importierte Version, wenn ihre Welten, Pakete und Einstellungen von der aus Google Play installierten Version getrennt bleiben sollen. Importierte Versionen brauchen die Isolierung oft zum Starten.

## Häufige Versionsoperationen <Badge platform="windows" />

### Neue Version installieren

Führe die Installation auf der Seite **Herunterladen** durch und kehre anschließend zu **Starten** zurück, um das Spiel zu starten.

Der Schalter **LeviLamina installieren** auf der Installationsseite ist anfangs eingeschaltet; schalte ihn aus, um das Spiel ohne LeviLamina zu installieren. Er gilt nur für Versionen, die LeviLamina unterstützt.

### Version umbenennen

Vergib unter **Instanzen** oder **Instanz-Einstellungen** einen aussagekräftigeren Namen für die Umgebung, z. B. `Release Survival` oder `Preview Test`.

### Version löschen

Entferne nicht mehr benötigte Versionen, insbesondere abgeschlossene Minecraft Preview-Umgebungen.

::: warning Vor dem Löschen prüfen
Beim Löschen einer Version können die zugehörigen Inhalte in dieser verwalteten Umgebung entfernt werden. Sichere vorher wichtige Welten.
:::

### Desktop-Verknüpfung erstellen

Wähle im Menü neben der Schaltfläche **Starten** die Option **Desktop-Verknüpfung erstellen**, um für eine bestimmte Version eine Verknüpfung anzulegen, über die du sie direkt starten kannst.

## Empfohlene Versionsstrategie <Badge platform="windows" />

- Eine isolierte Release-Version für das tägliche Spielen
- Eine isolierte Preview-Version nur bei Bedarf
- Eine temporäre Testversion für Mods oder zur Fehlerbehebung

## Verwandte Lektüre

- [Download und Spiegelserver](./downloads-mirrors)
- [Welt-Tools](./world-tools)
- [Updates und Fehlerbehebung](./update-troubleshooting)
