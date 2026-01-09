/**
 * Script d'analyse des plantes orphelines (sans terroir associé)
 * et identification des liaisons molécules-recettes sans proportions
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('\n=== ANALYSE DES PLANTES ORPHELINES ===\n');

  // 1. Identifier les plantes sans terroir
  const orphanPlants = await db.execute(sql`
    SELECT p.id, p.name, p.latin_name, p.family, p.origin, p.category
    FROM plants p
    LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
    WHERE pt.id IS NULL
    ORDER BY p.name
  `);

  console.log(`Plantes orphelines (sans terroir): ${orphanPlants[0].length}`);
  console.log('\nListe des plantes orphelines:');
  console.log('----------------------------');
  for (const plant of orphanPlants[0]) {
    console.log(`ID: ${plant.id} | ${plant.name} (${plant.latin_name || 'N/A'}) | Famille: ${plant.family || 'N/A'} | Origine: ${plant.origin || 'N/A'} | Catégorie: ${plant.category}`);
  }

  // 2. Lister les terroirs disponibles
  console.log('\n\n=== TERROIRS DISPONIBLES ===\n');
  const terroirs = await db.execute(sql`
    SELECT t.id, t.name, t.country, t.region, t.climate_type,
           COUNT(pt.id) as plant_count
    FROM terroirs t
    LEFT JOIN plant_terroirs pt ON t.id = pt.terroir_id
    GROUP BY t.id
    ORDER BY t.name
  `);

  console.log(`Terroirs disponibles: ${terroirs[0].length}`);
  console.log('\nListe des terroirs:');
  console.log('-------------------');
  for (const terroir of terroirs[0]) {
    console.log(`ID: ${terroir.id} | ${terroir.name} (${terroir.country || 'N/A'}) | Région: ${terroir.region || 'N/A'} | Climat: ${terroir.climate_type || 'N/A'} | Plantes: ${terroir.plant_count}`);
  }

  // 3. Analyser les liaisons molécules-recettes sans proportions
  // Tables: molecules_recettes (avec proportion) et recette_molecules (avec proportion aussi)
  console.log('\n\n=== LIAISONS MOLÉCULES-RECETTES SANS PROPORTIONS ===\n');
  
  // Table molecules_recettes
  const moleculesRecettesWithoutProportion = await db.execute(sql`
    SELECT mr.id, mr.molecule_id, mr.recette_id, m.name as molecule_name, r.name as recipe_name
    FROM molecules_recettes mr
    JOIN molecules m ON mr.molecule_id = m.id
    JOIN recettes r ON mr.recette_id = r.id
    WHERE mr.proportion IS NULL OR mr.proportion = 0
    ORDER BY r.name, m.name
    LIMIT 100
  `);

  console.log(`Liaisons molecules_recettes sans proportions (100 premiers): ${moleculesRecettesWithoutProportion[0].length}`);
  
  // Compter le total dans molecules_recettes
  const totalWithoutProportion1 = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM molecules_recettes
    WHERE proportion IS NULL OR proportion = 0
  `);
  
  const totalWithProportion1 = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM molecules_recettes
    WHERE proportion IS NOT NULL AND proportion > 0
  `);

  console.log(`\nTable molecules_recettes:`);
  console.log(`  - Sans proportions: ${totalWithoutProportion1[0][0].count}`);
  console.log(`  - Avec proportions: ${totalWithProportion1[0][0].count}`);

  // Table recette_molecules
  const recetteMoleculesWithoutProportion = await db.execute(sql`
    SELECT rm.id, rm.molecule_id, rm.recette_id, m.name as molecule_name, r.name as recipe_name
    FROM recette_molecules rm
    JOIN molecules m ON rm.molecule_id = m.id
    JOIN recettes r ON rm.recette_id = r.id
    WHERE rm.proportion IS NULL OR rm.proportion = 0
    ORDER BY r.name, m.name
    LIMIT 100
  `);

  console.log(`\nLiaisons recette_molecules sans proportions (100 premiers): ${recetteMoleculesWithoutProportion[0].length}`);
  
  // Compter le total dans recette_molecules
  const totalWithoutProportion2 = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM recette_molecules
    WHERE proportion IS NULL OR proportion = 0
  `);
  
  const totalWithProportion2 = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM recette_molecules
    WHERE proportion IS NOT NULL AND proportion > 0
  `);

  console.log(`\nTable recette_molecules:`);
  console.log(`  - Sans proportions: ${totalWithoutProportion2[0][0].count}`);
  console.log(`  - Avec proportions: ${totalWithProportion2[0][0].count}`);

  // Afficher quelques exemples
  console.log('\n\nExemples de liaisons sans proportions (molecules_recettes):');
  console.log('------------------------------------------------------------');
  for (const link of moleculesRecettesWithoutProportion[0].slice(0, 20)) {
    console.log(`ID: ${link.id} | ${link.molecule_name} → ${link.recipe_name}`);
  }

  await connection.end();
  console.log('\n=== ANALYSE TERMINÉE ===\n');
}

main().catch(console.error);
