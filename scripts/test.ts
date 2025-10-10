import { $, diff, echo, readFile, rm, testScript } from "complete-node";
import path from "node:path";

await testScript(import.meta.dirname, async (packageRoot) => {
  await $`npm run build`;

  const compiledFile = path.join(packageRoot, "dist", "main.js");
  const xmlFile = path.join(packageRoot, "test", "angelRooms.xml");
  const oldJSONFile = path.join(packageRoot, "test", "angelRooms.json");
  const newJSONFile = path.join(packageRoot, "test", "angelRooms.new.json");
  await $`node ${compiledFile} ${xmlFile} ${newJSONFile}`;

  const oldJSON = await readFile(oldJSONFile);
  const newJSON = await readFile(newJSONFile);
  await rm(newJSONFile);

  if (oldJSON !== newJSON) {
    echo("New JSON does not match:");
    diff(oldJSON, newJSON);
    console.log();
  }
});
