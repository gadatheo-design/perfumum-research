import mysql from 'mysql2/promise';

const samples = [
  {
    sampleId: 'SA-LE-001',
    island: 'san_andres',
    category: 'aromatique',
    species: 'Pimenta racemosa',
    usedPart: 'feuille',
    state: 'sec',
    curingTreatment: 'aucun',
    extraction: 'aucune',
    climaticAxis: JSON.stringify(['vent', 'bois']),
    usage: JSON.stringify(['parfum', 'encens', 'espace']),
    analysisAvailable: 0,
    topMoleculesList: 'eugenol; myrcene; chavicol',
    topMolecule1: 'eugenol',
    topMolecule2: 'myrcene',
    topMolecule3: 'chavicol',
    absorbeInterpretation: 'Feuille-bois épicée sèche (structure)',
    status: 'brut',
  },
  {
    sampleId: 'SA-LE-002',
    island: 'san_andres',
    category: 'aromatique',
    species: 'Cymbopogon citratus',
    usedPart: 'feuille',
    state: 'frais',
    curingTreatment: 'aucun',
    extraction: 'maceration_alcool',
    ratioParameters: '1:5 (m/v)',
    duration: '24h',
    climaticAxis: JSON.stringify(['vent']),
    usage: JSON.stringify(['parfum']),
    analysisAvailable: 0,
    topMoleculesList: 'citral (geranial+neral)',
    topMolecule1: 'geranial',
    topMolecule2: 'neral',
    topMolecule3: 'myrcene',
    absorbeInterpretation: 'Coupe aérienne (attention savon)',
    status: 'brut',
  },
  {
    sampleId: 'SA-LE-003',
    island: 'san_andres',
    category: 'aromatique',
    species: 'Lippia alba',
    usedPart: 'feuille',
    state: 'frais',
    curingTreatment: 'aucun',
    extraction: 'maceration_alcool',
    ratioParameters: '1:5 (m/v)',
    duration: '24h',
    climaticAxis: JSON.stringify(['vent']),
    usage: JSON.stringify(['parfum']),
    analysisAvailable: 0,
    topMoleculesList: 'citral OR carvone (chemotype)',
    topMolecule1: 'citral',
    topMolecule2: 'carvone',
    topMolecule3: 'limonene',
    absorbeInterpretation: 'Choisir chemotype = choisir climat',
    status: 'brut',
  },
  {
    sampleId: 'SA-LE-004',
    island: 'san_andres',
    category: 'tabac',
    species: 'Nicotiana tabacum',
    usedPart: 'feuille',
    state: 'sec',
    curingTreatment: 'air_cured',
    extraction: 'aucune',
    climaticAxis: JSON.stringify(['bois', 'disparition']),
    usage: JSON.stringify(['encens', 'espace']),
    analysisAvailable: 0,
    topMoleculesList: 'damascenone; megastigmatrienone; solanone',
    topMolecule1: 'damascenone',
    topMolecule2: 'megastigmatrienone',
    topMolecule3: 'solanone',
    absorbeInterpretation: 'Tabac = architecture du temps (sans fumée)',
    status: 'brut',
  },
  {
    sampleId: 'SA-LE-005',
    island: 'san_andres',
    category: 'tabac',
    species: 'Nicotiana tabacum',
    usedPart: 'feuille',
    state: 'sec',
    curingTreatment: 'flue_cured',
    extraction: 'aucune',
    climaticAxis: JSON.stringify(['vent', 'bois']),
    usage: JSON.stringify(['parfum']),
    analysisAvailable: 0,
    topMoleculesList: 'damascenone; neophytadiene; megastigmatrienone',
    topMolecule1: 'damascenone',
    topMolecule2: 'neophytadiene',
    topMolecule3: 'megastigmatrienone',
    absorbeInterpretation: 'Tabac clair = structure ventilée',
    status: 'brut',
  },
  {
    sampleId: 'SA-LE-006',
    island: 'san_andres',
    category: 'cannabis',
    species: 'Cannabis sativa',
    usedPart: 'fleur',
    state: 'sec',
    curingTreatment: 'aucun',
    extraction: 'headspace',
    ratioParameters: 'jar 30 min / 22°C',
    duration: '30m',
    climaticAxis: JSON.stringify(['vent', 'disparition']),
    usage: JSON.stringify(['parfum', 'espace']),
    analysisAvailable: 0,
    topMoleculesList: 'myrcene; limonene; beta-caryophyllene',
    topMolecule1: 'myrcene',
    topMolecule2: 'limonene',
    topMolecule3: 'beta-caryophyllene',
    absorbeInterpretation: 'Cannabis = modulation perceptive (non identifiable)',
    status: 'brut',
  },
];

(async () => {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('🌿 Importing Leaf Economies samples...\n');
    
    for (const sample of samples) {
      try {
        // Check if sample already exists
        const [existing] = await conn.query(
          'SELECT id FROM leaf_economies WHERE sample_id = ?',
          [sample.sampleId]
        );
        
        if (existing.length > 0) {
          console.log(`⊙ ${sample.sampleId} already exists, skipping`);
          continue;
        }
        
        // Insert sample
        await conn.query(
          `INSERT INTO leaf_economies (
            sample_id, island, category, species, used_part, state, 
            curing_treatment, extraction, ratio_parameters, duration,
            climatic_axis, \`usage\`, analysis_available, top_molecules_list,
            top_molecule_1, top_molecule_2, top_molecule_3,
            absorbe_interpretation, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sample.sampleId,
            sample.island,
            sample.category,
            sample.species,
            sample.usedPart,
            sample.state,
            sample.curingTreatment,
            sample.extraction,
            sample.ratioParameters || null,
            sample.duration || null,
            sample.climaticAxis,
            sample.usage,
            sample.analysisAvailable,
            sample.topMoleculesList,
            sample.topMolecule1,
            sample.topMolecule2,
            sample.topMolecule3,
            sample.absorbeInterpretation,
            sample.status,
          ]
        );
        
        console.log(`✓ Imported ${sample.sampleId} (${sample.species})`);
      } catch (error) {
        console.error(`✗ Error importing ${sample.sampleId}:`, error.message);
      }
    }
    
    await conn.end();
    console.log('\n✓ Import completed successfully');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
})();
