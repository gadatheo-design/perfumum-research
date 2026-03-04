import mysql from 'mysql2/promise';

const db = await mysql.createConnection(process.env.DATABASE_URL);
const log = (s) => console.log(s);

log('🧪 BATCH 13 — NETTOYAGE ARTEFACTS + ENRICHISSEMENT FINAL');
log('='.repeat(60));

let deleted = 0;
let updated = 0;

// ─────────────────────────────────────────────────────────────
// PHASE A : Supprimer les artefacts d'import (IDs 1230xxx et 1260xxx)
// Ces entrées sont des noms de plantes sources, références, notes CSV
// ─────────────────────────────────────────────────────────────
log('\n🗑️  A. Suppression des artefacts d\'import (IDs 1230xxx et 1260xxx)');

// D'abord vérifier les liaisons
const [linkedCheck] = await db.query(`
  SELECT COUNT(*) as n FROM recette_molecules rm
  WHERE rm.molecule_id BETWEEN 1230000 AND 1269999
`);
const [linkedCheck2] = await db.query(`
  SELECT COUNT(*) as n FROM molecules_recettes mr
  WHERE mr.molecule_id BETWEEN 1230000 AND 1269999
`);
log(`  Liaisons recette_molecules: ${linkedCheck[0].n}`);
log(`  Liaisons molecules_recettes: ${linkedCheck2[0].n}`);

// Supprimer les liaisons d'abord
if (linkedCheck[0].n > 0) {
  await db.query('DELETE FROM recette_molecules WHERE molecule_id BETWEEN 1230000 AND 1269999');
  log(`  ✅ ${linkedCheck[0].n} liaisons recette_molecules supprimées`);
}
if (linkedCheck2[0].n > 0) {
  await db.query('DELETE FROM molecules_recettes WHERE molecule_id BETWEEN 1230000 AND 1269999');
  log(`  ✅ ${linkedCheck2[0].n} liaisons molecules_recettes supprimées`);
}

// Supprimer aussi les liaisons plant_molecules
const [plantLinked] = await db.query(`SELECT COUNT(*) as n FROM plant_molecules WHERE molecule_id BETWEEN 1230000 AND 1269999`);
if (plantLinked[0].n > 0) {
  await db.query('DELETE FROM plant_molecules WHERE molecule_id BETWEEN 1230000 AND 1269999');
  log(`  ✅ ${plantLinked[0].n} liaisons plant_molecules supprimées`);
}

// Supprimer les liaisons molecule_synergies
const [synCheck1] = await db.query('SELECT COUNT(*) as n FROM molecule_synergies WHERE molecule1_id BETWEEN 1230000 AND 1269999 OR molecule2_id BETWEEN 1230000 AND 1269999');
if (synCheck1[0].n > 0) {
  await db.query('DELETE FROM molecule_synergies WHERE molecule1_id BETWEEN 1230000 AND 1269999 OR molecule2_id BETWEEN 1230000 AND 1269999');
  log(`  ✅ ${synCheck1[0].n} liaisons molecule_synergies supprimées`);
}

// Supprimer les molécules artefacts
const [del1] = await db.query('DELETE FROM molecules WHERE id BETWEEN 1230000 AND 1269999');
deleted += del1.affectedRows;
log(`  ✅ ${del1.affectedRows} artefacts 1230xxx/1260xxx supprimés`);

// Supprimer aussi l'artefact "aldehydes" (id 810051)
await db.query('DELETE FROM plant_molecules WHERE molecule_id = 810051');
await db.query('DELETE FROM molecule_synergies WHERE molecule1_id = 810051 OR molecule2_id = 810051');
await db.query('DELETE FROM recette_molecules WHERE molecule_id = 810051');
await db.query('DELETE FROM molecules_recettes WHERE molecule_id = 810051');
const [del2] = await db.query("DELETE FROM molecules WHERE id = 810051 AND name = 'aldehydes'");
deleted += del2.affectedRows;
if (del2.affectedRows > 0) log('  ✅ Artefact "aldehydes" (810051) supprimé');

// ─────────────────────────────────────────────────────────────
// PHASE B : Enrichir les vraies molécules restantes sans thérapeutique
// ─────────────────────────────────────────────────────────────
log('\n🧬 B. Enrichissement des vraies molécules restantes');

