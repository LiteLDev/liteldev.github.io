# Instances & versions du jeu

LeviLauncher installe chaque copie de Minecraft comme une **instance** : une version du jeu avec son propre nom, ses propres paramètres et, si vous le souhaitez, ses propres données de jeu. Vous pouvez garder plusieurs instances côte à côte, d'une même version ou de versions différentes, et lancer celle dont vous avez besoin. Elles s'affichent toutes sur la page **Instances**.

## Ce qu'est une instance

=== "Windows"

    Une instance est un sous-dossier du dossier `Instances` du lanceur (voir [Dossiers & fichiers](../reference/files)), dont elle tire son nom. Ce dossier contient :

    - les fichiers du jeu d'une build de Minecraft, extraits de son installateur ;
    - `.levilauncher\instance.json`, qui enregistre les paramètres de l'instance : version du jeu, canal, isolation des données de jeu et options de lancement (console, mode éditeur, arguments de lancement, variables d'environnement) ;
    - `mods\`, pour les mods de l'instance, et `.lip\`, pour l'état des paquets installés avec le gestionnaire de paquets intégré (voir [Chargement des mods](./mod-loading)) ;
    - les données de jeu propres à l'instance (mondes, packs, paramètres) lorsque l'[isolation](./isolation) est activée.

    Les mods sont toujours propres à une instance. En revanche, les données de jeu ne lui appartiennent que si l'isolation est activée ; sinon, l'instance utilise l'emplacement habituel de Minecraft sur ce PC.

=== "Android"

    Une instance est un APK officiel de Minecraft importé dans LeviLauncher. Elle s'exécute directement dans le lanceur, sans être installée sur le système. La version Google Play de Minecraft (1.21.80 ou ultérieure) doit tout de même être installée sur l'appareil ; LeviLauncher l'affiche à côté des versions importées.

    L'isolation des versions sépare les mondes, les packs et les paramètres d'une version importée de ceux de la version Google Play installée. Les versions importées en ont souvent besoin pour se lancer.

## Release et Preview

Chaque build de Minecraft appartient à un **canal** :

| Canal | Description |
| --- | --- |
| Release (officielle) | La version stable utilisée par la plupart des joueurs. |
| Preview (aperçu) | Les builds de test des prochaines versions, plus susceptibles de corrompre les mondes, les packs ou les mods. |
| Beta | Des builds de test publiées uniquement pour UWP. <Badge platform="windows" /> |

Sous Windows, les canaux Release et Preview ont chacun leur propre dossier de données de jeu (`Minecraft Bedrock` et `Minecraft Bedrock Preview`). Une instance Preview sans isolation ne partage donc pas ses mondes avec une instance Release.

## Builds GDK et UWP <Badge platform="windows" />

Minecraft pour Windows a été distribué sous deux formats de paquet, tous deux pris en charge par LeviLauncher. Lorsqu'une version existe dans les deux formats, GDK est retenu.

| | GDK | UWP |
| --- | --- | --- |
| Installateur | `.msixvc`, téléchargé depuis un miroir testé et sélectionné par LeviLauncher | `.appx` / `.msix` (ou un bundle), téléchargé depuis Windows Update |
| Pour installer | Un compte Microsoft connecté qui possède Minecraft | — |
| Pour lancer | Microsoft Gaming Services et Microsoft GameInput | Le mode développeur de Windows, pour enregistrer le paquet auprès du système |
| Données de jeu partagées | `%APPDATA%\Minecraft Bedrock` (Preview : `Minecraft Bedrock Preview`), un dossier par profil de joueur sous `Users\` | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` (Preview : `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`) |
| Isolation | Toutes les versions | Versions x64 1.19.70.2 et ultérieures |
| LeviLamina | Installé par LeviLauncher sur les versions prises en charge | Non installé par LeviLauncher |
| Arguments de lancement et variables d'environnement | Oui | Non |

Si vous importez un installateur local (`.msixvc`, `.appx`, `.msix`, `.appxbundle` ou `.msixbundle`), il est installé en tant que GDK ou UWP selon son extension.

### Profils de joueur {#player-profiles}

Une instance GDK sépare les mondes, les captures d'écran et la liste des serveurs par **profil de joueur** : chaque profil correspond à un sous-dossier de `Users\` nommé d'après l'ID du joueur, que le lanceur affiche avec son gamertag lorsqu'il le connaît. Les packs de ressources et de comportements sont partagés entre tous les profils (`Users\Shared\`). Les packs de skins sont également partagés à partir de la version 1.26, mais rangés par profil dans les versions antérieures. Les instances UWP n'utilisent pas de profils.

## Enregistrement auprès de Windows <Badge platform="windows" /> {#registration-with-windows}

Windows ne reconnaît qu'une seule installation de Minecraft par canal. **Enregistrer** une instance indique à Windows de l'utiliser comme installation de référence pour le menu Démarrer, les liens `minecraft://` et les fonctionnalités Xbox. L'enregistrement prend la place de l'installation actuellement enregistrée pour le canal Release ou Preview (qu'il s'agisse du jeu du Microsoft Store ou d'une autre instance), tout en conservant ses données. Enregistrer ou désenregistrer une instance n'affecte jamais les données de jeu.

Les instances UWP sont automatiquement enregistrées au lancement. Pour renommer ou supprimer une instance enregistrée, vous devez d'abord la désenregistrer.

## Pages liées

- [Gestion des versions](../guide/version-management)
- [Isolation des instances](./isolation)
- [Dossiers & fichiers](../reference/files)
