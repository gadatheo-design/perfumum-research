#!/usr/bin/env node
/**
 * Analyse des doublons via l'API tRPC du projet PERFUMUM
 * Ce script utilise les routes API existantes pour analyser les doublons
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Simuler une requête HTTP vers l'API locale
async function analyzeDatabase() {
  console.log('\n🔍 ANALYSE DES DOUBLONS - BASE DE DONNÉES PERFUMUM');
  console.log('='.repeat(80));
  
  try {
    // Importer la configuration de la base de données
    const dbModule = await import('./server/db.ts');
    const db = dbModule.default;
    
    console.log('\n✅ Connexion à la base de données établie');
    
    // Analyser les molécules
    console.log('\n' + '='.repeat(80));
    console.log('ANALYSE DES MOLÉCULES');
    console.log('='.repeat(80));
    
    const molecules = await db.query.molecules.findMany({
      columns: {
        id: true,
        nom: true,
        cas_number: true,
        smiles: true
      }
    });
    
    console.log(`\n📊 Total de molécules: ${molecules.length}`);
    
    // Analyser les doublons par nom
    const moleculesByName = {};
    molecules.forEach(m => {
      if (m.nom) {
        if (!moleculesByName[m.nom]) {
          moleculesByName[m.nom] = [];
        }
        moleculesByName[m.nom].push(m.id);
      }
    });
    
    const nameDuplicates = Object.entries(moleculesByName)
      .filter(([name, ids]) => ids.length > 1)
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log(`\n📊 Doublons par NOM: ${nameDuplicates.length} noms dupliqués`);
    
    if (nameDuplicates.length > 0) {
      console.log('\nTop 10 des noms les plus dupliqués:');
      nameDuplicates.slice(0, 10).forEach(([name, ids], i) => {
        console.log(`  ${i + 1}. '${name}' - ${ids.length} occurrences (IDs: ${ids.join(', ')})`);
      });
    }
    
    // Analyser les doublons par CAS
    const moleculesByCAS = {};
    molecules.forEach(m => {
      if (m.cas_number && m.cas_number !== '') {
        if (!moleculesByCAS[m.cas_number]) {
          moleculesByCAS[m.cas_number] = [];
        }
        moleculesByCAS[m.cas_number].push({ id: m.id, nom: m.nom });
      }
    });
    
    const casDuplicates = Object.entries(moleculesByCAS)
      .filter(([cas, entries]) => entries.length > 1)
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log(`\n📊 Doublons par CAS NUMBER: ${casDuplicates.length} CAS dupliqués`);
    
    if (casDuplicates.length > 0) {
      console.log('\nTop 10 des CAS les plus dupliqués:');
      casDuplicates.slice(0, 10).forEach(([cas, entries], i) => {
        console.log(`  ${i + 1}. CAS ${cas} - ${entries.length} occurrences`);
        console.log(`     Noms: ${entries.map(e => e.nom).join(', ')}`);
        console.log(`     IDs: ${entries.map(e => e.id).join(', ')}`);
      });
    }
    
    // Analyser les plantes
    console.log('\n' + '='.repeat(80));
    console.log('ANALYSE DES PLANTES');
    console.log('='.repeat(80));
    
    const plants = await db.query.plants.findMany({
      columns: {
        id: true,
        scientific_name: true,
        common_name: true
      }
    });
    
    console.log(`\n📊 Total de plantes: ${plants.length}`);
    
    // Analyser les doublons par nom scientifique
    const plantsByScientificName = {};
    plants.forEach(p => {
      if (p.scientific_name) {
        if (!plantsByScientificName[p.scientific_name]) {
          plantsByScientificName[p.scientific_name] = [];
        }
        plantsByScientificName[p.scientific_name].push({ id: p.id, common_name: p.common_name });
      }
    });
    
    const scientificDuplicates = Object.entries(plantsByScientificName)
      .filter(([name, entries]) => entries.length > 1)
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log(`\n📊 Doublons par NOM SCIENTIFIQUE: ${scientificDuplicates.length} noms dupliqués`);
    
    if (scientificDuplicates.length > 0) {
      console.log('\nTop 10 des noms scientifiques les plus dupliqués:');
      scientificDuplicates.slice(0, 10).forEach(([name, entries], i) => {
        console.log(`  ${i + 1}. '${name}' - ${entries.length} occurrences`);
        console.log(`     Noms communs: ${entries.map(e => e.common_name || 'N/A').join(', ')}`);
        console.log(`     IDs: ${entries.map(e => e.id).join(', ')}`);
      });
    }
    
    // Résumé final
    console.log('\n' + '='.repeat(80));
    console.log('RÉSUMÉ FINAL');
    console.log('='.repeat(80));
    
    const totalMoleculeDuplicates = nameDuplicates.reduce((sum, [, ids]) => sum + (ids.length - 1), 0);
    const totalPlantDuplicates = scientificDuplicates.reduce((sum, [, entries]) => sum + (entries.length - 1), 0);
    
    console.log(`\n📊 MOLÉCULES:`);
    console.log(`  - Total: ${molecules.length}`);
    console.log(`  - Noms uniques: ${Object.keys(moleculesByName).length}`);
    console.log(`  - Noms dupliqués: ${nameDuplicates.length}`);
    console.log(`  - CAS dupliqués: ${casDuplicates.length}`);
    console.log(`  - Entrées en doublon estimées: ${totalMoleculeDuplicates}`);
    console.log(`  - Taux de duplication: ${(totalMoleculeDuplicates / molecules.length * 100).toFixed(2)}%`);
    
    console.log(`\n📊 PLANTES:`);
    console.log(`  - Total: ${plants.length}`);
    console.log(`  - Noms scientifiques uniques: ${Object.keys(plantsByScientificName).length}`);
    console.log(`  - Noms scientifiques dupliqués: ${scientificDuplicates.length}`);
    console.log(`  - Entrées en doublon estimées: ${totalPlantDuplicates}`);
    console.log(`  - Taux de duplication: ${(totalPlantDuplicates / plants.length * 100).toFixed(2)}%`);
    
    // Sauvegarder les résultats
    const results = {
      timestamp: new Date().toISOString(),
      molecules: {
        total: molecules.length,
        unique_names: Object.keys(moleculesByName).length,
        name_duplicates: nameDuplicates.length,
        cas_duplicates: casDuplicates.length,
        estimated_duplicates: totalMoleculeDuplicates,
        duplication_rate: (totalMoleculeDuplicates / molecules.length * 100).toFixed(2) + '%',
        top_name_duplicates: nameDuplicates.slice(0, 20).map(([name, ids]) => ({
          name,
          count: ids.length,
          ids
        })),
        top_cas_duplicates: casDuplicates.slice(0, 20).map(([cas, entries]) => ({
          cas,
          count: entries.length,
          entries
        }))
      },
      plants: {
        total: plants.length,
        unique_scientific_names: Object.keys(plantsByScientificName).length,
        scientific_duplicates: scientificDuplicates.length,
        estimated_duplicates: totalPlantDuplicates,
        duplication_rate: (totalPlantDuplicates / plants.length * 100).toFixed(2) + '%',
        top_scientific_duplicates: scientificDuplicates.slice(0, 20).map(([name, entries]) => ({
          scientific_name: name,
          count: entries.length,
          entries
        }))
      }
    };
    
    const fs = await import('fs');
    fs.writeFileSync(
      '/home/ubuntu/perfumum-research/duplicate_analysis_production.json',
      JSON.stringify(results, null, 2)
    );
    
    console.log(`\n✅ Résultats sauvegardés dans: duplicate_analysis_production.json`);
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l'analyse:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Exécuter l'analyse
analyzeDatabase().catch(console.error);
