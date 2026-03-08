#!/usr/bin/env node
/**
 * Import AS-02 + Enrichissement botanique AS-01
 * 
 * 1. Enrichit les 13 plantes AS-01 avec taxonomie complète, zones Köppen, statuts CITES
 * 2. Importe AS-02 Matériaux Prioritaires ABSENTS (research_entry + matériaux manquants)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

// ─── Données d'enrichissement botanique AS-01 ─────────────────────────────────
const PLANT_ENRICHMENTS = [
  {
    search_name: "Patchouli",
    latin_name: "Pogostemon cablin",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Lamiales",
      family: "Lamiaceae",
      genus: "Pogostemon",
      species: "cablin",
      life_cycle: "perennial",
      origin: "Philippines / Indonésie (Java, Sumatra)",
      habitat: "Forêts tropicales humides, altitude 1000-2000m, sols bien drainés",
      harvest_period: "Feuilles (avant floraison)",
      essential_oil_yield: "2-3%",
      koppen_zone: "Af",
      koppen_description: "Tropical humide, précipitations annuelles > 2000mm",
      precipitation_min: 1500,
      precipitation_max: 3000,
      temperature_min: 18,
      temperature_max: 32,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Médecine ayurvédique, parfumerie, insectifuge, protection des textiles",
      ethnobotanical_uses: JSON.stringify(["Utilisé depuis des siècles en Asie du Sud-Est pour protéger les vêtements et en médecine traditionnelle. Introduit en Europe au XIXe siècle via les châles du Cachemire."]),
      historical_significance: "Composant emblématique des parfums orientaux et chypres. Popularisé en Occident dans les années 1960-70.",
      therapeutic_properties: JSON.stringify(["anti-inflammatoire", "antiseptique", "antidépresseur", "aphrodisiaque"])
    }
  },
  {
    search_name: "Palo Santo",
    latin_name: "Bursera graveolens",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Sapindales",
      family: "Burseraceae",
      genus: "Bursera",
      species: "graveolens",
      life_cycle: "perennial",
      origin: "Équateur, Pérou, Colombie, Mexique",
      habitat: "Forêts sèches tropicales côtières, sols calcaires, zones semi-arides",
      harvest_period: "Bois mort naturellement tombé (5+ ans après mort naturelle)",
      essential_oil_yield: "1-2%",
      koppen_zone: "BSh",
      koppen_description: "Steppe chaude, semi-aride, précipitations < 500mm/an",
      precipitation_min: 200,
      precipitation_max: 800,
      temperature_min: 15,
      temperature_max: 35,
      conservation_status: "NT",
      cites_appendix: null,
      historical_status: "wild_harvested",
      traditional_use: "Rituel chamanique, purification, médecine traditionnelle andine",
      ethnobotanical_uses: JSON.stringify(["Utilisé depuis des millénaires par les peuples andins pour les cérémonies spirituelles. Le nom 'Palo Santo' (bois sacré) reflète son importance rituelle."]),
      historical_significance: "Bois sacré des Incas et peuples précolombiens. Utilisé dans les rituels de purification et de guérison.",
      therapeutic_properties: JSON.stringify(["anti-inflammatoire", "anxiolytique", "antiseptique", "analgésique"])
    }
  },
  {
    search_name: "Oud (Agarwood)",
    latin_name: "Aquilaria spp.",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Malvales",
      family: "Thymelaeaceae",
      genus: "Aquilaria",
      species: "malaccensis",
      life_cycle: "perennial",
      origin: "Asie du Sud-Est (Inde, Bangladesh, Malaisie, Indonésie, Vietnam)",
      habitat: "Forêts tropicales humides, altitude 0-1000m",
      harvest_period: "Bois infecté par champignon Phialophora parasitica",
      essential_oil_yield: "0.1-0.5% (bois infecté seulement)",
      koppen_zone: "Af",
      koppen_description: "Tropical humide équatorial",
      precipitation_min: 1500,
      precipitation_max: 4000,
      temperature_min: 20,
      temperature_max: 35,
      conservation_status: "CR",
      cites_appendix: "II",
      historical_status: "endangered",
      conservation_notes: "Aquilaria malaccensis est classée EN DANGER CRITIQUE (CR) sur la Liste Rouge UICN. Toutes les espèces Aquilaria sont listées CITES Annexe II depuis 2004. La surexploitation pour la production d'oud a drastiquement réduit les populations sauvages.",
      threat_factors: "Surexploitation commerciale, déforestation, braconnage. Demande mondiale en forte hausse (marché du oud estimé à 6 milliards USD).",
      sustainable_alternatives: "Oud de culture (plantation), oud de synthèse (Iso E Super, Cashmeran), reconstitutions moléculaires.",
      traditional_use: "Encens religieux (Islam, Bouddhisme, Hindouisme), parfumerie de luxe, médecine traditionnelle",
      ethnobotanical_uses: JSON.stringify(["Mentionné dans les textes sacrés islamiques (hadith). Utilisé dans les rituels funéraires et les cérémonies religieuses depuis plus de 3000 ans."]),
      historical_significance: "L'une des substances parfumées les plus précieuses de l'histoire humaine. Prix jusqu'à 100 000 USD/kg pour les grades supérieurs.",
      therapeutic_properties: JSON.stringify(["antibactérien", "anti-inflammatoire", "anxiolytique", "sédatif"])
    }
  },
  {
    search_name: "Cypriol (Nagarmotha)",
    latin_name: "Cyperus scariosus",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Liliopsida",
      order_name: "Poales",
      family: "Cyperaceae",
      genus: "Cyperus",
      species: "scariosus",
      life_cycle: "perennial",
      origin: "Inde (Uttar Pradesh, Rajasthan)",
      habitat: "Zones humides, berges de rivières, prairies inondables",
      harvest_period: "Rhizomes (saison sèche)",
      essential_oil_yield: "0.5-1.5%",
      koppen_zone: "Cwa",
      koppen_description: "Subtropical humide, été chaud, hiver sec",
      precipitation_min: 600,
      precipitation_max: 1200,
      temperature_min: 5,
      temperature_max: 42,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Médecine ayurvédique (Musta), parfumerie orientale",
      ethnobotanical_uses: JSON.stringify(["Utilisé en Ayurveda sous le nom 'Musta' pour les troubles digestifs et fièvres. Composant des parfums traditionnels indiens."]),
      therapeutic_properties: JSON.stringify(["digestif", "antipyrétique", "diurétique", "anti-inflammatoire"])
    }
  },
  {
    search_name: "Vétiver",
    latin_name: "Chrysopogon zizanioides",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Liliopsida",
      order_name: "Poales",
      family: "Poaceae",
      genus: "Chrysopogon",
      species: "zizanioides",
      life_cycle: "perennial",
      origin: "Inde (Tamil Nadu) — cultivé à Haïti, Réunion, Java, Sri Lanka",
      habitat: "Prairies tropicales, sols argileux, zones humides",
      harvest_period: "Racines (18-24 mois après plantation)",
      essential_oil_yield: "0.5-2%",
      koppen_zone: "Aw",
      koppen_description: "Tropical savane, saison sèche marquée",
      precipitation_min: 800,
      precipitation_max: 2000,
      temperature_min: 15,
      temperature_max: 40,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Parfumerie, protection des cultures, médecine traditionnelle indienne",
      ethnobotanical_uses: JSON.stringify(["Utilisé en Inde depuis l'Antiquité comme parfum et médicament. Les nattes de vétiver étaient humidifiées pour rafraîchir les maisons."]),
      historical_significance: "Fixateur majeur de la parfumerie classique. Présent dans de nombreux grands classiques (Chanel No. 5, Guerlain Vétiver).",
      therapeutic_properties: JSON.stringify(["sédatif", "anti-stress", "anti-inflammatoire", "cicatrisant"])
    }
  },
  {
    search_name: "Jasmin grandiflorum",
    latin_name: "Jasminum grandiflorum",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Lamiales",
      family: "Oleaceae",
      genus: "Jasminum",
      species: "grandiflorum",
      life_cycle: "perennial",
      origin: "Inde, Pakistan — cultivé à Grasse, Égypte, Maroc",
      habitat: "Zones subtropicales, sols bien drainés, exposition ensoleillée",
      harvest_period: "Fleurs (aube, juillet-octobre)",
      essential_oil_yield: "0.05-0.1% (absolu)",
      koppen_zone: "Csa",
      koppen_description: "Méditerranéen, été sec et chaud",
      precipitation_min: 400,
      precipitation_max: 900,
      temperature_min: 5,
      temperature_max: 38,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Parfumerie de luxe, médecine ayurvédique, cérémonies religieuses",
      ethnobotanical_uses: JSON.stringify(["Fleur sacrée en Inde, utilisée dans les guirlandes de mariage et les offrandes religieuses. Cultivé à Grasse depuis le XVIe siècle."]),
      historical_significance: "Composant incontournable de la haute parfumerie. Utilisé dans Joy (Patou), Chanel No. 5, Diorissimo.",
      therapeutic_properties: JSON.stringify(["antidépresseur", "aphrodisiaque", "anxiolytique", "antispasmodique"])
    }
  },
  {
    search_name: "Rose de Damas",
    latin_name: "Rosa damascena",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Rosales",
      family: "Rosaceae",
      genus: "Rosa",
      species: "damascena",
      life_cycle: "perennial",
      origin: "Bulgarie (Vallée des Roses), Turquie (Isparta), Maroc (Vallée du Dadès)",
      habitat: "Zones tempérées, altitude 700-1500m, sols calcaires",
      harvest_period: "Fleurs (mai-juin, aube)",
      essential_oil_yield: "0.02-0.05% (absolue)",
      koppen_zone: "Dfb",
      koppen_description: "Continental humide, été frais",
      precipitation_min: 500,
      precipitation_max: 900,
      temperature_min: -10,
      temperature_max: 35,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Parfumerie, eau de rose, médecine traditionnelle, cuisine",
      ethnobotanical_uses: JSON.stringify(["Cultivée depuis l'Antiquité en Perse et au Moyen-Orient. Mentionnée dans les textes persans du Xe siècle. La distillation de l'eau de rose aurait été inventée par Avicenne."]),
      historical_significance: "Symbole universel de la beauté et de l'amour. Composant central de la parfumerie occidentale depuis la Renaissance.",
      therapeutic_properties: JSON.stringify(["antidépresseur", "anti-inflammatoire", "astringent", "aphrodisiaque"])
    }
  },
  {
    search_name: "Ylang-ylang",
    latin_name: "Cananga odorata",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Magnoliales",
      family: "Annonaceae",
      genus: "Cananga",
      species: "odorata",
      life_cycle: "perennial",
      origin: "Philippines, Indonésie — cultivé aux Comores, Madagascar",
      habitat: "Forêts tropicales humides, altitude 0-500m",
      harvest_period: "Fleurs (toute l'année, surtout mai-septembre)",
      essential_oil_yield: "1.5-2.5%",
      koppen_zone: "Af",
      koppen_description: "Tropical humide équatorial",
      precipitation_min: 1500,
      precipitation_max: 3000,
      temperature_min: 20,
      temperature_max: 35,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Parfumerie, cosmétique, cérémonies de mariage (Indonésie)",
      ethnobotanical_uses: JSON.stringify(["Fleurs utilisées dans les cérémonies de mariage indonésiennes. L'huile essentielle est un composant clé du parfum Macassar."]),
      historical_significance: "Composant de Chanel No. 5 et de nombreux grands classiques. Les Comores sont le premier producteur mondial.",
      therapeutic_properties: JSON.stringify(["antidépresseur", "hypotenseur", "aphrodisiaque", "sédatif"])
    }
  },
  {
    search_name: "Santal (Santalum album)",
    latin_name: "Santalum album",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Santalales",
      family: "Santalaceae",
      genus: "Santalum",
      species: "album",
      life_cycle: "perennial",
      origin: "Inde (Karnataka, Tamil Nadu, Mysore) — Australie (plantations)",
      habitat: "Forêts sèches tropicales, sols bien drainés, altitude 600-1000m",
      harvest_period: "Bois de cœur (arbre de 30-60 ans)",
      essential_oil_yield: "3-6%",
      koppen_zone: "Aw",
      koppen_description: "Tropical savane, saison sèche marquée",
      precipitation_min: 500,
      precipitation_max: 1200,
      temperature_min: 12,
      temperature_max: 38,
      conservation_status: "VU",
      cites_appendix: "II",
      historical_status: "endangered",
      conservation_notes: "Santalum album est classé VULNÉRABLE (VU) sur la Liste Rouge UICN. Listé CITES Annexe II. La surexploitation en Inde a drastiquement réduit les populations sauvages. Le gouvernement de Karnataka contrôle strictement la récolte.",
      threat_factors: "Surexploitation pour la parfumerie et les rituels religieux, déforestation, braconnage.",
      sustainable_alternatives: "Santal australien (Santalum spicatum), santal de Nouvelle-Calédonie (S. austrocaledonicum), Amyris balsamifera (faux santal).",
      traditional_use: "Rituels hindous et bouddhistes, médecine ayurvédique, parfumerie, sculpture",
      ethnobotanical_uses: JSON.stringify(["Utilisé depuis 4000 ans dans les rituels hindous et bouddhistes. Le bois est brûlé comme encens et utilisé pour sculpter des idoles religieuses."]),
      historical_significance: "L'une des matières premières les plus précieuses de la parfumerie. Présent dans Samsara (Guerlain), Santal 33 (Le Labo).",
      therapeutic_properties: JSON.stringify(["antiseptique", "anti-inflammatoire", "sédatif", "astringent"])
    }
  },
  {
    search_name: "Davana Oil",
    latin_name: "Artemisia pallens",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Asterales",
      family: "Asteraceae",
      genus: "Artemisia",
      species: "pallens",
      life_cycle: "annual",
      origin: "Inde (Karnataka, Tamil Nadu)",
      habitat: "Plaines sèches à semi-arides, champs cultivés, sols bien drainés",
      harvest_period: "Sommités fleuries (décembre-janvier)",
      essential_oil_yield: "0.3-0.5%",
      koppen_zone: "Aw",
      koppen_description: "Tropical savane",
      precipitation_min: 600,
      precipitation_max: 1200,
      temperature_min: 15,
      temperature_max: 38,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Offrandes religieuses hindoues, parfumerie",
      ethnobotanical_uses: JSON.stringify(["Fleurs utilisées dans les guirlandes d'offrandes religieuses en Inde du Sud. Cultivée spécifiquement pour la parfumerie."]),
      historical_significance: "Matière première unique dont le profil olfactif varie selon la chimie individuelle du porteur. Utilisée dans Mitsouko (Guerlain).",
      therapeutic_properties: JSON.stringify(["antiseptique", "anti-inflammatoire", "antifongique"])
    }
  },
  {
    search_name: "Cardamome",
    latin_name: "Elettaria cardamomum",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Liliopsida",
      order_name: "Zingiberales",
      family: "Zingiberaceae",
      genus: "Elettaria",
      species: "cardamomum",
      life_cycle: "perennial",
      origin: "Inde (Kerala, Karnataka) — cultivé au Guatemala, Sri Lanka",
      habitat: "Forêts tropicales humides, sous-bois ombragé, altitude 600-1500m",
      harvest_period: "Capsules (avant maturité complète)",
      essential_oil_yield: "3-8%",
      koppen_zone: "Af",
      koppen_description: "Tropical humide",
      precipitation_min: 1500,
      precipitation_max: 4000,
      temperature_min: 18,
      temperature_max: 35,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Épice culinaire, médecine ayurvédique, parfumerie orientale",
      ethnobotanical_uses: JSON.stringify(["Utilisée depuis l'Antiquité en Inde et au Moyen-Orient. Mentionnée dans les textes védiques. Composant du café arabe (qahwa)."]),
      historical_significance: "Troisième épice la plus chère au monde après le safran et la vanille. Composant de nombreux parfums orientaux.",
      therapeutic_properties: JSON.stringify(["digestif", "carminatif", "antiseptique buccal", "aphrodisiaque"])
    }
  },
  {
    search_name: "Bergamote",
    latin_name: "Citrus bergamia",
    updates: {
      kingdom: "Plantae",
      division: "Magnoliophyta",
      class: "Magnoliopsida",
      order_name: "Sapindales",
      family: "Rutaceae",
      genus: "Citrus",
      species: "bergamia",
      life_cycle: "perennial",
      origin: "Calabre (Italie) — quasi-exclusivité mondiale",
      habitat: "Côtes méditerranéennes, sols calcaires, climat doux",
      harvest_period: "Fruits (novembre-février)",
      essential_oil_yield: "0.5-1% (expression à froid)",
      koppen_zone: "Csa",
      koppen_description: "Méditerranéen, été sec et chaud",
      precipitation_min: 500,
      precipitation_max: 900,
      temperature_min: 5,
      temperature_max: 35,
      conservation_status: "LC",
      cites_appendix: null,
      historical_status: "cultivated",
      traditional_use: "Parfumerie, aromatisation du thé Earl Grey, médecine populaire",
      ethnobotanical_uses: JSON.stringify(["Cultivé exclusivement en Calabre depuis le XVIIe siècle. Origine incertaine — probable hybride naturel entre orange amère et citron."]),
      historical_significance: "Note de tête emblématique de la parfumerie classique. Composant de l'Eau de Cologne originale (1709) et de Chanel No. 5.",
      therapeutic_properties: JSON.stringify(["antidépresseur", "antiseptique", "anxiolytique", "digestif"])
    }
  },
];

// ─── Données AS-02 Matériaux Prioritaires ABSENTS ─────────────────────────────
const AS02_MATERIALS = [
  // Phase 1 — Terpènes critiques (déjà dans AS-01 mais avec notes sourcing)
  {
    nom: "Guaiol",
    type: "Isolat",
    note: "Fond",
    famille_olfactive: ["Boisé", "Floral"],
    profil_olfactif: "Boisé-floral doux, rose-bois, légèrement terreux",
    notes_techniques: "Sesquiterpène alcool. CAS: 489-86-1. Présent dans le bois de gaïac et le cypriol. Dosage: 0.3-0.8%",
    priorite: "Phase 1",
    budget_eur: "20-40",
    fournisseur_suggere: "Sigma-Aldrich, Floracopeia",
    formules_cibles: ["ACC-02", "ACC-05"],
    molecules_cles: ["Guaiol"]
  },
  {
    nom: "Valencene",
    type: "Isolat",
    note: "Tête",
    famille_olfactive: ["Citrus", "Fruité"],
    profil_olfactif: "Orange douce, agrume frais, légèrement boisé",
    notes_techniques: "Sesquiterpène. CAS: 4630-07-3. Présent dans les oranges Valencia. Dosage: 0.1-0.5%",
    priorite: "Phase 2",
    budget_eur: "30-60",
    fournisseur_suggere: "Sigma-Aldrich",
    formules_cibles: ["ACC-06"],
    molecules_cles: ["Valencene"]
  },
  {
    nom: "Farnesene",
    type: "Isolat",
    note: "Tête/Cœur",
    famille_olfactive: ["Vert", "Fruité"],
    profil_olfactif: "Vert-herbacé, pomme verte, floral léger",
    notes_techniques: "Sesquiterpène. CAS: 18794-84-8. Présent dans le houblon et les pommes. Dosage: 0.1-0.3%",
    priorite: "Phase 2",
    budget_eur: "30-50",
    fournisseur_suggere: "Sigma-Aldrich",
    formules_cibles: ["ACC-04"],
    molecules_cles: ["β-Farnesène"]
  },
  // Phase 1 — Absolus patrimoniaux
  {
    nom: "Tobacco Absolute",
    type: "Absolu",
    note: "Fond",
    famille_olfactive: ["Terreux", "Animal"],
    profil_olfactif: "Fumé-cuir-miel, tabac cru, doux-amer, profondeur patrimoniale",
    notes_techniques: "Absolu de tabac. Signature fumée-cuir authentique. Dosage: 0.1-0.3%. Fournisseur: Hermitage Oils, Enfleurage",
    priorite: "Phase 2",
    budget_eur: "50-100",
    fournisseur_suggere: "Hermitage Oils, Enfleurage NYC",
    formules_cibles: ["ACC-01", "ACC-02", "ACC-03"],
    molecules_cles: ["Damascénone", "Solanone", "Mégastigmatrienone"]
  },
  {
    nom: "Mate Absolute",
    type: "Absolu",
    note: "Cœur",
    famille_olfactive: ["Vert", "Terreux"],
    profil_olfactif: "Herbacé-fumé-terreux, thé vert, légèrement boisé",
    notes_techniques: "Absolu de maté (Ilex paraguariensis). Profil herbacé unique. Dosage: 0.1-0.5%",
    priorite: "Phase 2",
    budget_eur: "40-80",
    fournisseur_suggere: "Hermitage Oils",
    formules_cibles: ["ACC-03", "ACC-05"],
    molecules_cles: ["Caféine", "Théobromine"]
  },
  {
    nom: "Hay Absolute (Foin Absolu)",
    type: "Absolu",
    note: "Cœur",
    famille_olfactive: ["Aromatique", "Terreux"],
    profil_olfactif: "Foin coupé, coumarine naturelle, herbes sèches, légèrement sucré",
    notes_techniques: "Absolu de foin. Coumarine naturelle. Dosage: 0.1-0.5%. Profil fougère authentique.",
    priorite: "Phase 2",
    budget_eur: "30-60",
    fournisseur_suggere: "Hermitage Oils, Perfumer's Apprentice",
    formules_cibles: ["ACC-04", "ACC-05"],
    molecules_cles: ["Coumarine"]
  },
  // Phase 2 — Boisés spécialisés
  {
    nom: "Guaiacwood",
    type: "Huile essentielle",
    note: "Fond",
    famille_olfactive: ["Boisé", "Floral"],
    profil_olfactif: "Fumé-rose-boisé, légèrement phénolique, chaleur",
    notes_techniques: "HE bois de gaïac (Bulnesia sarmientoi). Dosage: 0.3-1%. Guaïol + bulnésol. CITES Annexe II.",
    priorite: "Phase 2",
    budget_eur: "30-60",
    fournisseur_suggere: "Creating Perfumes, Hermitage Oils",
    formules_cibles: ["ACC-01", "ACC-05"],
    molecules_cles: ["Guaïol", "Bulnésol"]
  },
  // Phase 2 — Résines/Baumes
  {
    nom: "Galbanum",
    type: "Résine",
    note: "Tête/Cœur",
    famille_olfactive: ["Vert", "Résineux"],
    profil_olfactif: "Vert intense, résineux-amer, légèrement terreux, chypre",
    notes_techniques: "Résine de Ferula galbaniflua. Dosage: 0.1-0.5%. Composant clé des chypres et fougères.",
    priorite: "Phase 2",
    budget_eur: "20-40",
    fournisseur_suggere: "Hermitage Oils, Perfumer's Apprentice",
    formules_cibles: ["ACC-04"],
    molecules_cles: ["Cadinène", "Myrcène"]
  },
  {
    nom: "Benzoin (Siam)",
    type: "Résine",
    note: "Fond",
    famille_olfactive: ["Résineux", "Lactonique"],
    profil_olfactif: "Vanille-baumé-résineux, doux, légèrement fumé",
    notes_techniques: "Résinoïde de Styrax tonkinensis. Dosage: 0.5-2%. Acide benzoïque + benzaldéhyde. Fixateur.",
    priorite: "Phase 2",
    budget_eur: "15-30",
    fournisseur_suggere: "Perfumer's Apprentice, Hermitage Oils",
    formules_cibles: ["ACC-01", "ACC-06"],
    molecules_cles: ["Acide benzoïque", "Benzaldéhyde", "Vanilline"]
  },
  {
    nom: "Myrrhe",
    type: "Résine",
    note: "Fond",
    famille_olfactive: ["Résineux", "Terreux"],
    profil_olfactif: "Amer-baumé-médicinal-encens, légèrement terreux",
    notes_techniques: "Résine de Commiphora myrrha. Dosage: 0.3-1%. Furanosesquiterpènes. Fixateur.",
    priorite: "Phase 2",
    budget_eur: "20-40",
    fournisseur_suggere: "Hermitage Oils",
    formules_cibles: ["ACC-02", "ACC-05"],
    molecules_cles: ["Curzerène", "Lindestrène"]
  },
  {
    nom: "Opoponax",
    type: "Résine",
    note: "Fond",
    famille_olfactive: ["Résineux", "Animal"],
    profil_olfactif: "Miel-baumé-ambré, légèrement animal, chaleur",
    notes_techniques: "Résine de Commiphora guidottii. Dosage: 0.3-1%. Profil plus doux que la myrrhe.",
    priorite: "Phase 3",
    budget_eur: "25-50",
    fournisseur_suggere: "Hermitage Oils",
    formules_cibles: ["ACC-01"],
    molecules_cles: []
  },
  // Phase 2 — Floraux rares
  {
    nom: "Tuberose Absolute",
    type: "Absolu",
    note: "Cœur",
    famille_olfactive: ["Floral"],
    profil_olfactif: "Crémeux-narcotique-indolique, floral intense, légèrement animal",
    notes_techniques: "Absolu de tubéreuse (Polianthes tuberosa). Dosage: 0.05-0.2%. Très concentré. Benzyl benzoate + méthyl benzoate + indole.",
    priorite: "Phase 3",
    budget_eur: "80-150",
    fournisseur_suggere: "Hermitage Oils, Enfleurage NYC",
    formules_cibles: ["ACC-06"],
    molecules_cles: ["Benzyl benzoate", "Indole", "Méthyl benzoate"]
  },
  {
    nom: "Mimosa Absolute",
    type: "Absolu",
    note: "Cœur",
    famille_olfactive: ["Floral", "Terreux"],
    profil_olfactif: "Poudré-miel-vert, floral délicat, légèrement terreux",
    notes_techniques: "Absolu de mimosa (Acacia dealbata). Dosage: 0.1-0.5%. Anisaldéhyde + benzaldéhyde.",
    priorite: "Phase 3",
    budget_eur: "60-120",
    fournisseur_suggere: "Hermitage Oils",
    formules_cibles: ["ACC-06"],
    molecules_cles: ["Anisaldéhyde", "Benzaldéhyde"]
  },
  // Phase 3 — Muscs/Fixateurs
  {
    nom: "Ambrette Seed Absolute",
    type: "Absolu",
    note: "Fond",
    famille_olfactive: ["Animal", "Floral"],
    profil_olfactif: "Musc végétal-fruité-floral, doux, légèrement animal",
    notes_techniques: "Absolu de graines d'ambrette (Abelmoschus moschatus). Dosage: 0.1-0.5%. Alternative végétale aux muscs animaux.",
    priorite: "Phase 3",
    budget_eur: "50-100",
    fournisseur_suggere: "Hermitage Oils",
    formules_cibles: ["ACC-01", "ACC-06"],
    molecules_cles: ["Ambrettolide", "Ambrette musk"]
  },
];

// ─── Connexion DB ─────────────────────────────────────────────────────────────
async function getConnection() {
  const url = new URL(DB_URL);
  return mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });
}

// ─── Enrichissement botanique ─────────────────────────────────────────────────
async function enrichPlants(conn) {
  console.log('\n=== Enrichissement botanique AS-01 ===\n');
  let updated = 0;
  let notFound = 0;
  
  for (const enrichment of PLANT_ENRICHMENTS) {
    // Chercher la plante par nom ou nom latin
    const [rows] = await conn.execute(
      'SELECT id, name FROM plants WHERE name LIKE ? OR latin_name = ? LIMIT 1',
      [`%${enrichment.search_name}%`, enrichment.latin_name]
    );
    
    if (rows.length === 0) {
      console.log(`  ✗ Plante non trouvée: ${enrichment.search_name}`);
      notFound++;
      continue;
    }
    
    const plantId = rows[0].id;
    const plantName = rows[0].name;
    
    // Construire la requête UPDATE dynamiquement
    const fields = Object.keys(enrichment.updates);
    const values = fields.map(f => enrichment.updates[f]);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    try {
      await conn.execute(
        `UPDATE plants SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, plantId]
      );
      console.log(`  ✓ Enrichie: ${plantName} (${enrichment.latin_name})`);
      updated++;
    } catch (err) {
      console.error(`  ✗ Erreur ${plantName}:`, err.message);
    }
  }
  
  console.log(`\nPlantes enrichies: ${updated} | Non trouvées: ${notFound}`);
  return updated;
}

// ─── Import AS-02 ─────────────────────────────────────────────────────────────
async function importAS02(conn) {
  console.log('\n=== Import AS-02 Matériaux Prioritaires ABSENTS ===\n');
  
  // Trouver l'axis_id pour 'Biotechnologie et Parfumerie Durable'
  const axisId = 2;
  
  let entriesCreated = 0;
  let errors = 0;
  
  // Créer la research_entry principale AS-02
  const [existingMain] = await conn.execute(
    "SELECT id FROM research_entries WHERE title = 'AS-02 — Matériaux Prioritaires ABSENTS' LIMIT 1"
  );
  
  if (existingMain.length === 0) {
    const contentMain = `## AS-02 — Matériaux Prioritaires ABSENTS

**Source** : Base Notion PERFUMUM — Absorbe X
**Statut** : Sourcing prioritaire
**Type** : Matériaux critiques

### Contexte
Liste des matières premières identifiées comme prioritaires pour le développement des formules PERFUMUM mais non encore acquises. Organisées par phase de sourcing selon le budget disponible.

---

### Phase 1 — Terpènes critiques ⭐⭐⭐ CRITIQUE
Budget estimé : 150-300 EUR (Floracopeia, Sigma-Aldrich)

- **Nerolidol** : transversal 6 formules (0.5-1.5g/100g)
- **Bisabolol** : ACC-01, ACC-04, ACC-06 (0.5-1g/100g)
- **Cedrol** : ACC-01, ACC-03, ACC-05 (0.5g/100g)
- **Caryophyllène** : profils épicés/boisés cannabis
- **Myrcène** : fruité-terreux cannabis
- **Humulène** : houblon-boisé-terreux
- **Guaiol**, **Valencene**, **Farnesene**

*Impact : Ces terpènes sont au cœur des synergies pyrolytiques PERFUMUM.*

---

### Phase 2 — Absolus patrimoniaux/tabac ⭐⭐
Budget estimé : 150-300 EUR

- **Absolu tabac** : signature fumée-cuir-miel
- **Davana Oil** dilué 10% (Perfumer's Apprentice) : fruité-rum-prune fermenté (ACC-03)
- **Mate Absolute** : herbacé-fumé-terreux
- **Foin Absolute** : coumarine naturelle-foin coupé

---

### Phase 2 — Boisés spécialisés ⭐⭐
- **Oud/Agarwood** (reconstitution ou naturel dilué)
- **Cypriol/Nagarmotha** (Creating Perfume) : 20-40 EUR
- **Palo Santo** : boisé-résineux-mystique
- **Guaiacwood** : fumé-rose-boisé

---

### Phase 2 — Résines/Baumes ⭐
- **Galbanum** : vert-résineux-amer
- **Benzoin** (Siam/Sumatra) : vanille-baumé-résineux
- **Myrrhe** : amer-baumé-médicinal-encens
- **Opoponax** : miel-baumé-ambré

---

### Phase 3 — Floraux rares ⭐
- **Tuberose** : crémeux-narcotique-indolique
- **Mimosa** : poudré-miel-vert
- **Cassie** : violette-poudré-floral

---

### Phase 3 — Muscs/Fixateurs spécialisés ⭐
- **Ambrette** (seed oil/absolute) : musc végétal-fruité-floral
- **Exaltolide** : musc macrocyclique doux

---

### Priorisation sourcing immédiat
**Phase 1 (avec kit 200 EUR)** :
1. Terpènes : Nerolidol, Bisabolol, Cedrol — ~150-300 EUR
2. Davana Oil dilué 10% — ~30-50 EUR
3. Cypriol/Nagarmotha — ~20-40 EUR

**Budget complémentaire Phase 1** : 200 EUR`;

    const slug = `as02-materiaux-prioritaires-absents-${Date.now()}`;
    const entryCode = `AS02-MAIN-${Date.now().toString().slice(-6)}`;
    
    await conn.execute(
      `INSERT INTO research_entries (entry_code, title, slug, content, entry_type, status, primary_axis_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [entryCode, 'AS-02 — Matériaux Prioritaires ABSENTS', slug, contentMain, 'synthesis', 'completed', axisId]
    );
    console.log('  + Research entry principale AS-02 créée');
    entriesCreated++;
  } else {
    console.log('  ↔ Research entry principale AS-02 existante');
  }
  
  // Créer les fiches individuelles pour chaque matériau AS-02
  for (const mat of AS02_MATERIALS) {
    const title = `AS-02 — ${mat.nom}`;
    const [existing] = await conn.execute(
      'SELECT id FROM research_entries WHERE title = ? LIMIT 1',
      [title]
    );
    
    if (existing.length > 0) {
      console.log(`  ↔ Existante: ${title}`);
      continue;
    }
    
    const content = `## Matériau Prioritaire : ${mat.nom}

**Type** : ${mat.type}
**Note olfactive** : ${mat.note}
**Famille(s) olfactive(s)** : ${mat.famille_olfactive.join(', ')}
**Profil olfactif** : ${mat.profil_olfactif}

### Notes techniques
${mat.notes_techniques}

### Sourcing
**Priorité** : ${mat.priorite}
**Budget estimé** : ${mat.budget_eur} EUR
**Fournisseurs suggérés** : ${mat.fournisseur_suggere}

### Formules cibles
${mat.formules_cibles.map(f => `- ${f}`).join('\n')}

### Molécules clés
${mat.molecules_cles.length > 0 ? mat.molecules_cles.map(m => `- ${m}`).join('\n') : 'À documenter'}

### Statut d'acquisition
**Non acquis** — À commander selon plan de sourcing AS-02`;

    const slug = `as02-${mat.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
    const entryCode = `AS02-${mat.nom.toUpperCase().replace(/[^A-Z0-9]+/g, '-').substring(0, 15)}-${Date.now().toString().slice(-6)}`;
    
    try {
      await conn.execute(
        `INSERT INTO research_entries (entry_code, title, slug, content, entry_type, status, primary_axis_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [entryCode, title, slug, content, 'note', 'in_progress', axisId]
      );
      console.log(`  + Créée: ${title}`);
      entriesCreated++;
    } catch (err) {
      console.error(`  ✗ Erreur ${title}:`, err.message);
      errors++;
    }
  }
  
  console.log(`\nEntries AS-02 créées: ${entriesCreated} | Erreurs: ${errors}`);
  return entriesCreated;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const conn = await getConnection();
  
  const plantsUpdated = await enrichPlants(conn);
  const entriesCreated = await importAS02(conn);
  
  // Vérifier les totaux
  const [[p]] = await conn.execute('SELECT COUNT(*) as n FROM plants');
  const [[m]] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
  const [[re]] = await conn.execute('SELECT COUNT(*) as n FROM research_entries');
  const [[pm]] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules');
  
  await conn.end();
  
  console.log('\n=== Résumé Final ===');
  console.log(`Plantes enrichies: ${plantsUpdated}`);
  console.log(`Research entries AS-02 créées: ${entriesCreated}`);
  console.log(`\nBase totale:`);
  console.log(`  Plantes: ${p.n} | Molécules: ${m.n} | Research entries: ${re.n} | Plant-molecules: ${pm.n}`);
}

main().catch(console.error);
