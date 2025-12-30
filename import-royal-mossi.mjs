import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const royalMossiMolecules = [
  // FAMILLE 1: Sesquiterpènes racinaires
  {
    name: 'Vétivénol',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H26O',
    olfactiveProfile: 'racine, terre, humidité sèche',
    emotionalResonance: 'ancrage, méditation',
    functionalEffect: 'longue tenue, effet spirituel',
    sourceOrigin: 'Vétiver',
    notes: 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires',
    texture: 'sec'
  },
  {
    name: 'Vétivone',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H22O',
    olfactiveProfile: 'racine sombre, terre humide',
    emotionalResonance: 'profondeur, ancrage',
    functionalEffect: 'longue tenue, effet méditatif',
    sourceOrigin: 'Vétiver',
    notes: 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires',
    texture: 'sec'
  },
  {
    name: 'Khusimol',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H26O',
    olfactiveProfile: 'boisé, racinaire, velouté',
    emotionalResonance: 'ancrage, stabilité',
    functionalEffect: 'fixateur, longue tenue',
    sourceOrigin: 'Vétiver',
    notes: 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires',
    texture: 'sec'
  },
  {
    name: 'β-guaïène',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H24',
    olfactiveProfile: 'boisé, épicé, terreux',
    emotionalResonance: 'chaleur, profondeur',
    functionalEffect: 'note de cœur',
    sourceOrigin: 'Bois de gaïac',
    notes: 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires',
    texture: 'sec'
  },
  {
    name: 'α-humulène',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H24',
    olfactiveProfile: 'houblon, boisé, terreux',
    emotionalResonance: 'relaxation, ancrage',
    functionalEffect: 'anti-inflammatoire',
    sourceOrigin: 'Houblon, Cannabis',
    notes: 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires',
    texture: 'sec'
  },
  
  // FAMILLE 2: Phénols & fumées sèches
  {
    name: '4-methyl-guaiacol',
    family: 'Phénol',
    chemicalFormula: 'C8H10O2',
    olfactiveProfile: 'fumée douce, vanillé fumé',
    emotionalResonance: 'chaleur, rituel',
    functionalEffect: 'fumée douce, tambours brûlés',
    sourceOrigin: 'Pyrolyse bois',
    notes: 'Molécule-clé Royal Mossi - Famille 2: Phénols & fumées sèches',
    texture: 'sec'
  },
  {
    name: 'Phénol boisé',
    family: 'Phénol',
    chemicalFormula: 'C6H6O',
    olfactiveProfile: 'fumée, bois brûlé, médicinal',
    emotionalResonance: 'rituel, feu',
    functionalEffect: 'fumée sombre',
    sourceOrigin: 'Pyrolyse',
    notes: 'Molécule-clé Royal Mossi - Famille 2: Phénols & fumées sèches',
    texture: 'sec'
  },
  
  // FAMILLE 3: Aldéhydes secs
  {
    name: 'Aldéhyde C-10',
    family: 'Aldéhyde',
    chemicalFormula: 'C10H20O',
    olfactiveProfile: 'métallique, poussière chaude',
    emotionalResonance: 'feu du Sahel, électricité',
    functionalEffect: 'poussière ferrique chauffée',
    sourceOrigin: 'Synthèse',
    notes: 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs',
    texture: 'sec'
  },
  {
    name: 'Aldéhyde C-11',
    family: 'Aldéhyde',
    chemicalFormula: 'C11H22O',
    olfactiveProfile: 'aldéhydique, poudré, chaud',
    emotionalResonance: 'vent chaud, saison sèche',
    functionalEffect: 'poussière minérale',
    sourceOrigin: 'Synthèse',
    notes: 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs',
    texture: 'sec'
  },
  {
    name: 'Aldéhyde C-12',
    family: 'Aldéhyde',
    chemicalFormula: 'C12H24O',
    olfactiveProfile: 'aldéhydique, métallique, sec',
    emotionalResonance: 'chaleur, électricité',
    functionalEffect: 'effet Sahel',
    sourceOrigin: 'Synthèse',
    notes: 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs',
    texture: 'sec'
  },
  {
    name: 'Aldéhyde métallique',
    family: 'Aldéhyde',
    chemicalFormula: 'Complex',
    olfactiveProfile: 'métallique, froid, minéral',
    emotionalResonance: 'électricité, orage sec',
    functionalEffect: 'poussière ferrique',
    sourceOrigin: 'Synthèse',
    notes: 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs',
    texture: 'sec'
  },
  
  // FAMILLE 4: Résines orientales (Mandé)
  {
    name: 'Furanosesquiterpenes',
    family: 'Résinoïde',
    chemicalFormula: 'C15H20O',
    olfactiveProfile: 'résine, épicé, balsamique',
    emotionalResonance: 'noblesse, purification',
    functionalEffect: 'note sacrée ancestrale',
    sourceOrigin: 'Myrrhe, Oliban',
    notes: 'Molécule-clé Royal Mossi - Famille 4: Résines orientales',
    texture: 'résine'
  },
  {
    name: 'Furanoeudesmanes',
    family: 'Résinoïde',
    chemicalFormula: 'C15H22O',
    olfactiveProfile: 'résine, boisé, balsamique',
    emotionalResonance: 'rituel, sacré',
    functionalEffect: 'purification rituelle',
    sourceOrigin: 'Myrrhe',
    notes: 'Molécule-clé Royal Mossi - Famille 4: Résines orientales',
    texture: 'résine'
  },
  {
    name: 'Incensol',
    family: 'Résinoïde',
    chemicalFormula: 'C20H34O',
    olfactiveProfile: 'encens, résine, balsamique',
    emotionalResonance: 'élévation, spiritualité',
    functionalEffect: 'psychoactif léger, anxiolytique',
    sourceOrigin: 'Oliban',
    notes: 'Molécule-clé Royal Mossi - Famille 4: Résines orientales',
    texture: 'résine'
  },
  {
    name: 'Incensol acetate',
    family: 'Résinoïde',
    chemicalFormula: 'C22H36O2',
    olfactiveProfile: 'encens, résine douce',
    emotionalResonance: 'élévation, clarté',
    functionalEffect: 'psychoactif, anti-dépresseur',
    sourceOrigin: 'Oliban',
    notes: 'Molécule-clé Royal Mossi - Famille 4: Résines orientales',
    texture: 'résine'
  },
  {
    name: 'Mechoulim',
    family: 'Résinoïde',
    chemicalFormula: 'Complex',
    olfactiveProfile: 'résine, balsamique, sacré',
    emotionalResonance: 'noblesse, ancestral',
    functionalEffect: 'note sacrée Mandé',
    sourceOrigin: 'Résines Mandé',
    notes: 'Molécule-clé Royal Mossi - Famille 4: Résines orientales',
    texture: 'résine'
  },
  
  // FAMILLE 5: Composés ferriques & terre rouge
  {
    name: 'Oxydes de fer volatils',
    family: 'Minéral',
    chemicalFormula: 'Fe-complex',
    olfactiveProfile: 'métal, poussière rouge, chaleur',
    emotionalResonance: 'identité Sahel/Mossi',
    functionalEffect: 'signature impossible à reproduire',
    sourceOrigin: 'Terre rouge Sahel',
    notes: 'Molécule-clé Royal Mossi - Famille 5: Composés ferriques',
    texture: 'sec'
  },
  {
    name: 'Complexes terre minérale',
    family: 'Minéral',
    chemicalFormula: 'Complex',
    olfactiveProfile: 'terre rouge, poussière chaude',
    emotionalResonance: 'chaleur, Sahel',
    functionalEffect: 'signature Mossi',
    sourceOrigin: 'Terre Sahel',
    notes: 'Molécule-clé Royal Mossi - Famille 5: Composés ferriques',
    texture: 'sec'
  },
  
  // FAMILLE 6: Molécules de cuir
  {
    name: 'Quinoléine',
    family: 'Quinoléine',
    chemicalFormula: 'C9H7N',
    olfactiveProfile: 'cuir, animal, fumé',
    emotionalResonance: 'cuir solaire, noble',
    functionalEffect: 'cuir sec et royal',
    sourceOrigin: 'Synthèse',
    notes: 'Molécule-clé Royal Mossi - Famille 6: Molécules de cuir',
    texture: 'sec'
  },
  {
    name: 'Labdanum diterpenes',
    family: 'Résinoïde',
    chemicalFormula: 'C20H32',
    olfactiveProfile: 'ambre noir, cuir végétal',
    emotionalResonance: 'noblesse, chaleur',
    functionalEffect: 'adhère aux tissus & tabacs',
    sourceOrigin: 'Labdanum',
    notes: 'Molécule-clé Royal Mossi - Famille 6: Molécules de cuir',
    texture: 'sec'
  }
];

console.log(`🔄 Importing ${royalMossiMolecules.length} Royal Mossi molecules...`);

let imported = 0;
let skipped = 0;

for (const molecule of royalMossiMolecules) {
  try {
    // Check if molecule already exists
    const existing = await db.query.molecules.findFirst({
      where: (molecules, { eq }) => eq(molecules.name, molecule.name)
    });
    
    if (existing) {
      console.log(`⏭️  Skipped: ${molecule.name} (already exists)`);
      skipped++;
    } else {
      await db.insert(schema.molecules).values(molecule);
      console.log(`✅ Imported: ${molecule.name}`);
      imported++;
    }
  } catch (error) {
    console.error(`❌ Error importing ${molecule.name}:`, error.message);
  }
}

console.log(`\n✅ Import complete!`);
console.log(`   - Imported: ${imported} molecules`);
console.log(`   - Skipped: ${skipped} molecules (already in database)`);
console.log(`   - Total: ${imported + skipped} molecules processed`);

await connection.end();
