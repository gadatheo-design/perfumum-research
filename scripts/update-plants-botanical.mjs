/**
 * Script de mise à jour des données botaniques des plantes
 * Ajoute les familles botaniques et axes climatiques manquants
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

// Données botaniques à mettre à jour
const plantsData = [
  {
    id: 30001,
    name: "Lavande vraie",
    latinName: "Lavandula angustifolia",
    family: "Lamiaceae",
    climaticAxis: "vent",
    justification: "Note fraîche, herbacée, aérienne - molécules principales: linalol (25-38%), acétate de linalyle (25-45%)"
  },
  {
    id: 30002,
    name: "Citron",
    latinName: "Citrus limon",
    family: "Rutaceae",
    climaticAxis: "vent",
    justification: "Agrume vif, frais - molécules principales: limonène (60-70%), citral (2-5%)"
  },
  {
    id: 30003,
    name: "Orange douce",
    latinName: "Citrus sinensis",
    family: "Rutaceae",
    climaticAxis: "vent",
    justification: "Agrume doux, frais - molécules principales: limonène (90-95%)"
  },
  {
    id: 30004,
    name: "Bergamote",
    latinName: "Citrus bergamia",
    family: "Rutaceae",
    climaticAxis: "vent",
    justification: "Agrume frais, aérien - molécules principales: limonène (37-59%), acétate de linalyle (28-40%), linalol (8-12%)"
  },
  {
    id: 30005,
    name: "Menthe poivrée",
    latinName: "Mentha piperita",
    family: "Lamiaceae",
    climaticAxis: "vent",
    justification: "Note très fraîche, mentholée - molécules principales: menthol (30-55%), menthone (14-32%)"
  },
  {
    id: 30006,
    name: "Eucalyptus globulus",
    latinName: "Eucalyptus globulus",
    family: "Myrtaceae",
    climaticAxis: "vent",
    justification: "Note fraîche, camphrée, aérienne - molécules principales: 1,8-cinéole (70-85%), α-pinène (10-22%)"
  },
  {
    id: 30007,
    name: "Romarin",
    latinName: "Rosmarinus officinalis",
    family: "Lamiaceae",
    climaticAxis: "vent_bois",
    justification: "Fraîcheur herbacée avec structure aromatique - molécules principales: 1,8-cinéole (38-55%), camphre (5-15%), α-pinène (9-14%)"
  },
  {
    id: 30008,
    name: "Vétiver",
    latinName: "Vetiveria zizanioides",
    family: "Poaceae",
    climaticAxis: "bois",
    justification: "Note terreuse, racinaire, très structurante - molécules principales: khusimol (10-30%), vétivérol, isovalencénol"
  },
  {
    id: 30009,
    name: "Ylang-Ylang",
    latinName: "Cananga odorata",
    family: "Annonaceae",
    climaticAxis: "disparition",
    justification: "Note florale exotique, trace sensuelle - molécules principales: linalol (19-30%), germacrène D (5-20%), acétate de benzyle (6-10%)"
  },
  {
    id: 30010,
    name: "Rose de Damas",
    latinName: "Rosa damascena",
    family: "Rosaceae",
    climaticAxis: "disparition",
    justification: "Note florale complexe, trace romantique - molécules principales: citronellol (40-60%), géraniol (13-20%), nérol (5-10%)"
  },
  {
    id: 30011,
    name: "Jasmin grandiflorum",
    latinName: "Jasminum grandiflorum",
    family: "Oleaceae",
    climaticAxis: "disparition",
    justification: "Note florale évanescente, trace narcotique - molécules principales: acétate de benzyle (20-30%), benzoate de benzyle (10-20%), indole (1-5%)"
  },
  {
    id: 30012,
    name: "Patchouli",
    latinName: "Pogostemon cablin",
    family: "Lamiaceae",
    climaticAxis: "bois",
    justification: "Note terreuse, boisée, structurante - molécules principales: patchoulol (30-40%), α-bulnésène, α-guaiène"
  },
  {
    id: 30013,
    name: "Bois de Santal",
    latinName: "Santalum album",
    family: "Santalaceae",
    climaticAxis: "bois",
    justification: "Note boisée crémeuse, structurante - molécules principales: α-santalol (45-60%), β-santalol (20-25%)"
  },
  {
    id: 30014,
    name: "Encens / Oliban",
    latinName: "Boswellia carterii",
    family: "Burseraceae",
    climaticAxis: "bois_disparition",
    justification: "Structure résineuse avec trace mystique - molécules principales: α-pinène (25-35%), limonène (8-15%), acide boswellique"
  },
  {
    id: 30015,
    name: "Cèdre de l'Atlas",
    latinName: "Cedrus atlantica",
    family: "Pinaceae",
    climaticAxis: "bois",
    justification: "Note boisée sèche, structurante - molécules principales: himachalène (50-60%), atlantone (5-10%)"
  },
  {
    id: 30016,
    name: "Géranium rosat",
    latinName: "Pelargonium graveolens",
    family: "Geraniaceae",
    climaticAxis: "vent_bois",
    justification: "Fraîcheur florale avec structure verte - molécules principales: citronellol (25-40%), géraniol (15-20%), linalol (5-15%)"
  }
];

async function main() {
  console.log('Connexion à la base de données...');
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  console.log(`\nMise à jour de ${plantsData.length} plantes...\n`);
  
  let updated = 0;
  let errors = 0;
  
  for (const plant of plantsData) {
    try {
      await db.execute(sql`
        UPDATE plants 
        SET 
          family = ${plant.family},
          climatic_axis = ${plant.climaticAxis}
        WHERE id = ${plant.id}
      `);
      
      console.log(`✓ ${plant.name} (${plant.latinName})`);
      console.log(`  Famille: ${plant.family}`);
      console.log(`  Axe climatique: ${plant.climaticAxis}`);
      console.log(`  Justification: ${plant.justification}\n`);
      updated++;
    } catch (error) {
      console.error(`✗ Erreur pour ${plant.name}: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Plantes mises à jour: ${updated}`);
  console.log(`Erreurs: ${errors}`);
  
  // Vérification
  console.log('\n=== VÉRIFICATION ===');
  const results = await db.execute(sql`
    SELECT id, name, latin_name, family, climatic_axis 
    FROM plants 
    WHERE id >= 30000 
    ORDER BY name
  `);
  
  console.log('\nPlantes mises à jour:');
  console.table(results[0]);
  
  await connection.end();
}

main().catch(console.error);
