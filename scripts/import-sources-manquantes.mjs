#!/usr/bin/env node
/**
 * Script d'import des sources bibliographiques manquantes
 * Identifiées lors de l'audit du 07 janvier 2026
 */

import { createConnection } from 'mysql2/promise';
import { randomUUID } from 'crypto';

const sources = [
  // Phénoménologie et philosophie
  {
    entryKey: 'merleau-ponty-1945',
    entryType: 'book',
    title: 'Phénoménologie de la perception',
    authors: 'Maurice Merleau-Ponty',
    year: 1945,
    publisher: 'Gallimard',
    researchDomain: 'neurologie_olfactive',
    abstract: 'Ouvrage fondateur de la phénoménologie de la perception, explorant comment le corps propre constitue notre accès au monde sensible.',
    keywords: JSON.stringify(['phénoménologie', 'perception', 'corps', 'sensorialité']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'bohme-2016',
    entryType: 'book',
    title: 'The Aesthetics of Atmospheres',
    authors: 'Gernot Böhme',
    year: 2016,
    publisher: 'Routledge',
    researchDomain: 'neurologie_olfactive',
    abstract: 'Théorie des atmosphères comme qualités sensibles produites par la présence des objets dans l\'espace.',
    keywords: JSON.stringify(['atmosphères', 'esthétique', 'espace', 'perception']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'bohme-2017',
    entryType: 'book',
    title: 'Atmospheric Architectures: The Aesthetics of Felt Spaces',
    authors: 'Gernot Böhme',
    year: 2017,
    publisher: 'Bloomsbury',
    researchDomain: 'neurologie_olfactive',
    abstract: 'Application de la théorie des atmosphères à l\'architecture et aux espaces vécus.',
    keywords: JSON.stringify(['architecture', 'atmosphères', 'espaces', 'design']),
    readStatus: 'to_read'
  },
  
  // Chimie et parfumerie
  {
    entryKey: 'guenther-1948',
    entryType: 'book',
    title: 'The Essential Oils (6 volumes)',
    authors: 'Ernest Guenther',
    year: 1948,
    publisher: 'Van Nostrand',
    researchDomain: 'chimie_olfactive',
    abstract: 'Encyclopédie exhaustive des huiles essentielles, leur chimie, extraction et applications.',
    keywords: JSON.stringify(['huiles essentielles', 'chimie', 'extraction', 'encyclopédie']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'bauer-2001',
    entryType: 'book',
    title: 'Common Fragrance and Flavor Materials: Preparation, Properties and Uses',
    authors: 'Kurt Bauer, Dorothea Garbe, Horst Surburg',
    year: 2001,
    publisher: 'Wiley-VCH',
    researchDomain: 'chimie_olfactive',
    abstract: 'Manuel de référence sur les matériaux de parfumerie et d\'aromatique alimentaire.',
    keywords: JSON.stringify(['parfumerie', 'arômes', 'chimie', 'matières premières']),
    readStatus: 'to_read'
  },
  
  // Art olfactif
  {
    entryKey: 'tolaas-2006',
    entryType: 'article',
    title: 'The City and the Smell',
    authors: 'Sissel Tolaas',
    year: 2006,
    journal: 'Urban Studies',
    researchDomain: 'histoire_parfumerie',
    abstract: 'Exploration artistique des odeurs urbaines et leur rôle dans l\'identité des villes.',
    keywords: JSON.stringify(['art olfactif', 'ville', 'odeurs', 'installation']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'verbeek-2020',
    entryType: 'article',
    title: 'Inhaling History: Olfactory Heritage and Museums',
    authors: 'Caro Verbeek',
    year: 2020,
    journal: 'Museum Management and Curatorship',
    researchDomain: 'histoire_parfumerie',
    abstract: 'Étude sur l\'intégration des odeurs dans les pratiques muséales et la préservation du patrimoine olfactif.',
    keywords: JSON.stringify(['muséologie', 'patrimoine olfactif', 'histoire', 'conservation']),
    readStatus: 'to_read'
  },
  
  // Méthodologie parfumerie
  {
    entryKey: 'carles-1961',
    entryType: 'article',
    title: 'A Method of Creation in Perfumery',
    authors: 'Jean Carles',
    year: 1961,
    journal: 'Soap, Perfumery & Cosmetics',
    researchDomain: 'formulation',
    abstract: 'Présentation de la méthode systématique de formation olfactive et de création parfumée.',
    keywords: JSON.stringify(['méthode', 'formation', 'création', 'parfumerie']),
    readStatus: 'read'
  },
  {
    entryKey: 'roudnitska-1991',
    entryType: 'book',
    title: 'Le Parfum',
    authors: 'Edmond Roudnitska',
    year: 1991,
    publisher: 'Presses Universitaires de France',
    researchDomain: 'formulation',
    abstract: 'Réflexion philosophique et technique sur l\'art de la parfumerie par un maître parfumeur.',
    keywords: JSON.stringify(['parfumerie', 'art', 'esthétique', 'création']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'ellena-2007',
    entryType: 'book',
    title: 'Le Parfum',
    authors: 'Jean-Claude Ellena',
    year: 2007,
    publisher: 'Presses Universitaires de France',
    researchDomain: 'formulation',
    abstract: 'Témoignage et réflexions d\'un parfumeur contemporain sur son art.',
    keywords: JSON.stringify(['parfumerie', 'création', 'art', 'témoignage']),
    readStatus: 'to_read'
  },
  
  // Anthropologie sensorielle
  {
    entryKey: 'howes-2003',
    entryType: 'book',
    title: 'Sensual Relations: Engaging the Senses in Culture and Social Theory',
    authors: 'David Howes',
    year: 2003,
    publisher: 'University of Michigan Press',
    researchDomain: 'ethnobotanique',
    abstract: 'Étude anthropologique des sens et de leur rôle dans les cultures humaines.',
    keywords: JSON.stringify(['anthropologie', 'sens', 'culture', 'perception']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'classen-1994',
    entryType: 'book',
    title: 'Aroma: The Cultural History of Smell',
    authors: 'Constance Classen, David Howes, Anthony Synnott',
    year: 1994,
    publisher: 'Routledge',
    researchDomain: 'histoire_parfumerie',
    abstract: 'Histoire culturelle de l\'odorat à travers les civilisations.',
    keywords: JSON.stringify(['histoire', 'odorat', 'culture', 'anthropologie']),
    readStatus: 'to_read'
  },
  {
    entryKey: 'corbin-1982',
    entryType: 'book',
    title: 'Le Miasme et la Jonquille: L\'odorat et l\'imaginaire social XVIIIe-XIXe siècles',
    authors: 'Alain Corbin',
    year: 1982,
    publisher: 'Aubier Montaigne',
    researchDomain: 'histoire_parfumerie',
    abstract: 'Étude historique de l\'évolution de la perception des odeurs en France.',
    keywords: JSON.stringify(['histoire', 'odorat', 'société', 'hygiène']),
    readStatus: 'to_read'
  }
];

async function importSources() {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  console.log('Connexion à la base de données établie');
  
  let imported = 0;
  let skipped = 0;

  for (const source of sources) {
    try {
      // Vérifier si la source existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM bibliography_entries WHERE entry_key = ?',
        [source.entryKey]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Source existante: ${source.entryKey}`);
        skipped++;
        continue;
      }

      // Insérer la nouvelle source
      const id = randomUUID();
      await connection.execute(
        `INSERT INTO bibliography_entries 
         (id, entry_key, entry_type, title, authors, year, publisher, journal, 
          research_domain, abstract, keywords, read_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id,
          source.entryKey,
          source.entryType,
          source.title,
          source.authors,
          source.year,
          source.publisher || null,
          source.journal || null,
          source.researchDomain,
          source.abstract,
          source.keywords,
          source.readStatus
        ]
      );

      console.log(`✅ Importé: ${source.title} (${source.authors}, ${source.year})`);
      imported++;
    } catch (error) {
      console.error(`❌ Erreur pour ${source.entryKey}:`, error.message);
    }
  }

  console.log(`\\n📊 Résumé: ${imported} sources importées, ${skipped} sources existantes`);
  
  await connection.end();
}

importSources().catch(console.error);
