---
platforms: [android]
---
# URI de lancement rapide

Sur Android, le **Lancement Rapide** démarre Minecraft avec une URI `minecraft://` qui indique au jeu ce qu'il doit ouvrir au démarrage. Chaque action de cet écran génère l'une des URI ci-dessous ; **URI Personnalisée** accepte toute URI commençant par `minecraft://`. Le comportement obtenu dépend ensuite de Minecraft.

LeviLauncher prend aussi en charge les liens `minecraft://` ouverts depuis d'autres applications : Android le propose alors parmi les applications capables de les ouvrir.

## Actions

| Action | URI | Demande |
| --- | --- | --- |
| **Comment jouer** | `minecraft://?showHowToPlayScreen=1` | — |
| **Onglet Serveurs** | `minecraft://openServersTab` | — |
| **Profil / Vestiaire** | `minecraft://showProfileScreen` | — |
| **Accueil du Magasin** | `minecraft://openStore` | — |
| **Minecoins** | `minecraft://?showMineCoinOffers=1` | — |
| **Marketplace Pass** | `minecraft://?openCsbPDPScreen=<tab>` | L'onglet : `Home`, `Content`, `Faq` ou `Subscribe` |
| **Se connecter au serveur** | `minecraft://connect/?serverUrl=<adresse>&serverPort=<port>` | L'adresse et le port du serveur (par défaut `19132`) |
| **Ajouter un serveur externe** | `minecraft://?addExternalServer=<nom>\|<adresse>:<port>` | Un nom, l'adresse et le port (par défaut `19132`) |
| **Rejoindre le Realm** | `minecraft://acceptRealmInvite?inviteID=<code>` | Le code d'invitation du Realm |
| **Charger le Monde** | `minecraft://connect/?localWorld=<monde>` | Le nom d'un monde local |
| **Exécuter une Commande** | `minecraft://?slashcommand=<commande>` | Une commande à exécuter dans le jeu |
| **URI Personnalisée** | n'importe quelle `minecraft://…` | L'URI |

Le nom du serveur, le nom du monde et la commande sont encodés dans l'URL (une espace devient `%20`, `/` devient `%2F`).

## Exemple

Pour rejoindre le serveur `play.example.org` sur le port `19132`, choisissez **Se connecter au serveur** ou ouvrez ce lien sur l'appareil :

```text
minecraft://connect/?serverUrl=play.example.org&serverPort=19132
```

Consultez [Comptes & Lancement rapide](../guide/accounts-quick-launch) pour les autres fonctions propres à Android.
