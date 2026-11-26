# 모드 로드 방식

Minecraft Bedrock은 자체적으로 모드를 지원하지 않습니다. 모드는 게임이 시작될 때 로더가 게임 프로세스에 주입하는 네이티브 코드입니다. 이 페이지에서는 LeviLauncher가 어떤 로더를 쓰는지, 모드가 어디에 저장되는지, 모드를 추가하는 여러 방법이 어떻게 맞물려 작동하는지 설명합니다.

## 모드가 있는 곳 <Badge platform="windows" />

모든 인스턴스에는 `mods\` 폴더가 있습니다([폴더 및 파일](../reference/files) 참조). 각 모드는 이 폴더 안의 하위 폴더 하나를 차지하며, 모드 정보를 담은 `manifest.json`을 포함합니다.

| 필드 | 의미 |
| --- | --- |
| `name` | 모드 이름 |
| `entry` | 로더가 로드하는 파일(모드 폴더 기준 상대 경로, `.dll`) |
| `version` | 모드 버전 |
| `type` | 담당 로더. `preload-native`는 LeviLauncher의 네이티브 로더가 로드하며, LeviLamina용 모드는 자체 타입을 사용합니다. |
| `author` | 제작자(선택) |

모드는 각 인스턴스에 귀속됩니다. 게임 데이터에만 적용되는 [격리](./isolation)의 영향은 받지 않습니다.

**모드 관리**나 `LeviLauncher.exe mod disable` 명령으로 **모드 끄기**를 실행하면, 해당 모드의 `manifest.json` 이름이 `manifest.json.close`로 바뀌며 다시 켜면 원래 이름으로 돌아옵니다. 모드 파일은 그대로 남지만, `manifest.json`을 기준으로 탐색하는 로더는 더 이상 그 모드를 찾지 못합니다.

## 두 로더 <Badge platform="windows" />

### LeviLauncher의 네이티브 로더

LeviLauncher는 인스턴스를 설치하거나 준비할 때 자체 로더인 `LeviLauncher.dll`을 게임 실행 파일 옆에 배치하고 실행 파일의 가져오기 목록(import table)에 추가하여, Windows가 게임과 함께 로드하도록 합니다. 이 방식은 x64 빌드의 GDK와 UWP 모두에 적용되며, [격리](./isolation) 기능도 이를 통해 동작합니다.

게임이 시작되면 네이티브 로더는 `mods\` 안의 폴더를 이름순으로 살펴보고, `type`이 `preload-native`인 모드의 `entry`를 로드합니다. `manifest.json`이 없는 폴더나 다른 타입의 모드는 건너뜁니다. 인스턴스에 다른 프리로더(게임 실행 파일 옆의 `preloader.dll`)가 있으면, 네이티브 로더는 모든 모드 로드를 그 프리로더에 위임합니다. 네이티브 로더를 실행하려면 Visual C++ 런타임(x64)이 필요하며, LeviLauncher가 이를 확인하고 설치를 안내합니다.

### LeviLamina

[LeviLamina](https://levimc.org/LeviLamina/)는 LeviMC의 모드 로더입니다. [LeviMC Mods](https://levimc.org/mods/)에 있는 모드 대부분은 LeviLamina 모드로, 인스턴스의 게임 버전을 지원하는 LeviLamina 버전이 필요합니다. LeviLauncher는 지원되는 버전의 GDK 인스턴스에 내장 패키지 관리자를 통해 LeviLamina를 패키지로 설치합니다(버전 설치 시 **LeviLamina 설치** 스위치 또는 **인스턴스 설정**의 **로더** 탭에서 설정).

## 모드를 추가하는 세 가지 방법 <Badge platform="windows" />

| 추가하는 항목 | LeviLauncher의 동작 |
| --- | --- |
| **LeviMC Mods**의 모드(또는 `mod install owner/repo`) | [lip](https://github.com/LiteLDev/lip) 호환 내장 패키지 관리자를 통해 패키지로 설치합니다. 현재 플랫폼용 릴리스를 다운로드하고, 의존성 패키지를 설치한 뒤, 인스턴스의 `.lip\state.json`에 기록합니다. 모드에 LeviLamina가 필요한데 설치되어 있지 않거나 버전이 맞지 않으면, 호환되는 LeviLamina를 먼저 설치합니다. 이렇게 설치한 모드는 패키지 단위로 업데이트하고 제거할 수 있습니다. |
| `.mcmod` 패키지(또는 `.zip`) | `mods\` 안의 새 폴더에 압축을 풉니다. 압축 파일 안에는 `manifest.json`이 있어야 합니다. |
| 단일 `.dll` | `mods\` 안의 새 폴더에 파일을 넣고 `manifest.json`을 생성합니다. 기본값으로 이름은 파일 이름, 타입은 `preload-native`, 버전은 `0.0.0`이 설정됩니다. |

패키지는 `lip.toml`과 `.lip\state.json`에서 `side`(`client` 또는 `server`)와 `platform`(예: `win-x64`)으로 실행 환경을 나타냅니다. 클라이언트에 설치할 때 모드의 `client` 변형이 있으면 그것을 설치하고, 없으면 기본 변형을 설치합니다. 이전 패키지의 마이그레이션을 비롯한 자세한 내용은 [모드 및 통합](../guide/mods-integrations)을 참조하세요.

## Android <Badge platform="android" />

Android 버전은 게임 프로세스에서 실행되는 `.so` 라이브러리 형태의 네이티브 모드를 로드합니다. 모드를 적용한 환경은 격리된 버전에 두고, 신뢰할 수 있는 출처의 모드만 설치하세요. 모드를 직접 제작하려면 LeviLamina 문서의 [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/)를 참고하세요.

## 관련 페이지

- [모드 및 통합](../guide/mods-integrations)
- [인스턴스와 게임 버전](./instances)
- [명령줄](../reference/command-line)
