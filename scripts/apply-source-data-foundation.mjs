import fs from "node:fs";
import path from "node:path";

const release = "v2.9.1";
const badge = `${release} source data`;

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

const answerFoundation = {
  product: "VedaPath AI",
  release,
  status: "source answer foundation v1",
  warning: "Starter answer-record data only. It is not a canonical corpus, scholar endorsement, licensed translation display, therapy, ritual instruction, emergency support, or spiritual authority.",
  schema_version: "answer-record-v1",
  records: [
    {
      id: "answer-oppenheimer-gita-11-32",
      slug: "oppenheimer",
      question: "What scripture did Oppenheimer quote?",
      aliases: ["oppenheimer quote", "i am become death", "death quote", "gita 11.32"],
      source_record_id: "bg-11-32-time",
      source: "Bhagavad Gita 11.32",
      source_family: "Bhagavad Gita | Smriti",
      tradition_layer: "Mahabharata | Bhishma Parva",
      title: "Oppenheimer was quoting the Gita, not the four Vedas.",
      summary: "The famous line is associated with Bhagavad Gita 11.32. It is often called Vedic in popular culture, but the source is the Bhagavad Gita, a section of the Mahabharata usually classified as Smriti.",
      pramana: "Direct source",
      confidence: "High",
      meter: "direct",
      review_state: "preview-reviewed",
      rights_state: "citation-only plus paraphrase",
      readiness: "answer-preview-ready",
      caution: "Do not call it a direct Vedic quote.",
      source_note: "Useful for correcting category confusion with care.",
      boundary: "Do not flatten the Gita into the four Vedas, and do not turn a film reference into a full theological claim.",
      retrieval_terms: ["oppenheimer", "death", "gita", "11.32", "veda"],
      blocked_claims: ["Oppenheimer quoted the Rigveda directly.", "The quote proves the Vedas predicted nuclear weapons."],
      tabs: {
        source: [
          ["What the source says", "In the Gita's cosmic-form scene, Krishna identifies himself with world-transforming Time. Popular English renderings often use the famous death line, but the source category should be stated carefully."],
          ["Why this matters", "VedaPath should gently correct the category without shaming the user. The quote is not from the four Vedas, but it is connected to a wider Sanskrit philosophical world."]
        ],
        sanskrit: [
          ["Key term", "The key term usually discussed is kala, Time. A full Sanskrit layer should show script, transliteration, translation variants, and translator notes after review."],
          ["Prototype boundary", "This answer record is citation-and-paraphrase only until Sanskrit and translation display are reviewed."]
        ],
        views: [
          ["Philosophical reading", "The verse appears in a scene about cosmic form, duty, destruction, and time."],
          ["Popular culture reading", "Film and media references compress the context. VedaPath restores passage, chapter, and source family."]
        ],
        claim: [
          ["What the source says", "The line belongs to the Bhagavad Gita's cosmic-form scene."],
          ["What tradition says", "Traditional readings connect the passage to divine manifestation, time, and dharma."],
          ["Modern claim", "People often label it broadly as Vedic wisdom."],
          ["Boundary", "It is not directly from the four Vedas."]
        ]
      }
    },
    {
      id: "answer-gita-vs-veda",
      slug: "gita-veda",
      question: "Is the Bhagavad Gita part of the Vedas?",
      aliases: ["gita vs vedas", "is gita a veda", "bhagavad gita veda", "shruti smriti"],
      source_record_id: "gita-classification",
      source: "Mahabharata, Bhishma Parva",
      source_family: "Bhagavad Gita | Smriti",
      tradition_layer: "Itihasa context",
      title: "The Gita is not one of the four Vedas.",
      summary: "The Bhagavad Gita belongs to the Mahabharata and is usually classified as Smriti. It is deeply shaped by Upanishadic and Vedic ideas, but VedaPath should not label it as a Veda.",
      pramana: "Text classification",
      confidence: "High",
      meter: "scholarly",
      review_state: "preview-reviewed",
      rights_state: "classification-only",
      readiness: "answer-preview-ready",
      caution: "Influenced by Vedic thought does not mean textually Veda.",
      source_note: "High-value category correction for beginners.",
      boundary: "Do not erase the Shruti and Smriti distinction.",
      retrieval_terms: ["gita", "veda", "smriti", "shruti", "mahabharata"],
      blocked_claims: ["The Bhagavad Gita is the fifth Veda in the same textual sense as the four Vedas."],
      tabs: {
        source: [
          ["Classification", "The four Vedas are Rigveda, Samaveda, Yajurveda, and Atharvaveda. The Gita appears within the Mahabharata."],
          ["Clean answer", "A user-friendly response should say: not Veda, but philosophically connected."]
        ],
        sanskrit: [
          ["Shruti and Smriti", "Shruti means that which is heard. Smriti means remembered tradition. The Vedas are Shruti; the Gita is usually treated as Smriti."],
          ["Term hygiene", "This is where source labels prevent category confusion."]
        ],
        views: [
          ["Vedanta use", "Vedanta traditions treat the Gita as a central philosophical text, often alongside the Upanishads and Brahma Sutras."],
          ["Beginner path", "For many modern readers, the Gita is a better starting point than the Vedas, but it should still be labeled accurately."]
        ],
        claim: [
          ["What the source says", "The Gita is part of the Mahabharata."],
          ["What tradition says", "It is highly authoritative in many Hindu traditions."],
          ["Modern claim", "Some people casually call it Vedic."],
          ["Boundary", "Casual usage should not erase the Shruti and Smriti distinction."]
        ]
      }
    },
    {
      id: "answer-gayatri-rigveda-3-62-10",
      slug: "gayatri",
      question: "Explain the Gayatri mantra with source and caution.",
      aliases: ["gayatri mantra", "savitr mantra", "rigveda 3.62.10"],
      source_record_id: "rigveda-3-62-10-gayatri",
      source: "Rigveda 3.62.10",
      source_family: "Veda | Shruti",
      tradition_layer: "Vedic mantra",
      title: "The Gayatri mantra should be explained with reverence and source context.",
      summary: "The Gayatri mantra is associated with Rigveda 3.62.10 and is among the most revered Vedic mantras. A careful explanation should avoid reducing it to a slogan or making casual ritual claims.",
      pramana: "Direct source",
      confidence: "High",
      meter: "direct",
      review_state: "source-review",
      rights_state: "citation-only",
      readiness: "needs-mantra-review",
      caution: "Do not prescribe ritual use or flatten pronunciation tradition.",
      source_note: "Flagship Mantra Lens candidate after Sanskrit and recitation review.",
      boundary: "No ritual instruction, initiation advice, or pronunciation authority in this preview.",
      retrieval_terms: ["gayatri", "savitr", "rigveda", "mantra"],
      blocked_claims: ["A simple English slogan is a complete meaning of the mantra."],
      tabs: {
        source: [
          ["What the source is", "A famous Rigvedic mantra addressed to Savitr. A full Mantra Lens should include Sanskrit, transliteration, word-by-word meaning, meter, and recitation notes."],
          ["Careful framing", "Explain the broad meaning while respecting that recitation, initiation, and ritual context vary by tradition."]
        ],
        sanskrit: [
          ["Mantra Lens need", "This is a candidate for script, IAST, word split, chandas, devata, rishi, and audio later."],
          ["Prototype boundary", "The live Sanskrit layer should be sourced from verified text before release."]
        ],
        views: [
          ["Beginner reading", "Often explained as a meditation on divine illumination or awakening of understanding."],
          ["Traditional caution", "Different communities treat pronunciation and practice with specific rules."]
        ],
        claim: [
          ["What the source says", "It is a Vedic mantra in the Rigveda."],
          ["What tradition says", "It is revered in many Hindu practices."],
          ["Modern claim", "It is sometimes treated as a universal affirmation."],
          ["Boundary", "Do not erase ritual, recitation, and lineage context."]
        ]
      }
    },
    {
      id: "answer-quantum-claim-boundary",
      slug: "quantum",
      question: "Do the Vedas prove quantum physics?",
      aliases: ["quantum physics", "vedas prove science", "vedic science proof", "modern science claim"],
      source_record_id: "modern-claim-boundary",
      source: "No direct Vedic proof claim",
      source_family: "Modern claim | Cross-domain analogy",
      tradition_layer: "Claim checking",
      title: "No. Treat physics comparisons as analogies, not proof.",
      summary: "Vedic and Upanishadic texts explore reality, consciousness, order, and being. Modern physics comparisons can be interesting, but VedaPath should clearly mark them as analogies unless a specific source directly supports a claim.",
      pramana: "Modern analogy",
      confidence: "Medium",
      meter: "analogy",
      review_state: "boundary-reviewed",
      rights_state: "no-source-needed",
      readiness: "answer-preview-ready",
      caution: "Do not present analogy as scientific proof.",
      source_note: "Useful for preventing inflated claims.",
      boundary: "A comparison is not a proof. Require a precise passage and a precise modern claim.",
      retrieval_terms: ["quantum", "science", "physics", "proof", "analogy"],
      blocked_claims: ["The Vedas prove all modern science.", "A philosophical term equals a technical physics concept."],
      tabs: {
        source: [
          ["Textual basis", "Some passages invite philosophical reflection about reality, but that is not the same as a technical physics claim."],
          ["Clean answer", "The honest response is: interesting comparison, not proof."]
        ],
        sanskrit: [
          ["Term check", "Words like brahman, rta, and atman should not be translated as modern scientific terms without careful context."],
          ["Prototype boundary", "Future source views should show exactly which word or passage people are using for the comparison."]
        ],
        views: [
          ["Traditional view", "Classical interpretations usually focus on metaphysics, ritual, self, liberation, or cosmic order."],
          ["Modern view", "Modern readers may use physics metaphors, but those should be labeled as contemporary interpretation."]
        ],
        claim: [
          ["What the source says", "Texts discuss reality, order, consciousness, and ultimate principles in their own vocabulary."],
          ["What tradition says", "Interpretive traditions frame these ideas philosophically and spiritually."],
          ["Modern claim", "Some claim the Vedas predicted or proved quantum physics."],
          ["Boundary", "That claim overextends the source unless supported by a precise passage and careful argument."]
        ]
      }
    },
    {
      id: "answer-atman-brahman-context",
      slug: "atman",
      question: "What is the relationship between Atman and Brahman?",
      aliases: ["atman and brahman", "tat tvam asi", "self and brahman", "advaita dvaita"],
      source_record_id: "chandogya-6-8-7-identity",
      source: "Chandogya Upanishad 6.8.7 and related passages",
      source_family: "Upanishad | Shruti",
      tradition_layer: "Vedanta interpretation",
      title: "Atman and Brahman are central Upanishadic ideas, interpreted differently by traditions.",
      summary: "Many Upanishadic discussions explore the self, ultimate reality, and liberation. VedaPath should present the concept, cite passages, and show that Advaita, Vishishtadvaita, and Dvaita read the relationship differently.",
      pramana: "Traditional commentary",
      confidence: "Medium-high",
      meter: "commentary",
      review_state: "commentary-review",
      rights_state: "citation-only",
      readiness: "needs-commentary-lanes",
      caution: "Do not present one Vedanta school as the only Hindu view.",
      source_note: "Needs comparison lanes before simplified public use.",
      boundary: "Do not collapse complex metaphysics into self-help slogans.",
      retrieval_terms: ["atman", "brahman", "chandogya", "vedanta", "self"],
      blocked_claims: ["All Hindu schools explain Atman and Brahman identically."],
      tabs: {
        source: [
          ["Textual direction", "The Upanishads contain major passages about self and ultimate reality. A future source card should cite exact passages and translation variants."],
          ["Careful framing", "The relationship between Atman and Brahman is not explained identically across all traditions."]
        ],
        sanskrit: [
          ["Key terms", "Atman is often translated as self. Brahman is often translated as ultimate reality or absolute. Both need context-sensitive handling."],
          ["Term caution", "Simple English glosses help beginners but can hide philosophical depth."]
        ],
        views: [
          ["Advaita", "Often emphasizes non-duality of Atman and Brahman."],
          ["Vishishtadvaita and Dvaita", "Read the relationship with different accounts of self, God, and reality. Samvada Mode should compare them respectfully."]
        ],
        claim: [
          ["What the source says", "Upanishadic passages explore self and ultimate reality."],
          ["What tradition says", "Vedanta schools interpret the relationship in distinct ways."],
          ["Modern claim", "People may summarize it as everything is one."],
          ["Boundary", "That phrase can be too blunt and tradition-specific without context."]
        ]
      }
    },
    {
      id: "answer-steady-action-bg-2-48",
      slug: "steady-action",
      question: "How can I act calmly when results are uncertain?",
      aliases: ["steady action", "calm action", "results uncertain", "bhagavad gita 2.48"],
      source_record_id: "bg-2-48-steadiness",
      source: "Bhagavad Gita 2.48",
      source_family: "Bhagavad Gita | Smriti",
      tradition_layer: "Karma-yoga context",
      title: "Steady action begins with the work in front of you.",
      summary: "This source candidate supports a practical reflection on steadiness in action. VedaPath should use it as a careful prompt, not as a promise that results or feelings will become easy.",
      pramana: "Direct source candidate",
      confidence: "Medium-high",
      meter: "direct",
      review_state: "reviewed-preview",
      rights_state: "citation-only plus paraphrase",
      readiness: "answer-preview-ready",
      caution: "Do not promise serenity or guaranteed outcomes.",
      source_note: "Useful for calm path and practice flows.",
      boundary: "Reflection support only; not therapy, medical advice, or command language.",
      retrieval_terms: ["calm", "steady", "action", "result", "gita 2.48"],
      blocked_claims: ["The Gita guarantees peace if you detach from results."],
      tabs: {
        source: [
          ["What the source supports", "A careful reading can point toward steadiness in action and non-attachment to results."],
          ["Why this matters", "The user leaves with one grounded action instead of pressure to feel spiritually perfect."]
        ],
        sanskrit: [
          ["Future layer", "A later Sanskrit Lens should show key terms and translation variants after review."],
          ["Prototype boundary", "No direct translation display is included in this starter record."]
        ],
        views: [
          ["Practice view", "Choose one small duty and do it cleanly."],
          ["Boundary view", "Do not use the passage to dismiss grief, anxiety, structural pressure, or care needs."]
        ],
        claim: [
          ["What the source says", "The record supports reflection on steady action."],
          ["What tradition says", "Often connected with karma-yoga."],
          ["Modern claim", "People may use it as productivity advice."],
          ["Boundary", "It is not a productivity hack or clinical intervention."]
        ]
      }
    }
  ]
};

