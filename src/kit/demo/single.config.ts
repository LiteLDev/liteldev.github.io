// The docs demo as a single-locale site (English only, at /Single/): the LeviMC chrome — bar, footer, the
// drawer's LeviMC links — follows the visitor's stored language; the content stays English.
//   node scripts/docs-sites.mjs build src/kit/demo/single.config.ts
import { defineDocsConfig } from '../docs/node/config.ts';
import docs from './docs.config.ts';

export default defineDocsConfig({
  ...docs,
  base: '/Single/',
  i18n: { ...docs.i18n!, locales: docs.i18n!.locales.filter((l) => l.code === 'en') },
  exclude: [...(docs.exclude ?? []), '**/*.zh.md'],
});
