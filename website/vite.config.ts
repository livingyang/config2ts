import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { readFileSync } from "node:fs";

// The site is published on the repo's GitHub Pages root:
// https://livingyang.github.io/config2ts/ — hence the base path.
// Build output goes to docs/ (the Pages root, artifacts only; the old
// Jekyll-rendered index.md / index-zh.md moved into src/content/).

// Surface the tool's own version (from the root package.json, the single
// source of truth) on the site header, so the docs always show what they
// describe. Injected at build time so it stays in sync without a hardcoded copy.
const toolVersion = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
).version as string;

// Same treatment for the changelog: read the repo-root CHANGELOG.md at build
// time and inject it, so the site changelog is byte-identical to the file
// GitHub / npm consumers read — no duplicated copy to keep in sync.
const changelog = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf-8");

export default defineConfig({
  base: "/config2ts/",
  plugins: [vue()],
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(toolVersion),
    "import.meta.env.VITE_CHANGELOG": JSON.stringify(changelog),
  },
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
