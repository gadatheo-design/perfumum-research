/**
 * Audit complet de la base de données PERFUMUM
 * Usage : node scripts/audit-db.mjs
 */
import mysql2 from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const conn = await mysql2.createConnection(DATABASE_URL);
const q = async (sql) => { const [[r]] = await conn.execute(sql); return Object.values(r)[0]; };

const d = {};

// MOLÉCULES
d.mol_total = await q('SELECT COUNT(*) FROM molecules');
d.mol_no_cas = await q("SELECT COUNT(*) FROM molecules WHERE cas_number IS NULL OR cas_number = ''");
d.mol_no_formula = await q("SELECT COUNT(*) FROM molecules WHERE chemicalFormula IS NULL OR chemicalFormula = ''");
d.mol_no_smiles = await q("SELECT COUNT(*) FROM molecules WHERE smiles IS NULL OR smiles = ''");
d.mol_no_source = await q('SELECT COUNT(DISTINCT m.id) FROM molecules m LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id WHERE pm.plant_id IS NULL');
d.mol_no_therapeutic = await q("SELECT COUNT(*) FROM molecules WHERE therapeuticProperties IS NULL OR therapeuticProperties = ''");
d.mol_no_olfactive = await q("SELECT COUNT(*) FROM molecules WHERE olfactiveProfile IS NULL OR olfactiveProfile = ''");
d.mol_no_pubchem = await q('SELECT COUNT(*) FROM molecules WHERE pubchem_cid IS NULL');
d.mol_no_inchikey = await q("SELECT COUNT(*) FROM molecules WHERE inchi_key IS NULL OR inchi_key = ''");
d.mol_no_iupac = await q("SELECT COUNT(*) FROM molecules WHERE iupac_name IS NULL OR iupac_name = ''");
d.mol_no_ifra = await q('SELECT COUNT(*) FROM molecules WHERE ifra_status IS NULL');
d.mol_no_chebi = await q('SELECT COUNT(*) FROM molecules WHERE chebi_id IS NULL');

// PLANTES
d.plant_total = await q('SELECT COUNT(*) FROM plants');
d.plant_no_image = await q("SELECT COUNT(*) FROM plants WHERE image_url IS NULL OR image_url = ''");
d.plant_no_origin = await q("SELECT COUNT(*) FROM plants WHERE origin IS NULL OR origin = ''");
d.plant_no_therapeutic = await q("SELECT COUNT(*) FROM plants WHERE therapeutic_properties IS NULL OR therapeutic_properties = ''");
d.plant_no_gbif = await q("SELECT COUNT(*) FROM plants WHERE gbif_id IS NULL AND latin_name IS NOT NULL AND latin_name != ''");
d.plant_no_synonyms = await q('SELECT COUNT(*) FROM plants WHERE synonyms IS NULL');
d.plant_no_author = await q("SELECT COUNT(*) FROM plants WHERE author_citation IS NULL OR author_citation = ''");
d.plant_no_conservation = await q("SELECT COUNT(*) FROM plants WHERE conservation_status IS NULL OR conservation_status = ''");
d.plant_no_ethnobotanical = await q("SELECT COUNT(*) FROM plants WHERE ethnobotanical_uses IS NULL OR ethnobotanical_uses = ''");

// Catégories plantes
const [cats] = await conn.execute('SELECT category, COUNT(*) as cnt FROM plants GROUP BY category ORDER BY cnt DESC LIMIT 30');
d.plant_categories = cats;

// VARIÉTÉS
d.var_total = await q('SELECT COUNT(*) FROM varieties');
d.var_no_molecules = await q('SELECT COUNT(DISTINCT v.id) FROM varieties v LEFT JOIN variety_molecules vm ON v.id = vm.variety_id WHERE vm.variety_id IS NULL');
d.var_no_genealogy = await q('SELECT COUNT(DISTINCT v.id) FROM varieties v LEFT JOIN variety_genealogy vg ON v.id = vg.variety_id WHERE vg.variety_id IS NULL');
d.var_no_terpene = await q("SELECT COUNT(*) FROM varieties WHERE terpene_profile IS NULL OR terpene_profile = ''");

// RECETTES
d.rec_total = await q('SELECT COUNT(*) FROM recettes');
d.rec_no_formula = await q('SELECT COUNT(*) FROM recettes WHERE formula IS NULL');
d.rec_no_notes = await q("SELECT COUNT(*) FROM recettes WHERE notes_tete IS NULL OR notes_tete = ''");

// PYROLYSE
d.pyro_total = await q('SELECT COUNT(*) FROM pyrolysis_transformations');
d.pyro_no_notes = await q("SELECT COUNT(*) FROM pyrolysis_transformations WHERE notes IS NULL OR notes = ''");
d.pyro_no_temp = await q("SELECT COUNT(*) FROM pyrolysis_transformations WHERE temperature_range IS NULL OR temperature_range = ''");

// TERROIRS
d.terroir_total = await q('SELECT COUNT(*) FROM terroirs');
d.terroir_no_gps = await q('SELECT COUNT(*) FROM terroirs WHERE latitude IS NULL OR longitude IS NULL');

// ACCORDS
const [accTables] = await conn.execute("SHOW TABLES LIKE 'accords'");
if (accTables.length > 0) {
  d.accord_total = await q('SELECT COUNT(*) FROM accords');
  d.accord_no_desc = await q("SELECT COUNT(*) FROM accords WHERE description IS NULL OR description = ''");
}

console.log(JSON.stringify(d, null, 2));
await conn.end();
