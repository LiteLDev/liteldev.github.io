#!/usr/bin/env node
// Before every build and dev server of this site (scripts/docs-sites.mjs runs it): check the Traditional Chinese
// converter, then write pages/zh-Hant/ from pages/zh/ (zh-hant.mjs).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

for (const script of ['./zh-hant.test.mjs', './zh-hant.mjs']) {
  execFileSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url))], { stdio: 'inherit' });
}
