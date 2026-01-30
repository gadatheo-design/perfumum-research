import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🔬 Liaison des molécules aux méthodes analytiques...\n');

// Récupérer les méthodes analytiques
const [methods] = await connection.execute('SELECT id, code, name FROM analytical_methods');
console.log(`📊 ${methods.length} méthodes analytiques trouvées\n`);

const methodMap = {};
methods.forEach(m => {
  methodMap[m.code] = m.id;
});

// Définir les liaisons typiques molécule -> méthodes
// Basé sur les techniques couramment utilisées pour chaque type de molécule
const moleculeMethodLinks = [
  // Terpènes - GC-MS est la méthode de référence
  { moleculePattern: '%limonene%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%pinene%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%linalol%', methods: ['GC-MS', 'GC-FID', 'GC-O'], isPrimary: 'GC-MS' },
  { moleculePattern: '%geraniol%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%citral%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%cineole%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%eucalyptol%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%menthol%', methods: ['GC-MS', 'GC-FID', 'GC-O'], isPrimary: 'GC-MS' },
  { moleculePattern: '%camphor%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%thymol%', methods: ['GC-MS', 'HPLC'], isPrimary: 'GC-MS' },
  { moleculePattern: '%carvacrol%', methods: ['GC-MS', 'HPLC'], isPrimary: 'GC-MS' },
  
  // Sesquiterpènes
  { moleculePattern: '%caryophyllene%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%farnesene%', methods: ['GC-MS'], isPrimary: 'GC-MS' },
  { moleculePattern: '%bisabolol%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%santalol%', methods: ['GC-MS', 'GC-O'], isPrimary: 'GC-MS' },
  { moleculePattern: '%vetiver%', methods: ['GC-MS', 'GC-O'], isPrimary: 'GC-MS' },
  { moleculePattern: '%patchoul%', methods: ['GC-MS', 'GC-O'], isPrimary: 'GC-MS' },
  
  // Aldéhydes
  { moleculePattern: '%aldehyde%', methods: ['GC-MS', 'GC-FID', 'IR'], isPrimary: 'GC-MS' },
  { moleculePattern: '%citronellal%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%neral%', methods: ['GC-MS'], isPrimary: 'GC-MS' },
  { moleculePattern: '%geranial%', methods: ['GC-MS'], isPrimary: 'GC-MS' },
  
  // Esters
  { moleculePattern: '%acetate%', methods: ['GC-MS', 'GC-FID', 'IR'], isPrimary: 'GC-MS' },
  { moleculePattern: '%benzoate%', methods: ['GC-MS', 'HPLC'], isPrimary: 'GC-MS' },
  
  // Phénols et dérivés
  { moleculePattern: '%eugenol%', methods: ['GC-MS', 'HPLC', 'GC-O'], isPrimary: 'GC-MS' },
  { moleculePattern: '%vanillin%', methods: ['HPLC', 'GC-MS', 'GC-O'], isPrimary: 'HPLC' },
  { moleculePattern: '%coumarin%', methods: ['HPLC', 'GC-MS'], isPrimary: 'HPLC' },
  
  // Composés volatils - PTR-MS pour analyse en temps réel
  { moleculePattern: '%volatile%', methods: ['PTR-MS', 'GC-MS', 'HS-GC'], isPrimary: 'PTR-MS' },
  
  // Composés soufrés
  { moleculePattern: '%sulfur%', methods: ['GC-MS', 'GC-FID'], isPrimary: 'GC-MS' },
  { moleculePattern: '%thio%', methods: ['GC-MS'], isPrimary: 'GC-MS' },
  
  // Muscs et composés macrocycliques
  { moleculePattern: '%musk%', methods: ['GC-MS', 'GC-O', 'NMR'], isPrimary: 'GC-MS' },
  { moleculePattern: '%muscone%', methods: ['GC-MS', 'NMR'], isPrimary: 'GC-MS' },
  
  // Indoles
  { moleculePattern: '%indole%', methods: ['GC-MS', 'HPLC', 'GC-O'], isPrimary: 'GC-MS' },
  { moleculePattern: '%skatole%', methods: ['GC-MS', 'GC-O'], isPrimary: 'GC-MS' },
];

let totalCreated = 0;
let totalSkipped = 0;

for (const link of moleculeMethodLinks) {
  // Trouver les molécules correspondantes
  const [molecules] = await connection.execute(
    `SELECT id, name FROM molecules WHERE LOWER(name) LIKE LOWER(?) OR LOWER(iupac_name) LIKE LOWER(?)`,
    [link.moleculePattern, link.moleculePattern]
  );
  
  for (const molecule of molecules) {
    for (const methodCode of link.methods) {
      const methodId = methodMap[methodCode];
      if (!methodId) continue;
      
      const isPrimary = methodCode === link.isPrimary;
      
      try {
        await connection.execute(
          `INSERT INTO molecule_analytical_methods (molecule_id, method_id, is_primary, notes)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary)`,
          [molecule.id, methodId, isPrimary, `Méthode standard pour ${molecule.name}`]
        );
        totalCreated++;
      } catch (err) {
        totalSkipped++;
      }
    }
  }
}

// Ajouter GC-MS comme méthode par défaut pour toutes les molécules sans liaison
const gcmsId = methodMap['GC-MS'];
if (gcmsId) {
  const [unlinkedMolecules] = await connection.execute(`
    SELECT m.id, m.name FROM molecules m
    LEFT JOIN molecule_analytical_methods mam ON m.id = mam.molecule_id
    WHERE mam.id IS NULL
    LIMIT 500
  `);
  
  console.log(`\n📌 ${unlinkedMolecules.length} molécules sans méthode analytique - ajout de GC-MS par défaut...`);
  
  for (const mol of unlinkedMolecules) {
    try {
      await connection.execute(
        `INSERT INTO molecule_analytical_methods (molecule_id, method_id, is_primary, notes)
         VALUES (?, ?, true, 'Méthode standard GC-MS')`,
        [mol.id, gcmsId]
      );
      totalCreated++;
    } catch (err) {
      // Ignore duplicates
    }
  }
}

// Statistiques finales
const [stats] = await connection.execute(`
  SELECT 
    COUNT(DISTINCT molecule_id) as molecules_linked,
    COUNT(*) as total_links,
    COUNT(DISTINCT method_id) as methods_used
  FROM molecule_analytical_methods
`);

console.log('\n✅ Liaison terminée!');
console.log(`   📊 ${stats[0].molecules_linked} molécules liées`);
console.log(`   🔗 ${stats[0].total_links} liaisons créées`);
console.log(`   🔬 ${stats[0].methods_used} méthodes utilisées`);

await connection.end();
