#!/usr/bin/env node
/**
 * Import des 6 Accords ACC PERFUMUM avec protocoles de fabrication complets
 * Source : Protocoles de Fabrication PERFUMUM (Notion)
 * ACC-01 Oriental Mystique, ACC-02 Himalaya Sacré, ACC-03 Malawi Fermenté,
 * ACC-04 Kif Authentique, ACC-05 Dokha Intense, ACC-06 Fleur CBD Délicate
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

async function findOrCreateRecette(conn, name) {
  const [rows] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [name]);
  if (rows.length > 0) return { id: rows[0].id, created: false };
  const [result] = await conn.execute(
    `INSERT INTO recettes (name, category, description, formula, notes_tete, notes_coeur, notes_fond, notes, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    ['placeholder', 'tabac', null, null, null, null, null, null, 'prototype']
  );
  return { id: result.insertId, created: true };
}

async function main() {
  const conn = await getConn();
  let created = 0, updated = 0, skipped = 0, errors = 0;

  // Vérifier les colonnes disponibles dans recettes
  const [cols] = await conn.execute('DESCRIBE recettes');
  const colNames = cols.map(c => c.Field);
  console.log('Colonnes recettes:', colNames.join(', '));

  // ===== 6 Accords ACC PERFUMUM =====
  console.log('\n=== 6 Accords ACC PERFUMUM ===');

  const accords = [
    {
      name: 'ACC-01 — Oriental Mystique',
      category: 'tabac',
      status: 'experimental',
      description: 'Accord tabac-haschisch oriental. Yenidje très délicat, hash libanais friable. Profil mystique-incense. Maturation optimale 10-12 semaines.',
      formula: `Yenidje 40g + Basma 20g + Hash libanais 30g + Virginia 10g
Terpènes : Nerolidol 1.5g + Cedrol 1g + Beta-ionone 2g + Coumarin 1g + Vanillin 0.5g
Solution dans alcool 95% (30mL)`,
      notes_tete: 'Nerolidol (floral-boisé), Beta-ionone (violette)',
      notes_coeur: 'Coumarin (foin-doux), Cedrol (cèdre)',
      notes_fond: 'Vanillin (vanille), Hash libanais (résine)',
      notes: 'Maturation 10-12 semaines. Profil mystique-incense développe semaine 8+. Avertissement : Nerolidol 1.5g ajout progressif (puissant). Numérotation batch : ACC-01-YYYYMMDD-NNN.',
      combustion_temp: 200
    },
    {
      name: 'ACC-02 — Himalaya Sacré',
      category: 'tabac',
      status: 'experimental',
      description: 'Accord tabac-charas népalais. Bidi contient clou-de-girofle naturel. Profil spirituel-encens. Maturation 7 semaines.',
      formula: `Bidi indien 50g + Charas népalais 35g + Virginia 15g
Terpènes : Bisabolol 1g + Heliotropin 3g + Ethyl Maltol 10% (0.1g pur) + Linalool 0.5g
Solution dans alcool 95% (30mL)`,
      notes_tete: 'Linalool (floral-lavande), Bisabolol (floral-doux)',
      notes_coeur: 'Heliotropin (poudre-amande), Ethyl Maltol (sucré)',
      notes_fond: 'Charas népalais (résine-hashish), Bidi (clou-de-girofle)',
      notes: 'Maturation 7 semaines. Profil spirituel stabilisé. Charas népalais collant : refroidissement 10 min avant émiettage. Pas d\'ajout eugénol (Bidi contient clou-de-girofle naturel).',
      combustion_temp: 200
    },
    {
      name: 'ACC-03 — Malawi Fermenté ⭐',
      category: 'tabac',
      status: 'testing',
      description: 'Accord tabac fermenté-fruité. Perique + Malawi Cob. Profil winey-rum-coconut. Lancement prioritaire. Maturation 12 semaines.',
      formula: `Perique 15g + Malawi Cob 30g + Virginia 40g + Burley 15g
Terpènes : Farnesene 0.5g + Davana Oil 10% (0.1g pur) + Ethyl Maltol 10% (0.05g pur) + Nerolidol 0.5g
Solution dans alcool 95% (30mL)`,
      notes_tete: 'Farnesene (pomme-verte), Davana (fruité-exotique)',
      notes_coeur: 'Perique (fruité-fermenté), Malawi Cob (tabac-doux)',
      notes_fond: 'Ethyl Maltol (sucré-caramel), Virginia (base neutre)',
      notes: 'Maturation 12 semaines. Profil fermenté-fruité-prune maximal. Surveillance semaine 8-12 : développement notes winey-rum-coconut. Lancement prioritaire : meilleur ratio qualité/coût/complexité.',
      combustion_temp: 200
    },
    {
      name: 'ACC-04 — Kif Authentique',
      category: 'tabac',
      status: 'experimental',
      description: 'Accord kif traditionnel marocain. N. rustica + hash marocain + Hashishene. Profil terreux-épicé. Maturation 6 semaines.',
      formula: `N. rustica 40g + Hash marocain 40g + Kif marocain 20g
Terpènes : Hashishene 0.5g + Myrcène 0.3g + Caryophyllène 0.2g
Solution dans alcool 95% (20mL)`,
      notes_tete: 'Myrcène (herbacé-terreux), Hashishene (cannabis)',
      notes_coeur: 'Caryophyllène (épicé-poivré), Hash marocain (résine)',
      notes_fond: 'N. rustica (tabac-fort), Kif marocain (traditionnel)',
      notes: 'Maturation 6 semaines. Profil traditionnel : pas de sur-aromatisation. N. rustica nicotine élevée : manipulation prudente. Hash marocain + Hashishene : marqueur kif Rif.',
      combustion_temp: 200
    },
    {
      name: 'ACC-05 — Dokha Intense ⚠️',
      category: 'tabac',
      status: 'experimental',
      description: 'Accord dokha-hash afghan. Nicotine extrême (2.4-5.3%). Pour experts confirmés uniquement. Maturation 8 semaines.',
      formula: `Dokha 65g + Hash afghan 30g + Latakia 5g
Terpènes : Cedrol 0.5g + Caryophyllène 0.3g + Myrcène 0.2g
Solution dans alcool 95% (20mL)`,
      notes_tete: 'Myrcène (herbacé), Caryophyllène (épicé)',
      notes_coeur: 'Cedrol (cèdre-boisé), Hash afghan (résine-puissant)',
      notes_fond: 'Dokha (nicotine-extrême), Latakia (fumé-intense)',
      notes: 'AVERTISSEMENT : 1-3 bouffées suffisent. Manipulation gants (nicotine contact peau). Étiquetage obligatoire : EXPERTS / NICOTINE EXTRÊME. Test fumage : 1 bouffée légère seulement. Formule experts confirmés uniquement.',
      combustion_temp: 200
    },
    {
      name: 'ACC-06 — Fleur CBD Délicate',
      category: 'tabac',
      status: 'experimental',
      description: 'Accord fleur CBD entrée de gamme. Hindu Kush < 1% THC. Profil floral-doux. Public débutants. Maturation 4-6 semaines.',
      formula: `Hindu Kush fleur CBD 50g + Virginia 50g
Terpènes : Linalool 1g + Bisabolol 0.5g + Myrcène 0.3g + Nerolidol 0.2g
Solution dans alcool 95% (25mL)`,
      notes_tete: 'Linalool (floral-lavande), Myrcène (herbacé-doux)',
      notes_coeur: 'Bisabolol (floral-délicat), Nerolidol (floral-boisé)',
      notes_fond: 'Hindu Kush CBD (floral-doux), Virginia (base neutre-sucrée)',
      notes: 'Maturation 4-6 semaines (profil doux). Public débutants : équilibre délicat. Linalool : note florale-lavande signature. Virginia 50% base neutre-sucrée.',
      combustion_temp: 180
    },
  ];

  // Protocole de fabrication standard (6 étapes) à stocker dans notes
  const protocolStandard = `
PROTOCOLE STANDARD 6 ÉTAPES :
1. Préparation Tabac : Pesée + émiettage (2-3mm) + humidification légère (2-3mL eau distillée/100g) + repos 30min
2. Préparation CBD : Émiettage (2-3mm) + mélange avec tabac humidifié (homogénéisation 3-5min)
3. Préparation Solution Terpènes : Pesée + dilution aromachemicals puissants (10% dans DPG) + dissolution alcool 95% (30mL) + agitation magnétique 10min
4. Application Solution : Spray vaporisateur uniforme (3-4 passes, mouvement circulaire, 15-20cm) + mélange manuel 5min
5. Séchage : Étalement couche fine (1-2cm) + ventilation 24-48h à 20-22°C
6. Maturation : Bocal verre ambré 70-80% + 18-22°C + 60-65% RH + aération hebdomadaire
Traçabilité : Numérotation ACC-XX-YYYYMMDD-NNN + fiche fabrication complète + conservation 2 ans minimum
`;

  for (const accord of accords) {
    try {
      const [existing] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [accord.name]);
      
      if (existing.length > 0) {
        // Mettre à jour avec les données complètes
        const id = existing[0].id;
        await conn.execute(
          `UPDATE recettes SET category=?, description=?, formula=?, notes_tete=?, notes_coeur=?, notes_fond=?, notes=?, status=?, updatedAt=NOW() WHERE id=?`,
          [accord.category, accord.description||null, accord.formula||null, accord.notes_tete||null, accord.notes_coeur||null, accord.notes_fond||null, (accord.notes||'') + protocolStandard, accord.status, id]
        );
        updated++;
        console.log(`  ↑ Mis à jour: ${accord.name}`);
      } else {
        await conn.execute(
          `INSERT INTO recettes (name, category, description, formula, notes_tete, notes_coeur, notes_fond, notes, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [accord.name, accord.category, accord.description||null, accord.formula||null, accord.notes_tete||null, accord.notes_coeur||null, accord.notes_fond||null, (accord.notes||'') + protocolStandard, accord.status]
        );
        created++;
        console.log(`  + Créé: ${accord.name}`);
      }
    } catch(e) {
      errors++;
      console.error(`  ✗ ${accord.name}: ${e.message.substring(0, 100)}`);
    }
  }

  // ===== Accords ABSORBE (ACC-81 et PX-11 depuis la base ABSORBE Accords) =====
  console.log('\n=== Accords ABSORBE (ACC-81, PX-11) ===');
  
  const absorbeAccords = [
    {
      name: 'ACC-81 — Pierre Froide Nocturne',
      category: 'parfum',
      status: 'experimental',
      description_absorbe: 'Paroi de grotte glaciale. Axe calcite + aldéhydes froids + ozone. Texture Pierre.',
      formula: 'Calcite accord + Aldéhydes C12-C14 + Ozone + Vétiverol froid',
      notes_tete: 'Aldéhydes froids (ozone)', notes_coeur: 'Calcite (minéral)', notes_fond: 'Vétiverol (froid)',
      notes: 'Texture : Pierre. Accord ABSORBE. Paroi de grotte glaciale.'
    },
    {
      name: 'PX-11 — Monoï Fossile',
      category: 'parfum',
      status: 'experimental',
      description_absorbe: 'Peau solaire sur pierre blanche + vent minéral + souffle archéologique. Texture Pierre.',
      formula: 'Monoï + Salicylates + Minéral blanc + Aldéhydes',
      notes_tete: 'Salicylates (solaire)', notes_coeur: 'Monoï (peau-lactone)', notes_fond: 'Minéral blanc (pierre)',
      notes: 'Texture : Pierre. Accord ABSORBE. Peau solaire fossile.'
    },
  ];

  for (const accord of absorbeAccords) {
    try {
      const [existing] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [accord.name]);
      if (existing.length > 0) { skipped++; continue; }
      await conn.execute(
        `INSERT INTO recettes (name, category, description, formula, notes_tete, notes_coeur, notes_fond, notes, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [accord.name, accord.category, accord.description_absorbe||null, accord.formula||null, accord.notes_tete||null, accord.notes_coeur||null, accord.notes_fond||null, accord.notes||null, accord.status]
      );
      created++;
      console.log(`  + Créé: ${accord.name}`);
    } catch(e) {
      errors++;
      console.error(`  ✗ ${accord.name}: ${e.message.substring(0, 100)}`);
    }
  }

  // ===== Research entries pour les protocoles de fabrication =====
  console.log('\n=== Research entries protocoles de fabrication ===');
  
  // Vérifier la structure de research_entries
  const [reCols] = await conn.execute('DESCRIBE research_entries');
  const reColNames = reCols.map(c => c.Field);
  
  // Vérifier si axis_id 1 existe
  const [axes] = await conn.execute('SELECT id, name FROM research_axes LIMIT 5');
  console.log('Axes disponibles:', axes.map(a => a.id + ':' + a.name).join(', '));
  
  const axisId = axes.length > 0 ? axes[0].id : 1;
  
  const protocols = [
    {
      entry_code: 'PROTO-FAB-001',
      title: 'Protocole Standard de Fabrication PERFUMUM (6 étapes)',
      content: `Protocoles de fabrication standardisés pour les 6 accords PERFUMUM basés sur le layering olfactif.
      
ÉTAPE 1 : Préparation Tabac — Pesée + émiettage (2-3mm) + humidification légère (2-3mL eau distillée/100g) + repos 30min
ÉTAPE 2 : Préparation CBD — Émiettage (2-3mm) + mélange avec tabac humidifié (homogénéisation 3-5min)
ÉTAPE 3 : Préparation Solution Terpènes — Pesée + dilution aromachemicals puissants (10% dans DPG) + dissolution alcool 95% (30mL) + agitation magnétique 10min
ÉTAPE 4 : Application Solution — Spray vaporisateur uniforme (3-4 passes, mouvement circulaire, 15-20cm) + mélange manuel 5min
ÉTAPE 5 : Séchage — Étalement couche fine (1-2cm) + ventilation 24-48h à 20-22°C
ÉTAPE 6 : Maturation — Bocal verre ambré 70-80% + 18-22°C + 60-65% RH + aération hebdomadaire

TRAÇABILITÉ : Numérotation ACC-XX-YYYYMMDD-NNN + fiche fabrication complète + conservation 2 ans minimum
EPI : Gants nitrile + lunettes protection + masque si poudres fines`,
      entry_type: 'protocol',
      axis_id: axisId
    },
    {
      entry_code: 'PROTO-FAB-002',
      title: 'Durées de Maturation par Accord ACC',
      content: `Durées de maturation optimales pour les 6 accords PERFUMUM :
- ACC-01 Oriental Mystique : 10-12 semaines (profil mystique-incense développe semaine 8+)
- ACC-02 Himalaya Sacré : 7 semaines (profil spirituel stabilisé)
- ACC-03 Malawi Fermenté : 12 semaines (profil fermenté-fruité-prune maximal, surveillance semaine 8-12)
- ACC-04 Kif Authentique : 6 semaines (notes terreuses-épicées stabilisées)
- ACC-05 Dokha Intense : 8 semaines (intégration profil intense)
- ACC-06 Fleur CBD Délicate : 4-6 semaines (profil doux, maturation courte)

CONDITIONS STOCKAGE : 18-22°C, 60-65% RH, obscurité, aération hebdomadaire 5min`,
      entry_type: 'protocol',
      axis_id: axisId
    },
  ];

  for (const proto of protocols) {
    try {
      const [existing] = await conn.execute('SELECT id FROM research_entries WHERE entry_code = ? LIMIT 1', [proto.entry_code]);
      if (existing.length > 0) { skipped++; continue; }
      
      await conn.execute(
        `INSERT INTO research_entries (entry_code, title, slug, content, entry_type, axis_id, primary_axis_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', NOW(), NOW())`,
        [proto.entry_code, proto.title, proto.entry_code.toLowerCase().replace(/[^a-z0-9]+/g,'-'), proto.content, proto.entry_type, proto.axis_id, proto.axis_id]
      );
      created++;
      console.log(`  + Protocole: ${proto.title}`);
    } catch(e) {
      errors++;
      console.error(`  ✗ ${proto.entry_code}: ${e.message.substring(0, 100)}`);
    }
  }

  // ===== Résumé =====
  const [[totalRecettes]] = await conn.execute('SELECT COUNT(*) as n FROM recettes');
  const [[totalRE]] = await conn.execute('SELECT COUNT(*) as n FROM research_entries');
  console.log('\n=== Résumé Final ===');
  console.log(`Créés: ${created} | Mis à jour: ${updated} | Existants: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total recettes: ${totalRecettes.n} | Total research_entries: ${totalRE.n}`);
  
  await conn.end();
}

main().catch(console.error);
