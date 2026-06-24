# VedaPath AI

VedaPath AI is a source-first learning companion for exploring Vedic and Hindu philosophical texts with clarity, humility, and citations.

![VedaPath AI 3D logo concept](assets/vedapath-3d-logo-concept.png)

It is not a guru, oracle, priest, or ritual authority. It helps users ask better questions, trace ideas to sources, compare interpretations, and build a personal learning path.

## Product Principle

Let us look at the source first.

## Initial Scope

- Vedas and Vedic structure
- Principal Upanishads
- Bhagavad Gita with clear Smriti labeling
- Sanskrit terms, transliteration, and beginner explanations
- Claim checking for modern interpretations
- Guided learning paths for different user levels

## Foundation Docs

- [Product Blueprint](blueprint.html)
- [Raw Blueprint Markdown](docs/PRODUCT_BLUEPRINT.md)
- [UX Principles](docs/UX_PRINCIPLES.md)
- [Brand System](docs/BRAND_SYSTEM.md)
- [MVP Roadmap](docs/MVP_ROADMAP.md)
- [Sample Questions](docs/SAMPLE_QUESTIONS.md)
- [Prototype Notes](docs/PROTOTYPE_NOTES.md)
- [GitHub Repo Setup](docs/REPO_SETUP.md)
- [GitHub Pages Setup](docs/PAGES_SETUP.md)
- [Source Policy](docs/SOURCE_POLICY.md)
- [Preview Hub](index.html)
- [Brand Board](brand/brand-board.html)
- [Build Status Page](build-status.html)
- [Calm Path Preview](calm.html)
- [Daily Calm Loop](daily.html)
- [Source Practice](practice.html)
- [Source Practice Notes](docs/SOURCE_PRACTICE.md)
- [Source Library](library.html)
- [Source Library Notes](docs/SOURCE_LIBRARY.md)
- [Source Seeds](seeds.html)
- [Source Seeds Notes](docs/SOURCE_SEEDS.md)
- [Retrieval Lab](retrieval.html)
- [Retrieval Lab Notes](docs/RETRIEVAL_LAB.md)
- [Passage Review Pack](passages.html)
- [Passage Review Pack Notes](docs/PASSAGE_REVIEW_PACK.md)
- [Evaluation Runner](eval.html)
- [Evaluation Runner Notes](docs/EVALUATION_RUNNER.md)
- [Source Path Builder](path.html)
- [Source Path Builder Notes](docs/SOURCE_PATH_BUILDER.md)
- [Calm Compass](compass.html)
- [Calm Compass Notes](docs/CALM_COMPASS.md)
- [Calm Card Studio](card.html)
- [Calm Card Studio Notes](docs/CALM_CARD_STUDIO.md)
- [Source Bell](bell.html)
- [Source Bell Notes](docs/SOURCE_BELL.md)
- [Before Reply](reply.html)
- [Before Reply Notes](docs/BEFORE_REPLY.md)
- [Samvada Room](samvada.html)
- [Samvada Room Notes](docs/SAMVADA_ROOM.md)
- [Sankalpa Studio](sankalpa.html)
- [Sankalpa Studio Notes](docs/SANKALPA_STUDIO.md)
- [Seva Planner](seva.html)
- [Seva Planner Notes](docs/SEVA_PLANNER.md)
- [Morning Path](morning.html)
- [Morning Path Notes](docs/MORNING_PATH.md)
- [Evening Reflection](evening.html)
- [Evening Reflection Notes](docs/EVENING_REFLECTION.md)
- [Calm Rhythm](rhythm.html)
- [Calm Rhythm Notes](docs/CALM_RHYTHM.md)
- [Release Workflow](docs/RELEASE_WORKFLOW.md)

## North Star

Make sacred and philosophical knowledge easier to approach without flattening its depth, confusing categories, or pretending the AI is an authority.

## Current Release

`v0.4.1` is a trusted MVP prototype with:

- Ask workspace
- Source Card
- Pramana Meter
- Claim Checker
- Learning Path
- Calm Path Preview
- Daily Calm Loop with device-local memory
- Source Practice with timer, stages, source card, and local rhythm
- Source Library with search, filters, device-local shelf, and practice handoff
- Source Seeds with 12 structured seed records, review gates, missing fields, and source-schema handoff
- Retrieval Lab with source-stack ranking, match reasons, answer boundaries, no-source claim refusal, and local review queue
- Passage Review Pack with passage dossiers, meaning capsules, allowed use, boundaries, missing fields, eval checks, and local review decisions
- Evaluation Runner with answer draft checks for citation gaps, source-family confusion, unsafe calm advice, ritual authority, and overclaiming
- Source Path Builder with intention, local progress, source mix, and practice handoff
- Calm Compass with present-state routing, local signal, and practice handoff
- Calm Card Studio with visual card preview, local saved cards, copy text, and PNG export
- Source Bell with one-minute visual pulse, optional soft bell, source card, carry action, and local rhythm
- Before Reply with source-backed reply drafting, tone options, local saved drafts, and copy handoff
- Samvada Room with fair restatement, source candidate, shared question, local maps, and copy handoff
- Sankalpa Studio with one private 24-hour intention, source card, carry action, and local trail
- Seva Planner with one source-backed helpful act, capacity boundary, and local trail
- Morning Path with one source-backed start, honest line, clean first action, and local seven-day opening
- Evening Reflection with source-backed acknowledgement, release, clean close, and local seven-day closing
- Calm Rhythm with a browser-local pattern lens, next-room suggestion, and copyable privacy handoff
- Correction Loop placeholder

## Faster Release Commits

After Git is initialized, use:

```powershell
.\scripts\release.cmd -Message "Describe this release"
```

Add `-Push` after the GitHub remote is connected.

## Local Preview

Run:

```powershell
.\scripts\serve-local.cmd
```

Then open:

```text
http://127.0.0.1:8088/
```
