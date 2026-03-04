/**
 * Script de correction des plantes mal formatées
 * 
 * Problème : lors de l'import CSV (séparateur ;), les valeurs ont été mal réparties
 * entre les colonnes de la base de données. Ce script :
 * 1. Reconstitue la ligne CSV originale en concaténant tous les champs DB
 * 2. Re-parse correctement selon l'ordre des colonnes CSV
 * 3. Met à jour la base de données avec les valeurs corrigées
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Colonnes DB dans l'ordre de la reconstitution CSV
const DB_COLUMNS = [
  'name', 'latin_name', 'family', 'category', 'origin', 'habitat',
  'olfactive_signature', 'dominant_molecules', 'climatic_axis',
  'traditional_use', 'absorbe_use', 'kingdom', 'division', 'class',
  'order_name', 'genus', 'species', 'life_cycle', 'harvest_period',
  'essential_oil_yield', 'notes',
];

// Mapping des valeurs CSV de category vers les valeurs ENUM de la DB
const CATEGORY_MAP = {
  'aromatique': 'aromatique',
  'Aromatique': 'aromatique',
  'tabac': 'tabac',
  'Tabac': 'tabac',
  'Feuille aromatique': 'tabac',
  'cannabis': 'cannabis',
  'Cannabis': 'cannabis',
  'résine': 'resine',
  'Résine': 'resine',
  'resine': 'resine',
  'Baume oléorésine': 'resine',
  'Baume': 'resine',
  'Oléorésine': 'resine',
  'bois': 'bois',
  'Bois': 'bois',
  'Bois aromatique': 'bois',
  'Bois résineux': 'bois',
  'Bois sacré': 'bois',
  'fleur': 'fleur',
  'Fleur': 'fleur',
  'Florale': 'fleur',
  'Florale (absolue)': 'fleur',
  'racine': 'racine',
  'Racine': 'racine',
  'Rhizome': 'racine',
  'autre': 'autre',
  'Autre': 'autre',
  'Épice': 'autre',
  'Épices': 'autre',
  'Graine': 'autre',
  'Feuille': 'autre',
  'Écorce': 'autre',
  'Fruit': 'autre',
  'Herbe': 'autre',
  'Mousse': 'autre',
  'Lichen': 'autre',
  'Algue': 'autre',
  'Champignon': 'autre',
  'Fève (graine)': 'autre',
  'Feuille (infusion)': 'autre',
  'Feuille (fumée)': 'autre',
  'Fleur (absolue)': 'fleur',
};

// Mapping des valeurs life_cycle CSV vers ENUM DB
const LIFE_CYCLE_MAP = {
  'annual': 'annual',
  'Annual': 'annual',
  'Annuelle': 'annual',
  'biennial': 'biennial',
  'Biennial': 'biennial',
  'Bisannuelle': 'biennial',
  'perennial': 'perennial',
  'Perennial': 'perennial',
  'Pérenne': 'perennial',
  'Vivace': 'perennial',
  'Arbre pérenne': 'perennial',
  'Arbuste pérenne': 'perennial',
  'variable': 'variable',
  'Variable': 'variable',
};

function mapCategory(rawValue) {
  if (!rawValue || rawValue.trim() === '' || rawValue === 'null') return 'autre';
  const trimmed = rawValue.trim();
  if (CATEGORY_MAP[trimmed]) return CATEGORY_MAP[trimmed];
  // Recherche partielle
  const lower = trimmed.toLowerCase();
  if (lower.includes('tabac') || lower.includes('feuille aromatique')) return 'tabac';
  if (lower.includes('cannabis')) return 'cannabis';
  if (lower.includes('résine') || lower.includes('resine') || lower.includes('baume') || lower.includes('gomme')) return 'resine';
  if (lower.includes('bois')) return 'bois';
  if (lower.includes('fleur') || lower.includes('floral')) return 'fleur';
  if (lower.includes('racine') || lower.includes('rhizome')) return 'racine';
  return 'autre';
}

// Mapping des valeurs CSV de climatic_axis vers les valeurs ENUM de la DB
const CLIMATIC_AXIS_MAP = {
  'vent': 'vent',
  'bois': 'bois',
  'disparition': 'disparition',
  'vent_bois': 'vent_bois',
  'bois_disparition': 'bois_disparition',
  'vent_disparition': 'vent_disparition',
};

function mapClimaticAxis(rawValue) {
  if (!rawValue || rawValue.trim() === '' || rawValue === 'null') return null;
  const trimmed = rawValue.trim().toLowerCase();
  // Correspondances directes
  if (CLIMATIC_AXIS_MAP[trimmed]) return CLIMATIC_AXIS_MAP[trimmed];
  // Valeurs CSV libres → null (on ne peut pas mapper)
  return null;
}

function mapLifeCycle(rawValue) {
  if (!rawValue || rawValue.trim() === '' || rawValue === 'null') return null;
  const trimmed = rawValue.trim();
  if (LIFE_CYCLE_MAP[trimmed]) return LIFE_CYCLE_MAP[trimmed];
  const lower = trimmed.toLowerCase();
  if (lower.includes('annual') || lower.includes('annuel')) return 'annual';
  if (lower.includes('bienni') || lower.includes('bisann')) return 'biennial';
  if (lower.includes('peren') || lower.includes('pérenn') || lower.includes('vivace') || lower.includes('arbre') || lower.includes('arbuste')) return 'perennial';
  if (lower.includes('variable')) return 'variable';
  return null;
}

function cleanValue(val) {
  if (val === null || val === undefined || val === 'null' || val === '') return null;
  const s = String(val).trim();
  if (s === '' || s === 'null') return null;
  return s;
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log('✅ Connexion à la base de données établie\n');

  // 1. Récupérer toutes les plantes avec name contenant des ;
  const [malformedPlants] = await conn.execute(`
    SELECT id, name, latin_name, family, category, origin, habitat, olfactive_signature,
           dominant_molecules, climatic_axis, traditional_use, absorbe_use,
           kingdom, division, class, order_name, genus, species, life_cycle,
           harvest_period, essential_oil_yield, notes
    FROM plants 
    WHERE name LIKE '%;%'
    ORDER BY id
  `);

  console.log(`📊 ${malformedPlants.length} plantes mal formatées trouvées\n`);

  let fixed = 0;
  let skipped = 0;
  let deleted = 0;
  const errors = [];
  const preview = [];

  for (const plant of malformedPlants) {
    // Ignorer la ligne d'en-tête (ID 600001)
    if (plant.name.startsWith('name;latin_name;')) {
      console.log(`🗑️  Suppression de la ligne d'en-tête CSV (ID ${plant.id})`);
      
      const [relations] = await conn.execute(
        `SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = ?`,
        [plant.id]
      );
      
      if (relations[0].cnt > 0) {
        console.log(`   → ${relations[0].cnt} relations trouvées, suppression des relations d'abord`);
        await conn.execute(`DELETE FROM plant_molecules WHERE plant_id = ?`, [plant.id]);
      }
      
      await conn.execute(`DELETE FROM plants WHERE id = ?`, [plant.id]);
      deleted++;
      continue;
    }

    // Reconstituer la ligne CSV complète
    const csvValues = DB_COLUMNS.map(col => {
      const val = plant[col];
      if (val === null || val === undefined || val === 'null') return '';
      return String(val);
    }).join(';');

    // Parser la ligne CSV reconstituée
    const parts = csvValues.split(';');

    // Extraire les valeurs corrigées selon l'ordre CSV
    // CSV order: name, latin_name, family, category, origin, habitat, olfactive_signature,
    //            dominant_molecules, climatic_axis, traditional_use, absorbe_use,
    //            kingdom, division, class, order_name, genus, species, life_cycle,
    //            harvest_period, essential_oil_yield, notes
    const csvName = cleanValue(parts[0]);
    const csvLatinName = cleanValue(parts[1]);
    const csvFamily = cleanValue(parts[2]);
    const csvCategory = mapCategory(parts[3]);
    const csvOrigin = cleanValue(parts[4]);
    const csvHabitat = cleanValue(parts[5]);
    const csvOlfactiveSignature = cleanValue(parts[6]);
    const csvDominantMolecules = cleanValue(parts[7]);
    const csvClimaticAxis = mapClimaticAxis(parts[8]);
    const csvTraditionalUse = cleanValue(parts[9]);
    const csvAborbeUse = cleanValue(parts[10]);
    const csvKingdom = cleanValue(parts[11]) || 'Plantae';
    const csvDivision = cleanValue(parts[12]);
    const csvClass = cleanValue(parts[13]);
    const csvOrderName = cleanValue(parts[14]);
    const csvGenus = cleanValue(parts[15]);
    const csvSpecies = cleanValue(parts[16]);
    const csvLifeCycle = mapLifeCycle(parts[17]);
    const csvHarvestPeriod = cleanValue(parts[18]);
    const csvEssentialOilYield = cleanValue(parts[19]);
    const csvNotes = cleanValue(parts[20]);

    // Vérification : le nom doit être non vide et ne pas contenir de ;
    if (!csvName) {
      console.log(`⚠️  Plante ID ${plant.id} : nom vide après correction`);
      errors.push({ id: plant.id, issue: 'nom vide' });
      skipped++;
      continue;
    }

    // Tronquer les valeurs trop longues pour genus/species (max 100 chars)
    const safeGenus = csvGenus ? csvGenus.substring(0, 100) : null;
    const safeSpecies = csvSpecies ? csvSpecies.substring(0, 100) : null;
    const safeDivision = csvDivision ? csvDivision.substring(0, 100) : null;
    const safeClass = csvClass ? csvClass.substring(0, 100) : null;
    const safeOrderName = csvOrderName ? csvOrderName.substring(0, 100) : null;
    const safeKingdom = csvKingdom ? csvKingdom.substring(0, 50) : 'Plantae';

    preview.push({
      id: plant.id,
      before: { name: plant.name.substring(0, 50), latin_name: plant.latin_name },
      after: { name: csvName, latin_name: csvLatinName, category: csvCategory },
    });

    // Mettre à jour la base de données
    try {
      await conn.execute(`
        UPDATE plants SET
          name = ?,
          latin_name = ?,
          family = ?,
          category = ?,
          origin = ?,
          habitat = ?,
          olfactive_signature = ?,
          dominant_molecules = ?,
          climatic_axis = ?,
          traditional_use = ?,
          absorbe_use = ?,
          kingdom = ?,
          division = ?,
          class = ?,
          order_name = ?,
          genus = ?,
          species = ?,
          life_cycle = ?,
          harvest_period = ?,
          essential_oil_yield = ?,
          notes = ?
        WHERE id = ?
      `, [
        csvName, csvLatinName, csvFamily, csvCategory,
        csvOrigin, csvHabitat, csvOlfactiveSignature, csvDominantMolecules,
        csvClimaticAxis, csvTraditionalUse, csvAborbeUse,
        safeKingdom, safeDivision, safeClass, safeOrderName,
        safeGenus, safeSpecies, csvLifeCycle,
        csvHarvestPeriod, csvEssentialOilYield, csvNotes,
        plant.id,
      ]);
      fixed++;
    } catch (err) {
      console.error(`❌ Erreur pour ID ${plant.id}: ${err.message}`);
      console.error(`   name="${csvName}" category="${csvCategory}" life_cycle="${csvLifeCycle}"`);
      errors.push({ id: plant.id, issue: err.message, name: csvName });
      skipped++;
    }
  }

  console.log('\n=== RÉSUMÉ PHASE 1 (plantes avec name CSV) ===');
  console.log(`✅ Plantes corrigées : ${fixed}`);
  console.log(`🗑️  Lignes supprimées (en-têtes) : ${deleted}`);
  console.log(`⚠️  Ignorées/erreurs : ${skipped}`);

  if (preview.length > 0) {
    console.log('\n=== APERÇU DES CORRECTIONS (10 premières) ===');
    preview.slice(0, 10).forEach(p => {
      console.log(`\nID ${p.id}:`);
      console.log(`  AVANT  name: "${p.before.name}"`);
      console.log(`  AVANT  latin: "${p.before.latin_name}"`);
      console.log(`  APRÈS  name: "${p.after.name}"`);
      console.log(`  APRÈS  latin: "${p.after.latin_name}"`);
      console.log(`  APRÈS  category: "${p.after.category}"`);
    });
  }

  if (errors.length > 0) {
    console.log('\n=== ERREURS ===');
    errors.slice(0, 20).forEach(e => console.log(`  ID ${e.id}: ${e.issue} (name: ${e.name})`));
  }

  // 2. Corriger les latin_name qui contiennent des descriptions olfactives
  // (plantes importées depuis un autre fichier avec structure différente)
  console.log('\n\n=== PHASE 2 : Nettoyage des latin_name descriptifs ===');
  
  const [badLatinNames] = await conn.execute(`
    SELECT id, name, latin_name, olfactive_signature
    FROM plants 
    WHERE latin_name IS NOT NULL 
    AND (
      latin_name LIKE '%Accords%'
      OR latin_name LIKE '%Axe %'
      OR latin_name LIKE '%accord%'
      OR latin_name LIKE '%axe %'
      OR latin_name LIKE '%résineux%'
      OR latin_name LIKE '%boisé%'
      OR latin_name LIKE '%floral%'
      OR latin_name LIKE '%encens%'
      OR latin_name LIKE '%herbacé%'
      OR latin_name LIKE '%citronné%'
      OR latin_name LIKE '%balsamique%'
      OR latin_name LIKE '%tabac%'
      OR latin_name LIKE '%fumée%'
      OR latin_name LIKE '%poudre%'
      OR latin_name LIKE '%médicinal%'
      OR latin_name LIKE '%olfactif%'
      OR latin_name LIKE '%nuance%'
      OR latin_name LIKE '%pont %'
    )
    ORDER BY id
  `);

  console.log(`📊 ${badLatinNames.length} plantes avec latin_name descriptif trouvées`);

  let latinFixed = 0;
  for (const plant of badLatinNames) {
    // Déplacer la description vers olfactive_signature si vide, puis vider latin_name
    const newOlfactive = plant.olfactive_signature || plant.latin_name;
    
    await conn.execute(`
      UPDATE plants SET 
        olfactive_signature = ?,
        latin_name = NULL
      WHERE id = ?
    `, [newOlfactive, plant.id]);
    latinFixed++;
  }

  console.log(`✅ latin_name descriptifs nettoyés : ${latinFixed}`);

  // 3. Vérification finale
  console.log('\n\n=== VÉRIFICATION FINALE ===');
  const [remaining] = await conn.execute(`
    SELECT COUNT(*) as cnt FROM plants WHERE name LIKE '%;%'
  `);
  console.log(`Plantes avec name encore mal formaté : ${remaining[0].cnt}`);
  
  const [remainingLatin] = await conn.execute(`
    SELECT COUNT(*) as cnt FROM plants 
    WHERE latin_name LIKE '%Accords%' OR latin_name LIKE '%Axe %' OR latin_name LIKE '%accord%'
  `);
  console.log(`Plantes avec latin_name encore descriptif : ${remainingLatin[0].cnt}`);

  const [totalPlants] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants`);
  console.log(`Total plantes en base : ${totalPlants[0].cnt}`);

  await conn.end();
  console.log('\n✅ Script terminé avec succès');
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});
