# @mnaoumov/obsidian-dataview

Working TypeScript types for the [Dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin's API, plus its `getAPI` / `isPluginEnabled` helpers. It replaces the [`obsidian-dataview`](https://www.npmjs.com/package/obsidian-dataview) npm package, whose declarations do not compile in a consuming project.

## Installation

```bash
npm install @mnaoumov/obsidian-dataview
```

`obsidian` is a peer dependency, and so are the `@codemirror/state`, `@codemirror/view` and `@lezer/common` versions it brings. `@obsidian-typings/obsidian-public-latest` is an optional peer: `typings/obsidian-ex` augments its `PluginsPluginsRecord` with the Dataview plugin. That augmentation only takes effect for code that resolves the CommonJS flavor of `obsidian-typings`, which is the one `compilerOptions.types` loads. From an ES module it merges into nothing, so prefer `getAPI(app)` to reading `app.plugins.plugins.dataview`.

## Usage

```ts
import type { DataviewApi } from '@mnaoumov/obsidian-dataview';
import type { DataviewInlineApi } from '@mnaoumov/obsidian-dataview/api/inline-api';

import {
  getAPI,
  isPluginEnabled
} from '@mnaoumov/obsidian-dataview';

if (isPluginEnabled(this.app)) {
  const dataviewApi: DataviewApi | undefined = getAPI(this.app);
}
```

The package root exports every type Dataview's own `index` exports, and implements `getAPI` and `isPluginEnabled` the way upstream does. Each of upstream's declaration modules is a subpath of the same name: `obsidian-dataview/lib/api/inline-api` is `@mnaoumov/obsidian-dataview/api/inline-api`. The subpaths carry types only.

### Coming from `@mnaoumov/obsidian-lib`

The types lived in `@mnaoumov/obsidian-lib` and `obsidian-dev-utils` as `@types/dataview/*`. To switch, drop that prefix: `@mnaoumov/obsidian-lib/@types/dataview/api/inline-api` becomes `@mnaoumov/obsidian-dataview/api/inline-api`, and `@mnaoumov/obsidian-lib/@types/dataview` becomes `@mnaoumov/obsidian-dataview`.

That copy had five names a lint autofix renamed: `Fields.$object` and `DefaultFunctions.$object`, `$number`, `$string` and `$any`. Dataview exports them without the `$`, and so does this package.

## Tracked upstream version

The declarations track **Dataview 0.5.68**, the latest `obsidian-dataview` release. They were copied from upstream's 0.5.67 `lib/**/*.d.ts` in August 2024, and the 0.5.68 changes were ported when this package was created.

## What is fixed against upstream

- **Every import resolves.** Upstream's declarations import each other through bare paths such as `"api/plugin-api"` and `"data-model/value"`. These come from Dataview's own `baseUrl` and were never rewritten for publishing, so no consuming project can resolve them. Here every relative import names its file (`'./plugin-api.d.ts'`), and every import that only brings in types says so.
- **No dependency installs from git.** Upstream's `package.json` takes `@codemirror/language` from a GitHub URL and pulls in about a dozen runtime packages for code a consumer never runs. Here, the dependencies are the packages the declarations name.
- **`typings/obsidian-ex` stops redeclaring Obsidian internals.** Upstream adds `App.appId`, `App.plugins` and `Editor.cm` to `obsidian` itself, and those collide with `obsidian-typings`. Here, the Dataview plugin is added to `obsidian-typings`' `PluginsPluginsRecord` instead. The `MetadataCache.trigger` overloads, the `dataview:refresh-views` workspace event and the `window.DataviewAPI` global stay as upstream declares them.
- **`localforage` is declared.** `data-import/persister` uses the `LocalForage` type without importing it.
- **Comment typos** are fixed, a superset of the ones 0.5.68 fixed.

## License

© [Michael Naumov](https://github.com/mnaoumov/)

The declarations are derived from [Dataview](https://github.com/blacksmithgu/obsidian-dataview), which is also MIT-licensed. Its copyright notice is kept in `LICENSE`.
