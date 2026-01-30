#!/usr/bin/env node
/**
 * Script OPTIMISÉ pour lier automatiquement les recettes aux formules de référence
 * 
 * Améliorations:
 * - Seuil abaissé à 15% (au lieu de 25%)
 * - Pondération ajustée pour favoriser les molécules dominantes
 * - Prise en compte des proportions dans le calcul de similarité
 */

import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';

const formulesRef = JSON.parse(
  readFileSync('/home/ubuntu/perfumum-research/data/FORMULES_REFERENCE_16.json', 'utf-8')
);

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

/**
 * Calcule un score de similarité OPTIMISÉ entre une recette et une formule de référence.
 * 
 * Nouvelles pondérations:
 * - Molécules communes (40% du score) - réduit pour être moins strict
 * - Similarité des proportions (40% du score) - augmenté pour valoriser les compositions similaires
 * - Similarité des rôles (20% du score) - maintenu
 */
function calculateSimilarityOptimized(recetteMolecules, formuleMolecules) {
  const recetteDict = {};
  recetteMolecules.forEach(m => {
    recetteDict[m.name] = { proportion: m.proportion, role: m.role };
  });

  const formuleDict = {};
  formuleMolecules.forEach(m => {
    formuleDict[m.name] = { proportion: m.proportion, role: m.role };
  });

  const recetteNames = new Set(Object.keys(recetteDict));
  const formuleNames = new Set(Object.keys(formuleDict));
  
  // 1. Molécules communes (40%)
  const commonMolecules = new Set([...recetteNames].filter(x => formuleNames.has(x)));
  
  if (formuleNames.size === 0) return 0;
  
  const moleculeScore = commonMolecules.size / formuleNames.size;
  
  // 2. Similarité des proportions (40%) - AMÉLIORÉ
  let proportionScore = 0;
  if (commonMolecules.size > 0) {
    const proportionDiffs = [];
    for (const mol of commonMolecules) {
      const recetteProp = recetteDict[mol].proportion;
      const formuleProp = formuleDict[mol].proportion;
      
      // Utiliser une fonction de similarité plus douce
      const diff = Math.abs(recetteProp - formuleProp);
      const similarity = Math.exp(-diff / 30); // Décroissance exponentielle
      proportionDiffs.push(similarity);
    }
    proportionScore = proportionDiffs.reduce((a, b) => a + b, 0) / proportionDiffs.length;
  } else {
    // Si aucune molécule commune, comparer les profils globaux
    const recetteProfile = getConcentrationProfile(recetteMolecules);
    const formuleProfile = getConcentrationProfile(formuleMolecules);
    proportionScore = compareProfiles(recetteProfile, formuleProfile);
  }
  
  // 3. Similarité des rôles (20%)
  let roleScore = 0;
  if (commonMolecules.size > 0) {
    let roleMatches = 0;
    for (const mol of commonMolecules) {
      if (recetteDict[mol].role === formuleDict[mol].role) {
        roleMatches++;
      }
    }
    roleScore = roleMatches / commonMolecules.size;
  }
  
  // Score final pondéré (nouvelles pondérations)
  const finalScore = (moleculeScore * 0.4) + (proportionScore * 0.4) + (roleScore * 0.2);
  
  return finalScore;
}

/**
 * Calcule le profil de concentration (tête/cœur/fond)
 */
function getConcentrationProfile(molecules) {
  const profile = { tête: 0, cœur: 0, fond: 0 };
  
  molecules.forEach(m => {
    const role = m.role || 'cœur';
    profile[role] = (profile[role] || 0) + m.proportion;
  });
  
  return profile;
}

/**
 * Compare deux profils de concentration
 */
function compareProfiles(profile1, profile2) {
  const roles = ['tête', 'cœur', 'fond'];
  let totalDiff = 0;
  
  for (const role of roles) {
    const p1 = profile1[role] || 0;
    const p2 = profile2[role] || 0;
    const diff = Math.abs(p1 - p2);
    totalDiff += diff;
  }
  
  // Normaliser (max diff = 300 si 100% dans un rôle vs 100% dans un autre)
  const similarity = 1 - (totalDiff / 300);
  return Math.max(0, similarity);
}

/**
 * Trouve la meilleure formule de référence pour une recette donnée.
 */
function findBestFormuleForRecette(recette) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const formule of formulesRef) {
    const score = calculateSimilarityOptimized(recette.molecules, formule.molecules);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = formule;
    }
  }
  
  // SEUIL ABAISSÉ À 15%
  if (bestMatch && bestScore >= 0.15) {
    return {
      formuleReferenceName: bestMatch.name,
      formuleReferenceFamily: bestMatch.family,
      similarityScore: Math.round(bestScore * 100)
    };
  }
  
  return null;
}

