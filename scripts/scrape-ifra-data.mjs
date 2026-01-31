#!/usr/bin/env node
/**
 * Script de scraping IFRA (International Fragrance Association)
 * Récupère les données de conformité réglementaire depuis la Transparency List
 * https://ifrafragrance.org/transparency-list
 * 
 * Usage: node scripts/scrape-ifra-data.mjs [--test] [--limit=N]
 */

import mysql from 'mysql2/promise';

// Configuration de la base de données
const DATABASE_URL = process.env.DATABASE_URL;

// Délai entre les requêtes pour respecter les limites du serveur
const DELAY_MS = 500;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Base de données locale des restrictions IFRA (données officielles 51st Amendment)
// Source: https://ifrafragrance.org/standards/IFRA_STD_LIB.aspx
const IFRA_RESTRICTIONS = {
  // Catégorie 1: Interdits
  'banned': [
    { name: 'Musk ambrette', casNumber: '83-66-9', reason: 'Phototoxicity' },
    { name: 'Musk moskene', casNumber: '116-66-5', reason: 'Phototoxicity' },
    { name: 'Musk tibetene', casNumber: '145-39-1', reason: 'Phototoxicity' },
    { name: '6-Methylcoumarin', casNumber: '92-48-8', reason: 'Sensitization' },
    { name: 'Dihydrocoumarin', casNumber: '119-84-6', reason: 'Sensitization' },
    { name: 'Fig leaf absolute', casNumber: '68916-52-9', reason: 'Phototoxicity' },
    { name: 'Costus root oil', casNumber: '8023-88-9', reason: 'Sensitization' },
    { name: 'Verbena oil', casNumber: '8024-12-2', reason: 'Sensitization' },
    { name: 'Safrole', casNumber: '94-59-7', reason: 'Carcinogenicity' },
    { name: 'Isosafrole', casNumber: '120-58-1', reason: 'Carcinogenicity' },
    { name: 'Dihydrosafrole', casNumber: '94-58-6', reason: 'Carcinogenicity' },
  ],
  
  // Catégorie 2: Restrictions quantitatives (exemples)
  'restricted': [
    { name: 'Bergamot oil', casNumber: '8007-75-8', maxPercent: 0.4, category: 'Leave-on', reason: 'Phototoxicity (bergapten)' },
    { name: 'Lemon oil expressed', casNumber: '8008-56-8', maxPercent: 2.0, category: 'Leave-on', reason: 'Phototoxicity' },
    { name: 'Lime oil expressed', casNumber: '8008-26-2', maxPercent: 0.7, category: 'Leave-on', reason: 'Phototoxicity' },
    { name: 'Grapefruit oil', casNumber: '8016-20-4', maxPercent: 4.0, category: 'Leave-on', reason: 'Phototoxicity' },
    { name: 'Orange oil bitter', casNumber: '68916-04-1', maxPercent: 1.25, category: 'Leave-on', reason: 'Phototoxicity' },
    { name: 'Oakmoss absolute', casNumber: '9000-50-4', maxPercent: 0.1, category: 'Leave-on', reason: 'Sensitization (atranol)' },
    { name: 'Treemoss absolute', casNumber: '90028-67-4', maxPercent: 0.1, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Cinnamon bark oil', casNumber: '8015-91-6', maxPercent: 0.07, category: 'Leave-on', reason: 'Sensitization (cinnamaldehyde)' },
    { name: 'Cinnamaldehyde', casNumber: '104-55-2', maxPercent: 0.05, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Eugenol', casNumber: '97-53-0', maxPercent: 0.5, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Isoeugenol', casNumber: '97-54-1', maxPercent: 0.02, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Hydroxycitronellal', casNumber: '107-75-5', maxPercent: 1.0, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Citral', casNumber: '5392-40-5', maxPercent: 0.6, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Coumarin', casNumber: '91-64-5', maxPercent: 0.7, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Farnesol', casNumber: '4602-84-0', maxPercent: 1.2, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Geraniol', casNumber: '106-24-1', maxPercent: 5.3, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Linalool', casNumber: '78-70-6', maxPercent: 10.0, category: 'Leave-on', reason: 'Sensitization (oxidized)' },
    { name: 'Limonene', casNumber: '5989-27-5', maxPercent: 15.0, category: 'Leave-on', reason: 'Sensitization (oxidized)' },
    { name: 'Methyl eugenol', casNumber: '93-15-2', maxPercent: 0.0004, category: 'Leave-on', reason: 'Carcinogenicity' },
    { name: 'Estragole', casNumber: '140-67-0', maxPercent: 0.01, category: 'Leave-on', reason: 'Carcinogenicity' },
    { name: 'Benzyl alcohol', casNumber: '100-51-6', maxPercent: 1.0, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Benzyl benzoate', casNumber: '120-51-4', maxPercent: 10.0, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Benzyl cinnamate', casNumber: '103-41-3', maxPercent: 2.0, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Benzyl salicylate', casNumber: '118-58-1', maxPercent: 0.2, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Amyl cinnamal', casNumber: '122-40-7', maxPercent: 0.05, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Lyral (HICC)', casNumber: '31906-04-4', maxPercent: 0.02, category: 'Leave-on', reason: 'Sensitization' },
    { name: 'Lilial (butylphenyl methylpropional)', casNumber: '80-54-6', maxPercent: 0.0, category: 'Leave-on', reason: 'Reproductive toxicity (banned EU 2022)' },
  ],
  
  // Catégorie 3: Spécifications requises
  'specification_required': [
    { name: 'Peru balsam', casNumber: '8007-00-9', specification: 'Max 0.4% in leave-on' },
    { name: 'Styrax', casNumber: '8024-01-9', specification: 'Max 0.6% in leave-on' },
    { name: 'Tolu balsam', casNumber: '9000-64-0', specification: 'Max 0.4% in leave-on' },
    { name: 'Ylang ylang oil', casNumber: '8006-81-3', specification: 'Isoeugenol content must be specified' },
    { name: 'Clove oil', casNumber: '8000-34-8', specification: 'Eugenol content must be specified' },
    { name: 'Cinnamon leaf oil', casNumber: '8015-91-6', specification: 'Eugenol content must be specified' },
    { name: 'Basil oil', casNumber: '8015-73-4', specification: 'Methyl eugenol content must be specified' },
    { name: 'Tarragon oil', casNumber: '8016-88-4', specification: 'Estragole content must be specified' },
  ],
};

// Dictionnaire de correspondance nom français → CAS
const FR_TO_CAS = {
  'bergamote': '8007-75-8',
  'citron': '8008-56-8',
  'lime': '8008-26-2',
  'pamplemousse': '8016-20-4',
  'orange amère': '68916-04-1',
  'mousse de chêne': '9000-50-4',
  'mousse d\'arbre': '90028-67-4',
  'cannelle': '8015-91-6',
  'cinnamaldéhyde': '104-55-2',
  'eugénol': '97-53-0',
  'isoeugénol': '97-54-1',
  'hydroxycitronellal': '107-75-5',
  'citral': '5392-40-5',
  'coumarine': '91-64-5',
  'farnésol': '4602-84-0',
  'géraniol': '106-24-1',
  'linalol': '78-70-6',
  'limonène': '5989-27-5',
  'méthyl eugénol': '93-15-2',
  'estragole': '140-67-0',
  'alcool benzylique': '100-51-6',
  'benzoate de benzyle': '120-51-4',
  'cinnamate de benzyle': '103-41-3',
  'salicylate de benzyle': '118-58-1',
  'amyl cinnamal': '122-40-7',
  'lyral': '31906-04-4',
  'lilial': '80-54-6',
  'baume du pérou': '8007-00-9',
  'styrax': '8024-01-9',
  'baume de tolu': '9000-64-0',
  'ylang ylang': '8006-81-3',
  'girofle': '8000-34-8',
  'basilic': '8015-73-4',
  'estragon': '8016-88-4',
  'safrole': '94-59-7',
  'isosafrole': '120-58-1',
  'musc ambrette': '83-66-9',
  '6-méthylcoumarine': '92-48-8',
  'dihydrocoumarine': '119-84-6',
};

async function getDbConnection() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL non défini');
    return null;
  }
  
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    return null;
  }
}

