/**
 * Script de seed des données PERFUMUM
 * Utilise les helpers de base de données existants
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "/home/ubuntu/upload";

// Fonction pour parser un CSV
function parseCSV(content: string) {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

async function seedData() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL not set");
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🚀 Démarrage du seed PERFUMUM...\n");

  // Import des axes de recherche
  console.log("📊 Import des axes de recherche...");
  const axesPath = path.join(UPLOAD_DIR, "research_axes.csv");
  if (fs.existsSync(axesPath)) {
    const axesData = parseCSV(fs.readFileSync(axesPath, "utf-8"));
    for (const row of axesData) {
      try {
        await db.execute(sql`
          INSERT INTO perfumum_research_axes (axis_id, slug, title_fr, tagline_fr, default_layout, status, sort_order)
          VALUES (${row.axis_id}, ${row.slug}, ${row.title_fr}, ${row.tagline_fr}, ${row.default_layout}, ${row.status || "mvp"}, ${axesData.indexOf(row) + 1})
          ON DUPLICATE KEY UPDATE title_fr = VALUES(title_fr), tagline_fr = VALUES(tagline_fr)
        `);
      } catch (e: any) {
        console.error(`  Erreur axe ${row.axis_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${axesData.length} axes importés`);
  }

  // Import du contenu de recherche
  console.log("📝 Import du contenu de recherche...");
  const contentPath = path.join(UPLOAD_DIR, "content_index.csv");
  if (fs.existsSync(contentPath)) {
    const contentData = parseCSV(fs.readFileSync(contentPath, "utf-8"));
    let imported = 0;
    for (const row of contentData) {
      try {
        // Lire le contenu MD si disponible
        let mdContent = "";
        const mdFileName = row.slug + ".fr.md";
        const mdPath = path.join(UPLOAD_DIR, mdFileName);
        if (fs.existsSync(mdPath)) {
          mdContent = fs.readFileSync(mdPath, "utf-8");
        }

        const tags = JSON.stringify((row.tags || "").split(";").filter((t) => t));
        const regions = JSON.stringify((row.regions || "").split(";").filter((r) => r));

        await db.execute(sql`
          INSERT INTO research_content (content_id, slug, axis_id, title, content_type, lang, status, file_path, evidence_level, tags, regions, content)
          VALUES (${row.id}, ${row.slug}, ${row.axis_id}, ${row.title}, ${row.type}, ${row.lang || "fr"}, ${row.status || "published"}, ${row.file_path}, ${row.evidence_level || "hypothetical"}, ${tags}, ${regions}, ${mdContent})
          ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur contenu ${row.id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} contenus importés`);
  }

  // Import des plantes
  console.log("🌿 Import des plantes aromatiques...");
  const plantsPath = path.join(UPLOAD_DIR, "perfumum_plants_template_30_col_bfa_car.csv");
  if (fs.existsSync(plantsPath)) {
    const plantsData = parseCSV(fs.readFileSync(plantsPath, "utf-8"));
    let imported = 0;
    for (const row of plantsData) {
      try {
        await db.execute(sql`
          INSERT INTO perfumum_plants (name, latin_name, family, category, origin, habitat, olfactive_signature, dominant_molecules, climatic_axis, traditional_use, absorbe_use, kingdom, division, class_field, order_name, genus, species, life_cycle, harvest_period, essential_oil_yield, notes)
          VALUES (${row.name}, ${row.latin_name}, ${row.family}, ${row.category}, ${row.origin}, ${row.habitat}, ${row.olfactive_signature}, ${row.dominant_molecules}, ${row.climatic_axis}, ${row.traditional_use}, ${row.absorbe_use}, ${row.kingdom || "Plantae"}, ${row.division}, ${row.class}, ${row.order_name}, ${row.genus}, ${row.species}, ${row.life_cycle}, ${row.harvest_period}, ${row.essential_oil_yield}, ${row.notes})
          ON DUPLICATE KEY UPDATE name = VALUES(name), olfactive_signature = VALUES(olfactive_signature)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur plante ${row.latin_name}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} plantes importées`);
  }

  // Import des molécules
  console.log("🧪 Import des molécules...");
  const moleculesPath = path.join(UPLOAD_DIR, "perfumum_molecules_template.csv");
  if (fs.existsSync(moleculesPath)) {
    const moleculesData = parseCSV(fs.readFileSync(moleculesPath, "utf-8"));
    let imported = 0;
    for (const row of moleculesData) {
      try {
        const roleMap: Record<string, string> = {
          diffusion: "diffusion",
          modulation: "modulation",
          structure: "structure",
          fixation: "fixation",
        };
        const role = row.role ? roleMap[row.role.toLowerCase()] || null : null;

        await db.execute(sql`
          INSERT INTO perfumum_molecules (molecule_name, family, odor_key, role, climatic_axis)
          VALUES (${row.molecule_name}, ${row.family}, ${row.odor_key}, ${role}, ${row.climatic_axis})
          ON DUPLICATE KEY UPDATE family = VALUES(family), odor_key = VALUES(odor_key)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur molécule ${row.molecule_name}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} molécules importées`);
  }

  // Import des partenaires
  console.log("🤝 Import des partenaires...");
  const partnersPath = path.join(UPLOAD_DIR, "partners_seed.csv");
  if (fs.existsSync(partnersPath)) {
    const partnersData = parseCSV(fs.readFileSync(partnersPath, "utf-8"));
    let imported = 0;
    for (const row of partnersData) {
      try {
        const typeMap: Record<string, string> = {
          ngo: "ngo",
          botanic_garden: "botanic_garden",
          lab: "research_institute",
          museum: "museum",
          university: "university",
        };
        const partnerType = typeMap[row.type] || "other";

        const mouMap: Record<string, string> = {
          contacted: "discussion",
          in_negotiation: "draft",
          idea: "idea",
        };
        const mouStatus = mouMap[row.mou_status] || "idea";

        const focus = JSON.stringify((row.focus || "").split(";").filter((f) => f));

        await db.execute(sql`
          INSERT INTO partner_institutions (partner_id, name, country, type, focus, contact, mou_status, notes, axis_id)
          VALUES (${row.partner_id}, ${row.name}, ${row.country}, ${partnerType}, ${focus}, ${row.contact || null}, ${mouStatus}, ${row.notes}, 'AX6_OLFACTIVE_DIPLOMACY')
          ON DUPLICATE KEY UPDATE name = VALUES(name), mou_status = VALUES(mou_status)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur partenaire ${row.partner_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} partenaires importés`);
  }

  // Import des manuscrits
  console.log("📜 Import des manuscrits...");
  const manuscriptsPath = path.join(UPLOAD_DIR, "manuscripts_seed.csv");
  if (fs.existsSync(manuscriptsPath)) {
    const manuscriptsData = parseCSV(fs.readFileSync(manuscriptsPath, "utf-8"));
    let imported = 0;
    for (const row of manuscriptsData) {
      try {
        const ocrMap: Record<string, string> = {
          needs_review: "manual",
          queued: "queued",
          done: "completed",
        };
        const ocrStatus = ocrMap[row.ocr_status] || "queued";

        const tags = JSON.stringify((row.tags || "").split(";").filter((t) => t));

        await db.execute(sql`
          INSERT INTO perfumum_manuscripts (manuscript_id, title, language, date_range, repository, region, license, scan_url, ocr_status, tags, notes, axis_id)
          VALUES (${row.manuscript_id}, ${row.title}, ${row.language}, ${row.date_range}, ${row.repository}, ${row.region}, ${row.license || "Unknown"}, ${row.scan_url || null}, ${ocrStatus}, ${tags}, ${null}, 'AX2_ETHNOBOTANY_COMP')
          ON DUPLICATE KEY UPDATE title = VALUES(title), ocr_status = VALUES(ocr_status)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur manuscrit ${row.manuscript_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} manuscrits importés`);
  }

  // Import des fragments textuels
  console.log("📄 Import des fragments textuels...");
  const fragmentsPath = path.join(UPLOAD_DIR, "text_fragments_seed.csv");
  if (fs.existsSync(fragmentsPath)) {
    const fragmentsData = parseCSV(fs.readFileSync(fragmentsPath, "utf-8"));
    let imported = 0;
    for (const row of fragmentsData) {
      try {
        await db.execute(sql`
          INSERT INTO text_fragments (fragment_id, manuscript_id, language, original_text, translation_fr, entities, evidence_level, notes, axis_id)
          VALUES (${row.fragment_id}, ${row.manuscript_id}, ${row.language}, ${row.original_text}, ${row.translation_fr}, ${row.entities}, ${row.evidence_level || "hypothetical"}, ${row.notes}, 'AX2_ETHNOBOTANY_COMP')
          ON DUPLICATE KEY UPDATE entities = VALUES(entities)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur fragment ${row.fragment_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} fragments importés`);
  }

  // Import des routes commerciales
  console.log("🗺️ Import des routes commerciales...");
  const routesPath = path.join(UPLOAD_DIR, "trade_routes_seed.csv");
  if (fs.existsSync(routesPath)) {
    const routesData = parseCSV(fs.readFileSync(routesPath, "utf-8"));
    let imported = 0;
    for (const row of routesData) {
      try {
        const materials = JSON.stringify((row.materials || "").split(";").filter((m) => m));
        const sources = row.sources ? JSON.stringify([row.sources]) : "[]";

        await db.execute(sql`
          INSERT INTO trade_routes (route_id, name, time_start, time_end, nodes, materials, notes, sources, axis_id)
          VALUES (${row.route_id}, ${row.name}, ${parseInt(row.time_start) || null}, ${parseInt(row.time_end) || null}, ${row.nodes}, ${materials}, ${row.notes}, ${sources}, 'AX2_ETHNOBOTANY_COMP')
          ON DUPLICATE KEY UPDATE name = VALUES(name), nodes = VALUES(nodes)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur route ${row.route_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} routes importées`);
  }

  // Import du glossaire
  console.log("📖 Import du glossaire...");
  const glossaryPath = path.join(UPLOAD_DIR, "glossary.fr.md");
  if (fs.existsSync(glossaryPath)) {
    const content = fs.readFileSync(glossaryPath, "utf-8");
    const lines = content.split("\n");
    let currentTerm: string | null = null;
    let currentDefinition = "";
    let termCount = 0;

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (currentTerm && currentDefinition) {
          try {
            const termId = `GLOSS_${termCount.toString().padStart(3, "0")}`;
            await db.execute(sql`
              INSERT INTO perfumum_glossary (term_id, term, definition_fr, category)
              VALUES (${termId}, ${currentTerm}, ${currentDefinition.trim()}, 'general')
              ON DUPLICATE KEY UPDATE definition_fr = VALUES(definition_fr)
            `);
            termCount++;
          } catch (e: any) {
            console.error(`  Erreur terme ${currentTerm}:`, e.message);
          }
        }
        currentTerm = line.replace("## ", "").trim();
        currentDefinition = "";
      } else if (currentTerm && line.trim() && !line.startsWith("#") && !line.startsWith("---")) {
        currentDefinition += line + "\n";
      }
    }

    if (currentTerm && currentDefinition) {
      try {
        const termId = `GLOSS_${termCount.toString().padStart(3, "0")}`;
        await db.execute(sql`
          INSERT INTO perfumum_glossary (term_id, term, definition_fr, category)
          VALUES (${termId}, ${currentTerm}, ${currentDefinition.trim()}, 'general')
          ON DUPLICATE KEY UPDATE definition_fr = VALUES(definition_fr)
        `);
        termCount++;
      } catch (e: any) {
        console.error(`  Erreur terme ${currentTerm}:`, e.message);
      }
    }
    console.log(`  ✓ ${termCount} termes importés`);
  }

  // Import des mélanges olfactifs
  console.log("🌸 Import des mélanges olfactifs...");
  const blendsPath = path.join(UPLOAD_DIR, "scent_blends_space_seed.csv");
  if (fs.existsSync(blendsPath)) {
    const blendsData = parseCSV(fs.readFileSync(blendsPath, "utf-8"));
    let imported = 0;
    for (const row of blendsData) {
      try {
        const materials = JSON.stringify((row.materials || "").split(";").filter((m) => m));

        await db.execute(sql`
          INSERT INTO scent_blends (blend_id, climate_axis, intended_medium, concept, materials, safety_notes)
          VALUES (${row.blend_id}, ${row.climate_axis}, ${row.intended_medium}, ${row.concept}, ${materials}, ${row.safety_notes})
          ON DUPLICATE KEY UPDATE concept = VALUES(concept), materials = VALUES(materials)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur mélange ${row.blend_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} mélanges importés`);
  }

  // Import de la matrice climatique
  console.log("🌡️ Import de la matrice climatique...");
  const matrixPath = path.join(UPLOAD_DIR, "climate_axis_medium_matrix.csv");
  if (fs.existsSync(matrixPath)) {
    const matrixData = parseCSV(fs.readFileSync(matrixPath, "utf-8"));
    let imported = 0;
    for (const row of matrixData) {
      try {
        await db.execute(sql`
          INSERT INTO climate_axis_matrix (climate_axis, medium, target_diffusion, target_persistence, volatility_bias, carrier_or_support, safety_notes)
          VALUES (${row.climate_axis}, ${row.medium}, ${row.target_diffusion || "medium"}, ${row.target_persistence || "medium"}, ${row.volatility_bias || "heart"}, ${row.carrier_or_support}, ${row.safety_notes})
        `);
        imported++;
      } catch (e: any) {
        if (!e.message.includes("Duplicate")) {
          console.error(`  Erreur matrice ${row.climate_axis}/${row.medium}:`, e.message);
        }
      }
    }
    console.log(`  ✓ ${imported} entrées de matrice importées`);
  }

  // Import des métriques d'impact
  console.log("📈 Import des métriques d'impact...");
  const metricsPath = path.join(UPLOAD_DIR, "impact_metrics_seed.csv");
  if (fs.existsSync(metricsPath)) {
    const metricsData = parseCSV(fs.readFileSync(metricsPath, "utf-8"));
    let imported = 0;
    for (const row of metricsData) {
      try {
        await db.execute(sql`
          INSERT INTO impact_metrics (year, genomes_sequenced_target, chemical_profiles_target, documents_digitized_target, citizen_contributors_target, partners_target, notes)
          VALUES (${parseInt(row.year)}, ${parseInt(row.genomes_sequenced_target) || 0}, ${parseInt(row.chemical_profiles_target) || 0}, ${parseInt(row.documents_digitized_target) || 0}, ${parseInt(row.citizen_contributors_target) || 0}, ${parseInt(row.partners_target) || 0}, ${row.notes})
          ON DUPLICATE KEY UPDATE genomes_sequenced_target = VALUES(genomes_sequenced_target)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur métrique ${row.year}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} métriques importées`);
  }

  // Import des observations citoyennes
  console.log("👥 Import des observations citoyennes...");
  const obsPath = path.join(UPLOAD_DIR, "citizen_observations_seed.csv");
  if (fs.existsSync(obsPath)) {
    const obsData = parseCSV(fs.readFileSync(obsPath, "utf-8"));
    let imported = 0;
    for (const row of obsData) {
      try {
        const statusMap: Record<string, string> = {
          submitted: "submitted",
          needs_more_info: "pending_review",
          verified: "verified",
        };
        const status = statusMap[row.status] || "submitted";

        await db.execute(sql`
          INSERT INTO citizen_observations (obs_id, user_handle, plant_guess, lat, lon, obs_date, photo_url, confidence_ai, status, notes, axis_id)
          VALUES (${row.obs_id}, ${row.user_handle}, ${row.plant_guess}, ${parseFloat(row.lat) || null}, ${parseFloat(row.lon) || null}, ${row.date || null}, ${row.photo_url || null}, ${parseFloat(row.confidence_ai) || null}, ${status}, ${row.notes}, 'AX5_IMMERSIVE_DEMOCRAT')
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur observation ${row.obs_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} observations importées`);
  }

  // Import des échantillons d'herbier
  console.log("🌿 Import des échantillons d'herbier...");
  const herbariumPath = path.join(UPLOAD_DIR, "herbarium_samples_seed.csv");
  if (fs.existsSync(herbariumPath)) {
    const herbariumData = parseCSV(fs.readFileSync(herbariumPath, "utf-8"));
    let imported = 0;
    for (const row of herbariumData) {
      try {
        const typeMap: Record<string, string> = {
          pressed_leaf: "pressed_leaf",
          seed: "seed",
          resin: "bark",
        };
        const sampleType = typeMap[row.sample_type] || "pressed_leaf";

        await db.execute(sql`
          INSERT INTO perfumum_herbarium_samples (herbarium_id, plant_latin_name, year, collection, repository, sample_type, allowed_sampling, notes, axis_id)
          VALUES (${row.herbarium_id}, ${row.plant_latin_name}, ${parseInt(row.year) || null}, ${row.collection}, ${row.repository || null}, ${sampleType}, ${row.allowed_sampling === "True" ? 1 : 0}, ${row.notes}, 'AX3_ANALYTICAL_TRANS_EPOCH')
          ON DUPLICATE KEY UPDATE year = VALUES(year)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur herbier ${row.herbarium_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} échantillons d'herbier importés`);
  }

  // Import des lignes de culture tissulaire
  console.log("🧬 Import des lignes de culture tissulaire...");
  const tissuePath = path.join(UPLOAD_DIR, "tissue_culture_lines_seed.csv");
  if (fs.existsSync(tissuePath)) {
    const tissueData = parseCSV(fs.readFileSync(tissuePath, "utf-8"));
    let imported = 0;
    for (const row of tissueData) {
      try {
        const methodMap: Record<string, string> = {
          callus: "callus",
          meristem: "meristem",
        };
        const method = methodMap[row.method] || "meristem";

        const statusMap: Record<string, string> = {
          active: "active",
          cryobanked: "cryopreserved",
        };
        const status = statusMap[row.status] || "active";

        const storageMap: Record<string, string> = {
          in_vitro: "in_vitro",
          LN2: "LN2",
          "-80C": "-80C",
        };
        const storage = storageMap[row.storage] || "in_vitro";

        await db.execute(sql`
          INSERT INTO tissue_culture_lines (line_id, plant_latin_name, origin, method, status, storage, notes, axis_id)
          VALUES (${row.line_id}, ${row.plant_latin_name}, ${row.origin}, ${method}, ${status}, ${storage}, ${row.notes}, 'AX4_CONSERVATION_BIOTECH')
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `);
        imported++;
      } catch (e: any) {
        console.error(`  Erreur ligne ${row.line_id}:`, e.message);
      }
    }
    console.log(`  ✓ ${imported} lignes de culture importées`);
  }

  console.log("\n✅ Import du corpus PERFUMUM terminé avec succès!");

  await connection.end();
}

seedData().catch(console.error);
