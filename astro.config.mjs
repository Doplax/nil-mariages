// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://hayatravel.vercel.app',
  image: {
    domains: ['loremflickr.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
});
