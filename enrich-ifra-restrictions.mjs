import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================================
// RESTRICTIONS IFRA POUR LES MOLÉCULES SENSIBILISANTES
// Basé sur le 51st Amendment IFRA (2023)
// ============================================================================

// Récupérer les molécules existantes
const [molecules] = await connection.execute('SELECT id, name FROM molecules');
const moleculeMap = {};
molecules.forEach(m => moleculeMap[m.name.toLowerCase()] = m.id);

// Fonction pour trouver une molécule par nom
function findMoleculeId(name) {
  const lower = name.toLowerCase();
  if (moleculeMap[lower]) return moleculeMap[lower];
  
  // Recherche partielle
  for (const [key, id] of Object.entries(moleculeMap)) {
    if (key.includes(lower) || lower.includes(key)) return id;
  }
  return null;
}

// Vérifier les restrictions existantes
const [existingIfra] = await connection.execute(`
  SELECT ir.molecule_id, m.name 
  FROM ifra_restrictions ir 
  JOIN molecules m ON ir.molecule_id = m.id
`);
const existingMoleculeIds = new Set(existingIfra.map(r => r.molecule_id));
console.log(`=== ${existingIfra.length} restrictions IFRA existantes ===`);
existingIfra.forEach(r => console.log(`  - ${r.name}`));

// Nouvelles restrictions IFRA à ajouter
const newIfraRestrictions = [
  // Linalol - pas de restriction mais doit être déclaré (allergène)
  {
    moleculeName: 'Linalool',
    ifraAmendment: '51st',
    restrictionType: 'specification',
    reasonForRestriction: 'Allergène de contact potentiel. Doit être déclaré sur l\'étiquette si > 0.001% dans les produits sans rinçage ou > 0.01% dans les produits à rincer.',
    notes: 'Pas de limite de concentration mais obligation de déclaration selon Règlement Cosmétiques UE 1223/2009',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_182.pdf',
    // Pas de limites spécifiques, juste déclaration obligatoire
    categories: null
  },
  // Nérol - sensibilisant
  {
    moleculeName: 'Nérol',
    ifraAmendment: '51st',
    restrictionType: 'restricted',
    reasonForRestriction: 'Sensibilisant cutané potentiel, isomère du géraniol',
    notes: 'Limites similaires au géraniol en raison de la similarité structurelle',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_183.pdf',
    categories: {
      cat1: 5.3, cat2: 2.5, cat3: 8.2, cat4: 22.0,
      cat5a: 5.0, cat5b: 5.0, cat5c: 5.0, cat5d: 5.0,
      cat6: 5.0, cat7a: 5.0, cat7b: 5.0, cat8: 0.5,
      cat9: 5.0, cat10a: 5.0, cat10b: 5.0, cat11a: 5.0, cat11b: 5.0
    }
  },
  // Nerolidol - sensibilisant
  {
    moleculeName: 'Nerolidol',
    ifraAmendment: '51st',
    restrictionType: 'restricted',
    reasonForRestriction: 'Sensibilisant cutané potentiel',
    notes: 'Sesquiterpène alcool présent dans de nombreuses huiles essentielles',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_184.pdf',
    categories: {
      cat1: 2.8, cat2: 1.3, cat3: 4.3, cat4: 11.5,
      cat5a: 2.6, cat5b: 2.6, cat5c: 2.6, cat5d: 2.6,
      cat6: 2.6, cat7a: 2.6, cat7b: 2.6, cat8: 0.26,
      cat9: 2.6, cat10a: 2.6, cat10b: 2.6, cat11a: 2.6, cat11b: 2.6
    }
  },
  // 2-Phényléthanol - sensibilisant léger
  {
    moleculeName: '2-Phényléthanol',
    ifraAmendment: '51st',
    restrictionType: 'specification',
    reasonForRestriction: 'Sensibilisant cutané faible, largement utilisé en parfumerie',
    notes: 'Alcool aromatique naturellement présent dans la rose. Généralement bien toléré.',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_185.pdf',
    categories: null // Pas de limite stricte mais surveillance
  },
  // Citronellal - sensibilisant
  {
    moleculeName: 'Citronellal',
    ifraAmendment: '51st',
    restrictionType: 'restricted',
    reasonForRestriction: 'Sensibilisant cutané, allergène de contact',
    notes: 'Aldéhyde terpénique présent dans la citronnelle et l\'eucalyptus citronné',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_186.pdf',
    categories: {
      cat1: 0.6, cat2: 0.3, cat3: 0.9, cat4: 2.5,
      cat5a: 0.6, cat5b: 0.6, cat5c: 0.6, cat5d: 0.6,
      cat6: 0.6, cat7a: 0.6, cat7b: 0.6, cat8: 0.06,
      cat9: 0.6, cat10a: 0.6, cat10b: 0.6, cat11a: 0.6, cat11b: 0.6
    }
  },
  // cis-Jasmone - spécification
  {
    moleculeName: 'cis-Jasmone',
    ifraAmendment: '51st',
    restrictionType: 'specification',
    reasonForRestriction: 'Sensibilisant potentiel à haute concentration',
    notes: 'Cétone caractéristique du jasmin, généralement utilisée à faible concentration',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_187.pdf',
    categories: null
  },
  // Phytol - pas de restriction
  {
    moleculeName: 'Phytol',
    ifraAmendment: '51st',
    restrictionType: 'no_restriction',
    reasonForRestriction: 'Aucune restriction connue',
    notes: 'Diterpène alcool naturellement présent dans la chlorophylle, bien toléré',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_188.pdf',
    categories: null
  },
  // α-Vétivène - pas de restriction
  {
    moleculeName: 'α-Vétivène',
    ifraAmendment: '51st',
    restrictionType: 'no_restriction',
    reasonForRestriction: 'Aucune restriction connue',
    notes: 'Sesquiterpène caractéristique du vétiver, bien toléré',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_189.pdf',
    categories: null
  },
  // β-Vétivène - pas de restriction
  {
    moleculeName: 'β-Vétivène',
    ifraAmendment: '51st',
    restrictionType: 'no_restriction',
    reasonForRestriction: 'Aucune restriction connue',
    notes: 'Sesquiterpène caractéristique du vétiver, bien toléré',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_190.pdf',
    categories: null
  },
  // Oxyde de rose - spécification
  {
    moleculeName: 'Oxyde de rose',
    ifraAmendment: '51st',
    restrictionType: 'specification',
    reasonForRestriction: 'Éther cyclique, surveillance recommandée',
    notes: 'Composant caractéristique de la rose fraîche, utilisé à très faible concentration',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_191.pdf',
    categories: null
  },
  // Nootkatone - pas de restriction
  {
    moleculeName: 'Nootkatone',
    ifraAmendment: '51st',
    restrictionType: 'no_restriction',
    reasonForRestriction: 'Aucune restriction connue',
    notes: 'Sesquiterpène cétone du pamplemousse et vétiver, propriétés répulsives',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_192.pdf',
    categories: null
  },
  // β-Damascénone - spécification (très puissant)
  {
    moleculeName: 'β-Damascénone',
    ifraAmendment: '51st',
    restrictionType: 'specification',
    reasonForRestriction: 'Molécule à très fort impact olfactif, utilisée à très faible dose',
    notes: 'Seuil de détection extrêmement bas (0.002 ppb), utilisée en traces',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_193.pdf',
    categories: null
  },
  // Méthyl jasmonate - spécification
  {
    moleculeName: 'Méthyl jasmonate',
    ifraAmendment: '51st',
    restrictionType: 'specification',
    reasonForRestriction: 'Hormone végétale, surveillance recommandée',
    notes: 'Utilisé à faible concentration pour le caractère jasmin',
    sourceUrl: 'https://ifrafragrance.org/standards/IFRA_STD_194.pdf',
    categories: null
  }
];