function writeAnswerFoundationData() {
  write("data/vedapath-source-answer-foundation.json", `${JSON.stringify(answerFoundation, null, 2)}\n`);
}

function writeSourceFoundationCss() {
  write("assets/vedapath-source-foundation.css", `/* VedaPath source answer foundation */
.source-foundation {
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.9);
}

.foundation-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 280px);
  gap: 14px;
  align-items: start;
}

.foundation-stats,
.foundation-tools,
.foundation-detail,
.foundation-packet-grid {
  display: grid;
  gap: 10px;
}

.foundation-stats {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.foundation-stat,
.foundation-record,
.foundation-detail,
.foundation-packet,
.foundation-empty {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.foundation-stat,
.foundation-empty {
  padding: 12px;
}

.foundation-stat span,
.foundation-detail span,
.foundation-record span,
.foundation-packet span,
.foundation-tools span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.foundation-stat strong {
  display: block;
  font-size: 22px;
  line-height: 1.1;
}

.foundation-tools {
  grid-template-columns: 1fr 1fr 1.4fr;
  margin: 14px 0;
}

.foundation-tools label {
  font-weight: 850;
}

.foundation-tools select,
.foundation-tools input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px 12px;
  font-weight: 800;
}

.foundation-layout {
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.15fr);
  gap: 14px;
  align-items: start;
}

.foundation-list {
  display: grid;
  gap: 8px;
}

.foundation-record {
  width: 100%;
  padding: 11px;
  color: inherit;
  text-align: left;
}

.foundation-record.active,
.foundation-record:hover,
.foundation-record:focus-visible {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.foundation-record strong,
.foundation-record span {
  display: block;
}

.foundation-detail {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 12px;
  border-left: 4px solid var(--bhagwa);
}

.foundation-detail .wide,
.foundation-packet.wide {
  grid-column: 1 / -1;
}

.foundation-detail strong {
  display: block;
}

.foundation-packet-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 12px;
}

.foundation-packet {
  padding: 12px;
}

.foundation-packet strong {
  display: block;
  margin-top: 4px;
}

.foundation-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

#foundationPacket {
  width: 100%;
  min-height: 180px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
}

.source-data-status {
  margin-top: 12px;
  border: 1px solid rgba(20, 92, 74, 0.18);
  border-radius: 8px;
  background: rgba(232, 240, 234, 0.52);
  color: var(--peacock-green, #145c4a);
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 850;
}

@media (max-width: 860px) {
  .foundation-head,
  .foundation-tools,
  .foundation-layout,
  .foundation-detail,
  .foundation-stats,
  .foundation-packet-grid {
    grid-template-columns: 1fr;
  }

  .foundation-actions .button {
    width: 100%;
  }
}
`);
}

