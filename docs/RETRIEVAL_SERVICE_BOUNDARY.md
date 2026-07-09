# Retrieval Service Boundary

Version: v4.5.7

## Purpose

The future retrieval service may rank reviewed source packets, but it must not write final answers, override reviewer state, or hide no-source outcomes.

## What Changed

Separates the future retrieval service responsibilities from answer composition, reviewer decisions, storage, and public launch authority.

## Product Boundary

Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## Primary Files

- retrievalserviceboundary.html
- data/vedapath-retrieval-service-boundary.json
- docs/RETRIEVAL_SERVICE_BOUNDARY.md

## Checks

`node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA
