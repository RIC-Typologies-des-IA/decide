# Phase 1: Foundation - Context

**Gathered:** 2025-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Infrastructure technique et authentification utilisateur. Mise en place de la base de données, création des endpoints API, et implémentation complète du système d'authentification (inscription, connexion, reset password, déconnexion). C'est la fondation sur laquelle toutes les autres phases s'appuient.

</domain>

<decisions>
## Implementation Decisions

### UX des formulaires d'authentification
- **Wizard étape par étape** — Pas de formulaire unique avec tous les champs, mais un processus guidé (ex: email → mot de passe → confirmation)
- **Validation à la soumission** — Les champs sont validés quand l'utilisateur clique sur "Continuer" ou "Soumettre", pas en temps réel à chaque frappe
- **Design minimaliste** — Style épuré type Google/Linear : blanc, champs épurés, pas d'illustrations superflues
- **Messages d'erreur sous chaque champ** — Feedback explicite positionné directement sous le champ concerné, pas d'alerte globale

### Claude's Discretion
- Choix exact des frameworks et librairies (React vs Vue, Node vs Python, etc.)
- Architecture détaillée (monolithique vs microservices)
- Méthode technique d'authentification (JWT vs sessions)
- Validation email (obligatoire ou optionnelle pour v1)
- Structure exacte des pages (landing intégrée vs pages dédiées)
- Gestion précise des états de chargement et transitions
- Wording exact des messages et labels

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- N/A — Projet nouveau, pas de code existant à réutiliser

### Established Patterns
- N/A — Première phase, les patterns seront établis ici

### Integration Points
- Cette phase établit les fondations : base de données, API, et système d'auth seront utilisés par toutes les phases suivantes
- Les endpoints auth créés ici seront consommés par le frontend des phases 2-8

</code_context>

<specifics>
## Specific Ideas

- **Wizard guidé** : L'utilisateur avait spécifiquement demandé "processus guidé étape par étape" (contrairement aux outils existants complexes)
- **Minimalisme** : Style épuré, sans friction d'apprentissage — référence implicite à Linear/Google
- **Convivialité** : L'objectif principal du produit Decide est d'être "convivial" et de réduire la friction

</specifics>

<deferred>
## Deferred Ideas

- **Email verification obligatoire** — Pourrait être optionnel en v1 puis obligatoire plus tard (à décider par Claude selon complexité)
- **2FA/MFA** — Hors scope v1, considéré pour v2+
- **OAuth (Google, GitHub)** — Explicitement hors scope (Out of Scope dans PROJECT.md)
- **Magic links** — Non mentionné, pourrait être une alternative v2
- **Rate limiting avancé** — Protection basique suffisante v1

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2025-03-17*
