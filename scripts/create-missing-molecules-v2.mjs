import mysql from 'mysql2/promise';

const db = await mysql.createConnection(process.env.DATABASE_URL);
const log = (s) => console.log(s);

log('🧬 CRÉATION DES MOLÉCULES MANQUANTES V2');
log('='.repeat(60));

let created = 0;
let linked = 0;

// ─────────────────────────────────────────────────────────────
// PHASE A : Créer les vraies molécules manquantes
// ─────────────────────────────────────────────────────────────
const newMolecules = [
  // Cannabinoïdes
  {
    name: 'CBD Isolat',
    cas: '13956-29-1',
    formula: 'C21H30O2',
    mw: 314.46,
    family: 'Cannabinoïde',
    chemicalFamily: 'Phytocannabinoïde',
    olfactiveProfile: 'Neutre, légèrement terreux, végétal',
    therapeuticProperties: 'Anxiolytique puissant (études cliniques). Anti-inflammatoire (inhibition COX-2). Neuroprotecteur. Antiépileptique (FDA approuvé — Epidiolex). Antipsychotique. Analgésique. Antioxydant. Immunomodulateur. CBD pur à 99%+ sans THC.',
    notes: 'CBD pur isolé, sans THC. Utilisé en parfumerie thérapeutique et formulation.'
  },
  // Matières premières brutes
  {
    name: 'Labdanum',
    cas: '8016-26-0',
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Ambre, boisé, animal, chaud, musqué, légèrement fumé',
    therapeuticProperties: 'Antibactérien et antifongique (acides diterpéniques). Cicatrisant cutané. Antioxydant puissant. Expectorant. Fixateur olfactif exceptionnel. Utilisé en médecine traditionnelle méditerranéenne. Propriétés anxiolytiques légères.',
    notes: 'Résine de Cistus ladanifer. Note de fond ambrée classique.'
  },
  {
    name: 'Mousse de Chêne',
    cas: '90028-68-5',
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Extrait de lichen',
    olfactiveProfile: 'Boisé, terreux, humide, mousse, forêt, légèrement fumé',
    therapeuticProperties: 'Antibactérien (atranol, chloroatranol). Antifongique. Fixateur olfactif puissant. Usage restreint IFRA (allergène potentiel). Propriétés antimicrobiennes documentées en médecine traditionnelle.',
    notes: 'Absolue d\'Evernia prunastri. Composant classique des chyprés et fougères.'
  },
  {
    name: 'Castoreum',
    cas: '8023-83-4',
    formula: 'Mixture',
    mw: null,
    family: 'Matière animale',
    chemicalFamily: 'Sécrétion animale',
    olfactiveProfile: 'Animal, cuir, birch tar, fumé, musqué, légèrement sucré',
    therapeuticProperties: 'Analgésique léger (acide salicylique). Antibactérien. Aphrodisiaque traditionnel (phéromone documentée). Anti-inflammatoire. Espèce protégée — alternatives synthétiques utilisées en parfumerie moderne.',
    notes: 'Sécrétion des glandes de castor (Castor fiber). Note de fond animale.'
  },
  {
    name: 'Ambre Gris',
    cas: '8023-85-6',
    formula: 'Mixture',
    mw: null,
    family: 'Matière animale',
    chemicalFamily: 'Concrète marine',
    olfactiveProfile: 'Marin, animal, terreux, chaud, musqué, légèrement fécal puis doux',
    therapeuticProperties: 'Aphrodisiaque documenté (activation dopaminergique). Fixateur olfactif exceptionnel. Antibactérien. Activité phéromonale. Espèce protégée — alternatives synthétiques (Ambroxan, Ambrox, Cetalox).',
    notes: 'Concrète de spermaceti (Physeter macrocephalus). Fixateur légendaire.'
  },
  {
    name: 'Hyraceum',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Matière animale',
    chemicalFamily: 'Sécrétion animale',
    olfactiveProfile: 'Animal, terreux, fumé, cuir, musqué, légèrement fécal',
    therapeuticProperties: 'Propriétés phéromonales documentées. Antibactérien. Utilisé en médecine traditionnelle africaine. Alternative éthique aux muscs animaux classiques (civette, castor).',
    notes: 'Urine fossilisée du daman des rochers (Procavia capensis). Alternative éthique.'
  },
  // Plantes et extraits mexicains
  {
    name: 'Copal Negro',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Fumé, boisé, terreux, légèrement citronné, sacré',
    therapeuticProperties: 'Antibactérien puissant (acides triterpéniques). Anti-inflammatoire. Cicatrisant. Antifongique. Utilisé depuis 3000 ans dans les rituels mésoaméricains. Propriétés purifiantes de l\'air documentées.',
    notes: 'Résine de Bursera copallifera. Copal sacré mésoaméricain.'
  },
  {
    name: 'Copal Blanco',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Citronné, frais, boisé, légèrement sucré, encens',
    therapeuticProperties: 'Antibactérien. Anti-inflammatoire. Antifongique. Cicatrisant. Propriétés purifiantes. Utilisé dans les rituels mésoaméricains et la médecine traditionnelle mexicaine.',
    notes: 'Résine de Bursera bipinnata. Copal blanc mexicain.'
  },
  {
    name: 'Palo Santo',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Boisé, citronné, encens, légèrement sucré, fumé',
    therapeuticProperties: 'Antibactérien et antifongique (limonène, α-terpinéol). Anti-inflammatoire. Anxiolytique. Analgésique. Immunostimulant. Utilisé en médecine traditionnelle andine. Propriétés purifiantes de l\'air.',
    notes: 'Bois sacré de Bursera graveolens. Utilisé en aromathérapie et parfumerie.'
  },
  {
    name: 'Tagetes lucida',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Anisé, herbacé, légèrement épicé, floral, estragole',
    therapeuticProperties: 'Antibactérien et antifongique (estragole, méthyl chavicol). Antispasmodique. Digestif. Anxiolytique léger. Utilisé en médecine traditionnelle mexicaine (Pericón). Propriétés psychoactives légères documentées.',
    notes: 'Tagetes lucida (Pericón). Plante sacrée mésoaméricaine.'
  },
  {
    name: 'Damiana',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Herbacé, légèrement épicé, terreux, boisé',
    therapeuticProperties: 'Aphrodisiaque documenté (activation récepteurs opioïdes). Anxiolytique. Antidépresseur léger. Adaptogène. Stimulant cognitif. Utilisé en médecine traditionnelle mexicaine et caribéenne. Propriétés psychoactives légères.',
    notes: 'Turnera diffusa. Plante aphrodisiaque traditionnelle mexicaine.'
  },
  {
    name: 'Turnera Diffusa',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Herbacé, légèrement épicé, terreux, boisé',
    therapeuticProperties: 'Aphrodisiaque documenté. Anxiolytique. Antidépresseur léger. Adaptogène. Stimulant cognitif. Utilisé en médecine traditionnelle mexicaine. Propriétés psychoactives légères.',
    notes: 'Synonyme de Damiana. Plante aphrodisiaque traditionnelle.'
  },
  {
    name: 'Lippia Origanoides',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Herbacé, épicé, origan, thymol, légèrement citronné',
    therapeuticProperties: 'Antibactérien puissant (thymol, carvacrol). Antifongique. Anti-inflammatoire. Antioxydant puissant. Antiparasitaire. Utilisé en médecine traditionnelle colombienne et vénézuélienne.',
    notes: 'Lippia origanoides. Plante aromatique d\'Amérique du Sud.'
  },
  {
    name: 'Steiractinia Aspera',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Terreux, herbacé, légèrement épicé, végétal',
    therapeuticProperties: 'Propriétés antibactériennes et anti-inflammatoires documentées. Plante médicinale andine. Utilisée en médecine traditionnelle colombienne.',
    notes: 'Steiractinia aspera. Plante médicinale andine colombienne.'
  },
  {
    name: 'Piper Aduncum',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Huile essentielle',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Poivré, épicé, légèrement floral, dillapiole',
    therapeuticProperties: 'Antibactérien et antifongique puissant (dillapiole). Antiparasitaire (anti-Leishmania documenté). Anti-inflammatoire. Analgésique. Utilisé en médecine traditionnelle amazonienne.',
    notes: 'Piper aduncum. Poivrier amazonien aux propriétés antiparasitaires.'
  },
  // Ingrédients de parfumerie synthétique
  {
    name: 'Hedione',
    cas: '24851-98-7',
    formula: 'C13H22O3',
    mw: 226.31,
    family: 'Ester',
    chemicalFamily: 'Jasmonate de méthyle',
    olfactiveProfile: 'Jasmin, floral, propre, frais, légèrement fruité',
    therapeuticProperties: 'Activité phéromonale documentée (activation récepteur TAAR1 et VN1R1). Effets psycho-émotionnels : sérénité, bien-être, légèreté. Anxiolytique léger. Utilisé en parfumerie fine depuis Eau Sauvage (Dior, 1966).',
    notes: 'Jasmonate de méthyle dihydro. Révolution de la parfumerie moderne.'
  },
  {
    name: 'Javanol',
    cas: '160294-76-8',
    formula: 'C15H26O',
    mw: 222.37,
    family: 'Alcool sesquiterpénique',
    chemicalFamily: 'Santal synthétique',
    olfactiveProfile: 'Santal, crémeux, boisé, doux, laiteux',
    therapeuticProperties: 'Propriétés sensorielles proches du santal naturel. Activité anxiolytique légère. Effets psycho-émotionnels : sérénité, chaleur, confort. Biodégradable. Alternative durable au santal de Mysore.',
    notes: 'Santal synthétique (Givaudan). Alternative éthique au santal naturel.'
  },
  {
    name: 'Norlimbanol',
    cas: '70788-30-6',
    formula: 'C14H26O',
    mw: 210.36,
    family: 'Alcool',
    chemicalFamily: 'Ambre synthétique',
    olfactiveProfile: 'Ambre, boisé, chaud, légèrement musqué',
    therapeuticProperties: 'Propriétés sensorielles ambrées. Effets psycho-émotionnels : chaleur, sécurité, sensualité. Fixateur olfactif. Utilisé en parfumerie fine pour les accords ambrés.',
    notes: 'Ambre synthétique. Utilisé en parfumerie fine.'
  },
  {
    name: 'Paradisone',
    cas: '68901-52-0',
    formula: 'C14H22O',
    mw: 206.32,
    family: 'Cétone',
    chemicalFamily: 'Musc synthétique',
    olfactiveProfile: 'Musc, floral, propre, légèrement fruité',
    therapeuticProperties: 'Propriétés sensorielles musquées et florales. Effets psycho-émotionnels : douceur, féminité, légèreté. Fixateur olfactif. Utilisé en parfumerie fine.',
    notes: 'Musc synthétique floral. Utilisé en parfumerie fine.'
  },
  {
    name: 'Tagetone',
    cas: '18794-84-8',
    formula: 'C10H16O',
    mw: 152.23,
    family: 'Cétone',
    chemicalFamily: 'Cétone monoterpénique',
    olfactiveProfile: 'Herbacé, anisé, légèrement fruité, Tagetes',
    therapeuticProperties: 'Antibactérien. Antifongique. Présent dans les huiles essentielles de Tagetes. Propriétés insectifuges documentées.',
    notes: 'Cétone monoterpénique de Tagetes. Composant caractéristique.'
  },
  // Matières premières spéciales
  {
    name: 'Mezcal',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Matière première',
    chemicalFamily: 'Distillat végétal',
    olfactiveProfile: 'Fumé, agave, terreux, légèrement fruité, alcoolisé',
    therapeuticProperties: 'Propriétés sensorielles complexes (fumé, agave, terreux). Composés phénoliques de fumage (gaïacol, syringol). Furfural. Alcool éthylique. Utilisé en parfumerie expérimentale pour les accords fumés et terreux.',
    notes: 'Distillat d\'agave fumé. Matière première expérimentale en parfumerie.'
  },
  {
    name: 'Géosmine',
    cas: '19700-21-1',
    formula: 'C12H22O',
    mw: 182.30,
    family: 'Alcool sesquiterpénique',
    chemicalFamily: 'Terpenoïde bicyclique',
    olfactiveProfile: 'Terre humide, pluie sur terre sèche (petrichor), betterave, champignon',
    therapeuticProperties: 'Seuil olfactif extrêmement bas (5 ppt). Évoque la pluie et la terre. Effets psycho-émotionnels documentés : calme, ancrage, nostalgie. Produit par Streptomyces et cyanobactéries. Indicateur de qualité de l\'eau.',
    notes: 'Molécule de la pluie sur terre sèche. Seuil olfactif parmi les plus bas connus.'
  },
  {
    name: 'Kaolin',
    cas: '1332-58-7',
    formula: 'Al2Si2O5(OH)4',
    mw: 258.16,
    family: 'Minéral',
    chemicalFamily: 'Silicate d\'aluminium',
    olfactiveProfile: 'Neutre, légèrement terreux, minéral, poudré',
    therapeuticProperties: 'Adsorbant. Protecteur cutané. Anti-inflammatoire topique. Détoxifiant (absorption des toxines). Utilisé en médecine et cosmétique. Propriétés sensorielles minérales en parfumerie.',
    notes: 'Argile blanche. Utilisée en parfumerie expérimentale pour les accords minéraux.'
  },
  {
    name: 'Résine de Pin',
    cas: '8050-09-7',
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Pin, boisé, térébenthine, frais, résineux',
    therapeuticProperties: 'Antibactérien et antifongique (acides résiniques). Antiseptique respiratoire. Anti-inflammatoire. Cicatrisant. Expectorant. Utilisé en médecine traditionnelle depuis l\'Antiquité.',
    notes: 'Résine de Pinus spp. Matière première résinoïde classique.'
  },
  {
    name: 'Résine de Styrax',
    cas: '8046-19-3',
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Balsamique, vanillé, floral, légèrement fumé, chaud',
    therapeuticProperties: 'Antibactérien et antiseptique (acide cinnamique, cinnamate de benzyle). Cicatrisant. Expectorant. Anti-inflammatoire. Fixateur olfactif. Utilisé en médecine traditionnelle et parfumerie.',
    notes: 'Résine de Liquidambar orientalis. Balsamique classique.'
  },
  {
    name: 'Résine d\'Élémi',
    cas: '8023-89-0',
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Citronné, épicé, boisé, légèrement poivré, encens',
    therapeuticProperties: 'Antibactérien. Cicatrisant. Expectorant. Anti-inflammatoire. Utilisé en médecine traditionnelle philippine. Propriétés régénérantes cutanées documentées.',
    notes: 'Résine de Canarium luzonicum. Élémi des Philippines.'
  },
  {
    name: 'Résine de Gobernadora',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Résinoïde',
    chemicalFamily: 'Résine végétale',
    olfactiveProfile: 'Terreux, légèrement créosote, désertique, herbacé',
    therapeuticProperties: 'Antibactérien puissant (NDGA — acide nordihydroguaïarétique). Antioxydant exceptionnel. Anti-inflammatoire. Antiparasitaire. Utilisé en médecine traditionnelle du désert de Sonora et Chihuahua.',
    notes: 'Résine de Larrea tridentata. Plante médicinale du désert de Sonora.'
  },
  {
    name: 'Huitlacoche',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Matière première',
    chemicalFamily: 'Champignon parasitaire',
    olfactiveProfile: 'Terreux, champignon, maïs, légèrement fumé, umami',
    therapeuticProperties: 'Riche en acide linoléique et acide oléique. Antioxydant. Propriétés prébiotiques. Riche en protéines et acides aminés essentiels. Utilisé en gastronomie mexicaine et parfumerie expérimentale.',
    notes: 'Ustilago maydis. Champignon parasite du maïs. Ingrédient gastronomique mexicain.'
  },
  {
    name: 'Mitti Attar',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Attar',
    chemicalFamily: 'Distillat végétal',
    olfactiveProfile: 'Terre humide, petrichor, argile, pluie, minéral',
    therapeuticProperties: 'Propriétés sensorielles de la pluie sur terre sèche (petrichor). Géosmine dominante. Effets psycho-émotionnels : ancrage, calme, connexion à la nature. Distillé sur huile de santal.',
    notes: 'Attar de terre cuite (Kannauj, Inde). Distillat de terre cuite sur huile de santal.'
  },
  {
    name: 'Oud Tea',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Attar',
    chemicalFamily: 'Extrait végétal',
    olfactiveProfile: 'Oud, thé, boisé, légèrement fumé, oriental',
    therapeuticProperties: 'Propriétés de l\'oud (antibactérien, anti-inflammatoire, anxiolytique) combinées aux polyphénols du thé (antioxydant, neuroprotecteur). Utilisé en parfumerie orientale.',
    notes: 'Accord oud et thé. Matière première de parfumerie orientale.'
  },
  {
    name: 'Black Emerald',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Accord',
    chemicalFamily: 'Accord synthétique',
    olfactiveProfile: 'Boisé, ambré, légèrement fumé, mystérieux, profond',
    therapeuticProperties: 'Accord synthétique complexe. Propriétés sensorielles profondes et mystérieuses. Effets psycho-émotionnels : profondeur, mystère, sensualité. Utilisé en parfumerie fine contemporaine.',
    notes: 'Accord synthétique complexe. Matière première de parfumerie fine.'
  },
  {
    name: 'Gris d\'Ambre',
    cas: null,
    formula: 'Mixture',
    mw: null,
    family: 'Accord',
    chemicalFamily: 'Accord ambré',
    olfactiveProfile: 'Ambre, chaud, musqué, légèrement vanillé, oriental',
    therapeuticProperties: 'Accord ambré classique. Propriétés sensorielles chaudes et enveloppantes. Effets psycho-émotionnels : chaleur, sécurité, sensualité. Fixateur olfactif. Utilisé en parfumerie orientale.',
    notes: 'Accord ambré classique de parfumerie. Note de fond orientale.'
  },
];

