# Evaluation Dashboard

Evaluation Dashboard turns the v0.4.1 answer checker into a release gate.

It answers one practical question:

Can the product prove that its evaluator blocks the right answers and passes the right answers before launch?

## Product Role

Evaluation Runner checks one draft.

Evaluation Dashboard checks a suite of draft types:

- careful source-cited answers
- category confusion
- modern proof overclaims
- unsafe calm advice
- ritual authority
- missing boundary cases
- missing citation cases

## Why It Matters

VedaPath should not only say it is source-first.

It should show the user and reviewer that trust behavior is testable.

The dashboard makes the trust model visible without making the UI complicated.

## Current Prototype

The v0.4.2 release includes:

- deterministic answer test suite
- expected versus actual status
- pass, revision, and hold filters
- blocked example list
- source-family confusion count
- safety boundary count
- modern proof overclaim count
- ritual authority count
- reviewer-ready export

## Release Gate Meaning

Passing the dashboard means the prototype evaluator behaved as expected against the sample suite.

It does not mean:

- the source corpus is complete
- the translations are production licensed
- human scholarship review is done
- safety policy is complete
- the app is ready to answer unrestricted user questions

## Production Requirements

Before a real launch, the dashboard should become:

- versioned evaluation fixtures
- server-side test execution
- reviewer identity and decision history
- source edition and translation policy checks
- regression reports before deployment
- blocked answer review queue and source policy route
- exportable audit evidence

## Next Step

v0.4.3 adds Reviewer Queue, which turns failed examples, flagged passages, retrieval gaps, and user correction notes into human-review cards before accepted knowledge changes. v0.4.4 adds Source Policy Console so blocked examples also show the future answer rule they need. v0.4.5 adds Trust Ledger so those rules and review outcomes can become visible governance records before behavior changes.
