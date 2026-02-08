/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AVAILABLE_SHEETS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
