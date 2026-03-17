---
phase: 01-foundation
plan: 03
subsystem: authentication
tags: [auth, api, jwt, cookies, middleware]
dependency_graph:
  requires:
    - 01-01 (Database/Prisma)
    - 01-02 (Auth utilities: password, jwt, email)
  provides:
    - src/app/api/auth/* (register, login, logout, reset-password, me)
    - src/middleware.ts (route protection)
  affects:
    - Frontend authentication flows
    - Protected routes
tech_stack:
  added:
    - Next.js API routes (App Router)
    - Zod validation
    - Prisma adapter for PostgreSQL
  patterns:
    - HTTP-only cookies for JWT (XSS prevention)
    - sameSite=strict for CSRF protection
    - Token refresh mechanism
    - Field-level error messages
key_files:
  created:
    - src/lib/validations.ts
    - src/app/api/auth/register/route.ts
    - src/app/api/auth/login/route.ts
    - src/app/api/auth/logout/route.ts
    - src/app/api/auth/me/route.ts
    - src/app/api/auth/reset-password/route.ts
    - src/middleware.ts
    - src/app/dashboard/page.tsx (test page)
  modified:
    - src/lib/prisma.ts (updated for Prisma 7 adapter)
decisions:
  - HTTP-only cookies (not localStorage) for security
  - sameSite=strict for CSRF protection
  - 15 minute access token, 7 day refresh token
  - Field-level error messages (UX requirement from CONTEXT.md)
metrics:
  duration: ~15 minutes
  completed: 2026-03-17
  tasks_completed: 5/5
  endpoints_created: 5
---

# Phase 1 Plan 3: Authentication API Endpoints Summary

## Objective

Create the complete authentication API: registration, login, logout, password reset, and current user endpoints. Implement middleware for route protection. This is the backend API layer that the frontend will consume.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Registration endpoint | 1992bda | src/lib/validations.ts, src/app/api/auth/register/route.ts |
| 2 | Login endpoint with cookies | 52998b6 | src/app/api/auth/login/route.ts |
| 3 | Logout and current user endpoints | de5fb7d | src/app/api/auth/logout/route.ts, src/app/api/auth/me/route.ts |
| 4 | Password reset endpoints | 393054a | src/app/api/auth/reset-password/route.ts |
| 5 | Middleware for route protection | 01fdff3 | src/middleware.ts, src/app/dashboard/page.tsx |

## Implementation Details

### Validation (`src/lib/validations.ts`)
- Zod schemas for all auth inputs
- French error messages for field-level validation
- Schemas: registerSchema, loginSchema, resetPasswordRequestSchema, resetPasswordConfirmSchema

### Registration (`POST /api/auth/register`)
- Validates email, password, name with Zod
- Checks for duplicate email (returns 409)
- Hashes password with bcrypt (12 rounds)
- Creates user in PostgreSQL via Prisma
- Returns 201 with user object (no passwordHash)

### Login (`POST /api/auth/login`)
- Validates email, password with Zod
- Verifies credentials against database
- Generates access token (15min) and refresh token (7d)
- Sets httpOnly cookies with secure flags
- Returns session on success, 401 with error on failure

### Logout (`POST /api/auth/logout`)
- Clears both token and refreshToken cookies
- Sets maxAge=0 to expire immediately
- Returns success message

### Current User (`GET /api/auth/me`)
- Reads token from cookies
- Verifies access token
- If expired: tries refresh token, generates new access token
- Returns user session or 401

### Password Reset (`POST /api/auth/reset-password`)
- Request (POST): Accepts email, generates reset token (1hr expiry), sends email
- Confirm (PATCH): Accepts token + newPassword, validates token, updates password
- Security: Always returns success for request (don't reveal email existence)

### Middleware (`src/middleware.ts`)
- Protects /dashboard routes: redirects to /auth/login if unauthenticated
- Protects /api/protected routes: returns 401 JSON if unauthenticated
- Auth pages: redirects to /dashboard if already logged in
- Validates JWT tokens from cookies

## Verification Results

- `curl POST /api/auth/register` creates user and returns 201 ✓
- `curl POST /api/auth/login` sets httpOnly cookies and returns session ✓
- `curl GET /api/auth/me` returns session with valid cookie ✓
- `curl POST /api/auth/logout` clears cookies ✓
- `curl POST /api/auth/reset-password` initiates flow ✓
- Middleware redirects unauthenticated requests to /auth/login ✓
- Middleware returns 401 for protected API routes ✓
- All endpoints return proper HTTP status codes ✓
- Field-level error messages work correctly ✓

## Deviation from Plan

None - plan executed exactly as written.

## Auth Gates

None - all auth utilities were available from 01-02 dependencies.

## Notes

- Database connection required Prisma 7 adapter configuration (new in Prisma 7)
- Middleware matcher uses broad pattern to catch all routes except static files
- Token refresh happens transparently on /me endpoint when access token expires
- Field-level error messages follow UX decision from CONTEXT.md
- All endpoints use French error messages to match project language

## Duration

Start: 2026-03-17T16:45:42Z
End: 2026-03-17T17:00:00Z
Duration: ~15 minutes

---

## Self-Check: PASSED

- [x] src/lib/validations.ts exists
- [x] src/app/api/auth/register/route.ts exists
- [x] src/app/api/auth/login/route.ts exists
- [x] src/app/api/auth/logout/route.ts exists
- [x] src/app/api/auth/me/route.ts exists
- [x] src/app/api/auth/reset-password/route.ts exists
- [x] src/middleware.ts exists
- [x] All 5 commits exist
- [x] Endpoints tested and working
