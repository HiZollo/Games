import { defineConfig } from 'tsdown';
import type { UserConfig } from 'tsdown';

const config: UserConfig = defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  sourcemap: true,
  target: 'es2021',
})

export default config;