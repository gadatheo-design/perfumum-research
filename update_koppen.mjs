// Script pour mettre à jour les zones climatiques Köppen des 27 plantes
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const koppenData = [
  { id: 420012, name: "Anis étoilé", koppen_zone: "Cfa", koppen_description: "Climat subtropical humide", origin: "Sud de la Chine, Nord du Vietnam", habitat: "Forêts subtropicales humides de montagne", temp_min: 5, temp_max: 30, precip_min: 1000, precip_max: 2000, alt_min: 200, alt_max: 1600 },
  { id: 420001, name: "Bigaradier", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Asie du Sud-Est, naturalisé Méditerranée", habitat: "Zones côtières méditerranéennes, vergers", temp_min: 5, temp_max: 35, precip_min: 400, precip_max: 800, alt_min: 0, alt_max: 800 },
  { id: 420010, name: "Camomille allemande", koppen_zone: "Cfb", koppen_description: "Climat océanique tempéré", origin: "Europe, Asie occidentale", habitat: "Prairies, champs cultivés, friches", temp_min: -10, temp_max: 25, precip_min: 500, precip_max: 1000, alt_min: 0, alt_max: 1500 },
  { id: 420009, name: "Camomille romaine", koppen_zone: "Cfb", koppen_description: "Climat océanique tempéré", origin: "Europe occidentale, Atlantique", habitat: "Pelouses, prairies sèches", temp_min: -5, temp_max: 25, precip_min: 600, precip_max: 1200, alt_min: 0, alt_max: 1000 },
  { id: 330001, name: "Cannabis", koppen_zone: "BSk", koppen_description: "Climat semi-aride froid (steppe)", origin: "Asie centrale (Hindu Kush, Himalaya)", habitat: "Steppes, vallées montagneuses, sols bien drainés", temp_min: -10, temp_max: 35, precip_min: 300, precip_max: 800, alt_min: 500, alt_max: 3000 },
  { id: 390005, name: "Cardamome", koppen_zone: "Am", koppen_description: "Climat tropical de mousson", origin: "Ghâts occidentaux, Inde du Sud", habitat: "Sous-bois des forêts tropicales humides", temp_min: 15, temp_max: 35, precip_min: 1500, precip_max: 4000, alt_min: 600, alt_max: 1500 },
  { id: 360001, name: "Coca amazonienne", koppen_zone: "Af", koppen_description: "Climat équatorial humide", origin: "Bassin amazonien (Colombie, Pérou, Brésil)", habitat: "Forêt tropicale humide, chagras traditionnelles", temp_min: 20, temp_max: 35, precip_min: 2000, precip_max: 4000, alt_min: 100, alt_max: 500 },
  { id: 420006, name: "Coriandre", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Méditerranée orientale, Proche-Orient", habitat: "Terres cultivées, friches, sols calcaires", temp_min: 0, temp_max: 35, precip_min: 300, precip_max: 700, alt_min: 0, alt_max: 1200 },
  { id: 420013, name: "Cumin", koppen_zone: "BWh", koppen_description: "Climat désertique chaud", origin: "Égypte, Moyen-Orient, Iran", habitat: "Zones arides irriguées, oasis", temp_min: 5, temp_max: 40, precip_min: 100, precip_max: 400, alt_min: 0, alt_max: 1500 },
  { id: 420003, name: "Cyprès méditerranéen", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Méditerranée orientale (Grèce, Turquie, Chypre)", habitat: "Collines calcaires, maquis méditerranéen", temp_min: -5, temp_max: 35, precip_min: 400, precip_max: 800, alt_min: 0, alt_max: 1500 },
  { id: 420004, name: "Genévrier commun", koppen_zone: "Dfb", koppen_description: "Climat continental humide à été tempéré", origin: "Hémisphère nord circumpolaire", habitat: "Landes, forêts claires, sols calcaires", temp_min: -30, temp_max: 25, precip_min: 400, precip_max: 1200, alt_min: 0, alt_max: 3500 },
  { id: 390001, name: "Gingembre", koppen_zone: "Am", koppen_description: "Climat tropical de mousson", origin: "Asie du Sud-Est (Inde, Malaisie)", habitat: "Forêts tropicales humides, sols riches", temp_min: 18, temp_max: 35, precip_min: 1500, precip_max: 3000, alt_min: 0, alt_max: 1500 },
  { id: 420011, name: "Immortelle", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Bassin méditerranéen (Corse, Sardaigne, Balkans)", habitat: "Maquis, garrigues, sols secs et rocailleux", temp_min: 0, temp_max: 35, precip_min: 300, precip_max: 700, alt_min: 0, alt_max: 800 },
  { id: 420008, name: "Muscade", koppen_zone: "Af", koppen_description: "Climat équatorial humide", origin: "Îles Banda, Moluques, Indonésie", habitat: "Forêts tropicales humides insulaires", temp_min: 22, temp_max: 32, precip_min: 2000, precip_max: 3500, alt_min: 0, alt_max: 700 },
  { id: 330003, name: "Nicotiana benthamiana", koppen_zone: "BSh", koppen_description: "Climat semi-aride chaud", origin: "Nord de l'Australie", habitat: "Zones semi-arides, sols sablonneux", temp_min: 10, temp_max: 40, precip_min: 200, precip_max: 600, alt_min: 0, alt_max: 500 },
  { id: 330005, name: "Nicotiana sylvestris", koppen_zone: "Cwb", koppen_description: "Climat subtropical d'altitude à hiver sec", origin: "Nord-ouest de l'Argentine (Andes)", habitat: "Forêts de montagne, yungas", temp_min: 5, temp_max: 25, precip_min: 800, precip_max: 1500, alt_min: 1000, alt_max: 2500 },
  { id: 330006, name: "Nicotiana tomentosiformis", koppen_zone: "Aw", koppen_description: "Climat tropical à saison sèche", origin: "Bolivie, nord de l'Argentine", habitat: "Forêts sèches, vallées andines", temp_min: 10, temp_max: 30, precip_min: 500, precip_max: 1200, alt_min: 500, alt_max: 2000 },
  { id: 420002, name: "Orange amère", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Asie du Sud-Est, cultivé Méditerranée", habitat: "Vergers méditerranéens, zones côtières", temp_min: 5, temp_max: 35, precip_min: 400, precip_max: 800, alt_min: 0, alt_max: 600 },
  { id: 420005, name: "Palmarosa", koppen_zone: "Aw", koppen_description: "Climat tropical à saison sèche", origin: "Inde (Deccan, Maharashtra)", habitat: "Prairies tropicales, sols bien drainés", temp_min: 15, temp_max: 40, precip_min: 600, precip_max: 1500, alt_min: 0, alt_max: 1000 },
  { id: 390003, name: "Pin sylvestre", koppen_zone: "Dfb", koppen_description: "Climat continental humide à été tempéré", origin: "Eurasie (Écosse à Sibérie)", habitat: "Forêts boréales, sols sablonneux acides", temp_min: -40, temp_max: 25, precip_min: 400, precip_max: 800, alt_min: 0, alt_max: 2600 },
  { id: 420007, name: "Poivre noir", koppen_zone: "Am", koppen_description: "Climat tropical de mousson", origin: "Côte de Malabar, Inde du Sud", habitat: "Forêts tropicales humides, liane grimpante", temp_min: 20, temp_max: 35, precip_min: 2000, precip_max: 3500, alt_min: 0, alt_max: 1200 },
  { id: 390002, name: "Sauge sclarée", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Bassin méditerranéen, Asie occidentale", habitat: "Coteaux calcaires, prairies sèches", temp_min: -10, temp_max: 35, precip_min: 400, precip_max: 800, alt_min: 0, alt_max: 1500 },
  { id: 330002, name: "Tabac cultivé", koppen_zone: "Aw", koppen_description: "Climat tropical à saison sèche", origin: "Amérique du Sud tropicale (Andes)", habitat: "Terres cultivées, sols fertiles bien drainés", temp_min: 15, temp_max: 35, precip_min: 800, precip_max: 1500, alt_min: 0, alt_max: 2000 },
  { id: 390004, name: "Tea tree", koppen_zone: "Cfa", koppen_description: "Climat subtropical humide", origin: "Nouvelle-Galles du Sud, Australie", habitat: "Zones marécageuses, sols humides", temp_min: 5, temp_max: 35, precip_min: 1000, precip_max: 1800, alt_min: 0, alt_max: 300 },
  { id: 420014, name: "Thym", koppen_zone: "Csa", koppen_description: "Climat méditerranéen à été chaud", origin: "Bassin méditerranéen occidental", habitat: "Garrigues, sols calcaires secs", temp_min: -5, temp_max: 35, precip_min: 300, precip_max: 700, alt_min: 0, alt_max: 1500 },
  { id: 330004, name: "Wild tobacco", koppen_zone: "BSk", koppen_description: "Climat semi-aride froid", origin: "Sud-ouest des États-Unis, nord du Mexique", habitat: "Déserts, zones perturbées après incendies", temp_min: -10, temp_max: 40, precip_min: 150, precip_max: 400, alt_min: 500, alt_max: 2500 },
  { id: 360003, name: "Ambil", koppen_zone: "Af", koppen_description: "Climat équatorial humide", origin: "Amazonie colombienne (Putumayo, Vaupés)", habitat: "Forêt tropicale amazonienne, chagras", temp_min: 22, temp_max: 32, precip_min: 2500, precip_max: 4000, alt_min: 100, alt_max: 400 }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log("=== MISE À JOUR DES ZONES KÖPPEN ===\n");
  
  let updated = 0;
  let errors = 0;
  
  for (const plant of koppenData) {
    try {
      await connection.execute(`
        UPDATE plants SET 
          koppen_zone = ?,
          koppen_description = ?,
          origin = COALESCE(origin, ?),
          habitat = COALESCE(habitat, ?),
          temperature_min = ?,
          temperature_max = ?,
          precipitation_min = ?,
          precipitation_max = ?,
          altitude_min = ?,
          altitude_max = ?
        WHERE id = ?
      `, [
        plant.koppen_zone,
        plant.koppen_description,
        plant.origin,
        plant.habitat,
        plant.temp_min,
        plant.temp_max,
        plant.precip_min,
        plant.precip_max,
        plant.alt_min,
        plant.alt_max,
        plant.id
      ]);
      console.log(`✓ ${plant.name} (${plant.koppen_zone})`);
      updated++;
    } catch (err) {
      console.error(`✗ ${plant.name}: ${err.message}`);
      errors++;
    }
  }
  
  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Plantes mises à jour: ${updated}`);
  console.log(`Erreurs: ${errors}`);
  
  // Vérification
  const [remaining] = await connection.execute(`
    SELECT COUNT(*) as count FROM plants WHERE koppen_zone IS NULL OR koppen_zone = ''
  `);
  console.log(`Plantes sans zone Köppen restantes: ${remaining[0].count}`);
  
  await connection.end();
}

main().catch(console.error);
