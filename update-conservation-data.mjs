/**
 * PERFUMUM - Mise à jour des données de conservation IUCN/CITES
 * Basé sur les recherches effectuées le 8 janvier 2026
 * 
 * Sources :
 * - IUCN Red List Version 2025-2
 * - CITES CoP20 (Samarkand, novembre-décembre 2025)
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🔄 Mise à jour des données de conservation - PERFUMUM");
  console.log("=".repeat(60));

  // Données de mise à jour basées sur les recherches IUCN/CITES 2025
  const updates = [
    // RÉSINES
    {
      latin_name: "Bursera spp.",
      name: "Copal",
      conservation_status: "VU",
      cites_appendix: "NONE",
      conservation_notes: "Le genre Bursera comprend plus de 100 espèces. Selon l'IUCN, 67% des taxa de Bursera sont listés comme menacés. Bursera altijuga est classée EN (Endangered). La perte d'habitat constitue la menace principale.",
      threat_factors: JSON.stringify({ habitat_loss: true, overharvesting: true }),
      sustainable_alternatives: "Copal de culture, résines synthétiques, autres résines balsamiques",
      last_assessment_year: 2024
    },
    {
      latin_name: "Liquidambar orientalis",
      name: "Styrax liquide",
      conservation_status: "EN",
      cites_appendix: "NONE",
      conservation_notes: "Espèce relique tertiaire endémique de la Méditerranée orientale (Turquie, Rhodes). Forêts sévèrement détruites au cours des 200 dernières années. Programmes de conservation en cours en Turquie incluant des plans d'action pour la restauration.",
      threat_factors: JSON.stringify({ habitat_loss: true, climate_change: true, overharvesting: true }),
      sustainable_alternatives: "Styrax benzoin (benjoin de Sumatra), synthèse de vanilline et cinnamates, tolu balsam",
      last_assessment_year: 2018
    },
    {
      latin_name: "Boswellia rivae",
      name: "Encens de Rivae",
      conservation_status: "LC",
      cites_appendix: "NONE",
      conservation_notes: "Statut réévalué à LC (Least Concern) selon IUCN 2025-2. Populations stables. Espèce prometteuse comme 'encens alternatif' durable. Distribution: nord du Kenya, Éthiopie, nord de la Somalie.",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: "Peut servir d'alternative durable aux autres espèces de Boswellia menacées",
      last_assessment_year: 2025
    },
    {
      latin_name: "Commiphora guidottii",
      name: "Opoponax (Myrrhe douce)",
      conservation_status: "DD",
      cites_appendix: "NONE",
      conservation_notes: "Données insuffisantes sur l'état des populations. Exploitation commerciale croissante pour le marché de la parfumerie. Souvent confondu avec la myrrhe vraie (C. myrrha). Plus doux et moins amer que la myrrhe.",
      threat_factors: JSON.stringify({ overharvesting: true, climate_change: true }),
      sustainable_alternatives: "Myrrhe (C. myrrha), benjoin, résines synthétiques",
      last_assessment_year: 2018
    },
    {
      latin_name: "Commiphora wightii",
      name: "Guggul",
      conservation_status: "CR",
      cites_appendix: "II",
      conservation_notes: "Déclin de plus de 80% en 20 ans. NOUVEAU: Inscrit à l'Annexe II de la CITES lors de la CoP20 (décembre 2025), entrée en vigueur mars 2026. Commerce international strictement régulé. Permis d'exportation requis.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Extraits de culture, alternatives synthétiques pour usage pharmaceutique",
      last_assessment_year: 2017
    },
    // BOIS
    {
      latin_name: "Aquilaria crassna",
      name: "Bois d'agar",
      conservation_status: "CR",
      cites_appendix: "II",
      conservation_notes: "En danger critique avec populations décroissantes. Toutes les espèces d'Aquilaria sont inscrites à l'Annexe II de la CITES. Exploitation illégale massive pour le marché du parfum de luxe. Moins de 2% des arbres sauvages produisent de l'oud.",
      threat_factors: JSON.stringify({ overharvesting: true, illegal_trade: true, habitat_loss: true }),
      sustainable_alternatives: "Oud de plantation, inoculation artificielle, alternatives synthétiques (Iso E Super, Cashmeran)",
      last_assessment_year: 2025
    },
    {
      latin_name: "Santalum spicatum",
      name: "Sandalwood australien",
      conservation_status: "VU",
      cites_appendix: "NONE",
      conservation_notes: "Vulnérable selon l'IUCN. Populations en déclin en Australie occidentale. Plantations commerciales en développement comme alternative au santal indien (S. album).",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true }),
      sustainable_alternatives: "Santal de plantation, Javanol (synthétique)",
      last_assessment_year: 2019
    },
    {
      latin_name: "Cinnamomum verum",
      name: "Cannelier de Ceylan",
      conservation_status: "LC",
      cites_appendix: "NONE",
      conservation_notes: "Populations stables grâce à la culture intensive au Sri Lanka et dans d'autres régions tropicales. Espèce largement cultivée pour l'industrie des épices et de la parfumerie.",
      threat_factors: JSON.stringify({}),
      sustainable_alternatives: "Culture durable établie",
      last_assessment_year: 2020
    },
    {
      latin_name: "Pinus sylvestris",
      name: "Pin sylvestre",
      conservation_status: "LC",
      cites_appendix: "NONE",
      conservation_notes: "Populations stables et largement distribuées en Europe et Asie. Espèce commune utilisée pour la production de térébenthine et d'huiles essentielles.",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: "Gestion forestière durable établie",
      last_assessment_year: 2013
    },
    {
      latin_name: "Boswellia sacra",
      name: "Oliban (Encens)",
      conservation_status: "NT",
      cites_appendix: "NONE",
      conservation_notes: "Statut Near Threatened confirmé par IUCN 2025-2. Populations sous pression mais pas encore en déclin critique. Programmes de conservation en cours à Oman et au Yémen.",
      threat_factors: JSON.stringify({ overharvesting: true, climate_change: true }),
      sustainable_alternatives: "Programmes de reforestation en cours, encens de culture",
      last_assessment_year: 2025
    },
    {
      latin_name: "Canarium luzonicum",
      name: "Élémi",
      conservation_status: "VU",
      cites_appendix: "NONE",
      conservation_notes: "Vulnérable selon l'IUCN. Endémique des Philippines. Déforestation et surexploitation menacent les populations sauvages. Programmes de récolte durable en développement.",
      threat_factors: JSON.stringify({ habitat_loss: true, overharvesting: true }),
      sustainable_alternatives: "Élémi de culture, limonène synthétique",
      last_assessment_year: 2019
    }
  ];

  console.log("\n📊 Mise à jour des enregistrements...\n");

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const data of updates) {
    try {
      const [existing] = await connection.execute(
        "SELECT id, name FROM plants WHERE latin_name = ? LIMIT 1",
        [data.latin_name]
      );

      if (existing.length > 0) {
        await connection.execute(
          `UPDATE plants SET 
           conservation_status = ?,
           cites_appendix = ?,
           conservation_notes = ?,
           threat_factors = ?,
           sustainable_alternatives = ?,
           last_assessment_year = ?,
           updated_at = NOW()
           WHERE latin_name = ?`,
          [
            data.conservation_status,
            data.cites_appendix,
            data.conservation_notes,
            data.threat_factors,
            data.sustainable_alternatives,
            data.last_assessment_year,
            data.latin_name
          ]
        );
        console.log(`✅ Mis à jour: ${data.name} (${data.latin_name}) - ${data.conservation_status}`);
        updated++;
      } else {
        console.log(`⚠️ Non trouvé: ${data.name} (${data.latin_name})`);
        notFound++;
      }
    } catch (err) {
      console.error(`❌ Erreur pour ${data.name}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📈 RÉSUMÉ DE LA MISE À JOUR");
  console.log("=".repeat(60));
  console.log(`✅ Mis à jour: ${updated}`);
  console.log(`⚠️ Non trouvés: ${notFound}`);
  console.log(`❌ Erreurs: ${errors}`);

  console.log("\n📋 VÉRIFICATION DES DONNÉES MISES À JOUR\n");
  
  const [verif] = await connection.execute(`
    SELECT name, latin_name, conservation_status, cites_appendix, last_assessment_year
    FROM plants 
    WHERE category IN ('resine', 'bois')
      AND conservation_status IN ('CR', 'EN', 'VU')
    ORDER BY 
      CASE conservation_status 
        WHEN 'CR' THEN 1 
        WHEN 'EN' THEN 2 
        WHEN 'VU' THEN 3 
      END,
      name
  `);

  console.log("Espèces menacées avec données de conservation complètes:\n");
  for (const row of verif) {
    console.log(`[${row.conservation_status}] ${row.name} (${row.latin_name})`);
    console.log(`    CITES: ${row.cites_appendix || 'Non listé'} | Évaluation: ${row.last_assessment_year || 'N/A'}`);
  }

  await connection.end();
  console.log("\n✨ Mise à jour terminée avec succès!");
}

main().catch(console.error);
