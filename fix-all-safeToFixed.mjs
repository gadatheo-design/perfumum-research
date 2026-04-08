import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Patterns to fix
const patterns = [
  // Pattern 1: safeToFixed(variable, number) -> variable.toFixed(number)
  {
    regex: /safeToFixed\(([^,]+),\s*(\d+)\)/g,
    replacement: '($1).toFixed($2)',
    description: 'safeToFixed(x, n) -> (x).toFixed(n)'
  },
  // Pattern 2: parseFloatsafeToFixed -> parseFloat().toFixed()
  {
    regex: /parseFloatsafeToFixed\(([^,]+),\s*(\d+)\)/g,
    replacement: 'parseFloat($1).toFixed($2)',
    description: 'parseFloatsafeToFixed(x, n) -> parseFloat(x).toFixed(n)'
  },
  // Pattern 3: safeToFixed on JSX expressions - remove it
  {
    regex: /safeToFixed\(\s*(<[^>]+>)/g,
    replacement: '$1',
    description: 'Remove safeToFixed from JSX'
  }
];

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (!filepath.includes('node_modules') && !filepath.includes('.next') && !filepath.includes('dist')) {
        walkDir(filepath, callback);
      }
    } else if ((filepath.endsWith('.tsx') || filepath.endsWith('.ts')) && !filepath.includes('.test.')) {
      callback(filepath);
    }
  });
}

let totalFixed = 0;
let filesModified = 0;

walkDir(path.join(__dirname, 'client/src'), (filepath) => {
  let content = fs.readFileSync(filepath, 'utf-8');
  let originalContent = content;
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      console.log(`  ${path.relative(__dirname, filepath)}: ${matches.length} matches for "${pattern.description}"`);
      totalFixed += matches.length;
      content = content.replace(pattern.regex, pattern.replacement);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf-8');
    filesModified++;
  }
});

console.log(`\n✅ Fixed ${totalFixed} safeToFixed calls in ${filesModified} files`);
