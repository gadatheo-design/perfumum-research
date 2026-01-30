/**
 * Script pour ajouter les restrictions IFRA des molécules manquantes
 * Molécules : géraniol, citronellol, méthyl-eugénol, bergaptène
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL non définie');
  process.exit(1);
}

// Données IFRA pour les molécules manquantes
// Source: IFRA Standards Library (49th Amendment)
const ifraData = [
  {
    name: 'Géraniol',
    casNumber: '106-24-1',
    ifraAmendment: '49th',
    restrictionType: 'restricted',
    reasonForRestriction: 'Allergène cutané - sensibilisation par contact',
    // Limites en % par catégorie IFRA
    category1: 5.3,    // Produits lèvres
    category2: 2.5,    // Déodorants
    category3: 0.5,    // Produits yeux
    category4: 5.3,    // Parfums fins
    category5a: 3.2,   // Corps (large)
    category5b: 5.3,   // Corps (localisé)
    category5c: 5.3,   // Pieds
    category5d: 0.5,   // Intimes
    category6: null,   // Buccaux - non applicable
    category7a: 3.2,   // Cheveux rinçage
    category7b: 5.3,   // Cheveux sans rinçage
    category8: 0.5,    // Bébés
    category9: 5.3,    // Ménagers
    category10a: 5.3,  // Détergents contact
    category10b: 5.3,  // Détergents indirect
    category11a: 5.3,  // Bougies intérieur
    category11b: 5.3,  // Bougies extérieur
  },
  {
    name: 'Citronellol',
    casNumber: '106-22-9',
    ifraAmendment: '49th',
    restrictionType: 'restricted',
    reasonForRestriction: 'Allergène cutané - sensibilisation par contact',
    category1: 8.0,
    category2: 4.0,
    category3: 0.8,
    category4: 8.0,
    category5a: 4.8,
    category5b: 8.0,
    category5c: 8.0,
    category5d: 0.8,
    category6: null,
    category7a: 4.8,
    category7b: 8.0,
    category8: 0.8,
    category9: 8.0,
    category10a: 8.0,
    category10b: 8.0,
    category11a: 8.0,
    category11b: 8.0,
  },
  {
    name: 'Méthyl-eugénol',
    casNumber: '93-15-2',
    ifraAmendment: '49th',
    restrictionType: 'restricted',
    reasonForRestriction: 'Potentiel cancérogène - génotoxicité',
    // Limites très strictes
    category1: 0.0002,
    category2: 0.0002,
    category3: 0.0002,
    category4: 0.0002,
    category5a: 0.0002,
    category5b: 0.0002,
    category5c: 0.0002,
    category5d: 0.0002,
    category6: null,
    category7a: 0.0002,
    category7b: 0.0002,
    category8: 0.0002,
    category9: 0.0002,
    category10a: 0.0002,
    category10b: 0.0002,
    category11a: 0.0002,
    category11b: 0.0002,
  },
  {
    name: 'Bergaptène',
    casNumber: '484-20-8',
    ifraAmendment: '49th',
    restrictionType: 'restricted',
    reasonForRestriction: 'Phototoxicité - furocoumarine',
    // Limites pour produits leave-on
    category1: 0.0015,
    category2: 0.0015,
    category3: 0.0015,
    category4: 0.0015,
    category5a: 0.0015,
    category5b: 0.0015,
    category5c: 0.0015,
    category5d: 0.0015,
    category6: null,
    category7a: 0.1,    // Rinçage - limite plus haute
    category7b: 0.0015,
    category8: 0.0015,
    category9: 0.1,
    category10a: 0.1,
    category10b: 0.1,
    category11a: 0.1,
    category11b: 0.1,
  },
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Connexion à la base de données établie');
  
  for (const molecule of ifraData) {
    // Chercher la molécule par nom ou CAS
    const [rows] = await connection.execute(
      'SELECT id FROM molecules WHERE name LIKE ? OR cas_number = ?',
      [`%${molecule.name}%`, molecule.casNumber]
    );
    
    let moleculeId;
    
    if (rows.length === 0) {
      // Créer la molécule si elle n'existe pas
      console.log(`Création de la molécule: ${molecule.name}`);
      const [result] = await connection.execute(
        `INSERT INTO molecules (name, cas_number, family, chemical_class) 
         VALUES (?, ?, 'Terpène', 'monoterpene')`,
        [molecule.name, molecule.casNumber]
      );
      moleculeId = result.insertId;
    } else {
      moleculeId = rows[0].id;
      console.log(`Molécule trouvée: ${molecule.name} (ID: ${moleculeId})`);
      
      // Mettre à jour le CAS si manquant
      await connection.execute(
        'UPDATE molecules SET cas_number = ? WHERE id = ? AND cas_number IS NULL',
        [molecule.casNumber, moleculeId]
      );
    }
    
    // Vérifier si une restriction existe déjà
    const [existingRestrictions] = await connection.execute(
      'SELECT id FROM ifra_restrictions WHERE molecule_id = ?',
      [moleculeId]
    );
    
    if (existingRestrictions.length > 0) {
      console.log(`  → Mise à jour de la restriction existante`);
      await connection.execute(
        `UPDATE ifra_restrictions SET
          ifra_amendment = ?,
          restriction_type = ?,
          reason_for_restriction = ?,
          category_1 = ?, category_2 = ?, category_3 = ?, category_4 = ?,
          category_5a = ?, category_5b = ?, category_5c = ?, category_5d = ?,
          category_6 = ?, category_7a = ?, category_7b = ?, category_8 = ?,
          category_9 = ?, category_10a = ?, category_10b = ?,
          category_11a = ?, category_11b = ?
        WHERE molecule_id = ?`,
        [
          molecule.ifraAmendment,
          molecule.restrictionType,
          molecule.reasonForRestriction,
          molecule.category1, molecule.category2, molecule.category3, molecule.category4,
          molecule.category5a, molecule.category5b, molecule.category5c, molecule.category5d,
          molecule.category6, molecule.category7a, molecule.category7b, molecule.category8,
          molecule.category9, molecule.category10a, molecule.category10b,
          molecule.category11a, molecule.category11b,
          moleculeId
        ]
      );
    } else {
      console.log(`  → Création de la restriction IFRA`);
      await connection.execute(
        `INSERT INTO ifra_restrictions (
          molecule_id, ifra_amendment, restriction_type, reason_for_restriction,
          category_1, category_2, category_3, category_4,
          category_5a, category_5b, category_5c, category_5d,
          category_6, category_7a, category_7b, category_8,
          category_9, category_10a, category_10b,
          category_11a, category_11b
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          moleculeId,
          molecule.ifraAmendment,
          molecule.restrictionType,
          molecule.reasonForRestriction,
          molecule.category1, molecule.category2, molecule.category3, molecule.category4,
          molecule.category5a, molecule.category5b, molecule.category5c, molecule.category5d,
          molecule.category6, molecule.category7a, molecule.category7b, molecule.category8,
          molecule.category9, molecule.category10a, molecule.category10b,
          molecule.category11a, molecule.category11b
        ]
      );
    }
    
    console.log(`  ✓ ${molecule.name} - restriction IFRA ajoutée/mise à jour`);
  }
  
  // Afficher les statistiques
  const [stats] = await connection.execute(
    'SELECT COUNT(*) as total FROM ifra_restrictions'
  );
  console.log(`\nTotal des restrictions IFRA: ${stats[0].total}`);
  
  await connection.end();
  console.log('\nTerminé !');
}

main().catch(console.error);
