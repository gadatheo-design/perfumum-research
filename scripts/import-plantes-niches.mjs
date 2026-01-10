/**
 * Script d'import des plantes de niche depuis plantes_niches.json
 * 
 * Ce script importe les plantes de niche (psychoactives, résines, historiques, médicinales)
 * dans la base de données PERFUMUM.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger le fichier JSON
const jsonPath = path.join(__dirname, '..', 'plantes_niches.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Mapper les catégories du JSON vers les catégories de la base de données
function mapCategory(sectionName, plantData) {
  const sectionLower = sectionName.toLowerCase();
  
  if (sectionLower.includes('alcaloïdes') || sectionLower.includes('psychoactifs')) {
    return 'autre'; // Plantes psychoactives
  }
  if (sectionLower.includes('résines') || sectionLower.includes('aromatiques')) {
    if (plantData.partie_utilisee?.toLowerCase().includes('résine') || 
        plantData.partie_utilisee?.toLowerCase().includes('baume')) {
      return 'resine';
    }
    if (plantData.partie_utilisee?.toLowerCase().includes('bois')) {
      return 'bois';
    }
    if (plantData.partie_utilisee?.toLowerCase().includes('fleur')) {
      return 'fleur';
    }
    return 'aromatique';
  }
  if (sectionLower.includes('disparues') || sectionLower.includes('historiques')) {
    return 'autre';
  }
  if (sectionLower.includes('médicinales') || sectionLower.includes('terpéniques')) {
    return 'aromatique';
  }
  return 'autre';
}

// Mapper l'axe climatique basé sur le type de plante
function mapClimaticAxis(sectionName, plantData) {
  const sectionLower = sectionName.toLowerCase();
  
  if (sectionLower.includes('disparues') || sectionLower.includes('historiques')) {
    return 'disparition';
  }
  if (plantData.region?.toLowerCase().includes('amazonie') || 
      plantData.region?.toLowerCase().includes('forêt')) {
    return 'bois';
  }
  return null;
}

// Transformer une plante du JSON vers le format de la base de données
function transformPlant(sectionName, plantData) {
  const category = mapCategory(sectionName, plantData);
  const climaticAxis = mapClimaticAxis(sectionName, plantData);
  
  return {
    name: plantData.titre?.split('(')[0]?.trim() || plantData.nom_scientifique?.split(' ')[0] || 'Inconnu',
    latinName: plantData.nom_scientifique || null,
    family: plantData.famille || null,
    category: category,
    origin: plantData.region || null,
    habitat: null,
    olfactiveSignature: plantData.profil_olfactif !== '-' ? plantData.profil_olfactif : null,
    dominantMolecules: plantData.composes_cles || null,
    traditionalUse: plantData.usages_traditionnels || null,
    climaticAxis: climaticAxis,
    notes: `Source: ${plantData.url || 'N/A'}. Partie utilisée: ${plantData.partie_utilisee || 'N/A'}. Type: ${plantData.type || 'Plante'}.`,
    validationStatus: 'valide',
  };
}

// Générer les données SQL pour l'import
function generateInsertStatements() {
  const plants = [];
  
  for (const [sectionName, sectionPlants] of Object.entries(data)) {
    for (const plantData of sectionPlants) {
      const plant = transformPlant(sectionName, plantData);
      plants.push(plant);
    }
  }
  
  return plants;
}

// Afficher les résultats
const plants = generateInsertStatements();

console.log('='.repeat(80));
console.log('IMPORT DES PLANTES DE NICHE');
console.log('='.repeat(80));
console.log(`\nNombre total de plantes à importer: ${plants.length}\n`);

// Grouper par catégorie
const byCategory = {};
plants.forEach(p => {
  byCategory[p.category] = (byCategory[p.category] || 0) + 1;
});

console.log('Répartition par catégorie:');
for (const [cat, count] of Object.entries(byCategory)) {
  console.log(`  - ${cat}: ${count}`);
}

console.log('\n' + '='.repeat(80));
console.log('LISTE DES PLANTES À IMPORTER:');
console.log('='.repeat(80));

plants.forEach((p, i) => {
  console.log(`\n${i + 1}. ${p.name}`);
  console.log(`   Nom latin: ${p.latinName || 'N/A'}`);
  console.log(`   Famille: ${p.family || 'N/A'}`);
  console.log(`   Catégorie: ${p.category}`);
  console.log(`   Origine: ${p.origin || 'N/A'}`);
  console.log(`   Profil olfactif: ${p.olfactiveSignature || 'N/A'}`);
});

// Exporter les données en JSON pour l'import via l'API
const outputPath = path.join(__dirname, '..', 'plantes_niches_transformed.json');
fs.writeFileSync(outputPath, JSON.stringify(plants, null, 2));
console.log(`\n\nDonnées transformées exportées vers: ${outputPath}`);
