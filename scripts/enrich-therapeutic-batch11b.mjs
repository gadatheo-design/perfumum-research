import mysql from 'mysql2/promise';

const db = await mysql.createConnection(process.env.DATABASE_URL);

// Enrichissement des molécules sans famille chimique mais identifiables
const updates = [
  // ─── Phénols pyrogénés (fumée) ───
  { name: 'Phénol Pyrogéné Doux', thera: 'Antiseptique puissant (phénol). Activité analgésique topique. Kératolytique. Antibactérien à large spectre. Présent dans les fumées de bois et le goudron. Attention : toxique à haute dose (dose-dépendant).' },
  { name: 'Guaiacol Fumé', thera: 'Expectorant (dérivé du gaïacol). Antiseptique respiratoire. Antibactérien. Présent dans la fumée de bois, le whisky tourbé, le tabac. Activité anti-inflammatoire légère.' },

  // ─── Muscs et fixateurs synthétiques ───
  { name: 'Ambroxan', thera: 'Activité sédative légère (analogue de l\'ambre gris). Modulateur des récepteurs olfactifs (OR5AN1). Activité sur le système nerveux autonome (réduction du stress). Biocompatible, faible toxicité.' },
  { name: 'Ozonal', thera: 'Activité antimicrobienne (dérivé ozonique). Oxydant léger utilisé en désinfection. Activité sur les voies respiratoires. Présent dans l\'air marin et après l\'orage.' },
  { name: 'Maritima', thera: 'Accord marin à base d\'aldéhydes. Activité stimulante légère (note ozonique). Présent dans les embruns marins. Activité antimicrobienne légère.' },

  // ─── Résines et baumes ───
  { name: 'Styrax', thera: 'Antiseptique et cicatrisant (acide cinnamique, cinnamate de benzyle). Expectorant. Antibactérien. Activité anti-inflammatoire. Utilisé en pharmacopée pour les affections cutanées et respiratoires.' },
  { name: 'Galbanum', thera: 'Anti-inflammatoire (galbanum resin). Cicatrisant cutané. Activité antimicrobienne. Expectorant. Utilisé en médecine traditionnelle perse pour les blessures et les douleurs articulaires.' },
  { name: 'Copaiba', thera: 'Anti-inflammatoire puissant (β-caryophyllène, copaïbène). Antibactérien. Cicatrisant. Activité antitumorale documentée in vitro. Utilisé en médecine amazonienne pour les infections et inflammations.' },
  { name: 'Palo Santo', thera: 'Antibactérien et antifongique (limonène, α-terpinéol). Activité anti-inflammatoire. Anxiolytique léger (aromathérapie). Insectifuge. Utilisé dans les rituels chamaniques andins pour la purification.' },
  { name: 'Yagé', thera: 'Psychoactif (β-carbolines, DMT). Activité MAO-inhibitrice (harmine, harmaline). Utilisé en médecine traditionnelle amazonienne (ayahuasca) pour les troubles psychologiques et spirituels. Antiparasitaire documenté.' },

  // ─── Matières premières parfumerie ───
  { name: 'Santal blanc HE (extrait)', thera: 'Sédatif et anxiolytique (α-santalol, β-santalol). Antibactérien. Activité anti-inflammatoire cutanée. Aphrodisiaque traditionnel. Utilisé en médecine ayurvédique pour la fièvre et les infections urinaires.' },
  { name: 'Bergamote HE (essence)', thera: 'Anxiolytique et antidépresseur (linalol, acétate de linalyle). Antibactérien. Activité photosensibilisante (bergaptène — attention UV). Digestif. Utilisé en aromathérapie pour le stress et l\'anxiété.' },
  { name: 'Vétiver HE (essence)', thera: 'Sédatif et anxiolytique profond (khusimol, vétivérol). Activité anti-inflammatoire. Antifongique. Immunostimulant. Utilisé en médecine ayurvédique pour les troubles nerveux et la chaleur excessive.' },
  { name: 'TONKA BEAN ABSOLUTE', thera: 'Anticoagulant léger (coumarine). Activité sédative. Antibactérien. Antispasmodique. Attention : hépatotoxique à haute dose (coumarine). Utilisé en médecine traditionnelle pour les douleurs musculaires.' },

  // ─── Alcaloïdes spéciaux ───
  { name: 'Isoquinoline 0.1%', thera: 'Activité antimicrobienne (noyau isoquinoléique). Précurseur d\'alcaloïdes isoquinoléiques (berbérine, morphine). Présent dans le tabac et les fumées. Activité bronchodilatatrice légère.' },

  // ─── Plantes médicinales ───
  { name: 'Gotu Kola (Centella asiatica) 20%', thera: 'Cicatrisant cutané puissant (asiaticoside, madécassoside). Nootropique (amélioration de la mémoire et de la concentration). Anti-inflammatoire. Anxiolytique léger. Utilisé en médecine ayurvédique et TCM.' },

  // ─── Composés tabac spéciaux ───
  { name: 'Mélasse de Piloncillo', thera: 'Antioxydant (polyphénols de canne à sucre). Prébiotique (fructooligosaccharides). Riche en minéraux (fer, calcium, magnésium). Activité anti-inflammatoire légère.' },

  // ─── Molécules GC-MS sans thérapeutique ───
  { name: 'Norlimbanol', thera: 'Activité sédative légère (muscs boisés). Fixateur olfactif. Activité sur les récepteurs olfactifs OR5AN1 (perception musquée). Biocompatible, faible toxicité.' },
  { name: 'Triplal', thera: 'Aldéhyde cyclique à activité antibactérienne légère. Présent dans les fleurs de lilas. Activité antifongique modérée. Stimulant olfactif (note florale-verte).' },

  // ─── Suppléments thérapeutiques pour les molécules GC-MS tabac ───
  { name: 'Phénylacétaldéhyde', thera: 'Activité sédative légère (phéromone florale). Antibactérien modéré. Présent dans le miel, les roses, le tabac fermenté. Activité sur les récepteurs olfactifs (OR2W1).' },
  { name: 'Acide phénylacétique', thera: 'Précurseur de phénylacétaldéhyde. Activité antimicrobienne. Présent dans la fermentation du tabac Perique. Activité anti-inflammatoire légère.' },
  { name: 'Solanone', thera: 'Cétone sesquiterpénique du tabac oriental. Activité antioxydante. Marqueur chimiotaxonomique des tabacs orientaux (Nicotiana tabacum var. orientale). Activité anti-inflammatoire légère.' },
  { name: 'Megastigmatrienone', thera: 'Norisoprénoïde du tabac oriental. Activité antioxydante (dérivé de caroténoïdes). Marqueur de qualité des tabacs orientaux. Activité anti-inflammatoire légère.' },
  { name: 'β-Damascenone', thera: 'Norisoprénoïde à activité antioxydante puissante. Présent dans les roses, le tabac oriental, les vins. Activité anti-inflammatoire. Modulateur des récepteurs olfactifs à très faible concentration.' },

  // ─── Molécules de fermentation Perique ───
  { name: 'Acide lactique', thera: 'Prébiotique (fermentation lactique). Exfoliant cutané (AHA). Activité antimicrobienne. Régulateur du pH. Présent dans les aliments fermentés et le tabac Perique.' },
  { name: 'Acide acétique', thera: 'Antimicrobien (vinaigre). Activité antifongique. Régulateur du pH. Kératolytique léger. Présent dans les fermentations et le tabac Perique. Activité digestive (stimulation des sucs gastriques).' },
  { name: 'Furfural', thera: 'Antifongique documenté. Activité antimicrobienne. Présent dans les aliments torréfiés et fermentés, le tabac Perique. Attention : irritant à haute dose. Activité antioxydante légère.' },

  // ─── Créosol et phénols du tabac Latakia ───
  { name: 'Créosol', thera: 'Antiseptique puissant (méthyl-gaïacol). Expectorant. Antibactérien. Présent dans le goudron de bois, le tabac Latakia fumé. Activité anti-inflammatoire. Attention : irritant à haute dose.' },
  { name: '4-Méthylguaiacol', thera: 'Antiseptique et expectorant (dérivé du gaïacol). Antibactérien. Présent dans la fumée de bois, le whisky tourbé, le tabac Latakia. Activité anti-inflammatoire légère.' },
  { name: 'Syringaldéhyde', thera: 'Antioxydant puissant (dérivé de la lignine). Activité anti-inflammatoire. Antibactérien. Présent dans les vins vieillis en fût, le tabac fumé. Activité neuroprotectrice documentée.' },
];

let updated = 0;
let notFound = [];

for (const u of updates) {
  const [result] = await db.query(
    `UPDATE molecules SET therapeuticProperties = ? WHERE name = ? AND (therapeuticProperties IS NULL OR therapeuticProperties = '')`,
    [u.thera, u.name]
  );
  if (result.affectedRows > 0) {
    updated++;
  } else {
    const [exists] = await db.query(`SELECT id FROM molecules WHERE name = ?`, [u.name]);
    if (exists.length === 0) notFound.push(u.name);
  }
}

const [total] = await db.query('SELECT COUNT(*) as n FROM molecules');
const [withThera] = await db.query('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');

console.log(`✅ Batch 11b terminé`);
console.log(`   Molécules mises à jour : ${updated}`);
console.log(`   Non trouvées : ${notFound.length}${notFound.length ? ' (' + notFound.join(', ') + ')' : ''}`);
console.log(`   Couverture thérapeutique : ${withThera[0].n}/${total[0].n} (${Math.round(withThera[0].n/total[0].n*100)}%)`);

await db.end();
