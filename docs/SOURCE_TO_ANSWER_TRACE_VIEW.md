# Source-to-Answer Trace View

Version: v4.5.3

## Purpose

Adds a source-to-answer trace view that maps answer sentences to source packet, confidence, boundary, and reviewer state.

## Product Role

This trace view makes the path from user intent to source packet to answer sentence visible, so trust is earned line by line.

## Files

- Page: `sourcetoanswertraceview.html`
- Data: `data/vedapath-source-to-answer-trace-view.json`
- Renderer kind: `schema`

## Checks

`node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

## Known Risks

Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.
