/**
 * Script d'audit des DOI manquants dans les références bibliographiques
 * PERFUMUM Research Project - 06 janvier 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

// DOI connus pour certaines références (recherche manuelle)
const KNOWN_DOIS = {
  // Lippia origanoides
  "vicuna2010": "10.1016/j.jep.2009.10.004",
  "escobar2010": "10.1590/S0074-02762010000400014",
  "oliveira2007": "10.1016/j.foodchem.2006.01.017",
  
  // Tagetes lucida
  "regalado2011": "10.1080/10412905.2011.9700485",
  "bicchi1997": "10.1002/(SICI)1099-1026(199701)12:1<47::AID-FFJ610>3.0.CO;2-7",
  
  // Lippia multiflora
  "bassole2003": "10.1016/S0031-9422(02)00477-6",
  "bassole2010": "10.3390/molecules15117825",
  "bayala2014": "10.1371/journal.pone.0092122",
  
  // Ocimum canum
  "dasilva2018": "10.1016/j.indcrop.2018.04.025",
  "tchoumbougnang2006": "10.1080/10412905.2006.9699064",
  
  // Références générales parfumerie
  "arctander1969": null, // Livre, pas de DOI
  "guenther1948": null, // Livre classique, pas de DOI
  "bauer2001": "10.1002/9783527612703",
  "surburg2006": "10.1002/3527608214",
  
  // Terpènes et chimie
  "breitmaier2006": "10.1002/9783527609949",
  "dewick2009": "10.1002/9780470742761",
  
  // Ethnobotanique
  "schultes1992": null, // Livre
  
  // IFRA et réglementation
  "ifra2020": null, // Document réglementaire, pas de DOI standard
  
  // Études spécifiques
  "adams2007": null, // Livre de référence GC-MS
};

async function auditDOIs() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('📚 Audit des DOI manquants dans les références bibliographiques\n');
    
    // Récupérer toutes les références sans DOI
    const [refsWithoutDOI] = await connection.execute(`
      SELECT id, entry_key, title, authors, year, journal, entry_type, doi
      FROM bibliography_entries 
      WHERE doi IS NULL OR doi = ''
      ORDER BY year DESC, title
    `);
    
    // Récupérer toutes les références avec DOI
    const [refsWithDOI] = await connection.execute(`
      SELECT id, entry_key, title, year, doi
      FROM bibliography_entries 
      WHERE doi IS NOT NULL AND doi != ''
      ORDER BY year DESC
    `);
    
    console.log('📊 Statistiques:');
    console.log(`   - Références avec DOI: ${refsWithDOI.length}`);
    console.log(`   - Références sans DOI: ${refsWithoutDOI.length}`);
    console.log(`   - Taux de complétion: ${Math.round(refsWithDOI.length / (refsWithDOI.length + refsWithoutDOI.length) * 100)}%\n`);
    
    if (refsWithoutDOI.length === 0) {
      console.log('✅ Toutes les références ont un DOI!');
      return;
    }
    
    console.log('📋 Références sans DOI:\n');
    
    // Grouper par type
    const byType = {};
    for (const ref of refsWithoutDOI) {
      const type = ref.entry_type || 'unknown';
      if (!byType[type]) byType[type] = [];
      byType[type].push(ref);
    }
    
    for (const [type, refs] of Object.entries(byType)) {
      console.log(`\n=== ${type.toUpperCase()} (${refs.length}) ===`);
      for (const ref of refs) {
        const knownDOI = KNOWN_DOIS[ref.entry_key];
        const status = knownDOI === null ? '📖 (livre/doc)' : knownDOI ? '✅ DOI trouvé' : '❓ À rechercher';
        
        console.log(`\n${status} [${ref.entry_key}]`);
        console.log(`   Titre: ${ref.title?.substring(0, 80)}${ref.title?.length > 80 ? '...' : ''}`);
        console.log(`   Auteurs: ${ref.authors?.substring(0, 60) || 'N/A'}${ref.authors?.length > 60 ? '...' : ''}`);
        console.log(`   Année: ${ref.year || 'N/A'}`);
        if (ref.journal) console.log(`   Journal: ${ref.journal}`);
        if (knownDOI) console.log(`   DOI suggéré: ${knownDOI}`);
      }
    }
    
    // Compter les DOI à ajouter
    let doiToAdd = 0;
    let booksOrDocs = 0;
    let toResearch = 0;
    
    for (const ref of refsWithoutDOI) {
      const knownDOI = KNOWN_DOIS[ref.entry_key];
      if (knownDOI === null) booksOrDocs++;
      else if (knownDOI) doiToAdd++;
      else toResearch++;
    }
    
    console.log('\n\n📈 Résumé:');
    console.log(`   - DOI connus à ajouter: ${doiToAdd}`);
    console.log(`   - Livres/documents (pas de DOI): ${booksOrDocs}`);
    console.log(`   - À rechercher manuellement: ${toResearch}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

auditDOIs().catch(console.error);
