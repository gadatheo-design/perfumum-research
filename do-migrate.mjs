import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/perfumum-research/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// DONNÉES DE MIGRATION
// ============================================================

// → PLANTES : espèces botaniques à migrer (non encore dans plants)
const MIGRATE_TO_PLANTS = [
  { molName: 'Ambrette seed',                              plantName: 'Ambrette seed',                              family: 'Malvaceae',       notes: 'Abelmoschus moschatus — musc végétal, graine utilisée en parfumerie.' },
  { molName: 'Calycolpus Moritzianus (Guayabita)',         plantName: 'Calycolpus moritzianus',                     family: 'Myrtaceae',       notes: 'Arbre fruitier d\'Amérique du Sud, notes fruitées-épicées. Synonyme : Guayabita del Perú.' },
  { molName: 'Calycolpus Moritzianus',                     plantName: null, // doublon → supprimer uniquement
                                                           family: null, notes: null },
  { molName: 'Borrachero (Brugmansia)',                    plantName: 'Borrachero',                                 family: 'Solanaceae',      notes: 'Brugmansia spp. — arbre des Andes, fleurs très parfumées, plante psychoactive et sacrée.' },
  { molName: 'Borrachero',                                 plantName: null, // doublon → supprimer uniquement
                                                           family: null, notes: null },
  { molName: 'Coca Décocaïnisée (Erythroxylum coca)',      plantName: 'Coca Décocaïnisée',                          family: 'Erythroxylaceae', notes: 'Erythroxylum coca — feuilles décocaïnisées, notes herbacées-vertes, utilisées en parfumerie expérimentale.' },
  { molName: 'Coca Décocaïnisée',                          plantName: null, // doublon → supprimer uniquement
                                                           family: null, notes: null },
  { molName: 'Cedro Rosado (Cedrela odorata)',             plantName: 'Cedro Rosado',                               family: 'Meliaceae',       notes: 'Cedrela odorata — cèdre tropical d\'Amérique, bois rosé aux notes boisées-cèdre douces.' },
  { molName: 'Cedro Rosado',                               plantName: null, // doublon → supprimer uniquement
                                                           family: null, notes: null },
  { molName: 'Bois de rose — Aniba rosaeodora (CITES)',    plantName: 'Bois de rose',                               family: 'Lauraceae',       notes: 'Aniba rosaeodora — espèce CITES, bois de rose d\'Amazonie, source de linalol naturel.' },
  { molName: 'Bois de rose (lutherie) — Dalbergia nigra (CITES)', plantName: null, // déjà dans plants
                                                           family: null, notes: null },
  { molName: 'Bois de santal rouge — Pterocarpus santalinus', plantName: null, // déjà dans plants
                                                           family: null, notes: null },
  { molName: 'Comino (Colombie) — Aniba perutilis (menacé)', plantName: 'Comino (Colombie)',                        family: 'Lauraceae',       notes: 'Aniba perutilis — arbre menacé d\'Amérique du Sud, bois précieux aux notes boisées-épicées.' },
  { molName: 'Costus root — Saussurea costus (CITES)',     plantName: 'Costus root',                                family: 'Asteraceae',      notes: 'Saussurea costus — espèce CITES, racine aux notes terreuses-animales, utilisée en parfumerie orientale.' },
  { molName: 'Ambrette — Abelmoschus moschatus (musc végétal)', plantName: 'Ambrette',                             family: 'Malvaceae',       notes: 'Abelmoschus moschatus — musc végétal, graine et plante entière utilisées en parfumerie.' },
  { molName: 'Cypriol (Nagarmotha HE)',                    plantName: 'Cypriol (Nagarmotha)',                       family: 'Cyperaceae',      notes: 'Cyperus scariosus — plante des zones humides d\'Inde, rhizome utilisé pour l\'HE de Nagarmotha.' },
  { molName: 'Damiana',                                    plantName: null, // déjà dans plants
                                                           family: null, notes: null },
];

// → MATIÈRES PREMIÈRES : à migrer (non encore dans raw_materials)
const MIGRATE_TO_RM = [
  { molName: 'Castoreum Naturel', rmName: 'Castoreum Naturel', category: 'matiere_animale', notes: 'Sécrétion des glandes de castor (Castor fiber), notes cuirées-animales-fumées.' },
  { molName: 'Cyperone',         rmName: 'Cyperone',           category: 'molecule_isolee', notes: 'Cétone sesquiterpénique issue du Cypriol (Cyperus scariosus), notes terreuses-boisées.' },
];

