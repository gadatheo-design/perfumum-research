/**
 * AUDIT QUALITÉ SCIENTIFIQUE — PERFUMUM
 * Analyse les anomalies dans les molécules et recettes
 */

import mysql from "mysql2/promise";
import { writeFileSync } from "fs";

const db = await mysql.createConnection(process.env.DATABASE_URL);

console.log("🔬 AUDIT QUALITÉ SCIENTIFIQUE — PERFUMUM");
console.log("=".repeat(60));

const issues = { molecules: [], recettes: [] };

// ─────────────────────────────────────────────────────────────
// 1. AUDIT DES MOLÉCULES
// ─────────────────────────────────────────────────────────────
console.log("\n📊 ANALYSE DES MOLÉCULES...\n");

// 1a. Noms suspects : trop courts (< 3 chars) ou trop longs (> 100 chars)
const [shortNames] = await db.query(`
  SELECT id, name, family, chemical_class 
  FROM molecules 
  WHERE LENGTH(name) < 3 OR LENGTH(name) > 100
  ORDER BY LENGTH(name)
  LIMIT 50
`);
console.log(`⚠️  Noms suspects (longueur anormale) : ${shortNames.length}`);
shortNames.forEach(m => issues.molecules.push({
  type: "NOM_SUSPECT_LONGUEUR", severity: "MEDIUM", id: m.id, name: m.name,
  detail: `Longueur: ${m.name.length} caractères`
}));

// 1b. Noms ressemblant à des codes CSV bruts
const [csvNames] = await db.query(`
  SELECT id, name, family 
  FROM molecules 
  WHERE name REGEXP '^[0-9,;]+$'
     OR name LIKE '%,%'
     OR name LIKE '%;%'
  LIMIT 50
`);
console.log(`⚠️  Noms ressemblant à des codes CSV : ${csvNames.length}`);
csvNames.forEach(m => issues.molecules.push({
  type: "NOM_CSV_BRUT", severity: "HIGH", id: m.id, name: m.name,
  detail: "Ressemble à un code CSV ou identifiant brut"
}));

// 1c. Formules chimiques invalides (colonne chemicalFormula)
const [badFormulas] = await db.query(`
  SELECT id, name, chemicalFormula 
  FROM molecules 
  WHERE chemicalFormula IS NOT NULL 
    AND chemicalFormula != ''
    AND (
      chemicalFormula NOT REGEXP '^C[0-9]'
      OR LENGTH(chemicalFormula) > 60
      OR chemicalFormula LIKE '% %'
      OR chemicalFormula LIKE '%[%'
      OR chemicalFormula REGEXP '[^A-Za-z0-9]'
    )
  LIMIT 50
`);
console.log(`⚠️  Formules chimiques suspectes (chemicalFormula) : ${badFormulas.length}`);
badFormulas.forEach(m => issues.molecules.push({
  type: "FORMULE_INVALIDE", severity: "HIGH", id: m.id, name: m.name,
  detail: `Formule: "${m.chemicalFormula}"`
}));

// 1d. CAS numbers invalides (format: XXXXXXX-XX-X)
const [badCAS] = await db.query(`
  SELECT id, name, cas_number 
  FROM molecules 
  WHERE cas_number IS NOT NULL 
    AND cas_number != ''
    AND cas_number NOT REGEXP '^[0-9]{1,7}-[0-9]{2}-[0-9]$'
  LIMIT 50
`);
console.log(`⚠️  CAS numbers invalides : ${badCAS.length}`);
badCAS.forEach(m => issues.molecules.push({
  type: "CAS_INVALIDE", severity: "MEDIUM", id: m.id, name: m.name,
  detail: `CAS: "${m.cas_number}"`
}));

// 1e. Poids moléculaires hors-normes (< 10 ou > 2000 g/mol)
const [badMW] = await db.query(`
  SELECT id, name, molecularWeight, family 
  FROM molecules 
  WHERE molecularWeight IS NOT NULL 
    AND (molecularWeight < 10 OR molecularWeight > 2000)
  ORDER BY molecularWeight DESC
  LIMIT 50
`);
console.log(`⚠️  Poids moléculaires hors-normes : ${badMW.length}`);
badMW.forEach(m => issues.molecules.push({
  type: "POIDS_MOLECULAIRE_HORS_NORME", severity: "HIGH", id: m.id, name: m.name,
  detail: `MW: ${m.molecularWeight} g/mol`
}));

