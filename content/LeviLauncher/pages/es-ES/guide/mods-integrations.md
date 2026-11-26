# Mods e integraciones

LeviLauncher admite flujos de trabajo con Mods que van más allá de un "lanzador básico".

## Capacidades actuales

=== "Windows"

    - Importar paquetes de Mods (`.mcmod`)
    - Todavía se aceptan paquetes `.zip` y Mods `.dll` sueltos: elige **Todos los archivos (\*.\*)** en el selector de archivos
    - Activar o desactivar Mods instalados
    - Eliminar los Mods que ya no necesites
    - Explorar y obtener recursos de CurseForge
    - Instalar paquetes LIP con el gestor de paquetes integrado, compatible con [lip](https://github.com/LiteLDev/lip)
    - Trabajar con cargadores como LeviLamina

    ::: warning Esta es un área avanzada
    La compatibilidad de Mods, cargadores e integraciones de paquetes suele cambiar con más rapidez, sobre todo en la versión de vista previa (Preview) de Minecraft. Trátalo como una función avanzada y prueba cada cambio paso a paso.
    :::

=== "Android"

    - Cargar Mods nativos (bibliotecas `.so`) en el juego
    - Mantener configuraciones con Mods en versiones aisladas

    ¿Quieres crear Mods nativos? Consulta [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) en la documentación de LeviLamina (en inglés).

## Flujo de trabajo recomendado para Mods

1. Empieza con una versión aislada limpia.
2. Comprueba primero que esa versión inicie bien sin Mods.
3. Añade solo un Mod o un grupo pequeño de cambios cada vez.
4. Vuelve a probar el inicio tras cada cambio.
5. Mantén siempre una copia de seguridad de los mundos importantes.

## CurseForge <Badge platform="windows" />

El lanzador permite explorar y descargar paquetes de CurseForge para que encuentres recursos adecuados cómodamente sin salir de la aplicación.

Resulta útil si:

- Buscas una experiencia de exploración más guiada
- Quieres ver de un vistazo los archivos compatibles de un proyecto
- Prefieres no hacer todas las búsquedas fuera del lanzador

## lip y LeviLamina <Badge platform="windows" />

LeviLauncher incluye un gestor de paquetes integrado compatible con [lip](https://github.com/LiteLDev/lip), por lo que no necesitas instalar lip ni el runtime de .NET por separado. Sigue el esquema de lip: cada versión registra sus paquetes en `.lip/state.json` y lee la información de cada paquete desde su `lip.toml` (los paquetes antiguos que solo tienen un `tooth.json` siguen funcionando). Las versiones que ya tengan LeviLamina o paquetes LIP instalados con un lanzador anterior (`tooth_lock.json`) se migran automáticamente en la primera operación de paquetes. Si activas **Usar servidores espejo**, las descargas desde GitHub pasan por el **Proxy de GitHub** configurado en [Ajustes](./settings-personalization); de lo contrario, se conectan directamente a GitHub (usando el proxy del sistema, si hay uno configurado). En ambos casos se aplica cualquier proxy de GitHub guardado previamente o el `github_proxy` definido en el `config.toml` de lip (en `%APPDATA%\lip`, por ejemplo con `lip config set github_proxy <URL>`). **Limpiar caché** elimina los archivos de paquetes descargados.

Desde lip v0.40, cada entrada de `lip.toml` y de `.lip/state.json` indica dónde se ejecuta mediante `side` (`server` o `client`) y `platform` (un identificador de runtime de .NET como `win-x64`); en lip v0.39 y versiones anteriores, estas claves se llamaban `platform` y `runtime`. Si un archivo `.lip/state.json` se generó con las claves antiguas (ya sea con lip v0.39 o anterior, o con un lanzador antiguo), se convierte automáticamente antes de la siguiente operación de paquetes: `platform` pasa a `side` y `runtime` a `platform`. Si lip sigue sin poder leer el archivo, lo rechazará con un mensaje que explica el cambio: renombra `platform` a `side` y `runtime` a `platform`, o reinstala los paquetes de esa versión.

Esta integración está pensada para usuarios avanzados que trabajan con paquetes o cargadores.

Buenas prácticas:

- Empieza siempre con una versión oficial (Release) estable
- No modifiques varios factores de alto riesgo a la vez
- Anota la última combinación de versiones que te funcionó ("por última vez")

Para añadir LeviLamina a una versión de cliente, consulta [Install client on Windows](https://levimc.org/LeviLamina/user_guides/install_on_client/) en la documentación de LeviLamina (en inglés).

### Página LeviMC Mods

La página **LeviMC Mods** muestra los mods de [levimc.org/mods](https://levimc.org/mods/) que cuentan con una compilación para el cliente en Windows x64 (una entrada con `side = "client"` y `platform = "win-x64"`). Puedes buscarlos por nombre, ID, autor, etiqueta o descripción; ordenarlos por relevancia, estrellas, última actualización o más recientes; y filtrarlos por versión del juego, versión de LeviLamina, etiquetas (las recomendadas, como Biblioteca / API o Economía, aparecen primero, y también puedes excluir una etiqueta), licencia (una familia como Permisiva o un ID SPDX), dependencias y autor (**Más de …** en la página de un mod). Al instalar un mod se selecciona su variante `client`, o en su defecto la predeterminada, o si no la primera variante disponible con compilación para el cliente; desde la página del mod puedes elegir cualquiera de las demás. El botón **Install with LeviLauncher** de la página de un mod en levimc.org abre un enlace `levilauncher://install/<mod id>?version=<version>` que solicita a LeviLauncher instalar esa versión del mod.

## Mods nativos <Badge platform="android" />

Los mods nativos ejecutan código nativo en el proceso del juego. Instala solo mods de fuentes de confianza y pruébalos primero en una versión aislada.

Para crear los tuyos, consulta la guía [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) en la documentación de LeviLamina (en inglés).

## Si aparecen errores tras añadir Mods

- Desactiva primero el mod más reciente
- Compara con el estado anterior en el que funcionaba correctamente
- Antes de seguir probando, transfiere los mundos importantes o haz una copia de seguridad
- Luego, consulta [Actualización y solución de problemas](./update-troubleshooting)
