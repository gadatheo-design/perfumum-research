# AUDIT RADICAL — PROJET PERFUMUM
## 8 Janvier 2026

---

## RÉSUMÉ EXÉCUTIF

**Verdict global : Le projet est fonctionnel mais souffre de problèmes structurels majeurs qui compromettent sa viabilité à 10 ans.**

| Métrique | Valeur | Évaluation |
|----------|--------|------------|
| Molécules | 556 | ⚠️ 62% sans liaisons |
| Plantes | 144 | ⚠️ 83% sans liaisons |
| Terroirs | 29 | ⚠️ 34% sans plantes |
| Liaisons mol-plantes | 4 | ❌ Critique |
| Qualité données mol. | 25% CAS | ❌ Insuffisant |
| Pages frontend | 120+ | ⚠️ Fragmentation |
| Sessions de dev | 70+ | ⚠️ Accumulation |

---

## 1. DIAGNOSTIC BRUTAL

### 1.1 La base de données est un cimetière de données orphelines

**Constat radical :**
- **384 molécules (69%)** n'ont aucune liaison (ni recette, ni plante)
- **120 plantes (83%)** n'ont aucune liaison (ni molécule, ni terroir)
- **10 terroirs (34%)** n'ont aucune plante associée
- **Seulement 4 liaisons molécules-plantes** sur 556 molécules

**Cause racine :** Le développement a privilégié l'ajout de données brutes sans créer les relations. C'est comme avoir une bibliothèque où les livres ne sont pas classés.

### 1.2 Les doublons révèlent un problème de gouvernance

**Avant nettoyage :**
- 50 groupes de molécules en double par nom
- 18 groupes en double par CAS number
- α-pinène existait en 5 exemplaires différents

**Après nettoyage :**
- 56 molécules supprimées
- 4 plantes supprimées
- Certains doublons impossibles à supprimer (contraintes FK non gérées)

**Cause racine :** Pas de validation à l'entrée, pas de recherche de doublons avant import, pas de normalisation des noms.

### 1.3 L'interface est fragmentée

**120+ pages React** créées, dont :
- Des pages de test jamais supprimées (`/test-trpc`, `/test-simple`, `/test-minimal`)
- Des routes en double (`/plantes` et `/plants`, `/terroirs/:id` et `/terroirs`)
- Des pages admin dispersées sans cohérence
- Aucune page d'administration centralisée pour l'entrée de données

**Cause racine :** Développement réactif session par session sans vision d'ensemble.

### 1.4 Le code accumule de la dette technique

**70+ sessions de développement** documentées dans todo.md, avec :
- Des tâches marquées "complétées" mais partiellement implémentées
- Des phases numérotées de façon incohérente
- Des fonctionnalités annoncées mais jamais finalisées

---

## 2. PROBLÈMES CRITIQUES À RÉSOUDRE

### 2.1 ❌ CRITIQUE : Pas d'interface d'entrée de données pour les collègues

**Situation actuelle :**
- Seul vous avez accès à Manus
- Vos 5 collègues ne peuvent pas contribuer
- L'ajout de données passe par des scripts SQL ou des imports CSV manuels

**Impact :** Le projet ne peut pas être collaboratif. Vous êtes le goulot d'étranglement.

### 2.2 ❌ CRITIQUE : Les liaisons sont quasi-inexistantes

| Type de liaison | Existantes | Potentielles | Taux |
|-----------------|------------|--------------|------|
| Molécule → Recette | 973 | ~5000 | 19% |
| Molécule → Plante | 4 | ~2000 | 0.2% |
| Plante → Terroir | 41 | ~500 | 8% |

**Impact :** La base de données ne permet pas de répondre aux questions de recherche fondamentales :
- "Quelles molécules trouve-t-on dans le Protium ?" → Réponse partielle
- "Quelles plantes poussent en Amazonie ?" → Réponse incomplète
- "Quelle est la composition chimique de cette recette ?" → Données manquantes

### 2.3 ⚠️ IMPORTANT : Qualité des données scientifiques

| Champ | Rempli | Manquant |
|-------|--------|----------|
| CAS Number | 25% | 75% |
| Nom IUPAC | 18% | 82% |
| Classe chimique | 28% | 72% |
| Formule | 66% | 34% |
| Profil olfactif | 94% | 6% |

**Impact :** Les données ne sont pas exploitables pour une recherche scientifique sérieuse.

---

## 3. STRATÉGIE DE TRAVAIL AUTONOME (5 COLLÈGUES)

