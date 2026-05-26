import { execSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const getLintingTargets = (patterns) => patterns > 0 ? patterns : ['.'];

const getPullReleaseFiles = (dir) => {
  const res = execSync('gh pr diff --name-only', { cwd: dir, encoding: 'utf-8' });

  if (res.error) throw res.error;

  return res.split('\n').filter(Boolean);
};

export default {
  input: '[...patterns]',
  options: [
    ['--fix', 'Fix the fixable eslint errors.'],
    ['--compat', 'Use config that is compatible with existing LAD projects.'],
    ['--pr', 'Lint all files changed on the PR associated with current branch'],
  ],
  description: 'Lint the current folder.',
  action: async (patterns, options) => {
    const toolsRoot = fileURLToPath(new URL('../', import.meta.url));
    const lintDirectory = process.cwd();

    const eslintBin = path.join(toolsRoot, 'node_modules', 'eslint', 'bin', 'eslint.js');
    const eslintConfig = options.compat
      ? path.join(toolsRoot, 'eslint-compat.config.js')
      : path.join(toolsRoot, 'eslint.config.js');

    const lintingTargets = options.pr
      ? getPullReleaseFiles(lintDirectory)
      : getLintingTargets(patterns);

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
