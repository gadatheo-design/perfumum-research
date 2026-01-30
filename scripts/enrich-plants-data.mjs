/**
 * Script d'enrichissement des données des plantes PERFUMUM
 * - Descriptions olfactives détaillées
 * - Origines géographiques
 * - Molécules manquantes (Carvone, Estragole)
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// ============================================================================
// DONNÉES D'ENRICHISSEMENT - DESCRIPTIONS OLFACTIVES
// ============================================================================

const olfactiveDescriptions = {
  "Bergamote": {
    signature: "Agrume frais et pétillant aux facettes florales et légèrement épicées. Notes de tête vives et lumineuses avec une fraîcheur zestée caractéristique, évoluant vers des nuances de thé Earl Grey et de petitgrain. Fond légèrement amer et aromatique. L'huile essentielle présente des notes vertes herbacées et une légère amertume qui la distingue des autres agrumes.",
    origin: "Calabre (Italie), Côte d'Ivoire, Argentine"
  },
  "Bois de Santal": {
    signature: "Bois crémeux, lacté et velouté aux facettes douces et enveloppantes. Notes de fond persistantes avec une richesse onctueuse et une chaleur subtile. Évoque le lait chaud, la peau douce et les temples anciens. Présente des nuances de rose séchée et de miel. Le santal indien (Mysore) est considéré comme le plus fin avec sa douceur caractéristique.",
    origin: "Mysore (Inde), Australie, Nouvelle-Calédonie, Indonésie"
  },
  "Citron": {
    signature: "Agrume vif et pétillant, fraîcheur citronnée intense et solaire. Notes de tête éclatantes avec un zeste acidulé et une légère amertume de l'écorce. Évoque la propreté, la lumière méditerranéenne et la vivacité. L'huile essentielle présente des facettes vertes et herbacées avec une légère note de bonbon acidulé.",
    origin: "Sicile (Italie), Espagne, Argentine, Californie (USA)"
  },
  "Cèdre de l'Atlas": {
    signature: "Bois sec et noble aux facettes résineuses et légèrement fumées. Notes de fond avec une structure anguleuse et une sécheresse élégante. Évoque les coffres anciens, les crayons de bois et les forêts de montagne. Présente des nuances de cuir et de tabac blond. Plus sec et plus anguleux que le cèdre de Virginie.",
    origin: "Montagnes de l'Atlas (Maroc), Algérie"
  },
  "Encens / Oliban": {
    signature: "Résine sacrée aux facettes balsamiques, citronnées et légèrement poivrées. Notes de fond mystiques avec une fumée douce et une fraîcheur résineuse paradoxale. Évoque les temples, la méditation et les rituels anciens. L'oliban de Somalie est réputé pour sa qualité supérieure avec des notes de citron et de pin.",
    origin: "Somalie, Oman, Yémen, Éthiopie"
  },
  "Eucalyptus globulus": {
    signature: "Fraîcheur camphrée intense et pénétrante aux facettes médicinales et balsamiques. Notes de tête puissantes avec un effet rafraîchissant et décongestionnant. Évoque les forêts australiennes, les baumes et la propreté clinique. Présente des nuances de menthe et de pin avec une légère note terreuse.",
    origin: "Australie, Portugal, Espagne, Chine"
  },
  "Géranium rosat": {
    signature: "Floral rosé aux facettes vertes et légèrement mentholées. Notes de cœur équilibrées entre rose et feuille verte avec une fraîcheur herbacée. Évoque les jardins anglais et les cosmétiques classiques. Le géranium Bourbon (Réunion) est particulièrement prisé pour sa richesse et sa complexité florale-fruitée.",
    origin: "Île de la Réunion (Bourbon), Égypte, Maroc, Chine"
  },
  "Jasmin grandiflorum": {
    signature: "Floral blanc opulent et enivrant aux facettes fruitées et légèrement animales. Notes de cœur sensuelles avec une richesse narcotique et une douceur miellée. Évoque les nuits chaudes, les jardins orientaux et la séduction. Le jasmin de Grasse est considéré comme le plus précieux avec ses nuances de thé et de fruit.",
    origin: "Grasse (France), Égypte, Inde, Maroc"
  },
  "Lavande vraie": {
    signature: "Floral aromatique aux facettes herbacées et légèrement camphrées. Notes de tête fraîches et apaisantes avec une douceur florale caractéristique. Évoque la Provence, les champs violets et la sérénité. La lavande fine de haute altitude présente des notes plus florales et moins camphrées que le lavandin.",
    origin: "Provence (France), Bulgarie, Espagne, Royaume-Uni"
  },
  "Menthe poivrée": {
    signature: "Fraîcheur mentholée intense et pénétrante aux facettes herbacées et légèrement sucrées. Notes de tête vivifiantes avec un effet glacé caractéristique. Évoque la fraîcheur absolue, les bonbons et l'hygiène. Présente des nuances de chlorophylle et une légère chaleur épicée en fond.",
    origin: "États-Unis (Oregon, Washington), Angleterre, France"
  },
  "Orange douce": {
    signature: "Agrume doux et juteux aux facettes sucrées et légèrement florales. Notes de tête joyeuses et solaires avec une rondeur fruitée caractéristique. Évoque les vergers méditerranéens, les fêtes et la gourmandise. Plus douce et moins acide que le citron, avec des nuances de miel et de fleur d'oranger.",
    origin: "Brésil, Floride (USA), Espagne, Italie (Sicile)"
  },
  "Patchouli": {
    signature: "Bois terreux et profond aux facettes camphrées et légèrement chocolatées. Notes de fond persistantes avec une richesse terreuse et une sensualité mystérieuse. Évoque la terre humide, les caves à vin et les années 70. Le patchouli d'Indonésie vieilli développe des notes plus douces et plus boisées.",
    origin: "Indonésie (Sumatra, Java), Inde, Philippines, Chine"
  },
  "Romarin": {
    signature: "Aromatique herbacé aux facettes camphrées et légèrement résineuses. Notes de tête vivifiantes avec une fraîcheur méditerranéenne et une structure ligneuse. Évoque les garrigues, les herbes de Provence et la cuisine méditerranéenne. Le romarin à verbénone est plus doux, celui à camphre plus médicinal.",
    origin: "Espagne, Tunisie, Maroc, France (Provence)"
  },
  "Rose de Damas": {
    signature: "Floral rosé classique aux facettes miellées et légèrement épicées. Notes de cœur opulentes avec une richesse veloutée et une profondeur romantique. Évoque les jardins persans, l'amour et la féminité classique. La rose de Damas bulgare est réputée pour sa complexité et sa profondeur exceptionnelles.",
    origin: "Vallée des Roses (Bulgarie), Turquie, Iran, Maroc"
  },
  "Vétiver": {
    signature: "Racine terreuse et fumée aux facettes boisées et légèrement humides. Notes de fond profondes avec une complexité minérale et une sécheresse élégante. Évoque la terre après la pluie, les sous-bois et la masculinité raffinée. Le vétiver d'Haïti est plus fumé, celui de Java plus frais et plus vert.",
    origin: "Haïti, Java (Indonésie), Île de la Réunion, Inde"
  },
  "Ylang-Ylang": {
    signature: "Floral exotique aux facettes crémeuses et légèrement épicées. Notes de cœur sensuelles avec une richesse narcotique et des nuances de banane et de jasmin. Évoque les îles tropicales, la sensualité et l'exotisme. L'ylang-ylang extra (première distillation) est le plus fin et le plus floral.",
    origin: "Madagascar, Comores, Philippines, Indonésie"
  }
};

// ============================================================================
// DONNÉES D'ENRICHISSEMENT - MOLÉCULES MANQUANTES
// ============================================================================

const newMolecules = [
  {
    name: "Carvone",
    formula: "C10H14O",
    molecularWeight: 150,
    family: "Monoterpène cétonique",
    olfactiveProfile: "Menthe verte fraîche et sucrée (L-carvone) ou carvi épicé et chaud (D-carvone). Notes herbacées avec une douceur caractéristique. La L-carvone évoque la menthe verte et les chewing-gums, tandis que la D-carvone rappelle le carvi, l'aneth et le cumin.",
    iupacName: "(5R)-2-méthyl-5-(prop-1-én-2-yl)cyclohex-2-én-1-one",
    casNumber: "99-49-0",
    chemicalClass: "ketone",
    boilingPoint: 230,
    logP: 3,
    botanicalSources: "Menthe verte (70-80%), Carvi (50-60%), Aneth (30-50%)"
  },
  {
    name: "Estragole",
    formula: "C10H12O",
    molecularWeight: 148,
    family: "Phénylpropanoïde",
    olfactiveProfile: "Anisé doux et herbacé avec des facettes vertes et légèrement épicées. Évoque l'estragon frais, le basilic exotique et la réglisse. Notes sucrées et aromatiques avec une fraîcheur caractéristique.",
    iupacName: "1-méthoxy-4-(prop-2-én-1-yl)benzène",
    casNumber: "140-67-0",
    chemicalClass: "ether",
    boilingPoint: 216,
    logP: 3,
    botanicalSources: "Estragon (60-75%), Basilic exotique (70-85%), Fenouil (3-5%), Anis (1-2%)"
  }
];

// ============================================================================
// ENRICHISSEMENT DES MOLÉCULES EXISTANTES
// ============================================================================

const moleculeEnrichments = {
  "Carvacrol": {
    iupacName: "5-isopropyl-2-méthylphénol",
    casNumber: "499-75-2",
    chemicalClass: "phenol",
    olfactiveProfile: "Phénolique épicé et herbacé aux facettes de thym et d'origan. Notes chaudes et piquantes avec une légère amertume. Évoque les herbes méditerranéennes séchées et les pizzas italiennes.",
    botanicalSources: "Origan (60-80%), Thym (1-5%), Sarriette (40-50%)"
  },
  "Thymol": {
    iupacName: "2-isopropyl-5-méthylphénol",
    casNumber: "89-83-8",
    chemicalClass: "phenol",
    olfactiveProfile: "Phénolique médicinal et herbacé aux facettes de thym frais. Notes chaudes et antiseptiques avec une légère douceur. Évoque les pastilles pour la gorge, les herbes de Provence et la propreté.",
    botanicalSources: "Thym à thymol (30-50%), Origan (trace-5%), Ajowan (35-50%)"
  }
};

// ============================================================================
// NOUVELLES PLANTES À CRÉER
// ============================================================================

const newPlants = [
  {
    name: "Thym",
    latinName: "Thymus vulgaris",
    family: "Lamiaceae",
    category: "aromatique",
    origin: "Bassin méditerranéen (France, Espagne, Maroc)",
    olfactiveSignature: "Aromatique herbacé aux facettes phénoliques et légèrement épicées. Notes de tête puissantes avec une chaleur caractéristique. Évoque les garrigues méditerranéennes, les herbes de Provence et la cuisine du sud. Le thym à thymol est plus médicinal, celui à linalol plus doux et floral.",
    climaticAxis: "bois",
    traditionalUse: "Antiseptique, expectorant, digestif, aromatique culinaire"
  },
  {
    name: "Origan",
    latinName: "Origanum vulgare",
    family: "Lamiaceae",
    category: "aromatique",
    origin: "Méditerranée (Grèce, Turquie, Italie)",
    olfactiveSignature: "Aromatique herbacé aux facettes phénoliques intenses et légèrement camphrées. Notes chaudes et épicées avec une puissance caractéristique. Évoque la pizza italienne, les herbes séchées et la cuisine méditerranéenne. L'origan grec est le plus aromatique.",
    climaticAxis: "bois",
    traditionalUse: "Antiseptique, antioxydant, digestif, aromatique culinaire"
  },
  {
    name: "Basilic",
    latinName: "Ocimum basilicum",
    family: "Lamiaceae",
    category: "aromatique",
    origin: "Inde, Asie du Sud-Est, Méditerranée",
    olfactiveSignature: "Aromatique herbacé aux facettes anisées et légèrement épicées. Notes vertes fraîches avec une douceur caractéristique. Évoque la cuisine italienne, le pesto et les jardins d'été. Le basilic exotique est plus anisé (estragole), le basilic européen plus herbacé (linalol).",
    climaticAxis: "vent",
    traditionalUse: "Digestif, antispasmodique, aromatique culinaire, relaxant"
  },
  {
    name: "Estragon",
    latinName: "Artemisia dracunculus",
    family: "Asteraceae",
    category: "aromatique",
    origin: "Asie centrale, Russie, France",
    olfactiveSignature: "Aromatique anisé aux facettes herbacées et légèrement poivrées. Notes vertes fraîches avec une douceur caractéristique de réglisse. Évoque la sauce béarnaise, les fines herbes et la cuisine française raffinée. L'estragon français est plus fin que le russe.",
    climaticAxis: "vent",
    traditionalUse: "Digestif, antispasmodique, aromatique culinaire, apéritif"
  },
  {
    name: "Menthe verte",
    latinName: "Mentha spicata",
    family: "Lamiaceae",
    category: "aromatique",
    origin: "Europe, Asie, Amérique du Nord",
    olfactiveSignature: "Fraîcheur mentholée douce et sucrée aux facettes herbacées. Notes de tête rafraîchissantes avec une douceur caractéristique. Évoque les chewing-gums, le thé à la menthe marocain et les cocktails. Plus douce et plus sucrée que la menthe poivrée grâce à la carvone.",
    climaticAxis: "vent",
    traditionalUse: "Digestif, rafraîchissant, aromatique culinaire, thé"
  },
  {
    name: "Carvi",
    latinName: "Carum carvi",
    family: "Apiaceae",
    category: "aromatique",
    origin: "Europe centrale et du Nord, Asie",
    olfactiveSignature: "Aromatique épicé aux facettes anisées et légèrement terreuses. Notes chaudes et caractéristiques avec une légère amertume. Évoque le pain de seigle, la choucroute alsacienne et les liqueurs nordiques (aquavit, kümmel).",
    climaticAxis: "bois",
    traditionalUse: "Digestif, carminatif, aromatique culinaire, liqueurs"
  },
  {
    name: "Aneth",
    latinName: "Anethum graveolens",
    family: "Apiaceae",
    category: "aromatique",
    origin: "Méditerranée orientale, Asie occidentale",
    olfactiveSignature: "Aromatique herbacé aux facettes anisées et légèrement citronnées. Notes vertes fraîches avec une douceur caractéristique. Évoque les cornichons, le saumon gravlax et la cuisine scandinave. Les graines sont plus épicées que les feuilles.",
    climaticAxis: "vent",
    traditionalUse: "Digestif, carminatif, aromatique culinaire, conserves"
  },
  {
    name: "Fenouil",
    latinName: "Foeniculum vulgare",
    family: "Apiaceae",
    category: "aromatique",
    origin: "Bassin méditerranéen",
    olfactiveSignature: "Aromatique anisé aux facettes douces et légèrement sucrées. Notes fraîches et caractéristiques avec une rondeur agréable. Évoque la réglisse, les bonbons anisés et la cuisine provençale. Le fenouil doux est plus sucré que le fenouil amer.",
    climaticAxis: "vent",
    traditionalUse: "Digestif, carminatif, galactogène, aromatique culinaire"
  },
  {
    name: "Sarriette",
    latinName: "Satureja montana",
    family: "Lamiaceae",
    category: "aromatique",
    origin: "Bassin méditerranéen (Provence, Balkans)",
    olfactiveSignature: "Aromatique herbacé aux facettes phénoliques et légèrement poivrées. Notes chaudes et épicées avec une puissance caractéristique. Évoque les herbes de Provence, le poivre et la cuisine rustique. La sarriette des montagnes est plus intense que la sarriette des jardins.",
    climaticAxis: "bois",
    traditionalUse: "Antiseptique, digestif, aphrodisiaque, aromatique culinaire"
  },
  {
    name: "Ajowan",
    latinName: "Trachyspermum ammi",
    family: "Apiaceae",
    category: "aromatique",
    origin: "Inde, Iran, Égypte",
    olfactiveSignature: "Aromatique épicé aux facettes de thym et légèrement camphrées. Notes chaudes et puissantes avec une intensité caractéristique. Évoque le thym concentré, les épices indiennes et les currys. Très riche en thymol.",
    climaticAxis: "bois",
    traditionalUse: "Digestif, antiseptique, carminatif, épice culinaire"
  }
];

// ============================================================================
// RELATIONS MOLÉCULE-PLANTE
// ============================================================================

const moleculePlantRelations = [
  // Carvone
  { molecule: "Carvone", plant: "Menthe verte", percentageMin: 50, percentageMax: 70, role: "majeur" },
  { molecule: "Carvone", plant: "Carvi", percentageMin: 50, percentageMax: 60, role: "majeur" },
  { molecule: "Carvone", plant: "Aneth", percentageMin: 30, percentageMax: 50, role: "majeur" },
  // Estragole
  { molecule: "Estragole", plant: "Estragon", percentageMin: 60, percentageMax: 75, role: "majeur" },
  { molecule: "Estragole", plant: "Basilic", percentageMin: 70, percentageMax: 85, role: "majeur" },
  { molecule: "Estragole", plant: "Fenouil", percentageMin: 3, percentageMax: 5, role: "secondaire" },
  // Carvacrol
  { molecule: "Carvacrol", plant: "Origan", percentageMin: 60, percentageMax: 80, role: "majeur" },
  { molecule: "Carvacrol", plant: "Sarriette", percentageMin: 40, percentageMax: 50, role: "majeur" },
  { molecule: "Carvacrol", plant: "Thym", percentageMin: 1, percentageMax: 5, role: "secondaire" },
  // Thymol
  { molecule: "Thymol", plant: "Thym", percentageMin: 30, percentageMax: 50, role: "majeur" },
  { molecule: "Thymol", plant: "Ajowan", percentageMin: 35, percentageMax: 50, role: "majeur" },
  { molecule: "Thymol", plant: "Origan", percentageMin: 0.5, percentageMax: 5, role: "secondaire" }
];

// ============================================================================
// FONCTIONS D'ENRICHISSEMENT
// ============================================================================

async function enrichPlants(conn) {
  console.log("\n📝 Enrichissement des descriptions olfactives et origines...\n");
  
  for (const [plantName, data] of Object.entries(olfactiveDescriptions)) {
    try {
      const [result] = await conn.execute(
        `UPDATE plants SET olfactive_signature = ?, origin = ? WHERE name = ?`,
        [data.signature, data.origin, plantName]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${plantName}: description et origine mises à jour`);
      } else {
        console.log(`⚠️  ${plantName}: plante non trouvée dans la base`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${plantName}:`, error.message);
    }
  }
}

async function createPlants(conn) {
  console.log("\n🌿 Création des plantes manquantes...\n");
  
  for (const plant of newPlants) {
    try {
      // Vérifier si la plante existe déjà
      const [existing] = await conn.execute(
        `SELECT id FROM plants WHERE name = ? OR latin_name = ?`,
        [plant.name, plant.latinName]
      );
      
      if (existing.length > 0) {
        console.log(`⚠️  ${plant.name}: existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      const [result] = await conn.execute(
        `INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, climatic_axis, traditional_use)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [plant.name, plant.latinName, plant.family, plant.category, plant.origin, plant.olfactiveSignature, plant.climaticAxis, plant.traditionalUse]
      );
      
      console.log(`✅ ${plant.name}: créée avec succès (ID: ${result.insertId})`);
    } catch (error) {
      console.error(`❌ Erreur pour ${plant.name}:`, error.message);
    }
  }
}

async function createMolecules(conn) {
  console.log("\n🧬 Création des molécules manquantes...\n");
  
  for (const mol of newMolecules) {
    try {
      // Vérifier si la molécule existe déjà
      const [existing] = await conn.execute(
        `SELECT id FROM molecules WHERE name = ?`,
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`⚠️  ${mol.name}: existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      const [result] = await conn.execute(
        `INSERT INTO molecules (name, formula, molecularWeight, family, olfactiveProfile, iupac_name, cas_number, chemical_class, boilingPoint, logP, botanicalSources)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [mol.name, mol.formula, mol.molecularWeight, mol.family, mol.olfactiveProfile, mol.iupacName, mol.casNumber, mol.chemicalClass, mol.boilingPoint, mol.logP, mol.botanicalSources]
      );
      
      console.log(`✅ ${mol.name}: créée avec succès (ID: ${result.insertId})`);
    } catch (error) {
      console.error(`❌ Erreur pour ${mol.name}:`, error.message);
    }
  }
}

async function enrichExistingMolecules(conn) {
  console.log("\n🔬 Enrichissement des molécules existantes...\n");
  
  for (const [molName, data] of Object.entries(moleculeEnrichments)) {
    try {
      const [result] = await conn.execute(
        `UPDATE molecules SET 
          iupac_name = ?, 
          cas_number = ?, 
          chemical_class = ?, 
          olfactiveProfile = ?,
          botanicalSources = ?
         WHERE name = ?`,
        [data.iupacName, data.casNumber, data.chemicalClass, data.olfactiveProfile, data.botanicalSources, molName]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${molName}: données scientifiques enrichies`);
      } else {
        console.log(`⚠️  ${molName}: molécule non trouvée dans la base`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${molName}:`, error.message);
    }
  }
}

async function createMoleculePlantRelations(conn) {
  console.log("\n🔗 Création des relations molécule-plante...\n");
  
  for (const rel of moleculePlantRelations) {
    try {
      // Récupérer les IDs
      const [molRows] = await conn.execute(
        `SELECT id FROM molecules WHERE name = ?`,
        [rel.molecule]
      );
      
      const [plantRows] = await conn.execute(
        `SELECT id FROM plants WHERE name = ?`,
        [rel.plant]
      );
      
      if (molRows.length === 0) {
        console.log(`⚠️  Molécule ${rel.molecule} non trouvée`);
        continue;
      }
      
      if (plantRows.length === 0) {
        console.log(`⚠️  Plante ${rel.plant} non trouvée`);
        continue;
      }
      
      const moleculeId = molRows[0].id;
      const plantId = plantRows[0].id;
      
      // Vérifier si la relation existe déjà
      const [existing] = await conn.execute(
        `SELECT plant_id FROM plant_molecules WHERE molecule_id = ? AND plant_id = ?`,
        [moleculeId, plantId]
      );
      
      if (existing.length > 0) {
        // Mettre à jour la relation existante
        await conn.execute(
          `UPDATE plant_molecules SET percentage_min = ?, percentage_max = ?, role = ? WHERE molecule_id = ? AND plant_id = ?`,
          [rel.percentageMin, rel.percentageMax, rel.role, moleculeId, plantId]
        );
        console.log(`🔄 ${rel.molecule} ↔ ${rel.plant}: relation mise à jour`);
      } else {
        // Créer la nouvelle relation
        await conn.execute(
          `INSERT INTO plant_molecules (molecule_id, plant_id, percentage_min, percentage_max, role) VALUES (?, ?, ?, ?, ?)`,
          [moleculeId, plantId, rel.percentageMin, rel.percentageMax, rel.role]
        );
        console.log(`✅ ${rel.molecule} ↔ ${rel.plant}: relation créée`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${rel.molecule} ↔ ${rel.plant}:`, error.message);
    }
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("   PERFUMUM — Enrichissement des données botaniques et chimiques");
  console.log("═══════════════════════════════════════════════════════════════\n");
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL non définie");
    process.exit(1);
  }
  
  const conn = await mysql.createConnection(DATABASE_URL);
  
  try {
    // 1. Enrichir les descriptions olfactives et origines des plantes existantes
    await enrichPlants(conn);
    
    // 2. Créer les nouvelles plantes
    await createPlants(conn);
    
    // 3. Créer les molécules manquantes
    await createMolecules(conn);
    
    // 4. Enrichir les molécules existantes
    await enrichExistingMolecules(conn);
    
    // 5. Créer les relations molécule-plante
    await createMoleculePlantRelations(conn);
    
    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("   ✅ Enrichissement terminé avec succès");
    console.log("═══════════════════════════════════════════════════════════════\n");
    
  } catch (error) {
    console.error("❌ Erreur globale:", error);
  } finally {
    await conn.end();
  }
}

main();
