// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fontOptimizer from './src/integrations/font-optimizer.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.yudai.dev',
  integrations: [sitemap(), fontOptimizer()],
  vite: {
    plugins: [tailwindcss()],
  },
});