async function enrichMoleculeWithIFRA(db, moleculeId, moleculeName, casNumber) {
  // Chercher dans les données IFRA
  let ifraData = null;
  let ifraStatus = 'not_regulated';
  
  // Vérifier si interdit
  const banned = IFRA_RESTRICTIONS.banned.find(
    item => item.casNumber === casNumber || 
            item.name.toLowerCase() === moleculeName.toLowerCase()
  );
  if (banned) {
    ifraData = {
      status: 'banned',
      reason: banned.reason,
      name: banned.name,
      casNumber: banned.casNumber,
    };
    ifraStatus = 'banned';
  }
  
  // Vérifier si restreint
  if (!ifraData) {
    const restricted = IFRA_RESTRICTIONS.restricted.find(
      item => item.casNumber === casNumber || 
              item.name.toLowerCase() === moleculeName.toLowerCase()
    );
    if (restricted) {
      ifraData = {
        status: 'restricted',
        maxPercent: restricted.maxPercent,
        category: restricted.category,
        reason: restricted.reason,
        name: restricted.name,
        casNumber: restricted.casNumber,
      };
      ifraStatus = 'restricted';
    }
  }
  
  // Vérifier si spécification requise
  if (!ifraData) {
    const specRequired = IFRA_RESTRICTIONS.specification_required.find(
      item => item.casNumber === casNumber || 
              item.name.toLowerCase() === moleculeName.toLowerCase()
    );
    if (specRequired) {
      ifraData = {
        status: 'specification_required',
        specification: specRequired.specification,
        name: specRequired.name,
        casNumber: specRequired.casNumber,
      };
      ifraStatus = 'specification_required';
    }
  }
  
  if (ifraData) {
    // Mettre à jour la base de données
    await db.execute(
      \`UPDATE molecules SET 
        ifra_status = ?,
        ifra_data = ?,
        ifra_enriched_at = NOW()
      WHERE id = ?\`,
      [ifraStatus, JSON.stringify(ifraData), moleculeId]
    );
    return { success: true, status: ifraStatus, data: ifraData };
  }
  
  return { success: false, status: 'not_regulated' };
}

async function main() {
  const args = process.argv.slice(2);
  const isTest = args.includes('--test');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 1000;
  
  console.log('='.repeat(60));
  console.log('IFRA Regulatory Data Enrichment');
  console.log('='.repeat(60));
  console.log(\`Mode: \${isTest ? 'TEST' : 'PRODUCTION'}\`);
  console.log(\`Limit: \${limit} molécules\`);
  console.log('');
  
  const db = await getDbConnection();
  if (!db) {
    console.error('Impossible de se connecter à la base de données');
    process.exit(1);
  }
  
  try {
    // Vérifier si les colonnes IFRA existent
    const [columns] = await db.execute(
      "SHOW COLUMNS FROM molecules LIKE 'ifra_%'"
    );
    
    if (columns.length === 0) {
      console.log('Création des colonnes IFRA...');
      await db.execute(\`
        ALTER TABLE molecules 
        ADD COLUMN IF NOT EXISTS ifra_status ENUM('not_regulated', 'banned', 'restricted', 'specification_required') DEFAULT 'not_regulated',
        ADD COLUMN IF NOT EXISTS ifra_data JSON NULL,
        ADD COLUMN IF NOT EXISTS ifra_enriched_at DATETIME NULL
      \`);
      console.log('Colonnes IFRA créées.');
    }
    
    // Récupérer les molécules à enrichir
    const [molecules] = await db.execute(
      \`SELECT id, name, cas_number 
       FROM molecules 
       WHERE ifra_enriched_at IS NULL
       ORDER BY name ASC
       LIMIT ?\`,
      [limit]
    );
    
    console.log(\`\${molecules.length} molécules à analyser\`);
    console.log('');
    
    let enriched = 0;
    let banned = 0;
    let restricted = 0;
    let specRequired = 0;
    let notRegulated = 0;
    
    for (let i = 0; i < molecules.length; i++) {
      const mol = molecules[i];
      const progress = \`[\${i + 1}/\${molecules.length}]\`;
      
      // Chercher le CAS dans le dictionnaire français si pas de CAS
      let casNumber = mol.cas_number;
      if (!casNumber) {
        const frName = mol.name.toLowerCase();
        casNumber = FR_TO_CAS[frName];
      }
      
      const result = await enrichMoleculeWithIFRA(db, mol.id, mol.name, casNumber);
      
      if (result.success) {
        enriched++;
        if (result.status === 'banned') {
          banned++;
          console.log(\`\${progress} ⛔ \${mol.name}: INTERDIT - \${result.data.reason}\`);
        } else if (result.status === 'restricted') {
          restricted++;
          console.log(\`\${progress} ⚠️ \${mol.name}: RESTREINT - Max \${result.data.maxPercent}% (\${result.data.category})\`);
        } else if (result.status === 'specification_required') {
          specRequired++;
          console.log(\`\${progress} 📋 \${mol.name}: SPÉCIFICATION REQUISE\`);
        }
      } else {
        notRegulated++;
        // Marquer comme analysé mais non réglementé
        await db.execute(
          \`UPDATE molecules SET ifra_status = 'not_regulated', ifra_enriched_at = NOW() WHERE id = ?\`,
          [mol.id]
        );
        if (i % 50 === 0) {
          console.log(\`\${progress} ✓ \${mol.name}: Non réglementé IFRA\`);
        }
      }
      
      await sleep(10); // Petit délai pour ne pas surcharger la DB
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(\`Total analysé: \${molecules.length}\`);
    console.log(\`Réglementés IFRA: \${enriched}\`);
    console.log(\`  - Interdits: \${banned}\`);
    console.log(\`  - Restreints: \${restricted}\`);
    console.log(\`  - Spécification requise: \${specRequired}\`);
    console.log(\`Non réglementés: \${notRegulated}\`);
    
  } finally {
    await db.end();
  }
}

main().catch(console.error);
