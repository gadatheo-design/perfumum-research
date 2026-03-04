/**
 * Correction de la confusion plantes/molécules
 * 
 * Stratégie :
 * 1. Entrées "huile essentielle / absolue / extrait" d'une plante connue
 *    → Vérifier si la plante existe dans plants, sinon créer la liaison
 *    → Marquer la molécule comme "source_type = 'plant_extract'" avec note
 * 
 * 2. Entrées "mélange / mixture" sans formule chimique
 *    → Ajouter un flag "is_mixture = true" (via notes ou chemicalFamily)
 *    → Garder dans molecules car utilisées dans les liaisons
 * 
 * 3. Entrées avec noms de plantes pures (Combava, Rose de Damas, etc.)
 *    → Vérifier si la plante existe dans plants
 *    → Si oui : créer la liaison plant_molecules et supprimer la molécule
 *    → Si non : créer la plante, créer la liaison, supprimer la molécule
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// CATÉGORIE 1 : Entrées qui sont clairement des plantes pures
// (pas des molécules, pas des extraits)
// ============================================================

// Ces entrées sont des plantes déguisées en molécules
// Elles ont été importées depuis des fichiers CSV de compositions
const plantMolecules = [
  // Noms commerciaux d'huiles essentielles entières
  { molId: 540002, plantName: 'Jasmin (Absolue)', latinName: 'Jasminum grandiflorum', category: 'Fleur', note: 'Absolue de jasmin — extrait commercial' },
  { molId: 540004, plantName: 'Cèdre de l\'Atlas (Huile)', latinName: 'Cedrus atlantica', category: 'Bois', note: 'Huile essentielle de cèdre de l\'Atlas' },
  { molId: 540006, plantName: 'Santal (Huile)', latinName: 'Santalum album', category: 'Bois', note: 'Huile essentielle de santal blanc' },
  { molId: 540007, plantName: 'Encens (Huile)', latinName: 'Boswellia sacra', category: 'Résine', note: 'Huile essentielle d\'encens (oliban)' },
  { molId: 180002, plantName: 'Bergamote d\'Italie (Huile)', latinName: 'Citrus bergamia', category: 'Agrume', note: 'Huile essentielle de bergamote italienne' },
  // Noms de plantes directement
  { molId: 720012, plantName: 'Valencène (Variété)', latinName: null, category: 'Agrume', note: 'Variété d\'agrume — à ne pas confondre avec la molécule valencène' },
];

// ============================================================
// CATÉGORIE 2 : Entrées "mélange" à marquer clairement
// ============================================================
const mixtures = [
  810048, // sesquiterpenes (resin mix)
  810049, // monoterpenes (resin mix)
  810059, // résines aromatiques
  810058, // résines
  810060, // terpenes
  810061, // traces aromatiques
  810062, // traces terpéniques
  810057, // profil résineux supposé
  810051, // aldehydes
  810052, // aldéhydes c10–c12
];

// ============================================================
// CATÉGORIE 3 : Entrées avec noms CSV bruts à nettoyer
// (noms qui commencent par "(", contiennent "→", "Ex:", etc.)
// ============================================================

// Récupérer les molécules avec noms CSV bruts
const [csvBruts] = await conn.execute(`
  SELECT id, name, formula, chemicalFamily
  FROM molecules
  WHERE (
    name LIKE '(%' OR 
    name LIKE 'Ex:%' OR 
    name LIKE 'Extraction%' OR
    name LIKE 'Distillation%' OR
    name LIKE 'Synthèse%' OR
    name LIKE '•%' OR
    name LIKE '%→%' OR
    name LIKE '%(ii)%' OR
    name LIKE '%(i)%'
  )
  AND (formula IS NULL OR formula = '' OR formula LIKE 'Mixture%' OR formula LIKE 'C%H%')
  ORDER BY id
  LIMIT 200
`);

console.log('Entrées CSV bruts à nettoyer:', csvBruts.length);

// ============================================================
// EXÉCUTION
// ============================================================

let fixed = 0;
let marked = 0;
let cleaned = 0;

// 1. Marquer les mélanges
for (const id of mixtures) {
  const [rows] = await conn.execute('SELECT id, name, chemicalFamily FROM molecules WHERE id = ?', [id]);
  if (rows[0]) {
    const currentFamily = rows[0].chemicalFamily || '';
    if (!currentFamily.includes('[MÉLANGE]')) {
      await conn.execute(
        'UPDATE molecules SET chemicalFamily = ? WHERE id = ?',
        ['[MÉLANGE] ' + currentFamily, id]
      );
      console.log('✓ Marqué mélange:', rows[0].name);
      marked++;
    }
  }
}

// 2. Nettoyer les noms CSV bruts
// Extraire le "vrai nom" depuis les noms CSV complexes
for (const mol of csvBruts.slice(0, 100)) {
  let cleanName = mol.name;
  
  // Extraire le nom entre parenthèses si format "(nom): description"
  const matchParen = mol.name.match(/^\(([^)]+)\)/);
  if (matchParen) {
    // Garder le nom complet mais ajouter un flag
    cleanName = mol.name; // Garder tel quel pour l'instant
  }
  
  // Si le nom contient "→" c'est une description de transformation, pas un nom
  if (mol.name.includes('→') && !mol.formula) {
    // Ces entrées sont des descriptions de processus, pas des molécules
    // Les marquer comme "à réviser"
    await conn.execute(
      'UPDATE molecules SET notes = CONCAT(IFNULL(notes, ""), " [À RÉVISER: nom CSV brut]") WHERE id = ? AND (notes IS NULL OR notes NOT LIKE "%À RÉVISER%")',
      [mol.id]
    );
    cleaned++;
  }
}

// 3. Vérifier le Combava spécifiquement
const [combava] = await conn.execute(
  'SELECT id, name, formula, chemicalFamily FROM molecules WHERE LOWER(name) LIKE "%combava%" LIMIT 5'
);
console.log('\nRecherche Combava dans molecules:');
combava.forEach(m => console.log(`  [${m.id}] ${m.name} | formule: ${m.formula || 'VIDE'} | famille: ${m.chemicalFamily || 'VIDE'}`));

const [combavaPlant] = await conn.execute(
  'SELECT id, name, latin_name FROM plants WHERE LOWER(name) LIKE "%combava%" OR LOWER(latin_name) LIKE "%hystrix%" LIMIT 5'
);
console.log('Recherche Combava dans plants:');
combavaPlant.forEach(p => console.log(`  [${p.id}] ${p.name} | latin: ${p.latin_name || 'VIDE'}`));

// 4. Chercher les noms de plantes pures dans molecules
const plantNamePatterns = [
  'Rose de Damas', 'Rosa damascena', 'Jasmine absolute', 'Jasmin absolu',
  'Neroli Bouquetier', 'Tubéreuse Absolue', 'Tangerine Dream',
  'Italian Bergamot', 'Bergamot Oil', 'Lavender Oil', 'Patchouli Oil',
  'Vetiver Oil', 'Sandalwood Oil', 'Cedarwood Oil', 'Frankincense Oil',
  'Ylang Ylang Oil', 'Rose Otto', 'Rose Absolute',
];

console.log('\n=== MOLÉCULES QUI SONT EN FAIT DES PLANTES ===');
for (const pattern of plantNamePatterns) {
  const [rows] = await conn.execute(
    'SELECT id, name, formula, chemicalFamily FROM molecules WHERE LOWER(name) LIKE ? LIMIT 3',
    ['%' + pattern.toLowerCase() + '%']
  );
  for (const r of rows) {
    // Vérifier si une plante correspondante existe
    const [plant] = await conn.execute(
      'SELECT id, name FROM plants WHERE LOWER(name) LIKE ? LIMIT 1',
      ['%' + pattern.toLowerCase().split(' ')[0] + '%']
    );
    console.log(`  MOL[${r.id}] "${r.name}" → PLANTE: ${plant[0] ? '['+plant[0].id+'] '+plant[0].name : 'ABSENTE'}`);
  }
}

// 5. Statistiques finales
const [molTotal] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [molMixture] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily LIKE "[MÉLANGE]%"');
const [molNoFormula] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE formula IS NULL OR formula = ""');

console.log('\n=== RÉSULTAT CORRECTION ===');
console.log('Mélanges marqués:', marked);
console.log('Entrées CSV bruts flaggées:', cleaned);
console.log('Total molécules:', molTotal[0].n);
console.log('Molécules marquées [MÉLANGE]:', molMixture[0].n);
console.log('Molécules sans formule:', molNoFormula[0].n);

await conn.end();
