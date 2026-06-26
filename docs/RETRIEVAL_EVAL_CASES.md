# VedaPath Retrieval Eval Cases

This is the v2.3.0 VedaPath Retrieval Eval Cases release for VedaPath AI.

## Purpose

Retrieval Eval Cases gives VedaPath a simple quality loop for source selection.

## Retrieval Focus

- Sample query: Does the Rigveda support religious pluralism?
- Intent lane: plural
- Boundary: Eval preview, not formal benchmark.

## Retrieval Signals

- Query path: User language is matched to curated source records. Keeps answers source-led.
- Reason path: Ranking reasons and readiness stay visible. Makes retrieval inspectable.
- Boundary path: No-go language travels with each candidate. Prevents overclaim.
- Trace path: The chosen source can be copied as a trace packet. Supports review.

## Founder Action

Create starter retrieval test cases before backend work.

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
