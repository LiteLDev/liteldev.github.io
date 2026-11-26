---
platforms: [windows]
---
# Línea de comandos

Sin argumentos, `LeviLauncher.exe` abre la ventana del lanzador. Con un comando, se ejecuta en la terminal y finaliza; los comandos siguen la sintaxis `<sustantivo> <verbo>`:

```text
LeviLauncher.exe <command> [arguments] [flags]
```

Esta página recoge todos los comandos de LeviLauncher 1.1.0. Ejecuta `LeviLauncher.exe help <command>` para ver las opciones y los ejemplos de un comando concreto, o `LeviLauncher.exe help` para ver el resumen. La salida de la línea de comandos está en inglés.

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe play
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe world export "My World" -o D:\Backups
LeviLauncher.exe instance list --json
```

## Ejecutarlo desde un shell

Como `LeviLauncher.exe` es una aplicación de escritorio, los shells no esperan a que termine de forma predeterminada. Si necesitas obtener su salida antes de que vuelva el prompt, o consultar su código de salida:

- en cmd, usa `start /wait LeviLauncher.exe ...` y luego consulta `%ERRORLEVEL%`;
- en PowerShell, redirige la salida (`LeviLauncher.exe instance list | Out-String`) o usa `Start-Process -Wait -NoNewWindow`.

La línea de comandos no abre la ventana del lanzador y puede usarse mientras esta permanece abierta.

## Comandos

### Uso diario

| Comando | Qué hace |
| --- | --- |
| `play [<instance>]` | Inicia el juego y espera a que aparezca su ventana (alias de `launch`) |
| `install <version\|file>` | Descarga e instala Minecraft como una nueva instancia (= `instance create`) |
| `use [<instance>]` | Establece o muestra la instancia predeterminada |
| `stop [<instance>\|<pid>...]` | Cierra una instancia de Minecraft en ejecución (= `process stop`) |

### Gestionar una instancia

| Comando | Qué hace |
| --- | --- |
| `instance list [<filter>]` | Lista las instancias instaladas |
| `instance show [<instance>]` | Muestra la configuración, el registro, el cargador, los jugadores y el recuento de contenido de una instancia (también `instance <instance>`) |
| `instance create <version\|file>` | Descarga e instala Minecraft como una nueva instancia |
| `instance copy-data [<instance>] --from system\|<instance>` | Copia datos de juego (mundos, ajustes) en una instancia con datos propios |
| `instance rename <instance> <new-name>` | Cambia el nombre de una instancia |
| `instance set [<instance>]` | Cambia la configuración de la instancia (consola, modo editor, datos propios, argumentos, entorno, logotipo) |
| `instance remove <instance>...` | Elimina para siempre instancias y todo el contenido de sus carpetas |
| `instance register [<instance>]` | Hace que Windows trate esta instancia como el Minecraft instalado de su canal |
| `instance unregister [<instance>]` | Anula el registro de la instancia en Windows (los datos de juego se conservan) |
| `instance shortcut [<instance>]` | Crea o elimina un acceso directo en el escritorio para iniciar la instancia |
| `instance path [<instance>] [<kind>]` | Muestra una carpeta de una instancia (y, opcionalmente, la abre) |
| `mod list [<filter>]` | Lista los mods de una instancia |
| `mod show <package>` | Muestra un mod del catálogo |
| `mod search [<words>]` | Busca en el catálogo de mods de LeviLamina |
| `mod install <package[@version]>...` | Instala, actualiza o baja de versión mods del catálogo |
| `mod update [<mod>...]` | Actualiza los mods del catálogo a su versión más reciente |
| `mod import <file>...` | Añade mods desde archivos `.mcmod`, `.zip` o `.dll` |
| `mod set <mod>` | Modifica el manifiesto de un mod |
| `mod remove <mod>...` | Elimina mods de una instancia |
| `mod enable <mod>... \| --all` | Activa mods |
| `mod disable <mod>... \| --all` | Desactiva mods sin eliminarlos |
| `mod path [<mod>]` | Muestra la carpeta de un mod o la carpeta de mods de la instancia |
| `loader versions` | Lista las versiones de LeviLamina disponibles para una versión del juego |
| `loader install [<version>]` | Instala LeviLamina en una instancia o cambia su versión |
| `loader remove` | Elimina LeviLamina de una instancia |
| `world list [<filter>]` | Lista los mundos de una instancia y un jugador |
| `world import <file.mcworld>...` | Importa mundos desde archivos `.mcworld` |
| `world export <world>...` | Exporta (copia de seguridad) mundos como archivos `.mcworld` |
| `world copy <world>...` | Copia mundos a otra instancia |
| `world rename <world> <new-name>` | Cambia el nombre visible de un mundo |
| `world get <world> [<key>[/<sub>...]]` | Lee ajustes del mundo desde `level.dat` |
| `world set <world> <key>[/<sub>...]=<value>...` | Modifica ajustes del mundo en `level.dat` |
| `world remove <world>...` | Elimina mundos para siempre |
| `pack list [<filter>]` | Lista los paquetes de recursos, de comportamiento y de skins |
| `pack import <file.mcpack\|file.mcaddon>...` | Instala paquetes y complementos desde archivos `.mcpack` y `.mcaddon` |
| `pack copy <pack>... \| --all` | Copia paquetes a otra instancia |
| `pack remove <pack>...` | Elimina paquetes instalados |
| `screenshot list` | Lista las capturas de pantalla de una instancia y un jugador, las más recientes primero |
| `screenshot remove <name\|path>... \| --all` | Elimina capturas de pantalla |
| `server list [<filter>]` | Lista los servidores guardados y comprueba si están en línea |
| `player list` | Lista los perfiles de jugador de una instancia GDK |
| `backup list [<instance>]` | Lista las copias de seguridad de instancias y mundos (vista previa) |
| `backup create [<instance>]` | Crea una copia de seguridad de los datos de juego y los mods de una instancia (vista previa) |
| `backup restore [<instance>] <archive.zip>` | Restaura una copia de seguridad de instancia (vista previa) |

### Buscar qué instalar

| Comando | Qué hace |
| --- | --- |
| `installer search [<version>]` | Lista las compilaciones de Minecraft que se pueden instalar |
| `installer download <version>` | Descarga el instalador de una compilación sin instalarla |
| `installer list` | Lista los instaladores descargados, incluidas las descargas sin terminar |
| `installer remove <version\|file>...` | Elimina instaladores descargados para liberar espacio |
| `installer mirrors <version>` | Mide los espejos de descarga de una compilación GDK |
| `curseforge search [<words>]` | Busca en CurseForge mundos, complementos, paquetes y skins (alias del sustantivo: `cf`) |
| `curseforge show <id>` | Muestra un proyecto de CurseForge |
| `curseforge categories` | Lista las clases y categorías de CurseForge por las que filtrar |
| `curseforge install <id>` | Descarga un archivo de CurseForge y lo importa en una instancia |

### Este PC y el lanzador

| Comando | Qué hace |
| --- | --- |
| `process list` | Lista los procesos de Minecraft en ejecución, incluidos los que no inició el lanzador (alias: `ps`) |
| `process stop [<instance>\|<pid>...]` | Fuerza el cierre de Minecraft (se pierde el progreso desde el último guardado automático) |
| `account status` | Muestra la cuenta de Microsoft con sesión iniciada y qué ediciones tiene |
| `account login` | Inicia sesión en una cuenta de Microsoft o cambia de cuenta |
| `account logout` | Olvida la cuenta de Microsoft del lanzador |
| `config list` | Lista los ajustes y carpetas del lanzador |
| `config get <key>` | Muestra el valor de un ajuste |
| `config set <key> <value>` | Cambia un ajuste |
| `config unset <key>` | Devuelve un ajuste a su valor predeterminado |
| `cache clean [packages\|downloads\|partial]...` | Libera el espacio que ocupan las cachés |
| `doctor [--fix [<fix>...]]` | Comprueba lo que Minecraft y los mods necesitan en este PC; `--fix` lo repara (`vcruntime`, `gameinput`, `loader-migration`, `developer-mode`) |
| `self-update` | Actualiza LeviLauncher a la versión más reciente |
| `version` | Muestra la información de la versión |
| `help [<command>...]` | Muestra la ayuda de cualquier comando, con ejemplos |

Todo comando `list` admite el alias `ls`, y todo `remove` admite `rm`. Puedes consultar los ajustes que lee y modifica `config` en [Todos los ajustes](./settings#command-line-keys).

### Versiones y paquetes

- El argumento `<version>` de `install` e `installer` corresponde a una compilación de `installer search`: puede ser exacta (`1.21.50.07`), un prefijo separado por puntos (`1.21.50` selecciona la `1.21.50.x` más reciente; `1.21.5` no coincide con ella) o `latest`. `<file>` es un archivo `.msixvc`, `.appx`, `.msix`, `.appxbundle` o `.msixbundle` local.
- El argumento `<package>` de `mod install` acepta el formato `owner/repo`, `github.com/owner/repo` o una URL, de forma opcional con `#variant` y `@version`.

