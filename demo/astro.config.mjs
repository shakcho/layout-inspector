import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://layout-inspector.saktichourasia.dev';

export default defineConfig({
  site: SITE,
  root: __dirname,
  outDir: resolve(__dirname, '../demo-dist'),
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: {
        'layout-inspector': resolve(__dirname, '../src/index.ts'),
      },
    },
  },
});
