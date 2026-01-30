/**
 * Script d'import des restrictions IFRA pour les molécules connues
 * Basé sur l'Amendment 49 et 50 de l'IFRA
 */

import mysql from 'mysql2/promise';

// Données des restrictions IFRA (Amendment 49/50)
const ifraRestrictionsData = [
  // Molécules avec restrictions importantes
  {
    moleculeName: "Estragole",
    casNumber: "140-67-0",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    // Limites en % du produit fini
    category1: 0.01,   // Lip products
    category2: 0.05,   // Deodorants
    category3: 0.05,   // Face products
    category4: 0.2,    // Fine fragrance
    category5a: 0.1,   // Body lotion
    category5b: 0.1,   // Face care
    category5c: 0.2,   // Hand care
    category5d: 0.01,  // Baby products
    category6: 0.01,   // Oral products
    category7a: 0.3,   // Rinse-off hair
    category7b: 0.1,   // Leave-on hair
    category8: 0.05,   // Intimate
    category9: 0.5,    // Household with contact
    category10a: 1.0,  // Household no contact
    category10b: 1.0,  // Candles/diffusers
    category11a: 1.0,  // Pet products
    category11b: 2.0,  // Industrial
    reasonForRestriction: "Potentiellement cancérigène (génotoxique). Classé CMR catégorie 2 par l'UE.",
    alternativeSuggestions: "Anéthole, trans-anéthole, basilic à linalol",
    notes: "L'estragole est présent naturellement dans le basilic tropical, l'estragon et le fenouil. Les limites IFRA sont basées sur une évaluation de risque génotoxique."
  },
  {
    moleculeName: "Carvone",
    casNumber: "99-49-0",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.5,
    category2: 1.5,
    category3: 1.5,
    category4: 4.0,
    category5a: 2.5,
    category5b: 2.5,
    category5c: 4.0,
    category5d: 0.5,
    category6: 0.5,
    category7a: 6.0,
    category7b: 2.5,
    category8: 1.5,
    category9: 10.0,
    category10a: 20.0,
    category10b: 20.0,
    category11a: 20.0,
    category11b: 40.0,
    reasonForRestriction: "Sensibilisation cutanée potentielle à haute concentration.",
    alternativeSuggestions: "Menthone, pulégone (avec précautions)",
    notes: "La carvone existe sous deux formes : (R)-carvone (carvi) et (S)-carvone (menthe verte). Les deux isomères ont des profils olfactifs différents."
  },
  {
    moleculeName: "Eugénol",
    casNumber: "97-53-0",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.5,
    category2: 0.5,
    category3: 0.5,
    category4: 0.5,
    category5a: 0.5,
    category5b: 0.5,
    category5c: 0.5,
    category5d: 0.1,
    category6: 0.1,
    category7a: 1.0,
    category7b: 0.5,
    category8: 0.5,
    category9: 2.0,
    category10a: 5.0,
    category10b: 5.0,
    category11a: 5.0,
    category11b: 10.0,
    reasonForRestriction: "Allergène cutané connu. Déclaration obligatoire au-dessus de 0.001% (leave-on) ou 0.01% (rinse-off).",
    alternativeSuggestions: "Isoeugénol (avec précautions), méthyl-eugénol interdit",
    notes: "L'eugénol est un allergène de contact établi. Il doit être déclaré sur les étiquettes cosmétiques dans l'UE."
  },
  {
    moleculeName: "Cinnamaldéhyde",
    casNumber: "104-55-2",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.05,
    category2: 0.05,
    category3: 0.05,
    category4: 0.2,
    category5a: 0.1,
    category5b: 0.1,
    category5c: 0.2,
    category5d: 0.02,
    category6: 0.02,
    category7a: 0.5,
    category7b: 0.1,
    category8: 0.05,
    category9: 1.0,
    category10a: 2.0,
    category10b: 2.0,
    category11a: 2.0,
    category11b: 5.0,
    reasonForRestriction: "Allergène cutané puissant. Sensibilisant de contact établi.",
    alternativeSuggestions: "Cinnamate d'éthyle, cinnamate de benzyle",
    notes: "Le cinnamaldéhyde est l'un des allergènes les plus fréquents en parfumerie. Déclaration obligatoire dans l'UE."
  },
  {
    moleculeName: "Citral",
    casNumber: "5392-40-5",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.6,
    category2: 0.6,
    category3: 0.6,
    category4: 1.4,
    category5a: 0.9,
    category5b: 0.9,
    category5c: 1.4,
    category5d: 0.2,
    category6: 0.2,
    category7a: 3.0,
    category7b: 0.9,
    category8: 0.6,
    category9: 6.0,
    category10a: 12.0,
    category10b: 12.0,
    category11a: 12.0,
    category11b: 25.0,
    reasonForRestriction: "Allergène cutané. Sensibilisant de contact modéré.",
    alternativeSuggestions: "Citronellal, géranial, néral (composants du citral)",
    notes: "Le citral est un mélange de géranial et néral. Présent dans la citronnelle, le lemongrass et la verveine."
  },
  {
    moleculeName: "Coumarine",
    casNumber: "91-64-5",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.1,
    category2: 0.4,
    category3: 0.4,
    category4: 1.6,
    category5a: 0.8,
    category5b: 0.8,
    category5c: 1.6,
    category5d: 0.1,
    category6: 0.1,
    category7a: 3.0,
    category7b: 0.8,
    category8: 0.4,
    category9: 6.0,
    category10a: 12.0,
    category10b: 12.0,
    category11a: 12.0,
    category11b: 25.0,
    reasonForRestriction: "Hépatotoxicité potentielle. Sensibilisant cutané modéré.",
    alternativeSuggestions: "Dihydrocoumarine, tonalide",
    notes: "La coumarine est naturellement présente dans la fève tonka, le mélilot et la cannelle de Ceylan."
  },
  {
    moleculeName: "Linalol",
    casNumber: "78-70-6",
    ifraAmendment: "49th",
    restrictionType: "no_restriction",
    category1: null,
    category2: null,
    category3: null,
    category4: null,
    category5a: null,
    category5b: null,
    category5c: null,
    category5d: null,
    category6: null,
    category7a: null,
    category7b: null,
    category8: null,
    category9: null,
    category10a: null,
    category10b: null,
    category11a: null,
    category11b: null,
    reasonForRestriction: "Allergène de contact potentiel uniquement sous forme oxydée. Déclaration obligatoire.",
    alternativeSuggestions: null,
    notes: "Le linalol frais n'est pas sensibilisant, mais ses produits d'oxydation le sont. Stockage à l'abri de l'air recommandé."
  },
  {
    moleculeName: "Limonène",
    casNumber: "5989-27-5",
    ifraAmendment: "49th",
    restrictionType: "no_restriction",
    category1: null,
    category2: null,
    category3: null,
    category4: null,
    category5a: null,
    category5b: null,
    category5c: null,
    category5d: null,
    category6: null,
    category7a: null,
    category7b: null,
    category8: null,
    category9: null,
    category10a: null,
    category10b: null,
    category11a: null,
    category11b: null,
    reasonForRestriction: "Allergène de contact potentiel uniquement sous forme oxydée. Déclaration obligatoire.",
    alternativeSuggestions: null,
    notes: "Le limonène frais n'est pas sensibilisant, mais ses produits d'oxydation (hydroperoxides) le sont."
  },
  {
    moleculeName: "Géraniol",
    casNumber: "106-24-1",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 3.8,
    category2: 3.8,
    category3: 3.8,
    category4: 9.4,
    category5a: 5.6,
    category5b: 5.6,
    category5c: 9.4,
    category5d: 1.3,
    category6: 1.3,
    category7a: 19.0,
    category7b: 5.6,
    category8: 3.8,
    category9: 38.0,
    category10a: 75.0,
    category10b: 75.0,
    category11a: 75.0,
    category11b: 100.0,
    reasonForRestriction: "Allergène cutané modéré. Déclaration obligatoire dans l'UE.",
    alternativeSuggestions: "Citronellol, rhodinol",
    notes: "Le géraniol est un allergène de contact établi mais relativement bien toléré aux concentrations habituelles."
  },
  {
    moleculeName: "Citronellol",
    casNumber: "106-22-9",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 6.8,
    category2: 6.8,
    category3: 6.8,
    category4: 17.0,
    category5a: 10.0,
    category5b: 10.0,
    category5c: 17.0,
    category5d: 2.3,
    category6: 2.3,
    category7a: 34.0,
    category7b: 10.0,
    category8: 6.8,
    category9: 68.0,
    category10a: 100.0,
    category10b: 100.0,
    category11a: 100.0,
    category11b: 100.0,
    reasonForRestriction: "Allergène cutané faible. Déclaration obligatoire dans l'UE.",
    alternativeSuggestions: null,
    notes: "Le citronellol est un allergène de contact faible, généralement bien toléré."
  },
  {
    moleculeName: "Méthyl-eugénol",
    casNumber: "93-15-2",
    ifraAmendment: "49th",
    restrictionType: "prohibited",
    category1: 0,
    category2: 0,
    category3: 0,
    category4: 0,
    category5a: 0,
    category5b: 0,
    category5c: 0,
    category5d: 0,
    category6: 0,
    category7a: 0,
    category7b: 0,
    category8: 0,
    category9: 0,
    category10a: 0,
    category10b: 0,
    category11a: 0,
    category11b: 0,
    reasonForRestriction: "Cancérigène génotoxique. INTERDIT en parfumerie.",
    alternativeSuggestions: "Eugénol (avec limites), isoeugénol",
    notes: "Le méthyl-eugénol est interdit comme ingrédient intentionnel. Des traces peuvent être tolérées dans les huiles essentielles naturelles."
  },
  {
    moleculeName: "Bergaptène",
    casNumber: "484-20-8",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.0001,
    category2: 0.0001,
    category3: 0.0001,
    category4: 0.0015,
    category5a: 0.0001,
    category5b: 0.0001,
    category5c: 0.0001,
    category5d: 0.0001,
    category6: 0.0001,
    category7a: 0.001,
    category7b: 0.0001,
    category8: 0.0001,
    category9: 0.01,
    category10a: 0.1,
    category10b: 0.1,
    category11a: 0.1,
    category11b: 0.5,
    reasonForRestriction: "Phototoxicité sévère. Peut causer des brûlures cutanées avec exposition solaire.",
    alternativeSuggestions: "Huiles essentielles débergaptènisées (bergamote FCF)",
    notes: "Le bergaptène est une furocoumarine phototoxique. Les agrumes (bergamote, citron) doivent être débergaptènisés pour usage cutané."
  },
  {
    moleculeName: "Thymol",
    casNumber: "89-83-8",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.5,
    category2: 1.5,
    category3: 1.5,
    category4: 4.0,
    category5a: 2.5,
    category5b: 2.5,
    category5c: 4.0,
    category5d: 0.5,
    category6: 0.5,
    category7a: 6.0,
    category7b: 2.5,
    category8: 1.5,
    category9: 10.0,
    category10a: 20.0,
    category10b: 20.0,
    category11a: 20.0,
    category11b: 40.0,
    reasonForRestriction: "Irritant cutané et muqueux. Dermocaustique à haute concentration.",
    alternativeSuggestions: "Carvacrol (avec précautions), terpinène-4-ol",
    notes: "Le thymol est un phénol irritant. Dilution obligatoire pour usage cutané."
  },
  {
    moleculeName: "Carvacrol",
    casNumber: "499-75-2",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.5,
    category2: 1.5,
    category3: 1.5,
    category4: 4.0,
    category5a: 2.5,
    category5b: 2.5,
    category5c: 4.0,
    category5d: 0.5,
    category6: 0.5,
    category7a: 6.0,
    category7b: 2.5,
    category8: 1.5,
    category9: 10.0,
    category10a: 20.0,
    category10b: 20.0,
    category11a: 20.0,
    category11b: 40.0,
    reasonForRestriction: "Irritant cutané et muqueux. Dermocaustique à haute concentration.",
    alternativeSuggestions: "Thymol (avec précautions), terpinène-4-ol",
    notes: "Le carvacrol est un phénol irritant similaire au thymol. Présent dans l'origan et la sarriette."
  },
  {
    moleculeName: "Camphre",
    casNumber: "76-22-2",
    ifraAmendment: "49th",
    restrictionType: "restricted",
    category1: 0.5,
    category2: 2.0,
    category3: 2.0,
    category4: 5.0,
    category5a: 3.0,
    category5b: 3.0,
    category5c: 5.0,
    category5d: 0.2,
    category6: 0.2,
    category7a: 8.0,
    category7b: 3.0,
    category8: 2.0,
    category9: 12.0,
    category10a: 25.0,
    category10b: 25.0,
    category11a: 25.0,
    category11b: 50.0,
    reasonForRestriction: "Neurotoxicité potentielle. Convulsivant à haute dose.",
    alternativeSuggestions: "1,8-Cinéole, bornéol",
    notes: "Le camphre est neurotoxique et convulsivant. Contre-indiqué chez les enfants et épileptiques."
  }
];

