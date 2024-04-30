import { readFileSync, writeFileSync } from 'node:fs';
import type { Options } from 'tsup';

export default [
  {
    entryPoints: ['src/*.ts'],
    outDir: 'bin',
    clean: true,
    format: ['cjs'],
    dts: false,
    onSuccess: async () => {
      let cli = readFileSync('./bin/cli.cjs', 'utf8');
      cli = cli.replace('Context = function(retry) {', 'var Context = function(retry) {')
      writeFileSync('./bin/cli.cjs', cli);
    }
  },
] satisfies Options[];
