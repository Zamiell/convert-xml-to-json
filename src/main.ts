#!/usr/bin/env node

import chalk from "chalk";
import * as path from "node:path";
import sourceMapSupport from "source-map-support";
import xml2js from "xml2js";
import { fileExists, isFile, readFile, writeFile } from "./file";
import { parseArgs } from "./parseArgs";
import { error } from "./utils";

main();

function main() {
  sourceMapSupport.install();

  // Get command line arguments.
  const args = parseArgs();

  args.xmlPath = path.resolve(args.xmlPath);
  args.jsonPath = path.resolve(args.xmlPath);

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
