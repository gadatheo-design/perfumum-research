// Script d'import des relations molécule-plante et matières premières
// Ce script analyse les données existantes et crée les liaisons

import mysql from 'mysql2/promise';

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000'),
  user: process.env.DB_USER || '2sJjGKsGXVrCjQG.root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'perfumum_research',
  ssl: {
    rejectUnauthorized: true
  }
};

async function main() {
  console.log('🔗 Connexion à la base de données...');
  
  const connection = await mysql.createConnection(dbConfig);
  console.log('✅ Connecté à la base de données');

  try {
    // 1. Récupérer les plantes existantes
    console.log('\n📊 Analyse des plantes existantes...');
    const [plants] = await connection.execute('SELECT * FROM plants');
    console.log(`   Trouvé ${plants.length} plantes`);

    // 2. Récupérer les molécules existantes
    console.log('\n📊 Analyse des molécules existantes...');
    const [molecules] = await connection.execute('SELECT * FROM molecules');
    console.log(`   Trouvé ${molecules.length} molécules`);

    // 3. Récupérer les terroirs existants
    console.log('\n📊 Analyse des terroirs existants...');
    const [terroirs] = await connection.execute('SELECT * FROM terroirs');
    console.log(`   Trouvé ${terroirs.length} terroirs`);

    // 4. Créer des matières premières à partir des plantes
    console.log('\n🌿 Création des matières premières...');
    
    const rawMaterialsToCreate = [];
    
    for (const plant of plants) {
      // Créer une huile essentielle pour chaque plante
      const materialId = `HE-${plant.plantId || plant.id}`;
      
      // Vérifier si la matière première existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM raw_materials WHERE material_id = ?',
        [materialId]
      );
      
      if (existing.length === 0) {
        rawMaterialsToCreate.push({
          materialId,
          name: `Huile essentielle de ${plant.name}`,
          latinName: plant.latinName,
          category: 'huile_essentielle',
          plantId: plant.id,
          plantPart: plant.botanicalStates ? 'plante_entiere' : 'feuille',
          originCountry: plant.originCountry || null,
          originRegion: plant.originRegion || null,
          olfactiveFamily: mapOlfactiveFamily(plant.category),
          olfactiveProfile: plant.olfactiveProfile || null,
          notes: `Matière première générée automatiquement à partir de la plante ${plant.name}`
        });
      }
    }

    // Insérer les matières premières
    for (const rm of rawMaterialsToCreate) {
      try {
        await connection.execute(
          `INSERT INTO raw_materials 
           (material_id, name, latin_name, category, plant_id, plant_part, 
            origin_country, origin_region, olfactive_family, olfactive_profile, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [rm.materialId, rm.name, rm.latinName, rm.category, rm.plantId, rm.plantPart,
           rm.originCountry, rm.originRegion, rm.olfactiveFamily, rm.olfactiveProfile, rm.notes]
        );
        console.log(`   ✅ Créé: ${rm.name}`);
      } catch (err) {
        console.log(`   ⚠️ Erreur pour ${rm.name}: ${err.message}`);
      }
    }

    console.log(`\n   Total: ${rawMaterialsToCreate.length} matières premières créées`);

    // 5. Créer des relations molécule-plante basées sur les données existantes
    console.log('\n🔬 Création des relations molécule-plante...');
    
    // Analyser les molécules qui ont des informations de source
    let relationsCreated = 0;
    
    for (const molecule of molecules) {
      // Chercher des plantes qui pourraient contenir cette molécule
      // basé sur la famille olfactive ou le nom
      const moleculeName = molecule.name.toLowerCase();
      
      for (const plant of plants) {
        const plantName = plant.name.toLowerCase();
        const latinName = (plant.latinName || '').toLowerCase();
        
        // Logique de correspondance basique
        let shouldLink = false;
        let percentage = null;
        let isMainSource = 0;
        
        // Correspondances connues
        if (moleculeName.includes('linalol') && (plantName.includes('lavande') || latinName.includes('lavandula'))) {
          shouldLink = true;
          percentage = '25-45';
          isMainSource = 1;
        } else if (moleculeName.includes('limonene') && (plantName.includes('citron') || plantName.includes('orange') || latinName.includes('citrus'))) {
          shouldLink = true;
          percentage = '65-95';
          isMainSource = 1;
        } else if (moleculeName.includes('myrcene') && (plantName.includes('cannabis') || plantName.includes('houblon'))) {
          shouldLink = true;
          percentage = '20-50';
          isMainSource = 1;
        } else if (moleculeName.includes('pinene') && (plantName.includes('pin') || plantName.includes('sapin') || latinName.includes('pinus'))) {
          shouldLink = true;
          percentage = '30-60';
          isMainSource = 1;
        } else if (moleculeName.includes('caryophyllene') && (plantName.includes('cannabis') || plantName.includes('girofle'))) {
          shouldLink = true;
          percentage = '10-30';
        } else if (moleculeName.includes('eugenol') && (plantName.includes('girofle') || plantName.includes('basilic'))) {
          shouldLink = true;
          percentage = '70-90';
          isMainSource = 1;
        } else if (moleculeName.includes('menthol') && plantName.includes('menthe')) {
          shouldLink = true;
          percentage = '30-50';
          isMainSource = 1;
        } else if (moleculeName.includes('thymol') && plantName.includes('thym')) {
          shouldLink = true;
          percentage = '20-60';
          isMainSource = 1;
        } else if (moleculeName.includes('carvacrol') && (plantName.includes('origan') || plantName.includes('thym'))) {
          shouldLink = true;
          percentage = '60-80';
          isMainSource = 1;
        } else if (moleculeName.includes('geraniol') && (plantName.includes('geranium') || plantName.includes('rose'))) {
          shouldLink = true;
          percentage = '15-40';
        } else if (moleculeName.includes('citronellol') && (plantName.includes('geranium') || plantName.includes('rose'))) {
          shouldLink = true;
          percentage = '20-35';
        }
        
        if (shouldLink) {
          // Vérifier si la relation existe déjà
          const [existingLink] = await connection.execute(
            'SELECT id FROM molecule_plant_sources WHERE molecule_id = ? AND plant_id = ?',
            [molecule.id, plant.id]
          );
          
          if (existingLink.length === 0) {
            try {
              await connection.execute(
                `INSERT INTO molecule_plant_sources 
                 (molecule_id, plant_id, percentage_in_oil, is_main_source, variability, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 'variable', NOW(), NOW())`,
                [molecule.id, plant.id, percentage, isMainSource]
              );
              relationsCreated++;
              console.log(`   ✅ Lié: ${molecule.name} ↔ ${plant.name} (${percentage}%)`);
            } catch (err) {
              console.log(`   ⚠️ Erreur: ${err.message}`);
            }
          }
        }
      }
    }
    
    console.log(`\n   Total: ${relationsCreated} relations molécule-plante créées`);

    // 6. Créer des spécialités de terroir
    console.log('\n🌍 Création des spécialités de terroir...');
    
    let terroirSpecialtiesCreated = 0;
    
    for (const plant of plants) {
      // Trouver le terroir correspondant à l'origine de la plante
      for (const terroir of terroirs) {
        const terroirName = terroir.name.toLowerCase();
        const terroirCountry = (terroir.country || '').toLowerCase();
        const plantCountry = (plant.originCountry || '').toLowerCase();
        const plantRegion = (plant.originRegion || '').toLowerCase();
        
        let shouldLink = false;
        let isSignature = 0;
        let importance = 'significative';
        
        // Correspondances géographiques
        if (plantCountry && (terroirCountry.includes(plantCountry) || terroirName.includes(plantCountry))) {
          shouldLink = true;
        } else if (plantRegion && terroirName.includes(plantRegion)) {
          shouldLink = true;
          isSignature = 1;
          importance = 'majeure';
        }
        
        if (shouldLink) {
          // Vérifier si la spécialité existe déjà
          const [existingSpec] = await connection.execute(
            'SELECT id FROM terroir_specialties WHERE terroir_id = ? AND plant_id = ?',
            [terroir.id, plant.id]
          );
          
          if (existingSpec.length === 0) {
            try {
              await connection.execute(
                `INSERT INTO terroir_specialties 
                 (terroir_id, plant_id, is_signature, importance, created_at, updated_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [terroir.id, plant.id, isSignature, importance]
              );
              terroirSpecialtiesCreated++;
              console.log(`   ✅ Lié: ${terroir.name} ↔ ${plant.name}`);
            } catch (err) {
              console.log(`   ⚠️ Erreur: ${err.message}`);
            }
          }
        }
      }
    }
    
    console.log(`\n   Total: ${terroirSpecialtiesCreated} spécialités de terroir créées`);

    // 7. Résumé final
    console.log('\n📈 Résumé de l\'import:');
    console.log(`   • Matières premières créées: ${rawMaterialsToCreate.length}`);
    console.log(`   • Relations molécule-plante: ${relationsCreated}`);
    console.log(`   • Spécialités de terroir: ${terroirSpecialtiesCreated}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await connection.end();
    console.log('\n🔒 Connexion fermée');
  }
}

// Fonction pour mapper les catégories de plantes aux familles olfactives
function mapOlfactiveFamily(category) {
  const mapping = {
    'aromatique': 'aromatique',
    'tabac': 'fumé',
    'cannabis': 'herbace',
    'resine': 'balsamique',
    'bois': 'boise',
    'fleur': 'floral',
    'racine': 'terreux',
    'agrume': 'agrume',
    'epice': 'epice'
  };
  return mapping[category] || 'autre';
}

main().catch(console.error);
