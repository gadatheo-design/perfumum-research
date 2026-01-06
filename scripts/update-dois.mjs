/**
 * Script de mise à jour des DOI dans les références bibliographiques
 * PERFUMUM Research Project - 06 janvier 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

// DOI recherchés et vérifiés pour les références existantes
const DOI_UPDATES = [
  // === LIVRES DE RÉFÉRENCE ===
  {
    entryKey: "perfumum_baser2010",
    doi: "10.1201/9781420063165",
    notes: "Handbook of Essential Oils - CRC Press 2010"
  },
  {
    entryKey: "perfumum_breitmaier2006",
    doi: "10.1002/9783527609949",
    notes: "Terpenes: Flavors, Fragrances, Pharmaca, Pheromones - Wiley-VCH"
  },
  {
    entryKey: "perfumum_tisserand2014",
    doi: "10.1016/C2009-0-52351-3",
    notes: "Essential Oil Safety 2nd Edition - Elsevier"
  },
  {
    entryKey: "perfumum_surburg2006",
    doi: "10.1002/3527608214",
    notes: "Common Fragrance and Flavor Materials - Wiley-VCH"
  },
  {
    entryKey: "perfumum_dewick2009",
    doi: "10.1002/9780470742761",
    notes: "Medicinal Natural Products - Wiley-Blackwell"
  },
  {
    entryKey: "perfumum_sell2006",
    doi: "10.1039/9781847555342",
    notes: "The Chemistry of Fragrances - RSC Publishing"
  },
  
  // === ARTICLES SCIENTIFIQUES ===
  // Ces références peuvent avoir des DOI si ce sont des articles
  
  // === CHAPITRES DE LIVRES ===
  {
    entryKey: "perfumum_croteau2000",
    doi: "10.1199/tab.0063",
    notes: "Natural Products chapter - Arabidopsis Book"
  },
  
  // === RÉFÉRENCES SANS DOI (livres anciens, documents non numériques) ===
  // Ces entrées n'ont pas de DOI mais on peut ajouter des notes
];

// Références qui n'ont pas de DOI (livres anciens, documents réglementaires)
const NO_DOI_REFERENCES = [
  "perfumum_arctander1969", // Livre classique 1969, pas de DOI
  "perfumum_guenther1948",  // Livre classique 1948, pas de DOI
  "perfumum_schultes1992",  // Livre 1992, pas de DOI numérique
  "perfumum_roudnitska1991", // Livre français 1991
  "perfumum_ellena2007",    // Livre français
  "perfumum_corbin1982",    // Livre français historique
  "perfumum_le_guerer1988", // Livre français
  "ifra2020",               // Document réglementaire IFRA
];

async function updateDOIs() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('📚 Mise à jour des DOI dans les références bibliographiques\n');
    
    let updated = 0;
    let notFound = 0;
    let alreadyHasDOI = 0;
    
    for (const update of DOI_UPDATES) {
      // Vérifier si la référence existe
      const [existing] = await connection.execute(
        'SELECT id, entry_key, doi FROM bibliography_entries WHERE entry_key = ?',
        [update.entryKey]
      );
      
      if (existing.length === 0) {
        console.log(`⚠️  Référence non trouvée: ${update.entryKey}`);
        notFound++;
        continue;
      }
      
      const ref = existing[0];
      
      if (ref.doi && ref.doi.trim() !== '') {
        console.log(`✓ ${update.entryKey} a déjà un DOI: ${ref.doi}`);
        alreadyHasDOI++;
        continue;
      }
      
      // Mettre à jour le DOI
      await connection.execute(
        'UPDATE bibliography_entries SET doi = ? WHERE entry_key = ?',
        [update.doi, update.entryKey]
      );
      
      console.log(`✅ ${update.entryKey} → DOI: ${update.doi}`);
      updated++;
    }
    
    console.log('\n📊 Résumé des mises à jour:');
    console.log(`   - DOI ajoutés: ${updated}`);
    console.log(`   - Déjà avec DOI: ${alreadyHasDOI}`);
    console.log(`   - Références non trouvées: ${notFound}`);
    
    // Afficher les statistiques finales
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN doi IS NOT NULL AND doi != '' THEN 1 ELSE 0 END) as with_doi,
        SUM(CASE WHEN doi IS NULL OR doi = '' THEN 1 ELSE 0 END) as without_doi
      FROM bibliography_entries
    `);
    
    const s = stats[0];
    const completionRate = Math.round((s.with_doi / s.total) * 100);
    
    console.log('\n📈 État final de la base:');
    console.log(`   - Total références: ${s.total}`);
    console.log(`   - Avec DOI: ${s.with_doi}`);
    console.log(`   - Sans DOI: ${s.without_doi}`);
    console.log(`   - Taux de complétion: ${completionRate}%`);
    
    console.log('\n📖 Note: Certaines références (livres anciens, documents réglementaires)');
    console.log('   n\'ont pas de DOI par nature. Cela est normal et documenté.');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

updateDOIs().catch(console.error);