### 3.1 Architecture proposée

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE PUBLIQUE                        │
│  (Consultation : molécules, plantes, recettes, terroirs)    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    ESPACE CONTRIBUTEUR                       │
│  (Authentification requise - 5 collègues + vous)            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Ajouter      │  │ Ajouter      │  │ Créer        │       │
│  │ Molécule     │  │ Plante       │  │ Liaison      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Ajouter      │  │ Ajouter      │  │ Import       │       │
│  │ Recette      │  │ Terroir      │  │ CSV/Excel    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    ESPACE ADMIN (vous seul)                  │
│  - Validation des contributions                              │
│  - Fusion des doublons                                       │
│  - Export/Backup                                             │
│  - Gestion des utilisateurs                                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Rôles et permissions

| Rôle | Peut créer | Peut modifier | Peut supprimer | Peut valider |
|------|------------|---------------|----------------|--------------|
| **Admin** (vous) | ✅ Tout | ✅ Tout | ✅ Tout | ✅ Tout |
| **Contributeur** (collègues) | ✅ Brouillons | ✅ Ses brouillons | ❌ Non | ❌ Non |
| **Lecteur** (public) | ❌ Non | ❌ Non | ❌ Non | ❌ Non |

### 3.3 Workflow de contribution

```
1. Collègue crée une entrée (statut: "brouillon")
        ↓
2. Système vérifie les doublons potentiels
        ↓
3. Si doublon détecté → Alerte + suggestion de fusion
        ↓
4. Admin reçoit notification
        ↓
5. Admin valide ou demande corrections
        ↓
6. Entrée publiée (statut: "validé")
```

### 3.4 Fonctionnalités requises à implémenter

| Priorité | Fonctionnalité | Effort | Impact |
|----------|----------------|--------|--------|
| P0 | Formulaire ajout molécule avec recherche doublon | 2j | Critique |
| P0 | Formulaire ajout plante avec recherche doublon | 2j | Critique |
| P0 | Interface de création de liaisons | 3j | Critique |
| P1 | Système de brouillons/validation | 2j | Important |
| P1 | Import CSV avec prévisualisation | 2j | Important |
| P2 | Notifications admin | 1j | Utile |
| P2 | Historique des modifications | 1j | Utile |

---

## 4. ROADMAP 2026-2035

### Phase 1 : Consolidation (Jan-Mar 2026) — URGENT

| Semaine | Objectif | Livrable |
|---------|----------|----------|
| S1-2 | Interface contributeur basique | Formulaires molécules/plantes |
| S3-4 | Système de liaisons | Interface drag-drop liaisons |
| S5-6 | Validation doublons | Recherche automatique + fusion |
| S7-8 | Import CSV amélioré | Upload + prévisualisation + validation |
| S9-10 | Tests utilisateurs | 5 collègues testent le système |
| S11-12 | Corrections | Bugs et UX |

### Phase 2 : Enrichissement (Avr-Déc 2026)

| Trimestre | Focus | Objectif |
|-----------|-------|----------|
| T2 | Liaisons | 50% des molécules liées à des plantes |
| T3 | Données scientifiques | 50% des molécules avec CAS + IUPAC |
| T4 | Terroirs | Tous les terroirs avec plantes associées |

### Phase 3 : Expansion (2027-2028)

- Intégration API PubChem pour enrichissement automatique
- Module de prédiction olfactive (ML)
- Application mobile pour terrain
- Collaboration avec laboratoires externes

### Phase 4 : Maturité (2029-2035)

- Publication scientifique des données
- API publique pour chercheurs
- Intégration avec bases de données internationales
- Formation de nouveaux contributeurs

---

## 5. ACTIONS IMMÉDIATES (Cette semaine)

### 5.1 Aujourd'hui

1. ✅ Nettoyage des doublons (fait)
2. ⬜ Créer la page `/admin/contributeur` avec formulaire molécule
3. ⬜ Ajouter la recherche de doublons en temps réel

### 5.2 Cette semaine

4. ⬜ Créer le formulaire plante avec validation
5. ⬜ Créer l'interface de liaison molécule-plante
6. ⬜ Tester avec un collègue

### 5.3 Ce mois

7. ⬜ Déployer l'interface contributeur
8. ⬜ Former les 5 collègues
9. ⬜ Établir le workflow de validation

---

## 6. RECOMMANDATIONS RADICALES

### 6.1 Arrêtez d'ajouter des données sans liaisons

> **Règle d'or :** Toute nouvelle molécule DOIT être liée à au moins une plante OU une recette. Toute nouvelle plante DOIT être liée à au moins un terroir.

### 6.2 Priorisez la qualité sur la quantité

Mieux vaut 100 molécules complètes (CAS, IUPAC, formule, liaisons) que 600 molécules orphelines.

### 6.3 Centralisez l'entrée de données

Une seule interface, un seul workflow, une seule source de vérité.

### 6.4 Documentez les décisions

