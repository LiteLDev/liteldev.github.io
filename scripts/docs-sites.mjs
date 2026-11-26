#!/usr/bin/env node
// The docs sites of levimc.org (content/README.md): the tutorials (content/tutorials/), the FAQ (content/faq/) and
// one per project (content/<Project>/). Each is a folder with a docs.config.ts, its markdown (pages/) and its static
// files (public/), built by the docs engine in src/kit/docs with `i18n.localeFirst`: its output mirrors the host
// root (<Project>/…, zh-Hans/<Project>/…) and merges into levimc.org's dist/ as it is.
//
//   node scripts/docs-sites.mjs list              the sites, one per line (tutorials, then the FAQ, first)
//   node scripts/docs-sites.mjs build [site …]    per site: its scripts/prebuild.mjs when it has one, the build
//                                                 (→ .build/docs/<site>/dist/) and its link check
//   node scripts/docs-sites.mjs dev <site>        the site on a local server, rebuilt as you edit
//   node scripts/docs-sites.mjs merge <dist>      copy each site's build into <dist>, without its 404.html and
//                                                 .nojekyll (levimc.org's own win); any other file both have fails
//   node scripts/docs-sites.mjs other-sites       the --other-sites of levimc.org's linkcheck: the projects whose docs
//                                                 are not built here, under every language (see linkcheck below)
//   node scripts/docs-sites.mjs linkcheck <dist> [linkcheck options]
//                                                 levimc.org's link check (npm run linkcheck) with those other sites
//
// A site is named by its folder (`lip`, `content/lip`) or by a config file (`src/kit/demo/lip.config.ts`: the kit's
// test sites). Nothing lists the sites: a folder of content/ with a docs.config.ts is one.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DOCS_PROJECTS, NETWORK_LANGUAGE_SEGMENTS } from '../src/kit/components/projects.ts';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = 'docs.config.ts';
const ORIGIN = 'https://levimc.org';
/** Paths a site's link check leaves alone: made after the docs build (LeviLamina's Doxygen API reference, doxygen/). */
const IGNORE_PATHS = { '/LeviLamina/': ['/LeviLamina/api/'] };

/** The docs sites (repository-relative, '/'-separated): content/tutorials, content/faq, then every other content/<name>/ with a docs.config.ts. */
export function docsRoots(repo = REPO) {
  const content = join(repo, 'content');
  const has = (name) => existsSync(join(content, name, CONFIG));
  const first = ['tutorials', 'faq'];
  const names = [...first.filter(has), ...(existsSync(content) ? readdirSync(content).sort().filter((n) => !first.includes(n) && has(n)) : [])];
  return names.map((n) => `content/${n}`);
}

/** The project docs this repository does not build: their own repositories publish them. */
export function externalProjects(repo = REPO) {
  return DOCS_PROJECTS.map((p) => p.id).filter((id) => !existsSync(join(repo, 'content', id, CONFIG)));
}

/** levimc.org paths another build serves: each external project under its base and under every language. */
export function otherSites(repo = REPO) {
  return externalProjects(repo).flatMap((id) => [`/${id}/`, ...NETWORK_LANGUAGE_SEGMENTS.map((l) => `/${l}/${id}/`)]);
}

/** Files of a folder, relative and '/'-separated. */
function files(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, base, out);
    else out.push(relative(base, p).split(sep).join('/'));
  }
  return out;
}

/** The files a docs build leaves out of the merge: its own 404 page and .nojekyll (the site's are at the root). */
const SKIP = new Set(['404.html', '.nojekyll']);

/**
 * Copy `from` (a docs site's build) into `into` (levimc.org's dist/). Throws, before copying anything, when a file
 * would overwrite one that is there already.
 */
export function mergeDist(from, into) {
  const list = files(from).filter((f) => !SKIP.has(f));
  const clashes = list.filter((f) => existsSync(join(into, f)));
  if (clashes.length) {
    throw new Error(`${from}: ${clashes.length} file(s) exist in ${into} already: ${clashes.slice(0, 10).join(', ')}${clashes.length > 10 ? ', …' : ''}`);
  }
  for (const f of list) {
    mkdirSync(dirname(join(into, f)), { recursive: true });
    cpSync(join(from, f), join(into, f));
  }
  return list.length;
}

/**
 * A site named on the command line → { id, dir, config }: `lip`, `content/lip` (its docs.config.ts) or a config file
 * (`src/kit/demo/lip.config.ts` → id `demo-lip`).
 */
export function siteOf(name, repo = REPO) {
  const path = existsSync(resolve(repo, name)) ? resolve(repo, name) : join(repo, 'content', name);
  if (!existsSync(path)) throw new Error(`${name}: no such docs site`);
  if (statSync(path).isDirectory()) {
    if (!existsSync(join(path, CONFIG))) throw new Error(`${relative(repo, path)} has no ${CONFIG}`);
    return { id: basename(path), dir: path, config: join(path, CONFIG) };
  }
  const variant = basename(path).replace(/\.config\.ts$/, '');
  return { id: `${basename(dirname(path))}-${variant}`, dir: dirname(path), config: path };
}

/** Where a site's build is written (dist/) and keeps its intermediate files (.kit/). */
export const buildDir = (id, repo = REPO) => join(repo, '.build', 'docs', id);

const rel = (p) => relative(REPO, p).split(sep).join('/') || '.';

