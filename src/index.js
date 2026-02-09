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
    if (command.description) commandDeclaration.push(command.input);

    cli.command(commandDeclaration.join(' '), command.description).action(command.action);
  }

  cli.help();
  cli.parse();
})();
