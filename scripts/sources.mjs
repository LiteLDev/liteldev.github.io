#!/usr/bin/env node
// What levimc.org is built from outside this repository, for .github/workflows/discover.yml (every hour):
//
//   node scripts/sources.mjs [--dry-run]
//
// - Takes out of content/mods/repos.txt every repository GitHub no longer serves (deleted, or made private): its tags
//   cannot be listed and GitHub's API answers 404 for it. A renamed or transferred repository is still served (GitHub
//   redirects it) and stays. The build skips such a line anyway (src/mods/server/registry.ts); this keeps the list
//   true. --dry-run only logs them.
// - Prints a fingerprint of the rest: every version tag of every repository in repos.txt (LeviMC Mods), and the
//   commits LiteLDev/LeviLamina (the API reference, doxygen/build.sh) and LiteLDev/BeDD (its AsyncAPI document,
//   content/BeDD/scripts/fetch-spec.mjs) are at. A new fingerprint means a deploy would publish something new. It is
//   empty when a repository could not be asked: the next run tries again.
//
// Writes `removed=<owner/repo,…>` and `fingerprint=<sha256>` to standard output (as $GITHUB_OUTPUT takes them) and
// logs to standard error. GITHUB_TOKEN, when set, is used for the API.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { parseRepoList, removeRepos } from "../src/mods/lib/repo-list.ts";
import { mapLimit } from "../src/mods/server/map-limit.ts";
import { listTags, resolveRepo } from "../src/mods/server/registry.ts";

const REPOS_PATH = "content/mods/repos.txt";
/** Repositories the site is built from besides the mods, and the branch of each that is read. */
const BRANCHES = { "LiteLDev/LeviLamina": "HEAD", "LiteLDev/BeDD": "refs/heads/main" };

const dryRun = process.argv.includes("--dry-run");
const text = readFileSync(REPOS_PATH, "utf8");
const repos = parseRepoList(text);

const lines = [];
const gone = [];
let unknown = 0;
await mapLimit(repos, async (repo) => {
  let tags;
  try {
    tags = await listTags(repo);
  } catch (error) {
    console.error(`${repo}: could not list its tags (${String(error).split("\n")[0]})`);
    unknown++;
    return;
  }
  if (tags) {
    for (const [tag, sha] of tags) lines.push(`${repo.toLowerCase()} ${tag} ${sha}`);
    return;
  }
  // git says nothing is there; the API must agree (it answers 404 only for a repository that is not served)
  const found = await resolveRepo(repo);
  if (found === null) gone.push(repo);
  else {
    console.error(`${repo}: git found no repository, GitHub's API ${found ? `serves ${found}` : "could not be asked"}`);
    unknown++;
  }
});

for (const [repo, ref] of Object.entries(BRANCHES)) {
  try {
    const out = execFileSync("git", ["-c", "credential.helper=", "ls-remote", `https://github.com/${repo}.git`, ref], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      timeout: 60_000,
    });
    lines.push(`${repo.toLowerCase()} ${out.trim()}`);
  } catch (error) {
    console.error(`${repo}: could not read ${ref} (${String(error).split("\n")[0]})`);
    unknown++;
  }
}

gone.sort();
if (gone.length) {
  console.error(`${dryRun ? "would remove" : "removed"} from ${REPOS_PATH}: ${gone.join(", ")}`);
  if (!dryRun) writeFileSync(REPOS_PATH, removeRepos(text, gone));
}
const fingerprint = unknown ? "" : createHash("sha256").update(lines.sort().join("\n")).digest("hex");
console.error(`${repos.length - gone.length} repositories, ${lines.length} lines; fingerprint ${fingerprint || `unknown (${unknown} could not be read)`}`);
console.log(`removed=${gone.join(",")}`);
console.log(`fingerprint=${fingerprint}`);
