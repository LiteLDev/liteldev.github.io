# Chargement des mods

Minecraft Bedrock ne prend pas en charge les mods nativement : un mod est du code natif qu'un chargeur injecte dans le processus du jeu au démarrage. Cette page présente les chargeurs utilisés par LeviLauncher, l'emplacement des mods et les différentes façons d'en ajouter.

## Où se trouvent les mods <Badge platform="windows" />

Chaque instance possède un dossier `mods\` (voir [Dossiers & fichiers](../reference/files)). Chaque mod occupe un sous-dossier contenant un fichier `manifest.json` qui le décrit :

| Champ | Signification |
| --- | --- |
| `name` | Le nom du mod. |
| `entry` | Le fichier chargé par le chargeur (un `.dll`), relatif au dossier du mod. |
| `version` | La version du mod. |
| `type` | Le chargeur utilisé : `preload-native` pour le chargeur natif de LeviLauncher ; les mods pour LeviLamina ont leurs propres types. |
| `author` | L'auteur du mod (facultatif). |

Les mods sont propres à chaque instance. L'[isolation](./isolation), qui ne concerne que les données de jeu, ne les affecte pas.

**Désactiver un mod** (dans **Gérer les mods** ou avec `LeviLauncher.exe mod disable`) renomme son `manifest.json` en `manifest.json.close` ; le réactiver rétablit son nom d'origine. Les fichiers du mod restent en place, mais tout chargeur qui recherche `manifest.json` ignore désormais le mod.

## Les deux chargeurs <Badge platform="windows" />

### Le chargeur natif de LeviLauncher

Quand LeviLauncher installe ou prépare une instance, il place son chargeur (`LeviLauncher.dll`) à côté de l'exécutable du jeu et l'ajoute à la table d'importation de l'exécutable pour que Windows le charge avec le jeu. Ce mécanisme fonctionne sur les builds x64, GDK comme UWP, et assure également l'[isolation](./isolation).

Au démarrage du jeu, le chargeur natif parcourt les dossiers de `mods\` par ordre alphabétique et charge l'`entry` de chaque mod dont le `type` est `preload-native`. Les dossiers sans `manifest.json` et les mods d'autres types sont ignorés. Si l'instance dispose d'un autre préchargeur (un fichier `preloader.dll` à côté de l'exécutable du jeu), le chargeur natif lui délègue entièrement le chargement des mods. Le chargeur natif nécessite le runtime Visual C++ (x64), dont LeviLauncher vérifie la présence et propose l'installation.

### LeviLamina

[LeviLamina](https://levimc.org/LeviLamina/) est le chargeur de mods de LeviMC. La plupart des mods de [LeviMC Mods](https://levimc.org/mods/) sont conçus pour LeviLamina : ils requièrent une version de LeviLamina compatible avec la version du jeu de l'instance. Sur les instances GDK des versions prises en charge, LeviLauncher installe LeviLamina comme un paquet via son gestionnaire de paquets intégré (en activant **Installer LeviLamina** lors de l'installation d'une version, ou depuis l'onglet **Chargeur** des **Paramètres de l'instance**).

## Trois façons d'ajouter un mod <Badge platform="windows" />

| Vous ajoutez | Ce que fait LeviLauncher |
| --- | --- |
| Un mod de **LeviMC Mods** (ou `mod install owner/repo`) | L'installe comme paquet via le gestionnaire de paquets intégré, compatible avec [lip](https://github.com/LiteLDev/lip) : il télécharge la version publiée pour cette plateforme, installe ses dépendances et l'enregistre dans le fichier `.lip\state.json` de l'instance. Si le mod requiert LeviLamina et qu'aucune version compatible n'est présente, une version compatible de LeviLamina est d'abord installée. Ces mods peuvent être mis à jour et désinstallés comme des paquets. |
| Un paquet `.mcmod` (ou un `.zip`) | L'extrait dans un nouveau sous-dossier de `mods\`. L'archive doit contenir un fichier `manifest.json`. |
| Un simple `.dll` | Le place dans un nouveau sous-dossier de `mods\` et génère un fichier `manifest.json` avec, par défaut, le nom du fichier comme nom, `preload-native` comme type et `0.0.0` comme version. |

Un paquet indique son environnement d'exécution à l'aide des champs `side` (`client` ou `server`) et `platform` (par exemple `win-x64`), dans son fichier `lip.toml` ainsi que dans `.lip\state.json`. Pour le client, LeviLauncher installe la variante `client` du mod si elle existe, ou sa variante par défaut dans le cas contraire. Consultez [Mods & Intégrations](../guide/mods-integrations) pour plus de détails, notamment sur la migration des anciens paquets.

## Android <Badge platform="android" />

La version Android charge des mods natifs : des bibliothèques `.so` qui s'exécutent dans le processus du jeu. Conservez vos configurations moddées dans des versions isolées et n'installez que des mods provenant de sources fiables. Pour créer un mod, suivez le guide [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) dans la documentation de LeviLamina.

## Pages liées

- [Mods & Intégrations](../guide/mods-integrations)
- [Instances & versions du jeu](./instances)
- [Ligne de commande](../reference/command-line)
