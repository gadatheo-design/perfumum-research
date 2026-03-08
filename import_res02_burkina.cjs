#!/usr/bin/env node
/**
 * Import RES-02 — 50 Plantes Aromatiques Burkina Faso
 * Source : Ouedraogo et al. (2024), Health Research in Africa, Vol. 2(8): 1-14
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
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

async function main() {
  const conn = await getConn();
  let created = 0, skipped = 0, errors = 0;

  // Charger les plantes depuis le fichier JSON
  const plants = JSON.parse(fs.readFileSync('/home/ubuntu/res02_plants.json', 'utf8'));
  console.log(`=== Import RES-02 — ${plants.length} Plantes Burkina Faso ===`);

  for (const p of plants) {
    try {
      const [existing] = await conn.execute('SELECT id FROM plants WHERE name = ? LIMIT 1', [p.name]);
      if (existing.length > 0) {
        // Enrichir la plante existante avec les données Burkina
        await conn.execute(
          `UPDATE plants SET 
            family = COALESCE(NULLIF(family,''), ?),
            origin = COALESCE(NULLIF(origin,''), ?),
            notes = CONCAT(COALESCE(notes,''), ?),
            updated_at = NOW()
           WHERE id = ?`,
          [
            p.family,
            'Burkina Faso (Afrique de l\'Ouest)',
            `\n\n[RES-02] Noms vernaculaires: ${p.vernacular}. Parties utilisées: ${p.parts}. Rendement HE: ${p.yield}%. Molécules majoritaires: ${p.molecules}. Propriétés: ${p.properties}.`,
            existing[0].id
          ]
        );
        skipped++;
        console.log(`  ↑ Enrichi: ${p.name}`);
      } else {
        // Créer la nouvelle plante
        const notes = `[RES-02 Burkina Faso] Noms vernaculaires: ${p.vernacular}. Parties utilisées: ${p.parts}. Rendement HE: ${p.yield}%. Molécules majoritaires: ${p.molecules}. Propriétés biologiques: ${p.properties}. Source: Ouedraogo et al. (2024), Health Research in Africa.`;
        
        await conn.execute(
          `INSERT INTO plants (name, latin_name, family, origin, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            p.name,
            p.name,
            p.family,
            'Burkina Faso (Afrique de l\'Ouest)',
            notes
          ]
        );
        created++;
        console.log(`  + Créé: ${p.name} (${p.family})`);
      }
    } catch(e) {
      errors++;
      console.error(`  ✗ ${p.name}: ${e.message.substring(0, 100)}`);
    }
  }

  // === Research entry RES-02 ===
  console.log('\n=== Research entry RES-02 ===');
  const [axes] = await conn.execute('SELECT id FROM research_axes LIMIT 1');
  const axisId = axes[0]?.id || 1;

  try {
    const [existing] = await conn.execute("SELECT id FROM research_entries WHERE entry_code = 'RES-02-BURKINA' LIMIT 1");
    if (existing.length === 0) {
      await conn.execute(
        `INSERT INTO research_entries (entry_code, title, slug, content, entry_type, axis_id, primary_axis_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', NOW(), NOW())`,
        [
          'RES-02-BURKINA',
          'RES-02 — Lippia multiflora & 84 Plantes Aromatiques du Burkina Faso',
          'res-02-burkina-faso-plantes-aromatiques',
          `# RES-02 — Lippia & 84 Plantes Aromatiques Burkina Faso

## Sources
- **Ouedraogo et al. (2024)** — *Health Research in Africa*, Vol. 2(8): 1–14 — Revue des Plantes Médicinales à Potentiel Aromatique du Burkina Faso
- **Journal de la Société Ouest-Africaine de Chimie (2002)**, Vol. 013: 27–37 — Chémotypes de Lippia multiflora

## Données clés
- **84 espèces** documentées, **44 familles** botaniques
- Rendements HE : 0,002% → 2,6%
- Familles à meilleur rendement : Poaceae et Lamiaceae
- Molécules dominantes récurrentes : caryophyllènes, pinènes, phytol, linalol, 1,8-cinéole

## Chémotypie Lippia multiflora
| Chémotype | Région | Molécules dominantes | Usage encens | Usage tabac |
|-----------|--------|---------------------|--------------|-------------|
| Thymol/p-cymène | Burkina Faso | Thymol ~29.9%, p-Cymène ~26.2% | Excellent | Micro-dose uniquement |
| Linalol | Nigéria, Kenya, Bénin | Linalol dominant | Très bon | Compatible tabac clair |
| Tagétone/Isopipénone | Congo, Côte d'Ivoire | (E)/(Z)-Tagétones | Bon | Usage limité |
| 6,7-Époxymyrcène | République Centrafricaine | 6,7-Époxymyrcène dominant | Excellent | Très bon (fermenté) |

## Implications PERFUMUM
1. **Chémotype thymol** (Burkina Faso) → essais micro-dose tabac Oriental
2. **Chémotype 6,7-époxymyrcène** (RCA) → accord tabac fermenté (Perique, Malawi Cob)
3. **Chémotype linalol** (multi-régions) → base polyvalente encens/tabac clair

## Espèces prioritaires pour PERFUMUM
- Cymbopogon schoenanthus : rendement 2,6% — profil citronné-sec
- Cassia singueana : rendement 1,58% — geranyl acetone, phytol
- Boswellia dalzielii : rendement 1,12–1,25% — α-Pinène, encens sahélien
- Cymbopogon caesius : rendement 1,1–1,3% — géraniol, anti-inflammatoire
- Eucalyptus camaldulensis : rendement 0,7–1,4% — 1,8-cinéole`,
          'analysis',
          axisId,
          axisId
        ]
      );
      created++;
      console.log('  + Créé: RES-02 research entry');
    } else {
      skipped++;
      console.log('  ~ Existant: RES-02 research entry');
    }
  } catch(e) {
    errors++;
    console.error(`  ✗ RES-02 entry: ${e.message.substring(0, 100)}`);
  }

  // === Bibliographie RES-02 ===
  console.log('\n=== Bibliographie RES-02 ===');
  const bibliographies = [
    {
      code: 'BIB-RES02-OUEDRAOGO-2024',
      title: 'Revue des Plantes Médicinales à Potentiel Aromatique du Burkina Faso',
      authors: 'W. Jedida Ouedraogo et al.',
      year: 2024,
      journal: 'Health Research in Africa',
      volume: '2(8)',
      pages: '1-14',
      doi: null
    },
    {
      code: 'BIB-RES02-JSOAC-2002',
      title: 'Chémotypes de Lippia multiflora — Analyse par fumigation',
      authors: 'Journal de la Société Ouest-Africaine de Chimie',
      year: 2002,
      journal: 'Journal de la Société Ouest-Africaine de Chimie',
      volume: '013',
      pages: '27-37',
      doi: null
    }
  ];

  for (const bib of bibliographies) {
    try {
      const [existing] = await conn.execute('SELECT id FROM bibliographies WHERE reference_code = ? LIMIT 1', [bib.code]);
      if (existing.length > 0) { skipped++; continue; }
      
      // Vérifier les colonnes disponibles dans bibliographies
      const [cols] = await conn.execute("DESCRIBE bibliographies");
      const colNames = cols.map(c => c.Field);
      
      if (colNames.includes('reference_code')) {
        await conn.execute(
          `INSERT INTO bibliographies (reference_code, title, authors, year, journal, volume, pages, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [bib.code, bib.title, bib.authors, bib.year, bib.journal, bib.volume, bib.pages]
        );
        created++;
        console.log(`  + Bib: ${bib.title.substring(0, 60)}`);
      }
    } catch(e) {
      errors++;
      console.error(`  ✗ Bib ${bib.code}: ${e.message.substring(0, 100)}`);
    }
  }

  const [[totalPlants]] = await conn.execute('SELECT COUNT(*) as n FROM plants');
  const [[totalRE]] = await conn.execute('SELECT COUNT(*) as n FROM research_entries');
  console.log('\n=== Résumé Final ===');
  console.log(`Créés: ${created} | Enrichis/Existants: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total plantes: ${totalPlants.n} | Total research_entries: ${totalRE.n}`);
  
  await conn.end();
}

main().catch(console.error);
