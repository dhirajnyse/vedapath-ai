# VedaPath Beta Search Shell

This is the v1.8.5 VedaPath Beta Search Shell release for VedaPath AI.

## Purpose

Beta Search Shell turns the static seed into a usable beta surface without pretending retrieval or generation is live.

## Source Candidate

- Source: Bhagavad Gita 2.48
- Text family: Bhagavad Gita | Smriti
- Boundary: Browser-only search shell, not live retrieval.

## Search Signals

- Search input: Keyword search across title, citation, family, summary, and blocked claims. Makes the seed usable.
- Result cards: Every result shows source candidate, family, review state, and rights state. Keeps trust visible.
- Prototype mark: Records remain non-public-answer-eligible until reviewed. Prevents overclaim.
- Empty state: No result leads to a careful fallback rather than invention. Protects the answer path.

## Founder Action

Make static beta records searchable while keeping every result visibly prototype and review-needed.

## Data Sources

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply live semantic retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, ritual instruction, emergency support, or spiritual authority.