// 1f. Propriétés thérapeutiques suspectes (termes non-scientifiques)
const [badTherapeutic] = await db.query(`
  SELECT id, name, therapeuticProperties 
  FROM molecules 
  WHERE therapeuticProperties IS NOT NULL 
    AND therapeuticProperties != ''
    AND (
      LENGTH(therapeuticProperties) > 3000
      OR therapeuticProperties LIKE '%magique%'
      OR therapeuticProperties LIKE '%mystique%'
      OR therapeuticProperties LIKE '%spirituel%'
      OR therapeuticProperties LIKE '%chakra%'
      OR therapeuticProperties LIKE '%aura%'
      OR therapeuticProperties LIKE '%énergie cosmique%'
      OR therapeuticProperties LIKE '%vibration%'
      OR therapeuticProperties LIKE '%homéopathie%'
    )
  LIMIT 30
`);
console.log(`⚠️  Propriétés thérapeutiques suspectes : ${badTherapeutic.length}`);
badTherapeutic.forEach(m => issues.molecules.push({
  type: "THERAPEUTIQUE_FANTAISISTE", severity: "HIGH", id: m.id, name: m.name,
  detail: `Contient des termes non-scientifiques: "${m.therapeuticProperties?.substring(0, 100)}..."`
}));

// 1g. Familles chimiques incohérentes avec le nom
const [inconsistentFamily] = await db.query(`
  SELECT id, name, family, chemical_class 
  FROM molecules 
  WHERE (
    (LOWER(name) LIKE '%aldehyde%' OR LOWER(name) LIKE '%aldéhyde%')
    AND chemical_class IN ('alcohol', 'ketone', 'ester')
    AND chemical_class IS NOT NULL
  ) OR (
    (LOWER(name) LIKE '%ketone%' OR LOWER(name) LIKE '%cétone%')
    AND chemical_class IN ('alcohol', 'aldehyde', 'ester')
    AND chemical_class IS NOT NULL
  ) OR (
    (LOWER(name) LIKE '%acid%' OR LOWER(name) LIKE '%acide%')
    AND chemical_class IN ('alcohol', 'aldehyde', 'ketone', 'ester')
    AND chemical_class IS NOT NULL
  )
  LIMIT 30
`);
console.log(`⚠️  Familles chimiques potentiellement incohérentes : ${inconsistentFamily.length}`);
inconsistentFamily.forEach(m => issues.molecules.push({
  type: "FAMILLE_INCOHERENTE", severity: "MEDIUM", id: m.id, name: m.name,
  detail: `Nom suggère une famille différente de "${m.chemical_class}"`
}));

// 1h. Doublons potentiels (noms normalisés identiques)
const [allMolNames] = await db.query(`
  SELECT id, name, family, cas_number 
  FROM molecules 
  ORDER BY name
`);
const potentialDuplicates = [];
const nameMap = new Map();
for (const mol of allMolNames) {
  const normalized = mol.name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/alpha|beta|gamma|delta/g, '');
  if (nameMap.has(normalized)) {
    const existing = nameMap.get(normalized);
    // Ne signaler que si les noms sont vraiment proches (pas juste une coïncidence de normalisation)
    if (Math.abs(mol.name.length - existing.name.length) < 5) {
      potentialDuplicates.push({ mol1: existing, mol2: mol, normalized });
    }
  } else {
    nameMap.set(normalized, mol);
  }
}
console.log(`⚠️  Doublons potentiels (noms normalisés identiques) : ${potentialDuplicates.length}`);
potentialDuplicates.slice(0, 50).forEach(d => issues.molecules.push({
  type: "DOUBLON_POTENTIEL", severity: "HIGH",
  id: d.mol1.id,
  name: `${d.mol1.name} ↔ ${d.mol2.name}`,
  detail: `IDs: ${d.mol1.id} et ${d.mol2.id} — CAS: ${d.mol1.cas_number || 'N/A'} vs ${d.mol2.cas_number || 'N/A'}`
}));

