#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.join(__dirname, 'client/src');
let filesModified = 0;
let errorsFound = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDir(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(fullPath);
    }
  }
}

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let modified = false;

    // Pattern 1: x.safeToFixed(...) → safeToFixed(x, ...)
    const pattern1 = /(\w+)\.safeToFixed\(([^,]+),\s*(\d+)\)/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, (match, varName, param, decimals) => {
        console.log(`  [${path.relative(__dirname, filePath)}] Fixed: ${varName}.safeToFixed(${param}, ${decimals}) → safeToFixed(${varName}, ${decimals})`);
        modified = true;
        return `safeToFixed(${varName}, ${decimals})`;
      });
    }

    // Pattern 2: x.safeToFixed(...) with single param
    const pattern2 = /(\w+)\.safeToFixed\((\d+)\)/g;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, (match, varName, decimals) => {
        console.log(`  [${path.relative(__dirname, filePath)}] Fixed: ${varName}.safeToFixed(${decimals}) → safeToFixed(${varName}, ${decimals})`);
        modified = true;
        return `safeToFixed(${varName}, ${decimals})`;
      });
    }

    // Pattern 3: Check for safeToFixed usage without import
    if (content.includes('safeToFixed(') && !content.includes('import') && !content.includes('@ts-nocheck')) {
      if (!content.includes('import { safeToFixed }') && !content.includes('from "@/lib/utils"')) {
        // Add import at the top
        const importLine = 'import { safeToFixed } from "@/lib/utils";\n';
        if (!content.startsWith(importLine)) {
          content = importLine + content;
          console.log(`  [${path.relative(__dirname, filePath)}] Added import for safeToFixed`);
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      filesModified++;
      console.log(`✓ Fixed: ${path.relative(__dirname, filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    errorsFound++;
  }
}

console.log('🔧 Fixing safeToFixed calls...\n');
walkDir(clientDir);

console.log(`\n✅ Completed!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Errors: ${errorsFound}`);
