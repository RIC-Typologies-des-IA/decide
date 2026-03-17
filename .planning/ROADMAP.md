# Roadmap: Decide - Outil d'Intelligence Collective

**Created:** 2025-03-17
**Granularity:** Standard
**Total Phases:** 8

## Phases Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation | Infrastructure et authentification | AUTH-01 to AUTH-04 | 4 |
| 2 | Espaces Décision | CRUD des espaces décision | DECS-01 to DECS-06 | 6 |
| 3 | Participation | Système d'invitation et accès | PART-01 to PART-05 | 5 |
| 4 | Discussion | Système de commentaires threadés | DISC-01 to DISC-07 | 7 |
| 5 | Propositions | Alternatives et amendements | PROP-01 to PROP-05 | 5 |
| 6 | Vote | Mécanismes de vote et consensus | VOTE-01 to VOTE-07 | 7 |
| 7 | Visualisation | Dashboard et indicateurs engagement | VIZU-01 to VIZU-04 | 4 |
| 8 | Notifications | Système d'emails et alertes | NOTF-01 to NOTF-04 | 4 |

**Total v1 requirements:** 43 | **All mapped:** ✓

---

## Phase 1: Foundation

**Goal:** Mettre en place l'infrastructure technique et l'authentification des utilisateurs

**Requirements:**
- AUTH-01: User can create account with email and password
- AUTH-02: User can log in and stay logged in across sessions
- AUTH-03: User can reset password via email link
- AUTH-04: User can log out from any page

**Success Criteria:**
1. Un utilisateur peut créer un compte, recevoir l'email de confirmation, et se connecter
2. La session persiste après fermeture du navigateur (token JWT valide)
3. Le reset de mot de passe fonctionne de bout en bout
4. L'API est sécurisée (authentification requise pour endpoints protégés)
5. La base de données est initialisée avec schéma users
6. Tests automatisés couvrent les flux auth principaux

**Dependencies:** None (foundation)

**Estimated Complexity:** Medium

**Plans:** 5 plans in 5 waves

Plans:
- [ ] 01-01-PLAN.md — Database & Infrastructure (PostgreSQL + Prisma setup)
- [ ] 01-02-PLAN.md — Auth Utilities (password, JWT, email)
- [ ] 01-03-PLAN.md — Auth API Endpoints (register, login, logout, reset)
- [ ] 01-04-PLAN.md — Auth Frontend UI (wizard, forms, minimalist design)
- [ ] 01-05-PLAN.md — Tests (unit, integration, E2E)

---

## Phase 2: Espaces Décision

**Goal:** Permettre aux utilisateurs de créer et gérer des espaces de décision

**Requirements:**
- DECS-01: User can create a decision space with title and description
- DECS-02: User can set decision deadline
- DECS-03: User can configure decision method (vote/consensus)
- DECS-04: User can view list of their decision spaces
- DECS-05: User can archive completed decisions
- DECS-06: User can delete decision spaces

**Success Criteria:**
1. Un utilisateur connecté peut créer un nouvel espace décision avec titre, description, deadline
2. Le créateur peut choisir le mode (vote ou consensus)
3. La liste des espaces décision s'affiche avec statut (actif/archivé)
4. Le créateur peut archiver une décision terminée
5. Le créateur peut supprimer définitivement un espace
6. Les validations de formulaires fonctionnent (titre requis, date future...)

**Dependencies:** Phase 1 (authentification nécessaire)

**Estimated Complexity:** Medium

---

## Phase 3: Participation

**Goal:** Permettre d'inviter des participants et gérer les accès

**Requirements:**
- PART-01: User can invite participants via email invitation
- PART-02: User can invite participants via shareable link
- PART-03: Invited user can join without creating account (guest mode)
- PART-04: User can view list of participants in a decision
- PART-05: User can see who has participated and who hasn't

**Success Criteria:**
1. Le créateur peut envoyer des invitations par email
2. Un lien d'invitation partageable peut être généré
3. Un invité peut participer sans créer de compte (guest avec nom/email)
4. La liste des participants est visible dans l'espace décision
5. L'indicateur "a participé/pas encore participé" est visible
6. Les permissions sont correctement gérées (créateur vs participant vs guest)

**Dependencies:** Phase 2 (besoin des espaces décision)

**Estimated Complexity:** Medium-High

---

## Phase 4: Discussion

**Goal:** Implémenter le système de discussion threadée

**Requirements:**
- DISC-01: Participant can post comment in decision space
- DISC-02: Participant can reply to existing comment (threaded)
- DISC-03: Participant can react to comments (emoji)
- DISC-04: Participant can edit their own comments
- DISC-05: Participant can delete their own comments
- DISC-06: Comments display author and timestamp
- DISC-07: Discussion auto-closes when decision is finalized

