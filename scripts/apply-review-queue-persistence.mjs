import fs from "node:fs";
import path from "node:path";

const release = "v2.9.5";
const badge = `${release} queue`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, block, before) {
  const wrapped = `${start}\n${block.trimEnd()}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), wrapped);
  }
  const index = content.indexOf(before);
  if (index === -1) return `${content.trimEnd()}\n\n${wrapped}\n`;
  return `${content.slice(0, index)}${wrapped}\n\n${content.slice(index)}`;
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function pointReviewNavToQueue(content, isBrandPage = false) {
  const prefix = isBrandPage ? "../" : "";
  return content
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}reviewticketbridge\\.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}reviewqueuepersistence\\.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`);
}

function updateAllHtmlShells() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, pointReviewNavToQueue(updateVersionBadge(read(file))));
  }
  const brandFile = path.join("brand", "brand-board.html");
  write(brandFile, pointReviewNavToQueue(updateVersionBadge(read(brandFile)), true));
}

function activateQueueNav() {
  const file = "reviewqueuepersistence.html";
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function writeQueueData() {
  const data = {
    product: "VedaPath AI",
    release,
    status: "review queue persistence v1",
    schema_version: "review-queue-persistence-v1",
    ticket_bridge_dataset: "data/vedapath-review-ticket-bridge.json",
    evaluation_dataset: "data/vedapath-retrieval-eval-cases.json",
    retrieval_config: "data/vedapath-retrieval-foundation.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_queue_store: "vedapath-review-queue-records-v1",
    local_audit_store: "vedapath-review-queue-audit-v1",
    local_snapshot_store: "vedapath-review-queue-export-v1",
    warning: "Browser-local queue persistence only. This is not production storage, reviewer authentication, scholar approval, canonical source validation, therapy, ritual instruction, emergency support, or spiritual authority.",
    persistence_policy: "Review records may be created from generated review tickets, saved locally, exported, imported, and audited in this browser. Production must add accounts, reviewer identity, durable storage, permissions, and immutable audit history.",
    status_options: [
      "Open",
      "In review",
      "Blocked",
      "Ready after review",
      "Accepted",
      "Closed"
    ],
    owner_options: [
      "Retrieval reviewer",
      "Source reviewer",
      "Mantra reviewer",
      "Interpretation reviewer",
      "Source intake",
      "Founder review"
    ],
    queue_columns: [
      {
        "id": "open",
        "label": "Open",
        "status": "Open",
        "meaning": "Known work that has not been claimed."
      },
      {
        "id": "in-review",
        "label": "In review",
        "status": "In review",
        "meaning": "A reviewer is actively checking source, boundary, or wording."
      },
      {
        "id": "blocked",
        "label": "Blocked",
        "status": "Blocked",
        "meaning": "Cannot move until a source, rights, Sanskrit, or interpretation gap is resolved."
      },
      {
        "id": "accepted",
        "label": "Accepted",
        "status": "Accepted",
        "meaning": "Reviewed enough to inform the next source record update."
      },
      {
        "id": "closed",
        "label": "Closed",
        "status": "Closed",
        "meaning": "No active product work remains for this ticket."
      }
    ],
    audit_actions: [
      "created",
      "claimed",
      "updated",
      "blocked",
      "accepted",
      "closed",
      "imported",
      "cleared"
    ],
    export_contract: [
      "schema_version",
      "exported_at",
      "records",
      "audit"
    ]
  };
  write("data/vedapath-review-queue-persistence.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeQueueCss() {
  write("assets/vedapath-review-queue-persistence.css", `/* VedaPath review queue persistence */
.queue-app,
.queue-head,
.queue-summary,
.queue-layout,
.queue-list,
.queue-detail,
.queue-grid,
.queue-actions,
.queue-rules,
.audit-list {
  display: grid;
  gap: 10px;
}

.queue-app {
  gap: 16px;
}

.queue-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.queue-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.queue-mark img {
  display: block;
  width: 100%;
}

.queue-summary {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.queue-layout {
  grid-template-columns: minmax(250px, 0.84fr) minmax(0, 1.16fr);
  align-items: start;
}

.queue-list {
  max-height: 620px;
  overflow: auto;
  padding-right: 3px;
}

.queue-stat,
.queue-card,
.queue-grid > div,
.queue-rule,
.audit-event,
.queue-export {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.queue-stat,
.queue-card,
.queue-grid > div,
.queue-rule,
.audit-event {
  padding: 12px;
}

.queue-card {
  width: 100%;
  color: inherit;
  text-align: left;
  border-left: 4px solid var(--gold);
}

.queue-card[data-status="Open"] {
  border-left-color: var(--bhagwa);
}

.queue-card[data-status="Blocked"] {
  border-left-color: var(--ochre);
}

.queue-card[data-status="Accepted"],
.queue-card[data-status="Closed"] {
  border-left-color: var(--green);
}

.queue-card.active {
  background: #fff0e7;
  border-color: #f09f79;
}

.queue-stat span,
.queue-stat strong,
.queue-card span,
.queue-card strong,
.queue-grid span,
.queue-grid strong,
.queue-rule span,
.queue-rule strong,
.audit-event span,
.audit-event strong,
.queue-export-label {
  display: block;
}

.queue-stat span,
.queue-card span,
.queue-grid span,
.queue-rule span,
.audit-event span,
.queue-export-label {
  color: var(--muted);
  font-size: 12px;
}

.queue-stat strong {
  margin-top: 4px;
  font-size: 24px;
  line-height: 1;
}

.queue-chip {
  display: inline-flex;
  width: fit-content;
  min-height: 26px;
  align-items: center;
  border-radius: 999px;
  padding: 3px 9px;
  background: var(--soft-green);
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
}

.queue-chip.warn {
  background: var(--soft-red);
  color: var(--ochre);
}

.queue-grid,
.queue-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.queue-grid .wide,
.queue-export-wrap,
.queue-controls {
  grid-column: 1 / -1;
}

.queue-controls {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.82);
  padding: 12px;
}

.queue-controls label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.queue-control-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.queue-controls select,
.queue-controls textarea,
.queue-export {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.queue-controls textarea {
  min-height: 92px;
  margin-top: 0;
}

.queue-export {
  min-height: 220px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.queue-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.audit-list {
  max-height: 260px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .queue-head,
  .queue-summary,
  .queue-layout,
  .queue-grid,
  .queue-rules,
  .queue-control-grid {
    grid-template-columns: 1fr;
  }

  .queue-mark {
    max-width: 150px;
  }

  .queue-list,
  .audit-list {
    max-height: none;
  }
}

@media (max-width: 680px) {
  .queue-actions,
  .queue-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeQueueJs() {
  write("assets/vedapath-review-queue-persistence.js", `const queueRoot = document.getElementById("reviewQueuePersistence");

if (queueRoot) {
  initReviewQueue().catch((error) => {
    queueRoot.innerHTML = '<article class="queue-export"><strong>Review queue could not load.</strong></article>';
    console.error(error);
  });
}

function queueSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function nowStamp() {
  return new Date().toISOString();
}

function readJsonStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function writeJsonStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

function recordAuditEvent(audit, record, action, note) {
  const event = {
    id: "audit-" + record.queue_id + "-" + (audit.length + 1),
    ticket_id: record.ticket_id,
    queue_id: record.queue_id,
    action,
    status: record.status,
    owner: record.owner,
    note: note || "",
    at: nowStamp()
  };
  return [event, ...audit].slice(0, 80);
}

function defaultQueueRecord(ticket) {
  return {
    queue_id: "queue-" + ticket.ticket_id.replace(/^ticket-/, ""),
    ticket_id: ticket.ticket_id,
    lane_id: ticket.lane_id,
    lane: ticket.lane,
    title: ticket.title,
    question: ticket.question,
    source: ticket.source,
    family: ticket.family,
    severity: ticket.severity,
    owner: ticket.owner,
    status: "Open",
    risk: ticket.risk,
    expected: ticket.expected,
    actual: ticket.actual,
    next_action: ticket.next_action,
    boundary: ticket.boundary,
    reviewer_note: "",
    created_at: nowStamp(),
    updated_at: nowStamp()
  };
}

function hydrateQueue(tickets, existingRecords, existingAudit) {
  const recordsByTicket = new Map((existingRecords || []).map((record) => [record.ticket_id, record]));
  let records = [...(existingRecords || [])];
  let audit = [...(existingAudit || [])];

  for (const ticket of tickets) {
    if (recordsByTicket.has(ticket.ticket_id)) {
      const current = recordsByTicket.get(ticket.ticket_id);
      Object.assign(current, {
        lane_id: ticket.lane_id,
        lane: ticket.lane,
        title: ticket.title,
        question: ticket.question,
        source: ticket.source,
        family: ticket.family,
        severity: ticket.severity,
        risk: ticket.risk,
        expected: ticket.expected,
        actual: ticket.actual,
        next_action: ticket.next_action,
        boundary: ticket.boundary
      });
      continue;
    }
    const record = defaultQueueRecord(ticket);
    records.push(record);
    audit = recordAuditEvent(audit, record, "created", "Generated from retrieval evaluation.");
  }

  const ticketIds = new Set(tickets.map((ticket) => ticket.ticket_id));
  records = records.filter((record) => ticketIds.has(record.ticket_id));
  return { records, audit };
}

function queueSnapshot(records, audit, config) {
  const counts = Object.fromEntries((config.status_options || []).map((status) => [status, records.filter((record) => record.status === status).length]));
  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: nowStamp(),
    counts,
    records,
    audit
  };
}

function mergeImportedQueue(currentRecords, currentAudit, imported) {
  const byId = new Map(currentRecords.map((record) => [record.queue_id, record]));
  for (const record of imported.records || []) {
    if (!record.queue_id || !record.ticket_id) continue;
    byId.set(record.queue_id, { ...(byId.get(record.queue_id) || {}), ...record, imported_at: nowStamp() });
  }
  const audit = [...(imported.audit || []), ...currentAudit].slice(0, 120);
  return { records: [...byId.values()], audit };
}

async function queueLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

async function initReviewQueue() {
  const [queueConfig, bridgeConfig, evalData, retrievalConfig, sourceData] = await Promise.all([
    queueLoadJson("data/vedapath-review-queue-persistence.json"),
    queueLoadJson("data/vedapath-review-ticket-bridge.json"),
    queueLoadJson("data/vedapath-retrieval-eval-cases.json"),
    queueLoadJson("data/vedapath-retrieval-foundation.json"),
    queueLoadJson("data/vedapath-source-answer-foundation.json")
  ]);

  const bridgeApi = window.vedapathReviewBridge;
  const results = bridgeApi.evaluateBridgeCases(evalData.cases || [], sourceData.records || [], retrievalConfig);
  const tickets = bridgeApi.generateReviewTickets(results, bridgeConfig);
  const queueStore = queueConfig.local_queue_store;
  const auditStore = queueConfig.local_audit_store;
  let records = readJsonStore(queueStore, []);
  let audit = readJsonStore(auditStore, []);
  ({ records, audit } = hydrateQueue(tickets, records, audit));
  writeJsonStore(queueStore, records);
  writeJsonStore(auditStore, audit);

  let activeId = records[0] && records[0].queue_id;

  const summary = queueRoot.querySelector("#queueSummary");
  const list = queueRoot.querySelector("#queueList");
  const detail = queueRoot.querySelector("#queueDetail");
  const rules = queueRoot.querySelector("#queueRules");
  const auditList = queueRoot.querySelector("#queueAudit");
  const exportBox = queueRoot.querySelector("#queueExport");
  const statusSelect = queueRoot.querySelector("#queueStatus");
  const ownerSelect = queueRoot.querySelector("#queueOwner");
  const noteInput = queueRoot.querySelector("#queueNote");
  const saveButton = queueRoot.querySelector("#saveQueueRecord");
  const claimButton = queueRoot.querySelector("#claimQueueRecord");
  const acceptButton = queueRoot.querySelector("#acceptQueueRecord");
  const copyButton = queueRoot.querySelector("#copyQueueExport");
  const importButton = queueRoot.querySelector("#importQueueExport");
  const clearButton = queueRoot.querySelector("#clearQueueLocal");

  function activeRecord() {
    return records.find((record) => record.queue_id === activeId) || records[0];
  }

  function persist() {
    writeJsonStore(queueStore, records);
    writeJsonStore(auditStore, audit);
    writeJsonStore(queueConfig.local_snapshot_store, queueSnapshot(records, audit, queueConfig));
  }

  function renderSummary() {
    const open = records.filter((record) => record.status === "Open").length;
    const inReview = records.filter((record) => record.status === "In review").length;
    const blocked = records.filter((record) => record.status === "Blocked").length;
    const accepted = records.filter((record) => record.status === "Accepted").length;
    summary.innerHTML = [
      ["Records", records.length],
      ["Open", open],
      ["In review", inReview],
      ["Blocked", blocked],
      ["Accepted", accepted]
    ].map((row) => '<div class="queue-stat"><span>' + queueSafe(row[0]) + '</span><strong>' + queueSafe(row[1]) + '</strong></div>').join("");
  }

  function renderList() {
    list.innerHTML = records.map((record) => (
      '<button class="queue-card ' + (record.queue_id === activeId ? 'active' : '') + '" type="button" data-id="' + queueSafe(record.queue_id) + '" data-status="' + queueSafe(record.status) + '">' +
        '<span class="queue-chip ' + (record.status === "Open" || record.status === "Blocked" ? 'warn' : '') + '">' + queueSafe(record.status) + '</span>' +
        '<strong>' + queueSafe(record.title) + '</strong>' +
        '<span>' + queueSafe(record.severity + " severity | " + record.owner) + '</span>' +
        '<span>' + queueSafe(record.lane) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderControls(record) {
    statusSelect.innerHTML = (queueConfig.status_options || []).map((status) => '<option value="' + queueSafe(status) + '"' + (record.status === status ? ' selected' : '') + '>' + queueSafe(status) + '</option>').join("");
    ownerSelect.innerHTML = (queueConfig.owner_options || []).map((owner) => '<option value="' + queueSafe(owner) + '"' + (record.owner === owner ? ' selected' : '') + '>' + queueSafe(owner) + '</option>').join("");
    noteInput.value = record.reviewer_note || "";
  }

  function renderDetail() {
    const record = activeRecord();
    if (!record) return;
    detail.innerHTML = [
      ["Queue ID", record.queue_id],
      ["Status", record.status],
      ["Owner", record.owner],
      ["Severity", record.severity],
      ["Lane", record.lane],
      ["Risk", record.risk],
      ["Question", record.question, "wide"],
      ["Source", record.source, "wide"],
      ["Expected", record.expected, "wide"],
      ["Actual", record.actual, "wide"],
      ["Next action", record.next_action, "wide"],
      ["Boundary", record.boundary, "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + queueSafe(row[0]) + '</span><strong>' + queueSafe(row[1]) + '</strong></div>').join("");
    renderControls(record);
  }

  function renderAudit() {
    auditList.innerHTML = audit.slice(0, 20).map((event) => (
      '<article class="audit-event">' +
        '<span>' + queueSafe(event.at) + '</span>' +
        '<strong>' + queueSafe(event.action + " | " + event.ticket_id) + '</strong>' +
        '<span>' + queueSafe(event.status + " | " + event.owner) + '</span>' +
        '<span>' + queueSafe(event.note) + '</span>' +
      '</article>'
    )).join("");
  }

  function renderRules() {
    rules.innerHTML = [
      ["Policy", queueConfig.persistence_policy],
      ["Boundary", queueConfig.warning],
      ["Queue store", queueStore],
      ["Audit store", auditStore]
    ].map((row) => '<article class="queue-rule"><span>' + queueSafe(row[0]) + '</span><strong>' + queueSafe(row[1]) + '</strong></article>').join("");
  }

  function renderExport() {
    exportBox.value = JSON.stringify(queueSnapshot(records, audit, queueConfig), null, 2);
  }

  function render() {
    renderSummary();
    renderList();
    renderDetail();
    renderAudit();
    renderRules();
    renderExport();
  }

  function updateActive(status, owner, note, action) {
    const record = activeRecord();
    if (!record) return;
    record.status = status || record.status;
    record.owner = owner || record.owner;
    record.reviewer_note = note ?? record.reviewer_note;
    record.updated_at = nowStamp();
    audit = recordAuditEvent(audit, record, action || "updated", record.reviewer_note);
    persist();
    render();
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    activeId = button.dataset.id;
    render();
  });

  saveButton.addEventListener("click", () => {
    updateActive(statusSelect.value, ownerSelect.value, noteInput.value.trim(), "updated");
  });

  claimButton.addEventListener("click", () => {
    updateActive("In review", ownerSelect.value || "Founder review", noteInput.value.trim() || "Claimed for review.", "claimed");
  });

  acceptButton.addEventListener("click", () => {
    updateActive("Accepted", ownerSelect.value, noteInput.value.trim() || "Accepted after local review.", "accepted");
  });

  copyButton.addEventListener("click", () => {
    exportBox.focus();
    exportBox.select();
    const original = copyButton.textContent;
    const done = () => {
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(exportBox.value).then(done).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      done();
    } catch (error) {}
  });

  importButton.addEventListener("click", () => {
    try {
      const imported = JSON.parse(exportBox.value);
      ({ records, audit } = mergeImportedQueue(records, audit, imported));
      audit = recordAuditEvent(audit, records[0] || { queue_id: "queue-import", ticket_id: "import", status: "Open", owner: "Founder review" }, "imported", "Imported queue snapshot.");
      persist();
      activeId = records[0] && records[0].queue_id;
      render();
    } catch (error) {
      exportBox.value = "Import failed: " + error.message;
    }
  });

  clearButton.addEventListener("click", () => {
    const placeholder = activeRecord() || { queue_id: "queue-clear", ticket_id: "clear", status: "Closed", owner: "Founder review" };
    audit = recordAuditEvent(audit, placeholder, "cleared", "Cleared local queue and rehydrated from current tickets.");
    records = [];
    ({ records, audit } = hydrateQueue(tickets, records, audit));
    activeId = records[0] && records[0].queue_id;
    persist();
    render();
  });

  render();
}

if (typeof window !== "undefined") {
  window.vedapathReviewQueue = {
    hydrateQueue,
    queueSnapshot,
    mergeImportedQueue,
    recordAuditEvent
  };
}
`);
}

function writeQueuePage() {
  write("reviewqueuepersistence.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Reviewer Queue Persistence</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-review-queue-persistence.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Reviewer queue</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link active" href="reviewqueuepersistence.html">Review</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Reviewer Queue Persistence workspace">
        <aside class="panel">
          <span class="eyebrow">Queue memory</span>
          <h2>Review work should have history</h2>
          <p class="muted">The bridge creates tickets. This queue keeps their state, owner, notes, and audit events visible in this browser.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Hydrate</strong><p>Create records from tickets.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Persist</strong><p>Save queue state locally.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Audit</strong><p>Record each decision.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Export</strong><p>Copy a queue snapshot.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="reviewticketbridge.html">Open Ticket Bridge</a>
          </div>
        </aside>

        <section class="panel queue-app" id="reviewQueuePersistence">
          <div class="queue-head">
            <div>
              <span class="eyebrow">Reviewer queue persistence</span>
              <h1>Local review memory before production storage.</h1>
              <p class="muted">This queue makes reviewer work survive page refreshes, records an audit trail, and exports a snapshot that can later become a production queue contract.</p>
            </div>
            <div class="queue-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath queue mark"></div>
          </div>

          <div class="queue-summary" id="queueSummary" aria-live="polite"></div>

          <section class="queue-layout" aria-label="Reviewer queue">
            <div class="queue-list" id="queueList"></div>
            <div class="queue-detail">
              <div class="queue-grid" id="queueDetail"></div>
              <section class="queue-controls">
                <h2>Queue Decision</h2>
                <div class="queue-control-grid">
                  <label for="queueStatus">Status<select id="queueStatus"></select></label>
                  <label for="queueOwner">Owner<select id="queueOwner"></select></label>
                </div>
                <label class="queue-export-label" for="queueNote">Reviewer note</label>
                <textarea id="queueNote" placeholder="Add a short audit note."></textarea>
                <div class="queue-actions">
                  <button class="button primary" id="saveQueueRecord" type="button">Save Update</button>
                  <button class="button safe" id="claimQueueRecord" type="button">Claim</button>
                  <button class="button" id="acceptQueueRecord" type="button">Accept</button>
                  <button class="button" id="clearQueueLocal" type="button">Reset Local</button>
                </div>
              </section>
              <section>
                <h2>Audit Trail</h2>
                <div class="audit-list" id="queueAudit"></div>
              </section>
              <section>
                <h2>Persistence Contract</h2>
                <div class="queue-rules" id="queueRules"></div>
              </section>
              <section class="queue-export-wrap">
                <div class="queue-actions">
                  <button class="button safe" id="copyQueueExport" type="button">Copy Export</button>
                  <button class="button" id="importQueueExport" type="button">Import From Box</button>
                  <a class="button" href="data/vedapath-review-queue-persistence.json">Open JSON</a>
                </div>
                <label class="queue-export-label" for="queueExport">Queue snapshot JSON</label>
                <textarea class="queue-export" id="queueExport"></textarea>
              </section>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Persistence phase</span>
          <h2 style="margin-top: 14px;">Queue Boundary</h2>
          <p class="muted">This is still browser-local. The real product must add reviewer accounts, server storage, permissions, and immutable audit history.</p>
          <div class="progress" aria-label="Reviewer queue persistence progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Source</span><strong>Tickets</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
            <div class="metric"><span>Next</span><strong>Audit</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Production Rule</h2>
            <p class="muted">A reviewed answer should have a ticket, a decision, an owner, and a traceable history before it affects source records.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-review-ticket-bridge.js"></script>
    <script src="assets/vedapath-review-queue-persistence.js"></script>
  </body>
</html>
`);
}

function updateIndex() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("index.html")));
  if (!content.includes('href="reviewqueuepersistence.html">Review queue')) {
    content = content.replace(
      '<a href="reviewticketbridge.html">Review bridge <span>tickets</span></a>',
      '<a href="reviewticketbridge.html">Review bridge <span>tickets</span></a>\n              <a href="reviewqueuepersistence.html">Review queue <span>history</span></a>'
    );
  }
  if (!content.includes('href="reviewqueuepersistence.html">Queue')) {
    content = content.replace(
      '<a href="reviewticketbridge.html">Tickets <span>bridge</span></a>',
      '<a href="reviewticketbridge.html">Tickets <span>bridge</span></a>\n              <a href="reviewqueuepersistence.html">Queue <span>audit</span></a>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("build-status.html")));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Reviewer Queue Persistence: review records now keep local state, owner, notes, audit events, and export snapshots.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>73%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:73%"></div></div>
          <p>The trust loop now has local queue persistence and an audit-shaped export contract.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Reviewer identity and audit gate</strong>
          <p>Add reviewer roles, decision authority, and immutable-audit requirements for production.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 259: Reviewer Queue Persistence</strong>
                <p>Adds local queue records, state changes, owner notes, audit events, reset, import, and export snapshots.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 259: Reviewer Queue Persistence")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 259: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 260: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Reviewer Queue Persistence</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.4 Reviewer Ticket Bridge</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make reviewer decisions persist with history.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for reviewer identity and audit gate</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Persist review decisions beyond browser storage\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Add reviewer identity and audit history\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Connect accepted tickets to source record updates\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep review work separate from user-facing answers\.<\/span><\/li>/, `<li><span class="dot"></span><span>Add reviewer identity and role boundaries.</span></li>
              <li><span class="dot"></span><span>Define immutable production audit requirements.</span></li>
              <li><span class="dot"></span><span>Require two-step approval for accepted source updates.</span></li>
              <li><span class="dot"></span><span>Keep queue records separate from answer rendering.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE START -->", "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE END -->", `## ${release} Reviewer Queue Persistence

This release gives reviewer work a browser-local lifecycle.

- adds \`data/vedapath-review-queue-persistence.json\`
- adds \`reviewqueuepersistence.html\` as the main Review lane
- hydrates queue records from review-ticket bridge output
- persists status, owner, notes, and audit events in local storage
- adds copyable export and import-from-box queue snapshots`, "<!-- VEDAPATH REVIEW TICKET BRIDGE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE NOTES START -->", "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE NOTES END -->", `## ${release} Reviewer Queue Persistence

This phase makes review work survive beyond one page interaction.

Action taken:

- Added local queue persistence schema.
- Added queue records hydrated from review bridge tickets.
- Added local status, owner, note, claim, accept, reset, import, and export controls.
- Added audit event history for review actions.
- Set the next phase as reviewer identity and audit gate.`, "<!-- VEDAPATH REVIEW TICKET BRIDGE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE BLUEPRINT START -->", "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE BLUEPRINT END -->", `### 278. Reviewer Queue Persistence

VedaPath should treat review as a lifecycle, not a loose note.

Rules:

- Tickets become queue records with status, owner, note, and audit events.
- Browser-local storage is a prototype only.
- Export JSON becomes the first contract for production queue migration.
- Accepted tickets should not automatically rewrite answer records.
- The next build should define reviewer identity, roles, and immutable audit gates.`, "<!-- VEDAPATH REVIEW TICKET BRIDGE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/REVIEW_QUEUE_PERSISTENCE.md", `# VedaPath AI Reviewer Queue Persistence

Release: ${release}

This release adds browser-local queue persistence for reviewer work.

## Files

- \`data/vedapath-review-queue-persistence.json\`
- \`reviewqueuepersistence.html\`
- \`assets/vedapath-review-queue-persistence.css\`
- \`assets/vedapath-review-queue-persistence.js\`

## Queue Behavior

The queue:

- hydrates records from generated review tickets
- stores status, owner, and reviewer notes locally
- records audit events for created, claimed, updated, accepted, imported, and cleared actions
- exports a queue snapshot as JSON
- imports a pasted snapshot back into local queue memory

## Boundary

This is browser-local persistence only. Production needs accounts, permissions, reviewer identity, durable storage, immutable audit logs, source-update approval, and operational governance.
`);
}

writeQueueData();
writeQueueCss();
writeQueueJs();
writeQueuePage();
updateAllHtmlShells();
activateQueueNav();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} review queue persistence applied.`);
