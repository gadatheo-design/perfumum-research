/**
 * Script pour peupler la table molecule_origins
 * Associe les molécules à leurs origines géographiques
 */

import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Mapping des associations molécules -> origines géographiques
// Basé sur l'analyse des données sourceOrigin et botanicalSources
const moleculeOriginMappings = [
  // Rose de Bulgarie (id: 1)
  { moleculeName: 'Absolue de Rose (Citronellol)', originId: 1, isPrimary: 1, quality: 5, notes: 'Rose damascena de la Vallée des Roses' },
  
  // Rose de Grasse (id: 2)
  { moleculeName: 'Absolue de Rose (Citronellol)', originId: 2, isPrimary: 0, quality: 5, notes: 'Rose centifolia de Grasse' },
  
  // Rose de Taïf (id: 3)
  { moleculeName: 'Absolue de Rose (Citronellol)', originId: 3, isPrimary: 0, quality: 5, notes: 'Rose de Taïf, production limitée' },
  
  // Bergamote de Calabre (id: 4)
  { moleculeName: 'Bergamote Calabre (Linalyl Acetate)', originId: 4, isPrimary: 1, quality: 5, notes: '95% de la production mondiale' },
  { moleculeName: 'Limonène', originId: 4, isPrimary: 0, quality: 4, notes: 'Composant majeur de la bergamote' },
  
  // Citron de Menton (id: 5)
  { moleculeName: 'Limonène', originId: 5, isPrimary: 0, quality: 4, notes: 'IGP Citron de Menton' },
  
  // Orange amère de Séville (id: 6)
  { moleculeName: 'Limonène', originId: 6, isPrimary: 0, quality: 4, notes: 'Néroli et petit-grain' },
  
  // Vétiver d'Haïti (id: 7)
  { moleculeName: 'Vétivénol', originId: 7, isPrimary: 1, quality: 5, notes: 'Vétiver haïtien réputé pour sa qualité' },
  { moleculeName: 'Vétivone', originId: 7, isPrimary: 1, quality: 5, notes: 'Composant caractéristique du vétiver' },
  { moleculeName: 'Khusimol', originId: 7, isPrimary: 1, quality: 5, notes: 'Molécule signature du vétiver' },
  
  // Vétiver de Java (id: 8)
  { moleculeName: 'Vétivénol', originId: 8, isPrimary: 0, quality: 4, notes: 'Vétiver de Java, profil différent' },
  { moleculeName: 'Vétivone', originId: 8, isPrimary: 0, quality: 4, notes: 'Vétiver indonésien' },
  { moleculeName: 'Khusimol', originId: 8, isPrimary: 0, quality: 4, notes: 'Vétiver de Java' },
  
  // Santal de Mysore (id: 9)
  { moleculeName: 'Santal Mysore (α-Santalol)', originId: 9, isPrimary: 1, quality: 5, notes: 'Santalum album protégé CITES' },
  
  // Cèdre de l'Atlas (id: 10)
  { moleculeName: 'Cèdre Atlas (Cedrene)', originId: 10, isPrimary: 1, quality: 5, notes: 'Cedrus atlantica du Moyen Atlas' },
  
  // Encens d'Oman (id: 11)
  { moleculeName: 'Encens Oliban (Incensole)', originId: 11, isPrimary: 1, quality: 5, notes: 'Boswellia sacra du Dhofar' },
  { moleculeName: 'Incensol', originId: 11, isPrimary: 1, quality: 5, notes: 'Molécule signature de l\'encens d\'Oman' },
  { moleculeName: 'Incensol acetate', originId: 11, isPrimary: 1, quality: 5, notes: 'Dérivé acétylé de l\'incensol' },
  
  // Jasmin de Grasse (id: 12)
  { moleculeName: 'Absolue de Jasmin (Indole)', originId: 12, isPrimary: 1, quality: 5, notes: 'Jasminum grandiflorum de Grasse' },
  { moleculeName: 'Methyl Dihydrojasmonate', originId: 12, isPrimary: 0, quality: 4, notes: 'Accord jasmin de Grasse' },
  
  // Jasmin d'Égypte (id: 13)
  { moleculeName: 'Absolue de Jasmin (Indole)', originId: 13, isPrimary: 0, quality: 4, notes: 'Jasmin égyptien' },
  
  // Ylang-ylang de Madagascar (id: 14)
  { moleculeName: 'Linalool', originId: 14, isPrimary: 0, quality: 4, notes: 'Composant de l\'ylang-ylang' },
  
  // Tubéreuse d'Inde (id: 15)
  { moleculeName: 'Tubéreuse Absolue (Methyl Benzoate)', originId: 15, isPrimary: 1, quality: 5, notes: 'Polianthes tuberosa de Madurai' },
  
  // Vanille de Madagascar (id: 16)
  // Pas de molécule vanille identifiée dans la base actuelle
  
  // Cardamome du Guatemala (id: 17)
  { moleculeName: 'Cardamome (α-Terpinyl Acetate)', originId: 17, isPrimary: 1, quality: 5, notes: 'Elettaria cardamomum d\'Alta Verapaz' },
  
  // Poivre noir de Kampot (id: 18)
  { moleculeName: 'Caryophyllène', originId: 18, isPrimary: 0, quality: 4, notes: 'Composant du poivre noir' },
  
  // Lavande de Provence (id: 19)
  { moleculeName: 'Linalool', originId: 19, isPrimary: 1, quality: 5, notes: 'Lavandula angustifolia de Provence' },
  { moleculeName: 'Linalol Synthétique', originId: 19, isPrimary: 0, quality: 3, notes: 'Version synthétique du linalol naturel' },
  
  // Patchouli d'Indonésie (id: 20)
  // Pas de molécule patchoulol identifiée dans la base actuelle
  
  // Associations supplémentaires basées sur les données
  { moleculeName: 'Absolue d\'Iris (Orris Butter)', originId: 4, isPrimary: 0, quality: 4, notes: 'Iris pallida cultivé en Italie' },
  { moleculeName: 'Safranal', originId: 6, isPrimary: 0, quality: 4, notes: 'Safran d\'Espagne' },
];

