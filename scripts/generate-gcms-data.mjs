import mysql from 'mysql2/promise';

// Données de chromatographie GC-MS pour les landraces de tabac
const gcmsData = [
  {
    landrace_name: 'Basma',
    analysis_date: '2024-03-15',
    oven_program: '60°C (2min) → 10°C/min → 280°C (5min)',
    total_peaks: 127,
    identified_peaks: 89,
    notes: 'Profil floral-miellé caractéristique des tabacs orientaux',
    peaks: [
      { retention_time: 5.23, compound_name: 'α-Pinène', cas_number: '80-56-8', peak_area: 125000, match_quality: 95, concentration_ppm: 45.2 },
      { retention_time: 6.12, compound_name: 'β-Pinène', cas_number: '127-91-3', peak_area: 89000, match_quality: 93, concentration_ppm: 32.1 },
      { retention_time: 7.45, compound_name: 'Myrcène', cas_number: '123-35-3', peak_area: 210000, match_quality: 97, concentration_ppm: 75.8 },
      { retention_time: 8.91, compound_name: 'Limonène', cas_number: '138-86-3', peak_area: 345000, match_quality: 98, concentration_ppm: 124.5 },
      { retention_time: 10.34, compound_name: 'Linalol', cas_number: '78-70-6', peak_area: 567000, match_quality: 96, concentration_ppm: 204.7 },
      { retention_time: 12.56, compound_name: 'β-Caryophyllène', cas_number: '87-44-5', peak_area: 234000, match_quality: 94, concentration_ppm: 84.5 },
      { retention_time: 14.23, compound_name: 'α-Humulène', cas_number: '6753-98-6', peak_area: 156000, match_quality: 92, concentration_ppm: 56.3 },
      { retention_time: 16.78, compound_name: 'Géraniol', cas_number: '106-24-1', peak_area: 423000, match_quality: 95, concentration_ppm: 152.7 },
      { retention_time: 18.45, compound_name: 'Nérol', cas_number: '106-25-2', peak_area: 312000, match_quality: 91, concentration_ppm: 112.6 },
      { retention_time: 20.12, compound_name: 'β-Damascénone', cas_number: '23726-93-4', peak_area: 89000, match_quality: 88, concentration_ppm: 32.1 }
    ]
  },
  {
    landrace_name: 'Latakia',
    analysis_date: '2024-03-18',
    oven_program: '60°C (2min) → 10°C/min → 280°C (5min)',
    total_peaks: 156,
    identified_peaks: 112,
    notes: 'Profil cuir-fumé caractéristique du séchage au feu',
    peaks: [
      { retention_time: 5.18, compound_name: 'α-Pinène', cas_number: '80-56-8', peak_area: 78000, match_quality: 94, concentration_ppm: 28.1 },
      { retention_time: 6.08, compound_name: 'Camphène', cas_number: '79-92-5', peak_area: 145000, match_quality: 92, concentration_ppm: 52.3 },
      { retention_time: 7.89, compound_name: 'p-Cymène', cas_number: '99-87-6', peak_area: 234000, match_quality: 96, concentration_ppm: 84.5 },
      { retention_time: 9.45, compound_name: 'Eucalyptol', cas_number: '470-82-6', peak_area: 312000, match_quality: 97, concentration_ppm: 112.6 },
      { retention_time: 11.23, compound_name: 'Gaïacol', cas_number: '90-05-1', peak_area: 567000, match_quality: 95, concentration_ppm: 204.7 },
      { retention_time: 13.67, compound_name: '4-Méthylguaïacol', cas_number: '93-51-6', peak_area: 489000, match_quality: 94, concentration_ppm: 176.5 },
      { retention_time: 15.34, compound_name: 'Créosol', cas_number: '93-51-6', peak_area: 345000, match_quality: 93, concentration_ppm: 124.5 },
      { retention_time: 17.89, compound_name: 'Syringol', cas_number: '91-10-1', peak_area: 278000, match_quality: 91, concentration_ppm: 100.3 },
      { retention_time: 19.56, compound_name: 'β-Caryophyllène', cas_number: '87-44-5', peak_area: 156000, match_quality: 90, concentration_ppm: 56.3 },
      { retention_time: 21.23, compound_name: 'Caryophyllène oxide', cas_number: '1139-30-6', peak_area: 234000, match_quality: 89, concentration_ppm: 84.5 }
    ]
  },
  {
    landrace_name: 'Perique',
    analysis_date: '2024-03-22',
    oven_program: '60°C (2min) → 8°C/min → 300°C (8min)',
    total_peaks: 189,
    identified_peaks: 134,
    notes: 'Profil fruité-fermenté unique dû à la fermentation anaérobie de 12 mois',
    peaks: [
      { retention_time: 8.34, compound_name: 'Acide acétique', cas_number: '64-19-7', peak_area: 678000, match_quality: 98, concentration_ppm: 244.7 },
      { retention_time: 10.56, compound_name: 'δ-Octalactone', cas_number: '698-76-0', peak_area: 456000, match_quality: 95, concentration_ppm: 164.6 },
      { retention_time: 12.78, compound_name: 'γ-Nonalactone', cas_number: '104-61-0', peak_area: 389000, match_quality: 94, concentration_ppm: 140.4 },
      { retention_time: 14.23, compound_name: 'δ-Décalactone', cas_number: '705-86-2', peak_area: 523000, match_quality: 96, concentration_ppm: 188.7 },
      { retention_time: 16.45, compound_name: 'β-Damascénone', cas_number: '23726-93-4', peak_area: 345000, match_quality: 93, concentration_ppm: 124.5 },
      { retention_time: 18.67, compound_name: 'β-Ionone', cas_number: '14901-07-6', peak_area: 267000, match_quality: 92, concentration_ppm: 96.4 },
      { retention_time: 20.12, compound_name: 'Indole', cas_number: '120-72-9', peak_area: 189000, match_quality: 91, concentration_ppm: 68.2 },
      { retention_time: 22.34, compound_name: 'Skatole', cas_number: '83-34-1', peak_area: 145000, match_quality: 89, concentration_ppm: 52.3 },
      { retention_time: 24.56, compound_name: 'Acétate de géranyle', cas_number: '105-87-3', peak_area: 234000, match_quality: 90, concentration_ppm: 84.5 },
      { retention_time: 26.78, compound_name: 'Farnésol', cas_number: '4602-84-0', peak_area: 178000, match_quality: 88, concentration_ppm: 64.2 }
    ]
  },
  {
    landrace_name: 'Virginia',
    analysis_date: '2024-03-25',
    oven_program: '60°C (2min) → 10°C/min → 280°C (5min)',
    total_peaks: 98,
    identified_peaks: 72,
    notes: 'Profil sucré-caramélisé caractéristique du séchage flue-cured',
    peaks: [
      { retention_time: 5.45, compound_name: 'Furfural', cas_number: '98-01-1', peak_area: 345000, match_quality: 97, concentration_ppm: 124.5 },
      { retention_time: 7.23, compound_name: '5-Méthylfurfural', cas_number: '620-02-0', peak_area: 289000, match_quality: 95, concentration_ppm: 104.3 },
      { retention_time: 9.12, compound_name: 'Maltol', cas_number: '118-71-8', peak_area: 456000, match_quality: 96, concentration_ppm: 164.6 },
      { retention_time: 11.34, compound_name: 'Isomaltol', cas_number: '3420-59-5', peak_area: 234000, match_quality: 93, concentration_ppm: 84.5 },
      { retention_time: 13.56, compound_name: 'Solanone', cas_number: '1937-54-8', peak_area: 567000, match_quality: 94, concentration_ppm: 204.7 },
      { retention_time: 15.78, compound_name: 'β-Damascénone', cas_number: '23726-93-4', peak_area: 312000, match_quality: 92, concentration_ppm: 112.6 },
      { retention_time: 17.23, compound_name: 'Mégastigmatrienone', cas_number: '38818-55-2', peak_area: 178000, match_quality: 89, concentration_ppm: 64.2 },
      { retention_time: 19.45, compound_name: 'Limonène', cas_number: '138-86-3', peak_area: 145000, match_quality: 91, concentration_ppm: 52.3 },
      { retention_time: 21.67, compound_name: 'Linalol', cas_number: '78-70-6', peak_area: 234000, match_quality: 90, concentration_ppm: 84.5 },
      { retention_time: 23.89, compound_name: 'Géraniol', cas_number: '106-24-1', peak_area: 189000, match_quality: 88, concentration_ppm: 68.2 }
    ]
  },
  {
    landrace_name: 'Corojo Original',
    analysis_date: '2024-04-02',
    oven_program: '60°C (2min) → 10°C/min → 280°C (5min)',
    total_peaks: 134,
    identified_peaks: 98,
    notes: 'Profil épicé-terreux caractéristique des tabacs cubains',
    peaks: [
      { retention_time: 5.67, compound_name: 'α-Pinène', cas_number: '80-56-8', peak_area: 167000, match_quality: 95, concentration_ppm: 60.3 },
      { retention_time: 7.89, compound_name: 'β-Pinène', cas_number: '127-91-3', peak_area: 134000, match_quality: 93, concentration_ppm: 48.4 },
      { retention_time: 9.45, compound_name: 'Myrcène', cas_number: '123-35-3', peak_area: 289000, match_quality: 96, concentration_ppm: 104.3 },
      { retention_time: 11.23, compound_name: 'β-Caryophyllène', cas_number: '87-44-5', peak_area: 456000, match_quality: 97, concentration_ppm: 164.6 },
      { retention_time: 13.67, compound_name: 'α-Humulène', cas_number: '6753-98-6', peak_area: 345000, match_quality: 95, concentration_ppm: 124.5 },
      { retention_time: 15.89, compound_name: 'Caryophyllène oxide', cas_number: '1139-30-6', peak_area: 234000, match_quality: 92, concentration_ppm: 84.5 },
      { retention_time: 17.34, compound_name: 'Guaïol', cas_number: '489-86-1', peak_area: 178000, match_quality: 90, concentration_ppm: 64.2 },
      { retention_time: 19.56, compound_name: 'α-Bisabolol', cas_number: '515-69-5', peak_area: 156000, match_quality: 89, concentration_ppm: 56.3 },
      { retention_time: 21.78, compound_name: 'Farnésène', cas_number: '502-61-4', peak_area: 123000, match_quality: 87, concentration_ppm: 44.4 },
      { retention_time: 23.45, compound_name: 'Nérolidol', cas_number: '7212-44-4', peak_area: 189000, match_quality: 88, concentration_ppm: 68.2 }
    ]
  },
  {
    landrace_name: 'Cameroun',
    analysis_date: '2024-04-08',
    oven_program: '60°C (2min) → 10°C/min → 280°C (5min)',
    total_peaks: 112,
    identified_peaks: 84,
    notes: 'Profil épicé-poivré caractéristique des tabacs africains',
    peaks: [
      { retention_time: 6.23, compound_name: 'α-Pinène', cas_number: '80-56-8', peak_area: 145000, match_quality: 94, concentration_ppm: 52.3 },
      { retention_time: 8.45, compound_name: 'Limonène', cas_number: '138-86-3', peak_area: 234000, match_quality: 96, concentration_ppm: 84.5 },
      { retention_time: 10.67, compound_name: 'β-Caryophyllène', cas_number: '87-44-5', peak_area: 567000, match_quality: 98, concentration_ppm: 204.7 },
      { retention_time: 12.89, compound_name: 'α-Humulène', cas_number: '6753-98-6', peak_area: 389000, match_quality: 95, concentration_ppm: 140.4 },
      { retention_time: 14.34, compound_name: 'β-Élémène', cas_number: '515-13-9', peak_area: 234000, match_quality: 92, concentration_ppm: 84.5 },
      { retention_time: 16.56, compound_name: 'γ-Élémène', cas_number: '29873-99-2', peak_area: 178000, match_quality: 90, concentration_ppm: 64.2 },
      { retention_time: 18.78, compound_name: 'Caryophyllène oxide', cas_number: '1139-30-6', peak_area: 289000, match_quality: 93, concentration_ppm: 104.3 },
      { retention_time: 20.23, compound_name: 'Guaïol', cas_number: '489-86-1', peak_area: 156000, match_quality: 89, concentration_ppm: 56.3 },
      { retention_time: 22.45, compound_name: 'α-Bisabolol', cas_number: '515-69-5', peak_area: 134000, match_quality: 87, concentration_ppm: 48.4 },
      { retention_time: 24.67, compound_name: 'Farnésol', cas_number: '4602-84-0', peak_area: 112000, match_quality: 86, concentration_ppm: 40.4 }
    ]
  }
];

