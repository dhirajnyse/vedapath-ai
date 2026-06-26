const queueRoot = document.getElementById("reviewQueuePersistence");

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
