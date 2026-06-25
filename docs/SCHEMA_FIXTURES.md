# VedaPath Schema Fixture Pack

This is the v0.5.3 fixture pack for the VedaPath backend trust contract.

The schema draft says what should exist. Fixtures prove how it should behave.

## Purpose

The fixture pack gives future backend work a small set of concrete examples for:

- valid source records
- valid consent records
- blocked memory routes
- review decisions
- deletion receipts
- calm pattern records
- passport grants
- rejected hidden-profile attempts

## Fixture Set

### seed_gita_02_48

Table: `source_seed`

Expected result: pass.

Validates:

- citation exists
- source family is labeled
- answer boundary exists
- review status exists

### grant_calm_pattern_local

Table: `consent_grant`

Expected result: pass.

Validates:

- purpose is visible
- scope is bounded
- withdrawal path exists
- deletion path exists

### route_distress_blocked

Table: `memory_route`

Expected result: blocked.

Validates:

- distress content does not create durable memory
- support boundary is shown
- audit event is minimal
- no therapy, diagnosis, emergency, or risk-profile claim is stored

### decision_source_revision

Table: `review_decision`

Expected result: pass.

Validates:

- reviewer reference exists
- evidence reference exists
- decision is explicit
- target source or rule is named

### event_delete_receipt

Table: `trust_event`

Expected result: pass.

Validates:

- actor exists
- record reference exists
- reason exists
- private deleted content is not retained

### pattern_opt_in_steady

Table: `calm_pattern`

Expected result: pass.

Validates:

- opt-in is linked
- source seed is linked
- no diagnosis exists
- no hidden score exists

### passport_grant_memory_visible

Table: `passport_grant`

Expected result: pass.

Validates:

- may-remember fields are visible
- must-not-remember fields are visible
- export is available
- deletion or withdrawal is available

### no_go_hidden_profile

Table: `no_go_case`

Expected result: fail.

Validates:

- hidden profile attempts are blocked
- distress archive attempts are blocked
- memory without deletion path is blocked
- missing consent is blocked

## Export Shape

Every fixture export should include:

- `product`
- `release`
- `fixture_id`
- `table`
- `verdict`
- `payload`
- `validation_checks`
- `export_shape`

Every fixture export must exclude:

- private chat transcript
- diagnosis
- hidden profile
- distress archive
- personality score
- risk score

## Deletion Lifecycle

The deletion lifecycle should remain simple and visible:

1. Request: user asks to export, withdraw, or delete.
2. Trace: find passport grant, consent grant, memory route, and trust events.
3. Act: block future writes, remove allowed fields, preserve audit minimum.
4. Confirm: return a plain receipt with what changed and what must remain.

## No-Go Tests

These attempts must fail:

- `hidden_profile`
- `distress_archive`
- `memory_without_delete`
- `source_change_without_review`

The product should treat rejected fixtures as success for the trust system.

## v0.5.4 Evaluation Drill

v0.5.4 adds the Evaluation Drill Room, which runs user-facing answer drafts, backend fixture checks, and no-go cases together before a release is considered safe.

## v0.5.5 Learning Loop

v0.5.5 adds the Learning Loop Seed, turning repeated question patterns, reviewer decisions, source gaps, and blocked learning boundaries into visible product improvement without hidden profiling or private identity inference.

## v0.5.6 Sanskrit Lens

v0.5.6 adds the Sanskrit Lens Seed with Sanskrit text, transliteration, word meaning, meter status, translation notes, source URLs, and recitation boundaries.

## v0.5.7 Voice Boundary

v0.5.7 adds the Voice Boundary Seed before any audio, chant, or pronunciation feature: silent pronunciation support, syllable hints, reviewer gate, license gate, and no ritual authority.

## v0.5.8 Direction

v0.5.8 adds the Scholar Review Seed with reviewer roles, evidence notes, decision states, release gates, and copyable review handoffs.

## v0.5.9 Launch Gate

v0.5.9 adds the Launch Gate Seed with public demo readiness, privacy copy, launch notes, scenario decisions, and no-go release gates.

## v0.6.0 Production Bridge

v0.6.0 adds the Production Bridge Seed with record-family routes, storage lanes, consent needs, audit states, readiness scores, and copyable bridge handoffs. v0.6.1 adds the Source Record Storage Plan with canonical source tables, translation layers, review links, retrieval indexes, fixtures, and no-go checks. v0.6.2 adds the Reviewer Identity and Access Gate with scoped reviewer roles, permission scopes, display policy, private identity stance, and blocked powers. v0.6.3 should add a Public Feedback Intake that turns source issues, category confusion, UX friction, and boundary concerns into review tickets.