async function main() {
  console.log('🔬 Génération des données de chromatographie GC-MS...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  let chromatogramsInserted = 0;
  let peaksInserted = 0;
  
  for (const data of gcmsData) {
    try {
      // Insérer le chromatogramme
      const [result] = await connection.execute(
        `INSERT INTO gcms_chromatograms 
         (landrace_name, analysis_date, oven_program, total_peaks, identified_peaks, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.landrace_name, data.analysis_date, data.oven_program, data.total_peaks, data.identified_peaks, data.notes]
      );
      
      const chromatogramId = result.insertId;
      chromatogramsInserted++;
      console.log(`✅ Chromatogramme ajouté: ${data.landrace_name}`);
      
      // Insérer les pics
      for (const peak of data.peaks) {
        await connection.execute(
          `INSERT INTO gcms_peaks 
           (chromatogram_id, retention_time, compound_name, cas_number, peak_area, match_quality, concentration_ppm)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [chromatogramId, peak.retention_time, peak.compound_name, peak.cas_number, peak.peak_area, peak.match_quality, peak.concentration_ppm]
        );
        peaksInserted++;
      }
      console.log(`   → ${data.peaks.length} pics ajoutés`);
      
    } catch (error) {
      console.error(`❌ Erreur pour ${data.landrace_name}:`, error.message);
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`   - Chromatogrammes ajoutés: ${chromatogramsInserted}`);
  console.log(`   - Pics ajoutés: ${peaksInserted}`);
  console.log('✅ Génération terminée!');
  
  await connection.end();
}

main().catch(console.error);