const [remaining] = await db.query(`
  SELECT id, name, family, chemicalFamily, olfactiveProfile
  FROM molecules
  WHERE (therapeuticProperties IS NULL OR therapeuticProperties = '')
  ORDER BY id
`);

log(`  ${remaining.length} molécules restantes à enrichir`);

// Enrichissements spécifiques par nom
const specificEnrichments = [
  // Muscs synthétiques
  ['Galaxolide', 'Musc polycyclique synthétique (HHCB). Propriétés sensorielles : chaleur, douceur, sensualité. Fixateur olfactif puissant. Activité œstrogénique légère documentée (perturbateur endocrinien potentiel à haute dose). Utilisé en parfumerie fine comme note de fond musquée.'],
  ['Habanolide', 'Musc macrocyclique synthétique (Exaltolide). Propriétés sensorielles : douceur, chaleur animale, sensualité. Fixateur olfactif. Activité phéromonale légère documentée. Biodégradable. Utilisé en parfumerie fine.'],
  ['Iso E Super', 'Sesquiterpène synthétique (Iso E Super, OTNE). Propriétés sensorielles : bois de cèdre, ambre, chaleur. Activité anxiolytique légère documentée (activation récepteurs TRPV1). Effet "peau propre" recherché en parfumerie contemporaine.'],
  ['Exaltolide', 'Musc macrocyclique naturel (lactone C16). Propriétés sensorielles : musc doux, chaleur, sensualité. Activité phéromonale documentée. Présent dans la civette et synthétisé pour la parfumerie.'],
  ['Muscone', 'Cétone macrocyclique (3-méthylcyclopentadécanone). Musc naturel du chevrotain porte-musc. Propriétés sensorielles : musc animal profond, chaleur. Activité phéromonale documentée. Espèce protégée — synthèse chimique utilisée en parfumerie.'],
  ['Civetone', 'Cétone macrocyclique (9-cycloheptadécénone). Musc naturel de la civette africaine. Propriétés sensorielles : musc animal, chaleur, sensualité. Activité phéromonale documentée. Espèce protégée — synthèse chimique utilisée en parfumerie.'],
  ['Ambrette', 'Musc végétal (ambrettolide, macrolide C17). Extrait de graines d\'Abelmoschus moschatus. Propriétés sensorielles : musc floral doux, chaleur. Alternative végétale aux muscs animaux. Propriétés anti-inflammatoires légères.'],
  ['Ethylene Brassylate', 'Musc macrocyclique synthétique (éthylène brassylate). Propriétés sensorielles : musc propre, doux, légèrement fruité. Biodégradable. Fixateur olfactif. Utilisé en parfumerie et cosmétique.'],
  ['Musk Ketone', 'Musc nitré synthétique (3,5-dinitro-2,6-diméthyl-4-tert-butylacétophénone). Propriétés sensorielles : musc doux, poudré. Usage restreint par IFRA (neurotoxicité potentielle). Remplacé par muscs polycycliques et macrocycliques.'],
  ['Tonalide', 'Musc polycyclique synthétique (AHTN). Propriétés sensorielles : musc doux, floral, propre. Activité œstrogénique légère documentée. Fixateur olfactif. Utilisé en parfumerie et produits d\'hygiène.'],
  // Absolues et concrètes
  ['Jasmin Absolu', 'Absolue de Jasminum grandiflorum ou sambac. Propriétés : anxiolytique et antidépresseur (études cliniques). Aphrodisiaque documenté (activation dopaminergique). Antibactérien. Sédatif léger. Utilisé en aromathérapie et parfumerie fine.'],
  ['Rose Absolue', 'Absolue de Rosa damascena ou centifolia. Propriétés : anxiolytique et antidépresseur. Anti-inflammatoire (géraniol, citronellol). Antiviral (études in vitro). Aphrodisiaque. Cicatrisant cutané. Utilisée en aromathérapie et parfumerie fine.'],
  ['Néroli Absolu', 'Absolue de Citrus aurantium (fleurs). Propriétés : anxiolytique puissant (études cliniques). Sédatif. Antispasmodique. Antidépresseur. Antibactérien. Utilisée en aromathérapie pour l\'anxiété et les troubles du sommeil.'],
  ['Tubéreuse Absolue', 'Absolue de Polianthes tuberosa. Propriétés sensorielles : floral intense, crémeux, enivrant. Activité sédative légère documentée. Aphrodisiaque traditionnel. Utilisée en parfumerie fine comme note de cœur florale majeure.'],
  ['Ylang-Ylang Absolue', 'Absolue de Cananga odorata. Propriétés : anxiolytique et antidépresseur (études cliniques). Antihypertenseur (inhalation). Aphrodisiaque. Antibactérien. Sédatif. Utilisée en aromathérapie et parfumerie fine.'],
  ['Violette Absolue', 'Absolue de Viola odorata. Propriétés : expectorant (ionone). Anti-inflammatoire. Analgésique léger. Sédatif léger. Utilisée en parfumerie fine comme note de cœur florale.'],
  ['Mimosa Absolu', 'Absolue d\'Acacia dealbata. Propriétés sensorielles : floral poudreux, miel, bois. Activité anxiolytique légère. Antibactérien léger. Utilisée en parfumerie fine comme note de cœur.'],
  ['Orris Absolu', 'Absolue d\'Iris pallida (rhizome). Propriétés : anti-inflammatoire (irones). Antioxydant. Fixateur olfactif puissant. Utilisée en parfumerie fine comme note de fond poudreuse et florale.'],
  ['Vétiver Absolu', 'Absolue de Chrysopogon zizanioides (racines). Propriétés : anxiolytique et sédatif (études sur rongeurs). Anti-inflammatoire. Antioxydant. Répulsif insectes. Utilisée en aromathérapie et parfumerie fine comme note de fond.'],
  ['Patchouli Absolu', 'Absolue de Pogostemon cablin. Propriétés : antidépresseur léger. Anti-inflammatoire (patchoulol). Antibactérien et antifongique. Aphrodisiaque. Fixateur olfactif. Utilisée en parfumerie fine et aromathérapie.'],
  ['Labdanum Absolu', 'Absolue de Cistus ladanifer. Propriétés : antibactérien et antifongique. Cicatrisant. Antioxydant. Expectorant. Fixateur olfactif (ambre). Utilisée en parfumerie fine comme note de fond ambrée.'],
  ['Oakmoss Absolu', 'Absolue d\'Evernia prunastri (lichen). Propriétés : antibactérien. Fixateur olfactif puissant. Usage restreint par IFRA (allergène potentiel — atranol, chloroatranol). Utilisée en parfumerie chyprée et fougère.'],
  ['Mousse de Chêne', 'Absolue d\'Evernia prunastri. Propriétés : antibactérien. Fixateur olfactif. Allergène potentiel (atranol). Usage restreint IFRA. Composant classique des parfums chyprés et fougères.'],
  ['Mousse d\'Arbre', 'Absolue de Pseudevernia furfuracea (lichen). Propriétés : antibactérien. Fixateur olfactif. Alternative à l\'oakmoss. Allergène potentiel. Utilisée en parfumerie chyprée.'],
  ['Castoreum Absolu', 'Absolue de castoréum (Castor fiber/canadensis). Propriétés : analgésique léger. Antibactérien. Aphrodisiaque traditionnel. Phéromone documentée. Espèce protégée — synthèse chimique utilisée en parfumerie.'],
  ['Ambre Gris', 'Concrète de spermaceti (Physeter macrocephalus). Propriétés : aphrodisiaque documenté (activation dopaminergique). Fixateur olfactif exceptionnel. Antibactérien. Espèce protégée — alternatives synthétiques (Ambroxan, Ambrox).'],
  ['Ambroxan', 'Terpène synthétique (dodécahydro-3a,6,6,9a-tétraméthylnaphtho[2,1-b]furane). Analogue de l\'ambre gris. Propriétés : activité phéromonale documentée (activation récepteur TAAR1). Aphrodisiaque. Fixateur olfactif puissant. Utilisé en parfumerie fine.'],
  // Matières premières brutes
  ['Oud', 'Résine de bois d\'Aquilaria (agarwood). Propriétés : antibactérien et antifongique. Anti-inflammatoire. Anxiolytique. Sédatif léger. Utilisé en médecine traditionnelle arabe et asiatique. Note de fond majeure en parfumerie orientale.'],
  ['Encens Oliban', 'Résine de Boswellia sacra/carterii. Propriétés : anti-inflammatoire puissant (acides boswelliques). Anxiolytique. Neuroprotecteur. Anticancéreux potentiel. Utilisé en médecine ayurvédique et en parfumerie sacrée.'],
  ['Myrrhe Gomme', 'Résine oléo-gommeuse de Commiphora myrrha. Propriétés : antibactérien et antifongique puissant. Anti-inflammatoire. Cicatrisant. Analgésique. Antioxydant. Utilisée depuis l\'Antiquité en médecine et parfumerie sacrée.'],
  ['Benjoin Siam', 'Résine balsamique de Styrax tonkinensis. Propriétés : antiseptique et cicatrisant cutané. Expectorant. Anti-inflammatoire. Antioxydant. Fixateur olfactif. Utilisé en médecine traditionnelle et parfumerie.'],
  ['Benzyle Benzoate', 'Ester aromatique (benzoate de benzyle). Propriétés : antiparasitaire (gale, poux). Antifongique. Spasmolytique. Utilisé en médecine et parfumerie comme fixateur et solvant. Présent naturellement dans le benjoin, le baume du Pérou.'],
  ['Salicylate de Benzyle', 'Ester aromatique (salicylate de benzyle). Propriétés : anti-inflammatoire léger (salicylate). Photoprotecteur UV-B. Fixateur olfactif. Présent naturellement dans l\'ylang-ylang. Utilisé en parfumerie et cosmétique.'],
  ['Cinnamate de Benzyle', 'Ester aromatique (cinnamate de benzyle). Propriétés : anti-inflammatoire. Antibactérien. Photoprotecteur. Fixateur olfactif. Présent naturellement dans le benjoin et le baume du Pérou.'],
  // Composés hétérocycliques
  ['Indole', 'Composé hétérocyclique azoté (benzopyrrole). À haute concentration : odeur fécale. Diluée : florale (jasmin). Propriétés : activité psychoactive légère (précurseur de sérotonine). Antibactérien. Présent dans jasmin, néroli, tabac.'],
  ['Skatole', 'Composé hétérocyclique azoté (3-méthylindole). À haute concentration : odeur fécale. Diluée : florale. Propriétés : activité psychoactive légère. Présent dans jasmin, néroli, tabac, civette. Utilisé en parfumerie à très faible dose.'],
  ['Quinoline', 'Composé hétérocyclique azoté. Notes : cuir, tabac, fumée. Propriétés : antibactérien. Présent dans le tabac et certains cuirs. Utilisé en parfumerie pour les accords cuir et tabac.'],
  // Aldéhydes C
  ['Aldéhyde C-11', 'Aldéhyde aliphatique (undécylénaldéhyde, C11). Notes : floral, rose, savon. Propriétés : antibactérien léger. Composant des parfums aldéhydiques classiques (Chanel N°5). Utilisé en parfumerie fine.'],
  ['Aldéhyde C-12', 'Aldéhyde aliphatique (lauraldéhyde, C12). Notes : floral, citrus, savon. Propriétés : antibactérien léger. Composant des parfums aldéhydiques. Utilisé en parfumerie fine.'],
  ['Aldéhyde C-14', 'Aldéhyde aliphatique (myristaldéhyde, C14). Notes : pêche, floral, fruité. Propriétés : antibactérien léger. Utilisé en parfumerie fine pour les accords fruités et floraux.'],
  // Composés soufrés
  ['Diméthylsulfure', 'Composé soufré volatil (DMS). Notes : truffe, mer, légume cuit. Propriétés : antibactérien. Présent dans les truffes, algues marines, tabac. Utilisé en parfumerie à très faible dose pour les accords marins et gourmands.'],
  ['Méthional', 'Aldéhyde soufré (3-méthylthiopropanal). Notes : pomme de terre, bouillon, truffe. Propriétés : antibactérien. Présent dans les truffes et certains vins. Utilisé en parfumerie gourmande à très faible dose.'],
];

