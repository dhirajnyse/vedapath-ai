# VedaPath AI Product Blueprint

## Positioning

VedaPath AI is a calm, source-backed learning companion for Vedic and Hindu philosophical texts.

It helps users move from curiosity to understanding through:

- source-cited answers
- clear text classification
- Sanskrit and translation layers
- multiple interpretation views
- guided learning paths
- source-backed calm and practice flows
- searchable source library
- source seeds with review gates and missing production fields
- retrieval lab with source stack, match reason, and no-source refusal
- passage review pack with allowed use, restricted use, review decisions, and evaluation checks
- evaluation runner with answer quality gates
- evaluation dashboard with answer suite, blocked examples, and reviewer export
- reviewer queue with failed examples, flagged passages, correction notes, and local decisions
- consent gate with visible purpose, scope, consent, deletion, source trace, and review route before durable memory
- memory gate with local draft, review, Trust Ledger, and blocked routes before durable storage
- production trust model for source, consent, memory, review, ledger, and calm-pattern records
- calm passport with user-visible memory controls, export, deletion, and blocked fields
- backend schema draft with seven trust tables, relationships, migration order, and no-go rules
- schema fixtures with sample rows, validation checks, export shape, deletion lifecycle, and no-go tests
- evaluation drill room with answer checks, fixture checks, no-go cases, release decisions, and founder briefs
- learning loop seed with repeated questions, reviewer decisions, source gaps, and no hidden profiling
- Sanskrit lens seed with text, transliteration, word sense, meter status, and recitation boundaries
- source path builder with explicit user intention
- calm compass for one source-backed next action
- calm card studio for shareable source-backed reflections
- sankalpa studio for source-backed 24-hour intention setting
- seva planner for turning calm into bounded helpful action
- calm rhythm for private pattern reading and next-room routing
- user and scholar correction loops

## What It Is

- A study assistant
- A citation-first scripture explorer
- A Sanskrit and concept explainer
- A bridge between modern questions and traditional sources
- A learning system that improves through reviewed feedback

## What It Is Not

- Not a digital guru
- Not an oracle
- Not a fortune teller
- Not a ritual authority
- Not a replacement for teachers, priests, scholars, or tradition
- Not a tool for making inflated claims like "the Vedas prove all modern science"

## Core User Promise

Ask a question. Get a grounded answer with source, context, confidence, and careful boundaries.

## First Audience

1. Indian and diaspora youth who want to understand their tradition without feeling judged.
2. Sanskrit and philosophy learners.
3. Yoga, meditation, and spirituality audiences seeking source-level context.
4. Teachers, writers, and creators who need accurate citations.
5. Global users who discover Indian texts through films, quotes, and culture.

## Scope Model

VedaPath can cover a broad Hindu wisdom landscape, but every answer must label the source category.

Source labels:

- Veda
- Upanishad
- Bhagavad Gita
- Itihasa
- Purana
- Vedanta commentary
- Modern interpretation
- Academic scholarship
- Unsourced or uncertain

Example:

User asks: "What Veda quote did Oppenheimer use?"

VedaPath should answer:

"The line is commonly associated with the Bhagavad Gita, chapter 11, verse 32, not directly with the four Vedas. The Bhagavad Gita belongs to the Mahabharata and is usually classified as Smriti, though it carries strong Upanishadic and Vedic philosophical influence."

## Answer Anatomy

Every serious answer should include:

- Short direct answer
- Source classification
- Primary citation
- Plain explanation
- Optional deeper view
- Confidence level
- What not to overclaim

## Signature Features

### 1. Source-Cited Q&A

Answers are grounded in a known text, passage, translation, or commentary. If there is no reliable source, the app says so.

### 2. Pramana Meter

A confidence and authority label for every answer:

- Direct Source
- Traditional Commentary
- Scholarly View
- Modern Analogy
- Speculative
- Insufficient Source

### 3. Mantra Lens

A verse-level view showing:

- Sanskrit text
- Devanagari when available
- IAST/transliteration
- word-by-word meaning
- sandhi split where possible
- meter/chandas when known
- rishi, devata, and context when known
- translations side by side
- chant/audio where licensed

