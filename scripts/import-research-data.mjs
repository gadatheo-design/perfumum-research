import mysql from 'mysql2/promise';

// Données de test pour les 6 axes de recherche
const genomeSamples = [
  { sampleId: 'GS_COL_0001', plantLatinName: 'Pogostemon cablin', populationCode: 'COL_Pop_A', region: 'Colombia', collectionMethod: 'pollen', nonDestructive: true, storage: 'silica_gel', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_IND_0002', plantLatinName: 'Santalum album', populationCode: 'IND_Pop_B', region: 'India', collectionMethod: 'fallen_leaf', nonDestructive: true, storage: '-20C', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_MAD_0003', plantLatinName: 'Vanilla planifolia', populationCode: 'MAD_Pop_C', region: 'Madagascar', collectionMethod: 'seed', nonDestructive: true, storage: '-80C', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_FRA_0004', plantLatinName: 'Lavandula angustifolia', populationCode: 'FRA_Pop_D', region: 'France', collectionMethod: 'tissue', nonDestructive: false, storage: 'LN2', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_SOM_0005', plantLatinName: 'Boswellia sacra', populationCode: 'SOM_Pop_E', region: 'Somalia', collectionMethod: 'herbarium_clip', nonDestructive: true, storage: 'room_temp', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_EGY_0006', plantLatinName: 'Rosa damascena', populationCode: 'EGY_Pop_F', region: 'Egypt', collectionMethod: 'pollen', nonDestructive: true, storage: 'silica_gel', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_ITA_0007', plantLatinName: 'Citrus bergamia', populationCode: 'ITA_Pop_G', region: 'Italy', collectionMethod: 'fallen_leaf', nonDestructive: true, storage: '-20C', axisId: 'AX1_GENOMIC_CONSERVATION' },
  { sampleId: 'GS_TUR_0008', plantLatinName: 'Iris pallida', populationCode: 'TUR_Pop_H', region: 'Turkey', collectionMethod: 'seed', nonDestructive: true, storage: '-80C', axisId: 'AX1_GENOMIC_CONSERVATION' },
];

const manuscripts = [
  { manuscriptId: 'MS_OTTOMAN_0001', title: "Recueil de recettes d'encens", language: 'Ottoman Turkish', dateRange: '1600-1700', repository: 'Topkapi Palace Library', region: 'Ottoman', license: 'Unknown', ocrStatus: 'queued', tags: ['incense', 'trade', 'resins'], axisId: 'AX2_ETHNOBOTANY_COMP' },
  { manuscriptId: 'MS_ARAB_0002', title: 'Kitab al-Tibb (Livre de médecine)', language: 'Arabic', dateRange: '900-1000', repository: 'Bibliothèque nationale de France', region: 'Abbasid', license: 'CC-BY', ocrStatus: 'completed', tags: ['medicine', 'aromatics', 'distillation'], axisId: 'AX2_ETHNOBOTANY_COMP' },
  { manuscriptId: 'MS_PERS_0003', title: 'Traité des parfums persans', language: 'Persian', dateRange: '1400-1500', repository: 'British Library', region: 'Persia', license: 'CC-BY-SA', ocrStatus: 'in_progress', tags: ['perfume', 'rose', 'musk'], axisId: 'AX2_ETHNOBOTANY_COMP' },
  { manuscriptId: 'MS_CHIN_0004', title: '香谱 (Xiangpu - Traité des encens)', language: 'Classical Chinese', dateRange: '1100-1200', repository: 'National Library of China', region: 'Song Dynasty', license: 'Unknown', ocrStatus: 'manual', tags: ['incense', 'ceremony', 'agarwood'], axisId: 'AX2_ETHNOBOTANY_COMP' },
  { manuscriptId: 'MS_ITAL_0005', title: 'Secreti di Isabella Cortese', language: 'Italian', dateRange: '1550-1600', repository: 'Biblioteca Nazionale Centrale', region: 'Renaissance Italy', license: 'CC0', ocrStatus: 'completed', tags: ['cosmetics', 'perfume', 'alchemy'], axisId: 'AX2_ETHNOBOTANY_COMP' },
  { manuscriptId: 'MS_SPAN_0006', title: 'Libro de los perfumes de Al-Andalus', language: 'Andalusian Arabic', dateRange: '1200-1300', repository: 'Real Biblioteca', region: 'Al-Andalus', license: 'Unknown', ocrStatus: 'queued', tags: ['perfume', 'flowers', 'trade'], axisId: 'AX2_ETHNOBOTANY_COMP' },
];