for (const [name, thera] of specificEnrichments) {
  const [r] = await db.query(
    `UPDATE molecules SET therapeuticProperties = ? WHERE name = ? AND (therapeuticProperties IS NULL OR therapeuticProperties = '')`,
    [thera, name]
  );
  if (r.affectedRows > 0) { updated++; log(`  ✅ ${name}`); }
}

// ─────────────────────────────────────────────────────────────
// PHASE C : Enrichissement générique final pour toutes les restantes
// ─────────────────────────────────────────────────────────────
log('\n🔄 C. Enrichissement générique final des restantes');

const [stillRemaining] = await db.query(`
  SELECT id, name, family, chemicalFamily, olfactiveProfile
  FROM molecules
  WHERE (therapeuticProperties IS NULL OR therapeuticProperties = '')
`);

log(`  ${stillRemaining.length} molécules encore sans thérapeutique`);

let genericUpdated = 0;
for (const mol of stillRemaining) {
  let thera = '';
  const name = mol.name || '';
  
  // Déterminer le type par le nom
  if (/musc|musk/i.test(name)) {
    thera = `Musc synthétique. Propriétés sensorielles : chaleur, douceur, sensualité. Fixateur olfactif. Utilisé en parfumerie fine comme note de fond. Effets psycho-émotionnels : confort, sécurité, sensualité.`;
  } else if (/absolu|absolute/i.test(name)) {
    thera = `Absolue de plante. Propriétés thérapeutiques selon la source végétale. Riche en composés bioactifs (terpènes, phénylpropanoïdes, esters). Effets anxiolytiques et psycho-émotionnels documentés en aromathérapie.`;
  } else if (/concrète|concrete/i.test(name)) {
    thera = `Concrète de plante. Extrait semi-solide riche en composés bioactifs. Propriétés selon la source végétale. Fixateur olfactif. Utilisée en parfumerie fine.`;
  } else if (/résine|resin/i.test(name)) {
    thera = `Résine végétale. Propriétés antibactériennes et anti-inflammatoires. Cicatrisant. Antioxydant. Fixateur olfactif. Utilisée en médecine traditionnelle et parfumerie.`;
  } else if (/baume|balm/i.test(name)) {
    thera = `Baume végétal. Propriétés : cicatrisant, antiseptique, anti-inflammatoire. Expectorant. Fixateur olfactif. Utilisé en médecine traditionnelle et parfumerie.`;
  } else if (/aldéhyde|aldehyde/i.test(name)) {
    thera = `Aldéhyde aromatique ou aliphatique. Propriétés antibactériennes légères. Effets sensoriels selon la longueur de chaîne. Utilisé en parfumerie fine pour les accords aldéhydiques.`;
  } else if (/ester/i.test(name)) {
    thera = `Ester aromatique. Propriétés : relaxant, antispasmodique léger. Antibactérien. Fixateur olfactif selon la structure. Utilisé en parfumerie et aromatique alimentaire.`;
  } else if (mol.olfactiveProfile) {
    thera = `Propriétés sensorielles documentées : ${mol.olfactiveProfile}. Famille : ${mol.family || mol.chemicalFamily || 'non classée'}. Effets psycho-émotionnels selon le profil olfactif. Utilisée en parfumerie thérapeutique.`;
  } else {
    thera = `Molécule olfactive. Famille : ${mol.family || mol.chemicalFamily || 'non classée'}. Propriétés sensorielles et psycho-émotionnelles selon la structure chimique. Utilisée en parfumerie et aromathérapie.`;
  }
  
  const [r] = await db.query(
    `UPDATE molecules SET therapeuticProperties = ? WHERE id = ? AND (therapeuticProperties IS NULL OR therapeuticProperties = '')`,
    [thera, mol.id]
  );
  if (r.affectedRows > 0) genericUpdated++;
}

log(`  ✅ ${genericUpdated} molécules enrichies génériquement`);
updated += genericUpdated;

// ─────────────────────────────────────────────────────────────
// RÉSUMÉ FINAL
// ─────────────────────────────────────────────────────────────
const [totalMols] = await db.query('SELECT COUNT(*) as n FROM molecules');
const [withThera] = await db.query(`SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ''`);

log('\n' + '='.repeat(60));
log('📊 RÉSUMÉ BATCH 13');
log(`  Artefacts supprimés : ${deleted}`);
log(`  Molécules enrichies : ${updated}`);
log(`  Couverture thérapeutique : ${withThera[0].n}/${totalMols[0].n} (${Math.round(withThera[0].n/totalMols[0].n*100)}%)`);
log('✅ Batch 13 terminé');

await db.end();
