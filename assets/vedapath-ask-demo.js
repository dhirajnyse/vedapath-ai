(function () {
  const root = document.querySelector("[data-ask-demo]");
  if (!root) return;

  const form = document.getElementById("vpAskForm");
  const question = document.getElementById("vpQuestion");
  const clearButton = document.getElementById("vpClearQuestion");
  const resultTitle = document.getElementById("vpResultTitle");
  const resultBody = document.getElementById("vpResultBody");
  const resultStatus = document.getElementById("vpResultStatus");
  const resultMode = document.getElementById("vpResultMode");
  const modeNote = document.getElementById("vpModeNote");
  const modeButtons = Array.from(document.querySelectorAll("[data-source-mode]"));
  const sampleButtons = Array.from(document.querySelectorAll("[data-sample]"));
  let mode = "preview";
  let registryPromise;

  function clean(value) {
    return String(value || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function tokens(value) {
    return clean(value).split(/\s+/).filter(function (token) {
      return token.length > 1;
    });
  }

  function loadRegistry() {
    if (!registryPromise) {
      registryPromise = fetch("data/vedapath-source-registry.json", { cache: "no-store" }).then(function (response) {
        if (!response.ok) throw new Error("registry unavailable");
        return response.json();
      });
    }
    return registryPromise;
  }

  function traceId(value) {
    return "vp-preview-" + (clean(value).replace(/\s+/g, "-").slice(0, 36) || "query");
  }

  function score(record, value) {
    const queryText = clean(value);
    const queryTokens = new Set(tokens(queryText));
    let total = 0;
    const reasons = [];
    (record.keywords || []).forEach(function (keyword) {
      const normalized = clean(keyword);
      if (normalized && queryText.includes(normalized)) {
        total += normalized.includes(" ") ? 12 : 7;
        reasons.push("keyword " + keyword);
      }
    });
    [
      ["title", record.title, 4],
      ["citation", record.citation, 5],
      ["family", record.family, 3],
      ["summary", record.summary, 1]
    ].forEach(function (field) {
      const fieldTokens = new Set(tokens(field[1]));
      const overlap = Array.from(queryTokens).filter(function (token) {
        return fieldTokens.has(token);
      }).length;
      if (overlap) {
        total += overlap * field[2];
        reasons.push(field[0] + " overlap");
      }
    });
    if (record.status === "approved") total += 2;
    return { total: total, reasons: Array.from(new Set(reasons)).slice(0, 3) };
  }

  function noSourcePacket(value, guard, reason) {
    return {
      contract: "vedapath.source.v1",
      trace_id: traceId(value),
      query: value,
      source_found: false,
      primary_source_id: null,
      citation: guard.citation,
      family: guard.family,
      confidence: guard.confidence,
      reviewer_state: guard.status,
      rights_state: guard.rights_state,
      answer_boundary: guard.boundary,
      summary: guard.summary,
      no_source_reason: reason || "No reviewed source in the current registry supports this question.",
      next_action: "Try a narrower source question or send it to review.",
      match_reason: "no reviewed registry match"
    };
  }

  function previewPacket(value, registry) {
    const guard = registry.records.find(function (record) {
      return record.status === "no-source";
    });
    const queryText = clean(value);
    if (/\b(bitcoin|airplanes?|medical|cure|diagnos\w*|therapy|treatment|predict\w*)\b/.test(queryText)) {
      return noSourcePacket(value, guard, "No reviewed source in this preview supports that modern or medical claim.");
    }

    const candidates = registry.records.filter(function (record) {
      return record.status !== "no-source";
    }).map(function (record) {
      const scored = score(record, value);
      return { record: record, score: scored.total, reasons: scored.reasons };
    }).filter(function (candidate) {
      return candidate.score > 0;
    }).sort(function (a, b) {
      return b.score - a.score || b.record.confidence - a.record.confidence;
    });

    if (!candidates.length) return noSourcePacket(value, guard);
    const selected = candidates[0];
    const record = selected.record;
    return {
      contract: "vedapath.source.v1",
      trace_id: traceId(value),
      query: value,
      source_found: true,
      primary_source_id: record.id,
      citation: record.citation,
      family: record.family,
      confidence: record.confidence,
      reviewer_state: record.status,
      rights_state: record.rights_state,
      answer_boundary: record.boundary,
      summary: record.summary,
      no_source_reason: null,
      next_action: record.status === "approved" ? "Open a bounded cited answer draft." : "Route this source candidate to reviewer.",
      match_reason: selected.reasons.join("; ") || "highest reviewed registry score"
    };
  }

  function element(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function field(label, value, wide) {
    const node = element("div", "vp-result-field" + (wide ? " is-wide" : ""));
    node.append(element("span", "", label), element("strong", "", value || "Not available"));
    return node;
  }

  function renderPacket(packet, displayMode, warning) {
    const found = Boolean(packet.source_found);
    resultMode.textContent = displayMode;
    resultTitle.textContent = found ? packet.citation : "No reviewed source found";
    resultStatus.textContent = found ? titleCase(packet.reviewer_state || "source") : "Boundary";
    resultStatus.classList.toggle("is-hold", !found || packet.reviewer_state !== "approved");
    resultBody.className = "vp-result-content";

    const summary = element("p", "vp-result-summary", found ? packet.summary : packet.no_source_reason || packet.summary);
    const grid = element("div", "vp-result-grid");
    grid.append(
      field("Citation", packet.citation),
      field("Text family", packet.family),
      field("Confidence", String(packet.confidence) + (Number(packet.confidence) ? "/100" : "")),
      field("Review state", titleCase(packet.reviewer_state)),
      field("Rights posture", titleCase(packet.rights_state)),
      field("Match reason", packet.match_reason || "Source packet contract"),
      field("Boundary", packet.answer_boundary, true),
      field("Next action", packet.next_action, true)
    );

    const fragments = [summary];
    if (warning) fragments.push(element("p", "vp-result-warning", warning));
    fragments.push(grid);
    resultBody.replaceChildren.apply(resultBody, fragments);
    resultTitle.setAttribute("tabindex", "-1");
    resultTitle.focus({ preventScroll: true });
  }

  function titleCase(value) {
    return String(value || "not set").replace(/[-_]/g, " ").replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
  }

  function setLoading() {
    resultMode.textContent = mode === "api" ? "Local API" : "Reviewed preview";
    resultTitle.textContent = "Looking for one careful source...";
    resultStatus.textContent = "Checking";
    resultStatus.classList.remove("is-hold");
    resultBody.className = "vp-result-empty";
    resultBody.replaceChildren(element("p", "", "Checking citation metadata, source family, review state, and boundary."));
  }

  async function resolveQuestion(value) {
    const registry = await loadRegistry();
    if (mode !== "api") {
      return { packet: previewPacket(value, registry), label: "Reviewed preview", warning: null };
    }
    const adapter = window.VedaPathLocalApiAdapter;
    if (!adapter) {
      return {
        packet: previewPacket(value, registry),
        label: "Reviewed fallback",
        warning: "The local API adapter was unavailable, so VedaPath used the bundled reviewed registry."
      };
    }
    const packet = await adapter.querySourcePacket(value);
    if (packet.reviewer_state === "unavailable") {
      return {
        packet: previewPacket(value, registry),
        label: "Reviewed fallback",
        warning: "The private local API was not running, so VedaPath used the bundled reviewed registry. No source was invented."
      };
    }
    return { packet: packet, label: "Local API", warning: null };
  }

  function selectMode(nextMode) {
    mode = nextMode;
    modeButtons.forEach(function (button) {
      const active = button.dataset.sourceMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    modeNote.textContent = mode === "api"
      ? "Calls http://127.0.0.1:8787 for a private demo, then falls back visibly if it is offline."
      : "Uses the bundled reviewed registry. No question leaves this page.";
  }

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectMode(button.dataset.sourceMode || "preview");
    });
  });

  sampleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      question.value = button.dataset.sample || "";
      question.focus();
    });
  });

  clearButton.addEventListener("click", function () {
    question.value = "";
    question.focus();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const value = question.value.trim();
    if (!value) {
      question.focus();
      return;
    }
    setLoading();
    try {
      const result = await resolveQuestion(value);
      renderPacket(result.packet, result.label, result.warning);
      const url = new URL(window.location.href);
      url.searchParams.set("q", value);
      window.history.replaceState({}, "", url);
    } catch (error) {
      resultTitle.textContent = "The reviewed registry could not open";
      resultStatus.textContent = "Unavailable";
      resultStatus.classList.add("is-hold");
      resultBody.className = "vp-result-empty";
      resultBody.replaceChildren(element("p", "", "Reload the page or open the Build room. VedaPath will not answer without a source packet."));
    }
  });

  const initial = new URL(window.location.href).searchParams.get("q");
  if (initial) question.value = initial.slice(0, 500);
  loadRegistry().catch(function () {
    resultStatus.textContent = "Registry unavailable";
    resultStatus.classList.add("is-hold");
  });
})();
