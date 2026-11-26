---
platforms: [android]
---
# Schnellstart-URIs

In der Android-Version startet **Quick Launch** (Schnellstart) Minecraft mit einer `minecraft://`-URI, die dem Spiel angibt, was es zuerst öffnen soll. Jede Aktion auf dem Schnellstart-Bildschirm erzeugt eine der unten aufgeführten URIs; **Custom URI** akzeptiert jede URI, die mit `minecraft://` beginnt. Wie das Spiel eine URI verarbeitet, entscheidet Minecraft selbst. In der App tragen die Aktionen ihre englischen Namen; die deutsche Übersetzung steht hier in Klammern.

LeviLauncher öffnet auch `minecraft://`-Links aus anderen Apps – Android bietet ihn als eine der Apps an, die solche Links öffnen können.

## Aktionen

| Aktion | URI | Fragt nach |
| --- | --- | --- |
| **How to Play** (Spielanleitung) | `minecraft://?showHowToPlayScreen=1` | — |
| **Servers Tab** (Server-Tab) | `minecraft://openServersTab` | — |
| **Profile / Dressing Room** (Profil / Umkleide) | `minecraft://showProfileScreen` | — |
| **Marketplace Home** (Marktplatz-Startseite) | `minecraft://openStore` | — |
| **Minecoins** | `minecraft://?showMineCoinOffers=1` | — |
| **Marketplace Pass** | `minecraft://?openCsbPDPScreen=<tab>` | Dem Tab: `Home`, `Content`, `Faq` oder `Subscribe` |
| **Connect to Server** (Mit Server verbinden) | `minecraft://connect/?serverUrl=<Adresse>&serverPort=<Port>` | Adresse und Port des Servers (Standard: `19132`) |
| **Add External Server** (Externen Server hinzufügen) | `minecraft://?addExternalServer=<Name>\|<Adresse>:<Port>` | Einem Namen, der Adresse und dem Port (Standard: `19132`) |
| **Join Realm** (Realm beitreten) | `minecraft://acceptRealmInvite?inviteID=<Code>` | Dem Einladungscode des Realms |
| **Load World** (Welt laden) | `minecraft://connect/?localWorld=<Welt>` | Dem Namen einer lokalen Welt |
| **Execute Command** (Befehl ausführen) | `minecraft://?slashcommand=<Befehl>` | Einem Befehl, der im Spiel ausgeführt wird |
| **Custom URI** (Eigene URI) | beliebige `minecraft://…` | Der URI |

Servername, Weltname und Befehl werden URL-kodiert (ein Leerzeichen wird zu `%20`, `/` zu `%2F`).

## Beispiel

Um einem Server unter `play.example.org` auf Port `19132` beizutreten, wähle **Connect to Server** oder öffne diesen Link auf dem Gerät:

```text
minecraft://connect/?serverUrl=play.example.org&serverPort=19132
```

Die übrigen Funktionen, die es nur unter Android gibt, findest du unter [Konten & Schnellstart](../guide/accounts-quick-launch).
