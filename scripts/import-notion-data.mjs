/**
 * PERFUMUM — Script d'import Notion → Base de données
 * Importe molécules, matières premières et variétés de tabac depuis les données Notion récupérées.
 * Stratégie : upsert par nom canonique (enrichissement si existant, création si absent).
 */

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Chargement des données Notion ───────────────────────────────────────────

const MCP_RESULTS = '/home/ubuntu/.mcp/tool-results/';

function loadJson(filename) {
  try {
    const content = readFileSync(join(MCP_RESULTS, filename), 'utf8');
    const d = JSON.parse(content);
    return d.results || [];
  } catch (e) {
    console.warn(`⚠️  Impossible de charger ${filename}: ${e.message}`);
    return [];
  }
}

// Données Notion récupérées
const notionMolecules = loadJson('2026-03-07_19-14-47_notion_notion-query-database-view.json');
const notionMatieres = loadJson('2026-03-07_19-15-43_notion_notion-query-database-view.json');
const notionTabacs = loadJson('2026-03-07_19-16-43_notion_notion-query-database-view.json');
const notionCannabis = loadJson('2026-03-07_19-16-44_notion_notion-query-database-view.json');

console.log(`📊 Données Notion chargées :`);
console.log(`   Molécules : ${notionMolecules.length}`);
console.log(`   Matières premières : ${notionMatieres.length}`);
console.log(`   Tabacs : ${notionTabacs.length}`);
console.log(`   Cannabis : ${notionCannabis.length}`);
console.log('');

// ─── Normalisation ────────────────────────────────────────────────────────────

