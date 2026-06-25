# VedaPath Question Fixture Set

This is the v1.7.6 VedaPath Question Fixture Set release for VedaPath AI.

## Purpose

Question Fixture Set gives VedaPath a repeatable way to test whether source routing and answer boundaries are improving.

## Source Candidate

- Source: Bhagavad Gita 2.47
- Text family: Bhagavad Gita | Smriti
- Boundary: Question fixture demo, not production evaluation coverage.

## Beta Data Signals

- Question text: Plain-language user question plus normalized intent. Keeps tests human.
- Expected route: Source lookup, claim check, calm reflection, compare, or no-answer. Checks routing.
- Expected source: Citation candidate or reviewer-needed fallback. Checks retrieval.
- Expected boundary: What the answer must not imply. Checks humility.

## Founder Action

Capture the questions the first beta must answer, refuse, or route to review.

## Data Files

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply complete corpus coverage, production storage, live semantic search, live AI generation, public launch approval, therapy, ritual instruction, emergency support, or spiritual authority.
