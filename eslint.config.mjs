import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

// Every script and module of the repository: the kit, levimc.org, LeviMC Mods, the build scripts, the docs sites'
// configs and scripts, and Doxygen's. Not linted: what a build writes, and the files served as they are.
const eslintConfig = defineConfig([
  globalIgnores([
    "dist/",
    ".build/",
    ".cache/",
    ".kit/",
    "public/",
    "content/*/public/",
    // written by src/kit/static/build-static.mjs (kit.js from kit.src.js, which is linted)
    "src/kit/static/kit.js",
    "src/kit/static/theme-init*.js",
  ]),
  {
    files: ["**/*.{ts,tsx,mts}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      // the apps run in the browser and are prerendered in Node; the docs engine's node/ half runs in Node only
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Let components drop props they do not forward, as in the
      // `({ node, ...props })` react-markdown components use.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    rules: {
      // Slugs and the search's "ASCII only" tests name control characters on purpose; a byte order mark and
      // other invisible characters appear in the expressions that remove them.
      "no-control-regex": "off",
      "no-irregular-whitespace": ["error", { skipRegExps: true }],
    },
  },
  {
    files: ["**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Browser tests and screenshot scripts (Playwright): callbacks passed to page.evaluate() run in the page.
    files: [
      "scripts/**/*.mjs",
      "src/kit/scripts/**/*.mjs",
      "src/kit/tests/*.e2e.mjs",
      "content/tutorials/scripts/shots/**/*.mjs",
    ],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // Scripts a page loads as they are.
    files: ["src/kit/static/kit.src.js", "content/tutorials/scripts/shots/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: "script",
      // ml, rp, wp, PS: the shared preference code build-static.mjs puts in front of kit.src.js
      globals: { ...globals.browser, ml: "readonly", rp: "readonly", wp: "readonly", PS: "readonly" },
    },
  },
  {
    // Written for every browser the pages may meet, and (legacyForward) put into pages as it is: `catch (e)`.
    files: ["src/kit/static/kit.src.js", "src/legacy/build.mjs"],
    rules: {
      "no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
]);

export default eslintConfig;
