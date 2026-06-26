# VedaPath Fallback Answer Guard

This is the v2.3.1 VedaPath Fallback Answer Guard release for VedaPath AI.

## Purpose

Fallback Answer Guard protects VedaPath from answer pressure when retrieval is uncertain.

## Retrieval Focus

- Sample query: Can scripture help me choose without telling me what to do?
- Intent lane: agency
- Boundary: Fallback preview, not model safety system.

## Retrieval Signals

- Query path: User language is matched to curated source records. Keeps answers source-led.
- Reason path: Ranking reasons and readiness stay visible. Makes retrieval inspectable.
- Boundary path: No-go language travels with each candidate. Prevents overclaim.
- Trace path: The chosen source can be copied as a trace packet. Supports review.

## Founder Action

Prefer honest fallback over weak source claims.

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
