/**
 * Script pour :
 * 1. Mettre à jour les molécules terpéniques avec données scientifiques complètes
 * 2. Créer les liaisons molécules-plantes pour le Protium
 * 3. Créer le terroir Amazonie (Putumayo, Vaupés)
 * 4. Documenter l'Ambil (tabac rituel)
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("=== 1. Mise à jour des molécules terpéniques du Protium ===\n");

  // Données scientifiques des terpènes du Protium heptaphyllum
  const terpeneData = [
    {
      name: "α-Pinène",
      iupacName: "(1S,5S)-2,6,6-trimethylbicyclo[3.1.1]hept-2-ene",
      casNumber: "80-56-8",
      chemicalClass: "monoterpene",
      family: "Monoterpène",
      chemicalFormula: "C₁₀H₁₆",
      molecularWeight: 136,
      boilingPoint: 156,
      olfactiveProfile: "Frais, résineux, pin, térébenthine, boisé",
      emotionalResonance: "Clarté mentale, énergie, connexion à la forêt",
      botanicalSources: "Protium heptaphyllum, Pin, Romarin, Eucalyptus, Sauge",
      therapeuticProperties: "Anti-inflammatoire, bronchodilatateur, antimicrobien",
      radarIntensity: 65,
      radarFreshness: 85,
      radarWarmth: 30,
      radarSweetness: 15,
      radarSpiciness: 20,
      radarEarthiness: 45
    },
    {
      name: "β-Pinène",
      iupacName: "(1S,5S)-6,6-dimethyl-2-methylenebicyclo[3.1.1]heptane",
      casNumber: "127-91-3",
      chemicalClass: "monoterpene",
      family: "Monoterpène",
      chemicalFormula: "C₁₀H₁₆",
      molecularWeight: 136,
      boilingPoint: 166,
      olfactiveProfile: "Boisé, pin, herbe fraîche, légèrement épicé",
      emotionalResonance: "Ancrage, stabilité, respiration profonde",
      botanicalSources: "Protium heptaphyllum, Pin, Persil, Romarin, Basilic",
      therapeuticProperties: "Expectorant, anti-inflammatoire, antidépresseur",
      radarIntensity: 55,
      radarFreshness: 75,
      radarWarmth: 35,
      radarSweetness: 20,
      radarSpiciness: 25,
      radarEarthiness: 50
    },
    {
      name: "Limonène",
      iupacName: "(4R)-1-methyl-4-(1-methylethenyl)cyclohexene",
      casNumber: "5989-27-5",
      chemicalClass: "monoterpene",
      family: "Monoterpène",
      chemicalFormula: "C₁₀H₁₆",
      molecularWeight: 136,
      boilingPoint: 176,
      olfactiveProfile: "Citron, orange, agrumes, frais, pétillant",
      emotionalResonance: "Joie, optimisme, énergie solaire, légèreté",
      botanicalSources: "Protium heptaphyllum, Citrus (orange, citron), Menthe, Genévrier",
      therapeuticProperties: "Anxiolytique, antidépresseur, gastroprotecteur, antioxydant",
      radarIntensity: 70,
      radarFreshness: 95,
      radarWarmth: 25,
      radarSweetness: 60,
      radarSpiciness: 10,
      radarEarthiness: 15
    },
    {
      name: "β-Caryophyllène",
      iupacName: "(1R,4E,9S)-4,11,11-trimethyl-8-methylenebicyclo[7.2.0]undec-4-ene",
      casNumber: "87-44-5",
      chemicalClass: "sesquiterpene",
      family: "Sesquiterpène",
      chemicalFormula: "C₁₅H₂₄",
      molecularWeight: 204,
      boilingPoint: 268,
      olfactiveProfile: "Épicé, boisé, poivré, clou de girofle, sec",
      emotionalResonance: "Chaleur intérieure, protection, enracinement",
      botanicalSources: "Protium heptaphyllum, Poivre noir, Clou de girofle, Houblon, Cannabis",
      therapeuticProperties: "Anti-inflammatoire (agoniste CB2), analgésique, gastroprotecteur",
      radarIntensity: 60,
      radarFreshness: 25,
      radarWarmth: 80,
      radarSweetness: 20,
      radarSpiciness: 85,
      radarEarthiness: 65
    }
  ];

  // Créer ou mettre à jour les molécules avec données complètes
  for (const terpene of terpeneData) {
    // Vérifier si la molécule existe avec le bon CAS
    const [existing] = await connection.execute(
      "SELECT id FROM molecules WHERE cas_number = ?",
      [terpene.casNumber]
    );

    if (existing.length > 0) {
      // Mettre à jour la molécule existante
      await connection.execute(
        `UPDATE molecules SET 
          name = ?,
          iupac_name = ?,
          chemical_class = ?,
          family = ?,
          chemicalFormula = ?,
          molecularWeight = ?,
          boilingPoint = ?,
          olfactiveProfile = ?,
          emotionalResonance = ?,
          botanicalSources = ?,
          therapeuticProperties = ?,
          radar_intensity = ?,
          radar_freshness = ?,
          radar_warmth = ?,
          radar_sweetness = ?,
          radar_spiciness = ?,
          radar_earthiness = ?
        WHERE cas_number = ?`,
        [
          terpene.name,
          terpene.iupacName,
          terpene.chemicalClass,
          terpene.family,
          terpene.chemicalFormula,
          terpene.molecularWeight,
          terpene.boilingPoint,
          terpene.olfactiveProfile,
          terpene.emotionalResonance,
          terpene.botanicalSources,
          terpene.therapeuticProperties,
          terpene.radarIntensity,
          terpene.radarFreshness,
          terpene.radarWarmth,
          terpene.radarSweetness,
          terpene.radarSpiciness,
          terpene.radarEarthiness,
          terpene.casNumber
        ]
      );
      console.log(`✓ Molécule mise à jour: ${terpene.name} (CAS: ${terpene.casNumber})`);
    } else {
      // Créer une nouvelle molécule
      await connection.execute(
        `INSERT INTO molecules (
          name, iupac_name, cas_number, chemical_class, family, chemicalFormula,
          molecularWeight, boilingPoint, olfactiveProfile, emotionalResonance,
          botanicalSources, therapeuticProperties,
          radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          terpene.name,
          terpene.iupacName,
          terpene.casNumber,
          terpene.chemicalClass,
          terpene.family,
          terpene.chemicalFormula,
          terpene.molecularWeight,
          terpene.boilingPoint,
          terpene.olfactiveProfile,
          terpene.emotionalResonance,
          terpene.botanicalSources,
          terpene.therapeuticProperties,
          terpene.radarIntensity,
          terpene.radarFreshness,
          terpene.radarWarmth,
          terpene.radarSweetness,
          terpene.radarSpiciness,
          terpene.radarEarthiness
        ]
      );
      console.log(`✓ Molécule créée: ${terpene.name} (CAS: ${terpene.casNumber})`);
    }
  }

  console.log("\n=== 2. Création des liaisons Protium-Terpènes ===\n");

  // Récupérer l'ID du Protium
  const [protiumResult] = await connection.execute(
    "SELECT id FROM plants WHERE latin_name LIKE '%Protium%' LIMIT 1"
  );
  const protiumId = protiumResult[0]?.id;

  if (!protiumId) {
    console.error("❌ Protium non trouvé dans la base");
    await connection.end();
    return;
  }

  console.log(`Protium ID: ${protiumId}`);

  // Données de liaison avec pourcentages typiques dans la résine de Protium
  const protiumTerpeneLinks = [
    { casNumber: "80-56-8", percentageInOil: 15.5, plantPart: "résine", isMainSource: 1 },
    { casNumber: "127-91-3", percentageInOil: 8.2, plantPart: "résine", isMainSource: 1 },
    { casNumber: "5989-27-5", percentageInOil: 12.8, plantPart: "résine", isMainSource: 1 },
    { casNumber: "87-44-5", percentageInOil: 18.5, plantPart: "résine", isMainSource: 1 }
  ];

  for (const link of protiumTerpeneLinks) {
    // Récupérer l'ID de la molécule
    const [molResult] = await connection.execute(
      "SELECT id, name FROM molecules WHERE cas_number = ?",
      [link.casNumber]
    );

    if (molResult.length === 0) {
      console.log(`⚠ Molécule CAS ${link.casNumber} non trouvée`);
      continue;
    }

    const moleculeId = molResult[0].id;
    const moleculeName = molResult[0].name;

    // Vérifier si la liaison existe déjà
    const [existingLink] = await connection.execute(
      "SELECT id FROM molecule_plant_sources WHERE molecule_id = ? AND plant_id = ?",
      [moleculeId, protiumId]
    );

    if (existingLink.length === 0) {
      await connection.execute(
        `INSERT INTO molecule_plant_sources (
          molecule_id, plant_id, plant_part, percentage_in_oil, is_main_source, is_primary_source,
          best_extraction_method, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          moleculeId,
          protiumId,
          link.plantPart,
          link.percentageInOil,
          link.isMainSource,
          1,
          "Hydrodistillation, CO₂ supercritique",
          `Terpène majeur de la résine de Protium heptaphyllum (breu branco). Composition typique de l'oléorésine amazonienne.`
        ]
      );
      console.log(`✓ Liaison créée: ${moleculeName} → Protium (${link.percentageInOil}%)`);
    } else {
      console.log(`⚠ Liaison existe déjà: ${moleculeName} → Protium`);
    }
  }

  console.log("\n=== 3. Création du Terroir Amazonie ===\n");

  // Créer le terroir principal Amazonie
  const amazoniaTerroir = {
    terroirId: "TER-COL-AMA",
    name: "Amazonie Colombienne",
    country: "Colombie",
    region: "Amazonie",
    subRegion: "Putumayo, Vaupés, Caquetá",
    latitude: -1.0,
    longitude: -72.5,
    altitude: "100-500m",
    climateType: "equatorial",
    avgTemperature: "24-28°C",
    annualRainfall: "3000-4500mm",
    humidity: "80-95%",
    soilType: "alluvial",
    soilPh: "4.5-6.0",
    soilCharacteristics: "Sols ferralitiques, riches en matière organique, drainage variable. Présence de várzea (plaines inondables) et terra firme (terres hautes).",
    mainCrops: JSON.stringify(["Protium heptaphyllum", "Copaifera", "Erythroxylum coca", "Nicotiana tabacum", "Hevea brasiliensis"]),
    productionHistory: "Région ancestrale des peuples indigènes (Uitoto, Muinane, Bora, Andoke) avec traditions millénaires d'utilisation des résines, tabacs et plantes rituelles. Centre historique de la production de caoutchouc (1870-1920). Aujourd'hui, zone de conservation et de pratiques traditionnelles.",
    qualityRating: "exceptional",
    reputation: "Terroir unique pour les résines aromatiques (copal, breu), les tabacs rituels (ambil, mambe) et les plantes médicinales. Biodiversité exceptionnelle avec nombreuses espèces endémiques.",
    notes: "Zone de confluence entre les bassins de l'Amazone et de l'Orénoque. Importance culturelle majeure pour les traditions olfactives amérindiennes. Accès difficile, production artisanale."
  };

  // Vérifier si le terroir existe
  const [existingTerroir] = await connection.execute(
    "SELECT id FROM terroirs WHERE terroir_id = ?",
    [amazoniaTerroir.terroirId]
  );

  if (existingTerroir.length === 0) {
    await connection.execute(
      `INSERT INTO terroirs (
        terroir_id, name, country, region, sub_region, latitude, longitude, altitude,
        climate_type, avg_temperature, annual_rainfall, humidity,
        soil_type, soil_ph, soil_characteristics,
        main_crops, production_history, quality_rating, reputation, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        amazoniaTerroir.terroirId,
        amazoniaTerroir.name,
        amazoniaTerroir.country,
        amazoniaTerroir.region,
        amazoniaTerroir.subRegion,
        amazoniaTerroir.latitude,
        amazoniaTerroir.longitude,
        amazoniaTerroir.altitude,
        amazoniaTerroir.climateType,
        amazoniaTerroir.avgTemperature,
        amazoniaTerroir.annualRainfall,
        amazoniaTerroir.humidity,
        amazoniaTerroir.soilType,
        amazoniaTerroir.soilPh,
        amazoniaTerroir.soilCharacteristics,
        amazoniaTerroir.mainCrops,
        amazoniaTerroir.productionHistory,
        amazoniaTerroir.qualityRating,
        amazoniaTerroir.reputation,
        amazoniaTerroir.notes
      ]
    );
    console.log(`✓ Terroir créé: ${amazoniaTerroir.name}`);
  } else {
    console.log(`⚠ Terroir existe déjà: ${amazoniaTerroir.name}`);
  }

  // Créer les sous-terroirs Putumayo et Vaupés
  const subTerroirs = [
    {
      terroirId: "TER-COL-PUT",
      name: "Putumayo",
      country: "Colombie",
      region: "Amazonie",
      subRegion: "Département du Putumayo",
      latitude: 0.5,
      longitude: -76.0,
      altitude: "200-1000m",
      climateType: "equatorial",
      avgTemperature: "22-26°C",
      annualRainfall: "3500-4500mm",
      humidity: "85-95%",
      soilType: "alluvial",
      soilPh: "4.5-5.5",
      soilCharacteristics: "Piémont andin, transition entre Andes et Amazonie. Sols volcaniques fertiles en altitude, ferralitiques en plaine.",
      mainCrops: JSON.stringify(["Erythroxylum coca", "Nicotiana tabacum", "Protium", "Yagé (Banisteriopsis caapi)"]),
      productionHistory: "Territoire ancestral des peuples Inga, Kamëntšá, Siona et Cofán. Centre de la tradition du yagé et du mambe. Zone de transition écologique unique.",
      qualityRating: "exceptional",
      reputation: "Terroir réputé pour la qualité exceptionnelle du tabac rituel et des plantes enthéogènes. Traditions chamaniques vivantes.",
      notes: "Accès par Mocoa ou Puerto Asís. Présence de communautés indigènes avec savoirs traditionnels préservés."
    },
    {
      terroirId: "TER-COL-VAU",
      name: "Vaupés",
      country: "Colombie",
      region: "Amazonie",
      subRegion: "Département du Vaupés",
      latitude: 0.5,
      longitude: -70.5,
      altitude: "100-300m",
      climateType: "equatorial",
      avgTemperature: "25-28°C",
      annualRainfall: "3000-4000mm",
      humidity: "80-90%",
      soilType: "sandy",
      soilPh: "4.0-5.0",
      soilCharacteristics: "Sols sableux du bouclier guyanais, pauvres en nutriments mais riches en espèces endémiques. Forêt de caatinga amazonienne.",
      mainCrops: JSON.stringify(["Protium heptaphyllum", "Copaifera", "Hevea", "Manioc amer"]),
      productionHistory: "Territoire des peuples Tukano, Desana, Cubeo et Makuna. Centre de la tradition du mambe et de l'ambil. Zone de confluence des rios Vaupés et Apaporis.",
      qualityRating: "exceptional",
      reputation: "Terroir isolé avec biodiversité exceptionnelle. Traditions du mambeadero (cercle de parole avec coca et tabac) préservées.",
      notes: "Accès uniquement par voie fluviale ou aérienne (Mitú). Zone de haute importance culturelle et écologique."
    }
  ];

  for (const terroir of subTerroirs) {
    const [existing] = await connection.execute(
      "SELECT id FROM terroirs WHERE terroir_id = ?",
      [terroir.terroirId]
    );

    if (existing.length === 0) {
      await connection.execute(
        `INSERT INTO terroirs (
          terroir_id, name, country, region, sub_region, latitude, longitude, altitude,
          climate_type, avg_temperature, annual_rainfall, humidity,
          soil_type, soil_ph, soil_characteristics,
          main_crops, production_history, quality_rating, reputation, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          terroir.terroirId,
          terroir.name,
          terroir.country,
          terroir.region,
          terroir.subRegion,
          terroir.latitude,
          terroir.longitude,
          terroir.altitude,
          terroir.climateType,
          terroir.avgTemperature,
          terroir.annualRainfall,
          terroir.humidity,
          terroir.soilType,
          terroir.soilPh,
          terroir.soilCharacteristics,
          terroir.mainCrops,
          terroir.productionHistory,
          terroir.qualityRating,
          terroir.reputation,
          terroir.notes
        ]
      );
      console.log(`✓ Sous-terroir créé: ${terroir.name}`);
    } else {
      console.log(`⚠ Sous-terroir existe déjà: ${terroir.name}`);
    }
  }

  console.log("\n=== 4. Documentation de l'Ambil (tabac rituel) ===\n");

  // Créer l'entrée pour l'Ambil dans la table plants
  const ambilData = {
    name: "Ambil",
    latinName: "Nicotiana tabacum (préparation)",
    family: "Solanaceae",
    category: "tabac",
    origin: "Amazonie colombienne (Putumayo, Vaupés, Caquetá)",
    habitat: "Forêt tropicale humide amazonienne. Cultivé dans les chagras (jardins traditionnels) des communautés indigènes.",
    olfactiveSignature: "Fumé intense, terreux profond, mélasse, cendres végétales, notes minérales salines. Arrière-fond de caramel brûlé et de bois carbonisé.",
    dominantMolecules: JSON.stringify(["Nicotine", "Nornicotine", "Anabasine", "Cotinine", "Solanesol"]),
    traditionalUse: `L'ambil est une préparation concentrée de tabac utilisée par les peuples indigènes d'Amazonie (Uitoto, Muinane, Bora, Andoke, Nonuya) dans le contexte du mambeadero - le cercle de parole rituel.

**Préparation traditionnelle:**
1. Les feuilles de tabac sont cuites longuement dans l'eau
2. Le liquide est réduit jusqu'à obtenir une pâte noire épaisse
3. Des cendres de certaines plantes (yarumo, cecropia) sont ajoutées pour alcaliniser
4. La pâte est conservée dans des récipients en calebasse

**Usage rituel:**
- Appliqué sur les gencives ou sous la langue
- Toujours utilisé en combinaison avec le mambe (poudre de coca)
- Consommé pendant les sessions nocturnes de parole et transmission de savoirs
- Considéré comme "la parole du père" (le mambe étant "la parole de la mère")

**Signification culturelle:**
- Médiateur entre le monde visible et invisible
- Outil de concentration et de clarté mentale
- Élément central de la transmission orale des savoirs
- Symbole de l'autorité masculine dans la tradition`,
    absorbeUse: "Étude des préparations traditionnelles de tabac. Intérêt pour les profils moléculaires modifiés par la cuisson prolongée et l'alcalinisation. Recherche sur les notes olfactives uniques (fumé-minéral-terreux).",
    climaticAxis: "bois_disparition",
    conservationStatus: "NE",
    conservationNotes: "Pratique culturelle menacée par l'acculturation et la perte des savoirs traditionnels. Le tabac lui-même n'est pas menacé, mais les variétés locales et les méthodes de préparation traditionnelles sont en danger.",
    notes: `L'ambil représente une transformation profonde du tabac par la cuisson et l'alcalinisation. Cette préparation modifie significativement le profil moléculaire et olfactif de la plante.

**Contexte du mambeadero:**
Le mambeadero est l'espace (physique et rituel) où les hommes se réunissent la nuit pour "mambear" - consommer mambe et ambil tout en échangeant paroles, histoires et savoirs. C'est le cœur de la transmission culturelle chez les peuples du Moyen Caquetá.

**Relation mambe-ambil:**
- Le mambe (poudre de feuilles de coca + cendres) est considéré comme féminin, doux, nourrissant
- L'ambil est considéré comme masculin, fort, clarificateur
- Ensemble, ils forment un couple complémentaire essentiel au rituel

**Intérêt olfactif:**
Le processus de préparation de l'ambil crée des notes olfactives uniques absentes du tabac frais ou simplement séché : réactions de Maillard, caramélisation, formation de composés pyraziniques et furaniques.`
  };

  // Vérifier si l'Ambil existe déjà
  const [existingAmbil] = await connection.execute(
    "SELECT id FROM plants WHERE name = 'Ambil'"
  );

  if (existingAmbil.length === 0) {
    await connection.execute(
      `INSERT INTO plants (
        name, latin_name, family, category, origin, habitat,
        olfactive_signature, dominant_molecules, traditional_use, absorbe_use,
        climatic_axis, conservation_status, conservation_notes, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ambilData.name,
        ambilData.latinName,
        ambilData.family,
        ambilData.category,
        ambilData.origin,
        ambilData.habitat,
        ambilData.olfactiveSignature,
        ambilData.dominantMolecules,
        ambilData.traditionalUse,
        ambilData.absorbeUse,
        ambilData.climaticAxis,
        ambilData.conservationStatus,
        ambilData.conservationNotes,
        ambilData.notes
      ]
    );
    console.log(`✓ Ambil créé dans la base de données`);
  } else {
    console.log(`⚠ Ambil existe déjà dans la base de données`);
  }

  // Lier l'Ambil au terroir Amazonie
  const [ambilResult] = await connection.execute(
    "SELECT id FROM plants WHERE name = 'Ambil'"
  );
  const ambilId = ambilResult[0]?.id;

  const [amazoniaResult] = await connection.execute(
    "SELECT id FROM terroirs WHERE terroir_id = 'TER-COL-AMA'"
  );
  const amazoniaId = amazoniaResult[0]?.id;

  if (ambilId && amazoniaId) {
    const [existingLink] = await connection.execute(
      "SELECT id FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?",
      [ambilId, amazoniaId]
    );

    if (existingLink.length === 0) {
      await connection.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id, importance, notes)
         VALUES (?, ?, ?, ?)`,
        [
          ambilId,
          amazoniaId,
          "signature",
          "L'ambil est une préparation emblématique de l'Amazonie colombienne, centrale dans les traditions rituelles des peuples indigènes."
        ]
      );
      console.log(`✓ Liaison Ambil → Amazonie créée`);
    }
  }

  // Lier le Protium au terroir Amazonie
  if (protiumId && amazoniaId) {
    const [existingLink] = await connection.execute(
      "SELECT id FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?",
      [protiumId, amazoniaId]
    );

    if (existingLink.length === 0) {
      await connection.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id, importance, notes)
         VALUES (?, ?, ?, ?)`,
        [
          protiumId,
          amazoniaId,
          "signature",
          "Le Protium heptaphyllum (breu branco) est une résine emblématique de l'Amazonie, utilisée comme encens et en médecine traditionnelle."
        ]
      );
      console.log(`✓ Liaison Protium → Amazonie créée`);
    }
  }

  console.log("\n=== Résumé des opérations ===");
  console.log("✓ 4 terpènes du Protium mis à jour/créés avec données scientifiques complètes");
  console.log("✓ Liaisons molécules-plantes créées pour le Protium");
  console.log("✓ Terroir Amazonie Colombienne créé avec sous-terroirs Putumayo et Vaupés");
  console.log("✓ Ambil (tabac rituel) documenté avec contexte culturel complet");

  await connection.end();
}

main().catch(console.error);
