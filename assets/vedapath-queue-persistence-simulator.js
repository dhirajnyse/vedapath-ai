(function () {
  const root = document.querySelector("[data-queue-config]");
  if (!root) return;

  const role = document.getElementById("vpPersistenceRole");
  const action = document.getElementById("vpPersistenceAction");
  const record = document.getElementById("vpPersistenceRecord");
  const audit = document.getElementById("vpPersistenceAudit");
  const status = document.getElementById("vpPersistenceStatus");
  const apply = document.getElementById("vpApplyTransition");
  const replay = document.getElementById("vpReplayTransition");
  const conflict = document.getElementById("vpStaleTransition");
  const reset = document.getElementById("vpResetPersistence");
  let initial;
  let current;
  let events;
  let lastEventId = "";

  const rules = {
    "claim-source": { capability: "source-reviewer", status: "source-review" },
    "claim-rights": { capability: "rights-reviewer", status: "rights-review" },
    "hold": { capability: "any-reviewer", status: "hold" },
    "source-evidence-ready": { capability: "source-reviewer", status: "evidence-ready" },
    "rights-evidence-ready": { capability: "rights-reviewer", status: "evidence-ready" }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function allowed(selectedRole, rule) {
    return rule && (rule.capability === selectedRole || (rule.capability === "any-reviewer" && selectedRole !== "observer"));
  }

  function render(message) {
    record.textContent = JSON.stringify(current, null, 2);
    audit.innerHTML = "";
    if (!events.length) {
      audit.innerHTML = "<p>No persistence events in this page session.</p>";
    } else {
      events.slice().reverse().forEach(function (event) {
        const item = document.createElement("article");
        item.className = "vp-persistence-event";
        const title = document.createElement("strong");
        title.textContent = event.event_id + " | " + event.outcome;
        const copy = document.createElement("span");
        copy.textContent = event.detail;
        item.append(title, copy);
        audit.appendChild(item);
      });
    }
    status.textContent = message;
  }

  function transition(options) {
    const rule = rules[action.value];
    const eventId = options.eventId;
    const prior = events.find(function (event) { return event.event_id === eventId; });
    if (prior) {
      events.push({ event_id: eventId, outcome: "idempotent replay", detail: "The original event is returned without a second state change." });
      render("Idempotent replay accepted; record version did not change.");
      return;
    }
    if (options.expectedVersion !== current.version) {
      events.push({ event_id: eventId, outcome: "version conflict", detail: "Expected v" + options.expectedVersion + ", current v" + current.version + "." });
      render("Stale transition rejected by optimistic concurrency.");
      return;
    }
    if (!allowed(role.value, rule)) {
      events.push({ event_id: eventId, outcome: "authorization denied", detail: role.value + " cannot perform " + action.value + "." });
      render("Role-bound transition denied.");
      return;
    }
    const before = current.version;
    current.status = rule.status;
    current.version += 1;
    current.publication_state = "blocked";
    current.registry_merge = "manual-only";
    const event = { event_id: eventId, outcome: "applied", detail: "Version " + before + " -> " + current.version + "; publication remains blocked." };
    events.push(event);
    lastEventId = eventId;
    render("Transition applied to page memory. Durable storage remains unconnected.");
  }

  fetch(root.dataset.queueConfig)
    .then(function (response) {
      if (!response.ok) throw new Error("Queue contract data is unavailable.");
      return response.json();
    })
    .then(function (config) {
      initial = clone(config.persistence_preview.seed_record);
      current = clone(initial);
      events = [];
      render("Ready to test concurrency, idempotency, and immutable publication locks.");

      apply.addEventListener("click", function () {
        const eventId = "event-" + String(events.length + 1).padStart(2, "0");
        transition({ eventId, expectedVersion: current.version });
      });
      replay.addEventListener("click", function () {
        if (!lastEventId) {
          status.textContent = "Apply one successful event before replaying it.";
          return;
        }
        transition({ eventId: lastEventId, expectedVersion: current.version });
      });
      conflict.addEventListener("click", function () {
        transition({ eventId: "stale-" + String(events.length + 1).padStart(2, "0"), expectedVersion: Math.max(0, current.version - 1) });
      });
      reset.addEventListener("click", function () {
        current = clone(initial);
        events = [];
        lastEventId = "";
        render("Page-session repository reset. No durable data was changed.");
      });
    })
    .catch(function (error) {
      status.textContent = error.message;
    });
})();
