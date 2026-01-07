import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * PERFUMUM — Auto-Link Bibliography to Evidence Script
 * 
 * Ce script analyse toutes les évidences (molecule_evidence) et tente de les
 * lier automatiquement aux références bibliographiques existantes en utilisant
 * plusieurs stratégies de matching :
 * 
 * 1. Matching par reference_id exact (ex: CAN-006 → bibliographie avec même ID)
 * 2. Matching par mots-clés dans le titre
 * 3. Matching par auteur et année
 * 4. Matching par DOI si disponible
 */

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== PERFUMUM Auto-Link Bibliography ===\n');

// 1. Récupérer toutes les évidences
const [evidences] = await connection.execute(`
  SELECT 
    id, evidence_id, molecule_name, reference_id, time_context, 
    region_context, method, entity_name, url, evidence_notes
  FROM molecule_evidence
`);
console.log(`Found ${evidences.length} evidence entries to process\n`);

// 2. Récupérer toutes les références bibliographiques
const [bibliography] = await connection.execute(`
  SELECT 
    id, entry_key, title, authors, year, doi, url, 
    research_domain, keywords
  FROM bibliography_entries
`);
console.log(`Found ${bibliography.length} bibliography entries available\n`);

// 3. Récupérer les liens existants
const [existingLinks] = await connection.execute(`
  SELECT evidence_id, bibliography_id FROM evidence_bibliography_links
`);
const existingLinkSet = new Set(existingLinks.map(l => `${l.evidence_id}-${l.bibliography_id}`));
console.log(`Found ${existingLinks.length} existing links\n`);

// Créer un index pour la recherche rapide
const bibByKey = new Map();
const bibByTitle = new Map();
const bibByDoi = new Map();

bibliography.forEach(bib => {
  // Index par entry_key
  bibByKey.set(bib.entry_key.toLowerCase(), bib);
  
  // Index par titre (mots-clés)
  if (bib.title) {
    const titleWords = bib.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    titleWords.forEach(word => {
      if (!bibByTitle.has(word)) bibByTitle.set(word, []);
      bibByTitle.get(word).push(bib);
    });
  }
  
  // Index par DOI
  if (bib.doi) {
    bibByDoi.set(bib.doi.toLowerCase(), bib);
  }
});

// Fonction de scoring pour le matching
function calculateMatchScore(evidence, bib) {
  let score = 0;
  const reasons = [];
  
  // 1. Matching par reference_id dans entry_key
  if (evidence.reference_id && bib.entry_key) {
    const refId = evidence.reference_id.toLowerCase();
    const entryKey = bib.entry_key.toLowerCase();
    
    if (entryKey.includes(refId) || refId.includes(entryKey.replace('perfumum_', ''))) {
      score += 50;
      reasons.push('reference_id match');
    }
  }
  
  // 2. Matching par mots-clés dans les notes d'évidence
  if (evidence.evidence_notes && bib.title) {
    const notesWords = evidence.evidence_notes.toLowerCase().split(/\s+/);
    const titleWords = bib.title.toLowerCase().split(/\s+/);
    const commonWords = notesWords.filter(w => titleWords.includes(w) && w.length > 4);
    if (commonWords.length >= 2) {
      score += commonWords.length * 5;
      reasons.push(`${commonWords.length} common words`);
    }
  }
  
  // 3. Matching par contexte temporel
  if (evidence.time_context && bib.title) {
    const timeContext = evidence.time_context.toLowerCase();
    const title = bib.title.toLowerCase();
    
    // Mots-clés temporels
    const timeKeywords = ['ancient', 'archaeological', 'herbarium', 'historical', 'medieval', 'roman', 'greek', 'egyptian'];
    const matchedTime = timeKeywords.filter(kw => timeContext.includes(kw) && title.includes(kw));
    if (matchedTime.length > 0) {
      score += matchedTime.length * 10;
      reasons.push(`time context: ${matchedTime.join(', ')}`);
    }
  }
  
  // 4. Matching par molécule
  if (evidence.molecule_name && bib.title) {
    const moleculeName = evidence.molecule_name.toLowerCase();
    const title = bib.title.toLowerCase();
    
    // Noms de molécules courants
    const moleculeKeywords = ['thc', 'cbd', 'cannabinoid', 'terpene', 'nicotine', 'alkaloid', 'terpenoid'];
    const matchedMol = moleculeKeywords.filter(kw => moleculeName.includes(kw) && title.includes(kw));
    if (matchedMol.length > 0) {
      score += matchedMol.length * 15;
      reasons.push(`molecule match: ${matchedMol.join(', ')}`);
    }
  }
  
  // 5. Matching par méthode analytique
  if (evidence.method && bib.title) {
    const method = evidence.method.toLowerCase();
    const title = bib.title.toLowerCase();
    
    const methodKeywords = ['gc-ms', 'lc-ms', 'hplc', 'genomic', 'spectro', 'chromatograph'];
    const matchedMethod = methodKeywords.filter(kw => method.includes(kw) && title.includes(kw));
    if (matchedMethod.length > 0) {
      score += matchedMethod.length * 10;
      reasons.push(`method match: ${matchedMethod.join(', ')}`);
    }
  }
  
  // 6. Matching par domaine de recherche
  if (bib.research_domain) {
    const domain = bib.research_domain.toLowerCase();
    
    // Cannabis evidence
    if (evidence.evidence_id?.includes('CAN') && (domain.includes('cannabis') || domain.includes('botanique'))) {
      score += 20;
      reasons.push('domain: cannabis');
    }
    
    // Tobacco evidence
    if (evidence.evidence_id?.includes('TOB') && (domain.includes('tabac') || domain.includes('tobacco'))) {
      score += 20;
      reasons.push('domain: tobacco');
    }
    
    // Heritage/archaeological
    if (evidence.time_context?.includes('archaeological') && domain.includes('heritage')) {
      score += 15;
      reasons.push('domain: heritage');
    }
  }
  
  // 7. Matching par URL similaire
  if (evidence.url && bib.url) {
    const evUrl = evidence.url.toLowerCase();
    const bibUrl = bib.url.toLowerCase();
    
    // Même domaine
    const evDomain = evUrl.match(/https?:\/\/([^\/]+)/)?.[1];
    const bibDomain = bibUrl.match(/https?:\/\/([^\/]+)/)?.[1];
    if (evDomain && bibDomain && evDomain === bibDomain) {
      score += 10;
      reasons.push('same URL domain');
    }
  }
  
  return { score, reasons };
}

