# v4.9.4 Reviewer Session Security Spike

## Purpose

A server-side HMAC test envelope now binds pseudonymous reviewer subjects to short-lived roles, rejects tampering, expiry, and revocation, and still reports identity-provider verified and production allowed as false.

## What Changed

Adds signed expiring reviewer sessions, pseudonymous subjects, one-hour maximum lifetime, signature verification, clock checks, caller-supplied revocation, role-bound authorization, and an accessible browser-state preview.

## Acceptance Checks

node --check scripts/vedapath-reviewer-session-spike.mjs; node --check assets/vedapath-reviewer-session-simulator.js; valid, expired, revoked, tampered, role-allowed, role-denied, lifetime, and production-lock assertions; batch checker through v4.9.4; browser interaction QA.

## Known Risks

Pilot implementation reference only; no provider deployment, real identity provider, production secrets, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Reviewer Session Security Spike
Signed envelope: HMAC test only
Subject: pseudonymous reviewer-* id
Lifetime: 60 to 3600 seconds
Revocation: checked before authorization
Role: evaluated against bounded capability policy
Identity provider verified: false
Production allowed: false
Next: replace the spike with a real identity provider only after security review.
