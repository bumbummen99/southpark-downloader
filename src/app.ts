import { Command as Commander } from 'commander';
import Command from './commands/abstracts/command';
import { resolve } from 'path';
import { readdirRecursive, scriptDir } from './util.js';
import { injectable } from 'inversify';

@injectable()
export default class App {
  private commander: Commander;

  constructor() {
    this.commander = new Commander();
  }

  async loadCommands(): Promise<void> {
    /* Gather all command files */
    const files = (await readdirRecursive(resolve(scriptDir(import.meta.url), 'commands')))
      .filter(path => path.endsWith('.ts'))
      .filter(path => !path.includes('abstracts'))
      .filter(path => !path.includes('interfaces'))

    console.debug(`Loaded ${files.length} command file paths`);
    
    /* Try to load all files as commands */
    for (const file of files) {
      console.debug(`Importing file ${file}...`);

      /* Dynamically import the TypeScript file */
      const {default: commandConstructor}: {default: new () => Command} = await import(file);

      /* Instantiate command to read it's properties */
      console.debug(`Import successfull! Instancing command...`);
      const command = new commandConstructor();

      /* Create builder fluent and apply the Command's name and description */
      console.debug('Configuring command information...');
      const builder = this.commander.command(command.name)
        .description(command.description);
      
      /* Apply all Command arguments to the builder */
      console.debug('Configuring command arguments...');
      for (const [name, {description, defaultValue}] of Object.entries(command.args)) {
        builder.argument(name, description, defaultValue);
      }

      /* Apply all Command options to the builder */
      console.debug('Configuring command options...');
      for (const [flags, {description, defaultValue}] of Object.entries(command.options)) {
        builder.option(flags, description, defaultValue)
      }
    }
  }

  parse(): Commander {
    return this.commander.parse();
  }
}