## Opciones globales

Estas opciones funcionan con todos los comandos:

| Opción | Significado |
| --- | --- |
| `-i`, `--instance <name>` | La instancia sobre la que actuar |
| `-p`, `--player <id\|gamertag>` | El perfil de jugador, en instancias GDK |
| `--json` | Salida legible por máquinas en stdout |
| `-q`, `--quiet` | Solo muestra identificadores, sin progreso ni avisos |
| `-v`, `--verbose` | Muestra más detalles y envía el registro del lanzador a stderr |
| `-y`, `--yes` | Responde sí a las confirmaciones |
| `--no-input` | No pregunta nunca |
| `-h`, `--help` | Muestra la ayuda de un comando |
| `--version` | Muestra la versión |

**Qué instancia:** la indicada con `-i`; en su defecto, la variable de entorno `LEVILAUNCHER_INSTANCE`, la instancia predeterminada (`use`) o la única instancia existente. **Qué jugador:** el indicado con `-p`; en su defecto, `LEVILAUNCHER_PLAYER`, el único perfil existente o el perfil de la cuenta con sesión iniciada.

## Salida

- Los resultados se envían a stdout. El progreso, los avisos y los errores van a stderr; los errores empiezan por `error:`, e incluyen un consejo (`hint:`) y un código como `[ERR_GAME_RUNNING]`.
- `--json` emite un único documento JSON: un array para las listas y un objeto en los demás casos, con claves en camelCase, fechas en formato RFC 3339 y tamaños en bytes.
- `-q` muestra únicamente los identificadores, uno por línea.

## Códigos de salida

| Código | Significado |
| --- | --- |
| 0 | Correcto |
| 1 | Error |
| 2 | Error de uso |
| 3 | No encontrado |
| 4 | Conflicto (por ejemplo, el juego ya está en ejecución) |
| 5 | Error de inicio de sesión o licencia |
| 6 | Error de red |
| 7 | Completado parcialmente |
| 8 | Requiere un cambio en el sistema o permisos de administrador |
| 9 | Tiempo de espera agotado |
| 10 | Cancelado |
| 130 | Interrumpido (Ctrl-C) |

`launch --wait-exit` devuelve en su lugar el código de salida del propio juego.

## Argumentos de la ventana

Estos argumentos abren la ventana del lanzador en lugar de ejecutar un comando:

| Argumento | Efecto |
| --- | --- |
| `--launch=<instance>` | Abre el lanzador e inicia la instancia (lo usan los accesos directos del escritorio). Si el lanzador ya está abierto, inicia la instancia en esa misma ventana. |
| `--debug` | Muestra además el registro del lanzador en una ventana de consola (también funcionan `debug`, `-debug` y `/debug`). |
