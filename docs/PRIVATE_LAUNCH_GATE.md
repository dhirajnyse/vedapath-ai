# Private Launch Gate

Version: v4.6.0

## Purpose

The product now has enough visible evidence for a private founder-led demo, while live AI, public launch, payment, and production storage remain locked.

## What Changed

Adds a private launch gate that distinguishes private demo readiness from public launch readiness with explicit locks, metrics, and founder packet.

## Product Boundary

Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## Primary Files

- privatelaunchgate.html
- data/vedapath-private-launch-gate.json
- docs/PRIVATE_LAUNCH_GATE.md

## Checks

`node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA
