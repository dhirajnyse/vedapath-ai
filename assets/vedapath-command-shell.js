(function () {
  const releaseBadge = "v4.9.1 controlled pilot";
  const prefKey = "vedapathCommandShellPrefs";
  const groups = [
    { title: "Start", labels: ["Home", "Build", "Brand", "Blueprint"] },
    { title: "Source", labels: ["Ask Demo", "Answers", "Review", "Mantra"] },
    { title: "Practice", labels: ["Life", "Talk", "Pattern", "Daily"] },
    { title: "Retrieval", labels: ["Packet", "Launch", "Pilot", "Records", "Desk", "QA Pack", "Ask Flow", "Links", "Rights", "History", "Score", "Waitlist", "Edition", "Rights Desk", "Identity", "Promote", "Invite", "Telemetry"] },
    { title: "Pilot Launch", labels: ["Signals", "First Session", "Source Triage", "Answer Gate", "Launch Console"] },
    { title: "Pilot Review", labels: ["Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score", "Invite Review", "Rights Board", "Session Export", "Feedback Audit", "Retrieval Adapter"] },
    { title: "Retrieval Quality", labels: ["Fixture Adapter", "Ranking Contract", "No-Source", "Citation Packet", "QA Harness"] },
    { title: "Source Expansion", labels: ["Coverage", "Family Map", "Dossier", "Approval Flow", "Answer Integration"] },
    { title: "Answer Drafts", labels: ["Draft Review", "Revision", "Trace", "Audience Views", "Evidence Pack"] },
    { title: "Launch Stack", labels: ["Source API", "Retrieval Boundary", "Answer Adapter", "Review Handoff", "Private Gate"] },
    { title: "Launch Tests", labels: ["Source API Tests", "No-Source Eval", "Fixture Runner", "Adapter Tests", "Demo Script"] },
    { title: "Backend Prototype", labels: ["Backend Gate", "Source Stub", "Retrieval CLI", "Demo Ledger", "Backend Ready"] },
    { title: "Backend Spike", labels: ["Backend Choice", "Local API", "Packet Tests", "API Adapter", "Backend Handoff"] },
    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] },
    { title: "Private Demo", labels: ["Demo Runbook", "Observations", "Rights Intake", "Security Review", "Hosted Gate"] },
    { title: "Hosted Pilot", labels: ["Hosted API", "Request Guard", "Reviewer Roles", "Rights Queue", "Pilot Gate"] },
  ];
  const pageTitles = {
    Home: "VedaPath command center",
    Build: "Build status",
    Brand: "Brand board",
    Blueprint: "Product blueprint",
    Answers: "Cited answer room",
    Review: "Review queue",
    Mantra: "Mantra lens",
    Life: "Life companion",
    Talk: "Conversation companion",
    Pattern: "Pattern companion",
    Daily: "Daily calm loop",
    Packet: "Answer packet pilot",
    Launch: "Launch readiness hub",
    "Pilot": "Production Retrieval Pilot Gate",
    "Records": "Verified Source Record Schema",
    "Desk": "Retrieval Reviewer Desk",
    "QA Pack": "First 25 Source QA Pack",
    "Ask Flow": "Learner Ask Flow",
    "Links": "Citation Deep Link Layer",
    "Rights": "Source Edition and Rights Matrix",
    "History": "Reviewer Decision History",
    "Score": "Retrieval Scoring Explanation",
    "Waitlist": "Public Pilot Waitlist Gate",
    "Edition": "Source Edition Intake",
    "Rights Desk": "Rights Review Desk",
    "Identity": "Reviewer Identity Lite",
    "Promote": "Answer Promotion Rules",
    "Invite": "Pilot Invite Packet",
    "Telemetry": "Pilot Telemetry Consent",
    "Signals": "Pilot Learning Signal Review",
    "First Session": "First Session Launch Spine",
    "Source Triage": "Source Readiness Triage",
    "Answer Gate": "Answer Readiness Gate",
    "Launch Console": "Private Pilot Launch Console",
    "Feedback": "Pilot Feedback Intake",
    "Feedback Desk": "Feedback Review Desk",
    "Session Script": "Pilot User Session Script",
    "Safety": "Launch Safety Checklist",
    "Readiness Score": "Private Pilot Readiness Score",
    "Invite Review": "Pilot Invite Review",
    "Rights Board": "Source Rights Approval Board",
    "Session Export": "Pilot Session Export Packet",
    "Feedback Audit": "Feedback-to-Ticket Audit Trail",
    "Retrieval Adapter": "First Real Retrieval Adapter Shell",
    "Fixture Adapter": "Retrieval Fixture Adapter",
    "Ranking Contract": "Source Candidate Ranking Contract",
    "No-Source": "No-Source Answer Behavior",
    "Citation Packet": "Citation Packet Renderer",
    "QA Harness": "Retrieval QA Harness",
    Coverage: "Source Coverage Expansion",
    "Family Map": "Source Family Coverage Map",
    Dossier: "Passage Dossier Builder",
    "Approval Flow": "Reviewer Approval Workflow",
    "Answer Integration": "Retrieval-to-Answer Integration Gate",
    "Draft Review": "Learner Answer Draft Review",
    Revision: "Answer Revision Workbench",
    Trace: "Source-to-Answer Trace View",
    "Audience Views": "Audience View Toggle",
    "Evidence Pack": "Launch Readiness Evidence Pack",
    "Source API": "Real Source API Contract",
    "Retrieval Boundary": "Retrieval Service Boundary",
    "Answer Adapter": "Mock Answer Generation Adapter",
    "Review Handoff": "Reviewer Approval Handoff",
    "Private Gate": "Private Launch Gate",
    "Source API Tests": "Source API Test Harness",
    "No-Source Eval": "No-Source Evaluation Suite",
    "Fixture Runner": "Source Candidate Fixture Runner",
    "Adapter Tests": "Adapter Contract Tests",
    "Demo Script": "Private Demo Script",
    "Backend Gate": "Backend Prototype Decision Gate",
    "Source Stub": "Source API Stub",
    "Retrieval CLI": "Retrieval Fixture CLI",
    "Demo Ledger": "Private Demo Session Ledger",
    "Backend Ready": "Backend Readiness Control Room",
    "Backend Choice": "Backend Spike Choice",
    "Local API": "Local Source API Server",
    "Packet Tests": "Source Packet Contract Tests",
    "API Adapter": "Local API Adapter Fallback",
    "Backend Handoff": "Private Demo Backend Handoff",
    "Spike Review": "Backend Spike Review Gate",
    "API Reliability": "Source API Reliability Contract",
    "Source Registry": "Curated Source Registry",
    "Ask Demo": "Integrated Ask Demo",
    "Path Readiness": "Source Path Readiness Console",
    "Demo Runbook": "Private Demo Runbook",
    "Observations": "Reviewer Observation Capture",
    "Rights Intake": "Rights-Cleared Source Intake",
    "Security Review": "Security & Privacy Review",
    "Hosted Gate": "Hosted Backend Decision Gate",
    "Hosted API": "Read-only Hosted API Adapter",
    "Request Guard": "Rate Limit & Privacy-Safe Monitoring",
    "Reviewer Roles": "Reviewer Identity & Role Prototype",
    "Rights Queue": "Rights Operations Queue",
    "Pilot Gate": "Controlled External Pilot Gate"
  };
  const bodyPageTitles = {
    "permission-execution-draft-page": "Controlled draft gate",
    "permission-execution-draft-review-page": "Controlled draft review gate",
    "review-decision-page": "Controlled review decision gate",
    "permission-execution-decision-page": "Founder decision gate",
    "answer-packet-pilot-page": "Answer packet pilot",
    "launch-readiness-hub-page": "Launch readiness hub",
    "production-retrieval-pilot-page": "Production Retrieval Pilot Gate",
    "verified-source-record-schema-page": "Verified Source Record Schema",
    "retrieval-reviewer-desk-page": "Retrieval Reviewer Desk",
    "source-qa-pack-page": "First 25 Source QA Pack",
    "learner-ask-flow-page": "Learner Ask Flow",
    "citation-deep-link-layer-page": "Citation Deep Link Layer",
    "source-edition-rights-matrix-page": "Source Edition and Rights Matrix",
    "reviewer-decision-history-page": "Reviewer Decision History",
    "retrieval-scoring-explanation-page": "Retrieval Scoring Explanation",
    "public-pilot-waitlist-gate-page": "Public Pilot Waitlist Gate",
    "source-edition-intake-page": "Source Edition Intake",
    "rights-review-desk-page": "Rights Review Desk",
    "reviewer-identity-lite-page": "Reviewer Identity Lite",
    "answer-promotion-rules-page": "Answer Promotion Rules",
    "pilot-invite-packet-page": "Pilot Invite Packet",
    "pilot-telemetry-consent-page": "Pilot Telemetry Consent",
    "pilot-learning-signal-review-page": "Pilot Learning Signal Review",
    "first-session-launch-spine-page": "First Session Launch Spine",
    "source-readiness-triage-page": "Source Readiness Triage",
    "answer-readiness-gate-page": "Answer Readiness Gate",
    "private-pilot-launch-console-page": "Private Pilot Launch Console",
    "pilot-feedback-intake-page": "Pilot Feedback Intake",
    "feedback-review-desk-page": "Feedback Review Desk",
    "pilot-user-session-script-page": "Pilot User Session Script",
    "launch-safety-checklist-page": "Launch Safety Checklist",
    "private-pilot-readiness-score-page": "Private Pilot Readiness Score",
    "pilot-invite-review-page": "Pilot Invite Review",
    "source-rights-approval-board-page": "Source Rights Approval Board",
    "pilot-session-export-packet-page": "Pilot Session Export Packet",
    "feedback-to-ticket-audit-trail-page": "Feedback-to-Ticket Audit Trail",
    "retrieval-adapter-shell-page": "First Real Retrieval Adapter Shell",
    "retrieval-fixture-adapter-page": "Retrieval Fixture Adapter",
    "source-candidate-ranking-contract-page": "Source Candidate Ranking Contract",
    "no-source-answer-behavior-page": "No-Source Answer Behavior",
    "citation-packet-renderer-page": "Citation Packet Renderer",
    "retrieval-qa-harness-page": "Retrieval QA Harness",
    "source-coverage-expansion-page": "Source Coverage Expansion",
    "source-family-coverage-map-page": "Source Family Coverage Map",
    "passage-dossier-builder-page": "Passage Dossier Builder",
    "reviewer-approval-workflow-page": "Reviewer Approval Workflow",
    "retrieval-to-answer-integration-gate-page": "Retrieval-to-Answer Integration Gate",
    "learner-answer-draft-review-page": "Learner Answer Draft Review",
    "answer-revision-workbench-page": "Answer Revision Workbench",
    "source-to-answer-trace-view-page": "Source-to-Answer Trace View",
    "audience-view-toggle-page": "Audience View Toggle",
    "launch-readiness-evidence-pack-page": "Launch Readiness Evidence Pack",
    "real-source-api-contract-page": "Real Source API Contract",
    "retrieval-service-boundary-page": "Retrieval Service Boundary",
    "mock-answer-generation-adapter-page": "Mock Answer Generation Adapter",
    "reviewer-approval-handoff-page": "Reviewer Approval Handoff",
    "private-launch-gate-page": "Private Launch Gate",
    "source-api-test-harness-page": "Source API Test Harness",
    "no-source-evaluation-suite-page": "No-Source Evaluation Suite",
    "source-candidate-fixture-runner-page": "Source Candidate Fixture Runner",
    "adapter-contract-tests-page": "Adapter Contract Tests",
    "private-demo-script-page": "Private Demo Script",
    "backend-prototype-decision-gate-page": "Backend Prototype Decision Gate",
    "source-api-stub-page": "Source API Stub",
    "retrieval-fixture-cli-page": "Retrieval Fixture CLI",
    "private-demo-session-ledger-page": "Private Demo Session Ledger",
    "backend-readiness-control-room-page": "Backend Readiness Control Room",
    "private-demo-backend-handoff-page": "Private Demo Backend Handoff",
    "local-api-adapter-fallback-page": "Local API Adapter Fallback",
    "source-packet-contract-tests-page": "Source Packet Contract Tests",
    "local-source-api-server-page": "Local Source API Server",
    "backend-spike-choice-page": "Backend Spike Choice",
    "backend-spike-review-gate-page": "Backend Spike Review Gate",
    "source-api-reliability-contract-page": "Source API Reliability Contract",
    "curated-source-registry-page": "Curated Source Registry",
    "integrated-ask-demo-page": "Integrated Ask Demo",
    "source-path-readiness-console-page": "Source Path Readiness Console",
    "private-demo-runbook-page": "Private Demo Runbook",
    "reviewer-observation-capture-page": "Reviewer Observation Capture",
    "rights-cleared-source-intake-page": "Rights-Cleared Source Intake",
    "security-privacy-review-page": "Security & Privacy Review",
    "hosted-backend-decision-gate-page": "Hosted Backend Decision Gate",
    "hosted-readonly-api-adapter-page": "Read-only Hosted API Adapter",
    "rate-limit-monitoring-contract-page": "Rate Limit & Privacy-Safe Monitoring",
    "reviewer-identity-role-prototype-page": "Reviewer Identity & Role Prototype",
    "rights-operations-queue-page": "Rights Operations Queue",
    "controlled-external-pilot-gate-page": "Controlled External Pilot Gate"
  };


  const extraLinks = [
    ["Fixture Adapter", "retrievalfixtureadapter.html"],
    ["Ranking Contract", "sourcecandidaterankingcontract.html"],
    ["No-Source", "nosourceanswerbehavior.html"],
    ["Citation Packet", "citationpacketrenderer.html"],
    ["QA Harness", "retrievalqaharness.html"],
    ["Coverage", "sourcecoverageexpansion.html"],
    ["Family Map", "sourcefamilycoveragemap.html"],
    ["Dossier", "passagedossierbuilder.html"],
    ["Approval Flow", "reviewerapprovalworkflow.html"],
    ["Answer Integration", "retrievaltoanswerintegrationgate.html"],
    ["Draft Review", "learneranswerdraftreview.html"],
    ["Revision", "answerrevisionworkbench.html"],
    ["Trace", "sourcetoanswertraceview.html"],
    ["Audience Views", "audienceviewtoggle.html"],
    ["Evidence Pack", "launchreadinessevidencepack.html"],
    ["Source API", "realsourceapicontract.html"],
    ["Retrieval Boundary", "retrievalserviceboundary.html"],
    ["Answer Adapter", "mockanswergenerationadapter.html"],
    ["Review Handoff", "reviewerapprovalhandoff.html"],
    ["Private Gate", "privatelaunchgate.html"],
    ["Source API Tests", "sourceapitestharness.html"],
    ["No-Source Eval", "nosourceevaluationsuite.html"],
    ["Fixture Runner", "sourcecandidatefixturerunner.html"],
    ["Adapter Tests", "adaptercontracttests.html"],
    ["Demo Script", "privatedemoscript.html"],
    ["Backend Gate", "backendprototypedecisiongate.html"],
    ["Source Stub", "sourceapistub.html"],
    ["Retrieval CLI", "retrievalfixturecli.html"],
    ["Demo Ledger", "privatedemosessionledger.html"],
    ["Backend Ready", "backendreadinesscontrolroom.html"],
    ["Backend Handoff", "privatedemobackendhandoff.html"],
    ["API Adapter", "localapiadapterfallback.html"],
    ["Packet Tests", "sourcepacketcontracttests.html"],
    ["Local API", "localsourceapiserver.html"],
    ["Backend Choice", "backendspikechoice.html"],
    ["Spike Review", "backendspikereviewgate.html"],
    ["API Reliability", "sourceapireliabilitycontract.html"],
    ["Source Registry", "curatedsourceregistry.html"],
    ["Ask Demo", "askdemo.html"],
    ["Path Readiness", "sourcepathreadinessconsole.html"],
    ["Demo Runbook", "privatedemorunbook.html"],
    ["Observations", "reviewerobservations.html"],
    ["Rights Intake", "rightsclearedsourceintake.html"],
    ["Security Review", "securityprivacyreview.html"],
    ["Hosted Gate", "hostedbackenddecisiongate.html"],
    ["Hosted API", "hostedreadonlyapiadapter.html"],
    ["Request Guard", "ratelimitprivacymonitoring.html"],
    ["Reviewer Roles", "revieweridentityroles.html"],
    ["Rights Queue", "rightsoperationsqueue.html"],
    ["Pilot Gate", "controlledexternalpilotgate.html"]
  ];

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function prefs() {
    return {
      pathMode: "Source",
      roleMode: "Founder",
      navSide: "left",
      ...safeParse(localStorage.getItem(prefKey) || "{}", {})
    };
  }

  function savePrefs(next) {
    localStorage.setItem(prefKey, JSON.stringify({ ...prefs(), ...next }));
  }

  function normalizePath(href) {
    const anchor = document.createElement("a");
    anchor.href = href;
    return anchor.pathname.replace(/\/index\.html$/, "/");
  }

  function pagePrefix() {
    const asset = document.querySelector('link[href*="assets/"], script[src*="assets/"], img[src*="assets/"]');
    const value = asset && (asset.getAttribute("href") || asset.getAttribute("src") || "");
    if (value && value.includes("assets/")) {
      return value.slice(0, value.indexOf("assets/"));
    }
    return "";
  }

  function siteHref(href) {
    const value = String(href || "#").trim();
    if (!value || /^(https?:|mailto:|tel:|#|data:)/.test(value)) return value || "#";
    if (value.startsWith("/")) return value;
    if (value.startsWith("../")) return value;

    const prefix = pagePrefix();
    const clean = value.replace(/^\.\//, "");
    return prefix ? prefix + clean : clean;
  }

  function activeLink(links) {
    const current = normalizePath(location.href);
    return links.find((link) => link.active) ||
      links.find((link) => normalizePath(link.href) === current) ||
      links[0];
  }

  function collectLinks(nav) {
    const links = Array.from(nav.querySelectorAll("a")).map((link) => ({
      label: link.textContent.trim(),
      href: siteHref(link.getAttribute("href") || "#"),
      active: link.classList.contains("active")
    })).filter((link) => link.label);
    const seen = new Set(links.map((link) => link.label));
    extraLinks.forEach(([label, href]) => {
      if (!seen.has(label)) {
        links.push({
          label,
          href: siteHref(href),
          active: normalizePath(siteHref(href)) === normalizePath(location.href)
        });
      }
    });
    return links;
  }

  function groupLinks(links) {
    const used = new Set();
    const sections = groups.map((group) => {
      const items = group.labels.map((label) => links.find((link) => link.label === label)).filter(Boolean);
      items.forEach((link) => used.add(link.label));
      return { title: group.title, items };
    }).filter((section) => section.items.length);
    const other = links.filter((link) => !used.has(link.label));
    if (other.length) sections.push({ title: "More", items: other });
    return sections;
  }

  function railHtml(brand, links) {
    const brandHref = brand && brand.getAttribute("href") ? siteHref(brand.getAttribute("href")) : siteHref("index.html#top");
    const brandImg = brand && brand.querySelector("img") ? brand.querySelector("img").getAttribute("src") : "assets/vedapath-3d-logo-concept.png";
    const brandTitle = brand && brand.querySelector("strong") ? brand.querySelector("strong").textContent.trim() : "VedaPath AI";
    const brandSub = brand && brand.querySelector("small") ? brand.querySelector("small").textContent.trim() : "Source-first learning companion";
    const sections = groupLinks(links).map((section) => {
      const body = section.items.map((link) => {
        const glyph = link.label.slice(0, 1).toUpperCase();
        const active = link.active ? " is-active" : "";
        return '<a class="vp-rail-link' + active + '" href="' + escapeHtml(link.href) + '">' +
          '<span class="vp-rail-glyph">' + escapeHtml(glyph) + '</span>' +
          '<span>' + escapeHtml(link.label) + '</span>' +
        '</a>';
      }).join("");
      return '<section class="vp-rail-section"><h2 class="vp-rail-section-title">' + escapeHtml(section.title) + '</h2><div class="vp-rail-list">' + body + '</div></section>';
    }).join("");
    return '<a class="vp-command-brand" href="' + escapeHtml(brandHref) + '" aria-label="VedaPath AI home">' +
      '<img src="' + escapeHtml(brandImg) + '" alt="VedaPath AI logo concept">' +
      '<div><strong>' + escapeHtml(brandTitle) + '</strong><span>' + escapeHtml(brandSub) + '</span></div>' +
      '</a>' +
      sections +
      '<div class="vp-rail-note"><span>VedaPath command shell</span><strong>Source first. Calm path.</strong></div>';
  }

  function topHtml(active, settings) {
    const bodyTitle = Object.keys(bodyPageTitles).find((name) => document.body.classList.contains(name));
    const title = bodyPageTitles[bodyTitle] || pageTitles[active.label] || document.title.replace(/^VedaPath\s*/i, "").trim() || "VedaPath room";
    return '<div class="vp-command-title">' +
      '<div class="vp-command-meta">' +
        '<span class="vp-command-eyebrow">VedaPath AI</span>' +
        '<span class="vp-command-context">Source-first companion</span>' +
        '<span class="vp-command-badge">' + releaseBadge + '</span>' +
        '<span class="vp-command-memory">Local preferences ready</span>' +
      '</div>' +
      '<h1>' + escapeHtml(title) + '</h1>' +
    '</div>' +
    '<div class="vp-command-controls" aria-label="Workspace preferences">' +
      '<label class="vp-control"><span>Path</span><select id="vpPathMode" aria-label="Path mode">' +
        '<option value="Source">Source</option><option value="Practice">Practice</option><option value="Build">Build</option>' +
      '</select></label>' +
      '<label class="vp-control"><span>View</span><select id="vpRoleMode" aria-label="Workspace view">' +
        '<option value="Founder">Founder</option><option value="Learner">Learner</option><option value="Reviewer">Reviewer</option>' +
      '</select></label>' +
      '<label class="vp-control"><span>Side</span><select id="vpNavSide" aria-label="Navigation side">' +
        '<option value="left">Left side</option><option value="right">Right side</option>' +
      '</select></label>' +
      '<label class="vp-control"><span>Action</span><button id="vpBackToTop" type="button">Top</button></label>' +
    '</div>';
  }

  function applySettings(settings) {
    document.body.classList.toggle("vp-nav-right", settings.navSide === "right");
    document.body.classList.toggle("vp-mode-study", settings.pathMode === "Source");
    document.body.classList.toggle("vp-mode-calm", settings.pathMode === "Practice");
    const path = document.getElementById("vpPathMode");
    const role = document.getElementById("vpRoleMode");
    const side = document.getElementById("vpNavSide");
    if (path) path.value = settings.pathMode;
    if (role) role.value = settings.roleMode;
    if (side) side.value = settings.navSide;
  }

  function init() {
    if (document.querySelector(".vp-command-rail")) return;
    const topbar = document.querySelector(".topbar, header.topbar");
    if (!topbar) return;
    const brand = topbar.querySelector(".brand");
    const nav = topbar.querySelector(".nav");
    if (!nav) return;
    const links = collectLinks(nav);
    if (!links.length) return;
    const active = activeLink(links);
    if (active) active.active = true;

    const rail = document.createElement("aside");
    rail.className = "vp-command-rail";
    rail.setAttribute("aria-label", "VedaPath side navigation");
    rail.innerHTML = railHtml(brand, links);
    document.body.insertBefore(rail, document.body.firstChild);

    const commandTop = document.createElement("div");
    commandTop.className = "vp-command-top";
    commandTop.innerHTML = topHtml(active, prefs());
    topbar.insertBefore(commandTop, topbar.firstChild);

    document.body.classList.add("vp-command-shell-ready");
    applySettings(prefs());

    document.getElementById("vpPathMode")?.addEventListener("change", (event) => {
      savePrefs({ pathMode: event.target.value });
      applySettings(prefs());
    });
    document.getElementById("vpRoleMode")?.addEventListener("change", (event) => {
      savePrefs({ roleMode: event.target.value });
      applySettings(prefs());
    });
    document.getElementById("vpNavSide")?.addEventListener("change", (event) => {
      savePrefs({ navSide: event.target.value });
      applySettings(prefs());
    });
    document.getElementById("vpBackToTop")?.addEventListener("click", () => {
      const target = document.getElementById("top") || document.body;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
