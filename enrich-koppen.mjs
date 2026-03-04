import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Étape 1 : Table de référence Köppen par genre (depuis plantes déjà enrichies) ─
const [enriched] = await conn.execute(`
  SELECT latin_name, koppen_zone, family
  FROM plants 
  WHERE koppen_zone IS NOT NULL AND koppen_zone != ''
  AND latin_name IS NOT NULL AND latin_name != ''
`);

const genreMap = {};
for (const r of enriched) {
  const genre = r.latin_name.split(' ')[0];
  if (!genreMap[genre]) genreMap[genre] = [];
  genreMap[genre].push(r.koppen_zone);
}

// Trouver le Köppen le plus fréquent par genre
const genreKoppen = {};
for (const [genre, zones] of Object.entries(genreMap)) {
  const freq = {};
  for (const z of zones) { freq[z] = (freq[z] || 0) + 1; }
  const best = Object.entries(freq).sort((a,b) => b[1]-a[1])[0];
  genreKoppen[genre] = best[0];
}
console.log(`Genres de référence: ${Object.keys(genreKoppen).length}`);

// ─── Étape 2 : Table de référence Köppen par famille ─────────────────────────────
const familyMap = {};
for (const r of enriched) {
  const fam = r.family || '';
  if (!fam) continue;
  if (!familyMap[fam]) familyMap[fam] = [];
  familyMap[fam].push(r.koppen_zone);
}
const familyKoppen = {};
for (const [fam, zones] of Object.entries(familyMap)) {
  const freq = {};
  for (const z of zones) { freq[z] = (freq[z] || 0) + 1; }
  const best = Object.entries(freq).sort((a,b) => b[1]-a[1])[0];
  familyKoppen[fam] = best[0];
}
console.log(`Familles de référence: ${Object.keys(familyKoppen).length}`);

// ─── Étape 3 : Table de référence Köppen par origine ─────────────────────────────
// Zones Köppen par région géographique connue
const originKoppen = {
  'Burkina Faso': 'BSh',
  'Afrique de l\'Ouest': 'Aw',
  'Afrique subsaharienne': 'Aw',
  'Afrique tropicale': 'Af',
  'Afrique du Nord': 'BWh',
  'Afrique du Sud': 'Csa',
  'Afrique centrale': 'Af',
  'Afrique orientale': 'Aw',
  'Amazonie': 'Af',
  'Amérique centrale': 'Aw',
  'Amérique du Sud': 'Af',
  'Mexique': 'Aw',
  'Mexique, Amérique centrale': 'Aw',
  'Asie du Sud-Est': 'Af',
  'Asie tropicale': 'Af',
  'Inde': 'Aw',
  'Inde, Asie du Sud-Est': 'Af',
  'Chine': 'Cfa',
  'Japon': 'Cfa',
  'Méditerranée': 'Csa',
  'Europe': 'Cfb',
  'Moyen-Orient': 'BWh',
  'Australie': 'Aw',
  'Madagascar': 'Aw',
  'Indonésie': 'Af',
  'Philippines': 'Af',
  'Brésil': 'Af',
  'Colombie': 'Af',
  'Pérou': 'Af',
  'Équateur': 'Af',
  'Haïti': 'Aw',
  'Caraïbes': 'Aw',
  'Réunion': 'Af',
  'Sri Lanka': 'Af',
  'Himalaya': 'Dfc',
  'Tibet': 'BWk',
  'Maroc': 'Csa',
  'Éthiopie': 'Aw',
  'Somalie': 'BWh',
  'Yémen': 'BWh',
  'Oman': 'BWh',
  'Arabie Saoudite': 'BWh',
  'Iran': 'BSk',
  'Turquie': 'Csa',
  'Grèce': 'Csa',
  'Espagne': 'Csa',
  'France': 'Cfb',
  'Balkans': 'Cfa',
  'Russie': 'Dfb',
  'Canada': 'Dfb',
  'États-Unis': 'Cfa',
  'Floride': 'Cfa',
  'Californie': 'Csa',
  'Nouvelle-Zélande': 'Cfb',
  'Papouasie': 'Af',
  'Afrique de l\'Est': 'Aw',
  'Tanzanie': 'Aw',
  'Kenya': 'Aw',
  'Nigeria': 'Aw',
  'Ghana': 'Aw',
  'Sénégal': 'BSh',
  'Mali': 'BSh',
  'Niger': 'BWh',
  'Tchad': 'BSh',
  'Cameroun': 'Af',
  'Congo': 'Af',
  'Gabon': 'Af',
  'Côte d\'Ivoire': 'Aw',
  'Guinée': 'Aw',
  'Togo': 'Aw',
  'Bénin': 'Aw',
  'Mozambique': 'Aw',
  'Zimbabwe': 'Aw',
  'Zambie': 'Aw',
  'Angola': 'Aw',
  'Namibie': 'BWh',
  'Botswana': 'BSh',
  'Malawi': 'Aw',
  'Ouganda': 'Af',
  'Rwanda': 'Af',
  'Burundi': 'Af',
  'Soudan': 'BWh',
  'Érythrée': 'BWh',
  'Djibouti': 'BWh',
  'Liberia': 'Af',
  'Sierra Leone': 'Af',
  'Guinée-Bissau': 'Aw',
  'Gambie': 'BSh',
  'Mauritanie': 'BWh',
  'Algérie': 'BWh',
  'Tunisie': 'Csa',
  'Libye': 'BWh',
  'Égypte': 'BWh',
  'Jordanie': 'BWh',
  'Liban': 'Csa',
  'Syrie': 'BSk',
  'Irak': 'BWh',
  'Pakistan': 'BWh',
  'Afghanistan': 'BSk',
  'Népal': 'Cwa',
  'Bangladesh': 'Aw',
  'Myanmar': 'Af',
  'Thaïlande': 'Af',
  'Vietnam': 'Af',
  'Cambodge': 'Aw',
  'Laos': 'Aw',
  'Malaisie': 'Af',
  'Singapour': 'Af',
  'Brunei': 'Af',
  'Timor oriental': 'Aw',
  'Taïwan': 'Cfa',
  'Corée': 'Dwa',
  'Mongolie': 'BSk',
  'Sibérie': 'Dfc',
};

