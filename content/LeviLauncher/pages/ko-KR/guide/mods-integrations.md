# 모드 및 통합

LeviLauncher는 "기본 런처" 수준을 넘어 다양한 모드 작업 흐름을 지원합니다.

## 현재 사용 가능한 기능

=== "Windows"

    - 모드 패키지(`.mcmod`) 가져오기
    - `.zip` 패키지와 단일 `.dll` 모드도 계속 지원: 파일 선택 창에서 **모든 파일 (\*.\*)** 선택
    - 설치된 모드 활성화 또는 비활성화
    - 더 이상 필요 없는 모드 삭제
    - CurseForge 탐색 및 가져오기
    - [lip](https://github.com/LiteLDev/lip)과 호환되는 내장 패키지 관리자로 LIP 패키지 설치
    - LeviLamina 등 로더와 함께 사용

    ::: warning 이는 고급 영역입니다
    모드, 로더, 패키지 통합의 호환성은 빠르게 바뀔 수 있으며, 특히 Minecraft 프리뷰(Preview)에서 더욱 그렇습니다. 이를 고급 기능으로 여기고 조금씩 테스트하세요.
    :::

=== "Android"

    - 네이티브 모드(`.so` 라이브러리)를 게임에 로드
    - 격리된 버전에서 모드 환경 유지

    네이티브 모드를 만들고 싶다면 LeviLamina 문서의 [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/)(영어)를 참고하세요.

## 권장 모드 작업 흐름

1. 깨끗하게 격리된 버전부터 시작합니다.
2. 먼저 모드 없이 해당 버전이 정상 실행되는지 확인합니다.
3. 한 번에 모드 하나나 작은 변경 사항만 추가합니다.
4. 변경할 때마다 게임이 잘 실행되는지 다시 테스트합니다.
5. 중요한 월드는 항상 백업해 둡니다.

## CurseForge <Badge platform="windows" />

런처에서 바로 CurseForge 리소스를 탐색하고 패키지를 받아 편리하게 사용할 수 있습니다.

다음과 같은 경우에 유용합니다.

- 더 체계적인 검색 환경이 필요할 때
- 특정 프로젝트의 호환 파일을 빠르게 확인하고 싶을 때
- 런처 밖에서 일일이 검색하고 싶지 않을 때

## lip 및 LeviLamina <Badge platform="windows" />

LeviLauncher에는 [lip](https://github.com/LiteLDev/lip)과 호환되는 패키지 관리자가 내장되어 있어 lip이나 .NET 런타임을 따로 설치할 필요가 없습니다. lip 방식에 따라 각 버전은 패키지를 `.lip/state.json`에 기록하고, 패키지 정보는 `lip.toml`에서 읽습니다(`tooth.json`만 있는 이전 패키지도 계속 사용할 수 있습니다). 이전 런처로 LeviLamina나 LIP 패키지를 설치한 버전(`tooth_lock.json`)은 처음 패키지 작업을 할 때 자동으로 마이그레이션됩니다. **미러 소스 사용**을 켜면 GitHub에서 패키지를 다운로드할 때 [설정](./settings-personalization)의 **GitHub 프록시**를 거칩니다. 끄면 GitHub에 직접 연결합니다(시스템 프록시가 설정되어 있으면 이를 거칩니다). 이전에 저장한 GitHub 프록시나 lip의 `config.toml`(`%APPDATA%\lip` 안, 예: `lip config set github_proxy <URL>`)에 설정한 `github_proxy`는 두 경우 모두 적용됩니다. 다운로드한 패키지 파일은 **캐시 지우기**로 삭제할 수 있습니다.

lip v0.40부터 `lip.toml`과 `.lip/state.json`의 각 엔트리는 실행 위치를 `side`(`server` 또는 `client`)와 `platform`(`win-x64` 같은 .NET 런타임 식별자)으로 나타냅니다. lip v0.39 이하에서는 이를 `platform`과 `runtime`이라고 불렀습니다. lip v0.39 이하나 이전 런처가 예전 키로 기록한 `.lip/state.json`은 다음 패키지 작업 전에 자동으로 변환되어 `platform`은 `side`로, `runtime`은 `platform`으로 이름이 바뀝니다. 그래도 lip이 읽을 수 없는 파일은 필요한 변경 사항을 알려 주는 메시지와 함께 거부됩니다. 이 경우 `platform`을 `side`로, `runtime`을 `platform`으로 바꾸거나 해당 버전의 패키지를 다시 설치하세요.

이 통합 기능은 패키지나 로더 중심으로 작업하려는 고급 사용자에게 적합합니다.

권장 사항:

- 안정적인 정식판(Release) 버전부터 시작하기
- 위험도가 높은 요소를 한 번에 여러 개 바꾸지 않기
- "마지막으로 성공적으로 작동한" 버전 조합 기록해 두기

클라이언트 버전에 LeviLamina를 추가하려면 LeviLamina 문서의 [Install client on Windows](https://levimc.org/LeviLamina/user_guides/install_on_client/)(영어)를 참고하세요.

### LeviMC Mods 페이지

**LeviMC Mods** 페이지에는 [levimc.org/mods](https://levimc.org/mods/)의 모드 중 Windows x64 클라이언트용 빌드(`side = "client"`, `platform = "win-x64"`인 엔트리)가 있는 모드가 표시됩니다. 이름, ID, 작성자, 태그, 설명으로 검색하고, 관련도, 스타, 업데이트됨, 최신순으로 정렬할 수 있습니다. 또한 게임 버전, LeviLamina 버전, 태그(라이브러리 / API나 경제 같은 추천 태그가 먼저 표시되며, 특정 태그를 제외할 수도 있음), 라이선스(허용적 같은 분류 또는 SPDX ID), 의존성, 작성자(모드 페이지의 **…의 다른 모드**)로 필터링할 수 있습니다. 모드를 설치할 때는 `client` 변형을 우선 선택하고, 없으면 기본 변형을, 그것도 없으면 클라이언트용 빌드가 있는 첫 번째 다른 변형을 선택합니다. 모드 페이지에서 다른 변형을 직접 고를 수도 있습니다. levimc.org 모드 페이지의 **Install with LeviLauncher** 버튼은 `levilauncher://install/<mod id>?version=<version>` 링크로 연결되며, LeviLauncher에 해당 모드의 지정된 버전을 설치하도록 요청합니다.

## 네이티브 모드 <Badge platform="android" />

네이티브 모드는 게임 프로세스 안에서 네이티브 코드를 실행합니다. 신뢰할 수 있는 출처의 모드만 설치하고, 먼저 격리된 버전에서 테스트하세요.

직접 만들려면 LeviLamina 문서의 [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/)(영어)를 참고하세요.

## 모드를 추가한 후 오류가 발생하면

- 가장 최근에 추가한 모드를 먼저 비활성화합니다.
- 마지막으로 정상 작동했던 상태와 비교합니다.
- 추가 테스트를 하기 전에 중요한 월드를 다른 곳으로 옮기거나 백업합니다.
- 이어서 [업데이트 및 문제 해결](./update-troubleshooting)을 참고합니다.
