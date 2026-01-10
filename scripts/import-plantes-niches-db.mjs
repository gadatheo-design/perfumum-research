/**
 * Script d'import des plantes de niche directement dans la base de données
 * Utilise les procédures tRPC existantes via appel HTTP
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les données transformées
const transformedPath = path.join(__dirname, '..', 'plantes_niches_transformed.json');
const plants = JSON.parse(fs.readFileSync(transformedPath, 'utf-8'));

console.log(`\n📦 ${plants.length} plantes de niche prêtes à être importées\n`);

// Générer les instructions SQL INSERT
const sqlStatements = [];

for (const plant of plants) {
  const escapedName = plant.name.replace(/'/g, "''");
  const escapedLatinName = plant.latinName ? plant.latinName.replace(/'/g, "''") : null;
  const escapedFamily = plant.family ? plant.family.replace(/'/g, "''") : null;
  const escapedOrigin = plant.origin ? plant.origin.replace(/'/g, "''") : null;
  const escapedOlfactive = plant.olfactiveSignature ? plant.olfactiveSignature.replace(/'/g, "''") : null;
  const escapedDominant = plant.dominantMolecules ? plant.dominantMolecules.replace(/'/g, "''") : null;
  const escapedTraditional = plant.traditionalUse ? plant.traditionalUse.replace(/'/g, "''") : null;
  const escapedNotes = plant.notes ? plant.notes.replace(/'/g, "''") : null;

  const sql = `INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('${escapedName}', ${escapedLatinName ? `'${escapedLatinName}'` : 'NULL'}, ${escapedFamily ? `'${escapedFamily}'` : 'NULL'}, '${plant.category}', ${escapedOrigin ? `'${escapedOrigin}'` : 'NULL'}, ${escapedOlfactive ? `'${escapedOlfactive}'` : 'NULL'}, ${escapedDominant ? `'${escapedDominant}'` : 'NULL'}, ${escapedTraditional ? `'${escapedTraditional}'` : 'NULL'}, ${plant.climaticAxis ? `'${plant.climaticAxis}'` : 'NULL'}, ${escapedNotes ? `'${escapedNotes}'` : 'NULL'}, 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();`;

  sqlStatements.push(sql);
}

// Écrire le fichier SQL
const sqlPath = path.join(__dirname, '..', 'plantes_niches_import.sql');
fs.writeFileSync(sqlPath, sqlStatements.join('\n\n'));

console.log(`✅ Fichier SQL généré: ${sqlPath}`);
console.log(`\n📊 Résumé:`);
console.log(`   - ${plants.length} plantes à importer`);
console.log(`   - Fichier SQL prêt pour exécution\n`);

// Afficher quelques exemples
console.log('📝 Exemples de plantes:');
plants.slice(0, 5).forEach((p, i) => {
  console.log(`   ${i+1}. ${p.name} (${p.latinName || 'N/A'}) - ${p.category}`);
});
console.log('   ...\n');
