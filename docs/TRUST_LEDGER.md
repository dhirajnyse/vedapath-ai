# Trust Ledger

Trust Ledger turns source policy routes and reviewer queue outcomes into visible governance records.

The core idea:

Before VedaPath changes answer behavior, it should preserve the rule, source family, risk, evidence path, reviewer need, and version status.

## Why It Matters

VedaPath should not become trusted because it sounds calm.

It should become trusted because every important answer rule can show:

- where the issue came from
- which source family it affects
- what policy route applies
- who should review it
- whether it is ready, held, blocked, or still draft
- which version introduced the decision

## Current Prototype

The v0.4.5 ledger includes:

- six sample governance records
- filters for ready, review, blocked, and draft rules
- active record view with policy route, evidence path, reviewer need, source family, and risk
- local decisions for ready, review, and blocked status
- decision history
- copyable governance brief

All state is browser-local only.

## Record Statuses

### Ready Prototype

The rule can power prototype behavior, but still needs production review before becoming authoritative.

### Review Hold

The rule needs source, scholar, safety, translation, or product review before behavior changes.

### Blocked Rule

The rule should prevent or refuse a claim until better source evidence and review exist.

### Draft Rule

The rule is a planning artifact and should not drive product behavior yet.

## Production Requirements

The real product should add:

- authenticated reviewer identity
- durable versioned storage
- source edition and translation-right fields
- safety review state
- policy route links
- reviewer queue links
- evaluator fixture links
- exportable audit evidence

## Boundary

This ledger is a prototype planning surface. It is not final scholarship, safety approval, moderation policy, source licensing, legal approval, or production governance.

## Next Step

v0.4.6 adds Life Map so personal-life calm routes can stay source-backed, bounded, and local-only in the prototype.

v0.4.7 should turn ledger and life-map records into a source governance and consent schema with clear fields for production data, review identity, privacy controls, and audit history.
