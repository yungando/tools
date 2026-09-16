import { execSync } from 'node:child_process';
import { log } from 'node:console';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const getLintingTargets = (patterns) => patterns.length > 0 ? patterns : ['.'];

// eslint-disable-next-line consistent-return
const getPullReleaseFiles = (dir) => {
  try {
    const res = execSync('gh pr view --json files --jq \'.files[] | select(.changeType != "DELETED") | .path\'', { cwd: dir, encoding: 'utf-8' });

    return res.split('\n').filter(Boolean);
  } catch {
    process.exit();
  }
};

const getProjectRootDirectory = () => {
  const res = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' });

  if (res.error) throw res.error;

  return res.split('\n').at(0);
};

export default {
  input: '[...patterns]',
  options: [
    ['--fix', 'Fix the fixable eslint errors.'],
    ['--compat', 'Use config that is compatible with existing LAD projects.'],
    ['--pr', 'Lint all files changed on the PR associated with current branch.'],
  ],
  description: 'Lint the current folder.',
  action: async (patterns, options) => {
    const toolsRoot = fileURLToPath(new URL('../', import.meta.url));

    const eslintConfig = options.compat
      ? path.join(toolsRoot, 'eslint-compat.config.js')
      : path.join(toolsRoot, 'eslint.config.js');

    const lintDirectory = options.pr
      ? getProjectRootDirectory()
      : process.cwd();

    const lintingTargets = options.pr
      ? getPullReleaseFiles(lintDirectory)
      : getLintingTargets(patterns);

    const eslint = new ESLint({
      cwd: lintDirectory,
      overrideConfigFile: eslintConfig,
      fix: options.fix,
      warnIgnored: false,
    });

    const results = await eslint.lintFiles(lintingTargets);

    if (options.fix) {
      await ESLint.outputFixes(results);
    }

    const formatter = await eslint.loadFormatter('stylish');

    log(formatter.format(results));
    process.exitCode = results.some((r) => r.errorCount > 0) ? 1 : 0;
  },
};
