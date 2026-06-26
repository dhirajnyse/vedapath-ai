# VedaPath Search History Preview

This is the v2.3.2 VedaPath Search History Preview release for VedaPath AI.

## Purpose

Search History Preview keeps iteration fast while preserving privacy boundaries.

## Retrieval Focus

- Sample query: What does Hindu philosophy mean by different kinds of knowledge?
- Intent lane: knowledge
- Boundary: Browser-only history preview, not account storage.

## Retrieval Signals

- Query path: User language is matched to curated source records. Keeps answers source-led.
- Reason path: Ranking reasons and readiness stay visible. Makes retrieval inspectable.
- Boundary path: No-go language travels with each candidate. Prevents overclaim.
- Trace path: The chosen source can be copied as a trace packet. Supports review.

## Founder Action

Test retrieval habit before accounts and backend storage.

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
