# VedaPath Query Router Demo

This is the v1.5.6 VedaPath Query Router Demo release for VedaPath AI.

## Purpose

Query Router Demo makes the first invisible step visible: VedaPath should understand what kind of answer is allowed before it searches.

## Source Candidate

- Source: Rigveda 1.164.46
- Text family: Veda | Shruti
- Boundary: Routing prototype, not live classification.

## Working Chain Signals

- Intent label: Lookup, compare, claim-check, calm reflection, or no-answer. Sets the answer lane.
- Risk label: Science overclaim, therapy, ritual, category confusion, or sensitive personal context. Adds caution early.
- Needed evidence: Direct passage, commentary, scholarly view, or reviewer decision. Guides retrieval.
- Fallback state: If the question is too broad or risky, route to a careful next step. Protects the user.

## Founder Action

Separate question intent before retrieval so the answer can stay narrow and honest.

## No-Go Boundary

This release should not imply production storage, live retrieval, live AI generation, authentication, licensed source text, therapy, ritual instruction, emergency support, or spiritual authority.
