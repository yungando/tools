import slugify from '@sindresorhus/slugify';
import copyToClipboard from '../utils/copy-to-clipboard.js';

export default {
  input: '[...input]',
  description: 'Slugify a input string.',
  action(input) {
    const stringToSlugify = input.join(' ');

    if (!stringToSlugify) {
      console.error('Missing input string.');
    }

    const outputString = slugify(stringToSlugify, {
      customReplacements: new Map([
        ["'", ''],
      ]),
      decamelize: false,
    });

    // eslint-disable-next-line no-console
    console.log(outputString);
    copyToClipboard(outputString);
  },
};
