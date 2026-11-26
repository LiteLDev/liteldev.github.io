# Mises à jour & Dépannage

Si l'installation, la mise à jour ou le lancement de LeviLauncher ne se déroule pas comme prévu, consultez d'abord cette page.

## Problèmes courants <Badge platform="windows" />

### Le lanceur indique que la version Release n'est pas autorisée

Un compte Microsoft ne peut se connecter au Microsoft Store que sur 10 appareils au maximum, et le lanceur compte comme un appareil à part entière.  
Supprimez donc les appareils inutilisés depuis la page de [gestion des appareils du Microsoft Store](https://account.microsoft.com/devices/content).

### Gaming Services manquant ou endommagé

- Suivez le guide intégré au lanceur pour l'installer ou le réparer.
- Si nécessaire, vérifiez l'état d'installation de Minecraft Bedrock dans le Microsoft Store.

### GameInput manquant

- Installez le composant redistribuable requis en suivant les instructions de LeviLauncher.
- Redémarrez ensuite le lanceur si nécessaire.

### Chemin d'installation non accessible en écriture

- Dans **Paramètres → Paramètres généraux**, déplacez le chemin du contenu géré vers un emplacement accessible en écriture.
- Si le lanceur demande les droits d'administrateur pour l'installation ou la mise à jour automatique, accordez-les uniquement si vous faites confiance à la source.

### LeviLauncher se ferme immédiatement ou n'affiche jamais de fenêtre

- Si le lanceur plante systématiquement avant d'afficher l'interface, consultez le fichier `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`.
- Relancez-le une fois après l'échec. Si le problème persiste, ouvrez une Issue sur GitHub en y joignant `startup.log`.

### Une version ne démarre pas

- Vérifiez d'abord si la version démarre sans Mods
- Assurez-vous que les composants Windows requis sont toujours présents
- Vérifiez que la version est complètement installée
- Essayez de reproduire le problème dans un environnement de test propre et isolé

### Téléchargement très lent ou échecs répétés

- Changez de miroir
- Réessayez plus tard
- Utilisez un paquet local si possible

## Problèmes courants sous Android <Badge platform="android" />

### Minecraft est absent ou non pris en charge

Installez ou mettez à jour l'application officielle Minecraft depuis Google Play (version 1.21.80 ou ultérieure), puis rouvrez LeviLauncher.

### Une version importée ne démarre pas

Les versions importées nécessitent souvent l'isolation. Activez cette option dans les paramètres de l'instance, puis réessayez.

### Un lancement échoue

Ouvrez le journal de lancement depuis l'écran d'erreur pour identifier la cause du problème avant de modifier les paramètres.

### Migration des données

Le lanceur peut migrer d'anciens répertoires de données avant de continuer. Ne supprimez pas l'ancien répertoire tant que la migration n'est pas terminée et que vous n'avez pas vérifié la présence de vos mondes, packs et paramètres.

## Étapes de récupération plus sûres

1. Sauvegardez d'abord vos mondes importants.
2. Supprimez les Mods ou packs de ressources récemment ajoutés.
3. Comparez le comportement avec une version isolée et propre.
4. Réinstallez la version concernée si nécessaire.

## À propos de la mise à jour automatique <Badge platform="windows" />

LeviLauncher peut rechercher, télécharger et installer ses propres mises à jour. Si son répertoire d'installation n'est pas accessible en écriture, certaines opérations peuvent nécessiter les droits d'administrateur.

## Quand créer une Issue

Ouvrez un ticket sur GitHub si toutes les conditions suivantes sont réunies :

- Vous parvenez à reproduire le problème de façon fiable
- Le problème persiste après avoir suivi les étapes de récupération de base
- Le problème semble lié à LeviLauncher lui-même plutôt qu'à votre environnement Windows

Dans votre signalement, indiquez autant que possible :

- La version de Windows
- La version de LeviLauncher
- Les étapes exactes permettant de reproduire le problème
- Des captures d'écran ou les journaux (logs), le cas échéant

Signaler un problème : [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

Sous Android, ouvrez votre ticket sur [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues) en précisant la version d'Android, le modèle de l'appareil et le journal de lancement.
