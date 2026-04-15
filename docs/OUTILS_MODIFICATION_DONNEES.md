# Outils de Modification de Données — PERFUMUM

## Vue d'ensemble

Le site PERFUMUM dispose de **30 pages admin** pour la gestion et l'enrichissement des données. Ce document récapitule tous les outils disponibles pour modifier, créer, et valider les données.

---

## 1. GESTION DES MOLÉCULES

### 1.1 AdminMoleculesIndex.tsx
**Fonction** : Index et recherche des molécules  
**Opérations** : Lister, rechercher, filtrer par famille chimique  
**Statut** : ✅ Fonctionnel

### 1.2 MoleculeManager.tsx
**Fonction** : Gestionnaire complet des molécules  
**Opérations** : Créer, éditer, supprimer, importer en masse  
**Statut** : ✅ Fonctionnel

### 1.3 MoleculeOriginsAdmin.tsx
**Fonction** : Gérer les origines et sources des molécules  
**Opérations** : Ajouter/modifier les origines (plantes, synthèse, etc.)  
**Statut** : ✅ Fonctionnel

---

## 2. GESTION DES PLANTES

### 2.1 AdminMatieres.tsx
**Fonction** : Gestionnaire des matières premières (plantes)  
**Opérations** : Créer, éditer, supprimer, importer des plantes  
**Statut** : ✅ Fonctionnel

### 2.2 AdminPlantMolecules.tsx
**Fonction** : Gérer les liaisons plante-molécule  
**Opérations** : Créer/modifier les liaisons, définir les pourcentages  
**Statut** : ✅ Fonctionnel

---

## 3. GESTION DES RECETTES

### 3.1 LiaisonRecettesMolecules.tsx
**Fonction** : Lier les molécules aux recettes  
**Opérations** : Créer/modifier les compositions de recettes  
**Statut** : ✅ Fonctionnel

---

## 4. GESTION DES ACCORDS & FAMILLES CHIMIQUES

### 4.1 AdminAccords.tsx
**Fonction** : Gérer les accords olfactifs  
**Opérations** : Créer, éditer, supprimer les accords  
**Statut** : ✅ Fonctionnel

### 4.2 AdminFamilles.tsx
**Fonction** : Gérer les familles chimiques  
**Opérations** : Créer, éditer les familles (Aldéhydes, Phénols, etc.)  
**Statut** : ✅ Fonctionnel

### 4.3 AdminSynergies.tsx
**Fonction** : Gérer les synergies entre molécules  
**Opérations** : Créer, éditer les synergies  
**Statut** : ✅ Fonctionnel

---

## 5. ENRICHISSEMENT PAR API EXTERNE

### 5.1 KNApSAcKBatch.tsx
**Fonction** : Importer des données KNApSAcK (plante-molécule)  
**Opérations** : Batch import, matching par formule chimique et poids moléculaire  
**Statut** : ✅ Corrigé (erreur SQL résolue)

### 5.2 PubChemBatch.tsx
**Fonction** : Importer des molécules depuis PubChem  
**Opérations** : Batch import par CAS, IUPAC, SMILES  
**Statut** : ✅ Fonctionnel

### 5.3 PubChemIupacBatch.tsx
**Fonction** : Importer des molécules par noms IUPAC  
**Opérations** : Batch import, normalisation des noms  
**Statut** : ✅ Fonctionnel

### 5.4 SmilesBatch.tsx
**Fonction** : Importer des molécules par SMILES  
**Opérations** : Batch import, validation SMILES  
**Statut** : ✅ Fonctionnel

### 5.5 ChEBIBatch.tsx
**Fonction** : Importer des molécules depuis ChEBI  
**Opérations** : Batch import, mapping ChEBI IDs  
**Statut** : ✅ Fonctionnel

### 5.6 COCONUTBatch.tsx
**Fonction** : Importer des molécules depuis COCONUT  
**Opérations** : Batch import, enrichissement de données  
**Statut** : ✅ Fonctionnel

