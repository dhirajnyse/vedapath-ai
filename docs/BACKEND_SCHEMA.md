# VedaPath Backend Schema Draft

This is the v0.5.2 backend schema draft for VedaPath AI.

It converts Trust Model and Calm Passport into the first production data contract. The goal is not to create durable memory quickly. The goal is to make durable memory difficult to misuse.

## Core Principle

No source-backed answer, calm pattern, correction, shared note, or user memory should become durable until the system can show:

- the source trace
- the consent grant
- the passport grant
- the route verdict
- the review decision when needed
- the export path
- the deletion or withdrawal path
- the trust event audit trail

## Draft Tables

### source_seed

Reviewed source record for retrieval and answer grounding.

Required fields:

- `seed_id`
- `source_family`
- `citation`
- `boundary`
- `review_status`

### consent_grant

Visible consent record for shared, account-backed, or durable memory.

Required fields:

- `grant_id`
- `participant_ref`
- `purpose`
- `scope`
- `withdrawal_path`

### memory_route

Decision record that routes incoming data to local draft, review, ledger, durable storage, or blocked state.

Required fields:

- `route_id`
- `record_type`
- `verdict`
- `source_trace`
- `delete_path`

### review_decision

Human review decision for corrections, flagged passages, and source behavior changes.

Required fields:

- `decision_id`
- `reviewer_ref`
- `evidence_ref`
- `decision`
- `applies_to`

### trust_event

Audit trail for source, consent, memory, review, export, deletion, withdrawal, and blocked-route events.

Required fields:

- `event_id`
- `event_type`
- `actor_ref`
- `record_ref`
- `reason`

### calm_pattern

Optional account-backed calm rhythm record, based only on deliberate user signals.

Required fields:

- `pattern_id`
- `user_ref`
- `chosen_state`
- `source_seed_id`
- `carry_action`

### passport_grant

User-facing control record for what VedaPath may remember, must not remember, and can export or delete.

Required fields:

- `passport_id`
- `record_type`
- `may_remember`
- `must_not_remember`
- `control_state`

## Relationship Spine

The initial backend should preserve this order:

1. `source_seed` anchors answer authority.
2. `consent_grant` makes durable or shared memory visible.
3. `passport_grant` tells the user what memory controls exist.
4. `memory_route` decides local, review, ledger, durable, or blocked.
5. `review_decision` protects source behavior changes.
6. `trust_event` records the change trail.
7. `calm_pattern` stays optional, user-owned, and reversible.

## No-Go Rules

- No hidden profile table.
- No distress archive.
- No durable memory without export and deletion path.
- No source behavior change without review decision.
- No account-backed calm pattern without explicit consent and passport controls.
- No production claim that the schema is live before backend storage exists.

## v0.5.3 Fixture Pack

v0.5.3 adds schema fixtures and validation checks:

- JSON sample rows for all seven tables
- route validation examples
- deletion request lifecycle
- export payload shape
- review-decision fixture
- no-go test cases for hidden profiling and distress retention

## v0.5.4 Evaluation Drill

v0.5.4 adds the Evaluation Drill Room, which runs user-facing answer drafts, backend fixture checks, and no-go cases together before a release is considered safe.

## v0.5.5 Learning Loop

v0.5.5 adds the Learning Loop Seed, turning repeated question patterns, reviewer decisions, source gaps, and blocked learning boundaries into visible product improvement without hidden profiling or private identity inference.

## v0.5.6 Direction

The next release should add a Sanskrit Lens seed with transliteration, word meaning, meter, translation notes, and recitation boundaries.