// ─── Étape 4 : Table de référence par catégorie olfactive ────────────────────────
const categoryKoppen = {
  'agrume': 'Csa',
  'Agrume': 'Csa',
  'aromatique': 'Csa',
  'Aromatique': 'Csa',
  'boisé': 'Cfb',
  'Boisé': 'Cfb',
  'fleur': 'Cfa',
  'Fleur': 'Cfa',
  'résine': 'Csa',
  'Résine': 'Csa',
  'épice': 'Af',
  'Épice': 'Af',
  'graine': 'Aw',
  'Graine': 'Aw',
  'racine': 'Aw',
  'Racine': 'Aw',
  'mousse': 'Cfb',
  'Mousse': 'Cfb',
  'animal': 'Aw',
  'Animal': 'Aw',
  'marin': 'Cfb',
  'Marin': 'Cfb',
  'tabac': 'Cfa',
  'Tabac': 'Cfa',
  'cannabis': 'Cfa',
  'Cannabis': 'Cfa',
};

// ─── Étape 5 : Enrichir les 191 plantes ─────────────────────────────────────────
const [toEnrich] = await conn.execute(`
  SELECT id, name, latin_name, family, category, origin
  FROM plants 
  WHERE (koppen_zone IS NULL OR koppen_zone = '')
`);

console.log(`\nPlantes à enrichir: ${toEnrich.length}`);

let enrichedCount = 0;
let byGenre = 0, byFamily = 0, byOrigin = 0, byCategory = 0, byDefault = 0;

for (const plant of toEnrich) {
  let koppen = null;
  let method = '';

  // 1. Par genre botanique (nom latin)
  if (plant.latin_name) {
    const genre = plant.latin_name.split(' ')[0];
    if (genreKoppen[genre]) {
      koppen = genreKoppen[genre];
      method = 'genre';
      byGenre++;
    }
  }

  // 2. Par famille botanique
  if (!koppen && plant.family && familyKoppen[plant.family]) {
    koppen = familyKoppen[plant.family];
    method = 'famille';
    byFamily++;
  }

  // 3. Par origine géographique
  if (!koppen && plant.origin) {
    // Chercher une correspondance dans originKoppen
    for (const [orig, zone] of Object.entries(originKoppen)) {
      if (plant.origin.includes(orig) || orig.includes(plant.origin)) {
        koppen = zone;
        method = 'origine';
        byOrigin++;
        break;
      }
    }
  }

  // 4. Par catégorie olfactive
  if (!koppen && plant.category && categoryKoppen[plant.category]) {
    koppen = categoryKoppen[plant.category];
    method = 'catégorie';
    byCategory++;
  }

  // 5. Valeur par défaut (tropical humide - majoritaire dans la base)
  if (!koppen) {
    koppen = 'Aw';
    method = 'défaut';
    byDefault++;
  }

  // Mettre à jour la base
  await conn.execute(
    'UPDATE plants SET koppen_zone = ? WHERE id = ?',
    [koppen, plant.id]
  );
  enrichedCount++;
}

console.log(`\nEnrichissement terminé: ${enrichedCount} plantes`);
console.log(`  Par genre:     ${byGenre}`);
console.log(`  Par famille:   ${byFamily}`);
console.log(`  Par origine:   ${byOrigin}`);
console.log(`  Par catégorie: ${byCategory}`);
console.log(`  Par défaut:    ${byDefault}`);

// ─── Vérification finale ──────────────────────────────────────────────────────────
const [check] = await conn.execute(`
  SELECT COUNT(*) as total,
    SUM(CASE WHEN koppen_zone IS NOT NULL AND koppen_zone != '' THEN 1 ELSE 0 END) as with_koppen
  FROM plants
`);
const total = check[0].total;
const withKoppen = check[0].with_koppen;
console.log(`\nCouverture finale: ${withKoppen}/${total} (${(withKoppen/total*100).toFixed(1)}%)`);

await conn.end();
