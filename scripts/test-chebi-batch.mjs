/**
 * Script de test batch ChEBI — 25 molécules
 * Lance l'enrichissement via l'API tRPC locale
 */

const BASE_URL = 'http://localhost:3000/api/trpc';
const DELAY_MS = 1500; // 1.5s entre requêtes pour respecter l'API ChEBI

async function callTrpc(procedure, input = {}) {
  const url = `${BASE_URL}/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const data = await res.json();
  if (data.error) throw new Error(data.error.json?.message || 'tRPC error');
  return data.result?.data?.json;
}

async function callTrpcMutation(procedure, input = {}) {
  const res = await fetch(`${BASE_URL}/${procedure}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: input }),
    signal: AbortSignal.timeout(30000),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.json?.message || 'tRPC error');
  return data.result?.data?.json;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('=== BATCH ChEBI — Test 25 molécules ===\n');
  
  // 1. Récupérer les molécules candidates
  const mols = await callTrpc('molecules.getUnenrichedForChEBI', { limit: 25 });
  console.log(`${mols.length} molécules candidates récupérées\n`);
  
  let success = 0, errors = 0, skipped = 0;
  const results = [];
  
  for (let i = 0; i < mols.length; i++) {
    const mol = mols[i];
    process.stdout.write(`[${i+1}/${mols.length}] ${mol.name} (ID: ${mol.id}) ... `);
    
    try {
      const res = await callTrpcMutation('molecules.enrichFromChEBI', { moleculeId: mol.id });
      if (res.success) {
        success++;
        console.log(`✅ ${res.chebiId || ''} — ${res.message}`);
        results.push({ id: mol.id, name: mol.name, status: 'success', chebiId: res.chebiId, message: res.message });
      } else {
        errors++;
        console.log(`❌ ${res.message}`);
        results.push({ id: mol.id, name: mol.name, status: 'error', message: res.message });
      }
    } catch (err) {
      if (err.message?.includes('déjà enrichie') || err.message?.includes('already')) {
        skipped++;
        console.log(`⏭ Déjà enrichie`);
        results.push({ id: mol.id, name: mol.name, status: 'skipped' });
      } else {
        errors++;
        console.log(`❌ ${err.message}`);
        results.push({ id: mol.id, name: mol.name, status: 'error', message: err.message });
      }
    }
    
    if (i < mols.length - 1) await sleep(DELAY_MS);
  }
  
  console.log('\n=== RÉSULTATS ===');
  console.log(`✅ Succès : ${success}`);
  console.log(`❌ Erreurs : ${errors}`);
  console.log(`⏭ Ignorées : ${skipped}`);
  console.log(`📊 Total traité : ${mols.length}`);
  
  if (success > 0) {
    console.log('\n✅ Molécules enrichies :');
    results.filter(r => r.status === 'success').forEach(r => {
      console.log(`  [${r.id}] ${r.name} → ${r.chebiId}`);
    });
  }
  
  if (errors > 0) {
    console.log('\n❌ Erreurs :');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`  [${r.id}] ${r.name} → ${r.message}`);
    });
  }
}

main().catch(console.error);
