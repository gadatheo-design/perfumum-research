import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== Import des compositions moléculaires des plantes ===\n');

// Données de composition moléculaire (sources: littérature scientifique, bases de données)
// Format: { plantName, latinName, molecules: [{ name, percentageMin, percentageMax, percentageTypical, isSignature, role, variabilityFactor, source }] }

const plantCompositions = [
  // ============ LAVANDE (Lavandula angustifolia) ============
  {
    plantName: 'Lavande vraie',
    latinName: 'Lavandula angustifolia',
    category: 'aromatique',
    molecules: [
      { name: 'Linalool', percentageMin: 25, percentageMax: 45, percentageTypical: 35, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3515' },
      { name: 'Acétate de linalyle', percentageMin: 25, percentageMax: 46, percentageTypical: 35, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3515' },
      { name: 'Lavandulol', percentageMin: 0.1, percentageMax: 1.5, percentageTypical: 0.5, isSignature: 0, role: 'trace', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'Terpinène-4-ol', percentageMin: 0.1, percentageMax: 6, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'geographique', source: 'ISO 3515' },
      { name: '1,8-Cinéole', percentageMin: 0, percentageMax: 2.5, percentageTypical: 1, isSignature: 0, role: 'trace', variabilityFactor: 'chemotype', source: 'ISO 3515' },
      { name: 'Camphre', percentageMin: 0, percentageMax: 1.5, percentageTypical: 0.5, isSignature: 0, role: 'trace', variabilityFactor: 'chemotype', source: 'ISO 3515' },
      { name: 'β-Caryophyllène', percentageMin: 2, percentageMax: 7, percentageTypical: 4, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'Ocimène', percentageMin: 2, percentageMax: 10, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'saisonnier', source: 'ISO 3515' },
    ]
  },
  // ============ CITRON (Citrus limon) ============
  {
    plantName: 'Citron',
    latinName: 'Citrus limon',
    category: 'aromatique',
    molecules: [
      { name: 'Limonène', percentageMin: 65, percentageMax: 95, percentageTypical: 70, isSignature: 1, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 855' },
      { name: 'β-Pinène', percentageMin: 6, percentageMax: 17, percentageTypical: 12, isSignature: 0, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 855' },
      { name: 'γ-Terpinène', percentageMin: 3, percentageMax: 11, percentageTypical: 7, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 855' },
      { name: 'Citral', percentageMin: 1, percentageMax: 5, percentageTypical: 2.5, isSignature: 1, role: 'secondaire', variabilityFactor: 'saisonnier', source: 'Tisserand & Young 2014' },
      { name: 'α-Pinène', percentageMin: 1, percentageMax: 4, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 855' },
      { name: 'Myrcène', percentageMin: 1, percentageMax: 3, percentageTypical: 1.5, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 855' },
    ]
  },
  // ============ ORANGE DOUCE (Citrus sinensis) ============
  {
    plantName: 'Orange douce',
    latinName: 'Citrus sinensis',
    category: 'aromatique',
    molecules: [
      { name: 'Limonène', percentageMin: 90, percentageMax: 97, percentageTypical: 94, isSignature: 1, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3140' },
      { name: 'Myrcène', percentageMin: 1, percentageMax: 3, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3140' },
      { name: 'α-Pinène', percentageMin: 0.3, percentageMax: 1, percentageTypical: 0.5, isSignature: 0, role: 'trace', variabilityFactor: 'stable', source: 'ISO 3140' },
      { name: 'Linalool', percentageMin: 0.1, percentageMax: 0.8, percentageTypical: 0.4, isSignature: 0, role: 'trace', variabilityFactor: 'geographique', source: 'Tisserand & Young 2014' },
      { name: 'Décanal', percentageMin: 0.1, percentageMax: 0.5, percentageTypical: 0.3, isSignature: 0, role: 'trace', variabilityFactor: 'stable', source: 'ISO 3140' },
    ]
  },
  // ============ BERGAMOTE (Citrus bergamia) ============
  {
    plantName: 'Bergamote',
    latinName: 'Citrus bergamia',
    category: 'aromatique',
    molecules: [
      { name: 'Limonène', percentageMin: 25, percentageMax: 53, percentageTypical: 40, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3520' },
      { name: 'Acétate de linalyle', percentageMin: 17, percentageMax: 40, percentageTypical: 30, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3520' },
      { name: 'Linalool', percentageMin: 3, percentageMax: 15, percentageTypical: 10, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3520' },
      { name: 'γ-Terpinène', percentageMin: 5, percentageMax: 12, percentageTypical: 8, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3520' },
      { name: 'β-Pinène', percentageMin: 4, percentageMax: 11, percentageTypical: 7, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3520' },
      { name: 'Bergaptène', percentageMin: 0.2, percentageMax: 0.4, percentageTypical: 0.3, isSignature: 1, role: 'trace', variabilityFactor: 'stable', source: 'IFRA' },
    ]
  },
  // ============ MENTHE POIVRÉE (Mentha piperita) ============
  {
    plantName: 'Menthe poivrée',
    latinName: 'Mentha piperita',
    category: 'aromatique',
    molecules: [
      { name: 'Menthol', percentageMin: 30, percentageMax: 55, percentageTypical: 42, isSignature: 1, role: 'majeur', variabilityFactor: 'chemotype', source: 'ISO 856' },
      { name: 'Menthone', percentageMin: 14, percentageMax: 32, percentageTypical: 22, isSignature: 1, role: 'majeur', variabilityFactor: 'saisonnier', source: 'ISO 856' },
      { name: 'Isomenthone', percentageMin: 1.5, percentageMax: 10, percentageTypical: 4, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 856' },
      { name: 'Acétate de menthyle', percentageMin: 2.8, percentageMax: 10, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'saisonnier', source: 'ISO 856' },
      { name: '1,8-Cinéole', percentageMin: 3.5, percentageMax: 14, percentageTypical: 6, isSignature: 0, role: 'secondaire', variabilityFactor: 'chemotype', source: 'ISO 856' },
      { name: 'Limonène', percentageMin: 1, percentageMax: 5, percentageTypical: 2.5, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 856' },
      { name: 'Pulégone', percentageMin: 0.5, percentageMax: 4, percentageTypical: 1.5, isSignature: 0, role: 'trace', variabilityFactor: 'chemotype', source: 'IFRA - toxicité' },
    ]
  },
  // ============ EUCALYPTUS (Eucalyptus globulus) ============
  {
    plantName: 'Eucalyptus globulus',
    latinName: 'Eucalyptus globulus',
    category: 'aromatique',
    molecules: [
      { name: '1,8-Cinéole', percentageMin: 60, percentageMax: 85, percentageTypical: 72, isSignature: 1, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 770' },
      { name: 'α-Pinène', percentageMin: 2, percentageMax: 25, percentageTypical: 10, isSignature: 0, role: 'secondaire', variabilityFactor: 'geographique', source: 'ISO 770' },
      { name: 'Limonène', percentageMin: 1, percentageMax: 15, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'geographique', source: 'ISO 770' },
      { name: 'p-Cymène', percentageMin: 0.5, percentageMax: 5, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'Globulol', percentageMin: 0.5, percentageMax: 5, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 770' },
    ]
  },
  // ============ ROMARIN (Rosmarinus officinalis) ============
  {
    plantName: 'Romarin',
    latinName: 'Rosmarinus officinalis',
    category: 'aromatique',
    molecules: [
      { name: '1,8-Cinéole', percentageMin: 15, percentageMax: 55, percentageTypical: 35, isSignature: 1, role: 'majeur', variabilityFactor: 'chemotype', source: 'ISO 1342' },
      { name: 'Camphre', percentageMin: 5, percentageMax: 25, percentageTypical: 15, isSignature: 1, role: 'majeur', variabilityFactor: 'chemotype', source: 'ISO 1342' },
      { name: 'α-Pinène', percentageMin: 9, percentageMax: 25, percentageTypical: 15, isSignature: 0, role: 'majeur', variabilityFactor: 'chemotype', source: 'ISO 1342' },
      { name: 'β-Pinène', percentageMin: 2, percentageMax: 9, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 1342' },
      { name: 'Bornéol', percentageMin: 1, percentageMax: 6, percentageTypical: 3, isSignature: 0, role: 'secondaire', variabilityFactor: 'chemotype', source: 'ISO 1342' },
      { name: 'Verbénone', percentageMin: 0, percentageMax: 15, percentageTypical: 5, isSignature: 1, role: 'variable', variabilityFactor: 'chemotype', source: 'Chémotype verbénone' },
    ]
  },
  // ============ VÉTIVER (Vetiveria zizanioides) ============
  {
    plantName: 'Vétiver',
    latinName: 'Vetiveria zizanioides',
    category: 'aromatique',
    molecules: [
      { name: 'Vétivérol', percentageMin: 3, percentageMax: 12, percentageTypical: 7, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 4716' },
      { name: 'Khusimol', percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 4716' },
      { name: 'β-Vétivénène', percentageMin: 3, percentageMax: 10, percentageTypical: 6, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'α-Vétivone', percentageMin: 2, percentageMax: 8, percentageTypical: 5, isSignature: 1, role: 'secondaire', variabilityFactor: 'geographique', source: 'ISO 4716' },
      { name: 'β-Vétivone', percentageMin: 2, percentageMax: 10, percentageTypical: 5, isSignature: 1, role: 'secondaire', variabilityFactor: 'geographique', source: 'ISO 4716' },
    ]
  },
  // ============ YLANG-YLANG (Cananga odorata) ============
  {
    plantName: 'Ylang-Ylang',
    latinName: 'Cananga odorata',
    category: 'fleur',
    molecules: [
      { name: 'Linalool', percentageMin: 3, percentageMax: 18, percentageTypical: 10, isSignature: 1, role: 'majeur', variabilityFactor: 'extraction', source: 'ISO 3063' },
      { name: 'Géraniol', percentageMin: 1, percentageMax: 10, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'extraction', source: 'ISO 3063' },
      { name: 'Acétate de benzyle', percentageMin: 5, percentageMax: 20, percentageTypical: 12, isSignature: 1, role: 'majeur', variabilityFactor: 'extraction', source: 'ISO 3063' },
      { name: 'β-Caryophyllène', percentageMin: 5, percentageMax: 25, percentageTypical: 15, isSignature: 0, role: 'majeur', variabilityFactor: 'extraction', source: 'ISO 3063' },
      { name: 'Germacrène D', percentageMin: 10, percentageMax: 25, percentageTypical: 18, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'p-Crésyl méthyl éther', percentageMin: 5, percentageMax: 16, percentageTypical: 10, isSignature: 1, role: 'majeur', variabilityFactor: 'extraction', source: 'ISO 3063' },
    ]
  },
  // ============ ROSE (Rosa damascena) ============
  {
    plantName: 'Rose de Damas',
    latinName: 'Rosa damascena',
    category: 'fleur',
    molecules: [
      { name: 'Citronellol', percentageMin: 20, percentageMax: 40, percentageTypical: 30, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 9842' },
      { name: 'Géraniol', percentageMin: 10, percentageMax: 25, percentageTypical: 18, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 9842' },
      { name: 'Nérol', percentageMin: 5, percentageMax: 12, percentageTypical: 8, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 9842' },
      { name: 'Phényléthanol', percentageMin: 1, percentageMax: 3, percentageTypical: 2, isSignature: 1, role: 'secondaire', variabilityFactor: 'extraction', source: 'Tisserand & Young 2014' },
      { name: 'Eugénol', percentageMin: 0.5, percentageMax: 2, percentageTypical: 1, isSignature: 0, role: 'trace', variabilityFactor: 'stable', source: 'ISO 9842' },
      { name: 'Rose oxide', percentageMin: 0.01, percentageMax: 0.1, percentageTypical: 0.05, isSignature: 1, role: 'trace', variabilityFactor: 'stable', source: 'Impact olfactif majeur' },
    ]
  },
  // ============ JASMIN (Jasminum grandiflorum) ============
  {
    plantName: 'Jasmin grandiflorum',
    latinName: 'Jasminum grandiflorum',
    category: 'fleur',
    molecules: [
      { name: 'Acétate de benzyle', percentageMin: 15, percentageMax: 30, percentageTypical: 23, isSignature: 1, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3518' },
      { name: 'Linalool', percentageMin: 3, percentageMax: 10, percentageTypical: 6, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3518' },
      { name: 'Indole', percentageMin: 1, percentageMax: 3, percentageTypical: 2.5, isSignature: 1, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3518' },
      { name: 'Jasmone', percentageMin: 1, percentageMax: 5, percentageTypical: 3, isSignature: 1, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'Benzoate de benzyle', percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3518' },
      { name: 'Phytol', percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3518' },
    ]
  },
  // ============ PATCHOULI (Pogostemon cablin) ============
  {
    plantName: 'Patchouli',
    latinName: 'Pogostemon cablin',
    category: 'aromatique',
    molecules: [
      { name: 'Patchoulol', percentageMin: 25, percentageMax: 45, percentageTypical: 35, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3757' },
      { name: 'α-Bulnésène', percentageMin: 10, percentageMax: 20, percentageTypical: 15, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3757' },
      { name: 'α-Guaiène', percentageMin: 10, percentageMax: 20, percentageTypical: 15, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3757' },
      { name: 'Séychellène', percentageMin: 3, percentageMax: 10, percentageTypical: 6, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'β-Caryophyllène', percentageMin: 2, percentageMax: 6, percentageTypical: 4, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3757' },
      { name: 'Pogostol', percentageMin: 1, percentageMax: 5, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3757' },
    ]
  },
  // ============ BOIS DE SANTAL (Santalum album) ============
  {
    plantName: 'Bois de Santal',
    latinName: 'Santalum album',
    category: 'bois',
    molecules: [
      { name: 'α-Santalol', percentageMin: 41, percentageMax: 55, percentageTypical: 48, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3518' },
      { name: 'β-Santalol', percentageMin: 16, percentageMax: 24, percentageTypical: 20, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 3518' },
      { name: 'α-Bergamotol', percentageMin: 2, percentageMax: 6, percentageTypical: 4, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
      { name: 'Epi-β-santalol', percentageMin: 2, percentageMax: 5, percentageTypical: 3, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3518' },
    ]
  },
  // ============ ENCENS (Boswellia carterii) ============
  {
    plantName: 'Encens / Oliban',
    latinName: 'Boswellia carterii',
    category: 'resine',
    molecules: [
      { name: 'α-Pinène', percentageMin: 25, percentageMax: 60, percentageTypical: 40, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 22972' },
      { name: 'Limonène', percentageMin: 5, percentageMax: 20, percentageTypical: 12, isSignature: 0, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 22972' },
      { name: 'β-Myrcène', percentageMin: 1, percentageMax: 10, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 22972' },
      { name: 'Incensole', percentageMin: 1, percentageMax: 8, percentageTypical: 4, isSignature: 1, role: 'secondaire', variabilityFactor: 'geographique', source: 'Tisserand & Young 2014' },
      { name: 'Acétate d\'incensyle', percentageMin: 0.5, percentageMax: 5, percentageTypical: 2, isSignature: 1, role: 'secondaire', variabilityFactor: 'geographique', source: 'Tisserand & Young 2014' },
    ]
  },
  // ============ CÈDRE DE L'ATLAS (Cedrus atlantica) ============
  {
    plantName: 'Cèdre de l\'Atlas',
    latinName: 'Cedrus atlantica',
    category: 'bois',
    molecules: [
      { name: 'β-Himachalène', percentageMin: 30, percentageMax: 50, percentageTypical: 40, isSignature: 1, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 4731' },
      { name: 'α-Himachalène', percentageMin: 10, percentageMax: 20, percentageTypical: 15, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 4731' },
      { name: 'γ-Himachalène', percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 4731' },
      { name: 'Atlantone', percentageMin: 2, percentageMax: 8, percentageTypical: 5, isSignature: 1, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
    ]
  },
  // ============ CITRONNELLE (Cymbopogon citratus) ============
  {
    plantName: 'Citronnelle / Lemongrass',
    latinName: 'Cymbopogon citratus',
    category: 'aromatique',
    molecules: [
      { name: 'Citral', percentageMin: 65, percentageMax: 85, percentageTypical: 75, isSignature: 1, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 3217' },
      { name: 'Myrcène', percentageMin: 5, percentageMax: 20, percentageTypical: 12, isSignature: 0, role: 'majeur', variabilityFactor: 'saisonnier', source: 'ISO 3217' },
      { name: 'Géraniol', percentageMin: 2, percentageMax: 8, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'ISO 3217' },
      { name: 'Limonène', percentageMin: 1, percentageMax: 5, percentageTypical: 2, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
    ]
  },
  // ============ GÉRANIUM (Pelargonium graveolens) ============
  {
    plantName: 'Géranium rosat',
    latinName: 'Pelargonium graveolens',
    category: 'aromatique',
    molecules: [
      { name: 'Citronellol', percentageMin: 20, percentageMax: 40, percentageTypical: 30, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 4731' },
      { name: 'Géraniol', percentageMin: 10, percentageMax: 25, percentageTypical: 18, isSignature: 1, role: 'majeur', variabilityFactor: 'geographique', source: 'ISO 4731' },
      { name: 'Formate de citronellyle', percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 0, role: 'majeur', variabilityFactor: 'stable', source: 'ISO 4731' },
      { name: 'Isomenthone', percentageMin: 3, percentageMax: 10, percentageTypical: 6, isSignature: 0, role: 'secondaire', variabilityFactor: 'geographique', source: 'ISO 4731' },
      { name: 'Linalool', percentageMin: 2, percentageMax: 8, percentageTypical: 5, isSignature: 0, role: 'secondaire', variabilityFactor: 'stable', source: 'Tisserand & Young 2014' },
    ]
  },
];

// Fonction pour trouver ou créer une plante
async function findOrCreatePlant(plantData) {
  // Chercher d'abord par nom latin
  let [plants] = await connection.execute(
    'SELECT id FROM plants WHERE latin_name = ? OR name = ?',
    [plantData.latinName, plantData.plantName]
  );
  
  if (plants.length > 0) {
    return plants[0].id;
  }
  
  // Créer la plante si elle n'existe pas
  const [result] = await connection.execute(
    `INSERT INTO plants (name, latin_name, category, olfactive_signature) VALUES (?, ?, ?, ?)`,
    [plantData.plantName, plantData.latinName, plantData.category, `Plante aromatique - ${plantData.plantName}`]
  );
  
  console.log(`  ✓ Plante créée: ${plantData.plantName}`);
  return result.insertId;
}

// Fonction pour trouver une molécule par nom
async function findMolecule(moleculeName) {
  const [molecules] = await connection.execute(
    'SELECT id, name FROM molecules WHERE name LIKE ? OR name LIKE ?',
    [`%${moleculeName}%`, moleculeName]
  );
  
  if (molecules.length > 0) {
    return molecules[0];
  }
  return null;
}

// Import des données
let totalInserted = 0;
let totalSkipped = 0;
let plantsProcessed = 0;

for (const plantData of plantCompositions) {
  console.log(`\n📌 ${plantData.plantName} (${plantData.latinName})`);
  
  const plantId = await findOrCreatePlant(plantData);
  plantsProcessed++;
  
  for (const mol of plantData.molecules) {
    const molecule = await findMolecule(mol.name);
    
    if (!molecule) {
      console.log(`  ⚠ Molécule non trouvée: ${mol.name}`);
      totalSkipped++;
      continue;
    }
    
    // Vérifier si la relation existe déjà
    const [existing] = await connection.execute(
      'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
      [plantId, molecule.id]
    );
    
    if (existing.length > 0) {
      // Mettre à jour
      await connection.execute(
        `UPDATE plant_molecules SET 
          percentage_min = ?, percentage_max = ?, percentage_typical = ?,
          is_signature = ?, role = ?, variability_factor = ?, source = ?
        WHERE plant_id = ? AND molecule_id = ?`,
        [
          mol.percentageMin, mol.percentageMax, mol.percentageTypical,
          mol.isSignature, mol.role, mol.variabilityFactor, mol.source,
          plantId, molecule.id
        ]
      );
      console.log(`  ↻ Mise à jour: ${mol.name} (${mol.percentageMin}-${mol.percentageMax}%)`);
    } else {
      // Insérer
      await connection.execute(
        `INSERT INTO plant_molecules 
          (plant_id, molecule_id, percentage_min, percentage_max, percentage_typical, 
           is_signature, role, variability_factor, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plantId, molecule.id,
          mol.percentageMin, mol.percentageMax, mol.percentageTypical,
          mol.isSignature, mol.role, mol.variabilityFactor, mol.source
        ]
      );
      console.log(`  ✓ Ajouté: ${mol.name} (${mol.percentageMin}-${mol.percentageMax}%)`);
      totalInserted++;
    }
  }
}

console.log('\n=== Résumé ===');
console.log(`Plantes traitées: ${plantsProcessed}`);
console.log(`Relations créées: ${totalInserted}`);
console.log(`Molécules non trouvées: ${totalSkipped}`);

await connection.end();
console.log('\nImport terminé!');
