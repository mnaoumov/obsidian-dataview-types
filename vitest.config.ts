import {
  DEFAULT_VITEST_TEST_EXCLUDE,
  defineLibraryVitestConfig
} from '@mnaoumov/typescript-dev-toolkit/test-runners/vitest-config';

export default defineLibraryVitestConfig({
  projects: [
    {
      test: {
        environment: 'jsdom',
        exclude: [...DEFAULT_VITEST_TEST_EXCLUDE],
        include: ['src/**/*.test.ts'],
        name: 'unit-tests',
        pool: 'vmThreads',
        setupFiles: ['@mnaoumov/typescript-test-toolkit/vitest-setup']
      }
    }
  ]
});
