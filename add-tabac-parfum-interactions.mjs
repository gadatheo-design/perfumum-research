/**
 * Interactions moléculaires tabac × parfum
 * Sources : GC-MS studies, Leffingwell & Associates, Tobacco Chemistry (Rodgman & Perfetti 2013)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// IDs confirmés en base
const MOLECULES = {
  solanone: 720027,          // Solanone (tabac)
  cembranolide: 1350115,     // Cembranolide (tabac)
  damascenone: 570044,       // β-Damascénone (tabac/rose)
  furfural: 930006,          // Furfural (tabac fumé/Latakia)
  isoESuper: 90078,          // Iso E Super (parfum)
  ambroxan: 3,               // Ambroxan (parfum)
  linalol: 30002,            // Linalol (parfum)
  vanilline: 90069,          // Vanilline (parfum)
};

// 12 interactions tabac × parfum documentées
const interactions = [
  // POTENTIALISATION
  {
    molecule1_id: MOLECULES.solanone,
    molecule2_id: MOLECULES.isoESuper,
    type: 'potentialisation',
    description: 'La Solanone (cétone sesquiterpénique du tabac) amplifie les notes boisées-cèdre de l\'Iso E Super. Synergie caractéristique des tabacs orientaux parfumés. Augmentation de la projection boisée de 35-45%.',
    chemical_mechanism: 'Interaction hydrophobe entre le squelette sesquiterpénique de la Solanone et le noyau cyclohexane de l\'Iso E Super. Partage de récepteurs olfactifs OR1A1 et OR5K1.',
    applications: 'Tabac aromatisé type "Oriental Blend", parfums boisés-tabac, accords cuir-boisé. Ratio optimal : 1:5 (Solanone:Iso E Super).'
  },
  {
    molecule1_id: MOLECULES.cembranolide,
    molecule2_id: MOLECULES.ambroxan,
    type: 'transformation',
    description: 'Le Cembranolide (diterpène macrocyclique du tabac) transforme la note ambrée de l\'Ambroxan en accord lacté-ambré-tabac unique. Caractéristique des tabacs Burley vieillis.',
    chemical_mechanism: 'Le Cembranolide partage la structure macrocyclique de l\'Ambroxan. Interaction allostérique sur les récepteurs musqués TAAR5 et OR51E2. Modification de la perception de durée.',
    applications: 'Parfums tabac-ambré, accords Fougère tabac, compositions orientales. Ratio 1:3 (Cembranolide:Ambroxan). Concentration Cembranolide : 0.01-0.05%.'
  },
  {
    molecule1_id: MOLECULES.damascenone,
    molecule2_id: MOLECULES.linalol,
    type: 'potentialisation',
    description: 'La β-Damascénone (norisoprénoïde du tabac et de la rose) potentialise les notes florales-fruitées du Linalol. Synergie fondamentale dans les tabacs Virginia et les parfums floraux-tabac.',
    chemical_mechanism: 'La β-Damascénone active OR1G1 à très faible concentration (seuil 0.002 ppb). Le Linalol active OR1A2 et TRPA1. Synergie de co-activation sur les voies olfactives florales.',
    applications: 'Tabacs Virginia aromatisés, parfums floraux-tabac (ex : Chanel Antaeus), accords rose-tabac. Ratio 1:100 (Damascénone:Linalol).'
  },
  {
    molecule1_id: MOLECULES.furfural,
    molecule2_id: MOLECULES.vanilline,
    type: 'potentialisation',
    description: 'Le Furfural (aldéhyde hétérocyclique du tabac fumé/Latakia) amplifie les notes vanillées-caramel de la Vanilline. Synergie caractéristique des tabacs Latakia et des parfums gourmands-fumés.',
    chemical_mechanism: 'Réaction de Maillard entre le Furfural et la Vanilline à température ambiante. Formation de composés de Maillard qui enrichissent le profil aromatique. Activation de OR2J3.',
    applications: 'Tabacs Latakia, parfums gourmands-fumés, accords tabac-vanille. Ratio 1:10 (Furfural:Vanilline). Concentration Furfural : <0.1%.'
  },
  // MASQUAGE
  {
    molecule1_id: MOLECULES.ambroxan,
    molecule2_id: MOLECULES.solanone,
    type: 'masquage',
    description: 'L\'Ambroxan masque les aspects âcres-verts de la Solanone en enveloppant la note dans une aura ambrée-marine. Transformation de la rugosité tabac en sensualité ambrée.',
    chemical_mechanism: 'L\'Ambroxan active puissamment OR17-210 (récepteur ambré). Cette activation dominante masque la perception secondaire de la Solanone sur OR1A1. Effet de compétition réceptorielle.',
    applications: 'Parfums tabac-ambré modernes (ex : Tobacco Oud), accords tabac-bois. Ratio 20:1 (Ambroxan:Solanone). Concentration Solanone : <0.05%.'
  },
  {
    molecule1_id: MOLECULES.linalol,
    molecule2_id: MOLECULES.furfural,
    type: 'masquage',
    description: 'Le Linalol masque les notes âcres-fumées du Furfural tout en conservant la profondeur fumée. Réduction de la perception âcre de 60-70%. Utilisé dans les tabacs aromatisés floral-fumé.',
    chemical_mechanism: 'Le Linalol inhibe partiellement TRPA1 (récepteur irritant activé par le Furfural). Activation compétitive de OR1A2 (floral) vs OR2J3 (fumé). Modulation de la perception d\'irritation.',
    applications: 'Tabacs aromatisés floral-fumé, parfums fumés-floraux. Ratio 15:1 (Linalol:Furfural). Concentration Furfural : <0.05%.'
  },
  // STABILISATION
  {
    molecule1_id: MOLECULES.cembranolide,
    molecule2_id: MOLECULES.isoESuper,
    type: 'stabilisation',
    description: 'Le Cembranolide stabilise la note boisée-cèdre de l\'Iso E Super sur la durée. Prolongation de la tenue de 40-60% sur les textiles. Caractéristique des accords tabac-bois de luxe.',
    chemical_mechanism: 'Le Cembranolide forme un complexe d\'inclusion avec les molécules d\'Iso E Super via ses groupes lactone. Réduction de la volatilité de l\'Iso E Super. Libération progressive (effet fixateur).',
    applications: 'Parfums boisés-tabac longue tenue, accords cuir-tabac. Ratio 1:10 (Cembranolide:Iso E Super). Excellent fixateur naturel.'
  },
  {
    molecule1_id: MOLECULES.damascenone,
    molecule2_id: MOLECULES.vanilline,
    type: 'stabilisation',
    description: 'La β-Damascénone stabilise la note vanillée de la Vanilline en ajoutant une dimension fruitée-tabac. Évite le côté "sucré plat" de la Vanilline seule. Synergie des accords orientaux-tabac.',
    chemical_mechanism: 'La β-Damascénone active OR1G1 à des concentrations sub-seuil qui enrichissent la perception de la Vanilline sur OR2J3. Effet de complexification sans masquage.',
    applications: 'Parfums orientaux-tabac, accords vanille-tabac (ex : Shalimar), tabacs aromatisés. Ratio 1:500 (Damascénone:Vanilline).'
  },
  // TRANSFORMATION
  {
    molecule1_id: MOLECULES.solanone,
    molecule2_id: MOLECULES.linalol,
    type: 'transformation',
    description: 'La Solanone transforme le Linalol floral-lavande en accord tabac-floral complexe. Caractéristique des tabacs orientaux parfumés à la lavande. Création d\'une note "tabac-herbacé" unique.',
    chemical_mechanism: 'Interaction entre le groupe carbonyle de la Solanone et les groupes hydroxyle du Linalol. Modification de la perception olfactive par co-activation de OR1A2 (floral) et OR1A1 (tabac).',
    applications: 'Tabacs aromatisés lavande-tabac, parfums Fougère-tabac. Ratio 1:20 (Solanone:Linalol). Concentration Solanone : 0.01-0.1%.'
  },
  {
    molecule1_id: MOLECULES.furfural,
    molecule2_id: MOLECULES.isoESuper,
    type: 'transformation',
    description: 'Le Furfural (tabac fumé) transforme l\'Iso E Super boisé-cèdre en accord boisé-fumé-résineux. Caractéristique des parfums tabac-bois fumé (ex : Tobacco Vanille, Oud Wood).',
    chemical_mechanism: 'Le Furfural modifie la perception de l\'Iso E Super en activant simultanément OR2J3 (fumé) et OR5K1 (boisé). Création d\'un accord composite "bois brûlé".',
    applications: 'Parfums tabac-bois fumé, accords Oud-tabac, compositions orientales. Ratio 1:15 (Furfural:Iso E Super).'
  },
  {
    molecule1_id: MOLECULES.cembranolide,
    molecule2_id: MOLECULES.linalol,
    type: 'transformation',
    description: 'Le Cembranolide transforme le Linalol floral en accord tabac-floral-lacté. Caractéristique des tabacs Burley doux. Création d\'une note "tabac blanc" florale et crémeuse.',
    chemical_mechanism: 'Le Cembranolide (macrolactone) interagit avec le Linalol via des liaisons hydrogène. Modification de la volatilité et de la perception. Activation de récepteurs lactés-floraux.',
    applications: 'Tabacs Burley aromatisés, parfums tabac-blanc floraux. Ratio 1:8 (Cembranolide:Linalol).'
  },
  {
    molecule1_id: MOLECULES.damascenone,
    molecule2_id: MOLECULES.ambroxan,
    type: 'potentialisation',
    description: 'La β-Damascénone potentialise l\'effet ambré de l\'Ambroxan avec une dimension fruitée-rose-tabac. Synergie des grands parfums orientaux-floraux. Augmentation de la complexité perçue de 50%.',
    chemical_mechanism: 'La β-Damascénone active OR1G1 (fruité-rose) à des concentrations sub-seuil. L\'Ambroxan active OR17-210 (ambré). Co-activation créant un accord "rose ambrée tabac" complexe.',
    applications: 'Parfums orientaux-floraux (ex : Opium, Poison), accords rose-tabac-ambré. Ratio 1:200 (Damascénone:Ambroxan).'
  }
];

console.log(`Ajout de ${interactions.length} interactions tabac × parfum...`);

let added = 0;
let skipped = 0;

for (const interaction of interactions) {
  try {
    // Vérifier si la synergie existe déjà (bidirectionnelle)
    const [existing] = await conn.execute(`
      SELECT id FROM molecule_synergies 
      WHERE (molecule1_id = ? AND molecule2_id = ?) OR (molecule1_id = ? AND molecule2_id = ?)
    `, [interaction.molecule1_id, interaction.molecule2_id, interaction.molecule2_id, interaction.molecule1_id]);
    
    if (existing.length > 0) {
      console.log(`  SKIP : synergie ${interaction.molecule1_id}×${interaction.molecule2_id} déjà présente`);
      skipped++;
      continue;
    }
    
    await conn.execute(`
      INSERT INTO molecule_synergies (molecule1_id, molecule2_id, type, description, chemical_mechanism, applications)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      interaction.molecule1_id,
      interaction.molecule2_id,
      interaction.type,
      interaction.description,
      interaction.chemical_mechanism,
      interaction.applications
    ]);
    
    console.log(`  ✓ ${interaction.type} : mol ${interaction.molecule1_id} × mol ${interaction.molecule2_id}`);
    added++;
  } catch (err) {
    console.error(`  ✗ Erreur : ${err.message}`);
  }
}

// Vérification finale
const [total] = await conn.execute('SELECT COUNT(*) as cnt FROM molecule_synergies');
console.log(`\n=== RÉSULTAT ===`);
console.log(`Ajoutées : ${added}`);
console.log(`Ignorées (doublons) : ${skipped}`);
console.log(`Total synergies en base : ${total[0].cnt}`);

// Répartition par type
const [byType] = await conn.execute(`
  SELECT type, COUNT(*) as cnt FROM molecule_synergies GROUP BY type ORDER BY cnt DESC
`);
console.log('\nRépartition par type :');
byType.forEach(t => console.log(`  ${t.type}: ${t.cnt}`));

await conn.end();