// 1i. Points de fusion/ébullition aberrants
const [badPhysical] = await db.query(`
  SELECT id, name, boilingPoint 
  FROM molecules 
  WHERE boilingPoint IS NOT NULL 
    AND (boilingPoint < -200 OR boilingPoint > 1000)
  LIMIT 20
`);
console.log(`⚠️  Points d'ébullition aberrants : ${badPhysical.length}`);
badPhysical.forEach(m => issues.molecules.push({
  type: "PROPRIETES_PHYSIQUES_ABERRANTES", severity: "MEDIUM", id: m.id, name: m.name,
  detail: `BP: ${m.boilingPoint}°C`
}));

// 1j. Molécules avec concentration négative ou > 100%
const [badConcentration] = await db.query(`
  SELECT id, name, concentration 
  FROM molecules 
  WHERE concentration IS NOT NULL 
    AND (concentration < 0 OR concentration > 100)
  LIMIT 20
`);
console.log(`⚠️  Concentrations invalides : ${badConcentration.length}`);
badConcentration.forEach(m => issues.molecules.push({
  type: "CONCENTRATION_INVALIDE", severity: "MEDIUM", id: m.id, name: m.name,
  detail: `Concentration: ${m.concentration}%`
}));

// 1k. Molécules avec threshold (seuil olfactif) aberrant
const [badThreshold] = await db.query(`
  SELECT id, name, threshold 
  FROM molecules 
  WHERE threshold IS NOT NULL 
    AND threshold != ''
    AND threshold NOT REGEXP '^[0-9]'
    AND threshold NOT LIKE '%ppb%'
    AND threshold NOT LIKE '%ppm%'
    AND threshold NOT LIKE '%ng%'
    AND threshold NOT LIKE '%µg%'
    AND threshold NOT LIKE '%mg%'
    AND threshold NOT LIKE '%g/%'
  LIMIT 20
`);
console.log(`⚠️  Seuils olfactifs au format suspect : ${badThreshold.length}`);
badThreshold.forEach(m => issues.molecules.push({
  type: "SEUIL_OLFACTIF_FORMAT_SUSPECT", severity: "LOW", id: m.id, name: m.name,
  detail: `Threshold: "${m.threshold}"`
}));

// ─────────────────────────────────────────────────────────────
// 2. AUDIT DES RECETTES
// ─────────────────────────────────────────────────────────────
console.log("\n📊 ANALYSE DES RECETTES...\n");

// Vérifier la structure de la table recette_ingredients
const [riCols] = await db.query(`SHOW COLUMNS FROM recette_ingredients`);
console.log(`Colonnes recette_ingredients: ${riCols.map(c => c.Field).join(', ')}`);

// 2a. Recettes sans ingrédients
const [emptyRecettes] = await db.query(`
  SELECT r.id, r.name, r.category
  FROM recettes r
  LEFT JOIN recette_ingredients ri ON r.id = ri.recette_id
  WHERE ri.recette_id IS NULL
  LIMIT 30
`);
console.log(`⚠️  Recettes sans ingrédients : ${emptyRecettes.length}`);
emptyRecettes.forEach(r => issues.recettes.push({
  type: "RECETTE_VIDE", severity: "MEDIUM", id: r.id, name: r.name,
  detail: `Catégorie: ${r.category || 'N/A'} — Aucun ingrédient`
}));

