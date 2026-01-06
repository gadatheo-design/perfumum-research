/**
 * Script d'import du corpus PERFUMUM
 * Importe les données des fichiers CSV et MD dans la base de données
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const UPLOAD_DIR = '/home/ubuntu/upload';

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
};

// Fonction pour parser un CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }
  
  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

// Import des axes de recherche
async function importResearchAxes(conn) {
  console.log('📊 Import des axes de recherche...');
  
  const csvPath = path.join(UPLOAD_DIR, 'research_axes.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  for (const row of rows) {
    try {
      await conn.execute(`
        INSERT INTO perfumum_research_axes (axis_id, slug, title_fr, tagline_fr, default_layout, status, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title_fr = VALUES(title_fr), tagline_fr = VALUES(tagline_fr)
      `, [
        row.axis_id,
        row.slug,
        row.title_fr,
        row.tagline_fr,
        row.default_layout,
        row.status || 'mvp',
        rows.indexOf(row) + 1
      ]);
    } catch (err) {
      console.error(`  Erreur axe ${row.axis_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${rows.length} axes importés`);
}

// Import du contenu de recherche (notes, protocoles, études de cas)
async function importResearchContent(conn) {
  console.log('📝 Import du contenu de recherche...');
  
  const csvPath = path.join(UPLOAD_DIR, 'content_index.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Lire le contenu du fichier MD si disponible
      let mdContent = '';
      const mdFileName = row.slug + '.fr.md';
      const mdPath = path.join(UPLOAD_DIR, mdFileName);
      if (fs.existsSync(mdPath)) {
        mdContent = fs.readFileSync(mdPath, 'utf-8');
      }
      
      await conn.execute(`
        INSERT INTO research_content (content_id, slug, axis_id, title, content_type, lang, status, file_path, evidence_level, tags, regions, content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)
      `, [
        row.id,
        row.slug,
        row.axis_id,
        row.title,
        row.type,
        row.lang || 'fr',
        row.status || 'published',
        row.file_path,
        row.evidence_level || 'hypothetical',
        JSON.stringify((row.tags || '').split(';').filter(t => t)),
        JSON.stringify((row.regions || '').split(';').filter(r => r)),
        mdContent
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur contenu ${row.id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} contenus importés`);
}

// Import des plantes aromatiques
async function importPlants(conn) {
  console.log('🌿 Import des plantes aromatiques...');
  
  const csvPath = path.join(UPLOAD_DIR, 'perfumum_plants_template_30_col_bfa_car.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      await conn.execute(`
        INSERT INTO perfumum_plants (name, latin_name, family, category, origin, habitat, olfactive_signature, dominant_molecules, climatic_axis, traditional_use, absorbe_use, kingdom, division, class_field, order_name, genus, species, life_cycle, harvest_period, essential_oil_yield, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), olfactive_signature = VALUES(olfactive_signature)
      `, [
        row.name,
        row.latin_name,
        row.family,
        row.category,
        row.origin,
        row.habitat,
        row.olfactive_signature,
        row.dominant_molecules,
        row.climatic_axis,
        row.traditional_use,
        row.absorbe_use,
        row.kingdom || 'Plantae',
        row.division,
        row.class,
        row.order_name,
        row.genus,
        row.species,
        row.life_cycle,
        row.harvest_period,
        row.essential_oil_yield,
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur plante ${row.latin_name}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} plantes importées`);
}

// Import des molécules
async function importMolecules(conn) {
  console.log('🧪 Import des molécules...');
  
  const csvPath = path.join(UPLOAD_DIR, 'perfumum_molecules_template.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper le rôle
      let role = null;
      if (row.role) {
        const roleMap = {
          'diffusion': 'diffusion',
          'modulation': 'modulation',
          'structure': 'structure',
          'fixation': 'fixation'
        };
        role = roleMap[row.role.toLowerCase()] || null;
      }
      
      await conn.execute(`
        INSERT INTO perfumum_molecules (molecule_name, family, odor_key, role, climatic_axis)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE family = VALUES(family), odor_key = VALUES(odor_key)
      `, [
        row.molecule_name,
        row.family,
        row.odor_key,
        role,
        row.climatic_axis
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur molécule ${row.molecule_name}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} molécules importées`);
}

// Import des partenaires
async function importPartners(conn) {
  console.log('🤝 Import des partenaires...');
  
  const csvPath = path.join(UPLOAD_DIR, 'partners_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper le type
      const typeMap = {
        'ngo': 'ngo',
        'botanic_garden': 'botanic_garden',
        'lab': 'research_institute',
        'museum': 'museum',
        'university': 'university'
      };
      const partnerType = typeMap[row.type] || 'other';
      
      // Mapper le statut MOU
      const mouMap = {
        'contacted': 'discussion',
        'in_negotiation': 'draft',
        'idea': 'idea'
      };
      const mouStatus = mouMap[row.mou_status] || 'idea';
      
      await conn.execute(`
        INSERT INTO partner_institutions (partner_id, name, country, type, focus, contact, mou_status, notes, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AX6_OLFACTIVE_DIPLOMACY')
        ON DUPLICATE KEY UPDATE name = VALUES(name), mou_status = VALUES(mou_status)
      `, [
        row.partner_id,
        row.name,
        row.country,
        partnerType,
        JSON.stringify((row.focus || '').split(';').filter(f => f)),
        row.contact || null,
        mouStatus,
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur partenaire ${row.partner_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} partenaires importés`);
}

// Import des manuscrits
async function importManuscripts(conn) {
  console.log('📜 Import des manuscrits...');
  
  const csvPath = path.join(UPLOAD_DIR, 'manuscripts_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper le statut OCR
      const ocrMap = {
        'needs_review': 'manual',
        'queued': 'queued',
        'done': 'completed'
      };
      const ocrStatus = ocrMap[row.ocr_status] || 'queued';
      
      // Mapper la licence
      const licenseMap = {
        'CC-BY': 'CC-BY',
        'All-rights-reserved': 'All-rights-reserved',
        'Unknown': 'Unknown'
      };
      const license = licenseMap[row.license] || 'Unknown';
      
      await conn.execute(`
        INSERT INTO perfumum_manuscripts (manuscript_id, title, language, date_range, repository, region, license, scan_url, ocr_status, tags, notes, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AX2_ETHNOBOTANY_COMP')
        ON DUPLICATE KEY UPDATE title = VALUES(title), ocr_status = VALUES(ocr_status)
      `, [
        row.manuscript_id,
        row.title,
        row.language,
        row.date_range,
        row.repository,
        row.region,
        license,
        row.scan_url || null,
        ocrStatus,
        JSON.stringify((row.tags || '').split(';').filter(t => t)),
        null
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur manuscrit ${row.manuscript_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} manuscrits importés`);
}

// Import des fragments textuels
async function importTextFragments(conn) {
  console.log('📄 Import des fragments textuels...');
  
  const csvPath = path.join(UPLOAD_DIR, 'text_fragments_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      await conn.execute(`
        INSERT INTO text_fragments (fragment_id, manuscript_id, language, original_text, translation_fr, entities, evidence_level, notes, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AX2_ETHNOBOTANY_COMP')
        ON DUPLICATE KEY UPDATE entities = VALUES(entities)
      `, [
        row.fragment_id,
        row.manuscript_id,
        row.language,
        row.original_text,
        row.translation_fr,
        row.entities,
        row.evidence_level || 'hypothetical',
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur fragment ${row.fragment_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} fragments importés`);
}

// Import des routes commerciales
async function importTradeRoutes(conn) {
  console.log('🗺️ Import des routes commerciales...');
  
  const csvPath = path.join(UPLOAD_DIR, 'trade_routes_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      await conn.execute(`
        INSERT INTO trade_routes (route_id, name, time_start, time_end, nodes, materials, notes, sources, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AX2_ETHNOBOTANY_COMP')
        ON DUPLICATE KEY UPDATE name = VALUES(name), nodes = VALUES(nodes)
      `, [
        row.route_id,
        row.name,
        parseInt(row.time_start) || null,
        parseInt(row.time_end) || null,
        row.nodes,
        JSON.stringify((row.materials || '').split(';').filter(m => m)),
        row.notes,
        row.sources ? JSON.stringify([row.sources]) : '[]'
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur route ${row.route_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} routes importées`);
}

// Import du glossaire
async function importGlossary(conn) {
  console.log('📖 Import du glossaire...');
  
  const mdPath = path.join(UPLOAD_DIR, 'glossary.fr.md');
  const content = fs.readFileSync(mdPath, 'utf-8');
  
  // Parser le fichier MD pour extraire les termes
  const lines = content.split('\n');
  let currentTerm = null;
  let currentDefinition = '';
  let termCount = 0;
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Sauvegarder le terme précédent
      if (currentTerm && currentDefinition) {
        try {
          const termId = `GLOSS_${termCount.toString().padStart(3, '0')}`;
          await conn.execute(`
            INSERT INTO perfumum_glossary (term_id, term, definition_fr, category)
            VALUES (?, ?, ?, 'general')
            ON DUPLICATE KEY UPDATE definition_fr = VALUES(definition_fr)
          `, [termId, currentTerm, currentDefinition.trim()]);
          termCount++;
        } catch (err) {
          console.error(`  Erreur terme ${currentTerm}:`, err.message);
        }
      }
      
      // Nouveau terme
      currentTerm = line.replace('## ', '').trim();
      currentDefinition = '';
    } else if (currentTerm && line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      currentDefinition += line + '\n';
    }
  }
  
  // Sauvegarder le dernier terme
  if (currentTerm && currentDefinition) {
    try {
      const termId = `GLOSS_${termCount.toString().padStart(3, '0')}`;
      await conn.execute(`
        INSERT INTO perfumum_glossary (term_id, term, definition_fr, category)
        VALUES (?, ?, ?, 'general')
        ON DUPLICATE KEY UPDATE definition_fr = VALUES(definition_fr)
      `, [termId, currentTerm, currentDefinition.trim()]);
      termCount++;
    } catch (err) {
      console.error(`  Erreur terme ${currentTerm}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${termCount} termes importés`);
}

// Import des mélanges olfactifs
async function importScentBlends(conn) {
  console.log('🌸 Import des mélanges olfactifs...');
  
  const csvPath = path.join(UPLOAD_DIR, 'scent_blends_space_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      await conn.execute(`
        INSERT INTO scent_blends (blend_id, climate_axis, intended_medium, concept, materials, safety_notes)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE concept = VALUES(concept), materials = VALUES(materials)
      `, [
        row.blend_id,
        row.climate_axis,
        row.intended_medium,
        row.concept,
        JSON.stringify((row.materials || '').split(';').filter(m => m)),
        row.safety_notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur mélange ${row.blend_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} mélanges importés`);
}

// Import de la matrice climatique
async function importClimateMatrix(conn) {
  console.log('🌡️ Import de la matrice climatique...');
  
  const csvPath = path.join(UPLOAD_DIR, 'climate_axis_medium_matrix.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper les valeurs
      const diffusionMap = { 'low': 'low', 'medium': 'medium', 'high': 'high' };
      const persistenceMap = { 'short': 'short', 'medium': 'medium', 'long': 'long' };
      const volatilityMap = { 'top': 'top', 'heart': 'heart', 'base': 'base' };
      
      await conn.execute(`
        INSERT INTO climate_axis_matrix (climate_axis, medium, target_diffusion, target_persistence, volatility_bias, carrier_or_support, safety_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        row.climate_axis,
        row.medium,
        diffusionMap[row.target_diffusion] || 'medium',
        persistenceMap[row.target_persistence] || 'medium',
        volatilityMap[row.volatility_bias] || 'heart',
        row.carrier_or_support,
        row.safety_notes
      ]);
      imported++;
    } catch (err) {
      if (!err.message.includes('Duplicate')) {
        console.error(`  Erreur matrice ${row.climate_axis}/${row.medium}:`, err.message);
      }
    }
  }
  
  console.log(`  ✓ ${imported} entrées de matrice importées`);
}

// Import des métriques d'impact
async function importImpactMetrics(conn) {
  console.log('📈 Import des métriques d\'impact...');
  
  const csvPath = path.join(UPLOAD_DIR, 'impact_metrics_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      await conn.execute(`
        INSERT INTO impact_metrics (year, genomes_sequenced_target, chemical_profiles_target, documents_digitized_target, citizen_contributors_target, partners_target, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE genomes_sequenced_target = VALUES(genomes_sequenced_target)
      `, [
        parseInt(row.year),
        parseInt(row.genomes_sequenced_target) || 0,
        parseInt(row.chemical_profiles_target) || 0,
        parseInt(row.documents_digitized_target) || 0,
        parseInt(row.citizen_contributors_target) || 0,
        parseInt(row.partners_target) || 0,
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur métrique ${row.year}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} métriques importées`);
}

// Import des observations citoyennes
async function importCitizenObservations(conn) {
  console.log('👥 Import des observations citoyennes...');
  
  const csvPath = path.join(UPLOAD_DIR, 'citizen_observations_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper le statut
      const statusMap = {
        'submitted': 'submitted',
        'needs_more_info': 'pending_review',
        'verified': 'verified'
      };
      const status = statusMap[row.status] || 'submitted';
      
      await conn.execute(`
        INSERT INTO citizen_observations (obs_id, user_handle, plant_guess, lat, lon, obs_date, photo_url, confidence_ai, status, notes, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AX5_IMMERSIVE_DEMOCRAT')
        ON DUPLICATE KEY UPDATE status = VALUES(status)
      `, [
        row.obs_id,
        row.user_handle,
        row.plant_guess,
        parseFloat(row.lat) || null,
        parseFloat(row.lon) || null,
        row.date || null,
        row.photo_url || null,
        parseFloat(row.confidence_ai) || null,
        status,
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur observation ${row.obs_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} observations importées`);
}

// Import des échantillons d'herbier
async function importHerbariumSamples(conn) {
  console.log('🌿 Import des échantillons d\'herbier...');
  
  const csvPath = path.join(UPLOAD_DIR, 'herbarium_samples_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper le type d'échantillon
      const typeMap = {
        'pressed_leaf': 'pressed_leaf',
        'seed': 'seed',
        'resin': 'bark'
      };
      const sampleType = typeMap[row.sample_type] || 'pressed_leaf';
      
      await conn.execute(`
        INSERT INTO perfumum_herbarium_samples (herbarium_id, plant_latin_name, year, collection, repository, sample_type, allowed_sampling, notes, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AX3_ANALYTICAL_TRANS_EPOCH')
        ON DUPLICATE KEY UPDATE year = VALUES(year)
      `, [
        row.herbarium_id,
        row.plant_latin_name,
        parseInt(row.year) || null,
        row.collection,
        row.repository || null,
        sampleType,
        row.allowed_sampling === 'True' ? 1 : 0,
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur herbier ${row.herbarium_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} échantillons d'herbier importés`);
}

// Import des lignes de culture tissulaire
async function importTissueCultureLines(conn) {
  console.log('🧬 Import des lignes de culture tissulaire...');
  
  const csvPath = path.join(UPLOAD_DIR, 'tissue_culture_lines_seed.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  let imported = 0;
  for (const row of rows) {
    try {
      // Mapper la méthode
      const methodMap = {
        'callus': 'callus',
        'meristem': 'meristem'
      };
      const method = methodMap[row.method] || 'meristem';
      
      // Mapper le statut
      const statusMap = {
        'active': 'active',
        'cryobanked': 'cryopreserved'
      };
      const status = statusMap[row.status] || 'active';
      
      // Mapper le stockage
      const storageMap = {
        'in_vitro': 'in_vitro',
        'LN2': 'LN2',
        '-80C': '-80C'
      };
      const storage = storageMap[row.storage] || 'in_vitro';
      
      await conn.execute(`
        INSERT INTO tissue_culture_lines (line_id, plant_latin_name, origin, method, status, storage, notes, axis_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'AX4_CONSERVATION_BIOTECH')
        ON DUPLICATE KEY UPDATE status = VALUES(status)
      `, [
        row.line_id,
        row.plant_latin_name,
        row.origin,
        method,
        status,
        storage,
        row.notes
      ]);
      imported++;
    } catch (err) {
      console.error(`  Erreur ligne ${row.line_id}:`, err.message);
    }
  }
  
  console.log(`  ✓ ${imported} lignes de culture importées`);
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage de l\'import du corpus PERFUMUM...\n');
  
  // Lire les variables d'environnement
  const envPath = '/home/ubuntu/perfumum-research/.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
  
  // Parser DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      dbConfig.user = match[1];
      dbConfig.password = match[2];
      dbConfig.host = match[3];
      dbConfig.port = parseInt(match[4]);
      dbConfig.database = match[5];
    }
  }
  
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    console.log('✓ Connexion à la base de données établie\n');
    
    // Exécuter les imports
    await importResearchAxes(conn);
    await importResearchContent(conn);
    await importPlants(conn);
    await importMolecules(conn);
    await importPartners(conn);
    await importManuscripts(conn);
    await importTextFragments(conn);
    await importTradeRoutes(conn);
    await importGlossary(conn);
    await importScentBlends(conn);
    await importClimateMatrix(conn);
    await importImpactMetrics(conn);
    await importCitizenObservations(conn);
    await importHerbariumSamples(conn);
    await importTissueCultureLines(conn);
    
    console.log('\n✅ Import du corpus PERFUMUM terminé avec succès!');
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main();
