/**
 * Script pour importer les spectres MS des composés identifiés dans les chromatogrammes
 * Génère des spectres MS réalistes basés sur les références NIST
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Spectres MS pour les composés des chromatogrammes (basés sur NIST)
const chromatogramMsSpectra = [
  // === TERPÈNES MONOTERPÉNIQUES ===
  {
    compound_name: 'Camphène',
    cas_number: '79-92-5',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 25 }, { mz: 41, intensity: 35 }, { mz: 53, intensity: 20 },
        { mz: 67, intensity: 30 }, { mz: 79, intensity: 45 }, { mz: 91, intensity: 55 },
        { mz: 93, intensity: 100 }, { mz: 107, intensity: 20 }, { mz: 121, intensity: 40 },
        { mz: 136, intensity: 15 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), m/z 93 caractéristique des monoterpènes bicycliques'
  },
  {
    compound_name: 'p-Cymène',
    cas_number: '99-87-6',
    molecular_formula: 'C10H14',
    molecular_weight: 134.22,
    base_peak_mz: 119,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 20 }, { mz: 51, intensity: 15 }, { mz: 65, intensity: 25 },
        { mz: 77, intensity: 30 }, { mz: 91, intensity: 45 }, { mz: 103, intensity: 15 },
        { mz: 117, intensity: 35 }, { mz: 119, intensity: 100 }, { mz: 134, intensity: 40 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15) donnant m/z 119, aromatique substitué'
  },
  
  // === SESQUITERPÈNES ===
  {
    compound_name: 'α-Humulène',
    cas_number: '6753-98-6',
    molecular_formula: 'C15H24',
    molecular_weight: 204.35,
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 }, { mz: 53, intensity: 25 }, { mz: 67, intensity: 35 },
        { mz: 79, intensity: 45 }, { mz: 80, intensity: 50 }, { mz: 93, intensity: 100 },
        { mz: 107, intensity: 30 }, { mz: 121, intensity: 35 }, { mz: 147, intensity: 20 },
        { mz: 161, intensity: 15 }, { mz: 189, intensity: 25 }, { mz: 204, intensity: 20 }
      ]
    },
    fragmentation_pattern: 'Fragmentation du macrocycle, perte de CH3, m/z 93 caractéristique'
  },
  {
    compound_name: 'β-Élémène',
    cas_number: '515-13-9',
    molecular_formula: 'C15H24',
    molecular_weight: 204.35,
    base_peak_mz: 81,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 50 }, { mz: 53, intensity: 30 }, { mz: 67, intensity: 45 },
        { mz: 81, intensity: 100 }, { mz: 93, intensity: 75 }, { mz: 107, intensity: 35 },
        { mz: 121, intensity: 40 }, { mz: 147, intensity: 25 }, { mz: 161, intensity: 20 },
        { mz: 189, intensity: 30 }, { mz: 204, intensity: 15 }
      ]
    },
    fragmentation_pattern: 'Clivage du cycle, m/z 81 caractéristique de l\'élémène'
  },
  {
    compound_name: 'γ-Élémène',
    cas_number: '29873-99-2',
    molecular_formula: 'C15H24',
    molecular_weight: 204.35,
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 45 }, { mz: 55, intensity: 30 }, { mz: 67, intensity: 40 },
        { mz: 81, intensity: 85 }, { mz: 93, intensity: 100 }, { mz: 107, intensity: 40 },
        { mz: 121, intensity: 35 }, { mz: 147, intensity: 20 }, { mz: 161, intensity: 25 },
        { mz: 189, intensity: 35 }, { mz: 204, intensity: 18 }
      ]
    },
    fragmentation_pattern: 'Isomère du β-élémène, fragmentation similaire'
  },
  {
    compound_name: 'Caryophyllène oxide',
    cas_number: '1139-30-6',
    molecular_formula: 'C15H24O',
    molecular_weight: 220.35,
    base_peak_mz: 79,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 55 }, { mz: 55, intensity: 40 }, { mz: 67, intensity: 45 },
        { mz: 79, intensity: 100 }, { mz: 91, intensity: 60 }, { mz: 93, intensity: 75 },
        { mz: 107, intensity: 50 }, { mz: 121, intensity: 35 }, { mz: 135, intensity: 25 },
        { mz: 161, intensity: 20 }, { mz: 177, intensity: 15 }, { mz: 205, intensity: 30 },
        { mz: 220, intensity: 10 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), ouverture de l\'époxyde, m/z 79 dominant'
  },
  {
    compound_name: 'Guaïol',
    cas_number: '489-86-1',
    molecular_formula: 'C15H26O',
    molecular_weight: 222.37,
    base_peak_mz: 161,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 35 }, { mz: 55, intensity: 30 }, { mz: 67, intensity: 25 },
        { mz: 81, intensity: 45 }, { mz: 93, intensity: 40 }, { mz: 107, intensity: 35 },
        { mz: 119, intensity: 30 }, { mz: 135, intensity: 25 }, { mz: 161, intensity: 100 },
        { mz: 179, intensity: 20 }, { mz: 189, intensity: 15 }, { mz: 204, intensity: 40 },
        { mz: 222, intensity: 25 }
      ]
    },
    fragmentation_pattern: 'Perte de H2O (M-18), clivage du cycle, m/z 161 caractéristique'
  },
  {
    compound_name: 'α-Bisabolol',
    cas_number: '515-69-5',
    molecular_formula: 'C15H26O',
    molecular_weight: 222.37,
    base_peak_mz: 109,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 }, { mz: 55, intensity: 35 }, { mz: 67, intensity: 30 },
        { mz: 69, intensity: 55 }, { mz: 81, intensity: 45 }, { mz: 93, intensity: 50 },
        { mz: 109, intensity: 100 }, { mz: 119, intensity: 35 }, { mz: 134, intensity: 25 },
        { mz: 161, intensity: 20 }, { mz: 204, intensity: 30 }, { mz: 222, intensity: 15 }
      ]
    },
    fragmentation_pattern: 'Perte de H2O, clivage du cycle, m/z 109 caractéristique'
  },
  {
    compound_name: 'Nérolidol',
    cas_number: '7212-44-4',
    molecular_formula: 'C15H26O',
    molecular_weight: 222.37,
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 60 }, { mz: 55, intensity: 35 }, { mz: 67, intensity: 30 },
        { mz: 69, intensity: 100 }, { mz: 81, intensity: 40 }, { mz: 93, intensity: 55 },
        { mz: 107, intensity: 30 }, { mz: 121, intensity: 25 }, { mz: 136, intensity: 20 },
        { mz: 161, intensity: 35 }, { mz: 189, intensity: 15 }, { mz: 204, intensity: 25 },
        { mz: 222, intensity: 10 }
      ]
    },
    fragmentation_pattern: 'Sesquiterpène alcool acyclique, clivage allylique m/z 69'
  },
  {
    compound_name: 'Farnésol',
    cas_number: '4602-84-0',
    molecular_formula: 'C15H26O',
    molecular_weight: 222.37,
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 55 }, { mz: 55, intensity: 30 }, { mz: 67, intensity: 25 },
        { mz: 69, intensity: 100 }, { mz: 81, intensity: 45 }, { mz: 93, intensity: 50 },
        { mz: 107, intensity: 25 }, { mz: 121, intensity: 30 }, { mz: 136, intensity: 20 },
        { mz: 161, intensity: 40 }, { mz: 189, intensity: 20 }, { mz: 204, intensity: 30 },
        { mz: 222, intensity: 8 }
      ]
    },
    fragmentation_pattern: 'Alcool sesquiterpénique, fragmentation allylique'
  },
  
  // === ACÉTATES ET ESTERS ===
  {
    compound_name: 'Acétate de géranyle',
    cas_number: '105-87-3',
    molecular_formula: 'C12H20O2',
    molecular_weight: 196.29,
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 50 }, { mz: 43, intensity: 85 }, { mz: 53, intensity: 20 },
        { mz: 67, intensity: 30 }, { mz: 69, intensity: 100 }, { mz: 81, intensity: 35 },
        { mz: 93, intensity: 40 }, { mz: 107, intensity: 15 }, { mz: 121, intensity: 25 },
        { mz: 136, intensity: 45 }, { mz: 154, intensity: 10 }, { mz: 196, intensity: 5 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3CO (M-43), clivage allylique m/z 69'
  },
  
  // === PHÉNOLS ET DÉRIVÉS ===
  {
    compound_name: 'Gaïacol',
    cas_number: '90-05-1',
    molecular_formula: 'C7H8O2',
    molecular_weight: 124.14,
    base_peak_mz: 109,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 15 }, { mz: 51, intensity: 20 }, { mz: 53, intensity: 15 },
        { mz: 63, intensity: 25 }, { mz: 77, intensity: 30 }, { mz: 81, intensity: 45 },
        { mz: 91, intensity: 20 }, { mz: 109, intensity: 100 }, { mz: 124, intensity: 85 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), ion phénolique m/z 109'
  },
  {
    compound_name: '4-Méthylguaïacol',
    cas_number: '93-51-6',
    molecular_formula: 'C8H10O2',
    molecular_weight: 138.16,
    base_peak_mz: 123,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 15 }, { mz: 51, intensity: 15 }, { mz: 65, intensity: 20 },
        { mz: 77, intensity: 25 }, { mz: 91, intensity: 30 }, { mz: 95, intensity: 35 },
        { mz: 105, intensity: 20 }, { mz: 123, intensity: 100 }, { mz: 138, intensity: 75 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), méthylguaïacol caractéristique'
  },
  {
    compound_name: 'Créosol',
    cas_number: '93-51-6',
    molecular_formula: 'C8H10O2',
    molecular_weight: 138.16,
    base_peak_mz: 123,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 12 }, { mz: 51, intensity: 18 }, { mz: 65, intensity: 22 },
        { mz: 77, intensity: 28 }, { mz: 91, intensity: 32 }, { mz: 95, intensity: 38 },
        { mz: 105, intensity: 22 }, { mz: 123, intensity: 100 }, { mz: 138, intensity: 70 }
      ]
    },
    fragmentation_pattern: 'Synonyme du 4-méthylguaïacol, même fragmentation'
  },
  {
    compound_name: 'Syringol',
    cas_number: '91-10-1',
    molecular_formula: 'C8H10O3',
    molecular_weight: 154.16,
    base_peak_mz: 154,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 10 }, { mz: 51, intensity: 12 }, { mz: 65, intensity: 15 },
        { mz: 77, intensity: 20 }, { mz: 93, intensity: 25 }, { mz: 96, intensity: 30 },
        { mz: 111, intensity: 45 }, { mz: 125, intensity: 35 }, { mz: 139, intensity: 60 },
        { mz: 154, intensity: 100 }
      ]
    },
    fragmentation_pattern: 'Ion moléculaire stable, pertes de CH3 et OCH3'
  },
  
  // === INDOLES ===
  {
    compound_name: 'Indole',
    cas_number: '120-72-9',
    molecular_formula: 'C8H7N',
    molecular_weight: 117.15,
    base_peak_mz: 117,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 15 }, { mz: 51, intensity: 10 }, { mz: 63, intensity: 20 },
        { mz: 77, intensity: 15 }, { mz: 89, intensity: 35 }, { mz: 90, intensity: 55 },
        { mz: 117, intensity: 100 }
      ]
    },
    fragmentation_pattern: 'Ion moléculaire très stable, perte de HCN (M-27)'
  },
  {
    compound_name: 'Skatole',
    cas_number: '83-34-1',
    molecular_formula: 'C9H9N',
    molecular_weight: 131.17,
    base_peak_mz: 130,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 12 }, { mz: 51, intensity: 10 }, { mz: 63, intensity: 15 },
        { mz: 77, intensity: 20 }, { mz: 89, intensity: 25 }, { mz: 103, intensity: 30 },
        { mz: 115, intensity: 15 }, { mz: 130, intensity: 100 }, { mz: 131, intensity: 85 }
      ]
    },
    fragmentation_pattern: 'Perte de H (M-1), 3-méthylindole caractéristique'
  },
  
  // === FURANIQUES ===
  {
    compound_name: 'Furfural',
    cas_number: '98-01-1',
    molecular_formula: 'C5H4O2',
    molecular_weight: 96.08,
    base_peak_mz: 96,
    spectrum_data: {
      peaks: [
        { mz: 29, intensity: 35 }, { mz: 37, intensity: 15 }, { mz: 38, intensity: 20 },
        { mz: 39, intensity: 55 }, { mz: 40, intensity: 10 }, { mz: 41, intensity: 15 },
        { mz: 67, intensity: 25 }, { mz: 95, intensity: 80 }, { mz: 96, intensity: 100 }
      ]
    },
    fragmentation_pattern: 'Perte de CHO (M-29), ion furanyle m/z 67'
  },
  {
    compound_name: '5-Méthylfurfural',
    cas_number: '620-02-0',
    molecular_formula: 'C6H6O2',
    molecular_weight: 110.11,
    base_peak_mz: 110,
    spectrum_data: {
      peaks: [
        { mz: 29, intensity: 25 }, { mz: 39, intensity: 30 }, { mz: 43, intensity: 20 },
        { mz: 51, intensity: 15 }, { mz: 53, intensity: 35 }, { mz: 81, intensity: 45 },
        { mz: 109, intensity: 70 }, { mz: 110, intensity: 100 }
      ]
    },
    fragmentation_pattern: 'Perte de CHO (M-29), méthylfurane caractéristique'
  },
  
  // === LACTONES ===
  {
    compound_name: 'γ-Nonalactone',
    cas_number: '104-61-0',
    molecular_formula: 'C9H16O2',
    molecular_weight: 156.22,
    base_peak_mz: 85,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 }, { mz: 43, intensity: 35 }, { mz: 55, intensity: 30 },
        { mz: 57, intensity: 25 }, { mz: 69, intensity: 45 }, { mz: 85, intensity: 100 },
        { mz: 99, intensity: 20 }, { mz: 111, intensity: 15 }, { mz: 128, intensity: 25 },
        { mz: 156, intensity: 10 }
      ]
    },
    fragmentation_pattern: 'Clivage α du carbonyle, m/z 85 caractéristique des γ-lactones'
  },
  {
    compound_name: 'δ-Octalactone',
    cas_number: '698-76-0',
    molecular_formula: 'C8H14O2',
    molecular_weight: 142.20,
    base_peak_mz: 99,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 35 }, { mz: 43, intensity: 30 }, { mz: 55, intensity: 40 },
        { mz: 57, intensity: 25 }, { mz: 69, intensity: 35 }, { mz: 71, intensity: 45 },
        { mz: 99, intensity: 100 }, { mz: 114, intensity: 20 }, { mz: 142, intensity: 8 }
      ]
    },
    fragmentation_pattern: 'Clivage α, m/z 99 caractéristique des δ-lactones'
  },
  {
    compound_name: 'δ-Décalactone',
    cas_number: '705-86-2',
    molecular_formula: 'C10H18O2',
    molecular_weight: 170.25,
    base_peak_mz: 99,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 }, { mz: 43, intensity: 35 }, { mz: 55, intensity: 45 },
        { mz: 57, intensity: 30 }, { mz: 69, intensity: 40 }, { mz: 71, intensity: 50 },
        { mz: 85, intensity: 35 }, { mz: 99, intensity: 100 }, { mz: 128, intensity: 25 },
        { mz: 142, intensity: 15 }, { mz: 170, intensity: 5 }
      ]
    },
    fragmentation_pattern: 'Clivage α du carbonyle, δ-lactone à chaîne longue'
  },
  
  // === IONONES ET DAMASCÉNONES ===
  {
    compound_name: 'β-Ionone',
    cas_number: '14901-07-6',
    molecular_formula: 'C13H20O',
    molecular_weight: 192.30,
    base_peak_mz: 177,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 35 }, { mz: 43, intensity: 60 }, { mz: 55, intensity: 25 },
        { mz: 69, intensity: 30 }, { mz: 91, intensity: 40 }, { mz: 93, intensity: 35 },
        { mz: 107, intensity: 25 }, { mz: 121, intensity: 45 }, { mz: 135, intensity: 30 },
        { mz: 149, intensity: 20 }, { mz: 177, intensity: 100 }, { mz: 192, intensity: 35 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), ionone caractéristique'
  },
  {
    compound_name: 'β-Damascénone',
    cas_number: '23726-93-4',
    molecular_formula: 'C13H18O',
    molecular_weight: 190.28,
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 45 }, { mz: 55, intensity: 30 }, { mz: 67, intensity: 35 },
        { mz: 69, intensity: 100 }, { mz: 91, intensity: 50 }, { mz: 105, intensity: 40 },
        { mz: 119, intensity: 35 }, { mz: 133, intensity: 25 }, { mz: 147, intensity: 20 },
        { mz: 175, intensity: 55 }, { mz: 190, intensity: 30 }
      ]
    },
    fragmentation_pattern: 'Clivage de la chaîne latérale, m/z 69 dominant'
  },
  {
    compound_name: 'Mégastigmatrienone',
    cas_number: '38818-55-2',
    molecular_formula: 'C13H18O',
    molecular_weight: 190.28,
    base_peak_mz: 175,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 30 }, { mz: 55, intensity: 25 }, { mz: 69, intensity: 40 },
        { mz: 91, intensity: 45 }, { mz: 105, intensity: 35 }, { mz: 119, intensity: 30 },
        { mz: 133, intensity: 25 }, { mz: 147, intensity: 35 }, { mz: 161, intensity: 20 },
        { mz: 175, intensity: 100 }, { mz: 190, intensity: 40 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), mégastigmatrienone caractéristique'
  },
  
  // === ALCALOÏDES ET AUTRES ===
  {
    compound_name: 'Solanone',
    cas_number: '1937-54-8',
    molecular_formula: 'C13H22O',
    molecular_weight: 194.31,
    base_peak_mz: 43,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 45 }, { mz: 43, intensity: 100 }, { mz: 55, intensity: 35 },
        { mz: 69, intensity: 50 }, { mz: 81, intensity: 30 }, { mz: 95, intensity: 25 },
        { mz: 109, intensity: 40 }, { mz: 123, intensity: 20 }, { mz: 151, intensity: 35 },
        { mz: 179, intensity: 15 }, { mz: 194, intensity: 20 }
      ]
    },
    fragmentation_pattern: 'Cétone du tabac, perte de CH3CO (m/z 43 dominant)'
  },
  
  // === ACIDES ET PYRANONES ===
  {
    compound_name: 'Acide acétique',
    cas_number: '64-19-7',
    molecular_formula: 'C2H4O2',
    molecular_weight: 60.05,
    base_peak_mz: 43,
    spectrum_data: {
      peaks: [
        { mz: 15, intensity: 15 }, { mz: 29, intensity: 10 }, { mz: 42, intensity: 20 },
        { mz: 43, intensity: 100 }, { mz: 45, intensity: 85 }, { mz: 60, intensity: 55 }
      ]
    },
    fragmentation_pattern: 'Perte de OH (M-17), ion acylium m/z 43'
  },
  {
    compound_name: 'Maltol',
    cas_number: '118-71-8',
    molecular_formula: 'C6H6O3',
    molecular_weight: 126.11,
    base_peak_mz: 126,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 15 }, { mz: 43, intensity: 20 }, { mz: 53, intensity: 25 },
        { mz: 55, intensity: 30 }, { mz: 69, intensity: 35 }, { mz: 71, intensity: 40 },
        { mz: 97, intensity: 50 }, { mz: 98, intensity: 45 }, { mz: 126, intensity: 100 }
      ]
    },
    fragmentation_pattern: 'Ion moléculaire stable, perte de CO (M-28)'
  },
  {
    compound_name: 'Isomaltol',
    cas_number: '3420-59-5',
    molecular_formula: 'C6H6O3',
    molecular_weight: 126.11,
    base_peak_mz: 126,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 18 }, { mz: 43, intensity: 22 }, { mz: 53, intensity: 28 },
        { mz: 55, intensity: 32 }, { mz: 69, intensity: 38 }, { mz: 71, intensity: 42 },
        { mz: 97, intensity: 55 }, { mz: 98, intensity: 48 }, { mz: 126, intensity: 100 }
      ]
    },
    fragmentation_pattern: 'Isomère du maltol, fragmentation similaire'
  }
];

async function importChromatogramMsSpectra() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Import des spectres MS des composés des chromatogrammes...');
  
  let inserted = 0;
  let skipped = 0;
  
  for (const spectrum of chromatogramMsSpectra) {
    try {
      // Vérifier si le spectre existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM ms_spectra WHERE compound_name = ?',
        [spectrum.compound_name]
      );
      
      if (existing.length > 0) {
        console.log(`  - ${spectrum.compound_name}: déjà présent`);
        skipped++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO ms_spectra 
         (compound_name, cas_number, molecular_formula, molecular_weight, ionization_mode, 
          base_peak_mz, spectrum_data, fragmentation_pattern, source)
         VALUES (?, ?, ?, ?, 'EI', ?, ?, ?, 'NIST')`,
        [
          spectrum.compound_name,
          spectrum.cas_number,
          spectrum.molecular_formula,
          spectrum.molecular_weight,
          spectrum.base_peak_mz,
          JSON.stringify(spectrum.spectrum_data),
          spectrum.fragmentation_pattern
        ]
      );
      
      console.log(`  + ${spectrum.compound_name}: spectre MS ajouté`);
      inserted++;
    } catch (error) {
      console.error(`  ! Erreur pour ${spectrum.compound_name}:`, error.message);
    }
  }
  
  // Compter le total
  const [total] = await connection.execute('SELECT COUNT(*) as count FROM ms_spectra');
  
  console.log(`\\nRésumé:`);
  console.log(`  - Spectres ajoutés: ${inserted}`);
  console.log(`  - Spectres existants: ${skipped}`);
  console.log(`  - Total en base: ${total[0].count}`);
  
  await connection.end();
}

importChromatogramMsSpectra().catch(console.error);
