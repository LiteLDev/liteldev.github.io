# LeviLamina versions and compatibility

## Is there a LeviLamina version for BDS 26.0? How do I choose a BDS version?

No. LeviLamina jumped directly from 1.9.x (BDS 1.21.132) to 26.10.0 (supporting 26.10) and never supported 26.0. LL supports only specific BDS versions, not every release.

Choose your LeviLamina version first, then install the matching BDS version. When you install LeviLamina with lip, it installs the matching BDS automatically through the `github.com/LiteLDev/bds` dependency (for example, the current LeviLamina 26.60.x matches BDS 1.26.60). Chasing the newest version is not recommended.

## After Minecraft switched to version numbers starting with 26, how did LeviLamina's version number change? What is the next version after 1.9.x?

Starting with support for BDS 1.26.10, LeviLamina's version number follows the MC version. The next version after 1.9.x (which matches BDS 1.21.132) is 26.10.0 (followed by 26.10.1 and so on); there is no 26.0. Subsequent versions are 26.20.x, 26.32.x, 26.40.x, 26.51.x, and 26.60.x, where the major and minor numbers match the supported MC version (for example, LeviLamina 26.60.x matches BDS 1.26.60.6).

*Applies to: LeviLamina 26.10.0 and later*

## Is LeviLamina no longer tied to a specific version of Bedrock BDS? How do I get the matching BDS version?

Each LeviLamina version still matches a specific BDS version (for example, LeviLamina 26.60.8 matches BDS 1.26.60). When you install LeviLamina with lip, it automatically downloads and installs the matching BDS (package `github.com/LiteLDev/bds`), so you do not need to match it manually. Run `lip install LeviLamina` to install the latest LeviLamina and its supported game version, or run `lip setup --game <version>` to specify a game version (lip selects the latest LeviLamina that supports it, or reports an error if there is no match).

## Can I downgrade LeviLamina manually? After replacing only the LeviLamina files, the server (on a hosting panel) no longer loads LeviLamina. What should I do?

Because the LeviLamina version is tied to the BDS version, downgrading LL requires switching to the matching BDS version at the same time; replacing only the LL files will not work. We recommend specifying the versions with lip in a server directory (or an empty directory) on your local computer: `lip setup --game <BDS version> --loader levilamina@<LL version>`. lip installs the matching BDS and LeviLamina together while keeping other compatible packages. Then, upload the entire server to the panel. Note that `lip install` and `lip update` do not change the game and loader versions; you must use `lip setup`.
