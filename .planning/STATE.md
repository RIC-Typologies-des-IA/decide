# Project State: Decide

**Last Updated:** 2026-03-17
**Current Phase:** 1 — Foundation (plan 01-03 complete)
**Overall Progress:** 30%

## Project Reference

See: .planning/PROJECT.md (updated 2025-03-17)

**Core value:** Les équipes peuvent prendre des décisions opérationnelles rapidement avec une participation réelle de tous les membres, pas juste les plus vocaux.
**Current focus:** Phase 1 — Foundation (Authentication & Infrastructure)

## Phase Status

| Phase | Status | Progress | Dependencies |
|-------|--------|----------|--------------|
| 1 — Foundation | ✓ Complete | 30% | None |
| 2 — Espaces Décision | ○ Pending | 0% | Phase 1 |
| 3 — Participation | ○ Pending | 0% | Phase 2 |
| 4 — Discussion | ○ Pending | 0% | Phase 3 |
| 5 — Propositions | ○ Pending | 0% | Phase 4 |
| 6 — Vote | ○ Pending | 0% | Phase 5 |
| 7 — Visualisation | ○ Pending | 0% | Phase 6 |
| 8 — Notifications | ○ Pending | 0% | Phase 7 |

**Legend:** ○ Pending | ◆ In Progress | ✓ Complete

## Blockers

None

## Decisions Log

- **2026-03-17**: Decided to use Prisma 7 with new `prisma.config.ts` approach (URL not in schema.prisma)
- **2026-03-17**: Selected PostgreSQL 16 Alpine for Docker container with volume persistence
- **2026-03-17**: Use jose instead of jsonwebtoken for Edge runtime compatibility in Next.js App Router
- **2026-03-17**: Use bcryptjs for cross-platform password hashing compatibility
- **2026-03-17**: Use Resend for email service (dev mode logs to console)
- **2026-03-17**: Use Prisma 7 with @prisma/adapter-pg for PostgreSQL connection
- **2026-03-17**: HTTP-only cookies for JWT storage (security requirement)

## Context Notes

### Important Context for Agents

When planning/executing phases, remember:

1. **Focus utilisateur:** Le succès = une équipe peut prendre une décision en moins de 30 minutes de setup + participation
2. **Guidé:** Chaque étape doit guider l'utilisateur, pas le laisser deviner
3. **Engagement:** L'objectif est que tout le monde participe, pas juste les plus vocaux
4. **Asynchrone prioritaire:** Le mode synchrone/temps réel est pour v2

### Technical Reminders

- Commencer simple : single-tenant, pas de multi-org v1
- Email/password auth suffisant, pas de SSO complexe v1
- PostgreSQL recommandé pour relations complexes (participants, votes, threads)

## Next Actions

1. Move to Phase 2 - Espaces Décision
2. Or run `/gsd-plan-phase 1` to create additional plans for Foundation phase

---

*Document maintained by GSD workflow. Update after each phase completion.*
