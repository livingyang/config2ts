import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// The site is published on the repo's GitHub Pages root:
// https://livingyang.github.io/config2ts/ — hence the base path.
// Build output goes to docs/ (the Pages root, artifacts only; the old
// Jekyll-rendered index.md / index-zh.md moved into src/content/).
export default defineConfig({
  base: "/config2ts/",
  plugins: [vue()],
  server: {
    fs: {
      // src/fixtures.ts imports ../../fixtures/* via ?raw, which lives above
      // the website/ root; allow the repo root for the dev server.
      allow: [path.resolve(__dirname, "..")],
    },
  },
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
