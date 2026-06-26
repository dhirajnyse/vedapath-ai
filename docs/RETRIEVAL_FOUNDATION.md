# VedaPath AI Retrieval Foundation

Release: v2.9.2

This release adds the first static retrieval layer over the source-answer records.

## Files

- `data/vedapath-retrieval-foundation.json`
- `retrievalfoundation.html`
- `assets/vedapath-retrieval-foundation.css`
- `assets/vedapath-retrieval-foundation.js`

## Behavior

The retrieval layer scores records by:

- exact aliases
- question and title phrase matches
- curated retrieval terms
- source and family terms
- body evidence terms
- readiness state
- pramana lane

## Boundary

This is static retrieval over starter records. It is not semantic search, live RAG, broad corpus coverage, scholar approval, therapy, ritual instruction, emergency support, or spiritual authority.
