import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'svelte-leafletjs': path.resolve(__dirname, 'tests/mocks/svelte-leafletjs.ts'),
    },
  },
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