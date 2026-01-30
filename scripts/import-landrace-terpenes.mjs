import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Profils terpéniques des landraces de tabac
const terpeneProfiles = [
  // BASMA (Grèce)
  { landrace_name: "Basma", terpene_name: "Linalol", terpene_category: "Monoterpène alcool", concentration_ppm: 45.2, relative_abundance: 18.5, olfactory_contribution: "Notes florales dominantes, lavande" },
  { landrace_name: "Basma", terpene_name: "Géraniol", terpene_category: "Monoterpène alcool", concentration_ppm: 38.7, relative_abundance: 15.8, olfactory_contribution: "Rose, géranium" },
  { landrace_name: "Basma", terpene_name: "Nérol", terpene_category: "Monoterpène alcool", concentration_ppm: 22.4, relative_abundance: 9.2, olfactory_contribution: "Rose fraîche" },
  { landrace_name: "Basma", terpene_name: "β-Damascénone", terpene_category: "Norisoprénoïde", concentration_ppm: 0.85, relative_abundance: 0.3, olfactory_contribution: "Miel, fruits cuits" },
  
  // LATAKIA (Syrie)
  { landrace_name: "Latakia", terpene_name: "Guaiacol", terpene_category: "Phénol", concentration_ppm: 125.8, relative_abundance: 28.5, olfactory_contribution: "Fumée de bois, créosote" },
  { landrace_name: "Latakia", terpene_name: "4-Méthylguaiacol", terpene_category: "Phénol", concentration_ppm: 89.3, relative_abundance: 20.2, olfactory_contribution: "Fumée épicée" },
  { landrace_name: "Latakia", terpene_name: "Syringol", terpene_category: "Phénol", concentration_ppm: 67.4, relative_abundance: 15.3, olfactory_contribution: "Fumée douce, vanille fumée" },
  { landrace_name: "Latakia", terpene_name: "β-Caryophyllène", terpene_category: "Sesquiterpène", concentration_ppm: 34.2, relative_abundance: 7.8, olfactory_contribution: "Épicé, poivré" },
  
  // PERIQUE (Louisiane)
  { landrace_name: "Perique", terpene_name: "γ-Nonalactone", terpene_category: "Lactone", concentration_ppm: 18.5, relative_abundance: 12.4, olfactory_contribution: "Noix de coco, pêche" },
  { landrace_name: "Perique", terpene_name: "δ-Décalactone", terpene_category: "Lactone", concentration_ppm: 14.2, relative_abundance: 9.5, olfactory_contribution: "Pêche, abricot" },
  { landrace_name: "Perique", terpene_name: "β-Damascénone", terpene_category: "Norisoprénoïde", concentration_ppm: 2.8, relative_abundance: 1.9, olfactory_contribution: "Prune confite, miel" },
  { landrace_name: "Perique", terpene_name: "Indole", terpene_category: "Indole", concentration_ppm: 8.4, relative_abundance: 5.6, olfactory_contribution: "Floral intense, jasmin" },
  { landrace_name: "Perique", terpene_name: "Skatole", terpene_category: "Indole", concentration_ppm: 0.45, relative_abundance: 0.3, olfactory_contribution: "Animal, floral subtil" },
  
  // COROJO (Cuba)
  { landrace_name: "Corojo Original", terpene_name: "β-Caryophyllène", terpene_category: "Sesquiterpène", concentration_ppm: 52.8, relative_abundance: 22.4, olfactory_contribution: "Poivre noir, épicé" },
  { landrace_name: "Corojo Original", terpene_name: "α-Humulène", terpene_category: "Sesquiterpène", concentration_ppm: 38.4, relative_abundance: 16.3, olfactory_contribution: "Houblon, terreux" },
  { landrace_name: "Corojo Original", terpene_name: "Myrcène", terpene_category: "Monoterpène", concentration_ppm: 28.6, relative_abundance: 12.1, olfactory_contribution: "Herbacé, terreux" },
  { landrace_name: "Corojo Original", terpene_name: "Limonène", terpene_category: "Monoterpène", concentration_ppm: 18.2, relative_abundance: 7.7, olfactory_contribution: "Citron, orange" },
  
  // VIRGINIA (USA)
  { landrace_name: "Virginia", terpene_name: "Solanone", terpene_category: "Cétone", concentration_ppm: 35.6, relative_abundance: 18.2, olfactory_contribution: "Tabac doux, miellé" },
  { landrace_name: "Virginia", terpene_name: "β-Damascénone", terpene_category: "Norisoprénoïde", concentration_ppm: 1.8, relative_abundance: 0.9, olfactory_contribution: "Miel, fruits cuits" },
  { landrace_name: "Virginia", terpene_name: "Linalol", terpene_category: "Monoterpène alcool", concentration_ppm: 22.4, relative_abundance: 11.5, olfactory_contribution: "Floral, lavande" },
  
  // IZMIR (Turquie)
  { landrace_name: "Izmir", terpene_name: "Linalol", terpene_category: "Monoterpène alcool", concentration_ppm: 42.8, relative_abundance: 19.2, olfactory_contribution: "Floral, lavande" },
  { landrace_name: "Izmir", terpene_name: "Nérolidol", terpene_category: "Sesquiterpène alcool", concentration_ppm: 28.4, relative_abundance: 12.7, olfactory_contribution: "Boisé, floral" },
  { landrace_name: "Izmir", terpene_name: "α-Terpinéol", terpene_category: "Monoterpène alcool", concentration_ppm: 18.6, relative_abundance: 8.3, olfactory_contribution: "Lilas, floral" },
  
  // YENIDJE (Grèce)
  { landrace_name: "Yenidje", terpene_name: "Géraniol", terpene_category: "Monoterpène alcool", concentration_ppm: 48.2, relative_abundance: 21.5, olfactory_contribution: "Rose, géranium, miel" },
  { landrace_name: "Yenidje", terpene_name: "Citronellol", terpene_category: "Monoterpène alcool", concentration_ppm: 32.6, relative_abundance: 14.5, olfactory_contribution: "Rose, citronelle" },
  { landrace_name: "Yenidje", terpene_name: "Linalol", terpene_category: "Monoterpène alcool", concentration_ppm: 28.4, relative_abundance: 12.7, olfactory_contribution: "Floral, lavande" },
  
  // ESTELÍ (Nicaragua)
  { landrace_name: "Estelí", terpene_name: "β-Caryophyllène", terpene_category: "Sesquiterpène", concentration_ppm: 48.6, relative_abundance: 20.8, olfactory_contribution: "Poivre, épicé" },
  { landrace_name: "Estelí", terpene_name: "α-Humulène", terpene_category: "Sesquiterpène", concentration_ppm: 35.2, relative_abundance: 15.1, olfactory_contribution: "Houblon, terreux" },
  { landrace_name: "Estelí", terpene_name: "Myrcène", terpene_category: "Monoterpène", concentration_ppm: 24.8, relative_abundance: 10.6, olfactory_contribution: "Herbacé, musqué" },
  
  // CAMEROUN
  { landrace_name: "Cameroun", terpene_name: "β-Caryophyllène", terpene_category: "Sesquiterpène", concentration_ppm: 42.4, relative_abundance: 19.5, olfactory_contribution: "Poivre, épicé intense" },
  { landrace_name: "Cameroun", terpene_name: "α-Humulène", terpene_category: "Sesquiterpène", concentration_ppm: 32.8, relative_abundance: 15.1, olfactory_contribution: "Terreux, houblon" },
  { landrace_name: "Cameroun", terpene_name: "Myrcène", terpene_category: "Monoterpène", concentration_ppm: 26.4, relative_abundance: 12.1, olfactory_contribution: "Herbacé, musqué" },
  
  // SUMATRA
  { landrace_name: "Sumatra", terpene_name: "Linalol", terpene_category: "Monoterpène alcool", concentration_ppm: 35.6, relative_abundance: 16.2, olfactory_contribution: "Floral, épicé doux" },
  { landrace_name: "Sumatra", terpene_name: "β-Caryophyllène", terpene_category: "Sesquiterpène", concentration_ppm: 38.2, relative_abundance: 17.4, olfactory_contribution: "Poivre, boisé" },
  { landrace_name: "Sumatra", terpene_name: "Nérolidol", terpene_category: "Sesquiterpène alcool", concentration_ppm: 22.4, relative_abundance: 10.2, olfactory_contribution: "Boisé, floral subtil" },
  
  // CONNECTICUT
  { landrace_name: "Connecticut", terpene_name: "Linalol", terpene_category: "Monoterpène alcool", concentration_ppm: 28.4, relative_abundance: 14.8, olfactory_contribution: "Floral doux, crémeux" },
  { landrace_name: "Connecticut", terpene_name: "Géraniol", terpene_category: "Monoterpène alcool", concentration_ppm: 22.6, relative_abundance: 11.8, olfactory_contribution: "Rose, doux" },
  { landrace_name: "Connecticut", terpene_name: "β-Damascénone", terpene_category: "Norisoprénoïde", concentration_ppm: 1.2, relative_abundance: 0.6, olfactory_contribution: "Miel, fruits" }
];

async function importTerpeneProfiles() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('Import des profils terpéniques des landraces...');
    
    const [landraces] = await connection.execute('SELECT id, name FROM tobacco_landraces');
    const landraceMap = new Map(landraces.map(l => [l.name, l.id]));
    
    await connection.execute('DELETE FROM landrace_terpene_profiles');
    
    let inserted = 0;
    for (const profile of terpeneProfiles) {
      const landraceId = landraceMap.get(profile.landrace_name) || null;
      
      await connection.execute(
        `INSERT INTO landrace_terpene_profiles 
         (landrace_id, landrace_name, terpene_name, terpene_category, 
          concentration_ppm, relative_abundance, olfactory_contribution)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [landraceId, profile.landrace_name, profile.terpene_name, 
         profile.terpene_category, profile.concentration_ppm, 
         profile.relative_abundance, profile.olfactory_contribution]
      );
      inserted++;
    }
    
    console.log(`Import terminé: ${inserted} profils terpéniques importés`);
    
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

importTerpeneProfiles();
