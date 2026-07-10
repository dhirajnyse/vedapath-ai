(function () {
  "use strict";

  const workspace = document.querySelector("[data-config]");
  const roleSelect = document.getElementById("vpQueueRole");
  const filters = document.getElementById("vpQueueFilter");
  const list = document.getElementById("vpRightsQueueList");
  const audit = document.getElementById("vpRightsQueueAudit");
  const count = document.getElementById("vpQueueCount");
  const copyButton = document.getElementById("vpCopyQueuePacket");
  const resetButton = document.getElementById("vpResetQueue");
  const status = document.getElementById("vpQueueStatus");
  if (!workspace || !roleSelect || !list) return;

  let config = null;
  let records = [];
  const events = [];

  function node(tag, className, value) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (value !== undefined) item.textContent = value;
    return item;
  }

  function role() {
    return config.roles.find(function (item) { return item.id === roleSelect.value; }) || config.roles[0];
  }

  function rule(action) {
    return config.actions.find(function (item) { return item.id === action; });
  }

  function allowed(action) {
    const actionRule = rule(action);
    return actionRule && role().capabilities.includes(actionRule.capability);
  }

  function transition(id, action) {
    const item = records.find(function (record) { return record.id === id; });
    const actionRule = rule(action);
    if (!item || !actionRule || !allowed(action)) {
      status.textContent = "Action denied by the selected prototype role. No state changed.";
      return;
    }
    const from = item.status;
    item.status = actionRule.status;
    item.publication_state = "blocked";
    events.push({
      candidate_id: item.id,
      action,
      from,
      to: item.status,
      reviewer_role: role().id,
      identity_verified: false,
      occurred_at: "preview-session"
    });
    status.textContent = "Queue state changed in this page session only. Publication remains blocked.";
    render();
  }

  function actionButton(item, action) {
    const actionRule = rule(action);
    const button = node("button", allowed(action) ? "vp-ops-secondary" : "vp-ops-quiet", actionRule.label);
    button.type = "button";
    button.disabled = !allowed(action);
    button.addEventListener("click", function () { transition(item.id, action); });
    return button;
  }

  function renderAudit() {
    if (!events.length) {
      audit.className = "vp-ops-empty";
      audit.replaceChildren(node("p", "", "No queue decisions in this session."));
      return;
    }
    const container = node("div", "vp-observation-list");
    events.slice().reverse().forEach(function (event) {
      const item = node("article", "vp-observation-item");
      item.append(node("strong", "", event.candidate_id + " | " + event.action.replace(/-/g, " ")));
      item.append(node("p", "", event.from + " -> " + event.to + " | " + event.reviewer_role + " | identity unverified"));
      container.append(item);
    });
    audit.className = "";
    audit.replaceChildren(container);
  }

  function render() {
    const visible = records.filter(function (item) { return filters.value === "all" || item.status === filters.value; });
    count.textContent = String(visible.length);
    list.replaceChildren();
    if (!visible.length) list.append(node("p", "vp-ops-empty", "No candidates match this filter."));
    visible.forEach(function (item) {
      const card = node("article", "vp-queue-card");
      const top = node("div", "vp-queue-card-head");
      top.append(node("span", "vp-ops-eyebrow", item.status.replace(/-/g, " ")));
      top.append(node("strong", "", item.citation));
      card.append(top);
      card.append(node("p", "", item.family + " | rights: " + item.rights_state + " | source: " + item.source_state));
      card.append(node("p", "", "Lane: " + item.review_lane + ". Publication blocked; registry merge manual only."));
      const actions = node("div", "vp-ops-actions");
      config.actions.forEach(function (itemAction) { actions.append(actionButton(item, itemAction.id)); });
      card.append(actions);
      list.append(card);
    });
    renderAudit();
  }

  roleSelect.addEventListener("change", function () {
    status.textContent = "Role changed. Identity remains unverified and all work remains a preview.";
    render();
  });
  filters.addEventListener("change", render);
  resetButton.addEventListener("click", function () {
    records = config.candidates.map(function (item) { return { ...item }; });
    events.splice(0, events.length);
    status.textContent = "Session reset. No queue state was retained.";
    render();
  });
  copyButton.addEventListener("click", async function () {
    const packet = {
      schema: "vedapath.rights-operations-queue-export.v1",
      release: config.release,
      identity_verified: false,
      persistence: "none",
      publication_state: "blocked",
      records,
      events
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
      status.textContent = "Queue packet copied explicitly. Nothing was uploaded or approved.";
    } catch (error) {
      status.textContent = "Clipboard access was unavailable. Queue state remains only in this page.";
    }
  });

  fetch(workspace.dataset.config, { cache: "no-store" }).then(function (response) {
    if (!response.ok) throw new Error("config unavailable");
    return response.json();
  }).then(function (value) {
    config = value;
    value.roles.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      roleSelect.append(option);
    });
    records = value.candidates.map(function (item) { return { ...item }; });
    status.textContent = "Ready. Queue memory lasts only until this page is refreshed.";
    render();
  }).catch(function () {
    status.textContent = "The queue contract could not load. Reload before reviewing candidates.";
    copyButton.disabled = true;
    resetButton.disabled = true;
  });
})();

