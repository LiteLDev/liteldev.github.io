import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import MiniSearch from 'minisearch';
import { buildSearch, byLanguage, htmlSections, languageOfPath, languageOfTag, siteOfPath } from './search-index.mjs';
import { searchOptions, tokenizeQuery } from '../src/kit/docs/shared/search.ts';

test('languages and sites of URLs', () => {
  assert.equal(languageOfPath('/zh-Hans/LeviLamina/x/'), 'zh-Hans');
  assert.equal(languageOfPath('/ja/LeviLauncher/'), 'ja');
  assert.equal(languageOfPath('/LeviLamina/x/'), null);
  assert.equal(languageOfTag('zh-CN'), 'zh-Hans');
  assert.equal(languageOfTag('zh-HK'), 'zh-Hant');
  assert.equal(languageOfTag('ja-JP'), 'ja');
  assert.equal(languageOfTag('en-US'), 'en');
  assert.equal(languageOfTag(''), 'en');
  assert.equal(siteOfPath('/zh-Hans/lip/guide/'), 'lip');
  assert.equal(siteOfPath('/blog/2023/07/26/x/'), 'blog');
  assert.equal(siteOfPath('/about/'), 'about');
  assert.equal(siteOfPath('/'), '');
});

const page = ({ lang = 'en', title, body, alternates = true }) => `<!doctype html><html lang="${lang}"><head><title>${title}</title>
<meta property="og:site_name" content="LeviMC" />${alternates ? '<link rel="alternate" hreflang="en" href="https://levimc.org/x/" />' : ''}</head>
<body><header><nav>Home Tutorials</nav></header><main>${body}</main><footer>© LeviMC</footer></body></html>`;

test('sections of a prerendered page', () => {
  const r = htmlSections(
    page({
      lang: 'zh-Hans',
      title: '蜂巢崩服问题的解决 - 博客 - LeviMC',
      alternates: false,
      body: '<p class="kicker">2023</p><h1 id="t">蜂巢崩服问题的解决</h1><p>引言 文字</p><h2 id="起因">起因 <span aria-hidden="true">#</span></h2><p>蜜蜂</p><pre>code()</pre><h3>无 id</h3><p>更多</p><h2 id="empty">空</h2>',
    }),
  );
  assert.equal(r.page, '蜂巢崩服问题的解决');
  assert.equal(r.crumbs, '博客');
  assert.equal(r.site, 'LeviMC');
  assert.equal(r.translated, false);
  assert.deepEqual(
    r.sections.map((s) => [s.id, s.title, s.text]),
    [
      ['', '蜂巢崩服问题的解决', '2023 引言 文字'],
      ['起因', '起因', '蜜蜂 无 id 更多'],
    ],
  );
  // the home page: "LeviMC - <tagline>", the h1 is the page
  const home = htmlSections(page({ title: 'LeviMC - Open-Source Tools', body: '<h1>Mod Bedrock your way.</h1><p>Hi</p><h2 id="latest">Latest posts <small>7</small></h2><p>x</p>' }));
  assert.equal(home.page, 'Mod Bedrock your way.');
  assert.equal(home.crumbs, '');
  assert.equal(home.translated, true);
  assert.deepEqual(home.sections.map((s) => s.title), ['Mod Bedrock your way.', 'Latest posts 7']);
});

test('a language holds its pages, one-language pages and English sites it has no pages of', () => {
  const d = (url, lang, siteKey, everywhere) => ({ url, lang, siteKey, ...(everywhere ? { everywhere } : {}) });
  const docs = [
    d('/LeviLamina/', 'en', 'LeviLamina'),
    d('/zh-Hans/LeviLamina/', 'zh-Hans', 'LeviLamina'),
    d('/LeviLauncher/', 'en', 'LeviLauncher'),
    d('/ja/LeviLauncher/', 'ja', 'LeviLauncher'),
    d('/blog/2023/x/', 'zh-Hans', 'blog', true),
  ];
  const urls = (lang) => byLanguage(docs).get(lang).map((x) => x.url);
  assert.deepEqual(urls('en'), ['/LeviLamina/', '/LeviLauncher/', '/blog/2023/x/']);
  assert.deepEqual(urls('zh-Hans'), ['/zh-Hans/LeviLamina/', '/LeviLauncher/', '/blog/2023/x/']);
  assert.deepEqual(urls('ja'), ['/LeviLamina/', '/ja/LeviLauncher/', '/blog/2023/x/']);
});

test('buildSearch: docs sites and other pages in one index per language', () => {
  const dist = mkdtempSync(join(tmpdir(), 'search-index-'));
  const write = (f, s) => {
    mkdirSync(dirname(join(dist, f)), { recursive: true });
    writeFileSync(join(dist, f), s);
  };
  try {
    write('sitemap.xml', '<urlset><url><loc>https://levimc.org/about/</loc></url><url><loc>https://levimc.org/zh-Hans/about/</loc></url><url><loc>https://levimc.org/blog/tags/</loc></url><url><loc>https://levimc.org/lip/</loc></url></urlset>');
    write('about/index.html', page({ title: 'About - LeviMC', body: '<h1>About</h1><p>A small team</p>' }));
    write('zh-Hans/about/index.html', page({ lang: 'zh-Hans', title: '关于 - LeviMC', body: '<h1>关于</h1><p>一个小团队</p>' }));
    write('blog/tags/index.html', page({ title: 'Tags - LeviMC', body: '<h1>Tags</h1><p>tag list</p>' }));
    // a docs site: its own documents, not its HTML
    write('lip/index.html', page({ title: 'lip', body: '<h1>lip</h1><p>html text</p>' }));
    write(
      'lip/_kit/search-docs.json',
      JSON.stringify({
        title: 'lip',
        base: '/lip/',
        locales: {
          en: { lang: 'en-US', docs: [{ url: '/lip/', title: 'lip', page: 'lip', crumbs: '', text: 'package manager' }] },
          zh: { lang: 'zh-CN', docs: [{ url: '/zh-Hans/lip/', title: 'lip', page: 'lip', crumbs: '', text: '包管理器' }] },
        },
      }),
    );
    const r = buildSearch(dist);
    assert.equal(r.docsSites, 2);
    // kept: running it again gives the same indexes
    assert.equal(existsSync(join(dist, 'lip/_kit/search-docs.json')), true);
    assert.equal(buildSearch(dist).docsSites, 2);
    const manifest = JSON.parse(readFileSync(join(dist, '_search/manifest.json'), 'utf8'));
    assert.deepEqual(Object.keys(manifest.indexes).sort(), ['en', 'zh-Hans']);
    const load = (lang) => MiniSearch.loadJSON(readFileSync(join(dist, manifest.indexes[lang]), 'utf8'), { ...searchOptions, storeFields: [...searchOptions.storeFields, 'site'] });
    const find = (lang, q) => load(lang).search(q, { tokenize: tokenizeQuery, prefix: true }).map((x) => x.path);
    assert.deepEqual(find('en', 'package'), ['/lip/']);
    assert.deepEqual(find('en', 'team'), ['/about/']);
    assert.deepEqual(find('en', 'html'), []);
    assert.deepEqual(find('en', 'tag'), []);
    assert.deepEqual(find('zh-Hans', '包管理'), ['/zh-Hans/lip/']);
    assert.deepEqual(find('zh-Hans', '团队'), ['/zh-Hans/about/']);
    assert.equal(load('en').search('package', { tokenize: tokenizeQuery })[0].site, 'lip');
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});
