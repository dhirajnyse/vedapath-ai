(function () {
  const releaseBadge = "v3.6.8 draft";
  const prefKey = "vedapathCommandShellPrefs";
  const groups = [
    { title: "Start", labels: ["Home", "Build", "Brand", "Blueprint"] },
    { title: "Source", labels: ["Answers", "Review", "Mantra"] },
    { title: "Practice", labels: ["Life", "Talk", "Pattern", "Daily"] }
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
    Daily: "Daily calm loop"
  };
  const bodyPageTitles = {
    "permission-execution-draft-page": "Controlled draft gate",
    "permission-execution-draft-review-page": "Controlled draft review gate",
    "review-decision-page": "Controlled review decision gate",
    "permission-execution-decision-page": "Founder decision gate"
  };

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

  function activeLink(links) {
    const current = normalizePath(location.href);
    return links.find((link) => link.active) ||
      links.find((link) => normalizePath(link.href) === current) ||
      links[0];
  }

  function collectLinks(nav) {
    return Array.from(nav.querySelectorAll("a")).map((link) => ({
      label: link.textContent.trim(),
      href: link.getAttribute("href") || "#",
      active: link.classList.contains("active")
    })).filter((link) => link.label);
  }

  function groupLinks(links) {
    const used = new Set();
    const sections = groups.map((group) => {
      const items = links.filter((link) => {
        const match = group.labels.includes(link.label);
        if (match) used.add(link.label);
        return match;
      });
      return { title: group.title, items };
    }).filter((section) => section.items.length);
    const other = links.filter((link) => !used.has(link.label));
    if (other.length) sections.push({ title: "More", items: other });
    return sections;
  }

  function railHtml(brand, links) {
    const brandHref = brand && brand.getAttribute("href") ? brand.getAttribute("href") : "index.html#top";
    const brandImg = brand && brand.querySelector("img") ? brand.querySelector("img").getAttribute("src") : "assets/vedapath-3d-logo-concept.png";
    const brandTitle = brand && brand.querySelector("strong") ? brand.querySelector("strong").textContent.trim() : "VedaPath AI";
    const brandSub = brand && brand.querySelector("span") ? brand.querySelector("span").textContent.trim() : "Source-first learning companion";
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
      '<div class="vp-rail-note"><span>Local command shell</span><strong>Source first. Calm path.</strong></div>';
  }

  function topHtml(active, settings) {
    const bodyTitle = Object.keys(bodyPageTitles).find((name) => document.body.classList.contains(name));
    const title = bodyPageTitles[bodyTitle] || pageTitles[active.label] || document.title.replace(/^VedaPath\s*/i, "").trim() || "VedaPath room";
    return '<div class="vp-command-title">' +
      '<div class="vp-command-meta">' +
        '<span class="vp-command-eyebrow">Source-first companion</span>' +
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
