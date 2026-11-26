# 업데이트 및 문제 해결

LeviLauncher가 예상대로 설치, 업데이트 또는 실행되지 않을 때는 이 페이지를 먼저 확인하세요.

## 일반적인 문제 <Badge platform="windows" />

### 런처에서 Release 버전이 승인되지 않았다고 표시됨

Microsoft 계정 하나로 Microsoft Store에 로그인할 수 있는 기기는 최대 10대이며, 런처도 기기 한 대로 계산됩니다.  
[Microsoft Store 기기 관리](https://account.microsoft.com/devices/content)에서 사용하지 않는 기기를 제거하세요.

### Gaming Services 누락 또는 손상

- 런처의 안내에 따라 설치하거나 복구합니다.
- 필요하면 Microsoft Store에서 Minecraft Bedrock의 설치 상태를 확인합니다.

### GameInput 누락

- LeviLauncher의 안내에 따라 필요한 redistributable을 설치합니다.
- 설치를 마친 후 필요하면 런처를 다시 시작합니다.

### 설치 경로에 쓰기 불가

- **설정 → 일반 설정**에서 호스팅 콘텐츠 경로를 쓰기 가능한 위치로 변경합니다.
- 설치 또는 자체 업데이트 과정에서 런처가 관리자 권한을 요청하면, 신뢰할 수 있을 때만 허용합니다.

### LeviLauncher가 바로 종료되거나 창이 표시되지 않음

- UI가 나타나기 전에 런처가 종료되면 `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`를 확인하세요.
- 실행에 실패하면 한 번 더 시도해 보세요. 문제가 계속되면 GitHub 이슈를 등록할 때 `startup.log`를 첨부하세요.

### 특정 버전이 실행되지 않음

- 먼저 모드 없이 해당 버전이 실행되는지 테스트합니다.
- 필요한 Windows 구성 요소가 정상적으로 설치되어 있는지 확인합니다.
- 해당 버전이 완전히 설치되었는지 확인합니다.
- 깨끗한 격리 테스트 환경에서 문제가 재현되는지 확인합니다.

### 다운로드가 매우 느리거나 반복적으로 실패

- 다른 미러로 전환합니다.
- 잠시 후 다시 시도합니다.
- 여건이 된다면 로컬 패키지 소스로 변경합니다.

## Android에서 자주 발생하는 문제 <Badge platform="android" />

### Minecraft가 없거나 지원되지 않음

Google Play에서 공식 Minecraft 앱(1.21.80 이상)을 설치하거나 업데이트한 뒤 LeviLauncher를 다시 여세요.

### 가져온 버전이 실행되지 않음

가져온 버전은 버전 격리가 필요한 경우가 많습니다. 인스턴스 설정에서 이 옵션을 켜고 다시 시도하세요.

### 실행 실패

설정을 변경하기 전에 실패 화면에서 실행 로그를 열어 원인을 먼저 확인하세요.

### 데이터 마이그레이션

런처는 계속 진행하기 전에 이전 데이터 디렉터리를 마이그레이션할 수 있습니다. 마이그레이션이 완료되어 월드, 팩, 설정을 정상적으로 사용할 수 있을 때까지 이전 디렉터리를 삭제하지 마세요.

## 더 안전한 복구 단계

1. 중요한 월드를 먼저 백업합니다.
2. 최근에 추가한 모드와 리소스 팩을 제거합니다.
3. 깨끗한 격리 버전으로 비교 테스트를 진행합니다.
4. 필요하면 문제가 발생한 버전을 다시 설치합니다.

## 자체 업데이트에 대하여 <Badge platform="windows" />

LeviLauncher는 애플리케이션 업데이트를 확인하고 다운로드하여 설치할 수 있습니다. 설치 디렉터리에 쓰기 권한이 없는 일부 환경에서는 관리자 권한이 필요할 수 있습니다.

## 언제 Issue를 제출해야 하나요?

다음 조건에 모두 해당할 때 GitHub에 이슈를 등록하는 것이 좋습니다:

- 문제를 일관되게 재현할 수 있을 때
- 기본 복구 단계를 거친 후에도 문제가 해결되지 않을 때
- 일반적인 Windows 환경 문제보다는 LeviLauncher 자체의 문제로 보일 때

이슈를 등록할 때는 가능한 한 다음 정보를 함께 첨부해 주세요:

- Windows 버전
- LeviLauncher 버전
- 구체적인 재현 단계
- 스크린샷 또는 로그(있는 경우)

이슈 등록처: [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

Android 버전은 Android 버전, 기기 모델, 실행 로그를 첨부해 [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues)에 이슈를 등록하세요.
