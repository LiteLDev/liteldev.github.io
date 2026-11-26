# Other LiteLDev projects

## Where can I still download old LiteLoaderBDS (LL2, such as 2.9.3, 2.15.0, 2.16.2)? Which BDS version does each version match?

Historical LL2 versions are available on the Releases page of the archived LiteLDev/LiteLoaderBDS GitHub repository: <https://github.com/LiteLDev/LiteLoaderBDS/releases> (for example, the final version, 2.16.2: <https://github.com/LiteLDev/LiteLoaderBDS/releases/download/2.16.2/LiteLoaderBDS.zip>). The old link <https://github.com/LiteLDev/LiteLoaderBDSv2> redirects to this repository automatically. The release notes for each version list the matching BDS version (newer releases use a badge; older ones, such as 2.9.3, state it in the text, for example `Support BDS 1.19.50 & 1.19.51`). Be sure to choose the LL2 version that matches your BDS version exactly. LL2 is no longer maintained and supports BDS 1.20.31.01 at most; use LeviLamina for newer BDS versions.

*Applies to: LiteLoaderBDS 2.x (archived), BDS \<= 1.20.31.01*

## What is the last BDS version supported by LiteLoaderBDS v2 (LL2)? Is there an LL2 that supports BDS 1.20.40 or later? What if LL2 fails to start with LiteLoader not found or cannot be loaded?

The final LL2 version is 2.16.2, which matches BDS 1.20.31.01; no LL2 version supports BDS 1.20.40 or later. LL must match your BDS version exactly, and a version mismatch (for example, BDS 1.19.30.04 with a newer LL2) causes loading to fail. LL2 is no longer updated and has been archived; it was later rebuilt as LeviLamina (<https://github.com/LiteLDev/LeviLamina>). Use LeviLamina for newer BDS versions.

*Applies to: LiteLoaderBDS 2.x (archived); use LeviLamina for newer BDS*

## How do I conveniently download or upgrade the BDS server?

Use LiteLDev's command-line tool bdsdown (<https://github.com/LiteLDev/bdsdown>), which you can install with `lip install github.com/LiteLDev/bdsdown`. Usage:

```text
bdsdown.exe [--yes] [--source SOURCE] [--proc PROC] [--exclude EXCLUDE]
```

`--source` defaults to `version://windows/latest`, `--proc` sets the number of concurrent downloads (default 4), and `--exclude` skips specified files during installation (for example, to preserve configuration files). Set the `BDSDOWN_MIRROR_URL` environment variable to use a mirror for faster downloads. You can also use lip to install BDS on its own.
