/**
 * Script de batch PubChem — 100 molécules
 * Usage: npx tsx scripts/run-pubchem-batch-100.mjs
 */
import { enrichMoleculeFromPubChemWithTranslation, getUnenrichedMolecules } from '../server/db.ts';

const BATCH_SIZE = 100;
const DELAY_MS = 1200; // 1.2s entre chaque requête (< 5 req/s PubChem)

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`\n🔬 BATCH PUBCHEM — ${BATCH_SIZE} molécules\n`);
  
  const molecules = await getUnenrichedMolecules(BATCH_SIZE);
  console.log(`📋 ${molecules.length} molécules candidates trouvées\n`);
  
  let success = 0;
  let failed = 0;
  let skipped = 0;
  
  for (let i = 0; i < molecules.length; i++) {
    const mol = molecules[i];
    const progress = `[${i + 1}/${molecules.length}]`;
    
    try {
      const result = await enrichMoleculeFromPubChemWithTranslation(mol.id, mol.name);
      
      if (result.success) {
        success++;
        console.log(`✅ ${progress} ${mol.name} → CID ${result.pubchemCid || 'N/A'}`);
      } else if (result.skipped) {
        skipped++;
        console.log(`⏭️  ${progress} ${mol.name} → déjà enrichie`);
      } else {
        failed++;
        console.log(`❌ ${progress} ${mol.name} → ${result.error || 'non trouvée'}`);
      }
    } catch (err) {
      failed++;
      console.log(`💥 ${progress} ${mol.name} → erreur: ${err.message}`);
    }
    
    // Délai entre requêtes (sauf dernière)
    if (i < molecules.length - 1) {
      await sleep(DELAY_MS);
    }
  }
  
  console.log(`\n📊 RÉSULTATS FINAUX:`);
  console.log(`   ✅ Succès  : ${success}`);
  console.log(`   ❌ Échecs  : ${failed}`);
  console.log(`   ⏭️  Ignorées: ${skipped}`);
  console.log(`   📈 Taux   : ${Math.round(success / molecules.length * 100)}%\n`);
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
