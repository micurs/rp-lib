/// <reference lib="deno.ns" />

import { join } from '@std/path';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import deno from '@deno/vite-plugin';

const rpLibPath = join(Deno.cwd(), '../lib/src/index.ts');

export default defineConfig({
  plugins: [
    deno(),
    dts({
      include: 'src',
      rollupTypes: true,
      compilerOptions: {
        paths: {
          '@micurs/rp-lib': [rpLibPath],
        },
      },
      beforeWriteFile: (filePath, content) => {
        if (!filePath.endsWith('index.d.ts')) {
          return {
            filePath,
            content,
          };
        }
        // Replace the import path with the correct library reference.
        return ({
          filePath,
          content: content.replace(/..\/..\/lib\/src\/index.ts/g, '@micurs/rp-lib'),
        });
      },
    }) as Plugin,
  ],
  resolve: {
    alias: {
      '@micurs/rp-lib': rpLibPath,
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: true,
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', '@micurs/rp-lib'],
      output: {
        compact: true,
        dir: 'dist',
        entryFileNames: 'index.js',
      },
    },
  },
});
