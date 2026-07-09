import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const registryFile = path.join(moduleDir, "..", "data", "vedapath-source-registry.json");
const registry = JSON.parse(readFileSync(registryFile, "utf8"));

export const registryMeta = Object.freeze({
  schema: registry.schema,
  release: registry.release,
  rights_posture: registry.rights_posture
});

export const sourceRecords = Object.freeze(registry.records.map(function (record) {
  return Object.freeze({ ...record });
}));

const noSourceRecord = sourceRecords.find(function (record) {
  return record.status === "no-source";
});

function clean(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value) {
  return clean(value).split(/\s+/).filter(function (token) {
    return token.length > 1;
  });
}

function traceId(question) {
  const slug = clean(question).replace(/\s+/g, "-").slice(0, 36) || "query";
  return "vp-registry-" + slug;
}

function familyMatches(record, family) {
  if (!family) return true;
  return clean(record.family).includes(clean(family));
}

function statusMatches(record, status) {
  if (!status) return true;
  return clean(record.status) === clean(status);
}

function scoreRecord(record, question) {
  const query = clean(question);
  if (!query) return { score: 0, reasons: [] };
  const queryTokens = new Set(tokens(query));
  const reasons = [];
  let score = 0;

  for (const keyword of record.keywords || []) {
    const normalized = clean(keyword);
    if (!normalized) continue;
    if (query.includes(normalized)) {
      score += normalized.includes(" ") ? 12 : 7;
      reasons.push("keyword: " + keyword);
      continue;
    }
    const keywordTokens = tokens(normalized);
    const overlap = keywordTokens.filter(function (token) {
      return queryTokens.has(token);
    }).length;
    if (overlap) {
      score += overlap * 3;
      reasons.push("term: " + keyword);
    }
  }

  const fields = [
    ["title", record.title, 4],
    ["citation", record.citation, 5],
    ["family", record.family, 3],
    ["summary", record.summary, 1]
  ];
  for (const field of fields) {
    const fieldTokens = new Set(tokens(field[1]));
    const overlap = Array.from(queryTokens).filter(function (token) {
      return fieldTokens.has(token);
    }).length;
    if (overlap) {
      score += overlap * field[2];
      reasons.push(field[0] + " overlap");
    }
  }

  if (record.status === "approved") score += 2;
  if (record.status === "hold") score -= 1;
  return { score, reasons: Array.from(new Set(reasons)).slice(0, 4) };
}

export function listSources(options = {}) {
  const includeNoSource = Boolean(options.includeNoSource);
  return sourceRecords.filter(function (record) {
    if (!includeNoSource && record.status === "no-source") return false;
    return familyMatches(record, options.family) && statusMatches(record, options.status);
  });
}

export function searchSources(question, options = {}) {
  const limit = Math.max(1, Math.min(Number(options.limit) || 5, 10));
  return listSources({
    family: options.family,
    status: options.status,
    includeNoSource: false
  }).map(function (record) {
    const scored = scoreRecord(record, question);
    return {
      ...record,
      score: scored.score,
      match_reasons: scored.reasons
    };
  }).filter(function (record) {
    return record.score > 0;
  }).sort(function (a, b) {
    return b.score - a.score || b.confidence - a.confidence || a.citation.localeCompare(b.citation);
  }).slice(0, limit);
}

export function sourcePacket(question, record, extra = {}) {
  const isNoSource = !record || record.status === "no-source";
  const selected = record || noSourceRecord;
  return {
    contract: "vedapath.source.v1",
    trace_id: traceId(question),
    query: String(question || ""),
    source_found: !isNoSource,
    primary_source_id: isNoSource ? null : selected.id,
    citation: selected.citation,
    family: selected.family,
    confidence: Number(selected.confidence || 0),
    reviewer_state: selected.status,
    rights_state: selected.rights_state || "needs-review",
    answer_boundary: selected.boundary,
    summary: selected.summary,
    no_source_reason: isNoSource ? (extra.no_source_reason || "No reviewed source in the current registry supports this question.") : null,
    next_action: isNoSource ? "return no-source answer" : selected.status === "approved" ? "compose bounded draft" : "route to reviewer",
    registry_release: registryMeta.release,
    ...extra
  };
}

export function querySource(question = "", options = {}) {
  const query = clean(question);
  if (!query) {
    return sourcePacket(question, noSourceRecord, {
      match_reason: "question required",
      no_source_reason: "Enter a question before source matching begins."
    });
  }

  if (/\b(bitcoin|airplanes?|medical|cure|diagnos\w*|therapy|treatment|predict\w*)\b/.test(query)) {
    return sourcePacket(question, noSourceRecord, {
      match_reason: "unsupported modern or medical overclaim",
      no_source_reason: "No reviewed source in the current registry supports this modern or medical claim."
    });
  }

  const candidates = searchSources(question, options);
  if (!candidates.length) {
    return sourcePacket(question, noSourceRecord, {
      match_reason: "no reviewed registry match"
    });
  }

  const selected = candidates[0];
  return sourcePacket(question, selected, {
    match_reason: selected.match_reasons.join("; ") || "highest reviewed registry score",
    candidate_count: candidates.length
  });
}

export function registrySummary() {
  const records = listSources({ includeNoSource: true });
  const families = Array.from(new Set(records.filter(function (record) {
    return record.status !== "no-source";
  }).map(function (record) {
    return record.family;
  }))).sort();
  return {
    ...registryMeta,
    records: records.length,
    source_records: records.filter(function (record) { return record.status !== "no-source"; }).length,
    approved: records.filter(function (record) { return record.status === "approved"; }).length,
    review: records.filter(function (record) { return record.status === "review"; }).length,
    hold: records.filter(function (record) { return record.status === "hold"; }).length,
    no_source_guards: records.filter(function (record) { return record.status === "no-source"; }).length,
    families
  };
}
