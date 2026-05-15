import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/*/tests/**/*.test.ts',
      'tests/integration/**/*.test.ts',
    ],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 120000,  // 2 min for E2E
    hookTimeout: 120000,  // 2 min for beforeAll (npm install)
  },
});
