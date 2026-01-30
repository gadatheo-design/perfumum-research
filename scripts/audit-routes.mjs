import fs from 'fs';
import path from 'path';

const appTsxPath = './client/src/App.tsx';
const pagesDir = './client/src/pages';

// Lire App.tsx
const appContent = fs.readFileSync(appTsxPath, 'utf-8');

// Extraire les routes
const routeRegex = /Route path="([^"]+)"/g;
const routes = [];
let match;
while ((match = routeRegex.exec(appContent)) !== null) {
  routes.push(match[1]);
}

// Extraire les imports de pages
const importRegex = /import\s+(\w+)\s+from\s+["']\.\/pages\/([^"']+)["']/g;
const imports = {};
while ((match = importRegex.exec(appContent)) !== null) {
  imports[match[1]] = match[2];
}

// Lister les fichiers de pages
const pageFiles = fs.readdirSync(pagesDir, { recursive: true })
  .filter(f => f.endsWith('.tsx'))
  .map(f => f.replace('.tsx', ''));

console.log('=== AUDIT DES ROUTES ===\n');
console.log(`Total routes: ${routes.length}`);
console.log(`Total imports: ${Object.keys(imports).length}`);
console.log(`Total page files: ${pageFiles.length}`);

// Vérifier les composants importés mais non utilisés dans les routes
const routeComponentRegex = /component=\{(\w+)\}/g;
const usedComponents = new Set();
while ((match = routeComponentRegex.exec(appContent)) !== null) {
  usedComponents.add(match[1]);
}

console.log('\n=== Imports potentiellement non utilisés ===');
let unusedCount = 0;
for (const [component, file] of Object.entries(imports)) {
  if (!usedComponents.has(component)) {
    console.log(`- ${component} (${file})`);
    unusedCount++;
  }
}
if (unusedCount === 0) console.log('Aucun import non utilisé détecté');

// Vérifier les routes dupliquées
console.log('\n=== Routes dupliquées ===');
const routeCounts = {};
routes.forEach(r => {
  routeCounts[r] = (routeCounts[r] || 0) + 1;
});
let dupCount = 0;
for (const [route, count] of Object.entries(routeCounts)) {
  if (count > 1) {
    console.log(`- ${route} (${count} fois)`);
    dupCount++;
  }
}
if (dupCount === 0) console.log('Aucune route dupliquée');

console.log('\n=== Routes dynamiques ===');
const dynamicRoutes = routes.filter(r => r.includes(':'));
dynamicRoutes.forEach(r => console.log(`- ${r}`));

console.log('\n=== Statistiques par section ===');
const sections = {};
routes.forEach(r => {
  const section = r.split('/')[1] || 'root';
  sections[section] = (sections[section] || 0) + 1;
});
Object.entries(sections)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([section, count]) => {
    console.log(`- /${section}: ${count} routes`);
  });
