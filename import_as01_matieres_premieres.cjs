#!/usr/bin/env node
/**
 * Import AS-01 — Matières Premières Prioritaires
 * Source : Base Notion "Matières Premières" (collection 45c29fe8)
 * 
 * Ce script importe les matières premières de la base Notion vers :
 * 1. La table `plants` (si la MP est d'origine végétale)
 * 2. La table `molecules` (si c'est un composé isolé)
 * 3. La table `research_entries` (fiche AS-01 avec sourcing et notes)
 * 4. Les liaisons `plant_molecules`
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

// ─── Données récupérées depuis Notion ────────────────────────────────────────
// Collection 45c29fe8 — Matières Premières (Absorbe X)
const MATIERES_PREMIERES = [
  {
    nom: "Patchouli",
    type: "Absolu",
    note: "Fond",
    famille_olfactive: ["Terreux", "Boisé"],
    profil_olfactif: "Terreux-boisé, mousse, camphré. Synergie avec vétiver",
    nom_botanique: "Pogostemon cablin",
    origine: "Indonésie",
    notes_techniques: "Dosage optimal: 0.3-1% (3000-10000 ppm). Patchoulol + α-bulnesène. Persistance élevée",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["Patchoulol", "α-Bulnesène", "Norpatchoulenol"],
    notion_id: "76bf5d4a-4f42-4203-8405-f2d5565d6df7"
  },
  {
    nom: "Palo Santo",
    type: "Huile essentielle",
    note: "Fond",
    famille_olfactive: ["Boisé", "Résineux"],
    profil_olfactif: "Boisé-résineux, mystique, légèrement citronné, encens",
    nom_botanique: "Bursera graveolens",
    origine: "Équateur / Pérou",
    notes_techniques: "Dosage: 0.3-1%. Limonène + α-terpinéol + menthofurane. Boisé sacré sud-américain",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Limonène", "α-Terpinéol", "Menthofurane"],
    notion_id: "5cae3cdc-d020-453c-a6ae-8750729ae7dd"
  },
  {
    nom: "Oud (Agarwood)",
    type: "Huile essentielle",
    note: "Fond",
    famille_olfactive: ["Boisé", "Animal"],
    profil_olfactif: "Bois précieux, animalique, résineux-fumé, médicinal, sacré",
    nom_botanique: "Aquilaria spp.",
    origine: "Asie du Sud-Est",
    notes_techniques: "Dosage: 0.1-0.5%. Bois infecté champignon. Notes animaliques-boisées. Fixateur puissant",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Agarospirol", "Jinkoh-Eudesmol", "α-Guaïène"],
    notion_id: "1a6a641d-e79b-4423-8cff-4d6062a73a8b"
  },
  {
    nom: "Cypriol (Nagarmotha)",
    type: "Huile essentielle",
    note: "Fond",
    famille_olfactive: ["Terreux", "Boisé"],
    profil_olfactif: "Terreux-fumé, vétiver, oud, racine. Profil oriental complexe",
    nom_botanique: "Cyperus scariosus",
    origine: "Inde",
    notes_techniques: "Dosage: 0.2-0.8%. Cyperène + patchoulène. Substitut oud accessible",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Cyperène", "Patchoulène", "Mustakone"],
    notion_id: "c77aad44-f511-42e2-84b1-f0fa915f0aa1"
  },
  {
    nom: "Vétiver",
    type: "Huile essentielle",
    note: "Fond",
    famille_olfactive: ["Terreux", "Boisé"],
    profil_olfactif: "Terreux-fumé, racine, mousse, boisé profond. Fixateur majeur",
    nom_botanique: "Chrysopogon zizanioides",
    origine: "Haïti / Réunion / Java",
    notes_techniques: "Dosage: 0.2-1%. Khusimol + zizaène. Fixateur exceptionnel. Persistance > 48h",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Khusimol", "Zizaène", "Vétivone"],
    notion_id: "d1e7a6ce-834f-4c93-841f-d629d9888103"
  },
  {
    nom: "Jasmin grandiflorum",
    type: "Absolu",
    note: "Cœur",
    famille_olfactive: ["Floral"],
    profil_olfactif: "Floral intense, indolique, fruité, crémeux. Cœur floral noble",
    nom_botanique: "Jasminum grandiflorum",
    origine: "Grasse / Égypte / Inde",
    notes_techniques: "Dosage: 0.1-0.5%. Benzyl acétate + linalol + indole. Absolu coûteux, usage parcimonieux",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Extraction solvant",
    molecules_cles: ["Benzyl acétate", "Linalol", "Indole", "Benzyl benzoate"],
    notion_id: "6cf653c1-173b-429c-9b9b-e6b53a29c0eb"
  },
  {
    nom: "Rose de Damas",
    type: "Absolu",
    note: "Cœur",
    famille_olfactive: ["Floral"],
    profil_olfactif: "Rose classique, miel, épicé, légèrement citronné. Floral emblématique",
    nom_botanique: "Rosa damascena",
    origine: "Bulgarie / Turquie / Maroc",
    notes_techniques: "Dosage: 0.1-0.3%. Géraniol + citronellol + rose oxyde. Absolu très concentré",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Extraction solvant",
    molecules_cles: ["Géraniol", "Citronellol", "Rose oxyde", "Damascénone"],
    notion_id: "2a0580d2-7f03-413c-822b-611ee85c4037"
  },
  {
    nom: "Ylang-ylang",
    type: "Huile essentielle",
    note: "Cœur",
    famille_olfactive: ["Floral", "Épicé"],
    profil_olfactif: "Floral exotique, crémeux, légèrement épicé-bananée. Tropical",
    nom_botanique: "Cananga odorata",
    origine: "Madagascar / Comores / Philippines",
    notes_techniques: "Dosage: 0.1-0.5%. Benzyl acétate + linalol + géraniol. Fractions: extra, I, II, III, complète",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Benzyl acétate", "Linalol", "Géraniol", "Caryophyllène"],
    notion_id: "59c355c5-b701-415d-b927-dcccfdb3ed9f"
  },
  {
    nom: "Santal (Santalum album)",
    type: "Huile essentielle",
    note: "Fond",
    famille_olfactive: ["Boisé"],
    profil_olfactif: "Boisé doux, crémeux, laiteux, légèrement floral. Bois sacré",
    nom_botanique: "Santalum album",
    origine: "Inde (Mysore) / Australie",
    notes_techniques: "Dosage: 0.3-1%. α-Santalol + β-Santalol. Bois de Mysore en voie de disparition",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["α-Santalol", "β-Santalol", "Santalène"],
    notion_id: "96cbf444-3b96-482b-944b-3baf6efc2778"
  },
  {
    nom: "Davana Oil",
    type: "Huile essentielle",
    note: "Cœur",
    famille_olfactive: ["Fruité", "Aromatique"],
    profil_olfactif: "Fruité-rhum, abricot, herbes, légèrement amer. Unique sur peau",
    nom_botanique: "Artemisia pallens",
    origine: "Inde (Karnataka)",
    notes_techniques: "Dosage: 0.1-0.5%. Davanone + linalol + géraniol. Profil unique selon chimie individuelle",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Davanone", "Linalol", "Géraniol"],
    notion_id: "6dd7f8a4-d9f5-44aa-a903-38b4ab63ec35"
  },
  {
    nom: "Cardamome",
    type: "Huile essentielle",
    note: "Tête",
    famille_olfactive: ["Épicé", "Aromatique"],
    profil_olfactif: "Épicé-frais, cardamome, eucalyptus, transformation en épicé-floral",
    nom_botanique: "Elettaria cardamomum",
    origine: "Guatemala / Inde",
    notes_techniques: "Dosage optimal: 0.2-0.6% (2000-6000 ppm). 1,8-cinéole + α-terpinyl acétate + linalol",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["1,8-Cinéole", "α-Terpinyl acétate", "Linalol"],
    notion_id: "a963608b-bcfb-4394-8f89-8597abe46fb8"
  },
  {
    nom: "Bergamote",
    type: "Huile essentielle",
    note: "Tête",
    famille_olfactive: ["Citrus", "Floral"],
    profil_olfactif: "Agrume-floral, fraîcheur élégante, légèrement amer",
    nom_botanique: "Citrus bergamia",
    origine: "Calabre (Italie)",
    notes_techniques: "Dosage: 0.5-2%. Protocoles historiques (bergamote/rose/pin). Notes tête fraîches",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Expression",
    molecules_cles: ["Linalyl acétate", "Linalol", "Limonène"],
    notion_id: "012e3493-5d7f-4a34-8e24-3ad9dc3479cb"
  },
  {
    nom: "Ambergris",
    type: "Teinture",
    note: "Fond",
    famille_olfactive: ["Animal", "Minéral"],
    profil_olfactif: "Animalité douce, salin, chaleur, fixateur puissant",
    nom_botanique: null,
    origine: "Océans (cachalot)",
    notes_techniques: "Fixateur exceptionnel. Ambroxide = équivalent synthétique. Teinture 3-5% dans alcool",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Teinture",
    molecules_cles: ["Ambroxide", "Ambrein"],
    notion_id: "7cc7446f-9d4c-427a-ae6a-156498b736b7"
  },
  {
    nom: "Caryophyllène",
    type: "Isolat",
    note: "Cœur",
    famille_olfactive: ["Épicé", "Boisé"],
    profil_olfactif: "Poivre noir, épicé, boisé. Sesquiterpène majeur cannabis/tabac",
    nom_botanique: null,
    origine: "Synthétique / Cannabis / Clou de girofle",
    notes_techniques: "Dosage: 0.2-0.8%. Anti-inflammatoire puissant. Présent haschisch méditerranéen (Hassan 2023). CAS: 87-44-5",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["β-Caryophyllène"],
    notion_id: "5edd5d4d-7861-4e62-892d-9818d8103637"
  },
  {
    nom: "Aldambre",
    type: "Synthétique",
    note: "Fond",
    famille_olfactive: ["Animal", "Boisé"],
    profil_olfactif: "Aldéhyde ambré, chaleur, ambre synthétique",
    nom_botanique: null,
    origine: "Synthétique",
    notes_techniques: "Ambre synthétique. Fixateur. Prix: 8 CHF/ml",
    statut: "À commander",
    stock_ml: null,
    prix_chf: 8,
    methode_extraction: null,
    molecules_cles: [],
    notion_id: "0a431966-836b-4cef-9da1-9e83731411d6"
  },
  {
    nom: "Isolongifolene",
    type: "Synthétique",
    note: "Fond",
    famille_olfactive: ["Boisé"],
    profil_olfactif: "Dry woody, amber, resinous",
    nom_botanique: null,
    origine: "Synthétique",
    notes_techniques: "Base boisée, fixatif. Sesquiterpène synthétique. IFRA compliant. CAS: 1135-66-6",
    statut: "En stock",
    stock_ml: 5,
    prix_chf: 0.8,
    methode_extraction: null,
    molecules_cles: [],
    notion_id: "ed78e5ca-6b68-4004-ac81-2e1e9e784a18"
  },
  {
    nom: "Stemone™",
    type: "Synthétique",
    note: "Cœur",
    famille_olfactive: ["Boisé", "Aromatique"],
    profil_olfactif: "Boisé-tabac, notes foin-amande, moderne",
    nom_botanique: null,
    origine: "Synthétique (Givaudan)",
    notes_techniques: "Prix: 4 EUR pour 5g. Accord tabac-boisé moderne",
    statut: "À commander",
    stock_ml: 5,
    prix_chf: 0.8,
    methode_extraction: null,
    molecules_cles: [],
    notion_id: "b44cbc53-acc1-4e82-bd04-b19b1dab4b3b"
  },
  {
    nom: "Isobutavan",
    type: "Synthétique",
    note: "Fond",
    famille_olfactive: ["Boisé"],
    profil_olfactif: "Boisé-vanillé, notes ambrées, chaleur",
    nom_botanique: null,
    origine: "Synthétique",
    notes_techniques: "Prix: 5 EUR pour 5g. Boisé-vanillé fixateur",
    statut: "À commander",
    stock_ml: 5,
    prix_chf: 1,
    methode_extraction: null,
    molecules_cles: [],
    notion_id: "73a420d3-085b-4f1b-849e-1f0526da613b"
  },
  // Matières premières de la liste AS-02 (prioritaires absentes)
  {
    nom: "Nerolidol",
    type: "Isolat",
    note: "Fond",
    famille_olfactive: ["Floral", "Boisé"],
    profil_olfactif: "Floral-boisé doux, légèrement fruité, rose-pomme",
    nom_botanique: null,
    origine: "Cannabis / Néroli / Gingembre",
    notes_techniques: "Dosage: 0.5-1.5g/100g. Transversal 6 formules PERFUMUM. CAS: 7212-44-4. Sesquiterpène alcool",
    statut: "À commander",
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["Nerolidol"],
    notion_id: null
  },
  {
    nom: "Bisabolol",
    type: "Isolat",
    note: "Fond",
    famille_olfactive: ["Floral", "Boisé"],
    profil_olfactif: "Floral doux, camomille, légèrement fruité-boisé",
    nom_botanique: null,
    origine: "Camomille / Candeia",
    notes_techniques: "Dosage: 0.5-1g/100g. ACC-01, ACC-04, ACC-06. Anti-inflammatoire. CAS: 515-69-5",
    statut: "À commander",
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["α-Bisabolol"],
    notion_id: null
  },
  {
    nom: "Cedrol",
    type: "Isolat",
    note: "Fond",
    famille_olfactive: ["Boisé", "Terreux"],
    profil_olfactif: "Cèdre, boisé doux, légèrement terreux, fumé",
    nom_botanique: null,
    origine: "Cèdre Atlas / Virginie",
    notes_techniques: "Dosage: 0.5g/100g. ACC-01, ACC-03, ACC-05. Fixateur boisé. CAS: 77-53-2",
    statut: "À commander",
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["Cedrol"],
    notion_id: null
  },
  {
    nom: "Myrcène",
    type: "Isolat",
    note: "Tête",
    famille_olfactive: ["Terreux", "Fruité"],
    profil_olfactif: "Fruité-terreux, mangue verte, cannabis, houblon",
    nom_botanique: null,
    origine: "Cannabis / Houblon / Myrte",
    notes_techniques: "Terpène majeur cannabis. CAS: 123-35-3. Dosage: 0.1-0.5%",
    statut: "À commander",
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["β-Myrcène"],
    notion_id: null
  },
  {
    nom: "Humulène",
    type: "Isolat",
    note: "Cœur",
    famille_olfactive: ["Boisé", "Terreux"],
    profil_olfactif: "Houblon, boisé, terreux, épicé doux",
    nom_botanique: null,
    origine: "Houblon / Cannabis / Sauge",
    notes_techniques: "Sesquiterpène anti-inflammatoire. CAS: 6753-98-6. Présent cannabis et tabac",
    statut: "À commander",
    stock_ml: null,
    prix_chf: null,
    methode_extraction: null,
    molecules_cles: ["α-Humulène"],
    notion_id: null
  },
  {
    nom: "Davana Oil Extra",
    type: "Huile essentielle",
    note: "Cœur",
    famille_olfactive: ["Fruité", "Aromatique"],
    profil_olfactif: "Fruité-rhum concentré, abricot, herbes aromatiques",
    nom_botanique: "Artemisia pallens",
    origine: "Inde",
    notes_techniques: "Grade Extra. Davanone > 30%. Profil plus concentré que standard",
    statut: null,
    stock_ml: null,
    prix_chf: null,
    methode_extraction: "Distillation",
    molecules_cles: ["Davanone", "Linalol"],
    notion_id: "cf8a3ffe-add8-427f-b6f8-6ced824b7703"
  },
];

// ─── Connexion DB ─────────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function findOrCreatePlant(conn, mp) {
  if (!mp.nom_botanique) return null;
  
  // Chercher par nom botanique
  const [rows] = await conn.execute(
    'SELECT id FROM plants WHERE latin_name = ? OR name = ? LIMIT 1',
    [mp.nom_botanique, mp.nom]
  );
  if (rows.length > 0) return rows[0].id;
  
  // Créer la plante
  const [result] = await conn.execute(
    `INSERT INTO plants (name, latin_name, family, origin, olfactive_signature, category, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      mp.nom,
      mp.nom_botanique,
      null,
      mp.origine || null,
      mp.profil_olfactif,
      'aromatique',
      `Source: AS-01 Matières Premières Prioritaires PERFUMUM. ${mp.notes_techniques || ''}`
    ]
  );
  console.log(`  → Plante créée: ${mp.nom} (${mp.nom_botanique})`);
  return result.insertId;
}

async function findMolecule(conn, name) {
  const [rows] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? OR iupac_name = ? LIMIT 1',
    [name, name]
  );
  return rows.length > 0 ? rows[0].id : null;
}

async function findOrCreatePlantByBotanical(conn, latinName) {
  if (!latinName) return null;
  const [rows] = await conn.execute(
    'SELECT id FROM plants WHERE latin_name = ? LIMIT 1',
    [latinName]
  );
  return rows.length > 0 ? rows[0].id : null;
}

async function createResearchEntry(conn, mp, plantId) {
  // Vérifier si une entrée existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM research_entries WHERE title = ? LIMIT 1',
    [`AS-01 — ${mp.nom}`]
  );
  if (existing.length > 0) {
    console.log(`  → Research entry existante: AS-01 — ${mp.nom}`);
    return existing[0].id;
  }
  
  const content = `## Matière Première : ${mp.nom}

**Type** : ${mp.type}
**Note olfactive** : ${mp.note}
**Famille(s) olfactive(s)** : ${mp.famille_olfactive.join(', ')}
**Profil olfactif** : ${mp.profil_olfactif}
${mp.nom_botanique ? `**Nom botanique** : ${mp.nom_botanique}` : ''}
${mp.origine ? `**Origine** : ${mp.origine}` : ''}
${mp.methode_extraction ? `**Méthode d'extraction** : ${mp.methode_extraction}` : ''}

### Notes techniques
${mp.notes_techniques || 'Données en cours de collecte.'}

${mp.statut ? `**Statut stock** : ${mp.statut}` : ''}
${mp.stock_ml ? `**Stock** : ${mp.stock_ml} ml` : ''}
${mp.prix_chf ? `**Prix** : ${mp.prix_chf} CHF/ml` : ''}

### Molécules clés
${mp.molecules_cles.length > 0 ? mp.molecules_cles.map(m => `- ${m}`).join('\n') : 'À documenter'}

### Contexte PERFUMUM
Matière première documentée dans le cadre du projet AS-01 (Schéma MongoDB + PubChem) et AS-02 (Matériaux Prioritaires). 
${mp.notion_id ? `Référence Notion : ${mp.notion_id}` : 'Matière prioritaire identifiée dans AS-02.'}`;

  // Générer un slug et entry_code uniques
  const slugBase = `as01-${mp.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const slug = `${slugBase}-${Date.now()}`;
  const entryCode = `AS01-MP-${mp.nom.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 20)}-${Date.now().toString().slice(-6)}`;
  
  // Utiliser l'axe 'Biotechnologie et Parfumerie Durable' (AX2) pour les matières premières
  const axisId = 2;
  
  const [result] = await conn.execute(
    `INSERT INTO research_entries (entry_code, title, slug, content, entry_type, status, primary_axis_id, linked_plant_ids, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      entryCode,
      `AS-01 — ${mp.nom}`,
      slug,
      content,
      'note',
      'completed',
      axisId,
      plantId ? JSON.stringify([plantId]) : null
    ]
  );
  return result.insertId;
}

// ─── Import principal ─────────────────────────────────────────────────────────
async function importAS01() {
  const conn = await getConnection();
  
  console.log('=== Import AS-01 Matières Premières Prioritaires ===\n');
  
  let plantsCreated = 0;
  let entriesCreated = 0;
  let linksCreated = 0;
  let errors = 0;
  
  for (const mp of MATIERES_PREMIERES) {
    console.log(`\nTraitement: ${mp.nom}`);
    
    try {
      // 1. Créer/trouver la plante si origine végétale
      let plantId = null;
      if (mp.nom_botanique) {
        plantId = await findOrCreatePlant(conn, mp);
        if (plantId) plantsCreated++;
      }
      
      // 2. Créer la research_entry
      const entryId = await createResearchEntry(conn, mp, plantId);
      if (entryId) entriesCreated++;
      
      // 3. Créer les liaisons plante-molécule pour les molécules clés
      if (plantId && mp.molecules_cles.length > 0) {
        for (const molName of mp.molecules_cles) {
          const molId = await findMolecule(conn, molName);
          if (molId) {
            // Vérifier si le lien existe déjà
            const [existing] = await conn.execute(
              'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
              [plantId, molId]
            );
            if (existing.length === 0) {
              await conn.execute(
                `INSERT INTO plant_molecules (plant_id, molecule_id, source, notes)
                 VALUES (?, ?, ?, ?)`,
                [plantId, molId, 'literature', `Molécule clé de ${mp.nom} — Source AS-01 PERFUMUM`]
              );
              linksCreated++;
              console.log(`  → Lien créé: ${mp.nom} ↔ ${molName}`);
            }
          }
        }
      }
      
    } catch (err) {
      console.error(`  ✗ Erreur pour ${mp.nom}:`, err.message);
      errors++;
    }
  }
  
  await conn.end();
  
  console.log('\n=== Résumé Import AS-01 ===');
  console.log(`Plantes créées/trouvées : ${plantsCreated}`);
  console.log(`Research entries créées : ${entriesCreated}`);
  console.log(`Liaisons plante-molécule : ${linksCreated}`);
  console.log(`Erreurs : ${errors}`);
  console.log(`Total matières premières traitées : ${MATIERES_PREMIERES.length}`);
}

importAS01().catch(console.error);