Chaque session de développement devrait produire :
- Un changelog clair
- Les décisions prises et pourquoi
- Les problèmes rencontrés

### 6.5 Testez avant de déployer

Actuellement, les fonctionnalités sont développées sans tests systématiques. Résultat : des bugs découverts tardivement.

---

## 7. MÉTRIQUES DE SUCCÈS

### Court terme (3 mois)

| Métrique | Actuel | Cible |
|----------|--------|-------|
| Liaisons mol-plantes | 4 | 200 |
| Molécules avec CAS | 25% | 50% |
| Collègues actifs | 0 | 5 |

### Moyen terme (1 an)

| Métrique | Actuel | Cible |
|----------|--------|-------|
| Liaisons mol-plantes | 4 | 1000 |
| Molécules avec CAS | 25% | 80% |
| Contributions/mois | 0 | 50 |

### Long terme (5 ans)

| Métrique | Actuel | Cible |
|----------|--------|-------|
| Molécules documentées | 556 | 5000 |
| Plantes documentées | 144 | 1000 |
| Publications scientifiques | 0 | 5 |

---

## CONCLUSION

Le projet PERFUMUM a un potentiel énorme, mais il est actuellement dans un état de **dette technique et de données** qui compromet sa viabilité à long terme.

**Les 3 priorités absolues sont :**

1. **Interface contributeur** — Permettre aux 5 collègues de contribuer
2. **Liaisons** — Connecter les données existantes
3. **Qualité** — Enrichir les données scientifiques

Sans ces 3 éléments, le projet restera une collection de données isolées plutôt qu'une véritable base de connaissances.

---

*Rapport généré le 8 janvier 2026*
*Prochaine révision recommandée : 8 février 2026*


---

## ANNEXE A : AXES DE RECHERCHE IMPLÉMENTÉS

### A.1 Axes actuellement documentés

| Axe | Tables | Pages | Données | État |
|-----|--------|-------|---------|------|
| **Prototypes C1-C4** | prototypes | 5 pages | 4 entrées | ✅ Complet |
| **Molécules** | molecules | 10+ pages | 556 entrées | ⚠️ Orphelines |
| **Recettes** | recettes | 5+ pages | 266 entrées | ✅ Fonctionnel |
| **Plantes** | plants | 8+ pages | 144 entrées | ⚠️ Orphelines |
| **Terroirs** | terroirs | 3 pages | 29 entrées | ⚠️ Incomplet |
| **San Andrés / Seaflower** | leaf_economies, terp_profiles | 10+ pages | 26 entrées | ✅ Complet |
| **Civilisations** | civilisations | 2 pages | ? entrées | ⚠️ Partiel |
| **Tabacs & Résines** | tabacs | 2 pages | 25 entrées | ✅ Fonctionnel |
| **Bibliographie** | references_v3 | 5+ pages | ? entrées | ⚠️ Partiel |
| **Conservation** | geographic_zones, sustainable_alternatives | 3 pages | ? entrées | ⚠️ Partiel |

### A.2 Axes à développer (priorité haute)

| Axe | Justification | Effort estimé |
|-----|---------------|---------------|
| **Liaisons mol-plantes** | 0.2% de couverture actuelle | 2 semaines |
| **Enrichissement CAS/IUPAC** | 25% de couverture actuelle | 1 semaine (API) |
| **Interface contributeur** | Bloquant pour collaboration | 2 semaines |

### A.3 Axes à développer (priorité moyenne)

| Axe | Justification | Effort estimé |
|-----|---------------|---------------|
| **Chemotypes** | 28 entrées, potentiel 200+ | 1 semaine |
| **Méthodes d'extraction** | 7 entrées, potentiel 50+ | 3 jours |
| **Variétés botaniques** | 74 entrées, potentiel 500+ | 2 semaines |

---

## ANNEXE B : HISTORIQUE DES SESSIONS DE DÉVELOPPEMENT

### B.1 Chronologie

| Date | Session | Focus principal | Résultat |
|------|---------|-----------------|----------|
| 29 Déc 2025 | Initiale | Routing, import données | ✅ |
| 03 Jan 2026 | San Andrés | Leaf economies, TerpProfiles | ✅ |
| 03 Jan 2026 | Recherche | Sources scientifiques | ✅ |
| 04 Jan 2026 | Géocodage | Origines moléculaires | ⚠️ Partiel |
| 04 Jan 2026 | Tabac/Cannabis | Plantes fumables | ✅ |
| 04 Jan 2026 | Navigation | Audit liens | ⚠️ Partiel |
| 05 Jan 2026 | Court/Moyen/Long terme | Roadmap | ✅ |
| 05 Jan 2026 | Cartographie | Overlays géographiques | ⚠️ Partiel |
| 05 Jan 2026 | Conservation | Espèces menacées | ✅ |
| 06 Jan 2026 | Bibliographie | Système références | ⚠️ Partiel |
| 06 Jan 2026 | Navigabilité | Hyperliens | ⚠️ Partiel |
| 06 Jan 2026 | GPS/Recettes | Tagetes lucida | ✅ |
| 07 Jan 2026 | Citations | Graphe interactif | ⚠️ Partiel |
| 07 Jan 2026 | Mambe | Intégration Colombie | ✅ |
| 08 Jan 2026 | Protium/Amazonie | Terpènes, Terroir | ✅ |
| 08 Jan 2026 | Audit | Nettoyage, Stratégie | ✅ |

