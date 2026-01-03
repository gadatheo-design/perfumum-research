/**
 * Script d'import des origines géographiques pour PERFUMUM
 * Terroirs de production des ingrédients de parfumerie
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const geographicOrigins = [
  // ROSES
  {
    name: "Rose de Bulgarie",
    country: "Bulgarie",
    region: "Vallée des Roses (Kazanlak)",
    terroir: "Climat continental modéré, sol argileux et calcaire, altitude 400-600m. La vallée est protégée par les montagnes des Balkans au nord et les Rhodopes au sud.",
    latitude: "42.6195",
    longitude: "25.3970",
    altitude: 500,
    climate: "Continental modéré",
    soilType: "Argileux-calcaire",
    harvestPeriod: "Mai-Juin (3 semaines)",
    productionMethod: "Récolte manuelle à l'aube, distillation à la vapeur d'eau. 3-5 tonnes de pétales pour 1kg d'huile essentielle.",
    qualityIndicators: "AOC Rosa Damascena, certification bio disponible",
    historicalContext: "Culture depuis le 17ème siècle, introduite par les Ottomans. La Bulgarie produit 70% de l'huile de rose mondiale.",
    economicImportance: "Industrie majeure employant des milliers de personnes, festival annuel de la rose.",
    sustainabilityNotes: "Pratiques agricoles traditionnelles, rotation des cultures, irrigation naturelle."
  },
  {
    name: "Rose de Grasse",
    country: "France",
    region: "Grasse, Provence-Alpes-Côte d'Azur",
    terroir: "Climat méditerranéen, sol calcaire drainant, altitude 300-400m. Exposition sud-est protégée du mistral.",
    latitude: "43.6590",
    longitude: "6.9230",
    altitude: 350,
    climate: "Méditerranéen",
    soilType: "Calcaire drainant",
    harvestPeriod: "Mai (4-6 semaines)",
    productionMethod: "Récolte manuelle, extraction par solvant volatil (absolu) ou enfleurage traditionnel.",
    qualityIndicators: "IGP Fleurs de Grasse, patrimoine UNESCO",
    historicalContext: "Capitale mondiale de la parfumerie depuis le 16ème siècle. Rosa centifolia cultivée depuis 1880.",
    economicImportance: "Patrimoine culturel et économique majeur, tourisme olfactif.",
    sustainabilityNotes: "Conservation des terres agricoles face à l'urbanisation, label Fleurs d'Exception."
  },
  {
    name: "Rose de Taïf",
    country: "Arabie Saoudite",
    region: "Taïf, Province de La Mecque",
    terroir: "Altitude élevée (1800m), climat semi-aride montagnard, sol volcanique. Nuits fraîches et journées chaudes.",
    latitude: "21.2703",
    longitude: "40.4158",
    altitude: 1800,
    climate: "Semi-aride montagnard",
    soilType: "Volcanique",
    harvestPeriod: "Mars-Avril",
    productionMethod: "Récolte nocturne traditionnelle, distillation artisanale en alambics de cuivre.",
    qualityIndicators: "Appellation traditionnelle, production limitée",
    historicalContext: "Culture millénaire, roses offertes aux pèlerins de La Mecque. Parfum prisé des califes.",
    economicImportance: "Production très limitée, prix élevé, usage cérémoniel.",
    sustainabilityNotes: "Méthodes traditionnelles préservées, irrigation par canaux ancestraux."
  },

  // AGRUMES
  {
    name: "Bergamote de Calabre",
    country: "Italie",
    region: "Reggio de Calabre, Calabre",
    terroir: "Climat méditerranéen subtropical, sol alluvial riche, altitude 0-200m. Bande côtière de 100km.",
    latitude: "38.1113",
    longitude: "15.6473",
    altitude: 50,
    climate: "Méditerranéen subtropical",
    soilType: "Alluvial riche",
    harvestPeriod: "Novembre-Mars",
    productionMethod: "Récolte manuelle, extraction par expression à froid des zestes.",
    qualityIndicators: "DOP Bergamotto di Reggio Calabria, 95% production mondiale",
    historicalContext: "Cultivée depuis le 18ème siècle, base de l'Eau de Cologne originale.",
    economicImportance: "Monopole mondial, industrie clé de la région.",
    sustainabilityNotes: "Consorzio di Tutela, pratiques durables encouragées."
  },
  {
    name: "Citron de Menton",
    country: "France",
    region: "Menton, Alpes-Maritimes",
    terroir: "Microlimat subtropical protégé, terrasses en restanques, sol calcaire. Altitude 0-300m.",
    latitude: "43.7747",
    longitude: "7.4975",
    altitude: 100,
    climate: "Subtropical protégé",
    soilType: "Calcaire en terrasses",
    harvestPeriod: "Octobre-Février",
    productionMethod: "Récolte manuelle, expression à froid ou distillation des feuilles.",
    qualityIndicators: "IGP Citron de Menton",
    historicalContext: "Culture depuis le 15ème siècle, fête du citron depuis 1934.",
    economicImportance: "Production artisanale, tourisme, gastronomie.",
    sustainabilityNotes: "Préservation des terrasses traditionnelles, agriculture raisonnée."
  },
  {
    name: "Orange amère de Séville",
    country: "Espagne",
    region: "Séville, Andalousie",
    terroir: "Climat méditerranéen chaud, sol argileux-calcaire, altitude 10-50m.",
    latitude: "37.3891",
    longitude: "-5.9845",
    altitude: 30,
    climate: "Méditerranéen chaud",
    soilType: "Argileux-calcaire",
    harvestPeriod: "Janvier-Février (fruits), Mai (fleurs)",
    productionMethod: "Expression des zestes, distillation des fleurs (néroli) et des feuilles (petit grain).",
    qualityIndicators: "Appellation traditionnelle",
    historicalContext: "Introduite par les Arabes au 10ème siècle, arbres ornementaux de la ville.",
    economicImportance: "Double usage: parfumerie et marmelade britannique.",
    sustainabilityNotes: "Arbres urbains historiques, gestion municipale."
  },

  // VÉTIVER
  {
    name: "Vétiver d'Haïti",
    country: "Haïti",
    region: "Les Cayes, Sud d'Haïti",
    terroir: "Climat tropical, sol volcanique drainant, altitude 200-500m. Précipitations abondantes.",
    latitude: "18.1942",
    longitude: "-73.7489",
    altitude: 350,
    climate: "Tropical",
    soilType: "Volcanique drainant",
    harvestPeriod: "Toute l'année (racines de 18-24 mois)",
    productionMethod: "Récolte manuelle des racines, séchage, distillation à la vapeur prolongée (24-36h).",
    qualityIndicators: "Certification bio et commerce équitable disponibles",
    historicalContext: "Culture depuis les années 1940, Haïti produit 50% du vétiver mondial.",
    economicImportance: "Ressource économique majeure pour les communautés rurales.",
    sustainabilityNotes: "Programmes de commerce équitable, lutte contre l'érosion des sols."
  },
  {
    name: "Vétiver de Java",
    country: "Indonésie",
    region: "Java occidental",
    terroir: "Climat tropical humide, sol volcanique fertile, altitude 500-1000m.",
    latitude: "-6.9175",
    longitude: "107.6191",
    altitude: 750,
    climate: "Tropical humide",
    soilType: "Volcanique fertile",
    harvestPeriod: "Toute l'année",
    productionMethod: "Distillation à la vapeur, profil plus léger que le vétiver haïtien.",
    qualityIndicators: "Standard industriel",
    historicalContext: "Culture développée au 20ème siècle pour l'industrie.",
    economicImportance: "Production industrielle importante.",
    sustainabilityNotes: "Intégration dans les systèmes agroforestiers."
  },

  // BOIS ET RÉSINES
  {
    name: "Santal de Mysore",
    country: "Inde",
    region: "Karnataka (Mysore)",
    terroir: "Climat tropical sec, sol latéritique, altitude 600-900m. Forêts de feuillus.",
    latitude: "12.2958",
    longitude: "76.6394",
    altitude: 750,
    climate: "Tropical sec",
    soilType: "Latéritique",
    harvestPeriod: "Arbres de 30-60 ans minimum",
    productionMethod: "Abattage contrôlé, distillation du bois de cœur. 60-80kg de bois pour 1kg d'huile.",
    qualityIndicators: "Santalum album, réglementation gouvernementale stricte",
    historicalContext: "Utilisé depuis 4000 ans dans les rituels hindous et bouddhistes.",
    economicImportance: "Ressource rare et précieuse, prix très élevé.",
    sustainabilityNotes: "Espèce protégée, programmes de replantation, quotas stricts."
  },
  {
    name: "Cèdre de l'Atlas",
    country: "Maroc",
    region: "Moyen Atlas",
    terroir: "Climat montagnard méditerranéen, sol calcaire, altitude 1500-2500m.",
    latitude: "33.4000",
    longitude: "-5.2000",
    altitude: 2000,
    climate: "Montagnard méditerranéen",
    soilType: "Calcaire montagnard",
    harvestPeriod: "Toute l'année (bois et sciure)",
    productionMethod: "Distillation des copeaux et sciure, valorisation des déchets de menuiserie.",
    qualityIndicators: "Cedrus atlantica, forêts classées",
    historicalContext: "Bois sacré des civilisations méditerranéennes antiques.",
    economicImportance: "Industrie du bois et parfumerie.",
    sustainabilityNotes: "Forêts protégées, reboisement actif."
  },
  {
    name: "Encens d'Oman",
    country: "Oman",
    region: "Dhofar",
    terroir: "Climat aride côtier, sol calcaire rocheux, altitude 200-1000m. Mousson d'été (khareef).",
    latitude: "17.0151",
    longitude: "54.0924",
    altitude: 500,
    climate: "Aride côtier avec mousson",
    soilType: "Calcaire rocheux",
    harvestPeriod: "Mars-Mai et Septembre-Octobre",
    productionMethod: "Incision de l'écorce, récolte de la résine après 2-3 semaines de séchage.",
    qualityIndicators: "Boswellia sacra, grades Hojari (supérieur), Najdi, Shazri",
    historicalContext: "Route de l'encens depuis 3000 ans, patrimoine UNESCO.",
    economicImportance: "Produit d'exportation historique, tourisme culturel.",
    sustainabilityNotes: "Surexploitation préoccupante, programmes de conservation."
  },

  // FLEURS
  {
    name: "Jasmin de Grasse",
    country: "France",
    region: "Grasse, Provence-Alpes-Côte d'Azur",
    terroir: "Climat méditerranéen, sol calcaire, altitude 200-400m.",
    latitude: "43.6590",
    longitude: "6.9230",
    altitude: 300,
    climate: "Méditerranéen",
    soilType: "Calcaire",
    harvestPeriod: "Août-Octobre",
    productionMethod: "Récolte manuelle à l'aube, extraction par solvant volatil. 8000 fleurs pour 1g d'absolu.",
    qualityIndicators: "IGP Fleurs de Grasse, Jasminum grandiflorum",
    historicalContext: "Introduit au 16ème siècle, symbole de la parfumerie française.",
    economicImportance: "Production limitée mais prestige mondial.",
    sustainabilityNotes: "Label Fleurs d'Exception, préservation du patrimoine agricole."
  },
  {
    name: "Jasmin d'Égypte",
    country: "Égypte",
    region: "Haute-Égypte (Louxor, Assouan)",
    terroir: "Climat désertique chaud, sol alluvial du Nil, altitude 50-100m.",
    latitude: "25.6872",
    longitude: "32.6396",
    altitude: 75,
    climate: "Désertique chaud",
    soilType: "Alluvial du Nil",
    harvestPeriod: "Juin-Octobre",
    productionMethod: "Récolte nocturne, extraction par solvant.",
    qualityIndicators: "Jasminum grandiflorum, production industrielle",
    historicalContext: "Culture développée au 20ème siècle pour l'industrie mondiale.",
    economicImportance: "Premier producteur mondial de jasmin.",
    sustainabilityNotes: "Gestion de l'eau du Nil, conditions de travail à améliorer."
  },
  {
    name: "Ylang-ylang de Madagascar",
    country: "Madagascar",
    region: "Nosy Be et côte nord-ouest",
    terroir: "Climat tropical humide, sol volcanique, altitude 0-200m.",
    latitude: "-13.3167",
    longitude: "48.2667",
    altitude: 50,
    climate: "Tropical humide",
    soilType: "Volcanique",
    harvestPeriod: "Toute l'année (pic en saison des pluies)",
    productionMethod: "Distillation fractionnée en 4 grades: Extra, I, II, III.",
    qualityIndicators: "Cananga odorata, grades de qualité",
    historicalContext: "Culture depuis le 19ème siècle, introduite par les colons français.",
    economicImportance: "Ressource majeure pour les communautés locales.",
    sustainabilityNotes: "Commerce équitable, préservation des forêts."
  },
  {
    name: "Tubéreuse d'Inde",
    country: "Inde",
    region: "Tamil Nadu (Madurai)",
    terroir: "Climat tropical, sol rouge latéritique, altitude 100-300m.",
    latitude: "9.9252",
    longitude: "78.1198",
    altitude: 200,
    climate: "Tropical",
    soilType: "Rouge latéritique",
    harvestPeriod: "Août-Décembre",
    productionMethod: "Récolte manuelle, extraction par solvant ou enfleurage.",
    qualityIndicators: "Polianthes tuberosa",
    historicalContext: "Fleur sacrée utilisée dans les cérémonies hindoues.",
    economicImportance: "Double usage: parfumerie et cérémonies religieuses.",
    sustainabilityNotes: "Agriculture familiale traditionnelle."
  },

  // ÉPICES
  {
    name: "Vanille de Madagascar",
    country: "Madagascar",
    region: "SAVA (Sambava, Antalaha, Vohemar, Andapa)",
    terroir: "Climat tropical humide, sol volcanique riche, altitude 0-500m.",
    latitude: "-14.2667",
    longitude: "50.0000",
    altitude: 200,
    climate: "Tropical humide",
    soilType: "Volcanique riche",
    harvestPeriod: "Juin-Août (gousses vertes)",
    productionMethod: "Pollinisation manuelle, récolte, échaudage, séchage (6-9 mois de préparation).",
    qualityIndicators: "Vanilla planifolia, AOC Vanille de Madagascar",
    historicalContext: "Introduite au 19ème siècle, Madagascar produit 80% de la vanille mondiale.",
    economicImportance: "Deuxième épice la plus chère après le safran.",
    sustainabilityNotes: "Volatilité des prix, programmes de stabilisation, commerce équitable."
  },
  {
    name: "Cardamome du Guatemala",
    country: "Guatemala",
    region: "Alta Verapaz",
    terroir: "Climat tropical de montagne, sol volcanique, altitude 600-1500m.",
    latitude: "15.4833",
    longitude: "-90.3667",
    altitude: 1000,
    climate: "Tropical de montagne",
    soilType: "Volcanique",
    harvestPeriod: "Août-Février",
    productionMethod: "Récolte manuelle, séchage, distillation des graines.",
    qualityIndicators: "Elettaria cardamomum, premier producteur mondial",
    historicalContext: "Culture introduite par les immigrants allemands au 19ème siècle.",
    economicImportance: "Principale exportation agricole après le café.",
    sustainabilityNotes: "Agroforesterie, ombrage naturel."
  },
  {
    name: "Poivre noir de Kampot",
    country: "Cambodge",
    region: "Kampot",
    terroir: "Climat tropical de mousson, sol rouge riche en quartz, altitude 0-100m.",
    latitude: "10.6167",
    longitude: "104.1833",
    altitude: 50,
    climate: "Tropical de mousson",
    soilType: "Rouge riche en quartz",
    harvestPeriod: "Février-Mai",
    productionMethod: "Récolte manuelle, séchage au soleil, distillation des baies.",
    qualityIndicators: "IGP Poivre de Kampot",
    historicalContext: "Réputé depuis l'époque coloniale française, renaissance après les Khmers rouges.",
    economicImportance: "Produit premium, tourisme gastronomique.",
    sustainabilityNotes: "Coopératives locales, agriculture biologique."
  },

  // HERBES AROMATIQUES
  {
    name: "Lavande de Provence",
    country: "France",
    region: "Plateau de Valensole, Alpes-de-Haute-Provence",
    terroir: "Climat méditerranéen d'altitude, sol calcaire drainant, altitude 500-1000m.",
    latitude: "43.8333",
    longitude: "6.0000",
    altitude: 750,
    climate: "Méditerranéen d'altitude",
    soilType: "Calcaire drainant",
    harvestPeriod: "Juillet-Août",
    productionMethod: "Récolte mécanique, distillation à la vapeur d'eau.",
    qualityIndicators: "AOP Huile essentielle de lavande de Haute-Provence, Lavandula angustifolia",
    historicalContext: "Culture traditionnelle depuis le 19ème siècle, paysage emblématique.",
    economicImportance: "Tourisme, cosmétique, aromathérapie.",
    sustainabilityNotes: "Menacée par le dépérissement, recherche de variétés résistantes."
  },
  {
    name: "Patchouli d'Indonésie",
    country: "Indonésie",
    region: "Sumatra (Aceh)",
    terroir: "Climat tropical humide, sol volcanique, altitude 800-1200m.",
    latitude: "4.6951",
    longitude: "96.7494",
    altitude: 1000,
    climate: "Tropical humide",
    soilType: "Volcanique",
    harvestPeriod: "Toute l'année (3-4 récoltes/an)",
    productionMethod: "Séchage des feuilles, fermentation légère, distillation prolongée.",
    qualityIndicators: "Pogostemon cablin, Indonésie produit 90% du patchouli mondial",
    historicalContext: "Utilisé traditionnellement contre les insectes, popularisé en Occident au 19ème siècle.",
    economicImportance: "Industrie majeure pour les communautés rurales.",
    sustainabilityNotes: "Agroforesterie, rotation des cultures."
  }
];

async function importGeographicOrigins() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🌍 Import des origines géographiques...\n');
  
  let imported = 0;
  let skipped = 0;
  
  for (const origin of geographicOrigins) {
    try {
      // Vérifier si l'origine existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM geographic_origins WHERE name = ? AND country = ?',
        [origin.name, origin.country]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  ${origin.name} (${origin.country}) - déjà existant`);
        skipped++;
        continue;
      }
      
      // Insérer la nouvelle origine
      await connection.execute(
        `INSERT INTO geographic_origins 
         (name, country, region, terroir, latitude, longitude, altitude, climate, soil_type, 
          harvest_period, production_method, quality_indicators, historical_context, 
          economic_importance, sustainability_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          origin.name,
          origin.country,
          origin.region,
          origin.terroir,
          origin.latitude,
          origin.longitude,
          origin.altitude,
          origin.climate,
          origin.soilType,
          origin.harvestPeriod,
          origin.productionMethod,
          origin.qualityIndicators,
          origin.historicalContext,
          origin.economicImportance,
          origin.sustainabilityNotes
        ]
      );
      
      console.log(`✅ ${origin.name} (${origin.country})`);
      imported++;
    } catch (error) {
      console.error(`❌ Erreur pour ${origin.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`   - Importés: ${imported}`);
  console.log(`   - Ignorés (existants): ${skipped}`);
  console.log(`   - Total traités: ${geographicOrigins.length}`);
  
  await connection.end();
}

importGeographicOrigins().catch(console.error);
