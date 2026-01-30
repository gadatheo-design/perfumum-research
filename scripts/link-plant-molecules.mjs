/**
 * Script pour lier les molécules aux plantes aromatiques
 * PERFUMUM Research Project - 06 janvier 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

// Profils moléculaires par plante
const moleculeProfiles = {
  "Lippia origanoides": [
    { name: "Thymol", percentageMin: 34, percentageMax: 58, percentageTypical: 47, isSignature: 1, role: "majeur" },
    { name: "Carvacrol", percentageMin: 26, percentageMax: 42, percentageTypical: 33, isSignature: 1, role: "majeur" },
    { name: "p-Cymène", percentageMin: 11, percentageMax: 19, percentageTypical: 15, isSignature: 0, role: "secondaire" },
    { name: "γ-Terpinène", percentageMin: 8, percentageMax: 10.5, percentageTypical: 9, isSignature: 0, role: "majeur" }
  ],
  "Tagetes lucida": [
    { name: "Estragole", percentageMin: 70, percentageMax: 96.8, percentageTypical: 85, isSignature: 1, role: "majeur" },
    { name: "Anéthole", percentageMin: 5, percentageMax: 42, percentageTypical: 15, isSignature: 1, role: "secondaire" },
    { name: "Méthyleugénol", percentageMin: 2, percentageMax: 8, percentageTypical: 5, isSignature: 0, role: "trace" },
    { name: "β-Ocimène", percentageMin: 1, percentageMax: 11, percentageTypical: 6, isSignature: 0, role: "secondaire" }
  ],
  "Lippia multiflora": [
    { name: "Thymol", percentageMin: 29, percentageMax: 40, percentageTypical: 35, isSignature: 1, role: "majeur" },
    { name: "p-Cymène", percentageMin: 14, percentageMax: 26, percentageTypical: 20, isSignature: 1, role: "majeur" },
    { name: "γ-Terpinène", percentageMin: 5, percentageMax: 10, percentageTypical: 7.5, isSignature: 0, role: "secondaire" },
    { name: "Carvacrol", percentageMin: 3, percentageMax: 8, percentageTypical: 5.5, isSignature: 0, role: "secondaire" },
    { name: "β-Caryophyllène", percentageMin: 2, percentageMax: 6, percentageTypical: 4, isSignature: 0, role: "trace" }
  ],
  "Ocimum canum": [
    { name: "1,8-Cinéole", percentageMin: 60, percentageMax: 68.5, percentageTypical: 64, isSignature: 1, role: "majeur" },
    { name: "β-Élémène", percentageMin: 20, percentageMax: 33, percentageTypical: 26, isSignature: 1, role: "majeur" }
  ]
};

// Alias de noms de molécules pour la recherche
const moleculeAliases = {
  "γ-Terpinène": ["gamma-Terpinène", "gamma-Terpinene", "Gamma-terpinène", "γ-Terpinene"],
  "β-Ocimène": ["beta-Ocimène", "beta-Ocimene", "Beta-ocimène", "β-Ocimene", "Ocimène"],
  "β-Caryophyllène": ["beta-Caryophyllène", "beta-Caryophyllene", "Beta-caryophyllène", "β-Caryophyllene", "Caryophyllène"],
  "β-Élémène": ["beta-Élémène", "beta-Elemene", "Beta-élémène", "β-Elemene", "Élémène"],
  "1,8-Cinéole": ["Eucalyptol", "Cineole", "Cinéole"],
  "p-Cymène": ["para-Cymène", "p-Cymene", "Para-cymène", "Cymène"],
  "Méthyleugénol": ["Methyleugenol", "Methyl eugenol"]
};

async function linkMolecules() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🔗 Liaison des molécules aux plantes aromatiques...\n');
    
    let totalLinks = 0;
    let newLinks = 0;
    let existingLinks = 0;
    let notFoundMolecules = [];
    
    for (const [latinName, molecules] of Object.entries(moleculeProfiles)) {
      // Récupérer l'ID de la plante
      const [plants] = await connection.execute(
        'SELECT id, name FROM plants WHERE latin_name = ?',
        [latinName]
      );
      
      if (plants.length === 0) {
        console.log(`⚠️  Plante non trouvée: ${latinName}`);
        continue;
      }
      
      const plantId = plants[0].id;
      const plantName = plants[0].name;
      console.log(`\n🌿 ${plantName} (${latinName}) - ID: ${plantId}`);
      
      for (const mol of molecules) {
        // Rechercher la molécule par nom ou alias
        let moleculeId = null;
        let moleculeName = mol.name;
        
        // Recherche directe
        const [directMatch] = await connection.execute(
          'SELECT id, name FROM molecules WHERE name = ? OR name LIKE ?',
          [mol.name, `%${mol.name}%`]
        );
        
        if (directMatch.length > 0) {
          moleculeId = directMatch[0].id;
          moleculeName = directMatch[0].name;
        } else {
          // Recherche par alias
          const aliases = moleculeAliases[mol.name] || [];
          for (const alias of aliases) {
            const [aliasMatch] = await connection.execute(
              'SELECT id, name FROM molecules WHERE name = ? OR name LIKE ?',
              [alias, `%${alias}%`]
            );
            if (aliasMatch.length > 0) {
              moleculeId = aliasMatch[0].id;
              moleculeName = aliasMatch[0].name;
              break;
            }
          }
        }
        
        if (!moleculeId) {
          console.log(`   ⚠️  Molécule non trouvée: ${mol.name}`);
          notFoundMolecules.push({ plant: latinName, molecule: mol.name });
          continue;
        }
        
        // Vérifier si le lien existe déjà
        const [existingLink] = await connection.execute(
          'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
          [plantId, moleculeId]
        );
        
        if (existingLink.length > 0) {
          // Mettre à jour le lien existant
          await connection.execute(`
            UPDATE plant_molecules SET
              percentage_min = ?,
              percentage_max = ?,
              percentage_typical = ?,
              is_signature = ?,
              role = ?
            WHERE plant_id = ? AND molecule_id = ?
          `, [
            mol.percentageMin,
            mol.percentageMax,
            mol.percentageTypical,
            mol.isSignature,
            mol.role,
            plantId,
            moleculeId
          ]);
          console.log(`   ✓ ${moleculeName} (${mol.percentageMin}-${mol.percentageMax}%) - mis à jour`);
          existingLinks++;
        } else {
          // Créer le nouveau lien
          await connection.execute(`
            INSERT INTO plant_molecules (
              plant_id, molecule_id, percentage_min, percentage_max, 
              percentage_typical, is_signature, role
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            plantId,
            moleculeId,
            mol.percentageMin,
            mol.percentageMax,
            mol.percentageTypical,
            mol.isSignature,
            mol.role
          ]);
          console.log(`   ✅ ${moleculeName} (${mol.percentageMin}-${mol.percentageMax}%) - lié`);
          newLinks++;
        }
        
        totalLinks++;
      }
    }
    
    console.log('\n📊 Résumé des liaisons:');
    console.log(`   - Total traité: ${totalLinks}`);
    console.log(`   - Nouveaux liens: ${newLinks}`);
    console.log(`   - Liens mis à jour: ${existingLinks}`);
    
    if (notFoundMolecules.length > 0) {
      console.log(`\n⚠️  Molécules non trouvées (${notFoundMolecules.length}):`);
      for (const nf of notFoundMolecules) {
        console.log(`   - ${nf.molecule} (pour ${nf.plant})`);
      }
    }
    
    console.log('\n✅ Liaison terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

linkMolecules().catch(console.error);
