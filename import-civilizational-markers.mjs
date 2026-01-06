/**
 * PERFUMUM - Import des marqueurs civilisationnels
 * Jour 5 de la roadmap : Marqueurs pour myrrhe, encens et silphium
 * 
 * Sources :
 * - Papyrus Ebers (1550 av. J.-C.)
 * - Bible (Ancien et Nouveau Testament)
 * - Pline l'Ancien, Histoire naturelle
 * - Hérodote, Histoires
 * - Sources archéologiques (tombes égyptiennes, routes commerciales)
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🏛️ Import des marqueurs civilisationnels - PERFUMUM");
  console.log("=".repeat(60));

  // Récupérer les IDs des plantes
  const [myrrhResult] = await connection.execute(
    "SELECT id FROM plants WHERE latin_name = 'Commiphora myrrha' LIMIT 1"
  );
  const [sacraResult] = await connection.execute(
    "SELECT id FROM plants WHERE latin_name = 'Boswellia sacra' LIMIT 1"
  );
  const [carteriiResult] = await connection.execute(
    "SELECT id FROM plants WHERE latin_name = 'Boswellia carterii' LIMIT 1"
  );
  const [silphiumResult] = await connection.execute(
    "SELECT id FROM plants WHERE latin_name LIKE '%Ferula drudeana%' LIMIT 1"
  );

  const myrrhId = myrrhResult[0]?.id;
  const sacraId = sacraResult[0]?.id;
  const carteriiId = carteriiResult[0]?.id;
  const silphiumId = silphiumResult[0]?.id;

  console.log(`\n📍 IDs des plantes trouvées :`);
  console.log(`  Myrrhe (Commiphora myrrha): ${myrrhId || 'Non trouvé'}`);
  console.log(`  Encens sacré (Boswellia sacra): ${sacraId || 'Non trouvé'}`);
  console.log(`  Encens de Somalie (Boswellia carterii): ${carteriiId || 'Non trouvé'}`);
  console.log(`  Silphium: ${silphiumId || 'Non trouvé'}`);

  // ============================================================================
  // MARQUEURS CIVILISATIONNELS POUR LA MYRRHE
  // ============================================================================
  const myrrhMarkers = [
    {
      plant_id: myrrhId,
      civilization: "Égypte antique",
      period: "Antiquité",
      start_year: -3000,
      end_year: -30,
      usage_type: "funerary",
      historical_significance: "La myrrhe était un composant essentiel du processus d'embaumement égyptien. Elle était utilisée pour préserver les corps des pharaons et des nobles, symbolisant la vie éternelle. Le Papyrus Ebers (1550 av. J.-C.) la mentionne dans de nombreuses préparations médicinales.",
      trade_routes: JSON.stringify(["Route de l'encens", "Mer Rouge", "Nil"]),
      archaeological_evidence: "Résidus de myrrhe trouvés dans les tombes de Toutânkhamon et d'autres pharaons. Amphores et récipients à myrrhe dans les temples de Karnak et Louxor.",
      primary_sources: JSON.stringify([
        { title: "Papyrus Ebers", year: -1550, type: "manuscript" },
        { title: "Textes des Pyramides", year: -2400, type: "inscription" },
        { title: "Livre des Morts", year: -1550, type: "manuscript" }
      ]),
    },
    {
      plant_id: myrrhId,
      civilization: "Grèce antique",
      period: "Antiquité",
      start_year: -800,
      end_year: 400,
      usage_type: "medical",
      historical_significance: "Hippocrate et Dioscoride ont documenté les propriétés médicinales de la myrrhe. Elle était utilisée comme antiseptique, analgésique et pour traiter les affections buccales. Les Grecs l'associaient également à Aphrodite et aux rites funéraires.",
      trade_routes: JSON.stringify(["Route de l'encens", "Méditerranée orientale"]),
      archaeological_evidence: "Mentions dans les textes médicaux grecs. Résidus dans les sites archéologiques de Délos et Athènes.",
      primary_sources: JSON.stringify([
        { title: "De Materia Medica", author: "Dioscoride", year: 70, type: "treatise" },
        { title: "Corpus Hippocraticum", author: "Hippocrate", year: -400, type: "treatise" },
        { title: "Histoires", author: "Hérodote", year: -440, type: "history" }
      ]),
    },
    {
      plant_id: myrrhId,
      civilization: "Rome antique",
      period: "Antiquité",
      start_year: -500,
      end_year: 500,
      usage_type: "commercial",
      historical_significance: "Rome était le plus grand consommateur de myrrhe du monde antique. Elle était utilisée dans les parfums, les onguents, les rituels religieux et la médecine. Pline l'Ancien a documenté son commerce et ses usages dans son Histoire naturelle.",
      trade_routes: JSON.stringify(["Route de l'encens", "Via Maris", "Mer Rouge"]),
      archaeological_evidence: "Entrepôts de myrrhe à Ostie et Rome. Fresques de Pompéi montrant des marchands d'aromates.",
      primary_sources: JSON.stringify([
        { title: "Histoire naturelle", author: "Pline l'Ancien", year: 77, type: "encyclopedia" },
        { title: "Géographie", author: "Strabon", year: 23, type: "geography" }
      ]),
    },
    {
      plant_id: myrrhId,
      civilization: "Traditions bibliques",
      period: "Antiquité",
      start_year: -1000,
      end_year: 100,
      usage_type: "ritual",
      historical_significance: "La myrrhe est mentionnée plus de 150 fois dans la Bible. Elle faisait partie de l'huile d'onction sacrée (Exode 30:23), était l'un des cadeaux des Rois Mages à Jésus (Matthieu 2:11), et fut utilisée pour embaumer son corps (Jean 19:39). Elle symbolise la souffrance, la mort et la résurrection.",
      trade_routes: JSON.stringify(["Route de l'encens", "Caravanes nabatéennes"]),
      archaeological_evidence: "Résidus dans les sites archéologiques de Jérusalem et Qumrân.",
      primary_sources: JSON.stringify([
        { title: "Exode 30:23", type: "scripture" },
        { title: "Cantique des Cantiques", type: "scripture" },
        { title: "Matthieu 2:11", type: "scripture" },
        { title: "Jean 19:39", type: "scripture" }
      ]),
    },
    {
      plant_id: myrrhId,
      civilization: "Inde ancienne",
      period: "Antiquité",
      start_year: -1500,
      end_year: 500,
      usage_type: "medical",
      historical_significance: "En Ayurveda, la myrrhe (Guggulu) est utilisée depuis des millénaires pour traiter l'arthrite, les troubles digestifs et purifier le sang. Elle est considérée comme un rasayana (rajeunissant) et un puissant anti-inflammatoire.",
      trade_routes: JSON.stringify(["Route maritime de l'Inde", "Océan Indien"]),
      archaeological_evidence: "Mentions dans les textes ayurvédiques anciens.",
      primary_sources: JSON.stringify([
        { title: "Charaka Samhita", year: -200, type: "treatise" },
        { title: "Sushruta Samhita", year: -600, type: "treatise" }
      ]),
    },
  ];

  // ============================================================================
  // MARQUEURS CIVILISATIONNELS POUR L'ENCENS (BOSWELLIA)
  // ============================================================================
  const frankincenseMarkers = [
    {
      plant_id: sacraId,
      civilization: "Arabie antique (Route de l'encens)",
      period: "Antiquité",
      start_year: -3000,
      end_year: 500,
      usage_type: "commercial",
      historical_significance: "La Route de l'encens était l'une des routes commerciales les plus importantes de l'Antiquité, reliant le sud de l'Arabie (Hadramaout, Dhofar) à la Méditerranée. L'encens valait son poids en or et a fait la fortune des royaumes de Saba, Qataban et Hadramaout.",
      trade_routes: JSON.stringify(["Route de l'encens terrestre", "Route maritime de la mer Rouge", "Caravanes nabatéennes"]),
      archaeological_evidence: "Ruines de Shabwa et Marib (Yémen), inscriptions nabatéennes à Pétra, entrepôts à Gaza et Alexandrie.",
      primary_sources: JSON.stringify([
        { title: "Périple de la mer Érythrée", year: 60, type: "navigation" },
        { title: "Géographie", author: "Strabon", year: 23, type: "geography" },
        { title: "Histoire naturelle", author: "Pline l'Ancien", year: 77, type: "encyclopedia" }
      ]),
    },
    {
      plant_id: sacraId,
      civilization: "Égypte antique",
      period: "Antiquité",
      start_year: -3000,
      end_year: -30,
      usage_type: "ritual",
      historical_significance: "L'encens était brûlé quotidiennement dans les temples égyptiens pour honorer les dieux, notamment Rê et Osiris. Le Kyphi, parfum sacré égyptien, contenait de l'encens parmi ses 16 ingrédients. Les expéditions vers le Pays de Pount rapportaient de l'encens pour les temples.",
      trade_routes: JSON.stringify(["Expéditions vers Pount", "Mer Rouge"]),
      archaeological_evidence: "Reliefs du temple de Deir el-Bahari montrant l'expédition d'Hatchepsout vers Pount. Résidus d'encens dans les temples de Karnak.",
      primary_sources: JSON.stringify([
        { title: "Reliefs de Deir el-Bahari", year: -1470, type: "inscription" },
        { title: "Papyrus Harris", year: -1150, type: "manuscript" }
      ]),
    },
    {
      plant_id: carteriiId,
      civilization: "Grèce et Rome antiques",
      period: "Antiquité",
      start_year: -800,
      end_year: 500,
      usage_type: "ritual",
      historical_significance: "L'encens (libanos en grec, olibanum en latin) était brûlé en offrande aux dieux olympiens et romains. Il symbolisait la prière montant vers les cieux. Les Romains en consommaient des quantités énormes lors des funérailles impériales.",
      trade_routes: JSON.stringify(["Route de l'encens", "Méditerranée"]),
      archaeological_evidence: "Autels à encens dans les temples grecs et romains. Fresques de Pompéi.",
      primary_sources: JSON.stringify([
        { title: "Théogonie", author: "Hésiode", year: -700, type: "poetry" },
        { title: "Histoire naturelle", author: "Pline l'Ancien", year: 77, type: "encyclopedia" }
      ]),
    },
    {
      plant_id: sacraId,
      civilization: "Christianisme",
      period: "Antiquité à nos jours",
      start_year: 0,
      end_year: 2025,
      usage_type: "ritual",
      historical_significance: "L'encens est l'un des trois cadeaux des Rois Mages (Matthieu 2:11), symbolisant la divinité de Jésus. Il est utilisé dans la liturgie catholique et orthodoxe depuis les premiers siècles, représentant les prières des fidèles montant vers Dieu (Apocalypse 8:3-4).",
      trade_routes: JSON.stringify(["Routes commerciales médiévales", "Commerce vénitien et génois"]),
      archaeological_evidence: "Encensoirs dans les églises anciennes, catacombes romaines.",
      primary_sources: JSON.stringify([
        { title: "Matthieu 2:11", type: "scripture" },
        { title: "Apocalypse 8:3-4", type: "scripture" },
        { title: "Constitutions apostoliques", year: 380, type: "liturgy" }
      ]),
    },
    {
      plant_id: sacraId,
      civilization: "Islam",
      period: "Moyen Âge à nos jours",
      start_year: 622,
      end_year: 2025,
      usage_type: "ritual",
      historical_significance: "L'encens (bukhoor) est utilisé dans les mosquées et les maisons pour la purification et l'hospitalité. Le Prophète Muhammad aurait recommandé l'encens pour parfumer les maisons. L'oud et l'encens sont des parfums traditionnels du monde arabe.",
      trade_routes: JSON.stringify(["Routes commerciales arabes", "Océan Indien"]),
      archaeological_evidence: "Encensoirs dans les mosquées historiques, marchés de parfums traditionnels.",
      primary_sources: JSON.stringify([
        { title: "Hadiths sur les parfums", type: "hadith" },
        { title: "Voyages d'Ibn Battuta", year: 1355, type: "travel" }
      ]),
    },
    {
      plant_id: sacraId,
      civilization: "Inde ancienne",
      period: "Antiquité à nos jours",
      start_year: -1500,
      end_year: 2025,
      usage_type: "ritual",
      historical_significance: "L'encens (dhoop) est utilisé dans les rituels hindous (puja) et bouddhistes depuis des millénaires. En Ayurveda, Boswellia serrata (Shallaki) est utilisé pour traiter l'arthrite et l'inflammation. L'encens accompagne les prières et la méditation.",
      trade_routes: JSON.stringify(["Route maritime de l'Inde", "Routes terrestres vers l'Asie"]),
      archaeological_evidence: "Temples hindous et bouddhistes, textes ayurvédiques.",
      primary_sources: JSON.stringify([
        { title: "Charaka Samhita", year: -200, type: "treatise" },
        { title: "Rigveda", year: -1500, type: "scripture" }
      ]),
    },
  ];

  // ============================================================================
  // MARQUEURS CIVILISATIONNELS POUR LE SILPHIUM
  // ============================================================================
  const silphiumMarkers = [
    {
      plant_id: silphiumId,
      civilization: "Cyrénaïque (Libye grecque)",
      period: "Antiquité",
      start_year: -630,
      end_year: 100,
      usage_type: "commercial",
      historical_significance: "Le silphium était la principale richesse de Cyrène, colonie grecque en Libye. Il était si précieux qu'il figurait sur les pièces de monnaie de la cité. La plante ne poussait que dans une bande côtière de 200 km et toutes les tentatives de culture ont échoué.",
      trade_routes: JSON.stringify(["Méditerranée", "Routes commerciales grecques"]),
      archaeological_evidence: "Pièces de monnaie de Cyrène avec représentation du silphium, ruines de Cyrène.",
      primary_sources: JSON.stringify([
        { title: "Histoires", author: "Hérodote", year: -440, type: "history" },
        { title: "Histoire des plantes", author: "Théophraste", year: -300, type: "botany" }
      ]),
    },
    {
      plant_id: silphiumId,
      civilization: "Grèce antique",
      period: "Antiquité",
      start_year: -600,
      end_year: -100,
      usage_type: "medical",
      historical_significance: "Les Grecs utilisaient le silphium comme contraceptif, digestif et remède universel. Hippocrate le recommandait pour de nombreuses affections. La plante était considérée comme un don des dieux et son commerce était strictement contrôlé.",
      trade_routes: JSON.stringify(["Cyrène vers Athènes", "Méditerranée orientale"]),
      archaeological_evidence: "Mentions dans les textes médicaux grecs, représentations sur vases.",
      primary_sources: JSON.stringify([
        { title: "Corpus Hippocraticum", author: "Hippocrate", year: -400, type: "treatise" },
        { title: "Histoire des plantes", author: "Théophraste", year: -300, type: "botany" }
      ]),
    },
    {
      plant_id: silphiumId,
      civilization: "Rome antique",
      period: "Antiquité",
      start_year: -200,
      end_year: 100,
      usage_type: "cosmetic",
      historical_significance: "Les Romains payaient le silphium au poids de l'argent. Il était utilisé en cuisine, en médecine et comme contraceptif. Pline l'Ancien rapporte que la dernière tige connue fut offerte à l'empereur Néron. L'extinction est attribuée à la surexploitation et au surpâturage.",
      trade_routes: JSON.stringify(["Cyrène vers Rome", "Méditerranée"]),
      archaeological_evidence: "Mentions dans les textes romains, absence de la plante après le 1er siècle.",
      primary_sources: JSON.stringify([
        { title: "Histoire naturelle", author: "Pline l'Ancien", year: 77, type: "encyclopedia" },
        { title: "De Re Coquinaria", author: "Apicius", year: 400, type: "cookbook" }
      ]),
    },
  ];

  // ============================================================================
  // IMPORT DES MARQUEURS
  // ============================================================================
  const allMarkers = [...myrrhMarkers, ...frankincenseMarkers, ...silphiumMarkers];
  
  console.log("\n🏛️ Import des marqueurs civilisationnels...");
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const marker of allMarkers) {
    if (!marker.plant_id) {
      console.log(`  ⚠️ Plante non trouvée pour ${marker.civilization}`);
      skipped++;
      continue;
    }

    try {
      // Vérifier si le marqueur existe déjà
      const [existing] = await connection.execute(
        `SELECT id FROM civilizational_markers 
         WHERE plant_id = ? AND civilization = ? AND period = ? LIMIT 1`,
        [marker.plant_id, marker.civilization, marker.period]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️ ${marker.civilization} (${marker.period}) existe déjà`);
        skipped++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO civilizational_markers 
         (plant_id, civilization, period, start_year, end_year, usage_type,
          historical_significance, trade_routes, archaeological_evidence, primary_sources)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [marker.plant_id, marker.civilization, marker.period, marker.start_year, marker.end_year,
         marker.usage_type, marker.historical_significance, marker.trade_routes,
         marker.archaeological_evidence, marker.primary_sources]
      );
      console.log(`  ✅ ${marker.civilization} (${marker.period}) importé`);
      imported++;
    } catch (error) {
      console.error(`  ❌ Erreur pour ${marker.civilization}:`, error.message);
      errors++;
    }
  }

  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'IMPORT DES MARQUEURS CIVILISATIONNELS");
  console.log("=".repeat(60));
  console.log(`  Total marqueurs traités : ${allMarkers.length}`);
  console.log(`  Importés : ${imported}`);
  console.log(`  Ignorés (existants ou plante non trouvée) : ${skipped}`);
  console.log(`  Erreurs : ${errors}`);
  console.log("");
  console.log("  🌍 Civilisations couvertes :");
  const civilizations = [...new Set(allMarkers.map(m => m.civilization))];
  civilizations.forEach(c => console.log(`    - ${c}`));
  console.log("=".repeat(60));

  await connection.end();
  console.log("\n✅ Import terminé avec succès !");
}

main().catch(console.error);
