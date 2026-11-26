#!/usr/bin/env node
// Runs LeviMC Mods (src/mods/, levimc.org/mods/). The app writes dist/, dist-api/, dist-locales/ and .kit/ into its
// working directory, so every command runs in .build/mods/ with Vite's root at src/mods/:
//
//   node scripts/mods/run.mjs dev [vite options]   the dev server (pages rendered on the server, like the build)
//   node scripts/mods/run.mjs build                client build, SSR build, prerender → .build/mods/dist*/
//   node scripts/mods/run.mjs preview [--port n]   the build, served like GitHub Pages
//   node scripts/mods/run.mjs linkcheck | budget | smoke [options]
//
// The repositories come from content/mods/repos.txt; what was read from them is kept in .cache/mods/registry.json
// (or $MODS_REGISTRY_CACHE). GITHUB_TOKEN lets the build read them from GitHub's GraphQL API.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const MODS_APP = join(REPO, 'src/mods');
export const MODS_BUILD = join(REPO, '.build/mods');
const VITE = join(REPO, 'node_modules/vite/bin/vite.js');
const LINKCHECK = join(REPO, 'src/kit/scripts/linkcheck.mjs');
const ORIGIN = 'https://levimc.org';

const env = {
  ...process.env,
  MODS_REPOS_FILE: join(REPO, 'content/mods/repos.txt'),
  MODS_REGISTRY_CACHE: process.env.MODS_REGISTRY_CACHE ? resolve(process.env.MODS_REGISTRY_CACHE) : join(REPO, '.cache/mods/registry.json'),
};

function node(...args) {
  const r = spawnSync(process.execPath, args, { cwd: MODS_BUILD, env, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

export function runMods(command, rest = []) {
  mkdirSync(MODS_BUILD, { recursive: true });
  mkdirSync(dirname(env.MODS_REGISTRY_CACHE), { recursive: true });
  switch (command) {
    case 'dev':
      return node(VITE, MODS_APP, ...rest);
    case 'build':
      node(VITE, 'build', MODS_APP);
      node(VITE, 'build', MODS_APP, '--ssr', 'entry-server.tsx', '--outDir', join(MODS_BUILD, '.kit/ssr'));
      return node(join(MODS_APP, 'prerender.mjs'));
    case 'preview':
      return node(join(REPO, 'scripts/mods/preview.mjs'), ...(rest.length ? rest : ['--port', '4173']));
    case 'linkcheck':
      node(LINKCHECK, 'dist', '--base', '/mods/', '--site-origin', ORIGIN);
      node(LINKCHECK, 'dist-locales/zh-Hans', '--base', '/zh-Hans/mods/', '--site-origin', ORIGIN);
      return node(LINKCHECK, 'dist-locales/zh-Hant', '--base', '/zh-Hant/mods/', '--site-origin', ORIGIN);
    case 'budget':
      return node(join(REPO, 'scripts/mods/budget.mjs'), 'dist');
    case 'smoke':
      return node(join(REPO, 'scripts/mods/smoke.mjs'), ...(rest.length ? rest : ['--url', 'http://127.0.0.1:4173/mods/']));
    default:
      console.error('Usage: node scripts/mods/run.mjs dev | build | preview | linkcheck | budget | smoke');
      process.exit(2);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runMods(process.argv[2], process.argv.slice(3));
