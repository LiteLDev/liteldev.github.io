---
platforms: [windows]
---
# Tous les paramètres

Voici tous les paramètres de la page **Paramètres** de la version Windows (LeviLauncher 1.1.0), onglet par onglet, ainsi que la clé `config` correspondante en [ligne de commande](./command-line) lorsqu'elle existe. Le champ de recherche en haut de la page permet de trouver un paramètre par son nom. Pour savoir quels réglages modifier, consultez [Paramètres & Personnalisation](../guide/settings-personalization).

## Paramètres généraux

| Paramètre | Ce qu'il fait | Clé |
| --- | --- | --- |
| **Chemins du contenu → Racine de base** | Racine des données : le dossier qui contient les instances, les téléchargements et les sauvegardes (voir [Dossiers & fichiers](./files)). **Appliquer** enregistre un nouveau dossier, **Réinitialiser** rétablit celui par défaut. Les dossiers **Installateurs** et **Versions** s'affichent en dessous. Les données existantes ne sont pas déplacées. | `data-root` |
| **Langue** | Langue du lanceur. | — |
| **Discord Rich Presence** | Affiche votre statut de jeu sur Discord. Activé par défaut. | `discord` |
| **Au lancement de Minecraft** | Action du lanceur au démarrage de Minecraft : **Minimiser le lanceur** (par défaut), **Masquer le lanceur**, **Fermer le lanceur** ou **Laisser le lanceur ouvert**. | `on-game-launch` |
| **À la fermeture de Minecraft** | Action du lanceur à la fermeture de Minecraft : **Rouvrir le lanceur** (par défaut), **Ne rien faire** ou **Fermer le lanceur**. | `on-game-exit` |
| **Masquer dans la zone de notification à la fermeture** | Le bouton de fermeture masque le lanceur dans la zone de notification au lieu de le quitter ; le bouton de réduction le réduit toujours dans la barre des tâches. Désactivé par défaut. | `close-to-tray` |

## Personnalisation

Cet onglet comporte quatre parties. Les paramètres de personnalisation (couleurs, opacité, etc.) sont enregistrés séparément pour le thème clair et le thème sombre (**Paramètres par mode**) : sélectionnez **Mode clair** ou **Mode sombre** pour modifier l'un ou l'autre.

### Thème et couleurs

