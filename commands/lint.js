import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
  input: '[...patterns]',
  options: [
    ['--fix', 'Fix the fixable eslint errors.'],
  ],
  description: 'Lint the current repo.',
  action: async (patterns, options) => {
    const toolsRoot = fileURLToPath(new URL('../', import.meta.url));
    const lintDirectory = process.cwd();

    const eslintBin = path.join(toolsRoot, 'node_modules', 'eslint', 'bin', 'eslint.js');
    const eslintConfig = path.join(toolsRoot, 'eslint.config.js');

    const lintingTargets = patterns.length > 0 ? patterns : ['.'];

    const eslintArgs = [
      eslintBin,
      '--config',
      eslintConfig,
      ...(options.fix ? ['--fix'] : []),
      ...lintingTargets,
    ];

    const res = spawnSync(process.execPath, eslintArgs, {
      stdio: 'inherit',
      cwd: lintDirectory,
    });

    if (res.error) throw res.error;
    process.exitCode = res.status ?? 1;
  },
};
