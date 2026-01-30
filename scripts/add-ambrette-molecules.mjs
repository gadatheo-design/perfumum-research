/**
 * Script pour ajouter les molécules Farnesol et Geraniol
 * pour compléter les liaisons de la fiche Ambrette
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const moleculesToAdd = [
  {
    name: "Farnesol",
    iupacName: "(2E,6E)-3,7,11-triméthyldodéca-2,6,10-trién-1-ol",
    casNumber: "4602-84-0",
    chemicalClass: "sesquiterpene",
    chemicalFormula: "C15H26O",
    family: "Sesquiterpène alcool",
    olfactiveProfile: "Floral doux, tilleul, muguet, légèrement vert et boisé",
    emotionalResonance: "Douceur, sérénité, délicatesse naturelle",
    functionalEffect: "Note de cœur florale, fixateur naturel",
    sourceOrigin: "Huile essentielle de néroli, ylang-ylang, rose, ambrette, camomille",
    notes: "Présent naturellement dans l'huile de graines d'ambrette. Propriétés antibactériennes reconnues. Utilisé comme fixateur et modificateur floral.",
    molecularWeight: 222,
    boilingPoint: 283,
    radarIntensity: 40,
    radarFreshness: 35,
    radarWarmth: 45,
    radarSweetness: 60,
    radarSpiciness: 30,
    radarEarthiness: 40,
    botanicalSources: "Ambrette (Abelmoschus moschatus), Néroli, Ylang-ylang, Rose, Camomille romaine",
    extractionMethod: "Distillation à la vapeur, extraction CO₂",
    therapeuticProperties: "Antibactérien, anti-inflammatoire, apaisant cutané"
  },
  {
    name: "Geraniol",
    iupacName: "(2E)-3,7-diméthylocta-2,6-dién-1-ol",
    casNumber: "106-24-1",
    chemicalClass: "monoterpene",
    chemicalFormula: "C10H18O",
    family: "Monoterpène alcool",
    olfactiveProfile: "Rose, géranium, citronné, floral frais avec nuance citronnée",
    emotionalResonance: "Fraîcheur florale, optimisme, légèreté printanière",
    functionalEffect: "Note de cœur florale, modificateur rosé",
    sourceOrigin: "Huile essentielle de palmarosa, géranium, citronnelle, rose",
    notes: "Composant majeur de nombreuses huiles essentielles florales. Présent dans l'ambrette. Utilisé comme répulsif naturel d'insectes.",
    molecularWeight: 154,
    boilingPoint: 230,
    radarIntensity: 55,
    radarFreshness: 50,
    radarWarmth: 35,
    radarSweetness: 65,
    radarSpiciness: 25,
    radarEarthiness: 30,
    botanicalSources: "Palmarosa, Géranium rosat, Citronnelle, Rose, Ambrette",
    extractionMethod: "Distillation à la vapeur",
    therapeuticProperties: "Antibactérien, antifongique, répulsif insectes, tonique cutané"
  }
];

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('DATABASE_URL non définie');
    process.exit(1);
  }
  
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log('Connexion à la base de données établie');

  // Vérifier si les molécules existent déjà
  const [existingMolecules] = await connection.execute(
    "SELECT name FROM molecules WHERE name IN ('Farnesol', 'Geraniol', 'Géraniol')"
  );

  console.log('Molécules existantes:', existingMolecules);

  for (const molecule of moleculesToAdd) {
    // Vérifier si la molécule existe déjà
    const [existing] = await connection.execute(
      "SELECT id, name FROM molecules WHERE name = ? OR cas_number = ?",
      [molecule.name, molecule.casNumber]
    );

    if (existing.length > 0) {
      console.log(`⚠️  ${molecule.name} existe déjà (ID: ${existing[0].id})`);
      continue;
    }

    // Insérer la nouvelle molécule
    const [result] = await connection.execute(
      `INSERT INTO molecules (
        name, iupac_name, cas_number, chemical_class, chemicalFormula, family,
        olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes,
        molecularWeight, boilingPoint, radar_intensity, radar_freshness, radar_warmth,
        radar_sweetness, radar_spiciness, radar_earthiness, botanicalSources,
        extractionMethod, therapeuticProperties
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        molecule.name,
        molecule.iupacName,
        molecule.casNumber,
        molecule.chemicalClass,
        molecule.chemicalFormula,
        molecule.family,
        molecule.olfactiveProfile,
        molecule.emotionalResonance,
        molecule.functionalEffect,
        molecule.sourceOrigin,
        molecule.notes,
        molecule.molecularWeight,
        molecule.boilingPoint,
        molecule.radarIntensity,
        molecule.radarFreshness,
        molecule.radarWarmth,
        molecule.radarSweetness,
        molecule.radarSpiciness,
        molecule.radarEarthiness,
        molecule.botanicalSources,
        molecule.extractionMethod,
        molecule.therapeuticProperties
      ]
    );

    console.log(`✅ ${molecule.name} ajouté avec succès (ID: ${result.insertId})`);
  }

  await connection.end();
  console.log('\nScript terminé');
}

main().catch(console.error);
