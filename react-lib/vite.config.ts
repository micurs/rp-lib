/// <reference lib="deno.ns" />

import { join } from "@std/path";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import deno from "@deno/vite-plugin";

const rpLibPath = join(Deno.cwd(), "../lib/src/index.ts");
console.log("@micurs/rp-lib", rpLibPath);

export default defineConfig({
  plugins: [
    deno(),
    dts({
      include: "src",
      rollupTypes: true,
      insertTypesEntry: true,
    }) as Plugin,
  ],
  resolve: {
    alias: {
      "@micurs/rp-lib": rpLibPath,
    },
  },
  build: {
    minify: "esbuild",
    sourcemap: true,
    reportCompressedSize: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "@micurs/rp-lib"],
      output: {
        compact: true,
        dir: "dist",
        entryFileNames: "index.js",
      },
    },
  },
});
