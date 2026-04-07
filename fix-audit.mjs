import fs from 'fs';

let content = fs.readFileSync('server/routers/audit.ts', 'utf-8');

// Remplacer tous les "const db = await getDb();" par "const db = await getDb();\n      if (!db) throw new Error("Database not available");"
// Mais seulement s'il n'y a pas déjà la vérification
const lines = content.split('\n');
const fixed = [];

for (let i = 0; i < lines.length; i++) {
  fixed.push(lines[i]);
  
  if (lines[i].includes('const db = await getDb();')) {
    // Vérifier si la ligne suivante a déjà la vérification
    if (!lines[i + 1] || !lines[i + 1].includes('if (!db)')) {
      // Ajouter la vérification
      const indent = lines[i].match(/^\s*/)[0];
      fixed.push(`${indent}if (!db) throw new Error("Database not available");`);
    }
  }
}

content = fixed.join('\n');
fs.writeFileSync('server/routers/audit.ts', content, 'utf-8');
console.log('✅ Fixed all getDb() calls in audit.ts');
