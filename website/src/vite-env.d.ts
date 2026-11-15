/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Tool version injected from the root package.json by vite.config.ts */
  readonly VITE_APP_VERSION: string;
  /** Changelog markdown injected from the repo-root CHANGELOG.md by vite.config.ts */
  readonly VITE_CHANGELOG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
