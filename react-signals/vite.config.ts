import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: './src/index.html',
      }
    }
  },
  server: {
    open: './src/index.html',
  },
  plugins: [deno(), react()],
  resolve: {
    alias: {
      "@micurs/rp-lib": "../lib/dist/index.js",
      "@micurs/react-rp-lib": "../react-lib/dist/index.js"
    }
  }
})
