# Evaluation Runner

Evaluation Runner is the first visible quality gate for VedaPath AI answer drafts.

It checks whether an answer is ready to be trusted as a prototype response before the user sees it.

## Product Role

Evaluation Runner answers one practical question:

Should this draft be shown, revised, or held?

It checks for:

- visible citation
- source family label
- boundary or anti-overclaim line
- Oppenheimer source-family confusion
- modern science proof overclaim
- unsafe calm, medical, or therapy replacement language
- ritual or lineage authority

## Why It Matters

VedaPath should not only retrieve sources and review passages. It should also inspect its own answer behavior.

The evaluator makes the product safer in a simple way:

1. Draft an answer.
2. Run checks.
3. Show pass, warning, or hold status.
4. Suggest concrete fixes.
5. Copy an evaluation report.

## Prototype Behavior

The v0.4.1 page lets users test five draft types:

- balanced answer
- category mistake
- modern overclaim
- unsafe calm guidance
- ritual authority

The evaluator produces:

- trust score
- pass, revision, or hold status
- failed checks
- suggested fixes
- copyable report
- local run history

All saved runs are browser-local prototype state.

## Production Requirements

Before evaluation becomes production infrastructure, VedaPath needs:

- versioned evaluation rules
- reviewed test datasets
- source-family confusion tests
- unsafe calm and health-advice tests
- modern overclaim tests
- ritual authority tests
- reviewer override workflow
- regression reporting before release

## Launch Boundary

Evaluation Runner is a prototype quality gate.

It does not replace human scholarship, safety review, source policy, or production monitoring.

## v0.4.2 Dashboard

v0.4.2 turns the evaluator into a visible release dashboard:

- answer test suite
- pass and fail counts
- blocked examples
- source-family confusion report
- safety boundary report
- reviewer-ready export

## Next Step

v0.4.3 connects failed dashboard cases to Reviewer Queue so evaluation failures become human-review cards instead of silent fixes.
