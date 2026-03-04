#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:3000/api/trpc';

// Données scientifiques pour enrichissement
const enrichmentData = {
  // Tabacs - données GC-MS
  'Tabac cultivé': [
    { molecule: 'Nicotine', percentage: 2.5, source: 'PMC3570572' },
    { molecule: 'Solanone', percentage: 0.8, source: 'MDPI2019' },
    { molecule: 'Damascenone', percentage: 0.5, source: 'MDPI2019' },
    { molecule: 'Myrcène', percentage: 0.3, source: 'PMC3570572' },
    { molecule: 'Limonène', percentage: 0.2, source: 'PMC3570572' }
  ],
  'Virginia': [
    { molecule: 'Nicotine', percentage: 1.8, source: 'PMC10808149' },
    { molecule: 'Sucres', percentage: 15.0, source: 'PMC10808149' },
    { molecule: 'Protéines', percentage: 8.0, source: 'PMC10808149' },
    { molecule: 'Limonène', percentage: 0.4, source: 'PMC10808149' }
  ],
  'Burley': [
    { molecule: 'Nicotine', percentage: 3.5, source: 'PMC10808149' },
    { molecule: 'Sucres', percentage: 8.0, source: 'PMC10808149' },
    { molecule: 'Protéines', percentage: 12.0, source: 'PMC10808149' },
    { molecule: 'Myrcène', percentage: 0.2, source: 'PMC10808149' }
  ],
  'Latakia': [
    { molecule: 'Nicotine', percentage: 2.0, source: 'PMC10808149' },
    { molecule: 'Caryophyllène oxide', percentage: 1.2, source: 'PMC10808149' },
    { molecule: 'Linalol oxide', percentage: 0.8, source: 'PMC10808149' },
    { molecule: 'Damascenone', percentage: 0.6, source: 'PMC10808149' }
  ],
  
  // Cannabis - données terpéniques
  'Afghan Kush': [
    { molecule: 'Myrcène', percentage: 25.0, source: 'PMC7763918' },
    { molecule: 'Limonène', percentage: 8.0, source: 'PMC7763918' },
    { molecule: 'β-Caryophyllène', percentage: 12.0, source: 'PMC7763918' },
    { molecule: 'Humulène', percentage: 5.0, source: 'PMC7763918' },
    { molecule: 'Pinène', percentage: 3.0, source: 'PMC7763918' }
  ],
  'Thai Stick': [
    { molecule: 'Limonène', percentage: 22.0, source: 'PMC7763918' },
    { molecule: 'Myrcène', percentage: 15.0, source: 'PMC7763918' },
    { molecule: 'β-Caryophyllène', percentage: 8.0, source: 'PMC7763918' },
    { molecule: 'Pinène', percentage: 6.0, source: 'PMC7763918' },
    { molecule: 'Camphène', percentage: 2.0, source: 'PMC7763918' }
  ],
  'Acapulco Gold': [
    { molecule: 'Limonène', percentage: 18.0, source: 'PMC7763918' },
    { molecule: 'Myrcène', percentage: 20.0, source: 'PMC7763918' },
    { molecule: 'β-Caryophyllène', percentage: 10.0, source: 'PMC7763918' },
    { molecule: 'Humulène', percentage: 4.0, source: 'PMC7763918' },
    { molecule: 'Linalol', percentage: 3.0, source: 'PMC7763918' }
  ],
  
  // Roses
  'Rosa damascena': [
    { molecule: 'Citronellol', percentage: 35.0, source: 'PMC12073320' },
    { molecule: 'Géraniol', percentage: 18.0, source: 'PMC12073320' },
    { molecule: 'Nérol', percentage: 12.0, source: 'PMC12073320' },
    { molecule: 'Linalol', percentage: 8.0, source: 'PMC12073320' },
    { molecule: 'Myrcène', percentage: 5.0, source: 'PMC12073320' }
  ],
  
  // Aromatiques
  'Lavande aspic': [
    { molecule: 'Linalol', percentage: 45.0, source: 'ISO3515' },
    { molecule: 'Linalyl acetate', percentage: 35.0, source: 'ISO3515' },
    { molecule: 'Camphor', percentage: 8.0, source: 'ISO3515' },
    { molecule: 'Limonène', percentage: 2.0, source: 'ISO3515' }
  ],
  'Menthe poivrée': [
    { molecule: 'Menthol', percentage: 50.0, source: 'ISO7609' },
    { molecule: 'Menthone', percentage: 15.0, source: 'ISO7609' },
    { molecule: 'Limonène', percentage: 5.0, source: 'ISO7609' },
    { molecule: 'Myrcène', percentage: 2.0, source: 'ISO7609' }
  ],
  'Gingembre': [
    { molecule: 'β-Caryophyllène', percentage: 25.0, source: 'MDPI2020' },
    { molecule: 'Zingiberène', percentage: 30.0, source: 'MDPI2020' },
    { molecule: 'Limonène', percentage: 8.0, source: 'MDPI2020' },
    { molecule: 'Myrcène', percentage: 5.0, source: 'MDPI2020' }
  ]
};

async function executeEnrichment() {
  console.log('=== EXÉCUTION DE L\'ENRICHISSEMENT DES LIAISONS ===\n');
  
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalErrors = 0;
  
  for (const [plantName, molecules] of Object.entries(enrichmentData)) {
    console.log(`\n📍 Enrichissement de: ${plantName}`);
    
    for (const molData of molecules) {
      try {
        // Appeler l'API pour créer/mettre à jour la liaison
        const response = await fetch(`${API_URL}/moleculeManager.createOrUpdatePlantMolecule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: {
              plantName,
              moleculeName: molData.molecule,
              percentage: molData.percentage,
              source: molData.source
            }
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          console.log(`  ⚠️  Erreur pour ${molData.molecule}: ${data.error.json?.message || 'Erreur inconnue'}`);
          totalErrors++;
        } else {
          const result = data.result?.data;
          if (result?.created) {
            console.log(`  ✅ Créé: ${molData.molecule} (${molData.percentage}%, source: ${molData.source})`);
            totalCreated++;
          } else if (result?.updated) {
            console.log(`  ✏️  Mis à jour: ${molData.molecule} (${molData.percentage}%, source: ${molData.source})`);
            totalUpdated++;
          }
        }
      } catch (error) {
        console.log(`  ❌ Erreur réseau pour ${molData.molecule}: ${error.message}`);
        totalErrors++;
      }
    }
  }
  
  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Liaisons créées: ${totalCreated}`);
  console.log(`Liaisons mises à jour: ${totalUpdated}`);
  console.log(`Erreurs: ${totalErrors}`);
  console.log(`Total: ${totalCreated + totalUpdated}`);
  
  // Sauvegarder le résumé
  const summary = {
    timestamp: new Date().toISOString(),
    created: totalCreated,
    updated: totalUpdated,
    errors: totalErrors,
    total: totalCreated + totalUpdated,
    plants: Object.keys(enrichmentData).length
  };
  
  fs.writeFileSync('enrichment-summary.json', JSON.stringify(summary, null, 2));
  console.log('\n📊 Résumé sauvegardé dans enrichment-summary.json');
}

executeEnrichment().catch(console.error);
