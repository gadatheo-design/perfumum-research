/**
 * PERFUMUM — Script d'import Bibliographie + Recettes Petrichor
 * Sources :
 *   - data/references_to_import.json (30 refs scientifiques)
 *   - data/v4_references_to_import.json (29 refs cannabis/tabac)
 *   - data/sources-to-import.json (30 sources)
 *   - notion_recettes_radicales.json (5 accords Petrichor extrêmes)
 */

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT = join(__dirname, '..');

function loadJson(relPath) {
  try {
    return JSON.parse(readFileSync(join(PROJECT, relPath), 'utf8'));
  } catch (e) {
    console.warn(`⚠️  Impossible de charger ${relPath}: ${e.message}`);
    return null;
  }
}

// Normalisation des domaines de recherche
function mapDomain(domain) {
  const map = {
    'chimie': 'chimie_olfactive',
    'chimie_olfactive': 'chimie_olfactive',
    'botanique': 'botanique',
    'ethnobotanique': 'ethnobotanique',
    'histoire': 'histoire_parfumerie',
    'histoire_parfumerie': 'histoire_parfumerie',
    'neurologie': 'neurologie_olfactive',
    'neurologie_olfactive': 'neurologie_olfactive',
    'extraction': 'extraction',
    'formulation': 'formulation',
    'reglementation': 'reglementation',
    'durabilite': 'durabilite',
    'tabac': 'tabac_cannabis',
    'cannabis': 'tabac_cannabis',
    'tabac_cannabis': 'tabac_cannabis',
    'methodologie': 'methodologie',
    'parfumerie': 'histoire_parfumerie',
    'olfaction': 'neurologie_olfactive',
  };
  if (!domain) return 'autre';
  const key = domain.toLowerCase().replace(/[^a-z_]/g, '');
  return map[key] || 'autre';
}

