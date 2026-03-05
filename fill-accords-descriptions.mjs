/**
 * Renseigne les descriptions manquantes des accords.
 * Les accords avec olfactiveProfile ou notes ont déjà du contenu.
 * On génère les descriptions à partir des notes et du contexte.
 */

import mysql from 'mysql2/promise';

const ACCORD_DESCRIPTIONS = {
  // Accords Pétrichor (Bio-Mineralis)
  1: "Accord inaugural de la série Bio-Mineralis. Articule la minéralité osseuse — calcaire, phosphate — avec la fraîcheur pluviale de la géosmine. Évoque les ossements détrempés par la pluie, la mémoire géologique inscrite dans la matière.",
  3: "Quatrième accord de la série Bio-Mineralis. Intègre la dimension anthropologique du pétrichor : l'odeur de la terre humide telle qu'elle est perçue et mémorisée par l'humain. Mêle géosmine, 2-méthylisoborneol et traces de sueur minérale.",
  4: "Variation claire du pétrichor classique. Géosmine dominante sur fond de notes vertes et d'ozone. Évoque la première pluie sur sol calcaire après une longue sécheresse estivale.",
  5: "Variation sombre du pétrichor. Notes de terre noire, champignon (1-octen-3-ol) et humus. Évoque les sous-bois après l'orage, la décomposition fertile.",
  6: "Variation argileuse du pétrichor. Évoque la terre de potier humidifiée, l'argile gonflée d'eau. Texture plus dense et minérale que le pétrichor classique.",
  7: "Pétrichor des zones arides. Contraste maximal entre la sécheresse du sol désertique et l'irruption de l'humidité. Notes de pierre chaude, poussière et géosmine fugace.",
  
  // Accords Volcanique
  8: "Accord central de la gamme Volcanique. Capture la dimension sulfureuse et minérale des émissions volcaniques : soufre, basalte, cendre chaude. Évoque les fumerolles et les coulées de lave refroidies.",
  9: "Dimension vaporeuse du volcanique. Évoque les sources thermales et geysers : vapeur d'eau chargée de minéraux, soufre dilué, chaleur humide. Plus aérien et moins dense que l'accord Cendre Volcanique.",
  10: "Accord de cendre volcanique. Texture poudreuse et aérienne, évoquant les retombées de cendres après une éruption. Notes de bois calciné, minéral sec et poussière fine.",
  
  // Accords Fermentum / Tabac
  11: "Accord fermentaire principal, base du prototype C1 FERMENTUM. Capture la transformation du tabac par fermentation : notes de foin fermenté, miel, cuir et tabac brun. Dimension temporelle forte — évoque la patience et la maturation.",
  
  // Accords Clarus Verde
  13: "Accord vert principal de la gamme Clarus Verde. Dimension végétale pure : sève fraîche, feuilles froissées, chlorophylle. Évoque l'intérieur d'une tige coupée, la vie végétale dans sa forme la plus directe.",
  14: "Dimension résineuse claire, base du prototype C2 CLARUS VERDE. Résine fraîche de conifère, élemi, pin sylvestre. Transparence et légèreté caractéristiques des résines nordiques.",
  
  // Accords Lacta Solis
  18: "Accord lactonique principal, base du prototype C3 LACTA SOLIS. Lactones crémeuses et solaires : noix de coco, lait chaud, crème solaire. Évoque la peau chauffée par le soleil méditerranéen.",
  
  // Accords Terra Ambra
  17: "Dimension tellurique du sacré. Évoque la terre des lieux de culte, des temples et des espaces rituels : encens, terre battue, pierre ancienne. Accord à forte charge symbolique et mémorielle.",
  19: "Accord minéral solaire. Pierre méditerranéenne chauffée par le soleil : calcaire, garrigue, chaleur sèche. Évoque les ruines antiques et les paysages de pierre blanche sous le soleil d'été.",
  
  // Accords Mossi / Afrique
  20: "Accord capturant l'essence des terres rouges d'Afrique de l'Ouest. Latérite, argile ferrugineuse, poussière de latérite. Évoque les pistes en terre rouge du Burkina Faso et du Mali.",
  21: "Accord végétal tropical. Bois de karité, feuilles de néré, sève de baobab. Dimension botanique de la savane soudano-sahélienne.",
  
  // Accords Cannabis / Résine
  15: "Accord résineux cannabis. Capture les terpènes caractéristiques des variétés indica : myrcène dominant, caryophyllène, humulène. Évoque la résine fraîche, le kief et les notes terreuses-boisées.",
  16: "Accord terpénique cannabis sativa. Limonène et pinène dominants sur fond de terpinolène. Notes agrumées, résineuses et légèrement florales caractéristiques des variétés sativa.",
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let updated = 0;
  
  for (const [id, description] of Object.entries(ACCORD_DESCRIPTIONS)) {
    const [result] = await conn.execute(
      'UPDATE accords SET description = ? WHERE id = ? AND (description IS NULL OR description = "")',
      [description, parseInt(id)]
    );
    if (result.affectedRows > 0) {
      updated++;
      console.log(`Accord ${id} mis à jour`);
    }
  }
  
  // Vérification
  const [remaining] = await conn.execute('SELECT COUNT(*) as n FROM accords WHERE description IS NULL OR description = ""');
  console.log(`\nAccords sans description restants: ${remaining[0].n}`);
  console.log(`Accords mis à jour: ${updated}`);
  
  await conn.end();
}

main().catch(console.error);
