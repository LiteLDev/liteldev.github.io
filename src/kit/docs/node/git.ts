// "Last updated" timestamps: one `git log` pass over the repository. A page's time is that of the last commit that
// changed its text: a commit that only moved it (a rename with identical content) does not count, and the page's
// history is followed to where it was before (the docs moved from docs/<Project>/content/ to content/<Project>/pages/).
// Returns an empty map when git or history is unavailable.

import { execFileSync } from 'node:child_process';
import { relative, resolve, sep } from 'node:path';

/**
 * Parse `git log --format=%x00%ct --name-status -M` (newest first): path as it is now → time (ms) of the last commit
 * that changed its content. Exported for the tests.
 */
export function lastChanged(log: string): Map<string, number> {
  const out = new Map<string, number>();
  /** a path as older commits name it → the path it has now */
  const now = new Map<string, string>();
  let ts = 0;
  for (const line of log.split('\n')) {
    if (line.startsWith('\0')) {
      ts = Number(line.slice(1)) * 1000;
      continue;
    }
    const [status, a, b] = line.split('\t');
    if (!status || !a) continue;
    if ((status[0] === 'R' || status[0] === 'C') && b) {
      const current = now.get(b) ?? b;
      // R100: moved as it was; anything less changed the text too
      if (status !== 'R100' && !out.has(current)) out.set(current, ts);
      if (status[0] === 'R') {
        now.delete(b);
        now.set(a, current);
      }
    } else if (status[0] !== 'D') {
      const current = now.get(a) ?? a;
      if (!out.has(current)) out.set(current, ts);
      // added here: an older file of this name is another file
      if (status[0] === 'A') now.set(a, '');
    }
  }
  out.delete('');
  return out;
}

export function gitLastUpdated(contentRoot: string): Map<string, number> {
  const out = new Map<string, number>();
  try {
    const top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: contentRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const log = execFileSync('git', ['-c', 'core.quotePath=false', 'log', '--format=%x00%ct', '--name-status', '-M'], {
      cwd: top,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    for (const [file, ts] of lastChanged(log)) {
      const rel = relative(contentRoot, resolve(top, file)).split(sep).join('/');
      if (rel.startsWith('..')) continue;
      out.set(rel, ts);
    }
  } catch {
    /* not a git checkout, or git missing: no timestamps */
  }
  return out;
}