const gcmsRuns = [
  { runId: 'GCMS_0001', sampleRef: 'HB_0001', method: 'HS-SPME-GC-MS', instrument: 'Agilent 7890B', runDate: '2026-01-06', standards: ['linalool', 'camphor', '1,8-cineole'], topCompounds: [{ name: 'linalool', cas: '78-70-6', percent: 32.1 }, { name: 'linalyl acetate', cas: '115-95-7', percent: 28.5 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0002', sampleRef: 'HB_0002', method: 'GC-MS', instrument: 'Shimadzu GCMS-QP2020', runDate: '2026-01-05', standards: ['alpha-pinene', 'limonene'], topCompounds: [{ name: 'alpha-santalol', cas: '115-71-9', percent: 45.2 }, { name: 'beta-santalol', cas: '77-42-9', percent: 18.3 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0003', sampleRef: 'HB_0003', method: 'GC-MS/MS', instrument: 'Thermo TSQ 8000', runDate: '2026-01-04', standards: ['vanillin', 'eugenol'], topCompounds: [{ name: 'vanillin', cas: '121-33-5', percent: 2.8 }, { name: 'p-hydroxybenzaldehyde', cas: '123-08-0', percent: 0.9 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0004', sampleRef: 'HB_0004', method: 'HS-SPME-GC-MS', instrument: 'Agilent 7890B', runDate: '2026-01-03', standards: ['geraniol', 'citronellol'], topCompounds: [{ name: 'citronellol', cas: '106-22-9', percent: 35.6 }, { name: 'geraniol', cas: '106-24-1', percent: 22.4 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0005', sampleRef: 'HB_0005', method: 'LC-MS', instrument: 'Waters Xevo G2-XS', runDate: '2026-01-02', standards: ['incensole', 'boswellic acid'], topCompounds: [{ name: 'alpha-boswellic acid', cas: '471-66-9', percent: 12.3 }, { name: 'incensole acetate', cas: '34701-53-6', percent: 8.7 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0006', sampleRef: 'HB_0006', method: 'GC-MS', instrument: 'Agilent 5977B', runDate: '2026-01-01', standards: ['bergamottin', 'linalool'], topCompounds: [{ name: 'limonene', cas: '138-86-3', percent: 42.1 }, { name: 'linalyl acetate', cas: '115-95-7', percent: 28.9 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0007', sampleRef: 'HB_0007', method: 'HS-SPME-GC-MS', instrument: 'Shimadzu GCMS-QP2020', runDate: '2025-12-31', standards: ['irone', 'myristic acid'], topCompounds: [{ name: 'alpha-irone', cas: '79-69-6', percent: 0.8 }, { name: 'gamma-irone', cas: '79-68-5', percent: 0.3 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
  { runId: 'GCMS_0008', sampleRef: 'HB_0008', method: 'GC-MS', instrument: 'Agilent 7890B', runDate: '2025-12-30', standards: ['myrcene', 'caryophyllene'], topCompounds: [{ name: 'myrcene', cas: '123-35-3', percent: 28.4 }, { name: 'beta-caryophyllene', cas: '87-44-5', percent: 15.2 }], axisId: 'AX3_ANALYTICAL_TRANS_EPOCH' },
];

async function importData() {
  console.log('Connexion à la base de données...');
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL non définie');
    process.exit(1);
  }
  
  const connection = await mysql.createConnection(databaseUrl);
  
  try {
    // Importer les échantillons génomiques
    console.log('Import des échantillons génomiques...');
    for (const sample of genomeSamples) {
      await connection.execute(
        `INSERT INTO genome_samples (sample_id, plant_latin_name, population_code, region, collection_method, non_destructive, storage, axis_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE plant_latin_name = VALUES(plant_latin_name)`,
        [sample.sampleId, sample.plantLatinName, sample.populationCode, sample.region, sample.collectionMethod, sample.nonDestructive, sample.storage, sample.axisId]
      );
    }
    console.log(`✓ ${genomeSamples.length} échantillons génomiques importés`);
    
    // Importer les manuscrits
    console.log('Import des manuscrits...');
    for (const ms of manuscripts) {
      await connection.execute(
        `INSERT INTO perfumum_manuscripts (manuscript_id, title, language, date_range, repository, region, license, ocr_status, tags, axis_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [ms.manuscriptId, ms.title, ms.language, ms.dateRange, ms.repository, ms.region, ms.license, ms.ocrStatus, JSON.stringify(ms.tags), ms.axisId]
      );
    }
    console.log(`✓ ${manuscripts.length} manuscrits importés`);
    
    // Importer les analyses GC-MS
    console.log('Import des analyses GC-MS...');
    for (const run of gcmsRuns) {
      await connection.execute(
        `INSERT INTO perfumum_gcms_runs (run_id, sample_ref, method, instrument, run_date, standards, top_compounds, axis_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE method = VALUES(method)`,
        [run.runId, run.sampleRef, run.method, run.instrument, run.runDate, JSON.stringify(run.standards), JSON.stringify(run.topCompounds), run.axisId]
      );
    }
    console.log(`✓ ${gcmsRuns.length} analyses GC-MS importées`);
    
    console.log('\n✅ Import terminé avec succès!');
    
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
  } finally {
    await connection.end();
  }
}

importData();
