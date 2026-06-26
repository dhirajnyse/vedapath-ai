# VedaPath Source Candidate Ranker

This is the v2.2.6 VedaPath Source Candidate Ranker release for VedaPath AI.

## Purpose

Source Candidate Ranker makes source selection inspectable instead of mysterious.

## Retrieval Focus

- Sample query: What does the Gita suggest about steady effort?
- Intent lane: action
- Boundary: Ranker prototype, not semantic retrieval.

## Retrieval Signals

- Query path: User language is matched to curated source records. Keeps answers source-led.
- Reason path: Ranking reasons and readiness stay visible. Makes retrieval inspectable.
- Boundary path: No-go language travels with each candidate. Prevents overclaim.
- Trace path: The chosen source can be copied as a trace packet. Supports review.

## Founder Action

Make ranking explainable before answer drafting.

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
