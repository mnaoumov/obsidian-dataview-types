# AGENTS.md

## Project overview

`@mnaoumov/obsidian-dataview` — working TypeScript types for the Dataview plugin's API, plus its `getAPI` / `isPluginEnabled` helpers. It replaces the upstream `obsidian-dataview` npm package, whose published declarations do not resolve in a consuming project. The README lists what is fixed against upstream and which upstream version the declarations track.

- `src/@types/**` — the vendored declarations, one file per upstream `lib/**/*.d.ts`, published as `@mnaoumov/obsidian-dataview/<path>` (types only). They moved here with their history from `@mnaoumov/obsidian-lib`'s `src/@types/dataview/`. ESLint does not read them, but `build:compile` and `build:validate-declarations` type-check them fully, `skipLibCheck` notwithstanding.
- `src/library.ts` — the package root: every type the vendored `index` exports, and real `getAPI` / `isPluginEnabled`. Upstream ships those two as runtime code, so a types-only replacement would compile and then fail at runtime. It is `library.ts` rather than `index.ts` because the toolkit treats every `src/**/index.ts` as a generated barrel: `build:clean` deletes it and coverage skips it. `build:types` also takes `src/library.ts`, when present, as the file that carries the `/// <reference lib>` directives. The type list is written out instead of `export type *`, because the vendored `index` also declares the two functions and `import-x/export` reports the shadowing. Add a type there when upstream adds one to its `index`.
- **The exports map is hand-written.** There is no `build:generate-exports`, because the toolkit's generator would publish the tree as `./@types/*`. `./*` maps onto `dist/lib/*/@types/`, and `./data-index` names its folder's `index`, which a wildcard cannot reach. There is no `build:generate-index` either, because nothing here is a barrel.
- It depends on no other `@mnaoumov` package at runtime. It builds and tests with `@mnaoumov/typescript-dev-toolkit` and `@mnaoumov/typescript-test-toolkit`. It does not need `@mnaoumov/obsidian-dev-toolkit`, because `obsidian` is used for types only.

## Keeping the declarations honest

- **A declaration names what Dataview's runtime exports, exactly.** A lint autofix once renamed `object` / `number` / `string` / `any` to `$object` / ... in the obsidian-lib copy, which made the types describe members that do not exist. The vendored files are excluded from ESLint so that cannot recur, and none of the repo's renaming rules may be pointed at them.
- **Moving to a new upstream version:** `npm pack obsidian-dataview@<version>` into a scratch folder, diff its `lib/**/*.d.ts` against the previous version's, and port the semantic changes by hand. Upstream's files cannot be copied over, because their imports are bare `baseUrl` paths that do not resolve. Then update the version named in the README.
- **The `PluginsPluginsRecord` augmentation in `typings/obsidian-ex.d.ts` applies here only because the program loads the ESM copy of `obsidian-typings`.** Do not put `@obsidian-typings/obsidian-public-latest` back into `compilerOptions.types` in `tsconfig.json`. On `node16` a `types` entry resolves under `require` and loads only the CommonJS copy, and the augmentation, written in this ES-module package, targets the ESM copy, so it merged into nothing and `getAPI` needed a type guard. `src/library.ts` loads the ESM copy with a `resolution-mode="import"` reference instead. `getAPI` reads `plugins.dataview?.api`, so it stops compiling if the augmentation stops landing. The two `tsconfig.validate-declarations*.json` configs keep the `types` entry: they only check that the published declarations resolve.

## Commands

Every script is a thin entry point under `scripts/`, run with `jiti`, over the shared tooling in `@mnaoumov/typescript-dev-toolkit`.

- `npm run gate` — **the branch gate: run it before committing.** It is the same code `npm run version` runs as its release preflight: the lockfile check, `format:check`, `spellcheck`, `lint:md`, `build`, `lint`, `find-overexposed`, `test:coverage`. CI (`.github/workflows/ci.yml`) runs the whole gate.
- `npm run build` — every `build:*` step this package defines, in order (`scripts/build.ts`).
- `npm test` / `npm run test:coverage` — the unit tests; `test:coverage` holds all four thresholds at 100%.
- `npm run lint` / `npm run lint:fix`, `npm run lint:md`, `npm run format`, `npm run spellcheck` — ESLint, markdownlint (every paragraph is one physical line), dprint and cspell.
- `npm run version '--' <type>` — the release. Quote the `--` in PowerShell.

## Releasing

`npm run version '--' <patch|minor|major>` runs the gate, bumps the version, writes `CHANGELOG.md`, commits, tags, pushes and creates the GitHub release. Publishing the release triggers `.github/workflows/publish-npm.yml`, which rebuilds and runs `npm publish` through npm trusted publishing (OIDC): no npm token exists anywhere. The package's trusted publisher on npmjs.com names this repository and `publish-npm.yml`; renaming the workflow breaks publishing until that setting matches.

## Commits

Conventional Commits, enforced by commitlint in the `commit-msg` hook. The `pre-commit` hook runs nano-staged: spellcheck, `lint:fix`, `format` and `lint:md:fix` on the staged files.
