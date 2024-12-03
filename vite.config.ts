import { defineConfig } from 'npm:vite';
import dts from 'npm:vite-plugin-dts';

export default defineConfig({
  plugins:[
    dts({
      include: 'lib/src',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    minify: 'esbuild',
    // sourcemap: true,
    reportCompressedSize: true,
    lib: {
      entry: './lib/src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        sourcemap: true,
        compact: true,
        dir: 'dist',
        entryFileNames: 'index.js',
      }
    },
  }
});
