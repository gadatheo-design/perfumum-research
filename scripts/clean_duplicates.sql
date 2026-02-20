-- ============================================================================
-- Script de Nettoyage des Doublons - PERFUMUM Database
-- ============================================================================
-- Date: 18 février 2026
-- Auteur: Analyse Manus
-- 
-- ATTENTION: Ce script modifie les données de la base de données.
-- TOUJOURS faire une sauvegarde complète avant exécution:
--   mysqldump -u root -p perfumum > perfumum_backup_$(date +%Y%m%d).sql
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: ANALYSE DES DOUBLONS (Lecture seule)
-- ============================================================================

-- 1.1. Identifier les molécules dupliquées par nom
SELECT 
    'Molécules dupliquées par NOM' as type,
    nom,
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids,
    GROUP_CONCAT(cas_number) as cas_numbers
FROM molecules
WHERE nom IS NOT NULL AND nom != ''
GROUP BY nom
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 1.2. Identifier les molécules dupliquées par CAS number
SELECT 
    'Molécules dupliquées par CAS' as type,
    cas_number,
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids,
    GROUP_CONCAT(nom) as noms
FROM molecules
WHERE cas_number IS NOT NULL AND cas_number != ''
GROUP BY cas_number
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 1.3. Identifier les molécules dupliquées par SMILES
SELECT 
    'Molécules dupliquées par SMILES' as type,
    LEFT(smiles, 50) as smiles_preview,
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids,
    GROUP_CONCAT(nom) as noms
FROM molecules
WHERE smiles IS NOT NULL AND smiles != ''
GROUP BY smiles
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 1.4. Identifier les plantes dupliquées par nom scientifique
SELECT 
    'Plantes dupliquées par NOM SCIENTIFIQUE' as type,
    scientific_name,
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids,
    GROUP_CONCAT(common_name) as common_names
FROM plants
WHERE scientific_name IS NOT NULL AND scientific_name != ''
GROUP BY scientific_name
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 1.5. Identifier les relations dupliquées plantes-molécules
SELECT 
    'Relations dupliquées PLANTES-MOLÉCULES' as type,
    plant_id,
    molecule_id,
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids
FROM plant_molecules
GROUP BY plant_id, molecule_id
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- ============================================================================
-- ÉTAPE 2: PRÉPARATION DU NETTOYAGE
-- ============================================================================

-- 2.1. Créer une table temporaire pour stocker les doublons de molécules
CREATE TEMPORARY TABLE IF NOT EXISTS molecule_duplicates AS
SELECT 
    nom,
    MIN(id) as keep_id,
    GROUP_CONCAT(id ORDER BY id) as all_ids,
    COUNT(*) as dup_count
FROM molecules
WHERE nom IS NOT NULL AND nom != ''
GROUP BY nom
HAVING COUNT(*) > 1;

-- 2.2. Créer une table temporaire pour stocker les doublons de plantes
CREATE TEMPORARY TABLE IF NOT EXISTS plant_duplicates AS
SELECT 
    scientific_name,
    MIN(id) as keep_id,
    GROUP_CONCAT(id ORDER BY id) as all_ids,
    COUNT(*) as dup_count
FROM plants
WHERE scientific_name IS NOT NULL AND scientific_name != ''
GROUP BY scientific_name
HAVING COUNT(*) > 1;

-- 2.3. Afficher un résumé des doublons à nettoyer
SELECT 
    'RÉSUMÉ DES DOUBLONS À NETTOYER' as info,
    (SELECT COUNT(*) FROM molecule_duplicates) as molecule_groups,
    (SELECT SUM(dup_count - 1) FROM molecule_duplicates) as molecules_to_delete,
    (SELECT COUNT(*) FROM plant_duplicates) as plant_groups,
    (SELECT SUM(dup_count - 1) FROM plant_duplicates) as plants_to_delete;

-- ============================================================================
-- ÉTAPE 3: NETTOYAGE DES DOUBLONS DE MOLÉCULES
-- ============================================================================

-- ATTENTION: Décommenter les commandes ci-dessous UNIQUEMENT après validation manuelle

-- 3.1. Mettre à jour les relations molecules_recettes
/*
UPDATE molecules_recettes mr
INNER JOIN molecules m ON mr.molecule_id = m.id
INNER JOIN molecule_duplicates md ON m.nom = md.nom
SET mr.molecule_id = md.keep_id
WHERE m.id != md.keep_id;
*/

-- 3.2. Mettre à jour les relations molecule_origins
/*
UPDATE molecule_origins mo
INNER JOIN molecules m ON mo.molecule_id = m.id
INNER JOIN molecule_duplicates md ON m.nom = md.nom
SET mo.molecule_id = md.keep_id
WHERE m.id != md.keep_id;
*/

-- 3.3. Mettre à jour les relations molecule_chemical_families
/*
UPDATE molecule_chemical_families mcf
INNER JOIN molecules m ON mcf.molecule_id = m.id
INNER JOIN molecule_duplicates md ON m.nom = md.nom
SET mcf.molecule_id = md.keep_id
WHERE m.id != md.keep_id;
*/

