import fs from 'fs';
import path from 'path';

const appContent = fs.readFileSync('./client/src/App.tsx', 'utf-8');
const pagesDir = './client/src/pages';

// Extraire tous les imports de pages
const importRegex = /from\s+["']@?\.?\/?pages\/([^"']+)["']/g;
const importedPages = new Set();
let match;
while ((match = importRegex.exec(appContent)) !== null) {
  importedPages.add(match[1].replace('.tsx', '').replace(/\//g, '/'));
}

// Lister tous les fichiers de pages
const getAllFiles = (dir, basePath = '') => {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath, relativePath));
    } else if (item.endsWith('.tsx')) {
      files.push(relativePath.replace('.tsx', ''));
    }
  }
  return files;
};

const allPages = getAllFiles(pagesDir);

console.log('=== FICHIERS DE PAGES NON IMPORTÉS ===\n');
const unusedPages = allPages.filter(page => {
  // Vérifier si le fichier est importé (avec ou sans extension)
  const pageName = page.split('/').pop();
  const pageWithPath = page;
  return !importedPages.has(pageName) && !importedPages.has(pageWithPath);
});

if (unusedPages.length === 0) {
  console.log('Tous les fichiers de pages sont importés!');
} else {
  unusedPages.forEach(p => console.log(`  - ${p}`));
  console.log(`\nTotal: ${unusedPages.length} fichiers potentiellement non utilisés`);
}
