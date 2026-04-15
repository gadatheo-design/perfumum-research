# PERFUMUM — Journal des Modifications

> **Projet de recherche sur 10 ans (2025-2035)**  
> Ce fichier trace toutes les modifications significatives du projet.

---

## Format des entrées

```
## [Date] - Titre de la session
### Ajouts
- Nouvelles fonctionnalités

### Modifications
- Changements apportés

### Corrections
- Bugs corrigés

### Problèmes non résolus
- Issues en suspens

### Notes
- Observations importantes
```

---

## [2025-12-15] - Documentation et Sécurisation

### Ajouts
- `KNOWN_ISSUES.md` — Documentation des problèmes techniques récurrents
- `DEVELOPMENT_GUIDE.md` — Guide de développement pour les futures sessions
- `PROJECT_INSTRUCTIONS.md` — Instructions à copier dans Manus
- `CHANGELOG.md` — Ce fichier de suivi des modifications

### Problèmes non résolus
- **Bug Vite critique** : Écran blanc sur les pages de comparaison
  - Pages affectées : `/compare-terpenes`, `/compare-molecules-advanced`, `/comparateur-avance`
  - Erreur : `@vitejs/plugin-react can't detect preamble`
  - Cause : Non identifiée
  - Impact : Fonctionnalités de comparaison inaccessibles

### Notes
- Session consacrée principalement au debugging (infructueux) puis à la documentation
- Le bug Vite semble préexistant et non lié aux modifications de cette session
- Priorité donnée à la documentation pour éviter de répéter les mêmes erreurs

---

## [2025-12-XX] - Sessions précédentes (à compléter)

### Notes
- Le projet a été développé sur plusieurs sessions
- L'historique détaillé des sessions précédentes n'est pas disponible
- Les fonctionnalités principales sont en place :
  - Page d'accueil avec présentation des gammes
  - Base de données de 131 molécules
  - Base de données de 142 recettes
  - Navigation par gammes (Pétrichor, Volcanique, etc.)
  - Système d'authentification Manus OAuth

---

## Template pour les futures sessions

```markdown
## [AAAA-MM-JJ] - Titre descriptif

### Contexte
- Objectif de la session
- Demande de l'utilisateur

### Ajouts
- 

### Modifications
- 

### Corrections
- 

### Problèmes rencontrés
- 

### Problèmes non résolus
- 

### Temps passé
- Estimation du temps de travail effectif

### Notes
- Observations, recommandations pour les futures sessions
```

---

*Dernière mise à jour : 15 décembre 2025*
