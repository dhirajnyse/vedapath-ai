# Source Practice

## Purpose

Source Practice turns VedaPath Calm from a reading preview into a guided product habit. A user chooses how they are arriving, runs a one, three, or five minute practice, and leaves with one source-backed carry action.

## What It Proves

- Calm can become an interactive workflow, not only content.
- The source card can stay visible during reflection.
- Practice history can be prototyped with device-local memory before accounts exist.
- Users can copy a handoff summary without exposing private notes by default.
- A selected Source Library record can shape the practice without losing citation context.
- A selected Source Path step can shape the practice while preserving citation, family, and boundary.
- A selected Calm Compass source can shape the practice from one explicit present-state choice.
- A completed carry action can become a Calm Card without losing source context.
- A practice source can become a one-minute Source Bell when the user needs a smaller reset.
- A practice source can frame Before Reply when the next action is a message.

## Practice Stages

1. Arrive: name the state without judgment.
2. Read: open the source candidate and source family.
3. Reflect: answer one source-shaped question.
4. Carry: choose one small action.

## Current Data Model

The prototype stores completed sessions in browser localStorage under `vedapath.practice.v1`.

Each entry includes:

- Date
- State
- Duration
- Source candidate
- Source family
- Carry action
- User note

This data is not synced, reviewed, or production-grade.

## Guardrail

Source Practice is reflection support. It is not therapy, medical advice, emergency support, ritual instruction, or a replacement for teachers, family, clinicians, or tradition.
