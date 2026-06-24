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

### 15. Source Path Builder

A source path turns library records into a short, cited route.

It should:

- begin from explicit user intention
- show citation and source family on every step
- let users mark progress without making the AI an authority
- hand the next source into guided practice
- keep prototype memory device-local until accounts and consent exist

The path builder should never prescribe a life decision, ritual act, treatment plan, or spiritual conclusion. It should only organize the next source-backed step.

### 16. Calm Compass

Calm Compass is the simplest doorway for users who arrive with restlessness, overwhelm, unclear priority, or hesitation.

It should:

- begin from an explicit present-state choice
- recommend one source candidate, one reflection question, and one carry action
- route the user to Calm, Daily, Practice, Library, or Path without hiding why
- read only deliberate local prototype signals until accounts and consent exist
- send the selected source into guided practice when helpful

The compass must never pretend to diagnose, command, prescribe, or profile the user. It should slow the moment down and offer the next source-backed action.

### 17. Calm Card Studio

Calm Card Studio turns one source-backed reflection into a visual card.

It should:

- preserve source citation, text family, and boundary on the card
- let users write one personal action without turning it into advice for others
- support copy text and image export for launch sharing
- save prototype cards only in browser-local storage
- keep the brand calm, Bhagwa-led, and source-first

The card studio must not let shareability erase accuracy. Every card should make clear that it is reflection support, not a command, diagnosis, therapy, ritual instruction, or universal teaching.

### 18. Source Bell

Source Bell turns one source-backed reflection into a one-minute reset.

It should:

- begin from an explicit present-state choice
- run a short visual pulse with optional browser-generated sound
- preserve source citation, text family, source question, carry action, and boundary
- save prototype rhythm only in browser-local storage
- hand the selected action toward Calm Card Studio when useful

The bell must never become therapy, medical advice, emergency support, ritual instruction, or a guru voice. It should make one grounded next action easier to carry.

### 19. Before Reply

Before Reply turns one heated communication moment into a calmer draft.

It should:

- begin from an explicit reply state
- preserve source citation, text family, source question, tone, and boundary
- help the user write one calmer reply with one concrete next step
- save prototype drafts only in browser-local storage
- avoid pretending to mediate conflict, diagnose relationships, or advise unsafe communication

Before Reply should protect agency. It should never become therapy, legal advice, emergency support, conflict mediation, or a reason to remain in harmful contact.

### 20. Samvada Room

Samvada Room turns disagreement into a source-backed shared question.

It should:

- begin from an explicit disagreement shape
- ask the user to restate both views fairly
- preserve source citation, text family, pramana level, and boundary
- produce inquiry, not a verdict
- save prototype maps only in browser-local storage
- avoid false equivalence, hidden authority, mediation, and unsafe conflict advice

Samvada Room should make dialogue calmer without flattening difference. It should never pretend every view is equally supported by a source.

### 21. Sankalpa Studio

Sankalpa Studio turns personal calm into one source-backed 24-hour intention.

It should:

- begin from an explicit inner need
- ask the user to name today's pressure honestly
- preserve source citation, text family, pramana level, and boundary
- produce one small intention and one carry action
- save prototype intentions only in browser-local storage
- avoid ritual authority, therapy claims, productivity shame, and app-issued commands

Sankalpa Studio should make calm concrete without pretending the app can control a user's life. The intention belongs to the user.

### 22. Seva Planner

Seva Planner turns personal calm into one source-backed helpful act.

It should:

- begin from an explicit service domain
- ask the user to name real capacity
- preserve source citation, text family, pramana level, and boundary
- produce one small helpful act
- save prototype plans only in browser-local storage
- avoid moral ranking, guilt, savior energy, unsafe overextension, and app-issued commands

Seva Planner should make calm useful without turning service into self-erasure. The action should be small, bounded, and freely chosen.

### 23. Morning Path

Morning Path helps a user begin the day with one source-backed start.

It should:

- begin from the user's actual morning state
- ask for one honest line
- preserve source citation, text family, pramana level, and boundary
- produce one clean first action
- save prototype starts only in browser-local storage
- avoid therapy claims, ritual authority, astrology, productivity shame, and app-issued commands

Morning Path should make the first moment of the day calmer and more directed without pretending the product owns the user's life.

### 24. Evening Reflection

Evening Reflection helps a user close the day with one source-backed reflection.

It should:

- begin from the user's actual evening state
- ask for one acknowledgement and one release
- preserve source citation, text family, pramana level, and boundary
- produce one clean close
- save prototype closes only in browser-local storage
- avoid therapy claims, sleep treatment claims, ritual authority, astrology, rumination loops, and app-issued verdicts

Evening Reflection should help the user put the day down without making the day into a judgment of the self.

### 25. Calm Rhythm

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
