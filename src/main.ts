#!/usr/bin/env node

import chalk from "chalk";
import * as path from "node:path";
import sourceMapSupport from "source-map-support";
import xml2js from "xml2js";
import { fileExists, isFile, readFile, writeFile } from "./file.js";
import { parseArgs } from "./parseArgs.js";
import { error } from "./utils.js";

main();

function main() {
  sourceMapSupport.install();

  const args = parseArgs();
  const verbose = args.verbose === true;

  args.xmlPath = path.resolve(args.xmlPath);
  if (verbose) {
    console.log(`Using XML path: ${args.xmlPath}`);
  }

  args.jsonPath = path.resolve(args.jsonPath);
  if (verbose) {
    console.log(`Using JSON path: ${args.jsonPath}`);
  }

  convertXMLToJson(args.xmlPath, args.jsonPath);
}

function convertXMLToJson(xmlPath: string, jsonPath: string) {
  if (!fileExists(xmlPath)) {
    error(`The file "${xmlPath}" does not exist.`);
  }

  if (!isFile(xmlPath)) {
    error(`"${xmlPath}" is not a file.`);
  }

  const xml = readFile(xmlPath);
  xml2js
    .parseStringPromise(xml)
    .then((result: unknown) => {
      conversionComplete(result, jsonPath);
    })
    .catch((err) => {
      error(
        `Failed to convert the "${xmlPath}" file to a JavaScript object: ${err}`,
      );
    });
}

function conversionComplete(result: unknown, jsonPath: string) {
  const json = JSON.stringify(result);
  writeFile(jsonPath, json);

  console.log(`Wrote to JSON file: ${chalk.green(jsonPath)}`);
}
