#!/usr/bin/env node

import chalk from "chalk";
import { fatalError, isFile, readFile, writeFile } from "complete-node";
import path from "node:path";
import xml2js from "xml2js";
import { program } from "./parseArgs.js";

await main();

async function main() {
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

  await convertXMLToJSON(xmlPath, jsonPath);
}

async function convertXMLToJSON(xmlPath: string, jsonPath: string) {
  const xmlExists = await isFile(xmlPath);
  if (!xmlExists) {
    fatalError(`The file "${xmlPath}" does not exist.`);
  }

  const xml = await readFile(xmlPath);
  xml2js
    .parseStringPromise(xml)
    .then(async (result: unknown) => {
      await conversionComplete(result, jsonPath);
    })
    .catch((error: unknown) => {
      fatalError(
        `Failed to convert the "${xmlPath}" file to a JavaScript object: ${error}`,
      );
    });
}

async function conversionComplete(result: unknown, jsonPath: string) {
  const json = JSON.stringify(result);
  await writeFile(jsonPath, json);

  console.log(`Wrote to JSON file: ${chalk.green(jsonPath)}`);
}
