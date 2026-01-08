/**
 * Script d'import des données du Mambe pour PERFUMUM
 * 
 * Ce script importe:
 * 1. Les plantes associées au Mambe (Erythroxylum coca var. ipadu, Cecropia, Protium heptaphyllum)
 * 2. Les molécules associées (alcaloïdes, terpènes)
 * 3. Les liens plantes-molécules
 * 
 * Source: Wikipedia ES - https://es.wikipedia.org/wiki/Mambe
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

// Extraire les informations de connexion
const url = new URL(DATABASE_URL);
const connection = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: true }
});

console.log('🔗 Connexion à la base de données établie');

// ============================================================================
// DONNÉES DES PLANTES ASSOCIÉES AU MAMBE
// ============================================================================

const plantsData = [
  {
    name: "Coca amazonienne (Mambe)",
    latinName: "Erythroxylum coca var. ipadu",
    family: "Erythroxylaceae",
    category: "autre",
    origin: "Amazonie (Colombie, Brésil, Pérou)",
    habitat: "Forêt tropicale amazonienne, bassins du Río Putumayo et Río Vaupés",
    olfactiveSignature: "Notes vertes herbacées, légèrement amères, avec une touche terreuse et végétale fraîche",
    dominantMolecules: JSON.stringify(["Cocaïne (0.25%)", "Cinnamoylcocaïne", "Benzoylecgonine", "Ecgonine", "Méthyl salicylate"]),
    chemotypes: "Variété ipadu - teneur en cocaïne la plus faible (0.25%) parmi les variétés de coca",
    climaticAxis: "vent",
    traditionalUse: "Mambe/Ypadú - poudre rituelle des peuples Uitoto et Tukano. Utilisé dans les mambeaderos (espaces rituels) avec l'ambil (tabac) pour les réunions, échanges et prises de décisions. Propriétés nutritionnelles et sociales.",
    absorbeUse: "Recherche ethnobotanique - documentation des pratiques rituelles amazoniennes. Intérêt pour les notes vertes et le profil olfactif unique après torréfaction.",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Feuille fraîche",
        odor: "Verte, herbacée, légèrement amère",
        molecules: ["Méthyl salicylate", "Chlorophylle"],
        usage: "Acullico traditionnel"
      },
      {
        state: "B",
        name: "Feuille torréfiée (Mambe)",
        odor: "Fumée, grillée, terreuse avec notes de cacao",
        molecules: ["Pyrazines", "Furanes", "Aldéhydes"],
        usage: "Préparation du mambe"
      }
    ]),
    notes: "Source: Wikipedia ES - Mambe. Le mambe se distingue de l'acullico andin par son goût fumé caractéristique. Préparé par torréfaction, broyage et mélange avec des cendres alcalines de yarumo (Cecropia)."
  },
  {
    name: "Yarumo (Cetico)",
    latinName: "Cecropia peltata",
    family: "Urticaceae",
    category: "autre",
    origin: "Amérique centrale et du Sud, Amazonie",
    habitat: "Forêts tropicales humides, zones perturbées, lisières forestières",
    olfactiveSignature: "Notes végétales neutres, légèrement terreuses après combustion, cendres alcalines",
    dominantMolecules: JSON.stringify(["Composés phénoliques", "Tanins", "Flavonoïdes"]),
    chemotypes: "Plusieurs espèces utilisées: C. peltata, C. sciadophylla",
    climaticAxis: "bois",
    traditionalUse: "Feuilles brûlées pour produire les cendres alcalines (10% du mélange) nécessaires à la préparation du mambe. L'alcalinité facilite l'absorption des alcaloïdes.",
    absorbeUse: "Intérêt pour le rôle des cendres dans la modification du profil olfactif et l'activation des composés",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Feuille fraîche",
        odor: "Végétale, neutre",
        molecules: ["Chlorophylle", "Tanins"],
        usage: "Non utilisée directement"
      },
      {
        state: "B",
        name: "Cendres",
        odor: "Minérale, alcaline, légèrement âcre",
        molecules: ["Carbonates", "Oxydes métalliques"],
        usage: "Additif alcalin pour le mambe"
      }
    ]),
    notes: "Aussi appelé embaúba (Brésil) ou cetico (Pérou). Les cendres peuvent aussi provenir de tiges de quinoa (Chenopodium quinoa)."
  },
  {
    name: "Copal amazonien",
    latinName: "Protium heptaphyllum",
    family: "Burseraceae",
    category: "resine",
    origin: "Amazonie, Amérique du Sud tropicale",
    habitat: "Forêts tropicales humides, terra firme",
    olfactiveSignature: "Résineuse, balsamique, notes de pin et d'encens, légèrement citronnée",
    dominantMolecules: JSON.stringify(["α-pinène", "β-pinène", "Limonène", "β-caryophyllène", "α-phellandrène", "p-cymène", "Terpinolène"]),
    chemotypes: "Profil terpénique variable selon l'origine géographique",
    climaticAxis: "bois",
    traditionalUse: "Résine utilisée comme encens (sahumerio) par le peuple Tanimuca dans la préparation d'une variante aromatisée du mambe. La fumigation des cendres avec la résine confère un goût aromatisé distinctif.",
    absorbeUse: "Source de terpènes pour les formulations résineuses et boisées. Intérêt pour les notes d'encens amazonien.",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Résine fraîche",
        odor: "Balsamique, résineuse, notes de pin",
        molecules: ["α-pinène", "β-pinène", "Limonène"],
        usage: "Encens, fumigation"
      },
      {
        state: "B",
        name: "Résine brûlée",
        odor: "Fumée aromatique, encens, notes boisées profondes",
        molecules: ["Produits de pyrolyse terpénique"],
        usage: "Sahumerio pour mambe aromatisé"
      }
    ]),
    notes: "Utilisé par le peuple Tanimuca (Río Apaporis, Colombie) avec des feuilles d'Ischnosiphon sp. pour créer une variante aromatisée du mambe. Documenté par Richard Evans Schultes en 1957."
  },
  {
    name: "Maranta amazonienne",
    latinName: "Ischnosiphon sp.",
    family: "Marantaceae",
    category: "autre",
    origin: "Amazonie colombienne, bassin du Río Apaporis",
    habitat: "Sous-bois de forêt tropicale humide",
    olfactiveSignature: "Notes végétales subtiles, légèrement herbacées",
    dominantMolecules: JSON.stringify(["Composés végétaux non caractérisés"]),
    climaticAxis: "vent",
    traditionalUse: "Feuilles utilisées par le peuple Tanimuca dans la préparation des cendres aromatisées pour le mambe, en combinaison avec la résine de Protium heptaphyllum.",
    absorbeUse: "Documentation ethnobotanique - rôle dans la modification du profil aromatique",
    notes: "Espèce documentée par R.E. Schultes (1957) dans la région du Río Igarapé Peritomé, affluent du Río Apaporis."
  }
];

// ============================================================================
// DONNÉES DES MOLÉCULES ASSOCIÉES
// ============================================================================

const moleculesData = [
  {
    name: "Cocaïne",
    iupacName: "méthyl (1R,2R,3S,5S)-3-benzoyloxy-8-méthyl-8-azabicyclo[3.2.1]octane-2-carboxylate",
    casNumber: "50-36-2",
    chemicalClass: "other",
    family: "Alcaloïde tropanique",
    chemicalFormula: "C17H21NO4",
    olfactiveProfile: "Pratiquement inodore sous forme pure, légère note amère",
    sourceOrigin: "Erythroxylum coca var. ipadu (0.25%), E. coca var. coca (0.63%), E. novogranatense (0.77%)",
    notes: "Principal alcaloïde de la coca. La variété ipadu utilisée pour le mambe contient la plus faible concentration (0.25%). Usage rituel et nutritionnel dans les cultures amazoniennes."
  },
  {
    name: "Cinnamoylcocaïne",
    iupacName: "méthyl (1R,2R,3S,5S)-3-cinnamoyloxy-8-méthyl-8-azabicyclo[3.2.1]octane-2-carboxylate",
    casNumber: "521-67-5",
    chemicalClass: "other",
    family: "Alcaloïde tropanique",
    chemicalFormula: "C19H23NO4",
    olfactiveProfile: "Notes légèrement balsamiques, cinnamiques",
    sourceOrigin: "Erythroxylum coca (toutes variétés)",
    notes: "Alcaloïde secondaire de la coca, présent en faibles quantités. Contribue au profil aromatique global."
  },
  {
    name: "Ecgonine",
    iupacName: "acide (1R,2R,3S,5S)-3-hydroxy-8-méthyl-8-azabicyclo[3.2.1]octane-2-carboxylique",
    casNumber: "481-37-8",
    chemicalClass: "other",
    family: "Alcaloïde tropanique",
    chemicalFormula: "C9H15NO3",
    olfactiveProfile: "Inodore",
    sourceOrigin: "Erythroxylum coca (métabolite)",
    notes: "Précurseur et métabolite de la cocaïne. Structure de base des alcaloïdes tropaniques."
  },
  {
    name: "2-Méthylpyrazine",
    casNumber: "109-08-0",
    chemicalClass: "heterocyclic",
    family: "Pyrazine",
    chemicalFormula: "C5H6N2",
    olfactiveProfile: "Notes torréfiées, grillées, noisette, cacao",
    sourceOrigin: "Produit de la réaction de Maillard lors de la torréfaction des feuilles de coca",
    notes: "Composé aromatique formé lors de la torréfaction. Responsable des notes fumées caractéristiques du mambe."
  },
  {
    name: "2,5-Diméthylpyrazine",
    casNumber: "123-32-0",
    chemicalClass: "heterocyclic",
    family: "Pyrazine",
    chemicalFormula: "C6H8N2",
    olfactiveProfile: "Notes de cacao, café torréfié, noisette grillée",
    sourceOrigin: "Produit de torréfaction",
    notes: "Pyrazine formée lors de la torréfaction des feuilles. Contribue au profil fumé distinctif du mambe."
  },
  {
    name: "Furfural",
    casNumber: "98-01-1",
    chemicalClass: "aldehyde",
    family: "Furane",
    chemicalFormula: "C5H4O2",
    olfactiveProfile: "Notes de pain grillé, amande, boisé chaud",
    sourceOrigin: "Dégradation thermique des sucres végétaux",
    notes: "Aldéhyde furaniqe formé lors de la torréfaction. Contribue aux notes grillées et boisées du mambe."
  }
];

// ============================================================================
// FONCTIONS D'IMPORT
// ============================================================================

async function importPlants() {
  console.log('\n🌿 Import des plantes associées au Mambe...');
  
  for (const plant of plantsData) {
    try {
      // Vérifier si la plante existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM plants WHERE latin_name = ? OR name = ?',
        [plant.latinName, plant.name]
      );
      
      if (existing.length > 0) {
        console.log(`  ⚠️  ${plant.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      // Insérer la nouvelle plante
      const [result] = await connection.execute(
        `INSERT INTO plants (
          name, latin_name, family, category, origin, habitat,
          olfactive_signature, dominant_molecules, chemotypes,
          climatic_axis, traditional_use, absorbe_use, botanical_states, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plant.name,
          plant.latinName,
          plant.family,
          plant.category,
          plant.origin,
          plant.habitat,
          plant.olfactiveSignature,
          plant.dominantMolecules,
          plant.chemotypes,
          plant.climaticAxis,
          plant.traditionalUse,
          plant.absorbeUse,
          plant.botanicalStates,
          plant.notes
        ]
      );
      
      console.log(`  ✅ ${plant.name} importée (ID: ${result.insertId})`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${plant.name}:`, error.message);
    }
  }
}

async function importMolecules() {
  console.log('\n🧪 Import des molécules associées au Mambe...');
  
  for (const molecule of moleculesData) {
    try {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ? OR cas_number = ?',
        [molecule.name, molecule.casNumber || null]
      );
      
      if (existing.length > 0) {
        console.log(`  ⚠️  ${molecule.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      // Insérer la nouvelle molécule
      const [result] = await connection.execute(
        `INSERT INTO molecules (
          name, iupac_name, cas_number, chemical_class, family,
          chemicalFormula, olfactiveProfile, sourceOrigin, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          molecule.name,
          molecule.iupacName || null,
          molecule.casNumber || null,
          molecule.chemicalClass || null,
          molecule.family || null,
          molecule.chemicalFormula || null,
          molecule.olfactiveProfile || null,
          molecule.sourceOrigin || null,
          molecule.notes || null
        ]
      );
      
      console.log(`  ✅ ${molecule.name} importée (ID: ${result.insertId})`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${molecule.name}:`, error.message);
    }
  }
}

async function createPlantMoleculeLinks() {
  console.log('\n🔗 Création des liens plantes-molécules...');
  
  // Liens pour Erythroxylum coca var. ipadu
  const cocaLinks = [
    { plant: "Erythroxylum coca var. ipadu", molecule: "Cocaïne", percentage: "0.25" },
    { plant: "Erythroxylum coca var. ipadu", molecule: "Cinnamoylcocaïne", percentage: null },
    { plant: "Erythroxylum coca var. ipadu", molecule: "Ecgonine", percentage: null },
    { plant: "Erythroxylum coca var. ipadu", molecule: "2-Méthylpyrazine", percentage: null },
    { plant: "Erythroxylum coca var. ipadu", molecule: "2,5-Diméthylpyrazine", percentage: null },
    { plant: "Erythroxylum coca var. ipadu", molecule: "Furfural", percentage: null },
  ];
  
  // Liens pour Protium heptaphyllum
  const protiumLinks = [
    { plant: "Protium heptaphyllum", molecule: "α-pinène", percentage: null },
    { plant: "Protium heptaphyllum", molecule: "β-pinène", percentage: null },
    { plant: "Protium heptaphyllum", molecule: "Limonène", percentage: null },
    { plant: "Protium heptaphyllum", molecule: "β-caryophyllène", percentage: null },
  ];
  
  const allLinks = [...cocaLinks, ...protiumLinks];
  
  for (const link of allLinks) {
    try {
      // Trouver l'ID de la plante
      const [plantResult] = await connection.execute(
        'SELECT id FROM plants WHERE latin_name = ? OR name LIKE ?',
        [link.plant, `%${link.plant}%`]
      );
      
      if (plantResult.length === 0) {
        console.log(`  ⚠️  Plante non trouvée: ${link.plant}`);
        continue;
      }
      
      // Trouver l'ID de la molécule
      const [moleculeResult] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [link.molecule]
      );
      
      if (moleculeResult.length === 0) {
        console.log(`  ⚠️  Molécule non trouvée: ${link.molecule}`);
        continue;
      }
      
      const plantId = plantResult[0].id;
      const moleculeId = moleculeResult[0].id;
      
      // Vérifier si le lien existe déjà
      const [existingLink] = await connection.execute(
        'SELECT id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
        [plantId, moleculeId]
      );
      
      if (existingLink.length > 0) {
        console.log(`  ⚠️  Lien déjà existant: ${link.plant} ↔ ${link.molecule}`);
        continue;
      }
      
      // Créer le lien
      await connection.execute(
        'INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes) VALUES (?, ?, ?, ?)',
        [plantId, moleculeId, link.percentage, `Lien Mambe - Source: Wikipedia ES`]
      );
      
      console.log(`  ✅ Lien créé: ${link.plant} ↔ ${link.molecule}`);
    } catch (error) {
      console.error(`  ❌ Erreur pour le lien ${link.plant} ↔ ${link.molecule}:`, error.message);
    }
  }
}

// ============================================================================
// EXÉCUTION
// ============================================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   PERFUMUM - Import des données Mambe (Colombie/Amazonie)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Source: https://es.wikipedia.org/wiki/Mambe');
  
  try {
    await importPlants();
    await importMolecules();
    await createPlantMoleculeLinks();
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   ✅ Import terminé avec succès!');
    console.log('═══════════════════════════════════════════════════════════════');
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'import:', error);
  } finally {
    await connection.end();
    console.log('\n🔌 Connexion fermée');
  }
}

main();
