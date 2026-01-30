import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la connexion à la base de données
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL n'est pas définie dans les variables d'environnement");
  process.exit(1);
}

async function importMoleculesClassiques() {
  console.log("🚀 Début de l'import des molécules classiques...\n");

  // Connexion à la base de données
  const connection = await mysql.createConnection(DATABASE_URL);

  // Lecture du fichier CSV
  const csvPath = path.join(__dirname, "MOLECULES_CLASSIQUES_MANQUANTES.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim());

  // Extraire les en-têtes
  const headers = lines[0].split(",");
  console.log(`📋 Colonnes détectées : ${headers.length}`);
  console.log(`📊 Nombre de molécules à importer : ${lines.length - 1}\n`);

  let imported = 0;
  let errors = 0;

  // Traiter chaque ligne (sauf l'en-tête)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    try {
      // Parser la ligne CSV (gestion des virgules dans les guillemets)
      const values = [];
      let currentValue = "";
      let insideQuotes = false;

      for (let char of line) {
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      // Créer l'objet molécule
      const molecule = {
        name: values[0] || "",
        family: values[1] || null,
        chemicalFormula: values[2] || null,
        olfactiveProfile: values[3] || null,
        emotionalResonance: values[4] || null,
        functionalEffect: values[5] || null,
        sourceOrigin: values[6] || null,
        concentration: values[7] || null,
        notes: values[8] || null,
        molecularWeight: values[9] ? parseInt(values[9]) : null,
        boilingPoint: values[10] ? parseInt(values[10]) : null,
        logP: values[11] ? parseInt(values[11]) : null,
        volatility: values[12] ? parseInt(values[12]) : null,
        intensity: values[13] ? parseInt(values[13]) : null,
        complexity: values[14] ? parseInt(values[14]) : null,
        botanicalSources: values[15] || null,
        extractionMethod: values[16] || null,
        therapeuticProperties: values[17] || null,
        radarIntensity: values[18] ? parseInt(values[18]) : 50,
        radarFreshness: values[19] ? parseInt(values[19]) : 50,
        radarWarmth: values[20] ? parseInt(values[20]) : 50,
        radarSweetness: values[21] ? parseInt(values[21]) : 50,
        radarSpiciness: values[22] ? parseInt(values[22]) : 50,
        radarEarthiness: values[23] ? parseInt(values[23]) : 50,
      };

      // Vérifier si la molécule existe déjà
      const existing = await connection.query(
        "SELECT id FROM molecules WHERE name = ?",
        [molecule.name]
      );

      if (existing[0].length > 0) {
        console.log(`⚠️  ${molecule.name} existe déjà, ignorée`);
        continue;
      }

      // Insérer la molécule via SQL brut
      await connection.query(
        `INSERT INTO molecules (
          name, family, chemicalFormula, olfactiveProfile, emotionalResonance,
          functionalEffect, sourceOrigin, concentration, notes, molecularWeight,
          boilingPoint, logP, volatility, intensity, complexity,
          botanicalSources, extractionMethod, therapeuticProperties,
          radar_intensity, radar_freshness, radar_warmth,
          radar_sweetness, radar_spiciness, radar_earthiness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          molecule.name,
          molecule.family,
          molecule.chemicalFormula,
          molecule.olfactiveProfile,
          molecule.emotionalResonance,
          molecule.functionalEffect,
          molecule.sourceOrigin,
          molecule.concentration,
          molecule.notes,
          molecule.molecularWeight,
          molecule.boilingPoint,
          molecule.logP,
          molecule.volatility,
          molecule.intensity,
          molecule.complexity,
          molecule.botanicalSources,
          molecule.extractionMethod,
          molecule.therapeuticProperties,
          molecule.radarIntensity,
          molecule.radarFreshness,
          molecule.radarWarmth,
          molecule.radarSweetness,
          molecule.radarSpiciness,
          molecule.radarEarthiness,
        ]
      );
      imported++;
      console.log(`✅ ${imported}. ${molecule.name} importée`);
    } catch (error) {
      errors++;
      console.error(`❌ Erreur ligne ${i + 1}:`, error.message);
    }
  }

  await connection.end();

  console.log("\n" + "=".repeat(60));
  console.log(`✨ Import terminé !`);
  console.log(`   • Molécules importées : ${imported}`);
  console.log(`   • Erreurs : ${errors}`);
  console.log("=".repeat(60));
}

// Exécution
importMoleculesClassiques().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
