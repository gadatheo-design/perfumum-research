#!/usr/bin/env node
/**
 * Script pour identifier et analyser les recettes atypiques
 * (celles qui ne correspondent à aucune formule de référence classique)
 */

import { readFileSync, writeFileSync } from 'fs';
import mysql from 'mysql2/promise';

const formulesRef = JSON.parse(
  readFileSync('/home/ubuntu/perfumum-research/data/FORMULES_REFERENCE_16.json', 'utf-8')
);

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

function calculateSimilarity(recetteMolecules, formuleMolecules) {
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
  
  const commonMolecules = new Set([...recetteNames].filter(x => formuleNames.has(x)));
  
  if (formuleNames.size === 0) return 0;
  
  const moleculeScore = commonMolecules.size / formuleNames.size;
  
  let proportionScore = 0;
  if (commonMolecules.size > 0) {
    const proportionDiffs = [];
    for (const mol of commonMolecules) {
      const diff = Math.abs(recetteDict[mol].proportion - formuleDict[mol].proportion);
      proportionDiffs.push(1 - (diff / 100));
    }
    proportionScore = proportionDiffs.reduce((a, b) => a + b, 0) / proportionDiffs.length;
  }
  
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
  
  const finalScore = (moleculeScore * 0.5) + (proportionScore * 0.3) + (roleScore * 0.2);
  
  return finalScore;
}

function findBestFormuleForRecette(recette) {
  let bestMatch = null;
  let bestScore = 0;
  let secondBestScore = 0;
  
  for (const formule of formulesRef) {
    const score = calculateSimilarity(recette.molecules, formule.molecules);
    if (score > bestScore) {
      secondBestScore = bestScore;
      bestScore = score;
      bestMatch = formule;
    } else if (score > secondBestScore) {
      secondBestScore = score;
    }
  }
  
  return {
    formule: bestMatch,
    score: bestScore,
    secondBestScore: secondBestScore,
    gap: bestScore - secondBestScore
  };
}

async function main() {
  const connection = await mysql.createConnection(DB_URL);
  
  try {
    console.log('🔍 Analyse des recettes atypiques...\n');
    
    // Récupérer TOUTES les recettes avec leurs molécules
    const [recettes] = await connection.execute(`
      SELECT 
        r.id, r.name, r.gamme, r.category,
        GROUP_CONCAT(
          CONCAT(m.name, ':', COALESCE(mr.proportion, 0), ':', COALESCE(mr.role, 'cœur'))
          SEPARATOR '|'
        ) as molecules_data,
        COUNT(mr.molecule_id) as molecule_count
      FROM recettes r
      LEFT JOIN molecules_recettes mr ON r.id = mr.recette_id
      LEFT JOIN molecules m ON mr.molecule_id = m.id
      GROUP BY r.id, r.name, r.gamme, r.category
      ORDER BY molecule_count DESC
    `);
    
    console.log(`✅ ${recettes.length} recettes trouvées\n`);
    
    const atypicalRecettes = [];
    const lowScoreRecettes = [];
    const noMoleculesRecettes = [];
    const fewMoleculesRecettes = [];
    
    for (const recette of recettes) {
      // Cas 1: Aucune molécule
      if (!recette.molecules_data || recette.molecule_count === 0) {
        noMoleculesRecettes.push({
          id: recette.id,
          name: recette.name,
          gamme: recette.gamme,
          category: recette.category,
          moleculeCount: 0
        });
        continue;
      }
      
      // Cas 2: Moins de 3 molécules
      if (recette.molecule_count < 3) {
        const molecules = recette.molecules_data.split('|').map(mol => {
          const [name] = mol.split(':');
          return name;
        });
        
        fewMoleculesRecettes.push({
          id: recette.id,
          name: recette.name,
          gamme: recette.gamme,
          category: recette.category,
          moleculeCount: recette.molecule_count,
          molecules: molecules
        });
        continue;
      }
      
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
      
      // Cas 3: Score < 25% (atypique)
      if (match.score < 0.25) {
        atypicalRecettes.push({
          id: recette.id,
          name: recette.name,
          gamme: recette.gamme,
          category: recette.category,
          moleculeCount: recette.molecule_count,
          bestScore: Math.round(match.score * 100),
          bestFormule: match.formule?.name || 'Aucune',
          bestFamily: match.formule?.family || 'N/A',
          topMolecules: molecules.slice(0, 5).map(m => m.name)
        });
      }
      // Cas 4: Score entre 25% et 35% (faible)
      else if (match.score < 0.35) {
        lowScoreRecettes.push({
          id: recette.id,
          name: recette.name,
          gamme: recette.gamme,
          category: recette.category,
          moleculeCount: recette.molecule_count,
          bestScore: Math.round(match.score * 100),
          bestFormule: match.formule?.name || 'Aucune',
          bestFamily: match.formule?.family || 'N/A',
          gap: Math.round(match.gap * 100),
          topMolecules: molecules.slice(0, 5).map(m => m.name)
        });
      }
    }
    
    // Générer le rapport
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRecettes: recettes.length,
        noMolecules: noMoleculesRecettes.length,
        fewMolecules: fewMoleculesRecettes.length,
        atypical: atypicalRecettes.length,
        lowScore: lowScoreRecettes.length,
        totalProblematic: noMoleculesRecettes.length + fewMoleculesRecettes.length + atypicalRecettes.length + lowScoreRecettes.length
      },
      details: {
        noMolecules: noMoleculesRecettes,
        fewMolecules: fewMoleculesRecettes,
        atypical: atypicalRecettes,
        lowScore: lowScoreRecettes
      }
    };
    
    // Sauvegarder le rapport
    writeFileSync(
      '/home/ubuntu/perfumum-research/data/atypical-recettes-report.json',
      JSON.stringify(report, null, 2)
    );
    
    // Afficher les statistiques
    console.log('=== RAPPORT D\'ANALYSE ===\n');
    console.log(`📊 Total recettes: ${report.summary.totalRecettes}`);
    console.log(`\n🔴 Recettes problématiques: ${report.summary.totalProblematic}\n`);
    
    console.log(`  ❌ Sans molécules: ${report.summary.noMolecules}`);
    console.log(`  ⚠️  Peu de molécules (< 3): ${report.summary.fewMolecules}`);
    console.log(`  🔸 Atypiques (score < 25%): ${report.summary.atypical}`);
    console.log(`  🔹 Score faible (25-35%): ${report.summary.lowScore}`);
    
    if (atypicalRecettes.length > 0) {
      console.log('\n=== TOP 10 RECETTES ATYPIQUES ===\n');
      atypicalRecettes.slice(0, 10).forEach(r => {
        console.log(`  ${r.name} (${r.gamme || 'N/A'})`);
        console.log(`    Score: ${r.bestScore}% | Molécules: ${r.moleculeCount}`);
        console.log(`    Meilleure correspondance: ${r.bestFormule} (${r.bestFamily})`);
        console.log(`    Top molécules: ${r.topMolecules.join(', ')}`);
        console.log('');
      });
    }
    
    if (fewMoleculesRecettes.length > 0) {
      console.log('\n=== RECETTES AVEC PEU DE MOLÉCULES ===\n');
      fewMoleculesRecettes.slice(0, 5).forEach(r => {
        console.log(`  ${r.name}: ${r.molecules.join(', ')}`);
      });
    }
    
    console.log(`\n✅ Rapport sauvegardé: data/atypical-recettes-report.json`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
