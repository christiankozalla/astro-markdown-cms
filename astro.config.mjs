import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  outDir: './astro',
  server: {
    host: true, // if vite only runs on localhost, inside the docker container there's no way to expose localhost, so we need to expose all hosts
    port: 3000
  }
});
