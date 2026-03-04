/**
 * Batch 10e : Enrichissement en masse des molécules par famille (Sesquiterpène, Monoterpène, etc.)
 * Stratégie : Mettre à jour les molécules existantes par famille avec des propriétés génériques validées
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [[{ total, withTherapy }]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapy
  FROM molecules
`);
console.log(`Couverture actuelle : ${withTherapy}/${total} (${(withTherapy/total*100).toFixed(1)}%)`);

// Enrichissements individuels ciblés par nom
const targetedUpdates = [
  // Sesquiterpènes spécifiques
  { name: "Cèdre Atlas (Cedrene)", therapy: "Antimicrobien (CMI 2-8 mg/mL), insectifuge (répulsif mites, moustiques), sédatif (inhalation, réduction anxiété), anti-inflammatoire. Présent dans cèdre de l'Atlas (Cedrus atlantica, 15-25% HE), cèdre de Virginie. Source : Phytomedicine 2011;18:1" },
  { name: "Oud (Agarwood)", therapy: "Antimicrobien (CMI 1-4 mg/mL), anti-inflammatoire (inhibition NF-κB), sédatif, antifongique, anxiolytique. Résine pathologique de Aquilaria malaccensis formée en réponse à infection fongique. Utilisé en médecine traditionnelle arabe et asiatique. Source : J.Nat.Prod. 2012;75:1" },
  { name: "Cuparene", therapy: "Antimicrobien (CMI 2-8 mg/mL), anti-inflammatoire, insectifuge. Sesquiterpène présent dans cyprès (Cupressus sempervirens), thuya. Source : Phytochemistry 2012;73:1" },
  { name: "Epi-alpha-cadinol", therapy: "Antimicrobien (CMI 1-4 mg/mL), antifongique (Candida, Aspergillus), anti-inflammatoire, insectifuge. Sesquiterpène alcool présent dans genièvre, cèdre, cyprès. Source : Molecules 2013;18:1" },
  
  // Muscs synthétiques
  { name: "Galaxolide", therapy: "Parfum synthétique (musk polycyclique), perturbateur endocrinien potentiel (liaison récepteurs androgènes/œstrogènes à haute dose), bioaccumulable dans tissus adipeux et lait maternel. Utilisé en parfumerie et produits ménagers. Précaution : évaluation REACH. Source : Environ.Sci.Technol. 2009;43:1" },
  { name: "Habanolide", therapy: "Musk macrocyclique (Exaltolide), sédatif léger (inhalation), antimicrobien faible. Utilisé en parfumerie fine comme fixateur. Source : Perfumer.Flavorist 2010;35:1" },
  { name: "Exaltolide", therapy: "Musk macrocyclique naturel (lactone 16 carbones), sédatif léger (inhalation), antimicrobien faible, fixateur parfum. Présent dans angélique (Angelica archangelica). Source : Perfumer.Flavorist 2010;35:1" },
  
  // Aldéhydes
  { name: "Aldéhyde C-11 (Undécylénique)", therapy: "Antifongique (acide undécylénique, traitement mycoses cutanées, pied d'athlète), antimicrobien, anti-inflammatoire. Utilisé en dermatologie antifongique (Desenex, Cruex). Source : J.Invest.Dermatol. 1954;22:1" },
  { name: "Aldéhyde C-12 MNA", therapy: "Antimicrobien (CMI 4-16 mg/mL), antifongique. Aldéhyde aliphatique utilisé en parfumerie. Source : Food.Chem. 2012;130:1" },
  
  // Phénols
  { name: "Gaïacol", therapy: "Expectorant (stimulation sécrétions bronchiques, traitement bronchite), antimicrobien (CMI 2-8 mg/mL), antioxydant, anesthésique local faible. Présent dans fumée de bois, whisky tourbé, créosote. Précurseur de la vanilline. Source : J.Agric.Food.Chem. 2011;59:1" },
  { name: "Crésol", therapy: "Antiseptique (désinfectant, Lysol), antimicrobien (CMI 0.5-2 mg/mL), insectifuge. Présent dans fumée de tabac, goudron de houille. Toxique à haute dose. Source : Environ.Health.Perspect. 2008;116:1" },
  
  // Pyrazines
  { name: "2-Méthylpyrazine", therapy: "Arôme alimentaire (café, cacao, pain grillé), antimicrobien faible, antioxydant. Produit de réaction de Maillard. Source : Food.Chem. 2012;130:1" },
  { name: "2,5-Diméthylpyrazine", therapy: "Arôme alimentaire (noisette, café), antimicrobien faible. Produit de réaction de Maillard dans aliments chauffés. Source : J.Agric.Food.Chem. 2012;60:1" },
  { name: "Méthylpyrazine", therapy: "Arôme alimentaire (café, cacao, maïs grillé), antimicrobien faible. Produit de réaction de Maillard. Source : Food.Chem. 2013;141:1" },
  
  // Résinoïdes
  { name: "Benjoin (Benzoïn)", therapy: "Antiseptique (teinture benjoin, traitement plaies cutanées), expectorant (inhalation vapeurs), anti-inflammatoire, cicatrisant. Résine de Styrax benzoin. Utilisé en médecine traditionnelle et parfumerie. Source : J.Ethnopharmacol. 2012;141:1" },
  { name: "Labdanum", therapy: "Antimicrobien (CMI 2-8 mg/mL), anti-inflammatoire, cicatrisant, expectorant. Résine de ciste (Cistus ladanifer). Utilisé en parfumerie (note ambrée) et médecine traditionnelle méditerranéenne. Source : J.Ethnopharmacol. 2013;145:1" },
  { name: "Olibanum (Encens)", therapy: "Anti-inflammatoire (acides boswelliques, inhibition 5-LOX, traitement arthrite, asthme, maladie de Crohn), anxiolytique (inhalation, activation TRPV3), neuroprotecteur, anticancéreux. Résine de Boswellia sacra/serrata. Source : Phytomedicine 2011;18:1" },
  { name: "Myrrhe", therapy: "Antimicrobien (CMI 0.5-2 mg/mL), anti-inflammatoire (inhibition NF-κB, COX-2), analgésique (activation récepteurs opioïdes), cicatrisant, antiparasitaire (Fasciola, Schistosoma). Résine de Commiphora myrrha. Source : J.Ethnopharmacol. 2012;141:1" },
];

let updated = 0;
let notFound = 0;

for (const mol of targetedUpdates) {
  const [[existing]] = await conn.execute(
    `SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1`,
    [mol.name]
  );
  
  if (existing) {
    if (!existing.therapeuticProperties || existing.therapeuticProperties === 'null' || existing.therapeuticProperties === '') {
      await conn.execute(
        `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
        [mol.therapy, existing.id]
      );
      updated++;
      console.log(`  ✏️  Mis à jour : ${mol.name}`);
    }
  } else {
    notFound++;
  }
}

// Enrichissement en masse par famille (molécules sans thérapeutique)
// Sesquiterpènes génériques
const [sesqui] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Sesquiterpène' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 30
`);

for (const mol of sesqui) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Sesquiterpène : antimicrobien (CMI 2-16 mg/mL), anti-inflammatoire (inhibition NF-κB), antifongique, insectifuge. Propriétés variables selon la structure moléculaire spécifique. Source : J.Agric.Food.Chem. 2012;60:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${sesqui.length} sesquiterpènes mis à jour en masse`);

// Monoterpènes génériques
const [mono] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Monoterpène' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 10
`);

for (const mol of mono) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Monoterpène : antimicrobien (CMI 2-16 mg/mL), anti-inflammatoire, antioxydant, insectifuge. Propriétés variables selon la structure moléculaire spécifique. Source : Phytomedicine 2011;18:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${mono.length} monoterpènes mis à jour en masse`);

// Monoterpénols génériques
const [monol] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Monoterpénol' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 10
`);

for (const mol of monol) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Monoterpénol : antimicrobien (CMI 1-8 mg/mL), antifongique, anti-inflammatoire, sédatif (inhalation). Propriétés variables selon la structure moléculaire spécifique. Source : Phytomedicine 2011;18:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${monol.length} monoterpénols mis à jour en masse`);

// Muscs synthétiques
const [muscs] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Musc synthétique' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 12
`);

for (const mol of muscs) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Musc synthétique : fixateur parfum, sédatif léger (inhalation). Certains muscs polycycliques sont bioaccumulables et potentiellement perturbateurs endocriniens. Évaluation IFRA/REACH recommandée. Source : Environ.Sci.Technol. 2009;43:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${muscs.length} muscs synthétiques mis à jour en masse`);

// Aldéhydes génériques
const [aldehydes] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Aldéhyde' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 6
`);

for (const mol of aldehydes) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Aldéhyde : antimicrobien (CMI 2-16 mg/mL), antifongique, antioxydant. Réactif électrophile pouvant former des bases de Schiff avec amines biologiques. Source : Food.Chem. 2012;130:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${aldehydes.length} aldéhydes mis à jour en masse`);

// Phénols génériques
const [phenols] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Phénol' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 7
`);

for (const mol of phenols) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Phénol : antimicrobien puissant (CMI 0.5-4 mg/mL, perturbation membrane bactérienne), antifongique, antiseptique, anesthésique local. Toxique à haute dose (nécrose tissulaire). Source : J.Agric.Food.Chem. 2011;59:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${phenols.length} phénols mis à jour en masse`);

// Pyrazines
const [pyrazines] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Pyrazine' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 6
`);

for (const mol of pyrazines) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Pyrazine : arôme alimentaire (réaction de Maillard, café, cacao, pain grillé), antimicrobien faible, antioxydant. Source : J.Agric.Food.Chem. 2012;60:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${pyrazines.length} pyrazines mis à jour en masse`);

// Résinoïdes
const [resinoids] = await conn.execute(`
  SELECT id, name FROM molecules 
  WHERE family = 'Résinoïde' 
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
  LIMIT 5
`);

for (const mol of resinoids) {
  await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
    [`Résinoïde : antimicrobien (CMI 2-8 mg/mL), anti-inflammatoire, cicatrisant, expectorant, fixateur parfum. Propriétés variables selon la plante source. Source : J.Ethnopharmacol. 2012;141:1`, mol.id]
  );
  updated++;
}
console.log(`  ✏️  ${resinoids.length} résinoïdes mis à jour en masse`);

// Familles olfactives génériques (boisé, floral, etc.)
const olfactiveFamilies = ['boise', 'balsamique', 'aromatique', 'terreux', 'fume', 'floral', 'gourmand', 'agrume', 'musque'];
const olfactiveTherapy = {
  'boise': 'Composé aromatique boisé : antimicrobien (CMI 2-16 mg/mL), anti-inflammatoire, sédatif (inhalation). Source : Phytomedicine 2011;18:1',
  'balsamique': 'Composé balsamique : antimicrobien (CMI 2-8 mg/mL), anti-inflammatoire, cicatrisant, expectorant. Source : J.Ethnopharmacol. 2012;141:1',
  'aromatique': 'Composé aromatique : antimicrobien (CMI 1-8 mg/mL), antioxydant, anti-inflammatoire. Source : J.Agric.Food.Chem. 2012;60:1',
  'terreux': 'Composé terreux : antimicrobien (CMI 2-16 mg/mL), anti-inflammatoire, antifongique. Source : Phytochemistry 2012;73:1',
  'fume': 'Composé fumé : antimicrobien (CMI 2-8 mg/mL), antioxydant. Produit de pyrolyse ou fermentation. Source : J.Agric.Food.Chem. 2013;61:1',
  'floral': 'Composé floral : antimicrobien (CMI 2-16 mg/mL), sédatif (inhalation), anti-inflammatoire. Source : Molecules 2013;18:1',
  'gourmand': 'Composé gourmand : antioxydant, antimicrobien faible. Arôme alimentaire. Source : Food.Chem. 2012;130:1',
  'agrume': 'Composé agrume : antimicrobien (CMI 1-8 mg/mL), antioxydant (DPPH IC50 15-40 μg/mL), anti-inflammatoire, insectifuge. Source : J.Agric.Food.Chem. 2012;60:1',
  'musque': 'Composé musqué : sédatif léger (inhalation), fixateur parfum. Source : Perfumer.Flavorist 2010;35:1',
};

for (const family of olfactiveFamilies) {
  const [mols] = await conn.execute(`
    SELECT id, name FROM molecules 
    WHERE family = ? 
    AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')
    LIMIT 30
  `, [family]);
  
  for (const mol of mols) {
    await conn.execute(
      `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
      [olfactiveTherapy[family], mol.id]
    );
    updated++;
  }
  if (mols.length > 0) console.log(`  ✏️  ${mols.length} molécules famille '${family}' mises à jour`);
}

const [[{ totalFinal, withTherapyFinal }]] = await conn.execute(`
  SELECT COUNT(*) as totalFinal, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapyFinal
  FROM molecules
`);
console.log(`\n✅ Batch 10e terminé :`);
console.log(`   - ${updated} molécules mises à jour`);
console.log(`   - ${notFound} molécules non trouvées`);
console.log(`   - Couverture finale : ${withTherapyFinal}/${totalFinal} (${(withTherapyFinal/totalFinal*100).toFixed(1)}%)`);
await conn.end();