// Fonction pour trouver l'ID d'une molécule par son nom
async function findMoleculeId(name) {
  const [rows] = await connection.query(
    'SELECT id FROM molecules WHERE name = ? OR name LIKE ?',
    [name, `%${name}%`]
  );
  return rows.length > 0 ? rows[0].id : null;
}

// Fonction pour insérer une association
async function insertMoleculeOrigin(moleculeId, originId, isPrimary, quality, notes) {
  try {
    await connection.query(
      `INSERT INTO molecule_origins (molecule_id, origin_id, is_primary_origin, quality_rating, notes, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         is_primary_origin = VALUES(is_primary_origin),
         quality_rating = VALUES(quality_rating),
         notes = VALUES(notes)`,
      [moleculeId, originId, isPrimary, quality, notes]
    );
    return true;
  } catch (error) {
    console.error(`Erreur insertion: ${error.message}`);
    return false;
  }
}

// Exécution principale
console.log('=== Peuplement de molecule_origins ===\n');

let inserted = 0;
let skipped = 0;
let errors = 0;

for (const mapping of moleculeOriginMappings) {
  const moleculeId = await findMoleculeId(mapping.moleculeName);
  
  if (moleculeId) {
    const success = await insertMoleculeOrigin(
      moleculeId,
      mapping.originId,
      mapping.isPrimary,
      mapping.quality,
      mapping.notes
    );
    
    if (success) {
      console.log(`✓ ${mapping.moleculeName} (ID: ${moleculeId}) -> Origin ${mapping.originId}`);
      inserted++;
    } else {
      errors++;
    }
  } else {
    console.log(`⚠ Molécule non trouvée: ${mapping.moleculeName}`);
    skipped++;
  }
}

// Vérification finale
const [[countResult]] = await connection.query('SELECT COUNT(*) as cnt FROM molecule_origins');
console.log(`\n=== Résumé ===`);
console.log(`Insertions réussies: ${inserted}`);
console.log(`Molécules non trouvées: ${skipped}`);
console.log(`Erreurs: ${errors}`);
console.log(`Total dans molecule_origins: ${countResult.cnt}`);

await connection.end();
