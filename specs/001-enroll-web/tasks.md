# Implementation Tasks: Enroll Web

**Branch**: `main` | **Date**: 2026-05-17 | **Plan**: [plan.md](file:///home/jefffangedu/myCode/26summer/specs/001-enroll-web/plan.md)

## Phase 1: Project Setup & Database
- [x] Initialize Next.js app (App Router, TypeScript) in the repository root.
- [x] Configure Vanilla CSS with modern, vibrant variables and tokens.
- [x] Setup Prisma ORM and configure `schema.prisma` for Vercel Postgres.
- [x] Create `User` and `Booking` models in Prisma (including `@@unique([userId, date])` and `@@unique([date, slot])`).
- [x] Implement database utility functions (user lookup, booking creation).
- [ ] Write unit/integration tests for Prisma models to ensure constraints hold.

## Phase 2: Backend API & Services
- [x] Create `/api/auth/login` endpoint for passwordless authentication (Name + Birthday).
- [x] Create `/api/auth/verify-companion` endpoint to verify if a companion student is registered.
- [x] Implement session management (secure cookies) for the authenticated user.
- [x] Create `/api/bookings` GET endpoint to fetch calendar availability.
- [x] Create `/api/bookings` POST endpoint to create bookings (handles single and companion bookings using Prisma `$transaction`).
- [x] Integrate LINE Notify API in a service module and trigger it on successful booking.
- [ ] Write API tests for all endpoints.

## Phase 3: Frontend Components & UI
- [x] Create Login/Registration view (`app/page.tsx`).
- [x] Create Calendar Dashboard view (`app/dashboard/page.tsx`).
- [x] Build interactive Calendar component using `date-fns` (6 weeks, weekdays only).
- [x] Add '兩人同行' (Companion Mode) toggle with real-time name verification.
- [x] Build Day Slot component (adjusts to require 2 slots if companion mode is active).
- [x] Build Confirmation Modal for booking actions.
- [x] Connect frontend to API routes and handle loading/error states.

## Phase 4: Final Polish & Verification
- [ ] Ensure mobile responsiveness.
- [ ] Verify LINE Notify message format matches the spec exactly.
- [ ] End-to-end testing of the full user flow.
