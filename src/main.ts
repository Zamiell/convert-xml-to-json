#!/usr/bin/env node

import chalk from "chalk";
import * as path from "node:path";
import sourceMapSupport from "source-map-support";
import xml2js from "xml2js";
import { fileExists, isFile, readFile, writeFile } from "./file.js";
import { parseArgs } from "./parseArgs.js";
import { fatalError } from "./utils.js";

main();

function main() {
  sourceMapSupport.install();

  const args = parseArgs();
  const verbose = args.verbose === true;

  const xmlPath = path.resolve(args.xmlPath);
  if (verbose) {
    console.log(`Using XML path: ${args.xmlPath}`);
  }

  const jsonPath = path.resolve(args.jsonPath);
  if (verbose) {
    console.log(`Using JSON path: ${args.jsonPath}`);
  }

  convertXMLToJson(xmlPath, jsonPath);
}

function convertXMLToJson(xmlPath: string, jsonPath: string) {
  if (!fileExists(xmlPath)) {
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
