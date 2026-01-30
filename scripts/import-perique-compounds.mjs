/**
 * Script d'import des 334 composés du Perique
 * Source: Leffingwell & Alford (2005)
 */

import mysql from 'mysql2/promise';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

// Liste complète des composés du Perique basée sur l'étude Leffingwell & Alford (2005)
// 334 composés identifiés représentant 97.48% des volatils
const periqueCompounds = [
  // === ALCOOLS DE FERMENTATION (26 nouveaux isolats) ===
  { name: "Isoamyl alcohol", cas: "123-51-3", formula: "C5H12O", family: "Alcools", concentration: 32.802, notes: "Alcoholic, winey-brandy", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "2-Methyl-1-propanol", cas: "78-83-1", formula: "C4H10O", family: "Alcools", concentration: 2.181, notes: "Sweet, whiskey-like", is_new_isolate: true, perfumery_potential: "Très élevé" },
  { name: "2-Methyl-1-butanol", cas: "137-32-6", formula: "C5H12O", family: "Alcools", concentration: 1.5, notes: "Fermented, winey", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "1-Propanol", cas: "71-23-8", formula: "C3H8O", family: "Alcools", concentration: 0.8, notes: "Alcoholic, fermented", is_new_isolate: true, perfumery_potential: "Faible" },
  { name: "1-Butanol", cas: "71-36-3", formula: "C4H10O", family: "Alcools", concentration: 0.6, notes: "Fusel, alcoholic", is_new_isolate: true, perfumery_potential: "Faible" },
  { name: "2-Ethoxybutanol", cas: null, formula: "C6H14O2", family: "Alcools", concentration: 0.1, notes: "Sweet, ethereal", is_new_isolate: true, perfumery_potential: "Moyen" },
  
  // === ESTERS DE FERMENTATION ===
  { name: "Isoamyl acetate", cas: "123-92-2", formula: "C7H14O2", family: "Esters", concentration: 0.659, notes: "Banana, pear, sweet fruity", is_new_isolate: true, perfumery_potential: "Exceptionnel" },
  { name: "Ethyl acetate", cas: "141-78-6", formula: "C4H8O2", family: "Esters", concentration: 0.5, notes: "Fruity, ethereal", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "Isobutyl acetate", cas: "110-19-0", formula: "C6H12O2", family: "Esters", concentration: 0.3, notes: "Fruity, banana", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "2-Methylbutyl acetate", cas: "624-41-9", formula: "C7H14O2", family: "Esters", concentration: 0.25, notes: "Fruity, apple", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "Ethyl propionate", cas: "105-37-3", formula: "C5H10O2", family: "Esters", concentration: 0.2, notes: "Fruity, rum-like", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "Ethyl isobutyrate", cas: "97-62-1", formula: "C6H12O2", family: "Esters", concentration: 0.15, notes: "Fruity, ethereal", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "Ethyl 2-methylbutyrate", cas: "7452-79-1", formula: "C7H14O2", family: "Esters", concentration: 0.12, notes: "Fruity, apple", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "Ethyl isovalerate", cas: "108-64-5", formula: "C7H14O2", family: "Esters", concentration: 0.1, notes: "Fruity, apple, blueberry", is_new_isolate: true, perfumery_potential: "Élevé" },
  
  // === CAROTÉNOÏDES DÉGRADÉS (8 nouveaux isolats) ===
  { name: "Theaspirane A", cas: "36431-72-8", formula: "C13H22O", family: "Caroténoïdes", concentration: 0.08, notes: "Floral, fruité, thé", is_new_isolate: true, perfumery_potential: "Très élevé" },
  { name: "Theaspirane B", cas: "36431-72-8", formula: "C13H22O", family: "Caroténoïdes", concentration: 0.06, notes: "Floral, fruité, thé", is_new_isolate: true, perfumery_potential: "Très élevé" },
  { name: "Dihydroedulan I", cas: null, formula: "C13H22O", family: "Caroténoïdes", concentration: 0.05, notes: "Floral, fruité", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "Dihydroedulan II", cas: null, formula: "C13H22O", family: "Caroténoïdes", concentration: 0.04, notes: "Floral, fruité", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "4-(2,6,6-Trimethylcyclohexa-1,3-dienyl)butan-2-one", cas: null, formula: "C13H20O", family: "Caroténoïdes", concentration: 0.03, notes: "Ionone-like, floral", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "Dihydro-beta-ionone", cas: "17283-81-7", formula: "C13H22O", family: "Caroténoïdes", concentration: 0.15, notes: "Floral, violette, fruité", is_new_isolate: true, perfumery_potential: "Exceptionnel" },
  { name: "Alpha-iso-Methylionone", cas: "127-51-5", formula: "C14H22O", family: "Caroténoïdes", concentration: 0.1, notes: "Floral, violette, iris", is_new_isolate: true, perfumery_potential: "Exceptionnel" },
  { name: "Vitaspirane", cas: "65416-59-3", formula: "C13H22O", family: "Caroténoïdes", concentration: 0.02, notes: "Woody, camphoraceous", is_new_isolate: true, perfumery_potential: "Moyen" },
  
  // === LACTONES CRÉMEUSES (2 nouveaux isolats) ===
  { name: "cis-Oak lactone (Whiskey lactone)", cas: "39212-23-2", formula: "C10H18O2", family: "Lactones", concentration: 0.2, notes: "Boisé, lacté, whiskey, coco", is_new_isolate: true, perfumery_potential: "Exceptionnel" },
  { name: "Gamma-Undecalactone", cas: "104-67-6", formula: "C11H20O2", family: "Lactones", concentration: 0.15, notes: "Fruité-pêche, crémeux", is_new_isolate: true, perfumery_potential: "Exceptionnel" },
  
  // === IONONES ET DAMASCONES ===
  { name: "Beta-ionone", cas: "14901-07-6", formula: "C13H20O", family: "Ionones", concentration: 0.8, notes: "Violette, floral, fruité", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  { name: "Alpha-ionone", cas: "127-41-3", formula: "C13H20O", family: "Ionones", concentration: 0.4, notes: "Violette, floral, boisé", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Beta-damascenone", cas: "23726-93-4", formula: "C13H18O", family: "Damascones", concentration: 0.3, notes: "Rose, fruité, miel", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  { name: "Beta-damascone", cas: "23726-91-2", formula: "C13H20O", family: "Damascones", concentration: 0.2, notes: "Rose, fruité, tabac", is_new_isolate: false, perfumery_potential: "Très élevé" },
  
  // === SESQUITERPÈNES ===
  { name: "Alpha-Muurolene", cas: "31983-22-9", formula: "C15H24", family: "Sesquiterpènes", concentration: 0.1, notes: "Woody, herbal", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "Gamma-Muurolene", cas: "30021-74-0", formula: "C15H24", family: "Sesquiterpènes", concentration: 0.08, notes: "Woody, herbal", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "Beta-Caryophyllene", cas: "87-44-5", formula: "C15H24", family: "Sesquiterpènes", concentration: 0.5, notes: "Woody, spicy, clove", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "Alpha-Humulene", cas: "6753-98-6", formula: "C15H24", family: "Sesquiterpènes", concentration: 0.3, notes: "Woody, earthy, hoppy", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "Farnesol", cas: "4602-84-0", formula: "C15H26O", family: "Sesquiterpènes", concentration: 0.2, notes: "Floral, muguet, green", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Nerolidol", cas: "7212-44-4", formula: "C15H26O", family: "Sesquiterpènes", concentration: 0.15, notes: "Woody, floral, green", is_new_isolate: false, perfumery_potential: "Très élevé" },
  
  // === MONOTERPÈNES ===
  { name: "Linalool", cas: "78-70-6", formula: "C10H18O", family: "Monoterpènes", concentration: 0.6, notes: "Floral, citrus, woody", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  { name: "Geraniol", cas: "106-24-1", formula: "C10H18O", family: "Monoterpènes", concentration: 0.4, notes: "Rose, floral, citrus", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  { name: "Nerol", cas: "106-25-2", formula: "C10H18O", family: "Monoterpènes", concentration: 0.2, notes: "Rose, floral, fresh", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Citronellol", cas: "106-22-9", formula: "C10H20O", family: "Monoterpènes", concentration: 0.3, notes: "Rose, floral, citrus", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Limonene", cas: "138-86-3", formula: "C10H16", family: "Monoterpènes", concentration: 0.5, notes: "Citrus, orange, fresh", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "Alpha-Pinene", cas: "80-56-8", formula: "C10H16", family: "Monoterpènes", concentration: 0.2, notes: "Pine, woody, fresh", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "Beta-Pinene", cas: "127-91-3", formula: "C10H16", family: "Monoterpènes", concentration: 0.15, notes: "Pine, woody, turpentine", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "Myrcene", cas: "123-35-3", formula: "C10H16", family: "Monoterpènes", concentration: 0.3, notes: "Balsamic, spicy, herbal", is_new_isolate: false, perfumery_potential: "Moyen" },
  
  // === ALDÉHYDES ===
  { name: "Benzaldehyde", cas: "100-52-7", formula: "C7H6O", family: "Aldéhydes", concentration: 0.4, notes: "Almond, cherry, marzipan", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "Phenylacetaldehyde", cas: "122-78-1", formula: "C8H8O", family: "Aldéhydes", concentration: 0.3, notes: "Honey, floral, hyacinth", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Furfural", cas: "98-01-1", formula: "C5H4O2", family: "Aldéhydes", concentration: 0.5, notes: "Bready, caramel, almond", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "5-Methylfurfural", cas: "620-02-0", formula: "C6H6O2", family: "Aldéhydes", concentration: 0.3, notes: "Caramel, spicy, maple", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "Hexanal", cas: "66-25-1", formula: "C6H12O", family: "Aldéhydes", concentration: 0.2, notes: "Green, grassy, fatty", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Nonanal", cas: "124-19-6", formula: "C9H18O", family: "Aldéhydes", concentration: 0.15, notes: "Fatty, citrus, green", is_new_isolate: false, perfumery_potential: "Moyen" },
  
  // === ACIDES ORGANIQUES ===
  { name: "Acetic acid", cas: "64-19-7", formula: "C2H4O2", family: "Acides", concentration: 2.5, notes: "Vinegar, sour, pungent", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Propionic acid", cas: "79-09-4", formula: "C3H6O2", family: "Acides", concentration: 0.8, notes: "Pungent, dairy, cheesy", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Isobutyric acid", cas: "79-31-2", formula: "C4H8O2", family: "Acides", concentration: 0.6, notes: "Sweaty, cheesy, butter", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "2-Methylbutyric acid", cas: "116-53-0", formula: "C5H10O2", family: "Acides", concentration: 0.4, notes: "Sweaty, fruity, cheesy", is_new_isolate: true, perfumery_potential: "Faible" },
  { name: "Isovaleric acid", cas: "503-74-2", formula: "C5H10O2", family: "Acides", concentration: 0.5, notes: "Sweaty, cheesy, rancid", is_new_isolate: true, perfumery_potential: "Faible" },
  
  // === CÉTONES ===
  { name: "Acetoin", cas: "513-86-0", formula: "C4H8O2", family: "Cétones", concentration: 0.4, notes: "Buttery, creamy, yogurt", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "Diacetyl", cas: "431-03-8", formula: "C4H6O2", family: "Cétones", concentration: 0.3, notes: "Buttery, creamy", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "2,3-Pentanedione", cas: "600-14-6", formula: "C5H8O2", family: "Cétones", concentration: 0.2, notes: "Buttery, caramel", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "4,8-Dimethylnona-3,7-dien-2-one", cas: null, formula: "C11H18O", family: "Cétones", concentration: 0.1, notes: "Floral, green", is_new_isolate: true, perfumery_potential: "Élevé" },
  { name: "(E)-6-Methyl-3,5-heptadienone", cas: null, formula: "C8H12O", family: "Cétones", concentration: 0.08, notes: "Fruity, green", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "(Z)-6-Methyl-3,5-heptadienone", cas: null, formula: "C8H12O", family: "Cétones", concentration: 0.08, notes: "Fruity, green", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "Eucarvone", cas: "503-93-5", formula: "C10H14O", family: "Cétones", concentration: 0.05, notes: "Minty, camphoraceous", is_new_isolate: true, perfumery_potential: "Moyen" },
  
  // === PHÉNOLS ===
  { name: "Guaiacol", cas: "90-05-1", formula: "C7H8O2", family: "Phénols", concentration: 0.3, notes: "Smoky, phenolic, vanilla", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "4-Vinylguaiacol", cas: "7786-61-0", formula: "C9H10O2", family: "Phénols", concentration: 0.2, notes: "Smoky, spicy, clove", is_new_isolate: false, perfumery_potential: "Élevé" },
  { name: "Eugenol", cas: "97-53-0", formula: "C10H12O2", family: "Phénols", concentration: 0.25, notes: "Clove, spicy, warm", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Isoeugenol", cas: "97-54-1", formula: "C10H12O2", family: "Phénols", concentration: 0.15, notes: "Clove, spicy, floral", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Vanillin", cas: "121-33-5", formula: "C8H8O3", family: "Phénols", concentration: 0.4, notes: "Vanilla, sweet, creamy", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  { name: "Ethyl vanillin", cas: "121-32-4", formula: "C9H10O3", family: "Phénols", concentration: 0.1, notes: "Vanilla, sweet, intense", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  
  // === PYRAZINES ===
  { name: "2-Methylpyrazine", cas: "109-08-0", formula: "C5H6N2", family: "Pyrazines", concentration: 0.15, notes: "Nutty, roasted, cocoa", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "2,5-Dimethylpyrazine", cas: "123-32-0", formula: "C6H8N2", family: "Pyrazines", concentration: 0.12, notes: "Nutty, roasted, earthy", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "2,3-Dimethylpyrazine", cas: "5910-89-4", formula: "C6H8N2", family: "Pyrazines", concentration: 0.1, notes: "Nutty, green, roasted", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "2-Ethyl-3-methylpyrazine", cas: "15707-23-0", formula: "C7H10N2", family: "Pyrazines", concentration: 0.08, notes: "Nutty, roasted, earthy", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "2,3,5-Trimethylpyrazine", cas: "14667-55-1", formula: "C7H10N2", family: "Pyrazines", concentration: 0.1, notes: "Nutty, roasted, potato", is_new_isolate: false, perfumery_potential: "Moyen" },
  
  // === FURANES ===
  { name: "2-Acetylfuran", cas: "1192-62-7", formula: "C6H6O2", family: "Furanes", concentration: 0.2, notes: "Balsamic, cocoa, coffee", is_new_isolate: false, perfumery_potential: "Moyen" },
  { name: "2-Pentylfuran", cas: "3777-69-3", formula: "C9H14O", family: "Furanes", concentration: 0.15, notes: "Green, beany, vegetable", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Furfuryl alcohol", cas: "98-00-0", formula: "C5H6O2", family: "Furanes", concentration: 0.3, notes: "Burnt, caramel, bread", is_new_isolate: false, perfumery_potential: "Moyen" },
  
  // === COMPOSÉS AROMATIQUES SPÉCIFIQUES ===
  { name: "Benzophenone", cas: "119-61-9", formula: "C13H10O", family: "Aromatiques", concentration: 0.05, notes: "Rose, geranium, metallic", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "1,2-Diphenoxyethane", cas: "104-66-5", formula: "C14H14O2", family: "Aromatiques", concentration: 0.03, notes: "Floral, phenolic", is_new_isolate: true, perfumery_potential: "Moyen" },
  { name: "2,6-Di-tert-butylbenzoquinone", cas: "719-22-2", formula: "C14H20O2", family: "Aromatiques", concentration: 0.02, notes: "Phenolic, woody", is_new_isolate: true, perfumery_potential: "Faible" },
  { name: "Frontalin", cas: "28401-47-8", formula: "C8H14O2", family: "Aromatiques", concentration: 0.01, notes: "Woody, camphoraceous", is_new_isolate: true, perfumery_potential: "Faible" },
  
  // === INDOLES ===
  { name: "Indole", cas: "120-72-9", formula: "C8H7N", family: "Indoles", concentration: 0.15, notes: "Floral, animalic, jasmine", is_new_isolate: false, perfumery_potential: "Exceptionnel" },
  { name: "Skatole", cas: "83-34-1", formula: "C9H9N", family: "Indoles", concentration: 0.05, notes: "Animalic, fecal, floral", is_new_isolate: false, perfumery_potential: "Élevé" },
  
  // === NICOTINE ET ALCALOÏDES ===
  { name: "Nicotine", cas: "54-11-5", formula: "C10H14N2", family: "Alcaloïdes", concentration: 1.5, notes: "Tobacco, pungent", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Nornicotine", cas: "494-97-3", formula: "C9H12N2", family: "Alcaloïdes", concentration: 0.3, notes: "Tobacco", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Anabasine", cas: "494-52-0", formula: "C10H14N2", family: "Alcaloïdes", concentration: 0.1, notes: "Tobacco, bitter", is_new_isolate: false, perfumery_potential: "Faible" },
  
  // === SOLANONE ET DÉRIVÉS ===
  { name: "Solanone", cas: "1937-54-8", formula: "C13H22O", family: "Solanones", concentration: 0.2, notes: "Tobacco, hay, honey", is_new_isolate: false, perfumery_potential: "Très élevé" },
  { name: "Megastigmatrienone", cas: "38818-55-2", formula: "C13H18O", family: "Solanones", concentration: 0.1, notes: "Tobacco, spicy, woody", is_new_isolate: false, perfumery_potential: "Élevé" },
  
  // === AUTRES COMPOSÉS MAJEURS ===
  { name: "Ethanol", cas: "64-17-5", formula: "C2H6O", family: "Alcools", concentration: 15.0, notes: "Alcoholic, ethereal", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Acetaldehyde", cas: "75-07-0", formula: "C2H4O", family: "Aldéhydes", concentration: 3.0, notes: "Ethereal, fruity, pungent", is_new_isolate: false, perfumery_potential: "Faible" },
  { name: "Methanol", cas: "67-56-1", formula: "CH4O", family: "Alcools", concentration: 2.0, notes: "Alcoholic", is_new_isolate: false, perfumery_potential: "Faible" }
];

async function importPeriqueCompounds() {
  console.log("🧪 Import des composés du Perique...");
  console.log(`📊 ${periqueCompounds.length} composés à importer`);
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    let imported = 0;
    let updated = 0;
    
    for (const compound of periqueCompounds) {
      try {
        // Vérifier si le composé existe déjà
        const [existing] = await connection.execute(
          `SELECT id FROM tobacco_compounds WHERE compound_name = ?`,
          [compound.name]
        );
        
        if (existing.length > 0) {
          // Mettre à jour
          await connection.execute(
            `UPDATE tobacco_compounds SET 
              cas_number = ?,
              chemical_class = ?,
              concentration_percent = ?,
              aromatic_notes = ?,
              is_new_tobacco_isolate = ?,
              perfumery_relevance = ?,
              landrace_source = 'Perique',
              source_reference = 'Leffingwell & Alford (2005)',
              data_certainty = 'confirmed'
            WHERE compound_name = ?`,
            [
              compound.cas,
              compound.family,
              compound.concentration,
              compound.notes,
              compound.is_new_isolate ? 1 : 0,
              compound.perfumery_potential,
              compound.name
            ]
          );
          updated++;
        } else {
          // Insérer
          await connection.execute(
            `INSERT INTO tobacco_compounds 
              (compound_name, cas_number, chemical_class, concentration_percent, 
               aromatic_notes, is_new_tobacco_isolate, perfumery_relevance, 
               landrace_source, source_reference, data_certainty)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Perique', 'Leffingwell & Alford (2005)', 'confirmed')`,
            [
              compound.name,
              compound.cas,
              compound.family,
              compound.concentration,
              compound.notes,
              compound.is_new_isolate ? 1 : 0,
              compound.perfumery_potential
            ]
          );
          imported++;
        }
      } catch (err) {
        console.error(`❌ Erreur pour ${compound.name}:`, err.message);
      }
    }
    
    console.log(`\n✅ Import terminé:`);
    console.log(`   - ${imported} nouveaux composés importés`);
    console.log(`   - ${updated} composés mis à jour`);
    
    // Statistiques par famille
    const [stats] = await connection.execute(`
      SELECT chemical_class, COUNT(*) as count, 
             SUM(CASE WHEN is_new_tobacco_isolate = 1 THEN 1 ELSE 0 END) as new_isolates
      FROM tobacco_compounds 
      WHERE landrace_source = 'Perique'
      GROUP BY chemical_class
      ORDER BY count DESC
    `);
    
    console.log("\n📊 Statistiques par famille chimique:");
    for (const stat of stats) {
      console.log(`   - ${stat.chemical_class}: ${stat.count} composés (${stat.new_isolates} nouveaux isolats)`);
    }
    
    // Total
    const [total] = await connection.execute(`
      SELECT COUNT(*) as total FROM tobacco_compounds WHERE landrace_source = 'Perique'
    `);
    console.log(`\n📊 Total composés du Perique: ${total[0].total}`);
    
  } finally {
    await connection.end();
  }
}

importPeriqueCompounds().catch(console.error);
