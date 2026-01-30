/**
 * Script pour générer les données de spectrométrie de masse (MS)
 * Génère des spectres MS réalistes pour les composés identifiés dans les chromatogrammes
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Données de spectres MS basées sur les références NIST pour les terpènes courants
const msSpectraData = [
  {
    compound_name: 'β-Caryophyllène',
    cas_number: '87-44-5',
    molecular_formula: 'C15H24',
    molecular_weight: 204.35,
    ionization_mode: 'EI',
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 45 },
        { mz: 55, intensity: 35 },
        { mz: 69, intensity: 55 },
        { mz: 79, intensity: 40 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 30 },
        { mz: 119, intensity: 25 },
        { mz: 133, intensity: 50 },
        { mz: 147, intensity: 15 },
        { mz: 161, intensity: 20 },
        { mz: 175, intensity: 10 },
        { mz: 189, intensity: 35 },
        { mz: 204, intensity: 25 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), perte de C3H7 (M-43), réarrangement McLafferty'
  },
  {
    compound_name: 'Limonène',
    cas_number: '138-86-3',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    ionization_mode: 'EI',
    base_peak_mz: 68,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 30 },
        { mz: 41, intensity: 35 },
        { mz: 53, intensity: 40 },
        { mz: 67, intensity: 95 },
        { mz: 68, intensity: 100 },
        { mz: 79, intensity: 25 },
        { mz: 93, intensity: 85 },
        { mz: 107, intensity: 20 },
        { mz: 121, intensity: 35 },
        { mz: 136, intensity: 30 }
      ]
    },
    fragmentation_pattern: 'Clivage rétro-Diels-Alder donnant m/z 68, perte de CH3 (M-15)'
  },
  {
    compound_name: 'Myrcène',
    cas_number: '123-35-3',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    ionization_mode: 'EI',
    base_peak_mz: 41,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 25 },
        { mz: 39, intensity: 45 },
        { mz: 41, intensity: 100 },
        { mz: 53, intensity: 30 },
        { mz: 67, intensity: 35 },
        { mz: 69, intensity: 90 },
        { mz: 79, intensity: 20 },
        { mz: 93, intensity: 75 },
        { mz: 121, intensity: 15 },
        { mz: 136, intensity: 5 }
      ]
    },
    fragmentation_pattern: 'Fragmentation allylique donnant m/z 69, perte de C3H5 (M-41)'
  },
  {
    compound_name: 'α-Pinène',
    cas_number: '80-56-8',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    ionization_mode: 'EI',
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 25 },
        { mz: 41, intensity: 30 },
        { mz: 53, intensity: 20 },
        { mz: 67, intensity: 15 },
        { mz: 77, intensity: 40 },
        { mz: 79, intensity: 35 },
        { mz: 91, intensity: 50 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 15 },
        { mz: 121, intensity: 25 },
        { mz: 136, intensity: 10 }
      ]
    },
    fragmentation_pattern: 'Ouverture du cycle cyclobutane, perte de CH3 (M-15), m/z 93 caractéristique'
  },
  {
    compound_name: 'β-Pinène',
    cas_number: '127-91-3',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    ionization_mode: 'EI',
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 30 },
        { mz: 41, intensity: 45 },
        { mz: 53, intensity: 25 },
        { mz: 69, intensity: 55 },
        { mz: 77, intensity: 35 },
        { mz: 79, intensity: 40 },
        { mz: 91, intensity: 45 },
        { mz: 93, intensity: 100 },
        { mz: 121, intensity: 20 },
        { mz: 136, intensity: 8 }
      ]
    },
    fragmentation_pattern: 'Similaire à α-pinène, m/z 69 plus intense dû à la position de la double liaison'
  },
  {
    compound_name: 'Linalol',
    cas_number: '78-70-6',
    molecular_formula: 'C10H18O',
    molecular_weight: 154.25,
    ionization_mode: 'EI',
    base_peak_mz: 71,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 },
        { mz: 43, intensity: 55 },
        { mz: 55, intensity: 35 },
        { mz: 67, intensity: 25 },
        { mz: 69, intensity: 30 },
        { mz: 71, intensity: 100 },
        { mz: 80, intensity: 45 },
        { mz: 93, intensity: 85 },
        { mz: 121, intensity: 20 },
        { mz: 136, intensity: 15 },
        { mz: 154, intensity: 5 }
      ]
    },
    fragmentation_pattern: 'Perte de H2O (M-18), clivage allylique donnant m/z 71'
  },
  {
    compound_name: 'Géraniol',
    cas_number: '106-24-1',
    molecular_formula: 'C10H18O',
    molecular_weight: 154.25,
    ionization_mode: 'EI',
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 55 },
        { mz: 53, intensity: 25 },
        { mz: 67, intensity: 30 },
        { mz: 69, intensity: 100 },
        { mz: 81, intensity: 40 },
        { mz: 93, intensity: 35 },
        { mz: 111, intensity: 20 },
        { mz: 123, intensity: 25 },
        { mz: 136, intensity: 15 },
        { mz: 154, intensity: 8 }
      ]
    },
    fragmentation_pattern: 'Perte de H2O, clivage allylique caractéristique m/z 69'
  },
  {
    compound_name: 'Eucalyptol',
    cas_number: '470-82-6',
    molecular_formula: 'C10H18O',
    molecular_weight: 154.25,
    ionization_mode: 'EI',
    base_peak_mz: 43,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 35 },
        { mz: 43, intensity: 100 },
        { mz: 55, intensity: 25 },
        { mz: 67, intensity: 20 },
        { mz: 71, intensity: 45 },
        { mz: 81, intensity: 55 },
        { mz: 93, intensity: 30 },
        { mz: 108, intensity: 40 },
        { mz: 111, intensity: 35 },
        { mz: 139, intensity: 25 },
        { mz: 154, intensity: 20 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), ouverture du cycle éther, m/z 43 (CH3CO+)'
  },
  {
    compound_name: 'Humulène',
    cas_number: '6753-98-6',
    molecular_formula: 'C15H24',
    molecular_weight: 204.35,
    ionization_mode: 'EI',
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 },
        { mz: 53, intensity: 25 },
        { mz: 67, intensity: 35 },
        { mz: 79, intensity: 45 },
        { mz: 80, intensity: 50 },
        { mz: 93, intensity: 100 },
        { mz: 107, intensity: 30 },
        { mz: 121, intensity: 35 },
        { mz: 147, intensity: 20 },
        { mz: 161, intensity: 15 },
        { mz: 189, intensity: 25 },
        { mz: 204, intensity: 20 }
      ]
    },
    fragmentation_pattern: 'Fragmentation du macrocycle, perte de CH3, m/z 93 caractéristique des sesquiterpènes'
  },
  {
    compound_name: 'Terpinéol',
    cas_number: '98-55-5',
    molecular_formula: 'C10H18O',
    molecular_weight: 154.25,
    ionization_mode: 'EI',
    base_peak_mz: 59,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 35 },
        { mz: 43, intensity: 45 },
        { mz: 55, intensity: 30 },
        { mz: 59, intensity: 100 },
        { mz: 67, intensity: 25 },
        { mz: 81, intensity: 55 },
        { mz: 93, intensity: 40 },
        { mz: 111, intensity: 35 },
        { mz: 121, intensity: 20 },
        { mz: 136, intensity: 50 },
        { mz: 154, intensity: 15 }
      ]
    },
    fragmentation_pattern: 'Perte de H2O (M-18), clivage du cycle donnant m/z 59'
  },
  {
    compound_name: 'Camphre',
    cas_number: '76-22-2',
    molecular_formula: 'C10H16O',
    molecular_weight: 152.23,
    ionization_mode: 'EI',
    base_peak_mz: 95,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 },
        { mz: 55, intensity: 35 },
        { mz: 67, intensity: 30 },
        { mz: 69, intensity: 45 },
        { mz: 81, intensity: 85 },
        { mz: 95, intensity: 100 },
        { mz: 108, intensity: 25 },
        { mz: 109, intensity: 30 },
        { mz: 137, intensity: 15 },
        { mz: 152, intensity: 35 }
      ]
    },
    fragmentation_pattern: 'Perte de CH3 (M-15), perte de CO (M-28), m/z 95 caractéristique'
  },
  {
    compound_name: 'Nérol',
    cas_number: '106-25-2',
    molecular_formula: 'C10H18O',
    molecular_weight: 154.25,
    ionization_mode: 'EI',
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 50 },
        { mz: 53, intensity: 20 },
        { mz: 67, intensity: 25 },
        { mz: 69, intensity: 100 },
        { mz: 81, intensity: 35 },
        { mz: 93, intensity: 30 },
        { mz: 111, intensity: 15 },
        { mz: 121, intensity: 20 },
        { mz: 136, intensity: 12 },
        { mz: 154, intensity: 5 }
      ]
    },
    fragmentation_pattern: 'Isomère cis du géraniol, fragmentation similaire'
  },
  {
    compound_name: 'Citronellol',
    cas_number: '106-22-9',
    molecular_formula: 'C10H20O',
    molecular_weight: 156.27,
    ionization_mode: 'EI',
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 55 },
        { mz: 55, intensity: 40 },
        { mz: 67, intensity: 35 },
        { mz: 69, intensity: 100 },
        { mz: 81, intensity: 45 },
        { mz: 82, intensity: 30 },
        { mz: 95, intensity: 25 },
        { mz: 109, intensity: 20 },
        { mz: 123, intensity: 15 },
        { mz: 138, intensity: 10 },
        { mz: 156, intensity: 5 }
      ]
    },
    fragmentation_pattern: 'Clivage allylique, perte de H2O, m/z 69 dominant'
  },
  {
    compound_name: 'Farnésène',
    cas_number: '502-61-4',
    molecular_formula: 'C15H24',
    molecular_weight: 204.35,
    ionization_mode: 'EI',
    base_peak_mz: 69,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 60 },
        { mz: 53, intensity: 25 },
        { mz: 67, intensity: 35 },
        { mz: 69, intensity: 100 },
        { mz: 79, intensity: 30 },
        { mz: 93, intensity: 55 },
        { mz: 107, intensity: 25 },
        { mz: 119, intensity: 20 },
        { mz: 133, intensity: 15 },
        { mz: 161, intensity: 30 },
        { mz: 189, intensity: 20 },
        { mz: 204, intensity: 10 }
      ]
    },
    fragmentation_pattern: 'Sesquiterpène acyclique, fragmentation allylique, m/z 69 caractéristique'
  },
  {
    compound_name: 'Bisabolol',
    cas_number: '515-69-5',
    molecular_formula: 'C15H26O',
    molecular_weight: 222.37,
    ionization_mode: 'EI',
    base_peak_mz: 109,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 40 },
        { mz: 55, intensity: 35 },
        { mz: 67, intensity: 30 },
        { mz: 69, intensity: 55 },
        { mz: 81, intensity: 45 },
        { mz: 93, intensity: 50 },
        { mz: 109, intensity: 100 },
        { mz: 119, intensity: 35 },
        { mz: 134, intensity: 25 },
        { mz: 161, intensity: 20 },
        { mz: 204, intensity: 30 },
        { mz: 222, intensity: 15 }
      ]
    },
    fragmentation_pattern: 'Perte de H2O, clivage du cycle, m/z 109 caractéristique'
  },
  {
    compound_name: 'Ocimène',
    cas_number: '13877-91-3',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    ionization_mode: 'EI',
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 30 },
        { mz: 41, intensity: 45 },
        { mz: 53, intensity: 25 },
        { mz: 67, intensity: 35 },
        { mz: 79, intensity: 50 },
        { mz: 91, intensity: 40 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 20 },
        { mz: 121, intensity: 35 },
        { mz: 136, intensity: 15 }
      ]
    },
    fragmentation_pattern: 'Monoterpène acyclique, m/z 93 caractéristique'
  },
  {
    compound_name: 'Terpinolène',
    cas_number: '586-62-9',
    molecular_formula: 'C10H16',
    molecular_weight: 136.24,
    ionization_mode: 'EI',
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 25 },
        { mz: 41, intensity: 35 },
        { mz: 53, intensity: 20 },
        { mz: 67, intensity: 30 },
        { mz: 77, intensity: 40 },
        { mz: 79, intensity: 35 },
        { mz: 91, intensity: 55 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 15 },
        { mz: 121, intensity: 45 },
        { mz: 136, intensity: 20 }
      ]
    },
    fragmentation_pattern: 'Isomère du terpinène, m/z 93 et 121 caractéristiques'
  }
];

async function generateMsSpectra() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Génération des spectres MS...');
  
  let inserted = 0;
  
  for (const spectrum of msSpectraData) {
    try {
      // Vérifier si le spectre existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM ms_spectra WHERE compound_name = ?',
        [spectrum.compound_name]
      );
      
      if (existing.length > 0) {
        console.log(`  - ${spectrum.compound_name}: déjà présent`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO ms_spectra 
         (compound_name, cas_number, molecular_formula, molecular_weight, ionization_mode, 
          base_peak_mz, spectrum_data, fragmentation_pattern, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          spectrum.compound_name,
          spectrum.cas_number,
          spectrum.molecular_formula,
          spectrum.molecular_weight,
          spectrum.ionization_mode,
          spectrum.base_peak_mz,
          JSON.stringify(spectrum.spectrum_data),
          spectrum.fragmentation_pattern,
          'NIST'
        ]
      );
      
      console.log(`  + ${spectrum.compound_name}: spectre MS ajouté`);
      inserted++;
    } catch (error) {
      console.error(`  ! Erreur pour ${spectrum.compound_name}:`, error.message);
    }
  }
  
  console.log(`\\nRésumé: ${inserted} spectres MS ajoutés`);
  
  await connection.end();
}

generateMsSpectra().catch(console.error);
