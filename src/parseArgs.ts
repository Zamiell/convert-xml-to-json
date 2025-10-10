import { Command } from "@commander-js/extra-typings";
import packageJSON from "../package.json" with { type: "json" };

const { name, description, version } = packageJSON;

export const program = new Command()
  .name(name)
  .description(`${description}.`)
  .version(version, "-V, --version", "Output the version number.")
  .helpOption("-h, --help", "Display the list of commands and options.")
  .helpCommand(false)
  .allowExcessArguments(false) // By default, Commander.js will allow extra positional arguments.
  .option("-v, --verbose", "Enable verbose output.", false)
  .arguments("<xmlPath> <jsonPath>");
