import chalk from "chalk";
import * as fs from "node:fs";
import { fatalError } from "./utils.js";

export function fileExists(filePath: string): boolean {
  let pathExists: boolean;
  try {
    pathExists = fs.existsSync(filePath);
  } catch (error) {
    fatalError(
      `Failed to check to see if "${chalk.green(filePath)}" exists:`,
      error,
    );
  }

  return pathExists;
}

export function isFile(filePath: string): boolean {
  const fileStats = getFileStats(filePath);
  return fileStats.isFile();
}

function getFileStats(filePath: string): fs.Stats {
  let fileStats: fs.Stats;
  try {
    fileStats = fs.statSync(filePath);
  } catch (error) {
    fatalError(
      `Failed to get the file stats for "${chalk.green(filePath)}":`,
      error,
    );
  }

  return fileStats;
}

export function readFile(filePath: string): string {
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fatalError(`Failed to read the "${chalk.green(filePath)}" file:`, error);
  }

  return fileContents;
}

export function writeFile(filePath: string, data: string): void {
  try {
    fs.writeFileSync(filePath, data);
  } catch (error) {
    fatalError(
      `Failed to write to the "${chalk.green(filePath)}" file:`,
      error,
    );
  }
}
