# v4.8.7 Read-only Hosted API Adapter

## Purpose

A standards-based Request-to-Response adapter now enforces approved origins, JSON shape, 16 KB payloads, security headers, typed errors, and read-only routes without choosing or deploying a provider.

## What Changed

Adds an executable Web Request/Response adapter over the reviewed source handler, strict origin and payload controls, CORS preflight behavior, typed errors, security headers, and explicit zero-write deployment posture.

## Acceptance Checks

node --check scripts/vedapath-hosted-source-adapter.mjs; adapter health, source, search, POST, CORS, malformed JSON, oversized payload, origin, method, and route assertions; batch checker through v4.8.7.

## Known Risks

Controlled-pilot foundation only; no provider deployment, real authentication, durable queue, production monitoring, licensed corpus delivery, live AI generation, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Read-only Hosted API Adapter v4.8.7
Runtime: Web Request -> Response.
Provider: unselected.
Deployment: not activated.
Writes: none.
