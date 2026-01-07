/**
 * Import des 50 nouvelles sources bibliographiques du pack PERFUMUM
 * PERFUMUM_Bibliography_NicheInnovations_AllSources_v2.csv
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const CSV_PATH = '/home/ubuntu/perfumum-bibliography-pack/PERFUMUM_Bibliography_NicheInnovations_AllSources_v2.csv';

// Mapping des types CSV vers les types du schéma
const typeMapping = {
  'journal-article': 'article',
  'preprint': 'article',
  'book': 'book',
  'website': 'online',
  'dataset': 'dataset',
  'software': 'software',
  'report': 'techreport',
  'news-article': 'misc'
};

// Mapping des axes vers les domaines de recherche
const domainMapping = {
  'Omics / Chemodiversity': 'molecular_analysis',
  'Herbarium / Time-series metabolomics': 'heritage',
  'Heritage science / Lost perfumes': 'heritage',
  'Digital smell / Immersive': 'sensory_perception',
  'Digital smell / Hardware': 'sensory_perception',
  'Digital smell / Applied': 'sensory_perception',
  'Citizen science / Smell mapping': 'ethnobotany',
  'Biotech / Conservation substitutes': 'biotechnology',
  'Biotech / Sustainable feedstocks': 'biotechnology',
  'Data infra / Metabolomics': 'molecular_analysis',
  'Data infra / Spectral libraries': 'molecular_analysis',
  'Data infra / Repositories': 'molecular_analysis',
  'Chem info infra': 'molecular_analysis',
  'Genomics infra': 'biotechnology',
  'Taxonomy & distribution': 'ethnobotany',
  'Ethnobotany computation / Text mining': 'ethnobotany',
  'Ethnobotany computation / Scholarly graph': 'ethnobotany',
  'Olfaction datasets': 'sensory_perception',
  'Olfaction datasets / ML': 'sensory_perception',
  'Chem analytics tooling': 'molecular_analysis',
  'Scholarly discovery infra': 'other'
};

async function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  const entries = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Parse CSV avec gestion des virgules dans les champs entre guillemets
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
    
    if (values.length >= 11) {
      entries.push({
        reference_id: values[0],
        type: values[1],
        year: parseInt(values[2]) || null,
        title: values[3],
        authors: values[4],
        venue: values[5],
        doi: values[6] || null,
        url: values[7] || null,
        axis: values[8],
        tags: values[9],
        note: values[10]
      });
    }
  }
  
  return entries;
}

async function importBibliography() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('📚 Import des nouvelles sources bibliographiques...\n');
    
    const entries = await parseCSV(CSV_PATH);
    console.log(`📄 ${entries.length} entrées trouvées dans le CSV\n`);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const entry of entries) {
      try {
        // Vérifier si l'entrée existe déjà
        const [existing] = await connection.execute(
          'SELECT id FROM bibliography_entries WHERE entry_key = ?',
          [entry.reference_id]
        );
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipped: ${entry.reference_id} (already exists)`);
          skipped++;
          continue;
        }
        
        // Mapper le type
        const entryType = typeMapping[entry.type] || 'misc';
        
        // Mapper le domaine de recherche
        const researchDomain = domainMapping[entry.axis] || 'other';
        
        // Parser les tags en array JSON
        const keywords = entry.tags ? entry.tags.split(',').map(t => t.trim()) : [];
        
        // Mapper le domaine de recherche vers les valeurs valides du schéma
        const domainMappingSchema = {
          'molecular_analysis': 'chimie_olfactive',
          'heritage': 'histoire_parfumerie',
          'sensory_perception': 'neurologie_olfactive',
          'ethnobotany': 'ethnobotanique',
          'biotechnology': 'botanique',
          'other': 'autre'
        };
        const finalDomain = domainMappingSchema[researchDomain] || 'autre';
        
        // Insérer l'entrée
        await connection.execute(
          `INSERT INTO bibliography_entries 
           (entry_key, entry_type, title, authors, year, journal, doi, url, abstract, keywords, research_domain, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            entry.reference_id,
            entryType,
            entry.title,
            entry.authors,
            entry.year,
            entry.venue,
            entry.doi,
            entry.url,
            entry.note, // Utiliser la note comme abstract
            JSON.stringify(keywords),
            finalDomain,
            `Axis: ${entry.axis}` // Stocker l'axe original dans les notes
          ]
        );
        
        console.log(`✅ Imported: ${entry.reference_id} - ${entry.title.substring(0, 50)}...`);
        imported++;
        
      } catch (err) {
        console.error(`❌ Error importing ${entry.reference_id}:`, err.message);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE L\'IMPORT');
    console.log('='.repeat(60));
    console.log(`✅ Importées: ${imported}`);
    console.log(`⏭️  Ignorées (déjà existantes): ${skipped}`);
    console.log(`❌ Erreurs: ${errors}`);
    console.log(`📄 Total traité: ${entries.length}`);
    
    // Compter le total dans la base
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM bibliography_entries'
    );
    console.log(`\n📚 Total références en base: ${countResult[0].total}`);
    
  } finally {
    await connection.end();
  }
}

importBibliography().catch(console.error);
