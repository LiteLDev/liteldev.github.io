# Gestion des versions

LeviLauncher traite chaque environnement installé comme une version gérable indépendamment. Dans l'application, ces versions sont appelées des instances et figurent sur la page **Instances**.

## Ce que vous pouvez faire

=== "Windows"

    - Installer des versions Release ou Preview
    - Donner un nom explicite à la version
    - Lancer rapidement une version précise
    - Supprimer les versions inutilisées
    - Ouvrir les paramètres propres à la version
    - Créer un raccourci bureau pour la version

=== "Android"

    - Importer des APK officiels de Minecraft et les exécuter dans le lanceur sans installer chaque version sur le système
    - Conserver plusieurs versions et leurs données séparément
    - Choisir la version démarrée depuis l'écran de lancement

## Différence entre Release (officielle) et Preview (Aperçu) <Badge platform="windows" />

| Type | Pour qui ? | Description |
| --- | --- | --- |
| Release (officielle) | Jeu quotidien stable | Convient à la majorité des joueurs |
| Preview (Aperçu) | Test des nouveautés | Plus susceptible d'introduire des changements de compatibilité pour les mondes, les packs ou les mods |

## Qu'est-ce que l'isolation ?

=== "Windows"

    L'isolation est prise en charge pour les versions GDK ainsi que pour les versions UWP x64 1.19.70.2 ou ultérieures. Lorsqu'elle est activée, LeviLauncher enregistre les données de la version dans son propre espace de travail plutôt que dans l'emplacement par défaut partagé.

    L'isolation répond notamment aux besoins suivants :

    - Utiliser des combinaisons de contenus différentes selon les versions
    - Tester des mods ou des versions Minecraft Preview (Aperçu) avec moins de risques
    - Éviter qu'un environnement en perturbe un autre

=== "Android"

    Activez l'isolation sur une version importée si ses mondes, packs et paramètres doivent rester séparés de la version installée depuis Google Play. Les versions importées ont souvent besoin de l'isolation pour démarrer.

## Opérations courantes sur les versions <Badge platform="windows" />

### Installer une nouvelle version

Installez la version depuis la page **Télécharger**, puis revenez sur **Lancer** pour la démarrer.

Sur la page d'installation, l'option **Installer LeviLamina** est activée par défaut ; désactivez-la pour installer le jeu sans LeviLamina. Cette option ne concerne que les versions prises en charge par LeviLamina.

### Renommer une version

Dans **Instances** ou **Paramètres de l'instance**, donnez-lui un nom qui reflète son usage, par exemple `Release Survival` ou `Preview Test`.

### Supprimer une version

Supprimez les versions dont vous n'avez plus besoin, en particulier les environnements Minecraft Preview (Aperçu) une fois vos tests terminés.

::: warning Confirmez avant de supprimer
La suppression d'une version peut entraîner la perte du contenu associé à cet environnement géré. Sauvegardez d'abord vos mondes importants.
:::

### Créer un raccourci bureau

Dans le menu situé à côté du bouton **Lancer**, sélectionnez **Créer un raccourci sur le bureau** pour créer un raccourci permettant de lancer directement cette version.

## Stratégie recommandée pour les versions <Badge platform="windows" />

- Une version Release (officielle) isolée pour le jeu quotidien
- Une version Preview (Aperçu) isolée, utilisée uniquement au besoin
- Une version de test temporaire pour les mods ou le dépannage

## Lectures associées

- [Téléchargements et miroirs](./downloads-mirrors)
- [Outils pour les mondes](./world-tools)
- [Mise à jour et résolution de problèmes](./update-troubleshooting)
