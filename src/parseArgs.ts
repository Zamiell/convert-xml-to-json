import yargs from "yargs";
import { APP_NAME } from "./constants.js";

interface Args {
  _: string[];

  xmlPath: string;
  jsonPath: string;
}

export function parseArgs(): Args {
  const yargsObject = yargs(process.argv.slice(2))
    .usage(`usage: ${APP_NAME} <path-to-xml-file> <path-to-json-file>`)
    .command("$0 <xmlPath> <jsonPath>", "Convert an XML file to a JSON file")
    .scriptName(`${APP_NAME}`)
    .alias("h", "help") // By default, only "--help" is enabled
    .alias("v", "version") // By default, only "--version" is enabled
    .parseSync();

  return yargsObject as unknown as Args;
}
