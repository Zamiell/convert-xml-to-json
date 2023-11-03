import {
  $s,
  diff,
  echo,
  readFile,
  rm,
  testScript,
} from "isaacscript-common-node";
import { assertDefined } from "isaacscript-common-ts";
import path from "node:path";

await testScript(({ packageRoot, outDir }) => {
  assertDefined(
    outDir,
    'Failed to get the "outDir" from the "tsconfig.json" file.',
  );

  $s`npm run build`;

  const compiledFile = path.join(packageRoot, outDir, "main.js");
  const xmlFile = path.join(packageRoot, "test", "angelRooms.xml");
  const oldJSONFile = path.join(packageRoot, "test", "angelRooms.json");
  const newJSONFile = path.join(packageRoot, "test", "angelRooms.new.json");
  $s`node ${compiledFile} ${xmlFile} ${newJSONFile}`;

  const oldJSON = readFile(oldJSONFile);
  const newJSON = readFile(newJSONFile);
  rm(newJSONFile);

  if (oldJSON !== newJSON) {
    echo("New JSON does not match:");
    diff(oldJSON, newJSON);
    console.log();
  }
});