// 2b. Recettes avec somme des pourcentages > 105% ou < 50%
const [ingredientSums] = await db.query(`
  SELECT r.id, r.name, r.category,
    SUM(ri.percentage) as total_pct,
    COUNT(ri.id) as nb_ingredients
  FROM recettes r
  JOIN recette_ingredients ri ON r.id = ri.recette_id
  WHERE ri.percentage IS NOT NULL
  GROUP BY r.id, r.name, r.category
  HAVING total_pct > 105 OR total_pct < 50
  ORDER BY total_pct DESC
  LIMIT 50
`);
console.log(`⚠️  Recettes avec somme de pourcentages anormale (>105% ou <50%) : ${ingredientSums.length}`);
ingredientSums.forEach(r => issues.recettes.push({
  type: "POURCENTAGES_INCOHERENTS",
  severity: r.total_pct > 110 ? "HIGH" : "MEDIUM",
  id: r.id, name: r.name,
  detail: `Total: ${parseFloat(r.total_pct).toFixed(1)}% pour ${r.nb_ingredients} ingrédients`
}));

// 2c. Ingrédients avec pourcentage négatif ou > 100%
const [badIngredients] = await db.query(`
  SELECT ri.id, ri.recette_id, ri.percentage, ri.molecule_id,
    r.name as recette_name, m.name as molecule_name
  FROM recette_ingredients ri
  JOIN recettes r ON ri.recette_id = r.id
  LEFT JOIN molecules m ON ri.molecule_id = m.id
  WHERE ri.percentage < 0 OR ri.percentage > 100
  LIMIT 30
`);
console.log(`⚠️  Ingrédients avec pourcentage invalide (<0 ou >100%) : ${badIngredients.length}`);
badIngredients.forEach(i => issues.recettes.push({
  type: "INGREDIENT_POURCENTAGE_INVALIDE", severity: "HIGH",
  id: i.recette_id, name: i.recette_name,
  detail: `${i.molecule_name || 'Molécule inconnue'}: ${i.percentage}%`
}));

// 2d. Ingrédients liés à des molécules inexistantes
const [orphanIngredients] = await db.query(`
  SELECT ri.id, ri.recette_id, ri.molecule_id, ri.percentage,
    r.name as recette_name
  FROM recette_ingredients ri
  JOIN recettes r ON ri.recette_id = r.id
  LEFT JOIN molecules m ON ri.molecule_id = m.id
  WHERE m.id IS NULL AND ri.molecule_id IS NOT NULL
  LIMIT 30
`);
console.log(`⚠️  Ingrédients liés à des molécules inexistantes : ${orphanIngredients.length}`);
orphanIngredients.forEach(i => issues.recettes.push({
  type: "MOLECULE_INEXISTANTE", severity: "HIGH",
  id: i.recette_id, name: i.recette_name,
  detail: `molecule_id: ${i.molecule_id} n'existe pas en base`
}));

// 2e. Recettes avec noms suspects
const [badRecetteNames] = await db.query(`
  SELECT id, name, category 
  FROM recettes 
  WHERE LENGTH(name) < 3 
     OR name REGEXP '^[0-9]+$'
     OR name LIKE '%,%'
     OR name LIKE '%;%'
  LIMIT 20
`);
console.log(`⚠️  Recettes avec noms suspects : ${badRecetteNames.length}`);
badRecetteNames.forEach(r => issues.recettes.push({
  type: "NOM_RECETTE_SUSPECT", severity: "MEDIUM", id: r.id, name: r.name,
  detail: `Longueur: ${r.name.length} caractères`
}));

// 2f. Recettes avec un seul ingrédient (info)
const [singleIngredient] = await db.query(`
  SELECT r.id, r.name, r.category, COUNT(ri.id) as nb_ingredients
  FROM recettes r
  JOIN recette_ingredients ri ON r.id = ri.recette_id
  GROUP BY r.id, r.name, r.category
  HAVING nb_ingredients = 1
  LIMIT 20
`);
console.log(`ℹ️  Recettes avec un seul ingrédient : ${singleIngredient.length} (info)`);

// 2g. Recettes avec des ingrédients en doublon (même molécule deux fois)
const [duplicateIngredients] = await db.query(`
  SELECT ri.recette_id, ri.molecule_id, r.name as recette_name, m.name as molecule_name,
    COUNT(*) as occurrences
  FROM recette_ingredients ri
  JOIN recettes r ON ri.recette_id = r.id
  JOIN molecules m ON ri.molecule_id = m.id
  GROUP BY ri.recette_id, ri.molecule_id
  HAVING occurrences > 1
  LIMIT 20
`);
console.log(`⚠️  Ingrédients en doublon dans une même recette : ${duplicateIngredients.length}`);
duplicateIngredients.forEach(i => issues.recettes.push({
  type: "INGREDIENT_DOUBLON", severity: "MEDIUM",
  id: i.recette_id, name: i.recette_name,
  detail: `${i.molecule_name} apparaît ${i.occurrences} fois`
}));