### 4. Claim Checker

Separates textual basis from modern enthusiasm.

Panels:

- What the source says
- What tradition says
- What modern people claim
- Where the claim becomes overextended

### 5. Samvada Mode

Compare interpretations without forcing a false single answer:

- Advaita
- Vishishtadvaita
- Dvaita
- Mimamsa or ritualist view
- academic or philological view
- devotional reading where relevant

### 6. Living Learning Path

The app remembers, with permission, the user's learning level and recurring confusion.

Examples:

- Beginner path
- Sanskrit learner path
- Gita path
- Upanishad path
- Vedic structure path
- Concepts path: dharma, karma, atman, brahman, rta, yajna

### 7. Community Correction Pipeline

User corrections never directly rewrite the knowledge base.

Flow:

User suggestion -> AI pre-check -> reviewer queue -> scholar or moderator review -> accepted annotation -> version history

### 8. Calm Path And Source Practice

A bounded reflection mode for everyday steadiness:

- choose a state
- show a source candidate and source family
- separate reflection from prescription
- guide a short Arrive, Read, Reflect, Carry practice
- save only deliberate practice history with consent

This feature must never become therapy, medical advice, emergency support, ritual instruction, or a guru voice.

### 9. Source Library

A curated source-card library can power Q&A, calm reflection, mantra study, claim checking, practice, and retrieval.

Every record should include:

- citation
- text family
- source status
- use tags
- confidence or pramana level
- boundary and overclaim warning
- reviewer metadata before production

The library should make it easy to find a source before asking the AI for an answer.

### 10. Source Seeds

Source Seeds turns prototype citations into structured records before retrieval begins.

It should:

- show canonical citation, source family, use tags, pramana level, and boundary
- make missing production fields visible
- support a local review queue for prototype planning
- copy a source-schema JSON handoff
- send a selected seed to Source Library without losing context
- avoid pretending that prototype citations are verified production data

Every seed should clearly distinguish "candidate", "reviewed", and "accepted" status before it can answer users.

### 11. Retrieval Lab

Retrieval Lab makes the answer pipeline visible.

It should:

- search source seeds before answering
- show the primary source and supporting source stack
- explain why a source matched the question
- label confidence and pramana level
- show the boundary before the answer is trusted
- refuse unsupported claims as source gaps
- queue review items instead of silently accepting user feedback

### 12. Passage Review Pack

Passage Review Pack makes answer authority visible before a source powers production retrieval.

It should:

- show citation, source family, and review status
- show a prototype meaning capsule without pretending it is a final translation
- state allowed use and restricted use
- expose missing production fields
- show review decisions and evaluation checks
- hand the selected passage back to Retrieval Lab or the best product room
- avoid pretending prototype passage dossiers are final scholarship

### 13. Evaluation Runner

Evaluation Runner checks answer drafts before they reach a user.

It should:

- require visible citation and source-family label
- require a boundary or anti-overclaim line
- catch source-family confusion, especially Oppenheimer and Gita versus Veda
- catch modern proof claims such as "the Vedas prove quantum physics"
- catch unsafe calm, therapy, medical, or diagnosis language
- catch ritual authority or lineage prescription
- produce pass, revision, or hold status
- copy an evaluation report for review

### 14. Evaluation Dashboard

Evaluation Dashboard turns answer checks into a release gate.

It should:

- run a deterministic suite of answer drafts
- compare expected versus actual evaluator behavior
- show pass, revision, and hold counts
- expose blocked examples for source-family confusion, unsafe calm advice, ritual authority, and overclaiming
- show reviewer-ready export text
- make launch trust visible without cluttering the main Ask workspace

The dashboard should never imply that passing prototype checks means scholarship, source licensing, safety policy, or production monitoring is complete.

### 15. Reviewer Queue

Reviewer Queue turns product mistakes into visible human-review work.

It should:

- receive failed Evaluation Dashboard examples
- receive flagged Passage Review Pack decisions
- receive Retrieval Lab source gaps
- receive user correction notes
- preserve source family, citation, issue type, risk, and recommended reviewer
- allow local prototype decisions without silently changing accepted knowledge
- copy a reviewer brief for handoff
- keep review memory local until accounts, reviewer identity, and source policy exist

