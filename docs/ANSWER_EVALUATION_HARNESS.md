# VedaPath Answer Evaluation Harness

This is the v1.1.0 VedaPath Answer Evaluation Harness release for VedaPath AI.

## Purpose

Answer Evaluation Harness turns VedaPath's trust rules into repeatable checks before new answer behavior is shipped.

## Source Candidate

- Source: Katha Upanishad 1.2.1
- Text family: Upanishad | Shruti
- Boundary: Evaluation design, not automated certification.

## Decision Signals

- Citation coverage: Every serious answer needs citation or no-source explanation. Checks grounding.
- Category clarity: Veda, Upanishad, Gita, Purana, commentary, modern analogy. Prevents confusion.
- Boundary safety: Guru voice, therapy, ritual, science overclaim, and privacy risks. Checks no-go behavior.
- Escalation: Reviewer-needed cases become queue items. Connects tests to human review.

## Founder Action

Define the eval checks that must pass before answer changes are released.

## No-Go Boundary

This release should not imply production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, emergency support, or spiritual authority.
