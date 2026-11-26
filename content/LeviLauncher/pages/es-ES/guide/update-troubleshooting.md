# Actualizaciones y solución de problemas

Si la instalación, la actualización o el inicio de LeviLauncher no funcionan como esperabas, consulta primero esta página.

## Problemas comunes <Badge platform="windows" />

### El lanzador indica que la versión Release no está autorizada

Una cuenta de Microsoft solo puede iniciar sesión en Microsoft Store en un máximo de 10 dispositivos, y el lanzador cuenta como un dispositivo independiente.  
Para solucionarlo, elimina los dispositivos que ya no uses desde la [gestión de dispositivos de Microsoft Store](https://account.microsoft.com/devices/content).

### Gaming Services ausente o dañado

- Sigue la guía del lanzador para instalarlo o repararlo.
- Si es necesario, abre Microsoft Store para comprobar el estado de la instalación de Minecraft Bedrock.

### GameInput ausente

- Instala el paquete redistribuible necesario siguiendo las indicaciones de LeviLauncher.
- Tras la instalación, reinicia el lanzador si es necesario.

### Ruta de instalación no escribible

- En **Configuración → Configuración básica**, cambia la ruta del contenido gestionado a una carpeta con permisos de escritura.
- Si el lanzador solicita privilegios elevados durante la instalación o la autoactualización, concédelos solo si confías en el origen.

### LeviLauncher se cierra al instante o nunca muestra una ventana

- Si el lanzador se cierra antes de que aparezca la interfaz, revisa `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`.
- Vuelve a intentarlo una vez más. Si el fallo persiste, abre un Issue en GitHub y adjunta `startup.log`.

### Una versión no se inicia

- Comprueba primero si la versión se inicia sin Mods
- Verifica que los componentes necesarios de Windows sigan instalados
- Confirma que la versión se haya instalado por completo
- Intenta reproducir el fallo en un entorno de prueba limpio y aislado

### Descarga muy lenta o fallos repetidos

- Cambia de servidor espejo (mirror)
- Vuelve a intentarlo más tarde
- Si es posible, usa una fuente de paquetes local

## Problemas comunes en Android <Badge platform="android" />

### Falta Minecraft o no es compatible

Instala o actualiza la aplicación oficial de Minecraft desde Google Play (1.21.80 o posterior) y vuelve a abrir LeviLauncher.

### Una versión importada no se inicia

Las versiones importadas suelen requerir aislamiento. Actívalo en los ajustes de la instancia y vuelve a intentarlo.

### Un inicio falla

Abre el registro de inicio desde la pantalla de error y comprueba la causa antes de modificar cualquier ajuste.

### Migración de datos

El lanzador puede migrar directorios de datos antiguos antes de continuar. No elimines el directorio antiguo hasta que termine la migración y hayas comprobado que tus mundos, paquetes y ajustes están disponibles.

## Pasos de recuperación más seguros

1. Haz primero una copia de seguridad de los mundos importantes.
2. Retira los Mods o paquetes de recursos que hayas añadido recientemente.
3. Prueba con una versión limpia y aislada para comparar.
4. Si es necesario, reinstala la versión afectada.

## Sobre la autoactualización <Badge platform="windows" />

LeviLauncher puede buscar, descargar e instalar actualizaciones de la aplicación. Si el directorio de instalación no tiene permisos de escritura, algunos entornos podrían solicitar permisos de administrador.

## Cuándo deberías crear un Issue

Se recomienda abrir un Issue en GitHub si se cumplen estas condiciones:

- Puedes reproducir el fallo de forma consistente
- El problema persiste tras seguir los pasos básicos de recuperación
- El fallo parece propio de LeviLauncher y no del entorno de Windows en general

Al abrirlo, incluye siempre:

- Versión de Windows
- Versión de LeviLauncher
- Los pasos exactos que seguiste
- Capturas de pantalla o registros (si los tienes)

Enlace para informar de problemas: [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

Para la versión de Android, indica la versión de Android, el modelo del dispositivo y el registro de inicio, y abre el Issue en [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues).
