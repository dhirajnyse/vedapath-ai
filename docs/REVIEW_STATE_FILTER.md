# VedaPath Review State Filter

This is the v1.9.1 VedaPath Review State Filter release for VedaPath AI.

## Purpose

Review State Filter makes source status a first-class search control instead of buried metadata.

## Source Candidate

- Source: Taittiriya Upanishad 1.11.1
- Text family: Upanishad | Shruti
- Boundary: Review filter prototype, not actual approval.

## Search Signals

- Status chip: Each result names active-prototype or prototype-support. Keeps status visible.
- Eligibility flag: Public answer eligibility stays false until approved. Prevents misuse.
- Reviewer route: Review-needed records can become handoff items. Supports workflow.
- Future states: The UI can later add beta-eligible without redesign. Keeps path open.

## Founder Action

Expose review status so beta search never reads as approved corpus.

## Data Sources

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply live semantic retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, ritual instruction, emergency support, or spiritual authority.
