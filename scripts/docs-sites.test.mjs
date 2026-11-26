// Tests for scripts/docs-sites.mjs (part of `npm test`): which docs sites the build finds, what levimc.org's link
// check treats as another site's, and the merge of each docs build into levimc.org's dist/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { docsRoots, externalProjects, mergeDist, otherSites, siteOf } from './docs-sites.mjs';

function tree(files) {
  const dir = mkdtempSync(join(tmpdir(), 'docs-sites-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), body);
  }
  return dir;
}

test('docs sites: the tutorials, the FAQ, then every other content/<name>/ with a docs.config.ts', () => {
  const repo = tree({
    'content/tutorials/docs.config.ts': '',
    'content/faq/docs.config.ts': '',
    'content/lip/docs.config.ts': '',
    'content/LeviLamina/docs.config.ts': '',
    'content/README.md': '',
    'content/blog/posts/x.md': '',
    'content/mods/repos.txt': '',
  });
  try {
    assert.deepEqual(docsRoots(repo), ['content/tutorials', 'content/faq', 'content/LeviLamina', 'content/lip']);
    assert.deepEqual(externalProjects(repo), ['LegacyScriptEngine', 'LeviLauncher', 'BeDD', 'bedboo']);
    const other = otherSites(repo);
    assert.ok(other.includes('/LeviLauncher/') && other.includes('/ja/LeviLauncher/') && other.includes('/zh-Hant/bedboo/'));
    assert.ok(!other.some((p) => p.includes('/lip/') || p.includes('/LeviLamina/')), 'built here: checked as internal');
    assert.equal(siteOf('lip', repo).config, join(repo, 'content', 'lip', 'docs.config.ts'));
    assert.equal(siteOf('content/lip', repo).id, 'lip');
    assert.throws(() => siteOf('blog', repo), /no docs\.config\.ts/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
  const empty = tree({ 'content/tutorials/docs.config.ts': '' });
  try {
    assert.deepEqual(docsRoots(empty), ['content/tutorials'], 'no project docs: the tutorials only');
    assert.equal(otherSites(empty).length, 6 * 9);
  } finally {
    rmSync(empty, { recursive: true, force: true });
  }
});

test('a site named by a config file: the test sites of the kit', () => {
  const repo = tree({ 'src/kit/demo/docs.config.ts': '', 'src/kit/demo/lip.config.ts': '' });
  try {
    assert.equal(siteOf('src/kit/demo', repo).id, 'demo');
    const lip = siteOf('src/kit/demo/lip.config.ts', repo);
    assert.deepEqual([lip.id, lip.dir, lip.config], ['demo-lip', join(repo, 'src', 'kit', 'demo'), join(repo, 'src', 'kit', 'demo', 'lip.config.ts')]);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test('merge: a docs build joins the site; its 404.html and .nojekyll are dropped; a clash fails before copying', () => {
  const site = tree({ 'index.html': 'site', '404.html': 'site 404', '.nojekyll': '', 'zh-Hans/index.html': 'zh' });
  const docs = tree({ '404.html': 'docs 404', '.nojekyll': '', 'Demo/index.html': 'demo', 'zh-Hans/Demo/index.html': 'demo zh', 'Demo/assets/a.js': 'js' });
  try {
    assert.equal(mergeDist(docs, site), 3);
    assert.equal(readFileSync(join(site, '404.html'), 'utf8'), 'site 404');
    assert.equal(readFileSync(join(site, 'zh-Hans/Demo/index.html'), 'utf8'), 'demo zh');
    assert.equal(readFileSync(join(site, 'zh-Hans/index.html'), 'utf8'), 'zh');
    const clash = tree({ 'Demo/index.html': 'other', 'Other/index.html': 'x' });
    try {
      assert.throws(() => mergeDist(clash, site), /1 file\(s\) exist .*Demo\/index\.html/);
      assert.throws(() => readFileSync(join(site, 'Other/index.html')), 'nothing copied');
    } finally {
      rmSync(clash, { recursive: true, force: true });
    }
  } finally {
    rmSync(site, { recursive: true, force: true });
    rmSync(docs, { recursive: true, force: true });
  }
});
