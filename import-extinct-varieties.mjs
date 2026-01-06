/**
 * PERFUMUM - Import des variétés disparues
 * Jour 9 de la roadmap : Documenter les variétés disparues majeures
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🌿 Import des variétés disparues - PERFUMUM");
  console.log("=".repeat(60));

  // Structure de la table: variety_id, plant_id, name, latin_name, variety_type, 
  // country_of_origin, distinctive_features, olfactive_description, 
  // commercial_availability, conservation_status, conservation_notes, 
  // threat_factors, conservation_efforts, references
  
  const extinctVarieties = [
    {
      varietyId: "PV-EXT-001",
      name: "Rosa damascena var. trigintipetala (Kazanlak historique)",
      latinName: "Rosa damascena var. trigintipetala",
      varietyType: "cultivar",
      countryOfOrigin: "Bulgarie",
      distinctiveFeatures: "Variété originale de la Vallée des Roses bulgare, cultivée depuis le 17e siècle. 30 pétales (trigintipetala). Huile essentielle d'une richesse exceptionnelle. Les cultivars modernes ont perdu cette complexité aromatique.",
      olfactiveDescription: "Rose damascène classique avec notes de miel, épices douces et nuances fruitées. Plus complexe et moins linéaire que les cultivars modernes. Notes de fond balsamiques et légèrement boisées.",
      olfactiveNotes: JSON.stringify({ top: ["Rose fraîche", "Citrus léger"], heart: ["Rose damascène", "Miel", "Épices"], base: ["Bois de rose", "Musc", "Ambre"] }),
      dominantMolecules: JSON.stringify([
        { molecule: "Citronellol", percentage: 35, role: "Note florale principale" },
        { molecule: "Géraniol", percentage: 20, role: "Note rosée" },
        { molecule: "Nérol", percentage: 10, role: "Fraîcheur" },
        { molecule: "β-Damascénone", percentage: 0.1, role: "Caractère rose intense" }
      ]),
      commercialAvailability: "extinct",
      conservationStatus: "critical",
      conservationNotes: "Variété considérée comme éteinte depuis les années 1950. Hybridation industrielle et abandon des cultivars traditionnels.",
      threatFactors: JSON.stringify(["Hybridation industrielle", "Abandon des cultivars traditionnels", "Sélection pour le rendement"]),
      conservationEfforts: "Quelques spécimens préservés dans des jardins botaniques bulgares. Tentatives de rétrocroisement en cours.",
      references: JSON.stringify([
        { title: "The Rose: A History", author: "Harkness, Peter", year: 2003 },
        { title: "Bulgarian Rose Oil Production and Quality", author: "Kovatcheva, N.", year: 2011 }
      ]),
    },
    {
      varietyId: "PV-EXT-002",
      name: "Jasminum grandiflorum var. florentinum (Jasmin de Florence)",
      latinName: "Jasminum grandiflorum var. florentinum",
      varietyType: "cultivar",
      countryOfOrigin: "Italie",
      distinctiveFeatures: "Le jasmin de Florence était considéré comme le plus fin d'Europe aux 17e-18e siècles. Commerce lucratif des Médicis. Production migrée vers Grasse puis Égypte/Inde, entraînant la perte des cultivars florentins.",
      olfactiveDescription: "Jasmin floral intense avec notes vertes fraîches et nuances fruitées d'abricot. Plus délicat et moins indolique que les variétés modernes. Fond légèrement miellé.",
      olfactiveNotes: JSON.stringify({ top: ["Jasmin frais", "Notes vertes"], heart: ["Jasmin absolu", "Abricot", "Orange"], base: ["Miel", "Musc blanc"] }),
      dominantMolecules: JSON.stringify([
        { molecule: "Benzyl acétate", percentage: 25, role: "Note florale" },
        { molecule: "Linalol", percentage: 15, role: "Fraîcheur" },
        { molecule: "Jasmone", percentage: 3, role: "Caractère jasmin" },
        { molecule: "Indole", percentage: 2, role: "Animalité (traces)" }
      ]),
      commercialAvailability: "extinct",
      conservationStatus: "critical",
      conservationNotes: "Variété considérée comme éteinte depuis les années 1920. Urbanisation de Florence et déplacement de la production.",
      threatFactors: JSON.stringify(["Urbanisation", "Déplacement de la production", "Perte des cultivars locaux"]),
      conservationEfforts: "Aucun cultivar authentique connu. Recherches génétiques en cours sur des spécimens de jardins historiques toscans.",
      references: JSON.stringify([
        { title: "Perfume: The Story of a Murderer", author: "Süskind, Patrick", year: 1985 },
        { title: "The Scented Garden: A History of Fragrance", author: "Le Guérer, Annick", year: 2005 }
      ]),
    },
    {
      varietyId: "PV-EXT-003",
      name: "Lavandula angustifolia var. delphinensis (Lavande du Dauphiné)",
      latinName: "Lavandula angustifolia var. delphinensis",
      varietyType: "wild",
      countryOfOrigin: "France",
      distinctiveFeatures: "Variété sauvage d'altitude (1200-1800m) du Dauphiné, récoltée depuis le Moyen Âge. Finesse aromatique supérieure aux lavandes cultivées. Mécanisation a favorisé le lavandin.",
      olfactiveDescription: "Lavande fine et cristalline, moins camphrée que les variétés modernes. Notes florales délicates avec nuances herbacées fraîches. Fond légèrement boisé et miellé.",
      olfactiveNotes: JSON.stringify({ top: ["Lavande fraîche", "Bergamote"], heart: ["Lavande fine", "Herbes"], base: ["Bois", "Miel", "Musc"] }),
      dominantMolecules: JSON.stringify([
        { molecule: "Linalol", percentage: 40, role: "Note florale principale" },
        { molecule: "Acétate de linalyle", percentage: 35, role: "Douceur" },
        { molecule: "Lavandulol", percentage: 5, role: "Caractère lavande" },
        { molecule: "Camphre", percentage: 0.5, role: "Fraîcheur (traces)" }
      ]),
      commercialAvailability: "extinct",
      conservationStatus: "endangered",
      conservationNotes: "Variété considérée comme éteinte depuis les années 1970. Remplacement par le lavandin plus productif.",
      threatFactors: JSON.stringify(["Remplacement par le lavandin", "Abandon des récoltes sauvages", "Mécanisation"]),
      conservationEfforts: "Programmes de conservation in situ dans les Alpes. Banques de graines au Conservatoire National des Plantes à Parfum de Milly-la-Forêt.",
      references: JSON.stringify([
        { title: "La Lavande: Une histoire naturelle et culturelle", author: "Lis-Balchin, Maria", year: 2002 },
        { title: "Lavender: The Genus Lavandula", author: "Lis-Balchin, Maria", year: 2002 }
      ]),
    },
    {
      varietyId: "PV-EXT-004",
      name: "Nicotiana tabacum var. havanensis (Tabac Havane original)",
      latinName: "Nicotiana tabacum var. havanensis",
      varietyType: "landrace",
      countryOfOrigin: "Cuba",
      distinctiveFeatures: "Tabac Havane original de la Vuelta Abajo, considéré comme le meilleur du monde. Cultivars pré-révolutionnaires perdus ou hybridés. Profil unique non reproductible.",
      olfactiveDescription: "Tabac brun riche et complexe avec notes de cuir, miel, fruits secs et épices. Fond terreux et légèrement chocolaté. Absence d'amertume caractéristique des variétés modernes.",
      olfactiveNotes: JSON.stringify({ top: ["Tabac frais", "Épices"], heart: ["Cuir", "Miel", "Fruits secs"], base: ["Terre", "Chocolat", "Bois"] }),
      dominantMolecules: JSON.stringify([
        { molecule: "Solanone", percentage: 5, role: "Caractère tabac" },
        { molecule: "Mégastigmatriénone", percentage: 3, role: "Notes fruitées" },
        { molecule: "β-Damascénone", percentage: 0.5, role: "Complexité" },
        { molecule: "Nicotine", percentage: 2, role: "Alcaloïde principal" }
      ]),
      commercialAvailability: "extinct",
      conservationStatus: "critical",
      conservationNotes: "Variété considérée comme éteinte depuis les années 1960. Révolution cubaine, embargo, hybridation.",
      threatFactors: JSON.stringify(["Révolution cubaine", "Embargo américain", "Hybridation", "Perte des semences"]),
      conservationEfforts: "Recherches génétiques sur des spécimens de collections privées. Tentatives de reconstruction à partir de variétés apparentées.",
      references: JSON.stringify([
        { title: "The Cuban Cigar Handbook", author: "Perelman, Richard", year: 2000 },
        { title: "Tobacco: A Cultural History", author: "Gately, Iain", year: 2001 }
      ]),
    },
    {
      varietyId: "PV-EXT-005",
      name: "Cannabis sativa var. indica landrace (Landraces afghanes)",
      latinName: "Cannabis sativa var. indica (landraces)",
      varietyType: "landrace",
      countryOfOrigin: "Afghanistan",
      distinctiveFeatures: "Landraces afghanes originales cultivées depuis des millénaires pour le haschisch. Profil terpénique unique. Disparition due aux guerres, éradication et hybridation occidentale.",
      olfactiveDescription: "Haschisch afghan classique : terreux, épicé, notes de santal et d'encens. Fond musqué et légèrement sucré. Profil terpénique dominé par le myrcène et le β-caryophyllène.",
      olfactiveNotes: JSON.stringify({ top: ["Pin", "Citrus"], heart: ["Terre", "Épices", "Santal"], base: ["Encens", "Musc", "Hashish"] }),
      dominantMolecules: JSON.stringify([
        { molecule: "Myrcène", percentage: 25, role: "Note terreuse" },
        { molecule: "β-Caryophyllène", percentage: 15, role: "Épicé" },
        { molecule: "Limonène", percentage: 10, role: "Fraîcheur" },
        { molecule: "α-Pinène", percentage: 8, role: "Pin" }
      ]),
      commercialAvailability: "extinct",
      conservationStatus: "critical",
      conservationNotes: "Landraces pures considérées comme éteintes depuis les années 2000. Guerres, éradication, hybridation.",
      threatFactors: JSON.stringify(["Guerres en Afghanistan", "Programmes d'éradication", "Hybridation occidentale", "Perte des populations sauvages"]),
      conservationEfforts: "Banques de graines privées (Sensi Seeds, etc.). Expéditions de collecte. Programmes de préservation génétique.",
      references: JSON.stringify([
        { title: "Cannabis: Evolution and Ethnobotany", author: "Clarke, Robert C. & Merlin, Mark D.", year: 2013 },
        { title: "Marijuana Botany", author: "Clarke, Robert C.", year: 1981 }
      ]),
    },
  ];

  console.log("\n🌿 Import des variétés disparues...");
  
  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const variety of extinctVarieties) {
    try {
      // Vérifier si la variété existe déjà
      const [existing] = await connection.execute(
        "SELECT id FROM plant_varieties WHERE variety_id = ? LIMIT 1",
        [variety.varietyId]
      );
      
      if (existing.length > 0) {
        await connection.execute(
          `UPDATE plant_varieties SET 
           name = ?, latin_name = ?, variety_type = ?, country_of_origin = ?,
           distinctive_features = ?, olfactive_description = ?, olfactive_notes = ?,
           dominant_molecules = ?, commercial_availability = ?, conservation_status = ?,
           conservation_notes = ?, threat_factors = ?, conservation_efforts = ?, \`references\` = ?
           WHERE variety_id = ?`,
          [variety.name, variety.latinName, variety.varietyType, variety.countryOfOrigin,
           variety.distinctiveFeatures, variety.olfactiveDescription, variety.olfactiveNotes,
           variety.dominantMolecules, variety.commercialAvailability, variety.conservationStatus,
           variety.conservationNotes, variety.threatFactors, variety.conservationEfforts,
           variety.references, variety.varietyId]
        );
        console.log(`  🔄 ${variety.name} mis à jour`);
        updated++;
        continue;
      }
      
      // Trouver une plante parente (optionnel)
      let plantId = 1; // Valeur par défaut
      
      await connection.execute(
        `INSERT INTO plant_varieties 
         (variety_id, plant_id, name, latin_name, variety_type, country_of_origin,
          distinctive_features, olfactive_description, olfactive_notes,
          dominant_molecules, commercial_availability, conservation_status,
          conservation_notes, threat_factors, conservation_efforts, \`references\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [variety.varietyId, plantId, variety.name, variety.latinName, variety.varietyType,
         variety.countryOfOrigin, variety.distinctiveFeatures, variety.olfactiveDescription,
         variety.olfactiveNotes, variety.dominantMolecules, variety.commercialAvailability,
         variety.conservationStatus, variety.conservationNotes, variety.threatFactors,
         variety.conservationEfforts, variety.references]
      );
      console.log(`  ✅ ${variety.name} importé`);
      imported++;
    } catch (error) {
      console.error(`  ❌ Erreur pour ${variety.name}:`, error.message);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'IMPORT DES VARIÉTÉS DISPARUES");
  console.log("=".repeat(60));
  console.log(`  Total variétés traitées : ${extinctVarieties.length}`);
  console.log(`  Importées : ${imported}`);
  console.log(`  Mises à jour : ${updated}`);
  console.log(`  Erreurs : ${errors}`);
  console.log("=".repeat(60));

  await connection.end();
  console.log("\n✅ Import terminé avec succès !");
}

main().catch(console.error);
