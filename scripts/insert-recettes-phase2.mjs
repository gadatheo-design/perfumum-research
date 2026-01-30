import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// 5 recettes utilisant les nouvelles molécules Phase 2
const recettes = [
  {
    name: "Aura Radieuse",
    category: "parfum",
    description: "Un sillage lumineux et enveloppant, construit autour de l'Hedione et de l'Ambroxan. Cette formulation moderne capture l'essence de la peau chauffée par le soleil, avec une ouverture pétillante de bergamote et un cœur jasminé transparent.",
    ingredients: "Hedione (15%), Ambroxan (8%), Bergamote Calabre, Yuzu, Cardamome, Absolue de Jasmin, Iso E Super, Cashmeran",
    formula: "Hedione 15% | Iso E Super 12% | Ambroxan 8% | Bergamote 5% | Cashmeran 4% | Yuzu 3% | Cardamome 2% | Jasmin 0.3%",
    notes: "Lumineux, radiant, effet halo, seconde peau. Usage: quotidien élégant, bureau, rendez-vous",
    notesTete: "Bergamote Calabre, Yuzu, Cardamome",
    notesCoeur: "Hedione (15%), Absolue de Jasmin, Rose",
    notesFond: "Ambroxan (8%), Iso E Super, Cashmeran",
    intensity: 7,
    stability: "high",
    status: "validated",
    molecules: [
      { name: "Hedione", proportion: 15 },
      { name: "Ambroxan (Cetalox)", proportion: 8 },
      { name: "Bergamote Calabre (Linalyl Acetate)", proportion: 5 },
      { name: "Yuzu (Limonene + Linalool)", proportion: 3 },
      { name: "Cardamome (α-Terpinyl Acetate)", proportion: 2 },
      { name: "Absolue de Jasmin (Indole)", proportion: 0.3 },
      { name: "Iso E Super", proportion: 12 },
      { name: "Cashmeran", proportion: 4 }
    ]
  },
  {
    name: "Nuit de Tubéreuse",
    category: "parfum",
    description: "Une composition opulente et capiteux centrée sur la tubéreuse absolue. Le safranal apporte une touche dorée orientale, tandis que le muscone crée un sillage animal et sensuel. Un parfum de soirée inoubliable.",
    ingredients: "Tubéreuse Absolue (2%), Safranal, Absolue de Jasmin, Muscone (1%), Civettone (0.1%), Ambrox Super",
    formula: "Ambrox Super 5% | Bergamote 3% | Tubéreuse 2% | Muscone 1% | Safranal 0.3% | Jasmin 0.2% | Civettone 0.1%",
    notes: "Opulent, sensuel, nocturne, mémorable. Usage: soirées, événements spéciaux, séduction",
    notesTete: "Safranal, Bergamote, Poivre rose",
    notesCoeur: "Tubéreuse Absolue (2%), Absolue de Jasmin, Ylang",
    notesFond: "Muscone (1%), Civettone (0.1%), Ambrox Super",
    intensity: 9,
    stability: "high",
    status: "validated",
    molecules: [
      { name: "Tubéreuse Absolue (Methyl Benzoate)", proportion: 2 },
      { name: "Safranal", proportion: 0.3 },
      { name: "Absolue de Jasmin (Indole)", proportion: 0.2 },
      { name: "Muscone", proportion: 1 },
      { name: "Civettone", proportion: 0.1 },
      { name: "Ambrox Super", proportion: 5 },
      { name: "Bergamote Calabre (Linalyl Acetate)", proportion: 3 }
    ]
  },
  {
    name: "Santal Éternel",
    category: "parfum",
    description: "Une ode au santal Mysore, enrichie par le Javanol et le Norlimbanol pour une reconstitution crémeuse et moderne. L'encens oliban apporte une dimension spirituelle, créant un parfum méditatif et luxueux.",
    ingredients: "Santal Mysore (5%), Javanol (10%), Norlimbanol (8%), Encens Oliban, Cardamome, Cashmeran",
    formula: "Javanol 10% | Norlimbanol 8% | Santal Mysore 5% | Cashmeran 4% | Encens 3% | Cardamome 2%",
    notes: "Méditatif, crémeux, spirituel, luxueux. Usage: méditation, yoga, occasions spéciales",
    notesTete: "Cardamome, Encens Oliban, Bergamote",
    notesCoeur: "Santal Mysore (5%), Javanol (10%), Rose",
    notesFond: "Norlimbanol (8%), Cashmeran, Vanille",
    intensity: 8,
    stability: "high",
    status: "validated",
    molecules: [
      { name: "Santal Mysore (α-Santalol)", proportion: 5 },
      { name: "Javanol", proportion: 10 },
      { name: "Norlimbanol", proportion: 8 },
      { name: "Encens Oliban (Incensole)", proportion: 3 },
      { name: "Cardamome (α-Terpinyl Acetate)", proportion: 2 },
      { name: "Cashmeran", proportion: 4 }
    ]
  },
  {
    name: "Rose Impériale",
    category: "parfum",
    description: "Une rose majestueuse sublimée par l'iris et le gaïac. L'absolue de rose bulgare forme le cœur, tandis que le Clearwood apporte une modernité boisée. Un classique réinventé pour le XXIe siècle.",
    ingredients: "Absolue de Rose (3%), Absolue d'Iris (0.5%), Gaïac (4%), Clearwood (6%), Bergamote, Cardamome",
    formula: "Clearwood 6% | Bergamote 4% | Gaïac 4% | Rose 3% | Cardamome 1.5% | Iris 0.5%",
    notes: "Majestueux, raffiné, intemporel, noble. Usage: occasions formelles, mariages, galas",
    notesTete: "Bergamote, Poivre rose, Cardamome",
    notesCoeur: "Absolue de Rose (3%), Absolue d'Iris (0.5%), Géranium",
    notesFond: "Gaïac (4%), Clearwood (6%), Musc blanc",
    intensity: 7,
    stability: "high",
    status: "validated",
    molecules: [
      { name: "Absolue de Rose (Citronellol)", proportion: 3 },
      { name: "Absolue d'Iris (Orris Butter)", proportion: 0.5 },
      { name: "Gaïac (Guaiol)", proportion: 4 },
      { name: "Clearwood (Patchouli Synthétique)", proportion: 6 },
      { name: "Bergamote Calabre (Linalyl Acetate)", proportion: 4 },
      { name: "Cardamome (α-Terpinyl Acetate)", proportion: 1.5 }
    ]
  },
  {
    name: "Paradis Fruité",
    category: "parfum",
    description: "Une explosion de fraîcheur moderne construite autour du Paradisone et de l'Hedione. Le yuzu japonais et la bergamote créent une ouverture pétillante, tandis que l'Ethylene Brassylate apporte un fond musqué propre.",
    ingredients: "Paradisone (6%), Hedione (10%), Yuzu (5%), Bergamote, Ethylene Brassylate (8%), Galaxolide, Ambroxan",
    formula: "Hedione 10% | Ethylene Brassylate 8% | Galaxolide 6% | Paradisone 6% | Yuzu 5% | Bergamote 4% | Ambroxan 3%",
    notes: "Joyeux, frais, moderne, lumineux. Usage: quotidien, printemps/été, sport chic",
    notesTete: "Yuzu (5%), Bergamote, Poire",
    notesCoeur: "Paradisone (6%), Hedione (10%), Jasmin",
    notesFond: "Ethylene Brassylate (8%), Galaxolide, Ambroxan",
    intensity: 6,
    stability: "high",
    status: "validated",
    molecules: [
      { name: "Paradisone", proportion: 6 },
      { name: "Hedione", proportion: 10 },
      { name: "Yuzu (Limonene + Linalool)", proportion: 5 },
      { name: "Bergamote Calabre (Linalyl Acetate)", proportion: 4 },
      { name: "Ethylene Brassylate", proportion: 8 },
      { name: "Galaxolide", proportion: 6 },
      { name: "Ambroxan (Cetalox)", proportion: 3 }
    ]
  }
];

