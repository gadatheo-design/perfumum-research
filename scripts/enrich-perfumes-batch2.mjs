/**
 * Batch 2 — 20 parfums emblématiques supplémentaires
 * Shalimar, Opium, Angel, Alien, Terre d'Hermès, Narciso Rodriguez For Her,
 * Poison, Fahrenheit, Drakkar Noir, Arpège, Joy, Mitsouko, Fracas,
 * Rive Gauche, Pleasures, Eternity, Kouros, Jicky, Vol de Nuit, Obsession
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Chercher les IDs des molécules clés ─────────────────────────────────────
const [rows] = await conn.execute(`
  SELECT id, name FROM molecules
  WHERE name IN (
    'Vanilline','Coumarine','Benzyl Benzoate','Linalool','Géraniol',
    'β-Caryophyllène','Limonène','Cinnamaldéhyde','Eugenol','Ionone',
    'α-Méthyl Ionone','Irone','Iso E Super','Dihydromyrcenol','Habanolide',
    'Ethylene Brassylate','Galaxolide','Cashmeran','Ambroxan','Hedione',
    'Hedione HC','Muscone','Civettone','Calone','Calone 1951',
    'Benzyl acetate','Linalyl Acetate','Géranyl Acetate','Santalol',
    'Vétivérol','Patchoulol','α-Pinène','Myrcène','Eucalyptol',
    'Menthol','Citronellol','Nérol','Farnesol','Nerolidol',
    'Dihydrojasmone','Cedryl Methyl Ether','Polysantol','Ebanol',
    'Méthyl Ionone','Exaltolide','Javanol'
  )
`);

const molMap = {};
for (const r of rows) {
  molMap[r.name] = r.id;
}
console.log(`✓ ${Object.keys(molMap).length} molécules trouvées`);

// ─── Données des 20 parfums ───────────────────────────────────────────────────
const perfumeLinks = [

  // ── SHALIMAR (Guerlain, 1925) ──────────────────────────────────────────────
  { mol: 'Vanilline', perfume: 'Shalimar', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1925, role: 'signature', conc: 'très élevée', desc: 'Vanilline en quantité exceptionnelle pour l\'époque, créant le fond vanillé-poudré-oriental iconique de Shalimar.' },
  { mol: 'Benzyl Benzoate', perfume: 'Shalimar', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1925, role: 'note_fond', conc: 'élevée', desc: 'Fixateur oriental classique, contribue à la longueur et à la chaleur baumée de Shalimar.' },
  { mol: 'Coumarine', perfume: 'Shalimar', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1925, role: 'note_fond', conc: 'présente', desc: 'Note fougère-tonka qui adoucit et poudre le fond vanillé.' },
  { mol: 'Linalool', perfume: 'Shalimar', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1925, role: 'note_coeur', conc: 'présent', desc: 'Contribue à la facette florale-bergamote du cœur.' },

  // ── OPIUM (YSL, 1977) ─────────────────────────────────────────────────────
  { mol: 'β-Caryophyllène', perfume: 'Opium', house: 'Yves Saint Laurent', perfumer: 'Jean-Louis Sieuzac', year: 1977, role: 'accord_principal', conc: 'élevée', desc: 'Épice chaude et boisée qui donne à Opium son caractère oriental intense et sa profondeur.' },
  { mol: 'Eugenol', perfume: 'Opium', house: 'Yves Saint Laurent', perfumer: 'Jean-Louis Sieuzac', year: 1977, role: 'note_coeur', conc: 'présent', desc: 'Note clou de girofle-épicée, typique des orientaux chauds des années 70.' },
  { mol: 'Cinnamaldéhyde', perfume: 'Opium', house: 'Yves Saint Laurent', perfumer: 'Jean-Louis Sieuzac', year: 1977, role: 'note_coeur', conc: 'présent', desc: 'Cannelle chaude qui renforce le caractère épicé-oriental.' },
  { mol: 'Vanilline', perfume: 'Opium', house: 'Yves Saint Laurent', perfumer: 'Jean-Louis Sieuzac', year: 1977, role: 'note_fond', conc: 'élevée', desc: 'Fond vanillé-ambré qui ancre la composition dans le registre oriental.' },

  // ── ANGEL (Mugler, 1992) ──────────────────────────────────────────────────
  { mol: 'Ethylene Brassylate', perfume: 'Angel', house: 'Mugler', perfumer: 'Olivier Cresp / Yves de Chirin', year: 1992, role: 'signature', conc: 'très élevée', desc: 'Musc macrocyclique propre-floral en quantité record, créant la signature "clean-sweet" d\'Angel.' },
  { mol: 'Vanilline', perfume: 'Angel', house: 'Mugler', perfumer: 'Olivier Cresp / Yves de Chirin', year: 1992, role: 'note_fond', conc: 'élevée', desc: 'Fond gourmand-vanillé qui, associé au musc macrocyclique, crée le registre "gourmand" inédit.' },
  { mol: 'Patchoulol', perfume: 'Angel', house: 'Mugler', perfumer: 'Olivier Cresp / Yves de Chirin', year: 1992, role: 'accord_principal', conc: 'élevée', desc: 'Patchouli intense qui ancre la composition et lui donne son côté terreux-sombre contrastant avec le sucré.' },

  // ── ALIEN (Mugler, 2005) ──────────────────────────────────────────────────
  { mol: 'Cashmeran', perfume: 'Alien', house: 'Mugler', perfumer: 'Dominique Ropion', year: 2005, role: 'signature', conc: 'très élevée', desc: 'Musc boisé-ambré-cachemire en quantité exceptionnelle, créant la signature minérale-solaire d\'Alien.' },
  { mol: 'Benzyl Benzoate', perfume: 'Alien', house: 'Mugler', perfumer: 'Dominique Ropion', year: 2005, role: 'note_fond', conc: 'présent', desc: 'Fixateur baumé qui renforce la longueur et la chaleur de la composition.' },

  // ── TERRE D'HERMÈS (Hermès, 2006) ─────────────────────────────────────────
  { mol: 'Iso E Super', perfume: "Terre d'Hermès", house: 'Hermès', perfumer: 'Jean-Claude Ellena', year: 2006, role: 'signature', conc: 'très élevée', desc: 'Molécule boisée-cèdre-ambrée utilisée en quantité record par Ellena, créant le fond minéral-boisé sec iconique.' },
  { mol: 'α-Pinène', perfume: "Terre d'Hermès", house: 'Hermès', perfumer: 'Jean-Claude Ellena', year: 2006, role: 'note_tete', conc: 'présent', desc: 'Note pin-résineuse qui ouvre la composition sur un accord forestier-minéral.' },
  { mol: 'Limonène', perfume: "Terre d'Hermès", house: 'Hermès', perfumer: 'Jean-Claude Ellena', year: 2006, role: 'note_tete', conc: 'présente', desc: 'Pamplemousse-citrus qui apporte la fraîcheur initiale avant que le boisé-minéral s\'installe.' },

  // ── NARCISO RODRIGUEZ FOR HER (2003) ─────────────────────────────────────
  { mol: 'Habanolide', perfume: 'Narciso Rodriguez For Her', house: 'Narciso Rodriguez', perfumer: 'Francis Kurkdjian / Christine Nagel', year: 2003, role: 'signature', conc: 'très élevée', desc: 'Musc macrocyclique doux-floral-poudré en quantité record, créant la signature "skin musk" de ce parfum iconique.' },
  { mol: 'Galaxolide', perfume: 'Narciso Rodriguez For Her', house: 'Narciso Rodriguez', perfumer: 'Francis Kurkdjian / Christine Nagel', year: 2003, role: 'note_fond', conc: 'présent', desc: 'Musc polycyclique propre qui renforce la base musquée-poudreuse.' },
  { mol: 'Benzyl Benzoate', perfume: 'Narciso Rodriguez For Her', house: 'Narciso Rodriguez', perfumer: 'Francis Kurkdjian / Christine Nagel', year: 2003, role: 'note_fond', conc: 'présent', desc: 'Fixateur baumé qui ancre les muscs et prolonge la sillage.' },

  // ── POISON (Dior, 1985) ───────────────────────────────────────────────────
  { mol: 'Ionone', perfume: 'Poison', house: 'Dior', perfumer: 'Edouard Fléchier', year: 1985, role: 'accord_principal', conc: 'élevée', desc: 'Violette-iris intense qui donne à Poison son caractère floral-lourd et envoûtant.' },
  { mol: 'Coumarine', perfume: 'Poison', house: 'Dior', perfumer: 'Edouard Fléchier', year: 1985, role: 'note_fond', conc: 'présente', desc: 'Note tonka-fougère qui adoucit et poudre le fond de cette composition très chargée.' },
  { mol: 'Cinnamaldéhyde', perfume: 'Poison', house: 'Dior', perfumer: 'Edouard Fléchier', year: 1985, role: 'note_coeur', conc: 'présent', desc: 'Cannelle épicée qui renforce le caractère opulent et oriental.' },

  // ── FAHRENHEIT (Dior, 1988) ───────────────────────────────────────────────
  { mol: 'Iso E Super', perfume: 'Fahrenheit', house: 'Dior', perfumer: 'Jean-Louis Sieuzac / Michel Almairac', year: 1988, role: 'accord_principal', conc: 'élevée', desc: 'Boisé-cèdre-ambré qui crée le fond sec et minéral caractéristique de Fahrenheit.' },
  { mol: 'Dihydromyrcenol', perfume: 'Fahrenheit', house: 'Dior', perfumer: 'Jean-Louis Sieuzac / Michel Almairac', year: 1988, role: 'note_tete', conc: 'présent', desc: 'Fraîcheur citronnée-boisée qui ouvre la composition avant que le boisé-essence s\'installe.' },

  // ── DRAKKAR NOIR (Guy Laroche, 1982) ─────────────────────────────────────
  { mol: 'Dihydromyrcenol', perfume: 'Drakkar Noir', house: 'Guy Laroche', perfumer: 'Pierre Wargnye', year: 1982, role: 'accord_principal', conc: 'très élevée', desc: 'Fraîcheur boisée-citronnée en quantité élevée, créant le caractère "fougère aromatique" masculin de Drakkar Noir.' },
  { mol: 'Coumarine', perfume: 'Drakkar Noir', house: 'Guy Laroche', perfumer: 'Pierre Wargnye', year: 1982, role: 'note_fond', conc: 'présente', desc: 'Note fougère-tonka classique du registre masculin des années 80.' },
  { mol: 'Linalool', perfume: 'Drakkar Noir', house: 'Guy Laroche', perfumer: 'Pierre Wargnye', year: 1982, role: 'note_coeur', conc: 'présent', desc: 'Lavande-floral qui renforce le caractère fougère aromatique.' },

  // ── JOY (Jean Patou, 1930) ────────────────────────────────────────────────
  { mol: 'Géraniol', perfume: 'Joy', house: 'Jean Patou', perfumer: 'Henri Alméras', year: 1930, role: 'accord_principal', conc: 'élevée', desc: 'Rose-géranium en quantité exceptionnelle, issu des absolues de rose Grasse et de jasmin. Joy utilise 10 600 fleurs de jasmin et 28 douzaines de roses pour 30ml.' },
  { mol: 'Linalool', perfume: 'Joy', house: 'Jean Patou', perfumer: 'Henri Alméras', year: 1930, role: 'note_coeur', conc: 'présent', desc: 'Composant naturel du jasmin et de la rose, contribue à la facette florale-douce.' },
  { mol: 'Benzyl acetate', perfume: 'Joy', house: 'Jean Patou', perfumer: 'Henri Alméras', year: 1930, role: 'note_coeur', conc: 'présent', desc: 'Jasmin-fruité naturel présent via l\'absolue de jasmin Grasse.' },

  // ── MITSOUKO (Guerlain, 1919) ─────────────────────────────────────────────
  { mol: 'α-Méthyl Ionone', perfume: 'Mitsouko', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1919, role: 'accord_principal', conc: 'élevée', desc: 'Iris-violet-poudré qui crée le cœur floral-fruité de Mitsouko, en synergie avec la pêche (lactone naturelle).' },
  { mol: 'Coumarine', perfume: 'Mitsouko', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1919, role: 'note_fond', conc: 'présente', desc: 'Note fougère-tonka qui adoucit et poudre le fond chypré-boisé.' },
  { mol: 'Patchoulol', perfume: 'Mitsouko', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1919, role: 'note_fond', conc: 'présent', desc: 'Patchouli qui ancre le fond chypré-boisé-terreux de cette composition emblématique.' },

  // ── JICKY (Guerlain, 1889) ────────────────────────────────────────────────
  { mol: 'Coumarine', perfume: 'Jicky', house: 'Guerlain', perfumer: 'Aimé Guerlain', year: 1889, role: 'signature', conc: 'élevée', desc: 'Premier usage massif de coumarine synthétique en parfumerie, révolutionnant la composition olfactive. Jicky est le premier grand parfum moderne.' },
  { mol: 'Vanilline', perfume: 'Jicky', house: 'Guerlain', perfumer: 'Aimé Guerlain', year: 1889, role: 'note_fond', conc: 'présente', desc: 'Vanilline synthétique utilisée pour la première fois en parfumerie commerciale, créant un fond doux-poudré.' },
  { mol: 'Linalool', perfume: 'Jicky', house: 'Guerlain', perfumer: 'Aimé Guerlain', year: 1889, role: 'note_coeur', conc: 'présent', desc: 'Lavande-floral qui ouvre la composition sur un accord herbacé-frais.' },

  // ── KOUROS (YSL, 1981) ────────────────────────────────────────────────────
  { mol: 'Coumarine', perfume: 'Kouros', house: 'Yves Saint Laurent', perfumer: 'Pierre Bourdon', year: 1981, role: 'accord_principal', conc: 'élevée', desc: 'Note fougère-tonka qui crée le cœur fougère aromatique de Kouros, parfum masculin radical.' },
  { mol: 'Eugenol', perfume: 'Kouros', house: 'Yves Saint Laurent', perfumer: 'Pierre Bourdon', year: 1981, role: 'note_coeur', conc: 'présent', desc: 'Note clou de girofle-épicée qui renforce le caractère animal et masculin.' },
  { mol: 'Civettone', perfume: 'Kouros', house: 'Yves Saint Laurent', perfumer: 'Pierre Bourdon', year: 1981, role: 'note_fond', conc: 'présente', desc: 'Note animale-musquée qui contribue au caractère controversé et animal de Kouros.' },

  // ── ARPÈGE (Lanvin, 1927) ─────────────────────────────────────────────────
  { mol: 'Ionone', perfume: 'Arpège', house: 'Lanvin', perfumer: 'André Fraysse / Paul Vacher', year: 1927, role: 'accord_principal', conc: 'élevée', desc: 'Violette-iris qui crée le cœur floral aldéhydé de ce classique féminin.' },
  { mol: 'Linalool', perfume: 'Arpège', house: 'Lanvin', perfumer: 'André Fraysse / Paul Vacher', year: 1927, role: 'note_coeur', conc: 'présent', desc: 'Composant floral naturel contribuant à l\'accord floral aldéhydé.' },

  // ── FRACAS (Robert Piguet, 1948) ──────────────────────────────────────────
  { mol: 'Linalool', perfume: 'Fracas', house: 'Robert Piguet', perfumer: 'Germaine Cellier', year: 1948, role: 'accord_principal', conc: 'très élevée', desc: 'Tubéreuse-linalool en quantité maximale, créant le caractère floral-blanc-écrasant de Fracas, parfum de tubéreuse absolu.' },
  { mol: 'Benzyl acetate', perfume: 'Fracas', house: 'Robert Piguet', perfumer: 'Germaine Cellier', year: 1948, role: 'note_coeur', conc: 'présent', desc: 'Jasmin-fruité qui renforce l\'accord floral blanc opulent.' },

  // ── RIVE GAUCHE (YSL, 1971) ───────────────────────────────────────────────
  { mol: 'Géraniol', perfume: 'Rive Gauche', house: 'Yves Saint Laurent', perfumer: 'Michel Hy / Jacques Polge', year: 1971, role: 'accord_principal', conc: 'élevée', desc: 'Rose-géranium qui crée le cœur floral-vert de ce classique féminin des années 70.' },
  { mol: 'Linalool', perfume: 'Rive Gauche', house: 'Yves Saint Laurent', perfumer: 'Michel Hy / Jacques Polge', year: 1971, role: 'note_coeur', conc: 'présent', desc: 'Lavande-floral qui renforce l\'accord floral-vert.' },

  // ── PLEASURES (Estée Lauder, 1995) ───────────────────────────────────────
  { mol: 'Linalool', perfume: 'Pleasures', house: 'Estée Lauder', perfumer: 'Annie Buzantian', year: 1995, role: 'accord_principal', conc: 'élevée', desc: 'Floral-frais qui crée l\'accord pétale-de-rose-lilas caractéristique de Pleasures.' },
  { mol: 'Géraniol', perfume: 'Pleasures', house: 'Estée Lauder', perfumer: 'Annie Buzantian', year: 1995, role: 'note_coeur', conc: 'présent', desc: 'Rose-géranium qui renforce l\'accord floral-vert printanier.' },

  // ── ETERNITY (Calvin Klein, 1988) ────────────────────────────────────────
  { mol: 'Linalool', perfume: 'Eternity', house: 'Calvin Klein', perfumer: 'Sophia Grojsman', year: 1988, role: 'accord_principal', conc: 'élevée', desc: 'Floral-frais qui crée le cœur floral-vert de ce classique des années 80.' },
  { mol: 'Géraniol', perfume: 'Eternity', house: 'Calvin Klein', perfumer: 'Sophia Grojsman', year: 1988, role: 'note_coeur', conc: 'présent', desc: 'Rose-géranium qui renforce l\'accord floral printanier.' },
  { mol: 'Galaxolide', perfume: 'Eternity', house: 'Calvin Klein', perfumer: 'Sophia Grojsman', year: 1988, role: 'note_fond', conc: 'présent', desc: 'Musc propre-floral qui ancre la composition dans un fond musqué-propre.' },

  // ── VOL DE NUIT (Guerlain, 1933) ─────────────────────────────────────────
  { mol: 'Coumarine', perfume: 'Vol de Nuit', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1933, role: 'accord_principal', conc: 'élevée', desc: 'Note fougère-tonka qui crée le fond chaud-poudré-boisé de ce classique Guerlain inspiré de l\'aviation.' },
  { mol: 'Vanilline', perfume: 'Vol de Nuit', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1933, role: 'note_fond', conc: 'présente', desc: 'Fond vanillé-ambré qui ancre la composition dans le registre oriental-poudré.' },
  { mol: 'Ionone', perfume: 'Vol de Nuit', house: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1933, role: 'note_coeur', conc: 'présente', desc: 'Violette-iris qui contribue au cœur floral-poudré.' },
];

// ─── Insérer les liaisons ─────────────────────────────────────────────────────
let inserted = 0;
let skipped = 0;
let notFound = [];

for (const link of perfumeLinks) {
  const molId = molMap[link.mol];
  if (!molId) {
    notFound.push(link.mol);
    continue;
  }

  // Vérifier si la liaison existe déjà
  const [existing] = await conn.execute(
    `SELECT id FROM molecule_perfumes WHERE molecule_id = ? AND perfume_name = ? AND perfume_house = ?`,
    [molId, link.perfume, link.house]
  );

  if (existing.length > 0) {
    skipped++;
    continue;
  }

  try {
    await conn.execute(
      `INSERT INTO molecule_perfumes (molecule_id, perfume_name, perfume_house, perfumer, year, role_in_perfume, concentration, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [molId, link.perfume, link.house, link.perfumer, link.year, link.role, link.conc, link.desc]
    );
    inserted++;
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') { skipped++; } else { throw e; }
  }
}

// ─── Résumé ───────────────────────────────────────────────────────────────────
const [countRows] = await conn.execute(`SELECT COUNT(*) AS total FROM molecule_perfumes`);
const [perfumeCount] = await conn.execute(`SELECT COUNT(DISTINCT perfume_name) AS total FROM molecule_perfumes`);
const [molCount] = await conn.execute(`SELECT COUNT(DISTINCT molecule_id) AS total FROM molecule_perfumes`);

console.log(`\n✅ Batch 2 Parfums terminé :`);
console.log(`   Liaisons insérées : ${inserted}`);
console.log(`   Déjà existantes   : ${skipped}`);
console.log(`   Molécules non trouvées : ${[...new Set(notFound)].join(', ') || 'aucune'}`);
console.log(`\n📊 État de molecule_perfumes :`);
console.log(`   Total liaisons : ${countRows[0].total}`);
console.log(`   Parfums distincts : ${perfumeCount[0].total}`);
console.log(`   Molécules couvertes : ${molCount[0].total}`);

await conn.end();