**Success Criteria:**
1. Les participants peuvent poster des commentaires
2. Les réponses sont threadées (arborescence visible)
3. Les réactions emoji fonctionnent sur les commentaires
4. Un utilisateur peut modifier/supprimer ses propres commentaires
5. Les commentaires affichent l'auteur et la date
6. La discussion se ferme automatiquement quand la décision est finalisée
7. La UI est responsive et agréable (scroll, collapse threads...)

**Dependencies:** Phase 3 (besoin des participants)

**Estimated Complexity:** High

---

## Phase 5: Propositions

**Goal:** Permettre les propositions alternatives et amendements

**Requirements:**
- PROP-01: Participant can propose alternative to main proposal
- PROP-02: Participant can propose amendment to existing proposal
- PROP-03: Proposals display author, timestamp, and support count
- PROP-04: Participant can support/unsupport a proposal
- PROP-05: Creator can mark proposal as "under consideration" or "rejected"

**Success Criteria:**
1. Les participants peuvent créer des propositions alternatives
2. Les amendements peuvent être proposés sur des propositions existantes
3. Les propositions affichent leur soutien (nombre de supporters)
4. Les participants peuvent soutenir/retirer leur soutien
5. Le créateur peut gérer le statut des propositions
6. L'interface distingue clairement proposition principale et alternatives

**Dependencies:** Phase 4 (discussion en place pour débattre des propositions)

**Estimated Complexity:** High

---

## Phase 6: Vote

**Goal:** Implémenter les mécanismes de vote et de consensus

**Requirements:**
- VOTE-01: Participant can cast vote on final proposal
- VOTE-02: Participant can change vote before deadline
- VOTE-03: System displays vote results in real-time (to participants)
- VOTE-04: Creator can configure voting options (yes/no, multi-choice, score)
- VOTE-05: System enforces deadline and auto-closes voting
- VOTE-06: Creator can manually close voting and finalize decision
- VOTE-07: Final decision result is displayed to all participants

**Success Criteria:**
1. Les participants peuvent voter selon le mode configuré
2. Un participant peut changer son vote avant la deadline
3. Les résultats sont visibles en temps réel (si configuré)
4. Les différents modes de vote fonctionnent (binaire, choix multiple, scoring)
5. La fermeture automatique à la deadline fonctionne
6. Le créateur peut clôturer manuellement
7. Le résultat final est affiché clairement avec statistiques

**Dependencies:** Phase 5 (propositions définissent ce sur quoi on vote)

**Estimated Complexity:** High

---

## Phase 7: Visualisation

**Goal:** Créer le dashboard et les indicateurs d'engagement

**Requirements:**
- VIZU-01: Decision space shows participation level (who contributed)
- VIZU-02: Visual indicator of consensus level (if consensus mode)
- VIZU-03: Timeline view of decision progress
- VIZU-04: Simple dashboard with active/completed decisions

**Success Criteria:**
1. Le niveau de participation est visible (qui a commenté/voté)
2. Un indicateur visuel montre le niveau de consensus
3. Une timeline montre l'évolution de la décision (création, jalons)
4. Un dashboard personnel liste les décisions actives et terminées
5. Les graphiques sont clairs et informatifs
6. L'UX encourage la participation via la visualisation

**Dependencies:** Phase 6 (besoin des données de vote pour visualiser)

**Estimated Complexity:** Medium

---

## Phase 8: Notifications

**Goal:** Mettre en place le système d'emails et alertes

**Requirements:**
- NOTF-01: Participants receive email when invited to decision
- NOTF-02: Participants receive email when decision reaches deadline (reminder)
- NOTF-03: Participants receive email when decision is finalized
- NOTF-04: Creator receives digest of new activity (daily summary)

**Success Criteria:**
1. Les emails d'invitation sont envoyés et reçus
2. Un rappel est envoyé avant la deadline
3. Notification envoyée quand la décision est finalisée
4. Le créateur reçoit un résumé quotidien des activités
5. Les emails sont bien formatés et professionnels
6. Les préférences de notification peuvent être configurées (opt-out)

**Dependencies:** Phase 7 (besoin du système fonctionnel pour notifier)

**Estimated Complexity:** Medium

---

## Technical Notes

### Stack Suggéré (à valider lors de la planification des phases)
- **Frontend:** React/Next.js ou Vue/Nuxt
- **Backend:** Node.js/Express ou Python/FastAPI
- **Database:** PostgreSQL
- **Auth:** JWT ou session-based
- **Email:** SendGrid ou Resend
- **Hosting:** Vercel/Netlify (frontend) + Railway/Render (backend)

### Architecture
- API RESTful ou GraphQL
- WebSockets pour temps réel (si synchrone ajouté plus tard)
- File storage pour éventuelles pièces jointes (v2)

### Contraintes à garder en tête
- RGPD compliance (données utilisateurs)
- Scalabilité (pas nécessaire v1 mais architecture propre)
- Responsive design (mobile-first)

---

*Last updated: 2025-03-17 after roadmap creation*
