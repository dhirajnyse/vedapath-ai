# Pilot-to-Production Gap Map

Maps the exact blockers between private-pilot proof and production launch, while fixing release-status drift in Build Status.

## Goal

Make the remaining launch gap visible, owned, and impossible to confuse with readiness.

## Boundary

Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.

## Required Flow

1. Name each launch blocker.
2. Attach an owner and evidence type.
3. Separate private-pilot proof from production proof.
4. Keep every live capability closed.

## Decision Options

- Hold public launch until all red gaps have evidence.
- Review security, privacy, rights, and reviewer operations as separate gates.
- Use Build Status as the canonical release-tracking surface.

## Packet

- gap: security
- gap: privacy-consent
- gap: source-rights
- gap: hosted-architecture
- owner:founder

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, store production data, run live AI, publish telemetry, deliver a corpus, invite public participants, or authorize launch.
