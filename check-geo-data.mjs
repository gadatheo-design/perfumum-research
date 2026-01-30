import Database from 'better-sqlite3';

const db = new Database('perfumum.db');

// Vérifier les espèces menacées et leurs localisations
console.log('\n=== ESPÈCES MENACÉES ===');
const threatened = db.prepare(`
  SELECT id, name, region, iucn_status, latitude, longitude 
  FROM threatened_species 
  ORDER BY iucn_status, name
`).all();

console.log(`Total: ${threatened.length} espèces menacées`);
console.log('\nExemples:');
threatened.slice(0, 5).forEach(s => {
  console.log(`- ${s.name} (${s.iucn_status}) - ${s.region}`);
  console.log(`  GPS: ${s.latitude || 'N/A'}, ${s.longitude || 'N/A'}`);
});

// Compter combien ont des coordonnées GPS
const withGPS = threatened.filter(s => s.latitude && s.longitude).length;
console.log(`\nAvec GPS: ${withGPS}/${threatened.length} (${Math.round(withGPS/threatened.length*100)}%)`);

// Vérifier les plantes et leurs origines
console.log('\n=== PLANTES & ORIGINES ===');
const plants = db.prepare(`
  SELECT id, scientific_name, native_region 
  FROM plants 
  WHERE native_region IS NOT NULL
  LIMIT 10
`).all();

console.log(`Plantes avec région native: ${plants.length}`);
plants.forEach(p => {
  console.log(`- ${p.scientific_name}: ${p.native_region}`);
});

// Vérifier les terroirs
console.log('\n=== TERROIRS ===');
const terroirs = db.prepare(`
  SELECT id, name, region, country, latitude, longitude 
  FROM geographic_origins 
  ORDER BY name
`).all();

console.log(`Total: ${terroirs.length} terroirs`);
terroirs.slice(0, 5).forEach(t => {
  console.log(`- ${t.name} (${t.region}, ${t.country})`);
  console.log(`  GPS: ${t.latitude || 'N/A'}, ${t.longitude || 'N/A'}`);
});

db.close();
