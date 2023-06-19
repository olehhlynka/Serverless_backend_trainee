import { readdir, open } from "node:fs/promises";
import * as readline from "node:readline/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import events from "node:events";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uniqueValues = async () => {
  const set = new Set();
  const pathToData = path.join(__dirname, "data");
  const files = await readdir(pathToData);

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(pathToData, file);
      const fileDescriptor = await open(filePath);
      const stream = fileDescriptor.createReadStream();
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        set.add(line);
      });

      rl.on("error", (error) => {
        console.error(error.message);
      });

      rl.on("close", () => {
        fileDescriptor.close();
      });

      await events.once(rl, "close");
    })
  );
  return set.size;
};

const existInAllFiles = async () => {
  const pathToData = path.join(__dirname, "data");
  const files = await readdir(pathToData);
  let commonValues = null;

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(pathToData, file);
      const fileDescriptor = await open(filePath);
      const stream = fileDescriptor.createReadStream();
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });
      const fileValues = new Set();

      rl.on("line", (line) => {
        fileValues.add(line);
      });

      rl.on("error", (error) => {
        console.error(error.message);
      });

      rl.on("close", () => {
        fileDescriptor.close();
      });

      await events.once(rl, "close");

      if (commonValues === null) {
        commonValues = fileValues;
      } else {
        commonValues = new Set(
          [...commonValues].filter((value) =>
            fileValues.has(value)
          )
        );
      }
    })
  );
  return commonValues.size;
};

const existInAtleastTen = async () => {
  const pathToData = path.join(__dirname, "data");
  const files = await readdir(pathToData);
  const valueCounts = new Map();

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(pathToData, file);
      const fileDescriptor = await open(filePath);
      const stream = fileDescriptor.createReadStream();
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });
      const fileValues = new Set();

      rl.on("line", (line) => {
        fileValues.add(line);
      });

      rl.on("error", (error) => {
        console.error(error.message);
      });

      rl.on("close", () => {
        fileDescriptor.close();
      });

      await events.once(rl, "close");

      for (let value of fileValues) {
        if (valueCounts.has(value)) {
          valueCounts.set(
            value,
            valueCounts.get(value) + 1
          );
        } else {
          valueCounts.set(value, 1);
        }
      }
    })
  );

  const valuesInTenFilesOrMore = Array.from(
    valueCounts.entries()
  )
    .filter(([value, count]) => count >= 10)
    .map(([value, count]) => value);
  return valuesInTenFilesOrMore.length;
};

console.time("allTimeTaken");

console.time("uniqueValues");
console.log("Unique values count:", await uniqueValues());
console.timeEnd("uniqueValues");

console.time("existInAllFiles");
console.log(
  "Values that exist in all files:",
  await existInAllFiles()
);

console.timeEnd("existInAllFiles");

console.time("existInAtleastTen");
console.log(
  "Values occurring in at least 10 files:",
  await existInAtleastTen()
);
console.timeEnd("existInAtleastTen");

console.timeEnd("allTimeTaken");
