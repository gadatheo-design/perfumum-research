/**
 * Script d'import pour Nardostachys (Nard / Spikenard)
 * Source: Wikipedia - https://en.wikipedia.org/wiki/Nardostachys
 * Date: 05 janvier 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL non définie');
  process.exit(1);
}

async function importNardostachys() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🌿 Import de Nardostachys (Nard / Spikenard)...\n');
    
    // 1. Ajouter la plante Nardostachys
    const plantData = {
      name: 'Nard (Spikenard)',
      latinName: 'Nardostachys jatamansi',
      family: 'Caprifoliaceae (Valerianoideae)',
      category: 'racine', // Les rhizomes sont utilisés
      origin: 'Himalaya (Kumaon, Népal, Sikkim, Bhoutan, Myanmar, Chine)',
      habitat: 'Altitude 3000-5000m dans les montagnes himalayennes',
      olfactiveSignature: 'Huile essentielle intensément aromatique, couleur ambre, consistance très épaisse. Notes terreuses, musquées, balsamiques avec des facettes animales.',
      dominantMolecules: JSON.stringify([
        'Nardosinone',
        'Acide ursolique',
        'Acide oléanolique',
        'β-sitostérol',
        'Octacosanol',
        'Acaciine',
        'Aristolen-9β-ol',
        'Kanshone A',
        'Nardosinonediol'
      ]),
      chemotypes: 'Espèce monotypique (Nardostachys jatamansi est la seule espèce du genre)',
      traditionalUse: 'Parfumerie depuis l\'Antiquité, encens pour cérémonies religieuses, médecine traditionnelle (sédatif, insomnie, aide à l\'accouchement), aromathérapie (rhumes, toux, congestion nasale)',
      absorbeUse: 'Potentiel pour les axes Bois et Disparition - notes terreuses profondes, caractère méditatif et spirituel',
      notes: `Classification taxonomique complète:
- Règne: Plantae
- Clade: Tracheophytes, Angiosperms, Eudicots, Asterids
- Ordre: Dipsacales
- Famille: Caprifoliaceae
- Sous-famille: Valerianoideae
- Genre: Nardostachys DC. (1830)
- Espèce: N. jatamansi (D.Don) DC. (1830)

Synonymes: Nardostachys grandiflora, Patrinia jatamansi, Valeriana jatamansi

Statut de conservation: EN DANGER CRITIQUE (IUCN), CITES Annexe II
Menaces: Surexploitation, surpâturage, perte d'habitat, dégradation forestière

Description: Plante vivace de 10-50 cm, fleurs roses en forme de cloche. Les rhizomes sont distillés pour produire l'huile essentielle.

Source: Wikipedia (https://en.wikipedia.org/wiki/Nardostachys)
Date d'import: 05 janvier 2026`
    };
    
    const [plantResult] = await connection.execute(
      `INSERT INTO plants (name, latin_name, family, category, origin, habitat, olfactive_signature, dominant_molecules, chemotypes, traditional_use, absorbe_use, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        plantData.name,
        plantData.latinName,
        plantData.family,
        plantData.category,
        plantData.origin,
        plantData.habitat,
        plantData.olfactiveSignature,
        plantData.dominantMolecules,
        plantData.chemotypes,
        plantData.traditionalUse,
        plantData.absorbeUse,
        plantData.notes
      ]
    );
    
    const plantId = plantResult.insertId;
    console.log(`✅ Plante créée: ${plantData.name} (ID: ${plantId})`);
    
    // 2. Ajouter les molécules associées si elles n'existent pas déjà
    const molecules = [
      {
        name: 'Nardosinone',
        family: 'Sesquiterpène',
        chemicalClass: 'sesquiterpene',
        olfactiveProfile: 'Notes terreuses, musquées, caractéristiques du nard',
        sourceOrigin: 'Nardostachys jatamansi (rhizomes)',
        notes: 'Composé caractéristique du nard, responsable de son odeur distinctive'
      },
      {
        name: 'Acide ursolique',
        iupacName: '(1S,2R,4aS,6aR,6aS,6bR,8aR,10S,12aR,14bS)-10-hydroxy-1,2,6a,6b,9,9,12a-heptamethyl-2,3,4,5,6,6a,7,8,8a,10,11,12,13,14b-tetradecahydro-1H-picene-4a-carboxylic acid',
        casNumber: '77-52-1',
        family: 'Triterpène',
        chemicalClass: 'other',
        chemicalFormula: 'C30H48O3',
        olfactiveProfile: 'Peu odorant, composé cristallin',
        sourceOrigin: 'Nardostachys jatamansi, romarin, thym, lavande, pommes',
        notes: 'Triterpène pentacyclique aux propriétés anti-inflammatoires et antioxydantes'
      },
      {
        name: 'Acide oléanolique',
        iupacName: '(4aS,6aR,6aS,6bR,8aR,10S,12aR,14bS)-10-hydroxy-2,2,6a,6b,9,9,12a-heptamethyl-1,3,4,5,6,6a,7,8,8a,10,11,12,13,14b-tetradecahydropicene-4a-carboxylic acid',
        casNumber: '508-02-1',
        family: 'Triterpène',
        chemicalClass: 'other',
        chemicalFormula: 'C30H48O3',
        olfactiveProfile: 'Peu odorant',
        sourceOrigin: 'Nardostachys jatamansi, olive, raisin',
        notes: 'Triterpène pentacyclique présent dans de nombreuses plantes médicinales'
      },
      {
        name: 'β-sitostérol',
        iupacName: '(3S,8S,9S,10R,13R,14S,17R)-17-[(2R,5R)-5-ethyl-6-methylheptan-2-yl]-10,13-dimethyl-2,3,4,7,8,9,11,12,14,15,16,17-dodecahydro-1H-cyclopenta[a]phenanthren-3-ol',
        casNumber: '83-46-5',
        family: 'Phytostérol',
        chemicalClass: 'other',
        chemicalFormula: 'C29H50O',
        olfactiveProfile: 'Inodore',
        sourceOrigin: 'Nardostachys jatamansi, huiles végétales, graines',
        notes: 'Phytostérol le plus abondant dans le règne végétal'
      },
      {
        name: 'Octacosanol',
        casNumber: '557-61-9',
        family: 'Alcool gras',
        chemicalClass: 'alcohol',
        chemicalFormula: 'C28H58O',
        olfactiveProfile: 'Cireux, légèrement gras',
        sourceOrigin: 'Nardostachys jatamansi, canne à sucre, son de riz',
        notes: 'Alcool gras à longue chaîne (C28), présent dans les cires végétales'
      },
      {
        name: 'Acaciine',
        family: 'Flavonoïde',
        chemicalClass: 'other',
        olfactiveProfile: 'Peu odorant',
        sourceOrigin: 'Nardostachys jatamansi, acacia',
        notes: 'Flavonoïde glycoside aux propriétés antioxydantes'
      },
      {
        name: 'Aristolen-9β-ol',
        family: 'Sesquiterpène',
        chemicalClass: 'sesquiterpene',
        olfactiveProfile: 'Notes boisées, terreuses',
        sourceOrigin: 'Nardostachys jatamansi',
        notes: 'Sesquiterpénol caractéristique du nard'
      },
      {
        name: 'Kanshone A',
        family: 'Sesquiterpène',
        chemicalClass: 'sesquiterpene',
        olfactiveProfile: 'Notes caractéristiques du nard',
        sourceOrigin: 'Nardostachys jatamansi',
        notes: 'Sesquiterpène cétonique isolé du nard'
      },
      {
        name: 'Nardosinonediol',
        family: 'Sesquiterpène',
        chemicalClass: 'sesquiterpene',
        olfactiveProfile: 'Notes terreuses, musquées',
        sourceOrigin: 'Nardostachys jatamansi',
        notes: 'Dérivé diol du nardosinone'
      }
    ];
    
    let moleculesCreated = 0;
    let moleculesExisting = 0;
    const moleculeIds = [];
    
    for (const mol of molecules) {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  Molécule existante: ${mol.name}`);
        moleculesExisting++;
        moleculeIds.push({ name: mol.name, id: existing[0].id });
      } else {
        // Créer la molécule
        const [result] = await connection.execute(
          `INSERT INTO molecules (name, iupac_name, cas_number, family, chemical_class, chemicalFormula, olfactiveProfile, sourceOrigin, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            mol.name,
            mol.iupacName || null,
            mol.casNumber || null,
            mol.family || null,
            mol.chemicalClass || null,
            mol.chemicalFormula || null,
            mol.olfactiveProfile || null,
            mol.sourceOrigin || null,
            mol.notes || null
          ]
        );
        console.log(`  ✅ Molécule créée: ${mol.name} (ID: ${result.insertId})`);
        moleculesCreated++;
        moleculeIds.push({ name: mol.name, id: result.insertId });
      }
    }
    
    // 3. Créer les liens plante-molécules
    console.log('\n📎 Création des liens plante-molécules...');
    let linksCreated = 0;
    
    for (const mol of moleculeIds) {
      try {
        await connection.execute(
          `INSERT INTO plant_molecules (plant_id, molecule_id, role, percentage, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            plantId,
            mol.id,
            'majeur',
            null,
            `Molécule présente dans Nardostachys jatamansi`
          ]
        );
        linksCreated++;
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`  ⏭️  Lien existant: ${mol.name}`);
        } else {
          throw err;
        }
      }
    }
    
    // 4. Ajouter une entrée bibliographique
    console.log('\n📚 Ajout de la référence bibliographique...');
    
    const [bibResult] = await connection.execute(
      `INSERT INTO bibliographic_sources (title, authors, year, source_type, url, abstract, keywords, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        'Nardostachys - Wikipedia',
        'Wikipedia contributors',
        2026,
        'database',
        'https://en.wikipedia.org/wiki/Nardostachys',
        'Article encyclopédique sur le genre Nardostachys (nard/spikenard), plante vivace de la famille des Caprifoliaceae utilisée en parfumerie et médecine traditionnelle depuis l\'Antiquité.',
        JSON.stringify(['nard', 'spikenard', 'Nardostachys jatamansi', 'huile essentielle', 'parfumerie', 'Himalaya', 'médecine traditionnelle']),
        'Source Wikipedia consultée le 05 janvier 2026. Statut IUCN: En danger critique. CITES Annexe II.'
      ]
    );
    
    console.log(`✅ Référence bibliographique créée (ID: ${bibResult.insertId})`);
    
    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE L\'IMPORT');
    console.log('='.repeat(60));
    console.log(`🌿 Plante créée: 1 (Nardostachys jatamansi)`);
    console.log(`🧪 Molécules créées: ${moleculesCreated}`);
    console.log(`🧪 Molécules existantes: ${moleculesExisting}`);
    console.log(`📎 Liens plante-molécules: ${linksCreated}`);
    console.log(`📚 Référence bibliographique: 1`);
    console.log('='.repeat(60));
    console.log('✅ Import terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

importNardostachys().catch(console.error);
