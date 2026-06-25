# VedaPath Production Bridge Seed

This is the v0.6.0 Production Bridge preview for VedaPath AI.

## Product Question

Which prototype records are safe to move toward production storage, and what gates must exist before anything becomes durable?

## What It Adds

- A production bridge workspace for record families.
- Route decisions for source records, review records, user calm records, and voice/audio records.
- Visible storage lane, consent need, audit state, readiness score, and required gates.
- Copyable bridge brief, schema JSON, and boundary note.
- A clear distinction between planning and live infrastructure.

## Why It Matters

VedaPath now has many useful prototype rooms. The next risk is pretending a prototype is production.

The bridge keeps the sequence honest:

- Source records can be planned first because they are citation-led and not personal memory.
- Review records need identity and access rules before authority.
- User calm records need consent, export, deletion, and ownership.
- Audio waits for rights review, pronunciation review, and ritual-boundary review.

## Production Routes

### Source Records

Decision:

- Eligible for schema draft.

Required:

- Stable id.
- Citation.
- Source family.
- Language layer.
- Allowed use.
- Missing fields.
- Review state.
- Rollback path.

### Review Records

Decision:

- Eligible after access gate.

Required:

- Reviewer identity.
- Reviewer role.
- Scope.
- Evidence note.
- Decision state.
- Release id.
- Rollback link.

### User Calm Records

Decision:

- Hold for consent and account model.

Required:

- Explicit user owner.
- Consent grant.
- Export path.
- Delete path.
- Revoke path.
- Sensitive-context rules.

### Voice And Audio Records

Decision:

- Blocked from production.

Required:

- License proof.
- Rights owner.
- Reuse terms.
- Pronunciation reviewer.
- Boundary reviewer.
- No ritual-instruction claim.

## Must Not

- Treat static prototype pages as production infrastructure.
- Persist personal calm records before consent and access controls.
- Promote audio before rights and reviewer gates.
- Let review records imply authority without role, scope, evidence, and rollback.
- Let production storage blur source categories.

## v0.6.1 Source Storage

v0.6.1 adds the Source Record Storage Plan with canonical source tables, translation layers, review links, retrieval indexes, fixtures, and no-go checks. v0.6.2 adds the Reviewer Identity and Access Gate with scoped reviewer roles, permission scopes, display policy, private identity stance, and blocked powers. v0.6.3 adds the Public Feedback Intake with source issue, category confusion, UX friction, boundary concern, review-ticket handoff, and blocked private-intake rules. v0.6.4 should add a Launch Story Room with audience variants, founder copy, no-go claims, and source-first launch boundaries.

