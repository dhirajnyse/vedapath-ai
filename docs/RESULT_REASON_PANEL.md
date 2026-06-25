# VedaPath Result Reason Panel

This is the v1.8.7 VedaPath Result Reason Panel release for VedaPath AI.

## Purpose

Result Reason Panel makes search less magical by showing match fields, review state, and no-go boundaries beside each record.

## Source Candidate

- Source: Rigveda 1.164.46
- Text family: Veda | Shruti
- Boundary: Reason panel prototype, not semantic ranking.

## Search Signals

- Match field: Title, source, family, summary, intent, or blocked claim can explain a hit. Builds confidence.
- Review reason: Prototype-support and review-needed states are not hidden. Keeps humility.
- Rights reason: Display-citation-only remains visible. Protects text use.
- No-rank claim: The UI avoids claiming semantic ranking. Keeps scope honest.

## Founder Action

Make result selection inspectable enough that users can challenge it.

## Data Sources

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply live semantic retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, ritual instruction, emergency support, or spiritual authority.
