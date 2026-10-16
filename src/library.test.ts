import type { App } from 'obsidian';

import { strictProxy } from '@mnaoumov/typescript-test-toolkit/strict-proxy';
import {
  afterEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import type { DataviewApi } from './@types/api/plugin-api.d.ts';

import {
  getAPI,
  isPluginEnabled
} from './library.ts';

interface CreateAppParams {
  readonly dataviewApi?: DataviewApi;
  readonly enabledPluginIds?: string[];
}

function createApp(params: CreateAppParams): App {
  // The key is always present: `strictProxy` throws on a read of an unmocked one, where Obsidian's record answers `undefined`.
  const plugins: Record<string, unknown> = {
    dataview: params.dataviewApi ? { api: params.dataviewApi } : undefined
  };

  return strictProxy<App>({
    plugins: {
      enabledPlugins: new Set(params.enabledPluginIds),
      plugins
    }
  } as Partial<App>);
}

describe('getAPI', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should read the API from the loaded plugin when given an app', () => {
    const dataviewApi = strictProxy<DataviewApi>({});
    expect(getAPI(createApp({ dataviewApi }))).toBe(dataviewApi);
  });

  it('should return undefined when the app has no Dataview plugin loaded', () => {
    expect(getAPI(createApp({}))).toBeUndefined();
  });

  it('should read the window global when no app is given', () => {
    const dataviewApi = strictProxy<DataviewApi>({});
    vi.stubGlobal('DataviewAPI', dataviewApi);
    expect(getAPI()).toBe(dataviewApi);
  });

  it('should return undefined when no app is given and the global is absent', () => {
    expect(getAPI()).toBeUndefined();
  });
});

describe('isPluginEnabled', () => {
  it('should return true when Dataview is enabled', () => {
    expect(isPluginEnabled(createApp({ enabledPluginIds: ['dataview'] }))).toBe(true);
  });

  it('should return false when Dataview is not enabled', () => {
    expect(isPluginEnabled(createApp({ enabledPluginIds: ['other-plugin'] }))).toBe(false);
  });
});