async function main() {
  const connection = await mysql.createConnection(DB_URL);
  
  try {
    console.log('🔍 Récupération des recettes avec leurs molécules...\n');
    console.log('⚙️  Algorithme optimisé activé (seuil: 15%, pondérations ajustées)\n');
    
    // Récupérer les recettes avec leurs molécules
    const [recettes] = await connection.execute(`
      SELECT 
        r.id, r.name, r.gamme, r.category,
        GROUP_CONCAT(
          CONCAT(m.name, ':', COALESCE(mr.proportion, 0), ':', COALESCE(mr.role, 'cœur'))
          SEPARATOR '|'
        ) as molecules_data,
        COUNT(mr.molecule_id) as molecule_count
      FROM recettes r
      INNER JOIN molecules_recettes mr ON r.id = mr.recette_id
      INNER JOIN molecules m ON mr.molecule_id = m.id
      GROUP BY r.id, r.name, r.gamme, r.category
      HAVING molecule_count >= 3
      ORDER BY molecule_count DESC
    `);
    
    console.log(`✅ ${recettes.length} recettes trouvées avec au moins 3 molécules\n`);
    console.log('⏳ Analyse en cours (cela peut prendre quelques minutes)...\n');
    
    const results = [];
    const familyCounts = {};
    
    // Analyser chaque recette
    for (const recette of recettes) {
      // Parser les molécules
      const molecules = recette.molecules_data.split('|').map(mol => {
        const [name, proportion, role] = mol.split(':');
        return {
          name,
          proportion: parseFloat(proportion) || 0,
          role: role || 'cœur'
        };
      });
      
      const match = findBestFormuleForRecette({ ...recette, molecules });
      
      if (match) {
        results.push({
          recetteId: recette.id,
          recetteName: recette.name,
          recetteGamme: recette.gamme,
          ...match
        });
        
        // Compter par famille
        familyCounts[match.formuleReferenceFamily] = (familyCounts[match.formuleReferenceFamily] || 0) + 1;
      }
    }
    
    console.log(`📊 ${results.length} correspondances trouvées\n`);
    
    // Trier par score décroissant
    results.sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Insérer dans la base de données
    console.log('💾 Insertion des liaisons dans la base de données...\n');
    
    let inserted = 0;
    let updated = 0;
    
    for (const result of results) {
      try {
        const [existingResult] = await connection.execute(
          'SELECT similarity_score FROM recettes_formules_reference WHERE recette_id = ?',
          [result.recetteId]
        );
        
        if (existingResult.length > 0) {
          const existingScore = existingResult[0].similarity_score;
          
          // Ne mettre à jour que si le nouveau score est meilleur
          if (result.similarityScore > existingScore) {
            await connection.execute(`
              UPDATE recettes_formules_reference 
              SET formule_reference_name = ?,
                  formule_reference_family = ?,
                  similarity_score = ?,
                  updated_at = CURRENT_TIMESTAMP
              WHERE recette_id = ?
            `, [
              result.formuleReferenceName,
              result.formuleReferenceFamily,
              result.similarityScore,
              result.recetteId
            ]);
            updated++;
          }
        } else {
          await connection.execute(`
            INSERT INTO recettes_formules_reference 
              (recette_id, formule_reference_name, formule_reference_family, similarity_score)
            VALUES (?, ?, ?, ?)
          `, [
            result.recetteId,
            result.formuleReferenceName,
            result.formuleReferenceFamily,
            result.similarityScore
          ]);
          inserted++;
        }
      } catch (err) {
        console.error(`⚠️  Erreur pour recette ${result.recetteName}:`, err.message);
      }
    }
    
    console.log(`\n✅ ${inserted} nouvelles liaisons insérées`);
    console.log(`✅ ${updated} liaisons mises à jour avec un meilleur score\n`);
    
    // Afficher les statistiques
    console.log('=== STATISTIQUES ===\n');
    console.log(`Total recettes analysées: ${recettes.length}`);
    console.log(`Recettes avec correspondance: ${results.length}`);
    console.log(`Taux de correspondance: ${Math.round((results.length / recettes.length) * 100)}%\n`);
    
    console.log('Répartition par famille:');
    const sortedFamilies = Object.entries(familyCounts).sort((a, b) => b[1] - a[1]);
    for (const [family, count] of sortedFamilies) {
      console.log(`  ${family}: ${count} recettes`);
    }
    
    console.log('\nTop 10 meilleures correspondances:');
    for (const result of results.slice(0, 10)) {
      console.log(`  ${result.recetteName} → ${result.formuleReferenceName} (${result.similarityScore}%)`);
    }
    
    // Afficher les nouvelles correspondances (score entre 15% et 25%)
    const newMatches = results.filter(r => r.similarityScore >= 15 && r.similarityScore < 25);
    if (newMatches.length > 0) {
      console.log(`\n🆕 ${newMatches.length} nouvelles correspondances grâce à l'optimisation (15-25%):`);
      for (const result of newMatches.slice(0, 5)) {
        console.log(`  ${result.recetteName} → ${result.formuleReferenceName} (${result.similarityScore}%)`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
