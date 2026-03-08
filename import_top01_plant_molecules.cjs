#!/usr/bin/env node
/**
 * Liaisons plante-molécule pour les plantes sahéliennes TOP-01 et RES-02
 * Sources : Ouedraogo et al. (2024), données GC-MS littérature
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;
async function getConn() {
  const url = new URL(DB_URL);
  return mysql.createConnection({
    host: url.hostname, port: parseInt(url.port)||3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: {rejectUnauthorized: false}
  });
}

async function findOrCreateMolecule(conn, name, data = {}) {
  const [rows] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [name]);
  if (rows.length > 0) return rows[0].id;
  
  // Créer la molécule si elle n'existe pas
  const [result] = await conn.execute(
    `INSERT INTO molecules (name, cas_number, chemical_class, olfactiveProfile, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [name, data.cas || null, data.class || 'terpene', data.odor || null, data.odor || null]
  );
  console.log(`    [mol+] Créé molécule: ${name}`);
  return result.insertId;
}

async function findPlant(conn, name) {
  const [rows] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', [`%${name}%`]);
  return rows.length > 0 ? rows[0].id : null;
}

async function linkPlantMolecule(conn, plantId, moleculeId, percentage, notes) {
  try {
    const [existing] = await conn.execute(
      'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
      [plantId, moleculeId]
    );
    if (existing.length > 0) return false;
    
    await conn.execute(
      `INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [plantId, moleculeId, percentage || null, notes || null]
    );
    return true;
  } catch(e) {
    console.error(`    [err] liaison: ${e.message.substring(0, 80)}`);
    return false;
  }
}

async function main() {
  const conn = await getConn();
  let linked = 0, skipped = 0, errors = 0;

  // Données de liaisons plante-molécule basées sur GC-MS littérature
  const plantMoleculeData = [
    // Boswellia dalzielii (encens sahélien)
    { plant: 'Boswellia dalzielii', molecules: [
      { name: 'α-Pinène', percentage: 35.0, cas: '80-56-8', class: 'monoterpene', odor: 'Frais, résineux, pin', notes: 'Molécule dominante HE Boswellia dalzielii (Burkina Faso)' },
      { name: 'α-Terpinène', percentage: 12.0, cas: '99-86-5', class: 'monoterpene', odor: 'Citrus, herbacé', notes: 'Composant majeur HE Boswellia dalzielii' },
      { name: '3-Carène', percentage: 8.0, cas: '13466-78-9', class: 'monoterpene', odor: 'Citrus, boisé, résine', notes: 'Composant HE Boswellia dalzielii' },
    ]},
    // Cymbopogon schoenanthus (jonc odorant)
    { plant: 'Cymbopogon schoenanthus', molecules: [
      { name: 'Pipéritone', percentage: 28.0, cas: '89-82-7', class: 'monoterpene', odor: 'Menthol, herbacé, épicé', notes: 'Molécule dominante HE Cymbopogon schoenanthus (Burkina Faso, RES-02)' },
      { name: 'δ-2-Carène', percentage: 18.0, cas: '3725-43-7', class: 'monoterpene', odor: 'Citrus, terpénique', notes: 'Composant majeur HE Cymbopogon schoenanthus' },
      { name: 'Limonène', percentage: 12.0, cas: '5989-27-5', class: 'monoterpene', odor: 'Citrus, orange', notes: 'Composant HE Cymbopogon schoenanthus' },
    ]},
    // Daniellia oliveri (copalier)
    { plant: 'Daniellia oliveri', molecules: [
      { name: 'α-Copaène', percentage: 22.0, cas: '3856-25-5', class: 'sesquiterpene', odor: 'Boisé, épicé, terreux', notes: 'Molécule dominante HE Daniellia oliveri (RES-02)' },
      { name: 'Germacrène D', percentage: 18.0, cas: '23986-74-5', class: 'sesquiterpene', odor: 'Boisé, terreux, épicé', notes: 'Composant HE Daniellia oliveri' },
      { name: 'δ-Cadinène', percentage: 12.0, cas: '483-76-1', class: 'sesquiterpene', odor: 'Boisé, épicé, terreux', notes: 'Composant HE Daniellia oliveri' },
    ]},
    // Aframomum melegueta (grains de paradis)
    { plant: 'Aframomum melegueta', molecules: [
      { name: 'α-Humulène', percentage: 25.0, cas: '6753-98-6', class: 'sesquiterpene', odor: 'Boisé, épicé, houblon', notes: 'Molécule dominante HE Aframomum melegueta (RES-02)' },
      { name: 'β-Caryophyllène', percentage: 20.0, cas: '87-44-5', class: 'sesquiterpene', odor: 'Épicé, boisé, clou de girofle', notes: 'Composant majeur HE Aframomum melegueta' },
      { name: 'Myrtenyl acetate', percentage: 8.0, cas: '1079-01-2', class: 'monoterpene', odor: 'Floral, fruité, frais', notes: 'Composant HE Aframomum melegueta' },
    ]},
    // Xylopia aethiopica (poivre d'Éthiopie)
    { plant: 'Xylopia aethiopica', molecules: [
      { name: 'β-Pinène', percentage: 30.0, cas: '127-91-3', class: 'monoterpene', odor: 'Frais, boisé, résine', notes: 'Molécule dominante HE Xylopia aethiopica (RES-02)' },
      { name: 'Sabinène', percentage: 20.0, cas: '3387-41-5', class: 'monoterpene', odor: 'Épicé, terpénique, poivré', notes: 'Composant majeur HE Xylopia aethiopica' },
    ]},
    // Lippia multiflora (thé de Gambie)
    { plant: 'Lippia multiflora', molecules: [
      { name: 'Thymol', percentage: 29.9, cas: '89-83-8', class: 'monoterpene', odor: 'Thym, épicé, chaud, médicinal', notes: 'Chémotype thymol Burkina Faso — molécule dominante (RES-02)' },
      { name: 'p-Cymène', percentage: 26.2, cas: '99-87-6', class: 'monoterpene', odor: 'Épicé, citrus, terpénique', notes: 'Chémotype thymol Burkina Faso (RES-02)' },
      { name: 'Acétate de thymyle', percentage: 11.8, cas: '6379-73-3', class: 'monoterpene', odor: 'Thym, herbacé, floral', notes: 'Chémotype thymol Burkina Faso (RES-02)' },
    ]},
    // Cymbopogon nardus (citronnelle)
    { plant: 'Cymbopogon nardus', molecules: [
      { name: 'Citronellal', percentage: 35.0, cas: '106-23-0', class: 'monoterpene', odor: 'Citrus, frais, citronnelle', notes: 'Molécule dominante HE Cymbopogon nardus (RES-02)' },
      { name: 'Géraniol', percentage: 20.0, cas: '106-24-1', class: 'monoterpene', odor: 'Rose, floral, géranium', notes: 'Composant HE Cymbopogon nardus' },
      { name: 'Géranial', percentage: 15.0, cas: '141-27-5', class: 'monoterpene', odor: 'Citrus, citron, frais', notes: 'Composant HE Cymbopogon nardus' },
    ]},
    // Cymbopogon caesius (citronnelle de brousse)
    { plant: 'Cymbopogon caesius', molecules: [
      { name: 'Perillyl alcohol', percentage: 30.0, cas: '536-59-4', class: 'monoterpene', odor: 'Floral, citrus, herbacé', notes: 'Molécule dominante HE Cymbopogon caesius (RES-02)' },
      { name: 'Géraniol', percentage: 25.0, cas: '106-24-1', class: 'monoterpene', odor: 'Rose, floral, géranium', notes: 'Composant HE Cymbopogon caesius' },
    ]},
    // Commiphora africana (myrrhe africaine)
    { plant: 'Commiphora africana', molecules: [
      { name: 'Bisabolone', percentage: 28.0, cas: '532-91-2', class: 'sesquiterpene', odor: 'Boisé, balsamique, épicé', notes: 'Molécule dominante HE Commiphora africana (RES-02)' },
      { name: 'β-Sesquiphellandrène', percentage: 15.0, cas: '20307-83-9', class: 'sesquiterpene', odor: 'Boisé, épicé, terreux', notes: 'Composant HE Commiphora africana' },
    ]},
    // Cyperus articulatus (souchet)
    { plant: 'Cyperus articulatus', molecules: [
      { name: 'Cyperène', percentage: 35.0, cas: '2387-78-2', class: 'sesquiterpene', odor: 'Terreux, boisé, racine', notes: 'Molécule dominante HE Cyperus articulatus (RES-02)' },
      { name: 'Patchoulol', percentage: 20.0, cas: '5986-55-0', class: 'sesquiterpene', odor: 'Patchouli, terreux, boisé', notes: 'Composant HE Cyperus articulatus — synergie patchouli' },
    ]},
  ];

  console.log('=== Liaisons Plante-Molécule TOP-01 / RES-02 ===\n');

  for (const item of plantMoleculeData) {
    const plantId = await findPlant(conn, item.plant);
    if (!plantId) {
      console.log(`  [skip] Plante non trouvée: ${item.plant}`);
      skipped++;
      continue;
    }
    
    console.log(`  Plante: ${item.plant} (id=${plantId})`);
    
    for (const mol of item.molecules) {
      try {
        const molId = await findOrCreateMolecule(conn, mol.name, {
          cas: mol.cas, class: mol.class, odor: mol.odor
        });
        const ok = await linkPlantMolecule(conn, plantId, molId, mol.percentage, mol.notes);
        if (ok) { linked++; console.log(`    → ${mol.name} (${mol.percentage}%)`); }
        else { skipped++; }
      } catch(e) {
        errors++;
        console.error(`    [err] ${mol.name}: ${e.message.substring(0, 80)}`);
      }
    }
  }

  const [[totalLinks]] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules');
  const [[totalMols]] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
  console.log('\n=== Résumé Final ===');
  console.log(`Liaisons créées: ${linked} | Existantes: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total liaisons: ${totalLinks.n} | Total molécules: ${totalMols.n}`);
  
  await conn.end();
}

main().catch(console.error);
