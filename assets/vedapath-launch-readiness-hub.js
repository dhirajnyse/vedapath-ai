const output = document.querySelector("[data-launch-output]");
const copyButton = document.querySelector("[data-copy-launch]");

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function render(data) {
  document.querySelector("[data-score]").textContent = data.readiness_score;
  document.querySelector("[data-release]").textContent = data.release;
  document.querySelector("[data-ready]").innerHTML = data.ready.map((item, index) => `
    <div class="readiness-item">
      <span class="readiness-dot">${index + 1}</span>
      <p>${item}</p>
    </div>`).join("");
  document.querySelector("[data-locked]").innerHTML = data.locked.map((item, index) => `
    <div class="readiness-item locked">
      <span class="readiness-dot">${index + 1}</span>
      <p>${item}</p>
    </div>`).join("");
  document.querySelector("[data-founder]").innerHTML = data.founder_moves.map((item, index) => `
    <div class="compact-field"><small>Move ${index + 1}</small><strong>${item}</strong></div>`).join("");
  output.value = [
    "VedaPath Launch Readiness Hub",
    `Release: ${data.release}`,
    `Readiness score: ${data.readiness_score}/100`,
    "",
    "Ready",
    list(data.ready),
    "",
    "Locked",
    list(data.locked),
    "",
    "Founder moves",
    list(data.founder_moves)
  ].join("\n");
}

fetch("data/vedapath-launch-readiness-hub.json")
  .then((response) => response.json())
  .then(render)
  .catch((error) => {
    output.value = `Unable to load launch readiness data: ${error.message}`;
  });

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    copyButton.textContent = "Copied";
  } catch {
    output.select();
    document.execCommand("copy");
    copyButton.textContent = "Selected";
  }
  setTimeout(() => {
    copyButton.textContent = "Copy Report";
  }, 1400);
});
