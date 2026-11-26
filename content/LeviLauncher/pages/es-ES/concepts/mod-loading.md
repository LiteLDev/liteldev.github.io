# Cómo se cargan los mods

Minecraft Bedrock no admite mods de forma nativa: un mod es código nativo que un cargador inyecta en el proceso del juego al iniciarse. Esta página explica qué cargadores usa LeviLauncher, dónde se guardan los mods y cómo funciona cada método para añadirlos.

## Dónde están los mods <Badge platform="windows" />

Cada instancia tiene una carpeta `mods\` (consulta [Carpetas y archivos](../reference/files)). Cada mod ocupa una subcarpeta e incluye un archivo `manifest.json` que lo describe:

| Campo | Significado |
| --- | --- |
| `name` | El nombre del mod. |
| `entry` | El archivo que ejecuta el cargador, relativo a la carpeta del mod (un `.dll`). |
| `version` | La versión del mod. |
| `type` | Qué cargador lo ejecuta: `preload-native` para el cargador nativo de LeviLauncher; los mods para LeviLamina tienen sus propios tipos. |
| `author` | El autor (opcional). |

Los mods pertenecen a una instancia y no se ven afectados por el [aislamiento](./isolation), que solo se aplica a los datos de juego.

**Desactivar un mod** (en **Gestionar Mods** o con `LeviLauncher.exe mod disable`) renombra su `manifest.json` a `manifest.json.close`; activarlo restaura el nombre original. Los archivos del mod permanecen intactos, pero cualquier cargador que busque `manifest.json` ignorará el mod.

## Los dos cargadores <Badge platform="windows" />

### El cargador nativo de LeviLauncher

Al instalar o preparar una instancia, LeviLauncher coloca su cargador (`LeviLauncher.dll`) junto al ejecutable del juego y lo añade a su tabla de importaciones para que Windows lo cargue junto con el juego. Esto funciona en compilaciones x64, tanto GDK como UWP, y también es lo que permite el [aislamiento](./isolation).

Al iniciarse el juego, el cargador nativo recorre las carpetas de `mods\` por orden alfabético y carga el `entry` de cada mod cuyo `type` sea `preload-native`. Se omiten las carpetas sin `manifest.json` y los mods de otros tipos. Si la instancia cuenta con otro precargador (un `preloader.dll` junto al ejecutable del juego), el cargador nativo le delega toda la carga de mods. El cargador nativo requiere el runtime de Visual C++ (x64); LeviLauncher comprueba si está presente y ofrece instalarlo si falta.

### LeviLamina

[LeviLamina](https://levimc.org/LeviLamina/) es el cargador de mods de LeviMC. La mayoría de los mods de [LeviMC Mods](https://levimc.org/mods/) son para LeviLamina y requieren una versión de este compatible con la versión del juego de la instancia. LeviLauncher instala LeviLamina como un paquete mediante su gestor integrado en las instancias GDK de las versiones compatibles (usando el interruptor **Instalar LeviLamina** al instalar una versión, o desde la pestaña **Cargador** en **Configuración de instancia**).

## Tres formas de añadir un mod <Badge platform="windows" />

| Si añades | Qué hace LeviLauncher |
| --- | --- |
| Un mod de **LeviMC Mods** (o `mod install owner/repo`) | Lo instala como paquete con el gestor integrado, compatible con [lip](https://github.com/LiteLDev/lip): descarga la versión publicada para tu plataforma, instala sus dependencias y lo registra en el archivo `.lip\state.json` de la instancia. Si el mod requiere LeviLamina y no está instalado (o la versión instalada no es compatible), instala primero un LeviLamina compatible. Estos mods se pueden actualizar y desinstalar como paquetes. |
| Un paquete `.mcmod` (o un `.zip`) | Lo extrae en una carpeta nueva dentro de `mods\`. El archivo comprimido debe contener un `manifest.json`. |
| Un único `.dll` | Lo coloca en una carpeta nueva dentro de `mods\` y genera un `manifest.json` automáticamente: por defecto, usa el nombre del archivo como nombre, `preload-native` como tipo y `0.0.0` como versión. |

Un paquete indica su entorno de ejecución mediante los campos `side` (`client` o `server`) y `platform` (por ejemplo, `win-x64`), tanto en su `lip.toml` como en `.lip\state.json`. Para el cliente, LeviLauncher instala la variante `client` del mod si existe y, de lo contrario, la variante predeterminada. Consulta [Mods e integraciones](../guide/mods-integrations) para más detalles, incluida la migración de paquetes antiguos.

## Android <Badge platform="android" />

La versión para Android carga mods nativos: bibliotecas `.so` que se ejecutan en el proceso del juego. Usa versiones aisladas para las configuraciones con mods e instala únicamente mods de fuentes de confianza. Para crear uno, consulta la guía [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) en la documentación de LeviLamina.

## Páginas relacionadas

- [Mods e integraciones](../guide/mods-integrations)
- [Instancias y versiones del juego](./instances)
- [Línea de comandos](../reference/command-line)
