import { db } from '../server/db.mjs';

// Données scientifiques pour enrichissement
const scientificData = {
  // Tabacs - données GC-MS
  'Tabac cultivé': {
    molecules: [
      { name: 'Nicotine', percentage: 2.5, source: 'PMC3570572' },
      { name: 'Solanone', percentage: 0.8, source: 'MDPI2019' },
      { name: 'Damascenone', percentage: 0.5, source: 'MDPI2019' },
      { name: 'Myrcène', percentage: 0.3, source: 'PMC3570572' },
      { name: 'Limonène', percentage: 0.2, source: 'PMC3570572' }
    ]
  },
  'Virginia': {
    molecules: [
      { name: 'Nicotine', percentage: 1.8, source: 'PMC10808149' },
      { name: 'Sucres', percentage: 15.0, source: 'PMC10808149' },
      { name: 'Protéines', percentage: 8.0, source: 'PMC10808149' },
      { name: 'Limonène', percentage: 0.4, source: 'PMC10808149' }
    ]
  },
  'Burley': {
    molecules: [
      { name: 'Nicotine', percentage: 3.5, source: 'PMC10808149' },
      { name: 'Sucres', percentage: 8.0, source: 'PMC10808149' },
      { name: 'Protéines', percentage: 12.0, source: 'PMC10808149' },
      { name: 'Myrcène', percentage: 0.2, source: 'PMC10808149' }
    ]
  },
  'Latakia': {
    molecules: [
      { name: 'Nicotine', percentage: 2.0, source: 'PMC10808149' },
      { name: 'Caryophyllène oxide', percentage: 1.2, source: 'PMC10808149' },
      { name: 'Linalol oxide', percentage: 0.8, source: 'PMC10808149' },
      { name: 'Damascenone', percentage: 0.6, source: 'PMC10808149' }
    ]
  },
  
  // Cannabis - données terpéniques
  'Afghan Kush': {
    molecules: [
      { name: 'Myrcène', percentage: 25.0, source: 'PMC7763918' },
      { name: 'Limonène', percentage: 8.0, source: 'PMC7763918' },
      { name: 'β-Caryophyllène', percentage: 12.0, source: 'PMC7763918' },
      { name: 'Humulène', percentage: 5.0, source: 'PMC7763918' },
      { name: 'Pinène', percentage: 3.0, source: 'PMC7763918' }
    ]
  },
  'Thai Stick': {
    molecules: [
      { name: 'Limonène', percentage: 22.0, source: 'PMC7763918' },
      { name: 'Myrcène', percentage: 15.0, source: 'PMC7763918' },
      { name: 'β-Caryophyllène', percentage: 8.0, source: 'PMC7763918' },
      { name: 'Pinène', percentage: 6.0, source: 'PMC7763918' },
      { name: 'Camphène', percentage: 2.0, source: 'PMC7763918' }
    ]
  },
  'Acapulco Gold': {
    molecules: [
      { name: 'Limonène', percentage: 18.0, source: 'PMC7763918' },
      { name: 'Myrcène', percentage: 20.0, source: 'PMC7763918' },
      { name: 'β-Caryophyllène', percentage: 10.0, source: 'PMC7763918' },
      { name: 'Humulène', percentage: 4.0, source: 'PMC7763918' },
      { name: 'Linalol', percentage: 3.0, source: 'PMC7763918' }
    ]
  },
  
  // Roses - données chimiques
  'Rosa damascena': {
    molecules: [
      { name: 'Citronellol', percentage: 35.0, source: 'PMC12073320' },
      { name: 'Géraniol', percentage: 18.0, source: 'PMC12073320' },
      { name: 'Nérol', percentage: 12.0, source: 'PMC12073320' },
      { name: 'Linalol', percentage: 8.0, source: 'PMC12073320' },
      { name: 'Myrcène', percentage: 5.0, source: 'PMC12073320' }
    ]
  },
  
  // Aromatiques majeures
  'Lavande aspic': {
    molecules: [
      { name: 'Linalol', percentage: 45.0, source: 'ISO3515' },
      { name: 'Linalyl acetate', percentage: 35.0, source: 'ISO3515' },
      { name: 'Camphor', percentage: 8.0, source: 'ISO3515' },
      { name: 'Limonène', percentage: 2.0, source: 'ISO3515' }
    ]
  },
  'Menthe poivrée': {
    molecules: [
      { name: 'Menthol', percentage: 50.0, source: 'ISO7609' },
      { name: 'Menthone', percentage: 15.0, source: 'ISO7609' },
      { name: 'Limonène', percentage: 5.0, source: 'ISO7609' },
      { name: 'Myrcène', percentage: 2.0, source: 'ISO7609' }
    ]
  },
  'Gingembre': {
    molecules: [
      { name: 'β-Caryophyllène', percentage: 25.0, source: 'MDPI2020' },
      { name: 'Zingiberène', percentage: 30.0, source: 'MDPI2020' },
      { name: 'Limonène', percentage: 8.0, source: 'MDPI2020' },
      { name: 'Myrcène', percentage: 5.0, source: 'MDPI2020' }
    ]
  },
  'Marjolaine': {
    molecules: [
      { name: 'Thymol', percentage: 35.0, source: 'MDPI2018' },
      { name: 'Carvacrol', percentage: 15.0, source: 'MDPI2018' },
      { name: 'Limonène', percentage: 12.0, source: 'MDPI2018' },
      { name: 'Myrcène', percentage: 8.0, source: 'MDPI2018' }
    ]
  },
  'Ylang-ylang': {
    molecules: [
      { name: 'Benzyl acetate', percentage: 35.0, source: 'ISO3496' },
      { name: 'Linalol', percentage: 15.0, source: 'ISO3496' },
      { name: 'Geranyl acetate', percentage: 12.0, source: 'ISO3496' },
      { name: 'Myrcène', percentage: 8.0, source: 'ISO3496' }
    ]
  }
};