-- 3.4. Mettre à jour les relations molecule_synergies
/*
UPDATE molecule_synergies ms
INNER JOIN molecules m ON ms.molecule_a_id = m.id
INNER JOIN molecule_duplicates md ON m.nom = md.nom
SET ms.molecule_a_id = md.keep_id
WHERE m.id != md.keep_id;

UPDATE molecule_synergies ms
INNER JOIN molecules m ON ms.molecule_b_id = m.id
INNER JOIN molecule_duplicates md ON m.nom = md.nom
SET ms.molecule_b_id = md.keep_id
WHERE m.id != md.keep_id;
*/

-- 3.5. Fusionner les données manquantes dans les molécules principales
/*
UPDATE molecules m_keep
INNER JOIN molecule_duplicates md ON m_keep.id = md.keep_id
INNER JOIN molecules m_dup ON m_dup.nom = md.nom AND m_dup.id != md.keep_id
SET 
    m_keep.cas_number = COALESCE(m_keep.cas_number, m_dup.cas_number),
    m_keep.smiles = COALESCE(m_keep.smiles, m_dup.smiles),
    m_keep.description = COALESCE(m_keep.description, m_dup.description),
    m_keep.molecular_weight = COALESCE(m_keep.molecular_weight, m_dup.molecular_weight),
    m_keep.boiling_point = COALESCE(m_keep.boiling_point, m_dup.boiling_point),
    m_keep.odor_description = COALESCE(m_keep.odor_description, m_dup.odor_description)
WHERE m_keep.id = md.keep_id;
*/

-- 3.6. Supprimer les molécules dupliquées
/*
DELETE m
FROM molecules m
INNER JOIN molecule_duplicates md ON m.nom = md.nom
WHERE m.id != md.keep_id;
*/

-- ============================================================================
-- ÉTAPE 4: NETTOYAGE DES DOUBLONS DE PLANTES
-- ============================================================================

-- ATTENTION: Décommenter les commandes ci-dessous UNIQUEMENT après validation manuelle

-- 4.1. Mettre à jour les relations plant_geographic_zones
/*
UPDATE plant_geographic_zones pgz
INNER JOIN plants p ON pgz.plant_id = p.id
INNER JOIN plant_duplicates pd ON p.scientific_name = pd.scientific_name
SET pgz.plant_id = pd.keep_id
WHERE p.id != pd.keep_id;
*/

-- 4.2. Mettre à jour les relations terp_profiles
/*
UPDATE terp_profiles tp
INNER JOIN plants p ON tp.plant_id = p.id
INNER JOIN plant_duplicates pd ON p.scientific_name = pd.scientific_name
SET tp.plant_id = pd.keep_id
WHERE p.id != pd.keep_id;
*/

-- 4.3. Mettre à jour les relations plant_molecules
/*
UPDATE plant_molecules pm
INNER JOIN plants p ON pm.plant_id = p.id
INNER JOIN plant_duplicates pd ON p.scientific_name = pd.scientific_name
SET pm.plant_id = pd.keep_id
WHERE p.id != pd.keep_id;
*/

-- 4.4. Mettre à jour les relations plant_varieties
/*
UPDATE plant_varieties pv
INNER JOIN plants p ON pv.plant_id = p.id
INNER JOIN plant_duplicates pd ON p.scientific_name = pd.scientific_name
SET pv.plant_id = pd.keep_id
WHERE p.id != pd.keep_id;
*/

-- 4.5. Fusionner les données manquantes dans les plantes principales
/*
UPDATE plants p_keep
INNER JOIN plant_duplicates pd ON p_keep.id = pd.keep_id
INNER JOIN plants p_dup ON p_dup.scientific_name = pd.scientific_name AND p_dup.id != pd.keep_id
SET 
    p_keep.common_name = COALESCE(p_keep.common_name, p_dup.common_name),
    p_keep.family = COALESCE(p_keep.family, p_dup.family),
    p_keep.description = COALESCE(p_keep.description, p_dup.description),
    p_keep.origin = COALESCE(p_keep.origin, p_dup.origin),
    p_keep.habitat = COALESCE(p_keep.habitat, p_dup.habitat)
WHERE p_keep.id = pd.keep_id;
*/

-- 4.6. Supprimer les plantes dupliquées
/*
DELETE p
FROM plants p
INNER JOIN plant_duplicates pd ON p.scientific_name = pd.scientific_name
WHERE p.id != pd.keep_id;
*/

-- ============================================================================
-- ÉTAPE 5: NETTOYAGE DES RELATIONS DUPLIQUÉES
-- ============================================================================

-- 5.1. Supprimer les relations dupliquées plantes-molécules (garder la première)
/*
DELETE pm1
FROM plant_molecules pm1
INNER JOIN plant_molecules pm2 
    ON pm1.plant_id = pm2.plant_id 
    AND pm1.molecule_id = pm2.molecule_id 
    AND pm1.id > pm2.id;
*/

-- 5.2. Supprimer les relations dupliquées molecules-recettes (garder la première)
/*
DELETE mr1
FROM molecules_recettes mr1
INNER JOIN molecules_recettes mr2 
    ON mr1.molecule_id = mr2.molecule_id 
    AND mr1.recette_id = mr2.recette_id 
    AND mr1.id > mr2.id;
*/

