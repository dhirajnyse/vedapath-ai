# VedaPath Retrieval Lab Control Room

This is the v2.3.4 VedaPath Retrieval Lab Control Room release for VedaPath AI.

## Purpose

Retrieval Lab Control Room completes the source-to-answer bridge for the trusted MVP.

## Retrieval Focus

- Sample query: How can I act calmly when results are uncertain?
- Intent lane: calm action
- Boundary: Retrieval lab prototype, not production RAG or AI authority.

## Retrieval Signals

- Query path: User language is matched to curated source records. Keeps answers source-led.
- Reason path: Ranking reasons and readiness stay visible. Makes retrieval inspectable.
- Boundary path: No-go language travels with each candidate. Prevents overclaim.
- Trace path: The chosen source can be copied as a trace packet. Supports review.

## Founder Action

Use the lab to plan the first real retrieval implementation.

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
