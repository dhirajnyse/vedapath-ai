import fs from "node:fs";
import path from "node:path";

const release = "v2.9.0";
const badge = `${release} frame polish`;

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

function appendFrameCss() {
  const file = "assets/vedapath-focus.css";
  let content = read(file);
  const start = "/* VEDAPATH FRAME ALIGNMENT POLISH START */";
  const end = "/* VEDAPATH FRAME ALIGNMENT POLISH END */";
  const block = `
${start}
:root {
  --vp-frame-top: 16px;
  --vp-header-height: 74px;
  --vp-after-header: 28px;
}

body .page,
body .shell,
body > main {
  padding-top: var(--vp-frame-top) !important;
}

body .topbar,
body header.topbar {
  box-sizing: border-box;
  height: var(--vp-header-height);
  min-height: var(--vp-header-height);
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

body .topbar + .home-intent,
body header.topbar + .home-intent,
body .topbar + .hero,
body header.topbar + .hero {
  margin-top: 0 !important;
  padding-top: var(--vp-after-header) !important;
}

body .topbar + .home-intent,
body header.topbar + .home-intent,
body .topbar + .hero,
body header.topbar + .hero {
  align-items: start !important;
}

body .topbar + .home-intent .intent-copy,
body header.topbar + .home-intent .intent-copy,
body .topbar + .hero > div:first-child,
body header.topbar + .hero > div:first-child {
  align-self: start !important;
  padding-top: 0 !important;
}

body .topbar + .hero h1:first-child,
body header.topbar + .hero h1:first-child,
body .topbar + .home-intent h1:first-child,
body header.topbar + .home-intent h1:first-child {
  margin-top: 0 !important;
}

body .topbar + section:not(.home-intent):not(.hero),
body header.topbar + section:not(.home-intent):not(.hero) {
  margin-top: 0 !important;
  padding-top: var(--vp-after-header) !important;
}

body .topbar + section:not(.home-intent):not(.hero) h1:first-child,
body header.topbar + section:not(.home-intent):not(.hero) h1:first-child {
  margin-top: 0 !important;
}

body .topbar + main.workspace,
body header.topbar + main.workspace {
  margin-top: var(--vp-after-header) !important;
  padding-top: 0 !important;
  border-top: 0 !important;
}

@media (max-width: 900px) {
  :root {
    --vp-header-height: auto;
    --vp-after-header: 22px;
  }

  body .topbar,
  body header.topbar {
    height: auto;
    min-height: 0;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }
}

@media (max-width: 560px) {
  :root {
    --vp-frame-top: 12px;
    --vp-after-header: 18px;
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
          <p>Frame Polish: removes page-to-page top drift by normalizing root padding, header height, and first-content spacing.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>68%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:68%"></div></div>
          <p>The shared frame now starts from one visual zero line across primary pages and room surfaces.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Founder review</strong>
          <p>Review the top frame alignment on Home, Build, Brand, Blueprint, and the main product rooms.</p>`)
    .replace(/<strong>Phase 254: Production Implementation and Licensed Audio<\/strong>/, "<strong>Phase 255: Production Implementation and Licensed Audio</strong>")
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Frame Alignment Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.8.9 Nav Alignment Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make every primary page begin from the same visual zero line.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for visual founder review</strong></div>`);

  const phase254 = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 254: Frame Alignment Polish</strong>
                <p>Normalizes page top padding, fixed desktop header height, header-to-hero gap, and room workspace starts so tabs no longer float at different levels.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;

  if (!content.includes("Phase 254: Frame Alignment Polish")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 255: Production Implementation and Licensed Audio<\/strong>/,
      `${phase254}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 255: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>Compare Home, Build, Brand, and Blueprint from the top of the viewport.</span></li>
              <li><span class="dot"></span><span>Confirm the logo block and tab row sit on one horizontal level.</span></li>
              <li><span class="dot"></span><span>Confirm the first hero/content block begins at the same distance after the header.</span></li>
              <li><span class="dot"></span><span>Hold new functional work until this frame feels settled.</span></li>
            </ul>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH FRAME POLISH START -->", "<!-- VEDAPATH FRAME POLISH END -->", `## ${release} Frame Alignment Polish

This design-only pass fixes the remaining top-frame drift called out in founder review.

- normalizes top padding for \`.page\`, \`.shell\`, and direct page \`main\` wrappers
- fixes desktop header height to one shared value
- removes extra page-specific header top and bottom padding
- gives Home, Build, Brand, Blueprint, and room pages the same first-content gap
- aligns first visible hero content instead of allowing vertical-centering drift
- keeps smaller screens flexible while preserving the same rhythm`, "<!-- VEDAPATH NAV POLISH START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH FRAME POLISH NOTES START -->", "<!-- VEDAPATH FRAME POLISH NOTES END -->", `## ${release} Frame Alignment Polish

Founder feedback: the primary nav looked closer, but each page still had uneven top empty areas and different tab heights relative to the hero bar.

Action taken:

- Added a final frame-alignment override to \`assets/vedapath-focus.css\`.
- Standardized page top padding across root page wrappers.
- Standardized desktop header height and removed page-specific header padding drift.
- Standardized the gap from header to hero/content across Home, Build, Brand, Blueprint, and room pages.
- Removed vertical-centering drift from Home, Brand, and Blueprint hero sections.
- Kept mobile flexible, where nav wrapping requires natural height.`, "<!-- VEDAPATH NAV POLISH NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH FRAME POLISH BLUEPRINT START -->", "<!-- VEDAPATH FRAME POLISH BLUEPRINT END -->", `### 273. Frame Alignment Polish

The product must feel like one place before deeper product work continues.

Rules:

- The top of every primary page begins at the same visual zero line.
- The header has one desktop height across Home, Build, Brand, Blueprint, and rooms.
- First content begins at one predictable distance after the header.
- Hero copy aligns to the top rhythm, not the image centerline.
- Active tabs do not change height, top offset, or page rhythm.
- Mobile can wrap, but it should wrap from the same calm system.`, "<!-- VEDAPATH NAV POLISH BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);
}

updateAllHtmlVersions();
appendFrameCss();
updateBuildStatus();
updateDocs();

console.log(`${release} frame alignment polish applied.`);
