// Script d'import des relations molécule-plante et matières premières
// Ce script utilise les mêmes variables d'environnement que le serveur

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import { eq, and, like, sql } from 'drizzle-orm';

// Utiliser DATABASE_URL comme le serveur
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL non définie. Exécutez ce script avec les variables d\'environnement du serveur.');
  process.exit(1);
}

async function main() {
  console.log('🔗 Connexion à la base de données...');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });
  
  console.log('✅ Connecté à la base de données');

  try {
    // 1. Récupérer les plantes existantes
    console.log('\n📊 Analyse des plantes existantes...');
    const plants = await db.select().from(schema.plants);
    console.log(`   Trouvé ${plants.length} plantes`);

    // 2. Récupérer les molécules existantes
    console.log('\n📊 Analyse des molécules existantes...');
    const molecules = await db.select().from(schema.molecules);
    console.log(`   Trouvé ${molecules.length} molécules`);

    // 3. Récupérer les terroirs existants
    console.log('\n📊 Analyse des terroirs existants...');
    const terroirs = await db.select().from(schema.terroirs);
    console.log(`   Trouvé ${terroirs.length} terroirs`);

    // 4. Créer des matières premières à partir des plantes
    console.log('\n🌿 Création des matières premières...');
    
    let rawMaterialsCreated = 0;
    
    for (const plant of plants) {
      const materialId = `HE-${plant.plantId || plant.id}`;
      
      // Vérifier si la matière première existe déjà
      const existing = await db.select()
        .from(schema.rawMaterials)
        .where(eq(schema.rawMaterials.materialId, materialId));
      
      if (existing.length === 0) {
        try {
          await db.insert(schema.rawMaterials).values({
            materialId,
            name: `Huile essentielle de ${plant.name}`,
            latinName: plant.latinName,
            category: 'huile_essentielle',
            plantId: plant.id,
            plantPart: 'feuille',
            originCountry: plant.originCountry || null,
            originRegion: plant.originRegion || null,
            olfactiveFamily: mapOlfactiveFamily(plant.category),
            olfactiveProfile: plant.olfactiveProfile || null,
            notes: `Matière première générée automatiquement à partir de la plante ${plant.name}`
          });
          rawMaterialsCreated++;
          console.log(`   ✅ Créé: Huile essentielle de ${plant.name}`);
        } catch (err) {
          console.log(`   ⚠️ Erreur pour ${plant.name}: ${err.message}`);
        }
      }
    }

    console.log(`\n   Total: ${rawMaterialsCreated} matières premières créées`);

    // 5. Créer des relations molécule-plante
    console.log('\n🔬 Création des relations molécule-plante...');
    
    // Définir les correspondances connues
    const knownRelations = [
      { moleculePattern: 'linalol', plantPattern: ['lavande', 'lavandula'], percentage: '25-45', isMain: 1 },
      { moleculePattern: 'limonene', plantPattern: ['citron', 'orange', 'citrus'], percentage: '65-95', isMain: 1 },
      { moleculePattern: 'myrcene', plantPattern: ['cannabis', 'houblon'], percentage: '20-50', isMain: 1 },
      { moleculePattern: 'pinene', plantPattern: ['pin', 'sapin', 'pinus'], percentage: '30-60', isMain: 1 },
      { moleculePattern: 'caryophyllene', plantPattern: ['cannabis', 'girofle'], percentage: '10-30', isMain: 0 },
      { moleculePattern: 'eugenol', plantPattern: ['girofle', 'basilic'], percentage: '70-90', isMain: 1 },
      { moleculePattern: 'menthol', plantPattern: ['menthe'], percentage: '30-50', isMain: 1 },
      { moleculePattern: 'thymol', plantPattern: ['thym'], percentage: '20-60', isMain: 1 },
      { moleculePattern: 'carvacrol', plantPattern: ['origan', 'thym'], percentage: '60-80', isMain: 1 },
      { moleculePattern: 'geraniol', plantPattern: ['geranium', 'rose'], percentage: '15-40', isMain: 0 },
      { moleculePattern: 'citronellol', plantPattern: ['geranium', 'rose'], percentage: '20-35', isMain: 0 },
      { moleculePattern: 'humulene', plantPattern: ['houblon', 'cannabis'], percentage: '15-30', isMain: 0 },
      { moleculePattern: 'terpinolene', plantPattern: ['cannabis', 'sauge'], percentage: '5-15', isMain: 0 },
      { moleculePattern: 'ocimene', plantPattern: ['basilic', 'cannabis'], percentage: '3-10', isMain: 0 },
      { moleculePattern: 'bisabolol', plantPattern: ['camomille', 'cannabis'], percentage: '5-20', isMain: 0 },
      { moleculePattern: 'farnesene', plantPattern: ['pomme', 'cannabis'], percentage: '2-10', isMain: 0 },
      { moleculePattern: 'nerolidol', plantPattern: ['neroli', 'cannabis'], percentage: '1-5', isMain: 0 },
      { moleculePattern: 'guaiol', plantPattern: ['guaiac', 'cannabis'], percentage: '1-5', isMain: 0 },
      { moleculePattern: 'valencene', plantPattern: ['orange', 'citrus'], percentage: '0.5-2', isMain: 0 },
      { moleculePattern: 'sabinene', plantPattern: ['genévrier', 'poivre'], percentage: '5-15', isMain: 0 },
      { moleculePattern: 'terpineol', plantPattern: ['eucalyptus', 'tea tree'], percentage: '10-30', isMain: 0 },
      { moleculePattern: 'eucalyptol', plantPattern: ['eucalyptus', 'romarin'], percentage: '50-80', isMain: 1 },
      { moleculePattern: 'camphor', plantPattern: ['camphre', 'romarin'], percentage: '10-30', isMain: 0 },
      { moleculePattern: 'borneol', plantPattern: ['romarin', 'lavande'], percentage: '5-15', isMain: 0 },
    ];
    
    let relationsCreated = 0;
    
    for (const molecule of molecules) {
      const moleculeName = molecule.name.toLowerCase();
      
      for (const relation of knownRelations) {
        if (moleculeName.includes(relation.moleculePattern)) {
          for (const plant of plants) {
            const plantName = plant.name.toLowerCase();
            const latinName = (plant.latinName || '').toLowerCase();
            
            const matches = relation.plantPattern.some(pattern => 
              plantName.includes(pattern) || latinName.includes(pattern)
            );
            
            if (matches) {
              // Vérifier si la relation existe déjà
              const existingLink = await db.select()
                .from(schema.moleculePlantSources)
                .where(and(
                  eq(schema.moleculePlantSources.moleculeId, molecule.id),
                  eq(schema.moleculePlantSources.plantId, plant.id)
                ));
              
              if (existingLink.length === 0) {
                try {
                  await db.insert(schema.moleculePlantSources).values({
                    moleculeId: molecule.id,
                    plantId: plant.id,
                    percentageInOil: relation.percentage,
                    isMainSource: relation.isMain,
                    variability: 'variable'
                  });
                  relationsCreated++;
                  console.log(`   ✅ Lié: ${molecule.name} ↔ ${plant.name} (${relation.percentage}%)`);
                } catch (err) {
                  console.log(`   ⚠️ Erreur: ${err.message}`);
                }
              }
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
      for (const terroir of terroirs) {
        const terroirName = (terroir.name || '').toLowerCase();
        const terroirCountry = (terroir.country || '').toLowerCase();
        const plantCountry = (plant.originCountry || '').toLowerCase();
        const plantRegion = (plant.originRegion || '').toLowerCase();
        
        let shouldLink = false;
        let isSignature = 0;
        let importance = 'significative';
        
        // Correspondances géographiques
        if (plantCountry && plantCountry.length > 2) {
          if (terroirCountry.includes(plantCountry) || terroirName.includes(plantCountry)) {
            shouldLink = true;
          }
        }
        if (plantRegion && plantRegion.length > 2) {
          if (terroirName.includes(plantRegion)) {
            shouldLink = true;
            isSignature = 1;
            importance = 'majeure';
          }
        }
        
        if (shouldLink) {
          const existingSpec = await db.select()
            .from(schema.terroirSpecialties)
            .where(and(
              eq(schema.terroirSpecialties.terroirId, terroir.id),
              eq(schema.terroirSpecialties.plantId, plant.id)
            ));
          
          if (existingSpec.length === 0) {
            try {
              await db.insert(schema.terroirSpecialties).values({
                terroirId: terroir.id,
                plantId: plant.id,
                isSignature,
                importance
              });
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
    console.log(`   • Matières premières créées: ${rawMaterialsCreated}`);
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
