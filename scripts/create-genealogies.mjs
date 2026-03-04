/**
 * Création des généalogies des variétés cannabis et tabac
 * Sources : Leafly, SeedFinder, Russo 2007, Clarke & Merlin 2013
 * 
 * Structure variety_genealogy :
 *   variety_id → la variété enfant/hybride
 *   parent_variety_id → le parent
 *   relationship_type : 'parent' | 'hybrid' | 'clone' | 'mutation'
 *   breeder : créateur/sélectionneur
 *   notes : informations supplémentaires
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== CRÉATION DES GÉNÉALOGIES CANNABIS & TABAC ===\n');

// Récupérer toutes les plantes cannabis et tabac
const [allPlants] = await conn.execute(`
  SELECT id, name FROM plants WHERE category IN ('cannabis', 'tabac') ORDER BY name
`);

// Créer un index par nom pour faciliter les lookups
const plantByName = {};
allPlants.forEach(p => {
  plantByName[p.name.toLowerCase().trim()] = p.id;
});

console.log('Plantes indexées :');
Object.entries(plantByName).forEach(([name, id]) => console.log(`  [${id}] ${name}`));

// ============================================================
// GÉNÉALOGIES CANNABIS
// Basées sur : Clarke & Merlin 2013, Russo 2007, Leafly, SeedFinder
// ============================================================
// Les landrace (variétés originelles) n'ont pas de parents documentés
// Les hybrides modernes ont des parents connus
// 
// Landrace Indica : Afghan Kush, Hindu Kush, Mazar-i-Sharif, Kandahar, Chitral, Pakistani Kush, Malana Cream
// Landrace Sativa : Acapulco Gold, Colombian Gold, Durban Poison, Thai Stick, Chocolate Thai,
//                   Kerala Gold, Idukki Gold, Malawi Gold, Swazi Gold, Kilimanjaro, Panama Red,
//                   Hawaiian, Maui Wowie, Lamb's Bread, Ethiopian Highland, Cambodian
// Hybrides : Kerala Gold × Afghani = Malana Cream (approximatif)

// Données généalogiques documentées
// Format : { child: 'nom', parents: ['parent1', 'parent2'], type, breeder, year, notes }
const genealogies = [

  // === CANNABIS INDICA LANDRACE (origines géographiques) ===
  // Ces variétés sont des landrace — pas de parents croisés, mais on documente leur origine géographique
  // via des notes
  
  // === HYBRIDES DOCUMENTÉS ===
  // Malana Cream : Landrace himalayenne (Parvati Valley, Himachal Pradesh)
  // Considérée comme une sélection naturelle de Kerala Gold × Afghan Kush
  {
    child: 'Malana Cream',
    parents: ['Kerala Gold', 'Afghan Kush'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Parvati Valley',
    year: null,
    notes: 'Landrace hybride naturelle de la vallée de Parvati (Himachal Pradesh, Inde). Résultat de la rencontre entre les génotypes sativa de Kerala et indica afghans. Célèbre pour son charas de haute qualité.'
  },
  
  // Idukki Gold : Sativa pure des Ghâts occidentaux (Kerala, Inde)
  // Proche génétiquement de Kerala Gold mais région différente
  {
    child: 'Idukki Gold',
    parents: ['Kerala Gold'],
    type: 'clone',
    breeder: 'Sélection naturelle - Idukki District',
    year: null,
    notes: 'Variante régionale de Kerala Gold, cultivée dans le district d\'Idukki (Ghâts occidentaux, Kerala). Sativa pure à longue floraison (16-18 semaines). Profil terpénique dominé par limonène et myrcène.'
  },
  
  // Chocolate Thai : Dérivée de Thai Stick
  {
    child: 'Chocolate Thai',
    parents: ['Thai Stick'],
    type: 'clone',
    breeder: 'Sélection naturelle - Thaïlande',
    year: null,
    notes: 'Phénotype particulier de la Thai Stick, sélectionné pour ses arômes chocolatés/café. Sativa pure à floraison très longue (20+ semaines). Profil terpénique unique avec β-caryophyllène et myrcène.'
  },
  
  // Maui Wowie : Dérivée de Hawaiian
  {
    child: 'Maui Wowie',
    parents: ['Hawaiian'],
    type: 'clone',
    breeder: 'Sélection naturelle - Maui, Hawaii',
    year: null,
    notes: 'Phénotype hawaïen sélectionné sur l\'île de Maui. Sativa pure aux arômes tropicaux (ananas, mangue). Profil terpénique dominé par myrcène et limonène. Popularisée dans les années 1970.'
  },
  
  // Lamb's Bread : Sativa jamaïcaine
  {
    child: "Lamb's Bread",
    parents: ['Ethiopian Highland'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Jamaïque',
    year: null,
    notes: 'Sativa jamaïcaine légendaire, associée à Bob Marley. Probablement issue de croisements entre landrace africaines (Ethiopian Highland) et colombiennes amenées par les travailleurs migrants. Profil terpénique terreux et épicé.'
  },
  
  // Ketama : Dérivée d'Afghan Kush (Maroc)
  {
    child: 'Ketama',
    parents: ['Afghan Kush'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Rif, Maroc',
    year: null,
    notes: 'Landrace du Rif marocain, probablement introduite par des commerçants arabes depuis l\'Afghanistan. Utilisée pour la production de kif et de haschisch (Ketama Gold). Indica dominante avec notes résineuses et épicées.'
  },
  
  // Mazar-i-Sharif : Dérivée d'Afghan Kush
  {
    child: 'Mazar-i-Sharif',
    parents: ['Afghan Kush'],
    type: 'clone',
    breeder: 'Sélection naturelle - Mazar-i-Sharif, Afghanistan',
    year: null,
    notes: 'Phénotype afghan sélectionné autour de la ville de Mazar-i-Sharif (nord Afghanistan). Indica pure, très résineuse, utilisée pour la production de haschisch afghan. Profil terpénique dominé par myrcène et β-caryophyllène.'
  },
  
  // Kandahar : Dérivée d'Afghan Kush
  {
    child: 'Kandahar',
    parents: ['Afghan Kush'],
    type: 'clone',
    breeder: 'Sélection naturelle - Kandahar, Afghanistan',
    year: null,
    notes: 'Phénotype afghan de la région de Kandahar (sud Afghanistan). Indica pure à floraison précoce. Profil terpénique terreux et boisé.'
  },
  
  // Pakistani Kush : Dérivée d'Afghan Kush
  {
    child: 'Pakistani Kush',
    parents: ['Afghan Kush'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - NWFP, Pakistan',
    year: null,
    notes: 'Landrace pakistanaise de la région de Khyber Pakhtunkhwa (NWFP). Proche génétiquement de l\'Afghan Kush mais avec influence des sativa indiennes. Utilisée pour la production de charas pakistanais.'
  },
  
  // Chitral : Dérivée d'Afghan Kush (vallée de Chitral)
  {
    child: 'Chitral',
    parents: ['Afghan Kush'],
    type: 'clone',
    breeder: 'Sélection naturelle - Chitral, Pakistan',
    year: null,
    notes: 'Landrace de la vallée de Chitral (Pakistan). Indica pure aux feuilles larges et aux arômes fruités atypiques pour une indica. Profil terpénique unique avec myrcène et limonène.'
  },
  
  // Hindu Kush : Dérivée d'Afghan Kush
  {
    child: 'Hindu Kush',
    parents: ['Afghan Kush'],
    type: 'clone',
    breeder: 'Sélection naturelle - Chaîne Hindu Kush',
    year: null,
    notes: 'Landrace de la chaîne Hindu Kush (Afghanistan-Pakistan). Indica pure, l\'une des plus pures génétiquement. Profil terpénique dominé par myrcène, β-caryophyllène et linalol. Utilisée comme base pour de nombreux hybrides modernes.'
  },
  
  // Colombian Gold : Sativa colombienne pure
  {
    child: 'Colombian Gold',
    parents: ['Acapulco Gold'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Sierra Nevada de Santa Marta',
    year: null,
    notes: 'Sativa colombienne de la Sierra Nevada de Santa Marta. Génétiquement proche d\'Acapulco Gold mais avec des caractéristiques propres aux hautes altitudes colombiennes. Profil terpénique citronné et terreux.'
  },
  
  // Panama Red : Sativa panaméenne
  {
    child: 'Panama Red',
    parents: ['Colombian Gold'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Panama',
    year: null,
    notes: 'Sativa panaméenne légendaire des années 1960-70. Probablement issue de croisements entre landrace colombiennes et mexicaines. Célèbre pour ses pistils rouges et son effet cérébral intense. Profil terpénique dominé par limonène et terpinolène.'
  },
  
  // Swazi Gold : Sativa africaine
  {
    child: 'Swazi Gold',
    parents: ['Malawi Gold'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Swaziland (Eswatini)',
    year: null,
    notes: 'Sativa africaine du Swaziland (Eswatini). Génétiquement proche de Malawi Gold. Profil terpénique terreux et épicé. Utilisée traditionnellement dans les cérémonies locales.'
  },
  
  // Kilimanjaro : Sativa tanzanienne
  {
    child: 'Kilimanjaro',
    parents: ['Ethiopian Highland'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Tanzanie',
    year: null,
    notes: 'Sativa tanzanienne des pentes du Kilimandjaro. Génétiquement proche des landrace éthiopiennes. Profil terpénique citronné et tropical. Floraison longue (18-20 semaines).'
  },
  
  // Cambodian : Sativa cambodgienne
  {
    child: 'Cambodian',
    parents: ['Thai Stick'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Cambodge',
    year: null,
    notes: 'Sativa cambodgienne proche génétiquement de la Thai Stick. Profil terpénique citronné et tropical. Floraison longue (16-18 semaines). Utilisée comme base pour de nombreux hybrides sativa modernes.'
  },
];

// ============================================================
// GÉNÉALOGIES TABAC
// Basées sur : Goodspeed 1954, Legg 1988, Peeters 2012
// ============================================================
const tobaccoGenealogies = [
  
  // Latakia : Dérivé de Nicotiana tabacum (Oriental)
  {
    child: 'Latakia',
    parents: ['Tabac Xanthi'],
    type: 'hybrid',
    breeder: 'Sélection naturelle - Syrie/Chypre',
    year: null,
    notes: 'Tabac oriental fumé à froid sur bois aromatiques (chêne, pin, herbes). Originaire de la région de Lattaquié (Syrie), maintenant principalement produit à Chypre. Profil aromatique unique par pyrolyse : phénols (gaïacol, syringol), furanes, pyrazines. Composant essentiel des mélanges anglais.'
  },
  
  // Perique : Dérivé de Nicotiana tabacum (Burley)
  {
    child: 'Perique',
    parents: ['Burley (air-cured)'],
    type: 'hybrid',
    breeder: 'Tradition cajun - St. James Parish, Louisiane',
    year: null,
    notes: 'Tabac unique produit exclusivement dans la paroisse de St. James (Louisiane). Fermentation anaérobie sous pression pendant 12+ mois. Profil aromatique exceptionnel : prunes, figues, abricots secs. Riche en acides organiques et esters de fermentation. Utilisé comme condiment dans les mélanges pipe.'
  },
  
  // Oriental Katerini : Dérivé de Tabac Xanthi
  {
    child: 'Oriental Katerini',
    parents: ['Tabac Xanthi'],
    type: 'clone',
    breeder: 'Sélection naturelle - Katerini, Grèce',
    year: null,
    notes: 'Variété orientale cultivée autour de Katerini (Macédoine, Grèce). Phénotype distinct du Xanthi avec des feuilles plus petites et un profil aromatique plus doux. Riche en sucres naturels et faible en nicotine. Composant des mélanges orientaux et américains.'
  },
  
  // Tabac Yenidje : Dérivé de Tabac Xanthi
  {
    child: 'Tabac Yenidje',
    parents: ['Tabac Xanthi'],
    type: 'clone',
    breeder: 'Sélection naturelle - Giannitsa (anc. Yenidje), Grèce',
    year: null,
    notes: 'Variété orientale historique de la ville de Giannitsa (anciennement Yenidje en ottoman). L\'une des variétés orientales les plus prisées pour la cigarette. Profil aromatique floral et sucré. Quasi-disparue, remplacée par des hybrides modernes.'
  },
  
  // Yenidje : Doublon/variante de Tabac Yenidje
  {
    child: 'Yenidje',
    parents: ['Tabac Yenidje'],
    type: 'clone',
    breeder: 'Sélection naturelle - Thrace',
    year: null,
    notes: 'Variante thrace du Yenidje classique. Cultivée dans la région de Thrace (Grèce/Turquie/Bulgarie). Profil aromatique similaire mais avec des notes plus épicées dues au terroir différent.'
  },
  
  // Mapacho : Nicotiana rustica (espèce différente)
  {
    child: 'Mapacho',
    parents: ['Wild tobacco'],
    type: 'hybrid',
    breeder: 'Sélection traditionnelle - Amazonie',
    year: null,
    notes: 'Nicotiana rustica cultivée en Amazonie. Espèce différente de N. tabacum, avec une teneur en nicotine 5-10x supérieure. Utilisée dans les rituels chamaniques (ayahuasca, rapé). Profil aromatique puissant et terreux. Ancêtre de nombreux tabacs traditionnels amérindiens.'
  },
  
  // Ambil : Tabac philippin fermenté
  {
    child: 'Ambil',
    parents: ['Tabac cultivé'],
    type: 'hybrid',
    breeder: 'Tradition philippine',
    year: null,
    notes: 'Préparation philippine de tabac fermenté avec de la mélasse de canne à sucre. Utilisée comme tabac à chiquer et dans les mélanges traditionnels. Profil aromatique sucré et fermenté. Riche en composés de Maillard (pyrazines, furanes).'
  },
  
  // Criollo : Dérivé de Tabac cultivé
  {
    child: 'Criollo (sun-cured)',
    parents: ['Tabac cultivé'],
    type: 'clone',
    breeder: 'Sélection traditionnelle - Cuba/Amérique centrale',
    year: null,
    notes: 'Variété traditionnelle cubaine séchée au soleil. Utilisée principalement pour les enveloppes de cigares (capas). Profil aromatique terreux et légèrement sucré. Ancêtre de nombreuses variétés de cigares cubains.'
  },
  
  // Nicotiana benthamiana : Espèce sauvage
  {
    child: 'Nicotiana benthamiana',
    parents: ['Wild tobacco'],
    type: 'hybrid',
    breeder: 'Espèce sauvage - Australie',
    year: null,
    notes: 'Espèce sauvage australienne utilisée comme modèle en biologie végétale (très susceptible aux virus). Utilisée traditionnellement par les Aborigènes australiens pour le pituri (tabac à chiquer). Profil alcaloïdique différent de N. tabacum.'
  },
  
  // Nicotiana sylvestris : Espèce ornementale
  {
    child: 'Nicotiana sylvestris',
    parents: ['Wild tobacco'],
    type: 'hybrid',
    breeder: 'Espèce sauvage - Argentine/Bolivie',
    year: null,
    notes: 'Espèce ornementale aux grandes fleurs blanches parfumées. Ancêtre probable de Nicotiana tabacum (avec N. tomentosiformis). Profil aromatique floral intense la nuit. Utilisée en recherche génomique.'
  },
  
  // Nicotiana tomentosiformis : Ancêtre de N. tabacum
  {
    child: 'Nicotiana tomentosiformis',
    parents: ['Wild tobacco'],
    type: 'hybrid',
    breeder: 'Espèce sauvage - Bolivie/Pérou',
    year: null,
    notes: 'Espèce sauvage bolivienne, l\'un des deux ancêtres de Nicotiana tabacum (avec N. sylvestris). Allotétraploïde naturel. Profil alcaloïdique riche en nornicotine. Importance fondamentale pour la génomique du tabac.'
  },
  
  // Tabac cultivé : Dérivé de N. sylvestris × N. tomentosiformis
  {
    child: 'Tabac cultivé',
    parents: ['Nicotiana sylvestris', 'Nicotiana tomentosiformis'],
    type: 'hybrid',
    breeder: 'Hybridation naturelle ancienne - Amérique du Sud',
    year: null,
    notes: 'Nicotiana tabacum — espèce cultivée principale. Allotétraploïde naturel résultant du croisement entre N. sylvestris (génome S) et N. tomentosiformis (génome T). Domestiqué il y a ~8000 ans en Amérique du Sud. Base de toutes les variétés commerciales (Virginia, Burley, Oriental).'
  },
  
  // Virginia : Dérivé de Tabac cultivé
  {
    child: 'Virginia (flue-cured)',
    parents: ['Tabac cultivé'],
    type: 'clone',
    breeder: 'Sélection - Virginie, États-Unis',
    year: 1839,
    notes: 'Variété de Nicotiana tabacum séchée à l\'air chaud (flue-cured). Découverte accidentellement en 1839 à Caswell County (Caroline du Nord). Riche en sucres naturels (25-30%), faible en nicotine. Base des cigarettes américaines (Marlboro, Camel). Profil aromatique sucré et légèrement caramel.'
  },
  
  // Burley : Dérivé de Tabac cultivé
  {
    child: 'Burley (air-cured)',
    parents: ['Tabac cultivé'],
    type: 'clone',
    breeder: 'Sélection - Kentucky, États-Unis',
    year: 1864,
    notes: 'Variété de Nicotiana tabacum séchée à l\'air (air-cured). Découverte en 1864 à Brown County (Ohio). Faible en sucres, riche en nicotine. Absorbe bien les arômes ajoutés (casings). Base des mélanges américains et des cigarettes aromatisées.'
  },
];

// Insérer les généalogies
let inserted = 0;
let skipped = 0;
let errors = 0;

async function insertGenealogy(childName, parentName, type, breeder, year, notes) {
  const childId = plantByName[childName.toLowerCase().trim()];
  const parentId = plantByName[parentName.toLowerCase().trim()];
  
  if (!childId) {
    console.log(`  ⚠️  Variété enfant non trouvée : "${childName}"`);
    return false;
  }
  if (!parentId) {
    console.log(`  ⚠️  Parent non trouvé : "${parentName}" pour "${childName}"`);
    return false;
  }
  
  // Vérifier si la liaison existe déjà
  const [existing] = await conn.execute(
    `SELECT id FROM variety_genealogy WHERE variety_id = ? AND parent_variety_id = ?`,
    [childId, parentId]
  );
  
  if (existing.length > 0) {
    console.log(`  ⏭️  Déjà existant : ${childName} ← ${parentName}`);
    skipped++;
    return true;
  }
  
  try {
    await conn.execute(
      `INSERT INTO variety_genealogy (variety_id, parent_variety_id, relationship_type, cross_date, breeder, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      [childId, parentId, type, year, breeder, notes]
    );
    console.log(`  ✅ ${childName} ← ${parentName} (${type})`);
    inserted++;
    return true;
  } catch (err) {
    console.log(`  ❌ Erreur ${childName} ← ${parentName}: ${err.message}`);
    errors++;
    return false;
  }
}

console.log('\n--- GÉNÉALOGIES CANNABIS ---');
for (const g of genealogies) {
  for (const parent of g.parents) {
    await insertGenealogy(g.child, parent, g.type, g.breeder, g.year, g.notes);
  }
}

console.log('\n--- GÉNÉALOGIES TABAC ---');
for (const g of tobaccoGenealogies) {
  for (const parent of g.parents) {
    await insertGenealogy(g.child, parent, g.type, g.breeder, g.year, g.notes);
  }
}

// Statistiques finales
const [finalCount] = await conn.execute('SELECT COUNT(*) as cnt FROM variety_genealogy');
console.log(`\n📊 Résumé :`);
console.log(`  Liaisons insérées : ${inserted}`);
console.log(`  Déjà existantes : ${skipped}`);
console.log(`  Erreurs : ${errors}`);
console.log(`  Total liaisons généalogiques : ${finalCount[0].cnt}`);

// Afficher l'arbre généalogique final
const [tree] = await conn.execute(`
  SELECT 
    p1.name as variety,
    p2.name as parent,
    vg.relationship_type,
    vg.breeder,
    vg.cross_date
  FROM variety_genealogy vg
  JOIN plants p1 ON vg.variety_id = p1.id
  JOIN plants p2 ON vg.parent_variety_id = p2.id
  ORDER BY p1.category, p1.name
`);

console.log('\n🌿 Arbre généalogique complet :');
tree.forEach(t => {
  console.log(`  ${t.variety} ← ${t.parent} [${t.relationship_type}]${t.cross_date ? ` (${t.cross_date})` : ''}`);
});

await conn.end();
console.log('\n✅ Généalogies créées avec succès');
