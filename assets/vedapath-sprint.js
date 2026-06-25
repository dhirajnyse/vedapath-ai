const data = JSON.parse(document.getElementById("room-data").textContent);
const state = { mode: "brief" };

function renderRooms() {
  const list = document.getElementById("roomList");
  list.innerHTML = data.rooms.map((room, index) => `
    <a class="room-card ${room.slug === data.slug ? "active" : ""}" href="${room.slug}.html">
      <span class="index-pill">${index + 1}</span>
      <span>
        <strong>${room.nav}</strong>
        <span>${room.version}</span>
      </span>
    </a>
  `).join("");
}

function renderItems() {
  document.getElementById("itemList").innerHTML = data.items.map((item, index) => `
    <div class="item-card">
      <span class="index-pill">${index + 1}</span>
      <div>
        <strong>${item[0]}</strong>
        <p class="muted">${item[1]}</p>
        <p>${item[2]}</p>
      </div>
    </div>
  `).join("");
}

function renderTabs() {
  [...document.querySelectorAll(".tab")].forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === state.mode);
    tab.addEventListener("click", () => {
      state.mode = tab.dataset.mode;
      renderMode();
      renderTabs();
    }, { once: true });
  });
}

function renderMode() {
  const rows = data.modes[state.mode] || data.modes.brief;
  document.getElementById("modePanel").innerHTML = `
    <div class="grid">
      ${rows.map((row) => `
        <div class="mini-card">
          <h3>${row[0]}</h3>
          <p>${row[1]}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function briefText() {
  return [
    `VedaPath ${data.title}`,
    `Release: ${data.version}`,
    `Primary ask: ${data.primaryAsk}`,
    `Source candidate: ${data.source}`,
    `Text family: ${data.family}`,
    `Boundary: ${data.stance}`,
    "",
    data.summary,
    "",
    ...data.items.map((item) => `- ${item[0]}: ${item[1]}`)
  ].join("\n");
}

function jsonText() {
  return JSON.stringify({
    product: "VedaPath AI",
    release: data.version,
    feature: data.title,
    source_candidate: data.source,
    text_family: data.family,
    boundary: data.stance,
    primary_ask: data.primaryAsk,
    items: data.items.map((item) => ({ name: item[0], question: item[1], evidence: item[2] }))
  }, null, 2);
}

function boundaryText() {
  const rows = data.modes.boundary || [];
  return [
    `VedaPath Boundary Handoff`,
    `Release: ${data.version}`,
    `Feature: ${data.title}`,
    ...rows.map((row) => `- ${row[0]}: ${row[1]}`)
  ].join("\n");
}

function setOutput(text, button, label) {
  const output = document.getElementById("output");
  output.value = text;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 900);
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

function render() {
  renderRooms();
  renderItems();
  renderTabs();
  renderMode();
  document.getElementById("output").value = briefText();
  document.getElementById("copyBrief").addEventListener("click", (event) => setOutput(briefText(), event.currentTarget, "Brief Copied"));
  document.getElementById("copyJson").addEventListener("click", (event) => setOutput(jsonText(), event.currentTarget, "JSON Copied"));
  document.getElementById("copyBoundary").addEventListener("click", (event) => setOutput(boundaryText(), event.currentTarget, "Boundary Copied"));
}

render();