### 5.7 LOTUSBatch.tsx
**Fonction** : Importer des données LOTUS (plante-molécule)  
**Opérations** : Batch import, validation des liaisons  
**Statut** : ✅ Fonctionnel

### 5.8 GBIFBatch.tsx
**Fonction** : Importer des données géographiques GBIF  
**Opérations** : Batch import, géolocalisation des plantes  
**Statut** : ✅ Fonctionnel

### 5.9 WikidataBatch.tsx
**Fonction** : Importer des données Wikidata  
**Opérations** : Batch import, enrichissement avec QIDs  
**Statut** : ✅ Fonctionnel

### 5.10 WikimediaBatch.tsx
**Fonction** : Importer des images depuis Wikimedia  
**Opérations** : Batch import, association aux plantes/molécules  
**Statut** : ✅ Fonctionnel

### 5.11 EuropeanaQidBatch.tsx
**Fonction** : Importer des données Europeana avec QIDs  
**Opérations** : Batch import, enrichissement culturel  
**Statut** : ✅ Fonctionnel

---

## 6. ENRICHISSEMENT PAR IA

### 6.1 AIBatchEnrich.tsx
**Fonction** : Enrichissement IA des plantes  
**Opérations** : Générer descriptions, notes de recherche, étymologies  
**Statut** : ✅ Fonctionnel

### 6.2 AIBatchEnrichMolecules.tsx
**Fonction** : Enrichissement IA des molécules  
**Opérations** : Générer descriptions, propriétés olfactives, effets  
**Statut** : ✅ Fonctionnel

---

## 7. EXPLORATION & ANALYSE

### 7.1 EuropeanaExplorer.tsx
**Fonction** : Explorer les données Europeana  
**Opérations** : Recherche, filtrage, sélection pour import  
**Statut** : ✅ Fonctionnel

### 7.2 EuropeanaMap.tsx
**Fonction** : Visualiser les données Europeana sur carte  
**Opérations** : Géolocalisation, clustering, export  
**Statut** : ✅ Fonctionnel

### 7.3 SparqlExplorer.tsx
**Fonction** : Requêtes SPARQL sur Wikidata/Europeana  
**Opérations** : Requêtes personnalisées, export des résultats  
**Statut** : ✅ Fonctionnel

### 7.4 TerroirsGeocode.tsx
**Fonction** : Géocoder et enrichir les terroirs  
**Opérations** : Localisation GPS, enrichissement géographique  
**Statut** : ✅ Fonctionnel

### 7.5 DataQuality.tsx
**Fonction** : Analyser la qualité des données  
**Opérations** : Détection d'anomalies, rapports de couverture  
**Statut** : ✅ Fonctionnel

### 7.6 AdminDataAudit.tsx
**Fonction** : Dashboard complet d'audit des données  
**Opérations** : Formules chimiques, poids moléculaires, orphelines, export  
**Statut** : 🔧 En cours (procédures tRPC à finaliser)

---

## 8. GESTION SPÉCIALISÉE

### 8.1 ExtractionMethodsAdmin.tsx
**Fonction** : Gérer les méthodes d'extraction  
**Opérations** : Créer, éditer les méthodes, définir les coûts  
**Statut** : ✅ Fonctionnel

### 8.2 CigarilloMoleculeLinking.tsx
**Fonction** : Lier les molécules aux cigarillos  
**Opérations** : Créer/modifier les liaisons cigarillo-molécule  
**Statut** : ✅ Fonctionnel

---

## RÉSUMÉ PAR CATÉGORIE

| Catégorie | Nombre | Statut |
|-----------|--------|--------|
| Molécules | 3 | ✅ Fonctionnel |
| Plantes | 2 | ✅ Fonctionnel |
| Recettes | 1 | ✅ Fonctionnel |
| Accords & Familles | 3 | ✅ Fonctionnel |
| Enrichissement API | 11 | ✅ Fonctionnel |
| Enrichissement IA | 2 | ✅ Fonctionnel |
| Exploration & Analyse | 6 | ✅ Fonctionnel (1 en cours) |
| Gestion Spécialisée | 2 | ✅ Fonctionnel |
| **TOTAL** | **30** | **29 ✅ / 1 🔧** |

