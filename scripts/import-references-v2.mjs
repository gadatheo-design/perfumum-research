/**
 * PERFUMUM - Import References Master Pack v2
 * 
 * Ce script importe :
 * 1. Les 6 axes de recherche (Axe 1 à Axe 6)
 * 2. Les 37 références bibliographiques
 * 3. Les liens entre références et axes
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Configuration de la base de données
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

// Parser l'URL de la base de données
function parseDbUrl(url) {
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

// Définition des 6 axes de recherche
const researchAxes = [
  {
    axisCode: 'AX1',
    name: 'Génomique olfactive & conservation ex-situ',
    subtitle: 'Récepteurs olfactifs, cryobanques et archives génétiques',
    description: `Cet axe explore les fondements moléculaires de la perception olfactive à travers l'étude des récepteurs olfactifs humains (OR) et leur interaction avec les molécules odorantes. Il intègre également les technologies de conservation ex-situ (cryobanques, herbiers numériques) pour préserver la diversité génétique des plantes aromatiques.`,
    objectives: JSON.stringify([
      'Comprendre les mécanismes moléculaires de la perception olfactive',
      'Cartographier les récepteurs olfactifs humains et leurs ligands',
      'Développer des méthodes de conservation génétique non-destructives',
      'Créer des archives vivantes de la diversité olfactive végétale'
    ]),
    methodology: 'Analyse structurale cryo-EM, barcoding ADN, extraction non-destructive, bases de données GBIF/iNaturalist/Pl@ntNet',
    status: 'actif',
    category: 'fondamental',
    priority: 'haute',
    color: '#4CAF50',
    icon: '🧬'
  },
  {
    axisCode: 'AX2',
    name: 'Ethnobotanique computationnelle',
    subtitle: 'Knowledge graphs et NLP pour les savoirs traditionnels',
    description: `Cet axe développe des outils computationnels pour structurer et analyser les savoirs ethnobotaniques. Il combine les graphes de connaissances (knowledge graphs), le traitement automatique du langage naturel (NLP) et l'intelligence artificielle générative pour extraire, organiser et valoriser les connaissances traditionnelles sur les plantes aromatiques.`,
    objectives: JSON.stringify([
      'Construire un graphe de connaissances des matières premières olfactives',
      'Développer des outils NLP pour l\'extraction d\'entités botaniques',
      'Intégrer les savoirs traditionnels dans des formats structurés',
      'Créer des ponts entre chimie, ethnobotanique et perception'
    ]),
    methodology: 'Knowledge graphs (ENPKG), NLP biomédicaux, extraction d\'entités/relations, IA générative',
    status: 'actif',
    category: 'methodologique',
    priority: 'haute',
    color: '#2196F3',
    icon: '🌿'
  },
  {
    axisCode: 'AX3',
    name: 'Chimie analytique comparative trans-époques',
    subtitle: 'Bases de données moléculaires et prédiction olfactive',
    description: `Cet axe se concentre sur l'analyse chimique des molécules odorantes et leur cartographie perceptive. Il intègre les bases de données de référence (Pyrfume, Flavornet, SuperScent), les modèles prédictifs structure-odeur et les standards industriels (IFRA) pour créer un catalogue moléculaire unifié.`,
    objectives: JSON.stringify([
      'Créer un catalogue moléculaire PERFUMUM unifié',
      'Développer des modèles prédictifs structure-odeur',
      'Cartographier l\'espace olfactif (Principal Odor Map)',
      'Normaliser les descripteurs olfactifs'
    ]),
    methodology: 'GC-MS, bases de données (Pyrfume, Flavornet, TGSC), GNN, modèles DREAM challenge',
    status: 'actif',
    category: 'analytique',
    priority: 'haute',
    color: '#FF9800',
    icon: '⚗️'
  },
  {
    axisCode: 'AX4',
    name: 'Biotechnologies de conservation & fermentation',
    subtitle: 'Biosynthèse et production durable de molécules aromatiques',
    description: `Cet axe explore les biotechnologies pour la production durable de molécules aromatiques rares ou menacées. Il couvre la biosynthèse en levures (sclareol, ambrein, patchoulol), les voies métaboliques alternatives et les stratégies de conservation ex-situ par fermentation.`,
    objectives: JSON.stringify([
      'Développer des voies de biosynthèse pour molécules rares',
      'Réduire la pression sur les ressources naturelles',
      'Créer des alternatives durables aux extractions traditionnelles',
      'Explorer les co-cultures et voies métaboliques mixtes'
    ]),
    methodology: 'Ingénierie métabolique, levures (S. cerevisiae, R. toruloides), fermentation, co-culture',
    status: 'actif',
    category: 'applique',
    priority: 'moyenne',
    color: '#9C27B0',
    icon: '🧫'
  },
  {
    axisCode: 'AX5',
    name: 'Technologies immersives & démocratisation',
    subtitle: 'VR olfactive et dispositifs de diffusion',
    description: `Cet axe développe les technologies de diffusion olfactive pour les environnements immersifs (VR/AR). Il étudie les contraintes techniques (latence, mélange, contamination), les dispositifs existants et les workflows d'intégration pour démocratiser l'expérience olfactive.`,
    objectives: JSON.stringify([
      'Évaluer les dispositifs de diffusion olfactive pour VR',
      'Développer des workflows d\'intégration odeur-VR',
      'Créer des expériences olfactives immersives',
      'Démocratiser l\'accès aux patrimoines olfactifs'
    ]),
    methodology: 'Revue systématique des olfactory displays, tests utilisateurs, intégration Unity/Unreal',
    status: 'actif',
    category: 'experimental',
    priority: 'moyenne',
    color: '#00BCD4',
    icon: '🎮'
  },
  {
    axisCode: 'AX6',
    name: 'Chimie de l\'espace (indoor) & pratiques domestiques',
    subtitle: 'Émissions, réactions et oxydation dans les espaces intérieurs',
    description: `Cet axe étudie la chimie des odeurs dans les espaces intérieurs : sources d'émission, réactions air/surfaces, formation de particules et impact des pratiques domestiques (bougies, wax melts, produits corporels). Il explore le concept de "human oxidation field" et ses implications pour la parfumerie d'ambiance.`,
    objectives: JSON.stringify([
      'Comprendre les réactions chimiques indoor',
      'Évaluer l\'impact des pratiques domestiques sur la qualité de l\'air',
      'Développer des protocoles de diffusion responsables',
      'Explorer le concept de "chimie de l\'espace"'
    ]),
    methodology: 'Mesures en temps réel, test houses, facteurs d\'émission, modélisation indoor',
    status: 'actif',
    category: 'applique',
    priority: 'moyenne',
    color: '#795548',
    icon: '🏠'
  }
];

// Parser le fichier CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const entries = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Parser CSV avec gestion des guillemets
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= headers.length) {
      const entry = {};
      headers.forEach((h, idx) => {
        entry[h] = values[idx] || '';
      });
      entries.push(entry);
    }
  }
  
  return entries;
}

// Extraire le numéro d'axe depuis le nom complet
function extractAxisNumber(axisName) {
  const match = axisName.match(/Axe\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

// Convertir le type de source CSV vers le type de la base
function mapEntryType(type) {
  const mapping = {
    'article': 'article',
    'site': 'online',
    'book': 'book',
    'thesis': 'thesis',
    'report': 'techreport',
    'dataset': 'misc',
    'standard': 'manual'
  };
  return mapping[type.toLowerCase()] || 'misc';
}

// Générer une clé BibTeX unique
function generateEntryKey(entry) {
  const firstAuthor = (entry.authors || 'unknown').split(/[,&]/)[0].trim().split(' ').pop() || 'unknown';
  const year = entry.year || '2024';
  const titleWord = (entry.title || 'untitled').split(' ').find(w => w.length > 4) || 'ref';
  return `${firstAuthor.toLowerCase()}${year}${titleWord.toLowerCase().replace(/[^a-z]/g, '')}`.substring(0, 50);
}

async function main() {
  console.log('🚀 Import des références PERFUMUM v2...\n');
  
  // Connexion à la base de données
  const dbConfig = parseDbUrl(DATABASE_URL);
  const connection = await mysql.createConnection({
    ...dbConfig,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('✅ Connexion à la base de données établie\n');
  
  try {
    // 1. Créer les axes de recherche
    console.log('📊 Création des axes de recherche...');
    const axisIdMap = {};
    
    for (const axis of researchAxes) {
      // Vérifier si l'axe existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM research_axes WHERE axis_code = ?',
        [axis.axisCode]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  Axe ${axis.axisCode} existe déjà (ID: ${existing[0].id})`);
        axisIdMap[axis.axisCode] = existing[0].id;
      } else {
        const [result] = await connection.execute(
          `INSERT INTO research_axes (axis_code, name, subtitle, description, objectives, methodology, status, category, priority, color, icon, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            axis.axisCode,
            axis.name,
            axis.subtitle,
            axis.description,
            axis.objectives,
            axis.methodology,
            axis.status,
            axis.category,
            axis.priority,
            axis.color,
            axis.icon
          ]
        );
        axisIdMap[axis.axisCode] = result.insertId;
        console.log(`  ✅ Axe ${axis.axisCode} créé (ID: ${result.insertId})`);
      }
    }
    
    console.log(`\n📚 Import des références bibliographiques...`);
    
    // Lire le fichier CSV
    const csvPath = '/home/ubuntu/temp_references/PERFUMUM_References_Master_v2.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const references = parseCSV(csvContent);
    
    console.log(`  📄 ${references.length} références trouvées dans le CSV\n`);
    
    let importedCount = 0;
    let skippedCount = 0;
    let linkedCount = 0;
    
    for (const ref of references) {
      const entryKey = generateEntryKey(ref);
      
      // Vérifier si la référence existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM bibliography_entries WHERE entry_key = ?',
        [entryKey]
      );
      
      let bibliographyId;
      
      if (existing.length > 0) {
        bibliographyId = existing[0].id;
        skippedCount++;
        console.log(`  ⏭️  ${ref.id}: "${ref.title.substring(0, 50)}..." existe déjà`);
      } else {
        // Créer la référence
        const entryType = mapEntryType(ref.type);
        const year = ref.year && !isNaN(parseInt(ref.year)) ? parseInt(ref.year) : null;
        
        const [result] = await connection.execute(
          `INSERT INTO bibliography_entries 
           (entry_key, entry_type, title, authors, year, journal, doi, url, abstract, research_domain, read_status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            entryKey,
            entryType,
            ref.title,
            ref.authors || null,
            year,
            ref.venue || null,
            ref.doi && ref.doi !== '(voir article)' ? ref.doi : null,
            ref.url || null,
            ref.notes || null,
            'chimie_olfactive', // Domaine par défaut
            'unread'
          ]
        );
        
        bibliographyId = result.insertId;
        importedCount++;
        console.log(`  ✅ ${ref.id}: "${ref.title.substring(0, 50)}..." importé`);
      }
      
      // Créer le lien avec l'axe
      const axisNumber = extractAxisNumber(ref.axis);
      if (axisNumber && axisIdMap[`AX${axisNumber}`]) {
        const axisId = axisIdMap[`AX${axisNumber}`];
        
        // Vérifier si le lien existe déjà
        const [existingLink] = await connection.execute(
          'SELECT id FROM bibliography_axis_links WHERE bibliography_id = ? AND axis_id = ?',
          [bibliographyId, axisId]
        );
        
        if (existingLink.length === 0) {
          await connection.execute(
            `INSERT INTO bibliography_axis_links (bibliography_id, axis_id, relevance, created_at)
             VALUES (?, ?, ?, NOW())`,
            [bibliographyId, axisId, 'primaire']
          );
          linkedCount++;
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE L\'IMPORT');
    console.log('='.repeat(60));
    console.log(`  Axes créés/existants: ${Object.keys(axisIdMap).length}`);
    console.log(`  Références importées: ${importedCount}`);
    console.log(`  Références existantes: ${skippedCount}`);
    console.log(`  Liens axe-référence créés: ${linkedCount}`);
    console.log('='.repeat(60));
    
  } finally {
    await connection.end();
    console.log('\n✅ Import terminé avec succès!');
  }
}

main().catch(console.error);
