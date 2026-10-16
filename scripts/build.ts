/**
 * @file
 *
 * Builds the package: it runs every step of the pipeline below that the package defines a script for, in order.
 *
 * There is no `build:generate-index` and no `build:generate-exports`. The entry point, `src/library.ts`, is hand-written,
 * and so is the exports map: the generator would publish the declarations under `./@types/*`, where the whole point
 * of the package is that they resolve as `@mnaoumov/obsidian-dataview/<path>`.
 */

import { wrapCliTask } from '@mnaoumov/typescript-dev-toolkit/cli-utils';
import { runBuildSteps } from '@mnaoumov/typescript-dev-toolkit/library-build';

const BUILD_STEPS = [
  'build:clean',
  // The orchestrator, not the `build:compile:typescript` leaf it fans out to.
  'build:compile',
  'build:types',
  'build:validate-declarations',
  'build:lib'
];

await wrapCliTask(async () => {
  await runBuildSteps(BUILD_STEPS);
});
