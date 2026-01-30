// Script d'import des références bibliographiques PERFUMUM
// Usage: node scripts/import-references.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lire le fichier BibTeX
const bibTexPath = path.join(__dirname, '../data/PERFUMUM_References_Master.bib');
const bibTexContent = fs.readFileSync(bibTexPath, 'utf-8');

// Parser BibTeX simple
function parseBibTeX(content) {
  const entries = [];
  const entryRegex = /@(\w+)\{([^,]+),\s*([\s\S]*?)(?=\n@|\n*$)/g;
  
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    const entryType = match[1].toLowerCase();
    const entryKey = match[2].trim();
    const fieldsStr = match[3];
    
    const entry = {
      entryType,
      entryKey,
      fields: {}
    };
    
    // Parser les champs
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(fieldsStr)) !== null) {
      const fieldName = fieldMatch[1].toLowerCase();
      const fieldValue = fieldMatch[2].trim();
      entry.fields[fieldName] = fieldValue;
    }
    
    entries.push(entry);
  }
  
  return entries;
}

// Mapper les axes de recherche depuis les notes
function mapAxisFromNote(note) {
  const axisMapping = {
    'Axe 1': 'AX1',
    'Axe 2': 'AX2', 
    'Axe 3': 'AX3',
    'Axe 4': 'AX4',
    'Axe C': 'AXC',
    'Axe J': 'AXJ',
    'Axe M': 'AXM',
    'Axe N': 'AXN',
    'resurrection': 'AX1',
    'structure': 'AX1',
    'génomique': 'AX1',
    'TPS': 'AX1',
    'terpene synthase': 'AX1',
    'ethnobotanique': 'AX2',
    'knowledge graph': 'AX2',
    'ethnopharmacology': 'AX2',
    'CSIA': 'AX3',
    'isotope': 'AX3',
    'fingerprinting': 'AX3',
    'cryopreservation': 'AX4',
    'conservation': 'AX4',
    'seed vault': 'AX4',
    'indoor': 'AXC',
    'wax melt': 'AXC',
    'oxidation': 'AXC',
    'VOC': 'AXC',
    'particle': 'AXC',
    'VR': 'AXJ',
    'olfactory display': 'AXJ',
    'virtual reality': 'AXJ',
    'cannabis': 'AXM',
    'Cannabis': 'AXM',
    'tabac': 'AXN',
    'tobacco': 'AXN',
    'Nicotiana': 'AXN',
  };
  
  if (!note) return [];
  
  const axes = new Set();
  for (const [keyword, axis] of Object.entries(axisMapping)) {
    if (note.toLowerCase().includes(keyword.toLowerCase())) {
      axes.add(axis);
    }
  }
  
  return Array.from(axes);
}

// Mapper le domaine de recherche
function mapDomain(entry) {
  const note = entry.fields.note || '';
  const title = entry.fields.title || '';
  const combined = (note + ' ' + title).toLowerCase();
  
  if (combined.includes('cannabis') || combined.includes('terpene synthase')) {
    return 'tabac_cannabis';
  }
  if (combined.includes('tobacco') || combined.includes('nicotiana')) {
    return 'tabac_cannabis';
  }
  if (combined.includes('ethnobotanique') || combined.includes('ethnopharmacology')) {
    return 'ethnobotanique';
  }
  if (combined.includes('cryopreservation') || combined.includes('conservation')) {
    return 'botanique';
  }
  if (combined.includes('olfactory') || combined.includes('receptor') || combined.includes('or51')) {
    return 'neurologie_olfactive';
  }
  if (combined.includes('voc') || combined.includes('indoor') || combined.includes('particle')) {
    return 'chimie_olfactive';
  }
  if (combined.includes('isotope') || combined.includes('gc-ms') || combined.includes('csia')) {
    return 'extraction';
  }
  if (combined.includes('vr') || combined.includes('virtual reality') || combined.includes('display')) {
    return 'methodologie';
  }
  if (combined.includes('biodiversity') || combined.includes('gbif') || combined.includes('iucn')) {
    return 'botanique';
  }
  
  return 'autre';
}

// Convertir une entrée BibTeX en format API
function convertEntry(entry) {
  const fields = entry.fields;
  
  return {
    entryKey: entry.entryKey,
    entryType: entry.entryType,
    title: fields.title || '',
    authors: fields.author || '',
    year: fields.year ? parseInt(fields.year) : null,
    journal: fields.journal || null,
    publisher: fields.publisher || null,
    volume: fields.volume || null,
    number: fields.number || null,
    pages: fields.pages || null,
    doi: fields.doi || null,
    url: fields.url || fields.howpublished?.replace(/\\url\{|\}/g, '') || null,
    abstract: fields.abstract || null,
    keywords: [],
    notes: fields.note || null,
    researchDomain: mapDomain(entry),
    readStatus: 'unread',
    suggestedAxes: mapAxisFromNote(fields.note),
  };
}

// Parser et convertir
const entries = parseBibTeX(bibTexContent);
const convertedEntries = entries.map(convertEntry);

// Afficher le résultat
console.log(`Parsed ${convertedEntries.length} entries from BibTeX file`);
console.log('');

// Grouper par axe suggéré
const byAxis = {};
for (const entry of convertedEntries) {
  for (const axis of entry.suggestedAxes) {
    if (!byAxis[axis]) byAxis[axis] = [];
    byAxis[axis].push(entry.entryKey);
  }
}

console.log('Entries by suggested axis:');
for (const [axis, keys] of Object.entries(byAxis)) {
  console.log(`  ${axis}: ${keys.length} entries`);
}
console.log('');

// Sauvegarder en JSON pour import via API
const outputPath = path.join(__dirname, '../data/references_to_import.json');
fs.writeFileSync(outputPath, JSON.stringify(convertedEntries, null, 2));
console.log(`Saved ${convertedEntries.length} entries to ${outputPath}`);

// Afficher quelques exemples
console.log('');
console.log('Sample entries:');
for (const entry of convertedEntries.slice(0, 3)) {
  console.log(`  - ${entry.entryKey}: ${entry.title.substring(0, 60)}...`);
  console.log(`    Domain: ${entry.researchDomain}, Axes: ${entry.suggestedAxes.join(', ')}`);
}
