# Implementation Plan: Enroll Web

**Branch**: `HEAD` | **Date**: 2026-05-17 | **Spec**: [spec.md](file:///home/jefffangedu/myCode/26summer/specs/001-enroll-web/spec.md)

**Input**: Feature specification from `/specs/001-enroll-web/spec.md`

## Summary

Build a simple and intuitive student registration and course booking website featuring passwordless login (Name + Birthday), an interactive 6-week calendar booking system, and automated LINE Notify alerts. We will use Next.js for a unified frontend/backend experience.

## Technical Context

**Language/Version**: TypeScript / Node.js (v20+)

**Primary Dependencies**: Next.js (App Router), Prisma, date-fns (for calendar logic)

**Storage**: Vercel Postgres (Serverless PostgreSQL via Prisma ORM)

**Testing**: Jest / React Testing Library

**Target Platform**: Web Browser (Mobile & Desktop)

**Project Type**: Full-Stack Web Application

**Performance Goals**: Fast interactive calendar rendering, < 500ms API responses

**Constraints**: Vanilla CSS for styling, no complex authentication (just exact match of Name + Birthday)

**Scale/Scope**: Local/Small scale (few concurrent users, manageable via SQLite)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Vanilla CSS is used instead of Tailwind (Project Guidelines)
- [x] Clear and vibrant UI is planned (Project Guidelines)

## Project Structure

### Documentation (this feature)

```text
specs/001-enroll-web/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js Application Structure
src/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── api/              # Backend Endpoints
│   ├── (auth)/           # Login/Registration Pages
│   └── (dashboard)/      # Calendar Booking Pages
├── components/           # Reusable React Components (Calendar, Modal, etc.)
├── lib/                  # Utilities (Prisma client, LINE Notify logic)
└── styles/               # Vanilla CSS files (index.css)

prisma/
└── schema.prisma         # Database schema
```

**Structure Decision**: A single Next.js project repository structure was selected as it perfectly fits the need for both an interactive React frontend and API routes to handle database queries and LINE Notify requests without managing two separate codebases.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | Using a standard Next.js monolith keeps complexity low. |
