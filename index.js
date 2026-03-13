#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import cac from 'cac';

const cli = cac('tools');

(async () => {
  const commandsDir = new URL('./commands/', import.meta.url);
  const commandFiles = readdirSync(commandsDir).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const [commandName] = file.split('.');
    const commandPathUrl = new URL(file, commandsDir);
    const { default: command } = await import(commandPathUrl.href);

    const commandDeclaration = [commandName];
    if (command.input) commandDeclaration.push(command.input);

    const cliCommand = cli.command(commandDeclaration.join(' '), command.description);

    for (const option of command.options ?? []) {
      cliCommand.option(...option);
    }
    cliCommand.action(command.action);
  }

  cli.help();
  cli.parse();
})();
