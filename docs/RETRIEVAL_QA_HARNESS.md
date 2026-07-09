# Retrieval QA Harness

## Product Purpose

Adds a retrieval QA harness with pass, review, and no-source cases so future retrieval changes can be checked before they affect answer cards.

## User Promise

Test retrieval before trusting it.

## Boundary

Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## Data Contract

- Data file: `data/vedapath-retrieval-qa-harness.json`
- Renderer: `qa`
- Page: `retrievalqaharness.html`
- Production writes: disabled

## Checks

- The page loads through the shared command shell.
- The data file parses as JSON.
- The retrieval surface renders evidence, boundary, and review posture.
- The room does not claim live AI, production storage, or source authority.
