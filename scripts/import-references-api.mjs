#!/usr/bin/env node
/**
 * Script d'import des nouvelles références via l'API tRPC locale
 * Lit les fichiers BibTeX et les importe via le endpoint importBibTeX
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3000/api/trpc';

async function importBibTeX(bibContent) {
  try {
    const response = await fetch(`${API_URL}/bibliography.importBibTeX`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ json: bibContent }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    return { error: error.message };
  }
}

async function main() {
  console.log('📚 Import des références bibliographiques PERFUMUM\n');
  
  // Fichiers BibTeX à importer
  const bibFiles = [
    'PERFUMUM_References_PerfumeryMaterials_NicheOmics_v2.bib',
    'PERFUMUM_References_LostMolecules_AncientVarieties_v1.bib',
  ];
  
  for (const file of bibFiles) {
    const filePath = path.join(__dirname, '../data', file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé: ${file}`);
      continue;
    }
    
    console.log(`📖 Import de ${file}...`);
    const bibContent = fs.readFileSync(filePath, 'utf-8');
    
    const result = await importBibTeX(bibContent);
    
    if (result.error) {
      console.log(`   ❌ Erreur: ${result.error}`);
    } else if (result.result?.data) {
      const data = result.result.data;
      console.log(`   ✅ Succès: ${data.success} importées, ${data.failed} échouées`);
      if (data.errors && data.errors.length > 0) {
        console.log(`   ⚠️  Erreurs:`);
        data.errors.slice(0, 5).forEach(e => console.log(`      - ${e}`));
        if (data.errors.length > 5) {
          console.log(`      ... et ${data.errors.length - 5} autres`);
        }
      }
    } else {
      console.log(`   ℹ️  Résultat:`, JSON.stringify(result, null, 2));
    }
  }
  
  console.log('\n✅ Import terminé!');
}

main().catch(console.error);
