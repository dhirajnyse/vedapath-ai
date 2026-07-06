import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const pages = [
  "index.html",
  "build-status.html",
  "answerpacketpilot.html",
  "launchreadinesshub.html",
  "controlledpermissionexecutionauthorizationdraftreviewgate.html",
  "controlledpermissionexecutionauthorizationreviewdecisiongate.html",
  "founderpermissionexecutionauthorizationdecisiongate.html",
  "productionretrievalpilotgate.html",
  "verifiedsourcerecordschema.html",
  "retrievalreviewerdesk.html",
  "first25sourceqapack.html",
  "learneraskflow.html"
];

const missing = [];
const attrPattern = /(?:href|src)="([^"]+)"/g;

for (const page of pages) {
  const text = readFileSync(page, "utf8");
  for (const match of text.matchAll(attrPattern)) {
    const ref = match[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;

    const file = ref.split("#")[0].split("?")[0];
    if (!file) continue;

    const target = path.resolve(path.dirname(page), file);
    if (!existsSync(target)) {
      missing.push(`${page} -> ${ref}`);
    }
  }
}

if (missing.length) {
  console.error(missing.join("\n"));
  process.exit(1);
}

console.log(`static-links-ok ${pages.length}`);