| Paramètre | Ce qu'il fait |
| --- | --- |
| **Mode du thème** | **Mode clair**, **Mode sombre**, **Programmation manuelle** (sombre entre une **Heure de début du mode sombre** et une **Heure de fin du mode sombre**), **Lever/Coucher du soleil** (selon les heures locales de lever et de coucher du soleil, calculées sur l'appareil) ou **Suivre le système** (le réglage de Windows). |
| **Couleur du thème** | Couleur d'accentuation : l'une des **Couleurs prédéfinies**, l'une de **Plus de couleurs**, ou une **Couleur personnalisée**. |
| **Mode de base** | Couleur unie affichée sous l'image d'arrière-plan pour améliorer le contraste : **Aucun**, **Suivre la couleur du thème** ou **Couleur personnalisée**, avec son **Opacité de base**. |

### Disposition et animations

| Paramètre | Ce qu'il fait |
| --- | --- |
| **Utiliser la barre de navigation supérieure** | Affiche une barre de navigation en haut plutôt que la barre latérale verticale. |
| **Désactiver les animations** | Désactive les animations de transition de l'interface. |

### Fond d'écran

| Paramètre | Ce qu'il fait |
| --- | --- |
| **Image d'arrière-plan** | Dossier d'images à utiliser comme arrière-plan : **Sélectionner un dossier**, **Ouvrir le dossier**, **Effacer le dossier**, et **Image suivante** lorsque le dossier contient plusieurs images. |
| **Mode d'ajustement** | **Intelligent**, **Centré**, **Ajuster**, **Étirer**, **Mosaïque**, **Haut gauche** ou **Haut droit**. |
| **Ordre de lecture** | **Aléatoire** ou **Séquentiel** (ordre naturel des noms de fichiers). |
| **Flou d'arrière-plan**, **Luminosité de l'arrière-plan**, **Opacité de l'arrière-plan** | Règlent le rendu de l'image. |

### Matériaux et lisibilité

| Paramètre | Ce qu'il fait |
| --- | --- |
| **Matériau de l'interface** | Aspect de la navigation, des cartes, des onglets, des contrôles et des fenêtres contextuelles par-dessus le fond d'écran. **Préréglages de matériau** : **Équilibré** (par défaut), **Transparent** ou **Opaque**. |
| **Opacité de l'interface**, **Flou de l'interface**, **Voile sur le fond d'écran** | Affinent le rendu du matériau. |
| **Protection de la lisibilité** | Maintient la lisibilité du texte en appliquant une teinte minimale aux surfaces, selon le thème, la luminosité de l'image et le flou. |
| **Réinitialiser ce thème** | Rétablit le matériau par défaut du thème en cours de modification. |

La page [Paramètres & Personnalisation](../guide/settings-personalization#fond-d-ecran-et-materiau-de-l-interface) détaille chacun de ces réglages.

## Gestion des paquets

| Paramètre | Ce qu'il fait | Clé |
| --- | --- | --- |
| **Nettoyer le cache** | Supprime les fichiers de paquets téléchargés par le gestionnaire de paquets ; utile en cas d'échec de téléchargement de paquets. | `cache clean packages` |
| **Utiliser des miroirs** | Télécharge les mises à jour du lanceur, les paquets et les listes de versions depuis des miroirs hébergés en Chine continentale. Activé par défaut pour les utilisateurs situés en Chine continentale. | `mirror` |
| **Proxy GitHub** | Proxy GitHub utilisé pour télécharger les paquets (affiché lorsque **Utiliser des miroirs** est activé). Choisissez un préréglage ou **Personnalisé** pour saisir une URL. Laisser ce champ vide rétablit la valeur par défaut (`https://gh-proxy.org/https://github.com`). | `github-proxy` |

## Autres

| Paramètre | Ce qu'il fait |
| --- | --- |
| **Gestionnaire de processus → Scanner les processus** | Liste les processus Minecraft en cours. **Terminer la tâche** en arrête un, **Terminer tous les processus** les arrête tous. Toute progression non sauvegardée peut être perdue. |
| **Fonctionnalités expérimentales → Sauvegarde d'instance (Expérimental)** | Ajoute des options de sauvegarde et de restauration aux **Paramètres de l'instance**. Un avertissement s'affiche lors de l'activation. |

## Confidentialité

| Paramètre | Ce qu'il fait |
| --- | --- |
| **Statistiques d’utilisation (Google Analytics)** | Envoie des statistiques d'utilisation pour aider à améliorer le lanceur. Désactivable à tout moment. Inclut des liens vers les **Conditions de Google Analytics** et les **Règles de confidentialité de Google**. |

## Mises à jour

| Paramètre | Ce qu'il fait | Clé |
| --- | --- | --- |
| **Recevoir les mises à jour Bêta** | Propose également les préversions du lanceur. Désactivé par défaut. | `beta-updates` |
| **Version actuelle → Vérifier la mise à jour** | Affiche la version actuelle du lanceur et recherche une version plus récente. | `self-update --check` |

## À propos

Crédits du lanceur et liens vers LiteLDev sur GitHub et la communauté Discord.

## Clés de la ligne de commande {#command-line-keys}

`LeviLauncher.exe config list` affiche chaque clé avec sa valeur et son origine : `set` (enregistrée), `default` (par défaut), `auto` (détectée) ou `lip` (issue du fichier `config.toml` de lip). `config set <key> <value>` modifie une clé et `config unset <key>` rétablit sa valeur par défaut.

| Clé | Valeurs | Signification |
| --- | --- | --- |
| `data-root` | un dossier | Emplacement des instances, téléchargements et sauvegardes (les données existantes ne sont pas déplacées) |
| `default-instance` | une instance | Instance utilisée par les commandes lorsqu'aucune n'est précisée (identique à `use`) |
| `mirror` | `on`, `off` | Télécharger depuis des miroirs en Chine continentale (si non défini : détecté selon la région) |
| `github-proxy` | une URL http(s) | Proxy GitHub pour le téléchargement de mods (utilisé lorsque les miroirs sont activés, ou s'il est défini explicitement) |
| `beta-updates` | `on`, `off` | Proposer les préversions du lanceur (`off` par défaut) |
| `discord` | `on`, `off` | Afficher Discord Rich Presence en jeu, uniquement depuis la fenêtre du lanceur (`on` par défaut) |
| `on-game-launch` | `minimize`, `hide`, `close`, `keep` | Comportement de la fenêtre du lanceur au lancement du jeu (`minimize` par défaut) |
| `on-game-exit` | `reopen`, `keep`, `close` | Comportement de la fenêtre du lanceur à la fermeture du jeu (`reopen` par défaut) |
| `close-to-tray` | `on`, `off` | Réduire le lanceur dans la zone de notification à la fermeture de la fenêtre (`off` par défaut) |

Clés en lecture seule, affichées par `config list` et `config get` : `instances-dir`, `installers-dir`, `backups-dir`, `cache-dir`, `logs-dir` (voir [Dossiers & fichiers](./files)) et `config-file` (le fichier de configuration, `%APPDATA%\LeviLauncher\config.json`).
