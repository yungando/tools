import { readdirSync } from 'node:fs';

export default {
  description: 'List all available commands.',
  async action() {
    const commandsDir = new URL('./', import.meta.url);
    const commandFiles = readdirSync(commandsDir).filter((file) => file.endsWith('.js'));

    const commandList = [];

    for (const file of commandFiles) {
      const [commandName] = file.split('.');

      commandList.push(commandName);
    }

    // eslint-disable-next-line no-console
    console.log(commandList.sort().join('\n'));
  },
};