The queue should never pretend that a local decision is final scholarship, source licensing approval, safety approval, moderation policy, or production governance.

### 16. Source Policy Console

Source Policy Console makes answer rules visible before the AI speaks.

It should:

- classify whether the product should answer, answer with boundary, ask for source, route to review, or decline/defer
- separate direct source questions, category confusion, modern analogy, ritual authority, personal distress, and unverified quotes
- show source family, pramana level, risk type, and next path
- let policy mode change language without hiding the underlying boundary
- copy a policy brief for reviewers and future backend rules
- route uncertain policy decisions back to Reviewer Queue

The console should never imply that a prototype rule is final theology, law, medical advice, emergency support, moderation policy, or scholarly approval.

### 17. Trust Ledger

Trust Ledger turns policy routes and reviewer queue outcomes into visible governance records.

It should:

- preserve source family, risk type, policy route, evidence path, and reviewer need
- show whether a rule is ready, held for review, blocked, or still draft
- keep local prototype decisions visible before accepted behavior changes
- copy a governance brief for backend rules, review sessions, and launch audits
- link future records to source seeds, passage dossiers, evaluator fixtures, and answer policy

The ledger should never pretend that local prototype status is final scholarship, source licensing approval, legal advice, safety approval, moderation policy, or production governance.

### 18. Life Map

Life Map routes real-life moments to source-backed calm without pretending to solve the user's life.

It should:

- begin from an explicit life domain such as work, family, money, health, digital noise, or sleep
- show one source candidate, source family, pramana level, and boundary
- offer one reflection prompt and one carry action
- route the user to the next useful VedaPath room
- keep prototype memory browser-local until accounts, consent, export controls, and deletion controls exist

Life Map should never become therapy, financial advice, medical advice, legal advice, relationship instruction, ritual authority, hidden profiling, or a spiritual command.

### 19. Calm Circle

Calm Circle routes shared moments to source-backed calm without pretending to mediate or judge the group.

It should:

- begin from an explicit circle type such as family, team, friendship, or inner conflict
- show one source candidate, source family, pramana level, and boundary
- ask one shared question and suggest one small agreement
- preserve what needs to be heard and what the user can try to hear
- keep prototype memory browser-local until participant consent, deletion controls, export controls, and shared-record governance exist

Calm Circle should never become mediation, therapy, relationship counseling, workplace advice, legal advice, unsafe-contact advice, hidden relationship profiling, or a spiritual verdict.

### 20. Consent Gate

Consent Gate makes shared or knowledge-changing product records visible before they become durable memory.

It should:

- begin from an explicit record type such as Calm Circle, Life Map, Reviewer Queue, or Source Dataset
- require purpose, consent, scope, source trace, deletion path, and review route checks
- separate allowed use from blocked use
- preserve source candidate, source family, governance level, and boundary
- keep prototype memory browser-local until accounts, consent records, privacy controls, audit history, and deletion controls exist

Consent Gate should never become legal advice, compliance certification, therapy, mediation, relationship counseling, permission pressure, hidden profiling, or a way to make private conflict searchable.

### 21. Memory Gate

Memory Gate enforces whether an incoming VedaPath record can stay local, route to review, enter Trust Ledger, or remain blocked.

It should:

- begin from an explicit record type such as Calm Circle, Life Map, Reviewer Correction, or Source Dataset
- check purpose, consent proof, source trace, deletion path, review route, and audit event
- show a visible route verdict before any durable memory
- block records missing consent, source trace, or deletion path
- keep prototype route memory browser-local until production storage, identity, export, deletion, and audit controls exist

Memory Gate should never become legal advice, compliance certification, therapy, mediation, a hidden scoring system, or a reason to collect more data.

### 22. Trust Model

Trust Model turns VedaPath's trust rooms into the first production data architecture.

It should:

- connect Source Seeds, Consent Gate, Memory Gate, Reviewer Queue, Trust Ledger, and Calm Rhythm
- define core entities such as source_seed, consent_grant, memory_route, review_decision, trust_event, and calm_pattern
- show required fields before durable backend memory exists
- separate deliberate user-owned calm patterns from inferred profiling
- make export, deletion, withdrawal, review, and audit paths first-class product controls
- provide a copyable schema preview for backend planning

