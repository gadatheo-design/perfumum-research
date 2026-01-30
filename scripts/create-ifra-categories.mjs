/**
 * Script de création de la table ifra_categories et import des données
 */

import mysql from 'mysql2/promise';

async function createIfraCategories() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("📋 Création de la table ifra_categories...\n");
  
  // Créer la table si elle n'existe pas
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS ifra_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(10) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      name_fr VARCHAR(255),
      description TEXT,
      description_fr TEXT,
      examples TEXT,
      examples_fr TEXT,
      exposure_level ENUM('very_high', 'high', 'medium', 'low', 'very_low'),
      skin_contact ENUM('direct_prolonged', 'direct_brief', 'indirect', 'none'),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  console.log("✅ Table ifra_categories créée\n");
  
  // Données des catégories IFRA
  const categories = [
    {
      code: "1",
      name: "Lip Products",
      nameFr: "Produits pour les lèvres",
      description: "Products applied to the lips: lipstick, lip balm, lip gloss",
      descriptionFr: "Produits appliqués sur les lèvres : rouge à lèvres, baume à lèvres, gloss",
      examples: "Lipstick, lip balm, lip gloss, lip liner",
      examplesFr: "Rouge à lèvres, baume à lèvres, gloss, crayon à lèvres",
      exposureLevel: "very_high",
      skinContact: "direct_prolonged"
    },
    {
      code: "2",
      name: "Deodorant/Antiperspirant Products",
      nameFr: "Déodorants et antiperspirants",
      description: "Products applied to axillae (underarms)",
      descriptionFr: "Produits appliqués sur les aisselles",
      examples: "Deodorant spray, roll-on, stick, cream",
      examplesFr: "Déodorant spray, roll-on, stick, crème",
      exposureLevel: "very_high",
      skinContact: "direct_prolonged"
    },
    {
      code: "3",
      name: "Hydroalcoholic Products Applied to Recently Shaved Skin",
      nameFr: "Produits hydroalcooliques sur peau rasée",
      description: "Products applied to recently shaved skin or with sun exposure",
      descriptionFr: "Produits appliqués sur peau récemment rasée ou avec exposition solaire",
      examples: "Aftershave, face toner, eau de toilette applied to face",
      examplesFr: "Après-rasage, tonique visage, eau de toilette appliquée sur le visage",
      exposureLevel: "high",
      skinContact: "direct_prolonged"
    },
    {
      code: "4",
      name: "Fine Fragrance",
      nameFr: "Parfumerie fine",
      description: "Fine fragrances applied to the skin",
      descriptionFr: "Parfums fins appliqués sur la peau",
      examples: "Eau de parfum, eau de toilette, cologne, perfume",
      examplesFr: "Eau de parfum, eau de toilette, cologne, parfum",
      exposureLevel: "high",
      skinContact: "direct_prolonged"
    },
    {
      code: "5A",
      name: "Body Lotion Products",
      nameFr: "Produits corporels (application large)",
      description: "Products applied to large body areas",
      descriptionFr: "Produits appliqués sur de grandes surfaces corporelles",
      examples: "Body lotion, body cream, body oil, massage oil",
      examplesFr: "Lait corporel, crème corporelle, huile corporelle, huile de massage",
      exposureLevel: "high",
      skinContact: "direct_prolonged"
    },
    {
      code: "5B",
      name: "Face Care Products",
      nameFr: "Soins du visage",
      description: "Products applied to the face",
      descriptionFr: "Produits appliqués sur le visage",
      examples: "Face cream, face serum, face mask, eye cream",
      examplesFr: "Crème visage, sérum visage, masque visage, contour des yeux",
      exposureLevel: "high",
      skinContact: "direct_prolonged"
    },
    {
      code: "5C",
      name: "Hand Care Products",
      nameFr: "Soins des mains",
      description: "Products applied to the hands",
      descriptionFr: "Produits appliqués sur les mains",
      examples: "Hand cream, hand lotion, nail care",
      examplesFr: "Crème mains, lotion mains, soin des ongles",
      exposureLevel: "high",
      skinContact: "direct_prolonged"
    },
    {
      code: "5D",
      name: "Baby Products",
      nameFr: "Produits pour bébés",
      description: "Products for babies and children",
      descriptionFr: "Produits pour bébés et enfants",
      examples: "Baby lotion, baby oil, baby powder, diaper cream",
      examplesFr: "Lait bébé, huile bébé, talc bébé, crème change",
      exposureLevel: "very_high",
      skinContact: "direct_prolonged"
    },
    {
      code: "6",
      name: "Mouthwash, Toothpaste",
      nameFr: "Produits bucco-dentaires",
      description: "Products for oral hygiene",
      descriptionFr: "Produits d'hygiène bucco-dentaire",
      examples: "Mouthwash, toothpaste, breath freshener",
      examplesFr: "Bain de bouche, dentifrice, spray haleine",
      exposureLevel: "high",
      skinContact: "direct_brief"
    },
    {
      code: "7A",
      name: "Rinse-off Hair Products",
      nameFr: "Produits capillaires rinçables",
      description: "Hair products that are rinsed off",
      descriptionFr: "Produits capillaires qui sont rincés",
      examples: "Shampoo, conditioner, hair mask, hair dye",
      examplesFr: "Shampooing, après-shampooing, masque capillaire, coloration",
      exposureLevel: "medium",
      skinContact: "direct_brief"
    },
    {
      code: "7B",
      name: "Leave-on Hair Products",
      nameFr: "Produits capillaires sans rinçage",
      description: "Hair products that remain on the hair",
      descriptionFr: "Produits capillaires qui restent sur les cheveux",
      examples: "Hair spray, hair gel, hair serum, leave-in conditioner",
      examplesFr: "Laque, gel, sérum capillaire, soin sans rinçage",
      exposureLevel: "medium",
      skinContact: "indirect"
    },
    {
      code: "8",
      name: "Intimate Products",
      nameFr: "Produits intimes",
      description: "Products for intimate hygiene",
      descriptionFr: "Produits d'hygiène intime",
      examples: "Intimate wash, feminine hygiene products",
      examplesFr: "Gel intime, produits d'hygiène féminine",
      exposureLevel: "high",
      skinContact: "direct_prolonged"
    },
    {
      code: "9",
      name: "Household Products with Skin Contact",
      nameFr: "Produits ménagers avec contact cutané",
      description: "Household products that may contact skin",
      descriptionFr: "Produits ménagers pouvant entrer en contact avec la peau",
      examples: "Dish soap, hand soap, laundry detergent",
      examplesFr: "Liquide vaisselle, savon mains, lessive",
      exposureLevel: "low",
      skinContact: "direct_brief"
    },
    {
      code: "10A",
      name: "Household Products without Skin Contact",
      nameFr: "Produits ménagers sans contact cutané",
      description: "Household products with no direct skin contact",
      descriptionFr: "Produits ménagers sans contact cutané direct",
      examples: "Floor cleaner, toilet cleaner, air freshener spray",
      examplesFr: "Nettoyant sol, nettoyant WC, désodorisant spray",
      exposureLevel: "low",
      skinContact: "indirect"
    },
    {
      code: "10B",
      name: "Candles, Incense, Diffusers",
      nameFr: "Bougies, encens, diffuseurs",
      description: "Products that release fragrance into the air",
      descriptionFr: "Produits qui diffusent le parfum dans l'air",
      examples: "Scented candles, incense, reed diffusers, electric diffusers",
      examplesFr: "Bougies parfumées, encens, diffuseurs à bâtonnets, diffuseurs électriques",
      exposureLevel: "low",
      skinContact: "none"
    },
    {
      code: "11A",
      name: "Pet Products",
      nameFr: "Produits pour animaux",
      description: "Products for pets",
      descriptionFr: "Produits pour animaux de compagnie",
      examples: "Pet shampoo, pet cologne, pet bedding spray",
      examplesFr: "Shampooing animal, parfum animal, spray litière",
      exposureLevel: "very_low",
      skinContact: "indirect"
    },
    {
      code: "11B",
      name: "Industrial Products",
      nameFr: "Produits industriels",
      description: "Industrial and professional products",
      descriptionFr: "Produits industriels et professionnels",
      examples: "Industrial cleaners, professional products",
      examplesFr: "Nettoyants industriels, produits professionnels",
      exposureLevel: "very_low",
      skinContact: "none"
    }
  ];
  
  console.log("📥 Import des catégories IFRA...\n");
  
  let imported = 0;
  for (const cat of categories) {
    try {
      const [existing] = await connection.execute(
        'SELECT id FROM ifra_categories WHERE code = ?',
        [cat.code]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  Catégorie existante: ${cat.code} - ${cat.nameFr}`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO ifra_categories (code, name, name_fr, description, description_fr, examples, examples_fr, exposure_level, skin_contact)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cat.code, cat.name, cat.nameFr, cat.description, cat.descriptionFr, cat.examples, cat.examplesFr, cat.exposureLevel, cat.skinContact]
      );
      
      console.log(`✅ Importé: ${cat.code} - ${cat.nameFr}`);
      imported++;
    } catch (error) {
      console.error(`❌ Erreur pour ${cat.code}:`, error.message);
    }
  }
  
  await connection.end();
  
  console.log("\n" + "=".repeat(60));
  console.log(`📊 Résumé: ${imported} catégories IFRA importées`);
  console.log("=".repeat(60));
}

createIfraCategories().catch(console.error);
