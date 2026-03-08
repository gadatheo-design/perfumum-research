/**
 * import_cigarettes_molecule_links.cjs
 * Créer les liaisons plante-molécule pour les cigarettes disparues
 * et enrichir la research_entry TAB-CD01 avec des liaisons vers les molécules clés
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const url = new URL(process.env.DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
};

// Molécules clés des cigarettes disparues avec leurs données
const cigaretteMolecules = [
  // Gitanes Maïs
  { name: 'Nornicotine', iupac: '(R)-3-(pyrrolidin-2-yl)pyridine', cas: '494-97-3', formula: 'C9H12N2', mw: 148.20, class: 'heterocyclic', family: 'Pyridines', odor: 'Tabac, amer, légèrement fumé', note: 'fond', source: 'Nicotiana tabacum - tabac brun caporal', context: 'Gitanes Maïs, Gauloises Brunes — alcaloïde mineur du tabac brun, 5-10% des alcaloïdes totaux' },
  { name: 'Anabasine', iupac: '(S)-3-(piperidin-2-yl)pyridine', cas: '494-52-0', formula: 'C10H14N2', mw: 162.23, class: 'heterocyclic', family: 'Pyridines', odor: 'Tabac, piquant, légèrement herbacé', note: 'fond', source: 'Nicotiana glauca', context: 'Tabac rustique, Nicotiana glauca — alcaloïde principal des espèces non-tabacum' },
  { name: 'Furfural', iupac: 'furan-2-carbaldéhyde', cas: '98-01-1', formula: 'C5H4O2', mw: 96.08, class: 'heterocyclic', family: 'Furannes', odor: 'Amande, pain grillé, caramel, légèrement herbacé', note: 'tete', source: 'Pyrolyse des pentosanes du tabac', context: 'Gitanes Maïs, Gauloises — produit de pyrolyse des sucres du papier maïs et du tabac brun' },
  // Gauloises Brunes
  { name: 'Acide Acétique', iupac: 'acide éthanoïque', cas: '64-19-7', formula: 'C2H4O2', mw: 60.05, class: 'aliphatic', family: 'Acides carboxyliques', odor: 'Vinaigre, piquant, acide', note: 'tete', source: 'Fermentation et combustion du tabac', context: 'Gauloises Brunes — produit de combustion du tabac caporal, note acide caractéristique' },
  // Balkan Sobranie
  { name: 'Guaiacol', iupac: '2-méthoxyphénol', cas: '90-05-1', formula: 'C7H8O2', mw: 124.14, class: 'phenol', family: 'Phénols méthoxylés', odor: 'Fumé, boisé, médicinal, goudron', note: 'fond', source: 'Pyrolyse de la lignine (tabac Latakia fumé)', context: 'Balkan Sobranie — molécule signature du tabac Latakia, produite par fumage sur bois de chêne' },
  { name: 'Syringol', iupac: '2,6-diméthoxyphénol', cas: '91-10-1', formula: 'C8H10O3', mw: 154.16, class: 'phenol', family: 'Phénols méthoxylés', odor: 'Fumé intense, boisé, phénolique', note: 'fond', source: 'Pyrolyse de la lignine (tabac Latakia)', context: 'Balkan Sobranie — produit de pyrolyse de la lignine du bois de fumage, note fumée intense' },
  // Old Gold / Camel Turkish
  { name: 'Solanone', iupac: '(E)-1-(2,6,6-triméthyl-2-cyclohexényl)but-2-én-1-one', cas: '7764-50-3', formula: 'C13H20O', mw: 192.30, class: 'ketone', family: 'Cétones sesquiterpéniques', odor: 'Tabac doux, floral, légèrement fruité, caramel', note: 'coeur', source: 'Nicotiana tabacum (tabac Virginie)', context: 'Old Gold 1930s, Camel Turkish — cétone caractéristique du tabac Virginie séché à l\'air chaud' },
  { name: 'Megastigmatrienone', iupac: '(E)-1-(2,6,6-triméthyl-1,3-cyclohexadiényl)but-2-én-1-one', cas: '38818-55-2', formula: 'C13H18O', mw: 190.28, class: 'ketone', family: 'Cétones sesquiterpéniques', odor: 'Tabac Oriental, épicé, floral, boisé', note: 'coeur', source: 'Nicotiana tabacum (tabac Oriental turc)', context: 'Camel Turkish 1913 — cétone caractéristique du tabac Oriental turc (Samsun, Izmir)' },
  // Commun aux cigarettes disparues
  { name: 'Benzaldéhyde', iupac: 'benzaldéhyde', cas: '100-52-7', formula: 'C7H6O', mw: 106.12, class: 'aromatic', family: 'Aldéhydes aromatiques', odor: 'Amande amère, cerise, floral doux', note: 'tete', source: 'Pyrolyse des sucres et aromatisants du tabac', context: 'Old Gold 1930s — aromatisant naturel du tabac Virginie doux, notes amande caractéristiques' },
];

// Plantes tabac associées aux cigarettes disparues
const tobaccoPlants = [
  { name: 'Nicotiana tabacum var. Caporal', family: 'Solanaceae', origin: 'France', context: 'Tabac brun caporal — base de Gitanes Maïs et Gauloises Brunes. Variété française à forte teneur en nornicotine.' },
  { name: 'Nicotiana tabacum var. Latakia', family: 'Solanaceae', origin: 'Syrie/Chypre', context: 'Tabac Latakia fumé sur bois de chêne — signature de Balkan Sobranie. Riche en guaiacol et syringol.' },
  { name: 'Nicotiana tabacum var. Samsun', family: 'Solanaceae', origin: 'Turquie', context: 'Tabac Oriental turc Samsun — composant original Camel 1913. Riche en mégastigmatrienone.' },
  { name: 'Nicotiana tabacum var. Virginia Bright', family: 'Solanaceae', origin: 'USA', context: 'Tabac Virginie séché à l\'air chaud — base Old Gold 1930s. Riche en solanone et sucres naturels.' },
];

async function run() {
  const conn = await mysql.createConnection(dbConfig);
  let created = 0, linked = 0, plantLinked = 0;

  try {
    console.log('=== Import liaisons cigarettes disparues ===\n');

    // 1. Créer les molécules manquantes
    for (const mol of cigaretteMolecules) {
      // Vérifier si la molécule existe
      const [existing] = await conn.execute(
        'SELECT id FROM molecules WHERE name = ? LIMIT 1',
        [mol.name]
      );

      let molId;
      if (existing.length > 0) {
        molId = existing[0].id;
        console.log(`✓ Molécule existante : ${mol.name} (ID: ${molId})`);
        // Mettre à jour le contexte historique si pas déjà renseigné
        await conn.execute(
          `UPDATE molecules SET 
            notes = COALESCE(NULLIF(notes, ''), ?)
          WHERE id = ?`,
          [mol.context, molId]
        );
      } else {
        const [result] = await conn.execute(
          `INSERT INTO molecules (
            name, iupac_name, cas_number, chemicalFormula, molecularWeight,
            chemical_class, chemicalFamily, olfactiveProfile, notes,
            sourceOrigin, validation_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'valide')`,
          [
            mol.name, mol.iupac, mol.cas, mol.formula, mol.mw,
            mol.class, mol.family, mol.odor,
            mol.context, mol.source
          ]
        );
        molId = result.insertId;
        created++;
        console.log(`+ Molécule créée : ${mol.name} (ID: ${molId})`);
      }
    }

    // 2. Créer les plantes tabac variétales
    for (const plant of tobaccoPlants) {
      const [existing] = await conn.execute(
        'SELECT id FROM plants WHERE name = ? LIMIT 1',
        [plant.name]
      );

      let plantId;
      if (existing.length > 0) {
        plantId = existing[0].id;
        console.log(`✓ Plante existante : ${plant.name}`);
      } else {
        const [result] = await conn.execute(
          `INSERT INTO plants (
            name, family, origin, notes, category, status
          ) VALUES (?, ?, ?, ?, 'tabac', 'validated')`,
          [plant.name, plant.family, plant.origin, plant.context]
        );
        plantId = result.insertId;
        plantLinked++;
        console.log(`+ Plante créée : ${plant.name} (ID: ${plantId})`);
      }
    }

    // 3. Créer les liaisons plante-molécule pour les cigarettes disparues
    const plantMoleculeLinks = [
      // Nicotiana tabacum var. Caporal → Nornicotine, Furfural, Acide Acétique
      { plantName: 'Nicotiana tabacum var. Caporal', molName: 'Nornicotine', percentage: 0.5, confidence: 'certain', source: 'GC-MS tabac brun caporal' },
      { plantName: 'Nicotiana tabacum var. Caporal', molName: 'Furfural', percentage: 0.2, confidence: 'certain', source: 'Pyrolyse tabac caporal' },
      { plantName: 'Nicotiana tabacum var. Caporal', molName: 'Acide Acétique', percentage: 0.3, confidence: 'probable', source: 'Combustion tabac caporal' },
      { plantName: 'Nicotiana tabacum var. Caporal', molName: 'Pyridine', percentage: 0.1, confidence: 'certain', source: 'GC-MS tabac brun' },
      // Nicotiana tabacum var. Latakia → Guaiacol, Syringol, Eugenol
      { plantName: 'Nicotiana tabacum var. Latakia', molName: 'Guaiacol', percentage: 1.2, confidence: 'certain', source: 'GC-MS tabac Latakia fumé' },
      { plantName: 'Nicotiana tabacum var. Latakia', molName: 'Syringol', percentage: 0.8, confidence: 'certain', source: 'GC-MS tabac Latakia fumé' },
      { plantName: 'Nicotiana tabacum var. Latakia', molName: 'Vanilline', percentage: 0.3, confidence: 'probable', source: 'Pyrolyse lignine bois fumage' },
      // Nicotiana tabacum var. Samsun → Megastigmatrienone, Nornicotine
      { plantName: 'Nicotiana tabacum var. Samsun', molName: 'Megastigmatrienone', percentage: 0.4, confidence: 'certain', source: 'GC-MS tabac Oriental turc' },
      { plantName: 'Nicotiana tabacum var. Samsun', molName: 'Nornicotine', percentage: 0.3, confidence: 'certain', source: 'GC-MS tabac Oriental' },
      // Nicotiana tabacum var. Virginia Bright → Solanone, Benzaldéhyde
      { plantName: 'Nicotiana tabacum var. Virginia Bright', molName: 'Solanone', percentage: 0.6, confidence: 'certain', source: 'GC-MS tabac Virginie' },
      { plantName: 'Nicotiana tabacum var. Virginia Bright', molName: 'Benzaldéhyde', percentage: 0.2, confidence: 'probable', source: 'Arômes naturels tabac Virginie' },
      { plantName: 'Nicotiana tabacum var. Virginia Bright', molName: 'Vanilline', percentage: 0.4, confidence: 'certain', source: 'GC-MS tabac Virginie séché' },
    ];

    for (const link of plantMoleculeLinks) {
      // Trouver les IDs
      const [plants] = await conn.execute(
        'SELECT id FROM plants WHERE name = ? LIMIT 1',
        [link.plantName]
      );
      const [mols] = await conn.execute(
        'SELECT id FROM molecules WHERE name = ? LIMIT 1',
        [link.molName]
      );

      if (plants.length === 0 || mols.length === 0) {
        console.log(`⚠ Liaison ignorée : ${link.plantName} → ${link.molName} (non trouvé)`);
        continue;
      }

      const plantId = plants[0].id;
      const molId = mols[0].id;

      // Vérifier si la liaison existe déjà
      const [existingLink] = await conn.execute(
        'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
        [plantId, molId]
      );

      if (existingLink.length > 0) {
        console.log(`✓ Liaison existante : ${link.plantName} → ${link.molName}`);
        continue;
      }

      await conn.execute(
        `INSERT INTO plant_molecules (
          plant_id, molecule_id, percentage_typical, source
        ) VALUES (?, ?, ?, ?)`,
        [plantId, molId, link.percentage, link.source]
      );
      linked++;
      console.log(`+ Liaison créée : ${link.plantName} → ${link.molName} (${link.percentage}%)`);
    }

    // 4. Lier la research_entry TAB-CD01 aux molécules clés
    const [tabEntry] = await conn.execute(
      "SELECT id FROM research_entries WHERE entry_code = 'TAB-CD01' LIMIT 1"
    );

    if (tabEntry.length > 0) {
      const entryId = tabEntry[0].id;
      console.log(`\n→ Liaison TAB-CD01 (ID: ${entryId}) aux molécules clés...`);

      // Vérifier si la table research_entry_molecules existe
      const [tables] = await conn.execute(
        "SHOW TABLES LIKE 'research_entry_molecules'"
      );

      if (tables.length > 0) {
        const keyMolecules = ['Guaiacol', 'Syringol', 'Nornicotine', 'Solanone', 'Furfural', 'Megastigmatrienone'];
        for (const molName of keyMolecules) {
          const [mol] = await conn.execute(
            'SELECT id FROM molecules WHERE name = ? LIMIT 1',
            [molName]
          );
          if (mol.length > 0) {
            try {
              await conn.execute(
                'INSERT IGNORE INTO research_entry_molecules (entry_id, molecule_id) VALUES (?, ?)',
                [entryId, mol[0].id]
              );
            } catch (e) { /* ignore duplicates */ }
          }
        }
        console.log(`✓ Liaisons TAB-CD01 → molécules créées`);
      }
    }

    // 5. Résumé final
    const [totals] = await conn.execute(`
      SELECT 
        (SELECT COUNT(*) FROM molecules) as molecules,
        (SELECT COUNT(*) FROM plant_molecules) as plant_mol_links,
        (SELECT COUNT(*) FROM plants) as plants
    `);
    console.log('\n=== RÉSUMÉ ===');
    console.log(`Molécules créées : ${created}`);
    console.log(`Liaisons plante-molécule créées : ${linked}`);
    console.log(`Plantes créées : ${plantLinked}`);
    console.log(`\nBase totale :`);
    console.log(`  Molécules : ${totals[0].molecules}`);
    console.log(`  Plantes : ${totals[0].plants}`);
    console.log(`  Liaisons plante-molécule : ${totals[0].plant_mol_links}`);

  } finally {
    await conn.end();
  }
}

run().catch(console.error);
