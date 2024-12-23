import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins:[
    dts({
      include: 'src',
      insertTypesEntry: true,
      rollupTypes: true,
    }) as Plugin,
  ],
  build: {
    minify: 'esbuild',
    sourcemap: true,
    reportCompressedSize: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        compact: true,
        dir: 'dist',
        entryFileNames: 'index.js',
      }
    },
  }
});
