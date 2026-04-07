import fs from 'fs';
import path from 'path';

const files = {
  'server/chebi.ts': [
    { find: 'const chebiData = await response.json();', replace: 'const chebiData = (await response.json()) as { results?: Array<{chebiId: string}> };' },
    { find: 'const chebiId = chebiData.results[0]?.chebiId;', replace: 'const chebiId = chebiData.results?.[0]?.chebiId;' }
  ],
  'server/pubchem.ts': [
    { find: 'const data = await response.json();', replace: 'const data = (await response.json()) as { PC_Compounds?: Array<{id: {id: {cid: number}}; props?: Array<{urn: {label: string}; value: {sval: string}}> }> };' }
  ],
  'server/routers.ts': [
    { find: 'const data = await response.json();', replace: 'const data = (await response.json()) as { status?: string; results?: Array<{geometry: {location: {lat: number; lng: number}}}>};' }
  ],
  'server/routers/audit.ts': [
    { find: 'const db = await getDb();', replace: 'const db = await getDb();\n      if (!db) throw new Error("Database not available");' }
  ],
  'server/storage.ts': [
    { find: 'return (await response.json()).url;', replace: 'return ((await response.json()) as {url: string}).url;' },
    { find: 'function buildAuthHeaders(apiKey: string): HeadersInit {', replace: 'function buildAuthHeaders(apiKey: string): Record<string, string> {' },
    { find: 'const url = (await response.json()).url;', replace: 'const url = ((await response.json()) as {url: string}).url;' }
  ]
};

for (const [filePath, fixes] of Object.entries(files)) {
  const fullPath = path.join('/home/ubuntu/perfumum-research', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  for (const fix of fixes) {
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      modified = true;
      console.log(`✅ Fixed: ${filePath}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
  }
}

console.log('\n✅ All fixes applied!');
