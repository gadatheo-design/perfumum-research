/**
 * Enrichissement molecule_perfumes v2
 * Terpènes majeurs, muscs macrocycliques, accords floraux industriels
 * Session 15 mars 2026
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Récupérer les IDs des molécules cibles ───────────────────────────────────
const [molRows] = await conn.execute(`
  SELECT id, name FROM molecules
  WHERE name IN (
    'Limonène','Menthol','Eucalyptol','Géraniol','Linalool',
    'Habanolide','Ethylene Brassylate','Exaltolide','Galaxolide',
    'Hedione HC','Dihydrojasmone','Calone','Cashmeran','Muscone',
    'Citronellol','Nérol','α-Ionone','β-Ionone','Coumarine',
    'Dihydromyrcenol','Iso E Super','Ambroxan','Santalol','Cédrène',
    'Benzaldéhyde','Anisaldéhyde','Salicylate de méthyle','Acétate de benzyle',
    'Acétate de linalyle','Acétate de géranyle','Ionone','Méthyl Ionone',
    'Irone','Polysantol','Ebanol','Cedryl Methyl Ether'
  )
`);

const molMap = {};
for (const r of molRows) molMap[r.name] = r.id;

console.log(`\n📦 Molécules trouvées : ${molRows.length}`);
console.log(Object.keys(molMap).join(', '));

// ─── Données : nouvelles liaisons parfums emblématiques ───────────────────────
const newLinks = [
  // LIMONÈNE
  { mol: 'Limonène', perfumeName: 'Eau de Cologne Impériale', perfumeHouse: 'Guerlain', perfumer: 'Pierre-François Pascal Guerlain', year: 1853, role: 'accord_principal', concentration: 'dominante', description: 'Le Limonène est la molécule centrale de la Cologne classique, apportant la fraîcheur agrumée caractéristique.' },
  { mol: 'Limonène', perfumeName: '4711 Eau de Cologne', perfumeHouse: 'Mäurer & Wirtz', perfumer: null, year: 1792, role: 'accord_principal', concentration: 'dominante', description: 'La Cologne de Cologne originelle, dont le Limonène d\'agrumes constitue la signature olfactive principale.' },
  { mol: 'Limonène', perfumeName: 'Acqua di Giò', perfumeHouse: 'Giorgio Armani', perfumer: 'Alberto Morillas', year: 1996, role: 'note_tete', concentration: 'élevée', description: 'Note de tête fraîche et marine, le Limonène apporte l\'éclat agrumé initial de ce fougère aquatique iconique.' },

  // MENTHOL
  { mol: 'Menthol', perfumeName: 'Cool Water', perfumeHouse: 'Davidoff', perfumer: 'Pierre Bourdon', year: 1988, role: 'accord_principal', concentration: 'élevée', description: 'Le Menthol contribue à l\'accord aquatique-frais révolutionnaire de Cool Water, fondateur du genre fougère aquatique.' },
  { mol: 'Menthol', perfumeName: 'Polo Sport', perfumeHouse: 'Ralph Lauren', perfumer: 'Carlos Benaïm', year: 1994, role: 'note_tete', concentration: 'présente', description: 'Note fraîche mentholée en tête, caractéristique des fougères aquatiques sportifs des années 90.' },
  { mol: 'Menthol', perfumeName: 'Fahrenheit', perfumeHouse: 'Dior', perfumer: 'Jean-Louis Sieuzac', year: 1988, role: 'ingredient_cle', concentration: 'faible', description: 'Trace mentholée qui contraste avec le fond pétrolier chaud et violet de Fahrenheit.' },

  // EUCALYPTOL (1,8-Cinéole)
  { mol: 'Eucalyptol', perfumeName: 'Polo Green', perfumeHouse: 'Ralph Lauren', perfumer: 'Carlos Benaïm', year: 1978, role: 'accord_principal', concentration: 'élevée', description: 'L\'Eucalyptol apporte la fraîcheur herbacée-camphrée caractéristique de ce fougère vert iconique.' },
  { mol: 'Eucalyptol', perfumeName: 'Drakkar Noir', perfumeHouse: 'Guy Laroche', perfumer: 'Pierre Wargnye', year: 1982, role: 'note_coeur', concentration: 'présente', description: 'Contribue à l\'accord lavande-fougère avec une touche camphrée dans ce classique masculin.' },

  // HABANOLIDE (musc macrocyclique)
  { mol: 'Habanolide', perfumeName: 'Narciso Rodriguez For Her', perfumeHouse: 'Narciso Rodriguez', perfumer: 'Francis Kurkdjian', year: 2003, role: 'signature', concentration: 'très élevée', description: 'Habanolide est la molécule signature de ce parfum, créant un accord musc nu, poudré et sensuel unique.' },
  { mol: 'Habanolide', perfumeName: 'L\'Eau d\'Issey', perfumeHouse: 'Issey Miyake', perfumer: 'Jacques Cavallier', year: 1992, role: 'note_fond', concentration: 'présente', description: 'Contribue au fond musc aquatique propre de ce parfum révolutionnaire.' },
  { mol: 'Habanolide', perfumeName: 'Angel', perfumeHouse: 'Mugler', perfumer: 'Olivier Cresp', year: 1992, role: 'note_fond', concentration: 'présente', description: 'Partie de l\'accord musc gourmand du fond d\'Angel.' },

  // ETHYLENE BRASSYLATE (musc macrocyclique)
  { mol: 'Ethylene Brassylate', perfumeName: 'Chanel N°5', perfumeHouse: 'Chanel', perfumer: 'Ernest Beaux', year: 1921, role: 'note_fond', concentration: 'présente', description: 'Contribue à la base musquée propre et florale de N°5, l\'un des parfums les plus vendus au monde.' },
  { mol: 'Ethylene Brassylate', perfumeName: 'White Linen', perfumeHouse: 'Estée Lauder', perfumer: 'Sophia Grojsman', year: 1978, role: 'accord_principal', concentration: 'élevée', description: 'L\'Ethylene Brassylate crée l\'accord "linge propre" caractéristique de ce parfum floral-aldéhydé.' },

  // EXALTOLIDE (musc macrocyclique)
  { mol: 'Exaltolide', perfumeName: 'Shalimar', perfumeHouse: 'Guerlain', perfumer: 'Jacques Guerlain', year: 1925, role: 'note_fond', concentration: 'présente', description: 'Exaltolide contribue à la base musquée-animale chaude de ce grand oriental classique.' },
  { mol: 'Exaltolide', perfumeName: 'Joy', perfumeHouse: 'Jean Patou', perfumer: 'Henri Almeras', year: 1930, role: 'note_fond', concentration: 'présente', description: 'Fond musqué délicat qui soutient l\'accord rose-jasmin de "le parfum le plus cher du monde".' },

  // HEDIONE HC
  { mol: 'Hedione HC', perfumeName: 'Eau Sauvage', perfumeHouse: 'Dior', perfumer: 'Edmond Roudnitska', year: 1966, role: 'signature', concentration: 'très élevée', description: 'Hedione HC (version haute concentration) est la molécule révolutionnaire d\'Eau Sauvage, créant un accord jasmin-citrus aérien sans précédent.' },
  { mol: 'Hedione HC', perfumeName: 'Fahrenheit', perfumeHouse: 'Dior', perfumer: 'Jean-Louis Sieuzac', year: 1988, role: 'note_coeur', concentration: 'présente', description: 'Contribue à la facette florale-jasmin qui contraste avec le fond pétrolier de Fahrenheit.' },

  // CALONE (accord marin)
  { mol: 'Calone', perfumeName: 'Cool Water', perfumeHouse: 'Davidoff', perfumer: 'Pierre Bourdon', year: 1988, role: 'accord_principal', concentration: 'élevée', description: 'Calone est la molécule fondatrice de l\'accord aquatique de Cool Water, révolutionnant la parfumerie masculine.' },
  { mol: 'Calone', perfumeName: 'L\'Eau d\'Issey', perfumeHouse: 'Issey Miyake', perfumer: 'Jacques Cavallier', year: 1992, role: 'accord_principal', concentration: 'élevée', description: 'Calone crée l\'accord "eau pure" caractéristique de ce parfum aquatique révolutionnaire.' },
  { mol: 'Calone', perfumeName: 'Acqua di Giò', perfumeHouse: 'Giorgio Armani', perfumer: 'Alberto Morillas', year: 1996, role: 'accord_principal', concentration: 'élevée', description: 'L\'accord marin de Calone est au cœur de ce fougère aquatique, l\'un des parfums masculins les plus vendus.' },
  { mol: 'Calone', perfumeName: 'Escape for Men', perfumeHouse: 'Calvin Klein', perfumer: 'Carlos Benaïm', year: 1993, role: 'accord_principal', concentration: 'élevée', description: 'Calone apporte la fraîcheur marine caractéristique de ce fougère aquatique des années 90.' },

  // CASHMERAN
  { mol: 'Cashmeran', perfumeName: 'Obsession', perfumeHouse: 'Calvin Klein', perfumer: 'Jean Guichard', year: 1985, role: 'note_fond', concentration: 'présente', description: 'Cashmeran contribue au fond boisé-ambré chaud et sensuel de ce grand oriental.' },
  { mol: 'Cashmeran', perfumeName: 'Hypnotic Poison', perfumeHouse: 'Dior', perfumer: 'Annick Ménardo', year: 1998, role: 'note_fond', concentration: 'présente', description: 'Fond boisé-musc chaleureux qui soutient l\'accord amande-vanille de Hypnotic Poison.' },

  // DIHYDROMYRCENOL
  { mol: 'Dihydromyrcenol', perfumeName: 'Cool Water', perfumeHouse: 'Davidoff', perfumer: 'Pierre Bourdon', year: 1988, role: 'accord_principal', concentration: 'élevée', description: 'Dihydromyrcenol crée la facette métallique-propre de Cool Water, complémentaire à la Calone.' },
  { mol: 'Dihydromyrcenol', perfumeName: 'Drakkar Noir', perfumeHouse: 'Guy Laroche', perfumer: 'Pierre Wargnye', year: 1982, role: 'note_tete', concentration: 'présente', description: 'Apporte la fraîcheur lavande-fougère en tête de ce classique masculin.' },

  // ISO E SUPER
  { mol: 'Iso E Super', perfumeName: 'Molecule 01', perfumeHouse: 'Escentric Molecules', perfumer: 'Geza Schoen', year: 2006, role: 'signature', concentration: '100%', description: 'Molecule 01 est composé d\'Iso E Super pur, explorant sa propriété de résonance avec la peau et son effet "peau propre".' },
  { mol: 'Iso E Super', perfumeName: 'Fahrenheit', perfumeHouse: 'Dior', perfumer: 'Jean-Louis Sieuzac', year: 1988, role: 'accord_principal', concentration: 'élevée', description: 'Iso E Super est l\'une des molécules clés du fond boisé-cèdre-pétrolier unique de Fahrenheit.' },
  { mol: 'Iso E Super', perfumeName: 'Terre d\'Hermès', perfumeHouse: 'Hermès', perfumer: 'Jean-Claude Ellena', year: 2006, role: 'note_fond', concentration: 'présente', description: 'Contribue à la facette boisée-sèche minérale de ce fougère boisé contemporain.' },

  // SANTALOL
  { mol: 'Santalol', perfumeName: 'Santal 33', perfumeHouse: 'Le Labo', perfumer: 'Frank Voelkl', year: 2011, role: 'accord_principal', concentration: 'élevée', description: 'Santalol est la molécule centrale de ce boisé-santal culte, créant un accord bois de santal crémeux-fumé.' },
  { mol: 'Santalol', perfumeName: 'Samsara', perfumeHouse: 'Guerlain', perfumer: 'Jean-Paul Guerlain', year: 1989, role: 'accord_principal', concentration: 'élevée', description: 'Santalol de Mysore constitue le cœur de ce grand oriental boisé, l\'un des derniers grands parfums au santal naturel.' },

  // α-IONONE / β-IONONE
  { mol: 'α-Ionone', perfumeName: 'Iris Silver Mist', perfumeHouse: 'Serge Lutens', perfumer: 'Christopher Sheldrake', year: 1994, role: 'accord_principal', concentration: 'élevée', description: 'α-Ionone crée l\'accord iris poudreux-carotte caractéristique de ce parfum iris de référence.' },
  { mol: 'β-Ionone', perfumeName: 'Rive Gauche', perfumeHouse: 'Yves Saint Laurent', perfumer: 'Michel Hy', year: 1971, role: 'note_coeur', concentration: 'présente', description: 'β-Ionone contribue à la facette violette-iris de ce floral aldéhydé féminin classique.' },

  // COUMARINE
  { mol: 'Coumarine', perfumeName: 'Jicky', perfumeHouse: 'Guerlain', perfumer: 'Aimé Guerlain', year: 1889, role: 'accord_principal', concentration: 'élevée', description: 'Coumarine est la molécule fondatrice du genre fougère, introduite pour la première fois dans Jicky.' },
  { mol: 'Coumarine', perfumeName: 'Fougère Royale', perfumeHouse: 'Houbigant', perfumer: 'Paul Parquet', year: 1882, role: 'signature', concentration: 'très élevée', description: 'Fougère Royale est le premier parfum à utiliser la Coumarine synthétique, fondant le genre fougère.' },
  { mol: 'Coumarine', perfumeName: 'Drakkar Noir', perfumeHouse: 'Guy Laroche', perfumer: 'Pierre Wargnye', year: 1982, role: 'note_fond', concentration: 'présente', description: 'Coumarine apporte la base fougère-boisée caractéristique de ce classique masculin.' },

  // ACÉTATE DE LINALYLE
  { mol: 'Acétate de linalyle', perfumeName: 'Chanel N°5', perfumeHouse: 'Chanel', perfumer: 'Ernest Beaux', year: 1921, role: 'note_coeur', concentration: 'présente', description: 'Contribue à la facette florale-bergamote du cœur de N°5.' },
  { mol: 'Acétate de linalyle', perfumeName: 'Lavande Velours', perfumeHouse: 'Guerlain', perfumer: 'Thierry Wasser', year: 2014, role: 'accord_principal', concentration: 'élevée', description: 'Acétate de linalyle est la molécule principale de la lavande, créant l\'accord lavande-fougère.' },

  // POLYSANTOL / EBANOL (bois de santal synthétique)
  { mol: 'Polysantol', perfumeName: 'Santal 33', perfumeHouse: 'Le Labo', perfumer: 'Frank Voelkl', year: 2011, role: 'ingredient_cle', concentration: 'présente', description: 'Polysantol complète le Santalol naturel pour créer l\'accord santal crémeux-fumé de Santal 33.' },
  { mol: 'Ebanol', perfumeName: 'Tam Dao', perfumeHouse: 'Diptyque', perfumer: 'Fabrice Pellegrin', year: 2003, role: 'accord_principal', concentration: 'élevée', description: 'Ebanol (Javanol) crée l\'accord bois de santal crémeux-laiteux de ce parfum boisé de référence.' },
];

console.log(`\n🔗 Liaisons à créer : ${newLinks.length}`);

let created = 0;
let skipped = 0;

for (const link of newLinks) {
  const molId = molMap[link.mol];
  if (!molId) {
    console.log(`  ⚠️  Molécule non trouvée : "${link.mol}"`);
    skipped++;
    continue;
  }

  // Vérifier si la liaison existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM molecule_perfumes WHERE molecule_id = ? AND perfume_name = ?',
    [molId, link.perfumeName]
  );

  if (existing.length > 0) {
    skipped++;
    continue;
  }

  await conn.execute(
    `INSERT INTO molecule_perfumes (molecule_id, perfume_name, perfume_house, perfumer, year, role_in_perfume, concentration, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [molId, link.perfumeName, link.perfumeHouse, link.perfumer || null, link.year || null, link.role, link.concentration || null, link.description || null]
  );
  created++;
}

// Statistiques finales
const [total] = await conn.execute('SELECT COUNT(*) as cnt FROM molecule_perfumes');
const [molCount] = await conn.execute('SELECT COUNT(DISTINCT molecule_id) as cnt FROM molecule_perfumes');

console.log(`\n✅ Résultat :`);
console.log(`   Créées : ${created}`);
console.log(`   Ignorées (déjà existantes ou mol manquante) : ${skipped}`);
console.log(`   Total liaisons : ${total[0].cnt}`);
console.log(`   Molécules couvertes : ${molCount[0].cnt}`);

await conn.end();