// ─────────────────────────────────────────────────────────────
// 3. STATISTIQUES GLOBALES
// ─────────────────────────────────────────────────────────────

const [totalMols] = await db.query(`SELECT COUNT(*) as n FROM molecules`);
const [totalRecettes] = await db.query(`SELECT COUNT(*) as n FROM recettes`);
const [totalIngredients] = await db.query(`SELECT COUNT(*) as n FROM recette_ingredients`);

const molIssuesByType = {};
const recIssuesByType = {};
issues.molecules.forEach(i => { molIssuesByType[i.type] = (molIssuesByType[i.type] || 0) + 1; });
issues.recettes.forEach(i => { recIssuesByType[i.type] = (recIssuesByType[i.type] || 0) + 1; });

const highMol = issues.molecules.filter(i => i.severity === "HIGH").length;
const medMol = issues.molecules.filter(i => i.severity === "MEDIUM").length;
const highRec = issues.recettes.filter(i => i.severity === "HIGH").length;
const medRec = issues.recettes.filter(i => i.severity === "MEDIUM").length;

console.log("\n" + "=".repeat(60));
console.log("📋 RÉSUMÉ DE L'AUDIT");
console.log("=".repeat(60));
console.log(`\nBase de données :`);
console.log(`  Molécules totales : ${totalMols[0].n}`);
console.log(`  Recettes totales  : ${totalRecettes[0].n}`);
console.log(`  Ingrédients totaux: ${totalIngredients[0].n}`);

console.log(`\nAnomalies molécules (${issues.molecules.length} total) :`);
console.log(`  HIGH   : ${highMol}`);
console.log(`  MEDIUM : ${medMol}`);
Object.entries(molIssuesByType).sort((a,b) => b[1]-a[1]).forEach(([type, count]) => {
  console.log(`    · ${type}: ${count}`);
});

console.log(`\nAnomalies recettes (${issues.recettes.length} total) :`);
console.log(`  HIGH   : ${highRec}`);
console.log(`  MEDIUM : ${medRec}`);
Object.entries(recIssuesByType).sort((a,b) => b[1]-a[1]).forEach(([type, count]) => {
  console.log(`    · ${type}: ${count}`);
});

// Export JSON
const report = {
  date: new Date().toISOString(),
  database: {
    total_molecules: totalMols[0].n,
    total_recettes: totalRecettes[0].n,
    total_ingredients: totalIngredients[0].n
  },
  molecules: {
    total_issues: issues.molecules.length,
    high_severity: highMol,
    medium_severity: medMol,
    by_type: molIssuesByType,
    issues: issues.molecules
  },
  recettes: {
    total_issues: issues.recettes.length,
    high_severity: highRec,
    medium_severity: medRec,
    by_type: recIssuesByType,
    issues: issues.recettes
  },
  details: {
    short_names: shortNames,
    csv_names: csvNames,
    bad_formulas: badFormulas,
    bad_cas: badCAS,
    bad_mw: badMW,
    bad_therapeutic: badTherapeutic,
    inconsistent_family: inconsistentFamily,
    potential_duplicates: potentialDuplicates.slice(0, 100),
    bad_physical: badPhysical,
    bad_concentration: badConcentration,
    empty_recettes: emptyRecettes,
    ingredient_sums: ingredientSums,
    bad_ingredients: badIngredients,
    orphan_ingredients: orphanIngredients,
    single_ingredient: singleIngredient,
    duplicate_ingredients: duplicateIngredients,
    bad_recette_names: badRecetteNames
  }
};

writeFileSync("/tmp/audit-report.json", JSON.stringify(report, null, 2));
console.log("\n✅ Rapport exporté dans /tmp/audit-report.json");

await db.end();
