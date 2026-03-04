import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/trpc';

async function callAPI(procedure, input = {}) {
  const params = new URLSearchParams({
    input: JSON.stringify(input)
  });
  
  const response = await fetch(`${API_URL}/${procedure}?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  if (data.error) {
    console.error(`Error calling ${procedure}:`, data.error);
    return null;
  }
  return data.result?.data || data.result;
}

async function analyzeRelations() {
  console.log('=== ANALYSE DES LIAISONS PLANTES-MOLÉCULES ===\n');
  
  // Récupérer les statistiques
  const stats = await callAPI('moleculeManager.getDataQualityStats');
  console.log('Statistiques globales:');
  console.log(`- Plantes: ${stats?.plants || 0}`);
  console.log(`- Molécules: ${stats?.molecules || 0}`);
  console.log(`- Liaisons plante-molécule: ${stats?.relations || 0}`);
  console.log(`- Transformations pyrolyse: ${stats?.pyrolysis || 0}`);
  
  // Récupérer les plantes avec leurs liaisons
  console.log('\n=== PLANTES AVEC LE MOINS DE LIAISONS ===');
  const plants = await callAPI('moleculeManager.getPlants', { limit: 1000 });
  
  if (plants?.plants) {
    const plantsByMoleculeCount = plants.plants
      .map(p => ({
        name: p.name,
        category: p.category,
        moleculeCount: p.molecules?.length || 0,
        molecules: p.molecules?.slice(0, 3).map(m => m.name).join(', ') || 'Aucune'
      }))
      .sort((a, b) => a.moleculeCount - b.moleculeCount)
      .slice(0, 20);
    
    console.table(plantsByMoleculeCount);
  }
}

analyzeRelations().catch(console.error);
