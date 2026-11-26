---
platforms: [android]
---
# 빠른 실행 URI

Android 버전의 **Quick Launch**(빠른 실행)는 `minecraft://` URI로 Minecraft를 실행하여, 시작할 때 열 화면이나 작업을 게임에 전달합니다. 빠른 실행 화면의 각 작업은 아래 URI 중 하나를 생성하며, **Custom URI**(사용자 지정 URI)에는 `minecraft://`로 시작하는 모든 URI를 입력할 수 있습니다. 각 URI의 동작은 Minecraft에서 결정합니다. 작업 이름은 앱의 영어 인터페이스에 표시되는 이름이며, 괄호 안은 한국어 번역입니다.

LeviLauncher는 다른 앱에서 클릭한 `minecraft://` 링크도 처리합니다. 이런 링크를 열면 Android가 선택할 수 있는 앱 목록에 LeviLauncher를 표시합니다.

## 작업

| 작업 | URI | 입력 내용 |
| --- | --- | --- |
| **How to Play**(플레이 방법) | `minecraft://?showHowToPlayScreen=1` | — |
| **Servers Tab**(서버 탭) | `minecraft://openServersTab` | — |
| **Profile / Dressing Room**(프로필 / 드레싱 룸) | `minecraft://showProfileScreen` | — |
| **Marketplace Home**(마켓플레이스 홈) | `minecraft://openStore` | — |
| **Minecoins** | `minecraft://?showMineCoinOffers=1` | — |
| **Marketplace Pass** | `minecraft://?openCsbPDPScreen=<tab>` | 탭: `Home`, `Content`, `Faq` 또는 `Subscribe` |
| **Connect to Server**(서버에 연결) | `minecraft://connect/?serverUrl=<주소>&serverPort=<포트>` | 서버 주소와 포트(기본값 `19132`) |
| **Add External Server**(외부 서버 추가) | `minecraft://?addExternalServer=<이름>\|<주소>:<포트>` | 이름, 주소, 포트(기본값 `19132`) |
| **Join Realm**(Realm 참가) | `minecraft://acceptRealmInvite?inviteID=<코드>` | Realm 초대 코드 |
| **Load World**(월드 불러오기) | `minecraft://connect/?localWorld=<월드>` | 로컬 월드의 이름 |
| **Execute Command**(명령 실행) | `minecraft://?slashcommand=<명령>` | 게임에서 실행할 명령 |
| **Custom URI**(사용자 지정 URI) | 임의의 `minecraft://…` | URI |

서버 이름, 월드 이름, 명령은 URL 인코딩됩니다(예: 공백은 `%20`, `/`는 `%2F`).

## 예

`play.example.org`의 포트 `19132` 서버에 접속하려면 **Connect to Server**를 선택하거나, 기기에서 다음 링크를 여세요.

```text
minecraft://connect/?serverUrl=play.example.org&serverPort=19132
```

다른 Android 전용 기능은 [계정 및 빠른 실행](../guide/accounts-quick-launch)을 참조하세요.
