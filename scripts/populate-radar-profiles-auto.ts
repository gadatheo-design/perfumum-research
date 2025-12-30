import mysql from 'mysql2/promise';

// Fonction pour analyser le profil olfactif et générer les valeurs radar
function generateRadarProfile(name: string, olfactiveProfile: string): {
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
} {
  const profile = (olfactiveProfile || '').toLowerCase();
  const nameLower = name.toLowerCase();
  
  // Valeurs par défaut
  let intensity = 50;
  let freshness = 50;
  let warmth = 50;
  let sweetness = 50;
  let spiciness = 50;
  let earthiness = 50;

  // INTENSITÉ (0-100)
  if (profile.match(/puissant|fort|intense|concentré|pénétrant/)) intensity = 85;
  else if (profile.match(/discret|subtil|léger|délicat|faible/)) intensity = 30;
  else if (profile.match(/moyen|modéré/)) intensity = 55;
  else intensity = 60;

  // FRAÎCHEUR (0-100)
  if (profile.match(/frais|menthe|eucalyptus|camphre|ozone|aquatique|marin|citrus|citron|bergamote|agrume/)) freshness = 85;
  else if (profile.match(/vert|herbacé|feuille|herbe|végétal/)) freshness = 70;
  else if (profile.match(/chaud|fumé|brûlé|torréfié|caramélisé/)) freshness = 20;
  else if (profile.match(/floral|rose|jasmin|lavande/)) freshness = 60;
  else freshness = 45;

  // CHALEUR (0-100)
  if (profile.match(/chaud|fumé|brûlé|torréfié|caramélisé|ambré|résineux|baumier/)) warmth = 85;
  else if (profile.match(/boisé|cèdre|santal|vétiver|patchouli/)) warmth = 75;
  else if (profile.match(/frais|menthe|eucalyptus|camphre|ozone/)) warmth = 20;
  else if (profile.match(/floral|rose|jasmin/)) warmth = 40;
  else warmth = 50;

  // DOUCEUR (0-100)
  if (profile.match(/sucré|miel|caramel|vanille|doux|lacté|crémeux|lait/)) sweetness = 80;
  else if (profile.match(/fruité|pêche|abricot|prune|pomme/)) sweetness = 70;
  else if (profile.match(/floral|rose|jasmin|muguet/)) sweetness = 65;
  else if (profile.match(/amer|âcre|piquant|acide/)) sweetness = 25;
  else if (profile.match(/sec|astringent/)) sweetness = 30;
  else sweetness = 45;

  // ÉPICES (0-100)
  if (profile.match(/épicé|poivre|clou de girofle|cannelle|gingembre|piquant|piment/)) spiciness = 85;
  else if (profile.match(/anisé|anis|fenouil|réglisse/)) spiciness = 70;
  else if (profile.match(/aromatique|herbes|thym|romarin/)) spiciness = 60;
  else if (profile.match(/doux|sucré|lacté|crémeux/)) spiciness = 20;
  else if (profile.match(/floral|rose|jasmin/)) spiciness = 25;
  else spiciness = 40;

  // TERREUX (0-100)
  if (profile.match(/terreux|terre|sol|humus|champignon|mousse|sous-bois/)) earthiness = 90;
  else if (profile.match(/boisé|cèdre|santal|vétiver|patchouli/)) earthiness = 75;
  else if (profile.match(/minéral|pierre|roche|pétrichor|géosmine/)) earthiness = 85;
  else if (profile.match(/fumé|tabac|cuir/)) earthiness = 70;
  else if (profile.match(/floral|rose|jasmin|muguet/)) earthiness = 15;
  else if (profile.match(/citrus|agrume|frais/)) earthiness = 20;
  else earthiness = 45;

  return {
    intensity,
    freshness,
    warmth,
    sweetness,
    spiciness,
    earthiness
  };
}

async function populateRadarProfiles() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  console.log('\n🔄 Récupération des molécules sans profil radar...\n');
  
  const [rows] = await connection.execute(`
    SELECT id, name, olfactiveProfile 
    FROM molecules 
    WHERE radar_intensity = 50 
      AND radar_freshness = 50 
      AND radar_warmth = 50 
      AND radar_sweetness = 50 
      AND radar_spiciness = 50 
      AND radar_earthiness = 50
    ORDER BY name
  `);

  const molecules = rows as any[];
  console.log(`📊 ${molecules.length} molécules à traiter\n`);

  let updated = 0;
  
  for (const molecule of molecules) {
    const radar = generateRadarProfile(molecule.name, molecule.olfactiveProfile);
    
    await connection.execute(`
      UPDATE molecules 
      SET radar_intensity = ?,
          radar_freshness = ?,
          radar_warmth = ?,
          radar_sweetness = ?,
          radar_spiciness = ?,
          radar_earthiness = ?
      WHERE id = ?
    `, [
      radar.intensity,
      radar.freshness,
      radar.warmth,
      radar.sweetness,
      radar.spiciness,
      radar.earthiness,
      molecule.id
    ]);

    updated++;
    
    if (updated % 10 === 0) {
      console.log(`✅ ${updated}/${molecules.length} molécules mises à jour...`);
    }
  }

  console.log(`\n✨ Terminé ! ${updated} profils radar générés\n`);
  
  // Afficher quelques exemples
  console.log('📋 Exemples de profils générés:\n');
  const [examples] = await connection.execute(`
    SELECT name, olfactiveProfile,
           radar_intensity, radar_freshness, radar_warmth,
           radar_sweetness, radar_spiciness, radar_earthiness
    FROM molecules 
    WHERE id IN (SELECT id FROM molecules ORDER BY RAND() LIMIT 5)
  `);

  (examples as any[]).forEach(m => {
    console.log(`🧪 ${m.name}`);
    console.log(`   Profil: ${m.olfactiveProfile?.substring(0, 50)}...`);
    console.log(`   Radar: I=${m.radar_intensity} F=${m.radar_freshness} C=${m.radar_warmth} D=${m.radar_sweetness} E=${m.radar_spiciness} T=${m.radar_earthiness}`);
    console.log('');
  });
  
  await connection.end();
}

populateRadarProfiles().catch(console.error);
