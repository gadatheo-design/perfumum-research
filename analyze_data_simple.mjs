/**
 * Script d'analyse simple des données PERFUMUM
 * Utilise l'API tRPC pour récupérer et analyser les données
 */

const API_BASE = 'http://localhost:3000/api/trpc';

async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  const data = await response.json();
  return data.result?.data?.json || [];
}

async function analyzeDatabase() {
  console.log('='.repeat(80));
  console.log('ANALYSE DE LA BASE DE DONNÉES PERFUMUM');
  console.log('='.repeat(80));

  try {
    // Récupérer toutes les molécules
    console.log('\n⏳ Récupération des molécules...');
    const molecules = await fetchData('molecules.list');
    
    // Récupérer toutes les recettes
    console.log('⏳ Récupération des recettes...');
    const recettes = await fetchData('recettes.list');

    // 1. Statistiques générales
    console.log('\n\n📊 STATISTIQUES GÉNÉRALES');
    console.log('-'.repeat(80));
    console.log(`Total molécules: ${molecules.length}`);
    console.log(`Total recettes: ${recettes.length}`);

    // Compter les liaisons
    let totalLinks = 0;
    recettes.forEach(r => {
      if (r.molecules && Array.isArray(r.molecules)) {
        totalLinks += r.molecules.length;
      }
    });
    console.log(`Total liaisons molécules-recettes: ${totalLinks}`);
    
    if (recettes.length > 0) {
      const avg = totalLinks / recettes.length;
      console.log(`Moyenne molécules par recette: ${avg.toFixed(2)}`);
    }

    // 2. Distribution des molécules par famille
    console.log('\n\n📊 DISTRIBUTION DES MOLÉCULES PAR FAMILLE CHIMIQUE (Top 20)');
    console.log('-'.repeat(80));
    
    const familyCount = {};
    molecules.forEach(m => {
      if (m.family && m.family.trim() !== '') {
        familyCount[m.family] = (familyCount[m.family] || 0) + 1;
      }
    });
    
    const sortedFamilies = Object.entries(familyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    sortedFamilies.forEach(([family, count]) => {
      const percentage = (count / molecules.length) * 100;
      console.log(`${family.padEnd(40)} ${count.toString().padStart(4)} (${percentage.toFixed(2)}%)`);
    });

    // 3. Distribution des recettes par gamme
    console.log('\n\n📊 DISTRIBUTION DES RECETTES PAR GAMME');
    console.log('-'.repeat(80));
    
    const gammeCount = {};
    recettes.forEach(r => {
      if (r.gamme && r.gamme.trim() !== '') {
        gammeCount[r.gamme] = (gammeCount[r.gamme] || 0) + 1;
      }
    });
    
    const sortedGammes = Object.entries(gammeCount)
      .sort((a, b) => b[1] - a[1]);
    
    sortedGammes.forEach(([gamme, count]) => {
      const percentage = (count / recettes.length) * 100;
      console.log(`${gamme.padEnd(40)} ${count.toString().padStart(4)} (${percentage.toFixed(2)}%)`);
    });

    // 4. Familles sous-représentées
    console.log('\n\n📉 FAMILLES CHIMIQUES SOUS-REPRÉSENTÉES (< 3 molécules)');
    console.log('-'.repeat(80));
    
    const underrepresented = Object.entries(familyCount)
      .filter(([_, count]) => count < 3)
      .sort((a, b) => a[1] - b[1]);
    
    if (underrepresented.length > 0) {
      underrepresented.forEach(([family, count]) => {
        console.log(`${family.padEnd(40)} ${count} molécules`);
      });
      console.log(`\n📌 Total: ${underrepresented.length} familles sous-représentées`);
    } else {
      console.log('✅ Toutes les familles ont au moins 3 molécules');
    }

    // 5. Top 10 molécules les plus utilisées
    console.log('\n\n🔝 TOP 10 MOLÉCULES LES PLUS UTILISÉES');
    console.log('-'.repeat(80));
    
    const moleculeUsage = {};
    recettes.forEach(r => {
      if (r.molecules && Array.isArray(r.molecules)) {
        r.molecules.forEach(m => {
          if (m.name) {
            moleculeUsage[m.name] = (moleculeUsage[m.name] || 0) + 1;
          }
        });
      }
    });
    
    const topMolecules = Object.entries(moleculeUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    topMolecules.forEach(([name, count], i) => {
      const mol = molecules.find(m => m.name === name);
      const family = mol?.family || 'N/A';
      console.log(`${(i + 1).toString().padStart(2)}. ${name.padEnd(40)} [${family.padEnd(20)}] - ${count} recettes`);
    });

    // 6. Recettes sans molécules
    console.log('\n\n⚠️  RECETTES SANS MOLÉCULES ASSOCIÉES');
    console.log('-'.repeat(80));
    
    const orphanRecipes = recettes.filter(r => 
      !r.molecules || r.molecules.length === 0
    ).slice(0, 10);
    
    if (orphanRecipes.length > 0) {
      orphanRecipes.forEach(r => {
        console.log(`ID ${r.id.toString().padStart(3)}: ${r.name.padEnd(50)} [${r.gamme || 'N/A'}]`);
      });
    } else {
      console.log('✅ Toutes les recettes ont des molécules associées');
    }

    // 7. Gammes à enrichir
    console.log('\n\n📈 GAMMES À ENRICHIR (< 20 recettes)');
    console.log('-'.repeat(80));
    
    const gammesToEnrich = Object.entries(gammeCount)
      .filter(([_, count]) => count < 20)
      .sort((a, b) => a[1] - b[1]);
    
    if (gammesToEnrich.length > 0) {
      gammesToEnrich.forEach(([gamme, count]) => {
        const needed = 20 - count;
        console.log(`${gamme.padEnd(40)} ${count.toString().padStart(2)} recettes (besoin: +${needed})`);
      });
    } else {
      console.log('✅ Toutes les gammes ont au moins 20 recettes');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Analyse terminée');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Execute
analyzeDatabase();
