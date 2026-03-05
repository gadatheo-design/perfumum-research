/**
 * Complétion des composants cannabis/tabac des 24 recettes cigarillos
 * Table : cigarillo_recipes (id 30001-30024)
 * 
 * Champs à compléter :
 * - cannabis_component : variété cannabis choisie selon le profil terpénique
 * - tobacco_component : tabac de base cohérent avec le profil aromatique
 * - cannabis_percentage : % cannabis dans la recette
 * - tobacco_percentage : % tabac dans la recette
 * - cannabis_profile : description du profil cannabis
 * - tobacco_profile : description du profil tabac
 * 
 * Sources : profils terpéniques existants + cohérence olfactive
 */

import mysql from 'mysql2/promise';

// Mapping id → composants cannabis/tabac
const COMPONENTS = {
  // Archives Vivantes v2.0 — recettes florales/fruitées légères
  30001: {
    cannabis_component: 'Landrace Kerala',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Kerala landrace — profil floral/fruité avec géraniol et limonène dominants. Notes de fleur de cerisier et d\'agrumes frais.',
    tobacco_profile: 'Virginia Flue-Cured — tabac doux et sucré, notes de miel et de foin. Complément idéal pour les profils floraux délicats.'
  },
  30002: {
    cannabis_component: 'Landrace Lebanese',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 30.00,
    tobacco_percentage: 50.00,
    cannabis_profile: 'Lebanese landrace — profil chypré avec géraniol, humulène et caryophyllène. Notes de rose et de bois sec.',
    tobacco_profile: 'Virginia Flue-Cured — base sucrée et légère qui soutient le profil chypré sans l\'alourdir.'
  },
  30003: {
    cannabis_component: 'Landrace Thai Stick',
    tobacco_component: 'Virginia Gold',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Thai Stick — profil fougère avec limonène, myrcène et linalool. Notes vertes et fruitées de verger.',
    tobacco_profile: 'Virginia Gold — tabac doré aux notes de miel et de foin. Renforce les notes fruitées du verger.'
  },
  30004: {
    cannabis_component: 'Landrace Colombian Gold',
    tobacco_component: 'Burley 21',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Colombian Gold — profil ambré avec limonène, linalool et caryophyllène. Notes d\'agrumes et de résine douce.',
    tobacco_profile: 'Burley 21 — tabac corsé aux notes de noix et de caramel. Ancrage pour les profils ambrés complexes.'
  },
  30005: {
    cannabis_component: 'Landrace Kerala',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Kerala landrace — profil floral avec géraniol, limonène et linalool. Notes de thé et de fleur de cerisier.',
    tobacco_profile: 'Virginia Flue-Cured — légèreté sucrée qui complète les notes florales de thé et de cerisier.'
  },
  30006: {
    cannabis_component: 'Landrace Afghan',
    tobacco_component: 'Louisiana Perique',
    cannabis_percentage: 35.00,
    tobacco_percentage: 40.00,
    cannabis_profile: 'Afghan landrace — profil résineux avec caryophyllène, humulène et myrcène. Notes de hashish et de résine dense.',
    tobacco_profile: 'Louisiana Perique — tabac fermenté aux notes épicées et fruitées. Renforce la complexité résineuse du hashish.'
  },
  30007: {
    cannabis_component: 'Landrace Moroccan',
    tobacco_component: 'Latakia',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Moroccan landrace — profil cuir avec caryophyllène, humulène et linalool. Notes de cuir et de résine orientale.',
    tobacco_profile: 'Latakia — tabac fumé aux notes de cuir et d\'encens. Renforce le profil cuir marocain.'
  },
  30008: {
    cannabis_component: 'Landrace Afghan',
    tobacco_component: 'Latakia',
    cannabis_percentage: 35.00,
    tobacco_percentage: 40.00,
    cannabis_profile: 'Afghan landrace — profil encens avec caryophyllène, humulène et linalool. Notes de résine et d\'encens sacré.',
    tobacco_profile: 'Latakia — tabac fumé aux notes d\'encens et de bois. Synergie parfaite avec le profil afghan résineux.'
  },
  30009: {
    cannabis_component: 'Landrace Moroccan',
    tobacco_component: 'Latakia',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Moroccan landrace — profil chypré sombre avec caryophyllène, humulène et myrcène. Notes de résine et de bois sombre.',
    tobacco_profile: 'Latakia — tabac fumé qui renforce la dimension sombre et résineuse du chypré marocain.'
  },
  30010: {
    cannabis_component: 'Landrace Afghan',
    tobacco_component: 'Louisiana Perique',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Afghan landrace — profil patchouli avec caryophyllène, humulène et myrcène. Notes terreuses et résineuses.',
    tobacco_profile: 'Louisiana Perique — tabac fermenté aux notes épicées qui complète le patchouli terreux.'
  },
  30011: {
    cannabis_component: 'Landrace Thai Stick',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Thai Stick — profil agrume avec limonène dominant, myrcène et terpinolène. Notes de zeste et de fraîcheur matinale.',
    tobacco_profile: 'Virginia Flue-Cured — légèreté sucrée qui ne masque pas les notes d\'agrumes frais.'
  },
  30012: {
    cannabis_component: 'Landrace Thai Stick',
    tobacco_component: 'Virginia Gold',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Thai Stick — profil fougère électrique avec limonène, linalool et myrcène. Notes vertes et électrisantes.',
    tobacco_profile: 'Virginia Gold — base dorée et légère qui amplifie les notes fougères sans les écraser.'
  },
  30013: {
    cannabis_component: 'Landrace Colombian Gold',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Colombian Gold — profil mojito avec limonène, linalool et myrcène. Notes de menthe, citron vert et canne à sucre.',
    tobacco_profile: 'Virginia Flue-Cured — légèreté sucrée qui évoque le sucre de canne du mojito cubain.'
  },
  30014: {
    cannabis_component: 'Landrace Thai Stick',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Thai Stick — profil chypré vert avec limonène, linalool et myrcène. Notes vertes acides et fraîches.',
    tobacco_profile: 'Virginia Flue-Cured — base neutre et sucrée qui contraste avec l\'acidité du chypré vert.'
  },
  30015: {
    cannabis_component: 'Landrace Kerala',
    tobacco_component: 'Virginia Gold',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Kerala landrace — profil gingembre tonique avec caryophyllène, limonène et linalool. Notes épicées et vivifiantes.',
    tobacco_profile: 'Virginia Gold — base dorée et légèrement épicée qui renforce le gingembre tonique.'
  },
  30016: {
    cannabis_component: 'Landrace Peruvian',
    tobacco_component: 'Latakia',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Peruvian landrace — profil palo santo avec caryophyllène, humulène et linalool. Notes de bois sacré andin.',
    tobacco_profile: 'Latakia — tabac fumé qui renforce les notes de bois sacré et d\'encens du palo santo.'
  },
  30017: {
    cannabis_component: 'Landrace Afghan',
    tobacco_component: 'Louisiana Perique',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Afghan landrace — profil vétiver avec caryophyllène, humulène et myrcène. Notes terreuses et racinaires.',
    tobacco_profile: 'Louisiana Perique — tabac fermenté aux notes terreuses qui complète le vétiver double origine.'
  },
  30018: {
    cannabis_component: 'Landrace Kerala',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Kerala landrace — profil plumeria avec géraniol, limonène et linalool. Notes florales tropicales.',
    tobacco_profile: 'Virginia Flue-Cured — légèreté sucrée qui soutient les notes florales tropicales de plumeria.'
  },
  30019: {
    cannabis_component: 'Landrace Krumovgrad',
    tobacco_component: 'Tabac Krumovgrad',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Krumovgrad landrace — profil néroli avec géraniol, limonène et linalool. Notes florales et agrumées.',
    tobacco_profile: 'Tabac Krumovgrad — tabac oriental léger aux notes florales. Cohérence géographique avec le néroli de Krumovgrad.'
  },
  30020: {
    cannabis_component: 'Landrace Himalayan',
    tobacco_component: 'Latakia',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Himalayan landrace — profil spikenard avec caryophyllène, humulène et linalool. Notes terreuses et médicinales.',
    tobacco_profile: 'Latakia — tabac fumé qui renforce les notes médicinales et résineuses du spikenard himalayen.'
  },
  30021: {
    cannabis_component: 'Landrace Afghan',
    tobacco_component: 'Latakia',
    cannabis_percentage: 35.00,
    tobacco_percentage: 40.00,
    cannabis_profile: 'Afghan landrace — profil oud & résine avec caryophyllène, humulène et linalool. Notes de bois précieux et de résine.',
    tobacco_profile: 'Latakia — tabac fumé aux notes de bois et d\'encens. Synergie parfaite avec l\'oud et la résine.'
  },
  30022: {
    cannabis_component: 'Landrace Omani',
    tobacco_component: 'Latakia',
    cannabis_percentage: 30.00,
    tobacco_percentage: 45.00,
    cannabis_profile: 'Omani landrace — profil encens noir avec caryophyllène, humulène et linalool. Notes d\'encens sacré d\'Oman.',
    tobacco_profile: 'Latakia — tabac fumé aux notes d\'encens qui renforce l\'encens noir d\'Oman.'
  },
  30023: {
    cannabis_component: 'Landrace Japanese',
    tobacco_component: 'Virginia Flue-Cured',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Japanese landrace — profil agrumes Miyazaki avec limonène, géraniol et linalool. Notes de yuzu et d\'agrumes japonais.',
    tobacco_profile: 'Virginia Flue-Cured — légèreté sucrée qui soutient les notes d\'agrumes japonais délicats.'
  },
  30024: {
    cannabis_component: 'Landrace Kerala',
    tobacco_component: 'Tabac Krumovgrad',
    cannabis_percentage: 25.00,
    tobacco_percentage: 55.00,
    cannabis_profile: 'Kerala landrace — profil pétrichor indien avec géosmine, caryophyllène et myrcène. Notes de terre humide et de pluie.',
    tobacco_profile: 'Tabac Krumovgrad — tabac oriental aux notes terreuses qui renforce le pétrichor indien.'
  }
};

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    let updated = 0;
    
    for (const [id, comp] of Object.entries(COMPONENTS)) {
      const [result] = await conn.execute(
        `UPDATE cigarillo_recipes SET 
          cannabis_component = ?,
          tobacco_component = ?,
          cannabis_percentage = ?,
          tobacco_percentage = ?,
          cannabis_profile = ?,
          tobacco_profile = ?
        WHERE id = ?`,
        [
          comp.cannabis_component,
          comp.tobacco_component,
          comp.cannabis_percentage,
          comp.tobacco_percentage,
          comp.cannabis_profile,
          comp.tobacco_profile,
          id
        ]
      );
      if (result.affectedRows > 0) {
        console.log('✓ Cigarillo id=' + id + ' — ' + comp.cannabis_component + ' × ' + comp.tobacco_component);
        updated++;
      } else {
        console.log('⚠ Cigarillo id=' + id + ' non trouvé');
      }
    }
    
    console.log('\n✅ Total recettes complétées:', updated, '/', Object.keys(COMPONENTS).length);
    
    // Vérification finale
    const [verify] = await conn.execute('SELECT COUNT(*) as cnt FROM cigarillo_recipes WHERE cannabis_component IS NOT NULL AND tobacco_component IS NOT NULL');
    console.log('Recettes avec composants complets:', verify[0].cnt);
    
  } finally {
    await conn.end();
  }
}

run().catch(console.error);