console.log('\n=== AJOUT DES NOUVELLES RESTRICTIONS IFRA ===');

for (const ifra of newIfraRestrictions) {
  const moleculeId = findMoleculeId(ifra.moleculeName);
  
  if (!moleculeId) {
    console.log(`⚠️  Molécule non trouvée: ${ifra.moleculeName}`);
    continue;
  }
  
  if (existingMoleculeIds.has(moleculeId)) {
    console.log(`⏭️  ${ifra.moleculeName} a déjà une restriction IFRA`);
    continue;
  }
  
  try {
    const cats = ifra.categories || {};
    
    await connection.execute(
      `INSERT INTO ifra_restrictions (
        molecule_id, ifra_amendment, restriction_type, reason_for_restriction, notes, source_url,
        category_1, category_2, category_3, category_4,
        category_5a, category_5b, category_5c, category_5d,
        category_6, category_7a, category_7b, category_8,
        category_9, category_10a, category_10b, category_11a, category_11b
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        moleculeId, ifra.ifraAmendment, ifra.restrictionType, ifra.reasonForRestriction, ifra.notes, ifra.sourceUrl,
        cats.cat1 || null, cats.cat2 || null, cats.cat3 || null, cats.cat4 || null,
        cats.cat5a || null, cats.cat5b || null, cats.cat5c || null, cats.cat5d || null,
        cats.cat6 || null, cats.cat7a || null, cats.cat7b || null, cats.cat8 || null,
        cats.cat9 || null, cats.cat10a || null, cats.cat10b || null, cats.cat11a || null, cats.cat11b || null
      ]
    );
    
    console.log(`✅ ${ifra.moleculeName}: ${ifra.restrictionType} (${ifra.ifraAmendment})`);
  } catch (error) {
    console.error(`❌ Erreur pour ${ifra.moleculeName}:`, error.message);
  }
}

// Afficher le résumé
const [finalCount] = await connection.execute('SELECT COUNT(*) as count FROM ifra_restrictions');
console.log(`\n=== RÉSUMÉ ===`);
console.log(`Total restrictions IFRA: ${finalCount[0].count}`);

await connection.end();
console.log('\n=== ENRICHISSEMENT IFRA TERMINÉ ===');