-- ============================================================================
-- ÉTAPE 6: AJOUT DE CONTRAINTES D'UNICITÉ
-- ============================================================================

-- 6.1. Ajouter une contrainte d'unicité sur les noms de molécules
/*
ALTER TABLE molecules 
ADD UNIQUE KEY unique_nom (nom);
*/

-- 6.2. Ajouter une contrainte d'unicité sur les CAS numbers
/*
ALTER TABLE molecules 
ADD UNIQUE KEY unique_cas_number (cas_number);
*/

-- 6.3. Ajouter une contrainte d'unicité sur les noms scientifiques de plantes
/*
ALTER TABLE plants 
ADD UNIQUE KEY unique_scientific_name (scientific_name);
*/

-- 6.4. Ajouter une contrainte d'unicité sur les relations plantes-molécules
/*
ALTER TABLE plant_molecules 
ADD UNIQUE KEY unique_plant_molecule (plant_id, molecule_id);
*/

-- 6.5. Ajouter une contrainte d'unicité sur les relations molécules-recettes
/*
ALTER TABLE molecules_recettes 
ADD UNIQUE KEY unique_molecule_recette (molecule_id, recette_id);
*/

-- ============================================================================
-- ÉTAPE 7: VÉRIFICATION POST-NETTOYAGE
-- ============================================================================

-- 7.1. Vérifier qu'il n'y a plus de doublons de molécules
SELECT 
    'Vérification: Molécules dupliquées restantes' as check_type,
    COUNT(*) as remaining_duplicates
FROM (
    SELECT nom
    FROM molecules
    WHERE nom IS NOT NULL AND nom != ''
    GROUP BY nom
    HAVING COUNT(*) > 1
) t;

-- 7.2. Vérifier qu'il n'y a plus de doublons de plantes
SELECT 
    'Vérification: Plantes dupliquées restantes' as check_type,
    COUNT(*) as remaining_duplicates
FROM (
    SELECT scientific_name
    FROM plants
    WHERE scientific_name IS NOT NULL AND scientific_name != ''
    GROUP BY scientific_name
    HAVING COUNT(*) > 1
) t;

-- 7.3. Vérifier l'intégrité référentielle des molécules
SELECT 
    'Vérification: Relations orphelines molecules_recettes' as check_type,
    COUNT(*) as orphaned_relations
FROM molecules_recettes mr
LEFT JOIN molecules m ON mr.molecule_id = m.id
WHERE m.id IS NULL;

-- 7.4. Vérifier l'intégrité référentielle des plantes
SELECT 
    'Vérification: Relations orphelines plant_molecules' as check_type,
    COUNT(*) as orphaned_relations
FROM plant_molecules pm
LEFT JOIN plants p ON pm.plant_id = p.id
WHERE p.id IS NULL;

-- 7.5. Statistiques finales
SELECT 
    'STATISTIQUES FINALES' as info,
    (SELECT COUNT(*) FROM molecules) as total_molecules,
    (SELECT COUNT(DISTINCT nom) FROM molecules WHERE nom IS NOT NULL) as unique_molecule_names,
    (SELECT COUNT(*) FROM plants) as total_plants,
    (SELECT COUNT(DISTINCT scientific_name) FROM plants WHERE scientific_name IS NOT NULL) as unique_plant_names;

-- ============================================================================
-- NOTES D'UTILISATION
-- ============================================================================

/*
PROCÉDURE D'EXÉCUTION:

1. SAUVEGARDE (OBLIGATOIRE)
   mysqldump -u root -p perfumum > perfumum_backup_$(date +%Y%m%d).sql

2. ANALYSE (Étape 1)
   - Exécuter les requêtes SELECT de l'étape 1
   - Noter les doublons identifiés
   - Valider manuellement les doublons critiques

3. PRÉPARATION (Étape 2)
   - Exécuter les CREATE TEMPORARY TABLE
   - Vérifier le résumé des doublons

4. VALIDATION MANUELLE
   - Examiner les doublons dans les tables temporaires
   - Confirmer que les IDs à garder sont corrects
   - Vérifier que les données à fusionner sont cohérentes

5. NETTOYAGE (Étapes 3-5)
   - Décommenter UNE SECTION à la fois
   - Exécuter et vérifier le résultat
   - Passer à la section suivante

6. CONTRAINTES (Étape 6)
   - Décommenter et exécuter les ALTER TABLE
   - Vérifier qu'aucune erreur n'est levée

7. VÉRIFICATION (Étape 7)
   - Exécuter toutes les requêtes de vérification
   - Confirmer que remaining_duplicates = 0
   - Confirmer que orphaned_relations = 0

8. ROLLBACK SI NÉCESSAIRE
   mysql -u root -p perfumum < perfumum_backup_$(date +%Y%m%d).sql

RECOMMANDATIONS:

- Tester d'abord sur un environnement de développement
- Exécuter pendant une période de faible activité
- Surveiller les logs d'erreur MySQL
- Documenter toutes les modifications apportées
- Informer l'équipe avant et après l'exécution

*/

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