function run(cwd, script, args = []) {
  console.log(`\n[docs-sites] ${rel(cwd)}: node ${rel(script)} ${args.join(' ')}`.trimEnd());
  const r = spawnSync(process.execPath, [script, ...args], { cwd, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`node ${rel(script)} failed in ${rel(cwd)} (exit ${r.status})`);
}

/** The site's config and the engine's plugins for it. Vite's root is the repository (the kit must be inside it). */
async function load(site, command) {
  const { loadConfigFromFile } = await import('vite');
  const { kitDocs } = await import('../src/kit/docs/node/vite.ts');
  const loaded = await loadConfigFromFile({ command, mode: command === 'build' ? 'production' : 'development' }, site.config, site.dir);
  if (!loaded) throw new Error(`${rel(site.config)}: no config`);
  const out = buildDir(site.id);
  // a docs.config.ts exports a DocsConfig, which Vite's loader types as its own config
  const docsConfig = /** @type {import('../src/kit/docs/node/config.ts').DocsConfig} */ (/** @type {unknown} */ (loaded.config));
  const config = { ...docsConfig, outDir: join(out, 'dist') };
  const workDir = join(out, '.kit');
  return { config, workDir, plugins: () => kitDocs(config, { configRoot: site.dir, workDir }) };
}

/** What a site does before it is built or served (generated pages, downloaded files): its scripts/prebuild.mjs. */
function prebuild(site) {
  const script = join(site.dir, 'scripts', 'prebuild.mjs');
  if (existsSync(script)) run(site.dir, script);
}

/** Client build, SSR build, prerender (one HTML file per URL), then the site's link check. */
async function buildSite(site) {
  const t0 = Date.now();
  prebuild(site);
  const { build } = await import('vite');
  const { prerenderDocs } = await import('../src/kit/docs/prerender.mjs');
  const { config, workDir, plugins } = await load(site, 'build');
  /** @type {import('vite').InlineConfig} */
  const shared = { root: REPO, configFile: false, logLevel: 'warn' };
  await build({ ...shared, plugins: plugins() });
  await build({ ...shared, plugins: plugins(), build: { ssr: true } });
  const { count } = await prerenderDocs({ root: REPO, workDir });
  console.log(`[docs-sites] ${site.id}: built ${count} pages in ${((Date.now() - t0) / 1000).toFixed(1)} s → ${rel(config.outDir)}`);

  const prefixes = (config.i18n?.locales ?? []).map((l) => (l.prefix ?? '').replace(/\/+$/, '')).filter(Boolean);
  const args = [config.outDir, '--base', config.base, '--site-origin', ORIGIN];
  if (config.i18n?.localeFirst) args.push('--locale-first', ...(prefixes.length ? [prefixes.join(',')] : []));
  const ignore = IGNORE_PATHS[config.base];
  if (ignore) args.push('--ignore-paths', ignore.join(','));
  run(REPO, join(REPO, 'src/kit/scripts/linkcheck.mjs'), args);
}

async function devSite(site, rest) {
  prebuild(site);
  const { createServer } = await import('vite');
  const { plugins } = await load(site, 'serve');
  const port = rest.includes('--port') ? Number(rest[rest.indexOf('--port') + 1]) : undefined;
  const server = await createServer({ root: REPO, configFile: false, plugins: plugins(), server: { port, host: rest.includes('--host') || undefined } });
  await server.listen();
  server.printUrls();
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  switch (command) {
    case 'list':
      for (const r of docsRoots()) console.log(r);
      return;
    case 'build': {
      const names = rest.length ? rest : docsRoots();
      if (names.length > 1) {
        // one process per site: the engine keeps state for the site it builds (the code highlighter's classes …)
        for (const name of names) run(REPO, fileURLToPath(import.meta.url), ['build', name]);
        return;
      }
      // before React is loaded (the engine and the prerender both import it): one build of React for both
      process.env.NODE_ENV = 'production';
      await buildSite(siteOf(names[0]));
      return;
    }
    case 'dev':
      if (!rest[0] || rest[0].startsWith('--')) throw new Error('dev: name a site (node scripts/docs-sites.mjs list)');
      process.env.NODE_ENV ??= 'development';
      await devSite(siteOf(rest[0]), rest.slice(1));
      return;
    case 'merge': {
      const into = resolve(rest[0] ?? 'dist');
      if (!existsSync(join(into, 'index.html'))) throw new Error(`${into} holds no site: run the site build first`);
      for (const root of docsRoots()) {
        const from = join(buildDir(basename(root)), 'dist');
        if (!existsSync(from)) throw new Error(`${rel(from)} is missing: build ${root} first`);
        console.log(`[docs-sites] ${root}: merged ${mergeDist(from, into)} files into ${relative(process.cwd(), into) || into}`);
      }
      return;
    }
    case 'other-sites':
      console.log(otherSites().join(','));
      return;
    case 'linkcheck': {
      const sites = otherSites();
      const args = [join(REPO, 'src/kit/scripts/linkcheck.mjs'), ...rest, ...(sites.length ? ['--other-sites', sites.join(',')] : [])];
      const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
      process.exitCode = r.status ?? 1;
      return;
    }
    default:
      console.error('Usage: node scripts/docs-sites.mjs list | build [site …] | dev <site> | merge <dist> | other-sites | linkcheck <dist> [options]');
      process.exitCode = 2;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    await main();
  } catch (e) {
    console.error(`[docs-sites] ${e.message}`);
    process.exitCode = 1;
  }
}
