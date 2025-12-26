#!/usr/bin/env node
/**
 * Script pour lier automatiquement les recettes aux formules de référence
 * basé sur la similarité de composition moléculaire.
 */

import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';

// Charger les formules de référence
const formulesRef = JSON.parse(
  readFileSync('/home/ubuntu/perfumum-research/data/FORMULES_REFERENCE_16.json', 'utf-8')
);

// Configuration de la base de données
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

/**
 * Calcule un score de similarité entre une recette et une formule de référence.
 * 
 * Critères:
 * - Molécules communes (50% du score)
 * - Similarité des proportions (30% du score)
 * - Similarité des rôles (20% du score)
 */
function calculateSimilarity(recetteMolecules, formuleMolecules) {
  // Créer des dictionnaires pour faciliter la comparaison
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
  
  // 1. Molécules communes (50%)
  const commonMolecules = new Set([...recetteNames].filter(x => formuleNames.has(x)));
  
  if (formuleNames.size === 0) return 0;
  
  const moleculeScore = commonMolecules.size / formuleNames.size;
  
  // 2. Similarité des proportions (30%)
  let proportionScore = 0;
  if (commonMolecules.size > 0) {
    const proportionDiffs = [];
    for (const mol of commonMolecules) {
      const diff = Math.abs(recetteDict[mol].proportion - formuleDict[mol].proportion);
      proportionDiffs.push(1 - (diff / 100)); // Normaliser
    }
    proportionScore = proportionDiffs.reduce((a, b) => a + b, 0) / proportionDiffs.length;
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
  
  // Score final pondéré
  const finalScore = (moleculeScore * 0.5) + (proportionScore * 0.3) + (roleScore * 0.2);
  
  return finalScore;
}

/**
 * Trouve la meilleure formule de référence pour une recette donnée.
 */
function findBestFormuleForRecette(recette) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const formule of formulesRef) {
    const score = calculateSimilarity(recette.molecules, formule.molecules);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = formule;
    }
  }
  
  if (bestMatch && bestScore >= 0.25) { // Seuil minimum de similarité
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
      LIMIT 50
    `);
    
    console.log(`✅ ${recettes.length} recettes trouvées avec au moins 3 molécules\n`);
    
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
    for (const result of results) {
      try {
        await connection.execute(`
          INSERT INTO recettes_formules_reference 
            (recette_id, formule_reference_name, formule_reference_family, similarity_score)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            similarity_score = VALUES(similarity_score),
            updated_at = CURRENT_TIMESTAMP
        `, [
          result.recetteId,
          result.formuleReferenceName,
          result.formuleReferenceFamily,
          result.similarityScore
        ]);
        inserted++;
      } catch (err) {
        console.error(`⚠️  Erreur pour recette ${result.recetteName}:`, err.message);
      }
    }
    
    console.log(`\n✅ ${inserted} liaisons insérées avec succès\n`);
    
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
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
