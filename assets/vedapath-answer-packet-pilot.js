const state = { data: null };

const packetOutput = document.querySelector("[data-packet-output]");
const copyButton = document.querySelector("[data-copy-packet]");

function line(label, value) {
  return value ? `${label}: ${value}` : "";
}

function packetText(data) {
  return [
    "VedaPath Answer Packet Pilot",
    line("Release", data.release),
    line("Question", data.source.question),
    line("Source", data.source.source_ref),
    line("Family", data.source.source_family),
    line("Confidence", data.source.confidence),
    "",
    data.packet.title,
    data.packet.plain_meaning,
    "",
    line("Carry action", data.packet.useful_action),
    line("Boundary", data.source.boundary),
    line("Do not overclaim", data.packet.no_go)
  ].filter(Boolean).join("\n");
}

function render(data) {
  document.querySelectorAll("[data-text]").forEach((node) => {
    const path = node.dataset.text.split(".");
    const value = path.reduce((current, key) => current?.[key], data);
    if (value !== undefined) node.textContent = value;
  });
  packetOutput.value = packetText(data);
}

fetch("data/vedapath-answer-packet-pilot.json")
  .then((response) => response.json())
  .then((data) => {
    state.data = data;
    render(data);
  })
  .catch((error) => {
    packetOutput.value = `Unable to load answer packet pilot data: ${error.message}`;
  });

copyButton?.addEventListener("click", async () => {
  const text = packetOutput.value;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copied";
  } catch {
    packetOutput.select();
    document.execCommand("copy");
    copyButton.textContent = "Selected";
  }
  setTimeout(() => {
    copyButton.textContent = "Copy Packet";
  }, 1400);
});
