import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const verJson = JSON.parse(readFileSync('./ver.json', 'utf-8'))
const now = new Date().toLocaleString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), crx({ manifest })],
  define: {
    'process.env.BUILD_TIME': JSON.stringify(now),
    'BUILD_TIME': JSON.stringify(now),
    'import.meta.env.BUILD_TIME': JSON.stringify(now),
    __PLUGIN_VERSION__: JSON.stringify(verJson.version),
    __PLUGIN_CHANGES__: JSON.stringify(verJson.changes)
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
