# LeviLauncher installieren

LeviLauncher gibt es für Windows und Android sowie als Beta-Version für macOS. Der Tab für dein Gerät ist bereits ausgewählt.

## Was du brauchst

=== "Windows"

    - Windows 10 oder 11.
    - Eine lizenzierte Kopie der Minecraft Bedrock Edition (GDK / UWP) aus dem Microsoft Store.

=== "Android"

    - Android 9.0 oder neuer auf einem ARM64-Gerät.
    - Minecraft Bedrock Edition 1.21.80 oder neuer, auf diesem Gerät bei Google Play gekauft und installiert.

=== "macOS"

    - macOS 14.6 oder neuer auf einem Mac mit Apple Silicon.
    - Eine lizenzierte Kopie der Minecraft Bedrock Edition. LeviLauncher führt das Windows-Spiel (GDK) über Wine aus.

::: info iOS
Für iOS gibt es keine Version von LeviLauncher, und wir planen auch keine.
:::

## Installieren

=== "Windows"

    1. Öffne das [neueste Release von LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases/latest) und lade `LeviLauncher-amd64-installer.exe` herunter.
    2. Führe die Datei aus und folge dem Einrichtungsassistenten. Da er standardmäßig nach `Program Files` installiert, fragt er nach Administratorrechten. Wenn er WebView2 oder eine andere Komponente installieren möchte, lass ihn fortfahren.

    Das Release enthält zwei weitere Dateien, die du normalerweise nicht brauchst:

    | Datei | Zweck |
    | --- | --- |
    | `LeviLauncher.exe` | Die portable Version: Lege sie einzeln in einen neuen Ordner, dessen Pfad nur englische Buchstaben enthält, und starte sie von dort. |
    | `LeviLauncher.zip` | Das Paket, das der Launcher beim Selbst-Update herunterlädt. |

=== "Android"

    1. Öffne auf dem Gerät das [neueste Release von LeviLauncher für Android](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest) und lade die Datei mit der Endung `-release.apk` herunter.
    2. Öffne die heruntergeladene Datei. Falls Android meldet, dass dein Browser keine Apps installieren darf, tippe auf **Einstellungen**, aktiviere **Dieser Quelle vertrauen**, gehe zurück und tippe auf **Installieren**.

=== "macOS"

    Die macOS-Version ist noch in der Beta-Phase: Du findest sie nicht im neuesten stabilen Release, sondern in den als **Pre-release** markierten Releases.

    1. Öffne die [Releases von LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases) und suche das neueste Release, das `LeviLauncher-macos-arm64-installer.dmg` enthält.
    2. Lade diese Datei herunter, öffne sie und ziehe **LeviLauncher** in **Programme**.

    UWP-Instanzen gibt es nur unter Windows.

## Prüfen, ob es funktioniert

Starte LeviLauncher. Das Fenster öffnet sich und zeigt beim ersten Start die Ersteinrichtung (Windows, macOS) oder die Lizenzvereinbarung (Android).

## Aktualisieren

=== "Windows"

    LeviLauncher sucht beim Start nach einer neueren Version, bietet ihre Installation an und aktualisiert sich direkt vor Ort. Um manuell zu suchen, öffne die **Einstellungen** und klicke auf **Auf Update prüfen**, oder führe `LeviLauncher.exe self-update` aus.

=== "Android"

    Sobald LeviLauncher eine neuere Version findet, bietet er sie an, lädt die APK herunter und übergibt sie an Android zur Installation. Kann dein Netzwerk GitHub nicht erreichen, lade die neue APK selbst aus den Releases herunter und installiere sie über die bestehende App.

=== "macOS"

    LeviLauncher sucht beim Start nach einer neueren Version und bietet ihre Installation an.

## Beta- und ältere Versionen

Alle Versionen samt Dateien und Änderungen findest du auf den Release-Seiten:

- Windows und macOS: [Releases von LiteLDev/LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases)
- Android: [Releases von LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/releases)

Eine **Beta** ist dort als **Pre-release** markiert, etwa `v1.2.0-beta.1`. Sie enthält bereits die Neuerungen der kommenden Version, ist aber noch nicht fertig und kann Fehler enthalten. Um eine Beta auszuprobieren, lade ihre Dateien wie oben beschrieben aus dem jeweiligen Release herunter. Unter Windows kann ein bereits installierter LeviLauncher Betas auch automatisch beziehen: Aktiviere in den **Einstellungen** die Option **Beta-Updates erhalten**, damit er jede neue Beta als Update anbietet. Deaktiviere die Option wieder, um bei stabilen Versionen zu bleiben.

## Nächste Schritte

=== "Windows"

    - [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/) (auf Englisch): vom frisch installierten LeviLauncher zum ersten Spiel mit einer Mod.
    - [Versionsverwaltung](/de-DE/guide/version-management?platform=windows)

=== "Android"

    - [Play with mods on Android](https://levimc.org/tutorials/play/play-with-mods-android/) (auf Englisch): vom frisch installierten LeviLauncher zum ersten Spiel mit einer Mod.
    - [Versionsverwaltung](/de-DE/guide/version-management?platform=android)

=== "macOS"

    - [Versionsverwaltung](/de-DE/guide/version-management)
    - [Update & Fehlerbehebung](/de-DE/guide/update-troubleshooting)
