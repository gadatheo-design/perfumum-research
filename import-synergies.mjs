/**
 * Script d'import des synergies moléculaires et accords proposés
 * PERFUMUM Research - Session 04 Jan 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Parse DATABASE_URL
function parseDbUrl(url) {
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5]
  };
}

// ============================================================================
// DONNÉES: INTERACTIONS MOLÉCULAIRES DOCUMENTÉES
// ============================================================================

const molecularInteractionsData = [
  {
    interactionId: 'INT-001',
    name: 'Effet Entourage Myrcène-THC',
    sourceCategory: 'cannabis_parfum',
    synergyType: 'entourage',
    description: 'Le myrcène potentialise les effets du THC en augmentant la perméabilité de la barrière hémato-encéphalique. En parfumerie, cette synergie se traduit par une note herbacée-terreuse plus profonde.',
    olfactiveResult: 'Notes herbacées-terreuses profondes et enveloppantes',
    applications: 'Formulations cannabis-inspirées, accords herbacés profonds',
    scientificBasis: 'Modulation de la perméabilité membranaire par le myrcène',
    compatibilityScore: 85,
    terpeneProfile: JSON.stringify([
      { name: 'Myrcène', percentage: 40, source: 'cannabis', function: 'Potentialisateur' },
      { name: 'THC', percentage: 20, source: 'cannabis', function: 'Cannabinoïde principal' }
    ]),
    references: JSON.stringify([
      { title: 'Taming THC: potential cannabis synergy', author: 'Russo, E.B.', year: 2011, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-002',
    name: 'Synergie Limonène-Linalol',
    sourceCategory: 'cannabis_parfum',
    synergyType: 'potentiation',
    description: 'Le limonène et le linalol agissent en synergie pour produire un effet anxiolytique. En parfumerie, cette combinaison crée un accord citrus-floral équilibré et apaisant.',
    olfactiveResult: 'Accord citrus-floral équilibré, notes apaisantes',
    applications: 'Parfums relaxants, accords citrus-floraux',
    scientificBasis: 'Modulation des récepteurs GABA et sérotonine',
    compatibilityScore: 80,
    terpeneProfile: JSON.stringify([
      { name: 'Limonène', percentage: 35, source: 'parfum', function: 'Note de tête citrus' },
      { name: 'Linalol', percentage: 25, source: 'parfum', function: 'Note florale apaisante' }
    ]),
    references: JSON.stringify([
      { title: 'Terpenes in Cannabis sativa', author: 'Russo, E.B.', year: 2011, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-003',
    name: 'Pont Aromatique Caryophyllène',
    sourceCategory: 'tabac_cannabis_parfum',
    synergyType: 'bridge',
    description: 'Le β-caryophyllène agit comme pont aromatique entre le tabac, le cannabis et la parfumerie traditionnelle. Présent dans les trois domaines, il facilite les transitions olfactives.',
    olfactiveResult: 'Notes boisées-épicées communes, transitions fluides',
    applications: 'Formulations hybrides tabac-cannabis, accords épicés',
    scientificBasis: 'Agoniste CB2, présence ubiquitaire dans les trois domaines',
    compatibilityScore: 90,
    terpeneProfile: JSON.stringify([
      { name: 'β-Caryophyllène', percentage: 30, source: 'tabac', function: 'Pont aromatique' },
      { name: 'β-Caryophyllène', percentage: 25, source: 'cannabis', function: 'Agoniste CB2' },
      { name: 'β-Caryophyllène', percentage: 15, source: 'parfum', function: 'Note épicée' }
    ]),
    references: JSON.stringify([
      { title: 'Beta-caryophyllene is a dietary cannabinoid', author: 'Gertsch, J.', year: 2008, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-004',
    name: 'Stabilisation Pinène-Myrcène',
    sourceCategory: 'cannabis_parfum',
    synergyType: 'stabilization',
    description: 'Le pinène stabilise les effets du myrcène, créant un équilibre entre fraîcheur et profondeur. En parfumerie, cette combinaison produit des accords forestiers complexes.',
    olfactiveResult: 'Accords forestiers complexes, équilibre fraîcheur-profondeur',
    applications: 'Accords forestiers, formulations équilibrées',
    scientificBasis: 'Inhibition de l\'acétylcholinestérase par le pinène',
    compatibilityScore: 75,
    terpeneProfile: JSON.stringify([
      { name: 'α-Pinène', percentage: 30, source: 'parfum', function: 'Stabilisateur, fraîcheur' },
      { name: 'Myrcène', percentage: 35, source: 'cannabis', function: 'Profondeur herbacée' }
    ]),
    references: JSON.stringify([
      { title: 'Cannabis Pharmacology', author: 'Russo, E.B.', year: 2017, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-005',
    name: 'Transformation Thermique Tabac-Terpènes',
    sourceCategory: 'tabac_parfum',
    synergyType: 'transformation',
    description: 'La combustion du tabac transforme certains terpènes en composés aromatiques nouveaux. Le limonène se transforme partiellement en p-cymène, créant des notes plus chaudes.',
    olfactiveResult: 'Notes fumées chaudes, transformation aromatique',
    applications: 'Accords fumés, notes tabac transformé',
    scientificBasis: 'Pyrolyse et isomérisation thermique des terpènes',
    compatibilityScore: 70,
    terpeneProfile: JSON.stringify([
      { name: 'Limonène', percentage: 20, source: 'tabac', function: 'Précurseur' },
      { name: 'p-Cymène', percentage: 15, source: 'tabac', function: 'Produit de transformation' }
    ]),
    references: JSON.stringify([
      { title: 'Thermal degradation of terpenes', author: 'McGraw, G.W.', year: 1999, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-006',
    name: 'Potentialisation Humulène-Caryophyllène',
    sourceCategory: 'cannabis_parfum',
    synergyType: 'potentiation',
    description: 'L\'humulène et le caryophyllène, souvent co-présents dans le houblon et le cannabis, se potentialisent mutuellement pour créer des notes boisées-houblonnées distinctives.',
    olfactiveResult: 'Notes boisées-houblonnées distinctives',
    applications: 'Accords houblonnés, notes boisées complexes',
    scientificBasis: 'Activation synergique des récepteurs CB2',
    compatibilityScore: 82,
    terpeneProfile: JSON.stringify([
      { name: 'Humulène', percentage: 25, source: 'cannabis', function: 'Note houblonnée' },
      { name: 'β-Caryophyllène', percentage: 30, source: 'cannabis', function: 'Note épicée-boisée' }
    ]),
    references: JSON.stringify([
      { title: 'Humulene and caryophyllene synergy', author: 'Legault, J.', year: 2007, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-007',
    name: 'Masquage Eucalyptol-Notes Vertes',
    sourceCategory: 'tabac_parfum',
    synergyType: 'masking',
    description: 'L\'eucalyptol (1,8-cinéole) peut masquer certaines notes vertes indésirables du tabac frais, créant une perception plus fraîche et mentholée.',
    olfactiveResult: 'Perception fraîche et mentholée',
    applications: 'Tabacs mentholés, accords frais',
    scientificBasis: 'Compétition au niveau des récepteurs olfactifs',
    compatibilityScore: 65,
    terpeneProfile: JSON.stringify([
      { name: 'Eucalyptol', percentage: 40, source: 'parfum', function: 'Masquant, fraîcheur' }
    ]),
    references: JSON.stringify([
      { title: 'Menthol and tobacco', author: 'Ahijevych, K.', year: 2004, type: 'academic' }
    ])
  },
  {
    interactionId: 'INT-008',
    name: 'Effet Entourage Terpinolène',
    sourceCategory: 'cannabis_parfum',
    synergyType: 'entourage',
    description: 'Le terpinolène contribue à l\'effet entourage avec des notes florales-herbacées uniques. Il module la perception des autres terpènes présents.',
    olfactiveResult: 'Notes florales-herbacées uniques, modulation olfactive',
    applications: 'Accords floraux-herbacés, formulations complexes',
    scientificBasis: 'Modulation olfactive et pharmacologique',
    compatibilityScore: 72,
    terpeneProfile: JSON.stringify([
      { name: 'Terpinolène', percentage: 20, source: 'cannabis', function: 'Modulateur floral-herbacé' }
    ]),
    references: JSON.stringify([
      { title: 'Terpinolene in cannabis', author: 'Booth, J.K.', year: 2017, type: 'academic' }
    ])
  }
];

// ============================================================================
// DONNÉES: ACCORDS PROPOSÉS (Fumoir Oriental, Hash Marocain, Cannabis Vert)
// ============================================================================

const accordsData = [
  {
    name: 'Fumoir Oriental',
    olfactiveProfile: 'Accord évoquant un fumoir traditionnel oriental, mêlant tabac fermenté, résines précieuses et épices chaudes. Composition: Tête (Cardamome, Safran, Bergamote), Cœur (Tabac Virginia fermenté, Rose de Damas, Oud), Fond (Benjoin, Labdanum, Musc, Ambre). Molécules: Caryophyllène, Géraniol, Eugénol, Vanilline, Labdanum absolu.',
    emotionalResonance: 'Opulent, mystérieux, enveloppant. Évoque les traditions du Moyen-Orient.',
    texture: 'resine',
    notes: 'Usage: Parfumerie de niche, encens haut de gamme. Le tabac fermenté apporte une profondeur unique. Intensité: 8/10, Complexité: 9/10.'
  },
  {
    name: 'Hash Marocain',
    olfactiveProfile: 'Accord capturant l\'essence du hashish marocain traditionnel : notes résineuses, terreuses et légèrement épicées avec une touche de menthe. Composition: Tête (Menthe nanah, Citron vert), Cœur (Myrcène, Caryophyllène, Humulène), Fond (Résine de cannabis, Patchouli, Vétiver). Molécules: Myrcène, β-Caryophyllène, Humulène, Limonène, Linalol.',
    emotionalResonance: 'Terreux, résineux, authentique. Profil terpénique typique du hashish marocain.',
    texture: 'resine',
    notes: 'Usage: Parfumerie expérimentale, formulations cannabis-inspirées. La menthe nanah apporte la touche traditionnelle du thé à la menthe. Intensité: 7/10, Complexité: 8/10.'
  },
  {
    name: 'Cannabis Vert',
    olfactiveProfile: 'Accord frais et végétal évoquant le cannabis frais non séché. Notes vertes, herbacées avec des facettes citronnées et florales. Composition: Tête (Limonène, Pinène, Feuille de tomate), Cœur (Myrcène, Ocimène, Terpinolène), Fond (Caryophyllène, Mousse de chêne, Galbanum). Molécules: Limonène, α-Pinène, β-Myrcène, Ocimène, Terpinolène, β-Caryophyllène.',
    emotionalResonance: 'Frais, végétal, vivifiant. Profil représentatif du cannabis frais avant séchage.',
    texture: 'humide',
    notes: 'Usage: Parfumerie verte, accords naturels. Les notes vertes dominent avec une fraîcheur citronnée. Intensité: 6/10, Complexité: 7/10.'
  }
];

// ============================================================================
// DONNÉES: RÈGLES D'EFFET ENTOURAGE
// Structure: rule_id, name, rule_type, primary_molecules, secondary_molecules, 
//            description, mechanism, olfactive_result, applicable_to, scientific_basis, references
// ============================================================================

const entourageRulesData = [
  {
    ruleId: 'ER-001',
    name: 'Règle Myrcène-Cannabinoïdes',
    ruleType: 'entourage',
    primaryMolecules: JSON.stringify([
      { name: 'Myrcène', role: 'Potentialisateur' }
    ]),
    secondaryMolecules: JSON.stringify([
      { name: 'THC', role: 'Cible' },
      { name: 'CBD', role: 'Cible' },
      { name: 'CBG', role: 'Cible' }
    ]),
    description: 'Le myrcène (>0.5%) potentialise l\'absorption des cannabinoïdes en augmentant la perméabilité cellulaire.',
    mechanism: 'Modulation de la perméabilité membranaire',
    olfactiveResult: 'Notes herbacées-terreuses plus profondes et persistantes',
    applicableTo: JSON.stringify(['cannabis', 'parfum']),
    scientificBasis: 'Augmentation de 20-30% de la biodisponibilité des cannabinoïdes',
    references: JSON.stringify([
      { title: 'Taming THC', author: 'Russo, E.B.', year: 2011 }
    ])
  },
  {
    ruleId: 'ER-002',
    name: 'Règle Limonène-Anxiolyse',
    ruleType: 'modulation',
    primaryMolecules: JSON.stringify([
      { name: 'Limonène', role: 'Modulateur' }
    ]),
    secondaryMolecules: JSON.stringify([
      { name: 'THC', role: 'Cible' }
    ]),
    description: 'Le limonène module les effets anxiogènes potentiels du THC, créant une expérience plus équilibrée.',
    mechanism: 'Modulation des récepteurs GABA et sérotonine',
    olfactiveResult: 'Notes citrus apaisantes, équilibre olfactif',
    applicableTo: JSON.stringify(['cannabis', 'parfum']),
    scientificBasis: 'Réduction de l\'anxiété, élévation de l\'humeur',
    references: JSON.stringify([
      { title: 'Limonene anxiolytic effects', author: 'de Almeida, A.A.', year: 2012 }
    ])
  },
  {
    ruleId: 'ER-003',
    name: 'Règle Pinène-Mémoire',
    ruleType: 'enhancement',
    primaryMolecules: JSON.stringify([
      { name: 'α-Pinène', role: 'Protecteur' }
    ]),
    secondaryMolecules: JSON.stringify([
      { name: 'THC', role: 'Cible' }
    ]),
    description: 'Le pinène peut contrebalancer les effets sur la mémoire à court terme associés au THC.',
    mechanism: 'Inhibition de l\'acétylcholinestérase',
    olfactiveResult: 'Notes fraîches et résineuses, clarté olfactive',
    applicableTo: JSON.stringify(['cannabis', 'parfum']),
    scientificBasis: 'Préservation partielle de la mémoire à court terme',
    references: JSON.stringify([
      { title: 'Alpha-pinene and memory', author: 'Perry, N.S.', year: 2000 }
    ])
  },
  {
    ruleId: 'ER-004',
    name: 'Règle Caryophyllène-Anti-inflammatoire',
    ruleType: 'potentiation',
    primaryMolecules: JSON.stringify([
      { name: 'β-Caryophyllène', role: 'Agoniste CB2' }
    ]),
    secondaryMolecules: JSON.stringify([
      { name: 'CBD', role: 'Synergiste' }
    ]),
    description: 'Le β-caryophyllène active les récepteurs CB2, potentialisant les effets anti-inflammatoires.',
    mechanism: 'Activation directe des récepteurs CB2',
    olfactiveResult: 'Notes épicées-boisées, profondeur aromatique',
    applicableTo: JSON.stringify(['tabac', 'cannabis', 'parfum']),
    scientificBasis: 'Effets anti-inflammatoires renforcés',
    references: JSON.stringify([
      { title: 'Beta-caryophyllene as CB2 agonist', author: 'Gertsch, J.', year: 2008 }
    ])
  },
  {
    ruleId: 'ER-005',
    name: 'Règle Linalol-Sédation',
    ruleType: 'modulation',
    primaryMolecules: JSON.stringify([
      { name: 'Linalol', role: 'Sédatif' }
    ]),
    secondaryMolecules: JSON.stringify([
      { name: 'Myrcène', role: 'Synergiste' }
    ]),
    description: 'Le linalol contribue aux effets sédatifs et anxiolytiques, modulant l\'expérience globale.',
    mechanism: 'Modulation GABAergique',
    olfactiveResult: 'Notes florales apaisantes, douceur olfactive',
    applicableTo: JSON.stringify(['cannabis', 'parfum']),
    scientificBasis: 'Effet sédatif léger, réduction du stress',
    references: JSON.stringify([
      { title: 'Linalool sedative effects', author: 'Linck, V.M.', year: 2010 }
    ])
  }
];

// ============================================================================
// FONCTION PRINCIPALE D'IMPORT
// ============================================================================

async function importSynergiesData() {
  console.log('🔬 Import des données de synergies moléculaires...\n');
  
  const dbConfig = parseDbUrl(DATABASE_URL);
  const connection = await mysql.createConnection({
    ...dbConfig,
    ssl: { rejectUnauthorized: true }
  });
  
  try {
    // 1. Import des interactions moléculaires
    console.log('📊 Import des interactions moléculaires...');
    for (const interaction of molecularInteractionsData) {
      await connection.execute(
        `INSERT INTO molecular_interactions 
         (interaction_id, name, source_category, synergy_type, description, olfactive_result, applications, scientific_basis, compatibility_score, terpene_profile, \`references\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name), description = VALUES(description), olfactive_result = VALUES(olfactive_result)`,
        [
          interaction.interactionId,
          interaction.name,
          interaction.sourceCategory,
          interaction.synergyType,
          interaction.description,
          interaction.olfactiveResult,
          interaction.applications,
          interaction.scientificBasis,
          interaction.compatibilityScore,
          interaction.terpeneProfile,
          interaction.references
        ]
      );
      console.log(`  ✓ ${interaction.name}`);
    }
    console.log(`  → ${molecularInteractionsData.length} interactions importées\n`);
    
    // 2. Import des accords proposés
    console.log('🎨 Import des accords proposés...');
    for (const accord of accordsData) {
      await connection.execute(
        `INSERT INTO accords 
         (name, olfactiveProfile, emotionalResonance, texture, notes)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         olfactiveProfile = VALUES(olfactiveProfile), emotionalResonance = VALUES(emotionalResonance)`,
        [
          accord.name,
          accord.olfactiveProfile,
          accord.emotionalResonance,
          accord.texture,
          accord.notes
        ]
      );
      console.log(`  ✓ ${accord.name}`);
    }
    console.log(`  → ${accordsData.length} accords importés\n`);
    
    // 3. Import des règles d'effet entourage
    console.log('📜 Import des règles d\'effet entourage...');
    for (const rule of entourageRulesData) {
      await connection.execute(
        `INSERT INTO entourage_rules 
         (rule_id, name, rule_type, primary_molecules, secondary_molecules, description, mechanism, olfactive_result, applicable_to, scientific_basis, \`references\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name), description = VALUES(description)`,
        [
          rule.ruleId,
          rule.name,
          rule.ruleType,
          rule.primaryMolecules,
          rule.secondaryMolecules,
          rule.description,
          rule.mechanism,
          rule.olfactiveResult,
          rule.applicableTo,
          rule.scientificBasis,
          rule.references
        ]
      );
      console.log(`  ✓ ${rule.name}`);
    }
    console.log(`  → ${entourageRulesData.length} règles importées\n`);
    
    console.log('✅ Import terminé avec succès!');
    console.log(`   - ${molecularInteractionsData.length} interactions moléculaires`);
    console.log(`   - ${accordsData.length} accords proposés`);
    console.log(`   - ${entourageRulesData.length} règles d'effet entourage`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Exécution
importSynergiesData().catch(console.error);