// ============================================================
// IDs des entrées molecules à supprimer (toutes les 66)
// ============================================================
const ALL_MOL_NAMES = [
  ...MIGRATE_TO_PLANTS.map(x => x.molName),
  ...MIGRATE_TO_RM.map(x => x.molName),
  // Entrées déjà dans raw_materials (doublons purs → supprimer de molecules)
  'Clay smoke','Bitume light','Créosote light','Ammonium-Maillard','Bone-smoke accord','Dust-burn accord',
  'Benzoin Siam','Complexes terre minérale','Bergamote italienne HE (extrait)','Artisan Peppermint Oil',
  'Crème de Citronnelle','Black Emerald','Ambrox Super','Cardamome (α-Terpinyl Acetate)',
  'Clearwood (Patchouli Synthétique)','Café Geisha - Grains Verts','Cacao Colombien - Fèves Fermentées',
  'Douglas Fir Essential Oil','Balsam Fir Essential Oil','Black Spruce Essential Oil','Birch Tar North American',
  'Citrus sec','Argile blanche','Bois tendre','Cèdre beige','Cuir fumé','Bois de brousse','Ambre profond',
  'Charcoal africain','Bois sec','Cèdre clair','Citron sec','Copal Colombien (Protium spp.)',
  'Baume de Tolú (Myroxylon balsamum)','Copal Colombien','Baume de Tolú','Café Geisha','Cacao Colombien',
  'Cèdre de l\'Atlas HE (extrait)','BENZOIN RESIN','Calcaire Olfactif','Cuivre Olfactif','Bronze Note',
  'Crésol Fumé','Castoreum','Copal Negro','Copal Blanco',
];

console.log('\n=== DÉBUT DE LA MIGRATION ===\n');
let migrated_plants = 0, migrated_rm = 0, deleted = 0;

