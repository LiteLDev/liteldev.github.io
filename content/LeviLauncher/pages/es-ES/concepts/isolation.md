# Aislamiento de instancias

Minecraft guarda sus mundos, paquetes y ajustes en una única carpeta de datos del juego por dispositivo. El **aislamiento de instancias** (en la aplicación: **Habilitar aislamiento** en **Configuración de instancia**, y **Aislamiento de instancia** al instalar una versión) asigna a una instancia una carpeta de datos propia dentro de su directorio. En la línea de comandos, estos dos modos se llaman *own data* (datos propios) y *shared data* (datos compartidos).

## Datos compartidos y datos propios

=== "Windows"

    Una instancia **sin aislamiento** usa los datos habituales de Minecraft en el PC: comparte los mundos, paquetes y ajustes con el juego de Microsoft Store y con cualquier otra instancia del mismo tipo sin aislamiento.

    Una instancia **con aislamiento** guarda los datos del juego en su propia carpeta. Sus mundos, paquetes de recursos, paquetes de comportamiento, paquetes de skins, capturas de pantalla, lista de servidores y ajustes del juego se mantienen separados de cualquier otra instancia y del juego de Microsoft Store.

    | Instancia | Datos compartidos (aislamiento desactivado) | Datos propios (aislamiento activado) |
    | --- | --- | --- |
    | GDK, Release | `%APPDATA%\Minecraft Bedrock` | `<instancia>\Minecraft Bedrock` |
    | GDK, Preview | `%APPDATA%\Minecraft Bedrock Preview` | `<instancia>\Minecraft Bedrock Preview` |
    | UWP, Release | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<instancia>\Minecraft Bedrock` |
    | UWP, Preview | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe\LocalState` | `<instancia>\Minecraft Bedrock Preview` |
    | UWP, Beta | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<instancia>\Minecraft Bedrock Beta` |

    `<instancia>` es la carpeta de la instancia dentro de `Instances` (consulta [Carpetas y archivos](../reference/files)). En las carpetas de datos GDK, el juego guarda los datos de cada jugador en `Users\` (consulta [perfiles de jugador](./instances#player-profiles)); en las UWP, los guarda en `games\com.mojang\`.

=== "Android"

    El aislamiento de versiones mantiene los datos del juego de una versión (mundos, paquetes y ajustes) separados de las demás versiones y del Minecraft instalado desde Google Play. Cambiar este ajuste en una instancia no afecta a las demás. Las versiones importadas suelen necesitar el aislamiento para iniciarse.

## Cómo funciona <Badge platform="windows" />

El juego por sí mismo no sabe qué es una instancia. Al instalar una instancia, LeviLauncher coloca su cargador, `LeviLauncher.dll`, junto al ejecutable del juego (consulta [Cómo se cargan los mods](./mod-loading)). Cuando el juego se inicia con el aislamiento activado, el cargador redirige las rutas donde el juego busca sus datos (las carpetas de datos de la aplicación y la carpeta temporal) hacia la carpeta de datos de la instancia. No se copia ni se enlaza nada: el juego simplemente lee y escribe directamente allí.

Lo que el aislamiento no cambia:

- **Los mods** son siempre independientes por instancia y se guardan en su carpeta `mods\`, con o sin aislamiento.
- **La cuenta de Microsoft** y la configuración del propio lanzador son las mismas para todas las instancias.
- **El registro** en Windows (consulta [Instancias y versiones del juego](./instances#registration-with-windows)) es independiente del aislamiento.

## Límites <Badge platform="windows" />

- Las instancias GDK admiten el aislamiento en todas las versiones; las UWP, a partir de la versión 1.19.70.2 y solo en x64.
- Activar el aislamiento no copia nada: la instancia empieza con los datos del juego en blanco. Si quieres partir de datos existentes, elige la opción de copiar datos al instalar la versión (desde el juego instalado en el PC o desde otra instancia aislada del mismo tipo), o cópialos más adelante con `LeviLauncher.exe instance copy-data` (GDK).
- Al desactivar el aislamiento, la instancia vuelve a usar los datos compartidos, pero su carpeta de datos propios se conserva dentro de la carpeta de la instancia.
- Al eliminar una instancia se borra su carpeta, **incluidos los mundos de sus datos propios**. Haz antes una copia de seguridad de los mundos importantes (consulta [Herramientas para mundos](../guide/world-tools)).
- Solo se puede copiar contenido de una instancia a otra si la de destino usa datos propios, o si es una instancia UWP que no comparte la misma carpeta de datos.

## Cuándo usarlo

El aislamiento resulta útil cuando buscas:

- tener distintos conjuntos de contenido para diferentes versiones
- probar mods o versiones Preview de Minecraft con mayor seguridad
- reducir el riesgo de que una configuración afecte a otra

Una combinación práctica consiste en tener una instancia Release aislada para jugar habitualmente, una instancia Preview aislada para cuando haga falta y una instancia temporal de pruebas para experimentar con mods o solucionar problemas.

## Páginas relacionadas

- [Gestión de versiones](../guide/version-management)
- [Gestión de contenido](../guide/content-management)
- [Instancias y versiones del juego](./instances)
