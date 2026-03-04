/**
 * Enrichissement des plantes sans nom latin
 * Basé sur les données existantes (famille, origine, catégorie)
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

// Dictionnaire des noms latins pour les plantes connues
const latinNameMap = {
  // TABACS
  'Ambil': 'Nicotiana tabacum var. ambil',
  'Burley': 'Nicotiana tabacum var. burley',
  'Criollo': 'Nicotiana tabacum var. criollo',
  'Latakia': 'Nicotiana tabacum var. latakia',
  'Oriental Katerini': 'Nicotiana tabacum var. oriental',
  'Tabac Xanthi': 'Nicotiana tabacum var. xanthi',
  'Tabac Yenidje': 'Nicotiana tabacum var. yenidje',
  'Tabac Izmir': 'Nicotiana tabacum var. izmir',
  'Tabac Samsun': 'Nicotiana tabacum var. samsun',
  'Tabac Basma': 'Nicotiana tabacum var. basma',
  'Tabac Perique': 'Nicotiana tabacum var. perique',
  'Tabac Virginia': 'Nicotiana tabacum var. virginia',
  
  // AROMATIQUES
  'Aframomum (Maniguette)': 'Aframomum melegueta',
  'Ambrette (Graine)': 'Abelmoschus moschatus',
  'Basilic': 'Ocimum basilicum',
  'Basilic sacré': 'Ocimum sanctum',
  'Coriandre': 'Coriandrum sativum',
  'Cumin': 'Cuminum cyminum',
  'Estragon': 'Artemisia dracunculus',
  'Fenouil': 'Foeniculum vulgare',
  'Fenugrec': 'Trigonella foenum-graecum',
  'Gingembre': 'Zingiber officinale',
  'Laurier': 'Laurus nobilis',
  'Marjolaine': 'Origanum majorana',
  'Menthe': 'Mentha piperita',
  'Muscade': 'Myristica fragrans',
  'Origan': 'Origanum vulgare',
  'Persil': 'Petroselinum crispum',
  'Romarin': 'Rosmarinus officinalis',
  'Sauge': 'Salvia officinalis',
  'Thym': 'Thymus vulgaris',
  
  // RÉSINES
  'Baume du Pérou': 'Myroxylon balsamum',
  'Benjoin du Siam': 'Styrax tonkinensis',
  'Commiphora africain': 'Commiphora africana',
  'Encens (Oliban)': 'Boswellia sacra',
  'Encens indien': 'Boswellia serrata',
  'Myrrhe': 'Commiphora myrrha',
  'Styrax': 'Styrax benzoin',
  
  // BOIS
  'Agar indien': 'Aquilaria agallocha',
  'Agarwood (Oud)': 'Aquilaria malaccensis',
  'Cèdre': 'Cedrus libani',
  'Cèdre de Virginie': 'Juniperus virginiana',
  'Cyprès': 'Cupressus sempervirens',
  'Hinoki': 'Chamaecyparis obtusa',
  'Santal blanc': 'Santalum album',
  'Santal rouge': 'Pterocarpus santalinus',
  'Vétiver': 'Vetiveria zizanioides',
  'Bois de rose': 'Aniba rosaeodora',
  'Bois de Oud': 'Aquilaria crassna',
  
  // FLEURS
  'Géranium': 'Pelargonium graveolens',
  'Héliotrope': 'Heliotropium arborescens',
  'Hibiscus': 'Hibiscus sabdariffa',
  'Iris': 'Iris germanica',
  'Jasmin': 'Jasminum sambac',
  'Magnolia': 'Magnolia grandiflora',
  'Muguet': 'Convallaria majalis',
  'Osmanthus': 'Osmanthus fragrans',
  'Rose': 'Rosa damascena',
  'Tagetes': 'Tagetes erecta',
  'Violette': 'Viola odorata',
  'Ylang-ylang': 'Cananga odorata',
  
  // AUTRES
  'Achiote (Roucou)': 'Bixa orellana',
  'Maté': 'Ilex paraguariensis',
  'Noix de muscade': 'Myristica fragrans',
  'Poivre': 'Piper nigrum',
  'Vanille': 'Vanilla planifolia',
  'Cacao': 'Theobroma cacao',
  'Café': 'Coffea arabica',
  'Thé': 'Camellia sinensis',
};

console.log('=== ENRICHISSEMENT DES NOMS LATINS ===\n');

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
  // Chercher le nom latin dans la map
  let latinName = latinNameMap[plant.name];
  
  // Si pas trouvé, essayer une recherche partielle
  if (!latinName) {
    for (const [key, value] of Object.entries(latinNameMap)) {
      if (plant.name.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(plant.name.toLowerCase())) {
        latinName = value;
        break;
      }
    }
  }
  
  if (latinName) {
    // Mettre à jour la base de données
    await conn.execute(
      `UPDATE plants SET latin_name = ? WHERE id = ?`,
      [latinName, plant.id]
    );
    console.log(`✅ ${plant.name} → ${latinName}`);
    updated++;
  } else {
    console.log(`⏭️  ${plant.name} (famille: ${plant.family || 'N/A'}) — pas de match`);
    skipped++;
  }
}

console.log(`\n📊 Résultats :`);
console.log(`  Mis à jour : ${updated}`);
console.log(`  Non trouvés : ${skipped}`);

await conn.end();
console.log('\n✅ Enrichissement terminé');
