import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Mapping des noms de molécules vers leurs IDs
const moleculeNameToId = {};

const allMolecules = await db.select().from(schema.molecules);
allMolecules.forEach(mol => {
  moleculeNameToId[mol.name.toLowerCase()] = mol.id;
});

console.log('✅ Molécules chargées:', Object.keys(moleculeNameToId).length);

function findMoleculeId(name) {
  const normalized = name.toLowerCase();
  const id = moleculeNameToId[normalized];
  if (!id) {
    console.warn(`⚠️  Molécule non trouvée: "${name}"`);
  }
  return id;
}

// Définition des 25 synergies
const synergies = [
  // Synergies intra-colombiennes (10)
  {
    molecule1: 'Baume de Tolú',
    molecule2: 'Vanilla Pompona',
    type: 'potentialisation',
    description: 'Amplification de la douceur balsamique vanillée. Les aldéhydes vanillés se combinent avec les esters balsamiques pour créer une profondeur gourmande complexe.',
    applications: 'Fonds de parfums, accords gourmands, notes réconfortantes'
  },
  {
    molecule1: 'Copal Colombien',
    molecule2: 'Palo Santo',
    type: 'potentialisation',
    description: 'Synergie résineuse sacrée fumée. Les diterpènes du copal renforcent les notes résineuses du palo santo, créant une fumée dense et méditative.',
    applications: 'Encens, rituels, parfums spirituels'
  },
  {
    molecule1: 'Café Geisha',
    molecule2: 'Fleur de Café',
    type: 'potentialisation',
    description: 'Amplification florale jasminée. Les alcaloïdes du café amplifient les esters floraux de la fleur, créant une ouverture jasminée intense.',
    applications: 'Notes de tête florales, accords café-floral'
  },
  {
    molecule1: 'Lulo',
    molecule2: 'Guanábana',
    type: 'transformation',
    description: 'Complexité acidulée tropicale multicouche. Les acides organiques se superposent pour créer une acidité vibrante et fruitée.',
    applications: 'Notes de tête tropicales, accords fruités complexes'
  },
  {
    molecule1: 'Cedro Rosado',
    molecule2: 'Nogal Colombien',
    type: 'potentialisation',
    description: 'Profondeur boisée tannique noble. Les sesquiterpènes du cèdre se combinent avec les quinones du noyer pour créer un boisé profond et tannique.',
    applications: 'Notes de cœur et fond boisées, accords nobles'
  },
  {
    molecule1: 'Lippia Origanoides',
    molecule2: 'Piper Aduncum',
    type: 'potentialisation',
    description: 'Herbacé médicinal piquant intense. Les phénols aromatiques amplifient les phénylpropanoïdes pour un effet médicinal puissant.',
    applications: 'Notes herbacées, accords médicinaux, résines CBD'
  },
  {
    molecule1: 'Borrachero',
    molecule2: 'Yagé',
    type: 'transformation',
    description: 'Narcotique chamanique visionnaire. Les alcaloïdes tropaniques interagissent avec les β-carbolines pour créer un profil psychoactif complexe. ⚠️ Précautions requises.',
    applications: 'Parfums rituels, usage cérémoniel (précautions requises)'
  },
  {
    molecule1: 'Coca Décocaïnisée',
    molecule2: 'Calycolpus Moritzianus',
    type: 'potentialisation',
    description: 'Fraîcheur mentholée andine intense. Les alcaloïdes de la coca amplifient l\'eucalyptol pour une fraîcheur vive et stimulante.',
    applications: 'Notes de tête fraîches, accords mentholés'
  },
  {
    molecule1: 'Turnera Diffusa',
    molecule2: 'Vanilla Pompona',
    type: 'transformation',
    description: 'Aphrodisiaque floral vanillé sensuel. Les glycosides se combinent avec les aldéhydes vanillés pour créer une douceur sensuelle et réconfortante.',
    applications: 'Parfums sensuels, accords aphrodisiaques'
  },
  {
    molecule1: 'Cacao Colombien',
    molecule2: 'Baume de Tolú',
    type: 'potentialisation',
    description: 'Gourmandise chocolat-caramel intense. Les alcaloïdes du cacao amplifient les notes caramel du baume pour une gourmandise profonde.',
    applications: 'Accords gourmands, fonds balsamiques'
  },
  
  // Synergies inter-gammes (15)
  {
    molecule1: 'Palo Santo',
    molecule2: 'GEOSMIN',
    type: 'transformation',
    description: 'Boisé terreux humide sacré. Les sesquiterpènes résineux du palo santo se mêlent aux notes terreuses du géosmin pour évoquer une forêt après la pluie.',
    applications: 'Parfums Pétrichor-Colombie, accords terre-bois'
  },
  {
    molecule1: 'Copal Colombien',
    molecule2: 'SULFUR DIOXIDE',
    type: 'transformation',
    description: 'Résine fumée minérale volcanique. Les diterpènes du copal interagissent avec les composés soufrés pour créer une fumée minérale intense.',
    applications: 'Encens volcaniques, parfums géothermiques'
  },
  {
    molecule1: 'Lulo',
    molecule2: 'Italian Bergamot Oil',
    type: 'potentialisation',
    description: 'Agrume acidulé complexe tropical-méditerranéen. Les acides organiques du lulo amplifient les monoterpènes de la bergamote pour une fraîcheur multicouche.',
    applications: 'Notes de tête agrumes, accords hespéridés'
  },
  {
    molecule1: 'Baume de Tolú',
    molecule2: 'Gris d\'Ambre',
    type: 'potentialisation',
    description: 'Balsamique marin profond. Les esters balsamiques du baume se combinent avec l\'ambreine pour créer une profondeur marine-vanillée.',
    applications: 'Fonds marins-balsamiques, accords ambrés'
  },
  {
    molecule1: 'Café Geisha',
    molecule2: 'JASMINE ABSOLUTE',
    type: 'potentialisation',
    description: 'Floral blanc jasminé intense. Les alcaloïdes du café amplifient les lactones du jasmin pour une floralité blanche puissante.',
    applications: 'Accords floraux blancs, notes de tête jasminées'
  },
  {
    molecule1: 'Cedro Rosado',
    molecule2: 'CEDARWOOD ATLAS',
    type: 'potentialisation',
    description: 'Boisé noble résineux multicouche. Les sesquiterpènes des deux cèdres se superposent pour une profondeur boisée noble.',
    applications: 'Notes de cœur boisées, accords nobles'
  },
  {
    molecule1: 'Vanilla Pompona',
    molecule2: 'VANILLA ABSOLUTE',
    type: 'transformation',
    description: 'Vanille tropicale-créole complexe. Les aldéhydes vanillés des deux vanilles créent une profondeur gourmande multicouche.',
    applications: 'Fonds vanillés, accords gourmands'
  },
  {
    molecule1: 'Borrachero',
    molecule2: 'DATURA STRAMONIUM',
    type: 'potentialisation',
    description: 'Floral narcotique tropanique intense. Les alcaloïdes tropaniques des deux plantes se renforcent mutuellement. ⚠️ Précautions requises.',
    applications: 'Parfums rituels, usage cérémoniel (précautions requises)'
  },
  {
    molecule1: 'Yagé',
    molecule2: 'TOBACCO ABSOLUTE',
    type: 'transformation',
    description: 'Boisé amer chamanique-tabac. Les β-carbolines du yagé interagissent avec les alcaloïdes du tabac pour un profil amer complexe.',
    applications: 'Accords tabac-bois, parfums masculins'
  },
  {
    molecule1: 'Guanábana',
    molecule2: 'FIG LEAF ABSOLUTE',
    type: 'transformation',
    description: 'Crémeux fruité lacté tropical-méditerranéen. Les esters lactés de la guanábana se combinent avec les notes vertes de la figue.',
    applications: 'Accords fruités crémeux, notes gourmandes'
  },
  {
    molecule1: 'Copaiba',
    molecule2: 'FRANKINCENSE',
    type: 'potentialisation',
    description: 'Baumier résineux sacré multicouche. Les sesquiterpènes du copaiba amplifient les monoterpènes de l\'encens pour une résine sacrée profonde.',
    applications: 'Encens, parfums spirituels'
  },
  {
    molecule1: 'Lippia Origanoides',
    molecule2: 'LAVENDER ABSOLUTE',
    type: 'stabilisation',
    description: 'Herbacé aromatique équilibré. Les phénols de la lippia stabilisent les esters de la lavande pour une fraîcheur durable.',
    applications: 'Notes herbacées, accords aromatiques'
  },
  {
    molecule1: 'Cacao Colombien',
    molecule2: 'PATCHOULI',
    type: 'potentialisation',
    description: 'Terreux chocolaté profond. Les alcaloïdes du cacao amplifient les sesquiterpènes du patchouli pour une profondeur terreuse.',
    applications: 'Fonds terreux, accords chocolat-terre'
  },
  {
    molecule1: 'Nogal Colombien',
    molecule2: 'VETIVER',
    type: 'potentialisation',
    description: 'Boisé racinaire tannique profond. Les quinones du noyer se combinent avec les sesquiterpènes du vétiver pour une profondeur racinaire.',
    applications: 'Fonds boisés, accords racinaires'
  },
  {
    molecule1: 'Uchuva',
    molecule2: 'YUZU',
    type: 'transformation',
    description: 'Agrume acidulé tropical-asiatique. Les acides organiques de l\'uchuva amplifient les monoterpènes du yuzu pour une acidité vibrante multiculturelle.',
    applications: 'Notes de tête agrumes, accords hespéridés'
  }
];

