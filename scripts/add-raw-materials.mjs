/**
 * Script pour ajouter les huiles essentielles, absolues et extraits CO2 manquants
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Huiles essentielles à ajouter
const RAW_MATERIALS = [
  // Huiles essentielles classiques
  {
    materialId: "RM-HE-LAV-001",
    name: "Huile essentielle de Lavande vraie",
    latinName: "Lavandula angustifolia",
    category: "huile_essentielle",
    plantName: "Lavande vraie",
    plantPart: "fleur",
    originCountry: "France",
    originRegion: "Provence",
    olfactiveFamily: "floral",
    topNotes: ["Lavande", "Herbacé", "Frais"],
    heartNotes: ["Floral", "Camphré léger"],
    baseNotes: ["Boisé doux", "Musqué"],
    description: "Huile essentielle emblématique de la parfumerie française, obtenue par distillation à la vapeur des sommités fleuries."
  },
  {
    materialId: "RM-HE-ROS-001",
    name: "Huile essentielle de Rose de Damas",
    latinName: "Rosa damascena",
    category: "huile_essentielle",
    plantName: "Rose de Damas",
    plantPart: "fleur",
    originCountry: "Bulgarie",
    originRegion: "Vallée des Roses de Kazanlak",
    olfactiveFamily: "floral",
    topNotes: ["Rose fraîche", "Citronné"],
    heartNotes: ["Rose épanouie", "Miel"],
    baseNotes: ["Rose poudrée", "Épicé doux"],
    description: "L'une des huiles essentielles les plus précieuses, nécessitant environ 4 tonnes de pétales pour 1 kg d'huile."
  },
  {
    materialId: "RM-HE-JAS-001",
    name: "Huile essentielle de Jasmin sambac",
    latinName: "Jasminum sambac",
    category: "huile_essentielle",
    plantName: "Jasmin sambac",
    plantPart: "fleur",
    originCountry: "Inde",
    originRegion: "Tamil Nadu",
    olfactiveFamily: "floral",
    topNotes: ["Jasmin frais", "Vert"],
    heartNotes: ["Jasmin intense", "Indolé"],
    baseNotes: ["Musqué", "Animal"],
    description: "Jasmin tropical au parfum envoûtant, plus intense et indolé que le jasmin grandiflorum."
  },
  {
    materialId: "RM-HE-YLA-001",
    name: "Huile essentielle d'Ylang-Ylang extra",
    latinName: "Cananga odorata",
    category: "huile_essentielle",
    plantName: "Ylang-Ylang",
    plantPart: "fleur",
    originCountry: "Madagascar",
    originRegion: "Nossi-Bé",
    olfactiveFamily: "floral",
    topNotes: ["Floral intense", "Jasminé"],
    heartNotes: ["Crémeux", "Épicé"],
    baseNotes: ["Boisé", "Balsamique"],
    description: "Première fraction de distillation, la plus précieuse et la plus florale."
  },
  {
    materialId: "RM-HE-VET-001",
    name: "Huile essentielle de Vétiver",
    latinName: "Chrysopogon zizanioides",
    category: "huile_essentielle",
    plantName: "Vétiver",
    plantPart: "racine",
    originCountry: "Haïti",
    originRegion: "Plaine des Cayes",
    olfactiveFamily: "boise",
    topNotes: ["Terreux", "Fumé"],
    heartNotes: ["Boisé", "Cuiré"],
    baseNotes: ["Ambré", "Musqué"],
    description: "Huile essentielle obtenue des racines, caractéristique des parfums masculins."
  },
  {
    materialId: "RM-HE-PAT-001",
    name: "Huile essentielle de Patchouli",
    latinName: "Pogostemon cablin",
    category: "huile_essentielle",
    plantName: "Patchouli",
    plantPart: "feuille",
    originCountry: "Indonésie",
    originRegion: "Sumatra",
    olfactiveFamily: "boise",
    topNotes: ["Terreux", "Herbacé"],
    heartNotes: ["Boisé", "Camphré"],
    baseNotes: ["Musqué", "Chocolaté"],
    description: "Huile essentielle iconique, améliore avec le temps comme un bon vin."
  },
  {
    materialId: "RM-HE-SAN-001",
    name: "Huile essentielle de Santal de Mysore",
    latinName: "Santalum album",
    category: "huile_essentielle",
    plantName: "Bois de Santal",
    plantPart: "bois",
    originCountry: "Inde",
    originRegion: "Karnataka",
    olfactiveFamily: "boise",
    topNotes: ["Boisé doux", "Lacté"],
    heartNotes: ["Crémeux", "Santal"],
    baseNotes: ["Musqué", "Ambré"],
    description: "Le santal le plus prestigieux, protégé et réglementé par le gouvernement indien."
  },
  {
    materialId: "RM-HE-ENC-001",
    name: "Huile essentielle d'Encens Oliban",
    latinName: "Boswellia sacra",
    category: "huile_essentielle",
    plantName: "Encens / Oliban",
    plantPart: "resine",
    originCountry: "Oman",
    originRegion: "Dhofar",
    olfactiveFamily: "boise",
    topNotes: ["Citronné", "Résineux"],
    heartNotes: ["Encens", "Épicé"],
    baseNotes: ["Balsamique", "Ambré"],
    description: "Huile essentielle sacrée, utilisée depuis l'Antiquité dans les rituels religieux."
  },
  {
    materialId: "RM-HE-BER-001",
    name: "Huile essentielle de Bergamote",
    latinName: "Citrus bergamia",
    category: "huile_essentielle",
    plantName: "Bergamote",
    plantPart: "zeste",
    originCountry: "Italie",
    originRegion: "Calabre",
    olfactiveFamily: "agrume",
    topNotes: ["Agrume", "Pétillant"],
    heartNotes: ["Floral", "Thé"],
    baseNotes: ["Musqué léger"],
    description: "Agrume unique cultivé presque exclusivement en Calabre, signature de l'Eau de Cologne."
  },
  {
    materialId: "RM-HE-CIT-001",
    name: "Huile essentielle de Citron",
    latinName: "Citrus limon",
    category: "huile_essentielle",
    plantName: "Citronnier",
    plantPart: "zeste",
    originCountry: "Italie",
    originRegion: "Sicile",
    olfactiveFamily: "agrume",
    topNotes: ["Citron vif", "Frais"],
    heartNotes: ["Zesté", "Vert"],
    baseNotes: ["Léger"],
    description: "Huile essentielle fraîche et vivifiante, base de nombreuses eaux de Cologne."
  },
  
  // Absolues
  {
    materialId: "RM-AB-ROS-001",
    name: "Absolue de Rose de Mai",
    latinName: "Rosa centifolia",
    category: "absolue",
    plantName: "Rose centifolia",
    plantPart: "fleur",
    originCountry: "France",
    originRegion: "Grasse",
    olfactiveFamily: "floral",
    topNotes: ["Rose fraîche", "Miellé"],
    heartNotes: ["Rose opulente", "Fruité"],
    baseNotes: ["Poudrée", "Épicé"],
    description: "Absolue précieuse de Grasse, plus riche et complexe que l'huile essentielle."
  },
  {
    materialId: "RM-AB-JAS-001",
    name: "Absolue de Jasmin grandiflorum",
    latinName: "Jasminum grandiflorum",
    category: "absolue",
    plantName: "Jasmin grandiflorum",
    plantPart: "fleur",
    originCountry: "France",
    originRegion: "Grasse",
    olfactiveFamily: "floral",
    topNotes: ["Jasmin frais", "Vert"],
    heartNotes: ["Jasmin intense", "Fruité"],
    baseNotes: ["Indolé", "Animal"],
    description: "L'absolue de jasmin la plus prisée, récoltée à l'aube pour préserver son parfum."
  },
  {
    materialId: "RM-AB-TUB-001",
    name: "Absolue de Tubéreuse",
    latinName: "Polianthes tuberosa",
    category: "absolue",
    plantName: "Tubéreuse",
    plantPart: "fleur",
    originCountry: "Inde",
    originRegion: "Tamil Nadu",
    olfactiveFamily: "floral",
    topNotes: ["Floral blanc", "Vert"],
    heartNotes: ["Tubéreuse intense", "Crémeux"],
    baseNotes: ["Musqué", "Beurré"],
    description: "Absolue envoûtante, surnommée 'Reine de la nuit' pour son parfum nocturne."
  },
  {
    materialId: "RM-AB-VAN-001",
    name: "Absolue de Vanille",
    latinName: "Vanilla planifolia",
    category: "absolue",
    plantName: "Vanille",
    plantPart: "fruit",
    originCountry: "Madagascar",
    originRegion: "SAVA",
    olfactiveFamily: "gourmand",
    topNotes: ["Vanille fraîche", "Rhum"],
    heartNotes: ["Vanille intense", "Caramel"],
    baseNotes: ["Balsamique", "Boisé"],
    description: "Absolue précieuse obtenue par extraction des gousses de vanille Bourbon."
  },
  {
    materialId: "RM-AB-MIM-001",
    name: "Absolue de Mimosa",
    latinName: "Acacia dealbata",
    category: "absolue",
    plantName: "Mimosa",
    plantPart: "fleur",
    originCountry: "France",
    originRegion: "Côte d'Azur",
    olfactiveFamily: "floral",
    topNotes: ["Floral poudrée", "Miel"],
    heartNotes: ["Mimosa", "Amande"],
    baseNotes: ["Iris", "Foin"],
    description: "Absolue délicate au parfum poudrée et miellé, emblème de la Côte d'Azur."
  },
  {
    materialId: "RM-AB-FLE-001",
    name: "Absolue de Fleur d'Oranger",
    latinName: "Citrus aurantium",
    category: "absolue",
    plantName: "Bigaradier",
    plantPart: "fleur",
    originCountry: "Maroc",
    originRegion: "Région de Fès-Meknès",
    olfactiveFamily: "floral",
    topNotes: ["Fleur d'oranger", "Vert"],
    heartNotes: ["Néroli", "Miellé"],
    baseNotes: ["Musqué", "Animal léger"],
    description: "Plus riche et complexe que le néroli, avec des facettes animales subtiles."
  },
  
  // Extraits CO2
  {
    materialId: "RM-CO2-GIN-001",
    name: "Extrait CO2 de Gingembre",
    latinName: "Zingiber officinale",
    category: "co2_extract",
    plantName: "Gingembre",
    plantPart: "racine",
    originCountry: "Inde",
    originRegion: "Kerala",
    olfactiveFamily: "epice",
    topNotes: ["Gingembre frais", "Citronné"],
    heartNotes: ["Épicé", "Chaud"],
    baseNotes: ["Boisé", "Terreux"],
    description: "Extraction supercritique préservant les notes fraîches du gingembre."
  },
  {
    materialId: "RM-CO2-CAR-001",
    name: "Extrait CO2 de Cardamome",
    latinName: "Elettaria cardamomum",
    category: "co2_extract",
    plantName: "Cardamome",
    plantPart: "graine",
    originCountry: "Guatemala",
    originRegion: "Alta Verapaz",
    olfactiveFamily: "epice",
    topNotes: ["Cardamome", "Eucalyptus"],
    heartNotes: ["Épicé", "Camphré"],
    baseNotes: ["Boisé", "Ambré"],
    description: "Extraction préservant la fraîcheur et la complexité de la cardamome."
  },
  {
    materialId: "RM-CO2-VAN-001",
    name: "Extrait CO2 de Vanille",
    latinName: "Vanilla planifolia",
    category: "co2_extract",
    plantName: "Vanille",
    plantPart: "fruit",
    originCountry: "Madagascar",
    originRegion: "SAVA",
    olfactiveFamily: "gourmand",
    topNotes: ["Vanille fraîche"],
    heartNotes: ["Vanille crémeuse", "Caramel"],
    baseNotes: ["Balsamique", "Tabac"],
    description: "Extraction CO2 offrant un profil vanillé plus naturel et moins sucré."
  },
  {
    materialId: "RM-CO2-HOP-001",
    name: "Extrait CO2 de Houblon",
    latinName: "Humulus lupulus",
    category: "co2_extract",
    plantName: "Houblon",
    plantPart: "fleur",
    originCountry: "Allemagne",
    originRegion: "Bavière",
    olfactiveFamily: "aromatique",
    topNotes: ["Herbacé", "Agrume"],
    heartNotes: ["Houblon", "Épicé"],
    baseNotes: ["Terreux", "Musqué"],
    description: "Extrait préservant les notes herbacées et légèrement amères du houblon."
  },
  {
    materialId: "RM-CO2-CAC-001",
    name: "Extrait CO2 de Cacao",
    latinName: "Theobroma cacao",
    category: "co2_extract",
    plantName: "Cacao",
    plantPart: "graine",
    originCountry: "Équateur",
    originRegion: "Esmeraldas",
    olfactiveFamily: "gourmand",
    topNotes: ["Cacao frais", "Fruité"],
    heartNotes: ["Chocolat", "Noisette"],
    baseNotes: ["Torréfié", "Boisé"],
    description: "Extraction préservant les notes complexes du cacao fin d'arôme."
  },
  
  // Concrètes
  {
    materialId: "RM-CON-ROS-001",
    name: "Concrète de Rose de Mai",
    latinName: "Rosa centifolia",
    category: "concrete",
    plantName: "Rose centifolia",
    plantPart: "fleur",
    originCountry: "France",
    originRegion: "Grasse",
    olfactiveFamily: "floral",
    topNotes: ["Rose fraîche", "Vert"],
    heartNotes: ["Rose intense"],
    baseNotes: ["Cire", "Miel"],
    description: "Produit intermédiaire avant l'absolue, contenant les cires naturelles."
  },
  {
    materialId: "RM-CON-JAS-001",
    name: "Concrète de Jasmin",
    latinName: "Jasminum grandiflorum",
    category: "concrete",
    plantName: "Jasmin grandiflorum",
    plantPart: "fleur",
    originCountry: "Égypte",
    originRegion: "Haute-Égypte",
    olfactiveFamily: "floral",
    topNotes: ["Jasmin frais"],
    heartNotes: ["Jasmin intense", "Vert"],
    baseNotes: ["Cire", "Indolé"],
    description: "Concrète égyptienne réputée pour son intensité et sa qualité."
  },
  
  // Résinoïdes
  {
    materialId: "RM-RES-BEN-001",
    name: "Résinoïde de Benjoin",
    latinName: "Styrax benzoin",
    category: "resinoid",
    plantName: "Benjoin",
    plantPart: "resine",
    originCountry: "Laos",
    originRegion: "Luang Prabang",
    olfactiveFamily: "balsamique",
    topNotes: ["Vanillé", "Balsamique"],
    heartNotes: ["Ambre", "Chocolat"],
    baseNotes: ["Résineux", "Fumé"],
    description: "Résinoïde au parfum chaud et vanillé, excellent fixateur."
  },
  {
    materialId: "RM-RES-LAB-001",
    name: "Résinoïde de Labdanum",
    latinName: "Cistus ladanifer",
    category: "resinoid",
    plantName: "Ciste ladanifère",
    plantPart: "resine",
    originCountry: "Espagne",
    originRegion: "Andalousie",
    olfactiveFamily: "balsamique",
    topNotes: ["Herbacé", "Aromatique"],
    heartNotes: ["Ambré", "Cuiré"],
    baseNotes: ["Musqué", "Animal"],
    description: "Résinoïde ambré utilisé comme substitut de l'ambre gris."
  }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== AJOUT DES MATIÈRES PREMIÈRES ===\n');
  
  let created = 0;
  let skipped = 0;
  
  for (const rm of RAW_MATERIALS) {
    // Vérifier si la matière première existe déjà
    const [existing] = await connection.query(
      `SELECT id FROM raw_materials WHERE material_id = ? OR name = ?`,
      [rm.materialId, rm.name]
    );
    
    if (existing.length > 0) {
      console.log(`  - Existant: ${rm.name}`);
      skipped++;
      continue;
    }
    
    // Chercher la plante associée
    let plantId = null;
    if (rm.plantName) {
      const [plants] = await connection.query(
        `SELECT id FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1`,
        [`%${rm.plantName}%`, `%${rm.latinName}%`]
      );
      if (plants.length > 0) {
        plantId = plants[0].id;
      }
    }
    
    // Créer la matière première
    await connection.query(
      `INSERT INTO raw_materials (
        material_id, name, latin_name, category, plant_id, plant_part,
        origin_country, origin_region, olfactive_family,
        top_notes, heart_notes, base_notes, olfactive_profile, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        rm.materialId,
        rm.name,
        rm.latinName,
        rm.category,
        plantId,
        rm.plantPart,
        rm.originCountry,
        rm.originRegion,
        rm.olfactiveFamily,
        rm.topNotes ? rm.topNotes.join(', ') : null,
        rm.heartNotes ? rm.heartNotes.join(', ') : null,
        rm.baseNotes ? rm.baseNotes.join(', ') : null,
        rm.description,
        rm.description
      ]
    );
    console.log(`  + Créé: ${rm.name} (${rm.category})`);
    created++;
  }
  
  console.log(`\nMatières premières créées: ${created}`);
  console.log(`Matières premières existantes: ${skipped}`);
  
  await connection.end();
}

main().catch(console.error);
