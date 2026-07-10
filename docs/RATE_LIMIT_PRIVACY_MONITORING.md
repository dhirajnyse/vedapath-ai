# v4.8.8 Rate Limit & Privacy-Safe Monitoring

## Purpose

A deterministic request guard now limits short bursts and records only time buckets, pseudonymous client buckets, route, status class, and outcome in instance memory.

## What Changed

Adds a testable fixed-window request guard, privacy-safe aggregate event envelope, 429 and Retry-After behavior, bounded in-memory retention, and explicit exclusions for raw questions, IPs, referrers, and user agents.

## Acceptance Checks

node --check scripts/vedapath-private-request-guard.mjs; deterministic allowance and 429 tests; safe-event field scan; no raw token or question assertions; batch checker through v4.8.8.

## Known Risks

Controlled-pilot foundation only; no provider deployment, real authentication, durable queue, production monitoring, licensed corpus delivery, live AI generation, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Rate Limit & Privacy-Safe Monitoring v4.8.8
Default: 12 requests per minute per pseudonymous bucket.
Stored: route, status class, outcome, time bucket.
Not stored: question, IP, referrer, user agent.
