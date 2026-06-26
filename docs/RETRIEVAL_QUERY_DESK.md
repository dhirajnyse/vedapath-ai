# VedaPath Retrieval Query Desk

This is the v2.2.5 VedaPath Retrieval Query Desk release for VedaPath AI.

## Purpose

Retrieval Query Desk starts the search layer over VedaPath's curated source records.

## Retrieval Focus

- Sample query: How can I act calmly when results are uncertain?
- Intent lane: steady action
- Boundary: Retrieval query prototype, not an AI answer engine.

## Retrieval Signals

- Query path: User language is matched to curated source records. Keeps answers source-led.
- Reason path: Ranking reasons and readiness stay visible. Makes retrieval inspectable.
- Boundary path: No-go language travels with each candidate. Prevents overclaim.
- Trace path: The chosen source can be copied as a trace packet. Supports review.

## Founder Action

Route modern questions into the curated source library.

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
