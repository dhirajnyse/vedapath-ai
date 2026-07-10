# v4.8.6 Hosted Backend Decision Gate

## Purpose

The decision gate selects a deployment-neutral read-only handler over the reviewed registry, proves contract parity locally, and leaves deployment and every write path unauthorized.

## What Changed

Adds a deployment-neutral read-only source handler, parity tests, architecture decision record, explicit service boundaries, and a hosted-backend decision gate without deploying infrastructure.

## Acceptance Checks

node --check scripts/vedapath-readonly-source-handler.mjs; handler and local API parity fixtures; full batch checker; legacy source-path, backend, route, and static-link regressions; desktop and mobile browser QA.

## Known Risks

Private-demo tooling only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Hosted Backend Decision Gate v4.8.6
Decision: deployment-neutral read-only source handler.
Data: reviewed build-time registry.
Excluded: database, accounts, writes, telemetry, payments, model calls, and public launch.
Next candidate: v4.8.7 Read-only Hosted API Adapter.
