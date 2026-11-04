import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// The site is published under the repo's GitHub Pages as a sub-app:
// https://livingyang.github.io/config2ts/app/ — hence the base path.
// Build output goes to docs/app/ (docs/ is the Pages root, artifacts only).
export default defineConfig({
  base: "/config2ts/app/",
  plugins: [vue()],
  server: {
    fs: {
      // src/fixtures.ts imports ../../fixtures/* via ?raw, which lives above
      // the website/ root; allow the repo root for the dev server.
      allow: [path.resolve(__dirname, "..")],
    },
  },
  build: {
    outDir: "../docs/app",
    emptyOutDir: true,
  },
});
