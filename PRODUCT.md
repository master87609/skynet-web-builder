# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

next.js 14 app router, react 18, tailwind css, express + typescript engine, node 20+

## Users

Non-technical people who want a live website without writing code. Primary job: describe a site in plain language and have AI agents build and deploy it. Users log in, manage projects in a dashboard, and review/build/deploy sites.

## Product Purpose

Skynet lets non-coders create and deploy professional websites by describing them in plain language. A team of specialist agents handles requirements, product strategy, UX, UI design, frontend/backend code, content, QA, security, and SEO. Success = a visitor can reach a live, deployed site from a plain-language brief with zero code written by the user.

## Positioning

The product mechanism a neighboring website builder could not truthfully copy: a multi-agent orchestration layer that decomposes a plain-language brief into 13 department workstreams with hard dependency ordering, quality gates per department, and a deploy gate requiring QA/security/SEO approval before any site goes live. The user never touches code, design tools, or server configuration.

## Operating Context

User flow: log in → describe site → project created → agents build in dependency order → review status/artifacts → check deploy gate → deploy to `<project-id>.skynet.app`. Dev server runs on localhost:3000 (web) and localhost:3001 (engine API). Projects persist under `docs/projects/<id>/` (reference layout) or `data/projects/<id>/` (this implementation).

## Capabilities and Constraints

- Auth: email/password register, login, logout, session cookie
- Project CRUD: create from brief, list own projects, view status/artifacts
- Department delegation with dependency-order enforcement
- Quality gates per department (qa.md, security.md, seo.md required for deploy)
- Deploy gate: all three reports approved, no P0 blockers, then deploy
- No visual system defined yet (incumbent design is generic Tailwind, flagged as AI-looking by user)

## Brand Commitments

Name: Skynet. Tone: professional, capable, non-coding-first. No existing logo, color palette, or typography commitment. The project name "Skynet" was pinned by the user.

## Evidence on Hand

Reference project at /home/Ujjwal/Projects/OpenCode/Skynet/ with AGENTS.md orchestration protocol, 13 department agent definitions, 79 skills, 3 commands (/skynet-build, /skynet-status, /skynet-deploy), engine (Express + TS), web (Next.js + Tailwind), templates, infra. This implementation is a from-scratch build in /home/Ujjwal/Projects/Website-builder(Skynet)/ with engine + web packages, auth, project dashboard, login, project detail, and deploy-gate UI.

## Product Principles

1. No code required — the user never writes HTML, CSS, or JavaScript.
2. Professional output — sites must look designed, not generated.
3. Agent orchestration — every department has a defined artifact and quality gate.
4. Deploy is gated — nothing ships until QA, security, and SEO are approved.
5. User owns their data — projects persist per-account, no cross-user leakage.

## Accessibility & Inclusion

WCAG 2.2 AA contrast and keyboard operability are product requirements (from reference NFR-001). No specific user needs beyond general accessibility were established.
