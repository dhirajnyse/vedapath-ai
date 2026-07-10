(function () {
  "use strict";

  const workspace = document.querySelector("[data-config]");
  const form = document.getElementById("vpSourceIntakeForm");
  if (!workspace || !form) return;

  const fields = {
    candidate_id: document.getElementById("vpCandidateId"),
    citation: document.getElementById("vpCitation"),
    family: document.getElementById("vpFamily"),
    edition_note: document.getElementById("vpEditionNote"),
    summary: document.getElementById("vpCandidateSummary"),
    boundary: document.getElementById("vpCandidateBoundary"),
    rights_state: document.getElementById("vpRightsState"),
    rights_evidence: document.getElementById("vpRightsEvidence"),
    review_lane: document.getElementById("vpReviewLane")
  };
  const messages = document.getElementById("vpIntakeMessages");
  const packetView = document.getElementById("vpIntakePacket");
  const state = document.getElementById("vpIntakeState");
  const copyButton = document.getElementById("vpCopyIntake");
  const resetButton = document.getElementById("vpResetIntake");
  const sampleButton = document.getElementById("vpLoadIntakeSample");
  const status = document.getElementById("vpIntakeStatus");
  let config = null;
  let currentPacket = null;

  function clean(value, max) {
    return String(value || "").trim().slice(0, max);
  }

  function values() {
    return {
      candidate_id: clean(fields.candidate_id.value, 80).toLowerCase(),
      citation: clean(fields.citation.value, 120),
      family: clean(fields.family.value, 120),
      edition_note: clean(fields.edition_note.value, 240),
      summary: clean(fields.summary.value, 500),
      boundary: clean(fields.boundary.value, 500),
      rights_state: clean(fields.rights_state.value, 40),
      rights_evidence: clean(fields.rights_evidence.value, 600),
      review_lane: clean(fields.review_lane.value, 100)
    };
  }

  function validate(input) {
    const errors = [];
    Object.keys(fields).forEach(function (key) {
      if (!input[key]) errors.push({ field: key, message: key.replace(/_/g, " ") + " is required." });
    });
    if (input.candidate_id && !/^[a-z0-9][a-z0-9-]{2,79}$/.test(input.candidate_id)) {
      errors.push({ field: "candidate_id", message: "Candidate ID must use lowercase letters, numbers, and hyphens." });
    }
    const packet = {
      schema: "vedapath.source-intake.v1",
      ...input,
      reviewer_state: "draft",
      publication_state: "blocked",
      registry_merge: "manual-only",
      translation_text_included: false
    };
    return { errors, packet };
  }

  function renderMessages(errors) {
    const list = document.createElement("div");
    list.className = "vp-validation-list";
    if (!errors.length) {
      const item = document.createElement("article");
      item.className = "vp-validation-item is-pass";
      const title = document.createElement("strong");
      title.textContent = "Draft passes intake validation";
      const detail = document.createElement("p");
      detail.textContent = "It is ready for a human rights review, not approval or publication.";
      item.append(title, detail);
      list.append(item);
    } else {
      errors.forEach(function (error) {
        const item = document.createElement("article");
        item.className = "vp-validation-item is-error";
        const title = document.createElement("strong");
        title.textContent = error.field.replace(/_/g, " ");
        const detail = document.createElement("p");
        detail.textContent = error.message;
        item.append(title, detail);
        list.append(item);
      });
    }
    messages.className = "";
    messages.replaceChildren(list);
  }

  function reset() {
    form.reset();
    currentPacket = null;
    packetView.hidden = true;
    packetView.textContent = "";
    copyButton.disabled = true;
    state.textContent = "Blocked";
    messages.className = "vp-ops-empty";
    const note = document.createElement("p");
    note.textContent = "Complete the form to validate a source candidate. No data is stored.";
    messages.replaceChildren(note);
    status.textContent = "Publication remains blocked.";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const result = validate(values());
    renderMessages(result.errors);
    currentPacket = result.errors.length ? null : result.packet;
    packetView.hidden = !currentPacket;
    packetView.textContent = currentPacket ? JSON.stringify(currentPacket, null, 2) : "";
    copyButton.disabled = !currentPacket;
    state.textContent = currentPacket ? "Draft valid" : "Needs input";
    status.textContent = currentPacket
      ? "Draft validated in page memory. Publication and registry merge remain blocked."
      : "Fix the named fields. Nothing was stored or submitted.";
  });

  copyButton.addEventListener("click", async function () {
    if (!currentPacket) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentPacket, null, 2));
      status.textContent = "Draft packet copied by explicit action. Nothing was uploaded.";
    } catch (error) {
      status.textContent = "Clipboard access was unavailable. The draft remains only in page memory.";
    }
  });

  resetButton.addEventListener("click", reset);
  sampleButton.addEventListener("click", function () {
    if (!config) return;
    Object.entries(config.sample).forEach(function ([key, value]) {
      if (fields[key]) fields[key].value = value;
    });
    status.textContent = "Sample loaded. Validate it to create a publication-blocked draft.";
  });

  fetch(workspace.dataset.config, { cache: "no-store" }).then(function (response) {
    if (!response.ok) throw new Error("config unavailable");
    return response.json();
  }).then(function (value) {
    config = value;
    value.rights_lanes.forEach(function (lane) {
      const option = document.createElement("option");
      option.value = lane.id;
      option.textContent = lane.label + (lane.usable ? "" : " - hold");
      fields.rights_state.append(option);
    });
    status.textContent = "Ready. Publication remains blocked.";
  }).catch(function () {
    status.textContent = "The intake contract could not load. Reload before creating a draft.";
    form.querySelector("button[type=submit]").disabled = true;
  });

  reset();
})();
