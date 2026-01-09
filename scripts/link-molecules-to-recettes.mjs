/**
 * Script pour lier les molécules spécifiques (Geosmin, Indole, Vanilline, Pyrazine) aux recettes
 * Basé sur les profils olfactifs et les gammes de recettes
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL non définie');
  process.exit(1);
}

const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: true }
};

async function main() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('Connexion à la base de données...');
    
    // 1. Récupérer les molécules cibles
    const [targetMolecules] = await connection.query(`
      SELECT id, name, olfactiveProfile, family FROM molecules 
      WHERE name LIKE '%geosmin%' 
         OR name LIKE '%indole%' 
         OR name LIKE '%vanillin%' 
         OR name LIKE '%pyrazine%'
      ORDER BY name
    `);
    
    console.log(`\\nMolécules cibles trouvées: ${targetMolecules.length}`);
    targetMolecules.forEach(m => console.log(`  - ${m.name} (ID: ${m.id})`));
    
    // Si les molécules n'existent pas, les créer
    const moleculesToCreate = [];
    
    // Vérifier Geosmin
    const hasGeosmin = targetMolecules.some(m => m.name.toLowerCase().includes('geosmin'));
    if (!hasGeosmin) {
      moleculesToCreate.push({
        name: 'Géosmine',
        iupacName: '(4S,4aS,8aR)-4,8a-Dimethyldecahydronaphthalen-4a-ol',
        casNumber: '19700-21-1',
        chemicalFormula: 'C12H22O',
        family: 'Alcool bicyclique',
        chemicalClass: 'alcohol',
        olfactiveProfile: 'Terreux, humide, pétrichor, odeur de terre après la pluie, betterave',
        radarIntensity: 85,
        radarFreshness: 40,
        radarWarmth: 30,
        radarSweetness: 15,
        radarSpiciness: 10,
        radarEarthiness: 95
      });
    }
    
    // Vérifier Indole
    const hasIndole = targetMolecules.some(m => m.name.toLowerCase().includes('indole'));
    if (!hasIndole) {
      moleculesToCreate.push({
        name: 'Indole',
        iupacName: '1H-Indole',
        casNumber: '120-72-9',
        chemicalFormula: 'C8H7N',
        family: 'Hétérocycle azoté',
        chemicalClass: 'heterocyclic',
        olfactiveProfile: 'Floral intense, jasmin, animal, fécal à haute concentration, narcotique',
        radarIntensity: 90,
        radarFreshness: 25,
        radarWarmth: 60,
        radarSweetness: 45,
        radarSpiciness: 20,
        radarEarthiness: 40
      });
    }
    
    // Vérifier Vanilline
    const hasVanilline = targetMolecules.some(m => m.name.toLowerCase().includes('vanillin'));
    if (!hasVanilline) {
      moleculesToCreate.push({
        name: 'Vanilline',
        iupacName: '4-Hydroxy-3-methoxybenzaldehyde',
        casNumber: '121-33-5',
        chemicalFormula: 'C8H8O3',
        family: 'Aldéhyde phénolique',
        chemicalClass: 'aldehyde',
        olfactiveProfile: 'Vanille douce, crémeuse, balsamique, gourmande, chaude',
        radarIntensity: 80,
        radarFreshness: 20,
        radarWarmth: 75,
        radarSweetness: 95,
        radarSpiciness: 25,
        radarEarthiness: 30
      });
    }
    
    // Vérifier Pyrazine
    const hasPyrazine = targetMolecules.some(m => m.name.toLowerCase().includes('pyrazine'));
    if (!hasPyrazine) {
      moleculesToCreate.push({
        name: '2-Méthoxypyrazine',
        iupacName: '2-Methoxypyrazine',
        casNumber: '3149-28-8',
        chemicalFormula: 'C5H6N2O',
        family: 'Pyrazine',
        chemicalClass: 'heterocyclic',
        olfactiveProfile: 'Vert, poivron, terreux, légume, herbe coupée, pois',
        radarIntensity: 75,
        radarFreshness: 65,
        radarWarmth: 20,
        radarSweetness: 10,
        radarSpiciness: 35,
        radarEarthiness: 70
      });
    }
    
    // Créer les molécules manquantes
    if (moleculesToCreate.length > 0) {
      console.log(`\\nCréation de ${moleculesToCreate.length} molécules manquantes...`);
      
      for (const mol of moleculesToCreate) {
        const [result] = await connection.query(`
          INSERT INTO molecules (
            name, iupac_name, cas_number, chemicalFormula, family, chemical_class,
            olfactiveProfile, radar_intensity, radar_freshness, radar_warmth,
            radar_sweetness, radar_spiciness, radar_earthiness
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          mol.name, mol.iupacName, mol.casNumber, mol.chemicalFormula, mol.family, mol.chemicalClass,
          mol.olfactiveProfile, mol.radarIntensity, mol.radarFreshness, mol.radarWarmth,
          mol.radarSweetness, mol.radarSpiciness, mol.radarEarthiness
        ]);
        
        targetMolecules.push({ id: result.insertId, name: mol.name, olfactiveProfile: mol.olfactiveProfile });
        console.log(`✓ Molécule créée: ${mol.name} (ID: ${result.insertId})`);
      }
    }
    
    // 2. Récupérer toutes les recettes
    const [allRecettes] = await connection.query(`
      SELECT id, name, gamme, description, notes FROM recettes
    `);
    
    console.log(`\\nRecettes totales: ${allRecettes.length}`);
    
    // 3. Récupérer les liaisons existantes
    const [existingLinks] = await connection.query(`
      SELECT molecule_id, recette_id FROM molecules_recettes
    `);
    const existingSet = new Set(existingLinks.map(l => `${l.molecule_id}-${l.recette_id}`));
    
    // 4. Définir les règles d'association molécule-recette
    const moleculeRecetteRules = {
      // Géosmine - recettes terreuses, pétrichor, minérales
      'géosmine': {
        keywords: ['terre', 'terreux', 'pétrichor', 'minéral', 'humide', 'mousse', 'forêt', 'champignon', 'betterave', 'rain', 'pluie'],
        gammes: ['petrichor', 'volcanique', 'terroir'],
        percentage: { min: 0.001, max: 0.1 }
      },
      'geosmin': {
        keywords: ['terre', 'terreux', 'pétrichor', 'minéral', 'humide', 'mousse', 'forêt', 'champignon', 'betterave', 'rain', 'pluie'],
        gammes: ['petrichor', 'volcanique', 'terroir'],
        percentage: { min: 0.001, max: 0.1 }
      },
      // Indole - recettes florales, jasmin, tubéreuse
      'indole': {
        keywords: ['jasmin', 'tubéreuse', 'floral', 'narcisse', 'gardénia', 'fleur blanche', 'nuit', 'sensuel', 'animal'],
        gammes: ['signature', 'classique', 'floral'],
        percentage: { min: 0.01, max: 0.5 }
      },
      // Vanilline - recettes gourmandes, orientales, ambrées
      'vanilline': {
        keywords: ['vanille', 'gourmand', 'oriental', 'ambré', 'doux', 'crémeux', 'balsamique', 'chaud', 'sucré', 'boisé'],
        gammes: ['signature', 'oriental', 'gourmand', 'ambré'],
        percentage: { min: 0.5, max: 5 }
      },
      'vanillin': {
        keywords: ['vanille', 'gourmand', 'oriental', 'ambré', 'doux', 'crémeux', 'balsamique', 'chaud', 'sucré', 'boisé'],
        gammes: ['signature', 'oriental', 'gourmand', 'ambré'],
        percentage: { min: 0.5, max: 5 }
      },
      // Pyrazine - recettes vertes, herbacées
      'pyrazine': {
        keywords: ['vert', 'herbe', 'végétal', 'poivron', 'feuille', 'galbanum', 'frais', 'aromatique'],
        gammes: ['colombie', 'petrichor', 'vert', 'aromatique'],
        percentage: { min: 0.001, max: 0.05 }
      },
      'méthoxypyrazine': {
        keywords: ['vert', 'herbe', 'végétal', 'poivron', 'feuille', 'galbanum', 'frais', 'aromatique'],
        gammes: ['colombie', 'petrichor', 'vert', 'aromatique'],
        percentage: { min: 0.001, max: 0.05 }
      }
    };
    
    // 5. Créer les liaisons
    const newLinks = [];
    
    for (const molecule of targetMolecules) {
      const molNameLower = molecule.name.toLowerCase();
      
      // Trouver les règles applicables
      let rules = null;
      for (const [key, value] of Object.entries(moleculeRecetteRules)) {
        if (molNameLower.includes(key)) {
          rules = value;
          break;
        }
      }
      
      if (!rules) {
        console.log(`⚠ Pas de règles pour: ${molecule.name}`);
        continue;
      }
      
      console.log(`\\nRecherche de recettes pour: ${molecule.name}`);
      
      for (const recette of allRecettes) {
        const key = `${molecule.id}-${recette.id}`;
        if (existingSet.has(key)) continue;
        
        const recetteLower = `${recette.name || ''} ${recette.description || ''} ${recette.notes || ''} ${recette.gamme || ''}`.toLowerCase();
        
        // Vérifier les correspondances
        let score = 0;
        
        // Score par mots-clés
        for (const kw of rules.keywords) {
          if (recetteLower.includes(kw)) {
            score += 2;
          }
        }
        
        // Score par gamme
        if (recette.gamme && rules.gammes.some(g => recette.gamme.toLowerCase().includes(g))) {
          score += 3;
        }
        
        // Créer la liaison si score suffisant
        if (score >= 3) {
          const percentage = rules.percentage.min + Math.random() * (rules.percentage.max - rules.percentage.min);
          newLinks.push({
            moleculeId: molecule.id,
            moleculeName: molecule.name,
            recetteId: recette.id,
            recetteName: recette.name,
            percentage: Math.round(percentage * 1000) / 1000,
            role: score >= 5 ? 'c\u0153ur' : 'fond',
            score
          });
          existingSet.add(key);
        }
      }
    }
    
    // 6. Insérer les nouvelles liaisons
    console.log(`\\nCréation de ${newLinks.length} liaisons molécule-recette...`);
    
    let created = 0;
    for (const link of newLinks) {
      try {
        await connection.query(`
          INSERT INTO molecules_recettes (molecule_id, recette_id, proportion, role, notes)
          VALUES (?, ?, ?, ?, ?)
        `, [
          link.moleculeId, 
          link.recetteId, 
          link.percentage,
          link.role,
          `Association automatique (score: ${link.score})`
        ]);
        
        console.log(`✓ ${link.moleculeName} → ${link.recetteName} (${link.percentage}%, ${link.role})`);
        created++;
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`✗ Erreur:`, err.message);
        }
      }
    }
    
    // 7. Statistiques finales
    const [finalStats] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM molecules) as total_molecules,
        (SELECT COUNT(DISTINCT molecule_id) FROM molecules_recettes) as molecules_linked,
        (SELECT COUNT(*) FROM recettes) as total_recettes,
        (SELECT COUNT(DISTINCT recette_id) FROM molecules_recettes) as recettes_with_molecules,
        (SELECT COUNT(*) FROM molecules_recettes) as total_links
    `);
    
    console.log('\\n=== STATISTIQUES FINALES ===');
    console.log(`Liaisons créées: ${created}`);
    console.log(`Total molécules: ${finalStats[0].total_molecules}`);
    console.log(`Molécules liées: ${finalStats[0].molecules_linked}`);
    console.log(`Total recettes: ${finalStats[0].total_recettes}`);
    console.log(`Recettes avec molécules: ${finalStats[0].recettes_with_molecules}`);
    console.log(`Total liaisons: ${finalStats[0].total_links}`);
    console.log(`Couverture recettes: ${Math.round((finalStats[0].recettes_with_molecules / finalStats[0].total_recettes) * 100)}%`);
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

main();
