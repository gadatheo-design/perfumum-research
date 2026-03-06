/**
 * Script batch PubChem — 25 molécules
 * Appel direct aux fonctions db.ts via tsx
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger les variables d'environnement
const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env') });

const { getUnenrichedMolecules, enrichMoleculeFromPubChemWithTranslation } = await import('../server/db.ts');

const DELAY_MS = 1200;
const BATCH_SIZE = 25;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

console.log('\n=== BATCH PubChem — 25 molécules ===\n');

const mols = await getUnenrichedMolecules(BATCH_SIZE);
console.log(`${mols.length} molécules candidates\n`);

let success = 0, errors = 0, skipped = 0;

for (let i = 0; i < mols.length; i++) {
  const mol = mols[i];
  process.stdout.write(`[${i+1}/${mols.length}] ${mol.name} (${mol.id}) ... `);
  
  try {
    const res = await enrichMoleculeFromPubChemWithTranslation(mol.id);
    if (res.success) {
      success++;
      const cid = res.data?.pubchemCid || '';
      console.log(`✅ CID:${cid} — ${res.message}`);
    } else if (res.message?.includes('déjà enrichie')) {
      skipped++;
      console.log(`⏭ ${res.message}`);
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

console.log(`\n=== RÉSULTATS ===`);
console.log(`✅ Succès  : ${success}`);
console.log(`❌ Erreurs : ${errors}`);
console.log(`⏭ Ignorées: ${skipped}`);
console.log(`📊 Total   : ${mols.length}`);
