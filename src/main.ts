#!/usr/bin/env node

import chalk from "chalk";
import sourceMapSupport from "source-map-support";
import xml2js from "xml2js";
import * as file from "./file";
import { parseArgs } from "./parseArgs";
import { error } from "./util";

main();

function main() {
  sourceMapSupport.install();

  // Get command line arguments.
  const args = parseArgs();

  convertXMLToJson(args.xmlPath, args.jsonPath);
}

function convertXMLToJson(xmlPath: string, jsonPath: string) {
  if (!file.exists(xmlPath)) {
    error(`The file "${xmlPath}" does not exist.`);
  }

  if (!file.isFile(xmlPath)) {
    error(`"${xmlPath}" is not a file.`);
  }

  const xml = file.read(xmlPath);
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
  file.write(jsonPath, json);

  console.log(`Wrote to JSON file: ${chalk.green(jsonPath)}`);
}
