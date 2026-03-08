#!/usr/bin/env node
/**
 * Import AS-01 — Molécules clés des Matières Premières Prioritaires
 * Crée les molécules manquantes référencées dans les fiches AS-01
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

// Molécules clés des matières premières AS-01 à créer si absentes
const MOLECULES_AS01 = [
  // Patchouli
  {
    name: "Patchoulol",
    iupac_name: "Patchoulol",
    cas_number: "5986-55-0",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["terreux", "boisé", "mousse", "camphré"]),
    notes: "Composé majoritaire de l'huile de patchouli (25-35%). Responsable du profil terreux-boisé caractéristique.",
    botanicalSources: JSON.stringify(["Pogostemon cablin"]),
    status: "validated"
  },
  {
    name: "α-Bulnesène",
    iupac_name: "α-Bulnesene",
    cas_number: "3691-12-1",
    chemical_class: "sesquiterpene",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["boisé", "terreux"]),
    notes: "Sesquiterpène du patchouli. Contribue au profil boisé.",
    botanicalSources: JSON.stringify(["Pogostemon cablin"]),
    status: "validated"
  },
  // Palo Santo
  {
    name: "Menthofurane",
    iupac_name: "Menthofuran",
    cas_number: "494-90-6",
    chemical_class: "monoterpene",
    family: "Monoterpènes",
    olfactiveProfile: JSON.stringify(["boisé", "légèrement mentholé", "résineux"]),
    notes: "Composé du Palo Santo (Bursera graveolens). Contribue au profil boisé-résineux.",
    botanicalSources: JSON.stringify(["Bursera graveolens", "Mentha pulegium"]),
    status: "validated"
  },
  // Oud
  {
    name: "Agarospirol",
    iupac_name: "Agarospirol",
    cas_number: "19431-84-6",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["boisé précieux", "animalique", "résineux"]),
    notes: "Composé majeur de l'huile d'oud (Aquilaria spp.). Responsable du profil boisé-animalique caractéristique.",
    botanicalSources: JSON.stringify(["Aquilaria malaccensis", "Aquilaria sinensis"]),
    status: "validated"
  },
  {
    name: "Jinkoh-Eudesmol",
    iupac_name: "Jinkoh-Eudesmol",
    cas_number: null,
    chemical_class: "sesquiterpene",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["boisé", "médicinal", "sacré"]),
    notes: "Sesquiterpène alcool de l'oud. Composé caractéristique du bois d'agar.",
    botanicalSources: JSON.stringify(["Aquilaria spp."]),
    status: "validated"
  },
  // Cypriol
  {
    name: "Cyperène",
    iupac_name: "Cyperene",
    cas_number: "2387-78-2",
    chemical_class: "sesquiterpene",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["terreux", "fumé", "vétiver"]),
    notes: "Sesquiterpène majeur du cypriol (Cyperus scariosus). Profil terreux-fumé oriental.",
    botanicalSources: JSON.stringify(["Cyperus scariosus", "Cyperus rotundus"]),
    status: "validated"
  },
  {
    name: "Mustakone",
    iupac_name: "Mustakone",
    cas_number: "4674-50-4",
    chemical_class: "sesquiterpene_ketone",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["terreux", "épicé", "oud"]),
    notes: "Cétone sesquiterpénique du cypriol. Contribue au profil oriental complexe.",
    botanicalSources: JSON.stringify(["Cyperus scariosus"]),
    status: "validated"
  },
  // Vétiver
  {
    name: "Khusimol",
    iupac_name: "Khusimol",
    cas_number: "19870-74-7",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["terreux", "fumé", "racine", "boisé profond"]),
    notes: "Alcool sesquiterpénique majeur du vétiver (Chrysopogon zizanioides). Fixateur exceptionnel.",
    botanicalSources: JSON.stringify(["Chrysopogon zizanioides"]),
    status: "validated"
  },
  {
    name: "Vétivone",
    iupac_name: "Vetivone",
    cas_number: "17283-81-7",
    chemical_class: "sesquiterpene_ketone",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["terreux", "boisé", "légèrement floral"]),
    notes: "Cétone sesquiterpénique du vétiver. Contribue à la complexité olfactive.",
    botanicalSources: JSON.stringify(["Chrysopogon zizanioides"]),
    status: "validated"
  },
  // Jasmin
  {
    name: "Benzyl acétate",
    iupac_name: "Benzyl acetate",
    cas_number: "140-11-4",
    chemical_class: "ester",
    family: "Esters",
    olfactiveProfile: JSON.stringify(["floral", "jasmin", "fruité", "doux"]),
    notes: "Ester aromatique majeur du jasmin grandiflorum. Composé floral emblématique.",
    botanicalSources: JSON.stringify(["Jasminum grandiflorum", "Jasminum sambac", "Cananga odorata"]),
    status: "validated"
  },
  {
    name: "Benzyl benzoate",
    iupac_name: "Benzyl benzoate",
    cas_number: "120-51-4",
    chemical_class: "ester",
    family: "Esters",
    olfactiveProfile: JSON.stringify(["floral", "doux", "légèrement balsamic"]),
    notes: "Ester du jasmin et de la rose. Fixateur et modificateur floral.",
    botanicalSources: JSON.stringify(["Jasminum grandiflorum", "Rosa damascena"]),
    status: "validated"
  },
  // Rose
  {
    name: "Citronellol",
    iupac_name: "Citronellol",
    cas_number: "106-22-9",
    chemical_class: "monoterpene_alcohol",
    family: "Monoterpènes",
    olfactiveProfile: JSON.stringify(["rose", "floral", "légèrement citronné"]),
    notes: "Alcool monoterpénique majeur de la rose de Damas. Profil rose classique.",
    botanicalSources: JSON.stringify(["Rosa damascena", "Cymbopogon nardus"]),
    status: "validated"
  },
  {
    name: "Rose oxyde",
    iupac_name: "Rose oxide",
    cas_number: "16409-43-1",
    chemical_class: "terpenoid_oxide",
    family: "Oxydes terpéniques",
    olfactiveProfile: JSON.stringify(["rose", "floral intense", "légèrement métallique"]),
    notes: "Oxyde terpénique de la rose. Composé à très faible seuil de détection, très impactant.",
    botanicalSources: JSON.stringify(["Rosa damascena"]),
    status: "validated"
  },
  {
    name: "Damascénone",
    iupac_name: "β-Damascenone",
    cas_number: "23726-91-2",
    chemical_class: "norisoprenoid_ketone",
    family: "Norisoprénoïdes",
    olfactiveProfile: JSON.stringify(["rose", "fruité", "miel", "tabac"]),
    notes: "Norisoprénoïde de la rose. Seuil de détection extrêmement bas. Présent aussi dans le tabac et le vin.",
    botanicalSources: JSON.stringify(["Rosa damascena", "Nicotiana tabacum"]),
    status: "validated"
  },
  // Santal
  {
    name: "α-Santalol",
    iupac_name: "α-Santalol",
    cas_number: "115-71-9",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["boisé doux", "crémeux", "laiteux", "sandalwood"]),
    notes: "Alcool sesquiterpénique majeur du santal (Santalum album). Composé boisé emblématique.",
    botanicalSources: JSON.stringify(["Santalum album", "Santalum spicatum"]),
    status: "validated"
  },
  {
    name: "β-Santalol",
    iupac_name: "β-Santalol",
    cas_number: "77-42-9",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["boisé", "légèrement floral", "sandalwood"]),
    notes: "Isomère du α-santalol. Contribue au profil boisé-crémeux du santal.",
    botanicalSources: JSON.stringify(["Santalum album"]),
    status: "validated"
  },
  // Davana
  {
    name: "Davanone",
    iupac_name: "Davanone",
    cas_number: "18492-37-0",
    chemical_class: "sesquiterpene_ketone",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["fruité", "rhum", "abricot", "herbes"]),
    notes: "Cétone sesquiterpénique majeure de la davana (Artemisia pallens). Profil unique fruité-rhum.",
    botanicalSources: JSON.stringify(["Artemisia pallens"]),
    status: "validated"
  },
  // Cardamome
  {
    name: "1,8-Cinéole",
    iupac_name: "1,8-Cineole",
    cas_number: "470-82-6",
    chemical_class: "monoterpene_oxide",
    family: "Oxydes terpéniques",
    olfactiveProfile: JSON.stringify(["eucalyptus", "frais", "camphré", "mentholé"]),
    notes: "Oxyde monoterpénique majeur de la cardamome et de l'eucalyptus. Composé frais-camphré.",
    botanicalSources: JSON.stringify(["Elettaria cardamomum", "Eucalyptus globulus", "Rosmarinus officinalis"]),
    status: "validated"
  },
  {
    name: "α-Terpinyl acétate",
    iupac_name: "α-Terpinyl acetate",
    cas_number: "80-26-2",
    chemical_class: "monoterpene_ester",
    family: "Esters",
    olfactiveProfile: JSON.stringify(["épicé", "fruité", "cardamome", "bergamote"]),
    notes: "Ester monoterpénique de la cardamome. Responsable du profil épicé-fruité caractéristique.",
    botanicalSources: JSON.stringify(["Elettaria cardamomum"]),
    status: "validated"
  },
  // Bergamote
  {
    name: "Linalyl acétate",
    iupac_name: "Linalyl acetate",
    cas_number: "115-95-7",
    chemical_class: "monoterpene_ester",
    family: "Esters",
    olfactiveProfile: JSON.stringify(["floral", "fruité", "lavande", "bergamote"]),
    notes: "Ester monoterpénique majeur de la bergamote et de la lavande. Profil floral-fruité élégant.",
    botanicalSources: JSON.stringify(["Citrus bergamia", "Lavandula angustifolia"]),
    status: "validated"
  },
  // Ambergris
  {
    name: "Ambroxide",
    iupac_name: "Ambroxide",
    cas_number: "6790-58-5",
    chemical_class: "terpenoid_oxide",
    family: "Oxydes terpéniques",
    olfactiveProfile: JSON.stringify(["ambré", "salin", "animalique doux", "chaleur"]),
    notes: "Oxyde terpénique de l'ambre gris. Équivalent synthétique de l'ambrein. Fixateur puissant.",
    botanicalSources: JSON.stringify([]),
    status: "validated"
  },
  // Synthétiques
  {
    name: "Nerolidol",
    iupac_name: "Nerolidol",
    cas_number: "7212-44-4",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["floral", "boisé doux", "fruité", "rose-pomme"]),
    notes: "Alcool sesquiterpénique transversal à 6 formules PERFUMUM. Présent dans cannabis, néroli, gingembre.",
    botanicalSources: JSON.stringify(["Cannabis sativa", "Citrus aurantium", "Zingiber officinale"]),
    status: "validated"
  },
  {
    name: "α-Bisabolol",
    iupac_name: "α-Bisabolol",
    cas_number: "515-69-5",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["floral doux", "camomille", "fruité-boisé"]),
    notes: "Alcool sesquiterpénique anti-inflammatoire. Présent dans camomille et candeia. Utilisé dans ACC-01, ACC-04, ACC-06.",
    botanicalSources: JSON.stringify(["Matricaria chamomilla", "Eremanthus erythropappus"]),
    status: "validated"
  },
  {
    name: "Cedrol",
    iupac_name: "Cedrol",
    cas_number: "77-53-2",
    chemical_class: "sesquiterpene_alcohol",
    family: "Sesquiterpènes",
    olfactiveProfile: JSON.stringify(["cèdre", "boisé doux", "légèrement terreux", "fumé"]),
    notes: "Alcool sesquiterpénique du cèdre. Fixateur boisé. Utilisé dans ACC-01, ACC-03, ACC-05.",
    botanicalSources: JSON.stringify(["Cedrus atlantica", "Juniperus virginiana"]),
    status: "validated"
  },
];

async function getConnection() {
  const url = new URL(DB_URL);
  return mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });
}

async function importMolecules() {
  const conn = await getConnection();
  console.log('=== Import Molécules AS-01 ===\n');
  
  let created = 0;
  let existing = 0;
  let errors = 0;
  
  for (const mol of MOLECULES_AS01) {
    try {
      // Vérifier si la molécule existe déjà
      const [rows] = await conn.execute(
        'SELECT id FROM molecules WHERE name = ? OR (cas_number IS NOT NULL AND cas_number = ?) LIMIT 1',
        [mol.name, mol.cas_number || '']
      );
      
      if (rows.length > 0) {
        console.log(`  ↔ Existante: ${mol.name}`);
        existing++;
        continue;
      }
      
      // Créer la molécule
      await conn.execute(
        `INSERT INTO molecules (name, iupac_name, cas_number, chemical_class, family, olfactiveProfile, notes, botanicalSources, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          mol.name,
          mol.iupac_name,
          mol.cas_number || null,
          mol.chemical_class || null,
          mol.family || null,
          mol.olfactiveProfile,
          mol.notes,
          mol.botanicalSources,
          mol.status || 'validated'
        ]
      );
      console.log(`  + Créée: ${mol.name}`);
      created++;
      
    } catch (err) {
      console.error(`  ✗ Erreur ${mol.name}:`, err.message);
      errors++;
    }
  }
  
  await conn.end();
  
  console.log('\n=== Résumé ===');
  console.log(`Molécules créées : ${created}`);
  console.log(`Molécules existantes : ${existing}`);
  console.log(`Erreurs : ${errors}`);
  console.log(`Total traité : ${MOLECULES_AS01.length}`);
}

importMolecules().catch(console.error);
