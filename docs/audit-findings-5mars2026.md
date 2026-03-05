# Audit PERFUMUM — Findings 5 mars 2026

## Tableau de bord de santé
| Domaine | Score | Tendance |
|---------|-------|----------|
| Intégrité référentielle DB | 10/10 | Stable |
| Complétude données molécules | 5/10 | À améliorer |
| Normalisation taxonomique | 3/10 | **Urgente** |
| Couverture des tests | 9/10 | Excellente |
| Connexion pages/DB | 6/10 | À améliorer |
| Navigation (liens valides) | 9/10 | Bonne |
| Architecture backend | 8/10 | Solide |

## Priorité 1 — Critique
1. **Normaliser le champ `family` des molécules** : 120+ valeurs distinctes → taxonomie cohérente ("Sesquiterpènes" vs "Sesquiterpène" → "Sesquiterpène"). Utiliser `chemical_class` comme référence normative.
2. **Activer le système de validation des molécules** : 100% marquées "valide" sans distinction → différencier brouillon/validé.
3. **Corriger les pages d'import CSV** : namespaces `trpc.importMolecules` et `trpc.importPlants` manquants dans le backend.

## Priorité 2 — Haute
1. **Compléter les `terpene_profile` des 24 recettes cigarillos** manquantes (collections v2.0 et HPF).
2. **Renseigner les descriptions des 32 accords** — champ vide à 100%.
3. **Connecter les tabacs aux terroirs** : 33/42 tabacs sans lien terroir.
4. **Corriger les 2 liens cassés** dans le MegaMenu (`/gammes-hub?tab=petrichor` et `?tab=volcanique`).

## Priorité 3 — Moyenne (dette technique)
1. **Connecter les 38 pages avec données statiques** à la DB (TabacsNiche, TabacsResines, Sourcing*.tsx).
2. **Nettoyer les 93 fichiers de pages non importés** dans App.tsx.
3. **Supprimer ou documenter les 75 tables vides** pour alléger le schéma.
4. **Ajouter des index** sur `molecules.family`, `molecules.chemical_class`, `molecules.name`.
5. **Nettoyer les 12 `console.log`** laissés dans les pages de production.

## Priorité 4 — Basse (long terme)
1. **Enrichir les données PubChem** : seulement 7% des molécules ont un `pubchem_cid`.
2. **Ajouter des tests unitaires** pour les 5 routers non couverts (plant-composition, smiles-cas-enrichment, molecular-synergies, correlations, koppen).
3. **Documenter les pages AbsorbeX** comme pages éditoriales intentionnellement statiques.

## Problèmes spécifiques identifiés
- **75 tables vides** : genomic_sequences, lost_varieties, olfactory_memories, botanical_states, civilizational_timeline
- **471 molécules (45%) sans numéro CAS**
- **844 molécules (81%) sans SMILES**
- **298 molécules (29%) sans chemical_class**
- **33/42 tabacs sans lien terroir** (tabac_terroir_links)
- **32 accords sans description** (description NULL)
- **28 plantes sans famille botanique**
- **15 plantes sans aucune molécule liée**
- **2 liens cassés MegaMenu** : /gammes-hub?tab=petrichor et ?tab=volcanique
- **2 namespaces tRPC manquants** : trpc.importMolecules, trpc.importPlants
- **12 console.log** en production

## Données molécules (1045 entrées)
- Sans numéro CAS : 471 (45%) — Haute sévérité
- Sans SMILES : 844 (81%) — Haute sévérité
- Sans chemical_class : 298 (29%) — Moyenne sévérité
- Sans profil olfactif : 24 (2%) — Basse sévérité
- Enrichies PubChem : 68 (7%) — Haute sévérité
- Statut validation : 100% "valide" — Critique (système non utilisé)

## Recettes cigarillos (32 recettes)
- 24 sans terpene_profile (collections v2.0 et HPF)
- 8 sans ingrédients détaillés (cigarillo_recipe_ingredients)
- 24 sans pairings_suggestions

## Plan d'action prioritaire pour la session courante
1. Normaliser le champ `family` des molécules (120+ → ~15 valeurs canoniques)
2. Enrichir profils GC-MS Virginia Gold, Burley, Samsoun (fiches TabacDetail)
3. Vérifier/corriger les synergies cannabis (cannabis_id)
4. Corriger les 2 liens cassés MegaMenu (petrichor, volcanique)
5. Connecter les tabacs aux terroirs (33 manquants)
6. Ajouter index DB sur molecules.family, chemical_class, name
