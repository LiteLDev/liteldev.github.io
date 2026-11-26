# Gestión de versiones

LeviLauncher gestiona cada entorno instalado como una versión independiente. En la aplicación, las versiones instaladas se llaman instancias y aparecen en la página **Instancias**.

## Qué puedes hacer

=== "Windows"

    - Instalar versiones oficiales o de vista previa
    - Asignar a cada versión un nombre fácil de identificar
    - Iniciar rápidamente una versión específica
    - Eliminar las versiones que ya no necesites
    - Abrir la configuración específica de la versión
    - Crear un acceso directo en el escritorio para la versión

=== "Android"

    - Importar APK oficiales de Minecraft y ejecutarlos desde el lanzador sin tener que instalar cada versión en el sistema
    - Mantener varias versiones y sus datos por separado
    - Elegir qué versión se inicia desde la pantalla de inicio

## Diferencias entre versión oficial (Release) y de vista previa (Preview) <Badge platform="windows" />

| Tipo | Para quién | Descripción |
| --- | --- | --- |
| Release (versión oficial) | Juego diario estable | Adecuado para la mayoría de los jugadores |
| Preview (versión de vista previa) | Pruebas anticipadas de nuevas funciones | Más propenso a cambios de compatibilidad en mundos, paquetes o Mods |

## Qué es el aislamiento

=== "Windows"

    El aislamiento está disponible para las versiones GDK y para las versiones UWP x64 1.19.70.2 o posteriores. Al activarlo, LeviLauncher guarda los datos del juego de esa versión en su propia área de trabajo en lugar de usar la ubicación de datos predeterminada compartida.

    El aislamiento resulta útil en estos casos:

    - Usar distintas combinaciones de contenido en cada versión
    - Probar Mods o la versión de vista previa (Preview) de Minecraft de forma más segura
    - Reducir el riesgo de que un entorno afecte a otro

=== "Android"

    Activa el aislamiento en una versión importada cuando quieras mantener sus mundos, paquetes y ajustes separados de la versión instalada desde Google Play. Por lo general, las versiones importadas necesitan el aislamiento para poder iniciarse.

## Operaciones comunes con versiones <Badge platform="windows" />

### Instalar una nueva versión

Completa la instalación en la página **Descargar** y luego vuelve a **Iniciar** para abrirla.

En la página de instalación, la opción **Instalar LeviLamina** viene activada por defecto; desactívala si prefieres instalar el juego sin LeviLamina. Esta opción solo se aplica a las versiones compatibles con LeviLamina.

### Renombrar una versión

En **Instancias** o en **Configuración de instancia**, asigna un nombre descriptivo al entorno, como `Release Survival` o `Preview Test`.

### Eliminar una versión

Elimina las versiones que ya no necesites, sobre todo los entornos de prueba de la versión de vista previa (Preview) de Minecraft que ya hayan cumplido su propósito.

::: warning Confirma antes de eliminar
Al eliminar una versión, podría borrarse también el contenido asociado a ese entorno gestionado. Haz antes una copia de seguridad de tus mundos importantes.
:::

### Crear un acceso directo en el escritorio

Selecciona **Crear acceso directo en el escritorio** en el menú situado junto al botón **Iniciar** para añadir un acceso directo a una versión específica y abrirla directamente.

## Estrategia recomendada para versiones <Badge platform="windows" />

- Una versión oficial (Release) aislada para jugar a diario
- Una versión de vista previa (Preview) aislada para usarla solo cuando sea necesario
- Una versión de prueba temporal para probar Mods o diagnosticar problemas

## Lecturas relacionadas

- [Descargas y mirrors](./downloads-mirrors)
- [Herramientas para mundos](./world-tools)
- [Actualización y solución de problemas](./update-troubleshooting)
