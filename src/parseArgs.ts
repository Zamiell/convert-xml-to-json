import { Command } from "@commander-js/extra-typings";
import {
  findPackageRoot,
  getPackageJSONFieldsMandatory,
} from "isaacscript-common-node";

const packageRoot = findPackageRoot();
const { name, version, description } = getPackageJSONFieldsMandatory(
  packageRoot,
  "name",
  "version",
  "description",
);

export const program = new Command()
  .name(name)
  .description(`${description}.`)
  .version(version, "-V, --version", "Output the version number.")
  .helpOption("-h, --help", "Display the list of commands and options.")
  .addHelpCommand(false)
  .allowExcessArguments(false) // By default, Commander.js will allow extra positional arguments.
  .option("-v, --verbose", "Enable verbose output.", false)
  .arguments("<xmlPath> <jsonPath>");