### B.2 Patterns observés

**Positif :**
- Développement itératif régulier
- Documentation des tâches dans todo.md
- Checkpoints fréquents

**Négatif :**
- Sessions trop nombreuses sans consolidation
- Fonctionnalités partiellement implémentées
- Pas de tests systématiques
- Accumulation de dette technique

---

## ANNEXE C : SCHÉMA DE BASE DE DONNÉES SIMPLIFIÉ

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    MOLECULES    │     │     PLANTS      │     │    TERROIRS     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ name            │     │ name            │     │ name            │
│ cas_number      │     │ latin_name      │     │ country         │
│ iupac_name      │     │ family          │     │ region          │
│ chemical_class  │     │ category        │     │ climate_type    │
│ ...             │     │ ...             │     │ ...             │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │    ┌──────────────────┴───────────────────┐   │
         │    │     MOLECULE_PLANT_SOURCES           │   │
         │    │     (4 entrées seulement!)           │   │
         │    └──────────────────────────────────────┘   │
         │                       │                       │
         │    ┌──────────────────┴───────────────────┐   │
         │    │        PLANT_TERROIRS                │   │
         │    │        (41 entrées)                  │   │
         │    └──────────────────────────────────────┘   │
         │
         │    ┌──────────────────────────────────────┐
         └────┤      MOLECULES_RECETTES              │
              │      (973 entrées)                   │
              └──────────────────────────────────────┘
```

**Problème visualisé :** Les liaisons entre molécules et plantes sont quasi-inexistantes (4 sur potentiellement 2000+).

---

## ANNEXE D : CHECKLIST AVANT CHAQUE SESSION

### D.1 Avant de commencer

- [ ] Lire le dernier rapport d'audit
- [ ] Vérifier les tâches en cours dans todo.md
- [ ] Identifier l'objectif précis de la session
- [ ] Estimer le temps nécessaire

### D.2 Pendant la session

- [ ] Documenter chaque décision importante
- [ ] Tester chaque fonctionnalité avant de passer à la suivante
- [ ] Créer des checkpoints réguliers
- [ ] Ne pas commencer une nouvelle fonctionnalité si la précédente n'est pas terminée

### D.3 Après la session

- [ ] Mettre à jour todo.md avec les tâches complétées
- [ ] Documenter les problèmes rencontrés
- [ ] Créer un checkpoint final
- [ ] Planifier la prochaine session

---

## ANNEXE E : GUIDE DE CONTRIBUTION (POUR VOS COLLÈGUES)

### E.1 Ajouter une molécule

1. Aller sur `/admin/molecules/new`
2. Remplir les champs obligatoires :
   - Nom (vérifier qu'il n'existe pas déjà)
   - Famille chimique
   - Profil olfactif
3. Remplir les champs recommandés :
   - CAS Number (rechercher sur PubChem)
   - Formule chimique
   - Poids moléculaire
4. **IMPORTANT** : Lier à au moins une plante source
5. Soumettre pour validation

### E.2 Ajouter une plante

1. Aller sur `/plants/new`
2. Remplir les champs obligatoires :
   - Nom commun
   - Nom latin
   - Famille botanique
   - Catégorie
3. Remplir les champs recommandés :
   - Origine géographique
   - Signature olfactive
   - Usage traditionnel
4. **IMPORTANT** : Lier à au moins un terroir
5. Soumettre pour validation

### E.3 Créer une liaison

1. Aller sur `/relations-molecule-plante`
2. Sélectionner la molécule
3. Sélectionner la plante source
4. Indiquer :
   - Partie de la plante (feuille, fleur, résine...)
   - Pourcentage dans l'huile essentielle (si connu)
   - Méthode d'extraction
5. Soumettre

### E.4 Bonnes pratiques

- **Toujours vérifier les doublons** avant d'ajouter
- **Citer vos sources** (PubChem, articles, livres)
- **Être précis** : mieux vaut "inconnu" que faux
- **Poser des questions** en cas de doute

---

*Fin du rapport d'audit*
