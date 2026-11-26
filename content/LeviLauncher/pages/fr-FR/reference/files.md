---
platforms: [windows]
---
# Dossiers & fichiers

Voici tous les fichiers et dossiers que lit et écrit la version Windows de LeviLauncher (version 1.1.0). Le lanceur n'écrit rien dans le dossier temporaire du système (`%TEMP%`).

## Vue d'ensemble

| Dossier | Emplacement | Contenu |
| --- | --- | --- |
| Dossier des paramètres | `%APPDATA%\LeviLauncher\` | Uniquement `config.json` (léger, suit votre profil Windows itinérant) |
| Dossier local | `%LOCALAPPDATA%\LeviLauncher\` | Journaux, compte Microsoft et données WebView2 de la fenêtre ; sert aussi de racine de données par défaut |
| Racine de données | Le dossier local, sauf si vous en choisissez un autre (**Racine de base** dans **Paramètres → Paramètres généraux**, ou `config set data-root`) | `Instances\`, `Backups\`, `Cache\` |

```text
%APPDATA%\LeviLauncher\
  config.json                      les paramètres du lanceur
%LOCALAPPDATA%\LeviLauncher\        la racine de données par défaut
  Logs\startup.log                 le journal du lanceur, et avant lui startup.1.log … startup.4.log
  Accounts\                        le compte Microsoft et les enregistrements de l'appareil, chiffrés pour votre utilisateur Windows
  WebView2\                        les données de la fenêtre du lanceur
  storage-migration.json           le relevé du déplacement depuis l'ancienne organisation (voir plus bas)
<racine de données>\
  Instances\<instance>\            une instance (voir plus bas)
  Backups\
    Worlds\<instance>\<dossier>_<monde>\<monde>_<yyyyMMdd-HHmmss>.mcworld
    Instances\<instance>\<instance>_<yyyyMMdd-HHmmss>.zip
  Cache\
    Installers\                    installateurs du jeu, et ceux de Visual C++ et WebView2
    Updates\                       mises à jour du lanceur ; supprimées une fois installées
    Downloads\                     fichiers téléchargés pour une importation ; nettoyés au démarrage après 1 jour
    Imports\                       fichiers transmis pour une importation ; nettoyés au démarrage après 1 jour
    gdk-pending-versions.json
    gamertags.json                 les gamertags des profils de joueur que le lanceur a vus
```

Tout le contenu de `Cache\` peut être supprimé sans perte de données. La commande `LeviLauncher.exe cache clean` supprime le cache des paquets, les fichiers téléchargés pour des importations et les téléchargements inachevés, tandis que `LeviLauncher.exe installer remove` supprime les installateurs du jeu téléchargés. Changer la racine de données redirige simplement le lanceur vers un autre dossier : les instances, téléchargements et sauvegardes existants ne sont pas déplacés.

## Le dossier d'une instance

```text
Instances\<instance>\
  Minecraft.Windows.exe …          les fichiers du jeu de la build
  LeviLauncher.dll                 le chargeur natif de LeviLauncher (builds x64)
  .levilauncher\                   l'état du lanceur dans l'instance (caché)
    instance.json                  nom, version du jeu, canal, isolation et options de lancement
    icon.ico                       l'icône de l'instance, créée à partir du LargeLogo.png du jeu
    xbox-auth-key-v1               un marqueur des instances UWP pour la connexion Xbox
  .lip\                            l'état des paquets installés dans l'instance (format de lip)
  mods\                            les mods (voir Chargement des mods)
  Minecraft Bedrock\               les données de jeu, quand l'isolation est activée (Preview : Minecraft Bedrock Preview)
```

Consultez [Isolation des instances](../concepts/isolation) pour connaître les dossiers des données de jeu des instances avec et sans isolation, et [Chargement des mods](../concepts/mod-loading) pour le dossier `mods\`.

## En dehors des dossiers de LeviLauncher

| Chemin | Description |
| --- | --- |
| `Minecraft - <instance>.lnk` sur votre bureau | Raccourci d'une instance (**Créer un raccourci sur le bureau**, ou `instance shortcut`). Il ouvre le lanceur avec `--launch=<instance>`. Seul votre bureau personnel est modifié, pas le bureau public. |
| `%APPDATA%\lip\` | Paramètres de lip (`config.toml`), dont le paramètre `github_proxy` qui est également lu par le gestionnaire de paquets intégré. |
| `%LOCALAPPDATA%\lip\Cache\` | Cache de paquets du gestionnaire de paquets intégré, partagé avec lip. Le bouton **Nettoyer le cache** dans **Paramètres → Gestion des paquets** permet de le vider. |
| `%APPDATA%\Minecraft Bedrock\`, `%APPDATA%\Minecraft Bedrock Preview\` | Données de jeu partagées des instances GDK sans isolation. |
| `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\` (Preview : `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`) | Données de jeu partagées des instances UWP sans isolation. |

## Comment les fichiers sont écrits

- Chaque fichier est d'abord écrit à côté de son emplacement final sous le nom `<nom>.<aléatoire>.tmp`, puis renommé : aucun fichier incomplet n'est donc jamais visible. Un téléchargement inachevé pouvant être repris est conservé sous le nom `<nom>.partial.tmp`.
- Les noms que vous choisissez (instances, mondes) sont nettoyés selon les règles de Windows : les caractères `<>:"/\|?*` ainsi que les points et espaces finaux sont supprimés, et les noms réservés comme `CON` ou `NUL` sont évités.
- Les fichiers générés par le lanceur sont nommés selon le format `<nom>_<yyyyMMdd-HHmmss>.<extension>`, par exemple `MyWorld_20261107-142301.mcworld`.

## L'ancienne organisation

Avant la version 1.1.0, LeviLauncher stockait tout dans `%APPDATA%\<nom du programme>\` (par exemple `%APPDATA%\levilauncher.exe\`), qui regroupait les dossiers `versions\`, `backups\`, `installers\`, `updates\` et `logs\`, ainsi que les fichiers `config.json`, `user_gamertag_map.json` et `gdk_pending_versions.json`. Chaque instance contenait `version.json` et `LargeLogo.ico`.

Au premier démarrage de la version 1.1.0 ou ultérieure, LeviLauncher migre une seule fois ces données vers la nouvelle arborescence décrite ci-dessus, sans rien supprimer : les données situées sur le même lecteur sont renommées sur place, celles situées sur un autre lecteur sont copiées en conservant l'original, et l'ancien `config.json` est renommé en `config.migrated.json`. Si vous aviez personnalisé la racine de données, elle reste à son emplacement. Si un élément ne peut pas être déplacé (par exemple parce que le jeu est en cours d'exécution depuis une instance), toute l'opération est annulée et le lanceur conserve l'ancienne organisation jusqu'au démarrage suivant. Le fichier `storage-migration.json` consigne les éléments déplacés et leur nouvel emplacement ; les raccourcis du bureau sont ensuite mis à jour pour pointer vers ces nouveaux chemins.
