# Private Demo Script

Version: v4.6.5

## Purpose

This script gives a founder-safe private walkthrough: ask, source, answer boundary, review receipt, feedback, and explicit launch locks.

## What Changed

Adds a private demo script with talk track, allowed claims, blocked claims, and founder-ready handoff packet.

## Product Boundary

Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## Primary Files

- privatedemoscript.html
- data/vedapath-private-demo-script.json
- docs/PRIVATE_DEMO_SCRIPT.md

## Checks

`node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA
