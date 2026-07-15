# v4.9.3 Environment & Secret Contract

## Purpose

A strict local, preview, and pilot configuration contract now validates HTTPS origins, secret references, privacy-safe telemetry, zero write routes, and inactive deployment while refusing unknown or value-bearing keys.

## What Changed

Adds a pure environment validator, allowlisted configuration keys, reference-only secret handling, required pilot references, safe summaries, origin checks, and explicit deployment and write-route locks.

## Acceptance Checks

node --check scripts/vedapath-environment-secret-contract.mjs; valid pilot config; missing reference, literal secret, unknown key, HTTP origin, telemetry, write-route, and activation rejection assertions; no-secret serialization scan; batch checker through v4.9.3.

## Known Risks

Pilot implementation reference only; no provider deployment, real identity provider, production secrets, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Environment & Secret Contract
Environments: local, preview, pilot
Origins: HTTPS; local loopback exception only
Secrets: managed references only
Required pilot refs: VEDAPATH_SESSION_SIGNING_SECRET, VEDAPATH_REVIEWER_STORE_KEY
Telemetry: privacy-safe aggregate only
Write routes: 0
Deployment: not activated
Public launch: blocked.
