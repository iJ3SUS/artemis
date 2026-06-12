/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_SESSION_KEY: string
  readonly VITE_TIMEZONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
