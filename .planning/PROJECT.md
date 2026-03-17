# Decide - Outil d'Intelligence Collective

## What This Is

Une application web conviviale qui aide les équipes d'entreprise à prendre des décisions opérationnelles de manière collaborative. Le processus guidé permet de lancer un sujet, d'encourager la discussion, et d'arriver à un consensus ou un vote structuré. Contrairement aux outils existants (Loomio, Slido) qui manquent d'engagement, Decide rend la prise de décision collective plus participative et visuelle.

## Core Value

Les équipes peuvent prendre des décisions opérationnelles rapidement avec une participation réelle de tous les membres, pas juste les plus vocaux.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Créer un espace décision avec sujet et contexte
- [ ] Inviter des participants (lien, email)
- [ ] Discussion structurée avec réponses threadées
- [ ] Propositions alternatives et amendements
- [ ] Mécanisme de vote/consensus configurable
- [ ] Visualisation des opinions et positionnements
- [ ] Décision finale et archivage
- [ ] Tableau de bord des décisions en cours/passées

### Out of Scope

- Intégrations tierces (Slack, Teams) — priorité v2
- Authentification SSO entreprise complexe — email/password suffisant v1
- Mode temps réel synchrone — asynchrone prioritaire
- IA pour synthétiser discussions — manuel d'abord
- Applications mobiles natives — web responsive v1

## Context

Besoin identifié : les outils existants (Loomio, Slido, Doodle) manquent de convivialité et d'engagement pour les équipes qui veulent prendre des décisions opérationnelles rapidement. Le processus doit être guidé pour éviter la friction d'apprentissage.

Public cible : équipes d'entreprise de 3 à 50 personnes qui prennent des décisions opérationnelles régulièrement (priorisation, choix fournisseurs, organisation).

## Constraints

- **Tech stack**: Web moderne (React/Vue + backend)
- **Timeline**: v1 fonctionnelle en 2-3 mois
- **Budget**: Développement lean, pas de features nice-to-have
- **Complexité**: MVP minimal, un seul flux décisionnel bien fait

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Focus décisions opérationnelles (pas stratégiques) | Plus fréquent, moins critique, bon pour MVP | — Pending |
| Processus asynchrone prioritaire | Réduit la friction temporelle, plus adapté au travail hybride | — Pending |
| Engagement > fonctionnalités | Meilleur que la concurrence sur l'expérience, pas le nombre de features | — Pending |

---
*Last updated: 2025-03-17 after project initialization*
