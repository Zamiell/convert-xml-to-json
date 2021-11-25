import yargs from "yargs";

export function parseArgs() {
  const yargsObject = yargs(process.argv.slice(2))
    .usage("usage: xml-to-json <path-to-xml-file> <path-to-json-file>")
    .command(
      "$0 <pathToXMLFile> <pathToJSONFile>",
      "Convert an XML file to a JSON file",
    )
    .scriptName("xml-to-json")
    .alias("h", "help") // By default, only "--help" is enabled
    .alias("v", "version"); // By default, only "--version" is enabled

  const { argv } = yargsObject;
  if (argv instanceof Promise) {
    throw new Error("yargs returned a promise.");
  }

  return argv;
}