async function importIfraRestrictions() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("📋 Import des restrictions IFRA...\n");
  
  let imported = 0;
  let updated = 0;
  
  for (const restriction of ifraRestrictionsData) {
    try {
      // Rechercher l'ID de la molécule
      const [molecules] = await connection.execute(
        'SELECT id FROM molecules WHERE name LIKE ? OR cas_number = ? LIMIT 1',
        [`%${restriction.moleculeName}%`, restriction.casNumber]
      );
      const moleculeId = molecules.length > 0 ? molecules[0].id : null;
      
      // Vérifier si une restriction existe déjà pour cette molécule
      const [existing] = await connection.execute(
        'SELECT id FROM ifra_restrictions WHERE molecule_id = ? OR (molecule_id IS NULL AND reason_for_restriction LIKE ?)',
        [moleculeId, `%${restriction.moleculeName}%`]
      );
      
      if (existing.length > 0) {
        // Mettre à jour la restriction existante
        await connection.execute(
          `UPDATE ifra_restrictions SET
            ifra_amendment = ?,
            category_1 = ?, category_2 = ?, category_3 = ?, category_4 = ?,
            category_5a = ?, category_5b = ?, category_5c = ?, category_5d = ?,
            category_6 = ?, category_7a = ?, category_7b = ?, category_8 = ?,
            category_9 = ?, category_10a = ?, category_10b = ?,
            category_11a = ?, category_11b = ?,
            restriction_type = ?,
            reason_for_restriction = ?,
            alternative_suggestions = ?,
            notes = ?
          WHERE id = ?`,
          [
            restriction.ifraAmendment,
            restriction.category1, restriction.category2, restriction.category3, restriction.category4,
            restriction.category5a, restriction.category5b, restriction.category5c, restriction.category5d,
            restriction.category6, restriction.category7a, restriction.category7b, restriction.category8,
            restriction.category9, restriction.category10a, restriction.category10b,
            restriction.category11a, restriction.category11b,
            restriction.restrictionType,
            restriction.reasonForRestriction,
            restriction.alternativeSuggestions,
            restriction.notes,
            existing[0].id
          ]
        );
        console.log(`🔄 Mis à jour: ${restriction.moleculeName}`);
        updated++;
      } else {
        // Créer une nouvelle restriction
        await connection.execute(
          `INSERT INTO ifra_restrictions (
            molecule_id, ifra_amendment,
            category_1, category_2, category_3, category_4,
            category_5a, category_5b, category_5c, category_5d,
            category_6, category_7a, category_7b, category_8,
            category_9, category_10a, category_10b,
            category_11a, category_11b,
            restriction_type, reason_for_restriction, alternative_suggestions, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            moleculeId,
            restriction.ifraAmendment,
            restriction.category1, restriction.category2, restriction.category3, restriction.category4,
            restriction.category5a, restriction.category5b, restriction.category5c, restriction.category5d,
            restriction.category6, restriction.category7a, restriction.category7b, restriction.category8,
            restriction.category9, restriction.category10a, restriction.category10b,
            restriction.category11a, restriction.category11b,
            restriction.restrictionType,
            restriction.reasonForRestriction,
            restriction.alternativeSuggestions,
            restriction.notes
          ]
        );
        console.log(`✅ Importé: ${restriction.moleculeName} (CAS: ${restriction.casNumber})`);
        imported++;
      }
      
    } catch (error) {
      console.error(`❌ Erreur pour ${restriction.moleculeName}:`, error.message);
    }
  }
  
  await connection.end();
  
  console.log("\n" + "=".repeat(60));
  console.log(`📊 Résumé de l'import IFRA:`);
  console.log(`   - Nouvelles restrictions: ${imported}`);
  console.log(`   - Mises à jour: ${updated}`);
  console.log(`   - Total traités: ${imported + updated}`);
  console.log("=".repeat(60));
}

importIfraRestrictions().catch(console.error);
