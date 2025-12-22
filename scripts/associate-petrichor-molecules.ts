import { getDb } from '../server/db';
import { moleculesRecettes } from '../drizzle/schema';

// Associations molécules-recettes pour les 6 recettes Pétrichor
// Basées sur les profils olfactifs et les molécules terreuses identifiées

const associations = [
  // Pétrichor Sacré (ID: 120005) - Parfum sacré avec encens et terre
  { recetteId: 120005, moleculeId: 90001, proportion: 15, notes: 'Géosmine - Note de pluie caractéristique' },
  { recetteId: 120005, moleculeId: 180005, proportion: 20, notes: 'Mitti Attar - Terre mouillée indienne' },
  { recetteId: 120005, moleculeId: 180001, proportion: 18, notes: 'Palo Santo - Bois sacré' },
  { recetteId: 120005, moleculeId: 180015, proportion: 12, notes: 'Spikenard - Nard biblique' },
  { recetteId: 120005, moleculeId: 300003, proportion: 8, notes: 'Ambre Gris - Fixateur précieux' },

  // Pétrichor Ancestral (ID: 150001) - Résine CBD ancestrale
  { recetteId: 150001, moleculeId: 90001, proportion: 20, notes: 'Géosmine - Essence de pétrichor' },
  { recetteId: 150001, moleculeId: 180005, proportion: 25, notes: 'Mitti Attar - Terre ancestrale' },
  { recetteId: 150001, moleculeId: 180017, proportion: 15, notes: 'Black Emerald - Vétiver vintage' },
  { recetteId: 150001, moleculeId: 90003, proportion: 10, notes: 'Sclerene - Note minérale' },
  { recetteId: 150001, moleculeId: 120018, proportion: 12, notes: 'Complexes terre minérale' },

  // Pétrichor Forestier (ID: 150002) - Résine forestière
  { recetteId: 150002, moleculeId: 90001, proportion: 12, notes: 'Géosmine - Sous-bois humide' },
  { recetteId: 150002, moleculeId: 180004, proportion: 20, notes: 'Wild Juniper - Genièvre sauvage' },
  { recetteId: 150002, moleculeId: 150004, proportion: 18, notes: 'β-Pinène - Conifères' },
  { recetteId: 150002, moleculeId: 90054, proportion: 15, notes: 'Patchoulol - Terre forestière' },
  { recetteId: 150002, moleculeId: 180016, proportion: 12, notes: 'Haitian Vetiver - Racines' },

  // Pétrichor Minéral (ID: 150003) - Résine CBD minérale
  { recetteId: 150003, moleculeId: 90001, proportion: 18, notes: 'Géosmine - Pluie sur pierre' },
  { recetteId: 150003, moleculeId: 120018, proportion: 25, notes: 'Complexes terre minérale - Cœur minéral' },
  { recetteId: 150003, moleculeId: 90014, proportion: 15, notes: 'Silicate aldehyde - Note métallique' },
  { recetteId: 150003, moleculeId: 90003, proportion: 12, notes: 'Sclerene - Pierre humide' },
  { recetteId: 150003, moleculeId: 120011, proportion: 10, notes: 'Aldéhyde métallique - Accent minéral' },

  // Pétrichor Tropical (ID: 150004) - Résine CBD tropicale
  { recetteId: 150004, moleculeId: 90001, proportion: 15, notes: 'Géosmine - Pluie tropicale' },
  { recetteId: 150004, moleculeId: 180005, proportion: 18, notes: 'Mitti Attar - Terre chaude' },
  { recetteId: 150004, moleculeId: 150005, proportion: 20, notes: 'β-Caryophyllène - Épices tropicales' },
  { recetteId: 150004, moleculeId: 30005, proportion: 12, notes: 'Caryophyllène - Bois épicé' },
  { recetteId: 150004, moleculeId: 150007, proportion: 10, notes: 'Humulène - Houblon tropical' },

  // Pétrichor Nocturne (ID: 150005) - Résine CBD nocturne
  { recetteId: 150005, moleculeId: 90001, proportion: 20, notes: 'Géosmine - Nuit après la pluie' },
  { recetteId: 150005, moleculeId: 180017, proportion: 18, notes: 'Black Emerald - Vétiver sombre' },
  { recetteId: 150005, moleculeId: 180006, proportion: 12, notes: 'Gris d\'Ambre - Profondeur nocturne' },
  { recetteId: 150005, moleculeId: 90034, proportion: 8, notes: 'Skatole - Note animale subtile' },
  { recetteId: 150005, moleculeId: 300004, proportion: 15, notes: 'Ambrox Super - Fixateur puissant' },
];

async function main() {
  const db = await getDb();
  
  console.log("=== CRÉATION DES ASSOCIATIONS MOLÉCULES-RECETTES PÉTRICHOR ===\n");
  
  let created = 0;
  let errors = 0;
  
  for (const assoc of associations) {
    try {
      await db.insert(moleculesRecettes).values({
        recetteId: assoc.recetteId,
        moleculeId: assoc.moleculeId,
        proportion: assoc.proportion.toString(),
        notes: assoc.notes
      });
      console.log(`✅ Recette ${assoc.recetteId} ← Molécule ${assoc.moleculeId} (${assoc.proportion}%)`);
      created++;
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ Association déjà existante: ${assoc.recetteId} ← ${assoc.moleculeId}`);
      } else {
        console.error(`❌ Erreur: ${e.message}`);
        errors++;
      }
    }
  }
  
  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Associations créées: ${created}`);
  console.log(`Erreurs: ${errors}`);
  console.log(`Total prévu: ${associations.length}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
