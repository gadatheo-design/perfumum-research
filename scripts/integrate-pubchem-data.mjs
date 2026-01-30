/**
 * Script d'intégration des données PubChem dans la base de données
 * 
 * Ce script lit les résultats de l'enrichissement PubChem et met à jour
 * les molécules dans la base de données avec les nouvelles informations.
 */

import mysql from 'mysql2/promise';
import fs from 'fs';

const RESULTS_FILE = './scripts/enrichment-results-v2.json';
const LOG_FILE = './scripts/integration-log.txt';

// Mapping des classes chimiques vers les valeurs enum de la base de données
const CHEMICAL_CLASS_MAPPING = {
  'Monoterpène': 'monoterpene',
  'Sesquiterpène': 'sesquiterpene',
  'Diterpène': 'diterpene',
  'Terpénol': 'alcohol',
  'Sesquiterpénol': 'alcohol',
  'Aldéhyde': 'aldehyde',
  'Cétone': 'ketone',
  'Ester': 'ester',
  'Phénol': 'phenol',
  'Oxyde': 'ether',
  'Lactone': 'lactone',
  'Acide carboxylique': 'other',
  'Alcool': 'alcohol',
  'Éther': 'ether',
  'Composé soufré': 'sulfur_compound',
  'Composé azoté': 'heterocyclic',
};

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(message);
}

async function main() {
  // Effacer le log précédent
  if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
  }
  
  log('=== DÉBUT DE L\'INTÉGRATION DES DONNÉES PUBCHEM ===');
  
  // Charger les résultats de l'enrichissement
  const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  log(`Molécules enrichies à intégrer: ${results.enriched.length}`);
  
  // Connexion à la base de données
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
  
  log('Connexion à la base de données établie');
  
  // Statistiques
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  // Traiter chaque molécule enrichie
  for (const molecule of results.enriched) {
    try {
      // Préparer les valeurs à mettre à jour
      const updates = [];
      const values = [];
      
      // CAS Number
      if (molecule.casNumber) {
        updates.push('cas_number = ?');
        values.push(molecule.casNumber);
      }
      
      // IUPAC Name
      if (molecule.iupacName) {
        updates.push('iupac_name = ?');
        values.push(molecule.iupacName.substring(0, 500)); // Limiter à 500 caractères
      }
      
      // Chemical Class (convertir vers l'enum)
      if (molecule.chemicalClass) {
        const mappedClass = CHEMICAL_CLASS_MAPPING[molecule.chemicalClass];
        if (mappedClass) {
          updates.push('chemical_class = ?');
          values.push(mappedClass);
        }
      }
      
      // Formula (si pas déjà renseignée)
      if (molecule.formula) {
        updates.push('formula = COALESCE(NULLIF(formula, \'\'), ?)');
        values.push(molecule.formula);
      }
      
      if (updates.length === 0) {
        skipped++;
        continue;
      }
      
      // Ajouter l'ID pour la clause WHERE
      values.push(molecule.id);
      
      // Construire et exécuter la requête
      const query = `UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`;
      
      const [result] = await connection.execute(query, values);
      
      if (result.affectedRows > 0) {
        updated++;
        if (updated <= 20 || updated % 50 === 0) {
          log(`  ✓ Mis à jour: ${molecule.name} (ID: ${molecule.id}) - CAS: ${molecule.casNumber || 'N/A'}`);
        }
      } else {
        skipped++;
      }
      
    } catch (error) {
      errors++;
      log(`  ✗ Erreur pour ${molecule.name} (ID: ${molecule.id}): ${error.message}`);
    }
  }
  
  await connection.end();
  
  // Résumé
  log('\n=== RÉSUMÉ DE L\'INTÉGRATION ===');
  log(`Total traité: ${results.enriched.length}`);
  log(`Mis à jour: ${updated}`);
  log(`Ignorés: ${skipped}`);
  log(`Erreurs: ${errors}`);
  
  // Vérification finale
  log('\n=== VÉRIFICATION FINALE ===');
  
  const verifyConnection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
  
  const [stats] = await verifyConnection.execute(`
    SELECT 
      COUNT(*) as total_molecules,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as avec_cas,
      SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as avec_iupac,
      SUM(CASE WHEN chemical_class IS NOT NULL THEN 1 ELSE 0 END) as avec_classe
    FROM molecules
  `);
  
  const s = stats[0];
  log(`Total molécules: ${s.total_molecules}`);
  log(`Avec numéro CAS: ${s.avec_cas} (${((Number(s.avec_cas)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  log(`Avec nom IUPAC: ${s.avec_iupac} (${((Number(s.avec_iupac)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  log(`Avec classe chimique: ${s.avec_classe} (${((Number(s.avec_classe)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  
  await verifyConnection.end();
  
  log('\n=== FIN DE L\'INTÉGRATION ===');
}

main().catch(err => {
  log(`ERREUR FATALE: ${err.message}`);
  console.error(err);
  process.exit(1);
});
