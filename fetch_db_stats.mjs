// Fetch database stats via HTTP API
const baseUrl = 'http://localhost:3000';

async function fetchStats() {
  try {
    // Get molecules by family
    const moleculesRes = await fetch(`${baseUrl}/api/trpc/molecules.list`);
    const moleculesData = await moleculesRes.json();
    
    // Get recipes
    const recipesRes = await fetch(`${baseUrl}/api/trpc/recettes.list`);
    const recipesData = await recipesRes.json();
    
    console.log('Molecules:', moleculesData.result?.data?.length || 0);
    console.log('Recipes:', recipesData.result?.data?.length || 0);
    
    // Analyze families
    if (moleculesData.result?.data) {
      const families = {};
      moleculesData.result.data.forEach(m => {
        if (m.family) {
          families[m.family] = (families[m.family] || 0) + 1;
        }
      });
      
      console.log('\nTop 10 families:');
      Object.entries(families)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([family, count]) => {
          console.log(`  ${family}: ${count}`);
        });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchStats();
