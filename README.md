# levimc.org

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Source of the LeviMC website at [levimc.org](https://levimc.org/), including LeviMC Mods and the project docs.

It is one static site, built by one package into `dist/`:

| Folder | What |
| --- | --- |
| `src/main/` | levimc.org itself: home, about, community, support and the blog |
| `src/mods/` | LeviMC Mods (`/mods/`) |
| `src/kit/` | the shared design system and the docs engine ([README](src/kit/README.md)) |
| `src/legacy/`, `src/versions/` | redirect pages of retired sites and the 404 page; Minecraft's release versions (`/api/v4/mc/versions/`) |
| `content/` | what the site says: the blog, the list of mods, the tutorials, the FAQ and every project's docs ([README](content/README.md)) |
| `public/` | static files of levimc.org itself |
| `doxygen/` | LeviLamina's API reference (`/LeviLamina/api/`), made by Doxygen after the build |
| `scripts/` | the build and its checks |

## Install

This project needs Node.js 22.22 or later.

```sh
npm ci
```

## Usage

```sh
# Start a development server
npm run dev                  # levimc.org itself
npm run dev:mods             # LeviMC Mods
npm run dev:docs -- lip      # one docs site (node scripts/docs-sites.mjs list)

# Build the whole static site into dist/
npm run build

# Check the sources
npm run typecheck            # TypeScript and JavaScript
npm run lint                 # ESLint, no warnings allowed
npm test                     # unit tests

# Check the built site
npm run linkcheck            # every link
npm run budget               # size budgets of LeviMC Mods
npm run smoke                # the browser checks (npx playwright install chromium, once)

# Serve dist/ at http://127.0.0.1:4173/
npm run preview
```

`npm run build -- main docs` builds only those parts (`main`, `mods`, `docs`, `search`). The Mods build reads each
repository from GitHub: set `GITHUB_TOKEN` to avoid its rate limits. `npm run smoke -- docs mods` runs only those
checks (`main`, `chrome`, `docs`, `mods`, `prefs`).

LeviLamina's API reference is made after the build, when Doxygen is installed: `bash doxygen/build.sh`.

Workflows (`.github/workflows/`):

- `ci.yml`, on every pull request: lint, the unit tests and the build. The other checks above are run by hand before
  a pull request.
- `deploy.yml`, on every push to `main` and when `discover.yml` starts it: builds the site and publishes it.
- `discover.yml`, every hour: adds the new Minecraft release to `src/versions/versions.json`, takes the mod
  repositories GitHub no longer serves out of `content/mods/repos.txt` and commits both; starts a deploy when it
  committed or when a mod's version tags, LeviLamina or BeDD changed (`scripts/sources.mjs`); proposes newly found
  mod repositories in pull requests (`scripts/mods/discover.mjs`).

## Contributing

PRs accepted. Open an issue at [LiteLDev/liteldev.github.io](https://github.com/LiteLDev/liteldev.github.io/issues) for anything else.

## License

[MIT](LICENSE) © LeviMC
