import { build } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({ root, configFile: false, logLevel: 'error', build: { outDir: '.runtime', emptyOutDir: true, lib: { entry: path.join(root, 'src/adapters/grooveApi.ts'), formats: ['es'], fileName: () => 'groove-api.mjs' }, minify: false } });
