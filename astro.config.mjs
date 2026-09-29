// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ajuroshan.me',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
