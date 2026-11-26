// node --test blog/  (Node ≥ 22.18: native TypeScript)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buildBlog, hardBreaks, hexoSlugize, parseHexoDate } from './content.ts';

test('hexoSlugize matches hexo-util slugize (Hexo tag/category paths)', () => {
  assert.equal(hexoSlugize('Bedrock Dedicated Server'), 'Bedrock-Dedicated-Server');
  assert.equal(hexoSlugize('LeviLamina'), 'LeviLamina');
  assert.equal(hexoSlugize('C++ / Hooks'), 'C-Hooks');
  assert.equal(hexoSlugize('Café déjà vu'), 'Cafe-deja-vu');
  assert.equal(hexoSlugize('反作弊'), '反作弊');
});

test('parseHexoDate reads front matter dates as Asia/Shanghai', () => {
  assert.deepEqual(parseHexoDate('2023-07-26 18:28:00', 'x'), { iso: '2023-07-26T18:28:00+08:00', y: '2023', m: '07', d: '26' });
  assert.deepEqual(parseHexoDate('2024-8-1', 'x'), { iso: '2024-08-01T00:00:00+08:00', y: '2024', m: '08', d: '01' });
  // a YAML timestamp (UTC) late in the day is the next day in Shanghai
  assert.equal(parseHexoDate(new Date('2023-07-26T20:00:00Z'), 'x').d, '27');
  assert.throws(() => parseHexoDate('yesterday', 'x'));
});

test('hardBreaks: newlines in paragraphs become line breaks, code fences are untouched', () => {
  const md = 'a\nb\n\n```cpp\nint x;\nint y;\n```\nc  \nd';
  assert.equal(hardBreaks(md), 'a  \nb  \n\n```cpp\nint x;\nint y;\n```\nc  \nd  ');
});

test('the blog builds: Hexo permalinks, terms, archives, pages, rendered markdown', async () => {
  const root = fileURLToPath(new URL('../../..', import.meta.url));
  const b = await buildBlog(root);
  assert.deepEqual(b.warnings, []);
  assert.deepEqual(
    b.data.posts.map((p) => p.url),
    ['/blog/2023/07/31/machine-learning-killaura-detect/'],
  );
  assert.deepEqual(
    b.data.tags.map((t) => [t.url, t.count]),
    [['/blog/tags/Bedrock-Dedicated-Server/', 1], ['/blog/tags/LiteLoaderBDS/', 1]],
  );
  assert.equal(b.data.categories[0]?.url, '/blog/categories/Bedrock-Dedicated-Server/');
  for (const r of ['/blog/', '/blog/tags/', '/blog/categories/', '/blog/archives/', '/blog/archives/2023/', '/blog/archives/2023/07/', '/blog/about/', '/blog/friends/'])
    assert.ok(b.routes.includes(r), r);
  assert.match(b.docs.get('machine-learning-killaura-detect')!.html, /src="\/blog\/images\/2023\/07\/31\/3RwnGp9VqgZby8t\.jpg"/);
});
