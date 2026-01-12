import fs from 'fs';

const appContent = fs.readFileSync('./client/src/App.tsx', 'utf-8');

// Extraire toutes les routes
const routeRegex = /Route path="([^"]+)"/g;
const routes = new Set();
let match;
while ((match = routeRegex.exec(appContent)) !== null) {
  routes.add(match[1]);
}

// Lire tous les liens
const allLinks = fs.readFileSync('/tmp/all_links.txt', 'utf-8').trim().split('\n');

// Filtrer les liens internes (pas les liens externes ou dynamiques)
const internalLinks = allLinks.filter(l => 
  l.startsWith('/') && 
  !l.includes('${') && 
  !l.includes('{') &&
  !l.includes(':')
);

console.log('=== LIENS MORTS DÉTECTÉS ===\n');
const deadLinks = internalLinks.filter(link => !routes.has(link));
if (deadLinks.length === 0) {
  console.log('Aucun lien mort détecté!');
} else {
  deadLinks.forEach(l => console.log(`  ✗ ${l}`));
}
console.log(`\nTotal: ${internalLinks.length} liens internes, ${deadLinks.length} potentiellement morts`);
