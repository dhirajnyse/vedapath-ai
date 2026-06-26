import fs from "node:fs";
import path from "node:path";

const release = "v2.8.9";
const badge = `${release} nav polish`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, block, before) {
  const wrapped = `${start}\n${block.trimEnd()}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), wrapped);
  }
  const index = content.indexOf(before);
  if (index === -1) return `${content.trimEnd()}\n\n${wrapped}\n`;
  return `${content.slice(0, index)}${wrapped}\n\n${content.slice(index)}`;
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function updateAllHtmlVersions() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, updateVersionBadge(read(file)));
  }
  const brandFile = path.join("brand", "brand-board.html");
  write(brandFile, updateVersionBadge(read(brandFile)));
}

function appendNavCss() {
  const file = "assets/vedapath-focus.css";
  let content = read(file);
  const start = "/* VEDAPATH NAV ALIGNMENT POLISH START */";
  const end = "/* VEDAPATH NAV ALIGNMENT POLISH END */";
  const block = `
${start}
:root {
  --vp-nav-brand: 214px;
  --vp-nav-control: 38px;
  --vp-nav-gap: 6px;
}

body .topbar,
body header.topbar {
  display: grid;
  grid-template-columns: minmax(var(--vp-nav-brand), auto) minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  min-height: 74px;
  padding: 12px 0;
}

body .brand {
  align-self: center;
  min-width: var(--vp-nav-brand);
  height: 48px;
}

body .brand img {
  flex: 0 0 44px;
}

body .brand div {
  min-width: 0;
}

body .nav {
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--vp-nav-gap);
  max-width: none;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  line-height: 1;
  scrollbar-width: none;
}

body .nav::-webkit-scrollbar {
  display: none;
}

body .nav .link,
body .nav a,
body .nav .version {
  box-sizing: border-box;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: var(--vp-nav-control);
  min-height: var(--vp-nav-control);
  margin: 0;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0 11px;
  font-size: 13px;
  font-weight: 850;
  line-height: 1;
  vertical-align: middle;
  white-space: nowrap;
}

body .nav .link.active,
body .nav a.active {
  border-color: rgba(168, 62, 18, 0.3);
  background: rgba(255, 253, 248, 0.84);
  color: var(--vp-ochre, #a83e12);
}

body .nav .version {
  margin-left: 8px;
  border-color: rgba(168, 62, 18, 0.28);
  background: rgba(255, 253, 248, 0.9);
  color: var(--vp-ochre, #a83e12);
  padding: 0 14px;
}

@media (max-width: 900px) {
  body .topbar,
  body header.topbar {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  body .brand {
    min-width: 0;
  }

  body .nav {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: visible;
  }

  body .nav .version {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  body .nav .link,
  body .nav a,
  body .nav .version {
    height: 34px;
    min-height: 34px;
    padding: 0 10px;
    font-size: 12px;
  }
}
${end}`;

  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), block.trim());
  } else {
    content = `${content.trimEnd()}\n\n${block.trim()}\n`;
  }
  write(file, content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Nav Polish: aligns the shared header, logo block, primary tabs, and version badge across Home, Build, Brand, Blueprint, and product rooms.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>67%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:67%"></div></div>
          <p>The interface shell now has one shared navigation spine before the next functional build.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Functional build</strong>
          <p>Now that the shared header is aligned, the next build can move back into source data or retrieval.</p>`)
    .replace(/<strong>Phase 253: Production Implementation and Licensed Audio<\/strong>/, "<strong>Phase 254: Production Implementation and Licensed Audio</strong>")
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Nav Alignment Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.8.8 Focus Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make the shared header feel like one product system.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for founder review</strong></div>`);

  const phase253 = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 253: Header Alignment Polish</strong>
                <p>Forces one navigation baseline, pill height, brand block size, and responsive wrapping rule across Home, Build, Brand, Blueprint, and product rooms.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;

  if (!content.includes("Phase 253: Header Alignment Polish")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 254: Production Implementation and Licensed Audio<\/strong>/,
      `${phase253}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 254: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>Review Home, Build, Brand, and Blueprint header alignment together.</span></li>
              <li><span class="dot"></span><span>Keep the primary nav as one line on desktop when space allows.</span></li>
              <li><span class="dot"></span><span>Let mobile wrap cleanly without changing tab height.</span></li>
              <li><span class="dot"></span><span>Resume functional work only after the shared shell feels settled.</span></li>
            </ul>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH NAV POLISH START -->", "<!-- VEDAPATH NAV POLISH END -->", `## ${release} Nav Alignment Polish

This design-only pass fixes the shared header rhythm before the next functional build.

- aligns Home, Build, Brand, Blueprint, and product tabs on one baseline
- gives every nav item the same height, border model, and line-height
- keeps the version badge visually related without pulling the row off balance
- lets smaller screens wrap as a complete row instead of breaking page by page
- keeps the final override in \`assets/vedapath-focus.css\` so future pages inherit it`, "<!-- VEDAPATH FOCUS POLISH START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH NAV POLISH NOTES START -->", "<!-- VEDAPATH NAV POLISH NOTES END -->", `## ${release} Nav Alignment Polish

Founder feedback: Home, Build, Brand, and Blueprint still did not align cleanly with the other tabs.

Action taken:

- Added a final shared navigation override to \`assets/vedapath-focus.css\`.
- Standardized the header as a two-column brand/nav grid on desktop.
- Standardized all nav links and the version badge to one 38px control height.
- Removed page-specific nav drift by overriding inline link, active, and version styles.
- Added responsive wrapping at smaller widths while preserving the same control rhythm.`, "<!-- VEDAPATH FOCUS POLISH NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH NAV POLISH BLUEPRINT START -->", "<!-- VEDAPATH NAV POLISH BLUEPRINT END -->", `### 272. Header Alignment Polish

The app bar is part of trust. Primary navigation must look like one system before VedaPath adds deeper functional surfaces.

Rules:

- The brand block and nav row share the same vertical center.
- Home, Build, Brand, Blueprint, and product tabs use one control height.
- Active states change color and border, not geometry.
- The version badge is secondary and never changes the row baseline.
- Mobile wrapping is deliberate and consistent across every page.`, "<!-- VEDAPATH FOCUS POLISH BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);
}

updateAllHtmlVersions();
appendNavCss();
updateBuildStatus();
updateDocs();

console.log(`${release} navigation alignment polish applied.`);
