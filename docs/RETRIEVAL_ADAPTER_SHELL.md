# First Real Retrieval Adapter Shell

## Product Purpose

Adds the first real retrieval adapter shell: a bounded contract for fixture source input, citation output, no-answer behavior, and review gating before live AI retrieval.

## User Promise

Connect retrieval carefully before it speaks.

## Boundary

Adapter shell only. No live model, network retrieval, vector database, production storage, or automatic answer generation is enabled.

## Data Contract

- Data file: `data/vedapath-retrieval-adapter-shell.json`
- Renderer: `launchRoom`
- Local memory key: `vedapathRetrievalAdapter`
- Production writes: disabled

## Checks

- The page must load through the shared command shell.
- The launch room must expose lanes, checklist, local save, copy packet, and clear local controls.
- The boundary must stay visible in the side panel.
