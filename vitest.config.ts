import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({ hot: !process.env.VITEST }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['lcov'],
      exclude: [
        'public/**',
        'svelte.config.js',
        'rollup.config.js',
        'src/main.ts',
      ],
    },
  },
})