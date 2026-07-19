# Consent and Privacy Ledger Contract

Defines a consent ledger contract for pilot participation, local memory, telemetry boundaries, retention, withdrawal, export, and deletion.

## Goal

Make privacy consent explicit before any pilot learning or telemetry can exist.

## Boundary

Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.

## Required Flow

1. State the data purpose.
2. Record consent, withdrawal, export, and deletion paths.
3. Keep telemetry off by default.
4. Separate local prototype memory from production accounts.

## Decision Options

- No silent analytics in private pilot.
- No raw identity in fixtures.
- No memory sync before account consent and deletion controls exist.

## Packet

- consent: explicit
- retention: 30-days-or-less
- withdrawal: required
- telemetry: disabled
- owner:privacy

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, store production data, run live AI, publish telemetry, deliver a corpus, invite public participants, or authorize launch.
