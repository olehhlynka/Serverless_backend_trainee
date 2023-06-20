import { log } from "node:console";
import { readFile } from "node:fs/promises";
import axios from "axios";

const endpointsFilePath = new URL(
  "./endpoints.txt",
  import.meta.url
);
const fileContents = await readFile(endpointsFilePath, {
  encoding: "utf-8",
});
const endpoints = fileContents
  .split("\n")
  .filter((value) => value.length > 0);

const sendRequestWithRetry = async (
  url,
  maxRetries = 3
) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      retries++;
    }
  }
  throw new Error(
    `[Fail] ${url}: The endpoint is unavailable`
  );
};

const findIsDone = (obj) => {
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      const isDone = findIsDone(obj[key]);
      if (isDone === undefined) {
        continue;
      }
      return isDone;
    }
    if (key === "isDone") {
      return obj[key];
    }
  }
};

let trueCount = 0;
let falseCount = 0;
for (let endpoint of endpoints) {
  try {
    const result = await sendRequestWithRetry(endpoint);
    const isDone = findIsDone(result);
    log(`[Success] ${endpoint}: ${isDone}`);
    isDone ? trueCount++ : falseCount++;
  } catch (error) {
    log(error.message);
  }
}

log(`Found True values: ${trueCount}`);
log(`Found False values: ${falseCount}`);
