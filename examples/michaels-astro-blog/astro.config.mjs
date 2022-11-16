import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import flatFileCmsIntegration from "flat-file-cms";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  outDir: "./astro",
  server: {
    host: true,
    port: 3000,
  },
  integrations: [flatFileCmsIntegration()],
});
