/**
 * Script d'enrichissement des profils olfactifs (tête/cœur/fond)
 * pour les variétés prioritaires sans olfactive_notes structurées
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Profils olfactifs documentés par variété
// Format: { top: [], heart: [], base: [] }
const profiles = {
  // ─── LAVANDES ─────────────────────────────────────────────────────────────
  'Lavandin Abrial': {
    top: ['Camphre', 'Eucalyptol', 'Limonène'],
    heart: ['Linalol', 'Acétate de linalyle', 'Bornéol'],
    base: ['Camphre', 'Caryophyllène', 'Bornéol']
  },
  'Lavandin Maillette': {
    top: ['Linalol', 'Eucalyptol', 'Limonène'],
    heart: ['Acétate de linalyle', 'Linalol', 'Lavandulol'],
    base: ['Caryophyllène', 'Bornéol', 'Acétate de linalyle']
  },
  'Lavandin Super': {
    top: ['Camphre', 'Eucalyptol', 'Linalol'],
    heart: ['Acétate de linalyle', 'Linalol', 'Camphre'],
    base: ['Bornéol', 'Caryophyllène', 'Camphre']
  },

  // ─── ROSES ────────────────────────────────────────────────────────────────
  'Rosa gallica officinalis': {
    top: ['Géraniol', 'Citronellol', 'Phényléthanol'],
    heart: ['Rose oxyde', 'Géraniol', 'Nérol'],
    base: ['Phényléthanol', 'Myrcène', 'Caryophyllène']
  },
  'Rosa alba maxima': {
    top: ['Phényléthanol', 'Géraniol', 'Nérol'],
    heart: ['Rose oxyde', 'Citronellol', 'Géraniol'],
    base: ['Phényléthanol', 'Caryophyllène', 'Farnésol']
  },
  'Rosa centifolia': {
    top: ['Phényléthanol', 'Géraniol', 'Citronellol'],
    heart: ['Rose oxyde', 'Nérol', 'Géraniol'],
    base: ['Phényléthanol', 'Farnésol', 'Caryophyllène']
  },

  // ─── TABACS ORIENTAUX ─────────────────────────────────────────────────────
  'Basma': {
    top: ['Nicotine', 'Acides gras volatils', 'Pyrazines'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'Phytol'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Izmir/Smyrna': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Phytol', 'Solanone']
  },
  'Yenidje': {
    top: ['Nicotine', 'Pyrazines', 'Limonène'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'Damascénone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Xanthi': {
    top: ['Nicotine', 'Acides gras volatils', 'Pyrazines'],
    heart: ['Solanone', 'Damascénone', 'Phytol'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Katerini': {
    top: ['Nicotine', 'Pyrazines', 'Limonène'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'Damascénone'],
    base: ['Cembranolide', 'Phytol', 'Solanone']
  },
  'Samsun': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Drama': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'Damascénone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Djebel': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Phytol'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Dubek': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },

  // ─── TABACS TRANSFORMÉS ───────────────────────────────────────────────────
  'Latakia (Fire-Cured)': {
    top: ['Phénol', 'Gaïacol', 'Crésol'],
    heart: ['Eugénol', 'Syringol', '4-méthylguaïacol'],
    base: ['Cembranolide', 'Solanone', 'Vanilline']
  },
  'Perique (Fermenté)': {
    top: ['Acides gras volatils', 'Méthional', 'Phénylacétaldéhyde'],
    heart: ['Solanone', 'Damascénone', 'Acide acétique'],
    base: ['Cembranolide', 'Solanone', 'Acide lactique']
  },
  'Virginia (Flue-Cured)': {
    top: ['Acétaldéhyde', 'Furanes', 'Pyrazines'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'HMF'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Burley (Air-Cured)': {
    top: ['Nicotine', 'Pyrazines', 'Pyridines'],
    heart: ['Solanone', 'Nornicotine', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },

  // ─── TABACS ORIENTAUX SUPPLÉMENTAIRES ─────────────────────────────────────
  'Bashi Bagli': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },

  // ─── CANNABIS ─────────────────────────────────────────────────────────────
  'Northern Lights #5': {
    top: ['Myrcène', 'Limonène', 'Pinène'],
    heart: ['Myrcène', 'Caryophyllène', 'Linalol'],
    base: ['Myrcène', 'Caryophyllène', 'Humulène']
  },
  'Cherry Pie': {
    top: ['Myrcène', 'Caryophyllène', 'Limonène'],
    heart: ['Myrcène', 'Linalol', 'Caryophyllène'],
    base: ['Caryophyllène', 'Myrcène', 'Humulène']
  },
  'Purple Kush': {
    top: ['Myrcène', 'Pinène', 'Caryophyllène'],
    heart: ['Myrcène', 'Linalol', 'Caryophyllène'],
    base: ['Myrcène', 'Caryophyllène', 'Humulène']
  },
  'Pink Pepper': {
    top: ['Terpinolène', 'Ocimène', 'Limonène'],
    heart: ['Terpinolène', 'Myrcène', 'Caryophyllène'],
    base: ['Caryophyllène', 'Myrcène', 'Humulène']
  },
  'CBDRx': {
    top: ['Myrcène', 'Pinène', 'Limonène'],
    heart: ['Myrcène', 'Caryophyllène', 'Linalol'],
    base: ['Caryophyllène', 'Myrcène', 'Humulène']
  },

  // ─── TABACS INDUSTRIELS ───────────────────────────────────────────────────
  'K326': {
    top: ['Acétaldéhyde', 'Furanes', 'Pyrazines'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'HMF'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'TN90': {
    top: ['Acétaldéhyde', 'Furanes', 'Pyrazines'],
    heart: ['Solanone', 'Mégastigmatrièneone', 'HMF'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },

  // ─── LANDRACES TABAC ──────────────────────────────────────────────────────
  'Dark Fired Kentucky': {
    top: ['Phénol', 'Gaïacol', 'Crésol'],
    heart: ['Eugénol', 'Syringol', 'Solanone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Havana Seed': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Maryland 609': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
  'Orinoco': {
    top: ['Nicotine', 'Pyrazines', 'Acides gras volatils'],
    heart: ['Solanone', 'Damascénone', 'Mégastigmatrièneone'],
    base: ['Cembranolide', 'Solanone', 'Phytol']
  },
};

let updated = 0;
let skipped = 0;

for (const [name, notes] of Object.entries(profiles)) {
  const [rows] = await conn.execute(
    'SELECT id, olfactive_notes FROM plant_varieties WHERE name = ?',
    [name]
  );
  
  if (!rows.length) {
    console.log(`⚠️  Non trouvé: ${name}`);
    skipped++;
    continue;
  }
  
  const variety = rows[0];
  if (variety.olfactive_notes && Object.keys(variety.olfactive_notes).length > 0) {
    console.log(`⏭️  Déjà enrichi: ${name}`);
    skipped++;
    continue;
  }
  
  await conn.execute(
    'UPDATE plant_varieties SET olfactive_notes = ? WHERE id = ?',
    [JSON.stringify(notes), variety.id]
  );
  console.log(`✅ ${name}: top=[${notes.top.join(', ')}] | heart=[${notes.heart.join(', ')}] | base=[${notes.base.join(', ')}]`);
  updated++;
}

console.log(`\n📊 Résultat: ${updated} variétés enrichies, ${skipped} ignorées`);

// Vérification finale
const [stats] = await conn.execute('SELECT COUNT(*) as total, SUM(olfactive_notes IS NOT NULL AND olfactive_notes != "") as with_notes FROM plant_varieties');
console.log(`📈 Couverture finale: ${stats[0].with_notes}/${stats[0].total} variétés avec profils olfactifs`);

await conn.end();
