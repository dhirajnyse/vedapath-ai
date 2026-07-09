# Citation Packet Renderer

## Product Purpose

Adds a citation packet renderer that turns a selected source candidate into a structured answer packet with citation, confidence, boundary, and carry action.

## User Promise

Render the citation before the answer.

## Boundary

Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## Data Contract

- Data file: `data/vedapath-citation-packet-renderer.json`
- Renderer: `ask`
- Page: `citationpacketrenderer.html`
- Production writes: disabled

## Checks

- The page loads through the shared command shell.
- The data file parses as JSON.
- The retrieval surface renders evidence, boundary, and review posture.
- The room does not claim live AI, production storage, or source authority.
