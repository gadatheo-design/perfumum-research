# PERFUMUM — Instructions pour Manus AI

> **COPIER CE CONTENU DANS LES PROJECT_INSTRUCTIONS DU PROJET MANUS**

---

## 🎯 Contexte du Projet

PERFUMUM est un projet de recherche olfactive sur **10 ans (2025-2035)** développé par ABSORBE, laboratoire atmosphérique olfactif basé à Berne. Ce n'est PAS un projet web classique à livrer rapidement — c'est une plateforme de recherche scientifique et artistique qui évoluera sur une décennie.

**Priorités absolues :**
1. **Stabilité** > Nouvelles fonctionnalités
2. **Documentation** > Vitesse de développement
3. **Prudence** > Innovation risquée

---

## ⚠️ AVERTISSEMENTS TECHNIQUES CRITIQUES

### 1. LIRE AVANT TOUTE ACTION
Avant toute modification du code, **OBLIGATOIREMENT** lire :
- `/home/ubuntu/perfumum-research/KNOWN_ISSUES.md` — Problèmes récurrents
- `/home/ubuntu/perfumum-research/DEVELOPMENT_GUIDE.md` — Guide de développement
- `/home/ubuntu/perfumum-research/todo.md` — État des tâches

### 2. PROBLÈME VITE RÉCURRENT
Le projet a un bug Vite qui cause des **écrans blancs** sur certaines pages (notamment les comparateurs). 
- **Erreur** : `@vitejs/plugin-react can't detect preamble`
- **Action** : Si ce problème survient, **NE PAS passer plus de 15 minutes** à le débugger
- **Réaction** : Informer l'utilisateur immédiatement et proposer une alternative

### 3. RÈGLE DES 3 TENTATIVES
Ne JAMAIS répéter la même action plus de 3 fois. Si une solution ne fonctionne pas après 3 essais :
1. Arrêter immédiatement
2. Documenter le problème dans KNOWN_ISSUES.md
3. Informer l'utilisateur
4. Proposer une approche alternative

### 4. RÈGLE DES 15 MINUTES
Si un problème technique bloque le travail pendant plus de 15 minutes :
1. Informer l'utilisateur du blocage
2. Expliquer ce qui a été tenté
3. Demander s'il faut continuer ou passer à autre chose
4. **NE PAS** continuer à tourner en rond silencieusement

---

## 📋 Workflow Obligatoire

### Début de session
1. `webdev_check_status` — Vérifier l'état du serveur
2. Lire `KNOWN_ISSUES.md` — Problèmes connus
3. Lire `todo.md` — Tâches en cours
4. Tester la page d'accueil — S'assurer que le site fonctionne

### Avant de créer une nouvelle page
1. Tester les pages similaires existantes
2. Si elles ne fonctionnent pas → STOP, informer l'utilisateur
3. Copier la structure d'une page fonctionnelle
4. Tester après chaque modification

### Fin de session
1. Mettre à jour `todo.md` avec l'état des tâches
2. Documenter tout nouveau problème dans `KNOWN_ISSUES.md`
3. Créer un checkpoint si des modifications ont été faites
4. Résumer clairement ce qui a été fait et ce qui reste à faire

---

## 🏗️ Architecture du Projet

```
/home/ubuntu/perfumum-research/
├── client/src/pages/      # Pages React
├── client/src/components/ # Composants UI
├── server/routers.ts      # API tRPC
├── drizzle/schema.ts      # Schéma BDD
├── KNOWN_ISSUES.md        # ⚠️ Problèmes connus
├── DEVELOPMENT_GUIDE.md   # Guide technique
└── todo.md                # Tâches en cours
```

### Stack technique
- React 19 + Vite + TypeScript
- Tailwind CSS 4 + shadcn/ui
- tRPC 11 + Express 4
- Drizzle ORM + MySQL/TiDB
- Manus OAuth (authentification)

---

## 🎨 Les 5 Gammes PERFUMUM

1. **Pétrichor** — Terre, minéral, pluie (60 variations)
2. **Volcanique** — Fumée, pyrolyse, intensité (36 variations)
3. **Traditions Olfactives** — Sacré, culturel, rituel (26 traditions)
4. **Glaciaire** — Fraîcheur, ozone, altitude (en développement)
5. **Bio-Lab** — Expérimental, biotechnologie

---

## 📊 Objectifs du Projet (10 ans)

| Objectif | Cible | État actuel |
|----------|-------|-------------|
| Gammes olfactives | 5 | 5 (structure) |
| Molécules documentées | 131+ | ~131 |
| Recettes expérimentales | 142+ | ~142 |
| Traditions culturelles | 26 | 26 |
| Accords | 25+ | ~25 |

---

## ❌ Ce qu'il ne faut JAMAIS faire

1. **Modifier les fichiers `server/_core/*`** — Infrastructure critique
2. **Supprimer des données sans backup** — Projet de recherche irremplaçable
3. **Ignorer les erreurs de console** — Toujours investiguer
4. **Promettre des délais** — Ce projet n'a pas d'urgence
5. **Sacrifier la stabilité pour la vitesse** — La pérennité prime

---

## ✅ Ce qu'il faut TOUJOURS faire

1. **Documenter** — Tout problème, toute solution
2. **Tester** — Avant et après chaque modification
3. **Communiquer** — Informer l'utilisateur régulièrement
4. **Sauvegarder** — Checkpoints fréquents
5. **Respecter la temporalité** — 10 ans, pas 10 jours

---

*Document créé le 15 décembre 2025*
*À copier dans les project_instructions du projet Manus*
