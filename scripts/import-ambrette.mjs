/**
 * Script d'import de la fiche encyclopédique Ambrette (Abelmoschus moschatus)
 * Données issues du fichier Pasted_content_22.txt
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('🌿 Import de la fiche Ambrette (Abelmoschus moschatus)...');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Vérifier si la plante existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM plants WHERE latin_name = ?',
      ['Abelmoschus moschatus']
    );
    
    if (existing.length > 0) {
      console.log('⚠️  La plante Ambrette existe déjà (ID:', existing[0].id, ')');
      return;
    }
    
    // Insérer la plante Ambrette
    const plantData = {
      name: 'Ambrette',
      latin_name: 'Abelmoschus moschatus',
      family: 'Malvaceae',
      description: `Plante herbacée annuelle ou bisannuelle originaire d'Asie tropicale. Les graines (graines musquées) sont utilisées en parfumerie pour leur odeur musquée caractéristique, rappelant le musc animal mais d'origine végétale.`,
      origin: 'Asie tropicale (Inde, Indonésie)',
      climatic_axis: 'bois',
      habitat: 'Régions tropicales et subtropicales humides',
      cultivation: 'Culture annuelle en climat chaud, sol bien drainé',
      harvest_period: 'Récolte des graines à maturité (automne)',
      parts_used: 'Graines (graines musquées)',
      extraction_method: 'Distillation à la vapeur, extraction CO2',
      olfactory_profile: 'Musqué, floral, légèrement fruité avec des notes de vin',
      therapeutic_properties: 'Antispasmodique, carminatif, aphrodisiaque traditionnel',
      traditional_uses: 'Parfumerie naturelle, médecine ayurvédique, aromatisation alimentaire',
      safety_notes: 'Généralement considéré comme sûr. Éviter pendant la grossesse.',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const [result] = await connection.execute(
      `INSERT INTO plants (name, latin_name, family, description, origin, climatic_axis, habitat, cultivation, harvest_period, parts_used, extraction_method, olfactory_profile, therapeutic_properties, traditional_uses, safety_notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plantData.name,
        plantData.latin_name,
        plantData.family,
        plantData.description,
        plantData.origin,
        plantData.climatic_axis,
        plantData.habitat,
        plantData.cultivation,
        plantData.harvest_period,
        plantData.parts_used,
        plantData.extraction_method,
        plantData.olfactory_profile,
        plantData.therapeutic_properties,
        plantData.traditional_uses,
        plantData.safety_notes,
        plantData.created_at,
        plantData.updated_at
      ]
    );
    
    const plantId = result.insertId;
    console.log('✅ Fiche Ambrette créée avec succès!');
    
    // Créer les états botaniques
    const botanicalStates = [
      {
        code: 'A',
        name: 'Graine sèche',
        description: 'Graine à l\'état naturel, séchée après récolte',
        olfactory_notes: 'Musqué léger, terreux, légèrement boisé',
        processing: 'Séchage naturel à l\'ombre'
      },
      {
        code: 'B', 
        name: 'Graine écrasée',
        description: 'Graine broyée pour libérer les huiles essentielles',
        olfactory_notes: 'Musqué intense, floral, notes de vin',
        processing: 'Broyage mécanique avant extraction'
      },
      {
        code: 'C',
        name: 'Graine humidifiée',
        description: 'Graine réhydratée pour optimiser l\'extraction',
        olfactory_notes: 'Musqué doux, fruité, notes florales accentuées',
        processing: 'Trempage dans l\'eau tiède avant distillation'
      }
    ];
    
    for (const state of botanicalStates) {
      await connection.execute(
        `INSERT INTO botanical_states (plant_id, code, name, description, olfactory_notes, processing, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [plantId, state.code, state.name, state.description, state.olfactory_notes, state.processing, new Date()]
      );
    }
    
    console.log('🔗 Vérification des liaisons avec les molécules...');
    
    // Molécules dominantes de l'Ambrette
    const dominantMolecules = ['Ambrettolide', 'Farnesol', 'Geraniol', 'Linalool'];
    
    for (const moleculeName of dominantMolecules) {
      const [molecules] = await connection.execute(
        'SELECT id FROM molecules WHERE name LIKE ?',
        [`%${moleculeName}%`]
      );
      
      if (molecules.length > 0) {
        // Créer la liaison plante-molécule
        await connection.execute(
          `INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, percentage, is_dominant, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [plantId, molecules[0].id, null, moleculeName === 'Ambrettolide' ? 1 : 0, new Date()]
        );
        console.log(`   ✓ ${moleculeName} trouvé (ID: ${molecules[0].id})`);
      } else {
        console.log(`   ⚠️  ${moleculeName} non trouvé dans la base - à créer manuellement`);
      }
    }
    
    console.log('📊 Résumé:');
    console.log(`   - ID de la plante: ${plantId}`);
    console.log(`   - Nom: ${plantData.name}`);
    console.log(`   - Nom latin: ${plantData.latin_name}`);
    console.log(`   - Famille: ${plantData.family}`);
    console.log(`   - Axe climatique: ${plantData.climatic_axis}`);
    console.log(`   - États botaniques: ${botanicalStates.length} (A, B, C)`);
    console.log(`   - Molécules dominantes: ${dominantMolecules.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

main();
