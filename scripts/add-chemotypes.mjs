/**
 * Script pour ajouter les chémotypes aux plantes aromatiques
 * Les chémotypes représentent les variations chimiques d'une même espèce
 * selon l'origine géographique, le terroir ou les conditions de culture
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Chémotypes des plantes aromatiques
const PLANT_CHEMOTYPES = [
  {
    name: "Niaouli",
    chemotypes: JSON.stringify([
      {
        name: "CT 1,8-cinéole",
        origin: "Nouvelle-Calédonie",
        mainMolecules: ["1,8-cinéole (50-65%)", "α-terpinéol (8-12%)", "limonène (5-10%)"],
        properties: "Expectorant puissant, antiviral, immunostimulant",
        usage: "Infections respiratoires, grippe, bronchite"
      },
      {
        name: "CT viridiflorol",
        origin: "Madagascar",
        mainMolecules: ["viridiflorol (15-25%)", "1,8-cinéole (40-50%)", "nérolidol (5-10%)"],
        properties: "Équilibrant hormonal, phlébotonique",
        usage: "Troubles circulatoires, déséquilibres hormonaux"
      },
      {
        name: "CT nérolidol",
        origin: "Australie",
        mainMolecules: ["nérolidol (20-30%)", "1,8-cinéole (35-45%)", "linalol (5-8%)"],
        properties: "Relaxant, anti-inflammatoire cutané",
        usage: "Soins cutanés, stress, anxiété"
      }
    ])
  },
  {
    name: "Myrte",
    chemotypes: JSON.stringify([
      {
        name: "CT cinéole (Myrte rouge)",
        origin: "Corse, Sardaigne",
        mainMolecules: ["1,8-cinéole (25-35%)", "α-pinène (20-30%)", "limonène (10-15%)"],
        properties: "Expectorant, antiseptique respiratoire",
        usage: "Bronchite, sinusite, toux grasse"
      },
      {
        name: "CT acétate de myrtényle (Myrte vert)",
        origin: "Maroc, Tunisie",
        mainMolecules: ["acétate de myrtényle (20-35%)", "1,8-cinéole (15-25%)", "limonène (8-12%)"],
        properties: "Sédatif léger, antispasmodique",
        usage: "Insomnie légère, toux sèche, anxiété"
      },
      {
        name: "CT linalol",
        origin: "Portugal",
        mainMolecules: ["linalol (15-25%)", "acétate de linalyle (10-15%)", "1,8-cinéole (10-20%)"],
        properties: "Calmant, anti-inflammatoire doux",
        usage: "Peaux sensibles, relaxation"
      }
    ])
  },
  {
    name: "Laurier noble",
    chemotypes: JSON.stringify([
      {
        name: "CT 1,8-cinéole",
        origin: "Turquie, Grèce",
        mainMolecules: ["1,8-cinéole (40-50%)", "linalol (8-12%)", "eugénol (2-5%)"],
        properties: "Mucolytique, antibactérien puissant",
        usage: "Infections ORL, douleurs articulaires"
      },
      {
        name: "CT linalol",
        origin: "Croatie, Slovénie",
        mainMolecules: ["linalol (15-25%)", "1,8-cinéole (30-40%)", "acétate de terpényle (5-10%)"],
        properties: "Antispasmodique, calmant nerveux",
        usage: "Stress, spasmes digestifs"
      },
      {
        name: "CT méthyleugénol",
        origin: "Maroc (rare)",
        mainMolecules: ["méthyleugénol (8-15%)", "1,8-cinéole (35-45%)", "eugénol (5-10%)"],
        properties: "Analgésique puissant (usage limité)",
        usage: "Douleurs intenses (précautions d'emploi)"
      }
    ])
  },
  {
    name: "Camphrier",
    chemotypes: JSON.stringify([
      {
        name: "CT camphre (Hon-Sho)",
        origin: "Japon, Taiwan",
        mainMolecules: ["camphre (40-60%)", "1,8-cinéole (10-20%)", "safrole (traces)"],
        properties: "Stimulant circulatoire, décongestionnant",
        usage: "Douleurs musculaires, fatigue, refroidissements"
      },
      {
        name: "CT cinéole (Ravintsara)",
        origin: "Madagascar",
        mainMolecules: ["1,8-cinéole (50-65%)", "sabinène (10-15%)", "α-terpinéol (5-10%)"],
        properties: "Antiviral majeur, immunostimulant",
        usage: "Grippe, herpès, fatigue immunitaire"
      },
      {
        name: "CT linalol (Ho Wood/Bois de Hô)",
        origin: "Chine",
        mainMolecules: ["linalol (85-97%)", "α-terpinéol (1-3%)", "géraniol (traces)"],
        properties: "Régénérant cutané, anti-infectieux doux",
        usage: "Soins anti-âge, infections cutanées, relaxation"
      },
      {
        name: "CT safrole (interdit)",
        origin: "Historique",
        mainMolecules: ["safrole (80-90%)"],
        properties: "Toxique, cancérigène - INTERDIT",
        usage: "Usage historique uniquement, interdit depuis 1960"
      }
    ])
  },
  {
    name: "Angélique",
    chemotypes: JSON.stringify([
      {
        name: "Racine",
        origin: "France (Niort), Allemagne",
        mainMolecules: ["α-phellandrène (15-25%)", "α-pinène (10-20%)", "limonène (5-10%)", "coumarines (furanocoumarines)"],
        properties: "Tonique digestif, anxiolytique, photosensibilisant",
        usage: "Troubles digestifs, anxiété, fatigue nerveuse"
      },
      {
        name: "Graines",
        origin: "Europe du Nord",
        mainMolecules: ["β-phellandrène (20-30%)", "α-pinène (15-20%)", "limonène (10-15%)"],
        properties: "Carminatif, digestif léger",
        usage: "Ballonnements, digestion lente"
      }
    ])
  },
  {
    name: "Anis vert",
    chemotypes: JSON.stringify([
      {
        name: "CT trans-anéthole",
        origin: "Espagne, Turquie, Égypte",
        mainMolecules: ["trans-anéthole (85-95%)", "estragole (1-3%)", "anisaldéhyde (1-2%)"],
        properties: "Carminatif, galactogène, antispasmodique",
        usage: "Coliques, ballonnements, allaitement"
      }
    ])
  },
  {
    name: "Curcuma",
    chemotypes: JSON.stringify([
      {
        name: "CT ar-turmérone",
        origin: "Inde (Kerala)",
        mainMolecules: ["ar-turmérone (25-40%)", "turmérone (15-25%)", "curlone (5-10%)"],
        properties: "Anti-inflammatoire puissant, hépatoprotecteur",
        usage: "Inflammations chroniques, protection hépatique"
      },
      {
        name: "CT turmérone",
        origin: "Inde (Tamil Nadu)",
        mainMolecules: ["turmérone (30-45%)", "ar-turmérone (15-25%)", "zingibérène (5-10%)"],
        properties: "Digestif, cholérétique",
        usage: "Troubles digestifs, insuffisance biliaire"
      }
    ])
  }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== AJOUT DES CHÉMOTYPES ===\n');
  
  let plantsUpdated = 0;
  
  for (const plantData of PLANT_CHEMOTYPES) {
    // Trouver la plante
    const [plants] = await connection.query(
      'SELECT id, chemotypes FROM plants WHERE name = ?',
      [plantData.name]
    );
    
    if (plants.length === 0) {
      console.log('⚠️ Plante non trouvée: ' + plantData.name);
      continue;
    }
    
    const plant = plants[0];
    
    // Vérifier si les chémotypes existent déjà
    if (plant.chemotypes && plant.chemotypes.length > 10) {
      console.log('- ' + plantData.name + ' a déjà des chémotypes');
      continue;
    }
    
    // Mettre à jour la plante
    await connection.query(
      'UPDATE plants SET chemotypes = ? WHERE id = ?',
      [plantData.chemotypes, plant.id]
    );
    
    const chemotypesCount = JSON.parse(plantData.chemotypes).length;
    console.log('✓ ' + plantData.name + ' - ' + chemotypesCount + ' chémotype(s) ajouté(s)');
    plantsUpdated++;
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log('Plantes mises à jour: ' + plantsUpdated);
  
  await connection.end();
}

main().catch(console.error);