function writeSourceFoundationJs() {
  write("assets/vedapath-source-foundation.js", `const foundationRoot = document.getElementById("sourceFoundation");

if (foundationRoot) {
  initSourceFoundation().catch((error) => {
    foundationRoot.innerHTML = '<p class="muted">Source answer records could not load.</p>';
    console.error(error);
  });
}

async function foundationLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function foundationText(value) {
  return value === 0 ? "0" : String(value || "");
}

function foundationSafe(value) {
  return foundationText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function foundationPacketText(record) {
  return [
    "VedaPath Source Answer Packet",
    "Record: " + record.id,
    "Question: " + record.question,
    "Answer title: " + record.title,
    "Source: " + record.source,
    "Source family: " + record.source_family,
    "Pramana: " + record.pramana,
    "Confidence: " + record.confidence,
    "Readiness: " + record.readiness,
    "Review state: " + record.review_state,
    "Rights state: " + record.rights_state,
    "Caution: " + record.caution,
    "Boundary: " + record.boundary,
    "Blocked claims: " + record.blocked_claims.join(" | "),
    "",
    "Summary:",
    record.summary,
    "",
    "Boundary: starter answer-record data; not canonical corpus coverage, scholar endorsement, licensed translation display, therapy, ritual instruction, emergency support, or spiritual authority."
  ].join("\\n");
}

async function initSourceFoundation() {
  const data = await foundationLoadJson("data/vedapath-source-answer-foundation.json");
  const records = data.records || [];
  const familyFilter = foundationRoot.querySelector("#foundationFamily");
  const readinessFilter = foundationRoot.querySelector("#foundationReadiness");
  const search = foundationRoot.querySelector("#foundationSearch");
  const stats = foundationRoot.querySelector("#foundationStats");
  const list = foundationRoot.querySelector("#foundationList");
  const detail = foundationRoot.querySelector("#foundationDetail");
  const packets = foundationRoot.querySelector("#foundationPackets");
  const packetText = foundationRoot.querySelector("#foundationPacket");
  const families = ["all", ...Array.from(new Set(records.map((record) => record.source_family)))];
  const readinesses = ["all", ...Array.from(new Set(records.map((record) => record.readiness)))];
  const state = { family: "all", readiness: "all", search: "", recordId: records[0] && records[0].id };

  familyFilter.innerHTML = families.map((item) => '<option value="' + foundationSafe(item) + '">' + foundationSafe(item) + '</option>').join("");
  readinessFilter.innerHTML = readinesses.map((item) => '<option value="' + foundationSafe(item) + '">' + foundationSafe(item) + '</option>').join("");

  function filteredRecords() {
    const term = state.search.trim().toLowerCase();
    return records.filter((record) => {
      const searchText = [
        record.question,
        record.title,
        record.summary,
        record.source,
        record.source_family,
        record.retrieval_terms.join(" "),
        record.aliases.join(" ")
      ].join(" ").toLowerCase();
      return (state.family === "all" || record.source_family === state.family)
        && (state.readiness === "all" || record.readiness === state.readiness)
        && (!term || searchText.includes(term));
    });
  }

  function selectedRecord() {
    const filtered = filteredRecords();
    return filtered.find((record) => record.id === state.recordId) || filtered[0] || records[0];
  }

  function renderStats(filtered) {
    const ready = records.filter((record) => record.readiness === "answer-preview-ready").length;
    const reviewed = records.filter((record) => record.review_state.includes("review")).length;
    stats.innerHTML = [
      ["Records", records.length],
      ["Visible", filtered.length],
      ["Preview-ready", ready],
      ["Review-linked", reviewed]
    ].map((row) => '<div class="foundation-stat"><span>' + foundationSafe(row[0]) + '</span><strong>' + foundationSafe(row[1]) + '</strong></div>').join("");
  }

  function renderList(record, filtered) {
    list.innerHTML = filtered.map((item) => (
      '<button class="foundation-record' + (item.id === record.id ? ' active' : '') + '" type="button" data-record-id="' + foundationSafe(item.id) + '">' +
        '<strong>' + foundationSafe(item.question) + '</strong>' +
        '<span>' + foundationSafe(item.source) + '</span>' +
        '<span>' + foundationSafe(item.source_family + " | " + item.readiness) + '</span>' +
      '</button>'
    )).join("") || '<article class="foundation-empty"><strong>No matching records</strong><p class="muted">Clear filters to see the first source-answer set.</p></article>';
  }

  function renderDetail(record) {
    detail.innerHTML = [
      ["Question", record.question, "wide"],
      ["Answer", record.title, "wide"],
      ["Source", record.source],
      ["Family", record.source_family],
      ["Pramana", record.pramana],
      ["Confidence", record.confidence],
      ["Readiness", record.readiness],
      ["Review", record.review_state],
      ["Rights", record.rights_state],
      ["Caution", record.caution],
      ["Summary", record.summary, "wide"],
      ["Boundary", record.boundary, "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + foundationSafe(row[0]) + '</span><strong>' + foundationSafe(row[1]) + '</strong></div>').join("");
  }

  function renderPackets(record) {
    const firstSource = record.tabs.source && record.tabs.source[0];
    const firstClaim = record.tabs.claim && record.tabs.claim[record.tabs.claim.length - 1];
    packets.innerHTML = [
      ["Source card", firstSource ? firstSource[1] : record.source_note],
      ["Boundary card", firstClaim ? firstClaim[1] : record.boundary],
      ["Blocked claims", record.blocked_claims.join(" | "), "wide"],
      ["Retrieval terms", record.retrieval_terms.join(" | "), "wide"]
    ].map((row) => '<article class="foundation-packet ' + (row[2] || "") + '"><span>' + foundationSafe(row[0]) + '</span><strong>' + foundationSafe(row[1]) + '</strong></article>').join("");
    packetText.value = foundationPacketText(record);
  }

  function render() {
    const filtered = filteredRecords();
    const record = selectedRecord();
    if (!record) return;
    state.recordId = record.id;
    familyFilter.value = state.family;
    readinessFilter.value = state.readiness;
    search.value = state.search;
    renderStats(filtered);
    renderList(record, filtered);
    renderDetail(record);
    renderPackets(record);
  }

  familyFilter.addEventListener("change", () => {
    state.family = familyFilter.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  readinessFilter.addEventListener("change", () => {
    state.readiness = readinessFilter.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  search.addEventListener("input", () => {
    state.search = search.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-record-id]");
    if (!button) return;
    state.recordId = button.dataset.recordId;
    render();
  });

  foundationRoot.querySelector("#copyFoundationPacket").addEventListener("click", () => {
    packetText.focus();
    packetText.select();
    const button = foundationRoot.querySelector("#copyFoundationPacket");
    const original = button.textContent;
    const copied = () => {
      button.textContent = "Copied Packet";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(packetText.value).then(copied).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      copied();
    } catch (error) {}
  });

  render();
}
`);
}

