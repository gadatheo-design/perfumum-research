/**
 * Script batch ChEBI — appel direct aux fonctions db.ts via tsx
 * Contourne l'authentification tRPC en appelant directement la logique serveur
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger les variables d'environnement
const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env') });

// Charger les fonctions db directement
const { getUnenrichedMoleculesForChEBI, enrichMoleculeFromChEBIWithTranslation } = await import('../server/db.ts');
const { getUnenrichedMolecules, enrichMoleculeFromPubChemWithTranslation } = await import('../server/db.ts');

const DELAY_MS = 1500;
const BATCH_SIZE = 25;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runChEBIBatch() {
  console.log('\n=== BATCH ChEBI — 25 molécules ===\n');
  
  const mols = await getUnenrichedMoleculesForChEBI(BATCH_SIZE);
  console.log(`${mols.length} molécules candidates\n`);
  
  let success = 0, errors = 0, skipped = 0;
  
  for (let i = 0; i < mols.length; i++) {
    const mol = mols[i];
    process.stdout.write(`[${i+1}/${mols.length}] ${mol.name} (${mol.id}) ... `);
    
    try {
      const res = await enrichMoleculeFromChEBIWithTranslation(mol.id);
      if (res.success) {
        success++;
        console.log(`✅ ${res.data?.chebiId || ''} — ${res.message}`);
      } else {
        errors++;
        console.log(`❌ ${res.message}`);
      }
    } catch (err) {
      errors++;
      console.log(`❌ ${err.message}`);
    }
    
    if (i < mols.length - 1) await sleep(DELAY_MS);
  }
  
  console.log(`\n✅ Succès: ${success} | ❌ Erreurs: ${errors} | ⏭ Ignorées: ${skipped}`);
  return { success, errors };
}

async function runPubChemBatch() {
  console.log('\n=== BATCH PubChem — 25 molécules ===\n');
  
  const mols = await getUnenrichedMolecules(BATCH_SIZE);
  console.log(`${mols.length} molécules candidates\n`);
  
  let success = 0, errors = 0;
  
  for (let i = 0; i < mols.length; i++) {
    const mol = mols[i];
    process.stdout.write(`[${i+1}/${mols.length}] ${mol.name} (${mol.id}) ... `);
    
    try {
      const res = await enrichMoleculeFromPubChemWithTranslation(mol.id);
      if (res.success) {
        success++;
        console.log(`✅ CID:${res.data?.pubchemCid || ''} — ${res.message}`);
      } else {
        errors++;
        console.log(`❌ ${res.message}`);
      }
    } catch (err) {
      errors++;
      console.log(`❌ ${err.message}`);
    }
    
    if (i < mols.length - 1) await sleep(DELAY_MS);
  }
  
  console.log(`\n✅ Succès: ${success} | ❌ Erreurs: ${errors}`);
  return { success, errors };
}

// Lancer les deux batches séquentiellement
try {
  const chebiResults = await runChEBIBatch();
  console.log('\n--- Pause 5s avant PubChem ---\n');
  await sleep(5000);
  const pubchemResults = await runPubChemBatch();
  
  console.log('\n=== RÉSUMÉ FINAL ===');
  console.log(`ChEBI  : ${chebiResults.success} succès, ${chebiResults.errors} erreurs`);
  console.log(`PubChem: ${pubchemResults.success} succès, ${pubchemResults.errors} erreurs`);
} catch (err) {
  console.error('Erreur fatale:', err);
  process.exit(1);
}
