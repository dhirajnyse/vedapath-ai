const sourceReaderRoot = document.getElementById("sourceReader");

if (sourceReaderRoot) {
  initSourceReader().catch((error) => {
    sourceReaderRoot.innerHTML = '<p class="muted">Reader preview could not load passage candidates.</p>';
    console.error(error);
  });
}

async function readerLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function readerText(value) {
  return String(value || "");
}

function readerSafe(value) {
  return readerText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function storageKey() {
  return "vedapath-source-reader-sessions";
}

function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || "[]");
  } catch (error) {
    return [];
  }
}

function writeSessions(sessions) {
  localStorage.setItem(storageKey(), JSON.stringify(sessions.slice(0, 14)));
}

function handoffText(passage, mode, sessions) {
  return [
    "VedaPath Guided Source Reader Handoff",
    "Source candidate: " + passage.source_candidate,
    "Text family: " + passage.text_family,
    "Category: " + passage.category,
    "Layer: " + mode,
    "Reflection: " + passage.reflection_question,
    "Carry action: " + passage.carry_action,
    "Reviewer note: " + passage.reviewer_note,
    "No-go: " + passage.no_go,
    "Saved local sessions: " + sessions.length,
    "",
    "Boundary: prototype reader only; not full scripture text, final commentary, therapy, ritual instruction, emergency support, or spiritual authority."
  ].join("\n");
}

function renderReaderStats(root, passages, betaRecords, sessions, passage) {
  const last = sessions[0] ? sessions[0].title : "None";
  root.querySelector("#readerStats").innerHTML = [
    ["Passages", passages.length],
    ["Seed records", betaRecords.length],
    ["Saved", sessions.length],
    ["Last", last]
  ].map((row) => '<div class="reader-stat"><span>' + readerSafe(row[0]) + '</span><strong>' + readerSafe(row[1]) + '</strong></div>').join("");
}

function layerRows(passage, mode, sessions) {
  const rows = {
    source: [
      ["Source identity", passage.source_candidate],
      ["Family", passage.text_family],
      ["Category", passage.category],
      ["Level", passage.level]
    ],
    meaning: [
      ["Plain meaning", passage.plain_meaning],
      ["Beginner note", passage.beginner_note],
      ["Reviewer note", passage.reviewer_note]
    ],
    boundary: [
      ["Context boundary", passage.context_boundary],
      ["No-go line", passage.no_go],
      ["Product stance", "Reflection support, not authority."]
    ],
    reflect: [
      ["One clean question", passage.reflection_question],
      ["Carry into life", passage.carry_action]
    ],
    memory: [
      ["Saved sessions", String(sessions.length)],
      ["Latest passage", sessions[0] ? sessions[0].title : "No local sessions yet."],
      ["Privacy", "Saved only in this browser preview until real accounts and consent exist."]
    ]
  };
  return rows[mode] || rows.meaning;
}

async function initSourceReader() {
  const passageData = await readerLoadJson("data/vedapath-reader-passages.json");
  const betaData = await readerLoadJson("data/vedapath-beta-seed.json");
  const passages = passageData.passages || [];
  const betaRecords = betaData.records || [];
  const select = sourceReaderRoot.querySelector("#passageSelect");
  const passageList = sourceReaderRoot.querySelector("#passageList");
  const sourceCard = sourceReaderRoot.querySelector("#readerSourceCard");
  const tabsNode = sourceReaderRoot.querySelector("#readerTabs");
  const layerNode = sourceReaderRoot.querySelector("#readerLayer");
  const handoff = sourceReaderRoot.querySelector("#readerHandoff");
  const state = {
    passageId: sourceReaderRoot.dataset.defaultPassage || (passages[0] && passages[0].id),
    mode: "meaning"
  };
  const tabs = [
    ["source", "Source"],
    ["meaning", "Meaning"],
    ["boundary", "Boundary"],
    ["reflect", "Reflect"],
    ["memory", "Memory"]
  ];

  select.innerHTML = passages.map((passage) => (
    '<option value="' + readerSafe(passage.id) + '">' + readerSafe(passage.source_candidate + " - " + passage.title) + '</option>'
  )).join("");

  function selectedPassage() {
    return passages.find((passage) => passage.id === state.passageId) || passages[0];
  }

  function renderPassageList(passage) {
    passageList.innerHTML = passages.map((item) => (
      '<button class="passage-card' + (item.id === passage.id ? ' active' : '') + '" type="button" data-passage-id="' + readerSafe(item.id) + '">' +
        '<strong>' + readerSafe(item.title) + '</strong>' +
        '<span>' + readerSafe(item.source_candidate) + '</span>' +
        '<span>' + readerSafe(item.text_family) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderSourceCard(passage) {
    sourceCard.innerHTML = [
      ["Source", passage.source_candidate],
      ["Family", passage.text_family],
      ["Category", passage.category],
      ["Boundary", passage.context_boundary]
    ].map((row) => '<div><span>' + readerSafe(row[0]) + '</span><strong>' + readerSafe(row[1]) + '</strong></div>').join("");
  }

  function renderTabs() {
    tabsNode.innerHTML = tabs.map((tab) => (
      '<button class="reader-tab' + (tab[0] === state.mode ? ' active' : '') + '" type="button" data-reader-mode="' + tab[0] + '">' + tab[1] + '</button>'
    )).join("");
  }

  function renderLayer(passage, sessions) {
    const rows = layerRows(passage, state.mode, sessions);
    const cards = rows.map((row, index) => (
      '<article class="reader-layer-card' + (index === 0 ? ' accent' : '') + '">' +
        '<h3>' + readerSafe(row[0]) + '</h3>' +
        '<p>' + readerSafe(row[1]) + '</p>' +
      '</article>'
    )).join("");
    const memory = state.mode === "memory" ? '<div class="memory-list">' + sessions.slice(0, 4).map((session) => (
      '<article class="memory-card"><strong>' + readerSafe(session.title) + '</strong><p class="muted">' + readerSafe(session.source) + ' | ' + readerSafe(session.date) + '</p></article>'
    )).join("") + '</div>' : "";
    layerNode.innerHTML = cards + memory;
  }

  function render() {
    const passage = selectedPassage();
    const sessions = readSessions();
    select.value = passage.id;
    renderReaderStats(sourceReaderRoot, passages, betaRecords, sessions, passage);
    renderPassageList(passage);
    renderSourceCard(passage);
    renderTabs();
    renderLayer(passage, sessions);
    handoff.value = handoffText(passage, state.mode, sessions);
  }

  select.addEventListener("change", () => {
    state.passageId = select.value;
    render();
  });

  passageList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-passage-id]");
    if (!button) return;
    state.passageId = button.dataset.passageId;
    render();
  });

  tabsNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reader-mode]");
    if (!button) return;
    state.mode = button.dataset.readerMode;
    render();
  });

  sourceReaderRoot.querySelector("#saveReading").addEventListener("click", () => {
    const passage = selectedPassage();
    const sessions = readSessions();
    sessions.unshift({
      title: passage.title,
      source: passage.source_candidate,
      date: new Date().toISOString().slice(0, 10)
    });
    writeSessions(sessions);
    render();
  });

  sourceReaderRoot.querySelector("#clearReaderMemory").addEventListener("click", () => {
    localStorage.removeItem(storageKey());
    render();
  });

  sourceReaderRoot.querySelector("#copyReaderHandoff").addEventListener("click", () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(handoff.value).catch(() => {});
    }
  });

  render();
}