console.log('\n🚀 Début de l\'import des synergies...\n');

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;

for (const syn of synergies) {
  try {
    const mol1Id = findMoleculeId(syn.molecule1);
    const mol2Id = findMoleculeId(syn.molecule2);
    
    if (!mol1Id || !mol2Id) {
      console.log(`⏭️  Synergie ignorée: ${syn.molecule1} × ${syn.molecule2} (molécule(s) manquante(s))\n`);
      skippedCount++;
      continue;
    }
    
    console.log(`📝 Insertion: ${syn.molecule1} × ${syn.molecule2}`);
    
    await db.insert(schema.moleculeSynergies).values({
      molecule1Id: mol1Id,
      molecule2Id: mol2Id,
      type: syn.type,
      description: syn.description,
      applications: syn.applications,
      createdAt: new Date()
    });
    
    console.log(`   ✅ Synergie créée avec succès\n`);
    successCount++;
    
  } catch (error) {
    console.error(`   ❌ Erreur pour ${syn.molecule1} × ${syn.molecule2}:`, error.message);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE L\'IMPORT');
console.log('='.repeat(60));
console.log(`✅ Synergies importées avec succès: ${successCount}`);
console.log(`⏭️  Synergies ignorées (molécules manquantes): ${skippedCount}`);
console.log(`❌ Erreurs: ${errorCount}`);
console.log(`📦 Total: ${synergies.length} synergies`);
console.log('='.repeat(60) + '\n');

await connection.end();
