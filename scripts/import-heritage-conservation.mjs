/**
 * Script d'import des références Heritage & Conservation
 * 34 références sur la préservation du patrimoine olfactif
 * 
 * Usage: node scripts/import-heritage-conservation.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier CSV
const CSV_PATH = '/home/ubuntu/perfumum-heritage-pack/PERFUMUM_References_OlfactoryHeritage_Conservation_v1.csv';

// Mapping des types de sources vers les types de la base de données
const typeMapping = {
  'journal-article': 'article',
  'book-chapter': 'book_chapter',
  'book': 'book',
  'report': 'report',
  'website': 'website',
  'webpage': 'website',
  'conference-paper': 'conference',
  'dataset': 'dataset',
  'news': 'article',
  'magazine-article': 'article',
  'repository': 'other',
  'blog': 'website',
  'institution-page': 'website',
};

// Mapping des tags vers les domaines de recherche
const domainMapping = {
  'olfactory-heritage': 'heritage_conservation',
  'heritage': 'heritage_conservation',
  'archiving': 'heritage_conservation',
  'museum': 'heritage_conservation',
  'GLAM': 'heritage_conservation',
  'conservation': 'heritage_conservation',
  'VOC': 'analytical_chemistry',
  'VOCs': 'analytical_chemistry',
  'GC-MS': 'analytical_chemistry',
  'GC-MS-O': 'analytical_chemistry',
  'SPME': 'analytical_chemistry',
  'archaeochemistry': 'history_ethnobotany',
  'mummies': 'history_ethnobotany',
  'Roman': 'history_ethnobotany',
  'history': 'history_ethnobotany',
  'anthropology': 'history_ethnobotany',
};

// Parser le CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parser la ligne en tenant compte des guillemets
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // Créer l'objet
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    records.push(record);
  }
  
  return records;
}

// Déterminer le domaine de recherche principal
function getDomain(tags) {
  if (!tags) return 'heritage_conservation';
  
  const tagList = tags.split(';').map(t => t.trim());
  
  for (const tag of tagList) {
    if (domainMapping[tag]) {
      return domainMapping[tag];
    }
  }
  
  return 'heritage_conservation';
}

// Extraire les auteurs
function parseAuthors(authorsStr) {
  if (!authorsStr) return [];
  
  // Séparer par ";" ou " and "
  const authors = authorsStr.split(/;|(?:\s+and\s+)/).map(a => a.trim()).filter(a => a);
  
  return authors.map(author => {
    // Format: "Nom, Prénom" ou "Prénom Nom"
    const parts = author.split(',').map(p => p.trim());
    if (parts.length === 2) {
      return { lastName: parts[0], firstName: parts[1] };
    }
    // Format "Prénom Nom"
    const nameParts = author.split(' ');
    if (nameParts.length >= 2) {
      return { 
        firstName: nameParts.slice(0, -1).join(' '), 
        lastName: nameParts[nameParts.length - 1] 
      };
    }
    return { lastName: author, firstName: '' };
  });
}

// Générer le SQL d'insertion
function generateSQL(records) {
  const statements = [];
  
  for (const record of records) {
    const entryKey = record.id.toLowerCase().replace(/-/g, '_');
    const entryType = typeMapping[record.type] || 'other';
    const year = parseInt(record.year) || null;
    const domain = getDomain(record.tags);
    const authors = parseAuthors(record.authors);
    
    // Nettoyer le titre (échapper les apostrophes)
    const title = record.title.replace(/'/g, "''");
    const venue = record.venue ? record.venue.replace(/'/g, "''") : null;
    const doi = record.doi || null;
    const url = record.url || null;
    
    // Tags en JSON
    const tags = record.tags ? record.tags.split(';').map(t => t.trim()) : [];
    const tagsJson = JSON.stringify(tags);
    
    // Auteurs en JSON
    const authorsJson = JSON.stringify(authors);
    
    // Construire le SQL
    const sql = `
INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  '${entryKey}',
  '${entryType}',
  '${title}',
  ${year || 'NULL'},
  '${authorsJson}',
  ${venue ? `'${venue}'` : 'NULL'},
  ${doi ? `'${doi}'` : 'NULL'},
  ${url ? `'${url}'` : 'NULL'},
  '${domain}',
  '${tagsJson}',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();
`;
    
    statements.push(sql.trim());
  }
  
  return statements;
}

// Fonction principale
async function main() {
  console.log('📚 Import des références Heritage & Conservation');
  console.log('================================================\n');
  
  // Lire le fichier CSV
  console.log(`📖 Lecture du fichier: ${CSV_PATH}`);
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  
  // Parser le CSV
  const records = parseCSV(content);
  console.log(`✅ ${records.length} références trouvées\n`);
  
  // Afficher un résumé par type
  const typeCount = {};
  records.forEach(r => {
    typeCount[r.type] = (typeCount[r.type] || 0) + 1;
  });
  
  console.log('📊 Répartition par type:');
  Object.entries(typeCount).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count}`);
  });
  console.log('');
  
  // Générer le SQL
  const sqlStatements = generateSQL(records);
  
  // Écrire le fichier SQL
  const sqlPath = path.join(__dirname, 'heritage-conservation-import.sql');
  fs.writeFileSync(sqlPath, sqlStatements.join('\n\n'));
  console.log(`💾 Fichier SQL généré: ${sqlPath}`);
  
  // Afficher les premières références
  console.log('\n📋 Aperçu des références:');
  records.slice(0, 5).forEach(r => {
    console.log(`   [${r.id}] ${r.title.substring(0, 60)}...`);
  });
  console.log(`   ... et ${records.length - 5} autres\n`);
  
  console.log('✅ Import préparé avec succès!');
  console.log('   Pour exécuter l\'import, utilisez:');
  console.log('   mysql -u <user> -p <database> < scripts/heritage-conservation-import.sql');
  
  // Retourner les données pour utilisation programmatique
  return { records, sqlStatements };
}

main().catch(console.error);
