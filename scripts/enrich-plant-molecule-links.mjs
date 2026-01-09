#!/usr/bin/env node
/**
 * Script pour enrichir les liaisons plante-molécule
 * Ajoute les molécules et plantes manquantes puis crée les liaisons
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const DATABASE_URL = process.env.DATABASE_URL;

// Molécules manquantes avec leurs propriétés
const missingMolecules = [
  { name: 'Linalyl acetate', family: 'Esters terpéniques', chemicalClass: 'ester', olfactiveProfile: 'Floral, fruité, lavande' },
  { name: 'Borneol', family: 'Alcools terpéniques', chemicalClass: 'alcohol', olfactiveProfile: 'Camphré, boisé, frais' },
  { name: 'Menthyl acetate', family: 'Esters terpéniques', chemicalClass: 'ester', olfactiveProfile: 'Menthé, frais, fruité' },
  { name: 'Isomenthone', family: 'Cétones terpéniques', chemicalClass: 'ketone', olfactiveProfile: 'Menthé, herbacé' },
  { name: 'Pulegone', family: 'Cétones terpéniques', chemicalClass: 'ketone', olfactiveProfile: 'Menthé, camphré' },
  { name: 'Globulol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, terreux' },
  { name: 'Aromadendrene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, épicé' },
  { name: 'Verbenone', family: 'Cétones terpéniques', chemicalClass: 'ketone', olfactiveProfile: 'Camphré, menthé, herbacé' },
  { name: 'Camphene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Camphré, boisé, frais' },
  { name: 'Decanal', family: 'Aldéhydes', chemicalClass: 'aldehyde', olfactiveProfile: 'Agrume, orange, gras' },
  { name: 'Bergaptene', family: 'Furocoumarines', chemicalClass: 'coumarin', olfactiveProfile: 'Bergamote (photosensibilisant)' },
  { name: 'Methyl benzoate', family: 'Esters aromatiques', chemicalClass: 'ester', olfactiveProfile: 'Floral, fruité, ylang' },
  { name: 'Geranyl acetate', family: 'Esters terpéniques', chemicalClass: 'ester', olfactiveProfile: 'Floral, rose, fruité' },
  { name: 'Farnesene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Vert, pomme, floral' },
  { name: 'Rose oxide', family: 'Oxydes terpéniques', chemicalClass: 'ether', olfactiveProfile: 'Rose, géranium, métallique' },
  { name: 'Phenylethyl alcohol', family: 'Alcools aromatiques', chemicalClass: 'alcohol', olfactiveProfile: 'Rose, miel, floral' },
  { name: 'Jasmone', family: 'Cétones', chemicalClass: 'ketone', olfactiveProfile: 'Jasmin, floral, herbacé' },
  { name: 'Isovalencenol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Vétiver, boisé, terreux' },
  { name: 'Khusimone', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Vétiver, terreux, fumé' },
  { name: 'Vetivone', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Vétiver, boisé, terreux' },
  { name: 'Beta-vetivone', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Vétiver, boisé' },
  { name: 'Norpatchoulenol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Patchouli, terreux' },
  { name: 'Alpha-santalene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Santal, boisé' },
  { name: 'Beta-santalene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Santal, boisé' },
  { name: 'Epi-alpha-cadinol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, herbacé' },
  { name: 'Alpha-cedrene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Cèdre, boisé' },
  { name: 'Beta-cedrene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Cèdre, boisé' },
  { name: 'Cedrenol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Cèdre, boisé, doux' },
  { name: 'Thujopsene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Cèdre, boisé' },
  { name: 'Cuparene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, épicé' },
  { name: 'Agarol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Oud, boisé, animal' },
  { name: 'Agarospirol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Oud, boisé' },
  { name: 'Jinkoh-eremol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Oud, boisé, fumé' },
  { name: 'Kusunol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Oud, boisé' },
  { name: 'Selina-3,11-dien-9-one', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Oud, boisé' },
  { name: 'Methyl chavicol', family: 'Phénylpropanoïdes', chemicalClass: 'phenol', olfactiveProfile: 'Anis, basilic, épicé' },
  { name: 'Trans-anethole', family: 'Phénylpropanoïdes', chemicalClass: 'phenol', olfactiveProfile: 'Anis, réglisse, doux' },
  { name: 'Cuminaldehyde', family: 'Aldéhydes', chemicalClass: 'aldehyde', olfactiveProfile: 'Cumin, épicé, chaud' },
  { name: 'Gamma-terpinene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Citrus, herbacé' },
  { name: 'P-cymene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Agrume, boisé, épicé' },
  { name: 'Sabinene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Épicé, boisé, poivré' },
  { name: 'Terpinolene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Pin, herbacé, floral' },
  { name: 'Delta-3-carene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Pin, résine, doux' },
  { name: 'Ocimene', family: 'Monoterpènes', chemicalClass: 'monoterpene', olfactiveProfile: 'Herbacé, floral, boisé' },
  { name: 'Elemol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, épicé, floral' },
  { name: 'Valerianol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, terreux' },
  { name: 'Guaiol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Boisé, rose, pin' },
  { name: 'Tagetone', family: 'Cétones', chemicalClass: 'ketone', olfactiveProfile: 'Herbacé, fruité, vert' },
  { name: 'Dihydrotagetone', family: 'Cétones', chemicalClass: 'ketone', olfactiveProfile: 'Herbacé, fruité' },
  { name: 'Dillapiole', family: 'Phénylpropanoïdes', chemicalClass: 'phenol', olfactiveProfile: 'Épicé, herbacé' },
  { name: 'P-menthadienol', family: 'Alcools terpéniques', chemicalClass: 'alcohol', olfactiveProfile: 'Menthé, herbacé' },
  { name: 'Geranial', family: 'Aldéhydes', chemicalClass: 'aldehyde', olfactiveProfile: 'Citron, frais' },
  { name: 'Neral', family: 'Aldéhydes', chemicalClass: 'aldehyde', olfactiveProfile: 'Citron, doux' },
  { name: 'Lavandulyl acetate', family: 'Esters terpéniques', chemicalClass: 'ester', olfactiveProfile: 'Lavande, herbacé, frais' },
  { name: 'Terpinen-4-ol', family: 'Alcools terpéniques', chemicalClass: 'alcohol', olfactiveProfile: 'Terreux, boisé, épicé' },
  { name: 'Damascenone', family: 'Cétones', chemicalClass: 'ketone', olfactiveProfile: 'Rose, miel, fruité' },
  { name: 'Nerol', family: 'Alcools terpéniques', chemicalClass: 'alcohol', olfactiveProfile: 'Rose, citrus, frais' },
  { name: 'Methyl anthranilate', family: 'Esters aromatiques', chemicalClass: 'ester', olfactiveProfile: 'Raisin, floral, fruité' },
  { name: 'Phytol', family: 'Diterpènes', chemicalClass: 'diterpene', olfactiveProfile: 'Vert, balsamique, floral' },
  { name: 'Alpha-bulnesene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Patchouli, boisé' },
  { name: 'Alpha-guaiene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Patchouli, boisé, terreux' },
  { name: 'Seychellene', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Patchouli, boisé' },
  { name: 'Pogostol', family: 'Sesquiterpènes', chemicalClass: 'sesquiterpene', olfactiveProfile: 'Patchouli, terreux' },
];

// Plantes manquantes avec leurs propriétés
const missingPlants = [
  { name: 'Bigaradier', latinName: 'Citrus aurantium', category: 'aromatique', family: 'Rutaceae' },
  { name: 'Orange amère', latinName: 'Citrus aurantium var. amara', category: 'aromatique', family: 'Rutaceae' },
  { name: 'Cyprès', latinName: 'Cupressus sempervirens', category: 'aromatique', family: 'Cupressaceae' },
  { name: 'Genévrier', latinName: 'Juniperus communis', category: 'aromatique', family: 'Cupressaceae' },
  { name: 'Palmarosa', latinName: 'Cymbopogon martinii', category: 'aromatique', family: 'Poaceae' },
  { name: 'Coriandre', latinName: 'Coriandrum sativum', category: 'aromatique', family: 'Apiaceae' },
  { name: 'Poivre noir', latinName: 'Piper nigrum', category: 'aromatique', family: 'Piperaceae' },
  { name: 'Muscade', latinName: 'Myristica fragrans', category: 'aromatique', family: 'Myristicaceae' },
  { name: 'Camomille romaine', latinName: 'Chamaemelum nobile', category: 'fleur', family: 'Asteraceae' },
  { name: 'Camomille allemande', latinName: 'Matricaria chamomilla', category: 'fleur', family: 'Asteraceae' },
  { name: 'Immortelle', latinName: 'Helichrysum italicum', category: 'fleur', family: 'Asteraceae' },
  { name: 'Anis étoilé', latinName: 'Illicium verum', category: 'aromatique', family: 'Schisandraceae' },
  { name: 'Cumin', latinName: 'Cuminum cyminum', category: 'aromatique', family: 'Apiaceae' },
];

async function main() {
  console.log('=== ENRICHISSEMENT DES LIAISONS PLANTE-MOLÉCULE ===\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // 1. Ajouter les molécules manquantes
    console.log('1. Ajout des molécules manquantes...');
    let addedMolecules = 0;
    
    for (const mol of missingMolecules) {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE LOWER(name) = LOWER(?)',
        [mol.name]
      );
      
      if (existing.length === 0) {
        await connection.execute(`
          INSERT INTO molecules (name, family, chemical_class, olfactiveProfile, validation_status, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, 'valide', NOW(), NOW())
        `, [mol.name, mol.family, mol.chemicalClass, mol.olfactiveProfile]);
        addedMolecules++;
      }
    }
    console.log(`   - ${addedMolecules} molécules ajoutées`);
    
    // 2. Ajouter les plantes manquantes
    console.log('\n2. Ajout des plantes manquantes...');
    let addedPlants = 0;
    
    for (const plant of missingPlants) {
      // Vérifier si la plante existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM plants WHERE LOWER(latin_name) = LOWER(?) OR LOWER(name) = LOWER(?)',
        [plant.latinName, plant.name]
      );
      
      if (existing.length === 0) {
        await connection.execute(`
          INSERT INTO plants (name, latin_name, category, family, validation_status, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'valide', NOW(), NOW())
        `, [plant.name, plant.latinName, plant.category, plant.family]);
        addedPlants++;
      }
    }
    console.log(`   - ${addedPlants} plantes ajoutées`);
    
    // 3. Recharger les données
    console.log('\n3. Rechargement des entités...');
    const [plants] = await connection.execute('SELECT id, name, latin_name FROM plants');
    const [molecules] = await connection.execute('SELECT id, name FROM molecules');
    
    const plantByName = new Map();
    const plantByLatinName = new Map();
    plants.forEach(p => {
      plantByName.set(p.name.toLowerCase().trim(), p.id);
      if (p.latin_name) {
        plantByLatinName.set(p.latin_name.toLowerCase().trim(), p.id);
      }
    });
    
    const moleculeByName = new Map();
    molecules.forEach(m => {
      moleculeByName.set(m.name.toLowerCase().trim(), m.id);
    });
    
    console.log(`   - ${plants.length} plantes`);
    console.log(`   - ${molecules.length} molécules`);
    
    // 4. Charger les liaisons existantes
    const [existingLinks] = await connection.execute('SELECT plant_id, molecule_id FROM plant_molecules');
    const existingSet = new Set(existingLinks.map(l => `${l.plant_id}-${l.molecule_id}`));
    console.log(`   - ${existingLinks.length} liaisons existantes`);
    
    // 5. Retraiter le fichier enriched_plant_molecules.csv
    console.log('\n4. Traitement de enriched_plant_molecules.csv...');
    const enrichedPath = path.join(process.cwd(), 'data/enriched_plant_molecules.csv');
    const enrichedData = fs.readFileSync(enrichedPath, 'utf-8');
    const enrichedRecords = parse(enrichedData, { columns: true, skip_empty_lines: true });
    
    let newLinksCount = 0;
    let updatedLinksCount = 0;
    
    for (const record of enrichedRecords) {
      const plantLatinName = record.plant_latin_name?.toLowerCase().trim();
      const plantCommonName = record.plant_common_name?.toLowerCase().trim();
      const moleculeName = record.molecule_name?.toLowerCase().trim();
      
      let plantId = plantByLatinName.get(plantLatinName) || plantByName.get(plantCommonName);
      let moleculeId = moleculeByName.get(moleculeName);
      
      if (!plantId || !moleculeId) continue;
      
      const linkKey = `${plantId}-${moleculeId}`;
      
      let role = null;
      if (record.role) {
        const roleMap = { 'majeur': 'majeur', 'secondaire': 'secondaire', 'trace': 'trace' };
        role = roleMap[record.role.toLowerCase()] || null;
      }
      
      const percentageTypical = record.percentage_typical ? parseFloat(record.percentage_typical) : null;
      const isSignature = record.is_signature === '1' ? 1 : 0;
      
      if (existingSet.has(linkKey)) {
        // Mettre à jour si on a des données
        if (percentageTypical || role || isSignature) {
          await connection.execute(`
            UPDATE plant_molecules 
            SET percentage_typical = COALESCE(?, percentage_typical),
                role = COALESCE(?, role),
                is_signature = COALESCE(?, is_signature),
                updated_at = NOW()
            WHERE plant_id = ? AND molecule_id = ?
          `, [percentageTypical, role, isSignature, plantId, moleculeId]);
          updatedLinksCount++;
        }
      } else {
        await connection.execute(`
          INSERT INTO plant_molecules (plant_id, molecule_id, percentage_typical, role, is_signature, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `, [plantId, moleculeId, percentageTypical, role, isSignature]);
        existingSet.add(linkKey);
        newLinksCount++;
      }
    }
    
    console.log(`   - ${newLinksCount} nouvelles liaisons`);
    console.log(`   - ${updatedLinksCount} liaisons mises à jour`);
    
    // 6. Statistiques finales
    console.log('\n=== STATISTIQUES FINALES ===');
    const [finalStats] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM plant_molecules) as total_liaisons,
        (SELECT COUNT(DISTINCT plant_id) FROM plant_molecules) as plantes_liees,
        (SELECT COUNT(DISTINCT molecule_id) FROM plant_molecules) as molecules_liees,
        (SELECT COUNT(*) FROM plants) as total_plantes,
        (SELECT COUNT(*) FROM molecules) as total_molecules
    `);
    
    const stats = finalStats[0];
    console.log(`Total liaisons: ${stats.total_liaisons}`);
    console.log(`Plantes avec liaisons: ${stats.plantes_liees}/${stats.total_plantes} (${(stats.plantes_liees/stats.total_plantes*100).toFixed(1)}%)`);
    console.log(`Molécules avec liaisons: ${stats.molecules_liees}/${stats.total_molecules} (${(stats.molecules_liees/stats.total_molecules*100).toFixed(1)}%)`);
    
    // 7. Afficher les top liaisons
    console.log('\n=== TOP 10 PLANTES AVEC LE PLUS DE LIAISONS ===');
    const [topPlants] = await connection.execute(`
      SELECT p.name, COUNT(pm.molecule_id) as count
      FROM plants p
      JOIN plant_molecules pm ON p.id = pm.plant_id
      GROUP BY p.id, p.name
      ORDER BY count DESC
      LIMIT 10
    `);
    topPlants.forEach((p, i) => console.log(`${i+1}. ${p.name}: ${p.count} molécules`));
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
