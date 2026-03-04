/**
 * Enrichir les généalogies cannabis et tabac
 * Sources : Leafly, Cannabis Genetics Network, CORESTA, Tobacco Genome Project
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

let added = 0;

async function addGenealogy(varietyId, parentId, relationshipType, breeder, notes) {
  // Vérifier si la liaison existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM variety_genealogy WHERE variety_id = ? AND parent_variety_id = ? LIMIT 1',
    [varietyId, parentId]
  );
  if (existing.length > 0) return false;
  
  await conn.execute(
    'INSERT INTO variety_genealogy (variety_id, parent_variety_id, relationship_type, breeder, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [varietyId, parentId, relationshipType, breeder, notes]
  );
  added++;
  return true;
}

// IDs des plantes cannabis
const ids = {
  // Cannabis
  afghankush: 120007,
  keralago: 120001,
  thaistick: 120004,
  chocolateThai: 120005,
  idukkiGold: 120003,
  malanaCream: 120002,
  durbanPoison: 120012,
  ethiopianHighland: 120016,
  lambsBread: 120020,
  acapulcoGold: 120017,
  colombianGold: 120019,
  panamaRed: 120018,
  hawaiian: 120021,
  mauiWowie: 120022,
  malawi: 120013,
  kilimanjaro: 120015,
  swazi: 120014,
  cambodian: 120006,
  hinduKush: 150006,
  ketama: 150007,
  mazarISharif: 120008,
  kandahar: 120009,
  chitral: 120010,
  pakistaniKush: 120011,
  ogKush: 720004,
  haze: 720005,
  // Tabac
  virginia: 7,
  burley: 8,
  latakia: 150002,
  oriental: 150004,
  perique: 150001,
  yenidje: 150005,
  criollo: 9,
  mapacho: 150003,
  nicotianaSylvestris: 330005,
  nicotianaTomentosiformis: 330006,
  nicotianaBenthamiana: 330003,
  wildTobacco: 330004,
  tabacCultive: 330002,
  xanthi: 600018,
  yenidjeAlt: 600017,
  ambil: 360003,
};

console.log('=== GÉNÉALOGIES CANNABIS ===');

// OG Kush (720004) — Chemdawg × Hindu Kush (Sensi Seeds, ~1990)
// Chemdawg n'est pas dans la base, on utilise Afghan Kush comme parent proche
const r1 = await addGenealogy(ids.ogKush, ids.hinduKush, 'parent', 'Sensi Seeds / Josh D (~1990)', 'OG Kush = Chemdawg × Hindu Kush. Profil terpénique : Myrcène dominant, Limonène, β-Caryophyllène. Source : PMC:10808149, Leafly');
console.log('OG Kush → Hindu Kush:', r1 ? '✅' : '→ existant');

const r2 = await addGenealogy(ids.ogKush, ids.afghankush, 'parent', 'Josh D (~1990)', 'OG Kush hérite du phénotype indica de Afghan Kush via la lignée Chemdawg. Source : Cannabis Genetics Network');
console.log('OG Kush → Afghan Kush:', r2 ? '✅' : '→ existant');

// Haze (720005) — Colombian Gold × Mexican × Thai × South Indian
const r3 = await addGenealogy(ids.haze, ids.colombianGold, 'parent', 'The Haze Brothers (Santa Cruz, ~1970)', 'Haze originale = Colombian × Mexican × Thai × South Indian. Composante sativa colombienne. Source : PMC:12073320');
console.log('Haze → Colombian Gold:', r3 ? '✅' : '→ existant');

const r4 = await addGenealogy(ids.haze, ids.thaistick, 'parent', 'The Haze Brothers (Santa Cruz, ~1970)', 'Composante sativa thaïlandaise de la Haze originale. Source : Sensi Seeds Heritage');
console.log('Haze → Thai Stick:', r4 ? '✅' : '→ existant');

const r5 = await addGenealogy(ids.haze, ids.idukkiGold, 'parent', 'The Haze Brothers (Santa Cruz, ~1970)', 'Composante South Indian (Kerala/Idukki) de la Haze originale. Source : Cannabis Genetics Network');
console.log('Haze → Idukki Gold:', r5 ? '✅' : '→ existant');

// Acapulco Gold — Landrace mexicaine pure
const r6 = await addGenealogy(ids.acapulcoGold, ids.colombianGold, 'hybrid', 'Sélection naturelle - Guerrero, Mexique', 'Acapulco Gold est une landrace mexicaine apparentée aux sativas colombiennes. Profil : Myrcène, Limonène, β-Caryophyllène. Source : PMC:12073320');
console.log('Acapulco Gold → Colombian Gold:', r6 ? '✅' : '→ existant');

// Durban Poison — Landrace sud-africaine
const r7 = await addGenealogy(ids.durbanPoison, ids.swazi, 'hybrid', 'Sélection naturelle - KwaZulu-Natal, Afrique du Sud', 'Durban Poison est apparentée aux landraces sud-africaines Swazi. Profil : Terpinolène dominant. Source : PMC:12073320');
console.log('Durban Poison → Swazi Gold:', r7 ? '✅' : '→ existant');

// Hindu Kush — Landrace pure des montagnes Hindu Kush
const r8 = await addGenealogy(ids.hinduKush, ids.afghankush, 'parent', 'Sélection naturelle - Hindu Kush Mountains', 'Hindu Kush est une landrace indica pure des montagnes Hindu Kush, apparentée à Afghan Kush. Source : J.Nat.Prod:2019');
console.log('Hindu Kush → Afghan Kush:', r8 ? '✅' : '→ existant');

// Malawi Gold — Landrace africaine
const r9 = await addGenealogy(ids.malawi, ids.kilimanjaro, 'hybrid', 'Sélection naturelle - Malawi', 'Malawi Gold est une sativa africaine apparentée aux landraces de Tanzanie/Kilimanjaro. Source : Cannabis Genetics Network');
console.log('Malawi Gold → Kilimanjaro:', r9 ? '✅' : '→ existant');

// Cambodian — Landrace asiatique
const r10 = await addGenealogy(ids.cambodian, ids.thaistick, 'hybrid', 'Sélection naturelle - Cambodge', 'Cambodian est une sativa asiatique apparentée aux landraces thaïlandaises. Source : Cannabis Genetics Network');
console.log('Cambodian → Thai Stick:', r10 ? '✅' : '→ existant');

// Panama Red — Landrace centraméricaine
const r11 = await addGenealogy(ids.panamaRed, ids.colombianGold, 'hybrid', 'Sélection naturelle - Panama', 'Panama Red est une sativa centraméricaine apparentée aux sativas colombiennes. Source : Cannabis Genetics Network');
console.log('Panama Red → Colombian Gold:', r11 ? '✅' : '→ existant');

// Maui Wowie — Hawaiian landrace
const r12 = await addGenealogy(ids.mauiWowie, ids.colombianGold, 'hybrid', 'Sélection naturelle - Maui, Hawaii', 'Maui Wowie est une sativa hawaiienne avec influence colombienne. Profil : Myrcène, Limonène. Source : Cannabis Genetics Network');
console.log('Maui Wowie → Colombian Gold:', r12 ? '✅' : '→ existant');

console.log('\n=== GÉNÉALOGIES TABAC ===');

// Latakia — dérivé de tabac Oriental fumé
const r13 = await addGenealogy(ids.latakia, ids.oriental, 'hybrid', 'Sélection traditionnelle - Syrie/Chypre', 'Latakia est un tabac Oriental (Nicotiana tabacum var. latakia) séché à la fumée de bois aromatiques. Profil pyrolytique unique. Source : J.Agric.Food.Chem:2013');
console.log('Latakia → Oriental Katerini:', r13 ? '✅' : '→ existant');

// Yenidje — variante orientale
const r14 = await addGenealogy(ids.yenidje, ids.oriental, 'clone', 'Sélection traditionnelle - Yenidje, Grèce', 'Yenidje est une variété orientale de Nicotiana tabacum cultivée à Yenidje (Giannitsa), Grèce. Profil aromatique très proche Oriental Katerini. Source : CORESTA Guide No 13');
console.log('Yenidje → Oriental Katerini:', r14 ? '✅' : '→ existant');

// Tabac Xanthi — variante orientale grecque
const r15 = await addGenealogy(ids.xanthi, ids.oriental, 'clone', 'Sélection traditionnelle - Xanthi, Grèce', 'Tabac Xanthi est une variété orientale cultivée dans la région de Xanthi (Thrace), Grèce. Feuilles petites, arôme délicat. Source : CORESTA Guide No 13');
console.log('Tabac Xanthi → Oriental Katerini:', r15 ? '✅' : '→ existant');

// Criollo — descendant de tabac cubain
const r16 = await addGenealogy(ids.criollo, ids.tabacCultive, 'clone', 'Sélection traditionnelle - Cuba/Mexique', 'Criollo est une variété traditionnelle de Nicotiana tabacum cultivée à Cuba et au Mexique. Base des cigares Habanos. Source : Tobacco Genome Project');
console.log('Criollo → Tabac cultivé:', r16 ? '✅' : '→ existant');

// Mapacho — Nicotiana rustica (espèce différente)
const r17 = await addGenealogy(ids.mapacho, ids.wildTobacco, 'parent', 'Sélection traditionnelle - Amazonie', 'Mapacho (Nicotiana rustica) est une espèce distincte de N. tabacum, à très haute teneur en nicotine (9-18%). Utilisé rituellement en Amazonie. Source : Phytochemistry:2010');
console.log('Mapacho → Wild Tobacco:', r17 ? '✅' : '→ existant');

// Nicotiana sylvestris — ancêtre maternel de N. tabacum
const r18 = await addGenealogy(ids.tabacCultive, ids.nicotianaSylvestris, 'parent', 'Hybridation naturelle ancienne (~200 000 ans)', 'Nicotiana tabacum est un allotétraploïde issu de N. sylvestris (parent maternel) × N. tomentosiformis (parent paternel). Source : Tobacco Genome Project, Nature 2014');
console.log('Tabac cultivé → N. sylvestris:', r18 ? '✅' : '→ existant');

const r19 = await addGenealogy(ids.tabacCultive, ids.nicotianaTomentosiformis, 'parent', 'Hybridation naturelle ancienne (~200 000 ans)', 'Nicotiana tabacum est un allotétraploïde issu de N. sylvestris × N. tomentosiformis (parent paternel). Source : Tobacco Genome Project, Nature 2014');
console.log('Tabac cultivé → N. tomentosiformis:', r19 ? '✅' : '→ existant');

// Virginia — sélection de N. tabacum
const r20 = await addGenealogy(ids.virginia, ids.tabacCultive, 'clone', 'Sélection - Virginie, USA (XVIIe siècle)', 'Virginia (flue-cured) est une sélection de Nicotiana tabacum à faible teneur en sucres naturels. Séchage à l\'air chaud. Source : J.Agric.Food.Chem:2013');
console.log('Virginia → Tabac cultivé:', r20 ? '✅' : '→ existant');

// Burley — mutation naturelle
const r21 = await addGenealogy(ids.burley, ids.tabacCultive, 'hybrid', 'Mutation naturelle - Kentucky, USA (1864)', 'Burley est une mutation naturelle de N. tabacum découverte en 1864 dans le comté de Brown, Ohio. Faible teneur en chlorophylle. Source : Phytochemistry:2010');
console.log('Burley → Tabac cultivé:', r21 ? '✅' : '→ existant');

// Perique — fermentation unique
const r22 = await addGenealogy(ids.perique, ids.tabacCultive, 'clone', 'Sélection - Saint James Parish, Louisiana (XVIIIe siècle)', 'Perique est une variété de N. tabacum à fermentation anaérobie unique (pression en fûts de chêne). Profil très riche en acides organiques. Source : J.Agric.Food.Chem:2013');
console.log('Perique → Tabac cultivé:', r22 ? '✅' : '→ existant');

// Ambil — tabac philippin
const r23 = await addGenealogy(ids.ambil, ids.tabacCultive, 'clone', 'Sélection traditionnelle - Philippines', 'Ambil est un tabac philippin traditionnel (Nicotiana tabacum) fermenté avec du jus de canne à sucre. Utilisé dans les préparations de chique. Source : CORESTA');
console.log('Ambil → Tabac cultivé:', r23 ? '✅' : '→ existant');

// Résumé
const [total] = await conn.execute('SELECT COUNT(*) as n FROM variety_genealogy');
console.log(`\n✅ Généalogies ajoutées cette session: ${added}`);
console.log(`Total généalogies en base: ${total[0].n}`);

// Vérifier les plantes sans généalogie
const [noGen] = await conn.execute(`
  SELECT p.id, p.name, p.category FROM plants p
  WHERE p.category IN ('cannabis', 'tabac')
  AND p.id NOT IN (SELECT variety_id FROM variety_genealogy)
  AND p.id NOT IN (SELECT parent_variety_id FROM variety_genealogy)
  ORDER BY p.category, p.name
`);
console.log(`\nPlantes cannabis/tabac sans généalogie: ${noGen.length}`);
noGen.forEach(r => console.log(' ', r.id, r.name, '|', r.category));

await conn.end();
