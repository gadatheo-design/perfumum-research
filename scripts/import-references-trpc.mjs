#!/usr/bin/env node
/**
 * Script d'import des nouvelles références via API tRPC
 * Utilise le endpoint bulkCreate pour importer les références en batch
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier JSON des références
const referencesPath = path.join(__dirname, '../data/new_references_to_import.json');
const data = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));

console.log(`📚 Import de ${data.totalCount} références bibliographiques`);
console.log(`   Sources:`);
data.sources.forEach(s => console.log(`   - ${s.name}: ${s.count} références`));

// Préparer les références pour l'import
const referencesToImport = data.references.map(ref => ({
  entryKey: ref.entryKey,
  entryType: ref.entryType,
  title: ref.title,
  authors: ref.authors,
  year: ref.year,
  journal: ref.journal,
  doi: ref.doi,
  url: ref.url,
  tags: ref.tags, // Déjà en JSON string
  notes: ref.notes,
  researchDomain: ref.researchDomain,
  readStatus: ref.readStatus,
  relevanceScore: ref.relevanceScore,
}));

// Écrire le fichier pour import via SQL ou API
const outputPath = path.join(__dirname, '../data/references_import_ready.json');
fs.writeFileSync(outputPath, JSON.stringify(referencesToImport, null, 2));

console.log(`\n✅ Fichier d'import préparé: ${outputPath}`);
console.log(`\nPour importer via l'API, utilisez le endpoint:`);
console.log(`   POST /api/trpc/bibliography.bulkCreate`);
console.log(`   Body: { entries: [...] }`);
