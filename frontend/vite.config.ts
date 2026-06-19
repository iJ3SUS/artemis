import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    autoImport({
      dts: true,
      imports: ['vue', 'vue-router'],
      dirs: [
        './src/utils',
        './src/stores',
        './src/composables',
        './src/components',
        './src/entities',
        './src/utils'
      ]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})
