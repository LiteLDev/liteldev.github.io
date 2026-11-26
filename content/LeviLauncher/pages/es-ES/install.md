# Instalar LeviLauncher

LeviLauncher tiene versiones para Windows y Android, además de una para macOS en beta. La pestaña de tu dispositivo se selecciona automáticamente.

## Qué necesitas

=== "Windows"

    - Windows 10 u 11.
    - Una copia con licencia de Minecraft Bedrock Edition (GDK / UWP) de Microsoft Store.

=== "Android"

    - Android 9.0 o posterior en un dispositivo ARM64.
    - Minecraft Bedrock Edition 1.21.80 o posterior, comprado e instalado desde Google Play en este dispositivo.

=== "macOS"

    - macOS 14.6 o posterior en un Mac con Apple silicon.
    - Una copia con licencia de Minecraft Bedrock Edition. LeviLauncher ejecuta el juego de Windows (GDK) mediante Wine.

::: info iOS
No existe una versión de LeviLauncher para iOS, y no tenemos planes de hacerla.
:::

## Instalar

=== "Windows"

    1. Abre la [última versión de LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases/latest) y descarga `LeviLauncher-amd64-installer.exe`.
    2. Ejecútalo y completa el asistente de instalación. Pide permisos de administrador porque, por defecto, se instala en `Program Files`. Si solicita instalar WebView2 u otro componente, déjalo continuar.

    La versión incluye otros dos archivos que normalmente no necesitas:

    | Archivo | Qué es |
    | --- | --- |
    | `LeviLauncher.exe` | La versión portátil: colócala sola en una carpeta nueva cuya ruta solo contenga letras inglesas y ejecútala desde ahí. |
    | `LeviLauncher.zip` | El paquete que descarga el propio lanzador cuando se actualiza. |

=== "Android"

    1. En el dispositivo, abre la [última versión de LeviLauncher para Android](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest) y descarga el archivo cuyo nombre termina en `-release.apk`.
    2. Abre el archivo descargado. Si Android indica que tu navegador no puede instalar aplicaciones, toca **Ajustes**, activa **Permitir desde esta fuente**, vuelve atrás y toca **Instalar**.

=== "macOS"

    La versión para macOS está en beta: encuéntrala entre las versiones marcadas como **Pre-release**, no en la última versión estable.

    1. Abre las [versiones de LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases) y busca la más reciente que incluya `LeviLauncher-macos-arm64-installer.dmg`.
    2. Descarga ese archivo, ábrelo y arrastra **LeviLauncher** a **Aplicaciones**.

    Las instancias UWP son solo para Windows.

## Comprueba que funciona

Inicia LeviLauncher. Se abrirá su ventana; la primera vez mostrará la configuración inicial (Windows, macOS) o el acuerdo de licencia (Android).

## Actualizar

=== "Windows"

    Al iniciarse, LeviLauncher busca si hay una versión más reciente y ofrece instalarla directamente, sin desinstalar la actual. Para buscarla manualmente, abre **Ajustes** y pulsa **Verificar actualización**, o ejecuta `LeviLauncher.exe self-update`.

=== "Android"

    Cuando LeviLauncher encuentra una versión más reciente, ofrece instalarla, descarga su APK y se lo pasa a Android para que lo instale. Si tu red no puede conectarse a GitHub, descarga el nuevo APK desde las versiones e instálalo sobre la aplicación.

=== "macOS"

    Al iniciarse, LeviLauncher busca si hay una versión más reciente y ofrece instalarla.

## Versiones beta y anteriores

Todas las versiones, junto con sus archivos y sus cambios, están en las páginas de versiones:

- Windows y macOS: [versiones de LiteLDev/LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases)
- Android: [versiones de LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/releases)

Una **beta** es una versión marcada allí como **Pre-release**, por ejemplo `v1.2.0-beta.1`. Adelanta lo que incluirá la próxima versión antes de estar terminada, y puede fallar. Para probar una, descarga sus archivos desde su versión como se explica arriba. En Windows, una instalación de LeviLauncher también puede seguir las betas: activa **Recibir actualizaciones Beta** en **Ajustes** y te ofrecerá cada nueva beta como actualización. Desactívalo para quedarte en las versiones estables.

## Siguientes pasos

=== "Windows"

    - [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/) (en inglés): de un LeviLauncher recién instalado a tu primera partida con un mod.
    - [Gestión de versiones](/es-ES/guide/version-management?platform=windows)

=== "Android"

    - [Play with mods on Android](https://levimc.org/tutorials/play/play-with-mods-android/) (en inglés): de un LeviLauncher recién instalado a tu primera partida con un mod.
    - [Gestión de versiones](/es-ES/guide/version-management?platform=android)

=== "macOS"

    - [Gestión de versiones](/es-ES/guide/version-management)
    - [Actualizaciones y solución de problemas](/es-ES/guide/update-troubleshooting)
