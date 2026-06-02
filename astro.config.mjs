// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nil-mariages.vercel.app',
  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' } } })],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'ca'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
