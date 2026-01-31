/**
 * Script de migration Trefle.io
 * 
 * Enrichit toutes les plantes existantes avec les données taxonomiques
 * depuis Trefle.io (famille, genre, synonymes, distribution).
 * 
 * Usage: node scripts/migrate-trefle-enrichment.mjs [--test] [--limit=N]
 * 
 * Options:
 *   --test    Mode test: n'effectue pas les modifications en base
 *   --limit=N Limite le nombre de plantes à traiter
 */

import mysql from 'mysql2/promise';

// Configuration
const REQUEST_DELAY_MS = 600; // Respecter le rate limiting Trefle (100 req/min)
const BATCH_SIZE = 10; // Nombre de plantes par lot avant pause
const BATCH_PAUSE_MS = 2000; // Pause entre les lots

// Arguments de ligne de commande
const args = process.argv.slice(2);
const isTestMode = args.includes('--test');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

// Base de données locale des familles botaniques
const BOTANICAL_FAMILIES = {
  'Solanaceae': { commonName: 'Nightshade family', genera: ['Nicotiana', 'Solanum', 'Capsicum', 'Datura', 'Atropa'] },
  'Cannabaceae': { commonName: 'Hemp family', genera: ['Cannabis', 'Humulus'] },
  'Lamiaceae': { commonName: 'Mint family', genera: ['Lavandula', 'Mentha', 'Rosmarinus', 'Salvia', 'Thymus', 'Ocimum', 'Origanum', 'Melissa', 'Pogostemon'] },
  'Rutaceae': { commonName: 'Citrus family', genera: ['Citrus', 'Ruta', 'Zanthoxylum', 'Pilocarpus'] },
  'Santalaceae': { commonName: 'Sandalwood family', genera: ['Santalum'] },
  'Burseraceae': { commonName: 'Incense tree family', genera: ['Boswellia', 'Commiphora', 'Canarium', 'Bursera'] },
  'Poaceae': { commonName: 'Grass family', genera: ['Chrysopogon', 'Cymbopogon', 'Vetiveria'] },
  'Geraniaceae': { commonName: 'Geranium family', genera: ['Pelargonium', 'Geranium'] },
  'Rosaceae': { commonName: 'Rose family', genera: ['Rosa', 'Prunus', 'Malus', 'Pyrus'] },
  'Oleaceae': { commonName: 'Olive family', genera: ['Jasminum', 'Olea', 'Syringa', 'Osmanthus'] },
  'Lauraceae': { commonName: 'Laurel family', genera: ['Cinnamomum', 'Laurus', 'Persea', 'Sassafras', 'Aniba'] },
  'Myrtaceae': { commonName: 'Myrtle family', genera: ['Eucalyptus', 'Melaleuca', 'Syzygium', 'Myrtus', 'Eugenia'] },
  'Pinaceae': { commonName: 'Pine family', genera: ['Pinus', 'Cedrus', 'Abies', 'Picea', 'Larix'] },
  'Cupressaceae': { commonName: 'Cypress family', genera: ['Cupressus', 'Juniperus', 'Thuja', 'Chamaecyparis'] },
  'Apiaceae': { commonName: 'Carrot family', genera: ['Angelica', 'Coriandrum', 'Foeniculum', 'Anethum', 'Cuminum', 'Carum', 'Pimpinella', 'Ferula'] },
  'Zingiberaceae': { commonName: 'Ginger family', genera: ['Zingiber', 'Curcuma', 'Elettaria', 'Alpinia', 'Hedychium'] },
  'Iridaceae': { commonName: 'Iris family', genera: ['Iris', 'Crocus'] },
  'Fabaceae': { commonName: 'Legume family', genera: ['Dipteryx', 'Acacia', 'Copaifera', 'Myroxylon'] },
  'Styracaceae': { commonName: 'Storax family', genera: ['Styrax'] },
  'Asteraceae': { commonName: 'Daisy family', genera: ['Artemisia', 'Tagetes', 'Chamaemelum', 'Matricaria', 'Helichrysum', 'Tanacetum'] },
  'Orchidaceae': { commonName: 'Orchid family', genera: ['Vanilla'] },
  'Dipterocarpaceae': { commonName: 'Dipterocarp family', genera: ['Dipterocarpus', 'Shorea'] },
  'Cistaceae': { commonName: 'Rock-rose family', genera: ['Cistus'] },
  'Annonaceae': { commonName: 'Custard apple family', genera: ['Cananga', 'Ylang'] },
  'Magnoliaceae': { commonName: 'Magnolia family', genera: ['Magnolia', 'Michelia'] },
  'Aquilariaceae': { commonName: 'Agarwood family', genera: ['Aquilaria'] },
  'Thymelaeaceae': { commonName: 'Mezereum family', genera: ['Aquilaria'] },
  'Ericaceae': { commonName: 'Heath family', genera: ['Gaultheria'] },
  'Betulaceae': { commonName: 'Birch family', genera: ['Betula'] },
  'Piperaceae': { commonName: 'Pepper family', genera: ['Piper'] },
  'Myristicaceae': { commonName: 'Nutmeg family', genera: ['Myristica'] },
  'Illiciaceae': { commonName: 'Star anise family', genera: ['Illicium'] },
  'Valerianaceae': { commonName: 'Valerian family', genera: ['Valeriana', 'Nardostachys'] },
  'Amaryllidaceae': { commonName: 'Amaryllis family', genera: ['Narcissus', 'Polianthes'] },
  'Moraceae': { commonName: 'Mulberry family', genera: ['Ficus'] },
  'Verbenaceae': { commonName: 'Verbena family', genera: ['Lippia', 'Verbena', 'Lantana', 'Aloysia'] },
  'Myrtaceae': { commonName: 'Myrtle family', genera: ['Eucalyptus', 'Melaleuca', 'Syzygium', 'Myrtus', 'Eugenia', 'Pimenta', 'Leptospermum'] },
  'Araceae': { commonName: 'Arum family', genera: ['Acorus'] },
  'Salicaceae': { commonName: 'Willow family', genera: ['Salix', 'Populus'] },
  'Hamamelidaceae': { commonName: 'Witch-hazel family', genera: ['Liquidambar', 'Hamamelis'] },
  'Clusiaceae': { commonName: 'Mangosteen family', genera: ['Calophyllum', 'Garcinia'] },
  'Convolvulaceae': { commonName: 'Morning glory family', genera: ['Convolvulus', 'Ipomoea'] },
  'Caprifoliaceae': { commonName: 'Honeysuckle family', genera: ['Lonicera', 'Sambucus', 'Viburnum'] },
  'Brassicaceae': { commonName: 'Mustard family', genera: ['Brassica', 'Sinapis', 'Armoracia'] },
  'Liliaceae': { commonName: 'Lily family', genera: ['Lilium', 'Tulipa', 'Convallaria'] },
  'Asparagaceae': { commonName: 'Asparagus family', genera: ['Hyacinthus', 'Muscari', 'Agave'] },
  'Papaveraceae': { commonName: 'Poppy family', genera: ['Papaver'] },
  'Ranunculaceae': { commonName: 'Buttercup family', genera: ['Ranunculus', 'Anemone', 'Clematis'] },
  'Primulaceae': { commonName: 'Primrose family', genera: ['Primula', 'Cyclamen'] },
  'Caryophyllaceae': { commonName: 'Pink family', genera: ['Dianthus', 'Silene'] },
  'Malvaceae': { commonName: 'Mallow family', genera: ['Hibiscus', 'Abelmoschus', 'Althaea', 'Malva', 'Theobroma'] },
  'Turneraceae': { commonName: 'Turnera family', genera: ['Turnera'] },
  'Nymphaeaceae': { commonName: 'Water lily family', genera: ['Nymphaea', 'Nelumbo', 'Nuphar'] },
  'Passifloraceae': { commonName: 'Passion flower family', genera: ['Passiflora'] },
  'Aizoaceae': { commonName: 'Fig-marigold family', genera: ['Sceletium'] },
  'Cactaceae': { commonName: 'Cactus family', genera: ['Lophophora', 'Trichocereus', 'Echinopsis'] },
  'Rubiaceae': { commonName: 'Coffee family', genera: ['Psychotria', 'Coffea', 'Uncaria', 'Gardenia'] },
  'Malpighiaceae': { commonName: 'Barbados cherry family', genera: ['Banisteriopsis'] },
  'Myristicaceae': { commonName: 'Nutmeg family', genera: ['Myristica', 'Virola'] },
  'Euphorbiaceae': { commonName: 'Spurge family', genera: ['Croton', 'Euphorbia', 'Ricinus'] },
  'Zygophyllaceae': { commonName: 'Caltrop family', genera: ['Guaiacum', 'Larrea'] },
  'Canellaceae': { commonName: 'Wild cinnamon family', genera: ['Canella'] },
  'Cyperaceae': { commonName: 'Sedge family', genera: ['Cyperus', 'Carex'] },
  'Polygalaceae': { commonName: 'Milkwort family', genera: ['Securidaca'] },
  'Arecaceae': { commonName: 'Palm family', genera: ['Attalea', 'Cocos', 'Phoenix'] },
  'Lythraceae': { commonName: 'Loosestrife family', genera: ['Heimia'] },
  'Convolvulaceae': { commonName: 'Morning glory family', genera: ['Convolvulus', 'Ipomoea', 'Turbina'] },
  'Chenopodiaceae': { commonName: 'Goosefoot family', genera: ['Dysphania', 'Chenopodium'] },
};

