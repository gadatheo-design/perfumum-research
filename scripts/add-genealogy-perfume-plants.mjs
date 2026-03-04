/**
 * Script : Généalogies des plantes à parfum
 * Roses, Lavandes, Jasmin, Néroli, Ylang-ylang, Vétiver
 * Sources : Botanical Journal of the Linnean Society, Flora Europaea, 
 *           Grasse Perfumers' Handbook, IPNI (International Plant Names Index)
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Vérifier les colonnes réelles
const [plantCols] = await conn.execute('SHOW COLUMNS FROM plants');
const plantFields = plantCols.map(c => c.Field);
console.log('Colonnes plants:', plantFields.join(', '));

// Déterminer les noms de colonnes (camelCase vs snake_case)
const latinField = plantFields.includes('latin_name') ? 'latin_name' : 'latinName';
const catField = plantFields.includes('category') ? 'category' : 'category';

// ─── Helpers ────────────────────────────────────────────────────────────────
async function getOrCreatePlant(name, latinName, category = 'fleur') {
  const [existing] = await conn.execute(
    `SELECT id FROM plants WHERE ${latinField} = ? OR name = ? LIMIT 1`,
    [latinName, name]
  );
  if (existing.length > 0) return existing[0].id;
  
  const [result] = await conn.execute(
    `INSERT INTO plants (name, ${latinField}, ${catField}, created_at, updated_at) 
     VALUES (?, ?, ?, NOW(), NOW())`,
    [name, latinName, category]
  );
  console.log(`  ✓ Plante créée: ${name} (${latinName}) → id:${result.insertId}`);
  return result.insertId;
}

async function addGenealogy(varietyId, parentId, relationshipType, notes, breeder = null) {
  const [existing] = await conn.execute(
    'SELECT id FROM variety_genealogy WHERE variety_id = ? AND parent_variety_id = ?',
    [varietyId, parentId]
  );
  if (existing.length > 0) return; // déjà existant
  
  await conn.execute(
    `INSERT INTO variety_genealogy (variety_id, parent_variety_id, relationship_type, breeder, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [varietyId, parentId, relationshipType, breeder, notes]
  );
  console.log(`  ✓ Généalogie: ${varietyId} → ${parentId} (${relationshipType})`);
}

let created = 0;

// ═══════════════════════════════════════════════════════════════════════════
// ROSES — Famille Rosaceae, Genre Rosa
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n🌹 ROSES');

const rosaGallicaId = await getOrCreatePlant('Rose de Provins', 'Rosa gallica', 'fleur');
const rosaCanina = await getOrCreatePlant('Rosier des chiens', 'Rosa canina', 'fleur');
const rosaMoschata = await getOrCreatePlant('Rosier musqué', 'Rosa moschata', 'fleur');

// Trouver Rosa damascena existante
const [rdRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} LIKE '%damascena%' LIMIT 1`
);
const rosaDamascenaId = rdRows.length > 0 ? rdRows[0].id : 
  await getOrCreatePlant('Rose de Damas', 'Rosa × damascena', 'fleur');

// Trouver Rosa centifolia existante
const [rcRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} LIKE '%centifolia%' LIMIT 1`
);
const rosaCentifoliaId = rcRows.length > 0 ? rcRows[0].id :
  await getOrCreatePlant('Rose centifolia', 'Rosa × centifolia', 'fleur');

// Rosa × damascena = R. gallica × R. moschata
await addGenealogy(rosaDamascenaId, rosaGallicaId, 'hybrid',
  'Rosa × damascena est un hybride naturel de Rosa gallica et Rosa moschata, avec possible contribution de Rosa fedtschenkoana. Origine : Proche-Orient, cultivée depuis l\'Antiquité. Profil moléculaire : citronellol (18-55%), géraniol (10-35%), nérol (5-10%). Source : Baydar et al. (2004), J. Agric. Food Chem.',
  'Hybridation naturelle (Proche-Orient, ~1000 av. J.-C.)');

await addGenealogy(rosaDamascenaId, rosaMoschata, 'hybrid',
  'Contribution de Rosa moschata dans le génome de Rosa × damascena. Apporte les notes musquées et la richesse en géraniol. Confirmé par analyse ADN microsatellite (Millan et al., 2013).',
  'Hybridation naturelle');

// Rosa × centifolia = hybride complexe (dérive de R. damascena)
await addGenealogy(rosaCentifoliaId, rosaDamascenaId, 'hybrid',
  'Rosa × centifolia (Rose de Mai, Rose à cent feuilles) est un hybride complexe développé par les horticulteurs hollandais aux XVIe-XVIIe siècles. Dérive principalement de Rosa × damascena. Profil : phényléthanol dominant (60-75%), citronellol (8-22%), géraniol (3-12%). Cultivée principalement à Grasse pour la parfumerie. Source : Grasse Perfumers\' Handbook (2001).',
  'Horticulteurs hollandais (XVIe-XVIIe siècle)');

await addGenealogy(rosaCentifoliaId, rosaGallicaId, 'hybrid',
  'Contribution de Rosa gallica dans le génome de Rosa × centifolia. Apporte les notes épicées et la richesse en anthocyanines.',
  'Hybridation complexe');

await addGenealogy(rosaCentifoliaId, rosaCanina, 'hybrid',
  'Contribution de Rosa canina dans le génome de Rosa × centifolia. Apporte la vigueur végétative et les notes fruitées.',
  'Hybridation complexe');

// Rosa × alba = R. gallica × R. canina
const rosaAlba = await getOrCreatePlant('Rose blanche', 'Rosa × alba', 'fleur');
await addGenealogy(rosaAlba, rosaGallicaId, 'hybrid',
  'Rosa × alba est un hybride de Rosa gallica et Rosa canina. Connue depuis l\'Antiquité romaine. Profil : nérol (15-25%), géraniol (20-35%), citronellol (10-20%). Utilisée en parfumerie ottomane et dans la production d\'eau de rose. Source : Widrlechner (1981), Arnoldia.',
  'Hybridation naturelle (Antiquité)');

await addGenealogy(rosaAlba, rosaCanina, 'hybrid',
  'Contribution de Rosa canina dans le génome de Rosa × alba. Apporte la résistance aux maladies et les notes vertes.',
  'Hybridation naturelle');

// Rosa × damascena var. trigintipetala (rose de Kazanlak)
const rosaKazanlak = await getOrCreatePlant('Rose de Kazanlak', 'Rosa × damascena var. trigintipetala', 'fleur');
await addGenealogy(rosaKazanlak, rosaDamascenaId, 'clone',
  'Variété sélectionnée de Rosa × damascena cultivée dans la Vallée des Roses (Bulgarie). Profil légèrement différent : citronellol (28-42%), géraniol (12-22%), nérol (8-15%). Production principale d\'huile de rose absolue mondiale (~70%). Source : Kovacheva et al. (2010), Biotechnology & Biotechnological Equipment.',
  'Sélection bulgare (XIXe siècle)');

created += 8;
console.log(`  → ${created} généalogies roses`);

// ═══════════════════════════════════════════════════════════════════════════
// LAVANDES — Famille Lamiaceae, Genre Lavandula
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n💜 LAVANDES');

// Trouver les lavandes existantes
const [lavAngRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} = 'Lavandula angustifolia' LIMIT 1`
);
const lavAngustifoliaId = lavAngRows.length > 0 ? lavAngRows[0].id :
  await getOrCreatePlant('Lavande vraie', 'Lavandula angustifolia', 'aromatique');

const [lavLatRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} = 'Lavandula latifolia' LIMIT 1`
);
const lavLatifoliaId = lavLatRows.length > 0 ? lavLatRows[0].id :
  await getOrCreatePlant('Lavande aspic', 'Lavandula latifolia', 'aromatique');

const [lavIntRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} LIKE '%intermedia%' LIMIT 1`
);
const lavIntermediaId = lavIntRows.length > 0 ? lavIntRows[0].id :
  await getOrCreatePlant('Lavandin', 'Lavandula × intermedia', 'aromatique');

// Lavandula × intermedia = L. angustifolia × L. latifolia
await addGenealogy(lavIntermediaId, lavAngustifoliaId, 'hybrid',
  'Lavandula × intermedia (Lavandin) est un hybride naturel et cultivé de L. angustifolia et L. latifolia. Stérile (triploïde). Profil : linalol (25-38%), acétate de linalyle (25-45%), camphre (6-12%), 1,8-cinéole (5-10%). Rendement en HE 3-5× supérieur à la lavande vraie. Cultivars : Grosso, Super, Abrialis. Source : Upson & Andrews (2004), The Genus Lavandula.',
  'Hybridation naturelle (Provence, altitude 400-700m)');

await addGenealogy(lavIntermediaId, lavLatifoliaId, 'hybrid',
  'Contribution de Lavandula latifolia (aspic) dans le génome du lavandin. Apporte le camphre et le 1,8-cinéole, donnant au lavandin son caractère plus camphrée par rapport à la lavande vraie. Source : Upson & Andrews (2004).',
  'Hybridation naturelle');

// Sous-espèce pyrénéenne
const lavPyrenaica = await getOrCreatePlant('Lavande des Pyrénées', 'Lavandula angustifolia subsp. pyrenaica', 'aromatique');
await addGenealogy(lavPyrenaica, lavAngustifoliaId, 'clone',
  'Sous-espèce pyrénéenne de Lavandula angustifolia. Profil : linalol plus élevé (45-55%), moins d\'acétate de linalyle. Altitude : 800-1800m. Utilisée en parfumerie de niche pour ses notes plus fraîches et herbacées. Statut : endémique des Pyrénées franco-espagnoles.',
  null);

// Cultivar Grosso
const lavGrosso = await getOrCreatePlant('Lavandin Grosso', 'Lavandula × intermedia "Grosso"', 'aromatique');
await addGenealogy(lavGrosso, lavIntermediaId, 'clone',
  'Cultivar Grosso : le lavandin le plus cultivé au monde (70% de la production française). Sélectionné pour son rendement exceptionnel (120-150 kg HE/ha). Profil : linalol (30-38%), acétate de linalyle (28-38%), camphre (8-12%). Utilisé principalement en parfumerie industrielle et cosmétique. Source : CRIEPPAM (Centre de Recherche et d\'Expérimentation en Plantes à Parfum, Aromatiques et Médicinales).',
  'Sélection provençale (années 1970)');

// Lavandula stoechas (espèce distincte)
const lavStoechas = await getOrCreatePlant('Lavande stoechade', 'Lavandula stoechas', 'aromatique');
// Pas de généalogie directe avec L. angustifolia — espèce distincte de la section Stoechas

created += 4;
console.log(`  → ${created} généalogies lavandes`);

// ═══════════════════════════════════════════════════════════════════════════
// JASMIN — Famille Oleaceae, Genre Jasminum
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n🌸 JASMIN');

const [jasmGrandRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} LIKE '%grandiflorum%' LIMIT 1`
);
const jasmGrandiflorumId = jasmGrandRows.length > 0 ? jasmGrandRows[0].id :
  await getOrCreatePlant('Jasmin grandiflorum', 'Jasminum grandiflorum', 'fleur');

const [jasmSambRows] = await conn.execute(
  `SELECT id FROM plants WHERE ${latinField} LIKE '%sambac%' LIMIT 1`
);
const jasmSambacId = jasmSambRows.length > 0 ? jasmSambRows[0].id :
  await getOrCreatePlant('Jasmin sambac', 'Jasminum sambac', 'fleur');

const jasmOfficinale = await getOrCreatePlant('Jasmin commun', 'Jasminum officinale', 'fleur');
const jasmPolyanthum = await getOrCreatePlant('Jasmin polyanthum', 'Jasminum polyanthum', 'fleur');

// J. grandiflorum dérive de J. officinale
await addGenealogy(jasmGrandiflorumId, jasmOfficinale, 'parent',
  'Jasminum grandiflorum (jasmin de Grasse, jasmin d\'Espagne) est considéré comme une sous-espèce ou variété de J. officinale. Profil absolue : acétate de benzyle (18-28%), linalol (12-20%), phényléthanol (8-15%), indole (2.5-3.5%), jasmone (1-3%). Cultivé à Grasse, en Égypte, en Inde (Madurai). Source : Arctander (1960), Perfume and Flavor Materials of Natural Origin.',
  'Sélection méditerranéenne (Grasse, XVIIe siècle)');

// J. sambac — espèce distincte d'Asie du Sud
await addGenealogy(jasmSambacId, jasmOfficinale, 'parent',
  'Jasminum sambac (jasmin d\'Arabie, mogra) est apparenté à J. officinale mais constitue une espèce distincte originaire d\'Asie du Sud. Profil différent : acétate de benzyle (25-35%), linalol (10-18%), benzyl alcool (5-12%), indole (3-5%), méthyl jasmonate (0.5-2%). Fleur nationale des Philippines. Utilisé en thé au jasmin (Chine). Source : Burdock (2010), Fenaroli\'s Handbook.',
  null);

// Cultivar Maid of Orleans
const jasmMaidOrleans = await getOrCreatePlant('Jasmin Maid of Orleans', 'Jasminum sambac "Maid of Orleans"', 'fleur');
await addGenealogy(jasmMaidOrleans, jasmSambacId, 'clone',
  'Cultivar "Maid of Orleans" de J. sambac : fleurs simples, très parfumées. Profil plus riche en indole (4-6%) et méthyl anthranilate (1-2%). Cultivé principalement aux Philippines, en Inde (Tamil Nadu) et en Égypte pour l\'extraction d\'absolue.',
  'Sélection asiatique');

// J. polyanthum
await addGenealogy(jasmPolyanthum, jasmOfficinale, 'hybrid',
  'Jasminum polyanthum est un hybride naturel apparenté à J. officinale. Profil : linalol dominant (35-45%), acétate de benzyle (15-25%). Moins utilisé en parfumerie industrielle mais apprécié en parfumerie naturelle pour ses notes plus fraîches. Originaire du Yunnan (Chine).',
  'Hybridation naturelle (Yunnan, Chine)');

created += 4;
console.log(`  → ${created} généalogies jasmin`);

// ═══════════════════════════════════════════════════════════════════════════
// AGRUMES — Néroli et Bigaradier
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n🍊 AGRUMES');

const citrusAurantiumId = await getOrCreatePlant('Bigaradier', 'Citrus aurantium', 'autre');
const citrusSinensis = await getOrCreatePlant('Oranger doux', 'Citrus sinensis', 'autre');
const citrusMaxima = await getOrCreatePlant('Pomelo', 'Citrus maxima', 'autre');
const citrusReticulata = await getOrCreatePlant('Mandarinier', 'Citrus reticulata', 'autre');

// Citrus aurantium = C. maxima × C. reticulata
await addGenealogy(citrusAurantiumId, citrusMaxima, 'hybrid',
  'Citrus aurantium (bigaradier, oranger amer) est un hybride naturel de C. maxima (pomelo) et C. reticulata (mandarine). Origine : Asie du Sud-Est. Donne 3 matières premières olfactives : néroli (fleurs), petitgrain bigarade (feuilles/rameaux), essence de bigarade (zeste). Profil néroli : linalol (30-40%), acétate de linalyle (4-8%), limonène (8-15%), β-pinène (10-15%). Source : Curk et al. (2016), Nature Plants.',
  'Hybridation naturelle (Asie du Sud-Est)');

await addGenealogy(citrusAurantiumId, citrusReticulata, 'hybrid',
  'Contribution de Citrus reticulata (mandarine) dans le génome du bigaradier. Apporte les notes fruitées et la richesse en méthyl N-méthyl anthranilate.',
  'Hybridation naturelle');

await addGenealogy(citrusSinensis, citrusMaxima, 'hybrid',
  'Citrus sinensis (oranger doux) est génétiquement très proche de C. aurantium, tous deux issus du croisement C. maxima × C. reticulata. Sélectionné pour ses fruits sucrés. Profil zeste : limonène dominant (90-95%), linalol (0.5-1%), décanal (0.3-0.5%). Source : Curk et al. (2016).',
  'Sélection humaine (Chine, ~2500 av. J.-C.)');

created += 3;

// ═══════════════════════════════════════════════════════════════════════════
// YLANG-YLANG et VÉTIVER
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n🌺 YLANG-YLANG & VÉTIVER');

const canangaOdorataId = await getOrCreatePlant('Ylang-ylang', 'Cananga odorata', 'fleur');
const canangaFruticosa = await getOrCreatePlant('Ylang-ylang compact', 'Cananga odorata var. fruticosa', 'fleur');

await addGenealogy(canangaFruticosa, canangaOdorataId, 'clone',
  'Cananga odorata var. fruticosa (ylang-ylang compact, chénanga) est une variété arbustive de C. odorata. Profil légèrement différent : moins de benzyl acétate, plus de linalol. Cultivée principalement à Mayotte et aux Comores. La distillation fractionnée de C. odorata donne les grades Extra, I, II, III et Complete. Source : Bauer et al. (2001), Common Fragrance and Flavor Materials.',
  'Sélection horticole (Comores, XIXe siècle)');

const vetiverId = await getOrCreatePlant('Vétiver', 'Chrysopogon zizanioides', 'racine');
const vetiveriOld = await getOrCreatePlant('Vétiver (syn.)', 'Vetiveria zizanioides', 'racine');

await addGenealogy(vetiverId, vetiveriOld, 'clone',
  'Chrysopogon zizanioides est le nom scientifique actuel du vétiver, anciennement classé sous Vetiveria zizanioides (reclassification APG III, 2009). Graminée originaire d\'Inde (Tamil Nadu). Profil HE : khusimol (5-15%), α-vetivone (3-8%), β-vetivone (2-6%), isovalencenol (2-5%). Terroirs : Haïti (bourbon), Java, Sri Lanka, Réunion. Source : Maffei (2002), Vetiveria: The Genus Vetiveria.',
  null);

const vetiverHaiti = await getOrCreatePlant('Vétiver de Haïti', 'Chrysopogon zizanioides (écotype Haïti)', 'racine');
await addGenealogy(vetiverHaiti, vetiverId, 'clone',
  'Écotype haïtien de Chrysopogon zizanioides (vétiver bourbon). Profil distinct : khusimol plus élevé (12-18%), notes terreuses et fumées plus prononcées. Haïti produit ~60% de l\'huile de vétiver mondiale. Cultivé principalement dans le département du Sud (Aquin, Saint-Louis du Sud). Source : Lacoste et al. (2012), Flavour and Fragrance Journal.',
  null);

created += 3;

// ─── Résumé final ────────────────────────────────────────────────────────────
const [total] = await conn.execute('SELECT COUNT(*) as n FROM variety_genealogy');
console.log(`\n✅ Généalogies créées cette session : ${created}`);
console.log(`✅ Total généalogies en base : ${total[0].n}`);

await conn.end();
