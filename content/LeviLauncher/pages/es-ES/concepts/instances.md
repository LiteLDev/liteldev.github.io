# Instancias y versiones del juego

LeviLauncher instala cada copia de Minecraft como una **instancia**: una versión del juego con nombre y configuración propios y, si quieres, con sus propios datos de juego. Puedes tener varias instancias a la vez —de la misma versión o de versiones distintas— e iniciar la que necesites. Todas aparecen en la página **Instancias**.

## Qué es una instancia

=== "Windows"

    Una instancia es una carpeta dentro de la carpeta `Instances` del lanzador (consulta [Carpetas y archivos](../reference/files)). El nombre de la instancia es el de esa carpeta, que contiene:

    - los archivos del juego de una compilación de Minecraft, extraídos de su instalador;
    - `.levilauncher\instance.json`, con los datos que el lanzador guarda sobre la instancia: versión del juego, canal, si usa sus propios datos de juego y opciones de inicio (consola, modo editor, argumentos de inicio y variables de entorno);
    - `mods\`, con los mods de la instancia, y `.lip\`, con el estado de los paquetes instalados mediante el gestor de paquetes integrado (consulta [Cómo se cargan los mods](./mod-loading));
    - los datos de juego propios de la instancia (mundos, paquetes y ajustes) cuando tiene activado el [aislamiento](./isolation).

    Los mods pertenecen siempre a una instancia. En cambio, los datos de juego solo son propios de la instancia si el aislamiento está activado; de lo contrario, la instancia usa los datos de juego habituales de Minecraft en el PC.

=== "Android"

    Una instancia es un APK oficial de Minecraft importado en LeviLauncher. Se ejecuta dentro del lanzador, sin instalarse en el sistema. El Minecraft de Google Play (1.21.80 o posterior) debe seguir instalado en el dispositivo; LeviLauncher lo muestra junto a las versiones importadas.

    El aislamiento de versiones mantiene los mundos, paquetes y ajustes de una versión importada separados de los de la versión instalada desde Google Play. Las versiones importadas suelen necesitar el aislamiento para poder iniciarse.

## Release y Preview

Cada compilación de Minecraft pertenece a un **canal**:

| Canal | Qué es |
| --- | --- |
| Release (oficial) | El juego estable que usa la mayoría de los jugadores. |
| Preview (vista previa) | Compilaciones de prueba de versiones futuras. Pueden romper mundos, paquetes o mods con más frecuencia. |
| Beta | Compilaciones de prueba publicadas solo para UWP. <Badge platform="windows" /> |

En Windows, Release y Preview usan carpetas de datos de juego distintas (`Minecraft Bedrock` y `Minecraft Bedrock Preview`), por lo que una instancia Preview sin aislamiento no comparte mundos con una instancia Release.

## Compilaciones GDK y UWP <Badge platform="windows" />

Minecraft para Windows se ha publicado en dos formatos de paquete, y LeviLauncher instala ambos. Si una versión existe en los dos formatos, se elige GDK.

| | GDK | UWP |
| --- | --- | --- |
| Instalador | `.msixvc`, descargado de un espejo que LeviLauncher mide y elige | `.appx` / `.msix` (o un paquete agrupado), descargado de Windows Update |
| Para instalar | Una cuenta de Microsoft con sesión iniciada que tenga Minecraft | — |
| Para ejecutar | Microsoft Gaming Services y Microsoft GameInput | El modo de desarrollador de Windows, para registrar el paquete en Windows |
| Datos de juego compartidos | `%APPDATA%\Minecraft Bedrock` (Preview: `Minecraft Bedrock Preview`), con una carpeta por perfil de jugador en `Users\` | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` (Preview: `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`) |
| Aislamiento | Todas las versiones | Versiones x64 1.19.70.2 y posteriores |
| LeviLamina | Lo instala LeviLauncher en las versiones compatibles | LeviLauncher no lo instala |
| Argumentos de inicio y variables de entorno | Sí | No |

Al importar un instalador local (`.msixvc`, `.appx`, `.msix`, `.appxbundle` o `.msixbundle`), se instala como GDK o UWP según su extensión.

### Perfiles de jugador {#player-profiles}

Una instancia GDK guarda los mundos, las capturas de pantalla y la lista de servidores por **perfil de jugador**: una carpeta dentro de `Users\` cuyo nombre es el ID del jugador, pero que el lanzador muestra con su gamertag cuando lo conoce. Todos los perfiles comparten los paquetes de recursos y de comportamiento (`Users\Shared\`); los paquetes de skins se comparten a partir de la versión 1.26 del juego, y en versiones anteriores se guardan por perfil. Las instancias UWP no tienen perfiles.

## Registro en Windows <Badge platform="windows" /> {#registration-with-windows}

Windows solo reconoce un único Minecraft instalado por canal. **Registrar** una instancia hace que Windows la trate como ese Minecraft: el menú Inicio, los enlaces `minecraft://` y las funciones de Xbox pasan a usarla. El registro sustituye al que ocupaba el puesto Release o Preview (ya sea el juego de Microsoft Store u otra instancia), cuyos datos se conservan. Registrar o anular el registro nunca toca los datos de juego.

Las instancias UWP se registran automáticamente al iniciarse. Para renombrar o eliminar una instancia registrada, antes hay que anular su registro.

## Páginas relacionadas

- [Gestión de versiones](../guide/version-management)
- [Aislamiento de instancias](./isolation)
- [Carpetas y archivos](../reference/files)
