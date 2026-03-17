# Requirements: Decide - Outil d'Intelligence Collective

**Defined:** 2025-03-17
**Core Value:** Les équipes peuvent prendre des décisions opérationnelles rapidement avec une participation réelle de tous les membres, pas juste les plus vocaux.

## v1 Requirements

### Authentication & Comptes

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across sessions
- [ ] **AUTH-03**: User can reset password via email link
- [ ] **AUTH-04**: User can log out from any page

### Espaces Décision

- [ ] **DECS-01**: User can create a decision space with title and description
- [ ] **DECS-02**: User can set decision deadline
- [ ] **DECS-03**: User can configure decision method (vote/consensus)
- [ ] **DECS-04**: User can view list of their decision spaces
- [ ] **DECS-05**: User can archive completed decisions
- [ ] **DECS-06**: User can delete decision spaces

### Participation

- [ ] **PART-01**: User can invite participants via email invitation
- [ ] **PART-02**: User can invite participants via shareable link
- [ ] **PART-03**: Invited user can join without creating account (guest mode)
- [ ] **PART-04**: User can view list of participants in a decision
- [ ] **PART-05**: User can see who has participated and who hasn't

### Discussion

- [ ] **DISC-01**: Participant can post comment in decision space
- [ ] **DISC-02**: Participant can reply to existing comment (threaded)
- [ ] **DISC-03**: Participant can react to comments (emoji)
- [ ] **DISC-04**: Participant can edit their own comments
- [ ] **DISC-05**: Participant can delete their own comments
- [ ] **DISC-06**: Comments display author and timestamp
- [ ] **DISC-07**: Discussion auto-closes when decision is finalized

### Propositions

- [ ] **PROP-01**: Participant can propose alternative to main proposal
- [ ] **PROP-02**: Participant can propose amendment to existing proposal
- [ ] **PROP-03**: Proposals display author, timestamp, and support count
- [ ] **PROP-04**: Participant can support/unsupport a proposal
- [ ] **PROP-05**: Creator can mark proposal as "under consideration" or "rejected"

### Vote & Consensus

- [ ] **VOTE-01**: Participant can cast vote on final proposal
- [ ] **VOTE-02**: Participant can change vote before deadline
- [ ] **VOTE-03**: System displays vote results in real-time (to participants)
- [ ] **VOTE-04**: Creator can configure voting options (yes/no, multi-choice, score)
- [ ] **VOTE-05**: System enforces deadline and auto-closes voting
- [ ] **VOTE-06**: Creator can manually close voting and finalize decision
- [ ] **VOTE-07**: Final decision result is displayed to all participants

### Visualisation Engagement

- [ ] **VIZU-01**: Decision space shows participation level (who contributed)
- [ ] **VIZU-02**: Visual indicator of consensus level (if consensus mode)
- [ ] **VIZU-03**: Timeline view of decision progress
- [ ] **VIZU-04**: Simple dashboard with active/completed decisions

### Notifications

- [ ] **NOTF-01**: Participants receive email when invited to decision
- [ ] **NOTF-02**: Participants receive email when decision reaches deadline (reminder)
- [ ] **NOTF-03**: Participants receive email when decision is finalized
- [ ] **NOTF-04**: Creator receives digest of new activity (daily summary)

## v2 Requirements

### Intégrations

- **INTG-01**: Slack integration (create decision from Slack)
- **INTG-02**: Microsoft Teams integration
- **INTG-03**: Calendar integration for deadlines

### Fonctionnalités Avancées

- **ADVN-01**: Templates de décision prédéfinis
- **ADVN-02**: Historique et analytics des décisions
- **ADVN-03**: Mode synchrone (temps réel)
- **ADVN-04**: Export des décisions (PDF)

### Administration

- **ADMIN-01**: SSO enterprise (SAML, OIDC)
- **ADMIN-02**: Gestion des équipes et permissions avancées
- **ADMIN-03**: Branding personnalisé

## Out of Scope

| Feature | Reason |
|---------|--------|
| IA pour synthétiser discussions | Complexité technique, pas critique pour MVP |
| Applications mobiles natives | Web responsive suffisant v1, coût élevé |
| Vidéoconférence intégrée | Hors scope, utiliser Zoom/Meet externe |
| Paiements intégrés | Pas de monétisation v1 |
| Multi-tenancy complexe | Architecture simple single-tenant v1 |
| Modération automatisée | Manuel suffisant pour taille équipes cible |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| DECS-01 | Phase 2 | Pending |
| DECS-02 | Phase 2 | Pending |
| DECS-03 | Phase 2 | Pending |
| DECS-04 | Phase 2 | Pending |
| DECS-05 | Phase 2 | Pending |
| DECS-06 | Phase 2 | Pending |
| PART-01 | Phase 3 | Pending |
| PART-02 | Phase 3 | Pending |
| PART-03 | Phase 3 | Pending |
| PART-04 | Phase 3 | Pending |
| PART-05 | Phase 3 | Pending |
| DISC-01 | Phase 4 | Pending |
| DISC-02 | Phase 4 | Pending |
| DISC-03 | Phase 4 | Pending |
| DISC-04 | Phase 4 | Pending |
| DISC-05 | Phase 4 | Pending |
| DISC-06 | Phase 4 | Pending |
| DISC-07 | Phase 4 | Pending |
| PROP-01 | Phase 5 | Pending |
| PROP-02 | Phase 5 | Pending |
| PROP-03 | Phase 5 | Pending |
| PROP-04 | Phase 5 | Pending |
| PROP-05 | Phase 5 | Pending |
| VOTE-01 | Phase 6 | Pending |
| VOTE-02 | Phase 6 | Pending |
| VOTE-03 | Phase 6 | Pending |
| VOTE-04 | Phase 6 | Pending |
| VOTE-05 | Phase 6 | Pending |
| VOTE-06 | Phase 6 | Pending |
| VOTE-07 | Phase 6 | Pending |
| VIZU-01 | Phase 7 | Pending |
| VIZU-02 | Phase 7 | Pending |
| VIZU-03 | Phase 7 | Pending |
| VIZU-04 | Phase 7 | Pending |
| NOTF-01 | Phase 8 | Pending |
| NOTF-02 | Phase 8 | Pending |
| NOTF-03 | Phase 8 | Pending |
| NOTF-04 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0 ✓

---
*Requirements defined: 2025-03-17*
*Last updated: 2025-03-17 after initial definition*