async function enrichRelations() {
  console.log('=== ENRICHISSEMENT DES LIAISONS PLANTES-MOLÉCULES ===\n');
  
  let enrichedCount = 0;
  let createdCount = 0;
  
  for (const [plantName, data] of Object.entries(scientificData)) {
    // Trouver la plante
    const plant = await db.query.plants.findFirst({
      where: (plants, { ilike }) => ilike(plants.name, `%${plantName}%`)
    });
    
    if (!plant) {
      console.log(`⚠️  Plante non trouvée: ${plantName}`);
      continue;
    }
    
    console.log(`\n📍 Enrichissement de: ${plant.name}`);
    
    for (const molData of data.molecules) {
      // Trouver la molécule
      const molecule = await db.query.molecules.findFirst({
        where: (molecules, { ilike }) => ilike(molecules.name, `%${molData.name}%`)
      });
      
      if (!molecule) {
        console.log(`  ⚠️  Molécule non trouvée: ${molData.name}`);
        continue;
      }
      
      // Vérifier si la liaison existe
      const existing = await db.query.plantMolecules.findFirst({
        where: (pm, { and, eq }) => and(
          eq(pm.plantId, plant.id),
          eq(pm.moleculeId, molecule.id)
        )
      });
      
      if (existing) {
        // Mettre à jour si les données sont meilleures
        if (!existing.percentage || existing.percentage === 0 || !existing.source) {
          await db.update(plantMolecules)
            .set({
              percentage: molData.percentage,
              source: molData.source
            })
            .where((pm, { and, eq }) => and(
              eq(pm.plantId, plant.id),
              eq(pm.moleculeId, molecule.id)
            ));
          
          console.log(`  ✏️  Mis à jour: ${molecule.name} (${molData.percentage}%, source: ${molData.source})`);
          enrichedCount++;
        }
      } else {
        // Créer la liaison
        await db.insert(plantMolecules).values({
          plantId: plant.id,
          moleculeId: molecule.id,
          percentage: molData.percentage,
          source: molData.source
        });
        
        console.log(`  ✅ Créé: ${molecule.name} (${molData.percentage}%, source: ${molData.source})`);
        createdCount++;
      }
    }
  }
  
  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Liaisons enrichies: ${enrichedCount}`);
  console.log(`Liaisons créées: ${createdCount}`);
  console.log(`Total: ${enrichedCount + createdCount}`);
}

enrichRelations().catch(console.error);
