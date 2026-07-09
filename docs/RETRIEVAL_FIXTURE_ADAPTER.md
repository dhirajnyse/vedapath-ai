# Retrieval Fixture Adapter

## Product Purpose

Adds a visible fixture adapter room that reads curated source candidates, exposes source ids, match reasons, confidence, and blocks answer composition until review.

## User Promise

Read fixtures before any answer exists.

## Boundary

Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## Data Contract

- Data file: `data/vedapath-retrieval-fixture-adapter.json`
- Renderer: `desk`
- Page: `retrievalfixtureadapter.html`
- Production writes: disabled

## Checks

- The page loads through the shared command shell.
- The data file parses as JSON.
- The retrieval surface renders evidence, boundary, and review posture.
- The room does not claim live AI, production storage, or source authority.
