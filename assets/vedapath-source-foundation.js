const foundationRoot = document.getElementById("sourceFoundation");

if (foundationRoot) {
  initSourceFoundation().catch((error) => {
    foundationRoot.innerHTML = '<p class="muted">Source answer records could not load.</p>';
    console.error(error);
  });
}

async function foundationLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function foundationText(value) {
  return value === 0 ? "0" : String(value || "");
}

function foundationSafe(value) {
  return foundationText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function foundationPacketText(record) {
  return [
    "VedaPath Source Answer Packet",
    "Record: " + record.id,
    "Question: " + record.question,
    "Answer title: " + record.title,
    "Source: " + record.source,
    "Source family: " + record.source_family,
    "Pramana: " + record.pramana,
    "Confidence: " + record.confidence,
    "Readiness: " + record.readiness,
    "Review state: " + record.review_state,
    "Rights state: " + record.rights_state,
    "Caution: " + record.caution,
    "Boundary: " + record.boundary,
    "Blocked claims: " + record.blocked_claims.join(" | "),
    "",
    "Summary:",
    record.summary,
    "",
    "Boundary: starter answer-record data; not canonical corpus coverage, scholar endorsement, licensed translation display, therapy, ritual instruction, emergency support, or spiritual authority."
  ].join("\n");
}

async function initSourceFoundation() {
  const data = await foundationLoadJson("data/vedapath-source-answer-foundation.json");
  const records = data.records || [];
  const familyFilter = foundationRoot.querySelector("#foundationFamily");
  const readinessFilter = foundationRoot.querySelector("#foundationReadiness");
  const search = foundationRoot.querySelector("#foundationSearch");
  const stats = foundationRoot.querySelector("#foundationStats");
  const list = foundationRoot.querySelector("#foundationList");
  const detail = foundationRoot.querySelector("#foundationDetail");
  const packets = foundationRoot.querySelector("#foundationPackets");
  const packetText = foundationRoot.querySelector("#foundationPacket");
  const families = ["all", ...Array.from(new Set(records.map((record) => record.source_family)))];
  const readinesses = ["all", ...Array.from(new Set(records.map((record) => record.readiness)))];
  const state = { family: "all", readiness: "all", search: "", recordId: records[0] && records[0].id };

  familyFilter.innerHTML = families.map((item) => '<option value="' + foundationSafe(item) + '">' + foundationSafe(item) + '</option>').join("");
  readinessFilter.innerHTML = readinesses.map((item) => '<option value="' + foundationSafe(item) + '">' + foundationSafe(item) + '</option>').join("");

  function filteredRecords() {
    const term = state.search.trim().toLowerCase();
    return records.filter((record) => {
      const searchText = [
        record.question,
        record.title,
        record.summary,
        record.source,
        record.source_family,
        record.retrieval_terms.join(" "),
        record.aliases.join(" ")
      ].join(" ").toLowerCase();
      return (state.family === "all" || record.source_family === state.family)
        && (state.readiness === "all" || record.readiness === state.readiness)
        && (!term || searchText.includes(term));
    });
  }

  function selectedRecord() {
    const filtered = filteredRecords();
    return filtered.find((record) => record.id === state.recordId) || filtered[0] || records[0];
  }

  function renderStats(filtered) {
    const ready = records.filter((record) => record.readiness === "answer-preview-ready").length;
    const reviewed = records.filter((record) => record.review_state.includes("review")).length;
    stats.innerHTML = [
      ["Records", records.length],
      ["Visible", filtered.length],
      ["Preview-ready", ready],
      ["Review-linked", reviewed]
    ].map((row) => '<div class="foundation-stat"><span>' + foundationSafe(row[0]) + '</span><strong>' + foundationSafe(row[1]) + '</strong></div>').join("");
  }

  function renderList(record, filtered) {
    list.innerHTML = filtered.map((item) => (
      '<button class="foundation-record' + (item.id === record.id ? ' active' : '') + '" type="button" data-record-id="' + foundationSafe(item.id) + '">' +
        '<strong>' + foundationSafe(item.question) + '</strong>' +
        '<span>' + foundationSafe(item.source) + '</span>' +
        '<span>' + foundationSafe(item.source_family + " | " + item.readiness) + '</span>' +
      '</button>'
    )).join("") || '<article class="foundation-empty"><strong>No matching records</strong><p class="muted">Clear filters to see the first source-answer set.</p></article>';
  }

  function renderDetail(record) {
    detail.innerHTML = [
      ["Question", record.question, "wide"],
      ["Answer", record.title, "wide"],
      ["Source", record.source],
      ["Family", record.source_family],
      ["Pramana", record.pramana],
      ["Confidence", record.confidence],
      ["Readiness", record.readiness],
      ["Review", record.review_state],
      ["Rights", record.rights_state],
      ["Caution", record.caution],
      ["Summary", record.summary, "wide"],
      ["Boundary", record.boundary, "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + foundationSafe(row[0]) + '</span><strong>' + foundationSafe(row[1]) + '</strong></div>').join("");
  }

  function renderPackets(record) {
    const firstSource = record.tabs.source && record.tabs.source[0];
    const firstClaim = record.tabs.claim && record.tabs.claim[record.tabs.claim.length - 1];
    packets.innerHTML = [
      ["Source card", firstSource ? firstSource[1] : record.source_note],
      ["Boundary card", firstClaim ? firstClaim[1] : record.boundary],
      ["Blocked claims", record.blocked_claims.join(" | "), "wide"],
      ["Retrieval terms", record.retrieval_terms.join(" | "), "wide"]
    ].map((row) => '<article class="foundation-packet ' + (row[2] || "") + '"><span>' + foundationSafe(row[0]) + '</span><strong>' + foundationSafe(row[1]) + '</strong></article>').join("");
    packetText.value = foundationPacketText(record);
  }

  function render() {
    const filtered = filteredRecords();
    const record = selectedRecord();
    if (!record) return;
    state.recordId = record.id;
    familyFilter.value = state.family;
    readinessFilter.value = state.readiness;
    search.value = state.search;
    renderStats(filtered);
    renderList(record, filtered);
    renderDetail(record);
    renderPackets(record);
  }

  familyFilter.addEventListener("change", () => {
    state.family = familyFilter.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  readinessFilter.addEventListener("change", () => {
    state.readiness = readinessFilter.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  search.addEventListener("input", () => {
    state.search = search.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-record-id]");
    if (!button) return;
    state.recordId = button.dataset.recordId;
    render();
  });

  foundationRoot.querySelector("#copyFoundationPacket").addEventListener("click", () => {
    packetText.focus();
    packetText.select();
    const button = foundationRoot.querySelector("#copyFoundationPacket");
    const original = button.textContent;
    const copied = () => {
      button.textContent = "Copied Packet";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(packetText.value).then(copied).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      copied();
    } catch (error) {}
  });

  render();
}
