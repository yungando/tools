import { spawnSync } from 'node:child_process';
import copyToClipboard from '../utils/copy-to-clipboard.js';

export default {
  input: '<key> <value>',
  description: 'Create env var in BWS.',
  action: async (key, value) => {
    const bwsArgs = [
      'secret',
      'create',
      key,
      value,
      process.env.BWS_PROJECT_ID,
    ];

    const res = spawnSync('bws', bwsArgs, { encoding: 'utf-8' });
    const { id } = JSON.parse(res.stdout.trim());

    const exportString = `export ${key}='{{ (bitwardenSecrets "${id}" (env "BWS_ACCESS_TOKEN")).value }}'`;

    // eslint-disable-next-line no-console
    console.log(exportString);
    copyToClipboard(exportString);
  },
};