Trust Model should never become a production database by itself, legal certification, hidden profiling, a reason to collect more data, or an automated authority system.

### 23. Calm Passport

Calm Passport turns the trust model into a user-owned memory control surface.

It should:

- show what VedaPath may remember for each record type
- show what VedaPath must not remember
- make export, deletion, withdrawal, review, and local-only state visible
- separate daily calm patterns, source shelves, shared circle notes, reviewer corrections, account profile settings, and distress boundaries
- keep saved passport grants browser-local until production account consent exists
- make hidden profiling feel impossible rather than merely discouraged

Calm Passport should never become a privacy policy, legal advice, therapy record, production identity system, hidden score, or reason to collect more personal data.

### 24. Backend Schema Draft

Backend Schema Draft turns the trust model and calm passport into a visible backend contract before durable storage exists.

It should:

- define source_seed, consent_grant, memory_route, review_decision, trust_event, calm_pattern, and passport_grant
- show required fields, owners, retention stance, relationships, and risk gates
- make source trace, consent, export, deletion, withdrawal, review, and audit paths first-class
- provide copyable schema and migration handoffs for backend planning
- block hidden profile tables, distress archives, and memory without deletion controls
- stay a draft until production storage, authentication, tests, and privacy review exist

Backend Schema Draft should never become a production database by itself, hidden profiling system, legal compliance claim, therapy record, or excuse to collect more personal data.

### 25. Schema Fixture Lab

Schema Fixture Lab proves the backend schema with concrete sample rows and validation behavior.

It should:

- show valid fixture rows for source_seed, consent_grant, memory_route, review_decision, trust_event, calm_pattern, and passport_grant
- show intentionally rejected no-go fixtures for hidden profiles, distress archives, missing deletion paths, and source changes without review
- provide copyable fixture payloads, validation reports, and no-go test reports
- explain export shape and deletion lifecycle before production storage exists
- make blocked fixtures feel like successful trust behavior, not product failure
- preserve the source-first interface while backend safety becomes testable underneath

Schema Fixture Lab should never become production data, hidden profiling, legal compliance certification, therapy recordkeeping, or a reason to store distress content.

### 26. Evaluation Drill Room

Evaluation Drill Room makes launch safety visible before a feature is treated as ready.

It should:

- combine answer quality checks, backend fixture checks, and no-go behavior in one view
- show ship-safe, needs-review, and blocked-safely decisions without mystery scoring
- include scenarios for Oppenheimer quote correction, calm action boundaries, source revision, hidden profile rejection, and modern science overclaims
- provide copyable release briefs and reviewer queue handoffs
- preserve the calm product surface while exposing the release gate underneath
- treat blocked unsafe behavior as a successful trust result

Evaluation Drill Room should never become hidden product scoring, user profiling, or a way to bypass human review. It should make launch judgment clearer, slower, and easier to audit.

### 27. Learning Loop Seed

Learning Loop Seed lets VedaPath improve from use without turning people into profiles.

It should:

- learn from repeated question clusters, source gaps, reviewer decisions, and no-go cases
- show what the product is allowed to learn and what it must not learn
- route source behavior changes through reviewer decisions before promotion
- make Sanskrit and source gaps visible as backlog items
- produce copyable learning briefs and learning-boundary handoffs
- separate product improvement from user memory, belief inference, distress retention, lineage inference, and private identity

Learning Loop Seed should never become hidden profiling, product analytics disguised as wisdom, mental-health inference, ritual-status inference, or a way to personalize answers from private assumptions.

### 28. Sanskrit Lens Seed

Sanskrit Lens Seed opens a passage before the product offers meaning.

It should:

- show source family and citation before translation notes
- show Sanskrit text where available
- show IAST transliteration
- show word-level meaning as a study layer
- show meter or chandas status honestly
- expose source URL and review status
- keep translation notes separate from source text
- make recitation boundary visible before any audio or pronunciation feature
- produce copyable source cards, JSON handoffs, and boundary notes