---

## OPÉRATIONS CRUD DISPONIBLES

### Create (Créer)
- ✅ Molécules : MoleculeManager.tsx
- ✅ Plantes : AdminMatieres.tsx
- ✅ Liaisons plante-molécule : AdminPlantMolecules.tsx
- ✅ Recettes : LiaisonRecettesMolecules.tsx
- ✅ Accords : AdminAccords.tsx
- ✅ Familles chimiques : AdminFamilles.tsx

### Read (Lire)
- ✅ Toutes les pages admin permettent de consulter les données
- ✅ Recherche et filtrage disponibles

### Update (Modifier)
- ✅ Molécules : MoleculeManager.tsx
- ✅ Plantes : AdminMatieres.tsx
- ✅ Liaisons : AdminPlantMolecules.tsx, LiaisonRecettesMolecules.tsx
- ✅ Accords & Familles : AdminAccords.tsx, AdminFamilles.tsx

### Delete (Supprimer)
- ✅ Molécules : MoleculeManager.tsx
- ✅ Plantes : AdminMatieres.tsx
- ⚠️ Liaisons : À vérifier (soft delete recommandé)

---

## POINTS À AMÉLIORER

### 1. Dashboard d'audit (AdminDataAudit.tsx)
- [ ] Finaliser les procédures tRPC pour l'audit
- [ ] Tester les requêtes de détection d'anomalies
- [ ] Implémenter l'export CSV/JSON

### 2. Validation des données
- [ ] Ajouter des validations côté serveur pour les formules chimiques
- [ ] Implémenter des vérifications d'unicité (CAS, IUPAC)
- [ ] Ajouter des alertes pour les doublons

### 3. Import en masse
- [ ] Améliorer les retours d'erreur lors des imports
- [ ] Ajouter des logs détaillés pour chaque import
- [ ] Implémenter des rollback en cas d'erreur

### 4. Permissions
- [ ] Vérifier que seuls les admins peuvent modifier les données
- [ ] Implémenter les rôles (admin, éditeur, lecteur)
- [ ] Ajouter un audit trail (historique des modifications)

---

## WORKFLOW RECOMMANDÉ POUR L'ENRICHISSEMENT

1. **Exploration** : Utiliser EuropeanaExplorer, SparqlExplorer
2. **Import** : Utiliser les Batch imports (KNApSAcK, PubChem, etc.)
3. **Enrichissement IA** : Utiliser AIBatchEnrich, AIBatchEnrichMolecules
4. **Validation** : Utiliser DataQuality, AdminDataAudit
5. **Correction** : Utiliser MoleculeManager, AdminMatieres, AdminPlantMolecules
6. **Export** : Utiliser les fonctions d'export de chaque page

---

## ACCÈS AUX PAGES ADMIN

Les pages admin sont accessibles via :
- **Route** : `/admin/[page-name]`
- **Exemple** : `/admin/molecules-index`, `/admin/molecule-manager`
- **Authentification** : Admin uniquement (rôle = "admin")

---

## NOTES IMPORTANTES

1. **Sauvegarde des données** : Tous les imports sont sauvegardés automatiquement
2. **Validation** : Les données importées doivent passer les validations avant intégration
3. **Doublons** : Utiliser AdminDataAudit pour détecter les doublons
4. **Orphelines** : Utiliser AdminDataAudit pour identifier les entités orphelines
5. **Performance** : Les imports en masse peuvent être lents (> 10 000 entrées)

---

## CONTACT & SUPPORT

Pour toute question ou problème avec les outils de modification :
- Consulter la page DataQuality pour les diagnostics
- Vérifier AdminDataAudit pour les anomalies
- Contacter l'administrateur du projet

---

**Dernière mise à jour** : 2026-04-07  
**Version** : 1.0  
**Statut** : Complet (29/30 outils fonctionnels)