async function insertRecettes() {
  console.log("🧪 Insertion des 5 recettes Phase 2...\n");
  
  let insertedCount = 0;
  
  for (const recette of recettes) {
    try {
      // Vérifier si la recette existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM recettes WHERE name = ?',
        [recette.name]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  ${recette.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      // Insérer la recette
      const [result] = await connection.execute(
        `INSERT INTO recettes (
          name, category, description, ingredients, formula, notes,
          notes_tete, notes_coeur, notes_fond,
          intensity, stability, status,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          recette.name, recette.category, recette.description,
          recette.ingredients, recette.formula, recette.notes,
          recette.notesTete, recette.notesCoeur, recette.notesFond,
          recette.intensity, recette.stability, recette.status
        ]
      );
      
      const recetteId = result.insertId;
      console.log(`✅ ${recette.name} insérée (ID: ${recetteId})`);
      
      // Lier les molécules à la recette
      for (const mol of recette.molecules) {
        const [molResult] = await connection.execute(
          'SELECT id FROM molecules WHERE name = ?',
          [mol.name]
        );
        
        if (molResult.length > 0) {
          await connection.execute(
            `INSERT INTO molecules_recettes (molecule_id, recette_id, proportion)
             VALUES (?, ?, ?)`,
            [molResult[0].id, recetteId, mol.proportion]
          );
          console.log(`   → ${mol.name} (${mol.proportion}%)`);
        } else {
          console.log(`   ⚠️ Molécule non trouvée: ${mol.name}`);
        }
      }
      
      insertedCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ${recette.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 Résumé: ${insertedCount}/${recettes.length} recettes insérées`);
  
  // Compter le total des recettes
  const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM recettes');
  console.log(`📈 Total recettes dans la base: ${countResult[0].total}`);
  
  await connection.end();
}

insertRecettes().catch(console.error);
