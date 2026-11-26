---
platforms: [windows]
---
# Einstellungen & Personalisierung

In den Einstellungen von LeviLauncher kannst du Pfade, Erscheinungsbild, Paketverwaltung, Datenschutz und das Update-Verhalten anpassen.

## Hauptbereiche der Einstellungen

Die Einstellungen sind derzeit in mehrere Bereiche unterteilt, zum Beispiel:

- Allgemeine Einstellungen
- Personalisierung
- Paketverwaltung
- Sonstiges
- Datenschutz
- Updates
- Über

## Was du anpassen kannst

### Pfade und Speicherung

- Basispfad für Inhalte
- Beschreibbarer Speicherort für verwaltete Dateien
- Einen Speicherort, der besser zu deiner Festplattenstruktur passt

### Erscheinungsbild

- Sprache
- Helles oder dunkles Design
- Verhalten der Akzentfarbe
- Hintergrund- und visuelle Personalisierungsoptionen

#### Hintergrundbild und Oberflächenmaterial

Wähle unter **Personalisierung → Hintergrundbild** einen Bildordner aus und öffne anschließend **Personalisierung → Material und Lesbarkeit**, um das **Oberflächenmaterial** anzupassen – die Ebene zwischen Hintergrundbild und Inhalt. Navigation, Karten, Tabs, Formularelemente und Popup-Flächen nutzen ein gemeinsames Materialsystem. Helle und dunkle Profile werden getrennt gespeichert und automatisch passend zum App-Design angewendet. Mit den Schaltflächen **Hellmodus** / **Dunkelmodus** im Material-Editor legst du lediglich fest, welches Profil gerade bearbeitet und in der Vorschau angezeigt wird.

| Einstellung | Verhalten |
| --- | --- |
| Ausgewogen | Standardvorgabe: weiches Glas mit aktiviertem Lesbarkeitsschutz |
| Klar | Das Hintergrundbild scheint stärker durch die Karten, der Lesbarkeitsschutz ist deaktiviert; ideal für schlichte, kontrastarme Bilder |
| Deckend | Undurchsichtige Karten ohne Kartenunschärfe; außerhalb der Karten bleibt das Hintergrundbild sichtbar |
| Deckkraft der Oberfläche | Ändert die neutrale Tönung der Oberflächen, ohne dass Text, Symbole oder Schaltflächen verblassen |
| Unschärfe der Oberfläche | Steuert die Unschärfe hinter Panels, Navigation und Popup-Flächen; die Bildunschärfe wirkt auf das gesamte Hintergrundbild |
| Hintergrundbild-Overlay | Dämpft das Hintergrundbild im Hellmodus mit einer hellen und im Dunkelmodus mit einer dunklen Tönung – unabhängig von Bildhelligkeit und Deckkraft |
| Lesbarkeitsschutz | Wendet je nach Design, Helligkeit, Bilddeckkraft und Unschärfe eine dezente Mindesttönung an und hebt sekundären Text stärker hervor |

Die Live-Vorschau nutzt dasselbe geladene Bild und dieselben Rendering-Parameter wie das Hauptfenster. Erhöht der Lesbarkeitsschutz die effektive Deckkraft der Karten, zeigt der Editor den tatsächlich angewendeten Wert an. Für diese Berechnung wird das Bild weder analysiert noch hochgeladen. **Dieses Design zurücksetzen** setzt nur das aktuell bearbeitete Materialprofil zurück; der Bildordner und das Profil des anderen Designs bleiben erhalten.

Enthält der Ordner mehrere Bilder, kannst du mit **Nächstes Bild** zwischen ihnen wechseln. Die Reihenfolge **Sequentiell** sortiert natürlich nach Dateinamen, während **Zufällig** vermeidet, das aktuelle Bild direkt zu wiederholen. Ist kein Bild ausgewählt, lässt es sich nicht laden oder beträgt die Bilddeckkraft 0, verwendet die Oberfläche wieder normale Flächen. Bei erhöhtem Kontrast, reduzierter Transparenz oder nicht unterstützten Backdrop-Filtern greift die App auf deckende Ersatzflächen zurück.

### Paketverwaltung

- Integrierter Paketmanager (kompatibel mit [lip](https://github.com/LiteLDev/lip); keine Installation oder Aktualisierung nötig): Entferne heruntergeladene Paketdateien über **Cache leeren**, falls Paket-Downloads fehlschlagen
- **Mirror-Quellen verwenden**: Lädt Launcher-Updates, Pakete und Versionslisten von Mirrors auf dem chinesischen Festland (für Nutzer in Festlandchina standardmäßig aktiviert)
- **GitHub-Proxy** für Paket-Downloads (sichtbar, wenn **Mirror-Quellen verwenden** aktiviert ist): Wähle eine Vorgabe oder gib unter **Benutzerdefiniert** eine eigene URL ein; lasse das Feld leer, um den Standard wiederherzustellen

### Datenschutz

- Nutzungsanalyse (Google Analytics), jederzeit deaktivierbar
- Links zu den Nutzungsbedingungen von Google Analytics und zur Datenschutzerklärung von Google

### Updates

- Nach Updates suchen
- **Beta-Updates erhalten**, um Vorabversionen des Launchers zu beziehen

## Empfohlene Standardeinstellungen

- Speichere verwaltete Dateien auf einem beschreibbaren Laufwerk mit ausreichend freiem Speicherplatz
- Lasse **Beta-Updates erhalten** deaktiviert, sofern du keine Vorabversionen des Launchers testen möchtest
- Richte zuerst eine stabile Grundumgebung ein, bevor du das Erscheinungsbild im Detail anpasst

## Wann es sich lohnt, die Einstellungen zu überprüfen

In folgenden Fällen solltest du einen Blick in die Einstellungen werfen:

- Du möchtest die Installation auf ein anderes Laufwerk verschieben
- Es treten Fehler wegen fehlender Schreibberechtigungen auf
- Du möchtest auf verschiedenen Computern unterschiedliche Erscheinungsbilder oder Pfade nutzen
- Probleme beim Herunterladen oder bei der Erkennung von Komponenten müssen behoben werden