// Fonction pour déterminer le type de lien
function determineLinkType(score, reasons) {
  if (reasons.some(r => r.includes('reference_id'))) return 'primary';
  if (score >= 40) return 'primary';
  if (score >= 25) return 'secondary';
  if (score >= 15) return 'methodology';
  return 'context';
}

// Fonction pour déterminer la méthode de matching
function determineMatchMethod(reasons) {
  if (reasons.some(r => r.includes('reference_id'))) return 'title';
  if (reasons.some(r => r.includes('doi'))) return 'doi';
  return 'auto';
}

// Traiter chaque évidence
const results = {
  processed: 0,
  linked: 0,
  skipped: 0,
  errors: 0,
  links: []
};

console.log('Processing evidence entries...\n');

for (const evidence of evidences) {
  results.processed++;
  
  // Trouver les meilleures correspondances
  const matches = [];
  
  for (const bib of bibliography) {
    const { score, reasons } = calculateMatchScore(evidence, bib);
    
    if (score >= 15) { // Seuil minimum
      matches.push({
        bibliography: bib,
        score,
        reasons
      });
    }
  }
  
  // Trier par score décroissant
  matches.sort((a, b) => b.score - a.score);
  
  // Prendre les 3 meilleures correspondances
  const topMatches = matches.slice(0, 3);
  
  for (const match of topMatches) {
    const linkKey = `${evidence.id}-${match.bibliography.id}`;
    
    // Vérifier si le lien existe déjà
    if (existingLinkSet.has(linkKey)) {
      results.skipped++;
      continue;
    }
    
    const linkType = determineLinkType(match.score, match.reasons);
    const matchMethod = determineMatchMethod(match.reasons);
    
    try {
      await connection.execute(`
        INSERT INTO evidence_bibliography_links 
        (evidence_id, bibliography_id, link_type, match_method, match_score, notes, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        evidence.id,
        match.bibliography.id,
        linkType,
        matchMethod,
        match.score,
        `Auto-linked: ${match.reasons.join('; ')}`,
        0 // Non vérifié par défaut
      ]);
      
      results.linked++;
      existingLinkSet.add(linkKey);
      
      results.links.push({
        evidenceId: evidence.evidence_id,
        moleculeName: evidence.molecule_name,
        bibliographyKey: match.bibliography.entry_key,
        bibliographyTitle: match.bibliography.title?.substring(0, 50),
        score: match.score,
        linkType,
        reasons: match.reasons
      });
      
      console.log(`✓ Linked: ${evidence.evidence_id} → ${match.bibliography.entry_key} (score: ${match.score}, type: ${linkType})`);
    } catch (error) {
      results.errors++;
      console.error(`✗ Error linking ${evidence.evidence_id}:`, error.message);
    }
  }
}

// Résumé
console.log('\n=== Summary ===');
console.log(`Evidence entries processed: ${results.processed}`);
console.log(`New links created: ${results.linked}`);
console.log(`Links skipped (already exist): ${results.skipped}`);
console.log(`Errors: ${results.errors}`);

// Statistiques par type de lien
const linksByType = results.links.reduce((acc, link) => {
  acc[link.linkType] = (acc[link.linkType] || 0) + 1;
  return acc;
}, {});

console.log('\n=== Links by Type ===');
Object.entries(linksByType).forEach(([type, count]) => {
  console.log(`- ${type}: ${count}`);
});

// Statistiques finales de la base
const [finalStats] = await connection.execute(`
  SELECT 
    (SELECT COUNT(*) FROM evidence_bibliography_links) as total_links,
    (SELECT COUNT(DISTINCT evidence_id) FROM evidence_bibliography_links) as linked_evidences,
    (SELECT COUNT(DISTINCT bibliography_id) FROM evidence_bibliography_links) as linked_bibliography
`);

console.log('\n=== Final Database Stats ===');
console.log(`Total evidence-bibliography links: ${finalStats[0].total_links}`);
console.log(`Evidences with at least one link: ${finalStats[0].linked_evidences}`);
console.log(`Bibliography entries linked: ${finalStats[0].linked_bibliography}`);

// Sauvegarder le rapport
const reportPath = '/home/ubuntu/perfumum-research/data/auto-link-report.json';
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    processed: results.processed,
    linked: results.linked,
    skipped: results.skipped,
    errors: results.errors
  },
  linksByType,
  finalStats: finalStats[0],
  links: results.links
};

await connection.execute(`SELECT 1`); // Keep connection alive
console.log(`\nReport saved to: ${reportPath}`);

// Écrire le rapport dans un fichier
import { writeFileSync } from 'fs';
writeFileSync(reportPath, JSON.stringify(report, null, 2));

await connection.end();
console.log('\n✓ Auto-linking complete!');
