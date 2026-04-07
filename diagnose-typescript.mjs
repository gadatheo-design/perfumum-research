#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client/src');

let problemFiles = [];
let okFiles = [];

function getTypeScriptFiles(dir) {
  const files = [];
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath);
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== '_core') {
          walk(fullPath);
        }
      } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files.sort();
}

function compileFile(filePath) {
  try {
    const relPath = path.relative(__dirname, filePath);
    console.log(`\n📝 Compiling: ${relPath}...`);
    
    // Créer un fichier tsconfig temporaire pour ce fichier
    const tempTsconfig = {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        jsx: "react-jsx",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: "bundler",
        allowSyntheticDefaultImports: true,
        noEmit: true
      },
      include: [filePath],
      exclude: ["node_modules"]
    };
    
    const tempTsconfigPath = path.join(__dirname, 'tsconfig.temp.json');
    fs.writeFileSync(tempTsconfigPath, JSON.stringify(tempTsconfig, null, 2));
    
    try {
      execSync(`npx tsc --project ${tempTsconfigPath} --noEmit`, {
        stdio: 'pipe',
        timeout: 5000,
        cwd: __dirname
      });
      
      console.log(`✅ OK: ${relPath}`);
      okFiles.push(relPath);
    } catch (error) {
      const output = error.stdout?.toString() || error.message;
      if (output.includes('Aborted') || output.includes('abort')) {
        console.log(`🔴 CRASH (abort/OOM): ${relPath}`);
        problemFiles.push({ file: relPath, type: 'CRASH', error: 'Abort signal 134' });
      } else {
        console.log(`⚠️  ERRORS: ${relPath}`);
        console.log(output.split('\n').slice(0, 3).join('\n'));
        problemFiles.push({ file: relPath, type: 'ERRORS', error: output.split('\n')[0] });
      }
    } finally {
      try {
        fs.unlinkSync(tempTsconfigPath);
      } catch {}
    }
  } catch (error) {
    console.error(`❌ Exception: ${error.message}`);
    problemFiles.push({ file: path.relative(__dirname, filePath), type: 'EXCEPTION', error: error.message });
  }
}

console.log('🔍 Starting TypeScript diagnostic...\n');
console.log('=' .repeat(60));

// Compiler les fichiers serveur d'abord (plus critiques)
console.log('\n📦 SERVER FILES:');
console.log('=' .repeat(60));
const serverFiles = getTypeScriptFiles(serverDir);
for (const file of serverFiles) {
  compileFile(file);
}

// Puis les fichiers client
console.log('\n\n🎨 CLIENT FILES:');
console.log('=' .repeat(60));
const clientFiles = getTypeScriptFiles(clientDir);
for (const file of clientFiles) {
  compileFile(file);
}

// Résumé
console.log('\n\n' + '=' .repeat(60));
console.log('📊 DIAGNOSTIC SUMMARY');
console.log('=' .repeat(60));
console.log(`✅ OK files: ${okFiles.length}`);
console.log(`⚠️  Problem files: ${problemFiles.length}`);

if (problemFiles.length > 0) {
  console.log('\n🔴 PROBLEM FILES:');
  problemFiles.forEach(p => {
    console.log(`  - ${p.file} (${p.type})`);
    if (p.error && p.error.length < 100) {
      console.log(`    → ${p.error}`);
    }
  });
  
  // Identifier les fichiers crash
  const crashFiles = problemFiles.filter(p => p.type === 'CRASH');
  if (crashFiles.length > 0) {
    console.log('\n🎯 CRASH FILES (likely culprits):');
    crashFiles.forEach(p => console.log(`  - ${p.file}`));
  }
}

console.log('\n✅ Diagnostic complete!');
