import type { Options } from 'tsup';

export default [
  {
    entryPoints: ['src/*.ts'],
    outDir: 'bin',
    clean: true,
    format: ['cjs'],
    dts: false,
  },
] satisfies Options[];
