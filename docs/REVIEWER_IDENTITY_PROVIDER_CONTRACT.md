# v4.9.9 Reviewer Identity Provider Contract

## Purpose

An OIDC-style claim validator now checks issuer, audience, pseudonymous subject, one-hour expiry, AAL2 assurance, bounded roles, revocation, and direct-identity exclusion before any reviewer capability is returned.

## What Changed

Adds a pure reviewer claim validator, deterministic role-to-capability mapping, issuer and audience enforcement, AAL2 and lifetime checks, pseudonymous subjects, revocation handling, direct identity rejection, and permanent denial of publication, registry merge, invitations, activation, and public launch.

## Acceptance Checks

node --check scripts/vedapath-reviewer-identity-contract.mjs; valid, wrong issuer, wrong audience, expired, overlong, revoked, direct-identity, missing-AAL2, unsupported-role, allowed-capability, denied-capability, and permanent-lock assertions; batch checker through v4.9.9.

## Known Risks

Private-pilot implementation evidence only; no provider account, credentials, endpoint, live identity provider, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Reviewer Identity Provider Contract
Protocol shape: OIDC-style claims
Subject: pseudonymous reviewer id
Assurance: AAL2 required
Lifetime: 60 minutes maximum
Revocation: required
Direct identity claims: rejected
Roles: observer, source reviewer, rights reviewer, release reviewer
Publish, merge, invite, activate, public launch: always denied
Identity provider connected: false
