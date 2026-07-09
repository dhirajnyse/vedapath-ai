import { fileURLToPath } from "node:url";
import path from "node:path";

export const sourceRecords = [
  {
    "id": "bg-2-48-steadiness",
    "status": "approved",
    "title": "Steady action",
    "citation": "Bhagavad Gita 2.48",
    "family": "Bhagavad Gita | Smriti",
    "summary": "Supports practical answers about steady action while avoiding promises of guaranteed calm.",
    "confidence": "High | 86/100",
    "boundary": "Reflection support only; not therapy, ritual instruction, or spiritual command.",
    "missingFields": [
      "licensed translation display",
      "final reviewer signature"
    ]
  },
  {
    "id": "bg-11-32-category",
    "status": "approved",
    "title": "Oppenheimer category correction",
    "citation": "Bhagavad Gita 11.32",
    "family": "Bhagavad Gita | Smriti",
    "summary": "Corrects the common claim: the famous line is associated with the Gita, not the four Vedas.",
    "confidence": "High | 91/100",
    "boundary": "Do not call it a direct quote from the four Vedas.",
    "missingFields": [
      "translation variant note"
    ]
  },
  {
    "id": "rv-3-62-10-gayatri",
    "status": "hold",
    "title": "Gayatri mantra care",
    "citation": "Rigveda 3.62.10",
    "family": "Veda | Shruti",
    "summary": "Useful for source context, but learner-facing practice needs reviewer and rights review.",
    "confidence": "Medium | 68/100",
    "boundary": "No ritual instruction, initiation advice, or recitation authority.",
    "missingFields": [
      "mantra reviewer",
      "recitation boundary",
      "rights approval"
    ]
  },
  {
    "id": "isha-1-stewardship",
    "status": "review",
    "title": "Stewardship and restraint",
    "citation": "Isha Upanishad 1",
    "family": "Upanishad | Shruti",
    "summary": "Can support careful answers about possession and restraint if commentary and rights notes are visible.",
    "confidence": "Medium | 72/100",
    "boundary": "Do not flatten the verse into wealth advice or productivity advice.",
    "missingFields": [
      "commentary lens",
      "translation rights"
    ]
  },
  {
    "id": "no-source-overclaim",
    "status": "no-source",
    "title": "Unsupported modern overclaim",
    "citation": "No direct source",
    "family": "No-source behavior",
    "summary": "Used to refuse inflated claims when no reviewed source can carry the answer.",
    "confidence": "High | 95/100",
    "boundary": "Say no reliable reviewed source is present; do not invent validation.",
    "missingFields": [
      "none"
    ]
  }
];

export const fixtureQueries = [
  "What scripture did Oppenheimer quote?",
  "How can I act calmly when results are uncertain?",
  "Teach me Gayatri mantra practice",
  "Did the Vedas predict bitcoin?",
  "Can a mantra cure anxiety?",
  "What does Isha Upanishad say about possession?"
];

function traceId(question) {
  const slug = question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "query";
  return "vp-local-" + slug;
}

function packet(question, record, extra = {}) {
  return {
    trace_id: traceId(question),
    query: question,
    source_found: record.status !== "no-source",
    primary_source_id: record.status === "no-source" ? null : record.id,
    citation: record.citation,
    family: record.family,
    confidence: Number((record.confidence.match(/(\d+)/) || ["0", "0"])[1]),
    reviewer_state: record.status,
    rights_state: record.status === "approved" ? "citation-only" : "needs-review",
    answer_boundary: record.boundary,
    summary: record.summary,
    no_source_reason: record.status === "no-source" ? "No reviewed source in the current fixture set supports this claim." : null,
    next_action: record.status === "approved" ? "compose bounded draft" : record.status === "no-source" ? "return no-source answer" : "route to reviewer",
    ...extra
  };
}

export function querySource(question = "") {
  const q = String(question).toLowerCase();
  if (/bitcoin|airplane|airplanes|medical|cure|diagnos|therapy|treatment|predict/.test(q)) {
    return packet(question, sourceRecords[4], { match_reason: "unsupported modern or medical overclaim" });
  }
  if (/oppenheimer|destroyer|death|time|gita/.test(q)) {
    return packet(question, sourceRecords[1], { match_reason: "category correction and Gita citation keywords" });
  }
  if (/result|results|steady|steadiness|calm|action|uncertain|outcome/.test(q)) {
    return packet(question, sourceRecords[0], { match_reason: "steady action and outcome attachment keywords" });
  }
  if (/gayatri|savitr|mantra|chant|recitation/.test(q)) {
    return packet(question, sourceRecords[2], { match_reason: "Gayatri source candidate, reviewer hold required" });
  }
  if (/isha|possession|stewardship|restraint/.test(q)) {
    return packet(question, sourceRecords[3], { match_reason: "Isha Upanishad review candidate" });
  }
  return packet(question, sourceRecords[4], { match_reason: "no reviewed source matched current fixtures" });
}

export function runSourceApiStub(queries = fixtureQueries) {
  return queries.map((question) => querySource(question));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(runSourceApiStub(), null, 2));
}
