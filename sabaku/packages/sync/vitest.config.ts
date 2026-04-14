import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './packages/sync',
    include: ['tests/**/*.test.ts'],
  },
})
