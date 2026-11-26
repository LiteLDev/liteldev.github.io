# Mods & Intégrations

LeviLauncher prend en charge la gestion des Mods bien au-delà des fonctions d'un « lanceur de base ».

## Fonctionnalités actuellement disponibles

=== "Windows"

    - Importer des paquets de Mods (`.mcmod`)
    - Importer des paquets `.zip` et des Mods `.dll` autonomes en sélectionnant **Tous les fichiers (\*.\*)** dans le sélecteur de fichiers
    - Activer ou désactiver les Mods installés
    - Supprimer les Mods devenus inutiles
    - Parcourir et récupérer des ressources sur CurseForge
    - Installer des paquets LIP avec le gestionnaire de paquets intégré, compatible avec [lip](https://github.com/LiteLDev/lip)
    - Utiliser des chargeurs de Mods comme LeviLamina

    ::: warning Zone avancée
    La compatibilité des Mods, des chargeurs et des gestionnaires de paquets évolue souvent rapidement, surtout sur les versions Minecraft Preview (Aperçu). Considérez ces outils comme des fonctionnalités avancées et testez vos ajouts progressivement.
    :::

=== "Android"

    - Charger des Mods natifs (bibliothèques `.so`) dans le jeu
    - Conserver chaque configuration moddée dans une version isolée

    Vous développez des Mods natifs ? Consultez [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) dans la documentation de LeviLamina (en anglais).

## Workflow recommandé pour les Mods

1. Partez d'une version isolée propre.
2. Vérifiez d'abord qu'elle démarre normalement sans Mods.
3. Ajoutez un seul Mod ou un petit groupe de modifications à la fois.
4. Testez le lancement après chaque modification.
5. Gardez toujours un moyen de sauvegarder vos mondes importants.

## CurseForge <Badge platform="windows" />

Le lanceur intègre la navigation et la gestion des paquets CurseForge pour vous aider à trouver les bonnes ressources directement depuis l'application.

Cela permet de :

- Bénéficier d'une recherche plus guidée
- Repérer rapidement les fichiers compatibles d'un projet
- Chercher vos ressources sans quitter le lanceur

## lip et LeviLamina <Badge platform="windows" />

LeviLauncher intègre un gestionnaire de paquets compatible avec [lip](https://github.com/LiteLDev/lip) : vous n'avez donc besoin d'installer ni lip ni le runtime .NET séparément. Il fonctionne comme lip : chaque version enregistre ses paquets dans `.lip/state.json`, et les métadonnées des paquets sont lues depuis leur `lip.toml` (les anciens paquets qui n'ont qu'un `tooth.json` restent pris en charge). Les versions contenant LeviLamina ou des paquets LIP installés avec un ancien lanceur (`tooth_lock.json`) sont migrées automatiquement dès la première opération sur les paquets. Lorsque **Utiliser des miroirs** est activé, le téléchargement des paquets depuis GitHub passe par le **Proxy GitHub** défini dans les [Paramètres](./settings-personalization) ; sinon, la connexion à GitHub est directe (en utilisant le proxy système, le cas échéant). Un proxy GitHub enregistré précédemment ou un `github_proxy` défini dans le `config.toml` de lip (dans `%APPDATA%\lip`, par exemple via `lip config set github_proxy <URL>`) s'applique dans les deux cas. **Nettoyer le cache** supprime les fichiers de paquets téléchargés.

Depuis lip v0.40, chaque entrée de `lip.toml` et de `.lip/state.json` indique son environnement d'exécution à l'aide des clés `side` (`server` ou `client`) et `platform` (un identifiant de runtime .NET comme `win-x64`), là où lip v0.39 et les versions antérieures utilisaient `platform` et `runtime`. Tout fichier `.lip/state.json` utilisant les anciennes clés — qu'il ait été généré par lip v0.39 ou antérieur, ou par un ancien lanceur — est converti automatiquement avant l'opération suivante sur les paquets : `platform` devient `side` et `runtime` devient `platform`. Si lip ne parvient toujours pas à lire le fichier, il le rejette avec un message signalant ce changement : renommez alors `platform` en `side` et `runtime` en `platform`, ou réinstallez les paquets de cette version.

Cette intégration s'adresse avant tout aux utilisateurs avancés qui gèrent leurs installations via des paquets ou des chargeurs.

Bonnes pratiques :

- Partez toujours d'une version Release (officielle) stable
- Évitez de modifier plusieurs paramètres risqués en même temps
- Notez la combinaison de versions qui « fonctionnait correctement la dernière fois »

Pour installer LeviLamina sur une version client, consultez [Install client on Windows](https://levimc.org/LeviLamina/user_guides/install_on_client/) dans la documentation de LeviLamina (en anglais).

### Page LeviMC Mods

La page **LeviMC Mods** répertorie les mods de [levimc.org/mods](https://levimc.org/mods/) qui disposent d'une version client pour Windows x64 (une entrée avec `side = "client"` et `platform = "win-x64"`). Vous pouvez les rechercher par nom, ID, auteur, étiquette ou description ; les trier par pertinence, étoiles, dernière mise à jour ou plus récents ; et les filtrer par version du jeu, version de LeviLamina, étiquettes (les étiquettes recommandées comme Bibliothèque / API ou Économie apparaissent en premier, et vous pouvez aussi exclure une étiquette), licence (une famille comme Permissive ou un ID SPDX), dépendances et auteur (**Plus de …** sur la page d'un mod). L'installation d'un mod sélectionne par ordre de priorité sa variante `client`, sa variante par défaut ou la première autre variante compatible avec le client ; la page du mod permet de choisir manuellement l'une de ces variantes. Sur levimc.org, le bouton **Install with LeviLauncher** de la page d'un mod ouvre un lien `levilauncher://install/<mod id>?version=<version>` qui demande à LeviLauncher d'installer cette version du mod.

## Mods natifs <Badge platform="android" />

Les Mods natifs exécutent du code natif dans le processus du jeu. N'installez que des Mods issus de sources fiables, et testez-les d'abord dans une version isolée.

Pour créer les vôtres, consultez [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) dans la documentation de LeviLamina (en anglais).

## Si une erreur survient après avoir ajouté des Mods

- Désactivez d'abord le Mod le plus récent
- Comparez avec la configuration précédente qui fonctionnait
- Transférez ou sauvegardez vos mondes importants avant de poursuivre les tests
- Consultez ensuite la page [Mise à jour et résolution de problèmes](./update-troubleshooting)
