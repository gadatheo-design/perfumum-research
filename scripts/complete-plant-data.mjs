/**
 * Script pour compléter les données des plantes :
 * 1. Créer les liaisons molécule-plante manquantes
 * 2. Ajouter les propriétés thérapeutiques aux 11 nouvelles plantes
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Liaisons molécule-plante manquantes à créer
const MISSING_LINKS = [
  // 1,8-Cinéole (Eucalyptol) - ID: 570048
  { moleculeId: 570048, plantName: "Niaouli", percentage: 55, isMain: true },
  { moleculeId: 570048, plantName: "Myrte", percentage: 25, isMain: true },
  { moleculeId: 570048, plantName: "Laurier noble", percentage: 45, isMain: true },
  { moleculeId: 570048, plantName: "Camphrier", percentage: 50, isMain: true },
  
  // Terpinène-4-ol - ID: 960002
  { moleculeId: 960002, plantName: "Niaouli", percentage: 8, isMain: false },
  { moleculeId: 960002, plantName: "Myrte", percentage: 5, isMain: false },
  
  // Néral - ID: 810033
  { moleculeId: 810033, plantName: "Angélique", percentage: 5, isMain: false },
  
  // Farnésol - ID: 690001
  { moleculeId: 690001, plantName: "Cassie", percentage: 8, isMain: false },
  { moleculeId: 690001, plantName: "Genêt", percentage: 5, isMain: false },
  
  // Acétate de géranyle - ID: 570019
  { moleculeId: 570019, plantName: "Angélique", percentage: 3, isMain: false }
];

// Propriétés thérapeutiques des 11 nouvelles plantes
const PLANT_THERAPEUTIC_DATA = [
  {
    name: "Réglisse",
    traditionalUse: "Utilisée depuis l'Antiquité en médecine traditionnelle chinoise et égyptienne. Employée pour adoucir la gorge, calmer la toux et soutenir la digestion. La racine était mâchée pour ses propriétés édulcorantes naturelles.",
    absorbeUse: "En parfumerie, la réglisse apporte des notes douces, anisées et légèrement boisées. Elle est utilisée dans les compositions gourmandes et orientales pour sa chaleur caractéristique."
  },
  {
    name: "Genêt",
    traditionalUse: "Plante médicinale traditionnelle utilisée comme diurétique et cardiotonique. Les fleurs étaient employées en infusion pour leurs propriétés purifiantes. Attention : contient des alcaloïdes toxiques à forte dose.",
    absorbeUse: "L'absolue de genêt offre un parfum floral intense, miellé et légèrement herbacé. Utilisée dans les compositions florales sophistiquées et les parfums de niche."
  },
  {
    name: "Cassie",
    traditionalUse: "Utilisée traditionnellement en Amérique latine et en Inde pour ses propriétés antiseptiques et astringentes. Les fleurs étaient employées en infusion pour calmer les maux de tête et les troubles digestifs.",
    absorbeUse: "L'absolue de cassie est l'une des plus précieuses en parfumerie. Elle offre un bouquet floral complexe : violette, mimosa, miel et épices. Utilisée dans les grands parfums floraux."
  },
  {
    name: "Niaouli",
    traditionalUse: "Huile essentielle majeure de l'aromathérapie française. Utilisée pour ses puissantes propriétés antivirales, antibactériennes et expectorantes. Traditionnellement employée contre les infections respiratoires et pour renforcer l'immunité.",
    absorbeUse: "Le niaouli apporte des notes fraîches, camphrées et légèrement sucrées. Utilisé dans les compositions aromatiques et les parfums masculins pour sa fraîcheur médicinale."
  },
  {
    name: "Myrte",
    traditionalUse: "Plante sacrée de la mythologie grecque, dédiée à Aphrodite. Utilisée traditionnellement pour les affections respiratoires, comme antiseptique urinaire et pour tonifier la peau. L'hydrolat est réputé pour les soins cutanés.",
    absorbeUse: "L'huile essentielle de myrte offre un parfum frais, camphré et légèrement floral. Utilisée dans les eaux de Cologne, les parfums aromatiques et les compositions méditerranéennes."
  },
  {
    name: "Curcuma",
    traditionalUse: "Épice sacrée de la médecine ayurvédique depuis plus de 4000 ans. Puissant anti-inflammatoire naturel grâce à la curcumine. Utilisé pour la digestion, les douleurs articulaires et comme antioxydant majeur.",
    absorbeUse: "L'huile essentielle de curcuma apporte des notes terreuses, épicées et légèrement amères. Utilisée dans les parfums orientaux et les compositions épicées pour sa profondeur aromatique."
  },
  {
    name: "Sapin baumier",
    traditionalUse: "Arbre sacré des Amérindiens, utilisé pour ses propriétés respiratoires et cicatrisantes. La résine (baume du Canada) était employée comme antiseptique et pour traiter les plaies. L'huile essentielle est expectorante et apaisante.",
    absorbeUse: "Le sapin baumier offre un parfum résineux, balsamique et légèrement sucré. Utilisé dans les parfums boisés, les compositions hivernales et les fragrances masculines pour sa profondeur forestière."
  },
  {
    name: "Camphrier",
    traditionalUse: "Arbre vénéré en Asie pour ses propriétés médicinales. Le camphre est utilisé comme stimulant circulatoire, décongestionnant respiratoire et analgésique local. Employé traditionnellement contre les douleurs musculaires et les refroidissements.",
    absorbeUse: "L'huile essentielle de camphrier apporte des notes fraîches, pénétrantes et médicinales. Utilisée dans les parfums aromatiques, les eaux fraîches et comme note de tête vivifiante."
  },
  {
    name: "Laurier noble",
    traditionalUse: "Symbole de victoire dans l'Antiquité gréco-romaine. Utilisé traditionnellement pour ses propriétés digestives, antibactériennes et antidouleur. Les feuilles sont employées en cuisine et en phytothérapie pour leurs vertus stimulantes.",
    absorbeUse: "L'huile essentielle de laurier noble offre un parfum aromatique, épicé et légèrement camphré. Utilisée dans les parfums masculins, les fougères et les compositions aromatiques méditerranéennes."
  },
  {
    name: "Angélique",
    traditionalUse: "Surnommée 'herbe des anges' au Moyen Âge pour ses vertus protectrices. Utilisée traditionnellement comme tonique digestif, expectorant et pour calmer l'anxiété. La racine est particulièrement prisée en phytothérapie et en liquoristerie.",
    absorbeUse: "L'huile essentielle d'angélique offre des notes musquées, terreuses et légèrement épicées. Utilisée comme note de fond dans les parfums chyprés, orientaux et les compositions sophistiquées."
  },
  {
    name: "Anis vert",
    traditionalUse: "Plante médicinale utilisée depuis l'Égypte ancienne. Reconnue pour ses propriétés digestives, carminatives et galactogènes. Traditionnellement employée contre les coliques, les ballonnements et pour favoriser la lactation.",
    absorbeUse: "L'huile essentielle d'anis vert apporte des notes anisées, douces et légèrement épicées. Utilisée dans les parfums gourmands, les compositions orientales et les fragrances à caractère réglissé."
  }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== COMPLÉTION DES DONNÉES PLANTES ===\n');
  
  // 1. Créer les liaisons manquantes
  console.log('--- CRÉATION DES LIAISONS MANQUANTES ---\n');
  let linksCreated = 0;
  
  for (const link of MISSING_LINKS) {
    // Trouver la plante
    const [plants] = await connection.query(
      'SELECT id FROM plants WHERE name = ?',
      [link.plantName]
    );
    
    if (plants.length === 0) {
      console.log('⚠️ Plante non trouvée: ' + link.plantName);
      continue;
    }
    
    const plantId = plants[0].id;
    
    // Vérifier si la liaison existe
    const [existingLink] = await connection.query(
      'SELECT id FROM molecule_plant_sources WHERE molecule_id = ? AND plant_id = ?',
      [link.moleculeId, plantId]
    );
    
    if (existingLink.length > 0) {
      console.log('- Liaison existante: Molécule ' + link.moleculeId + ' ↔ ' + link.plantName);
      continue;
    }
    
    // Créer la liaison
    await connection.query(
      'INSERT INTO molecule_plant_sources (molecule_id, plant_id, percentage_in_oil, is_main_source, notes) VALUES (?, ?, ?, ?, ?)',
      [link.moleculeId, plantId, link.percentage, link.isMain ? 1 : 0, 'Enrichissement scientifique 2026-01-30']
    );
    
    console.log('✓ Molécule ' + link.moleculeId + ' ↔ ' + link.plantName + ' (' + link.percentage + '%)');
    linksCreated++;
  }
  
  // 2. Ajouter les propriétés thérapeutiques
  console.log('\n--- AJOUT DES PROPRIÉTÉS THÉRAPEUTIQUES ---\n');
  let plantsUpdated = 0;
  
  for (const plantData of PLANT_THERAPEUTIC_DATA) {
    // Trouver la plante
    const [plants] = await connection.query(
      'SELECT id, traditional_use FROM plants WHERE name = ?',
      [plantData.name]
    );
    
    if (plants.length === 0) {
      console.log('⚠️ Plante non trouvée: ' + plantData.name);
      continue;
    }
    
    const plant = plants[0];
    
    // Vérifier si les données existent déjà
    if (plant.traditional_use && plant.traditional_use.length > 50) {
      console.log('- ' + plantData.name + ' a déjà des propriétés thérapeutiques');
      continue;
    }
    
    // Mettre à jour la plante
    await connection.query(
      'UPDATE plants SET traditional_use = ?, absorbe_use = ? WHERE id = ?',
      [plantData.traditionalUse, plantData.absorbeUse, plant.id]
    );
    
    console.log('✓ ' + plantData.name + ' - Propriétés thérapeutiques ajoutées');
    plantsUpdated++;
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log('Liaisons créées: ' + linksCreated);
  console.log('Plantes mises à jour: ' + plantsUpdated);
  
  await connection.end();
}

main().catch(console.error);