function writeSourceFoundationPage() {
  write("sourcefoundation.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Source Data Foundation</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-source-foundation.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Source data foundation</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Source Data Foundation workspace">
        <aside class="panel">
          <span class="eyebrow">Dataset v1</span>
          <h2>Answer Records</h2>
          <p class="muted">A first structured bridge from user questions to source cards, confidence, boundaries, and review state.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Question</strong><p>User wording and aliases.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Source</strong><p>Citation and family.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Caution and blocked claims.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Packet</strong><p>Reviewable answer handoff.</p></div></div>
          </div>
        </aside>

        <section class="panel">
          <div class="hero-grid">
            <div>
              <span class="eyebrow">Source answer foundation</span>
              <h1>Let answers come from records.</h1>
              <p class="muted">The first real answer dataset turns prototype examples into structured records the Ask page can read: question, source, source family, confidence, boundary, and review state.</p>
            </div>
            <div class="mark-stage"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath Source Data logo"></div>
          </div>

          <div class="source-block" aria-label="Release source card">
            <div><span class="source-meta">Release</span><span class="source-value">${release}</span></div>
            <div><span class="source-meta">Dataset</span><span class="source-value">data/vedapath-source-answer-foundation.json</span></div>
            <div><span class="source-meta">Record shape</span><span class="source-value">question + source + boundary + packet</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">Starter data, not canonical corpus or production retrieval.</span></div>
          </div>

          <section class="source-foundation" id="sourceFoundation" aria-label="Source answer foundation">
            <div class="foundation-head">
              <div>
                <span class="eyebrow">Readable JSON foundation</span>
                <h2>Source Answer Records</h2>
                <p class="muted">Reads <strong>data/vedapath-source-answer-foundation.json</strong>. These records power the current Ask examples and prepare the next retrieval build.</p>
              </div>
              <div id="foundationStats" class="foundation-stats" aria-live="polite"></div>
            </div>

            <div class="foundation-tools">
              <label><span>Family</span><select id="foundationFamily"></select></label>
              <label><span>Readiness</span><select id="foundationReadiness"></select></label>
              <label><span>Search</span><input id="foundationSearch" type="search" placeholder="question, source, claim"></label>
            </div>

            <div class="foundation-layout">
              <div id="foundationList" class="foundation-list" aria-label="Answer record list"></div>
              <div>
                <div id="foundationDetail" class="foundation-detail"></div>
                <div id="foundationPackets" class="foundation-packet-grid"></div>
                <div class="foundation-actions">
                  <button class="button primary" id="copyFoundationPacket" type="button">Copy Packet</button>
                  <a class="button safe" href="data/vedapath-source-answer-foundation.json">Open JSON</a>
                </div>
                <textarea id="foundationPacket" readonly aria-label="Source answer packet output"></textarea>
              </div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Functional phase</span>
          <h2 style="margin-top: 14px;">Foundation Pulse</h2>
          <p class="muted">The UI stays quiet. The product now starts reading from a structured answer dataset.</p>
          <div class="progress" aria-label="Source data foundation progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Records</span><strong>6</strong></div>
            <div class="metric"><span>Data file</span><strong>JSON</strong></div>
            <div class="metric"><span>Next</span><strong>Retrieval</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Data Boundary</h2>
            <p class="muted">This is source-answer seed data. It does not claim canonical coverage, final scholarship, licensed translation display, or production retrieval.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-source-foundation.js"></script>
  </body>
</html>
`);
}

function updateIndex() {
  let content = read("index.html");
  content = updateVersionBadge(content);
  content = content.replace("let answers = {", "const answers = {");
  content = content.replace("const answers = {", "let answers = {");

  if (!content.includes(".source-data-status")) {
    content = content.replace(
      `      .answer-header {`,
      `      .source-data-status {
        margin-top: 12px;
        border: 1px solid rgba(20, 92, 74, 0.18);
        border-radius: 8px;
        background: rgba(232, 240, 234, 0.52);
        color: var(--peacock-green);
        padding: 10px 12px;
        font-size: 13px;
        font-weight: 850;
      }

      .answer-header {`
    );
  }

  if (!content.includes('id="sourceDataStatus"')) {
    content = content.replace(
      /          <\/div>\s*<\/aside>/,
      `          </div>
          <div class="source-data-status" id="sourceDataStatus">Source data foundation loading...</div>
        </aside>`
    );
  }

  if (!content.includes('href="sourcefoundation.html"')) {
    content = content.replace(
      '<a href="sourcelibrary.html">Sources <span>library</span></a>',
      '<a href="sourcelibrary.html">Sources <span>library</span></a>\n              <a href="sourcefoundation.html">Source data <span>records</span></a>'
    );
  }

  const bridgeStart = "      // VEDAPATH SOURCE DATA FOUNDATION START";
  const bridgeEnd = "      // VEDAPATH SOURCE DATA FOUNDATION END";
  const bridge = `${bridgeStart}
      let foundationRecords = [];

      function answerFromFoundationRecord(record) {
        return {
          question: record.question,
          title: record.title,
          summary: record.summary,
          family: record.source_family,
          citation: record.source,
          pramana: record.pramana,
          confidence: record.confidence,
          caution: record.caution,
          meter: record.meter,
          tabs: record.tabs
        };
      }

      function updateSourceDataStatus(message) {
        const status = document.querySelector("#sourceDataStatus");
        if (status) status.textContent = message;
      }

      async function loadSourceFoundation() {
        try {
          const response = await fetch("data/vedapath-source-answer-foundation.json");
          if (!response.ok) throw new Error("source data unavailable");
          const dataset = await response.json();
          foundationRecords = dataset.records || [];
          foundationRecords.forEach((record) => {
            answers[record.slug] = answerFromFoundationRecord(record);
          });
          updateSourceDataStatus("Source data foundation active: " + foundationRecords.length + " answer records loaded.");
          renderAnswer(currentKey);
        } catch (error) {
          updateSourceDataStatus("Source data foundation offline; using bundled preview answers.");
        }
      }
${bridgeEnd}`;

  if (content.includes(bridgeStart)) {
    content = content.replace(new RegExp(`${escapeRegex(bridgeStart)}[\\s\\S]*?${escapeRegex(bridgeEnd)}`), bridge);
  } else {
    content = content.replace("      const questionInput = document.querySelector(\"#questionInput\");", `${bridge}\n\n      const questionInput = document.querySelector("#questionInput");`);
  }

  if (!content.includes("const datasetMatch = foundationRecords.find")) {
    content = content.replace(
      "        const normalized = text.toLowerCase();\n",
      `        const normalized = text.toLowerCase();
        const datasetMatch = foundationRecords.find((record) => [record.question, record.title, ...(record.aliases || []), ...(record.retrieval_terms || [])]
          .some((term) => normalized.includes(String(term).toLowerCase())));
        if (datasetMatch) return datasetMatch.slug;
`
    );
  }

  if (!content.includes("loadSourceFoundation();")) {
    content = content.replace(
      /      reviewButton\.addEventListener\("click", \(\) => \{[\s\S]*?      \}\);\s*    <\/script>/,
      (match) => match.replace("      });\n    </script>", "      });\n\n      loadSourceFoundation();\n    </script>")
    );
  }

  write("index.html", content);
}

function updateBuildStatus() {
  let content = updateVersionBadge(read("build-status.html"));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Source Data Foundation: first structured answer records now power the Ask examples and prepare real retrieval.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>69%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:69%"></div></div>
          <p>The first question-to-source answer dataset is in place. Next: retrieval over records, review states, and no-source fallbacks.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Retrieval foundation</strong>
          <p>Use these source-answer records to build static retrieval and no-result handling.</p>`)
    .replace(/<strong>Phase 255: Production Implementation and Licensed Audio<\/strong>/, "<strong>Phase 256: Production Implementation and Licensed Audio</strong>")
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Source Data Foundation</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.0 Frame Alignment Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Move from prototype answers to structured source-answer data.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for retrieval foundation</strong></div>`);

  const phase255 = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 255: Source Data Foundation</strong>
                <p>Adds source-answer JSON records, a source data explorer, and an Ask-page loader so answers come from structured source packets.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;

  if (!content.includes("Phase 255: Source Data Foundation")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 256: Production Implementation and Licensed Audio<\/strong>/,
      `${phase255}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 256: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>Use answer records for the first static retrieval pass.</span></li>
              <li><span class="dot"></span><span>Add no-source and reviewer-needed fallbacks.</span></li>
              <li><span class="dot"></span><span>Connect source records to answer records by stable ids.</span></li>
              <li><span class="dot"></span><span>Keep UI calm while the knowledge layer becomes real.</span></li>
            </ul>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH SOURCE DATA FOUNDATION START -->", "<!-- VEDAPATH SOURCE DATA FOUNDATION END -->", `## ${release} Source Data Foundation

This functional release adds the first structured answer-record dataset.

- adds \`data/vedapath-source-answer-foundation.json\`
- adds \`sourcefoundation.html\` as a focused data explorer
- lets the Home Ask flow load answer examples from JSON
- keeps citations, source family, confidence, rights state, review state, and boundaries together
- prepares the next retrieval build without disturbing the polished UI shell`, "<!-- VEDAPATH FRAME POLISH START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH SOURCE DATA FOUNDATION NOTES START -->", "<!-- VEDAPATH SOURCE DATA FOUNDATION NOTES END -->", `## ${release} Source Data Foundation

After the UI alignment pass, the next phase moves from visual polish to product substance.

Action taken:

- Added the first source-answer JSON dataset.
- Added a source data foundation page with family, readiness, and search controls.
- Updated the Home Ask page to fetch the dataset and merge records into the answer renderer.
- Preserved fallback answers if the static JSON cannot load.
- Updated Build Status and roadmap notes for the retrieval-ready path.`, "<!-- VEDAPATH FRAME POLISH NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH SOURCE DATA FOUNDATION BLUEPRINT START -->", "<!-- VEDAPATH SOURCE DATA FOUNDATION BLUEPRINT END -->", `### 274. Source Data Foundation

VedaPath should answer from records before it answers from a model.

Rules:

- Every answer record starts with a user question and source candidate.
- Citation, source family, pramana level, confidence, rights state, and review state stay together.
- Boundaries and blocked claims are part of the answer packet, not afterthoughts.
- The Ask page may render records, but it must fall back calmly if data is unavailable.
- Next retrieval work should search records before composing answers.`, "<!-- VEDAPATH FRAME POLISH BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/SOURCE_DATA_FOUNDATION.md", `# VedaPath AI Source Data Foundation

Release: ${release}

This release adds the first structured source-answer dataset for VedaPath AI.

## Files

- \`data/vedapath-source-answer-foundation.json\`
- \`sourcefoundation.html\`
- \`assets/vedapath-source-foundation.css\`
- \`assets/vedapath-source-foundation.js\`

## Record Shape

Each record keeps these fields together:

- user question and aliases
- source citation
- source family
- pramana level
- confidence
- review state
- rights state
- answer caution
- blocked claims
- answer packet sections

## Boundary

This is starter source-answer data, not a canonical corpus, scholar endorsement, licensed translation display, therapy, ritual instruction, emergency support, or spiritual authority.
`);
}

writeAnswerFoundationData();
writeSourceFoundationCss();
writeSourceFoundationJs();
writeSourceFoundationPage();
updateAllHtmlVersions();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} source data foundation applied.`);
