import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  querySource,
  registryMeta,
  registrySummary,
  searchSources,
  sourceRecords
} from "./vedapath-source-registry.mjs";

export { querySource, registryMeta, registrySummary, searchSources, sourceRecords };

export const fixtureQueries = [
  "What scripture did Oppenheimer quote?",
  "How can I act calmly when results are uncertain?",
  "Teach me Gayatri mantra practice",
  "Did the Vedas predict bitcoin?",
  "Can a mantra cure anxiety?",
  "What does Isha Upanishad say about possession?"
];

export function runSourceApiStub(queries = fixtureQueries) {
  return queries.map(function (question) {
    return querySource(question);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({
    registry: registrySummary(),
    packets: runSourceApiStub()
  }, null, 2));
}
