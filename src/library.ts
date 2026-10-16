/**
 * @file
 *
 * The package entry point: every type Dataview's own `index` publishes, and working implementations of the two
 * functions it publishes beside them.
 *
 * Upstream's `obsidian-dataview` ships `getAPI` and `isPluginEnabled` as real code in `lib/index.js`, so a
 * types-only replacement would let `import { getAPI } from ...` compile and then fail at runtime. The bodies below
 * are upstream's, with the same answers.
 */

// Loads the ESM copy of obsidian-typings, the copy the `PluginsPluginsRecord` augmentation in `typings/obsidian-ex.d.ts`
// targets. `tsconfig.json` deliberately has no `types` entry for the package: on `node16` that entry loads the
// CommonJS copy, which an augmentation in this ES-module package never reaches.
/// <reference types="@obsidian-typings/obsidian-public-latest" resolution-mode="import" />

import type { App } from 'obsidian';

import type { DataviewApi } from './@types/api/plugin-api.d.ts';

// Every type the vendored `index` exports. Not `export type *`: that `index` also declares `getAPI` and
// `isPluginEnabled`, which this module implements.
export type {
  DataArray,
  DataObject,
  DataviewApi,
  DataviewInlineApi,
  DataviewInlineIOApi,
  DATE_SHORTHANDS,
  DateTime,
  Duration,
  DURATION_TYPES,
  EXPRESSION,
  ExpressionLanguage,
  Failure,
  FullIndex,
  IndexMap,
  KEYWORDS,
  Link,
  ListItem,
  Literal,
  LiteralRepr,
  LiteralType,
  LiteralWrapper,
  PageMetadata,
  parseField,
  PrefixIndex,
  Query,
  QUERY_LANGUAGE,
  Result,
  SListEntry,
  SMarkdownPage,
  STask,
  Success,
  Widget,
  WrappedLiteral
} from './@types/index.d.ts';

/**
 * The plugin id Dataview registers under.
 */
const DATAVIEW_PLUGIN_ID = 'dataview';

/**
 * Gets the Dataview API.
 *
 * @param app - The Obsidian app. When given, the API is read from the loaded Dataview plugin; otherwise from the
 * `window.DataviewAPI` global Dataview installs.
 * @returns The Dataview API, or `undefined` while Dataview is not loaded.
 */
export function getAPI(app?: App): DataviewApi | undefined {
  return app ? app.plugins.plugins[DATAVIEW_PLUGIN_ID]?.api : window.DataviewAPI;
}

/**
 * Checks whether Dataview is enabled in the given app.
 *
 * @param app - The Obsidian app.
 * @returns `true` when Dataview is among the enabled plugins, even before it has finished loading.
 */
export function isPluginEnabled(app: App): boolean {
  return app.plugins.enabledPlugins.has(DATAVIEW_PLUGIN_ID);
}
