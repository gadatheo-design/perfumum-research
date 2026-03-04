/**
 * Ajouter les molécules tabac manquantes identifiées dans le guideline officiel PERFUMUM
 * Source : Enrichissementdonnées309dbb3d5e6c800eb11fe3e2ab44f781.md
 * Table de synthèse : Molécule → Famille → Odeur → Rôle → Source
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

const tobaccoMolecules = [
  {
    name: 'Megastigmatrienone',
    casNumber: '38818-55-2',
    family: 'Norisoprénoïdes',
    olfactiveFamily: 'Boisé-fumé',
    olfactiveProfile: 'Sucré-fumé, floral, boisé, vieux tabac riche',
    description: 'Composé dominant parmi les plus importants dans l\'arôme tabac ; présent dans feuilles fermentées/âgées et huiles essentielles',
    therapeuticProperties: null,
    source: 'PMC:8306096',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,fermentation,vieillissement'
  },
  {
    name: 'β-Damascenone',
    casNumber: '23726-93-4',
    family: 'Norisoprénoïdes',
    olfactiveFamily: 'Fruité-floral',
    olfactiveProfile: 'Fruité-floral, pomme, prune, raisin, rose, thé',
    description: 'Très puissant olfactivement ; contribue au caractère fruité-tabac. Seuil de détection extrêmement bas.',
    therapeuticProperties: null,
    source: 'PMC:6804150',
    evidenceLevel: 'Confirmé GC-O',
    context: 'tabac,vin,fruits,fermentation'
  },
  {
    name: 'α-Ionone',
    casNumber: '127-41-3',
    family: 'Norisoprénoïdes',
    olfactiveFamily: 'Boisé-floral',
    olfactiveProfile: 'Boisé-balsamique, nuance violet-fruité',
    description: 'Isomère de la β-ionone ; colore le profil aromatique tabac avec des nuances boisées-balsamiques',
    therapeuticProperties: null,
    source: 'leffingwell.com',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,parfumerie,arômes'
  },
  {
    name: 'β-Damascone',
    casNumber: '23726-91-2',
    family: 'Norisoprénoïdes',
    olfactiveFamily: 'Floral-fruité',
    olfactiveProfile: 'Floral, fruité, légèrement mentholé, rose, fruit',
    description: 'Arôme actif ; apporte nuances de rose/fruit dans le profil tabac',
    therapeuticProperties: null,
    source: 'leffingwell.com',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,parfumerie,roses'
  },
  {
    name: 'Solanone',
    casNumber: '1937-54-8',
    family: 'Cétones dérivées',
    olfactiveFamily: 'Floral-fruité',
    olfactiveProfile: 'Floral sucré, légèrement fruité, tabac',
    description: 'Présente dans certaines huiles essentielles de tabac ; influence le profil aromatique global',
    therapeuticProperties: null,
    source: 'PMC:8306096',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,huiles essentielles'
  },
  {
    name: 'Neophytadiene',
    casNumber: '504-96-1',
    family: 'Terpènes dérivés',
    olfactiveFamily: 'Vert-boisé',
    olfactiveProfile: 'Aromatique vert-boisé, légèrement herbacé',
    description: 'Trouvé en grande quantité dans certaines variétés de tabac, notamment les feuilles de cigare',
    therapeuticProperties: null,
    source: 'PMC:8306096',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,cigare,feuilles'
  },
  {
    name: 'Benzeneacetaldehyde',
    casNumber: '122-78-1',
    family: 'Aldéhydes aromatiques',
    olfactiveFamily: 'Floral-doux',
    olfactiveProfile: 'Doux, floral-léger, miel, hyacinthe',
    description: 'Marqueur parmi les composés aromatiques associés à la douceur (sweetness) dans le tabac',
    therapeuticProperties: null,
    source: 'ScienceDirect:S0926669025007824',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,arômes,douceur'
  },
  {
    name: 'Farnesylacetone',
    casNumber: '1937-62-8',
    family: 'Sesquiterpènes',
    olfactiveFamily: 'Épicé-boisé',
    olfactiveProfile: 'Épicé, boisé, légèrement floral',
    description: 'Peut contribuer à l\'identification de grades aromatiques dans le tabac',
    therapeuticProperties: null,
    source: 'ScienceDirect:S0926669025007824',
    evidenceLevel: 'Indiqué',
    context: 'tabac,grades aromatiques'
  },
  {
    name: '2-Acétylpyrazine',
    casNumber: '22047-25-2',
    family: 'Pyrazines',
    olfactiveFamily: 'Grillé-noisette',
    olfactiveProfile: 'Noisette, grillé, popcorn, pain grillé',
    description: 'Générée dans les réactions de Maillard lors de la fermentation et combustion ; ajoute richesse olfactive',
    therapeuticProperties: null,
    source: 'MDPI:1420-3049/25/7/1734',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,Maillard,fermentation,combustion'
  },
  {
    name: '2-Méthoxypyrazine',
    casNumber: '3149-28-8',
    family: 'Pyrazines',
    olfactiveFamily: 'Végétal-grillé',
    olfactiveProfile: 'Végétal, poivron vert, noisette, terreux',
    description: 'Pyrazine présente dans le tabac Burley ; contribue aux notes grillées-végétales',
    therapeuticProperties: null,
    source: 'MDPI:1420-3049/25/7/1734',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,Burley,Maillard'
  },
  {
    name: '5-Méthylfurfural',
    casNumber: '620-02-0',
    family: 'Furanones',
    olfactiveFamily: 'Caramel-doux',
    olfactiveProfile: 'Caramel, cuisson douce, amande, sucré',
    description: 'Représente les aspects sucrés/chauds dans le spectre aromatique du tabac ; produit de caramélisation',
    therapeuticProperties: null,
    source: 'MDPI:1420-3049/25/7/1734',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,caramélisation,Maillard'
  },
  {
    name: 'β-Cyclocitral',
    casNumber: '432-25-7',
    family: 'Norisoprénoïdes',
    olfactiveFamily: 'Fruité-doux',
    olfactiveProfile: 'Honey-sweet, fruité, légèrement boisé',
    description: 'Dérivé des caroténoïdes ; typique du tabac Virginia flue-cured',
    therapeuticProperties: null,
    source: 'PMC:8306096',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,Virginia,flue-cured,caroténoïdes'
  },
  {
    name: '1-Nonanal',
    casNumber: '124-19-6',
    family: 'Aldéhydes aliphatiques',
    olfactiveFamily: 'Doux-miellé',
    olfactiveProfile: 'Douceur miellée, floral, légèrement gras',
    description: 'Aldéhyde aliphatique typique du tabac Virginia flue-cured ; contribue à la douceur du profil',
    therapeuticProperties: null,
    source: 'PMC:8306096',
    evidenceLevel: 'Confirmé GC-MS',
    context: 'tabac,Virginia,flue-cured'
  }
];

let created = 0;
let skipped = 0;
let errors = 0;

for (const mol of tobaccoMolecules) {
  try {
    // Vérifier si la molécule existe déjà
    const [existing] = await db.execute(
      'SELECT id, name FROM molecules WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))',
      [mol.name]
    );

    if (existing.length > 0) {
      console.log(`⏭️  Existe déjà : ${mol.name} (id: ${existing[0].id})`);
      skipped++;
      continue;
    }

    // Insérer la nouvelle molécule
    const [result] = await db.execute(
      `INSERT INTO molecules 
        (name, cas_number, family, chemicalFamily, olfactiveProfile, notes, 
         therapeuticProperties, sourceOrigin, status, botanicalSources, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        mol.name,
        mol.casNumber,
        mol.family,
        mol.family,
        mol.olfactiveProfile,
        mol.description,
        mol.therapeuticProperties,
        mol.source,
        'validated',
        mol.context
      ]
    );

    console.log(`✅ Créée : ${mol.name} (id: ${result.insertId}) — famille: ${mol.family}`);
    created++;
  } catch (err) {
    console.error(`❌ Erreur pour ${mol.name}: ${err.message}`);
    errors++;
  }
}

// Résumé
console.log('\n═══════════════════════════════════════');
console.log('RÉSUMÉ — Molécules tabac ajoutées');
console.log('═══════════════════════════════════════');
console.log(`✅ Créées   : ${created}`);
console.log(`⏭️  Existantes: ${skipped}`);
console.log(`❌ Erreurs  : ${errors}`);
console.log(`📊 Total    : ${tobaccoMolecules.length}`);

// Vérifier les familles maintenant
const [families] = await db.execute(
  `SELECT family, COUNT(*) as count 
   FROM molecules 
   WHERE family IN ('Norisoprénoïdes', 'Pyrazines', 'Furanones', 'Aldéhydes aromatiques', 'Cétones dérivées', 'Sesquiterpènes', 'Terpènes dérivés')
   GROUP BY family ORDER BY count DESC`
);

console.log('\n📊 Familles tabac après enrichissement :');
for (const f of families) {
  console.log(`   ${f.family}: ${f.count} molécules`);
}

await db.end();
