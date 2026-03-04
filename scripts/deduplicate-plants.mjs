/**
 * Déduplication des plantes
 * 
 * Pour chaque groupe de plantes avec le même nom (insensible à la casse) :
 * 1. Garder la plante avec le plus d'informations (latin_name, family, etc.)
 * 2. Transférer toutes les relations plant_molecules vers la plante conservée
 * 3. Supprimer les doublons
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== DÉDUPLICATION DES PLANTES ===\n');

// 1. Trouver tous les groupes de doublons
const [dupGroups] = await conn.execute(`
  SELECT LOWER(TRIM(name)) as name_lower, COUNT(*) as cnt
  FROM plants 
  GROUP BY LOWER(TRIM(name)) 
  HAVING cnt > 1 
  ORDER BY cnt DESC
`);

console.log(`📊 ${dupGroups.length} groupes de doublons trouvés\n`);

let totalMerged = 0;
let totalDeleted = 0;

for (const group of dupGroups) {
  // Récupérer toutes les plantes de ce groupe
  const [plants] = await conn.execute(`
    SELECT id, name, latin_name, family, category, origin, habitat, olfactive_signature,
           dominant_molecules, traditional_use, notes, conservation_status
    FROM plants 
    WHERE LOWER(TRIM(name)) = ?
    ORDER BY 
      CASE WHEN latin_name IS NOT NULL AND latin_name != 'null' AND latin_name != '' THEN 0 ELSE 1 END,
      CASE WHEN family IS NOT NULL AND family != 'null' AND family != '' THEN 0 ELSE 1 END,
      id ASC
  `, [group.name_lower]);

  if (plants.length <= 1) continue;

  // La première plante (la plus complète) est celle qu'on garde
  const keeper = plants[0];
  const duplicates = plants.slice(1);

  // Enrichir la plante conservée avec les données des doublons
  let updates = {};
  for (const dup of duplicates) {
    if (!keeper.latin_name && dup.latin_name && dup.latin_name !== 'null') {
      updates.latin_name = dup.latin_name;
    }
    if (!keeper.family && dup.family && dup.family !== 'null') {
      updates.family = dup.family;
    }
    if (!keeper.olfactive_signature && dup.olfactive_signature) {
      updates.olfactive_signature = dup.olfactive_signature;
    }
    if (!keeper.traditional_use && dup.traditional_use) {
      updates.traditional_use = dup.traditional_use;
    }
    if (!keeper.notes && dup.notes) {
      updates.notes = dup.notes;
    }
  }

  // Mettre à jour la plante conservée si nécessaire
  if (Object.keys(updates).length > 0) {
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), keeper.id];
    await conn.execute(`UPDATE plants SET ${setClauses} WHERE id = ?`, values);
  }

  // Transférer les relations plant_molecules des doublons vers la plante conservée
  for (const dup of duplicates) {
    const [dupRels] = await conn.execute(
      `SELECT molecule_id, percentage, source FROM plant_molecules WHERE plant_id = ?`,
      [dup.id]
    );

    for (const rel of dupRels) {
      // Vérifier si la relation existe déjà pour la plante conservée
      const [existing] = await conn.execute(
        `SELECT 1 FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
        [keeper.id, rel.molecule_id]
      );

      if (existing.length === 0) {
        // Créer la relation pour la plante conservée
        await conn.execute(
          `INSERT INTO plant_molecules (plant_id, molecule_id, percentage, source) VALUES (?, ?, ?, ?)`,
          [keeper.id, rel.molecule_id, rel.percentage, rel.source]
        );
        totalMerged++;
      }
    }

    // Supprimer les relations du doublon
    await conn.execute(`DELETE FROM plant_molecules WHERE plant_id = ?`, [dup.id]);
    
    // Supprimer le doublon
    await conn.execute(`DELETE FROM plants WHERE id = ?`, [dup.id]);
    totalDeleted++;
  }

  if (duplicates.length > 0) {
    console.log(`✅ "${keeper.name}" : gardé ID ${keeper.id}, supprimé ${duplicates.length} doublon(s) [${duplicates.map(d => d.id).join(', ')}]`);
  }
}

console.log(`\n=== RÉSUMÉ ===`);
console.log(`🗑️  Plantes supprimées : ${totalDeleted}`);
console.log(`🔗 Relations transférées : ${totalMerged}`);

// Vérification finale
const [total] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants`);
const [links] = await conn.execute(`SELECT COUNT(*) as cnt FROM plant_molecules`);
const [remainingDups] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM (
    SELECT LOWER(TRIM(name)) as n FROM plants GROUP BY LOWER(TRIM(name)) HAVING COUNT(*) > 1
  ) t
`);

console.log(`\n📊 ÉTAT FINAL`);
console.log(`  Plantes : ${total[0].cnt}`);
console.log(`  Relations : ${links[0].cnt}`);
console.log(`  Groupes de doublons restants : ${remainingDups[0].cnt}`);

await conn.end();
console.log('\n✅ Déduplication terminée');