Sanskrit Lens Seed should never become ritual instruction, chant coaching, lineage inference, eligibility judgment, final translation authority, or a way to profile mantra interest. VedaPath can support study, but it must not pretend to authorize practice.

### 29. Voice Boundary Seed

Voice Boundary Seed prepares pronunciation support before any audio feature exists.

It should:

- keep the first voice surface silent
- show source family and citation before syllable hints
- mark syllable grouping as prototype support, not pronunciation certification
- require reviewer status before pronunciation notes or playable audio
- require license status, speaker consent, attribution, and takedown path before audio
- keep mantra audio locked until source, accent, meter, rights, and boundary are reviewed
- produce copyable voice briefs, reviewer handoffs, and boundary notes
- make the absence of audio feel like trust, not missing polish

Voice Boundary Seed should never become chant coaching, ritual instruction, guru voice, initiation guidance, eligibility judgment, spiritual status verdict, therapy, diagnosis, emergency support, or unlicensed audio reuse.

### 30. Scholar Review Seed

Scholar Review Seed makes trust review visible before source, Lens, or Voice records can be promoted.

It should:

- separate Sanskrit text, translation, product boundary, and rights review roles
- show reviewer status without pretending a scholar board already exists
- preserve evidence notes for source edition, license, interpretation, and boundary decisions
- show release decisions such as prototype approved, review required, audio blocked, or production pending
- block promotion when evidence is missing
- produce copyable review briefs, gate JSON, and boundary notes
- connect review outcomes back to Reviewer Queue, Trust Ledger, Lens, and Voice
- keep prototype confidence visibly different from production trust

Scholar Review Seed should never hide missing evidence, let the AI certify itself, flatten disagreement between traditions, promote audio without rights review, or turn prototype review into final authority.

### 31. Launch Gate Seed

Launch Gate Seed makes public readiness visible before VedaPath is shared more widely.

It should:

- separate public demo, founder share, and pilot-room decisions
- show source trail, privacy line, scholar review, and no-go copy before sharing
- make prototype readiness different from production certification
- provide copyable launch brief, privacy copy, and no-go gate
- block guru, therapy, ritual, crisis, scholar-board, durable-memory, and verified-answer claims
- route pilot-room use toward named review, consent, export, deletion, and access planning
- preserve the simple source-first workspace as the main public entry
- help the founder invite feedback on sources, categories, UX, and boundaries rather than praise alone

Launch Gate Seed should never turn excitement into authority, imply production storage exists, claim every answer is verified, invite crisis use, or let public sharing outrun review and consent.

### 32. Source Path Builder

A source path turns library records into a short, cited route.

It should:

- begin from explicit user intention
- show citation and source family on every step
- let users mark progress without making the AI an authority
- hand the next source into guided practice
- keep prototype memory device-local until accounts and consent exist

The path builder should never prescribe a life decision, ritual act, treatment plan, or spiritual conclusion. It should only organize the next source-backed step.

### 33. Calm Compass

Calm Compass is the simplest doorway for users who arrive with restlessness, overwhelm, unclear priority, or hesitation.

It should:

- begin from an explicit present-state choice
- recommend one source candidate, one reflection question, and one carry action
- route the user to Calm, Daily, Practice, Library, or Path without hiding why
- read only deliberate local prototype signals until accounts and consent exist
- send the selected source into guided practice when helpful

The compass must never pretend to diagnose, command, prescribe, or profile the user. It should slow the moment down and offer the next source-backed action.

### 34. Calm Card Studio

Calm Card Studio turns one source-backed reflection into a visual card.

It should:

- preserve source citation, text family, and boundary on the card
- let users write one personal action without turning it into advice for others
- support copy text and image export for launch sharing
- save prototype cards only in browser-local storage
- keep the brand calm, Bhagwa-led, and source-first

The card studio must not let shareability erase accuracy. Every card should make clear that it is reflection support, not a command, diagnosis, therapy, ritual instruction, or universal teaching.

### 35. Source Bell

Source Bell turns one source-backed reflection into a one-minute reset.

It should:

- begin from an explicit present-state choice
- run a short visual pulse with optional browser-generated sound
- preserve source citation, text family, source question, carry action, and boundary
- save prototype rhythm only in browser-local storage
- hand the selected action toward Calm Card Studio when useful

The bell must never become therapy, medical advice, emergency support, ritual instruction, or a guru voice. It should make one grounded next action easier to carry.

### 36. Before Reply

Before Reply turns one heated communication moment into a calmer draft.

It should:

- begin from an explicit reply state
- preserve source citation, text family, source question, tone, and boundary
- help the user write one calmer reply with one concrete next step
- save prototype drafts only in browser-local storage
- avoid pretending to mediate conflict, diagnose relationships, or advise unsafe communication

Before Reply should protect agency. It should never become therapy, legal advice, emergency support, conflict mediation, or a reason to remain in harmful contact.

### 37. Samvada Room

Samvada Room turns disagreement into a source-backed shared question.

It should:

- begin from an explicit disagreement shape
- ask the user to restate both views fairly
- preserve source citation, text family, pramana level, and boundary
- produce inquiry, not a verdict
- save prototype maps only in browser-local storage
- avoid false equivalence, hidden authority, mediation, and unsafe conflict advice

Samvada Room should make dialogue calmer without flattening difference. It should never pretend every view is equally supported by a source.

### 38. Sankalpa Studio

Sankalpa Studio turns personal calm into one source-backed 24-hour intention.

It should:

- begin from an explicit inner need
- ask the user to name today's pressure honestly
- preserve source citation, text family, pramana level, and boundary
- produce one small intention and one carry action
- save prototype intentions only in browser-local storage
- avoid ritual authority, therapy claims, productivity shame, and app-issued commands

Sankalpa Studio should make calm concrete without pretending the app can control a user's life. The intention belongs to the user.

### 39. Seva Planner

Seva Planner turns personal calm into one source-backed helpful act.

It should:

- begin from an explicit service domain
- ask the user to name real capacity
- preserve source citation, text family, pramana level, and boundary
- produce one small helpful act
- save prototype plans only in browser-local storage
- avoid moral ranking, guilt, savior energy, unsafe overextension, and app-issued commands

Seva Planner should make calm useful without turning service into self-erasure. The action should be small, bounded, and freely chosen.

### 40. Morning Path

Morning Path helps a user begin the day with one source-backed start.

It should:

- begin from the user's actual morning state
- ask for one honest line
- preserve source citation, text family, pramana level, and boundary
- produce one clean first action
- save prototype starts only in browser-local storage
- avoid therapy claims, ritual authority, astrology, productivity shame, and app-issued commands

Morning Path should make the first moment of the day calmer and more directed without pretending the product owns the user's life.

### 41. Evening Reflection

Evening Reflection helps a user close the day with one source-backed reflection.

It should:

- begin from the user's actual evening state
- ask for one acknowledgement and one release
- preserve source citation, text family, pramana level, and boundary
- produce one clean close
- save prototype closes only in browser-local storage
- avoid therapy claims, sleep treatment claims, ritual authority, astrology, rumination loops, and app-issued verdicts

Evening Reflection should help the user put the day down without making the day into a judgment of the self.

### 42. Calm Rhythm

Calm Rhythm helps a user see a privacy-preserving pattern across deliberate VedaPath room entries.

It should:

- read only browser-local prototype traces until accounts and consent exist
- show which rooms have been used without scoring the user
- suggest one next room based on visible local gaps or rhythm
- preserve source citation, text family, and boundary for each rhythm mode
- let users copy a handoff without syncing private entries
- avoid diagnosis, therapy claims, surveillance, productivity pressure, hidden profiling, and app-issued identity labels

Calm Rhythm should help the user notice the shape of a week without pretending the product knows who the user is.

## Product Personality

Calm. Reverent. Precise. Beginner-friendly. Never flashy about sacred material.

The app should feel like a patient guide opening a text beside the user.

## Strategic Difference

Most religious AI products try to answer as a spiritual authority.

VedaPath should win by doing the opposite:

- it labels uncertainty
- it cites sources
- it separates text from interpretation
- it invites human scholarship
- it respects tradition without overclaiming
