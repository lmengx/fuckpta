import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), crx({ manifest })],
  define: {
    'process.env.BUILD_TIME': JSON.stringify(new Date().toLocaleString()),
    'BUILD_TIME': JSON.stringify(new Date().toLocaleString())
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        options: resolve(__dirname, 'options.html'),
        dataManager: resolve(__dirname, 'data-manager.html'),
      },
    },
  },
})
