import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // === MOLÉCULES ===
  const [[{n: molTotal}]] = await conn.query('SELECT COUNT(*) as n FROM molecules');
  const [molStatus] = await conn.query('SELECT validation_status, COUNT(*) as n FROM molecules GROUP BY validation_status');
  const [[{n: molCAS}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE cas_number IS NOT NULL AND cas_number != ""');
  const [[{n: molSMILES}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE smiles IS NOT NULL AND smiles != ""');
  const [[{n: molInChI}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE inchi IS NOT NULL AND inchi != ""');
  const [[{n: molMass}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE exact_mass IS NOT NULL');
  const [[{n: molFamily}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily IS NOT NULL AND chemicalFamily != ""');
  const [[{n: molOdor}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE olfactiveProfile IS NOT NULL AND olfactiveProfile != ""');
  const [[{n: molClass}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE chemical_class IS NOT NULL AND chemical_class != ""');
  const [molFamilyDist] = await conn.query('SELECT chemicalFamily as family, COUNT(*) as n FROM molecules WHERE chemicalFamily IS NOT NULL GROUP BY chemicalFamily ORDER BY n DESC LIMIT 15');
  const [[{n: molDraft}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE validation_status = "brouillon"');
  const [[{n: molReview}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE validation_status = "en_revision"');
  const [[{n: molValidated}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE validation_status = "validee"');
  const [[{n: molNoCAS}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE (cas_number IS NULL OR cas_number = "") AND validation_status != "validee"');
  const [[{n: molNoSMILES}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE smiles IS NULL OR smiles = ""');
  const [[{n: molNoFamily}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily IS NULL OR chemicalFamily = ""');
  const [[{n: molNoOdor}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE olfactiveProfile IS NULL OR olfactiveProfile = ""');
  const [[{n: molPubChemCID}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE pubchem_cid IS NOT NULL');
  const [[{n: molIFRA}]] = await conn.query('SELECT COUNT(*) as n FROM molecules WHERE ifra_status IS NOT NULL AND ifra_status != ""');

  // === PLANTES ===
  const [[{n: plantTotal}]] = await conn.query('SELECT COUNT(*) as n FROM plants');
  const [[{n: plantKoppen}]] = await conn.query('SELECT COUNT(*) as n FROM plants WHERE koppen_zone IS NOT NULL AND koppen_zone != ""');
  const [[{n: plantOlfactory}]] = await conn.query('SELECT COUNT(*) as n FROM plants WHERE olfactive_signature IS NOT NULL AND olfactive_signature != ""');
  const [[{n: plantMolLinks}]] = await conn.query('SELECT COUNT(DISTINCT plant_id) as n FROM plant_molecules');
  const [[{n: plantMolTotal}]] = await conn.query('SELECT COUNT(*) as n FROM plant_molecules');
  const [[{n: plantNoMol}]] = await conn.query('SELECT COUNT(*) as n FROM plants p WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id = p.id)');
  const [[{n: plantWithGPS}]] = await conn.query('SELECT COUNT(*) as n FROM plants WHERE latitude IS NOT NULL');

  // === TABACS ===
  const [[{n: tabacTotal}]] = await conn.query('SELECT COUNT(*) as n FROM tabacs');
  const [[{n: tabacTerroir}]] = await conn.query('SELECT COUNT(DISTINCT t.id) as n FROM tabacs t JOIN tabac_terroir_links ttl ON ttl.tabac_id = t.id');
  const [[{n: tabacMolLinks}]] = await conn.query('SELECT COUNT(DISTINCT tabac_id) as n FROM tabac_molecule_links');
  const [[{n: tabacAromatic}]] = await conn.query('SELECT COUNT(*) as n FROM tabacs WHERE aromaticProfile IS NOT NULL AND aromaticProfile != ""');

  // === SYNERGIES ===
  const [[{n: synTotal}]] = await conn.query('SELECT COUNT(*) as n FROM synergies');
  const [synType] = await conn.query('SELECT type, COUNT(*) as n FROM synergies GROUP BY type ORDER BY n DESC');
  // Synergies moléculaires avancées
  const [[{n: molSynTotal}]] = await conn.query('SELECT COUNT(*) as n FROM molecule_synergies');
  const [molSynType] = await conn.query('SELECT type as synergy_type, COUNT(*) as n FROM molecule_synergies GROUP BY type ORDER BY n DESC LIMIT 8');

  // === BIBLIOGRAPHIE ===
  const [[{n: bibTotal}]] = await conn.query('SELECT COUNT(*) as n FROM bibliography_entries');
  const [[{n: bibLinked}]] = await conn.query('SELECT COUNT(DISTINCT bibliography_id) as n FROM bibliography_entity_links');
  const [[{n: bibLinks}]] = await conn.query('SELECT COUNT(*) as n FROM bibliography_entity_links');

  // === ACCORDS ===
  const [[{n: accordTotal}]] = await conn.query('SELECT COUNT(*) as n FROM accords');
  const [[{n: accordDesc}]] = await conn.query('SELECT COUNT(*) as n FROM accords WHERE description IS NOT NULL AND description != ""');
  const [[{n: accordMolLinks}]] = await conn.query('SELECT COUNT(DISTINCT accordId) as n FROM molecule_accords');

  // === RECETTES ===
  const [[{n: recetteTotal}]] = await conn.query('SELECT COUNT(*) as n FROM recettes');
  const [[{n: recetteDesc}]] = await conn.query('SELECT COUNT(*) as n FROM recettes WHERE description IS NOT NULL AND description != ""');
  // Recettes cigarillos
  const [[{n: cigarilloTotal}]] = await conn.query('SELECT COUNT(*) as n FROM cigarillo_recipes');
  const [[{n: cigarilloTerpenes}]] = await conn.query('SELECT COUNT(*) as n FROM cigarillo_recipes WHERE terpene_profile IS NOT NULL AND terpene_profile != "" AND terpene_profile != "null"');

  // === TERROIRS ===
  const [[{n: terroirTotal}]] = await conn.query('SELECT COUNT(*) as n FROM terroirs');
  const [[{n: terroirGPS}]] = await conn.query('SELECT COUNT(*) as n FROM terroirs WHERE latitude IS NOT NULL');
  const [[{n: terroirDesc}]] = await conn.query('SELECT COUNT(*) as n FROM terroirs WHERE notes IS NOT NULL AND notes != ""');
  const [[{n: terroirPlantLinks}]] = await conn.query('SELECT COUNT(DISTINCT terroir_id) as n FROM plant_terroirs');

  // === PARFUMS ===
  const [[{n: parfumTotal}]] = await conn.query('SELECT COUNT(DISTINCT perfume_name) as n FROM molecule_perfumes');
  const [[{n: molPerfumLinks}]] = await conn.query('SELECT COUNT(*) as n FROM molecule_perfumes');
  const [[{n: plantPerfumLinks}]] = await conn.query('SELECT COUNT(*) as n FROM plant_perfumes');
  const [[{n: molsWithPerfumLinks}]] = await conn.query('SELECT COUNT(DISTINCT molecule_id) as n FROM molecule_perfumes');

  // === VARIÉTÉS ===
  const [[{n: varietyTotal}]] = await conn.query('SELECT COUNT(*) as n FROM varieties');
  const [[{n: genealogyLinks}]] = await conn.query('SELECT COUNT(*) as n FROM variety_genealogy');

  // === PYROLYSE ===
  const [[{n: pyroTotal}]] = await conn.query('SELECT COUNT(*) as n FROM pyrolysis_transformations');

  // === FOURNISSEURS ===
  const [[{n: supplierTotal}]] = await conn.query('SELECT COUNT(*) as n FROM extended_suppliers');
  const [supplierCat] = await conn.query('SELECT LEFT(supplier_id, 5) as cat, COUNT(*) as n FROM extended_suppliers GROUP BY cat');

  // === LANDRACES ===
  const [[{n: landraceTotal}]] = await conn.query('SELECT COUNT(*) as n FROM landraces');
  const [[{n: landraceTerpenes}]] = await conn.query('SELECT COUNT(DISTINCT landrace_id) as n FROM landrace_terpene_profiles');

  // === RÉSUMÉ GLOBAL ===
  const data = {
    molecules: {
      total: molTotal,
      validated: molValidated,
      inReview: molReview,
      draft: molDraft,
      withCAS: molCAS,
      withSMILES: molSMILES,
      withInChI: molInChI,
      withMass: molMass,
      withFamily: molFamily,
      withOdor: molOdor,
      withClass: molClass,
      withPubChemCID: molPubChemCID,
      withIFRA: molIFRA,
      noCAS: molNoCAS,
      noSMILES: molNoSMILES,
      noFamily: molNoFamily,
      noOdor: molNoOdor,
      topFamilies: molFamilyDist,
    },
    plants: {
      total: plantTotal,
      withKoppen: plantKoppen,
      withOlfactory: plantOlfactory,
      withMolLinks: plantMolLinks,
      totalMolLinks: plantMolTotal,
      withoutMolecules: plantNoMol,
      withGPS: plantWithGPS,
    },
    tobacco: {
      total: tabacTotal,
      withTerroir: tabacTerroir,
      withMolLinks: tabacMolLinks,
      withAromatic: tabacAromatic,
    },
    synergies: {
      total: synTotal,
      byType: synType,
      molecularSynergies: molSynTotal,
      molSynByType: molSynType,
    },
    bibliography: {
      total: bibTotal,
      refsLinked: bibLinked,
      totalLinks: bibLinks,
    },
    accords: {
      total: accordTotal,
      withDescription: accordDesc,
      withMolLinks: accordMolLinks,
    },
    recipes: {
      total: recetteTotal,
      withDescription: recetteDesc,
      cigarilloTotal: cigarilloTotal,
      cigarilloWithTerpenes: cigarilloTerpenes,
    },
    terroirs: {
      total: terroirTotal,
      withGPS: terroirGPS,
      withDescription: terroirDesc,
      withPlantLinks: terroirPlantLinks,
    },
    perfumes: {
      distinctPerfumes: parfumTotal,
      molPerfumLinks: molPerfumLinks,
      plantPerfumLinks: plantPerfumLinks,
      molsWithPerfumLinks: molsWithPerfumLinks,
    },
    varieties: {
      total: varietyTotal,
      genealogyLinks: genealogyLinks,
    },
    pyrolysis: {
      total: pyroTotal,
    },
    suppliers: {
      total: supplierTotal,
      byCategory: supplierCat,
    },
    landraces: {
      total: landraceTotal,
      withTerpenes: landraceTerpenes,
    },
  };

  console.log(JSON.stringify(data, null, 2));
  await conn.end();
}

main().catch(console.error);
