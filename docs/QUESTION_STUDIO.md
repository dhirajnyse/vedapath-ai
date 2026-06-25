# VedaPath Question Studio

This is the v1.2.6 VedaPath Question Studio release for VedaPath AI.

## Purpose

Question Studio improves the first ask by separating text lookup, concept explanation, claim check, calm reflection, and modern analogy.

## Source Candidate

- Source: Rigveda 1.164.46
- Text family: Veda | Shruti
- Boundary: Question-shaping prototype, not live retrieval.

## Decision Signals

- Prompt type: Lookup, explain, compare, claim check, calm reflection, or analogy. Clarifies answer mode.
- Source hint: Veda, Upanishad, Gita, Purana, commentary, modern view, or unsure. Prevents category confusion.
- Risk label: Science claim, ritual claim, distress claim, or tradition claim. Routes caution early.
- Fallback: If no source is available, say so directly. Protects trust.

## Founder Action

Shape user questions so VedaPath can answer with source clarity instead of broad guessing.

## No-Go Boundary

This release should not imply production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.
