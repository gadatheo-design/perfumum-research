#!/usr/bin/env node
/**
 * Script d'import des matières premières aromatiques rares
 * Insère les données du CSV dans la base de données PERFUMUM
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { materials } from './drizzle/schema.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Chemin du fichier JSON parsé
const jsonFile = path.join(__dirname, 'docs/aromatic_rarities_parsed.json');

async function importAromaticRarities() {
  try {
    console.log('📖 Lecture du fichier JSON...');
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    const { materials: materialsData } = data;

    console.log(`\n📊 Import de ${materialsData.length} matières premières...`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const material of materialsData) {
      try {
        // Vérifier si la matière première existe déjà
        const existing = await db.query.materials.findFirst({
          where: (t) => t.name === material.name,
        });

        if (existing) {
          console.log(`⏭️  Matière première existante: ${material.name}`);
          skipped++;
          continue;
        }

        // Préparer les données pour insertion
        const insertData = {
          name: material.name,
          latinName: material.name, // Utiliser le nom comme latin name si non disponible
          category: material.source_type || 'autre',
          origin: material.geography || null,
          description: material.notes || null,
          olfactiveProfile: material.key_molecules || null,
          intensity: null, // À remplir manuellement si nécessaire
          volatility: material.temporal_behavior || null,
          concentration: null,
          chemicalFamily: material.category || null,
          culturalStatus: material.cultural_status || null,
          rarityRegime: material.rarity_regime || null,
          extractability: material.extractability || null,
          absorbePotential: material.absorbe_potential || null,
          industrialProducts: material.industrial_products || null,
          references: material.references || null,
          source: 'aromatic_rarities_v3.1',
          sourceId: material.id,
        };

        // Insérer la matière première
        await db.insert(materials).values(insertData);
        console.log(`✅ Importée: ${material.name}`);
        imported++;
      } catch (err) {
        console.error(`❌ Erreur lors de l'import de ${material.name}: ${err.message}`);
        errors++;
      }
    }

    console.log(`\n📈 RÉSUMÉ DE L'IMPORT:`);
    console.log(`  ✅ Importées: ${imported}`);
    console.log(`  ⏭️  Existantes: ${skipped}`);
    console.log(`  ❌ Erreurs: ${errors}`);
    console.log(`  📊 Total: ${imported + skipped + errors}/${materialsData.length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur fatale:', err);
    process.exit(1);
  }
}

// Exécuter l'import
importAromaticRarities();
