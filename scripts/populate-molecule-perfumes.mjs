/**
 * Peuplement de la table molecule_perfumes
 * Données documentées : parfums emblématiques et leurs molécules signatures
 * Sources : Luca Turin & Tania Sanchez "Perfumes: The Guide" (2008),
 *           Fragrantica, Osmothèque, Arctander (1969)
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Données : [molécule_name_like, parfum, maison, parfumeur, année, rôle, concentration, description]
const data = [
  // ─── HEDIONE ──────────────────────────────────────────────────────────────
  ['Hedione', 'Eau Sauvage', 'Dior', 'Edmond Roudnitska', 1966, 'signature',
   '~8%', 'Première utilisation massive de l\'Hedione en parfumerie. Roudnitska découvre son effet jasmin aqueux et lumineux, révolutionnant la parfumerie masculine. L\'Hedione représente environ 8% de la formule.'],
  ['Hedione', 'Fahrenheit', 'Dior', 'Jean-Louis Sieuzac / Dominique Ropion', 1988, 'note_coeur',
   'présent', 'Contribue à la facette florale-violette caractéristique de Fahrenheit, en synergie avec la violette et le vétiver.'],
  ['Hedione', 'Pleasures', 'Estée Lauder', 'Annie Buzantian', 1995, 'accord_principal',
   'élevée', 'Accord floral blanc lumineux centré sur l\'Hedione HC, caractéristique des floraux aqueux des années 90.'],
  ['Hedione', 'CK One', 'Calvin Klein', 'Alberto Morillas / Harry Fremont', 1994, 'note_coeur',
   'présent', 'Contribue à la transparence et à la légèreté florale de ce parfum unisexe iconique.'],

  // ─── CALONE ───────────────────────────────────────────────────────────────
  ['Calone', 'Cool Water', 'Davidoff', 'Pierre Bourdon', 1988, 'signature',
   '~0.5%', 'Calone utilisé à concentration innovante pour créer l\'accord marin révolutionnaire. Bourdon invente le genre "aquatique" avec cette molécule synthétique découverte en 1951 mais peu utilisée jusqu\'alors.'],
  ['Calone', 'Escape for Men', 'Calvin Klein', 'Carlos Benaïm / Harry Fremont', 1993, 'accord_principal',
   'élevée', 'Accord marin-aquatique dominant, typique de la vague aquatique des années 90 initiée par Cool Water.'],
  ['Calone', 'L\'Eau d\'Issey', 'Issey Miyake', 'Jacques Cavallier', 1992, 'note_tete',
   'présent', 'Note aquatique ozonique en tête, évoquant l\'eau de source et la fraîcheur marine.'],
  ['Calone', 'New West for Her', 'Aramis', 'Sophia Grojsman', 1990, 'accord_principal',
   'élevée', 'Un des premiers usages de Calone en parfumerie féminine, créant un accord marin-floral inédit.'],

  // ─── CASHMERAN ────────────────────────────────────────────────────────────
  ['Cashmeran', 'Obsession', 'Calvin Klein', 'Jean Guichard', 1985, 'note_fond',
   'présent', 'Contribue au fond ambré-boisé-musqué chaud et enveloppant d\'Obsession, en synergie avec le patchouli et la vanille.'],
  ['Cashmeran', 'Hypnôse', 'Lancôme', 'Olivier Polge', 2005, 'accord_principal',
   'élevée', 'Accord boisé-musqué-ambré doux, signature de la famille "cashmere woods" popularisée dans les années 2000.'],
  ['Cashmeran', 'Angel', 'Thierry Mugler', 'Olivier Cresp / Yves de Chirin', 1992, 'note_fond',
   'présent', 'Contribue au fond gourmand-boisé d\'Angel, en synergie avec le patchouli et la vanille.'],

  // ─── DIHYDROMYRCENOL ──────────────────────────────────────────────────────
  ['Dihydromyrcenol', 'Cool Water', 'Davidoff', 'Pierre Bourdon', 1988, 'accord_principal',
   'élevée', 'Associé à Calone pour créer l\'accord marin-citronné-boisé caractéristique. Dihydromyrcenol apporte la facette boisée-citronnée fraîche.'],
  ['Dihydromyrcenol', 'Drakkar Noir', 'Guy Laroche', 'Pierre Wargnye', 1982, 'accord_principal',
   'élevée', 'Accord lavande-boisé-fougère. Dihydromyrcenol est l\'un des composants clés de la facette boisée-métallique.'],
  ['Dihydromyrcenol', 'Polo Sport', 'Ralph Lauren', 'Carlos Benaïm', 1994, 'signature',
   'élevée', 'Accord aquatique-boisé-citronné. Dihydromyrcenol est central dans l\'effet "sport" frais et propre.'],

  // ─── LINALOOL ─────────────────────────────────────────────────────────────
  ['Linalool', 'Chanel N°5', 'Chanel', 'Ernest Beaux', 1921, 'note_coeur',
   '~10%', 'Composant naturel de l\'absolue de rose et de jasmin utilisées dans N°5. Contribue à la facette florale-poudreuse.'],
  ['Linalool', 'Joy', 'Jean Patou', 'Henri Alméras', 1930, 'note_coeur',
   'élevée', 'Composant majeur des absolues de rose et jasmin qui constituent le cœur de Joy.'],

  // ─── GALAXOLIDE ───────────────────────────────────────────────────────────
  ['Galaxolide', 'Pleasures', 'Estée Lauder', 'Annie Buzantian', 1995, 'note_fond',
   'présent', 'Musc synthétique polycyclique contribuant au sillage propre-floral de Pleasures.'],
  ['Galaxolide', 'CK One', 'Calvin Klein', 'Alberto Morillas / Harry Fremont', 1994, 'note_fond',
   'présent', 'Fond musqué propre-transparent, signature de la famille "clean musks" des années 90.'],

  // ─── AMBROXAN ─────────────────────────────────────────────────────────────
  ['Ambroxan', 'Molecule 02', 'Escentric Molecules', 'Geza Schoen', 2008, 'signature',
   '100%', 'Parfum minimaliste composé d\'Ambroxan pur. Geza Schoen explore la propriété de l\'Ambroxan à se fondre avec la peau de chaque individu différemment.'],
  ['Ambroxan', 'Sauvage', 'Dior', 'François Demachy', 2015, 'accord_principal',
   'élevée', 'Ambroxan est l\'un des composants principaux de Sauvage, contribuant à son fond ambré-boisé sec et sa projection exceptionnelle.'],
  ['Ambroxan', 'Bleu de Chanel', 'Chanel', 'Jacques Polge', 2010, 'note_fond',
   'présent', 'Contribue au fond boisé-ambré sec et à la longueur de Bleu de Chanel.'],

  // ─── ISO E SUPER ──────────────────────────────────────────────────────────
  ['Iso E Super', 'Fahrenheit', 'Dior', 'Jean-Louis Sieuzac / Dominique Ropion', 1988, 'accord_principal',
   'élevée', 'Accord boisé-cèdre-violet caractéristique. Iso E Super contribue à la facette boisée sèche et à l\'effet "peau" de Fahrenheit.'],
  ['Iso E Super', 'Molecule 01', 'Escentric Molecules', 'Geza Schoen', 2006, 'signature',
   '100%', 'Parfum minimaliste composé d\'Iso E Super pur. Exploite la propriété de cette molécule à interagir différemment avec chaque peau.'],
  ['Iso E Super', 'Terre d\'Hermès', 'Hermès', 'Jean-Claude Ellena', 2006, 'accord_principal',
   'élevée', 'Accord boisé-minéral-pamplemousse. Iso E Super est central dans la facette boisée sèche et terreuse.'],

  // ─── BETA-CARYOPHYLLENE ───────────────────────────────────────────────────
  ['β-Caryophyllène', 'Opium', 'Yves Saint Laurent', 'Jean-Louis Sieuzac', 1977, 'note_coeur',
   'présent', 'Composant naturel de l\'huile essentielle de clou de girofle et de poivre noir utilisés dans Opium. Contribue à la facette épicée-boisée.'],
  ['β-Caryophyllène', 'Shalimar', 'Guerlain', 'Jacques Guerlain', 1925, 'note_fond',
   'présent', 'Présent via les huiles essentielles de bois et épices. Contribue à la profondeur boisée-balsamique.'],

  // ─── LINALYL ACETATE ──────────────────────────────────────────────────────
  ['Bergamote Calabre (Linalyl Acetate)', 'Eau de Cologne Impériale', 'Guerlain', 'Pierre-François Pascal Guerlain', 1853, 'accord_principal',
   'élevée', 'La bergamote calabre, riche en linalyl acetate (30-40%), est le composant principal de cette eau de cologne historique.'],
  ['Bergamote Calabre (Linalyl Acetate)', 'Acqua di Gio', 'Giorgio Armani', 'Alberto Morillas', 1996, 'note_tete',
   'élevée', 'Note de tête bergamote-citrus fraîche, avec le linalyl acetate apportant la facette florale-fruitée caractéristique.'],

  // ─── BENZYL ACETATE ───────────────────────────────────────────────────────
  ['Benzyl acetate', 'Joy', 'Jean Patou', 'Henri Alméras', 1930, 'note_coeur',
   'présent', 'Composant naturel de l\'absolue de jasmin (15-25%) qui constitue le cœur de Joy. Contribue à la facette jasmin-fruité.'],
  ['Benzyl acetate', 'Chanel N°5', 'Chanel', 'Ernest Beaux', 1921, 'note_coeur',
   'présent', 'Présent via l\'absolue de jasmin Grasse. Contribue à la facette jasmin-fruité du cœur floral.'],

  // ─── METHYL IONONE ────────────────────────────────────────────────────────
  ['Méthyl Ionone', 'L\'Air du Temps', 'Nina Ricci', 'Francis Fabron', 1948, 'accord_principal',
   'élevée', 'Accord floral-violet-iris. La méthyl ionone est centrale dans la facette violette-iris de ce classique.'],
  ['Méthyl Ionone', 'Rive Gauche', 'Yves Saint Laurent', 'Michel Hy', 1971, 'note_coeur',
   'présent', 'Contribue à la facette florale-violet-aldéhydée caractéristique de Rive Gauche.'],
  ['α-Méthyl Ionone', 'Chanel N°5', 'Chanel', 'Ernest Beaux', 1921, 'note_coeur',
   'présent', 'Contribue à la facette iris-violet-poudreuse du cœur floral aldéhydé.'],

  // ─── IRONE ────────────────────────────────────────────────────────────────
  ['Irone', 'Iris Silver Mist', 'Serge Lutens', 'Christopher Sheldrake', 1994, 'signature',
   'élevée', 'Iris Silver Mist est l\'un des parfums les plus concentrés en irone (iris naturel). Sheldrake explore la facette racine d\'iris poudreuse-terreuse-métallique.'],
  ['Irone', 'Infusion d\'Iris', 'Prada', 'Daniela Andrier', 2007, 'accord_principal',
   'élevée', 'Accord iris-bois-musc. L\'irone apporte la facette iris naturelle poudreuse et légèrement terreuse.'],

  // ─── EUGENOL ──────────────────────────────────────────────────────────────
  ['Eugénol', 'Opium', 'Yves Saint Laurent', 'Jean-Louis Sieuzac', 1977, 'note_coeur',
   'présent', 'Présent via l\'huile essentielle de clou de girofle. Contribue à la facette épicée-carnation caractéristique d\'Opium.'],
  ['Eugénol', 'Shalimar', 'Guerlain', 'Jacques Guerlain', 1925, 'note_fond',
   'présent', 'Présent via les épices et le bois de rose. Contribue à la profondeur épicée-balsamique orientale.'],

  // ─── VANILLINE ────────────────────────────────────────────────────────────
  ['Vanilline', 'Shalimar', 'Guerlain', 'Jacques Guerlain', 1925, 'accord_principal',
   'élevée', 'La vanilline synthétique est centrale dans le fond oriental-vanillé de Shalimar, utilisée en quantité alors révolutionnaire.'],
  ['Vanilline', 'Angel', 'Thierry Mugler', 'Olivier Cresp / Yves de Chirin', 1992, 'note_fond',
   'élevée', 'Fond gourmand-vanillé-caramel. La vanilline contribue à la facette sucrée-gourmande d\'Angel.'],
  ['Vanilline', 'Chanel N°5', 'Chanel', 'Ernest Beaux', 1921, 'note_fond',
   'présent', 'Contribue au fond poudré-vanillé-musqué de N°5.'],
];

let inserted = 0;
let skipped = 0;
const notFound = [];

for (const [molLike, perfumeName, house, perfumer, year, role, conc, desc] of data) {
  // Trouver la molécule
  const [mols] = await conn.execute(
    'SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1',
    [`%${molLike}%`]
  );
  if (mols.length === 0) {
    notFound.push(molLike);
    continue;
  }
  const molId = mols[0].id;

  try {
    await conn.execute(
      `INSERT IGNORE INTO molecule_perfumes
        (molecule_id, perfume_name, perfume_house, perfumer, year, role_in_perfume, concentration, description)
       VALUES (?,?,?,?,?,?,?,?)`,
      [molId, perfumeName, house, perfumer, year, role, conc, desc]
    );
    inserted++;
    console.log(`✓ ${mols[0].name} → ${perfumeName} (${house}, ${year})`);
  } catch (e) {
    skipped++;
    console.log(`~ Skip: ${mols[0].name} → ${perfumeName}: ${e.message}`);
  }
}

const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecule_perfumes');
const [molsWithPerfumes] = await conn.execute('SELECT COUNT(DISTINCT molecule_id) as n FROM molecule_perfumes');

console.log('\n=== RÉSUMÉ ===');
console.log(`Liaisons créées : ${inserted} | Ignorées : ${skipped}`);
console.log(`Total molecule_perfumes : ${total[0].n}`);
console.log(`Molécules avec parfums emblématiques : ${molsWithPerfumes[0].n}`);
if (notFound.length > 0) console.log(`Non trouvées : ${notFound.join(', ')}`);

await conn.end();
