#!/usr/bin/env bash
# LeviLamina's API reference (levimc.org/LeviLamina/api/): Doxygen over the headers of LiteLDev/LeviLamina, written
# into dist/LeviLamina/api/ with the docs pages' chrome. Run from anywhere, after `npm run build` (the header is made
# from the docs build's dist/LeviLamina/_kit/nav.json: its sections, resources and languages):
#
#   doxygen/build.sh
#
# Needs doxygen (the deploy installs 1.16.1), git and node. Everything it fetches or generates goes to .cache/doxygen/
# (git-ignored): LeviLamina/ (the headers; the deploy checks the repository out there, otherwise it is cloned once —
# delete it to get the current ones), doxygen-awesome-css/, header.html, footer.html and kit-dox-chrome.js (the
# chrome — bar, drawer, site column, footer — as one shared script that every page writes in place, instead of a copy
# in each of the ~68,000 pages).
set -euo pipefail
cd "$(dirname "$0")/.."

work=.cache/doxygen
nav=dist/LeviLamina/_kit/nav.json
[ -f "$nav" ] || { echo "$nav is missing: run 'npm run build' first" >&2; exit 1; }
mkdir -p "$work"

[ -d "$work/LeviLamina" ] || git clone --depth 1 https://github.com/LiteLDev/LeviLamina.git "$work/LeviLamina"
[ -d "$work/doxygen-awesome-css" ] || git clone --depth 1 --branch v2.4.1 https://github.com/jothepro/doxygen-awesome-css.git "$work/doxygen-awesome-css"

node doxygen/gen-header.mjs --nav "$nav" --out "$work/header.html" \
  --chrome-out "$work/kit-dox-chrome.js" --footer doxygen/footer.html --footer-out "$work/footer.html"

doxygen --version
mkdir -p dist/LeviLamina/api
doxygen doxygen/Doxyfile
# the tree renders a window of its long lists (the Class List) and leaves the page layout to the kit
node doxygen/patch-navtree.mjs dist/LeviLamina/api