function mapEntryType(type) {
  const valid = ['article','book','inbook','incollection','inproceedings','conference','thesis',
    'mastersthesis','phdthesis','techreport','manual','unpublished','misc','online','patent',
    'standard','dataset','software'];
  const t = (type || '').toLowerCase();
  if (valid.includes(t)) return t;
  if (t === 'journal') return 'article';
  if (t === 'webpage' || t === 'website') return 'online';
  return 'misc';
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  let stats = {
    bibliography: { created: 0, skipped: 0 },
    recettes: { created: 0, skipped: 0 },
  };

  // ── 1. Import des références bibliographiques ────────────────────────────────
  console.log('📚 Import des références bibliographiques...');

  const refs1 = loadJson('data/references_to_import.json') || [];
  const refs2 = loadJson('data/v4_references_to_import.json') || [];
  const sources = (loadJson('data/sources-to-import.json') || {}).sources || [];

  // Fusionner et dédoublonner par entry_key
  const allRefs = new Map();
  for (const r of [...refs1, ...refs2]) {
    const key = r.entryKey || r.entry_key || r.id;
    if (key && !allRefs.has(key)) allRefs.set(key, r);
  }
  for (const s of sources) {
    const key = s.entry_key || s.entryKey || s.id;
    if (key && !allRefs.has(key)) allRefs.set(key, s);
  }

  console.log(`   Références à traiter : ${allRefs.size}`);

  for (const [key, ref] of allRefs) {
    // Vérifier si la référence existe déjà
    const [existing] = await conn.execute(
      'SELECT id FROM bibliography_entries WHERE entry_key = ? LIMIT 1',
      [key]
    );

    if (existing.length > 0) {
      stats.bibliography.skipped++;
      continue;
    }

    const entryType = mapEntryType(ref.entryType || ref.entry_type || ref.type || 'article');
    const domain = mapDomain(ref.research_domain || ref.domain || '');
    const year = parseInt(ref.year) || null;
    const relevance = parseInt(ref.relevance_score || ref.relevance || 3) || 3;

    // Construire les keywords
    let keywords = null;
    if (ref.keywords) {
      if (Array.isArray(ref.keywords)) keywords = JSON.stringify(ref.keywords);
      else if (typeof ref.keywords === 'string') keywords = JSON.stringify(ref.keywords.split(',').map(k => k.trim()));
    }

    await conn.execute(
      `INSERT INTO bibliography_entries 
        (entry_key, entry_type, title, authors, year, journal, booktitle, publisher,
         volume, number, pages, doi, url, abstract, keywords, research_domain,
         relevance_score, read_status, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        key,
        entryType,
        (ref.title || '').substring(0, 499),
        (ref.authors || ref.author || '').substring(0, 999),
        year,
        (ref.journal || ref.containerTitle || ref.container_title || '').substring(0, 254),
        (ref.booktitle || '').substring(0, 254),
        (ref.publisher || '').substring(0, 254),
        (ref.volume || '').substring(0, 49),
        (ref.number || ref.issue || '').substring(0, 49),
        (ref.pages || '').substring(0, 49),
        (ref.doi || '').substring(0, 99),
        (ref.url || '').substring(0, 499),
        (ref.abstract || ref.description || '').substring(0, 9999),
        keywords,
        domain,
        Math.min(Math.max(relevance, 1), 5),
        ref.read_status || 'unread',
        ref.language || 'en',
      ]
    ).catch(e => console.warn(`  ⚠️  Insert ref ${key}: ${e.message}`));
    stats.bibliography.created++;
  }

  console.log(`   ✅ Bibliographie : ${stats.bibliography.created} créées, ${stats.bibliography.skipped} existantes`);

  // ── 2. Import des recettes Petrichor Radicalis Extremis ──────────────────────
  console.log('🌧️  Import des recettes Petrichor Radicalis Extremis...');

  const petrichorData = loadJson('notion_recettes_radicales.json');
  if (!petrichorData || !petrichorData.accords) {
    console.log('   ⚠️  Fichier notion_recettes_radicales.json non trouvé ou vide');
  } else {
    // Vérifier la structure de la table recettes
    const [recetteCols] = await conn.execute('DESCRIBE recettes').catch(() => [[]]);
    const colNames = recetteCols.map(c => c.Field);

    for (const accord of petrichorData.accords) {
      const nom = accord.nom || `Accord ${accord.id}`;
      
      // Vérifier si la recette existe déjà
      const [existing] = await conn.execute(
        'SELECT id FROM recettes WHERE LOWER(name) = ? LIMIT 1',
        [nom.toLowerCase()]
      );

      if (existing.length > 0) {
        stats.recettes.skipped++;
        continue;
      }

      // Construire la liste des ingrédients
      const ingredients = (accord.architecture || []).map(a => ({
        ingredient: a.ingredient,
        concentration: a.concentration,
        note: a.note || '',
      }));

      // Champs disponibles selon le schéma
      const insertData = {
        name: nom.substring(0, 254),
        description: [
          accord.concept || '',
          accord.effet ? `\nEffet : ${accord.effet}` : '',
          accord.usage_artistique ? `\nUsage artistique : ${accord.usage_artistique}` : '',
          petrichorData.description ? `\nSérie : ${petrichorData.description}` : '',
        ].join('').trim(),
        serie: petrichorData.serie || 'SÉRIE PETRICHOR — RADICALIS EXTREMIS',
        status: 'draft',
        ingredients_json: JSON.stringify(ingredients),
        symbole: accord.symbole || null,
        avertissement: petrichorData.avertissement || null,
      };

      // Construire la requête selon les colonnes disponibles
      const availableFields = ['name', 'description'].filter(f => colNames.includes(f));
      
      if (colNames.includes('notes')) {
        await conn.execute(
          `INSERT INTO recettes (name, description, notes) VALUES (?, ?, ?)`,
          [
            insertData.name,
            insertData.description,
            `Série: ${insertData.serie}\nSymbole: ${insertData.symbole || ''}\nIngrédients: ${JSON.stringify(ingredients, null, 2)}`,
          ]
        ).catch(e => console.warn(`  ⚠️  Insert recette ${nom}: ${e.message}`));
      } else {
        await conn.execute(
          `INSERT INTO recettes (name, description) VALUES (?, ?)`,
          [insertData.name, insertData.description]
        ).catch(e => console.warn(`  ⚠️  Insert recette ${nom}: ${e.message}`));
      }
      stats.recettes.created++;
    }
    console.log(`   ✅ Recettes Petrichor : ${stats.recettes.created} créées, ${stats.recettes.skipped} existantes`);
  }

  await conn.end();

  // ── Résumé final ─────────────────────────────────────────────────────────────
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DE L\'IMPORT BIBLIOGRAPHIE');
  console.log('═══════════════════════════════════════════════');
  console.log(`📚 Bibliographie  : ${stats.bibliography.created} nouvelles | ${stats.bibliography.skipped} existantes`);
  console.log(`🌧️  Recettes Petrichor : ${stats.recettes.created} nouvelles | ${stats.recettes.skipped} existantes`);
  console.log('═══════════════════════════════════════════════');
}

main().catch(e => {
  console.error('❌ Erreur fatale :', e.message);
  process.exit(1);
});
