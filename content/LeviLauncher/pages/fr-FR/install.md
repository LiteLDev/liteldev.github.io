# Installer LeviLauncher

LeviLauncher est disponible sur Windows, sur Android et, en version bêta, sur macOS. L'onglet correspondant à votre appareil est sélectionné automatiquement.

## Ce qu'il vous faut

=== "Windows"

    - Windows 10 ou 11.
    - Une copie sous licence de Minecraft Bedrock Edition (GDK / UWP) provenant du Microsoft Store.

=== "Android"

    - Android 9.0 ou version ultérieure sur un appareil ARM64.
    - Minecraft Bedrock Edition 1.21.80 ou version ultérieure, acheté et installé depuis Google Play sur cet appareil.

=== "macOS"

    - macOS 14.6 ou version ultérieure sur un Mac avec puce Apple.
    - Une copie sous licence de Minecraft Bedrock Edition. LeviLauncher exécute la version Windows du jeu (GDK) via Wine.

::: info iOS
Il n'existe pas de version iOS de LeviLauncher, et nous ne prévoyons pas d'en créer une.
:::

## Installer

=== "Windows"

    1. Ouvrez la page de la [dernière version de LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases/latest) et téléchargez `LeviLauncher-amd64-installer.exe`.
    2. Exécutez-le et suivez l'assistant d'installation. Il demande les droits d'administrateur, car il s'installe par défaut dans `Program Files`. S'il propose d'installer WebView2 ou un autre composant, laissez-le continuer.

    La page de la version contient deux autres fichiers, dont vous n'avez normalement pas besoin :

    | Fichier | Ce que c'est |
    | --- | --- |
    | `LeviLauncher.exe` | La version portable : placez-la seule dans un nouveau dossier dont le chemin ne contient que des lettres anglaises, puis lancez-la depuis ce dossier. |
    | `LeviLauncher.zip` | Le paquet que le lanceur télécharge lorsqu'il se met à jour. |

=== "Android"

    1. Sur l'appareil, ouvrez la page de la [dernière version de LeviLauncher pour Android](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest) et téléchargez le fichier dont le nom se termine par `-release.apk`.
    2. Ouvrez le fichier téléchargé. Si Android indique que votre navigateur n'est pas autorisé à installer des applications, touchez **Paramètres**, activez **Autoriser cette source**, revenez en arrière et touchez **Installer**.

=== "macOS"

    La version macOS est en bêta : elle se trouve parmi les versions marquées **Pre-release**, et non dans la dernière version stable.

    1. Ouvrez la page des [versions de LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases) et cherchez la plus récente contenant `LeviLauncher-macos-arm64-installer.dmg`.
    2. Téléchargez ce fichier, ouvrez-le et faites glisser **LeviLauncher** dans **Applications**.

    Les instances UWP sont réservées à Windows.

## Vérifier que tout fonctionne

Lancez LeviLauncher. Sa fenêtre s'ouvre ; au premier lancement, elle affiche la configuration initiale (Windows, macOS) ou le contrat de licence (Android).

## Mettre à jour

=== "Windows"

    LeviLauncher recherche une version plus récente au démarrage et propose de l'installer ; la mise à jour s'effectue sur place. Pour lancer la vérification vous-même, ouvrez **Paramètres** et cliquez sur **Vérifier la mise à jour**, ou exécutez `LeviLauncher.exe self-update`.

=== "Android"

    Lorsqu'il trouve une version plus récente, LeviLauncher la propose, télécharge son APK et en confie l'installation à Android. Si votre réseau n'accède pas à GitHub, téléchargez le nouvel APK depuis la page des versions et installez-le par-dessus l'application.

=== "macOS"

    LeviLauncher recherche une version plus récente au démarrage et propose de l'installer.

## Versions bêta et anciennes versions

Toutes les versions, avec leurs fichiers et leurs notes de changement, se trouvent sur les pages suivantes :

- Windows et macOS : [versions de LiteLDev/LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases)
- Android : [versions de LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/releases)

Une **bêta** est une version marquée **Pre-release** sur ces pages, par exemple `v1.2.0-beta.1`. Elle donne un aperçu de la prochaine version avant qu'elle ne soit terminée et peut mal fonctionner. Pour en essayer une, téléchargez ses fichiers depuis la page de cette version et installez-les comme ci-dessus. Sous Windows, une installation existante de LeviLauncher peut aussi suivre le canal bêta : activez **Recevoir les mises à jour Bêta** dans les **Paramètres**, et chaque nouvelle bêta vous sera proposée comme mise à jour. Désactivez l'option pour rester sur les versions stables.

## Étapes suivantes

=== "Windows"

    - [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/) (en anglais) : d'un LeviLauncher tout juste installé à votre première partie avec un mod.
    - [Gestion des versions](/fr-FR/guide/version-management?platform=windows)

=== "Android"

    - [Play with mods on Android](https://levimc.org/tutorials/play/play-with-mods-android/) (en anglais) : d'un LeviLauncher tout juste installé à votre première partie avec un mod.
    - [Gestion des versions](/fr-FR/guide/version-management?platform=android)

=== "macOS"

    - [Gestion des versions](/fr-FR/guide/version-management)
    - [Mises à jour & Dépannage](/fr-FR/guide/update-troubleshooting)
