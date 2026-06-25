# VedaPath Source Record Storage Plan

This is the v0.6.1 Source Record Storage Plan for VedaPath AI.

The purpose is simple: store source facts before the product trusts an answer.

## Storage Promise

VedaPath should preserve source identity, citation, source family, allowed use, review state, and retrieval metadata before any answer becomes production behavior.

The first storage lane is about sources, not user memory.

## Record Layers

### source_core

The canonical source record.

Required fields:

- `source_seed_id`
- `source_family`
- `citation`
- `canonical_title`
- `source_language`
- `allowed_use`
- `review_state`
- `boundary_note`

Primary index:

- `source_family + citation`

No-go checks:

- no missing citation
- no blurred family such as calling the Bhagavad Gita a direct Veda
- no hidden allowed use

### translation_layer

The translation and rendering layer tied to a canonical source id.

Required fields:

- `translation_id`
- `source_seed_id`
- `language`
- `text_excerpt`
- `edition_note`
- `translation_note`
- `review_state`

Primary index:

- `source_seed_id + language`

No-go checks:

- no orphan translation
- no claim that one rendering settles every interpretation
- no ritual instruction hidden inside a translation note

### review_link

The reviewer decision link.

Required fields:

- `source_review_link_id`
- `source_seed_id`
- `review_decision_id`
- `review_role`
- `evidence_note`
- `release_id`
- `status`

Primary index:

- `source_seed_id + status`

No-go checks:

- no anonymous production approval
- no single reviewer role approving every dimension
- no silent rollback

### retrieval_index

The search and answer-eligibility layer.

Required fields:

- `retrieval_index_id`
- `source_seed_id`
- `concept_tags`
- `answer_eligibility`
- `source_stack_rank`
- `match_reason`
- `boundary_note`

Primary index:

- `concept_tag + answer_eligibility`

No-go checks:

- no unsupported modern proof claim
- no answer generation from blocked records
- no hidden ranking without visible source-stack reason

## Migration Order

1. Create `source_seed`.
2. Add translation records after source ids are stable.
3. Add review links after reviewer identity and roles are defined.
4. Add retrieval indexes only from reviewed source facts.
5. Add rollback and audit notes before production promotion.

## Fixture Starters

- `gita_2_48`: source practice and calm action candidate.
- `gita_11_32`: Oppenheimer quote correction, Gita not four Vedas.
- `rv_3_62_10`: voice and recitation blocked until rights and pronunciation review.
- `katha_1_3_14`: calm tone review before public calm promotion.

## Product Boundary

This plan does not create durable user memory, accounts, audio files, reviewer identity, or production answer authority.

It only defines how source facts should be shaped before later systems depend on them.

## v0.6.2 Reviewer Access

v0.6.2 adds the Reviewer Identity and Access Gate with scoped reviewer roles, permission scopes, display policy, private identity stance, and blocked powers. v0.6.3 adds the Public Feedback Intake with source issue, category confusion, UX friction, boundary concern, review-ticket handoff, and blocked private-intake rules. v0.6.4 adds the Launch Story Room with audience variants, founder copy, social copy, reviewer ask, no-go claims, and source-first launch boundaries. The five-build sprint now pauses for founder direction before production implementation and licensed audio planning.
