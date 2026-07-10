# v4.8.2 Private Demo Runbook

## Purpose

A canonical scenario set and executable runner now cover approved, review, hold, no-source, and offline-fallback behavior without creating user data.

## What Changed

Adds a canonical private-demo scenario contract, an executable API and registry runner, a human runbook, context-aware evidence labels, expected evidence, and explicit stop conditions.

## Acceptance Checks

node --check scripts/run-v482-private-demo.mjs; node scripts/run-v482-private-demo.mjs; batch checker through v4.8.2; static-link smoke.

## Known Risks

Private-demo tooling only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Private Demo Runbook v4.8.2
Run: node scripts/run-v482-private-demo.mjs
Expected: 5/5 scenarios pass.
Boundary: private demo only; stop if citation, review state, rights state, boundary, or fallback label is missing.
