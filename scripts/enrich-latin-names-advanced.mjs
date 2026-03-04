/**
 * Enrichissement avancé des noms latins - Plantes restantes
 * Basé sur famille botanique et catégorie olfactive
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

// Dictionnaire avancé basé sur famille/catégorie
const advancedMap = {
  // ÉPICES
  'Cannelle de Ceylan': 'Cinnamomum verum',
  'Clou de girofle': 'Syzygium aromaticum',
  'Giroflier (feuille)': 'Syzygium aromaticum',
  'Macis': 'Myristica fragrans',
  'Néroli (Oranger amer)': 'Citrus aurantium',
  'Petitgrain bigarade': 'Citrus aurantium subsp. aurantium',
  'Yuzu (agrume)': 'Citrus junos',
  
  // RÉSINES SPÉCIALES
  'Boswellia (Encens africain)': 'Boswellia carterii',
  'Breu Branco': 'Protium heptaphyllum',
  'Ciste ladanifère': 'Cistus ladaniferus',
  'Copal Santo': 'Protium copal',
  'Copaïba': 'Copaifera officinalis',
  'Daniellia oliveri': 'Daniellia oliveri',
  'Lentisque (Mastic)': 'Pistacia lentiscus',
  'Oliban (Boswellia serrata)': 'Boswellia serrata',
  
  // PLANTES AROMATIQUES SPÉCIALES
  'Combava (Feuille)': 'Citrus hystrix',
  'Immortelle (Hélichryse)': 'Helichrysum italicum',
  'Lippia (Verveine du Burkina)': 'Lippia multiflora',
  'Souchet odorant (Priprioca)': 'Cyperus articulatus',
  'Tubéreuse': 'Polianthes tuberosa',
  'Vériver (Khus)': 'Vetiveria zizanioides',
  
  // PLANTES ETHNOBOTANIQUES
  'Datura stramonium (Toloache)': 'Datura stramonium',
  'Épazote': 'Dysphania ambrosioides',
  'Mimosa tenuiflora (Tepezcohuite)': 'Mimosa tenuiflora',
  'Nénuphar blanc sacré': 'Nymphaea alba',
  'Pericón (Yauhtli)': 'Tagetes lucida',
  'Silphion (Silphium sp.)': 'Silphium perfoliatum',
  
  // TABACS SPÉCIAUX
  'Tabac cultivé': 'Nicotiana tabacum',
  'Tabac rustique (Mapacho)': 'Nicotiana rustica',
  'Virginia (flue-cured)': 'Nicotiana tabacum var. virginia',
};

console.log('=== ENRICHISSEMENT AVANCÉ DES NOMS LATINS ===\n');

// Récupérer les plantes sans nom latin
const [noLatin] = await conn.execute(`
  SELECT id, name, latin_name, family, category
  FROM plants 
  WHERE latin_name IS NULL OR latin_name = '' OR latin_name = 'null'
  ORDER BY name
`);

console.log(`Plantes à enrichir : ${noLatin.length}\n`);

let updated = 0;
let skipped = 0;

for (const plant of noLatin) {
  let latinName = advancedMap[plant.name];
  
  if (latinName) {
    // Mettre à jour la base de données
    await conn.execute(
      `UPDATE plants SET latin_name = ? WHERE id = ?`,
      [latinName, plant.id]
    );
    console.log(`✅ ${plant.name} → ${latinName}`);
    updated++;
  } else {
    console.log(`⏭️  ${plant.name} (famille: ${plant.family || 'N/A'}, catégorie: ${plant.category})`);
    skipped++;
  }
}

console.log(`\n📊 Résultats :`);
console.log(`  Mis à jour : ${updated}`);
console.log(`  Non trouvés : ${skipped}`);

// Vérifier le résultat final
const [final] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN latin_name IS NULL OR latin_name = '' OR latin_name = 'null' THEN 1 ELSE 0 END) as no_latin
  FROM plants
`);

console.log(`\n📊 État final :`);
console.log(`  Total plantes : ${final[0].total}`);
console.log(`  Sans nom latin : ${final[0].no_latin} (${Math.round(final[0].no_latin/final[0].total*100)}%)`);

await conn.end();
console.log('\n✅ Enrichissement avancé terminé');
