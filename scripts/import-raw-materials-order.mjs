/**
 * Import des 17 matières premières de la commande
 * Source: Eden Botanicals / Fournisseur artisanal
 */

// Les 17 matières premières de la commande
const rawMaterialsOrder = [
  {
    materialId: "RM-ORD-001",
    name: "Palo Santo - Artisan Distillation",
    latinName: "Bursera graveolens",
    category: "huile_essentielle",
    origin: "Amérique du Sud",
    extractionMethod: "Distillation artisanale",
    description: "Distillation artisanale très douce de bois de cœur naturellement tombé",
    olfactiveProfile: {
      topNotes: ["citrus", "menthol"],
      heartNotes: ["bois", "encens"],
      baseNotes: ["résine", "fumé"]
    },
    character: ["boisé", "sacré", "doux"],
    volume: "1.5 ml",
    price: 16.00,
    currency: "CHF",
    container: "High recovery vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Limonène", "α-Terpinéol", "Menthofuran"]
  },
  {
    materialId: "RM-ORD-002",
    name: "Italian Bergamot Oil",
    latinName: "Citrus bergamia",
    category: "huile_essentielle",
    origin: "Italie (Calabre)",
    extractionMethod: "Expression à froid",
    description: "Le classique intemporel - huile de bergamote italienne de qualité supérieure",
    olfactiveProfile: {
      topNotes: ["agrume", "pétillant", "frais"],
      heartNotes: ["floral léger"],
      baseNotes: ["légèrement amer"]
    },
    character: ["frais", "élégant", "lumineux"],
    volume: "1.3 ml",
    price: 6.00,
    currency: "CHF",
    container: "Recovery vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Acétate de linalyle", "Limonène", "Linalol", "Bergaptène"]
  },
  {
    materialId: "RM-ORD-003",
    name: "Artisan Peppermint Oil - Organic France",
    latinName: "Mentha × piperita",
    category: "huile_essentielle",
    origin: "France",
    extractionMethod: "Distillation à la vapeur",
    description: "Menthe poivrée ronde et équilibrée avec notes florales, bio, France",
    olfactiveProfile: {
      topNotes: ["menthol", "frais intense"],
      heartNotes: ["herbacé", "floral"],
      baseNotes: ["doux"]
    },
    character: ["frais", "rond", "floral"],
    volume: "3 ml",
    price: 8.00,
    currency: "CHF",
    container: "Glass attar bottle with applicator",
    supplier: "Eden Botanicals",
    certifications: ["Organic"],
    keyMolecules: ["Menthol", "Menthone", "Acétate de menthyle"]
  },
  {
    materialId: "RM-ORD-004",
    name: "Wild Juniper - Artisan Essential Oil",
    latinName: "Juniperus communis",
    category: "huile_essentielle",
    origin: "Sud de la France",
    extractionMethod: "Distillation artisanale",
    description: "Huile essentielle de genévrier sauvage de qualité artisanale du Sud de la France",
    olfactiveProfile: {
      topNotes: ["pin", "frais"],
      heartNotes: ["boisé", "résineux"],
      baseNotes: ["terreux", "balsamique"]
    },
    character: ["sauvage", "boisé", "frais"],
    volume: "1.5 ml",
    price: 10.00,
    currency: "CHF",
    container: "Max recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["α-Pinène", "Myrcène", "Sabinène", "Limonène"]
  },
  {
    materialId: "RM-ORD-005",
    name: "Mitti Attar - Petrichor Origin",
    latinName: null,
    category: "attar",
    origin: "Inde",
    extractionMethod: "Distillation traditionnelle indienne",
    description: "L'odeur de la première pluie : l'origine du Pétrichor. Attar indien traditionnel de haute qualité",
    olfactiveProfile: {
      topNotes: ["terre humide", "minéral"],
      heartNotes: ["argile", "pluie"],
      baseNotes: ["terreux profond"]
    },
    character: ["terreux", "minéral", "nostalgique"],
    volume: "0.25 ml",
    price: 12.00,
    currency: "CHF",
    container: "High recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Géosmine", "2-Méthylisobornéol"]
  },
  {
    materialId: "RM-ORD-006",
    name: "Gris d'Ambre - Grey Ambergris in Vintage Sandalwood",
    latinName: null,
    category: "teinture",
    origin: "Océan Indien",
    extractionMethod: "Macération dans huile de santal vintage",
    description: "Ambre gris cendré macéré dans de l'huile de santal vintage",
    olfactiveProfile: {
      topNotes: ["marin", "salin"],
      heartNotes: ["ambre", "santal"],
      baseNotes: ["musqué", "animal doux"]
    },
    character: ["précieux", "animalique", "marin"],
    volume: "0.25 ml",
    price: 25.00,
    currency: "CHF",
    container: "High recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Ambréine", "α-Santalol", "β-Santalol"]
  },
  {
    materialId: "RM-ORD-007",
    name: "Crème de Citronnelle - Aged Rum Character",
    latinName: "Cymbopogon citratus",
    category: "huile_essentielle",
    origin: "Asie du Sud-Est",
    extractionMethod: "Distillation",
    description: "Citronnelle profonde et complexe comme un rhum vieilli",
    olfactiveProfile: {
      topNotes: ["citron", "herbacé"],
      heartNotes: ["rose", "géranium"],
      baseNotes: ["rhum", "vanillé"]
    },
    character: ["complexe", "profond", "gourmand"],
    volume: "1.3 ml",
    price: 8.00,
    currency: "CHF",
    container: "High recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Citral", "Géraniol", "Citronellal"]
  },
  {
    materialId: "RM-ORD-008",
    name: "Oud Tea - Aquilaria Malaccensis Leaves",
    latinName: "Aquilaria malaccensis",
    category: "matiere_brute",
    origin: "Assam, Inde",
    extractionMethod: null,
    description: "Feuilles d'Aquilaria Malaccensis d'Assam préparées comme un thé délicieux",
    olfactiveProfile: {
      topNotes: ["thé vert", "herbacé"],
      heartNotes: ["boisé léger", "oud subtil"],
      baseNotes: ["fumé doux"]
    },
    character: ["délicat", "boisé", "thé"],
    volume: "20 gr",
    price: 7.00,
    currency: "CHF",
    container: "Sample bag",
    supplier: "Eden Botanicals",
    keyMolecules: []
  },
  {
    materialId: "RM-ORD-009",
    name: "Miyazaki Citrus - Japanese Hyuganatsu",
    latinName: "Citrus tamurana",
    category: "huile_essentielle",
    origin: "Japon (Miyazaki)",
    extractionMethod: "Distillation artisanale",
    description: "Agrume japonais rare, doux et délicat, distillé artisanalement",
    olfactiveProfile: {
      topNotes: ["agrume doux", "yuzu-like"],
      heartNotes: ["floral blanc", "jasmin subtil"],
      baseNotes: ["légèrement amer"]
    },
    character: ["délicat", "rare", "japonais"],
    volume: "1.5 ml",
    price: 19.00,
    currency: "CHF",
    container: "High recovery sample vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Limonène", "γ-Terpinène", "Linalol"]
  },
  {
    materialId: "RM-ORD-010",
    name: "Tangerine Dream - Mediterranean Petitgrain",
    latinName: "Citrus reticulata",
    category: "huile_essentielle",
    origin: "Méditerranée",
    extractionMethod: "Distillation",
    description: "Petitgrain de mandarine méditerranéenne luxuriante",
    olfactiveProfile: {
      topNotes: ["mandarine", "agrume doux"],
      heartNotes: ["feuille verte", "floral"],
      baseNotes: ["boisé léger"]
    },
    character: ["luxuriant", "fruité", "vert"],
    volume: "1.5 ml",
    price: 9.00,
    currency: "CHF",
    container: "Max recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Acétate de linalyle", "Linalol", "Limonène"]
  },
  {
    materialId: "RM-ORD-011",
    name: "Plumeria Light - Frangipani in Jojoba",
    latinName: "Plumeria alba",
    category: "dilution",
    origin: "Asie tropicale",
    extractionMethod: "Enfleurage / Dilution",
    description: "Huile essentielle de frangipanier diluée dans l'huile de jojoba",
    olfactiveProfile: {
      topNotes: ["floral blanc", "jasmin"],
      heartNotes: ["gardénia", "ylang"],
      baseNotes: ["crémeux", "vanillé"]
    },
    character: ["tropical", "floral", "crémeux"],
    volume: "1.5 ml",
    price: 15.00,
    currency: "CHF",
    container: "High recovery vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Benzyl benzoate", "Linalol", "Géraniol"]
  },
  {
    materialId: "RM-ORD-012",
    name: "Omani Black Frankincense - Boswellia Sacra",
    latinName: "Boswellia sacra",
    category: "resine",
    origin: "Dhofar, Oman",
    extractionMethod: null,
    description: "Résine noire surprenante de Boswellia Sacra du Dhofar (Oman)",
    olfactiveProfile: {
      topNotes: ["citron", "pin"],
      heartNotes: ["encens", "balsamique"],
      baseNotes: ["fumé", "résineux profond"]
    },
    character: ["sacré", "fumé", "profond"],
    volume: "10 gr",
    price: 6.00,
    currency: "CHF",
    container: "Sampler bag",
    supplier: "Eden Botanicals",
    keyMolecules: ["Acide boswellique", "α-Pinène", "Limonène", "Incensole"]
  },
  {
    materialId: "RM-ORD-013",
    name: "Neroli Bouquetier Reserve - Orange Blossom Quintessence",
    latinName: "Citrus aurantium",
    category: "huile_essentielle",
    origin: "Méditerranée",
    extractionMethod: "Distillation",
    description: "Quintessence de fleur d'oranger, 100% pure, naturelle et bio",
    olfactiveProfile: {
      topNotes: ["fleur d'oranger", "frais"],
      heartNotes: ["floral blanc", "jasmin"],
      baseNotes: ["miel", "légèrement animal"]
    },
    character: ["précieux", "floral", "lumineux"],
    volume: "0.25 ml",
    price: 14.00,
    currency: "CHF",
    container: "Max recovery lab vial",
    supplier: "Eden Botanicals",
    certifications: ["Organic", "Natural"],
    keyMolecules: ["Linalol", "Acétate de linalyle", "Nérolidol", "Indole"]
  },
  {
    materialId: "RM-ORD-014",
    name: "Makrut Lime Essential Oil - Artisan Quality",
    latinName: "Citrus hystrix",
    category: "huile_essentielle",
    origin: "Asie du Sud-Est",
    extractionMethod: "Distillation artisanale haute qualité",
    description: "L'étoile des agrumes d'Asie du Sud - distillation artisanale haute qualité",
    olfactiveProfile: {
      topNotes: ["lime intense", "zeste"],
      heartNotes: ["herbacé", "feuille de kaffir"],
      baseNotes: ["légèrement amer"]
    },
    character: ["intense", "exotique", "frais"],
    volume: "5 ml",
    price: 25.00,
    currency: "CHF",
    container: "Aromatherapy bottle",
    supplier: "Eden Botanicals",
    keyMolecules: ["Citronellal", "Limonène", "β-Pinène"]
  },
  {
    materialId: "RM-ORD-015",
    name: "Spikenard - Divine Nard / Jatamansi",
    latinName: "Nardostachys jatamansi",
    category: "huile_essentielle",
    origin: "Himalaya",
    extractionMethod: "Distillation",
    description: "Nard divin / Jatamansi - huile pure des Himalayas",
    olfactiveProfile: {
      topNotes: ["terreux", "racine"],
      heartNotes: ["boisé", "vétiver-like"],
      baseNotes: ["musqué", "animal doux"]
    },
    character: ["sacré", "terreux", "méditatif"],
    volume: "1.3 ml",
    price: 15.00,
    currency: "CHF",
    container: "High recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Valeranone", "Jatamansone", "Patchouli alcohol"]
  },
  {
    materialId: "RM-ORD-016",
    name: "Haitian Vetiver - Organic Rich Topnotes",
    latinName: "Vetiveria zizanioides",
    category: "huile_essentielle",
    origin: "Haïti",
    extractionMethod: "Distillation",
    description: "Vétiver bio haïtien délicieux, riche en notes de tête",
    olfactiveProfile: {
      topNotes: ["agrume", "grapefruit"],
      heartNotes: ["terreux", "boisé"],
      baseNotes: ["fumé", "racine profonde"]
    },
    character: ["terreux", "complexe", "riche"],
    volume: "1.5 ml",
    price: 13.00,
    currency: "CHF",
    container: "High recovery lab vial",
    supplier: "Eden Botanicals",
    certifications: ["Organic"],
    keyMolecules: ["Vétivérol", "Khusimol", "Isovalencénol"]
  },
  {
    materialId: "RM-ORD-017",
    name: "Black Emerald - Vintage Assamese Wild Vetiver",
    latinName: "Vetiveria zizanioides",
    category: "huile_essentielle",
    origin: "Assam, Inde",
    extractionMethod: "Distillation artisanale",
    description: "Vétiver sauvage d'Assam vintage artisanal, 100% pur et naturel",
    olfactiveProfile: {
      topNotes: ["vert", "frais"],
      heartNotes: ["boisé profond", "fumé"],
      baseNotes: ["terreux intense", "cuir"]
    },
    character: ["sauvage", "profond", "vintage"],
    volume: "1.5 ml",
    price: null, // Prix non indiqué
    currency: "CHF",
    container: "High recovery lab vial",
    supplier: "Eden Botanicals",
    keyMolecules: ["Vétivérol", "Khusimol", "Vétivène"]
  }
];

console.log("📦 Import des 17 matières premières de la commande");
console.log("=".repeat(60));

rawMaterialsOrder.forEach((material, idx) => {
  console.log(`\n${idx + 1}. ${material.name}`);
  console.log(`   Latin: ${material.latinName || 'N/A'}`);
  console.log(`   Catégorie: ${material.category}`);
  console.log(`   Origine: ${material.origin}`);
  console.log(`   Volume: ${material.volume}`);
  console.log(`   Prix: ${material.price ? material.price + ' ' + material.currency : 'N/A'}`);
  console.log(`   Molécules clés: ${material.keyMolecules.join(', ') || 'N/A'}`);
});

console.log("\n" + "=".repeat(60));
console.log(`✅ ${rawMaterialsOrder.length} matières premières prêtes à être importées`);
console.log("\nPour importer dans la base de données, utilisez l'API tRPC ou le SQL direct.");

// Export pour utilisation dans d'autres scripts
export { rawMaterialsOrder };
