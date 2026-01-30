import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== Import des matières premières ===\n');

// Données des matières premières à importer
const rawMaterials = [
  // ============ HUILES ESSENTIELLES ============
  {
    materialId: 'HE-EUC-001',
    name: 'Huile essentielle d\'Eucalyptus globulus',
    latinName: 'Eucalyptus globulus',
    category: 'huile_essentielle',
    plantPart: 'feuille',
    originCountry: 'Portugal',
    originRegion: 'Alentejo',
    olfactiveFamily: 'aromatique',
    olfactiveProfile: 'Frais, camphré, balsamique, légèrement mentholé',
    topNotes: 'Eucalyptol frais, camphré',
    heartNotes: 'Balsamique, légèrement boisé',
    baseNotes: 'Résineux doux',
    intensity: 8,
    tenacity: 3,
    dominantMolecules: [
      { name: '1,8-Cinéole', percentage: 72 },
      { name: 'α-Pinène', percentage: 10 },
      { name: 'Limonène', percentage: 5 }
    ],
    quality: 'bio',
    priceRange: 'economique',
    availability: 'disponible',
    usageNotes: 'Excellent pour les accords frais et respiratoires. Dosage 1-5%.',
    blendingTips: 'Se marie bien avec la menthe, le romarin, le citron et la lavande.'
  },
  {
    materialId: 'HE-PAT-001',
    name: 'Huile essentielle de Patchouli',
    latinName: 'Pogostemon cablin',
    category: 'huile_essentielle',
    plantPart: 'feuille',
    originCountry: 'Indonésie',
    originRegion: 'Sumatra',
    olfactiveFamily: 'boise',
    olfactiveProfile: 'Terreux, boisé, camphré, légèrement sucré et épicé',
    topNotes: 'Camphré, herbacé',
    heartNotes: 'Terreux, boisé profond',
    baseNotes: 'Musqué, ambré, persistant',
    intensity: 9,
    tenacity: 72,
    dominantMolecules: [
      { name: 'Patchoulol', percentage: 35 },
      { name: 'α-Bulnésène', percentage: 15 },
      { name: 'α-Guaiène', percentage: 15 }
    ],
    quality: 'bio',
    priceRange: 'standard',
    availability: 'disponible',
    usageNotes: 'Note de fond puissante. Dosage 0.5-3%. Améliore avec le vieillissement.',
    blendingTips: 'Excellent fixatif. Se marie avec le vétiver, le santal, la rose et les agrumes.'
  },
  {
    materialId: 'HE-SAN-001',
    name: 'Huile essentielle de Bois de Santal',
    latinName: 'Santalum album',
    category: 'huile_essentielle',
    plantPart: 'bois',
    originCountry: 'Inde',
    originRegion: 'Mysore, Karnataka',
    olfactiveFamily: 'boise',
    olfactiveProfile: 'Boisé crémeux, lacté, légèrement sucré et balsamique',
    topNotes: 'Légèrement épicé',
    heartNotes: 'Boisé crémeux, lacté',
    baseNotes: 'Balsamique, musqué doux',
    intensity: 7,
    tenacity: 96,
    dominantMolecules: [
      { name: 'α-Santalol', percentage: 48 },
      { name: 'β-Santalol', percentage: 20 }
    ],
    quality: 'bio',
    priceRange: 'luxe',
    availability: 'rare',
    usageNotes: 'Note de fond précieuse. Dosage 1-10%. Très bonne tenue.',
    blendingTips: 'Se marie avec la rose, le jasmin, le vétiver et les bois.'
  },
  {
    materialId: 'HE-CED-001',
    name: 'Huile essentielle de Cèdre de l\'Atlas',
    latinName: 'Cedrus atlantica',
    category: 'huile_essentielle',
    plantPart: 'bois',
    originCountry: 'Maroc',
    originRegion: 'Atlas',
    olfactiveFamily: 'boise',
    olfactiveProfile: 'Boisé sec, légèrement fumé, résineux',
    topNotes: 'Résineux frais',
    heartNotes: 'Boisé sec, légèrement fumé',
    baseNotes: 'Ambré doux',
    intensity: 6,
    tenacity: 48,
    dominantMolecules: [
      { name: 'β-Himachalène', percentage: 40 },
      { name: 'α-Himachalène', percentage: 15 }
    ],
    quality: 'bio',
    priceRange: 'economique',
    availability: 'disponible',
    usageNotes: 'Note de fond accessible. Dosage 1-10%.',
    blendingTips: 'Se marie avec le cyprès, le vétiver, les agrumes et la lavande.'
  },
  {
    materialId: 'HE-GER-001',
    name: 'Huile essentielle de Géranium rosat',
    latinName: 'Pelargonium graveolens',
    category: 'huile_essentielle',
    plantPart: 'feuille',
    originCountry: 'Égypte',
    originRegion: 'Haute-Égypte',
    olfactiveFamily: 'floral',
    olfactiveProfile: 'Floral rosé, vert, légèrement fruité et mentholé',
    topNotes: 'Vert, légèrement mentholé',
    heartNotes: 'Rosé, floral doux',
    baseNotes: 'Légèrement musqué',
    intensity: 7,
    tenacity: 24,
    dominantMolecules: [
      { name: 'Citronellol', percentage: 30 },
      { name: 'Géraniol', percentage: 18 },
      { name: 'Linalool', percentage: 5 }
    ],
    quality: 'bio',
    priceRange: 'standard',
    availability: 'disponible',
    usageNotes: 'Alternative économique à la rose. Dosage 1-5%.',
    blendingTips: 'Se marie avec la rose, le palmarosa, les agrumes et la lavande.'
  },
  {
    materialId: 'HE-NEL-001',
    name: 'Huile essentielle de Néroli',
    latinName: 'Citrus aurantium var. amara',
    category: 'huile_essentielle',
    plantPart: 'fleur',
    originCountry: 'Tunisie',
    originRegion: 'Cap Bon',
    olfactiveFamily: 'floral',
    olfactiveProfile: 'Floral blanc, frais, légèrement vert et miellé',
    topNotes: 'Frais, légèrement vert',
    heartNotes: 'Floral blanc, orangé',
    baseNotes: 'Miellé, légèrement animal',
    intensity: 8,
    tenacity: 12,
    dominantMolecules: [
      { name: 'Linalool', percentage: 35 },
      { name: 'Limonène', percentage: 15 },
      { name: 'Acétate de linalyle', percentage: 10 }
    ],
    quality: 'bio',
    priceRange: 'luxe',
    availability: 'saisonnier',
    usageNotes: 'Note de cœur précieuse. Dosage 0.5-3%.',
    blendingTips: 'Se marie avec le jasmin, la rose, le petit grain et les agrumes.'
  },
  // ============ ABSOLUES ============
  {
    materialId: 'ABS-JAS-001',
    name: 'Absolue de Jasmin grandiflorum',
    latinName: 'Jasminum grandiflorum',
    category: 'absolue',
    plantPart: 'fleur',
    originCountry: 'Égypte',
    originRegion: 'Haute-Égypte',
    olfactiveFamily: 'floral',
    olfactiveProfile: 'Floral blanc intense, fruité, légèrement animal et indolique',
    topNotes: 'Vert, fruité',
    heartNotes: 'Floral blanc intense, narcotique',
    baseNotes: 'Animal, indolique, miellé',
    intensity: 10,
    tenacity: 48,
    dominantMolecules: [
      { name: 'Acétate de benzyle', percentage: 23 },
      { name: 'Linalool', percentage: 6 },
      { name: 'Indole', percentage: 2.5 }
    ],
    quality: 'bio',
    priceRange: 'luxe',
    availability: 'saisonnier',
    usageNotes: 'Note de cœur précieuse. Dosage 0.1-1%. Très puissante.',
    blendingTips: 'Se marie avec la rose, le néroli, le santal et les muscs.'
  },
  {
    materialId: 'ABS-TUB-001',
    name: 'Absolue de Tubéreuse',
    latinName: 'Polianthes tuberosa',
    category: 'absolue',
    plantPart: 'fleur',
    originCountry: 'Inde',
    originRegion: 'Tamil Nadu',
    olfactiveFamily: 'floral',
    olfactiveProfile: 'Floral blanc capiteux, crémeux, légèrement épicé et miellé',
    topNotes: 'Vert, légèrement épicé',
    heartNotes: 'Floral blanc capiteux, crémeux',
    baseNotes: 'Miellé, légèrement animal',
    intensity: 10,
    tenacity: 72,
    dominantMolecules: [
      { name: 'Acétate de benzyle', percentage: 15 },
      { name: 'Benzoate de benzyle', percentage: 10 },
      { name: 'Salicylate de benzyle', percentage: 8 }
    ],
    quality: 'bio',
    priceRange: 'luxe',
    availability: 'rare',
    usageNotes: 'Note de cœur très précieuse. Dosage 0.05-0.5%. Extrêmement puissante.',
    blendingTips: 'Se marie avec le jasmin, l\'ylang, le néroli et les bois précieux.'
  },
  {
    materialId: 'ABS-VAN-001',
    name: 'Absolue de Vanille',
    latinName: 'Vanilla planifolia',
    category: 'absolue',
    plantPart: 'fruit',
    originCountry: 'Madagascar',
    originRegion: 'SAVA',
    olfactiveFamily: 'gourmand',
    olfactiveProfile: 'Vanillé riche, balsamique, légèrement fumé et épicé',
    topNotes: 'Légèrement fumé',
    heartNotes: 'Vanillé riche, crémeux',
    baseNotes: 'Balsamique, ambré',
    intensity: 9,
    tenacity: 96,
    dominantMolecules: [
      { name: 'Vanilline', percentage: 2 },
      { name: 'Acide vanillique', percentage: 0.5 }
    ],
    quality: 'bio',
    priceRange: 'luxe',
    availability: 'disponible',
    usageNotes: 'Note de fond gourmande. Dosage 0.5-5%.',
    blendingTips: 'Se marie avec le santal, le benjoin, les épices et le tabac.'
  },
  {
    materialId: 'ABS-MIM-001',
    name: 'Absolue de Mimosa',
    latinName: 'Acacia dealbata',
    category: 'absolue',
    plantPart: 'fleur',
    originCountry: 'France',
    originRegion: 'Grasse, Provence',
    olfactiveFamily: 'floral',
    olfactiveProfile: 'Floral poudreux, miellé, légèrement vert et anisé',
    topNotes: 'Vert, légèrement anisé',
    heartNotes: 'Floral poudreux, miellé',
    baseNotes: 'Poudreux, légèrement cireux',
    intensity: 7,
    tenacity: 24,
    dominantMolecules: [
      { name: 'Anisaldéhyde', percentage: 5 },
      { name: 'Heptanal', percentage: 3 }
    ],
    quality: 'bio',
    priceRange: 'luxe',
    availability: 'saisonnier',
    usageNotes: 'Note de cœur délicate. Dosage 0.5-3%.',
    blendingTips: 'Se marie avec la violette, l\'iris, le cassie et les bois.'
  },
  // ============ EXTRAITS CO2 ============
  {
    materialId: 'CO2-GIN-001',
    name: 'Extrait CO2 de Gingembre',
    latinName: 'Zingiber officinale',
    category: 'co2_extract',
    plantPart: 'racine',
    originCountry: 'Inde',
    originRegion: 'Kerala',
    olfactiveFamily: 'epice',
    olfactiveProfile: 'Épicé frais, citronné, légèrement boisé et terreux',
    topNotes: 'Citronné, frais',
    heartNotes: 'Épicé chaud, légèrement boisé',
    baseNotes: 'Terreux, légèrement sucré',
    intensity: 8,
    tenacity: 12,
    dominantMolecules: [
      { name: 'Zingibérène', percentage: 30 },
      { name: 'β-Sesquiphellandrène', percentage: 10 },
      { name: 'Citral', percentage: 5 }
    ],
    quality: 'bio',
    priceRange: 'premium',
    availability: 'disponible',
    usageNotes: 'Note de tête/cœur épicée. Dosage 0.5-3%. Plus fidèle que l\'HE.',
    blendingTips: 'Se marie avec les agrumes, le poivre, le cardamome et le vétiver.'
  },
  {
    materialId: 'CO2-CAR-001',
    name: 'Extrait CO2 de Cardamome',
    latinName: 'Elettaria cardamomum',
    category: 'co2_extract',
    plantPart: 'graine',
    originCountry: 'Guatemala',
    originRegion: 'Alta Verapaz',
    olfactiveFamily: 'epice',
    olfactiveProfile: 'Épicé frais, camphré, légèrement citronné et eucalyptus',
    topNotes: 'Frais, légèrement camphré',
    heartNotes: 'Épicé aromatique, légèrement citronné',
    baseNotes: 'Boisé doux',
    intensity: 8,
    tenacity: 8,
    dominantMolecules: [
      { name: 'Acétate de terpinyle', percentage: 35 },
      { name: '1,8-Cinéole', percentage: 30 },
      { name: 'Linalool', percentage: 5 }
    ],
    quality: 'bio',
    priceRange: 'premium',
    availability: 'disponible',
    usageNotes: 'Note de tête épicée fraîche. Dosage 0.5-2%.',
    blendingTips: 'Se marie avec les agrumes, le gingembre, la rose et le santal.'
  },
  {
    materialId: 'CO2-FRA-001',
    name: 'Extrait CO2 d\'Encens',
    latinName: 'Boswellia carterii',
    category: 'co2_extract',
    plantPart: 'resine',
    originCountry: 'Somalie',
    originRegion: 'Puntland',
    olfactiveFamily: 'balsamique',
    olfactiveProfile: 'Résineux frais, citronné, légèrement épicé et balsamique',
    topNotes: 'Citronné, frais, légèrement épicé',
    heartNotes: 'Résineux, balsamique',
    baseNotes: 'Boisé, légèrement fumé',
    intensity: 7,
    tenacity: 24,
    dominantMolecules: [
      { name: 'α-Pinène', percentage: 40 },
      { name: 'Limonène', percentage: 12 },
      { name: 'Incensole', percentage: 4 }
    ],
    quality: 'sauvage',
    priceRange: 'premium',
    availability: 'disponible',
    usageNotes: 'Note de cœur/fond sacrée. Dosage 1-5%. Plus complet que l\'HE.',
    blendingTips: 'Se marie avec la myrrhe, le santal, le cèdre et les agrumes.'
  },
  {
    materialId: 'CO2-MYR-001',
    name: 'Extrait CO2 de Myrrhe',
    latinName: 'Commiphora myrrha',
    category: 'co2_extract',
    plantPart: 'resine',
    originCountry: 'Éthiopie',
    originRegion: 'Ogaden',
    olfactiveFamily: 'balsamique',
    olfactiveProfile: 'Résineux chaud, balsamique, légèrement fumé et médicinal',
    topNotes: 'Légèrement camphré',
    heartNotes: 'Résineux chaud, balsamique',
    baseNotes: 'Fumé, légèrement animal',
    intensity: 8,
    tenacity: 48,
    dominantMolecules: [
      { name: 'Furanoeudesma-1,3-diène', percentage: 25 },
      { name: 'Curzerène', percentage: 15 }
    ],
    quality: 'sauvage',
    priceRange: 'premium',
    availability: 'disponible',
    usageNotes: 'Note de fond sacrée. Dosage 0.5-3%.',
    blendingTips: 'Se marie avec l\'encens, le santal, le patchouli et les épices.'
  },
  {
    materialId: 'CO2-VET-001',
    name: 'Extrait CO2 de Vétiver',
    latinName: 'Vetiveria zizanioides',
    category: 'co2_extract',
    plantPart: 'racine',
    originCountry: 'Haïti',
    originRegion: 'Les Cayes',
    olfactiveFamily: 'boise',
    olfactiveProfile: 'Terreux profond, fumé, légèrement sucré et boisé',
    topNotes: 'Terreux, légèrement vert',
    heartNotes: 'Fumé, boisé profond',
    baseNotes: 'Ambré, légèrement sucré',
    intensity: 9,
    tenacity: 96,
    dominantMolecules: [
      { name: 'Vétivérol', percentage: 7 },
      { name: 'Khusimol', percentage: 10 }
    ],
    quality: 'bio',
    priceRange: 'premium',
    availability: 'disponible',
    usageNotes: 'Note de fond terreuse. Dosage 0.5-5%. Plus complet que l\'HE.',
    blendingTips: 'Se marie avec le santal, le patchouli, les agrumes et le gingembre.'
  },
  // ============ OLÉORÉSINES ============
  {
    materialId: 'OLE-BEN-001',
    name: 'Oléorésine de Benjoin',
    latinName: 'Styrax benzoin',
    category: 'oleoresine',
    plantPart: 'resine',
    originCountry: 'Laos',
    originRegion: 'Luang Prabang',
    olfactiveFamily: 'balsamique',
    olfactiveProfile: 'Vanillé balsamique, légèrement fumé et ambré',
    topNotes: 'Légèrement fumé',
    heartNotes: 'Vanillé, balsamique',
    baseNotes: 'Ambré, résineux doux',
    intensity: 8,
    tenacity: 72,
    dominantMolecules: [
      { name: 'Acide benzoïque', percentage: 20 },
      { name: 'Vanilline', percentage: 1 }
    ],
    quality: 'sauvage',
    priceRange: 'standard',
    availability: 'disponible',
    usageNotes: 'Note de fond balsamique. Dosage 1-5%. Excellent fixatif.',
    blendingTips: 'Se marie avec la vanille, le santal, l\'encens et les floraux.'
  },
  {
    materialId: 'OLE-LAB-001',
    name: 'Oléorésine de Labdanum',
    latinName: 'Cistus ladanifer',
    category: 'oleoresine',
    plantPart: 'feuille',
    originCountry: 'Espagne',
    originRegion: 'Estrémadure',
    olfactiveFamily: 'balsamique',
    olfactiveProfile: 'Ambré chaud, légèrement animal, miellé et résineux',
    topNotes: 'Herbacé, légèrement vert',
    heartNotes: 'Ambré, miellé',
    baseNotes: 'Animal, musqué, résineux',
    intensity: 9,
    tenacity: 96,
    dominantMolecules: [
      { name: 'Labdanolide', percentage: 5 },
      { name: 'Ambrox', percentage: 2 }
    ],
    quality: 'sauvage',
    priceRange: 'premium',
    availability: 'saisonnier',
    usageNotes: 'Note de fond ambrée. Dosage 0.5-3%. Caractère ambré naturel.',
    blendingTips: 'Se marie avec le patchouli, le vétiver, les muscs et les floraux.'
  }
];

