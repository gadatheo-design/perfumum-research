#!/usr/bin/env node
/**
 * Script d'import des sources bibliographiques dans la base de données PERFUMUM
 * Utilise les fonctions DB directement pour l'import
 */

import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';

// Charger les sources depuis le fichier JSON
const sourcesData = JSON.parse(readFileSync('/home/ubuntu/perfumum-research/data/sources-to-import.json', 'utf-8'));

async function importSources() {
  // Connexion à la base de données
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  console.log('✅ Connexion à la base de données établie');
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const source of sourcesData.sources) {
    try {
      // Vérifier si la source existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM bibliography_entries WHERE entry_key = ?',
        [source.entry_key]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Source "${source.entry_key}" existe déjà, mise à jour...`);
        // Mettre à jour la source existante
        await connection.execute(`
          UPDATE bibliography_entries SET
            title = ?,
            authors = ?,
            year = ?,
            journal = ?,
            volume = ?,
            number = ?,
            pages = ?,
            doi = ?,
            pmid = ?,
            url = ?,
            abstract = ?,
            keywords = ?,
            research_domain = ?,
            read_status = ?,
            updated_at = NOW()
          WHERE entry_key = ?
        `, [
          source.title,
          source.authors || null,
          source.year || null,
          source.journal || null,
          source.volume || null,
          source.number || null,
          source.pages || null,
          source.doi || null,
          source.pmid || null,
          source.url || null,
          source.abstract || null,
          source.keywords || null,
          source.research_domain || null,
          source.read_status || 'a_lire',
          source.entry_key
        ]);
        skipped++;
        continue;
      }

      // Insérer la nouvelle source
      await connection.execute(`
        INSERT INTO bibliography_entries (
          entry_key, entry_type, title, authors, year,
          journal, volume, number, pages, doi, pmid, url,
          abstract, keywords, research_domain, read_status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        source.entry_key,
        source.entry_type || 'article',
        source.title,
        source.authors || null,
        source.year || null,
        source.journal || null,
        source.volume || null,
        source.number || null,
        source.pages || null,
        source.doi || null,
        source.pmid || null,
        source.url || null,
        source.abstract || null,
        source.keywords || null,
        source.research_domain || null,
        source.read_status || 'a_lire'
      ]);

      console.log(`✅ Source "${source.entry_key}" importée avec succès`);
      imported++;
    } catch (error) {
      console.error(`❌ Erreur pour "${source.entry_key}":`, error.message);
      errors++;
    }
  }

  await connection.end();

  console.log('\n📊 Résumé de l\'import:');
  console.log(`  - Nouvelles sources importées: ${imported}`);
  console.log(`  - Sources mises à jour: ${skipped}`);
  console.log(`  - Erreurs: ${errors}`);
  console.log(`  - Total traité: ${sourcesData.sources.length}`);
}

// Exécuter l'import
importSources().catch(console.error);
