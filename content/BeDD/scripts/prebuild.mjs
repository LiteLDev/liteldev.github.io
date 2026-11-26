#!/usr/bin/env node
// Before every build and dev server of this site (scripts/docs-sites.mjs runs it): download the protocol's
// AsyncAPI document into public/ (fetch-spec.mjs).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

execFileSync(process.execPath, [fileURLToPath(new URL('./fetch-spec.mjs', import.meta.url))], { stdio: 'inherit' });
