/**
 * Script étendu pour peupler la table molecule_origins
 * Basé sur l'analyse des botanicalSources et sourceOrigin de toutes les molécules
 */

import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Mapping des plantes/sources vers les origines géographiques
const plantToOriginMapping = {
  // Lavande -> Lavande de Provence (id: 19)
  'lavande': { originId: 19, isPrimary: 1, quality: 5, notes: 'Lavandula angustifolia de Provence' },
  'lavandula': { originId: 19, isPrimary: 1, quality: 5, notes: 'Lavande de Provence' },
  
  // Rose -> Rose de Bulgarie (id: 1) comme origine principale
  'rose': { originId: 1, isPrimary: 1, quality: 5, notes: 'Rosa damascena' },
  'rosa': { originId: 1, isPrimary: 1, quality: 5, notes: 'Rosa damascena de Bulgarie' },
  
  // Jasmin -> Jasmin de Grasse (id: 12)
  'jasmin': { originId: 12, isPrimary: 1, quality: 5, notes: 'Jasminum grandiflorum de Grasse' },
  'jasminum': { originId: 12, isPrimary: 1, quality: 5, notes: 'Jasmin de Grasse' },
  
  // Agrumes -> Bergamote de Calabre (id: 4)
  'bergamote': { originId: 4, isPrimary: 1, quality: 5, notes: 'Citrus bergamia de Calabre' },
  'citrus': { originId: 4, isPrimary: 0, quality: 4, notes: 'Agrumes méditerranéens' },
  'orange': { originId: 6, isPrimary: 1, quality: 4, notes: 'Orange amère de Séville' },
  'citron': { originId: 5, isPrimary: 1, quality: 4, notes: 'Citron de Menton' },
  
  // Vétiver -> Vétiver d'Haïti (id: 7)
  'vétiver': { originId: 7, isPrimary: 1, quality: 5, notes: 'Vetiveria zizanioides d\'Haïti' },
  'vetiver': { originId: 7, isPrimary: 1, quality: 5, notes: 'Vétiver haïtien' },
  
  // Santal -> Santal de Mysore (id: 9)
  'santal': { originId: 9, isPrimary: 1, quality: 5, notes: 'Santalum album de Mysore' },
  'santalum': { originId: 9, isPrimary: 1, quality: 5, notes: 'Santal indien' },
  
  // Cèdre -> Cèdre de l'Atlas (id: 10)
  'cèdre': { originId: 10, isPrimary: 1, quality: 5, notes: 'Cedrus atlantica du Maroc' },
  'cedrus': { originId: 10, isPrimary: 1, quality: 5, notes: 'Cèdre de l\'Atlas' },
  
  // Encens -> Encens d'Oman (id: 11)
  'encens': { originId: 11, isPrimary: 1, quality: 5, notes: 'Boswellia sacra d\'Oman' },
  'oliban': { originId: 11, isPrimary: 1, quality: 5, notes: 'Encens du Dhofar' },
  'boswellia': { originId: 11, isPrimary: 1, quality: 5, notes: 'Boswellia sacra' },
  
  // Myrrhe -> Encens d'Oman (proche géographiquement)
  'myrrhe': { originId: 11, isPrimary: 0, quality: 4, notes: 'Commiphora myrrha de la région' },
  
  // Tubéreuse -> Tubéreuse d'Inde (id: 15)
  'tubéreuse': { originId: 15, isPrimary: 1, quality: 5, notes: 'Polianthes tuberosa d\'Inde' },
  'tuberosa': { originId: 15, isPrimary: 1, quality: 5, notes: 'Tubéreuse de Madurai' },
  
  // Ylang -> Ylang-ylang de Madagascar (id: 14)
  'ylang': { originId: 14, isPrimary: 1, quality: 5, notes: 'Cananga odorata de Madagascar' },
  
  // Vanille -> Vanille de Madagascar (id: 16)
  'vanille': { originId: 16, isPrimary: 1, quality: 5, notes: 'Vanilla planifolia de Madagascar' },
  'vanilla': { originId: 16, isPrimary: 1, quality: 5, notes: 'Vanille de la région SAVA' },
  
  // Cardamome -> Cardamome du Guatemala (id: 17)
  'cardamome': { originId: 17, isPrimary: 1, quality: 5, notes: 'Elettaria cardamomum du Guatemala' },
  'cardamomum': { originId: 17, isPrimary: 1, quality: 5, notes: 'Cardamome d\'Alta Verapaz' },
  
  // Poivre -> Poivre noir de Kampot (id: 18)
  'poivre': { originId: 18, isPrimary: 1, quality: 5, notes: 'Piper nigrum de Kampot' },
  'piper': { originId: 18, isPrimary: 1, quality: 5, notes: 'Poivre noir du Cambodge' },
  
  // Patchouli -> Patchouli d'Indonésie (id: 20)
  'patchouli': { originId: 20, isPrimary: 1, quality: 5, notes: 'Pogostemon cablin de Sumatra' },
};

// Récupérer toutes les molécules avec leurs sources
const [molecules] = await connection.query(`
  SELECT id, name, sourceOrigin, botanicalSources 
  FROM molecules 
  WHERE (sourceOrigin IS NOT NULL AND sourceOrigin != '') 
     OR (botanicalSources IS NOT NULL AND botanicalSources != '')
`);

console.log(`=== Analyse de ${molecules.length} molécules ===\n`);

// Récupérer les associations existantes
const [existingAssocs] = await connection.query('SELECT molecule_id, origin_id FROM molecule_origins');
const existingSet = new Set(existingAssocs.map(a => `${a.molecule_id}-${a.origin_id}`));

let inserted = 0;
let skipped = 0;

for (const molecule of molecules) {
  const searchText = `${molecule.sourceOrigin || ''} ${molecule.botanicalSources || ''}`.toLowerCase();
  
  for (const [keyword, mapping] of Object.entries(plantToOriginMapping)) {
    if (searchText.includes(keyword)) {
      const key = `${molecule.id}-${mapping.originId}`;
      
      if (!existingSet.has(key)) {
        try {
          await connection.query(
            `INSERT INTO molecule_origins (molecule_id, origin_id, is_primary_origin, quality_rating, notes, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [molecule.id, mapping.originId, mapping.isPrimary, mapping.quality, `${mapping.notes} - via ${molecule.name}`]
          );
          console.log(`✓ ${molecule.name} (${molecule.id}) -> Origin ${mapping.originId} (${keyword})`);
          existingSet.add(key);
          inserted++;
        } catch (error) {
          if (!error.message.includes('Duplicate')) {
            console.error(`Erreur: ${error.message}`);
          }
        }
      } else {
        skipped++;
      }
    }
  }
}

// Vérification finale
const [[countResult]] = await connection.query('SELECT COUNT(*) as cnt FROM molecule_origins');
console.log(`\n=== Résumé ===`);
console.log(`Nouvelles insertions: ${inserted}`);
console.log(`Associations existantes ignorées: ${skipped}`);
console.log(`Total dans molecule_origins: ${countResult.cnt}`);

await connection.end();
