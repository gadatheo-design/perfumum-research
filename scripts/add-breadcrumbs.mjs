import fs from 'fs';
import path from 'path';

// Pages qui ne doivent PAS avoir de breadcrumbs
const excludePages = [
  'Home.tsx',
  'NotFound.tsx',
  'TestMinimal.tsx',
  'ComponentShowcase.tsx',
  'Recherche.tsx', // Page désactivée
  'Projet.tsx', // Page dupliquée
];

// Pages admin (breadcrumbs optionnels)
const adminPages = [
  'Admin.tsx',
  'AdminImportExport.tsx',
  'AdminMoleculeNew.tsx',
  'AdminMolecules.tsx',
  'AdminRecettes.tsx',
];

const pagesDir = '/home/ubuntu/perfumum-research/client/src/pages';

// Lire tous les fichiers .tsx
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let modified = 0;
let skipped = 0;

for (const file of files) {
  // Skip excluded pages
  if (excludePages.includes(file)) {
    console.log(`⏭️  Skipping ${file} (excluded)`);
    skipped++;
    continue;
  }
  
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has Breadcrumbs
  if (content.includes('Breadcrumbs')) {
    console.log(`✅ ${file} already has Breadcrumbs`);
    continue;
  }
  
  // Check if it has Header import
  const hasHeader = content.includes('import { Header }') || content.includes('import {Header}');
  const hasFooter = content.includes('import { Footer }') || content.includes('import {Footer}');
  
  if (!hasHeader && !hasFooter) {
    console.log(`⚠️  ${file} has no Header/Footer - skipping`);
    skipped++;
    continue;
  }
  
  // Add Breadcrumbs import
  if (hasHeader) {
    // Add after Header import
    content = content.replace(
      /import \{ Header \} from ["']@\/components\/layout\/Header["'];/,
      `import { Header } from "@/components/layout/Header";\nimport { Breadcrumbs } from "@/components/Breadcrumbs";`
    );
  } else if (hasFooter) {
    // Add after Footer import
    content = content.replace(
      /import \{ Footer \} from ["']@\/components\/layout\/Footer["'];/,
      `import { Footer } from "@/components/layout/Footer";\nimport { Breadcrumbs } from "@/components/Breadcrumbs";`
    );
  }
  
  // Add <Breadcrumbs /> before <Header /> or at the start of the component
  if (content.includes('<Header />') || content.includes('<Header/>')) {
    content = content.replace(
      /<Header\s*\/>/,
      '<Breadcrumbs />\n      <Header />'
    );
  } else if (content.includes('<Header>')) {
    content = content.replace(
      /<Header>/,
      '<Breadcrumbs />\n      <Header>'
    );
  } else {
    // Try to add after opening div
    content = content.replace(
      /return \(\s*\n\s*<div className="min-h-screen/,
      `return (\n    <div className="min-h-screen`
    );
    content = content.replace(
      /<div className="min-h-screen[^>]*>/,
      (match) => `${match}\n      <Breadcrumbs />`
    );
  }
  
  // Write back
  fs.writeFileSync(filePath, content);
  console.log(`✏️  Modified ${file}`);
  modified++;
}

console.log(`\n📊 Summary: ${modified} modified, ${skipped} skipped`);
