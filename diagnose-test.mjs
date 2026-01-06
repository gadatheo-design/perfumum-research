import * as db from './server/db.ts';

async function main() {
  console.log('=== Diagnostic des tests ===');
  
  // Test 1: getAllPlants
  const plants = await db.getAllPlants();
  console.log('Nombre de plantes:', plants.length);
  
  // Test 2: Trouver Rose de Damas
  const rose = plants.find(p => p.name === 'Rose de Damas');
  console.log('Rose de Damas:', rose ? `ID=${rose.id}` : 'Non trouvée');
  
  if (rose) {
    // Test 3: getPlantMolecules
    const molecules = await db.getPlantMolecules(rose.id);
    console.log('Molécules pour Rose de Damas:', molecules.length);
    if (molecules.length > 0) {
      console.log('Première molécule:', molecules[0]);
    }
  }
  
  process.exit(0);
}

main().catch(e => {
  console.error('Erreur:', e);
  process.exit(1);
});
