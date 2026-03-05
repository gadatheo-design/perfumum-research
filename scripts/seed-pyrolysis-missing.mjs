/**
 * Script d'enrichissement des transformations pyrolyse
 * Ajoute les transformations manquantes pour :
 * - Latakia (bois de laurier, phénols du chêne)
 * - Perique (fermentation anaérobie + pyrolyse)
 * - Virginia Gold (sucres, acides aminés spécifiques)
 * - Cannabis (CBG, CBDA, terpènes spécifiques)
 * - Tabacs orientaux (Samsoun, Basma)
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const newTransformations = [
  // ============================================================
  // LATAKIA — Fumage au bois de laurier et de chêne
  // Sources : Rodgman & Perfetti (2013), Schmeltz & Hoffmann (1977)
  // ============================================================
  {
    source_molecule: "Gaïacol (méthoxyphénol)",
    product_molecule: "Phénol",
    temperature_range: "300-450°C",
    mechanism: "Déméthylation thermique",
    toxicity_level: "moderate",
    notes: "Transformation caractéristique du fumage Latakia. Le gaïacol issu de la lignine du bois de laurier se déméthyle en phénol lors de la combustion. Contribue aux notes fumées médicinales."
  },
  {
    source_molecule: "Gaïacol (méthoxyphénol)",
    product_molecule: "Crésol",
    temperature_range: "350-500°C",
    mechanism: "Isomérisation et méthylation",
    toxicity_level: "moderate",
    notes: "Formation de crésols (o-, m-, p-) lors de la pyrolyse du gaïacol. Notes phénoliques complexes caractéristiques du Latakia."
  },
  {
    source_molecule: "Eugénol (bois de laurier)",
    product_molecule: "Gaïacol",
    temperature_range: "280-400°C",
    mechanism: "Coupure de la chaîne allylique",
    toxicity_level: "low",
    notes: "L'eugénol, abondant dans le bois de laurier utilisé pour le fumage Latakia, se transforme en gaïacol par pyrolyse. Signature olfactive clou de girofle → fumée médicinale."
  },
  {
    source_molecule: "Eugénol (bois de laurier)",
    product_molecule: "4-Vinylgaïacol",
    temperature_range: "200-350°C",
    mechanism: "Décarboxylation",
    toxicity_level: "low",
    notes: "Formation de 4-vinylgaïacol, composé aux notes épicées-fumées. Contribue à la complexité aromatique du Latakia."
  },
  {
    source_molecule: "Syringol (lignine de chêne)",
    product_molecule: "Gaïacol",
    temperature_range: "350-500°C",
    mechanism: "Déméthylation thermique",
    toxicity_level: "low",
    notes: "Le syringol, issu de la lignine du bois de chêne utilisé pour le fumage Latakia, se transforme en gaïacol. Contribue aux notes fumées boisées profondes."
  },
  {
    source_molecule: "Syringol (lignine de chêne)",
    product_molecule: "Phénol",
    temperature_range: "400-600°C",
    mechanism: "Pyrolyse complète",
    toxicity_level: "moderate",
    notes: "À haute température, le syringol se dégrade complètement en phénol. Caractéristique de la combustion intense du Latakia."
  },
  {
    source_molecule: "Acide laurique (feuilles de laurier)",
    product_molecule: "Undécane",
    temperature_range: "300-450°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "low",
    notes: "L'acide laurique des feuilles de Laurus nobilis se décarboxyle en undécane lors du fumage. Contribue aux notes cireuses-grasses du Latakia."
  },
  {
    source_molecule: "1,8-Cinéole (eucalyptol) [laurier]",
    product_molecule: "Camphre",
    temperature_range: "250-400°C",
    mechanism: "Réarrangement thermique",
    toxicity_level: "low",
    notes: "L'eucalyptol présent dans les feuilles de laurier se réarrange en camphre lors du fumage Latakia. Contribue aux notes camphrées-médicinales caractéristiques."
  },

  // ============================================================
  // PERIQUE — Fermentation anaérobie + pyrolyse
  // Sources : Leffingwell (2001), Tobacco Science (1965-2010)
  // ============================================================
  {
    source_molecule: "Acide butyrique (fermentation Perique)",
    product_molecule: "Butanal",
    temperature_range: "200-350°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "low",
    notes: "L'acide butyrique produit lors de la fermentation anaérobie du Perique se décarboxyle en butanal lors de la combustion. Contribue aux notes fruitées-fermentées caractéristiques."
  },
  {
    source_molecule: "Acide butyrique (fermentation Perique)",
    product_molecule: "Acide acétique",
    temperature_range: "150-300°C",
    mechanism: "Oxydation partielle",
    toxicity_level: "low",
    notes: "Formation d'acide acétique par oxydation partielle de l'acide butyrique. Notes vineuses caractéristiques du Perique."
  },
  {
    source_molecule: "Acide propionique (fermentation Perique)",
    product_molecule: "Propanal",
    temperature_range: "200-350°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "low",
    notes: "L'acide propionique de la fermentation Perique se décarboxyle en propanal. Contribue aux notes fruitées légères."
  },
  {
    source_molecule: "Acide valérique (fermentation Perique)",
    product_molecule: "Pentanal",
    temperature_range: "200-380°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "low",
    notes: "L'acide valérique, produit de la fermentation anaérobie du Perique, génère du pentanal lors de la combustion. Notes fruitées-grasses complexes."
  },
  {
    source_molecule: "Acide isovalérique (fermentation Perique)",
    product_molecule: "3-Méthylbutanal",
    temperature_range: "200-380°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "low",
    notes: "Formation de 3-méthylbutanal (notes maltées-chocolatées) par décarboxylation de l'acide isovalérique. Signature aromatique distinctive du Perique."
  },
  {
    source_molecule: "Proline (acide aminé Perique)",
    product_molecule: "Pyrrole",
    temperature_range: "250-400°C",
    mechanism: "Décarboxylation et déshydratation",
    toxicity_level: "low",
    notes: "La proline, enrichie par la fermentation Perique, génère du pyrrole lors de la combustion. Notes grillées-noisette caractéristiques."
  },
  {
    source_molecule: "Proline (acide aminé Perique)",
    product_molecule: "2-Acétylpyrrole",
    temperature_range: "280-420°C",
    mechanism: "Réaction de Maillard",
    toxicity_level: "low",
    notes: "Formation de 2-acétylpyrrole par réaction de Maillard entre la proline et les sucres réducteurs. Notes grillées-caramel très caractéristiques du Perique."
  },
  {
    source_molecule: "Acide lactique (fermentation Perique)",
    product_molecule: "Acétaldéhyde",
    temperature_range: "180-300°C",
    mechanism: "Décarboxylation et déhydratation",
    toxicity_level: "moderate",
    notes: "L'acide lactique produit lors de la fermentation Perique génère de l'acétaldéhyde lors de la combustion. Contribue à la légère acidité aromatique."
  },

  // ============================================================
  // VIRGINIA GOLD — Sucres et acides aminés spécifiques
  // Sources : Tobacco Chemistry (Wynder & Hoffmann, 1967)
  // ============================================================
  {
    source_molecule: "Amidon (Virginia Gold)",
    product_molecule: "Lévoglucosane",
    temperature_range: "250-400°C",
    mechanism: "Pyrolyse de polysaccharides",
    toxicity_level: "low",
    notes: "L'amidon des feuilles Virginia Gold se transforme en lévoglucosane lors de la pyrolyse. Précurseur de nombreux composés aromatiques sucrés."
  },
  {
    source_molecule: "Amidon (Virginia Gold)",
    product_molecule: "Furfural",
    temperature_range: "200-400°C",
    mechanism: "Déshydratation thermique",
    toxicity_level: "moderate",
    notes: "Formation de furfural (notes amandes-caramel) par déshydratation de l'amidon. Caractéristique de la douceur naturelle du Virginia Gold."
  },
  {
    source_molecule: "Asparagine (Virginia Gold)",
    product_molecule: "Acrylamide",
    temperature_range: "120-200°C",
    mechanism: "Réaction de Maillard",
    toxicity_level: "high",
    notes: "L'asparagine, abondante dans le Virginia Gold, réagit avec les sucres réducteurs pour former de l'acrylamide. Composé potentiellement cancérigène."
  },
  {
    source_molecule: "Asparagine (Virginia Gold)",
    product_molecule: "Pyrazines",
    temperature_range: "150-300°C",
    mechanism: "Réaction de Maillard",
    toxicity_level: "low",
    notes: "Formation de pyrazines (notes grillées, noisette, chocolat) par réaction de l'asparagine avec les sucres. Contribue à la richesse aromatique du Virginia Gold."
  },
  {
    source_molecule: "Glutamine (Virginia Gold)",
    product_molecule: "Pyroglutamate",
    temperature_range: "150-250°C",
    mechanism: "Cyclisation intramoléculaire",
    toxicity_level: "low",
    notes: "La glutamine se cyclise en pyroglutamate lors de la combustion. Contribue aux notes sucrées-légèrement amères du Virginia Gold."
  },
  {
    source_molecule: "Acide citrique (Virginia Gold)",
    product_molecule: "Acide aconitique",
    temperature_range: "175-300°C",
    mechanism: "Déshydratation thermique",
    toxicity_level: "low",
    notes: "L'acide citrique, présent en quantité dans le Virginia Gold, se déshydrate en acide aconitique. Contribue à l'acidité aromatique caractéristique."
  },
  {
    source_molecule: "Acide citrique (Virginia Gold)",
    product_molecule: "Acétone",
    temperature_range: "200-400°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "moderate",
    notes: "Formation d'acétone par décarboxylation de l'acide citrique. Notes légèrement solvantées dans la fumée du Virginia Gold."
  },

  // ============================================================
  // SAMSOUN / TABACS ORIENTAUX — Terpènes et alcaloïdes
  // ============================================================
  {
    source_molecule: "Nornicotine (tabacs orientaux)",
    product_molecule: "Myosmine",
    temperature_range: "200-350°C",
    mechanism: "Oxydation thermique",
    toxicity_level: "high",
    notes: "La nornicotine, abondante dans les tabacs orientaux comme le Samsoun, s'oxyde en myosmine lors de la combustion. Composé potentiellement mutagène."
  },
  {
    source_molecule: "Nornicotine (tabacs orientaux)",
    product_molecule: "N-Nitrosonornicotine (NNN)",
    temperature_range: "150-300°C",
    mechanism: "Nitrosation thermique",
    toxicity_level: "high",
    notes: "Formation de NNN, nitrosamine spécifique du tabac (TSNA) hautement cancérigène. Particulièrement élevée dans les tabacs orientaux."
  },
  {
    source_molecule: "Phénylpropanoïdes (tabacs orientaux)",
    product_molecule: "Cinnamaldéhyde",
    temperature_range: "200-350°C",
    mechanism: "Oxydation et décarboxylation",
    toxicity_level: "low",
    notes: "Les phénylpropanoïdes des tabacs orientaux génèrent du cinnamaldéhyde lors de la combustion. Notes épicées-cannelle caractéristiques des mélanges orientaux."
  },
  {
    source_molecule: "Phénylpropanoïdes (tabacs orientaux)",
    product_molecule: "Styrène",
    temperature_range: "300-500°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "moderate",
    notes: "Formation de styrène par décarboxylation des phénylpropanoïdes. Contribue aux notes balsamiques des tabacs orientaux."
  },

  // ============================================================
  // CANNABIS — Cannabinoïdes et terpènes spécifiques
  // Sources : Moir et al. (2008), Lanz et al. (2016)
  // ============================================================
  {
    source_molecule: "CBG (cannabigérol)",
    product_molecule: "CBD",
    temperature_range: "120-200°C",
    mechanism: "Cyclisation enzymatique/thermique",
    toxicity_level: "low",
    notes: "Le CBG, précurseur de tous les cannabinoïdes, peut se cycliser en CBD lors d'une pyrolyse douce. Transformation importante dans les variétés CBD-riches."
  },
  {
    source_molecule: "CBG (cannabigérol)",
    product_molecule: "THC",
    temperature_range: "150-250°C",
    mechanism: "Cyclisation thermique",
    toxicity_level: "low",
    notes: "Formation de THC par cyclisation du CBG. Voie alternative à la biosynthèse enzymatique, activée par la chaleur."
  },
  {
    source_molecule: "CBGA (acide cannabigérolique)",
    product_molecule: "CBG",
    temperature_range: "100-150°C",
    mechanism: "Décarboxylation thermique",
    toxicity_level: "low",
    notes: "Le CBGA se décarboxyle en CBG lors de la combustion ou du vaporisage. Première étape de la cascade de décarboxylation des cannabinoïdes."
  },
  {
    source_molecule: "CBD",
    product_molecule: "THC (Δ9-THC)",
    temperature_range: "200-400°C",
    mechanism: "Cyclisation et réarrangement",
    toxicity_level: "low",
    notes: "Le CBD peut se cycliser en Δ9-THC lors de la combustion à haute température. Transformation controversée mais documentée dans la littérature scientifique."
  },
  {
    source_molecule: "CBD",
    product_molecule: "Δ8-THC",
    temperature_range: "200-400°C",
    mechanism: "Isomérisation thermique",
    toxicity_level: "low",
    notes: "Formation de Δ8-THC (moins psychoactif que Δ9-THC) par isomérisation du CBD. Documenté dans les études de combustion du cannabis."
  },
  {
    source_molecule: "Terpinolène (cannabis)",
    product_molecule: "p-Cymène",
    temperature_range: "250-400°C",
    mechanism: "Aromatisation thermique",
    toxicity_level: "low",
    notes: "Le terpinolène, terpène dominant dans certaines variétés sativa, s'aromatise en p-cymène lors de la combustion. Notes épicées-thym caractéristiques."
  },
  {
    source_molecule: "Terpinolène (cannabis)",
    product_molecule: "Toluène",
    temperature_range: "350-500°C",
    mechanism: "Pyrolyse thermique",
    toxicity_level: "moderate",
    notes: "Formation de toluène par pyrolyse intense du terpinolène. Composé irritant pour les voies respiratoires."
  },
  {
    source_molecule: "Valencène (cannabis)",
    product_molecule: "Nootkatone",
    temperature_range: "200-350°C",
    mechanism: "Oxydation thermique",
    toxicity_level: "low",
    notes: "Le valencène s'oxyde en nootkatone lors de la combustion. Transformation aromatique intéressante : notes orangées → notes pamplemousse amères."
  },
  {
    source_molecule: "Guaïol (cannabis)",
    product_molecule: "Azulène",
    temperature_range: "300-450°C",
    mechanism: "Déshydratation et aromatisation",
    toxicity_level: "low",
    notes: "Le guaïol se transforme en azulène lors de la pyrolyse. L'azulène est responsable de la couleur bleue caractéristique de certaines huiles essentielles chauffées."
  },
  {
    source_molecule: "Phytol (chlorophylle cannabis)",
    product_molecule: "Phytane",
    temperature_range: "300-500°C",
    mechanism: "Réduction thermique",
    toxicity_level: "low",
    notes: "Le phytol, issu de la dégradation de la chlorophylle du cannabis, se réduit en phytane lors de la combustion. Composé marqueur de la combustion de matière végétale."
  },
  {
    source_molecule: "Phytol (chlorophylle cannabis)",
    product_molecule: "Pristane",
    temperature_range: "300-500°C",
    mechanism: "Décarboxylation et réduction",
    toxicity_level: "low",
    notes: "Formation de pristane (alcane ramifié) par décarboxylation et réduction du phytol. Marqueur chimique de la combustion du cannabis."
  },
];

console.log(`Inserting ${newTransformations.length} new pyrolysis transformations...`);

let inserted = 0;
let skipped = 0;

for (const t of newTransformations) {
  // Vérifier si la transformation existe déjà
  const [existing] = await conn.query(
    'SELECT id FROM pyrolysis_transformations WHERE source_molecule = ? AND product_molecule = ?',
    [t.source_molecule, t.product_molecule]
  );
  
  if (existing.length > 0) {
    skipped++;
    continue;
  }
  
  await conn.query(
    'INSERT INTO pyrolysis_transformations (source_molecule, product_molecule, temperature_range, mechanism, toxicity_level, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [t.source_molecule, t.product_molecule, t.temperature_range, t.mechanism, t.toxicity_level, t.notes]
  );
  inserted++;
}

console.log(`Done: ${inserted} inserted, ${skipped} skipped (already exist)`);

const [count] = await conn.query('SELECT COUNT(*) as total FROM pyrolysis_transformations');
console.log(`Total transformations: ${count[0].total}`);

await conn.end();
