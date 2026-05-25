test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/tests/**'], // 👈 Add this line to skip Playwright tests
  },