# Implementation Tasks: Enroll Web

**Branch**: `main` | **Date**: 2026-05-17 | **Plan**: [plan.md](file:///home/jefffangedu/myCode/26summer/specs/001-enroll-web/plan.md)

## Phase 1: Project Setup & Database
- [ ] Initialize Next.js app (App Router, TypeScript) in the repository root.
- [ ] Configure Vanilla CSS with modern, vibrant variables and tokens.
- [ ] Setup Prisma ORM and configure `schema.prisma` for Vercel Postgres.
- [ ] Create `User` and `Booking` models in Prisma (including `@@unique([userId, date])` and `@@unique([date, slot])`).
- [ ] Implement database utility functions (user lookup, booking creation).
- [ ] Write unit/integration tests for Prisma models to ensure constraints hold.

## Phase 2: Backend API & Services
- [ ] Create `/api/auth/login` endpoint for passwordless authentication (Name + Birthday).
- [ ] Implement session management (secure cookies) for the authenticated user.
- [ ] Create `/api/bookings` GET endpoint to fetch calendar availability.
- [ ] Create `/api/bookings` POST endpoint to create a booking (enforcing slot limits and daily limits).
- [ ] Integrate LINE Notify API in a service module and trigger it on successful booking.
- [ ] Write API tests for all endpoints.

## Phase 3: Frontend Components & UI
- [ ] Create Login/Registration view (`app/page.tsx`).
- [ ] Create Calendar Dashboard view (`app/dashboard/page.tsx`).
- [ ] Build interactive Calendar component using `date-fns` (6 weeks, weekdays only).
- [ ] Build Day Slot component (2 slots, showing "Available", "Booked", or User's Name).
- [ ] Build Confirmation Modal for booking actions.
- [ ] Connect frontend to API routes and handle loading/error states.

## Phase 4: Final Polish & Verification
- [ ] Ensure mobile responsiveness.
- [ ] Verify LINE Notify message format matches the spec exactly.
- [ ] End-to-end testing of the full user flow.