log(`\n🧬 A. Création de ${newMolecules.length} molécules manquantes`);

for (const mol of newMolecules) {
  // Vérifier si elle existe déjà
  const [existing] = await db.query(
    'SELECT id FROM molecules WHERE name = ? LIMIT 1',
    [mol.name]
  );
  if (existing.length > 0) {
    log(`  ⏭️  ${mol.name} (déjà existante, id:${existing[0].id})`);
    continue;
  }
  
  // Créer la molécule
  const [r] = await db.query(
    `INSERT INTO molecules (name, cas_number, formula, molecularWeight, family, chemicalFamily, olfactiveProfile, therapeuticProperties, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [mol.name, mol.cas || null, mol.formula || null, mol.mw || null, mol.family, mol.chemicalFamily, mol.olfactiveProfile, mol.therapeuticProperties, mol.notes || null]
  );
  created++;
  log(`  ✅ ${mol.name} (id:${r.insertId})`);
}

// ─────────────────────────────────────────────────────────────
// PHASE B : Améliorer le parser — lier les ingrédients avec pourcentages
// ─────────────────────────────────────────────────────────────
log('\n🔗 B. Liaison améliorée des ingrédients avec pourcentages');

const [recettes] = await db.query(
  'SELECT id, name, ingredients FROM recettes WHERE ingredients IS NOT NULL AND ingredients != ""'
);

for (const recette of recettes) {
  const lines = recette.ingredients.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 2);
  
  for (const line of lines) {
    // Extraire le nom de la molécule (enlever les pourcentages et annotations)
    const cleanName = line
      .replace(/\s*[\(\[]\d+[\)\]]/g, '') // enlever (10) [10]
      .replace(/\s+\d+\.?\d*\s*%/g, '')   // enlever 15%
      .replace(/\s+\d+\.?\d*\s*g/gi, '')  // enlever 15g
      .replace(/\s+pur\s*$/i, '')          // enlever "pur"
      .replace(/\s+\(.*\)$/, '')           // enlever (description)
      .trim();
    
    // Extraire le pourcentage si présent
    const pctMatch = line.match(/(\d+\.?\d*)\s*%/);
    const proportion = pctMatch ? parseFloat(pctMatch[1]) : null;
    
    if (cleanName.length < 2) continue;
    
    // Chercher la molécule par nom exact ou similaire
    const [mols] = await db.query(
      'SELECT id FROM molecules WHERE name = ? OR name LIKE ? LIMIT 1',
      [cleanName, cleanName + '%']
    );
    
    if (mols.length === 0) continue;
    
    const molId = mols[0].id;
    
    // Vérifier si la liaison existe déjà
    const [existingLink] = await db.query(
      'SELECT 1 FROM recette_molecules WHERE recette_id = ? AND molecule_id = ? LIMIT 1',
      [recette.id, molId]
    );
    
    if (existingLink.length > 0) continue;
    
    // Créer la liaison
    await db.query(
      'INSERT INTO recette_molecules (recette_id, molecule_id, proportion) VALUES (?, ?, ?)',
      [recette.id, molId, proportion]
    );
    linked++;
  }
}

log(`  ✅ ${linked} nouvelles liaisons créées`);

// ─────────────────────────────────────────────────────────────
// RÉSUMÉ
// ─────────────────────────────────────────────────────────────
const [totalMols] = await db.query('SELECT COUNT(*) as n FROM molecules');
const [totalLinks] = await db.query('SELECT COUNT(*) as n FROM recette_molecules');
const [linkedRecettes] = await db.query(`
  SELECT COUNT(DISTINCT recette_id) as n FROM recette_molecules
`);
const [totalRecettes] = await db.query('SELECT COUNT(*) as n FROM recettes');

log('\n' + '='.repeat(60));
log('📊 RÉSUMÉ');
log(`  Molécules créées : ${created}`);
log(`  Liaisons créées : ${linked}`);
log(`  Total molécules : ${totalMols[0].n}`);
log(`  Total liaisons recette_molecules : ${totalLinks[0].n}`);
log(`  Recettes avec liaisons : ${linkedRecettes[0].n}/${totalRecettes[0].n} (${Math.round(linkedRecettes[0].n/totalRecettes[0].n*100)}%)`);
log('✅ Script terminé');

await db.end();
