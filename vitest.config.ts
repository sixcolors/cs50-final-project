import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [
    svelte(),
    svelteTesting(),
  ],
  ssr: {
    noExternal: ['leaflet'],
  },
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