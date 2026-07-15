# v4.9.8 Deployment Manifest Contract

## Purpose

A provider-neutral manifest now enforces a Web-standard runtime, private invitation-only access, aggregate redacted telemetry, named secret references, strict request limits, zero writes, a shutdown owner, and dry-run-only posture.

## What Changed

Adds an allowlisted deployment manifest validator, safe path and region checks, required secret references, mandatory log redactions, request, timeout, and rate limits, rollback ownership, safe summaries, and hard activation and write-route rejections.

## Acceptance Checks

node --check scripts/vedapath-deployment-manifest.mjs; valid dry-run manifest plus unknown-key, literal-reference, activation, public-access, unsafe-limit, missing-redaction, write-route, and rollback rejection assertions; batch checker through v4.9.8.

## Known Risks

Private-pilot implementation evidence only; no provider account, credentials, endpoint, live identity provider, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Deployment Manifest Contract
Environment: pilot
Runtime: web-standard
Access: private-invite-only
Telemetry: aggregate-redacted
Secret values: 0
Write routes: 0
Rollback: disable endpoint within 15 minutes
Deployment mode: dry-run
Endpoint created: false
Public launch: blocked
