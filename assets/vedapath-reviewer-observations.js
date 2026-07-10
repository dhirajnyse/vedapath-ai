(function () {
  "use strict";

  const workspace = document.querySelector("[data-config]");
  const form = document.getElementById("vpObservationForm");
  if (!workspace || !form) return;

  const scenario = document.getElementById("vpObservationScenario");
  const sourceFit = document.getElementById("vpSourceFit");
  const boundaryQuality = document.getElementById("vpBoundaryQuality");
  const usefulness = document.getElementById("vpUsefulness");
  const action = document.getElementById("vpObservationAction");
  const reviewerLabel = document.getElementById("vpReviewerLabel");
  const notes = document.getElementById("vpObservationNotes");
  const list = document.getElementById("vpObservationList");
  const count = document.getElementById("vpObservationCount");
  const copyButton = document.getElementById("vpCopyObservations");
  const clearButton = document.getElementById("vpClearObservations");
  const status = document.getElementById("vpObservationStatus");
  const observations = [];
  let config = null;

  function node(tag, className, value) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (value !== undefined) item.textContent = value;
    return item;
  }

  function currentScenario() {
    return config.scenarios.find(function (item) { return item.id === scenario.value; });
  }

  function packet() {
    return {
      schema: "vedapath.reviewer-observation.v1",
      release: "v4.8.3",
      storage: "none",
      telemetry: "none",
      reviewer_identity: "unverified prototype label",
      observations: observations.map(function (item) { return { ...item }; })
    };
  }

  function render() {
    count.textContent = String(observations.length);
    copyButton.disabled = observations.length === 0;
    clearButton.disabled = observations.length === 0;
    if (!observations.length) {
      list.className = "vp-ops-empty";
      list.replaceChildren(node("p", "", "No observations yet. Review one scenario to begin."));
      return;
    }
    const container = node("div", "vp-observation-list");
    observations.forEach(function (item, index) {
      const article = node("article", "vp-observation-item");
      article.append(node("strong", "", String(index + 1) + ". " + item.scenario_label));
      article.append(node("p", "", item.citation + " | " + item.notes));
      const meta = node("div", "vp-observation-meta");
      [item.source_fit, item.boundary_quality, item.usefulness, item.next_action].forEach(function (value) {
        meta.append(node("span", "", value));
      });
      article.append(meta);
      container.append(article);
    });
    list.className = "";
    list.replaceChildren(container);
  }

  async function copyPacket() {
    const value = JSON.stringify(packet(), null, 2);
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "Session packet copied by explicit reviewer action. Nothing was uploaded.";
    } catch (error) {
      status.textContent = "Clipboard access was unavailable. The session remains only in this page memory.";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const selected = currentScenario();
    const observation = notes.value.trim();
    if (!selected || !observation) {
      notes.focus();
      return;
    }
    observations.push({
      scenario_id: selected.id,
      scenario_label: selected.label,
      citation: selected.citation,
      source_fit: sourceFit.value,
      boundary_quality: boundaryQuality.value,
      usefulness: usefulness.value,
      next_action: action.value,
      reviewer_label: reviewerLabel.value.trim() || "anonymous reviewer",
      notes: observation
    });
    notes.value = "";
    render();
    status.textContent = "Observation added to page memory only.";
    notes.focus();
  });

  copyButton.addEventListener("click", copyPacket);
  clearButton.addEventListener("click", function () {
    observations.splice(0, observations.length);
    render();
    status.textContent = "Session cleared. No observation was retained.";
  });

  fetch(workspace.dataset.config, { cache: "no-store" }).then(function (response) {
    if (!response.ok) throw new Error("config unavailable");
    return response.json();
  }).then(function (value) {
    config = value;
    value.scenarios.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label + " | " + item.citation;
      scenario.append(option);
    });
    status.textContent = "Ready. Nothing has been stored or sent.";
  }).catch(function () {
    status.textContent = "The scenario list could not load. Reload the page before reviewing.";
    form.querySelector("button[type=submit]").disabled = true;
  });

  render();
})();