// Import des matières premières
let totalInserted = 0;
let totalUpdated = 0;

for (const rm of rawMaterials) {
  // Vérifier si la matière existe déjà
  const [existing] = await connection.execute(
    'SELECT id FROM raw_materials WHERE material_id = ?',
    [rm.materialId]
  );
  
  const dominantMoleculesJson = JSON.stringify(rm.dominantMolecules || []);
  
  if (existing.length > 0) {
    // Mettre à jour
    await connection.execute(
      `UPDATE raw_materials SET 
        name = ?, latin_name = ?, category = ?, plant_part = ?,
        origin_country = ?, origin_region = ?, olfactive_family = ?,
        olfactive_profile = ?, top_notes = ?, heart_notes = ?, base_notes = ?,
        intensity = ?, tenacity = ?, dominant_molecules = ?,
        quality = ?, price_range = ?, availability = ?,
        usage_notes = ?, blending_tips = ?
      WHERE material_id = ?`,
      [
        rm.name, rm.latinName, rm.category, rm.plantPart,
        rm.originCountry, rm.originRegion, rm.olfactiveFamily,
        rm.olfactiveProfile, rm.topNotes, rm.heartNotes, rm.baseNotes,
        rm.intensity, rm.tenacity, dominantMoleculesJson,
        rm.quality, rm.priceRange, rm.availability,
        rm.usageNotes, rm.blendingTips,
        rm.materialId
      ]
    );
    console.log(`↻ Mise à jour: ${rm.name}`);
    totalUpdated++;
  } else {
    // Insérer
    await connection.execute(
      `INSERT INTO raw_materials (
        material_id, name, latin_name, category, plant_part,
        origin_country, origin_region, olfactive_family,
        olfactive_profile, top_notes, heart_notes, base_notes,
        intensity, tenacity, dominant_molecules,
        quality, price_range, availability,
        usage_notes, blending_tips
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rm.materialId, rm.name, rm.latinName, rm.category, rm.plantPart,
        rm.originCountry, rm.originRegion, rm.olfactiveFamily,
        rm.olfactiveProfile, rm.topNotes, rm.heartNotes, rm.baseNotes,
        rm.intensity, rm.tenacity, dominantMoleculesJson,
        rm.quality, rm.priceRange, rm.availability,
        rm.usageNotes, rm.blendingTips
      ]
    );
    console.log(`✓ Ajouté: ${rm.name}`);
    totalInserted++;
  }
}

console.log('\n=== Résumé ===');
console.log(`Matières premières ajoutées: ${totalInserted}`);
console.log(`Matières premières mises à jour: ${totalUpdated}`);

// Compter le total
const [count] = await connection.execute('SELECT COUNT(*) as total FROM raw_materials');
console.log(`Total matières premières: ${count[0].total}`);

await connection.end();
console.log('\nImport terminé!');
