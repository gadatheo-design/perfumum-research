/**
 * Renseigne les terpene_profile des 24 recettes cigarillos manquantes.
 * Les profils sont construits sur la base du concept, du cannabis_profile et du tobacco_profile de chaque recette.
 * Format JSON : { terpene: pourcentage_relatif (total = 100) }
 */

import mysql from 'mysql2/promise';

// Profils terpéniques par recette (ID → profil JSON)
const TERPENE_PROFILES = {
  // === Archives Vivantes v2.0 ===
  30001: { myrcene: 20, linalool: 25, geraniol: 15, limonene: 20, pinene: 10, caryophyllene: 10 }, // Fleur de Cerisier
  30002: { linalool: 20, geraniol: 20, limonene: 15, caryophyllene: 15, humulene: 10, terpinolene: 10, myrcene: 10 }, // Chypré Rosé
  30003: { pinene: 25, myrcene: 15, limonene: 15, linalool: 10, terpinolene: 15, caryophyllene: 10, ocimene: 10 }, // Fougère de Verger
  30004: { limonene: 30, myrcene: 20, linalool: 15, terpinolene: 10, pinene: 10, caryophyllene: 15 }, // Ambre Fruité
  30005: { linalool: 20, limonene: 25, geraniol: 15, myrcene: 15, caryophyllene: 15, terpinolene: 10 }, // Thé à la Cerise
  30006: { myrcene: 30, caryophyllene: 25, humulene: 20, limonene: 10, pinene: 10, linalool: 5 }, // Cœur de Hasch
  30007: { caryophyllene: 25, humulene: 15, myrcene: 20, linalool: 15, limonene: 10, terpinolene: 15 }, // Cuir de Fès
  30008: { caryophyllene: 20, humulene: 15, myrcene: 15, pinene: 20, limonene: 10, linalool: 10, terpinolene: 10 }, // Encens d'Afghanistan
  30009: { caryophyllene: 25, humulene: 20, myrcene: 20, linalool: 10, limonene: 10, terpinolene: 15 }, // Chypré Sombre
  30010: { myrcene: 25, caryophyllene: 20, humulene: 15, linalool: 15, limonene: 10, terpinolene: 15 }, // Patchouli Impérial
  30011: { limonene: 35, pinene: 20, terpinolene: 15, myrcene: 15, caryophyllene: 10, linalool: 5 }, // Zeste Matinal
  30012: { pinene: 25, limonene: 20, terpinolene: 20, myrcene: 15, caryophyllene: 10, linalool: 10 }, // Fougère Électrique
  30013: { limonene: 30, myrcene: 15, linalool: 20, terpinolene: 10, pinene: 15, caryophyllene: 10 }, // Mojito Cubain
  30014: { limonene: 25, pinene: 20, terpinolene: 20, myrcene: 15, linalool: 10, caryophyllene: 10 }, // Chypré Vert Acide
  30015: { caryophyllene: 20, limonene: 25, terpinolene: 15, myrcene: 15, linalool: 15, pinene: 10 }, // Gingembre Tonique

  // === Haute Parfumerie Fumée ===
  30016: { caryophyllene: 20, humulene: 15, myrcene: 15, pinene: 25, limonene: 10, linalool: 15 }, // Palo Santo Andin
  30017: { myrcene: 25, caryophyllene: 20, humulene: 15, limonene: 10, terpinolene: 15, linalool: 15 }, // Vétiver Double Origine
  30018: { linalool: 30, geraniol: 20, limonene: 15, myrcene: 15, caryophyllene: 10, terpinolene: 10 }, // Jardin de Plumeria
  30019: { linalool: 25, geraniol: 20, limonene: 20, myrcene: 15, terpinolene: 10, caryophyllene: 10 }, // Neroli de Krumovgrad
  30020: { caryophyllene: 25, humulene: 20, myrcene: 20, linalool: 15, limonene: 10, terpinolene: 10 }, // Spikenard Himalayen
  30021: { caryophyllene: 30, humulene: 20, myrcene: 20, linalool: 10, limonene: 10, terpinolene: 10 }, // Oud & Résine
  30022: { caryophyllene: 25, humulene: 20, myrcene: 15, pinene: 15, limonene: 10, linalool: 15 }, // Encens Noir d'Oman
  30023: { limonene: 35, pinene: 20, terpinolene: 15, myrcene: 15, linalool: 10, caryophyllene: 5 }, // Miyazaki Agrumes
  30024: { myrcene: 20, caryophyllene: 15, humulene: 10, limonene: 15, linalool: 15, terpinolene: 15, pinene: 10 }, // Petrichor Indien
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let updated = 0;
  
  for (const [id, profile] of Object.entries(TERPENE_PROFILES)) {
    const [result] = await conn.execute(
      'UPDATE cigarillo_recipes SET terpene_profile = ? WHERE id = ? AND terpene_profile IS NULL',
      [JSON.stringify(profile), parseInt(id)]
    );
    if (result.affectedRows > 0) {
      updated++;
      console.log(`Recette ${id} mise à jour`);
    }
  }
  
  const [remaining] = await conn.execute('SELECT COUNT(*) as n FROM cigarillo_recipes WHERE terpene_profile IS NULL');
  console.log(`\nRecettes sans terpene_profile restantes: ${remaining[0].n}`);
  console.log(`Recettes mises à jour: ${updated}`);
  
  await conn.end();
}

main().catch(console.error);