function normalizeName(name) {
  return (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseFamily(familleStr) {
  if (!familleStr) return null;
  // Peut être une string JSON array ou une string simple
  try {
    if (familleStr.startsWith('[')) {
      const arr = JSON.parse(familleStr);
      return arr.join(', ');
    }
  } catch {}
  return familleStr.trim();
}

function parseSynonyms(synonymesStr) {
  if (!synonymesStr) return [];
  return synonymesStr.split(';').map(s => s.trim()).filter(Boolean);
}

function mapMaterialType(type) {
  const map = {
    'Huile essentielle': 'huile_essentielle',
    'Absolu': 'absolue',
    'Concrète': 'concrete',
    'Résinoïde': 'resinoid',
    'Teinture': 'teinture',
    'CO2': 'co2_extract',
    'Hydrolat': 'hydrolat',
    'Tabac': 'tabac',
    'Cannabis/CBD': 'cannabis',
    'Autre': 'synthétique',
    'Support': 'support',
  };
  return map[type] || 'autre';
}

function mapNote(note) {
  const map = {
    'Tête': 'tete',
    'Cœur': 'coeur',
    'Fond': 'fond',
    'Accord': 'accord',
  };
  return map[note] || null;
}

// ─── Import ───────────────────────────────────────────────────────────────────

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let stats = {
    molecules: { created: 0, updated: 0, skipped: 0 },
    rawMaterials: { created: 0, updated: 0, skipped: 0 },
    tobaccoVarieties: { created: 0, skipped: 0 },
    cannabisStrains: { created: 0, skipped: 0 },
  };

  // ── 1. Import des molécules ─────────────────────────────────────────────────
  console.log('🧪 Import des molécules Notion...');
  
  for (const mol of notionMolecules) {
    const nomCanonique = (mol['Nom canonique'] || mol['Nom'] || '').trim();
    const nom = (mol['Nom'] || '').trim();
    if (!nom) continue;

    const normalizedName = normalizeName(nomCanonique || nom);
    
    // Chercher si la molécule existe déjà (par nom canonique ou nom)
    const [existing] = await conn.execute(
      `SELECT id, name, family, olfactiveProfile, notes FROM molecules
       WHERE LOWER(name) = ? OR LOWER(name) = ? LIMIT 1`,
      [normalizedName, normalizeName(nom)]
    );

    const synonyms = parseSynonyms(mol['Synonymes']);
    const famille = mol['Famille'] || null;
    const description = mol['Description'] || null;
    const emotion = mol['Émotion'] || null;
    const notionUrl = mol['url'] || null;

    if (existing.length > 0) {
      // Enrichir l'entrée existante si des champs sont vides
      const row = existing[0];
      const updates = [];
      const values = [];

      if (!row.family && famille) {
        updates.push('family = ?');
        values.push(famille);
      }
      if (!row.olfactiveProfile && description) {
        updates.push('olfactiveProfile = ?');
        values.push(description);
      }
      if (!row.notes && emotion) {
        updates.push('notes = ?');
        values.push(`Émotion : ${emotion}`);
      }

      if (updates.length > 0) {
        values.push(row.id);
        await conn.execute(
          `UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`,
          values
        ).catch(e => console.warn(`  ⚠️  Update mol ${nom}: ${e.message}`));
        stats.molecules.updated++;
      } else {
        stats.molecules.skipped++;
      }
    } else {
      // Créer une nouvelle molécule
      await conn.execute(
        `INSERT INTO molecules (name, family, olfactiveProfile, notes, sourceOrigin)
         VALUES (?, ?, ?, ?, ?)`,
        [
          nomCanonique || nom,
          famille,
          description,
          emotion ? `Émotion : ${emotion}` : null,
          notionUrl,
        ]
      ).catch(e => console.warn(`  ⚠️  Insert mol ${nom}: ${e.message}`));
      stats.molecules.created++;
    }
  }

  console.log(`   ✅ Molécules : ${stats.molecules.created} créées, ${stats.molecules.updated} enrichies, ${stats.molecules.skipped} inchangées`);

  // ── 2. Import des matières premières ────────────────────────────────────────
  console.log('🌿 Import des matières premières Notion...');

  // Récupérer le dernier ID de matière première pour générer les nouveaux IDs
  const [lastMat] = await conn.execute(
    `SELECT material_id FROM raw_materials ORDER BY id DESC LIMIT 1`
  );
  let matCounter = 1;
  if (lastMat.length > 0) {
    const lastId = lastMat[0].material_id;
    const match = lastId.match(/RM-(\d+)/);
    if (match) matCounter = parseInt(match[1]) + 1;
  }

  for (const mat of notionMatieres) {
    const nom = (mat['Nom'] || '').trim();
    if (!nom) continue;

    // Chercher si la matière première existe déjà
    const [existing] = await conn.execute(
      `SELECT id, name FROM raw_materials WHERE LOWER(name) = ? LIMIT 1`,
      [normalizeName(nom)]
    );

    const type = mapMaterialType(mat['Type'] || 'Autre');
    const note = mapNote(mat['Note'] || '');
    const famille = parseFamily(mat['Famille olfactive'] || '');
    const profil = mat['Profil olfactif'] || null;
    const notesTech = mat['Notes techniques'] || null;
    const origine = mat['Origine'] || null;
    const fournisseur = mat['Fournisseur'] || null;
    const stock = mat['Stock (ml)'] ? parseFloat(mat['Stock (ml)']) : null;
    const prix = mat['Prix (CHF/ml)'] ? parseFloat(mat['Prix (CHF/ml)']) : null;
    const nomBotanique = mat['Nom botanique'] || null;
    const statut = mat['Statut'] || 'En stock';

    if (existing.length > 0) {
      stats.rawMaterials.updated++;
      // Enrichir si nécessaire (on ne surécrit pas les données existantes)
      await conn.execute(
        `UPDATE raw_materials SET
          olfactive_profile = COALESCE(NULLIF(olfactive_profile, ''), ?),
          usage_notes = COALESCE(NULLIF(usage_notes, ''), ?),
          origin_country = COALESCE(NULLIF(origin_country, ''), ?)
         WHERE id = ?`,
        [profil, notesTech, origine, existing[0].id]
      ).catch(e => console.warn(`  ⚠️  Update mat ${nom}: ${e.message}`));
    } else {
      // Créer une nouvelle matière première
      const newId = `RM-${String(matCounter).padStart(3, '0')}`;
      matCounter++;

      // Mapper la catégorie vers les valeurs enum valides
      const validCategories = ['huile_essentielle','absolue','concrete','resinoid','teinture','co2_extract','hydrolat','beurre','cire','oleoresine','infusion','maceration','distillat','accord_olfactif','molecule_isolee','matiere_animale','autre'];
      const categoryVal = validCategories.includes(type) ? type : 'autre';
      
      // Mapper la famille olfactive vers les valeurs enum valides
      const validFamilies = ['floral','boise','agrume','epice','herbace','balsamique','musque','animal','vert','fruité','marin','terreux','fumé','gourmand','aromatique','autre'];
      const familleNorm = (famille || '').toLowerCase().split(',')[0].trim();
      const familleVal = validFamilies.includes(familleNorm) ? familleNorm : 'autre';
      
      await conn.execute(
        `INSERT INTO raw_materials
          (material_id, name, latin_name, category, olfactive_family, olfactive_profile,
           usage_notes, origin_country, suppliers, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId, nom, nomBotanique, categoryVal, familleVal, profil,
          notesTech, origine || null,
          fournisseur ? JSON.stringify([fournisseur]) : null,
          notesTech,
        ]
      ).catch(e => console.warn(`  ⚠️  Insert mat ${nom}: ${e.message}`));
      stats.rawMaterials.created++;
    }
  }

  console.log(`   ✅ Matières premières : ${stats.rawMaterials.created} créées, ${stats.rawMaterials.updated} enrichies`);

  // ── 3. Import des variétés de tabac ─────────────────────────────────────────
  console.log('🚬 Import des variétés de tabac Notion...');

  // Vérifier si la table tobacco_varieties existe
  const [tablesCheck] = await conn.execute(
    `SELECT TABLE_NAME FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tobacco_varieties'`
  );

  if (tablesCheck.length === 0) {
    console.log('   ⚠️  Table tobacco_varieties inexistante — migration requise (pnpm db:push)');
    console.log('   📝 Les données tabac seront importées après la migration.');
  } else {
    for (const tab of notionTabacs) {
      const nom = (tab['Nom'] || '').trim();
      if (!nom) continue;

      const [existing] = await conn.execute(
        `SELECT id FROM tobacco_varieties WHERE LOWER(name) = ? LIMIT 1`,
        [normalizeName(nom)]
      );

      if (existing.length > 0) {
        stats.tobaccoVarieties.skipped++;
        continue;
      }

      await conn.execute(
        `INSERT INTO tobacco_varieties (name, supplier, technical_notes, origin)
         VALUES (?, ?, ?, ?)`,
        [
          nom,
          tab['Fournisseur'] || null,
          tab['Notes techniques'] || null,
          tab['Origine'] || null,
        ]
      ).catch(e => console.warn(`  ⚠️  Insert tabac ${nom}: ${e.message}`));
      stats.tobaccoVarieties.created++;
    }
    console.log(`   ✅ Tabacs : ${stats.tobaccoVarieties.created} créés, ${stats.tobaccoVarieties.skipped} existants`);
  }

  // ── 4. Import Cannabis ───────────────────────────────────────────────────────
  console.log('🌿 Import des variétés Cannabis Notion...');

  const [cannabisCheck] = await conn.execute(
    `SELECT TABLE_NAME FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'cannabis_strains'`
  );

  if (cannabisCheck.length === 0) {
    console.log('   ⚠️  Table cannabis_strains inexistante — migration requise (pnpm db:push)');
  } else {
    for (const can of notionCannabis) {
      const nom = (can['Nom'] || '').trim();
      if (!nom) continue;

      const [existing] = await conn.execute(
        `SELECT id FROM cannabis_strains WHERE LOWER(name) = ? LIMIT 1`,
        [normalizeName(nom)]
      );

      if (existing.length > 0) {
        stats.cannabisStrains.skipped++;
        continue;
      }

      await conn.execute(
        `INSERT INTO cannabis_strains (name, supplier, technical_notes)
         VALUES (?, ?, ?)`,
        [
          nom,
          can['Fournisseur'] || null,
          can['Notes techniques'] || null,
        ]
      ).catch(e => console.warn(`  ⚠️  Insert cannabis ${nom}: ${e.message}`));
      stats.cannabisStrains.created++;
    }
    console.log(`   ✅ Cannabis : ${stats.cannabisStrains.created} créés, ${stats.cannabisStrains.skipped} existants`);
  }

  await conn.end();

  // ── Résumé final ─────────────────────────────────────────────────────────────
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DE L\'IMPORT NOTION');
  console.log('═══════════════════════════════════════════════');
  console.log(`🧪 Molécules    : ${stats.molecules.created} nouvelles | ${stats.molecules.updated} enrichies | ${stats.molecules.skipped} inchangées`);
  console.log(`🌿 Mat. Prem.   : ${stats.rawMaterials.created} nouvelles | ${stats.rawMaterials.updated} enrichies`);
  console.log(`🚬 Tabacs       : ${stats.tobaccoVarieties.created} nouvelles | ${stats.tobaccoVarieties.skipped} existantes`);
  console.log(`🌱 Cannabis     : ${stats.cannabisStrains.created} nouvelles | ${stats.cannabisStrains.skipped} existantes`);
  console.log('═══════════════════════════════════════════════');
}

main().catch(e => {
  console.error('❌ Erreur fatale :', e.message);
  process.exit(1);
});
