import fs from 'fs';

const appContent = fs.readFileSync('./client/src/App.tsx', 'utf-8');

// Extraire toutes les routes
const routeRegex = /Route path="([^"]+)"/g;
const routes = new Set();
let match;
while ((match = routeRegex.exec(appContent)) !== null) {
  routes.add(match[1]);
}

// Liens à vérifier (les plus courants)
const linksToCheck = [
  '/', '/molecules', '/recettes', '/leaf-economies', '/gammes',
  '/methodologie/absorbe', '/prototypes', '/plant-terroir-linking',
  '/ghost-varieties-explorer', '/terroirs', '/sourcing', '/resines-cbd',
  '/methode', '/matieres-premieres', '/plants', '/compare-radar',
  '/civilisations', '/admin', '/varietes', '/terp-profiles',
  '/suggestions-synergies', '/plant-molecule-linking', '/graphe-terroir-plante-molecule',
  '/synergies-heatmap', '/sankey-flow', '/recherche-scientifique',
  '/methodologie/gc-ms', '/graphe-molecules-recettes', '/gammes/petrichor',
  '/galerie', '/axes-recherche', '/accords', '/timeline-botanique',
  '/timeline', '/san-andres/leaf-economies', '/recherche', '/projets',
  '/contribuer', '/contact', '/bibliographie-globale', '/archives-terrain',
  '/ifra', '/heritage-conservation', '/h2-linking', '/matrice-synergies',
  '/interactions-tabac-cannabis'
];

console.log('=== VÉRIFICATION DES LIENS ===\n');
console.log('Liens valides:');
const validLinks = linksToCheck.filter(link => routes.has(link));
validLinks.forEach(l => console.log(`  ✓ ${l}`));

console.log('\nLiens potentiellement morts:');
const deadLinks = linksToCheck.filter(link => !routes.has(link));
deadLinks.forEach(l => console.log(`  ✗ ${l}`));

console.log(`\nRésumé: ${validLinks.length} valides, ${deadLinks.length} potentiellement morts`);
