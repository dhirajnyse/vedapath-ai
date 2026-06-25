# VedaPath Question Match Preview

This is the v1.8.8 VedaPath Question Match Preview release for VedaPath AI.

## Purpose

Question Match Preview connects seed records with expected beta questions so source routing can be tested before live AI.

## Source Candidate

- Source: Bhagavad Gita 2.47
- Text family: Bhagavad Gita | Smriti
- Boundary: Fixture preview, not real user intent detection.

## Search Signals

- Fixture search: Known questions become visible examples. Makes QA practical.
- Expected route: Source-first preview, fallback, or review-needed behavior is displayed. Checks product flow.
- Expected source: The fixture names the source candidate. Keeps answers grounded.
- Reviewer flag: Reviewer-needed remains visible before public use. Protects trust.

## Founder Action

Use the fixture file to make early search behavior testable.

## Data Sources

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply live semantic retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, ritual instruction, emergency support, or spiritual authority.
