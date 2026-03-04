/**
 * Créer les liaisons plante-molécule pour les variétés tabac
 * Basé sur le guideline PERFUMUM et les données GC-MS de PMC8306096, PMC6804150, MDPI:1420-3049/25/7/1734
 * 
 * Variétés cibles :
 * - Virginia (flue-cured) — id: 7
 * - Burley (air-cured) — id: 8
 * - Latakia — id: 150002
 * - Perique — id: 150001
 * - Tabac cultivé — id: 330002
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les IDs des molécules par nom
async function getMoleculeId(name) {
  const [rows] = await db.execute(
    'SELECT id FROM molecules WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1',
    [name]
  );
  return rows.length > 0 ? rows[0].id : null;
}

// Vérifier si une liaison existe déjà
async function liaisonExists(plantId, moleculeId) {
  const [rows] = await db.execute(
    'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
    [plantId, moleculeId]
  );
  return rows.length > 0;
}

// Créer une liaison
async function createLiaison(plantId, moleculeId, data) {
  const [result] = await db.execute(
    `INSERT INTO plant_molecules 
      (plant_id, molecule_id, percentage, percentage_min, percentage_max, source, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      plantId,
      moleculeId,
      data.percentage,
      data.percentageMin || null,
      data.percentageMax || null,
      data.source,
      data.notes || null
    ]
  );
  return result.insertId;
}

// Données de liaisons par variété
// Sources : PMC8306096, PMC6804150, MDPI:1420-3049/25/7/1734
const tobaccoLiaisons = {
  // Virginia (flue-cured) — id: 7
  7: [
    // Norisoprénoïdes (caroténoïdes dégradés) — typiques Virginia
    { molecule: 'Megastigmatrienone', percentage: 0.8, percentageMin: 0.5, percentageMax: 1.2, source: 'PMC:8306096', notes: 'Composé dominant arôme tabac Virginia fermenté ; dérivé caroténoïdes' },
    { molecule: 'β-Cyclocitral', percentage: 0.4, percentageMin: 0.2, percentageMax: 0.6, source: 'PMC:8306096', notes: 'Typique flue-cured Virginia ; honey-sweet' },
    { molecule: 'Solanone', percentage: 0.3, percentageMin: 0.1, percentageMax: 0.5, source: 'PMC:8306096', notes: 'Présente dans HE tabac Virginia' },
    // Aldéhydes — douceur Virginia
    { molecule: 'Benzeneacetaldehyde', percentage: 0.2, percentageMin: 0.1, percentageMax: 0.4, source: 'PMC:8306096', notes: 'Marqueur sweetness Virginia flue-cured' },
    { molecule: '1-Nonanal', percentage: 0.15, percentageMin: 0.05, percentageMax: 0.3, source: 'PMC:8306096', notes: 'Aldéhyde aliphatique, douceur miellée Virginia' },
    // Terpènes
    { molecule: 'Neophytadiene', percentage: 1.5, percentageMin: 0.8, percentageMax: 2.5, source: 'PMC:8306096', notes: 'Très présent dans feuilles Virginia ; diterpène' },
  ],
  // Burley (air-cured) — id: 8
  8: [
    // Pyrazines — typiques Burley (réactions de Maillard)
    { molecule: '2-Acétylpyrazine', percentage: 0.1, percentageMin: 0.05, percentageMax: 0.2, source: 'MDPI:1420-3049/25/7/1734', notes: 'Réaction de Maillard ; noisette-grillé Burley' },
    { molecule: '2-Méthoxypyrazine', percentage: 0.08, percentageMin: 0.03, percentageMax: 0.15, source: 'MDPI:1420-3049/25/7/1734', notes: 'Pyrazine végétal-grillé ; Burley air-cured' },
    // Furanones — caramélisation
    { molecule: '5-Méthylfurfural', percentage: 0.12, percentageMin: 0.05, percentageMax: 0.25, source: 'MDPI:1420-3049/25/7/1734', notes: 'Produit de caramélisation ; sucré-caramel Burley' },
    // Norisoprénoïdes
    { molecule: 'β-Damascenone', percentage: 0.8, percentageMin: 0.4, percentageMax: 1.5, source: 'PMC:6804150', notes: 'Très puissant ; fruité-floral Burley' },
    { molecule: 'Megastigmatrienone', percentage: 0.5, percentageMin: 0.2, percentageMax: 0.9, source: 'PMC:8306096', notes: 'Composé arôme dominant Burley fermenté' },
    // Terpènes
    { molecule: 'Neophytadiene', percentage: 1.2, percentageMin: 0.6, percentageMax: 2.0, source: 'PMC:8306096', notes: 'Diterpène présent dans feuilles Burley' },
    // Sesquiterpènes
    { molecule: 'Farnesylacetone', percentage: 0.1, percentageMin: 0.05, percentageMax: 0.2, source: 'ScienceDirect:S0926669025007824', notes: 'Sesquiterpène ; grades aromatiques Burley' },
  ],
  // Latakia — id: 150002 (fumé au bois de chêne/pin)
  150002: [
    // Phénols fumés — typiques Latakia
    { molecule: 'Guaiacol', percentage: 0.5, percentageMin: 0.2, percentageMax: 1.0, source: 'PMC:8306096', notes: 'Phénol fumé dominant Latakia ; fumée bois' },
    { molecule: '4-Méthylguaiacol', percentage: 0.3, percentageMin: 0.1, percentageMax: 0.6, source: 'PMC:8306096', notes: 'Phénol fumé Latakia ; fumée bois résine' },
    // Norisoprénoïdes
    { molecule: 'β-Damascenone', percentage: 0.6, percentageMin: 0.3, percentageMax: 1.0, source: 'PMC:6804150', notes: 'Fruité-floral Latakia' },
    { molecule: 'Megastigmatrienone', percentage: 0.4, percentageMin: 0.2, percentageMax: 0.7, source: 'PMC:8306096', notes: 'Arôme tabac fumé Latakia' },
    // Pyrazines (combustion)
    { molecule: '2-Acétylpyrazine', percentage: 0.15, percentageMin: 0.05, percentageMax: 0.3, source: 'MDPI:1420-3049/25/7/1734', notes: 'Grillé-noisette Latakia fumé' },
    // Terpènes
    { molecule: 'Neophytadiene', percentage: 0.8, percentageMin: 0.4, percentageMax: 1.5, source: 'PMC:8306096', notes: 'Diterpène feuilles Latakia' },
  ],
  // Perique — id: 150001 (fermenté sous pression)
  150001: [
    // Esters fermentation
    { molecule: 'Farnesylacetone', percentage: 0.2, percentageMin: 0.1, percentageMax: 0.4, source: 'ScienceDirect:S0926669025007824', notes: 'Sesquiterpène ; fermentation Perique' },
    // Norisoprénoïdes
    { molecule: 'β-Damascenone', percentage: 1.0, percentageMin: 0.5, percentageMax: 1.8, source: 'PMC:6804150', notes: 'Très puissant ; fruité Perique fermenté' },
    { molecule: 'Megastigmatrienone', percentage: 0.6, percentageMin: 0.3, percentageMax: 1.0, source: 'PMC:8306096', notes: 'Arôme dominant Perique fermenté' },
    // Furanones
    { molecule: '5-Méthylfurfural', percentage: 0.2, percentageMin: 0.1, percentageMax: 0.4, source: 'MDPI:1420-3049/25/7/1734', notes: 'Caramélisation fermentation Perique' },
    // Aldéhydes
    { molecule: 'Benzeneacetaldehyde', percentage: 0.15, percentageMin: 0.05, percentageMax: 0.3, source: 'PMC:8306096', notes: 'Douceur florale Perique' },
  ],
  // Tabac cultivé (général) — id: 330002
  330002: [
    { molecule: 'Megastigmatrienone', percentage: 0.6, percentageMin: 0.3, percentageMax: 1.0, source: 'PMC:8306096', notes: 'Composé arôme dominant tabac cultivé' },
    { molecule: 'β-Damascenone', percentage: 0.7, percentageMin: 0.3, percentageMax: 1.2, source: 'PMC:6804150', notes: 'Fruité-floral tabac cultivé' },
    { molecule: 'Neophytadiene', percentage: 1.0, percentageMin: 0.5, percentageMax: 2.0, source: 'PMC:8306096', notes: 'Diterpène feuilles tabac cultivé' },
    { molecule: '2-Acétylpyrazine', percentage: 0.08, percentageMin: 0.02, percentageMax: 0.15, source: 'MDPI:1420-3049/25/7/1734', notes: 'Maillard tabac cultivé' },
    { molecule: '5-Méthylfurfural', percentage: 0.1, percentageMin: 0.05, percentageMax: 0.2, source: 'MDPI:1420-3049/25/7/1734', notes: 'Caramélisation tabac cultivé' },
  ]
};

let created = 0;
let skipped = 0;
let errors = 0;
let notFound = [];

for (const [plantId, liaisons] of Object.entries(tobaccoLiaisons)) {
  const pid = parseInt(plantId);
  
  for (const liaison of liaisons) {
    try {
      const molId = await getMoleculeId(liaison.molecule);
      
      if (!molId) {
        console.log(`⚠️  Molécule non trouvée : ${liaison.molecule}`);
        notFound.push(liaison.molecule);
        continue;
      }
      
      const exists = await liaisonExists(pid, molId);
      if (exists) {
        console.log(`⏭️  Liaison existante : plant=${pid} ↔ mol=${liaison.molecule}`);
        skipped++;
        continue;
      }
      
      const id = await createLiaison(pid, molId, liaison);
      console.log(`✅ Liaison créée (id=${id}) : plant=${pid} ↔ ${liaison.molecule} (${liaison.percentage}%) — ${liaison.source}`);
      created++;
    } catch (err) {
      console.error(`❌ Erreur : plant=${pid} ↔ ${liaison.molecule}: ${err.message}`);
      errors++;
    }
  }
}

// Résumé
console.log('\n═══════════════════════════════════════════════════');
console.log('RÉSUMÉ — Liaisons tabac créées');
console.log('═══════════════════════════════════════════════════');
console.log(`✅ Créées     : ${created}`);
console.log(`⏭️  Existantes : ${skipped}`);
console.log(`❌ Erreurs    : ${errors}`);
if (notFound.length > 0) {
  console.log(`⚠️  Non trouvées : ${notFound.join(', ')}`);
}

// Vérification finale
const [totals] = await db.execute(
  `SELECT p.name, COUNT(pm.plant_id) as nb_liaisons
   FROM plants p
   JOIN plant_molecules pm ON pm.plant_id = p.id
   WHERE p.id IN (7, 8, 150002, 150001, 330002)
   GROUP BY p.id, p.name ORDER BY p.name`
);

console.log('\n📊 Liaisons par variété tabac :');
for (const t of totals) {
  console.log(`   ${t.name}: ${t.nb_liaisons} liaisons`);
}

await db.end();
