# lip cache clean

Delete the cache.

## Synopsis

```
lip cache clean [-h | --help]
```

## Description

`lip cache clean` deletes the [cache directory](../files.md#cache-directory): `%LOCALAPPDATA%\lip\Cache` on Windows, and `$XDG_CACHE_HOME/lip` (which defaults to `~/.cache/lip`) elsewhere.

The cache holds only files that lip downloaded and can download again. Workspaces, installed packages, and the configuration are not affected. The Wine installation managed by lip is stored in the data directory rather than the cache, so it remains intact.

Any lip command writing to the cache at the same time may fail. Run `lip cache clean` only when no other lip command is running.

## Options

| Option | Description |
| --- | --- |
| `-h`, `--help` | Show help and exit. |

## Output

`lip cache clean` produces no result and writes nothing to standard output. Its final line is a message on standard error.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The cache was deleted. |
| not `0` | A usage error occurred, or the directory could not be deleted. |

## Examples

```shell
lip cache clean
```

## See also

- [Files](../files.md#cache-directory): what the cache holds.
- [Settings](../../interface/settings.md): **Clear cache** in the interface.
- [Troubleshooting](../../guides/troubleshooting.md)