// 1. Migrer vers plants (entrées uniques non encore présentes)
for (const item of MIGRATE_TO_PLANTS) {
  if (!item.plantName) continue; // doublon ou déjà présent → juste supprimer

  // Vérifier si déjà dans plants
  const [existing] = await conn.query('SELECT id FROM plants WHERE name = ? LIMIT 1', [item.plantName]);
  if (existing.length > 0) {
    console.log(`  [SKIP plants] "${item.plantName}" déjà présent (id=${existing[0].id})`);
    continue;
  }

  // Récupérer les données depuis molecules
  const [molRows] = await conn.query('SELECT * FROM molecules WHERE name = ? LIMIT 1', [item.molName]);
  if (molRows.length === 0) {
    console.log(`  [WARN] Molécule "${item.molName}" non trouvée en base`);
    continue;
  }
  const mol = molRows[0];

  // Insérer dans plants
  await conn.query(
    `INSERT INTO plants (name, family, notes, created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [item.plantName, item.family || null, item.notes || mol.notes || null]
  );
  console.log(`  [→ plants] "${item.plantName}" (famille: ${item.family})`);
  migrated_plants++;
}

// 2. Migrer vers raw_materials (entrées uniques non encore présentes)
for (const item of MIGRATE_TO_RM) {
  const [existing] = await conn.query('SELECT id FROM raw_materials WHERE name = ? LIMIT 1', [item.rmName]);
  if (existing.length > 0) {
    console.log(`  [SKIP raw_materials] "${item.rmName}" déjà présent (id=${existing[0].id})`);
    continue;
  }

  const [molRows] = await conn.query('SELECT * FROM molecules WHERE name = ? LIMIT 1', [item.molName]);
  if (molRows.length === 0) {
    console.log(`  [WARN] Molécule "${item.molName}" non trouvée en base`);
    continue;
  }
  const mol = molRows[0];

  // Générer un material_id unique
  const prefix = item.category === 'matiere_animale' ? 'AN' : 'MOL';
  const slug = item.rmName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
  const material_id = `${prefix}-${slug}-${Date.now().toString().slice(-4)}`;
  await conn.query(
    `INSERT INTO raw_materials (material_id, name, category, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [material_id, item.rmName, item.category || null, item.notes || mol.notes || null]
  );
  console.log(`  [→ raw_materials] "${item.rmName}" (catégorie: ${item.category})`);
  migrated_rm++;
}

// 3. Supprimer toutes les entrées mal classées de molecules
// D'abord récupérer les IDs concernés
const uniqueNames = [...new Set(ALL_MOL_NAMES)];
const placeholders = uniqueNames.map(() => '?').join(',');
const [molIds] = await conn.query(
  `SELECT id FROM molecules WHERE name IN (${placeholders})`,
  uniqueNames
);
const ids = molIds.map(r => r.id);
if (ids.length > 0) {
  const idPlaceholders = ids.map(() => '?').join(',');
  // Supprimer toutes les dépendances FK (tables référençant molecules.id)
  const FK_TABLES = [
    { table: 'molecule_synergies',        col: 'molecule1_id' },
    { table: 'molecule_synergies',        col: 'molecule2_id' },
    { table: 'terpene_synergies',         col: 'terpene1_id' },
    { table: 'terpene_synergies',         col: 'terpene2_id' },
    { table: 'synergies',                 col: 'molecule_id' },
    { table: 'ifra_restrictions',         col: 'molecule_id' },
    { table: 'laboratoire_molecules',     col: 'moleculeId' },
    { table: 'leaf_economy_molecules',    col: 'molecule_id' },
    { table: 'molecular_transformations', col: 'source_molecule_id' },
    { table: 'molecular_transformations', col: 'product_molecule_id' },
    { table: 'molecule_accords',          col: 'moleculeId' },
    { table: 'molecule_chemical_families',col: 'moleculeId' },
    { table: 'molecule_families',         col: 'moleculeId' },
    { table: 'molecule_notes',            col: 'molecule_id' },
    { table: 'molecule_origins',          col: 'molecule_id' },
    { table: 'molecule_perfumes',         col: 'molecule_id' },
    { table: 'molecule_plant_sources',    col: 'molecule_id' },
    { table: 'molecule_recettes',         col: 'moleculeId' },
    { table: 'petrichor_molecules',       col: 'moleculeId' },
    { table: 'plant_molecules',           col: 'molecule_id' },
    { table: 'prototype_molecules',       col: 'moleculeId' },
    { table: 'publication_molecules',     col: 'molecule_id' },
    { table: 'raw_material_molecules',    col: 'molecule_id' },
    { table: 'recette_molecules',         col: 'molecule_id' },
    { table: 'tabac_molecules',           col: 'moleculeId' },
    { table: 'tabac_molecule_links',      col: 'molecule_id' },
    { table: 'terp_profile_molecules',    col: 'molecule_id' },
    { table: 'volcanique_molecules',      col: 'moleculeId' },
  ];
  for (const { table, col } of FK_TABLES) {
    const [hasT] = await conn.query(`SHOW TABLES LIKE '${table}'`);
    if (hasT.length > 0) {
      const [r] = await conn.query(`DELETE FROM ${table} WHERE ${col} IN (${idPlaceholders})`, ids);
      if (r.affectedRows > 0) console.log(`    [FK clean] ${table}.${col} : ${r.affectedRows} lignes supprimées`);
    }
  }
  // Supprimer les molécules
  const [delResult] = await conn.query(
    `DELETE FROM molecules WHERE id IN (${idPlaceholders})`,
    ids
  );
  deleted = delResult.affectedRows;
}
console.log(`\n  [DELETE] ${deleted} entrées supprimées de molecules`);

// 4. Rapport final
console.log('\n=== RAPPORT FINAL ===');
console.log(`  Migrées vers plants       : ${migrated_plants}`);
console.log(`  Migrées vers raw_materials: ${migrated_rm}`);
console.log(`  Supprimées de molecules   : ${deleted}`);

// Vérification
const [countMol] = await conn.query('SELECT COUNT(*) as c FROM molecules');
const [countPlants] = await conn.query('SELECT COUNT(*) as c FROM plants');
const [countRM] = await conn.query('SELECT COUNT(*) as c FROM raw_materials');
console.log(`\n  molecules total    : ${countMol[0].c}`);
console.log(`  plants total       : ${countPlants[0].c}`);
console.log(`  raw_materials total: ${countRM[0].c}`);

await conn.end();
console.log('\n=== MIGRATION TERMINÉE ===\n');
