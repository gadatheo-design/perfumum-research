import Database from 'better-sqlite3';

const db = new Database('./db.sqlite');

// Trouver les recettes Pétrichor
console.log("=== RECETTES PÉTRICHOR ===\n");
const petrichorRecettes = db.prepare(`
  SELECT id, name, category, description 
  FROM recettes 
  WHERE name LIKE '%petrichor%' OR name LIKE '%Pétrichor%' 
     OR description LIKE '%petrichor%' OR description LIKE '%terre%'
     OR category = 'resine_cbd'
  LIMIT 20
`).all();

console.log(`Trouvé ${petrichorRecettes.length} recettes potentielles:\n`);
petrichorRecettes.forEach(r => {
  console.log(`ID: ${r.id} | ${r.name} | ${r.category}`);
});

// Trouver les molécules Pétrichor (terre, minéral, pluie)
console.log("\n=== MOLÉCULES PÉTRICHOR ===\n");
const petrichorMolecules = db.prepare(`
  SELECT id, name, olfactiveProfile, radarIntensity, radarFreshness, radarWarmth, radarSweetness, radarSpiciness, radarEarthiness
  FROM molecules 
  WHERE olfactiveProfile LIKE '%terre%' 
     OR olfactiveProfile LIKE '%minéral%'
     OR olfactiveProfile LIKE '%pluie%'
     OR olfactiveProfile LIKE '%humide%'
     OR olfactiveProfile LIKE '%boisé%'
     OR name LIKE '%Geosmin%'
     OR name LIKE '%Vetiver%'
     OR name LIKE '%Mitti%'
  LIMIT 20
`).all();

console.log(`Trouvé ${petrichorMolecules.length} molécules Pétrichor:\n`);
petrichorMolecules.forEach(m => {
  console.log(`ID: ${m.id} | ${m.name}`);
  console.log(`  Profil: ${m.olfactiveProfile?.substring(0, 80)}...`);
  console.log(`  Radar: I=${m.radarIntensity} F=${m.radarFreshness} W=${m.radarWarmth} S=${m.radarSweetness} Sp=${m.radarSpiciness} E=${m.radarEarthiness}`);
  console.log();
});

// Vérifier les associations existantes
console.log("\n=== ASSOCIATIONS EXISTANTES ===\n");
const existingAssoc = db.prepare(`
  SELECT mr.recette_id, r.name as recette_name, mr.molecule_id, m.name as molecule_name, mr.proportion
  FROM molecules_recettes mr
  JOIN recettes r ON r.id = mr.recette_id
  JOIN molecules m ON m.id = mr.molecule_id
  LIMIT 20
`).all();

console.log(`${existingAssoc.length} associations existantes:`);
existingAssoc.forEach(a => {
  console.log(`  ${a.recette_name} ← ${a.molecule_name} (${a.proportion}%)`);
});

db.close();
