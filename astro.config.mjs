// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ajmalroshan.dev',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !/\/(og|shutdown|404)\b/.test(page) })],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: false },
  },
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
