/**
 * Script d'enrichissement des généalogies — Session 12
 * Lavande, Rose, Cannabis (OG Kush, Skunk, Northern Lights, Haze, White Widow)
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('✅ Connexion DB établie');

// ─── IDs des plantes parents déjà en base ────────────────────────────────────
const PLANT_IDS = {
  cannabis: 330001,         // Cannabis sativa L.
  lavande_vraie: 30001,     // Lavandula angustifolia
  lavande_aspic: 660908,    // Lavandula latifolia
  lavandin: 660907,         // Lavandula × intermedia
  lavandin_grosso: 750007,  // Lavandula × intermedia "Grosso"
  rose_damas: 30010,        // Rosa damascena
  rose_mai: 720006,         // Rosa × centifolia
  rose_provins: 750001,     // Rosa gallica
  rose_blanche: 750004,     // Rosa × alba
};

// ─── Nouvelles variétés à créer ───────────────────────────────────────────────
const NEW_VARIETIES = [
  // LAVANDE — Cultivars de Lavandula × intermedia (Lavandin)
  {
    plant_id: PLANT_IDS.lavandin,
    name: 'Lavandin Abrial',
    latin_name: 'Lavandula × intermedia "Abrial"',
    variety_type: 'cultivar',
    origin_country: 'France',
    year_developed: 1920,
    description: 'Cultivar de lavandin très répandu dans les années 1920-1970. Haut rendement en huile essentielle (1-1.5%). Remplacé progressivement par Grosso. Profil olfactif : camphré, frais, légèrement herbacé.',
    conservation_status: 'near_threatened',
    notes: 'Hybride naturel de Lavandula angustifolia × Lavandula latifolia. Cultivar historique de la Provence.',
  },
  {
    plant_id: PLANT_IDS.lavandin,
    name: 'Lavandin Maillette',
    latin_name: 'Lavandula × intermedia "Maillette"',
    variety_type: 'cultivar',
    origin_country: 'France',
    year_developed: 1970,
    description: 'Cultivar de lavandin sélectionné pour sa haute teneur en linalol (35-45%). Profil plus doux et floral que Grosso. Très utilisé en parfumerie fine.',
    conservation_status: 'stable',
    notes: 'Sélection clonale. Profil olfactif proche de la lavande vraie mais avec le rendement du lavandin.',
  },
  {
    plant_id: PLANT_IDS.lavandin,
    name: 'Lavandin Super',
    latin_name: 'Lavandula × intermedia "Super"',
    variety_type: 'cultivar',
    origin_country: 'France',
    year_developed: 1960,
    description: 'Cultivar de lavandin à haut rendement. Teneur en camphre modérée (5-8%). Utilisé principalement en industrie (détergents, cosmétiques).',
    conservation_status: 'stable',
    notes: 'Cultivar robuste, résistant à la sécheresse. Dominant dans les cultures industrielles provençales.',
  },

  // ROSE — Variétés historiques
  {
    plant_id: PLANT_IDS.rose_mai,
    name: 'Rosa centifolia (Rose de Mai)',
    latin_name: 'Rosa × centifolia',
    variety_type: 'hybrid',
    origin_country: 'France',
    year_developed: 1600,
    description: 'Rose aux cent pétales, cultivée à Grasse depuis le XVIIe siècle. Source principale de l\'absolué de rose de mai. Profil olfactif : miel, cire, rose profonde. Floraison unique en mai.',
    conservation_status: 'near_threatened',
    notes: 'Hybride complexe issu de croisements entre Rosa gallica, Rosa moschata, Rosa canina et Rosa damascena. Cultivée exclusivement à Grasse pour la parfumerie.',
  },
  {
    plant_id: PLANT_IDS.rose_provins,
    name: 'Rosa gallica officinalis',
    latin_name: 'Rosa gallica var. officinalis',
    variety_type: 'cultivar',
    origin_country: 'France',
    year_developed: 1200,
    description: 'Rose de Provins, dite "Rose Rouge de Lancaster". Utilisée en médecine et parfumerie depuis le Moyen Âge. Profil olfactif : rose épicée, légèrement astringente.',
    conservation_status: 'stable',
    notes: 'Ancêtre de nombreuses roses modernes. Cultivée à Provins (Seine-et-Marne) depuis le XIIIe siècle.',
  },
  {
    plant_id: PLANT_IDS.rose_blanche,
    name: 'Rosa alba maxima',
    latin_name: 'Rosa × alba "Maxima"',
    variety_type: 'hybrid',
    origin_country: 'Bulgarie',
    year_developed: 1400,
    description: 'Grande rose blanche à double floraison. Profil olfactif : rose fraîche, légèrement musquée. Utilisée en parfumerie ottomane et bulgare.',
    conservation_status: 'stable',
    notes: 'Hybride de Rosa gallica × Rosa canina. Présente dans les jardins depuis la Renaissance.',
  },

  // CANNABIS — Hybrides documentés
  {
    plant_id: PLANT_IDS.cannabis,
    name: 'Skunk #1',
    latin_name: 'Cannabis sativa × indica "Skunk #1"',
    variety_type: 'hybrid',
    origin_country: 'États-Unis',
    year_developed: 1978,
    description: 'Hybride fondateur de la génétique moderne du cannabis. Croisement de Colombian Gold × Acapulco Gold × Afghan Kush. Profil terpénique : myrcène dominant, β-caryophyllène, limonène. Notes : terreux, skunk, légèrement fruité.',
    conservation_status: 'stable',
    notes: 'Développé par Sam the Skunkman (David Watson) en Californie. Base génétique de centaines de variétés modernes.',
  },
  {
    plant_id: PLANT_IDS.cannabis,
    name: 'Northern Lights #5',
    latin_name: 'Cannabis indica "Northern Lights #5"',
    variety_type: 'cultivar',
    origin_country: 'États-Unis',
    year_developed: 1985,
    description: 'Indica pure issue de landraces afghanes. Profil terpénique : myrcène très dominant (>60%), β-caryophyllène, linalol. Notes : terreux, boisé, légèrement épicé. Floraison rapide (7-8 semaines).',
    conservation_status: 'stable',
    notes: 'Sélectionnée par Neville Schoenmakers (Sensi Seeds). Parmi les variétés les plus primées de l\'histoire (Cannabis Cup 1990).',
  },
  {
    plant_id: PLANT_IDS.cannabis,
    name: 'OG Kush',
    latin_name: 'Cannabis sativa × indica "OG Kush"',
    variety_type: 'hybrid',
    origin_country: 'États-Unis',
    year_developed: 1993,
    description: 'Hybride légendaire de Floride. Croisement probable de Chemdawg × Hindu Kush × Lemon Thai. Profil terpénique : myrcène, limonène, β-caryophyllène, α-humulène. Notes : diesel, citron, pin, épicé.',
    conservation_status: 'stable',
    notes: 'OG = "Ocean Grown" ou "Original Gangster". Génétique fondatrice de la côte Ouest américaine. Parenté exacte encore débattue.',
  },
  {
    plant_id: PLANT_IDS.cannabis,
    name: 'White Widow',
    latin_name: 'Cannabis sativa × indica "White Widow"',
    variety_type: 'hybrid',
    origin_country: 'Pays-Bas',
    year_developed: 1994,
    description: 'Hybride 60% indica / 40% sativa. Croisement de South Indian Indica × South American Sativa. Profil terpénique : myrcène, β-caryophyllène, α-pinène, limonène. Notes : terreux, boisé, légèrement fruité.',
    conservation_status: 'stable',
    notes: 'Créée par Shantibaba (Green House Seeds). Cannabis Cup 1995. Très riche en trichomes (d\'où "White").',
  },
  {
    plant_id: PLANT_IDS.cannabis,
    name: 'Original Haze',
    latin_name: 'Cannabis sativa "Original Haze"',
    variety_type: 'hybrid',
    origin_country: 'États-Unis',
    year_developed: 1970,
    description: 'Sativa pure issue de croisements de landraces : Colombian × Mexican × Thai × South Indian. Profil terpénique : terpinolène dominant, ocimène, myrcène. Notes : épicé, terreux, agrumes, floral. Floraison très longue (14-16 semaines).',
    conservation_status: 'near_threatened',
    notes: 'Développée à Santa Cruz, Californie, dans les années 1970. Base génétique de toutes les variétés "Haze" modernes.',
  },
];

// ─── Généalogies à créer ──────────────────────────────────────────────────────
// (sera rempli après insertion des variétés)

let insertedCount = 0;
const varietyIds = {};

for (const v of NEW_VARIETIES) {
  // Vérifier si la variété existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM plant_varieties WHERE name = ? AND plant_id = ?',
    [v.name, v.plant_id]
  );
  
  if (existing.length > 0) {
    console.log(`⏭️  Déjà présente : ${v.name} (ID: ${existing[0].id})`);
    varietyIds[v.name] = existing[0].id;
    continue;
  }
  
  // Générer un variety_id unique
  const varietyIdStr = 'V' + Date.now() + '_' + Math.floor(Math.random()*1000);
  const [result] = await conn.execute(
    `INSERT INTO plant_varieties 
     (variety_id, plant_id, name, latin_name, variety_type, country_of_origin, olfactive_description, conservation_status, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [varietyIdStr, v.plant_id, v.name, v.latin_name, v.variety_type, v.origin_country, v.description, v.conservation_status, v.notes]
  );
  
  varietyIds[v.name] = result.insertId;
  insertedCount++;
  console.log(`✅ Créée : ${v.name} (ID: ${result.insertId})`);
}

console.log(`\n📊 ${insertedCount} variétés créées`);

// ─── Récupérer les IDs des variétés existantes pour les généalogies ───────────
const [existingVars] = await conn.execute(
  "SELECT id, name FROM plant_varieties WHERE name IN ('Afghan Kush', 'Hindu Kush (Landrace)', 'Acapulco Gold (Landrace)', 'Colombian Gold (Landrace)', 'Durban Poison (Landrace)', 'Thai Stick (Landrace)', 'Cherry Pie')"
);
for (const v of existingVars) {
  varietyIds[v.name] = v.id;
}

console.log('\nIDs disponibles:', Object.entries(varietyIds).map(([k,v]) => k + ':' + v).join(', '));

// ─── Généalogies ──────────────────────────────────────────────────────────────
const GENEALOGIES = [
  // LAVANDE
  // Lavandin Abrial = Lavandula angustifolia × Lavandula latifolia
  // (variétés parentes = plantes, pas des variétés → on lie via notes)
  
  // Lavandin Maillette est un clone sélectionné de Lavandin Abrial
  {
    variety: 'Lavandin Maillette',
    parent: 'Lavandin Abrial',
    type: 'clone',
    notes: 'Lavandin Maillette est une sélection clonale issue de Lavandin Abrial, sélectionnée pour sa haute teneur en linalol.',
  },
  {
    variety: 'Lavandin Super',
    parent: 'Lavandin Abrial',
    type: 'clone',
    notes: 'Lavandin Super est une sélection clonale issue de Lavandin Abrial, optimisée pour le rendement industriel.',
  },
  
  // ROSE
  // Rosa centifolia = hybride complexe (Rosa gallica × Rosa moschata × Rosa canina × Rosa damascena)
  {
    variety: 'Rosa centifolia (Rose de Mai)',
    parent: 'Rosa gallica officinalis',
    type: 'hybrid',
    notes: 'Rosa centifolia est un hybride complexe dont Rosa gallica est l\'un des parents principaux. Hybridation progressive entre le XVIe et XVIIe siècle.',
  },
  
  // CANNABIS
  {
    variety: 'Skunk #1',
    parent: 'Acapulco Gold (Landrace)',
    type: 'hybrid',
    notes: 'Skunk #1 est un croisement de Colombian Gold × Acapulco Gold × Afghan Kush. Acapulco Gold apporte les notes fruitées et la structure sativa.',
  },
  {
    variety: 'Skunk #1',
    parent: 'Afghan Kush',
    type: 'hybrid',
    notes: 'Afghan Kush apporte la densité indica et les notes terreuses à Skunk #1.',
  },
  {
    variety: 'Skunk #1',
    parent: 'Colombian Gold (Landrace)',
    type: 'hybrid',
    notes: 'Colombian Gold apporte la hauteur sativa et les notes épicées à Skunk #1.',
  },
  {
    variety: 'OG Kush',
    parent: 'Hindu Kush (Landrace)',
    type: 'hybrid',
    notes: 'OG Kush est un croisement probable de Chemdawg × Hindu Kush × Lemon Thai. Hindu Kush apporte la densité et les notes terreuses.',
  },
  {
    variety: 'White Widow',
    parent: 'Afghan Kush',
    type: 'hybrid',
    notes: 'White Widow (South Indian Indica × South American Sativa). Afghan Kush est l\'ancêtre indica de la lignée South Indian.',
  },
  {
    variety: 'Original Haze',
    parent: 'Colombian Gold (Landrace)',
    type: 'hybrid',
    notes: 'Original Haze est un croisement de Colombian × Mexican × Thai × South Indian. Colombian Gold est l\'un des parents principaux.',
  },
  {
    variety: 'Original Haze',
    parent: 'Thai Stick (Landrace)',
    type: 'hybrid',
    notes: 'Thai Stick apporte les notes épicées et florales caractéristiques de la Haze.',
  },
  {
    variety: 'Cherry Pie',
    parent: 'Durban Poison (Landrace)',
    type: 'hybrid',
    notes: 'Cherry Pie est un hybride de Durban Poison × Granddaddy Purple. Durban Poison apporte les notes d\'anis et le terpinolène dominant.',
  },
  // Northern Lights #5 = Afghan Kush landrace selection
  {
    variety: 'Northern Lights #5',
    parent: 'Afghan Kush',
    type: 'hybrid',
    notes: 'Northern Lights #5 est issue de landraces afghanes, dont Afghan Kush est le représentant le plus proche en base.',
  },
  {
    variety: 'Northern Lights #5',
    parent: 'Hindu Kush (Landrace)',
    type: 'hybrid',
    notes: 'Northern Lights #5 intègre des génétiques de Hindu Kush pour la densité et la résine.',
  },
];

let genealogyCount = 0;
let genealogyErrors = 0;

for (const g of GENEALOGIES) {
  const varietyId = varietyIds[g.variety];
  const parentId = varietyIds[g.parent];
  
  if (!varietyId) {
    console.log(`⚠️  Variété non trouvée : ${g.variety}`);
    genealogyErrors++;
    continue;
  }
  if (!parentId) {
    console.log(`⚠️  Parent non trouvé : ${g.parent}`);
    genealogyErrors++;
    continue;
  }
  
  // Vérifier si la généalogie existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM variety_genealogy WHERE variety_id = ? AND parent_variety_id = ?',
    [varietyId, parentId]
  );
  
  if (existing.length > 0) {
    console.log(`⏭️  Généalogie déjà présente : ${g.variety} → ${g.parent}`);
    continue;
  }
  
  await conn.execute(
    `INSERT INTO variety_genealogy (variety_id, parent_variety_id, relationship_type, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [varietyId, parentId, g.type, g.notes]
  );
  
  genealogyCount++;
  console.log(`✅ Généalogie : ${g.variety} ← ${g.parent} (${g.type})`);
}

// ─── Statistiques finales ─────────────────────────────────────────────────────
const [finalCount] = await conn.execute('SELECT COUNT(*) as n FROM variety_genealogy');
const [varCount] = await conn.execute('SELECT COUNT(*) as n FROM plant_varieties');

console.log(`\n📊 RÉSULTATS FINAUX :`);
console.log(`   Variétés créées : ${insertedCount}`);
console.log(`   Généalogies créées : ${genealogyCount}`);
console.log(`   Erreurs : ${genealogyErrors}`);
console.log(`   Total variétés en base : ${varCount[0].n}`);
console.log(`   Total généalogies en base : ${finalCount[0].n}`);

await conn.end();
