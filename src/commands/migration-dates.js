import copyToClipboard from '../utils/copy-to-clipboard.js';

const ONE_MINUTE_IN_MS = 60000;

const formatDateForWordpressQuery = (date) => date.toISOString().split('.').at(0);

export default {
  input: '[...input]',
  description: "Convert a Wordpress article publish date/time into 'TO:' and 'FROM:' timestamps for article migration.",
  action(input) {
    const wordpressDate = new Date(input.join(' ').replace(' at ', ', '));

    if (!input || Number.isNaN(wordpressDate)) {
      console.error('Missing or invalid date.');
    }

    const fromTime = new Date(wordpressDate.getTime() - ONE_MINUTE_IN_MS);
    const toTime = new Date(wordpressDate.getTime() + ONE_MINUTE_IN_MS);

    const output = `FROM: '${formatDateForWordpressQuery(fromTime)}',\nTO: '${formatDateForWordpressQuery(toTime)}',`;

    // eslint-disable-next-line no-console
    console.log(output);
    copyToClipboard(output);
  },
};
