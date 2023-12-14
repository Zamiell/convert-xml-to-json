#!/usr/bin/env node

import chalk from "chalk";
import {
  fatalError,
  isFile,
  isMain,
  readFile,
  writeFile,
} from "isaacscript-common-node";
import * as path from "node:path";
import xml2js from "xml2js";
import { program } from "./parseArgs.js";

if (isMain()) {
  main();
}

function main() {
  const parsedCommand = program.parse();
  const options = parsedCommand.opts();
  const { verbose } = options;

  const [xmlPathRaw, jsonPathRaw] = parsedCommand.args;
  if (xmlPathRaw === undefined || jsonPathRaw === undefined) {
    fatalError(
      "Error: You must provide the path to the XML input file as the first argument and the path to the JSON output file as the second argument.",
    );
  }

  const xmlPath = path.resolve(xmlPathRaw);
  if (verbose) {
    console.log(`Using XML path: ${xmlPath}`);
  }

  const jsonPath = path.resolve(jsonPathRaw);
  if (verbose) {
    console.log(`Using JSON path: ${jsonPath}`);
  }

  convertXMLToJson(xmlPath, jsonPath);
}

function convertXMLToJson(xmlPath: string, jsonPath: string) {
  if (!isFile(xmlPath)) {
    fatalError(`The file "${xmlPath}" does not exist.`);
  }

  if (!isFile(xmlPath)) {
    fatalError(`"${xmlPath}" is not a file.`);
  }

  const xml = readFile(xmlPath);
  xml2js
    .parseStringPromise(xml)
    .then((result: unknown) => {
      conversionComplete(result, jsonPath);
    })
    .catch((error) => {
      fatalError(
        `Failed to convert the "${xmlPath}" file to a JavaScript object: ${error}`,
      );
    });
}

function conversionComplete(result: unknown, jsonPath: string) {
  const json = JSON.stringify(result);
  writeFile(jsonPath, json);

  console.log(`Wrote to JSON file: ${chalk.green(jsonPath)}`);
}
