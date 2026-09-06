# Lottery MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a locally runnable lottery information website MVP focused on 双色球 with latest/history data, analysis, entertainment-only number generation, news, and admin status pages.

**Architecture:** Use a Next.js app with server-side data access through Prisma. Local development uses SQLite so the user can run it immediately; the schema keeps names and boundaries compatible with the planned PostgreSQL migration. Business logic is split into data access, analysis, prediction, crawler, and UI components.

**Tech Stack:** Next.js, React, TypeScript, Prisma, SQLite, Vitest, Recharts, plain CSS modules/global CSS.

## Global Constraints

- MVP must run locally as a website.
- Focus on 双色球 first.
- No online lottery sales, payment, purchasing, following bets, or paid prediction features.
- Predictions are entertainment-only rule-based number generation, with disclaimer text on page.
- Use official/open data source when available, and fallback seed data when network fetch fails.
- Keep files focused and test core data/analysis/prediction behavior.

---

## File Structure

- `prisma/schema.prisma`: local SQLite data model.
- `prisma/seed.ts`: seed database with built-in 双色球 sample history and starter news.
- `src/lib/types.ts`: shared domain types.
- `src/lib/sample-data.ts`: deterministic sample data for offline local demo.
- `src/lib/analysis.ts`: pure analysis helpers.
- `src/lib/prediction.ts`: pure prediction helpers.
- `src/lib/data.ts`: Prisma-backed reads and dashboard aggregation.
- `src/lib/crawler.ts`: official-source fetch, parse, validate, and upsert helpers.
- `src/app/**`: pages and route handlers.
- `src/components/**`: reusable display components.
- `src/__tests__/**`: Vitest behavior tests.

---

## Tasks

1. Project configuration, Prisma schema, seed data, and shared types.
2. Analysis and prediction modules with tests.
3. Data access and crawler refresh API with offline fallback.
4. Frontend pages for home, 双色球 history/detail/analysis/predict, news, admin, disclaimer.
5. Verification: seed, tests, build, and local run instructions.

---

## Self Review

- Covers MVP pages from PRD.
- Covers local run requirement.
- Keeps compliance limitations explicit.
- Does not implement user accounts, paid features, or all彩种 expansion.
