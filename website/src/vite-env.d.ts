/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Tool version injected from the root package.json by vite.config.ts */
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
