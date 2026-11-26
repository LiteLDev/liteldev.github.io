# LeviLauncher

Лаунчер Minecraft Bedrock для Windows и Android: устанавливайте, настраивайте, изолируйте, модифицируйте и запускайте Minecraft Bedrock Edition на ПК с Windows или устройстве Android.

**Установка:** на странице [Установка](./install) рассказано, что требуется для каждой версии, где её скачать, как обновлять и как попробовать бета-версию.

::: info Windows и Android
У LeviLauncher есть **версия для Windows** для Minecraft Bedrock Edition (GDK / UWP) и **версия для Android** для официального Minecraft из Google Play. Для обеих нужна легальная лицензионная копия игры. Версии для iOS нет, и она не планируется.
:::

::: tip Начните здесь
Впервые пользуетесь LeviLauncher? Руководство [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/) (на английском) проведёт вас от скачивания LeviLauncher до первой игры с модами.
:::

## Что умеет LeviLauncher

- **Управление версиями.** Устанавливайте, переименовывайте, запускайте и удаляйте версии Minecraft Release и Preview, полностью контролируя каждую сборку. Каждая установленная копия — это *инстанс*: см. [Управление версиями](./guide/version-management) и [Инстансы и версии игры](./concepts/instances).
- **Чистая изоляция.** Храните миры, паки и файлы игры отдельно от стандартной установки в AppData в безопасном рабочем пространстве: см. [Изоляция инстансов](./concepts/isolation).
- **Инструменты контента.** Управляйте мирами, ресурс-паками, поведенческими паками, паками скинов, скриншотами и списком серверов в одном месте: см. [Управление контентом](./guide/content-management).
- **Поддержка модов.** Импортируйте пакеты модов `.mcmod`, ищите моды на CurseForge и устанавливайте LeviLamina и пакеты LIP через встроенный менеджер пакетов: см. [Моды и интеграции](./guide/mods-integrations) и [Как загружаются моды](./concepts/mod-loading).
- **Утилиты для миров.** Экспортируйте резервные копии, анализируйте данные мира и редактируйте отдельные поля `level.dat`, не выходя из лаунчера: см. [Инструменты для миров](./guide/world-tools).
- **Настройки для пользователя.** Меняйте язык, внешний вид, параметры загрузки и конфиденциальности, каналы обновлений и управление пакетами: см. [Настройки и персонализация](./guide/settings-personalization) и [Все настройки](./reference/settings).
- **Возможности Android.** Переключайте аккаунты Xbox и используйте URI быстрого запуска прямо в лаунчере: см. [Аккаунты и быстрый запуск](./guide/accounts-quick-launch).

## Короткий пример

В Windows всё, что доступно в окне лаунчера, можно сделать и из терминала. Эти три команды устанавливают новейшую версию Minecraft Release с LeviLamina в новый инстанс и назначают его по умолчанию, добавляют мод из [LeviMC Mods](https://levimc.org/mods/) и запускают игру:

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe play
```

Чтобы установить версию GDK, нужно войти в аккаунт Microsoft, на который куплен Minecraft (`LeviLauncher.exe account login`). В окне лаунчера те же действия выполняются на страницах **Скачать** и **LeviMC Mods** и кнопкой **Запуск**. Полный список команд приведён в справочнике [Командная строка](./reference/command-line).

## Что охватывает этот сайт

Эта документация написана для **игроков и конечных пользователей**, а не для разработчиков.

- **Руководства**: по одной задаче на страницу. Скачайте приложение на странице [Установка](./install), а затем переходите к [управлению версиями](./guide/version-management), [загрузкам и зеркалам](./guide/downloads-mirrors), [контенту](./guide/content-management), [аккаунтам и быстрому запуску](./guide/accounts-quick-launch) (Android), [модам](./guide/mods-integrations), [мирам](./guide/world-tools) и [настройкам](./guide/settings-personalization). В разделе «Помощь» собрана информация об [обновлении и устранении неполадок](./guide/update-troubleshooting), а также о [сообществе и обратной связи](./guide/faq-community-feedback).
- **Концепции**: как устроен LeviLauncher — [инстансы и версии игры](./concepts/instances) (Release и Preview, GDK и UWP, Windows и Android), [изоляция инстансов](./concepts/isolation) и [как загружаются моды](./concepts/mod-loading).
- **Справочник**: [командная строка](./reference/command-line), [все настройки](./reference/settings), используемые лаунчером [папки и файлы](./reference/files), [URI быстрого запуска](./reference/quick-launch-uri) для Android и [политика конфиденциальности](./privacy-policy) версии для Android.

Рекомендуем начать с руководства [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/), а затем перейти к разделам [Управление версиями](./guide/version-management) и [Управление контентом](./guide/content-management).

## Сообщество и обратная связь

- **Официальный Discord:** [discord.gg/v5R5P4vRZk](https://discord.gg/v5R5P4vRZk)
- **Личный Discord:** [discord.gg/VqQaC8vWz8](https://discord.gg/VqQaC8vWz8)
- **Группа QQ:** [458083875](https://qm.qq.com/q/1z791rJgJG)
- **Трекер ошибок:** [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)