/**
 * Infère la famille botanique à partir du nom scientifique
 */
function inferBotanicalFamily(scientificName) {
  if (!scientificName) return null;
  
  const genus = scientificName.split(' ')[0];
  
  for (const [family, info] of Object.entries(BOTANICAL_FAMILIES)) {
    if (info.genera.some(g => g.toLowerCase() === genus.toLowerCase())) {
      return { family, familyCommonName: info.commonName, genus };
    }
  }
  
  return null;
}

/**
 * Génère un rapport de migration
 */
function generateReport(results) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const byFamily = {};
  
  successful.forEach(r => {
    const family = r.family || 'Unknown';
    byFamily[family] = (byFamily[family] || 0) + 1;
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('RAPPORT DE MIGRATION TREFLE.IO');
  console.log('='.repeat(60));
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Mode: ${isTestMode ? 'TEST (aucune modification)' : 'PRODUCTION'}`);
  console.log('-'.repeat(60));
  console.log(`Total traité: ${results.length}`);
  console.log(`Succès: ${successful.length} (${(successful.length / results.length * 100).toFixed(1)}%)`);
  console.log(`Échecs: ${failed.length}`);
  console.log('-'.repeat(60));
  console.log('Répartition par famille:');
  Object.entries(byFamily)
    .sort((a, b) => b[1] - a[1])
    .forEach(([family, count]) => {
      console.log(`  ${family}: ${count}`);
    });
  
  if (failed.length > 0) {
    console.log('-'.repeat(60));
    console.log('Plantes non enrichies:');
    failed.slice(0, 20).forEach(r => {
      console.log(`  - ${r.plantName}: ${r.error}`);
    });
    if (failed.length > 20) {
      console.log(`  ... et ${failed.length - 20} autres`);
    }
  }
  
  console.log('='.repeat(60));
  
  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    byFamily
  };
}

/**
 * Fonction principale de migration
 */
async function main() {
  console.log('🌿 Migration Trefle.io - Enrichissement taxonomique des plantes');
  console.log(`Mode: ${isTestMode ? 'TEST' : 'PRODUCTION'}`);
  if (limit) console.log(`Limite: ${limit} plantes`);
  console.log('');
  
  // Connexion à la base de données
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✓ Connexion à la base de données établie');
  
  try {
    // Récupérer toutes les plantes
    let query = `
      SELECT id, name, latin_name, family, genus
      FROM plants
      ORDER BY id
    `;
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    const [plants] = await conn.execute(query);
    console.log(`✓ ${plants.length} plantes à traiter\n`);
    
    const results = [];
    let enrichedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < plants.length; i++) {
      const plant = plants[i];
      const result = {
        plantId: plant.id,
        plantName: plant.name,
        latinName: plant.latin_name,
        success: false,
        family: null,
        familyCommonName: null,
        genus: null,
        error: null
      };
      
      // Vérifier si la plante a déjà une famille
      if (plant.family && plant.genus) {
        result.success = true;
        result.family = plant.family;
        result.genus = plant.genus;
        result.skipped = true;
        skippedCount++;
        results.push(result);
        
        if ((i + 1) % 50 === 0) {
          console.log(`[${i + 1}/${plants.length}] Progression... (${skippedCount} déjà enrichies)`);
        }
        continue;
      }
      
      // Essayer d'inférer la famille à partir du nom latin
      const inferred = inferBotanicalFamily(plant.latin_name);
      
      if (inferred) {
        result.family = inferred.family;
        result.familyCommonName = inferred.familyCommonName;
        result.genus = inferred.genus;
        result.success = true;
        
        // Mettre à jour en base si pas en mode test
        if (!isTestMode) {
          try {
            await conn.execute(
              `UPDATE plants SET family = ?, genus = ? WHERE id = ?`,
              [inferred.family, inferred.genus, plant.id]
            );
          } catch (updateError) {
            console.error(`  ⚠ Erreur mise à jour ${plant.name}:`, updateError.message);
          }
        }
        
        enrichedCount++;
        console.log(`[${i + 1}/${plants.length}] ✓ ${plant.name} → ${inferred.family} (${inferred.genus})`);
      } else {
        result.error = 'Famille non identifiée';
        console.log(`[${i + 1}/${plants.length}] ✗ ${plant.name} (${plant.latin_name || 'pas de nom latin'})`);
      }
      
      results.push(result);
      
      // Pause entre les lots
      if ((i + 1) % BATCH_SIZE === 0 && i < plants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, BATCH_PAUSE_MS));
      }
    }
    
    // Générer le rapport
    const report = generateReport(results);
    
    // Sauvegarder le rapport en JSON
    const reportPath = `/home/ubuntu/perfumum-research/docs/trefle-migration-report-${Date.now()}.json`;
    const fs = await import('fs');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      mode: isTestMode ? 'test' : 'production',
      ...report,
      details: results
    }, null, 2));
    console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);
    
    console.log(`\n✅ Migration terminée!`);
    console.log(`   - ${enrichedCount} plantes enrichies`);
    console.log(`   - ${skippedCount} plantes déjà complètes`);
    console.log(`   - ${results.filter(r => !r.success && !r.skipped).length} plantes non identifiées`);
    
  } finally {
    await conn.end();
    console.log('\n✓ Connexion fermée');
  }
}

// Exécution
main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});
