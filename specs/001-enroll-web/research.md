# Phase 0: Research & Technical Decisions

## Decision: Full-Stack Framework
- **Decision**: Next.js (App Router)
- **Rationale**: The app requires both a frontend (interactive calendar) and a backend (database interactions, LINE Notify integration). Next.js provides a unified environment to build both React UI and API endpoints efficiently.
- **Alternatives considered**: Vite + Express (rejected because it requires managing two separate projects and servers).

## Decision: Database
- **Decision**: Vercel Postgres (Serverless PostgreSQL via Prisma ORM)
- **Rationale**: For a Next.js application deployed on Vercel, Vercel Postgres provides a seamless zero-configuration database that is serverless and highly scalable. It integrates perfectly with Prisma and Next.js, and the generous free tier is more than sufficient for the required scale.
- **Alternatives considered**: SQLite (rejected because local file-based SQLite is incompatible with Vercel's ephemeral serverless environment).

## Decision: Styling
- **Decision**: Vanilla CSS
- **Rationale**: Selected to maintain flexibility and adhere to project styling guidelines.

## Decision: Authentication
- **Decision**: Custom "passwordless" session via Next.js API
- **Rationale**: The spec defines a very specific auth flow (Name + Birthday match). We will implement a simple cookie-based session after verifying these details in the database.
