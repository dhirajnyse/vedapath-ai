const sourceLibraryRoot = document.getElementById("sourceLibrary");

if (sourceLibraryRoot) {
  initSourceLibrary().catch((error) => {
    sourceLibraryRoot.innerHTML = '<p class="muted">Source library could not load curated source data.</p>';
    console.error(error);
  });
}

async function sourceLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function sourceText(value) {
  return value === 0 ? "0" : String(value || "");
}

function sourceSafe(value) {
  return sourceText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function sourceStorageKey() {
  return "vedapath-source-library-pins";
}

function readSourcePins() {
  try {
    return JSON.parse(localStorage.getItem(sourceStorageKey()) || "[]");
  } catch (error) {
    return [];
  }
}

function writeSourcePins(pins) {
  localStorage.setItem(sourceStorageKey(), JSON.stringify(pins.slice(0, 20)));
}

function sourcePacketText(record, pins) {
  return [
    "VedaPath Source Library Packet",
    "Record: " + record.title,
    "Source: " + record.source,
    "Source family: " + record.source_family,
    "Tradition layer: " + record.tradition_layer,
    "Theme: " + record.theme,
    "Readiness: " + record.readiness + " (" + record.score + "/100)",
    "Review state: " + record.review_state,
    "Rights state: " + record.rights_state,
    "Translation policy: " + record.translation_policy,
    "Source note: " + record.source_note,
    "Answer boundary: " + record.answer_boundary,
    "Question examples: " + record.question_examples.join(" | "),
    "Pinned local sources: " + pins.length,
    "",
    "Boundary: starter source-library prototype; not canonical corpus coverage, scholar endorsement, legal clearance, therapy, ritual instruction, emergency support, or spiritual authority."
  ].join("\n");
}

function renderSourceStats(root, records, filtered, pins) {
  const ready = records.filter((record) => record.readiness === "preview-ready").length;
  root.querySelector("#sourceStats").innerHTML = [
    ["Sources", records.length],
    ["Visible", filtered.length],
    ["Preview-ready", ready],
    ["Pinned", pins.length]
  ].map((row) => '<div class="source-stat"><span>' + sourceSafe(row[0]) + '</span><strong>' + sourceSafe(row[1]) + '</strong></div>').join("");
}

async function initSourceLibrary() {
  const libraryData = await sourceLoadJson("data/vedapath-source-library.json");
  const records = libraryData.records || [];
  const familyFilter = sourceLibraryRoot.querySelector("#familyFilter");
  const readinessFilter = sourceLibraryRoot.querySelector("#readinessFilter");
  const search = sourceLibraryRoot.querySelector("#sourceSearch");
  const listNode = sourceLibraryRoot.querySelector("#sourceList");
  const detailNode = sourceLibraryRoot.querySelector("#sourceDetail");
  const packet = sourceLibraryRoot.querySelector("#sourcePacket");
  const pinsNode = sourceLibraryRoot.querySelector("#pinnedSources");
  const families = ["all", ...Array.from(new Set(records.map((record) => record.source_family)))];
  const readinesses = ["all", ...Array.from(new Set(records.map((record) => record.readiness)))];
  const state = {
    family: sourceLibraryRoot.dataset.family || "all",
    readiness: sourceLibraryRoot.dataset.readiness || "all",
    search: "",
    recordId: records[0] && records[0].id
  };

  familyFilter.innerHTML = families.map((family) => '<option value="' + sourceSafe(family) + '">' + sourceSafe(family) + '</option>').join("");
  readinessFilter.innerHTML = readinesses.map((readiness) => '<option value="' + sourceSafe(readiness) + '">' + sourceSafe(readiness) + '</option>').join("");

  function filteredRecords() {
    const term = state.search.trim().toLowerCase();
    return records.filter((record) => {
      const familyMatch = state.family === "all" || record.source_family === state.family;
      const readinessMatch = state.readiness === "all" || record.readiness === state.readiness;
      const searchText = [record.title, record.source, record.source_family, record.theme, record.tags.join(" ")].join(" ").toLowerCase();
      const searchMatch = !term || searchText.includes(term);
      return familyMatch && readinessMatch && searchMatch;
    });
  }

  function selectedRecord() {
    const filtered = filteredRecords();
    return filtered.find((record) => record.id === state.recordId) || filtered[0] || records[0];
  }

  function ensureSelected() {
    const record = selectedRecord();
    state.recordId = record && record.id;
    return record;
  }

  function renderList(record) {
    const filtered = filteredRecords();
    listNode.innerHTML = filtered.map((row) => (
      '<button class="source-record' + (row.id === record.id ? ' active' : '') + '" type="button" data-source-id="' + sourceSafe(row.id) + '">' +
        '<strong>' + sourceSafe(row.title) + '</strong>' +
        '<span>' + sourceSafe(row.source) + '</span>' +
        '<span>' + sourceSafe(row.source_family + " | " + row.readiness) + '</span>' +
        '<div class="score-line"><span>' + sourceSafe(row.score) + '</span><div class="score-track"><div class="score-fill" style="--score:' + sourceSafe(row.score) + '%"></div></div></div>' +
      '</button>'
    )).join("") || '<article class="pinned-card"><strong>No matching sources</strong><p class="muted">Clear filters to see the starter set.</p></article>';
  }

  function renderDetail(record) {
    detailNode.innerHTML = [
      ["Source", record.source],
      ["Family", record.source_family],
      ["Theme", record.theme],
      ["Readiness", record.readiness + " | " + record.score + "/100"],
      ["Rights", record.rights_state],
      ["Review", record.review_state],
      ["Translation policy", record.translation_policy, "wide"],
      ["Source note", record.source_note, "wide"],
      ["Answer boundary", record.answer_boundary, "wide"],
      ["Question examples", record.question_examples.join(" | "), "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + sourceSafe(row[0]) + '</span><strong>' + sourceSafe(row[1]) + '</strong></div>').join("");
  }

  function renderPins(pins) {
    if (!pins.length) {
      pinsNode.innerHTML = '<article class="pinned-card"><strong>No pinned sources yet</strong><p class="muted">Pin a source and the local source shelf preview will begin.</p></article>';
      return;
    }
    pinsNode.innerHTML = pins.slice(0, 4).map((pin) => (
      '<article class="pinned-card"><strong>' + sourceSafe(pin.title) + '</strong><span>' + sourceSafe(pin.source) + '</span><p class="muted">' + sourceSafe(pin.family) + ' | ' + sourceSafe(pin.date) + '</p></article>'
    )).join("");
  }

  function render() {
    const pins = readSourcePins();
    const record = ensureSelected();
    if (!record) return;
    familyFilter.value = state.family;
    readinessFilter.value = state.readiness;
    search.value = state.search;
    renderSourceStats(sourceLibraryRoot, records, filteredRecords(), pins);
    renderList(record);
    renderDetail(record);
    renderPins(pins);
    packet.value = sourcePacketText(record, pins);
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

  listNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-source-id]");
    if (!button) return;
    state.recordId = button.dataset.sourceId;
    render();
  });

  sourceLibraryRoot.querySelector("#pinSource").addEventListener("click", () => {
    const record = selectedRecord();
    const pins = readSourcePins().filter((row) => row.id !== record.id);
    pins.unshift({
      id: record.id,
      title: record.title,
      source: record.source,
      family: record.source_family,
      date: new Date().toISOString().slice(0, 10)
    });
    writeSourcePins(pins);
    render();
  });

  sourceLibraryRoot.querySelector("#clearSourcePins").addEventListener("click", () => {
    localStorage.removeItem(sourceStorageKey());
    render();
  });

  sourceLibraryRoot.querySelector("#copySourcePacket").addEventListener("click", () => {
    packet.focus();
    packet.select();
    const button = sourceLibraryRoot.querySelector("#copySourcePacket");
    const originalText = button.textContent;
    const showCopied = () => {
      button.textContent = "Copied Packet";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1400);
    };
    const fallbackCopy = () => {
      try {
        document.execCommand("copy");
      } catch (error) {
        return;
      }
      showCopied();
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(packet.value).then(showCopied).catch(fallbackCopy);
      return;
    }
    fallbackCopy();
  });

  render();
}
